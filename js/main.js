// Taman Kronik: Match-3 bertingkat + renovasi taman 3D dengan pratinjau langsung, peta area terkunci, dan daftar akun 2 langkah.

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
  SUGGESTED_USERNAMES,
  validateUsername,
  buildRegistrationExam
} from './data/registration.js';
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

const hudInitial = document.getElementById('hud-initial');
const hudLives = document.getElementById('hud-lives');
const hudStars = document.getElementById('hud-stars');
const hudCoins = document.getElementById('hud-coins');
const hudNextTask = document.getElementById('hud-next-task');
const hudTaskProgress = document.getElementById('hud-task-progress');
const hudCodexCount = document.getElementById('hud-codex-count');
const btnToggleSound = document.getElementById('btn-toggle-sound');
const helpPopover = document.getElementById('help-popover');

const mmProgress = document.getElementById('mm-progress');
const mmPins = document.getElementById('mm-pins');
const mmPlayer = document.getElementById('mm-player');

const playBtn = document.getElementById('btn-play-level');
const playDiffTag = document.getElementById('play-diff-tag');
const playLevelLabel = document.getElementById('play-level-label');

const zoneBanner = document.getElementById('zone-banner');
const zoneBannerSub = document.getElementById('zone-banner-sub');
const zoneBannerName = document.getElementById('zone-banner-name');
const btnInteract = document.getElementById('btn-interact');
const interactLabel = document.getElementById('interact-label');

// State
let save = getActiveGardenAccount() || createFreshGardenAccount('tamu', 'default');
audio.setMuted(save.muted);

const garden = new GardenWorld3D(worldCanvas);
window.addEventListener('resize', () => garden.resize());

const player = {
  x: save.x || 700,
  y: save.y || 760,
  facing: save.facing || 'up',
  moving: false,
  sprinting: false,
  walkTarget: null,
  autoInteract: false
};

const keys = new Set();
const touchDirs = new Set();
let modalOpen = false;
let previewOpen = false; // True saat Dock Pratinjau 3D terbuka (kamera tetap bisa diputar!)
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
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

let bannerTimer = null;
function showBanner(sub, title) {
  zoneBannerSub.textContent = sub;
  zoneBannerName.textContent = title;
  zoneBanner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => zoneBanner.classList.remove('show'), 2400);
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
    // Abaikan jika browser membatasi pointer lock
  }
}

