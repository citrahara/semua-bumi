// Ruang Belajar Interaktif (Akademi Bahasa Korea, Poliglot Jepang & Inggris, Retorika, dan Radar Siber /berita-terkini).
// Memakai Web Speech Synthesis bawaan browser agar pemain bisa MENDENGARKAN pelafalan asli!

import {
  KOREAN_ACADEMY,
  POLYGLOT_ACADEMY,
  RHETORIC_ACADEMY,
  CYBER_LAB
} from './data/academy.js';
import { renderCharacterSVG, CAST } from './characters.js';
import { audio } from './audio.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function speakPhrase(text, lang = 'ko-KR') {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  } catch {
    // Abaikan jika browser membatasi TTS
  }
}

// ==========================================
// 1. AKADEMI BAHASA KOREA (SORA-SSI)
// ==========================================
export function openKoreanAcademy({ overlayRoot, save, onComplete, onClose }) {
  let tab = 'hangul'; // hangul | phrases | practice
  let pIdx = 0;
  let pFeedback = null;
  const hasBadge = (save.academyBadges || []).includes(KOREAN_ACADEMY.id);

  function render() {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal">
          <div class="panel-head">
            <div style="display:flex; align-items:center; gap:14px;">
              <div class="portrait-box" style="width:64px; height:64px;">${renderCharacterSVG('sora', 'happy')}</div>
              <div>
                <div class="title-kicker">RUANG BELAJAR BAHASA · ${hasBadge ? 'LENCANA HANGUL AKTIF' : 'QUEST BELAJAR'}</div>
                <h2>${escapeHtml(KOREAN_ACADEMY.title)}</h2>
              </div>
            </div>
            <button class="rpg-btn ghost" id="btn-ac-close" type="button" style="padding:8px 14px;">Keluar</button>
          </div>

          <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">${escapeHtml(KOREAN_ACADEMY.intro)}</p>

          <div class="codex-bar">
            <button class="filter-chip ${tab === 'hangul' ? 'active' : ''}" data-ktab="hangul" type="button">1. Belajar Hangul</button>
            <button class="filter-chip ${tab === 'phrases' ? 'active' : ''}" data-ktab="phrases" type="button">2. Frasa & Suara Korea</button>
            <button class="filter-chip ${tab === 'practice' ? 'active' : ''}" data-ktab="practice" type="button">3. Praktik Kafe Seoul</button>
          </div>

          ${
            tab === 'hangul'
              ? `
                <div class="study-grid">
                  ${KOREAN_ACADEMY.hangulBasics
                    .map(
                      (h, idx) => `
                    <div class="study-card">
                      <div class="study-big-char">${escapeHtml(h.symbol)}</div>
                      <div class="study-rom">Baca: ${escapeHtml(h.rom)}</div>
                      <p class="study-tip">${escapeHtml(h.tip)}</p>
                      <button class="speak-btn" data-say="${escapeHtml(h.speak)}" data-lang="ko-KR" type="button">Dengar Suara</button>
                    </div>
                  `
                    )
                    .join('')}
                </div>
                <div style="margin-top:16px; text-align:right;">
                  <button class="rpg-btn gold" id="btn-next-phrases" type="button">Lanjut ke Frasa Percakapan</button>
                </div>
              `
              : tab === 'phrases'
              ? `
                <div class="codex-list">
                  ${KOREAN_ACADEMY.phrases
                    .map(
                      (p) => `
                    <div class="codex-item" style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                      <div>
                        <div class="title-kicker" style="margin-bottom:2px;">${escapeHtml(p.level)}</div>
                        <h4 style="font-size:1.2rem;">${escapeHtml(p.hangul)} <span style="color:var(--paper); font-size:0.9rem; font-weight:600;">(${escapeHtml(p.rom)})</span></h4>
                        <p><strong>${escapeHtml(p.meaning)}</strong></p>
                        <p style="color:var(--muted); font-size:0.84rem;">${escapeHtml(p.note)}</p>
                      </div>
                      <button class="speak-btn" data-say="${escapeHtml(p.speak)}" data-lang="ko-KR" type="button">Dengar</button>
                    </div>
                  `
                    )
                    .join('')}
                </div>
                <div style="margin-top:16px; text-align:right;">
                  <button class="rpg-btn primary" id="btn-go-practice" type="button">Coba Praktik Kafe Seoul (Raih Lencana!)</button>
                </div>
              `
              : renderKoreanPractice()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-ac-close')?.addEventListener('click', onClose);
    document.querySelectorAll('[data-ktab]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        tab = b.dataset.ktab;
        render();
      });
    });
    document.querySelectorAll('[data-say]').forEach((b) => {
      b.addEventListener('click', () => {
        speakPhrase(b.dataset.say, b.dataset.lang || 'ko-KR');
      });
    });
    document.getElementById('btn-next-phrases')?.addEventListener('click', () => {
      audio.playClick();
      tab = 'phrases';
      render();
    });
    document.getElementById('btn-go-practice')?.addEventListener('click', () => {
      audio.playClick();
      tab = 'practice';
      pIdx = 0;
      pFeedback = null;
      render();
    });
    document.querySelectorAll('[data-kp-opt]').forEach((b) => {
      b.addEventListener('click', () => {
        const idx = Number(b.dataset.kpOpt);
        const item = KOREAN_ACADEMY.practice[pIdx];
        const chosen = item.options[idx];
        if (chosen.ok) {
          audio.playCorrect();
          pFeedback = { ok: true, text: item.feedback };
        } else {
          audio.playWrong();
          pFeedback = { ok: false, text: 'Coba lihat lagi tab Frasa Korea di atas, kamu pasti langsung ingat!' };
        }
        render();
      });
    });
    document.getElementById('btn-kp-next')?.addEventListener('click', () => {
      audio.playClick();
      if (pIdx < KOREAN_ACADEMY.practice.length - 1) {
        pIdx += 1;
        pFeedback = null;
        render();
      } else {
        onComplete({
          academyId: KOREAN_ACADEMY.id,
          badgeName: KOREAN_ACADEMY.badgeName,
          npcId: 'sora',
          xp: 100,
          coins: 70
        });
      }
    });
  }

  function renderKoreanPractice() {
    const item = KOREAN_ACADEMY.practice[pIdx];
    return `
      <div class="math-q-box">
        <span class="math-tag">Simulasi Kafe Seoul · Langkah ${pIdx + 1}/${KOREAN_ACADEMY.practice.length}</span>
        <p class="math-q-text">${escapeHtml(item.scene)}</p>
      </div>
      <div class="choice-grid">
        ${item.options
          .map(
            (opt, idx) => `
          <button class="rpg-choice ${pFeedback && pFeedback.ok && opt.ok ? 'ok' : ''}" data-kp-opt="${idx}" type="button" ${pFeedback && pFeedback.ok ? 'disabled' : ''}>
            <span class="choice-badge">${['A', 'B', 'C'][idx]}</span>
            <span>${escapeHtml(opt.label)}</span>
          </button>
        `
          )
          .join('')}
      </div>
      ${
        pFeedback
          ? `
        <div class="insight-box">
          <p><strong>${pFeedback.ok ? 'Mantap!' : 'Belum pas!'}</strong> ${escapeHtml(pFeedback.text)}</p>
        </div>
        ${
          pFeedback.ok
            ? `<div style="margin-top:14px; text-align:right;"><button class="rpg-btn gold" id="btn-kp-next" type="button">${
                pIdx >= KOREAN_ACADEMY.practice.length - 1 ? 'Klaim Lencana Hangul!' : 'Lanjut Dialog Berikutnya'
              }</button></div>`
            : ''
        }
      `
          : ''
      }
    `;
  }

  render();
}

