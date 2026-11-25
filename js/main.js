// Pengendali utama Semua Bumi:
// Bola bumi 3D berlabel 30 negara (SDA, buku, film, karya), tokoh 3D Beliau bersama ikan julung-julung terbang,
// Bus Damri 3D yang mengorbit bumi sekaligus menjadi teman obrolan offline, serta 3 mode tantangan opsional.

import {
  WORLD_COUNTRIES,
  loadWorldCountries,
  getCountryById,
  findNearestCountry
} from './world_atlas.js';
import {
  CATEGORIES,
  ATLAS_PIN_ROUNDS,
  TIMELINE_DUELS,
  CONNECTION_ROUNDS,
  getCategoryMeta
} from './atlas_data.js';
import { AtlasGlobe3D, haversineKm, formatCoord } from './globe3d.js';
import {
  BUS_QUICK_PROMPTS,
  getBusContextNote,
  pickNextCountrySuggestion,
  replyFromBusDamri
} from './bus_damri.js';
import {
  listAtlasAccounts,
  getActiveAtlasAccount,
  registerAtlasAccount,
  switchAtlasAccount,
  persistAtlasSave,
  resetAtlasAccount
} from './atlas_storage.js';
import { audio } from './audio.js';

const TOTAL_CHALLENGES =
  ATLAS_PIN_ROUNDS.length + TIMELINE_DUELS.length + CONNECTION_ROUNDS.length;

function getTotalCountries() {
  return WORLD_COUNTRIES.length || 195;
}

const VERIFICATION_QUESTIONS = [
  {
    q: 'Dalam novel Semua Ikan di Langit karya Ziggy, siapa narator yang berkeliling semesta bersama Beliau dan kawanan ikan julung-julung?',
    options: [
      'Bus Damri trayek Dipatiukur-Leuwipanjang',
      'Kapal layar dari Pelabuhan Sunda Kelapa',
      'Kereta api malam lintas pegunungan'
    ],
    answer: 0,
    tip: 'Narator dalam novel tersebut adalah "Saya", sebuah Bus Damri kota yang menemani Beliau melintasi semesta.'
  },
  {
    q: 'Dari mana lebih dari 98 persen data internet antarbenua mengalir hari ini?',
    options: [
      'Kabel serat optik di dasar samudra',
      'Satelit luar angkasa semata',
      'Menara pemancar di puncak pegunungan'
    ],
    answer: 0,
    tip: 'Hampir seluruh lalu lintas data antarbenua melesat lewat ratusan kabel serat optik di dasar laut.'
  },
  {
    q: 'Pulau kecil di Maluku mana yang pada 1667 pernah ditukar dengan Pulau Manhattan di New York demi rempah pala?',
    options: [
      'Pulau Run di Kepulauan Banda',
      'Pulau Samosir di Sumatera Utara',
      'Pulau Komodo di Nusa Tenggara Timur'
    ],
    answer: 0,
    tip: 'Dalam Perjanjian Breda 1667, Belanda menukar New Amsterdam (Manhattan) dengan Pulau Run demi monopoli pala.'
  }
];

const state = {
  account: null,
  globe: null,
  activeCountryId: 'indonesia',
  exploreTab: 'sda', // 'sda' | 'book' | 'film' | 'work'
  lastRoundId: null,
  busOpen: false,
  round: null,
  toastTimer: null,
  beliauTimer: null,
  busLocInterval: null
};

const els = {
  canvas: document.getElementById('globe-canvas'),
  labelsLayer: document.getElementById('globe-labels-layer'),
  hudLayer: document.getElementById('hud-layer'),
  hudInitial: document.getElementById('hud-initial'),
  hudVisited: document.getElementById('hud-visited'),
  hudScore: document.getElementById('hud-score'),
  hudEncounters: document.getElementById('hud-encounters'),
  countryJumpSelect: document.getElementById('country-jump-select'),
  categorySelect: document.getElementById('category-select'),
  hoverPill: document.getElementById('globe-hover-pill'),
  modeTabs: Array.from(document.querySelectorAll('.mode-tab')),
  btnProfile: document.getElementById('btn-open-profile'),
  btnCollection: document.getElementById('btn-open-collection'),
  btnSound: document.getElementById('btn-toggle-sound'),
  btnToggleBus: document.getElementById('btn-toggle-bus'),
  btnCloseBus: document.getElementById('btn-close-bus'),
  btnFollowBus: document.getElementById('btn-follow-bus'),
  beliauPopup: document.getElementById('beliau-popup'),
  beliauTitle: document.getElementById('beliau-title'),
  beliauText: document.getElementById('beliau-text'),
  beliauActions: document.getElementById('beliau-actions'),
  btnCloseBeliau: document.getElementById('btn-close-beliau'),
  btnBeliauGreetBus: document.getElementById('btn-beliau-greet-bus'),
  roundCard: document.getElementById('round-card'),
  busDrawer: document.getElementById('bus-drawer'),
  busLocationSub: document.getElementById('bus-location-sub'),
  busMessages: document.getElementById('bus-messages'),
  busChips: document.getElementById('bus-chips'),
  busForm: document.getElementById('bus-form'),
  busInput: document.getElementById('bus-input'),
  toast: document.getElementById('toast'),
  authOverlay: document.getElementById('auth-overlay'),
  modalOverlay: document.getElementById('modal-overlay')
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString('id-ID');
}

function shuffleCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showToast(msg) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
  }, 2800);
}

// Pop-up halus Beliau bersama kawanan ikan julung-julung
function showBeliauPopup(title, text, options = {}) {
  if (!els.beliauPopup) return;
  els.beliauTitle.textContent = title;
  els.beliauText.textContent = text;
  els.beliauActions.classList.toggle('hidden', !options.showGreetBus);
  els.beliauPopup.classList.remove('hidden');

  clearTimeout(state.beliauTimer);
  const duration = options.duration || 8500;
  state.beliauTimer = setTimeout(() => {
    els.beliauPopup.classList.add('hidden');
  }, duration);
}

function hideBeliauPopup() {
  clearTimeout(state.beliauTimer);
  if (els.beliauPopup) els.beliauPopup.classList.add('hidden');
}

function getAllChallengeEntries() {
  const entries = [];
  ATLAS_PIN_ROUNDS.forEach((r) => {
    entries.push({
      id: r.id,
      mode: 'pin',
      category: r.category,
      title: r.title,
      place: `${r.place} (${r.year})`,
      wowFact: r.wowFact,
      lat: r.lat,
      lon: r.lon
    });
  });
  TIMELINE_DUELS.forEach((r) => {
    entries.push({
      id: r.id,
      mode: 'duel',
      category: r.category,
      title: `${r.a.title} vs ${r.b.title}`,
      place: `${r.a.year} dibanding ${r.b.year}`,
      wowFact: r.wowFact,
      lat: r.a.lat,
      lon: r.a.lon
    });
  });
  CONNECTION_ROUNDS.forEach((r) => {
    const anchor = r.cards.find((c) => c.id === r.answerIds[0]) || r.cards[0];
    entries.push({
      id: r.id,
      mode: 'connect',
      category: r.category,
      title: r.threadTitle,
      place: 'Benang Merah 3 Titik',
      wowFact: r.wowFact,
      lat: anchor.lat,
      lon: anchor.lon
    });
  });
  return entries;
}

