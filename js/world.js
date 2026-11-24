// Definisi Peta Dunia Terbuka Warkop Impact (2400 x 1600 px)
// 4 Wilayah berbeda, 3 Gerbang Segel Matematika, 8 NPC ber-quest, 4 Waypoint Fast-Travel, 7 Peti Harta Karun.

export const WORLD_W = 2400;
export const WORLD_H = 1600;

export const ZONES = [
  {
    id: 1,
    name: 'Desa Warkop',
    subtitle: 'Lv. 1 · Lembah Fakta & Mitos',
    rect: { x: 0, y: 0, w: 1120, h: 760 },
    ground: '#7FB069',
    groundAlt: '#74A45E',
    path: '#E5CFA3',
    accent: '#E64A19',
    particleType: 'leaf'
  },
  {
    id: 2,
    name: 'Kota Bahasa',
    subtitle: 'Lv. 2 · Taman Diksi & EYD V',
    rect: { x: 1280, y: 0, w: 1120, h: 760 },
    ground: '#E7D8C0',
    groundAlt: '#DECBA9',
    path: '#C8B08A',
    accent: '#C25975',
    particleType: 'petal'
  },
  {
    id: 3,
    name: 'Lembah Logika',
    subtitle: 'Lv. 3 · Benteng Debat Kuno',
    rect: { x: 1280, y: 880, w: 1120, h: 720 },
    ground: '#CFA46B',
    groundAlt: '#C4965C',
    path: '#9E7852',
    accent: '#D98A1A',
    particleType: 'ember'
  },
  {
    id: 4,
    name: 'Puncak Orator',
    subtitle: 'Lv. 4 · Amfiteater Langit',
    rect: { x: 0, y: 880, w: 1120, h: 720 },
    ground: '#2D2847',
    groundAlt: '#26213D',
    path: '#494170',
    accent: '#FFD166',
    particleType: 'star'
  }
];

// Jembatan penyeberangan sungai antarwilayah (dikunci oleh Segel Matematika sampai dipecahkan!)
export const BRIDGES = [
  {
    id: 'gate-1',
    gateLevel: 1,
    orientation: 'horizontal',
    rect: { x: 1104, y: 320, w: 192, h: 120 },
    altar: { x: 1068, y: 380 },
    label: 'Segel Matematika Lv. 2 (Kota Bahasa)',
    targetZone: 2
  },
  {
    id: 'gate-2',
    gateLevel: 2,
    orientation: 'vertical',
    rect: { x: 1780, y: 744, w: 120, h: 152 },
    altar: { x: 1840, y: 710 },
    label: 'Segel Matematika Lv. 3 (Lembah Logika)',
    targetZone: 3
  },
  {
    id: 'gate-3',
    gateLevel: 3,
    orientation: 'horizontal',
    rect: { x: 1104, y: 1170, w: 192, h: 120 },
    altar: { x: 1326, y: 1230 },
    label: 'Segel Matematika Lv. 4 (Puncak Orator)',
    targetZone: 4
  }
];

export const WAYPOINTS = [
  { id: 'wp-1', zone: 1, name: 'Waypoint Alun-Alun Warkop', x: 250, y: 420 },
  { id: 'wp-2', zone: 2, name: 'Waypoint Taman Sastra', x: 1470, y: 380 },
  { id: 'wp-3', zone: 3, name: 'Waypoint Gerbang Pilar', x: 1840, y: 1020 },
  { id: 'wp-4', zone: 4, name: 'Waypoint Amfiteater Langit', x: 960, y: 1230 }
];

export const CHESTS = [
  { id: 'chest-1', zone: 1, x: 170, y: 160, tier: 'common', rewardType: 'fact', rewardId: 'fact-01', xp: 45, coins: 30, title: 'Peti Kebun Kopi' },
  { id: 'chest-2', zone: 1, x: 960, y: 630, tier: 'exquisite', rewardType: 'fact', rewardId: 'fact-18', xp: 60, coins: 45, title: 'Peti Pinggir Sungai' },
  { id: 'chest-3', zone: 2, x: 1440, y: 150, tier: 'common', rewardType: 'diction', rewardId: 'dict-08', xp: 55, coins: 40, title: 'Peti Rak Pustaka' },
  { id: 'chest-4', zone: 2, x: 2240, y: 200, tier: 'exquisite', rewardType: 'diction', rewardId: 'dict-17', xp: 70, coins: 55, title: 'Peti Sakura Timur' },
  { id: 'chest-5', zone: 3, x: 2230, y: 1440, tier: 'exquisite', rewardType: 'fallacy', rewardId: 'fall-10', xp: 75, coins: 60, title: 'Peti Pilar Selatan' },
  { id: 'chest-6', zone: 3, x: 1420, y: 1030, tier: 'common', rewardType: 'fact', rewardId: 'fact-24', xp: 65, coins: 50, title: 'Peti Obor Kuno' },
  { id: 'chest-7', zone: 4, x: 200, y: 1040, tier: 'precious', rewardType: 'diction', rewardId: 'dict-20', xp: 100, coins: 90, title: 'Peti Bintang Orator' }
];

