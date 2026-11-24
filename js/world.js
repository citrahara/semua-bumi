// Peta Dunia Terbuka 6 Wilayah Warkop Impact (3600 x 1760 px)
// 6 Zona tematik, 5 Gerbang Segel Matematika, 12 NPC/Akademi/Terminal, 6 Waypoint, 12 Peti Harta, + 7 Musuh Patroli Siber!

export const WORLD_W = 3600;
export const WORLD_H = 1760;

export const ZONES = [
  {
    id: 1,
    name: 'Desa Warkop',
    subtitle: 'Lv. 1 · Lembah Fakta & Latihan Tempur',
    rect: { x: 0, y: 0, w: 1120, h: 800 },
    ground: '#7FB069',
    groundAlt: '#74A45E',
    accent: '#E64A19'
  },
  {
    id: 2,
    name: 'Distrik Bahasa & Akademi',
    subtitle: 'Lv. 2 · Belajar Korea, Jepang, Inggris & KBBI',
    rect: { x: 1240, y: 0, w: 1120, h: 800 },
    ground: '#E7D8C0',
    groundAlt: '#DECBA9',
    accent: '#D85C7B'
  },
  {
    id: 3,
    name: 'Distrik Siber & AI Lab',
    subtitle: 'Lv. 3 · Radar /berita-terkini & Pertahanan AI',
    rect: { x: 2480, y: 0, w: 1120, h: 800 },
    ground: '#162436',
    groundAlt: '#1B2D44',
    accent: '#48DBFB'
  },
  {
    id: 4,
    name: 'Benteng IIV / SCADA Grid',
    subtitle: 'Lv. 4 · Infrastruktur Vital & Duel Ransomware',
    rect: { x: 2480, y: 920, w: 1120, h: 840 },
    ground: '#242933',
    groundAlt: '#2C323E',
    accent: '#F59E0B'
  },
  {
    id: 5,
    name: 'Lembah Logika & Debat',
    subtitle: 'Lv. 5 · Retorika & Penjinak Sesat Pikir',
    rect: { x: 1240, y: 920, w: 1120, h: 840 },
    ground: '#CFA46B',
    groundAlt: '#C4965C',
    accent: '#D98A1A'
  },
  {
    id: 6,
    name: 'Puncak Amfiteater Orator',
    subtitle: 'Lv. 6 · Boss Deepfake & Panggung 30 Detik',
    rect: { x: 0, y: 920, w: 1120, h: 840 },
    ground: '#2D2847',
    groundAlt: '#26213D',
    accent: '#FFD166'
  }
];

// 5 Jembatan bersegel Matematika (rute searah jarum jam: 1 -> 2 -> 3 -> 4 -> 5 -> 6!)
export const BRIDGES = [
  {
    id: 'gate-1',
    gateLevel: 1,
    orientation: 'horizontal',
    rect: { x: 1104, y: 340, w: 152, h: 120 },
    altar: { x: 1068, y: 400 },
    label: 'Segel Matematika Lv. 2 (Distrik Bahasa)',
    targetZone: 2
  },
  {
    id: 'gate-2',
    gateLevel: 2,
    orientation: 'horizontal',
    rect: { x: 2344, y: 340, w: 152, h: 120 },
    altar: { x: 2308, y: 400 },
    label: 'Segel Matematika Lv. 3 (Distrik Siber AI)',
    targetZone: 3
  },
  {
    id: 'gate-3',
    gateLevel: 3,
    orientation: 'vertical',
    rect: { x: 2980, y: 784, w: 120, h: 152 },
    altar: { x: 3040, y: 748 },
    label: 'Segel Matematika Lv. 4 (Benteng IIV/SCADA)',
    targetZone: 4
  },
  {
    id: 'gate-4',
    gateLevel: 4,
    orientation: 'horizontal',
    rect: { x: 2344, y: 1280, w: 152, h: 120 },
    altar: { x: 2528, y: 1340 },
    label: 'Segel Matematika Lv. 5 (Lembah Logika)',
    targetZone: 5
  },
  {
    id: 'gate-5',
    gateLevel: 5,
    orientation: 'horizontal',
    rect: { x: 1104, y: 1280, w: 152, h: 120 },
    altar: { x: 1288, y: 1340 },
    label: 'Segel Matematika Lv. 6 (Puncak Orator)',
    targetZone: 6
  }
];