function closeOverlay() {
  if (previewOpen) {
    previewOpen = false;
    garden.clearPreview(save.renovations || {}, save.stars || 0);
  }
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

// Miniatur siluet SVG arsitektur per objek untuk tombol pilihan gaya!
function renderSitePreviewSVG(siteId, style) {
  const c = style.color;
  const a = style.accent;
  if (siteId === 'gate') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="10" y="16" width="9" height="26" rx="2" fill="${c}"/><rect x="45" y="16" width="9" height="26" rx="2" fill="${c}"/><circle cx="14.5" cy="14" r="4" fill="${a}"/><circle cx="49.5" cy="14" r="4" fill="${a}"/><path d="M14.5 18 Q32 4 49.5 18" fill="none" stroke="${a}" stroke-width="3.2" stroke-linecap="round"/></svg>`;
  }
  if (siteId === 'fountain') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><ellipse cx="32" cy="36" rx="22" ry="7" fill="${c}"/><ellipse cx="32" cy="34" rx="17" ry="4.5" fill="${a}"/><rect x="28" y="20" width="8" height="14" rx="2" fill="${c}"/><ellipse cx="32" cy="20" rx="10" ry="3.5" fill="${c}"/><path d="M32 18 L32 8 M32 9 Q25 13 24 20 M32 9 Q39 13 40 20" fill="none" stroke="#9CE5F5" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  if (siteId === 'flowerbeds') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="8" y="28" width="48" height="12" rx="4" fill="#3B6342"/><circle cx="18" cy="25" r="6" fill="${c}"/><circle cx="32" cy="22" r="7" fill="${a}"/><circle cx="46" cy="25" r="6" fill="${c}"/><circle cx="25" cy="30" r="5" fill="${c}"/><circle cx="39" cy="30" r="5" fill="${a}"/></svg>`;
  }
  if (siteId === 'lanterns') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="29" y="18" width="6" height="24" rx="2" fill="${c}"/><rect x="23" y="39" width="18" height="4" rx="2" fill="${c}"/><polygon points="24,18 40,18 36,9 28,9" fill="${a}"/><circle cx="32" cy="14" r="8" fill="${a}" opacity="0.25"/><path d="M23 9 L32 4 L41 9 Z" fill="${c}"/></svg>`;
  }
  if (siteId === 'orwell_pavilion' || siteId === 'clock_gazebo') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><polygon points="10,20 32,7 54,20" fill="${a}"/><rect x="16" y="20" width="5" height="20" fill="${c}"/><rect x="43" y="20" width="5" height="20" fill="${c}"/><rect x="29" y="20" width="6" height="20" fill="${c}" opacity="0.75"/><rect x="11" y="38" width="42" height="5" rx="2" fill="${c}"/></svg>`;
  }
  if (siteId === 'tea_pergola') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><path d="M8 18 Q32 9 56 18 L52 22 L12 22 Z" fill="${a}"/><rect x="15" y="22" width="5" height="19" fill="${c}"/><rect x="44" y="22" width="5" height="19" fill="${c}"/><rect x="24" y="33" width="16" height="4" rx="1.5" fill="${c}"/><rect x="11" y="39" width="42" height="4" rx="2" fill="${c}"/></svg>`;
  }
  if (siteId === 'pond_bridge') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><ellipse cx="32" cy="39" rx="26" ry="5" fill="#3B7A8C" opacity="0.7"/><path d="M10 36 Q32 14 54 36" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/><path d="M14 29 Q32 10 50 29" fill="none" stroke="${a}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  }
  if (siteId === 'greenhouse') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><polygon points="12,22 32,9 52,22" fill="${a}" opacity="0.75" stroke="${c}" stroke-width="2.4"/><rect x="14" y="22" width="36" height="19" fill="${a}" opacity="0.55" stroke="${c}" stroke-width="2.4"/><line x1="26" y1="22" x2="26" y2="41" stroke="${c}" stroke-width="2"/><line x1="38" y1="22" x2="38" y2="41" stroke="${c}" stroke-width="2"/></svg>`;
  }
  if (siteId === 'sakura_grove') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="29" y="26" width="6" height="16" rx="2" fill="${a}"/><circle cx="32" cy="18" r="11" fill="${c}"/><circle cx="21" cy="23" r="8" fill="${c}"/><circle cx="43" cy="23" r="8" fill="${c}"/></svg>`;
  }
  if (siteId === 'rose_arch') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><path d="M15 41 L15 22 A17 17 0 0 1 49 22 L49 41" fill="none" stroke="${a}" stroke-width="5" stroke-linecap="round"/><circle cx="17" cy="22" r="4.2" fill="${c}"/><circle cx="25" cy="11" r="4.5" fill="${c}"/><circle cx="39" cy="11" r="4.5" fill="${c}"/><circle cx="47" cy="22" r="4.2" fill="${c}"/></svg>`;
  }
  // signal_tower
  return `<svg viewBox="0 0 64 48" class="st-svg"><polygon points="22,42 26,18 38,18 42,42" fill="${c}"/><path d="M24 18 A8 8 0 0 1 40 18 Z" fill="${a}"/><line x1="32" y1="10" x2="32" y2="4" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="4" r="2.2" fill="${a}"/></svg>`;
}

// Peta Taman Interaktif (menunjukkan posisi pemain + 12 area terkunci/siap/terbuka)
function renderMinimapPins() {
  const doneCount = getRestoredCount();
  if (mmProgress) mmProgress.textContent = `${doneCount}/${RESTORATION_TASKS.length}`;
  if (!mmPins) return;

  const stars = save.stars || 0;
  mmPins.innerHTML = RESTORATION_TASKS.map((t) => {
    const done = typeof save.renovations?.[t.id] === 'number';
    const ready = !done && stars >= t.starCost;
    const cls = done ? 'open' : ready ? 'ready' : 'locked';
    const leftPct = (t.x / GARDEN_W) * 100;
    const topPct = (t.y / GARDEN_H) * 100;
    const tip = done ? `${t.name} (Terbuka)` : ready ? `${t.name} (Siap · ${t.starCost} ★)` : `${t.name} (Terkunci · ${t.starCost} ★)`;
    return `<button class="mm-pin ${cls}" data-mm-site="${t.id}" style="left:${leftPct.toFixed(1)}%; top:${topPct.toFixed(1)}%;" type="button" title="${escapeHtml(tip)}"></button>`;
  }).join('');

  mmPins.querySelectorAll('[data-mm-site]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalOpen) return;
      const task = RESTORATION_TASKS.find((x) => x.id === btn.dataset.mmSite);
      if (task) openRenovationPreview(task);
    });
  });
}

