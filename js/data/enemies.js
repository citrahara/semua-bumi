// 7 Penjaga Anomali & Ancaman Siber dengan Skala Jilid (Volume I, II, III ... tak terbatas).
// Musuh di bab lebih tinggi dan Jilid lanjutan memiliki Armor/Perisai sendiri dan pola taktis agresif.

export const ENEMIES = [
  {
    id: 'slime_hoaks',
    name: 'Gema Hoaks',
    title: 'Anomali Bab I',
    zone: 1,
    x: 420,
    y: 590,
    patrolRadius: 65,
    color: '#7EA658',
    accent: '#E2B857',
    maxHp: 90,
    armor: 0,
    atkMin: 11,
    atkMax: 16,
    ultDamage: 28,
    ultName: 'Banjir Pesan Berantai',
    xpReward: 70,
    coinReward: 45,
    intelId: 'fact-06',
    counterQ: {
      prompt: 'Gema Hoaks menyiapkan pesan panik tanpa rujukan primer. Pilih penangkal yang tepat:',
      options: [
        { label: 'Periksa sumber primer dan validasi fakta sebelum meneruskan.', ok: true },
        { label: 'Teruskan ke grup lain agar cepat mendapat tanggapan.', ok: false },
        { label: 'Anggap sahih karena ditulis dengan huruf kapital.', ok: false }
      ],
      explain: 'Memeriksa sumber primer memutus rantai disinformasi seketika.'
    }
  },
  {
    id: 'phishing_drone',
    name: 'Drone Phishing',
    title: 'Ancaman Bab III',
    zone: 3,
    x: 2820,
    y: 470,
    patrolRadius: 85,
    color: '#2E9BB0',
    accent: '#D9534F',
    maxHp: 145,
    armor: 22,
    atkMin: 16,
    atkMax: 22,
    ultDamage: 40,
    ultName: 'Tautan Login Tiruan',
    xpReward: 105,
    coinReward: 75,
    intelId: 'cyber-passkey',
    counterQ: {
      prompt: 'Email mendesak mengancam pemblokiran akun dalam 5 menit lewat tautan eksternal. Pilih mitigasi terkuat:',
      options: [
        { label: 'Periksa domain asli secara manual dan gunakan Passkey / FIDO2.', ok: true },
        { label: 'Segera masuk lewat tautan itu sebelum akun terkunci.', ok: false },
        { label: 'Ganti warna tema peramban lalu muat ulang.', ok: false }
      ],
      explain: 'Passkey FIDO2 terikat secara kriptografis pada domain asli sehingga menolak situs tiruan.'
    }
  },
  {
    id: 'prompt_wyrm',
    name: 'Wyrm Injeksi',
    title: 'Ancaman AI · Bab III',
    zone: 3,
    x: 3320,
    y: 520,
    patrolRadius: 80,
    color: '#8E5BA8',
    accent: '#4BA3B8',
    maxHp: 165,
    armor: 30,
    atkMin: 18,
    atkMax: 25,
    ultDamage: 45,
    ultName: 'Pembajakan Instruksi Sistem',
    xpReward: 125,
    coinReward: 90,
    intelId: 'cyber-llm',
    counterQ: {
      prompt: 'Teks tersembunyi di dokumen menyuruh agen AI mengabaikan aturan dan membocorkan data. Pilih pertahanan:',
      options: [
        { label: 'Terapkan least privilege, pisahkan data eksternal, dan wajibkan persetujuan manusia.', ok: true },
        { label: 'Berikan agen AI hak akses penuh agar lebih mandiri.', ok: false },
        { label: 'Izinkan semua dokumen mengubah instruksi sistem.', ok: false }
      ],
      explain: 'Hak akses minimal dan isolasi data eksternal mematahkan Indirect Prompt Injection.'
    }
  },
  {
    id: 'ransomware_titan',
    name: 'Titan Ransomware',
    title: 'Ancaman IIV · Bab IV',
    zone: 4,
    x: 2790,
    y: 1210,
    patrolRadius: 80,
    color: '#C85232',
    accent: '#E2B857',
    maxHp: 195,
    armor: 42,
    atkMin: 21,
    atkMax: 28,
    ultDamage: 52,
    ultName: 'Enkripsi Massal Layanan',
    xpReward: 145,
    coinReward: 110,
    intelId: 'cyber-zerotrust',
    counterQ: {
      prompt: 'Ransomware mulai menjalar dari satu titik kerja ke server rumah sakit. Langkah Zero-Trust yang tepat:',
      options: [
        { label: 'Isolasi endpoint, mikrosegmentasi jaringan, dan pulihkan dari backup offline (immutable).', ok: true },
        { label: 'Buka seluruh port jaringan agar proses salin data lebih cepat.', ok: false },
        { label: 'Hapus log audit untuk mengurangi beban server.', ok: false }
      ],
      explain: 'Mikrosegmentasi memutus gerak menyamping, sementara backup immutable menggagalkan pemerasan.'
    }
  },
  {
    id: 'scada_worm',
    name: 'Sentinel SCADA',
    title: 'Ancaman OT · Bab IV',
    zone: 4,
    x: 3320,
    y: 1460,
    patrolRadius: 75,
    color: '#D49028',
    accent: '#4BA3B8',
    maxHp: 210,
    armor: 48,
    atkMin: 22,
    atkMax: 30,
    ultDamage: 54,
    ultName: 'Sabotase PLC Gardu',
    xpReward: 155,
    coinReward: 120,
    intelId: 'cyber-iiv',
    counterQ: {
      prompt: 'Serangan mencoba melompat dari jaringan kantor (IT) ke pengontrol turbin (OT/PLC). Pilih arsitektur penangkal:',
      options: [
        { label: 'Pisahkan ketat jaringan IT dan OT (DMZ / Purdue) serta pantau anomali protokol industri.', ok: true },
        { label: 'Hubungkan PLC langsung ke internet publik tanpa firewall.', ok: false },
        { label: 'Gunakan sandi bawaan pabrik agar mudah diingat operator.', ok: false }
      ],
      explain: 'Segmentasi tegas IT-OT menjaga sistem kendali infrastruktur vital dari paparan publik.'
    }
  },
  {
    id: 'fallacy_golem',
    name: 'Golem Sofisme',
    title: 'Penjaga Bab V',
    zone: 5,
    x: 1800,
    y: 1490,
    patrolRadius: 75,
    color: '#8D7364',
    accent: '#E2B857',
    maxHp: 205,
    armor: 45,
    atkMin: 21,
    atkMax: 29,
    ultDamage: 50,
    ultName: 'Distorsi Strawman & Pengalihan',
    xpReward: 150,
    coinReward: 110,
    intelId: 'fall-02',
    counterQ: {
      prompt: 'Lawan memelintir argumenmu jadi ekstrem lalu mengalihkan bahasan ke kesalahan pihak lain. Respons paling jitu:',
      options: [
        { label: 'Luruskan pernyataan aslimu secara tenang lalu tarik kembali ke inti persoalan.', ok: true },
        { label: 'Balas menyerang karakter pribadi lawan.', ok: false },
        { label: 'Setujui versi pelintirannya agar diskusi cepat selesai.', ok: false }
      ],
      explain: 'Menolak distorsi (strawman) dan pengalihan (whataboutism) dengan tenang meruntuhkan retorika kosong.'
    }
  },
  {
    id: 'deepfake_boss',
    name: 'Dalang Deepfake',
    title: 'Penjaga Puncak · Bab VI',
    zone: 6,
    x: 780,
    y: 1350,
    patrolRadius: 55,
    color: '#6C47B5',
    accent: '#E2B857',
    maxHp: 260,
    armor: 65,
    atkMin: 25,
    atkMax: 34,
    ultDamage: 62,
    ultName: 'Kloning Suara & Wajah',
    xpReward: 220,
    coinReward: 180,
    intelId: 'cyber-c2pa',
    counterQ: {
      prompt: 'Panggilan video menyerupai pimpinan meminta transfer darurat di luar prosedur. Pilih verifikasi modern:',
      options: [
        { label: 'Verifikasi melalui kanal terpisah (out-of-band), sandi kesepakatan, dan bukti asal C2PA.', ok: true },
        { label: 'Segera setujui karena wajah dan suaranya identik.', ok: false },
        { label: 'Tangkap layar video lalu bagikan di ruang obrolan umum.', ok: false }
      ],
      explain: 'Verifikasi kanal terpisah dan kredensial kriptografis C2PA mematahkan penipuan deepfake.'
    }
  }
];

