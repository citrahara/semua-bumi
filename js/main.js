// Taman Kronik: Gardenscapes Match-3 Bertingkat + Renovasi Taman Bangsawan 3D (Genshin Exploration & Cursor POV).

import { GARDEN_W, GARDEN_H, RESTORATION_TASKS, GARDEN_NPCS } from './garden_data.js';
import { GardenWorld3D } from './garden3d.js';
import { getLevelConfig, buildMicroQuest } from './puzzle_levels.js';
import { launchGardenPuzzle } from './puzzle_engine.js';
import { FACTS_BANK } from './data/facts.js';
import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { CYBER_LAB, CLASSIC_LIT_ACADEMY } from './data/academy.js';
import {
  openKoreanAcademy,
  openPolyglotAcademy,
  openRhetoricAcademy,
  openCyberLab,
  openClassicLitAcademy,
  speakPhrase
} from './academy_ui.js';
import {
  CHARACTER_CLASSES,
  FUNNY_USERNAMES,
  getCharacterClass,
  validateUsername,
  buildRegistrationExam,
  REJECT_ROASTS
} from './data/registration.js';
import { renderCharacterSVG } from './characters.js';
import { audio } from './audio.js';
import {
  MAX_LIVES,
  createFreshGardenAccount,
  listGardenAccounts,
  getActiveGardenAccount,
  registerGardenAccount,
  switchGardenAccount,
  persistGardenSave,
  resetGardenAccount,
  syncLives,
  getNextLifeSeconds
} from './garden_storage.js';

const TOTAL_CODEX =
  FACTS_BANK.length +
  DICTION_BANK.length +
  FALLACIES_BANK.length +
  CYBER_LAB.breakthroughs.length +
  CLASSIC_LIT_ACADEMY.concepts.length;

// DOM Refs
const worldCanvas = document.getElementById('world-canvas');
const hudLayer = document.getElementById('hud-layer');
const titleOverlay = document.getElementById('title-overlay');
const authCardRoot = document.getElementById('auth-card-root');
const overlayRoot = document.getElementById('overlay-root');
const toastEl = document.getElementById('toast');

const hudAvatar = document.getElementById('hud-avatar');
const hudLives = document.getElementById('hud-lives');
const hudStars = document.getElementById('hud-stars');
const hudCoins = document.getElementById('hud-coins');
const hudNextTask = document.getElementById('hud-next-task');
const hudTaskProgress = document.getElementById('hud-task-progress');
const hudCodexCount = document.getElementById('hud-codex-count');
const btnToggleSound = document.getElementById('btn-toggle-sound');
const helpPopover = document.getElementById('help-popover');

const playBtn = document.getElementById('btn-play-level');
const playDiffTag = document.getElementById('play-diff-tag');
const playLevelLabel = document.getElementById('play-level-label');

const zoneBanner = document.getElementById('zone-banner');
const zoneBannerSub = document.getElementById('zone-banner-sub');
const zoneBannerName = document.getElementById('zone-banner-name');
const btnInteract = document.getElementById('btn-interact');
const interactLabel = document.getElementById('interact-label');

// Core State
let save = getActiveGardenAccount() || createFreshGardenAccount('Tamu', 'detektif');
audio.setMuted(save.muted);

const garden = new GardenWorld3D(worldCanvas);
window.addEventListener('resize', () => garden.resize());

const player = {
  x: save.x || 700,
  y: save.y || 700,
  facing: save.facing || 'down',
  characterClass: save.characterClass || 'detektif',
  moving: false,
  sprinting: false,
  walkTarget: null,
  autoInteract: false
};

const ciko = { x: player.x - 32, y: player.y - 24 };

const keys = new Set();
const touchDirs = new Set();
let modalOpen = false;
let nearestInteract = null;
let saveCooldown = 0;

let freeLookMode = false;
let freeLookLastX = null;
let freeLookLastY = null;

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

let bannerTimer = null;
function showBanner(sub, title) {
  zoneBannerSub.textContent = sub;
  zoneBannerName.textContent = title;
  zoneBanner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => zoneBanner.classList.remove('show'), 2600);
}

function exitPointerLockSafe() {
  freeLookMode = false;
  freeLookLastX = null;
  freeLookLastY = null;
  try {
    if (document.pointerLockElement === worldCanvas && document.exitPointerLock) {
      document.exitPointerLock();
    }
  } catch {
    // Abaikan pembatasan pointer lock
  }
}

function closeOverlay() {
  modalOpen = false;
  overlayRoot.innerHTML = '';
  refreshHud();
}

function getNextPendingTask() {
  return RESTORATION_TASKS.find((t) => typeof save.renovations?.[t.id] !== 'number') || null;
}

function getRestoredCount() {
  return RESTORATION_TASKS.filter((t) => typeof save.renovations?.[t.id] === 'number').length;
}

function refreshHud() {
  syncLives(save);
  const cls = getCharacterClass(save.characterClass);
  hudAvatar.innerHTML = renderCharacterSVG(cls.portraitKey, 'idle');
  hudLives.textContent = `${save.lives}/${MAX_LIVES}`;
  hudStars.textContent = String(save.stars || 0);
  hudCoins.textContent = String(save.coins || 0);
  hudCodexCount.textContent = `${(save.codexIds || []).length}/${TOTAL_CODEX}`;
  btnToggleSound.textContent = save.muted ? 'Mati' : 'Suara';

  const doneCount = getRestoredCount();
  const next = getNextPendingTask();
  hudTaskProgress.textContent = `${doneCount}/${RESTORATION_TASKS.length}`;
  hudNextTask.textContent = next
    ? `Renovasi: ${next.name} (${next.starCost} ★)`
    : `Musim ${save.season || 1} Tuntas · Buka Musim Baru`;

  const cfg = getLevelConfig(save.level || 1);
  playLevelLabel.textContent = `Main · Level ${cfg.level}`;
  playDiffTag.textContent = `${cfg.difficulty} · +${cfg.starReward} ★`;
  playBtn.classList.remove('hard', 'super');
  if (cfg.difficulty === 'Sulit') playBtn.classList.add('hard');
  if (cfg.difficulty === 'Sangat Sulit') playBtn.classList.add('super');
}

// ==========================================
// INTERACTION DETECTION IN 3D GARDEN
// ==========================================
function findNearestInteractable() {
  let best = null;
  let bestDist = 92;

  for (const task of RESTORATION_TASKS) {
    const d = Math.hypot(task.x - player.x, task.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      const done = typeof save.renovations?.[task.id] === 'number';
      best = {
        kind: 'task',
        x: task.x,
        y: task.y,
        label: done ? `Ubah Gaya: ${task.name}` : `Renovasi: ${task.name} (${task.starCost} ★)`,
        data: task
      };
    }
  }

  for (const npc of GARDEN_NPCS) {
    const d = Math.hypot(npc.x - player.x, npc.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      best = {
        kind: 'npc',
        x: npc.x,
        y: npc.y,
        label: `Bicara dengan ${npc.name} (${npc.role})`,
        data: npc
      };
    }
  }

  return best;
}

