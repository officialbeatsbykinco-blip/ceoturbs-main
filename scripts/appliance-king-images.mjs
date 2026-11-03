// Re-encodes the Appliance King dashboard screenshots from the originals in Images/ with no visible
// compression (screenshots are mostly text, which lossy WebP smears). Run: node scripts/appliance-king-images.mjs
import sharp from "sharp";
import path from "node:path";

const OUT = path.resolve("public/img/results");
const ads = path.resolve("Images/Testimonials/Appliance King/Meta Ads.png");
const page = path.resolve("Images/Testimonials/Appliance King/views.png");

// Full size is lossless; smaller sizes use near-lossless so text stays crisp on retina screens.
const set = async (src, slug, widths) => {
  await sharp(src).webp({ lossless: true, effort: 6 }).toFile(path.join(OUT, `${slug}.webp`));
  for (const w of widths) await sharp(src).resize({ width: w, kernel: "lanczos3" }).webp({ quality: 95, nearLossless: true, effort: 6 }).toFile(path.join(OUT, `${slug}-${w}.webp`));
};

await set(ads, "appliance-king", [600]);
await set(page, "appliance-king-page", [600, 900]);
console.log("appliance king images re-encoded");
