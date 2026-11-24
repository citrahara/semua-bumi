// Generator soal Segel Matematika 5 Tingkat untuk membuka 5 Gerbang Wilayah (Level 2 sampai Level 6).

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeChoices(correctVal, wrongVals, format = (v) => String(v)) {
  const unique = new Set([correctVal]);
  const pool = [correctVal];
  for (const w of wrongVals) {
    if (!unique.has(w) && Number.isFinite(w) && w > 0) {
      unique.add(w);
      pool.push(w);
    }
    if (pool.length === 4) break;
  }
  let offset = 1;
  while (pool.length < 4) {
    const candidate = correctVal + offset * (offset % 2 === 0 ? 1 : -1);
    if (!unique.has(candidate) && candidate > 0) {
      unique.add(candidate);
      pool.push(candidate);
    }
    offset += 1;
  }
  return shuffle(
    pool.map((v) => ({
      label: format(v),
      correct: v === correctVal
    }))
  );
}

// LEVEL 1 (Buka Zona 2: Distrik Bahasa & Akademi)
function genL1Order() {
  const a = randInt(6, 18);
  const b = randInt(3, 9);
  const c = randInt(2, 6);
  const ans = a + b * c;
  return {
    tag: 'Urutan Operasi',
    question: `Hitung nilai yang tepat: ${a} + ${b} × ${c} = ?`,
    choices: makeChoices(ans, [(a + b) * c, ans + c, ans - b]),
    explain: `Kerjakan perkalian lebih dulu: ${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${ans}.`
  };
}

function genL1Discount() {
  const price = randInt(2, 9) * 10000;
  const pct = [10, 20, 25, 50][randInt(0, 3)];
  const disc = (price * pct) / 100;
  const ans = price - disc;
  const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
  return {
    tag: 'Persentase Warkop',
    question: `Paket kopi seharga ${fmt(price)} mendapat diskon ${pct}%. Berapa harga akhirnya?`,
    choices: makeChoices(ans, [disc, price - pct * 1000, ans + 5000], fmt),
    explain: `Diskon ${pct}% = ${fmt(disc)}, sehingga harga bayarnya ${fmt(price)} - ${fmt(disc)} = ${fmt(ans)}.`
  };
}

function genL1Sequence() {
  const s1 = randInt(2, 9);
  const d = randInt(2, 4);
  const s2 = s1 + d;
  const s3 = s2 + d + 1;
  const s4 = s3 + d + 2;
  const ans = s4 + d + 3;
  return {
    tag: 'Pola Bilangan',
    question: `Lanjutkan deret rune berikut: ${s1}, ${s2}, ${s3}, ${s4}, ...`,
    choices: makeChoices(ans, [ans - 1, ans + 2, s4 + d]),
    explain: `Selisih bertambah 1 tiap langkah (+${d}, +${d + 1}, +${d + 2}, lalu +${d + 3}). Jadi ${s4} + ${d + 3} = ${ans}.`
  };
}

// LEVEL 2 (Buka Zona 3: Distrik Siber & AI Lab)
function genL2Linear() {
  const a = randInt(2, 6);
  const x = randInt(4, 14);
  const b = randInt(3, 15);
  const rhs = a * x + b;
  return {
    tag: 'Aljabar Linear',
    question: `Jika ${a}x + ${b} = ${rhs}, berapakah nilai x?`,
    choices: makeChoices(x, [x + 2, Math.max(1, x - 2), Math.round((rhs + b) / a)]),
    explain: `Kurangi kedua ruas dengan ${b}: ${a}x = ${rhs - b}, lalu bagi ${a} sehingga x = ${x}.`
  };
}

function genL2Binary() {
  // Matematika Siber: Biner ke Desimal!
  const val = randInt(9, 29);
  const bin = val.toString(2);
  return {
    tag: 'Biner Dunia Siber',
    question: `Kode gerbang Distrik Siber tertulis dalam biner: ${bin}₂. Berapa nilainya dalam bilangan desimal?`,
    choices: makeChoices(val, [val + 2, val - 2, val + 4]),
    explain: `Ubah tiap bit 1 ke pangkat 2 dari kanan (1, 2, 4, 8, 16): ${bin}₂ = ${val}.`
  };
}

function genL2Triangle() {
  const a = randInt(35, 75);
  const b = randInt(35, 75);
  const ans = 180 - a - b;
  return {
    tag: 'Geometri Sudut',
    question: `Kristal segitiga memiliki dua sudut ${a}° dan ${b}°. Berapa besar sudut ketiganya?`,
    choices: makeChoices(ans, [ans + 10, Math.max(10, ans - 15), 90], (v) => `${v}°`),
    explain: `Total sudut segitiga selalu 180°. Sudut ketiga = 180° - (${a}° + ${b}°) = ${ans}°.`
  };
}

