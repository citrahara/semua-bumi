// Narator dan teman obrolan 100% offline: Bus Damri ("Saya") yang ikut berkeliling bumi bersama Beliau dan ikan julung-julung.
// Tidak memerlukan API key AI, gaya bahasa tenang, hangat, informatif, dan bebas basa-basi berlebihan.

import { WORLD_COUNTRIES } from './world_atlas.js';
import { ATLAS_PIN_ROUNDS, TIMELINE_DUELS } from './atlas_data.js';

let recCursor = 0;
let factCursor = 0;

export const BUS_QUICK_PROMPTS = [
  { id: 'current', label: 'Cerita titik ini' },
  { id: 'next-stop', label: 'Saran tujuan' },
  { id: 'culture', label: 'Buku & film' },
  { id: 'summon', label: 'Ajak melintas' }
];

function findMentionedCountry(lowerText) {
  for (let i = 0; i < WORLD_COUNTRIES.length; i++) {
    const c = WORLD_COUNTRIES[i];
    if (lowerText.includes(c.name.toLowerCase())) return c;
    if (c.capital && lowerText.includes(c.capital.toLowerCase())) return c;
  }
  if (lowerText.includes('amerika')) return WORLD_COUNTRIES.find((c) => c.code === 'us');
  if (lowerText.includes('korea selatan') || lowerText === 'korea') return WORLD_COUNTRIES.find((c) => c.code === 'kr');
  if (lowerText.includes('selandia')) return WORLD_COUNTRIES.find((c) => c.code === 'nz');
  if (lowerText.includes('arab')) return WORLD_COUNTRIES.find((c) => c.code === 'sa');
  if (lowerText.includes('uea') || lowerText.includes('dubai')) return WORLD_COUNTRIES.find((c) => c.code === 'ae');
  if (lowerText.includes('vatikan')) return WORLD_COUNTRIES.find((c) => c.code === 'va');
  if (lowerText.includes('palestina')) return WORLD_COUNTRIES.find((c) => c.code === 'ps');
  if (lowerText.includes('kongo')) return WORLD_COUNTRIES.find((c) => c.code === 'cd');
  return null;
}

export function getBusContextNote(context = {}) {
  const { activeMode, activeCountry, activeRound, revealed, busLocation } = context;

  if (activeMode === 'explore' && activeCountry) {
    return `${activeCountry.name}: ${activeCountry.busNote} Hasil bumi andalannya antara lain ${activeCountry.sda[0].toLowerCase()}.`;
  }

  if (activeRound) {
    if (revealed && activeRound.ramyeonMore) {
      return `Catatan lanjutan dari perjalanan saya: ${activeRound.ramyeonMore}`;
    }
    if (!revealed && activeRound.ramyeonHint) {
      return `Petunjuk rute dari kaca depan saya: ${activeRound.ramyeonHint}`;
    }
  }

  const locText = busLocation && busLocation.placeLabel ? busLocation.placeLabel : 'atas samudra';
  return `Saat ini saya sedang melintas di atas ${locText}. Ketuk label negara mana saja di bola bumi supaya Beliau, kawanan ikan julung-julung, dan saya bisa membedah isi negerinya bersama kamu.`;
}

