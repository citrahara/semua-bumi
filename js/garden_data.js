// 12 area renovasi taman 3D dengan 3 pilihan gaya masing-masing.

export const GARDEN_W = 1400;
export const GARDEN_H = 1100;

export const RESTORATION_TASKS = [
  {
    id: 'gate',
    order: 1,
    name: 'Gerbang Utama',
    shortDesc: 'Pilar masuk di sisi selatan taman.',
    starCost: 1,
    coinReward: 80,
    x: 700,
    y: 960,
    styles: [
      { id: 0, name: 'Batu Kapur', color: '#CFC6B6', accent: '#7A6B5D', note: 'Pilar batu klasik' },
      { id: 1, name: 'Besi Tempa', color: '#2F3338', accent: '#D4A84F', note: 'Besi gelap kuningan' },
      { id: 2, name: 'Kayu Sakura', color: '#7D4432', accent: '#E89EB0', note: 'Kayu aksen sakura' }
    ]
  },
  {
    id: 'fountain',
    order: 2,
    name: 'Air Mancur',
    shortDesc: 'Kolam bundar di pusat halaman.',
    starCost: 1,
    coinReward: 90,
    x: 700,
    y: 560,
    styles: [
      { id: 0, name: 'Marmer Putih', color: '#E8E3D9', accent: '#4FA8C2', note: 'Marmer air jernih' },
      { id: 1, name: 'Perunggu', color: '#4B5349', accent: '#D4A84F', note: 'Patina hijau perunggu' },
      { id: 2, name: 'Terakota', color: '#B36345', accent: '#62B8CC', note: 'Terakota hangat' }
    ]
  },
  {
    id: 'flowerbeds',
    order: 3,
    name: 'Petak Bunga',
    shortDesc: 'Taman bunga di sisi barat air mancur.',
    starCost: 1,
    coinReward: 95,
    x: 520,
    y: 560,
    styles: [
      { id: 0, name: 'Mawar Merah', color: '#C4454D', accent: '#F4E8D1', note: 'Mawar merah dan krem' },
      { id: 1, name: 'Lavender', color: '#8367A8', accent: '#C4B3DF', note: 'Lavender ungu' },
      { id: 2, name: 'Matahari', color: '#E0A82E', accent: '#6A8E4E', note: 'Kuning cerah' }
    ]
  },
  {
    id: 'lanterns',
    order: 4,
    name: 'Lampu Jalan',
    shortDesc: 'Deretan lentera di jalur kerikil.',
    starCost: 2,
    coinReward: 110,
    x: 880,
    y: 660,
    styles: [
      { id: 0, name: 'Lentera Gas', color: '#2B2B2E', accent: '#FFD67B', note: 'Tiang hitam hangat' },
      { id: 1, name: 'Kuningan', color: '#8F6A2E', accent: '#FFF0C2', note: 'Tiang kuningan' },
      { id: 2, name: 'Kayu Hangat', color: '#6E3B2B', accent: '#FFBD87', note: 'Lentera kayu' }
    ]
  },
  {
    id: 'orwell_pavilion',
    order: 5,
    name: 'Paviliun Baca',
    shortDesc: 'Ruang baca di sisi barat taman.',
    starCost: 2,
    coinReward: 120,
    x: 340,
    y: 420,
    styles: [
      { id: 0, name: 'Kayu Mahoni', color: '#5E3524', accent: '#D4A84F', note: 'Mahoni atap gelap' },
      { id: 1, name: 'Gading', color: '#EAE1D0', accent: '#6D3542', note: 'Gading atap marun' },
      { id: 2, name: 'Hijau Botani', color: '#315244', accent: '#E2C382', note: 'Hijau aksen emas' }
    ]
  },
  {
    id: 'tea_pergola',
    order: 6,
    name: 'Pergola Teh',
    shortDesc: 'Sudut teh dan bahasa di sisi timur.',
    starCost: 2,
    coinReward: 125,
    x: 1060,
    y: 420,
    styles: [
      { id: 0, name: 'Hanok', color: '#F0E8DA', accent: '#363C47', note: 'Genteng gelap terang' },
      { id: 1, name: 'Kayu Jati', color: '#7A5236', accent: '#8FB573', note: 'Jati daun rambat' },
      { id: 2, name: 'Sakura', color: '#693B3B', accent: '#F0A8BC', note: 'Kayu aksen sakura' }
    ]
  },
  {
    id: 'pond_bridge',
    order: 7,
    name: 'Jembatan Kolam',
    shortDesc: 'Jembatan melengkung di kolam barat.',
    starCost: 2,
    coinReward: 130,
    x: 310,
    y: 740,
    styles: [
      { id: 0, name: 'Batu Lengkung', color: '#BDB3A3', accent: '#6D655A', note: 'Jembatan batu' },
      { id: 1, name: 'Kayu Merah', color: '#9E372F', accent: '#D4A84F', note: 'Lengkung merah' },
      { id: 2, name: 'Pinus Alami', color: '#7D5A3C', accent: '#A8C48A', note: 'Kayu pinus rapi' }
    ]
  },
  {
    id: 'greenhouse',
    order: 8,
    name: 'Rumah Kaca',
    shortDesc: 'Konservatori tanaman di sisi utara.',
    starCost: 3,
    coinReward: 150,
    x: 520,
    y: 230,
    styles: [
      { id: 0, name: 'Besi Hijau', color: '#394E4A', accent: '#BFE4EE', note: 'Rangka hijau tua' },
      { id: 1, name: 'Putih Bersih', color: '#E9E4DA', accent: '#A6DCEB', note: 'Rangka putih terang' },
      { id: 2, name: 'Kuningan', color: '#7A5A2A', accent: '#CFEAF0', note: 'Rangka kuningan' }
    ]
  },
  {
    id: 'sakura_grove',
    order: 9,
    name: 'Kebun Sakura',
    shortDesc: 'Deretan pohon berbunga dan bangku.',
    starCost: 3,
    coinReward: 155,
    x: 920,
    y: 240,
    styles: [
      { id: 0, name: 'Merah Muda', color: '#F09CB3', accent: '#6D4C3D', note: 'Kelopak merah muda' },
      { id: 1, name: 'Putih Salju', color: '#F7ECEF', accent: '#5D4037', note: 'Sakura putih' },
      { id: 2, name: 'Maple Gugur', color: '#D46635', accent: '#5C3A28', note: 'Daun tembaga' }
    ]
  },
  {
    id: 'rose_arch',
    order: 10,
    name: 'Lorong Bunga',
    shortDesc: 'Lengkungan bunga di jalur tengah.',
    starCost: 3,
    coinReward: 165,
    x: 700,
    y: 770,
    styles: [
      { id: 0, name: 'Mawar Merah', color: '#B53844', accent: '#4C7A4D', note: 'Mawar klasik' },
      { id: 1, name: 'Wisteria', color: '#8F6DC2', accent: '#4E7A56', note: 'Wisteria ungu' },
      { id: 2, name: 'Melati', color: '#F6F0DE', accent: '#4B7D54', note: 'Melati gading' }
    ]
  },
  {
    id: 'signal_tower',
    order: 11,
    name: 'Menara Sinyal',
    shortDesc: 'Menara pantau di tenggara taman.',
    starCost: 3,
    coinReward: 180,
    x: 1130,
    y: 750,
    styles: [
      { id: 0, name: 'Tembaga', color: '#384654', accent: '#C9894B', note: 'Kubah tembaga' },
      { id: 1, name: 'Radar Modern', color: '#1F3244', accent: '#57B4C9', note: 'Rangka cyan' },
      { id: 2, name: 'Batu Tua', color: '#7D7468', accent: '#D9B466', note: 'Batu lentera' }
    ]
  },
  {
    id: 'clock_gazebo',
    order: 12,
    name: 'Gazebo Taman',
    shortDesc: 'Gazebo utama di sisi utara.',
    starCost: 4,
    coinReward: 220,
    x: 700,
    y: 200,
    styles: [
      { id: 0, name: 'Marun Emas', color: '#6E2B36', accent: '#D9B466', note: 'Marun kubah emas' },
      { id: 1, name: 'Putih Taman', color: '#F0EAE0', accent: '#5A7D64', note: 'Putih atap hijau' },
      { id: 2, name: 'Kayu Gelap', color: '#4A3224', accent: '#C9A45C', note: 'Kayu antik' }
    ]
  }
];

export const GARDEN_NPCS = [
  {
    id: 'orwell',
    name: 'George',
    role: 'Arsip Sastra',
    x: 340,
    y: 500,
    action: 'study_lit',
    line: 'Catatan sastra dan diksi tersedia di sini.'
  },
  {
    id: 'sora',
    name: 'Sora',
    role: 'Bahasa Korea',
    x: 1050,
    y: 500,
    action: 'study_korean',
    line: 'Latih Hangul dan pelafalan suara di pergola ini.'
  },
  {
    id: 'vega',
    name: 'Vega',
    role: 'Radar Siber',
    x: 1090,
    y: 820,
    action: 'study_cyber',
    line: 'Ringkasan keamanan siber dan berita terkini tersimpan di sini.'
  }
];
