// Penyimpanan multi-akun untuk Semua Bumi.
// Menyimpan progres jelajah 30 negara, koleksi tantangan, skor, pertemuan Bus Damri, dan riwayat obrolan Bus Damri.

const STORE_KEY = 'semua_bumi_accounts_v1';

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { active: null, accounts: {} };
    const parsed = JSON.parse(raw);
    return {
      active: parsed.active || null,
      accounts: parsed.accounts && typeof parsed.accounts === 'object' ? parsed.accounts : {}
    };
  } catch {
    return { active: null, accounts: {} };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // Abaikan jika penyimpanan browser dibatasi
  }
}

export function createFreshAtlasAccount(username) {
  return {
    username,
    score: 0,
    bestRoundScore: 0,
    streak: 0,
    bestStreak: 0,
    roundsPlayed: 0,
    visitedCountryIds: ['indonesia'],
    unlockedIds: [],
    busEncounters: 0,
    selectedMode: 'explore',
    selectedCategory: 'all',
    busHistory: [
      {
        role: 'bus',
        text: `Selamat datang di Semua Bumi, @${username}. Saya Bus Damri yang ikut berputar mengelilingi bumi. Ketuk label negara mana saja untuk melihat hasil bumi, buku, film, dan karyanya bersama Beliau dan kawanan ikan julung-julung.`
      }
    ],
    muted: false,
    createdAt: Date.now()
  };
}

export function listAtlasAccounts() {
  const store = readStore();
  return Object.values(store.accounts).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function getActiveAtlasAccount() {
  const store = readStore();
  if (!store.active || !store.accounts[store.active]) return null;
  const acc = store.accounts[store.active];
  if (!Array.isArray(acc.visitedCountryIds)) acc.visitedCountryIds = ['indonesia'];
  if (!Array.isArray(acc.busHistory)) acc.busHistory = createFreshAtlasAccount(acc.username).busHistory;
  return acc;
}

export function registerAtlasAccount(username) {
  const store = readStore();
  const key = username.toLowerCase();
  const fresh = createFreshAtlasAccount(username);
  store.accounts[key] = fresh;
  store.active = key;
  writeStore(store);
  return fresh;
}

export function switchAtlasAccount(username) {
  const store = readStore();
  const key = username.toLowerCase();
  if (!store.accounts[key]) return null;
  store.active = key;
  writeStore(store);
  return store.accounts[key];
}

export function persistAtlasSave(account) {
  if (!account || !account.username) return;
  const store = readStore();
  const key = account.username.toLowerCase();
  store.accounts[key] = account;
  store.active = key;
  writeStore(store);
}

export function resetAtlasAccount(account) {
  const fresh = createFreshAtlasAccount(account.username);
  persistAtlasSave(fresh);
  return fresh;
}
