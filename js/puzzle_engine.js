// Mesin Match-3 Gardenscapes Lengkap:
// - Swap klik & geser (drag/swipe)
// - Power-Up: Roket (4 segaris), Bom (bentuk L/T), Bola Pelangi (5 segaris) + Mega Combo antar Power-Up!
// - Rintangan: Kotak Kayu (1-2 lapis), Es Beku (1-2 lapis), Rantai Besi, Karpet Lumut, dan Ubin Segel (Micro-Quest)!
// - Booster: Sekop, Bom Cepat, Acak Papan (pakai stok, Koin, atau 1 soal kilat) + Penyelamat +5 Langkah!

import { getLevelConfig, buildMicroQuest, TILE_TYPES } from './puzzle_levels.js';
import { speakPhrase } from './academy_ui.js';
import { persistGardenSave } from './garden_storage.js';
import { audio } from './audio.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function renderTileSVG(type, power = null) {
  if (power === 'rainbow') {
    return `
      <svg viewBox="0 0 48 48" class="tile-svg">
        <defs>
          <radialGradient id="rbG" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FFFDF5"/>
            <stop offset="35%" stop-color="#FFD166"/>
            <stop offset="68%" stop-color="#57B4C9"/>
            <stop offset="100%" stop-color="#8E5BA8"/>
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="18" fill="url(#rbG)" stroke="#FFF4D1" stroke-width="2.2"/>
        <path d="M24 9 L27 21 L39 24 L27 27 L24 39 L21 27 L9 24 L21 21 Z" fill="#FFFFFF" opacity="0.88"/>
      </svg>
    `;
  }
  if (power === 'bomb') {
    return `
      <svg viewBox="0 0 48 48" class="tile-svg">
        <circle cx="23" cy="27" r="14" fill="#2A2624" stroke="#D9B466" stroke-width="2.4"/>
        <circle cx="18" cy="22" r="4" fill="#5A534E"/>
        <rect x="20" y="10" width="6" height="5" rx="1.5" fill="#B88E44"/>
        <path d="M25 10 Q32 4 36 9" fill="none" stroke="#E0B45A" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="37" cy="10" r="3.6" fill="#FF7849"/>
        <circle cx="37" cy="10" r="1.6" fill="#FFF7D6"/>
      </svg>
    `;
  }
  if (power === 'rocket_h' || power === 'rocket_v') {
    const rot = power === 'rocket_v' ? 'rotate(90 24 24)' : '';
    return `
      <svg viewBox="0 0 48 48" class="tile-svg">
        <g transform="${rot}">
          <rect x="8" y="17" width="32" height="14" rx="7" fill="#C45131" stroke="#F4D58D" stroke-width="2"/>
          <polygon points="4,24 12,17 12,31" fill="#F4D58D"/>
          <polygon points="44,24 36,17 36,31" fill="#F4D58D"/>
          <circle cx="24" cy="24" r="4.2" fill="#FFF6DC"/>
        </g>
      </svg>
    `;
  }

  switch (type) {
    case 'apple':
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <path d="M24 14 C16 12, 9 18, 10 28 C11 36, 17 41, 24 39 C31 41, 37 36, 38 28 C39 18, 32 12, 24 14 Z" fill="#D14343" stroke="#7A1F1F" stroke-width="1.8"/>
          <ellipse cx="17.5" cy="22" rx="3.2" ry="5.5" transform="rotate(-18 17.5 22)" fill="#F38D8D" opacity="0.55"/>
          <path d="M24 14 Q25 8 28 7" fill="none" stroke="#5C3A21" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M25 11 C29 7, 35 8, 34 12 C31 14, 27 13, 25 11 Z" fill="#4C9A5A"/>
        </svg>
      `;
    case 'pear':
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <path d="M24 11 C20 11, 18 16, 16 21 C12 26, 11 33, 15 38 C18 41, 30 41, 33 38 C37 33, 36 26, 32 21 C30 16, 28 11, 24 11 Z" fill="#9AC44B" stroke="#537322" stroke-width="1.8"/>
          <ellipse cx="19" cy="28" rx="3" ry="5.2" transform="rotate(-12 19 28)" fill="#D7ED9D" opacity="0.58"/>
          <path d="M24 11 Q25 6 28 6" fill="none" stroke="#5C3A21" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      `;
    case 'berry':
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <circle cx="18" cy="29" r="9.5" fill="#3E6CB8" stroke="#1E3B6E" stroke-width="1.7"/>
          <circle cx="30" cy="29" r="9.5" fill="#4C7ED1" stroke="#1E3B6E" stroke-width="1.7"/>
          <circle cx="24" cy="19" r="9.5" fill="#5A8EE0" stroke="#1E3B6E" stroke-width="1.7"/>
          <circle cx="21" cy="16" r="2.6" fill="#B5D1FF" opacity="0.72"/>
          <circle cx="15" cy="26" r="2.2" fill="#B5D1FF" opacity="0.6"/>
          <circle cx="28" cy="26" r="2.2" fill="#B5D1FF" opacity="0.6"/>
        </svg>
      `;
    case 'lemon':
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <path d="M10 24 C12 14, 20 12, 24 12 C28 12, 36 14, 38 24 C36 34, 28 36, 24 36 C20 36, 12 34, 10 24 Z" fill="#EBBF38" stroke="#967114" stroke-width="1.8"/>
          <circle cx="9.5" cy="24" r="2.3" fill="#EBBF38" stroke="#967114" stroke-width="1.3"/>
          <circle cx="38.5" cy="24" r="2.3" fill="#EBBF38" stroke="#967114" stroke-width="1.3"/>
          <ellipse cx="21" cy="19" rx="6" ry="2.6" fill="#FFF3B8" opacity="0.68"/>
        </svg>
      `;
    case 'leaf':
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <path d="M12 36 C11 20, 21 10, 37 11 C38 27, 28 37, 12 36 Z" fill="#3C9C69" stroke="#1F5E3C" stroke-width="1.8"/>
          <path d="M13 35 L33 15" stroke="#A7E3BF" stroke-width="2" stroke-linecap="round"/>
          <path d="M21 27 L21 20 M26 22 L31 22" stroke="#A7E3BF" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    case 'sakura':
    default:
      return `
        <svg viewBox="0 0 48 48" class="tile-svg">
          <g fill="#ED97B2" stroke="#9E4A65" stroke-width="1.4">
            <ellipse cx="24" cy="14" rx="5.5" ry="8.5"/>
            <ellipse cx="33.5" cy="21" rx="5.5" ry="8.5" transform="rotate(72 33.5 21)"/>
            <ellipse cx="30" cy="32" rx="5.5" ry="8.5" transform="rotate(144 30 32)"/>
            <ellipse cx="18" cy="32" rx="5.5" ry="8.5" transform="rotate(216 18 32)"/>
            <ellipse cx="14.5" cy="21" rx="5.5" ry="8.5" transform="rotate(288 14.5 21)"/>
          </g>
          <circle cx="24" cy="24" r="4.8" fill="#F2C85B"/>
        </svg>
      `;
  }
}

