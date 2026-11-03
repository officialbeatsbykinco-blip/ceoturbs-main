// SVG artwork for both sides of the review card, drawn to the real card's proportions
// (54 × 85.5 mm → 540 × 855). Shared by the live 3D card on the site and by
// scripts/review-card-assets.mjs, which rasterises it for share and feed images.

export const CARD_W = 540;
export const CARD_H = 855;

const FONT = "'Space Grotesk Variable','Helvetica Neue',Helvetica,Arial,sans-serif";
const STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** Google "G", 48 × 48 units. */
const G = `<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>`;

const g = (x: number, y: number, size: number) => `<g transform="translate(${x} ${y}) scale(${size / 48})">${G}</g>`;

/** Phone-in-hand NFC mark with signal arcs. */
const nfc = (cx: number, y: number, ink: string) => `<g transform="translate(${cx - 36} ${y})" fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">
  <text x="44" y="15" font-family="${FONT}" font-weight="700" font-size="17" fill="${ink}" stroke="none">NFC</text>
  <path d="M30 4a14 14 0 0 1 0 16M24 8a8 8 0 0 1 0 8" stroke-width="3" transform="rotate(-35 20 12)"/>
  <rect x="22" y="24" width="30" height="50" rx="5" stroke-width="4"/>
  <path d="M33 30h8" stroke-width="3"/>
  <path d="M22 50c-7 2-10 8-9 14l3 10h18" stroke-width="4"/>
</g>`;

const stars = (y: number, size: number, gap: number) =>
  Array.from({ length: 5 }, (_, i) => {
    const x = CARD_W / 2 - (5 * size + 4 * gap) / 2 + i * (size + gap);
    return `<path class="rc-star" style="animation-delay:${(i * 0.12).toFixed(2)}s" fill="#F6C02B" transform="translate(${x} ${y}) scale(${size / 24})" d="${STAR}"/>`;
  }).join("");

const wrap = (inner: string, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" role="img" aria-label="${title}"><title>${title}</title>${inner}</svg>`;

/** White matte front: "Review Us On Google". */
export const cardFront = () =>
  wrap(
    `<rect width="${CARD_W}" height="${CARD_H}" rx="44" fill="#fbfbf9"/>
<text x="270" y="150" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="50" fill="#202124">Review Us On</text>
<text x="270" y="245" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="92" letter-spacing="-2" fill="#202124">Google</text>
${g(115, 300, 310)}
${nfc(270, 640, "#202124")}
${stars(742, 58, 10)}`,
    "Front of the review card: Review Us On Google, NFC tap",
  );

/** Black NFC back with the G in a white ring. */
export const cardBack = () =>
  wrap(
    `<rect width="${CARD_W}" height="${CARD_H}" rx="44" fill="#08080a"/>
<rect x="20" y="20" width="${CARD_W - 40}" height="${CARD_H - 40}" rx="28" fill="none" stroke="#f2f2f2" stroke-width="5"/>
<circle cx="270" cy="370" r="170" fill="#fff"/>
${g(150, 250, 240)}
${nfc(270, 618, "#ffffff")}
${stars(732, 58, 10)}`,
    "Back of the review card: black NFC side with the Google G",
  );
