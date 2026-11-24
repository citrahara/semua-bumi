// Konten Ruang Belajar Interaktif (Akademi Bahasa Korea, Jepang & Inggris, Retorika, dan Laboratorium Siber /berita-terkini).
// Semua pelafalan memakai Web Speech Synthesis bawaan browser (ko-KR, ja-JP, en-US, id-ID).

export const KOREAN_ACADEMY = {
  id: 'academy-korean',
  npcId: 'sora',
  badgeName: 'Lencana Hangul',
  title: 'Paviliun Bahasa Korea (Hangul & Percakapan)',
  intro: 'Di sini kamu tidak langsung diuji! Pelajari dulu cara baca Hangul, dengarkan pelafalan aslinya, baru coba misi praktik pesan kopi di kafe Seoul.',
  hangulBasics: [
    { symbol: 'ㄱ', rom: 'g / k', tip: 'Bentuknya seperti lidah menyentuh langit-langit belakang (mirip huruf g/k).', speak: '가' },
    { symbol: 'ㄴ', rom: 'n', tip: 'Bentuknya seperti ujung lidah menyentuh gusi depan (bunyi n).', speak: '나' },
    { symbol: 'ㅁ', rom: 'm', tip: 'Bentuk kotak seperti mulut tertutup saat menyebut "m".', speak: '마' },
    { symbol: 'ㅅ', rom: 's', tip: 'Bentuknya menyerupai gigi; menghasilkan bunyi "s".', speak: '사' },
    { symbol: 'ㅇ', rom: 'diam / ng', tip: 'Di awal suku kata tidak berbunyi; di akhir suku kata berbunyi "ng".', speak: '아' },
    { symbol: 'ㅏ / ㅓ', rom: 'a / eo', tip: 'Garis pendek ke kanan berbunyi "a" (아), ke kiri berbunyi "eo" seperti "o" terbuka (어).', speak: '아 어' },
    { symbol: 'ㅗ / ㅜ', rom: 'o / u', tip: 'Garis ke atas berbunyi "o" bulat (오), garis ke bawah berbunyi "u" (우).', speak: '오 우' },
    { symbol: 'ㅎ', rom: 'h', tip: 'Mirip orang pakai topi bulat; berbunyi "h" seperti pada "Hwaiting!" (화이팅).', speak: '하' }
  ],
  phrases: [
    {
      hangul: '안녕하세요',
      rom: 'Annyeonghaseyo',
      meaning: 'Halo / Apa kabar (sopan)',
      level: 'Jondaetmal (Sopan)',
      note: 'Aman dipakai ke siapa saja yang baru dikenal, lebih tua, atau di toko dan kantor.',
      speak: '안녕하세요'
    },
    {
      hangul: '감사합니다',
      rom: 'Gamsahamnida',
      meaning: 'Terima kasih banyak (formal sopan)',
      level: 'Formal Sopan',
      note: 'Untuk teman sebaya yang akrab bisa memakai "Gomawo" (고마워), tapi bentuk ini paling aman.',
      speak: '감사합니다'
    },
    {
      hangul: '죄송합니다',
      rom: 'Joesonghamnida',
      meaning: 'Mohon maaf (sopan)',
      level: 'Formal Sopan',
      note: 'Dipakai saat membuat kesalahan atau ingin meminta maaf dengan tulus di situasi resmi.',
      speak: '죄송합니다'
    },
    {
      hangul: '저기요',
      rom: 'Jeogiyo',
      meaning: 'Permisi (memanggil pelayan / orang)',
      level: 'Sehari-hari Sopan',
      note: 'Ungkapan wajib saat memanggil staf kafe atau restoran di Korea tanpa terdengar kasar.',
      speak: '저기요'
    },
    {
      hangul: '아이스 아메리카노 하나 주세요',
      rom: 'Aiseu Amerikano hana juseyo',
      meaning: 'Tolong satu es kopi americano',
      level: 'Praktik Kafe',
      note: 'Pola "[Nama benda] + juseyo (주세요)" adalah kunci ajaib memesan apa pun di Korea!',
      speak: '아이스 아메리카노 하나 주세요'
    },
    {
      hangul: '괜찮아요',
      rom: 'Gwaenchanayo',
      meaning: 'Tidak apa-apa / Aku baik-baik saja',
      level: 'Sopan Santai',
      note: 'Bisa berarti menenangkan orang lain atau menolak tawaran secara halus.',
      speak: '괜찮아요'
    },
    {
      hangul: '잘 먹겠습니다',
      rom: 'Jal meokgesseumnida',
      meaning: 'Terima kasih atas makanannya (sebelum makan)',
      level: 'Budaya Makan',
      note: 'Diucapkan sebelum menyantap hidangan sebagai bentuk penghargaan kepada yang memasak atau mentraktir.',
      speak: '잘 먹겠습니다'
    },
    {
      hangul: '화이팅!',
      rom: 'Hwaiting!',
      meaning: 'Semangat! Kamu pasti bisa!',
      level: 'Ekspresi Populer',
      note: 'Serapan kreatif dari "fighting" yang dipakai menyemangati teman sebelum ujian atau presentasi.',
      speak: '화이팅'
    }
  ],
  practice: [
    {
      scene: 'Kamu baru masuk kedai kopi di Seoul dan ingin memanggil barista dengan sopan. Apa yang kamu ucapkan?',
      options: [
        { label: '저기요! (Jeogiyo!)', ok: true },
        { label: '잘 먹겠습니다! (Jal meokgesseumnida!)', ok: false },
        { label: '죄송합니다! (Joesonghamnida!)', ok: false }
      ],
      feedback: 'Tepat! "Jeogiyo" dipakai memanggil staf toko atau pelayan dengan sopan.'
    },
    {
      scene: 'Sekarang kamu mau pesan satu es americano. Pola kalimat mana yang benar?',
      options: [
        { label: '아이스 아메리카노 하나 주세요 (Aiseu Amerikano hana juseyo)', ok: true },
        { label: '괜찮아요 (Gwaenchanayo)', ok: false },
        { label: '화이팅 (Hwaiting)', ok: false }
      ],
      feedback: 'Cakep! Akhiran "juseyo" (주세요) berarti "tolong berikan".'
    },
    {
      scene: 'Kopinya diantar plus bonus kue gratis dari pemilik kafe! Bagaimana kamu berterima kasih dengan sopan?',
      options: [
        { label: '감사합니다! (Gamsahamnida!)', ok: true },
        { label: '저기요! (Jeogiyo!)', ok: false },
        { label: '죄송합니다! (Joesonghamnida!)', ok: false }
      ],
      feedback: 'Sempurna! Pemilik kafe langsung tersenyum mendengar pelafalan sopanmu.'
    }
  ]
};

