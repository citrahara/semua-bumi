import { FACTS_BANK } from './data/facts.js';
import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { STAGE_PROMPTS } from './data/stage.js';
import { generateMathQuestion, GATE_META } from './data/math.js';
import {
  ZONES,
  BRIDGES,
  WAYPOINTS,
  CHESTS,
  NPCS,
  getActiveMainQuest,
  getZoneAt,
  isPointBlocked
} from './world.js';
import { CAST, renderCharacterSVG } from './characters.js';
import { WorldRenderer } from './renderer.js';
import { audio } from './audio.js';
import { MicStudio, detectKeywords } from './speech.js';
import {
  loadSave,
  persistSave,
  resetSave,
  xpNeededForLevel,
  grantRewards
} from './storage.js';

const TOTAL_CODEX = FACTS_BANK.length + DICTION_BANK.length + FALLACIES_BANK.length;

// DOM Refs
const worldCanvas = document.getElementById('world-canvas');
const minimapCanvas = document.getElementById('minimap-canvas');
const hudLayer = document.getElementById('hud-layer');
const titleOverlay = document.getElementById('title-overlay');
const overlayRoot = document.getElementById('overlay-root');
const toastEl = document.getElementById('toast');

const hudAvatar = document.getElementById('hud-avatar');
const hudPlayerName = document.getElementById('hud-player-name');
const hudArBadge = document.getElementById('hud-ar-badge');
const hudXpFill = document.getElementById('hud-xp-fill');
const hudZoneMini = document.getElementById('hud-zone-mini');
const hudCoins = document.getElementById('hud-coins');
const hudCodexCount = document.getElementById('hud-codex-count');
const btnToggleSound = document.getElementById('btn-toggle-sound');

const questChapterEl = document.getElementById('quest-chapter');
const questTitleEl = document.getElementById('quest-title');
const questDistEl = document.getElementById('quest-dist');
const zoneBanner = document.getElementById('zone-banner');
const zoneBannerSub = document.getElementById('zone-banner-sub');
const zoneBannerName = document.getElementById('zone-banner-name');
const btnInteract = document.getElementById('btn-interact');
const interactLabel = document.getElementById('interact-label');

// Core state
let save = loadSave();
audio.setMuted(save.muted);

const renderer = new WorldRenderer(worldCanvas, minimapCanvas);
renderer.resize();
window.addEventListener('resize', () => renderer.resize());

const mic = new MicStudio();

const player = {
  x: save.x,
  y: save.y,
  radius: 15,
  facing: save.facing || 'down',
  moving: false,
  sprinting: false,
  walkTarget: null,
  autoInteractAfterWalk: null
};

const ciko = {
  x: player.x - 32,
  y: player.y - 24,
  bubble: 'Ayo jelajahi Desa Warkop!',
  bubbleTimer: 4.5
};

const keys = new Set();
const touchDirs = new Set();
let touchSprint = false;
let modalOpen = false;
let currentZoneId = getZoneAt(player.x, player.y).id;
let nearestInteract = null;
let dustCooldown = 0;
let saveCooldown = 0;
let gateBumpCooldown = 0;
let stageTimerId = null;

// ==========================================
// HELPERS
// ==========================================

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

let bannerTimer = null;
function showZoneBanner(sub, title) {
  zoneBannerSub.textContent = sub;
  zoneBannerName.textContent = title;
  zoneBanner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => zoneBanner.classList.remove('show'), 2700);
}

function sayCiko(text, duration = 3.6) {
  ciko.bubble = text;
  ciko.bubbleTimer = duration;
}

function pickFreshItems(bank, count) {
  const unseen = bank.filter((item) => !save.codexIds.includes(item.id));
  const seen = bank.filter((item) => save.codexIds.includes(item.id));
  const ordered = [...shuffle(unseen), ...shuffle(seen)];
  return ordered.slice(0, count);
}

function awardAndNotify({ xp = 0, coins = 0, codexId = null }) {
  const prevLvl = save.level;
  const leveled = grantRewards(save, { xp, coins, codexId });
  refreshHud();
  if (leveled) {
    audio.playVictory();
    renderer.spawnBurst(player.x, player.y, '#FFD166', 32);
    showZoneBanner('NAIK LEVEL PETUALANG!', `Adventure Level ${save.level}`);
    sayCiko(`Wih naik ke Level ${save.level}!`, 4);
  }
  return save.level > prevLvl;
}

function refreshHud() {
  hudAvatar.innerHTML = renderCharacterSVG('hero', 'idle');
  hudPlayerName.textContent = save.playerName || 'Petualang';
  hudArBadge.textContent = `LV ${save.level}`;
  const need = xpNeededForLevel(save.level);
  const pct = Math.min(100, Math.round((save.xp / need) * 100));
  hudXpFill.style.width = `${pct}%`;

  const zone = getZoneAt(player.x, player.y);
  hudZoneMini.textContent = zone.name;
  hudCoins.textContent = `${save.coins} Koin`;
  hudCodexCount.textContent = `${save.codexIds.length}/${TOTAL_CODEX}`;
  btnToggleSound.textContent = save.muted ? 'Mati' : 'Suara';

  const q = getActiveMainQuest(save);
  questChapterEl.textContent = q.chapter;
  questTitleEl.textContent = q.title;
  if (q.target) {
    const meters = Math.max(1, Math.round(Math.hypot(q.target.x - player.x, q.target.y - player.y) / 14));
    questDistEl.textContent = `Arahkan ke ${q.target.label} · ${meters}m`;
  } else {
    questDistEl.textContent = 'Semua Misi Utama Selesai!';
  }
}

function closeOverlay() {
  if (stageTimerId) {
    clearInterval(stageTimerId);
    stageTimerId = null;
  }
  if (mic.isRecording) {
    mic.stop().catch(() => {});
  }
  modalOpen = false;
  overlayRoot.innerHTML = '';
  refreshHud();
}

// ==========================================
// INTERACTION DETECTION
// ==========================================

function findNearestInteractable() {
  let best = null;
  let bestDist = 78;

  for (const npc of NPCS) {
    const d = Math.hypot(npc.x - player.x, npc.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      best = {
        kind: 'npc',
        id: npc.id,
        x: npc.x,
        y: npc.y,
        label: `Bicara dengan ${CAST[npc.id].name}`,
        data: npc
      };
    }
  }

  for (const br of BRIDGES) {
    if (save.solvedGates.includes(br.id)) continue;
    const dAltar = Math.hypot(br.altar.x - player.x, br.altar.y - player.y);
    const dCenter = Math.hypot(br.rect.x + br.rect.w / 2 - player.x, br.rect.y + br.rect.h / 2 - player.y);
    const d = Math.min(dAltar, dCenter - 18);
    if (d < 84 && d < bestDist + 14) {
      bestDist = d;
      best = {
        kind: 'gate',
        id: br.id,
        x: br.altar.x,
        y: br.altar.y,
        label: `Pecahkan ${br.label}`,
        data: br
      };
    }
  }

  for (const ch of CHESTS) {
    if (save.openedChests.includes(ch.id)) continue;
    const d = Math.hypot(ch.x - player.x, ch.y - player.y);
    if (d < bestDist) {
      bestDist = d;
      best = {
        kind: 'chest',
        id: ch.id,
        x: ch.x,
        y: ch.y,
        label: `Buka ${ch.title}`,
        data: ch
      };
    }
  }

  for (const wp of WAYPOINTS) {
    const d = Math.hypot(wp.x - player.x, wp.y - player.y);
    if (d < bestDist) {
      const unlocked = save.unlockedWaypoints.includes(wp.id);
      bestDist = d;
      best = {
        kind: 'waypoint',
        id: wp.id,
        x: wp.x,
        y: wp.y,
        label: unlocked ? `Buka Peta Teleport (${wp.name})` : `Aktifkan ${wp.name}`,
        data: wp
      };
    }
  }

  return best;
}

