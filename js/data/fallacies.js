// Bank konten Babak 3: Duel Sesat Pikir & Comeback Warkop
// Melatih ketajaman logika, deteksi logical fallacy, dan cara membalas obrolan yang elegan tanpa memancing ribut.

export const FALLACIES_BANK = [
  {
    id: 'fall-01',
    speaker: 'budi',
    fallacyName: 'Ad Hominem',
    attack: '"Ah, kamu kan belum nikah dan masih muda, nggak usah ikut kasih saran soal cara mengatur keuangan rumah tangga!"',
    options: [
      {
        text: '"Itu namanya ad hominem, Pak. Argumen diuji dari hitung-hitungannya, bukan dari status KTP yang bicara."',
        correct: true,
        reaction: 'KELASSS! Seisi warkop tepuk tangan, Pak Budi langsung menyeruput kopi pelan-pelan.'
      },
      {
        text: '"Bapak juga dulu muda kok, berarti dulu Bapak nggak boleh ngomong dong!"',
        correct: false,
        reaction: 'Malah jadi perang usia, bukan membedah inti hitung-hitungannya.'
      },
      {
        text: '"Ya sudah Pak, saya diam saja sampai punya KTP status kawin."',
        correct: false,
        reaction: 'Kok langsung mundur? Padahal hitung-hitunganmu sudah benar lho!'
      }
    ],
    meaning: 'Ad Hominem: menyerang pribadi, usia, latar belakang, atau karakter pembicara alih-alih menanggapi argumennya.',
    pitfall: 'Paling sering muncul di kolom komentar maupun rapat saat lawan debat kehabisan data.',
    usage: 'Jurusan balasan tenang: "Kita fokus ke datanya dulu yuk, terlepas dari siapa yang menyampaikan."'
  },
  {
    id: 'fall-02',
    speaker: 'fikri',
    fallacyName: 'Strawman (Orang-Orangan Sawah)',
    attack: 'Kamu bilang: "Menurutku jam kerja lembur sebaiknya dibatasi biar tim tetap sehat." Mas Fikri langsung nyeletuk: "Oh, jadi menurutmu kita semua harus malas-malasan dan nggak usah kerja keras ya?"',
    options: [
      {
        text: '"Eits, itu strawman, Mas. Membatasi lembur biar produktif bukan berarti menyuruh orang malas."',
        correct: true,
        reaction: 'Tepat di ulu hati logika! Mas Fikri sampai salah pegang sedotan es teh.'
      },
      {
        text: '"Iya deh, mending kita nggak usah kerja sekalian saja."',
        correct: false,
        reaction: 'Jangan terpancing masuk perangkap! Kamu malah membenarkan versi melintirnya.'
      },
      {
        text: '"Mas Fikri kayaknya kurang tidur nih."',
        correct: false,
        reaction: 'Hati-hati, itu malah balik jadi ad hominem!'
      }
    ],
    meaning: 'Strawman: memelintir atau melebih-lebihkan pernyataan lawan menjadi versi ekstrem supaya mudah diserang.',
    pitfall: 'Kalau tidak segera diluruskan, kamu bakal sibuk membela pendapat yang sebenarnya tidak pernah kamu ucapkan.',
    usage: 'Jurus balasan tenang: "Bukan itu yang saya katakan. Poin saya sebenarnya adalah..."'
  },
  {
    id: 'fall-03',
    speaker: 'budi',
    fallacyName: 'Whataboutism',
    attack: 'Kamu mengingatkan: "Pak, selokan depan warung mampet gara-gara plastik dibuang sembarangan." Pak Budi menjawab: "Lha, pabrik besar di kota sana polusinya jauh lebih parah, kenapa nggak protes ke sana dulu?"',
    options: [
      {
        text: '"Itu whataboutism, Pak. Polusi pabrik memang salah, tapi bukan berarti plastik di selokan sini jadi boleh dibiarkan."',
        correct: true,
        reaction: 'Sapu bersih! Dua-duanya didudukkan pada tempatnya tanpa bikin suasana panas.'
      },
      {
        text: '"Oh iya juga ya, ayo kita demo ke pabrik dulu, selokannya nanti saja."',
        correct: false,
        reaction: 'Selokannya keburu banjir nih!'
      },
      {
        text: '"Bapak jangan mengalihkan pembicaraan terus dari kemarin!"',
        correct: false,
        reaction: 'Emosinya dapat, tapi penjelasan logikanya belum keluar.'
      }
    ],
    meaning: 'Whataboutism: menangkis kritik dengan menunjuk kesalahan pihak lain tanpa menjawab pokok masalah yang sedang dibahas.',
    pitfall: 'Dua kesalahan tidak pernah saling menghapus. Masalah besar di tempat lain bukan alasan mengabaikan masalah di depan mata.',
    usage: 'Jurus balasan tenang: "Itu juga masalah penting, tapi kita selesaikan satu per satu mulai dari yang di depan mata dulu."'
  },
  {
    id: 'fall-04',
    speaker: 'fikri',
    fallacyName: 'Slippery Slope (Lereng Licin)',
    attack: '"Kalau hari ini kita izinkan anak-anak main game satu jam setelah PR selesai, besok mereka pasti kecanduan, minggu depan bolos sekolah, dan masa depannya hancur!"',
    options: [
      {
        text: '"Pelan-pelan, Mas, itu slippery slope. Dari main satu jam ke masa depan hancur butuh banyak lompatan tanpa bukti."',
        correct: true,
        reaction: 'Rem darurat berhasil! Penonton warkop ngakak sambil bilang: "Jauh amat loncatnya, Mas!"'
      },
      {
        text: '"Benar juga, langsung buang semua gawai ke laut saja."',
        correct: false,
        reaction: 'Lah, malah ikut-ikutan skenario kiamat!'
      },
      {
        text: '"Main game 12 jam sehari malah bikin jenius kok."',
        correct: false,
        reaction: 'Terlalu ekstrem ke arah sebaliknya!'
      }
    ],
    meaning: 'Slippery Slope: mengklaim satu langkah kecil pasti memicu rentetan bencana ekstrem tanpa menjelaskan bukti hubungan sebab-akibatnya.',
    pitfall: 'Sering terdengar dramatis dan menakutkan, padahal rantai akibatnya cuma asumsi.',
    usage: 'Jurus balasan tenang: "Kita bisa pasang batas yang jelas, nggak otomatis berujung skenario terburuk."'
  },
  {
    id: 'fall-05',
    speaker: 'siska',
    fallacyName: 'Bandwagon (Ikut-Ikutan Mayoritas)',
    attack: '"Pokoknya strategi investasi koin ini pasti benar! Lihat dong, jutaan orang di media sosial lagi beli semua!"',
    options: [
      {
        text: '"Hati-hati jebakan bandwagon, Mbak. Populer dan ramai dibeli belum tentu aman atau benar secara hitungan."',
        correct: true,
        reaction: 'Dompet seisi warkop terselamatkan! Mbak Siska langsung cek ulang grafiknya.'
      },
      {
        text: '"Kalau jutaan orang beli, aku langsung jual motor buat ikut beli juga!"',
        correct: false,
        reaction: 'Aduh, nanti Bang Jaja kasih utang kopi buat bertahan hidup!'
      },
      {
        text: '"Pokoknya apa pun yang populer itu pasti selalu salah."',
        correct: false,
        reaction: 'Kebalikannya juga keliru; yang benar adalah periksa buktinya, bukan sekadar ikut atau anti keramaian.'
      }
    ],
    meaning: 'Bandwagon (Argumentum ad Populum): menganggap sesuatu pasti benar atau bagus semata-mata karena banyak orang melakukannya.',
    pitfall: 'Sejarah penuh contoh ide populer yang belakangan terbukti keliru (termasuk gelembung finansial dan hoaks viral).',
    usage: 'Jurus balasan tenang: "Ramai itu sinyal untuk meneliti lebih cermat, bukan jaminan kebenaran."'
  },
  {
    id: 'fall-06',
    speaker: 'fikri',
    fallacyName: 'False Dilemma (Dilema Palsu)',
    attack: '"Hidup itu cuma ada dua pilihan: kamu kerja sampai lupa waktu demi sukses, atau kamu santai dan siap hidup melarat selamanya!"',
    options: [
      {
        text: '"Itu false dilemma, Mas. Masih ada jalan tengah: kerja fokus dan terukur, istirahat juga dijaga."',
        correct: true,
        reaction: 'Adem dan tajam! Mas Fikri baru sadar hidup nggak cuma dua tombol.'
      },
      {
        text: '"Kalau cuma dua itu, saya pilih melarat yang penting tidur siang."',
        correct: false,
        reaction: 'Lucu sih, tapi kamu masuk ke bingkai sempit yang cuma dua pilihan itu.'
      },
      {
        text: '"Iya benar, tidur itu musuh kesuksesan!"',
        correct: false,
        reaction: 'Kurang tidur justru menurunkan daya ingat dan keputusan lho!'
      }
    ],
    meaning: 'False Dilemma: memaksa lawan bicara memilih di antara dua kutub ekstrem seolah tidak ada opsi ketiga atau jalan tengah.',
    pitfall: 'Banyak kalimat persuasif dan iklan memakai jebakan ini untuk memburu-buru keputusanmu.',
    usage: 'Jurus balasan tenang: "Kenapa opsinya cuma dua? Bagaimana kalau kita gabungkan keunggulan keduanya?"'
  },
  {
    id: 'fall-07',
    speaker: 'deden',
    fallacyName: 'Post Hoc (Kebetulan Dikira Sebab)',
    attack: '"Setiap kali aku pakai kaus kaki bolong warna kuning pas nonton bola, tim favoritku selalu menang. Jadi kaus kaki ini pembawa hoki beneran!"',
    options: [
      {
        text: '"Itu post hoc, Kang. Dua kejadian yang kebetulan berurutan bukan berarti saling menyebabkan."',
        correct: true,
        reaction: 'Gacor! Kang Deden akhirnya rela mencuci kaus kaki kuningnya.'
      },
      {
        text: '"Tolong pinjamkan kaus kakinya buat ujian besok, Kang!"',
        correct: false,
        reaction: 'Aduh, nanti satu ruangan pingsan duluan sebelum soal dibagikan!'
      },
      {
        text: '"Berarti kalau pakai kaus kaki baru timnya pasti kalah telak."',
        correct: false,
        reaction: 'Itu malah meneruskan logika kebetulan yang sama!'
      }
    ],
    meaning: 'Post Hoc Ergo Propter Hoc ("setelah ini, maka karena ini"): menyimpulkan A menyebabkan B hanya karena A terjadi lebih dulu daripada B.',
    pitfall: 'Korelasi atau urutan waktu tidak otomatis membuktikan hubungan sebab-akibat.',
    usage: 'Jurus balasan tenang: "Kebetulan berbarengan belum tentu sebab-akibat, kita perlu cek faktor lain."'
  },
  {
    id: 'fall-08',
    speaker: 'budi',
    fallacyName: 'Appeal to Authority (Salah Pakar)',
    attack: '"Suplemen ajaib ini dijamin menyembuhkan segala penyakit! Soalnya yang mempromosikan adalah aktor laga pemenang piala festival film!"',
    options: [
      {
        text: '"Itu sesat pikir otoritas keliru, Pak. Jago akting di film bukan berarti punya kompetensi uji klinis medis."',
        correct: true,
        reaction: 'Presisi! Pak Budi langsung mengecek nomor izin BPOM di kemasan.'
      },
      {
        text: '"Wah, kalau bintang film yang bilang pasti manjur, beli tiga dus Pak!"',
        correct: false,
        reaction: 'Jangan mudah terpesona poster selebritas, cek bukti klinisnya!'
      },
      {
        text: '"Semua dokter juga nggak perlu didengar, pokoknya ikut firasat saja."',
        correct: false,
        reaction: 'Lho, merujuk pakar di bidang yang tepat justru penting; yang keliru adalah memakai pakar beda bidang.'
      }
    ],
    meaning: 'False Appeal to Authority: mengutip tokoh terkenal atau ahli dari bidang lain sebagai bukti mutlak di bidang yang bukan keahliannya.',
    pitfall: 'Otoritas baru kuat bila sesuai bidang keahliannya dan didukung bukti yang bisa diuji ulang.',
    usage: 'Jurus balasan tenang: "Beliau memang hebat di bidang film, tapi untuk kesehatan lebih aman cek riset medisnya."'
  },
  {
    id: 'fall-09',
    speaker: 'fikri',
    fallacyName: 'Hasty Generalization (Pukul Rata)',
    attack: '"Kemarin aku ketemu dua pengendara dari kota X yang ngebut di gang. Fix, semua orang kota X pasti nggak tahu aturan jalan!"',
    options: [
      {
        text: '"Itu hasty generalization, Mas. Dua orang nggak cukup buat memukul rata jutaan penduduk satu kota."',
        correct: true,
        reaction: 'Jempolan! Satu warung langsung mengangguk setuju.'
      },
      {
        text: '"Betul, berarti kita harus tutup gerbang warkop untuk semua orang dari kota X!"',
        correct: false,
        reaction: 'Wah, Bang Jaja bisa rugi kehilangan separuh pelanggan nih!'
      },
      {
        text: '"Kalau ketemu tiga orang baru boleh pukul rata."',
        correct: false,
        reaction: 'Tiga orang tetap sampel mini dibandingkan jutaan orang!'
      }
    ],
    meaning: 'Hasty Generalization: menarik kesimpulan besar mengenai seluruh kelompok hanya dari segelintir contoh kecil.',
    pitfall: 'Akar dari banyak stereotip dan prasangka dalam obrolan sehari-hari.',
    usage: 'Jurus balasan tenang: "Pengalaman itu memang bikin kesal, tapi itu perilaku oknumnya, belum mewakili semuanya."'
  },
  {
    id: 'fall-10',
    speaker: 'siska',
    fallacyName: 'Sunk Cost Fallacy',
    attack: '"Aplikasi ini fiturnya memang bikin pengguna bingung dan rugi tiap bulan, tapi kita sudah telanjur habis banyak biaya bikinnya. Harus tetap dilanjutkan tanpa diubah!"',
    options: [
      {
        text: '"Hati-hati sunk cost fallacy, Mbak. Biaya masa lalu sudah lewat, keputusan hari ini harus dihitung dari manfaat ke depan."',
        correct: true,
        reaction: 'Mental CEO tajam! Mbak Siska langsung buka papan tulis buat evaluasi ulang.'
      },
      {
        text: '"Setuju, sekalian tambah anggaran dua kali lipat biar makin kerasa perjuangannya."',
        correct: false,
        reaction: 'Malah makin dalam jebakannya!'
      },
      {
        text: '"Jangan pernah investasi apa pun sejak awal biar nggak rugi."',
        correct: false,
        reaction: 'Bukan takut mencoba, melainkan berani mengevaluasi ulang saat data sudah jelas.'
      }
    ],
    meaning: 'Sunk Cost Fallacy: terus mempertahankan pilihan yang merugikan hanya karena sudah terlanjur mengeluarkan waktu, tenaga, atau uang sebelumnya.',
    pitfall: 'Sering terjadi pada proyek, hubungan, sampai nonton film membosankan cuma gara-gara sudah beli tiket.',
    usage: 'Jurus balasan tenang: "Yang sudah keluar biar jadi biaya belajar; pertanyaannya sekarang, ke depan masih layak dilanjutkan?"'
  },
  {
    id: 'fall-11',
    speaker: 'budi',
    fallacyName: 'Tu Quoque (Menunjuk Balik)',
    attack: 'Kamu menasihati: "Pak, merokok di dekat bayi berbahaya buat paru-parunya." Pak Budi menyahut: "Halah, kamu sendiri dulu waktu kuliah pernah begadang tiap malam, nggak usah ceramahi soal kesehatan!"',
    options: [
      {
        text: '"Itu tu quoque, Pak. Kebiasaan burukku dulu nggak membuat asap rokok tiba-tiba jadi aman buat bayi."',
        correct: true,
        reaction: 'Tepat dan kalem! Pak Budi langsung geser jauh dari dekat bayi.'
      },
      {
        text: '"Maaf Pak, karena dulu saya pernah begadang, silakan lanjut merokok di sini."',
        correct: false,
        reaction: 'Kasihan bayinya dong! Fakta medis tidak berubah gara-gara masa lalu orang lain.'
      },
      {
        text: '"Begadang itu keren, beda sama rokok!"',
        correct: false,
        reaction: 'Kurang tidur juga nggak sehat, dan malah keluar dari pokok masalah.'
      }
    ],
    meaning: 'Tu Quoque ("kamu juga"): menolak kebenaran saran atau fakta dengan menuduh si penyampai juga tidak sempurna.',
    pitfall: 'Saran tetap bisa benar secara faktual meskipun yang menyampaikan pernah membuat kesalahan di masa lalu.',
    usage: 'Jurus balasan tenang: "Benar, saya juga masih belajar hidup sehat, tapi fakta risikonya buat bayi tetap nyata."'
  },
  {
    id: 'fall-12',
    speaker: 'deden',
    fallacyName: 'Cherry Picking (Pilih Data Suka-Suka)',
    attack: '"Lihat nih! Bulan Juli kemarin cuma hujan dua kali, berarti isu perubahan iklim dan cuaca ekstrem itu bohong!"',
    options: [
      {
        text: '"Itu cherry picking, Kang. Mengambil satu bulan kering sambil mengabaikan data tren puluhan tahun bukan bukti ilmiah."',
        correct: true,
        reaction: 'Data jangka panjang menang telak! Kang Deden langsung garuk-garuk kepala.'
      },
      {
        text: '"Oh iya, cuaca hari ini cerah berarti seluruh planet lagi adem."',
        correct: false,
        reaction: 'Cuaca satu hari itu beda dengan iklim jangka panjang!'
      },
      {
        text: '"Bulan Juli memang nggak boleh dijadikan contoh apa pun."',
        correct: false,
        reaction: 'Bukan bulan Julinya yang salah, melainkan teknik memetik data sepihak.'
      }
    ],
    meaning: 'Cherry Picking: memilih hanya sebagian kecil data yang mendukung pendapat sendiri sambil menyembunyikan bukti besar yang bertentangan.',
    pitfall: 'Sering dipakai di grafik menyesatkan dan testimoni sepihak.',
    usage: 'Jurus balasan tenang: "Kita lihat gambar besarnya dan seluruh datanya dulu, jangan cuma satu potongan."'
  },
  {
    id: 'fall-13',
    speaker: 'fikri',
    fallacyName: 'Red Herring (Pengalihan Isu)',
    attack: 'Kamu bertanya: "Mas, kenapa laporan kas komunitas bulan ini selisih 500 ribu?" Mas Fikri menjawab: "Eh, ngomong-ngomong, kalian tahu nggak sih betapa susahnya cari tukang parkir jujur zaman sekarang?"',
    options: [
      {
        text: '"Eits, itu red herring, Mas. Urusan parkir kita bahas nanti, sekarang balik dulu ke selisih kas 500 ribu."',
        correct: true,
        reaction: 'Nggak bisa kabur! Satu warkop langsung kompak bilang: "Cek nota dulu, Mas!"'
      },
      {
        text: '"Wah bener banget! Kemarin aku juga kena parkir 10 ribu di minimarket!"',
        correct: false,
        reaction: 'Lah, kamu malah sukses dialihkan! Uang kasnya lupa dibahas!'
      },
      {
        text: '"Mas Fikri tukang parkir ya?"',
        correct: false,
        reaction: 'Makin melenceng dari topik laporan kas!'
      }
    ],
    meaning: 'Red Herring: melempar topik sampingan yang menarik atau emosional untuk mengalihkan perhatian dari pertanyaan utama.',
    pitfall: 'Pembicara yang tangkas selalu mencatat topik sampingan itu lalu menarik diskusi kembali ke inti.',
    usage: 'Jurus balasan tenang: "Topik itu menarik, tapi kita bereskan dulu pertanyaan utama tadi ya."'
  },
  {
    id: 'fall-14',
    speaker: 'rina',
    fallacyName: 'Circular Reasoning (Argumen Melingkar)',
    attack: '"Aturan baru ini sudah pasti adil dan terbaik, karena semua aturan yang dibuat panitia ini selalu adil!"',
    options: [
      {
        text: '"Itu circular reasoning, Teh. Kesimpulannya cuma mengulang klaim awal tanpa bukti independen."',
        correct: true,
        reaction: 'Teh Rina senyum puas: "Nah, akhirnya ada yang jeli melihat logika muter-muter!"'
      },
      {
        text: '"Oh masuk akal banget, soalnya memang terbukti dari kalimat keduanya!"',
        correct: false,
        reaction: 'Kalimat keduanya cuma mengulang kalimat pertama dengan baju baru!'
      },
      {
        text: '"Berarti panitia tidak boleh bikin aturan lagi."',
        correct: false,
        reaction: 'Boleh bikin aturan, asal dijelaskan dasar objektif dan ukurannya.'
      }
    ],
    meaning: 'Circular Reasoning (Penalaran Melingkar): memakai kesimpulan itu sendiri sebagai alasan untuk membuktikan kebenarannya.',
    pitfall: 'Kedengarannya meyakinkan kalau diucapkan cepat, padahal kosong bukti.',
    usage: 'Jurus balasan tenang: "Indikator objektif yang bikin aturan ini adil apa saja?"'
  },
  {
    id: 'fall-15',
    speaker: 'fikri',
    fallacyName: 'No True Scotsman',
    attack: 'Mas Fikri bilang: "Pencinta kopi sejati pasti minum kopi hitam tanpa gula." Pas tahu barista juara dunia suka es kopi susu, Mas Fikri nyeletuk: "Berarti dia bukan pencinta kopi sejati!"',
    options: [
      {
        text: '"Itu jebakan No True Scotsman, Mas: menggeser definisi seenaknya tiap kali ketemu contoh yang membantah klaimmu."',
        correct: true,
        reaction: 'Skakmat! Bang Jaja langsung buatin es kopi susu sambil ketawa.'
      },
      {
        text: '"Iya benar, juara dunia juga belum tentu ngerti kopi dibanding Mas Fikri."',
        correct: false,
        reaction: 'Mas Fikri langsung makin gede kepala tuh!'
      },
      {
        text: '"Semua kopi hitam itu pahit dan nggak enak."',
        correct: false,
        reaction: 'Itu cuma soal selera pribadi, bukan membedah cacat logikanya.'
      }
    ],
    meaning: 'No True Scotsman: melindungi klaim generalisasi dengan mengubah definisi "anggota sejati" secara sepihak setiap ada contoh pengecualian.',
    pitfall: 'Sering muncul dalam obrolan hobi, musik, fandom, dan identitas kelompok.',
    usage: 'Jurus balasan tenang: "Kalau definisinya digeser terus tiap ada pengecualian, klaimnya jadi nggak bisa diuji."'
  },
  {
    id: 'fall-16',
    speaker: 'siska',
    fallacyName: 'Confirmation Bias (Bias Konfirmasi)',
    attack: '"Aku cuma mau baca artikel dan tonton video yang setuju sama pendapatku. Yang beda pendapat langsung aku tutup karena bikin pusing."',
    options: [
      {
        text: '"Hati-hati bias konfirmasi, Mbak. Kalau cuma cari pembenaran, titik buta kita nggak akan pernah kelihatan."',
        correct: true,
        reaction: 'Tajam tapi ramah! Mbak Siska akhirnya buka artikel pembanding.'
      },
      {
        text: '"Keren, itu tanda prinsip yang kuat dan anti goyah!"',
        correct: false,
        reaction: 'Prinsip kuat diuji lewat argumen tandingan, bukan dengan menutup telinga.'
      },
      {
        text: '"Jangan pernah baca artikel apa pun biar netral."',
        correct: false,
        reaction: 'Lha kalau nggak baca sama sekali nanti malah nggak punya bahan!'
      }
    ],
    meaning: 'Confirmation Bias: kecenderungan mencari, mengingat, dan menafsirkan informasi hanya yang menguatkan keyakinan awal kita.',
    pitfall: 'Algoritma media sosial sangat memperkuat bias ini; pembicara gacor rajin membaca sudut pandang lawan yang paling kuat.',
    usage: 'Jurus balasan tenang: "Coba kita cek juga argumen terbaik dari sisi seberang biar keputusan kita makin kokoh."'
  }
];
