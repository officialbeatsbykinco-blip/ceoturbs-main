// Builds the Google review card product images and share images from the supplier
// photos in scripts/review-cards/ and the card artwork in src/lib/card-faces.ts. Run with: node scripts/review-card-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { cardBack, cardFront } from "../src/lib/card-faces.ts";
import { fromPriceLabel } from "../src/config/site.ts";

const SRC = path.resolve("scripts/review-cards");
const OUT = path.resolve("public/img/review-cards");
const OG = path.resolve("public/og");
await mkdir(OUT, { recursive: true });

const src = (f) => path.join(SRC, f);
const webp = { quality: 86, effort: 6 };

// 1) Gallery photos — kept on their white studio background, like a real product listing.
//    tap-review: the supplier's "4.9 · 1,980 reviews" badge isn't ours, so it's cut out and the
//    compatibility strip below it is stacked straight under the hero part.
const gallery = {
  specs: "specs.png",
  "retail-counter": "retail-counter.webp",
  "how-it-works": "how-it-works.png",
  stack: "stack.png",
  size: "size.png",
};
const save = async (name, input) => {
  await sharp(input).flatten({ background: "#ffffff" }).webp(webp).toFile(path.join(OUT, `${name}.webp`));
  await sharp(input).flatten({ background: "#ffffff" }).resize({ width: 200, height: 200, fit: "contain", background: "#ffffff" }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}-thumb.webp`));
  const m = await sharp(input).metadata();
  console.log(name, m.width, m.height);
};
for (const [name, file] of Object.entries(gallery)) await save(name, src(file));
{
  const top = await sharp(src("tap-review.png")).extract({ left: 0, top: 0, width: 566, height: 500 }).png().toBuffer();
  const strip = await sharp(src("tap-review.png")).extract({ left: 0, top: 612, width: 566, height: 100 }).png().toBuffer();
  const joined = await sharp({ create: { width: 566, height: 600, channels: 3, background: "#ffffff" } })
    .composite([{ input: top, left: 0, top: 0 }, { input: strip, left: 0, top: 500 }])
    .png()
    .toBuffer();
  await save("tap-review", joined);
}

// 2) Clean renders of both sides (no text overlays) — feed images, share images and thumbnails.
const face = (svg, width) => sharp(Buffer.from(svg)).resize({ width }).png().toBuffer();
const front = await face(cardFront(), 520);
const back = await face(cardBack(), 520);
const shadowFor = (w, h) =>
  Buffer.from(`<svg width="${w + 120}" height="${h + 120}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b"><feGaussianBlur stdDeviation="22"/></filter></defs><rect x="60" y="80" width="${w}" height="${h}" rx="40" fill="#000" fill-opacity=".28" filter="url(#b)"/></svg>`);
const tilt = async (buf, deg) => sharp(buf).rotate(deg, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const pair = async (bgColor, size) => {
  const b = await tilt(back, 8);
  const f = await tilt(front, -6);
  const fm = await sharp(f).metadata();
  const bm = await sharp(b).metadata();
  const sh = await sharp(shadowFor(520, 822)).png().toBuffer();
  return sharp({ create: { width: 1200, height: 1200, channels: 4, background: bgColor } })
    .composite([
      { input: sh, left: 520, top: 110 },
      { input: b, left: 1200 - bm.width - 110, top: 140 },
      { input: sh, left: 120, top: 200 },
      { input: f, left: 150, top: 1200 - fm.height - 90 },
    ])
    .flatten({ background: bgColor })
    .resize({ width: size })
    .png()
    .toBuffer();
};
const pairWhite = await pair("#ffffff", 1200);
await sharp(pairWhite).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(OUT, "feed-white.jpg"));
await sharp(pairWhite).resize({ width: 200 }).webp({ quality: 80 }).toFile(path.join(OUT, "card-3d-thumb.webp"));

// 3) Share images (1200×630) for the shop and the free audit.
const W = 1200;
const H = 630;
const bg = (accent) =>
  Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="78%" cy="30%" r="55%"><stop offset="0" stop-color="${accent}" stop-opacity=".45"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="5%" cy="110%" r="60%"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".28"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="#05070b"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#g1)"/>
  <rect width="100%" height="100%" fill="url(#g2)"/>
</svg>`);

