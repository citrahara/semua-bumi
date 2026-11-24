// Pendaftaran akun: validasi username + 3 soal seleksi singkat (tanpa pemilihan karakter).

export const SUGGESTED_USERNAMES = [
  'nala_k',
  'senja_89',
  'taman_utara',
  'karsa_04',
  'dara_m',
  'raka_p',
  'sore_tenang',
  'arsip_lama'
];

export function validateUsername(raw, existingUsernames = []) {
  const clean = (raw || '').trim().replace(/^@+/, '');
  if (clean.length < 3) {
    return { ok: false, error: 'Minimal 3 karakter.' };
  }
  if (clean.length > 16) {
    return { ok: false, error: 'Maksimal 16 karakter.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { ok: false, error: 'Gunakan huruf, angka, atau garis bawah tanpa spasi.' };
  }
  const taken = existingUsernames.some((u) => u.toLowerCase() === clean.toLowerCase());
  if (taken) {
    return { ok: false, error: `@${clean} sudah terdaftar. Pilih nama lain atau langsung masuk.` };
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

const LANG_POOL = [
  {
    q: 'Pilih penulisan baku menurut KBBI VI.',
    options: [
      { label: 'sekadar · risiko · praktik', ok: true },
      { label: 'sekedar · resiko · praktek', ok: false },
      { label: 'sekadar · resiko · praktek', ok: false },
      { label: 'sekedar · risiko · praktik', ok: false }
    ],
    explain: 'Bentuk bakunya sekadar, risiko, dan praktik.'
  },
  {
    q: 'Pilih penulisan awalan dan kata depan yang benar.',
    options: [
      { label: 'Teh diseduh di dapur, bukan di mana-mana.', ok: true },
      { label: 'Teh di seduh didapur, bukan dimana-mana.', ok: false },
      { label: 'Teh diseduh didapur, bukan dimana-mana.', ok: false },
      { label: 'Teh di seduh di dapur, bukan dimana-mana.', ok: false }
    ],
    explain: 'Awalan pasif dirangkai (diseduh); kata depan tempat dipisah (di dapur, di mana).'
  },
  {
    q: 'Pilih deretan kata baku.',
    options: [
      { label: 'silakan · mengubah · izin', ok: true },
      { label: 'silahkan · merubah · ijin', ok: false },
      { label: 'silakan · merubah · izin', ok: false },
      { label: 'silahkan · mengubah · izin', ok: false }
    ],
    explain: 'Bentuk bakunya silakan, mengubah, dan izin.'
  },
  {
    q: 'Apa arti kata "acuh" dalam KBBI?',
    options: [
      { label: 'Peduli atau menaruh perhatian', ok: true },
      { label: 'Cuek atau masa bodoh', ok: false },
      { label: 'Marah sambil menggerutu', ok: false },
      { label: 'Lupa sesaat', ok: false }
    ],
    explain: 'Acuh berarti peduli; bentuk negasinya tak acuh.'
  },
  {
    q: 'Pilih bentuk kata baku.',
    options: [
      { label: 'napas · andal · analisis', ok: true },
      { label: 'nafas · handal · analisa', ok: false },
      { label: 'napas · handal · analisis', ok: false },
      { label: 'nafas · andal · analisa', ok: false }
    ],
    explain: 'Bentuk bakunya napas, andal, dan analisis.'
  }
];

function genQuickMath() {
  const variant = randInt(0, 2);
  if (variant === 0) {
    const a = randInt(4, 12);
    const b = randInt(2, 6);
    const c = randInt(2, 5);
    const ans = a + b * c;
    const trap = (a + b) * c;
    return {
      tag: '2/3 · Hitung',
      q: `Hitung nilai ${a} + ${b} × ${c}.`,
      options: shuffle([
        { label: String(ans), ok: true },
        { label: String(trap), ok: false },
        { label: String(ans + b), ok: false },
        { label: String(Math.max(1, ans - c)), ok: false }
      ]),
      explain: `Perkalian lebih dulu: ${b} × ${c} = ${b * c}, lalu tambah ${a} menjadi ${ans}.`
    };
  }
  if (variant === 1) {
    const qty = randInt(2, 4);
    const price = randInt(4, 7) * 1000;
    const total = qty * price;
    const pay = Math.ceil((total + 3000) / 10000) * 10000;
    const change = pay - total;
    const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
    return {
      tag: '2/3 · Hitung',
      q: `Total ${qty} buku seharga ${fmt(price)} dibayar ${fmt(pay)}. Berapa kembaliannya?`,
      options: shuffle([
        { label: fmt(change), ok: true },
        { label: fmt(change + 2000), ok: false },
        { label: fmt(Math.max(1000, change - 2000)), ok: false },
        { label: fmt(total), ok: false }
      ]),
      explain: `${qty} × ${fmt(price)} = ${fmt(total)}; ${fmt(pay)} - ${fmt(total)} = ${fmt(change)}.`
    };
  }
  const start = randInt(3, 8);
  const step = randInt(3, 6);
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const ans = start + step * 4;
  return {
    tag: '2/3 · Pola',
    q: `Lanjutkan pola: ${seq.join(', ')}, ...`,
    options: shuffle([
      { label: String(ans), ok: true },
      { label: String(ans + 1), ok: false },
      { label: String(ans - 2), ok: false },
      { label: String(ans + step), ok: false }
    ]),
    explain: `Setiap suku bertambah ${step}, sehingga angka berikutnya ${ans}.`
  };
}

const LOGIC_POOL = [
  {
    q: 'Menolak argumen dengan menyerang usia pembicaranya disebut sesat pikir apa?',
    options: [
      { label: 'Ad Hominem', ok: true },
      { label: 'Eufemisme', ok: false },
      { label: 'Pleonasme', ok: false },
      { label: 'Serendipiti', ok: false }
    ],
    explain: 'Ad Hominem menyerang pribadi pembicara, bukan argumennya.'
  },
  {
    q: 'Pernyataan mana yang merupakan fakta?',
    options: [
      { label: 'Gurita memiliki tiga jantung dan darah biru.', ok: true },
      { label: 'Manusia hanya memakai 10 persen otaknya.', ok: false },
      { label: 'Ikan mas koki hanya ingat selama 3 detik.', ok: false },
      { label: 'Banteng marah karena warna merah.', ok: false }
    ],
    explain: 'Gurita memiliki tiga jantung dan hemosianin berbasis tembaga yang membuat darahnya biru.'
  },
  {
    q: 'Mengapa frasa "tak bergeming" keliru untuk arti tetap diam?',
    options: [
      { label: '"Bergeming" sendiri sudah berarti diam.', ok: true },
      { label: '"Bergeming" berarti berlari cepat.', ok: false },
      { label: '"Bergeming" hanya untuk benda mati.', ok: false },
      { label: 'Harus ditulis memakai tanda hubung.', ok: false }
    ],
    explain: 'Karena bergeming berarti diam, awalan tak justru membalik maknanya.'
  },
  {
    q: 'Pernyataan sejarah mana yang benar?',
    options: [
      { label: 'Universitas Oxford lebih tua dari Kekaisaran Aztek.', ok: true },
      { label: 'Tembok Besar Tiongkok tampak jelas dari Bulan.', ok: false },
      { label: 'Einstein selalu gagal pelajaran matematika.', ok: false },
      { label: 'Tinggi Napoleon di bawah 150 cm.', ok: false }
    ],
    explain: 'Pengajaran di Oxford dimulai sekitar 1096, jauh sebelum berdirinya ibu kota Aztek pada 1325.'
  }
];

export function buildRegistrationExam() {
  const lang = LANG_POOL[randInt(0, LANG_POOL.length - 1)];
  const mathQ = genQuickMath();
  const logic = LOGIC_POOL[randInt(0, LOGIC_POOL.length - 1)];

  return [
    {
      tag: '1/3 · Bahasa',
      q: lang.q,
      options: shuffle(lang.options),
      explain: lang.explain
    },
    mathQ,
    {
      tag: '3/3 · Nalar',
      q: logic.q,
      options: shuffle(logic.options),
      explain: logic.explain
    }
  ];
}
