// An original cast of animal townsfolk for the long-form videos: chunky, big-headed, softly shaded (a light from the
// upper left and a rim shadow on the right give them a rounded, almost 3D look). 240 × 300 units, feet at the bottom.
// Same mood system as videos/five-stars/cast.mjs: each mood is its own face group (class m-<mood>) and the timeline
// only toggles opacity, so seeking is always exact. The `.talk` mouth flickers while a character speaks.
//   animal("hedgehog", "smile", { hat: true, apron: "#fff" })
//   critter("hedgehog", "smile", 260, "@pip", { hat: true })   // wrapped in a .who div, ready for mood()/talk()

let uid = 0;

// hedgehog spines: a zigzag crown around the top and sides of the head
const SPIKES = (() => {
  const pts = [];
  for (let i = 0; i <= 26; i++) {
    const a = Math.PI * (0.92 + (1.16 * i) / 26); // from lower left, over the top, to lower right
    const r = i % 2 ? 80 : 116;
    pts.push(`${(120 + Math.cos(a) * r * 1.08).toFixed(1)} ${(118 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
})();

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const lite = (c, t = 0.35) => mix(c, "#ffffff", t);
const dark = (c, t = 0.3) => mix(c, "#000000", t);

// fur: main color · belly/muzzle: lighter patch · ear: ear shape · extras drawn per species
export const SPECIES = {
  hedgehog: { fur: "#e8c39a", belly: "#f7e3c8", ear: "round", spikes: "#7a4b2a", muzzle: true, nose: "#3b2314" },
  raccoon: { fur: "#9aa3ad", belly: "#e5e7eb", ear: "point", mask: "#2b2f36", muzzle: true, nose: "#1f2329", tail: "ring" },
  rabbit: { fur: "#f3ece2", belly: "#ffffff", ear: "long", inner: "#f9a8c4", muzzle: true, nose: "#f472b6" },
  fox: { fur: "#f08a3c", belly: "#fff7ed", ear: "point", tip: "#3b2314", muzzle: true, nose: "#1f1300", tail: "bush" },
  bear: { fur: "#8a5a3b", belly: "#d6b08c", ear: "round", muzzle: true, nose: "#2a170c" },
  owl: { fur: "#8b6b4a", belly: "#e9d8bf", ear: "tuft", discs: "#f6ead6", beak: "#f59e0b" },
  turtle: { fur: "#7cba62", belly: "#e7f0c8", ear: "none", shell: "#8a5a2b", muzzle: false, nose: "#2f4a22" },
  beaver: { fur: "#9b6a43", belly: "#d9b48a", ear: "small", muzzle: true, nose: "#2a170c", teeth: true, tail: "flat" },
  cat: { fur: "#c9ced6", belly: "#f8fafc", ear: "point", inner: "#f9a8c4", muzzle: true, nose: "#f472b6", whiskers: true, tail: "thin" },
  mouse: { fur: "#b8b2ad", belly: "#ece7e2", ear: "big", inner: "#f9a8c4", muzzle: true, nose: "#f472b6", whiskers: true, tail: "thin" },
  dog: { fur: "#d9a066", belly: "#fbe7cf", ear: "flop", muzzle: true, nose: "#2a170c", tail: "thin" },
  squirrel: { fur: "#c2703d", belly: "#f7dcc0", ear: "point", muzzle: true, nose: "#2a170c", tail: "curl" },
};

// Face sits around (120,118). Moods: smile neutral sad shock grin stare sleep wink
const EYES = {
  dot: `<ellipse cx="94" cy="112" rx="9" ry="11" fill="#14100c"/><ellipse cx="146" cy="112" rx="9" ry="11" fill="#14100c"/><circle cx="97" cy="107" r="3.4" fill="#fff"/><circle cx="149" cy="107" r="3.4" fill="#fff"/>`,
  wide: `<circle cx="94" cy="110" r="16" fill="#fff" stroke="#14100c" stroke-width="3"/><circle cx="146" cy="110" r="16" fill="#fff" stroke="#14100c" stroke-width="3"/><circle cx="94" cy="112" r="7" fill="#14100c"/><circle cx="146" cy="112" r="7" fill="#14100c"/>`,
  closed: `<path d="M84 114q10 9 20 0M136 114q10 9 20 0" stroke="#14100c" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  happy: `<path d="M84 116q10 -12 20 0M136 116q10 -12 20 0" stroke="#14100c" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  wink: `<ellipse cx="94" cy="112" rx="9" ry="11" fill="#14100c"/><circle cx="97" cy="107" r="3.4" fill="#fff"/><path d="M136 116q10 -12 20 0" stroke="#14100c" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};
const BROWS = {
  flat: `<path d="M84 92h20M136 92h20" stroke="#14100c" stroke-width="4.5" stroke-linecap="round" opacity=".75"/>`,
  sad: `<path d="M84 96l20 -8M156 96l-20 -8" stroke="#14100c" stroke-width="4.5" stroke-linecap="round" opacity=".8"/>`,
  up: `<path d="M84 86q10-8 20 0M136 86q10-8 20 0" stroke="#14100c" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".8"/>`,
  mad: `<path d="M84 90l20 6M156 90l-20 6" stroke="#14100c" stroke-width="5" stroke-linecap="round"/>`,
};
const MOUTH = {
  smile: `<path d="M106 146q14 13 28 0" stroke="#14100c" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  neutral: `<path d="M110 150h20" stroke="#14100c" stroke-width="4.5" stroke-linecap="round"/>`,
  frown: `<path d="M107 156q13-11 26 0" stroke="#14100c" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  o: `<ellipse cx="120" cy="153" rx="8" ry="10" fill="#4a1414"/>`,
  grin: `<path d="M100 143q20 30 40 0z" fill="#4a1414" stroke="#14100c" stroke-width="3.5" stroke-linejoin="round"/><path d="M110 156q10 6 20 0" fill="#f87171"/>`,
};
const MOODS = {
  smile: ["dot", "flat", "smile"], neutral: ["dot", "flat", "neutral"], sad: ["dot", "sad", "frown"], shock: ["wide", "up", "o"],
  grin: ["happy", "up", "grin"], stare: ["wide", "up", "neutral"], sleep: ["closed", "flat", "smile"], wink: ["wink", "up", "grin"], mad: ["dot", "mad", "frown"],
};
export const ANIMAL_MOODS = Object.keys(MOODS);

const ears = (s, g) => {
  const f = `url(#${g}f)`, inner = s.inner ?? dark(s.fur, 0.18);
  switch (s.ear) {
    case "round": return `<circle cx="58" cy="56" r="24" fill="${f}"/><circle cx="182" cy="56" r="24" fill="${f}"/><circle cx="58" cy="56" r="12" fill="${inner}"/><circle cx="182" cy="56" r="12" fill="${inner}"/>`;
    case "small": return `<circle cx="62" cy="62" r="16" fill="${f}"/><circle cx="178" cy="62" r="16" fill="${f}"/>`;
    case "big": return `<circle cx="48" cy="58" r="40" fill="${f}"/><circle cx="192" cy="58" r="40" fill="${f}"/><circle cx="50" cy="60" r="26" fill="${inner}"/><circle cx="190" cy="60" r="26" fill="${inner}"/>`;
    case "point": return `<path d="M48 82L62 8l48 46z" fill="${f}"/><path d="M192 82L178 8l-48 46z" fill="${f}"/><path d="M62 64l8-38 24 26z" fill="${inner}"/><path d="M178 64l-8-38-24 26z" fill="${inner}"/>${s.tip ? `<path d="M56 30l6-22 14 14z" fill="${s.tip}"/><path d="M184 30l-6-22-14 14z" fill="${s.tip}"/>` : ""}`;
    case "long": return `<g><ellipse cx="88" cy="-6" rx="20" ry="62" fill="${f}" transform="rotate(-8 88 40)"/><ellipse cx="88" cy="-2" rx="10" ry="46" fill="${inner}" transform="rotate(-8 88 40)"/></g><g><ellipse cx="152" cy="-6" rx="20" ry="62" fill="${f}" transform="rotate(10 152 40)"/><ellipse cx="152" cy="-2" rx="10" ry="46" fill="${inner}" transform="rotate(10 152 40)"/></g>`;
    case "tuft": return `<path d="M50 60L46 14l40 28z" fill="${dark(s.fur, 0.15)}"/><path d="M190 60l4-46-40 28z" fill="${dark(s.fur, 0.15)}"/>`;
    case "flop": return `<ellipse cx="46" cy="96" rx="22" ry="44" fill="${dark(s.fur, 0.3)}" transform="rotate(18 46 96)"/><ellipse cx="194" cy="96" rx="22" ry="44" fill="${dark(s.fur, 0.3)}" transform="rotate(-18 194 96)"/>`;
    default: return "";
  }
};

const tail = (s, g) => {
  const d = dark(s.fur, 0.2);
  switch (s.tail) {
    case "ring": return `<g class="tail"><path d="M168 262q66 -10 58 -86" stroke="${s.fur}" stroke-width="30" fill="none" stroke-linecap="round"/>${[0, 1, 2].map((i) => `<path d="M${186 + i * 12} ${254 - i * 26}l22 -14" stroke="${s.mask}" stroke-width="12" stroke-linecap="round"/>`).join("")}</g>`;
    case "bush": return `<g class="tail"><path d="M162 270q90 -6 66 -110q-30 30 -40 60z" fill="url(#${g}f)"/><path d="M228 160q-20 10 -26 30l18 6z" fill="${s.belly}"/></g>`;
    case "curl": return `<g class="tail"><path d="M160 268q100 0 76 -110q-20 -50 -60 -20q30 0 30 40q0 50 -46 60z" fill="url(#${g}f)"/></g>`;
    case "flat": return `<g class="tail"><ellipse cx="200" cy="276" rx="44" ry="18" fill="#5b3a22" transform="rotate(-18 200 276)"/></g>`;
    case "thin": return `<g class="tail"><path d="M164 268q60 6 54 -50" stroke="${d}" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
    default: return "";
  }
};

/** One animal as an SVG string. Opts: hat (baker toque), apron (color), scarf (color), glasses, phone (in the right paw), bag. */
export function animal(kind, mood = "smile", o = {}) {
  const s = SPECIES[kind];
  const g = `an${++uid}`;
  const k = (m) => (m === mood ? 1 : 0);
  const faces = ANIMAL_MOODS.map((m) => {
    const [e, b, mo] = MOODS[m];
    return `<g class="m-${m}" opacity="${k(m)}">${s.discs ? "" : BROWS[b]}<g class="eyes">${EYES[e]}</g>${s.beak ? "" : MOUTH[mo]}</g>`;
  }).join("");
  return `<svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${g}f" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="${lite(s.fur, 0.32)}"/><stop offset=".55" stop-color="${s.fur}"/><stop offset="1" stop-color="${dark(s.fur, 0.28)}"/></radialGradient>
    <radialGradient id="${g}b" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${lite(s.belly, 0.4)}"/><stop offset="1" stop-color="${dark(s.belly, 0.1)}"/></radialGradient>
    ${s.shell ? `<radialGradient id="${g}s" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${lite(s.shell, 0.3)}"/><stop offset="1" stop-color="${dark(s.shell, 0.35)}"/></radialGradient>` : ""}
  </defs>
  <ellipse cx="120" cy="292" rx="78" ry="9" fill="#000" opacity=".28"/>
  ${tail(s, g)}
  ${s.shell ? `<ellipse cx="120" cy="226" rx="78" ry="66" fill="url(#${g}s)"/><path d="M70 200l50 -24 50 24 -10 50h-80z" fill="none" stroke="${dark(s.shell, 0.4)}" stroke-width="5" opacity=".6"/>` : ""}
  <ellipse cx="90" cy="284" rx="26" ry="13" fill="${dark(s.fur, 0.25)}"/><ellipse cx="150" cy="284" rx="26" ry="13" fill="${dark(s.fur, 0.25)}"/>
  <g class="body"><ellipse cx="120" cy="226" rx="62" ry="60" fill="url(#${g}f)"/><ellipse cx="120" cy="238" rx="40" ry="42" fill="url(#${g}b)"/>
  ${o.apron ? `<path d="M80 206h80v62q-40 18 -80 0z" fill="${o.apron}"/><path d="M84 206q36 -26 72 0" stroke="${o.apron}" stroke-width="5" fill="none"/><rect x="104" y="226" width="32" height="20" rx="5" fill="${dark(o.apron, 0.1)}"/>` : ""}
  ${o.scarf ? `<path d="M70 178q50 26 100 0l-4 20q-46 22 -92 0z" fill="${o.scarf}"/><path d="M150 190l12 44-18 2z" fill="${dark(o.scarf, 0.15)}"/>` : ""}</g>
  <g class="armL"><ellipse cx="62" cy="232" rx="17" ry="30" fill="url(#${g}f)" transform="rotate(16 62 232)"/></g>
  <g class="armR"><ellipse cx="178" cy="232" rx="17" ry="30" fill="url(#${g}f)" transform="rotate(-16 178 232)"/>${o.phone ? `<g transform="translate(176 196) rotate(-12)"><rect width="34" height="58" rx="7" fill="#0f172a" stroke="#cbd5e1" stroke-width="2.5"/><rect x="4" y="6" width="26" height="44" rx="3" fill="#60a5fa"/></g>` : ""}${o.bag ? `<g transform="translate(168 236)"><path d="M6 14h44l-6 50h-32z" fill="#d6b48a"/><path d="M16 14q12-20 24 0" stroke="#a16207" stroke-width="4" fill="none"/><text x="28" y="48" font-size="22" text-anchor="middle">🥐</text></g>` : ""}</g>
  <g class="head">
    ${s.spikes ? `<path d="${SPIKES}" fill="${s.spikes}" stroke="${dark(s.spikes, 0.3)}" stroke-width="3" stroke-linejoin="round"/>` : ""}
    ${ears(s, g)}
    <ellipse cx="120" cy="112" rx="${s.spikes ? 70 : 80}" ry="${s.spikes ? 66 : 74}" fill="url(#${g}f)"/>
    ${s.mask ? `<path d="M52 112q8 -30 68 -18q60 -12 68 18q-8 22 -34 22q-22 0 -34 -14q-12 14 -34 14q-26 0 -34 -22z" fill="${s.mask}"/>` : ""}
    ${s.discs ? `<circle cx="94" cy="110" r="30" fill="${s.discs}"/><circle cx="146" cy="110" r="30" fill="${s.discs}"/>` : ""}
    ${s.muzzle ? `<ellipse cx="120" cy="142" rx="38" ry="28" fill="url(#${g}b)"/>` : ""}
    ${s.nose ? `<ellipse cx="120" cy="${s.muzzle ? 130 : 128}" rx="11" ry="8" fill="${s.nose}"/><ellipse cx="117" cy="127" rx="3.5" ry="2.2" fill="#fff" opacity=".6"/>` : ""}
    ${s.beak ? `<path d="M110 128l10 22 10 -22z" fill="${s.beak}"/>` : ""}
    ${s.teeth ? `<rect x="111" y="156" width="18" height="16" rx="3" fill="#fff" stroke="#14100c" stroke-width="2"/><path d="M120 156v16" stroke="#14100c" stroke-width="2"/>` : ""}
    ${s.whiskers ? `<path d="M82 140h-34M84 150l-32 8M158 140h34M156 150l32 8" stroke="#475569" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>` : ""}
    <circle cx="76" cy="134" r="11" fill="#fb7185" opacity=".28"/><circle cx="164" cy="134" r="11" fill="#fb7185" opacity=".28"/>
    <g class="face">${faces}${s.beak ? "" : `<ellipse class="talk" cx="120" cy="152" rx="11" ry="8" fill="#4a1414" opacity="0"/>`}</g>
    ${o.glasses ? `<g fill="none" stroke="#14100c" stroke-width="4"><circle cx="94" cy="112" r="20"/><circle cx="146" cy="112" r="20"/><path d="M114 112h12"/></g>` : ""}
    ${o.hat ? `<g class="hat"><rect x="74" y="42" width="92" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/><path d="M78 46q-26 -30 4 -46q12 -26 38 -10q26 -16 38 10q30 16 4 46z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/></g>` : ""}
    ${o.cap ? `<path d="M56 64q64 -60 128 0z" fill="${o.cap}"/><path d="M150 60q40 0 54 14l-50 0z" fill="${dark(o.cap, 0.2)}"/>` : ""}
  </g>
</svg>`;
}

/** Wrapped in the .who div the shared helpers (mood, talk) look for. */
export const critter = (kind, mood = "smile", w = 220, elId = "", o = {}) =>
  `<div class="who" ${elId ? `id="${elId}"` : ""} style="width:${w}px;height:${w * 1.25}px">${animal(kind, mood, o)}</div>`;
