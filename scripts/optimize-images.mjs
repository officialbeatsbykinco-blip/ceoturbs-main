// One-off asset pipeline: converts the raw screenshots/ads in ../ceoturbo-main/Images
// into web-ready WebP files under public/img. Run with: node scripts/optimize-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("../ceoturbo-main/Images");
const OUT = path.resolve("public/img");

// Client website screenshots (public/img/work) come from scripts/capture-site-shots.mjs, which captures
// the full page width. The old crop-to-16:10 step here cut the sides off wide screenshots, so it was removed.

const ads = {
  "beyond-labels-necklace": "1080X1080 Ad Love.jpg",
  "stackmode-computer-repair": "1080X1080 Computer Repair.jpg",
  "ryan-pool-bottled-water": "1080x1080 Before and After Set.jpg",
  "xilly-pc-fps": "1080x1080 Before and After.jpg",
  "mor-handy-electrical-panel": "1080x1080 Electrician.jpg",
  "1stikk-mock-kit": "1080x1080 Mock Kit Run.jpg",
  "loner-studio-rich-alone": "1080x1080 Rich Alone.jpg",
  "1stikk-text-message": "1080x1080 Test Messages Mocks.jpg",
  "mor-handy-outlet": "1080x1080 Wall Replacement.jpg",
  "mor-handy-carpet": "1080x1080 carpet cleaning.jpg",
  "ryan-pool-kangen-water": "1080x1080 set 3.jpg",
  "kava-construction-decks": "1080x1080 square set 4.jpg",
  "layne-fitness-muscle": "1080x1350 Layne.png",
  "cleardump-driveway": "1080x1350.jpg",
  "ntg-sold-listing": "Heres_your_reusable_ad-generation_prompt._202605151720.jpeg",
  "appliance-king-washer-dryer": "appliance king.jpg",
  "kingstone-before-after": "download (1).png",
  "uprise-electric": "download (2).png",
  "jarrett-bmw": "download.png",
};

const results = {
  "appliance-king": "Appliance King Ads/Appliance King Ads.png",
  bigzo: "BigZO Ads/Big ZO Ad Set 1.png",
  "mor-handy-carpet": "Mor Handy Ads/carpet cleaning set 1 morhandy.png",
  "mor-handy-electrical": "Mor Handy Ads/electrical socket replacement set 2.png",
  "ryan-pool": "Ryan Pool Enagic/Ryan Pool ad set 1.png",
  "stackmode-repair": "Stackmodechris Ads/stackmode repair set 2.png",
  "stackmode-set-1": "Stackmodechris Ads/stackmode saxaphone set 1 results.png",
  "stackmode-set-3": "Stackmodechris Ads/stackmode set 3.png",
  xilly: "Xilly Ads/xilly set 1 results.png",
};

async function run() {
  for (const dir of ["work", "ads", "results", "brand"]) {
    await mkdir(path.join(OUT, dir), { recursive: true });
  }


  for (const [slug, file] of Object.entries(ads)) {
    const src = path.join(SRC, "Ads I Designed", file);
    await sharp(src).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(OUT, "ads", `${slug}.webp`));
    await sharp(src).resize({ width: 360 }).webp({ quality: 72 }).toFile(path.join(OUT, "ads", `${slug}-360.webp`));
  }

  for (const [slug, file] of Object.entries(results)) {
    const src = path.join(SRC, "Ad Results", file);
    await sharp(src).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, "results", `${slug}.webp`));
    await sharp(src).resize({ width: 600 }).webp({ quality: 78 }).toFile(path.join(OUT, "results", `${slug}-600.webp`));
  }

  await sharp(path.join(SRC, "Google Search Console/Stackmodechris Indexing SEO/BEFORE CEOTURBO SEO, AEO AND GEO.jpg"))
    .resize({ width: 1600 })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, "results", "gsc-stackmode.webp"));

  await sharp("_legacy/public/about/ceo-portrait.png").resize(720).webp({ quality: 80 }).toFile(path.join(OUT, "brand", "christopher-robinson.webp"));
  await sharp("src/assets/ceo-turbo-logo.png").trim().resize({ height: 160 }).webp({ quality: 90 }).toFile(path.join(OUT, "brand", "ceo-turbo-logo.webp"));
  await sharp("src/assets/ceo-turbo-logo.png").trim().resize({ height: 512 }).png().toFile(path.join(OUT, "brand", "ceo-turbo-logo.png"));
  await sharp("src/assets/ceo-turbo-logo.png").trim().resize({ height: 64 }).webp({ quality: 88 }).toFile(path.join(OUT, "brand", "ceo-turbo-logo-sm.webp"));

  console.log("images optimized");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
