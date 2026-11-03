// Screenshots every client site in src/content/clients.ts into public/img/work/{slug}.webp (+ -960, -640).
// The whole 1440×900 viewport is captured and scaled — never cropped — so no site is cut off at the edges.
// Runs in GitHub Actions (.github/workflows/site-shots.yml); locally: npx playwright install chromium first.
//   node scripts/capture-site-shots.mjs            all clients
//   node scripts/capture-site-shots.mjs yari-beats  only these slugs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const OUT = path.resolve("public/img/work");
const SIZES = [
  ["", 1600, 1000, 80],
  ["-960", 960, 600, 76],
  ["-640", 640, 400, 74],
];

const src = await readFile("src/content/clients.ts", "utf8");
const clients = [...src.matchAll(/slug: "([^"]+)",\s*name: "[^"]*",\s*url: "([^"]+)"/g)].map((m) => ({ slug: m[1], url: m[2] }));
const only = process.argv.slice(2);
const todo = only.length ? clients.filter((c) => only.includes(c.slug)) : clients;
if (!todo.length) throw new Error("no clients matched");

const browser = await chromium.launch();
const failed = [];
for (const { slug, url } of todo) {
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.25,
      reducedMotion: "reduce",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 }).catch(() => {});
      if (!page.url().startsWith("http")) throw new Error(`did not load (${page.url()})`);
      // Let hero animations and lazy images settle, and hide cookie banners.
      await page.waitForTimeout(4000);
      await page.addStyleTag({ content: "[class*=cookie],[id*=cookie],[class*=consent],[id*=consent]{display:none!important}" }).catch(() => {});
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      const png = await page.screenshot({ type: "png" });
      for (const [suffix, w, h, quality] of SIZES) {
        await sharp(png).resize(w, h, { fit: "fill" }).webp({ quality }).toFile(path.join(OUT, `${slug}${suffix}.webp`));
      }
      console.log(`ok   ${slug}  ${page.url()}`);
      ok = true;
    } catch (e) {
      console.log(`retry ${slug} (${attempt}): ${e.message}`);
    }
    await ctx.close();
  }
  if (!ok) failed.push(slug);
}
await browser.close();
// A site that's down keeps its previous screenshot; the run still fails loudly so someone looks.
if (failed.length) {
  console.error(`FAILED: ${failed.join(", ")}`);
  process.exitCode = 1;
}