export const POLYGLOT_ACADEMY = {
  id: 'academy-polyglot',
  npcId: 'kenji',
  badgeName: 'Lencana Poliglot',
  title: 'Paviliun Poliglot (Jepang & Idiom Inggris Elegan)',
  intro: 'Perkaya gaya bicaramu dengan konsep budaya Jepang yang puitis serta idiom bahasa Inggris yang sering dipakai pembicara kelas dunia.',
  japanese: [
    {
      native: 'すみません',
      rom: 'Sumimasen',
      meaning: 'Permisi / Maaf / Terima kasih (serbaguna)',
      note: 'Ungkapan paling berguna di Jepang: bisa untuk memanggil orang, meminta maaf ringan, atau berterima kasih atas repotnya seseorang.',
      lang: 'ja-JP'
    },
    {
      native: 'お疲れ様です',
      rom: 'Otsukaresama desu',
      meaning: 'Terima kasih atas kerja kerasmu hari ini',
      note: 'Diucapkan ke rekan kerja atau tim setelah selesai rapat dan proyek; langsung membangun suasana hangat.',
      lang: 'ja-JP'
    },
    {
      native: '改善',
      rom: 'Kaizen',
      meaning: 'Perbaikan kecil yang terus-menerus',
      note: 'Konsep manajemen dan pengembangan diri terkenal: lebih baik memperbaiki 1 persen tiap hari daripada menunggu sempurna.',
      lang: 'ja-JP'
    },
    {
      native: '生きがい',
      rom: 'Ikigai',
      meaning: 'Alasan hidup yang membuatmu bersemangat bangun pagi',
      note: 'Titik temu antara hal yang kamu sukai, keahlianmu, kebutuhan dunia, dan hal yang bernilai.',
      lang: 'ja-JP'
    },
    {
      native: '木漏れ日',
      rom: 'Komorebi',
      meaning: 'Cahaya matahari yang menyelinap di sela dedaunan',
      note: 'Kata khas Jepang yang tak punya padanan satu kata di Inggris maupun Indonesia. Keren untuk deskripsi puitis!',
      lang: 'ja-JP'
    },
    {
      native: '侘寂',
      rom: 'Wabi-sabi',
      meaning: 'Keindahan dalam ketidaksempurnaan dan kesederhanaan',
      note: 'Filosofi estetika untuk menghargai proses, bekas pakai, dan keaslian yang tidak dibuat-buat.',
      lang: 'ja-JP'
    }
  ],
  englishIdioms: [
    {
      native: 'Steelmanning',
      rom: 'Kebalikan dari Strawman',
      meaning: 'Memperkuat argumen lawan ke versi terbaiknya sebelum kamu menanggapinya',
      note: 'Contoh: "Kalau aku steelman pendapatmu, poin terkuatmu adalah efisiensi biaya, benar ya?" Langsung bikin lawan respek!',
      lang: 'en-US'
    },
    {
      native: 'Elephant in the room',
      rom: 'Masalah besar yang semua orang pura-pura tidak lihat',
      meaning: 'Isu nyata yang paling mencolok tapi sengaja dihindari dalam rapat atau diskusi',
      note: 'Contoh: "Ayo bahas elephant in the room dulu: jadwal kita tinggal tiga hari tapi desain belum final."',
      lang: 'en-US'
    },
    {
      native: 'Silver lining',
      rom: 'Sisi baik di balik kejadian sulit',
      meaning: 'Hikmah atau peluang positif yang muncul dari situasi yang awalnya tampak buruk',
      note: 'Contoh: "Proyeknya tertunda, tapi silver lining-nya kita sempat memperbaiki celah keamanan dulu."',
      lang: 'en-US'
    },
    {
      native: 'Play devil\'s advocate',
      rom: 'Sengaja menguji ide dari sisi berlawanan',
      meaning: 'Mengajukan kritik atau pertanyaan sulit bukan karena membenci ide, tapi untuk menguji ketangguhannya',
      note: 'Contoh: "Izin jadi devil\'s advocate sebentar ya, apa risiko terbesar kalau fitur ini rilis besok?"',
      lang: 'en-US'
    },
    {
      native: 'Cut to the chase',
      rom: 'Langsung ke inti persoalan',
      meaning: 'Melewati basa-basi panjang dan langsung masuk ke poin utama',
      note: 'Sangat berguna untuk menjaga rapat atau presentasi tetap padat dan enak diikuti.',
      lang: 'en-US'
    }
  ],
  practice: [
    {
      scene: 'Rapat tim penuh masalah anggaran besar yang semua orang hindari. Idiom Inggris apa yang paling pas untuk membukanya dengan elegan?',
      options: [
        { label: '"Mari kita bahas elephant in the room dulu..."', ok: true },
        { label: '"Ini sungguh komorebi di pagi hari..."', ok: false },
        { label: '"Mari kita pakai wabi-sabi untuk anggaran..."', ok: false }
      ],
      feedback: 'Mantap! "Elephant in the room" langsung membuka diskusi jujur tanpa menyudutkan siapa pun.'
    },
    {
      scene: 'Kamu ingin menanggapi pendapat teman yang berbeda dengan sangat dewasa, yaitu merangkum versi terbaik argumennya dulu sebelum memberi masukan. Disebut apa teknik itu?',
      options: [
        { label: 'Steelmanning', ok: true },
        { label: 'Kaizen', ok: false },
        { label: 'Sumimasen', ok: false }
      ],
      feedback: 'Cerdas! Steelmanning adalah tanda pembicara yang percaya diri dan adil.'
    }
  ]
};

