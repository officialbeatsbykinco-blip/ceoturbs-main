// Google Performance Max images for the business-only campaign (lands on /business-tech-setup-tampa).
// Real photos only: Google favors real photos and limits images with heavy text overlays.
// Sizes follow Google's PMax specs: landscape 1.91:1 (1200x628), square 1:1 (1200x1200), portrait 4:5 (960x1200),
// logo 1:1 (1200x1200) and logo 4:1 (1200x300). Sources are the original 2880x2160 photos, so nothing is upscaled.
// The "after" photo shows a client's company name on the right monitor. It is blurred so no third-party
// trademark appears in an ad.
// Run: node ads/google/pmax-business.mjs   -> ads/google/out/
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(here, "out");

const AFTER = resolve(root, "Images/Office Setuo/after office 2.jpg");
const BEFORE = resolve(root, "Images/Office Setuo/before office 181575947154__E0762432-8911-4612-B973-EF21BAD8019A.jpg");
const LOGO = resolve(root, "public/img/brand/ceo-turbo-logo.png");

/** Boxes to blur, as fractions of the photo: [x, y, w, h]. Right monitor = client branding. */
const AFTER_BLUR = [[0.6, 0.15, 0.31, 0.265]];

async function source(path, blur = []) {
  const img = sharp(path).rotate();
  const { width, height } = await img.metadata();
  const base = await img.toBuffer();
  const patches = await Promise.all(
    blur.map(async ([x, y, w, h]) => {
      const region = { left: Math.round(x * width), top: Math.round(y * height), width: Math.round(w * width), height: Math.round(h * height) };
      const input = await sharp(base).extract(region).blur(40).modulate({ brightness: 1.05 }).toBuffer();
      return { input, left: region.left, top: region.top };
    }),
  );
  return { buf: patches.length ? await sharp(base).composite(patches).toBuffer() : base, width, height };
}

/** Crop a photo to cover w x h, centred on focus (fx, fy in 0..1). */
async function cover(src, w, h, fx = 0.5, fy = 0.5) {
  const scale = Math.max(w / src.width, h / src.height);
  const rw = Math.round(src.width * scale);
  const rh = Math.round(src.height * scale);
  const left = Math.max(0, Math.min(rw - w, Math.round(rw * fx - w / 2)));
  const top = Math.max(0, Math.min(rh - h, Math.round(rh * fy - h / 2)));
  return sharp(src.buf).resize(rw, rh).extract({ left, top, width: w, height: h }).toBuffer();
}

const label = (text, bg) => {
  const w = 40 + text.length * 26;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="62"><rect width="${w}" height="62" rx="12" fill="${bg}"/><text x="${w / 2}" y="43" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="32" fill="#fff" letter-spacing="1">${text}</text></svg>`);
};

/** Before on top/left, after on bottom/right, an 8px white gap between them. */
async function beforeAfter(before, after, w, h, side) {
  const gap = 8;
  const [pw, ph] = side ? [(w - gap) / 2, h] : [w, (h - gap) / 2];
  const a = await cover(before, pw, ph, 0.6, 0.55);
  const b = await cover(after, pw, ph, 0.55, 0.42);
  return sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } })
    .composite([
      { input: a, left: 0, top: 0 },
      { input: b, left: side ? pw + gap : 0, top: side ? 0 : ph + gap },
      { input: label("BEFORE", "#334155"), left: 24, top: 24 },
      { input: label("AFTER", "#ea580c"), left: (side ? pw + gap : 0) + 24, top: (side ? 0 : ph + gap) + 24 },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

async function logo(w, h, logoW) {
  const mark = await sharp(LOGO).resize({ width: logoW, height: h - 30, fit: "inside" }).toBuffer();
  return sharp({ create: { width: w, height: h, channels: 4, background: "#ffffff" } }).composite([{ input: mark, gravity: "center" }]).png().toBuffer();
}

await mkdir(out, { recursive: true });
const after = await source(AFTER, AFTER_BLUR);
const before = await source(BEFORE);
const jpg = (b) => sharp(b).jpeg({ quality: 92, mozjpeg: true }).toBuffer();

const jobs = {
  "office-after-landscape.jpg": () => cover(after, 1200, 628, 0.55, 0.42).then(jpg),
  "office-after-square.jpg": () => cover(after, 1200, 1200, 0.5, 0.5).then(jpg),
  "office-after-portrait.jpg": () => cover(after, 960, 1200, 0.42, 0.5).then(jpg),
  "office-before-after-landscape.jpg": () => beforeAfter(before, after, 1200, 628, true),
  "office-before-after-square.jpg": () => beforeAfter(before, after, 1200, 1200, false),
  "office-before-after-portrait.jpg": () => beforeAfter(before, after, 960, 1200, false),
  "logo-square.png": () => logo(1200, 1200, 1000),
  "logo-landscape.png": () => logo(1200, 300, 1100),
};

for (const [name, make] of Object.entries(jobs)) {
  const buf = await make();
  await sharp(buf).toFile(resolve(out, name));
  const { width, height } = await sharp(buf).metadata();
  console.log(`ads/google/out/${name}  ${width}x${height}  ${Math.round(buf.length / 1024)} KB`);
}