export const WAYPOINTS = [
  { id: 'wp-1', zone: 1, name: 'Waypoint Alun-Alun Warkop', x: 240, y: 420 },
  { id: 'wp-2', zone: 2, name: 'Waypoint Akademi Bahasa', x: 1410, y: 400 },
  { id: 'wp-3', zone: 3, name: 'Waypoint Menara SOC AI', x: 2640, y: 400 },
  { id: 'wp-4', zone: 4, name: 'Waypoint Gardu IIV/SCADA', x: 3040, y: 1040 },
  { id: 'wp-5', zone: 5, name: 'Waypoint Gerbang Pilar', x: 2180, y: 1340 },
  { id: 'wp-6', zone: 6, name: 'Waypoint Amfiteater Langit', x: 960, y: 1340 }
];

export const CHESTS = [
  { id: 'chest-1', zone: 1, x: 160, y: 150, tier: 'common', rewardId: 'fact-01', xp: 45, coins: 30, title: 'Peti Kebun Kopi' },
  { id: 'chest-2', zone: 1, x: 960, y: 660, tier: 'exquisite', rewardId: 'fact-18', xp: 60, coins: 45, title: 'Peti Pinggir Sungai' },
  { id: 'chest-3', zone: 2, x: 1360, y: 145, tier: 'common', rewardId: 'dict-08', xp: 55, coins: 40, title: 'Peti Rak Pustaka' },
  { id: 'chest-4', zone: 2, x: 2230, y: 165, tier: 'exquisite', rewardId: 'dict-17', xp: 70, coins: 55, title: 'Peti Taman Hangul' },
  { id: 'chest-5', zone: 3, x: 2620, y: 160, tier: 'exquisite', rewardId: 'cyber-pqc', xp: 85, coins: 65, title: 'Brankas Kuantum PQC' },
  { id: 'chest-6', zone: 3, x: 3450, y: 190, tier: 'precious', rewardId: 'cyber-aisoc', xp: 95, coins: 75, title: 'Server Intel AI SOC' },
  { id: 'chest-7', zone: 4, x: 2630, y: 1610, tier: 'exquisite', rewardId: 'cyber-sbom', xp: 90, coins: 70, title: 'Kontainer SBOM' },
  { id: 'chest-8', zone: 4, x: 3450, y: 1120, tier: 'precious', rewardId: 'cyber-iiv', xp: 100, coins: 85, title: 'Brankas Gardu SCADA' },
  { id: 'chest-9', zone: 5, x: 2220, y: 1600, tier: 'exquisite', rewardId: 'fall-10', xp: 80, coins: 65, title: 'Peti Pilar Selatan' },
  { id: 'chest-10', zone: 5, x: 1380, y: 1060, tier: 'common', rewardId: 'fact-24', xp: 65, coins: 50, title: 'Peti Obor Kuno' },
  { id: 'chest-11', zone: 6, x: 190, y: 1080, tier: 'precious', rewardId: 'dict-20', xp: 110, coins: 95, title: 'Peti Bintang Orator' },
  { id: 'chest-12', zone: 6, x: 940, y: 1600, tier: 'precious', rewardId: 'cyber-c2pa', xp: 110, coins: 95, title: 'Arsip Anti-Deepfake' }
];

