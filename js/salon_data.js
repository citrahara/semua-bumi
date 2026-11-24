// Data inti Meja Malam:
// - 6 bahan racikan teh & 9 paduan khas (ala Coffee Talk)
// - 8 dekor 3D dengan 3 bentuk struktur arsitektur berbeda nyata per slot (bukan sekadar ganti warna)
// - Kasus deduksi malam (taktil ala Golden Idol + Strange Horticulture, tanpa kuis A/B/C/D)

import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { FACTS_BANK } from './data/facts.js';
import { KOREAN_ACADEMY, CYBER_LAB, CLASSIC_LIT_ACADEMY } from './data/academy.js';

export const TEA_INGREDIENTS = [
  { id: 'black', name: 'Teh Hitam', color: '#6E3219', tag: 'fokus', note: 'Pekat dan hangat' },
  { id: 'jasmine', name: 'Melati', color: '#D6B86A', tag: 'tenang', note: 'Wangi lembut' },
  { id: 'ginger', name: 'Jahe', color: '#C98A3A', tag: 'hangat', note: 'Pedas menenangkan' },
  { id: 'honey', name: 'Madu', color: '#E0A636', tag: 'manis', note: 'Manis ringan' },
  { id: 'mint', name: 'Mint', color: '#589C76', tag: 'segar', note: 'Dingin menjernihkan' },
  { id: 'cinnamon', name: 'Kayu Manis', color: '#8F4626', tag: 'rempah', note: 'Aroma malam hujan' }
];

export function evaluateTeaBlend(pickedIds) {
  const counts = {};
  for (const id of pickedIds) counts[id] = (counts[id] || 0) + 1;
  const has = (id) => Boolean(counts[id]);

  if (has('ginger') && has('honey')) {
    return {
      name: 'Teh Jahe Madu',
      color: '#C9832B',
      tags: ['hangat', 'manis', 'tenang'],
      vibe: 'Hangat di tenggorokan, pas untuk meredakan lelah malam hujan.'
    };
  }
  if (has('black') && has('cinnamon')) {
    return {
      name: 'Teh Rempah Pekat',
      color: '#5C2512',
      tags: ['fokus', 'rempah', 'hangat'],
      vibe: 'Pekat dengan aroma kayu manis, menjaga pikiran tetap tajam.'
    };
  }
  if (has('jasmine') && has('mint')) {
    return {
      name: 'Melati Mint Jernih',
      color: '#8BB372',
      tags: ['tenang', 'segar'],
      vibe: 'Ringan dan bersih, membantu membaca teks panjang tanpa pening.'
    };
  }
  if (has('jasmine') && has('honey')) {
    return {
      name: 'Melati Madu Malam',
      color: '#D4A84F',
      tags: ['tenang', 'manis'],
      vibe: 'Lembut dan akrab, cocok untuk obrolan pelan.'
    };
  }
  if (has('black') && has('mint')) {
    return {
      name: 'Hitam Mint Tajam',
      color: '#4F3E28',
      tags: ['fokus', 'segar'],
      vibe: 'Tajam dan menyegarkan, cocok saat memeriksa log panjang.'
    };
  }
  if (has('ginger') && has('cinnamon')) {
    return {
      name: 'Wedang Rempah',
      color: '#8D3D1C',
      tags: ['hangat', 'rempah'],
      vibe: 'Aroma rempah kuat yang langsung menghangatkan ruangan.'
    };
  }
  if (has('black')) {
    return {
      name: 'Teh Hitam Seduh',
      color: '#5B2A15',
      tags: ['fokus', 'hangat'],
      vibe: 'Sederhana, jujur, dan pahit seperlunya.'
    };
  }
  if (has('jasmine')) {
    return {
      name: 'Teh Melati Murni',
      color: '#C7AE62',
      tags: ['tenang'],
      vibe: 'Harum tipis yang membuat jeda terasa lega.'
    };
  }
  return {
    name: 'Seduhan Herbal',
    color: '#9C8A52',
    tags: ['tenang', 'hangat'],
    vibe: 'Racikan ringan pelepas penat.'
  };
}

export const REFERENCE_BOOKS = [
  { id: 'book_lit', title: 'Sastra & Bahasa Kuasa', spine: '#6E2B36', short: 'Orwell, Austen, Sherlock, Huxley' },
  { id: 'book_logic', title: 'Indeks Sesat Pikir', spine: '#324B5C', short: '16 pola cacat nalar' },
  { id: 'book_cyber', title: 'Catatan Radar Siber', spine: '#244A47', short: 'AI, SCADA, dan celah terkini' },
  { id: 'book_korean', title: 'Buku Saku Hangul', spine: '#6A4C36', short: 'Frasa Korea + pelafalan suara' },
  { id: 'book_diction', title: 'Kamus Diksi & EYD', spine: '#4A5D3F', short: '20 diksi presisi & salah kaprah' },
  { id: 'book_facts', title: 'Arsip Fakta Sejarah', spine: '#5B4563', short: '24 catatan verifikasi mitos' }
];