const ALL_CHALLENGES = getAllChallengeEntries();

function syncEarthStarsAndLabels() {
  if (!state.globe || !state.account) return;
  const visitedSet = new Set(state.account.visitedCountryIds || []);
  const unlockedSet = new Set(state.account.unlockedIds || []);

  // Gabungkan bintang negeri yang sudah dijelajahi + titik tantangan terbuka
  const starItems = [];
  WORLD_COUNTRIES.forEach((c) => {
    if (visitedSet.has(c.id)) {
      starItems.push({
        id: c.id,
        kind: 'country',
        countryId: c.id,
        title: c.name,
        place: `${c.region} · Ibu kota ${c.capital}`,
        wowFact: c.wowFact,
        lat: c.lat,
        lon: c.lon
      });
    }
  });
  ALL_CHALLENGES.forEach((e) => {
    if (unlockedSet.has(e.id) && e.mode === 'pin') {
      starItems.push({ ...e, kind: 'challenge' });
    }
  });

  state.globe.syncUnlockedPins(starItems);
  state.globe.updateCountryLabelStates(
    visitedSet,
    state.account.selectedMode === 'explore' ? state.activeCountryId : null
  );
}

function updateHud() {
  const acc = state.account;
  if (!acc) return;

  const isExplore = (acc.selectedMode || 'explore') === 'explore';
  els.hudInitial.textContent = (acc.username || 'S').slice(0, 1).toUpperCase();
  els.hudVisited.textContent = `${(acc.visitedCountryIds || []).length}/${getTotalCountries()} Negeri`;
  els.hudScore.textContent = formatNumber(acc.score);
  els.hudEncounters.textContent = String(acc.busEncounters || 0);
  els.btnSound.textContent = acc.muted ? 'Bisukan' : 'Suara';

  els.countryJumpSelect.classList.toggle('hidden', !isExplore);
  els.categorySelect.classList.toggle('hidden', isExplore);
  els.countryJumpSelect.value = state.activeCountryId;
  els.categorySelect.value = acc.selectedCategory || 'all';

  els.modeTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === (acc.selectedMode || 'explore'));
  });
}

// ==========================================
// MODE UTAMA: JELAJAH BUMI BERLABEL
// ==========================================

function selectExploreCountry(country, options = {}) {
  if (!country || !state.account) return;
  const { flyCamera = true, showBeliau = true } = options;

  state.activeCountryId = country.id;
  state.exploreTab = 'sda';
  state.round = null;

  if (!state.account.visitedCountryIds) state.account.visitedCountryIds = [];
  const isNew = !state.account.visitedCountryIds.includes(country.id);
  if (isNew) {
    state.account.visitedCountryIds.push(country.id);
    state.account.score += 250;
    audio.playDialogueOpen();
    showToast(`${country.name} terbuka (+250 poin)`);
  } else {
    audio.playClick();
  }

  persistAtlasSave(state.account);
  state.globe.clearRoundVisuals();
  state.globe.setPinMode(false);
  state.globe.setLabelsVisible(true);
  state.globe.flyBeliauTo(country.lat, country.lon);

  if (flyCamera) {
    state.globe.setAutoRotate(false);
    state.globe.focusLatLon(country.lat, country.lon, 5.55);
  }

  syncEarthStarsAndLabels();
  updateHud();
  renderExploreCard();

  if (showBeliau) {
    showBeliauPopup(`Beliau di langit ${country.name}`, country.beliauNote);
  }
}

function renderExploreCard() {
  const country = getCountryById(state.activeCountryId) || WORLD_COUNTRIES[0];
  const tab = state.exploreTab || 'sda';

  let bodyHtml = '';
  if (tab === 'sda') {
    bodyHtml = `
      <ul class="sda-list">
        ${country.sda.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <p class="explore-wow"><strong>Fakta menarik:</strong> ${escapeHtml(country.wowFact)}</p>
    `;
  } else if (tab === 'book') {
    bodyHtml = `
      <div class="explore-item-title">${escapeHtml(country.book.title)}</div>
      <p class="explore-item-note">${escapeHtml(country.book.note)}</p>
    `;
  } else if (tab === 'film') {
    bodyHtml = `
      <div class="explore-item-title">${escapeHtml(country.film.title)}</div>
      <p class="explore-item-note">${escapeHtml(country.film.note)}</p>
    `;
  } else {
    bodyHtml = `
      <div class="explore-item-title">${escapeHtml(country.work.title)}</div>
      <p class="explore-item-note">${escapeHtml(country.work.note)}</p>
    `;
  }

  els.roundCard.innerHTML = `
    <div class="country-head">
      <div class="country-title-wrap">
        <img class="country-flag" src="${escapeHtml(country.flag)}" alt="Bendera ${escapeHtml(country.name)}" width="38" height="26" />
        <div class="country-heading-text">
          <h2 class="country-name">${escapeHtml(country.name)}</h2>
          <span class="country-place-meta">${escapeHtml(country.region)} · Ibu kota ${escapeHtml(country.capital)}${country.languages ? ` · ${escapeHtml(country.languages)}` : ''}</span>
        </div>
      </div>
      <button class="btn-ghost" id="btn-focus-beliau" type="button">Arahkan ke Beliau</button>
    </div>
    <p class="country-tagline">${escapeHtml(country.tagline)}</p>
    <div class="explore-tabs" role="tablist" aria-label="Kategori informasi negara">
      <button class="explore-tab ${tab === 'sda' ? 'active' : ''}" data-tab="sda" type="button">Hasil Bumi & SDA</button>
      <button class="explore-tab ${tab === 'book' ? 'active' : ''}" data-tab="book" type="button">Buku</button>
      <button class="explore-tab ${tab === 'film' ? 'active' : ''}" data-tab="film" type="button">Film</button>
      <button class="explore-tab ${tab === 'work' ? 'active' : ''}" data-tab="work" type="button">Karya & Sains</button>
    </div>
    <div class="explore-body">${bodyHtml}</div>
    <div class="action-row">
      <div class="action-group">
        <button class="btn-secondary" id="btn-ask-bus-country" type="button">Tanya Bus Damri</button>
        <button class="btn-secondary" id="btn-summon-bus" type="button">Panggil Bus Mendekat</button>
      </div>
      <button class="btn-primary" id="btn-next-country" type="button">Terbang ke Negeri Lain</button>
    </div>
  `;

  els.roundCard.querySelectorAll('.explore-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.exploreTab = btn.dataset.tab;
      audio.playClick();
      renderExploreCard();
    });
  });

  document.getElementById('btn-focus-beliau').addEventListener('click', () => {
    audio.playClick();
    state.globe.focusBeliau();
  });

  document.getElementById('btn-ask-bus-country').addEventListener('click', () => {
    askBusDamriAboutCurrent();
  });

  document.getElementById('btn-summon-bus').addEventListener('click', () => {
    audio.playWaypoint();
    state.globe.summonBusToBeliau();
    showToast('Bus Damri sedang berbelok mendekati Beliau dan kawanan ikan');
  });

  document.getElementById('btn-next-country').addEventListener('click', () => {
    const next = pickNextCountrySuggestion(state.account.visitedCountryIds || [], country.id);
    selectExploreCountry(next, { flyCamera: true, showBeliau: true });
  });
}

