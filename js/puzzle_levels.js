// Generator Level Match-3 Gardenscapes (Level 1 sampai Tak Terbatas) + Micro-Quest Pengetahuan Kilat.
// Tingkat kesulitan bervariasi (Normal, Sulit, Sangat Sulit) dengan rintangan bertahap:
// Ubin Tersegel (Quest), Kotak Kayu (1-2 lapis), Es Beku (1-2 lapis), Rantai Besi, dan Karpet Lumut.

import { FACTS_BANK } from './data/facts.js';
import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { generateMathQuestion } from './data/math.js';
import { KOREAN_ACADEMY, CYBER_LAB, CLASSIC_LIT_ACADEMY } from './data/academy.js';

export const TILE_TYPES = [
  { id: 'apple', name: 'Apel', color: '#D64545' },
  { id: 'pear', name: 'Pir', color: '#8BBF45' },
  { id: 'berry', name: 'Beri', color: '#4576C9' },
  { id: 'lemon', name: 'Lemon', color: '#E8B838' },
  { id: 'leaf', name: 'Daun Teh', color: '#399667' },
  { id: 'sakura', name: 'Sakura', color: '#E386A4' }
];

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Pola bentuk papan (8x8 atau 7x7): 1 = aktif, 0 = lubang taman
const BOARD_MASKS_8 = [
  // 0: Penuh
  [
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111'
  ],
  // 1: Sudut Terpotong (Taman Klasik)
  [
    '01111110',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '01111110'
  ],
  // 2: Air Mancur Tengah
  [
    '11111111',
    '11111111',
    '11111111',
    '11100111',
    '11100111',
    '11111111',
    '11111111',
    '11111111'
  ],
  // 3: Jam Pasir
  [
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00111100',
    '01111110',
    '11111111',
    '11111111'
  ],
  // 4: Dua Halaman Kembar
  [
    '11111111',
    '11111111',
    '11100111',
    '11111111',
    '11111111',
    '11100111',
    '11111111',
    '11111111'
  ],
  // 5: Berlian Taman
  [
    '00111100',
    '01111110',
    '11111111',
    '11111111',
    '11111111',
    '11111111',
    '01111110',
    '00111100'
  ]
];

const MASK_7_FULL = [
  '1111111',
  '1111111',
  '1111111',
  '1111111',
  '1111111',
  '1111111',
  '1111111'
];

function parseMask(rows) {
  return rows.map((r) => r.split('').map((ch) => ch === '1'));
}

function pickCells(mask, count, rng, excludeSet, filterFn = null) {
  const candidates = [];
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[r].length; c++) {
      if (!mask[r][c]) continue;
      const key = `${r},${c}`;
      if (excludeSet.has(key)) continue;
      if (filterFn && !filterFn(r, c)) continue;
      candidates.push([r, c]);
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const picked = candidates.slice(0, count);
  picked.forEach(([r, c]) => excludeSet.add(`${r},${c}`));
  return picked;
}

