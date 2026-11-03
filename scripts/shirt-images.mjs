// Builds the custom company shirt and artist merch product photos (site, Shopify listing, Merchant
// Center) and the share images from the same shirt artwork the live designer uses (src/content/shirt-art.json).
// Run with: node scripts/shirt-images.mjs
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const ART = JSON.parse(await readFile(path.resolve("src/content/shirt-art.json"), "utf8"));
const OUT = path.resolve("public/img/shirts");
const OG = path.resolve("public/og");
await mkdir(OUT, { recursive: true });

const COLORS = { black: ["#141518", true], white: ["#f7f7f5", false], navy: ["#1f2a44", true], heather: ["#a9acb1", false], maroon: ["#5b1f2a", true], forest: ["#25392c", true] };
const MERCH = path.resolve("public/img/merch");
await mkdir(MERCH, { recursive: true });
const FONT = "Inter, DejaVu Sans, sans-serif";
let n = 0;

/** A sample logo: round badge with a peak and a bolt (clearly a placeholder brand). */
const badge = (cx, cy, r, ink, accent) => `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ink}" stroke-width="${r * 0.08}"/>
    <path d="M${cx - r * 0.62} ${cy + r * 0.32} L${cx - r * 0.18} ${cy - r * 0.38} L${cx + r * 0.06} ${cy - r * 0.02} L${cx + r * 0.26} ${cy - r * 0.26} L${cx + r * 0.62} ${cy + r * 0.32} Z" fill="${accent}"/>
    <path d="M${cx + r * 0.02} ${cy - r * 0.62} L${cx - r * 0.16} ${cy - r * 0.1} L${cx + r * 0.02} ${cy - r * 0.1} L${cx - r * 0.1} ${cy + r * 0.3}" fill="none" stroke="${ink}" stroke-width="${r * 0.07}" stroke-linejoin="round"/>
  </g>`;

const text = (x, y, size, ink, s, weight = 800, spacing = 0) => `<text x="${x}" y="${y}" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${ink}" text-anchor="middle" letter-spacing="${spacing}">${s}</text>`;