// LEVEL 3 (Buka Zona 4: Benteng IIV / SCADA Grid)
function genL3Ratio() {
  const rA = randInt(2, 5);
  let rB = randInt(2, 6);
  if (rA === rB) rB += 1;
  const mult = randInt(15, 40);
  const ans = rB * mult;
  return {
    tag: 'Rasio Beban Listrik',
    question: `Rasio daya Gardu A : Gardu B adalah ${rA} : ${rB}. Jika Gardu A menyuplai ${rA * mult} MW, berapa MW daya Gardu B?`,
    choices: makeChoices(ans, [ans + mult, Math.max(10, ans - mult), rA * rB * 10], (v) => `${v} MW`),
    explain: `Satu bagian bernilai ${rA * mult} ÷ ${rA} = ${mult} MW. Jadi Gardu B = ${rB} × ${mult} = ${ans} MW.`
  };
}

function genL3Speed() {
  const speed = randInt(4, 9) * 10;
  const halfHours = [3, 5, 7][randInt(0, 2)];
  const hLabel = `${(halfHours / 2).toFixed(1).replace('.', ',')} jam`;
  const ans = (speed * halfHours) / 2;
  return {
    tag: 'Kecepatan & Jarak',
    question: `Kereta patroli melaju ${speed} km/jam selama ${hLabel}. Berapa total jarak yang ditempuh?`,
    choices: makeChoices(ans, [ans + speed / 2, ans - 20, speed * Math.floor(halfHours / 2)], (v) => `${v} km`),
    explain: `Jarak = kecepatan × waktu = ${speed} × ${hLabel.replace(' jam', '')} = ${ans} km.`
  };
}

function genL3PowerOfTwo() {
  const bits = randInt(4, 7);
  const ans = Math.pow(2, bits);
  return {
    tag: 'Kriptografi & Bit',
    question: `Sebuah kunci mini sepanjang ${bits} bit (tiap bit bisa 0 atau 1) punya berapa total kemungkinan kombinasi?`,
    choices: makeChoices(ans, [bits * 2, ans / 2, ans * 2], (v) => `${v} kombinasi`),
    explain: `Setiap bit memiliki 2 pilihan, sehingga ${bits} bit menghasilkan 2^${bits} = ${ans} kombinasi.`
  };
}

// LEVEL 4 (Buka Zona 5: Lembah Logika & Debat)
function genL4TwoVars() {
  const kopi = randInt(5, 11) * 1000;
  const roti = randInt(3, 8) * 1000;
  const t1 = 2 * kopi + roti;
  const t2 = kopi + roti;
  const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
  return {
    tag: 'Sistem Persamaan',
    question: `2 kopi + 1 roti = ${fmt(t1)}, sedangkan 1 kopi + 1 roti = ${fmt(t2)}. Berapa harga 1 kopi?`,
    choices: makeChoices(kopi, [roti, kopi + 2000, Math.max(2000, kopi - 2000)], fmt),
    explain: `Selisih kedua persamaan tepat 1 kopi: ${fmt(t1)} - ${fmt(t2)} = ${fmt(kopi)}.`
  };
}

function genL4Combo() {
  const a = randInt(3, 5);
  const b = randInt(3, 6);
  const c = randInt(2, 3);
  const ans = a * b * c;
  return {
    tag: 'Kombinatorika',
    question: `Tersedia ${a} jalur firewall, ${b} gerbang autentikasi, dan ${c} server cadangan. Ada berapa jalur pertahanan berbeda?`,
    choices: makeChoices(ans, [a + b + c, a * b, ans + b], (v) => `${v} jalur`),
    explain: `Aturan perkalian: ${a} × ${b} × ${c} = ${ans} kombinasi jalur.`
  };
}

function genL4Modulo() {
  // Modulo dasar kriptografi RSA/Jam!
  const base = randInt(25, 58);
  const mod = [5, 6, 7, 8][randInt(0, 3)];
  const ans = base % mod;
  return {
    tag: 'Aritmetika Modulo',
    question: `Dalam kriptografi dipakai sisa bagi (modulo). Berapakah sisa pembagian ${base} ÷ ${mod} (${base} mod ${mod})?`,
    choices: makeChoices(ans, [(ans + 1) % mod, (ans + 2) % mod, Math.floor(base / mod)]),
    explain: `${base} = ${Math.floor(base / mod)} × ${mod} + ${ans}, jadi sisa baginya adalah ${ans}.`
  };
}

