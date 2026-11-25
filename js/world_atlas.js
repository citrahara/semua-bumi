// Ensiklopedia 30 negara lintas benua untuk mode Jelajah di Semua Bumi.
// Setiap negara memuat koordinat label 3D, hasil bumi (SDA), buku, film, karya/sains, fakta unik, serta catatan Beliau dan Bus Damri.

export const WORLD_COUNTRIES = [
  {
    id: 'indonesia',
    name: 'Indonesia',
    region: 'Asia Tenggara',
    capital: 'Jakarta',
    lat: -2.2,
    lon: 117.5,
    tagline: 'Negeri kepulauan di garis khatulistiwa yang menyambungkan dua samudra.',
    sda: [
      'Nikel (produsen terbesar dunia untuk bahan baterai kendaraan listrik)',
      'Rempah pala dan cengkeh Maluku, kopi Arabika Gayo sampai Toraja, serta kakao',
      'Timah Bangka Belitung, gas alam, dan potensi panas bumi terbesar kedua dunia'
    ],
    book: {
      title: 'Semua Ikan di Langit (Ziggy Zezsyazeoviennazabrizkie) dan Bumi Manusia (Pramoedya Ananta Toer)',
      note: 'Satunya membawa Bus Damri Dipatiukur-Leuwipanjang melintasi semesta bersama Beliau dan ikan julung-julung; satunya lagi dituturkan lisan di Pulau Buru sebelum dibukukan.'
    },
    film: {
      title: 'Yuni (Kamila Andini, 2021) dan Laskar Pelangi (Riri Riza, 2008)',
      note: 'Yuni memenangkan Platform Prize di Festival Film Toronto dengan dialek Serang yang alami dan intim.'
    },
    work: {
      title: 'Candi Borobudur dan Gamelan di Voyager Golden Record',
      note: 'Borobudur disusun dari dua juta balok batu andesit saling mengunci tanpa semen, sementara gending Puspawarna dari Jawa ikut melesat ke luar tata surya di wahana Voyager 1.'
    },
    wowFact: 'Pulau Run yang mungil di Maluku pernah ditukar Belanda dengan Pulau Manhattan di New York pada Perjanjian Breda 1667 demi memonopoli rempah pala.',
    beliauNote: 'Beliau menunduk memandang gugusan pulau di bawah garis khatulistiwa. Dua ekor ikan julung-julung menukik rendah seolah mengenali Bandung dari ketinggian.',
    busNote: 'Dari sinilah trayek awal saya dulu bermula: Dipatiukur sampai Leuwipanjang. Sekarang bannya tidak lagi menyentuh aspal, melainkan melintasi gugusan pulau dari Sabang sampai Merauke.'
  },
  {
    id: 'jepang',
    name: 'Jepang',
    region: 'Asia Timur',
    capital: 'Tokyo',
    lat: 36.2,
    lon: 138.2,
    tagline: 'Negara kepulauan miskin tambang darat yang unggul dalam rekayasa presisi dan estetika tenang.',
    sda: [
      'Hasil laut pertemuan arus hangat Kuroshio dan arus dingin Oyashio',
      'Hutan kayu cedar (sugi) dan hinoki yang menutupi sekitar 67 persen wilayahnya',
      'Energi panas bumi vulkanik dan bahan baku semikonduktor kemurnian tinggi'
    ],
    book: {
      title: 'Kokoro (Natsume Soseki, 1914) dan Norwegian Wood (Haruki Murakami, 1987)',
      note: 'Kokoro memotret kesunyian transisi Jepang dari era samurai menuju masyarakat modern.'
    },
    film: {
      title: 'Spirited Away (Hayao Miyazaki, 2001) dan Seven Samurai (Akira Kurosawa, 1954)',
      note: 'Miyazaki mengerjakan Spirited Away tanpa naskah akhir yang rampung agar ekspresi Chihiro tumbuh spontan.'
    },
    work: {
      title: 'Kereta cepat Shinkansen dan seni perbaikan keramik Kintsugi',
      note: 'Shinkansen yang beroperasi sejak 1964 menjadi pelopor kereta peluru dunia, sedangkan Kintsugi menambal retakan keramik dengan emas alih-alih menyembunyikannya.'
    },
    wowFact: 'Nintendo berdiri di Kyoto pada 1889 sebagai pengrajin kartu lukis tangan Hanafuda, enam tahun sebelum bioskop komersial pertama di dunia dibuka.',
    beliauNote: 'Seekor ikan julung-julung berputar mengikuti garis pantai Honshu, memantulkan cahaya perak di atas atap kuil kayu.',
    busNote: 'Di negeri ini, keterlambatan kereta diukur dalam detik. Saya sendiri suka kagum melihat bagaimana hal kecil dirawat sampai ratusan tahun.'
  },
  {
    id: 'korea-selatan',
    name: 'Korea Selatan',
    region: 'Asia Timur',
    capital: 'Seoul',
    lat: 36.5,
    lon: 127.8,
    tagline: 'Semenanjung berbukit granit yang melompat menjadi pusat semikonduktor, sinema, dan desain global.',
    sda: [
      'Tambang tungsten, grafit, dan batu kapur di pegunungan timur',
      'Budi daya rumput laut (gim) dan hasil perikanan pesisir selatan',
      'Ekonomi berfokus pada manufaktur chip memori, layar OLED, dan kapal laut'
    ],
    book: {
      title: 'The Vegetarian (Han Kang, 2007)',
      note: 'Han Kang menjadi penulis Asia perempuan pertama yang meraih Nobel Sastra 2024 lewat prosa puitis tentang kerapuhan manusia.'
    },
    film: {
      title: 'Parasite (Bong Joon-ho, 2019) dan Memories of Murder (2003)',
      note: 'Seluruh rumah mewah di Parasite dibangun dari tanah kosong demi mengatur garis pandang kamera dan arah sinar matahari.'
    },
    work: {
      title: 'Aksara Hangeul (1443) dan arsitektur rumah tradisional Hanok',
      note: 'Raja Sejong merancang Hangeul agar bentuk huruf konsonannya meniru posisi lidah dan mulut saat berbicara sehingga mudah dipelajari semua lapisan warga.'
    },
    wowFact: 'Aksara Hangeul sengaja dirancang secara ilmiah pada abad ke-15 sampai bentuk hurufnya menjadi panduan pelafalan visual.',
    beliauNote: 'Beliau memperhatikan sungai yang membelah kota Seoul, sementara ikan-ikan terbang menyusun garis sejajar seperti aksara di langit.',
    busNote: 'Bong Joon-ho membangun satu rumah utuh hanya untuk satu film. Saya menghargai orang yang memperhatikan arah cahaya sampai sedetail itu.'
  },
  {
    id: 'tiongkok',
    name: 'Tiongkok',
    region: 'Asia Timur',
    capital: 'Beijing',
    lat: 35.0,
    lon: 104.0,
    tagline: 'Daratan luas dari gurun barat sampai delta sungai subur yang melahirkan banyak penemuan awal dunia.',
    sda: [
      'Unsur tanah jarang (rare earth elements) yang menopang industri magnet dan baterai global',
      'Batu bara, bijih besi, teh dari pegunungan selatan, serta pertanian padi dan gandum',
      'Kapasitas energi surya dan tenaga air terbesar di dunia (Bendungan Tiga Ngarai)'
    ],
    book: {
      title: 'The Three-Body Problem (Liu Cixin, 2008) dan Journey to the West (Abad ke-16)',
      note: 'Trilogi Liu Cixin membawa fiksi ilmiah keras tentang mekanika orbit tiga bintang ke pembaca seluruh dunia.'
    },
    film: {
      title: 'In the Mood for Love (Wong Kar-wai, 2000) dan Raise the Red Lantern (Zhang Yimou, 1991)',
      note: 'Wong Kar-wai merekam kerinduan dua tetangga Hong Kong lewat warna merah pekat, hujan, dan gerak lambat yang tak tergesa.'
    },
    work: {
      title: 'Kertas (Cai Lun), kompas magnetik, percetakan balok kayu, dan sutra',
      note: 'Empat penemuan klasik dari wilayah ini mengubah cara manusia mencatat ilmu dan berlayar melintasi samudra.'
    },
    wowFact: 'Jaringan kereta cepat di Tiongkok kini melampaui 45.000 kilometer, lebih panjang daripada keliling garis khatulistiwa bumi.',
    beliauNote: 'Di atas lekukan Sungai Kuning, kawanan ikan julung-julung berenang menembus kabut tipis seperti sapuan tinta di atas kertas.',
    busNote: 'Jalan tol dan rel di bawah sana membentang jauh sekali. Untung saya bisa terbang langsung tanpa perlu berhenti di persimpangan.'
  },
  {
    id: 'india',
    name: 'India',
    region: 'Asia Selatan',
    capital: 'New Delhi',
    lat: 21.8,
    lon: 79.0,
    tagline: 'Anak benua dengan ribuan bahasa, rempah, matematika kuno, dan misi antariksa hemat biaya.',
    sda: [
      'Rempah lada hitam, kunyit, kapulaga, teh Darjeeling dan Assam, serta kapas',
      'Bijih besi, mika, batu bara, dan pusat produksi obat generik serta perangkat lunak',
      'Dataran aluvial Sungai Gangga yang menjadi lumbung pangan ratusan juta orang'
    ],
    book: {
      title: 'The God of Small Things (Arundhati Roy, 1997) dan Midnight\'s Children (Salman Rushdie, 1981)',
      note: 'Keduanya merangkai sejarah keluarga dengan bahasa yang kaya warna, bau hujan monsun, dan ironi sosial.'
    },
    film: {
      title: 'Pather Panchali (Satyajit Ray, 1955) dan 3 Idiots (Rajkumar Hirani, 2009)',
      note: 'Satyajit Ray memproduksi Pather Panchali dengan dana terbatas di pedesaan Bengal hingga mengubah wajah sinema realis dunia.'
    },
    work: {
      title: 'Sistem angka desimal nol (Aryabhata dan Brahmagupta) serta misi Bulan Chandrayaan-3',
      note: 'Konsep angka nol sebagai bilangan penuh dirumuskan di India pada abad ke-7, dan pada 2023 Chandrayaan-3 menjadi wahana pertama yang mendarat dekat kutub selatan Bulan.'
    },
    wowFact: 'Misi pengorbit Mars Mangalyaan buatan India tahun 2014 menghabiskan biaya sekitar 74 juta dolar AS, lebih murah daripada anggaran produksi film Hollywood Gravity.',
    beliauNote: 'Beliau mengulurkan tangan saat angin monsun membawa wangi kapulaga dan hujan dari pesisir selatan.',
    busNote: 'Angka nol lahir di sini, padahal tanpa angka nol seluruh hitungan orbit saya di langit tidak akan pernah beres.'
  },
  {
    id: 'thailand',
    name: 'Thailand',
    region: 'Asia Tenggara',
    capital: 'Bangkok',
    lat: 15.2,
    lon: 101.0,
    tagline: 'Dataran subur Sungai Chao Phraya yang dikenal sebagai lumbung beras dan pusat sinema puitis Asia Tenggara.',
    sda: [
      'Beras melati (hom mali), karet alam terbesar dunia, singkong, dan buah tropis',
      'Perikanan Teluk Thailand dan batu permata safir serta rubi di timur',
      'Industri manufaktur otomotif dan komponen elektronik'
    ],
    book: {
      title: 'Four Reigns (Kukrit Pramoj, 1953)',
      note: 'Mengikuti kehidupan seorang perempuan di istana Bangkok melewati empat masa pemerintahan dan perubahan zaman.'
    },
    film: {
      title: 'Uncle Boonmee Who Can Recall His Past Lives (Apichatpong Weerasethakul, 2010) dan Bad Genius (2017)',
      note: 'Uncle Boonmee meraih Palme d\'Or di Festival Film Cannes dengan suasana hutan malam yang hening dan magis.'
    },
    work: {
      title: 'Arsitektur Wat Arun, seni ukir buah, dan sistem kanal kuno khlong',
      note: 'Menara Wat Arun di tepi sungai dihiasi ribuan pecahan porselen warna-warni yang dulunya dipakai sebagai pemberat kapal dagang.'
    },
    wowFact: 'Nama resmi ibu kota Bangkok dalam bahasa Thai tercatat sebagai nama tempat terpanjang di dunia dengan 168 huruf Latin.',
    beliauNote: 'Ikan-ikan terbang menari sebentar di atas pantulan emas sungai, membuat riak cahaya tanpa menyentuh air.',
    busNote: 'Kalau saya harus menuliskan nama lengkap kota Bangkok di papan trayek depan, kacanya pasti tidak akan cukup.'
  },
  {
    id: 'australia',
    name: 'Australia',
    region: 'Oseania',
    capital: 'Canberra',
    lat: -25.0,
    lon: 134.0,
    tagline: 'Benua pulau merah yang menyimpan fauna purba, karang raksasa, dan tambang mineral utama dunia.',
    sda: [
      'Bijih besi dan litium batuan keras (produsen terbesar dunia)',
      'Emas, bauksit, gas alam cair, serta wol domba Merino dan gandum',
      'Ekosistem Great Barrier Reef yang terlihat dari orbit bumi'
    ],
    book: {
      title: 'The Book Thief (Markus Zusak, 2005) dan Picnic at Hanging Rock (Joan Lindsay, 1967)',
      note: 'Markus Zusak menulis kisah seorang anak pencuri buku dengan sudut pandang narator yang tak biasa namun hangat.'
    },
    film: {
      title: 'Mad Max: Fury Road (George Miller, 2015) dan Lion (Garth Davis, 2016)',
      note: 'Lebih dari 80 persen adegan kejar-kejaran di Mad Max: Fury Road memakai aksi fisik nyata, bukan efek komputer.'
    },
    work: {
      title: 'Teknologi Wi-Fi (CSIRO, 1990-an) dan Gedung Opera Sydney',
      note: 'Tim radioastronom CSIRO Australia yang semula meneliti sinyal lubang hitam justru menciptakan chip pengurang pantulan sinyal yang menjadi fondasi Wi-Fi modern.'
    },
    wowFact: 'Pada 1932 tentara Australia pernah dikerahkan menghadapi 20.000 burung emu yang merusak ladang gandum, dan operasi itu berakhir mundur tanpa berhasil.',
    beliauNote: 'Beliau tersenyum tipis melihat tanah merah luas di bawah sana; kawanan ikan julung-julung beriringan menyusuri barisan terumbu karang.',
    busNote: 'Ilmuwan yang mencari lubang hitam malah menemukan Wi-Fi. Kadang perjalanan paling berharga justru dimulai saat kita sedang mencari hal lain.'
  },
  {
    id: 'selandia-baru',
    name: 'Selandia Baru',
    region: 'Oseania',
    capital: 'Wellington',
    lat: -41.5,
    lon: 173.0,
    tagline: 'Dua pulau hijau bergunung es dan geyser yang kaya energi terbarukan serta budaya Maori.',
    sda: [
      'Produk susu sapi, wol, daging domba, dan buah kiwi ekspor global',
      'Energi terbarukan (lebih dari 80 persen listrik berasal dari air dan panas bumi)',
      'Hasil hutan kayu pinus radiata dan perikanan laut dalam'
    ],
    book: {
      title: 'The Bone People (Keri Hulme, 1984) dan The Luminaries (Eleanor Catton, 2013)',
      note: 'Eleanor Catton memenangkan Booker Prize pada usia 28 tahun lewat novel misteri demam emas yang tersusun mengikuti fase bulan.'
    },
    film: {
      title: 'The Lord of the Rings (Peter Jackson, 2001-2003) dan Hunt for the Wilderpeople (Taika Waititi, 2016)',
      note: 'Seluruh trilogi The Lord of the Rings direkam langsung di pegunungan dan padang rumput Selandia Baru secara maraton.'
    },
    work: {
      title: 'Hak pilih perempuan nasional pertama di dunia (1893) dan seni ukir Maori Whakairo',
      note: 'Pada 1893 Selandia Baru menjadi negara modern pertama yang memberikan hak pilih kepada seluruh perempuan dewasa.'
    },
    wowFact: 'Jumlah domba di Selandia Baru masih jauh lebih banyak daripada jumlah penduduk manusianya, dengan perbandingan sekitar lima banding satu.',
    beliauNote: 'Angin pegunungan selatan begitu bening sampai bayangan ikan terbang jatuh jelas di permukaan danau gletser.',
    busNote: 'Bukit hijau di bawah sana tampak tenang sekali. Rasanya cocok untuk mematikan mesin sebentar dan mendengarkan angin.'
  },
  {
    id: 'inggris',
    name: 'Inggris',
    region: 'Eropa Barat',
    capital: 'London',
    lat: 53.6,
    lon: -2.0,
    tagline: 'Pulau berkabut tempat lahir revolusi industri, komputasi awal, dan banyak karya sastra dunia.',
    sda: [
      'Energi angin lepas pantai (salah satu kapasitas terbesar di dunia)',
      'Minyak dan gas Laut Utara, batu kapur, serta pertanian gandum dan jelai',
      'Pusat riset bioteknologi, kecerdasan buatan, dan penerbitan ilmiah global'
    ],
    book: {
      title: '1984 (George Orwell, 1949), Pride and Prejudice (Jane Austen, 1813), dan Frankenstein (Mary Shelley, 1818)',
      note: 'Orwell menulis 1984 di pulau terpencil Jura, Skotlandia, untuk mengingatkan betapa mudahnya bahasa dipakai membentuk kebenaran.'
    },
    film: {
      title: 'The Prestige (Christopher Nolan, 2006) dan Paddington 2 (Paul King, 2017)',
      note: 'Dari teka-teki pesulap London sampai kisah beruang santun pencinta selai jeruk, sinema Inggris kuat di penulisan karakter.'
    },
    work: {
      title: 'Mesin pemecah sandi Alan Turing, Penisilin (Fleming), dan AlphaFold',
      note: 'Penisilin ditemukan secara tidak sengaja dari jamur di cawan laboratorium London pada 1928, sementara di era baru AlphaFold memecahkan struktur lipatan protein.'
    },
    wowFact: 'Universitas Oxford sudah mulai mengajar sekitar tahun 1096, lebih dari dua abad sebelum Kekaisaran Aztek mendirikan ibu kotanya.',
    beliauNote: 'Di atas kabut Sungai Thames, seekor ikan julung-julung melingkari puncak jam besar tanpa mengusik loncengnya.',
    busNote: 'Di London ada bus merah bertingkat, tapi belum pernah ada yang punya trayek sampai ke tepi awan seperti saya.'
  },
  {
    id: 'prancis',
    name: 'Prancis',
    region: 'Eropa Barat',
    capital: 'Paris',
    lat: 46.8,
    lon: 2.4,
    tagline: 'Negeri sinema pertama, kebun anggur, energi nuklir bersih, dan tradisi panjang seni rupa.',
    sda: [
      'Pertanian gandum terbesar di Eropa Barat, kebun anggur, dan produk keju',
      'Listrik rendah karbon (sekitar 65-70 persen dipasok pembangkit nuklir)',
      'Industri dirgantara (Airbus), optik, dan parfum Grasse'
    ],
    book: {
      title: 'Le Petit Prince (Antoine de Saint-Exupery, 1943) dan Les Miserables (Victor Hugo, 1862)',
      note: 'Pangeran Kecil ditulis oleh seorang pilot surat udara tentang hal-hal terpenting yang tidak selalu tampak di mata.'
    },
    film: {
      title: 'Amelie (Jean-Pierre Jeunet, 2001) dan film perdana Lumiere Bersaudara (1895)',
      note: 'Pada Desember 1895 di sebuah kafe Paris, penonton pertama kali membayar tiket untuk menyaksikan film pendek berdurasi 50 detik.'
    },
    work: {
      title: 'Sistem metrik (meter dan kilogram), huruf Braille, dan Museum Louvre',
      note: 'Louis Braille menciptakan sistem baca tulis sentuh bagi tunanetra ketika usianya baru 15 tahun.'
    },
    wowFact: 'Lukisan Mona Lisa baru melesat menjadi ikon global setelah dicuri dari Museum Louvre pada 1911 dan diberitakan koran dunia selama dua tahun.',
    beliauNote: 'Beliau berhenti sejenak di atas ladang lavender selatan, mendengarkan desau angin seperti halaman buku yang dibalik pelan.',
    busNote: 'Kalau tidak ada percobaan Lumiere bersaudara di ruang bawah tanah kafe Paris itu, mungkin kita belum mengenal gedung bioskop.'
  },
  {
    id: 'belanda',
    name: 'Belanda',
    region: 'Eropa Barat',
    capital: 'Amsterdam',
    lat: 52.2,
    lon: 5.4,
    tagline: 'Negeri dataran rendah di bawah permukaan laut yang menguasai teknik air, pertanian presisi, dan mesin chip dunia.',
    sda: [
      'Eksportir produk pertanian dan benih rumah kaca terbesar kedua dunia meski wilayahnya mungil',
      'Energi angin darat dan lepas pantai, bunga potong, serta produk olahan susu',
      'Pusat mesin litografi sinar EUV (ASML) untuk pencetakan chip tercanggih global'
    ],
    book: {
      title: 'The Diary of a Young Girl (Anne Frank, terbit 1947)',
      note: 'Catatan harian remaja yang ditulis di ruang rahasia Amsterdam ini menjadi salah satu saksi sejarah paling jujur tentang kemanusiaan.'
    },
    film: {
      title: 'Loving Vincent (Dorota Kobiela & Hugh Welchman, 2017) dan Karakter (Mike van Diem, 1997)',
      note: 'Terinspirasi pelukis Belanda Vincent van Gogh, Loving Vincent dibuat dari 65.000 lukisan cat minyak asli yang dikerjakan satu per satu.'
    },
    work: {
      title: 'Tanggul penahan laut Delta Works, lukisan The Starry Night, dan mesin ASML',
      note: 'Analisis fisika modern menemukan pusaran langit pada lukisan Van Gogh mengikuti pola matematika aliran turbulensi.'
    },
    wowFact: 'ASML di Veldhoven adalah satu-satunya perusahaan di bumi yang membuat mesin sinar ultraviolet ekstrem untuk mencetak chip AI modern.',
    beliauNote: 'Kawanan ikan julung-julung tampak betah melayang di atas kanal-kanal lurus yang memantulkan langit senja.',
    busNote: 'Sepertiga negeri ini berada di bawah permukaan laut, namun warganya menanam sayur untuk setengah benua dan merakit mesin pembuat chip dunia.'
  },
  {
    id: 'swiss',
    name: 'Swiss',
    region: 'Eropa Tengah',
    capital: 'Bern',
    lat: 46.8,
    lon: 8.2,
    tagline: 'Negara pegunungan Alpen tanpa laut yang menjadi rumah riset fisika partikel dan rekayasa presisi.',
    sda: [
      'Tenaga air pegunungan Alpen (memasok lebih dari separuh kebutuhan listrik nasional)',
      'Susu pegunungan untuk keju dan cokelat, serta hutan kayu terkelola',
      'Industri jam presisi, farmasi, dan instrumen laboratorium ilmiah'
    ],
    book: {
      title: 'Heidi (Johanna Spyri, 1881) dan lahirnya Frankenstein di Villa Diodati (1816)',
      note: 'Di tepi Danau Jenewa yang terus diguyur hujan abu Tambora 1816, Mary Shelley merancang kisah Frankenstein.'
    },
    film: {
      title: 'My Life as a Zucchini (Claude Barras, 2016)',
      note: 'Animasi stop-motion berdurasi 66 menit tentang anak-anak panti asuhan yang sederhana namun menghangatkan hati.'
    },
    work: {
      title: 'World Wide Web (diciptakan Tim Berners-Lee di CERN, 1989) dan Teori Relativitas (Einstein di Bern)',
      note: 'Albert Einstein merumuskan teori relativitas khusus pada 1905 saat masih bekerja sebagai pegawai kantor paten di kota Bern.'
    },
    wowFact: 'Di Jenewa tahun 1989, laboratorium fisika CERN awalnya membuat World Wide Web hanya agar para ilmuwan mudah berbagi berkas riset.',
    beliauNote: 'Beliau menatap puncak bersalju Alpen, sementara ikan-ikan terbang menyala kebiruan di udara dingin yang jernih.',
    busNote: 'Internet modern dan teori relativitas sama-sama pernah singgah di negara mungil berpegunungan ini.'
  },
  {
    id: 'jerman',
    name: 'Jerman',
    region: 'Eropa Tengah',
    capital: 'Berlin',
    lat: 51.2,
    lon: 10.4,
    tagline: 'Jantung rekayasa teknik, percetakan modern, musik klasik, dan desain fungsional Eropa.',
    sda: [
      'Batu bara, garam kalium (potash), kayu hutan, dan pertanian jelai serta kentang',
      'Transisi kuat ke energi angin dan surya, plus industri optik presisi (Zeiss)',
      'Manufaktur mesin industri, otomotif, dan alat medis'
    ],
    book: {
      title: 'The Neverending Story (Michael Ende, 1979) dan Siddhartha (Hermann Hesse, 1922)',
      note: 'Karya Michael Ende merayakan daya imajinasi pembaca yang ikut menyelamatkan dunia cerita dari kekosongan.'
    },
    film: {
      title: 'The Lives of Others (Florian Henckel von Donnersmarck, 2006) dan Metropolis (Fritz Lang, 1927)',
      note: 'Metropolis dari era film bisu sudah membayangkan kota vertikal dan robot manusia jauh sebelum komputer lahir.'
    },
    work: {
      title: 'Mesin cetak huruf lepas Gutenberg (1450), sepeda awal Karl Drais (1817), dan sekolah desain Bauhaus',
      note: 'Kelaparan kuda akibat musim dingin 1816 pasca-Tambora mendorong Karl Drais di Mannheim menciptakan kendaraan roda dua tanpa kuda pertama.'
    },
    wowFact: 'Sebelum mesin cetak Gutenberg ditemukan di Mainz pada 1450, harga satu jilid buku salinan tangan bisa setara dengan harga sebuah rumah kecil.',
    beliauNote: 'Seekor ikan julung-julung menyusuri lekukan Sungai Rhein, melewati kota tempat buku pertama kali dicetak massal.',
    busNote: 'Mesin cetak, sepeda pertama, dan prinsip desain bersih Bauhaus semua lahir dari bengkel-bengkel sederhana di negeri ini.'
  },
  {
    id: 'italia',
    name: 'Italia',
    region: 'Eropa Selatan',
    capital: 'Roma',
    lat: 42.6,
    lon: 12.6,
    tagline: 'Semenanjung Mediterania yang menyatukan arsitektur kuno, musik, dan kerajinan tangan berumur ratusan tahun.',
    sda: [
      'Marmer putih Carrara, minyak zaitun, anggur, tomat, dan gandum durum',
      'Energi panas bumi Larderello (pembangkit panas bumi pertama di dunia sejak 1904)',
      'Desain industri, kulit, keramik, serta mesin presisi di Italia utara'
    ],
    book: {
      title: 'Invisible Cities (Italo Calvino, 1972) dan The Name of the Rose (Umberto Eco, 1980)',
      note: 'Calvino membayangkan percakapan Marco Polo dan Kubilai Khan tentang kota-kota imajiner yang penuh metafora ingatan.'
    },
    film: {
      title: 'Cinema Paradiso (Giuseppe Tornatore, 1988) dan Bicycle Thieves (Vittorio De Sica, 1948)',
      note: 'Cinema Paradiso menjadi surat cinta paling tulus tentang ruang proyektor bioskop desa dan persahabatan lintas usia.'
    },
    work: {
      title: 'Kubah beton Pantheon, biola Stradivarius, notasi musik modern, dan baterai listrik pertama (Volta)',
      note: 'Beton kubah Pantheon Roma mampu menutup retakannya sendiri saat terkena air berkat pecahan kapur panas di dalam adukannya.'
    },
    wowFact: 'Istilah volt pada baterai listrik berasal dari nama fisikawan Italia Alessandro Volta yang menciptakan tumpukan baterai pertama tahun 1800.',
    beliauNote: 'Beliau mendengarkan gema senar biola samar dari arah Cremona, tempat kayu cemara dingin dulu diubah menjadi suara hangat.',
    busNote: 'Kubah Pantheon sudah berdiri hampir dua ribu tahun tanpa besi tulangan. Beton modern saja masih belajar dari resep lamanya.'
  },
  {
    id: 'spanyol',
    name: 'Spanyol',
    region: 'Eropa Selatan',
    capital: 'Madrid',
    lat: 40.3,
    lon: -3.7,
    tagline: 'Semenanjung Iberia bermandikan matahari dengan arsitektur organik, minyak zaitun, dan jejak pertemuan budaya.',
    sda: [
      'Minyak zaitun (produsen terbesar dunia), jeruk, anggur, dan gabus alami',
      'Energi surya dan angin yang kuat, serta tambang merkuri kuno dan tembaga',
      'Perikanan Atlantik dan Mediterania serta jaringan kereta cepat terbesar kedua dunia'
    ],
    book: {
      title: 'Don Quixote (Miguel de Cervantes, 1605) dan The Shadow of the Wind (Carlos Ruiz Zafon, 2001)',
      note: 'Don Quixote kerap disebut sebagai novel modern pertama di dunia yang mempermainkan batas antara khayalan dan kenyataan.'
    },
    film: {
      title: 'Pan\'s Labyrinth (Guillermo del Toro, 2006) dan Klaus (Sergio Pablos, 2019)',
      note: 'Klaus dibuat oleh studio animasi Madrid dengan teknik pencahayaan gambar tangan 2D yang terasa seperti ilustrasi buku hidup.'
    },
    work: {
      title: 'Basilika Sagrada Familia (Antoni Gaudi) dan arsitektur istana Alhambra di Granada',
      note: 'Gaudi merancang lengkungan pilar Sagrada Familia memakai tali dan pemberat terbalik agar beban batu tersalur alami seperti batang pohon.'
    },
    wowFact: 'Pembangunan Sagrada Familia di Barcelona sudah dimulai sejak 1882, lebih dari dua puluh tahun sebelum pesawat pertama Wright bersaudara terbang.',
    beliauNote: 'Ikan-ikan terbang berputar melingkari menara batu yang masih terus dibangun dari abad ke abad.',
    busNote: 'Gaudi mencontoh bentuk batang pohon dan kerang laut untuk menopang bangunan batu raksasa. Alam memang guru arsitektur terbaik.'
  },
  {
    id: 'yunani',
    name: 'Yunani',
    region: 'Eropa Tenggara',
    capital: 'Athena',
    lat: 38.6,
    lon: 23.4,
    tagline: 'Gugusan ribuan pulau berbatu kapur putih tempat lahir filsafat, teater, dan matematika klasik.',
    sda: [
      'Minyak zaitun, madu timi, marmer, bauksit, dan nikel',
      'Armada pelayaran niaga terbesar di dunia yang menghubungkan jalur dagang global',
      'Energi matahari melimpah di kepulauan Laut Aegea'
    ],
    book: {
      title: 'Odyssey (Homeros) dan Zorba the Greek (Nikos Kazantzakis, 1946)',
      note: 'Odyssey mengisahkan perjalanan pulang sepuluh tahun melintasi laut penuh godaan yang menjadi pola dasar banyak cerita petualangan.'
    },
    film: {
      title: 'Eternity and a Day (Theo Angelopoulos, 1998)',
      note: 'Film puitis peraih Palme d\'Or tentang seorang penyair yang menemani seorang anak kecil menemukan kata-kata yang hilang.'
    },
    work: {
      title: 'Mekanisme Antikythera (komputer analog kuno ~100 SM) dan teater terbuka Epidaurus',
      note: 'Mekanisme gir perunggu Antikythera yang ditemukan di bangkai kapal kuno mampu menghitung gerhana dan siklus Olimpiade secara mekanis.'
    },
    wowFact: 'Di teater terbuka kuno Epidaurus, suara koin jatuh di tengah panggung bisa terdengar jelas sampai kursi penonton paling atas berkat bentuk susunan batu kapurnya.',
    beliauNote: 'Beliau mengapung tenang di atas Laut Aegea yang biru pekat; kawanan ikan julung-julung menyebar di antara pulau-pulau putih.',
    busNote: 'Orang Yunani kuno sudah merakit komputer gir perunggu untuk membaca gerak bulan dan matahari lebih dari dua ribu tahun silam.'
  },
  {
    id: 'norwegia',
    name: 'Norwegia',
    region: 'Eropa Utara',
    capital: 'Oslo',
    lat: 61.5,
    lon: 9.5,
    tagline: 'Negeri fyord curam dan aurora utara yang hampir seluruh listriknya ditenagai air terjun.',
    sda: [
      'Listrik tenaga air (sekitar 90-98 persen kebutuhan listrik nasional)',
      'Ikan salmon Atlantik, minyak dan gas Laut Utara (dikelola jadi dana abadi generasi mendatang)',
      'Hasil hutan kayu dan mineral logam ringan'
    ],
    book: {
      title: 'Sophie\'s World (Jostein Gaarder, 1991)',
      note: 'Mengenalkan sejarah filsafat dari Yunani kuno sampai modern lewat rangkaian surat misterius untuk seorang gadis berusia 14 tahun.'
    },
    film: {
      title: 'The Worst Person in the World (Joachim Trier, 2021)',
      note: 'Memotret kegamangan masa dewasa muda di kota Oslo dengan gaya penceritaan dua belas bab yang jujur.'
    },
    work: {
      title: 'Gudang Benih Global Svalbard dan lukisan The Scream (Edvard Munch)',
      note: 'Di dalam gunung es Svalbard dekat Kutub Utara tersimpan lebih dari satu juta sampel benih pangan dunia sebagai cadangan jika terjadi bencana global.'
    },
    wowFact: 'Sebagian besar mobil baru yang terjual di Norwegia kini bertenaga listrik, didukung listrik tenaga air yang melimpah.',
    beliauNote: 'Saat tirai hijau aurora bergetar di langit utara, sirip ikan julung-julung ikut memantulkan warna zamrud.',
    busNote: 'Di dekat kutub sana ada brankas benih untuk seluruh umat manusia. Rasanya menenangkan tahu seseorang menyiapkan cadangan kehidupan.'
  },
  {
    id: 'islandia',
    name: 'Islandia',
    region: 'Eropa Utara',
    capital: 'Reykjavik',
    lat: 64.9,
    lon: -18.8,
    tagline: 'Pulau api dan es di atas belahan dua lempeng benua dengan pemanas alami dari perut bumi.',
    sda: [
      'Energi panas bumi dan tenaga air yang memasok hampir 100 persen listrik dan pemanas rumah',
      'Perikanan ikan kod Atlantik Utara dan rumah kaca sayur yang dipanaskan uap bumi',
      'Peleburan aluminium ramah karbon berkat listrik terbarukan melimpah'
    ],
    book: {
      title: 'Independent People (Halldor Laxness, 1934) dan Saga Islandia Abad Pertengahan',
      note: 'Tradisi literasi Islandia begitu kuat sampai ada budaya Jolabokaflod: bertukar buku setiap malam Natal lalu membacanya sambil minum cokelat hangat.'
    },
    film: {
      title: 'Rams (Grimur Hakonarson, 2015) dan Woman at War (Benedikt Erlingsson, 2018)',
      note: 'Berlatar lembah sunyi dan padang lumut luas, sinema Islandia khas dengan humor datar yang hangat.'
    },
    work: {
      title: 'Parlemen Althing (berdiri 930 M) dan musik atmosferik Bjork serta Sigur Ros',
      note: 'Althing yang dulu berkumpul di lapangan batu Thingvellir tercatat sebagai salah satu lembaga parlemen tertua di dunia.'
    },
    wowFact: 'Islandia hampir tidak memiliki nyamuk sama sekali karena perubahan suhu beku-cair musim dinginnya memutus siklus hidup larva nyamuk.',
    beliauNote: 'Uap hangat dari geyser naik menyapa kaki Beliau; ikan-ikan terbang menyelinap di antara awan uap putih.',
    busNote: 'Tradisi memberi hadiah buku setiap akhir tahun itu patut ditiru. Bayangkan satu malam seluruh negeri sunyi karena semua orang sedang membaca.'
  },
  {
    id: 'rusia',
    name: 'Rusia',
    region: 'Eropa Timur & Asia Utara',
    capital: 'Moskow',
    lat: 61.0,
    lon: 86.0,
    tagline: 'Negara terluas di bumi yang membentang melintasi sebelas zona waktu dari Laut Baltik sampai Pasifik.',
    sda: [
      'Hutan taiga terbesar di dunia, gandum, serta cadangan gas alam, minyak, dan nikel',
      'Berlian Siberia, paladium, titanium, dan danau air tawar terdalam dunia (Danau Baikal)',
      'Pengalaman panjang di bidang teknologi antariksa dan pemecah es kutub'
    ],
    book: {
      title: 'Crime and Punishment (Fyodor Dostoevsky, 1866) dan Anna Karenina (Leo Tolstoy, 1878)',
      note: 'Dostoevsky menyelami gejolak batin manusia begitu dalam sampai karya psikologi modern banyak merujuk pada tulisannya.'
    },
    film: {
      title: 'Stalker (Andrei Tarkovsky, 1979) dan Hedgehog in the Fog (Yuri Norstein, 1975)',
      note: 'Film animasi pendek 10 menit Hedgehog in the Fog kerap dipilih para animator dunia sebagai karya animasi paling puitis sepanjang masa.'
    },
    work: {
      title: 'Tabel Periodik Unsur (Dmitri Mendeleev, 1869) dan satelit buatan pertama Sputnik 1 (1957)',
      note: 'Mendeleev berani mengosongkan beberapa kotak di tabel periodiknya dan meramalkan sifat unsur baru yang saat itu belum ditemukan.'
    },
    wowFact: 'Danau Baikal di Siberia menampung sekitar 20 persen seluruh air tawar permukaan yang tidak membeku di planet Bumi.',
    beliauNote: 'Melintasi hutan pinus tanpa ujung, ikan julung-julung terbang lurus mengikuti cahaya matahari rendah di cakrawala.',
    busNote: 'Sebelas zona waktu dalam satu negara. Saat penumpang di barat baru sarapan, orang di timur sudah bersiap tidur malam.'
  },
  {
    id: 'turki',
    name: 'Turki',
    region: 'Eurasia',
    capital: 'Ankara',
    lat: 39.0,
    lon: 35.2,
    tagline: 'Jembatan darat antara Asia dan Eropa yang menyimpan jejak peradaban tertua manusia.',
    sda: [
      'Kacang hazelnut (sekitar 65-70 persen pasokan dunia), buah ara, aprikot, dan teh Rize',
      'Cadangan mineral boron terbesar di dunia, marmer, dan tekstil kapas',
      'Selat Bosporus sebagai jalur maritim strategis antara Laut Hitam dan Mediterania'
    ],
    book: {
      title: 'My Name Is Red (Orhan Pamuk, 1998) dan Madonna in a Fur Coat (Sabahattin Ali, 1943)',
      note: 'Orhan Pamuk merangkai misteri pembunuhan pelukis miniatur Istanbul abad ke-16 dengan sudut pandang benda mati dan warna.'
    },
    film: {
      title: 'Winter Sleep (Nuri Bilge Ceylan, 2014) dan Kedi (Ceyda Torun, 2016)',
      note: 'Dokumenter Kedi mengikuti kehidupan sehari-hari ratusan ribu kucing jalanan Istanbul yang dirawat bersama oleh warga kota.'
    },
    work: {
      title: 'Situs batu kuno Gobekli Tepe (~9600 SM) dan kubah Hagia Sophia (537 M)',
      note: 'Gobekli Tepe dibangun sekitar 6.000 tahun lebih tua daripada Stonehenge, mengubah teori arkeologi tentang lahirnya peradaban manusia.'
    },
    wowFact: 'Kota Istanbul adalah satu-satunya kota metropolitan besar di dunia yang wilayahnya membentang langsung di dua benua, Eropa dan Asia.',
    beliauNote: 'Di atas Selat Bosporus, dua ekor ikan terbang melintas dari sisi Eropa ke sisi Asia hanya dalam satu kibasan ekor.',
    busNote: 'Menyeberang dua benua cuma butuh beberapa menit di atas jembatan Bosporus. Kucing-kucing di bawah sana juga tampak santai sekali.'
  },
  {
    id: 'mesir',
    name: 'Mesir',
    region: 'Afrika Utara',
    capital: 'Kairo',
    lat: 26.8,
    lon: 30.8,
    tagline: 'Hadiah Sungai Nil di tengah gurun Sahara yang mewariskan geometri arsitektur, kertas papirus, dan jalur dagang global.',
    sda: [
      'Kapas serat panjang Sungai Nil yang terkenal halus, kurma, dan jeruk',
      'Gas alam Mediterania, fosfat, minyak bumi, serta pendapatan jalur pelayaran Terusan Suez',
      'Taman surya raksasa Benban di Gurun Barat'
    ],
    book: {
      title: 'Palace Walk / Trilogi Kairo (Naguib Mahfouz, 1956)',
      note: 'Naguib Mahfouz menjadi penulis berbahasa Arab pertama yang menerima Nobel Sastra lewat potret hangat kehidupan keluarga Kairo.'
    },
    film: {
      title: 'Cairo Station (Youssef Chahine, 1958)',
      note: 'Menjadikan stasiun kereta Kairo yang ramai sebagai panggung drama sosial klasik sinema Arab.'
    },
    work: {
      title: 'Piramida Agung Giza, kalender matahari 365 hari, dan Perpustakaan Iskandariyah',
      note: 'Piramida Agung Giza sempat memegang rekor bangunan buatan manusia tertinggi di bumi selama lebih dari 3.800 tahun.'
    },
    wowFact: 'Cleopatra hidup lebih dekat secara waktu ke era peluncuran iPhone dan pendaratan di Bulan daripada ke masa pembangunan Piramida Agung Giza.',
    beliauNote: 'Beliau berhenti di atas pita hijau Sungai Nil yang membelah pasir keemasan, sementara ikan julung-julung menyala hangat.',
    busNote: 'Bayangkan satu piramida berdiri tegak selama hampir empat ribu tahun sementara kerajaan dan bahasa di sekelilingnya silih berganti.'
  },
  {
    id: 'maroko',
    name: 'Maroko',
    region: 'Afrika Utara',
    capital: 'Rabat',
    lat: 31.8,
    lon: -6.5,
    tagline: 'Gerbang Atlantik Afrika Utara dengan pegunungan Atlas, gurun Sahara, dan universitas tertua yang masih aktif.',
    sda: [
      'Cadangan fosfat terbesar di dunia (bahan penting pupuk pertanian global)',
      'Minyak argan endemik, buah zaitun, jeruk, serta perikanan sarden Atlantik',
      'Kompleks pembangkit listrik tenaga surya termal Noor Ouarzazate'
    ],
    book: {
      title: 'Rihla / Catatan Perjalanan Ibnu Battuta (Abad ke-14)',
      note: 'Penjelajah kelahiran Tangier ini menempuh sekitar 117.000 kilometer melintasi Afrika, Timur Tengah, India, sampai Nusantara.'
    },
    film: {
      title: 'The Blue Caftan (Maryam Touzani, 2022)',
      note: 'Kisah lembut penjahit kaftan tradisional di kota tua Sale yang merawat kerajinan bordir tangan di tengah dunia serba cepat.'
    },
    work: {
      title: 'Universitas Al-Qarawiyyin di Fez (berdiri 859 M) dan seni mozaik keramik Zellige',
      note: 'Didirikan oleh Fatima al-Fihri pada 859 M, Al-Qarawiyyin diakui UNESCO sebagai lembaga pendidikan tinggi pemberi gelar tertua yang masih beroperasi.'
    },
    wowFact: 'Universitas tertua di dunia yang masih beroperasi sampai hari ini didirikan oleh seorang perempuan bernama Fatima al-Fihri di Fez pada tahun 859.',
    beliauNote: 'Di atas kota tua berdinding biru dan terakota, kawanan ikan terbang melingkar mengikuti irama angin gurun.',
    busNote: 'Ibnu Battuta berkeliling lebih dari seratus ribu kilometer memakai kapal layar dan unta. Saya jadi merasa beruntung punya mesin yang tidak pernah lelah.'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    region: 'Afrika Timur',
    capital: 'Nairobi',
    lat: 0.4,
    lon: 37.9,
    tagline: 'Lembah Celah Besar Afrika Timur dengan sabana luas, kopi dataran tinggi, dan inovasi pembayaran ponsel.',
    sda: [
      'Teh hitam (salah satu eksportir terbesar dunia), kopi Arabika dataran tinggi, dan bunga mawar potong',
      'Energi panas bumi Lembah Rift (memasok hampir separuh listrik Kenya)',
      'Soda abu, ekosistem konservasi Maasai Mara, dan pelari jarak jauh kelas dunia'
    ],
    book: {
      title: 'A Grain of Wheat (Ngugi wa Thiong\'o, 1967) dan Unbowed (Wangari Maathai, 2006)',
      note: 'Wangari Maathai mendirikan Gerakan Sabuk Hijau yang menanam lebih dari 50 juta pohon hingga meraih Nobel Perdamaian 2004.'
    },
    film: {
      title: 'Nairobi Half Life (David Tosh Gitonga, 2012)',
      note: 'Drama energetik tentang anak muda desa yang merantau ke Nairobi mengejar mimpi menjadi aktor teater.'
    },
    work: {
      title: 'Layanan dompet seluler M-Pesa (2007) dan fosil manusia purba Danau Turkana',
      note: 'Kenya mempelopori sistem transfer uang lewat SMS telepon genggam biasa jauh sebelum pembayaran dompet digital ramai di negara maju.'
    },
    wowFact: 'Sistem pembayaran ponsel M-Pesa sudah dipakai jutaan warga Kenya sejak 2007 hanya melalui pesan singkat di ponsel non-layar sentuh.',
    beliauNote: 'Seekor ikan julung-julung menari rendah di atas kawanan jerapah yang berjalan tenang melewati sabana keemasan.',
    busNote: 'Di sini orang sudah kirim uang lewat ponsel sederhana sejak 2007. Inovasi sering lahir paling tajam dari kebutuhan nyata sehari-hari.'
  },
  {
    id: 'arab-saudi',
    name: 'Arab Saudi',
    region: 'Timur Tengah',
    capital: 'Riyadh',
    lat: 24.0,
    lon: 45.0,
    tagline: 'Jantung Semenanjung Arab berpadang pasir luas dengan sejarah jalur kafilah dan kota batu purba.',
    sda: [
      'Cadangan minyak mentah terbesar kedua dunia dan eksportir utama energi global',
      'Gas alam, fosfat, emas, kurma Ajwa dan Sukkari',
      'Teknologi desalinasi air laut terbesar dunia dan proyek tenaga surya gurun'
    ],
    book: {
      title: 'Cities of Salt (Abdul Rahman Munif, 1984)',
      note: 'Kisah tentang sebuah oasis gurun yang berubah drastis setelah ditemukannya minyak di bawah pasirnya.'
    },
    film: {
      title: 'Wadjda (Haifaa al-Mansour, 2012)',
      note: 'Film panjang pertama yang sepenuhnya disyuting di Arab Saudi sekaligus disutradarai perempuan, bercerita hangat tentang anak perempuan yang menabung demi membeli sepeda hijau.'
    },
    work: {
      title: 'Situs batu pahat Hegra / Al-Ula (peradaban Nabatea) dan observatorium langit gurun',
      note: 'Kota batu Hegra menyimpan lebih dari seratus fasad makam megah yang dipahat langsung pada tebing batu pasir raksasa.'
    },
    wowFact: 'Rub\' al Khali di selatan Arab Saudi adalah hamparan gurun pasir bersambung terbesar di bumi, namun di bawah pasirnya tersimpan jejak sungai purba.',
    beliauNote: 'Di atas bukit pasir yang melengkung lembut seperti ombak laut, ikan-ikan terbang berenang seolah pasir adalah samudra.',
    busNote: 'Tidak ada sungai yang mengalir sepanjang tahun di sini, namun manusianya belajar mengubah air laut menjadi air tawar untuk jutaan warga.'
  },
  {
    id: 'amerika-serikat',
    name: 'Amerika Serikat',
    region: 'Amerika Utara',
    capital: 'Washington D.C.',
    lat: 39.0,
    lon: -98.5,
    tagline: 'Benua beragam dari ngarai batu merah sampai lembah teknologi, sinema, dan misi penjelajahan ruang angkasa.',
    sda: [
      'Pertanian jagung, kedelai, dan gandum dataran Great Plains',
      'Gas alam, minyak serpih, kayu, tembaga, serta ekosistem riset teknologi dan semikonduktor',
      'Taman nasional raksasa seperti Yellowstone dan Grand Canyon'
    ],
    book: {
      title: 'To Kill a Mockingbird (Harper Lee, 1960) dan The Demon-Haunted World (Carl Sagan, 1995)',
      note: 'Carl Sagan mengajak pembaca mencintai sains dengan rasa ingin tahu yang rendah hati sekaligus kritis.'
    },
    film: {
      title: 'Interstellar (2014), The Truman Show (1998), dan Toy Story (1995)',
      note: 'Simulasi lubang hitam Gargantua di Interstellar memakai persamaan fisika nyata lima tahun sebelum foto lubang hitam M87 dirilis.'
    },
    work: {
      title: 'Pendaratan Apollo 11 (1969), sistem GPS satelit, dan wahana antar-bintang Voyager 1',
      note: 'Satelit GPS harus terus mengoreksi selisih 38 mikrodetik per hari sesuai teori relativitas agar peta di ponsel tidak meleset 11 kilometer setiap hari.'
    },
    wowFact: 'Voyager 1 yang diluncurkan dari Florida pada 1977 kini melesat lebih dari 24 miliar kilometer dari Bumi sambil membawa rekaman musik dunia termasuk gamelan Jawa.',
    beliauNote: 'Beliau menengadah ke arah ruang angkasa gelap di atas ngarai batu, seolah melambaikan tangan pada wahana kecil yang jauh di luar sana.',
    busNote: 'Voyager 1 sudah meluncur hampir setengah abad membawa musik dari Bumi. Saya jadi penasaran apakah suatu hari kita akan berpapasan dengannya.'
  },
  {
    id: 'kanada',
    name: 'Kanada',
    region: 'Amerika Utara',
    capital: 'Ottawa',
    lat: 56.5,
    lon: -106.0,
    tagline: 'Negeri sejuta danau, hutan pinus utara, sirup mapel, dan penemuan medis yang menyelamatkan jutaan nyawa.',
    sda: [
      'Air tawar (memiliki lebih dari separuh seluruh danau alami di dunia)',
      'Kayu hutan boreal, gandum, potash, uranium, nikel, serta 70 persen pasokan sirup mapel dunia',
      'Tenaga air besar di Quebec dan British Columbia'
    ],
    book: {
      title: 'Anne of Green Gables (L. M. Montgomery, 1908) dan The Handmaid\'s Tale (Margaret Atwood, 1985)',
      note: 'Anne of Green Gables merayakan imajinasi anak yatim piatu di Pulau Prince Edward yang mengubah cara orang sekitarnya melihat dunia.'
    },
    film: {
      title: 'Arrival (Denis Villeneuve, 2016) dan Past Lives (Celine Song, 2023)',
      note: 'Sutradara Quebec Denis Villeneuve membawa kepekaan visual sunyi ke fiksi ilmiah modern seperti Arrival dan Dune.'
    },
    work: {
      title: 'Penemuan hormon Insulin (Banting & Best, 1921) dan lengan robot Canadarm di Stasiun Luar Angkasa',
      note: 'Frederick Banting dan rekan-rekannya menjual paten insulin kepada Universitas Toronto seharga hanya 1 dolar agar obat itu terjangkau semua pasien diabetes.'
    },
    wowFact: 'Kanada memiliki garis pantai terpanjang di dunia sepanjang lebih dari 243.000 kilometer dan jutaan danau air tawar.',
    beliauNote: 'Di atas gugusan danau biru yang berkilau seperti cermin pecah, ikan-ikan julung-julung terbang dalam formasi melingkar.',
    busNote: 'Menjual paten obat penyelamat nyawa seharga satu dolar saja supaya semua orang bisa sembuh. Cerita seperti itu selalu membuat mesin saya terasa hangat.'
  },
  {
    id: 'meksiko',
    name: 'Meksiko',
    region: 'Amerika Utara',
    capital: 'Mexico City',
    lat: 23.6,
    lon: -102.5,
    tagline: 'Tanah peradaban Maya dan Aztek yang memberi dunia cokelat, jagung, vanila, dan warna seni mural.',
    sda: [
      'Perak (produsen terbesar dunia), tembaga, minyak bumi, dan gas alam',
      'Alpukat (eksportir terbesar dunia), jagung, cabai, tomat, dan kakao alami',
      'Keanekaragaman hayati tinggi dari gurun kaktus sampai hutan tropis selatan'
    ],
    book: {
      title: 'Pedro Paramo (Juan Rulfo, 1955)',
      note: 'Novel pendek tentang kota sunyi yang dihuni bisikan kenangan ini menjadi salah satu akar lahirnya realisme magis Amerika Latin.'
    },
    film: {
      title: 'Roma (Alfonso Cuaron, 2018) dan Coco (terinspirasi tradisi Dia de los Muertos)',
      note: 'Cuaron merekam Roma dalam hitam-putih tajam berdasarkan ingatan masa kecilnya sendiri bersama pengasuh keluarganya di Mexico City.'
    },
    work: {
      title: 'Domestikasi jagung dan cokelat kuno, piramida Chichen Itza, serta lukisan Frida Kahlo',
      note: 'Pada hari ekuinoks di Chichen Itza, bayangan matahari di tangga piramida membentuk siluet ular raksasa yang perlahan merayap turun.'
    },
    wowFact: 'Ibu kota Mexico City berdiri di atas bekas danau kuno Texcoco tempat ibu kota Aztek Tenochtitlan dulu dibangun di atas pulau dan kebun terapung.',
    beliauNote: 'Seekor ikan terbang menyapu warna-warni kertas potong festival di bawah angin sore yang hangat.',
    busNote: 'Tanpa tanaman dari wilayah ini, dunia tidak akan mengenal cokelat, tomat, atau jagung manis. Betapa banyak rasa yang kita pinjam dari sini.'
  },
  {
    id: 'brasil',
    name: 'Brasil',
    region: 'Amerika Selatan',
    capital: 'Brasilia',
    lat: -10.8,
    lon: -52.5,
    tagline: 'Raksasa hijau Amerika Selatan dengan hutan hujan Amazon, irama bossa nova, dan energi bersih.',
    sda: [
      'Kopi Arabika, gula tebu, dan jus jeruk (produsen terbesar dunia), serta kedelai',
      'Bijih besi, bauksit, niobium, serta bahan bakar bioetanol dari tebu',
      'Hutan Amazon dan Sungai Amazon yang mengalirkan seperlima air sungai dunia ke samudra'
    ],
    book: {
      title: 'The Alchemist (Paulo Coelho, 1988) dan The Hour of the Star (Clarice Lispector, 1977)',
      note: 'Clarice Lispector menulis dengan kejujuran batin yang tajam tentang sosok-sosok kecil yang sering terlewat di kota besar.'
    },
    film: {
      title: 'Central Station (Walter Salles, 1998) dan City of God (Fernando Meirelles, 2002)',
      note: 'Central Station mengisahkan mantan guru penulis surat stasiun yang menempuh perjalanan jauh membantu anak kecil mencari ayahnya.'
    },
    work: {
      title: 'Musik Bossa Nova, arsitektur modern Brasilia (Oscar Niemeyer), dan pesawat regional Embraer',
      note: 'Ibu kota Brasilia dirancang dari nol pada akhir 1950-an dengan denah menyerupai bentuk pesawat terbang dan kurva beton ikonik.'
    },
    wowFact: 'Sungai Amazon tidak memiliki satu pun jembatan yang melintasi aliran utamanya dari hulu hingga muara.',
    beliauNote: 'Beliau menatap kanopi hijau Amazon yang seakan tak bertepi; kawanan ikan terbang mengikuti kelokan sungai cokelat keemasan.',
    busNote: 'Hutan di bawah sana menciptakan awan hujannya sendiri. Rasanya seperti melihat mesin cuaca raksasa milik bumi bekerja secara langsung.'
  },
  {
    id: 'peru',
    name: 'Peru',
    region: 'Amerika Selatan',
    capital: 'Lima',
    lat: -9.8,
    lon: -75.0,
    tagline: 'Rumah pegunungan Andes, jejak insinyur batu Inka, dan asal muasal ribuan varietas kentang dunia.',
    sda: [
      'Tembaga, perak, seng, dan emas dari sabuk pegunungan Andes',
      'Lebih dari 3.800 varietas kentang asli, quinoa, alpaka, serta ikan teri (anchoveta) Pasifik',
      'Keanekaragaman ekosistem dari gurun pesisir sampai puncak salju dan Amazon'
    ],
    book: {
      title: 'The Time of the Hero (Mario Vargas Llosa, 1963)',
      note: 'Peraih Nobel Sastra 2010 asal Peru ini memotret dinamika kekuasaan dan persahabatan lewat struktur cerita yang lincah.'
    },
    film: {
      title: 'The Milk of Sorrow (Claudia Llosa, 2009)',
      note: 'Meraih Beruang Emas di Festival Film Berlin lewat kisah pemulihan ingatan seorang perempuan muda di pinggiran Lima.'
    },
    work: {
      title: 'Machu Picchu, sistem pencatatan tali simpul Quipu, dan garis raksasa Nazca',
      note: 'Bangsa Inka mengelola catatan sensus dan pajak tanpa huruf tulis melainkan memakai simpul tali berwarna bernama Quipu.'
    },
    wowFact: 'Hampir semua kentang yang dimakan manusia di seluruh dunia berawal dari domestikasi petani pegunungan Andes di sekitar Peru ribuan tahun lalu.',
    beliauNote: 'Di atas teras batu berkabut Machu Picchu, ikan julung-julung melayang setinggi puncak awan yang menyentuh gunung.',
    busNote: 'Dinding batu Inka disusun rapat tanpa adukan semen, mirip kunci batu Borobudur di seberang samudra. Manusia di tempat berjauhan sering menemukan akal yang serupa.'
  },
  {
    id: 'chili',
    name: 'Chili',
    region: 'Amerika Selatan',
    capital: 'Santiago',
    lat: -33.4,
    lon: -70.6,
    tagline: 'Pita daratan paling ramping di dunia dari gurun terkering Atacama sampai gletser Patagonia.',
    sda: [
      'Tembaga (produsen terbesar dunia) dan litium dataran garam Atacama untuk baterai modern',
      'Buah ceri, anggur, salmon budi daya selatan, dan kayu',
      'Langit paling jernih dan kering di bumi yang menjadi lokasi teleskop astronomi raksasa'
    ],
    book: {
      title: 'The House of the Spirits (Isabel Allende, 1982) dan puisi Pablo Neruda',
      note: 'Dua penyair Chili, Gabriela Mistral dan Pablo Neruda, sama-sama meraih Nobel Sastra lewat syair tentang cinta, alam, dan kehidupan sederhana.'
    },
    film: {
      title: 'The Mole Agent (Maite Alberdi, 2020) dan Bear Story (Gabriel Osorio, 2014)',
      note: 'Bear Story menjadi film animasi Amerika Latin pertama yang meraih Oscar lewat diorama mekanis beruang yang mengharukan.'
    },
    work: {
      title: 'Observatorium Radio ALMA dan Very Large Telescope di Gurun Atacama',
      note: 'Gabungan 66 antena teleskop ALMA di ketinggian 5.000 meter Atacama ikut menangkap foto nyata pertama lubang hitam M87.'
    },
    wowFact: 'Beberapa bagian Gurun Atacama di Chili utara belum pernah mencatat hujan berarti selama ratusan tahun sehingga dipakai NASA menguji robot penjelajah Mars.',
    beliauNote: 'Di bawah langit Atacama yang sarat bintang, ikan-ikan terbang menyatu dengan garis Galaksi Bima Sakti.',
    busNote: 'Dari sini langit malam terlihat begitu terang sampai bintang-bintang terasa bisa dijangkau dari atap bus saya.'
  }
];

export function getCountryById(id) {
  return WORLD_COUNTRIES.find((c) => c.id === id) || null;
}

export function findNearestCountry(lat, lon, maxDeg = 13) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < WORLD_COUNTRIES.length; i++) {
    const c = WORLD_COUNTRIES[i];
    const dLat = c.lat - lat;
    let dLon = Math.abs(c.lon - lon);
    if (dLon > 180) dLon = 360 - dLon;
    const d = Math.hypot(dLat, dLon * Math.cos((lat * Math.PI) / 180));
    if (d < bestDist && d <= maxDeg) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}