function triggerNearestInteraction() {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  if (!nearestInteract) return;
  exitPointerLockSafe();
  player.walkTarget = null;
  if (nearestInteract.kind === 'task') {
    openRenovationModal(nearestInteract.data);
  } else if (nearestInteract.kind === 'npc') {
    openNpcStudy(nearestInteract.data);
  }
}

// ==========================================
// PLAY MATCH-3 LEVEL (GARDENSCAPES CORE!)
// ==========================================
function openCurrentPuzzle() {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  exitPointerLockSafe();
  syncLives(save);
  if (save.lives <= 0) {
    openRefillHeartModal();
    return;
  }

  modalOpen = true;
  audio.playDialogueOpen();
  launchGardenPuzzle({
    overlayRoot,
    save,
    onWin: ({ level, stars, coins }) => {
      save.level = level + 1;
      save.stars = (save.stars || 0) + stars;
      save.coins = (save.coins || 0) + coins;
      save.totalClearedLevels = (save.totalClearedLevels || 0) + 1;
      persistGardenSave(save);
      closeOverlay();
      garden.spawnBurst(player.x, player.y, '#D9B466', 32);
      showBanner(`LEVEL ${level} SELESAI`, `+${stars} Bintang Renovasi (★) · +${coins} Koin`);
    },
    onLose: () => {
      if (save.lives >= MAX_LIVES) save.lastLifeAt = Date.now();
      save.lives = Math.max(0, save.lives - 1);
      persistGardenSave(save);
      closeOverlay();
      showToast(`Nyawa tersisa ${save.lives}/${MAX_LIVES}. Klik ♥ di kiri atas untuk isi lewat 1 soal kilat.`);
    },
    onClose: closeOverlay
  });
}

// ==========================================
// REFILL HEART VIA 1 MICRO-QUEST
// ==========================================
function openRefillHeartModal() {
  exitPointerLockSafe();
  syncLives(save);
  modalOpen = true;
  audio.playClick();

  if (save.lives >= MAX_LIVES) {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:440px; text-align:center;">
          <div class="title-kicker">NYAWA PENUH</div>
          <h2 style="margin:0 0 8px; font-family:var(--font-display); color:var(--paper);">♥ ${save.lives}/${MAX_LIVES} Nyawa Siap</h2>
          <p style="margin:0 0 16px; color:var(--muted); font-size:0.88rem;">Kamu bisa langsung bermain level puzzle berikutnya.</p>
          <button class="rpg-btn gold" id="btn-hr-close" type="button">Kembali ke Taman</button>
        </div>
      </div>
    `;
    document.getElementById('btn-hr-close')?.addEventListener('click', closeOverlay);
    return;
  }

  const q = buildMicroQuest(save.level || 1);
  let feedback = null;

  function renderHeart() {
    const secs = getNextLifeSeconds(save);
    const minTxt = `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}d`;
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:520px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:8px;">
            <span class="title-kicker" style="margin:0;">ISI NYAWA (+1 ♥) · ${escapeHtml(q.topic)}</span>
            <button class="rpg-btn ghost" id="btn-hr-close" type="button" style="padding:6px 12px; font-size:0.78rem;">Tutup</button>
          </div>
          <p style="margin:0 0 10px; font-size:0.82rem; color:var(--muted);">
            Nyawa saat ini: ♥ ${save.lives}/${MAX_LIVES} (pulih otomatis dalam ${minTxt}). Jawab 1 soal kilat untuk langsung mengisi +1 ♥.
          </p>
          ${q.audioText ? `<button class="speak-btn" id="btn-hr-audio" type="button" style="margin-bottom:8px;">Dengar Pelafalan</button>` : ''}
          <div class="math-q-box" style="margin-bottom:10px;">
            <p class="math-q-text" style="font-size:0.98rem;">${escapeHtml(q.prompt)}</p>
          </div>
          <div class="choice-grid">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="rpg-choice ${feedback ? (opt.ok ? 'ok' : feedback.picked === idx ? 'bad' : '') : ''}" data-hr-idx="${idx}" type="button" ${feedback ? 'disabled' : ''}>
                <span class="choice-badge">${['A', 'B', 'C', 'D'][idx]}</span>
                <span>${escapeHtml(opt.label)}</span>
              </button>
            `
              )
              .join('')}
          </div>
          ${
            feedback
              ? `
            <div class="insight-box" style="margin-top:12px;">
              <p style="margin:0;"><strong>${feedback.ok ? '+1 Nyawa dipulihkan.' : 'Belum tepat.'}</strong> ${escapeHtml(q.explain)}</p>
            </div>
            <div style="margin-top:12px; text-align:right;">
              <button class="rpg-btn gold" id="btn-hr-done" type="button">${feedback.ok ? 'Lanjut Main' : 'Coba Soal Lain'}</button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    document.getElementById('btn-hr-close')?.addEventListener('click', closeOverlay);
    document.getElementById('btn-hr-audio')?.addEventListener('click', () => {
      speakPhrase(q.audioText, q.audioLang || 'ko-KR');
    });
    document.querySelectorAll('[data-hr-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (feedback) return;
        const idx = Number(btn.dataset.hrIdx);
        const ok = Boolean(q.options[idx]?.ok);
        feedback = { ok, picked: idx };
        if (ok) {
          audio.playCorrect();
          save.lives = Math.min(MAX_LIVES, save.lives + 1);
          save.solvedQuests = (save.solvedQuests || 0) + 1;
          if (q.codexId && !save.codexIds.includes(q.codexId)) save.codexIds.push(q.codexId);
          persistGardenSave(save);
          refreshHud();
        } else {
          audio.playWrong();
        }
        renderHeart();
      });
    });
    document.getElementById('btn-hr-done')?.addEventListener('click', () => {
      if (feedback?.ok) closeOverlay();
      else {
        closeOverlay();
        openRefillHeartModal();
      }
    });
  }

  renderHeart();
}

// ==========================================
// 3-STYLE RENOVATION PICKER & TASK LIST
// ==========================================
function openRenovationModal(task) {
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();

  const alreadyDone = typeof save.renovations?.[task.id] === 'number';
  let pickedStyle = alreadyDone ? save.renovations[task.id] : 0;

  function renderPick() {
    const canPay = alreadyDone || (save.stars || 0) >= task.starCost;
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:600px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
              <div class="title-kicker">${alreadyDone ? 'UBAH GAYA DESAIN (GRATIS)' : `RENOVASI TAMAN · ${task.starCost} ★`}</div>
              <h2 style="margin:2px 0 4px; font-family:var(--font-display); font-size:1.45rem; color:var(--paper);">${escapeHtml(task.name)}</h2>
              <p style="margin:0; font-size:0.86rem; color:var(--muted);">${escapeHtml(task.shortDesc)}</p>
            </div>
            <button class="rpg-btn ghost" id="btn-ren-close" type="button" style="padding:6px 12px; font-size:0.78rem;">Tutup</button>
          </div>

          <div class="style-grid">
            ${task.styles
              .map(
                (st) => `
              <button class="style-card ${pickedStyle === st.id ? 'selected' : ''}" data-st-id="${st.id}" type="button">
                <div class="style-swatches">
                  <span class="swatch-dot" style="background:${st.color}"></span>
                  <span class="swatch-dot" style="background:${st.accent}"></span>
                </div>
                <strong style="display:block; font-size:0.9rem; margin-bottom:3px;">${escapeHtml(st.name)}</strong>
                <span style="font-size:0.74rem; color:var(--muted); line-height:1.4; display:block;">${escapeHtml(st.note)}</span>
              </button>
            `
              )
              .join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="font-size:0.82rem; color:var(--gold); font-weight:700;">
              ${alreadyDone ? 'Bebas ubah gaya kapan saja.' : `Bintang kamu: ${save.stars || 0} ★ · Hadiah: +${task.coinReward} Koin`}
            </span>
            <div style="display:flex; gap:8px;">
              ${
                !canPay
                  ? `<button class="rpg-btn primary" id="btn-ren-play" type="button">Main Level ${save.level} untuk ★</button>`
                  : `<button class="rpg-btn gold" id="btn-ren-confirm" type="button">${alreadyDone ? 'Terapkan Gaya 3D' : `Bangun Sekarang (${task.starCost} ★)`}</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-ren-close')?.addEventListener('click', closeOverlay);
    document.querySelectorAll('[data-st-id]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        pickedStyle = Number(b.dataset.stId);
        renderPick();
      });
    });
    document.getElementById('btn-ren-play')?.addEventListener('click', () => {
      closeOverlay();
      openCurrentPuzzle();
    });
    document.getElementById('btn-ren-confirm')?.addEventListener('click', () => {
      if (!alreadyDone) {
        if ((save.stars || 0) < task.starCost) return;
        save.stars -= task.starCost;
        save.coins = (save.coins || 0) + task.coinReward;
      }
      save.renovations[task.id] = pickedStyle;
      persistGardenSave(save);
      garden.syncRenovations(save.renovations, task.id);
      audio.playRenovate();
      // Arahkan pandangan hero dekat ke objek yang baru dibangun
      player.x = Math.min(GARDEN_W - 80, Math.max(80, task.x));
      player.y = Math.min(GARDEN_H - 80, Math.max(80, task.y + 72));
      save.x = Math.round(player.x);
      save.y = Math.round(player.y);
      persistGardenSave(save);
      closeOverlay();
      showBanner(alreadyDone ? 'GAYA DIPERBARUI' : `RENOVASI SELESAI (+${task.coinReward} KOIN)`, task.name);
    });
  }

  renderPick();
}

