// Teman obrolan dan pemberi saran 100% offline bernama Ramyeon.
// Tidak memerlukan API key AI, gaya bahasa santai, bersih, dan langsung ke inti.

import { ATLAS_PIN_ROUNDS, TIMELINE_DUELS, getCategoryMeta } from './atlas_data.js';

const MOVIE_PICKS = [
  {
    title: 'Arrival (2016)',
    note: 'Fiksi ilmiah tentang ahli bahasa yang menerjemahkan bahasa alien, pelan tapi membuat kita memikirkan ulang cara kerja waktu dan ingatan.'
  },
  {
    title: 'The Prestige (2006)',
    note: 'Persaingan dua pesulap London abad ke-19 yang tiap detail kecil di awal film ternyata petunjuk untuk akhir cerita.'
  },
  {
    title: 'Parasite (2019)',
    note: 'Semua ruang dan tangga di rumah keluarganya dirancang dari nol sebagai metafora kelas sosial, ritmenya rapi dari awal sampai akhir.'
  },
  {
    title: 'Whiplash (2014)',
    note: 'Ketegangan guru musik dan murid drummer yang terasa seperti film laga, padahal hampir seluruh adegannya cuma di ruang latihan.'
  },
  {
    title: 'Spirited Away (2001)',
    note: 'Dibuat tanpa naskah akhir yang rampung, jadi petualangan Chihiro terasa spontan dan penuh detail kecil tentang keberanian.'
  },
  {
    title: 'Past Lives (2023)',
    note: 'Drama tenang tentang dua teman masa kecil dari Seoul yang bertemu lagi setelah dua dekade, ringan ditonton tapi membekas lama.'
  },
  {
    title: 'Ex Machina (2014)',
    note: 'Uji Turing di rumah kaca terpencil yang membahas kecerdasan buatan lewat percakapan tajam tanpa perlu banyak ledakan.'
  },
  {
    title: 'Memories of Murder (2003)',
    note: 'Kisah investigasi nyata di Korea Selatan tahun 1980-an dengan perpaduan kelam dan ironi manusia yang sangat kuat.'
  }
];

const BOOK_PICKS = [
  {
    title: 'Thinking, Fast and Slow (Daniel Kahneman)',
    note: 'Membongkar kenapa otak kita sering meleset saat menaksir angka dan risiko, cocok dibaca pelan per bab.'
  },
  {
    title: 'Bumi Manusia (Pramoedya Ananta Toer)',
    note: 'Dituturkan dulu secara lisan di Pulau Buru sebelum ditulis; kisah Minke dan Nyai Ontosoroh terasa dekat sekaligus tajam.'
  },
  {
    title: 'Sapiens (Yuval Noah Harari)',
    note: 'Merangkai sejarah uang, tulisan, dan kerja sama manusia dalam satu alur besar yang mudah dicerna.'
  },
  {
    title: 'The Demon-Haunted World (Carl Sagan)',
    note: 'Panduan berpikir kritis yang hangat tentang bagaimana membedakan fakta ilmiah dari klaim yang sekadar terdengar meyakinkan.'
  },
  {
    title: 'Invisible Women (Caroline Criado Perez)',
    note: 'Menunjukkan betapa banyak desain benda harian, dari sabuk pengaman sampai suhu kantor, dulunya hanya diukur memakai satu standar data.'
  },
  {
    title: 'Crime and Punishment (Fyodor Dostoevsky)',
    note: 'Bukan cerita detektif biasa, melainkan perjalanan psikologis paling tajam soal rasa bersalah dan pembenaran diri.'
  },
  {
    title: 'The Art of Thinking Clearly (Rolf Dobelli)',
    note: 'Bab-bab pendek 3 halaman tentang bias kognitif harian, enak dibuka kapan saja saat butuh bacaan cepat.'
  }
];

let movieCursor = 0;
let bookCursor = 0;
let factCursor = 0;

function pickNext(list, cursorName) {
  if (cursorName === 'movie') {
    const item = MOVIE_PICKS[movieCursor % MOVIE_PICKS.length];
    movieCursor += 1;
    return item;
  }
  const item = BOOK_PICKS[bookCursor % BOOK_PICKS.length];
  bookCursor += 1;
  return item;
}

function pickRandomFact(excludeId = null) {
  const pool = [...ATLAS_PIN_ROUNDS, ...TIMELINE_DUELS].filter((r) => r.id !== excludeId);
  if (!pool.length) return null;
  const item = pool[factCursor % pool.length];
  factCursor += 3;
  return item;
}

export const RAMYEON_QUICK_PROMPTS = [
  { id: 'hint', label: 'Saran ronde ini' },
  { id: 'fact', label: 'Fakta tak terduga' },
  { id: 'movie', label: 'Saran film' },
  { id: 'book', label: 'Saran buku' }
];

export function getRoundAdviceText(round, mode, revealed = false) {
  if (!round) {
    return 'Pilih dulu satu ronde di bola bumi, nanti aku bantu beri arah tanpa membocorkan jawabannya.';
  }

  if (revealed) {
    if (round.ramyeonMore) {
      return `Tambahan kecil: ${round.ramyeonMore}`;
    }
    const cat = getCategoryMeta(round.category);
    return `Fakta bidang ${cat.name} tadi sudah masuk ke koleksimu. Mau lanjut ke ronde berikutnya atau cari rekomendasi film dan buku yang searah?`;
  }

  if (round.ramyeonHint) {
    if (mode === 'pin') {
      return `Arah singkat: ${round.ramyeonHint}`;
    }
    if (mode === 'duel') {
      return `Coba cek dari sudut ini: ${round.ramyeonHint}`;
    }
    return `Kunci penghubungnya: ${round.ramyeonHint}`;
  }

  return 'Perhatikan petunjuk wilayah dan zamannya pelan-pelan, biasanya ada satu kata kunci kecil yang langsung mengarah ke lokasi.';
}