export const NPCS = [
  {
    id: 'jaja',
    zone: 1,
    x: 450,
    y: 310,
    color: '#D94E28',
    challengeType: 'story',
    questTitle: 'Misi Utama I: Heboh Hoaks Desa Warkop',
    introLines: [
      'Akhirnya datang juga Petualang! Desa Warkop lagi heboh gara-gara Kang Deden sama Pak Budi debat nggak kelar-kelar sejak subuh.',
      'Keduanya sama-sama yakin paling tahu segalanya. Tolong hampiri Kang Deden di Pos Ronda Utara dan Pak Budi di Bangku Selatan, bongkar mana fakta asli dan mana bualan!',
      'Kalau sudah beres, jembatan ke Kota Bahasa di timur lagi terkunci Segel Matematika. Siapkan otak hitungmu juga ya!'
    ],
    repeatLines: [
      'Kopi masih panas, Petualang! Mau cek papan Quest atau lanjut keliling cari peti harta karun?',
      'Ingat: makin banyak fakta, diksi, dan logika yang kamu buka di Codex, makin gacor gaya bicaramu di dunia nyata!'
    ]
  },
  {
    id: 'deden',
    zone: 1,
    x: 820,
    y: 220,
    color: '#2E5A4C',
    challengeType: 'fact',
    questionCount: 2,
    questTitle: 'Bongkar Teori Kang Deden',
    introLines: [
      'Ssst! Sini merapat! Aku punya dua rahasia alam semesta yang jarang diketahui orang warung.',
      'Berani tebak mana yang fakta beneran dan mana yang aku karang sendiri sambil goreng tempe?'
    ],
    doneLines: [
      'Ampun deh! Nggak mempan digocekin ternyata. Kamu memang berbakat jadi warga warkop paling berisi!'
    ]
  },
  {
    id: 'budi',
    zone: 1,
    x: 700,
    y: 575,
    color: '#3A4F7A',
    challengeType: 'fact',
    questionCount: 2,
    questTitle: 'Audit Grup WA Pak Budi',
    introLines: [
      'Selamat pagi anak muda! Ini baru saja masuk kiriman berantai dari grup alumni SMA tahun 84. Valid banget katanya!',
      'Coba bantu Bapak cek: ini beneran fakta sains atau cuma hoaks awet yang muter terus tiap tahun?'
    ],
    doneLines: [
      'Waduh, untung belum Bapak teruskan ke grup RT! Terima kasih ya, ilmu Bapak nambah banyak hari ini.'
    ]
  },
  {
    id: 'rina',
    zone: 2,
    x: 1640,
    y: 260,
    color: '#6B2D3E',
    challengeType: 'diction',
    questionCount: 3,
    questTitle: 'Misi Utama II: Audit Diksi Teh Rina',
    introLines: [
      'Selamat datang di Kota Bahasa, Petualang! Kamu berhasil memecahkan Segel Matematika pertama.',
      'Di kota ini, satu salah kaprah kata bisa bikin arti kalimat terbalik seratus delapan puluh derajat. Tunjukkan penguasaan KBBI dan EYD V kamu di hadapanku!'
    ],
    doneLines: [
      'Rapi, lugas, dan presisi! Kopi kamu aman, tidak jadi saya tarik. Lanjutkan ke Mbak Siska atau langsung uji Segel Matematika menuju Lembah Logika!'
    ]
  },
  {
    id: 'siska',
    zone: 2,
    x: 2090,
    y: 510,
    color: '#1E3A5F',
    challengeType: 'diction',
    questionCount: 2,
    questTitle: 'Terjemahkan Mantra Startup',
    introLines: [
      'Hi Petualang! Basically tim kita lagi butuh synergy yang super artikulatif untuk nge-boost kalimat obrolan.',
      'Bantu aku memilih diksi Indonesia yang tajam dan bebas jargon berbelit ya!'
    ],
    doneLines: [
      'OMG gila sih, kalimatmu langsung clean dan elegan banget! Aku catat semua di notes presentasiku!'
    ]
  },
  {
    id: 'fikri',
    zone: 3,
    x: 2010,
    y: 1160,
    color: '#4A3728',
    challengeType: 'fallacy',
    questionCount: 3,
    questTitle: 'Misi Utama III: Duel Filsuf Es Teh',
    introLines: [
      'Akhirnya ada lawan bicara yang lolos Segel Aljabar sampai ke Lembah Logika!',
      'Di arena pilar ini, kata-kata manis tak cukup. Aku akan melempar tiga jurus sesat pikir. Patahkan argumenku dengan tenang sampai perisai logikaku runtuh!'
    ],
    doneLines: [
      'Perisai sesat pikirku pecah berkeping-keping! Kamu membantah tanpa bikin orang tersinggung. Itu seni bicara tingkat tinggi!'
    ]
  },
  {
    id: 'hakim',
    zone: 3,
    x: 1560,
    y: 1410,
    color: '#2F3640',
    challengeType: 'fallacy',
    questionCount: 2,
    questTitle: 'Ujian Hakim Nalar',
    introLines: [
      'Berhenti di depan Benteng Argumen! Sebelum menyeberang ke Puncak Orator, buktikan kamu kebal terhadap manipulasi debat.',
      'Selesaikan dua kasus sesat pikir ini dengan balasan yang jernih dan berkelas!'
    ],
    doneLines: [
      'Sidang ditutup dengan pujian! Obelisk Matematika di barat siap mengujimu menuju Puncak Amfiteater Orator.'
    ]
  },
  {
    id: 'maestro',
    zone: 4,
    x: 560,
    y: 1190,
    color: '#3E1F47',
    challengeType: 'stage',
    questionCount: 1,
    questTitle: 'Misi Puncak IV: Ujian Archon Lidah Emas',
    introLines: [
      'Selamat datang di Puncak Amfiteater Langit! Tiga segel matematika telah kamu hancurkan, wawasan dan logikamu sudah teruji.',
      'Kini saatnya ujian terakhir: naik ke panggung, pegang mikrofon (atau ketik kilat), dan sampaikan orasi 30 detik yang kocak memakai fakta pemantik dan dua kata sakti!'
    ],
    doneLines: [
      'Luar biasa tajam! Gelar Archon Lidah Emas resmi milikmu. Kapan pun mau latihan topik orasi baru, naik saja ke panggung ini lagi!'
    ]
  }
];