// ==========================================
// 2. PAVILIUN POLIGLOT (JEPANG & IDIOM INGGRIS)
// ==========================================
export function openPolyglotAcademy({ overlayRoot, save, onComplete, onClose }) {
  let tab = 'jp'; // jp | en | practice
  let pIdx = 0;
  let pFeedback = null;

  function render() {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal">
          <div class="panel-head">
            <div style="display:flex; align-items:center; gap:14px;">
              <div class="portrait-box" style="width:64px; height:64px;">${renderCharacterSVG('kenji', 'happy')}</div>
              <div>
                <div class="title-kicker">RUANG BELAJAR POLIGLOT · KENJI-SAN</div>
                <h2>${escapeHtml(POLYGLOT_ACADEMY.title)}</h2>
              </div>
            </div>
            <button class="rpg-btn ghost" id="btn-ac-close" type="button" style="padding:8px 14px;">Keluar</button>
          </div>
          <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">${escapeHtml(POLYGLOT_ACADEMY.intro)}</p>

          <div class="codex-bar">
            <button class="filter-chip ${tab === 'jp' ? 'active' : ''}" data-ptab="jp" type="button">1. Belajar Jepang</button>
            <button class="filter-chip ${tab === 'en' ? 'active' : ''}" data-ptab="en" type="button">2. Idiom Inggris Keren</button>
            <button class="filter-chip ${tab === 'practice' ? 'active' : ''}" data-ptab="practice" type="button">3. Praktik Poliglot</button>
          </div>

          ${
            tab === 'jp'
              ? renderPhraseList(POLYGLOT_ACADEMY.japanese, 'en', 'Lanjut ke Idiom Inggris')
              : tab === 'en'
              ? renderPhraseList(POLYGLOT_ACADEMY.englishIdioms, 'practice', 'Coba Praktik Poliglot!')
              : renderPolyPractice()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-ac-close')?.addEventListener('click', onClose);
    document.querySelectorAll('[data-ptab]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        tab = b.dataset.ptab;
        render();
      });
    });
    document.querySelectorAll('[data-say]').forEach((b) => {
      b.addEventListener('click', () => speakPhrase(b.dataset.say, b.dataset.lang));
    });
    document.getElementById('btn-poly-nexttab')?.addEventListener('click', (e) => {
      audio.playClick();
      tab = e.target.dataset.next;
      render();
    });
    document.querySelectorAll('[data-pp-opt]').forEach((b) => {
      b.addEventListener('click', () => {
        const item = POLYGLOT_ACADEMY.practice[pIdx];
        const chosen = item.options[Number(b.dataset.ppOpt)];
        if (chosen.ok) {
          audio.playCorrect();
          pFeedback = { ok: true, text: item.feedback };
        } else {
          audio.playWrong();
          pFeedback = { ok: false, text: 'Cek ulang daftar istilah di tab sebelumnya ya!' };
        }
        render();
      });
    });
    document.getElementById('btn-pp-next')?.addEventListener('click', () => {
      audio.playClick();
      if (pIdx < POLYGLOT_ACADEMY.practice.length - 1) {
        pIdx += 1;
        pFeedback = null;
        render();
      } else {
        onComplete({
          academyId: POLYGLOT_ACADEMY.id,
          badgeName: POLYGLOT_ACADEMY.badgeName,
          npcId: 'kenji',
          xp: 100,
          coins: 75
        });
      }
    });
  }

  function renderPhraseList(items, nextTab, nextLabel) {
    return `
      <div class="codex-list">
        ${items
          .map(
            (p) => `
          <div class="codex-item" style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
            <div>
              <h4 style="font-size:1.15rem;">${escapeHtml(p.native)} <span style="color:var(--paper); font-size:0.88rem;">(${escapeHtml(p.rom)})</span></h4>
              <p><strong>${escapeHtml(p.meaning)}</strong></p>
              <p style="color:var(--muted); font-size:0.84rem;">${escapeHtml(p.note)}</p>
            </div>
            <button class="speak-btn" data-say="${escapeHtml(p.native)}" data-lang="${p.lang}" type="button">Dengar</button>
          </div>
        `
          )
          .join('')}
      </div>
      <div style="margin-top:16px; text-align:right;">
        <button class="rpg-btn gold" id="btn-poly-nexttab" data-next="${nextTab}" type="button">${nextLabel}</button>
      </div>
    `;
  }

  function renderPolyPractice() {
    const item = POLYGLOT_ACADEMY.practice[pIdx];
    return `
      <div class="math-q-box">
        <span class="math-tag">Praktik Poliglot · ${pIdx + 1}/${POLYGLOT_ACADEMY.practice.length}</span>
        <p class="math-q-text">${escapeHtml(item.scene)}</p>
      </div>
      <div class="choice-grid">
        ${item.options
          .map(
            (opt, idx) => `
          <button class="rpg-choice ${pFeedback && pFeedback.ok && opt.ok ? 'ok' : ''}" data-pp-opt="${idx}" type="button" ${pFeedback && pFeedback.ok ? 'disabled' : ''}>
            <span class="choice-badge">${['A', 'B', 'C'][idx]}</span>
            <span>${escapeHtml(opt.label)}</span>
          </button>
        `
          )
          .join('')}
      </div>
      ${
        pFeedback
          ? `
        <div class="insight-box"><p><strong>${pFeedback.ok ? 'Tepat!' : 'Coba lagi!'}</strong> ${escapeHtml(pFeedback.text)}</p></div>
        ${
          pFeedback.ok
            ? `<div style="margin-top:14px; text-align:right;"><button class="rpg-btn gold" id="btn-pp-next" type="button">${
                pIdx >= POLYGLOT_ACADEMY.practice.length - 1 ? 'Klaim Lencana Poliglot!' : 'Lanjut'
              }</button></div>`
            : ''
        }
      `
          : ''
      }
    `;
  }

  render();
}

