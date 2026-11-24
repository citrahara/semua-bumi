// Engine grafis 2D 60FPS untuk dunia terbuka Warkop Impact + Minimap interaktif.

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
    for (let i = 0; i < 65; i++) {
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

  spawnBurst(x, y, color = '#FFD166', count = 22) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.35;
      const spd = 45 + Math.random() * 125;
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
    // Smooth follow camera clamped to world bounds
    const targetX = Math.max(0, Math.min(WORLD_W - this.viewW, player.x - this.viewW / 2));
    const targetY = Math.max(0, Math.min(WORLD_H - this.viewH, player.y - this.viewH / 2));
    this.cam.x += (targetX - this.cam.x) * Math.min(1, dt * 8);
    this.cam.y += (targetY - this.cam.y) * Math.min(1, dt * 8);

    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 26);
    }

    // Update burst/dust particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Update ambient petals/embers/stars
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
    const { player, ciko, save, activeQuest, nearestInteract } = state;

    ctx.save();
    // Base water ocean backdrop
    ctx.fillStyle = '#2B7A9E';
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    ctx.translate(-Math.round(this.cam.x + shakeX), -Math.round(this.cam.y + shakeY));

    // 1. Animated river water ripples
    this.drawRiverWater(ctx, nowSec);

    // 2. 4 Biome islands & footpaths
    this.drawZonesAndPaths(ctx, nowSec);

    // 3. Bridges & Math Seal Gates
    this.drawBridgesAndGates(ctx, nowSec, save.solvedGates);

    // 4. Flat ground landmarks (Amphitheater)
    for (const lm of LANDMARKS) {
      if (!lm.solid) this.drawLandmark(ctx, lm, nowSec);
    }

    // 5. Click-to-move ring
    if (this.clickRing) {
      const t = 1 - this.clickRing.life / this.clickRing.maxLife;
      ctx.strokeStyle = `rgba(255, 209, 102, ${1 - t})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.clickRing.x, this.clickRing.y, 10 + t * 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 6. Y-sorted entities (Landmarks, Trees, Waypoints, Chests, NPCs, Player, Ciko)
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
      const isQuestTarget = activeQuest?.target?.label === CAST[npc.id]?.name;
      const isDone = save.completedNpcs.includes(npc.id);
      drawables.push({
        y: npc.y,
        draw: () => this.drawNpc(ctx, npc, isQuestTarget, isDone, nowSec)
      });
    }
    drawables.push({ y: player.y, draw: () => this.drawPlayer(ctx, player, nowSec) });
    drawables.push({ y: ciko.y + 4, draw: () => this.drawCiko(ctx, ciko, nowSec) });

    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    // 7. World-space golden navigation arrow around hero toward active quest
    if (activeQuest && activeQuest.target) {
      this.drawQuestCompass(ctx, player, activeQuest.target, nowSec);
    }

    // 8. Highlight ring on nearest interactable
    if (nearestInteract) {
      const pulse = 0.65 + 0.35 * Math.sin(nowSec * 5);
      ctx.strokeStyle = `rgba(255, 209, 102, ${pulse})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(nearestInteract.x, nearestInteract.y, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 9. Particles & Ambient motes
    this.drawParticles(ctx, nowSec);

    ctx.restore();

    // 10. Minimap update
    if (this.miniCtx) {
      this.drawMinimap(save, player, activeQuest, nowSec);
    }
  }

  drawRiverWater(ctx, nowSec) {
    ctx.fillStyle = '#2B7A9E';
    ctx.fillRect(1110, 0, 180, WORLD_H);
    ctx.fillRect(0, 750, WORLD_W, 140);

    // Animated water highlights
    ctx.strokeStyle = 'rgba(220, 248, 255, 0.25)';
    ctx.lineWidth = 2;
    const shift = (nowSec * 28) % 60;
    for (let y = 20; y < WORLD_H; y += 52) {
      ctx.beginPath();
      ctx.moveTo(1140, y + shift * 0.4);
      ctx.quadraticCurveTo(1200, y + shift * 0.4 + 8, 1255, y + shift * 0.4);
      ctx.stroke();
    }
    for (let x = 24; x < WORLD_W; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x + shift * 0.5, 815);
      ctx.quadraticCurveTo(x + shift * 0.5 + 18, 807, x + shift * 0.5 + 36, 815);
      ctx.stroke();
    }
  }

  drawZonesAndPaths(ctx, nowSec) {
    for (const z of ZONES) {
      const { x, y, w, h } = z.rect;
      // Shore rim
      ctx.fillStyle = z.id === 4 ? '#1E1A33' : '#C2A373';
      ctx.beginPath();
      ctx.roundRect(x + 8, y + 8, w - 16, h - 16, 26);
      ctx.fill();

      // Main terrain
      ctx.fillStyle = z.ground;
      ctx.beginPath();
      ctx.roundRect(x + 16, y + 16, w - 32, h - 32, 22);
      ctx.fill();

      // Subtle checkerboard biome texture patches
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

      // Zone name carved subtly in corner of ground
      ctx.fillStyle = z.id === 4 ? 'rgba(255, 209, 102, 0.22)' : 'rgba(27, 23, 20, 0.14)';
      ctx.font = '800 18px "Bricolage Grotesque", sans-serif';
      ctx.fillText(z.name.toUpperCase(), x + 46, y + 54);
    }

    // Winding footpaths connecting landmarks, NPCs, and bridges
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Zone 1 footpaths
    ctx.strokeStyle = '#E5CFA3';
    ctx.lineWidth = 44;
    ctx.beginPath();
    ctx.moveTo(250, 420);
    ctx.lineTo(450, 380);
    ctx.lineTo(1100, 380);
    ctx.moveTo(450, 380);
    ctx.lineTo(820, 235);
    ctx.moveTo(560, 380);
    ctx.lineTo(700, 575);
    ctx.stroke();

    // Zone 2 stone plaza avenues
    ctx.strokeStyle = '#D2BA94';
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(1300, 380);
    ctx.lineTo(1840, 380);
    ctx.lineTo(1840, 740);
    ctx.moveTo(1640, 380);
    ctx.lineTo(1640, 260);
    ctx.moveTo(1840, 460);
    ctx.lineTo(2090, 510);
    ctx.stroke();

    // Zone 3 sandstone arena paths
    ctx.strokeStyle = '#AC865C';
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(1840, 900);
    ctx.lineTo(1840, 1230);
    ctx.lineTo(1300, 1230);
    ctx.moveTo(1840, 1170);
    ctx.lineTo(2010, 1170);
    ctx.moveTo(1560, 1230);
    ctx.lineTo(1560, 1410);
    ctx.stroke();

    // Zone 4 starlight avenue
    ctx.strokeStyle = '#4B4174';
    ctx.lineWidth = 52;
    ctx.beginPath();
    ctx.moveTo(1100, 1230);
    ctx.lineTo(560, 1230);
    ctx.stroke();

    // Twinkling ground stars in Zone 4
    for (let i = 0; i < 28; i++) {
      const sx = 60 + ((i * 193) % 1000);
      const sy = 920 + ((i * 137) % 620);
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

      // Bridge timber & rails
      ctx.fillStyle = '#8C5B35';
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = '#54331B';
      ctx.lineWidth = 5;
      ctx.strokeRect(x, y, w, h);

      // Planks
      ctx.strokeStyle = 'rgba(42, 24, 12, 0.35)';
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

      // Math Seal Altar Pedestal in front of the bridge
      const ax = br.altar.x;
      const ay = br.altar.y;
      ctx.fillStyle = '#2B2521';
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

      // Arcane Barrier if locked!
      if (!unlocked) {
        const pulse = 0.55 + 0.35 * Math.sin(nowSec * 4.5);
        ctx.save();
        ctx.fillStyle = `rgba(230, 74, 25, ${0.32 * pulse})`;
        ctx.fillRect(x + 12, y + 12, w - 24, h - 24);

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

        // Floating Lock Tag
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
        ctx.restore();
      }
      ctx.textAlign = 'left';
    }
  }

  drawLandmark(ctx, lm, nowSec) {
    if (lm.type === 'warkop') {
      // Shadow
      ctx.fillStyle = 'rgba(27,23,20,0.22)';
      ctx.fillRect(lm.x + 8, lm.y + 12, lm.w, lm.h);
      // Wooden hut body
      ctx.fillStyle = '#5C3A24';
      ctx.beginPath();
      ctx.roundRect(lm.x, lm.y + 28, lm.w, lm.h - 28, 8);
      ctx.fill();
      // Striped terracotta/cream awning
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#E64A19' : '#FBF6EC';
        ctx.fillRect(lm.x + i * (lm.w / 8), lm.y, lm.w / 8, 36);
      }
      ctx.strokeStyle = '#1B1714';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(lm.x, lm.y, lm.w, 36);
      // Counter banner
      ctx.fillStyle = '#1B1714';
      ctx.fillRect(lm.x + 20, lm.y + 48, lm.w - 40, 26);
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
      // Ripple
      const r = 14 + ((nowSec * 18) % 34);
      ctx.strokeStyle = `rgba(255,255,255,${1 - r / 50})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(lm.x + lm.w * 0.55, lm.y + lm.h * 0.45, r, r * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
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
      ctx.arc(cx, cy, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#53B4DC';
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      ctx.fill();
      const pulse = 10 + ((nowSec * 22) % 30);
      ctx.strokeStyle = `rgba(255,255,255,${1 - pulse / 42})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#E5DCCF';
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
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
    if (tr.style === 'torch' || tr.style === 'star_lantern') {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath();
      ctx.ellipse(tr.x, tr.y + 14, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tr.style === 'torch' ? '#5C4632' : '#4E4478';
      ctx.fillRect(tr.x - 4, tr.y - 24, 8, 38);
      const glow = 16 + Math.sin(nowSec * 6 + tr.x) * 3;
      ctx.fillStyle = tr.style === 'torch' ? 'rgba(255, 145, 40, 0.32)' : 'rgba(255, 224, 130, 0.34)';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y - 28, glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tr.style === 'torch' ? '#FF9F1C' : '#FFE082';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y - 28, 7, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Shadow
    ctx.fillStyle = 'rgba(27,23,20,0.2)';
    ctx.beginPath();
    ctx.ellipse(tr.x, tr.y + 16, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Trunk
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

    // Stone base
    ctx.fillStyle = '#4B4845';
    ctx.beginPath();
    ctx.ellipse(wp.x, wp.y + 8, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating Genshin diamond crystal
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
      // Closed lid + shimmer sparkle
      ctx.fillStyle = trimCol;
      ctx.fillRect(ch.x - 4, ch.y - 3, 8, 7);
      const glint = Math.abs(Math.sin(nowSec * 3.6 + ch.x));
      ctx.fillStyle = `rgba(255, 240, 160, ${glint})`;
      ctx.beginPath();
      ctx.arc(ch.x + 10, ch.y - 14, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Open dark interior
      ctx.fillStyle = '#241811';
      ctx.fillRect(ch.x - 12, ch.y - 10, 24, 6);
    }
  }

  drawNpc(ctx, npc, isQuestTarget, isDone, nowSec) {
    const info = CAST[npc.id] || CAST.jaja;
    const bob = Math.sin(nowSec * 2.8 + npc.x) * 1.8;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.beginPath();
    ctx.ellipse(npc.x, npc.y + 16, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body cloak
    ctx.fillStyle = info.shirt;
    ctx.beginPath();
    ctx.roundRect(npc.x - 13, npc.y - 8 + bob, 26, 22, 9);
    ctx.fill();
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Head
    ctx.fillStyle = info.skin;
    ctx.beginPath();
    ctx.arc(npc.x, npc.y - 18 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair/hat cap
    ctx.fillStyle = info.hair;
    ctx.beginPath();
    ctx.arc(npc.x, npc.y - 22 + bob, 12, Math.PI, 0);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1B1714';
    ctx.fillRect(npc.x - 5, npc.y - 19 + bob, 2.5, 3);
    ctx.fillRect(npc.x + 2.5, npc.y - 19 + bob, 2.5, 3);

    // Floating Genshin Quest Diamond above head
    if (isQuestTarget || !isDone) {
      const floatY = npc.y - 44 + Math.sin(nowSec * 4.2) * 3.5;
      ctx.fillStyle = isQuestTarget ? '#FFD166' : '#48DBFB';
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
      ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', npc.x, floatY + 4);
    }

    // Nameplate
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(info.name).width + 14;
    ctx.fillStyle = 'rgba(27, 23, 20, 0.82)';
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

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + 16, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated feet
    ctx.fillStyle = '#2B211C';
    ctx.beginPath();
    ctx.arc(player.x - 6, player.y + 13 + footSwing * 0.6, 4.5, 0, Math.PI * 2);
    ctx.arc(player.x + 6, player.y + 13 - footSwing * 0.6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Cloak / Body sesuai jenis karakter
    ctx.fillStyle = cls.cloakColor;
    ctx.strokeStyle = '#1B1714';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(player.x - 13, player.y - 9 - walkBounce, 26, 22, 9);
    ctx.fill();
    ctx.stroke();

    // Trim / Syal khas kelas karakter
    ctx.fillStyle = cls.trimColor;
    ctx.beginPath();
    ctx.roundRect(player.x - 11, player.y - 9 - walkBounce, 22, 6, 3);
    ctx.fill();

    // Head
    ctx.fillStyle = '#E0AC84';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 20 - walkBounce, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair / Hat sesuai kelas karakter
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

    // Directional eyes
    if (player.facing !== 'up') {
      const ex = player.facing === 'left' ? -3 : player.facing === 'right' ? 3 : 0;
      ctx.fillStyle = '#1B1714';
      ctx.fillRect(player.x - 5 + ex, player.y - 20 - walkBounce, 2.6, 3.2);
      ctx.fillRect(player.x + 2.4 + ex, player.y - 20 - walkBounce, 2.6, 3.2);
    }
  }

  drawCiko(ctx, ciko, nowSec) {
    // Floating Paimon-style coffee spirit companion
    const hover = Math.sin(nowSec * 4) * 5;
    const x = ciko.x;
    const y = ciko.y - 16 + hover;

    // Halo
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y - 15, 9, 3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Tiny cup body
    ctx.fillStyle = '#FBF6EC';
    ctx.strokeStyle = '#2B1B12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 9, y - 8, 18, 17, 5);
    ctx.fill();
    ctx.stroke();

    // Cup handle
    ctx.beginPath();
    ctx.arc(x + 9, y, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Cute eyes
    ctx.fillStyle = '#1B1714';
    ctx.fillRect(x - 4.5, y - 2, 2, 2.5);
    ctx.fillRect(x + 2.5, y - 2, 2, 2.5);

    // Occasional floating witty quip bubble
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
    // Burst & dust
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Ambient biome motes inside camera viewport
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
      if (m.x > 1280 && m.y < 760) col = 'rgba(255, 190, 210, 0.72)'; // Sakura petals
      else if (m.x > 1280 && m.y > 880) col = 'rgba(255, 170, 70, 0.55)'; // Embers
      else if (m.x < 1120 && m.y > 880) col = `rgba(255, 224, 130, ${0.4 + 0.4 * Math.sin(nowSec * 3 + m.phase)})`; // Stars
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMinimap(save, player, activeQuest, nowSec) {
    const ctx = this.miniCtx;
    const mw = this.miniCanvas.width;
    const mh = this.miniCanvas.height;
    const sx = mw / WORLD_W;
    const sy = mh / WORLD_H;

    ctx.clearRect(0, 0, mw, mh);
    ctx.fillStyle = '#225A78';
    ctx.fillRect(0, 0, mw, mh);

    for (const z of ZONES) {
      ctx.fillStyle = z.ground;
      ctx.fillRect(z.rect.x * sx, z.rect.y * sy, z.rect.w * sx, z.rect.h * sy);
    }

    // Bridges / Gates
    for (const br of BRIDGES) {
      const open = save.solvedGates.includes(br.id);
      ctx.fillStyle = open ? '#8CE9B5' : '#E64A19';
      ctx.fillRect(br.rect.x * sx, br.rect.y * sy, br.rect.w * sx, br.rect.h * sy);
    }

    // Waypoints
    for (const wp of WAYPOINTS) {
      ctx.fillStyle = save.unlockedWaypoints.includes(wp.id) ? '#48DBFB' : '#999';
      ctx.beginPath();
      ctx.arc(wp.x * sx, wp.y * sy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Unopened chests
    for (const ch of CHESTS) {
      if (save.openedChests.includes(ch.id)) continue;
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(ch.x * sx - 2, ch.y * sy - 2, 4, 4);
    }

    // Active Quest Beacon
    if (activeQuest && activeQuest.target) {
      const pulse = 4 + Math.sin(nowSec * 5) * 2;
      ctx.strokeStyle = '#FFD166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(activeQuest.target.x * sx, activeQuest.target.y * sy, pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Player live marker
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E64A19';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x * sx, player.y * sy, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
