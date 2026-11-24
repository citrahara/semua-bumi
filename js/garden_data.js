// Data 12 Area Renovasi Taman Bangsawan 3D (ala Gardenscapes) + 3 Pilihan Gaya Desain per Objek!
// Setiap renovasi secara fisik mengubah model 3D di taman dari rusak/terbengkalai menjadi utuh dan hidup.

export const GARDEN_W = 1400;
export const GARDEN_H = 1100;

export const RESTORATION_TASKS = [
  {
    id: 'gate',
    order: 1,
    name: 'Gerbang Utama Taman',
    shortDesc: 'Bersihkan gerbang berkarat dan pasang pilar masuk baru.',
    starCost: 1,
    coinReward: 80,
    x: 700,
    y: 960,
    styles: [
      { id: 0, name: 'Batu Klasik', color: '#CFC6B6', accent: '#7A6B5D', note: 'Pilar batu kapur abad ke-19.' },
      { id: 1, name: 'Besi Tempa 1894', color: '#2F3338', accent: '#D4A84F', note: 'Besi gelap dengan ornamen kuningan.' },
      { id: 2, name: 'Kayu Sakura', color: '#7D4432', accent: '#E89EB0', note: 'Gerbang kayu hangat berhias sakura.' }
    ]
  },
  {
    id: 'fountain',
    order: 2,
    name: 'Air Mancur Tengah',
    shortDesc: 'Pulihkan kolam batu kering di pusat halaman rumput.',
    starCost: 1,
    coinReward: 90,
    x: 700,
    y: 560,
    styles: [
      { id: 0, name: 'Marmer Putih', color: '#E8E3D9', accent: '#4FA8C2', note: 'Kolam marmer terang dengan air jernih.' },
      { id: 1, name: 'Perunggu Antik', color: '#4B5349', accent: '#D4A84F', note: 'Patina hijau perunggu ala taman klasik.' },
      { id: 2, name: 'Terakota Hangat', color: '#B36345', accent: '#62B8CC', note: 'Sentuhan terakota Mediterania.' }
    ]
  },
  {
    id: 'flowerbeds',
    order: 3,
    name: 'Taman Bunga Simetris',
    shortDesc: 'Ganti semak liar di sekitar air mancur dengan bunga mekar.',
    starCost: 1,
    coinReward: 95,
    x: 520,
    y: 560,
    styles: [
      { id: 0, name: 'Mawar Krim & Merah', color: '#C4454D', accent: '#F4E8D1', note: 'Taman mawar klasik bangsawan.' },
      { id: 1, name: 'Lavender Senja', color: '#8367A8', accent: '#C4B3DF', note: 'Barisan lavender ungu lembut.' },
      { id: 2, name: 'Bunga Matahari', color: '#E0A82E', accent: '#6A8E4E', note: 'Nuansa cerah dan hangat.' }
    ]
  },
  {
    id: 'lanterns',
    order: 4,
    name: 'Lampu Jalan Taman',
    shortDesc: 'Nyalakan kembali lentera taman di sepanjang jalur kerikil.',
    starCost: 2,
    coinReward: 110,
    x: 880,
    y: 660,
    styles: [
      { id: 0, name: 'Lentera Gas 1894', color: '#2B2B2E', accent: '#FFD67B', note: 'Cahaya kuning hangat khas abad ke-19.' },
      { id: 1, name: 'Lampu Kuningan', color: '#8F6A2E', accent: '#FFF0C2', note: 'Tiang kuningan ramping.' },
      { id: 2, name: 'Lentera Kertas', color: '#6E3B2B', accent: '#FFBD87', note: 'Lentera kayu bernuansa timur.' }
    ]
  },
  {
    id: 'orwell_pavilion',
    order: 5,
    name: 'Paviliun Arsip Sastra',
    shortDesc: 'Renovasi ruang baca antik untuk koleksi Orwell, Austen, dan Sherlock.',
    starCost: 2,
    coinReward: 120,
    x: 340,
    y: 420,
    styles: [
      { id: 0, name: 'Perpustakaan Mahoni', color: '#5E3524', accent: '#D4A84F', note: 'Kayu mahoni tua beratap gelap.' },
      { id: 1, name: 'Paviliun Gading', color: '#EAE1D0', accent: '#6D3542', note: 'Dinding gading dengan atap anggur.' },
      { id: 2, name: 'Gazebo Hijau Botani', color: '#315244', accent: '#E2C382', note: 'Nuansa taman botani tenang.' }
    ]
  },
  {
    id: 'tea_pergola',
    order: 6,
    name: 'Pergola Teh & Hangul',
    shortDesc: 'Bangun sudut teh santai lengkap dengan meja baca dan papan bahasa.',
    starCost: 2,
    coinReward: 125,
    x: 1060,
    y: 420,
    styles: [
      { id: 0, name: 'Hanok Minimalis', color: '#F0E8DA', accent: '#363C47', note: 'Atap genteng gelap bergaya Seoul.' },
      { id: 1, name: 'Pergola Kayu Jati', color: '#7A5236', accent: '#8FB573', note: 'Tiang kayu rambat daun hijau.' },
      { id: 2, name: 'Paviliun Sakura', color: '#693B3B', accent: '#F0A8BC', note: 'Aksen kelopak sakura lembut.' }
    ]
  },
  {
    id: 'pond_bridge',
    order: 7,
    name: 'Jembatan Kolam Barat',
    shortDesc: 'Perbaiki jembatan kayu lapuk yang melintasi kolam teratai.',
    starCost: 2,
    coinReward: 130,
    x: 310,
    y: 740,
    styles: [
      { id: 0, name: 'Lengkungan Batu', color: '#BDB3A3', accent: '#6D655A', note: 'Jembatan batu taman Eropa.' },
      { id: 1, name: 'Kayu Merah Klasik', color: '#9E372F', accent: '#D4A84F', note: 'Jembatan lengkung kayu merah.' },
      { id: 2, name: 'Kayu Alami', color: '#7D5A3C', accent: '#A8C48A', note: 'Kayu pinus hangat berpagar rapi.' }
    ]
  },
  {
    id: 'greenhouse',
    order: 8,
    name: 'Rumah Kaca Botani',
    shortDesc: 'Pasang kaca bening dan rak bibit di rumah kaca utara.',
    starCost: 3,
    coinReward: 150,
    x: 520,
    y: 230,
    styles: [
      { id: 0, name: 'Kaca Victoria', color: '#394E4A', accent: '#BFE4EE', note: 'Rangka besi hijau tua dan kaca tinggi.' },
      { id: 1, name: 'Kaca Putih Bersih', color: '#E9E4DA', accent: '#A6DCEB', note: 'Tampak terang dan lapang.' },
      { id: 2, name: 'Kaca Kuningan', color: '#7A5A2A', accent: '#CFEAF0', note: 'Rangka kuningan bernuansa antik.' }
    ]
  },
  {
    id: 'sakura_grove',
    order: 9,
    name: 'Hutan Sakura & Bangku',
    shortDesc: 'Tanam deretan pohon sakura dan pasang bangku baca yang teduh.',
    starCost: 3,
    coinReward: 155,
    x: 920,
    y: 240,
    styles: [
      { id: 0, name: 'Sakura Merah Muda', color: '#F09CB3', accent: '#6D4C3D', note: 'Kelopak merah muda lembut.' },
      { id: 1, name: 'Sakura Putih Salju', color: '#F7ECEF', accent: '#5D4037', note: 'Putih bersih berkilau sore.' },
      { id: 2, name: 'Maple Musim Gugur', color: '#D46635', accent: '#5C3A28', note: 'Daun tembaga hangat musim gugur.' }
    ]
  },
  {
    id: 'rose_arch',
    order: 10,
    name: 'Lorong Bunga Selatan',
    shortDesc: 'Rangkai lengkungan bunga di jalan masuk menuju pusat taman.',
    starCost: 3,
    coinReward: 165,
    x: 700,
    y: 770,
    styles: [
      { id: 0, name: 'Mawar Merah', color: '#B53844', accent: '#4C7A4D', note: 'Lengkungan mawar klasik.' },
      { id: 1, name: 'Wisteria Ungu', color: '#8F6DC2', accent: '#4E7A56', note: 'Untaian wisteria menjuntai.' },
      { id: 2, name: 'Melati Gading', color: '#F6F0DE', accent: '#4B7D54', note: 'Putih gading bersih dan tenang.' }
    ]
  },
  {
    id: 'signal_tower',
    order: 11,
    name: 'Menara Observasi & Sinyal',
    shortDesc: 'Pulihkan menara pemantau radar berita siber dan langit malam.',
    starCost: 3,
    coinReward: 180,
    x: 1130,
    y: 750,
    styles: [
      { id: 0, name: 'Observatorium Tembaga', color: '#384654', accent: '#C9894B', note: 'Kubah tembaga bergaya ilmiah 1894.' },
      { id: 1, name: 'Menara Sinyal Modern', color: '#1F3244', accent: '#57B4C9', note: 'Aksen radar cyan yang bersih.' },
      { id: 2, name: 'Menara Batu Tua', color: '#7D7468', accent: '#D9B466', note: 'Batu alam dengan lentera puncak.' }
    ]
  },
  {
    id: 'clock_gazebo',
    order: 12,
    name: 'Gazebo Panggung Salon',
    shortDesc: 'Selesaikan mahkota taman: gazebo kayu bundar untuk diskusi dan satir.',
    starCost: 4,
    coinReward: 220,
    x: 700,
    y: 200,
    styles: [
      { id: 0, name: 'Salon 1894 Emas', color: '#6E2B36', accent: '#D9B466', note: 'Gazebo marun dengan kubah kuningan.' },
      { id: 1, name: 'Gazebo Putih Taman', color: '#F0EAE0', accent: '#5A7D64', note: 'Putih elegan di tengah pepohonan.' },
      { id: 2, name: 'Gazebo Kayu Gelap', color: '#4A3224', accent: '#C9A45C', note: 'Nuansa kayu antik yang hangat.' }
    ]
  }
];

export const GARDEN_NPCS = [
  {
    id: 'orwell',
    name: 'George',
    role: 'Kurator Arsip Taman',
    x: 340,
    y: 500,
    action: 'study_lit',
    line: 'Setiap ubin bersegel di papan puzzle menyimpan catatan penting. Kamu juga bisa membaca koleksi sastra langsung di sini.'
  },
  {
    id: 'sora',
    name: 'Sora',
    role: 'Pengajar Bahasa Korea',
    x: 1050,
    y: 500,
    action: 'study_korean',
    line: 'Annyeonghaseyo. Istirahat sebentar dari puzzle? Kamu bisa melatih Hangul dan pelafalan suara di pergola ini.'
  },
  {
    id: 'vega',
    name: 'Vega',
    role: 'Analis Radar /berita-terkini',
    x: 1090,
    y: 820,
    action: 'study_cyber',
    line: 'Menara ini memantau terobosan AI, IIV/SCADA, dan 21 sumber berita siber global. Buka kapan saja untuk belajar.'
  }
];
