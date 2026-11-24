// Penyimpanan multi-akun untuk Atlas Bumi 3D.
// Menyimpan skor, streak, koleksi pin terbuka, preferensi mode, dan riwayat obrolan Ramyeon.

const STORE_KEY = 'atlas_bumi_accounts_v1';

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
    unlockedIds: [],
    selectedMode: 'mix',
    selectedCategory: 'all',
    ramyeonHistory: [
      {
        role: 'ramyeon',
        text: `Halo @${username}. Aku Ramyeon. Kalau butuh arah untuk ronde yang sedang jalan, atau sekadar cari saran film, buku, dan fakta tak terduga, tinggal ketuk aku di sini.`
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
  return store.accounts[store.active];
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