const text = (lines, sub, cta) =>
  Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="#fff"/><stop offset="1" stop-color="#9aa8b8"/></linearGradient>
    <linearGradient id="turbo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a9fff"/><stop offset=".5" stop-color="#6cc6ff"/><stop offset="1" stop-color="#ffb347"/></linearGradient>
    <linearGradient id="btn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3d"/><stop offset="1" stop-color="#ff6b1a"/></linearGradient>
  </defs>
  <text x="70" y="96" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="28" fill="#fff">CEO <tspan fill="#1a9fff">Turbo</tspan></text>
  ${lines
    .map(
      (l, i) =>
        `<text x="66" y="${205 + i * 80}" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="78" letter-spacing="-2.5" fill="url(#${i === lines.length - 1 ? "turbo" : "chrome"})">${l}</text>`,
    )
    .join("")}
  <text x="70" y="${205 + lines.length * 80 + 10}" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="600" font-size="27" fill="#c8d3df">${sub}</text>
  <rect x="70" y="500" width="${cta.length * 15.5 + 60}" height="68" rx="16" fill="url(#btn)"/>
  <text x="100" y="545" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="26" fill="#140700">${cta}</text>
</svg>`);

const shadow = (w, h) =>
  Buffer.from(`<svg width="${w + 160}" height="${h + 160}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b"><feGaussianBlur stdDeviation="30"/></filter></defs><rect x="80" y="110" width="${w}" height="${h}" rx="40" fill="#1a9fff" fill-opacity=".55" filter="url(#b)"/></svg>`);

// Shop share image: tilted card + headline
{
  const b = await sharp(back).resize({ width: 250 }).rotate(10, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const card = await sharp(front).resize({ width: 270 }).rotate(-8, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const meta = await sharp(card).metadata();
  const glow = await sharp(shadow(meta.width - 60, meta.height - 60)).png().toBuffer();
  await sharp(bg("#1a9fff"))
    .composite([
      { input: glow, left: 700, top: 20 },
      { input: b, left: 900, top: 50 },
      { input: card, left: 730, top: 110 },
      { input: text(["More 5-star", "Google reviews."], `NFC Google review cards · Free US shipping`, `Shop now — from ${fromPriceLabel}`), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OG, "review-cards.jpg"));
}

// Free audit share image: score gauge + headline
{
  const gauge = Buffer.from(`<svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b1a"/><stop offset="1" stop-color="#1a9fff"/></linearGradient></defs>
    <circle cx="210" cy="210" r="170" fill="#0b1018" stroke="#1b2532" stroke-width="28"/>
    <circle cx="210" cy="210" r="170" fill="none" stroke="url(#arc)" stroke-width="28" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 170 * 0.42} 2000" transform="rotate(-90 210 210)"/>
    <text x="210" y="225" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="120" fill="#fff">42</text>
    <text x="210" y="280" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="600" font-size="26" fill="#9aa8b8">visibility score</text>
  </svg>`);
  const chips = Buffer.from(`<svg width="420" height="60" xmlns="http://www.w3.org/2000/svg">
    ${["SEO", "AEO", "GEO"].map((l, i) => `<rect x="${i * 140}" y="0" width="124" height="52" rx="26" fill="#0b1018" stroke="#2a3646"/><text x="${i * 140 + 62}" y="34" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="22" fill="${["#ff6b1a", "#ffb347", "#1a9fff"][i]}">${l}</text>`).join("")}
  </svg>`);
  await sharp(bg("#1a9fff"))
    .composite([
      { input: gauge, left: 720, top: 70 },
      { input: chips, left: 728, top: 510 },
      { input: text(["Is Google &amp; AI", "sending you", "customers?"], "Free SEO, AEO &amp; GEO report in 60 seconds.", "Run my free audit"), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OG, "free-audit.jpg"));
}

console.log("review card images + share images written");