function triggerNearestInteraction() {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  if (!nearestInteract) return;
  const item = nearestInteract;
  player.walkTarget = null;

  if (item.kind === 'waypoint') {
    handleWaypoint(item.data);
  } else if (item.kind === 'chest') {
    handleOpenChest(item.data);
  } else if (item.kind === 'gate') {
    openMathSealModal(item.data);
  } else if (item.kind === 'npc') {
    openNpcDialogue(item.data);
  }
}

// ==========================================
// WAYPOINT & CHEST INTERACTIONS
// ==========================================

function handleWaypoint(wp) {
  if (!save.unlockedWaypoints.includes(wp.id)) {
    save.unlockedWaypoints.push(wp.id);
    audio.playWaypoint();
    renderer.spawnBurst(wp.x, wp.y - 12, '#48DBFB', 28);
    awardAndNotify({ xp: 50, coins: 20 });
    showZoneBanner('WAYPOINT AKTIF (+50 XP)', wp.name);
    sayCiko('Mantap! Sekarang bisa teleportasi ke sini lewat Peta [M]!', 4.2);
  } else {
    openWorldMapModal();
  }
}

function handleOpenChest(ch) {
  if (save.openedChests.includes(ch.id)) return;
  save.openedChests.push(ch.id);
  audio.playChestOpen();
  renderer.spawnBurst(ch.x, ch.y, '#FFD166', 28);
  awardAndNotify({ xp: ch.xp, coins: ch.coins, codexId: ch.rewardId });

  const item = findCodexEntryById(ch.rewardId);
  modalOpen = true;
  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="altar-card" style="max-width:520px; text-align:center;">
        <div class="title-kicker">HARTA KARUN DITEMUKAN!</div>
        <h2 style="margin:0 0 8px; font-family:var(--font-display); font-size:1.75rem; color:var(--gold);">${escapeHtml(ch.title)}</h2>
        <p style="margin:0 0 14px; color:var(--muted); font-size:0.9rem;">
          +${ch.xp} XP · +${ch.coins} Koin Kopi · Kartu Baru Tersimpan di Codex!
        </p>
        ${
          item
            ? `
          <div class="insight-box" style="text-align:left; margin-bottom:18px;">
            <p><strong>[${escapeHtml(item.groupLabel)}] ${escapeHtml(item.title)}</strong></p>
            <p>${escapeHtml(item.summary)}</p>
            <p>${escapeHtml(item.example)}</p>
          </div>
        `
            : ''
        }
        <button class="rpg-btn gold" id="btn-close-chest" type="button">Simpan ke Tas & Lanjut Jalan</button>
      </div>
    </div>
  `;
  document.getElementById('btn-close-chest')?.addEventListener('click', () => {
    audio.playClick();
    closeOverlay();
    sayCiko('Harta karun wawasan diamankan!', 3.2);
  });
}

// ==========================================
// MATH SEAL ALTAR (UNLOCK LEVEL GATES!)
// ==========================================

function openMathSealModal(bridge) {
  const meta = GATE_META[bridge.gateLevel];
  modalOpen = true;
  audio.playDialogueOpen();

  let solvedCount = 0;
  let slotIndex = 0;
  let currentQ = generateMathQuestion(bridge.gateLevel, slotIndex);
  let lockedChoice = false;

  function renderAltar(feedback = null) {
    const runesHtml = [0, 1, 2]
      .map((i) => {
        const cls = i < solvedCount ? 'solved' : i === solvedCount ? 'active' : '';
        return `<div class="rune-gem ${cls}">${i < solvedCount ? '✓' : 'Σ'}</div>`;
      })
      .join('');

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
              <div class="title-kicker">SEGEL MATEMATIKA · BUKA LEVEL ${meta.unlocksLevel}</div>
              <h2 style="margin:0; font-family:var(--font-display); font-size:1.55rem; color:var(--gold);">${escapeHtml(meta.name)}</h2>
            </div>
            <button class="rpg-btn ghost" id="btn-altar-exit" type="button" style="padding:7px 14px; font-size:0.8rem;">Mundur</button>
          </div>
          <p style="margin:8px 0 0; font-size:0.88rem; color:var(--muted);">${escapeHtml(meta.flavor)}</p>

          <div class="rune-row">${runesHtml}</div>

          <div class="math-q-box">
            <span class="math-tag">Rune ${feedback && feedback.ok ? solvedCount : Math.min(meta.requiredRunes, solvedCount + 1)} dari ${meta.requiredRunes} · ${escapeHtml(currentQ.tag)}</span>
            <p class="math-q-text">${escapeHtml(currentQ.question)}</p>
          </div>

          <div class="choice-grid two-col">
            ${currentQ.choices
              .map(
                (ch, idx) => `
              <button
                class="rpg-choice ${
                  feedback
                    ? ch.correct
                      ? 'ok'
                      : feedback.picked === idx
                      ? 'bad'
                      : ''
                    : ''
                }"
                data-math-idx="${idx}"
                type="button"
                ${lockedChoice ? 'disabled' : ''}
              >
                <span class="choice-badge">${['A', 'B', 'C', 'D'][idx]}</span>
                <span>${escapeHtml(ch.label)}</span>
              </button>
            `
              )
              .join('')}
          </div>

          ${
            feedback
              ? `
            <div class="insight-box" style="margin-top:14px;">
              <p><strong>${feedback.ok ? 'RUNE PECAH!' : 'Segel menolak jawabanmu!'}</strong> ${escapeHtml(currentQ.explain)}</p>
              <p>${feedback.ok ? 'Energi matematika mengalir ke jembatan!' : 'Pelajari rumusnya, lalu coba 1 rune pengganti untuk lanjut.'}</p>
            </div>
            <div style="margin-top:14px; text-align:right;">
              <button class="rpg-btn gold" id="btn-math-next" type="button">
                ${solvedCount >= meta.requiredRunes ? `Hancurkan Segel & Buka ${meta.unlocksZone}!` : feedback.ok ? 'Lanjut Rune Berikutnya' : 'Coba Rune Pengganti'}
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    document.getElementById('btn-altar-exit')?.addEventListener('click', () => {
      audio.playClick();
      closeOverlay();
    });

    document.querySelectorAll('[data-math-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (lockedChoice) return;
        const idx = Number(btn.dataset.mathIdx);
        const chosen = currentQ.choices[idx];
        lockedChoice = true;

        if (chosen.correct) {
          solvedCount += 1;
          save.mathSolvedCount += 1;
          persistSave(save);
          audio.playRuneBreak();
          renderAltar({ ok: true, picked: idx });
        } else {
          audio.playWrong();
          renderAltar({ ok: false, picked: idx });
        }
      });
    });

    document.getElementById('btn-math-next')?.addEventListener('click', () => {
      if (solvedCount >= meta.requiredRunes) {
        if (!save.solvedGates.includes(bridge.id)) {
          save.solvedGates.push(bridge.id);
        }
        closeOverlay();
        audio.playGateUnlock();
        renderer.triggerShake(14);
        renderer.spawnBurst(bridge.rect.x + bridge.rect.w / 2, bridge.rect.y + bridge.rect.h / 2, '#FFD166', 44);
        awardAndNotify({ xp: 120, coins: 80 });
        showZoneBanner(`SEGEL HANCUR! LEVEL ${meta.unlocksLevel} TERBUKA`, `Jembatan ke ${meta.unlocksZone} kini bisa dilalui!`);
        sayCiko(`Gacor! Ayo seberangi jembatan ke ${meta.unlocksZone}!`, 5);
        return;
      }

      if (feedback && feedback.ok) {
        slotIndex += 1;
      }
      currentQ = generateMathQuestion(bridge.gateLevel, slotIndex);
      lockedChoice = false;
      renderAltar(null);
    });
  }

  renderAltar(null);
}