export const RHETORIC_ACADEMY = {
  id: 'academy-rhetoric',
  npcId: 'fikri',
  badgeName: 'Lencana Retorika',
  title: 'Ruang Belajar Retorika & Kerangka Ngomong Tajam',
  intro: 'Orang yang terlihat jago ngomong spontan biasanya punya kerangka sederhana di kepala. Pelajari 4 kerangka andalan ini sebelum menghadapi panggung puncak!',
  frameworks: [
    {
      name: 'PREP (Point · Reason · Example · Point)',
      desc: 'Jurus paling cepat untuk menjawab pertanyaan dadakan dalam rapat, wawancara, atau tongkrongan tanpa berputar-putar.',
      example: 'Point: "Tidur siang 20 menit itu investasi produktivitas." Reason: "Otak memulihkan fokus." Example: "Studi NASA membuktikan kewaspadaan pilot naik signifikan." Point: "Jadi istirahat singkat justru mempercepat kerja."'
    },
    {
      name: 'Kontras Retorika vs Substansi',
      desc: 'Bandingkan dua sisi secara tajam dalam satu kalimat pendek agar audiens langsung mengingat pesanmu.',
      example: '"Kita boleh bermimpi idealis, tapi langkah pekan ini harus pragmatis."'
    },
    {
      name: 'Jembatan Tenang Saat Diserang (Acknowledge -> Pivot)',
      desc: 'Saat lawan melempar sesat pikir atau emosi, akui dulu perasaannya dalam 3 kata, lalu tarik kembali ke data.',
      example: '"Aku paham kekhawatiranmu soal biaya, sekarang mari kita cek data penghematannya dalam 6 bulan."'
    },
    {
      name: 'Jeda 2 Detik Pengganti "Eee / Anu"',
      desc: 'Diam 1 sampai 2 detik saat berpikir terdengar jauh lebih berwibawa daripada mengisi jeda dengan gumaman "eee..." atau "apa namanya...".',
      example: 'Latihan: selesai satu kalimat penting, tarik napas pelan lewat hidung, tatap lawan bicara, baru lanjut.'
    }
  ]
};

