// Mesin Puzzle Match-3 ala Gardenscapes:
// - Sprite 3D glossy realistis (assets/tiles/*.png)
// - Animasi geser nyata, pantul halus saat gagal, letupan, dan gravitasi jatuh lembut
// - Power-Up baru menunggu kendali pemain (klik langsung atau tukar), tanpa ledakan liar otomatis
// - Papan tumbuh bertahap (5x5 di Level 1 -> 8x8 di level tinggi)
// - Micro-Quest muncul pada Segel Ilmu, Booster gratis, +5 Langkah, atau isi nyawa

import { TILE_TYPES, POWER_IMAGES, getLevelConfig, buildMicroQuest } from './puzzle_levels.js';
import { speakPhrase } from './academy_ui.js';
import { audio } from './audio.js';
import { persistGardenSave } from './garden_storage.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TILE_IMG_MAP = Object.fromEntries(TILE_TYPES.map((t) => [t.id, t.img]));

function renderTileArt(tileId, power) {
  if (power === 'rainbow') {
    return `<img class="tile-img power-img power-rainbow" src="${POWER_IMAGES.rainbow}" alt="Bola Pelangi" draggable="false" />`;
  }
  if (power === 'bomb') {
    return `<img class="tile-img power-img power-bomb" src="${POWER_IMAGES.bomb}" alt="Bom 3x3" draggable="false" />`;
  }
  if (power === 'rocket_h') {
    return `<img class="tile-img power-img power-rocket-h" src="${POWER_IMAGES.rocket_h}" alt="Roket Mendatar" draggable="false" />`;
  }
  if (power === 'rocket_v') {
    return `<img class="tile-img power-img power-rocket-v" src="${POWER_IMAGES.rocket_v}" alt="Roket Tegak" draggable="false" />`;
  }
  const src = TILE_IMG_MAP[tileId];
  if (!src) return '';
  return `<img class="tile-img" src="${src}" alt="${escapeHtml(tileId)}" draggable="false" />`;
}

function renderGoalIcon(goal) {
  if (goal.kind === 'tile') {
    const src = TILE_IMG_MAP[goal.id];
    return src ? `<img class="goal-img" src="${src}" alt="${escapeHtml(goal.label)}" draggable="false" />` : '';
  }
  if (goal.id === 'crate') {
    return `<svg viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="4" fill="#9C6B43" stroke="#5A391E" stroke-width="2"/><path d="M5 5 L23 23 M23 5 L5 23" stroke="#6E4726" stroke-width="2"/></svg>`;
  }
  if (goal.id === 'ice') {
    return `<svg viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="5" fill="#7FD1E8" fill-opacity="0.72" stroke="#D8F6FF" stroke-width="2"/><path d="M7 9 L13 7 L9 14 Z" fill="#FFFFFF" opacity="0.8"/></svg>`;
  }
  if (goal.id === 'chain') {
    return `<svg viewBox="0 0 28 28"><rect x="4" y="9" width="12" height="10" rx="5" fill="none" stroke="#CBD5E1" stroke-width="2.6"/><rect x="12" y="9" width="12" height="10" rx="5" fill="none" stroke="#94A3B8" stroke-width="2.6"/></svg>`;
  }
  if (goal.id === 'moss') {
    return `<svg viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="6" fill="#439457" stroke="#8AD99B" stroke-width="1.8"/><circle cx="10" cy="11" r="2.2" fill="#9EE8AC"/><circle cx="18" cy="16" r="2.6" fill="#9EE8AC"/></svg>`;
  }
  return `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="10.5" fill="#D9B466" stroke="#7A5A1A" stroke-width="1.8"/><path d="M14 7.5 L15.9 11.7 L20.4 12.2 L17 15.2 L18 19.6 L14 17.3 L10 19.6 L11 15.2 L7.6 12.2 L12.1 11.7 Z" fill="#FFF7D6"/></svg>`;
}

