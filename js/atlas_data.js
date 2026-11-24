// Bank wawasan luas lintas 6 bidang untuk Atlas Bumi 3D:
// Film & Sinema, Buku & Psikologi, Sejarah Dunia & Nusantara, Sains & Antariksa, Berita Terkini & Teknologi, Seni & Budaya.
// 3 mode ronde cepat: Tancap Peta & Tahun, Duel Garis Waktu (Mana Lebih Dulu?), dan Benang Merah (3 kartu terhubung).

export const CATEGORIES = [
  { id: 'all', name: 'Semua Bidang', color: '#D9B466' },
  { id: 'film', name: 'Film & Sinema', color: '#E06D53' },
  { id: 'buku', name: 'Buku & Psikologi', color: '#9B72CF' },
  { id: 'sejarah', name: 'Sejarah', color: '#D9A441' },
  { id: 'sains', name: 'Sains & Antariksa', color: '#4CA6C9' },
  { id: 'teknologi', name: 'Berita & Teknologi', color: '#3FA87B' },
  { id: 'seni', name: 'Seni & Budaya', color: '#E084A6' }
];

export function getCategoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

// ==========================================
// MODE 1: TANCAP PETA & TAHUN DI BOLA DUNIA 3D (30 FAKTA LINTAS 6 BIDANG)
// ==========================================
export const ATLAS_PIN_ROUNDS = [
  // --- FILM & SINEMA ---
  {
    id: 'pin-film-interstellar',
    category: 'film',
    title: 'Lubang Hitam Sebelum Difoto',
    prompt: 'Untuk film fiksi ilmiah ini, fisikawan Kip Thorne menulis persamaan gravitasi asli hingga menghasilkan simulasi visual lubang hitam yang akurat lima tahun sebelum foto lubang hitam nyata dirilis.',
    place: 'Los Angeles, Amerika Serikat',
    lat: 34.09,
    lon: -118.33,
    year: 2014,
    minYear: 1960,
    maxYear: 2025,
    wowFact: 'Simulasi Gargantua di film Interstellar (2014) begitu akurat sampai membuahkan tiga makalah ilmiah astrofisika sungguhan, dan tampilannya cocok dengan foto lubang hitam M87 pada 2019.',
    ramyeonHint: 'Cari pusat industri film Hollywood di pantai barat Amerika, lalu geser tahunnya ke dekade 2010-an.',
    ramyeonMore: 'Kalau suka detail produksi seperti ini, tim efek visualnya bahkan sempat menemukan bahwa cahaya yang melengkung di atas dan bawah cakram bukan bug komputer, melainkan sifat nyata gravitasi ekstrem.'
  },
  {
    id: 'pin-film-parasite',
    category: 'film',
    title: 'Rumah Mewah yang Dibangun dari Nol',
    prompt: 'Seluruh rumah arsitektur megah dan lorong pemukiman banjir di film peraih Film Terbaik Oscar non-bahasa Inggris pertama ini bukan lokasi asli, melainkan set penuh yang dibangun khusus mengikuti arah matahari.',
    place: 'Seoul, Korea Selatan',
    lat: 37.57,
    lon: 126.98,
    year: 2019,
    minYear: 1970,
    maxYear: 2025,
    wowFact: 'Sutradara Bong Joon-ho membangun seluruh rumah keluarga Park di Parasite (2019) dari nol di tanah kosong agar tinggi tangga, garis pandang kamera, dan sudut cahaya sesuai persis dengan papan sketsanya.',
    ramyeonHint: 'Negara asal perfilman pemenang Oscar non-Inggris pertama ada di Asia Timur, tepat sebelum pandemi 2020.',
    ramyeonMore: 'Detail menarik lain: garis vertikal pada kaca jendela dan dinding di rumah itu sengaja memisahkan bingkai antara keluarga kaya dan miskin sepanjang film.'
  },
  {
    id: 'pin-film-spirited',
    category: 'film',
    title: 'Tanpa Naskah Rampung Saat Produksi',
    prompt: 'Film animasi gambar tangan pemenang Oscar ini diproduksi tanpa skenario akhir yang selesai; sutradaranya menggambar papan cerita bab demi bab sambil menunggu cerita menemukan arahnya sendiri.',
    place: 'Tokyo, Jepang',
    lat: 35.68,
    lon: 139.69,
    year: 2001,
    minYear: 1960,
    maxYear: 2025,
    wowFact: 'Hayao Miyazaki membuat Spirited Away (2001) di Studio Ghibli tanpa naskah selesai agar reaksi tokoh Chihiro terasa alami seperti anak berusia 10 tahun yang benar-benar tersesat.',
    ramyeonHint: 'Studio animasi legendaris ini berada di ibu kota Jepang pada awal abad ke-21.',
    ramyeonMore: 'Miyazaki memakai konsep Jepang bernama "ma", yaitu jeda hening beberapa detik seperti adegan kereta di atas air, supaya penonton sempat bernapas di tengah cerita.'
  },
  {
    id: 'pin-film-lumiere',
    category: 'film',
    title: 'Pemutaran Bioskop Komersial Pertama',
    prompt: 'Penonton di sebuah ruang bawah tanah kafe untuk pertama kalinya membayar tiket guna menonton gambar bergerak berdurasi kurang dari satu menit tentang buruh pulang kerja dan kereta tiba di stasiun.',
    place: 'Paris, Prancis',
    lat: 48.87,
    lon: 2.33,
    year: 1895,
    minYear: 1850,
    maxYear: 1950,
    wowFact: 'Pada Desember 1895 di Salon Indien du Grand Café, Paris, Lumière bersaudara memutar 10 film pendek memakai alat Cinematographe yang bisa merekam sekaligus memproyeksikan gambar.',
    ramyeonHint: 'Berada di ibu kota Eropa Barat yang terkenal dengan menara besi, di penghujung abad ke-19.',
    ramyeonMore: 'Saat itu kamera mereka hanya menampung pita sepanjang 17 meter, sehingga durasi satu film dibatasi sekitar 45 sampai 50 detik saja.'
  },
  {
    id: 'pin-film-truman',
    category: 'film',
    title: 'Film yang Meramalkan Budaya Reality TV',
    prompt: 'Naskah film satir tentang seseorang yang seluruh hidupnya diam-diam disiarkan langsung 24 jam lewat 5.000 kamera tersembunyi ini sempat memicu istilah psikologis nyata bernama sindrom delusi panggung.',
    place: 'Florida, Amerika Serikat',
    lat: 30.32,
    lon: -86.14,
    year: 1998,
    minYear: 1970,
    maxYear: 2025,
    wowFact: 'The Truman Show (1998) syuting di kota terencana Seaside, Florida, dan melahirkan istilah "The Truman Show Delusion" dalam jurnal psikiatri pada 2008 untuk orang yang merasa hidupnya direkam.',
    ramyeonHint: 'Kota pantainya terletak di selatan Amerika Serikat, rilis di akhir dekade 1990-an.',
    ramyeonMore: 'Setiap sudut kamera dalam film itu sengaja diberi bingkai bulat samar di pinggir layar agar penonton merasa ikut mengintip dari kamera tersembunyi.'
  },

  // --- BUKU, SASTRA & PSIKOLOGI ---
  {
    id: 'pin-buku-frankenstein',
    category: 'buku',
    title: 'Novel Sains Fiksi dari Musim Panas Gelap',
    prompt: 'Karena hujan dan langit gelap berbulan-bulan akibat abu gunung api raksasa di belahan bumi lain, seorang penulis berusia 18 tahun tertantang membuat kisah horor di sebuah vila tepi danau.',
    place: 'Jenewa, Swiss',
    lat: 46.22,
    lon: 6.18,
    year: 1818,
    minYear: 1750,
    maxYear: 1900,
    wowFact: 'Mary Shelley menulis konsep Frankenstein saat terjebak hujan di Villa Diodati, Jenewa, pada Tahun Tanpa Musim Panas 1816 yang dipicu letusan Gunung Tambora di Indonesia, lalu menerbitkannya tahun 1818.',
    ramyeonHint: 'Vila tempat mereka berteduh menghadap danau di Eropa Tengah, beberapa tahun setelah 1815.',
    ramyeonMore: 'Pada malam lomba cerita hantu yang sama di vila itu, John Polidori juga menulis The Vampyre yang kelak menginspirasi kisah Dracula.'
  },
  {
    id: 'pin-buku-bumi',
    category: 'buku',
    title: 'Novel yang Dituturkan Secara Lisan di Pengasingan',
    prompt: 'Sebelum sempat ditulis di atas kertas, kisah Minke dan Nyai Ontosoroh dalam tetralogi sastra ini pertama kali diceritakan secara lisan berulang kali oleh penulisnya kepada sesama tahanan politik.',
    place: 'Pulau Buru, Indonesia',
    lat: -3.41,
    lon: 126.64,
    year: 1980,
    minYear: 1940,
    maxYear: 2010,
    wowFact: 'Pramoedya Ananta Toer menyusun Bumi Manusia di kepala dan menuturkannya di Pulau Buru sejak 1973 karena dilarang memakai alat tulis, baru terbit pertama kali pada 1980.',
    ramyeonHint: 'Lokasi pengasingannya ada di kepulauan Maluku, Indonesia timur, terbit tepat awal dekade 1980-an.',
    ramyeonMore: 'Banyak tahanan lain menghafalkan bab-bab ceritanya agar jika catatan hilang atau disita, naskahnya tetap bisa direkonstruksi.'
  },
  {
    id: 'pin-buku-kahneman',
    category: 'buku',
    title: 'Psikolog Peraih Nobel Ekonomi',
    prompt: 'Dua peneliti membuktikan manusia tidak mengambil keputusan secara rasional murni, melainkan lewat dua jalur berpikir: cepat intuitif (Sistem 1) dan lambat analitis (Sistem 2).',
    place: 'Yerusalem, Israel',
    lat: 31.77,
    lon: 35.21,
    year: 1979,
    minYear: 1950,
    maxYear: 2020,
    wowFact: 'Daniel Kahneman dan Amos Tversky menerbitkan Prospect Theory (1979) yang kelak dirangkum dalam buku Thinking, Fast and Slow; rasa sakit kehilangan uang terbukti terasa dua kali lebih kuat daripada senang mendapat jumlah yang sama.',
    ramyeonHint: 'Riset awalnya dimulai di Timur Tengah sekitar akhir dekade 1970-an.',
    ramyeonMore: 'Kahneman belum pernah mengambil satu pun mata kuliah ekonomi, tetapi gagasan bias kognitifnya mengantarkannya meraih Hadiah Nobel Ekonomi 2002.'
  },
  {
    id: 'pin-buku-dostoevsky',
    category: 'buku',
    title: 'Ditulis di Bawah Tenggat Waktu Utang',
    prompt: 'Seorang novelis menulis kisah psikologis mendalam tentang rasa bersalah mahasiswa miskin Raskolnikov secara bersambung di majalah demi melunasi utang yang hampir menyita hak cipta seluruh karyanya.',
    place: 'St. Petersburg, Rusia',
    lat: 59.93,
    lon: 30.33,
    year: 1866,
    minYear: 1800,
    maxYear: 1930,
    wowFact: 'Fyodor Dostoevsky menerbitkan Crime and Punishment pada 1866 di St. Petersburg, dan di tahun yang sama ia mendiktekan novel lain The Gambler dalam 26 hari dibantu stenografer yang kemudian menjadi istrinya.',
    ramyeonHint: 'Kota kanal di utara Eropa Timur, pertengahan abad ke-19.',
    ramyeonMore: 'Kalau kamu pernah membaca psikologi modern tentang rasionalisasi moral, banyak terapis masih merujuk konflik batin Raskolnikov dalam buku ini.'
  },
  {
    id: 'pin-buku-gutenberg',
    category: 'buku',
    title: 'Mesin Cetak yang Memicu Ledakan Ilmu',
    prompt: 'Dengan memadukan alat pemeras anggur dan huruf logam lepasan yang dapat disusun ulang, seorang pengrajin memangkas biaya buku secara drastis dan mengubah cara informasi menyebar di seluruh dunia.',
    place: 'Mainz, Jerman',
    lat: 49.99,
    lon: 8.24,
    year: 1450,
    minYear: 1300,
    maxYear: 1650,
    wowFact: 'Sekitar tahun 1450 di Mainz, Johannes Gutenberg menyempurnakan mesin cetak huruf lepasan logam; dalam 50 tahun saja jumlah buku di Eropa melonjak dari puluhan ribu menjadi jutaan eksemplar.',
    ramyeonHint: 'Kota di tepi Sungai Rhine, Jerman, pada pertengahan abad ke-15.',
    ramyeonMore: 'Sebelumnya di Tiongkok dan Korea (Jikji, 1377) huruf lepasan logam sudah ada lebih dulu, tetapi mekanisme tekan sekrup Gutenberg membuatnya sangat cepat untuk alfabet Latin.'
  },

  // --- SEJARAH DUNIA & NUSANTARA ---
  {
    id: 'pin-sej-run',
    category: 'sejarah',
    title: 'Pulau Rempah yang Ditukar dengan Manhattan',
    prompt: 'Pada abad ke-17, sebuah pulau mungil penghasil pala selebar tiga kilometer di Nusantara dianggap jauh lebih berharga daripada wilayah New Amsterdam, hingga dua kerajaan Eropa menukarnya lewat perjanjian resmi.',
    place: 'Pulau Run, Maluku, Indonesia',
    lat: -4.55,
    lon: 128.68,
    year: 1667,
    minYear: 1500,
    maxYear: 1850,
    wowFact: 'Lewat Perjanjian Breda (1667), Inggris menyerahkan Pulau Run di Kepulauan Banda kepada Belanda agar VOC memonopoli pala, dan sebagai gantinya Inggris mendapat wilayah yang kini menjadi Manhattan, New York.',
    ramyeonHint: 'Cari kepulauan rempah Maluku di Indonesia bagian timur, pada paruh kedua abad ke-17.',
    ramyeonMore: 'Di Eropa abad ke-17, segenggam biji pala harganya bisa menyamai emas karena dipercaya menangkal wabah dan mengawetkan makanan.'
  },
  {
    id: 'pin-sej-tambora',
    category: 'sejarah',
    title: 'Letusan Terbesar dalam Sejarah Modern',
    prompt: 'Ledakan gunung api berkekuatan VEI 7 ini terdengar hingga lebih dari 2.000 kilometer jauhnya, memangkas puncak gunung setinggi lebih dari satu kilometer, dan mendinginkan suhu seluruh planet.',
    place: 'Gunung Tambora, NTB, Indonesia',
    lat: -8.25,
    lon: 118.0,
    year: 1815,
    minYear: 1700,
    maxYear: 1950,
    wowFact: 'Letusan Gunung Tambora (April 1815) di Pulau Sumbawa menyemburkan aerosol hingga stratosfer, menyebabkan gagal panen global pada 1816 dan mendorong penemuan sepeda awal karena krisis kuda di Eropa.',
    ramyeonHint: 'Terletak di gugusan Nusa Tenggara, Indonesia, di awal abad ke-19.',
    ramyeonMore: 'Abu Tambora juga membuat matahari terbenam di Eropa berwarna merah-oranye menyala, yang terekam jelas pada lukisan-lukisan J.M.W. Turner.'
  },
  {
    id: 'pin-sej-nintendo',
    category: 'sejarah',
    title: 'Perusahaan Game yang Lahir di Abad ke-19',
    prompt: 'Jauh sebelum konsol video game atau layar televisi ada, perusahaan hiburan elektronik raksasa ini didirikan oleh seorang pengrajin sebagai toko kartu bermain lukis tangan tradisional.',
    place: 'Kyoto, Jepang',
    lat: 35.01,
    lon: 135.77,
    year: 1889,
    minYear: 1850,
    maxYear: 1990,
    wowFact: 'Nintendo didirikan oleh Fusajiro Yamauchi di Kyoto pada 1889 untuk membuat kartu Hanafuda dari kulit pohon murbei, artinya Nintendo sudah berdiri sebelum Menara Eiffel berusia setahun.',
    ramyeonHint: 'Kota budaya kuno Jepang di sebelah barat Tokyo, akhir abad ke-19.',
    ramyeonMore: 'Sebelum beralih ke video game pada 1970-an, Nintendo sempat mencoba bisnis perusahaan taksi hingga beras instan.'
  },
  {
    id: 'pin-sej-enigma',
    category: 'sejarah',
    title: 'Rumah Pemecah Sandi yang Melahirkan Komputer',
    prompt: 'Di sebuah rumah perkebunan rahasia di utara ibu kota, sekelompok matematikawan, ahli catur, dan ahli bahasa membangun mesin elektromekanis untuk membongkar jutaan kombinasi sandi militer tiap hari.',
    place: 'Bletchley Park, Inggris',
    lat: 51.99,
    lon: -0.74,
    year: 1940,
    minYear: 1900,
    maxYear: 1980,
    wowFact: 'Tim Alan Turing di Bletchley Park merancang mesin Bombe (1940) dan kemudian komputer elektronik Colossus untuk memecahkan sandi Enigma, yang diperkirakan mempercepat akhir Perang Dunia II dua tahun lebih cepat.',
    ramyeonHint: 'Terletak di Inggris bagian selatan, awal Perang Dunia II.',
    ramyeonMore: 'Para pemecah kode direkrut lewat teka-teki silang surat kabar Daily Telegraph yang harus diselesaikan dalam waktu kurang dari 12 menit.'
  },
  {
    id: 'pin-sej-oxford',
    category: 'sejarah',
    title: 'Kampus yang Lebih Tua dari Kekaisaran Aztek',
    prompt: 'Kegiatan belajar mengajar di universitas tertua berbahasa Inggris ini sudah tercatat berjalan dua abad lebih awal sebelum ibu kota Kekaisaran Aztek dibangun di Amerika Tengah.',
    place: 'Oxford, Inggris',
    lat: 51.75,
    lon: -1.26,
    year: 1096,
    minYear: 900,
    maxYear: 1500,
    wowFact: 'Pengajaran di Universitas Oxford sudah terdokumentasi sejak sekitar tahun 1096, sedangkan Tenochtitlan (ibu kota Aztek) baru berdiri pada 1325.',
    ramyeonHint: 'Kota universitas di selatan Inggris, menjelang akhir abad ke-11.',
    ramyeonMore: 'Uniknya, Universitas Cambridge lahir pada 1209 setelah sejumlah cendekiawan Oxford pergi mengungsi akibat perselisihan dengan warga kota.'
  },
  {
    id: 'pin-sej-emu',
    category: 'sejarah',
    title: 'Operasi Militer yang Kalah Melawan Burung',
    prompt: 'Tentara bersenjata senapan mesin dikerahkan untuk membantu petani mengatasi 20.000 burung besar tak bisa terbang yang merusak ladang gandum, namun pasukan militer akhirnya ditarik mundur tanpa berhasil.',
    place: 'Australia Barat, Australia',
    lat: -31.25,
    lon: 118.28,
    year: 1932,
    minYear: 1880,
    maxYear: 1980,
    wowFact: 'Peristiwa "Great Emu War" terjadi pada November 1932 di Australia Barat; burung emu berlari hingga 50 km/jam dan langsung berpencar ke kelompok kecil begitu tembakan terdengar.',
    ramyeonHint: 'Benua di selatan Indonesia, terjadi pada masa Depresi Besar 1930-an.',
    ramyeonMore: 'Pada akhirnya masalah ladang gandum diselesaikan bukan oleh senapan, melainkan dengan membangun pagar penghalang satwa sepanjang ribuan kilometer.'
  },

  // --- SAINS, ANTARIKSA & TUBUH MANUSIA ---
  {
    id: 'pin-sains-gps',
    category: 'sains',
    title: 'Teori Fisika yang Menjaga Peta Ponsel Akurat',
    prompt: 'Karena satelit navigasi mengorbit jauh dari gravitasi permukaan Bumi dan bergerak amat cepat, jam atom di dalamnya berjalan lebih cepat 38 mikrodetik tiap hari sehingga harus dikoreksi lewat teori fisikawan kelahiran Ulm ini.',
    place: 'Bern, Swiss',
    lat: 46.95,
    lon: 7.45,
    year: 1905,
    minYear: 1860,
    maxYear: 1960,
    wowFact: 'Tanpa koreksi Relativitas Khusus (dirumuskan Albert Einstein di Bern, 1905) dan Relativitas Umum (1915), navigasi GPS di ponselmu akan meleset sekitar 11 kilometer setiap hari.',
    ramyeonHint: 'Einstein bekerja sebagai pemeriksa paten di ibu kota Swiss saat "Tahun Ajaib" awal 1900-an.',
    ramyeonMore: 'Artinya setiap kali kamu memesan ojek daring atau membuka peta, ponselmu sedang menghitung efek lengkungan ruang-waktu secara nyata.'
  },
  {
    id: 'pin-sains-voyager',
    category: 'sains',
    title: 'Wahana Buatan Manusia Terjauh di Semesta',
    prompt: 'Diluncurkan bersama piringan emas berisi salam 55 bahasa (termasuk bahasa Indonesia) dan musik gamelan Jawa, wahana ini kini melaju lebih dari 24 miliar kilometer di ruang antarbintang.',
    place: 'Cape Canaveral, Amerika Serikat',
    lat: 28.39,
    lon: -80.6,
    year: 1977,
    minYear: 1955,
    maxYear: 2015,
    wowFact: 'Voyager 1 meluncur dari Florida pada 1977 dan membawa Golden Record berisi rekaman gamelan "Puspawarna" karya K.R.T. Wasitodipuro; satu pesan radio dari Bumi kini butuh lebih dari 22 jam untuk sampai.',
    ramyeonHint: 'Lokasi peluncuran roket NASA di pesisir timur Florida, akhir dekade 1970-an.',
    ramyeonMore: 'Komputer di dalam Voyager 1 memorinya ratusan ribu kali lebih kecil daripada ponsel biasa, tetapi masih bisa diperbaiki dari jarak miliaran kilometer.'
  },
  {
    id: 'pin-sains-glymphatic',
    category: 'sains',
    title: 'Sistem Pencuci Otak Saat Tidur',
    prompt: 'Peneliti saraf menemukan bahwa saat manusia tertidur lelap, sel-sel otak menyusut sementara agar cairan serebrospinal mengalir deras membilas protein sisa metabolisme yang menumpuk seharian.',
    place: 'Rochester, Amerika Serikat',
    lat: 43.16,
    lon: -77.61,
    year: 2012,
    minYear: 1980,
    maxYear: 2025,
    wowFact: 'Tim Maiken Nedergaard di University of Rochester menamainya Sistem Glimfatik (2012); saat kita begadang, limbah protein seperti beta-amiloid gagal dibilas optimal sehingga kepala terasa kabut.',
    ramyeonHint: 'Universitas riset di negara bagian New York bagian utara, awal dekade 2010-an.',
    ramyeonMore: 'Inilah alasan biologis kenapa tidur yang cukup bukan kemalasan, melainkan jadwal pembersihan fisik jaringan otak.'
  },
  {
    id: 'pin-sains-penicillin',
    category: 'sains',
    title: 'Cawan Petri Berantakan yang Menyelamatkan Jutaan Nyawa',
    prompt: 'Sepulang berlibur, seorang ahli bakteri mendapati satu cawan kultur bakteri yang lupa ia tutup ditumbuhi jamur biru-hijau, namun di sekeliling jamur itu seluruh bakteri mati bersih.',
    place: 'London, Inggris',
    lat: 51.52,
    lon: -0.17,
    year: 1928,
    minYear: 1880,
    maxYear: 1970,
    wowFact: 'Alexander Fleming menemukan Penisilin secara tak sengaja di St Mary\'s Hospital, London, pada 1928. Sebelum antibiotik ini diproduksi massal, luka gores kecil akibat duri mawar saja bisa berujung fatal.',
    ramyeonHint: 'Rumah sakit riset di ibu kota Inggris pada akhir dekade 1920-an.',
    ramyeonMore: 'Fleming sebenarnya hampir membuang cawan itu, tapi kebiasaannya memeriksa ulang sebelum mencuci menyelamatkan ratusan juta jiwa.'
  },

  // --- BERITA TERKINI & TEROBOSAN TEKNOLOGI ---
  {
    id: 'pin-tek-asml',
    category: 'teknologi',
    title: 'Satu Kota Kecil Pemegang Kunci Chip AI Dunia',
    prompt: 'Hampir semua chip ponsel flagship dan GPU pelatihan AI paling mutakhir di dunia hanya bisa dicetak menggunakan mesin sinar ultraviolet ekstrem (EUV) seharga ratusan juta dolar buatan satu perusahaan di kota kecil Eropa ini.',
    place: 'Veldhoven, Belanda',
    lat: 51.42,
    lon: 5.4,
    year: 2019,
    minYear: 1990,
    maxYear: 2026,
    wowFact: 'ASML di Veldhoven, Belanda, memproduksi mesin litografi EUV (mulai produksi massal chip komersial 2019) yang menembakkan laser 50.000 kali per detik ke tetesan timah cair untuk mengukir sirkuit skala nanometer.',
    ramyeonHint: 'Terletak di Belanda bagian selatan dekat Eindhoven, mulai diproduksi massal menjelang 2020.',
    ramyeonMore: 'Cermin optik di dalam mesin ini buatan Zeiss Jerman dan sangat rata: jika diperbesar seluas negara Jerman, tonjolan tertingginya tak sampai satu milimeter.'
  },
  {
    id: 'pin-tek-jwst',
    category: 'teknologi',
    title: 'Cermin Emas Pembaca Cahaya 13 Miliar Tahun Lalu',
    prompt: 'Diluncurkan dari pelabuhan antariksa Amerika Selatan memakai roket Ariane 5, teleskop cermin emas berbentuk sarang lebah ini mengorbit 1,5 juta kilometer dari Bumi untuk memotret galaksi paling awal alam semesta.',
    place: 'Kourou, Guyana Prancis',
    lat: 5.23,
    lon: -52.77,
    year: 2021,
    minYear: 1990,
    maxYear: 2026,
    wowFact: 'Teleskop James Webb meluncur dari Guyana Prancis pada 25 Desember 2021. Cerminnya dilapisi emas setipis rambut manusia karena emas memantulkan cahaya inframerah jauh lebih baik daripada perak.',
    ramyeonHint: 'Pelabuhan antariksa Eropa terletak di pesisir utara Amerika Selatan, dekat khatulistiwa, akhir 2021.',
    ramyeonMore: 'Karena jarak cahaya yang sangat jauh, memotret galaksi purba lewat James Webb secara harfiah berarti melihat masa lalu alam semesta.'
  },
  {
    id: 'pin-tek-alphafold',
    category: 'teknologi',
    title: 'AI yang Memecahkan Teka-Teki Biologi 50 Tahun',
    prompt: 'Sebuah tim peneliti AI memecahkan salah satu masalah tersulit biologi molekuler: memprediksi bentuk 3D lipatan protein hanya dari urutan asam aminonya, dan mengantarkan perancangnya meraih Nobel Kimia.',
    place: 'London, Inggris',
    lat: 51.53,
    lon: -0.12,
    year: 2020,
    minYear: 2000,
    maxYear: 2026,
    wowFact: 'AlphaFold 2 buatan Google DeepMind di London (2020) memetakan lebih dari 200 juta struktur protein yang sebelumnya bisa memakan waktu bertahun-tahun per protein di laboratorium, mempercepat riset obat dan enzim.',
    ramyeonHint: 'Kantor riset AI DeepMind berada di ibu kota Inggris, terobosannya diumumkan pada tahun 2020.',
    ramyeonMore: 'Database struktur proteinnya dibuka gratis untuk ilmuwan di seluruh dunia sehingga laboratorium kecil pun bisa memakainya.'
  },
  {
    id: 'pin-tek-cable',
    category: 'teknologi',
    title: 'Tulang Punggung Internet Bukan Satelit',
    prompt: 'Lebih dari 98 persen pesan, video, dan transaksi finansial antarbenua mengalir bukan lewat satelit ruang angkasa, melainkan lewat ratusan kabel serat optik seukuran selang taman yang digelar di dasar samudra.',
    place: 'Cornwall, Inggris',
    lat: 50.07,
    lon: -5.66,
    year: 1988,
    minYear: 1950,
    maxYear: 2025,
    wowFact: 'Kabel serat optik transatlantik pertama TAT-8 beroperasi pada 1988 mendarat di pesisir barat daya Inggris (serta AS dan Prancis); hari ini gangguan jangkar kapal di dasar laut dapat langsung memengaruhi internet satu kawasan.',
    ramyeonHint: 'Pesisir barat daya Inggris merupakan salah satu pintu pendaratan utama kabel transatlantik sejak akhir 1980-an.',
    ramyeonMore: 'Jaringan kabel bawah laut menjadi isu strategis geopolitik terbaru karena melintasi selat-selat sempit termasuk perairan Indonesia.'
  },

  // --- SENI, ARSITEKTUR, MUSIK & BUDAYA ---
  {
    id: 'pin-seni-monalisa',
    category: 'seni',
    title: 'Pencurian yang Melahirkan Lukisan Paling Terkenal',
    prompt: 'Selama ratusan tahun lukisan potret kecil ini hanya dikenal kalangan seniman, hingga seorang pekerja museum menyembunyikannya di balik mantel kerja, memicu berita surat kabar seluruh dunia selama dua tahun.',
    place: 'Paris, Prancis',
    lat: 48.86,
    lon: 2.34,
    year: 1911,
    minYear: 1850,
    maxYear: 1960,
    wowFact: 'Mona Lisa dicuri dari Museum Louvre oleh Vincenzo Peruggia pada Agustus 1911; ribuan orang datang mengantre hanya untuk memandangi ruang dinding kosong tempat lukisan itu tadinya tergantung.',
    ramyeonHint: 'Museum seni paling ramai di jantung Prancis, tepat setahun sebelum Titanic tenggelam.',
    ramyeonMore: 'Pelukis Pablo Picasso bahkan sempat ikut dimintai keterangan polisi sebagai saksi saat penyelidikan pencurian berlangsung.'
  },
  {
    id: 'pin-seni-pantheon',
    category: 'seni',
    title: 'Kubah Beton Kuno yang Bisa Menyembuhkan Retakannya Sendiri',
    prompt: 'Hampir dua milenium setelah selesai dibangun, kubah beton tanpa tulangan besi terbesar di dunia ini masih berdiri utuh, sementara beton modern rata-rata mulai rapuh dalam hitungan dekade.',
    place: 'Roma, Italia',
    lat: 41.9,
    lon: 12.48,
    year: 125,
    minYear: -200,
    maxYear: 500,
    wowFact: 'Pantheon Roma (selesai sekitar 125 M) memakai campuran abu vulkanik dan bongkahan kapur cepat (lime clasts) panas; saat retakan mikro terkena air hujan, kapur larut lalu mengkristal menutup celahnya sendiri.',
    ramyeonHint: 'Ibu kota Kekaisaran Romawi di semenanjung Italia, pada awal abad ke-2 Masehi.',
    ramyeonMore: 'Lubang bundar (oculus) berdiameter 9 meter di puncak kubah sengaja terbuka ke langit, dan lantai marmer di bawahnya dibuat sedikit cembung dengan lubang drainase halus untuk air hujan.'
  },
  {
    id: 'pin-seni-starry',
    category: 'seni',
    title: 'Pusaran Cat yang Cocok dengan Rumus Turbulensi',
    prompt: 'Dilukis dari jendela kamar perawatan pada dini hari sebelum fajar, pusaran langit biru dan bintang kuning pada kanvas ini kelak dianalisis fisikawan cocok dengan pola matematika aliran turbulensi fluida.',
    place: 'Saint-Rémy-de-Provence, Prancis',
    lat: 43.78,
    lon: 4.83,
    year: 1889,
    minYear: 1830,
    maxYear: 1950,
    wowFact: 'Vincent van Gogh melukis The Starry Night pada Juni 1889 di Prancis selatan; studi fisika terbaru menemukan skala pusaran sapuan kuasnya mengikuti hukum turbulensi Kolmogorov secara menakjubkan.',
    ramyeonHint: 'Wilayah Provence di Prancis bagian selatan, tahun yang sama dengan peresmian Menara Eiffel.',
    ramyeonMore: 'Desa dan menara gereja runcing di bagian bawah lukisan sebenarnya bukan pemandangan nyata di luar jendela kamarnya, melainkan ingatan Van Gogh tentang kampung halamannya di Belanda.'
  },
  {
    id: 'pin-seni-sagrada',
    category: 'seni',
    title: 'Bangunan yang Dibangun Lebih dari 140 Tahun',
    prompt: 'Dirancang dengan tiang batu bercabang seperti pepohonan hutan agar beban atap terbagi alami, basilika raksasa ini mulai dibangun pada abad ke-19 dan masih dikerjakan hingga abad ke-21.',
    place: 'Barcelona, Spanyol',
    lat: 41.4,
    lon: 2.17,
    year: 1882,
    minYear: 1800,
    maxYear: 1960,
    wowFact: 'Pembangunan Sagrada Família rancangan Antoni Gaudí dimulai tahun 1882 di Barcelona; Gaudí pernah menjawab santai ketika ditanya kapan selesai bahwa "klienku tidak terburu-buru".',
    ramyeonHint: 'Kota pesisir timur laut Spanyol di tepi Mediterania, akhir abad ke-19.',
    ramyeonMore: 'Gaudí merancang lengkungan bangunannya dengan menggantung tali dan pemberat terbalik lalu memotretnya lewat cermin untuk menemukan sudut gravitasi paling kokoh.'
  },
  {
    id: 'pin-seni-stradivari',
    category: 'seni',
    title: 'Rahasia Suara Biola dari Musim Dingin Panjang',
    prompt: 'Biola kayu buatan seorang luthier Italia abad ke-17 hingga kini bernilai jutaan dolar; penelitian cincin pohon menunjukkan rahasia kepadatan kayunya dibantu iklim dingin ekstrem Eropa saat itu.',
    place: 'Cremona, Italia',
    lat: 45.13,
    lon: 10.02,
    year: 1715,
    minYear: 1600,
    maxYear: 1850,
    wowFact: 'Antonio Stradivari mencapai masa emas pembuatan biola sekitar 1715 di Cremona menggunakan kayu cemara Alpen yang tumbuh amat lambat selama Zaman Es Kecil (Maunder Minimum), menghasilkan serat rapat dan resonansi jernih.',
    ramyeonHint: 'Kota di utara Italia dekat pegunungan Alpen, awal abad ke-18.',
    ramyeonMore: 'Dari sekitar 1.100 alat musik yang pernah dibuat bengkel Stradivari, sekitar 650 buah masih bertahan dan tetap dimainkan di panggung konser dunia.'
  },
  {
    id: 'pin-seni-borobudur',
    category: 'seni',
    title: 'Candi Batu Raksasa Tanpa Semen Sama Sekali',
    prompt: 'Lebih dari dua juta balok batu andesit vulkanik disusun saling mengunci seperti teka-teki kayu raksasa tanpa perekat adukan semen, lengkap dengan 2.672 panel relief cerita.',
    place: 'Magelang, Indonesia',
    lat: -7.61,
    lon: 110.2,
    year: 825,
    minYear: 500,
    maxYear: 1200,
    wowFact: 'Candi Borobudur dibangun Dinasti Syailendra sekitar tahun 825 M memakai teknik kunci batu (interlocking) dan saluran drainase mulut makara agar tetap lentur menghadapi gempa dan hujan tropis Jawa.',
    ramyeonHint: 'Berada di jantung Pulau Jawa, dibangun pada awal abad ke-9 Masehi.',
    ramyeonMore: 'Candi ini sempat terkubur abu vulkanik dan hutan selama berabad-abad sebelum kembali dicatat dan dipugar mulai abad ke-19.'
  }
];