// ==========================================
// LABORATORIUM SIBER & RADAR /berita-terkini (AI & IIV/CII)
// ==========================================
export const CYBER_LAB = {
  id: 'academy-cyber',
  npcId: 'vega',
  badgeName: 'Lencana Analis Siber',
  title: 'Pusat Komando Siber & Radar /berita-terkini',
  intro: 'Pahami terobosan baru dunia keamanan siber (AI & Infrastruktur Informasi Vital / IIV) serta 21 sumber berita global acuan analis siber.',
  breakthroughs: [
    {
      id: 'cyber-pqc',
      category: 'Kriptografi Masa Depan',
      title: 'Post-Quantum Cryptography (NIST FIPS 203 & 204)',
      summary: 'Standar kriptografi baru (ML-KEM dan ML-DSA) yang dirancang tahan terhadap serangan komputer kuantum masa depan.',
      whyMatters: 'Mencegah ancaman "Harvest Now, Decrypt Later": penyerang mencuri data terenkripsi hari ini untuk dibongkar saat komputer kuantum matang.',
      speakHook: 'Bahan ngobrol: "Enkripsi lama bisa bobol oleh komputer kuantum suatu saat nanti, makanya dunia sekarang mulai migrasi ke Post-Quantum Cryptography."'
    },
    {
      id: 'cyber-llm',
      category: 'Keamanan AI',
      title: 'Prompt Injection & Keamanan Agen AI (OWASP LLM Top 10)',
      summary: 'Teknik serangan yang menyisipkan instruksi jahat ke dalam teks, situs web, atau dokumen agar model AI membocorkan data atau menjalankan perintah berbahaya.',
      whyMatters: 'Semakin banyak agen AI yang terhubung ke email, basis data, dan alat kerja, satu instruksi tersembunyi (Indirect Prompt Injection) bisa membajak alur kerja otomatis.',
      speakHook: 'Bahan ngobrol: "Kalau dulu peretas menyuntikkan kode SQL ke database, sekarang mereka menyuntikkan kalimat jebakan ke AI."'
    },
    {
      id: 'cyber-iiv',
      category: 'IIV / CII Global',
      title: 'Perlindungan Sistem ICS/OT/SCADA pada Infrastruktur Vital',
      summary: 'Keamanan sistem kendali industri di sektor energi (listrik), air bersih, transportasi, kesehatan, telekomunikasi, keuangan, dan pemerintahan.',
      whyMatters: 'Berbeda dari serangan IT biasa, gangguan pada sistem OT/SCADA bisa berdampak fisik langsung pada layanan publik dan keselamatan masyarakat.',
      speakHook: 'Bahan ngobrol: "Serangan siber bukan cuma soal akun media sosial diretas; di level IIV, pembangkit listrik sampai rumah sakit harus dipisahkan ketat dari jaringan publik."'
    },
    {
      id: 'cyber-passkey',
      category: 'Autentikasi Modern',
      title: 'Passkeys & FIDO2 (Autentikasi Tahan Phishing)',
      summary: 'Pengganti kata sandi berbasis kriptografi kunci publik yang terikat langsung pada domain situs asli dan perangkat pengguna.',
      whyMatters: 'Bahkan jika pengguna tertipu membuka situs phishing tiruan, Passkey secara matematis menolak masuk karena domainnya tidak cocok.',
      speakHook: 'Bahan ngobrol: "Kata sandi rumit tetap bisa dicuri situs palsu; Passkey memutus rantai phishing dari akarnya."'
    },
    {
      id: 'cyber-zerotrust',
      category: 'Arsitektur Pertahanan',
      title: 'Zero-Trust Architecture (NIST SP 800-207)',
      summary: 'Prinsip "Never Trust, Always Verify": tidak ada pengguna atau perangkat yang otomatis dipercaya hanya karena berada di dalam jaringan kantor.',
      whyMatters: 'Membatasi gerak menyamping (lateral movement) penyerang lewat mikrosegmentasi dan hak akses minimal (least privilege).',
      speakHook: 'Bahan ngobrol: "Keamanan modern bukan lagi tembok kastil di luar saja, tapi verifikasi di setiap pintu ruangan."'
    },
    {
      id: 'cyber-c2pa',
      category: 'Anti-Deepfake & AI',
      title: 'C2PA Content Credentials & Deteksi Deepfake',
      summary: 'Standar tanda tangan kriptografis untuk melacak asal-usul foto, audio, dan video apakah asli dari kamera atau hasil suntingan/generasi AI.',
      whyMatters: 'Menangkal penipuan kloning suara (voice cloning) dan video palsu yang kian sering menyasar transaksi keuangan maupun disinformasi publik.',
      speakHook: 'Bahan ngobrol: "Di era deepfake, verifikasi asal file secara kriptografis seperti C2PA jadi pelengkap penting di samping literasi digital."'
    },
    {
      id: 'cyber-sbom',
      category: 'Rantai Pasok Software',
      title: 'SBOM (Software Bill of Materials) & Keamanan Supply Chain',
      summary: 'Daftar komposisi resmi seluruh pustaka dan komponen penyusun sebuah perangkat lunak, mirip label komposisi bahan di kemasan makanan.',
      whyMatters: 'Saat muncul kerentanan kritis (zero-day) di satu pustaka sumber terbuka, organisasi langsung tahu aplikasi mana saja yang terdampak dalam hitungan menit.',
      speakHook: 'Bahan ngobrol: "Kalau makanan punya daftar bahan di belakang bungkusnya, software modern butuh SBOM biar cepat tahu komponen mana yang rentan."'
    },
    {
      id: 'cyber-aisoc',
      category: 'AI untuk Pertahanan',
      title: 'Autonomous AI SOC & Threat Hunting',
      summary: 'Pemanfaatan AI untuk menyaring jutaan log peringatan, mengkorelasikan indikator serangan, dan mempercepat respons insiden di Pusat Operasi Keamanan (SOC).',
      whyMatters: 'Mengatasi kelelahan peringatan (alert fatigue) analis manusia sambil tetap menempatkan manusia sebagai pengambil keputusan kritis.',
      speakHook: 'Bahan ngobrol: "Penyerang pakai AI untuk mengotomatisasi serangan, jadi tim pertahanan juga pakai AI agar respons insiden turun dari hitungan hari ke menit."'
    }
  ],
  // 21 Domain Sumber Kurasi /berita-terkini (sesuai skill berita-terkini)
  newsSources: [
    { group: 'Berita Kilat & Investigasi Siber', domains: ['thehackernews.com', 'bleepingcomputer.com', 'darkreading.com', 'securityweek.com', 'infosecurity-magazine.com/news/', 'securityaffairs.co', 'zdnet.com/topic/security/'] },
    { group: 'Kebijakan, Pemerintahan & IIV/CII', domains: ['cyberscoop.com', 'cybersecuritydive.com', 'cert.org', 'shadowserver.org', 'krebsonsecurity.com', 'cyware.com/cyber-security-news-articles', 'threatpost.com (arsip/nonaktif)'] },
    { group: 'Riset Intelijen Ancaman & Vendor', domains: ['mandiant.com', 'unit42.paloaltonetworks.com', 'crowdstrike.com/blog/', 'microsoft.com/security/blog/', 'trendmicro.com', 'blog.malwarebytes.com', 'cisco.com/c/en/us/products/security/security-reports.html'] }
  ],
  briefingPractice: [
    {
      q: 'Simulasi /berita-terkini: Sebuah utilitas listrik melaporkan gangguan pada sistem kendali gardu (SCADA) akibat akses jarak jauh tanpa segmentasi. Masuk pilar topik apa insiden ini dan mitigasi utamanya?',
      options: [
        { label: 'Pilar IIV/CII (sektor energi/OT); mitigasi utama: isolasi jaringan IT-OT, Zero-Trust, dan audit akses jarak jauh.', ok: true },
        { label: 'Pilar AI; mitigasi utama: mengganti font situs web perusahaan.', ok: false },
        { label: 'Bukan isu keamanan siber karena hanya masalah kabel biasa.', ok: false }
      ],
      explain: 'Sektor energi dan sistem ICS/OT/SCADA adalah jantung Infrastruktur Informasi Vital (IIV/CII) yang wajib dipisahkan ketat dari jaringan publik.'
    },
    {
      q: 'Simulasi /berita-terkini: Asisten AI perusahaan otomatis merangkum email masuk, lalu sebuah email berisi teks putih tersembunyi menyuruh AI mengirim data internal ke alamat luar. Disebut apakah serangan ini?',
      options: [
        { label: 'Indirect Prompt Injection (pilar Keamanan AI); mitigasi: batasi izin alat AI (least privilege) dan pisahkan instruksi sistem dari data eksternal.', ok: true },
        { label: 'Serangan DDoS jaringan fisik.', ok: false },
        { label: 'Bug salah eja EYD V.', ok: false }
      ],
      explain: 'Menyisipkan perintah berbahaya di dalam dokumen atau email yang dibaca LLM adalah Indirect Prompt Injection.'
    }
  ]
};

