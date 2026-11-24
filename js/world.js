// Peta 3D Enam Bab di Dalam Buku (3600 x 1760 px) untuk Kronik Atlas.
// Seluruh wilayah, quest, dan NPC terhubung dalam satu sistem progresi Jilid tanpa akhir.

export const WORLD_W = 3600;
export const WORLD_H = 1760;

export const ZONES = [
  {
    id: 1,
    name: 'Bab I · Taman Arsip',
    subtitle: 'Halaman Rumput 1894, Sastra & Fakta',
    rect: { x: 0, y: 0, w: 1120, h: 800 },
    ground: '#7EA668',
    groundAlt: '#739A5E',
    accent: '#C45131'
  },
  {
    id: 2,
    name: 'Bab II · Stasiun Bahasa',
    subtitle: 'Korea, Jepang, Inggris & Diksi KBBI',
    rect: { x: 1240, y: 0, w: 1120, h: 800 },
    ground: '#E2D4BC',
    groundAlt: '#D8C7AA',
    accent: '#C25972'
  },
  {
    id: 3,
    name: 'Bab III · Sektor Sinyal',
    subtitle: 'Keamanan AI & Radar /berita-terkini',
    rect: { x: 2480, y: 0, w: 1120, h: 800 },
    ground: '#162436',
    groundAlt: '#1B2D44',
    accent: '#57B4C9'
  },
  {
    id: 4,
    name: 'Bab IV · Gardu Vital',
    subtitle: 'IIV/SCADA & Keamanan Personil',
    rect: { x: 2480, y: 920, w: 1120, h: 840 },
    ground: '#242933',
    groundAlt: '#2C323E',
    accent: '#D49028'
  },
  {
    id: 5,
    name: 'Bab V · Balai Deduksi',
    subtitle: 'Logika, Retorika & Sesat Pikir',
    rect: { x: 1240, y: 920, w: 1120, h: 840 },
    ground: '#C79F6A',
    groundAlt: '#BC935E',
    accent: '#C98A2B'
  },
  {
    id: 6,
    name: 'Bab VI · Puncak Panggung',
    subtitle: 'Penjaga Jilid & Orasi Akhir',
    rect: { x: 0, y: 920, w: 1120, h: 840 },
    ground: '#2B2642',
    groundAlt: '#242038',
    accent: '#D9B466'
  }
];

export const BRIDGES = [
  {
    id: 'gate-1',
    gateLevel: 1,
    orientation: 'horizontal',
    rect: { x: 1104, y: 340, w: 152, h: 120 },
    altar: { x: 1068, y: 400 },
    label: 'Segel Matematika · Bab II',
    targetZone: 2
  },
  {
    id: 'gate-2',
    gateLevel: 2,
    orientation: 'horizontal',
    rect: { x: 2344, y: 340, w: 152, h: 120 },
    altar: { x: 2308, y: 400 },
    label: 'Segel Matematika · Bab III',
    targetZone: 3
  },
  {
    id: 'gate-3',
    gateLevel: 3,
    orientation: 'vertical',
    rect: { x: 2980, y: 784, w: 120, h: 152 },
    altar: { x: 3040, y: 748 },
    label: 'Segel Matematika · Bab IV',
    targetZone: 4
  },
  {
    id: 'gate-4',
    gateLevel: 4,
    orientation: 'horizontal',
    rect: { x: 2344, y: 1280, w: 152, h: 120 },
    altar: { x: 2528, y: 1340 },
    label: 'Segel Matematika · Bab V',
    targetZone: 5
  },
  {
    id: 'gate-5',
    gateLevel: 5,
    orientation: 'horizontal',
    rect: { x: 1104, y: 1280, w: 152, h: 120 },
    altar: { x: 1288, y: 1340 },
    label: 'Segel Matematika · Bab VI',
    targetZone: 6
  }
];

