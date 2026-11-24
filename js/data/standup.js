// Prolog Ringkas Kronik Atlas (3 Halaman), Salon Satir 1894 (Humor Kering & Natural), Komisi Harian, dan Generator Open-Mic.

export const VINTAGE_PROLOGUE = [
  {
    year: 'HALAMAN I · ATLAS ENAM BAB',
    speaker: 'orwell',
    title: 'Peta yang Terbuka Tanpa Bab Terakhir',
    text: 'Buku ini memuat enam wilayah pengetahuan yang berdiri di atas halamannya: Taman Arsip, Stasiun Bahasa, Sektor Sinyal, Gardu Vital, Balai Deduksi, dan Puncak Panggung. Setiap kali seluruh bab ditaklukkan, Jilid baru terbuka dengan penjaga yang jauh lebih tangguh.',
    aside: 'Tarik kursor untuk memutar POV, scroll untuk zoom hingga tepi buku, atau tekan [V] untuk POV bebas.'
  },
  {
    year: 'HALAMAN II · SENSOR & ANOMALI',
    speaker: 'vega',
    title: 'Menjaga Kejernihan dari Newspeak hingga Ancaman Siber',
    text: 'Halaman-halaman atlas mulai dikorupsi anomali: bahasa disusutkan menjadi slogan dangkal, bukti direkayasa terlalu rapi, dan celah keamanan siber mengintai. Pengetahuan yang kamu kumpulkan bukan pajangan, melainkan Relik yang langsung memperkuat serangan dan perisai di arena duel.',
    aside: 'Tips: Dekati musuh di peta lalu tekan [F] untuk Ambush Strike pembuka, dan pakai Overdrive untuk menembus armor.'
  },
  {
    year: 'HALAMAN III · TAMU NYASAR',
    speaker: 'ciko',
    title: 'Ciko, Teman Jalan yang Kebetulan Ikut Masuk',
    text: 'Aku Ciko. Jujur saja aku juga tidak tahu bagaimana cangkir porselen bisa terdampar di dalam buku setebal ini. Anggap saja aku penanda halaman yang kebetulan bisa komentar kalau suasana terlalu sunyi.',
    aside: 'Buka menu Tempa [U] kapan saja untuk meningkatkan ATK, DEF, HP, Kritikal, dan memantau Relik Ilmu.'
  }
];

