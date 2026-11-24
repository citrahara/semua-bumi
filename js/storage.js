// Auto-save progres petualangan RPG Warkop Impact di localStorage.

const SAVE_KEY = 'warkop_impact_rpg_v1';

export function createFreshSave(playerName = 'Petualang') {
  return {
    playerName,
    x: 340,
    y: 410,
    facing: 'down',
    xp: 0,
    coins: 0,
    level: 1, // Adventure Rank / Level
    solvedGates: [],
    talkedNpcs: [],
    completedNpcs: [],
    openedChests: [],
    unlockedWaypoints: ['wp-1'],
    codexIds: [],
    mathSolvedCount: 0,
    stageCompletions: 0,
    muted: false,
    started: false
  };
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createFreshSave();
    const parsed = JSON.parse(raw);
    return {
      ...createFreshSave(),
      ...parsed,
      solvedGates: Array.isArray(parsed.solvedGates) ? parsed.solvedGates : [],
      talkedNpcs: Array.isArray(parsed.talkedNpcs) ? parsed.talkedNpcs : [],
      completedNpcs: Array.isArray(parsed.completedNpcs) ? parsed.completedNpcs : [],
      openedChests: Array.isArray(parsed.openedChests) ? parsed.openedChests : [],
      unlockedWaypoints: Array.isArray(parsed.unlockedWaypoints) ? parsed.unlockedWaypoints : ['wp-1'],
      codexIds: Array.isArray(parsed.codexIds) ? parsed.codexIds : []
    };
  } catch {
    return createFreshSave();
  }
}

export function persistSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Abaikan jika penyimpanan dibatasi
  }
}

export function resetSave(playerName = 'Petualang') {
  const fresh = createFreshSave(playerName);
  fresh.started = true;
  persistSave(fresh);
  return fresh;
}

export function xpNeededForLevel(level) {
  return 100 + (level - 1) * 60;
}

export function grantRewards(save, { xp = 0, coins = 0, codexId = null }) {
  let leveledUp = false;
  save.xp += xp;
  save.coins += coins;
  if (codexId && !save.codexIds.includes(codexId)) {
    save.codexIds.push(codexId);
  }
  while (save.xp >= xpNeededForLevel(save.level)) {
    save.xp -= xpNeededForLevel(save.level);
    save.level += 1;
    leveledUp = true;
  }
  persistSave(save);
  return leveledUp;
}