// 8 Slot Dekor 3D Ruang & Taman: setiap pilihan gaya punya BENTUK GEOMETRI 3D YANG BENAR-BENAR BERBEDA.
export const SALON_UPGRADES = [
  {
    id: 'desk_lamp',
    name: 'Lampu Meja Baca',
    cost: 1,
    cam: { x: -1.6, y: 1.5, z: 0.4, dist: 3.4, yaw: -0.45, pitch: 0.28 },
    styles: [
      { id: 0, form: 'banker', name: 'Lampu Banker', note: 'Tudung kaca zamrud klasik', color: '#246B47', accent: '#D4A84F' },
      { id: 1, form: 'paper_lantern', name: 'Lentera Kayu', note: 'Rangka kayu kisi kertas hangat', color: '#F2DFC2', accent: '#6B4226' },
      { id: 2, form: 'candelabra', name: 'Tiga Lilin Kuningan', note: 'Tempat lilin tiga cabang menyala', color: '#D4A84F', accent: '#FFF1C2' }
    ]
  },
  {
    id: 'desk_companion',
    name: 'Perangkat Meja Kerja',
    cost: 1,
    cam: { x: 1.5, y: 1.35, z: 0.2, dist: 3.4, yaw: 0.48, pitch: 0.3 },
    styles: [
      { id: 0, form: 'typewriter', name: 'Mesin Tik Antik', note: 'Rangka besi dengan lembaran kertas', color: '#2B2B2E', accent: '#D9C8A9' },
      { id: 1, form: 'gramophone', name: 'Gramofon Kuningan', note: 'Kotak kayu dan terompet berputar', color: '#6E3B23', accent: '#D9B466' },
      { id: 2, form: 'globe', name: 'Bola Dunia Antik', note: 'Peta maritim di lengkungan kuningan', color: '#C9B28A', accent: '#3F6575' }
    ]
  },
  {
    id: 'window_corner',
    name: 'Sudut Jendela Hujan',
    cost: 1,
    cam: { x: -2.9, y: 1.8, z: -2.6, dist: 4.6, yaw: -0.35, pitch: 0.22 },
    styles: [
      { id: 0, form: 'telescope', name: 'Teleskop Tripod', note: 'Teropong kuningan mengarah ke langit', color: '#D4A84F', accent: '#4A3424' },
      { id: 1, form: 'plant_stand', name: 'Menara Tanaman', note: 'Rak kayu bertingkat pot pakis rimbun', color: '#4A784C', accent: '#A6613E' },
      { id: 2, form: 'grandfather_clock', name: 'Jam Pendulum', note: 'Jam kayu tinggi dengan bandul bergerak', color: '#543222', accent: '#E5CFA0' }
    ]
  },
  {
    id: 'tea_service',
    name: 'Perangkat Seduh Teh',
    cost: 1,
    cam: { x: 0.35, y: 1.25, z: 0.55, dist: 2.8, yaw: 0.15, pitch: 0.38 },
    styles: [
      { id: 0, form: 'porcelain', name: 'Teko Porselen', note: 'Teko gading bundar bercorak emas', color: '#F0EAE0', accent: '#D4A84F' },
      { id: 1, form: 'cast_iron', name: 'Teko Besi Tetsubin', note: 'Besi hitam rendah bergaya timur', color: '#27292D', accent: '#8E6B38' },
      { id: 2, form: 'glass_infuser', name: 'Teko Kaca Botani', note: 'Kaca bening memperlihatkan daun teh', color: '#BFE4EE', accent: '#5D8E52' }
    ]
  },
  {
    id: 'wall_left',
    name: 'Dinding Catatan',
    cost: 1,
    cam: { x: -4.2, y: 2.3, z: -0.4, dist: 4.6, yaw: -1.15, pitch: 0.15 },
    styles: [
      { id: 0, form: 'corkboard', name: 'Papan Benang Kasus', note: 'Kliping koran terhubung benang merah', color: '#9E734B', accent: '#C44536' },
      { id: 1, form: 'framed_triptych', name: 'Tiga Bingkai Lukisan', note: 'Tiga kanvas pemandangan kabut senja', color: '#3E4F47', accent: '#D4A84F' },
      { id: 2, form: 'wall_shelves', name: 'Rak Piringan & Buku', note: 'Dua ambalan kayu dengan tanaman jalar', color: '#69432C', accent: '#558752' }
    ]
  },
  {
    id: 'garden_focus',
    name: 'Pusat Taman Luar',
    cost: 2,
    cam: { x: 0, y: 1.9, z: -6.8, dist: 6.2, yaw: 0, pitch: 0.24 },
    styles: [
      { id: 0, form: 'tiered_fountain', name: 'Air Mancur Bertingkat', note: 'Kolam batu dua tingkat memancar', color: '#D8D2C5', accent: '#4FA8C2' },
      { id: 1, form: 'sakura_lantern', name: 'Sakura & Lentera Batu', note: 'Pohon sakura mekar di samping lentera', color: '#EE9CB2', accent: '#9B9488' },
      { id: 2, form: 'glass_conservatory', name: 'Paviliun Kaca', note: 'Gazebo rangka besi beratap kaca', color: '#364A45', accent: '#A6DCEB' }
    ]
  },
  {
    id: 'garden_side',
    name: 'Sudut Taman Barat',
    cost: 2,
    cam: { x: -3.2, y: 1.8, z: -6.4, dist: 6.0, yaw: -0.25, pitch: 0.24 },
    styles: [
      { id: 0, form: 'rose_pergola', name: 'Lengkungan Mawar', note: 'Gerbang kayu melengkung rambat mawar', color: '#7D4E35', accent: '#C4454D' },
      { id: 1, form: 'stone_bench', name: 'Bangku & Lampu Gas', note: 'Bangku taman di bawah tiang lampu hangat', color: '#A8A093', accent: '#FFD67B' },
      { id: 2, form: 'koi_pond', name: 'Kolam Teratai', note: 'Kolam bundar berbatu dengan bunga teratai', color: '#356E78', accent: '#E89EB0' }
    ]
  },
  {
    id: 'hearth_right',
    name: 'Sudut Perapian',
    cost: 2,
    cam: { x: 4.1, y: 1.8, z: -0.6, dist: 4.6, yaw: 1.12, pitch: 0.16 },
    styles: [
      { id: 0, form: 'brick_hearth', name: 'Perapian Bata', note: 'Api kayu hangat dengan cerobong batu', color: '#874432', accent: '#FF9E44' },
      { id: 1, form: 'reading_nook', name: 'Kursi Baca Kulit', note: 'Kursi santai kulit cokelat dan lampu berdiri', color: '#5E3824', accent: '#E5C687' },
      { id: 2, form: 'tall_bookcase', name: 'Lemari Arsip Tinggi', note: 'Rak kayu penuh jilid tua sampai plafon', color: '#472E20', accent: '#D4A84F' }
    ]
  }
];