// ==========================================
// MODE TANTANGAN (TANCAP PETA, DUEL TAHUN, BENANG MERAH)
// ==========================================

function getPoolForMode(mode, category) {
  const source =
    mode === 'pin'
      ? ATLAS_PIN_ROUNDS
      : mode === 'duel'
        ? TIMELINE_DUELS
        : CONNECTION_ROUNDS;

  if (!category || category === 'all') return source;
  const filtered = source.filter((item) => item.category === category);
  return filtered.length ? filtered : source;
}

function startChallengeRound(mode) {
  if (!state.account) return;
  const category = state.account.selectedCategory || 'all';
  const pool = getPoolForMode(mode, category);
  const unlockedSet = new Set(state.account.unlockedIds || []);

  let candidates = pool.filter((item) => !unlockedSet.has(item.id) && item.id !== state.lastRoundId);
  if (!candidates.length) candidates = pool.filter((item) => item.id !== state.lastRoundId);
  if (!candidates.length) candidates = pool;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  state.lastRoundId = picked.id;

  const midYear = mode === 'pin' ? Math.round((picked.minYear + picked.maxYear) / 2) : null;

  state.round = {
    mode,
    data: picked,
    revealed: false,
    guess: null,
    guessYear: midYear,
    duelSwapped: Math.random() < 0.5,
    duelPicked: null,
    selectedCardIds: [],
    shuffledCards: mode === 'connect' ? shuffleCopy(picked.cards) : [],
    wrongNote: '',
    result: null
  };

  state.globe.clearRoundVisuals();
  // Sembunyikan label negara saat Tancap Peta agar lokasi tidak bocor sebelum menebak
  state.globe.setLabelsVisible(mode !== 'pin');

  if (mode === 'pin') {
    state.globe.setPinMode(true);
    state.globe.setAutoRotate(true);
  } else if (mode === 'duel') {
    state.globe.setPinMode(false);
    state.globe.setAutoRotate(false);
    state.globe.showDuelMarkers(picked.a, picked.b, null);
  } else {
    state.globe.setPinMode(false);
    state.globe.setAutoRotate(true);
  }

  syncEarthStarsAndLabels();
  renderChallengeCard();
}

function unlockChallenge(id) {
  if (!state.account) return false;
  if (!state.account.unlockedIds) state.account.unlockedIds = [];
  if (!state.account.unlockedIds.includes(id)) {
    state.account.unlockedIds.push(id);
    syncEarthStarsAndLabels();
    return true;
  }
  return false;
}

function computePinScore(distKm, yearDelta, minYear, maxYear) {
  const distScore = distKm <= 150 ? 6000 : Math.round(6000 * Math.exp(-distKm / 2600));
  const span = Math.max(30, maxYear - minYear);
  const yearScore =
    yearDelta === 0 ? 4000 : Math.round(4000 * Math.exp(-yearDelta / (span * 0.22)));
  return { distScore, yearScore, total: distScore + yearScore };
}

function handlePinSubmit() {
  const r = state.round;
  if (!r || r.mode !== 'pin' || r.revealed || !r.guess) return;

  const distKm = Math.round(haversineKm(r.guess.lat, r.guess.lon, r.data.lat, r.data.lon));
  const yearDelta = Math.abs(r.guessYear - r.data.year);
  const scored = computePinScore(distKm, yearDelta, r.data.minYear, r.data.maxYear);

  r.revealed = true;
  r.result = {
    distKm,
    yearDelta,
    points: scored.total,
    strongHit: scored.total >= 4500
  };

  state.globe.setPinMode(false);
  state.globe.setLabelsVisible(true);
  state.globe.setAutoRotate(false);
  state.globe.revealAnswerArc(r.guess.lat, r.guess.lon, r.data.lat, r.data.lon);

  state.account.score += scored.total;
  state.account.roundsPlayed += 1;
  state.account.bestRoundScore = Math.max(state.account.bestRoundScore || 0, scored.total);
  if (r.result.strongHit) {
    state.account.streak = (state.account.streak || 0) + 1;
    state.account.bestStreak = Math.max(state.account.bestStreak || 0, state.account.streak);
    audio.playCorrect();
  } else {
    state.account.streak = 0;
    audio.playDialogueOpen();
  }

  const isNew = unlockChallenge(r.data.id);
  persistAtlasSave(state.account);
  updateHud();
  renderChallengeCard();

  if (isNew) {
    showBeliauPopup(
      'Beliau menandai titik baru',
      `Kawanan ikan julung-julung berputar di atas ${r.data.place}. Fakta tahun ${r.data.year} resmi masuk catatan Semua Bumi.`
    );
  }
}

function handleDuelPick(pickedKey) {
  const r = state.round;
  if (!r || r.mode !== 'duel' || r.revealed) return;

  const earlierKey = r.data.a.year <= r.data.b.year ? 'a' : 'b';
  const isCorrect = pickedKey === earlierKey;
  const points = isCorrect ? 2500 : 500;

  r.revealed = true;
  r.duelPicked = pickedKey;
  r.result = { isCorrect, earlierKey, points };

  state.globe.showDuelMarkers(r.data.a, r.data.b, earlierKey);

  state.account.score += points;
  state.account.roundsPlayed += 1;
  if (isCorrect) {
    state.account.streak = (state.account.streak || 0) + 1;
    state.account.bestStreak = Math.max(state.account.bestStreak || 0, state.account.streak);
    audio.playCorrect();
  } else {
    state.account.streak = 0;
    audio.playWrong();
  }

  unlockChallenge(r.data.id);
  persistAtlasSave(state.account);
  updateHud();
  renderChallengeCard();
}

function handleConnectToggle(cardId) {
  const r = state.round;
  if (!r || r.mode !== 'connect' || r.revealed) return;

  const idx = r.selectedCardIds.indexOf(cardId);
  if (idx >= 0) {
    r.selectedCardIds.splice(idx, 1);
  } else {
    if (r.selectedCardIds.length >= 3) r.selectedCardIds.shift();
    r.selectedCardIds.push(cardId);
  }
  r.wrongNote = '';
  audio.playClick();
  renderChallengeCard();
}

