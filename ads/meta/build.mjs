// Builds the Meta (Facebook + Instagram) feed image ads for the NFC review card.
// 1080x1350 (4:5) is the size Meta's feed shows biggest on a phone. Each ad is an HTML page
// rendered to PNG with headless Chrome. Copy for the ad fields lives in ads/meta/COPY.md.
// Run: npm run ads:meta  (or: node ads/meta/build.mjs gino)
import { mkdirSync, mkdtempSync, copyFileSync, writeFileSync, rmSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const build = resolve(here, ".build");
const out = resolve(here, "out");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const W = 1080;
const H = 1350;

// Copy rules: no "guaranteed", "#1", "rank higher", no review incentives, no invented customer results.
// Business names and review counts in the scenes are illustrations, not claims about real shops.

const G = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

/** The tap card, drawn so it stays crisp on dark and light backgrounds. */
const card = (x, y, w, rot) => `
<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.45}px;transform:rotate(${rot}deg);--k:${w / 250}">
  <div class="c1">Review Us On</div><div class="c2">Google</div>
  <div class="cg">${G}</div>
  <div class="c3">NFC</div><div class="c4">★★★★★</div>
</div>
<div class="waves" style="left:${x + w + 6}px;top:${y + w * 0.35}px;font-size:${w * 0.34}px">)))</div>`;

const shopRow = (name, rating, count, stars, dim) => `
<div class="row ${dim ? "dim" : "hot"}">
  <div class="thumb">🍕</div>
  <div><div class="nm">${name}</div>
  <div class="rt">${rating} <span class="st">${"★".repeat(stars)}<i>${"★".repeat(5 - stars)}</i></span> <span class="ct">(${count})</span></div>
  <div class="meta">Pizza · $$ · <b>Open</b> · 0.4 mi</div></div>
  ${dim ? "" : `<div class="dir">Directions</div><div class="hand">👆</div>`}
</div>`;

const cta = (label = "Shop now") => `<div class="cta">${label} →</div>`;

const ADS = {
  // The owner sees themself as Mario: same product, a fraction of the reviews.
  gino: `
<body class="light">
  <div class="pad" style="top:64px">
    <h1 style="font-size:96px">Same pizza.<br><span class="or">They picked Gino’s.</span></h1>
  </div>
  <div class="search">🔍&nbsp; pizza near me</div>
  <div style="position:absolute;left:60px;right:60px;top:430px">
    ${shopRow("Mario's Pizza", "4.1", "23", 4, true)}
    ${shopRow("Gino's Pizza", "4.8", "847", 5, false)}
  </div>
  <div class="band" style="top:880px">
    ${card(56, 50, 230, -7)}
    <div style="position:absolute;left:350px;top:52px;right:56px">
      <h2 style="font-size:60px">Mario has 23 reviews.<br><span class="ye">Be Gino.</span></h2>
      <p class="sub" style="margin-top:14px">One tap on this card opens your Google review page.</p>
    </div>
    <div class="foot" style="left:350px"><div><div class="price">$16.99</div><div class="fine">Free US shipping · pay once</div></div>${cta()}</div>
  </div>
</body>`,

  // The broken promise every service business has lived through.
  jess: `
<body class="white">
  <div class="thread-top"><div class="av">JM</div><div class="who">Jess (Tuesday job) ›</div></div>
  <div class="time"><b>Tue</b> 4:12 PM</div>
  <div class="bub in" style="top:270px">omg it looks AMAZING 😍😍</div>
  <div class="bub in" style="top:380px;max-width:700px">I’ll 100% leave you a review tonight!!</div>
  <div class="bub out" style="top:540px">Thank you!! Here’s the link if you get a sec 🙏</div>
  <div class="read"><b>Read</b> 3 weeks ago</div>
  <h1 class="pad" style="top:740px;font-size:150px;color:#0a1730">She didn’t.</h1>
  <div class="band" style="top:920px">
    ${card(800, -110, 210, 8)}
    <div style="position:absolute;left:56px;top:46px;width:700px">
      <h2 style="font-size:60px">Ask while they’re<br><span class="ye">still standing there.</span></h2>
      <p class="sub" style="margin-top:12px">They tap the card. Your review page opens. Done before they leave.</p>
    </div>
    <div class="foot"><div><div class="price">From $16.99</div><div class="fine">Free US shipping · no app · no monthly fee</div></div>${cta()}</div>
  </div>
</body>`,

  // Loss aversion: unhappy customers already review you; the happy ones are the ones you lose.
  mad: `
<body class="dark">
  <div class="clock">Saturday, 11:48 PM</div>
  <div class="note" style="top:118px"><div class="ic">★</div><div><div class="nt">NEW REVIEW <span>now</span></div><div class="ns">★<i>★★★★</i></div><div class="nq">“Waited 20 minutes and nobody said hi.”</div></div></div>
  <div class="note back" style="top:334px"><div class="ic">★</div><div><div class="nt">NEW REVIEW <span>2d ago</span></div><div class="ns">★<i>★★★★</i></div><div class="nq">“Rude on the phone. Never again.”</div></div></div>
  <div class="pad" style="top:560px;right:330px">
    <h1 style="font-size:96px;color:#fff">Angry customers review you on their own.</h1>
    <h2 style="font-size:66px;margin-top:26px" class="ye">Happy ones need a nudge.</h2>
  </div>
  ${card(790, 820, 210, 7)}
  <div class="foot" style="left:56px;right:56px;bottom:56px">
    <div><div class="fine" style="font-size:27px;opacity:.85">Most popular · 2 tap cards</div><div class="price" style="font-size:76px">$29.99</div><div class="fine">Pay once · iPhone + Android · free US shipping</div></div>${cta()}
  </div>
</body>`,

  // Price objection killer: review software is a monthly bill, this is a one-time buy.
  once: `
<body class="light">
  <div class="pad" style="top:70px">
    <h1 style="font-size:86px">More Google reviews.<br><span class="or">No monthly bill.</span></h1>
  </div>
  <div class="bill" style="top:330px">
    <div class="bl"><div class="bn">Review software</div><div class="bd">Texts, dashboards, contracts</div></div>
    <div class="br"><span class="strike">$$$ / month</span><br><small>every month</small></div>
  </div>
  <div class="bill hot" style="top:530px">
    <div class="bl"><div class="bn">CEO Turbo tap card</div><div class="bd">Customer taps. Review page opens.</div></div>
    <div class="br">$16.99<br><small>once</small></div>
  </div>
  <div class="band" style="top:880px">
    ${card(56, 50, 230, -7)}
    <div style="position:absolute;left:350px;top:56px;right:56px">
      <h2 style="font-size:60px">No app. No login.<br><span class="ye">Nothing to cancel.</span></h2>
      <p class="sub" style="margin-top:14px">Works with iPhone and Android.</p>
    </div>
    <div class="foot" style="left:350px"><div><div class="price">$16.99</div><div class="fine">Free US shipping · pay once</div></div>${cta()}</div>
  </div>
</body>`,
};

const css = `
@font-face{font-family:IN;src:url(assets/Inter.woff2);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:IN,system-ui,sans-serif;position:relative;color:#0a1730}
.light{background:#edf1f7}.white{background:#fff}
.dark{background:radial-gradient(120% 80% at 50% 0,#22385a 0,#0b1424 55%,#05080f 100%);color:#fff}
h1,h2{font-weight:800;letter-spacing:-.035em;line-height:1}
.or{color:#ff6a1f}.ye{color:#fbbc04}
.pad{position:absolute;left:60px;right:60px}
.sub{font-size:31px;line-height:1.3;opacity:.88;font-weight:500}
.fine{font-size:24px;opacity:.75;margin-top:4px}
.price{font-size:68px;font-weight:800;letter-spacing:-.03em;line-height:1}
.foot[style] .cta{font-size:38px;padding:22px 30px}
.cta{font-size:44px;font-weight:800;color:#fff;background:linear-gradient(180deg,#ff8a3d,#ff5a0a);border-radius:22px;padding:24px 40px;box-shadow:0 14px 40px rgba(255,90,10,.45);white-space:nowrap}
.band{position:absolute;left:0;right:0;bottom:0;background:#0a1730;color:#fff}
.foot{position:absolute;left:56px;right:56px;bottom:52px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.card{position:absolute;background:#fafaf8;border-radius:calc(22px*var(--k));box-shadow:0 30px 60px rgba(0,0,0,.35);text-align:center;color:#1b1d22;padding-top:calc(34px*var(--k));font-family:Helvetica,Arial,sans-serif}
.c1{font-size:calc(22px*var(--k));font-weight:600}.c2{font-size:calc(42px*var(--k));font-weight:700;letter-spacing:-.02em;line-height:1}
.cg{width:calc(118px*var(--k));height:calc(118px*var(--k));margin:calc(22px*var(--k)) auto calc(18px*var(--k))}.cg svg{width:100%;height:100%}
.c3{font-size:calc(13px*var(--k));font-weight:800}.c4{color:#fbbc04;font-size:calc(26px*var(--k));letter-spacing:.06em;margin-top:calc(8px*var(--k))}
.waves{position:absolute;color:#1aa3ff;font-weight:300;letter-spacing:-.25em}
.search{position:absolute;left:60px;right:60px;top:300px;background:#fff;border-radius:999px;padding:24px 34px;font-size:34px;box-shadow:0 6px 20px rgba(10,23,48,.08)}
.row{position:relative;display:flex;gap:28px;align-items:center;border-radius:28px;padding:28px;margin-bottom:22px;background:#fff}
.row.dim{opacity:.55;background:#f6f7f9}.row.hot{border:5px solid #1a73e8;box-shadow:0 14px 40px rgba(26,115,232,.22)}
.thumb{width:140px;height:140px;border-radius:20px;display:grid;place-items:center;font-size:70px;background:linear-gradient(135deg,#f2a25a,#c9552a)}
.dim .thumb{background:#ccc;filter:grayscale(1)}
.nm{font-size:44px;font-weight:800;letter-spacing:-.02em}.rt{font-size:36px;font-weight:700;margin-top:4px}
.st{color:#fbbc04}.st i{color:#d8dce3;font-style:normal}.ct{font-weight:400;opacity:.7}
.meta{font-size:28px;opacity:.7;margin-top:6px}.meta b{color:#188038}
.dir{position:absolute;right:30px;top:30px;background:#1a73e8;color:#fff;font-size:26px;font-weight:700;border-radius:999px;padding:12px 24px}
.hand{position:absolute;right:150px;top:84px;font-size:76px}
.thread-top{height:200px;background:#f5f5f7;border-bottom:1px solid #e3e3e8;text-align:center;padding-top:34px}
.av{width:92px;height:92px;border-radius:50%;margin:0 auto;background:linear-gradient(#a7adb7,#868c97);color:#fff;font-size:40px;font-weight:700;display:grid;place-items:center}
.who{font-size:28px;margin-top:12px}
.time{position:absolute;top:226px;width:100%;text-align:center;font-size:24px;color:#8a8a8e}
.bub{position:absolute;font-size:40px;line-height:1.25;padding:24px 34px;border-radius:40px;max-width:720px}
.in{left:56px;background:#e9e9eb}.out{right:56px;background:#0a84ff;color:#fff}
.read{position:absolute;right:66px;top:700px;font-size:26px;color:#8a8a8e}
.clock{position:absolute;top:44px;width:100%;text-align:center;font-size:32px;font-weight:600;opacity:.9}
.note{position:absolute;left:56px;right:56px;display:flex;gap:26px;border-radius:40px;background:rgba(235,238,244,.94);color:#0a1730;padding:28px 34px}
.note.back{left:80px;right:80px;opacity:.55;transform:scale(.97)}
.ic{width:84px;height:84px;flex:none;border-radius:20px;background:linear-gradient(#ff8a3d,#ff5a0a);color:#fff;font-size:50px;display:grid;place-items:center}
.note>div:last-child{flex:1}
.nt{font-size:24px;font-weight:700;letter-spacing:.06em;opacity:.7;display:flex;justify-content:space-between}.nt span{letter-spacing:0;font-weight:500}
.ns{color:#fbbc04;font-size:36px}.ns i{color:#c3c8d0;font-style:normal}
.nq{font-size:34px;font-weight:500;margin-top:2px}
.bill{position:absolute;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;background:#fff;border-radius:28px;padding:34px 38px;box-shadow:0 6px 20px rgba(10,23,48,.06)}
.bill:not(.hot){opacity:.6}.bill.hot{border:5px solid #ff6a1f;box-shadow:0 14px 40px rgba(255,106,31,.22)}
.bn{font-size:42px;font-weight:800;letter-spacing:-.02em}.bd{font-size:28px;opacity:.7;margin-top:6px}
.br{font-size:54px;font-weight:800;text-align:right;line-height:1}.br small{font-size:26px;font-weight:600;opacity:.7}
.hot .br{color:#ff6a1f}.strike{text-decoration:line-through;text-decoration-thickness:5px;color:#8a93a3}
`;

const only = process.argv[2];
if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
const profile = mkdtempSync(resolve(tmpdir(), "meta-ads-chrome-"));
rmSync(build, { recursive: true, force: true });
mkdirSync(resolve(build, "assets"), { recursive: true });
mkdirSync(out, { recursive: true });
copyFileSync(resolve(root, "videos/ceoturbo-ads/assets/fonts/Inter.woff2"), resolve(build, "assets/Inter.woff2"));

for (const [name, body] of Object.entries(ADS)) {
  if (only && only !== name) continue;
  const page = resolve(build, `${name}.html`);
  writeFileSync(page, `<!doctype html><meta charset="utf-8"><style>${css}</style>${body}`);
  const png = resolve(out, `meta-feed-${name}-${W}x${H}.png`);
  execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=${W},${H}`, `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
  console.log(png.replace(root + "/", ""), (statSync(png).size / 1024).toFixed(0) + " KB");
}
rmSync(profile, { recursive: true, force: true });
