// Penyimpanan Multi-Akun Lokal, Statistik RPG Endless, Relik Ilmu, dan Skala Jilid (Volume).

import { getCharacterClass } from './data/registration.js';

const ACCOUNTS_KEY = 'warkop_impact_accounts_v2';

export const RELIC_EFFECTS = {
  'academy-lit': {
    name: 'Relik Arsip Sastra',
    statLabel: '+18% Strike & Kritikal',
    atkMult: 0.18,
    critBonus: 0.08
  },
  'academy-korean': {
    name: 'Relik Hangul',
    statLabel: '+25 Max HP & +6 HP/giliran',
    hpBonus: 25,
    regen: 6
  },
  'academy-polyglot': {
    name: 'Relik Poliglot',
    statLabel: '+1 Energi awal tiap duel',
    startEnergy: 1
  },
  'academy-cyber': {
    name: 'Relik Analis Siber',
    statLabel: '+25% Kekuatan Perisai',
    shieldMult: 0.25
  },
  'academy-rhetoric': {
    name: 'Relik Retorika',
    statLabel: '+35% Damage Counter & Overdrive',
    counterMult: 0.35
  }
};

export function createFreshAccount(username, characterClass = 'orator') {
  return {
    username,
    playerName: username,
    characterClass,
    x: 340,
    y: 410,
    facing: 'down',
    xp: 0,
    coins: 0,
    level: 1,
    volume: 1,
    highestVolume: 1,
    currentHp: 100,
    potions: 2,
    upgrades: { atk: 0, def: 0, hp: 0, crit: 0 },
    solvedGates: [],
    talkedNpcs: [],
    completedNpcs: [],
    openedChests: [],
    unlockedWaypoints: ['wp-1'],
    codexIds: [],
    defeatedEnemies: [],
    academyBadges: [],
    prologueSeen: false,
    worldTier: 1,
    towerFloor: 0,
    comedyFame: 0,
    dailyStreak: 0,
    dailyState: null,
    mathSolvedCount: 0,
    stageCompletions: 0,
    totalWins: 0,
    muted: false,
    createdAt: new Date().toISOString()
  };
}

export function getUpgradeCost(statKey, currentRank = 0) {
  const base = statKey === 'crit' ? 65 : 50;
  return Math.round(base * Math.pow(1.45, currentRank));
}

export function getPlayerStats(save) {
  const cls = getCharacterClass(save.characterClass);
  const up = save.upgrades || { atk: 0, def: 0, hp: 0, crit: 0 };
  const badges = save.academyBadges || [];
  const lvl = save.level || 1;

  let atkMult = 1;
  let critBonus = cls.id === 'detektif' ? 0.14 : 0;
  let hpBonus = 0;
  let regen = 0;
  let startEnergy = 1;
  let shieldMult = cls.id === 'alkemis' ? 1.18 : 1;
  let counterMult = 1;

  for (const id of badges) {
    const r = RELIC_EFFECTS[id];
    if (!r) continue;
    if (r.atkMult) atkMult += r.atkMult;
    if (r.critBonus) critBonus += r.critBonus;
    if (r.hpBonus) hpBonus += r.hpBonus;
    if (r.regen) regen += r.regen;
    if (r.startEnergy) startEnergy += r.startEnergy;
    if (r.shieldMult) shieldMult += r.shieldMult;
    if (r.counterMult) counterMult += r.counterMult;
  }

  const maxHp = 100 + (lvl - 1) * 12 + (up.hp || 0) * 20 + hpBonus;
  const atk = Math.round((18 + (lvl - 1) * 2 + (up.atk || 0) * 5) * atkMult);
  const def = 4 + Math.floor((lvl - 1) * 0.8) + (up.def || 0) * 3;
  const critChance = Math.min(0.65, 0.14 + (up.crit || 0) * 0.06 + critBonus);
  const shieldPower = Math.round((24 + (up.def || 0) * 6) * shieldMult);

  return {
    maxHp,
    atk,
    def,
    critChance,
    shieldPower,
    startEnergy: Math.min(3, startEnergy),
    regen,
    counterMult,
    relicCount: badges.length
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
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
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(store));
  } catch {
    // Abaikan jika localStorage dibatasi
  }
}

