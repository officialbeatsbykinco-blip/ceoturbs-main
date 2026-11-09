// Meta image ads for tech repair around Tampa (lands on /computer-repair-tampa).
// Two sizes per concept:
//   1080x1350 (4:5)  Facebook + Instagram feed. Page name sits above the image and the CTA bar below it,
//                    so nothing covers the art; we still keep 60px margins.
//   1080x1920 (9:16) Stories + Reels. Meta covers the top ~14% (profile name, progress bar), the bottom
//                    ~35% (caption, page name, CTA button) and the right edge (like/comment/share icons).
//                    All text and key art stay inside x 70..940, y 290..1240. The rest is background only.
// Run: node ads/meta/tech.mjs          (add --guides to also write *-guides.png with the safe zone drawn)
// Copy rules: real prices from content/pricing.ts, no "guaranteed", no "#1", no fake reviews or star counts.
import { mkdirSync, mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(here, "out");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const nm = (p) => `file://${root}/node_modules/${p}`;
const asset = (p) => `file://${root}/public/${p}`;
const GUIDES = process.argv.includes("--guides");

const PHONE = "(678) 558-4327";

const css = `
@font-face{font-family:Inter;src:url(${nm("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Grot;src:url(${nm("@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2")}) format("woff2");font-weight:300 700}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;color:#fff;background:#0b0f17;position:relative;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;background:radial-gradient(1100px 700px at 50% 0%,rgba(255,122,26,.28),transparent 60%),radial-gradient(900px 700px at 100% 100%,rgba(56,189,248,.16),transparent 60%),#0b0f17}
.safe{position:absolute;display:flex;flex-direction:column}
h1{font-family:Grot,Inter,sans-serif;font-weight:700;letter-spacing:-.03em;line-height:.98}
.or{color:#ff8a2a}.bl{color:#7dd3fc}.mu{color:#a8b3c7}
.chips{display:flex;flex-wrap:wrap;gap:14px}
.chip{border:2px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);border-radius:999px;padding:14px 24px;font-weight:600;font-size:30px;white-space:nowrap}
.chip b{color:#ffb070}
.btn{display:inline-flex;align-items:center;gap:14px;background:linear-gradient(180deg,#ff9a3c,#ff6a00);color:#1a0d00;font-weight:800;font-size:40px;border-radius:22px;padding:26px 40px;box-shadow:0 14px 40px rgba(255,106,0,.35)}
.brand{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px}
.brand img{width:62px;height:62px;border-radius:14px}
.price{font-family:Grot,sans-serif;font-weight:700;letter-spacing:-.04em;line-height:.9}
.guide{position:absolute;border:4px dashed #22ff88;pointer-events:none}
.cover{position:absolute;background:rgba(255,0,80,.28);pointer-events:none}
`;

// ---------- scenes. Each gets the safe box {x,y,w,h} and a size tag. ----------

/** A: pain + price. A stuck loading bar, "don't buy a new one", speed-up from $149. */
const slow = (b, tall) => `
<div class="safe" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;justify-content:space-between">
  <div>
    <div class="brand"><img src="${asset("img/brand/ceo-turbo-logo.png")}">CEO Turbo · Tampa Bay</div>
    <h1 style="font-size:${tall ? 118 : 112}px;margin-top:${tall ? 34 : 30}px">Slow computer?<br><span class="or">Don't buy a new one.</span></h1>
  </div>
  <div style="background:#121826;border:2px solid rgba(255,255,255,.1);border-radius:30px;padding:34px 36px">
    <div style="display:flex;justify-content:space-between;font-size:30px;font-weight:600" class="mu"><span>Starting Windows…</span><span>12%</span></div>
    <div style="height:26px;border-radius:99px;background:#1f2738;margin-top:18px;overflow:hidden"><div style="width:12%;height:100%;background:#ef4444;border-radius:99px"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:30px;font-weight:600;margin-top:30px"><span>After our speed-up</span><span style="color:#4ade80">Ready</span></div>
    <div style="height:26px;border-radius:99px;background:#1f2738;margin-top:18px;overflow:hidden"><div style="width:100%;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);border-radius:99px"></div></div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px">
    <div>
      <div class="mu" style="font-size:32px;font-weight:600">Speed-up at your door</div>
      <div class="price" style="font-size:${tall ? 150 : 140}px">from <span class="or">$149</span></div>
    </div>
  </div>
  <div class="chips">
    <span class="chip">Price before we start</span><span class="chip">No fix, <b>no charge</b></span><span class="chip">Call or text ${PHONE}</span>
  </div>
</div>`;

/** B: the text-message ad. Shows exactly what the landing page does: tap answers, text, get a price. */
const text = (b, tall) => `
<div class="safe" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;justify-content:space-between">
  <h1 style="font-size:${tall ? 96 : 92}px">Text us what's broken.<br><span class="or">Get a price in minutes.</span></h1>
  <div>
  <div class="mu" style="font-size:28px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px">How it works</div>
  <div style="background:#f2f2f7;border-radius:40px;padding:30px 30px 34px;color:#111;font-family:-apple-system,Inter,sans-serif">
    <div style="display:flex;align-items:center;gap:18px;padding-bottom:22px;border-bottom:2px solid #dcdce2">
      <img src="${asset("img/brand/christopher-robinson.webp")}" style="width:78px;height:78px;border-radius:50%;object-fit:cover">
      <div><div style="font-weight:700;font-size:32px">Chris · CEO Turbo</div><div style="font-size:24px;color:#6b6b75">Tampa tech repair</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:24px;font-size:36px;line-height:1.28">
      <div style="align-self:flex-end;max-width:80%;background:#0a84ff;color:#fff;padding:18px 26px;border-radius:30px 30px 8px 30px">Hi Chris, my Windows laptop won't turn on. Can you come to me? I'm in Brandon.</div>
      <div style="align-self:flex-start;max-width:84%;background:#e5e5ea;padding:18px 26px;border-radius:30px 30px 30px 8px">Yes, I can come today. Diagnosis is $79 and it comes off the repair. Most fixes start at $149.</div>
      <div style="align-self:flex-end;max-width:70%;background:#0a84ff;color:#fff;padding:18px 26px;border-radius:30px 30px 8px 30px">Perfect, see you then 👍</div>
    </div>
  </div>
  </div>
  <div class="chips">
    <span class="chip">We come to you · <b>40 mi of Tampa</b></span><span class="chip">Pay after it works</span>
  </div>
</div>`;

/** C: us vs the store. No competitor names, no competitor prices, only how it works. */
const compare = (b, tall) => {
  const row = (l, r) => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
    <div style="background:#1a1f2b;border-radius:20px;padding:22px 24px;font-size:31px;font-weight:600;color:#a8b3c7;display:flex;gap:14px"><span style="color:#ef4444">✕</span>${l}</div>
    <div style="background:rgba(255,138,42,.12);border:2px solid rgba(255,138,42,.45);border-radius:20px;padding:22px 24px;font-size:31px;font-weight:700;display:flex;gap:14px"><span style="color:#4ade80">✓</span>${r}</div></div>`;
  return `
<div class="safe" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;justify-content:space-between">
  <div>
    <div class="brand"><img src="${asset("img/brand/ceo-turbo-logo.png")}">CEO Turbo · Tampa Bay</div>
    <h1 style="font-size:${tall ? 104 : 100}px;margin-top:28px">Broken computer?<br><span class="or">Skip the drive.</span></h1>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;font-size:26px;font-weight:800;letter-spacing:.08em;text-transform:uppercase"><span class="mu">Repair store</span><span class="or">CEO Turbo</span></div>
    ${row("Unplug it, drive it in", "We come to your door")}
    ${row("Leave it for days", "Usually same or next day")}
    ${row("Find out the price later", "Price before we start")}
    ${row("Wait in line at the counter", "No fix, no charge")}
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:20px">
    <div><div class="mu" style="font-size:30px;font-weight:600">Diagnosis</div><div class="price" style="font-size:110px">$79</div><div class="mu" style="font-size:26px;font-weight:600">credited to the repair</div></div>
    <div style="text-align:right"><div class="mu" style="font-size:28px;font-weight:600">Call or text</div><div style="font-size:46px;font-weight:800">${PHONE}</div></div>
  </div>
</div>`;
};

const SCENES = { slow, text, compare };

// Safe boxes. Feed: 60px margins. Reels/Stories: top 290, bottom 1240 (1920-680), right edge clear of icons.
const SIZES = {
  feed: { w: 1080, h: 1350, box: { x: 64, y: 64, w: 952, h: 1222 } },
  story: { w: 1080, h: 1920, box: { x: 70, y: 290, w: 870, h: 950 } },
};

const Z = 0.78; // story content scale: feed-sized layout shrunk to fit the Reels safe box

function html(scene, size) {
  const s = SIZES[size];
  const tall = size === "story";
  const box = tall ? { x: s.box.x / Z, y: s.box.y / Z, w: s.box.w / Z, h: s.box.h / Z } : s.box;
  const guides = GUIDES
    ? `<div class="guide" style="left:${s.box.x}px;top:${s.box.y}px;width:${s.box.w}px;height:${s.box.h}px"></div>` +
      (tall
        ? `<div class="cover" style="left:0;top:0;width:1080px;height:270px"></div><div class="cover" style="left:0;top:1250px;width:1080px;height:670px"></div><div class="cover" style="left:960px;top:270px;width:120px;height:980px"></div>`
        : "")
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>:root{--w:${s.w}px;--h:${s.h}px}${css}</style></head>
<body><div class="bg"></div><div style="${tall ? `zoom:${Z}` : ""}">${SCENES[scene](box, false)}</div>${guides}</body></html>`;
}

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(resolve(tmpdir(), "tech-ads-"));
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
for (const scene of Object.keys(SCENES)) {
  if (only.length && !only.includes(scene)) continue;
  for (const size of Object.keys(SIZES)) {
    const { w, h } = SIZES[size];
    const page = resolve(tmp, `${scene}-${size}.html`);
    writeFileSync(page, html(scene, size));
    const name = `meta-tech-${scene}-${w}x${h}${GUIDES ? "-guides" : ""}.png`;
    const png = resolve(out, name);
    const profile = mkdtempSync(resolve(tmp, "p-"));
    execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--allow-file-access-from-files", "--virtual-time-budget=3000", `--window-size=${w},${h}`, `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
    console.log("wrote", name);
  }
}
rmSync(tmp, { recursive: true, force: true });