export const WAYPOINTS = [
  { id: 'wp-1', zone: 1, name: 'Penanda Bab I', x: 240, y: 420 },
  { id: 'wp-2', zone: 2, name: 'Penanda Bab II', x: 1410, y: 400 },
  { id: 'wp-3', zone: 3, name: 'Penanda Bab III', x: 2640, y: 400 },
  { id: 'wp-4', zone: 4, name: 'Penanda Bab IV', x: 3040, y: 1040 },
  { id: 'wp-5', zone: 5, name: 'Penanda Bab V', x: 2180, y: 1340 },
  { id: 'wp-6', zone: 6, name: 'Penanda Bab VI', x: 960, y: 1340 }
];

export const CHESTS = [
  { id: 'chest-1', zone: 1, x: 160, y: 150, tier: 'common', rewardId: 'lit-austen', xp: 45, coins: 40, title: 'Laci Kerang Pesisir' },
  { id: 'chest-2', zone: 1, x: 960, y: 660, tier: 'exquisite', rewardId: 'fact-18', xp: 60, coins: 55, title: 'Peti Pinggir Taman' },
  { id: 'chest-3', zone: 2, x: 1360, y: 145, tier: 'common', rewardId: 'dict-08', xp: 55, coins: 50, title: 'Kotak Naskah Lama' },
  { id: 'chest-4', zone: 2, x: 2230, y: 165, tier: 'exquisite', rewardId: 'dict-17', xp: 70, coins: 65, title: 'Loker Peron Chuncheon' },
  { id: 'chest-5', zone: 3, x: 2620, y: 160, tier: 'exquisite', rewardId: 'cyber-pqc', xp: 85, coins: 80, title: 'Brankas Kuantum PQC' },
  { id: 'chest-6', zone: 3, x: 3450, y: 190, tier: 'precious', rewardId: 'cyber-aisoc', xp: 95, coins: 90, title: 'Server Intel SOC' },
  { id: 'chest-7', zone: 4, x: 2630, y: 1610, tier: 'exquisite', rewardId: 'cyber-sbom', xp: 90, coins: 85, title: 'Kontainer SBOM' },
  { id: 'chest-8', zone: 4, x: 3450, y: 1120, tier: 'precious', rewardId: 'cyber-iiv', xp: 100, coins: 95, title: 'Brankas Gardu SCADA' },
  { id: 'chest-9', zone: 5, x: 2220, y: 1600, tier: 'exquisite', rewardId: 'lit-sherlock', xp: 80, coins: 75, title: 'Berkas Kasus 1890' },
  { id: 'chest-10', zone: 5, x: 1380, y: 1060, tier: 'common', rewardId: 'fact-24', xp: 65, coins: 60, title: 'Peti Probabilitas' },
  { id: 'chest-11', zone: 6, x: 190, y: 1080, tier: 'precious', rewardId: 'dict-20', xp: 110, coins: 110, title: 'Peti Puncak Atlas' },
  { id: 'chest-12', zone: 6, x: 940, y: 1600, tier: 'precious', rewardId: 'cyber-c2pa', xp: 110, coins: 110, title: 'Arsip Verifikasi C2PA' }
];