// ==========================================
// 3. RUANG BELAJAR RETORIKA (HAKIM NALAR)
// ==========================================
export function openRhetoricAcademy({ overlayRoot, onComplete, onClose }) {
  overlayRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="panel-modal">
        <div class="panel-head">
          <div style="display:flex; align-items:center; gap:14px;">
            <div class="portrait-box" style="width:64px; height:64px;">${renderCharacterSVG('hakim', 'happy')}</div>
            <div>
              <div class="title-kicker">RUANG BELAJAR BERBICARA · HAKIM NALAR</div>
              <h2>${escapeHtml(RHETORIC_ACADEMY.title)}</h2>
            </div>
          </div>
          <button class="rpg-btn ghost" id="btn-ac-close" type="button" style="padding:8px 14px;">Keluar</button>
        </div>
        <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">${escapeHtml(RHETORIC_ACADEMY.intro)}</p>
        <div class="codex-list">
          ${RHETORIC_ACADEMY.frameworks
            .map(
              (f) => `
            <div class="codex-item">
              <h4>${escapeHtml(f.name)}</h4>
              <p>${escapeHtml(f.desc)}</p>
              <p style="color:var(--gold); font-style:italic;">${escapeHtml(f.example)}</p>
            </div>
          `
            )
            .join('')}
        </div>
        <div style="margin-top:16px; text-align:right;">
          <button class="rpg-btn gold" id="btn-claim-rhetoric" type="button">Tandai Selesai Belajar & Klaim Lencana Retorika</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-ac-close')?.addEventListener('click', onClose);
  document.getElementById('btn-claim-rhetoric')?.addEventListener('click', () => {
    onComplete({
      academyId: RHETORIC_ACADEMY.id,
      badgeName: RHETORIC_ACADEMY.badgeName,
      npcId: 'hakim',
      xp: 90,
      coins: 65
    });
  });
}

