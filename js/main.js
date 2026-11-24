// Meja Malam: Ruang Baca & Kedai Teh Malam 3D, Teman Ngobrol AI Live (BYOK),
// Deduksi Berkas Taktil (ala Golden Idol + Strange Horticulture + Coffee Talk), dan 8 Dekor 3D Berbeda Struktur.

import {
  TEA_INGREDIENTS,
  evaluateTeaBlend,
  REFERENCE_BOOKS,
  SALON_UPGRADES,
  getEveningCase,
  getReferenceContent
} from './salon_data.js';
import { SalonWorld3D } from './salon3d.js';
import {
  AI_PROVIDERS,
  loadAiConfig,
  saveAiConfig,
  hasLiveAiKey,
  askArka,
  generateLiveAiCase,
  maybeRecordMemory
} from './ai_companion.js';
import {
  createFreshSalonAccount,
  listSalonAccounts,
  getActiveSalonAccount,
  registerSalonAccount,
  switchSalonAccount,
  persistSalonSave,
  resetSalonAccount
} from './salon_storage.js';
import { SUGGESTED_USERNAMES, validateUsername, buildRegistrationExam } from './data/registration.js';
import { speakPhrase } from './academy_ui.js';
import { audio } from './audio.js';

// DOM Refs
const worldCanvas = document.getElementById('world-canvas');
const hudLayer = document.getElementById('hud-layer');
const titleOverlay = document.getElementById('title-overlay');
const authCardRoot = document.getElementById('auth-card-root');
const overlayRoot = document.getElementById('overlay-root');
const toastEl = document.getElementById('toast');

const hudInitial = document.getElementById('hud-initial');
const hudNight = document.getElementById('hud-night');
const hudTokens = document.getElementById('hud-tokens');
const hudDecorCount = document.getElementById('hud-decor-count');
const hudTeaDot = document.getElementById('hud-tea-dot');
const hudTeaName = document.getElementById('hud-tea-name');
const hudAiDot = document.getElementById('hud-ai-dot');
const hudAiLabel = document.getElementById('hud-ai-label');

const btnToggleRain = document.getElementById('btn-toggle-rain');
const btnToggleSound = document.getElementById('btn-toggle-sound');
const caseBtnTitle = document.getElementById('case-btn-title');
const caseBtnSub = document.getElementById('case-btn-sub');
const decorBtnSub = document.getElementById('decor-btn-sub');

const zoneBanner = document.getElementById('zone-banner');
const zoneBannerSub = document.getElementById('zone-banner-sub');
const zoneBannerName = document.getElementById('zone-banner-name');

const arkaPanel = document.getElementById('arka-panel');
const arkaModeTag = document.getElementById('arka-mode-tag');
const arkaMessages = document.getElementById('arka-messages');
const arkaStarters = document.getElementById('arka-starters');
const arkaForm = document.getElementById('arka-form');
const arkaInput = document.getElementById('arka-input');
const arkaSendBtn = document.getElementById('arka-send-btn');
const btnReopenChat = document.getElementById('btn-reopen-chat');

// Core State
let save = getActiveSalonAccount() || createFreshSalonAccount('tamu');
audio.setMuted(save.muted);

const salon = new SalonWorld3D(worldCanvas);
window.addEventListener('resize', () => salon.resize());

let activeCase = null;
let caseState = {
  markedIds: new Set(),
  filledSlots: [],
  activeSlotIdx: 0,
  teaMatched: false,
  bookMatched: false,
  offeredBookId: null,
  solved: false,
  refBookId: 'book_lit',
  feedback: ''
};

let modalOpen = false;
let previewOpen = false;
let arkaBusy = false;

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
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

let bannerTimer = null;
function showBanner(sub, title) {
  zoneBannerSub.textContent = sub;
  zoneBannerName.textContent = title;
  zoneBanner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => zoneBanner.classList.remove('show'), 2500);
}

function closeOverlay() {
  if (previewOpen) {
    previewOpen = false;
    salon.clearPreview(save.upgrades || {});
    document.querySelector('.salon-dock-left')?.classList.remove('hidden');
    if (arkaPanel.classList.contains('hidden') && btnReopenChat.classList.contains('hidden')) {
      arkaPanel.classList.remove('hidden');
    }
  }
  modalOpen = false;
  overlayRoot.innerHTML = '';
  refreshHud();
}

function loadNightCase(customCase = null) {
  activeCase = customCase || getEveningCase(save.night || 1);
  const alreadySolved = (save.solvedCaseIds || []).includes(activeCase.id);
  const slotLen = activeCase.dossier.deduction.slots.length;
  caseState = {
    markedIds: new Set(alreadySolved ? activeCase.dossier.requiredFlaws : []),
    filledSlots: alreadySolved
      ? activeCase.dossier.deduction.slots.map((s) => s.answer)
      : Array(slotLen).fill(''),
    activeSlotIdx: 0,
    teaMatched: false,
    bookMatched: false,
    offeredBookId: null,
    solved: alreadySolved,
    refBookId: activeCase.visitor.desiredBookId || 'book_lit',
    feedback: ''
  };
  const coatPalette = ['#6B3A3E', '#3A4E6B', '#3E5A4C', '#6B523A', '#563D63'];
  salon.setVisitor(true, coatPalette[(save.night || 1) % coatPalette.length]);
}

function getInstalledDecorCount() {
  return SALON_UPGRADES.filter((u) => typeof save.upgrades?.[u.id] === 'number').length;
}

function refreshHud() {
  const initial = (save.username || 'M').charAt(0).toUpperCase();
  hudInitial.textContent = initial;
  hudNight.textContent = `Malam ${save.night || 1}`;
  hudTokens.textContent = String(save.tokens || 0);
  const doneDecor = getInstalledDecorCount();
  hudDecorCount.textContent = `${doneDecor}/${SALON_UPGRADES.length}`;
  decorBtnSub.textContent = `${doneDecor}/${SALON_UPGRADES.length} terpasang`;

  const tea = save.currentTea || { name: 'Teh Melati Murni', color: '#C7AE62' };
  hudTeaName.textContent = tea.name;
  hudTeaDot.style.background = tea.color;
  salon.setTeaColor(tea.color);

  btnToggleSound.textContent = save.muted ? 'Mati' : 'Suara';
  btnToggleRain.textContent = save.rainOn ? 'Hujan: On' : 'Hujan: Off';
  btnToggleRain.classList.toggle('active-chip', Boolean(save.rainOn));

  const live = hasLiveAiKey();
  hudAiDot.classList.toggle('live', live);
  hudAiLabel.textContent = live ? 'AI Live' : 'Koneksi AI';
  arkaModeTag.textContent = live ? 'AI Live aktif' : 'Mode Lokal · Pasang API';
  arkaModeTag.classList.toggle('live', live);

  if (activeCase) {
    caseBtnTitle.textContent = caseState.solved ? `Malam ${save.night} Tuntas` : `Berkas Malam ${save.night}`;
    caseBtnSub.textContent = `${activeCase.visitor.name} · ${activeCase.dossier.title}`;
  }

  salon.syncUpgrades(save.upgrades || {});
}

