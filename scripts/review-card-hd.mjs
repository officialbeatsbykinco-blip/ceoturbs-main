// HD studio images (2400 × 2400) for the review-card shop and the Shopify listings.
// Each scene is an HTML page drawn with the real card artwork (src/lib/card-faces.ts) and the vector
// stand (ads/youtube/stand.mjs), screenshotted by headless Chrome at 2× and saved as JPG + WebP sizes.
// Run with: node scripts/review-card-hd.mjs [scene]
import { mkdirSync, mkdtempSync, copyFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import { cardBack, cardFront } from "../src/lib/card-faces.ts";
import { standHtml } from "../ads/youtube/stand.mjs";

const ROOT = path.resolve(".");
const OUT = path.resolve("public/img/review-cards/hd");
const BUILD = path.join(tmpdir(), "ct-card-hd");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const S = 1200; // CSS px; rendered at 2× → 2400
const WIDTHS = [800, 1600, 2400];

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME_BIN.`);
  process.exit(1);
}
rmSync(BUILD, { recursive: true, force: true });
mkdirSync(path.join(BUILD, "assets"), { recursive: true });
mkdirSync(OUT, { recursive: true });
const fonts = path.join(ROOT, "videos/ceoturbo-ads/assets/fonts");
copyFileSync(path.join(fonts, "SpaceGrotesk.woff2"), path.join(BUILD, "assets/SpaceGrotesk.woff2"));
copyFileSync(path.join(fonts, "Inter.woff2"), path.join(BUILD, "assets/Inter.woff2"));
const profile = mkdtempSync(path.join(tmpdir(), "ct-hd-chrome-"));

const shot = (html, png, { w = S, h = S, transparent = false } = {}) => {
  const page = path.join(BUILD, path.basename(png, ".png") + ".html");
  writeFileSync(page, html);
  execFileSync(CHROME, ["--headless", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", ...(transparent ? ["--default-background-color=00000000"] : []), `--window-size=${w},${h}`, "--virtual-time-budget=1500", `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
};

// Vector stand as a transparent PNG the scenes can place, plus a cut-out for the site's stand hero.
shot(standHtml(), path.join(BUILD, "assets/stand.png"), { w: 1200, h: 1480, transparent: true });
await sharp(path.join(BUILD, "assets/stand.png")).resize({ width: 1240 }).webp({ quality: 85, alphaQuality: 90 }).toFile(path.join(OUT, "stand-cutout.webp"));

const FRONT = `data:image/svg+xml;base64,${Buffer.from(cardFront()).toString("base64")}`;
const BACK = `data:image/svg+xml;base64,${Buffer.from(cardBack()).toString("base64")}`;