// ==========================================
// 4. PUSAT KOMANDO SIBER & RADAR /berita-terkini (KOMANDAN VEGA)
// ==========================================
export function openCyberLab({ overlayRoot, save, onUnlockIntel, onComplete, onClose }) {
  let tab = 'breakthroughs'; // breakthroughs | sources | briefing
  let bIdx = 0;
  let bFeedback = null;

  // Membuka terminal otomatis menyimpan seluruh 8 terobosan dasar ke Codex bila dipelajari
  function render() {
    overlayRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="panel-modal">
          <div class="panel-head">
            <div style="display:flex; align-items:center; gap:14px;">
              <div class="portrait-box" style="width:64px; height:64px;">${renderCharacterSVG('vega', 'idle')}</div>
              <div>
                <div class="title-kicker">DISTRIK SIBER · AI & IIV/CII GLOBAL</div>
                <h2>${escapeHtml(CYBER_LAB.title)}</h2>
              </div>
            </div>
            <button class="rpg-btn ghost" id="btn-ac-close" type="button" style="padding:8px 14px;">Keluar</button>
          </div>

          <p style="margin:0 0 14px; font-size:0.9rem; color:var(--muted);">${escapeHtml(CYBER_LAB.intro)}</p>

          <div class="codex-bar">
            <button class="filter-chip ${tab === 'breakthroughs' ? 'active' : ''}" data-ctab="breakthroughs" type="button">1. Terobosan Dunia Siber (${CYBER_LAB.breakthroughs.length})</button>
            <button class="filter-chip ${tab === 'sources' ? 'active' : ''}" data-ctab="sources" type="button">2. Peta 21 Sumber /berita-terkini</button>
            <button class="filter-chip ${tab === 'briefing' ? 'active' : ''}" data-ctab="briefing" type="button">3. Simulasi Analis Siber</button>
          </div>

          ${
            tab === 'breakthroughs'
              ? `
                <div class="codex-list">
                  ${CYBER_LAB.breakthroughs
                    .map(
                      (item) => `
                    <div class="codex-item">
                      <div class="title-kicker" style="margin-bottom:2px; color:var(--cyan);">${escapeHtml(item.category)}</div>
                      <h4>${escapeHtml(item.title)}</h4>
                      <p><strong>${escapeHtml(item.summary)}</strong></p>
                      <p style="color:var(--muted); font-size:0.86rem;">Kenapa penting: ${escapeHtml(item.whyMatters)}</p>
                      <p style="color:var(--gold); font-style:italic; font-size:0.85rem;">${escapeHtml(item.speakHook)}</p>
                    </div>
                  `
                    )
                    .join('')}
                </div>
                <div style="margin-top:16px; text-align:right;">
                  <button class="rpg-btn gold" id="btn-cyber-sources" type="button">Lihat 21 Sumber /berita-terkini</button>
                </div>
              `
              : tab === 'sources'
              ? `
                <div class="insight-box" style="margin-top:0; margin-bottom:14px;">
                  <p><strong>Dua Pilar Pantauan /berita-terkini:</strong> (1) <strong>Keamanan AI</strong> (serangan terhadap LLM, prompt injection, AI untuk SOC) dan (2) <strong>IIV/CII Global</strong> (energi, air, transportasi, keuangan, kesehatan, telko, pemerintahan, dan ICS/OT/SCADA).</p>
                  <p>Ini adalah 21 domain acuan analis siber global yang dipakai dalam kurasi harian:</p>
                </div>
                <div class="codex-list">
                  ${CYBER_LAB.newsSources
                    .map(
                      (grp) => `
                    <div class="codex-item">
                      <h4>${escapeHtml(grp.group)}</h4>
                      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
                        ${grp.domains.map((d) => `<span class="source-pill">${escapeHtml(d)}</span>`).join('')}
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
                <div style="margin-top:16px; text-align:right;">
                  <button class="rpg-btn primary" id="btn-cyber-brief" type="button">Lanjut Simulasi Analis (Raih Lencana Siber!)</button>
                </div>
              `
              : renderBriefing()
          }
        </div>
      </div>
    `;

    document.getElementById('btn-ac-close')?.addEventListener('click', onClose);
    document.querySelectorAll('[data-ctab]').forEach((b) => {
      b.addEventListener('click', () => {
        audio.playClick();
        tab = b.dataset.ctab;
        if (tab === 'breakthroughs' && onUnlockIntel) {
          CYBER_LAB.breakthroughs.forEach((it) => onUnlockIntel(it.id));
        }
        render();
      });
    });
    document.getElementById('btn-cyber-sources')?.addEventListener('click', () => {
      audio.playClick();
      if (onUnlockIntel) CYBER_LAB.breakthroughs.forEach((it) => onUnlockIntel(it.id));
      tab = 'sources';
      render();
    });
    document.getElementById('btn-cyber-brief')?.addEventListener('click', () => {
      audio.playClick();
      tab = 'briefing';
      bIdx = 0;
      bFeedback = null;
      render();
    });
    document.querySelectorAll('[data-cb-opt]').forEach((b) => {
      b.addEventListener('click', () => {
        const q = CYBER_LAB.briefingPractice[bIdx];
        const chosen = q.options[Number(b.dataset.cbOpt)];
        if (chosen.ok) {
          audio.playCorrect();
          bFeedback = { ok: true, text: q.explain };
        } else {
          audio.playWrong();
          bFeedback = { ok: false, text: 'Cek ulang pilar AI vs IIV/CII pada tab Terobosan Siber ya!' };
        }
        render();
      });
    });
    document.getElementById('btn-cb-next')?.addEventListener('click', () => {
      audio.playClick();
      if (bIdx < CYBER_LAB.briefingPractice.length - 1) {
        bIdx += 1;
        bFeedback = null;
        render();
      } else {
        if (onUnlockIntel) CYBER_LAB.breakthroughs.forEach((it) => onUnlockIntel(it.id));
        onComplete({
          academyId: CYBER_LAB.id,
          badgeName: CYBER_LAB.badgeName,
          npcId: 'vega',
          xp: 120,
          coins: 90
        });
      }
    });
  }

  function renderBriefing() {
    const q = CYBER_LAB.briefingPractice[bIdx];
    return `
      <div class="math-q-box">
        <span class="math-tag">Simulasi Briefing /berita-terkini · Kasus ${bIdx + 1}/${CYBER_LAB.briefingPractice.length}</span>
        <p class="math-q-text">${escapeHtml(q.q)}</p>
      </div>
      <div class="choice-grid">
        ${q.options
          .map(
            (opt, idx) => `
          <button class="rpg-choice ${bFeedback && bFeedback.ok && opt.ok ? 'ok' : ''}" data-cb-opt="${idx}" type="button" ${bFeedback && bFeedback.ok ? 'disabled' : ''}>
            <span class="choice-badge">${['A', 'B', 'C'][idx]}</span>
            <span>${escapeHtml(opt.label)}</span>
          </button>
        `
          )
          .join('')}
      </div>
      ${
        bFeedback
          ? `
        <div class="insight-box"><p><strong>${bFeedback.ok ? 'Analisis Tepat!' : 'Revisi Analisis!'}</strong> ${escapeHtml(bFeedback.text)}</p></div>
        ${
          bFeedback.ok
            ? `<div style="margin-top:14px; text-align:right;"><button class="rpg-btn gold" id="btn-cb-next" type="button">${
                bIdx >= CYBER_LAB.briefingPractice.length - 1 ? 'Klaim Lencana Analis Siber!' : 'Kasus Berikutnya'
              }</button></div>`
            : ''
        }
      `
          : ''
      }
    `;
  }

  if (onUnlockIntel) {
    CYBER_LAB.breakthroughs.slice(0, 2).forEach((it) => onUnlockIntel(it.id));
  }
  render();
}
