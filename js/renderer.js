// Engine grafis 2D 60FPS untuk Dunia Terbuka 6 Zona Warkop Impact + Musuh Patroli Siber + Minimap Interaktif.

import {
  WORLD_W,
  WORLD_H,
  ZONES,
  BRIDGES,
  WAYPOINTS,
  CHESTS,
  NPCS,
  LANDMARKS,
  TREES
} from './world.js';
import { CAST } from './characters.js';
import { getCharacterClass } from './data/registration.js';

export class WorldRenderer {
  constructor(canvas, minimapCanvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.miniCanvas = minimapCanvas;
    this.miniCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

    this.cam = { x: 0, y: 0 };
    this.shake = 0;
    this.particles = [];
    this.ambient = this.createAmbientMotes();
    this.clickRing = null;
  }

  createAmbientMotes() {
    const motes = [];
    for (let i = 0; i < 95; i++) {
      motes.push({
        x: Math.random() * WORLD_W,
        y: Math.random() * WORLD_H,
        vx: (Math.random() - 0.5) * 16,
        vy: 8 + Math.random() * 14,
        size: 2.2 + Math.random() * 2.8,
        phase: Math.random() * Math.PI * 2
      });
    }
    return motes;
  }

  spawnBurst(x, y, color = '#FFD166', count = 24) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.35;
      const spd = 45 + Math.random() * 130;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 20,
        life: 0.6 + Math.random() * 0.45,
        maxLife: 1.0,
        size: 3 + Math.random() * 4,
        color
      });
    }
  }

  spawnDust(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + 12,
      vx: (Math.random() - 0.5) * 18,
      vy: -8 - Math.random() * 12,
      life: 0.35,
      maxLife: 0.35,
      size: 3 + Math.random() * 2.5,
      color: 'rgba(255, 245, 224, 0.7)'
    });
  }

  triggerShake(amount = 8) {
    this.shake = Math.max(this.shake, amount);
  }

  setClickTarget(x, y) {
    this.clickRing = { x, y, life: 0.65, maxLife: 0.65 };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.viewW = w;
    this.viewH = h;
  }

  update(dt, player) {
    const targetX = Math.max(0, Math.min(WORLD_W - this.viewW, player.x - this.viewW / 2));
    const targetY = Math.max(0, Math.min(WORLD_H - this.viewH, player.y - this.viewH / 2));
    this.cam.x += (targetX - this.cam.x) * Math.min(1, dt * 8);
    this.cam.y += (targetY - this.cam.y) * Math.min(1, dt * 8);

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 26);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (const m of this.ambient) {
      m.x += (m.vx + Math.sin(performance.now() * 0.001 + m.phase) * 10) * dt;
      m.y += m.vy * dt;
      if (m.y > WORLD_H) m.y = 0;
      if (m.x < 0) m.x = WORLD_W;
      if (m.x > WORLD_W) m.x = 0;
    }

    if (this.clickRing) {
      this.clickRing.life -= dt;
      if (this.clickRing.life <= 0) this.clickRing = null;
    }
  }

  screenToWorld(sx, sy) {
    return { x: sx + this.cam.x, y: sy + this.cam.y };
  }

  render(nowSec, state) {
    const ctx = this.ctx;
    const { player, ciko, save, activeQuest, nearestInteract, enemies = [] } = state;

    ctx.save();
    ctx.fillStyle = '#25698A';
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    ctx.translate(-Math.round(this.cam.x + shakeX), -Math.round(this.cam.y + shakeY));

    this.drawRivers(ctx, nowSec);
    this.drawZonesAndPaths(ctx, nowSec);
    this.drawBridgesAndGates(ctx, nowSec, save.solvedGates);

    for (const lm of LANDMARKS) {
      if (!lm.solid) this.drawLandmark(ctx, lm, nowSec);
    }

    if (this.clickRing) {
      const t = 1 - this.clickRing.life / this.clickRing.maxLife;
      ctx.strokeStyle = `rgba(255, 209, 102, ${1 - t})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.clickRing.x, this.clickRing.y, 10 + t * 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    const drawables = [];
    for (const lm of LANDMARKS) {
      if (lm.solid) drawables.push({ y: lm.y + lm.h, draw: () => this.drawLandmark(ctx, lm, nowSec) });
    }
    for (const tr of TREES) {
      drawables.push({ y: tr.y + 12, draw: () => this.drawTree(ctx, tr, nowSec) });
    }
    for (const wp of WAYPOINTS) {
      const unlocked = save.unlockedWaypoints.includes(wp.id);
      drawables.push({ y: wp.y, draw: () => this.drawWaypoint(ctx, wp, unlocked, nowSec) });
    }
    for (const ch of CHESTS) {
      const opened = save.openedChests.includes(ch.id);
      drawables.push({ y: ch.y, draw: () => this.drawChest(ctx, ch, opened, nowSec) });
    }
    for (const npc of NPCS) {
      const infoName = CAST[npc.id]?.name || '';
      const isQuestTarget = Boolean(activeQuest?.target?.label?.includes(infoName));
      const isDone =
        save.completedNpcs.includes(npc.id) ||
        (npc.challengeType === 'academy_korean' && (save.academyBadges || []).includes('academy-korean')) ||
        (npc.challengeType === 'academy_polyglot' && (save.academyBadges || []).includes('academy-polyglot')) ||
        (npc.challengeType === 'academy_rhetoric' && (save.academyBadges || []).includes('academy-rhetoric')) ||
        (npc.challengeType === 'academy_cyber' && (save.academyBadges || []).includes('academy-cyber'));
      drawables.push({
        y: npc.y,
        draw: () => this.drawNpc(ctx, npc, isQuestTarget, isDone, nowSec)
      });
    }
    for (const en of enemies) {
      const defeated = (save.defeatedEnemies || []).includes(en.id);
      drawables.push({
        y: en.curY,
        draw: () => this.drawEnemy(ctx, en, defeated, nowSec)
      });
    }
    drawables.push({ y: player.y, draw: () => this.drawPlayer(ctx, player, nowSec) });
    drawables.push({ y: ciko.y + 4, draw: () => this.drawCiko(ctx, ciko, nowSec) });

    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    if (activeQuest && activeQuest.target) {
      this.drawQuestCompass(ctx, player, activeQuest.target, nowSec);
    }

    if (nearestInteract) {
      const pulse = 0.65 + 0.35 * Math.sin(nowSec * 5);
      ctx.strokeStyle = nearestInteract.kind === 'enemy' ? `rgba(255, 107, 107, ${pulse})` : `rgba(255, 209, 102, ${pulse})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(nearestInteract.x, nearestInteract.y, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    this.drawParticles(ctx, nowSec);
    ctx.restore();

    if (this.miniCtx) {
      this.drawMinimap(save, player, activeQuest, enemies, nowSec);
    }
  }

  drawRivers(ctx, nowSec) {
    ctx.fillStyle = '#25698A';
    ctx.fillRect(1110, 0, 140, WORLD_H);
    ctx.fillRect(2350, 0, 140, WORLD_H);
    ctx.fillRect(0, 790, WORLD_W, 140);

    ctx.strokeStyle = 'rgba(220, 248, 255, 0.24)';
    ctx.lineWidth = 2;
    const shift = (nowSec * 28) % 60;
    for (let y = 20; y < WORLD_H; y += 54) {
      ctx.beginPath();
      ctx.moveTo(1140, y + shift * 0.4);
      ctx.quadraticCurveTo(1180, y + shift * 0.4 + 7, 1220, y + shift * 0.4);
      ctx.moveTo(2380, y + shift * 0.4);
      ctx.quadraticCurveTo(2420, y + shift * 0.4 + 7, 2460, y + shift * 0.4);
      ctx.stroke();
    }
    for (let x = 24; x < WORLD_W; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x + shift * 0.5, 860);
      ctx.quadraticCurveTo(x + shift * 0.5 + 18, 852, x + shift * 0.5 + 36, 860);
      ctx.stroke();
    }
  }

  drawZonesAndPaths(ctx, nowSec) {
    for (const z of ZONES) {
      const { x, y, w, h } = z.rect;
      const isDark = z.id === 3 || z.id === 4 || z.id === 6;

      ctx.fillStyle = z.id === 3 ? '#0F1A29' : z.id === 4 ? '#1B1F27' : z.id === 6 ? '#1E1A33' : '#C2A373';
      ctx.beginPath();
      ctx.roundRect(x + 8, y + 8, w - 16, h - 16, 26);
      ctx.fill();

      ctx.fillStyle = z.ground;
      ctx.beginPath();
      ctx.roundRect(x + 16, y + 16, w - 32, h - 32, 22);
      ctx.fill();

      // Biome-specific ground pattern
      if (z.id === 3) {
        // Cyber Neon Circuit Grid!
        ctx.strokeStyle = 'rgba(72, 219, 251, 0.12)';
        ctx.lineWidth = 1.5;
        for (let gx = x + 40; gx < x + w - 40; gx += 80) {
          ctx.beginPath();
          ctx.moveTo(gx, y + 24);
          ctx.lineTo(gx, y + h - 24);
          ctx.stroke();
        }
        for (let gy = y + 40; gy < y + h - 40; gy += 80) {
          ctx.beginPath();
          ctx.moveTo(x + 24, gy);
          ctx.lineTo(x + w - 24, gy);
          ctx.stroke();
        }
      } else if (z.id === 4) {
        // SCADA Steel Hazard Grid
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.lineWidth = 2;
        for (let gx = x + 60; gx < x + w - 40; gx += 110) {
          ctx.beginPath();
          ctx.moveTo(gx, y + 24);
          ctx.lineTo(gx, y + h - 24);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = z.groundAlt;
        for (let gx = x + 60; gx < x + w - 80; gx += 120) {
          for (let gy = y + 60; gy < y + h - 80; gy += 120) {
            if (((gx + gy) / 120) % 2 === 0) {
              ctx.beginPath();
              ctx.roundRect(gx, gy, 54, 44, 14);
              ctx.fill();
            }
          }
        }
      }

      ctx.fillStyle = isDark ? 'rgba(255, 224, 130, 0.22)' : 'rgba(27, 23, 20, 0.16)';
      ctx.font = '800 18px "Bricolage Grotesque", sans-serif';
      ctx.fillText(z.name.toUpperCase(), x + 44, y + 52);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Zona 1 jalan tanah
    ctx.strokeStyle = '#E5CFA3';
    ctx.lineWidth = 44;
    ctx.beginPath();
    ctx.moveTo(240, 420); ctx.lineTo(450, 400); ctx.lineTo(1100, 400);
    ctx.moveTo(450, 400); ctx.lineTo(820, 235);
    ctx.moveTo(450, 400); ctx.lineTo(420, 590);
    ctx.moveTo(580, 400); ctx.lineTo(740, 600);
    ctx.stroke();

    // Zona 2 alun-alun Akademi Bahasa
    ctx.strokeStyle = '#D2BA94';
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(1260, 400); ctx.lineTo(2340, 400);
    ctx.moveTo(1620, 260); ctx.lineTo(1620, 615);
    ctx.moveTo(2070, 260); ctx.lineTo(2070, 615);
    ctx.stroke();

    // Zona 3 jalur neon siber
    ctx.strokeStyle = '#203B59';
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(2500, 400); ctx.lineTo(3340, 400);
    ctx.moveTo(3040, 265); ctx.lineTo(3040, 780);
    ctx.moveTo(2820, 400); ctx.lineTo(2820, 520);
    ctx.moveTo(3320, 400); ctx.lineTo(3320, 540);
    ctx.stroke();

    // Zona 4 jalur gardu SCADA
    ctx.strokeStyle = '#384152';
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(3040, 940); ctx.lineTo(3040, 1340); ctx.lineTo(2500, 1340);
    ctx.moveTo(2790, 1340); ctx.lineTo(2790, 1210);
    ctx.moveTo(3040, 1340); ctx.lineTo(3320, 1460);
    ctx.stroke();

    // Zona 5 jalur batu pasir Lembah Logika
    ctx.strokeStyle = '#AC865C';
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(2340, 1340); ctx.lineTo(1260, 1340);
    ctx.moveTo(1960, 1340); ctx.lineTo(1960, 1170);
    ctx.moveTo(1520, 1340); ctx.lineTo(1520, 1170);
    ctx.moveTo(1800, 1340); ctx.lineTo(1800, 1490);
    ctx.stroke();

    // Zona 6 jalan bintang Puncak Orator
    ctx.strokeStyle = '#4B4174';
    ctx.lineWidth = 52;
    ctx.beginPath();
    ctx.moveTo(1100, 1340); ctx.lineTo(540, 1340); ctx.lineTo(540, 1240);
    ctx.stroke();

    // Bintang tanah Zona 6
    for (let i = 0; i < 28; i++) {
      const sx = 60 + ((i * 193) % 1000);
      const sy = 960 + ((i * 137) % 720);
      const alpha = 0.2 + 0.45 * Math.abs(Math.sin(nowSec * 1.8 + i));
      ctx.fillStyle = `rgba(255, 224, 130, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBridgesAndGates(ctx, nowSec, solvedGates) {
    for (const br of BRIDGES) {
      const { x, y, w, h } = br.rect;
      const unlocked = solvedGates.includes(br.id);

      ctx.fillStyle = br.gateLevel === 2 || br.gateLevel === 3 ? '#3B4A5E' : '#8C5B35';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#1B1714';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);

      ctx.strokeStyle = 'rgba(0,0,0,0.28)';
      ctx.lineWidth = 2;
      if (br.orientation === 'horizontal') {
        for (let px = x + 16; px < x + w; px += 18) {
          ctx.beginPath();
          ctx.moveTo(px, y + 4);
          ctx.lineTo(px, y + h - 4);
          ctx.stroke();
        }
      } else {
        for (let py = y + 16; py < y + h; py += 18) {
          ctx.beginPath();
          ctx.moveTo(x + 4, py);
          ctx.lineTo(x + w - 4, py);
          ctx.stroke();
        }
      }

      // Altar Batu Segel Matematika
      const ax = br.altar.x;
      const ay = br.altar.y;
      ctx.fillStyle = '#1E1A24';
      ctx.beginPath();
      ctx.arc(ax, ay, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = unlocked ? '#48C78E' : '#FFD166';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = unlocked ? '#48C78E' : '#FFD166';
      ctx.font = '800 16px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(unlocked ? '✓' : 'Σ', ax, ay + 6);

      if (!unlocked) {
        const pulse = 0.55 + 0.35 * Math.sin(nowSec * 4.5);
        ctx.fillStyle = `rgba(230, 74, 25, ${0.34 * pulse})`;
        ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

        ctx.strokeStyle = `rgba(255, 209, 102, ${pulse})`;
        ctx.lineWidth = 4;
        if (br.orientation === 'horizontal') {
          const midX = x + w / 2;
          ctx.beginPath();
          ctx.moveTo(midX, y + 6);
          ctx.lineTo(midX, y + h - 6);
          ctx.stroke();
        } else {
          const midY = y + h / 2;
          ctx.beginPath();
          ctx.moveTo(x + 6, midY);
          ctx.lineTo(x + w - 6, midY);
          ctx.stroke();
        }

        const cx = x + w / 2;
        const cy = y + h / 2 + Math.sin(nowSec * 3) * 4;
        ctx.fillStyle = '#1B1714';
        ctx.beginPath();
        ctx.roundRect(cx - 56, cy - 16, 112, 32, 16);
        ctx.fill();
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FFD166';
        ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`SEGEL MTK LV.${br.targetZone}`, cx, cy + 4);
      }
      ctx.textAlign = 'left';
    }
  }

  drawLandmark(ctx, lm, nowSec) {
    if (lm.type === 'warkop') {
      ctx.fillStyle = 'rgba(27,23,20,0.22)';
      ctx.fillRect(lm.x + 8, lm.y + 12, lm.w, lm.h);
      ctx.fillStyle = '#5C3A24';
      ctx.beginPath();
      ctx.roundRect(lm.x, lm.y + 28, lm.w, lm.h - 28, 8);
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#E64A19' : '#FBF6EC';
        ctx.fillRect(lm.x + i * (lm.w / 8), lm.y, lm.w / 8, 36);
      }
      ctx.strokeStyle = '#1B1714';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(lm.x, lm.y, lm.w, 36);
      ctx.fillStyle = '#1B1714';
      ctx.fillRect(lm.x + 18, lm.y + 48, lm.w - 36, 26);
      ctx.fillStyle = '#FFD166';
      ctx.font = '800 13px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2, lm.y + 66);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'posronda') {
      ctx.fillStyle = 'rgba(27,23,20,0.2)';
      ctx.fillRect(lm.x + 6, lm.y + 10, lm.w, lm.h);
      ctx.fillStyle = '#735036';
      ctx.fillRect(lm.x + 8, lm.y + 26, lm.w - 16, lm.h - 26);
      ctx.fillStyle = '#3B6E5C';
      ctx.beginPath();
      ctx.moveTo(lm.x - 6, lm.y + 30);
      ctx.lineTo(lm.x + lm.w / 2, lm.y - 6);
      ctx.lineTo(lm.x + lm.w + 6, lm.y + 30);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FBF6EC';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2, lm.y + 52);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'pond') {
      ctx.fillStyle = '#4B9FC2';
      ctx.beginPath();
      ctx.ellipse(lm.x + lm.w / 2, lm.y + lm.h / 2, lm.w / 2, lm.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#C9B182';
      ctx.lineWidth = 6;
      ctx.stroke();
      const r = 14 + ((nowSec * 18) % 34);
      ctx.strokeStyle = `rgba(255,255,255,${1 - r / 50})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(lm.x + lm.w * 0.55, lm.y + lm.h * 0.45, r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    if (lm.type === 'hanok') {
      // Paviliun Korea (Atap lengkung gelap + pilar merah hangat)
      ctx.fillStyle = 'rgba(27,23,20,0.2)';
      ctx.fillRect(lm.x + 8, lm.y + 10, lm.w, lm.h);
      ctx.fillStyle = '#FBF6EC';
      ctx.beginPath();
      ctx.roundRect(lm.x + 8, lm.y + 28, lm.w - 16, lm.h - 28, 6);
      ctx.fill();
      // Atap Hanok lengkung
      ctx.fillStyle = '#2B303A';
      ctx.beginPath();
      ctx.moveTo(lm.x - 14, lm.y + 30);
      ctx.quadraticCurveTo(lm.x + lm.w / 2, lm.y - 16, lm.x + lm.w + 14, lm.y + 30);
      ctx.lineTo(lm.x + lm.w + 4, lm.y + 38);
      ctx.lineTo(lm.x - 4, lm.y + 38);
      ctx.closePath();
      ctx.fill();
      // Pilar merah Korea
      ctx.fillStyle = '#C83E4D';
      ctx.fillRect(lm.x + 16, lm.y + 38, 12, lm.h - 38);
      ctx.fillRect(lm.x + lm.w - 28, lm.y + 38, 12, lm.h - 38);
      ctx.fillStyle = '#3A1922';
      ctx.font = '800 13px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2, lm.y + 72);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'polyglot') {
      ctx.fillStyle = 'rgba(27,23,20,0.18)';
      ctx.fillRect(lm.x + 8, lm.y + 10, lm.w, lm.h);
      ctx.fillStyle = '#F6EFE2';
      ctx.beginPath();
      ctx.roundRect(lm.x + 6, lm.y + 22, lm.w - 12, lm.h - 22, 8);
      ctx.fill();
      // Torii-inspired red arch roof
      ctx.fillStyle = '#C0392B';
      ctx.fillRect(lm.x - 8, lm.y, lm.w + 16, 12);
      ctx.fillRect(lm.x + 4, lm.y + 15, lm.w - 8, 8);
      ctx.fillStyle = '#1E3A5F';
      ctx.font = '800 13px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2, lm.y + 58);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'cyber_hub' || lm.type === 'scada_station') {
      const isCyber = lm.type === 'cyber_hub';
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(lm.x + 8, lm.y + 12, lm.w, lm.h);
      ctx.fillStyle = isCyber ? '#101C2C' : '#1E242E';
      ctx.beginPath();
      ctx.roundRect(lm.x, lm.y, lm.w, lm.h, 12);
      ctx.fill();
      ctx.strokeStyle = isCyber ? '#48DBFB' : '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Animated radar sweep / status lights
      const cx = lm.x + 36;
      const cy = lm.y + 38;
      ctx.strokeStyle = isCyber ? 'rgba(72,219,251,0.5)' : 'rgba(245,158,11,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();
      const ang = nowSec * 2.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * 18, cy + Math.sin(ang) * 18);
      ctx.stroke();

      ctx.fillStyle = isCyber ? '#48DBFB' : '#FDE047';
      ctx.font = '800 13px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2 + 16, lm.y + 66);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'server') {
      ctx.fillStyle = '#0E1722';
      ctx.beginPath();
      ctx.roundRect(lm.x, lm.y, lm.w, lm.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#334E68';
      ctx.lineWidth = 2;
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = Math.sin(nowSec * 5 + i + lm.x) > 0 ? '#48DBFB' : '#2EA46F';
        ctx.fillRect(lm.x + 10, lm.y + 14 + i * 16, 8, 5);
        ctx.fillStyle = '#243B53';
        ctx.fillRect(lm.x + 24, lm.y + 14 + i * 16, 24, 5);
      }
      return;
    }

    if (lm.type === 'turbine') {
      const cx = lm.x + lm.w / 2;
      const cy = lm.y + lm.h / 2;
      ctx.fillStyle = '#181D26';
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(nowSec * 3.2);
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 5;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(24, 0);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (lm.type === 'library' || lm.type === 'guild') {
      ctx.fillStyle = 'rgba(27,23,20,0.18)';
      ctx.fillRect(lm.x + 8, lm.y + 10, lm.w, lm.h);
      ctx.fillStyle = lm.type === 'library' ? '#F6EFE2' : '#26466D';
      ctx.beginPath();
      ctx.roundRect(lm.x, lm.y + 22, lm.w, lm.h - 22, 8);
      ctx.fill();
      ctx.fillStyle = lm.type === 'library' ? '#7D2E46' : '#E64A19';
      ctx.beginPath();
      ctx.roundRect(lm.x - 6, lm.y, lm.w + 12, 30, 8);
      ctx.fill();
      ctx.fillStyle = lm.type === 'library' ? '#4A1826' : '#FBF6EC';
      ctx.font = '800 13px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.label, lm.x + lm.w / 2, lm.y + 62);
      ctx.textAlign = 'left';
      return;
    }

    if (lm.type === 'fountain') {
      const cx = lm.x + lm.w / 2;
      const cy = lm.y + lm.h / 2;
      ctx.fillStyle = '#BFB3A2';
      ctx.beginPath();
      ctx.arc(cx, cy, 54, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#53B4DC';
      ctx.beginPath();
      ctx.arc(cx, cy, 44, 0, Math.PI * 2);
      ctx.fill();
      const pulse = 10 + ((nowSec * 22) % 28);
      ctx.strokeStyle = `rgba(255,255,255,${1 - pulse / 40})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#E5DCCF';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    if (lm.type === 'pillar') {
      ctx.fillStyle = 'rgba(27,23,20,0.22)';
      ctx.beginPath();
      ctx.ellipse(lm.x + 24, lm.y + 32, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E6D6BC';
      ctx.fillRect(lm.x + 4, lm.y - 26, 30, 58);
      ctx.fillStyle = '#F5E9D3';
      ctx.fillRect(lm.x, lm.y - 32, 38, 12);
      ctx.fillRect(lm.x, lm.y + 26, 38, 10);
      return;
    }

    if (lm.type === 'amphitheater') {
      const cx = lm.x + lm.w / 2;
      const cy = lm.y + lm.h / 2;
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.35)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 190, 140, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#3B3261';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 140, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 90, 62, 0, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    if (lm.type === 'stage_mic') {
      const cx = lm.x + lm.w / 2;
      const cy = lm.y + lm.h / 2;
      const glow = 0.3 + 0.25 * Math.sin(nowSec * 3.5);
      ctx.fillStyle = `rgba(255, 209, 102, ${glow})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(cx - 3, cy - 18, 6, 26);
      ctx.beginPath();
      ctx.roundRect(cx - 9, cy - 30, 18, 18, 9);
      ctx.fill();
    }
  }

  drawTree(ctx, tr, nowSec) {
    const sway = Math.sin(nowSec * 1.8 + tr.x * 0.02) * 2.5;
    if (tr.style === 'torch' || tr.style === 'star_lantern' || tr.style === 'cyber_pylon' || tr.style === 'energy_pylon') {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath();
      ctx.ellipse(tr.x, tr.y + 14, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      const pole = tr.style === 'cyber_pylon' ? '#1E3A5F' : tr.style === 'energy_pylon' ? '#475569' : '#5C4632';
      const orb = tr.style === 'cyber_pylon' ? '#48DBFB' : tr.style === 'energy_pylon' ? '#F59E0B' : tr.style === 'torch' ? '#FF9F1C' : '#FFE082';
      ctx.fillStyle = pole;
      ctx.fillRect(tr.x - 4, tr.y - 26, 8, 40);
      const glow = 16 + Math.sin(nowSec * 6 + tr.x) * 3;
      ctx.fillStyle = orb + '44';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y - 30, glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y - 30, 7, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.fillStyle = 'rgba(27,23,20,0.2)';
    ctx.beginPath();
    ctx.ellipse(tr.x, tr.y + 16, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6D4C3D';
    ctx.fillRect(tr.x - 6, tr.y - 4, 12, 22);

    if (tr.style === 'sakura') {
      ctx.fillStyle = '#E88DA4';
      ctx.beginPath();
      ctx.arc(tr.x + sway, tr.y - 22, 26, 0, Math.PI * 2);
      ctx.arc(tr.x - 14 + sway, tr.y - 12, 18, 0, Math.PI * 2);
      ctx.arc(tr.x + 15 + sway, tr.y - 12, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F7B5C6';
      ctx.beginPath();
      ctx.arc(tr.x - 4 + sway, tr.y - 28, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (tr.style === 'pine' || tr.style === 'cypress') {
      ctx.fillStyle = tr.style === 'cypress' ? '#4F6D48' : '#2E6943';
      ctx.beginPath();
      ctx.moveTo(tr.x + sway, tr.y - 52);
      ctx.lineTo(tr.x - 24, tr.y - 2);
      ctx.lineTo(tr.x + 24, tr.y - 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#3F824D';
      ctx.beginPath();
      ctx.arc(tr.x + sway, tr.y - 20, 26, 0, Math.PI * 2);
      ctx.arc(tr.x - 14 + sway, tr.y - 10, 17, 0, Math.PI * 2);
      ctx.arc(tr.x + 15 + sway, tr.y - 10, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5CA461';
      ctx.beginPath();
      ctx.arc(tr.x - 5 + sway, tr.y - 26, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWaypoint(ctx, wp, unlocked, nowSec) {
    const hover = Math.sin(nowSec * 3.2 + wp.x) * 4;
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(wp.x, wp.y + 12, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4B4845';
    ctx.beginPath();
    ctx.ellipse(wp.x, wp.y + 8, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    if (unlocked) {
      ctx.fillStyle = 'rgba(72, 219, 251, 0.28)';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y - 16 + hover, 22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = unlocked ? '#48DBFB' : '#9B958F';
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wp.x, wp.y - 34 + hover);
    ctx.lineTo(wp.x + 11, wp.y - 16 + hover);
    ctx.lineTo(wp.x, wp.y + 2 + hover);
    ctx.lineTo(wp.x - 11, wp.y - 16 + hover);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawChest(ctx, ch, opened, nowSec) {
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.beginPath();
    ctx.ellipse(ch.x, ch.y + 10, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    const bodyCol = ch.tier === 'precious' ? '#9C4221' : ch.tier === 'exquisite' ? '#7B4B2A' : '#8A6240';
    const trimCol = ch.tier === 'precious' ? '#FFD166' : '#E5B85C';
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.roundRect(ch.x - 15, ch.y - 10, 30, 20, 4);
    ctx.fill();
    ctx.strokeStyle = trimCol;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    if (!opened) {
      ctx.fillStyle = trimCol;
      ctx.fillRect(ch.x - 4, ch.y - 3, 8, 7);
      const glint = Math.abs(Math.sin(nowSec * 3.6 + ch.x));
      ctx.fillStyle = `rgba(255, 240, 160, ${glint})`;
      ctx.beginPath();
      ctx.arc(ch.x + 10, ch.y - 14, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#241811';
      ctx.fillRect(ch.x - 12, ch.y - 10, 24, 6);
    }
  }

  drawEnemy(ctx, en, defeated, nowSec) {
    const hover = Math.sin(nowSec * 4.5 + en.x) * 4;
    const x = en.curX;
    const y = en.curY;

    // Danger aura ring
    ctx.strokeStyle = defeated ? 'rgba(72, 199, 142, 0.35)' : 'rgba(255, 82, 82, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 24, 11, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Monster silhouette body
    ctx.fillStyle = en.color;
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x, y - 6 + hover, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing angry eyes
    ctx.fillStyle = en.accent;
    ctx.beginPath();
    ctx.arc(x - 6, y - 8 + hover, 3.6, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 8 + hover, 3.6, 0, Math.PI * 2);
    ctx.fill();

    // Floating Attack Icon
    ctx.fillStyle = defeated ? '#48C78E' : '#FF5252';
    ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(defeated ? '✓ LATIH' : '⚔ LAWAN', x, y - 30 + hover);

    // Nameplate
    ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
    const tw = ctx.measureText(en.name).width + 14;
    ctx.fillStyle = 'rgba(20, 14, 18, 0.88)';
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, y + 18, tw, 17, 8);
    ctx.fill();
    ctx.fillStyle = defeated ? '#8CE9B5' : '#FF9E9E';
    ctx.fillText(en.name, x, y + 30);
    ctx.textAlign = 'left';
  }

  drawNpc(ctx, npc, isQuestTarget, isDone, nowSec) {
    const info = CAST[npc.id] || CAST.jaja;
    const bob = Math.sin(nowSec * 2.8 + npc.x) * 1.8;

    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.beginPath();
    ctx.ellipse(npc.x, npc.y + 16, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = info.shirt;
    ctx.beginPath();
    ctx.roundRect(npc.x - 13, npc.y - 8 + bob, 26, 22, 9);
    ctx.fill();
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = info.skin;
    ctx.beginPath();
    ctx.arc(npc.x, npc.y - 18 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = info.hair;
    ctx.beginPath();
    ctx.arc(npc.x, npc.y - 22 + bob, 12, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#1B1714';
    ctx.fillRect(npc.x - 5, npc.y - 19 + bob, 2.5, 3);
    ctx.fillRect(npc.x + 2.5, npc.y - 19 + bob, 2.5, 3);

    const isAcademy = npc.challengeType.startsWith('academy_');
    if (isQuestTarget || !isDone || isAcademy) {
      const floatY = npc.y - 44 + Math.sin(nowSec * 4.2) * 3.5;
      ctx.fillStyle = isQuestTarget ? '#FFD166' : isAcademy ? '#FF85A1' : '#48DBFB';
      ctx.strokeStyle = '#1B1714';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(npc.x, floatY - 10);
      ctx.lineTo(npc.x + 9, floatY);
      ctx.lineTo(npc.x, floatY + 10);
      ctx.lineTo(npc.x - 9, floatY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1B1714';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isAcademy ? '★' : '!', npc.x, floatY + 4);
    }

    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(info.name).width + 14;
    ctx.fillStyle = 'rgba(27, 23, 20, 0.84)';
    ctx.beginPath();
    ctx.roundRect(npc.x - textW / 2, npc.y + 20, textW, 18, 9);
    ctx.fill();
    ctx.fillStyle = isDone ? '#8CE9B5' : '#FBF6EC';
    ctx.fillText(info.name, npc.x, npc.y + 33);
    ctx.textAlign = 'left';
  }

  drawPlayer(ctx, player, nowSec) {
    const cls = getCharacterClass(player.characterClass);
    const walkBounce = player.moving ? Math.abs(Math.sin(nowSec * (player.sprinting ? 16 : 11))) * 4.5 : 0;
    const footSwing = player.moving ? Math.sin(nowSec * (player.sprinting ? 16 : 11)) * 5 : 0;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + 16, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2B211C';
    ctx.beginPath();
    ctx.arc(player.x - 6, player.y + 13 + footSwing * 0.6, 4.5, 0, Math.PI * 2);
    ctx.arc(player.x + 6, player.y + 13 - footSwing * 0.6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cls.cloakColor;
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(player.x - 13, player.y - 9 - walkBounce, 26, 22, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = cls.trimColor;
    ctx.beginPath();
    ctx.roundRect(player.x - 11, player.y - 9 - walkBounce, 22, 6, 3);
    ctx.fill();

    ctx.fillStyle = '#E0AC84';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 20 - walkBounce, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (cls.hatStyle === 'fedora') {
      ctx.fillStyle = '#4D3623';
      ctx.beginPath();
      ctx.ellipse(player.x, player.y - 27 - walkBounce, 17, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(player.x - 10, player.y - 36 - walkBounce, 20, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#48DBFB';
      ctx.fillRect(player.x - 10, player.y - 29 - walkBounce, 20, 2.5);
    } else if (cls.hatStyle === 'beret') {
      ctx.fillStyle = '#4A172B';
      ctx.beginPath();
      ctx.ellipse(player.x + 2, player.y - 28 - walkBounce, 15, 7, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = '#241B17';
      ctx.beginPath();
      ctx.arc(player.x, player.y - 23 - walkBounce, 12.5, Math.PI * 0.92, Math.PI * 0.08);
      ctx.fill();
      if (cls.hatStyle === 'goggles') {
        ctx.fillStyle = '#48DBFB';
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(player.x - 4.5, player.y - 26 - walkBounce, 3.6, 0, Math.PI * 2);
        ctx.arc(player.x + 4.5, player.y - 26 - walkBounce, 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#1B1714';
      }
    }

    if (player.facing !== 'up') {
      const ex = player.facing === 'left' ? -3 : player.facing === 'right' ? 3 : 0;
      ctx.fillStyle = '#1B1714';
      ctx.fillRect(player.x - 5 + ex, player.y - 20 - walkBounce, 2.6, 3.2);
      ctx.fillRect(player.x + 2.4 + ex, player.y - 20 - walkBounce, 2.6, 3.2);
    }
  }

  drawCiko(ctx, ciko, nowSec) {
    const hover = Math.sin(nowSec * 4) * 5;
    const x = ciko.x;
    const y = ciko.y - 16 + hover;
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y - 15, 9, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#FBF6EC';
    ctx.strokeStyle = '#2B1B12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 8, 18, 17, 5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 9, y, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = '#1B1714';
    ctx.fillRect(x - 4.5, y - 2, 2, 2.5);
    ctx.fillRect(x + 2.5, y - 2, 2, 2.5);

    if (ciko.bubble && ciko.bubbleTimer > 0) {
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      const tw = ctx.measureText(ciko.bubble).width + 18;
      ctx.fillStyle = 'rgba(27, 23, 20, 0.9)';
      ctx.beginPath();
      ctx.roundRect(x - tw / 2, y - 44, tw, 22, 11);
      ctx.fill();
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#FBF6EC';
      ctx.textAlign = 'center';
      ctx.fillText(ciko.bubble, x, y - 29);
      ctx.textAlign = 'left';
    }
  }

  drawQuestCompass(ctx, player, target, nowSec) {
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 85) return;
    const ang = Math.atan2(dy, dx);
    const orbit = 48 + Math.sin(nowSec * 5) * 3;
    const ax = player.x + Math.cos(ang) * orbit;
    const ay = player.y + Math.sin(ang) * orbit;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(ang);
    ctx.fillStyle = '#FFD166';
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-7, -7);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-7, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawParticles(ctx, nowSec) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const m of this.ambient) {
      if (
        m.x < this.cam.x - 20 ||
        m.x > this.cam.x + this.viewW + 20 ||
        m.y < this.cam.y - 20 ||
        m.y > this.cam.y + this.viewH + 20
      ) {
        continue;
      }
      let col = 'rgba(255, 240, 175, 0.5)';
      if (m.x > 1240 && m.x < 2360 && m.y < 800) col = 'rgba(255, 190, 210, 0.72)';
      else if (m.x > 2480 && m.y < 800) col = 'rgba(72, 219, 251, 0.6)';
      else if (m.x > 2480 && m.y > 920) col = 'rgba(253, 224, 71, 0.55)';
      else if (m.x < 1120 && m.y > 920) col = `rgba(255, 224, 130, ${0.4 + 0.4 * Math.sin(nowSec * 3 + m.phase)})`;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMinimap(save, player, activeQuest, enemies, nowSec) {
    const ctx = this.miniCtx;
    const mw = this.miniCanvas.width;
    const mh = this.miniCanvas.height;
    const sx = mw / WORLD_W;
    const sy = mh / WORLD_H;

    ctx.clearRect(0, 0, mw, mh);
    ctx.fillStyle = '#1E526E';
    ctx.fillRect(0, 0, mw, mh);

    for (const z of ZONES) {
      ctx.fillStyle = z.ground;
      ctx.fillRect(z.rect.x * sx, z.rect.y * sy, z.rect.w * sx, z.rect.h * sy);
    }

    for (const br of BRIDGES) {
      const open = save.solvedGates.includes(br.id);
      ctx.fillStyle = open ? '#8CE9B5' : '#E64A19';
      ctx.fillRect(br.rect.x * sx, br.rect.y * sy, br.rect.w * sx, br.rect.h * sy);
    }

    for (const wp of WAYPOINTS) {
      ctx.fillStyle = save.unlockedWaypoints.includes(wp.id) ? '#48DBFB' : '#888';
      ctx.beginPath();
      ctx.arc(wp.x * sx, wp.y * sy, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const en of enemies) {
      const def = (save.defeatedEnemies || []).includes(en.id);
      if (def) continue;
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.arc(en.curX * sx, en.curY * sy, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    if (activeQuest && activeQuest.target) {
      const pulse = 3.5 + Math.sin(nowSec * 5) * 1.8;
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(activeQuest.target.x * sx, activeQuest.target.y * sy, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E64A19';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x * sx, player.y * sy, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
