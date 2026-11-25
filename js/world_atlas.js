// Loader ensiklopedia 195 negara berdaulat PBB (193 anggota + Vatikan & Palestina) untuk Semua Bumi.
// Setiap negara memuat bendera SVG lokal, koordinat label 3D, hasil bumi (SDA), buku, film, karya/sains, dan fakta unik.

export const WORLD_COUNTRIES = [];

let loadPromise = null;

export async function loadWorldCountries() {
  if (WORLD_COUNTRIES.length > 0) return WORLD_COUNTRIES;
  if (!loadPromise) {
    loadPromise = fetch('./assets/countries_195.json')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data 195 negara');
        return res.json();
      })
      .then((list) => {
        WORLD_COUNTRIES.length = 0;
        list.forEach((item) => WORLD_COUNTRIES.push(item));
        return WORLD_COUNTRIES;
      });
  }
  return loadPromise;
}

export function getCountryById(id) {
  return WORLD_COUNTRIES.find((c) => c.id === id) || null;
}

export function getCountryByCode(code) {
  const low = String(code || '').toLowerCase();
  return WORLD_COUNTRIES.find((c) => c.code === low) || null;
}

export function findNearestCountry(lat, lon, maxDeg = 12) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < WORLD_COUNTRIES.length; i++) {
    const c = WORLD_COUNTRIES[i];
    const dLat = c.lat - lat;
    let dLon = Math.abs(c.lon - lon);
    if (dLon > 180) dLon = 360 - dLon;
    const d = Math.hypot(dLat, dLon * Math.cos((lat * Math.PI) / 180));
    if (d < bestDist && d <= maxDeg) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}
