// Penyimpanan multi-akun untuk Meja Malam (ruang baca, ingatan Arka, dekor 3D, dan kasus selesai).

const STORE_KEY = 'meja_malam_accounts_v1';

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
    // Abaikan jika penyimpanan dibatasi
  }
}

export function createFreshSalonAccount(username) {
  return {
    username,
    night: 1,
    tokens: 1, // 1 token awal agar bisa langsung mencoba pratinjau & pasang dekor 3D pertama
    upgrades: {},
    solvedCaseIds: [],
    currentTea: {
      name: 'Teh Melati Murni',
      color: '#C7AE62',
      tags: ['tenang'],
      vibe: 'Harum tipis yang membuat jeda terasa lega.'
    },
    chatHistory: [
      {
        role: 'arka',
        text: `Malam, @${username}. Hujan mulai turun di taman luar. Di samping sudah ada berkas tamu pertama, atau kita bisa menyeduh teh dan ngobrol dulu.`
      }
    ],
    memoryNotes: [],
    muted: false,
    rainOn: true,
    createdAt: Date.now()
  };
}

export function listSalonAccounts() {
  const store = readStore();
  return Object.values(store.accounts).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function getActiveSalonAccount() {
  const store = readStore();
  if (!store.active || !store.accounts[store.active]) return null;
  return store.accounts[store.active];
}

export function registerSalonAccount(username) {
  const store = readStore();
  const key = username.toLowerCase();
  const fresh = createFreshSalonAccount(username);
  store.accounts[key] = fresh;
  store.active = key;
  writeStore(store);
  return fresh;
}

export function switchSalonAccount(username) {
  const store = readStore();
  const key = username.toLowerCase();
  if (!store.accounts[key]) return null;
  store.active = key;
  writeStore(store);
  return store.accounts[key];
}

export function persistSalonSave(account) {
  if (!account || !account.username) return;
  const store = readStore();
  const key = account.username.toLowerCase();
  store.accounts[key] = account;
  store.active = key;
  writeStore(store);
}

export function resetSalonAccount(account) {
  const fresh = createFreshSalonAccount(account.username);
  persistSalonSave(fresh);
  return fresh;
}