function updateMinimapPlayer() {
  if (!mmPlayer) return;
  const leftPct = (player.x / GARDEN_W) * 100;
  const topPct = (player.y / GARDEN_H) * 100;
  mmPlayer.style.left = `${leftPct.toFixed(1)}%`;
  mmPlayer.style.top = `${topPct.toFixed(1)}%`;
}

function refreshHud() {
  syncLives(save);
  const initial = (save.username || 'T').charAt(0).toUpperCase();
  if (hudInitial) hudInitial.textContent = initial;
  hudLives.textContent = `${save.lives}/${MAX_LIVES}`;
  hudStars.textContent = String(save.stars || 0);
  hudCoins.textContent = String(save.coins || 0);
  hudCodexCount.textContent = `${(save.codexIds || []).length}/${TOTAL_CODEX}`;
  btnToggleSound.textContent = save.muted ? 'Mati' : 'Suara';

  const doneCount = getRestoredCount();
  const next = getNextPendingTask();
  hudTaskProgress.textContent = `${doneCount}/${RESTORATION_TASKS.length}`;
  hudNextTask.textContent = next
    ? `${next.name} · ${next.starCost} ★`
    : `Musim ${save.season || 1} Selesai`;

  const cfg = getLevelConfig(save.level || 1);
  playLevelLabel.textContent = `Main · Level ${cfg.level}`;
  playDiffTag.textContent = `${cfg.difficulty} · +${cfg.starReward} ★`;
  playBtn.classList.remove('hard', 'super');
  if (cfg.difficulty === 'Sulit') playBtn.classList.add('hard');
  if (cfg.difficulty === 'Sangat Sulit') playBtn.classList.add('super');

  garden.syncRenovations(save.renovations || {}, null, save.stars || 0);
  renderMinimapPins();
  updateMinimapPlayer();
}

// ==========================================
// INTERAKSI DI TAMAN 3D
// ==========================================
function findNearestInteractable() {
  let best = null;
  let bestDist = 96;

  for (const task of RESTORATION_TASKS) {
    const d = Math.hypot(task.x - player.x, task.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      const done = typeof save.renovations?.[task.id] === 'number';
      best = {
        kind: 'task',
        x: task.x,
        y: task.y,
        label: done ? `Ubah ${task.name}` : `Lihat ${task.name} (${task.starCost} ★)`,
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
        label: `${npc.name} · ${npc.role}`,
        data: npc
      };
    }
  }

  return best;
}

function triggerNearestInteraction() {
  if (modalOpen || previewOpen || !titleOverlay.classList.contains('hidden')) return;
  if (!nearestInteract) return;
  exitPointerLockSafe();
  player.walkTarget = null;
  if (nearestInteract.kind === 'task') {
    openRenovationPreview(nearestInteract.data);
  } else if (nearestInteract.kind === 'npc') {
    openNpcStudy(nearestInteract.data);
  }
}

// ==========================================
// MATCH-3 PUZZLE
// ==========================================
function openCurrentPuzzle() {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  if (previewOpen) closeOverlay();
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
      garden.spawnBurst(player.x, player.y, '#D9B466', 28);
      showBanner(`LEVEL ${level} SELESAI`, `+${stars} ★ · +${coins} Koin`);
    },
    onLose: () => {
      if (save.lives >= MAX_LIVES) save.lastLifeAt = Date.now();
      save.lives = Math.max(0, save.lives - 1);
      persistGardenSave(save);
      closeOverlay();
      showToast(`Nyawa tersisa ${save.lives}/${MAX_LIVES}.`);
    },
    onClose: closeOverlay
  });
}

