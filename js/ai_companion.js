// Mesin Teman Ngobrol AI Live (BYOK: Gemini / OpenAI / OpenRouter / Groq) + Fallback Lokal Cerdas.
// API Key hanya disimpan di localStorage browser pengguna dan tidak pernah dikirim ke server lain.

const AI_CFG_KEY = 'meja_malam_ai_cfg_v1';

export const AI_PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    defaultModel: 'gemini-2.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  openrouter: {
    label: 'OpenRouter',
    defaultModel: 'google/gemini-2.5-flash',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions'
  },
  groq: {
    label: 'Groq',
    defaultModel: 'llama-3.3-70b-versatile',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  }
};

export function loadAiConfig() {
  try {
    const raw = localStorage.getItem(AI_CFG_KEY);
    if (!raw) return { provider: 'gemini', apiKey: '', model: 'gemini-2.5-flash', customUrl: '' };
    const parsed = JSON.parse(raw);
    return {
      provider: parsed.provider || 'gemini',
      apiKey: (parsed.apiKey || '').trim(),
      model: (parsed.model || AI_PROVIDERS[parsed.provider || 'gemini']?.defaultModel || 'gemini-2.5-flash').trim(),
      customUrl: (parsed.customUrl || '').trim()
    };
  } catch {
    return { provider: 'gemini', apiKey: '', model: 'gemini-2.5-flash', customUrl: '' };
  }
}

export function saveAiConfig(cfg) {
  try {
    localStorage.setItem(
      AI_CFG_KEY,
      JSON.stringify({
        provider: cfg.provider || 'gemini',
        apiKey: (cfg.apiKey || '').trim(),
        model: (cfg.model || '').trim(),
        customUrl: (cfg.customUrl || '').trim()
      })
    );
  } catch {
    // Abaikan jika penyimpanan dibatasi
  }
}

export function hasLiveAiKey() {
  return Boolean(loadAiConfig().apiKey);
}

function buildArkaSystemPrompt({ save, activeCase, teaBlend }) {
  const memories = (save.memoryNotes || []).slice(-10);
  const memBlock = memories.length ? `Hal yang pernah dibahas sebelumnya:\n- ${memories.join('\n- ')}` : 'Belum ada catatan ingatan lama.';
  const teaText = teaBlend ? `${teaBlend.name} (${teaBlend.vibe})` : 'teh hangat biasa';
  const caseText = activeCase
    ? `Tamu malam ini: ${activeCase.visitor.name} (${activeCase.visitor.role}), membawa berkas "${activeCase.dossier.title}".`
    : 'Ruangan sedang tenang tanpa tamu baru.';

  return [
    'Kamu adalah Arka, rekan duduk tetap di sebuah ruang baca dan kedai teh malam hujan bernama Meja Malam.',
    `Kamu sedang mengobrol dengan @${save.username} (Malam ke-${save.night || 1}).`,
    `Di meja ada ${teaText}. ${caseText}`,
    memBlock,
    '',
    'Gaya bicaramu:',
    '- Bahasa Indonesia yang tenang, bersih, natural, dan setara (pakai "aku" dan "kamu").',
    '- Jangan pernah bersikap seperti asisten bot, jangan menjilat ("Pertanyaan bagus!"), jangan berceramah panjang lebar.',
    '- Jangan memakai emoji, jangan memakai tanda pisah panjang (em dash), dan hindari istilah klise.',
    '- Jawab singkat dan hidup (2 sampai 4 kalimat, kecuali pengguna meminta penjelasan mendalam).',
    '- Berani menyanggah dengan sopan jika ada celah logika, lalu ajukan satu pertanyaan balik yang membuat obrolan terus mengalir.',
    '- Kamu fasih membahas sastra klasik (Orwell, Austen, Sherlock, Pramoedya), keamanan siber dan berita teknologi, bahasa Korea (sertakan Hangul jika relevan), diksi KBBI, sejarah, maupun sekadar mendengarkan cerita hari yang melelahkan.'
  ].join('\n');
}