// ==========================================
// PANEL OBROLAN TERBUKA DENGAN ARKA
// ==========================================
function pushChatMessage(role, text, speakerLabel = null) {
  if (!Array.isArray(save.chatHistory)) save.chatHistory = [];
  save.chatHistory.push({ role, text, speakerLabel, ts: Date.now() });
  if (save.chatHistory.length > 42) save.chatHistory = save.chatHistory.slice(-42);
  persistSalonSave(save);
  renderChatPanel();
}

function renderChatPanel() {
  const list = save.chatHistory || [];
  arkaMessages.innerHTML =
    list
      .map((m) => {
        if (m.role === 'user') {
          return `<div class="chat-bubble user"><p>${escapeHtml(m.text)}</p></div>`;
        }
        if (m.role === 'visitor') {
          return `<div class="chat-bubble visitor"><small>${escapeHtml(m.speakerLabel || 'Tamu')}</small><p>${escapeHtml(m.text)}</p></div>`;
        }
        return `<div class="chat-bubble arka"><small>Arka</small><p>${escapeHtml(m.text)}</p></div>`;
      })
      .join('') +
    (arkaBusy ? `<div class="chat-bubble arka typing"><small>Arka</small><p>Sedang mengetik...</p></div>` : '');

  arkaMessages.scrollTop = arkaMessages.scrollHeight;

  const starters = caseState.solved
    ? ['Lanjut ke malam berikutnya?', 'Bagaimana pendapatmu soal kasus tadi?', 'Rekomendasikan bacaan malam ini']
    : ['Menurutmu apa yang janggal di berkas ini?', 'Aku lagi butuh teman cerita hari ini', 'Bahas satu gagasan Orwell atau siber'];

  arkaStarters.innerHTML = starters
    .map((s) => `<button class="starter-chip" data-say-arka="${escapeHtml(s)}" type="button">${escapeHtml(s)}</button>`)
    .join('');

  arkaStarters.querySelectorAll('[data-say-arka]').forEach((b) => {
    b.addEventListener('click', () => sendMessageToArka(b.dataset.sayArka));
  });
}

async function sendMessageToArka(rawText) {
  const text = (rawText || '').trim();
  if (!text || arkaBusy) return;
  arkaInput.value = '';
  audio.playClick();

  maybeRecordMemory(save, text);
  pushChatMessage('user', text);

  arkaBusy = true;
  arkaSendBtn.disabled = true;
  renderChatPanel();

  const res = await askArka({
    message: text,
    save,
    activeCase,
    teaBlend: save.currentTea
  });

  arkaBusy = false;
  arkaSendBtn.disabled = false;
  salon.triggerArkaTalk(2.6);
  audio.playDialogueOpen();
  pushChatMessage('arka', res.reply);
}

arkaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessageToArka(arkaInput.value);
});

document.getElementById('btn-toggle-chat')?.addEventListener('click', () => {
  arkaPanel.classList.add('hidden');
  btnReopenChat.classList.remove('hidden');
});

btnReopenChat.addEventListener('click', () => {
  arkaPanel.classList.remove('hidden');
  btnReopenChat.classList.add('hidden');
});

// ==========================================
// BAKI SEDUH TEH (ALA COFFEE TALK)
// ==========================================
function openTeaModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playClick();

  let picked = [];

  function renderTea() {
    const preview = picked.length > 0 ? evaluateTeaBlend(picked) : null;
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:520px;">
          <div class="panel-head" style="margin-bottom:10px;">
            <h2>Baki Seduh Teh</h2>
            <button class="rpg-btn ghost" id="btn-tea-close" type="button" style="padding:6px 12px; font-size:0.78rem;">Tutup</button>
          </div>
          <p style="margin:0 0 12px; font-size:0.84rem; color:var(--muted);">
            Pilih 3 bahan untuk meracik teh hangat di meja.${activeCase ? ` Tamu malam ini (${escapeHtml(activeCase.visitor.name)}) sedang menginginkan nuansa ${escapeHtml(activeCase.visitor.desiredTeaTag)}.` : ''}
          </p>

          <div class="tea-cup-preview">
            <div class="tea-cup-circle" style="background:${preview ? preview.color : '#2b241f'};">
              <span>${picked.length}/3</span>
            </div>
            <div>
              <strong style="display:block; color:var(--paper); font-size:0.96rem;">${preview ? escapeHtml(preview.name) : 'Pilih bahan di bawah'}</strong>
              <span style="font-size:0.78rem; color:var(--muted);">${preview ? escapeHtml(preview.vibe) : 'Kombinasi menentukan rasa dan reaksi tamu.'}</span>
            </div>
          </div>

          <div class="tea-grid">
            ${TEA_INGREDIENTS.map(
              (ing) => `
              <button class="tea-ing-btn" data-ing="${ing.id}" type="button" ${picked.length >= 3 ? 'disabled' : ''}>
                <span class="tea-ing-dot" style="background:${ing.color};"></span>
                <div>
                  <strong>${escapeHtml(ing.name)}</strong>
                  <small>${escapeHtml(ing.note)}</small>
                </div>
              </button>
            `
            ).join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:14px;">
            <button class="rpg-btn ghost" id="btn-tea-clear" type="button" style="padding:8px 14px; font-size:0.8rem;">Ulangi</button>
            <button class="rpg-btn gold" id="btn-tea-serve" type="button" ${picked.length < 3 ? 'disabled style="opacity:0.5;"' : ''}>Seduh & Sajikan</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-tea-close')?.addEventListener('click', closeOverlay);
    document.getElementById('btn-tea-clear')?.addEventListener('click', () => {
      picked = [];
      renderTea();
    });
    document.querySelectorAll('[data-ing]').forEach((b) => {
      b.addEventListener('click', () => {
        if (picked.length >= 3) return;
        audio.playClick();
        picked.push(b.dataset.ing);
        renderTea();
      });
    });
    document.getElementById('btn-tea-serve')?.addEventListener('click', () => {
      if (picked.length < 3) return;
      const blend = evaluateTeaBlend(picked);
      save.currentTea = blend;
      persistSalonSave(save);
      audio.playTeaPour();
      salon.setTeaColor(blend.color);

      if (activeCase && blend.tags.includes(activeCase.visitor.desiredTeaTag)) {
        caseState.teaMatched = true;
        pushChatMessage('visitor', activeCase.visitor.teaMatchReply, activeCase.visitor.name);
        showToast(`${blend.name} cocok dengan suasana ${activeCase.visitor.name}.`);
      } else {
        showToast(`${blend.name} tersaji hangat di meja.`);
      }
      closeOverlay();
    });
  }

  renderTea();
}