function openTasksModal() {
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();
  const doneCount = getRestoredCount();
  const allDone = doneCount >= RESTORATION_TASKS.length;

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal" style="max-width:680px;">
        <div class="panel-head">
          <div>
            <div class="title-kicker">DAFTAR RENOVASI · MUSIM ${save.season || 1} · ${doneCount}/${RESTORATION_TASKS.length}</div>
            <h2>Tugas Taman 3D</h2>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-weight:800; color:var(--gold); font-size:0.9rem;">${save.stars || 0} ★</span>
            <button class="rpg-btn ghost" id="btn-tk-close" type="button" style="padding:7px 13px; font-size:0.8rem;">Tutup</button>
          </div>
        </div>

        ${
          allDone
            ? `
          <div class="insight-box" style="margin:0 0 14px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
            <div>
              <p style="margin:0 0 2px;"><strong>Seluruh 12 area Musim ${save.season || 1} selesai direnovasi.</strong></p>
              <p style="margin:0; font-size:0.82rem; color:var(--muted);">Buka Musim ${(save.season || 1) + 1} untuk mendesain ulang taman dengan bonus +250 Koin sambil mempertahankan Level Puzzle dan Codex.</p>
            </div>
            <button class="rpg-btn gold" id="btn-next-season" type="button" style="padding:9px 16px; font-size:0.82rem;">Buka Musim ${(save.season || 1) + 1}</button>
          </div>
        `
            : ''
        }

        <div class="codex-list">
          ${RESTORATION_TASKS.map((t) => {
            const done = typeof save.renovations?.[t.id] === 'number';
            const styleName = done ? t.styles[save.renovations[t.id]]?.name : null;
            const canAfford = (save.stars || 0) >= t.starCost;
            return `
              <div class="task-row ${done ? 'done' : ''}">
                <div>
                  <div style="font-weight:800; color:var(--paper); font-size:0.94rem;">${t.order}. ${escapeHtml(t.name)}</div>
                  <div style="font-size:0.78rem; color:var(--muted);">${done ? `Selesai · Gaya: ${escapeHtml(styleName)}` : escapeHtml(t.shortDesc)}</div>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  <button class="rpg-btn ${done ? 'ghost' : canAfford ? 'gold' : 'ghost'}" data-open-ren="${t.id}" type="button" style="padding:7px 13px; font-size:0.78rem;">
                    ${done ? 'Ubah Gaya' : `Renovasi (${t.starCost} ★)`}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-tk-close')?.addEventListener('click', closeOverlay);
  document.querySelectorAll('[data-open-ren]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const task = RESTORATION_TASKS.find((x) => x.id === btn.dataset.openRen);
      if (task) openRenovationModal(task);
    });
  });
  document.getElementById('btn-next-season')?.addEventListener('click', () => {
    save.season = (save.season || 1) + 1;
    save.renovations = {};
    save.coins = (save.coins || 0) + 250;
    persistGardenSave(save);
    garden.syncRenovations({});
    audio.playGateUnlock();
    closeOverlay();
    showBanner(`MUSIM TAMAN ${save.season}`, 'Taman siap dirancang ulang · +250 Koin');
  });
}

// ==========================================
// STUDY ARCHIVE & CODEX (78 CARDS + KOREA + ORWELL + CYBER /berita-terkini)
// ==========================================
function unlockCodexId(id) {
  if (id && !save.codexIds.includes(id)) {
    save.codexIds.push(id);
    persistGardenSave(save);
    refreshHud();
  }
}

function handleStudyComplete({ badgeName, xp = 0, coins = 50 }) {
  save.coins = (save.coins || 0) + coins;
  persistGardenSave(save);
  audio.playVictory();
  closeOverlay();
  showBanner('CATATAN TERSIMPAN', `${badgeName} · +${coins} Koin`);
}

function openNpcStudy(npc) {
  if (npc.action === 'study_lit') {
    modalOpen = true;
    openClassicLitAcademy({
      overlayRoot,
      save,
      onUnlockLit: unlockCodexId,
      onComplete: handleStudyComplete,
      onClose: closeOverlay
    });
  } else if (npc.action === 'study_korean') {
    modalOpen = true;
    openKoreanAcademy({ overlayRoot, save, onComplete: handleStudyComplete, onClose: closeOverlay });
  } else if (npc.action === 'study_cyber') {
    modalOpen = true;
    openCyberLab({
      overlayRoot,
      save,
      onUnlockIntel: unlockCodexId,
      onComplete: handleStudyComplete,
      onClose: closeOverlay
    });
  }
}

function getAllCodexEntries() {
  return [
    ...CLASSIC_LIT_ACADEMY.concepts.map((lit) => ({
      id: lit.id,
      group: 'lit',
      groupLabel: `Sastra · ${lit.author}`,
      title: lit.title,
      summary: lit.summary,
      detail: lit.modernLink,
      example: lit.speakHook
    })),
    ...CYBER_LAB.breakthroughs.map((cb) => ({
      id: cb.id,
      group: 'cyber',
      groupLabel: `Siber · ${cb.category}`,
      title: cb.title,
      summary: cb.summary,
      detail: cb.whyMatters,
      example: cb.speakHook
    })),
    ...DICTION_BANK.map((d) => ({
      id: d.id,
      group: 'diction',
      groupLabel: 'Diksi KBBI',
      title: d.term,
      summary: d.meaning,
      detail: d.pitfall,
      example: d.usage
    })),
    ...FALLACIES_BANK.map((fl) => ({
      id: fl.id,
      group: 'fallacy',
      groupLabel: 'Logika',
      title: fl.fallacyName,
      summary: fl.meaning,
      detail: fl.pitfall,
      example: fl.usage
    })),
    ...FACTS_BANK.map((f) => ({
      id: f.id,
      group: 'fact',
      groupLabel: `Fakta · ${f.category}`,
      title: f.isFact ? 'Fakta Sahih' : 'Mitos Keliru',
      summary: f.statement,
      detail: f.punchline,
      example: f.hook
    }))
  ];
}

function openStudyHubModal() {
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();
  let filter = 'all';
  let revealAll = false;
  let query = '';

  function renderHub() {
    const all = getAllCodexEntries();
    const q = query.trim().toLowerCase();
    const list = all.filter((it) => {
      if (filter !== 'all' && it.group !== filter) return false;
      if (!q) return true;
      return `${it.title} ${it.summary} ${it.detail}`.toLowerCase().includes(q);
    });

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal">
          <div class="panel-head">
            <div>
              <div class="title-kicker">ARSIP PENGETAHUAN & RUANG BELAJAR</div>
              <h2>Codex Taman (${save.codexIds.length}/${TOTAL_CODEX})</h2>
            </div>
            <button class="rpg-btn ghost" id="btn-st-close" type="button" style="padding:7px 14px; font-size:0.8rem;">Tutup</button>
          </div>

          <div class="codex-bar" style="margin-bottom:12px;">
            <button class="rpg-btn ghost" id="btn-open-ac-lit" type="button" style="padding:7px 13px; font-size:0.78rem;">Arsip Sastra (Orwell & Austen)</button>
            <button class="rpg-btn ghost" id="btn-open-ac-kr" type="button" style="padding:7px 13px; font-size:0.78rem;">Belajar Korea (Hangul + Suara)</button>
            <button class="rpg-btn ghost" id="btn-open-ac-poly" type="button" style="padding:7px 13px; font-size:0.78rem;">Jepang & Inggris</button>
            <button class="rpg-btn ghost" id="btn-open-ac-cyber" type="button" style="padding:7px 13px; font-size:0.78rem;">Radar Siber /berita-terkini</button>
            <button class="rpg-btn ghost" id="btn-open-ac-rhet" type="button" style="padding:7px 13px; font-size:0.78rem;">Kerangka Retorika</button>
          </div>

          <div class="codex-bar">
            ${[
              ['all', 'Semua'],
              ['lit', 'Sastra'],
              ['cyber', 'Siber'],
              ['diction', 'Diksi'],
              ['fallacy', 'Logika'],
              ['fact', 'Fakta']
            ]
              .map(([k, lbl]) => `<button class="filter-chip ${filter === k ? 'active' : ''}" data-cf="${k}" type="button">${lbl}</button>`)
              .join('')}
            <button class="filter-chip ${revealAll ? 'active' : ''}" id="btn-cd-reveal" type="button">${revealAll ? 'Mode Baca: Semua' : 'Buka Semua'}</button>
            <input class="rpg-input" id="cd-search" type="search" placeholder="Cari catatan..." value="${escapeHtml(query)}" style="max-width:200px; padding:6px 11px; font-size:0.82rem;" />
          </div>

          <div class="codex-list">
            ${list
              .map((item) => {
                const open = revealAll || save.codexIds.includes(item.id);
                if (!open) {
                  return `<div class="codex-item locked"><div class="title-kicker" style="margin-bottom:2px;">${escapeHtml(item.groupLabel)}</div><h4>Terkunci</h4><p>Buka ubin segel di papan puzzle atau kunjungi ruang belajar di atas.</p></div>`;
                }
                return `
                  <div class="codex-item">
                    <div class="title-kicker" style="margin-bottom:2px;">${escapeHtml(item.groupLabel)}</div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p><strong>${escapeHtml(item.summary)}</strong></p>
                    <p>${escapeHtml(item.detail)}</p>
                    <p style="color:var(--gold); font-style:italic;">${escapeHtml(item.example)}</p>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-st-close')?.addEventListener('click', closeOverlay);
    document.getElementById('btn-open-ac-lit')?.addEventListener('click', () => {
      openClassicLitAcademy({ overlayRoot, save, onUnlockLit: unlockCodexId, onComplete: handleStudyComplete, onClose: closeOverlay });
    });
    document.getElementById('btn-open-ac-kr')?.addEventListener('click', () => {
      openKoreanAcademy({ overlayRoot, save, onComplete: handleStudyComplete, onClose: closeOverlay });
    });
    document.getElementById('btn-open-ac-poly')?.addEventListener('click', () => {
      openPolyglotAcademy({ overlayRoot, save, onComplete: handleStudyComplete, onClose: closeOverlay });
    });
    document.getElementById('btn-open-ac-cyber')?.addEventListener('click', () => {
      openCyberLab({ overlayRoot, save, onUnlockIntel: unlockCodexId, onComplete: handleStudyComplete, onClose: closeOverlay });
    });
    document.getElementById('btn-open-ac-rhet')?.addEventListener('click', () => {
      openRhetoricAcademy({ overlayRoot, save, onComplete: handleStudyComplete, onClose: closeOverlay });
    });
    document.querySelectorAll('[data-cf]').forEach((b) => {
      b.addEventListener('click', () => {
        filter = b.dataset.cf;
        renderHub();
      });
    });
    document.getElementById('btn-cd-reveal')?.addEventListener('click', () => {
      revealAll = !revealAll;
      renderHub();
    });
    document.getElementById('cd-search')?.addEventListener('input', (e) => {
      query = e.target.value;
      renderHub();
      const el = document.getElementById('cd-search');
      if (el) {
        el.focus();
        el.setSelectionRange(query.length, query.length);
      }
    });
  }

  renderHub();
}

// ==========================================
// PROFILE & SHORT WELCOME CARD
// ==========================================
function openProfileModal() {
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();
  const cls = getCharacterClass(save.characterClass);
  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="altar-card" style="max-width:500px;">
        <div class="panel-head" style="margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="portrait-box" style="width:62px; height:62px;">${renderCharacterSVG(cls.portraitKey, 'idle')}</div>
            <div>
              <div class="title-kicker">PEMBACA · ${escapeHtml(cls.name)} · MUSIM ${save.season || 1}</div>
              <h2 style="margin:0; font-size:1.35rem;">@${escapeHtml(save.username)}</h2>
            </div>
          </div>
          <button class="rpg-btn ghost" id="btn-pr-close" type="button" style="padding:6px 12px;">Tutup</button>
        </div>

        <div class="zone-map-grid" style="margin-bottom:14px;">
          <div class="zone-card unlocked"><h3>Level ${save.level}</h3><p>Progres Match-3 Tanpa Akhir</p></div>
          <div class="zone-card unlocked"><h3>${getRestoredCount()}/${RESTORATION_TASKS.length}</h3><p>Area Taman Direnovasi</p></div>
          <div class="zone-card unlocked"><h3>${save.solvedQuests || 0}</h3><p>Soal Segel Terjawab</p></div>
          <div class="zone-card unlocked"><h3>${save.codexIds.length}/${TOTAL_CODEX}</h3><p>Codex Tersimpan</p></div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:space-between;">
          <button class="rpg-btn ghost" id="btn-pr-switch" type="button">Ganti Akun</button>
          <button class="rpg-btn ghost" id="btn-pr-reset" type="button">Reset Level 1</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-pr-close')?.addEventListener('click', closeOverlay);
  document.getElementById('btn-pr-switch')?.addEventListener('click', () => {
    closeOverlay();
    hudLayer.classList.add('hidden');
    openAuthFlow('username');
  });
  document.getElementById('btn-pr-reset')?.addEventListener('click', () => {
    save = resetGardenAccount(save);
    syncFromSave();
    closeOverlay();
    showToast('Progres dimulai ulang dari Level 1.');
  });
}

function openShortWelcome(onDone) {
  modalOpen = true;
  let step = 0;
  const pages = [
    {
      kicker: 'HALAMAN I · TAMAN KRONIK',
      title: 'Taman Bangsawan di Dalam Buku',
      text: 'Kamu bisa berjalan bebas keliling taman 3D (WASD atau klik tanah) dan menggeser sudut pandang langsung dengan menarik kursor. Dua belas sudut taman yang terbengkalai menunggumu untuk direnovasi dalam tiga pilihan gaya.',
      aside: 'Kamu sudah membawa 1 Bintang (★) pembuka. Coba hampiri Gerbang Utama atau klik tombol Tugas di kiri atas.'
    },
    {
      kicker: 'HALAMAN II · PUZZLE & UBIN SEGEL',
      title: 'Tantangan Match-3 Tanpa Batas',
      text: 'Klik tombol Main di kanan bawah untuk memulai level puzzle yang rintangannya meningkat bertahap: Kotak Kayu, Es Beku, Rantai, dan Lumut. Saat menyentuh ubin emas bersegel, mengaktifkan booster, atau mengisi nyawa, 1 soal kilat (Bahasa, Sastra, Siber, atau Matematika) akan muncul.',
      aside: 'Tarik kursor untuk memutar POV, scroll untuk melihat tepi buku, atau tekan [V] untuk POV bebas.'
    }
  ];

  function renderW() {
    const p = pages[step];
    const last = step >= pages.length - 1;
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="vintage-book" style="max-width:600px;">
          <div class="vintage-top-row">
            <span class="vintage-year">${p.kicker}</span>
            <button class="vintage-skip" id="btn-w-skip" type="button">Lewati</button>
          </div>
          <div class="vintage-chapter">${p.title}</div>
          <p class="vintage-quote">${p.text}</p>
          <div class="vintage-aside" style="margin-bottom:14px;">${p.aside}</div>
          <div class="vintage-footer">
            <span style="font-size:0.78rem; color:#6d4c30; font-weight:700;">${step + 1} / ${pages.length}</span>
            <button class="rpg-btn primary" id="btn-w-next" type="button">${last ? 'Masuk ke Taman 3D' : 'Berikutnya'}</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('btn-w-skip')?.addEventListener('click', onDone);
    document.getElementById('btn-w-next')?.addEventListener('click', () => {
      audio.playClick();
      if (!last) {
        step += 1;
        renderW();
      } else {
        onDone();
      }
    });
  }
  renderW();
}

// ==========================================
// 3-STEP REGISTRATION & CHARACTER PICKER
// ==========================================
const auth = {
  step: 'username',
  pendingUsername: '',
  errorMsg: '',
  examQuestions: [],
  examIdx: 0,
  examTimeLeft: 20,
  examTimerId: null,
  examPassed: false,
  rejectReason: '',
  rejectRoast: '',
  cooldownLeft: 0,
  cooldownTimerId: null,
  selectedClass: 'detektif'
};

function clearAuthTimers() {
  if (auth.examTimerId) {
    clearInterval(auth.examTimerId);
    auth.examTimerId = null;
  }
  if (auth.cooldownTimerId) {
    clearInterval(auth.cooldownTimerId);
    auth.cooldownTimerId = null;
  }
}

function syncFromSave() {
  player.x = save.x || 700;
  player.y = save.y || 700;
  player.facing = save.facing || 'down';
  player.characterClass = save.characterClass || 'detektif';
  player.walkTarget = null;
  ciko.x = player.x - 30;
  ciko.y = player.y - 22;
  audio.setMuted(save.muted);
  garden.syncRenovations(save.renovations || {});
  refreshHud();
}

function enterGarden(account, isNew = false) {
  clearAuthTimers();
  save = account;
  syncFromSave();
  titleOverlay.classList.add('hidden');
  hudLayer.classList.remove('hidden');
  audio.playWaypoint();

  if (!save.prologueSeen) {
    openShortWelcome(() => {
      save.prologueSeen = true;
      persistGardenSave(save);
      closeOverlay();
      showBanner(`MUSIM ${save.season || 1}`, isNew ? `Selamat datang, @${save.username}` : 'Taman Kronik');
    });
  } else {
    showBanner(`MUSIM ${save.season || 1}`, `Level ${save.level} · @${save.username}`);
  }
}

function openAuthFlow(step = 'username') {
  clearAuthTimers();
  auth.step = step;
  auth.errorMsg = '';
  auth.examPassed = false;
  titleOverlay.classList.remove('hidden');
  renderAuthCard();
}

function renderStepper(num) {
  return `
    <div class="auth-stepper">
      ${[
        [1, '1. Username'],
        [2, '2. Seleksi'],
        [3, '3. Karakter']
      ]
        .map(([n, l]) => `<span class="step-pill ${n < num ? 'done' : n === num ? 'active' : ''}">${l}</span>`)
        .join('')}
    </div>
  `;
}

function renderAuthCard() {
  if (auth.step === 'username') {
    const saved = listGardenAccounts();
    authCardRoot.innerHTML = `
      ${renderStepper(1)}
      <div class="title-kicker">PUZZLE MATCH-3 & RENOVASI TAMAN 3D</div>
      <h1 class="title-logo">TAMAN KRONIK</h1>
      <p class="title-desc">
        Buat <strong>username</strong>, lulus <strong>3 soal seleksi singkat</strong>, lalu jelajahi taman 3D dalam buku dan taklukkan level puzzle bertingkat.
      </p>

      <div class="title-form" style="max-width:400px;">
        <label class="title-label" for="input-username">Username (3 sampai 16 karakter)</label>
        <div class="username-row">
          <div class="username-wrap">
            <span class="username-at">@</span>
            <input id="input-username" class="rpg-input" type="text" maxlength="16" autocomplete="off" placeholder="contoh: pembaca_malam" value="${escapeHtml(auth.pendingUsername)}" />
          </div>
          <button class="rpg-btn ghost" id="btn-random-user" type="button" style="padding:11px 14px; font-size:0.82rem;">Acak</button>
        </div>
        <p class="auth-error" id="auth-error-msg">${escapeHtml(auth.errorMsg)}</p>
      </div>

      <div class="title-actions">
        <button class="rpg-btn primary" id="btn-start-exam" type="button">Mulai 3 Uji Seleksi</button>
      </div>

      ${
        saved.length > 0
          ? `
        <div class="saved-accounts-box">
          <div class="title-label" style="margin-bottom:2px;">Lanjutkan akun tersimpan:</div>
          <div class="saved-accounts-list">
            ${saved
              .map(
                (acc) => `
              <button class="account-chip" data-login-user="${escapeHtml(acc.username)}" type="button">
                <span>@${escapeHtml(acc.username)}</span>
                <span style="color:var(--gold);">Lv.${acc.level}</span>
                <span style="color:var(--muted);">${acc.stars || 0} ★</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }
    `;

    const inp = document.getElementById('input-username');
    inp?.addEventListener('input', (e) => {
      auth.pendingUsername = e.target.value;
      auth.errorMsg = '';
      const err = document.getElementById('auth-error-msg');
      if (err) err.textContent = '';
    });
    inp?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') proceedToExam();
    });
    document.getElementById('btn-random-user')?.addEventListener('click', () => {
      audio.playClick();
      const existing = listGardenAccounts().map((a) => a.username.toLowerCase());
      const avail = FUNNY_USERNAMES.filter((u) => !existing.includes(u.toLowerCase()));
      auth.pendingUsername = avail.length ? avail[Math.floor(Math.random() * avail.length)] : `pembaca_${Math.floor(100 + Math.random() * 899)}`;
      renderAuthCard();
    });
    document.getElementById('btn-start-exam')?.addEventListener('click', proceedToExam);
    document.querySelectorAll('[data-login-user]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const acc = switchGardenAccount(btn.dataset.loginUser);
        if (acc) enterGarden(acc, false);
      });
    });
    return;
  }

  if (auth.step === 'exam') {
    const q = auth.examQuestions[auth.examIdx];
    const pct = Math.max(0, Math.round((auth.examTimeLeft / 20) * 100));
    authCardRoot.innerHTML = `
      ${renderStepper(2)}
      <div class="exam-head">
        <div class="portrait-box" style="width:60px; height:60px;">${renderCharacterSVG('orwell', 'idle')}</div>
        <div style="flex:1;">
          <div class="title-kicker" style="margin-bottom:2px;">SELEKSI MASUK · @${escapeHtml(auth.pendingUsername)}</div>
          <div style="font-weight:800; font-size:0.94rem; color:var(--paper);">
            ${escapeHtml(q.tag)} · <span id="exam-timer-txt" style="color:var(--gold);">${auth.examTimeLeft} dtk</span>
          </div>
          <div style="font-size:0.76rem; color:var(--muted);">Jawab 3 soal beruntun dengan tepat.</div>
        </div>
      </div>
      <div class="exam-timer-track"><div class="exam-timer-fill ${auth.examTimeLeft <= 5 ? 'urgent' : ''}" id="exam-timer-fill" style="width:${pct}%"></div></div>
      <div class="math-q-box" style="text-align:left;"><p class="math-q-text" style="font-size:1rem;">${escapeHtml(q.q)}</p></div>
      <div class="choice-grid">
        ${q.options
          .map(
            (opt, idx) => `
          <button class="rpg-choice" data-exam-opt="${idx}" type="button">
            <span class="choice-badge">${['A', 'B', 'C', 'D'][idx]}</span>
            <span>${escapeHtml(opt.label)}</span>
          </button>
        `
          )
          .join('')}
      </div>
    `;
    document.querySelectorAll('[data-exam-opt]').forEach((btn) => {
      btn.addEventListener('click', () => handleExamAnswer(Number(btn.dataset.examOpt)));
    });
    return;
  }

  if (auth.step === 'rejected') {
    const waitLocked = auth.cooldownLeft > 0;
    authCardRoot.innerHTML = `
      ${renderStepper(2)}
      <div class="stamp-banner rejected">BELUM LOLOS</div>
      <div class="insight-box" style="text-align:left; margin:8px 0 16px;">
        <p>${escapeHtml(auth.rejectRoast)}</p>
        <p>${escapeHtml(auth.rejectReason)}</p>
      </div>
      <div class="title-actions" style="margin-bottom:0;">
        <button class="rpg-btn primary" id="btn-retry-exam" type="button" ${waitLocked ? 'disabled style="opacity:0.55;"' : ''}>
          ${waitLocked ? `Tunggu ${auth.cooldownLeft} dtk` : 'Coba Ulang (Soal Baru)'}
        </button>
        <button class="rpg-btn ghost" id="btn-back-username" type="button">Ganti Username</button>
      </div>
    `;
    document.getElementById('btn-retry-exam')?.addEventListener('click', () => {
      if (auth.cooldownLeft <= 0) startGatekeeperExam();
    });
    document.getElementById('btn-back-username')?.addEventListener('click', () => openAuthFlow('username'));
    return;
  }

  if (auth.step === 'approved') {
    authCardRoot.innerHTML = `
      ${renderStepper(2)}
      <div class="stamp-banner approved">SELEKSI LULUS</div>
      <p style="margin:0 0 16px; color:var(--paper);">@${escapeHtml(auth.pendingUsername)} lolos 3/3 soal. Pilih tampilan karaktermu di taman 3D.</p>
      <button class="rpg-btn gold" id="btn-go-character" type="button">Pilih Karakter</button>
    `;
    document.getElementById('btn-go-character')?.addEventListener('click', () => {
      audio.playClick();
      auth.step = 'character';
      renderAuthCard();
    });
    return;
  }

  if (auth.step === 'character') {
    if (!auth.examPassed) {
      openAuthFlow('username');
      return;
    }
    const picked = getCharacterClass(auth.selectedClass);
    authCardRoot.innerHTML = `
      ${renderStepper(3)}
      <div class="title-kicker">PILIH KARAKTER · @${escapeHtml(auth.pendingUsername)}</div>
      <div class="char-pick-grid">
        ${CHARACTER_CLASSES.map(
          (c) => `
          <button class="char-pick-card ${auth.selectedClass === c.id ? 'selected' : ''}" data-pick-cls="${c.id}" type="button">
            <div class="char-pick-portrait">${renderCharacterSVG(c.portraitKey, 'idle')}</div>
            <div>
              <div class="char-pick-name">${escapeHtml(c.name)}</div>
              <div class="char-pick-vibe">${escapeHtml(c.vibe)}</div>
            </div>
          </button>
        `
        ).join('')}
      </div>
      <button class="rpg-btn primary" id="btn-confirm-create" type="button">Masuk sebagai @${escapeHtml(auth.pendingUsername)} (${escapeHtml(picked.name)})</button>
    `;
    document.querySelectorAll('[data-pick-cls]').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playClick();
        auth.selectedClass = btn.dataset.pickCls;
        player.characterClass = auth.selectedClass;
        renderAuthCard();
      });
    });
    document.getElementById('btn-confirm-create')?.addEventListener('click', () => {
      const created = registerGardenAccount(auth.pendingUsername, auth.selectedClass);
      enterGarden(created, true);
    });
  }
}

