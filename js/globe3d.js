// Mesin Bola Bumi 3D Interaktif (Three.js r160) untuk Atlas Bumi 3D.
// Presisi pemetaan UV SphereGeometry, raycast tancap pin, lengkung jarak 3D, duel dua titik, dan rasi benang merah.

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

// Konversi tepat yang selaras 1:1 dengan UV Three.js SphereGeometry dan earth_atlas.png
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
    this.onGlobeClick = options.onGlobeClick || null;
    this.onHover = options.onHover || null;
    this.onUnlockedPinClick = options.onUnlockedPinClick || null;

    this.countriesMeta = [];
    this.interactivePinMode = true;
    this.autoRotate = true;

    // Kamera dalam koordinat geografi langsung agar nol gimbal-lock
    this.camLat = 12;
    this.camLon = 108; // Membuka tepat di Asia Tenggara / Nusantara
    this.camDist = 6.35;
    this.targetLat = 12;
    this.targetLon = 108;
    this.targetDist = 6.35;

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

    // Pencahayaan hangat mengikuti sudut kamera agar belahan yang ditatap selalu jelas
    this.ambientLight = new THREE.AmbientLight(0xd7e6ff, 0.92);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xaad2ff, 0x1e2c44, 0.42);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff5e4, 1.38);
    this.sunLight.position.set(8, 6, 9);
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0x52a6ff, 0.52);
    this.rimLight.position.set(-10, -4, -8);
    this.scene.add(this.rimLight);

    this.buildStarfield();
    this.buildEarth();

    // Grup pin & lengkungan aktif
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
      opacity: 0.85,
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

    // Lapisan awan tipis berotasi pelan
    const cloudsTex = loader.load('assets/earth_clouds.png');
    cloudsTex.colorSpace = THREE.SRGBColorSpace;
    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS + 0.028, 56, 40);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.36,
      roughness: 0.95,
      metalness: 0.0,
      depthWrite: false
    });
    this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    this.scene.add(this.cloudsMesh);

    // Halo atmosfer Fresnel bercahaya lembut di tepi bola bumi
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

      // Khusus Prancis agar wilayah daratan Eropa tidak tergeser oleh Guyana Prancis
      if (c.name === 'France' && lon < -8 && lat > 12) continue;

      const area = Math.max(1, Math.min(spanLon, 180) * (maxLat - minLat));
      const d = haversineKm(lat, lon, c.lat, c.lon);
      // Gabungkan luas kotak pembatas + jarak sentroid agar negara kecil di dalam bbox negara besar tetap terbaca
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

  // Membuat pin 3D vertikal mengikuti normal permukaan bola bumi
  createPinMarker(lat, lon, colorHex = 0xe85a4f, scale = 1.0, addPulse = true) {
    const group = new THREE.Group();
    const pos = latLonToVec3(lat, lon, EARTH_RADIUS);
    const normal = pos.clone().normalize();
    group.position.copy(pos);
    group.quaternion.setFromUnitVectors(UP_VEC, normal);

    // Batang jarum kuningan
    const stemGeo = new THREE.CylinderGeometry(0.014 * scale, 0.005 * scale, 0.19 * scale, 10);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xe7c985,
      roughness: 0.28,
      metalness: 0.78
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.095 * scale, 0);
    group.add(stem);

    // Kepala pin bercahaya
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

    // Cincin alas di permukaan bumi
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

  // Membuat lengkung cahaya 3D melengkung di atas permukaan bumi (Great-Circle Arc)
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

    this.focusLatLon(trueLat, trueLon, 5.5);
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

    // Fokuskan kamera ke titik tengah vektor antara lokasi A dan lokasi B
    const vA = latLonToVec3(itemA.lat, itemA.lon, 1);
    const vB = latLonToVec3(itemB.lat, itemB.lon, 1);
    const mid = vA.add(vB);
    if (mid.lengthSq() > 0.001) {
      const midCoord = vec3ToLatLon(mid.normalize());
      const distKm = haversineKm(itemA.lat, itemA.lon, itemB.lat, itemB.lon);
      const zoomDist = clamp(5.4 + (distKm / 12000) * 1.9, 5.4, 7.3);
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
      this.focusLatLon(center.lat, center.lon, 6.55);
    }
  }

  // Bintang penanda permanen di permukaan bumi untuk semua fakta yang telah terbuka
  syncUnlockedPins(items) {
    disposeGroupChildren(this.unlockedGroup);
    this.unlockedPinMeshes = [];
    if (!items || !items.length) return;

    items.forEach((item) => {
      if (typeof item.lat !== 'number' || typeof item.lon !== 'number') return;
      const pos = latLonToVec3(item.lat, item.lon, EARTH_RADIUS + 0.042);
      const geo = new THREE.OctahedronGeometry(0.042, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xf7d883
      });
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(pos);
      star.userData = { unlockedItem: item };
      this.unlockedGroup.add(star);
      this.unlockedPinMeshes.push(star);

      // Titik cahaya kecil di kaki bintang
      const haloGeo = new THREE.RingGeometry(0.032, 0.056, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xf7d883,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
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
    const deltaLon = (((lon - this.camLon) % 360) + 540) % 360 - 180;
    this.targetLon = this.camLon + deltaLon;
    // Geser -7 derajat lintang agar pin tampil lega di atas kartu ronde bawah
    this.targetLat = clamp(lat - 7, -74, 74);
    if (dist !== null) {
      this.targetDist = clamp(dist, 4.15, 8.2);
    }
    this.velLat = 0;
    this.velLon = 0;
    this.lastInteractionAt = performance.now();
  }

  raycastEarth(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    this.pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);

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

  raycastUnlockedPins(clientX, clientY) {
    if (!this.unlockedPinMeshes.length) return null;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    this.pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);

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
        // Abaikan jika capture tidak didukung
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (this.dragging) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.dragDist += Math.hypot(dx, dy);

        const zoomScale = (this.camDist / 6.3) * 0.27;
        const dLon = -dx * zoomScale;
        const dLat = dy * zoomScale;
        this.targetLon += dLon;
        this.targetLat = clamp(this.targetLat + dLat, -76, 76);
        this.velLon = dLon * 0.55;
        this.velLat = dLat * 0.55;
        this.lastInteractionAt = performance.now();
        return;
      }

      // Hover readout di permukaan bumi
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

      // Ketukan bersih (bukan geser putar)
      if (this.dragDist < 7) {
        if (!this.interactivePinMode) {
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
        this.targetDist = clamp(this.targetDist + delta, 4.15, 8.3);
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

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    // Inersia lembut setelah drag dilepas
    if (!this.dragging) {
      if (Math.abs(this.velLon) > 0.002 || Math.abs(this.velLat) > 0.002) {
        this.targetLon += this.velLon;
        this.targetLat = clamp(this.targetLat + this.velLat, -76, 76);
        this.velLon *= 0.9;
        this.velLat *= 0.9;
      } else if (this.autoRotate && performance.now() - this.lastInteractionAt > 3600) {
        this.targetLon += dt * 3.8;
      }
    }

    // Interpolasi kamera halus
    const lerpFactor = 1 - Math.exp(-dt * 8.5);
    this.camLat += (this.targetLat - this.camLat) * lerpFactor;
    this.camLon += (this.targetLon - this.camLon) * lerpFactor;
    this.camDist += (this.targetDist - this.camDist) * lerpFactor;

    const camPos = latLonToVec3(this.camLat, this.camLon, this.camDist);
    this.camera.position.copy(camPos);
    this.camera.lookAt(0, 0, 0);

    // Arahkan cahaya matahari sedikit ke kanan-atas kamera agar seluruh negara selalu cerah namun tetap berdimensi
    const sunPos = latLonToVec3(clamp(this.camLat + 22, -75, 75), this.camLon + 34, 14);
    this.sunLight.position.copy(sunPos);

    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y += dt * 0.012;
    }

    if (this.stars) {
      this.stars.rotation.y += dt * 0.003;
    }

    // Animasi tumbuh garis lengkung cahaya 3D
    for (let i = this.animatedArcs.length - 1; i >= 0; i--) {
      const item = this.animatedArcs[i];
      item.progress = Math.min(1, item.progress + dt * item.speed);
      const eased = 1 - Math.pow(1 - item.progress, 3);
      item.geo.setDrawRange(0, Math.floor(item.total * eased));
      if (item.progress >= 1) {
        this.animatedArcs.splice(i, 1);
      }
    }

    // Denyut cincin pin
    for (let i = 0; i < this.pulseRings.length; i++) {
      const p = this.pulseRings[i];
      const wave = ((elapsed * 1.15 + p.phase) % 1);
      const s = p.baseScale * (1 + wave * 2.1);
      p.mesh.scale.set(s, s, 1);
      p.mesh.material.opacity = (1 - wave) * 0.65;
    }

    // Putar pelan bintang landmark yang sudah terbuka
    for (let i = 0; i < this.unlockedPinMeshes.length; i++) {
      this.unlockedPinMeshes[i].rotation.y = elapsed * 1.4 + i;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