function handleConnectSubmit() {
  const r = state.round;
  if (!r || r.mode !== 'connect' || r.revealed || r.selectedCardIds.length !== 3) return;

  const answerSet = new Set(r.data.answerIds);
  const hits = r.selectedCardIds.filter((id) => answerSet.has(id)).length;

  if (hits === 3) {
    const points = 3000;
    r.revealed = true;
    r.wrongNote = '';
    r.result = { points, isCorrect: true };

    const winningCards = r.data.cards.filter((c) => answerSet.has(c.id));
    state.globe.setAutoRotate(false);
    state.globe.showConstellation(winningCards);

    state.account.score += points;
    state.account.roundsPlayed += 1;
    state.account.streak = (state.account.streak || 0) + 1;
    state.account.bestStreak = Math.max(state.account.bestStreak || 0, state.account.streak);
    audio.playGateUnlock();

    unlockChallenge(r.data.id);
    persistAtlasSave(state.account);
    updateHud();
    renderChallengeCard();
    showToast('Rasi benang merah menyala di bola bumi');
  } else {
    audio.playWrong();
    r.wrongNote =
      hits === 2
        ? '2 dari 3 kartu sudah masuk benang merah. Ganti satu kartu yang meleset.'
        : hits === 1
          ? 'Baru 1 kartu yang terhubung. Cari dua pasangan aslinya.'
          : 'Belum ada yang cocok. Cek petunjuk utamanya atau tanya Bus Damri.';
    renderChallengeCard();
    els.roundCard.classList.remove('shake');
    void els.roundCard.offsetWidth;
    els.roundCard.classList.add('shake');
  }
}

function renderChallengeCard() {
  const r = state.round;
  if (!r) return;

  const cat = getCategoryMeta(r.data.category);
  const modeLabel =
    r.mode === 'pin'
      ? 'Tancap Peta & Tahun'
      : r.mode === 'duel'
        ? 'Duel Garis Waktu'
        : 'Benang Merah';

  const headerHtml = `
    <div class="round-meta">
      <div class="round-badges">
        <span class="cat-badge">
          <span class="cat-dot" style="background:${cat.color}"></span>
          ${escapeHtml(cat.name)}
        </span>
        <span class="mode-badge">${modeLabel}</span>
      </div>
      ${!r.revealed ? '<button class="btn-ghost" id="btn-skip-round" type="button">Lewati</button>' : ''}
    </div>
  `;

  if (r.mode === 'pin') {
    if (!r.revealed) {
      const pinText = r.guess
        ? `Pin terpasang: ${escapeHtml(r.guess.placeLabel)} (${formatCoord(r.guess.lat, r.guess.lon)})`
        : 'Ketuk langsung permukaan bola bumi untuk menancapkan pin';

      els.roundCard.innerHTML = `
        ${headerHtml}
        <h2 class="round-title">${escapeHtml(r.data.title)}</h2>
        <p class="round-prompt">${escapeHtml(r.data.prompt)}</p>
        <div class="pin-status-row">
          <div class="pin-readout ${r.guess ? 'is-planted' : ''}">
            <span class="pin-indicator"></span>
            <span>${pinText}</span>
          </div>
        </div>
        <div class="year-control">
          <div class="year-label">
            Tebak tahun
            <strong id="year-val">${r.guessYear}</strong>
          </div>
          <div class="year-slider-wrap">
            <button class="year-nudge" data-nudge="-50" type="button">-50</button>
            <button class="year-nudge" data-nudge="-10" type="button">-10</button>
            <input
              id="year-slider"
              class="year-slider"
              type="range"
              min="${r.data.minYear}"
              max="${r.data.maxYear}"
              value="${r.guessYear}"
              aria-label="Pilih tebakan tahun"
            />
            <button class="year-nudge" data-nudge="10" type="button">+10</button>
            <button class="year-nudge" data-nudge="50" type="button">+50</button>
          </div>
        </div>
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Tanya Bus Damri</button>
          <button class="btn-primary" id="btn-lock-pin" type="button" ${r.guess ? '' : 'disabled'}>
            ${r.guess ? 'Kunci Tebakan' : 'Tancap Pin di Bumi Dulu'}
          </button>
        </div>
      `;

      const slider = document.getElementById('year-slider');
      const yearVal = document.getElementById('year-val');
      slider.addEventListener('input', () => {
        r.guessYear = Number(slider.value);
        yearVal.textContent = String(r.guessYear);
      });

      els.roundCard.querySelectorAll('.year-nudge').forEach((btn) => {
        btn.addEventListener('click', () => {
          const delta = Number(btn.dataset.nudge);
          r.guessYear = Math.max(r.data.minYear, Math.min(r.data.maxYear, r.guessYear + delta));
          slider.value = String(r.guessYear);
          yearVal.textContent = String(r.guessYear);
          audio.playClick();
        });
      });

      document.getElementById('btn-lock-pin').addEventListener('click', handlePinSubmit);
    } else {
      const res = r.result;
      const distText = res.distKm <= 120 ? 'Sangat dekat!' : `Jarak ${formatNumber(res.distKm)} km`;
      const yearText =
        res.yearDelta === 0
          ? 'Tahun tepat sasaran'
          : `Selisih ${res.yearDelta} tahun (tebakanmu ${r.guessYear})`;

      els.roundCard.innerHTML = `
        ${headerHtml}
        <div class="result-strip">
          <span class="result-summary">${distText} · ${yearText}</span>
          <span class="score-pill ${res.strongHit ? '' : 'soft'}">+${formatNumber(res.points)} poin</span>
        </div>
        <div class="wow-box">
          <div class="wow-head">
            <span>Oh, Baru Tahu</span>
            <span class="wow-place">${escapeHtml(r.data.place)} · ${r.data.year}</span>
          </div>
          <p class="wow-text">${escapeHtml(r.data.wowFact)}</p>
        </div>
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Cerita dari Bus Damri</button>
          <button class="btn-primary" id="btn-next-round" type="button">Ronde Berikutnya</button>
        </div>
      `;
    }
  } else if (r.mode === 'duel') {
    const slots = r.duelSwapped
      ? [
          { key: 'b', item: r.data.b, side: 'side-b' },
          { key: 'a', item: r.data.a, side: 'side-a' }
        ]
      : [
          { key: 'a', item: r.data.a, side: 'side-a' },
          { key: 'b', item: r.data.b, side: 'side-b' }
        ];

    const cardsHtml = slots
      .map((slot, idx) => {
        let extraCls = '';
        if (r.revealed) {
          if (slot.key === r.result.earlierKey) extraCls = 'is-earlier';
          else if (slot.key === r.duelPicked) extraCls = 'is-wrong';
        }
        const tag = idx === 0 ? 'Pilihan Kiri' : 'Pilihan Kanan';
        return `
          <button class="duel-card ${slot.side} ${extraCls}" data-key="${slot.key}" type="button" ${r.revealed ? 'disabled' : ''}>
            <div class="duel-card-top">
              <span class="duel-side-dot">${tag}</span>
              <span class="duel-year-pill">${r.revealed ? slot.item.year : '????'}</span>
            </div>
            <div class="duel-card-title">${escapeHtml(slot.item.title)}</div>
            <div class="duel-card-place">${escapeHtml(slot.item.place)}</div>
          </button>
        `;
      })
      .join('');

    if (!r.revealed) {
      els.roundCard.innerHTML = `
        ${headerHtml}
        <h2 class="round-title">Mana yang terjadi lebih dahulu?</h2>
        <div class="duel-grid">${cardsHtml}</div>
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Tanya Bus Damri</button>
          <span class="mode-badge">Dua titik terhubung di bola bumi</span>
        </div>
      `;
    } else {
      const verdict = r.result.isCorrect ? 'Tepat sekali.' : 'Hampir, ternyata yang satunya lebih awal.';
      els.roundCard.innerHTML = `
        ${headerHtml}
        <div class="result-strip">
          <span class="result-summary">${verdict}</span>
          <span class="score-pill ${r.result.isCorrect ? '' : 'soft'}">+${formatNumber(r.result.points)} poin</span>
        </div>
        <div class="duel-grid">${cardsHtml}</div>
        <div class="wow-box">
          <div class="wow-head">
            <span>Oh, Baru Tahu</span>
            <span class="wow-place">${r.data.a.year} vs ${r.data.b.year}</span>
          </div>
          <p class="wow-text">${escapeHtml(r.data.wowFact)}</p>
        </div>
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Cerita dari Bus Damri</button>
          <button class="btn-primary" id="btn-next-round" type="button">Ronde Berikutnya</button>
        </div>
      `;
    }

    els.roundCard.querySelectorAll('.duel-card').forEach((btn) => {
      btn.addEventListener('click', () => handleDuelPick(btn.dataset.key));
    });
  } else {
    const answerSet = new Set(r.data.answerIds);
    const chipsHtml = r.shuffledCards
      .map((card) => {
        let cls = 'connect-chip';
        if (r.revealed) {
          cls += answerSet.has(card.id) ? ' correct' : ' dimmed';
        } else if (r.selectedCardIds.includes(card.id)) {
          cls += ' selected';
        }
        return `
          <button class="${cls}" data-card-id="${card.id}" type="button" ${r.revealed ? 'disabled' : ''}>
            ${escapeHtml(card.label)}
          </button>
        `;
      })
      .join('');

    if (!r.revealed) {
      els.roundCard.innerHTML = `
        ${headerHtml}
        <p class="round-prompt">${escapeHtml(r.data.prompt)}</p>
        <div class="connect-grid">${chipsHtml}</div>
        ${r.wrongNote ? `<div class="connect-feedback">${escapeHtml(r.wrongNote)}</div>` : ''}
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Tanya Bus Damri</button>
          <div class="action-group">
            <span class="mode-badge">Terpilih ${r.selectedCardIds.length}/3</span>
            <button class="btn-primary" id="btn-submit-connect" type="button" ${r.selectedCardIds.length === 3 ? '' : 'disabled'}>
              Hubungkan 3 Kartu
            </button>
          </div>
        </div>
      `;

      els.roundCard.querySelectorAll('.connect-chip').forEach((btn) => {
        btn.addEventListener('click', () => handleConnectToggle(btn.dataset.cardId));
      });
      document.getElementById('btn-submit-connect').addEventListener('click', handleConnectSubmit);
    } else {
      els.roundCard.innerHTML = `
        ${headerHtml}
        <div class="result-strip">
          <span class="result-summary">Benang merah terhubung di 3 titik bumi</span>
          <span class="score-pill">+${formatNumber(r.result.points)} poin</span>
        </div>
        <div class="connect-grid">${chipsHtml}</div>
        <div class="wow-box">
          <div class="wow-head">
            <span>Oh, Baru Tahu</span>
            <span class="wow-place">${escapeHtml(r.data.threadTitle)}</span>
          </div>
          <p class="wow-text">${escapeHtml(r.data.wowFact)}</p>
        </div>
        <div class="action-row">
          <button class="btn-secondary" id="btn-ask-bus" type="button">Cerita dari Bus Damri</button>
          <button class="btn-primary" id="btn-next-round" type="button">Ronde Berikutnya</button>
        </div>
      `;
    }
  }

  const skipBtn = document.getElementById('btn-skip-round');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      audio.playClick();
      startChallengeRound(r.mode);
    });
  }

  const nextBtn = document.getElementById('btn-next-round');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playClick();
      startChallengeRound(r.mode);
    });
  }

  const askBtn = document.getElementById('btn-ask-bus');
  if (askBtn) {
    askBtn.addEventListener('click', askBusDamriAboutCurrent);
  }
}

