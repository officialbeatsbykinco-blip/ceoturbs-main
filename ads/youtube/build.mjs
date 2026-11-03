// Builds the YouTube / Google Demand Gen image ads for the NFC review card.
// Each concept is an HTML page rendered to PNG/JPG with headless Chrome.
// Sizes follow Google's Demand Gen image specs: 1200x628, 1200x1200, 960x1200, 1080x1920 (under 5 MB).
// Run: npm run ads:image
import { mkdirSync, mkdtempSync, copyFileSync, writeFileSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { standHtml } from "./stand.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const build = resolve(here, ".build");
const out = resolve(here, "out");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SIZES = {
  wide: { w: 1200, h: 628 },
  square: { w: 1200, h: 1200 },
  tall45: { w: 960, h: 1200 },
  story: { w: 1080, h: 1920 },
};

// Copy: no "guaranteed", "#1", "rank higher", "by Google", no review incentives, no invented review counts.
const CONCEPTS = {
  combo: {
    img: "combo.png",
    composite: true,
    generated: true,
    sc: 1.15,
    nomask: true,
    theme: "white",
    kicker: "Stand + 2 tap cards",
    head: ["The counter", "combo."],
    sub: "A stand for the counter, two cards for the truck, chair or second spot.",
    price: "Kit $54.99",
    chips: ["Save $4.99 vs separate", "NFC + QR stand", "2 tap cards"],
    cta: "Get the combo",
  },
  stand: {
    img: "stand-hd.png",
    nomask: true,
    generated: true,
    theme: "sky",
    kicker: "Google review counter stand",
    head: ["Your counter", "asks for you."],
    sub: "Customers tap their phone or scan the QR code and your Google review page opens.",
    price: "From $29.99",
    chips: ["NFC + QR in one", "Acrylic L-stand", "Kit with 2 cards $54.99"],
    cta: "Get the stand",
  },
  tap: {
    img: "shop-tap.jpg",
    theme: "sky",
    kicker: "Google review cards",
    head: ["Tap.", "Review.", "Done."],
    sub: "Customers tap the card and your Google review page opens. No app, no typing.",
    price: "From $16.99",
    chips: ["Free US shipping", "iPhone + Android", "No monthly fee"],
    cta: "Get my cards",
  },
  later: {
    img: "shop-both.jpg",
    theme: "white",
    kicker: "Stop losing reviews",
    head: ["“I’ll review", "you later.”"],
    hl: "They won't.",
    sub: "Put a tap card at the register and ask while they are still smiling.",
    price: "From $16.99",
    chips: ["Free US shipping", "Pay once", "5-day returns"],
    cta: "Get my cards",
  },
  price: {
    img: "shop-both.jpg",
    theme: "white",
    kicker: "NFC Google review card",
    big: "$16.99",
    head: ["One card.", "More reviews."],
    sub: "Pay once. No subscription.",
    price: "",
    chips: ["Free US shipping", "iPhone + Android", "Ships fast"],
    cta: "Shop review cards",
  },
};

const css = (k, c) => `
@font-face{font-family:SG;src:url(assets/SpaceGrotesk.woff2);font-weight:300 700}
@font-face{font-family:IN;src:url(assets/Inter.woff2);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${SIZES[k].w}px;height:${SIZES[k].h}px;overflow:hidden}
body{font-family:IN,system-ui,sans-serif;position:relative;--u:${SIZES[k].w / 1000}px}
.sky{background:linear-gradient(135deg,#f4f7fc 0,#e0e8f3 100%);color:#0a1730}
.white{background:#fff;color:#0a1730}
.dark{background:radial-gradient(90% 70% at 80% 30%,#10263f 0,#070d16 70%);color:#fff}
h1,.big,.kicker,.cta,.price{font-family:SG,Inter,sans-serif}
.kicker{display:inline-block;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:#ff6a1f;color:#fff;border-radius:999px}
h1{font-weight:700;line-height:.95;letter-spacing:-.02em}
.hl{color:#ff6a1f}
.dark .hl{color:#fbbc04}
.sub{line-height:1.3;opacity:.85;font-weight:500}
.chips{display:flex;flex-wrap:wrap}
.chip{font-weight:700;border-radius:999px;background:rgba(10,23,48,.08);color:inherit}
.dark .chip{background:rgba(255,255,255,.12)}
.cta{display:inline-flex;align-items:center;font-weight:700;color:#fff;background:linear-gradient(180deg,#ff8a3d,#ff5a0a);border-radius:18px;box-shadow:0 10px 30px rgba(255,90,10,.45)}
.price{font-weight:700;color:#0a1730}
.dark .price{color:#fbbc04}
.card{position:absolute;object-fit:contain;-webkit-mask-image:linear-gradient(to right,transparent,#000 5%,#000 95%,transparent),linear-gradient(to bottom,transparent,#000 5%,#000 95%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 5%,#000 95%,transparent),linear-gradient(to bottom,transparent,#000 5%,#000 95%,transparent);mask-composite:intersect}
.txt{position:absolute;z-index:2}
.nm{-webkit-mask-image:none;mask-image:none;filter:drop-shadow(0 26px 30px rgba(8,20,45,.18))}
.big{font-weight:700;color:#ff6a1f;letter-spacing:-.03em;line-height:.9}
.stars{color:#fbbc04;letter-spacing:.08em}
.noglow .glow{display:none}
.cmp{filter:none!important}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(26,163,255,.10),transparent 65%)}
.logo{position:absolute;opacity:.9}
`;

function layout(k, c) {
  const { w, h } = SIZES[k];
  const headHtml = c.head.map((t, i) => `<div>${t}</div>`).join("");
  const sc = c.sc || 1;
  const hl = c.hl ? `<div class="hl">${c.hl}</div>` : "";
  const big = c.big ? `<div class="big" style="margin-top:${k === "wide" ? 18 : 10}px;font-size:${k === "wide" ? 138 : k === "story" ? 250 : 190}px">${c.big}</div>` : "";
  const chips = c.chips.map((t) => `<span class="chip">${t}</span>`).join("");
  const priceTag = c.price ? `<div class="price" style="font-size:${k === "wide" ? 38 : k === "story" ? 64 : 48}px;margin-top:${k === "wide" ? 14 : 22}px">${c.price}</div>` : "";
  let body = "";
  if (k === "wide") {
    body = `
    <div class="glow" style="width:620px;height:620px;right:-60px;top:-10px"></div>
    <img class="card ${c.nomask ? 'nm' : ''} ${c.composite ? 'cmp' : ''}" src="assets/${c.img}" style="right:-30px;top:-10px;width:648px;height:648px">
    <div style="position:absolute;left:56px;top:44px;width:620px">
      <span class="kicker" style="font-size:20px;padding:8px 18px">${c.kicker}</span>
      ${big}
      <h1 style="font-size:${c.big ? 64 : 98}px;margin-top:16px">${headHtml}${hl}</h1>
      ${priceTag}
      <p class="sub" style="font-size:25px;margin-top:14px;max-width:560px">${c.sub}</p>
      <div style="margin-top:20px"><span class="cta" style="font-size:30px;padding:16px 30px">${c.cta} →</span></div>
    </div>`;
  } else if (k === "square") {
    body = `
    <div class="glow" style="width:900px;height:900px;right:-160px;bottom:-120px"></div>
    <span class="kicker txt" style="left:64px;top:56px;font-size:26px;padding:10px 22px">${c.kicker}</span>
    <div class="txt" style="left:64px;top:128px;width:640px">
      ${big}
      <h1 style="font-size:${c.big ? 84 : c.hl ? 104 : 128}px;margin-top:6px">${headHtml}${hl}</h1>
      ${priceTag}
    </div>
    <img class="card ${c.nomask ? 'nm' : ''} ${c.composite ? 'cmp' : ''}" src="assets/${c.img}" style="right:${c.sc ? -10 : -40}px;bottom:${c.sc ? 15 : c.big ? 90 : 140}px;width:${740 * sc}px;height:${740 * sc}px">
    <div class="txt" style="left:64px;bottom:56px;right:64px;display:flex;align-items:center;justify-content:space-between;gap:24px">
      <div class="chips" style="gap:10px;max-width:560px">${chips.replace(/class="chip"/g, 'class="chip" style="font-size:22px;padding:10px 18px"')}</div>
      <span class="cta" style="font-size:36px;padding:22px 38px">${c.cta} →</span>
    </div>`;
  } else if (k === "tall45") {
    body = `
    <div class="glow" style="width:820px;height:820px;left:70px;top:420px"></div>
    <span class="kicker txt" style="left:56px;top:50px;font-size:24px;padding:10px 20px">${c.kicker}</span>
    <div class="txt" style="left:56px;top:116px;right:56px">
      ${big}
      <h1 style="font-size:${c.big ? 90 : 124}px;margin-top:6px">${headHtml}${hl}</h1>
    </div>
    <img class="card ${c.nomask ? 'nm' : ''} ${c.composite ? 'cmp' : ''}" src="assets/${c.img}" style="left:50%;margin-left:${-340 * sc}px;top:${c.big ? 430 : c.sc ? 390 : 480}px;width:${680 * sc}px;height:${680 * sc}px">
    <div class="txt" style="left:56px;right:56px;bottom:46px;display:flex;align-items:center;justify-content:space-between">
      <div class="price" style="font-size:52px">${c.price || "Free US shipping"}</div>
      <span class="cta" style="font-size:34px;padding:20px 34px">${c.cta} →</span>
    </div>`;
  } else {
    // story 9:16: keep text inside y 300-1520
    body = `
    <div class="glow" style="width:1100px;height:1100px;left:-10px;top:760px"></div>
    <span class="kicker txt" style="left:70px;top:320px;font-size:32px;padding:12px 26px">${c.kicker}</span>
    <div class="txt" style="left:70px;top:395px;right:70px">
      ${big}
      <h1 style="font-size:${c.big ? 112 : 150}px;margin-top:8px">${headHtml}${hl}</h1>
    </div>
    <img class="card ${c.nomask ? 'nm' : ''} ${c.composite ? 'cmp' : ''}" src="assets/${c.img}" style="left:50%;margin-left:${-370 * sc}px;top:${c.big ? 800 : c.sc ? 725 : 770}px;width:${740 * sc}px;height:${740 * sc}px">
    <div class="txt" style="left:70px;right:70px;top:1440px;display:flex;justify-content:center"><span class="cta" style="font-size:42px;padding:22px 46px">${c.cta} \u2192</span></div></div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${css(k, c)}</style><body class="${c.theme}${c.composite ? " noglow" : ""}">${body}</body>`;
}


const only = process.argv[2];
const profile = mkdtempSync(resolve(tmpdir(), "ads-chrome-"));
rmSync(build, { recursive: true, force: true });
mkdirSync(resolve(build, "assets"), { recursive: true });
mkdirSync(out, { recursive: true });
const fonts = resolve(root, "videos/ceoturbo-ads/assets/fonts");
copyFileSync(resolve(fonts, "SpaceGrotesk.woff2"), resolve(build, "assets/SpaceGrotesk.woff2"));
copyFileSync(resolve(fonts, "Inter.woff2"), resolve(build, "assets/Inter.woff2"));
for (const img of new Set(Object.values(CONCEPTS).filter((c) => !c.generated).map((c) => c.img))) copyFileSync(resolve(root, "public/img/review-cards", img), resolve(build, "assets", img));

const chromeShot = (page, png, w, h) =>
  execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
// Vector stand -> transparent PNG at 2x (2800x3200).
writeFileSync(resolve(build, "stand.html"), standHtml());
execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000", "--force-device-scale-factor=2", "--window-size=1200,1480", `--screenshot=${resolve(build, "assets/stand-hd.png")}`, `file://${resolve(build, "stand.html")}`], { stdio: "ignore" });
// Composite image: stand + both cards on white (multiply drops the card photo's white box).
copyFileSync(resolve(root, "public/img/review-cards/shop-both.jpg"), resolve(build, "assets/shop-both.jpg"));
writeFileSync(resolve(build, "combo.html"), `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:1600px;height:1000px;background:#fff;overflow:hidden;position:relative}img{position:absolute}.s{left:20px;top:30px;width:780px}.c{left:770px;top:130px;width:830px;mix-blend-mode:multiply}</style><img class="s" src="assets/stand-hd.png"><img class="c" src="assets/shop-both.jpg">`);
chromeShot(resolve(build, "combo.html"), resolve(build, "assets/combo.png"), 1600, 1000);

for (const [name, c] of Object.entries(CONCEPTS)) {
  if (only && only !== name) continue;
  for (const [k, { w, h }] of Object.entries(SIZES)) {
    const page = resolve(build, `${name}-${k}.html`);
    writeFileSync(page, layout(k, c));
    const png = resolve(out, `review-card-${name}-${k}-${w}x${h}.png`);
    execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
    const hd = resolve(out, "hd", `review-card-${name}-${k}-${w * 2}x${h * 2}.png`);
    mkdirSync(resolve(out, "hd"), { recursive: true });
    execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${w},${h}`, `--screenshot=${hd}`, `file://${page}`], { stdio: "ignore" });
    console.log("  hd", hd.replace(root + "/", ""), (statSync(hd).size / 1048576).toFixed(2) + " MB");
    console.log(png.replace(root + "/", ""), (statSync(png).size / 1024).toFixed(0) + " KB");
  }
}