// ==========================================
// NPC DIALOGUE, KNOWLEDGE BATTLES & BOSS STAGE
// ==========================================

function openNpcDialogue(npc) {
  modalOpen = true;
  audio.playDialogueOpen();
  if (!save.talkedNpcs.includes(npc.id)) {
    save.talkedNpcs.push(npc.id);
    persistSave(save);
  }

  const info = CAST[npc.id];
  const alreadyDone = save.completedNpcs.includes(npc.id);

  // Bang Jaja adalah pemberi quest cerita
  if (npc.challengeType === 'story') {
    const lines = alreadyDone ? npc.repeatLines : npc.introLines;
    let lineIdx = 0;

    function renderStory() {
      const isLast = lineIdx >= lines.length - 1;
      overlayRoot.innerHTML = `
        <div class="dialogue-backdrop">
          <div class="dialogue-box">
            <div class="dialogue-top">
              <div class="portrait-box">${renderCharacterSVG(npc.id, 'happy')}</div>
              <div>
                <div class="npc-header">
                  <span class="npc-name">${info.name}</span>
                  <span class="npc-role">${info.role}</span>
                </div>
                <p class="dialogue-text">"${escapeHtml(lines[lineIdx])}"</p>
              </div>
            </div>
            <div class="dialogue-footer">
              <span style="font-size:0.8rem; color:var(--muted);">Dialog ${lineIdx + 1}/${lines.length}</span>
              <div style="display:flex; gap:8px;">
                <button class="rpg-btn gold" id="btn-story-next" type="button">
                  ${isLast ? 'Siap Jalankan Misi!' : 'Lanjut'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('btn-story-next')?.addEventListener('click', () => {
        audio.playClick();
        if (!isLast) {
          lineIdx += 1;
          renderStory();
        } else {
          if (!save.completedNpcs.includes('jaja')) {
            save.completedNpcs.push('jaja');
            awardAndNotify({ xp: 40, coins: 20 });
          }
          closeOverlay();
          sayCiko('Ikuti panah emas menuju Kang Deden di utara!', 4.5);
        }
      });
    }
    renderStory();
    return;
  }

  // NPC dengan tantangan (Intro dulu -> langsung masuk Duel/Quest!)
  let introIdx = 0;
  const lines = alreadyDone
    ? [`${npc.doneLines[0]} Mau tanding ulang pakai tantangan baru biar wawasanmu makin gacor?`]
    : npc.introLines;

  function renderIntro() {
    const isLast = introIdx >= lines.length - 1;
    overlayRoot.innerHTML = `
      <div class="dialogue-backdrop">
        <div class="dialogue-box">
          <div class="dialogue-top">
            <div class="portrait-box">${renderCharacterSVG(npc.id, alreadyDone ? 'happy' : 'idle')}</div>
            <div>
              <div class="npc-header">
                <span class="npc-name">${info.name}</span>
                <span class="npc-role">${info.role} · ${escapeHtml(npc.questTitle)}</span>
              </div>
              <p class="dialogue-text">"${escapeHtml(lines[introIdx])}"</p>
            </div>
          </div>
          <div class="dialogue-footer">
            <button class="rpg-btn ghost" id="btn-npc-leave" type="button">Nanti Dulu</button>
            <button class="rpg-btn primary" id="btn-npc-go" type="button">
              ${isLast ? (alreadyDone ? 'Tanding Ulang!' : 'Terima Tantangan!') : 'Lanjut'}
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('btn-npc-leave')?.addEventListener('click', () => {
      audio.playClick();
      closeOverlay();
    });
    document.getElementById('btn-npc-go')?.addEventListener('click', () => {
      audio.playClick();
      if (!isLast) {
        introIdx += 1;
        renderIntro();
      } else if (npc.challengeType === 'stage') {
        runBossStageChallenge(npc);
      } else {
        runNpcChallenge(npc);
      }
    });
  }
  renderIntro();
}

function runNpcChallenge(npc) {
  const info = CAST[npc.id];
  const bank =
    npc.challengeType === 'fact'
      ? FACTS_BANK
      : npc.challengeType === 'diction'
      ? DICTION_BANK
      : FALLACIES_BANK;

  const questions = pickFreshItems(bank, npc.questionCount || 2).map((q) =>
    q.options ? { ...q, options: shuffle(q.options) } : q
  );

  let qIdx = 0;
  let rightCount = 0;
  let enemyHp = questions.length;
  let answered = false;

  function renderQ(feedback = null) {
    const q = questions[qIdx];
    const hpPct = Math.round((enemyHp / questions.length) * 100);
    const mood = feedback ? (feedback.ok ? 'shock' : 'smug') : 'idle';

    const promptText =
      npc.challengeType === 'fact'
        ? `"${q.statement}"`
        : npc.challengeType === 'diction'
        ? q.prompt
        : q.attack;

    let choicesHtml = '';
    if (npc.challengeType === 'fact') {
      choicesHtml = `
        <div class="choice-grid two-col">
          <button class="rpg-choice ${feedback ? (q.isFact ? 'ok' : feedback.picked === true ? 'bad' : '') : ''}" id="btn-f-true" type="button" ${answered ? 'disabled' : ''}>
            <span class="choice-badge">1</span>
            <span><strong>FAKTA GACOR</strong><br/><small style="color:var(--muted);">Benar ada buktinya</small></span>
          </button>
          <button class="rpg-choice ${feedback ? (!q.isFact ? 'ok' : feedback.picked === false ? 'bad' : '') : ''}" id="btn-f-false" type="button" ${answered ? 'disabled' : ''}>
            <span class="choice-badge">2</span>
            <span><strong>BUALAN WARKOP</strong><br/><small style="color:var(--muted);">Mitos / ngarang bebas</small></span>
          </button>
        </div>
      `;
    } else {
      const letters = ['A', 'B', 'C'];
      choicesHtml = `
        <div class="choice-grid">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="rpg-choice ${feedback ? (opt.correct ? 'ok' : feedback.picked === idx ? 'bad' : '') : ''}" data-opt="${idx}" type="button" ${answered ? 'disabled' : ''}>
              <span class="choice-badge">${letters[idx]}</span>
              <span>${escapeHtml(opt.text)}</span>
            </button>
          `
            )
            .join('')}
        </div>
      `;
    }

    overlayRoot.innerHTML = `
      <div class="dialogue-backdrop">
        <div class="dialogue-box">
          <div class="dialogue-top">
            <div class="portrait-box">${renderCharacterSVG(npc.id, mood)}</div>
            <div>
              <div class="npc-header">
                <span class="npc-name">${info.name}</span>
                <span class="npc-role">Tantangan ${qIdx + 1}/${questions.length}</span>
                <div class="hp-strip">
                  <span>Perisai Lawan</span>
                  <div class="hp-track"><div class="hp-fill" style="width:${hpPct}%"></div></div>
                </div>
              </div>
              <p class="dialogue-text">${escapeHtml(promptText)}</p>
            </div>
          </div>

          ${choicesHtml}

          ${
            feedback
              ? `
            <div class="insight-box">
              <p><strong>${escapeHtml(feedback.verdict)}</strong> ${escapeHtml(feedback.detail)}</p>
              <p>${escapeHtml(feedback.tip)}</p>
            </div>
            <div class="dialogue-footer">
              <span style="font-size:0.8rem; color:var(--gold);">+ Kartu tersimpan di Codex Warkop</span>
              <button class="rpg-btn gold" id="btn-q-next" type="button">
                ${qIdx >= questions.length - 1 ? 'Selesaikan Quest!' : 'Lanjut Tantangan Berikutnya'}
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    if (npc.challengeType === 'fact') {
      document.getElementById('btn-f-true')?.addEventListener('click', () => pickFact(true));
      document.getElementById('btn-f-false')?.addEventListener('click', () => pickFact(false));
    } else {
      document.querySelectorAll('[data-opt]').forEach((b) => {
        b.addEventListener('click', () => pickOption(Number(b.dataset.opt)));
      });
    }

    document.getElementById('btn-q-next')?.addEventListener('click', () => {
      audio.playClick();
      if (qIdx < questions.length - 1) {
        qIdx += 1;
        answered = false;
        renderQ(null);
      } else {
        finishNpcQuest(npc, rightCount, questions.length);
      }
    });
  }

  function pickFact(val) {
    if (answered) return;
    answered = true;
    const q = questions[qIdx];
    const ok = val === q.isFact;
    if (ok) {
      rightCount += 1;
      enemyHp = Math.max(0, enemyHp - 1);
      audio.playCorrect();
    } else {
      audio.playWrong();
    }
    awardAndNotify({ xp: ok ? 35 : 15, coins: ok ? 20 : 8, codexId: q.id });
    renderQ({
      ok,
      picked: val,
      verdict: ok ? 'KRITIKAL WAWASAN!' : 'Kena Gocek!',
      detail: q.punchline,
      tip: q.hook
    });
  }

  function pickOption(idx) {
    if (answered) return;
    answered = true;
    const q = questions[qIdx];
    const opt = q.options[idx];
    const ok = Boolean(opt && opt.correct);
    if (ok) {
      rightCount += 1;
      enemyHp = Math.max(0, enemyHp - 1);
      audio.playCorrect();
    } else {
      audio.playWrong();
    }
    awardAndNotify({ xp: ok ? 40 : 15, coins: ok ? 25 : 8, codexId: q.id });
    renderQ({
      ok,
      picked: idx,
      verdict: ok ? 'SERANGAN BAHASA TELAK!' : 'Perlu Latihan Lagi!',
      detail: `${opt.reaction} ${q.meaning}`,
      tip: `${q.pitfall} ${q.usage}`
    });
  }

  renderQ(null);
}

function finishNpcQuest(npc, rightCount, total) {
  const firstClear = !save.completedNpcs.includes(npc.id);
  if (firstClear) {
    save.completedNpcs.push(npc.id);
  }
  const bonusXp = firstClear ? 70 : 30;
  const bonusCoins = firstClear ? 45 : 20;
  awardAndNotify({ xp: bonusXp, coins: bonusCoins });
  audio.playVictory();
  renderer.spawnBurst(npc.x, npc.y, '#FFD166', 26);

  const info = CAST[npc.id];
  overlayRoot.innerHTML = `
    <div class="dialogue-backdrop">
      <div class="dialogue-box">
        <div class="dialogue-top">
          <div class="portrait-box">${renderCharacterSVG(npc.id, 'happy')}</div>
          <div>
            <div class="npc-header">
              <span class="npc-name">${info.name}</span>
              <span class="npc-role">QUEST SELESAI · Skor ${rightCount}/${total}</span>
            </div>
            <p class="dialogue-text">"${escapeHtml(npc.doneLines[0])}"</p>
          </div>
        </div>
        <div class="dialogue-footer">
          <span style="color:var(--gold); font-weight:800;">Hadiah: +${bonusXp} XP · +${bonusCoins} Koin Kopi</span>
          <button class="rpg-btn gold" id="btn-finish-npc" type="button">Lanjut Jelajah Peta</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-finish-npc')?.addEventListener('click', () => {
    audio.playClick();
    closeOverlay();
    const q = getActiveMainQuest(save);
    if (q.target) sayCiko(`Berikutnya: ${q.title}!`, 4.2);
  });
}