function proceedToExam() {
  const existing = listGardenAccounts().map((a) => a.username);
  const check = validateUsername(auth.pendingUsername, existing);
  if (!check.ok) {
    auth.errorMsg = check.error;
    audio.playWrong();
    renderAuthCard();
    return;
  }
  auth.pendingUsername = check.username;
  auth.errorMsg = '';
  startGatekeeperExam();
}

function startGatekeeperExam() {
  clearAuthTimers();
  audio.playDialogueOpen();
  auth.examQuestions = buildRegistrationExam();
  auth.examIdx = 0;
  auth.examPassed = false;
  auth.step = 'exam';
  startExamTimer();
  renderAuthCard();
}

function startExamTimer() {
  clearAuthTimers();
  auth.examTimeLeft = 20;
  auth.examTimerId = setInterval(() => {
    auth.examTimeLeft = Math.max(0, auth.examTimeLeft - 1);
    const fill = document.getElementById('exam-timer-fill');
    const txt = document.getElementById('exam-timer-txt');
    if (fill) {
      fill.style.width = `${(auth.examTimeLeft / 20) * 100}%`;
      fill.classList.toggle('urgent', auth.examTimeLeft <= 5);
    }
    if (txt) txt.textContent = `${auth.examTimeLeft} dtk`;
    if (auth.examTimeLeft <= 0) {
      const q = auth.examQuestions[auth.examIdx];
      failExam(`Waktu habis. ${q ? q.explain : ''}`);
    }
  }, 1000);
}

