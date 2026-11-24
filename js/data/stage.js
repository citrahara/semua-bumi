// Bank konten Babak 4: Panggung Spontan 30 Detik
// Melatih improvisasi bicara, framing kocak, dan penyelipan kosakata keren + fakta pemantik.

export const STAGE_PROMPTS = [
  {
    id: 'stage-01',
    title: 'Sidang Darurat: Kenapa Tidur Siang Harus Jadi Hak Pekerja?',
    role: 'Juru Bicara Koalisi Rebahan Produktif',
    factSpark: 'Fakta pemantik: Riset NASA menemukan tidur siang singkat 26 menit dapat meningkatkan kewaspadaan pilot hingga 54 persen.',
    keywords: [
      { word: 'pragmatis', hint: 'bersifat praktis dan fokus pada hasil nyata' },
      { word: 'paradoks', hint: 'terkesan bertentangan tapi mengandung kebenaran' }
    ],
    sampleAngle: 'Mulai dengan fakta NASA, lalu tutup dengan kalimat bahwa berhenti sebentar justru cara paling pragmatis agar kerja lebih cepat.'
  },
  {
    id: 'stage-02',
    title: 'Pidato PBB: Membela Indomie Sebagai Pemersatu Bangsa',
    role: 'Diplomat Khusus Mi Instan',
    factSpark: 'Fakta pemantik: Indomie diekspor ke lebih dari 80 negara dan bahkan punya pabrik besar di Nigeria.',
    keywords: [
      { word: 'retorika', hint: 'gaya bicara persuasif' },
      { word: 'nuansa', hint: 'perbedaan rasa atau sudut pandang yang halus' }
    ],
    sampleAngle: 'Bandingkan debat bubur diaduk dengan persatuan piring mi goreng, lalu selipkan nuansa bumbu dan fakta ekspor.'
  },
  {
    id: 'stage-03',
    title: 'Teori Warkop: Kucing Sebenarnya Majikan, Manusia Cuma Staf',
    role: 'Pengamat Geopolitik Kucing Oren',
    factSpark: 'Fakta pemantik: Kucing dewasa jarang mengeong ke sesama kucing; meongan adalah teknik khusus yang mereka kembangkan untuk memerintah manusia.',
    keywords: [
      { word: 'ironi', hint: 'kejadian yang berkebalikan dari harapan' },
      { word: 'eufemisme', hint: 'penghalusan kata untuk hal yang menohok' }
    ],
    sampleAngle: 'Bilang bahwa istilah "pemilik kucing" hanyalah eufemisme halus untuk "pelayan setia pembuka kaleng".'
  },
  {
    id: 'stage-04',
    title: 'Kenapa Orang Indonesia Susah Bilang "Tidak" Secara Langsung?',
    role: 'Sosiolog Tongkrongan Malam',
    factSpark: 'Fakta pemantik: Dalam studi komunikasi lintas budaya (Erin Meyer), budaya Indonesia termasuk konteks tinggi yang mengutamakan harmoni sosial.',
    keywords: [
      { word: 'lugas', hint: 'langsung ke inti, tidak berbelit' },
      { word: 'ambivalen', hint: 'punya dua perasaan bertentangan sekaligus' }
    ],
    sampleAngle: 'Bahas betapa sering kita bilang "lihat nanti ya" padahal hati kecil sudah menolak, lalu tawarkan cara menolak yang lugas tapi sopan.'
  },
  {
    id: 'stage-05',
    title: 'Membujuk Teman Agar Berhenti Beli Barang Diskon yang Tak Perlu',
    role: 'Menteri Keuangan Dompet Sahabat',
    factSpark: 'Fakta pemantik: Efek "anchoring" di psikologi ekonomi membuat harga coret terasa seperti penghematan, padahal tetap pengeluaran.',
    keywords: [
      { word: 'skeptis', hint: 'ragu secara kritis sampai ada bukti' },
      { word: 'mubazir', hint: 'terbuang sia-sia tanpa manfaat' }
    ],
    sampleAngle: 'Ajak teman tetap skeptis pada label diskon 70 persen supaya barang tidak berakhir mubazir di sudut kamar.'
  },
  {
    id: 'stage-06',
    title: 'Kenapa Obrolan Paling Cerdas Sering Lahir di Warung Kopi?',
    role: 'Kurator Kebijaksanaan Gelas Plastik',
    factSpark: 'Fakta pemantik: Pada abad ke-17 di Eropa, kedai kopi dijuluki "Penny Universities" karena orang cukup bayar segelas kopi untuk berdiskusi sains dan politik.',
    keywords: [
      { word: 'serendipiti', hint: 'penemuan menyenangkan secara tak terduga' },
      { word: 'cendekia', hint: 'tajam pikiran dan pandai cari solusi' }
    ],
    sampleAngle: 'Hubungkan "Penny Universities" abad ke-17 dengan suasana santai warkop yang sering memicu serendipiti ide.'
  },
  {
    id: 'stage-07',
    title: 'Membela Kaum "Nanti Saja" (Penunda Pekerjaan) di Depan Hakim',
    role: 'Pengacara Spesialis Deadline',
    factSpark: 'Fakta pemantik: Psikolog menyebut prokrastinasi lebih sering dipicu pengelolaan emosi (takut gagal/perfeksionis) daripada sekadar malas.',
    keywords: [
      { word: 'resiliensi', hint: 'kemampuan bangkit dan beradaptasi cepat' },
      { word: 'nuansa', hint: 'sisi halus di balik sebuah masalah' }
    ],
    sampleAngle: 'Minta hakim melihat nuansa psikologis di balik penundaan, sambil mengakui tetap butuh sistem kerja yang disiplin.'
  },
  {
    id: 'stage-08',
    title: 'Jelaskan Apa Itu AI ke Nenek di Kampung dalam 30 Detik!',
    role: 'Cucu Andalan Keluarga Besar',
    factSpark: 'Fakta pemantik: Model bahasa AI belajar pola dari jutaan teks seperti murid yang sangat rajin membaca, bukan memiliki perasaan sadar.',
    keywords: [
      { word: 'lugas', hint: 'sederhana dan langsung ke pokoknya' },
      { word: 'andal', hint: 'dapat dipercaya dan kuat kinerjanya' }
    ],
    sampleAngle: 'Pakai analogi buku resep atau asisten dapur yang andal, tanpa jargon teknis yang bikin pusing.'
  },
  {
    id: 'stage-09',
    title: 'Debat Panas: Tim Bubur Diaduk vs Tidak Diaduk, Mana yang Lebih Beradab?',
    role: 'Moderator Perdamaian Sarapan',
    factSpark: 'Fakta pemantik: Secara gastronomi, pengadukan menyatukan rasa gurih kaldu dan tekstur, sedangkan tidak diaduk menjaga kontras tiap suapan.',
    keywords: [
      { word: 'ambivalen', hint: 'tertarik pada dua sisi sekaligus' },
      { word: 'ironi', hint: 'hal yang bertentangan dengan harapan' }
    ],
    sampleAngle: 'Tutup debat dengan kalimat kocak: ironi terbesar sarapan adalah bertengkar soal cara makan sementara buburnya keburu dingin.'
  },
  {
    id: 'stage-10',
    title: 'Kenapa Baca Buku Fisik Masih Menang Lawan Gulir Media Sosial?',
    role: 'Duta Perpustakaan Keliling',
    factSpark: 'Fakta pemantik: Membaca teks panjang melatih fokus mendalam (deep reading), berbeda dengan kebiasaan memindai cepat di layar.',
    keywords: [
      { word: 'artikulatif', hint: 'mampu menjelaskan gagasan dengan jernih' },
      { word: 'epigon', hint: 'sekadar peniru tanpa gagasan sendiri' }
    ],
    sampleAngle: 'Jelaskan bahwa bacaan utuh membuat kita makin artikulatif dan tidak sekadar jadi epigon potongan klip 15 detik.'
  },
  {
    id: 'stage-11',
    title: 'Kampanye: Wajibkan Mata Pelajaran "Cara Membantah dengan Sopan" di Sekolah',
    role: 'Calon Menteri Komunikasi Tongkrongan',
    factSpark: 'Fakta pemantik: Riset negosiasi menunjukkan orang lebih mudah berubah pikiran saat merasa didengar dulu daripada langsung diserang.',
    keywords: [
      { word: 'retorika', hint: 'seni berbicara secara efektif' },
      { word: 'bergeming', hint: 'tetap diam tenang tidak goyah' }
    ],
    sampleAngle: 'Tunjukkan bedanya debat sehat yang tetap bergeming saat diprovokasi dibanding perang komentar penuh emosi.'
  },
  {
    id: 'stage-12',
    title: 'Yakinkan Alien Agar Tidak Menghancurkan Bumi Gara-Gara Kuliner Nusantara',
    role: 'Utusan Galaksi Bidang Gorengan & Rendang',
    factSpark: 'Fakta pemantik: Indonesia memiliki lebih dari 17.000 pulau dengan ribuan rempah dan tradisi masakan lokal yang berbeda tiap daerah.',
    keywords: [
      { word: 'paradoks', hint: 'tampak berlawanan tapi benar adanya' },
      { word: 'serendipiti', hint: 'keberuntungan tak terduga' }
    ],
    sampleAngle: 'Tawarkan rendang dan pisang goreng ke kapten alien, lalu sebut kedatangan mereka ke warung ini sebagai serendipiti terbaik di galaksi.'
  },
  {
    id: 'stage-13',
    title: 'Review Jujur Hari Senin Kalau Hari Senin Itu Sebuah Aplikasi',
    role: 'Pengulas Produk Waktu Profesional',
    factSpark: 'Fakta pemantik: Di planet Venus, satu hari lebih panjang daripada satu tahunnya, jadi setidaknya Senin di Bumi cuma 24 jam.',
    keywords: [
      { word: 'eufemisme', hint: 'ungkapan penghalusan' },
      { word: 'resiliensi', hint: 'daya lenting bangkit dari tekanan' }
    ],
    sampleAngle: 'Kasih bintang dua dulu buat hari Senin, lalu bilang "Semangat Senin" adalah eufemisme untuk "butuh kopi dobel".'
  },
  {
    id: 'stage-14',
    title: 'Kenapa Hobi Receh Itu Penting Untuk Kesehatan Mental Orang Dewasa?',
    role: 'Terapis Bahagia Tanpa Ribet',
    factSpark: 'Fakta pemantik: Aktivitas bermain tanpa target produktivitas terbukti menurunkan hormon stres kortisol dan memicu kreativitas.',
    keywords: [
      { word: 'pragmatis', hint: 'berfokus pada manfaat nyata' },
      { word: 'mubazir', hint: 'sia-sia tak berguna' }
    ],
    sampleAngle: 'Bantah anggapan bahwa hobi yang tidak menghasilkan uang itu mubazir; justru itulah cara pragmatis menjaga kewarasan.'
  },
  {
    id: 'stage-15',
    title: 'Pidato Perpisahan untuk Kebiasaan Bilang "Otw" Padahal Baru Mandi',
    role: 'Ketua Gerakan Tobat Tepat Waktu',
    factSpark: 'Fakta pemantik: Psikolog menyebut "planning fallacy" membuat otak manusia selalu meremehkan waktu yang dibutuhkan untuk bersiap dan menempuh jalan.',
    keywords: [
      { word: 'skeptis', hint: 'kritis dan tidak langsung percaya tanpa bukti' },
      { word: 'acuh', hint: 'peduli dan menaruh perhatian (bukan cuek!)' }
    ],
    sampleAngle: 'Akui bahwa teman-teman jadi skeptis tiap dengar kata "otw", dan mulai sekarang ayo lebih acuh pada waktu orang lain.'
  },
  {
    id: 'stage-16',
    title: 'Bela Orang yang Sering Ngomong Sendiri di Kamar sebagai Tanda Orang Cerdas',
    role: 'Peneliti Monolog Cermin',
    factSpark: 'Fakta pemantik: Studi psikologi kognitif (Gary Lupyan) menemukan berbicara dengan diri sendiri membantu otak menyusun fokus dan memecahkan masalah lebih cepat.',
    keywords: [
      { word: 'cendekia', hint: 'tajam pikiran dan cepat paham' },
      { word: 'artikulatif', hint: 'jelas dan runtut menyampaikan ide' }
    ],
    sampleAngle: 'Kutip studi psikologi lalu candai penonton: latihan ngomong sendiri adalah tempat gym gratis biar makin artikulatif di depan orang!'
  }
];