// `safe` shrinks the content into the middle 84% so a 5:4 crop on phones never cuts the titles.
const base = (body, bg = "#fff", extra = "", safe = false) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Space Grotesk Variable';src:url(assets/SpaceGrotesk.woff2);font-weight:300 700}
@font-face{font-family:SG;src:url(assets/SpaceGrotesk.woff2);font-weight:300 700}
@font-face{font-family:IN;src:url(assets/Inter.woff2);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${S}px;height:${S}px;overflow:hidden}
body{position:relative;background:${bg};font-family:IN,system-ui,sans-serif;color:#0a1730}
.scene{position:absolute;inset:0;perspective:2400px}
/* One card: real artwork, rounded corners, a 0.76 mm edge and a soft studio shadow. */
.card{position:absolute;aspect-ratio:540/855;border-radius:8.15%/5.15%;background-size:100% 100%;transform-style:preserve-3d}
.card.f{background-image:url("${FRONT}");box-shadow:0 0 0 1px rgba(10,23,48,.10),1px 2px 0 #e3e6ea,2px 4px 0 #cfd4da,0 40px 70px -20px rgba(10,23,48,.35),0 18px 30px -12px rgba(10,23,48,.22)}
.card.b{background-image:url("${BACK}");box-shadow:1px 2px 0 #26272b,2px 4px 0 #1a1b1e,0 40px 70px -20px rgba(10,23,48,.45),0 18px 30px -12px rgba(10,23,48,.3)}
.card::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(125deg,rgba(255,255,255,.28) 0,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08) 100%);pointer-events:none}
.floor{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(10,23,48,.28),transparent);filter:blur(14px)}
.label{position:absolute;font-family:SG,IN,sans-serif;font-weight:700;color:#0a1730}
.pill{display:inline-flex;align-items:center;gap:10px;border-radius:999px;background:#0a1730;color:#fff;font-family:SG,IN,sans-serif;font-weight:700}
${extra}
</style><body><div class="scene"${safe ? ' style="transform:scale(.84)"' : ""}>${body}</div></body>`;

const studio = "radial-gradient(80% 70% at 50% 35%,#ffffff 0,#f2f5fa 55%,#e3e9f2 100%)";
const sky = "linear-gradient(160deg,#f6f9fd 0,#e4ecf6 100%)";

// Phone with a generic review sheet; `biz` is the business name on screen.
const phone = (biz = "Your Business") => `
<div class="phone"><div class="scr">
  <div class="isl"></div>
  <div class="bar"><span>9:41</span><span>●●● ▮</span></div>
  <div class="biz">${biz}</div>
  <div class="sub">Posting publicly across Google</div>
  <div class="st">${"<i>★</i>".repeat(5)}</div>
  <div class="box">Share details of your own experience at this place</div>
  <div class="post">Post</div>
</div></div>`;
const phoneCss = `
.phone{position:absolute;width:360px;height:740px;border-radius:64px;background:linear-gradient(145deg,#2a2f3a,#0b0e14);padding:14px;box-shadow:inset 0 0 0 2px #3a404c,0 50px 80px -30px rgba(10,23,48,.55),0 20px 30px -15px rgba(10,23,48,.35)}
.scr{position:relative;width:100%;height:100%;border-radius:52px;background:#fff;overflow:hidden;padding:70px 30px 0}
.isl{position:absolute;left:50%;top:16px;width:110px;height:32px;margin-left:-55px;border-radius:20px;background:#0b0e14}
.bar{position:absolute;left:34px;right:34px;top:22px;display:flex;justify-content:space-between;font:600 15px IN;color:#111}
.biz{margin-top:24px;font:700 28px IN;color:#202124;text-align:center}
.sub{margin-top:8px;font:500 15px IN;color:#5f6368;text-align:center}
.st{margin-top:30px;display:flex;justify-content:center;gap:8px}.st i{font-style:normal;font-size:46px;line-height:1;color:#fbbc04}
.box{margin-top:30px;height:200px;border-radius:14px;border:2px solid #dadce0;padding:16px;font:500 16px/1.4 IN;color:#80868b}
.post{position:absolute;left:30px;right:30px;bottom:44px;height:62px;border-radius:31px;background:#1a73e8;color:#fff;font:700 22px/62px IN;text-align:center}
.wave{position:absolute;border:5px solid #1a9fff;border-color:#1a9fff transparent transparent transparent;border-radius:50%}`;

const SCENES = {
  // Hero: both sides, tilted in 3D, on a clean studio sweep.
  "card-hero": () =>
    base(
      `<div class="floor" style="left:180px;top:1000px;width:860px;height:90px"></div>
       <div class="card b" style="left:610px;top:190px;width:430px;transform:rotateY(-18deg) rotateZ(8deg)"></div>
       <div class="card f" style="left:170px;top:230px;width:450px;transform:rotateY(16deg) rotateZ(-7deg)"></div>`,
      studio,
    ),

  // Tap: phone dipping onto the card, review form already open.
  "card-tap": () =>
    base(
      `<div class="floor" style="left:120px;top:1010px;width:960px;height:90px"></div>
       <div class="card f" style="left:150px;top:300px;width:420px;transform:rotateZ(-6deg)"></div>
       <div class="wave" style="left:470px;top:420px;width:120px;height:120px;transform:rotate(60deg)"></div>
       <div class="wave" style="left:445px;top:395px;width:170px;height:170px;transform:rotate(60deg);opacity:.6"></div>
       <div class="wave" style="left:420px;top:370px;width:220px;height:220px;transform:rotate(60deg);opacity:.3"></div>
       <div style="position:absolute;left:640px;top:200px;transform:rotate(9deg)">${phone()}</div>`,
      sky,
      phoneCss,
    ),

  // Counter: the card lying by the register on a warm wood counter.
  "card-counter": () =>
    base(
      `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#e9e3d8 0,#d9cfbf 42%,#8a6a4c 42%,#5e4430 100%)"></div>
       <div style="position:absolute;left:0;right:0;top:504px;height:696px;background:repeating-linear-gradient(92deg,rgba(255,255,255,.05) 0 14px,rgba(0,0,0,.05) 14px 30px)"></div>
       <div style="position:absolute;left:-60px;top:110px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,214,150,.75),transparent 70%);filter:blur(10px)"></div>
       <div style="position:absolute;left:880px;top:60px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(255,240,210,.7),transparent 70%);filter:blur(16px)"></div>
       <div style="position:absolute;left:770px;top:230px;width:330px;height:300px;border-radius:30px 30px 10px 10px;background:linear-gradient(180deg,#2b2f37,#15181e);filter:blur(5px);opacity:.85"></div>
       <div style="position:absolute;left:800px;top:260px;width:270px;height:150px;border-radius:12px;background:#3f6fa8;filter:blur(6px);opacity:.7"></div>
       <div style="position:absolute;left:90px;top:330px;width:180px;height:200px;border-radius:12px 12px 40px 40px;background:linear-gradient(180deg,#f7f3ec,#d9d0c2);filter:blur(4px)"></div>
       <div style="position:absolute;left:300px;top:720px;width:640px;height:340px;border-radius:50%;background:radial-gradient(closest-side,rgba(40,25,10,.45),transparent);filter:blur(18px)"></div>
       <div class="card f" style="left:390px;top:330px;width:420px;transform:rotateX(52deg) rotateZ(-14deg);transform-origin:50% 100%;box-shadow:1px 3px 0 #cfd4da,2px 6px 0 #b9bfc7"></div>`,
      "#d9cfbf",
    ),

  // Specs: both sides with leader-line callouts.
  "card-specs": () =>
    base(
      `<div class="label" style="left:0;right:0;top:70px;text-align:center;font-size:58px;letter-spacing:-.02em">Built for the counter</div>
       <div class="floor" style="left:200px;top:1040px;width:800px;height:70px"></div>
       <div class="card f" style="left:265px;top:250px;width:320px"></div>
       <div class="card b" style="left:615px;top:250px;width:320px"></div>
       ${[
         ["White matte front", 120, 330, "left"],
         ["NTAG215 NFC chip", 120, 560, "left"],
         ["Waterproof PVC", 120, 790, "left"],
         ["Black NFC back", 1080, 330, "right"],
         ["504 bytes memory", 1080, 560, "right"],
         ["Rewrite anytime", 1080, 790, "right"],
       ]
         .map(([t, x, y, side]) => `<div class="label" style="${side === "left" ? "left:36px;text-align:left" : "right:36px;text-align:right"};top:${y}px;width:200px;font-size:30px;line-height:1.12">${t}<div style="margin-top:12px;height:3px;background:#1a9fff;width:120px;${side === "left" ? "" : "margin-left:auto"}"></div></div>`)
         .join("")}
       <div style="position:absolute;left:250px;top:960px;width:700px;text-align:center;font:600 36px SG;color:#0a1730">85.5 × 54 × 0.76 mm · credit-card size</div>`,
      studio,
      "",
      true,
    ),

  // Size: the card next to a phone with dimension lines.
  "card-size": () =>
    base(
      `<div class="label" style="left:0;right:0;top:70px;text-align:center;font-size:58px;letter-spacing:-.02em">Credit-card size</div>
       <div class="floor" style="left:180px;top:1030px;width:840px;height:70px"></div>
       <div class="card f" style="left:250px;top:300px;width:380px"></div>
       <div style="position:absolute;left:250px;top:250px;width:380px;border-top:3px solid #0a1730"></div>
       <div style="position:absolute;left:250px;top:240px;height:22px;border-left:3px solid #0a1730"></div><div style="position:absolute;left:627px;top:240px;height:22px;border-left:3px solid #0a1730"></div>
       <div class="label" style="left:250px;width:380px;top:196px;text-align:center;font-size:30px">54 mm</div>
       <div style="position:absolute;left:200px;top:300px;height:602px;border-left:3px solid #0a1730"></div>
       <div style="position:absolute;left:190px;top:300px;width:22px;border-top:3px solid #0a1730"></div><div style="position:absolute;left:190px;top:899px;width:22px;border-top:3px solid #0a1730"></div>
       <div class="label" style="left:60px;top:580px;width:120px;text-align:right;font-size:30px">85.5 mm</div>
       <div style="position:absolute;left:700px;top:240px;transform:scale(.92);transform-origin:top left">${phone()}</div>
       <div class="label" style="left:690px;top:950px;width:340px;text-align:center;font-size:24px;color:#5b6577">Thinner than a phone case: 0.76 mm</div>`,
      studio,
      phoneCss,
      true,
    ),

  // How it works: three steps in one frame.
  "card-how": () =>
    base(
      `<div class="label" style="left:0;right:0;top:70px;text-align:center;font-size:62px;letter-spacing:-.02em">Tap. Review. Done.</div>
       ${[
         ["1", "Customer taps", `<div class="card f" style="left:50%;top:40px;width:230px;margin-left:-125px;transform:rotateZ(-6deg)"></div><div class="wave" style="left:50%;top:150px;width:120px;height:120px;margin-left:50px;transform:rotate(60deg)"></div><div class="wave" style="left:50%;top:125px;width:170px;height:170px;margin-left:25px;transform:rotate(60deg);opacity:.5"></div>`],
         ["2", "Review form opens", `<div style="position:absolute;left:50%;top:10px;margin-left:-105px;transform:scale(.58);transform-origin:top left">${phone()}</div>`],
         ["3", "Five stars posted", `<div style="position:absolute;left:28px;right:28px;top:70px;border-radius:24px;background:#f6f8fb;box-shadow:0 0 0 2px #e3e9f2;padding:26px 22px"><div style="display:flex;align-items:center;gap:12px"><span style="width:52px;height:52px;border-radius:50%;background:#1a9fff;color:#fff;font:700 24px/52px IN;text-align:center">★</span><span style="font:700 22px IN">Your next customer</span></div><div style="margin-top:14px;font-size:38px;color:#fbbc04;letter-spacing:3px">★★★★★</div><div style="margin-top:8px;font:500 20px/1.35 IN;color:#3c4043">Great service, super fast. Will be back!</div><div style="margin-top:6px;font:500 16px IN;color:#80868b">Example review</div></div><div class="pill" style="position:absolute;left:50%;top:380px;transform:translateX(-50%);padding:14px 26px;font-size:22px;white-space:nowrap">Posted ✓</div>`],
       ]
         .map(([n, t, art], i) => `<div style="position:absolute;left:${60 + i * 370}px;top:230px;width:340px;height:720px;border-radius:36px;background:#fff;box-shadow:0 0 0 2px #e3e9f2,0 30px 60px -30px rgba(10,23,48,.35);overflow:hidden">
            <div style="position:absolute;left:0;right:0;top:0;height:470px">${art}</div>
            <div style="position:absolute;left:30px;bottom:150px;width:58px;height:58px;border-radius:50%;background:#1a9fff;color:#fff;font:700 30px/58px SG;text-align:center">${n}</div>
            <div class="label" style="left:30px;right:20px;bottom:70px;font-size:34px;line-height:1.05">${t}</div></div>`)
         .join("")}
       <div style="position:absolute;left:0;right:0;top:1010px;text-align:center;font:600 30px IN;color:#5b6577">No app. iPhone &amp; Android. About 3 seconds.</div>`,
      sky,
      phoneCss,
      true,
    ),

  // Five cards fanned out.
  "card-stack-5": () =>
    base(
      `<div class="floor" style="left:180px;top:1010px;width:840px;height:90px"></div>
       ${[0, 1, 2, 3].map((i) => `<div class="card b" style="left:${560 - i * 70}px;top:${210 + i * 12}px;width:400px;transform:rotateZ(${14 - i * 5}deg)"></div>`).join("")}
       <div class="card f" style="left:240px;top:270px;width:400px;transform:rotateZ(-8deg)"></div>`,
      studio,
    ),

  "stand-front": () => base(`<div class="floor" style="left:200px;top:1060px;width:800px;height:80px"></div><img src="assets/stand.png" style="position:absolute;left:170px;top:70px;width:860px">`, studio, "", true),

  "stand-angle": () =>
    base(
      `<div class="floor" style="left:220px;top:1060px;width:760px;height:80px"></div><img src="assets/stand.png" style="position:absolute;left:200px;top:90px;width:820px;transform:perspective(1800px) rotateY(-24deg)">`,
      sky,
      "",
      true,
    ),

  "stand-tap": () =>
    base(
      `<div class="floor" style="left:80px;top:1060px;width:800px;height:80px"></div>
       <img src="assets/stand.png" style="position:absolute;left:40px;top:150px;width:760px">
       <div style="position:absolute;left:730px;top:240px;transform:rotate(-10deg) scale(.95)">${phone()}</div>`,
      sky,
      phoneCss,
      true,
    ),

  kit: () =>
    base(
      `<div class="floor" style="left:60px;top:1060px;width:1080px;height:90px"></div>
       <img src="assets/stand.png" style="position:absolute;left:10px;top:150px;width:720px">
       <div class="card b" style="left:840px;top:430px;width:290px;transform:rotateZ(10deg)"></div>
       <div class="card f" style="left:660px;top:470px;width:300px;transform:rotateZ(-6deg)"></div>`,
      studio,
      "",
      true,
    ),
};

const only = process.argv[2];
for (const [name, html] of Object.entries(SCENES)) {
  if (only && only !== name) continue;
  const png = path.join(BUILD, `${name}.png`);
  shot(html(), png);
  const img = sharp(png).flatten({ background: "#ffffff" });
  await img.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  for (const w of WIDTHS) await img.clone().resize({ width: w }).webp({ quality: w > 1600 ? 80 : 82 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  await img.clone().resize({ width: 200, height: 200 }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}-thumb.webp`));
  console.log(name);
}
