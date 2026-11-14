// Renders the IT share / search images (scripts/og/it.html) to public/og/<variant>.jpg at 1200×630.
// Run: node scripts/og/render-it.mjs   (uses your installed Chrome; set PW_CHANNEL to change)
import { chromium } from "playwright-core";
import sharp from "sharp";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const page_ = pathToFileURL(path.join(here, "it.html")).href;
const out = path.join(here, "../../public/og");

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(page_);
const variants = await page.evaluate(() => window.VARIANTS);
for (const v of variants) {
  await page.goto(`${page_}#${v}`);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  const png = await page.screenshot({ type: "png" });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(out, `${v}.jpg`));
  console.log("wrote", `public/og/${v}.jpg`);
}
await browser.close();