// 12 NPC (Cerita, Duel Pengetahuan, Akademi Belajar Bahasa, & Laboratorium Siber!)
export const NPCS = [
  {
    id: 'jaja',
    zone: 1,
    x: 450,
    y: 310,
    challengeType: 'story',
    questTitle: 'Misi Utama I: Kronik Kedai 1894',
    introLines: [
      'Selamat datang di Kedai Kopi 1894, Petualang! Retakan Waktu Siber bikin hoaks dan monster abad ke-21 tumpah ke lembah vintage kita!',
      'Coba mampir dulu ke Panggung Open-Mic Stand-Up di sebelah barat kedai buat pemanasan ngelucu, lalu bantu bongkar teori Kang Deden dan kalahkan Slime Hoaks!',
      'Di timur kedai juga berdiri Menara Kronik Abadi yang tidak pernah ada lantai terakhirnya, serta Segel Matematika menuju Akademi Bahasa Korea dan Distrik Siber!'
    ],
    repeatLines: [
      'Kopi tubruk 1894 masih panas! Coba naik ke Panggung Open-Mic di sebelah kiri kedai atau tantang Menara Kronik Abadi kalau mau adu skor tanpa batas!'
    ]
  },
  {
    id: 'openmic',
    zone: 1,
    x: 245,
    y: 282,
    challengeType: 'standup',
    questTitle: 'Panggung Stand-Up Comedy Vintage 1894',
    introLines: [],
    doneLines: []
  },
  {
    id: 'tower_keeper',
    zone: 1,
    x: 616,
    y: 472,
    challengeType: 'endless_tower',
    questTitle: 'Menara Kronik Abadi (Lantai 1 sampai Tak Terbatas)',
    introLines: [],
    doneLines: []
  },
  {
    id: 'orwell',
    zone: 1,
    x: 910,
    y: 520,
    challengeType: 'academy_lit',
    questTitle: 'Taman Sastra Klasik & Arsip Orwell (1984 & Animal Farm)',
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
    questTitle: 'Bongkar Teori Kang Deden',
    introLines: [
      'Ssst! Sini merapat! Aku punya dua rahasia alam semesta yang jarang diketahui orang warung.',
      'Berani tebak mana fakta beneran dan mana karangan bebas sambil goreng tempe?'
    ],
    doneLines: ['Ampun deh! Nggak mempan digocekin ternyata. Wawasanmu gacor!']
  },
  {
    id: 'budi',
    zone: 1,
    x: 740,
    y: 600,
    challengeType: 'fact',
    questionCount: 2,
    questTitle: 'Audit Grup WA Pak Budi',
    introLines: [
      'Baru saja masuk pesan berantai dari grup alumni! Katanya valid 100 persen.',
      'Coba bantu Bapak pisahkan mana fakta sains asli dan mana mitos lawas!'
    ],
    doneLines: ['Untung belum Bapak teruskan ke grup RT! Terima kasih ya!']
  },

  // ZONA 2: DISTRIK BAHASA & AKADEMI (BELAJAR KOREA, JEPANG, INGGRIS, KBBI!)
  {
    id: 'sora',
    zone: 2,
    x: 2070,
    y: 255,
    challengeType: 'academy_korean',
    questTitle: 'Akademi Korea: Belajar Hangul & Pesan Kopi Seoul',
    introLines: [
      'Annyeonghaseyo! Selamat datang di Paviliun Bahasa Korea!',
      'Di sini kamu bisa belajar dasar huruf Hangul, mendengarkan pelafalan asli bahasa Korea, lalu langsung praktik pesan kopi di kafe Seoul!'
    ],
    doneLines: ['Daebak! Pelafalan dan sopan santun Koreamu makin luwes. Mampir lagi kapan saja kalau mau dengar ulang Hangul!']
  },
  {
    id: 'kenji',
    zone: 2,
    x: 2070,
    y: 615,
    challengeType: 'academy_polyglot',
    questTitle: 'Paviliun Poliglot: Konsep Jepang & Idiom Inggris',
    introLines: [
      'Otsukaresama! Di Paviliun Poliglot ini kita belajar konsep budaya Jepang seperti Ikigai dan Kaizen, plus idiom bahasa Inggris elegan buat presentasi!',
      'Pelajari kartunya dan dengarkan suaranya dulu, baru coba latihan singkatnya!'
    ],
    doneLines: ['Subarashii! Kosakata lintas bahasamu makin berkelas!']
  },
  {
    id: 'rina',
    zone: 2,
    x: 1620,
    y: 255,
    challengeType: 'diction',
    questionCount: 3,
    questTitle: 'Balai Pustaka: Audit KBBI & EYD V',
    introLines: [
      'Selamat datang di Balai Pustaka! Di Distrik Bahasa ini, satu salah kaprah kata bisa membalik makna satu paragraf.',
      'Tunjukkan ketajaman KBBI VI dan EYD V kamu di hadapanku!'
    ],
    doneLines: ['Lugas dan presisi! Sekarang lanjut pelajari bahasa Korea di timur atau langsung menuju Segel Gerbang Siber!']
  },
  {
    id: 'siska',
    zone: 2,
    x: 1620,
    y: 615,
    challengeType: 'diction',
    questionCount: 2,
    questTitle: 'Guild Startup: Terjemahkan Jargon Korporat',
    introLines: [
      'Hi Petualang! Bantu aku mengubah jargon korporat yang berbelit menjadi kalimat Indonesia yang tajam dan berkelas ya!'
    ],
    doneLines: ['Kalimat presentasiku langsung bersih dan ngena! Terima kasih!']
  },

  // ZONA 3: DISTRIK SIBER & AI LAB (/berita-terkini!)
  {
    id: 'vega',
    zone: 3,
    x: 3040,
    y: 260,
    challengeType: 'academy_cyber',
    questTitle: 'Pusat Komando SOC: Terobosan Siber AI & Radar /berita-terkini',
    introLines: [
      'Lapor, Petualang! Kamu memasuki Distrik Siber & AI Lab. Di layar ini tersimpan ringkasan terobosan baru keamanan siber (Post-Quantum, Passkeys, Keamanan AI, IIV/SCADA) sekaligus peta 21 sumber berita global /berita-terkini!',
      'Pelajari intelijennya di Terminal Radar ini, lalu bersihkan Phishing Drone dan Prompt-Injection Wyrm yang berkeliaran di sektor ini dengan pertarungan Attack & Defense!'
    ],
    doneLines: ['Radar /berita-terkini tetap menyala 24 jam! Buka kapan saja untuk membaca terobosan siber atau latihan briefing analis.']
  },

  // ZONA 4: BENTENG IIV / SCADA GRID
  {
    id: 'bima',
    zone: 4,
    x: 3040,
    y: 1340,
    challengeType: 'story_iiv',
    questTitle: 'Misi IIV/CII: Lindungi Gardu Listrik & Sistem SCADA',
    introLines: [
      'Siaga penuh di Benteng IIV! Sistem energi, air, rumah sakit, dan transportasi bergantung pada perlindungan jaringan OT/SCADA di sini.',
      'Ransomware Titan di barat laut dan SCADA Worm di tenggara sedang mencoba menembus gardu kita! Hadapi keduanya dengan strategi SERANG, BERTAHAN (Zero-Trust Shield), dan COUNTER SIBER!',
      'Setelah gardu aman, pecahkan Segel Matematika di Jembatan Barat menuju Lembah Logika!'
    ],
    repeatLines: ['Gardu listrik aman terkendali! Kalau mau uji ulang refleks Attack & Defense, musuh siber siap dilatih lagi.']
  },

  // ZONA 5: LEMBAH LOGIKA & DEBAT
  {
    id: 'fikri',
    zone: 5,
    x: 1960,
    y: 1170,
    challengeType: 'fallacy',
    questionCount: 3,
    questTitle: 'Duel Sesat Pikir & Ruang Retorika',
    introLines: [
      'Selamat datang di Lembah Logika! Sebelum menantang Puncak Orator, patahkan tiga jurus sesat pikirku dengan tenang dan elegan!'
    ],
    doneLines: ['Perisai sesat pikirku runtuh! Kamu juga bisa mampir ke Hakim Nalar dan buka Paviliun Retorika untuk belajar kerangka PREP!']
  },
  {
    id: 'hakim',
    zone: 5,
    x: 1520,
    y: 1170,
    challengeType: 'academy_rhetoric',
    questTitle: 'Paviliun Retorika: Belajar Kerangka Ngomong Tajam (PREP)',
    introLines: [
      'Bicara cerdas itu ada rumusnya! Masuk ke Ruang Belajar Retorika ini untuk mempelajari kerangka PREP, teknik jeda 2 detik, dan cara tetap tenang saat diserang debat.'
    ],
    doneLines: ['Kerangka retorikamu sudah kokoh! Kalahkan Golem Sesat Pikir di selatan lalu pecahkan Obelisk Matematika menuju Puncak Orator!']
  },

  // ZONA 6: PUNCAK AMFITEATER ORATOR
  {
    id: 'maestro',
    zone: 6,
    x: 540,
    y: 1240,
    challengeType: 'stage',
    questionCount: 1,
    questTitle: 'Misi Puncak: Ujian Orasi 30 Detik Archon Lidah Emas',
    introLines: [
      'Luar biasa! Kamu telah menjelajahi 6 wilayah, memecahkan 5 Segel Matematika, belajar lintas bahasa, hingga membungkam ancaman siber!',
      'Saatnya ujian puncak: naik ke panggung, nyalakan mikrofon lokal (atau ketik kilat), dan sampaikan orasi 30 detik yang tajam memakai fakta pemantik dan dua kata sakti!'
    ],
    doneLines: ['Gelar Archon Lidah Emas resmi milikmu! Naik ke panggung kapan saja untuk melatih topik orasi baru!']
  }
];

