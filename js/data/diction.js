// Bank diksi dan kaidah EYD V / KBBI VI (20 entri ringkas).

export const DICTION_BANK = [
  {
    id: 'dict-01',
    term: 'Bergeming',
    prompt: 'Mengapa frasa "tidak bergeming" keliru untuk arti tetap diam?',
    options: [
      { text: '"Bergeming" sendiri sudah berarti diam tidak bergerak.', correct: true },
      { text: '"Bergeming" berarti berlari kencang.', correct: false },
      { text: 'Harus ditulis "ber-geming" memakai tanda hubung.', correct: false }
    ],
    meaning: 'Bergeming (v): diam saja; tidak bergerak sedikit juga.',
    usage: 'Ia tetap bergeming menyelesaikan laporan di tengah ruang rapat yang riuh.'
  },
  {
    id: 'dict-02',
    term: 'Acuh',
    prompt: 'Apa arti kata "acuh" menurut KBBI VI?',
    options: [
      { text: 'Peduli atau menaruh perhatian.', correct: true },
      { text: 'Cuek dan tidak peduli.', correct: false },
      { text: 'Marah dalam diam.', correct: false }
    ],
    meaning: 'Acuh (a): peduli; mengindahkan. Kebalikannya adalah "tak acuh".',
    usage: 'Timnya acuh terhadap detail kecil sehingga rancangan tersusun rapi.'
  },
  {
    id: 'dict-03',
    term: 'Epigon',
    prompt: 'Apa sebutan untuk orang yang hanya meniru karya pendahulu tanpa gagasan baru?',
    options: [
      { text: 'Epigon', correct: true },
      { text: 'Serendipiti', correct: false },
      { text: 'Alegori', correct: false }
    ],
    meaning: 'Epigon (n): orang yang tidak memiliki gagasan baru dan hanya mengikuti jejak pemikir atau seniman sebelumnya.',
    usage: 'Alih-alih menjadi epigon tren sementara, ia membangun gaya tulisannya sendiri.'
  },
  {
    id: 'dict-04',
    term: 'Eufemisme',
    prompt: 'Ungkapan "penyesuaian ukuran organisasi" untuk mengganti kata PHK termasuk majas apa?',
    options: [
      { text: 'Eufemisme (penghalusan makna)', correct: true },
      { text: 'Hiperbola (melebih-lebihkan)', correct: false },
      { text: 'Pleonasme (pengulangan makna)', correct: false }
    ],
    meaning: 'Eufemisme (n): ungkapan halus pengganti ungkapan yang terasa kasar atau menyinggung.',
    usage: 'Penyesuaian tarif kerap dipakai sebagai eufemisme untuk kenaikan harga.'
  },
  {
    id: 'dict-05',
    term: 'Ambivalen',
    prompt: 'Kata apa yang tepat untuk dua perasaan bertentangan yang muncul bersamaan?',
    options: [
      { text: 'Ambivalen', correct: true },
      { text: 'Apatis', correct: false },
      { text: 'Otoriter', correct: false }
    ],
    meaning: 'Ambivalen (a): bercabang dua yang saling bertentangan dalam sikap atau perasaan.',
    usage: 'Ia merasa ambivalen menerima tawaran luar kota: peluang besar, tetapi jauh dari keluarga.'
  },
  {
    id: 'dict-06',
    term: 'Paradoks',
    prompt: 'Pilihan tontonan yang terlalu banyak justru membuat kita tidak memilih apa pun. Kondisi ini disebut apa?',
    options: [
      { text: 'Paradoks', correct: true },
      { text: 'Pleonasme', correct: false },
      { text: 'Kronologi', correct: false }
    ],
    meaning: 'Paradoks (n): pernyataan yang tampak bertentangan dengan pendapat umum, namun mengandung kebenaran.',
    usage: 'Paradoks istirahat: semakin memaksa cepat tidur, mata justru semakin terjaga.'
  },
  {
    id: 'dict-07',
    term: 'Sekadar & Risiko',
    prompt: 'Pilih kalimat yang seluruh ejaannya baku menurut KBBI VI.',
    options: [
      { text: 'Sekadar mengingatkan, setiap praktik baru memiliki risiko dan perlu analisis.', correct: true },
      { text: 'Sekedar mengingatkan, setiap praktek baru memiliki resiko dan perlu analisa.', correct: false },
      { text: 'Silahkan dicoba, tapi jangan merubah jadwal tanpa ijin.', correct: false }
    ],
    meaning: 'Bentuk baku KBBI VI: sekadar, praktik, risiko, analisis, silakan, mengubah, izin.',
    usage: 'Ejaan baku menjaga ketelitian teks resmi maupun tulisan harian.'
  },
  {
    id: 'dict-08',
    term: 'Serendipiti',
    prompt: 'Kata apa yang menggambarkan keberuntungan menemukan hal berharga tanpa sengaja?',
    options: [
      { text: 'Serendipiti', correct: true },
      { text: 'Anomali', correct: false },
      { text: 'Nostalgia', correct: false }
    ],
    meaning: 'Serendipiti (n): keberuntungan menemukan sesuatu yang berharga secara tidak terduga.',
    usage: 'Beberapa penemuan ilmiah lahir dari serendipiti di ruang laboratorium.'
  },
  {
    id: 'dict-09',
    term: 'Pleonasme',
    prompt: 'Frasa "para hadirin dimohon agar supaya maju ke depan" mengandung kesalahan apa?',
    options: [
      { text: 'Pleonasme (pemborosan kata bermakna ganda)', correct: true },
      { text: 'Ironi (pertentangan harapan)', correct: false },
      { text: 'Metafora (perbandingan langsung)', correct: false }
    ],
    meaning: 'Pleonasme (n): pemakaian kata berlebih yang maknanya sudah terkandung pada kata sebelumnya.',
    usage: 'Cukup tulis: "Hadirin dipersilakan maju."'
  },
  {
    id: 'dict-10',
    term: 'Pragmatis',
    prompt: 'Satu kata baku untuk sikap yang mengutamakan langkah praktis dan hasil nyata?',
    options: [
      { text: 'Pragmatis', correct: true },
      { text: 'Dogmatis', correct: false },
      { text: 'Utopis', correct: false }
    ],
    meaning: 'Pragmatis (a): bersifat praktis dan mengutamakan penerapan nyata dibanding teori semata.',
    usage: 'Rencana jangka panjang boleh idealis, tetapi langkah pekan ini perlu pragmatis.'
  },
  {
    id: 'dict-11',
    term: 'Ironi',
    prompt: 'Rumah seorang petugas pemadam terbakar saat ia mengisi seminar pencegahan kebakaran. Peristiwa ini disebut apa?',
    options: [
      { text: 'Ironi', correct: true },
      { text: 'Sarkasme', correct: false },
      { text: 'Alegori', correct: false }
    ],
    meaning: 'Ironi (n): kejadian atau pernyataan yang bertentangan dengan yang diharapkan.',
    usage: 'Ironis bila aplikasi penghemat waktu justru paling banyak menyita waktu.'
  },
  {
    id: 'dict-12',
    term: 'Retorika',
    prompt: 'Pidato yang indah gaya bahasanya namun kosong bukti paling tepat dikritik bagaimana?',
    options: [
      { text: 'Kuat di retorika, tipis di substansi.', correct: true },
      { text: 'Terlalu kronologis dan tidak ergonomis.', correct: false },
      { text: 'Kelebihan kohesi tanpa konjungsi.', correct: false }
    ],
    meaning: 'Retorika (n): keterampilan berbahasa secara efektif; dalam kritik merujuk pada gaya bicara tanpa bukti kuat.',
    usage: 'Forum membutuhkan substansi yang bisa diuji, bukan retorika.'
  },
  {
    id: 'dict-13',
    term: 'Skeptis',
    prompt: 'Meminta izin resmi dan perhitungan logis sebelum menerima tawaran investasi disebut sikap apa?',
    options: [
      { text: 'Skeptis (ragu secara kritis hingga ada bukti)', correct: true },
      { text: 'Sinis (selalu merendahkan niat orang lain)', correct: false },
      { text: 'Naif (mudah percaya tanpa periksa)', correct: false }
    ],
    meaning: 'Skeptis (a): ragu dan menuntut bukti sebelum menerima sebuah klaim.',
    usage: 'Ia terbuka pada gagasan baru, namun tetap skeptis sebelum melihat data uji.'
  },
  {
    id: 'dict-14',
    term: 'Lugas',
    prompt: 'Padanan paling lugas untuk "penyelarasan ekspektasi secara holistik agar sinergi optimal"?',
    options: [
      { text: 'Menyamakan target kerja agar tim berjalan seirama.', correct: true },
      { text: 'Mengakselerasi sinergitas ekspektasional bersama.', correct: false },
      { text: 'Menyerahkan seluruh keputusan tanpa rencana.', correct: false }
    ],
    meaning: 'Lugas (a): mengenai yang pokok-pokok saja; langsung dan tidak berbelit.',
    usage: 'Paparannya lugas: tiga menit selesai dan pembagian tugas langsung jelas.'
  },
  {
    id: 'dict-15',
    term: 'Awalan di- vs di',
    prompt: 'Pilih penulisan awalan "di-" dan kata depan "di" yang seluruhnya tepat.',
    options: [
      { text: 'Buku disimpan di laci, lalu dibaca di mana saja.', correct: true },
      { text: 'Buku di simpan dilaci, lalu di baca dimana saja.', correct: false },
      { text: 'Buku disimpan dilaci, lalu dibaca dimana saja.', correct: false }
    ],
    meaning: 'Dirangkai untuk kata kerja pasif (disimpan, dibaca); dipisah untuk penunjuk tempat (di laci, di mana).',
    usage: 'Teh diseduh di dapur, bukan di seduh didapur.'
  },
  {
    id: 'dict-16',
    term: 'Resiliensi',
    prompt: 'Kemampuan cepat pulih dan beradaptasi setelah menghadapi tekanan disebut apa?',
    options: [
      { text: 'Resiliensi', correct: true },
      { text: 'Stagnasi', correct: false },
      { text: 'Degradasi', correct: false }
    ],
    meaning: 'Resiliensi (n): kemampuan untuk pulih atau beradaptasi setelah menghadapi kesulitan.',
    usage: 'Bakat membantu memulai cepat, tetapi resiliensi menjaga langkah hingga selesai.'
  },
  {
    id: 'dict-17',
    term: 'Cendekia',
    prompt: 'Apa arti kata baku "cendekia" dalam KBBI VI?',
    options: [
      { text: 'Tajam pikiran, cepat mengerti, dan pandai mencari jalan keluar.', correct: true },
      { text: 'Gemar mengoleksi benda antik.', correct: false },
      { text: 'Suasana sunyi di pegunungan.', correct: false }
    ],
    meaning: 'Cendekia (a): tajam pikiran; lekas mengerti; cerdas; pandai mencari jalan keluar.',
    usage: 'Cara ia menengahi perbedaan pendapat tadi terasa cendekia.'
  },
  {
    id: 'dict-18',
    term: 'Nuansa',
    prompt: 'Kata apa yang merujuk pada perbedaan halus di antara dua sudut pandang hitam-putih?',
    options: [
      { text: 'Nuansa', correct: true },
      { text: 'Monopoli', correct: false },
      { text: 'Doktrin', correct: false }
    ],
    meaning: 'Nuansa (n): variasi atau perbedaan yang sangat halus dalam makna, rasa, atau sudut pandang.',
    usage: 'Di balik angka rata-rata terdapat nuansa konteks yang perlu dibaca.'
  },
  {
    id: 'dict-19',
    term: 'Mubazir, Napas, Andal',
    prompt: 'Pilih deretan kata yang seluruhnya baku menurut KBBI VI.',
    options: [
      { text: 'mubazir, napas, andal', correct: true },
      { text: 'mubadzir, nafas, handal', correct: false },
      { text: 'mubazir, nafas, handal', correct: false }
    ],
    meaning: 'Bentuk baku KBBI VI: mubazir, napas, andal, jadwal, imbau, utang, teknik, ekstrem.',
    usage: 'Sistem yang andal mencegah waktu terbuang mubazir.'
  },
  {
    id: 'dict-20',
    term: 'Artikulatif',
    prompt: 'Kata sifat apa yang tepat untuk orang yang mampu menjelaskan konsep rumit secara jernih dan runtut?',
    options: [
      { text: 'Artikulatif', correct: true },
      { text: 'Spekulatif', correct: false },
      { text: 'Repetitif', correct: false }
    ],
    meaning: 'Artikulatif (a): mampu mengutarakan pikiran secara jelas, lancar, dan tepat sasaran.',
    usage: 'Penjelasannya artikulatif sehingga topik teknis terasa mudah diikuti.'
  }
];