// ==========================================
// ISI ULANG NYAWA (+1 ♥)
// ==========================================
function openRefillHeartModal() {
  if (previewOpen) closeOverlay();
  exitPointerLockSafe();
  syncLives(save);
  modalOpen = true;
  audio.playClick();

  if (save.lives >= MAX_LIVES) {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:380px; text-align:center;">
          <h2 style="margin:0 0 8px; font-family:var(--font-display); color:var(--paper);">♥ ${save.lives}/${MAX_LIVES}</h2>
          <p style="margin:0 0 16px; color:var(--muted); font-size:0.86rem;">Nyawa penuh.</p>
          <button class="rpg-btn gold" id="btn-hr-close" type="button">Tutup</button>
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
        <div class="altar-card" style="max-width:480px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
            <strong style="font-size:0.94rem; color:var(--paper);">Isi +1 ♥ · ${escapeHtml(q.topic)}</strong>
            <button class="rpg-btn ghost" id="btn-hr-close" type="button" style="padding:6px 12px; font-size:0.78rem;">Tutup</button>
          </div>
          <p style="margin:0 0 10px; font-size:0.8rem; color:var(--muted);">♥ ${save.lives}/${MAX_LIVES} · Pulih otomatis ${minTxt}</p>
          ${q.audioText ? `<button class="speak-btn" id="btn-hr-audio" type="button" style="margin-bottom:8px;">Suara</button>` : ''}
          <div class="math-q-box" style="margin-bottom:10px;">
            <p class="math-q-text" style="font-size:0.96rem;">${escapeHtml(q.prompt)}</p>
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
            <div class="insight-box" style="margin-top:10px;">
              <p style="margin:0;"><strong>${feedback.ok ? '+1 ♥ aktif.' : 'Keliru.'}</strong> ${escapeHtml(q.explain)}</p>
            </div>
            <div style="margin-top:10px; text-align:right;">
              <button class="rpg-btn gold" id="btn-hr-done" type="button">${feedback.ok ? 'Selesai' : 'Soal Lain'}</button>
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
// PRATINJAU RENOVASI 3D LANGSUNG (DOCK BAWAH TANPA MENUTUP TAMAN!)
// ==========================================
function openRenovationPreview(task) {
  exitPointerLockSafe();
  modalOpen = false;
  previewOpen = true;
  audio.playClick();

  const alreadyDone = typeof save.renovations?.[task.id] === 'number';
  let pickedStyle = alreadyDone ? save.renovations[task.id] : 0;

  // Fokus kamera 3D langsung ke objek & tampilkan bentuk gaya pertama secara live!
  garden.setCameraFocus(task.x, task.y, 12.2, 0.42);
  garden.previewSiteStyle(task.id, pickedStyle);

  function renderDock() {
    const canPay = alreadyDone || (save.stars || 0) >= task.starCost;
    overlayRoot.innerHTML = `
      <div class="ren-dock-wrap">
        <div class="ren-dock">
          <div class="ren-dock-head">
            <div>
              <h3>${escapeHtml(task.name)}</h3>
              <span>${alreadyDone ? 'Ganti gaya gratis · Seret layar untuk putar 3D' : `Pratinjau 3D · Butuh ${task.starCost} ★ (kamu punya ${save.stars || 0} ★)`}</span>
            </div>
            <button class="rpg-btn ghost" id="btn-ren-cancel" type="button" style="padding:6px 12px; font-size:0.78rem;">Batal</button>
          </div>

          <div class="ren-dock-body">
            <div class="ren-style-row">
              ${task.styles
                .map(
                  (st) => `
                <button class="ren-style-btn ${pickedStyle === st.id ? 'selected' : ''}" data-st-id="${st.id}" type="button">
                  <div class="ren-thumb">${renderSitePreviewSVG(task.id, st)}</div>
                  <div class="ren-meta">
                    <strong>${escapeHtml(st.name)}</strong>
                    <small>${escapeHtml(st.note)}</small>
                  </div>
                </button>
              `
                )
                .join('')}
            </div>

            <div class="ren-dock-cta">
              ${
                canPay
                  ? `<button class="rpg-btn gold" id="btn-ren-confirm" type="button">${alreadyDone ? 'Simpan Gaya' : `Pasang · ${task.starCost} ★`}</button>`
                  : `<button class="rpg-btn primary" id="btn-ren-play" type="button">Main Level ${save.level} (+★)</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-ren-cancel')?.addEventListener('click', () => {
      audio.playClick();
      closeOverlay();
    });

    document.querySelectorAll('[data-st-id]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        pickedStyle = Number(b.dataset.stId);
        garden.previewSiteStyle(task.id, pickedStyle);
        renderDock();
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

      previewOpen = false;
      garden.previewSiteId = null;
      garden.clearCameraFocus();
      garden.syncRenovations(save.renovations, task.id, save.stars);
      audio.playRenovate();

      player.x = Math.min(GARDEN_W - 80, Math.max(80, task.x));
      player.y = Math.min(GARDEN_H - 80, Math.max(80, task.y + 72));
      save.x = Math.round(player.x);
      save.y = Math.round(player.y);
      persistGardenSave(save);

      overlayRoot.innerHTML = '';
      refreshHud();
      showBanner(alreadyDone ? 'GAYA TERSIMPAN' : `AREA TERBUKA · +${task.coinReward} KOIN`, task.name);
    });
  }

  renderDock();
}