function sanitizeReply(text) {
  return String(text || '')
    .replace(/\u2014/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function askArka({ message, save, activeCase, teaBlend }) {
  const cfg = loadAiConfig();

  if (!cfg.apiKey) {
    return {
      ok: true,
      live: false,
      reply: buildLocalReply(message, save, activeCase, teaBlend)
    };
  }

  const systemPrompt = buildArkaSystemPrompt({ save, activeCase, teaBlend });
  const recent = (save.chatHistory || []).slice(-12);

  try {
    if (cfg.provider === 'gemini') {
      const model = cfg.model || AI_PROVIDERS.gemini.defaultModel;
      const url = `${AI_PROVIDERS.gemini.endpoint}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
      const contents = recent
        .filter((m) => m.role === 'user' || m.role === 'arka')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.8, maxOutputTokens: 360 }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = data?.error?.message || `HTTP ${res.status}`;
        throw new Error(errMsg);
      }
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
      if (!text) throw new Error('Respon kosong dari Gemini.');
      return { ok: true, live: true, reply: sanitizeReply(text) };
    }

    // OpenAI / OpenRouter / Groq / Custom OpenAI-compatible
    const base = cfg.customUrl || AI_PROVIDERS[cfg.provider]?.endpoint || AI_PROVIDERS.openai.endpoint;
    const model = cfg.model || AI_PROVIDERS[cfg.provider]?.defaultModel || 'gpt-4o-mini';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recent
        .filter((m) => m.role === 'user' || m.role === 'arka')
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: message }
    ];

    const res = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.8, max_tokens: 360 })
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(errMsg);
    }
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Respon kosong dari model.');
    return { ok: true, live: true, reply: sanitizeReply(text) };
  } catch (err) {
    return {
      ok: false,
      live: false,
      error: err.message || 'Gagal terhubung ke API AI.',
      reply: `${buildLocalReply(message, save, activeCase, teaBlend)} (Koneksi AI gagal: ${err.message || 'cek API key di Koneksi AI'}.)`
    };
  }
}

// Opsional: buat Berkas Deduksi baru dari topik apa pun memakai AI Live!
export async function generateLiveAiCase(topic, save) {
  const cfg = loadAiConfig();
  if (!cfg.apiKey) {
    throw new Error('Pasang API Key di menu Koneksi AI lebih dulu untuk membuat berkas dari topik bebas.');
  }

  const prompt = [
    `Buatkan 1 berkas deduksi malam berbahasa Indonesia yang bersih (tanpa emoji, tanpa em dash) tentang topik: "${topic}".`,
    'Format WAJIB JSON murni tanpa markdown code fence, persis mengikuti skema ini:',
    '{',
    '  "visitorName": "nama natural 1 kata",',
    '  "visitorRole": "peran singkat",',
    '  "opening": "1-2 kalimat pembuka natural saat masuk ruang baca hujan, sebut keinginan teh hangat/tenang/fokus",',
    '  "desiredTeaTag": "hangat | tenang | fokus",',
    '  "title": "judul berkas singkat",',
    '  "docType": "jenis dokumen (misal: Kliping, Memo, Transkrip, Log)",',
    '  "hint": "1 kalimat singkat arahan memeriksa dokumen",',
    '  "segments": [',
    '    {"id": "s1", "text": "kalimat konteks wajar", "flawed": false},',
    '    {"id": "s2", "text": "kalimat bermasalah atau petunjuk kunci", "flawed": true, "clue": "penjelasan singkat 1 kalimat"},',
    '    {"id": "s3", "text": "kalimat konteks wajar", "flawed": false},',
    '    {"id": "s4", "text": "kalimat bermasalah kedua atau fakta kunci", "flawed": true, "clue": "penjelasan singkat 1 kalimat"}',
    '  ],',
    '  "template": ["Awal kalimat ", " tengah ", " akhir."],',
    '  "answers": ["jawaban slot 1", "jawaban slot 2"],',
    '  "distractors": ["pengecoh 1", "pengecoh 2"],',
    '  "arkaDebrief": "2 kalimat komentar Arka + 1 pertanyaan pemantik obrolan"',
    '}'
  ].join('\n');

  let rawText = '';
  if (cfg.provider === 'gemini') {
    const model = cfg.model || AI_PROVIDERS.gemini.defaultModel;
    const url = `${AI_PROVIDERS.gemini.endpoint}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
    rawText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  } else {
    const base = cfg.customUrl || AI_PROVIDERS[cfg.provider]?.endpoint || AI_PROVIDERS.openai.endpoint;
    const model = cfg.model || AI_PROVIDERS[cfg.provider]?.defaultModel || 'gpt-4o-mini';
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
    rawText = data?.choices?.[0]?.message?.content || '';
  }

  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  const flawedIds = (parsed.segments || []).filter((s) => s.flawed).map((s) => s.id);
  const answers = Array.isArray(parsed.answers) ? parsed.answers.slice(0, 2) : ['temuan utama', 'kesimpulan'];
  const distractors = Array.isArray(parsed.distractors) ? parsed.distractors.slice(0, 2) : ['opsi lain 1', 'opsi lain 2'];
  const chips = [...answers, ...distractors].sort(() => Math.random() - 0.5);

  return {
    id: `ai-case-${Date.now()}`,
    night: save.night || 1,
    isAiGenerated: true,
    visitor: {
      name: parsed.visitorName || 'Tamu',
      role: parsed.visitorRole || 'Pengunjung Malam',
      opening: sanitizeReply(parsed.opening || `Malam. Aku membawa catatan tentang ${topic}.`),
      desiredTeaTag: parsed.desiredTeaTag || 'hangat',
      desiredBookId: 'book_lit',
      teaMatchReply: 'Hangat dan pas sekali dengan hujan malam ini.',
      bookMatchReply: 'Referensi ini membantu melihat konteksnya lebih jernih.'
    },
    dossier: {
      title: sanitizeReply(parsed.title || `Berkas: ${topic}`),
      docType: sanitizeReply(parsed.docType || 'Berkas AI'),
      hint: sanitizeReply(parsed.hint || 'Tandai bagian kunci di teks lalu lengkapi kesimpulannya.'),
      segments: parsed.segments || [],
      requiredFlaws: flawedIds.length ? flawedIds : ['s2'],
      deduction: {
        template:
          Array.isArray(parsed.template) && parsed.template.length === answers.length + 1
            ? parsed.template.map(sanitizeReply)
            : ['Berkas ini menyoroti ', ' yang berdampak pada ', '.'],
        slots: answers.map((a, idx) => ({ answer: sanitizeReply(a), label: `poin ${idx + 1}` })),
        chips: chips.map(sanitizeReply)
      }
    },
    arkaDebrief: sanitizeReply(parsed.arkaDebrief || 'Topik yang menarik. Bagian mana yang paling bikin kamu berpikir ulang?')
  };
}

// Catat topik singkat agar Arka punya ingatan lintas malam
export function maybeRecordMemory(save, userText) {
  const clean = (userText || '').trim();
  if (clean.length < 18) return;
  const interesting = /(suka|lagi|capek|lelah|baca|buku|orwell|korea|siber|kerja|kuliah|pikir|bingung|senang|hujan|nulis)/i.test(clean);
  if (!interesting) return;
  if (!Array.isArray(save.memoryNotes)) save.memoryNotes = [];
  const snippet = clean.length > 90 ? `${clean.slice(0, 87)}...` : clean;
  if (!save.memoryNotes.includes(snippet)) {
    save.memoryNotes.push(snippet);
    if (save.memoryNotes.length > 12) save.memoryNotes.shift();
  }
}

function buildLocalReply(rawMsg, save, activeCase, teaBlend) {
  const m = (rawMsg || '').toLowerCase();

  if (/(capek|lelah|penat|pusing|sedih|berat|stres|burnout)/.test(m)) {
    return `Duduk dulu sebentar, tidak perlu buru-buru menyimpulkan apa-apa malam ini. ${teaBlend ? `Minum ${teaBlend.name}-nya selagi hangat.` : 'Seduh teh hangat dulu kalau mau.'} Bagian mana dari harimu yang paling menguras tenaga?`;
  }
  if (/(orwell|1984|animal farm|austen|sherlock|buku|novel|sastra)/.test(m)) {
    return 'Yang membuat sastra lama seperti Orwell atau Austen tetap terasa dekat bukan latarnya, tapi betapa manusia masih mengulang pola bahasa dan prasangka yang sama. Dari buku yang pernah kamu baca, karakter mana yang cara berpikirnya paling menempel di kepalamu?';
  }
  if (/(korea|hangul|seoul|bahasa)/.test(m)) {
    return 'Di bahasa Korea, satu akhiran kalimat saja bisa langsung menunjukkan jarak sosial antara dua orang, misalnya sopan lewat -yo atau -hamnida. Kamu sedang tertarik belajar percakapan sehari-hari atau bacaan tulisan Hangulnya?';
  }
  if (/(siber|cyber|hack|ai|scada|phishing|berita|teknologi|keamanan)/.test(m)) {
    return 'Masalah paling menarik di keamanan siber sekarang sering bukan di celah teknisnya, tapi di bagaimana manusia terlalu cepat percaya pada pesan yang terdengar meyakinkan. Menurutmu, kebiasaan digital apa yang paling susah diubah orang?';
  }
  if (/(berkas|kasus|petunjuk|hint|bingung|clue|tamu)/.test(m)) {
    if (activeCase) {
      return `Untuk berkas "${activeCase.dossier.title}", coba baca ulang kalimat yang terasa melompat atau memakai istilah terlalu halus. Kamu juga bisa buka Rak Buku di pojok kanan atas sebagai pembanding.`;
    }
    return 'Saat ini belum ada berkas terbuka. Kamu bisa buka Berkas Malam di kiri bawah, atau kita ngobrol bebas saja dulu.';
  }
  if (/(teh|minum|hujan|malam|cuaca)/.test(m)) {
    return `${teaBlend ? `${teaBlend.name} malam ini aromanya pas sekali dengan hujan di luar.` : 'Hujan seperti ini paling enak ditemani teh jahe atau melati.'} Kamu biasanya lebih suka malam yang sepi begini untuk baca, atau malah kepikiran banyak hal?`;
  }
  if (/(halo|hai|malam|pagi|siang|sore|apa kabar)/.test(m)) {
    return `Malam, @${save.username}. Meja sudah siap dan hujan baru turun di luar. Mau langsung membedah berkas tamu malam ini, atau ngobrol dulu soal apa yang lagi ada di kepalamu?`;
  }

  const thoughtful = [
    'Sudut pandang yang menarik. Tapi kalau kita balik sedikit pertanyaannya: asumsi tersembunyi apa yang sebenarnya mendasari pandangan itu?',
    'Aku menangkap maksudmu. Kadang hal yang terasa sederhana di permukaan justru menyimpan detail kecil kalau dilihat lebih pelan. Bagian mana yang paling membuatmu ragu atau penasaran?',
    'Menarik kalau dipikir lebih jauh. Kalau kamu pasang API Key di menu Koneksi AI di kanan atas, kita bisa bahas topik ini sedalam apa pun secara live. Untuk sekarang, coba ceritakan versi lengkapnya menurutmu.'
  ];
  return thoughtful[(save.chatHistory?.length || 0) % thoughtful.length];
}
