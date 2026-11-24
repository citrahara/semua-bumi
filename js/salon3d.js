// Engine 3D Ruang Baca & Kedai Teh Malam Hujan (Three.js r160):
// - Ruang baca kayu hangat menghadap taman malam berhujan lewat jendela melengkung
// - Arka duduk tenang di seberang meja + tamu malam di kursi samping + cangkir teh beruap
// - 8 slot dekorasi dengan 3 bentuk struktur 3D berbeda nyata (bukan sekadar ganti warna)
// - Pratinjau dekor 3D langsung dengan pergerakan kamera otomatis & kontrol POV kursor

import * as THREE from '../vendor/three.module.min.js';
import { SALON_UPGRADES } from './salon_data.js';

export class SalonWorld3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x131922);
    this.scene.fog = new THREE.FogExp2(0x141b24, 0.032);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, 120);

    // Kamera bawaan membingkai Arka, Tamu, Lampu, dan jendela hujan di 70% bidang kiri layar (bebas tertutup panel chat)
    this.baseFocus = { x: 0.65, y: 1.52, z: -0.82, dist: 5.05, yaw: 0.04, pitch: 0.16 };
    this.camTarget = { ...this.baseFocus };
    this.camCur = { ...this.baseFocus };

    this.flames = [];
    this.pendulums = [];
    this.spinners = [];
    this.waterJets = [];
    this.rainDrops = [];
    this.steamPuffs = [];
    this.swayTrees = [];

    this.upgradeRoots = new Map();
    this.upgradeState = new Map();
    this.upgradeBounce = new Map();
    this.previewSlotId = null;

    this.arkaTalkingUntil = 0;
    this.visitorVisible = false;

    this.setupLighting();
    this.buildRoomAndWindow();
    this.buildRainyGarden();
    this.buildDeskAndTea();
    this.buildCharacters();
    this.initUpgradeSlots();
    this.resize();
  }

  setupLighting() {
    const hemi = new THREE.HemisphereLight(0xb2c9e6, 0x3b291e, 0.85);
    this.scene.add(hemi);

    // Cahaya bulan dingin dari luar jendela taman
    const moon = new THREE.DirectionalLight(0xa8ccf2, 1.05);
    moon.position.set(-4, 9, -11);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    this.scene.add(moon);

    // Cahaya lampu hangat di atas meja baca
    this.deskLight = new THREE.PointLight(0xffcb7d, 2.55, 14, 1.35);
    this.deskLight.position.set(-1.1, 2.45, 0.55);
    this.deskLight.castShadow = true;
    this.scene.add(this.deskLight);

    // Cahaya aksen hangat sudut ruangan
    const fillLight = new THREE.PointLight(0xffbe78, 1.25, 14, 1.45);
    fillLight.position.set(2.4, 2.6, 1.5);
    this.scene.add(fillLight);
  }

  buildRoomAndWindow() {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x3b261b, roughness: 0.85 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x28211d, roughness: 0.9 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x4b3122, roughness: 0.72 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x2f1e15, roughness: 0.78 });

    // Lantai kayu salon
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 8.6), floorMat);
    floor.position.set(0, -0.1, 0.4);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Karpet hangat di bawah meja
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.03, 4.4),
      new THREE.MeshStandardMaterial({ color: 0x56282a, roughness: 0.95 })
    );
    rug.position.set(0, 0.015, 0.4);
    rug.receiveShadow = true;
    this.scene.add(rug);

    // Dinding kiri & kanan
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.6, 8.6), wallMat);
    leftWall.position.set(-5.1, 2.3, 0.4);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.6, 8.6), wallMat);
    rightWall.position.set(5.1, 2.3, 0.4);
    this.scene.add(rightWall);

    // Plafon balok kayu
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.25, 8.8), woodDark);
    ceiling.position.set(0, 4.6, 0.4);
    this.scene.add(ceiling);

    // Dinding belakang berjendela lebar menghadap taman hujan
    const backLeft = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.6, 0.3), wallMat);
    backLeft.position.set(-3.9, 2.3, -3.7);
    const backRight = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.6, 0.3), wallMat);
    backRight.position.set(3.9, 2.3, -3.7);
    const backLow = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.9, 0.3), trimMat);
    backLow.position.set(0, 0.45, -3.7);
    const backTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.65, 0.3), trimMat);
    backTop.position.set(0, 4.28, -3.7);
    this.scene.add(backLeft, backRight, backLow, backTop);

    // Kusen jendela & kaca tipis
    for (const x of [-2.6, -0.86, 0.86, 2.6]) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.11, 3.1, 0.16), woodDark);
      mullion.position.set(x, 2.42, -3.7);
      this.scene.add(mullion);
    }
    const transBar = new THREE.Mesh(new THREE.BoxGeometry(5.3, 0.1, 0.16), woodDark);
    transBar.position.set(0, 3.05, -3.7);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.12, 0.48), trimMat);
    sill.position.set(0, 0.92, -3.62);
    this.scene.add(transBar, sill);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 3.05),
      new THREE.MeshPhysicalMaterial({
        color: 0x9ec5e6,
        transparent: true,
        opacity: 0.12,
        roughness: 0.1,
        metalness: 0.1
      })
    );
    glass.position.set(0, 2.42, -3.72);
    this.scene.add(glass);

    // Rak buku referensi tetap di kanan belakang (dekat Arka)
    const shelfFrame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.2, 0.48), woodDark);
    shelfFrame.position.set(3.65, 1.6, -3.35);
    this.scene.add(shelfFrame);

    const bookColors = [0x6e2b36, 0x324b5c, 0x244a47, 0x6a4c36, 0x4a5d3f, 0x5b4563, 0x8b6a38];
    for (let row = 0; row < 4; row++) {
      const by = 0.65 + row * 0.68;
      for (let i = 0; i < 8; i++) {
        const bh = 0.36 + ((row + i) % 3) * 0.07;
        const bk = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, bh, 0.32),
          new THREE.MeshStandardMaterial({ color: bookColors[(row * 5 + i) % bookColors.length], roughness: 0.78 })
        );
        bk.position.set(3.02 + i * 0.17, by + bh / 2, -3.28);
        this.scene.add(bk);
      }
    }
  }

  buildRainyGarden() {
    // Taman malam di luar jendela
    const lawn = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 28),
      new THREE.MeshStandardMaterial({ color: 0x1c2e24, roughness: 0.92 })
    );
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, -0.05, -14);
    lawn.receiveShadow = true;
    this.scene.add(lawn);

    // Jalur batu basah terkena cahaya bulan
    const path = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 15),
      new THREE.MeshStandardMaterial({ color: 0x3c4347, roughness: 0.38, metalness: 0.12 })
    );
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, -0.02, -10.5);
    this.scene.add(path);

    // Pagar batu jauh & pepohonan siluet lembut
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(28, 1.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x2a3136, roughness: 0.9 })
    );
    wall.position.set(0, 0.65, -17.5);
    this.scene.add(wall);

    const treeCoords = [
      [-6.5, -9.2, 1.2],
      [-5.2, -13.5, 1.5],
      [5.8, -8.8, 1.3],
      [6.4, -13.2, 1.4],
      [-1.8, -14.8, 1.6],
      [2.4, -15.0, 1.5]
    ];
    for (const [tx, tz, sc] of treeCoords) {
      const grp = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16 * sc, 0.24 * sc, 1.8 * sc, 7),
        new THREE.MeshStandardMaterial({ color: 0x2a201b, roughness: 0.92 })
      );
      trunk.position.y = 0.9 * sc;
      const crown = new THREE.Group();
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1e382b, roughness: 0.86, flatShading: true });
      const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15 * sc, 0), foliageMat);
      c1.position.y = 2.3 * sc;
      const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 * sc, 0), foliageMat);
      c2.position.set(0.6 * sc, 1.9 * sc, 0.25 * sc);
      crown.add(c1, c2);
      grp.add(trunk, crown);
      grp.position.set(tx, 0, tz);
      this.scene.add(grp);
      this.swayTrees.push({ crown, phase: tx * 0.5 + tz * 0.3 });
    }

    // Lentera taman jauh yang memberi titik cahaya hangat di tengah hujan
    for (const [lx, lz] of [
      [-2.4, -9.2],
      [2.6, -9.5]
    ]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x1f2327, roughness: 0.6 })
      );
      post.position.set(lx, 1.1, lz);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xffd584 })
      );
      bulb.position.set(lx, 2.28, lz);
      const gl = new THREE.PointLight(0xffc970, 0.8, 7, 1.6);
      gl.position.set(lx, 2.25, lz);
      this.scene.add(post, bulb, gl);
    }

    // 110 rintik hujan 3D jatuh di luar jendela
    const dropGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.55, 4);
    const dropMat = new THREE.MeshBasicMaterial({ color: 0xb7d4f0, transparent: true, opacity: 0.38 });
    for (let i = 0; i < 110; i++) {
      const d = new THREE.Mesh(dropGeo, dropMat);
      const rx = (Math.random() - 0.5) * 14;
      const ry = Math.random() * 8;
      const rz = -4.2 - Math.random() * 9.5;
      d.position.set(rx, ry, rz);
      d.rotation.z = 0.08;
      this.scene.add(d);
      this.rainDrops.push({ mesh: d, speed: 9.5 + Math.random() * 4.5, baseZ: rz });
    }
  }

  buildDeskAndTea() {
    const deskWood = new THREE.MeshStandardMaterial({ color: 0x4d2f1e, roughness: 0.62 });
    const legWood = new THREE.MeshStandardMaterial({ color: 0x362015, roughness: 0.72 });

    // Meja baca mahoni lebar di tengah ruangan
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 1.9), deskWood);
    top.position.set(0, 1.0, 0.35);
    top.castShadow = true;
    top.receiveShadow = true;
    this.scene.add(top);

    for (const sx of [-1.85, 1.85]) {
      for (const sz of [-0.42, 1.12]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.96, 8), legWood);
        leg.position.set(sx, 0.48, sz);
        this.scene.add(leg);
      }
    }

    // Buku catatan terbuka di depan pemain
    const coverL = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.03, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x613522, roughness: 0.8 })
    );
    coverL.position.set(-0.52, 1.085, 0.78);
    coverL.rotation.y = 0.08;
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.035, 0.54),
      new THREE.MeshStandardMaterial({ color: 0xf1e8d6, roughness: 0.9 })
    );
    pages.position.set(-0.34, 1.095, 0.78);
    pages.rotation.y = 0.08;
    this.scene.add(coverL, pages);

    // Cangkir teh pemain (warna cairan berubah sesuai racikan teh!)
    const cupGroup = new THREE.Group();
    cupGroup.position.set(0.32, 1.07, 0.72);
    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.16, 0.025, 16),
      new THREE.MeshStandardMaterial({ color: 0xefe8db, roughness: 0.35 })
    );
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.1, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xf5efe2, roughness: 0.32 })
    );
    cup.position.y = 0.1;
    this.teaLiquidMat = new THREE.MeshStandardMaterial({ color: 0xc9832b, roughness: 0.2, metalness: 0.05 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.122, 0.122, 0.02, 16), this.teaLiquidMat);
    liquid.position.y = 0.168;
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.055, 0.015, 6, 12, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xf5efe2, roughness: 0.35 })
    );
    handle.position.set(0.13, 0.1, 0);
    handle.rotation.z = -Math.PI / 2;
    cupGroup.add(saucer, cup, liquid, handle);
    this.scene.add(cupGroup);

    // Uap halus naik dari cangkir teh
    const puffGeo = new THREE.SphereGeometry(0.035, 6, 6);
    for (let i = 0; i < 6; i++) {
      const pMat = new THREE.MeshBasicMaterial({ color: 0xf6f0e4, transparent: true, opacity: 0.22 });
      const puff = new THREE.Mesh(puffGeo, pMat);
      puff.position.set(0.32, 1.3 + i * 0.12, 0.72);
      this.scene.add(puff);
      this.steamPuffs.push({ mesh: puff, phase: i * 1.05, bx: 0.32, bz: 0.72 });
    }
  }

  buildCharacters() {
    // Rekan tetap: Arka (duduk tenang di kiri-tengah seberang meja)
    this.arkaGroup = new THREE.Group();
    this.arkaGroup.position.set(-0.68, 0, -0.82);

    const chairMat = new THREE.MeshStandardMaterial({ color: 0x3a2419, roughness: 0.8 });
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.15, 0.12), chairMat);
    chairBack.position.set(0, 1.12, -0.34);
    this.arkaGroup.add(chairBack);

    this.arkaBody = new THREE.Group();
    const sweaterMat = new THREE.MeshStandardMaterial({ color: 0x354b42, roughness: 0.78 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.88, 12), sweaterMat);
    torso.position.y = 1.18;
    torso.castShadow = true;

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.06, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xe8dfd1, roughness: 0.7 })
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.62;

    this.arkaHead = new THREE.Group();
    this.arkaHead.position.set(0, 1.88, 0);
    const skull = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xdca984, roughness: 0.68 })
    );
    skull.castShadow = true;
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.33, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
      new THREE.MeshStandardMaterial({ color: 0x1d1816, roughness: 0.85 })
    );
    hair.position.y = 0.04;

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x161210 });
    this.arkaLeftEye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), eyeMat);
    this.arkaLeftEye.position.set(-0.1, -0.02, 0.285);
    this.arkaRightEye = this.arkaLeftEye.clone();
    this.arkaRightEye.position.x = 0.1;

    // Kacamata tipis kuningan yang memberi kesan analitis tenang
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xc5a25b, metalness: 0.65, roughness: 0.3 });
    const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.01, 6, 16), glassMat);
    rimL.position.set(-0.1, -0.02, 0.305);
    const rimR = rimL.clone();
    rimR.position.x = 0.1;
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), glassMat);
    bridge.position.set(0, -0.02, 0.305);

    this.arkaHead.add(skull, hair, this.arkaLeftEye, this.arkaRightEye, rimL, rimR, bridge);

    // Cangkir Arka di atas meja
    const arkaMug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.09, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x3b474d, roughness: 0.45 })
    );
    arkaMug.position.set(0.42, 1.15, 0.48);

    this.arkaBody.add(torso, collar, this.arkaHead, arkaMug);
    this.arkaGroup.add(this.arkaBody);
    this.scene.add(this.arkaGroup);

    // Tamu malam (kursi kanan berdampingan dengan Arka agar keduanya terlihat jelas)
    this.visitorGroup = new THREE.Group();
    this.visitorGroup.position.set(0.54, 0, -0.82);
    this.visitorGroup.rotation.y = -0.22;
    const vChair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.08, 0.12), chairMat);
    vChair.position.set(0, 1.08, -0.34);
    this.visitorCoatMat = new THREE.MeshStandardMaterial({ color: 0x6b3a3e, roughness: 0.78 });
    const vTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.84, 12), this.visitorCoatMat);
    vTorso.position.y = 1.14;
    const vHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.29, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2b38f, roughness: 0.68 })
    );
    vHead.position.y = 1.82;
    const vHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58),
      new THREE.MeshStandardMaterial({ color: 0x2b1f1a, roughness: 0.85 })
    );
    vHair.position.y = 1.86;
    const vEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), eyeMat);
    vEyeL.position.set(-0.09, 1.8, 0.27);
    const vEyeR = vEyeL.clone();
    vEyeR.position.x = 0.09;
    this.visitorGroup.add(vChair, vTorso, vHead, vHair, vEyeL, vEyeR);
    this.visitorGroup.visible = false;
    this.scene.add(this.visitorGroup);
  }

  initUpgradeSlots() {
    const slotPositions = {
      desk_lamp: [-1.52, 1.07, 0.18],
      desk_companion: [1.45, 1.07, 0.12],
      window_corner: [-3.1, 0, -2.55],
      tea_service: [0.82, 1.07, 0.56],
      wall_left: [-4.92, 2.25, -0.45],
      garden_focus: [0, 0, -8.2],
      garden_side: [-3.5, 0, -7.8],
      hearth_right: [4.75, 0, -0.55]
    };

    for (const up of SALON_UPGRADES) {
      const root = new THREE.Group();
      const [px, py, pz] = slotPositions[up.id] || [0, 0, 0];
      root.position.set(px, py, pz);
      this.scene.add(root);
      this.upgradeRoots.set(up.id, root);
    }
  }

  // Bangun BENTUK GEOMETRI 3D YANG BENAR-BENAR BERBEDA untuk setiap gaya dekor!
  buildUpgradeForm(form, style, root) {
    const mainMat = new THREE.MeshStandardMaterial({ color: style.color, roughness: 0.58 });
    const accMat = new THREE.MeshStandardMaterial({ color: style.accent, roughness: 0.35, metalness: 0.45 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4b301f, roughness: 0.78 });

    // --- 1. LAMPU MEJA BACA (3 bentuk struktur berbeda) ---
    if (form === 'banker') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 16), accMat);
      base.position.y = 0.03;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.52, 10), accMat);
      stem.position.y = 0.3;
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.24, 0.18, 4),
        new THREE.MeshStandardMaterial({ color: 0x1f7349, emissive: 0x164a2e, emissiveIntensity: 0.65, roughness: 0.25 })
      );
      shade.position.set(0.06, 0.56, 0.04);
      shade.rotation.y = Math.PI / 4;
      shade.scale.set(1.3, 0.85, 0.9);
      root.add(base, stem, shade);
      return;
    }
    if (form === 'paper_lantern') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.36), woodMat);
      base.position.y = 0.03;
      const paper = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.54, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xfff0d4, emissive: 0xffc875, emissiveIntensity: 0.72, roughness: 0.9 })
      );
      paper.position.y = 0.34;
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.38), woodMat);
      top.position.y = 0.63;
      for (const sx of [-0.15, 0.15]) {
        for (const sz of [-0.15, 0.15]) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.58, 0.03), woodMat);
          bar.position.set(sx, 0.34, sz);
          root.add(bar);
        }
      }
      root.add(base, paper, top);
      return;
    }
    if (form === 'candelabra') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.06, 14), accMat);
      base.position.y = 0.03;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.42, 10), accMat);
      trunk.position.y = 0.24;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.03), accMat);
      arm.position.y = 0.34;
      root.add(base, trunk, arm);
      for (const [cx, cy] of [[-0.21, 0.46], [0, 0.54], [0.21, 0.46]]) {
        const wax = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, 0.2, 10),
          new THREE.MeshStandardMaterial({ color: 0xf7f1e3, roughness: 0.65 })
        );
        wax.position.set(cx, cy, 0);
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.028, 0.09, 6),
          new THREE.MeshBasicMaterial({ color: 0xffcf66 })
        );
        flame.position.set(cx, cy + 0.14, 0);
        root.add(wax, flame);
        this.flames.push({ mesh: flame, baseY: cy + 0.14, phase: cx * 10 });
      }
      return;
    }

    // --- 2. PERANGKAT MEJA KERJA (Mesin tik vs Gramofon vs Globe) ---
    if (form === 'typewriter') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.44), mainMat);
      body.position.y = 0.09;
      const slope = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.26), mainMat);
      slope.position.set(0, 0.16, -0.06);
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.62, 12), accMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(0, 0.26, -0.14);
      const sheet = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.32, 0.015),
        new THREE.MeshStandardMaterial({ color: 0xf5ecd9, roughness: 0.9 })
      );
      sheet.position.set(0, 0.4, -0.16);
      sheet.rotation.x = -0.16;
      const keys = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.16), accMat);
      keys.position.set(0, 0.15, 0.13);
      keys.rotation.x = 0.22;
      root.add(body, slope, roller, sheet, keys);
      return;
    }
    if (form === 'gramophone') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.2, 0.44), mainMat);
      box.position.y = 0.1;
      const vinyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.02, 18),
        new THREE.MeshStandardMaterial({ color: 0x161618, roughness: 0.3 })
      );
      vinyl.position.y = 0.21;
      const label = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.024, 12), accMat);
      label.position.y = 0.212;
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.34, 8), accMat);
      neck.position.set(-0.14, 0.34, -0.14);
      neck.rotation.z = -0.35;
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.38, 14, 1, true), accMat);
      horn.material.side = THREE.DoubleSide;
      horn.position.set(0.02, 0.56, -0.02);
      horn.rotation.set(0.45, 0, -1.05);
      root.add(box, vinyl, label, neck, horn);
      this.spinners.push({ mesh: vinyl, axis: 'y', speed: 1.6 });
      return;
    }
    if (form === 'globe') {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.1, 14), woodMat);
      stand.position.y = 0.05;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.2, 10), accMat);
      post.position.y = 0.16;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.018, 8, 22), accMat);
      ring.position.y = 0.42;
      ring.rotation.z = 0.38;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0x3b6778, roughness: 0.6 })
      );
      sphere.position.y = 0.42;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.224, 0.012, 6, 20), mainMat);
      band.position.y = 0.42;
      band.rotation.x = Math.PI / 2 - 0.35;
      root.add(stand, post, ring, sphere, band);
      this.spinners.push({ mesh: sphere, axis: 'y', speed: 0.35 });
      return;
    }

    // --- 3. SUDUT JENDELA (Teleskop Tripod vs Menara Tanaman vs Jam Pendulum) ---
    if (form === 'telescope') {
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.022, 1.55, 8), woodMat);
        leg.position.set(Math.cos(a) * 0.26, 0.72, Math.sin(a) * 0.26);
        leg.rotation.z = Math.cos(a) * 0.24;
        leg.rotation.x = -Math.sin(a) * 0.24;
        root.add(leg);
      }
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 1.35, 14), mainMat);
      barrel.position.set(0, 1.58, -0.05);
      barrel.rotation.set(-1.15, 0, 0.18);
      root.add(barrel);
      return;
    }
    if (form === 'plant_stand') {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.35, 0.42), woodMat);
      stand.position.y = 0.675;
      const potMat = new THREE.MeshStandardMaterial({ color: 0xa6613e, roughness: 0.85 });
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7a47, roughness: 0.8, flatShading: true });
      root.add(stand);
      for (const [px, py, sc] of [[-0.2, 1.48, 0.28], [0.18, 1.52, 0.34], [0, 0.92, 0.24]]) {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.22, 10), potMat);
        pot.position.set(px, py, 0);
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(sc, 0), leafMat);
        bush.position.set(px, py + sc * 0.9, 0);
        root.add(pot, bush);
      }
      return;
    }
    if (form === 'grandfather_clock') {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.35, 0.48), mainMat);
      body.position.y = 1.18;
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.26, 6), mainMat);
      crown.position.y = 2.48;
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 18), accMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, 1.98, 0.24);
      const pendGrp = new THREE.Group();
      pendGrp.position.set(0, 1.55, 0.25);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 6), accMat);
      rod.position.y = -0.32;
      const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 14), accMat);
      bob.rotation.x = Math.PI / 2;
      bob.position.y = -0.66;
      pendGrp.add(rod, bob);
      root.add(body, crown, dial, pendGrp);
      this.pendulums.push(pendGrp);
      return;
    }

    // --- 4. PERANGKAT TEH (Teko Porselen vs Tetsubin Besi vs Kaca Botani) ---
    if (form === 'porcelain') {
      const pot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), mainMat);
      pot.scale.set(1, 0.85, 1);
      pot.position.y = 0.16;
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), accMat);
      lid.position.y = 0.33;
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.04, 0.18, 8), mainMat);
      spout.position.set(-0.18, 0.19, 0);
      spout.rotation.z = 0.8;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 6, 12), accMat);
      handle.position.set(0.18, 0.17, 0);
      root.add(pot, lid, spout, handle);
      return;
    }
    if (form === 'cast_iron') {
      const trivet = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 14), woodMat);
      trivet.position.y = 0.015;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.18, 16), mainMat);
      body.position.y = 0.12;
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 6, 16, Math.PI), mainMat);
      arch.position.y = 0.2;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), accMat);
      knob.position.y = 0.24;
      root.add(trivet, body, arch, knob);
      return;
    }
    if (form === 'glass_infuser') {
      const carafe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.17, 0.32, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xccebf4, transparent: true, opacity: 0.45, roughness: 0.1 })
      );
      carafe.position.y = 0.16;
      const innerTea = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.2, 14),
        new THREE.MeshStandardMaterial({ color: 0xd49635, transparent: true, opacity: 0.78 })
      );
      innerTea.position.y = 0.11;
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.04, 14), woodMat);
      lid.position.y = 0.34;
      root.add(carafe, innerTea, lid);
      return;
    }

    // --- 5. DINDING KIRI (Papan Benang Kasus vs 3 Bingkai Lukisan vs Rak Ambalan) ---
    if (form === 'corkboard') {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 2.2), woodMat);
      const cork = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.28, 2.04), mainMat);
      root.add(frame, cork);
      const cardMat = new THREE.MeshStandardMaterial({ color: 0xf4ecdc, roughness: 0.9 });
      for (const [cy, cz] of [[0.3, -0.55], [-0.22, -0.15], [0.24, 0.45], [-0.25, 0.62]]) {
        const note = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.34, 0.28), cardMat);
        note.position.set(0.02, cy, cz);
        const pin = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), accMat);
        pin.position.set(0.08, cy + 0.12, cz);
        root.add(note, pin);
      }
      return;
    }
    if (form === 'framed_triptych') {
      for (const [z, h] of [[-0.82, 1.05], [0, 1.32], [0.82, 1.05]]) {
        const f = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.66), accMat);
        f.position.z = z;
        const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.09, h - 0.14, 0.52), mainMat);
        canvas.position.z = z;
        root.add(f, canvas);
      }
      return;
    }
    if (form === 'wall_shelves') {
      for (const sy of [-0.32, 0.38]) {
        const plank = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 2.1), mainMat);
        plank.position.set(0.14, sy, 0);
        root.add(plank);
        for (let i = 0; i < 6; i++) {
          const b = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.32, 0.1),
            new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x6e2b36 : 0x355849 })
          );
          b.position.set(0.14, sy + 0.19, -0.75 + i * 0.26);
          root.add(b);
        }
      }
      return;
    }

    // --- 6. PUSAT TAMAN LUAR (Air Mancur vs Sakura+Lentera Batu vs Paviliun Kaca) ---
    if (form === 'tiered_fountain') {
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.75, 0.45, 16), mainMat);
      basin.position.y = 0.22;
      const water = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 0.06, 16), accMat);
      water.position.y = 0.42;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 1.25, 12), mainMat);
      col.position.y = 0.95;
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.35, 0.26, 14), mainMat);
      bowl.position.y = 1.52;
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.85, 10),
        new THREE.MeshBasicMaterial({ color: 0xb7eef7, transparent: true, opacity: 0.78 })
      );
      jet.position.y = 2.0;
      root.add(basin, water, col, bowl, jet);
      this.waterJets.push(jet);
      return;
    }
    if (form === 'sakura_lantern') {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.2, 8), woodMat);
      trunk.position.set(-0.4, 1.1, 0);
      trunk.rotation.z = -0.14;
      const crown = new THREE.Group();
      const pink = new THREE.MeshStandardMaterial({ color: 0xf09cb3, roughness: 0.85, flatShading: true });
      const b1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.45, 0), pink);
      b1.position.set(-0.2, 2.6, 0);
      const b2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 0), pink);
      b2.position.set(0.85, 2.25, 0.3);
      crown.add(b1, b2);
      // Lentera batu Jepang menyala
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.1, 6), accMat);
      stone.position.set(1.2, 0.55, 0.5);
      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), new THREE.MeshBasicMaterial({ color: 0xffd782 }));
      glow.position.set(1.2, 1.24, 0.5);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.28, 6), accMat);
      cap.position.set(1.2, 1.5, 0.5);
      root.add(trunk, crown, stone, glow, cap);
      this.swayTrees.push({ crown, phase: 2.1 });
      return;
    }
    if (form === 'glass_conservatory') {
      const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.95, 0.25, 8), mainMat);
      floor.position.y = 0.12;
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xa6dceb, transparent: true, opacity: 0.38, roughness: 0.15 });
      const walls = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.72, 2.0, 8), glassMat);
      walls.position.y = 1.2;
      const dome = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.1, 8), glassMat);
      dome.position.y = 2.75;
      const warmCore = new THREE.PointLight(0xffcf7a, 1.3, 8, 1.4);
      warmCore.position.y = 1.5;
      root.add(floor, walls, dome, warmCore);
      return;
    }

    // --- 7. SUDUT TAMAN BARAT (Lengkungan Mawar vs Bangku+Lampu Gas vs Kolam Teratai) ---
    if (form === 'rose_pergola') {
      for (const sx of [-1.25, 1.25]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.5, 0.24), mainMat);
        p.position.set(sx, 1.25, 0);
        root.add(p);
      }
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.16, 8, 20, Math.PI), mainMat);
      arch.position.y = 2.4;
      root.add(arch);
      for (let i = 0; i < 7; i++) {
        const a = (i / 6) * Math.PI;
        const rose = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), accMat);
        rose.position.set(Math.cos(a) * 1.28, 2.4 + Math.sin(a) * 1.28, 0.14);
        root.add(rose);
      }
      return;
    }
    if (form === 'stone_bench') {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.16, 0.65), mainMat);
      seat.position.y = 0.58;
      for (const sx of [-0.72, 0.72]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.56, 0.55), mainMat);
        leg.position.set(sx, 0.28, 0);
        root.add(leg);
      }
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 2.9, 8), new THREE.MeshStandardMaterial({ color: 0x22262a }));
      pole.position.set(1.28, 1.45, -0.15);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffda85 }));
      lamp.position.set(1.28, 2.98, -0.15);
      const pl = new THREE.PointLight(0xffcc70, 1.2, 8, 1.4);
      pl.position.set(1.28, 2.9, -0.15);
      root.add(seat, pole, lamp, pl);
      return;
    }
    if (form === 'koi_pond') {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.22, 8, 20), new THREE.MeshStandardMaterial({ color: 0x6f736e }));
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.15;
      const water = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.08, 20), mainMat);
      water.position.y = 0.1;
      root.add(rim, water);
      for (const [lx, lz] of [[-0.5, 0.3], [0.45, -0.35], [0.2, 0.6]]) {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 12), new THREE.MeshStandardMaterial({ color: 0x3b7a4a }));
        pad.position.set(lx, 0.16, lz);
        const lotus = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.16, 6), accMat);
        lotus.position.set(lx, 0.24, lz);
        root.add(pad, lotus);
      }
      return;
    }

    // --- 8. SUDUT PERAPIAN KANAN (Perapian Bata vs Kursi Baca Kulit vs Lemari Arsip Tinggi) ---
    if (form === 'brick_hearth') {
      const mantel = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.9, 1.95), mainMat);
      mantel.position.y = 0.95;
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.6, 1.25), mainMat);
      chimney.position.y = 3.2;
      const hole = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.95, 1.05), new THREE.MeshBasicMaterial({ color: 0x16110e }));
      hole.position.set(-0.04, 0.52, 0);
      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.56, 7), new THREE.MeshBasicMaterial({ color: 0xff9b3d }));
      fire.position.set(-0.18, 0.4, 0);
      const fireLight = new THREE.PointLight(0xff8e36, 1.4, 8, 1.5);
      fireLight.position.set(-0.6, 0.85, 0);
      root.add(mantel, chimney, hole, fire, fireLight);
      this.flames.push({ mesh: fire, baseY: 0.4, phase: 1.4 });
      return;
    }
    if (form === 'reading_nook') {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.95), mainMat);
      seat.position.set(-0.45, 0.38, 0);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.1, 0.95), mainMat);
      back.position.set(-0.08, 0.92, 0);
      const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.05, 8), accMat);
      lampPole.position.set(-0.25, 1.02, -0.78);
      const shade = new THREE.Mesh(
        new THREE.ConeGeometry(0.26, 0.34, 12),
        new THREE.MeshStandardMaterial({ color: 0xffe4ad, emissive: 0xffc066, emissiveIntensity: 0.65 })
      );
      shade.position.set(-0.25, 2.05, -0.78);
      root.add(seat, back, lampPole, shade);
      return;
    }
    // tall_bookcase
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.6, 1.9), mainMat);
    cabinet.position.y = 1.8;
    root.add(cabinet);
    for (let r = 0; r < 5; r++) {
      for (let i = 0; i < 8; i++) {
        const bk = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.38, 0.14),
          new THREE.MeshStandardMaterial({ color: (r + i) % 2 === 0 ? 0x7a343b : 0x3b584d })
        );
        bk.position.set(-0.16, 0.55 + r * 0.64, -0.7 + i * 0.2);
        root.add(bk);
      }
    }
  }

  syncUpgrades(upgrades = {}, animateId = null) {
    for (const up of SALON_UPGRADES) {
      const styleIdx = typeof upgrades[up.id] === 'number' ? upgrades[up.id] : -1;
      if (this.upgradeState.get(up.id) === styleIdx) continue;
      this.upgradeState.set(up.id, styleIdx);

      const root = this.upgradeRoots.get(up.id);
      if (!root) continue;
      while (root.children.length > 0) root.remove(root.children[0]);

      if (styleIdx >= 0) {
        const st = up.styles[styleIdx] || up.styles[0];
        this.buildUpgradeForm(st.form, st, root);
        if (animateId === up.id) this.upgradeBounce.set(up.id, 0.01);
      }
    }
  }

  previewUpgrade(slotId, styleIdx) {
    const up = SALON_UPGRADES.find((u) => u.id === slotId);
    const root = this.upgradeRoots.get(slotId);
    if (!up || !root) return;
    this.previewSlotId = slotId;
    while (root.children.length > 0) root.remove(root.children[0]);
    const st = up.styles[styleIdx] || up.styles[0];
    this.buildUpgradeForm(st.form, st, root);
    this.upgradeState.set(slotId, `preview_${styleIdx}`);
    this.upgradeBounce.set(slotId, 0.01);
    this.camTarget = { ...up.cam };
  }

  clearPreview(upgrades = {}) {
    this.previewSlotId = null;
    this.camTarget = { ...this.baseFocus };
    this.syncUpgrades(upgrades);
  }

  setTeaColor(hexColor) {
    if (this.teaLiquidMat && hexColor) {
      this.teaLiquidMat.color.set(hexColor);
    }
  }

  setVisitor(present, coatColor = '#6B3A3E') {
    this.visitorVisible = Boolean(present);
    if (this.visitorGroup) {
      this.visitorGroup.visible = this.visitorVisible;
      if (this.visitorCoatMat && coatColor) this.visitorCoatMat.color.set(coatColor);
    }
  }

  triggerArkaTalk(durationSec = 2.4) {
    this.arkaTalkingUntil = performance.now() / 1000 + durationSec;
  }

  rotateCamera(deltaYaw, deltaPitch = 0) {
    this.camTarget.yaw = Math.max(-1.25, Math.min(1.25, this.camTarget.yaw + deltaYaw));
    if (deltaPitch) {
      this.camTarget.pitch = Math.max(-0.05, Math.min(0.65, this.camTarget.pitch + deltaPitch));
    }
  }

  zoomCamera(deltaDist) {
    this.camTarget.dist = Math.max(2.3, Math.min(7.2, this.camTarget.dist + deltaDist));
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  update(dt, nowSec) {
    // Hujan jatuh di luar jendela
    for (const r of this.rainDrops) {
      r.mesh.position.y -= r.speed * dt;
      if (r.mesh.position.y < -0.2) {
        r.mesh.position.y = 7.4;
        r.mesh.position.x = (Math.random() - 0.5) * 14;
      }
    }

    // Uap hangat dari cangkir teh
    for (const p of this.steamPuffs) {
      const cycle = ((nowSec * 0.45 + p.phase) % 1);
      p.mesh.position.y = 1.28 + cycle * 0.65;
      p.mesh.position.x = p.bx + Math.sin(nowSec * 1.5 + p.phase) * 0.04;
      p.mesh.scale.setScalar(0.6 + cycle * 1.1);
      p.mesh.material.opacity = (1 - cycle) * 0.2;
    }

    // Api lilin & perapian berkedip lembut
    for (const f of this.flames) {
      const flick = 0.88 + Math.sin(nowSec * 11 + f.phase) * 0.14;
      f.mesh.scale.set(1, flick, 1);
      f.mesh.position.y = f.baseY + (flick - 1) * 0.04;
    }

    for (const p of this.pendulums) p.rotation.z = Math.sin(nowSec * 2.6) * 0.24;
    for (const s of this.spinners) s.mesh.rotation[s.axis] += s.speed * dt;
    for (const j of this.waterJets) j.scale.y = 0.85 + Math.sin(nowSec * 8.5) * 0.2;
    for (const t of this.swayTrees) t.crown.rotation.z = Math.sin(nowSec * 1.3 + t.phase) * 0.035;

    // Arka bernapas pelan, berkedip, dan mengangguk ringan saat membalas obrolan
    const blink = (nowSec % 4.1) > 3.96 ? 0.12 : 1;
    if (this.arkaLeftEye && this.arkaRightEye) {
      this.arkaLeftEye.scale.y = blink;
      this.arkaRightEye.scale.y = blink;
    }
    if (this.arkaHead) {
      const talking = nowSec < this.arkaTalkingUntil;
      this.arkaHead.rotation.x = talking ? Math.sin(nowSec * 6.2) * 0.07 : Math.sin(nowSec * 1.2) * 0.02;
      this.arkaHead.rotation.y = Math.sin(nowSec * 0.7) * 0.08;
    }
    if (this.arkaBody) {
      this.arkaBody.position.y = Math.sin(nowSec * 1.8) * 0.015;
    }

    // Animasi pop halus saat dekor baru dipasang atau dipratinjau
    for (const [id, prog] of this.upgradeBounce) {
      const next = Math.min(1, prog + dt * 2.8);
      const root = this.upgradeRoots.get(id);
      if (root) {
        const sc = next < 0.7 ? (next / 0.7) * 1.09 : 1.09 - ((next - 0.7) / 0.3) * 0.09;
        root.scale.setScalar(sc);
      }
      if (next >= 1) this.upgradeBounce.delete(id);
      else this.upgradeBounce.set(id, next);
    }

    // Interpolasi kamera halus
    const damp = Math.min(1, dt * 6.5);
    for (const k of ['x', 'y', 'z', 'dist', 'yaw', 'pitch']) {
      this.camCur[k] += (this.camTarget[k] - this.camCur[k]) * damp;
    }

    const horiz = this.camCur.dist * Math.cos(this.camCur.pitch);
    const cx = this.camCur.x + Math.sin(this.camCur.yaw) * horiz;
    const cz = this.camCur.z + Math.cos(this.camCur.yaw) * horiz;
    const cy = this.camCur.y + this.camCur.dist * Math.sin(this.camCur.pitch);

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.camCur.x, this.camCur.y, this.camCur.z);
    this.renderer.render(this.scene, this.camera);
  }
}
