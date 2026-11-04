// Characters for FIVE STARS: flat vector people (240 × 540 units, feet at the bottom) with swappable moods.
// Each mood is its own face group; the timeline only toggles their opacity, so seeking is always exact.
import { cardFront } from "../../src/lib/card-faces.ts";

export const W = 240;
export const H = 540;

const P = {
  dale: { skin: "#f2c7a0", shirt: "#2f6fd6", pants: "#374151", hair: "dale", apron: true },
  okafor: { skin: "#7a4a2a", shirt: "#7c3aed", pants: "#7c3aed", hair: "hat", dress: true, pearls: true },
  juno: { skin: "#c68642", shirt: "#16a34a", pants: "#1f2937", hair: "beanie", hood: true },
  gary: { skin: "#e8b88a", shirt: "#f59e0b", pants: "#78716c", hair: "part" },
  banker: { skin: "#d9a066", shirt: "#475569", pants: "#334155", hair: "gray", tie: "#dc2626", glasses: true },
  frank: { skin: "#f0c08a", shirt: "#9ca3af", pants: "#4b5563", hair: "curly" },
  mayor: { skin: "#e3a87c", shirt: "#111827", pants: "#111827", hair: "white", sash: true },
  agent: { skin: "#d1a17a", shirt: "#0b0b0f", pants: "#0b0b0f", hair: "buzz", tie: "#0b0b0f", shades: true },
  extra1: { skin: "#f5d0b0", shirt: "#ec4899", pants: "#1e3a8a", hair: "bob", hairColor: "#92400e" },
  extra2: { skin: "#8d5524", shirt: "#0ea5e9", pants: "#374151", hair: "buzz" },
  extra3: { skin: "#e0ac69", shirt: "#a855f7", pants: "#1f2937", hair: "bun", hairColor: "#1f2937" },
  extra4: { skin: "#c68642", shirt: "#ef4444", pants: "#57534e", hair: "curly", hairColor: "#111827" },
  extra5: { skin: "#f1c27d", shirt: "#78716c", pants: "#44403c", hair: "bald" },
  extra6: { skin: "#ffdbac", shirt: "#14b8a6", pants: "#334155", hair: "bob", hairColor: "#facc15" },
  extra7: { skin: "#a0662f", shirt: "#f97316", pants: "#1f2937", hair: "part", hairColor: "#111827" },
};

const hairSvg = (h, c) => {
  switch (h) {
    case "dale": return `<path d="M50 140c-6-30 2-56 16-66M190 140c6-30-2-56-16-66" stroke="#6b4423" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M98 196q22 8 44 0" stroke="#6b4423" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    case "hat": return `<ellipse cx="120" cy="86" rx="118" ry="22" fill="#5b21b6"/><path d="M62 86c0-52 116-52 116 0z" fill="#6d28d9"/><rect x="62" y="70" width="116" height="12" fill="#f472b6"/><circle cx="160" cy="68" r="14" fill="#f9a8d4"/><circle cx="160" cy="68" r="6" fill="#fde047"/>`;
    case "beanie": return `<path d="M46 124c0-70 148-70 148 0z" fill="#f97316"/><rect x="44" y="112" width="152" height="22" rx="10" fill="#ea580c"/><circle cx="120" cy="54" r="12" fill="#fdba74"/>`;
    case "part": return `<path d="M48 128c-4-58 40-82 80-80 44 2 70 30 64 80-14-30-50-44-96-38z" fill="${c || "#1c1917"}"/>`;
    case "gray": return `<path d="M50 132c-6-56 36-80 72-80s76 24 68 80c-10-26-40-40-72-40s-58 14-68 40z" fill="#9ca3af"/>`;
    case "curly": return `${[60, 86, 112, 138, 164, 180, 54].map((x, i) => `<circle cx="${x}" cy="${i > 4 ? 110 : 74}" r="26" fill="${c || "#3f2a1d"}"/>`).join("")}`;
    case "white": return `<path d="M50 130c-4-50 30-76 70-76s76 26 70 76c-6-34-36-50-70-50s-62 16-70 50z" fill="#f5f5f4"/>`;
    case "bob": return `<path d="M44 170c-10-90 26-118 76-118s86 28 76 118l-20 0c4-40-6-70-56-72-50 2-60 32-56 72z" fill="${c}"/>`;
    case "bun": return `<circle cx="120" cy="52" r="26" fill="${c}"/><path d="M50 128c-4-54 36-76 70-76s74 22 70 76c-12-28-40-42-70-42s-58 14-70 42z" fill="${c}"/>`;
    case "buzz": return `<path d="M52 122c0-50 32-70 68-70s68 20 68 70c-14-20-38-30-68-30s-54 10-68 30z" fill="#27272a"/>`;
    default: return "";
  }
};