// Dekorasi visual dan rintangan padat di peta (dengan margin gerak lapang)
export const LANDMARKS = [
  // Zona 1: Gerobak Warkop Bang Jaja, Pos Ronda, Kolam
  { type: 'warkop', x: 350, y: 170, w: 200, h: 95, solid: true, label: 'WARKOP BANG JAJA' },
  { type: 'posronda', x: 770, y: 110, w: 110, h: 72, solid: true, label: 'POS RONDA' },
  { type: 'pond', x: 180, y: 540, w: 200, h: 115, solid: true },

  // Zona 2: Perpustakaan Kota & Air Mancur
  { type: 'library', x: 1520, y: 100, w: 240, h: 110, solid: true, label: 'BALAI PUSTAKA' },
  { type: 'fountain', x: 1850, y: 360, w: 120, h: 120, solid: true },
  { type: 'guild', x: 2030, y: 370, w: 140, h: 90, solid: true, label: 'GUILD STARTUP' },

  // Zona 3: Pilar Kuno Arena Logika
  { type: 'pillar', x: 1860, y: 1080, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 2140, y: 1080, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 1860, y: 1270, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 2140, y: 1270, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 1470, y: 1320, w: 38, h: 38, solid: true },
  { type: 'pillar', x: 1650, y: 1320, w: 38, h: 38, solid: true },

  // Zona 4: Amfiteater Panggung Langit
  { type: 'amphitheater', x: 380, y: 1070, w: 360, h: 280, solid: false },
  { type: 'stage_mic', x: 536, y: 1120, w: 48, h: 32, solid: true }
];