export const STANDUP_SETS = [
  {
    id: 'su-01',
    title: 'Kecepatan Pesan vs Kecepatan Memeriksa Sumber',
    eraTag: '1894 · Disinformasi',
    steps: [
      {
        beat: '1. Pembuka',
        prompt: 'Buka pengamatan tentang perbedaan menyebar kabar di abad ke-19 dan hari ini:',
        options: [
          {
            line: '"Tahun 1894, menyebar kabar keliru butuh usaha: cetak selebaran, sewa kuda, lalu ketuk pintu satu per satu. Setidaknya orang punya waktu berpikir di tengah jalan."',
            laugh: 35,
            crowd: 'Hadirin tersenyum tipis sambil mengangguk setuju.',
            best: true
          },
          {
            line: '"Disinformasi adalah penyebaran informasi salah secara sengaja."',
            laugh: 10,
            crowd: 'Ruangan agak senyap; terdengar terlalu seperti definisi kamus.',
            best: false
          },
          {
            line: '"Zaman dulu belum ada internet jadi semua serba lambat."',
            laugh: 14,
            crowd: 'Terlalu datar, belum ada sudut pandang yang tajam.',
            best: false
          }
        ]
      },
      {
        beat: '2. Belokan',
        prompt: 'Tarik perbandingan tajam ke kebiasaan hari ini:',
        options: [
          {
            line: '"Hari ini, satu ketukan tombol cukup untuk mengirim mitos otak cuma terpakai sepuluh persen ke empat puluh grup, jauh sebelum kopi di meja sempat dingin."',
            laugh: 35,
            crowd: 'Tawa pelan pecah di barisan depan.',
            best: true
          },
          {
            line: '"Sekarang teknologi pesan instan berkembang sangat pesat."',
            laugh: 12,
            crowd: 'Hadirin menunggu inti sindirannya.',
            best: false
          },
          {
            line: '"Kuda juga bisa berlari cepat kalau terlatih."',
            laugh: 14,
            crowd: 'Beberapa orang mengangkat alis bingung.',
            best: false
          }
        ]
      },
      {
        beat: '3. Penutup',
        prompt: 'Tutup dengan kalimat ringkas yang mengena:',
        options: [
          {
            line: '"Ironinya sederhana: alat kirim kita sudah melesat secepat cahaya, tapi kebiasaan memeriksa sumber masih berjalan pelan seperti kereta kehabisan batu bara."',
            laugh: 35,
            crowd: 'Tepuk tangan hangat mengisi seluruh salon.',
            best: true
          },
          {
            line: '"Jadi mari kita bijak dalam bermedia sosial."',
            laugh: 13,
            crowd: 'Terdengar seperti spanduk imbauan biasa.',
            best: false
          },
          {
            line: '"Sebaiknya kita tidak percaya pada siapa pun."',
            laugh: 12,
            crowd: 'Agak terlalu sinis tanpa pijakan.',
            best: false
          }
        ]
      }
    ]
  },
  {
    id: 'su-02',
    title: 'Sandi Julius Caesar sampai Passkey Modern',
    eraTag: 'Sejarah · Keamanan Siber',
    steps: [
      {
        beat: '1. Pembuka',
        prompt: 'Mulai dengan pengamatan ringan tentang kriptografi klasik:',
        options: [
          {
            line: '"Julius Caesar menggeser huruf untuk menyandikan surat perang karena di tahun 50 SM memang belum ada tombol lupa kata sandi."',
            laugh: 35,
            crowd: 'Beberapa hadirin tertawa kecil mendengar pembukaannya.',
            best: true
          },
          {
            line: '"Caesar Cipher adalah metode enkripsi substitusi paling awal."',
            laugh: 10,
            crowd: 'Terasa seperti catatan kuliah pengantar.',
            best: false
          },
          {
            line: '"Kata sandi sebaiknya panjang dan sulit ditebak."',
            laugh: 12,
            crowd: 'Benar, tapi terlalu normatif untuk panggung satir.',
            best: false
          }
        ]
      },
      {
        beat: '2. Belokan',
        prompt: 'Sentil kebiasaan manusia modern yang masih rapuh:',
        options: [
          {
            line: '"Dua ribu tahun berlalu, komputer makin canggih, tapi sandi favorit umat manusia masih saja 123456 atau tanggal lahir. Padahal secara linimasa, Kleopatra saja lebih dekat ke ponsel pintar daripada ke Piramida Giza."',
            laugh: 35,
            crowd: 'Tawa ringan menyebar di seluruh meja.',
            best: true
          },
          {
            line: '"Untungnya kini tersedia berbagai aplikasi pengelola kata sandi."',
            laugh: 12,
            crowd: 'Terlalu datar untuk sebuah belokan komedi.',
            best: false
          },
          {
            line: '"Kerajaan Romawi memiliki banyak jalan raya yang awet."',
            laugh: 11,
            crowd: 'Topiknya melenceng terlalu jauh.',
            best: false
          }
        ]
      },
      {
        beat: '3. Penutup',
        prompt: 'Tutup dengan referensi FIDO2 / Passkey:',
        options: [
          {
            line: '"Itu sebabnya Passkey FIDO2 dibuat: bukan karena manusia mendadak disiplin, melainkan supaya sistemnya sendiri yang menolak sopan begitu melihat alamat situs palsu."',
            laugh: 35,
            crowd: 'Tepuk tangan rapi dan senyum puas dari hadirin.',
            best: true
          },
          {
            line: '"Mari kita tingkatkan kesadaran keamanan digital bersama."',
            laugh: 13,
            crowd: 'Terlalu mirip penutup presentasi kantor.',
            best: false
          },
          {
            line: '"Lebih aman menyimpan catatan di bawah bantal."',
            laugh: 15,
            crowd: 'Lumayan ringan, tapi kurang tajam.',
            best: false
          }
        ]
      }
    ]
  },
  {
    id: 'su-03',
    title: 'Eufemisme Rapat dan Kemiskinan Diksi',
    eraTag: 'Bahasa · Diksi Rasa',
    steps: [
      {
        beat: '1. Pembuka',
        prompt: 'Buka sindiran halus tentang kebiasaan jargon dan penyempitan kosakata:',
        options: [
          {
            line: '"Menarik melihat dua kutub bahasa kita hari ini: di rapat, kalimat sederhana dipanjangkan pakai jargon; sementara untuk perasaan sendiri, semua rasa sedih diringkas cuma jadi satu kata: galau."',
            laugh: 35,
            crowd: 'Hadirin mengangguk dan terkekeh pelan.',
            best: true
          },
          {
            line: '"Jargon korporat sering membuat komunikasi kurang efektif."',
            laugh: 10,
            crowd: 'Terlalu kaku untuk pembukaan salon.',
            best: false
          },
          {
            line: '"Bahasa Indonesia memiliki banyak kosakata di kamus."',
            laugh: 12,
            crowd: 'Benar, tapi belum memancing rasa ingin tahu.',
            best: false
          }
        ]
      },
      {
        beat: '2. Belokan',
        prompt: 'Bandingkan eufemisme kantor dengan kekayaan diksi emosi:',
        options: [
          {
            line: '"Gaji tidak naik disebut penyesuaian kelincahan fiskal. Sementara bahasa kita yang punya terpukul, pilu, sayu, sampai nelangsa malah jarang dipakai karena dianggap terlalu puitis."',
            laugh: 35,
            crowd: 'Tawa dan gumaman setuju terdengar dari sudut ruangan.',
            best: true
          },
          {
            line: '"Oleh karena itu penting membaca KBBI dan EYD V."',
            laugh: 12,
            crowd: 'Terlalu formal seperti pengumuman kelas.',
            best: false
          },
          {
            line: '"Kata panjang kadang terdengar cukup meyakinkan."',
            laugh: 11,
            crowd: 'Kurang menggigit.',
            best: false
          }
        ]
      },
      {
        beat: '3. Penutup',
        prompt: 'Tutup dengan kalimat yang jernih dan tajam:',
        options: [
          {
            line: '"Aturan praktisnya sederhana: kalau satu ide butuh tiga lapis eufemisme untuk dijelaskan, biasanya cuma ada dua kemungkinan. Entah pembicaranya sedang menghindar, atau anggarannya baru dipotong."',
            laugh: 35,
            crowd: 'Tepuk tangan hangat menyambut penutup yang presisi.',
            best: true
          },
          {
            line: '"Semoga rapat ke depan lebih singkat dan jelas."',
            laugh: 13,
            crowd: 'Sopan, tapi kurang berkesan.',
            best: false
          },
          {
            line: '"Terima kasih atas perhatian hadirin sekalian."',
            laugh: 10,
            crowd: 'Berakhir terlalu mendadak.',
            best: false
          }
        ]
      }
    ]
  },
  {
    id: 'su-04',
    title: 'Big Brother Orwell Bertemu Layar Saku Modern',
    eraTag: 'Sastra Orwell · Privasi',
    steps: [
      {
        beat: '1. Pembuka',
        prompt: 'Bandingkan novel 1984 dengan kebiasaan membawa layar ke mana-mana:',
        options: [
          {
            line: '"Tahun 1949, George Orwell membayangkan masa depan kelam ketika warga dipaksa memasang Telescreen di dinding. Ternyata prediksinya meleset tipis: kita tidak perlu dipaksa, kita antre membelinya sendiri dan mengisi dayanya tiap malam."',
            laugh: 35,
            crowd: 'Tawa kering mengalir hangat di seluruh ruangan.',
            best: true
          },
          {
            line: '"Novel 1984 karya George Orwell membahas sistem pengawasan."',
            laugh: 10,
            crowd: 'Terdengar seperti paragraf pembuka resensi.',
            best: false
          },
          {
            line: '"Ponsel modern punya kamera dan mikrofon yang canggih."',
            laugh: 12,
            crowd: 'Fakta biasa tanpa sudut ironi.',
            best: false
          }
        ]
      },
      {
        beat: '2. Belokan',
        prompt: 'Hubungkan Orwell dengan Huxley secara ringkas:',
        options: [
          {
            line: '"Orwell khawatir buku dilarang; Aldous Huxley khawatir kita sendiri yang berhenti membaca karena terlalu nyaman menggulir layar. Hasil akhirnya mirip, cuma kemasannya lebih pastel."',
            laugh: 35,
            crowd: 'Hadirin tersenyum lebar mendengar perbandingan itu.',
            best: true
          },
          {
            line: '"Aldous Huxley adalah penulis Brave New World tahun 1932."',
            laugh: 11,
            crowd: 'Terlalu ensiklopedis.',
            best: false
          },
          {
            line: '"Membaca buku cetak memang lebih nyaman di mata."',
            laugh: 14,
            crowd: 'Cukup benar, tapi kurang tajam.',
            best: false
          }
        ]
      },
      {
        beat: '3. Penutup',
        prompt: 'Tutup dengan sentilan kering soal literasi dan keamanan:',
        options: [
          {
            line: '"Jadi menjaga privasi dan memperkaya kosakata itu semacam perlawanan tenang. Kalaupun suatu hari ada yang mengintip catatan kita, setidaknya mereka ikut pusing membaca diksi yang rapi."',
            laugh: 35,
            crowd: 'Tepuk tangan penuh apresiasi menutup panggung.',
            best: true
          },
          {
            line: '"Mari kita lebih rajin membaca karya klasik setiap pekan."',
            laugh: 13,
            crowd: 'Terlalu normatif.',
            best: false
          },
          {
            line: '"Demikian catatan saya mengenai Orwell."',
            laugh: 10,
            crowd: 'Kurang punchline penutup.',
            best: false
          }
        ]
      }
    ]
  },
  {
    id: 'su-05',
    title: 'Batas 150 Dunbar, Integritas, dan Bukti Terlalu Rapi',
    eraTag: 'Psikologi · Deduksi',
    steps: [
      {
        beat: '1. Pembuka',
        prompt: 'Buka dengan pengamatan kering soal batas relasi manusia:',
        options: [
          {
            line: '"Robin Dunbar menyebut batas kognitif manusia itu 150 hubungan bermakna. Buat sebagian orang yang temannya bisa dihitung jari, angka 150 itu bukan batas kapasitas, melainkan definisi keramaian."',
            laugh: 35,
            crowd: 'Tawa tenang terdengar dari beberapa meja.',
            best: true
          },
          {
            line: '"Dunbar\'s Number adalah teori antropologi dari tahun 1990."',
            laugh: 10,
            crowd: 'Terlalu datar seperti catatan kaki.',
            best: false
          },
          {
            line: '"Setiap orang punya jumlah teman yang berbeda-beda."',
            laugh: 12,
            crowd: 'Terlalu umum.',
            best: false
          }
        ]
      },
      {
        beat: '2. Belokan',
        prompt: 'Sambungkan dengan paradoks konsistensi di Keamanan Personil dan deduksi Sherlock:',
        options: [
          {
            line: '"Di keamanan sistem, manusia selalu jadi rantai terlemah. Lucunya, kalau integritas cuma diartikan sebagai konsistensi perilaku, bukankah pelaku yang konsisten melanggar juga secara teknis konsisten? Di situlah Sherlock biasanya mulai curiga saat bukti terlihat terlalu rapi."',
            laugh: 35,
            crowd: 'Hadirin tertawa kecil menangkap pelintiran logikanya.',
            best: true
          },
          {
            line: '"Faktor manusia memang penting dalam keamanan informasi."',
            laugh: 12,
            crowd: 'Benar, tapi tidak menimbulkan efek kejutan.',
            best: false
          },
          {
            line: '"Sherlock Holmes terkenal sangat teliti mengamati petunjuk."',
            laugh: 11,
            crowd: 'Belum ada sudut ironi.',
            best: false
          }
        ]
      },
      {
        beat: '3. Penutup',
        prompt: 'Tutup dengan pengamatan tentang peluang dan kesiapan:',
        options: [
          {
            line: '"Pada akhirnya tidak ada orang yang benar-benar siap seratus persen. Tapi secara peluang, kemungkinan satu persen yang dicoba seratus kali tetap memberi enam puluh tiga persen peluang berhasil. Cukup masuk akal untuk tetap melangkah."',
            laugh: 35,
            crowd: 'Tepuk tangan tenang dan hangat menutup sesi.',
            best: true
          },
          {
            line: '"Jadi kita harus terus berusaha pantang menyerah."',
            laugh: 13,
            crowd: 'Terdengar seperti kutipan poster biasa.',
            best: false
          },
          {
            line: '"Sekian pengamatan saya malam ini."',
            laugh: 10,
            crowd: 'Berakhir agak terlalu cepat.',
            best: false
          }
        ]
      }
    ]
  }
];

