// Pengendali utama Atlas Bumi 3D: 3 mode wawasan interaktif, bola bumi 3D, koleksi bintang, dan Ramyeon offline.

import {
  CATEGORIES,
  ATLAS_PIN_ROUNDS,
  TIMELINE_DUELS,
  CONNECTION_ROUNDS,
  getCategoryMeta
} from './atlas_data.js';
import { AtlasGlobe3D, haversineKm, formatCoord } from './globe3d.js';
import { RAMYEON_QUICK_PROMPTS, getRoundAdviceText, replyToRamyeon } from './ramyeon.js';
import {
  listAtlasAccounts,
  getActiveAtlasAccount,
  registerAtlasAccount,
  switchAtlasAccount,
  persistAtlasSave,
  resetAtlasAccount
} from './atlas_storage.js';
import { audio } from './audio.js';

const TOTAL_DISCOVERIES =
  ATLAS_PIN_ROUNDS.length + TIMELINE_DUELS.length + CONNECTION_ROUNDS.length;

const VERIFICATION_QUESTIONS = [
  {
    q: 'Dari mana lebih dari 98 persen data internet antarbenua mengalir hari ini?',
    options: [
      'Kabel serat optik di dasar samudra',
      'Satelit luar angkasa semata',
      'Menara pemancar di puncak pegunungan'
    ],
    answer: 0,
    tip: 'Hampir seluruh lalu lintas data global sebenarnya melesat lewat kabel serat optik bawah laut.'
  },
  {
    q: 'Mana yang berdiri lebih dahulu dalam sejarah dunia?',
    options: [
      'Universitas Oxford di Inggris (1096)',
      'Ibu kota Kekaisaran Aztek di Meksiko (1325)',
      'Mesin cetak Gutenberg di Jerman (1450)'
    ],
    answer: 0,
    tip: 'Universitas Oxford mulai mengajar sekitar 1096, lebih dari dua abad sebelum Tenochtitlan berdiri.'
  },
  {
    q: 'Novel klasik mana yang konsepnya lahir saat hujan gelap akibat abu letusan Gunung Tambora 1815?',
    options: [
      'Frankenstein karya Mary Shelley',
      'Sherlock Holmes karya Arthur Conan Doyle',
      'The Great Gatsby karya F. Scott Fitzgerald'
    ],
    answer: 0,
    tip: 'Letusan Tambora memicu Tahun Tanpa Musim Panas 1816 di Eropa saat Mary Shelley mengarang Frankenstein.'
  }
];

const MIX_SEQUENCE = ['pin', 'duel', 'pin', 'connect'];

const state = {
  account: null,
  globe: null,
  mixIndex: 0,
  lastRoundId: null,
  ramyeonOpen: false,
  round: null, // { mode, data, revealed, guess, guessYear, duelSwapped, duelPicked, selectedCardIds, shuffledCards, wrongNote, result }
  toastTimer: null
};

const els = {
  canvas: document.getElementById('globe-canvas'),
  hudLayer: document.getElementById('hud-layer'),
  hudInitial: document.getElementById('hud-initial'),
  hudScore: document.getElementById('hud-score'),
  hudStreak: document.getElementById('hud-streak'),
  hudCollection: document.getElementById('hud-collection'),
  categorySelect: document.getElementById('category-select'),
  hoverPill: document.getElementById('globe-hover-pill'),
  modeTabs: Array.from(document.querySelectorAll('.mode-tab')),
  btnProfile: document.getElementById('btn-open-profile'),
  btnCollection: document.getElementById('btn-open-collection'),
  btnSound: document.getElementById('btn-toggle-sound'),
  btnToggleRamyeon: document.getElementById('btn-toggle-ramyeon'),
  btnCloseRamyeon: document.getElementById('btn-close-ramyeon'),
  roundCard: document.getElementById('round-card'),
  ramyeonDrawer: document.getElementById('ramyeon-drawer'),
  ramyeonMessages: document.getElementById('ramyeon-messages'),
  ramyeonChips: document.getElementById('ramyeon-chips'),
  ramyeonForm: document.getElementById('ramyeon-form'),
  ramyeonInput: document.getElementById('ramyeon-input'),
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
  }, 2500);
}