// Kasus deduksi taktil (Golden Idol + Strange Horticulture + Coffee Talk)
export const HANDCRAFTED_CASES = [
  {
    id: 'case-01',
    night: 1,
    visitor: {
      name: 'Nadia',
      role: 'Penyunting Naskah',
      opening: 'Hujan makin deras di luar. Boleh minta teh yang hangat dan sedikit manis? Aku bawa draf pengumuman kantor yang rasanya penuh kalimat menghindar.',
      desiredTeaTag: 'hangat',
      desiredBookId: 'book_lit',
      teaMatchReply: 'Pas sekali aromanya. Tadi rasanya kepalaku terlalu bising buat baca kalimat itu dengan jernih.',
      bookMatchReply: 'Oh, catatan Orwell soal bahasa kekuasaan. Tepat dengan firasatku barusan.'
    },
    dossier: {
      title: 'Draf Siaran Pers Internal',
      docType: 'Memo Redaksi',
      hint: 'Klik kalimat yang terasa menyembunyikan fakta di balik bahasa halus, lalu lengkapi kesimpulan di bawah.',
      segments: [
        { id: 's1', text: 'Kepada seluruh tim operasional divisi selatan.', flawed: false },
        { id: 's2', text: 'Mulai kuartal depan, manajemen melaksanakan program penyesuaian ukuran organisasi demi kelincahan struktur.', flawed: true, clue: 'Frasa "penyesuaian ukuran organisasi" melunakkan fakta pemutusan hubungan kerja.' },
        { id: 's3', text: 'Seluruh akses ruangan lantai tiga ditutup sementara untuk perawatan pendingin udara pada hari Minggu.', flawed: false },
        { id: 's4', text: 'Langkah efisiensi ini merupakan pengurangan negatif terhadap beban biaya tetap perusahaan.', flawed: true, clue: 'Istilah kontradiktif untuk mengaburkan pemotongan anggaran dan staf.' }
      ],
      requiredFlaws: ['s2', 's4'],
      deduction: {
        template: ['Draf ini menggunakan ', ' untuk melunakkan kenyataan ', ', mirip konsep ', ' dalam karya Orwell.'],
        slots: [
          { answer: 'eufemisme', label: 'gaya bahasa' },
          { answer: 'pengurangan karyawan', label: 'fakta sebenarnya' },
          { answer: 'Doublespeak', label: 'konsep sastra' }
        ],
        chips: ['eufemisme', 'hiperbola', 'pengurangan karyawan', 'pindah gedung', 'Doublespeak', 'Panoptikon']
      }
    },
    arkaDebrief: 'Menarik ya. Sering kali bahasa birokrasi tidak berbohong secara langsung, tapi memilih kata sampai pembaca lupa apa yang sebenarnya terjadi. Menurutmu, di dunia kerja, kalimat halus seperti itu bentuk empati atau justru cara menghindari tanggung jawab?'
  },
  {
    id: 'case-02',
    night: 2,
    visitor: {
      name: 'Junho',
      role: 'Mahasiswa Pertukaran',
      opening: 'Malam. Aku baru pulang dari kampus dan agak dingin. Ada teh dengan jahe atau rempah? Aku dapat catatan kecil dari kenalan lama, tapi ada bagian yang maknanya masih ragu di kepalaku.',
      desiredTeaTag: 'hangat',
      desiredBookId: 'book_korean',
      teaMatchReply: 'Hangat sekali, terima kasih. Kalau malam hujan begini memang paling enak minum jahe.',
      bookMatchReply: 'Bagus, catatan Hangul di rak itu ada pelafalannya juga. Jadi gampang dicocokkan.'
    },
    dossier: {
      title: 'Catatan Meja Perpustakaan',
      docType: 'Pesan Singkat',
      hint: 'Periksa frasa bahasa Korea di dalam catatan menggunakan Buku Saku Hangul di rak, lalu susun maknanya.',
      audioText: '천천히 하세요. 정말 감사합니다.',
      audioLang: 'ko-KR',
      segments: [
        { id: 's1', text: 'Teman sekelasmu meninggalkan secarik kertas di samping buku pinjamanmu:', flawed: false },
        { id: 's2', text: '"천천히 하세요 (Cheoncheonhi haseyo). Buku ini baru aku pakai pekan depan."', flawed: true, clue: '천천히 하세요 berarti "Pelan-pelan saja / tidak usah terburu-buru".' },
        { id: 's3', text: 'Ia juga menuliskan jadwal pengembalian perpustakaan pukul lima sore.', flawed: false },
        { id: 's4', text: '"정말 감사합니다 (Jeongmal gamsahamnida) sudah mau membantu merapikan catatan kuliah kemarin."', flawed: true, clue: '정말 감사합니다 berarti ungkapan terima kasih yang sungguh-sungguh dan sopan.' }
      ],
      requiredFlaws: ['s2', 's4'],
      deduction: {
        template: ['Pengirim berpesan agar tidak terburu-buru lewat frasa ', ', lalu menyampaikan terima kasih sopan dengan ', ' dalam tingkat tutur ', '.'],
        slots: [
          { answer: '천천히 하세요', label: 'frasa pertama' },
          { answer: '감사합니다', label: 'ungkapan terima kasih' },
          { answer: 'Jondaetmal (sopan)', label: 'tingkat tutur' }
        ],
        chips: ['천천히 하세요', '괜찮아요', '감사합니다', '죄송합니다', 'Jondaetmal (sopan)', 'Banmal (kasual)']
      }
    },
    arkaDebrief: 'Aku suka bagaimana bahasa Korea menaruh jarak dan rasa hormat langsung di ujung kata kerjanya. Menurutmu, punya tingkat kesopanan yang tegas seperti itu membuat orang lebih saling menjaga, atau justru bikin susah akrab?'
  },
  {
    id: 'case-03',
    night: 3,
    visitor: {
      name: 'Bima',
      role: 'Analis Keamanan Siber',
      opening: 'Butuh sesuatu yang tajam dan fokus, mungkin teh hitam atau mint. Baru saja masuk laporan anomali dari tim operasi malam, dan aku merasa ada dua pola serangan yang dicampuradukkan di laporan ini.',
      desiredTeaTag: 'fokus',
      desiredBookId: 'book_cyber',
      teaMatchReply: 'Pas, rasanya langsung bikin mata melek lagi.',
      bookMatchReply: 'Catatan Radar Siber itu ringkas. Cocok buat mencocokkan taksonomi serangannya.'
    },
    dossier: {
      title: 'Ringkasan Insiden Infrastruktur',
      docType: 'Log Siber',
      hint: 'Tandai dua bagian laporan yang menyimpan pola ancaman siber paling kritis, lalu rangkai diagnosisnya.',
      segments: [
        { id: 's1', text: 'Pukul 02.14, sebuah dokumen PDF masuk ke kotak masuk operator gardu kendali.', flawed: false },
        { id: 's2', text: 'Di dalam teks putih tersembunyi tertulis perintah rahasia agar asisten AI internal meneruskan seluruh kredensial ke alamat luar.', flawed: true, clue: 'Perintah tersembunyi untuk membajak perilaku model AI disebut Prompt Injection.' },
        { id: 's3', text: 'Tim sempat mengira ini sekadar kesalahan jaringan rutin karena lampu server tetap hijau.', flawed: false },
        { id: 's4', text: 'Sepuluh menit kemudian, akun tersebut mencoba mengakses jaringan kontrol fisik SCADA yang terhubung langsung ke katup distribusi.', flawed: true, clue: 'Akses ke SCADA mengancam infrastruktur informasi vital (IIV/CII).' }
      ],
      requiredFlaws: ['s2', 's4'],
      deduction: {
        template: ['Serangan berawal dari teknik ', ' pada asisten AI dokumen, lalu bergeser menargetkan ', ' yang termasuk kategori ', '.'],
        slots: [
          { answer: 'Prompt Injection', label: 'teknik awal' },
          { answer: 'jaringan SCADA', label: 'target fisik' },
          { answer: 'Infrastruktur Vital (IIV)', label: 'kategori dampak' }
        ],
        chips: ['Prompt Injection', 'DDoS Biasa', 'jaringan SCADA', 'situs katalog', 'Infrastruktur Vital (IIV)', 'kesalahan ejaan']
      }
    },
    arkaDebrief: 'Bagian yang bikin merinding dari serangan era AI bukan kecanggihan kodenya saja, tapi betapa mudahnya celah teks kecil merembet ke sistem fisik. Kalau kamu ada di posisi Bima, mana yang lebih penting diperbaiki lebih dulu: memisahkan jaringan atau melatih manusianya?'
  },
  {
    id: 'case-04',
    night: 4,
    visitor: {
      name: 'Clara',
      role: 'Penulis Esai',
      opening: 'Malam yang tenang. Boleh seduhkan teh melati yang ringan? Aku baru membaca kolom opini yang banyak dibagikan orang, tapi rasanya argumennya penuh loncatan logika.',
      desiredTeaTag: 'tenang',
      desiredBookId: 'book_logic',
      teaMatchReply: 'Harum melatinya lembut sekali. Terima kasih.',
      bookMatchReply: 'Indeks Sesat Pikir itu tepat. Mari kita lihat bagian mana yang paling licin.'
    },
    dossier: {
      title: 'Kliping Kolom Opini Kota',
      docType: 'Kliping Koran',
      hint: 'Tandai dua kalimat yang mengandung sesat pikir, lalu cocokkan namanya lewat Indeks Sesat Pikir.',
      segments: [
        { id: 's1', text: 'Pekan lalu dewan kota mengusulkan pengurangan jam parkir kendaraan pribadi di jalan utama.', flawed: false },
        { id: 's2', text: 'Pengusul aturan ini baru lulus tiga tahun lalu, jadi jelas ia belum cukup umur untuk memahami tata kota.', flawed: true, clue: 'Menyerang usia pengusul alih-alih isi usulannya adalah Ad Hominem.' },
        { id: 's3', text: 'Beberapa pedagang meminta kajian dampak lalu lintas sebelum uji coba dimulai.', flawed: false },
        { id: 's4', text: 'Jika usulan ini disetujui, bulan depan pasti semua toko bangkrut dan pusat kota berubah menjadi kota mati.', flawed: true, clue: 'Lompatan sebab-akibat ekstrem tanpa bukti berantai adalah Slippery Slope.' }
      ],
      requiredFlaws: ['s2', 's4'],
      deduction: {
        template: ['Kolom ini menolak usulan lewat ', ' terhadap usia penulisnya, lalu menakuti pembaca memakai ', ' tanpa menguji ', '.'],
        slots: [
          { answer: 'Ad Hominem', label: 'sesat pikir 1' },
          { answer: 'Slippery Slope', label: 'sesat pikir 2' },
          { answer: 'data kajian lalu lintas', label: 'hal yang diabaikan' }
        ],
        chips: ['Ad Hominem', 'Post Hoc', 'Slippery Slope', 'Serendipiti', 'data kajian lalu lintas', 'warna rambu']
      }
    },
    arkaDebrief: 'Lucunya, argumen yang paling cepat menyebar di internet sering kali justru yang paling penuh lompatan ekstrem. Menurutmu kenapa orang lebih gampang terpancing oleh skenario terburuk daripada penjelasan yang tenang dan terukur?'
  },
  {
    id: 'case-05',
    night: 5,
    visitor: {
      name: 'Hendra',
      role: 'Kurator Buku Lama',
      opening: 'Ada teh hitam atau kayu manis malam ini? Aku sedang menyunting naskah esai populer sebelum cetak, tapi ada dua salah kaprah bahasa dan fakta yang nyaris lolos.',
      desiredTeaTag: 'fokus',
      desiredBookId: 'book_diction',
      teaMatchReply: 'Hangat dan pas. Mata langsung terasa lebih jeli.',
      bookMatchReply: 'Kamus Diksi itu pegangan wajib sebelum naskah naik cetak.'
    },
    dossier: {
      title: 'Pracetak Esai Sejarah & Bahasa',
      docType: 'Naskah Pracetak',
      hint: 'Tandai dua kalimat yang memuat kekeliruan diksi atau mitos populer, lalu perbaiki kesimpulannya.',
      segments: [
        { id: 's1', text: 'Banyak tokoh sejarah bertahan menghadapi tekanan publik pada zamannya.', flawed: false },
        { id: 's2', text: 'Meski diterpa kritik keras, ia tidak bergeming sedikit pun dan tetap tenang di kursinya.', flawed: true, clue: 'Kata "bergeming" sendiri sudah berarti diam; menambahkan "tidak" justru membalik maknanya.' },
        { id: 's3', text: 'Di catatan kaki tertulis nama perguruan tinggi Oxford yang telah mengajar sejak abad ke-11.', flawed: false },
        { id: 's4', text: 'Penulis juga menambahkan bahwa manusia rata-rata hanya memanfaatkan 10 persen kapasitas otaknya.', flawed: true, clue: 'Mitos populer; pemindaian fMRI membuktikan hampir seluruh bagian otak aktif sepanjang hari.' }
      ],
      requiredFlaws: ['s2', 's4'],
      deduction: {
        template: ['Naskah perlu memperbaiki frasa ', ' karena bergeming sudah berarti ', ', serta menghapus mitos ', '.'],
        slots: [
          { answer: 'tidak bergeming', label: 'frasa keliru' },
          { answer: 'diam tidak bergerak', label: 'arti sebenarnya' },
          { answer: '10 persen kapasitas otak', label: 'mitos yang dihapus' }
        ],
        chips: ['tidak bergeming', 'tetap tenang', 'diam tidak bergerak', 'berlari cepat', '10 persen kapasitas otak', 'berdirinya Oxford']
      }
    },
    arkaDebrief: 'Salah kaprah yang diulang terus-menerus lama-lama terasa seperti kebenaran umum. Pernahkah kamu baru sadar belakangan bahwa ada satu kata atau fakta yang selama ini ternyata terbalik artinya?'
  }
];