export const LANDMARKS = [
  // Zona 1: Desa Warkop 1894 + Panggung Stand-Up Vintage + Menara Kronik Abadi
  { type: 'warkop', x: 350, y: 170, w: 200, h: 95, solid: true, label: 'KEDAI BANG JAJA 1894' },
  { type: 'standup_stage', x: 185, y: 190, w: 120, h: 70, solid: true, label: 'OPEN-MIC STAND-UP' },
  { type: 'endless_tower', x: 585, y: 390, w: 62, h: 62, solid: true, label: 'MENARA ABADI' },
  { type: 'library', x: 840, y: 425, w: 150, h: 72, solid: true, label: 'ARSIP ORWELL' },
  { type: 'posronda', x: 765, y: 105, w: 115, h: 72, solid: true, label: 'POS RONDA' },
  { type: 'pond', x: 140, y: 560, w: 185, h: 110, solid: true },

  // Zona 2: Distrik Bahasa & Akademi
  { type: 'library', x: 1500, y: 100, w: 235, h: 105, solid: true, label: 'BALAI PUSTAKA' },
  { type: 'hanok', x: 1950, y: 100, w: 240, h: 105, solid: true, label: 'AKADEMI KOREA (한글)' },
  { type: 'fountain', x: 1790, y: 365, w: 115, h: 115, solid: true },
  { type: 'guild', x: 1520, y: 485, w: 190, h: 85, solid: true, label: 'GUILD STARTUP' },
  { type: 'polyglot', x: 1960, y: 485, w: 225, h: 85, solid: true, label: 'PAVILIUN POLIGLOT' },

  // Zona 3: Distrik Siber & AI Lab
  { type: 'cyber_hub', x: 2900, y: 95, w: 280, h: 115, solid: true, label: 'SOC AI · /BERITA-TERKINI' },
  { type: 'server', x: 2630, y: 240, w: 58, h: 86, solid: true },
  { type: 'server', x: 3390, y: 260, w: 58, h: 86, solid: true },

  // Zona 4: Benteng IIV / SCADA Grid
  { type: 'scada_station', x: 2905, y: 1175, w: 270, h: 110, solid: true, label: 'GARDU IIV / SCADA' },
  { type: 'turbine', x: 2640, y: 1040, w: 72, h: 72, solid: true },
  { type: 'turbine', x: 3370, y: 1260, w: 72, h: 72, solid: true },

  // Zona 5: Lembah Logika
  { type: 'pillar', x: 1850, y: 1090, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 2070, y: 1090, w: 38, h: 38, solid: true },
  { type: 'library', x: 1410, y: 1020, w: 220, h: 98, solid: true, label: 'RUANG RETORIKA' },

  // Zona 6: Puncak Amfiteater Orator
  { type: 'amphitheater', x: 360, y: 1110, w: 360, h: 280, solid: false },
  { type: 'stage_mic', x: 516, y: 1165, w: 48, h: 32, solid: true }
];