export const NPCS = [
  {
    id: 'jaja',
    zone: 1,
    x: 450,
    y: 310,
    challengeType: 'story',
    questTitle: 'Catatan Pembuka Bab I',
    introLines: [
      'Selamat datang di Bab I. Aku dan Ciko sekadar tamu yang terdampar di halaman ini, jadi anggap saja pos ini tempat istirahat.',
      'Di timur ada Arsip Sastra milik George untuk meraih Relik Strike, dan di selatan ada Gema Hoaks. Gunakan tombol [F] sebelum duel agar musuh langsung kehilangan sebagian HP.'
    ],
    repeatLines: [
      'Kalau duel mulai berat, tempa atributmu lewat menu Tempa [U] atau istirahat di Penanda Bab terdekat untuk memulihkan HP penuh.'
    ]
  },
  {
    id: 'openmic',
    zone: 1,
    x: 245,
    y: 282,
    challengeType: 'standup',
    questTitle: 'Salon Satir 1894',
    introLines: [],
    doneLines: []
  },
  {
    id: 'tower_keeper',
    zone: 1,
    x: 616,
    y: 472,
    challengeType: 'endless_tower',
    questTitle: 'Menara Tanpa Akhir',
    introLines: [],
    doneLines: []
  },
  {
    id: 'orwell',
    zone: 1,
    x: 910,
    y: 520,
    challengeType: 'academy_lit',
    questTitle: 'Arsip Sastra Klasik (Relik +18% Strike)',
    introLines: [],
    doneLines: []
  },
  {
    id: 'deden',
    zone: 1,
    x: 820,
    y: 220,
    challengeType: 'fact',
    questionCount: 2,
    questTitle: 'Verifikasi Catatan Lapangan',
    introLines: [
      'Ada dua klaim di catatan ini yang tampak meyakinkan, tapi belum tentu benar. Bantu aku menyaringnya.'
    ],
    doneLines: ['Cukup rapi. Fakta tersimpan, mitos disingkirkan.']
  },
  {
    id: 'budi',
    zone: 1,
    x: 740,
    y: 600,
    challengeType: 'fact',
    questionCount: 2,
    questTitle: 'Audit Pesan Masuk',
    introLines: [
      'Dua kabar ini beredar cepat di surat kabar bab ini. Periksa mana yang sahih sebelum diteruskan.'
    ],
    doneLines: ['Terima kasih. Untung belum sempat dicetak ulang.']
  },

  // BAB II: STASIUN BAHASA
  {
    id: 'sora',
    zone: 2,
    x: 2070,
    y: 255,
    challengeType: 'academy_korean',
    questTitle: 'Stasiun Korea · Hangul (Relik +25 HP & Regen)',
    introLines: [
      'Annyeonghaseyo. Di sini kamu bisa berlatih dasar Hangul, mendengarkan pelafalan asli, dan meraih Relik Hangul.'
    ],
    doneLines: ['Pelafalanmu makin jelas. Mampir lagi kapan saja untuk mengulang.']
  },
  {
    id: 'kenji',
    zone: 2,
    x: 2070,
    y: 615,
    challengeType: 'academy_polyglot',
    questTitle: 'Paviliun Poliglot (Relik +1 Energi Awal)',
    introLines: [
      'Di ruang ini tersimpan konsep budaya Jepang dan idiom Inggris yang ringkas untuk diskusi.'
    ],
    doneLines: ['Relik Poliglot aktif. Setiap duel kini dimulai dengan tambahan energi.']
  },
  {
    id: 'rina',
    zone: 2,
    x: 1620,
    y: 255,
    challengeType: 'diction',
    questionCount: 3,
    questTitle: 'Audit Diksi & KBBI',
    introLines: [
      'Satu kata yang meleset bisa mengaburkan seluruh maksud kalimat. Mari uji ketepatan diksi dan EYD.'
    ],
    doneLines: ['Presisi dan bersih. Lanjut ke peron timur atau Segel Bab III.']
  },
  {
    id: 'siska',
    zone: 2,
    x: 1620,
    y: 615,
    challengeType: 'diction',
    questionCount: 2,
    questTitle: 'Penyederhanaan Jargon',
    introLines: [
      'Ubah kalimat penuh jargon berbelit ini menjadi bahasa Indonesia yang lugas.'
    ],
    doneLines: ['Jauh lebih mudah dibaca tanpa kehilangan bobotnya.']
  },

  // BAB III: SEKTOR SINYAL (/berita-terkini)
  {
    id: 'vega',
    zone: 3,
    x: 3040,
    y: 260,
    challengeType: 'academy_cyber',
    questTitle: 'Pusat SOC & Radar /berita-terkini (Relik +25% Perisai)',
    introLines: [
      'Terminal ini merangkum terobosan keamanan AI, IIV/SCADA, dan 21 sumber rujukan /berita-terkini. Selesaikan simulasinya untuk mengaktifkan Relik Perisai.'
    ],
    doneLines: ['Radar aktif. Gunakan Overdrive untuk menembus armor Drone dan Wyrm di sektor ini.']
  },

  // BAB IV: GARDU VITAL (IIV / SCADA)
  {
    id: 'bima',
    zone: 4,
    x: 3040,
    y: 1340,
    challengeType: 'story_iiv',
    questTitle: 'Pengamanan Gardu IIV/SCADA',
    introLines: [
      'Di gardu ini, ancaman siber menyentuh infrastruktur fisik. Titan Ransomware dan Sentinel SCADA punya armor tebal; pakai Overdrive untuk menembusnya.'
    ],
    repeatLines: ['Gardu stabil. Tingkatkan DEF di menu Tempa bila bersiap naik ke Jilid berikutnya.']
  },

  // BAB V: BALAI DEDUKSI
  {
    id: 'fikri',
    zone: 5,
    x: 1960,
    y: 1170,
    challengeType: 'fallacy',
    questionCount: 3,
    questTitle: 'Uji Anomali & Sesat Pikir',
    introLines: [
      'Tiga argumen ini terdengar rapi di permukaan, tetapi menyimpan cacat logika. Tunjukkan letak celahnya.'
    ],
    doneLines: ['Cukup tajam. Sekarang kunjungi Hakim untuk Relik Retorika sebelum menghadapi Puncak.']
  },
  {
    id: 'hakim',
    zone: 5,
    x: 1520,
    y: 1170,
    challengeType: 'academy_rhetoric',
    questTitle: 'Balai Retorika · PREP (Relik +35% Counter)',
    introLines: [
      'Berbicara tenang dan runtut butuh struktur. Pelajari empat kerangka ini untuk mengaktifkan Relik Retorika.'
    ],
    doneLines: ['Relik Retorika aktif. Counter dan Overdrive kamu kini jauh lebih mematikan.']
  },

  // BAB VI: PUNCAK PANGGUNG
  {
    id: 'maestro',
    zone: 6,
    x: 540,
    y: 1240,
    challengeType: 'stage',
    questionCount: 1,
    questTitle: 'Orasi Penutup Bab VI',
    introLines: [
      'Semua bab pada Jilid ini telah kamu lintasi. Sampaikan satu orasi 30 detik yang padat menggunakan dua kata kunci.'
    ],
    doneLines: ['Bab VI selesai. Buka menu Tempa [U] kapan saja untuk membalik Atlas ke Jilid berikutnya.']
  }
];