// Pepohonan & lentera per zona
export const TREES = [
  // Zone 1 (Hijau rimbun)
  { x: 110, y: 110, style: 'pine', zone: 1 },
  { x: 250, y: 120, style: 'oak', zone: 1 },
  { x: 640, y: 115, style: 'oak', zone: 1 },
  { x: 990, y: 130, style: 'pine', zone: 1 },
  { x: 1010, y: 240, style: 'oak', zone: 1 },
  { x: 120, y: 330, style: 'oak', zone: 1 },
  { x: 110, y: 680, style: 'pine', zone: 1 },
  { x: 470, y: 660, style: 'oak', zone: 1 },
  { x: 890, y: 660, style: 'pine', zone: 1 },
  { x: 1020, y: 540, style: 'oak', zone: 1 },

  // Zone 2 (Sakura / pohon taman kota)
  { x: 1370, y: 120, style: 'sakura', zone: 2 },
  { x: 1860, y: 120, style: 'sakura', zone: 2 },
  { x: 2140, y: 130, style: 'sakura', zone: 2 },
  { x: 2300, y: 270, style: 'sakura', zone: 2 },
  { x: 1380, y: 640, style: 'sakura', zone: 2 },
  { x: 1620, y: 650, style: 'sakura', zone: 2 },
  { x: 2260, y: 630, style: 'sakura', zone: 2 },

  // Zone 3 (Pohon batu / obor kuno)
  { x: 1380, y: 960, style: 'torch', zone: 3 },
  { x: 1710, y: 960, style: 'torch', zone: 3 },
  { x: 2260, y: 980, style: 'cypress', zone: 3 },
  { x: 2290, y: 1320, style: 'cypress', zone: 3 },
  { x: 1760, y: 1490, style: 'torch', zone: 3 },
  { x: 2060, y: 1490, style: 'torch', zone: 3 },

  // Zone 4 (Lentera bintang langit)
  { x: 160, y: 960, style: 'star_lantern', zone: 4 },
  { x: 340, y: 980, style: 'star_lantern', zone: 4 },
  { x: 780, y: 980, style: 'star_lantern', zone: 4 },
  { x: 980, y: 980, style: 'star_lantern', zone: 4 },
  { x: 220, y: 1440, style: 'star_lantern', zone: 4 },
  { x: 880, y: 1440, style: 'star_lantern', zone: 4 }
];