const OPENMIC_ERAS = [
  'Seorang pengamat abad ke-19',
  'Kurator arsip buku klasik',
  'Penumpang kereta malam lintas kota',
  'Detektif yang curiga pada bukti terlalu rapi',
  'Analis keamanan yang lelah melihat sandi lemah',
  'Editor bahasa yang membela ketepatan diksi'
];

const OPENMIC_TOPICS = [
  'menjelaskan mengapa batas 150 Dunbar terasa terlalu ramai',
  'membedakan pilu, sayu, dan nelangsa daripada sekadar bilang galau',
  'membandingkan Telescreen Orwell dengan ponsel pintar di saku sendiri',
  'membahas mengapa manusia selalu menjadi rantai terlemah keamanan siber',
  'menjelaskan Deepfake dan verifikasi C2PA kepada pembaca surat kabar 1894',
  'menguji argumen yang tampak rapi tetapi penuh sesat pikir',
  'menghitung peluang 1 persen dalam 100 percobaan hingga 63 persen'
];

const OPENMIC_WORDS = [
  { word: 'ironi', hint: 'kejadian berkebalikan dari harapan' },
  { word: 'paradoks', hint: 'tampak bertentangan namun benar adanya' },
  { word: 'eufemisme', hint: 'penghalusan kata untuk hal tidak nyaman' },
  { word: 'pragmatis', hint: 'berorientasi pada hasil praktis nyata' },
  { word: 'skeptis', hint: 'kritis dan meminta bukti terlebih dahulu' },
  { word: 'lugas', hint: 'langsung pada inti tanpa berbelit' },
  { word: 'serendipiti', hint: 'kebetulan tak terduga yang berharga' },
  { word: 'ambivalen', hint: 'memiliki dua sikap bertentangan sekaligus' },
  { word: 'artikulatif', hint: 'jelas dan runtut menyampaikan gagasan' },
  { word: 'anomali', hint: 'penyimpangan dari pola yang wajar' }
];