// Katalog lengkap untuk referensi koleksi dan pin permanen di bola bumi
function getAllDiscoveryEntries() {
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

const ALL_ENTRIES = getAllDiscoveryEntries();

function syncUnlockedLandmarks() {
  if (!state.globe || !state.account) return;
  const set = new Set(state.account.unlockedIds || []);
  const unlockedPins = ALL_ENTRIES.filter((e) => set.has(e.id) && e.mode === 'pin');
  state.globe.syncUnlockedPins(unlockedPins);
}

function unlockDiscovery(id) {
  if (!state.account) return false;
  if (!state.account.unlockedIds) state.account.unlockedIds = [];
  if (!state.account.unlockedIds.includes(id)) {
    state.account.unlockedIds.push(id);
    syncUnlockedLandmarks();
    return true;
  }
  return false;
}

function updateHud() {
  const acc = state.account;
  if (!acc) return;

  els.hudInitial.textContent = (acc.username || 'A').slice(0, 1).toUpperCase();
  els.hudScore.textContent = formatNumber(acc.score);
  els.hudStreak.textContent = String(acc.streak || 0);
  els.hudCollection.textContent = `${(acc.unlockedIds || []).length}/${TOTAL_DISCOVERIES}`;
  els.categorySelect.value = acc.selectedCategory || 'all';
  els.btnSound.textContent = acc.muted ? 'Bisukan' : 'Suara';

  els.modeTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === (acc.selectedMode || 'mix'));
  });
}

// ==========================================
// PEMILIHAN RONDE & LOGIKA 3 MODE
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

