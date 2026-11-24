// Penyimpanan Multi-Akun Lokal + Auto-Save Progres RPG Warkop Impact.

const ACCOUNTS_KEY = 'warkop_impact_accounts_v2';

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
    solvedGates: [],
    talkedNpcs: [],
    completedNpcs: [],
    openedChests: [],
    unlockedWaypoints: ['wp-1'],
    codexIds: [],
    mathSolvedCount: 0,
    stageCompletions: 0,
    muted: false,
    createdAt: new Date().toISOString()
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
  return Object.values(store.accounts).sort((a, b) => (b.level || 1) - (a.level || 1));
}

export function getActiveAccount() {
  const store = loadStore();
  if (!store.activeUsername || !store.accounts[store.activeUsername]) return null;
  const acc = store.accounts[store.activeUsername];
  return normalizeAccount(acc);
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
  return {
    ...createFreshAccount(acc.username || 'Petualang', acc.characterClass || 'orator'),
    ...acc,
    playerName: acc.username || acc.playerName || 'Petualang',
    solvedGates: Array.isArray(acc.solvedGates) ? acc.solvedGates : [],
    talkedNpcs: Array.isArray(acc.talkedNpcs) ? acc.talkedNpcs : [],
    completedNpcs: Array.isArray(acc.completedNpcs) ? acc.completedNpcs : [],
    openedChests: Array.isArray(acc.openedChests) ? acc.openedChests : [],
    unlockedWaypoints: Array.isArray(acc.unlockedWaypoints) ? acc.unlockedWaypoints : ['wp-1'],
    codexIds: Array.isArray(acc.codexIds) ? acc.codexIds : []
  };
}

export function xpNeededForLevel(level) {
  return 100 + (level - 1) * 60;
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
  }
  persistSave(save);
  return leveledUp;
}