function handleExamAnswer(idx) {
  const q = auth.examQuestions[auth.examIdx];
  if (!q) return;
  if (q.options[idx]?.ok) {
    audio.playCorrect();
    if (auth.examIdx < auth.examQuestions.length - 1) {
      auth.examIdx += 1;
      startExamTimer();
      renderAuthCard();
    } else {
      clearAuthTimers();
      auth.examPassed = true;
      auth.step = 'approved';
      audio.playVictory();
      renderAuthCard();
    }
  } else {
    failExam(`Jawaban keliru. ${q.explain}`);
  }
}

function failExam(reason) {
  clearAuthTimers();
  audio.playWrong();
  auth.step = 'rejected';
  auth.rejectReason = reason;
  auth.rejectRoast = REJECT_ROASTS[Math.floor(Math.random() * REJECT_ROASTS.length)];
  auth.cooldownLeft = 5;
  renderAuthCard();

  auth.cooldownTimerId = setInterval(() => {
    auth.cooldownLeft = Math.max(0, auth.cooldownLeft - 1);
    const btn = document.getElementById('btn-retry-exam');
    if (btn) {
      if (auth.cooldownLeft > 0) btn.textContent = `Tunggu ${auth.cooldownLeft} dtk`;
      else {
        btn.disabled = false;
        btn.removeAttribute('style');
        btn.textContent = 'Coba Ulang (Soal Baru)';
      }
    }
    if (auth.cooldownLeft <= 0) clearAuthTimers();
  }, 1000);
}