export const TREES = [
  // Zona 1
  { x: 95, y: 115, style: 'pine' }, { x: 250, y: 115, style: 'oak' },
  { x: 635, y: 115, style: 'oak' }, { x: 990, y: 130, style: 'pine' },
  { x: 1005, y: 240, style: 'oak' }, { x: 110, y: 340, style: 'oak' },
  { x: 110, y: 720, style: 'pine' }, { x: 600, y: 710, style: 'oak' },
  { x: 1015, y: 550, style: 'oak' },
  // Zona 2
  { x: 1310, y: 245, style: 'sakura' }, { x: 1820, y: 125, style: 'sakura' },
  { x: 2295, y: 245, style: 'sakura' }, { x: 1330, y: 695, style: 'sakura' },
  { x: 1835, y: 710, style: 'sakura' }, { x: 2290, y: 690, style: 'sakura' },
  // Zona 3 (Cyber neon pylons)
  { x: 2560, y: 140, style: 'cyber_pylon' }, { x: 2770, y: 140, style: 'cyber_pylon' },
  { x: 3280, y: 140, style: 'cyber_pylon' }, { x: 3500, y: 680, style: 'cyber_pylon' },
  { x: 2580, y: 680, style: 'cyber_pylon' },
  // Zona 4 (SCADA energy pylons)
  { x: 2570, y: 1010, style: 'energy_pylon' }, { x: 3490, y: 1010, style: 'energy_pylon' },
  { x: 2570, y: 1500, style: 'energy_pylon' }, { x: 3490, y: 1640, style: 'energy_pylon' },
  // Zona 5 (Torches & Cypress)
  { x: 1330, y: 1010, style: 'torch' }, { x: 1710, y: 1010, style: 'torch' },
  { x: 2240, y: 1040, style: 'cypress' }, { x: 2240, y: 1480, style: 'cypress' },
  { x: 1480, y: 1640, style: 'torch' }, { x: 2040, y: 1640, style: 'torch' },
  // Zona 6 (Star lanterns)
  { x: 150, y: 1000, style: 'star_lantern' }, { x: 340, y: 1020, style: 'star_lantern' },
  { x: 780, y: 1020, style: 'star_lantern' }, { x: 980, y: 1020, style: 'star_lantern' },
  { x: 210, y: 1560, style: 'star_lantern' }, { x: 860, y: 1560, style: 'star_lantern' }
];

