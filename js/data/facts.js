// Bank konten Babak 1: Fakta Gacor atau Bualan Warkop
// Semua klaim fakta telah diperiksa akurasinya; bualan adalah mitos populer atau salah kaprah umum.

export const FACTS_BANK = [
  {
    id: 'fact-01',
    speaker: 'deden',
    category: 'Sejarah',
    statement: 'Universitas Oxford mulai beroperasi lebih awal daripada berdirinya Kekaisaran Aztek di Meksiko.',
    isFact: true,
    punchline: 'Oxford mulai mengajar sekitar tahun 1096, sedangkan ibu kota Aztek (Tenochtitlan) baru berdiri tahun 1325. Selisih dua abad lebih!',
    hook: 'Bahan ngobrol: "Kadang yang kelihatan kuno banget di film justru lebih muda daripada kampus yang masih buka sampai sekarang."',
    crowdRight: ['Wih, melek sejarah!', 'Deden sampai terdiam!'],
    crowdWrong: ['Kena gocek sejarah!', 'Kirain Aztek zaman dinosaurus ya?']
  },
  {
    id: 'fact-02',
    speaker: 'budi',
    category: 'Sains',
    statement: 'Albert Einstein dulu pernah tidak naik kelas gara-gara selalu gagal pelajaran matematika di sekolah.',
    isFact: false,
    punchline: 'Mitos legendaris! Di Swiss nilai tertinggi adalah 6, bukan 1. Banyak orang salah baca rapor Einstein dan mengira angka 6 itu jeblok.',
    hook: 'Bahan ngobrol: "Sebelum menghibur diri pakai cerita Einstein, cek dulu sistem penilaiannya. Einstein justru jago kalkulus sejak umur 15!"',
    crowdRight: ['Mitos grup WA terbongkar!', 'Pak Budi langsung hapus pesan!'],
    crowdWrong: ['Termakan hoaks lawas!', 'Pak Budi senyum kemenangan tuh!']
  },
  {
    id: 'fact-03',
    speaker: 'deden',
    category: 'Biologi',
    statement: 'Gurita punya tiga jantung, sembilan otak, dan darah berwarna biru.',
    isFact: true,
    punchline: 'Betul! Dua jantung memompa darah ke insang, satu ke seluruh tubuh. Darahnya biru karena memakai tembaga (hemosianin), bukan zat besi.',
    hook: 'Bahan ngobrol: "Kalau ada teman yang serba bisa tapi gampang capek, bilang saja dia kayak gurita: jantung tiga, tapi satu berhenti tiap berenang!"',
    crowdRight: ['Gacor! Biologi tamat!', 'Gurita menang banyak!'],
    crowdWrong: ['Kirain dongeng anime ya?', 'Darah biru beneran ternyata!']
  },
  {
    id: 'fact-04',
    speaker: 'budi',
    category: 'Tubuh Manusia',
    statement: 'Lidah manusia terbagi jadi zona rasa kaku: ujung hanya untuk manis, samping khusus asam, pangkal cuma pahit.',
    isFact: false,
    punchline: 'Bualan lawas dari buku teks lama! Penelitian David Hanig tahun 1901 disalahartikan. Faktanya seluruh bagian lidah bisa mengecap semua rasa dasar.',
    hook: 'Bahan ngobrol: "Coba saja taruh garam di ujung lidah. Tetap asin, kan? Peta lidah itu contoh klasik salah terjemah jurnal sains."',
    crowdRight: ['Buku SD langsung direvisi!', 'Cerdas, bukan ikut-ikutan!'],
    crowdWrong: ['Aduh, masih percaya peta lidah!', 'Langsung tes pakai garam gih!']
  },
  {
    id: 'fact-05',
    speaker: 'deden',
    category: 'Hukum Unik',
    statement: 'Di Swiss, memelihara hanya satu ekor marmot melanggar aturan kesejahteraan hewan.',
    isFact: true,
    punchline: 'Fakta asli! Marmot adalah hewan sosial yang bisa stres bila sendirian. Di Swiss bahkan ada jasa "sewa teman marmot" kalau pasangannya mati.',
    hook: 'Bahan ngobrol: "Di Swiss, marmot saja dilindungi negara supaya nggak kesepian. Masa kita kalah perhatian sama teman sendiri?"',
    crowdRight: ['Marmot saja punya pasangan!', 'Wawasan kelas internasional!'],
    crowdWrong: ['Dikirain ngarang ya? Beneran ada lho!', 'Swiss memang seketat itu!']
  },
  {
    id: 'fact-06',
    speaker: 'budi',
    category: 'Otak & Psikologi',
    statement: 'Manusia normal rata-rata hanya memakai 10 persen dari kapasitas otaknya.',
    isFact: false,
    punchline: 'Mitos film fiksi ilmiah! Pemindaian fMRI membuktikan hampir semua bagian otak aktif sepanjang hari, bahkan saat kita sedang tidur.',
    hook: 'Bahan ngobrol: "Kalau otak cuma kepakai 10 persen, cedera di 90 persen sisanya nggak akan ngaruh. Faktanya cedera kecil saja dampaknya besar."',
    crowdRight: ['Mitos Hollywood tumbang!', 'Neurologi langsung tepuk tangan!'],
    crowdWrong: ['Kebanyakan nonton film sci-fi nih!', 'Otakmu kerja 100 persen kok!']
  },
  {
    id: 'fact-07',
    speaker: 'deden',
    category: 'Makanan',
    statement: 'Madu murni yang disimpan rapat nyaris tidak bisa basi, bahkan madu berusia ribuan tahun di makam Mesir kuno masih utuh.',
    isFact: true,
    punchline: 'Fakta! Kadar air madu sangat rendah, sifatnya asam, dan lebah menambahkan enzim yang menghasilkan hidrogen peroksida. Bakteri sulit bertahan di sana.',
    hook: 'Bahan ngobrol: "Kalau madu mengkristal di rumah, bukan berarti basi. Cukup rendam botolnya di air hangat, balik cair lagi."',
    crowdRight: ['Manisnya awet ribuan tahun!', 'Pengetahuan dapur naik kelas!'],
    crowdWrong: ['Sayang banget kalau madu dibuang cuma gara-gara mengkristal!']
  },
  {
    id: 'fact-08',
    speaker: 'deden',
    category: 'Astronomi',
    statement: 'Satu hari di planet Venus lebih panjang daripada satu tahunnya sendiri.',
    isFact: true,
    punchline: 'Betul! Venus butuh 243 hari Bumi untuk berputar sekali pada porosnya, tapi cuma butuh 225 hari Bumi untuk mengelilingi Matahari.',
    hook: 'Bahan ngobrol: "Di Venus, ulang tahun datang lebih cepat daripada matahari terbit besok. Cocok buat yang merasa hari Senin kelamaan."',
    crowdRight: ['Astronomi jalan terus!', 'Hari Senin di Venus kebayang lamanya!'],
    crowdWrong: ['Tata surya memang penuh kejutan!', 'Venus muternya super santai!']
  },
  {
    id: 'fact-09',
    speaker: 'budi',
    category: 'Sejarah',
    statement: 'Napoleon Bonaparte dijuluki pemimpin super pendek karena tingginya tidak sampai 150 sentimeter.',
    isFact: false,
    punchline: 'Salah kaprah satuan ukur! Tinggi Napoleon 5 kaki 2 inci Prancis, setara sekitar 168 hingga 170 cm. Itu malah sedikit di atas rata-rata pria Prancis zamannya.',
    hook: 'Bahan ngobrol: "Napoleon jadi terkenal pendek karena propaganda karikatur Inggris dan beda panjang satuan inci Prancis dengan Inggris."',
    crowdRight: ['Propaganda abad ke-19 terbongkar!', 'Tinggi rata-rata ternyata!'],
    crowdWrong: ['Kena propaganda Inggris jadul nih!', 'Pak Budi ngakak kencang!']
  },
  {
    id: 'fact-10',
    speaker: 'deden',
    category: 'Biologi',
    statement: 'Secara botani, pisang termasuk buah beri (berry), sedangkan stroberi justru bukan beri sejati.',
    isFact: true,
    punchline: 'Tepat! Buah beri sejati tumbuh dari satu bakal buah dengan biji di dalam dagingnya, seperti pisang, tomat, dan terung. Biji stroberi ada di luar.',
    hook: 'Bahan ngobrol: "Ini fakta paling pas buat memicu debat seru di meja makan: pisang itu beri, stroberi bukan!"',
    crowdRight: ['Ilmuwan botani mengangguk!', 'Stroberi kena plot twist!'],
    crowdWrong: ['Namanya ada kata berry, tapi bukan beri!', 'Botani memang suka bikin pusing!']
  },
  {
    id: 'fact-11',
    speaker: 'budi',
    category: 'Hewan',
    statement: 'Ikan mas koki hanya punya daya ingat tiga detik, jadi tiap putaran akuarium selalu terasa baru baginya.',
    isFact: false,
    punchline: 'Bualan populer! Penelitian biologi menunjukkan ikan mas koki mampu mengingat rute labirin, warna, dan jadwal makan hingga berbulan-bulan.',
    hook: 'Bahan ngobrol: "Jangan lagi samakan orang pelupa sama ikan mas koki. Ikannya bisa tersinggung, soalnya ingatannya sampai berbulan-bulan!"',
    crowdRight: ['Ikan mas koki akhirnya dibela!', 'Mitos akuarium gugur!'],
    crowdWrong: ['Kasihan ikannya difitnah terus!', 'Tiga detik cuma gosip!']
  },
  {
    id: 'fact-12',
    speaker: 'deden',
    category: 'Geografi',
    statement: 'Indonesia memiliki lebih dari 17.000 pulau dan garis pantai terpanjang kedua di dunia setelah Kanada.',
    isFact: true,
    punchline: 'Benar! Menurut data Badan Informasi Geospasial dan CIA World Factbook, Indonesia punya lebih dari 17.000 pulau dengan garis pantai nomor dua terpanjang di dunia.',
    hook: 'Bahan ngobrol: "Kalau setiap hari pindah satu pulau di Indonesia, butuh lebih dari 46 tahun baru keliling semuanya."',
    crowdRight: ['Nusantara di luar kepala!', 'Bangga tanpa asal klaim!'],
    crowdWrong: ['Negeri sendiri masa ragu!', 'Garis pantai kita nomor dua dunia lho!']
  },
  {
    id: 'fact-13',
    speaker: 'budi',
    category: 'Sejarah',
    statement: 'Tembok Besar Tiongkok adalah satu-satunya bangunan buatan manusia yang terlihat jelas dengan mata telanjang dari Bulan.',
    isFact: false,
    punchline: 'Mitos legendaris! Para astronaut, termasuk Yang Liwei dari Tiongkok sendiri, memastikan Tembok Besar terlalu sempit untuk dilihat dengan mata telanjang dari Bulan maupun orbit rendah.',
    hook: 'Bahan ngobrol: "Lebar temboknya cuma beberapa meter dan warnanya menyatu dengan tanah. Dari Bulan, itu seperti melihat sehelai rambut dari jarak 3 kilometer."',
    crowdRight: ['Astronaut sepakat sama kamu!', 'Hoaks paling awet akhirnya tumbang!'],
    crowdWrong: ['Masih kejebak mitos antariksa!', 'Padahal astronaut sendiri sudah bantah!']
  },
  {
    id: 'fact-14',
    speaker: 'deden',
    category: 'Bahasa',
    statement: 'Bahasa Indonesia menyumbang sejumlah kata ke kamus bahasa Inggris modern, termasuk "amok", "orangutan", "sarong", dan "bamboo".',
    isFact: true,
    punchline: 'Betul! "Running amok" berasal dari kata Melayu-Indonesia "amuk", dan "bamboo" diserap dari kata "bambu" lewat jalur perdagangan abad ke-16.',
    hook: 'Bahan ngobrol: "Bahasa kita punya daya ekspor juga. Dari dulu kosakata Nusantara sudah ikut memperkaya bahasa dunia."',
    crowdRight: ['Nusantara mendunia!', 'Etimologi gacor!'],
    crowdWrong: ['Serius, "running amok" beneran dari kata "amuk"!']
  },
  {
    id: 'fact-15',
    speaker: 'budi',
    category: 'Sains',
    statement: 'Bunglon mengubah warna kulitnya terutama supaya bisa berkamuflase meniru motif apa pun di belakangnya.',
    isFact: false,
    punchline: 'Bukan tujuan utamanya! Bunglon paling sering berubah warna untuk berkomunikasi (marah, stres, menarik pasangan) dan mengatur suhu tubuh.',
    hook: 'Bahan ngobrol: "Warna bunglon itu sebenarnya status media sosial berjalan: kalau lagi emosi atau mau pamer, warnanya langsung mencolok."',
    crowdRight: ['Bunglon ternyata anak ekspresif!', 'Wawasan satwa anti-mainstream!'],
    crowdWrong: ['Kebanyakan nonton kartun nih!', 'Kamuflase bukan alasan utama bunglon!']
  },
  {
    id: 'fact-16',
    speaker: 'deden',
    category: 'Teknologi',
    statement: 'Kata "bug" dalam dunia komputer dipopulerkan pada 1947 setelah insinyur benar-benar menemukan seekor ngengat tersangkut di mesin komputer Harvard Mark II.',
    isFact: true,
    punchline: 'Fakta sejarah! Tim Grace Hopper menempelkan ngengat itu di buku log dengan catatan: "First actual case of bug being found."',
    hook: 'Bahan ngobrol: "Istilah teknis itu sering lahir dari kejadian receh. Dulu error komputer ya beneran gara-gara serangga nyasar."',
    crowdRight: ['Anak IT langsung hormat!', 'Ngengat paling terkenal dalam sejarah!'],
    crowdWrong: ['Beneran ada foto buku log ngengatnya di museum Smithsonian!']
  },
  {
    id: 'fact-17',
    speaker: 'budi',
    category: 'Kesehatan',
    statement: 'Membunyikan jari tangan hingga berbunyi "krek" terbukti secara medis menyebabkan penyakit radang sendi (artritis).',
    isFact: false,
    punchline: 'Tidak terbukti! Dokter Donald Unger bahkan membunyikan jari tangan kirinya saja selama 60 tahun (tangan kanan tidak) dan tidak ada beda artritis sama sekali. Ia menang Ig Nobel Prize!',
    hook: 'Bahan ngobrol: "Bunyi krek itu cuma letupan gelembung gas kecil di cairan sendi. Memang bikin orang sebelah risih, tapi bukan penyebab artritis."',
    crowdRight: ['Ig Nobel Prize dikuasai!', 'Jari-jari aman, yang kesal cuma teman sebelah!'],
    crowdWrong: ['Kena mitos turun-temurun!', 'Ada dokter yang eksperimen 60 tahun buat buktiin ini lho!']
  },
  {
    id: 'fact-18',
    speaker: 'deden',
    category: 'Sejarah',
    statement: 'Kleopatra hidup lebih dekat ke masa peluncuran iPhone pertama daripada ke masa pembangunan Piramida Agung Giza.',
    isFact: true,
    punchline: 'Gila tapi fakta! Piramida Giza dibangun sekitar 2560 SM, Kleopatra hidup sekitar 69 sampai 30 SM (selisih ~2.500 tahun), sedangkan jarak Kleopatra ke iPhone 2007 cuma ~2.037 tahun.',
    hook: 'Bahan ngobrol: "Mesir Kuno itu panjang banget sejarahnya. Buat Kleopatra sendiri, Piramida Giza sudah terasa sangat kuno."',
    crowdRight: ['Skala waktu langsung kebuka!', 'Fakta paling enak buat bikin orang melongo!'],
    crowdWrong: ['Padahal selisihnya ratusan tahun lebih dekat ke iPhone lho!']
  },
  {
    id: 'fact-19',
    speaker: 'budi',
    category: 'Hewan',
    statement: 'Banteng menyerang kain merah matador karena warna merah memicu hormon agresif pada mata banteng.',
    isFact: false,
    punchline: 'Bualan! Banteng itu dikromat (buta warna merah-hijau). Yang membuat banteng marah adalah gerakan kibasan kainnya, bukan warnanya.',
    hook: 'Bahan ngobrol: "Kain merah cuma dipakai supaya dramatis di mata penonton dan menyamarkan noda. Buat banteng, yang memancing itu gerak provokatifnya."',
    crowdRight: ['Mitos matador kelar!', 'Banteng ternyata buta merah!'],
    crowdWrong: ['Kain biru dikibasin juga diseruduk kok!']
  },
  {
    id: 'fact-20',
    speaker: 'deden',
    category: 'Psikologi',
    statement: 'Orang yang baru sedikit tahu tentang suatu bidang sering kali jauh lebih percaya diri merasa ahli dibanding pakar sungguhan.',
    isFact: true,
    punchline: 'Fakta psikologi terkenal bernama efek Dunning-Kruger (David Dunning & Justin Kruger, 1999). Makin dalam seseorang belajar, biasanya ia makin sadar betapa luas hal yang belum diketahuinya.',
    hook: 'Bahan ngobrol: "Kalau lihat orang komentar paling keras soal topik baru, ingat saja efek Dunning-Kruger."',
    crowdRight: ['Ilmu psikologi nongkrong mantap!', 'Relate banget sama kolom komentar!'],
    crowdWrong: ['Ini terkenal banget lho, namanya efek Dunning-Kruger!']
  },
  {
    id: 'fact-21',
    speaker: 'budi',
    category: 'Sejarah',
    statement: 'Kopi pertama kali ditanam massal secara komersial di Brasil, lalu baru dibawa penjajah Belanda ke Pulau Jawa.',
    isFact: false,
    punchline: 'Kebalik! Kopi berasal dari Ethiopia, lalu menyebar ke Yaman dan dibawa VOC ke Jawa akhir abad ke-17. Kopi Jawa justru menjadi salah satu sumber bibit kopi dunia sebelum Brasil meraksasa.',
    hook: 'Bahan ngobrol: "Saking terkenalnya kopi Jawa dulu, sampai hari ini di bahasa Inggris kata \'Java\' masih jadi julukan untuk secangkir kopi."',
    crowdRight: ['Sejarah kopi Nusantara nendang!', 'Bang Jaja langsung kasih ekstra gula!'],
    crowdWrong: ['Kebalik tuh! Justru kopi Jawa yang legend duluan!']
  },
  {
    id: 'fact-22',
    speaker: 'deden',
    category: 'Biologi',
    statement: 'Hiu sudah ada di Bumi lebih lama daripada pohon berkayu maupun cincin planet Saturnus.',
    isFact: true,
    punchline: 'Fakta! Fosil hiu tertua berusia lebih dari 400 juta tahun, sedangkan pohon sejati muncul sekitar 350 juta tahun lalu dan cincin Saturnus diperkirakan berusia 10 sampai 100 juta tahun.',
    hook: 'Bahan ngobrol: "Hiu sudah berenang tenang jauh sebelum Bumi punya hutan dan sebelum Saturnus pakai cincin."',
    crowdRight: ['Senior sejati di Bumi: hiu!', 'Fakta level kosmik!'],
    crowdWrong: ['Serius, hiu lebih senior daripada pohon dan cincin Saturnus!']
  },
  {
    id: 'fact-23',
    speaker: 'budi',
    category: 'Bahasa',
    statement: 'Huruf "J" adalah huruf pertama yang muncul dalam alfabet Latin Romawi Kuno.',
    isFact: false,
    punchline: 'Justru kebalik! Huruf "J" adalah huruf paling bontot yang masuk alfabet Latin modern, baru dibedakan secara konsisten dari huruf "I" pada abad ke-16.',
    hook: 'Bahan ngobrol: "Makanya di tulisan Romawi Kuno nama Julius Caesar ditulis IVLIVS CAESAR tanpa huruf J maupun U."',
    crowdRight: ['IVLIVS CAESAR langsung setuju!', 'Sejarah alfabet dikuasai!'],
    crowdWrong: ['Huruf J justru anak baru di alfabet!']
  },
  {
    id: 'fact-24',
    speaker: 'deden',
    category: 'Sains',
    statement: 'Awan kumulus putih biasa yang terlihat ringan seperti kapas rata-rata bisa berbobot ratusan ton.',
    isFact: true,
    punchline: 'Betul! Perhitungan fisikawan atmosfer Peggy LeMone (NCAR) menunjukkan awan kumulus ukuran 1 km kubik berisi sekitar 500 ton tetesan air. Ia melayang karena tetesannya sangat kecil dan tersebar luas di udara hangat.',
    hook: 'Bahan ngobrol: "Lain kali lihat awan melintas santai di atas kepala, ingat di atasmu lagi ada air seberat puluhan gajah yang melayang!"',
    crowdRight: ['Fisika atmosfer langsung tembus!', 'Ringan di mata, berat di timbangan!'],
    crowdWrong: ['Kelihatan kayak kapas, aslinya ratusan ton air!']
  }
];