export function pickNextCountrySuggestion(visitedIds = [], currentId = null) {
  const visitedSet = new Set(visitedIds);
  const unvisited = WORLD_COUNTRIES.filter((c) => !visitedSet.has(c.id) && c.id !== currentId);
  const pool = unvisited.length ? unvisited : WORLD_COUNTRIES.filter((c) => c.id !== currentId);
  if (!pool.length) return WORLD_COUNTRIES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function replyFromBusDamri(userText, context = {}) {
  const clean = (userText || '').trim();
  const lower = clean.toLowerCase();
  const {
    activeMode = 'explore',
    activeCountry = null,
    activeRound = null,
    revealed = false,
    visitedCountryIds = [],
    busLocation = null
  } = context;

  // 1. Jika pemain menyebut nama negara tertentu, bahas langsung negara itu
  const mentioned = findMentionedCountry(lower);
  if (mentioned) {
    if (/(sda|hasil bumi|tambang|ekspor|sumber daya|alam|komoditas)/.test(lower)) {
      return `Di ${mentioned.name}, hasil bumi dan sumber daya utamanya meliputi ${mentioned.sda.join('; ')}.`;
    }
    if (/(buku|novel|sastra|baca)/.test(lower)) {
      return `Dari ${mentioned.name}, saya sarankan melihat ${mentioned.book.title}. ${mentioned.book.note}`;
    }
    if (/(film|sinema|nonton|bioskop)/.test(lower)) {
      return `Untuk sinema ${mentioned.name}, ada ${mentioned.film.title}. ${mentioned.film.note}`;
    }
    if (/(karya|sains|teknologi|arsitektur|budaya|temuan)/.test(lower)) {
      return `Karya terkenal dari ${mentioned.name}: ${mentioned.work.title}. ${mentioned.work.note}`;
    }
    return `${mentioned.name} (${mentioned.capital}): ${mentioned.wowFact} ${mentioned.busNote}`;
  }

  // 2. Cerita tentang Beliau, ikan julung-julung, atau Bus Damri sendiri
  if (/(beliau|ikan|julung|damri|dipatiukur|leuwipanjang|bandung|siapa kamu|trayek)/.test(lower)) {
    const loc = busLocation && busLocation.placeLabel ? busLocation.placeLabel : 'langit terbuka';
    return `Dulu trayek saya cuma Dipatiukur sampai Leuwipanjang di Bandung. Sejak Beliau naik bersama kawanan ikan julung-julung terbang di atas kepalanya, saya ikut berputar melintasi langit bumi. Sekarang saya sedang melewati ${loc}.`;
  }

  // 3. Minta petunjuk tantangan atau cerita titik aktif
  if (/(cerita titik|negeri ini|petunjuk|hint|clue|saran tantangan|bingung|bantu)/.test(lower)) {
    return getBusContextNote(context);
  }

  // 4. Tanya hasil bumi / SDA negara aktif
  if (/(sda|hasil bumi|tambang|sumber daya|komoditas|ekspor)/.test(lower)) {
    const target = activeCountry || WORLD_COUNTRIES[recCursor % WORLD_COUNTRIES.length];
    return `Untuk ${target.name}, hasil bumi utamanya: ${target.sda.join('; ')}. Kamu bisa mengetuk tab Hasil Bumi di kartu bawah untuk membaca ringkasannya.`;
  }

  // 5. Rekomendasi buku
  if (/(buku|novel|sastra|bacaan|baca)/.test(lower)) {
    const target = activeCountry && !/(lain|beda|acak)/.test(lower)
      ? activeCountry
      : WORLD_COUNTRIES[recCursor++ % WORLD_COUNTRIES.length];
    recCursor += 1;
    return `Catatan buku dari ${target.name}: ${target.book.title}. ${target.book.note} Sebut saja nama negara lain kalau ingin bacaan dari belahan bumi berbeda.`;
  }

  // 6. Rekomendasi film
  if (/(film|sinema|nonton|movie|bioskop)/.test(lower)) {
    const target = activeCountry && !/(lain|beda|acak)/.test(lower)
      ? activeCountry
      : WORLD_COUNTRIES[(recCursor++ * 3) % WORLD_COUNTRIES.length];
    recCursor += 1;
    return `Dari ${target.name}, kamu bisa melirik ${target.film.title}. ${target.film.note}`;
  }

  // 7. Saran tujuan berikutnya
  if (/(tujuan|ke mana|kemana|negara mana|berikutnya|jelajah|singgah)/.test(lower)) {
    const next = pickNextCountrySuggestion(visitedCountryIds, activeCountry ? activeCountry.id : null);
    return `Bagaimana kalau Beliau dan kawanan ikan terbang singgah ke ${next.name} di ${next.region}? Di sana ada ${next.sda[0].toLowerCase()}, plus kisah ${next.work.title}. Ketuk label ${next.name} di bola bumi untuk langsung mendarat.`;
  }

  // 8. Fakta tak terduga acak
  if (/(fakta|kejutan|unik|baru tahu|baru tau|cerita|wawasan|random)/.test(lower)) {
    const pool = [...WORLD_COUNTRIES, ...ATLAS_PIN_ROUNDS, ...TIMELINE_DUELS];
    const item = pool[factCursor % pool.length];
    factCursor += 5;
    return `Satu hal menarik dari perjalanan keliling bumi: ${item.wowFact}`;
  }

  // 9. Sapaan / suasana santai
  if (/^(halo|hai|hi|hey|pagi|siang|sore|malam|permisi)\b/.test(lower)) {
    const loc = busLocation && busLocation.placeLabel ? busLocation.placeLabel : 'garis khatulistiwa';
    return `Halo. Saya Bus Damri yang sedang berputar di atas ${loc}. Tanyakan saja hasil bumi, buku, film, atau karya dari negara mana pun di bola bumi.`;
  }

  if (/(capek|lelah|bosan|penat|ngantuk|hujan|istirahat)/.test(lower)) {
    return 'Kalau sedang ingin pelan, tidak perlu mengejar skor kuis. Cukup putar bumi di mode Jelajah, ikuti gerak ikan-ikan terbang bersama Beliau, dan ketuk satu negara yang menarik perhatianmu.';
  }

  if (/(makasih|terima kasih|thanks|sip|oke|mantap)/.test(lower)) {
    return 'Sama-sama. Kapan saja ingin tahu cerita suatu negara atau memanggil saya mendekat ke posisi Beliau, ketuk saja tombol Bus Damri.';
  }

  // 10. Respons alami yang mengarahkan ke eksplorasi bumi
  const sample = activeCountry ? activeCountry.name : 'Indonesia, Jepang, Islandia, atau Chili';
  return `Menarik juga pertanyaan soal "${clean.slice(0, 48)}". Kamu bisa menyebut langsung nama negara seperti ${sample}, menanyakan hasil bumi, buku, film, atau meminta saya memberi saran tujuan berikutnya.`;
}