// ==========================================
// INPUTS: KEYBOARD, CURSOR POV DRAG, ZOOM, [V] FREE POV
// ==========================================
window.addEventListener('keydown', (e) => {
  const tag = e.target?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  const k = e.key.toLowerCase();

  if (k === 'escape') {
    if (freeLookMode) {
      exitPointerLockSafe();
      showToast('Mode POV bebas dimatikan.');
    }
    if (modalOpen) closeOverlay();
    return;
  }
  if (!titleOverlay.classList.contains('hidden') || modalOpen) return;

  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) {
    keys.add(k);
    player.walkTarget = null;
  } else if (k === 'e' || k === 'enter') {
    e.preventDefault();
    triggerNearestInteraction();
  } else if (k === 'p') {
    openCurrentPuzzle();
  } else if (k === 't') {
    openTasksModal();
  } else if (k === 'c') {
    openStudyHubModal();
  } else if (k === 'v') {
    if (freeLookMode || document.pointerLockElement === worldCanvas) {
      exitPointerLockSafe();
      showToast('Mode POV bebas dimatikan.');
    } else {
      freeLookMode = true;
      freeLookLastX = null;
      freeLookLastY = null;
      try {
        const res = worldCanvas.requestPointerLock?.();
        if (res && typeof res.catch === 'function') res.catch(() => {});
      } catch {
        // Fallback otomatis tanpa pointer lock
      }
      showToast('Mode POV bebas aktif. Gerakkan kursor langsung (Esc / V keluar).');
    }
  }
});