// ==========================================
// MEJA DEDUKSI BERKAS (GOLDEN IDOL + STRANGE HORTICULTURE, ZERO A/B/C/D!)
// ==========================================
function openCaseDeskModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playDialogueOpen();

  let refQuery = '';
  let aiTopicInput = '';
  let generatingCase = false;

  function renderDesk() {
    const c = activeCase;
    const d = c.dossier;
    const refItems = getReferenceContent(caseState.refBookId).filter((it) => {
      const q = refQuery.trim().toLowerCase();
      if (!q) return true;
      return `${it.head} ${it.sub} ${it.body}`.toLowerCase().includes(q);
    });

    const foundFlawClues = d.segments.filter((s) => s.flawed && caseState.markedIds.has(s.id));

    // Rakit kalimat kesimpulan dengan slot klik-isi ala Golden Idol
    const ded = d.deduction;
    let sentenceHtml = '';
    for (let i = 0; i < ded.template.length; i++) {
      sentenceHtml += `<span>${escapeHtml(ded.template[i])}</span>`;
      if (i < ded.slots.length) {
        const val = caseState.filledSlots[i] || '';
        const isActive = caseState.activeSlotIdx === i && !caseState.solved;
        sentenceHtml += `<button class="ded-slot ${val ? 'filled' : ''} ${isActive ? 'active' : ''}" data-slot-idx="${i}" type="button" ${caseState.solved ? 'disabled' : ''}>${escapeHtml(val || ded.slots[i].label)}</button>`;
      }
    }

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="desk-modal">
          <div class="desk-head">
            <div>
              <h2>Malam ${save.night} · ${escapeHtml(d.title)}</h2>
              <span class="desk-sub">${escapeHtml(c.visitor.name)} (${escapeHtml(c.visitor.role)}) · ${escapeHtml(d.docType)}</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              ${
                caseState.solved
                  ? `<button class="rpg-btn gold" id="btn-next-night" type="button" style="padding:7px 14px; font-size:0.8rem;">Malam Berikutnya</button>`
                  : ''
              }
              <button class="rpg-btn ghost" id="btn-desk-close" type="button" style="padding:7px 13px; font-size:0.8rem;">Tutup</button>
            </div>
          </div>

          <div class="desk-split">
            <!-- KIRI: Tamu, Dokumen Interaktif (Tandai Kejanggalan), dan Kesimpulan -->
            <div class="desk-left">
              <div class="visitor-strip">
                <p>"${escapeHtml(c.visitor.opening)}"</p>
                <div class="visitor-actions">
                  <button class="mini-pill-btn ${caseState.teaMatched ? 'ok' : ''}" id="btn-desk-tea" type="button">
                    ${caseState.teaMatched ? 'Teh Cocok ✓' : 'Racik Teh'}
                  </button>
                  <select class="mini-book-select" id="sel-offer-book" aria-label="Sodorkan buku referensi">
                    <option value="">Sodorkan buku ke tamu...</option>
                    ${REFERENCE_BOOKS.map(
                      (b) => `<option value="${b.id}" ${caseState.offeredBookId === b.id ? 'selected' : ''}>${escapeHtml(b.title)}</option>`
                    ).join('')}
                  </select>
                </div>
                ${
                  caseState.bookMatched
                    ? `<div class="bonus-clue">Petunjuk terbuka: ${escapeHtml(c.visitor.bookMatchReply)}</div>`
                    : ''
                }
              </div>

              <div class="parchment-doc">
                <div class="doc-top-bar">
                  <strong>${escapeHtml(d.title)}</strong>
                  ${
                    d.audioText
                      ? `<button class="speak-btn" id="btn-doc-audio" type="button">Dengar Suara</button>`
                      : `<span>${caseState.markedIds.size} ditandai</span>`
                  }
                </div>
                <p class="doc-hint">${escapeHtml(d.hint)}</p>
                <div class="doc-clauses">
                  ${d.segments
                    .map((seg) => {
                      const marked = caseState.markedIds.has(seg.id);
                      return `<button class="doc-clause ${marked ? 'marked' : ''} ${caseState.solved && seg.flawed ? 'verified' : ''}" data-seg-id="${seg.id}" type="button" ${caseState.solved ? 'disabled' : ''}>${escapeHtml(seg.text)}</button>`;
                    })
                    .join('')}
                </div>
                ${
                  foundFlawClues.length > 0
                    ? `<div class="margin-notes">
                        ${foundFlawClues.map((s) => `<div>Catatan: ${escapeHtml(s.clue)}</div>`).join('')}
                      </div>`
                    : ''
                }
              </div>

              <div class="deduction-box">
                <div class="ded-sentence">${sentenceHtml}</div>
                <div class="ded-chips">
                  ${ded.chips
                    .map((chip) => {
                      const used = caseState.filledSlots.includes(chip);
                      return `<button class="ded-chip ${used ? 'used' : ''}" data-chip="${escapeHtml(chip)}" type="button" ${caseState.solved ? 'disabled' : ''}>${escapeHtml(chip)}</button>`;
                    })
                    .join('')}
                </div>
                ${caseState.feedback ? `<div class="ded-feedback ${caseState.solved ? 'ok' : ''}">${escapeHtml(caseState.feedback)}</div>` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:10px;">
                  <button class="rpg-btn ghost" id="btn-ded-clear" type="button" style="padding:7px 12px; font-size:0.78rem;" ${caseState.solved ? 'disabled' : ''}>Bersihkan</button>
                  ${
                    caseState.solved
                      ? `<button class="rpg-btn gold" id="btn-ded-discuss" type="button" style="padding:8px 16px; font-size:0.82rem;">Bahas Bareng Arka</button>`
                      : `<button class="rpg-btn gold" id="btn-ded-submit" type="button" style="padding:8px 18px; font-size:0.84rem;">Sampaikan Analisis</button>`
                  }
                </div>
              </div>
            </div>

            <!-- KANAN: Rak Buku Referensi Langsung + Buat Berkas AI Topik Bebas -->
            <div class="desk-right">
              <div class="ref-tabs">
                ${REFERENCE_BOOKS.map(
                  (b) => `<button class="filter-chip ${caseState.refBookId === b.id ? 'active' : ''}" data-ref-book="${b.id}" type="button">${escapeHtml(b.title.split(' ')[0])}</button>`
                ).join('')}
              </div>
              <input class="rpg-input" id="ref-search" type="search" placeholder="Cari di rak referensi..." value="${escapeHtml(refQuery)}" style="padding:7px 11px; font-size:0.8rem; margin-bottom:8px;" />
              <div class="ref-list">
                ${refItems
                  .map(
                    (it) => `
                  <div class="ref-item">
                    <div style="display:flex; justify-content:space-between; gap:8px; align-items:center;">
                      <strong>${escapeHtml(it.head)}</strong>
                      ${it.speak ? `<button class="speak-btn" data-say-ref="${escapeHtml(it.speak)}" data-lang="${it.lang || 'ko-KR'}" type="button">Suara</button>` : `<small>${escapeHtml(it.sub)}</small>`}
                    </div>
                    <p>${escapeHtml(it.body)}</p>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <div class="ai-case-box">
                <span style="font-size:0.74rem; color:var(--muted);">Buat berkas deduksi dari topik bebas (AI Live):</span>
                <div style="display:flex; gap:6px; margin-top:6px;">
                  <input class="rpg-input" id="ai-case-topic" type="text" placeholder="misal: deepfake, Orwell, Korea..." value="${escapeHtml(aiTopicInput)}" style="padding:7px 10px; font-size:0.8rem;" />
                  <button class="rpg-btn ghost" id="btn-gen-ai-case" type="button" style="padding:7px 11px; font-size:0.78rem; white-space:nowrap;" ${generatingCase ? 'disabled' : ''}>
                    ${generatingCase ? 'Merakit...' : 'Buat'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-desk-close')?.addEventListener('click', closeOverlay);
    document.getElementById('btn-desk-tea')?.addEventListener('click', () => {
      closeOverlay();
      openTeaModal();
    });
    document.getElementById('btn-doc-audio')?.addEventListener('click', () => {
      speakPhrase(d.audioText, d.audioLang || 'ko-KR');
    });

    document.getElementById('sel-offer-book')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      caseState.offeredBookId = val;
      caseState.refBookId = val;
      if (val === c.visitor.desiredBookId) {
        caseState.bookMatched = true;
        audio.playCorrect();
        pushChatMessage('visitor', c.visitor.bookMatchReply, c.visitor.name);
      } else {
        audio.playClick();
        showToast('Tamu melihat sekilas buku itu, tapi tampaknya ia mencari referensi lain.');
      }
      renderDesk();
    });

    document.querySelectorAll('[data-seg-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.segId;
        if (caseState.markedIds.has(id)) caseState.markedIds.delete(id);
        else caseState.markedIds.add(id);
        audio.playMark();
        caseState.feedback = '';
        renderDesk();
      });
    });

    document.querySelectorAll('[data-slot-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.slotIdx);
        if (caseState.filledSlots[idx]) {
          caseState.filledSlots[idx] = '';
        }
        caseState.activeSlotIdx = idx;
        audio.playClick();
        renderDesk();
      });
    });

    document.querySelectorAll('[data-chip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.chip;
        let target = caseState.activeSlotIdx;
        if (caseState.filledSlots[target]) {
          const empty = caseState.filledSlots.findIndex((x) => !x);
          if (empty >= 0) target = empty;
        }
        caseState.filledSlots[target] = val;
        const nextEmpty = caseState.filledSlots.findIndex((x) => !x);
        if (nextEmpty >= 0) caseState.activeSlotIdx = nextEmpty;
        audio.playClick();
        caseState.feedback = '';
        renderDesk();
      });
    });

    document.getElementById('btn-ded-clear')?.addEventListener('click', () => {
      caseState.markedIds.clear();
      caseState.filledSlots = Array(ded.slots.length).fill('');
      caseState.activeSlotIdx = 0;
      caseState.feedback = '';
      renderDesk();
    });

    document.getElementById('btn-ded-submit')?.addEventListener('click', () => {
      const reqFlaws = d.requiredFlaws || [];
      const hasAllFlaws = reqFlaws.every((id) => caseState.markedIds.has(id));
      const noExtraFlaws = [...caseState.markedIds].every((id) => reqFlaws.includes(id));
      const slotsExact = ded.slots.every((s, idx) => caseState.filledSlots[idx] === s.answer);

      if (!hasAllFlaws || !noExtraFlaws) {
        audio.playWrong();
        caseState.feedback = `Periksa ulang tanda pada dokumen: ada ${reqFlawCountText(reqFlaws.length)} bagian kunci yang perlu ditandai tepat.`;
        renderDesk();
        return;
      }
      if (!slotsExact) {
        audio.playWrong();
        caseState.feedback = 'Tanda pada dokumen sudah tepat, tetapi susunan kesimpulan masih ada yang keliru. Cek rak referensi di kanan.';
        renderDesk();
        return;
      }

      // Berhasil!
      caseState.solved = true;
      caseState.feedback = 'Analisis tepat. +1 Token Dekor 3D (★) diterima.';
      audio.playVictory();
      if (!save.solvedCaseIds.includes(c.id)) {
        save.solvedCaseIds.push(c.id);
        save.tokens = (save.tokens || 0) + 1;
        persistSalonSave(save);
      }
      salon.triggerArkaTalk(3.2);
      pushChatMessage('arka', c.arkaDebrief);
      refreshHud();
      renderDesk();
    });

    document.getElementById('btn-ded-discuss')?.addEventListener('click', () => {
      closeOverlay();
      arkaPanel.classList.remove('hidden');
      btnReopenChat.classList.add('hidden');
      arkaInput.focus();
    });

    document.getElementById('btn-next-night')?.addEventListener('click', () => {
      save.night = (save.night || 1) + 1;
      persistSalonSave(save);
      loadNightCase();
      refreshHud();
      pushChatMessage('visitor', activeCase.visitor.opening, activeCase.visitor.name);
      showBanner(`MALAM ${save.night}`, `${activeCase.visitor.name} tiba di kedai`);
      renderDesk();
    });

    document.querySelectorAll('[data-ref-book]').forEach((b) => {
      b.addEventListener('click', () => {
        caseState.refBookId = b.dataset.refBook;
        audio.playClick();
        renderDesk();
      });
    });

    document.getElementById('ref-search')?.addEventListener('input', (e) => {
      refQuery = e.target.value;
      renderDesk();
      const el = document.getElementById('ref-search');
      if (el) {
        el.focus();
        el.setSelectionRange(refQuery.length, refQuery.length);
      }
    });

    document.querySelectorAll('[data-say-ref]').forEach((b) => {
      b.addEventListener('click', () => speakPhrase(b.dataset.sayRef, b.dataset.lang || 'ko-KR'));
    });

    document.getElementById('ai-case-topic')?.addEventListener('input', (e) => {
      aiTopicInput = e.target.value;
    });

    document.getElementById('btn-gen-ai-case')?.addEventListener('click', async () => {
      const topic = aiTopicInput.trim();
      if (!topic) {
        showToast('Tulis topik yang ingin dibedah lebih dulu.');
        return;
      }
      if (!hasLiveAiKey()) {
        closeOverlay();
        openAiSettingsModal();
        showToast('Pasang API Key dulu untuk membuat berkas topik bebas.');
        return;
      }
      generatingCase = true;
      renderDesk();
      try {
        const custom = await generateLiveAiCase(topic, save);
        generatingCase = false;
        aiTopicInput = '';
        loadNightCase(custom);
        refreshHud();
        pushChatMessage('visitor', custom.visitor.opening, custom.visitor.name);
        renderDesk();
      } catch (err) {
        generatingCase = false;
        showToast(err.message || 'Gagal merakit berkas AI.');
        renderDesk();
      }
    });
  }

  renderDesk();
}

function reqFlawCountText(n) {
  return n === 1 ? '1' : String(n);
}

// ==========================================
// RAK BUKU REFERENSI MANDIRI
// ==========================================
function openBooksModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playClick();
  let curBook = REFERENCE_BOOKS[0].id;
  let q = '';

  function renderBooks() {
    const items = getReferenceContent(curBook).filter((it) => {
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return `${it.head} ${it.sub} ${it.body}`.toLowerCase().includes(t);
    });

    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal" style="max-width:720px;">
          <div class="panel-head">
            <h2>Rak Buku Referensi</h2>
            <button class="rpg-btn ghost" id="btn-bk-close" type="button" style="padding:7px 14px; font-size:0.8rem;">Tutup</button>
          </div>
          <div class="codex-bar" style="margin-bottom:10px;">
            ${REFERENCE_BOOKS.map(
              (b) => `<button class="filter-chip ${curBook === b.id ? 'active' : ''}" data-bk="${b.id}" type="button">${escapeHtml(b.title)}</button>`
            ).join('')}
            <input class="rpg-input" id="bk-search" type="search" placeholder="Cari catatan..." value="${escapeHtml(q)}" style="max-width:200px; padding:6px 10px; font-size:0.8rem;" />
          </div>
          <div class="codex-list">
            ${items
              .map(
                (it) => `
              <div class="codex-item">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <h4>${escapeHtml(it.head)}</h4>
                  ${it.speak ? `<button class="speak-btn" data-bk-say="${escapeHtml(it.speak)}" data-lang="${it.lang || 'ko-KR'}" type="button">Suara</button>` : `<small style="color:var(--gold);">${escapeHtml(it.sub)}</small>`}
                </div>
                <p>${escapeHtml(it.body)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-bk-close')?.addEventListener('click', closeOverlay);
    document.querySelectorAll('[data-bk]').forEach((b) => {
      b.addEventListener('click', () => {
        curBook = b.dataset.bk;
        audio.playClick();
        renderBooks();
      });
    });
    document.getElementById('bk-search')?.addEventListener('input', (e) => {
      q = e.target.value;
      renderBooks();
      const el = document.getElementById('bk-search');
      if (el) {
        el.focus();
        el.setSelectionRange(q.length, q.length);
      }
    });
    document.querySelectorAll('[data-bk-say]').forEach((b) => {
      b.addEventListener('click', () => speakPhrase(b.dataset.bkSay, b.dataset.lang || 'ko-KR'));
    });
  }

  renderBooks();
}

// ==========================================
// DEKORASI 3D BERBEDA STRUKTUR + DOCK PRATINJAU LANGSUNG
// ==========================================
function renderFormThumbSVG(form, st) {
  const c = st.color;
  const a = st.accent;
  if (form === 'banker') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="20" y="38" width="24" height="4" rx="2" fill="${a}"/><rect x="30" y="21" width="4" height="17" fill="${a}"/><polygon points="18,22 46,22 41,11 23,11" fill="${c}"/></svg>`;
  }
  if (form === 'paper_lantern') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="21" y="9" width="22" height="30" rx="2" fill="${c}" stroke="${a}" stroke-width="2.5"/><line x1="32" y1="9" x2="32" y2="39" stroke="${a}" stroke-width="1.5"/><line x1="21" y1="24" x2="43" y2="24" stroke="${a}" stroke-width="1.5"/></svg>`;
  }
  if (form === 'candelabra') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="22" y="39" width="20" height="3" rx="1.5" fill="${c}"/><path d="M32 39 L32 16 M18 28 Q32 34 46 28 M18 28 L18 19 M46 28 L46 19" stroke="${c}" stroke-width="2.5" fill="none"/><circle cx="18" cy="14" r="3" fill="${a}"/><circle cx="32" cy="11" r="3.4" fill="${a}"/><circle cx="46" cy="14" r="3" fill="${a}"/></svg>`;
  }
  if (form === 'typewriter') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="21" y="8" width="22" height="15" fill="${a}"/><rect x="13" y="22" width="38" height="16" rx="3" fill="${c}"/><rect x="18" y="28" width="28" height="6" rx="1.5" fill="${a}" opacity="0.7"/></svg>`;
  }
  if (form === 'gramophone') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="14" y="30" width="28" height="11" rx="2" fill="${c}"/><path d="M26 30 Q26 16 42 12 L50 22 Q36 22 30 30 Z" fill="${a}"/></svg>`;
  }
  if (form === 'globe') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><circle cx="32" cy="21" r="11" fill="${a}"/><path d="M22 14 A14 14 0 0 1 42 29" fill="none" stroke="${c}" stroke-width="2.4"/><rect x="24" y="37" width="16" height="4" rx="2" fill="${c}"/><line x1="32" y1="32" x2="32" y2="37" stroke="${c}" stroke-width="2.5"/></svg>`;
  }
  if (form === 'telescope') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><line x1="32" y1="24" x2="20" y2="42" stroke="${a}" stroke-width="2.5"/><line x1="32" y1="24" x2="44" y2="42" stroke="${a}" stroke-width="2.5"/><line x1="16" y1="14" x2="48" y2="26" stroke="${c}" stroke-width="6" stroke-linecap="round"/></svg>`;
  }
  if (form === 'plant_stand') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="20" y="24" width="24" height="18" rx="2" fill="${a}"/><circle cx="26" cy="18" r="7" fill="${c}"/><circle cx="38" cy="16" r="8" fill="${c}"/></svg>`;
  }
  if (form === 'grandfather_clock') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="23" y="8" width="18" height="34" rx="2" fill="${c}"/><circle cx="32" cy="17" r="5" fill="${a}"/><line x1="32" y1="25" x2="32" y2="35" stroke="${a}" stroke-width="2"/><circle cx="32" cy="36" r="2.5" fill="${a}"/></svg>`;
  }
  if (form === 'porcelain') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><ellipse cx="32" cy="28" rx="13" ry="10" fill="${c}"/><circle cx="32" cy="16" r="3" fill="${a}"/><path d="M45 25 A5 5 0 0 1 45 33" fill="none" stroke="${a}" stroke-width="2.4"/><line x1="19" y1="27" x2="12" y2="21" stroke="${c}" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  if (form === 'cast_iron') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><path d="M20 22 A12 12 0 0 1 44 22" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="18" y="22" width="28" height="16" rx="6" fill="${c}"/><circle cx="32" cy="21" r="2.6" fill="${a}"/></svg>`;
  }
  if (form === 'glass_infuser') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="21" y="13" width="22" height="27" rx="5" fill="${c}" fill-opacity="0.45" stroke="${c}" stroke-width="2"/><rect x="23" y="24" width="18" height="14" rx="3" fill="#D49635" opacity="0.85"/></svg>`;
  }
  if (form === 'corkboard') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="10" y="10" width="44" height="28" rx="2" fill="${c}" stroke="#593B26" stroke-width="2.5"/><rect x="15" y="15" width="10" height="9" fill="#F4ECDC"/><rect x="37" y="22" width="11" height="9" fill="#F4ECDC"/><line x1="20" y1="19" x2="42" y2="26" stroke="${a}" stroke-width="1.8"/></svg>`;
  }
  if (form === 'framed_triptych') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="10" y="15" width="12" height="18" fill="${c}" stroke="${a}" stroke-width="2"/><rect x="25" y="11" width="14" height="26" fill="${c}" stroke="${a}" stroke-width="2"/><rect x="42" y="15" width="12" height="18" fill="${c}" stroke="${a}" stroke-width="2"/></svg>`;
  }
  if (form === 'wall_shelves') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="10" y="21" width="44" height="3" fill="${c}"/><rect x="10" y="36" width="44" height="3" fill="${c}"/><rect x="15" y="11" width="6" height="10" fill="#6E2B36"/><rect x="23" y="12" width="6" height="9" fill="${a}"/><rect x="38" y="26" width="8" height="10" fill="#355849"/></svg>`;
  }
  if (form === 'tiered_fountain') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><ellipse cx="32" cy="36" rx="21" ry="6" fill="${c}"/><ellipse cx="32" cy="34" rx="16" ry="4" fill="${a}"/><rect x="28" y="20" width="8" height="14" fill="${c}"/><path d="M32 18 L32 9" stroke="#A6E6F2" stroke-width="2.4"/></svg>`;
  }
  if (form === 'sakura_lantern') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="22" y="25" width="5" height="16" fill="#5A3D2E"/><circle cx="24" cy="18" r="11" fill="${c}"/><rect x="42" y="27" width="6" height="14" fill="${a}"/><rect x="40" y="22" width="10" height="6" fill="#FFD782"/></svg>`;
  }
  if (form === 'glass_conservatory') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><polygon points="14,22 32,9 50,22" fill="${a}" opacity="0.6" stroke="${c}" stroke-width="2.2"/><rect x="16" y="22" width="32" height="18" fill="${a}" opacity="0.45" stroke="${c}" stroke-width="2.2"/></svg>`;
  }
  if (form === 'rose_pergola') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><path d="M16 40 L16 22 A16 16 0 0 1 48 22 L48 40" fill="none" stroke="${c}" stroke-width="4"/><circle cx="20" cy="15" r="4" fill="${a}"/><circle cx="32" cy="9" r="4.5" fill="${a}"/><circle cx="44" cy="15" r="4" fill="${a}"/></svg>`;
  }
  if (form === 'stone_bench') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="12" y="28" width="28" height="4" fill="${c}"/><rect x="16" y="32" width="4" height="9" fill="${c}"/><rect x="32" y="32" width="4" height="9" fill="${c}"/><line x1="48" y1="41" x2="48" y2="14" stroke="#333" stroke-width="3"/><circle cx="48" cy="12" r="5" fill="${a}"/></svg>`;
  }
  if (form === 'koi_pond') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><ellipse cx="32" cy="29" rx="22" ry="11" fill="${c}" stroke="#7B807A" stroke-width="3"/><circle cx="24" cy="28" r="4" fill="#3B7A4A"/><circle cx="38" cy="27" r="4" fill="${a}"/></svg>`;
  }
  if (form === 'brick_hearth') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="14" y="14" width="36" height="27" rx="2" fill="${c}"/><rect x="23" y="24" width="18" height="17" fill="#18120F"/><polygon points="27,40 32,27 37,40" fill="${a}"/></svg>`;
  }
  if (form === 'reading_nook') {
    return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="16" y="18" width="24" height="20" rx="4" fill="${c}"/><line x1="47" y1="40" x2="47" y2="14" stroke="${a}" stroke-width="2.5"/><polygon points="40,16 54,16 51,8 43,8" fill="${a}"/></svg>`;
  }
  return `<svg viewBox="0 0 64 48" class="st-svg"><rect x="18" y="8" width="28" height="33" rx="2" fill="${c}" stroke="${a}" stroke-width="2"/><line x1="20" y1="19" x2="44" y2="19" stroke="${a}" stroke-width="1.5"/><line x1="20" y1="30" x2="44" y2="30" stroke="${a}" stroke-width="1.5"/></svg>`;
}

function openDecorListModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playClick();

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal" style="max-width:620px;">
        <div class="panel-head">
          <h2>Dekorasi Ruang & Taman (${getInstalledDecorCount()}/${SALON_UPGRADES.length})</h2>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-weight:800; color:var(--gold); font-size:0.9rem;">${save.tokens || 0} ★</span>
            <button class="rpg-btn ghost" id="btn-dc-close" type="button" style="padding:7px 13px; font-size:0.8rem;">Tutup</button>
          </div>
        </div>

        <div class="codex-list">
          ${SALON_UPGRADES.map((u) => {
            const done = typeof save.upgrades?.[u.id] === 'number';
            const stName = done ? u.styles[save.upgrades[u.id]]?.name : null;
            const ready = !done && (save.tokens || 0) >= u.cost;
            return `
              <div class="task-row ${done ? 'done' : ready ? 'ready' : ''}">
                <div>
                  <div style="font-weight:800; color:var(--paper); font-size:0.92rem;">${escapeHtml(u.name)}</div>
                  <div style="font-size:0.78rem; color:var(--muted);">${done ? `Terpasang · ${escapeHtml(stName)}` : `3 bentuk berbeda · ${u.cost} ★`}</div>
                </div>
                <button class="rpg-btn ${ready ? 'gold' : 'ghost'}" data-preview-up="${u.id}" type="button" style="padding:7px 13px; font-size:0.78rem;">
                  ${done ? 'Ganti Bentuk' : 'Pratinjau 3D'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-dc-close')?.addEventListener('click', closeOverlay);
  document.querySelectorAll('[data-preview-up]').forEach((b) => {
    b.addEventListener('click', () => {
      const up = SALON_UPGRADES.find((x) => x.id === b.dataset.previewUp);
      if (up) {
        modalOpen = false;
        openDecorPreviewDock(up);
      }
    });
  });
}

function openDecorPreviewDock(upgrade) {
  modalOpen = false;
  previewOpen = true;
  audio.playClick();

  const alreadyDone = typeof save.upgrades?.[upgrade.id] === 'number';
  let picked = alreadyDone ? save.upgrades[upgrade.id] : 0;

  // Sembunyikan panel chat & dock kiri sementara agar tampilan 3D leluasa tanpa tumpang tindih
  const chatWasVisible = !arkaPanel.classList.contains('hidden');
  const leftDock = document.querySelector('.salon-dock-left');
  arkaPanel.classList.add('hidden');
  btnReopenChat.classList.add('hidden');
  leftDock?.classList.add('hidden');

  salon.previewUpgrade(upgrade.id, picked);

  function restoreChatIfNeeded() {
    leftDock?.classList.remove('hidden');
    if (chatWasVisible) arkaPanel.classList.remove('hidden');
    else btnReopenChat.classList.remove('hidden');
  }

  function renderDock() {
    const canPay = alreadyDone || (save.tokens || 0) >= upgrade.cost;
    overlayRoot.innerHTML = `
      <div class="ren-dock-wrap">
        <div class="ren-dock">
          <div class="ren-dock-head">
            <div>
              <h3>${escapeHtml(upgrade.name)}</h3>
              <span>${alreadyDone ? 'Ganti bentuk 3D gratis · Seret layar untuk putar sudut pandang' : `Pratinjau 3D langsung · Butuh ${upgrade.cost} ★ (punya ${save.tokens || 0} ★)`}</span>
            </div>
            <button class="rpg-btn ghost" id="btn-dc-cancel" type="button" style="padding:6px 12px; font-size:0.78rem;">Batal</button>
          </div>
          <div class="ren-dock-body">
            <div class="ren-style-row">
              ${upgrade.styles
                .map(
                  (st) => `
                <button class="ren-style-btn ${picked === st.id ? 'selected' : ''}" data-dc-st="${st.id}" type="button">
                  <div class="ren-thumb">${renderFormThumbSVG(st.form, st)}</div>
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
                  ? `<button class="rpg-btn gold" id="btn-dc-confirm" type="button">${alreadyDone ? 'Simpan Bentuk' : `Pasang · ${upgrade.cost} ★`}</button>`
                  : `<button class="rpg-btn primary" id="btn-dc-case" type="button">Bedah Berkas (+★)</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-dc-cancel')?.addEventListener('click', () => {
      audio.playClick();
      closeOverlay();
      restoreChatIfNeeded();
    });

    document.querySelectorAll('[data-dc-st]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        picked = Number(b.dataset.dcSt);
        salon.previewUpgrade(upgrade.id, picked);
        renderDock();
      });
    });

    document.getElementById('btn-dc-case')?.addEventListener('click', () => {
      closeOverlay();
      restoreChatIfNeeded();
      openCaseDeskModal();
    });

    document.getElementById('btn-dc-confirm')?.addEventListener('click', () => {
      if (!alreadyDone) {
        if ((save.tokens || 0) < upgrade.cost) return;
        save.tokens -= upgrade.cost;
      }
      save.upgrades[upgrade.id] = picked;
      persistSalonSave(save);

      previewOpen = false;
      salon.previewSlotId = null;
      salon.camTarget = { ...salon.baseFocus };
      salon.syncUpgrades(save.upgrades, upgrade.id);
      audio.playRenovate();

      overlayRoot.innerHTML = '';
      refreshHud();
      restoreChatIfNeeded();
      showBanner('DEKOR TERPASANG', upgrade.styles[picked].name);
    });
  }

  renderDock();
}

