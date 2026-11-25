// Mesin Bola Bumi 3D Interaktif (Three.js r160) untuk Semua Bumi.
// Memuat bumi berlabel 3D, tokoh 3D Beliau bersama kawanan ikan julung-julung terbang,
// Bus Damri 3D yang ikut mengorbit dan berpapasan di langit, serta pin dan lengkung jarak 3D.

import * as THREE from '../vendor/three.module.min.js';

export const EARTH_RADIUS = 2.6;

const UP_VEC = new THREE.Vector3(0, 1, 0);

const COUNTRY_NAME_ID = {
  'United States of America': 'Amerika Serikat',
  'United Kingdom': 'Inggris',
  Japan: 'Jepang',
  'South Korea': 'Korea Selatan',
  'North Korea': 'Korea Utara',
  Germany: 'Jerman',
  France: 'Prancis',
  Italy: 'Italia',
  Spain: 'Spanyol',
  Switzerland: 'Swiss',
  Netherlands: 'Belanda',
  China: 'Tiongkok',
  Russia: 'Rusia',
  Egypt: 'Mesir',
  Greece: 'Yunani',
  Sweden: 'Swedia',
  Norway: 'Norwegia',
  Poland: 'Polandia',
  Belgium: 'Belgia',
  Ireland: 'Irlandia',
  Turkey: 'Turki',
  'Saudi Arabia': 'Arab Saudi',
  'New Zealand': 'Selandia Baru',
  Canada: 'Kanada',
  Mexico: 'Meksiko',
  Brazil: 'Brasil',
  Chile: 'Chili',
  Colombia: 'Kolombia',
  'South Africa': 'Afrika Selatan',
  Morocco: 'Maroko',
  Philippines: 'Filipina',
  Antarctica: 'Antartika',
  Iceland: 'Islandia',
  Finland: 'Finlandia',
  Hungary: 'Hungaria',
  Ukraine: 'Ukraina',
  Czechia: 'Ceko',
  'United Arab Emirates': 'Uni Emirat Arab',
  'Papua New Guinea': 'Papua Nugini'
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function shortestLonDelta(fromLon, toLon) {
  return ((((toLon - fromLon) % 360) + 540) % 360) - 180;
}

// Konversi koordinat yang selaras 1:1 dengan UV Three.js SphereGeometry dan earth_atlas.png
export function latLonToVec3(lat, lon, radius = EARTH_RADIUS) {
  const theta = ((90 - lat) * Math.PI) / 180;
  const phi = ((lon + 180) * Math.PI) / 180;
  const sinTheta = Math.sin(theta);
  return new THREE.Vector3(
    -radius * Math.cos(phi) * sinTheta,
    radius * Math.cos(theta),
    radius * Math.sin(phi) * sinTheta
  );
}

export function vec3ToLatLon(vec) {
  const n = vec.clone().normalize();
  const lat = 90 - (Math.acos(clamp(n.y, -1, 1)) * 180) / Math.PI;
  let phi = Math.atan2(n.z, -n.x);
  if (phi < 0) phi += Math.PI * 2;
  let lon = (phi * 180) / Math.PI - 180;
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  return { lat, lon };
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function formatCoord(lat, lon) {
  const ns = lat >= 0 ? 'LU' : 'LS';
  const ew = lon >= 0 ? 'BT' : 'BB';
  return `${Math.abs(lat).toFixed(1)}° ${ns}, ${Math.abs(lon).toFixed(1)}° ${ew}`;
}

function getOceanLabel(lat, lon) {
  if (lat > 67) return 'Samudra Arktik';
  if (lat < -60) return 'Samudra Selatan';
  if (lon > 20 && lon < 120 && lat < 28) return 'Samudra Hindia';
  if (lon >= -72 && lon <= 20) return 'Samudra Atlantik';
  return 'Samudra Pasifik';
}

function disposeGroupChildren(group) {
  while (group.children.length > 0) {
    const child = group.children.pop();
    child.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}

export class AtlasGlobe3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.labelsContainer = options.labelsContainer || null;
    this.onGlobeClick = options.onGlobeClick || null;
    this.onHover = options.onHover || null;
    this.onUnlockedPinClick = options.onUnlockedPinClick || null;
    this.onCountryLabelClick = options.onCountryLabelClick || null;
    this.onBeliauClick = options.onBeliauClick || null;
    this.onBusClick = options.onBusClick || null;
    this.onBusEncounter = options.onBusEncounter || null;

    this.countriesMeta = [];
    this.countryLabels = [];
    this.labelsVisible = true;
    this.activeCountryId = null;

    this.interactivePinMode = false;
    this.autoRotate = true;

    // Kamera dalam koordinat geografi langsung (membuka tepat di Indonesia)
    this.camLat = 4;
    this.camLon = 114;
    this.camDist = 6.2;
    this.targetLat = 4;
    this.targetLon = 114;
    this.targetDist = 6.2;

    // Posisi 3D Beliau dan kawanan ikan julung-julung terbang
    this.beliauLat = -2.2;
    this.beliauLon = 117.5;
    this.targetBeliauLat = -2.2;
    this.targetBeliauLon = 117.5;
    this.beliauFlyingFish = [];

    // Orbit 3D Bus Damri ("Saya") yang ikut berputar mengelilingi bumi
    this.busLat = -6.9;
    this.busLon = 86.0;
    this.busOrbitAngle = 1.48;
    this.busOrbitPrecession = 0.0;
    this.busOrbitInclination = 0.56; // ~32 derajat sehingga menyapu lintas benua
    this.busEncounterCooldown = 0;
    this.busEncounterTimer = 0;
    this.busSummonTarget = null;
    this.busWakeDots = [];

    this.dragging = false;
    this.dragDist = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.velLat = 0;
    this.velLon = 0;
    this.lastInteractionAt = 0;

    this.animatedArcs = [];
    this.pulseRings = [];
    this.unlockedPinMeshes = [];

    this.raycaster = new THREE.Raycaster();
    this.pointerNDC = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this._projVec = new THREE.Vector3();
    this._basisMat = new THREE.Matrix4();

    this.initScene();
    this.loadCountriesMeta();
    this.bindEvents();
    this.handleResize();
    this.animate();
  }

  initScene() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06101e);

    this.camera = new THREE.PerspectiveCamera(40, 16 / 10, 0.1, 140);

    this.ambientLight = new THREE.AmbientLight(0xd7e6ff, 0.96);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xb2d8ff, 0x1e2c44, 0.44);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff5e4, 1.38);
    this.sunLight.position.set(8, 6, 9);
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0x52a6ff, 0.54);
    this.rimLight.position.set(-10, -4, -8);
    this.scene.add(this.rimLight);

    this.buildStarfield();
    this.buildEarth();
    this.buildBeliauAndFish();
    this.buildBusDamri();

    this.guessGroup = new THREE.Group();
    this.revealGroup = new THREE.Group();
    this.unlockedGroup = new THREE.Group();
    this.scene.add(this.guessGroup);
    this.scene.add(this.revealGroup);
    this.scene.add(this.unlockedGroup);

    this.buildHoverReticle();
  }

  buildStarfield() {
    const count = 950;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0xfff7e6),
      new THREE.Color(0xcde2ff),
      new THREE.Color(0xf6d899),
      new THREE.Color(0x9fc4f5)
    ];

    for (let i = 0; i < count; i++) {
      const r = 24 + Math.random() * 28;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.cos(theta);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);

      const c = palette[i % palette.length];
      const bright = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      sizeAttenuation: true,
      depthWrite: false
    });

    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  buildEarth() {
    const loader = new THREE.TextureLoader();

    const earthTex = loader.load('assets/earth_atlas.png');
    earthTex.colorSpace = THREE.SRGBColorSpace;
    earthTex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());

    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 72, 54);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.72,
      metalness: 0.06
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.scene.add(this.earthMesh);

    const cloudsTex = loader.load('assets/earth_clouds.png');
    cloudsTex.colorSpace = THREE.SRGBColorSpace;
    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS + 0.028, 56, 40);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.34,
      roughness: 0.95,
      metalness: 0.0,
      depthWrite: false
    });
    this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    this.scene.add(this.cloudsMesh);

    const atmoGeo = new THREE.SphereGeometry(EARTH_RADIUS + 0.24, 56, 40);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(0x4aa8ff) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float rim = pow(clamp(0.72 - dot(vNormal, viewDir), 0.0, 1.0), 2.8);
          gl_FragColor = vec4(glowColor, rim * 0.82);
        }
      `
    });
    this.atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    this.scene.add(this.atmoMesh);
  }

  // Tokoh 3D Beliau + kawanan 6 ikan julung-julung terbang di sekitar kepala Beliau
  buildBeliauAndFish() {
    this.beliauAnchor = new THREE.Group();
    this.beliauBody = new THREE.Group();
    this.beliauAnchor.add(this.beliauBody);

    // Alas cahaya lembut di bawah kaki Beliau
    const haloGeo = new THREE.RingGeometry(0.085, 0.13, 28);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf7dc92,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    this.beliauHalo = new THREE.Mesh(haloGeo, haloMat);
    this.beliauHalo.rotation.x = -Math.PI / 2;
    this.beliauHalo.position.set(0, 0.01, 0);
    this.beliauBody.add(this.beliauHalo);

    // Jubah biru langit malam yang bersih dan elegan
    const cloakGeo = new THREE.ConeGeometry(0.088, 0.21, 18);
    const cloakMat = new THREE.MeshStandardMaterial({
      color: 0x244a84,
      emissive: 0x102749,
      emissiveIntensity: 0.42,
      roughness: 0.42,
      metalness: 0.12
    });
    const cloak = new THREE.Mesh(cloakGeo, cloakMat);
    cloak.position.set(0, 0.125, 0);
    this.beliauBody.add(cloak);

    // Kerah syal krem hangat
    const scarfGeo = new THREE.TorusGeometry(0.044, 0.015, 10, 20);
    const scarfMat = new THREE.MeshStandardMaterial({
      color: 0xf6dfaa,
      emissive: 0x8f6b2c,
      emissiveIntensity: 0.28,
      roughness: 0.5
    });
    const scarf = new THREE.Mesh(scarfGeo, scarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.set(0, 0.22, 0);
    this.beliauBody.add(scarf);

    // Kepala Beliau
    const headGeo = new THREE.SphereGeometry(0.062, 20, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf9e5cc,
      roughness: 0.48,
      metalness: 0.05
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.275, 0);
    this.beliauBody.add(head);

    // Rambut pendek gelap lembut
    const hairGeo = new THREE.SphereGeometry(0.066, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x192338,
      roughness: 0.65
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.282, -0.004);
    this.beliauBody.add(hair);

    // Lentera kecil bercahaya hangat di sisi Beliau
    const orbGeo = new THREE.SphereGeometry(0.022, 12, 10);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffebb0 });
    this.beliauOrb = new THREE.Mesh(orbGeo, orbMat);
    this.beliauOrb.position.set(0.105, 0.19, 0.045);
    this.beliauBody.add(this.beliauOrb);

    // Kawanan 6 ikan julung-julung terbang (paruh lancip khas + sirip sayap tipis berkilau)
    const fishPalette = [0x8ee7ff, 0xf8dc8d, 0x73d4f8, 0xbef5ff, 0xffe4a1, 0x62c4f5];
    this.beliauFlyingFish = [];
    for (let i = 0; i < 6; i++) {
      const fish = this.createFlyingFishMesh(fishPalette[i % fishPalette.length]);
      this.beliauAnchor.add(fish.group);
      this.beliauFlyingFish.push({
        group: fish.group,
        wingL: fish.wingL,
        wingR: fish.wingR,
        tail: fish.tail,
        radius: 0.2 + (i % 3) * 0.055,
        baseHeight: 0.28 + (i % 3) * 0.075,
        speed: 1.05 + (i % 4) * 0.22,
        phase: (i / 6) * Math.PI * 2,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.04 + (i % 3) * 0.02)
      });
    }

    // Cincin cahaya pertemuan tipis dan lembut di sekitar Beliau
    const meetGeo = new THREE.RingGeometry(0.165, 0.184, 48);
    const meetMat = new THREE.MeshBasicMaterial({
      color: 0xffe49e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.encounterRing = new THREE.Mesh(meetGeo, meetMat);
    this.encounterRing.rotation.x = -Math.PI / 2;
    this.encounterRing.position.set(0, 0.14, 0);
    this.beliauAnchor.add(this.encounterRing);

    // Hitbox tak kasat mata agar Beliau mudah diklik di bola bumi
    const hitGeo = new THREE.SphereGeometry(0.24, 12, 10);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.beliauHitMesh = new THREE.Mesh(hitGeo, hitMat);
    this.beliauHitMesh.position.set(0, 0.22, 0);
    this.beliauAnchor.add(this.beliauHitMesh);

    this.scene.add(this.beliauAnchor);
  }

  createFlyingFishMesh(tintHex) {
    const group = new THREE.Group();

    // Tubuh ramping ikan julung-julung (mengarah ke +Z)
    const bodyGeo = new THREE.ConeGeometry(0.018, 0.105, 8);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: tintHex,
      emissive: tintHex,
      emissiveIntensity: 0.52,
      roughness: 0.2,
      metalness: 0.45
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Paruh bawah tipis memanjang khas ikan julung-julung
    const beakGeo = new THREE.CylinderGeometry(0.002, 0.005, 0.045, 6);
    beakGeo.rotateX(Math.PI / 2);
    const beak = new THREE.Mesh(beakGeo, bodyMat);
    beak.position.set(0, -0.002, 0.068);
    group.add(beak);

    // Sepasang sirip sayap transparan untuk terbang di langit
    const wingGeo = new THREE.PlaneGeometry(0.068, 0.032);
    const wingMat = new THREE.MeshBasicMaterial({
      color: 0xe6f8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.78
    });
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.rotation.x = -Math.PI / 2;
    wingL.position.set(-0.034, 0.004, 0.01);
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.rotation.x = -Math.PI / 2;
    wingR.position.set(0.034, 0.004, 0.01);
    group.add(wingR);

    // Sirip ekor bercabang halus
    const tailGeo = new THREE.ConeGeometry(0.016, 0.034, 4);
    tailGeo.rotateX(-Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, wingMat);
    tail.position.set(0, 0, -0.06);
    group.add(tail);

    return { group, wingL, wingR, tail };
  }

  // Model 3D Bus Damri ("Saya") dengan corak putih, biru Damri, garis emas, dan lampu hangat
  buildBusDamri() {
    this.busAnchor = new THREE.Group();
    this.busModel = new THREE.Group();
    this.busAnchor.add(this.busModel);

    // Badan atas putih gading (+Z = arah maju bus)
    const upperGeo = new THREE.BoxGeometry(0.145, 0.078, 0.34);
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7fc,
      emissive: 0x35496b,
      emissiveIntensity: 0.25,
      roughness: 0.32,
      metalness: 0.14
    });
    const upper = new THREE.Mesh(upperGeo, upperMat);
    upper.position.set(0, 0.11, 0);
    this.busModel.add(upper);

    // Bagian bawah biru kobalt khas Damri
    const lowerGeo = new THREE.BoxGeometry(0.149, 0.056, 0.346);
    const lowerMat = new THREE.MeshStandardMaterial({
      color: 0x1a58bd,
      emissive: 0x0d2d66,
      emissiveIntensity: 0.42,
      roughness: 0.35,
      metalness: 0.22
    });
    const lower = new THREE.Mesh(lowerGeo, lowerMat);
    lower.position.set(0, 0.048, 0);
    this.busModel.add(lower);

    // Garis sabuk emas kuning Damri
    const stripeGeo = new THREE.BoxGeometry(0.153, 0.014, 0.348);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf5c45e });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.076, 0);
    this.busModel.add(stripe);

    // Deretan jendela kabin hangat bercahaya
    const sideWinGeo = new THREE.BoxGeometry(0.151, 0.036, 0.255);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffe8a3 });
    const sideWin = new THREE.Mesh(sideWinGeo, winMat);
    sideWin.position.set(0, 0.114, -0.01);
    this.busModel.add(sideWin);

    // Kaca depan + papan trayek emas bercahaya
    const frontWinGeo = new THREE.BoxGeometry(0.125, 0.044, 0.012);
    const frontWin = new THREE.Mesh(frontWinGeo, winMat);
    frontWin.position.set(0, 0.106, 0.17);
    this.busModel.add(frontWin);

    const boardGeo = new THREE.BoxGeometry(0.092, 0.014, 0.014);
    const boardMat = new THREE.MeshBasicMaterial({ color: 0xf8cf6a });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 0.138, 0.17);
    this.busModel.add(board);

    // Sepasang lampu depan hangat & lampu belakang merah
    const headLightGeo = new THREE.SphereGeometry(0.014, 10, 8);
    const headLightMat = new THREE.MeshBasicMaterial({ color: 0xfff5cb });
    const hlL = new THREE.Mesh(headLightGeo, headLightMat);
    hlL.position.set(-0.046, 0.052, 0.176);
    const hlR = new THREE.Mesh(headLightGeo, headLightMat);
    hlR.position.set(0.046, 0.052, 0.176);
    this.busModel.add(hlL, hlR);

    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff6b5c });
    const tlL = new THREE.Mesh(headLightGeo, tailLightMat);
    tlL.scale.set(0.75, 0.75, 0.75);
    tlL.position.set(-0.048, 0.054, -0.176);
    const tlR = tlL.clone();
    tlR.position.set(0.048, 0.054, -0.176);
    this.busModel.add(tlL, tlR);

    // Empat roda bundar
    const wheelGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.02, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x161c28, roughness: 0.85 });
    const wheelCoords = [
      [-0.072, 0.022, 0.1],
      [0.072, 0.022, 0.1],
      [-0.072, 0.022, -0.1],
      [0.072, 0.022, -0.1]
    ];
    wheelCoords.forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, wy, wz);
      this.busModel.add(w);
    });

    // Jejak debu bintang lembut di belakang Bus Damri
    const wakeGeo = new THREE.SphereGeometry(0.012, 8, 8);
    for (let i = 0; i < 4; i++) {
      const wakeMat = new THREE.MeshBasicMaterial({
        color: 0xf7db91,
        transparent: true,
        opacity: 0.55 - i * 0.11
      });
      const dot = new THREE.Mesh(wakeGeo, wakeMat);
      dot.position.set((i % 2 === 0 ? -1 : 1) * 0.025, 0.045, -0.24 - i * 0.085);
      this.busModel.add(dot);
      this.busWakeDots.push(dot);
    }

    // Hitbox klik untuk Bus Damri
    const busHitGeo = new THREE.SphereGeometry(0.24, 12, 10);
    const busHitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.busHitMesh = new THREE.Mesh(busHitGeo, busHitMat);
    this.busHitMesh.position.set(0, 0.09, 0);
    this.busAnchor.add(this.busHitMesh);

    this.scene.add(this.busAnchor);
  }

  buildHoverReticle() {
    const ringGeo = new THREE.RingGeometry(0.055, 0.078, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf4cf7b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    this.hoverReticle = new THREE.Mesh(ringGeo, ringMat);
    this.hoverReticle.visible = false;
    this.scene.add(this.hoverReticle);
  }

  async loadCountriesMeta() {
    try {
      const res = await fetch('assets/countries_meta.json');
      if (res.ok) {
        this.countriesMeta = await res.json();
      }
    } catch {
      this.countriesMeta = [];
    }
  }

  // Sinkronkan label negara 3D yang menempel langsung di permukaan bumi
  setCountryLabels(countries, visitedSet = new Set(), activeId = null) {
    this.activeCountryId = activeId;
    if (!this.labelsContainer) return;

    this.labelsContainer.innerHTML = '';
    this.countryLabels = countries.map((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-country-label';
      if (visitedSet.has(c.id)) btn.classList.add('is-visited');
      if (c.id === activeId) btn.classList.add('is-active');
      btn.dataset.countryId = c.id;
      btn.innerHTML = `<span class="label-dot"></span><span>${c.name}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onCountryLabelClick) this.onCountryLabelClick(c);
      });
      this.labelsContainer.appendChild(btn);

      const pos = latLonToVec3(c.lat, c.lon, EARTH_RADIUS + 0.032);
      return {
        country: c,
        el: btn,
        pos,
        normal: pos.clone().normalize()
      };
    });
  }

  updateCountryLabelStates(visitedSet = new Set(), activeId = null) {
    this.activeCountryId = activeId;
    for (let i = 0; i < this.countryLabels.length; i++) {
      const item = this.countryLabels[i];
      item.el.classList.toggle('is-visited', visitedSet.has(item.country.id));
      item.el.classList.toggle('is-active', item.country.id === activeId);
    }
  }

  setLabelsVisible(visible) {
    this.labelsVisible = Boolean(visible);
    if (this.labelsContainer) {
      this.labelsContainer.classList.toggle('hidden', !this.labelsVisible);
    }
  }

  projectCountryLabels() {
    if (!this.labelsVisible || !this.countryLabels.length) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width <= 0 || height <= 0) return;

    const camDir = this.camera.position.clone().normalize();
    const candidates = [];

    // Ambil kotak panel HUD aktif agar label negara tidak mengintip di balik kartu atau laci
    const blockedBoxes = [];
    const hudIds = ['round-dock', 'bus-drawer', 'beliau-popup'];
    for (let b = 0; b < hudIds.length; b++) {
      const node = document.getElementById(hudIds[b]);
      if (node && !node.classList.contains('hidden')) {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          blockedBoxes.push({
            left: r.left - 34,
            right: r.right + 34,
            top: r.top - 14,
            bottom: r.bottom + 14
          });
        }
      }
    }

    for (let i = 0; i < this.countryLabels.length; i++) {
      const item = this.countryLabels[i];
      const facing = item.normal.dot(camDir);
      if (facing < 0.24) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        continue;
      }

      this._projVec.copy(item.pos).project(this.camera);
      if (this._projVec.z > 1) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        continue;
      }

      const sx = (this._projVec.x * 0.5 + 0.5) * width;
      const sy = (-this._projVec.y * 0.5 + 0.5) * height;
      const isActive = item.country.id === this.activeCountryId;

      // Hindari area HUD atas & kotak panel aktif agar label selalu bersih
      let inBlocked = sy < 94 || sy > height - 42 || sx < 48 || sx > width - 48;
      if (!inBlocked && !isActive) {
        for (let b = 0; b < blockedBoxes.length; b++) {
          const box = blockedBoxes[b];
          if (sx >= box.left && sx <= box.right && sy >= box.top && sy <= box.bottom) {
            inBlocked = true;
            break;
          }
        }
      }

      if (inBlocked) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        continue;
      }

      candidates.push({
        item,
        sx,
        sy,
        facing,
        priority: (isActive ? 10 : 0) + facing
      });
    }

    // Urutkan dari prioritas tertinggi (negara aktif & paling menghadap kamera) agar tidak saling menumpuk
    candidates.sort((a, b) => b.priority - a.priority);
    const placed = [];

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const isActive = c.item.country.id === this.activeCountryId;
      let collides = false;
      if (!isActive) {
        for (let j = 0; j < placed.length; j++) {
          const p = placed[j];
          if (Math.abs(c.sx - p.sx) < 76 && Math.abs(c.sy - p.sy) < 26) {
            collides = true;
            break;
          }
        }
      }

      if (collides) {
        c.item.el.style.opacity = '0';
        c.item.el.style.pointerEvents = 'none';
        continue;
      }

      placed.push(c);
      const fade = isActive ? 1 : clamp((c.facing - 0.24) / 0.26, 0.2, 0.96);
      c.item.el.style.transform = `translate3d(${c.sx.toFixed(1)}px, ${c.sy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      c.item.el.style.opacity = fade.toFixed(2);
      c.item.el.style.pointerEvents = 'auto';
    }
  }

  flyBeliauTo(lat, lon) {
    this.targetBeliauLat = clamp(lat, -72, 72);
    this.targetBeliauLon = lon;
  }

  summonBusToBeliau() {
    this.busSummonTarget = {
      lat: clamp(this.targetBeliauLat + 4, -68, 68),
      lon: this.targetBeliauLon + 7
    };
    this.busEncounterCooldown = 0;
  }

  focusBusDamri() {
    this.setAutoRotate(false);
    this.focusLatLon(this.busLat, this.busLon, 5.2);
  }

  focusBeliau() {
    this.setAutoRotate(false);
    this.focusLatLon(this.beliauLat, this.beliauLon, 5.2);
  }

  getBusLocation() {
    return {
      lat: this.busLat,
      lon: this.busLon,
      placeLabel: this.lookupPlaceLabel(this.busLat, this.busLon)
    };
  }

  lookupPlaceLabel(lat, lon) {
    if (!this.countriesMeta || !this.countriesMeta.length) {
      return getOceanLabel(lat, lon);
    }

    let best = null;
    let bestScore = Infinity;

    for (let i = 0; i < this.countriesMeta.length; i++) {
      const c = this.countriesMeta[i];
      const [minLon, minLat, maxLon, maxLat] = c.bbox;
      if (c.name === 'Antarctica' && lat > -61) continue;
      if (c.name === 'Fiji' && (lat < -20 || lat > -15 || (lon < 175 && lon > -177))) continue;

      const spanLon = maxLon - minLon;
      const inLat = lat >= minLat - 0.6 && lat <= maxLat + 0.6;
      const inLon = spanLon > 300 ? true : lon >= minLon - 0.6 && lon <= maxLon + 0.6;
      if (!inLat || !inLon) continue;

      if (c.name === 'France' && lon < -8 && lat > 12) continue;

      const area = Math.max(1, Math.min(spanLon, 180) * (maxLat - minLat));
      const d = haversineKm(lat, lon, c.lat, c.lon);
      const score = d * 0.65 + Math.sqrt(area) * 42;
      if (score < bestScore) {
        bestScore = score;
        best = c;
      }
    }

    if (best && bestScore < 4200) {
      return COUNTRY_NAME_ID[best.name] || best.name;
    }
    return getOceanLabel(lat, lon);
  }

  setPinMode(enabled) {
    this.interactivePinMode = Boolean(enabled);
    if (!this.interactivePinMode && this.hoverReticle) {
      this.hoverReticle.visible = false;
    }
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
  }

  createPinMarker(lat, lon, colorHex = 0xe85a4f, scale = 1.0, addPulse = true) {
    const group = new THREE.Group();
    const pos = latLonToVec3(lat, lon, EARTH_RADIUS);
    const normal = pos.clone().normalize();
    group.position.copy(pos);
    group.quaternion.setFromUnitVectors(UP_VEC, normal);

    const stemGeo = new THREE.CylinderGeometry(0.014 * scale, 0.005 * scale, 0.19 * scale, 10);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xe7c985,
      roughness: 0.28,
      metalness: 0.78
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.095 * scale, 0);
    group.add(stem);

    const headGeo = new THREE.SphereGeometry(0.056 * scale, 18, 14);
    const headMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.15
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.2 * scale, 0);
    group.add(head);

    const baseRingGeo = new THREE.RingGeometry(0.036 * scale, 0.062 * scale, 24);
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.set(0, 0.014, 0);
    group.add(baseRing);

    if (addPulse) {
      const pulseGeo = new THREE.RingGeometry(0.05 * scale, 0.072 * scale, 28);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.rotation.x = -Math.PI / 2;
      pulse.position.set(0, 0.017, 0);
      group.add(pulse);
      this.pulseRings.push({ mesh: pulse, phase: Math.random() * Math.PI * 2, baseScale: scale });
    }

    return group;
  }

  createGreatCircleArc(lat1, lon1, lat2, lon2, colorHex = 0xf4cf7b, animateDraw = true) {
    const v1 = latLonToVec3(lat1, lon1, 1).normalize();
    const v2 = latLonToVec3(lat2, lon2, 1).normalize();
    const dot = clamp(v1.dot(v2), -1, 1);
    const omega = Math.acos(dot);
    const sinOmega = Math.sin(omega);

    const segments = 48;
    const points = [];
    const maxLift = clamp(0.18 + (omega / Math.PI) * 0.92, 0.16, 1.05);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let dir;
      if (sinOmega < 0.001) {
        dir = v1.clone().lerp(v2, t).normalize();
      } else {
        const w1 = Math.sin((1 - t) * omega) / sinOmega;
        const w2 = Math.sin(t * omega) / sinOmega;
        dir = v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).normalize();
      }
      const lift = Math.sin(t * Math.PI) * maxLift;
      points.push(dir.multiplyScalar(EARTH_RADIUS + 0.03 + lift));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, segments, 0.018, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.94
    });
    const mesh = new THREE.Mesh(tubeGeo, tubeMat);

    if (animateDraw) {
      const totalIndices = tubeGeo.index ? tubeGeo.index.count : tubeGeo.attributes.position.count;
      tubeGeo.setDrawRange(0, 0);
      this.animatedArcs.push({
        geo: tubeGeo,
        total: totalIndices,
        progress: 0,
        speed: 1.55
      });
    }

    return mesh;
  }

  clearRoundVisuals() {
    this.pulseRings = [];
    this.animatedArcs = [];
    disposeGroupChildren(this.guessGroup);
    disposeGroupChildren(this.revealGroup);
  }

  setGuessPin(lat, lon) {
    disposeGroupChildren(this.guessGroup);
    const pin = this.createPinMarker(lat, lon, 0xf26457, 1.05, true);
    this.guessGroup.add(pin);
  }

  revealAnswerArc(guessLat, guessLon, trueLat, trueLon) {
    disposeGroupChildren(this.revealGroup);
    const answerPin = this.createPinMarker(trueLat, trueLon, 0x3dd68c, 1.2, true);
    this.revealGroup.add(answerPin);

    if (typeof guessLat === 'number' && typeof guessLon === 'number') {
      const arc = this.createGreatCircleArc(guessLat, guessLon, trueLat, trueLon, 0xf6d379, true);
      this.revealGroup.add(arc);
    }

    this.flyBeliauTo(trueLat, trueLon);
    this.focusLatLon(trueLat, trueLon, 5.45);
  }

  showDuelMarkers(itemA, itemB, winnerSide = null) {
    this.clearRoundVisuals();
    const colorA = winnerSide === 'a' ? 0x3dd68c : 0xf4b95a;
    const colorB = winnerSide === 'b' ? 0x3dd68c : 0x5bc0eb;

    const pinA = this.createPinMarker(itemA.lat, itemA.lon, colorA, winnerSide === 'a' ? 1.22 : 1.02, true);
    const pinB = this.createPinMarker(itemB.lat, itemB.lon, colorB, winnerSide === 'b' ? 1.22 : 1.02, true);
    const arc = this.createGreatCircleArc(itemA.lat, itemA.lon, itemB.lat, itemB.lon, 0xf4cf7b, true);

    this.revealGroup.add(pinA);
    this.revealGroup.add(pinB);
    this.revealGroup.add(arc);

    const vA = latLonToVec3(itemA.lat, itemA.lon, 1);
    const vB = latLonToVec3(itemB.lat, itemB.lon, 1);
    const mid = vA.add(vB);
    if (mid.lengthSq() > 0.001) {
      const midCoord = vec3ToLatLon(mid.normalize());
      const distKm = haversineKm(itemA.lat, itemA.lon, itemB.lat, itemB.lon);
      const zoomDist = clamp(5.4 + (distKm / 12000) * 1.9, 5.4, 7.3);
      this.flyBeliauTo(midCoord.lat, midCoord.lon);
      this.focusLatLon(midCoord.lat, midCoord.lon, zoomDist);
    } else {
      this.focusLatLon(itemA.lat, itemA.lon, 6.6);
    }
  }

  showConstellation(points) {
    this.clearRoundVisuals();
    if (!points || points.length === 0) return;

    const sum = new THREE.Vector3();
    points.forEach((p) => {
      const pin = this.createPinMarker(p.lat, p.lon, 0xf5cc6c, 1.1, true);
      this.revealGroup.add(pin);
      sum.add(latLonToVec3(p.lat, p.lon, 1));
    });

    for (let i = 0; i < points.length; i++) {
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      if (points.length > 1) {
        const arc = this.createGreatCircleArc(curr.lat, curr.lon, next.lat, next.lon, 0xf6d379, true);
        this.revealGroup.add(arc);
      }
    }

    if (sum.lengthSq() > 0.001) {
      const center = vec3ToLatLon(sum.normalize());
      this.flyBeliauTo(center.lat, center.lon);
      this.focusLatLon(center.lat, center.lon, 6.55);
    }
  }

  syncUnlockedPins(items) {
    disposeGroupChildren(this.unlockedGroup);
    this.unlockedPinMeshes = [];
    if (!items || !items.length) return;

    items.forEach((item) => {
      if (typeof item.lat !== 'number' || typeof item.lon !== 'number') return;
      const pos = latLonToVec3(item.lat, item.lon, EARTH_RADIUS + 0.042);
      const geo = new THREE.OctahedronGeometry(0.04, 0);
      const mat = new THREE.MeshBasicMaterial({ color: 0xf7d883 });
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(pos);
      star.userData = { unlockedItem: item };
      this.unlockedGroup.add(star);
      this.unlockedPinMeshes.push(star);

      const haloGeo = new THREE.RingGeometry(0.03, 0.052, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf7d883,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.52,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      const basePos = latLonToVec3(item.lat, item.lon, EARTH_RADIUS + 0.012);
      halo.position.copy(basePos);
      halo.quaternion.setFromUnitVectors(UP_VEC, basePos.clone().normalize());
      halo.rotateX(-Math.PI / 2);
      this.unlockedGroup.add(halo);
    });
  }

  focusLatLon(lat, lon, dist = null) {
    const deltaLon = shortestLonDelta(this.camLon, lon);
    this.targetLon = this.camLon + deltaLon;
    this.targetLat = clamp(lat - 13, -74, 74);
    if (dist !== null) {
      this.targetDist = clamp(dist, 4.15, 8.2);
    }
    this.velLat = 0;
    this.velLon = 0;
    this.lastInteractionAt = performance.now();
  }

  setRayFromClient(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    this.pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    return true;
  }

  raycastEarth(clientX, clientY) {
    if (!this.setRayFromClient(clientX, clientY)) return null;
    const hits = this.raycaster.intersectObject(this.earthMesh, false);
    if (!hits.length) return null;
    const pt = hits[0].point;
    const { lat, lon } = vec3ToLatLon(pt);
    return {
      lat,
      lon,
      point: pt,
      placeLabel: this.lookupPlaceLabel(lat, lon)
    };
  }

  raycastTravelers(clientX, clientY) {
    if (!this.setRayFromClient(clientX, clientY)) return null;
    const targets = [this.busHitMesh, this.beliauHitMesh].filter(Boolean);
    const hits = this.raycaster.intersectObjects(targets, false);
    if (!hits.length) return null;
    if (hits[0].object === this.busHitMesh) return 'bus';
    if (hits[0].object === this.beliauHitMesh) return 'beliau';
    return null;
  }

  raycastUnlockedPins(clientX, clientY) {
    if (!this.unlockedPinMeshes.length) return null;
    if (!this.setRayFromClient(clientX, clientY)) return null;
    const hits = this.raycaster.intersectObjects(this.unlockedPinMeshes, false);
    if (!hits.length) return null;
    return hits[0].object.userData.unlockedItem || null;
  }

  bindEvents() {
    this.canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      this.dragging = true;
      this.dragDist = 0;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.velLat = 0;
      this.velLon = 0;
      this.lastInteractionAt = performance.now();
      this.canvas.classList.add('is-dragging');
      try {
        this.canvas.setPointerCapture(e.pointerId);
      } catch {
        // Abaikan jika pointer capture tidak tersedia
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.dragDist += Math.hypot(dx, dy);

        const zoomScale = (this.camDist / 6.2) * 0.27;
        const dLon = -dx * zoomScale;
        const dLat = dy * zoomScale;
        this.targetLon += dLon;
        this.targetLat = clamp(this.targetLat + dLat, -76, 76);
        this.velLon = dLon * 0.55;
        this.velLat = dLat * 0.55;
        this.lastInteractionAt = performance.now();
        return;
      }

      const traveler = this.raycastTravelers(e.clientX, e.clientY);
      if (traveler) {
        this.canvas.style.cursor = 'pointer';
        if (this.hoverReticle) this.hoverReticle.visible = false;
        if (this.onHover) {
          this.onHover({
            specialLabel:
              traveler === 'bus'
                ? 'Bus Damri sedang melintasi langit bumi (klik untuk menyapa)'
                : 'Beliau bersama kawanan ikan julung-julung terbang'
          });
        }
        return;
      }

      const hit = this.raycastEarth(e.clientX, e.clientY);
      if (hit) {
        this.canvas.style.cursor = this.interactivePinMode ? 'crosshair' : 'grab';
        if (this.interactivePinMode && this.hoverReticle) {
          const normal = hit.point.clone().normalize();
          this.hoverReticle.position.copy(normal.clone().multiplyScalar(EARTH_RADIUS + 0.018));
          this.hoverReticle.quaternion.setFromUnitVectors(UP_VEC, normal);
          this.hoverReticle.rotateX(-Math.PI / 2);
          this.hoverReticle.visible = true;
        }
        if (this.onHover) this.onHover(hit);
      } else {
        this.canvas.style.cursor = 'default';
        if (this.hoverReticle) this.hoverReticle.visible = false;
        if (this.onHover) this.onHover(null);
      }
    });

    const endDrag = (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      this.canvas.classList.remove('is-dragging');
      try {
        this.canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Abaikan
      }

      if (this.dragDist < 7) {
        if (!this.interactivePinMode) {
          const traveler = this.raycastTravelers(e.clientX, e.clientY);
          if (traveler === 'bus' && this.onBusClick) {
            this.onBusClick(this.getBusLocation());
            return;
          }
          if (traveler === 'beliau' && this.onBeliauClick) {
            this.onBeliauClick();
            return;
          }

          const unlocked = this.raycastUnlockedPins(e.clientX, e.clientY);
          if (unlocked && this.onUnlockedPinClick) {
            this.onUnlockedPinClick(unlocked);
            return;
          }
        }
        const hit = this.raycastEarth(e.clientX, e.clientY);
        if (hit && this.onGlobeClick) {
          this.onGlobeClick(hit);
        }
      }
    };

    this.canvas.addEventListener('pointerup', endDrag);
    this.canvas.addEventListener('pointercancel', endDrag);
    this.canvas.addEventListener('pointerleave', () => {
      if (!this.dragging) {
        if (this.hoverReticle) this.hoverReticle.visible = false;
        if (this.onHover) this.onHover(null);
      }
    });

    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = Math.sign(e.deltaY) * 0.42;
        this.targetDist = clamp(this.targetDist + delta, 4.05, 8.2);
        this.lastInteractionAt = performance.now();
      },
      { passive: false }
    );

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  updateBeliauAndBus(dt, elapsed) {
    // 1. Luncurkan Beliau perlahan menuju negara tujuan
    const lerpB = 1 - Math.exp(-dt * 2.8);
    this.beliauLat += (this.targetBeliauLat - this.beliauLat) * lerpB;
    this.beliauLon += shortestLonDelta(this.beliauLon, this.targetBeliauLon) * lerpB;
    if (this.beliauLon > 180) this.beliauLon -= 360;
    if (this.beliauLon < -180) this.beliauLon += 360;

    const bob = Math.sin(elapsed * 1.9) * 0.028;
    const beliauPos = latLonToVec3(this.beliauLat, this.beliauLon, EARTH_RADIUS + 0.14 + bob);
    const beliauNormal = beliauPos.clone().normalize();
    this.beliauAnchor.position.copy(beliauPos);
    this.beliauAnchor.quaternion.setFromUnitVectors(UP_VEC, beliauNormal);
    this.beliauBody.rotation.y = elapsed * 0.45;

    // 2. Animasi kawanan ikan julung-julung terbang mengelilingi Beliau
    const encounterBoost = this.busEncounterTimer > 0 ? 1.45 : 1.0;
    for (let i = 0; i < this.beliauFlyingFish.length; i++) {
      const f = this.beliauFlyingFish[i];
      const ang = elapsed * f.speed * encounterBoost + f.phase;
      const r = f.radius * (this.busEncounterTimer > 0 ? 1.28 : 1.0);
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      const y = f.baseHeight + Math.sin(ang * 2.1 + f.phase) * 0.045 + Math.cos(ang) * f.tilt;
      f.group.position.set(x, y, z);

      // Arahkan hidung ikan julung-julung searah gerak orbitnya
      const nextAng = ang + 0.08;
      const nx = Math.cos(nextAng) * r;
      const nz = Math.sin(nextAng) * r;
      const ny = f.baseHeight + Math.sin(nextAng * 2.1 + f.phase) * 0.045 + Math.cos(nextAng) * f.tilt;
      f.group.lookAt(
        this.beliauAnchor.localToWorld(new THREE.Vector3(nx, ny, nz))
      );

      // Kepakan lembut sirip sayap dan ekor
      const flap = Math.sin(elapsed * 7.5 + f.phase) * 0.38;
      f.wingL.rotation.y = flap;
      f.wingR.rotation.y = -flap;
      f.tail.rotation.y = Math.sin(elapsed * 10 + f.phase) * 0.25;
    }

    // 3. Gerak Bus Damri 3D mengelilingi bumi (melambat manis saat berpapasan dengan Beliau)
    if (this.busEncounterCooldown > 0) this.busEncounterCooldown = Math.max(0, this.busEncounterCooldown - dt);
    if (this.busEncounterTimer > 0) this.busEncounterTimer = Math.max(0, this.busEncounterTimer - dt);

    let nextBusLat;
    let nextBusLon;

    if (this.busSummonTarget) {
      const dLat = this.busSummonTarget.lat - this.beliauLat;
      const tLat = this.busSummonTarget.lat;
      const tLon = this.busSummonTarget.lon;
      const step = 1 - Math.exp(-dt * 2.2);
      nextBusLat = this.busLat + (tLat - this.busLat) * step;
      nextBusLon = this.busLon + shortestLonDelta(this.busLon, tLon) * step;
      if (haversineKm(nextBusLat, nextBusLon, tLat, tLon) < 550 && Math.abs(dLat) < 30) {
        // Selaraskan fase orbit alami agar Bus Damri melanjutkan perjalanan dengan halus setelah berpapasan
        this.busOrbitAngle = Math.atan2(
          Math.sin((nextBusLat * Math.PI) / 180) / Math.sin(this.busOrbitInclination),
          Math.cos((nextBusLat * Math.PI) / 180)
        );
        const rawLon = (Math.atan2(Math.sin(this.busOrbitAngle) * Math.cos(this.busOrbitInclination), Math.cos(this.busOrbitAngle)) * 180) / Math.PI;
        this.busOrbitPrecession = nextBusLon - rawLon;
        this.busSummonTarget = null;
      }
    } else {
      const orbitSpeed = this.busEncounterTimer > 0 ? 0.045 : 0.16;
      this.busOrbitAngle += dt * orbitSpeed;
      this.busOrbitPrecession += dt * 1.4;
      const sinA = Math.sin(this.busOrbitAngle);
      const cosA = Math.cos(this.busOrbitAngle);
      const latRad = Math.asin(clamp(sinA * Math.sin(this.busOrbitInclination), -0.95, 0.95));
      const lonRad = Math.atan2(sinA * Math.cos(this.busOrbitInclination), cosA);
      nextBusLat = (latRad * 180) / Math.PI;
      nextBusLon = ((lonRad * 180) / Math.PI + this.busOrbitPrecession + 540) % 360 - 180;
    }

    const prevPos = latLonToVec3(this.busLat, this.busLon, EARTH_RADIUS + 0.2);
    this.busLat = nextBusLat;
    this.busLon = nextBusLon;

    const busPos = latLonToVec3(this.busLat, this.busLon, EARTH_RADIUS + 0.2 + Math.sin(elapsed * 2.5) * 0.015);
    const busUp = busPos.clone().normalize();
    const moveDir = busPos.clone().sub(prevPos);
    if (moveDir.lengthSq() > 0.000001) {
      const forward = moveDir.sub(busUp.clone().multiplyScalar(moveDir.dot(busUp))).normalize();
      const right = new THREE.Vector3().crossVectors(busUp, forward).normalize();
      this._basisMat.makeBasis(right, busUp, forward);
      this.busAnchor.quaternion.setFromRotationMatrix(this._basisMat);
    }
    this.busAnchor.position.copy(busPos);

    // Denyut debu bintang belakang Bus Damri
    for (let i = 0; i < this.busWakeDots.length; i++) {
      const s = 0.7 + Math.sin(elapsed * 5 + i * 1.3) * 0.3;
      this.busWakeDots[i].scale.set(s, s, s);
    }

    // 4. Deteksi Pertemuan di Langit antara Beliau dan Bus Damri
    const distBetween = haversineKm(this.beliauLat, this.beliauLon, this.busLat, this.busLon);
    if (distBetween < 2200 && this.busEncounterCooldown <= 0) {
      this.busEncounterTimer = 5.2;
      this.busEncounterCooldown = 26;
      if (this.onBusEncounter) {
        this.onBusEncounter({
          lat: this.busLat,
          lon: this.busLon,
          placeLabel: this.lookupPlaceLabel(this.busLat, this.busLon)
        });
      }
    }

    // Cincin cahaya pertemuan tipis dan elegan di sekitar Beliau
    if (this.encounterRing) {
      if (this.busEncounterTimer > 0) {
        const wave = (elapsed * 1.15) % 1;
        const sc = 1 + wave * 2.1;
        this.encounterRing.scale.set(sc, sc, 1);
        this.encounterRing.material.opacity = (1 - wave) * 0.48;
      } else {
        this.encounterRing.material.opacity = 0;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    if (!this.dragging) {
      if (Math.abs(this.velLon) > 0.002 || Math.abs(this.velLat) > 0.002) {
        this.targetLon += this.velLon;
        this.targetLat = clamp(this.targetLat + this.velLat, -76, 76);
        this.velLon *= 0.9;
        this.velLat *= 0.9;
      } else if (this.autoRotate && performance.now() - this.lastInteractionAt > 4200) {
        this.targetLon += dt * 2.6;
      }
    }

    const lerpFactor = 1 - Math.exp(-dt * 8.2);
    this.camLat += (this.targetLat - this.camLat) * lerpFactor;
    this.camLon += (this.targetLon - this.camLon) * lerpFactor;
    this.camDist += (this.targetDist - this.camDist) * lerpFactor;

    const camPos = latLonToVec3(this.camLat, this.camLon, this.camDist);
    this.camera.position.copy(camPos);
    this.camera.lookAt(0, 0, 0);

    const sunPos = latLonToVec3(clamp(this.camLat + 22, -75, 75), this.camLon + 34, 14);
    this.sunLight.position.copy(sunPos);

    if (this.cloudsMesh) this.cloudsMesh.rotation.y += dt * 0.011;
    if (this.stars) this.stars.rotation.y += dt * 0.0025;

    this.updateBeliauAndBus(dt, elapsed);

    for (let i = this.animatedArcs.length - 1; i >= 0; i--) {
      const item = this.animatedArcs[i];
      item.progress = Math.min(1, item.progress + dt * item.speed);
      const eased = 1 - Math.pow(1 - item.progress, 3);
      item.geo.setDrawRange(0, Math.floor(item.total * eased));
      if (item.progress >= 1) {
        this.animatedArcs.splice(i, 1);
      }
    }

    for (let i = 0; i < this.pulseRings.length; i++) {
      const p = this.pulseRings[i];
      const wave = (elapsed * 1.15 + p.phase) % 1;
      const s = p.baseScale * (1 + wave * 2.1);
      p.mesh.scale.set(s, s, 1);
      p.mesh.material.opacity = (1 - wave) * 0.65;
    }

    for (let i = 0; i < this.unlockedPinMeshes.length; i++) {
      this.unlockedPinMeshes[i].rotation.y = elapsed * 1.4 + i;
    }

    this.renderer.render(this.scene, this.camera);
    this.projectCountryLabels();
  }
}