// ==========================================
// BUS DAMRI (OBROLAN & PEMANDU 100% OFFLINE)
// ==========================================

function updateBusLiveSubtitle() {
  if (!state.globe || !els.busLocationSub) return;
  const loc = state.globe.getBusLocation();
  if (loc && loc.placeLabel) {
    els.busLocationSub.textContent = `Di atas ${loc.placeLabel}`;
  }
}

function setBusOpen(open) {
  state.busOpen = Boolean(open);
  els.busDrawer.classList.toggle('hidden', !state.busOpen);
  els.btnToggleBus.classList.toggle('active', state.busOpen);
  document.body.classList.toggle('bus-open', state.busOpen);
  els.hudLayer.classList.toggle('bus-open', state.busOpen);

  clearInterval(state.busLocInterval);
  if (state.busOpen) {
    updateBusLiveSubtitle();
    renderBusMessages();
    state.busLocInterval = setInterval(updateBusLiveSubtitle, 1200);
    setTimeout(() => {
      els.busMessages.scrollTop = els.busMessages.scrollHeight;
    }, 30);
  }
}

function appendBusChat(role, text) {
  if (!state.account) return;
  if (!state.account.busHistory) state.account.busHistory = [];
  state.account.busHistory.push({ role, text });
  if (state.account.busHistory.length > 28) {
    state.account.busHistory = state.account.busHistory.slice(-28);
  }
  persistAtlasSave(state.account);
  renderBusMessages();
}

function renderBusMessages() {
  if (!state.account) return;
  const history = state.account.busHistory || [];
  els.busMessages.innerHTML = history
    .map(
      (msg) =>
        `<div class="chat-bubble ${msg.role === 'user' ? 'user' : 'bus'}">${escapeHtml(msg.text)}</div>`
    )
    .join('');
  els.busMessages.scrollTop = els.busMessages.scrollHeight;
}

function getBusContext() {
  const mode = state.account ? state.account.selectedMode || 'explore' : 'explore';
  return {
    activeMode: mode,
    activeCountry: getCountryById(state.activeCountryId),
    activeRound: state.round ? state.round.data : null,
    revealed: state.round ? state.round.revealed : false,
    visitedCountryIds: state.account ? state.account.visitedCountryIds || [] : [],
    busLocation: state.globe ? state.globe.getBusLocation() : null
  };
}

function askBusDamriAboutCurrent() {
  setBusOpen(true);
  audio.playDialogueOpen();
  const ctx = getBusContext();
  const promptText =
    ctx.activeMode === 'explore' && ctx.activeCountry
      ? `Ceritakan tentang ${ctx.activeCountry.name}.`
      : ctx.revealed
        ? 'Ada catatan tambahan soal fakta ini?'
        : 'Minta petunjuk rute untuk tantangan ini.';
  appendBusChat('user', promptText);
  appendBusChat('bus', getBusContextNote(ctx));
}

