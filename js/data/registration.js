// Sistem Pendaftaran Akun, 4 Jenis Karakter RPG, dan Ujian Masuk (Gatekeeper Challenge).

export const CHARACTER_CLASSES = [
  {
    id: 'orator',
    portraitKey: 'hero_orator',
    name: 'Orator Api',
    vibe: 'Ekspresif, kocak, dan hobi pegang panggung',
    bonusLabel: 'Lari +12% lebih cepat · +15% XP Panggung Orasi',
    cloakColor: '#E64A19',
    trimColor: '#FFD166',
    hatStyle: 'scarf',
    speedMult: 1.12,
    xpBonusType: 'stage',
    xpBonusMult: 1.15
  },
  {
    id: 'pujangga',
    portraitKey: 'hero_pujangga',
    name: 'Pujangga Senja',
    vibe: 'Diksi tajam, elegan, dan jago menyindir halus',
    bonusLabel: '+20% XP & Koin dari Quest Bahasa dan Diksi',
    cloakColor: '#7A2E4B',
    trimColor: '#F5C451',
    hatStyle: 'beret',
    speedMult: 1.0,
    xpBonusType: 'diction',
    xpBonusMult: 1.2
  },
  {
    id: 'detektif',
    portraitKey: 'hero_detektif',
    name: 'Detektif Logika',
    vibe: 'Kritis, anti-hoaks, dan jago bedah sesat pikir',
    bonusLabel: '+20% XP & Koin dari Duel Fakta dan Sesat Pikir',
    cloakColor: '#6B4E31',
    trimColor: '#48DBFB',
    hatStyle: 'fedora',
    speedMult: 1.04,
    xpBonusType: 'logic',
    xpBonusMult: 1.2
  },
  {
    id: 'alkemis',
    portraitKey: 'hero_alkemis',
    name: 'Alkemis Angka',
    vibe: 'Otak encer, penakluk rumus dan rahasia peti harta',
    bonusLabel: '+25% XP & Koin saat pecahkan Segel Matematika & Peti',
    cloakColor: '#1E6B5C',
    trimColor: '#FFD166',
    hatStyle: 'goggles',
    speedMult: 1.04,
    xpBonusType: 'math',
    xpBonusMult: 1.25
  }
];

export function getCharacterClass(id) {
  return CHARACTER_CLASSES.find((c) => c.id === id) || CHARACTER_CLASSES[0];
}

export const FUNNY_USERNAMES = [
  'orator_gorengan',
  'filsuf_esteh',
  'ksatria_kbbi',
  'sultan_logika',
  'pemburu_fakta',
  'jagoan_diksi',
  'pujangga_kopi',
  'master_ngeles'
];

