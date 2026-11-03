// Pack variant images (1 / 2 / 5 cards) for the Shopify listing and the site's pack selector.
// Rasterises the card artwork in src/lib/card-faces.ts onto a white studio background.
// Run with: node scripts/review-card-packs.mjs
import sharp from "sharp";
import path from "node:path";
import { cardBack, cardFront } from "../src/lib/card-faces.ts";

const OUT = path.resolve("public/img/review-cards");
const S = 2048;
const CARD_W = 560; // rendered width of one card at canvas scale
const clear = { r: 0, g: 0, b: 0, alpha: 0 };

const face = (svg, width) => sharp(Buffer.from(svg), { density: 300 }).resize({ width }).png().toBuffer();
const front = await face(cardFront(), 900);
const back = await face(cardBack(), 900);
const fm = await sharp(front).metadata();

/** One placed card: rotated, with a soft contact shadow and a thin edge so white-on-white reads. */
async function placed(buf, { scale = 1, deg = 0 }) {
  const w = Math.round(fm.width * scale);
  const base = await sharp(buf).resize({ width: w }).png().toBuffer();
  const h = (await sharp(base).metadata()).height;
  const edge = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${w * 0.0815}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2"/></svg>`);
  const card = await sharp(base).composite([{ input: edge }]).png().toBuffer();
  const pad = 140;
  const shadowSvg = Buffer.from(`<svg width="${w + pad * 2}" height="${h + pad * 2}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${w * 0.045}"/></filter></defs><rect x="${pad + w * 0.03}" y="${pad + h * 0.035}" width="${w * 0.94}" height="${h * 0.96}" rx="${w * 0.08}" fill="#0b1220" fill-opacity=".30" filter="url(#b)"/></svg>`);
  const withShadow = await sharp(shadowSvg).composite([{ input: card, left: pad, top: pad }]).png().toBuffer();
  const out = await sharp(withShadow).rotate(deg, { background: clear }).png().toBuffer();
  const m = await sharp(out).metadata();
  return { input: out, w: m.width, h: m.height };
}

const pill = (label) =>
  Buffer.from(`<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${S / 2 - 150}" y="${S - 210}" width="300" height="92" rx="46" fill="#0b1220"/>
  <text x="${S / 2}" y="${S - 150}" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="52" fill="#fff">${label}</text>
</svg>`);