export function renderGoalIconSVG(goal) {
  if (goal.kind === 'tile') return renderTileSVG(goal.id);
  if (goal.id === 'seal') {
    return `<svg viewBox="0 0 48 48" class="tile-svg"><circle cx="24" cy="24" r="16" fill="#C9A45C" stroke="#FFF1C7" stroke-width="2.4"/><path d="M24 13 L27 21 L35 21 L28.5 26 L31 34 L24 29 L17 34 L19.5 26 L13 21 L21 21 Z" fill="#2A1C12"/></svg>`;
  }
  if (goal.id === 'crate') {
    return `<svg viewBox="0 0 48 48" class="tile-svg"><rect x="8" y="8" width="32" height="32" rx="6" fill="#9E6B43" stroke="#54341B" stroke-width="2.4"/><line x1="8" y1="24" x2="40" y2="24" stroke="#54341B" stroke-width="2.2"/><line x1="12" y1="12" x2="36" y2="36" stroke="#754927" stroke-width="2.2"/></svg>`;
  }
  if (goal.id === 'ice') {
    return `<svg viewBox="0 0 48 48" class="tile-svg"><rect x="8" y="8" width="32" height="32" rx="8" fill="#8CD8EB" stroke="#E0F7FF" stroke-width="2.4"/><path d="M16 16 L32 32 M32 16 L16 32" stroke="#FFFFFF" stroke-width="2.2" opacity="0.7"/></svg>`;
  }
  if (goal.id === 'chain') {
    return `<svg viewBox="0 0 48 48" class="tile-svg"><rect x="8" y="8" width="32" height="32" rx="8" fill="#3B424D" stroke="#9AA5B4" stroke-width="2.4"/><line x1="11" y1="11" x2="37" y2="37" stroke="#CBD5E1" stroke-width="3.6" stroke-dasharray="6 4"/><line x1="37" y1="11" x2="11" y2="37" stroke="#CBD5E1" stroke-width="3.6" stroke-dasharray="6 4"/></svg>`;
  }
  // moss
  return `<svg viewBox="0 0 48 48" class="tile-svg"><rect x="8" y="8" width="32" height="32" rx="8" fill="#3E7A4C" stroke="#85C78E" stroke-width="2.4"/><circle cx="19" cy="21" r="5" fill="#63AB72"/><circle cx="29" cy="27" r="6" fill="#63AB72"/></svg>`;
}