window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

let ptrDown = false;
let ptrDragged = false;
let ptrButton = 0;
let ptrStartX = 0;
let ptrStartY = 0;
let ptrLastX = 0;
let ptrLastY = 0;

worldCanvas.style.cursor = 'grab';
worldCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

worldCanvas.addEventListener('pointerdown', (e) => {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  if (document.pointerLockElement === worldCanvas) return;
  ptrDown = true;
  ptrDragged = false;
  ptrButton = e.button;
  ptrStartX = e.clientX;
  ptrStartY = e.clientY;
  ptrLastX = e.clientX;
  ptrLastY = e.clientY;
  worldCanvas.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  if (document.pointerLockElement === worldCanvas) {
    garden.rotateCamera(-e.movementX * 0.0042, e.movementY * 0.0032);
    return;
  }
  if (freeLookMode) {
    if (freeLookLastX !== null) {
      garden.rotateCamera(-(e.clientX - freeLookLastX) * 0.0055, (e.clientY - freeLookLastY) * 0.0038);
    }
    freeLookLastX = e.clientX;
    freeLookLastY = e.clientY;
    return;
  }
  if (!ptrDown) return;
  const dx = e.clientX - ptrLastX;
  const dy = e.clientY - ptrLastY;
  ptrLastX = e.clientX;
  ptrLastY = e.clientY;
  if (!ptrDragged && Math.hypot(e.clientX - ptrStartX, e.clientY - ptrStartY) > 6) ptrDragged = true;
  if (ptrDragged) garden.rotateCamera(-dx * 0.0068, dy * 0.0046);
});