function startNextRound(forcedMode = null) {
  if (!state.account) return;

  const prefMode = forcedMode || state.account.selectedMode || 'mix';
  let actualMode = prefMode;
  if (prefMode === 'mix') {
    actualMode = MIX_SEQUENCE[state.mixIndex % MIX_SEQUENCE.length];
    state.mixIndex += 1;
  }

  const category = state.account.selectedCategory || 'all';
  const pool = getPoolForMode(actualMode, category);
  const unlockedSet = new Set(state.account.unlockedIds || []);

  // Utamakan fakta yang belum pernah dibuka dan jangan ulang langsung ronde terakhir
  let candidates = pool.filter((item) => !unlockedSet.has(item.id) && item.id !== state.lastRoundId);
  if (!candidates.length) {
    candidates = pool.filter((item) => item.id !== state.lastRoundId);
  }
  if (!candidates.length) {
    candidates = pool;
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  state.lastRoundId = picked.id;

  const midYear =
    actualMode === 'pin'
      ? Math.round((picked.minYear + picked.maxYear) / 2)
      : null;

  state.round = {
    mode: actualMode,
    data: picked,
    revealed: false,
    guess: null,
    guessYear: midYear,
    duelSwapped: Math.random() < 0.5,
    duelPicked: null,
    selectedCardIds: [],
    shuffledCards: actualMode === 'connect' ? shuffleCopy(picked.cards) : [],
    wrongNote: '',
    result: null
  };

  state.globe.clearRoundVisuals();

  if (actualMode === 'pin') {
    state.globe.setPinMode(true);
    state.globe.setAutoRotate(true);
  } else if (actualMode === 'duel') {
    state.globe.setPinMode(false);
    state.globe.setAutoRotate(false);
    state.globe.showDuelMarkers(picked.a, picked.b, null);
  } else {
    state.globe.setPinMode(false);
    state.globe.setAutoRotate(true);
  }

  renderRoundCard();
}

function computePinScore(distKm, yearDelta, minYear, maxYear) {
  const distScore = distKm <= 150 ? 6000 : Math.round(6000 * Math.exp(-distKm / 2600));
  const span = Math.max(30, maxYear - minYear);
  const yearScore =
    yearDelta === 0 ? 4000 : Math.round(4000 * Math.exp(-yearDelta / (span * 0.22)));
  return {
    distScore,
    yearScore,
    total: distScore + yearScore
  };
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

  const isNew = unlockDiscovery(r.data.id);
  persistAtlasSave(state.account);
  updateHud();
  renderRoundCard();

  if (isNew) {
    showToast(`Bintang baru terpasang di ${r.data.place}`);
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
  r.result = {
    isCorrect,
    earlierKey,
    points
  };

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

  unlockDiscovery(r.data.id);
  persistAtlasSave(state.account);
  updateHud();
  renderRoundCard();
}

function handleConnectToggle(cardId) {
  const r = state.round;
  if (!r || r.mode !== 'connect' || r.revealed) return;

  const idx = r.selectedCardIds.indexOf(cardId);
  if (idx >= 0) {
    r.selectedCardIds.splice(idx, 1);
  } else {
    if (r.selectedCardIds.length >= 3) {
      r.selectedCardIds.shift();
    }
    r.selectedCardIds.push(cardId);
  }
  r.wrongNote = '';
  audio.playClick();
  renderRoundCard();
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

    unlockDiscovery(r.data.id);
    persistAtlasSave(state.account);
    updateHud();
    renderRoundCard();
    showToast('Rasi benang merah menyala di bola bumi');
  } else {
    audio.playWrong();
    r.wrongNote =
      hits === 2
        ? '2 dari 3 kartu sudah masuk benang merah. Cek lagi satu kartu yang meleset.'
        : hits === 1
          ? 'Baru 1 kartu yang terhubung. Coba cari dua pasangan aslinya.'
          : 'Belum ada yang cocok. Coba baca ulang petunjuk utamanya atau tanya Ramyeon.';
    renderRoundCard();
    els.roundCard.classList.remove('shake');
    void els.roundCard.offsetWidth;
    els.roundCard.classList.add('shake');
  }
}

// ==========================================
// RENDER KARTU RONDE
// ==========================================

function renderRoundCard() {
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
      ${
        !r.revealed
          ? '<button class="btn-ghost" id="btn-skip-round" type="button">Lewati</button>'
          : ''
      }
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
          <button class="btn-secondary" id="btn-ask-hint" type="button">Saran Ramyeon</button>
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
          <button class="btn-secondary" id="btn-ask-more" type="button">Cerita Lanjutan dari Ramyeon</button>
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
              <span>${tag}</span>
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
          <button class="btn-secondary" id="btn-ask-hint" type="button">Saran Ramyeon</button>
          <span class="mode-badge">Lihat lengkung dua titik di bola bumi</span>
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
          <button class="btn-secondary" id="btn-ask-more" type="button">Tanya Ramyeon</button>
          <button class="btn-primary" id="btn-next-round" type="button">Ronde Berikutnya</button>
        </div>
      `;
    }

    els.roundCard.querySelectorAll('.duel-card').forEach((btn) => {
      btn.addEventListener('click', () => handleDuelPick(btn.dataset.key));
    });
  } else {
    // Mode 3: Benang Merah
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
          <button class="btn-secondary" id="btn-ask-hint" type="button">Saran Ramyeon</button>
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
          <button class="btn-secondary" id="btn-ask-more" type="button">Tanya Ramyeon</button>
          <button class="btn-primary" id="btn-next-round" type="button">Ronde Berikutnya</button>
        </div>
      `;
    }
  }

  // Kaitkan tombol aksi bersama
  const skipBtn = document.getElementById('btn-skip-round');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      audio.playClick();
      startNextRound();
    });
  }

  const nextBtn = document.getElementById('btn-next-round');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      audio.playClick();
      startNextRound();
    });
  }

  const hintBtn = document.getElementById('btn-ask-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      askRamyeonForRound(false);
    });
  }

  const moreBtn = document.getElementById('btn-ask-more');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      askRamyeonForRound(true);
    });
  }
}

// ==========================================
// RAMYEON (TEMAN SARAN & OBROLAN OFFLINE)
// ==========================================