// ==========================================
// DAFTAR 12 AREA TAMAN (T)
// ==========================================
function openTasksModal() {
  if (previewOpen) closeOverlay();
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();
  const doneCount = getRestoredCount();
  const allDone = doneCount >= RESTORATION_TASKS.length;

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal" style="max-width:640px;">
        <div class="panel-head">
          <h2>Area Taman (${doneCount}/${RESTORATION_TASKS.length})</h2>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-weight:800; color:var(--gold); font-size:0.9rem;">${save.stars || 0} ★</span>
            <button class="rpg-btn ghost" id="btn-tk-close" type="button" style="padding:7px 13px; font-size:0.8rem;">Tutup</button>
          </div>
        </div>

        ${
          allDone
            ? `
          <div class="insight-box" style="margin:0 0 12px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
            <p style="margin:0;"><strong>Musim ${save.season || 1} selesai.</strong> Buka Musim ${(save.season || 1) + 1} (+250 Koin).</p>
            <button class="rpg-btn gold" id="btn-next-season" type="button" style="padding:8px 16px; font-size:0.82rem;">Musim ${(save.season || 1) + 1}</button>
          </div>
        `
            : ''
        }

        <div class="codex-list">
          ${RESTORATION_TASKS.map((t) => {
            const done = typeof save.renovations?.[t.id] === 'number';
            const styleName = done ? t.styles[save.renovations[t.id]]?.name : null;
            const ready = !done && (save.stars || 0) >= t.starCost;
            return `
              <div class="task-row ${done ? 'done' : ready ? 'ready' : ''}">
                <div>
                  <div style="font-weight:800; color:var(--paper); font-size:0.92rem;">${escapeHtml(t.name)}</div>
                  <div style="font-size:0.78rem; color:var(--muted);">${done ? `Terbuka · ${escapeHtml(styleName)}` : ready ? `Siap dibuka · ${t.starCost} ★` : `Terkunci · ${t.starCost} ★`}</div>
                </div>
                <button class="rpg-btn ${ready ? 'gold' : 'ghost'}" data-open-ren="${t.id}" type="button" style="padding:7px 13px; font-size:0.78rem;">
                  ${done ? 'Ubah' : 'Lihat 3D'}
                </button>
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
      if (task) {
        modalOpen = false;
        openRenovationPreview(task);
      }
    });
  });
  document.getElementById('btn-next-season')?.addEventListener('click', () => {
    save.season = (save.season || 1) + 1;
    save.renovations = {};
    save.coins = (save.coins || 0) + 250;
    persistGardenSave(save);
    garden.syncRenovations({}, null, save.stars);
    audio.playGateUnlock();
    closeOverlay();
    showBanner(`MUSIM ${save.season}`, '+250 Koin');
  });
}

// ==========================================
// ARSIP & RUANG BELAJAR (C)
// ==========================================
function unlockCodexId(id) {
  if (id && !save.codexIds.includes(id)) {
    save.codexIds.push(id);
    persistGardenSave(save);
    refreshHud();
  }
}

function handleStudyComplete({ badgeName, coins = 50 }) {
  save.coins = (save.coins || 0) + coins;
  persistGardenSave(save);
  audio.playVictory();
  closeOverlay();
  showBanner('TERSIMPAN', `${badgeName} · +${coins} Koin`);
}

function openNpcStudy(npc) {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  if (npc.action === 'study_lit') {
    openClassicLitAcademy({ overlayRoot, save, onUnlockLit: unlockCodexId, onComplete: handleStudyComplete, onClose: closeOverlay });
  } else if (npc.action === 'study_korean') {
    openKoreanAcademy({ overlayRoot, save, onComplete: handleStudyComplete, onClose: closeOverlay });
  } else if (npc.action === 'study_cyber') {
    openCyberLab({ overlayRoot, save, onUnlockIntel: unlockCodexId, onComplete: handleStudyComplete, onClose: closeOverlay });
  }
}

function getAllCodexEntries() {
  return [
    ...CLASSIC_LIT_ACADEMY.concepts.map((lit) => ({
      id: lit.id,
      group: 'lit',
      groupLabel: lit.author,
      title: lit.title,
      summary: lit.summary,
      detail: lit.modernLink
    })),
    ...CYBER_LAB.breakthroughs.map((cb) => ({
      id: cb.id,
      group: 'cyber',
      groupLabel: cb.category,
      title: cb.title,
      summary: cb.summary,
      detail: cb.whyMatters
    })),
    ...DICTION_BANK.map((d) => ({
      id: d.id,
      group: 'diction',
      groupLabel: 'Diksi',
      title: d.term,
      summary: d.meaning,
      detail: d.usage
    })),
    ...FALLACIES_BANK.map((fl) => ({
      id: fl.id,
      group: 'fallacy',
      groupLabel: 'Logika',
      title: fl.fallacyName,
      summary: fl.meaning,
      detail: fl.usage
    })),
    ...FACTS_BANK.map((f) => ({
      id: f.id,
      group: 'fact',
      groupLabel: f.category,
      title: f.isFact ? 'Fakta' : 'Mitos',
      summary: f.statement,
      detail: f.punchline
    }))
  ];
}

function openStudyHubModal() {
  if (previewOpen) closeOverlay();
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
            <h2>Arsip (${save.codexIds.length}/${TOTAL_CODEX})</h2>
            <button class="rpg-btn ghost" id="btn-st-close" type="button" style="padding:7px 14px; font-size:0.8rem;">Tutup</button>
          </div>

          <div class="codex-bar" style="margin-bottom:10px;">
            <button class="rpg-btn ghost" id="btn-open-ac-lit" type="button" style="padding:7px 12px; font-size:0.78rem;">Sastra</button>
            <button class="rpg-btn ghost" id="btn-open-ac-kr" type="button" style="padding:7px 12px; font-size:0.78rem;">Korea</button>
            <button class="rpg-btn ghost" id="btn-open-ac-poly" type="button" style="padding:7px 12px; font-size:0.78rem;">Jepang & Inggris</button>
            <button class="rpg-btn ghost" id="btn-open-ac-cyber" type="button" style="padding:7px 12px; font-size:0.78rem;">Siber</button>
            <button class="rpg-btn ghost" id="btn-open-ac-rhet" type="button" style="padding:7px 12px; font-size:0.78rem;">Retorika</button>
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
            <button class="filter-chip ${revealAll ? 'active' : ''}" id="btn-cd-reveal" type="button">${revealAll ? 'Sembunyikan' : 'Tampilkan Semua'}</button>
            <input class="rpg-input" id="cd-search" type="search" placeholder="Cari..." value="${escapeHtml(query)}" style="max-width:190px; padding:6px 10px; font-size:0.8rem;" />
          </div>

          <div class="codex-list">
            ${list
              .map((item) => {
                const open = revealAll || save.codexIds.includes(item.id);
                if (!open) {
                  return `<div class="codex-item locked"><h4>Terkunci · ${escapeHtml(item.groupLabel)}</h4><p>Buka lewat Segel Ilmu di papan puzzle.</p></div>`;
                }
                return `
                  <div class="codex-item">
                    <small style="color:var(--gold); font-weight:700;">${escapeHtml(item.groupLabel)}</small>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.summary)}</p>
                    <p style="color:var(--muted);">${escapeHtml(item.detail)}</p>
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
// PROFIL RINGKAS
// ==========================================
function openProfileModal() {
  if (previewOpen) closeOverlay();
  exitPointerLockSafe();
  modalOpen = true;
  audio.playClick();
  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="altar-card" style="max-width:440px;">
        <div class="panel-head" style="margin-bottom:14px;">
          <h2 style="margin:0; font-size:1.3rem;">@${escapeHtml(save.username)}</h2>
          <button class="rpg-btn ghost" id="btn-pr-close" type="button" style="padding:6px 12px;">Tutup</button>
        </div>

        <div class="zone-map-grid" style="margin-bottom:14px;">
          <div class="zone-card unlocked"><h3>Level ${save.level}</h3><p>Puzzle</p></div>
          <div class="zone-card unlocked"><h3>${getRestoredCount()}/${RESTORATION_TASKS.length}</h3><p>Area Terbuka</p></div>
          <div class="zone-card unlocked"><h3>${save.solvedQuests || 0}</h3><p>Segel Terjawab</p></div>
          <div class="zone-card unlocked"><h3>${save.codexIds.length}/${TOTAL_CODEX}</h3><p>Arsip</p></div>
        </div>

        <div style="display:flex; gap:8px; justify-content:space-between;">
          <button class="rpg-btn ghost" id="btn-pr-switch" type="button">Ganti Akun</button>
          <button class="rpg-btn ghost" id="btn-pr-reset" type="button">Reset Progres</button>
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
    showToast('Progres diatur ulang.');
  });
}