window.addEventListener('pointerup', (e) => {
  if (!ptrDown) return;
  const wasDrag = ptrDragged;
  const btn = ptrButton;
  ptrDown = false;
  ptrDragged = false;
  worldCanvas.style.cursor = 'grab';

  if (!wasDrag && btn === 0 && !modalOpen && titleOverlay.classList.contains('hidden')) {
    const pos = garden.screenToWorld(e.clientX, e.clientY);
    if (!pos) return;
    const clampedX = Math.max(60, Math.min(GARDEN_W - 60, pos.x));
    const clampedY = Math.max(60, Math.min(GARDEN_H - 60, pos.y));
    player.walkTarget = { x: clampedX, y: clampedY };
    player.autoInteract = true;
    garden.setClickTarget(clampedX, clampedY);
    audio.playClick();
  }
});

worldCanvas.addEventListener(
  'wheel',
  (e) => {
    if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
    e.preventDefault();
    garden.zoomCamera(e.deltaY * 0.014);
  },
  { passive: false }
);

// Touch D-Pad
document.querySelectorAll('.dpad-btn').forEach((btn) => {
  const dir = btn.dataset.dir;
  const down = (e) => {
    e.preventDefault();
    touchDirs.add(dir);
    btn.classList.add('pressed');
    player.walkTarget = null;
  };
  const up = () => {
    touchDirs.delete(dir);
    btn.classList.remove('pressed');
  };
  btn.addEventListener('pointerdown', down);
  btn.addEventListener('pointerup', up);
  btn.addEventListener('pointerleave', up);
  btn.addEventListener('pointercancel', up);
});
document.getElementById('btn-touch-act')?.addEventListener('click', triggerNearestInteraction);
document.getElementById('btn-touch-play')?.addEventListener('click', openCurrentPuzzle);

// HUD Buttons
btnInteract.addEventListener('click', triggerNearestInteraction);
playBtn.addEventListener('click', openCurrentPuzzle);
document.getElementById('btn-open-tasks')?.addEventListener('click', openTasksModal);
document.getElementById('btn-open-study')?.addEventListener('click', openStudyHubModal);
document.getElementById('btn-open-profile')?.addEventListener('click', openProfileModal);
document.getElementById('btn-refill-heart')?.addEventListener('click', openRefillHeartModal);
document.getElementById('btn-toggle-help')?.addEventListener('click', () => helpPopover?.classList.toggle('hidden'));
btnToggleSound.addEventListener('click', () => {
  save.muted = !save.muted;
  audio.setMuted(save.muted);
  persistGardenSave(save);
  refreshHud();
  if (!save.muted) audio.playClick();
});

// ==========================================
// 60FPS MAIN LOOP
// ==========================================
let lastTs = performance.now();

function tick(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;
  updateGarden(dt);
  garden.update(dt);
  garden.render(ts / 1000, { player, ciko, nearestInteract });
  requestAnimationFrame(tick);
}

function updateGarden(dt) {
  const canMove = !modalOpen && titleOverlay.classList.contains('hidden');
  let vx = 0;
  let vy = 0;

  if (canMove) {
    let inX = 0;
    let inY = 0;
    if (keys.has('w') || keys.has('arrowup') || touchDirs.has('up')) inY -= 1;
    if (keys.has('s') || keys.has('arrowdown') || touchDirs.has('down')) inY += 1;
    if (keys.has('a') || keys.has('arrowleft') || touchDirs.has('left')) inX -= 1;
    if (keys.has('d') || keys.has('arrowright') || touchDirs.has('right')) inX += 1;

    if (inX !== 0 || inY !== 0) {
      const yaw = garden.getCameraYaw();
      vx = inX * Math.cos(yaw) + inY * Math.sin(yaw);
      vy = -inX * Math.sin(yaw) + inY * Math.cos(yaw);
    } else if (player.walkTarget) {
      const dx = player.walkTarget.x - player.x;
      const dy = player.walkTarget.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        vx = dx / dist;
        vy = dy / dist;
      } else {
        player.walkTarget = null;
        if (player.autoInteract && nearestInteract) {
          player.autoInteract = false;
          triggerNearestInteraction();
        }
      }
    }
  }

  const mag = Math.hypot(vx, vy);
  player.moving = mag > 0.01;
  player.sprinting = keys.has('shift');

  if (player.moving) {
    const nx = vx / mag;
    const ny = vy / mag;
    if (Math.abs(nx) > Math.abs(ny)) player.facing = nx > 0 ? 'right' : 'left';
    else player.facing = ny > 0 ? 'down' : 'up';

    const speed = player.sprinting ? 280 : 190;
    player.x = Math.max(56, Math.min(GARDEN_W - 56, player.x + nx * speed * dt));
    player.y = Math.max(56, Math.min(GARDEN_H - 56, player.y + ny * speed * dt));
    audio.playFootstep(player.sprinting);

    saveCooldown -= dt;
    if (saveCooldown <= 0) {
      save.x = Math.round(player.x);
      save.y = Math.round(player.y);
      save.facing = player.facing;
      persistGardenSave(save);
      saveCooldown = 1.2;
    }
  }

  const offX = player.facing === 'right' ? -28 : 28;
  ciko.x += (player.x + offX - ciko.x) * Math.min(1, dt * 5);
  ciko.y += (player.y - 16 - ciko.y) * Math.min(1, dt * 5);

  if (canMove) {
    nearestInteract = findNearestInteractable();
    if (nearestInteract) {
      interactLabel.textContent = nearestInteract.label;
      btnInteract.classList.remove('hidden');
    } else {
      btnInteract.classList.add('hidden');
    }
  } else {
    btnInteract.classList.add('hidden');
  }
}

openAuthFlow('username');
refreshHud();
requestAnimationFrame(tick);