function handleBusSubmit(text) {
  const clean = (text || '').trim();
  if (!clean || !state.account) return;

  appendBusChat('user', clean);
  const reply = replyFromBusDamri(clean, getBusContext());
  appendBusChat('bus', reply);
  audio.playClick();
}

function initBusChips() {
  els.busChips.innerHTML = BUS_QUICK_PROMPTS.map(
    (chip) => `<button class="bus-chip" data-chip="${chip.id}" type="button">${escapeHtml(chip.label)}</button>`
  ).join('');

  els.busChips.querySelectorAll('.bus-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.chip;
      if (id === 'current') {
        askBusDamriAboutCurrent();
      } else if (id === 'next-stop') {
        handleBusSubmit('Saran tujuan negara berikutnya');
      } else if (id === 'culture') {
        handleBusSubmit('Saran buku dan film menarik');
      } else if (id === 'summon') {
        audio.playWaypoint();
        state.globe.summonBusToBeliau();
        appendBusChat('user', 'Bus Damri, melintas ke dekat Beliau dong.');
        appendBusChat(
          'bus',
          'Baik, saya belokkan lintasan mendekati Beliau dan kawanan ikan julung-julung. Sebentar lagi lampu depan saya tampak di sisinya.'
        );
      }
    });
  });
}

// ==========================================
// MODAL ATLAS NEGERI & PROFIL
// ==========================================

function closeModal() {
  els.modalOverlay.classList.add('hidden');
  els.modalOverlay.innerHTML = '';
}

function openDiscoveryDetailModal(item) {
  if (item.kind === 'country') {
    const c = getCountryById(item.countryId);
    if (c) {
      switchMode('explore');
      selectExploreCountry(c, { flyCamera: true, showBeliau: true });
      return;
    }
  }
  const cat = getCategoryMeta(item.category);
  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">${escapeHtml(item.title)}</h2>
          <p class="modal-sub">${escapeHtml(cat.name)} · ${escapeHtml(item.place)}</p>
        </div>
        <button class="icon-close-btn" id="btn-close-modal" type="button">Tutup</button>
      </div>
      <p class="modal-sub">${escapeHtml(item.wowFact)}</p>
      <div class="action-row">
        <button class="btn-primary" id="btn-focus-globe" type="button">Fokuskan di Bumi 3D</button>
      </div>
    </div>
  `;
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-focus-globe').addEventListener('click', () => {
    state.globe.focusLatLon(item.lat, item.lon, 5.15);
    closeModal();
  });
}

function openCollectionModal() {
  const acc = state.account;
  if (!acc) return;
  const visitedSet = new Set(acc.visitedCountryIds || []);
  let filterMode = 'all'; // 'all' | 'visited'
  let searchQuery = '';

  const renderModalBody = () => {
    const q = searchQuery.trim().toLowerCase();
    const list = WORLD_COUNTRIES.filter((c) => {
      if (filterMode === 'visited' && !visitedSet.has(c.id)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    });

    const listEl = document.getElementById('atlas-collection-list');
    if (!listEl) return;

    if (!list.length) {
      listEl.innerHTML = '<p class="modal-sub">Tidak ada negara yang cocok dengan pencarian tersebut.</p>';
      return;
    }

    listEl.innerHTML = list
      .slice(0, 80)
      .map(
        (c) => `
        <div class="collection-item">
          <div class="collection-item-head">
            <div class="collection-title-group">
              <img class="collection-flag" src="${escapeHtml(c.flag)}" alt="" width="26" height="18" loading="lazy" />
              <div class="collection-item-title">${escapeHtml(c.name)} · ${escapeHtml(c.region)}${visitedSet.has(c.id) ? ' · Sudah disinggahi' : ''}</div>
            </div>
            <button class="btn-secondary btn-fly-country" data-country-id="${c.id}" type="button">
              Kunjungi
            </button>
          </div>
          <p class="collection-item-text"><strong>SDA:</strong> ${escapeHtml(c.sda[0])}</p>
          <p class="collection-item-text"><strong>Buku:</strong> ${escapeHtml(c.book.title)}</p>
        </div>
      `
      )
      .join('') +
      (list.length > 80
        ? `<p class="modal-sub">Menampilkan 80 dari ${list.length} negara. Ketik nama negara atau kawasan di kotak pencarian untuk menyaring lebih cepat.</p>`
        : '');

    listEl.querySelectorAll('.btn-fly-country').forEach((btn) => {
      btn.addEventListener('click', () => {
        const c = getCountryById(btn.dataset.countryId);
        closeModal();
        if (c) {
          switchMode('explore');
          selectExploreCountry(c, { flyCamera: true, showBeliau: true });
        }
      });
    });
  };

  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.innerHTML = `
    <div class="modal-card wide">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">Atlas ${getTotalCountries()} Negeri (${visitedSet.size}/${getTotalCountries()})</h2>
          <p class="modal-sub">Tantangan terbuka: ${(acc.unlockedIds || []).length}/${TOTAL_CHALLENGES} · Pertemuan Bus Damri: ${acc.busEncounters || 0} kali</p>
        </div>
        <button class="icon-close-btn" id="btn-close-modal" type="button">Tutup</button>
      </div>
      <div class="atlas-toolbar">
        <input id="atlas-search-input" class="atlas-search" type="search" placeholder="Cari dari 195 negara, ibu kota, atau kawasan..." />
        <div class="explore-tabs">
          <button class="explore-tab active" data-atlas-filter="all" type="button">Semua (${getTotalCountries()})</button>
          <button class="explore-tab" data-atlas-filter="visited" type="button">Dijelajahi (${visitedSet.size})</button>
        </div>
      </div>
      <div class="collection-list" id="atlas-collection-list"></div>
    </div>
  `;

  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  const searchInput = document.getElementById('atlas-search-input');
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderModalBody();
  });
  els.modalOverlay.querySelectorAll('[data-atlas-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filterMode = btn.dataset.atlasFilter;
      els.modalOverlay.querySelectorAll('[data-atlas-filter]').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      renderModalBody();
    });
  });

  renderModalBody();
}

function openProfileModal() {
  const acc = state.account;
  if (!acc) return;
  const others = listAtlasAccounts().filter((a) => a.username.toLowerCase() !== acc.username.toLowerCase());

  const othersHtml = others.length
    ? `
      <div class="saved-accounts">
        <div class="saved-label">Ganti Akun Tersimpan</div>
        ${others
          .map(
            (o) => `
          <button class="saved-account-btn" data-switch="${escapeHtml(o.username)}" type="button">
            <strong>@${escapeHtml(o.username)}</strong>
            <span>${(o.visitedCountryIds || []).length}/${getTotalCountries()} negeri · ${formatNumber(o.score)} poin</span>
          </button>
        `
          )
          .join('')}
      </div>
    `
    : '';

  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">@${escapeHtml(acc.username)}</h2>
          <p class="modal-sub">Penjelajah Semua Bumi</p>
        </div>
        <button class="icon-close-btn" id="btn-close-modal" type="button">Tutup</button>
      </div>
      <p class="modal-sub">
        ${(acc.visitedCountryIds || []).length} dari ${getTotalCountries()} negeri dijelajahi · Skor ${formatNumber(acc.score)} · ${acc.busEncounters || 0} pertemuan dengan Bus Damri di langit.
      </p>
      <div class="action-row">
        <button class="btn-secondary" id="btn-new-account" type="button">Buat Akun Baru</button>
        <button class="btn-ghost" id="btn-reset-progress" type="button">Ulangi Progres Akun Ini</button>
      </div>
      ${othersHtml}
    </div>
  `;

  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-new-account').addEventListener('click', () => {
    closeModal();
    openAuthStep1();
  });
  document.getElementById('btn-reset-progress').addEventListener('click', () => {
    state.account = resetAtlasAccount(acc);
    state.activeCountryId = 'indonesia';
    syncEarthStarsAndLabels();
    updateHud();
    renderBusMessages();
    closeModal();
    switchMode('explore');
    showToast('Progres akun dikembalikan ke awal');
  });
  els.modalOverlay.querySelectorAll('[data-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const switched = switchAtlasAccount(btn.dataset.switch);
      if (switched) {
        closeModal();
        enterGame(switched);
      }
    });
  });
}

