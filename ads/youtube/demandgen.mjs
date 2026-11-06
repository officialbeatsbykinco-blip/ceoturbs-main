// YouTube Demand Gen image ads, round 2: five story-driven scenes for the NFC review card.
// Each scene is drawn on a 900x900 stage and dropped into the three Demand Gen image sizes
// (1200x628 landscape, 1200x1200 square, 960x1200 portrait), then rendered with headless Chrome.
// Run: npm run ads:demandgen  (or: node ads/youtube/demandgen.mjs receipt)
import { mkdirSync, mkdtempSync, copyFileSync, writeFileSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const build = resolve(here, ".build-dg");
const out = resolve(here, "out/demandgen");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SIZES = { wide: [1200, 628], square: [1200, 1200], tall45: [960, 1200] };

// Copy rules: no "guaranteed", "#1", "rank higher", no review incentives, no invented customer results.
// Shop names, receipts and review counts in the scenes are illustrations, not claims about real shops.

const G = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.620 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.570-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.160 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

/** The tap card, with NFC waves beside it. */
const card = (x, y, w, rot, waves = true) => `
<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.45}px;transform:rotate(${rot}deg);--k:${w / 250}">
  <div class="c1">Review Us On</div><div class="c2">Google</div>
  <div class="cg">${G}</div>
  <div class="c3">TAP WITH YOUR PHONE</div><div class="c4">★★★★★</div>
</div>
${waves ? `<div class="waves" style="left:${x + w + 4}px;top:${y + w * 0.4}px;font-size:${w * 0.36}px">)))</div>` : ""}`;

const row = (name, rating, count, stars, hot) => `
<div class="row ${hot ? "hot" : "dim"}">
  <div class="thumb">🍕</div>
  <div><div class="nm">${name}</div>
  <div class="rt">${rating} <span class="st">${"★".repeat(stars)}<i>${"★".repeat(5 - stars)}</i></span> <span class="ct">(${count})</span></div>
  <div class="meta">Pizza · $$ · <b>Open</b> · 0.4 mi</div></div>
  ${hot ? `<div class="dir">Call</div>` : ""}
</div>`;

const SCENES = {
  // Same product, same street: the one with reviews gets the call.
  gino: {
    bg: "light",
    kicker: "Who gets the call?",
    head: ["Same pizza.", "<span class=or>They picked</span>", "<span class=or>the one with reviews.</span>"],
    scene: `
      <div class="search">🔍&nbsp; pizza near me</div>
      <div style="position:absolute;left:40px;right:40px;top:150px">
        ${row("Mario's Pizza", "4.1", "23", 4, false)}
        ${row("Gino's Pizza", "4.8", "847", 5, true)}
      </div>
      <div class="hand" style="left:700px;top:405px">👆</div>
      ${card(610, 545, 190, 8)}
      <div class="ill">Illustration</div>`,
  },

  // The broken promise every service business has heard.
  thread: {
    bg: "white",
    kicker: "Every business has heard this",
    head: ["“I’ll review you", "tonight!”", "<span class=or>They didn’t.</span>"],
    scene: `
      <div class="phone">
        <div class="pt"><div class="av">JM</div><div class="pw">Jess · Tuesday job ›</div></div>
        <div class="tm"><b>Tue</b> 4:12 PM</div>
        <div class="bub in" style="top:200px">omg it looks AMAZING 😍😍</div>
        <div class="bub in" style="top:300px">I’ll 100% leave you a review tonight!!</div>
        <div class="bub out" style="top:430px">Thank you!! 🙏</div>
        <div class="rd"><b>Read</b> 3 weeks ago</div>
        <div class="crick">🦗</div>
      </div>`,
  },

  // A receipt: they paid, they tipped, the review line never printed.
  receipt: {
    bg: "dark",
    kicker: "Happy customer. Zero reviews.",
    head: ["They paid.", "They tipped.", "<span class=ye>They never reviewed.</span>"],
    scene: `
      <div class="rc">
        <div class="rh">MIKE’S CUTS</div>
        <div class="rs">Thank you, come again!</div>
        <div class="rl"><span>Skin fade</span><span>$35.00</span></div>
        <div class="rl"><span>Beard trim</span><span>$15.00</span></div>
        <div class="rl"><span>Tip 😊</span><span>$10.00</span></div>
        <div class="rl tot"><span>TOTAL</span><span>$60.00</span></div>
        <div class="rl miss"><span>Google review</span><span>✗</span></div>
        <div class="bar">||| || ||| | |||| || | ||| ||</div>
      </div>
      ${card(600, 440, 210, 10)}
      <div class="ill" style="color:#9fb0c8">Illustration</div>`,
  },

  // Five steps lose the review; one tap gets it.
  steps: {
    bg: "sky",
    kicker: "Why customers never review you",
    head: ["5 steps loses it.", "<span class=or>1 tap gets it.</span>"],
    scene: `
      <div class="st5">
        <div><b>1</b>Open Google</div>
        <div><b>2</b>Search your business</div>
        <div><b>3</b>Find your listing</div>
        <div><b>4</b>Scroll to reviews</div>
        <div><b>5</b>Remember it later</div>
      </div>
      <div class="vs">vs</div>
      ${card(560, 120, 250, 6)}
      <div class="tag1">1 tap ✓</div>`,
  },

  // The real product photo: a customer tapping the card at the counter.
  photo: {
    bg: "dark",
    kicker: "Stop asking. Start handing.",
    head: ["I stopped asking", "for Google reviews.", "<span class=ye>I hand them this.</span>"],
    scene: `
      <img class="ph" src="assets/card-tap.webp">
      <div class="burst">One tap.<br>Review page opens.</div>`,
  },
};