function setRamyeonOpen(open) {
  state.ramyeonOpen = Boolean(open);
  els.ramyeonDrawer.classList.toggle('hidden', !state.ramyeonOpen);
  els.btnToggleRamyeon.classList.toggle('active', state.ramyeonOpen);
  document.body.classList.toggle('ramyeon-open', state.ramyeonOpen);
  els.hudLayer.classList.toggle('ramyeon-open', state.ramyeonOpen);
  if (state.ramyeonOpen) {
    renderRamyeonMessages();
    setTimeout(() => {
      els.ramyeonMessages.scrollTop = els.ramyeonMessages.scrollHeight;
    }, 30);
  }
}

function appendRamyeonChat(role, text) {
  if (!state.account) return;
  if (!state.account.ramyeonHistory) state.account.ramyeonHistory = [];
  state.account.ramyeonHistory.push({ role, text });
  if (state.account.ramyeonHistory.length > 26) {
    state.account.ramyeonHistory = state.account.ramyeonHistory.slice(-26);
  }
  persistAtlasSave(state.account);
  renderRamyeonMessages();
}

function renderRamyeonMessages() {
  if (!state.account) return;
  const history = state.account.ramyeonHistory || [];
  els.ramyeonMessages.innerHTML = history
    .map(
      (msg) =>
        `<div class="chat-bubble ${msg.role === 'user' ? 'user' : 'ramyeon'}">${escapeHtml(msg.text)}</div>`
    )
    .join('');
  els.ramyeonMessages.scrollTop = els.ramyeonMessages.scrollHeight;
}

function askRamyeonForRound(afterReveal = false) {
  setRamyeonOpen(true);
  audio.playDialogueOpen();
  const r = state.round;
  const userLabel = afterReveal ? 'Ada cerita tambahan soal fakta ini?' : 'Minta saran untuk ronde ini.';
  appendRamyeonChat('user', userLabel);
  const reply = getRoundAdviceText(r ? r.data : null, r ? r.mode : 'pin', afterReveal);
  appendRamyeonChat('ramyeon', reply);
}

function handleRamyeonSubmit(text) {
  const clean = (text || '').trim();
  if (!clean || !state.account) return;

  appendRamyeonChat('user', clean);
  const r = state.round;
  const reply = replyToRamyeon(clean, {
    username: state.account.username,
    activeMode: r ? r.mode : 'pin',
    activeRound: r ? r.data : null,
    revealed: r ? r.revealed : false,
    unlockedCount: (state.account.unlockedIds || []).length,
    totalCount: TOTAL_DISCOVERIES
  });
  appendRamyeonChat('ramyeon', reply);
  audio.playClick();
}

function initRamyeonChips() {
  els.ramyeonChips.innerHTML = RAMYEON_QUICK_PROMPTS.map(
    (chip) => `<button class="ramyeon-chip" data-chip="${chip.id}" type="button">${escapeHtml(chip.label)}</button>`
  ).join('');

  els.ramyeonChips.querySelectorAll('.ramyeon-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.chip;
      if (id === 'hint') {
        askRamyeonForRound(state.round ? state.round.revealed : false);
      } else if (id === 'fact') {
        handleRamyeonSubmit('Kasih satu fakta tak terduga dong');
      } else if (id === 'movie') {
        handleRamyeonSubmit('Saran film seru buat ditonton');
      } else if (id === 'book') {
        handleRamyeonSubmit('Saran buku menarik buat dibaca');
      }
    });
  });
}

// ==========================================
// MODAL KOLEKSI PENEMUAN & PROFIL AKUN
// ==========================================

function closeModal() {
  els.modalOverlay.classList.add('hidden');
  els.modalOverlay.innerHTML = '';
}

function openDiscoveryDetailModal(item) {
  const cat = getCategoryMeta(item.category);
  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <div class="modal-kicker">${escapeHtml(cat.name)} · ${escapeHtml(item.place)}</div>
          <h2 class="modal-title">${escapeHtml(item.title)}</h2>
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
    state.globe.focusLatLon(item.lat, item.lon, 5.2);
    closeModal();
  });
}