/** Sample album cover: a sunset square with a horizon (clearly placeholder art). */
let cv = 0;
const cover = (x, y, s) => {
  const id = `cv${cv++}`;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff3d6e"/><stop offset="0.55" stop-color="#ff9a3c"/><stop offset="1" stop-color="#2a1b5c"/></linearGradient></defs>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="url(#${id})"/>
    <circle cx="${x + s / 2}" cy="${y + s * 0.58}" r="${s * 0.24}" fill="#ffe8a3"/>
    <rect x="${x}" y="${y + s * 0.62}" width="${s}" height="${s * 0.38}" fill="#1d1340"/>
    ${[0.68, 0.75, 0.82, 0.89].map((k, i) => `<rect x="${x + s * (0.2 + i * 0.04)}" y="${y + s * k}" width="${s * (0.6 - i * 0.08)}" height="${s * 0.018}" fill="#ffe8a3" fill-opacity="${0.7 - i * 0.15}"/>`).join("")}`;
};

/** The design inside a print area (front/back/chest coordinates from shirt-art.json). */
function design(kind, area, ink, accent, words) {
  const { x, y, w, h } = area;
  const cx = x + w / 2;
  if (kind === "merch") return text(cx, y + w * 0.17, w * 0.17, ink, words[0], 900, 3) + cover(x + w * 0.1, y + w * 0.24, w * 0.8) + text(cx, y + w * 1.18, w * 0.07, ink, words[1], 700, 3);
  if (kind === "tour")
    return (
      text(cx, y + h * 0.1, w * 0.13, ink, words[0], 900, 2) +
      text(cx, y + h * 0.17, w * 0.06, ink, words[1], 600, 3) +
      ["03.14 ATLANTA", "03.16 CHARLOTTE", "03.18 NASHVILLE", "03.20 MEMPHIS", "03.22 HOUSTON", "03.24 DALLAS", "03.27 DENVER", "03.30 LOS ANGELES"].map((d, i) => text(cx, y + h * (0.27 + i * 0.07), w * 0.06, ink, d, 600, 1)).join("")
    );
  if (kind === "chest") return badge(cx, y + h * 0.42, w * 0.36, ink, accent) + text(cx, y + h * 0.98, w * 0.15, ink, words[0], 800, 0.5);
  if (kind === "back") return text(cx, y + h * 0.2, w * 0.3, ink, words[0], 900, 4) + text(cx, y + h * 0.31, w * 0.075, ink, words[1], 600);
  return badge(cx, y + w * 0.32, w * 0.3, ink, accent) + text(cx, y + w * 0.82, w * 0.15, ink, words[0], 900, 1) + text(cx, y + w * 0.93, w * 0.065, ink, words[1], 600, 2);
}

/** One shirt as an SVG group, scaled into a box. */
function shirt({ style = "short", color = "black", side = "front", kind = "front", words = ["YOUR LOGO", "YOURCOMPANY.COM"], accent = "#ff7a1a" }, tx, ty, scale) {
  const [hex, dark] = COLORS[color];
  const ink = dark ? "#ffffff" : "#15171c";
  const id = `s${n++}`;
  const body = style === "long" ? ART.long : ART.short;
  const area = ART.areas[side === "back" ? "back" : kind === "chest" ? "chest" : "front"];
  const shade = dark ? 0.35 : 0.14;
  return `
  <g transform="translate(${tx} ${ty}) scale(${scale})">
    <defs>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${dark ? 0.1 : 0.35}"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${shade}"/></linearGradient>
      <radialGradient id="${id}v" cx="0.5" cy="0.45" r="0.6"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${shade * 0.8}"/></radialGradient>
      <clipPath id="${id}c"><path d="${body}"/></clipPath>
      <filter id="${id}b"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="${id}d" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feOffset dy="18"/><feComponentTransfer><feFuncA type="linear" slope="0.28"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g filter="url(#${id}d)"><path d="${body}" fill="${hex}" stroke="#000" stroke-opacity="${dark ? 0.5 : 0.18}" stroke-width="2"/></g>
    <g clip-path="url(#${id}c)">
      ${ART.folds.map((d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${dark ? 0.35 : 0.08}" stroke-width="10" stroke-linecap="round" filter="url(#${id}b)"/>`).join("")}
      <rect width="600" height="640" fill="url(#${id}l)"/><rect width="600" height="640" fill="url(#${id}v)"/>
    </g>
    ${side === "front" ? `<path d="${ART.collarFront}" fill="${hex}" stroke="#000" stroke-opacity="${dark ? 0.55 : 0.22}" stroke-width="2"/><path d="${ART.neckFront}" fill="#000" fill-opacity="${dark ? 0.45 : 0.18}"/>` : `<path d="${ART.collarBack}" fill="${hex}" stroke="#000" stroke-opacity="${dark ? 0.55 : 0.22}" stroke-width="2"/>`}
    <path d="M146 598 C240 611 360 611 454 598" fill="none" stroke="#000" stroke-opacity="${dark ? 0.5 : 0.2}" stroke-width="1.5" stroke-dasharray="5 4"/>
    ${design(side === "back" && kind !== "tour" ? "back" : kind, area, ink, accent, words)}
  </g>`;
}

const BG = `<defs><radialGradient id="bg" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e8ec"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/>`;
const svg = (w, h, inner) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`);
const save = async (name, buf, w = 2048) => {
  await sharp(buf).resize(w).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  console.log(`img/shirts/${name}.jpg`);
};
const S = 2048;
const one = (opts) => svg(S, S, BG + shirt(opts, 124, 150, 3.0));

const saveMerch = async (name, buf) => {
  await sharp(buf).resize(2048).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(MERCH, `${name}.jpg`));
  console.log(`img/merch/${name}.jpg`);
};

await save("shirt-black-front", one({ color: "black" }));
await save("shirt-long-navy", one({ style: "long", color: "navy", words: ["SUMMIT ROOFING", "SAMPLE DESIGN"] }));
await save("shirt-chest-grey", one({ color: "heather", kind: "chest", words: ["YOUR CO."] }));
await save(
  "shirt-back",
  svg(S, S, BG + shirt({ color: "white", kind: "chest", words: ["YOUR CO."] }, 30, 520, 1.62) + shirt({ color: "white", side: "back", words: ["STAFF", "yourcompany.com · (555) 555-0123"] }, 1046, 520, 1.62) + text(S / 2, 300, 92, "#15171c", "Front + back print", 800) + text(S / 2, 400, 52, "#4b5563", "Logo on the chest, your website on the back", 500)),
);
await save(
  "shirt-colors",
  svg(S, S, BG + text(S / 2, 260, 96, "#15171c", "4 colors · S to 3XL", 800) + ["black", "white", "navy", "heather"].map((c, i) => shirt({ color: c, words: ["YOUR LOGO", "YOURCOMPANY.COM"] }, 40 + (i % 2) * 1000, 380 + Math.floor(i / 2) * 820, 1.6)).join("")),
);

// Size chart (inches, flat measurements)
const rows = [["S", "18", "28"], ["M", "20", "29"], ["L", "22", "30"], ["XL", "24", "31"], ["2XL", "26", "32"], ["3XL", "28", "33"]];
await save(
  "shirt-size-chart",
  svg(
    S,
    S,
    `<rect width="100%" height="100%" fill="#ffffff"/>` +
      text(S / 2, 230, 110, "#15171c", "Size chart (inches)", 800) +
      text(S / 2, 330, 56, "#4b5563", "Unisex · true to size · measured flat", 500) +
      [["Size", "Chest width", "Length"], ...rows]
        .map((r, i) => {
          const y = 520 + i * 200;
          return `${i % 2 ? `<rect x="224" y="${y - 120}" width="1600" height="200" fill="#f2f4f7"/>` : ""}${r.map((c, j) => text(524 + j * 500, y, i ? 80 : 60, i ? "#15171c" : "#6b7280", c, i ? 700 : 600)).join("")}`;
        })
        .join(""),
  ),
);

// Share image (1200 × 630)
await sharp(
  svg(
    1200,
    630,
    `<rect width="1200" height="630" fill="#0b1018"/><circle cx="930" cy="330" r="360" fill="#ff7a1a" fill-opacity="0.16"/>` +
      shirt({ color: "white", words: ["YOUR LOGO", "YOURCOMPANY.COM"] }, 690, 40, 0.86) +
      `<text x="64" y="170" font-family="${FONT}" font-weight="900" font-size="78" fill="#ffffff">Your logo.</text>` +
      `<text x="64" y="262" font-family="${FONT}" font-weight="900" font-size="78" fill="#ffffff">Your crew.</text>` +
      `<text x="64" y="354" font-family="${FONT}" font-weight="900" font-size="78" fill="#ff7a1a">No minimum.</text>` +
      `<text x="64" y="440" font-family="${FONT}" font-weight="600" font-size="34" fill="#c9cfd8">Custom company t-shirts from $27.99</text>` +
      `<text x="64" y="490" font-family="${FONT}" font-weight="600" font-size="34" fill="#c9cfd8">Free US shipping · 15% off 24+</text>` +
      `<text x="64" y="572" font-family="${FONT}" font-weight="800" font-size="30" fill="#ffffff">ceoturbo.com</text>`,
  ),
)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OG, "company-shirts.jpg"));
console.log("og/company-shirts.jpg");

// Artist merch photos + share image
const art = { kind: "merch", words: ["YOUR NAME", "THE ALBUM · OUT NOW"] };
await saveMerch("merch-black-front", one({ color: "black", ...art }));
await saveMerch("merch-long-maroon", one({ style: "long", color: "maroon", ...art }));
await saveMerch("merch-tour-back", svg(S, S, BG + shirt({ color: "black", ...art }, 30, 520, 1.62) + shirt({ color: "black", side: "back", kind: "tour", words: ["WORLD TOUR", "2026"] }, 1046, 520, 1.62) + text(S / 2, 300, 92, "#15171c", "Cover art + tour dates", 800) + text(S / 2, 400, 52, "#4b5563", "Your art on the front, every city on the back", 500)));
await saveMerch("merch-colors", svg(S, S, BG + text(S / 2, 200, 96, "#15171c", "6 colors · S to 3XL", 800) + ["black", "white", "navy", "heather", "maroon", "forest"].map((c, i) => shirt({ color: c, ...art }, 20 + (i % 3) * 680, 300 + Math.floor(i / 3) * 860, 1.1)).join("")));
await sharp(
  svg(
    1200,
    630,
    `<rect width="1200" height="630" fill="#0b1018"/><circle cx="930" cy="330" r="360" fill="#ff3d6e" fill-opacity="0.16"/>` +
      shirt({ color: "black", ...art }, 690, 40, 0.86) +
      `<text x="64" y="170" font-family="${FONT}" font-weight="900" font-size="78" fill="#ffffff">Your art.</text>` +
      `<text x="64" y="262" font-family="${FONT}" font-weight="900" font-size="78" fill="#ffffff">Your merch.</text>` +
      `<text x="64" y="354" font-family="${FONT}" font-weight="900" font-size="78" fill="#ff7a1a">No minimum.</text>` +
      `<text x="64" y="440" font-family="${FONT}" font-weight="600" font-size="34" fill="#c9cfd8">Artist merch t-shirts from $24.99</text>` +
      `<text x="64" y="490" font-family="${FONT}" font-weight="600" font-size="34" fill="#c9cfd8">Tour dates on the back · 20% off 50+</text>` +
      `<text x="64" y="572" font-family="${FONT}" font-weight="800" font-size="30" fill="#ffffff">ceoturbo.com/artist-merch</text>`,
  ),
)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OG, "artist-merch.jpg"));
console.log("og/artist-merch.jpg");