export const LANDMARKS = [
  // Bab I
  { type: 'warkop', x: 350, y: 170, w: 200, h: 95, solid: true, label: 'POS BAB I' },
  { type: 'standup_stage', x: 185, y: 190, w: 120, h: 70, solid: true, label: 'SALON SATIR 1894' },
  { type: 'endless_tower', x: 585, y: 390, w: 62, h: 62, solid: true, label: 'MENARA TANPA AKHIR' },
  { type: 'library', x: 840, y: 425, w: 150, h: 72, solid: true, label: 'ARSIP SASTRA' },
  { type: 'posronda', x: 765, y: 105, w: 115, h: 72, solid: true, label: 'POS PENGAMAT' },
  { type: 'pond', x: 140, y: 560, w: 185, h: 110, solid: true },

  // Bab II
  { type: 'library', x: 1500, y: 100, w: 235, h: 105, solid: true, label: 'BALAI DIKSI' },
  { type: 'hanok', x: 1950, y: 100, w: 240, h: 105, solid: true, label: 'STASIUN CHUNCHEON' },
  { type: 'fountain', x: 1790, y: 365, w: 115, h: 115, solid: true },
  { type: 'guild', x: 1520, y: 485, w: 190, h: 85, solid: true, label: 'RUANG REDAKSI' },
  { type: 'polyglot', x: 1960, y: 485, w: 225, h: 85, solid: true, label: 'PAVILIUN POLIGLOT' },

  // Bab III
  { type: 'cyber_hub', x: 2900, y: 95, w: 280, h: 115, solid: true, label: 'SOC · /BERITA-TERKINI' },
  { type: 'server', x: 2630, y: 240, w: 58, h: 86, solid: true },
  { type: 'server', x: 3390, y: 260, w: 58, h: 86, solid: true },

  // Bab IV
  { type: 'scada_station', x: 2905, y: 1175, w: 270, h: 110, solid: true, label: 'GARDU IIV / SCADA' },
  { type: 'turbine', x: 2640, y: 1040, w: 72, h: 72, solid: true },
  { type: 'turbine', x: 3370, y: 1260, w: 72, h: 72, solid: true },

  // Bab V
  { type: 'pillar', x: 1850, y: 1090, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 2070, y: 1090, w: 38, h: 38, solid: true },
  { type: 'library', x: 1410, y: 1020, w: 220, h: 98, solid: true, label: 'BALAI RETORIKA' },

  // Bab VI
  { type: 'amphitheater', x: 360, y: 1110, w: 360, h: 280, solid: false },
  { type: 'stage_mic', x: 516, y: 1165, w: 48, h: 32, solid: true }
];