export function generateEndlessOpenMicPrompt() {
  const era = OPENMIC_ERAS[Math.floor(Math.random() * OPENMIC_ERAS.length)];
  const topic = OPENMIC_TOPICS[Math.floor(Math.random() * OPENMIC_TOPICS.length)];
  const shuffled = [...OPENMIC_WORDS].sort(() => Math.random() - 0.5);
  return {
    title: `${era} ${topic}.`,
    role: 'Pembicara Salon Satir 1894',
    factSpark: 'Alur 30 detik: buka dengan pengamatan singkat, selipkan dua kata kunci secara natural, lalu tutup dengan satu kalimat tajam.',
    keywords: [shuffled[0], shuffled[1]]
  };
}

export function getTodayWIBKey() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, '0');
  const d = String(wib.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildDailyCommissions(dateKey = getTodayWIBKey()) {
  return [
    {
      id: 'comm-standup',
      title: 'Selesaikan 1 Sesi Salon Satir',
      desc: 'Tampil di Salon Satir Bab I lewat mode bit atau Open-Mic.',
      goal: 1,
      xp: 80,
      coins: 65
    },
    {
      id: 'comm-combat',
      title: 'Menangkan 1 Duel Taktis',
      desc: 'Lumpuhkan ancaman di peta atau di Menara Tanpa Akhir.',
      goal: 1,
      xp: 90,
      coins: 75
    },
    {
      id: 'comm-tower',
      title: 'Taklukkan 1 Lantai Menara',
      desc: 'Naiki lantai baru di Menara Tanpa Akhir Bab I.',
      goal: 1,
      xp: 100,
      coins: 85
    },
    {
      id: 'comm-study',
      title: 'Pelajari 1 Ruang Arsip / Akademi',
      desc: 'Kunjungi Arsip Sastra, Stasiun Korea, Poliglot, Retorika, atau SOC.',
      goal: 1,
      xp: 70,
      coins: 55
    }
  ];
}
