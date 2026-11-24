// Potret SVG ekspresif seluruh tokoh RPG Warkop Impact (termasuk Hero & Ciko sang pendamping melayang).

export const CAST = {
  hero: {
    name: 'Petualang',
    role: 'Orator Api',
    skin: '#E0AC84',
    shirt: '#E64A19',
    accent: '#FFD166',
    hair: '#241B17',
    prop: 'scarf'
  },
  hero_orator: {
    name: 'Orator Api',
    role: 'Panggung & Kelincahan',
    skin: '#E0AC84',
    shirt: '#E64A19',
    accent: '#FFD166',
    hair: '#241B17',
    prop: 'scarf'
  },
  hero_pujangga: {
    name: 'Pujangga Senja',
    role: 'Diksi & Bahasa',
    skin: '#E4B38E',
    shirt: '#7A2E4B',
    accent: '#F5C451',
    hair: '#2B1F22',
    prop: 'hero_beret'
  },
  hero_detektif: {
    name: 'Detektif Logika',
    role: 'Fakta & Anti-Hoaks',
    skin: '#D69E72',
    shirt: '#6B4E31',
    accent: '#48DBFB',
    hair: '#1E1B18',
    prop: 'hero_fedora'
  },
  hero_alkemis: {
    name: 'Alkemis Angka',
    role: 'Segel Matematika',
    skin: '#DDA67D',
    shirt: '#1E6B5C',
    accent: '#FFD166',
    hair: '#231D1A',
    prop: 'hero_goggles'
  },
  ciko: {
    name: 'Ciko',
    role: 'Roh Kopi Pendamping',
    skin: '#FBF6EC',
    shirt: '#4A2C1D',
    accent: '#FFD166',
    hair: '#3B2114',
    prop: 'spirit'
  },
  jaja: {
    name: 'Bang Jaja',
    role: 'Kepala Desa Warkop',
    skin: '#D79B6E',
    shirt: '#D94E28',
    accent: '#F5C451',
    hair: '#231A16',
    prop: 'peci'
  },
  deden: {
    name: 'Kang Deden',
    role: 'Penjaga Pos Ronda',
    skin: '#C98A5C',
    shirt: '#2E5A4C',
    accent: '#F0B429',
    hair: '#1E1B18',
    prop: 'beanie'
  },
  budi: {
    name: 'Pak Budi',
    role: 'Ketua Grup WA Desa',
    skin: '#D69E72',
    shirt: '#3A4F7A',
    accent: '#E8A838',
    hair: '#5A5550',
    prop: 'glasses'
  },
  rina: {
    name: 'Teh Rina',
    role: 'Pustakawan Agung',
    skin: '#E0AC84',
    shirt: '#6B2D3E',
    accent: '#F2C97D',
    hair: '#2C2122',
    prop: 'bun'
  },
  siska: {
    name: 'Mbak Siska',
    role: 'Utusan Guild Startup',
    skin: '#E4B38E',
    shirt: '#1E3A5F',
    accent: '#FF7849',
    hair: '#2B1D17',
    prop: 'headset'
  },
  fikri: {
    name: 'Mas Fikri',
    role: 'Filsuf Es Teh',
    skin: '#CC9166',
    shirt: '#4A3728',
    accent: '#E07A5F',
    hair: '#201815',
    prop: 'beret'
  },
  hakim: {
    name: 'Hakim Nalar',
    role: 'Penjaga Benteng Argumen',
    skin: '#CFA07A',
    shirt: '#2F3640',
    accent: '#E5B85C',
    hair: '#7A736E',
    prop: 'crown_law'
  },
  maestro: {
    name: 'Maestro Lidah Emas',
    role: 'Penjaga Puncak Amfiteater',
    skin: '#D9A074',
    shirt: '#3E1F47',
    accent: '#FFD166',
    hair: '#1C1621',
    prop: 'maestro_hat'
  },
  sora: {
    name: 'Sora-ssi',
    role: 'Mentor Bahasa Korea (Hangul)',
    skin: '#F0C7A8',
    shirt: '#D85C7B',
    accent: '#FFD166',
    hair: '#241B1E',
    prop: 'hanbok_ribbon'
  },
  kenji: {
    name: 'Kenji-san',
    role: 'Mentor Jepang & Idiom Global',
    skin: '#EBC09D',
    shirt: '#234E70',
    accent: '#F5C451',
    hair: '#1C1F26',
    prop: 'headband'
  },
  vega: {
    name: 'Komandan Vega',
    role: 'Analis SOC AI · Radar /berita-terkini',
    skin: '#D8A27A',
    shirt: '#133B5C',
    accent: '#48DBFB',
    hair: '#18222F',
    prop: 'cyber_visor'
  },
  bima: {
    name: 'Insinyur Bima',
    role: 'Penjaga Gardu IIV / SCADA',
    skin: '#C88D60',
    shirt: '#B45309',
    accent: '#FDE047',
    hair: '#1F1B18',
    prop: 'hardhat'
  },
  openmic: {
    name: 'Panggung Stand-Up',
    role: 'Open-Mic Kedai 1894',
    skin: '#D79B6E',
    shirt: '#8C3B2B',
    accent: '#FFD166',
    hair: '#231A16',
    prop: 'maestro_hat'
  },
  tower_keeper: {
    name: 'Menara Kronik Abadi',
    role: 'Portal Tanpa Batas (∞)',
    skin: '#CFA07A',
    shirt: '#2E3A59',
    accent: '#48DBFB',
    hair: '#5A5550',
    prop: 'crown_law'
  }
};

