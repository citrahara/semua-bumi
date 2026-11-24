// UI Prolog Buku Kronik Vintage 1894, Panggung Stand-Up Comedy, Komisi Harian, dan Menara Kronik Abadi (Endless!)

import {
  VINTAGE_PROLOGUE,
  STANDUP_SETS,
  generateEndlessOpenMicPrompt,
  buildDailyCommissions
} from './data/standup.js';
import { ENEMIES } from './data/enemies.js';
import { generateMathQuestion } from './data/math.js';
import { FACTS_BANK } from './data/facts.js';
import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { renderCharacterSVG, CAST } from './characters.js';
import { audio } from './audio.js';
import { detectKeywords } from './speech.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ==========================================
// 1. PROLOG STORYLINE VINTAGE 1894
// ==========================================
export function openVintagePrologue({ overlayRoot, playerName, onDone }) {
  let idx = 0;

  function render() {
    const page = VINTAGE_PROLOGUE[idx];
    const sp = CAST[page.speaker] || CAST.jaja;
    const isLast = idx >= VINTAGE_PROLOGUE.length - 1;

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="vintage-book">
          <div class="vintage-top-row">
            <span class="vintage-year">${escapeHtml(page.year)}</span>
            <button class="vintage-skip" id="btn-pro-skip" type="button">Lewati Prolog</button>
          </div>
          <div class="vintage-body">
            <div class="portrait-box" style="width:86px; height:86px; border:2px solid #8c5a2b;">${renderCharacterSVG(page.speaker, 'happy')}</div>
            <div>
              <div class="vintage-chapter">${escapeHtml(page.title)}</div>
              <p class="vintage-quote">"${escapeHtml(page.text)}"</p>
              <div class="vintage-aside">${escapeHtml(page.aside)}</div>
            </div>
          </div>
          <div class="vintage-footer">
            <span style="font-size:0.8rem; color:#6d4c30; font-weight:700;">Halaman Prolog ${idx + 1} / ${VINTAGE_PROLOGUE.length} · Pembaca: @${escapeHtml(playerName)}</span>
            <button class="rpg-btn primary" id="btn-pro-next" type="button">
              ${isLast ? 'Buka Sampul & Masuk Peta Buku 3D!' : 'Balik Halaman Berikutnya'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-pro-skip')?.addEventListener('click', () => {
      audio.playClick();
      if (onDone) onDone();
    });
    document.getElementById('btn-pro-next')?.addEventListener('click', () => {
      audio.playClick();
      if (!isLast) {
        idx += 1;
        render();
      } else if (onDone) {
        audio.playRimshot();
        onDone();
      }
    });
  }

  render();
}