export const TREES = [
  { x: 95, y: 115, style: 'pine' }, { x: 250, y: 115, style: 'oak' },
  { x: 635, y: 115, style: 'oak' }, { x: 990, y: 130, style: 'pine' },
  { x: 1005, y: 240, style: 'oak' }, { x: 110, y: 340, style: 'oak' },
  { x: 110, y: 720, style: 'pine' }, { x: 600, y: 710, style: 'oak' },
  { x: 1015, y: 550, style: 'oak' },
  { x: 1310, y: 245, style: 'sakura' }, { x: 1820, y: 125, style: 'sakura' },
  { x: 2295, y: 245, style: 'sakura' }, { x: 1330, y: 695, style: 'sakura' },
  { x: 1835, y: 710, style: 'sakura' }, { x: 2290, y: 690, style: 'sakura' },
  { x: 2560, y: 140, style: 'cyber_pylon' }, { x: 2770, y: 140, style: 'cyber_pylon' },
  { x: 3280, y: 140, style: 'cyber_pylon' }, { x: 3500, y: 680, style: 'cyber_pylon' },
  { x: 2580, y: 680, style: 'cyber_pylon' },
  { x: 2570, y: 1010, style: 'energy_pylon' }, { x: 3490, y: 1010, style: 'energy_pylon' },
  { x: 2570, y: 1500, style: 'energy_pylon' }, { x: 3490, y: 1640, style: 'energy_pylon' },
  { x: 1330, y: 1010, style: 'torch' }, { x: 1710, y: 1010, style: 'torch' },
  { x: 2240, y: 1040, style: 'cypress' }, { x: 2240, y: 1480, style: 'cypress' },
  { x: 1480, y: 1640, style: 'torch' }, { x: 2040, y: 1640, style: 'torch' },
  { x: 150, y: 1000, style: 'star_lantern' }, { x: 340, y: 1020, style: 'star_lantern' },
  { x: 780, y: 1020, style: 'star_lantern' }, { x: 980, y: 1020, style: 'star_lantern' },
  { x: 210, y: 1560, style: 'star_lantern' }, { x: 860, y: 1560, style: 'star_lantern' }
];

