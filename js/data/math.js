// Generator soal Segel Matematika 3 Tingkat untuk membuka wilayah baru (Level 2, 3, dan 4).
// Setiap soal menghasilkan jawaban terverifikasi secara matematis, pengecoh realistis, dan penjelasan langkah.

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
    if (!unique.has(w) && Number.isFinite(w)) {
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

// ==========================================
// LEVEL 1 SEAL (Buka Zona 2: Kota Bahasa)
// ==========================================
function genLevel1OrderOfOps() {
  const a = randInt(6, 18);
  const b = randInt(3, 9);
  const c = randInt(2, 6);
  const ans = a + b * c;
  const trap = (a + b) * c;
  return {
    tag: 'Urutan Operasi',
    question: `Hitung nilai yang tepat: ${a} + ${b} × ${c} = ?`,
    choices: makeChoices(ans, [trap, ans + c, ans - b]),
    explain: `Perkalian dikerjakan lebih dulu: ${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${ans}.`
  };
}

function genLevel1Discount() {
  const baseThousands = randInt(2, 9) * 10; // 20k .. 90k
  const price = baseThousands * 1000;
  const percents = [10, 20, 25, 50];
  const pct = percents[randInt(0, percents.length - 1)];
  const discount = (price * pct) / 100;
  const ans = price - discount;
  const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
  return {
    tag: 'Persentase Warkop',
    question: `Paket kopi dan roti bakar seharga ${fmt(price)} sedang diskon ${pct}%. Berapa yang harus dibayar?`,
    choices: makeChoices(ans, [discount, price - pct * 1000, ans + 5000], fmt),
    explain: `Diskon ${pct}% dari ${fmt(price)} adalah ${fmt(discount)}. Jadi harga bayarnya ${fmt(price)} - ${fmt(discount)} = ${fmt(ans)}.`
  };
}

function genLevel1Sequence() {
  const start = randInt(2, 9);
  const diffStart = randInt(2, 4);
  // Pola selisih bertambah 1 tiap langkah: +d, +(d+1), +(d+2), +(d+3)
  const s1 = start;
  const s2 = s1 + diffStart;
  const s3 = s2 + diffStart + 1;
  const s4 = s3 + diffStart + 2;
  const ans = s4 + diffStart + 3;
  return {
    tag: 'Pola Bilangan',
    question: `Lanjutkan deret rune berikut: ${s1}, ${s2}, ${s3}, ${s4}, ...`,
    choices: makeChoices(ans, [ans - 1, ans + 2, s4 + diffStart]),
    explain: `Selisih antarangka bertambah 1 tiap langkah (+${diffStart}, +${diffStart + 1}, +${diffStart + 2}, lalu +${diffStart + 3}). Jadi ${s4} + ${diffStart + 3} = ${ans}.`
  };
}

// ==========================================
// LEVEL 2 SEAL (Buka Zona 3: Lembah Logika)
// ==========================================
function genLevel2LinearEq() {
  const a = randInt(2, 6);
  const x = randInt(4, 14);
  const b = randInt(3, 15);
  const rhs = a * x + b;
  return {
    tag: 'Aljabar Linear',
    question: `Jika ${a}x + ${b} = ${rhs}, berapakah nilai x?`,
    choices: makeChoices(x, [x + 2, Math.max(1, x - 2), Math.round((rhs + b) / a)]),
    explain: `Kurangi kedua ruas dengan ${b}: ${a}x = ${rhs - b}. Lalu bagi ${a}, maka x = ${x}.`
  };
}

function genLevel2Ratio() {
  const rA = randInt(2, 5);
  let rB = randInt(2, 6);
  if (rA === rB) rB += 1;
  const mult = randInt(15, 40);
  const kopi = rA * mult;
  const ans = rB * mult;
  return {
    tag: 'Rasio & Perbandingan',
    question: `Resep es kopi susu memakai rasio kopi : susu sebesar ${rA} : ${rB}. Jika kopi yang dituang ${kopi} ml, berapa ml susu yang dibutuhkan?`,
    choices: makeChoices(ans, [ans + mult, Math.max(10, ans - mult), rA * rB * 10], (v) => `${v} ml`),
    explain: `Satu bagian bernilai ${kopi} ÷ ${rA} = ${mult} ml. Maka susu (${rB} bagian) = ${rB} × ${mult} = ${ans} ml.`
  };
}

function genLevel2TriangleAngle() {
  const a = randInt(35, 75);
  const b = randInt(35, 75);
  const ans = 180 - a - b;
  return {
    tag: 'Geometri Sudut',
    question: `Sebuah kristal segitiga punya dua sudut berukuran ${a}° dan ${b}°. Berapa besar sudut ketiganya?`,
    choices: makeChoices(ans, [90 - Math.abs(a - b), ans + 10, Math.max(10, ans - 15)], (v) => `${v}°`),
    explain: `Jumlah ketiga sudut segitiga selalu 180°. Jadi sudut ketiga = 180° - (${a}° + ${b}°) = ${ans}°.`
  };
}

// ==========================================
// LEVEL 3 SEAL (Buka Zona 4: Puncak Orator)
// ==========================================
function genLevel3SpeedTime() {
  const speed = randInt(4, 9) * 10; // 40..90 km/jam
  const halfHours = [3, 5, 7][randInt(0, 2)]; // 1.5, 2.5, 3.5 jam
  const hoursLabel = `${(halfHours / 2).toFixed(1).replace('.', ',')} jam`;
  const ans = (speed * halfHours) / 2;
  return {
    tag: 'Jarak & Kecepatan',
    question: `Kereta cepat melaju dengan kecepatan tetap ${speed} km/jam selama ${hoursLabel}. Berapa total jarak yang ditempuh?`,
    choices: makeChoices(ans, [ans + speed / 2, ans - 20, speed * Math.floor(halfHours / 2)], (v) => `${v} km`),
    explain: `Jarak = kecepatan × waktu = ${speed} × ${hoursLabel.replace(' jam', '')} = ${ans} km.`
  };
}

function genLevel3TwoVars() {
  const kopi = randInt(5, 11) * 1000;
  const roti = randInt(3, 8) * 1000;
  const total1 = 2 * kopi + roti;
  const total2 = kopi + roti;
  const fmt = (v) => `Rp${v.toLocaleString('id-ID')}`;
  return {
    tag: 'Sistem Persamaan',
    question: `Di Warkop: 2 kopi + 1 roti bakar = ${fmt(total1)}, sedangkan 1 kopi + 1 roti bakar = ${fmt(total2)}. Berapa harga 1 kopi?`,
    choices: makeChoices(kopi, [roti, kopi + 2000, Math.max(2000, kopi - 2000)], fmt),
    explain: `Selisih kedua pesanan tepat 1 gelas kopi: ${fmt(total1)} - ${fmt(total2)} = ${fmt(kopi)}.`
  };
}

function genLevel3Combinatorics() {
  const topi = randInt(3, 5);
  const jaket = randInt(3, 6);
  const sepatu = randInt(2, 3);
  const ans = topi * jaket * sepatu;
  return {
    tag: 'Kombinasi Panggung',
    question: `Untuk naik panggung, kamu punya ${topi} topi, ${jaket} jaket, dan ${sepatu} pasang sepatu. Ada berapa kombinasi gaya berbeda yang bisa dipilih?`,
    choices: makeChoices(ans, [topi + jaket + sepatu, topi * jaket, ans + jaket], (v) => `${v} gaya`),
    explain: `Aturan perkalian kombinatorika: ${topi} × ${jaket} × ${sepatu} = ${ans} kombinasi berbeda.`
  };
}

export function generateMathQuestion(level, slotIndex = 0) {
  const byLevel = {
    1: [genLevel1OrderOfOps, genLevel1Discount, genLevel1Sequence],
    2: [genLevel2LinearEq, genLevel2Ratio, genLevel2TriangleAngle],
    3: [genLevel3SpeedTime, genLevel3TwoVars, genLevel3Combinatorics]
  };
  const generators = byLevel[level] || byLevel[1];
  const fn = generators[slotIndex % generators.length];
  return fn();
}

export const GATE_META = {
  1: {
    id: 'gate-1',
    name: 'Segel Jembatan Bahasa',
    unlocksZone: 'Kota Bahasa',
    unlocksLevel: 2,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Aritmetika & Pola untuk membuka jembatan menuju Kota Bahasa (Level 2)!'
  },
  2: {
    id: 'gate-2',
    name: 'Segel Kristal Logika',
    unlocksZone: 'Lembah Logika',
    unlocksLevel: 3,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Aljabar & Geometri untuk membuka gerbang menuju Lembah Logika (Level 3)!'
  },
  3: {
    id: 'gate-3',
    name: 'Obelisk Puncak Orator',
    unlocksZone: 'Puncak Orator',
    unlocksLevel: 4,
    requiredRunes: 3,
    flavor: 'Pecahkan 3 Rune Matematika Cerita & Kombinasi untuk naik ke Puncak Amfiteater Orator (Level 4)!'
  }
};