export function replyToRamyeon(userText, context = {}) {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();
  const { activeRound, activeMode, revealed, unlockedCount = 0, totalCount = 55 } = context;

  // 1. Minta saran atau petunjuk ronde aktif
  if (
    /(saran ronde|petunjuk|hint|clue|bantu|bingung|susah|di mana|dimana|tahun berapa|tebak)/.test(lower)
  ) {
    return getRoundAdviceText(activeRound, activeMode, revealed);
  }

  // 2. Rekomendasi film / tontonan
  if (/(film|nonton|movie|bioskop|tontonan|anime|series|sinema)/.test(lower)) {
    const pick = pickNext(MOVIE_PICKS, 'movie');
    return `Kalau lagi ingin tontonan yang bikin mikir sekaligus seru, coba ${pick.title}. ${pick.note} Mau judul lain yang lebih ringan atau lebih gelap?`;
  }

  // 3. Rekomendasi buku / bacaan
  if (/(buku|baca|novel|sastra|psikologi|penulis|bacaan)/.test(lower)) {
    const pick = pickNext(BOOK_PICKS, 'book');
    return `Saran bacaanku kali ini: ${pick.title}. ${pick.note} Kalau kamu lagi cari topik sejarah, sains, atau fiksi tertentu, bilang saja.`;
  }

  // 4. Fakta unik / random "Oh baru tahu"
  if (/(fakta|unik|random|baru tahu|baru tau|wawasan|cerita|menarik|seru|kejutan)/.test(lower)) {
    const item = pickRandomFact(activeRound ? activeRound.id : null);
    if (item) {
      return `Satu hal menarik: ${item.wowFact}`;
    }
  }

  // 5. Saran mode atau topik permainan
  if (/(main apa|mode apa|bidang|topik|kategori|rekomendasi|mulai)/.test(lower)) {
    return `Kamu sudah membuka ${unlockedCount} dari ${totalCount} penemuan. Kalau ingin ritme cepat, coba Duel Tahun. Kalau ingin memutar peta dan menebak wilayah, Tancap Peta paling terasa. Kamu juga bisa menyaring satu bidang saja di tombol filter kiri atas.`;
  }

  // 6. Ngobrol santai soal nama Ramyeon / makan / kopi / suasana
  if (/(ramyeon|mie|mi |lapar|makan|kopi|teh)/.test(lower)) {
    return 'Pas banget namanya Ramyeon, hangat dan paling enak ditemani obrolan santai tanpa buru-buru. Sambil lanjut putar bumi, kamu lagi ingin bahas film, buku, atau sejarah dunia?';
  }

  if (/(capek|lelah|pusing|ngantuk|penat|bosan|gabut|hujan)/.test(lower)) {
    return 'Kalau kepala lagi penuh, tidak usah ngejar skor tinggi dulu. Putar saja bola buminya pelan-pelan atau main mode Duel Tahun yang tinggal klik kiri atau kanan. Mau aku lempar satu fakta ringan atau saran film untuk jeda?';
  }

  if (/(makasih|terima kasih|thanks|thank you|sip|oke|ok|mantap|keren)/.test(lower)) {
    return 'Sama-sama. Kalau butuh petunjuk ronde berikutnya atau cari saran tontonan dan buku, tinggal buka aku lagi.';
  }

  if (/^(halo|hai|hi|hey|pagi|siang|sore|malam|p|oi)\b/.test(lower)) {
    return 'Halo. Aku Ramyeon. Kamu bisa tanya saran untuk ronde yang sedang aktif, minta satu fakta tak terduga, atau minta rekomendasi film dan buku.';
  }

  // 7. Pengetahuan tambahan tentang topik yang disebut
  if (/(sejarah|dunia|nusantara|indonesia)/.test(lower)) {
    return 'Sejarah itu paling asyik kalau dilihat saling beririsan, misalnya bagaimana letusan Gunung Tambora di NTB ikut memicu lahirnya novel Frankenstein di Swiss dan cikal bakal sepeda di Jerman. Coba saring bidang Sejarah di atas kalau mau lanjut ke sana.';
  }

  if (/(sains|fisika|antariksa|angkasa|luar angkasa|ai|teknologi|chip)/.test(lower)) {
    return 'Di bidang sains dan teknologi, banyak hal yang terdengar mustahil ternyata sudah berjalan di sekitar kita, dari kabel serat optik di dasar samudra sampai koreksi relativitas di GPS ponsel. Coba filter bidang Sains atau Teknologi untuk melihat titik-titiknya di peta.';
  }

  // 8. Respons balik yang natural dan tidak menggurui
  return `Menarik juga bahasan soal "${clean.slice(0, 48)}". Aku paling bisa bantu kalau kamu butuh petunjuk ronde sekarang, satu fakta tak terduga, atau saran film dan buku yang cocok buat hari ini.`;
}