// ==========================================
// DAFTAR AKUN 2 LANGKAH (USERNAME + 3 SOAL, TANPA PILIH KARAKTER!)
// ==========================================
const auth = {
  step: 'username',
  pendingUsername: '',
  errorMsg: '',
  examQuestions: [],
  examIdx: 0,
  examTimeLeft: 20,
  examTimerId: null,
  rejectReason: '',
  cooldownLeft: 0,
  cooldownTimerId: null
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
  player.y = save.y || 760;
  player.facing = save.facing || 'up';
  player.walkTarget = null;
  audio.setMuted(save.muted);
  refreshHud();
}

function enterGarden(account, isNew = false) {
  clearAuthTimers();
  save = account;
  save.prologueSeen = true;
  persistGardenSave(save);
  syncFromSave();
  titleOverlay.classList.add('hidden');
  hudLayer.classList.remove('hidden');
  audio.playWaypoint();
  // Tunjukkan sapuan panorama taman agar semua area terkunci & posisi kamu langsung terlihat!
  garden.playIntroSweep();
  showBanner(`MUSIM ${save.season || 1}`, isNew ? `@${save.username}` : `Level ${save.level}`);
}

function openAuthFlow(step = 'username') {
  clearAuthTimers();
  auth.step = step;
  auth.errorMsg = '';
  titleOverlay.classList.remove('hidden');
  renderAuthCard();
}

