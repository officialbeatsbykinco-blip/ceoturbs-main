// Fallback renderer for when `npx hyperframes render` stalls (BeginFrame capture failing → slow screenshot mode).
// Seeks the built page's GSAP timeline frame by frame in headless Chrome, pipes PNGs to ffmpeg in parallel chunks,
// then joins the chunks and muxes the mixed audio from build.mjs.
//   node build.mjs why-reviews && node render-local.mjs why-reviews [--workers 4] [--start 0 --end 10]
// Needs playwright-core (repo devDependency) and Chrome headless shell in ~/.cache/puppeteer (installed by hyperframes).
import { chromium } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const EP = args[0];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? +args[i + 1] : d; };
const DIR = path.join(HERE, ".build", EP);
const html = readFileSync(path.join(DIR, "index.html"), "utf8");
const m = html.match(/data-duration="([\d.]+)" data-width="(\d+)" data-height="(\d+)" data-fps="(\d+)"/);
const [DUR, W, H, FPS] = [+m[1], +m[2], +m[3], +m[4]];
const start = opt("start", 0), end = Math.min(opt("end", DUR), DUR);
const WORKERS = opt("workers", Math.max(2, Math.min(6, os.cpus().length - 2)));
const total = Math.round((end - start) * FPS);
const OUT = path.join(HERE, "renders", `${EP}.mp4`);
const TMP = path.join(DIR, ".chunks");
rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true });

const base = os.homedir() + "/.cache/puppeteer/chrome-headless-shell/";
// The oldest cached shell (131) captures reliably here; 149 hangs on screenshots. Override with CHROME_SHELL=<version dir>.
const v = process.env.CHROME_SHELL ?? readdirSync(base).sort()[0]; const d = readdirSync(base + v)[0];
const exe = `${base}${v}/${d}/chrome-headless-shell`;
const t0 = Date.now();
let done = 0;
const BATCH = 24; // Chrome stalls after many captures in one page, so each worker restarts its browser often
const open = async () => {
  const browser = await chromium.launch({ executablePath: exe, args: (process.env.CHROME_ARGS ?? "--disable-gpu").split(" ").filter(Boolean) });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto("file://" + path.join(DIR, "index.html"));
  await page.evaluate(() => document.fonts.ready.then(() => 0));
  await page.waitForTimeout(400);
  const cdp = await page.context().newCDPSession(page);
  return { browser, page, cdp };
};
const within = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("capture timeout")), ms))]);

async function chunk(k) {
  const a = Math.floor((total * k) / WORKERS), b = Math.floor((total * (k + 1)) / WORKERS);
  const file = path.join(TMP, `c${String(k).padStart(2, "0")}.mp4`);
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-r", String(FPS), file], { stdio: ["pipe", "inherit", "inherit"] });
  let s = null, used = 0;
  for (let f = a; f < b; f++) {
    let png;
    for (let tries = 0; !png; tries++) {
      if (!s || used >= BATCH) { if (s) await s.browser.close().catch(() => {}); s = await open(); used = 0; }
      try {
        const t = start + f / FPS;
        png = await within((async () => {
          await s.page.evaluate(([ep, t]) => {
            // like HyperFrames: only the clips on screen at t are in the page, so Chrome composites 1–2 scenes, not all of them
            for (const c of document.querySelectorAll(".clip")) { const a = +c.dataset.start, d = +c.dataset.duration; c.style.display = t >= a && t < a + d ? "" : "none"; }
            window.__timelines[ep].seek(t, false);
          }, [EP, t]);
          await s.page.waitForTimeout(40);
          const { data } = await s.cdp.send("Page.captureScreenshot", { format: "png" });
          return Buffer.from(data, "base64");
        })(), 20000);
        used++;
      } catch (e) {
        if (tries > 3) throw e;
        console.log(`frame ${f}: ${e.message}, restarting browser`);
        await s.browser.close().catch(() => {}); s = null;
      }
    }
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (++done % 300 === 0) { const el = (Date.now() - t0) / 1000; console.log(`${done}/${total} frames · ${(done / el).toFixed(1)} fps · ~${Math.round(((total - done) / done) * el / 60)} min left`); }
  }
  if (s) await s.browser.close().catch(() => {});
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  return file;
}

const files = await Promise.all(Array.from({ length: WORKERS }, (_, k) => chunk(k)));
writeFileSync(path.join(TMP, "list.txt"), files.map((f) => `file '${f}'`).join("\n"));
const audio = path.join(DIR, "assets/audio", `${EP}.wav`);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(TMP, "list.txt"), "-ss", String(start), "-t", String(end - start), "-i", audio,
  "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-shortest", OUT]);
rmSync(TMP, { recursive: true, force: true });
console.log(`✓ ${OUT} · ${total} frames in ${Math.round((Date.now() - t0) / 1000)}s`);