// ==========================================
// BOSS STAGE: PANGGUNG ORASI 30 DETIK (MIC / KETIK)
// ==========================================

function runBossStageChallenge(npc) {
  const prompt = STAGE_PROMPTS[Math.floor(Math.random() * STAGE_PROMPTS.length)];
  let tab = 'mic';
  let phase = 'ready'; // ready | recording | review
  let timeLeft = 30;
  let audioUrl = null;
  let transcript = '';
  let typed = '';
  let manualHits = [false, false];

  function renderBoss() {
    const activeText = tab === 'mic' ? transcript : typed;
    const kwStatus = detectKeywords(activeText, prompt.keywords);

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal" style="max-width:680px;">
          <div class="panel-head">
            <div>
              <div class="title-kicker">BOSS PANGGUNG PUNCAK · ORASI 30 DETIK</div>
              <h2>${escapeHtml(prompt.title)}</h2>
            </div>
            <button class="rpg-btn ghost" id="btn-boss-close" type="button" style="padding:7px 14px; font-size:0.8rem;">Tutup</button>
          </div>

          <div class="insight-box" style="margin-top:0; margin-bottom:14px;">
            <p><strong>Peranmu:</strong> ${escapeHtml(prompt.role)}</p>
            <p>${escapeHtml(prompt.factSpark)}</p>
          </div>

          <div style="font-size:0.78rem; font-weight:800; color:var(--muted); text-transform:uppercase;">
            Dua Kata Sakti Wajib Diselipkan:
          </div>
          <div class="kw-row">
            ${kwStatus
              .map((kw, idx) => {
                const hit = phase === 'review' ? manualHits[idx] : kw.matched;
                return `
                  <div class="kw-pill ${hit ? 'hit' : ''}" id="boss-kw-${idx}">
                    <strong style="color:var(--gold); text-transform:uppercase;">${escapeHtml(kw.word)}</strong>
                    <div style="font-size:0.76rem; color:var(--muted);">${escapeHtml(kw.hint)}</div>
                  </div>
                `;
              })
              .join('')}
          </div>

          <div class="codex-bar">
            <button class="filter-chip ${tab === 'mic' ? 'active' : ''}" id="boss-tab-mic" type="button">Mikrofon (Ngomong Langsung)</button>
            <button class="filter-chip ${tab === 'type' ? 'active' : ''}" id="boss-tab-type" type="button">Ketik Kilat (Mode Hening)</button>
          </div>

          ${
            tab === 'mic'
              ? renderBossMicBody()
              : `
                <textarea class="rpg-textarea" id="boss-textarea" placeholder="Tulis orasi spontanmu 2 sampai 3 kalimat dengan menyelipkan '${escapeHtml(prompt.keywords[0].word)}' dan '${escapeHtml(prompt.keywords[1].word)}'...">${escapeHtml(typed)}</textarea>
                <button class="rpg-btn primary" id="boss-submit" type="button">Sampaikan Orasi ke Amfiteater!</button>
              `
          }
          <p style="margin:12px 0 0; font-size:0.82rem; color:var(--muted);">Tips Maestro: ${escapeHtml(prompt.sampleAngle)}</p>
        </div>
      </div>
    `;

    document.getElementById('btn-boss-close')?.addEventListener('click', closeOverlay);
    document.getElementById('boss-tab-mic')?.addEventListener('click', () => {
      if (mic.isRecording) return;
      tab = 'mic';
      renderBoss();
    });
    document.getElementById('boss-tab-type')?.addEventListener('click', () => {
      if (mic.isRecording) stopBossMic();
      tab = 'type';
      renderBoss();
    });

    if (tab === 'mic') {
      document.getElementById('boss-mic-start')?.addEventListener('click', startBossMic);
      document.getElementById('boss-mic-stop')?.addEventListener('click', stopBossMic);
      document.getElementById('boss-submit')?.addEventListener('click', finishBossStage);
      prompt.keywords.forEach((_, idx) => {
        document.getElementById(`boss-chk-${idx}`)?.addEventListener('change', (e) => {
          manualHits[idx] = e.target.checked;
          document.getElementById(`boss-kw-${idx}`)?.classList.toggle('hit', e.target.checked);
        });
      });
    } else {
      const ta = document.getElementById('boss-textarea');
      const sync = (e) => {
        typed = e.target.value;
        const checked = detectKeywords(typed, prompt.keywords);
        checked.forEach((kw, idx) => {
          document.getElementById(`boss-kw-${idx}`)?.classList.toggle('hit', kw.matched);
        });
      };
      ta?.addEventListener('input', sync);
      ta?.addEventListener('change', sync);
      document.getElementById('boss-submit')?.addEventListener('click', finishBossStage);
    }
  }

  function renderBossMicBody() {
    if (phase === 'ready') {
      return `
        <div style="text-align:center; padding:16px; border-radius:14px; background:rgba(255,255,255,0.04);">
          <div style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:var(--gold);">${timeLeft} dtk</div>
          <p style="font-size:0.86rem; color:var(--muted); margin:4px 0 14px;">Rekaman hanya disimpan lokal di browser supaya kamu bisa mendengarkan ulang intonasimu sendiri.</p>
          <button class="rpg-btn primary" id="boss-mic-start" type="button">Nyalakan Mikrofon & Mulai Orasi</button>
        </div>
      `;
    }
    if (phase === 'recording') {
      return `
        <div style="text-align:center; padding:16px; border-radius:14px; background:rgba(255,255,255,0.04);">
          <div id="boss-timer" style="font-family:var(--font-display); font-size:2rem; font-weight:800; color:var(--gold);">${timeLeft} dtk</div>
          <canvas class="wave-canvas" id="boss-wave" width="420" height="64"></canvas>
          <button class="rpg-btn primary" id="boss-mic-stop" type="button">Selesai Bicara</button>
          <div id="boss-transcript" style="margin-top:10px; font-size:0.86rem; color:var(--paper);">${escapeHtml(transcript || 'Mikrofon menyala... langsung bicara dengan percaya diri!')}</div>
        </div>
      `;
    }
    return `
      <div style="text-align:center; padding:16px; border-radius:14px; background:rgba(255,255,255,0.04);">
        <p style="margin:0 0 8px; color:var(--gold); font-weight:800;">Orasi Selesai! Putar ulang suaramu di bawah:</p>
        ${audioUrl ? `<audio controls src="${audioUrl}" style="width:100%; max-width:400px;"></audio>` : ''}
        <div style="display:flex; justify-content:center; gap:10px; margin:12px 0;">
          ${prompt.keywords
            .map(
              (kw, idx) => `
            <label class="filter-chip active" style="cursor:pointer;">
              <input type="checkbox" id="boss-chk-${idx}" ${manualHits[idx] ? 'checked' : ''} /> ${escapeHtml(kw.word)}
            </label>
          `
            )
            .join('')}
        </div>
        <button class="rpg-btn gold" id="boss-submit" type="button">Klaim Gelar Archon Lidah Emas!</button>
      </div>
    `;
  }

  async function startBossMic() {
    audio.playMicCue(true);
    phase = 'recording';
    timeLeft = 30;
    transcript = '';
    renderBoss();
    const canvas = document.getElementById('boss-wave');
    const ok = await mic.start({
      canvas,
      onTranscript: (text) => {
        transcript = text;
        const box = document.getElementById('boss-transcript');
        if (box) box.textContent = text || 'Mendengarkan...';
        const checked = detectKeywords(text, prompt.keywords);
        checked.forEach((kw, idx) => {
          document.getElementById(`boss-kw-${idx}`)?.classList.toggle('hit', kw.matched);
        });
      },
      onError: (msg) => {
        showToast(msg);
        tab = 'type';
        phase = 'ready';
        renderBoss();
      }
    });

    if (ok) {
      stageTimerId = setInterval(() => {
        timeLeft = Math.max(0, timeLeft - 1);
        const el = document.getElementById('boss-timer');
        if (el) el.textContent = `${timeLeft} dtk`;
        if (timeLeft <= 0) stopBossMic();
      }, 1000);
    }
  }

  async function stopBossMic() {
    if (stageTimerId) {
      clearInterval(stageTimerId);
      stageTimerId = null;
    }
    audio.playMicCue(false);
    const res = await mic.stop();
    audioUrl = res.audioUrl;
    transcript = res.transcript;
    manualHits = detectKeywords(transcript, prompt.keywords).map((d) => d.matched);
    phase = 'review';
    renderBoss();
  }

  function finishBossStage() {
    let hits = 0;
    if (tab === 'mic') {
      hits = manualHits.filter(Boolean).length;
    } else {
      if (typed.trim().length < 20) {
        showToast('Tulis minimal 1 sampai 2 kalimat orasi dulu ya!');
        return;
      }
      hits = detectKeywords(typed, prompt.keywords).filter((d) => d.matched).length;
    }

    if (!save.completedNpcs.includes(npc.id)) save.completedNpcs.push(npc.id);
    save.stageCompletions += 1;
    const xpGain = 120 + hits * 50;
    const coinGain = 80 + hits * 35;
    awardAndNotify({ xp: xpGain, coins: coinGain });
    audio.playVictory();
    renderer.spawnBurst(npc.x, npc.y, '#FFD166', 44);
    closeOverlay();
    showZoneBanner('ARCHON LIDAH EMAS!', `Orasi Panggung Sukses (+${xpGain} XP)`);
    sayCiko('Penonton Amfiteater berdiri tepuk tangan semua!', 5);
    openProfileModal();
  }

  renderBoss();
}

// ==========================================
// WORLD MAP + FAST TRAVEL, CODEX & PROFILE CARD
// ==========================================

function openWorldMapModal() {
  modalOpen = true;
  audio.playClick();

  const cards = ZONES.map((z) => {
    const unlocked = z.id === 1 || save.solvedGates.includes(`gate-${z.id - 1}`);
    const wp = WAYPOINTS.find((w) => w.zone === z.id);
    const wpUnlocked = wp && save.unlockedWaypoints.includes(wp.id);
    const zoneNpcs = NPCS.filter((n) => n.zone === z.id);
    const doneNpcs = zoneNpcs.filter((n) => save.completedNpcs.includes(n.id)).length;
    const zoneChests = CHESTS.filter((c) => c.zone === z.id);
    const doneChests = zoneChests.filter((c) => save.openedChests.includes(c.id)).length;

    return `
      <div class="zone-card ${unlocked ? 'unlocked' : ''}">
        <div class="title-kicker" style="margin-bottom:4px;">${unlocked ? 'TERBUKA' : `TERKUNCI SEGEL MATEMATIKA LV.${z.id}`}</div>
        <h3>${z.name}</h3>
        <p>${z.subtitle}<br/>Quest Warga: ${doneNpcs}/${zoneNpcs.length} · Peti Harta: ${doneChests}/${zoneChests.length}</p>
        ${
          wpUnlocked
            ? `<button class="rpg-btn gold" data-tp-wp="${wp.id}" type="button" style="padding:8px 14px; font-size:0.82rem;">Teleportasi ke ${escapeHtml(wp.name.replace('Waypoint ', ''))}</button>`
            : `<span style="font-size:0.78rem; color:var(--muted);">${unlocked ? 'Jalan ke kristal biru di wilayah ini untuk mengaktifkan Teleportasi.' : `Pecahkan Segel Matematika #${z.id - 1} di jembatan dulu!`}</span>`
        }
      </div>
    `;
  }).join('');

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal">
        <div class="panel-head">
          <div>
            <div class="title-kicker">PETA DUNIA & WAYPOINT TELEPORTASI</div>
            <h2>Dunia Warkop Impact</h2>
          </div>
          <button class="rpg-btn ghost" id="btn-close-map" type="button" style="padding:8px 14px;">Tutup [Esc]</button>
        </div>
        <div class="zone-map-grid">${cards}</div>
        <p style="margin:0; font-size:0.84rem; color:var(--muted);">
          Progres Segel Matematika: ${save.solvedGates.length}/3 gerbang terbuka · Total soal matematika dipecahkan: ${save.mathSolvedCount}.
        </p>
      </div>
    </div>
  `;

  document.getElementById('btn-close-map')?.addEventListener('click', closeOverlay);
  document.querySelectorAll('[data-tp-wp]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wp = WAYPOINTS.find((w) => w.id === btn.dataset.tpWp);
      if (!wp) return;
      player.x = wp.x;
      player.y = wp.y + 32;
      player.walkTarget = null;
      ciko.x = player.x - 28;
      ciko.y = player.y - 22;
      save.x = player.x;
      save.y = player.y;
      persistSave(save);
      audio.playWaypoint();
      renderer.spawnBurst(player.x, player.y, '#48DBFB', 28);
      closeOverlay();
      showToast(`Teleportasi ke ${wp.name}!`);
    });
  });
}