// Generator Kasus Malam Tak Terbatas (Malam 6 -> tak terbatas)
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function getEveningCase(nightNumber = 1) {
  if (nightNumber <= HANDCRAFTED_CASES.length) {
    return HANDCRAFTED_CASES[nightNumber - 1];
  }

  // Rakit kasus prosedural bersih dari arsip logika, diksi, sastra, siber, dan fakta
  const mode = (nightNumber - 1) % 4;
  if (mode === 0) {
    const fl = FALLACIES_BANK[nightNumber % FALLACIES_BANK.length];
    const alt1 = FALLACIES_BANK[(nightNumber + 3) % FALLACIES_BANK.length];
    const fact = FACTS_BANK[nightNumber % FACTS_BANK.length];
    return {
      id: `proc-logic-${nightNumber}`,
      night: nightNumber,
      visitor: {
        name: 'Clara',
        role: 'Penulis Esai',
        opening: 'Ada catatan baru di mejaku malam ini. Seduhkan teh yang menenangkan, lalu bantu aku memeriksa celah nalarnya.',
        desiredTeaTag: 'tenang',
        desiredBookId: 'book_logic',
        teaMatchReply: 'Cocok sekali untuk suasana malam ini.',
        bookMatchReply: 'Indeks Sesat Pikir selalu jadi pembanding yang rapi.'
      },
      dossier: {
        title: `Berkas Diskusi Malam #${nightNumber}`,
        docType: 'Transkrip Forum',
        hint: 'Tandai kutipan yang bermasalah secara nalar, lalu lengkapi kesimpulan di bawah.',
        segments: [
          { id: 's1', text: 'Diskusi dimulai dari perbandingan data lapangan bulan ini.', flawed: false },
          { id: 's2', text: fl.attack, flawed: true, clue: fl.meaning },
          { id: 's3', text: `Catatan tambahan: "${fact.statement}"`, flawed: false }
        ],
        requiredFlaws: ['s2'],
        deduction: {
          template: ['Kutipan utama mengandung sesat pikir ', ', yaitu ', '.'],
          slots: [
            { answer: fl.fallacyName, label: 'nama sesat pikir' },
            { answer: fl.options.find((o) => o.correct)?.text || fl.meaning, label: 'penjelasan' }
          ],
          chips: shuffle([
            fl.fallacyName,
            alt1.fallacyName,
            fl.options.find((o) => o.correct)?.text || fl.meaning,
            fl.options.find((o) => !o.correct)?.text || 'Kesalahan pencatatan tanggal'
          ])
        }
      },
      arkaDebrief: `${fl.meaning} Menurutmu, bagaimana cara paling tenang menanggapi pola seperti ini tanpa membuat lawan bicara makin defensif?`
    };
  }

  if (mode === 1) {
    const cb = CYBER_LAB.breakthroughs[nightNumber % CYBER_LAB.breakthroughs.length];
    const alt = CYBER_LAB.breakthroughs[(nightNumber + 2) % CYBER_LAB.breakthroughs.length];
    return {
      id: `proc-cyber-${nightNumber}`,
      night: nightNumber,
      visitor: {
        name: 'Bima',
        role: 'Analis Keamanan Siber',
        opening: 'Malam panjang lagi di pusat pemantauan. Boleh minta teh fokus? Ada temuan baru di radar berita siber.',
        desiredTeaTag: 'fokus',
        desiredBookId: 'book_cyber',
        teaMatchReply: 'Tepat, langsung terasa hangat dan jernih.',
        bookMatchReply: 'Catatan Radar Siber itu sangat membantu.'
      },
      dossier: {
        title: `Buletin Siber #${nightNumber}`,
        docType: 'Ringkasan Teknis',
        hint: 'Tandai temuan inti di dalam buletin, lalu cocokkan konsepnya di Catatan Radar Siber.',
        segments: [
          { id: 's1', text: `Laporan pemantauan berkala kategori ${cb.category}.`, flawed: false },
          { id: 's2', text: cb.summary, flawed: true, clue: cb.whyMatters },
          { id: 's3', text: 'Tim keamanan sedang mengevaluasi prioritas mitigasi minggu ini.', flawed: false }
        ],
        requiredFlaws: ['s2'],
        deduction: {
          template: ['Temuan malam ini merujuk pada ', ' dalam ranah ', '.'],
          slots: [
            { answer: cb.title, label: 'istilah siber' },
            { answer: cb.category, label: 'kategori' }
          ],
          chips: shuffle([cb.title, alt.title, cb.category, alt.category === cb.category ? 'Arsip Fisik' : alt.category])
        }
      },
      arkaDebrief: `${cb.whyMatters} Dari sisi pengguna biasa, kebiasaan kecil apa yang menurutmu paling sering luput dalam situasi seperti ini?`
    };
  }

  if (mode === 2) {
    const lit = CLASSIC_LIT_ACADEMY.concepts[nightNumber % CLASSIC_LIT_ACADEMY.concepts.length];
    const alt = CLASSIC_LIT_ACADEMY.concepts[(nightNumber + 3) % CLASSIC_LIT_ACADEMY.concepts.length];
    const shortTitle = lit.title.split('(')[0].trim();
    const altTitle = alt.title.split('(')[0].trim();
    return {
      id: `proc-lit-${nightNumber}`,
      night: nightNumber,
      visitor: {
        name: 'Nadia',
        role: 'Penyunting Naskah',
        opening: 'Hujan tipis di luar. Boleh seduhkan teh melati atau madu? Aku menemukan esai budaya yang menyinggung satu gagasan sastra klasik.',
        desiredTeaTag: 'tenang',
        desiredBookId: 'book_lit',
        teaMatchReply: 'Aromanya pas sekali untuk membaca.',
        bookMatchReply: 'Buku Sastra & Bahasa Kuasa itu memuat rujukannya.'
      },
      dossier: {
        title: `Esai Pembaca #${nightNumber}`,
        docType: 'Catatan Sastra',
        hint: 'Tandai gagasan utama di dalam esai, lalu hubungkan dengan konsep sastra klasiknya.',
        segments: [
          { id: 's1', text: 'Seorang pembaca mengirim catatan refleksi tentang kebiasaan informasi hari ini.', flawed: false },
          { id: 's2', text: lit.summary, flawed: true, clue: lit.modernLink },
          { id: 's3', text: 'Ia bertanya apakah gejala serupa pernah digambarkan dalam novel klasik.', flawed: false }
        ],
        requiredFlaws: ['s2'],
        deduction: {
          template: ['Gagasan tersebut dikenal sebagai ', ' dari karya ', '.'],
          slots: [
            { answer: shortTitle, label: 'konsep' },
            { answer: lit.author.split('·')[0].trim(), label: 'penulis' }
          ],
          chips: shuffle([
            shortTitle,
            altTitle,
            lit.author.split('·')[0].trim(),
            alt.author.split('·')[0].trim() === lit.author.split('·')[0].trim() ? 'Arthur Conan Doyle' : alt.author.split('·')[0].trim()
          ])
        }
      },
      arkaDebrief: `${lit.modernLink} Menurutmu, kenapa gambaran dalam buku lama itu masih terasa dekat dengan keseharian kita sekarang?`
    };
  }

  const d = DICTION_BANK[nightNumber % DICTION_BANK.length];
  const alt = DICTION_BANK[(nightNumber + 4) % DICTION_BANK.length];
  const rightOpt = d.options.find((o) => o.correct)?.text || d.meaning;
  const wrongOpt = d.options.find((o) => !o.correct)?.text || 'Penulisan tidak baku';
  return {
    id: `proc-dict-${nightNumber}`,
    night: nightNumber,
    visitor: {
      name: 'Hendra',
      role: 'Kurator Buku Lama',
      opening: 'Malam. Sambil menyeduh teh hangat, bisa bantu periksa satu catatan diksi sebelum masuk arsip?',
      desiredTeaTag: 'hangat',
      desiredBookId: 'book_diction',
      teaMatchReply: 'Pas hangatnya.',
      bookMatchReply: 'Kamus Diksi memang selalu jadi jalan pintas paling rapi.'
    },
    dossier: {
      title: `Lembar Suntingan #${nightNumber}`,
      docType: 'Catatan Diksi',
      hint: 'Tandai pokok pertanyaan di lembar suntingan, lalu cocokkan dengan Kamus Diksi.',
      segments: [
        { id: 's1', text: 'Catatan penyunting untuk entri kosakata bahasa Indonesia.', flawed: false },
        { id: 's2', text: d.prompt, flawed: true, clue: d.meaning },
        { id: 's3', text: `Contoh kalimat: "${d.usage}"`, flawed: false }
      ],
      requiredFlaws: ['s2'],
      deduction: {
        template: ['Entri yang dibahas adalah ', ', yang merujuk pada: ', '.'],
        slots: [
          { answer: d.term, label: 'diksi' },
          { answer: rightOpt, label: 'makna tepat' }
        ],
        chips: shuffle([d.term, alt.term, rightOpt, wrongOpt])
      }
    },
    arkaDebrief: `${d.meaning} Ada kata bahasa Indonesia tertentu yang menurutmu paling indah atau paling sering salah dipakai orang?`
  };
}

