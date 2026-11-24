// Progresi level Match-3 bertahap ala Gardenscapes: mulai kecil 5x5 (Level 1) lalu melebar sampai 8x8 (Level 10 -> tak terbatas).
// Micro-Quest ringkas muncul saat membuka Segel Ilmu, booster gratis, +5 Langkah, atau isi nyawa.

import { KOREAN_ACADEMY, CYBER_LAB, CLASSIC_LIT_ACADEMY } from './data/academy.js';
import { DICTION_BANK } from './data/diction.js';
import { FACTS_BANK } from './data/facts.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { generateMathQuestion } from './data/math.js';

export const TILE_TYPES = [
  { id: 'apple', name: 'Apel', color: '#D93B3B', img: './assets/tiles/apple.png' },
  { id: 'pear', name: 'Pir', color: '#8BBF45', img: './assets/tiles/pear.png' },
  { id: 'berry', name: 'Beri', color: '#3F65C7', img: './assets/tiles/berry.png' },
  { id: 'lemon', name: 'Lemon', color: '#E8B828', img: './assets/tiles/lemon.png' },
  { id: 'leaf', name: 'Daun', color: '#2F9459', img: './assets/tiles/leaf.png' },
  { id: 'sakura', name: 'Sakura', color: '#EA8BA6', img: './assets/tiles/sakura.png' }
];

export const POWER_IMAGES = {
  rocket_h: './assets/tiles/rocket.png',
  rocket_v: './assets/tiles/rocket.png',
  bomb: './assets/tiles/bomb.png',
  rainbow: './assets/tiles/rainbow.png'
};