const css = (w, h) => `
@font-face{font-family:SG;src:url(assets/SpaceGrotesk.woff2);font-weight:300 700}
@font-face{font-family:IN;src:url(assets/Inter.woff2);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:IN,system-ui,sans-serif;position:relative;color:#0a1730}
.light{background:#edf1f7}.white{background:linear-gradient(#fff,#eef2f8)}.sky{background:linear-gradient(135deg,#f4f7fc,#dde6f2)}
.dark{background:radial-gradient(110% 80% at 70% 20%,#1d3456 0,#0a1424 60%,#05080f 100%);color:#fff}
.or{color:#ff6a1f}.ye{color:#fbbc04}
.txt{position:absolute;z-index:3}
.kicker{display:inline-block;font-family:SG;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:#ff6a1f;color:#fff;border-radius:999px}
h1{font-family:SG;font-weight:700;line-height:.98;letter-spacing:-.025em}
.offer{display:flex;align-items:center;justify-content:space-between;gap:20px}
.price{font-family:SG;font-weight:700;line-height:1}
.dark .price{color:#fbbc04}
.fine{opacity:.75;font-weight:600;margin-top:6px}
.cta{font-family:SG;font-weight:700;color:#fff;background:linear-gradient(180deg,#ff8a3d,#ff5a0a);border-radius:18px;box-shadow:0 12px 34px rgba(255,90,10,.45);white-space:nowrap}
.stage{position:absolute;width:900px;height:900px;transform-origin:0 0}
.stage>*{position:absolute}
.ill{right:24px;bottom:14px;font-size:20px;color:#8a93a3}
.card{background:#fafaf8;border-radius:calc(22px*var(--k));box-shadow:0 30px 60px rgba(0,0,0,.35);text-align:center;color:#1b1d22;padding-top:calc(34px*var(--k));font-family:Helvetica,Arial,sans-serif;z-index:2}
.c1{font-size:calc(22px*var(--k));font-weight:600}.c2{font-size:calc(42px*var(--k));font-weight:700;letter-spacing:-.02em;line-height:1}
.cg{width:calc(118px*var(--k));height:calc(118px*var(--k));margin:calc(22px*var(--k)) auto calc(18px*var(--k))}.cg svg{width:100%;height:100%}
.c3{font-size:calc(11px*var(--k));font-weight:800;letter-spacing:.04em}.c4{color:#fbbc04;font-size:calc(26px*var(--k));letter-spacing:.06em;margin-top:calc(8px*var(--k))}
.waves{color:#1aa3ff;font-weight:300;letter-spacing:-.25em;z-index:2}
/* gino */
.search{left:40px;right:40px;top:40px;background:#fff;border-radius:999px;padding:24px 34px;font-size:36px;box-shadow:0 6px 20px rgba(10,23,48,.08)}
.row{position:relative;display:flex;gap:28px;align-items:center;border-radius:28px;padding:28px;margin-bottom:24px;background:#fff}
.row.dim{opacity:.5;background:#f6f7f9}.row.hot{border:5px solid #1a73e8;box-shadow:0 14px 40px rgba(26,115,232,.25)}
.thumb{width:140px;height:140px;border-radius:20px;display:grid;place-items:center;font-size:70px;background:linear-gradient(135deg,#f2a25a,#c9552a)}
.dim .thumb{background:#ccc;filter:grayscale(1)}
.nm{font-size:46px;font-weight:800;letter-spacing:-.02em}.rt{font-size:38px;font-weight:700;margin-top:4px}
.st{color:#fbbc04}.st i{color:#d8dce3;font-style:normal}.ct{font-weight:400;opacity:.7}
.meta{font-size:28px;opacity:.7;margin-top:6px}.meta b{color:#188038}
.dir{position:absolute;right:30px;top:30px;background:#1a73e8;color:#fff;font-size:28px;font-weight:700;border-radius:999px;padding:12px 30px}
.hand{font-size:96px;z-index:3}
/* thread */
.phone{left:110px;top:20px;width:680px;height:860px;border-radius:70px;background:#fff;border:14px solid #0a1730;box-shadow:0 30px 70px rgba(10,23,48,.25);overflow:hidden}
.phone>*{position:absolute}
.pt{left:0;right:0;top:0;height:150px;background:#f5f5f7;border-bottom:1px solid #e3e3e8;text-align:center;padding-top:22px}
.av{width:72px;height:72px;border-radius:50%;margin:0 auto;background:linear-gradient(#a7adb7,#868c97);color:#fff;font-size:30px;font-weight:700;display:grid;place-items:center}
.pw{font-size:24px;margin-top:8px}
.tm{top:160px;width:100%;text-align:center;font-size:22px;color:#8a8a8e}
.bub{font-size:34px;line-height:1.25;padding:20px 28px;border-radius:34px;max-width:520px}
.in{left:30px;background:#e9e9eb}.out{right:30px;background:#0a84ff;color:#fff}
.rd{right:40px;top:530px;font-size:24px;color:#8a8a8e}
.crick{left:50%;margin-left:-60px;top:610px;font-size:120px;opacity:.9}
/* receipt */
.rc{left:90px;top:30px;width:520px;height:840px;background:#fbfaf6;color:#222;font-family:"Courier New",monospace;padding:50px 46px;transform:rotate(-4deg);box-shadow:0 30px 70px rgba(0,0,0,.5);clip-path:polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)}
.rh{font-size:46px;font-weight:700;text-align:center;letter-spacing:.06em}
.rs{font-size:22px;text-align:center;margin:10px 0 40px;opacity:.7}
.rl{display:flex;justify-content:space-between;font-size:32px;padding:16px 0;border-bottom:2px dashed #ccc}
.tot{font-weight:700;border-bottom:4px double #333}
.miss{position:relative;color:#c5221f;font-weight:700;margin-top:34px;border:none}
.miss::after{content:"";position:absolute;left:-40px;right:-30px;top:-22px;bottom:-22px;border:7px solid #e53935;border-radius:50%;transform:rotate(-1.5deg)}
.bar{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:44px;letter-spacing:-.1em;opacity:.8}
/* steps */
.st5{left:20px;top:60px;width:450px;display:flex;flex-direction:column;gap:20px}
.st5 div{position:relative;font-size:31px;font-weight:600;background:#fff;border-radius:22px;padding:22px 24px;color:#7a8394;box-shadow:0 6px 18px rgba(10,23,48,.06)}
.st5 div::after{content:"";position:absolute;left:18px;right:18px;top:50%;height:5px;background:#e53935;border-radius:3px;transform:rotate(-2deg)}
.st5 b{display:inline-grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#e7ebf1;color:#7a8394;margin-right:16px;font-size:26px}
.vs{left:482px;top:330px;font-family:SG;font-size:54px;font-weight:700;color:#ff6a1f}
.tag1{left:590px;top:540px;font-family:SG;font-size:58px;font-weight:700;color:#fff;background:#188038;border-radius:20px;padding:12px 28px;transform:rotate(-4deg);box-shadow:0 14px 34px rgba(24,128,56,.35);z-index:3}
/* photo */
.ph{left:0;top:0;width:900px;height:900px;object-fit:cover;border-radius:40px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.burst{left:40px;top:40px;font-family:SG;font-size:50px;font-weight:700;line-height:1.05;color:#0a1730;background:#fbbc04;border-radius:24px;padding:22px 30px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
`;