function getAllCodexEntries() {
  return [
    ...DICTION_BANK.map((d) => ({
      id: d.id,
      group: 'diction',
      groupLabel: 'Diksi Keren',
      title: d.term,
      summary: d.meaning,
      detail: d.pitfall,
      example: d.usage
    })),
    ...FALLACIES_BANK.map((fl) => ({
      id: fl.id,
      group: 'fallacy',
      groupLabel: 'Sesat Pikir',
      title: fl.fallacyName,
      summary: fl.meaning,
      detail: fl.pitfall,
      example: fl.usage
    })),
    ...FACTS_BANK.map((f) => ({
      id: f.id,
      group: 'fact',
      groupLabel: `Fakta · ${f.category}`,
      title: f.isFact ? 'Fakta Gacor' : 'Mitos Terbongkar',
      summary: f.statement,
      detail: f.punchline,
      example: f.hook
    }))
  ];
}

function findCodexEntryById(id) {
  return getAllCodexEntries().find((e) => e.id === id);
}

function openCodexModal() {
  modalOpen = true;
  audio.playClick();
  let filter = 'all';
  let query = '';
  let revealAll = false;

  function renderCodex() {
    const all = getAllCodexEntries();
    const q = query.trim().toLowerCase();
    const list = all.filter((item) => {
      if (filter !== 'all' && item.group !== filter) return false;
      if (!q) return true;
      return `${item.title} ${item.summary} ${item.detail} ${item.example}`.toLowerCase().includes(q);
    });

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal">
          <div class="panel-head">
            <div>
              <div class="title-kicker">TAS WAWASAN & KOSAKATA</div>
              <h2>Codex Warkop (${save.codexIds.length}/${TOTAL_CODEX})</h2>
            </div>
            <button class="rpg-btn ghost" id="btn-close-codex" type="button" style="padding:8px 14px;">Tutup</button>
          </div>

          <div class="codex-bar">
            ${[
              ['all', 'Semua'],
              ['fact', 'Fakta Gacor'],
              ['diction', 'Diksi Keren'],
              ['fallacy', 'Sesat Pikir']
            ]
              .map(
                ([k, lbl]) =>
                  `<button class="filter-chip ${filter === k ? 'active' : ''}" data-cf="${k}" type="button">${lbl}</button>`
              )
              .join('')}
            <button class="filter-chip ${revealAll ? 'active' : ''}" id="btn-codex-reveal" type="button">
              ${revealAll ? 'Mode Belajar: Aktif' : 'Buka Semua (Mode Belajar)'}
            </button>
            <input class="rpg-input" id="codex-search" type="search" placeholder="Cari istilah atau fakta..." value="${escapeHtml(query)}" style="max-width:220px; padding:7px 12px; font-size:0.84rem;" />
          </div>

          <div class="codex-list">
            ${list
              .map((item) => {
                const open = revealAll || save.codexIds.includes(item.id);
                if (!open) {
                  return `
                    <div class="codex-item locked">
                      <div class="title-kicker" style="margin-bottom:2px;">${escapeHtml(item.groupLabel)}</div>
                      <h4>Terkunci</h4>
                      <p>Jelajahi peta, bicara dengan NPC, atau buka peti harta untuk membuka kartu ini.</p>
                    </div>
                  `;
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

    document.getElementById('btn-close-codex')?.addEventListener('click', closeOverlay);
    document.querySelectorAll('[data-cf]').forEach((b) => {
      b.addEventListener('click', () => {
        filter = b.dataset.cf;
        renderCodex();
      });
    });
    document.getElementById('btn-codex-reveal')?.addEventListener('click', () => {
      revealAll = !revealAll;
      renderCodex();
    });
    const inp = document.getElementById('codex-search');
    inp?.addEventListener('input', (e) => {
      query = e.target.value;
      renderCodex();
      const next = document.getElementById('codex-search');
      if (next) {
        next.focus();
        next.setSelectionRange(query.length, query.length);
      }
    });
  }

  renderCodex();
}

function openProfileModal() {
  modalOpen = true;
  audio.playClick();
  const titleRank = save.completedNpcs.includes('maestro')
    ? 'Archon Lidah Emas'
    : save.solvedGates.length >= 2
    ? 'Ksatria Logika'
    : save.solvedGates.length >= 1
    ? 'Pujangga Kota Bahasa'
    : 'Petualang Desa Warkop';

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="altar-card" style="max-width:520px;">
        <div class="panel-head" style="margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div class="portrait-box" style="width:68px; height:68px;">${renderCharacterSVG('hero', 'happy')}</div>
            <div>
              <div class="title-kicker">KARTU PETUALANG · LV ${save.level}</div>
              <h2 style="margin:0; font-size:1.45rem;">${escapeHtml(save.playerName)}</h2>
              <div style="font-size:0.84rem; color:var(--gold); font-weight:700;">Gelar: ${titleRank}</div>
            </div>
          </div>
          <button class="rpg-btn ghost" id="btn-close-prof" type="button" style="padding:7px 12px;">Tutup</button>
        </div>

        <div class="zone-map-grid" style="margin-bottom:16px;">
          <div class="zone-card unlocked"><h3>${save.solvedGates.length + 1}/4</h3><p>Wilayah Terbuka</p></div>
          <div class="zone-card unlocked"><h3>${save.mathSolvedCount}</h3><p>Rune Matematika Pecah</p></div>
          <div class="zone-card unlocked"><h3>${save.codexIds.length}/${TOTAL_CODEX}</h3><p>Codex Wawasan & Diksi</p></div>
          <div class="zone-card unlocked"><h3>${save.openedChests.length}/${CHESTS.length}</h3><p>Peti Harta Dibuka</p></div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between;">
          <button class="rpg-btn gold" id="btn-share-profile" type="button">Salin Kartu Petualang</button>
          <button class="rpg-btn ghost" id="btn-reset-from-prof" type="button">Reset Petualangan</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-prof')?.addEventListener('click', closeOverlay);
  document.getElementById('btn-share-profile')?.addEventListener('click', async () => {
    const shareText = [
      `WARKOP IMPACT | Kartu Petualang`,
      `${save.playerName} (LV ${save.level} · ${titleRank})`,
      `Wilayah: ${save.solvedGates.length + 1}/4 | Segel MTK: ${save.mathSolvedCount} | Codex: ${save.codexIds.length}/${TOTAL_CODEX} | Peti: ${save.openedChests.length}/${CHESTS.length}`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Kartu Petualang disalin! Siap pamer ke teman.');
    } catch {
      showToast('Gagal menyalin otomatis. Screenshot kartu ini saja!');
    }
  });
  document.getElementById('btn-reset-from-prof')?.addEventListener('click', () => {
    save = resetSave(save.playerName);
    player.x = save.x;
    player.y = save.y;
    player.walkTarget = null;
    closeOverlay();
    showToast('Petualangan dimulai ulang dari Desa Warkop Lv. 1!');
  });
}

// ==========================================
// INPUT HANDLING (KEYBOARD, CLICK-TO-MOVE, TOUCH)
// ==========================================

window.addEventListener('keydown', (e) => {
  const tag = e.target?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  const k = e.key.toLowerCase();
  if (k === 'escape' && modalOpen) {
    closeOverlay();
    return;
  }
  if (!titleOverlay.classList.contains('hidden')) return;

  if (modalOpen) return;

  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) {
    keys.add(k);
    player.walkTarget = null;
    player.autoInteractAfterWalk = null;
  } else if (k === 'e' || k === ' ' || k === 'enter') {
    e.preventDefault();
    triggerNearestInteraction();
  } else if (k === 'm') {
    openWorldMapModal();
  } else if (k === 'c') {
    openCodexModal();
  }
});

window.addEventListener('keyup', (e) => {
  keys.delete(e.key.toLowerCase());
});

worldCanvas.addEventListener('pointerdown', (e) => {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  const rect = worldCanvas.getBoundingClientRect();
  const pos = renderer.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
  player.walkTarget = pos;
  player.autoInteractAfterWalk = true;
  renderer.setClickTarget(pos.x, pos.y);
  audio.playClick();
});

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

const btnTouchSprint = document.getElementById('btn-touch-sprint');
btnTouchSprint?.addEventListener('pointerdown', () => (touchSprint = true));
btnTouchSprint?.addEventListener('pointerup', () => (touchSprint = false));
btnTouchSprint?.addEventListener('pointerleave', () => (touchSprint = false));
document.getElementById('btn-touch-act')?.addEventListener('click', triggerNearestInteraction);

// HUD Buttons
btnInteract.addEventListener('click', triggerNearestInteraction);
document.getElementById('btn-open-map')?.addEventListener('click', openWorldMapModal);
document.getElementById('btn-open-codex')?.addEventListener('click', openCodexModal);
document.getElementById('btn-open-profile')?.addEventListener('click', openProfileModal);
document.getElementById('btn-quest-tracker')?.addEventListener('click', () => {
  const q = getActiveMainQuest(save);
  showToast(q.hint);
  if (q.target) {
    sayCiko(`Ikuti panah emas ke ${q.target.label}!`, 3.5);
  }
});
btnToggleSound.addEventListener('click', () => {
  save.muted = !save.muted;
  audio.setMuted(save.muted);
  persistSave(save);
  refreshHud();
  if (!save.muted) audio.playClick();
});

// Title Overlay Boot
const nameInput = document.getElementById('input-player-name');
const btnStart = document.getElementById('btn-start-adventure');
const btnReset = document.getElementById('btn-reset-adventure');

if (save.started) {
  nameInput.value = save.playerName || 'Petualang';
  btnStart.textContent = `Lanjutkan Petualangan (Lv. ${save.level})`;
  btnReset.classList.remove('hidden');
}

btnStart.addEventListener('click', () => {
  save.playerName = (nameInput.value || 'Petualang').trim().slice(0, 16) || 'Petualang';
  save.started = true;
  persistSave(save);
  titleOverlay.classList.add('hidden');
  hudLayer.classList.remove('hidden');
  audio.playWaypoint();
  refreshHud();
  const z = getZoneAt(player.x, player.y);
  showZoneBanner(z.subtitle, z.name);
  sayCiko(`Halo ${save.playerName}! Ayo temui Bang Jaja!`, 4.8);
});

btnReset.addEventListener('click', () => {
  const nm = (nameInput.value || 'Petualang').trim().slice(0, 16) || 'Petualang';
  save = resetSave(nm);
  player.x = save.x;
  player.y = save.y;
  titleOverlay.classList.add('hidden');
  hudLayer.classList.remove('hidden');
  audio.playWaypoint();
  refreshHud();
  showZoneBanner('PETUALANGAN BARU', 'Desa Warkop');
  sayCiko('Mulai segar dari Level 1! Ayo ke gerobak Bang Jaja!', 4.5);
});

// ==========================================
// MAIN 60FPS GAME LOOP
// ==========================================

let lastTs = performance.now();

function tick(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;
  const nowSec = ts / 1000;

  updateWorld(dt);

  const activeQuest = getActiveMainQuest(save);
  renderer.update(dt, player);
  renderer.render(nowSec, {
    player,
    ciko,
    save,
    activeQuest,
    nearestInteract
  });

  requestAnimationFrame(tick);
}

function updateWorld(dt) {
  if (ciko.bubbleTimer > 0) ciko.bubbleTimer -= dt;
  if (gateBumpCooldown > 0) gateBumpCooldown -= dt;

  const canMove = !modalOpen && titleOverlay.classList.contains('hidden');
  let vx = 0;
  let vy = 0;

  if (canMove) {
    if (keys.has('w') || keys.has('arrowup') || touchDirs.has('up')) vy -= 1;
    if (keys.has('s') || keys.has('arrowdown') || touchDirs.has('down')) vy += 1;
    if (keys.has('a') || keys.has('arrowleft') || touchDirs.has('left')) vx -= 1;
    if (keys.has('d') || keys.has('arrowright') || touchDirs.has('right')) vx += 1;

    if (vx === 0 && vy === 0 && player.walkTarget) {
      const dx = player.walkTarget.x - player.x;
      const dy = player.walkTarget.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        vx = dx / dist;
        vy = dy / dist;
      } else {
        player.walkTarget = null;
        if (player.autoInteractAfterWalk && nearestInteract) {
          player.autoInteractAfterWalk = null;
          triggerNearestInteraction();
        }
      }
    }
  }

  const mag = Math.hypot(vx, vy);
  player.moving = mag > 0.01;
  player.sprinting = keys.has('shift') || touchSprint;

  if (player.moving) {
    const nx = vx / mag;
    const ny = vy / mag;
    if (Math.abs(nx) > Math.abs(ny)) {
      player.facing = nx > 0 ? 'right' : 'left';
    } else {
      player.facing = ny > 0 ? 'down' : 'up';
    }

    const speed = player.sprinting ? 290 : 195;
    const nextX = player.x + nx * speed * dt;
    const nextY = player.y + ny * speed * dt;

    // Sliding axis-separated collision
    const checkX = isPointBlocked(nextX, player.y, player.radius, save.solvedGates);
    if (!checkX.blocked) {
      player.x = nextX;
    } else if (checkX.reason === 'gate' && gateBumpCooldown <= 0) {
      gateBumpCooldown = 2.5;
      audio.playWrong();
      renderer.triggerShake(5);
      sayCiko(`Terkunci! Pecahkan Segel Matematika Lv.${checkX.gate.targetZone} dulu!`, 3.6);
      player.walkTarget = null;
    }

    const checkY = isPointBlocked(player.x, nextY, player.radius, save.solvedGates);
    if (!checkY.blocked) {
      player.y = nextY;
    } else if (checkY.reason === 'gate' && gateBumpCooldown <= 0) {
      gateBumpCooldown = 2.5;
      audio.playWrong();
      renderer.triggerShake(5);
      sayCiko(`Terkunci! Pecahkan Segel Matematika Lv.${checkY.gate.targetZone} dulu!`, 3.6);
      player.walkTarget = null;
    }

    audio.playFootstep(player.sprinting);

    dustCooldown -= dt;
    if (dustCooldown <= 0) {
      renderer.spawnDust(player.x, player.y);
      dustCooldown = player.sprinting ? 0.1 : 0.18;
    }

    // Check zone crossing banner!
    const zNow = getZoneAt(player.x, player.y);
    if (zNow.id !== currentZoneId) {
      currentZoneId = zNow.id;
      showZoneBanner(zNow.subtitle, zNow.name);
      audio.playDialogueOpen();
      sayCiko(`Selamat datang di ${zNow.name}!`, 4);
    }

    // Periodic save
    saveCooldown -= dt;
    if (saveCooldown <= 0) {
      save.x = Math.round(player.x);
      save.y = Math.round(player.y);
      save.facing = player.facing;
      persistSave(save);
      saveCooldown = 1.2;
    }
  }

  // Smooth Ciko companion follow
  const offsetX = player.facing === 'right' ? -30 : 30;
  const targetCikoX = player.x + offsetX;
  const targetCikoY = player.y - 18;
  ciko.x += (targetCikoX - ciko.x) * Math.min(1, dt * 5);
  ciko.y += (targetCikoY - ciko.y) * Math.min(1, dt * 5);

  // Proximity interact prompt + HUD distance update
  if (canMove) {
    nearestInteract = findNearestInteractable();
    if (nearestInteract) {
      interactLabel.textContent = nearestInteract.label;
      btnInteract.classList.remove('hidden');
    } else {
      btnInteract.classList.add('hidden');
    }
    refreshHud();
  } else {
    btnInteract.classList.add('hidden');
  }
}

refreshHud();
requestAnimationFrame(tick);