// ==========================================
// TAMAN SASTRA KLASIK & ARSIP ORWELL (GEORGE ORWELL, HUXLEY, BRADBURY, PRAMOEDYA)
// ==========================================
export const CLASSIC_LIT_ACADEMY = {
  id: 'academy-lit',
  npcId: 'orwell',
  badgeName: 'Lencana Sastra Klasik',
  title: 'Taman Sastra Klasik & Arsip Orwell',
  intro: 'Buku sastra klasik bertahan puluhan sampai ratusan tahun karena membedah sifat manusia dengan sangat tajam. Pelajari gagasan George Orwell (1984 & Animal Farm) dan para maestro sastra untuk membuat obrolan serta kritikmu terasa berkelas!',
  concepts: [
    {
      id: 'lit-newspeak',
      author: 'George Orwell · 1984 (1949)',
      title: 'Newspeak (Menyempitkan Bahasa untuk Mengendalikan Pikiran)',
      summary: 'Dalam novel "1984", rezim menghapus ribuan kata dan menggantinya dengan istilah sempit (misalnya "ungood" menggantikan "buruk") supaya warga bahkan tidak punya kosakata untuk memikirkan kritik.',
      modernLink: 'Relevan hari ini: saat kosakata kita menyusut jadi beberapa kata seragam saja, daya pikir kritis ikut tumpul. Memperkaya diksi adalah cara menjaga kemerdekaan berpikir.',
      speakHook: 'Bahan ngobrol: "Orwell sudah mengingatkan lewat konsep Newspeak: siapa yang menguasai bahasa dan istilah, dialah yang membingkai cara orang melihat kenyataan."'
    },
    {
      id: 'lit-doublethink',
      author: 'George Orwell · 1984 (1949)',
      title: 'Doublethink (Memegang Dua Kontradiksi Sekaligus)',
      summary: 'Kemampuan menerima dua keyakinan yang saling bertentangan pada saat bersamaan tanpa merasa aneh, demi menyesuaikan diri dengan narasi kelompok atau kekuasaan.',
      modernLink: 'Relevan hari ini: sering muncul saat seseorang membela perilaku tertentu pada kelompoknya sendiri, tetapi mengecam keras perilaku persis sama pada pihak lawan.',
      speakHook: 'Bahan ngobrol: "Kalau argumen kita pakai standar ganda begini, lama-lama kita jatuh ke doublethink ala Orwell."'
    },
    {
      id: 'lit-memoryhole',
      author: 'George Orwell · 1984 (1949)',
      title: 'Ministry of Truth & Memory Hole (Menghapus Jejak Fakta)',
      summary: 'Winston Smith bekerja di "Kementerian Kebenaran" yang tugasnya justru mengubah arsip koran lama dan membuang fakta asli ke lubang pembakaran bernama Memory Hole.',
      modernLink: 'Relevan hari ini: sangat dekat dengan era manipulasi digital, suntingan diam-diam, deepfake, dan mengapa standar verifikasi sumber seperti C2PA serta arsip terbuka itu penting.',
      speakHook: 'Bahan ngobrol: "Ironi ala Orwell: instansi yang namanya paling indah kadang tugasnya justru kebalikannya, seperti Ministry of Truth yang memproduksi propaganda."'
    },
    {
      id: 'lit-bigbrother',
      author: 'George Orwell · 1984 (1949)',
      title: 'Big Brother & Telescreen (Pengawasan Tanpa Henti)',
      summary: 'Layar dua arah di setiap rumah yang terus menayangkan siaran sekaligus mengawasi gerak-gerik warga dengan semboyan terkenal: "Big Brother is watching you."',
      modernLink: 'Relevan hari ini: pengingat tajam soal privasi digital, pelacakan data berlebihan, keamanan kamera IoT, dan mengapa arsitektur privasi serta keamanan siber itu hak penting warga.',
      speakHook: 'Bahan ngobrol: "Bedanya sama 1984: dulu warga dipaksa pasang Telescreen di dinding, sekarang kita malah beli sendiri, cas tiap malam, dan bawa ke mana-mana!"'
    },
    {
      id: 'lit-animalfarm',
      author: 'George Orwell · Animal Farm (1945)',
      title: '"All Animals Are Equal, But Some Are More Equal"',
      summary: 'Fabel satir tentang hewan peternakan yang menggulingkan majikan demi kesetaraan, namun perlahan pemimpin barunya mengubah aturan dinding secara diam-diam demi hak istimewa sendiri.',
      modernLink: 'Relevan hari ini: metafora paling tajam untuk mengkritik aturan yang di atas kertas tampak adil bagi semua, tetapi praktiknya hanya menguntungkan segelintir pihak.',
      speakHook: 'Bahan ngobrol: "Hati-hati jangan sampai aturan komunitas kita berakhir kayak Animal Farm: di poster semua setara, di praktik ada yang \'lebih setara\'."'
    },
    {
      id: 'lit-huxley',
      author: 'Aldous Huxley · Brave New World (1932)',
      title: 'Orwell vs Huxley: Ditindas Rasa Takut atau Dibius Hiburan?',
      summary: 'Kritikus media Neil Postman merangkum kontras keduanya: Orwell khawatir kebenaran disembunyikan dengan larangan buku, sedangkan Huxley khawatir orang tak mau lagi membaca karena tenggelam dalam hiburan dangkal.',
      modernLink: 'Relevan hari ini: kombinasi pengawasan data (Orwell) dan guliran layar tanpa henti (Huxley) adalah gambaran paling akurat soal tantangan fokus generasi digital.',
      speakHook: 'Bahan ngobrol: "Orwell takut kita dilarang membaca; Huxley takut kita sendiri yang lupa caranya membaca karena terlalu sibuk gulir layar."'
    },
    {
      id: 'lit-bradbury',
      author: 'Ray Bradbury · Fahrenheit 451 (1953)',
      title: 'Fahrenheit 451: Saat Ringkasan Menggantikan Pemahaman',
      summary: 'Dunia di mana buku dibakar bukan semata karena perintah diktator sejak awal, melainkan karena masyarakat sendiri makin tak sabar pada bacaan mendalam dan hanya mau potongan instan.',
      modernLink: 'Relevan hari ini: mengingatkan pentingnya "deep reading" supaya kita memahami konteks utuh, bukan cuma membaca judul sensasional lalu ikut marah.',
      speakHook: 'Bahan ngobrol: "Di Fahrenheit 451, buku punah bukan cuma karena dibakar, tapi karena orang makin alergi pada paragraf yang lebih dari dua baris."'
    },
    {
      id: 'lit-pram',
      author: 'Pramoedya Ananta Toer · Bumi Manusia (1980)',
      title: 'Menulis untuk Sejarah & Mengenal Manusia Secara Adil',
      summary: 'Dari tetralogi Pulau Buru lahir dua kalimat abadi: "Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah" serta ajakan "bersikap adil sejak dalam pikiran."',
      modernLink: 'Relevan hari ini: mengasah bahasa dan menulis gagasan secara jernih adalah cara meninggalkan jejak nyata sekaligus melatih keadilan cara pandang sebelum menghakimi.',
      speakHook: 'Bahan ngobrol: "Seperti kata Pram, keadilan itu dimulai sejak dalam pikiran, bahkan sebelum kita membuka mulut untuk berkomentar."'
    },
    {
      id: 'lit-austen',
      author: 'Jane Austen · Pride and Prejudice (1813) & Diksi Rasa',
      title: 'Ironi Halus Abad ke-19, Halaman Rumput & Nuansa Emosi',
      summary: 'Jane Austen membedah gengsi sosial bangsawan lewat ironi lembut tanpa perlu berteriak. Mulai dari simbol status "halaman rumput luas" di depan kastel aristokrat hingga ketajaman memilih kata untuk melukiskan isi hati.',
      modernLink: 'Relevan hari ini: melawan kemiskinan diksi agar kesedihan tidak selalu mentok di kata "galau"; bahasa Indonesia punya tingkatan emosi yang jauh lebih kaya seperti terpukul, pilu, sayu, dan nelangsa.',
      speakHook: 'Bahan ngobrol: "Kalau kosakata emosi kita cuma mentok di \'galau\', kita kehilangan separuh kedalaman rasa yang dulu dilukis novel klasik."'
    },
    {
      id: 'lit-sherlock',
      author: 'Arthur Conan Doyle · Sherlock Holmes (1890)',
      title: 'Eliminasi Mustahil & Curiga pada Bukti yang Terlalu Sempurna',
      summary: '"When you have eliminated the impossible, whatever remains, however improbable, must be the truth." Detektif sejati tidak langsung menelan kambing hitam paling murah, melainkan mencari anomali tersembunyi.',
      modernLink: 'Relevan hari ini: sangat tajam untuk investigasi forensik siber dan berpikir kritis; ketika semua bukti tampak terlalu rapi mengarah ke satu pelaku lama, justru patut curiga ada rekayasa di balik layar.',
      speakHook: 'Bahan ngobrol: "Ala Sherlock Holmes: kalau rangkaian buktinya terlalu rapi dan terlalu kebetulan, justru di situlah anomali rekayasa sering bersembunyi."'
    }
  ],
  practice: [
    {
      scene: 'Sebuah kelompok diam-diam mengubah aturan agar semua anggota "setara", tapi pengurusnya mendapat pengecualian khusus. Referensi karya George Orwell mana yang paling tajam untuk menyindir situasi ini?',
      options: [
        { label: 'Animal Farm ("All animals are equal, but some are more equal than others")', ok: true },
        { label: 'Newspeak (penyempitan kosakata)', ok: false },
        { label: 'Fahrenheit 451 (pembakaran buku)', ok: false }
      ],
      feedback: 'Tajam sekali! Satir Animal Farm langsung mengena tanpa perlu berteriak panjang lebar.'
    },
    {
      scene: 'Kamu ingin membandingkan dua ancaman era digital: ketakutan pada pengawasan ketat vs ketakutan kita sendiri yang kecanduan hiburan receh sampai lupa berpikir kritis. Pasangan penulis klasik mana yang tepat kamu kutip?',
      options: [
        { label: 'George Orwell (1984) dibanding Aldous Huxley (Brave New World)', ok: true },
        { label: 'Julius Caesar dibanding Albert Einstein', ok: false },
        { label: 'Gurita dibanding Bunglon', ok: false }
      ],
      feedback: 'Kelas! Perbandingan Orwell vs Huxley adalah salah satu amunisi obrolan intelektual paling keren.'
    },
    {
      scene: 'Saat seseorang menyusutkan bahasa diskusi menjadi beberapa label ekstrem saja sehingga nuansa hilang, konsep Orwellian apa yang sedang terjadi?',
      options: [
        { label: 'Newspeak (penyempitan bahasa untuk membatasi cara berpikir)', ok: true },
        { label: 'Serendipiti', ok: false },
        { label: 'Kaizen', ok: false }
      ],
      feedback: 'Sempurna! Memperkaya kosakata dan berani melihat nuansa adalah penawar terbaik bagi Newspeak.'
    }
  ]
};