export function launchGardenPuzzle({ overlayRoot, save, onWin, onLose, onClose }) {
  const cfg = getLevelConfig(save.level || 1);
  const { rows, cols, mask, activeTiles } = cfg;

  let grid = [];
  let movesLeft = cfg.moves;
  let score = 0;
  let combo = 0;
  let busy = false;
  let selected = null; // { r, c }
  let activeBooster = null; // null | 'shovel' | 'bomb'
  let freeBoosterQuestUsed = false;
  let rescueUsed = false;
  let finished = false; // false | 'win' | 'lose' | 'rescue'
  let activeQuest = null; // { title, quest, onPass, onFail, feedback }
  let statusMsg = cfg.tip;
  let blastFlashCells = new Set();

  // Salinan target level
  const goals = cfg.goals.map((g) => ({ ...g, left: g.count }));

  function randomTile(avoidSet = new Set()) {
    const pool = activeTiles.filter((t) => !avoidSet.has(t));
    const list = pool.length ? pool : activeTiles;
    return list[Math.floor(Math.random() * list.length)];
  }

  function makeEmptyCell(r, c) {
    return {
      r,
      c,
      active: mask[r][c],
      tile: null,
      power: null, // null | 'rocket_h' | 'rocket_v' | 'bomb' | 'rainbow'
      crate: 0,
      ice: 0,
      chain: false,
      moss: false,
      seal: false
    };
  }

  function initBoard() {
    grid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => makeEmptyCell(r, c))
    );

    // Pasang rintangan sesuai konfigurasi level
    for (const cr of cfg.obstacles.crates) {
      if (grid[cr.r]?.[cr.c]?.active) grid[cr.r][cr.c].crate = cr.hp;
    }
    for (const ic of cfg.obstacles.ice) {
      if (grid[ic.r]?.[ic.c]?.active && grid[ic.r][ic.c].crate === 0) grid[ic.r][ic.c].ice = ic.hp;
    }
    for (const ch of cfg.obstacles.chains) {
      if (grid[ch.r]?.[ch.c]?.active && grid[ch.r][ch.c].crate === 0) grid[ch.r][ch.c].chain = true;
    }
    for (const ms of cfg.obstacles.moss) {
      if (grid[ms.r]?.[ms.c]?.active) grid[ms.r][ms.c].moss = true;
    }
    for (const sl of cfg.obstacles.seals) {
      if (grid[sl.r]?.[sl.c]?.active && grid[sl.r][sl.c].crate === 0) grid[sl.r][sl.c].seal = true;
    }

    // Isi buah tanpa match-3 awal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (!cell.active || cell.crate > 0) continue;
        const avoid = new Set();
        if (c >= 2 && grid[r][c - 1].tile && grid[r][c - 1].tile === grid[r][c - 2].tile) {
          avoid.add(grid[r][c - 1].tile);
        }
        if (r >= 2 && grid[r - 1][c].tile && grid[r - 1][c].tile === grid[r - 2][c].tile) {
          avoid.add(grid[r - 1][c].tile);
        }
        cell.tile = randomTile(avoid);
      }
    }

    if (!hasAnyValidMove()) {
      shuffleBoard(false);
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

  function canSwapCell(cell) {
    if (!cell || !cell.active || cell.crate > 0 || !cell.tile && !cell.power) return false;
    if (cell.chain || cell.ice > 0) return false;
    return true;
  }

  function isAdjacent(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  }

  function findMatchGroups() {
    const hRuns = [];
    const vRuns = [];

    // Horizontal runs
    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols) {
        const start = grid[r][c];
        if (!start.active || start.crate > 0 || !start.tile || start.power === 'rainbow') {
          c += 1;
          continue;
        }
        let end = c + 1;
        while (
          end < cols &&
          grid[r][end].active &&
          grid[r][end].crate === 0 &&
          grid[r][end].tile === start.tile &&
          grid[r][end].power !== 'rainbow'
        ) {
          end += 1;
        }
        if (end - c >= 3) {
          const cells = [];
          for (let k = c; k < end; k++) cells.push(grid[r][k]);
          hRuns.push({ dir: 'h', tile: start.tile, cells });
        }
        c = end;
      }
    }

    // Vertical runs
    for (let c = 0; c < cols; c++) {
      let r = 0;
      while (r < rows) {
        const start = grid[r][c];
        if (!start.active || start.crate > 0 || !start.tile || start.power === 'rainbow') {
          r += 1;
          continue;
        }
        let end = r + 1;
        while (
          end < rows &&
          grid[end][c].active &&
          grid[end][c].crate === 0 &&
          grid[end][c].tile === start.tile &&
          grid[end][c].power !== 'rainbow'
        ) {
          end += 1;
        }
        if (end - r >= 3) {
          const cells = [];
          for (let k = r; k < end; k++) cells.push(grid[k][c]);
          vRuns.push({ dir: 'v', tile: start.tile, cells });
        }
        r = end;
      }
    }

    // Gabungkan runs berpotongan (bentuk L / T)
    const allRuns = [...hRuns, ...vRuns];
    const groups = [];
    const visited = new Array(allRuns.length).fill(false);

    for (let i = 0; i < allRuns.length; i++) {
      if (visited[i]) continue;
      visited[i] = true;
      const cluster = [allRuns[i]];
      const cellSet = new Set(allRuns[i].cells.map((x) => `${x.r},${x.c}`));
      let grew = true;
      while (grew) {
        grew = false;
        for (let j = 0; j < allRuns.length; j++) {
          if (visited[j] || allRuns[j].tile !== allRuns[i].tile) continue;
          const overlaps = allRuns[j].cells.some((x) => cellSet.has(`${x.r},${x.c}`));
          if (overlaps) {
            visited[j] = true;
            cluster.push(allRuns[j]);
            allRuns[j].cells.forEach((x) => cellSet.add(`${x.r},${x.c}`));
            grew = true;
          }
        }
      }
      const uniqueCells = [];
      const seen = new Set();
      let maxH = 0;
      let maxV = 0;
      for (const run of cluster) {
        if (run.dir === 'h') maxH = Math.max(maxH, run.cells.length);
        if (run.dir === 'v') maxV = Math.max(maxV, run.cells.length);
        for (const cl of run.cells) {
          const k = `${cl.r},${cl.c}`;
          if (!seen.has(k)) {
            seen.add(k);
            uniqueCells.push(cl);
          }
        }
      }
      let spawnPower = null;
      if (maxH >= 5 || maxV >= 5) spawnPower = 'rainbow';
      else if (maxH >= 3 && maxV >= 3) spawnPower = 'bomb';
      else if (maxH === 4) spawnPower = 'rocket_v';
      else if (maxV === 4) spawnPower = 'rocket_h';

      groups.push({ tile: allRuns[i].tile, cells: uniqueCells, spawnPower });
    }

    return groups;
  }

  function hasAnyValidMove() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = grid[r][c];
        if (!canSwapCell(a)) continue;
        if (a.power) return true;
        const dirs = [
          [0, 1],
          [1, 0]
        ];
        for (const [dr, dc] of dirs) {
          const b = grid[r + dr]?.[c + dc];
          if (!canSwapCell(b)) continue;
          if (b.power) return true;
          if (a.seal || b.seal) return true;
          // Simulasi swap cepat
          const tmpT = a.tile;
          a.tile = b.tile;
          b.tile = tmpT;
          const ok = findMatchGroups().length > 0;
          b.tile = a.tile;
          a.tile = tmpT;
          if (ok) return true;
        }
      }
    }
    return false;
  }

  function shuffleBoard(showMessage = true) {
    const movable = [];
    const tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        if (cell.active && cell.crate === 0 && !cell.chain && cell.ice === 0 && !cell.power && cell.tile) {
          movable.push(cell);
          tiles.push(cell.tile);
        }
      }
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      movable.forEach((cell, idx) => (cell.tile = tiles[idx]));
      if (findMatchGroups().length === 0 && hasAnyValidMove()) break;
    }
    if (showMessage) {
      statusMsg = 'Papan diacak ulang untuk membuka langkah baru.';
    }
  }

  function damageAdjacentCrates(r, c, hitSet) {
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
    for (const [dr, dc] of dirs) {
      const nb = grid[r + dr]?.[c + dc];
      if (!nb || !nb.active || nb.crate <= 0) continue;
      const key = `${nb.r},${nb.c}`;
      if (hitSet.has(key)) continue;
      hitSet.add(key);
      nb.crate -= 1;
      blastFlashCells.add(key);
      if (nb.crate <= 0) {
        nb.crate = 0;
        decrementGoal('obstacle', 'crate', 1);
      }
    }
  }

  function clearCellByBlast(r, c, triggeredPowers, visitedBlast) {
    const cell = grid[r]?.[c];
    if (!cell || !cell.active) return;
    const key = `${r},${c}`;
    if (visitedBlast.has(key)) return;
    visitedBlast.add(key);
    blastFlashCells.add(key);

    if (cell.crate > 0) {
      cell.crate -= 1;
      if (cell.crate <= 0) {
        cell.crate = 0;
        decrementGoal('obstacle', 'crate', 1);
      }
      return;
    }
    if (cell.moss) {
      cell.moss = false;
      decrementGoal('obstacle', 'moss', 1);
    }
    if (cell.chain) {
      cell.chain = false;
      decrementGoal('obstacle', 'chain', 1);
      return;
    }
    if (cell.ice > 0) {
      cell.ice -= 1;
      if (cell.ice <= 0) {
        cell.ice = 0;
        decrementGoal('obstacle', 'ice', 1);
      }
      return;
    }
    if (cell.seal) {
      // Ubin tersegel tidak hancur oleh ledakan biasa agar pemain membukanya lewat soal kilat
      return;
    }
    if (cell.power) {
      const p = cell.power;
      cell.power = null;
      cell.tile = null;
      triggeredPowers.push({ r, c, power: p });
      score += 80;
      return;
    }
    if (cell.tile) {
      decrementGoal('tile', cell.tile, 1);
      cell.tile = null;
      score += 20;
    }
  }

  function detonateQueue(initialPowers) {
    const queue = [...initialPowers];
    const visitedBlast = new Set();
    let blasted = false;

    while (queue.length > 0) {
      const item = queue.shift();
      blasted = true;
      const { r, c, power } = item;

      if (power === 'rocket_h') {
        for (let cc = 0; cc < cols; cc++) clearCellByBlast(r, cc, queue, visitedBlast);
      } else if (power === 'rocket_v') {
        for (let rr = 0; rr < rows; rr++) clearCellByBlast(rr, c, queue, visitedBlast);
      } else if (power === 'bomb') {
        for (let rr = r - 1; rr <= r + 1; rr++) {
          for (let cc = c - 1; cc <= c + 1; cc++) {
            clearCellByBlast(rr, cc, queue, visitedBlast);
          }
        }
      } else if (power === 'mega_bomb') {
        for (let rr = r - 2; rr <= r + 2; rr++) {
          for (let cc = c - 2; cc <= c + 2; cc++) {
            clearCellByBlast(rr, cc, queue, visitedBlast);
          }
        }
      } else if (power === 'mega_cross') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let cc = 0; cc < cols; cc++) clearCellByBlast(r + dr, cc, queue, visitedBlast);
        }
        for (let dc = -1; dc <= 1; dc++) {
          for (let rr = 0; rr < rows; rr++) clearCellByBlast(rr, c + dc, queue, visitedBlast);
        }
      } else if (power === 'rainbow') {
        const targetTile = item.targetTile || findMostCommonTile();
        for (let rr = 0; rr < rows; rr++) {
          for (let cc = 0; cc < cols; cc++) {
            const cl = grid[rr][cc];
            if (cl.active && cl.crate === 0 && cl.tile === targetTile) {
              clearCellByBlast(rr, cc, queue, visitedBlast);
            }
          }
        }
      } else if (power === 'board_wipe') {
        for (let rr = 0; rr < rows; rr++) {
          for (let cc = 0; cc < cols; cc++) {
            clearCellByBlast(rr, cc, queue, visitedBlast);
          }
        }
      }
    }

    if (blasted) audio.playBlast();
  }

  function findMostCommonTile() {
    const counts = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = grid[r][c].tile;
        if (t) counts[t] = (counts[t] || 0) + 1;
      }
    }
    let best = activeTiles[0];
    let bestN = -1;
    for (const [k, v] of Object.entries(counts)) {
      if (v > bestN) {
        bestN = v;
        best = k;
      }
    }
    return best;
  }

  function applyGravityAndRefill() {
    let moved = true;
    let safety = 0;
    while (moved && safety < 24) {
      moved = false;
      safety += 1;

      // Jatuh lurus ke bawah
      for (let r = rows - 2; r >= 0; r--) {
        for (let c = 0; c < cols; c++) {
          const src = grid[r][c];
          const dst = grid[r + 1][c];
          if (!src.active || !dst.active) continue;
          if (src.crate > 0 || src.chain || src.ice > 0) continue;
          if (!src.tile && !src.power) continue;
          if (dst.crate > 0 || dst.chain || dst.ice > 0 || dst.tile || dst.power) continue;

          dst.tile = src.tile;
          dst.power = src.power;
          dst.seal = src.seal;
          src.tile = null;
          src.power = null;
          src.seal = false;
          moved = true;
        }
      }

      // Isi dari baris teratas kolom aktif
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const top = grid[r][c];
          if (!top.active) continue;
          if (top.crate > 0 || top.chain || top.ice > 0) break;
          if (!top.tile && !top.power) {
            top.tile = randomTile();
            moved = true;
          }
          break;
        }
      }

      // Geser diagonal jika ada sel kosong di bawah kotak kayu atau lubang
      if (!moved) {
        for (let r = rows - 2; r >= 0; r--) {
          for (let c = 0; c < cols; c++) {
            const src = grid[r][c];
            if (!src.active || src.crate > 0 || src.chain || src.ice > 0) continue;
            if (!src.tile && !src.power) continue;
            for (const dc of [-1, 1]) {
              const dst = grid[r + 1]?.[c + dc];
              if (!dst || !dst.active || dst.crate > 0 || dst.chain || dst.ice > 0 || dst.tile || dst.power) continue;
              dst.tile = src.tile;
              dst.power = src.power;
              dst.seal = src.seal;
              src.tile = null;
              src.power = null;
              src.seal = false;
              moved = true;
              break;
            }
          }
        }
      }
    }

    // Pastikan tidak ada sel aktif kosong yang terjebak terisolasi di bawah kotak
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cl = grid[r][c];
        if (cl.active && cl.crate === 0 && !cl.tile && !cl.power) {
          cl.tile = randomTile();
        }
      }
    }
  }

  async function resolveCascades(preferredSpawnCell = null) {
    combo = 0;
    while (true) {
      const groups = findMatchGroups();
      if (groups.length === 0) break;
      combo += 1;
      if (combo > (save.bestCombo || 0)) save.bestCombo = combo;
      audio.playMatch(combo);

      const triggeredPowers = [];
      const crateHits = new Set();
      const spawns = [];

      for (const grp of groups) {
        let spawnTarget = null;
        if (grp.spawnPower) {
          spawnTarget =
            (preferredSpawnCell && grp.cells.find((x) => x.r === preferredSpawnCell.r && x.c === preferredSpawnCell.c)) ||
            grp.cells[Math.floor(grp.cells.length / 2)];
          spawns.push({ r: spawnTarget.r, c: spawnTarget.c, power: grp.spawnPower, tile: grp.tile });
        }

        for (const cl of grp.cells) {
          const key = `${cl.r},${cl.c}`;
          blastFlashCells.add(key);
          damageAdjacentCrates(cl.r, cl.c, crateHits);

          if (cl.moss) {
            cl.moss = false;
            decrementGoal('obstacle', 'moss', 1);
          }
          if (cl.chain) {
            cl.chain = false;
            decrementGoal('obstacle', 'chain', 1);
            continue;
          }
          if (cl.ice > 0) {
            cl.ice -= 1;
            if (cl.ice <= 0) {
              cl.ice = 0;
              decrementGoal('obstacle', 'ice', 1);
            }
            continue;
          }
          if (cl.power) {
            triggeredPowers.push({ r: cl.r, c: cl.c, power: cl.power });
            cl.power = null;
          }
          if (cl.tile) {
            decrementGoal('tile', cl.tile, 1);
            cl.tile = null;
            score += 25 * combo;
          }
        }
      }

      for (const sp of spawns) {
        const cl = grid[sp.r][sp.c];
        cl.power = sp.power;
        cl.tile = sp.power === 'rainbow' ? null : sp.tile;
      }

      if (triggeredPowers.length > 0) {
        detonateQueue(triggeredPowers);
      }

      preferredSpawnCell = null;
      render();
      await sleep(220);
      blastFlashCells.clear();
      applyGravityAndRefill();
      render();
      await sleep(170);
    }

    if (combo >= 2) {
      statusMsg = `Kombo ${combo}x beruntun.`;
    }
    checkEndState();
  }

  function checkEndState() {
    if (allGoalsCleared()) {
      finished = 'win';
      const leftoverBonus = movesLeft * 15;
      score += leftoverBonus;
      audio.playVictory();
      render();
      return;
    }
    if (movesLeft <= 0) {
      if (!rescueUsed) {
        finished = 'rescue';
      } else {
        finished = 'lose';
      }
      audio.playWrong();
      render();
      return;
    }
    if (!hasAnyValidMove()) {
      shuffleBoard(true);
      render();
    }
  }

  function openMicroQuest({ title, onPass, onFail }) {
    const q = buildMicroQuest(cfg.level);
    activeQuest = {
      title,
      quest: q,
      onPass,
      onFail,
      feedback: null
    };
    audio.playDialogueOpen();
    render();
  }

  async function executeSwap(a, b) {
    if (busy || finished || activeQuest) return;
    if (!isAdjacent(a, b)) return;

    // Jika salah satu ubin adalah Ubin Tersegel, picu 1 Micro-Quest terlebih dahulu!
    const sealedCell = a.seal ? a : b.seal ? b : null;
    if (sealedCell) {
      openMicroQuest({
        title: 'Buka Segel Ilmu',
        onPass: async () => {
          sealedCell.seal = false;
          decrementGoal('obstacle', 'seal', 1);
          blastFlashCells.add(`${sealedCell.r},${sealedCell.c}`);
          statusMsg = 'Segel ilmu terbuka.';
          await performVerifiedSwap(a, b, true);
        },
        onFail: () => {
          movesLeft = Math.max(0, movesLeft - 1);
          statusMsg = 'Segel tetap terkunci (-1 langkah).';
          checkEndState();
          render();
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
        render();
      }
      return;
    }

    busy = true;
    selected = null;
    audio.playSwap();

    // Cek Power-Up + Power-Up Combo atau Rainbow + Fruit!
    const pA = a.power;
    const pB = b.power;
    if (pA || pB) {
      const bothPower = Boolean(pA && pB);
      const rainbowAndTile = (pA === 'rainbow' && b.tile) || (pB === 'rainbow' && a.tile);

      if (bothPower || rainbowAndTile) {
        movesLeft = Math.max(0, movesLeft - 1);
        const triggers = [];
        if (pA === 'rainbow' && pB === 'rainbow') {
          a.power = null;
          b.power = null;
          triggers.push({ r: b.r, c: b.c, power: 'board_wipe' });
          statusMsg = 'Kombo Ganda Pelangi menyapu seluruh papan.';
        } else if (pA === 'rainbow' || pB === 'rainbow') {
          const rb = pA === 'rainbow' ? a : b;
          const other = rb === a ? b : a;
          const targetTile = other.tile || findMostCommonTile();
          rb.power = null;
          if (other.power) {
            const pKind = other.power;
            other.power = null;
            for (let rr = 0; rr < rows; rr++) {
              for (let cc = 0; cc < cols; cc++) {
                const cl = grid[rr][cc];
                if (cl.active && cl.crate === 0 && cl.tile === targetTile && !cl.seal) {
                  triggers.push({ r: rr, c: cc, power: pKind });
                }
              }
            }
            statusMsg = 'Kombo Pelangi + Power-Up meledak berantai.';
          } else {
            triggers.push({ r: rb.r, c: rb.c, power: 'rainbow', targetTile });
            statusMsg = 'Bola Pelangi membersihkan satu jenis buah.';
          }
        } else if (pA === 'bomb' && pB === 'bomb') {
          a.power = null;
          b.power = null;
          triggers.push({ r: b.r, c: b.c, power: 'mega_bomb' });
          statusMsg = 'Ledakan Mega Bom 5x5.';
        } else if (pA === 'bomb' || pB === 'bomb') {
          a.power = null;
          b.power = null;
          triggers.push({ r: b.r, c: b.c, power: 'mega_cross' });
          statusMsg = 'Kombo Bom + Roket membuka 3 baris dan 3 kolom.';
        } else {
          a.power = null;
          b.power = null;
          triggers.push({ r: b.r, c: b.c, power: 'rocket_h' }, { r: b.r, c: b.c, power: 'rocket_v' });
          statusMsg = 'Kombo Silang Roket menyapu baris dan kolom.';
        }

        detonateQueue(triggers);
        render();
        await sleep(240);
        blastFlashCells.clear();
        applyGravityAndRefill();
        render();
        await sleep(170);
        await resolveCascades(null);
        busy = false;
        return;
      }
    }

    // Tukar ubin normal
    const tmpT = a.tile;
    const tmpP = a.power;
    a.tile = b.tile;
    a.power = b.power;
    b.tile = tmpT;
    b.power = tmpP;

    const groups = findMatchGroups();
    if (groups.length === 0) {
      // Kembalikan bila tidak membentuk match-3
      b.tile = a.tile;
      b.power = a.power;
      a.tile = tmpT;
      a.power = tmpP;
      if (!sealJustBroken) {
        audio.playWrong();
        statusMsg = 'Geseran itu belum membentuk 3 ubin sejenis.';
      }
      busy = false;
      checkEndState();
      render();
      return;
    }

    movesLeft = Math.max(0, movesLeft - 1);
    await resolveCascades(b);
    busy = false;
  }

  async function activateSinglePower(cell) {
    if (busy || finished || activeQuest || !cell.power) return;
    if (cell.power === 'rainbow') return;
    busy = true;
    selected = null;
    movesLeft = Math.max(0, movesLeft - 1);
    const p = cell.power;
    cell.power = null;
    cell.tile = null;
    detonateQueue([{ r: cell.r, c: cell.c, power: p }]);
    render();
    await sleep(230);
    blastFlashCells.clear();
    applyGravityAndRefill();
    render();
    await sleep(170);
    await resolveCascades(null);
    busy = false;
  }

  async function applyBoosterAtCell(cell) {
    if (!activeBooster || busy || !cell.active) return;
    const tool = activeBooster;
    activeBooster = null;
    busy = true;

    const trigger = () => {
      if (tool === 'shovel') {
        const q = [];
        const vis = new Set();
        if (cell.seal) {
          cell.seal = false;
          decrementGoal('obstacle', 'seal', 1);
        } else {
          clearCellByBlast(cell.r, cell.c, q, vis);
          if (q.length) detonateQueue(q);
        }
        audio.playRuneBreak();
        statusMsg = 'Sekop membersihkan satu ubin tanpa mengurangi langkah.';
      } else if (tool === 'bomb') {
        detonateQueue([{ r: cell.r, c: cell.c, power: 'bomb' }]);
        statusMsg = 'Bom Cepat meledakkan area 3x3.';
      }
    };

    trigger();
    render();
    await sleep(220);
    blastFlashCells.clear();
    applyGravityAndRefill();
    render();
    await sleep(170);
    await resolveCascades(null);
    busy = false;
  }

  function requestBooster(kind) {
    if (busy || finished || activeQuest) return;
    if (activeBooster === kind) {
      activeBooster = null;
      render();
      return;
    }

    const useIt = () => {
      if (kind === 'shuffle') {
        shuffleBoard(true);
        audio.playSwap();
        render();
      } else {
        activeBooster = kind;
        statusMsg = kind === 'shovel' ? 'Pilih 1 ubin untuk dihancurkan Sekop.' : 'Pilih pusat area 3x3 untuk Bom Cepat.';
        render();
      }
    };

    if ((save.boosters?.[kind] || 0) > 0) {
      save.boosters[kind] -= 1;
      persistGardenSave(save);
      useIt();
      return;
    }

    // Jika stok 0: tawarkan 1 Soal Kilat gratis (1x per level) atau Koin (45 Koin)
    if (!freeBoosterQuestUsed) {
      openMicroQuest({
        title: `Aktifkan Booster (${kind === 'shovel' ? 'Sekop' : kind === 'bomb' ? 'Bom' : 'Acak'})`,
        onPass: () => {
          freeBoosterQuestUsed = true;
          useIt();
        },
        onFail: () => {
          statusMsg = 'Soal belum tepat; booster belum aktif.';
          render();
        }
      });
    } else if (save.coins >= 45) {
      save.coins -= 45;
      persistGardenSave(save);
      useIt();
    } else {
      audio.playWrong();
      statusMsg = 'Stok booster habis (butuh 45 Koin).';
      render();
    }
  }

  function handleCellClick(r, c) {
    if (busy || finished || activeQuest) return;
    const cell = grid[r]?.[c];
    if (!cell || !cell.active) return;

    if (activeBooster) {
      applyBoosterAtCell(cell);
      return;
    }

    // Klik langsung Ubin Tersegel untuk membukanya lewat 1 soal kilat!
    if (cell.seal && !selected) {
      openMicroQuest({
        title: 'Buka Segel Ilmu',
        onPass: () => {
          cell.seal = false;
          decrementGoal('obstacle', 'seal', 1);
          blastFlashCells.add(`${cell.r},${cell.c}`);
          audio.playRuneBreak();
          statusMsg = 'Segel ilmu terbuka.';
          checkEndState();
          render();
          setTimeout(() => {
            blastFlashCells.clear();
            render();
          }, 260);
        },
        onFail: () => {
          movesLeft = Math.max(0, movesLeft - 1);
          statusMsg = 'Segel tetap terkunci (-1 langkah).';
          checkEndState();
          render();
        }
      });
      return;
    }

    if (!canSwapCell(cell)) {
      audio.playWrong();
      return;
    }

    if (!selected) {
      selected = { r, c };
      render();
      return;
    }

    if (selected.r === r && selected.c === c) {
      if (cell.power && cell.power !== 'rainbow') {
        activateSinglePower(cell);
      } else {
        selected = null;
        render();
      }
      return;
    }

    const prev = grid[selected.r][selected.c];
    if (isAdjacent(prev, cell)) {
      executeSwap(prev, cell);
    } else {
      selected = { r, c };
      render();
    }
  }

  function render() {
    const diffClass =
      cfg.difficulty === 'Sangat Sulit' ? 'super' : cfg.difficulty === 'Sulit' ? 'hard' : 'normal';

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="puzzle-shell">
          <!-- Top Bar: Level, Difficulty, Goals, Moves -->
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
                  <div class="goal-chip ${g.left <= 0 ? 'done' : ''}">
                    <span class="goal-ico">${renderGoalIconSVG(g)}</span>
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

          <!-- Board Grid -->
          <div class="puzzle-board-wrap">
            <div class="puzzle-board" id="puzzle-board" style="grid-template-columns: repeat(${cols}, 1fr);">
              ${grid
                .flatMap((row) =>
                  row.map((cell) => {
                    if (!cell.active) return `<div class="pz-cell hole"></div>`;
                    const isSel = selected && selected.r === cell.r && selected.c === cell.c;
                    const isFlash = blastFlashCells.has(`${cell.r},${cell.c}`);
                    const classes = [
                      'pz-cell',
                      cell.moss ? 'has-moss' : '',
                      cell.ice > 0 ? `has-ice ice-${cell.ice}` : '',
                      cell.chain ? 'has-chain' : '',
                      cell.seal ? 'has-seal' : '',
                      isSel ? 'selected' : '',
                      isFlash ? 'flash' : '',
                      activeBooster ? 'booster-target' : ''
                    ]
                      .filter(Boolean)
                      .join(' ');

                    let inner = '';
                    if (cell.crate > 0) {
                      inner = `<div class="obs-crate crate-${cell.crate}">${cell.crate === 2 ? '<span>2</span>' : ''}</div>`;
                    } else {
                      inner = renderTileSVG(cell.tile, cell.power);
                    }
                    const sealBadge = cell.seal ? `<div class="obs-seal" title="Segel Ilmu: klik atau geser untuk 1 soal kilat">?</div>` : '';
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

          <!-- Bottom Status + Boosters -->
          <div class="puzzle-footer">
            <div class="puzzle-status">${escapeHtml(statusMsg)}</div>
            <div class="booster-row">
              <button class="booster-btn ${activeBooster === 'shovel' ? 'active' : ''}" id="btn-bst-shovel" type="button" title="Hancurkan 1 ubin tanpa kurangi langkah">
                <strong>Sekop</strong>
                <span>${save.boosters?.shovel > 0 ? save.boosters.shovel : freeBoosterQuestUsed ? '45 Koin' : '1 Soal'}</span>
              </button>
              <button class="booster-btn ${activeBooster === 'bomb' ? 'active' : ''}" id="btn-bst-bomb" type="button" title="Ledakkan area 3x3 tanpa kurangi langkah">
                <strong>Bom 3x3</strong>
                <span>${save.boosters?.bomb > 0 ? save.boosters.bomb : freeBoosterQuestUsed ? '45 Koin' : '1 Soal'}</span>
              </button>
              <button class="booster-btn" id="btn-bst-shuffle" type="button" title="Acak ulang seluruh ubin">
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

    // Bind events
    document.getElementById('btn-pz-quit')?.addEventListener('click', () => {
      audio.playClick();
      if (onClose) onClose();
    });

    document.getElementById('btn-bst-shovel')?.addEventListener('click', () => requestBooster('shovel'));
    document.getElementById('btn-bst-bomb')?.addEventListener('click', () => requestBooster('bomb'));
    document.getElementById('btn-bst-shuffle')?.addEventListener('click', () => requestBooster('shuffle'));

    // Click & Swipe on board cells
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
        if (Math.hypot(dx, dy) < 18) return;
        swipeStart.handled = true;
        const dr = Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? 1 : -1) : 0;
        const dc = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 1 : -1) : 0;
        const a = grid[swipeStart.r]?.[swipeStart.c];
        const b = grid[swipeStart.r + dr]?.[swipeStart.c + dc];
        if (a && b && b.active) {
          executeSwap(a, b);
        }
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

    // Micro-Quest bindings
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
          render();
        });
      });
      document.getElementById('btn-mq-continue')?.addEventListener('click', () => {
        const qa = activeQuest;
        activeQuest = null;
        if (qa.feedback && qa.feedback.ok) {
          qa.onPass();
        } else {
          qa.onFail();
        }
      });
    }

    // Result / Rescue bindings
    if (finished === 'rescue') {
      document.getElementById('btn-rescue-quest')?.addEventListener('click', () => {
        finished = false;
        openMicroQuest({
          title: 'Penyelamat +5 Langkah',
          onPass: () => {
            rescueUsed = true;
            movesLeft += 5;
            statusMsg = '+5 Langkah tambahan terbuka.';
            render();
          },
          onFail: () => {
            rescueUsed = true;
            finished = 'lose';
            render();
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
        statusMsg = '+5 Langkah dibeli dengan 60 Koin.';
        render();
      });
      document.getElementById('btn-rescue-giveup')?.addEventListener('click', () => {
        rescueUsed = true;
        finished = 'lose';
        render();
      });
    } else if (finished === 'win') {
      document.getElementById('btn-pz-win')?.addEventListener('click', () => {
        audio.playClick();
        if (onWin) {
          onWin({
            level: cfg.level,
            stars: cfg.starReward,
            coins: cfg.coinReward + Math.round(movesLeft * 4),
            score
          });
        }
      });
    } else if (finished === 'lose') {
      document.getElementById('btn-pz-lose')?.addEventListener('click', () => {
        audio.playClick();
        if (onLose) onLose();
      });
    }
  }

  function renderQuestSheet() {
    const q = activeQuest.quest;
    const fb = activeQuest.feedback;
    return `
      <div class="pz-sheet-backdrop">
        <div class="pz-sheet">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
            <span class="title-kicker" style="margin:0;">${escapeHtml(activeQuest.title)} · ${escapeHtml(q.topic)}</span>
            ${
              q.audioText
                ? `<button class="speak-btn" id="btn-mq-audio" type="button">Dengar Suara</button>`
                : ''
            }
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
              <button class="rpg-btn gold" id="btn-mq-continue" type="button" style="padding:8px 18px; font-size:0.84rem;">Lanjut ke Papan</button>
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
            <div class="title-kicker">LANGKAH HABIS</div>
            <h3 style="margin:0 0 8px; font-family:var(--font-display); font-size:1.35rem;">Tambah +5 Langkah?</h3>
            <p style="margin:0 0 14px; font-size:0.86rem; color:var(--muted);">
              Selesaikan 1 soal kilat atau pakai 60 Koin untuk melanjutkan level ini tanpa kehilangan nyawa.
            </p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">
              <button class="rpg-btn gold" id="btn-rescue-quest" type="button" style="padding:9px 16px; font-size:0.84rem;">1 Soal Kilat (+5 Langkah)</button>
              <button class="rpg-btn primary" id="btn-rescue-coin" type="button" style="padding:9px 16px; font-size:0.84rem;" ${save.coins >= 60 ? '' : 'disabled'}>60 Koin (+5 Langkah)</button>
              <button class="rpg-btn ghost" id="btn-rescue-giveup" type="button" style="padding:9px 14px; font-size:0.82rem;">Menyerah (-1 ♥)</button>
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
            <p style="margin:0 0 14px; font-size:0.92rem; color:var(--gold); font-weight:700;">
              +${cfg.starReward} Bintang Renovasi (★) · +${totalCoins} Koin · Skor ${score}
            </p>
            <button class="rpg-btn gold" id="btn-pz-win" type="button">Kembali ke Taman 3D</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="pz-sheet-backdrop">
        <div class="pz-sheet" style="text-align:center;">
          <div class="stamp-banner rejected" style="margin:0 0 8px;">BELUM TUNTAS</div>
          <p style="margin:0 0 14px; font-size:0.86rem; color:var(--muted);">
            -1 Nyawa (♥). Kamu bisa langsung mencoba lagi atau isi ulang nyawa lewat 1 soal kilat di taman.
          </p>
          <button class="rpg-btn primary" id="btn-pz-lose" type="button">Kembali ke Taman</button>
        </div>
      </div>
    `;
  }

  initBoard();
  render();
}