export function getLevelConfig(levelNum) {
  const lv = Math.max(1, Math.floor(levelNum || 1));
  const rng = seededRng(lv * 7919 + 104729);

  // Tentukan kurva kesulitan ala Gardenscapes (Normal -> Sulit -> Sangat Sulit berirama!)
  let difficulty = 'Normal';
  let starReward = 1;
  let coinReward = 60 + Math.min(120, lv * 6);
  if (lv === 4 || lv === 7 || lv === 10 || (lv > 12 && lv % 5 === 4)) {
    difficulty = 'Sulit';
    starReward = 2;
    coinReward = 110 + Math.min(160, lv * 8);
  } else if (lv === 8 || lv === 12 || (lv > 12 && lv % 6 === 0)) {
    difficulty = 'Sangat Sulit';
    starReward = 3;
    coinReward = 160 + Math.min(220, lv * 10);
  }

  // Ukuran & bentuk papan
  const isSmall = lv <= 2;
  const mask = isSmall
    ? parseMask(MASK_7_FULL)
    : parseMask(BOARD_MASKS_8[lv === 3 ? 1 : lv === 4 ? 2 : lv === 7 ? 3 : lv === 8 ? 4 : lv === 10 ? 5 : lv % BOARD_MASKS_8.length]);

  const rows = mask.length;
  const cols = mask[0].length;
  const tileCount = lv <= 2 ? 4 : lv === 8 || lv >= 12 ? (difficulty === 'Normal' ? 5 : 6) : 5;
  const activeTiles = TILE_TYPES.slice(0, tileCount).map((t) => t.id);

  const used = new Set();
  const obstacles = {
    crates: [], // { r, c, hp: 1|2 }
    ice: [],    // { r, c, hp: 1|2 }
    chains: [], // { r, c }
    moss: [],   // { r, c }
    seals: []   // { r, c } -> Ubin Tersegel (memicu 1 quest kilat saat disentuh/digeser!)
  };

  let moves = 18;
  let goals = [];
  let tip = '';

  if (lv === 1) {
    moves = 18;
    const seals = pickCells(mask, 1, rng, used, (r, c) => r >= 2 && r <= 4 && c >= 2 && c <= 4);
    obstacles.seals = seals.map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'tile', id: 'apple', count: 12, label: 'Apel' },
      { kind: 'tile', id: 'pear', count: 12, label: 'Pir' },
      { kind: 'obstacle', id: 'seal', count: 1, label: 'Segel Ilmu' }
    ];
    tip = 'Cocokkan 3 buah sama. Geser ubin emas bersegel untuk memecahkannya lewat 1 soal kilat.';
  } else if (lv === 2) {
    moves = 19;
    const crates = [
      [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]
    ].filter(([r, c]) => mask[r][c]);
    crates.forEach(([r, c]) => used.add(`${r},${c}`));
    obstacles.crates = crates.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 2, rng, used, (r) => r <= 2 || r >= 4).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'crate', count: obstacles.crates.length, label: 'Kotak Kayu' },
      { kind: 'tile', id: 'berry', count: 14, label: 'Beri' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Kotak Kayu hancur jika kamu mencocokkan buah tepat di sebelahnya atau meledakkannya dengan Bom/Roket.';
  } else if (lv === 3) {
    moves = 20;
    const ice = pickCells(mask, 8, rng, used, (r, c) => r >= 2 && r <= 5 && c >= 1 && c <= 6);
    obstacles.ice = ice.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'ice', count: ice.length, label: 'Es Beku' },
      { kind: 'tile', id: 'leaf', count: 16, label: 'Daun Teh' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Es Beku bisa dipecahkan dengan mencocokkan buah di dalamnya. Cocokkan 4 buah untuk membuat Roket.';
  } else if (lv === 4) {
    moves = 18;
    const crates = pickCells(mask, 8, rng, used, (r) => r >= 2 && r <= 5);
    obstacles.crates = crates.map(([r, c], i) => ({ r, c, hp: i < 4 ? 2 : 1 }));
    const ice = pickCells(mask, 6, rng, used);
    obstacles.ice = ice.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'crate', count: crates.length, label: 'Kotak Kayu' },
      { kind: 'obstacle', id: 'ice', count: ice.length, label: 'Es Beku' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Level Sulit (+2 Bintang): Kotak Kayu bertanda paku butuh 2 kali hantaman. Gabungkan Bom + Roket untuk sapu bersih.';
  } else if (lv === 5) {
    moves = 20;
    const chains = pickCells(mask, 7, rng, used, (r, c) => r >= 1 && r <= 6 && c >= 1 && c <= 6);
    obstacles.chains = chains.map(([r, c]) => ({ r, c }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'chain', count: chains.length, label: 'Rantai Besi' },
      { kind: 'tile', id: 'apple', count: 18, label: 'Apel' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Ubin berantai tidak bisa digeser, tapi putus begitu dicocokkan bersama dua buah sejenis.';
  } else if (lv === 6) {
    moves = 20;
    const moss = [];
    for (let r = 2; r <= 5; r++) {
      for (let c = 2; c <= 5; c++) {
        if (mask[r][c]) moss.push([r, c]);
      }
    }
    obstacles.moss = moss.map(([r, c]) => ({ r, c }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'moss', count: moss.length, label: 'Lumut Taman' },
      { kind: 'tile', id: 'lemon', count: 16, label: 'Lemon' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Karpet Lumut bersih saat buah tepat di atasnya cocok atau terkena ledakan Power-Up.';
  } else {
    // Level 7 -> tak terbatas (progresi Gardenscapes yang selalu berubah & makin tajam!)
    const isHard = difficulty === 'Sulit';
    const isSuper = difficulty === 'Sangat Sulit';
    moves = isSuper ? 19 : isHard ? 19 : 21;

    const crateCount = isSuper ? 10 : isHard ? 8 : (lv % 2 === 1 ? 6 : 0);
    const iceCount = isSuper ? 8 : (lv % 3 !== 0 ? 6 : 0);
    const chainCount = isSuper ? 6 : (lv % 2 === 0 ? 6 : 0);
    const mossCount = isSuper ? 12 : isHard ? 10 : (lv % 3 === 0 ? 12 : 0);
    const sealCount = isSuper ? 3 : 2;

    if (crateCount > 0) {
      const cells = pickCells(mask, crateCount, rng, used, (r) => r >= 1 && r <= rows - 2);
      obstacles.crates = cells.map(([r, c], idx) => ({ r, c, hp: (isSuper || (isHard && idx < 4)) ? 2 : 1 }));
      goals.push({ kind: 'obstacle', id: 'crate', count: cells.length, label: 'Kotak Kayu' });
    }
    if (iceCount > 0) {
      const cells = pickCells(mask, iceCount, rng, used);
      obstacles.ice = cells.map(([r, c], idx) => ({ r, c, hp: isSuper && idx < 3 ? 2 : 1 }));
      goals.push({ kind: 'obstacle', id: 'ice', count: cells.length, label: 'Es Beku' });
    }
    if (chainCount > 0 && goals.length < 3) {
      const cells = pickCells(mask, chainCount, rng, used);
      obstacles.chains = cells.map(([r, c]) => ({ r, c }));
      goals.push({ kind: 'obstacle', id: 'chain', count: cells.length, label: 'Rantai Besi' });
    }
    if (mossCount > 0 && goals.length < 3) {
      const mossPool = new Set(used);
      const cells = pickCells(mask, mossCount, rng, mossPool);
      obstacles.moss = cells.map(([r, c]) => ({ r, c }));
      goals.push({ kind: 'obstacle', id: 'moss', count: cells.length, label: 'Lumut Taman' });
    }

    const sealCells = pickCells(mask, sealCount, rng, used);
    obstacles.seals = sealCells.map(([r, c]) => ({ r, c }));
    goals.push({ kind: 'obstacle', id: 'seal', count: sealCells.length, label: 'Segel Ilmu' });

    if (goals.length < 3) {
      const pickTile = activeTiles[Math.floor(rng() * activeTiles.length)];
      const meta = TILE_TYPES.find((t) => t.id === pickTile);
      const need = 16 + Math.min(18, Math.floor(lv * 1.1));
      goals.unshift({ kind: 'tile', id: pickTile, count: need, label: meta ? meta.name : 'Buah' });
    }
    goals = goals.slice(0, 3);
    tip = isSuper
      ? 'Level Sangat Sulit (+3 Bintang): rangkai Bola Pelangi + Bom/Roket untuk menembus rintangan berlapis.'
      : isHard
      ? 'Level Sulit (+2 Bintang): fokus buka rintangan tengah dulu supaya ruang jatuh buah melebar.'
      : 'Rencanakan dua langkah ke depan agar bisa memicu kombinasi Power-Up beruntun.';
  }

  return {
    level: lv,
    difficulty,
    starReward,
    coinReward,
    rows,
    cols,
    mask,
    moves,
    activeTiles,
    obstacles,
    goals,
    tip
  };
}

// ==========================================
// MICRO-QUEST KILAT (UNTUK UBIN TERSEGEL, BOOSTER, +5 LANGKAH & ISI NYAWA)
// ==========================================
export function buildMicroQuest(level = 1) {
  const bucket = Math.floor(Math.random() * 7);

  // 0: Bahasa Korea (Hangul + Audio Asli!)
  if (bucket === 0) {
    const pick = KOREAN_ACADEMY.phrases[Math.floor(Math.random() * KOREAN_ACADEMY.phrases.length)];
    const distractors = shuffle(KOREAN_ACADEMY.phrases.filter((p) => p.kr !== pick.kr)).slice(0, 2);
    return {
      topic: 'Bahasa Korea',
      prompt: `Apa arti ungkapan Korea "${pick.kr}" (${pick.rom})?`,
      audioText: pick.kr,
      audioLang: 'ko-KR',
      options: shuffle([
        { label: pick.meaning, ok: true },
        ...distractors.map((d) => ({ label: d.meaning, ok: false }))
      ]),
      explain: `"${pick.kr}" (${pick.rom}) berarti "${pick.meaning}". ${pick.context}`,
      codexId: null
    };
  }

  // 1: Sastra Klasik (Orwell, Huxley, Austen, Sherlock, Bradbury, Pram)
  if (bucket === 1) {
    const pick = CLASSIC_LIT_ACADEMY.concepts[Math.floor(Math.random() * CLASSIC_LIT_ACADEMY.concepts.length)];
    const others = shuffle(CLASSIC_LIT_ACADEMY.concepts.filter((c) => c.id !== pick.id)).slice(0, 2);
    return {
      topic: 'Sastra Klasik',
      prompt: `${pick.summary} Gagasan ini merujuk pada konsep apa?`,
      options: shuffle([
        { label: `${pick.title.split('(')[0].trim()} (${pick.author.split('·')[0].trim()})`, ok: true },
        ...others.map((o) => ({ label: `${o.title.split('(')[0].trim()} (${o.author.split('·')[0].trim()})`, ok: false }))
      ]),
      explain: `${pick.author}: ${pick.modernLink}`,
      codexId: pick.id
    };
  }

  // 2: Diksi & KBBI VI
  if (bucket === 2) {
    const d = DICTION_BANK[Math.floor(Math.random() * DICTION_BANK.length)];
    const explain = d.meaning.toLowerCase().startsWith(d.term.toLowerCase())
      ? d.meaning
      : `${d.term}: ${d.meaning}`;
    return {
      topic: 'Diksi & KBBI',
      prompt: d.prompt,
      options: shuffle(d.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain,
      codexId: d.id
    };
  }

  // 3: Keamanan Siber & /berita-terkini
  if (bucket === 3) {
    const pick = CYBER_LAB.breakthroughs[Math.floor(Math.random() * CYBER_LAB.breakthroughs.length)];
    const others = shuffle(CYBER_LAB.breakthroughs.filter((c) => c.id !== pick.id)).slice(0, 2);
    return {
      topic: 'Keamanan Siber',
      prompt: `${pick.summary} Teknologi/konsep keamanan siber mana yang dimaksud?`,
      options: shuffle([
        { label: pick.title, ok: true },
        ...others.map((o) => ({ label: o.title, ok: false }))
      ]),
      explain: `${pick.whyMatters}`,
      codexId: pick.id
    };
  }

  // 4: Fakta vs Mitos
  if (bucket === 4) {
    const f = FACTS_BANK[Math.floor(Math.random() * FACTS_BANK.length)];
    return {
      topic: `Fakta · ${f.category}`,
      prompt: `Benar atau keliru pernyataan ini? "${f.statement}"`,
      options: [
        { label: 'Fakta Sahih', ok: f.isFact },
        { label: 'Mitos / Keliru', ok: !f.isFact }
      ],
      explain: f.punchline,
      codexId: f.id
    };
  }

  // 5: Logika & Sesat Pikir
  if (bucket === 5) {
    const fl = FALLACIES_BANK[Math.floor(Math.random() * FALLACIES_BANK.length)];
    const explain = fl.meaning.toLowerCase().startsWith(fl.fallacyName.toLowerCase())
      ? fl.meaning
      : `${fl.fallacyName}: ${fl.meaning}`;
    return {
      topic: 'Logika & Deduksi',
      prompt: fl.attack,
      options: shuffle(fl.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain,
      codexId: fl.id
    };
  }

  // 6: Matematika Kilat (meningkat mengikuti level!)
  const tier = Math.min(5, Math.max(1, Math.ceil(level / 3)));
  const mq = generateMathQuestion(tier, Math.floor(Math.random() * 3));
  return {
    topic: `Matematika · ${mq.tag}`,
    prompt: mq.question,
    options: mq.choices.map((c) => ({ label: c.label, ok: Boolean(c.correct) })),
    explain: mq.explain,
    codexId: null
  };
}
