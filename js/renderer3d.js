// Engine 3D Alam Terbuka (Three.js r160) untuk Warkop Impact: Kronik 1894
// 6 Biome 3D berkontur, awan melayang, sungai berkilau, pohon bergoyang, bangunan 3D, tokoh 3D sesuai kelas, Ciko 3D, kamera orbit third-person + Minimap 2D!

import * as THREE from '../vendor/three.module.min.js';
import {
  WORLD_W,
  WORLD_H,
  ZONES,
  BRIDGES,
  WAYPOINTS,
  CHESTS,
  NPCS,
  LANDMARKS,
  TREES,
  getZoneAt
} from './world.js';
import { CAST } from './characters.js';
import { getCharacterClass } from './data/registration.js';

const S = 0.05; // 20px world.js = 1 meter 3D

const BIOME_SKY = {
  1: { sky: 0xd9e4c7, fog: 0xd6dec2, sun: 0xffe6b3 }, // Lembah Vintage 1894 hangat
  2: { sky: 0xf1d8cd, fog: 0xebd3c7, sun: 0xffe4d1 }, // Sakura Kota Bahasa
  3: { sky: 0x0c192c, fog: 0x102238, sun: 0x72e6ff }, // Malam Neon Distrik Siber
  4: { sky: 0x1f2530, fog: 0x252c38, sun: 0xffc864 }, // Senja Gardu SCADA
  5: { sky: 0xe6c89c, fog: 0xdec092, sun: 0xffd78a }, // Lembah Logika Perunggu
  6: { sky: 0x1c1736, fog: 0x231d42, sun: 0xffe082 }  // Langit Bintang Amfiteater
};

function makeLabelSprite(text, bg = 'rgba(24, 18, 14, 0.84)', color = '#FBF6EC', border = '#FFD166') {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  c.width = 360;
  c.height = 68;
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  const tw = Math.min(330, ctx.measureText(text).width + 36);
  const x = (c.width - tw) / 2;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, 12, tw, 44, 22);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, 35, 316);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(5.4, 1.02, 1);
  return sp;
}

export class WorldRenderer3D {
  constructor(canvas, minimapCanvas) {
    this.canvas = canvas;
    this.miniCanvas = minimapCanvas;
    this.miniCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();
    this.skyColor = new THREE.Color(BIOME_SKY[1].sky);
    this.fogColor = new THREE.Color(BIOME_SKY[1].fog);
    this.scene.background = this.skyColor.clone();
    this.scene.fog = new THREE.FogExp2(this.fogColor.getHex(), 0.0115);

    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.5, 260);
    this.cameraYaw = 0; // 0 = menghadap Utara (-Z)
    this.cameraPitch = 0.54;
    this.cameraDist = 17.5;

    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.shake = 0;
    this.particles = [];
    this.strikeEffects = [];
    this.strikeAnim = 0;
    this.swayTrees = [];
    this.spinners = [];
    this.clouds = [];
    this.gateBarriers = new Map();
    this.chestMeshes = new Map();
    this.waypointMeshes = new Map();
    this.npcMeshes = new Map();
    this.enemyMeshes = new Map();
    this.currentHeroClass = null;
    this.heroYaw = 0;