function makeRng(seed) {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildMask(rows, cols, shape) {
  const mask = Array.from({ length: rows }, () => Array(cols).fill(true));
  if (shape === 'diamond' && rows >= 6 && cols >= 6) {
    mask[0][0] = false;
    mask[0][cols - 1] = false;
    mask[rows - 1][0] = false;
    mask[rows - 1][cols - 1] = false;
  } else if (shape === 'pillars' && rows >= 7 && cols >= 7) {
    const mr = Math.floor(rows / 2);
    mask[mr][0] = false;
    mask[mr][cols - 1] = false;
    mask[0][Math.floor(cols / 2)] = false;
  } else if (shape === 'hourglass' && rows >= 7 && cols >= 7) {
    const mr = Math.floor(rows / 2);
    mask[mr][0] = false;
    mask[mr][cols - 1] = false;
    if (mr - 1 > 0) {
      mask[mr - 1][0] = false;
      mask[mr - 1][cols - 1] = false;
    }
  } else if (shape === 'courtyard' && rows >= 8 && cols >= 8) {
    mask[0][0] = false;
    mask[0][cols - 1] = false;
    mask[rows - 1][0] = false;
    mask[rows - 1][cols - 1] = false;
    mask[3][3] = false;
    mask[4][4] = false;
  }
  return mask;
}

function pickCells(mask, count, rng, excludedSet, filterFn = null) {
  const rows = mask.length;
  const cols = mask[0].length;
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (!mask[r][c] || excludedSet.has(key)) continue;
      if (filterFn && !filterFn(r, c)) continue;
      candidates.push([r, c]);
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const picked = candidates.slice(0, count);
  picked.forEach(([r, c]) => excludedSet.add(`${r},${c}`));
  return picked;
}

export function getLevelDifficulty(level) {
  if (level >= 10 && level % 10 === 0) return 'Sangat Sulit';
  if (level >= 4 && level % 4 === 0) return 'Sulit';
  return 'Normal';
}

export function getLevelConfig(level) {
  const lv = Math.max(1, Math.floor(level));
  const rng = makeRng(lv * 97 + 41);
  const difficulty = getLevelDifficulty(lv);
  const starReward = difficulty === 'Sangat Sulit' ? 3 : difficulty === 'Sulit' ? 2 : 1;
  const coinReward = difficulty === 'Sangat Sulit' ? 110 : difficulty === 'Sulit' ? 75 : 45 + Math.min(40, lv * 2);

  // Ukuran papan tumbuh bertahap dari kecil (5x5) sampai luas (8x8)
  let rows = 5;
  let cols = 5;
  let shape = 'full';
  let tileCount = 4;

  if (lv === 1) {
    rows = 5; cols = 5; shape = 'full'; tileCount = 4;
  } else if (lv === 2) {
    rows = 5; cols = 6; shape = 'full'; tileCount = 5;
  } else if (lv === 3) {
    rows = 6; cols = 6; shape = 'full'; tileCount = 5;
  } else if (lv === 4) {
    rows = 6; cols = 6; shape = 'diamond'; tileCount = 5;
  } else if (lv === 5) {
    rows = 6; cols = 7; shape = 'full'; tileCount = 5;
  } else if (lv === 6) {
    rows = 7; cols = 7; shape = 'full'; tileCount = 5;
  } else if (lv <= 8) {
    rows = 7; cols = 7; shape = lv === 7 ? 'pillars' : 'hourglass'; tileCount = 6;
  } else if (lv === 9) {
    rows = 7; cols = 8; shape = 'diamond'; tileCount = 6;
  } else {
    const shapes = ['full', 'diamond', 'pillars', 'hourglass', 'courtyard'];
    rows = lv % 3 === 0 ? 7 : 8;
    cols = 8;
    shape = shapes[lv % shapes.length];
    tileCount = difficulty === 'Normal' ? 5 : 6;
  }

  const mask = buildMask(rows, cols, shape);
  const activeTiles = TILE_TYPES.slice(0, tileCount).map((t) => t.id);
  const used = new Set();

  const obstacles = {
    crates: [],
    ice: [],
    chains: [],
    moss: [],
    seals: []
  };

  let moves = 15;
  let goals = [];
  let tip = 'Geser atau klik dua buah bersebelahan.';

  if (lv === 1) {
    moves = 15;
    // Tempatkan 1 Segel Ilmu di tengah papan kecil 5x5 agar langsung terlihat jelas
    obstacles.seals = [{ r: 2, c: 2 }];
    used.add('2,2');
    goals = [
      { kind: 'tile', id: 'apple', count: 9, label: 'Apel' },
      { kind: 'tile', id: 'pear', count: 9, label: 'Pir' },
      { kind: 'obstacle', id: 'seal', count: 1, label: 'Segel Ilmu' }
    ];
    tip = 'Geser buah untuk mencocokkan 3 warna. Klik ubin emas untuk membuka segel.';
  } else if (lv === 2) {
    moves = 16;
    const crates = pickCells(mask, 4, rng, used, (r, c) => r >= 1 && r <= 3 && c >= 1 && c <= 4);
    obstacles.crates = crates.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 1, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'crate', count: crates.length, label: 'Kotak Kayu' },
      { kind: 'tile', id: 'berry', count: 12, label: 'Beri' },
      { kind: 'obstacle', id: 'seal', count: 1, label: 'Segel Ilmu' }
    ];
    tip = 'Cocokkan buah tepat di samping Kotak Kayu untuk memecahkannya.';
  } else if (lv === 3) {
    moves = 17;
    const ice = pickCells(mask, 5, rng, used, (r, c) => r >= 1 && r <= 4 && c >= 1 && c <= 4);
    obstacles.ice = ice.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 1, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'ice', count: ice.length, label: 'Es Beku' },
      { kind: 'tile', id: 'leaf', count: 12, label: 'Daun' },
      { kind: 'obstacle', id: 'seal', count: 1, label: 'Segel Ilmu' }
    ];
    tip = 'Pecahkan Es Beku dengan mencocokkan buah di dalamnya.';
  } else if (lv === 4) {
    moves = 18;
    const crates = pickCells(mask, 6, rng, used, (r, c) => r >= 1 && r <= 4 && c >= 1 && c <= 4);
    obstacles.crates = crates.map(([r, c], i) => ({ r, c, hp: i < 2 ? 2 : 1 }));
    const ice = pickCells(mask, 5, rng, used);
    obstacles.ice = ice.map(([r, c]) => ({ r, c, hp: 1 }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'crate', count: crates.length, label: 'Kotak Kayu' },
      { kind: 'obstacle', id: 'ice', count: ice.length, label: 'Es Beku' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Kotak bertanda 2 butuh dua hantaman. Cocokkan 4 buah untuk membuat Roket.';
  } else if (lv === 5) {
    moves = 19;
    const chains = pickCells(mask, 6, rng, used, (r, c) => r >= 1 && r <= 4 && c >= 1 && c <= 5);
    obstacles.chains = chains.map(([r, c]) => ({ r, c }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'chain', count: chains.length, label: 'Rantai' },
      { kind: 'tile', id: 'apple', count: 15, label: 'Apel' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Ubin berantai putus saat dicocokkan bersama dua buah sejenis.';
  } else if (lv === 6) {
    moves = 20;
    const moss = [];
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        if (mask[r][c]) moss.push([r, c]);
      }
    }
    obstacles.moss = moss.map(([r, c]) => ({ r, c }));
    obstacles.seals = pickCells(mask, 2, rng, used).map(([r, c]) => ({ r, c }));
    goals = [
      { kind: 'obstacle', id: 'moss', count: moss.length, label: 'Lumut' },
      { kind: 'tile', id: 'lemon', count: 15, label: 'Lemon' },
      { kind: 'obstacle', id: 'seal', count: 2, label: 'Segel Ilmu' }
    ];
    tip = 'Bersihkan Lumut dengan mencocokkan buah di atasnya.';
  } else {
    const isHard = difficulty === 'Sulit';
    const isSuper = difficulty === 'Sangat Sulit';
    moves = isSuper ? 20 : isHard ? 19 : 21;

    const crateCount = isSuper ? 10 : isHard ? 8 : (lv % 2 === 1 ? 6 : 0);
    const iceCount = isSuper ? 8 : (lv % 3 !== 0 ? 6 : 0);
    const chainCount = isSuper ? 6 : (lv % 2 === 0 ? 6 : 0);
    const mossCount = isSuper ? 12 : isHard ? 9 : (lv % 3 === 0 ? 10 : 0);
    const sealCount = isSuper ? 3 : 2;

    if (crateCount > 0) {
      const cells = pickCells(mask, crateCount, rng, used, (r) => r >= 1 && r <= rows - 2);
      obstacles.crates = cells.map(([r, c], idx) => ({ r, c, hp: (isSuper || (isHard && idx < 3)) ? 2 : 1 }));
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
      goals.push({ kind: 'obstacle', id: 'chain', count: cells.length, label: 'Rantai' });
    }
    if (mossCount > 0 && goals.length < 3) {
      const mossPool = new Set(used);
      const cells = pickCells(mask, mossCount, rng, mossPool);
      obstacles.moss = cells.map(([r, c]) => ({ r, c }));
      goals.push({ kind: 'obstacle', id: 'moss', count: cells.length, label: 'Lumut' });
    }

    const sealCells = pickCells(mask, sealCount, rng, used);
    obstacles.seals = sealCells.map(([r, c]) => ({ r, c }));
    goals.push({ kind: 'obstacle', id: 'seal', count: sealCells.length, label: 'Segel Ilmu' });

    if (goals.length < 3) {
      const pickTile = activeTiles[Math.floor(rng() * activeTiles.length)];
      const meta = TILE_TYPES.find((t) => t.id === pickTile);
      const need = 15 + Math.min(18, Math.floor(lv * 1.1));
      goals.unshift({ kind: 'tile', id: pickTile, count: need, label: meta ? meta.name : 'Buah' });
    }
    goals = goals.slice(0, 3);
    tip = isSuper
      ? 'Gabungkan Power-Up untuk menembus rintangan berlapis.'
      : 'Klik Power-Up langsung atau tukar dengan buah di sebelahnya.';
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

// Micro-Quest ringkas (tanpa duplikasi teks, tanpa basa-basi)
export function buildMicroQuest(level = 1) {
  const bucket = Math.floor(Math.random() * 7);

  if (bucket === 0) {
    const pick = KOREAN_ACADEMY.phrases[Math.floor(Math.random() * KOREAN_ACADEMY.phrases.length)];
    const distractors = shuffle(KOREAN_ACADEMY.phrases.filter((p) => p.hangul !== pick.hangul)).slice(0, 2);
    return {
      topic: 'Korea',
      prompt: `Arti "${pick.hangul}" (${pick.rom})?`,
      audioText: pick.speak || pick.hangul,
      audioLang: 'ko-KR',
      options: shuffle([
        { label: pick.meaning, ok: true },
        ...distractors.map((d) => ({ label: d.meaning, ok: false }))
      ]),
      explain: `"${pick.hangul}" berarti "${pick.meaning}".`,
      codexId: null
    };
  }

  if (bucket === 1) {
    const pick = CLASSIC_LIT_ACADEMY.concepts[Math.floor(Math.random() * CLASSIC_LIT_ACADEMY.concepts.length)];
    const others = shuffle(CLASSIC_LIT_ACADEMY.concepts.filter((c) => c.id !== pick.id)).slice(0, 2);
    return {
      topic: 'Sastra',
      prompt: `${pick.summary} Konsep mana yang dimaksud?`,
      options: shuffle([
        { label: `${pick.title.split('(')[0].trim()} (${pick.author.split('·')[0].trim()})`, ok: true },
        ...others.map((o) => ({ label: `${o.title.split('(')[0].trim()} (${o.author.split('·')[0].trim()})`, ok: false }))
      ]),
      explain: `${pick.author}: ${pick.modernLink}`,
      codexId: pick.id
    };
  }

  if (bucket === 2) {
    const d = DICTION_BANK[Math.floor(Math.random() * DICTION_BANK.length)];
    const explain = d.meaning.toLowerCase().startsWith(d.term.toLowerCase())
      ? d.meaning
      : `${d.term}: ${d.meaning}`;
    return {
      topic: 'Diksi',
      prompt: d.prompt,
      options: shuffle(d.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain,
      codexId: d.id
    };
  }

  if (bucket === 3) {
    const pick = CYBER_LAB.breakthroughs[Math.floor(Math.random() * CYBER_LAB.breakthroughs.length)];
    const others = shuffle(CYBER_LAB.breakthroughs.filter((c) => c.id !== pick.id)).slice(0, 2);
    return {
      topic: 'Siber',
      prompt: `${pick.summary} Istilah mana yang tepat?`,
      options: shuffle([
        { label: pick.title, ok: true },
        ...others.map((o) => ({ label: o.title, ok: false }))
      ]),
      explain: pick.whyMatters,
      codexId: pick.id
    };
  }

  if (bucket === 4) {
    const f = FACTS_BANK[Math.floor(Math.random() * FACTS_BANK.length)];
    return {
      topic: 'Fakta',
      prompt: `"${f.statement}"`,
      options: [
        { label: 'Fakta', ok: f.isFact },
        { label: 'Mitos', ok: !f.isFact }
      ],
      explain: f.punchline,
      codexId: f.id
    };
  }

  if (bucket === 5) {
    const fl = FALLACIES_BANK[Math.floor(Math.random() * FALLACIES_BANK.length)];
    const explain = fl.meaning.toLowerCase().startsWith(fl.fallacyName.toLowerCase())
      ? fl.meaning
      : `${fl.fallacyName}: ${fl.meaning}`;
    return {
      topic: 'Logika',
      prompt: fl.attack,
      options: shuffle(fl.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain,
      codexId: fl.id
    };
  }

  const tier = Math.min(5, Math.max(1, Math.ceil(level / 3)));
  const mq = generateMathQuestion(tier, Math.floor(Math.random() * 3));
  return {
    topic: 'Hitung',
    prompt: mq.question,
    options: mq.choices.map((c) => ({ label: c.label, ok: Boolean(c.correct) })),
    explain: mq.explain,
    codexId: null
  };
}