/** Places the 900x900 stage and the text for one size. */
function page(k, s) {
  const [w, h] = SIZES[k];
  const head = s.head.map((t) => `<div>${t}</div>`).join("");
  let stage, text;
  const offer = (pf, cf, pad) => `
    <div class="offer"><div><div class="price" style="font-size:${pf}px">$16.99</div><div class="fine" style="font-size:${pf * 0.42}px">Pay once · free US shipping</div></div>
    <span class="cta" style="font-size:${cf}px;padding:${pad}">Get my card →</span></div>`;
  if (k === "wide") {
    const sc = 0.62;
    stage = `left:${w - 900 * sc - 30}px;top:${(h - 900 * sc) / 2}px;transform:scale(${sc})`;
    text = `<div class="txt" style="left:48px;top:44px;width:580px;height:${h - 88}px;display:flex;flex-direction:column;justify-content:space-between">
      <div><span class="kicker" style="font-size:19px;padding:8px 16px">${s.kicker}</span>
      <h1 style="font-size:58px;margin-top:18px">${head}</h1></div>
      ${offer(52, 28, "16px 26px")}</div>`;
  } else if (k === "square") {
    const sc = 0.72;
    stage = `left:${(w - 900 * sc) / 2}px;top:400px;transform:scale(${sc})`;
    text = `<div class="txt" style="left:64px;top:52px;right:64px"><span class="kicker" style="font-size:24px;padding:10px 20px">${s.kicker}</span>
      <h1 style="font-size:84px;margin-top:20px">${head}</h1></div>
      <div class="txt" style="left:64px;right:64px;bottom:44px">${offer(64, 36, "20px 34px")}</div>`;
  } else {
    const sc = 0.74;
    stage = `left:${(w - 900 * sc) / 2}px;top:400px;transform:scale(${sc})`;
    text = `<div class="txt" style="left:52px;top:48px;right:52px"><span class="kicker" style="font-size:22px;padding:10px 18px">${s.kicker}</span>
      <h1 style="font-size:74px;margin-top:18px">${head}</h1></div>
      <div class="txt" style="left:52px;right:52px;bottom:40px">${offer(60, 34, "18px 30px")}</div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${css(w, h)}</style><body class="${s.bg}">${text}<div class="stage" style="${stage}">${s.scene}</div></body>`;
}

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
const only = process.argv[2];
const profile = mkdtempSync(resolve(tmpdir(), "dg-chrome-"));
rmSync(build, { recursive: true, force: true });
mkdirSync(resolve(build, "assets"), { recursive: true });
mkdirSync(out, { recursive: true });
const fonts = resolve(root, "videos/ceoturbo-ads/assets/fonts");
copyFileSync(resolve(fonts, "SpaceGrotesk.woff2"), resolve(build, "assets/SpaceGrotesk.woff2"));
copyFileSync(resolve(fonts, "Inter.woff2"), resolve(build, "assets/Inter.woff2"));
copyFileSync(resolve(root, "public/img/review-cards/hd/card-tap-1600.webp"), resolve(build, "assets/card-tap.webp"));

for (const [name, s] of Object.entries(SCENES)) {
  if (only && only !== name) continue;
  for (const [k, [w, h]] of Object.entries(SIZES)) {
    const html = resolve(build, `${name}-${k}.html`);
    writeFileSync(html, page(k, s));
    const png = resolve(out, `dg-${name}-${k}-${w}x${h}.png`);
    execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${w},${h}`, "--virtual-time-budget=3000", `--screenshot=${png}`, `file://${html}`], { stdio: "ignore" });
    console.log(png.replace(root + "/", ""), (statSync(png).size / 1024).toFixed(0) + " KB");
  }
}
rmSync(profile, { recursive: true, force: true });