// ==========================================
// PENGATURAN KONEKSI AI LIVE (BYOK)
// ==========================================
function openAiSettingsModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playClick();
  let cfg = loadAiConfig();
  let statusTxt = '';

  function renderAi() {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="altar-card" style="max-width:480px;">
          <div class="panel-head" style="margin-bottom:10px;">
            <h2>Koneksi AI Live (BYOK)</h2>
            <button class="rpg-btn ghost" id="btn-ai-close" type="button" style="padding:6px 12px; font-size:0.78rem;">Tutup</button>
          </div>
          <p style="margin:0 0 12px; font-size:0.82rem; color:var(--muted);">
            Pasang API Key milikmu agar Arka bisa mengobrol bebas tentang topik apa saja dan merakit berkas deduksi baru. Key hanya tersimpan di browser ini.
          </p>

          <div class="ai-field">
            <label for="ai-provider">Penyedia Model</label>
            <select id="ai-provider" class="rpg-input">
              ${Object.entries(AI_PROVIDERS)
                .map(([k, v]) => `<option value="${k}" ${cfg.provider === k ? 'selected' : ''}>${escapeHtml(v.label)}</option>`)
                .join('')}
            </select>
          </div>

          <div class="ai-field">
            <label for="ai-model">Nama Model</label>
            <input id="ai-model" class="rpg-input" type="text" value="${escapeHtml(cfg.model)}" placeholder="gemini-2.5-flash" />
          </div>

          <div class="ai-field">
            <label for="ai-key">API Key</label>
            <input id="ai-key" class="rpg-input" type="password" value="${escapeHtml(cfg.apiKey)}" placeholder="Tempel API Key di sini..." autocomplete="off" />
          </div>

          ${statusTxt ? `<p style="margin:8px 0 0; font-size:0.8rem; color:var(--gold);">${escapeHtml(statusTxt)}</p>` : ''}

          <div style="display:flex; justify-content:space-between; gap:8px; margin-top:14px;">
            <button class="rpg-btn ghost" id="btn-ai-clear" type="button" style="padding:8px 14px; font-size:0.8rem;">Hapus Key</button>
            <button class="rpg-btn gold" id="btn-ai-save" type="button">Simpan & Aktifkan</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-ai-close')?.addEventListener('click', closeOverlay);
    document.getElementById('ai-provider')?.addEventListener('change', (e) => {
      cfg.provider = e.target.value;
      cfg.model = AI_PROVIDERS[cfg.provider]?.defaultModel || '';
      renderAi();
    });
    document.getElementById('ai-model')?.addEventListener('input', (e) => {
      cfg.model = e.target.value;
    });
    document.getElementById('ai-key')?.addEventListener('input', (e) => {
      cfg.apiKey = e.target.value;
    });
    document.getElementById('btn-ai-clear')?.addEventListener('click', () => {
      cfg.apiKey = '';
      saveAiConfig(cfg);
      refreshHud();
      statusTxt = 'API Key dihapus. Kembali ke mode lokal.';
      renderAi();
    });
    document.getElementById('btn-ai-save')?.addEventListener('click', () => {
      saveAiConfig(cfg);
      refreshHud();
      if (cfg.apiKey.trim()) {
        showToast('AI Live aktif. Arka siap diajak ngobrol bebas.');
        closeOverlay();
      } else {
        statusTxt = 'Masukkan API Key lebih dulu.';
        renderAi();
      }
    });
  }

  renderAi();
}

