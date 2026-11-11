// Google Performance Max landscape graphics (1200x628) in the same look as the Meta tech ads, but business-only:
// Google bans consumer tech-support ads, so no repair/fix/home/device words, and the copy matches the
// /business-tech-setup-tampa offer and prices. Half the frame is the real (client-name-blurred) office photo,
// because PMax ranks photos above text graphics and limits images with heavy overlaid text.
// Run: node ads/google/pmax-business.mjs && node ads/google/pmax-graphic.mjs   -> ads/google/out/
// Live in PMax since 2026-11-10: office-ready-day-one-landscape.jpg, office-vs-diy-landscape.jpg (+ office-before-after-landscape.jpg).
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = resolve(here, "out");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const nm = (p) => `file://${root}/node_modules/${p}`;
const W = 1200;
const H = 628;

const PHOTO = `file://${out}/office-after-portrait.jpg`; // made by pmax-business.mjs, monitor already blurred
const LOGO = `file://${root}/public/img/brand/ceo-turbo-logo.png`;

const CSS = `
@font-face{font-family:Inter;src:url(${nm("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Grot;src:url(${nm("@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2")}) format("woff2");font-weight:300 700}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,sans-serif;color:#fff;background:#0b0f17;position:relative;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;background:radial-gradient(700px 460px at 18% 0%,rgba(255,122,26,.30),transparent 62%),radial-gradient(600px 420px at 60% 110%,rgba(56,189,248,.14),transparent 60%),#0b0f17}
.photo{position:absolute;top:0;right:0;width:520px;height:${H}px;background:url(${PHOTO}) 35% 22%/auto 128%}
.fade{position:absolute;top:0;right:440px;width:120px;height:${H}px;background:linear-gradient(90deg,#0b0f17,rgba(11,15,23,0))}
.copy{position:absolute;left:56px;top:52px;width:600px;height:${H - 104}px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:22px}
.brand img{width:52px;height:52px;object-fit:contain}
h1{font-family:Grot,Inter,sans-serif;font-weight:700;letter-spacing:-.03em;line-height:1;font-size:64px;margin-top:22px}
.or{color:#ff8a2a}
.list{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.item{background:rgba(255,138,42,.12);border:2px solid rgba(255,138,42,.45);border-radius:16px;padding:14px 16px;font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;white-space:nowrap}
.item span{color:#4ade80}
.foot{display:flex;align-items:flex-end;justify-content:space-between}
.mu{color:#a8b3c7;font-size:20px;font-weight:600}
.price{font-family:Grot,sans-serif;font-weight:700;letter-spacing:-.03em;font-size:46px;line-height:1}

.vs{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px}
.vh{font-size:19px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#a8b3c7}
.no{background:#1a1f2b;border-radius:14px;padding:14px 18px;font-size:25px;font-weight:600;color:#a8b3c7;display:flex;gap:10px;align-items:center;white-space:nowrap}
.no span{color:#ef4444}
.yes{background:rgba(255,138,42,.12);border:2px solid rgba(255,138,42,.45);border-radius:14px;padding:12px 18px;font-size:25px;font-weight:700;display:flex;gap:10px;align-items:center;white-space:nowrap}
.yes span{color:#4ade80}`;

const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;

/** "New office? Ready day one." Four things we set up, the per-desk price, the real desk photo on the right. */
const ready = `<div class="bg"></div><div class="photo"></div><div class="fade"></div>
<div class="copy">
  <div>
    <div class="brand"><img src="${LOGO}">CEO Turbo · Tampa Bay businesses</div>
    <h1>New office?<br><span class="or">Ready day one.</span></h1>
  </div>
  <div class="list">
    <div class="item"><span>✓</span>Workstations</div>
    <div class="item"><span>✓</span>Business Wi-Fi</div>
    <div class="item"><span>✓</span>Printers &amp; shared files</div>
    <div class="item"><span>✓</span>Microsoft 365</div>
  </div>
  <div class="foot">
    <div><div class="mu">Workstation setup</div><div class="price"><span class="or">$169</span> per desk</div></div>
    <div class="mu" style="text-align:right">Flat price in writing<br>before we start</div>
  </div>
</div>
`;

/** The Meta comparison ad, business version: doing the office setup yourself vs CEO Turbo. */
const rows = [
  ["A weekend lost to cables", "Desks ready day one"],
  ["Wi-Fi drops on day one", "Wi-Fi tested before we leave"],
  ["Printers no one can find", "Every printer shared"],
  ["A bill you find out later", "Flat price in writing"],
];
const compare = `<div class="bg"></div>
<div class="copy" style="width:1088px">
  <div>
    <div class="brand"><img src="${LOGO}">CEO Turbo · Tampa Bay businesses</div>
    <h1 style="font-size:60px">Office move? <span class="or">Skip the tech weekend.</span></h1>
  </div>
  <div class="vs">
    <div class="vh">Doing it yourself</div><div class="vh or">CEO Turbo</div>
    ${rows.map(([n, y]) => `<div class="no"><span>✕</span>${n}</div><div class="yes"><span>✓</span>${y}</div>`).join("")}
  </div>
</div>`;

const SCENES = { "office-ready-day-one-landscape.jpg": ready, "office-vs-diy-landscape.jpg": compare };

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
const tmp = mkdtempSync(resolve(tmpdir(), "pmax-graphic-"));
const sharp = (await import("sharp")).default;
for (const [name, body] of Object.entries(SCENES)) {
  const file = resolve(tmp, `${name}.html`);
  writeFileSync(file, page(body));
  const png = resolve(tmp, `${name}.png`);
  execFileSync(CHROME, [`--user-data-dir=${mkdtempSync(resolve(tmp, "p-"))}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--headless=new", "--allow-file-access-from-files", "--virtual-time-budget=3000", `--window-size=${W},${H}`, `--screenshot=${png}`, `file://${file}`], { stdio: "ignore" });
  await sharp(png).resize(W, H).jpeg({ quality: 92, mozjpeg: true }).toFile(resolve(out, name));
  console.log(`wrote ads/google/out/${name}`, `${W}x${H}`);
}
rmSync(tmp, { recursive: true, force: true });