export function getReferenceContent(bookId) {
  if (bookId === 'book_lit') {
    return CLASSIC_LIT_ACADEMY.concepts.map((c) => ({
      head: c.title,
      sub: c.author,
      body: `${c.summary} ${c.modernLink}`
    }));
  }
  if (bookId === 'book_logic') {
    return FALLACIES_BANK.map((f) => ({
      head: f.fallacyName,
      sub: 'Logika',
      body: f.meaning
    }));
  }
  if (bookId === 'book_cyber') {
    return CYBER_LAB.breakthroughs.map((c) => ({
      head: c.title,
      sub: c.category,
      body: `${c.summary} ${c.whyMatters}`
    }));
  }
  if (bookId === 'book_korean') {
    return KOREAN_ACADEMY.phrases.map((p) => ({
      head: `${p.hangul} (${p.rom})`,
      sub: p.level,
      body: `${p.meaning}. ${p.note}`,
      speak: p.speak || p.hangul,
      lang: 'ko-KR'
    }));
  }
  if (bookId === 'book_diction') {
    return DICTION_BANK.map((d) => ({
      head: d.term,
      sub: 'KBBI VI',
      body: `${d.meaning} Contoh: ${d.usage}`
    }));
  }
  return FACTS_BANK.map((f) => ({
    head: f.isFact ? `Fakta · ${f.category}` : `Mitos · ${f.category}`,
    sub: f.statement,
    body: f.punchline
  }));
}