function openCollectionModal() {
  const acc = state.account;
  if (!acc) return;
  const unlockedSet = new Set(acc.unlockedIds || []);
  const unlockedItems = ALL_ENTRIES.filter((e) => unlockedSet.has(e.id));

  const listHtml = unlockedItems.length
    ? unlockedItems
        .map((item) => {
          const cat = getCategoryMeta(item.category);
          return `
            <div class="collection-item">
              <div class="collection-item-head">
                <span class="cat-badge">
                  <span class="cat-dot" style="background:${cat.color}"></span>
                  ${escapeHtml(cat.name)}
                </span>
                <button class="btn-secondary btn-fly-item" data-lat="${item.lat}" data-lon="${item.lon}" type="button">
                  Lihat di Bumi
                </button>
              </div>
              <div class="collection-item-title">${escapeHtml(item.title)} · ${escapeHtml(item.place)}</div>
              <p class="collection-item-text">${escapeHtml(item.wowFact)}</p>
            </div>
          `;
        })
        .join('')
    : '<p class="modal-sub">Belum ada bintang yang terbuka. Selesaikan satu ronde di bola bumi untuk mulai mengisi atlas pribadimu.</p>';

  els.modalOverlay.classList.remove('hidden');
  els.modalOverlay.innerHTML = `
    <div class="modal-card wide">
      <div class="modal-header">
        <div>
          <div class="modal-kicker">Atlas Penemuan</div>
          <h2 class="modal-title">${unlockedItems.length} dari ${TOTAL_DISCOVERIES} Fakta Terbuka</h2>
        </div>
        <button class="icon-close-btn" id="btn-close-modal" type="button">Tutup</button>
      </div>
      <div class="collection-list">${listHtml}</div>
    </div>
  `;

  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  els.modalOverlay.querySelectorAll('.btn-fly-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lat = Number(btn.dataset.lat);
      const lon = Number(btn.dataset.lon);
      closeModal();
      state.globe.setAutoRotate(false);
      state.globe.focusLatLon(lat, lon, 5.1);
      showToast('Kamera diarahkan ke titik penemuan');
    });
  });
}

