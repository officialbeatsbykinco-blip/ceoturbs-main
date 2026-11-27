const sharp = require("sharp");
const out = __dirname + "/";
const F = "Helvetica Neue, Helvetica, Arial, sans-serif";

const bg = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0e2350"/><stop offset="1" stop-color="#050c1d"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.55" r="0.5">
      <stop offset="0" stop-color="#2f7bff" stop-opacity="0.45"/><stop offset="1" stop-color="#2f7bff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#g)"/>
  <rect width="1080" height="1080" fill="url(#glow)"/>`;

const pill = (y, text, w = 640) => `
  <rect x="${540 - w / 2}" y="${y}" width="${w}" height="104" rx="52" fill="#ff6a13"/>
  <text x="540" y="${y + 70}" font-family="${F}" font-size="50" font-weight="800" fill="#fff" text-anchor="middle">${text}</text>`;

const footer = `<text x="540" y="1030" font-family="${F}" font-size="36" font-weight="600" fill="#b9c6e4" text-anchor="middle">Tampa Bay · Orlando · We come to you</text>`;

// Laptop with a blue screen
const laptop = (cx, cy, s = 1) => `
  <g transform="translate(${cx} ${cy}) scale(${s})">
    <rect x="-250" y="-170" width="500" height="320" rx="22" fill="#1b2233" stroke="#3a4560" stroke-width="6"/>
    <rect x="-226" y="-146" width="452" height="272" rx="8" fill="#1663d6"/>
    <text x="-190" y="-50" font-family="${F}" font-size="110" font-weight="300" fill="#fff">:(</text>
    <rect x="-190" y="0" width="300" height="16" rx="8" fill="#ffffff" opacity="0.85"/>
    <rect x="-190" y="34" width="220" height="16" rx="8" fill="#ffffff" opacity="0.6"/>
    <rect x="-190" y="68" width="260" height="16" rx="8" fill="#ffffff" opacity="0.6"/>
    <path d="M-300 150 H300 L270 190 H-270 Z" fill="#2a3349" stroke="#3a4560" stroke-width="6"/>
    <circle cx="210" cy="-110" r="60" fill="#ff3b3b" opacity="0"/>
  </g>`;

// Wrench + check badge
const fixedBadge = (cx, cy) => `
  <g transform="translate(${cx} ${cy})">
    <circle r="78" fill="#19c37d" stroke="#0e2350" stroke-width="10"/>
    <path d="M-34 2 L-10 28 L38 -24" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const ads = {
  // Problem-first: the most common panic search
  "ad-wont-turn-on": `
    ${bg}
    <text x="540" y="150" font-family="${F}" font-size="92" font-weight="800" fill="#fff" text-anchor="middle">Blue screen?</text>
    <text x="540" y="250" font-family="${F}" font-size="92" font-weight="800" fill="#fff" text-anchor="middle">Won't start?</text>
    ${laptop(540, 520, 1)}
    ${fixedBadge(770, 380)}
    ${pill(790, "No fix, no repair bill", 760)}
    ${footer}`,
  // Convenience-first
  "ad-at-your-door": `
    ${bg}
    <text x="540" y="150" font-family="${F}" font-size="88" font-weight="800" fill="#fff" text-anchor="middle">PC repair</text>
    <text x="540" y="250" font-family="${F}" font-size="88" font-weight="800" fill="#ff8a3d" text-anchor="middle">at your door</text>
    <g font-family="${F}" font-size="54" font-weight="700" fill="#fff">
      ${["Slow computer", "Viruses &amp; pop-ups", "Blue screen", "Won't start"].map((t, i) => `
        <circle cx="250" cy="${385 + i * 100}" r="30" fill="#19c37d"/>
        <path d="M236 ${385 + i * 100} l10 11 l20 -22" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="305" y="${404 + i * 100}">${t}</text>`).join("")}
    </g>
    ${pill(790, "No fix, no repair bill", 760)}
    ${footer}`,
};

(async () => {
  for (const [name, body] of Object.entries(ads)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">${body}</svg>`;
    await sharp(Buffer.from(svg)).png().toFile(out + name + ".png");
    console.log("wrote", name);
  }
})();
