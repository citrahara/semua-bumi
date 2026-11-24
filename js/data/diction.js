// Bank konten Babak 2: Naik Kelas Diksi & Sikat Salah Kaprah Bahasa
// Semua arti dan ejaan mengacu pada KBBI VI dan EYD V.

export const DICTION_BANK = [
  {
    id: 'dict-01',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Bergeming',
    prompt: 'Berita olahraga menulis: "Penyerang lawan tidak bergeming sedikit pun saat digempur tiga bek." Padahal maksudnya si penyerang tetap diam tenang. Di mana letak salah kaprahnya?',
    options: [
      {
        text: 'Kata "bergeming" sendiri sudah berarti diam tidak bergerak, jadi "tidak bergeming" justru bermakna bergerak.',
        correct: true,
        reaction: 'Tepat sasaran! Teh Rina langsung kasih nilai A tanpa remidi.'
      },
      {
        text: 'Kata "bergeming" artinya lari kencang, jadi kalimat itu sudah pas.',
        correct: false,
        reaction: 'Waduh, "geming" itu diam tenang, bukan sprint 100 meter!'
      },
      {
        text: 'Harusnya ditulis "ber-geming" pakai tanda hubung.',
        correct: false,
        reaction: 'Nggak pakai tanda hubung dong, awalan ber- langsung nempel.'
      }
    ],
    meaning: 'Bergeming (v): diam saja; tidak bergerak sedikit juga.',
    pitfall: 'Sering keliru ditulis "tak bergeming" untuk maksud tetap teguh, padahal justru membalik artinya.',
    usage: 'Contoh keren: "Meski jadwal mepet dan klien panik, dia tetap bergeming menyelesaikan presentasi."'
  },
  {
    id: 'dict-02',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Acuh',
    prompt: 'Temanmu curhat: "Dia acuh banget sama aku, chat-ku cuma dibaca!" Secara KBBI, apa arti sebenarnya kata "acuh"?',
    options: [
      {
        text: 'Peduli atau menaruh perhatian. Kalau cuek, yang benar "tak acuh".',
        correct: true,
        reaction: 'Cakep! Berarti kalau dia acuh, justru dia peduli tuh.'
      },
      {
        text: 'Cuek bebek dan pura-pura tidak melihat.',
        correct: false,
        reaction: 'Nah kan kejebak! Itu arti "tak acuh", bukan "acuh".'
      },
      {
        text: 'Marah besar sambil membanting pintu.',
        correct: false,
        reaction: 'Jauh banget, itu sih lagi emosi tingkat dewa.'
      }
    ],
    meaning: 'Acuh (a): peduli; mengindahkan. Kebalikannya adalah "tak acuh" (masa bodoh).',
    pitfall: 'Banyak orang menghilangkan kata "tak", sehingga maksud kalimatnya terbalik total.',
    usage: 'Contoh keren: "Timnya sangat acuh terhadap detail kecil, makanya produknya rapi."'
  },
  {
    id: 'dict-03',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Epigon',
    prompt: 'Mbak Siska berbisik soal kreator konten yang kerjanya cuma menjiplak gaya orang lain tanpa ide asli. Kalimat mana yang paling tajam dan berkelas?',
    options: [
      {
        text: '"Sayang sekali, karyanya cuma jadi epigon dari tren bulan lalu tanpa suara sendiri."',
        correct: true,
        reaction: 'Kelas! Satu kata "epigon" langsung bikin kritikmu terdengar terpelajar tanpa kasar.'
      },
      {
        text: '"Dia adalah penjiplak yang teramat sangat menyalin penuh tiruan."',
        correct: false,
        reaction: 'Muter-muter banget kalimatnya, sampai kopinya keburu dingin!'
      },
      {
        text: '"Gayanya sungguh serendipiti yang membosankan."',
        correct: false,
        reaction: 'Serendipiti itu penemuan tak terduga yang menyenangkan, bukan tukang tiru!'
      }
    ],
    meaning: 'Epigon (n): orang yang tidak memiliki gagasan baru dan hanya mengikuti jejak pemikir atau seniman sebelumnya.',
    pitfall: 'Lebih tepat daripada sekadar bilang "ikut-ikutan" saat membahas karya, tren, atau gaya berpikir.',
    usage: 'Contoh keren: "Daripada jadi epigon gaya presentasi orang lain, cari ritme bicaramu sendiri."'
  },
  {
    id: 'dict-04',
    speaker: 'siska',
    mode: 'korporat',
    term: 'Eufemisme',
    prompt: 'Di surat kantor tertulis: "Perusahaan melakukan penyesuaian ukuran organisasi demi kelincahan." Terjemahkan bahasa halus itu dan sebut nama gayanya!',
    options: [
      {
        text: 'Artinya pengurangan karyawan (PHK), memakai gaya bahasa eufemisme (penghalusan makna).',
        correct: true,
        reaction: 'Tajam! Mbak Siska langsung nutup laptop sambil manggut-manggut.'
      },
      {
        text: 'Artinya kantor pindah gedung lebih luas, memakai gaya hiperbola.',
        correct: false,
        reaction: 'Wah, kalau baca pengumuman kantor sepolos itu bisa kaget nanti!'
      },
      {
        text: 'Artinya bonus naik dua kali lipat, memakai gaya metafora.',
        correct: false,
        reaction: 'Aminkan saja, tapi bukan itu artinya bro!'
      }
    ],
    meaning: 'Eufemisme (n): ungkapan yang lebih halus sebagai pengganti ungkapan yang dirasakan kasar atau menyinggung.',
    pitfall: 'Peka pada eufemisme membuatmu cepat menangkap makna tersirat dalam rapat, berita, dan negosiasi.',
    usage: 'Contoh keren: "Penyesuaian tarif itu eufemisme halus untuk bilang harga naik."'
  },
  {
    id: 'dict-05',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Ambivalen',
    prompt: 'Kamu diterima kerja di luar kota: gajinya menggiurkan, tapi berat meninggalkan keluarga. Kata apa yang paling pas menggambarkan perasaan bercabang dua itu?',
    options: [
      {
        text: 'Ambivalen (memiliki dua perasaan yang bertentangan pada saat bersamaan).',
        correct: true,
        reaction: 'Sempurna! Lebih kaya makna daripada cuma bilang "bingung banget".'
      },
      {
        text: 'Apatis (tidak peduli sama sekali).',
        correct: false,
        reaction: 'Kalau apatis mah nggak bakal kepikiran, langsung tidur pulas.'
      },
      {
        text: 'Otoriter (memaksakan kehendak).',
        correct: false,
        reaction: 'Lho kok jadi diktator? Beda jalur!'
      }
    ],
    meaning: 'Ambivalen (a): bercabang dua yang saling bertentangan (misalnya senang sekaligus sedih terhadap hal yang sama).',
    pitfall: 'Berbeda dengan "ambigu" (bermakna ganda pada ucapan/teks). Ambivalen merujuk pada perasaan atau sikap.',
    usage: 'Contoh keren: "Aku agak ambivalen soal kerja jarak jauh: hemat waktu di jalan, tapi kangen ngobrol langsung."'
  },
  {
    id: 'dict-06',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Paradoks',
    prompt: 'Kamu mau bilang: "Aneh ya, makin banyak pilihan tontonan di layar, kita malah makin lama cuma gulir-gulir dan akhirnya nggak nonton apa-apa." Versi mana yang paling ngena?',
    options: [
      {
        text: '"Ini paradoks pilihan: opsi melimpah justru melumpuhkan keputusan kita."',
        correct: true,
        reaction: 'Seisi warkop langsung mengangguk! Ringkas, tajam, dan mudah diingat.'
      },
      {
        text: '"Ini adalah kejadian yang mana pilihan tersebut berlimpah sehingga membingungkan."',
        correct: false,
        reaction: 'Aduh, ada "yang mana" segala! Kaku kayak terjemahan mesin.'
      },
      {
        text: '"Ini pleonasme tontonan yang tiada berujung."',
        correct: false,
        reaction: 'Pleonasme itu pemborosan kata kayak "naik ke atas", bukan kontradiksi!'
      }
    ],
    meaning: 'Paradoks (n): pernyataan yang seolah-olah bertentangan dengan pendapat umum, tetapi sesungguhnya mengandung kebenaran.',
    pitfall: 'Cocok banget untuk membuka presentasi atau kalimat pembuka biar audiens langsung penasaran.',
    usage: 'Contoh keren: "Paradoks istirahat: makin kita memaksa diri cepat tidur, mata justru makin melek."'
  },
  {
    id: 'dict-07',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Sekadar & Risiko',
    prompt: 'Teh Rina memeriksa draf caption media sosialmu. Mana kalimat yang seluruh ejaannya 100 persen baku menurut KBBI?',
    options: [
      {
        text: '"Sekadar mengingatkan, setiap praktik baru pasti punya risiko dan perlu analisis matang."',
        correct: true,
        reaction: 'Bersih tanpa noda! EYD V kamu lolos audit ketat Teh Rina.'
      },
      {
        text: '"Sekedar mengingatkan, setiap praktek baru pasti punya resiko dan perlu analisa matang."',
        correct: false,
        reaction: 'Empat jebakan disapu bersih ke arah yang salah! Harusnya sekadar, praktik, risiko, analisis.'
      },
      {
        text: '"Silahkan dicoba, tapi jangan merubah jadwal tanpa ijin."',
        correct: false,
        reaction: 'Tiga salah tulis sekaligus: harusnya silakan, mengubah, izin!'
      }
    ],
    meaning: 'Ejaan baku KBBI: sekadar, praktik, risiko, analisis, silakan, mengubah, izin.',
    pitfall: 'Kesalahan eja klasik ini sering membuat tulisan serius terlihat kurang teliti.',
    usage: 'Contoh keren: "Menjaga ejaan baku di hal kecil bikin argumenmu lebih dipercaya saat presentasi."'
  },
  {
    id: 'dict-08',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Serendipiti',
    prompt: 'Kamu lagi nyari kafe buat kerja, malah nyasar ke warung kopi kecil yang kopinya paling enak sekota dan ketemu kenalan lama. Kata keren apa untuk momen kebetulan yang menyenangkan ini?',
    options: [
      {
        text: 'Serendipiti (menemukan sesuatu yang berharga secara tak terduga).',
        correct: true,
        reaction: 'Manis banget! Penonton warkop langsung catat di notes HP.'
      },
      {
        text: 'Anomali (penyimpangan dari keadaan normal).',
        correct: false,
        reaction: 'Anomali kesannya kayak error sistem atau benda asing jatuh dari langit.'
      },
      {
        text: 'Nostalgia (kerinduan pada masa lalu).',
        correct: false,
        reaction: 'Nostalgia cuma bagian kangen masa lalunya, bukan unsur "nyasar lalu ketemu hal keren".'
      }
    ],
    meaning: 'Serendipiti (n): keberuntungan menemukan hal berharga atau menyenangkan tanpa sengaja saat mencari hal lain.',
    pitfall: 'Berasal dari dongeng Persia "Tiga Pangeran Serendip" (Sri Lanka) yang selalu menemukan hal hebat secara tak terduga.',
    usage: 'Contoh keren: "Obrolan terbaik sering lahir dari serendipiti, bukan dari jadwal rapat yang terlalu kaku."'
  },
  {
    id: 'dict-09',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Pleonasme',
    prompt: 'Pembawa acara berkata: "Para hadirin sekalian dimohon agar supaya maju ke depan dan naik ke atas panggung." Kenapa kalimat ini bikin Teh Rina memijat pelipis?',
    options: [
      {
        text: 'Penuh pleonasme (pemborosan kata yang maknanya sudah terkandung di kata sebelumnya).',
        correct: true,
        reaction: 'Cepat tangkap! Cukup bilang: "Hadirin dimohon maju dan naik ke panggung."'
      },
      {
        text: 'Karena terlalu banyak memakai istilah asing.',
        correct: false,
        reaction: 'Semua katanya bahasa Indonesia kok, cuma dobel-dobel kayak porsi nasi padang!'
      },
      {
        text: 'Karena menggunakan majas ironi.',
        correct: false,
        reaction: 'Bukan menyindir, cuma kebanyakan pengulangan kata.'
      }
    ],
    meaning: 'Pleonasme (n): pemakaian kata yang lebih daripada yang diperlukan (misal: "para hadirin", "maju ke depan", "naik ke atas", "agar supaya").',
    pitfall: 'Membuang pleonasme langsung membuat gaya bicaramu terdengar ringkas, mantap, dan rapi.',
    usage: 'Contoh keren: "Hadirin dipersilakan duduk" jauh lebih tegas daripada "Para hadirin sekalian dimohon untuk duduk ke bawah."'
  },
  {
    id: 'dict-10',
    speaker: 'siska',
    mode: 'korporat',
    term: 'Pragmatis',
    prompt: 'Mbak Siska bilang: "Kita butuh pendekatan yang actionable, low-hanging fruit, dan jalan dulu aja daripada terlalu ngawang." Satu kata Indonesia baku yang paling pas mewakili sikap itu?',
    options: [
      {
        text: 'Pragmatis (bersifat praktis dan berfokus pada hasil nyata yang bisa segera dijalankan).',
        correct: true,
        reaction: 'Satu kata langsung menggantikan tiga jargon kantor! Rapat selesai 15 menit lebih cepat.'
      },
      {
        text: 'Dogmatis (kaku berpegang pada satu keyakinan tanpa mau diuji).',
        correct: false,
        reaction: 'Kebalik total! Dogmatis justru kaku dan susah diajak cari solusi praktis.'
      },
      {
        text: 'Utopis (khayalan ideal yang mustahil terwujud).',
        correct: false,
        reaction: 'Utopis itu malah makin ngawang sampai ke awan!'
      }
    ],
    meaning: 'Pragmatis (a): bersifat praktis dan berguna bagi umum; mengutamakan penerapan nyata dibanding teori semata.',
    pitfall: 'Pasangan kontras yang keren saat berdiskusi: "idealis" (mengejar standar sempurna) vs "pragmatis" (mengejar solusi yang jalan sekarang).',
    usage: 'Contoh keren: "Visi kita boleh idealis, tapi eksekusi pekan ini harus pragmatis."'
  },
  {
    id: 'dict-11',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Ironi vs Sarkasme',
    prompt: 'Seorang pemadam kebakaran justru rumahnya kebakaran saat dia sedang mengisi seminar pencegahan kebakaran. Situasi ini lebih tepat disebut apa?',
    options: [
      {
        text: 'Ironi (kejadian yang bertentangan secara tajam dengan harapan atau profesi).',
        correct: true,
        reaction: 'Tepat! Banyak orang salah menyebut semua hal pahit sebagai sarkasme, padahal ini ironi situasi.'
      },
      {
        text: 'Sarkasme (sindiran kasar untuk menyakiti hati).',
        correct: false,
        reaction: 'Sarkasme itu ucapan menyindir tajam, bukan kejadian tak terduga.'
      },
      {
        text: 'Alegori (cerita kiasan panjang).',
        correct: false,
        reaction: 'Bukan dongeng kiasan dong, ini beneran ironi kehidupan.'
      }
    ],
    meaning: 'Ironi (n): kejadian atau pernyataan yang bertentangan dengan yang diharapkan. Sarkasme (n): kata-kata pedas untuk menyakiti atau mencemooh.',
    pitfall: 'Membedakan ironi, satir, dan sarkasme bikin komentar sosialmu terdengar presisi.',
    usage: 'Contoh keren: "Ironis ya, aplikasi penghemat waktu malah paling banyak menyita waktu kita."'
  },
  {
    id: 'dict-12',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Retorika',
    prompt: 'Kamu habis dengar pidato yang gayanya heboh dan kata-katanya indah, tapi isinya kosong tanpa bukti. Kalimat mana yang paling tajam?',
    options: [
      {
        text: '"Pidatonya kuat di retorika, tapi tipis di substansi."',
        correct: true,
        reaction: 'Warkop langsung bersiul! Singkat, adil, dan menohok tepat di sasaran.'
      },
      {
        text: '"Pidatonya omong kosong doang nggak jelas juntrungannya."',
        correct: false,
        reaction: 'Jujur sih, tapi terlalu kasar kalau diucapkan di forum terbuka.'
      },
      {
        text: '"Pidatonya terlalu kronologis sehingga tidak ergonomis."',
        correct: false,
        reaction: 'Lho, pidato kok ergonomis? Itu kursi kerja, Bos!'
      }
    ],
    meaning: 'Retorika (n): keterampilan berbahasa secara efektif; dalam kritik sering merujuk pada gaya bicara yang meyakinkan namun belum tentu berisi fakta kuat.',
    pitfall: 'Memasangkan kata "retorika" dengan "substansi" adalah jurus klasik pembicara cerdas.',
    usage: 'Contoh keren: "Kita butuh substansi yang bisa diuji, bukan retorika panggung."'
  },
  {
    id: 'dict-13',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Skeptis vs Sinis',
    prompt: 'Saat mendengar promo "investasi untung 50 persen per minggu", kamu minta bukti izin resmi dan hitung-hitungan logisnya dulu sebelum percaya. Sikapmu ini disebut apa?',
    options: [
      {
        text: 'Skeptis (ragu secara kritis sampai ada bukti yang meyakinkan).',
        correct: true,
        reaction: 'Mantap! Skeptis itu sehat dan rasional, beda dengan sinis yang cuma mengejek.'
      },
      {
        text: 'Sinis (selalu curiga buruk dan memandang rendah niat semua orang).',
        correct: false,
        reaction: 'Hati-hati! Meminta bukti itu skeptis yang sehat, bukan langsung sinis.'
      },
      {
        text: 'Naif (terlalu polos dan mudah percaya).',
        correct: false,
        reaction: 'Kalau naif mah sudah langsung transfer uangnya!'
      }
    ],
    meaning: 'Skeptis (a): kurang percaya dan menuntut bukti sebelum menerima klaim. Sinis (a): memandang rendah dan mengejek niat baik orang lain.',
    pitfall: 'Saat berdebat, bilang "saya skeptis" jauh lebih konstruktif daripada terkesan sinis.',
    usage: 'Contoh keren: "Aku mendukung ide baru, cuma tetap skeptis sampai lihat hasil ujinya."'
  },
  {
    id: 'dict-14',
    speaker: 'siska',
    mode: 'korporat',
    term: 'Lugas',
    prompt: 'Mbak Siska mengirim pesan: "Mari kita lakukan penyelarasan ekspektasi secara holistik agar sinergi kolaboratif kita optimal." Ubah jadi kalimat Indonesia yang lugas!',
    options: [
      {
        text: '"Ayo samakan target kerja kita supaya tim bisa jalan seirama."',
        correct: true,
        reaction: 'Nah, ini baru bahasa manusia! Jelas, hangat, dan langsung bisa dikerjakan.'
      },
      {
        text: '"Mari kita akselerasikan sinergitas ekspektasional bersama."',
        correct: false,
        reaction: 'Malah makin pusing! Itu bukan diterjemahkan, tapi ditambah bumbunya!'
      },
      {
        text: '"Terserah kamu saja deh, aku ngikut."',
        correct: false,
        reaction: 'Terlalu pasrah, bukan menyamakan target!'
      }
    ],
    meaning: 'Lugas (a): mengenai yang pokok-pokok saja; bersifat apa adanya; tidak berbelit-belit.',
    pitfall: 'Orang yang benar-benar paham topik justru mampu menjelaskannya dengan kalimat lugas, bukan bersembunyi di balik jargon.',
    usage: 'Contoh keren: "Presentasinya lugas: tiga menit selesai, semua orang langsung paham tugasnya."'
  },
  {
    id: 'dict-15',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Awalan di- vs Kata Depan di',
    prompt: 'Mana penulisan kata depan "di" dan awalan "di-" yang benar seluruhnya menurut EYD V?',
    options: [
      {
        text: '"Buku itu disimpan di laci, lalu dibaca di mana saja saat santai."',
        correct: true,
        reaction: 'Sempurna! Bisa diubah jadi me- ("menyimpan, membaca") berarti dirangkai; tempat ("di laci, di mana") berarti dipisah.'
      },
      {
        text: '"Buku itu di simpan dilaci, lalu di baca dimana saja saat santai."',
        correct: false,
        reaction: 'Kebalik semua! Ingat trik gampangnya: kata kerja pasif dirangkai, penunjuk tempat dipisah.'
      },
      {
        text: '"Buku itu disimpan dilaci, lalu dibaca dimana saja saat santai."',
        correct: false,
        reaction: 'Hampir! "di laci" dan "di mana" tetap wajib dipisah karena menunjukkan tempat.'
      }
    ],
    meaning: 'Kaidah di-/di: dirangkai bila membentuk kata kerja pasif (dibaca, ditulis); dipisah bila menyatakan tempat (di rumah, di sini, di mana).',
    pitfall: 'Satu kaidah 5 detik ini langsung menaikkan kualitas semua pesan kerja dan tugasmu.',
    usage: 'Contoh keren: "Kopi dituang di gelas, bukan di tuang digelas."'
  },
  {
    id: 'dict-16',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Resiliensi',
    prompt: 'Usaha kecil temanmu sempat sepi berbulan-bulan, tapi dia cepat menyesuaikan menu sampai akhirnya ramai lagi. Kalimat pujian mana yang paling berkelas?',
    options: [
      {
        text: '"Resiliensi kamu cepat banget: jatuh sebentar, langsung beradaptasi."',
        correct: true,
        reaction: 'Hangat dan elegan! Temanmu pasti langsung makin semangat.'
      },
      {
        text: '"Kamu punya stagnasi yang sangat mantap."',
        correct: false,
        reaction: 'Stagnasi itu mandek nggak bergerak! Salah puji bisa bikin canggung!'
      },
      {
        text: '"Kamu mengalami degradasi yang mengagumkan."',
        correct: false,
        reaction: 'Degradasi itu kemunduran! Untung bukan ngomong langsung di depan orangnya.'
      }
    ],
    meaning: 'Resiliensi (n): kemampuan untuk pulih kembali atau beradaptasi dengan cepat setelah menghadapi tekanan atau kesulitan.',
    pitfall: 'Beda dengan "keras kepala": resiliensi berarti lentur dan mampu bangkit dengan strategi baru.',
    usage: 'Contoh keren: "Bakat bikin kita mulai cepat, tapi resiliensi bikin kita bertahan sampai garis akhir."'
  },
  {
    id: 'dict-17',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Cendekia',
    prompt: 'Apa arti kata baku "cendekia" dalam bahasa Indonesia, yang jadi akar kata "cendekiawan"?',
    options: [
      {
        text: 'Tajam pikiran, lekas mengerti situasi, dan pandai mencari jalan keluar.',
        correct: true,
        reaction: 'Keren! Jadi cendekia mengutamakan ketajaman pikiran dan solusi, bukan hafalan semata.'
      },
      {
        text: 'Orang yang hobi mengoleksi barang antik.',
        correct: false,
        reaction: 'Itu kolektor barang lawas, bukan cendekia!'
      },
      {
        text: 'Suasana sunyi di pegunungan.',
        correct: false,
        reaction: 'Itu syahdu atau hening, bukan cendekia.'
      }
    ],
    meaning: 'Cendekia (a): tajam pikiran; lekas mengerti (kalau diberi tahu); cerdas; pandai mencari jalan keluar.',
    pitfall: 'Kosakata Indonesia asli/serapan lama ini memberi kesan elegan tanpa harus selalu meminjam kata Inggris.',
    usage: 'Contoh keren: "Cara dia meredakan debat panas tadi sungguh cendekia."'
  },
  {
    id: 'dict-18',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Nuansa',
    prompt: 'Diskusi grup jadi panas karena semua orang cuma melihat masalah hitam-putih. Kalimat mana yang paling apik buat menengahi?',
    options: [
      {
        text: '"Kasus ini punya banyak nuansa, jadi sayang kalau kita langsung menghakimi hitam-putih."',
        correct: true,
        reaction: 'Langsung adem suasananya! Kamu terdengar dewasa dan objektif.'
      },
      {
        text: '"Kalian semua salah total dan terlalu dangkal."',
        correct: false,
        reaction: 'Waduh, bukannya adem malah pindah sasaran ke kamu!'
      },
      {
        text: '"Masalah ini penuh monopoli warna."',
        correct: false,
        reaction: 'Monopoli warna kedengarannya kayak nama toko cat!'
      }
    ],
    meaning: 'Nuansa (n): variasi atau perbedaan yang sangat halus dan tipis (misalnya dalam makna, perasaan, atau sudut pandang).',
    pitfall: 'Mengajak orang melihat "nuansa" adalah tanda pembicara yang tenang dan terbiasa berpikir mendalam.',
    usage: 'Contoh keren: "Di balik angka statistik itu ada nuansa cerita manusia yang perlu kita dengar."'
  },
  {
    id: 'dict-19',
    speaker: 'rina',
    mode: 'salah-kaprah',
    term: 'Mubazir, Napas, Andal',
    prompt: 'Pilih deretan kata yang seluruhnya BAKU menurut KBBI VI!',
    options: [
      {
        text: 'mubazir, napas, andal',
        correct: true,
        reaction: 'Hat-trick baku! Bukan "mubadzir", bukan "nafas", dan bukan "handal".'
      },
      {
        text: 'mubadzir, nafas, handal',
        correct: false,
        reaction: 'Tiga-tiganya justru bentuk tidak baku yang paling sering dipakai orang!'
      },
      {
        text: 'mubazir, nafas, handal',
        correct: false,
        reaction: 'Baru satu yang benar! Yang baku adalah napas (pakai p) dan andal (tanpa h).'
      }
    ],
    meaning: 'Bentuk baku KBBI: mubazir, napas, andal, jadwal, imbau, utang, teknik, ekstrem.',
    pitfall: 'Kata "handal" sering dipakai di iklan, padahal bentuk bakunya "andal" (dari kata andal -> mengandalkan).',
    usage: 'Contoh keren: "Tarik napas dulu, kita butuh sistem yang andal supaya waktu nggak mubazir."'
  },
  {
    id: 'dict-20',
    speaker: 'siska',
    mode: 'upgrade',
    term: 'Artikulatif',
    prompt: 'Kamu kagum sama teman yang mampu menjelaskan konsep rumit dengan jelas, runtut, dan enak didengar. Satu kata sifat yang paling pas memujinya?',
    options: [
      {
        text: 'Artikulatif (mampu mengungkapkan gagasan secara jelas, teratur, dan fasih).',
        correct: true,
        reaction: 'Tepat sekali! Dan itulah persis keahlian yang sedang kamu latih di Warkop Sok Tahu!'
      },
      {
        text: 'Spekulatif (hanya mengira-ngira tanpa dasar).',
        correct: false,
        reaction: 'Kalau spekulatif malah dituduh nebak-nebak doang!'
      },
      {
        text: 'Repetitif (terus mengulang hal yang sama).',
        correct: false,
        reaction: 'Repetitif malah bikin penonton ngantuk.'
      }
    ],
    meaning: 'Artikulatif (a): mampu mengutarakan pikiran dan perasaan dengan jelas, lancar, dan tepat sasaran.',
    pitfall: 'Berbeda dengan cerewet; artikulatif menekankan kejernihan gagasan.',
    usage: 'Contoh keren: "Pembicara yang artikulatif bikin topik sesulit apa pun terasa ringan diikuti."'
  }
];