function openProfileModal() {
  const acc = state.account;
  if (!acc) return;
  const others = listAtlasAccounts().filter((a) => a.username.toLowerCase() !== acc.username.toLowerCase());

  const othersHtml = others.length
    ? `
      <div class="saved-accounts">
        <div class="modal-kicker">Ganti Akun Tersimpan</div>
        ${others
          .map(
            (o) => `
          <button class="saved-account-btn" data-switch="${escapeHtml(o.username)}" type="button">
            <strong>@${escapeHtml(o.username)}</strong>
            <span>${formatNumber(o.score)} poin · ${(o.unlockedIds || []).length}/${TOTAL_DISCOVERIES}</span>
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
          <div class="modal-kicker">Profil Penjelajah</div>
          <h2 class="modal-title">@${escapeHtml(acc.username)}</h2>
        </div>
        <button class="icon-close-btn" id="btn-close-modal" type="button">Tutup</button>
      </div>
      <p class="modal-sub">
        Skor total ${formatNumber(acc.score)} · Rekor streak ${acc.bestStreak || 0} · ${(acc.unlockedIds || []).length}/${TOTAL_DISCOVERIES} penemuan terbuka.
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
    syncUnlockedLandmarks();
    updateHud();
    renderRamyeonMessages();
    closeModal();
    startNextRound();
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
// PENDAFTARAN 2 LANGKAH (USERNAME + TES 3 SOAL)
// ==========================================

function openAuthStep1() {
  const saved = listAtlasAccounts();
  els.hudLayer.classList.add('hidden');
  els.authOverlay.classList.remove('hidden');

  const savedHtml = saved.length
    ? `
      <div class="saved-accounts">
        <div class="modal-kicker">Lanjutkan Akun Tersimpan</div>
        ${saved
          .map(
            (a) => `
          <button class="saved-account-btn" data-login="${escapeHtml(a.username)}" type="button">
            <strong>@${escapeHtml(a.username)}</strong>
            <span>${formatNumber(a.score)} poin · ${(a.unlockedIds || []).length}/${TOTAL_DISCOVERIES}</span>
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
        <div class="modal-kicker">Langkah 1 dari 2</div>
        <h1 class="modal-title">Atlas Bumi 3D</h1>
      </div>
      <p class="modal-sub">
        Putar bola bumi, tebak lokasi dan tahunnya, lalu kumpulkan hal-hal tak terduga dari film, buku, sejarah, sains, teknologi, dan seni.
      </p>
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
        <div class="action-row" style="margin-top:6px;">
          <span class="mode-badge">Tanpa pilih karakter · Langsung main</span>
          <button class="btn-primary" type="submit">Lanjut</button>
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
      <div>
        <div class="modal-kicker">Langkah 2 dari 2 · Verifikasi Singkat (${qIndex + 1}/3)</div>
        <h2 class="modal-title">Pemanasan untuk @${escapeHtml(username)}</h2>
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

function enterGame(account) {
  state.account = account;
  audio.setMuted(Boolean(account.muted));
  els.authOverlay.classList.add('hidden');
  els.authOverlay.innerHTML = '';
  els.hudLayer.classList.remove('hidden');

  updateHud();
  syncUnlockedLandmarks();
  renderRamyeonMessages();
  setRamyeonOpen(false);
  startNextRound();
}

// ==========================================
// INISIALISASI UTAMA
// ==========================================

function populateCategoryFilter() {
  els.categorySelect.innerHTML = CATEGORIES.map(
    (c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`
  ).join('');
}

function bindGlobalEvents() {
  els.categorySelect.addEventListener('change', () => {
    if (!state.account) return;
    state.account.selectedCategory = els.categorySelect.value;
    persistAtlasSave(state.account);
    audio.playClick();
    startNextRound();
  });

  els.modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (!state.account) return;
      const nextMode = tab.dataset.mode;
      state.account.selectedMode = nextMode;
      persistAtlasSave(state.account);
      updateHud();
      audio.playClick();
      startNextRound(nextMode);
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

  els.btnToggleRamyeon.addEventListener('click', () => {
    audio.playClick();
    setRamyeonOpen(!state.ramyeonOpen);
  });

  els.btnCloseRamyeon.addEventListener('click', () => {
    audio.playClick();
    setRamyeonOpen(false);
  });

  els.ramyeonForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = els.ramyeonInput.value;
    if (!val.trim()) return;
    els.ramyeonInput.value = '';
    handleRamyeonSubmit(val);
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

function bootstrap() {
  populateCategoryFilter();
  initRamyeonChips();
  bindGlobalEvents();

  state.globe = new AtlasGlobe3D(els.canvas, {
    onHover: (hit) => {
      if (!hit) {
        els.hoverPill.textContent = 'Geser untuk memutar bumi · Gulir untuk memperbesar';
        return;
      }
      els.hoverPill.textContent = `${hit.placeLabel} · ${formatCoord(hit.lat, hit.lon)}`;
    },
    onGlobeClick: (hit) => {
      const r = state.round;
      if (!r || r.mode !== 'pin' || r.revealed) return;
      r.guess = {
        lat: hit.lat,
        lon: hit.lon,
        placeLabel: hit.placeLabel
      };
      state.globe.setAutoRotate(false);
      state.globe.setGuessPin(hit.lat, hit.lon);
      audio.playClick();
      renderRoundCard();
    },
    onUnlockedPinClick: (item) => {
      audio.playDialogueOpen();
      openDiscoveryDetailModal(item);
    }
  });

  // Ekspos handle ringan untuk inspeksi uji otomatis
  window.__atlasApp = { state };

  const active = getActiveAtlasAccount();
  if (active) {
    enterGame(active);
  } else {
    openAuthStep1();
  }
}

bootstrap();