async function build(name, label, cards, { pill: withPill = true } = {}) {
  const layers = [];
  for (const c of cards) {
    const p = await placed(c.buf, c);
    layers.push({ input: p.input, left: Math.round(c.cx - p.w / 2), top: Math.round(c.cy - p.h / 2) });
  }
  await sharp({ create: { width: S, height: S, channels: 4, background: "#ffffff" } })
    .composite(withPill ? [...layers, { input: pill(label) }] : layers)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, `${name}.jpg`));
  await sharp(path.join(OUT, `${name}.jpg`)).resize({ width: 200, height: 200 }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}-thumb.webp`));
  console.log(name);
}

const cy = 940;
// 1 card: the white front, gently tilted, large.
await build("pack-1", "1 card", [{ buf: front, scale: 1.0, deg: -5, cx: S / 2, cy }]);

// 2 cards: front and back side by side so the buyer sees both sides.
await build("pack-2", "2 cards", [
  { buf: back, scale: 0.8, deg: 7, cx: S / 2 + 250, cy: cy - 20 },
  { buf: front, scale: 0.8, deg: -7, cx: S / 2 - 250, cy: cy + 20 },
]);

// 5 cards: a tidy deck. Four black backs peek out behind the white front, each nudged and tilted.
await build("pack-5", "5 cards", [
  { buf: back, scale: 0.8, deg: 9, cx: S / 2 + 190, cy: cy - 40 },
  { buf: back, scale: 0.8, deg: 6, cx: S / 2 + 130, cy: cy - 28 },
  { buf: back, scale: 0.8, deg: 3, cx: S / 2 + 70, cy: cy - 16 },
  { buf: back, scale: 0.8, deg: 0, cx: S / 2 + 20, cy: cy - 4 },
  { buf: front, scale: 0.8, deg: -4, cx: S / 2 - 90, cy: cy + 10 },
]);

// ---- Clean shopping images (no text overlays, product fills the frame) for Merchant Center / Shopping ads.
const cyc = S / 2;
await build("shop-1", "", [{ buf: front, scale: 1.04, deg: -5, cx: S / 2, cy: cyc }], { pill: false });
await build("shop-2", "", [
  { buf: back, scale: 0.92, deg: 7, cx: S / 2 + 300, cy: cyc - 20 },
  { buf: front, scale: 0.92, deg: -7, cx: S / 2 - 300, cy: cyc + 20 },
], { pill: false });
await build("shop-5", "", [
  { buf: back, scale: 0.92, deg: 9, cx: S / 2 + 250, cy: cyc - 40 },
  { buf: back, scale: 0.92, deg: 6, cx: S / 2 + 185, cy: cyc - 28 },
  { buf: back, scale: 0.92, deg: 3, cx: S / 2 + 120, cy: cyc - 16 },
  { buf: back, scale: 0.92, deg: 0, cx: S / 2 + 55, cy: cyc - 4 },
  { buf: front, scale: 0.92, deg: -4, cx: S / 2 - 120, cy: cyc + 10 },
], { pill: false });

await build("shop-10", "", [
  ...Array.from({ length: 9 }, (_, i) => ({ buf: back, scale: 0.86, deg: 16 - i * 2.5, cx: S / 2 + 330 - i * 42, cy: cyc - 70 + i * 9 })),
  { buf: front, scale: 0.86, deg: -6, cx: S / 2 - 150, cy: cyc + 20 },
], { pill: false });

// Front + back, clean, for the additional-image slot.
await build("shop-both", "", [
  { buf: back, scale: 0.95, deg: 8, cx: S / 2 + 300, cy: cyc - 10 },
  { buf: front, scale: 0.95, deg: -6, cx: S / 2 - 300, cy: cyc + 20 },
], { pill: false });

// Tap scene: phone with a generic English review screen next to the card, NFC waves between them.
{
  const card = await placed(front, { scale: 0.82, deg: -6 });
  const phone = Buffer.from(`<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset="1" stop-color="#dfe8f3"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter></defs>
  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <g transform="translate(1130 300) rotate(8 340 700)">
    <rect x="30" y="60" width="680" height="1400" rx="110" fill="#0b1220" fill-opacity=".28" filter="url(#sh)"/>
    <rect width="680" height="1400" rx="110" fill="#111827"/>
    <rect x="16" y="16" width="648" height="1368" rx="96" fill="#fff"/>
    <rect x="250" y="40" width="180" height="46" rx="23" fill="#111827"/>
    <text x="340" y="250" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="50" fill="#111827">How was your visit?</text>
    <text x="340" y="312" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#6b7280">Tap a star to rate</text>
    ${[0,1,2,3,4].map(i=>`<polygon transform="translate(${96+i*100} 380) scale(3.3)" points="12,2 15,9 22,9.3 16.5,14 18.3,21 12,17.2 5.7,21 7.5,14 2,9.3 9,9" fill="#fbbc04"/>`).join("")}
    <rect x="70" y="560" width="540" height="300" rx="28" fill="#f3f4f6"/>
    <text x="100" y="620" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="32" fill="#9ca3af">Share details of your experience</text>
    <rect x="70" y="930" width="540" height="110" rx="55" fill="#1a73e8"/>
    <text x="340" y="1002" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="42" fill="#fff">Post review</text>
  </g>
</svg>`);
  await sharp(phone)
    .composite([{ input: card.input, left: 120, top: Math.round(S / 2 - card.h / 2) + 60 }])
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, "shop-tap.jpg"));
  await sharp(path.join(OUT, "shop-tap.jpg")).resize({ width: 200, height: 200 }).webp({ quality: 80 }).toFile(path.join(OUT, "shop-tap-thumb.webp"));
  console.log("shop-tap");
}