// ==========================================
// PENDAFTARAN AKUN & VERIFIKASI (BERSIH)
// ==========================================

function openAuthStep1() {
  const saved = listAtlasAccounts();
  els.hudLayer.classList.add('hidden');
  state.globe.setLabelsVisible(false);
  els.authOverlay.classList.remove('hidden');

  const savedHtml = saved.length
    ? `
      <div class="saved-accounts">
        <div class="saved-label">Lanjutkan Akun Tersimpan</div>
        ${saved
          .map(
            (a) => `
          <button class="saved-account-btn" data-login="${escapeHtml(a.username)}" type="button">
            <strong>@${escapeHtml(a.username)}</strong>
            <span>${(a.visitedCountryIds || []).length}/${getTotalCountries()} negeri · ${formatNumber(a.score)} poin</span>
          </button>
        `
          )
          .join('')}
      </div>
    `
    : '';

  els.authOverlay.innerHTML = `
    <div class="modal-card">
      <div>
        <h1 class="modal-title">Semua Bumi</h1>
        <p class="modal-sub" style="margin-top:6px;">
          Kelilingi bumi 3D berlabel bersama Beliau, kawanan ikan julung-julung terbang, dan Bus Damri untuk mengenal hasil bumi, buku, film, dan karya tiap negeri.
        </p>
      </div>
      <form id="auth-user-form">
        <input
          id="auth-username"
          class="field-input"
          type="text"
          maxlength="20"
          autocomplete="off"
          placeholder="Buat username (3-20 huruf/angka)"
        />
        <div class="error-msg" id="auth-error"></div>
        <div class="action-row" style="margin-top:6px; justify-content:flex-end;">
          <button class="btn-primary" type="submit">Lanjut ke Verifikasi</button>
        </div>
      </form>
      ${savedHtml}
    </div>
  `;

  const form = document.getElementById('auth-user-form');
  const input = document.getElementById('auth-username');
  const errEl = document.getElementById('auth-error');
  setTimeout(() => input.focus(), 40);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(raw)) {
      errEl.textContent = 'Gunakan 3 sampai 20 karakter huruf, angka, atau garis bawah.';
      return;
    }
    const existing = listAtlasAccounts().find((a) => a.username.toLowerCase() === raw.toLowerCase());
    if (existing) {
      enterGame(switchAtlasAccount(existing.username));
      return;
    }
    audio.playClick();
    openAuthStep2(raw, 0);
  });

  els.authOverlay.querySelectorAll('[data-login]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const acc = switchAtlasAccount(btn.dataset.login);
      if (acc) {
        audio.playClick();
        enterGame(acc);
      }
    });
  });
}

