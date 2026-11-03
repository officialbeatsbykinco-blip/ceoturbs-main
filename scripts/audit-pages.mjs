// Browser audit of every sitemap page at desktop (1440×900) and phone (375×812 @2x) sizes.
// Flags console/page errors, broken same-site requests, sideways scroll, h1 problems, blurry images
// (shown bigger than their pixels), low-contrast text, small tap targets on phones, CLS and LCP.
// Run against a built site:  npm run build && npx vite preview --port 4173
//   node scripts/audit-pages.mjs [baseUrl=http://localhost:4173] [outDir=audit-out] [path ...]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [base = "http://localhost:4173", outDir = "audit-out", ...only] = process.argv.slice(2);
const OUT = path.resolve(outDir);
mkdirSync(path.join(OUT, "shots"), { recursive: true });

const sitemap = readFileSync(existsSync("dist/sitemap.xml") ? "dist/sitemap.xml" : "public/sitemap.xml", "utf8");
let paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1] || "/");
if (only.length) paths = only;

const VIEWS = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false },
  { name: "mobile", viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

// Collected in the page before any script runs.
const VITALS = `
window.__cls = 0; window.__lcp = 0;
try {
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => { const e = l.getEntries().pop(); if (e) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
} catch {}`;

/** Runs inside the page: layout, image, contrast and tap-target checks. */
function inspect(isMobile) {
  const out = { overflow: 0, h1: 0, blurry: [], contrast: [], tap: [] };
  const vw = document.documentElement.clientWidth;
  out.overflow = Math.max(0, document.documentElement.scrollWidth - vw);
  out.h1 = document.querySelectorAll("h1").length;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
  };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  for (const img of document.images) {
    if (!img.complete || img.naturalWidth < 2 || img.naturalHeight < 2 || !visible(img)) continue;
    const r = img.getBoundingClientRect();
    if (r.width < 120) continue;
    let px = img.naturalWidth;
    if (img.srcset && img.currentSrc) {
      const hit = img.srcset.split(",").map((c) => c.trim().split(/\s+/)).find(([u]) => img.currentSrc.endsWith(u));
      if (hit && /w$/.test(hit[1] || "")) px = parseInt(hit[1], 10);
    }
    const fit = getComputedStyle(img).objectFit;
    // object-cover/contain: compare against the drawn size of the larger side.
    const need = fit === "cover" ? Math.max(r.width, (r.height * img.naturalWidth) / img.naturalHeight) : r.width;
    if (need < 4000 && need * dpr > px * 1.15) out.blurry.push(`${(img.currentSrc || img.src).replace(location.origin, "")} shown ${Math.round(need)}px @${dpr}x, has ${px}px`);
  }

  const lum = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return { L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a };
  };
  const bgOf = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== "none") return null; // gradient or photo: can't judge
      const c = lum(s.backgroundColor);
      if (c && c.a >= 0.5) return c.L;
    }
    return lum(getComputedStyle(document.body).backgroundColor)?.L ?? 1;
  };
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const text = t.textContent.trim();
    const el = t.parentElement;
    if (text.length < 2 || !el || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    const s = getComputedStyle(el);
    if (s.backgroundClip === "text" || s.webkitBackgroundClip === "text" || s.webkitTextFillColor === "transparent") continue;
    const fg = lum(s.color);
    const bg = bgOf(el);
    if (!fg || bg == null || fg.a < 0.5) continue;
    const ratio = (Math.max(fg.L, bg) + 0.05) / (Math.min(fg.L, bg) + 0.05);
    const size = parseFloat(s.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5)) out.contrast.push(`${ratio.toFixed(2)}:1 "${text.slice(0, 50)}"`);
  }

  if (isMobile) {
    for (const el of document.querySelectorAll("a[href], button, [role=button], [role=radio], [role=tab], input, select")) {
      if (!visible(el) || el.closest("p, li p, .prose")) continue;
      if (getComputedStyle(el).display === "inline") continue;
      const r = el.getBoundingClientRect();
      if (r.width <= 2 || r.height <= 2) continue; // sr-only skip links and hidden inputs
      if (r.width < 32 || r.height < 32) out.tap.push(`${Math.round(r.width)}×${Math.round(r.height)} ${(el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40)}`);
    }
  }
  out.blurry = [...new Set(out.blurry)].slice(0, 12);
  out.contrast = [...new Set(out.contrast)].slice(0, 12);
  out.tap = [...new Set(out.tap)].slice(0, 12);
  return out;
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
const report = [];
for (const v of VIEWS) {
  const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: v.deviceScaleFactor, isMobile: v.isMobile, hasTouch: v.hasTouch });
  await ctx.addInitScript(VITALS);
  // Ad and analytics hosts are not what this audit is about; skip them so pages settle fast.
  await ctx.route((u) => u.origin !== new URL(base).origin && /(facebook|doubleclick|googletagmanager|google-analytics|googleadservices|bing\.com|clarity\.ms|tiktok|redditstatic|cal\.com)/.test(u.hostname), (r) => r.abort());
  for (const p of paths) {
    const page = await ctx.newPage();
    const errors = [];
    const failed = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
    page.on("pageerror", (e) => errors.push(`pageerror: ${String(e.message).slice(0, 200)}`));
    page.on("response", (r) => r.url().startsWith(base) && r.status() >= 400 && failed.push(`${r.status()} ${r.url().replace(base, "")}`));
    page.on("requestfailed", (r) => r.url().startsWith(base) && failed.push(`failed ${r.url().replace(base, "")}`));
    let res;
    try {
      res = await page.goto(base + p, { waitUntil: "load", timeout: 30_000 });
      // Scroll through so lazy images load, then back to the top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
    } catch (e) {
      errors.push(`load: ${e.message.slice(0, 120)}`);
    }
    const found = await page.evaluate(inspect, v.isMobile).catch((e) => ({ error: e.message }));
    const vitals = await page.evaluate(() => ({ cls: +window.__cls.toFixed(3), lcp: Math.round(window.__lcp) })).catch(() => ({}));
    const slug = (p.replace(/\//g, "_") || "_") + "-" + v.name;
    await page.screenshot({ path: path.join(OUT, "shots", `${slug}.jpg`), quality: 60, type: "jpeg" }).catch(() => {});
    const row = { path: p, view: v.name, status: res?.status(), errors: [...new Set(errors)].filter((e) => !/net::ERR_FAILED|blocked by client/.test(e)).slice(0, 8), failed: [...new Set(failed)], ...found, ...vitals };
    const issues = [row.status !== 200 && `status ${row.status}`, row.errors.length && `${row.errors.length} errors`, row.failed.length && `${row.failed.length} failed`, row.overflow > 1 && `overflow ${row.overflow}px`, row.h1 !== 1 && `h1×${row.h1}`, row.blurry?.length && `${row.blurry.length} blurry`, row.contrast?.length && `${row.contrast.length} contrast`, row.tap?.length && `${row.tap.length} tap`, row.cls > 0.1 && `CLS ${row.cls}`].filter(Boolean);
    console.log(`${v.name.padEnd(7)} ${p.padEnd(44)} ${issues.join(", ") || "ok"}`);
    report.push(row);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(`\nReport: ${path.join(OUT, "report.json")}`);