export function listSavedAccounts() {
  const store = loadStore();
  return Object.values(store.accounts)
    .map(normalizeAccount)
    .sort((a, b) => (b.level || 1) - (a.level || 1));
}

export function getActiveAccount() {
  const store = loadStore();
  if (!store.activeUsername || !store.accounts[store.activeUsername]) return null;
  return normalizeAccount(store.accounts[store.activeUsername]);
}

export function registerAccount(username, characterClass) {
  const store = loadStore();
  const acc = createFreshAccount(username, characterClass);
  store.accounts[username] = acc;
  store.activeUsername = username;
  saveStore(store);
  return acc;
}

export function switchAccount(username) {
  const store = loadStore();
  if (!store.accounts[username]) return null;
  store.activeUsername = username;
  saveStore(store);
  return normalizeAccount(store.accounts[username]);
}

export function persistSave(account) {
  if (!account || !account.username) return;
  const store = loadStore();
  store.accounts[account.username] = account;
  store.activeUsername = account.username;
  saveStore(store);
}

export function resetCurrentAccount(account) {
  if (!account || !account.username) return null;
  const fresh = createFreshAccount(account.username, account.characterClass || 'orator');
  fresh.muted = account.muted;
  persistSave(fresh);
  return fresh;
}

function normalizeAccount(acc) {
  const base = createFreshAccount(acc.username || 'Pembaca', acc.characterClass || 'orator');
  const merged = {
    ...base,
    ...acc,
    playerName: acc.username || acc.playerName || 'Pembaca',
    volume: Math.max(1, acc.volume || acc.worldTier || 1),
    highestVolume: Math.max(1, acc.highestVolume || acc.volume || acc.worldTier || 1),
    potions: typeof acc.potions === 'number' ? acc.potions : 2,
    upgrades: {
      atk: acc.upgrades?.atk || 0,
      def: acc.upgrades?.def || 0,
      hp: acc.upgrades?.hp || 0,
      crit: acc.upgrades?.crit || 0
    },
    solvedGates: Array.isArray(acc.solvedGates) ? acc.solvedGates : [],
    talkedNpcs: Array.isArray(acc.talkedNpcs) ? acc.talkedNpcs : [],
    completedNpcs: Array.isArray(acc.completedNpcs) ? acc.completedNpcs : [],
    openedChests: Array.isArray(acc.openedChests) ? acc.openedChests : [],
    unlockedWaypoints: Array.isArray(acc.unlockedWaypoints) ? acc.unlockedWaypoints : ['wp-1'],
    codexIds: Array.isArray(acc.codexIds) ? acc.codexIds : [],
    defeatedEnemies: Array.isArray(acc.defeatedEnemies) ? acc.defeatedEnemies : [],
    academyBadges: Array.isArray(acc.academyBadges) ? acc.academyBadges : []
  };
  const stats = getPlayerStats(merged);
  if (typeof acc.currentHp !== 'number' || Number.isNaN(acc.currentHp)) {
    merged.currentHp = stats.maxHp;
  } else {
    merged.currentHp = Math.max(1, Math.min(stats.maxHp, acc.currentHp));
  }
  return merged;
}

export function xpNeededForLevel(level) {
  return 100 + (level - 1) * 65;
}

export function grantRewards(save, { xp = 0, coins = 0, codexId = null }) {
  let leveledUp = false;
  save.xp += xp;
  save.coins += coins;
  if (codexId && !save.codexIds.includes(codexId)) {
    save.codexIds.push(codexId);
  }
  while (save.xp >= xpNeededForLevel(save.level)) {
    save.xp -= xpNeededForLevel(save.level);
    save.level += 1;
    leveledUp = true;
    const stats = getPlayerStats(save);
    save.currentHp = stats.maxHp;
  }
  persistSave(save);
  return leveledUp;
}