    this.setupLighting();
    this.buildEnvironment();
    this.buildHeroAndCiko();
    this.buildClickAndInteractRings();
    this.resize();
  }

  setupLighting() {
    this.hemi = new THREE.HemisphereLight(0xfff4d8, 0x5c4a35, 0.92);
    this.scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xffe6b3, 1.35);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.near = 2;
    this.sun.shadow.camera.far = 90;
    const d = 32;
    this.sun.shadow.camera.left = -d;
    this.sun.shadow.camera.right = d;
    this.sun.shadow.camera.top = d;
    this.sun.shadow.camera.bottom = -d;
    this.sun.shadow.bias = -0.001;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
  }

  buildEnvironment() {
    // 1. Samudra & Sungai 3D luas berkilau
    const waterGeo = new THREE.PlaneGeometry(420, 320, 1, 1);
    waterGeo.rotateX(-Math.PI / 2);
    this.waterMat = new THREE.MeshStandardMaterial({
      color: 0x2a7d9e,
      roughness: 0.28,
      metalness: 0.18
    });
    this.waterMesh = new THREE.Mesh(waterGeo, this.waterMat);
    this.waterMesh.position.set((WORLD_W * S) / 2, -0.45, (WORLD_H * S) / 2);
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);

    // 2. Pegunungan alam 3D jauh di cakrawala (biar terasa berada di lembah alam luas!)
    const mtnMat1 = new THREE.MeshStandardMaterial({ color: 0x4c6b53, roughness: 0.95, flatShading: true });
    const mtnMat2 = new THREE.MeshStandardMaterial({ color: 0x3b4d5e, roughness: 0.95, flatShading: true });
    const cx = (WORLD_W * S) / 2;
    const cz = (WORLD_H * S) / 2;
    for (let i = 0; i < 34; i++) {
      const ang = (i / 34) * Math.PI * 2;
      const rx = 115 + (i % 3) * 14;
      const rz = 76 + (i % 4) * 12;
      const h = 14 + (i % 5) * 6;
      const rad = 11 + (i % 4) * 4;
      const peak = new THREE.Mesh(new THREE.ConeGeometry(rad, h, 6), i % 2 === 0 ? mtnMat1 : mtnMat2);
      peak.position.set(cx + Math.cos(ang) * rx, h / 2 - 2, cz + Math.sin(ang) * rz);
      this.scene.add(peak);
    }

    // 3. Awan 3D lembut melayang di langit
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xfff8eb, roughness: 0.95, flatShading: true });
    for (let i = 0; i < 24; i++) {
      const cg = new THREE.Group();
      const s1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8, 0), cloudMat);
      const s2 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.1, 0), cloudMat);
      const s3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.9, 0), cloudMat);
      s2.position.set(2.2, -0.3, 0.4);
      s3.position.set(-2.1, -0.4, -0.3);
      cg.add(s1, s2, s3);
      cg.position.set(Math.random() * WORLD_W * S, 18 + (i % 4) * 2.5, Math.random() * WORLD_H * S);
      cg.scale.set(1.4, 0.65, 1.0);
      this.scene.add(cg);
      this.clouds.push({ mesh: cg, speed: 0.4 + (i % 3) * 0.25 });
    }

    // 4. 6 Pulau Daratan 3D dengan tebing batu/tanah + detail alam rumput & bunga!
    for (const z of ZONES) {
      const w = (z.rect.w - 16) * S;
      const d = (z.rect.h - 16) * S;
      const mx = (z.rect.x + z.rect.w / 2) * S;
      const mz = (z.rect.y + z.rect.h / 2) * S;

      // Dasar tebing
      const cliffCol = z.id === 3 ? 0x101c2c : z.id === 4 ? 0x1f252e : z.id === 6 ? 0x201b38 : 0x7c5e3c;
      const cliff = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.6, 1.5, d + 0.6),
        new THREE.MeshStandardMaterial({ color: cliffCol, roughness: 0.92 })
      );
      cliff.position.set(mx, -0.82, mz);
      cliff.receiveShadow = true;
      this.scene.add(cliff);

      // Permukaan tanah utama
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.16, d),
        new THREE.MeshStandardMaterial({ color: z.ground, roughness: 0.88 })
      );
      top.position.set(mx, -0.08, mz);
      top.receiveShadow = true;
      this.scene.add(top);

      // Grid neon halus di Zona 3 (Distrik Siber)
      if (z.id === 3) {
        const grid = new THREE.GridHelper(Math.max(w, d) - 2, 18, 0x48dbfb, 0x1d405c);
        grid.position.set(mx, 0.02, mz);
        grid.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
        this.scene.add(grid);
      }

      // Bukit kecil alami, batu & semak bunga hias di zona hijau/sakura/pasir
      if (z.id === 1 || z.id === 2 || z.id === 5) {
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x8f887d, roughness: 0.9, flatShading: true });
        const flowerCol = z.id === 2 ? 0xf7a8be : z.id === 5 ? 0xf5c451 : 0xffe082;
        const flowerMat = new THREE.MeshStandardMaterial({ color: flowerCol, roughness: 0.7 });
        for (let k = 0; k < 22; k++) {
          const rx = z.rect.x + 80 + ((k * 173 + z.id * 97) % (z.rect.w - 160));
          const ry = z.rect.y + 80 + ((k * 127 + z.id * 53) % (z.rect.h - 160));
          if (k % 3 === 0) {
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32 + (k % 3) * 0.1, 0), rockMat);
            rock.position.set(rx * S, 0.14, ry * S);
            rock.scale.set(1.2, 0.65, 1);
            this.scene.add(rock);
          } else {
            const fl = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), flowerMat);
            fl.position.set(rx * S, 0.14, ry * S);
            this.scene.add(fl);
          }
        }
      }
    }

    // 5. Jalan setapak 3D yang menghubungkan semua wilayah
    const addRoad = (x1, y1, x2, y2, col = 0xdec59a, width = 2.3) => {
      const dx = (x2 - x1) * S;
      const dz = (y2 - y1) * S;
      const len = Math.hypot(dx, dz);
      const road = new THREE.Mesh(
        new THREE.BoxGeometry(len + width * 0.6, 0.05, width),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.92 })
      );
      road.position.set(((x1 + x2) / 2) * S, 0.02, ((y1 + y2) / 2) * S);
      road.rotation.y = -Math.atan2(dz, dx);
      road.receiveShadow = true;
      this.scene.add(road);
    };
    // Zona 1
    addRoad(240, 420, 450, 400); addRoad(450, 400, 1100, 400);
    addRoad(450, 400, 820, 235); addRoad(450, 400, 420, 590);
    addRoad(580, 400, 740, 600); addRoad(450, 380, 245, 285);
    // Zona 2
    addRoad(1260, 400, 2340, 400, 0xd4bc96); addRoad(1620, 260, 1620, 615, 0xd4bc96);
    addRoad(2070, 260, 2070, 615, 0xd4bc96);
    // Zona 3
    addRoad(2500, 400, 3340, 400, 0x224163); addRoad(3040, 265, 3040, 780, 0x224163);
    // Zona 4
    addRoad(3040, 940, 3040, 1340, 0x3b4454); addRoad(3040, 1340, 2500, 1340, 0x3b4454);
    // Zona 5
    addRoad(2340, 1340, 1260, 1340, 0xb08a5e); addRoad(1960, 1340, 1960, 1170, 0xb08a5e);
    addRoad(1520, 1340, 1520, 1170, 0xb08a5e);
    // Zona 6
    addRoad(1100, 1340, 540, 1340, 0x4b4174); addRoad(540, 1340, 540, 1240, 0x4b4174);

    // 6. 5 Jembatan 3D + Dinding Segel Matematika 3D bercahaya!
    for (const br of BRIDGES) {
      const bx = (br.rect.x + br.rect.w / 2) * S;
      const bz = (br.rect.y + br.rect.h / 2) * S;
      const bw = br.rect.w * S;
      const bd = br.rect.h * S;

      const deckCol = br.gateLevel === 2 || br.gateLevel === 3 ? 0x415269 : 0x8a5a36;
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(bw, 0.3, bd),
        new THREE.MeshStandardMaterial({ color: deckCol, roughness: 0.8 })
      );
      deck.position.set(bx, -0.05, bz);
      deck.receiveShadow = true;
      deck.castShadow = true;
      this.scene.add(deck);

      // Pagar jembatan 3D
      const railMat = new THREE.MeshStandardMaterial({ color: 0x4e321c, roughness: 0.85 });
      if (br.orientation === 'horizontal') {
        for (const sgn of [-1, 1]) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.55, 0.22), railMat);
          rail.position.set(bx, 0.35, bz + sgn * (bd / 2 - 0.15));
          this.scene.add(rail);
        }
      } else {
        for (const sgn of [-1, 1]) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, bd), railMat);
          rail.position.set(bx + sgn * (bw / 2 - 0.15), 0.35, bz);
          this.scene.add(rail);
        }
      }

      // Altar Batu Segel Matematika 3D
      const altarGroup = new THREE.Group();
      const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.75, 1.1, 6),
        new THREE.MeshStandardMaterial({ color: 0x2b2524, roughness: 0.7 })
      );
      ped.position.y = 0.55;
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.42, 0),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xe64a19, emissiveIntensity: 0.55 })
      );
      gem.position.y = 1.65;
      altarGroup.add(ped, gem);
      altarGroup.position.set(br.altar.x * S, 0, br.altar.y * S);
      this.scene.add(altarGroup);

      // Dinding Energi Segel Matematika (hilang saat terbuka!)
      const wallGroup = new THREE.Group();
      const wallGeo =
        br.orientation === 'horizontal'
          ? new THREE.BoxGeometry(0.45, 3.2, bd - 0.4)
          : new THREE.BoxGeometry(bw - 0.4, 3.2, 0.45);
      const wallMesh = new THREE.Mesh(
        wallGeo,
        new THREE.MeshStandardMaterial({
          color: 0xe64a19,
          emissive: 0xff9f1c,
          emissiveIntensity: 0.65,
          transparent: true,
          opacity: 0.55
        })
      );
      wallMesh.position.y = 1.6;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.08, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.8 })
      );
      ring.position.y = 1.8;
      if (br.orientation === 'horizontal') ring.rotation.y = Math.PI / 2;
      const tag = makeLabelSprite(`SEGEL MTK LV.${br.targetZone}`, 'rgba(27,20,16,0.9)', '#FFD166', '#E64A19');
      tag.position.y = 3.8;
      wallGroup.add(wallMesh, ring, tag);
      wallGroup.position.set(bx, 0, bz);
      this.scene.add(wallGroup);

      this.gateBarriers.set(br.id, { wallGroup, gem, ring });
    }

    // 7. Bangunan Landmark 3D Ikonik
    for (const lm of LANDMARKS) {
      this.buildLandmark3D(lm);
    }

    // 8. Pepohonan & Lentera 3D Bergoyang
    for (const tr of TREES) {
      this.buildTree3D(tr);
    }

    // 9. 6 Waypoint Teleportasi 3D (Kristal melayang ala Genshin!)
    for (const wp of WAYPOINTS) {
      const wg = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.95, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0x4b4845, roughness: 0.8 })
      );
      base.position.y = 0.18;
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x9b958f,
        emissive: 0x48dbfb,
        emissiveIntensity: 0.08,
        roughness: 0.25
      });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), crystalMat);
      crystal.scale.set(0.85, 1.5, 0.85);
      crystal.position.y = 1.75;
      const aura = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.05, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0x48dbfb, transparent: true, opacity: 0.65 })
      );
      aura.rotation.x = Math.PI / 2;
      aura.position.y = 0.45;
      wg.add(base, crystal, aura);
      wg.position.set(wp.x * S, 0, wp.y * S);
      this.scene.add(wg);
      this.waypointMeshes.set(wp.id, { group: wg, crystal, crystalMat, aura });
    }

    // 10. 12 Peti Harta Karun 3D
    for (const ch of CHESTS) {
      const cg = new THREE.Group();
      const bodyCol = ch.tier === 'precious' ? 0x9c4221 : ch.tier === 'exquisite' ? 0x7b4b2a : 0x8a6240;
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.72, 0.78),
        new THREE.MeshStandardMaterial({ color: bodyCol, roughness: 0.7 })
      );
      box.position.y = 0.36;
      box.castShadow = true;
      const lid = new THREE.Mesh(
        new THREE.BoxGeometry(1.16, 0.24, 0.84),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.4, roughness: 0.35 })
      );
      lid.position.y = 0.78;
      cg.add(box, lid);
      cg.position.set(ch.x * S, 0, ch.y * S);
      this.scene.add(cg);
      this.chestMeshes.set(ch.id, { group: cg, lid });
    }

    // 11. Semua NPC 3D Hidup (Mata Ekspresif + Lengan Melambai + Menoleh ke Pemain!) + Label + Permata Quest
    const eyeDarkMat = new THREE.MeshBasicMaterial({ color: 0x1a1412 });
    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (const npc of NPCS) {
      const info = CAST[npc.id] || CAST.jaja;
      const ng = new THREE.Group();
      const rig = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.5, 1.05, 10),
        new THREE.MeshStandardMaterial({ color: info.shirt, roughness: 0.75 })
      );
      body.position.y = 0.56;
      body.castShadow = true;

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 12, 10),
        new THREE.MeshStandardMaterial({ color: info.skin, roughness: 0.7 })
      );
      head.position.y = 1.38;
      head.castShadow = true;

      // Mata ekspresif + kilau cahaya di wajah NPC (+Z)
      for (const sx of [-0.14, 0.14]) {
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 8), eyeDarkMat);
        pupil.position.set(sx, 1.37, 0.385);
        const glint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), eyeGlintMat);
        glint.position.set(sx + 0.02, 1.39, 0.432);
        rig.add(pupil, glint);
      }

      // Monokel kuningan khas Tuan George (Orwell)
      if (npc.id === 'orwell') {
        const mono = new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.018, 6, 16),
          new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.8, roughness: 0.2 })
        );
        mono.position.set(0.14, 1.37, 0.415);
        rig.add(mono);
      }

      const hat = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.44),
        new THREE.MeshStandardMaterial({ color: info.hair, roughness: 0.8 })
      );
      hat.position.y = 1.45;

      // Lengan kiri & kanan berengsel di bahu supaya NPC bisa melambai saat pemain mendekat
      const sleeveMat = new THREE.MeshStandardMaterial({ color: info.shirt, roughness: 0.75 });
      const handMat = new THREE.MeshStandardMaterial({ color: info.skin, roughness: 0.7 });

      const makeNpcArm = (side) => {
        const armGrp = new THREE.Group();
        armGrp.position.set(side * 0.46, 0.96, 0);
        const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.34, 4, 8), sleeveMat);
        sleeve.position.y = -0.22;
        sleeve.castShadow = true;
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), handMat);
        hand.position.y = -0.44;
        armGrp.add(sleeve, hand);
        return armGrp;
      };
      const leftArm = makeNpcArm(-1);
      const rightArm = makeNpcArm(1);

      rig.add(body, head, hat, leftArm, rightArm);

      const diamondMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffa000,
        emissiveIntensity: 0.55
      });
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), diamondMat);
      diamond.position.y = 2.48;

      const lbl = makeLabelSprite(info.name, 'rgba(24,18,14,0.85)', '#FBF6EC', info.accent || '#FFD166');
      lbl.position.y = 3.28;

      ng.add(rig, diamond, lbl);
      ng.position.set(npc.x * S, 0, npc.y * S);
      this.scene.add(ng);
      this.npcMeshes.set(npc.id, { group: ng, rig, leftArm, rightArm, diamond, diamondMat, yaw: 0 });
    }
  }

  buildLandmark3D(lm) {
    const cx = (lm.x + lm.w / 2) * S;
    const cz = (lm.y + lm.h / 2) * S;
    const w = lm.w * S;
    const d = lm.h * S;

    if (lm.type === 'warkop') {
      const g = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(w, 2.2, d),
        new THREE.MeshStandardMaterial({ color: 0x5c3a24, roughness: 0.85 })
      );
      base.position.y = 1.1;
      base.castShadow = true;
      base.receiveShadow = true;
      // Atap tenda vintage bergaris
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(Math.max(w, d) * 0.72, 1.8, 4),
        new THREE.MeshStandardMaterial({ color: 0xd94e28, roughness: 0.75, flatShading: true })
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 3.0;
      roof.castShadow = true;
      const sign = makeLabelSprite(lm.label, 'rgba(34,20,12,0.92)', '#FFD166', '#E64A19');
      sign.position.y = 4.6;
      g.add(base, roof, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    if (lm.type === 'standup_stage') {
      // Panggung Kayu Open-Mic Stand-Up Vintage 1894!
      const g = new THREE.Group();
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.65, d),
        new THREE.MeshStandardMaterial({ color: 0x6e3b23, roughness: 0.8 })
      );
      deck.position.y = 0.32;
      deck.castShadow = true;
      deck.receiveShadow = true;
      const backdrop = new THREE.Mesh(
        new THREE.BoxGeometry(w - 0.3, 2.6, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x7a1f2b, roughness: 0.85 })
      );
      backdrop.position.set(0, 1.9, -d / 2 + 0.2);
      // Mikrofon kuningan berdiri
      const micPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.7, roughness: 0.2 })
      );
      micPole.position.set(0, 1.4, 0.4);
      const micHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffb703, emissiveIntensity: 0.45 })
      );
      micHead.position.set(0, 2.2, 0.4);
      const sign = makeLabelSprite('OPEN-MIC STAND-UP 1894', 'rgba(60,18,24,0.92)', '#FFD166', '#FFD166');
      sign.position.y = 3.9;
      g.add(deck, backdrop, micPole, micHead, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    if (lm.type === 'endless_tower') {
      // Menara Kronik Abadi 3D dengan cincin emas berputar!
      const g = new THREE.Group();
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 1.35, 6.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x263147, roughness: 0.55, flatShading: true })
      );
      spire.position.y = 3.1;
      spire.castShadow = true;
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.85, 0),
        new THREE.MeshStandardMaterial({ color: 0x48dbfb, emissive: 0x48dbfb, emissiveIntensity: 0.7 })
      );
      orb.position.y = 7.2;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.09, 8, 28),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffa000, emissiveIntensity: 0.65 })
      );
      ring.position.y = 5.2;
      ring.rotation.x = Math.PI / 3;
      const sign = makeLabelSprite('MENARA ABADI (∞)', 'rgba(18,26,44,0.92)', '#48DBFB', '#FFD166');
      sign.position.y = 8.7;
      g.add(spire, orb, ring, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      this.spinners.push({ mesh: ring, axis: 'z', speed: 1.6 });
      this.spinners.push({ mesh: orb, axis: 'y', speed: 1.4 });
      return;
    }

    if (lm.type === 'hanok') {
      const g = new THREE.Group();
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w - 0.6, 2.3, d - 0.6),
        new THREE.MeshStandardMaterial({ color: 0xfbf6ec, roughness: 0.85 })
      );
      wall.position.y = 1.15;
      wall.castShadow = true;
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 1.0, 0.7, d + 0.8),
        new THREE.MeshStandardMaterial({ color: 0x2b303a, roughness: 0.7 })
      );
      roof.position.y = 2.65;
      roof.castShadow = true;
      const roofTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, w + 1.1, 6),
        new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.7 })
      );
      roofTop.rotation.z = Math.PI / 2;
      roofTop.position.y = 3.2;
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xc83e4d, roughness: 0.65 });
      for (const sx of [-1, 1]) {
        const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.4, 8), pillarMat);
        pil.position.set(sx * (w / 2 - 0.5), 1.2, d / 2 - 0.2);
        g.add(pil);
      }
      const sign = makeLabelSprite(lm.label, 'rgba(43,48,58,0.92)', '#FFD166', '#C83E4D');
      sign.position.y = 4.6;
      g.add(wall, roof, roofTop, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    if (lm.type === 'polyglot') {
      const g = new THREE.Group();
      const house = new THREE.Mesh(
        new THREE.BoxGeometry(w - 0.8, 2.1, d - 0.8),
        new THREE.MeshStandardMaterial({ color: 0xf6efe2, roughness: 0.85 })
      );
      house.position.y = 1.05;
      house.castShadow = true;
      const toriiMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.6 });
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.38, 0.45), toriiMat);
      topBar.position.set(0, 3.1, d / 2);
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3.1, 8), toriiMat);
      p1.position.set(-w * 0.32, 1.55, d / 2);
      const p2 = p1.clone();
      p2.position.x = w * 0.32;
      const sign = makeLabelSprite(lm.label, 'rgba(30,58,95,0.92)', '#FBF6EC', '#C0392B');
      sign.position.y = 4.3;
      g.add(house, topBar, p1, p2, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    if (lm.type === 'cyber_hub' || lm.type === 'scada_station') {
      const isCyber = lm.type === 'cyber_hub';
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, 3.0, d),
        new THREE.MeshStandardMaterial({
          color: isCyber ? 0x101c2c : 0x242c37,
          roughness: 0.45,
          metalness: 0.35
        })
      );
      body.position.y = 1.5;
      body.castShadow = true;
      const neon = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.2, 0.22, d + 0.2),
        new THREE.MeshStandardMaterial({
          color: isCyber ? 0x48dbfb : 0xf59e0b,
          emissive: isCyber ? 0x48dbfb : 0xf59e0b,
          emissiveIntensity: 0.8
        })
      );
      neon.position.y = 3.05;
      // Piringan Radar Berputar 3D!
      const dish = new THREE.Mesh(
        new THREE.ConeGeometry(1.4, 0.8, 12, 1, true),
        new THREE.MeshStandardMaterial({
          color: isCyber ? 0x48dbfb : 0xfde047,
          side: THREE.DoubleSide,
          metalness: 0.5,
          roughness: 0.3
        })
      );
      dish.position.y = 4.2;
      dish.rotation.x = Math.PI * 0.32;
      const sign = makeLabelSprite(lm.label, 'rgba(12,24,40,0.94)', isCyber ? '#48DBFB' : '#FDE047', isCyber ? '#48DBFB' : '#F59E0B');
      sign.position.y = 5.6;
      g.add(body, neon, dish, sign);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      this.spinners.push({ mesh: dish, axis: 'y', speed: 1.5 });
      return;
    }

    if (lm.type === 'turbine') {
      const g = new THREE.Group();
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.4, 5.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 })
      );
      pole.position.y = 2.6;
      const rotor = new THREE.Group();
      rotor.position.set(0, 5.1, 0.35);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 });
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.2, 0.08), bladeMat);
        b.position.y = 1.1;
        const piv = new THREE.Group();
        piv.rotation.z = (i * Math.PI * 2) / 3;
        piv.add(b);
        rotor.add(piv);
      }
      g.add(pole, rotor);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      this.spinners.push({ mesh: rotor, axis: 'z', speed: 2.5 });
      return;
    }

    if (lm.type === 'server') {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(w, 3.2, d),
        new THREE.MeshStandardMaterial({ color: 0x0f1a28, emissive: 0x103952, emissiveIntensity: 0.35 })
      );
      box.position.set(cx, 1.6, cz);
      box.castShadow = true;
      this.scene.add(box);
      return;
    }

    if (lm.type === 'pond') {
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(w * 0.48, w * 0.48, 0.12, 24),
        new THREE.MeshStandardMaterial({ color: 0x3ba4cc, roughness: 0.2, metalness: 0.2 })
      );
      p.scale.set(1, 1, d / w);
      p.position.set(cx, 0.03, cz);
      this.scene.add(p);
      return;
    }

    if (lm.type === 'fountain') {
      const g = new THREE.Group();
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 2.8, 0.65, 16),
        new THREE.MeshStandardMaterial({ color: 0xc9bfb0, roughness: 0.8 })
      );
      rim.position.y = 0.32;
      const wat = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.68, 16),
        new THREE.MeshStandardMaterial({ color: 0x48dbfb, roughness: 0.2 })
      );
      wat.position.y = 0.34;
      const spout = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.55, 1.8, 10),
        new THREE.MeshStandardMaterial({ color: 0xded5c8, roughness: 0.7 })
      );
      spout.position.y = 0.9;
      g.add(rim, wat, spout);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    if (lm.type === 'pillar') {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.72, 4.4, 12),
        new THREE.MeshStandardMaterial({ color: 0xe6d6bc, roughness: 0.8 })
      );
      col.position.set(cx, 2.2, cz);
      col.castShadow = true;
      this.scene.add(col);
      return;
    }

    if (lm.type === 'amphitheater') {
      const ring1 = new THREE.Mesh(
        new THREE.RingGeometry(4.2, 7.6, 32),
        new THREE.MeshStandardMaterial({ color: 0x3b3261, side: THREE.DoubleSide, roughness: 0.75 })
      );
      ring1.rotation.x = -Math.PI / 2;
      ring1.position.set(cx, 0.05, cz);
      const trim = new THREE.Mesh(
        new THREE.TorusGeometry(4.3, 0.14, 8, 36),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffa000, emissiveIntensity: 0.45 })
      );
      trim.rotation.x = Math.PI / 2;
      trim.position.set(cx, 0.15, cz);
      this.scene.add(ring1, trim);
      return;
    }

    if (lm.type === 'stage_mic') {
      const g = new THREE.Group();
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.45, 2.2, 10),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.7, roughness: 0.25 })
      );
      stand.position.y = 1.1;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 12, 10),
        new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffc300, emissiveIntensity: 0.75 })
      );
      head.position.y = 2.4;
      g.add(stand, head);
      g.position.set(cx, 0, cz);
      this.scene.add(g);
      return;
    }

    // Default building (Balai Pustaka, Guild, Pos Ronda, Ruang Retorika)
    const g = new THREE.Group();
    const isLib = lm.type === 'library';
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(w, 2.4, d),
      new THREE.MeshStandardMaterial({ color: isLib ? 0xf6efe2 : lm.type === 'guild' ? 0x26466d : 0x735036, roughness: 0.85 })
    );
    wall.position.y = 1.2;
    wall.castShadow = true;
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.7, 0.6, d + 0.7),
      new THREE.MeshStandardMaterial({ color: isLib ? 0x7d2e46 : lm.type === 'guild' ? 0xe64a19 : 0x3b6e5c, roughness: 0.75 })
    );
    roof.position.y = 2.7;
    roof.castShadow = true;
    g.add(wall, roof);
    if (lm.label) {
      const sign = makeLabelSprite(lm.label, 'rgba(30,22,18,0.9)', '#FFD166', '#E5B85C');
      sign.position.y = 4.2;
      g.add(sign);
    }
    g.position.set(cx, 0, cz);
    this.scene.add(g);
  }

  buildTree3D(tr) {
    const g = new THREE.Group();
    if (tr.style === 'torch' || tr.style === 'star_lantern' || tr.style === 'cyber_pylon' || tr.style === 'energy_pylon') {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.2, 2.8, 6),
        new THREE.MeshStandardMaterial({ color: 0x3d3530, roughness: 0.8 })
      );
      pole.position.y = 1.4;
      const orbCol =
        tr.style === 'cyber_pylon' ? 0x48dbfb : tr.style === 'energy_pylon' ? 0xf59e0b : tr.style === 'torch' ? 0xff9f1c : 0xffe082;
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.38, 0),
        new THREE.MeshStandardMaterial({ color: orbCol, emissive: orbCol, emissiveIntensity: 0.85 })
      );
      orb.position.y = 3.0;
      g.add(pole, orb);
      g.position.set(tr.x * S, 0, tr.y * S);
      this.scene.add(g);
      return;
    }

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 1.5, 7),
      new THREE.MeshStandardMaterial({ color: 0x6d4c3d, roughness: 0.9 })
    );
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    g.add(trunk);

    const crown = new THREE.Group();
    if (tr.style === 'pine' || tr.style === 'cypress') {
      const col = tr.style === 'cypress' ? 0x4a6b43 : 0x2e6943;
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.85, flatShading: true });
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.2, 7), mat);
      c1.position.y = 2.1;
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.8, 7), mat);
      c2.position.y = 3.3;
      c1.castShadow = c2.castShadow = true;
      crown.add(c1, c2);
    } else {
      const col = tr.style === 'sakura' ? 0xf09cb3 : 0x478a4e;
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.82, flatShading: true });
      const b1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 0), mat);
      b1.position.y = 2.45;
      const b2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), mat);
      b2.position.set(0.75, 2.1, 0.35);
      const b3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), mat);
      b3.position.set(-0.7, 2.0, -0.3);
      b1.castShadow = b2.castShadow = b3.castShadow = true;
      crown.add(b1, b2, b3);
    }

    g.add(crown);
    g.position.set(tr.x * S, 0, tr.y * S);
    this.scene.add(g);
    this.swayTrees.push({ crown, phase: tr.x * 0.05 });
  }

  buildHeroAndCiko() {
    this.heroGroup = new THREE.Group();
    this.scene.add(this.heroGroup);
    this.rebuildHeroMesh('orator');

    // Panah Kompas Emas 3D menuju Quest Utama
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffa000, emissiveIntensity: 0.7 });
    this.compassArrow = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 4), arrowMat);
    this.compassArrow.rotation.x = Math.PI / 2;
    this.scene.add(this.compassArrow);

    // Ciko 3D (Cangkir porselen melayang dengan lingkaran halo emas!)
    this.cikoGroup = new THREE.Group();
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.28, 0.56, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbf6ec, roughness: 0.3 })
    );
    const coffee = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.31, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0x3b2114, roughness: 0.2 })
    );
    coffee.position.y = 0.26;
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.045, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.7 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.55;
    this.cikoGroup.add(cup, coffee, halo);
    this.scene.add(this.cikoGroup);
  }

  rebuildHeroMesh(classId) {
    if (this.currentHeroClass === classId) return;
    this.currentHeroClass = classId;
    while (this.heroGroup.children.length > 0) this.heroGroup.remove(this.heroGroup.children[0]);

    const cls = getCharacterClass(classId);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a201a, roughness: 0.8 });
    this.leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.34, 4, 8), legMat);
    this.leftLeg.position.set(-0.2, 0.3, 0);
    this.rightLeg = this.leftLeg.clone();
    this.rightLeg.position.x = 0.2;

    this.heroBody = new THREE.Group();
    const cloakMat = new THREE.MeshStandardMaterial({ color: cls.cloakColor, roughness: 0.65 });
    const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.52, 0.96, 12), cloakMat);
    cloak.position.y = 0.82;
    cloak.castShadow = true;

    // Jubah punggung berkibar saat lari atau Strike!
    const capeGeo = new THREE.BoxGeometry(0.76, 0.92, 0.08);
    capeGeo.translate(0, -0.44, 0);
    this.capeMesh = new THREE.Mesh(
      capeGeo,
      new THREE.MeshStandardMaterial({ color: cls.trimColor, roughness: 0.6, side: THREE.DoubleSide })
    );
    this.capeMesh.position.set(0, 1.24, -0.34);
    this.capeMesh.rotation.x = 0.22;
    this.capeMesh.castShadow = true;

    const scarf = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.1, 8, 16),
      new THREE.MeshStandardMaterial({ color: cls.trimColor, roughness: 0.45 })
    );
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 1.24;

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xe0ac84, roughness: 0.68 })
    );
    head.position.y = 1.62;
    head.castShadow = true;

    // Mata ekspresif yang bisa berkedip + rona pipi hangat
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1b1411 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xf48c7a, transparent: true, opacity: 0.55 });
    this.leftEye = new THREE.Group();
    this.leftEye.position.set(-0.15, 1.6, 0.385);
    const epL = new THREE.Mesh(new THREE.SphereGeometry(0.062, 8, 8), eyeMat);
    const egL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), glintMat);
    egL.position.set(0.02, 0.02, 0.05);
    this.leftEye.add(epL, egL);

    this.rightEye = this.leftEye.clone();
    this.rightEye.position.x = 0.15;

    const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), blushMat);
    blushL.scale.set(1.3, 0.6, 0.4);
    blushL.position.set(-0.24, 1.51, 0.34);
    const blushR = blushL.clone();
    blushR.position.x = 0.24;

    // Lengan Kiri & Kanan berengsel bahu (mengayun saat jalan & menebas saat Strike!)
    const handMat = new THREE.MeshStandardMaterial({ color: 0xe0ac84, roughness: 0.68 });
    const makeArm = (side) => {
      const grp = new THREE.Group();
      grp.position.set(side * 0.48, 1.16, 0);
      const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.36, 4, 8), cloakMat);
      sleeve.position.y = -0.22;
      sleeve.castShadow = true;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 8), handMat);
      hand.position.y = -0.46;
      grp.add(sleeve, hand);
      return grp;
    };
    this.leftArm = makeArm(-1);
    this.rightArm = makeArm(1);

    // Senjata / Alat Ikonik 3D di Tangan Kanan sesuai Kelas Karakter!
    this.weaponGroup = new THREE.Group();
    this.weaponGroup.position.set(0, -0.46, 0.14);
    this.weaponGroup.rotation.x = Math.PI * 0.38;
    this.weaponGlowMat = null;

    if (classId === 'pujangga') {
      // Pena Bulu Emas Pujangga
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.055, 1.25, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.7, roughness: 0.2 })
      );
      shaft.position.y = 0.42;
      this.weaponGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffeef2,
        emissive: 0xe84393,
        emissiveIntensity: 0.55,
        roughness: 0.3
      });
      const plume = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.78, 6), this.weaponGlowMat);
      plume.position.y = 0.88;
      plume.scale.set(1.0, 1.0, 0.35);
      this.weaponGroup.add(shaft, plume);
    } else if (classId === 'detektif') {
      // Kaca Pembesar Kristal Siber
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.06, 0.85, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 })
      );
      handle.position.y = 0.25;
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.055, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.8, roughness: 0.2 })
      );
      rim.position.y = 0.92;
      this.weaponGlowMat = new THREE.MeshStandardMaterial({
        color: 0x48dbfb,
        emissive: 0x48dbfb,
        emissiveIntensity: 0.65,
        transparent: true,
        opacity: 0.75
      });
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16), this.weaponGlowMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.y = 0.92;
      this.weaponGroup.add(handle, rim, lens);
    } else if (classId === 'alkemis') {
      // Tongkat Rune Alkemis + Kristal Emas Melayang
      const staff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.065, 1.45, 8),
        new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5, metalness: 0.4 })
      );
      staff.position.y = 0.48;
      this.weaponGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0x48dbfb,
        emissiveIntensity: 0.75
      });
      const runeGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.25, 0), this.weaponGlowMat);
      runeGem.position.y = 1.32;
      this.weaponGroup.add(staff, runeGem);
    } else {
      // Orator Api: Tongkat Mikrofon Emas 1894 Bercahaya!
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.06, 1.25, 8),
        new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.5, metalness: 0.3 })
      );
      rod.position.y = 0.42;
      this.weaponGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xff9f1c,
        emissiveIntensity: 0.7,
        metalness: 0.6,
        roughness: 0.2
      });
      const micOrb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), this.weaponGlowMat);
      micOrb.position.y = 1.12;
      const micHalo = new THREE.Mesh(
        new THREE.TorusGeometry(0.29, 0.03, 6, 18),
        new THREE.MeshBasicMaterial({ color: 0xffd166 })
      );
      micHalo.position.y = 1.12;
      this.weaponGroup.add(rod, micOrb, micHalo);
    }

    this.rightArm.add(this.weaponGroup);
    this.heroBody.add(cloak, this.capeMesh, scarf, head, this.leftEye, this.rightEye, blushL, blushR, this.leftArm, this.rightArm);

    if (cls.hatStyle === 'fedora') {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x4d3623 }));
      brim.position.y = 1.92;
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.4, 14), new THREE.MeshStandardMaterial({ color: 0x4d3623 }));
      crown.position.y = 2.12;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.1, 14), new THREE.MeshStandardMaterial({ color: 0x48dbfb, emissive: 0x48dbfb, emissiveIntensity: 0.35 }));
      band.position.y = 1.98;
      this.heroBody.add(brim, crown, band);
    } else if (cls.hatStyle === 'beret') {
      const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.44, 0.24, 14), new THREE.MeshStandardMaterial({ color: 0x4a172b }));
      beret.position.set(0.08, 2.02, 0);
      beret.rotation.z = -0.18;
      this.heroBody.add(beret);
    } else {
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.44),
        new THREE.MeshStandardMaterial({ color: 0x241b17 })
      );
      hair.position.y = 1.69;
      this.heroBody.add(hair);
      if (cls.hatStyle === 'goggles') {
        const gMat = new THREE.MeshStandardMaterial({ color: 0x48dbfb, emissive: 0x48dbfb, emissiveIntensity: 0.55 });
        const g1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), gMat);
        g1.position.set(-0.18, 1.84, 0.34);
        const g2 = g1.clone();
        g2.position.x = 0.18;
        this.heroBody.add(g1, g2);
      }
    }

    this.heroGroup.add(this.leftLeg, this.rightLeg, this.heroBody);
  }

  buildClickAndInteractRings() {
    this.clickRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.65, 24),
      new THREE.MeshBasicMaterial({ color: 0xffd166, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.clickRingMesh.rotation.x = -Math.PI / 2;
    this.clickRingMesh.position.y = 0.09;
    this.scene.add(this.clickRingMesh);
    this.clickRingLife = 0;

    this.interactRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.35, 28),
      new THREE.MeshBasicMaterial({ color: 0xffd166, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    this.interactRingMesh.rotation.x = -Math.PI / 2;
    this.interactRingMesh.position.y = 0.12;
    this.interactRingMesh.visible = false;
    this.scene.add(this.interactRingMesh);
  }

  ensureEnemyMesh(en) {
    if (this.enemyMeshes.has(en.id)) return this.enemyMeshes.get(en.id);
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: en.color,
      emissive: en.accent,
      emissiveIntensity: 0.32,
      roughness: 0.35,
      flatShading: true
    });
    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.74, 0), mat);
    body.position.y = 1.1;
    body.castShadow = true;

    // Mata menyala + cincin orbit bahaya agar musuh siber terlihat hidup & garang!
    const eyeGlow = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), eyeGlow);
    e1.position.set(-0.24, 0.12, 0.62);
    const e2 = e1.clone();
    e2.position.x = 0.24;
    body.add(e1, e2);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.055, 6, 20),
      new THREE.MeshBasicMaterial({ color: en.accent || 0xff5252, transparent: true, opacity: 0.78 })
    );
    orbitRing.position.y = 1.15;
    orbitRing.rotation.x = Math.PI / 2.6;

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(0.88, 1.12, 24),
      new THREE.MeshBasicMaterial({ color: 0xff5252, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.08;
    const lbl = makeLabelSprite(`⚔ ${en.name}`, 'rgba(38,14,18,0.9)', '#FF9E9E', '#FF5252');
    lbl.position.y = 2.68;
    g.add(body, orbitRing, aura, lbl);
    this.scene.add(g);
    const entry = { group: g, body, orbitRing, aura };
    this.enemyMeshes.set(en.id, entry);
    return entry;
  }

  triggerHeroStrike(x, y, facing = 'down', heavy = false) {
    this.strikeAnim = 0.4;
    const fx = facing === 'right' ? 1 : facing === 'left' ? -1 : 0;
    const fz = facing === 'down' ? 1 : facing === 'up' ? -1 : 0;
    const yaw = Math.atan2(fx, fz);
    const ox = x * S;
    const oz = y * S;
    const primaryCol = heavy ? 0x48dbfb : 0xffd166;
    const secondaryCol = heavy ? 0xffd166 : 0xff6b35;

    // 1. Tebasan Sabit Energi 3D utama meluncur ke depan!
    const slashMat = new THREE.MeshBasicMaterial({
      color: primaryCol,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const slashMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, heavy ? 0.22 : 0.16, 8, 26, Math.PI * 0.95),
      slashMat
    );
    slashMesh.position.set(ox + fx * 1.1, 1.25, oz + fz * 1.1);
    slashMesh.rotation.set(Math.PI / 2, 0, -yaw + Math.PI * 0.02);
    this.scene.add(slashMesh);
    this.strikeEffects.push({
      kind: 'slash',
      mesh: slashMesh,
      vx: fx * 14.5,
      vz: fz * 14.5,
      life: 0.36,
      maxLife: 0.36
    });

    // 2. Tebasan Silang Kedua (miring 26 derajat biar terasa sinematik!)
    const crossMat = new THREE.MeshBasicMaterial({
      color: secondaryCol,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const crossMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.12, 8, 22, Math.PI * 0.85),
      crossMat
    );
    crossMesh.position.set(ox + fx * 0.95, 1.32, oz + fz * 0.95);
    crossMesh.rotation.set(Math.PI / 2 + 0.42, 0.2, -yaw + Math.PI * 0.08);
    this.scene.add(crossMesh);
    this.strikeEffects.push({
      kind: 'slash',
      mesh: crossMesh,
      vx: fx * 12.0,
      vz: fz * 12.0,
      life: 0.32,
      maxLife: 0.32
    });

    // 3. Gelombang Kejut Tanah (Shockwave Ring) mengembang cepat!
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryCol,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.65, 1.05, 28), ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(ox + fx * 0.9, 0.16, oz + fz * 0.9);
    this.scene.add(ringMesh);
    this.strikeEffects.push({
      kind: 'ring',
      mesh: ringMesh,
      life: 0.42,
      maxLife: 0.42
    });

    // 4. Kilatan Cahaya Dinamis (PointLight) yang menerangi rumput & karakter di sekitar!
    const flash = new THREE.PointLight(primaryCol, heavy ? 8 : 5.5, 16);
    flash.position.set(ox + fx * 1.4, 1.8, oz + fz * 1.4);
    this.scene.add(flash);
    this.strikeEffects.push({
      kind: 'light',
      light: flash,
      startIntensity: heavy ? 8 : 5.5,
      life: 0.28,
      maxLife: 0.28
    });

    this.spawnBurst(x + fx * 38, y + fz * 38, heavy ? '#48DBFB' : '#FFD166', heavy ? 28 : 20);
    this.triggerShake(heavy ? 12 : 7);
  }

  spawnBurst(x, y, color = '#FFD166', count = 22) {
    const col = new THREE.Color(color);
    const mat = new THREE.MeshBasicMaterial({ color: col });
    const geo = new THREE.OctahedronGeometry(0.18, 0);
    for (let i = 0; i < Math.min(count, 26); i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x * S, 1.0, y * S);
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 2.5 + Math.random() * 5.5;
      this.scene.add(m);
      this.particles.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: 3.5 + Math.random() * 4.5,
        vz: Math.sin(ang) * spd,
        life: 0.75 + Math.random() * 0.35
      });
    }
  }

  spawnDust(x, y) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 6, 5),
      new THREE.MeshBasicMaterial({ color: 0xf7ecd7, transparent: true, opacity: 0.65 })
    );
    m.position.set(x * S + (Math.random() - 0.5) * 0.4, 0.16, y * S + (Math.random() - 0.5) * 0.4);
    this.scene.add(m);
    this.particles.push({ mesh: m, vx: 0, vy: 0.9, vz: 0, life: 0.35 });
  }

  triggerShake(amount = 8) {
    this.shake = Math.max(this.shake, amount * 0.04);
  }

  setClickTarget(x, y) {
    this.clickRingMesh.position.set(x * S, 0.09, y * S);
    this.clickRingLife = 0.65;
  }

  rotateCamera(deltaYaw) {
    this.cameraYaw += deltaYaw;
  }

  getCameraYaw() {
    return this.cameraYaw;
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
      return { x: hit.x / S, y: hit.z / S };
    }
    return null;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  update(dt, player) {
    // 1. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.vy -= 9.5 * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    // 1b. Update 3D Strike VFX (Slash Arc, Shockwave Ring, Flash Light)
    if (this.strikeAnim > 0) this.strikeAnim = Math.max(0, this.strikeAnim - dt);
    for (let i = this.strikeEffects.length - 1; i >= 0; i--) {
      const fx = this.strikeEffects[i];
      fx.life -= dt;
      const p = 1 - Math.max(0, fx.life / fx.maxLife);
      if (fx.kind === 'slash') {
        fx.mesh.position.x += fx.vx * dt;
        fx.mesh.position.z += fx.vz * dt;
        const sc = 0.85 + p * 0.95;
        fx.mesh.scale.set(sc, sc, sc);
        fx.mesh.material.opacity = Math.max(0, (1 - p) * 0.95);
      } else if (fx.kind === 'ring') {
        const sc = 0.7 + p * 3.8;
        fx.mesh.scale.set(sc, sc, 1);
        fx.mesh.material.opacity = Math.max(0, (1 - p) * 0.9);
      } else if (fx.kind === 'light') {
        fx.light.intensity = fx.startIntensity * (1 - p);
      }
      if (fx.life <= 0) {
        if (fx.mesh) {
          this.scene.remove(fx.mesh);
          fx.mesh.geometry?.dispose();
          fx.mesh.material?.dispose();
        }
        if (fx.light) {
          this.scene.remove(fx.light);
        }
        this.strikeEffects.splice(i, 1);
      }
    }

    // 2. Drift clouds
    for (const c of this.clouds) {
      c.mesh.position.x += c.speed * dt;
      if (c.mesh.position.x > WORLD_W * S + 20) c.mesh.position.x = -20;
    }

    // 3. Click ring decay
    if (this.clickRingLife > 0) {
      this.clickRingLife = Math.max(0, this.clickRingLife - dt);
      const t = 1 - this.clickRingLife / 0.65;
      const sc = 0.6 + t * 2.2;
      this.clickRingMesh.scale.set(sc, sc, 1);
      this.clickRingMesh.material.opacity = 1 - t;
    } else {
      this.clickRingMesh.material.opacity = 0;
    }

    // 4. Smooth Biome Sky/Fog blending!
    const zone = getZoneAt(player.x, player.y);
    const palette = BIOME_SKY[zone.id] || BIOME_SKY[1];
    this.skyColor.lerp(new THREE.Color(palette.sky), Math.min(1, dt * 2.5));
    this.fogColor.lerp(new THREE.Color(palette.fog), Math.min(1, dt * 2.5));
    this.scene.background.copy(this.skyColor);
    this.scene.fog.color.copy(this.fogColor);
    this.sun.color.lerp(new THREE.Color(palette.sun), Math.min(1, dt * 2.5));

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 1.4);
  }

  render(nowSec, state) {
    const { player, ciko, save, activeQuest, nearestInteract, enemies = [] } = state;

    // 1. Hero 3D transform, smooth turning, blinking, cape, arms & Strike slash animation!
    this.rebuildHeroMesh(player.characterClass || 'orator');
    const hx = player.x * S;
    const hz = player.y * S;
    this.heroGroup.position.set(hx, 0, hz);

    const targetRot =
      player.facing === 'up'
        ? Math.PI
        : player.facing === 'down'
        ? 0
        : player.facing === 'right'
        ? Math.PI / 2
        : -Math.PI / 2;
    let diff = targetRot - this.heroYaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.heroYaw += diff * 0.22;
    this.heroGroup.rotation.y = this.heroYaw;

    // Kedipan mata natural setiap ~3.6 detik
    const blinkCycle = nowSec % 3.6;
    const eyeScaleY = blinkCycle > 3.45 ? 0.14 : 1.0;
    if (this.leftEye && this.rightEye) {
      this.leftEye.scale.y = eyeScaleY;
      this.rightEye.scale.y = eyeScaleY;
    }

    if (this.strikeAnim > 0) {
      // Animasi ayunan tebasan Strike yang gagah & ekspresif!
      const prog = 1 - this.strikeAnim / 0.4;
      const slashCurve = Math.sin(prog * Math.PI);
      this.heroBody.rotation.x = 0.28 * slashCurve;
      this.heroBody.rotation.y = -0.65 + prog * 1.45;
      this.heroBody.position.y = 0.2 * slashCurve;
      if (this.rightArm && this.leftArm) {
        this.rightArm.rotation.x = -1.9 + prog * 2.7;
        this.rightArm.rotation.z = -0.55 + prog * 0.9;
        this.leftArm.rotation.x = 0.7 * slashCurve;
      }
      if (this.capeMesh) this.capeMesh.rotation.x = 0.85 * slashCurve + 0.25;
      if (this.weaponGlowMat) this.weaponGlowMat.emissiveIntensity = 1.9;
    } else {
      this.heroBody.rotation.x *= 0.8;
      this.heroBody.rotation.y *= 0.8;
      if (this.weaponGlowMat) this.weaponGlowMat.emissiveIntensity = 0.65 + Math.sin(nowSec * 3.5) * 0.18;

      if (player.moving) {
        const freq = player.sprinting ? 14.5 : 10;
        const swing = Math.sin(nowSec * freq) * (player.sprinting ? 0.68 : 0.52);
        this.leftLeg.rotation.x = swing;
        this.rightLeg.rotation.x = -swing;
        if (this.leftArm && this.rightArm) {
          this.leftArm.rotation.x = -swing * 0.85;
          this.rightArm.rotation.x = swing * 0.65 - 0.18;
          this.rightArm.rotation.z = 0;
        }
        if (this.capeMesh) {
          this.capeMesh.rotation.x = (player.sprinting ? 0.65 : 0.36) + Math.sin(nowSec * freq * 1.1) * 0.14;
        }
        this.heroBody.position.y = Math.abs(Math.cos(nowSec * freq)) * (player.sprinting ? 0.18 : 0.12);
        this.heroBody.rotation.x = player.sprinting ? 0.12 : 0.05;
      } else {
        this.leftLeg.rotation.x *= 0.8;
        this.rightLeg.rotation.x *= 0.8;
        if (this.leftArm && this.rightArm) {
          this.leftArm.rotation.x = Math.sin(nowSec * 2.2) * 0.06;
          this.rightArm.rotation.x = -0.18 + Math.cos(nowSec * 2.2) * 0.06;
          this.rightArm.rotation.z = 0;
        }
        if (this.capeMesh) this.capeMesh.rotation.x = 0.18 + Math.sin(nowSec * 2.2) * 0.04;
        this.heroBody.position.y = Math.sin(nowSec * 2.6) * 0.045;
      }
    }

    // 2. Ciko 3D floating companion
    this.cikoGroup.position.set(ciko.x * S, 1.85 + Math.sin(nowSec * 4) * 0.24, ciko.y * S);
    this.cikoGroup.rotation.y = nowSec * 0.9;

    // 3. Compass arrow toward active Main Quest
    if (activeQuest && activeQuest.target) {
      const dx = activeQuest.target.x * S - hx;
      const dz = activeQuest.target.y * S - hz;
      const dist = Math.hypot(dx, dz);
      this.compassArrow.visible = dist > 4.2;
      if (this.compassArrow.visible) {
        const ang = Math.atan2(dx, dz);
        this.compassArrow.position.set(hx + Math.sin(ang) * 2.2, 1.2 + Math.sin(nowSec * 5) * 0.12, hz + Math.cos(ang) * 2.2);
        this.compassArrow.rotation.set(Math.PI / 2, 0, -ang);
      }
    } else {
      this.compassArrow.visible = false;
    }

    // 4. Interact ring highlight
    if (nearestInteract) {
      this.interactRingMesh.visible = true;
      this.interactRingMesh.position.set(nearestInteract.x * S, 0.12, nearestInteract.y * S);
      this.interactRingMesh.material.color.setHex(nearestInteract.kind === 'enemy' ? 0xff5252 : 0xffd166);
      const pulse = 0.92 + Math.sin(nowSec * 5) * 0.12;
      this.interactRingMesh.scale.set(pulse, pulse, 1);
    } else {
      this.interactRingMesh.visible = false;
    }

    // 5. Animate trees, spinners, waypoints, gates, chests, NPCs & roaming enemies
    for (const st of this.swayTrees) {
      st.crown.rotation.z = Math.sin(nowSec * 1.5 + st.phase) * 0.045;
    }
    for (const sp of this.spinners) {
      sp.mesh.rotation[sp.axis] = nowSec * sp.speed;
    }
    for (const [id, b] of this.gateBarriers) {
      const open = save.solvedGates.includes(id);
      b.wallGroup.visible = !open;
      b.gem.rotation.y = nowSec * 2;
      b.gem.material.color.setHex(open ? 0x48c78e : 0xffd166);
      b.ring.rotation.z = nowSec * 1.4;
    }
    for (const [id, w] of this.waypointMeshes) {
      const on = save.unlockedWaypoints.includes(id);
      w.crystal.rotation.y = nowSec * 1.6;
      w.crystal.position.y = 1.75 + Math.sin(nowSec * 3) * 0.18;
      w.crystalMat.color.setHex(on ? 0x48dbfb : 0x9b958f);
      w.crystalMat.emissiveIntensity = on ? 0.65 : 0.05;
      w.aura.visible = on;
    }
    for (const [id, c] of this.chestMeshes) {
      const opened = save.openedChests.includes(id);
      c.lid.rotation.x = opened ? -1.1 : 0;
      c.lid.position.y = opened ? 0.95 : 0.78;
    }
    for (const npc of NPCS) {
      const nm = this.npcMeshes.get(npc.id);
      if (!nm) continue;
      nm.diamond.rotation.y = nowSec * 2.4;
      nm.diamond.position.y = 2.48 + Math.sin(nowSec * 4 + npc.x) * 0.14;
      // NPC bernapas halus; bila Hero mendekat, NPC menoleh ke arah Hero dan melambaikan tangan!
      const dx = hx - npc.x * S;
      const dz = hz - npc.y * S;
      const dist = Math.hypot(dx, dz);
      nm.rig.position.y = Math.sin(nowSec * 2.5 + npc.x) * 0.035;
      if (dist < 7.5) {
        const wantYaw = Math.atan2(dx, dz);
        let dYaw = wantYaw - nm.yaw;
        while (dYaw > Math.PI) dYaw -= Math.PI * 2;
        while (dYaw < -Math.PI) dYaw += Math.PI * 2;
        nm.yaw += dYaw * 0.12;
        nm.rig.rotation.y = nm.yaw;
        nm.rightArm.rotation.z = 2.25 + Math.sin(nowSec * 9.5) * 0.35;
        nm.leftArm.rotation.z = -0.12;
      } else {
        nm.rightArm.rotation.z *= 0.86;
        nm.leftArm.rotation.z = Math.sin(nowSec * 2 + npc.y) * 0.05;
      }
    }
    for (const en of enemies) {
      const em = this.ensureEnemyMesh(en);
      em.group.position.set(en.curX * S, 0, en.curY * S);
      em.body.rotation.y = nowSec * 2.2;
      em.body.position.y = 1.1 + Math.sin(nowSec * 4.2 + en.x) * 0.24;
      if (em.orbitRing) {
        em.orbitRing.rotation.z = nowSec * 3.4;
        em.orbitRing.position.y = 1.15 + Math.sin(nowSec * 4.2 + en.x) * 0.18;
      }
      const def = (save.defeatedEnemies || []).includes(en.id);
      em.aura.material.color.setHex(def ? 0x48c78e : 0xff5252);
    }

    // 6. Third-Person Follow Camera + Shadow Sun follow
    const camOffX = Math.sin(this.cameraYaw) * this.cameraDist;
    const camOffZ = Math.cos(this.cameraYaw) * this.cameraDist;
    const camHeight = this.cameraDist * Math.sin(this.cameraPitch) + 2.4;
    const shkX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shkY = this.shake ? (Math.random() - 0.5) * this.shake : 0;

    this.camera.position.set(hx + camOffX + shkX, camHeight + shkY, hz + camOffZ);
    this.camera.lookAt(hx, 1.25, hz);

    this.sun.position.set(hx + 18, 28, hz + 14);
    this.sun.target.position.set(hx, 0, hz);

    this.renderer.render(this.scene, this.camera);

    // 7. Update crisp 2D Minimap
    if (this.miniCtx) {
      this.drawMinimap(save, player, activeQuest, enemies, nowSec);
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
      if ((save.defeatedEnemies || []).includes(en.id)) continue;
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
