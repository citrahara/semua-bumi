// Engine Taman 3D Interaktif (Three.js r160) untuk Taman Kronik:
// - Taman bangsawan abad ke-19 berdiri di atas bentangan buku kulit antik terbuka
// - 12 titik renovasi 3D yang benar-benar berubah wujud (rusak -> 1 dari 3 gaya pilihan!)
// - Karakter 3D hidup bisa jalan bebas (WASD / klik tanah) + POV geser kursor 360° & scroll zoom!

import * as THREE from '../vendor/three.module.min.js';
import { GARDEN_W, GARDEN_H, RESTORATION_TASKS, GARDEN_NPCS } from './garden_data.js';
import { CAST } from './characters.js';

const S = 0.05; // 20px = 1 meter 3D -> 70m x 55m taman

function makeLockPinTexture(starCost, ready) {
  const c = document.createElement('canvas');
  c.width = 144;
  c.height = 144;
  const ctx = c.getContext('2d');

  // Badge bundar bersih dengan ikon gembok / bintang vektor
  ctx.beginPath();
  ctx.arc(72, 66, 46, 0, Math.PI * 2);
  ctx.fillStyle = ready ? 'rgba(34, 27, 19, 0.92)' : 'rgba(24, 28, 33, 0.86)';
  ctx.fill();
  ctx.lineWidth = ready ? 5 : 4;
  ctx.strokeStyle = ready ? '#D9B466' : '#7B8794';
  ctx.stroke();

  if (ready) {
    // Ikon bintang emas siap bangun
    ctx.fillStyle = '#F2CA72';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const b = a + Math.PI / 5;
      const x1 = 72 + Math.cos(a) * 18;
      const y1 = 54 + Math.sin(a) * 18;
      const x2 = 72 + Math.cos(b) * 7.5;
      const y2 = 54 + Math.sin(b) * 7.5;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    // Ikon gembok minimalis
    ctx.strokeStyle = '#B8C2CC';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(72, 48, 10, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#9AA5B1';
    ctx.beginPath();
    ctx.roundRect(57, 48, 30, 22, 5);
    ctx.fill();
    ctx.fillStyle = '#1C2026';
    ctx.beginPath();
    ctx.arc(72, 59, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = ready ? '#FFE299' : '#CBD5E1';
  ctx.fillText(`${starCost} ★`, 72, 91);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeCleanLabel(text, border = '#D9B466') {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  c.width = 320;
  c.height = 56;
  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  const tw = Math.min(296, ctx.measureText(text).width + 30);
  const x = (c.width - tw) / 2;
  ctx.fillStyle = 'rgba(20, 18, 16, 0.82)';
  ctx.beginPath();
  ctx.roundRect(x, 8, tw, 40, 20);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#F4EFE6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, 29, 280);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthTest: false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(4.1, 0.72, 1);
  sp.visible = false;
  return sp;
}

export class GardenWorld3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdbe4cc);
    this.scene.fog = new THREE.FogExp2(0xd7e0c7, 0.0095);

    this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.5, 240);
    this.cameraYaw = 0;
    this.cameraPitch = 0.52;
    this.cameraDist = 17;
    this.targetYaw = 0;
    this.targetPitch = 0.52;
    this.targetDist = 17;

    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.particles = [];
    this.swayTrees = [];
    this.fireflies = [];
    this.clouds = [];
    this.spinners = [];
    this.waterJets = [];
    this.siteContainers = new Map();
    this.siteBuiltState = new Map();
    this.siteBounce = new Map();
    this.lockPins = new Map();
    this.npcRigs = new Map();
    this.proximityLabels = [];
    this._tmpVec = new THREE.Vector3();
    this.heroYaw = 0;
    this.focusOverride = null;
    this.camLookX = 700 * S;
    this.camLookZ = 700 * S;
    this.latestStars = 1;
    this.previewSiteId = null;

    this.setupLighting();
    this.buildBookBaseAndEstate();
    this.buildNpcs();
    this.buildHero();
    this.buildRings();
    this.resize();
  }

  setupLighting() {
    this.hemi = new THREE.HemisphereLight(0xfff5dc, 0x5c5340, 0.96);
    this.scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xffe7ba, 1.32);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.near = 2;
    this.sun.shadow.camera.far = 95;
    const d = 34;
    this.sun.shadow.camera.left = -d;
    this.sun.shadow.camera.right = d;
    this.sun.shadow.camera.top = d;
    this.sun.shadow.camera.bottom = -d;
    this.sun.shadow.bias = -0.001;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
  }

  buildBookBaseAndEstate() {
    const W = GARDEN_W * S; // 70
    const H = GARDEN_H * S; // 55
    const cx = W / 2; // 35
    const cz = H / 2; // 27.5

    // Meja baca kayu hangat di bawah buku raksasa
    const desk = new THREE.Mesh(
      new THREE.PlaneGeometry(340, 280),
      new THREE.MeshStandardMaterial({ color: 0x241914, roughness: 0.94 })
    );
    desk.rotation.x = -Math.PI / 2;
    desk.position.set(cx, -4.4, cz);
    this.scene.add(desk);

    // Sampul kulit buku antik + 4 sudut kuningan + tumpukan halaman perkamen
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(W + 16, 1.5, H + 14),
      new THREE.MeshStandardMaterial({ color: 0x3d2218, roughness: 0.82 })
    );
    cover.position.set(cx, -2.5, cz);
    cover.receiveShadow = true;
    this.scene.add(cover);

    const brass = new THREE.MeshStandardMaterial({ color: 0xd4a84f, metalness: 0.65, roughness: 0.28 });
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const corner = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.7, 5.5), brass);
        corner.position.set(cx + sx * (W / 2 + 5.6), -2.42, cz + sz * (H / 2 + 4.6));
        this.scene.add(corner);
      }
    }

    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(W + 8, 1.8, H + 7),
      new THREE.MeshStandardMaterial({ color: 0xe9dab9, roughness: 0.9 })
    );
    pages.position.set(cx, -1.1, cz);
    pages.receiveShadow = true;
    this.scene.add(pages);

    const spread = new THREE.Mesh(
      new THREE.BoxGeometry(W + 5, 0.24, H + 4.5),
      new THREE.MeshStandardMaterial({ color: 0xf4e8ce, roughness: 0.92 })
    );
    spread.position.set(cx, -0.18, cz);
    spread.receiveShadow = true;
    this.scene.add(spread);

    // Pita pembatas merah marun di kanan bawah buku
    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 11),
      new THREE.MeshStandardMaterial({ color: 0x992b33, roughness: 0.65 })
    );
    ribbon.position.set(cx + W / 2 - 6, -0.05, cz + H / 2 + 3.4);
    ribbon.rotation.y = -0.16;
    this.scene.add(ribbon);

    // Halaman Rumput Taman Bangsawan (Lawn utama)
    const lawn = new THREE.Mesh(
      new THREE.BoxGeometry(W, 0.2, H),
      new THREE.MeshStandardMaterial({ color: 0x7ba860, roughness: 0.9 })
    );
    lawn.position.set(cx, -0.04, cz);
    lawn.receiveShadow = true;
    this.scene.add(lawn);

    // Tembok batu rendah sekeliling kebun (dengan celah gerbang selatan)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xb7afa1, roughness: 0.88 });
    const addWall = (x, z, w, d) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.1, d), wallMat);
      m.position.set(x, 0.55, z);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    };
    addWall(cx, 1.2, W - 2, 0.8); // Utara
    addWall(1.2, cz, 0.8, H - 2); // Barat
    addWall(W - 1.2, cz, 0.8, H - 2); // Timur
    addWall(cx / 2 - 2.4, H - 1.2, W / 2 - 5.5, 0.8); // Selatan kiri
    addWall(cx + cx / 2 + 2.4, H - 1.2, W / 2 - 5.5, 0.8); // Selatan kanan

    // Jalur kerikil krem yang rapi menghubungkan semua titik taman
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0xdecbb0, roughness: 0.94 });
    const addPath = (x1, y1, x2, y2, w = 2.6) => {
      const dx = (x2 - x1) * S;
      const dz = (y2 - y1) * S;
      const len = Math.hypot(dx, dz);
      const p = new THREE.Mesh(new THREE.BoxGeometry(len + w * 0.5, 0.05, w), gravelMat);
      p.position.set(((x1 + x2) / 2) * S, 0.08, ((y1 + y2) / 2) * S);
      p.rotation.y = -Math.atan2(dz, dx);
      p.receiveShadow = true;
      this.scene.add(p);
    };
    addPath(700, 990, 700, 200, 3.1); // Poros Utara-Selatan
    addPath(260, 560, 1140, 560, 2.7); // Poros Barat-Timur
    addPath(340, 420, 340, 560, 2.2); // Ke Paviliun Orwell
    addPath(1060, 420, 1060, 560, 2.2); // Ke Pergola Teh
    addPath(520, 230, 700, 230, 2.2); // Ke Rumah Kaca
    addPath(920, 240, 700, 240, 2.2); // Ke Hutan Sakura
    addPath(310, 560, 310, 820, 2.2); // Ke Jembatan Kolam Barat
    addPath(1130, 560, 1130, 760, 2.2); // Ke Menara Observasi

    // Alun-alun bundar tengah taman
    const plaza = new THREE.Mesh(
      new THREE.CylinderGeometry(6.2, 6.4, 0.08, 32),
      gravelMat
    );
    plaza.position.set(700 * S, 0.09, 560 * S);
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    // Kolam Barat Alami (teratai)
    const pond = new THREE.Mesh(
      new THREE.CylinderGeometry(5.6, 5.6, 0.14, 28),
      new THREE.MeshStandardMaterial({ color: 0x34829e, roughness: 0.25, metalness: 0.16 })
    );
    pond.scale.set(1.25, 1, 0.85);
    pond.position.set(310 * S, 0.04, 740 * S);
    this.scene.add(pond);

    // Pepohonan pinggir taman & bukit kabut cakrawala
    const treeCoords = [
      [120, 140, 'cypress'], [240, 120, 'oak'], [380, 110, 'cypress'], [830, 110, 'oak'],
      [1180, 140, 'cypress'], [1280, 260, 'oak'], [1260, 460, 'cypress'], [1260, 680, 'oak'],
      [1240, 920, 'cypress'], [140, 340, 'oak'], [130, 540, 'cypress'], [140, 920, 'oak'],
      [420, 940, 'cypress'], [980, 940, 'oak']
    ];
    for (const [tx, ty, st] of treeCoords) {
      this.addSwayTree(tx * S, ty * S, st);
    }

    // Bukit kabut jauh lembut di luar meja buku
    const hillMat1 = new THREE.MeshStandardMaterial({ color: 0x5c7761, roughness: 0.95, flatShading: true });
    const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x4c6066, roughness: 0.95, flatShading: true });
    for (let i = 0; i < 20; i++) {
      const ang = (i / 20) * Math.PI * 2;
      const peak = new THREE.Mesh(
        new THREE.ConeGeometry(10 + (i % 3) * 4, 12 + (i % 4) * 5, 5),
        i % 2 === 0 ? hillMat1 : hillMat2
      );
      peak.position.set(cx + Math.cos(ang) * 72, 4, cz + Math.sin(ang) * 58);
      this.scene.add(peak);
    }

    // Awan lembut & 28 kunang-kunang emas
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.95, flatShading: true });
    for (let i = 0; i < 12; i++) {
      const cg = new THREE.Group();
      const s1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 0), cloudMat);
      const s2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 0), cloudMat);
      s2.position.set(1.8, -0.25, 0.3);
      cg.add(s1, s2);
      cg.position.set(Math.random() * W, 16 + (i % 3) * 2.4, Math.random() * H);
      cg.scale.set(1.35, 0.6, 1);
      this.scene.add(cg);
      this.clouds.push({ mesh: cg, speed: 0.3 + (i % 3) * 0.16 });
    }

    const ffGeo = new THREE.SphereGeometry(0.09, 6, 6);
    const ffMat = new THREE.MeshBasicMaterial({ color: 0xffe591 });
    for (let i = 0; i < 28; i++) {
      const m = new THREE.Mesh(ffGeo, ffMat);
      const fx = 6 + Math.random() * (W - 12);
      const fz = 6 + Math.random() * (H - 12);
      const fy = 1.2 + Math.random() * 3.2;
      m.position.set(fx, fy, fz);
      this.scene.add(m);
      this.fireflies.push({ mesh: m, bx: fx, by: fy, bz: fz, phase: i * 1.1 });
    }

    // Wadah untuk 12 Area Renovasi 3D!
    for (const task of RESTORATION_TASKS) {
      const container = new THREE.Group();
      container.position.set(task.x * S, 0, task.y * S);
      this.scene.add(container);

      const lbl = makeCleanLabel(task.name, '#D9B466');
      lbl.position.set(0, 4.1, 0);
      container.add(lbl);
      this.proximityLabels.push(lbl);

      const modelRoot = new THREE.Group();
      container.add(modelRoot);

      // Pin gembok / bintang terlihat dari jauh pada area yang belum dibuka
      const pinMat = new THREE.SpriteMaterial({
        map: makeLockPinTexture(task.starCost, false),
        transparent: true,
        opacity: 0.94,
        depthTest: false
      });
      const pin = new THREE.Sprite(pinMat);
      pin.scale.set(2.15, 2.15, 1);
      pin.position.set(0, 3.0, 0);
      container.add(pin);
      this.lockPins.set(task.id, { sprite: pin, baseY: 3.0, ready: null, task });

      this.siteContainers.set(task.id, { container, modelRoot, task, label: lbl, pin });
    }
    this.syncRenovations({});
  }

  addSwayTree(x, z, style = 'oak', parent = this.scene) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.32, 1.5, 7),
      new THREE.MeshStandardMaterial({ color: 0x6b4c3b, roughness: 0.9 })
    );
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    g.add(trunk);

    const crown = new THREE.Group();
    if (style === 'cypress') {
      const mat = new THREE.MeshStandardMaterial({ color: 0x3b6947, roughness: 0.85, flatShading: true });
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.8, 7), mat);
      c1.position.y = 2.4;
      c1.castShadow = true;
      crown.add(c1);
    } else {
      const col = style === 'sakura' ? 0xf09cb3 : style === 'snow' ? 0xf5ecf0 : style === 'maple' ? 0xd46635 : 0x4b8750;
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.82, flatShading: true });
      const b1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3, 0), mat);
      b1.position.y = 2.4;
      const b2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), mat);
      b2.position.set(0.7, 2.05, 0.35);
      const b3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), mat);
      b3.position.set(-0.65, 2.0, -0.25);
      b1.castShadow = b2.castShadow = b3.castShadow = true;
      crown.add(b1, b2, b3);
    }
    g.add(crown);
    g.position.set(x, 0, z);
    parent.add(g);
    this.swayTrees.push({ crown, phase: x * 0.4 + z * 0.2 });
    return g;
  }

  // Bangun ulang model 3D untuk setiap area renovasi yang berubah (terkunci vs 3 gaya pilihan)
  syncRenovations(renovations = {}, animateId = null, stars = this.latestStars) {
    this.latestStars = stars;
    for (const task of RESTORATION_TASKS) {
      const styleIdx = typeof renovations[task.id] === 'number' ? renovations[task.id] : -1;
      const entry = this.siteContainers.get(task.id);
      if (!entry) continue;

      const pinEntry = this.lockPins.get(task.id);
      if (pinEntry) {
        const isLocked = styleIdx < 0 && this.previewSiteId !== task.id;
        pinEntry.sprite.visible = isLocked;
        if (isLocked) {
          const ready = stars >= task.starCost;
          if (pinEntry.ready !== ready) {
            pinEntry.ready = ready;
            if (pinEntry.sprite.material.map) pinEntry.sprite.material.map.dispose();
            pinEntry.sprite.material.map = makeLockPinTexture(task.starCost, ready);
            pinEntry.sprite.material.needsUpdate = true;
          }
        }
      }

      if (this.siteBuiltState.get(task.id) === styleIdx) continue;
      this.siteBuiltState.set(task.id, styleIdx);

      const root = entry.modelRoot;
      while (root.children.length > 0) root.remove(root.children[0]);

      if (styleIdx < 0) {
        this.buildRuinedSite(task.id, root);
      } else {
        const st = task.styles[styleIdx] || task.styles[0];
        this.buildRestoredSite(task.id, st, root);
        // Hamparan rumput cerah halus di bawah bangunan yang sudah terbuka
        const glowPad = new THREE.Mesh(
          new THREE.CircleGeometry(3.2, 24),
          new THREE.MeshBasicMaterial({ color: 0x7bc268, transparent: true, opacity: 0.24 })
        );
        glowPad.rotation.x = -Math.PI / 2;
        glowPad.position.y = 0.08;
        root.add(glowPad);

        if (animateId === task.id) {
          this.siteBounce.set(task.id, 0.01);
          this.spawnBurst(task.x, task.y, '#D9B466', 28);
        }
      }
    }
  }

  // Pratinjau 3D langsung saat pemain memilih salah satu dari 3 gaya sebelum memasang!
  previewSiteStyle(taskId, styleIdx) {
    const entry = this.siteContainers.get(taskId);
    if (!entry) return;
    this.previewSiteId = taskId;
    const pinEntry = this.lockPins.get(taskId);
    if (pinEntry) pinEntry.sprite.visible = false;

    const root = entry.modelRoot;
    while (root.children.length > 0) root.remove(root.children[0]);
    const st = entry.task.styles[styleIdx] || entry.task.styles[0];
    this.buildRestoredSite(taskId, st, root);

    // Ring pratinjau emas halus agar bentuk 3D terlihat jelas
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.7, 3.0, 32),
      new THREE.MeshBasicMaterial({ color: 0xd9b466, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.14;
    root.add(ring);

    this.siteBuiltState.set(taskId, `preview_${styleIdx}`);
    this.siteBounce.set(taskId, 0.01);
  }

  clearPreview(renovations = {}, stars = this.latestStars) {
    this.previewSiteId = null;
    this.clearCameraFocus();
    this.syncRenovations(renovations, null, stars);
  }

  setCameraFocus(x, y, dist = 12.6, pitch = 0.44) {
    this.focusOverride = { x: x * S, z: y * S };
    this.targetDist = dist;
    this.targetPitch = pitch;
  }

  clearCameraFocus() {
    this.focusOverride = null;
    this.targetDist = 17.5;
    this.targetPitch = 0.52;
  }

  playIntroSweep() {
    this.cameraDist = 36;
    this.cameraPitch = 0.78;
    this.targetDist = 18;
    this.targetPitch = 0.52;
  }

  buildRuinedSite(id, root) {
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x6f6b64, roughness: 0.94, flatShading: true });
    const weedMat = new THREE.MeshStandardMaterial({ color: 0x455e3c, roughness: 0.92, flatShading: true });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x574335, roughness: 0.95 });

    // Zona terkunci redup (kabut batu melingkar) agar langsung terlihat mana yang belum dibuka
    const lockedDisk = new THREE.Mesh(
      new THREE.CircleGeometry(3.3, 24),
      new THREE.MeshBasicMaterial({ color: 0x262d33, transparent: true, opacity: 0.34 })
    );
    lockedDisk.rotation.x = -Math.PI / 2;
    lockedDisk.position.y = 0.09;
    root.add(lockedDisk);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 2.05, 0.22, 8), rubbleMat);
    base.position.y = 0.11;
    root.add(base);

    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + 0.4;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45 + (i % 2) * 0.16, 0), i % 2 === 0 ? rubbleMat : weedMat);
      rock.position.set(Math.cos(ang) * 1.1, 0.35, Math.sin(ang) * 1.1);
      rock.scale.set(1.2, 0.75, 1);
      rock.castShadow = true;
      root.add(rock);
    }
    const plank = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.42), woodMat);
    plank.position.set(0, 0.48, 0.2);
    plank.rotation.set(0.18, 0.45, -0.2);
    root.add(plank);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.15, 3.38, 28),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide, transparent: true, opacity: 0.48 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.13;
    root.add(ring);
  }

  buildRestoredSite(id, st, root) {
    const mainMat = new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.68 });
    const accMat = new THREE.MeshStandardMaterial({ color: st.accent, roughness: 0.45, metalness: 0.22 });

    if (id === 'gate') {
      for (const sx of [-2.4, 2.4]) {
        const pil = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.6, 0.9), mainMat);
        pil.position.set(sx, 1.8, 0);
        pil.castShadow = true;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), accMat);
        cap.position.set(sx, 3.85, 0);
        root.add(pil, cap);
      }
      const arch = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.16, 8, 22, Math.PI), accMat);
      arch.position.set(0, 3.2, 0);
      root.add(arch);
      return;
    }

    if (id === 'fountain') {
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 0.72, 20), mainMat);
      basin.position.y = 0.36;
      basin.castShadow = true;
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(2.75, 2.75, 0.74, 20),
        new THREE.MeshStandardMaterial({ color: 0x4ca8c4, roughness: 0.2, metalness: 0.2 })
      );
      water.position.y = 0.38;
      const tier = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 2.1, 12), mainMat);
      tier.position.y = 1.1;
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 0.45, 0.45, 16), accMat);
      bowl.position.y = 2.0;
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 1.25, 10),
        new THREE.MeshBasicMaterial({ color: 0xbef0ff, transparent: true, opacity: 0.75 })
      );
      jet.position.y = 2.7;
      root.add(basin, water, tier, bowl, jet);
      this.waterJets.push(jet);
      return;
    }

    if (id === 'flowerbeds') {
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x543c2c, roughness: 0.95 });
      for (const [ox, oz] of [[0, -1.6], [0, 1.6], [18, -1.6], [18, 1.6]]) {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.32, 2.2), soilMat);
        bed.position.set(ox, 0.16, oz);
        root.add(bed);
        for (let k = 0; k < 8; k++) {
          const fl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), k % 2 === 0 ? mainMat : accMat);
          fl.position.set(ox - 1.2 + (k % 4) * 0.8, 0.48, oz + (k < 4 ? -0.48 : 0.48));
          root.add(fl);
        }
      }
      return;
    }

    if (id === 'lanterns') {
      const glowMat = new THREE.MeshStandardMaterial({
        color: st.accent,
        emissive: st.accent,
        emissiveIntensity: 0.9
      });
      const pts = [[0, 0], [-18, 0], [-18, -10], [0, -10], [-7, 9], [-11, 9]];
      for (const [lx, lz] of pts) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 3.1, 8), mainMat);
        pole.position.set(lx, 1.55, lz);
        pole.castShadow = true;
        const bulb = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), glowMat);
        bulb.position.set(lx, 3.25, lz);
        root.add(pole, bulb);
      }
      return;
    }

    if (id === 'orwell_pavilion' || id === 'tea_pergola') {
      const floor = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.35, 4.4), mainMat);
      floor.position.y = 0.18;
      floor.receiveShadow = true;
      for (const sx of [-2.3, 2.3]) {
        for (const sz of [-1.7, 1.7]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 2.8, 8), mainMat);
          col.position.set(sx, 1.6, sz);
          col.castShadow = true;
          root.add(col);
        }
      }
      const roof = new THREE.Mesh(new THREE.ConeGeometry(4.3, 1.7, 4), accMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 3.7;
      roof.castShadow = true;
      const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.72, 1.1), mainMat);
      table.position.y = 0.65;
      root.add(floor, roof, table);
      return;
    }

    if (id === 'pond_bridge') {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.34, 8.8), mainMat);
      deck.position.y = 0.52;
      deck.castShadow = true;
      for (const sx of [-1.2, 1.2]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.75, 8.8), accMat);
        rail.position.set(sx, 0.96, 0);
        root.add(rail);
      }
      root.add(deck);
      return;
    }

    if (id === 'greenhouse') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.8, 4.4), mainMat);
      base.position.y = 0.4;
      const glassMat = new THREE.MeshStandardMaterial({
        color: st.accent,
        transparent: true,
        opacity: 0.52,
        roughness: 0.15,
        metalness: 0.15
      });
      const walls = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.3, 4.0), glassMat);
      walls.position.y = 1.95;
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 5.9, 6, 1, false, 0, Math.PI), glassMat);
      roof.rotation.z = Math.PI / 2;
      roof.position.y = 3.1;
      // Tanaman hijau di dalam rumah kaca
      const bushMat = new THREE.MeshStandardMaterial({ color: 0x3b8c54, roughness: 0.8 });
      for (const bx of [-1.6, 0, 1.6]) {
        const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 0), bushMat);
        plant.position.set(bx, 1.2, 0);
        root.add(plant);
      }
      root.add(base, walls, roof);
      return;
    }

    if (id === 'sakura_grove') {
      const styleKey = st.id === 1 ? 'snow' : st.id === 2 ? 'maple' : 'sakura';
      for (const [ox, oz] of [[-2.2, -1.2], [2.0, -1.0], [0, 1.6], [3.2, 1.2]]) {
        this.addSwayTree(ox, oz, styleKey, root);
      }
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.55, 0.72), accMat);
      bench.position.set(0, 0.35, -0.3);
      root.add(bench);
      return;
    }

    if (id === 'rose_arch') {
      for (const oz of [-2.4, 2.4]) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.28, 8, 22, Math.PI), accMat);
        arch.position.set(0, 1.8, oz);
        root.add(arch);
        for (let k = 0; k < 7; k++) {
          const ang = (k / 6) * Math.PI;
          const bl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 0), mainMat);
          bl.position.set(Math.cos(ang) * 2.1, 1.8 + Math.sin(ang) * 2.1, oz);
          root.add(bl);
        }
      }
      return;
    }

    if (id === 'signal_tower') {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.85, 5.4, 10), mainMat);
      tower.position.y = 2.7;
      tower.castShadow = true;
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
        accMat
      );
      dome.position.y = 5.35;
      const spire = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), accMat);
      spire.position.y = 7.4;
      root.add(tower, dome, spire);
      this.spinners.push({ mesh: spire, axis: 'y', speed: 1.5 });
      return;
    }

    // clock_gazebo (mahkota taman)
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.7, 0.5, 12), mainMat);
    deck.position.y = 0.25;
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 3.0, 8), accMat);
      col.position.set(Math.cos(ang) * 2.8, 1.85, Math.sin(ang) * 2.8);
      col.castShadow = true;
      root.add(col);
    }
    const cupola = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.0, 12), mainMat);
    cupola.position.y = 4.3;
    cupola.castShadow = true;
    const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), accMat);
    finial.position.y = 5.65;
    root.add(deck, cupola, finial);
    this.spinners.push({ mesh: finial, axis: 'y', speed: 1.2 });
  }

  buildNpcs() {
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1513 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (const npc of GARDEN_NPCS) {
      const info = CAST[npc.id] || CAST.orwell;
      const ng = new THREE.Group();
      const rig = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.48, 1.0, 10),
        new THREE.MeshStandardMaterial({ color: info.shirt, roughness: 0.72 })
      );
      body.position.y = 0.54;
      body.castShadow = true;

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 10),
        new THREE.MeshStandardMaterial({ color: info.skin, roughness: 0.68 })
      );
      head.position.y = 1.34;
      head.castShadow = true;

      for (const sx of [-0.13, 0.13]) {
        const ep = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeMat);
        ep.position.set(sx, 1.33, 0.365);
        const eg = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), glintMat);
        eg.position.set(sx + 0.018, 1.35, 0.41);
        rig.add(ep, eg);
      }

      const hat = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.44),
        new THREE.MeshStandardMaterial({ color: info.hair, roughness: 0.8 })
      );
      hat.position.y = 1.4;

      const rightArm = new THREE.Group();
      rightArm.position.set(0.44, 0.92, 0);
      const sleeve = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.11, 0.32, 4, 8),
        new THREE.MeshStandardMaterial({ color: info.shirt, roughness: 0.72 })
      );
      sleeve.position.y = -0.2;
      rightArm.add(sleeve);

      rig.add(body, head, hat, rightArm);
      const lbl = makeCleanLabel(`${npc.name} · ${npc.role}`, info.accent || '#D9B466');
      lbl.position.y = 2.65;
      ng.add(rig, lbl);
      ng.position.set(npc.x * S, 0, npc.y * S);
      this.scene.add(ng);
      this.proximityLabels.push(lbl);
      this.npcRigs.set(npc.id, { group: ng, rig, rightArm, yaw: 0, x: npc.x * S, z: npc.y * S });
    }
  }

  buildHero() {
    this.heroGroup = new THREE.Group();
    this.scene.add(this.heroGroup);

    // Satu tokoh penjelajah taman yang tenang (mantel krem-kopi + syal hijau botani)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a201a, roughness: 0.8 });
    this.leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.32, 4, 8), legMat);
    this.leftLeg.position.set(-0.19, 0.28, 0);
    this.rightLeg = this.leftLeg.clone();
    this.rightLeg.position.x = 0.19;

    this.heroBody = new THREE.Group();
    const cloakMat = new THREE.MeshStandardMaterial({ color: 0x5c4636, roughness: 0.65 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x3f7a5c, roughness: 0.55, side: THREE.DoubleSide });
    const cloak = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.49, 0.92, 12), cloakMat);
    cloak.position.y = 0.8;
    cloak.castShadow = true;

    const capeGeo = new THREE.BoxGeometry(0.68, 0.84, 0.06);
    capeGeo.translate(0, -0.41, 0);
    this.capeMesh = new THREE.Mesh(capeGeo, trimMat);
    this.capeMesh.position.set(0, 1.2, -0.32);
    this.capeMesh.rotation.x = 0.18;

    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.09, 8, 16), trimMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 1.2;

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2b18b, roughness: 0.68 })
    );
    head.position.y = 1.56;
    head.castShadow = true;

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1b1411 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.leftEye = new THREE.Group();
    this.leftEye.position.set(-0.14, 1.54, 0.365);
    const eyeGlint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), glintMat);
    eyeGlint.position.set(0.018, 0.018, 0.046);
    this.leftEye.add(
      new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 8), eyeMat),
      eyeGlint
    );
    this.rightEye = this.leftEye.clone();
    this.rightEye.position.x = 0.14;

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.425, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.48),
      new THREE.MeshStandardMaterial({ color: 0x261c17, roughness: 0.85 })
    );
    hair.position.y = 1.62;

    const makeArm = (side) => {
      const grp = new THREE.Group();
      grp.position.set(side * 0.45, 1.12, 0);
      const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.34, 4, 8), cloakMat);
      sleeve.position.y = -0.2;
      const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2b18b, roughness: 0.68 })
      );
      hand.position.y = -0.43;
      grp.add(sleeve, hand);
      return grp;
    };
    this.leftArm = makeArm(-1);
    this.rightArm = makeArm(1);

    this.heroBody.add(cloak, this.capeMesh, scarf, head, hair, this.leftEye, this.rightEye, this.leftArm, this.rightArm);
    this.heroGroup.add(this.leftLeg, this.rightLeg, this.heroBody);
  }

  buildRings() {
    this.clickRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.58, 24),
      new THREE.MeshBasicMaterial({ color: 0xd9b466, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    this.clickRingMesh.rotation.x = -Math.PI / 2;
    this.clickRingMesh.position.y = 0.14;
    this.scene.add(this.clickRingMesh);
    this.clickRingLife = 0;

    this.interactRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(1.3, 1.55, 28),
      new THREE.MeshBasicMaterial({ color: 0xd9b466, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    this.interactRingMesh.rotation.x = -Math.PI / 2;
    this.interactRingMesh.position.y = 0.16;
    this.interactRingMesh.visible = false;
    this.scene.add(this.interactRingMesh);
  }

  spawnBurst(x, y, color = '#D9B466', count = 24) {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
    const geo = new THREE.OctahedronGeometry(0.16, 0);
    for (let i = 0; i < Math.min(count, 26); i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x * S, 1.1, y * S);
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 2.2 + Math.random() * 4.8;
      this.scene.add(m);
      this.particles.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: 3.4 + Math.random() * 4.0,
        vz: Math.sin(ang) * spd,
        life: 0.72 + Math.random() * 0.3
      });
    }
  }

  setClickTarget(x, y) {
    this.clickRingMesh.position.set(x * S, 0.14, y * S);
    this.clickRingLife = 0.6;
  }

  rotateCamera(deltaYaw, deltaPitch = 0) {
    this.targetYaw += deltaYaw;
    if (deltaPitch) {
      this.targetPitch = Math.max(0.2, Math.min(1.18, this.targetPitch + deltaPitch));
    }
  }

  zoomCamera(deltaDist) {
    this.targetDist = Math.max(8.5, Math.min(44, this.targetDist + deltaDist));
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

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      p.vy -= 9.2 * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    for (const c of this.clouds) {
      c.mesh.position.x += c.speed * dt;
      if (c.mesh.position.x > GARDEN_W * S + 18) c.mesh.position.x = -18;
    }

    if (this.clickRingLife > 0) {
      this.clickRingLife = Math.max(0, this.clickRingLife - dt);
      const t = 1 - this.clickRingLife / 0.6;
      const sc = 0.6 + t * 2.0;
      this.clickRingMesh.scale.set(sc, sc, 1);
      this.clickRingMesh.material.opacity = 1 - t;
    } else {
      this.clickRingMesh.material.opacity = 0;
    }

    // Pop-up bounce animasi saat area baru selesai direnovasi!
    for (const [id, prog] of this.siteBounce) {
      const next = Math.min(1, prog + dt * 2.4);
      const entry = this.siteContainers.get(id);
      if (entry) {
        const overshoot = next < 0.7 ? (next / 0.7) * 1.12 : 1.12 - ((next - 0.7) / 0.3) * 0.12;
        entry.modelRoot.scale.setScalar(overshoot);
      }
      if (next >= 1) this.siteBounce.delete(id);
      else this.siteBounce.set(id, next);
    }

    const damp = Math.min(1, dt * 13);
    this.cameraYaw += (this.targetYaw - this.cameraYaw) * damp;
    this.cameraPitch += (this.targetPitch - this.cameraPitch) * damp;
    this.cameraDist += (this.targetDist - this.cameraDist) * damp;
  }

  render(nowSec, state) {
    const { player, nearestInteract } = state;

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
    this.heroYaw += diff * 0.2;
    this.heroGroup.rotation.y = this.heroYaw;

    const blink = (nowSec % 3.7) > 3.55 ? 0.15 : 1;
    if (this.leftEye && this.rightEye) {
      this.leftEye.scale.y = blink;
      this.rightEye.scale.y = blink;
    }

    if (player.moving) {
      const freq = player.sprinting ? 14 : 9.5;
      const sw = Math.sin(nowSec * freq) * 0.52;
      this.leftLeg.rotation.x = sw;
      this.rightLeg.rotation.x = -sw;
      this.leftArm.rotation.x = -sw * 0.75;
      this.rightArm.rotation.x = sw * 0.75;
      this.capeMesh.rotation.x = (player.sprinting ? 0.58 : 0.34) + Math.sin(nowSec * freq) * 0.1;
      this.heroBody.position.y = Math.abs(Math.cos(nowSec * freq)) * 0.12;
    } else {
      this.leftLeg.rotation.x *= 0.82;
      this.rightLeg.rotation.x *= 0.82;
      this.leftArm.rotation.x *= 0.82;
      this.rightArm.rotation.x *= 0.82;
      this.capeMesh.rotation.x = 0.18 + Math.sin(nowSec * 2) * 0.03;
      this.heroBody.position.y = Math.sin(nowSec * 2.4) * 0.04;
    }

    // Animasi halus pin gembok / bintang pada area terkunci
    let idx = 0;
    for (const [, p] of this.lockPins) {
      if (p.sprite.visible) {
        p.sprite.position.y = p.baseY + Math.sin(nowSec * 2.4 + idx * 0.7) * 0.18;
      }
      idx++;
    }

    if (nearestInteract && !this.focusOverride) {
      this.interactRingMesh.visible = true;
      this.interactRingMesh.position.set(nearestInteract.x * S, 0.16, nearestInteract.y * S);
      const p = 0.94 + Math.sin(nowSec * 4.5) * 0.1;
      this.interactRingMesh.scale.set(p, p, 1);
    } else {
      this.interactRingMesh.visible = false;
    }

    for (const st of this.swayTrees) st.crown.rotation.z = Math.sin(nowSec * 1.4 + st.phase) * 0.04;
    for (const sp of this.spinners) sp.mesh.rotation[sp.axis] = nowSec * sp.speed;
    for (const jet of this.waterJets) jet.scale.y = 0.85 + Math.sin(nowSec * 8) * 0.2;
    for (const ff of this.fireflies) {
      ff.mesh.position.x = ff.bx + Math.sin(nowSec * 1.0 + ff.phase) * 1.1;
      ff.mesh.position.y = ff.by + Math.sin(nowSec * 2.0 + ff.phase) * 0.45;
      ff.mesh.position.z = ff.bz + Math.cos(nowSec * 0.85 + ff.phase) * 1.1;
    }

    for (const [, nm] of this.npcRigs) {
      const dx = hx - nm.x;
      const dz = hz - nm.z;
      const dist = Math.hypot(dx, dz);
      nm.rig.position.y = Math.sin(nowSec * 2.4 + nm.x) * 0.03;
      if (dist < 7.5) {
        const want = Math.atan2(dx, dz);
        let dY = want - nm.yaw;
        while (dY > Math.PI) dY -= Math.PI * 2;
        while (dY < -Math.PI) dY += Math.PI * 2;
        nm.yaw += dY * 0.12;
        nm.rig.rotation.y = nm.yaw;
        nm.rightArm.rotation.z = 2.0 + Math.sin(nowSec * 8.5) * 0.25;
      } else {
        nm.rightArm.rotation.z *= 0.85;
      }
    }

    // Label 3D hanya muncul halus saat dekat dan tersembunyi saat mode pratinjau
    for (const sp of this.proximityLabels) {
      if (this.focusOverride) {
        sp.visible = false;
        continue;
      }
      sp.getWorldPosition(this._tmpVec);
      const d = Math.hypot(this._tmpVec.x - hx, this._tmpVec.z - hz);
      const maxR = 9.5;
      if (d < maxR) {
        sp.visible = true;
        sp.material.opacity = Math.min(0.95, Math.max(0.15, (maxR - d) / 2.8));
      } else {
        sp.visible = false;
      }
    }

    const wantX = this.focusOverride ? this.focusOverride.x : hx;
    const wantZ = this.focusOverride ? this.focusOverride.z : hz;
    this.camLookX += (wantX - this.camLookX) * 0.12;
    this.camLookZ += (wantZ - this.camLookZ) * 0.12;

    const horizDist = this.cameraDist * Math.cos(this.cameraPitch);
    const camOffX = Math.sin(this.cameraYaw) * horizDist;
    const camOffZ = Math.cos(this.cameraYaw) * horizDist;
    const camHeight = this.cameraDist * Math.sin(this.cameraPitch) + 1.8;

    this.camera.position.set(this.camLookX + camOffX, camHeight, this.camLookZ + camOffZ);
    this.camera.lookAt(this.camLookX, this.focusOverride ? 1.5 : 1.25, this.camLookZ);
    this.sun.position.set(this.camLookX + 16, 26, this.camLookZ + 14);
    this.sun.target.position.set(this.camLookX, 0, this.camLookZ);

    this.renderer.render(this.scene, this.camera);
  }
}