// ==========================================
// MODE 2: DUEL GARIS WAKTU ("MANA LEBIH DULU?")
// ==========================================
export const TIMELINE_DUELS = [
  {
    id: 'duel-fax-lincoln',
    category: 'sejarah',
    a: { title: 'Mesin Faks pertama dipatenkan', place: 'Skotlandia', year: 1843, lat: 55.95, lon: -3.19 },
    b: { title: 'Abraham Lincoln wafat', place: 'Washington D.C.', year: 1865, lat: 38.9, lon: -77.04 },
    wowFact: 'Penemu Skotlandia Alexander Bain mematenkan mesin faks listrik pada 1843, artinya teknologi mengirim gambar lewat kabel sudah ada 22 tahun sebelum Abraham Lincoln wafat (1865).',
    ramyeonHint: 'Satu dari dua benda ini terasa modern banget, padahal versi awalnya sudah lahir jauh di pertengahan 1800-an.'
  },
  {
    id: 'duel-swiss-moon',
    category: 'sejarah',
    a: { title: 'Manusia mendarat di Bulan (Apollo 11)', place: 'Florida, AS', year: 1969, lat: 28.57, lon: -80.65 },
    b: { title: 'Perempuan Swiss mendapat hak pilih nasional', place: 'Bern, Swiss', year: 1971, lat: 46.95, lon: 7.45 },
    wowFact: 'Neil Armstrong sudah menginjakkan kaki di Bulan pada 1969, dua tahun sebelum Swiss mengesahkan hak pilih federal untuk perempuan lewat referendum pada 1971.',
    ramyeonHint: 'Jangan terkecoh kesan progresif negara Eropa modern; referendum hak pilih nasionalnya justru baru disahkan setelah era pendaratan Bulan.'
  },
  {
    id: 'duel-oxford-aztec',
    category: 'sejarah',
    a: { title: 'Universitas Oxford mulai mengajar', place: 'Oxford, Inggris', year: 1096, lat: 51.75, lon: -1.26 },
    b: { title: 'Ibu kota Kekaisaran Aztek didirikan', place: 'Meksiko', year: 1325, lat: 19.43, lon: -99.13 },
    wowFact: 'Universitas Oxford sudah mulai mengajar sekitar tahun 1096, lebih dari dua abad sebelum bangsa Aztek mendirikan Tenochtitlan pada 1325.',
    ramyeonHint: 'Kekaisaran Aztek sering terasa sangat kuno di film, padahal usianya jauh lebih muda dari yang dikira.'
  },
  {
    id: 'duel-nintendo-cinema',
    category: 'film',
    a: { title: 'Nintendo didirikan di Kyoto', place: 'Kyoto, Jepang', year: 1889, lat: 35.01, lon: 135.77 },
    b: { title: 'Pemutaran film bioskop pertama Lumière', place: 'Paris, Prancis', year: 1895, lat: 48.87, lon: 2.33 },
    wowFact: 'Nintendo berdiri tahun 1889 sebagai pembuat kartu Hanafuda, enam tahun lebih tua daripada pemutaran bioskop komersial pertama di dunia (1895).',
    ramyeonHint: 'Ingat cikal bakal Nintendo sebelum zaman elektronik, bukan konsol pertamanya.'
  },
  {
    id: 'duel-youtube-harriet',
    category: 'sains',
    a: { title: 'YouTube pertama kali diluncurkan', place: 'California, AS', year: 2005, lat: 37.62, lon: -122.41 },
    b: { title: 'Kura-kura milik Charles Darwin wafat', place: 'Queensland, Australia', year: 2006, lat: -26.84, lon: 152.96 },
    wowFact: 'Harriet, kura-kura Galapagos yang dikumpulkan ekspedisi Charles Darwin pada 1835, hidup sampai usia ~175 tahun dan baru mati tahun 2006, setahun setelah YouTube lahir (2005).',
    ramyeonHint: 'Kura-kura raksasa Galapagos umurnya bisa mendekati dua abad, bahkan melewati era awal internet.'
  },
  {
    id: 'duel-interstellar-m87',
    category: 'film',
    a: { title: 'Film Interstellar tayang di bioskop', place: 'Los Angeles, AS', year: 2014, lat: 34.09, lon: -118.33 },
    b: { title: 'Foto pertama Lubang Hitam M87 dirilis', place: 'Hawaii / Global', year: 2019, lat: 19.82, lon: -155.47 },
    wowFact: 'Interstellar tayang 2014 dengan simulasi lubang hitam berdasar rumus fisika asli, lalu foto nyata pertama Event Horizon Telescope baru dirilis 5 tahun kemudian (2019).',
    ramyeonHint: 'Simulasi di layar lebarnya sempat mendahului foto nyata teleskop radio global.'
  },
  {
    id: 'duel-tambora-frankenstein',
    category: 'buku',
    a: { title: 'Letusan Gunung Tambora di NTB', place: 'Sumbawa, Indonesia', year: 1815, lat: -8.25, lon: 118.0 },
    b: { title: 'Novel Frankenstein terbit pertama kali', place: 'London, Inggris', year: 1818, lat: 51.51, lon: -0.13 },
    wowFact: 'Letusan Tambora (1815) menyebabkan musim panas dingin dan hujan lebat di Eropa pada 1816, yang membuat Mary Shelley menulis Frankenstein lalu menerbitkannya tahun 1818.',
    ramyeonHint: 'Salah satu peristiwa alam di Indonesia menjadi pemicu langsung lahirnya buku satunya.'
  },
  {
    id: 'duel-vhs-instagram',
    category: 'teknologi',
    a: { title: 'Aplikasi Instagram diluncurkan', place: 'San Francisco, AS', year: 2010, lat: 37.77, lon: -122.42 },
    b: { title: 'Pabrik pemutar kaset VHS terakhir ditutup', place: 'Osaka, Jepang', year: 2016, lat: 34.69, lon: 135.5 },
    wowFact: 'Instagram sudah dipakai ratusan juta orang sejak 2010, sementara perusahaan Funai Electric di Jepang baru menghentikan produksi pemutar kaset VHS terakhir di dunia pada Juli 2016.',
    ramyeonHint: 'Teknologi lawas ternyata masih terus diproduksi bertahun-tahun setelah era media sosial ponsel meledak.'
  },
  {
    id: 'duel-harvard-calculus',
    category: 'sains',
    a: { title: 'Universitas Harvard didirikan', place: 'Cambridge, AS', year: 1636, lat: 42.37, lon: -71.12 },
    b: { title: 'Kalkulus dirumuskan Newton dan Leibniz', place: 'Cambridge, Inggris', year: 1666, lat: 52.2, lon: 0.12 },
    wowFact: 'Harvard berdiri tahun 1636, jadi selama tiga dekade pertamanya mahasiswa di sana lulus tanpa pernah belajar kalkulus karena cabang matematika itu belum dirumuskan.',
    ramyeonHint: 'Salah satu kampus tertua di Amerika sudah beroperasi sebelum Isaac Newton masuk masa puncak risetnya.'
  },
  {
    id: 'duel-monalisa-titanic',
    category: 'seni',
    a: { title: 'Lukisan Mona Lisa dicuri dari Louvre', place: 'Paris, Prancis', year: 1911, lat: 48.86, lon: 2.34 },
    b: { title: 'Kapal Titanic tenggelam di Atlantik', place: 'Atlantik Utara', year: 1912, lat: 41.73, lon: -49.95 },
    wowFact: 'Mona Lisa dicuri pada Agustus 1911 dan belum ditemukan ketika berita tenggelamnya Titanic menggemparkan dunia pada April 1912.',
    ramyeonHint: 'Keduanya terpisah kurang dari setahun di awal dekade 1910-an.'
  },
  {
    id: 'duel-toystory-google',
    category: 'film',
    a: { title: 'Film animasi 3D penuh pertama Toy Story', place: 'California, AS', year: 1995, lat: 37.83, lon: -122.28 },
    b: { title: 'Mesin pencari Google didirikan', place: 'Menlo Park, AS', year: 1998, lat: 37.45, lon: -122.18 },
    wowFact: 'Pixar sudah merilis film animasi komputer penuh Toy Story pada 1995, tiga tahun sebelum Larry Page dan Sergey Brin mendirikan Google (1998).',
    ramyeonHint: 'Salah satunya lahir di pertengahan 90-an, satunya lagi tepat menjelang pergantian milenium.'
  },
  {
    id: 'duel-sagrada-wright',
    category: 'seni',
    a: { title: 'Pembangunan Sagrada Família dimulai', place: 'Barcelona, Spanyol', year: 1882, lat: 41.4, lon: 2.17 },
    b: { title: 'Pesawat pertama Wright Bersaudara terbang', place: 'North Carolina, AS', year: 1903, lat: 36.02, lon: -75.67 },
    wowFact: 'Peletakan batu pertama Sagrada Família terjadi tahun 1882, lebih dari 20 tahun sebelum manusia pertama kali berhasil menerbangkan pesawat bermesin (1903).',
    ramyeonHint: 'Bangunan ikonik Barcelona itu sudah mulai dikerjakan sejak era kereta kuda.'
  },
  {
    id: 'duel-run-newton',
    category: 'sejarah',
    a: { title: 'Pulau Run Maluku ditukar dengan Manhattan', place: 'Maluku, Indonesia', year: 1667, lat: -4.55, lon: 128.68 },
    b: { title: 'Newton menerbitkan hukum gravitasi Principia', place: 'London, Inggris', year: 1687, lat: 51.51, lon: -0.13 },
    wowFact: 'Perjanjian Breda yang menukar Pulau Run dengan Manhattan ditandatangani tahun 1667, tepat 20 tahun sebelum Isaac Newton menerbitkan Principia Mathematica (1687).',
    ramyeonHint: 'Perdagangan rempah Maluku sudah mencapai puncaknya sebelum buku hukum gerak Newton dicetak.'
  },
  {
    id: 'duel-bumi-www',
    category: 'buku',
    a: { title: 'Novel Bumi Manusia terbit pertama kali', place: 'Jakarta, Indonesia', year: 1980, lat: -6.2, lon: 106.82 },
    b: { title: 'World Wide Web dirancang di CERN', place: 'Jenewa, Swiss', year: 1989, lat: 46.23, lon: 6.05 },
    wowFact: 'Bumi Manusia terbit pada Agustus 1980, sembilan tahun sebelum Tim Berners-Lee menulis proposal World Wide Web di laboratorium CERN (1989).',
    ramyeonHint: 'Satu terbit tepat di pembukaan dekade 80-an, satunya lagi di penghujung dekade yang sama.'
  },
  {
    id: 'duel-alphafold-jwst',
    category: 'teknologi',
    a: { title: 'AlphaFold 2 pecahkan lipatan protein', place: 'London, Inggris', year: 2020, lat: 51.53, lon: -0.12 },
    b: { title: 'Teleskop James Webb meluncur ke antariksa', place: 'Guyana Prancis', year: 2021, lat: 5.23, lon: -52.77 },
    wowFact: 'Terobosan AI biologi AlphaFold 2 diumumkan pada akhir 2020 di tengah pandemi, sedangkan Teleskop James Webb meluncur pada Natal 2021.',
    ramyeonHint: 'Selisihnya hanya satu tahun di awal dekade 2020-an.'
  }
];

