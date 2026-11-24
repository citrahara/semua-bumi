// Sistem Tempur Taktis Berisiko Tinggi: Armor Musuh, HP Persisten, Relik Ilmu, Overdrive Berwaktu (10 dtk), dan Counter Taktis (12 dtk).

import { renderEnemySVG } from './data/enemies.js';
import { renderCharacterSVG } from './characters.js';
import { getCharacterClass } from './data/registration.js';
import { getPlayerStats, persistSave } from './storage.js';
import { FACTS_BANK } from './data/facts.js';
import { DICTION_BANK } from './data/diction.js';
import { FALLACIES_BANK } from './data/fallacies.js';
import { generateMathQuestion } from './data/math.js';
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

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOverdriveChallenge(volume = 1) {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const f = FACTS_BANK[randInt(0, FACTS_BANK.length - 1)];
    return {
      tag: 'Uji Fakta · 10 dtk',
      prompt: `"${f.statement}"`,
      options: [
        { label: 'Fakta Sahih', ok: f.isFact },
        { label: 'Mitos / Keliru', ok: !f.isFact }
      ],
      explain: f.punchline
    };
  }
  if (kind === 1) {
    const d = DICTION_BANK[randInt(0, DICTION_BANK.length - 1)];
    return {
      tag: 'Uji Diksi · 10 dtk',
      prompt: d.prompt,
      options: shuffle(d.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain: d.meaning
    };
  }
  if (kind === 2) {
    const fl = FALLACIES_BANK[randInt(0, FALLACIES_BANK.length - 1)];
    return {
      tag: 'Uji Logika · 10 dtk',
      prompt: fl.attack,
      options: shuffle(fl.options).map((o) => ({ label: o.text, ok: Boolean(o.correct) })),
      explain: fl.meaning
    };
  }
  const mq = generateMathQuestion(Math.min(5, Math.max(1, volume)), randInt(0, 2));
  return {
    tag: 'Uji Hitung · 10 dtk',
    prompt: mq.question,
    options: mq.choices.map((c) => ({ label: c.label, ok: Boolean(c.correct) })),
    explain: mq.explain
  };
}