// Faces sit around head center (120,140). Moods: smile neutral sad shock grin stare sleep.
const EYES = {
  dot: `<ellipse cx="96" cy="136" rx="7" ry="9" fill="#111"/><ellipse cx="144" cy="136" rx="7" ry="9" fill="#111"/>`,
  wide: `<circle cx="96" cy="134" r="15" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="144" cy="134" r="15" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="96" cy="134" r="5" fill="#111"/><circle cx="144" cy="134" r="5" fill="#111"/>`,
  closed: `<path d="M86 138q10 8 20 0M134 138q10 8 20 0" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>`,
};
const BROWS = {
  flat: `<path d="M84 114h24M132 114h24" stroke="#111" stroke-width="5" stroke-linecap="round"/>`,
  sad: `<path d="M84 110l24 8M156 110l-24 8" stroke="#111" stroke-width="5" stroke-linecap="round"/>`,
  up: `<path d="M84 104q12-8 24 0M132 104q12-8 24 0" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};
const MOUTH = {
  smile: `<path d="M98 172q22 20 44 0" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  neutral: `<path d="M102 178h36" stroke="#111" stroke-width="5" stroke-linecap="round"/>`,
  frown: `<path d="M100 186q20-16 40 0" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  o: `<ellipse cx="120" cy="180" rx="11" ry="14" fill="#3b0a0a"/>`,
  grin: `<path d="M78 164q42 48 84 0z" fill="#fff" stroke="#111" stroke-width="4" stroke-linejoin="round"/><path d="M78 164q42 10 84 0M92 166v14M106 168v18M120 168v20M134 168v18M148 166v14" stroke="#111" stroke-width="2.5" fill="none"/>`,
};
const MOODS = {
  smile: ["dot", "flat", "smile"], neutral: ["dot", "flat", "neutral"], sad: ["dot", "sad", "frown"],
  shock: ["wide", "up", "o"], grin: ["dot", "up", "grin"], stare: ["wide", "up", "grin"], sleep: ["closed", "flat", "grin"],
};
export const MOOD_NAMES = Object.keys(MOODS);

/** One character as an SVG string. Mood groups carry class m-<mood>; only `mood` starts visible. */
export function person(id, mood = "smile", opts = {}) {
  const p = P[id];
  const k = (cls) => (cls === mood ? 1 : 0);
  const faces = MOOD_NAMES.map((m) => {
    const [e, b, mo] = MOODS[m];
    return `<g class="m-${m}" opacity="${k(m)}"><g class="eyes">${EYES[e]}</g>${BROWS[b]}${MOUTH[mo]}</g>`;
  }).join("");
  const shirt = opts.waiter ? "#f8fafc" : p.shirt;
  const legs = p.dress
    ? `<path d="M64 300h112l26 210H38z" fill="${p.shirt}"/><rect x="84" y="500" width="26" height="30" fill="${p.skin}"/><rect x="130" y="500" width="26" height="30" fill="${p.skin}"/>`
    : `<rect x="80" y="380" width="34" height="140" rx="14" fill="${p.pants}"/><rect x="126" y="380" width="34" height="140" rx="14" fill="${p.pants}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${p.hood ? `<path d="M30 160c0-110 180-110 180 0v70H30z" fill="#15803d"/>` : ""}
  ${legs}
  <ellipse cx="96" cy="530" rx="30" ry="12" fill="#111827"/><ellipse cx="144" cy="530" rx="30" ry="12" fill="#111827"/>
  <g class="armL"><rect x="26" y="232" width="34" height="150" rx="17" fill="${shirt}"/><circle cx="43" cy="388" r="18" fill="${p.skin}"/></g>
  <g class="armR"><rect x="180" y="232" width="34" height="150" rx="17" fill="${shirt}"/><circle cx="197" cy="388" r="18" fill="${p.skin}"/>${opts.xray ? `<g transform="translate(160 300)"><rect width="110" height="130" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M14 ${24 + i * 20}q41 14 82 0" stroke="#e2e8f0" stroke-width="4" fill="none"/>`).join("")}<path d="M55 16v100" stroke="#e2e8f0" stroke-width="5"/></g>` : ""}</g>
  <rect x="104" y="196" width="32" height="40" fill="${p.skin}"/>
  <rect x="56" y="222" width="128" height="${p.dress ? 110 : 180}" rx="44" fill="${shirt}"/>
  ${opts.waiter ? `<path d="M64 240h40v140H70zM176 240h-40v140h34z" fill="#111827"/><path d="M106 232l14 10 14-10v18l-14-8-14 8z" fill="#111827"/>` : ""}
  ${p.apron ? `<path d="M80 290h80v118H80z" fill="#f8fafc"/><path d="M80 290q40 -30 80 0" stroke="#f8fafc" stroke-width="6" fill="none"/><rect x="104" y="320" width="32" height="24" rx="4" fill="#e2e8f0"/>` : ""}
  ${p.tie && !opts.waiter ? `<path d="M112 230h16l-4 18 8 70-12 14-12-14 8-70z" fill="${p.tie}"/><path d="M94 226l26 30 26-30" stroke="#e5e7eb" stroke-width="6" fill="none"/>` : ""}
  ${p.sash ? `<path d="M64 240l112 120v24L64 264z" fill="#dc2626"/><text x="104" y="306" transform="rotate(46 104 306)" font-family="Inter" font-weight="800" font-size="16" fill="#fde047">MAYOR</text>` : ""}
  ${p.pearls ? [92, 106, 120, 134, 148].map((x, i) => `<circle cx="${x}" cy="${232 + Math.abs(i - 2) * -4 + 6}" r="6" fill="#fff"/>`).join("") : ""}
  <g class="head">
    <circle cx="48" cy="146" r="16" fill="${p.skin}"/><circle cx="192" cy="146" r="16" fill="${p.skin}"/>
    <circle cx="120" cy="140" r="74" fill="${p.skin}"/>
    ${hairSvg(p.hair, p.hairColor)}
    <g class="face">${faces}<ellipse class="talk" cx="120" cy="180" rx="15" ry="10" fill="#3b0a0a" opacity="0"/></g>
    ${p.glasses ? `<g fill="none" stroke="#111" stroke-width="4"><circle cx="96" cy="136" r="18"/><circle cx="144" cy="136" r="18"/><path d="M114 136h12"/></g>` : ""}
    ${p.shades ? `<path d="M74 124h92v18q-4 14-22 14t-24-14h-0q-6 14-24 14t-22-14z" fill="#0b0b0f"/>` : ""}
    <circle cx="88" cy="164" r="9" fill="#f87171" opacity=".25"/><circle cx="152" cy="164" r="9" fill="#f87171" opacity=".25"/>
  </g>
</svg>`;
}