// Alur Quest Utama bergaya Genshin Impact lintas 6 Wilayah (Quest Cerita + Akademi Belajar + Attack-Defense Siber + Segel Matematika!)
export function getActiveMainQuest(save) {
  const defeated = save.defeatedEnemies || [];
  const badges = save.academyBadges || [];

  if (!save.talkedNpcs.includes('jaja')) {
    return {
      chapter: 'Misi Utama I · Desa Warkop',
      title: 'Temui Bang Jaja di Gerobak Kopi',
      hint: 'Jalan ke Gerobak Warkop dan tekan [E] untuk menerima peta misi.',
      target: { x: 450, y: 310, label: 'Bang Jaja' }
    };
  }
  if (!save.completedNpcs.includes('deden')) {
    return {
      chapter: 'Misi Utama I · Desa Warkop',
      title: 'Bongkar Teori Kang Deden',
      hint: 'Hampiri Kang Deden di Pos Ronda utara Desa Warkop.',
      target: { x: 820, y: 220, label: 'Kang Deden' }
    };
  }
  if (!defeated.includes('slime_hoaks')) {
    return {
      chapter: 'Latihan Tempur Attack & Defense',
      title: 'Kalahkan Slime Hoaks Berantai',
      hint: 'Hampiri Slime Hoaks di selatan Desa Warkop untuk belajar jurus SERANG, BERTAHAN, dan COUNTER!',
      target: { x: 420, y: 590, label: 'Slime Hoaks' }
    };
  }
  if (!save.solvedGates.includes('gate-1')) {
    return {
      chapter: 'Segel Matematika #1',
      title: 'Buka Jembatan ke Distrik Bahasa (Lv. 2)',
      hint: 'Dekati Jembatan Timur Desa Warkop dan pecahkan 3 Rune Matematika.',
      target: { x: 1068, y: 400, label: 'Segel Matematika #1' }
    };
  }
  if (!badges.includes('academy-korean')) {
    return {
      chapter: 'Misi Utama II · Akademi Bahasa',
      title: 'Belajar Bahasa Korea di Paviliun Sora-ssi',
      hint: 'Kunjungi Paviliun Akademi Korea di timur laut Distrik Bahasa untuk belajar Hangul, dengar suara, dan praktik kafe Seoul!',
      target: { x: 2070, y: 255, label: 'Sora-ssi (Akademi Korea)' }
    };
  }
  if (!save.completedNpcs.includes('rina')) {
    return {
      chapter: 'Misi Utama II · Distrik Bahasa',
      title: 'Lulus Audit KBBI dari Teh Rina',
      hint: 'Temui Teh Rina di depan Balai Pustaka Distrik Bahasa.',
      target: { x: 1620, y: 255, label: 'Teh Rina' }
    };
  }
  if (!save.solvedGates.includes('gate-2')) {
    return {
      chapter: 'Segel Matematika #2',
      title: 'Buka Gerbang Distrik Siber & AI Lab (Lv. 3)',
      hint: 'Dekati Jembatan Timur Distrik Bahasa dan pecahkan 3 Rune Aljabar & Biner!',
      target: { x: 2308, y: 400, label: 'Segel Matematika #2' }
    };
  }
  if (!badges.includes('academy-cyber')) {
    return {
      chapter: 'Misi Utama III · Radar /berita-terkini',
      title: 'Pelajari Terobosan Siber di SOC Komandan Vega',
      hint: 'Masuki Pusat Komando SOC AI di Distrik Siber untuk membaca terobosan siber & 21 sumber /berita-terkini.',
      target: { x: 3040, y: 260, label: 'Komandan Vega' }
    };
  }
  if (!defeated.includes('prompt_wyrm')) {
    return {
      chapter: 'Misi Tempur Siber · AI Security',
      title: 'Tumbangkan Prompt-Injection Wyrm',
      hint: 'Lawan Prompt-Injection Wyrm di Distrik Siber memakai serangan & Counter AI!',
      target: { x: 3320, y: 520, label: 'Prompt-Injection Wyrm' }
    };
  }
  if (!save.solvedGates.includes('gate-3')) {
    return {
      chapter: 'Segel Matematika #3',
      title: 'Buka Gardu Benteng IIV/SCADA (Lv. 4)',
      hint: 'Dekati Jembatan Selatan Distrik Siber dan pecahkan 3 Rune Rasio & Bit Kriptografi!',
      target: { x: 3040, y: 748, label: 'Segel Matematika #3' }
    };
  }
  if (!defeated.includes('ransomware_titan')) {
    return {
      chapter: 'Misi Utama IV · Pertahanan IIV/CII',
      title: 'Hancurkan Ransomware Titan di Benteng IIV',
      hint: 'Gunakan Zero-Trust Shield (BERTAHAN) dan Counter untuk melumpuhkan Ransomware Titan!',
      target: { x: 2790, y: 1210, label: 'Ransomware Titan' }
    };
  }
  if (!save.solvedGates.includes('gate-4')) {
    return {
      chapter: 'Segel Matematika #4',
      title: 'Buka Jalan ke Lembah Logika (Lv. 5)',
      hint: 'Dekati Jembatan Barat Benteng IIV dan pecahkan 3 Rune Persamaan & Modulo!',
      target: { x: 2528, y: 1340, label: 'Segel Matematika #4' }
    };
  }
  if (!save.completedNpcs.includes('fikri')) {
    return {
      chapter: 'Misi Utama V · Lembah Logika',
      title: 'Duel Sesat Pikir Lawan Mas Fikri',
      hint: 'Masuki Lembah Logika dan patahkan 3 jurus sesat pikir Mas Fikri!',
      target: { x: 1960, y: 1170, label: 'Mas Fikri' }
    };
  }
  if (!save.solvedGates.includes('gate-5')) {
    return {
      chapter: 'Segel Matematika #5 (Final)',
      title: 'Buka Puncak Amfiteater Orator (Lv. 6)',
      hint: 'Dekati Obelisk Barat Lembah Logika dan pecahkan 3 Rune Matematika Puncak!',
      target: { x: 1288, y: 1340, label: 'Segel Matematika #5' }
    };
  }
  if (!defeated.includes('deepfake_boss')) {
    return {
      chapter: 'Boss Tempur Siber Final',
      title: 'Kalahkan Overlord Deepfake di Puncak!',
      hint: 'Bungkam Overlord Deepfake di Amfiteater Langit dengan Attack, Defense, dan Counter C2PA!',
      target: { x: 780, y: 1350, label: 'Overlord Deepfake' }
    };
  }
  if (!save.completedNpcs.includes('maestro')) {
    return {
      chapter: 'Misi Puncak VI · Archon Lidah Emas',
      title: 'Ujian Orasi 30 Detik Maestro Lidah Emas',
      hint: 'Naik ke Panggung Amfiteater dan sampaikan orasi 30 detik memakai 2 Kata Sakti!',
      target: { x: 540, y: 1240, label: 'Maestro Lidah Emas' }
    };
  }
  return {
    chapter: 'Archon Siber & Lidah Emas',
    title: 'Jelajah Bebas, Lengkapi Codex & Lencana!',
    hint: 'Semua 6 wilayah terbuka! Kunjungi Paviliun Poliglot, kumpulkan 12 peti harta, atau latih ulang duel siber.',
    target: null
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

  // Dua sungai vertikal (1120..1240 dan 2360..2480) dan satu sungai horizontal (800..920)
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