// ==========================================
// PROFIL & INGATAN ARKA
// ==========================================
function openProfileModal() {
  if (previewOpen) closeOverlay();
  modalOpen = true;
  audio.playClick();
  const memories = save.memoryNotes || [];

  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="altar-card" style="max-width:460px;">
        <div class="panel-head" style="margin-bottom:12px;">
          <h2>@${escapeHtml(save.username)}</h2>
          <button class="rpg-btn ghost" id="btn-pr-close" type="button" style="padding:6px 12px;">Tutup</button>
        </div>

        <div class="zone-map-grid" style="margin-bottom:12px;">
          <div class="zone-card unlocked"><h3>Malam ${save.night}</h3><p>Sesi berjalan</p></div>
          <div class="zone-card unlocked"><h3>${(save.solvedCaseIds || []).length}</h3><p>Berkas tuntas</p></div>
          <div class="zone-card unlocked"><h3>${getInstalledDecorCount()}/${SALON_UPGRADES.length}</h3><p>Dekor 3D</p></div>
          <div class="zone-card unlocked"><h3>${save.tokens || 0} ★</h3><p>Token tersisa</p></div>
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-size:0.78rem; font-weight:700; color:var(--gold); margin-bottom:6px;">Catatan Ingatan Arka (${memories.length})</div>
          <div class="memory-box">
            ${
              memories.length
                ? memories.map((m) => `<div>• ${escapeHtml(m)}</div>`).join('')
                : `<span style="color:var(--muted);">Belum ada catatan. Ceritakan apa saja ke Arka di panel obrolan.</span>`
            }
          </div>
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
    save = resetSalonAccount(save);
    loadNightCase();
    refreshHud();
    renderChatPanel();
    closeOverlay();
    showToast('Progres diatur ulang.');
  });
}