// LEVEL 5 (Buka Zona 6: Puncak Amfiteater Orator)
function genL5Probability() {
  const red = randInt(2, 5);
  const blue = randInt(3, 6);
  const total = red + blue;
  const pct = Math.round((red / total) * 100);
  // Pilih angka yang bulat persennya
  const presets = [
    { r: 3, b: 7, ans: 30 },
    { r: 2, b: 3, ans: 40 },
    { r: 3, b: 5, ans: 37.5 },
    { r: 1, b: 3, ans: 25 },
    { r: 4, b: 1, ans: 80 }
  ];
  const p = presets[randInt(0, presets.length - 1)];
  return {
    tag: 'Peluang & Persentase',
    question: `Dalam kotak ada ${p.r} token emas dan ${p.b} token perak. Jika diambil 1 acak, berapa persen peluang terambil token emas?`,
    choices: makeChoices(p.ans, [100 - p.ans, Math.round((p.r / p.b) * 100), p.r * 10], (v) => `${String(v).replace('.', ',')}%`),
    explain: `Total token = ${p.r + p.b}. Peluang token emas = (${p.r} / ${p.r + p.b}) × 100% = ${String(p.ans).replace('.', ',')}%`
  };
}

function genL5SquareDiff() {
  const a = randInt(11, 16);
  const b = randInt(4, 9);
  const ans = a * a - b * b;
  return {
    tag: 'Identitas Aljabar',
    question: `Hitung cepat dengan trik a² - b² = (a - b)(a + b): berapakah ${a}² - ${b}²?`,
    choices: makeChoices(ans, [(a - b) * (a - b), a * a + b * b, ans + 10]),
    explain: `${a}² - ${b}² = (${a} - ${b}) × (${a} + ${b}) = ${a - b} × ${a + b} = ${ans}.`
  };
}

function genL5Average() {
  const n1 = randInt(70, 84);
  const n2 = randInt(76, 88);
  const n3 = randInt(80, 92);
  const targetAvg = 85;
  const ans = targetAvg * 4 - (n1 + n2 + n3);
  return {
    tag: 'Statistika Rata-Rata',
    question: `Nilai 3 ujianmu adalah ${n1}, ${n2}, dan ${n3}. Berapa nilai ujian ke-4 agar rata-ratamu tepat ${targetAvg}?`,
    choices: makeChoices(ans, [ans - 5, ans + 5, targetAvg]),
    explain: `Total 4 ujian harus 4 × ${targetAvg} = ${targetAvg * 4}. Nilai ke-4 = ${targetAvg * 4} - (${n1} + ${n2} + ${n3}) = ${ans}.`
  };
}

export function generateMathQuestion(level, slotIndex = 0) {
  const byLevel = {
    1: [genL1Order, genL1Discount, genL1Sequence],
    2: [genL2Linear, genL2Binary, genL2Triangle],
    3: [genL3Ratio, genL3Speed, genL3PowerOfTwo],
    4: [genL4TwoVars, genL4Combo, genL4Modulo],
    5: [genL5Probability, genL5SquareDiff, genL5Average]
  };
  const generators = byLevel[level] || byLevel[1];
  return generators[slotIndex % generators.length]();
}

export const GATE_META = {
  1: {
    id: 'gate-1',
    name: 'Segel Jembatan Bahasa',
    unlocksZone: 'Distrik Bahasa & Akademi',
    unlocksLevel: 2,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Aritmetika & Pola untuk membuka jalan ke Akademi Korea, Jepang, Inggris & Balai Pustaka!'
  },
  2: {
    id: 'gate-2',
    name: 'Segel Gerbang Siber',
    unlocksZone: 'Distrik Siber & AI Lab',
    unlocksLevel: 3,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Aljabar, Biner & Geometri untuk memasuki Distrik Siber dan Radar /berita-terkini!'
  },
  3: {
    id: 'gate-3',
    name: 'Segel Gardu IIV/SCADA',
    unlocksZone: 'Benteng IIV / SCADA Grid',
    unlocksLevel: 4,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Rasio, Kecepatan & Bit Kriptografi untuk menjaga Benteng Infrastruktur Vital!'
  },
  4: {
    id: 'gate-4',
    name: 'Segel Pilar Logika',
    unlocksZone: 'Lembah Logika & Debat',
    unlocksLevel: 5,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Persamaan, Kombinatorika & Modulo untuk membuka Lembah Logika!'
  },
  5: {
    id: 'gate-5',
    name: 'Obelisk Puncak Orator',
    unlocksZone: 'Puncak Amfiteater Orator',
    unlocksLevel: 6,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Peluang, Aljabar & Statistika untuk naik ke Amfiteater Langit!'
  }
};