export function renderCharacterSVG(key, mood = 'idle') {
  const c = CAST[key] || CAST.jaja;

  if (key === 'ciko') {
    const face =
      mood === 'shock'
        ? `<circle cx="48" cy="58" r="5" fill="#1B1714"/><circle cx="72" cy="58" r="5" fill="#1B1714"/><ellipse cx="60" cy="70" rx="5" ry="6" fill="#E64A19"/>`
        : mood === 'happy'
        ? `<path d="M43 58 Q48 52 53 58" stroke="#1B1714" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M67 58 Q72 52 77 58" stroke="#1B1714" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M51 67 Q60 76 69 67" stroke="#1B1714" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
        : `<circle cx="48" cy="58" r="3.6" fill="#1B1714"/><circle cx="72" cy="58" r="3.6" fill="#1B1714"/><circle cx="49.5" cy="56.5" r="1.2" fill="#FFF"/><circle cx="73.5" cy="56.5" r="1.2" fill="#FFF"/><path d="M53 68 Q60 73 67 68" stroke="#1B1714" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;

    return `
      <svg class="char-svg mood-${mood}" viewBox="0 0 120 120" role="img" aria-label="Ciko Roh Kopi">
        <rect x="4" y="4" width="112" height="112" rx="22" fill="#1B212C" stroke="#FFD166" stroke-width="2"/>
        <ellipse cx="60" cy="30" rx="24" ry="7" fill="none" stroke="#FFD166" stroke-width="2.6"/>
        <path d="M46 24 Q42 14 50 9" stroke="#FFF4D6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M68 23 Q74 14 66 8" stroke="#FFF4D6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M32 42 L88 42 L82 90 C81 97, 39 97, 38 90 Z" fill="#FBF6EC" stroke="#3B2114" stroke-width="2.5"/>
        <path d="M86 50 C102 50, 102 74, 83 74" fill="none" stroke="#FBF6EC" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="60" cy="42" rx="27" ry="6" fill="#5A331E"/>
        <circle cx="40" cy="66" r="4.5" fill="#F48466" opacity="0.5"/>
        <circle cx="80" cy="66" r="4.5" fill="#F48466" opacity="0.5"/>
        ${face}
      </svg>
    `;
  }

  const eyes = {
    idle: `
      <circle cx="48" cy="54" r="3.4" fill="#1B1714"/>
      <circle cx="72" cy="54" r="3.4" fill="#1B1714"/>
      <circle cx="49.2" cy="52.8" r="1.1" fill="#FFF"/>
      <circle cx="73.2" cy="52.8" r="1.1" fill="#FFF"/>
      <path d="M41 46 Q48 43 54 46" stroke="#1B1714" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M66 46 Q72 43 79 46" stroke="#1B1714" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `,
    happy: `
      <path d="M43 54 Q48 48 53 54" stroke="#1B1714" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M67 54 Q72 48 77 54" stroke="#1B1714" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M41 44 Q48 40 54 44" stroke="#1B1714" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M66 44 Q72 40 79 44" stroke="#1B1714" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `,
    shock: `
      <circle cx="48" cy="54" r="6" fill="#FFF" stroke="#1B1714" stroke-width="2.2"/>
      <circle cx="72" cy="54" r="6" fill="#FFF" stroke="#1B1714" stroke-width="2.2"/>
      <circle cx="48" cy="54" r="2.2" fill="#1B1714"/>
      <circle cx="72" cy="54" r="2.2" fill="#1B1714"/>
      <path d="M40 42 Q48 37 55 43" stroke="#1B1714" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M65 43 Q72 37 80 42" stroke="#1B1714" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `,
    smug: `
      <path d="M42 54 L54 53" stroke="#1B1714" stroke-width="3" stroke-linecap="round"/>
      <circle cx="48" cy="55.5" r="2.2" fill="#1B1714"/>
      <path d="M66 53 L78 54" stroke="#1B1714" stroke-width="3" stroke-linecap="round"/>
      <circle cx="72" cy="55.5" r="2.2" fill="#1B1714"/>
      <path d="M41 47 L54 45" stroke="#1B1714" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M66 44 Q73 40 80 45" stroke="#1B1714" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    `
  }[mood] || '';

  const mouth = {
    idle: `<path d="M52 68 Q60 73 68 68" stroke="#1B1714" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M48 66 Q60 79 72 66 Z" fill="#1B1714"/><path d="M53 72 Q60 76 67 72" fill="#E86A58"/>`,
    shock: `<ellipse cx="60" cy="70" rx="6.5" ry="8" fill="#1B1714"/><ellipse cx="60" cy="74" rx="3.5" ry="2.2" fill="#E86A58"/>`,
    smug: `<path d="M51 69 Q62 72 71 65" stroke="#1B1714" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
  }[mood] || '';

  let accessory = '';
  if (c.prop === 'scarf') {
    accessory = `
      <path d="M33 44 C34 18, 86 18, 87 44 C78 33, 42 33, 33 44 Z" fill="${c.hair}"/>
      <path d="M36 90 Q60 98 84 90 L80 104 Q60 110 40 104 Z" fill="#FFD166"/>
    `;
  } else if (c.prop === 'hero_beret') {
    accessory = `
      <path d="M30 40 C28 19, 82 14, 92 36 C78 35, 42 36, 30 40 Z" fill="#4A172B"/>
      <path d="M58 20 L62 13" stroke="#F5C451" stroke-width="3" stroke-linecap="round"/>
      <circle cx="48" cy="54" r="7.5" fill="none" stroke="#F5C451" stroke-width="2.2"/>
      <circle cx="72" cy="54" r="7.5" fill="none" stroke="#F5C451" stroke-width="2.2"/>
      <line x1="55.5" y1="54" x2="64.5" y2="54" stroke="#F5C451" stroke-width="2.2"/>
    `;
  } else if (c.prop === 'hero_fedora') {
    accessory = `
      <ellipse cx="60" cy="36" rx="33" ry="6" fill="#3D2B1B"/>
      <path d="M38 36 L43 17 Q60 13 77 17 L82 36 Z" fill="#4D3623"/>
      <rect x="40" y="30" width="40" height="4.5" fill="#48DBFB"/>
      <path d="M38 90 Q60 97 82 90 L78 103 Q60 108 42 103 Z" fill="#48DBFB"/>
    `;
  } else if (c.prop === 'hero_goggles') {
    accessory = `
      <path d="M33 44 C34 18, 86 18, 87 44 C78 33, 42 33, 33 44 Z" fill="${c.hair}"/>
      <rect x="36" y="30" width="48" height="7" rx="3.5" fill="#2A2420"/>
      <circle cx="48" cy="34" r="8" fill="#48DBFB" stroke="#FFD166" stroke-width="2.6"/>
      <circle cx="72" cy="34" r="8" fill="#48DBFB" stroke="#FFD166" stroke-width="2.6"/>
      <line x1="56" y1="34" x2="64" y2="34" stroke="#FFD166" stroke-width="2.6"/>
    `;
  } else if (c.prop === 'peci') {
    accessory = `
      <path d="M35 37 C36 22, 84 22, 85 37 Z" fill="#1B1714"/>
      <rect x="35" y="34" width="50" height="4" rx="1.5" fill="${c.accent}"/>
      <path d="M47 64 Q60 61 73 64" stroke="#231A16" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    `;
  } else if (c.prop === 'beanie') {
    accessory = `
      <path d="M34 40 C34 18, 86 18, 86 40 Z" fill="#D94E28"/>
      <rect x="32" y="34" width="56" height="8" rx="4" fill="#B63A19"/>
      <circle cx="60" cy="18" r="5" fill="#F5C451"/>
    `;
  } else if (c.prop === 'glasses') {
    accessory = `
      <path d="M37 40 C39 24, 81 24, 83 40 C78 33, 42 33, 37 40 Z" fill="${c.hair}"/>
      <rect x="39" y="48" width="18" height="12" rx="4" fill="none" stroke="#1B1714" stroke-width="2.5"/>
      <rect x="63" y="48" width="18" height="12" rx="4" fill="none" stroke="#1B1714" stroke-width="2.5"/>
      <line x1="57" y1="53" x2="63" y2="53" stroke="#1B1714" stroke-width="2.5"/>
      <path d="M51 64 Q60 62 69 64" stroke="#5A5550" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    `;
  } else if (c.prop === 'bun') {
    accessory = `
      <circle cx="60" cy="20" r="11" fill="${c.hair}"/>
      <path d="M34 44 C35 23, 85 23, 86 44 C77 35, 43 35, 34 44 Z" fill="${c.hair}"/>
      <line x1="48" y1="15" x2="74" y2="23" stroke="${c.accent}" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="48" cy="54" r="8" fill="none" stroke="#1B1714" stroke-width="2"/>
      <circle cx="72" cy="54" r="8" fill="none" stroke="#1B1714" stroke-width="2"/>
      <line x1="56" y1="54" x2="64" y2="54" stroke="#1B1714" stroke-width="2"/>
    `;
  } else if (c.prop === 'headset') {
    accessory = `
      <path d="M33 48 C34 22, 86 22, 87 48 C80 35, 40 35, 33 48 Z" fill="${c.hair}"/>
      <path d="M31 53 C31 24, 89 24, 89 53" fill="none" stroke="${c.accent}" stroke-width="4" stroke-linecap="round"/>
      <rect x="27" y="47" width="8" height="15" rx="4" fill="#1B1714"/>
      <rect x="85" y="47" width="8" height="15" rx="4" fill="#1B1714"/>
    `;
  } else if (c.prop === 'beret') {
    accessory = `
      <path d="M32 39 C30 22, 80 16, 90 35 C76 35, 42 36, 32 39 Z" fill="#1F2421"/>
      <path d="M58 21 L62 15" stroke="#1F2421" stroke-width="3" stroke-linecap="round"/>
    `;
  } else if (c.prop === 'crown_law') {
    accessory = `
      <path d="M36 40 C38 24, 82 24, 84 40 Z" fill="${c.hair}"/>
      <path d="M40 35 L46 22 L60 30 L74 22 L80 35 Z" fill="${c.accent}" stroke="#1B1714" stroke-width="2"/>
    `;
  } else if (c.prop === 'maestro_hat') {
    accessory = `
      <ellipse cx="60" cy="36" rx="34" ry="6" fill="#2A1433"/>
      <rect x="40" y="14" width="40" height="22" rx="6" fill="#2A1433"/>
      <rect x="40" y="29" width="40" height="5" fill="#FFD166"/>
      <circle cx="60" cy="23" r="4" fill="#FFD166"/>
    `;
  } else if (c.prop === 'hanbok_ribbon') {
    accessory = `
      <path d="M32 48 C34 20, 86 20, 88 48 C79 34, 41 34, 32 48 Z" fill="${c.hair}"/>
      <circle cx="80" cy="32" r="7" fill="#FFD166"/>
      <path d="M44 92 L60 100 L76 92" fill="none" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round"/>
    `;
  } else if (c.prop === 'headband') {
    accessory = `
      <path d="M34 42 C36 21, 84 21, 86 42 Z" fill="${c.hair}"/>
      <rect x="35" y="34" width="50" height="6" rx="2" fill="#FBF6EC"/>
      <circle cx="60" cy="37" r="3" fill="#E64A19"/>
    `;
  } else if (c.prop === 'cyber_visor') {
    accessory = `
      <path d="M34 42 C36 20, 84 20, 86 42 Z" fill="${c.hair}"/>
      <rect x="36" y="47" width="48" height="14" rx="7" fill="rgba(72, 219, 251, 0.35)" stroke="#48DBFB" stroke-width="2.5"/>
      <line x1="42" y1="54" x2="78" y2="54" stroke="#48DBFB" stroke-width="2" stroke-dasharray="5 3"/>
    `;
  } else if (c.prop === 'hardhat') {
    accessory = `
      <path d="M32 39 C34 17, 86 17, 88 39 Z" fill="#FACC15" stroke="#1B1714" stroke-width="2.2"/>
      <rect x="28" y="36" width="64" height="6" rx="3" fill="#EAB308" stroke="#1B1714" stroke-width="2"/>
      <rect x="55" y="21" width="10" height="12" rx="2" fill="#FFF"/>
    `;
  }

  return `
    <svg class="char-svg mood-${mood}" viewBox="0 0 120 120" role="img" aria-label="${c.name}">
      <rect x="4" y="4" width="112" height="112" rx="22" fill="#221D1A" stroke="#473C33" stroke-width="2"/>
      <circle cx="60" cy="64" r="44" fill="${c.accent}" opacity="0.14"/>
      <path d="M24 114 C27 88, 93 88, 96 114 Z" fill="${c.shirt}"/>
      <rect x="52" y="76" width="16" height="16" rx="6" fill="${c.skin}"/>
      <circle cx="34" cy="57" r="6" fill="${c.skin}"/>
      <circle cx="86" cy="57" r="6" fill="${c.skin}"/>
      <rect x="35" y="30" width="50" height="54" rx="24" fill="${c.skin}"/>
      <circle cx="42" cy="62" r="4" fill="#E87A64" opacity="0.35"/>
      <circle cx="78" cy="62" r="4" fill="#E87A64" opacity="0.35"/>
      ${eyes}
      <path d="M58 58 Q60 62 62 58" stroke="#A66D46" stroke-width="2" fill="none" stroke-linecap="round"/>
      ${mouth}
      ${accessory}
    </svg>
  `;
}