// ==========================================
// MODE 3: BENANG MERAH ("PILIH 3 KAPSUL YANG DIAM-DIAM TERHUBUNG")
// ==========================================
export const CONNECTION_ROUNDS = [
  {
    id: 'conn-tambora',
    category: 'buku',
    prompt: 'Tiga dari enam kartu di bawah terhubung oleh satu peristiwa alam raksasa tahun 1815. Pilih ketiganya.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Gunung Tambora (NTB)', lat: -8.25, lon: 118.0 },
      { id: 'b', label: 'Novel Frankenstein', lat: 46.22, lon: 6.18 },
      { id: 'c', label: 'Penemuan Sepeda Awal', lat: 49.49, lon: 8.47 },
      { id: 'd', label: 'Menara Eiffel', lat: 48.86, lon: 2.29 },
      { id: 'e', label: 'Kamera Lumière', lat: 48.87, lon: 2.33 },
      { id: 'f', label: 'Biji Kopi Ethiopia', lat: 9.03, lon: 38.74 }
    ],
    threadTitle: 'Efek Domino Letusan Tambora 1815',
    wowFact: 'Abu Gunung Tambora memicu "Tahun Tanpa Musim Panas" 1816 di Eropa: hujan tanpa henti membuat Mary Shelley menulis Frankenstein di Swiss, sedangkan kelaparan kuda mendorong Karl Drais di Jerman menciptakan cikal bakal sepeda.',
    ramyeonHint: 'Cari satu gunung di Indonesia lalu pikirkan karya sastra horor dan alat transportasi tanpa kuda yang lahir karena musim dingin panjang 1816.'
  },
  {
    id: 'conn-breda',
    category: 'sejarah',
    prompt: 'Temukan tiga kartu yang terikat langsung dalam satu perjanjian dagang abad ke-17.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Pulau Run (Maluku)', lat: -4.55, lon: 128.68 },
      { id: 'b', label: 'Manhattan (New York)', lat: 40.71, lon: -74.01 },
      { id: 'c', label: 'Rempah Pala', lat: -4.52, lon: 129.9 },
      { id: 'd', label: 'Terusan Suez', lat: 30.58, lon: 32.27 },
      { id: 'e', label: 'Tembok Besar', lat: 40.43, lon: 116.57 },
      { id: 'f', label: 'Mesin Cetak Mainz', lat: 49.99, lon: 8.24 }
    ],
    threadTitle: 'Perjanjian Breda 1667',
    wowFact: 'Belanda rela melepas wilayah New Amsterdam (kini Manhattan) kepada Inggris demi menguasai penuh Pulau Run di Maluku dan memonopoli perdagangan pala dunia.',
    ramyeonHint: 'Salah satunya pulau mungil di Maluku yang rempahnya dulu ditukar dengan pusat finansial modern Amerika.'
  },
  {
    id: 'conn-interstellar',
    category: 'film',
    prompt: 'Pilih tiga kartu yang saling menyambung antara bioskop modern dan astrofisika.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Film Interstellar', lat: 34.09, lon: -118.33 },
      { id: 'b', label: 'Fisikawan Kip Thorne', lat: 34.14, lon: -118.12 },
      { id: 'c', label: 'Foto Lubang Hitam M87', lat: 19.82, lon: -155.47 },
      { id: 'd', label: 'Studio Ghibli', lat: 35.7, lon: 139.53 },
      { id: 'e', label: 'Biola Stradivarius', lat: 45.13, lon: 10.02 },
      { id: 'f', label: 'Kaset VHS', lat: 34.69, lon: 135.5 }
    ],
    threadTitle: 'Fisika Nyata di Layar Lebar',
    wowFact: 'Persamaan gravitasi dari Kip Thorne untuk film Interstellar (2014) memprediksi tampilan cincin cahaya lubang hitam yang kemudian terbukti sangat mirip dengan foto nyata M87 pada 2019.',
    ramyeonHint: 'Fokus pada film ruang angkasa 2014, konsultan fisikawannya, dan temuan teleskop lubang hitam.'
  },
  {
    id: 'conn-asml',
    category: 'teknologi',
    prompt: 'Tiga kartu ini membentuk rantai pasok teknologi paling strategis di berita terkini.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'ASML (Belanda)', lat: 51.42, lon: 5.4 },
      { id: 'b', label: 'Sinar EUV 13,5 nm', lat: 48.77, lon: 10.1 },
      { id: 'c', label: 'Chip AI Mutakhir', lat: 24.78, lon: 121.0 },
      { id: 'd', label: 'Beton Romawi', lat: 41.9, lon: 12.48 },
      { id: 'e', label: 'Kartu Hanafuda', lat: 35.01, lon: 135.77 },
      { id: 'f', label: 'Kura-kura Galapagos', lat: -0.95, lon: -90.97 }
    ],
    threadTitle: 'Monopoli Mesin Chip Dunia',
    wowFact: 'ASML di Belanda adalah satu-satunya perusahaan pembuat mesin litografi sinar EUV yang dipakai pabrik semikonduktor Taiwan dan dunia untuk mencetak chip AI tercanggih.',
    ramyeonHint: 'Hubungkan satu perusahaan Belanda, jenis sinar optiknya, dan produk prosesor yang dihasilkannya.'
  },
  {
    id: 'conn-gps',
    category: 'sains',
    prompt: 'Tiga kartu ini diam-diam bekerja sama setiap kali kamu membuka peta di ponsel.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Relativitas Einstein', lat: 46.95, lon: 7.45 },
      { id: 'b', label: 'Jam Atom Satelit', lat: 38.82, lon: -104.7 },
      { id: 'c', label: 'Akurasi Peta GPS', lat: -6.2, lon: 106.82 },
      { id: 'd', label: 'Jamur Penisilin', lat: 51.52, lon: -0.17 },
      { id: 'e', label: 'Kubah Pantheon', lat: 41.9, lon: 12.48 },
      { id: 'f', label: 'Novel Bumi Manusia', lat: -3.41, lon: 126.64 }
    ],
    threadTitle: 'Relativitas di Saku Kita',
    wowFact: 'Satelit GPS harus mengompensasi selisih waktu 38 mikrodetik per hari sesuai teori Relativitas Einstein; tanpanya, titik lokasimu di peta akan melenceng sekitar 11 kilometer setiap hari.',
    ramyeonHint: 'Cari teori fisika waktu, alat penunjuk waktu di orbit, dan layanan lokasi harian.'
  },
  {
    id: 'conn-pantheon',
    category: 'seni',
    prompt: 'Pilih tiga kartu yang menjelaskan kenapa bangunan Romawi kuno masih berdiri hampir 2.000 tahun.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Pantheon Roma', lat: 41.9, lon: 12.48 },
      { id: 'b', label: 'Bongkahan Kapur Panas', lat: 40.82, lon: 14.43 },
      { id: 'c', label: 'Beton Pulih Sendiri', lat: 42.36, lon: -71.09 },
      { id: 'd', label: 'Perang Emus', lat: -31.25, lon: 118.28 },
      { id: 'e', label: 'Teleskop James Webb', lat: 5.23, lon: -52.77 },
      { id: 'f', label: 'Film Parasite', lat: 37.57, lon: 126.98 }
    ],
    threadTitle: 'Resep Beton Abadi Romawi',
    wowFact: 'Penelitian MIT (2023) mengungkap bahwa pecahan kapur putih (lime clasts) dalam beton Pantheon bukan cacat adukan, melainkan mekanisme kimia yang mengeras ulang saat terkena air sehingga retakan menutup sendiri.',
    ramyeonHint: 'Cari satu kubah klasik Italia dan dua unsur material bangunannya.'
  },
  {
    id: 'conn-monalisa',
    category: 'seni',
    prompt: 'Tiga kartu ini mengubah sebuah lukisan biasa menjadi ikon budaya paling terkenal di dunia.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Museum Louvre (Paris)', lat: 48.86, lon: 2.34 },
      { id: 'b', label: 'Pencurian Tahun 1911', lat: 43.77, lon: 11.25 },
      { id: 'c', label: 'Potret Mona Lisa', lat: 43.78, lon: 10.92 },
      { id: 'd', label: 'Kabel Bawah Laut', lat: 50.07, lon: -5.66 },
      { id: 'e', label: 'AlphaFold 2', lat: 51.53, lon: -0.12 },
      { id: 'f', label: 'Sistem Glimfatik', lat: 43.16, lon: -77.61 }
    ],
    threadTitle: 'Viral Sebelum Era Internet',
    wowFact: 'Sebelum dicuri pada 1911 oleh Vincenzo Peruggia yang ingin membawanya pulang ke Italia, Mona Lisa jarang dibicarakan publik. Liputan koran global selama dua tahun membuatnya melesat menjadi lukisan paling masyhur.',
    ramyeonHint: 'Cari museum Paris, potret terkenal Leonardo da Vinci, dan kejadian kriminal awal abad ke-20.'
  },
  {
    id: 'conn-enigma',
    category: 'sejarah',
    prompt: 'Tiga kartu ini menjadi titik lahir ilmu komputer modern di tengah Perang Dunia II.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Bletchley Park', lat: 51.99, lon: -0.74 },
      { id: 'b', label: 'Alan Turing', lat: 52.2, lon: 0.12 },
      { id: 'c', label: 'Sandi Enigma', lat: 52.52, lon: 13.4 },
      { id: 'd', label: 'Sagrada Família', lat: 41.4, lon: 2.17 },
      { id: 'e', label: 'Candi Borobudur', lat: -7.61, lon: 110.2 },
      { id: 'f', label: 'The Truman Show', lat: 30.32, lon: -86.14 }
    ],
    threadTitle: 'Pemecah Sandi & Lahirnya Komputer',
    wowFact: 'Di Bletchley Park Inggris, Alan Turing dan timnya membongkar mesin sandi Enigma Jerman setiap hari, meletakkan fondasi teknik pemrograman dan komputasi modern.',
    ramyeonHint: 'Fokus pada markas kriptografi Inggris, tokoh matematikawannya, dan nama mesin sandinya.'
  },
  {
    id: 'conn-internet',
    category: 'teknologi',
    prompt: 'Temukan tiga kartu yang sebenarnya menopang hampir seluruh lalu lintas internet global hari ini.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Kabel Serat Optik Laut', lat: 50.07, lon: -5.66 },
      { id: 'b', label: 'Dasar Samudra Global', lat: 32.0, lon: -40.0 },
      { id: 'c', label: '98% Data Antarbenua', lat: 40.71, lon: -74.01 },
      { id: 'd', label: 'Zaman Es Kecil', lat: 45.13, lon: 10.02 },
      { id: 'e', label: 'Piringan Emas Voyager', lat: 28.39, lon: -80.6 },
      { id: 'f', label: 'Universitas Oxford', lat: 51.75, lon: -1.26 }
    ],
    threadTitle: 'Jalan Tol Internet di Dasar Laut',
    wowFact: 'Meskipun orang sering membayangkan internet melayang lewat satelit, lebih dari 98 persen data internasional melesat dalam bentuk denyut cahaya melalui ratusan kabel serat optik di dasar samudra.',
    ramyeonHint: 'Pilih tiga hal yang berkaitan dengan jalur kabel fisik pembawa data lintas benua.'
  },
  {
    id: 'conn-stradivari',
    category: 'seni',
    prompt: 'Tiga kartu ini saling berkaitan antara perubahan iklim masa lalu dan dunia musik klasik.',
    answerIds: ['a', 'b', 'c'],
    cards: [
      { id: 'a', label: 'Zaman Es Kecil (Abad 17)', lat: 46.8, lon: 8.2 },
      { id: 'b', label: 'Kayu Cemara Alpen', lat: 46.3, lon: 11.4 },
      { id: 'c', label: 'Biola Stradivarius', lat: 45.13, lon: 10.02 },
      { id: 'd', label: 'Spirited Away', lat: 35.68, lon: 139.69 },
      { id: 'e', label: 'Prospect Theory', lat: 31.77, lon: 35.21 },
      { id: 'f', label: 'Pulau Buru', lat: -3.41, lon: 126.64 }
    ],
    threadTitle: 'Resonansi dari Iklim Dingin',
    wowFact: 'Periode iklim dingin panjang di Eropa abad ke-17 membuat pohon cemara Alpen tumbuh sangat lambat dan berserat padat, bahan yang dipakai Antonio Stradivari untuk menciptakan biola dengan akustik legendaris.',
    ramyeonHint: 'Hubungkan fenomena iklim dingin Eropa, bahan kayunya, dan alat musik gesek Italia.'
  }
];
