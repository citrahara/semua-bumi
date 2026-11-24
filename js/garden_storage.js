// Penyimpanan Multi-Akun Lokal untuk Taman Kronik (Level Match-3, Bintang, 5 Nyawa, Booster, Renovasi 3D, Codex).

const STORE_KEY = 'taman_kronik_accounts_v1';
export const MAX_LIVES = 5;
export const LIFE_REGEN_MS = 10 * 60 * 1000; // 1 nyawa pulih tiap 10 menit (atau langsung lewat 1 soal kilat!)

export function createFreshGardenAccount(username, characterClass = 'detektif') {
  return {
    username,
    characterClass,
    x: 700,
    y: 700,
    facing: 'down',
    level: 1, // Level Match-3 (1 -> tak terbatas!)
    stars: 1, // Mulai dengan 1 Bintang agar pemain bisa langsung merasakan renovasi gerbang pertama!
    coins: 120,
    lives: MAX_LIVES,
    lastLifeAt: Date.now(),
    season: 1, // Musim Taman (1 -> tak terbatas setelah 12 area selesai!)
    renovations: {}, // { taskId: styleIndex (0|1|2) }
    boosters: {
      shovel: 2,
      bomb: 1,
      shuffle: 2
    },
    codexIds: [],
    solvedQuests: 0,
    totalClearedLevels: 0,
    bestCombo: 0,
    prologueSeen: false,
    muted: false,
    createdAt: new Date().toISOString()
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { activeUsername: null, accounts: {} };
    const parsed = JSON.parse(raw);
    return {
      activeUsername: parsed.activeUsername || null,
      accounts: parsed.accounts && typeof parsed.accounts === 'object' ? parsed.accounts : {}
    };
  } catch {
    return { activeUsername: null, accounts: {} };
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // Abaikan jika penyimpanan dibatasi
  }
}

export function syncLives(acc) {
  if (!acc) return acc;
  if (typeof acc.lives !== 'number') acc.lives = MAX_LIVES;
  if (acc.lives >= MAX_LIVES) {
    acc.lives = MAX_LIVES;
    acc.lastLifeAt = Date.now();
    return acc;
  }
  const now = Date.now();
  const elapsed = now - (acc.lastLifeAt || now);
  if (elapsed >= LIFE_REGEN_MS) {
    const gained = Math.floor(elapsed / LIFE_REGEN_MS);
    acc.lives = Math.min(MAX_LIVES, acc.lives + gained);
    acc.lastLifeAt = acc.lives >= MAX_LIVES ? now : (acc.lastLifeAt || now) + gained * LIFE_REGEN_MS;
  }
  return acc;
}

export function getNextLifeSeconds(acc) {
  syncLives(acc);
  if (acc.lives >= MAX_LIVES) return 0;
  const rem = LIFE_REGEN_MS - (Date.now() - (acc.lastLifeAt || Date.now()));
  return Math.max(0, Math.ceil(rem / 1000));
}

function normalize(acc) {
  const base = createFreshGardenAccount(acc.username || 'Pembaca', acc.characterClass || 'detektif');
  const merged = {
    ...base,
    ...acc,
    renovations: acc.renovations && typeof acc.renovations === 'object' ? acc.renovations : {},
    boosters: {
      shovel: typeof acc.boosters?.shovel === 'number' ? acc.boosters.shovel : 2,
      bomb: typeof acc.boosters?.bomb === 'number' ? acc.boosters.bomb : 1,
      shuffle: typeof acc.boosters?.shuffle === 'number' ? acc.boosters.shuffle : 2
    },
    codexIds: Array.isArray(acc.codexIds) ? acc.codexIds : []
  };
  return syncLives(merged);
}

export function listGardenAccounts() {
  const store = loadStore();
  return Object.values(store.accounts)
    .map(normalize)
    .sort((a, b) => (b.level || 1) - (a.level || 1));
}

export function getActiveGardenAccount() {
  const store = loadStore();
  if (!store.activeUsername || !store.accounts[store.activeUsername]) return null;
  return normalize(store.accounts[store.activeUsername]);
}

export function registerGardenAccount(username, characterClass) {
  const store = loadStore();
  const acc = createFreshGardenAccount(username, characterClass);
  store.accounts[username] = acc;
  store.activeUsername = username;
  saveStore(store);
  return acc;
}

export function switchGardenAccount(username) {
  const store = loadStore();
  if (!store.accounts[username]) return null;
  store.activeUsername = username;
  saveStore(store);
  return normalize(store.accounts[username]);
}

export function persistGardenSave(acc) {
  if (!acc || !acc.username) return;
  syncLives(acc);
  const store = loadStore();
  store.accounts[acc.username] = acc;
  store.activeUsername = acc.username;
  saveStore(store);
}

export function resetGardenAccount(acc) {
  if (!acc || !acc.username) return null;
  const fresh = createFreshGardenAccount(acc.username, acc.characterClass || 'detektif');
  fresh.muted = acc.muted;
  persistGardenSave(fresh);
  return fresh;
}