function renderStepper(num) {
  return `
    <div class="auth-stepper">
      <span class="step-pill ${num > 1 ? 'done' : 'active'}">1. Username</span>
      <span class="step-pill ${num === 2 ? 'active' : ''}">2. Verifikasi</span>
    </div>
  `;
}

function renderAuthCard() {
  if (auth.step === 'username') {
    const saved = listGardenAccounts();
    authCardRoot.innerHTML = `
      ${renderStepper(1)}
      <h1 class="title-logo">TAMAN KRONIK</h1>
      <p class="title-desc">Buat username lalu selesaikan 3 soal singkat.</p>

      <div class="title-form" style="max-width:380px;">
        <div class="username-row">
          <div class="username-wrap">
            <span class="username-at">@</span>
            <input id="input-username" class="rpg-input" type="text" maxlength="16" autocomplete="off" placeholder="username" value="${escapeHtml(auth.pendingUsername)}" />
          </div>
          <button class="rpg-btn ghost" id="btn-random-user" type="button" style="padding:11px 14px; font-size:0.82rem;">Acak</button>
        </div>
        <p class="auth-error" id="auth-error-msg">${escapeHtml(auth.errorMsg)}</p>
      </div>

      <div class="title-actions">
        <button class="rpg-btn primary" id="btn-start-exam" type="button">Lanjut</button>
      </div>

      ${
        saved.length > 0
          ? `
        <div class="saved-accounts-box">
          <div class="title-label" style="margin-bottom:4px;">Akun tersimpan</div>
          <div class="saved-accounts-list">
            ${saved
              .map(
                (acc) => `
              <button class="account-chip" data-login-user="${escapeHtml(acc.username)}" type="button">
                <span>@${escapeHtml(acc.username)}</span>
                <span style="color:var(--gold);">Lv.${acc.level}</span>
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
      const avail = SUGGESTED_USERNAMES.filter((u) => !existing.includes(u.toLowerCase()));
      auth.pendingUsername = avail.length ? avail[Math.floor(Math.random() * avail.length)] : `akun_${Math.floor(100 + Math.random() * 899)}`;
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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong style="font-size:0.9rem; color:var(--paper);">${escapeHtml(q.tag)}</strong>
        <span id="exam-timer-txt" style="font-size:0.86rem; font-weight:800; color:var(--gold);">${auth.examTimeLeft} dtk</span>
      </div>
      <div class="exam-timer-track"><div class="exam-timer-fill ${auth.examTimeLeft <= 5 ? 'urgent' : ''}" id="exam-timer-fill" style="width:${pct}%"></div></div>
      <div class="math-q-box" style="text-align:left;"><p class="math-q-text" style="font-size:0.98rem;">${escapeHtml(q.q)}</p></div>
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
        <p style="margin:0;">${escapeHtml(auth.rejectReason)}</p>
      </div>
      <div class="title-actions" style="margin-bottom:0;">
        <button class="rpg-btn primary" id="btn-retry-exam" type="button" ${waitLocked ? 'disabled style="opacity:0.55;"' : ''}>
          ${waitLocked ? `Tunggu ${auth.cooldownLeft} dtk` : 'Coba Ulang'}
        </button>
        <button class="rpg-btn ghost" id="btn-back-username" type="button">Ubah Username</button>
      </div>
    `;
    document.getElementById('btn-retry-exam')?.addEventListener('click', () => {
      if (auth.cooldownLeft <= 0) startGatekeeperExam();
    });
    document.getElementById('btn-back-username')?.addEventListener('click', () => openAuthFlow('username'));
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
      audio.playVictory();
      const created = registerGardenAccount(auth.pendingUsername, 'default');
      enterGarden(created, true);
    }
  } else {
    failExam(q.explain);
  }
}

function failExam(reason) {
  clearAuthTimers();
  audio.playWrong();
  auth.step = 'rejected';
  auth.rejectReason = reason;
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
        btn.textContent = 'Coba Ulang';
      }
    }
    if (auth.cooldownLeft <= 0) clearAuthTimers();
  }, 1000);
}