export function getActiveMainQuest(save) {
  const defeated = save.defeatedEnemies || [];
  const badges = save.academyBadges || [];
  const vol = save.volume || 1;

  if (!badges.includes('academy-lit')) {
    return {
      chapter: `Jilid ${vol} · Bab I`,
      title: 'Raih Relik Sastra di Arsip George',
      hint: 'Temui George di timur Bab I untuk membuka Relik +18% Strike sebelum duel berat.',
      target: { x: 910, y: 520, label: 'George (Arsip Sastra)' }
    };
  }
  if (!defeated.includes('slime_hoaks')) {
    return {
      chapter: `Jilid ${vol} · Bab I`,
      title: 'Lumpuhkan Gema Hoaks (Strike [F])',
      hint: 'Dekati Gema Hoaks di selatan Bab I lalu tekan [F] untuk Ambush pembuka.',
      target: { x: 420, y: 590, label: 'Gema Hoaks' }
    };
  }
  if (!save.solvedGates.includes('gate-1')) {
    return {
      chapter: `Jilid ${vol} · Segel #1`,
      title: 'Pecahkan Segel menuju Bab II',
      hint: 'Selesaikan 3 rune matematika berwaktu di Jembatan Timur Bab I.',
      target: { x: 1068, y: 400, label: 'Segel Bab II' }
    };
  }
  if (!badges.includes('academy-korean')) {
    return {
      chapter: `Jilid ${vol} · Bab II`,
      title: 'Raih Relik Hangul di Stasiun Sora',
      hint: 'Belajar Hangul di timur laut Bab II untuk bonus +25 Max HP & regenerasi.',
      target: { x: 2070, y: 255, label: 'Sora (Stasiun Korea)' }
    };
  }
  if (!save.completedNpcs.includes('rina')) {
    return {
      chapter: `Jilid ${vol} · Bab II`,
      title: 'Selesaikan Audit Diksi Rina',
      hint: 'Temui Rina di Balai Diksi sebelah barat laut Bab II.',
      target: { x: 1620, y: 255, label: 'Rina (Balai Diksi)' }
    };
  }
  if (!save.solvedGates.includes('gate-2')) {
    return {
      chapter: `Jilid ${vol} · Segel #2`,
      title: 'Pecahkan Segel menuju Bab III',
      hint: 'Dekati Jembatan Timur Bab II untuk membuka Sektor Sinyal.',
      target: { x: 2308, y: 400, label: 'Segel Bab III' }
    };
  }
  if (!badges.includes('academy-cyber')) {
    return {
      chapter: `Jilid ${vol} · Bab III`,
      title: 'Raih Relik Siber di SOC Vega',
      hint: 'Pelajari terobosan siber & /berita-terkini di SOC Vega untuk +25% Perisai.',
      target: { x: 3040, y: 260, label: 'Vega (SOC Siber)' }
    };
  }
  if (!defeated.includes('prompt_wyrm')) {
    return {
      chapter: `Jilid ${vol} · Bab III`,
      title: 'Tumbangkan Wyrm Injeksi',
      hint: 'Gunakan Overdrive (2 Energi) untuk menembus armor Wyrm Injeksi.',
      target: { x: 3320, y: 520, label: 'Wyrm Injeksi' }
    };
  }
  if (!save.solvedGates.includes('gate-3')) {
    return {
      chapter: `Jilid ${vol} · Segel #3`,
      title: 'Pecahkan Segel menuju Bab IV',
      hint: 'Dekati Jembatan Selatan Bab III untuk memasuki Gardu Vital.',
      target: { x: 3040, y: 748, label: 'Segel Bab IV' }
    };
  }
  if (!defeated.includes('ransomware_titan')) {
    return {
      chapter: `Jilid ${vol} · Bab IV`,
      title: 'Lumpuhkan Titan Ransomware',
      hint: 'Tempa ATK/DEF dulu bila perlu, lalu hadapi Titan di barat laut Bab IV.',
      target: { x: 2790, y: 1210, label: 'Titan Ransomware' }
    };
  }
  if (!save.solvedGates.includes('gate-4')) {
    return {
      chapter: `Jilid ${vol} · Segel #4`,
      title: 'Pecahkan Segel menuju Bab V',
      hint: 'Dekati Jembatan Barat Bab IV menuju Balai Deduksi.',
      target: { x: 2528, y: 1340, label: 'Segel Bab V' }
    };
  }
  if (!badges.includes('academy-rhetoric')) {
    return {
      chapter: `Jilid ${vol} · Bab V`,
      title: 'Raih Relik Retorika dari Hakim',
      hint: 'Temui Hakim di Balai Retorika untuk bonus +35% Counter & Overdrive.',
      target: { x: 1520, y: 1170, label: 'Hakim (Balai Retorika)' }
    };
  }
  if (!save.solvedGates.includes('gate-5')) {
    return {
      chapter: `Jilid ${vol} · Segel #5`,
      title: 'Pecahkan Segel Puncak Bab VI',
      hint: 'Dekati Obelisk Barat Bab V untuk membuka Puncak Panggung.',
      target: { x: 1288, y: 1340, label: 'Segel Bab VI' }
    };
  }
  if (!defeated.includes('deepfake_boss')) {
    return {
      chapter: `Jilid ${vol} · Penjaga Jilid`,
      title: `Kalahkan Dalang Deepfake (Jilid ${vol})`,
      hint: 'Tumbangkan Dalang Deepfake di Bab VI untuk membuka Jilid berikutnya.',
      target: { x: 780, y: 1350, label: 'Dalang Deepfake' }
    };
  }
  return {
    chapter: `Jilid ${vol} Takluk`,
    title: `Buka Jilid ${vol + 1} di Menu Tempa [U]`,
    hint: `Dalang Deepfake Jilid ${vol} tumbang. Buka menu Tempa [U] untuk naik ke Jilid ${vol + 1} atau tantang Menara Tanpa Akhir.`,
    target: { x: 616, y: 472, label: 'Menara Tanpa Akhir' }
  };
}