// Alur Quest Utama bergaya Genshin Impact (mengatur panah kompas emas & teks Quest Tracker!)
export function getActiveMainQuest(save) {
  if (!save.talkedNpcs.includes('jaja')) {
    return {
      chapter: 'Misi Utama I',
      title: 'Temui Bang Jaja di Desa Warkop',
      hint: 'Jalan ke Gerobak Warkop dan tekan [E] untuk bicara dengan Bang Jaja.',
      target: { x: 450, y: 310, label: 'Bang Jaja' }
    };
  }
  if (!save.completedNpcs.includes('deden')) {
    return {
      chapter: 'Misi Utama I',
      title: 'Bongkar Teori Kang Deden',
      hint: 'Hampiri Kang Deden di Pos Ronda utara Desa Warkop (2 Fakta vs Bualan).',
      target: { x: 820, y: 220, label: 'Kang Deden' }
    };
  }
  if (!save.completedNpcs.includes('budi')) {
    return {
      chapter: 'Misi Utama I',
      title: 'Audit Grup WA Pak Budi',
      hint: 'Temui Pak Budi di selatan Desa Warkop untuk menumpas mitos populer.',
      target: { x: 700, y: 575, label: 'Pak Budi' }
    };
  }
  if (!save.solvedGates.includes('gate-1')) {
    return {
      chapter: 'Gerbang Level 2',
      title: 'Pecahkan Segel Matematika #1',
      hint: 'Dekati Jembatan Timur dan selesaikan 3 Rune Aritmetika untuk membuka Kota Bahasa!',
      target: { x: 1068, y: 380, label: 'Segel Matematika #1' }
    };
  }
  if (!save.completedNpcs.includes('rina')) {
    return {
      chapter: 'Misi Utama II',
      title: 'Ujian Diksi Pustakawan Teh Rina',
      hint: 'Masuki Kota Bahasa dan temui Teh Rina di depan Balai Pustaka.',
      target: { x: 1640, y: 260, label: 'Teh Rina' }
    };
  }
  if (!save.completedNpcs.includes('siska')) {
    return {
      chapter: 'Misi Utama II',
      title: 'Bantu Mbak Siska Terjemahkan Jargon',
      hint: 'Temui Mbak Siska di dekat Guild Startup bagian timur Kota Bahasa.',
      target: { x: 2090, y: 510, label: 'Mbak Siska' }
    };
  }
  if (!save.solvedGates.includes('gate-2')) {
    return {
      chapter: 'Gerbang Level 3',
      title: 'Pecahkan Segel Matematika #2',
      hint: 'Dekati Jembatan Selatan Kota Bahasa dan selesaikan 3 Rune Aljabar & Geometri!',
      target: { x: 1840, y: 710, label: 'Segel Matematika #2' }
    };
  }
  if (!save.completedNpcs.includes('fikri')) {
    return {
      chapter: 'Misi Utama III',
      title: 'Duel Logika Lawan Mas Fikri',
      hint: 'Masuki Lembah Logika dan kalahkan sesat pikir Mas Fikri di Arena Pilar.',
      target: { x: 2010, y: 1160, label: 'Mas Fikri' }
    };
  }
  if (!save.completedNpcs.includes('hakim')) {
    return {
      chapter: 'Misi Utama III',
      title: 'Lulus Ujian Hakim Nalar',
      hint: 'Temui Hakim Nalar di selatan Lembah Logika untuk menguji ketajaman bantahanmu.',
      target: { x: 1560, y: 1410, label: 'Hakim Nalar' }
    };
  }
  if (!save.solvedGates.includes('gate-3')) {
    return {
      chapter: 'Gerbang Level 4',
      title: 'Pecahkan Segel Matematika #3',
      hint: 'Hampiri Obelisk Barat Lembah Logika dan pecahkan 3 Rune Final menuju Puncak Orator!',
      target: { x: 1326, y: 1230, label: 'Segel Matematika #3' }
    };
  }
  if (!save.completedNpcs.includes('maestro')) {
    return {
      chapter: 'Misi Puncak IV',
      title: 'Ujian Panggung Maestro Lidah Emas',
      hint: 'Naik ke Panggung Amfiteater Langit dan selesaikan Orasi Spontan 30 Detik!',
      target: { x: 560, y: 1190, label: 'Maestro Lidah Emas' }
    };
  }
  return {
    chapter: 'Archon Lidah Emas',
    title: 'Jelajah Bebas & Lengkapi 100% Codex',
    hint: 'Semua wilayah terbuka! Kumpulkan sisa peti harta atau tantang ulang NPC mana saja untuk memperkaya wawasan.',
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
  // Batas luar dunia
  if (x - radius < 36 || x + radius > WORLD_W - 36 || y - radius < 36 || y + radius > WORLD_H - 36) {
    return { blocked: true, reason: 'border' };
  }

  // Cek apakah berada di atas salah satu jembatan
  for (const br of BRIDGES) {
    const insideBridge =
      x >= br.rect.x &&
      x <= br.rect.x + br.rect.w &&
      y >= br.rect.y &&
      y <= br.rect.y + br.rect.h;
    if (insideBridge) {
      if (solvedGates.includes(br.id)) {
        return { blocked: false };
      }
      // Jika segel belum pecah, bagian tengah jembatan diblokir rune!
      if (br.orientation === 'horizontal' && x + radius > 1138 && x - radius < 1262) {
        return { blocked: true, reason: 'gate', gate: br };
      }
      if (br.orientation === 'vertical' && y + radius > 776 && y - radius < 864) {
        return { blocked: true, reason: 'gate', gate: br };
      }
      return { blocked: false };
    }
  }

  // Sungai pemisah vertikal (x: 1120..1280) & horizontal (y: 760..880)
  if (x + radius > 1120 && x - radius < 1280) {
    return { blocked: true, reason: 'river' };
  }
  if (y + radius > 760 && y - radius < 880) {
    return { blocked: true, reason: 'river' };
  }

  // Landmark padat
  for (const lm of LANDMARKS) {
    if (!lm.solid) continue;
    if (
      x + radius > lm.x &&
      x - radius < lm.x + lm.w &&
      y + radius > lm.y &&
      y - radius < lm.y + lm.h
    ) {
      return { blocked: true, reason: 'landmark' };
    }
  }

  // Batang pohon (radius kecil supaya tidak gampang nyangkut)
  for (const t of TREES) {
    const dx = x - t.x;
    const dy = y - (t.y + 8);
    if (dx * dx + dy * dy < (radius + 14) * (radius + 14)) {
      return { blocked: true, reason: 'tree' };
    }
  }

  return { blocked: false };
}
