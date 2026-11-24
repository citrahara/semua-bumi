// Bank logika dan sesat pikir (16 entri ringkas).

export const FALLACIES_BANK = [
  {
    id: 'fall-01',
    fallacyName: 'Ad Hominem',
    attack: '"Kamu masih terlalu muda untuk memberi saran soal pengelolaan anggaran." Pernyataan ini mengandung sesat pikir apa?',
    options: [
      { text: 'Ad Hominem (menyerang pribadi, bukan argumennya)', correct: true },
      { text: 'Strawman (memelintir pernyataan)', correct: false },
      { text: 'Slippery Slope (lompatan sebab-akibat ekstrem)', correct: false }
    ],
    meaning: 'Ad Hominem: menyerang usia, latar belakang, atau pribadi pembicara alih-alih menanggapi isi argumennya.',
    usage: 'Uji perhitungannya, bukan siapa yang menyampaikannya.'
  },
  {
    id: 'fall-02',
    fallacyName: 'Strawman',
    attack: 'Usulan membatasi jam lembur dibalas: "Jadi kamu ingin semua orang bermalas-malasan?" Ini contoh apa?',
    options: [
      { text: 'Strawman (memelintir argumen menjadi ekstrem)', correct: true },
      { text: 'Bandwagon (ikut mayoritas)', correct: false },
      { text: 'Post Hoc (kebetulan dianggap sebab)', correct: false }
    ],
    meaning: 'Strawman: memelintir pernyataan lawan menjadi versi ekstrem agar mudah diserang.',
    usage: 'Luruskan kembali pokok pernyataan sebelum melanjutkan diskusi.'
  },
  {
    id: 'fall-03',
    fallacyName: 'Whataboutism',
    attack: 'Kritik soal sampah lingkungan dijawab: "Mengapa tidak memprotes polusi pabrik besar lebih dulu?" Ini contoh apa?',
    options: [
      { text: 'Whataboutism (menangkis kritik dengan menunjuk masalah lain)', correct: true },
      { text: 'Circular Reasoning (penalaran melingkar)', correct: false },
      { text: 'False Dilemma (hanya dua pilihan)', correct: false }
    ],
    meaning: 'Whataboutism: mengalihkan kritik dengan menunjuk kesalahan pihak lain tanpa menjawab pokok persoalan.',
    usage: 'Masalah lain tetap penting, tetapi persoalan di depan mata tetap perlu diselesaikan.'
  },
  {
    id: 'fall-04',
    fallacyName: 'Slippery Slope',
    attack: '"Jika aturan diperlonggar sekali saja, seluruh sistem pasti runtuh dalam sebulan." Ini contoh apa?',
    options: [
      { text: 'Slippery Slope (rantai akibat ekstrem tanpa bukti)', correct: true },
      { text: 'Tu Quoque (menunjuk balik)', correct: false },
      { text: 'Confirmation Bias (bias konfirmasi)', correct: false }
    ],
    meaning: 'Slippery Slope: mengklaim satu langkah kecil pasti memicu bencana besar tanpa bukti hubungan sebab-akibat.',
    usage: 'Periksa setiap mata rantai akibatnya alih-alih melompat ke skenario terburuk.'
  },
  {
    id: 'fall-05',
    fallacyName: 'Bandwagon',
    attack: '"Strategi investasi ini pasti aman karena jutaan orang sedang membelinya." Ini contoh apa?',
    options: [
      { text: 'Bandwagon (menganggap populer berarti benar)', correct: true },
      { text: 'Red Herring (pengalihan isu)', correct: false },
      { text: 'Ad Hominem (menyerang pribadi)', correct: false }
    ],
    meaning: 'Bandwagon: menganggap sesuatu benar atau aman semata-mata karena banyak orang melakukannya.',
    usage: 'Popularitas adalah alasan untuk meneliti lebih cermat, bukan jaminan keamanan.'
  },
  {
    id: 'fall-06',
    fallacyName: 'False Dilemma',
    attack: '"Hanya ada dua pilihan: bekerja tanpa istirahat atau hidup gagal selamanya." Ini contoh apa?',
    options: [
      { text: 'False Dilemma (memaksa dua kutub ekstrem)', correct: true },
      { text: 'Cherry Picking (memilih sebagian data)', correct: false },
      { text: 'No True Scotsman (menggeser definisi)', correct: false }
    ],
    meaning: 'False Dilemma: menyempitkan pilihan menjadi dua kutub ekstrem seolah tidak ada jalan tengah.',
    usage: 'Selalu cari opsi ketiga yang memadukan fokus kerja dan jeda terukur.'
  },
  {
    id: 'fall-07',
    fallacyName: 'Post Hoc',
    attack: '"Setiap saya memakai jaket biru, hujan selalu turun. Berarti jaket ini mengundang hujan." Ini contoh apa?',
    options: [
      { text: 'Post Hoc (urutan waktu dianggap sebab-akibat)', correct: true },
      { text: 'Whataboutism (menunjuk kesalahan lain)', correct: false },
      { text: 'Strawman (memelintir argumen)', correct: false }
    ],
    meaning: 'Post Hoc Ergo Propter Hoc: menyimpulkan A menyebabkan B hanya karena A terjadi sebelum B.',
    usage: 'Dua peristiwa yang berurutan belum tentu memiliki hubungan sebab-akibat.'
  },
  {
    id: 'fall-08',
    fallacyName: 'False Appeal to Authority',
    attack: '"Suplemen ini pasti mujarab karena dipromosikan oleh aktor peraih piala film." Ini contoh apa?',
    options: [
      { text: 'False Appeal to Authority (merujuk pakar di luar bidangnya)', correct: true },
      { text: 'Sunk Cost Fallacy (terjebak biaya lalu)', correct: false },
      { text: 'False Dilemma (dua kutub ekstrem)', correct: false }
    ],
    meaning: 'False Appeal to Authority: menjadikan tokoh dari bidang lain sebagai bukti mutlak di luar keahliannya.',
    usage: 'Klaim medis perlu diperiksa lewat uji klinis dan otoritas kesehatan.'
  },
  {
    id: 'fall-09',
    fallacyName: 'Hasty Generalization',
    attack: '"Dua pengunjung dari kota X terlambat; berarti semua warga kota X tidak disiplin." Ini contoh apa?',
    options: [
      { text: 'Hasty Generalization (generalisasi dari sampel terlalu kecil)', correct: true },
      { text: 'Circular Reasoning (argumen melingkar)', correct: false },
      { text: 'Slippery Slope (lereng licin)', correct: false }
    ],
    meaning: 'Hasty Generalization: menarik kesimpulan besar mengenai seluruh kelompok dari segelintir contoh.',
    usage: 'Perilaku dua individu tidak mewakili jutaan orang.'
  },
  {
    id: 'fall-10',
    fallacyName: 'Sunk Cost Fallacy',
    attack: '"Proyek ini terus merugi, tetapi harus dilanjutkan karena kita sudah menghabiskan banyak biaya." Ini contoh apa?',
    options: [
      { text: 'Sunk Cost Fallacy (terjebak biaya yang sudah keluar)', correct: true },
      { text: 'Bandwagon (ikut mayoritas)', correct: false },
      { text: 'Red Herring (pengalihan topik)', correct: false }
    ],
    meaning: 'Sunk Cost Fallacy: mempertahankan pilihan merugikan hanya karena sudah terlanjur mengeluarkan biaya sebelumnya.',
    usage: 'Keputusan hari ini dihitung dari manfaat ke depan, bukan biaya yang tak bisa kembali.'
  },
  {
    id: 'fall-11',
    fallacyName: 'Tu Quoque',
    attack: 'Saran berhenti merokok di dekat bayi dibalas: "Kamu sendiri dulu sering begadang." Ini contoh apa?',
    options: [
      { text: 'Tu Quoque (menolak fakta dengan menunjuk kekurangan penyampainya)', correct: true },
      { text: 'Post Hoc (kebetulan dikira sebab)', correct: false },
      { text: 'Cherry Picking (pilih data sepihak)', correct: false }
    ],
    meaning: 'Tu Quoque: menolak kebenaran suatu fakta dengan menuduh si penyampai juga tidak sempurna.',
    usage: 'Risiko medis tetap berlaku terlepas dari kebiasaan masa lalu pemberi saran.'
  },
  {
    id: 'fall-12',
    fallacyName: 'Cherry Picking',
    attack: '"Bulan Juli lalu hanya hujan dua kali, jadi data perubahan iklim jangka panjang tidak benar." Ini contoh apa?',
    options: [
      { text: 'Cherry Picking (memetik satu data yang cocok sambil mengabaikan tren)', correct: true },
      { text: 'No True Scotsman (menggeser definisi)', correct: false },
      { text: 'Ad Hominem (menyerang pribadi)', correct: false }
    ],
    meaning: 'Cherry Picking: memilih hanya sebagian kecil data yang mendukung klaim sambil mengabaikan bukti utama.',
    usage: 'Bandingkan seluruh rentang data sebelum menarik kesimpulan.'
  },
  {
    id: 'fall-13',
    fallacyName: 'Red Herring',
    attack: 'Pertanyaan soal selisih laporan kas dijawab dengan keluhan soal tarif parkir. Ini contoh apa?',
    options: [
      { text: 'Red Herring (melempar topik sampingan untuk mengalihkan fokus)', correct: true },
      { text: 'False Dilemma (dua pilihan ekstrem)', correct: false },
      { text: 'Sunk Cost Fallacy (biaya lalu)', correct: false }
    ],
    meaning: 'Red Herring: mengangkat isu sampingan yang menarik emosi untuk mengalihkan perhatian dari inti pertanyaan.',
    usage: 'Catat isu sampingan itu, lalu kembalikan pembahasan ke pertanyaan semula.'
  },
  {
    id: 'fall-14',
    fallacyName: 'Circular Reasoning',
    attack: '"Aturan ini pasti adil karena setiap aturan yang dibuat panitia ini selalu adil." Ini contoh apa?',
    options: [
      { text: 'Circular Reasoning (kesimpulan dipakai sebagai bukti dirinya sendiri)', correct: true },
      { text: 'Whataboutism (menunjuk pihak lain)', correct: false },
      { text: 'Post Hoc (kebetulan)', correct: false }
    ],
    meaning: 'Circular Reasoning: memakai kesimpulan yang sama sebagai alasan untuk membuktikan kebenarannya.',
    usage: 'Minta ukuran objektif yang berdiri terpisah dari klaim awalnya.'
  },
  {
    id: 'fall-15',
    fallacyName: 'No True Scotsman',
    attack: 'Saat contoh pengecualian muncul, klaim dipertahankan dengan berkata: "Berarti dia bukan anggota sejati." Ini contoh apa?',
    options: [
      { text: 'No True Scotsman (menggeser definisi sepihak saat terbantah)', correct: true },
      { text: 'Strawman (memelintir argumen)', correct: false },
      { text: 'Bandwagon (ikut ramai)', correct: false }
    ],
    meaning: 'No True Scotsman: melindungi generalisasi dengan mengubah definisi secara sepihak setiap ada pengecualian.',
    usage: 'Tetapkan definisi yang konsisten sebelum menguji klaim.'
  },
  {
    id: 'fall-16',
    fallacyName: 'Confirmation Bias',
    attack: 'Hanya membaca artikel yang sepaham dan langsung menutup sumber yang berbeda pandangan. Ini contoh apa?',
    options: [
      { text: 'Confirmation Bias (mencari pembenaran atas keyakinan awal)', correct: true },
      { text: 'Slippery Slope (lereng licin)', correct: false },
      { text: 'Tu Quoque (menunjuk balik)', correct: false }
    ],
    meaning: 'Confirmation Bias: kecenderungan mencari dan menafsirkan informasi hanya yang menguatkan keyakinan awal.',
    usage: 'Membaca argumen tandingan terkuat membantu mengenali titik buta.'
  }
];
