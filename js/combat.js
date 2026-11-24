// Sistem Tempur RPG Attack & Defense Dunia Siber (Turn-Based Tactical Battle)
// Pemain mengatur HP, Perisai Zero-Trust (Defense), Energi, Serangan, Jurus Siber, dan Counter Taktis!

import { renderEnemySVG } from './data/enemies.js';
import { renderCharacterSVG } from './characters.js';
import { getCharacterClass } from './data/registration.js';
import { audio } from './audio.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function launchCyberCombat({ overlayRoot, save, enemy, onVictory, onDefeat, onFlee }) {
  const cls = getCharacterClass(save.characterClass);
  const playerMaxHp = 100 + (save.level - 1) * 10;

  const battle = {
    playerHp: playerMaxHp,
    playerMaxHp,
    shield: cls.id === 'alkemis' ? 14 : 8,
    energy: 1,
    maxEnergy: 3,
    enemyHp: enemy.maxHp,
    enemyMaxHp: enemy.maxHp,
    turn: 1,
    enemyIntent: 'attack', // 'attack' | 'charge' | 'stunned'
    pendingDamage: randInt(enemy.atkMin, enemy.atkMax),
    log: `${enemy.name} menghadang jalurmu! Atur SERANG, BERTAHAN (perisai), dan COUNTER saat jurus Ultimate muncul!`,
    counterMode: false,
    counterUsed: false,
    fxHero: '',
    fxEnemy: '',
    finished: false,
    won: false
  };

  function rollNextIntent() {
    // Setiap giliran ke-2 atau ke-3 musuh charge ULTIMATE agar Counter & Defense terasa taktis!
    if (!battle.counterUsed && battle.turn % 2 === 0) {
      battle.enemyIntent = 'charge';
      battle.pendingDamage = enemy.ultDamage;
    } else if (battle.turn % 3 === 0) {
      battle.enemyIntent = 'charge';
      battle.pendingDamage = enemy.ultDamage;
    } else {
      battle.enemyIntent = 'attack';
      battle.pendingDamage = randInt(enemy.atkMin, enemy.atkMax);
    }
  }

  function applyEnemyTurn() {
    if (battle.enemyHp <= 0) {
      battle.finished = true;
      battle.won = true;
      audio.playVictory();
      render();
      return;
    }

    if (battle.enemyIntent === 'stunned') {
      battle.log += ' Musuh masih lumpuh (STUN) dan gagal menyerang balik!';
      battle.turn += 1;
      battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
      rollNextIntent();
      render();
      return;
    }

    const rawDmg = battle.pendingDamage;
    const absorbed = Math.min(battle.shield, rawDmg);
    const hpLoss = rawDmg - absorbed;
    battle.shield = Math.max(0, battle.shield - absorbed);
    battle.playerHp = Math.max(0, battle.playerHp - hpLoss);
    battle.fxHero = 'hit';

    if (absorbed > 0 && hpLoss === 0) {
      audio.playRuneBreak();
      battle.log += ` Perisaimu menahan penuh ${absorbed} DMG dari ${enemy.name}!`;
    } else if (absorbed > 0) {
      audio.playWrong();
      battle.log += ` ${enemy.name} menyerang ${rawDmg} DMG (Perisai serap ${absorbed}, HP -${hpLoss}).`;
    } else {
      audio.playWrong();
      battle.log += ` ${enemy.name} menghantam sebesar ${rawDmg} DMG!`;
    }

    if (battle.playerHp <= 0) {
      battle.finished = true;
      battle.won = false;
      render();
      return;
    }

    battle.turn += 1;
    battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
    rollNextIntent();
    render();
  }

  function doAttack() {
    if (battle.finished || battle.counterMode) return;
    battle.fxHero = '';
    battle.fxEnemy = 'hit';
    const base = randInt(19, 26) + Math.floor(save.level * 1.5);
    const critChance = cls.id === 'detektif' ? 0.35 : 0.18;
    const isCrit = Math.random() < critChance;
    const dmg = isCrit ? Math.round(base * 1.45) : base;

    battle.enemyHp = Math.max(0, battle.enemyHp - dmg);
    audio.playCorrect();
    battle.log = isCrit
      ? `SERANGAN KRITIKAL! Patch Strike menembus ${enemy.name} sebesar ${dmg} DMG!`
      : `Kamu melancarkan Patch Strike (${dmg} DMG) ke ${enemy.name}!`;
    applyEnemyTurn();
  }

  function doDefend() {
    if (battle.finished || battle.counterMode) return;
    battle.fxHero = 'shield';
    battle.fxEnemy = '';
    const shieldGain = cls.id === 'alkemis' ? 32 : 26;
    const healGain = 12;
    battle.shield = Math.min(65, battle.shield + shieldGain);
    battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + healGain);
    battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
    audio.playWaypoint();
    battle.log = `PERTAHANAN ZERO-TRUST! Perisai +${shieldGain}, HP +${healGain}, Energi +1!`;
    applyEnemyTurn();
  }

  function doCyberSkill() {
    if (battle.finished || battle.counterMode || battle.energy < 2) return;
    battle.energy -= 2;
    battle.fxHero = '';
    battle.fxEnemy = 'hit';
    const dmg = randInt(44, 54) + save.level * 2;
    battle.enemyHp = Math.max(0, battle.enemyHp - dmg);
    audio.playGateUnlock();
    battle.log = `JURUS SIBER: ML-KEM QUANTUM BLAST menghajar ${enemy.name} sebesar ${dmg} DMG!`;
    applyEnemyTurn();
  }

  function openCounterChoice() {
    if (battle.finished || battle.enemyIntent !== 'charge') return;
    audio.playDialogueOpen();
    battle.counterMode = true;
    render();
  }

  function resolveCounter(optIdx) {
    const opt = enemy.counterQ.options[optIdx];
    battle.counterMode = false;
    battle.counterUsed = true;

    if (opt && opt.ok) {
      const dmg = 46 + save.level * 2;
      battle.enemyHp = Math.max(0, battle.enemyHp - dmg);
      battle.enemyIntent = 'stunned';
      battle.shield = Math.min(65, battle.shield + 15);
      battle.fxEnemy = 'hit';
      battle.fxHero = 'shield';
      audio.playGateUnlock();
      battle.log = `COUNTER SIBER SEMPURNA! "${enemy.ultName}" dibatalkan total! ${enemy.name} kena ${dmg} DMG balik + STUN! (${enemy.counterQ.explain})`;
      applyEnemyTurn();
    } else {
      battle.log = `Counter meleset! (${enemy.counterQ.explain})`;
      applyEnemyTurn();
    }
  }

  function render() {
    const pPct = Math.round((battle.playerHp / battle.playerMaxHp) * 100);
    const ePct = Math.round((battle.enemyHp / battle.enemyMaxHp) * 100);
    const energyPips = [0, 1, 2]
      .map((i) => `<span class="energy-pip ${i < battle.energy ? 'full' : ''}"></span>`)
      .join('');

    const intentBadge =
      battle.enemyIntent === 'charge'
        ? `<div class="intent-pill danger">PERINGATAN ULTIMATE: ${escapeHtml(enemy.ultName)} (${battle.pendingDamage} DMG)! Pakai COUNTER atau BERTAHAN!</div>`
        : `<div class="intent-pill">Niat Musuh: Serangan Siber (${battle.pendingDamage} DMG)</div>`;

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="combat-arena">
          <div class="combat-top-bar">
            <div>
              <div class="title-kicker" style="margin:0;">ARENA TEMPUR SIBER · GILIRAN ${battle.turn}</div>
              <h2 style="margin:2px 0 0; font-family:var(--font-display); font-size:1.45rem; color:var(--paper);">
                ${escapeHtml(enemy.name)} <span style="font-size:0.82rem; color:var(--cyan); font-weight:700;">(${escapeHtml(enemy.title)})</span>
              </h2>
            </div>
            ${
              !battle.finished
                ? `<button class="rpg-btn ghost" id="btn-combat-flee" type="button" style="padding:7px 14px; font-size:0.8rem;">Mundur</button>`
                : ''
            }
          </div>

          <div class="combat-stage">
            <!-- Hero Side -->
            <div class="combatant ${battle.fxHero}">
              <div class="combat-portrait">${renderCharacterSVG(cls.portraitKey, battle.fxHero === 'hit' ? 'shock' : 'happy')}</div>
              <div class="combat-name">@${escapeHtml(save.username || save.playerName)}</div>
              <div class="combat-bar-label"><span>HP</span><span>${battle.playerHp}/${battle.playerMaxHp}</span></div>
              <div class="combat-bar"><div class="combat-bar-fill hero" style="width:${pPct}%"></div></div>
              <div class="combat-sub-stats">
                <span class="shield-chip">Perisai: ${battle.shield}</span>
                <span class="energy-chip">Energi: ${energyPips}</span>
              </div>
            </div>

            <div class="combat-vs">VS</div>

            <!-- Enemy Side -->
            <div class="combatant ${battle.fxEnemy}">
              <div class="combat-portrait">${renderEnemySVG(enemy.id)}</div>
              <div class="combat-name" style="color:#ff8a8a;">${escapeHtml(enemy.name)}</div>
              <div class="combat-bar-label"><span>HP Musuh</span><span>${battle.enemyHp}/${battle.enemyMaxHp}</span></div>
              <div class="combat-bar"><div class="combat-bar-fill enemy" style="width:${ePct}%"></div></div>
              ${!battle.finished ? intentBadge : ''}
            </div>
          </div>

          <div class="combat-log">${escapeHtml(battle.log)}</div>

          ${
            battle.finished
              ? renderFinishedPanel()
              : battle.counterMode
              ? renderCounterPanel()
              : renderActionPanel()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-combat-flee')?.addEventListener('click', () => {
      audio.playClick();
      if (onFlee) onFlee();
    });

    if (battle.finished) {
      document.getElementById('btn-combat-done')?.addEventListener('click', () => {
        audio.playClick();
        if (battle.won && onVictory) onVictory();
        else if (!battle.won && onDefeat) onDefeat();
      });
    } else if (battle.counterMode) {
      document.querySelectorAll('[data-cnt-idx]').forEach((btn) => {
        btn.addEventListener('click', () => resolveCounter(Number(btn.dataset.cntIdx)));
      });
    } else {
      document.getElementById('btn-act-attack')?.addEventListener('click', doAttack);
      document.getElementById('btn-act-defend')?.addEventListener('click', doDefend);
      document.getElementById('btn-act-skill')?.addEventListener('click', doCyberSkill);
      document.getElementById('btn-act-counter')?.addEventListener('click', openCounterChoice);
    }
  }

  function renderActionPanel() {
    const canSkill = battle.energy >= 2;
    const canCounter = battle.enemyIntent === 'charge';
    return `
      <div class="combat-actions">
        <button class="combat-btn atk" id="btn-act-attack" type="button">
          <strong>SERANG (Attack)</strong>
          <span>Patch Strike · 19 sampai 26 DMG</span>
        </button>
        <button class="combat-btn def" id="btn-act-defend" type="button">
          <strong>BERTAHAN (Defense)</strong>
          <span>Perisai +${cls.id === 'alkemis' ? 32 : 26} · HP +12 · +1 Energi</span>
        </button>
        <button class="combat-btn skill" id="btn-act-skill" type="button" ${canSkill ? '' : 'disabled'}>
          <strong>JURUS SIBER (2 Energi)</strong>
          <span>${canSkill ? 'Quantum Blast · 44 sampai 54 DMG!' : 'Butuh 2 Energi (pakai Bertahan!)'}</span>
        </button>
        <button class="combat-btn counter ${canCounter ? 'pulse-glow' : ''}" id="btn-act-counter" type="button" ${canCounter ? '' : 'disabled'}>
          <strong>COUNTER TAKTIS</strong>
          <span>${canCounter ? 'PATAHKAN ULTIMATE MUSUH!' : 'Tersedia saat musuh charge Ultimate'}</span>
        </button>
      </div>
    `;
  }

  function renderCounterPanel() {
    return `
      <div class="insight-box" style="margin-top:0;">
        <p style="margin-bottom:10px;"><strong>COUNTER SIBER!</strong> ${escapeHtml(enemy.counterQ.prompt)}</p>
        <div class="choice-grid">
          ${enemy.counterQ.options
            .map(
              (opt, idx) => `
            <button class="rpg-choice" data-cnt-idx="${idx}" type="button">
              <span class="choice-badge">${['A', 'B', 'C'][idx]}</span>
              <span>${escapeHtml(opt.label)}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderFinishedPanel() {
    if (battle.won) {
      return `
        <div style="text-align:center; padding-top:8px;">
          <div class="stamp-banner approved" style="margin:4px 0 10px;">ANCAMAN SIBER DILUMPUHKAN!</div>
          <p style="margin:0 0 14px; font-size:0.9rem; color:var(--gold); font-weight:700;">
            Hadiah: +${enemy.xpReward} XP · +${enemy.coinReward} Koin Kopi · Intel Siber Tersimpan di Codex!
          </p>
          <button class="rpg-btn gold" id="btn-combat-done" type="button">Ambil Hadiah & Kembali ke Peta</button>
        </div>
      `;
    }
    return `
      <div style="text-align:center; padding-top:8px;">
        <div class="stamp-banner rejected" style="margin:4px 0 10px;">PERTAHANAN JEBOL!</div>
        <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">
          Ciko menyelamatkanmu kembali ke Waypoint terdekat dengan HP penuh. Tips: pakai tombol BERTAHAN sebelum serangan Ultimate!
        </p>
        <button class="rpg-btn primary" id="btn-combat-done" type="button">Bangkit di Waypoint</button>
      </div>
    `;
  }

  render();
}