export function getZoneAt(x, y) {
  for (const z of ZONES) {
    if (x >= z.rect.x && x <= z.rect.x + z.rect.w && y >= z.rect.y && y <= z.rect.y + z.rect.h) {
      return z;
    }
  }
  return ZONES[0];
}

export function isPointBlocked(x, y, radius, solvedGates) {
  if (x - radius < 36 || x + radius > WORLD_W - 36 || y - radius < 36 || y + radius > WORLD_H - 36) {
    return { blocked: true, reason: 'border' };
  }

  for (const br of BRIDGES) {
    const inside =
      x >= br.rect.x && x <= br.rect.x + br.rect.w && y >= br.rect.y && y <= br.rect.y + br.rect.h;
    if (inside) {
      if (solvedGates.includes(br.id)) return { blocked: false };
      if (br.orientation === 'horizontal') {
        const midX = br.rect.x + br.rect.w / 2;
        if (x + radius > midX - 42 && x - radius < midX + 42) {
          return { blocked: true, reason: 'gate', gate: br };
        }
      } else {
        const midY = br.rect.y + br.rect.h / 2;
        if (y + radius > midY - 42 && y - radius < midY + 42) {
          return { blocked: true, reason: 'gate', gate: br };
        }
      }
      return { blocked: false };
    }
  }

  if ((x + radius > 1120 && x - radius < 1240) || (x + radius > 2360 && x - radius < 2480)) {
    return { blocked: true, reason: 'river' };
  }
  if (y + radius > 800 && y - radius < 920) {
    return { blocked: true, reason: 'river' };
  }

  for (const lm of LANDMARKS) {
    if (!lm.solid) continue;
    if (x + radius > lm.x && x - radius < lm.x + lm.w && y + radius > lm.y && y - radius < lm.y + lm.h) {
      return { blocked: true, reason: 'landmark' };
    }
  }

  for (const t of TREES) {
    const dx = x - t.x;
    const dy = y - (t.y + 8);
    if (dx * dx + dy * dy < (radius + 14) * (radius + 14)) {
      return { blocked: true, reason: 'tree' };
    }
  }

  return { blocked: false };
}