export function launchGardenPuzzle({ overlayRoot, save, onWin, onLose, onClose }) {
  const cfg = getLevelConfig(save.level || 1);
  const { rows, cols, activeTiles } = cfg;

  let grid = [];
  let goals = cfg.goals.map((g) => ({ ...g, left: g.count }));
  let movesLeft = cfg.moves;
  let score = 0;
  let busy = false;
  let selected = null;
  let activeBooster = null;
  let activeQuest = null;
  let rescueUsed = false;
  let freeBoosterQuestUsed = false;
  let statusMsg = cfg.tip;
  let finished = false;
  let destroyed = false;

  const poppingCells = new Set();
  const blastFlashCells = new Set();
  const hintCells = new Set();
  let preferredSpawnCell = null;
  let hintTimer = null;

  function randomTile() {
    return activeTiles[Math.floor(Math.random() * activeTiles.length)];
  }

  function makeCell(r, c) {
    return {
      r,
      c,
      active: Boolean(cfg.mask[r][c]),
      tile: null,
      power: null,
      crate: 0,
      ice: 0,
      chain: false,
      moss: false,
      seal: false,
      fallRows: 0,
      justSpawned: false
    };
  }

  function cellCanHoldTile(cell) {
    return cell && cell.active && cell.crate === 0;
  }

  function cellCanMoveOrFall(cell) {
    return cell && cell.active && cell.crate === 0 && !cell.chain;
  }

  function canSwapCell(cell) {
    return cell && cell.active && cell.crate === 0 && !cell.chain && (cell.tile !== null || cell.power !== null);
  }

  function isAdjacent(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  }

  function clearFallOffsets() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid[r][c].fallRows = 0;
      }
    }
  }

  function clearProtectedFlags() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid[r][c].justSpawned = false;
      }
    }
  }

  function initBoard() {
    grid = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => makeCell(r, c)));

    cfg.obstacles.crates.forEach(({ r, c, hp }) => {
      if (grid[r]?.[c]?.active) grid[r][c].crate = hp;
    });
    cfg.obstacles.ice.forEach(({ r, c, hp }) => {
      if (grid[r]?.[c]?.active && grid[r][c].crate === 0) grid[r][c].ice = hp;
    });
    cfg.obstacles.chains.forEach(({ r, c }) => {
      if (grid[r]?.[c]?.active && grid[r][c].crate === 0) grid[r][c].chain = true;
    });
    cfg.obstacles.moss.forEach(({ r, c }) => {
      if (grid[r]?.[c]?.active) grid[r][c].moss = true;
    });
    cfg.obstacles.seals.forEach(({ r, c }) => {
      if (grid[r]?.[c]?.active && grid[r][c].crate === 0) grid[r][c].seal = true;
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (!cellCanHoldTile(cell)) continue;
        let pick = randomTile();
        let guard = 0;
        while (guard < 25) {
          const left2 = c >= 2 && grid[r][c - 1].tile === pick && grid[r][c - 2].tile === pick;
          const up2 = r >= 2 && grid[r - 1][c].tile === pick && grid[r - 2][c].tile === pick;
          if (!left2 && !up2) break;
          pick = randomTile();
          guard++;
        }
        cell.tile = pick;
      }
    }

    if (!findFirstValidMove()) shuffleBoard(false);
  }

  function findMatches() {
    const groups = [];
    const seenH = new Set();
    const seenV = new Set();

    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols) {
        const cell = grid[r][c];
        if (!cellCanHoldTile(cell) || !cell.tile || cell.power === 'rainbow') {
          c++;
          continue;
        }
        let end = c;
        while (
          end + 1 < cols &&
          cellCanHoldTile(grid[r][end + 1]) &&
          grid[r][end + 1].tile === cell.tile &&
          grid[r][end + 1].power !== 'rainbow'
        ) {
          end++;
        }
        const len = end - c + 1;
        if (len >= 3) {
          const cells = [];
          for (let k = c; k <= end; k++) {
            cells.push(grid[r][k]);
            seenH.add(`${r},${k}`);
          }
          groups.push({ dir: 'h', tile: cell.tile, cells });
        }
        c = end + 1;
      }
    }

    for (let c = 0; c < cols; c++) {
      let r = 0;
      while (r < rows) {
        const cell = grid[r][c];
        if (!cellCanHoldTile(cell) || !cell.tile || cell.power === 'rainbow') {
          r++;
          continue;
        }
        let end = r;
        while (
          end + 1 < rows &&
          cellCanHoldTile(grid[end + 1][c]) &&
          grid[end + 1][c].tile === cell.tile &&
          grid[end + 1][c].power !== 'rainbow'
        ) {
          end++;
        }
        const len = end - r + 1;
        if (len >= 3) {
          const cells = [];
          for (let k = r; k <= end; k++) {
            cells.push(grid[k][c]);
            seenV.add(`${k},${c}`);
          }
          groups.push({ dir: 'v', tile: cell.tile, cells });
        }
        r = end + 1;
      }
    }

    const intersections = new Set();
    for (const k of seenH) {
      if (seenV.has(k)) intersections.add(k);
    }

    return { groups, intersections };
  }

  function findFirstValidMove() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = grid[r][c];
        if (!canSwapCell(a)) continue;
        if (a.power) return [a, a];
        for (const [dr, dc] of [
          [0, 1],
          [1, 0]
        ]) {
          const b = grid[r + dr]?.[c + dc];
          if (!canSwapCell(b)) continue;
          if (b.power) return [a, b];
          const tmpT = a.tile;
          a.tile = b.tile;
          b.tile = tmpT;
          const ok = findMatches().groups.length > 0;
          b.tile = a.tile;
          a.tile = tmpT;
          if (ok) return [a, b];
        }
      }
    }
    return null;
  }

  function shuffleBoard(notify = true) {
    const bag = [];
    const slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (cellCanHoldTile(cell) && !cell.power && cell.tile && !cell.chain) {
          bag.push(cell.tile);
          slots.push(cell);
        }
      }
    }
    for (let attempt = 0; attempt < 24; attempt++) {
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      slots.forEach((cell, i) => {
        cell.tile = bag[i];
      });
      if (findMatches().groups.length === 0 && findFirstValidMove()) break;
    }
    if (notify) {
      statusMsg = 'Papan diacak ulang.';
      audio.playSwap();
    }
  }

  function decrementGoal(kind, id, amount = 1) {
    for (const g of goals) {
      if (g.kind === kind && g.id === id && g.left > 0) {
        g.left = Math.max(0, g.left - amount);
      }
    }
  }

  function allGoalsCleared() {
    return goals.every((g) => g.left <= 0);
  }

  function hitCrate(cell) {
    if (!cell || cell.crate <= 0) return;
    cell.crate -= 1;
    blastFlashCells.add(`${cell.r},${cell.c}`);
    if (cell.crate === 0) {
      decrementGoal('obstacle', 'crate', 1);
      score += 40;
    } else {
      score += 15;
    }
  }

  function damageCell(cell, triggeredPowers, isBlast = false) {
    if (!cell || !cell.active) return;

    if (cell.crate > 0) {
      if (isBlast) hitCrate(cell);
      return;
    }

    if (cell.chain) {
      cell.chain = false;
      decrementGoal('obstacle', 'chain', 1);
      blastFlashCells.add(`${cell.r},${cell.c}`);
      score += 35;
      if (!isBlast) return;
    }

    if (cell.ice > 0) {
      cell.ice -= 1;
      blastFlashCells.add(`${cell.r},${cell.c}`);
      if (cell.ice === 0) {
        decrementGoal('obstacle', 'ice', 1);
        score += 30;
      }
    }

    if (cell.moss) {
      cell.moss = false;
      decrementGoal('obstacle', 'moss', 1);
      score += 25;
    }

    // Power-Up yang baru dibuat di giliran ini dilindungi agar tidak meledak sendiri!
    if (cell.power) {
      if (cell.justSpawned) return;
      triggeredPowers.push({ r: cell.r, c: cell.c, power: cell.power, tile: cell.tile });
      cell.power = null;
      cell.tile = null;
      return;
    }

    if (cell.tile) {
      decrementGoal('tile', cell.tile, 1);
      cell.tile = null;
      score += 12;
      blastFlashCells.add(`${cell.r},${cell.c}`);
    }
  }

  function hitAdjacentCrates(r, c) {
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ]) {
      const nb = grid[r + dr]?.[c + dc];
      if (nb && nb.crate > 0) hitCrate(nb);
    }
  }

  function detonatePower(p, triggeredPowers) {
    audio.playBlast();
    const { r, c, power } = p;
    if (power === 'rocket_h') {
      for (let cc = 0; cc < cols; cc++) {
        damageCell(grid[r][cc], triggeredPowers, true);
      }
    } else if (power === 'rocket_v') {
      for (let rr = 0; rr < rows; rr++) {
        damageCell(grid[rr][c], triggeredPowers, true);
      }
    } else if (power === 'bomb') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (grid[r + dr]?.[c + dc]) damageCell(grid[r + dr][c + dc], triggeredPowers, true);
        }
      }
    } else if (power === 'rainbow') {
      const targetTile = p.targetTile || activeTiles[Math.floor(Math.random() * activeTiles.length)];
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          if (grid[rr][cc].tile === targetTile) {
            damageCell(grid[rr][cc], triggeredPowers, true);
          }
        }
      }
    }
  }

  function detonateQueue(initialQueue) {
    const queue = [...initialQueue];
    const visited = new Set();
    let guard = 0;
    while (queue.length > 0 && guard < 36) {
      guard++;
      const p = queue.shift();
      const key = `${p.r},${p.c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      detonatePower(p, queue);
    }
  }

  // Pilih buah baru dengan penekan kaskade liar agar papan tetap mengikuti kendali pemain
  function pickRefillTile(r, c) {
    if (Math.random() < 0.82) {
      const forbidden = new Set();
      if (c >= 2 && grid[r][c - 1]?.tile && grid[r][c - 1].tile === grid[r][c - 2]?.tile) {
        forbidden.add(grid[r][c - 1].tile);
      }
      if (r + 2 < rows && grid[r + 1]?.[c]?.tile && grid[r + 1][c].tile === grid[r + 2]?.[c]?.tile) {
        forbidden.add(grid[r + 1][c].tile);
      }
      if (c >= 1 && c + 1 < cols && grid[r][c - 1]?.tile && grid[r][c - 1].tile === grid[r][c + 1]?.tile) {
        forbidden.add(grid[r][c - 1].tile);
      }
      const safe = activeTiles.filter((t) => !forbidden.has(t));
      if (safe.length > 0) return safe[Math.floor(Math.random() * safe.length)];
    }
    return randomTile();
  }

  function applyGravityAndRefill() {
    clearFallOffsets();

    // Jatuhkan ubin ke bawah kolom demi kolom sambil mencatat jarak jatuh (fallRows)
    for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 0; r--) {
        const target = grid[r][c];
        if (!cellCanMoveOrFall(target) || target.tile !== null || target.power !== null) continue;

        let found = false;
        for (let sr = r - 1; sr >= 0; sr--) {
          const src = grid[sr][c];
          if (!src.active) continue;
          if (src.crate > 0 || src.chain) break;
          if (src.tile !== null || src.power !== null) {
            target.tile = src.tile;
            target.power = src.power;
            target.justSpawned = src.justSpawned;
            target.fallRows = r - sr;
            src.tile = null;
            src.power = null;
            src.justSpawned = false;
            found = true;
            break;
          }
        }

        if (!found) {
          for (const dc of [-1, 1]) {
            const diag = grid[r - 1]?.[c + dc];
            if (diag && cellCanMoveOrFall(diag) && (diag.tile !== null || diag.power !== null)) {
              target.tile = diag.tile;
              target.power = diag.power;
              target.justSpawned = diag.justSpawned;
              target.fallRows = 1;
              diag.tile = null;
              diag.power = null;
              diag.justSpawned = false;
              found = true;
              break;
            }
          }
        }
      }
    }

    // Isi sel kosong dari atas dengan animasi jatuh mulus
    for (let c = 0; c < cols; c++) {
      let spawnCount = 0;
      for (let r = rows - 1; r >= 0; r--) {
        const cell = grid[r][c];
        if (cellCanHoldTile(cell) && cell.tile === null && cell.power === null) {
          spawnCount += 1;
          cell.tile = pickRefillTile(r, c);
          cell.fallRows = Math.min(rows, spawnCount + 1);
        }
      }
    }
  }

  function triggerFallAnimation() {
    const boardEl = document.getElementById('puzzle-board');
    if (!boardEl) return;
    const firstCell = boardEl.querySelector('.pz-cell[data-r]');
    const pitch = firstCell ? firstCell.getBoundingClientRect().height + 6 : 64;

    boardEl.querySelectorAll('.pz-tile-wrap[data-fall]').forEach((wrap) => {
      const fall = Number(wrap.dataset.fall || 0);
      if (fall <= 0) return;
      wrap.style.transition = 'none';
      wrap.style.transform = `translate3d(0, ${-fall * pitch}px, 0)`;
      wrap.getBoundingClientRect();
      wrap.style.transition = `transform ${Math.min(280, 145 + fall * 32)}ms cubic-bezier(0.22, 1.1, 0.36, 1)`;
      wrap.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  async function animateSwapVisual(a, b, revert = false) {
    const elA = document.querySelector(`.pz-cell[data-r="${a.r}"][data-c="${a.c}"] .pz-tile-wrap`);
    const elB = document.querySelector(`.pz-cell[data-r="${b.r}"][data-c="${b.c}"] .pz-tile-wrap`);
    const cellA = document.querySelector(`.pz-cell[data-r="${a.r}"][data-c="${a.c}"]`);
    const cellB = document.querySelector(`.pz-cell[data-r="${b.r}"][data-c="${b.c}"]`);
    if (!elA || !elB || !cellA || !cellB) {
      await sleep(120);
      return;
    }

    const rA = cellA.getBoundingClientRect();
    const rB = cellB.getBoundingClientRect();
    const dx = rB.left - rA.left;
    const dy = rB.top - rA.top;

    elA.style.transition = 'transform 165ms cubic-bezier(0.22, 1, 0.36, 1)';
    elB.style.transition = 'transform 165ms cubic-bezier(0.22, 1, 0.36, 1)';
    elA.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.06)`;
    elB.style.transform = `translate3d(${-dx}px, ${-dy}px, 0) scale(0.96)`;
    await sleep(170);

    if (revert) {
      elA.style.transition = 'transform 155ms cubic-bezier(0.36, 0, 0.66, -0.2)';
      elB.style.transition = 'transform 155ms cubic-bezier(0.36, 0, 0.66, -0.2)';
      elA.style.transform = 'translate3d(0, 0, 0)';
      elB.style.transform = 'translate3d(0, 0, 0)';
      await sleep(165);
    }
  }

  async function resolveBoardCascades() {
    let combo = 0;
    let spawnedLabel = null;

    while (!destroyed) {
      const { groups, intersections } = findMatches();
      if (groups.length === 0) break;

      combo += 1;
      audio.playMatch(combo);

      const toClear = new Map();
      const spawns = [];
      const spawnedKeys = new Set();

      for (const interKey of intersections) {
        const [ir, ic] = interKey.split(',').map(Number);
        const cell = grid[ir][ic];
        spawns.push({ r: ir, c: ic, power: 'bomb', tile: cell.tile });
        spawnedKeys.add(interKey);
        spawnedLabel = 'Bom 3x3 siap digunakan.';
      }

      for (const g of groups) {
        g.cells.forEach((cl) => toClear.set(`${cl.r},${cl.c}`, cl));
        const hasInter = g.cells.some((cl) => intersections.has(`${cl.r},${cl.c}`));
        if (!hasInter && g.cells.length >= 4) {
          const anchor =
            g.cells.find((cl) => preferredSpawnCell && cl.r === preferredSpawnCell.r && cl.c === preferredSpawnCell.c) ||
            g.cells[Math.floor(g.cells.length / 2)];
          const aKey = `${anchor.r},${anchor.c}`;
          if (!spawnedKeys.has(aKey)) {
            spawnedKeys.add(aKey);
            if (g.cells.length >= 5) {
              spawns.push({ r: anchor.r, c: anchor.c, power: 'rainbow', tile: null });
              spawnedLabel = 'Bola Pelangi siap digunakan.';
            } else {
              spawns.push({
                r: anchor.r,
                c: anchor.c,
                power: g.dir === 'h' ? 'rocket_v' : 'rocket_h',
                tile: anchor.tile
              });
              spawnedLabel = 'Roket siap digunakan.';
            }
          }
        }
      }

      // Tahap 1: animasi letupan ubin yang cocok
      poppingCells.clear();
      for (const key of toClear.keys()) poppingCells.add(key);
      render(false);
      await sleep(175);
      poppingCells.clear();

      // Tahap 2: terapkan skor, rintangan, dan buat Power-Up baru (terlindungi!)
      const triggeredPowers = [];
      for (const cl of toClear.values()) {
        hitAdjacentCrates(cl.r, cl.c);
        if (spawnedKeys.has(`${cl.r},${cl.c}`)) {
          if (cl.tile) decrementGoal('tile', cl.tile, 1);
          if (cl.moss) {
            cl.moss = false;
            decrementGoal('obstacle', 'moss', 1);
          }
          if (cl.ice > 0) {
            cl.ice -= 1;
            if (cl.ice === 0) decrementGoal('obstacle', 'ice', 1);
          }
          if (cl.chain) {
            cl.chain = false;
            decrementGoal('obstacle', 'chain', 1);
          }
          cl.tile = null;
          cl.power = null;
        } else {
          damageCell(cl, triggeredPowers, false);
        }
      }

      for (const sp of spawns) {
        const cl = grid[sp.r][sp.c];
        cl.power = sp.power;
        cl.tile = sp.power === 'rainbow' ? null : sp.tile;
        cl.justSpawned = true;
      }

      if (triggeredPowers.length > 0) {
        detonateQueue(triggeredPowers);
      }

      preferredSpawnCell = null;
      applyGravityAndRefill();
      render(true);
      await sleep(235);
      blastFlashCells.clear();
      clearFallOffsets();
    }

    clearProtectedFlags();
    if (spawnedLabel) {
      statusMsg = spawnedLabel;
    } else if (combo >= 2) {
      statusMsg = `Kombo ${combo}x.`;
    }
    checkEndState();
  }

  function checkEndState() {
    if (allGoalsCleared()) {
      finished = 'win';
      score += movesLeft * 15;
      audio.playVictory();
      render(false);
      return;
    }
    if (movesLeft <= 0) {
      finished = rescueUsed ? 'lose' : 'rescue';
      audio.playWrong();
      render(false);
      return;
    }
    if (!findFirstValidMove()) {
      shuffleBoard(true);
      render(false);
    }
    resetIdleHint();
  }

  function resetIdleHint() {
    clearTimeout(hintTimer);
    hintCells.clear();
    if (destroyed || busy || finished || activeQuest) return;
    hintTimer = setTimeout(() => {
      if (destroyed || busy || finished || activeQuest) return;
      const move = findFirstValidMove();
      if (!move) return;
      hintCells.clear();
      hintCells.add(`${move[0].r},${move[0].c}`);
      hintCells.add(`${move[1].r},${move[1].c}`);
      render(false);
    }, 5200);
  }

  function openMicroQuest({ title, onPass, onFail }) {
    clearTimeout(hintTimer);
    hintCells.clear();
    const q = buildMicroQuest(cfg.level);
    activeQuest = {
      title,
      quest: q,
      onPass,
      onFail,
      feedback: null
    };
    audio.playDialogueOpen();
    render(false);
  }

  async function activateSinglePower(cell) {
    if (busy || finished || activeQuest || !cell.power) return;
    if (cell.power === 'rainbow') {
      statusMsg = 'Geser Bola Pelangi ke buah warna pilihanmu.';
      render(false);
      return;
    }
    clearTimeout(hintTimer);
    hintCells.clear();
    busy = true;
    selected = null;
    movesLeft -= 1;

    const p = { r: cell.r, c: cell.c, power: cell.power, tile: cell.tile };
    cell.power = null;
    cell.tile = null;
    detonateQueue([p]);

    render(false);
    await sleep(210);
    blastFlashCells.clear();
    applyGravityAndRefill();
    render(true);
    await sleep(240);
    clearFallOffsets();
    await resolveBoardCascades();
    busy = false;
    render(false);
  }

  async function executeSwap(a, b) {
    if (busy || finished || activeQuest) return;
    if (!isAdjacent(a, b)) return;
    clearTimeout(hintTimer);
    hintCells.clear();

    const sealedCell = a.seal ? a : b.seal ? b : null;
    if (sealedCell) {
      openMicroQuest({
        title: 'Segel Ilmu',
        onPass: async () => {
          sealedCell.seal = false;
          decrementGoal('obstacle', 'seal', 1);
          blastFlashCells.add(`${sealedCell.r},${sealedCell.c}`);
          statusMsg = 'Segel terbuka.';
          await performVerifiedSwap(a, b, true);
        },
        onFail: () => {
          movesLeft = Math.max(0, movesLeft - 1);
          statusMsg = 'Segel tetap terkunci (-1 langkah).';
          checkEndState();
          render(false);
        }
      });
      return;
    }

    await performVerifiedSwap(a, b, false);
  }

  async function performVerifiedSwap(a, b, sealJustBroken = false) {
    if (!canSwapCell(a) || !canSwapCell(b)) {
      if (sealJustBroken) {
        checkEndState();
        render(false);
      }
      return;
    }

    busy = true;
    selected = null;
    audio.playSwap();

    const pA = a.power;
    const pB = b.power;

    // Power-Up + Power-Up atau Rainbow + Fruit
    if (pA || pB) {
      const bothPower = Boolean(pA && pB);
      const hasRainbow = pA === 'rainbow' || pB === 'rainbow';
      if (bothPower || hasRainbow) {
        await animateSwapVisual(a, b, false);
        movesLeft -= 1;
        const triggered = [];
        if (bothPower) {
          audio.playBlast();
          if (pA === 'rainbow' && pB === 'rainbow') {
            statusMsg = 'Kombo Pelangi Ganda.';
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) damageCell(grid[r][c], triggered, true);
            }
          } else if (pA === 'rainbow' || pB === 'rainbow') {
            const otherPower = pA === 'rainbow' ? pB : pA;
            const targetTile = (pA === 'rainbow' ? b.tile : a.tile) || activeTiles[0];
            a.power = null;
            b.power = null;
            statusMsg = 'Kombo Pelangi + Power-Up.';
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                if (grid[r][c].tile === targetTile) {
                  grid[r][c].power = otherPower === 'bomb' ? 'bomb' : Math.random() < 0.5 ? 'rocket_h' : 'rocket_v';
                  triggered.push({ r, c, power: grid[r][c].power, tile: targetTile });
                  grid[r][c].power = null;
                }
              }
            }
          } else if (pA === 'bomb' && pB === 'bomb') {
            statusMsg = 'Bom Besar 5x5.';
            a.power = null;
            b.power = null;
            for (let dr = -2; dr <= 2; dr++) {
              for (let dc = -2; dc <= 2; dc++) {
                if (grid[b.r + dr]?.[b.c + dc]) damageCell(grid[b.r + dr][b.c + dc], triggered, true);
              }
            }
          } else if (pA === 'bomb' || pB === 'bomb') {
            statusMsg = 'Kombo Bom + Roket.';
            a.power = null;
            b.power = null;
            for (let d = -1; d <= 1; d++) {
              if (grid[b.r + d]) {
                for (let cc = 0; cc < cols; cc++) damageCell(grid[b.r + d][cc], triggered, true);
              }
              if (b.c + d >= 0 && b.c + d < cols) {
                for (let rr = 0; rr < rows; rr++) damageCell(grid[rr][b.c + d], triggered, true);
              }
            }
          } else {
            statusMsg = 'Kombo Roket Silang.';
            a.power = null;
            b.power = null;
            for (let cc = 0; cc < cols; cc++) damageCell(grid[b.r][cc], triggered, true);
            for (let rr = 0; rr < rows; rr++) damageCell(grid[rr][b.c], triggered, true);
          }
          a.tile = null;
          b.tile = null;
        } else {
          const rb = pA === 'rainbow' ? a : b;
          const other = pA === 'rainbow' ? b : a;
          const targetTile = other.tile || activeTiles[0];
          rb.power = null;
          rb.tile = null;
          statusMsg = 'Bola Pelangi aktif.';
          triggered.push({ r: rb.r, c: rb.c, power: 'rainbow', targetTile });
        }

        detonateQueue(triggered);
        render(false);
        await sleep(220);
        blastFlashCells.clear();
        applyGravityAndRefill();
        render(true);
        await sleep(240);
        clearFallOffsets();
        await resolveBoardCascades();
        busy = false;
        render(false);
        return;
      }

      // Tukar Rocket / Bomb dengan buah biasa -> aktifkan langsung di posisi baru!
      await animateSwapVisual(a, b, false);
      const tmpT = a.tile;
      const tmpP = a.power;
      a.tile = b.tile;
      a.power = b.power;
      b.tile = tmpT;
      b.power = tmpP;

      movesLeft -= 1;
      const activeCell = a.power ? a : b;
      const p = { r: activeCell.r, c: activeCell.c, power: activeCell.power, tile: activeCell.tile };
      activeCell.power = null;
      activeCell.tile = null;
      detonateQueue([p]);

      render(false);
      await sleep(210);
      blastFlashCells.clear();
      applyGravityAndRefill();
      render(true);
      await sleep(240);
      clearFallOffsets();
      await resolveBoardCascades();
      busy = false;
      render(false);
      return;
    }

    // Tukar buah biasa
    const tmpTile = a.tile;
    a.tile = b.tile;
    b.tile = tmpTile;
    const matched = findMatches().groups.length > 0;

    if (!matched) {
      // Kembalikan state & tampilkan animasi pantul halus (tidak memotong langkah)
      b.tile = a.tile;
      a.tile = tmpTile;
      audio.playWrong();
      await animateSwapVisual(a, b, true);
      statusMsg = sealJustBroken ? 'Segel terbuka.' : 'Belum membentuk 3 warna.';
      if (sealJustBroken) checkEndState();
      busy = false;
      render(false);
      return;
    }

    // Tukar valid: geser mulus lalu proses kecocokan
    b.tile = a.tile;
    a.tile = tmpTile;
    await animateSwapVisual(a, b, false);
    a.tile = b.tile;
    b.tile = tmpTile;

    movesLeft -= 1;
    preferredSpawnCell = { r: b.r, c: b.c };
    statusMsg = cfg.tip;
    render(false);
    await resolveBoardCascades();
    busy = false;
    render(false);
  }

  async function applyBoosterOnCell(cell) {
    if (!cell || !cell.active || busy) return;
    const bType = activeBooster;
    activeBooster = null;
    clearTimeout(hintTimer);
    hintCells.clear();
    busy = true;
    const triggered = [];

    if (bType === 'shovel') {
      audio.playBlast();
      if (cell.seal) {
        cell.seal = false;
        decrementGoal('obstacle', 'seal', 1);
      }
      if (cell.crate > 0) hitCrate(cell);
      else damageCell(cell, triggered, true);
      statusMsg = 'Sekop digunakan.';
    } else if (bType === 'bomb') {
      audio.playBlast();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const t = grid[cell.r + dr]?.[cell.c + dc];
          if (t && t.active) {
            if (t.seal) {
              t.seal = false;
              decrementGoal('obstacle', 'seal', 1);
            }
            damageCell(t, triggered, true);
          }
        }
      }
      statusMsg = 'Bom 3x3 meledak.';
    }

    if (triggered.length > 0) detonateQueue(triggered);
    render(false);
    await sleep(210);
    blastFlashCells.clear();
    applyGravityAndRefill();
    render(true);
    await sleep(240);
    clearFallOffsets();
    await resolveBoardCascades();
    busy = false;
    render(false);
  }

  function requestBooster(type) {
    if (busy || finished || activeQuest) return;
    if (activeBooster === type) {
      activeBooster = null;
      statusMsg = 'Booster dibatalkan.';
      render(false);
      return;
    }

    const stock = save.boosters?.[type] || 0;
    const activateNow = () => {
      if (type === 'shuffle') {
        shuffleBoard(true);
        render(false);
      } else {
        activeBooster = type;
        statusMsg = type === 'shovel' ? 'Pilih 1 ubin untuk dipecahkan.' : 'Pilih pusat ledakan 3x3.';
        render(false);
      }
    };

    if (stock > 0) {
      save.boosters[type] -= 1;
      persistGardenSave(save);
      activateNow();
      return;
    }

    if (!freeBoosterQuestUsed) {
      openMicroQuest({
        title: `Aktifkan ${type === 'shovel' ? 'Sekop' : type === 'bomb' ? 'Bom 3x3' : 'Acak'}`,
        onPass: () => {
          freeBoosterQuestUsed = true;
          activateNow();
        },
        onFail: () => {
          statusMsg = 'Booster belum aktif.';
          render(false);
        }
      });
      return;
    }

    if (save.coins >= 45) {
      save.coins -= 45;
      persistGardenSave(save);
      activateNow();
    } else {
      statusMsg = 'Butuh 45 Koin.';
      render(false);
    }
  }

  function handleCellClick(r, c) {
    if (busy || finished || activeQuest) return;
    const cell = grid[r]?.[c];
    if (!cell || !cell.active) return;

    if (activeBooster) {
      applyBoosterOnCell(cell);
      return;
    }

    if (cell.seal && !selected) {
      openMicroQuest({
        title: 'Segel Ilmu',
        onPass: () => {
          cell.seal = false;
          decrementGoal('obstacle', 'seal', 1);
          blastFlashCells.add(`${cell.r},${cell.c}`);
          statusMsg = 'Segel terbuka.';
          checkEndState();
          render(false);
          setTimeout(() => {
            blastFlashCells.clear();
            if (!destroyed) render(false);
          }, 260);
        },
        onFail: () => {
          movesLeft = Math.max(0, movesLeft - 1);
          statusMsg = 'Segel tetap terkunci (-1 langkah).';
          checkEndState();
          render(false);
        }
      });
      return;
    }

    if (!canSwapCell(cell)) return;

    // Klik kedua pada Power-Up (atau klik langsung jika belum ada yang dipilih & bukan Rainbow)
    if (!selected && cell.power && cell.power !== 'rainbow') {
      activateSinglePower(cell);
      return;
    }

    if (!selected) {
      selected = { r, c };
      audio.playClick();
      render(false);
      return;
    }

    if (selected.r === r && selected.c === c) {
      if (cell.power && cell.power !== 'rainbow') {
        activateSinglePower(cell);
        return;
      }
      selected = null;
      render(false);
      return;
    }

    const prev = grid[selected.r][selected.c];
    if (isAdjacent(prev, cell)) {
      executeSwap(prev, cell);
    } else {
      selected = { r, c };
      audio.playClick();
      render(false);
    }
  }

  function cleanupAndExit(cb) {
    destroyed = true;
    clearTimeout(hintTimer);
    if (cb) cb();
  }

  function render(animateFalls = false) {
    if (destroyed) return;
    const diffClass = cfg.difficulty === 'Sangat Sulit' ? 'super' : cfg.difficulty === 'Sulit' ? 'hard' : 'normal';
    const boardMaxPx = cols <= 5 ? 390 : cols === 6 ? 445 : cols === 7 ? 490 : 520;

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="puzzle-shell" style="max-width:${boardMaxPx + 52}px;">
          <div class="puzzle-header">
            <div class="puzzle-title-group">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="diff-pill ${diffClass}">${escapeHtml(cfg.difficulty)}</span>
                <span class="puzzle-lv-txt">Level ${cfg.level}</span>
                <span class="puzzle-star-tag">+${cfg.starReward} ★</span>
              </div>
              <div class="puzzle-goals">
                ${goals
                  .map(
                    (g) => `
                  <div class="goal-chip ${g.left <= 0 ? 'done' : ''}" title="${escapeHtml(g.label)}">
                    <span class="goal-ico">${renderGoalIcon(g)}</span>
                    <span>${g.left <= 0 ? '✓' : g.left}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div class="puzzle-moves-box ${movesLeft <= 4 ? 'low' : ''}">
              <span class="moves-num">${movesLeft}</span>
              <span class="moves-lbl">Langkah</span>
            </div>

            <button class="rpg-btn ghost" id="btn-pz-quit" type="button" style="padding:7px 13px; font-size:0.78rem;">Keluar</button>
          </div>

          <div class="puzzle-board-wrap">
            <div class="puzzle-board" id="puzzle-board" style="grid-template-columns: repeat(${cols}, 1fr); aspect-ratio: ${cols} / ${rows};">
              ${grid
                .flatMap((row) =>
                  row.map((cell) => {
                    if (!cell.active) return `<div class="pz-cell hole"></div>`;
                    const key = `${cell.r},${cell.c}`;
                    const isSel = selected && selected.r === cell.r && selected.c === cell.c;
                    const isPop = poppingCells.has(key);
                    const isFlash = blastFlashCells.has(key);
                    const isHint = hintCells.has(key);
                    const classes = [
                      'pz-cell',
                      cell.moss ? 'has-moss' : '',
                      cell.ice > 0 ? `has-ice ice-${cell.ice}` : '',
                      cell.chain ? 'has-chain' : '',
                      cell.seal ? 'has-seal' : '',
                      cell.power ? 'has-power' : '',
                      isSel ? 'selected' : '',
                      isPop ? 'popping' : '',
                      isFlash ? 'flash' : '',
                      isHint ? 'hint' : '',
                      activeBooster ? 'booster-target' : ''
                    ]
                      .filter(Boolean)
                      .join(' ');

                    const inner =
                      cell.crate > 0
                        ? `<div class="obs-crate crate-${cell.crate}">${cell.crate === 2 ? '<span>2</span>' : ''}</div>`
                        : `<div class="pz-tile-wrap" data-fall="${animateFalls ? cell.fallRows : 0}">${renderTileArt(cell.tile, cell.power)}</div>`;

                    const sealBadge = cell.seal ? `<div class="obs-seal" title="Segel Ilmu">?</div>` : '';
                    const chainOverlay = cell.chain ? `<div class="obs-chain"></div>` : '';
                    const iceOverlay = cell.ice > 0 ? `<div class="obs-ice">${cell.ice === 2 ? '2' : ''}</div>` : '';

                    return `
                      <button class="${classes}" data-r="${cell.r}" data-c="${cell.c}" type="button">
                        ${inner}
                        ${iceOverlay}
                        ${chainOverlay}
                        ${sealBadge}
                      </button>
                    `;
                  })
                )
                .join('')}
            </div>
          </div>

          <div class="puzzle-footer">
            <div class="puzzle-status">${escapeHtml(statusMsg)}</div>
            <div class="booster-row">
              <button class="booster-btn ${activeBooster === 'shovel' ? 'active' : ''}" id="btn-bst-shovel" type="button">
                <strong>Sekop</strong>
                <span>${save.boosters?.shovel > 0 ? save.boosters.shovel : freeBoosterQuestUsed ? '45 Koin' : '1 Soal'}</span>
              </button>
              <button class="booster-btn ${activeBooster === 'bomb' ? 'active' : ''}" id="btn-bst-bomb" type="button">
                <strong>Bom 3x3</strong>
                <span>${save.boosters?.bomb > 0 ? save.boosters.bomb : freeBoosterQuestUsed ? '45 Koin' : '1 Soal'}</span>
              </button>
              <button class="booster-btn" id="btn-bst-shuffle" type="button">
                <strong>Acak</strong>
                <span>${save.boosters?.shuffle > 0 ? save.boosters.shuffle : freeBoosterQuestUsed ? '45 Koin' : '1 Soal'}</span>
              </button>
            </div>
          </div>

          ${activeQuest ? renderQuestSheet() : ''}
          ${finished ? renderResultSheet() : ''}
        </div>
      </div>
    `;

    if (animateFalls) triggerFallAnimation();

    document.getElementById('btn-pz-quit')?.addEventListener('click', () => {
      audio.playClick();
      cleanupAndExit(onClose);
    });

    document.getElementById('btn-bst-shovel')?.addEventListener('click', () => requestBooster('shovel'));
    document.getElementById('btn-bst-bomb')?.addEventListener('click', () => requestBooster('bomb'));
    document.getElementById('btn-bst-shuffle')?.addEventListener('click', () => requestBooster('shuffle'));

    let swipeStart = null;
    document.querySelectorAll('.pz-cell[data-r]').forEach((el) => {
      const r = Number(el.dataset.r);
      const c = Number(el.dataset.c);

      el.addEventListener('pointerdown', (e) => {
        if (busy || finished || activeQuest || activeBooster) return;
        swipeStart = { r, c, x: e.clientX, y: e.clientY, handled: false };
      });
      el.addEventListener('pointermove', (e) => {
        if (!swipeStart || swipeStart.handled || busy || finished || activeQuest || activeBooster) return;
        const dx = e.clientX - swipeStart.x;
        const dy = e.clientY - swipeStart.y;
        if (Math.hypot(dx, dy) < 15) return;
        swipeStart.handled = true;
        const dr = Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? 1 : -1) : 0;
        const dc = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 1 : -1) : 0;
        const a = grid[swipeStart.r]?.[swipeStart.c];
        const b = grid[swipeStart.r + dr]?.[swipeStart.c + dc];
        if (a && b && b.active) executeSwap(a, b);
      });
      el.addEventListener('pointerup', () => {
        if (swipeStart && swipeStart.handled) {
          swipeStart = null;
          return;
        }
        swipeStart = null;
        handleCellClick(r, c);
      });
    });

    if (activeQuest) {
      document.getElementById('btn-mq-audio')?.addEventListener('click', () => {
        speakPhrase(activeQuest.quest.audioText, activeQuest.quest.audioLang || 'ko-KR');
      });
      document.querySelectorAll('[data-mq-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (activeQuest.feedback) return;
          const idx = Number(btn.dataset.mqIdx);
          const opt = activeQuest.quest.options[idx];
          const ok = Boolean(opt && opt.ok);
          activeQuest.feedback = { ok, picked: idx };
          if (ok) {
            audio.playCorrect();
            save.solvedQuests = (save.solvedQuests || 0) + 1;
            if (activeQuest.quest.codexId && !save.codexIds.includes(activeQuest.quest.codexId)) {
              save.codexIds.push(activeQuest.quest.codexId);
            }
            persistGardenSave(save);
          } else {
            audio.playWrong();
          }
          render(false);
        });
      });
      document.getElementById('btn-mq-continue')?.addEventListener('click', () => {
        const qa = activeQuest;
        activeQuest = null;
        if (qa.feedback && qa.feedback.ok) qa.onPass();
        else qa.onFail();
      });
    }

    if (finished === 'rescue') {
      document.getElementById('btn-rescue-quest')?.addEventListener('click', () => {
        finished = false;
        openMicroQuest({
          title: 'Tambah 5 Langkah',
          onPass: () => {
            rescueUsed = true;
            movesLeft += 5;
            statusMsg = '+5 langkah.';
            render(false);
          },
          onFail: () => {
            rescueUsed = true;
            finished = 'lose';
            render(false);
          }
        });
      });
      document.getElementById('btn-rescue-coin')?.addEventListener('click', () => {
        if (save.coins < 60) return;
        save.coins -= 60;
        persistGardenSave(save);
        rescueUsed = true;
        finished = false;
        movesLeft += 5;
        statusMsg = '+5 langkah.';
        render(false);
      });
      document.getElementById('btn-rescue-giveup')?.addEventListener('click', () => {
        rescueUsed = true;
        finished = 'lose';
        render(false);
      });
    } else if (finished === 'win') {
      document.getElementById('btn-pz-win')?.addEventListener('click', () => {
        audio.playClick();
        cleanupAndExit(() =>
          onWin?.({
            level: cfg.level,
            stars: cfg.starReward,
            coins: cfg.coinReward + Math.round(movesLeft * 4),
            score
          })
        );
      });
    } else if (finished === 'lose') {
      document.getElementById('btn-pz-lose')?.addEventListener('click', () => {
        audio.playClick();
        cleanupAndExit(onLose);
      });
    }
  }

  function renderQuestSheet() {
    const q = activeQuest.quest;
    const fb = activeQuest.feedback;
    return `
      <div class="pz-sheet-backdrop">
        <div class="pz-sheet">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
            <strong style="font-size:0.84rem; color:var(--gold);">${escapeHtml(activeQuest.title)} · ${escapeHtml(q.topic)}</strong>
            ${q.audioText ? `<button class="speak-btn" id="btn-mq-audio" type="button">Suara</button>` : ''}
          </div>
          <p class="pz-quest-prompt">${escapeHtml(q.prompt)}</p>
          <div class="choice-grid">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="rpg-choice ${fb ? (opt.ok ? 'ok' : fb.picked === idx ? 'bad' : '') : ''}" data-mq-idx="${idx}" type="button" ${fb ? 'disabled' : ''}>
                <span class="choice-badge">${['A', 'B', 'C', 'D'][idx]}</span>
                <span>${escapeHtml(opt.label)}</span>
              </button>
            `
              )
              .join('')}
          </div>
          ${
            fb
              ? `
            <div class="insight-box" style="margin-top:10px;">
              <p style="margin:0;"><strong>${fb.ok ? 'Tepat.' : 'Keliru.'}</strong> ${escapeHtml(q.explain)}</p>
            </div>
            <div style="margin-top:10px; text-align:right;">
              <button class="rpg-btn gold" id="btn-mq-continue" type="button" style="padding:8px 18px; font-size:0.84rem;">Lanjut</button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  function renderResultSheet() {
    if (finished === 'rescue') {
      return `
        <div class="pz-sheet-backdrop">
          <div class="pz-sheet" style="text-align:center;">
            <h3 style="margin:0 0 6px; font-family:var(--font-display); font-size:1.3rem;">Langkah Habis</h3>
            <p style="margin:0 0 14px; font-size:0.85rem; color:var(--muted);">Lanjutkan dengan +5 langkah.</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
              <button class="rpg-btn gold" id="btn-rescue-quest" type="button" style="padding:9px 16px; font-size:0.84rem;">1 Soal (+5)</button>
              <button class="rpg-btn primary" id="btn-rescue-coin" type="button" style="padding:9px 16px; font-size:0.84rem;" ${save.coins >= 60 ? '' : 'disabled'}>60 Koin (+5)</button>
              <button class="rpg-btn ghost" id="btn-rescue-giveup" type="button" style="padding:9px 14px; font-size:0.82rem;">Keluar (-1 ♥)</button>
            </div>
          </div>
        </div>
      `;
    }
    if (finished === 'win') {
      const totalCoins = cfg.coinReward + Math.round(movesLeft * 4);
      return `
        <div class="pz-sheet-backdrop">
          <div class="pz-sheet" style="text-align:center;">
            <div class="stamp-banner approved" style="margin:0 0 8px;">LEVEL ${cfg.level} SELESAI</div>
            <p style="margin:0 0 14px; font-size:0.9rem; color:var(--gold); font-weight:700;">
              +${cfg.starReward} ★ · +${totalCoins} Koin
            </p>
            <button class="rpg-btn gold" id="btn-pz-win" type="button">Kembali ke Taman</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="pz-sheet-backdrop">
        <div class="pz-sheet" style="text-align:center;">
          <div class="stamp-banner rejected" style="margin:0 0 8px;">BELUM TUNTAS</div>
          <p style="margin:0 0 14px; font-size:0.86rem; color:var(--muted);">-1 ♥</p>
          <button class="rpg-btn primary" id="btn-pz-lose" type="button">Kembali ke Taman</button>
        </div>
      </div>
    `;
  }

  initBoard();
  render(false);
  resetIdleHint();
}