// ==========================================
// INPUT: KEYBOARD, POV KURSOR LANGSUNG, ZOOM, [V] FREE POV
// ==========================================
window.addEventListener('keydown', (e) => {
  const tag = e.target?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  const k = e.key.toLowerCase();
  if (k === 'enter' && tag === 'BUTTON') return;

  if (k === 'escape') {
    if (freeLookMode) {
      exitPointerLockSafe();
      showToast('POV bebas nonaktif.');
    }
    if (modalOpen || previewOpen) closeOverlay();
    return;
  }
  if (!titleOverlay.classList.contains('hidden') || modalOpen) return;

  if (previewOpen) return;

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
      showToast('POV bebas nonaktif.');
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
      showToast('POV bebas aktif (Esc / V keluar).');
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

  if (!wasDrag && btn === 0 && !modalOpen && !previewOpen && titleOverlay.classList.contains('hidden')) {
    const pos = garden.screenToWorld(e.clientX, e.clientY);
    if (!pos) return;
    const clampedX = Math.max(60, Math.min(GARDEN_W - 60, pos.x));
    const clampedY = Math.max(60, Math.min(GARDEN_H - 60, pos.y));

    // Jika klik dekat salah satu area renovasi, langsung buka pratinjau 3D-nya!
    const clickedSite = RESTORATION_TASKS.find((t) => Math.hypot(t.x - clampedX, t.y - clampedY) < 72);
    if (clickedSite) {
      openRenovationPreview(clickedSite);
      return;
    }

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

// Mobile Touch D-Pad
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
playBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openCurrentPuzzle();
});
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
  garden.render(ts / 1000, { player, nearestInteract });
  requestAnimationFrame(tick);
}

function updateGarden(dt) {
  const canMove = !modalOpen && !previewOpen && titleOverlay.classList.contains('hidden');
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
    updateMinimapPlayer();

    saveCooldown -= dt;
    if (saveCooldown <= 0) {
      save.x = Math.round(player.x);
      save.y = Math.round(player.y);
      save.facing = player.facing;
      persistGardenSave(save);
      saveCooldown = 1.2;
    }
  }

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