export const dog = () => `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
  <g class="tail"><path d="M238 110q50-40 40-80" stroke="#c08a4a" stroke-width="18" fill="none" stroke-linecap="round"/></g>
  <ellipse cx="160" cy="130" rx="90" ry="50" fill="#d9a066"/>
  <rect x="90" y="150" width="22" height="64" rx="10" fill="#c08a4a"/><rect x="130" y="156" width="22" height="58" rx="10" fill="#c08a4a"/>
  <rect x="190" y="156" width="22" height="58" rx="10" fill="#c08a4a"/><rect x="222" y="150" width="22" height="64" rx="10" fill="#c08a4a"/>
  <g class="head"><ellipse cx="78" cy="88" rx="56" ry="50" fill="#d9a066"/><ellipse cx="40" cy="70" rx="20" ry="40" fill="#8b5a2b" transform="rotate(20 40 70)"/>
  <ellipse cx="116" cy="70" rx="20" ry="40" fill="#8b5a2b" transform="rotate(-20 116 70)"/><circle cx="62" cy="82" r="7" fill="#111"/><circle cx="96" cy="82" r="7" fill="#111"/>
  <ellipse cx="78" cy="110" rx="16" ry="11" fill="#3b2314"/><path d="M78 120q0 16 -12 18" stroke="#3b2314" stroke-width="4" fill="none"/><path d="M80 128q8 16 18 4" fill="#f472b6"/></g>
</svg>`;

/** The tap card, used as a set prop (the easter egg on the diner counter). */
export const tapCard = () => cardFront().replace(/ class="rc-star" style="animation-delay:[^"]*"/g, "");