// ==========================================
// 2. PANGGUNG STAND-UP COMEDY VINTAGE (OPEN-MIC TANPA BATAS!)
// ==========================================
export function openStandUpStage({ overlayRoot, save, mic, onComplete, onClose }) {
  let mode = 'menu'; // menu | bit | openmic | bit_result
  let activeSet = null;
  let beatIdx = 0;
  let laughScore = 0;
  let crowdBubble = 'Lampu minyak menyala... seisi kedai tahun 1894 menunggu kalimat pertamamu!';
  let locked = false;

  // Open-Mic Endless generator state
  let micPrompt = generateEndlessOpenMicPrompt();
  let micTab = 'type'; // mic | type
  let micPhase = 'ready'; // ready | recording | review
  let timeLeft = 30;
  let timerId = null;
  let audioUrl = null;
  let transcript = '';
  let typed = '';
  let manualHits = [false, false];

  function stopMicTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (mic && mic.isRecording) {
      mic.stop().catch(() => {});
    }
  }

  function render() {
    if (mode === 'menu') {
      overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="vintage-book" style="max-width:740px;">
            <div class="vintage-top-row">
              <span class="vintage-year">SALON SATIR & OPEN-MIC 1894 · REPUTASI KOMIKA: ${save.comedyFame || 0}</span>
              <button class="vintage-skip" id="btn-su-close" type="button">Turun Panggung</button>
            </div>
            <h2 style="margin:0 0 6px; font-family:var(--font-display); font-size:1.7rem; color:#2b1b12;">
              Salon Satir & Stand-Up Comedy 1894
            </h2>
            <p style="margin:0 0 16px; font-size:0.9rem; color:#5a3e28;">
              Latih keluwesan ngomong, ironi kering, <em>timing</em> komedi, dan selipkan wawasan keren di depan hadirin abad ke-19! Pilih rakit bit Stand-Up (Setup, Twist, Punchline) atau coba Generator Open-Mic tanpa batas.
            </p>

            <div class="standup-grid">
              ${STANDUP_SETS.map(
                (s) => `
                <button class="standup-card" data-pick-set="${s.id}" type="button">
                  <span class="vintage-tag">${escapeHtml(s.eraTag)}</span>
                  <strong>${escapeHtml(s.title)}</strong>
                  <span>3 Ketukan: Setup · Twist · Punchline</span>
                </button>
              `
              ).join('')}
            </div>

            <div class="vintage-footer" style="margin-top:16px;">
              <button class="rpg-btn primary" id="btn-su-endless" type="button">Mode Open-Mic Spontan (Premis Acak Tanpa Batas!)</button>
              <span style="font-size:0.8rem; color:#6d4c30; font-weight:700;">Bisa pakai Mikrofon atau Ketik Kilat</span>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-su-close')?.addEventListener('click', () => {
        stopMicTimer();
        onClose();
      });
      document.querySelectorAll('[data-pick-set]').forEach((b) => {
        b.addEventListener('click', () => {
          audio.playDialogueOpen();
          activeSet = STANDUP_SETS.find((x) => x.id === b.dataset.pickSet);
          beatIdx = 0;
          laughScore = 0;
          locked = false;
          crowdBubble = 'Lampu salon meredup. Hadirin menanti kalimat pembukamu.';
          mode = 'bit';
          render();
        });
      });
      document.getElementById('btn-su-endless')?.addEventListener('click', () => {
        audio.playDialogueOpen();
        micPrompt = generateEndlessOpenMicPrompt();
        micPhase = 'ready';
        timeLeft = 30;
        typed = '';
        transcript = '';
        manualHits = [false, false];
        mode = 'openmic';
        render();
      });
      return;
    }

    if (mode === 'bit' && activeSet) {
      const step = activeSet.steps[beatIdx];
      const laughPct = Math.min(100, laughScore);
      overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="vintage-book" style="max-width:740px;">
            <div class="vintage-top-row">
              <span class="vintage-year">${escapeHtml(activeSet.title)} · ${escapeHtml(step.beat)}</span>
              <button class="vintage-skip" id="btn-su-back" type="button">Kembali</button>
            </div>

            <div class="laugh-meter-wrap">
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#3b2314; margin-bottom:4px;">
                <span>RESPONS SALON 1894</span>
                <span>${laughPct}%</span>
              </div>
              <div class="laugh-track"><div class="laugh-fill" style="width:${laughPct}%"></div></div>
              <div class="crowd-vintage-bubble">${escapeHtml(crowdBubble)}</div>
            </div>

            <p style="margin:12px 0; font-weight:800; color:#2b1b12; font-size:1rem;">${escapeHtml(step.prompt)}</p>

            <div class="choice-grid">
              ${step.options
                .map(
                  (opt, idx) => `
                <button class="vintage-choice" data-bit-opt="${idx}" type="button" ${locked ? 'disabled' : ''}>
                  <span class="choice-badge" style="background:#3b2314; color:#ffd166;">${['A', 'B', 'C'][idx]}</span>
                  <span>${escapeHtml(opt.line)}</span>
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-su-back')?.addEventListener('click', () => {
        mode = 'menu';
        render();
      });
      document.querySelectorAll('[data-bit-opt]').forEach((b) => {
        b.addEventListener('click', () => {
          if (locked) return;
          locked = true;
          const opt = step.options[Number(b.dataset.bitOpt)];
          laughScore = Math.min(100, laughScore + opt.laugh);
          crowdBubble = opt.crowd;
          if (opt.best) audio.playRimshot();
          else audio.playWrong();

          setTimeout(() => {
            locked = false;
            if (beatIdx < activeSet.steps.length - 1) {
              beatIdx += 1;
              render();
            } else {
              mode = 'bit_result';
              audio.playVictory();
              render();
            }
          }, 950);
          render();
        });
      });
      return;
    }

    if (mode === 'bit_result') {
      const stars = laughScore >= 90 ? 5 : laughScore >= 70 ? 4 : laughScore >= 45 ? 3 : 2;
      const rank = stars >= 5 ? 'Komika Legendaris 1894!' : stars >= 4 ? 'Bintang Open-Mic Kedai!' : 'Komika Pemula Berbakat!';
      const xp = 60 + stars * 18;
      const coins = 40 + stars * 12;
      overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="vintage-book" style="max-width:560px; text-align:center;">
            <div class="vintage-year">PENAMPILAN STAND-UP SELESAI!</div>
            <h2 style="margin:8px 0; font-family:var(--font-display); font-size:1.85rem; color:#2b1b12;">${rank}</h2>
            <div style="font-size:1.6rem; color:#c86419; margin-bottom:8px;">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)} · Laugh-O-Meter ${laughScore}%</div>
            <div class="crowd-vintage-bubble" style="margin-bottom:16px;">${escapeHtml(crowdBubble)}</div>
            <p style="margin:0 0 18px; font-weight:800; color:#5a3e28;">Hadiah: +${xp} XP · +${coins} Koin · +${stars * 10} Reputasi Komika</p>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
              <button class="rpg-btn primary" id="btn-su-claim" type="button">Klaim Hadiah & Kembali ke Alam 3D</button>
              <button class="vintage-skip" id="btn-su-another" type="button">Pilih Bit Lain</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById('btn-su-claim')?.addEventListener('click', () => {
        onComplete({ xp, coins, fame: stars * 10 });
      });
      document.getElementById('btn-su-another')?.addEventListener('click', () => {
        mode = 'menu';
        render();
      });
      return;
    }

    // Mode Open-Mic Spontan Endless!
    const kwStatus = detectKeywords(micTab === 'mic' ? transcript : typed, micPrompt.keywords);
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="vintage-book" style="max-width:700px;">
          <div class="vintage-top-row">
            <span class="vintage-year">OPEN-MIC SPONTAN TANPA BATAS</span>
            <button class="vintage-skip" id="btn-om-back" type="button">Kembali</button>
          </div>
          <h3 style="margin:0 0 6px; font-family:var(--font-display); font-size:1.4rem; color:#2b1b12;">
            Premis Acak: ${escapeHtml(micPrompt.title)}
          </h3>
          <p style="margin:0 0 12px; font-size:0.86rem; color:#5a3e28;">${escapeHtml(micPrompt.factSpark)}</p>

          <div class="kw-row">
            ${kwStatus
              .map((kw, i) => {
                const hit = micPhase === 'review' ? manualHits[i] : kw.matched;
                return `
                  <div class="kw-pill ${hit ? 'hit' : ''}" id="om-kw-${i}" style="border-color:#6d4c30; background:${hit ? '#d1fae5' : '#f3e5cc'}; color:#2b1b12;">
                    <strong style="text-transform:uppercase;">${escapeHtml(kw.word)}</strong>
                    <div style="font-size:0.75rem; color:#5a3e28;">${escapeHtml(kw.hint)}</div>
                  </div>
                `;
              })
              .join('')}
            <button class="vintage-skip" id="btn-om-reroll" type="button" style="align-self:center;">Acak Premis Baru</button>
          </div>

          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="filter-chip ${micTab === 'type' ? 'active' : ''}" id="om-tab-type" type="button">Ketik Bit Stand-Up</button>
            <button class="filter-chip ${micTab === 'mic' ? 'active' : ''}" id="om-tab-mic" type="button">Pakai Mikrofon (30 dtk)</button>
          </div>

          ${
            micTab === 'type'
              ? `
                <textarea class="rpg-textarea" id="om-ta" style="background:#fffdf7; color:#2b1b12; border-color:#b89468;" placeholder="Tulis bit Stand-Up lucumu di sini (selipkan '${escapeHtml(micPrompt.keywords[0].word)}' dan '${escapeHtml(micPrompt.keywords[1].word)}')...">${escapeHtml(typed)}</textarea>
                <button class="rpg-btn primary" id="btn-om-submit" type="button">Lempar Punchline ke Penonton!</button>
              `
              : renderOpenMicAudio()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-om-back')?.addEventListener('click', () => {
      stopMicTimer();
      mode = 'menu';
      render();
    });
    document.getElementById('btn-om-reroll')?.addEventListener('click', () => {
      stopMicTimer();
      micPrompt = generateEndlessOpenMicPrompt();
      typed = '';
      transcript = '';
      micPhase = 'ready';
      render();
    });
    document.getElementById('om-tab-type')?.addEventListener('click', () => {
      stopMicTimer();
      micTab = 'type';
      render();
    });
    document.getElementById('om-tab-mic')?.addEventListener('click', () => {
      micTab = 'mic';
      render();
    });

    if (micTab === 'type') {
      const ta = document.getElementById('om-ta');
      const sync = (e) => {
        typed = e.target.value;
        detectKeywords(typed, micPrompt.keywords).forEach((kw, i) => {
          const el = document.getElementById(`om-kw-${i}`);
          if (el) {
            el.classList.toggle('hit', kw.matched);
            el.style.background = kw.matched ? '#d1fae5' : '#f3e5cc';
          }
        });
      };
      ta?.addEventListener('input', sync);
      ta?.addEventListener('change', sync);
      document.getElementById('btn-om-submit')?.addEventListener('click', () => {
        if (typed.trim().length < 18) return;
        const hits = detectKeywords(typed, micPrompt.keywords).filter((k) => k.matched).length;
        laughScore = 55 + hits * 22;
        crowdBubble = hits === 2 ? '"BA-DUM-TSS! Dua kata sakti masuk, penonton ngakak keras!"' : '"Penonton ketawa hangat! Tambah satu kata sakti lagi biar makin pecah!"';
        audio.playRimshot();
        mode = 'bit_result';
        render();
      });
    } else {
      document.getElementById('om-mic-start')?.addEventListener('click', async () => {
        audio.playMicCue(true);
        micPhase = 'recording';
        timeLeft = 30;
        transcript = '';
        render();
        const canvas = document.getElementById('om-wave');
        const ok = await mic.start({
          canvas,
          onTranscript: (t) => {
            transcript = t;
            const b = document.getElementById('om-tr');
            if (b) b.textContent = t || 'Mendengarkan...';
            detectKeywords(t, micPrompt.keywords).forEach((kw, i) => {
              const el = document.getElementById(`om-kw-${i}`);
              if (el) el.style.background = kw.matched ? '#d1fae5' : '#f3e5cc';
            });
          },
          onError: () => {
            micTab = 'type';
            micPhase = 'ready';
            render();
          }
        });
        if (ok) {
          timerId = setInterval(() => {
            timeLeft = Math.max(0, timeLeft - 1);
            const el = document.getElementById('om-t');
            if (el) el.textContent = `${timeLeft} dtk`;
            if (timeLeft <= 0) finishMic();
          }, 1000);
        }
      });
      document.getElementById('om-mic-stop')?.addEventListener('click', finishMic);
      document.getElementById('btn-om-submit')?.addEventListener('click', () => {
        const hits = manualHits.filter(Boolean).length;
        laughScore = 60 + hits * 20;
        crowdBubble = '"Tepuk tangan meriah di kedai tahun 1894! Intonasi panggungmu makin keren!"';
        audio.playRimshot();
        mode = 'bit_result';
        render();
      });
      micPrompt.keywords.forEach((_, i) => {
        document.getElementById(`om-chk-${i}`)?.addEventListener('change', (e) => {
          manualHits[i] = e.target.checked;
        });
      });
    }
  }

  async function finishMic() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    audio.playMicCue(false);
    const res = await mic.stop();
    audioUrl = res.audioUrl;
    transcript = res.transcript;
    manualHits = detectKeywords(transcript, micPrompt.keywords).map((k) => k.matched);
    micPhase = 'review';
    render();
  }

  function renderOpenMicAudio() {
    if (micPhase === 'ready') {
      return `<div style="text-align:center; padding:14px; background:#2b1b12; color:#fbf6ec; border-radius:14px;">
        <div style="font-size:1.7rem; font-weight:800; color:#ffd166;">30 dtk</div>
        <p style="font-size:0.84rem; color:#d8c4aa;">Suaramu direkam lokal di browser agar bisa diputar ulang buat evaluasi gaya Stand-Up.</p>
        <button class="rpg-btn primary" id="om-mic-start" type="button">Nyalakan Mikrofon Open-Mic</button>
      </div>`;
    }
    if (micPhase === 'recording') {
      return `<div style="text-align:center; padding:14px; background:#2b1b12; color:#fbf6ec; border-radius:14px;">
        <div id="om-t" style="font-size:1.7rem; font-weight:800; color:#ffd166;">${timeLeft} dtk</div>
        <canvas class="wave-canvas" id="om-wave" width="400" height="58"></canvas>
        <button class="rpg-btn primary" id="om-mic-stop" type="button">Selesai Tampil</button>
        <div id="om-tr" style="margin-top:8px; font-size:0.82rem;">${escapeHtml(transcript || 'Silakan sampaikan bit Stand-Up kamu!')}</div>
      </div>`;
    }
    return `<div style="text-align:center; padding:14px; background:#2b1b12; color:#fbf6ec; border-radius:14px;">
      <p style="margin:0 0 8px; color:#ffd166; font-weight:800;">Dengarkan ulang aksi Open-Mic kamu:</p>
      ${audioUrl ? `<audio controls src="${audioUrl}" style="width:100%; max-width:380px;"></audio>` : ''}
      <div style="display:flex; justify-content:center; gap:10px; margin:10px 0;">
        ${micPrompt.keywords
          .map(
            (kw, i) => `<label class="filter-chip active"><input type="checkbox" id="om-chk-${i}" ${manualHits[i] ? 'checked' : ''} /> ${escapeHtml(kw.word)}</label>`
          )
          .join('')}
      </div>
      <button class="rpg-btn gold" id="btn-om-submit" type="button">Hitung Laugh-O-Meter!</button>
    </div>`;
  }

  render();
}

// ==========================================
// 3. MENARA KRONIK ABADI (ENDLESS FLOOR 1 -> ∞)
// ==========================================
export function openEndlessTowerModal({ overlayRoot, save, onStartFloorCombat, onFloorCleared, onClose }) {
  const floor = (save.towerFloor || 0) + 1;
  const isCombatFloor = floor % 2 === 1;

  // Lantai Ganjil: Duel Siber Berevolusi! Lantai Genap: Ujian Kilat Campuran (Matematika + Bahasa + Fakta)
  if (isCombatFloor) {
    const baseEnemy = ENEMIES[(floor - 1) % ENEMIES.length];
    const scale = 1 + Math.floor((floor - 1) / 2) * 0.2;
    const scaledEnemy = {
      ...baseEnemy,
      id: `tower_f${floor}_${baseEnemy.id}`,
      name: `${baseEnemy.name} (Lantai ${floor})`,
      title: `Menara Kronik Abadi · Lantai ${floor}`,
      maxHp: Math.round(baseEnemy.maxHp * scale),
      atkMin: Math.round(baseEnemy.atkMin * scale),
      atkMax: Math.round(baseEnemy.atkMax * scale),
      ultDamage: Math.round(baseEnemy.ultDamage * scale),
      xpReward: 75 + floor * 15,
      coinReward: 50 + floor * 10
    };

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:540px; text-align:center;">
          <div class="title-kicker">MENARA KRONIK ABADI · TANPA BATAS LANTAI</div>
          <h2 style="margin:4px 0 8px; font-family:var(--font-display); font-size:1.8rem; color:var(--gold);">Lantai ${floor} · Duel Siber</h2>
          <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">
            Rekor tertinggimu: Lantai ${save.towerFloor || 0}. Penjaga lantai ini adalah <strong style="color:#ff8a8a;">${escapeHtml(scaledEnemy.name)}</strong> (HP ${scaledEnemy.maxHp})!
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button class="rpg-btn primary" id="btn-tw-fight" type="button">Tantang Lantai ${floor} (Attack & Defense)</button>
            <button class="rpg-btn ghost" id="btn-tw-close" type="button">Keluar Menara</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('btn-tw-close')?.addEventListener('click', onClose);
    document.getElementById('btn-tw-fight')?.addEventListener('click', () => {
      onStartFloorCombat(scaledEnemy, floor);
    });
    return;
  }

  // Lantai Genap: 2 Tantangan Campuran (1 Matematika Dinamis + 1 Diksi/Logika/Fakta)
  const mathLvl = ((Math.floor(floor / 2) - 1) % 5) + 1;
  const mathQ = generateMathQuestion(mathLvl, floor);
  const dictQ = DICTION_BANK[Math.floor(Math.random() * DICTION_BANK.length)];
  const steps = [
    {
      tag: `Lantai ${floor} · 1/2 Matematika (${mathQ.tag})`,
      q: mathQ.question,
      options: mathQ.choices.map((c) => ({ label: c.label, ok: c.correct })),
      explain: mathQ.explain
    },
    {
      tag: `Lantai ${floor} · 2/2 Bahasa & Diksi (${dictQ.term})`,
      q: dictQ.prompt,
      options: [...dictQ.options].sort(() => Math.random() - 0.5).map((o) => ({ label: o.text, ok: o.correct })),
      explain: `${dictQ.meaning} ${dictQ.usage}`
    }
  ];

  let sIdx = 0;
  let fb = null;

  function renderEven() {
    const cur = steps[sIdx];
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:600px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
              <div class="title-kicker">MENARA KRONIK ABADI · LANTAI ${floor}</div>
              <h2 style="margin:0; font-family:var(--font-display); font-size:1.45rem; color:var(--gold);">Ujian Penjaga Lantai</h2>
            </div>
            <button class="rpg-btn ghost" id="btn-tw-close" type="button" style="padding:7px 12px;">Keluar</button>
          </div>
          <div class="math-q-box">
            <span class="math-tag">${escapeHtml(cur.tag)}</span>
            <p class="math-q-text">${escapeHtml(cur.q)}</p>
          </div>
          <div class="choice-grid">
            ${cur.options
              .map(
                (o, i) => `
              <button class="rpg-choice ${fb ? (o.ok ? 'ok' : fb.picked === i ? 'bad' : '') : ''}" data-tw-opt="${i}" type="button" ${fb ? 'disabled' : ''}>
                <span class="choice-badge">${['A', 'B', 'C', 'D'][i]}</span>
                <span>${escapeHtml(o.label)}</span>
              </button>
            `
              )
              .join('')}
          </div>
          ${
            fb
              ? `
            <div class="insight-box"><p><strong>${fb.ok ? 'Tepat!' : 'Kurang tepat!'}</strong> ${escapeHtml(cur.explain)}</p></div>
            <div style="margin-top:12px; text-align:right;">
              <button class="rpg-btn gold" id="btn-tw-next" type="button">
                ${!fb.ok ? 'Coba Lagi Lantai Ini' : sIdx >= steps.length - 1 ? `Naik ke Lantai ${floor + 1}!` : 'Lanjut Soal 2/2'}
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    document.getElementById('btn-tw-close')?.addEventListener('click', onClose);
    document.querySelectorAll('[data-tw-opt]').forEach((b) => {
      b.addEventListener('click', () => {
        const i = Number(b.dataset.twOpt);
        const ok = cur.options[i].ok;
        if (ok) audio.playCorrect();
        else audio.playWrong();
        fb = { ok, picked: i };
        renderEven();
      });
    });
    document.getElementById('btn-tw-next')?.addEventListener('click', () => {
      if (!fb.ok) {
        openEndlessTowerModal({ overlayRoot, save, onStartFloorCombat, onFloorCleared, onClose });
        return;
      }
      if (sIdx < steps.length - 1) {
        sIdx += 1;
        fb = null;
        renderEven();
      } else {
        onFloorCleared(floor, 80 + floor * 15, 55 + floor * 10);
      }
    });
  }

  renderEven();
}

// ==========================================
// 4. PANEL KOMISI HARIAN (DAILY COMMISSIONS WIB) & ASCENSION
// ==========================================
export function openDailyCommissionsModal({ overlayRoot, save, onClaimBonus, onAscend, onClose }) {
  const list = buildDailyCommissions(save.dailyState?.date);
  const doneIds = save.dailyState?.completed || [];
  const allDone = list.every((c) => doneIds.includes(c.id));
  const claimed = Boolean(save.dailyState?.bonusClaimed);
  const canAscend = save.solvedGates.length >= 5 && save.completedNpcs.includes('maestro');

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal" style="max-width:640px;">
        <div class="panel-head">
          <div>
            <div class="title-kicker">MISI HARIAN (WIB) · STREAK ${save.dailyStreak || 0} HARI · ERA DUNIA ${save.worldTier || 1}</div>
            <h2>Papan Komisi Tanpa Batas</h2>
          </div>
          <button class="rpg-btn ghost" id="btn-dc-close" type="button" style="padding:8px 14px;">Tutup</button>
        </div>
        <p style="margin:0 0 14px; font-size:0.88rem; color:var(--muted);">
          Komisi direset otomatis tiap hari! Selesaikan semua 4 misi hari ini untuk bonus besar, atau panjat Menara Kronik Abadi (Rekor: Lantai ${save.towerFloor || 0}).
        </p>

        <div class="codex-list" style="margin-bottom:16px;">
          ${list
            .map((c) => {
              const ok = doneIds.includes(c.id);
              return `
                <div class="codex-item" style="border-color:${ok ? 'var(--ok)' : 'var(--border-soft)'};">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0; color:${ok ? '#8ce9b5' : 'var(--gold)'};">${ok ? '✓ ' : '◆ '}${escapeHtml(c.title)}</h4>
                    <span style="font-size:0.78rem; color:var(--gold); font-weight:800;">+${c.xp} XP · +${c.coins} Koin</span>
                  </div>
                  <p style="margin:4px 0 0; color:var(--muted); font-size:0.84rem;">${escapeHtml(c.desc)}</p>
                </div>
              `;
            })
            .join('')}
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center;">
          ${
            allDone && !claimed
              ? `<button class="rpg-btn gold" id="btn-dc-claim" type="button">Klaim Peti Bonus Harian (+200 XP & +150 Koin)!</button>`
              : `<span style="font-size:0.82rem; color:var(--muted); font-weight:700;">${
                  claimed ? 'Bonus Harian hari ini sudah diklaim! Kembali lagi besok.' : `Progres hari ini: ${doneIds.length}/4 komisi selesai.`
                }</span>`
          }
          ${
            canAscend
              ? `<button class="rpg-btn primary" id="btn-dc-ascend" type="button">Naik Era Dunia (Era ${(save.worldTier || 1) + 1} · Reset Peti & Musuh!)</button>`
              : ''
          }
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-dc-close')?.addEventListener('click', onClose);
  document.getElementById('btn-dc-claim')?.addEventListener('click', onClaimBonus);
  document.getElementById('btn-dc-ascend')?.addEventListener('click', onAscend);
}
