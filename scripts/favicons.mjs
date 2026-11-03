// Builds every favicon / app icon from the CEO Turbo logo mark (the "CT" monogram).
// Run with: node scripts/favicons.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const crop = await sharp("src/assets/ceo-turbo-logo.png").extract({ left: 326, top: 136, width: 234, height: 168 }).png().toBuffer();
const mark = await sharp(crop).trim().png().toBuffer();

/** Mark centred on the brand's dark rounded square (reads on light and dark browser tabs). */
async function icon(size, { radius = 0.22, pad = 0.14 } = {}) {
  const bg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#13233a"/><stop offset="1" stop-color="#05070b"/></radialGradient></defs><rect width="${size}" height="${size}" rx="${size * radius}" fill="url(#g)"/></svg>`);
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mark).resize({ width: inner, height: inner, fit: "inside" }).png().toBuffer();
  const meta = await sharp(m).metadata();
  return sharp(bg)
    .composite([{ input: m, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toBuffer();
}

await writeFile("public/icon-192.png", await icon(192));
await writeFile("public/icon-512.png", await icon(512));
await writeFile("public/icon-maskable-512.png", await icon(512, { radius: 0, pad: 0.22 }));
await writeFile("public/apple-touch-icon.png", await icon(180, { radius: 0, pad: 0.12 }));
await writeFile("public/favicon-48.png", await icon(48, { pad: 0.05 }));

// favicon.ico with PNG-encoded 16, 32 and 48 px images.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => icon(s, { pad: s < 32 ? 0.02 : 0.05 })));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...pngs]));
console.log("favicons written");