export function launchCyberCombat({ overlayRoot, save, enemy, ambushDamage = 0, onVictory, onDefeat, onFlee }) {
  const cls = getCharacterClass(save.characterClass);
  const stats = getPlayerStats(save);
  const ambushFinal = ambushDamage > 0 ? Math.max(ambushDamage, Math.round(enemy.maxHp * 0.18)) : 0;
  const startEnemyHp = Math.max(1, enemy.maxHp - ambushFinal);
  const startHp = Math.max(1, Math.min(stats.maxHp, save.currentHp || stats.maxHp));

  let activeTimerId = null;

  const battle = {
    playerHp: startHp,
    playerMaxHp: stats.maxHp,
    shield: cls.id === 'alkemis' ? 12 : 6,
    energy: stats.startEnergy,
    maxEnergy: 3,
    enemyHp: startEnemyHp,
    enemyMaxHp: enemy.maxHp,
    enemyArmor: enemy.armor || 0,
    enemyMaxArmor: Math.max(enemy.armor || 0, 1),
    turn: 1,
    enemyIntent: 'attack', // 'attack' | 'fortify' | 'charge' | 'stunned'
    pendingDamage: randInt(enemy.atkMin, enemy.atkMax),
    log:
      ambushFinal > 0
        ? `Ambush Strike memotong ${ambushFinal} HP ${enemy.name} sebelum giliran dimulai.`
        : `${enemy.name} menghadang jalurmu. Atur serangan, perisai, dan Overdrive.`,
    mode: 'action', // 'action' | 'counter' | 'overdrive'
    challenge: null,
    timeLeft: 0,
    timeMax: 10,
    fxHero: ambushFinal > 0 ? 'lunge-atk' : '',
    fxEnemy: ambushFinal > 0 ? 'hit' : '',
    fxHeroOverlay: '',
    fxEnemyOverlay: ambushFinal > 0 ? 'slash' : '',
    floatHeroText: '',
    floatHeroTone: 'dmg',
    floatEnemyText: ambushFinal > 0 ? `AMBUSH -${ambushFinal}` : '',
    floatEnemyTone: 'crit',
    finished: false,
    won: false
  };

  function stopTimer() {
    if (activeTimerId) {
      clearInterval(activeTimerId);
      activeTimerId = null;
    }
  }

  function startChallengeTimer(seconds, onTimeout) {
    stopTimer();
    battle.timeLeft = seconds;
    battle.timeMax = seconds;
    activeTimerId = setInterval(() => {
      battle.timeLeft = Math.max(0, battle.timeLeft - 1);
      const bar = document.getElementById('combat-timer-fill');
      const txt = document.getElementById('combat-timer-txt');
      if (bar) {
        bar.style.width = `${Math.round((battle.timeLeft / battle.timeMax) * 100)}%`;
        bar.classList.toggle('urgent', battle.timeLeft <= 3);
      }
      if (txt) txt.textContent = `${battle.timeLeft} dtk`;
      if (battle.timeLeft <= 0) {
        stopTimer();
        onTimeout();
      }
    }, 1000);
  }

  function clearTurnFx() {
    battle.fxHero = '';
    battle.fxEnemy = '';
    battle.fxHeroOverlay = '';
    battle.fxEnemyOverlay = '';
    battle.floatHeroText = '';
    battle.floatEnemyText = '';
  }

  function dealDamageToEnemy(rawDmg, pierceArmor = false) {
    if (pierceArmor || battle.enemyArmor <= 0) {
      battle.enemyHp = Math.max(0, battle.enemyHp - rawDmg);
      return { hpDmg: rawDmg, armorDmg: 0 };
    }
    const armorDmg = Math.min(battle.enemyArmor, rawDmg);
    battle.enemyArmor -= armorDmg;
    const leftover = rawDmg - armorDmg;
    battle.enemyHp = Math.max(0, battle.enemyHp - leftover);
    return { hpDmg: leftover, armorDmg };
  }

  function rollNextIntent() {
    if (battle.turn % 3 === 2) {
      battle.enemyIntent = 'charge';
      battle.pendingDamage = enemy.ultDamage;
    } else if (battle.turn % 4 === 0 && (enemy.armor > 0 || (save.volume || 1) > 1)) {
      battle.enemyIntent = 'fortify';
      battle.pendingDamage = Math.round(randInt(enemy.atkMin, enemy.atkMax) * 0.7);
    } else {
      battle.enemyIntent = 'attack';
      battle.pendingDamage = randInt(enemy.atkMin, enemy.atkMax);
    }
  }

  function syncHpToSave() {
    save.currentHp = Math.max(1, battle.playerHp);
    persistSave(save);
  }

  function applyEnemyTurn() {
    stopTimer();
    if (battle.enemyHp <= 0) {
      battle.finished = true;
      battle.won = true;
      syncHpToSave();
      audio.playVictory();
      render();
      return;
    }

    if (battle.enemyIntent === 'stunned') {
      battle.log += ' Musuh lumpuh satu giliran.';
      battle.turn += 1;
      battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
      if (stats.regen > 0) battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + stats.regen);
      rollNextIntent();
      render();
      return;
    }

    if (battle.enemyIntent === 'fortify') {
      const armorAdd = 16 + (save.volume || 1) * 6;
      battle.enemyArmor += armorAdd;
      battle.enemyMaxArmor = Math.max(battle.enemyMaxArmor, battle.enemyArmor);
    }

    const reducedRaw = Math.max(4, battle.pendingDamage - stats.def);
    const absorbed = Math.min(battle.shield, reducedRaw);
    const hpLoss = reducedRaw - absorbed;
    battle.shield = Math.max(0, battle.shield - absorbed);
    battle.playerHp = Math.max(0, battle.playerHp - hpLoss);

    if (absorbed > 0 && hpLoss === 0) {
      battle.fxHero = 'shield';
      battle.fxHeroOverlay = 'shield-dome';
      battle.floatHeroText = `TANGKIS ${absorbed}`;
      battle.floatHeroTone = 'shield';
      audio.playRuneBreak();
      battle.log += ` Perisai menahan penuh ${absorbed} DMG.`;
    } else if (absorbed > 0) {
      battle.fxHero = battle.fxHero === 'lunge-atk' ? 'lunge-atk hit' : 'hit';
      battle.floatHeroText = `-${hpLoss}`;
      battle.floatHeroTone = 'dmg';
      audio.playWrong();
      battle.log += ` Terkena ${hpLoss} DMG (${absorbed} diserap perisai).`;
    } else {
      battle.fxHero = battle.fxHero === 'lunge-atk' ? 'lunge-atk hit' : 'hit';
      battle.floatHeroText = `-${hpLoss}`;
      battle.floatHeroTone = 'dmg';
      audio.playWrong();
      battle.log += ` ${enemy.name} membalas ${hpLoss} DMG.`;
    }

    if (battle.playerHp <= 0) {
      battle.finished = true;
      battle.won = false;
      save.currentHp = stats.maxHp;
      persistSave(save);
      render();
      return;
    }

    if (stats.regen > 0) {
      battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + stats.regen);
    }
    battle.turn += 1;
    battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
    rollNextIntent();
    render();
  }

  function doAttack() {
    if (battle.finished || battle.mode !== 'action') return;
    clearTurnFx();
    battle.fxHero = 'lunge-atk';
    battle.fxEnemy = 'hit';
    battle.fxEnemyOverlay = 'slash';

    const variance = randInt(-2, 4);
    const isCrit = Math.random() < stats.critChance;
    const dmg = Math.max(8, Math.round((stats.atk + variance) * (isCrit ? 1.55 : 1)));
    const { armorDmg } = dealDamageToEnemy(dmg, false);

    battle.floatEnemyText = isCrit ? `CRIT -${dmg}` : `-${dmg}`;
    battle.floatEnemyTone = isCrit ? 'crit' : 'dmg';
    audio.playStrike(isCrit);
    battle.log = isCrit
      ? `Strike Kritikal sebesar ${dmg} DMG${armorDmg > 0 ? ` (${armorDmg} mengikis armor)` : ''}.`
      : `Strike mengenai ${enemy.name} sebesar ${dmg} DMG${armorDmg > 0 ? ` (${armorDmg} ke armor)` : ''}.`;
    applyEnemyTurn();
  }

  function doDefend() {
    if (battle.finished || battle.mode !== 'action') return;
    clearTurnFx();
    battle.fxHero = 'shield';
    battle.fxHeroOverlay = 'shield-dome';
    const healGain = 8 + Math.floor(stats.def * 0.5);
    battle.shield = Math.min(95, battle.shield + stats.shieldPower);
    battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + healGain);
    battle.energy = Math.min(battle.maxEnergy, battle.energy + 1);
    battle.floatHeroText = `+${stats.shieldPower} PERISAI`;
    battle.floatHeroTone = 'shield';
    audio.playShieldUp();
    battle.log = `Perisai Zero-Trust +${stats.shieldPower}, HP +${healGain}, Energi +1.`;
    applyEnemyTurn();
  }

  function doUsePotion() {
    if (battle.finished || battle.mode !== 'action' || (save.potions || 0) <= 0) return;
    if (battle.playerHp >= battle.playerMaxHp) return;
    clearTurnFx();
    save.potions -= 1;
    const heal = Math.round(battle.playerMaxHp * 0.45);
    battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + heal);
    persistSave(save);
    battle.fxHero = 'shield';
    battle.floatHeroText = `+${heal} HP`;
    battle.floatHeroTone = 'shield';
    audio.playWaypoint();
    battle.log = `Tinta Pemulih memulihkan +${heal} HP (sisa ${save.potions}). Giliranmu masih aktif.`;
    render();
  }

  function openOverdrive() {
    if (battle.finished || battle.mode !== 'action' || battle.energy < 2) return;
    audio.playDialogueOpen();
    battle.mode = 'overdrive';
    battle.challenge = buildOverdriveChallenge(save.volume || 1);
    render();
    startChallengeTimer(10, () => resolveOverdrive(-1));
  }

  function resolveOverdrive(optIdx) {
    stopTimer();
    const ch = battle.challenge;
    const opt = optIdx >= 0 && ch ? ch.options[optIdx] : null;
    battle.mode = 'action';
    battle.challenge = null;
    battle.energy = Math.max(0, battle.energy - 2);
    clearTurnFx();

    if (opt && opt.ok) {
      const dmg = Math.round(stats.atk * 2.35 * stats.counterMult);
      dealDamageToEnemy(dmg, true); // Tembus armor!
      battle.fxHero = 'lunge-atk';
      battle.fxEnemy = 'hit';
      battle.fxEnemyOverlay = 'quantum';
      battle.floatEnemyText = `OVERDRIVE -${dmg}`;
      battle.floatEnemyTone = 'quantum';
      audio.playStrike(true);
      audio.playGateUnlock();
      battle.log = `Overdrive tembus armor (${dmg} DMG). ${ch.explain}`;
    } else {
      const dmg = Math.max(6, Math.round(stats.atk * 0.45));
      dealDamageToEnemy(dmg, false);
      battle.fxEnemy = 'hit';
      battle.floatEnemyText = `-${dmg}`;
      battle.floatEnemyTone = 'dmg';
      audio.playWrong();
      battle.log = `${optIdx < 0 ? 'Waktu habis.' : 'Jawaban keliru.'} Serangan melemah (${dmg} DMG). ${ch ? ch.explain : ''}`;
    }
    applyEnemyTurn();
  }

  function openCounterChoice() {
    if (battle.finished || battle.mode !== 'action' || battle.enemyIntent !== 'charge') return;
    audio.playDialogueOpen();
    battle.mode = 'counter';
    battle.challenge = {
      tag: 'Counter Taktis · 12 dtk',
      prompt: enemy.counterQ.prompt,
      options: shuffle(enemy.counterQ.options),
      explain: enemy.counterQ.explain
    };
    render();
    startChallengeTimer(12, () => resolveCounter(-1));
  }

  function resolveCounter(optIdx) {
    stopTimer();
    const ch = battle.challenge;
    const opt = optIdx >= 0 && ch ? ch.options[optIdx] : null;
    battle.mode = 'action';
    battle.challenge = null;
    clearTurnFx();

    if (opt && opt.ok) {
      const dmg = Math.round((stats.atk * 1.9 + 16) * stats.counterMult);
      dealDamageToEnemy(dmg, true);
      battle.enemyIntent = 'stunned';
      battle.shield = Math.min(95, battle.shield + 16);
      battle.fxEnemy = 'hit';
      battle.fxEnemyOverlay = 'counter';
      battle.fxHero = 'shield';
      battle.fxHeroOverlay = 'shield-dome';
      battle.floatEnemyText = `COUNTER -${dmg}`;
      battle.floatEnemyTone = 'crit';
      battle.floatHeroText = '+16 PERISAI';
      battle.floatHeroTone = 'shield';
      audio.playStrike(true);
      audio.playGateUnlock();
      battle.log = `Ultimate dibatalkan. Counter tembus armor ${dmg} DMG + Stun. ${ch.explain}`;
    } else {
      battle.log = `${optIdx < 0 ? 'Waktu habis.' : 'Counter gagal.'} ${ch ? ch.explain : ''}`;
    }
    applyEnemyTurn();
  }

  function render() {
    const pPct = Math.round((battle.playerHp / battle.playerMaxHp) * 100);
    const ePct = Math.round((battle.enemyHp / battle.enemyMaxHp) * 100);
    const aPct = battle.enemyArmor > 0 ? Math.min(100, Math.round((battle.enemyArmor / battle.enemyMaxArmor) * 100)) : 0;
    const energyPips = [0, 1, 2]
      .map((i) => `<span class="energy-pip ${i < battle.energy ? 'full' : ''}"></span>`)
      .join('');

    const intentBadge =
      battle.enemyIntent === 'charge'
        ? `<div class="intent-pill danger">Ultimate: ${escapeHtml(enemy.ultName)} (${battle.pendingDamage} DMG)</div>`
        : battle.enemyIntent === 'fortify'
        ? `<div class="intent-pill">Niat: Tambah Armor + Serang (${battle.pendingDamage} DMG)</div>`
        : `<div class="intent-pill">Niat: Serang (${battle.pendingDamage} DMG)</div>`;

    const enemyFxHtml =
      battle.fxEnemyOverlay === 'slash'
        ? `<div class="fx-slash-streak"></div><div class="fx-slash-streak second"></div>`
        : battle.fxEnemyOverlay === 'quantum'
        ? `<div class="fx-quantum-burst"></div>`
        : battle.fxEnemyOverlay === 'counter'
        ? `<div class="fx-counter-flash"></div><div class="fx-slash-streak"></div>`
        : '';

    const heroFxHtml = battle.fxHeroOverlay === 'shield-dome' ? `<div class="fx-shield-dome"></div>` : '';

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="combat-arena">
          <div class="combat-top-bar">
            <div>
              <div class="title-kicker" style="margin:0;">DUEL · GILIRAN ${battle.turn} · JILID ${save.volume || 1}</div>
              <h2 style="margin:2px 0 0; font-family:var(--font-display); font-size:1.35rem; color:var(--paper);">
                ${escapeHtml(enemy.name)} <span style="font-size:0.78rem; color:var(--muted); font-weight:600;">${escapeHtml(enemy.title)}</span>
              </h2>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              ${
                !battle.finished && battle.mode === 'action' && (save.potions || 0) > 0 && battle.playerHp < battle.playerMaxHp
                  ? `<button class="rpg-btn ghost" id="btn-combat-heal" type="button" style="padding:6px 12px; font-size:0.78rem; border-color:var(--ok); color:#8ce9b5;">Pulihkan (${save.potions})</button>`
                  : ''
              }
              ${
                !battle.finished
                  ? `<button class="rpg-btn ghost" id="btn-combat-flee" type="button" style="padding:6px 12px; font-size:0.78rem;">Mundur</button>`
                  : ''
              }
            </div>
          </div>

          <div class="combat-stage">
            <div class="combatant ${battle.fxHero}">
              <div class="combat-portrait-wrap">
                <div class="combat-portrait">${renderCharacterSVG(cls.portraitKey, battle.fxHero.includes('hit') ? 'shock' : 'idle')}</div>
                ${heroFxHtml}
                ${battle.floatHeroText ? `<div class="dmg-float ${battle.floatHeroTone}">${escapeHtml(battle.floatHeroText)}</div>` : ''}
              </div>
              <div class="combat-name">@${escapeHtml(save.username || save.playerName)}</div>
              <div class="combat-bar-label"><span>HP · ATK ${stats.atk} · DEF ${stats.def}</span><span>${battle.playerHp}/${battle.playerMaxHp}</span></div>
              <div class="combat-bar"><div class="combat-bar-fill hero" style="width:${pPct}%"></div></div>
              <div class="combat-sub-stats">
                <span class="shield-chip">Perisai ${battle.shield}</span>
                <span class="energy-chip">Energi ${energyPips}</span>
              </div>
            </div>

            <div class="combat-vs">VS</div>

            <div class="combatant ${battle.fxEnemy}">
              <div class="combat-portrait-wrap">
                <div class="combat-portrait">${renderEnemySVG(enemy.id)}</div>
                ${enemyFxHtml}
                ${battle.floatEnemyText ? `<div class="dmg-float ${battle.floatEnemyTone}">${escapeHtml(battle.floatEnemyText)}</div>` : ''}
              </div>
              <div class="combat-name" style="color:#e58a8a;">${escapeHtml(enemy.name)}</div>
              <div class="combat-bar-label"><span>HP</span><span>${battle.enemyHp}/${battle.enemyMaxHp}</span></div>
              <div class="combat-bar"><div class="combat-bar-fill enemy" style="width:${ePct}%"></div></div>
              ${
                battle.enemyArmor > 0
                  ? `<div class="combat-bar-label" style="margin-top:6px;"><span>Armor</span><span>${battle.enemyArmor}</span></div>
                     <div class="combat-bar" style="height:6px;"><div class="combat-bar-fill" style="width:${aPct}%; background:var(--cyan);"></div></div>`
                  : ''
              }
              ${!battle.finished ? intentBadge : ''}
            </div>
          </div>

          <div class="combat-log">${escapeHtml(battle.log)}</div>

          ${
            battle.finished
              ? renderFinishedPanel()
              : battle.mode === 'counter' || battle.mode === 'overdrive'
              ? renderTimedChallengePanel()
              : renderActionPanel()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-combat-flee')?.addEventListener('click', () => {
      stopTimer();
      syncHpToSave();
      audio.playClick();
      if (onFlee) onFlee();
    });
    document.getElementById('btn-combat-heal')?.addEventListener('click', doUsePotion);

    if (battle.finished) {
      document.getElementById('btn-combat-done')?.addEventListener('click', () => {
        stopTimer();
        audio.playClick();
        if (battle.won && onVictory) onVictory();
        else if (!battle.won && onDefeat) onDefeat();
      });
    } else if (battle.mode === 'counter') {
      document.querySelectorAll('[data-ch-idx]').forEach((btn) => {
        btn.addEventListener('click', () => resolveCounter(Number(btn.dataset.chIdx)));
      });
    } else if (battle.mode === 'overdrive') {
      document.querySelectorAll('[data-ch-idx]').forEach((btn) => {
        btn.addEventListener('click', () => resolveOverdrive(Number(btn.dataset.chIdx)));
      });
    } else {
      document.getElementById('btn-act-attack')?.addEventListener('click', doAttack);
      document.getElementById('btn-act-defend')?.addEventListener('click', doDefend);
      document.getElementById('btn-act-skill')?.addEventListener('click', openOverdrive);
      document.getElementById('btn-act-counter')?.addEventListener('click', openCounterChoice);
    }
  }

  function renderActionPanel() {
    const canOverdrive = battle.energy >= 2;
    const canCounter = battle.enemyIntent === 'charge';
    return `
      <div class="combat-actions">
        <button class="combat-btn atk" id="btn-act-attack" type="button">
          <strong>SERANG</strong>
          <span>Strike ${stats.atk} DMG · Kritikal ${Math.round(stats.critChance * 100)}%</span>
        </button>
        <button class="combat-btn def" id="btn-act-defend" type="button">
          <strong>BERTAHAN</strong>
          <span>Perisai +${stats.shieldPower} · +1 Energi</span>
        </button>
        <button class="combat-btn skill" id="btn-act-skill" type="button" ${canOverdrive ? '' : 'disabled'}>
          <strong>OVERDRIVE (2 Energi)</strong>
          <span>${canOverdrive ? 'Jawab 10 dtk -> Tembus Armor 2.3x DMG' : 'Butuh 2 Energi'}</span>
        </button>
        <button class="combat-btn counter ${canCounter ? 'pulse-glow' : ''}" id="btn-act-counter" type="button" ${canCounter ? '' : 'disabled'}>
          <strong>COUNTER TAKTIS</strong>
          <span>${canCounter ? 'Batalkan Ultimate + Stun (12 dtk)' : 'Aktif saat musuh mengisi Ultimate'}</span>
        </button>
      </div>
    `;
  }

  function renderTimedChallengePanel() {
    const ch = battle.challenge;
    const pct = Math.round((battle.timeLeft / Math.max(1, battle.timeMax)) * 100);
    return `
      <div class="insight-box" style="margin-top:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="color:var(--gold); font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em;">${escapeHtml(ch.tag)}</strong>
          <span id="combat-timer-txt" style="font-weight:800; color:var(--gold); font-size:0.86rem;">${battle.timeLeft} dtk</span>
        </div>
        <div class="exam-timer-track" style="margin-bottom:10px;">
          <div class="exam-timer-fill ${battle.timeLeft <= 3 ? 'urgent' : ''}" id="combat-timer-fill" style="width:${pct}%"></div>
        </div>
        <p style="margin-bottom:10px;">${escapeHtml(ch.prompt)}</p>
        <div class="choice-grid">
          ${ch.options
            .map(
              (opt, idx) => `
            <button class="rpg-choice" data-ch-idx="${idx}" type="button">
              <span class="choice-badge">${['A', 'B', 'C', 'D'][idx]}</span>
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
        <div style="text-align:center; padding-top:6px;">
          <div class="stamp-banner approved" style="margin:4px 0 8px;">MENANG</div>
          <p style="margin:0 0 12px; font-size:0.88rem; color:var(--gold); font-weight:700;">
            +${enemy.xpReward} XP · +${enemy.coinReward} Koin · Sisa HP ${battle.playerHp}/${battle.playerMaxHp}
          </p>
          <button class="rpg-btn gold" id="btn-combat-done" type="button">Lanjut Jelajah</button>
        </div>
      `;
    }
    return `
      <div style="text-align:center; padding-top:6px;">
        <div class="stamp-banner rejected" style="margin:4px 0 8px;">KALAH</div>
        <p style="margin:0 0 12px; font-size:0.88rem; color:var(--muted);">
          Kamu mundur ke Penanda Bab dengan HP penuh. Perkuat atribut di menu Tempa atau kumpulkan Relik Ilmu sebelum mencoba lagi.
        </p>
        <button class="rpg-btn primary" id="btn-combat-done" type="button">Kembali ke Penanda Bab</button>
      </div>
    `;
  }

  render();
}