export function validateUsername(raw, existingUsernames = []) {
  const clean = (raw || '').trim().replace(/^@+/, '');
  if (clean.length < 3) {
    return { ok: false, error: 'Username minimal 3 karakter.' };
  }
  if (clean.length > 16) {
    return { ok: false, error: 'Username maksimal 16 karakter.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { ok: false, error: 'Pakai huruf, angka, atau garis bawah (_) saja tanpa spasi.' };
  }
  const taken = existingUsernames.some((u) => u.toLowerCase() === clean.toLowerCase());
  if (taken) {
    return { ok: false, error: `Username @${clean} sudah terdaftar! Pilih nama lain atau langsung masuk akunmu.` };
  }
  return { ok: true, username: clean };
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Soal 1: Uji EYD / KBBI Kilat (verifikasi bukan bot kaku)
const EYD_POOL = [
  {
    q: 'Verifikasi Bahasa: pilih penulisan yang BAKU menurut KBBI VI!',
    options: [
      { label: 'sekadar · risiko · praktik', ok: true },
      { label: 'sekedar · resiko · praktek', ok: false },
      { label: 'sekadar · resiko · praktek', ok: false },
      { label: 'sekedar · risiko · praktik', ok: false }
    ],
    explain: 'Bentuk baku KBBI VI adalah sekadar, risiko, dan praktik.'
  },
  {
    q: 'Verifikasi Bahasa: mana penulisan awalan dan kata depan yang tepat?',
    options: [
      { label: 'Kopi diseduh di dapur, bukan di mana-mana.', ok: true },
      { label: 'Kopi di seduh didapur, bukan dimana-mana.', ok: false },
      { label: 'Kopi diseduh didapur, bukan dimana-mana.', ok: false },
      { label: 'Kopi di seduh di dapur, bukan dimana-mana.', ok: false }
    ],
    explain: 'Awalan pasif dirangkai (diseduh), sedangkan kata depan tempat dipisah (di dapur, di mana).'
  },
  {
    q: 'Verifikasi Bahasa: pilih deretan kata yang seluruhnya BAKU!',
    options: [
      { label: 'silakan · mengubah · izin', ok: true },
      { label: 'silahkan · merubah · ijin', ok: false },
      { label: 'silakan · merubah · izin', ok: false },
      { label: 'silahkan · mengubah · izin', ok: false }
    ],
    explain: 'Kata baku menurut KBBI adalah silakan (tanpa h), mengubah (dari ubah), dan izin (pakai z).'
  },
  {
    q: 'Verifikasi Bahasa: apa arti sebenarnya kata "acuh" di KBBI?',
    options: [
      { label: 'Peduli atau menaruh perhatian', ok: true },
      { label: 'Cuek dan masa bodoh', ok: false },
      { label: 'Marah sambil mengomel', ok: false },
      { label: 'Lupa ingatan sesaat', ok: false }
    ],
    explain: 'Kata "acuh" berarti peduli; kalau cuek, bentuk yang benar adalah "tak acuh".'
  },
  {
    q: 'Verifikasi Bahasa: pilih bentuk yang seluruhnya BAKU menurut KBBI!',
    options: [
      { label: 'napas · andal · analisis', ok: true },
      { label: 'nafas · handal · analisa', ok: false },
      { label: 'napas · handal · analisis', ok: false },
      { label: 'nafas · andal · analisa', ok: false }
    ],
    explain: 'Bentuk bakunya adalah napas (pakai p), andal (tanpa h), dan analisis (akhiran -is).'
  }
];

// Soal 2: Hitung Cepat Kasir Warkop (dinamis!)
function genQuickCashierMath() {
  const variant = randInt(0, 2);
  if (variant === 0) {
    const a = randInt(4, 12);
    const b = randInt(2, 6);
    const c = randInt(2, 5);
    const ans = a + b * c;
    const trap = (a + b) * c;
    const opts = shuffle([
      { label: String(ans), ok: true },
      { label: String(trap), ok: false },
      { label: String(ans + b), ok: false },
      { label: String(Math.max(1, ans - c)), ok: false }
    ]);
    return {
      tag: 'Tes 2/3 · Hitung Kasir',
      q: `Hitung cepat sebelum antrean panjang: ${a} + ${b} × ${c} = ?`,
      options: opts,
      explain: `Kerjakan perkalian dulu: ${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${ans}.`
    };
  }
  if (variant === 1) {
    const qty = randInt(2, 4);
    const price = randInt(4, 7) * 1000;
    const total = qty * price;
    const pay = Math.ceil((total + 3000) / 10000) * 10000;
    const change = pay - total;
    const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
    const opts = shuffle([
      { label: fmt(change), ok: true },
      { label: fmt(change + 2000), ok: false },
      { label: fmt(Math.max(1000, change - 2000)), ok: false },
      { label: fmt(total), ok: false }
    ]);
    return {
      tag: 'Tes 2/3 · Hitung Kasir',
      q: `Kamu pesan ${qty} gelas kopi seharga ${fmt(price)} per gelas, lalu bayar ${fmt(pay)}. Berapa kembalianmu?`,
      options: opts,
      explain: `Total belanja ${qty} × ${fmt(price)} = ${fmt(total)}. Kembaliannya ${fmt(pay)} - ${fmt(total)} = ${fmt(change)}.`
    };
  }
  const start = randInt(3, 8);
  const step = randInt(3, 6);
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const ans = start + step * 4;
  const opts = shuffle([
    { label: String(ans), ok: true },
    { label: String(ans + 1), ok: false },
    { label: String(ans - 2), ok: false },
    { label: String(ans + step), ok: false }
  ]);
  return {
    tag: 'Tes 2/3 · Pola Kilat',
    q: `Lengkapi kode loket warkop berikut: ${seq.join(', ')}, ...`,
    options: opts,
    explain: `Setiap angka bertambah ${step}, jadi angka selanjutnya ${seq[3]} + ${step} = ${ans}.`
  };
}

// Soal 3: Uji Fakta & Nalar Tongkrongan
const WIT_POOL = [
  {
    q: 'Uji Nalar: seseorang membantah saranmu hanya dengan bilang "Ah, kamu masih muda, nggak tahu apa-apa!" Itu contoh sesat pikir apa?',
    options: [
      { label: 'Ad Hominem (menyerang pribadi, bukan argumen)', ok: true },
      { label: 'Serendipiti (keberuntungan tak terduga)', ok: false },
      { label: 'Eufemisme (penghalusan kata)', ok: false },
      { label: 'Pleonasme (pemborosan kata)', ok: false }
    ],
    explain: 'Menyerang usia atau pribadi pembicara alih-alih isi argumennya disebut Ad Hominem.'
  },
  {
    q: 'Uji Wawasan: pernyataan mana yang BENAR-BENAR FAKTA dunia nyata?',
    options: [
      { label: 'Gurita memiliki tiga jantung dan darah berwarna biru.', ok: true },
      { label: 'Manusia normal hanya memakai 10 persen otaknya.', ok: false },
      { label: 'Ikan mas koki hanya punya daya ingat 3 detik.', ok: false },
      { label: 'Banteng marah karena melihat warna merah.', ok: false }
    ],
    explain: 'Gurita memang punya 3 jantung dan darah biru berbasis tembaga (hemosianin); tiga opsi lainnya adalah mitos populer.'
  },
  {
    q: 'Uji Diksi: berita menulis "Dia tak bergeming sedikit pun" untuk maksud tetap diam teguh. Kenapa keliru?',
    options: [
      { label: 'Kata "bergeming" sendiri sudah berarti diam tidak bergerak.', ok: true },
      { label: 'Kata "bergeming" artinya berlari kencang.', ok: false },
      { label: 'Kata "bergeming" hanya dipakai untuk benda mati.', ok: false },
      { label: 'Harusnya ditulis "ber-geming" pakai tanda hubung.', ok: false }
    ],
    explain: 'Karena "bergeming" berarti diam, menambahkan "tak" justru membalik maknanya menjadi bergerak.'
  },
  {
    q: 'Uji Wawasan: mana fakta sejarah yang BENAR?',
    options: [
      { label: 'Universitas Oxford lebih tua daripada Kekaisaran Aztek.', ok: true },
      { label: 'Einstein selalu gagal matematika waktu sekolah.', ok: false },
      { label: 'Tembok Besar Tiongkok tampak jelas dengan mata telanjang dari Bulan.', ok: false },
      { label: 'Tinggi Napoleon Bonaparte tidak sampai 150 cm.', ok: false }
    ],
    explain: 'Oxford mulai beroperasi sekitar 1096, lebih dari dua abad sebelum berdirinya ibu kota Aztek (1325).'
  }
];

export function buildRegistrationExam() {
  const eyd = EYD_POOL[randInt(0, EYD_POOL.length - 1)];
  const mathQ = genQuickCashierMath();
  const wit = WIT_POOL[randInt(0, WIT_POOL.length - 1)];

  return [
    {
      tag: 'Tes 1/3 · Cek Bahasa',
      q: eyd.q,
      options: shuffle(eyd.options),
      explain: eyd.explain
    },
    mathQ,
    {
      tag: 'Tes 3/3 · Cek Wawasan',
      q: wit.q,
      options: shuffle(wit.options),
      explain: wit.explain
    }
  ];
}

export const REJECT_ROASTS = [
  'Waduh, loket Bang Jaja langsung tutup gerbang! Belajar dulu sebentar baru daftar ulang ya.',
  'Ciko sampai keselek kopi lihat jawaban barusan! Akun belum bisa diterbitkan.',
  'Maaf, KTP Warga Warkop belum bisa dicetak. Baca penjelasannya dulu lalu coba tantangan baru!'
];
