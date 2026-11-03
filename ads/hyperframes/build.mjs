// Builds the shirt video ads as HyperFrames compositions (HTML → MP4, https://hyperframes.heygen.com).
// 9:16, 1080 × 1920, ~15 s each, for TikTok, Reels and Facebook/Instagram Stories.
//
//   node ads/hyperframes/build.mjs            # writes ads/hyperframes/<ad>/index.html (+ assets/)
//   npm run ads:render                        # renders every ad to ads/hyperframes/out/*.mp4
//
// Everything is local (GSAP, fonts, product photos) so a render needs no network.
// docs/ads/meta-tiktok-shirts.md says which ad runs where.
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const ART = JSON.parse(await readFile(path.join(ROOT, "src/content/shirt-art.json"), "utf8"));

const copies = [
  ["node_modules/gsap/dist/gsap.min.js", "gsap.min.js"],
  ["node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2", "fonts/anton.woff2"],
  ["node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "fonts/inter.woff2"],
  ["node_modules/@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff2", "fonts/marker.woff2"],
  ["public/img/merch/merch-black-front.jpg", "merch-front.jpg"],
  ["public/img/merch/merch-tour-back.jpg", "merch-tour.jpg"],
  ["public/img/merch/merch-colors.jpg", "merch-colors.jpg"],
  ["public/img/shirts/shirt-black-front.jpg", "shirt-front.jpg"],
  ["public/img/shirts/shirt-back.jpg", "shirt-back.jpg"],
  ["public/img/shirts/shirt-colors.jpg", "shirt-colors.jpg"],
];
/** Each ad is its own HyperFrames project (one root composition per folder) with its own copy of the assets. */
async function project(id, html) {
  const dir = path.join(HERE, id);
  await mkdir(path.join(dir, "assets", "fonts"), { recursive: true });
  for (const [from, to] of copies) await copyFile(path.join(ROOT, from), path.join(dir, "assets", to));
  await writeFile(path.join(dir, "index.html"), html);
  await writeFile(path.join(dir, "hyperframes.json"), JSON.stringify({ paths: { assets: "assets" }, media: { autoProxy: true } }, null, 2) + "\n");
}

const W = 1080;
const H = 1920;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Caption words, each animatable. "*a few words*" = highlighted (the stars can sit inside punctuation). */
function words(line) {
  let hi = false;
  return line
    .split(" ")
    .map((w) => {
      const opens = w.includes("*") && !hi;
      const stars = (w.match(/\*/g) || []).length;
      const on = hi || opens;
      hi = stars % 2 ? !hi : hi;
      return `<span class="w${on ? " hi" : ""}">${esc(w.replace(/\*/g, ""))}</span>`;
    })
    .join(" ");
}

/** A flat shirt (same artwork as the site designer) with optional big label text on the chest. */
const shirt = (color, label = "", ink = "#fff", sub = "") => `
  <svg class="tee" viewBox="${ART.viewBox}" xmlns="http://www.w3.org/2000/svg">
    <path d="${ART.short}" fill="${color}" stroke="#000" stroke-opacity=".35" stroke-width="3"/>
    <path d="${ART.collarFront}" fill="${color}" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
    <path d="${ART.neckFront}" fill="#000" fill-opacity=".35"/>
    ${label ? `<text x="300" y="220" text-anchor="middle" font-family="Anton" font-size="${label.length > 9 ? 44 : 64}" fill="${ink}">${esc(label)}</text>` : ""}
    ${sub ? `<text x="300" y="268" text-anchor="middle" font-family="Inter" font-weight="700" font-size="22" fill="${ink}" letter-spacing="2">${esc(sub)}</text>` : ""}
  </svg>`;

/**
 * Scene kinds:
 *  hook    — giant caption on a loud color (frame 0 must already read: it's the scroll-stopper)
 *  caption — caption + optional small line
 *  image   — product photo with a caption on top
 *  shirts  — row of shirts (mismatched → matching)
 *  price   — big price / offer stack
 *  cta     — end card with the URL
 */
function scene(s, i, start) {
  const id = `s${i}`;
  const bg = s.bg ?? "#0b1018";
  const fg = s.fg ?? "#fff";
  // Yellow highlights on dark scenes, hot pink on light ones (yellow on yellow disappears).
  const hi = s.hi ?? (fg === "#fff" ? "#ffd23f" : "#e0245e");
  let body = "";
  if (s.kind === "hook" || s.kind === "caption") {
    body = `<div class="cap ${s.kind}">${s.lines.map((l) => `<div class="line">${words(l)}</div>`).join("")}</div>${s.small ? `<div class="small">${esc(s.small)}</div>` : ""}${s.sticker ? `<div class="sticker">${esc(s.sticker)}</div>` : ""}`;
  } else if (s.kind === "image") {
    body = `<div class="cap top">${s.lines.map((l) => `<div class="line">${words(l)}</div>`).join("")}</div><img class="photo" src="assets/${s.src}" alt=""/>${s.sticker ? `<div class="sticker low">${esc(s.sticker)}</div>` : ""}`;
  } else if (s.kind === "shirts") {
    body = `<div class="cap top">${s.lines.map((l) => `<div class="line">${words(l)}</div>`).join("")}</div>
      <div class="row before">${s.before.map(([c, l, ink]) => `<div class="cell">${shirt(c, "", ink)}<div class="tag">${esc(l)}</div></div>`).join("")}</div>
      <div class="row after">${s.before.map(() => `<div class="cell">${shirt(s.after[0], s.after[1], s.after[2], s.after[3])}</div>`).join("")}</div>
      ${s.small ? `<div class="small bottom">${esc(s.small)}</div>` : ""}`;
  } else if (s.kind === "price") {
    body = `<div class="cap">${s.lines.map((l) => `<div class="line">${words(l)}</div>`).join("")}</div><ul class="stack">${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  } else if (s.kind === "cta") {
    body = `<div class="cap">${s.lines.map((l) => `<div class="line">${words(l)}</div>`).join("")}</div><div class="btn">${esc(s.button)}</div><div class="url">${esc(s.url)}</div>${s.small ? `<div class="small bottom">${esc(s.small)}</div>` : ""}`;
  }
  return `<section id="${id}" class="clip scene ${s.kind}" data-start="${start.toFixed(2)}" data-duration="${s.dur}" data-track-index="0" style="background:${bg};color:${fg};--hi:${hi}">${body}</section>`;
}

function animation(s, i, t) {
  const q = (sel) => `"#s${i} ${sel}"`;
  const a = [];
  // Hooks are readable on frame 0; everything else pops in.
  if (s.kind === "hook") a.push(`tl.from(${q(".cap")}, { scale: 0.9, duration: 0.25, ease: "back.out(3)" }, ${t});`);
  else a.push(`tl.from(${q(".w")}, { y: 90, scale: 0.5, opacity: 0, duration: 0.32, stagger: 0.07, ease: "back.out(2.2)" }, ${t + 0.05});`);
  if (s.sticker) a.push(`tl.from(${q(".sticker")}, { scale: 0, rotation: -25, duration: 0.35, ease: "back.out(3)" }, ${t + 0.6});`, `tl.to(${q(".sticker")}, { rotation: 6, duration: 0.12, yoyo: true, repeat: 5 }, ${t + 1});`);
  if (s.small) a.push(`tl.from(${q(".small")}, { opacity: 0, y: 30, duration: 0.3 }, ${t + 0.8});`);
  if (s.kind === "image") a.push(`tl.from(${q(".photo")}, { y: 260, scale: 0.85, opacity: 0, duration: 0.5, ease: "power3.out" }, ${t + 0.25});`, `tl.to(${q(".photo")}, { scale: 1.07, duration: ${s.dur - 0.8}, ease: "none" }, ${t + 0.75});`);
  if (s.kind === "shirts") {
    const swap = t + s.swapAt;
    a.push(
      `tl.from(${q(".before .cell")}, { y: 200, opacity: 0, rotation: -12, duration: 0.35, stagger: 0.1, ease: "back.out(2)" }, ${t + 0.2});`,
      `tl.to(${q(".before .cell")}, { rotation: 5, duration: 0.1, yoyo: true, repeat: 3, stagger: 0.05 }, ${t + 1.2});`,
      `tl.set(${q(".after")}, { opacity: 0 }, ${t});`,
      `tl.to(${q(".before")}, { opacity: 0, scale: 0.9, duration: 0.15 }, ${swap});`,
      `tl.to(${q(".after")}, { opacity: 1, duration: 0.01 }, ${swap + 0.1});`,
      `tl.from(${q(".after .cell")}, { scale: 1.4, opacity: 0, duration: 0.3, stagger: 0.06, ease: "back.out(2)" }, ${swap + 0.1});`,
      `tl.from(${q(".cap .line:last-child")}, { opacity: 0, duration: 0.01 }, ${swap});`,
    );
  }
  if (s.kind === "price") a.push(`tl.from(${q(".stack li")}, { x: -500, opacity: 0, duration: 0.35, stagger: 0.25, ease: "power3.out" }, ${t + 0.6});`);
  if (s.kind === "cta") a.push(`tl.from(${q(".btn")}, { scale: 0, duration: 0.4, ease: "back.out(2.5)" }, ${t + 0.5});`, `tl.to(${q(".btn")}, { scale: 1.08, duration: 0.35, yoyo: true, repeat: ${Math.max(1, Math.floor((s.dur - 1) / 0.35) - 1)}, ease: "sine.inOut" }, ${t + 0.95});`, `tl.from(${q(".url")}, { opacity: 0, y: 40, duration: 0.3 }, ${t + 0.7});`);
  return a.join("\n      ");
}

function page(ad) {
  let t = 0;
  const scenes = [];
  const anims = [];
  ad.scenes.forEach((s, i) => {
    scenes.push(scene(s, i, t));
    anims.push(animation(s, i, t));
    t += s.dur;
  });
  const total = +t.toFixed(2);
  return `<!doctype html>
<!-- ${esc(ad.title)} — generated by ads/hyperframes/build.mjs, edit the script, not this file. -->
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Anton"; src: url("assets/fonts/anton.woff2") format("woff2"); }
      @font-face { font-family: "Inter"; src: url("assets/fonts/inter.woff2") format("woff2"); font-weight: 100 900; }
      @font-face { font-family: "Marker"; src: url("assets/fonts/marker.woff2") format("woff2"); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; font-family: Inter, sans-serif; }
      .clip { position: absolute; inset: 0; }
      .scene { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120px 70px 260px; text-align: center; overflow: hidden; }
      .cap { font-family: Anton, sans-serif; text-transform: uppercase; line-height: 1.02; letter-spacing: 0.5px; }
      .cap .line { font-size: 118px; text-shadow: 0 6px 0 rgba(0,0,0,.35); }
      .hook .line { font-size: 112px; }
      .cap.top { position: absolute; top: 170px; left: 60px; right: 60px; }
      .cap.top .line { font-size: 92px; }
      .w { display: inline-block; }
      .hi { color: var(--hi); }
      .small { margin-top: 48px; font-size: 46px; font-weight: 700; opacity: .92; line-height: 1.25; }
      .small.bottom { position: absolute; bottom: 300px; left: 80px; right: 80px; }
      .sticker { position: absolute; right: 70px; top: 330px; background: #ffd23f; color: #111; font-family: Marker, cursive; font-size: 58px; padding: 18px 30px; border-radius: 22px; transform: rotate(-6deg); box-shadow: 0 10px 0 rgba(0,0,0,.3); }
      .sticker.low { top: auto; bottom: 360px; }
      .photo { width: 940px; height: 940px; object-fit: cover; border-radius: 48px; margin-top: 280px; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
      .row { position: absolute; top: 640px; left: 30px; right: 30px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 0; }
      .cell { width: 340px; display: flex; flex-direction: column; align-items: center; }
      .tee { width: 320px; height: auto; }
      .tag { margin-top: -6px; font-family: Marker, cursive; font-size: 40px; color: #111; background: #fff; padding: 4px 16px; border-radius: 12px; transform: rotate(-3deg); }
      .stack { list-style: none; margin-top: 70px; font-size: 62px; font-weight: 800; }
      .stack li { margin: 22px 0; background: rgba(255,255,255,.1); border-radius: 26px; padding: 22px 34px; }
      .btn { margin-top: 80px; background: #ff7a1a; color: #fff; font-family: Anton, sans-serif; font-size: 84px; padding: 34px 70px; border-radius: 999px; text-transform: uppercase; box-shadow: 0 14px 0 #b34d00; }
      .url { margin-top: 56px; font-size: 54px; font-weight: 800; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
      ${scenes.join("\n      ")}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      ${anims.join("\n      ")}
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
}

const ORANGE = "#ff7a1a";
const PINK = "#ff3d6e";
const PURPLE = "#4b1fa8";
const NAVY = "#0b1018";
const MERCH_URL = "ceoturbo.com/artist-merch";
const TEE_URL = "ceoturbo.com/custom-company-t-shirts";

export const ADS = [
  {
    id: "artist-merch-guy",
    title: "Artist merch — 'my merch guy said next week'",
    scenes: [
      { kind: "hook", dur: 2.2, bg: PINK, lines: ["POV: your merch guy", "said *“next week”*"], sticker: "6 weeks ago" },
      { kind: "caption", dur: 2.2, bg: NAVY, lines: ["show is *friday*.", "merch table:", "*empty.*"] },
      { kind: "caption", dur: 2, bg: PURPLE, lines: ["so I made it", "*myself*", "in 2 minutes"] },
      { kind: "image", dur: 3.2, bg: "#f1f2f5", fg: "#111", lines: ["drop your art.", "*drag it. done.*"], src: "merch-front.jpg", sticker: "no minimum" },
      { kind: "price", dur: 2.6, bg: NAVY, lines: ["from *$24.99*"], items: ["Free US shipping", "20% off 50+ shirts", "Sell at $30 · keep $10+"] },
      { kind: "cta", dur: 3, bg: ORANGE, lines: ["make your merch", "*today*"], button: "Design yours", url: MERCH_URL },
    ],
  },
  {
    id: "artist-zero-merch",
    title: "Artist merch — 'me selling 0 merch'",
    scenes: [
      { kind: "hook", dur: 2.3, bg: "#ffd23f", fg: "#111", lines: ["me at my own show", "selling *0 merch*"], small: "because I have 0 merch" },
      { kind: "caption", dur: 2.3, bg: NAVY, lines: ["fan: “you got", "*shirts?*”"], small: "me: “uhh… next show”" },
      { kind: "image", dur: 3.4, bg: "#f1f2f5", fg: "#111", lines: ["cover art front.", "*tour dates back.*"], src: "merch-tour.jpg" },
      { kind: "price", dur: 2.8, bg: PURPLE, lines: ["buy *50*, keep *$500*"], items: ["$19.99 a shirt at 50+", "Sell at $30", "No minimum to start"] },
      { kind: "cta", dur: 3, bg: PINK, lines: ["never say", "*“next show”* again"], button: "Make my merch", url: MERCH_URL },
    ],
  },
  {
    id: "artist-tour-back",
    title: "Artist merch — 'my tour: 3 cities'",
    scenes: [
      { kind: "hook", dur: 2.2, bg: PURPLE, lines: ["my tour:", "*3 cities*"], sticker: "2 are my cousin's house" },
      { kind: "caption", dur: 2.2, bg: NAVY, lines: ["my shirt:", "*WORLD TOUR*"] },
      { kind: "image", dur: 3.4, bg: "#f1f2f5", fg: "#111", lines: ["type your dates.", "*we lay it out.*"], src: "merch-tour.jpg" },
      { kind: "image", dur: 2.6, bg: "#f1f2f5", fg: "#111", lines: ["6 colors.", "*1 shirt or 100.*"], src: "merch-colors.jpg" },
      { kind: "cta", dur: 3, bg: ORANGE, lines: ["fake it till", "*you sell out*"], button: "Design my tour tee", url: MERCH_URL, small: "From $24.99 · free US shipping" },
    ],
  },
  {
    id: "biz-group-project",
    title: "Company shirts — 'crew like a group project'",
    scenes: [
      { kind: "hook", dur: 2, bg: "#ffd23f", fg: "#111", lines: ["your crew showing", "up to a job like a", "*group project*"] },
      {
        kind: "shirts",
        dur: 4.4,
        swapAt: 2.4,
        bg: "#e9ecf2",
        fg: "#111",
        lines: ["5 guys. 5 shirts.", "*1 company.*"],
        before: [["#f2c230", "minions tee"], ["#2a9d8f", "2014 5K"], ["#e76f51", "hawaiian??"], ["#6d597a", "band tee"], ["#9aa0a6", "is that pajamas"], ["#264653", "his wife's"]],
        after: ["#141518", "YOUR LOGO", "#fff", "YOURCOMPANY.COM"],
        small: "vs. your logo on everybody",
      },
      { kind: "caption", dur: 2.2, bg: NAVY, lines: ["customers trust", "*the logo shirt*"], small: "before you even knock" },
      { kind: "price", dur: 2.6, bg: PURPLE, lines: ["*no minimum*"], items: ["From $27.99 a shirt", "Free US shipping", "15% off 24+"] },
      { kind: "cta", dur: 3, bg: ORANGE, lines: ["your logo.", "*your crew.*"], button: "Design your shirts", url: TEE_URL },
    ],
  },
  {
    id: "biz-minimum-24",
    title: "Company shirts — 'minimum is 24 shirts'",
    scenes: [
      { kind: "hook", dur: 2.4, bg: NAVY, lines: ["print shop:", "*“minimum is", "24 shirts”*"] },
      { kind: "caption", dur: 2.2, bg: "#ffd23f", fg: "#111", lines: ["me with", "*3 employees:*"], sticker: "…ok" },
      { kind: "caption", dur: 2, bg: PURPLE, lines: ["order *1*.", "or *3*.", "or *50*."] },
      { kind: "image", dur: 3.2, bg: "#f1f2f5", fg: "#111", lines: ["upload your logo.", "*see it live.*"], src: "shirt-front.jpg", sticker: "no setup fees" },
      { kind: "cta", dur: 3, bg: ORANGE, lines: ["company shirts,", "*no minimum*"], button: "Design yours", url: TEE_URL, small: "From $27.99 · free US shipping" },
    ],
  },
  {
    id: "biz-new-hire",
    title: "Company shirts — 'new hire in a Minions tee'",
    scenes: [
      { kind: "hook", dur: 2.3, bg: "#f2c230", fg: "#111", lines: ["new hire showing up", "*in a minions tee*", "day 1"] },
      { kind: "caption", dur: 2, bg: NAVY, lines: ["the customer:", "*“who are you”*"] },
      { kind: "image", dur: 3, bg: "#f1f2f5", fg: "#111", lines: ["logo front.", "*STAFF on the back.*"], src: "shirt-back.jpg" },
      { kind: "price", dur: 2.6, bg: PURPLE, lines: ["order *1 shirt*", "for the new guy"], items: ["Same price as 11", "Free US shipping", "Long sleeve too"] },
      { kind: "cta", dur: 3, bg: ORANGE, lines: ["look like", "*a real company*"], button: "Design your shirts", url: TEE_URL },
    ],
  },
  {
    // Real timeline only: company shirts print in 2–4 business days, then 3–6 to arrive (src/config/site.ts).
    // Voice-over script and direction: event-last-minute/voice-script.txt. Scene lengths follow the voice lines;
    // videos/ceoturbo-ads/mix-audio-event.sh mixes them onto out/event-last-minute.mp4.
    id: "event-last-minute",
    title: "Event shirts — 'event is in 2 weeks'",
    scenes: [
      { kind: "hook", dur: 4.1, bg: PINK, lines: ["event is in", "*2 weeks*"], sticker: "and i have ZERO shirts" },
      { kind: "caption", dur: 3.6, bg: NAVY, lines: ["sponsor asked:", "*“where's the merch?”*"], small: "me: internal screaming" },
      { kind: "image", dur: 2.8, bg: "#f1f2f5", fg: "#111", lines: ["uploaded logo.", "*done in 2 min.*"], src: "shirt-front.jpg", sticker: "no minimum" },
      { kind: "image", dur: 4, bg: "#f1f2f5", fg: "#111", lines: ["showed up with", "*days to spare.*"], src: "shirt-colors.jpg", sticker: "prints in 2–4 days" },
      { kind: "cta", dur: 3.8, bg: ORANGE, lines: ["never panic", "*again*"], button: "Design yours", url: TEE_URL, small: "From $27.99 · free US shipping" },
    ],
  },
];

for (const ad of ADS) {
  await project(ad.id, page(ad));
  console.log(`ads/hyperframes/${ad.id}/index.html`);
}