// ==========================================
// DAFTAR AKUN 2 LANGKAH (USERNAME + 3 SOAL, TANPA PILIH KARAKTER)
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

function enterSalon(account) {
  clearAuthTimers();
  save = account;
  audio.setMuted(save.muted);
  audio.setRain(save.rainOn);
  loadNightCase();
  titleOverlay.classList.add('hidden');
  hudLayer.classList.remove('hidden');
  refreshHud();
  renderChatPanel();
  audio.playDialogueOpen();
  showBanner(`MALAM ${save.night || 1}`, `@${save.username}`);
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
    const saved = listSalonAccounts();
    authCardRoot.innerHTML = `
      ${renderStepper(1)}
      <h1 class="title-logo">MEJA MALAM</h1>
      <p class="title-desc">Ruang baca, teh hangat, dan teman ngobrol. Buat username lalu selesaikan 3 soal singkat.</p>

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
                <span style="color:var(--gold);">Malam ${acc.night || 1}</span>
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
      const existing = listSalonAccounts().map((a) => a.username.toLowerCase());
      const avail = SUGGESTED_USERNAMES.filter((u) => !existing.includes(u.toLowerCase()));
      auth.pendingUsername = avail.length ? avail[Math.floor(Math.random() * avail.length)] : `tamu_${Math.floor(100 + Math.random() * 899)}`;
      renderAuthCard();
    });
    document.getElementById('btn-start-exam')?.addEventListener('click', proceedToExam);
    document.querySelectorAll('[data-login-user]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const acc = switchSalonAccount(btn.dataset.loginUser);
        if (acc) enterSalon(acc);
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
  const existing = listSalonAccounts().map((a) => a.username);
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
      const created = registerSalonAccount(auth.pendingUsername);
      enterSalon(created);
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
// KONTROL POV KURSOR LANGSUNG DI RUANG BACA 3D
// ==========================================
let ptrDown = false;
let ptrLastX = 0;
let ptrLastY = 0;

worldCanvas.style.cursor = 'grab';
worldCanvas.addEventListener('pointerdown', (e) => {
  if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
  ptrDown = true;
  ptrLastX = e.clientX;
  ptrLastY = e.clientY;
  worldCanvas.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
  if (!ptrDown || modalOpen || !titleOverlay.classList.contains('hidden')) return;
  const dx = e.clientX - ptrLastX;
  const dy = e.clientY - ptrLastY;
  ptrLastX = e.clientX;
  ptrLastY = e.clientY;
  salon.rotateCamera(-dx * 0.0045, dy * 0.0032);
});

window.addEventListener('pointerup', () => {
  ptrDown = false;
  worldCanvas.style.cursor = 'grab';
});

worldCanvas.addEventListener(
  'wheel',
  (e) => {
    if (modalOpen || !titleOverlay.classList.contains('hidden')) return;
    e.preventDefault();
    salon.zoomCamera(e.deltaY * 0.004);
  },
  { passive: false }
);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && (modalOpen || previewOpen)) closeOverlay();
});

// HUD Bindings
document.getElementById('btn-open-profile')?.addEventListener('click', openProfileModal);
document.getElementById('btn-open-decor-top')?.addEventListener('click', openDecorListModal);
document.getElementById('btn-open-decor')?.addEventListener('click', openDecorListModal);
document.getElementById('btn-open-books')?.addEventListener('click', openBooksModal);
document.getElementById('btn-open-ai')?.addEventListener('click', openAiSettingsModal);
document.getElementById('btn-open-tea')?.addEventListener('click', openTeaModal);
document.getElementById('btn-open-case')?.addEventListener('click', openCaseDeskModal);

btnToggleRain.addEventListener('click', () => {
  save.rainOn = !save.rainOn;
  audio.setRain(save.rainOn);
  persistSalonSave(save);
  refreshHud();
});

btnToggleSound.addEventListener('click', () => {
  save.muted = !save.muted;
  audio.setMuted(save.muted);
  persistSalonSave(save);
  refreshHud();
  if (!save.muted) audio.playClick();
});

// Main Loop 60FPS
let lastTs = performance.now();
function tick(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;
  salon.update(dt, ts / 1000);
  requestAnimationFrame(tick);
}

openAuthFlow('username');
refreshHud();
requestAnimationFrame(tick);