function openAuthStep2(username, qIndex) {
  const item = VERIFICATION_QUESTIONS[qIndex];
  if (!item) {
    const fresh = registerAtlasAccount(username);
    audio.playCorrect();
    enterGame(fresh);
    return;
  }

  els.authOverlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">Verifikasi Akun @${escapeHtml(username)}</h2>
        </div>
        <span class="step-progress">${qIndex + 1} / 3</span>
      </div>
      <p class="quiz-q">${escapeHtml(item.q)}</p>
      <div class="quiz-options">
        ${item.options
          .map(
            (opt, idx) =>
              `<button class="quiz-opt" data-idx="${idx}" type="button">${escapeHtml(opt)}</button>`
          )
          .join('')}
      </div>
      <div class="error-msg" id="quiz-tip"></div>
      <div class="action-row">
        <button class="btn-ghost" id="btn-back-step1" type="button">Ganti Username</button>
      </div>
    </div>
  `;

  document.getElementById('btn-back-step1').addEventListener('click', openAuthStep1);
  const tipEl = document.getElementById('quiz-tip');

  els.authOverlay.querySelectorAll('.quiz-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      if (idx === item.answer) {
        audio.playCorrect();
        openAuthStep2(username, qIndex + 1);
      } else {
        audio.playWrong();
        tipEl.textContent = item.tip;
      }
    });
  });
}

// ==========================================
// PERPINDAHAN MODE & INISIALISASI
// ==========================================

function switchMode(mode) {
  if (!state.account) return;
  state.account.selectedMode = mode;
  persistAtlasSave(state.account);
  updateHud();

  if (mode === 'explore') {
    const c = getCountryById(state.activeCountryId) || WORLD_COUNTRIES[0];
    selectExploreCountry(c, { flyCamera: true, showBeliau: false });
  } else {
    startChallengeRound(mode);
  }
}

function enterGame(account) {
  state.account = account;
  audio.setMuted(Boolean(account.muted));
  els.authOverlay.classList.add('hidden');
  els.authOverlay.innerHTML = '';
  els.hudLayer.classList.remove('hidden');

  const visitedSet = new Set(account.visitedCountryIds || ['indonesia']);
  state.activeCountryId = account.visitedCountryIds && account.visitedCountryIds.length
    ? account.visitedCountryIds[account.visitedCountryIds.length - 1]
    : 'indonesia';

  state.globe.setCountryLabels(WORLD_COUNTRIES, visitedSet, state.activeCountryId);
  syncEarthStarsAndLabels();
  updateHud();
  renderBusMessages();
  setBusOpen(false);

  const initialMode = account.selectedMode || 'explore';
  if (initialMode === 'explore') {
    const startCountry = getCountryById(state.activeCountryId) || WORLD_COUNTRIES[0];
    selectExploreCountry(startCountry, { flyCamera: true, showBeliau: false });
    showBeliauPopup(
      'Beliau & Ikan Julung-Julung',
      `Beliau melayang tenang di atas ${startCountry.name} ditemani kawanan ikan terbang. Di kejauhan, lampu Bus Damri ikut berputar mengelilingi bumi.`
    );
  } else {
    startChallengeRound(initialMode);
  }
}

function populateSelectMenus() {
  const sortedCountries = [...WORLD_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'id'));
  els.countryJumpSelect.innerHTML = sortedCountries
    .map((c) => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.region)})</option>`)
    .join('');

  els.categorySelect.innerHTML = CATEGORIES.map(
    (c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`
  ).join('');
}

function bindGlobalEvents() {
  els.countryJumpSelect.addEventListener('change', () => {
    const picked = getCountryById(els.countryJumpSelect.value);
    if (picked) {
      selectExploreCountry(picked, { flyCamera: true, showBeliau: true });
    }
  });

  els.categorySelect.addEventListener('change', () => {
    if (!state.account) return;
    state.account.selectedCategory = els.categorySelect.value;
    persistAtlasSave(state.account);
    audio.playClick();
    if (state.account.selectedMode !== 'explore') {
      startChallengeRound(state.account.selectedMode);
    }
  });

  els.modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      audio.playClick();
      switchMode(tab.dataset.mode);
    });
  });

  els.btnSound.addEventListener('click', () => {
    if (!state.account) return;
    state.account.muted = !state.account.muted;
    audio.setMuted(state.account.muted);
    persistAtlasSave(state.account);
    updateHud();
    if (!state.account.muted) audio.playClick();
  });

  els.btnToggleBus.addEventListener('click', () => {
    audio.playClick();
    setBusOpen(!state.busOpen);
  });

  els.btnCloseBus.addEventListener('click', () => {
    audio.playClick();
    setBusOpen(false);
  });

  els.btnFollowBus.addEventListener('click', () => {
    audio.playClick();
    state.globe.focusBusDamri();
    const loc = state.globe.getBusLocation();
    showToast(`Kamera mengikuti Bus Damri di atas ${loc.placeLabel}`);
  });

  els.btnCloseBeliau.addEventListener('click', hideBeliauPopup);

  els.btnBeliauGreetBus.addEventListener('click', () => {
    hideBeliauPopup();
    setBusOpen(true);
    audio.playDialogueOpen();
    const loc = state.globe.getBusLocation();
    appendBusChat('user', 'Halo Bus Damri, senang berpapasan di langit.');
    appendBusChat(
      'bus',
      `Senang bertemu lagi dengan Beliau dan kawanan ikan julung-julung di atas ${loc.placeLabel}. Mau saya ceritakan negeri di bawah kita atau memilih tujuan berikutnya?`
    );
  });

  els.busForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = els.busInput.value;
    if (!val.trim()) return;
    els.busInput.value = '';
    handleBusSubmit(val);
  });

  els.btnCollection.addEventListener('click', () => {
    audio.playClick();
    openCollectionModal();
  });

  els.btnProfile.addEventListener('click', () => {
    audio.playClick();
    openProfileModal();
  });

  els.modalOverlay.addEventListener('click', (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
}

async function bootstrap() {
  try {
    await loadWorldCountries();
  } catch {
    showToast('Gagal memuat daftar negara. Coba muat ulang halaman.');
  }
  populateSelectMenus();
  initBusChips();
  bindGlobalEvents();

  state.globe = new AtlasGlobe3D(els.canvas, {
    labelsContainer: els.labelsLayer,
    onHover: (hit) => {
      if (!hit) {
        els.hoverPill.textContent = 'Geser untuk memutar bumi · Ketuk label negara untuk menjelajah';
        return;
      }
      if (hit.specialLabel) {
        els.hoverPill.textContent = hit.specialLabel;
        return;
      }
      els.hoverPill.textContent = `${hit.placeLabel} · ${formatCoord(hit.lat, hit.lon)}`;
    },
    onCountryLabelClick: (country) => {
      if (!state.account) return;
      if (state.account.selectedMode !== 'explore') {
        state.account.selectedMode = 'explore';
        persistAtlasSave(state.account);
      }
      selectExploreCountry(country, { flyCamera: true, showBeliau: true });
    },
    onGlobeClick: (hit) => {
      if (!state.account) return;
      // Mode Tancap Peta: tanam pin tebakan
      if (state.round && state.round.mode === 'pin' && !state.round.revealed) {
        state.round.guess = {
          lat: hit.lat,
          lon: hit.lon,
          placeLabel: hit.placeLabel
        };
        state.globe.setAutoRotate(false);
        state.globe.setGuessPin(hit.lat, hit.lon);
        audio.playClick();
        renderChallengeCard();
        return;
      }
      // Mode Jelajah: ketuk daratan dekat salah satu dari 30 negara langsung menerbangkan Beliau ke sana
      if ((state.account.selectedMode || 'explore') === 'explore') {
        const nearest = findNearestCountry(hit.lat, hit.lon, 14);
        if (nearest) {
          selectExploreCountry(nearest, { flyCamera: true, showBeliau: true });
        } else {
          state.globe.flyBeliauTo(hit.lat, hit.lon);
          showBeliauPopup(
            'Beliau & Ikan Terbang',
            `Beliau melintasi ${hit.placeLabel} (${formatCoord(hit.lat, hit.lon)}). Kawanan ikan julung-julung melesat ringan di atas arus udara.`
          );
        }
      }
    },
    onBeliauClick: () => {
      if (!state.account) return;
      audio.playDialogueOpen();
      const c = getCountryById(state.activeCountryId);
      const text = c
        ? c.beliauNote
        : 'Beliau hanya tersenyum tenang sambil membiarkan ikan-ikan julung-julung menari di atas kepalanya.';
      showBeliauPopup('Beliau & Ikan Julung-Julung', text, { duration: 7500 });
    },
    onBusClick: (loc) => {
      if (!state.account) return;
      audio.playDialogueOpen();
      setBusOpen(true);
      appendBusChat(
        'bus',
        `Halo, kamu baru saja mengetuk atap saya di atas ${loc.placeLabel}. Mau tahu hasil bumi, buku, atau film dari negeri di bawah sana?`
      );
    },
    onBusEncounter: (info) => {
      if (!state.account || els.hudLayer.classList.contains('hidden')) return;
      state.account.busEncounters = (state.account.busEncounters || 0) + 1;
      state.account.score += 300;
      persistAtlasSave(state.account);
      updateHud();
      audio.playWaypoint();

      const msg = `Bus Damri berpapasan tepat di samping Beliau dan kawanan ikan julung-julung di atas ${info.placeLabel} (+300 poin).`;
      showBeliauPopup('Pertemuan di Langit', msg, { showGreetBus: true, duration: 10500 });
      appendBusChat(
        'bus',
        `Saya baru saja berpapasan dengan Beliau dan kawanan ikan terbang di atas ${info.placeLabel}. Lampu kabin sempat saya kedipkan sebagai tanda sapa.`
      );
    },
    onUnlockedPinClick: (item) => {
      audio.playDialogueOpen();
      openDiscoveryDetailModal(item);
    }
  });

  window.__semuaBumi = { state };

  const active = getActiveAtlasAccount();
  if (active) {
    enterGame(active);
  } else {
    openAuthStep1();
  }
}

bootstrap();