export function scaleEnemyForVolume(enemy, volume = 1) {
  const v = Math.max(1, volume || 1);
  if (v === 1) return { ...enemy };
  const hpMult = 1 + (v - 1) * 0.45;
  const atkMult = 1 + (v - 1) * 0.34;
  const armorBonus = (v - 1) * 26;
  const rewardMult = 1 + (v - 1) * 0.4;
  return {
    ...enemy,
    title: `${enemy.title} · Jilid ${v}`,
    maxHp: Math.round(enemy.maxHp * hpMult),
    armor: Math.round((enemy.armor || 0) * hpMult + armorBonus),
    atkMin: Math.round(enemy.atkMin * atkMult),
    atkMax: Math.round(enemy.atkMax * atkMult),
    ultDamage: Math.round(enemy.ultDamage * atkMult),
    xpReward: Math.round(enemy.xpReward * rewardMult),
    coinReward: Math.round(enemy.coinReward * rewardMult)
  };
}

export function renderEnemySVG(enemyId) {
  const e = ENEMIES.find((x) => x.id === enemyId) || ENEMIES[0];
  if (enemyId === 'slime_hoaks') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#1D2618" stroke="${e.color}" stroke-width="2.5"/>
        <path d="M22 86 C22 44, 42 32, 60 32 C78 32, 98 44, 98 86 Z" fill="${e.color}" stroke="#1B1714" stroke-width="3"/>
        <circle cx="46" cy="60" r="6" fill="#1B1714"/><circle cx="74" cy="60" r="6" fill="#1B1714"/>
        <circle cx="48" cy="58" r="2" fill="#FFF"/><circle cx="76" cy="58" r="2" fill="#FFF"/>
        <path d="M46 74 Q60 66 74 74" stroke="#1B1714" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (enemyId === 'phishing_drone') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#122129" stroke="${e.color}" stroke-width="2.5"/>
        <line x1="20" y1="36" x2="100" y2="36" stroke="${e.color}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="24" cy="34" rx="14" ry="4" fill="#B2EBF2"/><ellipse cx="96" cy="34" rx="14" ry="4" fill="#B2EBF2"/>
        <rect x="34" y="40" width="52" height="42" rx="14" fill="#263238" stroke="${e.color}" stroke-width="3"/>
        <circle cx="60" cy="61" r="11" fill="${e.accent}"/><circle cx="60" cy="61" r="4" fill="#FFF"/>
        <path d="M56 82 L56 96 C56 103, 68 103, 68 95" fill="none" stroke="#E2B857" stroke-width="3.5" stroke-linecap="round"/>
      </svg>
    `;
  }
  if (enemyId === 'prompt_wyrm') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#21142B" stroke="${e.color}" stroke-width="2.5"/>
        <path d="M26 92 C28 50, 92 50, 94 92" fill="none" stroke="${e.color}" stroke-width="18" stroke-linecap="round"/>
        <polygon points="34,46 60,22 86,46 74,72 46,72" fill="#5D377A" stroke="${e.accent}" stroke-width="2.5"/>
        <polygon points="44,50 54,54 44,58" fill="#4BA3B8"/><polygon points="76,50 66,54 76,58" fill="#4BA3B8"/>
      </svg>
    `;
  }
  if (enemyId === 'ransomware_titan') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#2A1612" stroke="${e.color}" stroke-width="2.5"/>
        <path d="M40 46 V32 C40 18, 80 18, 80 32 V46" fill="none" stroke="#E2B857" stroke-width="8" stroke-linecap="round"/>
        <rect x="28" y="44" width="64" height="54" rx="12" fill="${e.color}" stroke="#1B1714" stroke-width="3"/>
        <polygon points="42,60 54,66 42,70" fill="#1B1714"/><polygon points="78,60 66,66 78,70" fill="#1B1714"/>
        <circle cx="60" cy="78" r="6" fill="#E2B857"/><rect x="57" y="80" width="6" height="11" fill="#E2B857"/>
      </svg>
    `;
  }
  if (enemyId === 'scada_worm') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#261F12" stroke="${e.color}" stroke-width="2.5"/>
        <circle cx="60" cy="62" r="32" fill="#374151" stroke="${e.color}" stroke-width="4" stroke-dasharray="10 6"/>
        <circle cx="60" cy="62" r="18" fill="#111827" stroke="#4BA3B8" stroke-width="3"/>
        <path d="M62 48 L52 64 L61 64 L57 77 L69 60 L60 60 Z" fill="${e.color}"/>
      </svg>
    `;
  }
  if (enemyId === 'fallacy_golem') {
    return `
      <svg class="char-svg" viewBox="0 0 120 120">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#241E1A" stroke="${e.color}" stroke-width="2.5"/>
        <polygon points="30,96 24,52 44,28 76,28 96,52 90,96" fill="#795548" stroke="#1B1714" stroke-width="3"/>
        <rect x="40" y="50" width="12" height="8" fill="#E2B857"/><rect x="68" y="50" width="12" height="8" fill="#E2B857"/>
        <path d="M44 76 L54 70 L66 76 L76 70" stroke="#1B1714" stroke-width="3.5" fill="none"/>
      </svg>
    `;
  }
  return `
    <svg class="char-svg" viewBox="0 0 120 120">
      <rect x="4" y="4" width="112" height="112" rx="22" fill="#1D1233" stroke="${e.accent}" stroke-width="2.5"/>
      <path d="M30 42 C30 22, 90 22, 90 42 L84 86 Q60 102 36 86 Z" fill="${e.color}" stroke="${e.accent}" stroke-width="3"/>
      <line x1="60" y1="26" x2="60" y2="96" stroke="#4BA3B8" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="46" cy="54" r="6" fill="#E2B857"/><rect x="68" y="50" width="12" height="8" fill="#4BA3B8"/>
      <path d="M44 74 Q60 84 76 74" stroke="#E2B857" stroke-width="3" fill="none"/>
    </svg>
  `;
}
