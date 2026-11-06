// Builds a long-form video into a HyperFrames project: .build/<ep>/index.html + mixed audio, plus YouTube chapters.
//   node vo.mjs stop-asking && node build.mjs stop-asking
//   then inside .build/stop-asking: npx hyperframes render --quality delivery --output ../../renders/stop-asking.mp4
// Every scene is timed from the real voice-line lengths, so the cut always fits the narration.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { voPath } from "./vo.mjs";
import { synthBed } from "./music.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EP = process.argv[2] || "stop-asking";
const mod = await import(`./${EP}.mjs`);
const { SCENES, TITLE, LINKS } = mod;
const [W, H] = mod.SIZE ?? [1920, 1080]; // a script can export SIZE = [1080, 1920] for 9:16
const OUT = path.join(HERE, ".build", EP);
const ADS = path.join(HERE, "../ceoturbo-ads/assets");
const IMG = path.join(HERE, "../../public/img/review-cards/hd");
const GAP = 0.34; // breath between sentences
const XF = 0.5; // scene crossfade

const probe = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString();
const T = (n) => (+n).toFixed(3);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---- timing ----
let clock = 0;
const scenes = SCENES.map((s) => {
  const S = clock;
  let c = S + (s.lead ?? 0.45);
  const L = s.lines.map((raw) => {
    const l = typeof raw === "string" ? { t: raw } : raw;
    // --no-audio layout passes can run before every line is voiced (≈2.6 words a second)
    const f = voPath(EP, l);
    const dur = existsSync(f) ? probe(f) : l.t.split(/\s+/).length / 2.6;
    const o = { ...l, start: c, dur, end: c + dur };
    c += dur + (l.gap ?? GAP);
    return o;
  });
  const E = c + (s.pad ?? 0.25);
  clock = E;
  return { ...s, S, E, L };
});
const TOTAL = clock;

// ---- scenes ----
const tl = [];
const sfx = [];
let html = "";
const D = (v) => JSON.stringify(v).replace(/"(\w+)":/g, "$1:");
for (const sc of scenes) {
  const p = sc.id;
  const q = (sel) => sel.split(",").map((x) => x.trim()).map((x) => x.replace(/@([\w-]+)/g, `#${p}-$1`)).map((x) => (x.startsWith(".") ? `#${p} ${x}` : x)).join(", ");
  const add = (code) => tl.push(code);
  const c = {
    S: sc.S, E: sc.E, L: sc.L, q, id: (x) => `${p}-${x}`,
    js: add,
    sfx: (n, t) => sfx.push({ n, t }),
    in: (sel, t, o = {}) => add(`tl.fromTo("${q(sel)}", { autoAlpha: 0, x: ${o.x ?? 0}, y: ${o.y ?? 40}, scale: ${o.scale ?? 1} }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: ${o.d ?? 0.7}, ease: "${o.ease ?? "power3.out"}" }, ${T(t)});`),
    pop: (sel, t) => add(`tl.fromTo("${q(sel)}", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(2.2)" }, ${T(t)});`),
    out: (sel, t) => add(`tl.to("${q(sel)}", { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: "power2.in" }, ${T(t)});`),
    to: (sel, v, t) => add(`tl.to("${q(sel)}", ${D(v)}, ${T(t)});`),
  };
  let body = sc.draw(c);
  body = body.replace(/id="@([\w-]+)"/g, `id="${p}-$1"`);
  // captions: one sentence at a time, words light up as they're spoken
  let caps = "";
  sc.L.forEach((l, k) => {
    const id = `${p}-cap${k}`;
    const words = l.t.split(/\s+/);
    const chars = words.reduce((s, w) => s + w.length + 1, 0);
    caps += `<div class="cap" id="${id}">${words.map((w) => `<span>${esc(w)}</span>`).join(" ")}</div>`;
    add(`tl.set("#${id}", { autoAlpha: 1 }, ${T(l.start)}); tl.set("#${id}", { autoAlpha: 0 }, ${T(l.end + Math.min(0.25, (l.gap ?? GAP) - 0.05))});`);
    let acc = 0;
    words.forEach((w, j) => { add(`tl.set("#${id} span:nth-child(${j + 1})", { color: "#ffffff" }, ${T(l.start + (acc / chars) * l.dur * 0.96)});`); acc += w.length + 1; });
  });
  // scene in: crossfade over the previous one; slow camera drift through the whole scene
  const S0 = Math.max(0, sc.S - XF);
  add(`tl.fromTo("#${p}-fade", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, ease: "none" }, ${T(S0)});`);
  add(`tl.fromTo("#${p}-cam", { scale: 1.0 }, { scale: 1.035, duration: ${T(sc.E - S0)}, ease: "none" }, ${T(S0)});`);
  html += `
<section class="clip scene s-${p}" id="${p}" data-start="${T(S0)}" data-duration="${T(sc.E - S0 + (sc === scenes.at(-1) ? 0 : XF))}">
  <div class="fade" id="${p}-fade"><div class="bg"></div><div class="cam" id="${p}-cam">${body}</div>${caps}</div>
</section>`;
}

const css = `
@font-face { font-family: "Space Grotesk"; src: url("assets/fonts/SpaceGrotesk.woff2") format("woff2"); font-weight: 300 700; }
@font-face { font-family: "Inter"; src: url("assets/fonts/Inter.woff2") format("woff2"); font-weight: 100 900; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #070b14; }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Inter", sans-serif; color: #f8fafc; }
.clip { position: absolute; inset: 0; overflow: hidden; }
.bg { position: absolute; inset: 0; background: radial-gradient(1200px 700px at 20% 10%, #16233f 0%, transparent 60%), radial-gradient(900px 700px at 90% 100%, #2a1608 0%, transparent 60%), #070b14; }
.s-title .bg, .s-offer .bg, .s-call .bg { background: radial-gradient(1000px 800px at 75% 40%, #3a1c06 0%, transparent 65%), radial-gradient(900px 600px at 10% 0%, #15284a 0%, transparent 60%), #060910; }
.s-rules .bg, .s-script .bg { background: radial-gradient(1200px 800px at 50% 30%, #13233f, transparent 70%), #070b14; }
.fade, .cam { position: absolute; inset: 0; }
.cam { transform-origin: 50% 45%; }
.h { opacity: 0; visibility: hidden; }
.pos, .kicker, .bub, .counter, .note, .tag, .badge, .notif, .pill, .flag, .dot, .chart, .hand, .rings, .stage3d { position: absolute; }
.who svg { width: 100%; height: 100%; display: block; overflow: visible; }
.g { color: #60a5fa; } .o { color: #ff7a2f; } .dim { color: #94a3b8; }
.kicker { font-family: "Space Grotesk"; font-weight: 700; font-size: 34px; letter-spacing: .14em; text-transform: uppercase; color: #ff7a2f; padding-left: 26px; border-left: 8px solid #ff7a2f; }
.note { font-family: "Space Grotesk"; font-weight: 700; font-size: 64px; line-height: 1.1; letter-spacing: -.02em; }
.tag { padding: 20px 34px; border-radius: 26px; background: #fff; color: #0b1220; font-family: "Space Grotesk"; font-weight: 700; font-size: 46px; box-shadow: 0 24px 60px rgba(0,0,0,.45); }
.pill { padding: 16px 30px; border-radius: 999px; background: rgba(251,188,4,.14); border: 3px solid #fbbc04; color: #fde68a; font-weight: 800; font-size: 36px; white-space: nowrap; }
/* captions */
.cap { position: absolute; left: 0; right: 0; bottom: 46px; margin: 0 auto; width: fit-content; max-width: 1500px; padding: 14px 30px; border-radius: 16px; background: rgba(4,7,14,.72); backdrop-filter: blur(6px); font-size: 40px; font-weight: 700; line-height: 1.3; text-align: center; z-index: 50; opacity: 0; visibility: hidden; color: rgba(255,255,255,.5); }
/* scene: open */
.shop .wall { position: absolute; inset: 0 0 260px; background: linear-gradient(180deg, #1c2a44, #142036); }
.shop .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 260px; background: repeating-linear-gradient(90deg, #e5e7eb 0 80px, #111827 80px 160px); opacity: .22; }
.shop .mirror { position: absolute; left: 240px; top: 140px; width: 380px; height: 460px; border-radius: 190px 190px 24px 24px; border: 14px solid #b45309; background: linear-gradient(135deg, #93c5fd33, #1e293b); }
.shop .chair { position: absolute; left: 330px; top: 620px; width: 220px; height: 200px; border-radius: 30px; background: #7f1d1d; }
.shop .pole { position: absolute; right: 180px; top: 160px; width: 70px; height: 380px; border-radius: 35px; background: repeating-linear-gradient(-45deg, #dc2626 0 30px, #fff 30px 60px, #2563eb 60px 90px, #fff 90px 120px); box-shadow: 0 0 40px #dc262666; }
.set { position: absolute; inset: 0; }
.bub { padding: 22px 34px; border-radius: 32px; background: #fff; color: #0b1220; font-family: "Space Grotesk"; font-weight: 700; font-size: 44px; box-shadow: 0 24px 60px rgba(0,0,0,.4); white-space: nowrap; z-index: 9; }
.bub.alt { background: #dcfce7; }
.counter { right: 120px; top: 90px; display: flex; flex-direction: column; align-items: center; padding: 28px 44px; border-radius: 30px; background: rgba(7,11,20,.88); border: 3px solid #334155; }
.counter span { font-size: 30px; font-weight: 700; color: #94a3b8; } .counter b { font-family: "Space Grotesk"; font-size: 170px; line-height: 1; color: #fff; }
/* title */
.ttl { position: absolute; left: 130px; top: 300px; width: 1100px; font-family: "Space Grotesk"; font-weight: 700; font-size: 78px; line-height: 1.08; letter-spacing: -.03em; }
.ttl .big { margin-top: 26px; font-size: 118px; }
.glow { position: absolute; left: 1150px; top: 120px; width: 760px; height: 840px; background: radial-gradient(closest-side, rgba(255,122,47,.45), transparent); }
.stage3d { perspective: 1800px; }
.c3d { position: relative; width: 460px; height: 728px; transform-style: preserve-3d; }
.c3d.sm { width: 300px; height: 475px; }
.c3d .face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 38px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,.55); }
.c3d .face svg { width: 100%; height: 100%; display: block; }
.c3d .back { transform: rotateY(180deg); }
/* truth */
.door { position: absolute; left: 1250px; top: 230px; width: 340px; height: 600px; }
.door .frame { position: absolute; inset: 0; border: 16px solid #92400e; border-bottom: 0; border-radius: 12px 12px 0 0; background: linear-gradient(180deg, #fde68a22, #0000); }
.door .sign { position: absolute; left: 50%; top: -70px; transform: translateX(-50%); padding: 10px 24px; background: #16a34a; border-radius: 10px; font-weight: 800; font-size: 28px; white-space: nowrap; }
/* phone */
.phone { position: relative; width: 420px; height: 840px; border-radius: 64px; background: #05070c; border: 14px solid #273142; box-shadow: 0 50px 100px rgba(0,0,0,.6), inset 0 0 0 2px #3b475a; overflow: hidden; }
.phone .notch { position: absolute; left: 50%; top: 14px; width: 130px; height: 34px; margin-left: -65px; border-radius: 20px; background: #000; z-index: 5; }
.phone .screen { position: absolute; inset: 0; background: #0f172a; }
.scr { position: absolute; inset: 0; padding: 80px 26px 30px; }
.hs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; padding-top: 30px; }
.hs span { display: flex; align-items: center; justify-content: center; width: 74px; height: 74px; border-radius: 20px; background: #1e293b; font-size: 40px; }
.hs span svg { width: 44px; height: 44px; }
.gs { background: #fff; color: #202124; border-radius: 26px; height: 100%; padding: 30px 22px; }
.glogo { display: flex; justify-content: center; margin: 70px 0 40px; } .glogo svg { width: 120px; height: 120px; }
.sbar { padding: 18px 24px; border-radius: 999px; border: 2px solid #dadce0; color: #5f6368; font-size: 24px; }
.sbar.on { border-color: #4285f4; color: #202124; font-weight: 600; }
.caret { display: inline-block; width: 3px; height: 26px; margin-left: 4px; background: #4285f4; vertical-align: middle; }
.res { height: 110px; margin-top: 22px; border-radius: 16px; background: linear-gradient(90deg, #f1f3f4 60%, #e8eaed); }
.lst .li { padding: 18px 16px; border-bottom: 1px solid #e8eaed; font-size: 26px; } .lst .li small { display: block; margin-top: 6px; }
.lst .li.on { background: #e8f0fe; border-radius: 14px; }
.mini { display: inline-block; width: 22px; height: 22px; color: #fbbc04; } .mini svg { width: 100%; height: 100%; fill: currentColor; }
.biz { font-size: 34px; font-weight: 700; margin: 10px 0 18px; } .tabs { display: flex; gap: 18px; font-size: 22px; color: #5f6368; border-bottom: 2px solid #e8eaed; padding-bottom: 10px; } .tabs .on { color: #1a73e8; font-weight: 700; }
.wr { margin-top: 26px; padding: 18px; text-align: center; border-radius: 999px; border: 2px solid #1a73e8; color: #1a73e8; font-weight: 700; font-size: 24px; }
.steps { position: absolute; left: 700px; top: 220px; display: flex; flex-direction: column; gap: 22px; }
.step { display: flex; align-items: center; gap: 26px; font-family: "Space Grotesk"; font-weight: 700; font-size: 50px; }
.step .num { display: flex; align-items: center; justify-content: center; width: 78px; height: 78px; border-radius: 50%; background: #ff7a2f; color: #fff; font-size: 42px; flex: none; }
.barw { position: absolute; left: 700px; top: 850px; width: 760px; font-size: 26px; font-weight: 700; color: #94a3b8; }
.barw em { font-style: normal; font-size: 20px; color: #64748b; margin-left: 12px; }
.bart { margin-top: 12px; height: 24px; border-radius: 12px; background: #1e293b; overflow: hidden; } .bar { height: 100%; background: linear-gradient(90deg, #ef4444, #f59e0b); transform-origin: 0 50%; }
.badge { padding: 26px 40px; border-radius: 30px; background: #ef4444; font-family: "Space Grotesk"; font-weight: 700; font-size: 80px; line-height: 1; text-align: center; transform: rotate(-4deg); box-shadow: 0 30px 70px rgba(239,68,68,.4); }
.badge small { font-size: 34px; }
.notif { padding: 22px 30px; width: 520px; border-radius: 26px; background: rgba(248,250,252,.96); color: #0b1220; font-size: 34px; font-weight: 600; box-shadow: 0 24px 60px rgba(0,0,0,.5); z-index: 8; }
.gone { position: absolute; left: 0; right: 0; top: 400px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 140px; letter-spacing: -.03em; color: #fff; text-shadow: 0 10px 60px rgba(0,0,0,.8); z-index: 9; }
/* moment */
.chart { overflow: visible; }
.dot { left: 0; top: 0; width: 36px; height: 36px; border-radius: 50%; background: #fff; box-shadow: 0 0 30px #fbbc04, 0 0 0 8px rgba(251,188,4,.35); }
.flag { padding: 14px 26px; border-radius: 18px; background: #fbbc04; color: #1f1300; font-weight: 800; font-size: 34px; white-space: nowrap; }
.vigs { position: absolute; right: 90px; top: 150px; display: flex; flex-direction: column; gap: 28px; }
.vig { display: flex; align-items: center; gap: 26px; width: 560px; padding: 26px 32px; border-radius: 30px; background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid #334155; }
.vig span { font-size: 90px; } .vig b { font-family: "Space Grotesk"; font-size: 44px; }
/* tap */
.hand { left: 380px; top: 640px; font-size: 200px; transform: rotate(-10deg); z-index: 3; }
.rings { width: 0; height: 0; z-index: 4; }
.ring { position: absolute; left: -110px; top: -110px; width: 220px; height: 220px; border-radius: 50%; border: 6px solid #60a5fa; opacity: 0; }
.lock { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 150px; background: linear-gradient(160deg, #1d4ed8, #7c3aed); }
.lock b { font-family: "Space Grotesk"; font-size: 110px; font-weight: 600; } .lock small { font-size: 30px; opacity: .85; }
.formw { position: absolute; inset: 0; background: #fff; }
.rf { color: #202124; padding: 70px 30px 30px; } .rf-top { display: flex; justify-content: space-between; align-items: center; font-size: 30px; color: #5f6368; } .rf-g svg { width: 40px; height: 40px; }
.rf-biz { margin-top: 40px; font-size: 40px; font-weight: 700; } .rf-sub { margin-top: 8px; font-size: 20px; color: #5f6368; }
.rf-stars { display: flex; gap: 12px; margin: 50px 0 40px; } .rs { display: block; width: 60px; height: 60px; color: #dadce0; } .rs svg { width: 100%; height: 100%; fill: currentColor; }
.rf-box { min-height: 200px; padding: 20px; border-radius: 14px; border: 2px solid #dadce0; font-size: 26px; line-height: 1.4; } .rf-type { display: inline; clip-path: inset(0 100% 0 0); }
.rf-post { margin-top: 30px; margin-left: auto; width: 150px; padding: 16px; text-align: center; border-radius: 999px; background: #1a73e8; color: #fff; font-weight: 700; font-size: 26px; }
.xs { position: absolute; left: 1290px; top: 330px; display: flex; flex-direction: column; gap: 22px; }
.x { font-family: "Space Grotesk"; font-weight: 700; font-size: 58px; color: #fca5a5; }
.posted { position: absolute; left: 1290px; top: 700px; padding: 22px 40px; border-radius: 999px; background: #16a34a; font-weight: 800; font-size: 44px; box-shadow: 0 20px 60px rgba(22,163,74,.45); }
/* real */
.photo { position: absolute; left: 0; top: 0; width: 1120px; height: 1080px; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, #000 70%, transparent); mask-image: linear-gradient(90deg, #000 70%, transparent); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.photo.side { left: auto; right: 0; width: 720px; opacity: .85; -webkit-mask-image: linear-gradient(270deg, #000 40%, transparent); mask-image: linear-gradient(270deg, #000 40%, transparent); }
.specs { position: absolute; left: 1030px; top: 190px; display: flex; flex-direction: column; gap: 24px; }
.spec { display: flex; align-items: center; gap: 26px; padding: 24px 36px; width: 780px; border-radius: 28px; background: rgba(15,23,42,.88); border: 2px solid #334155; backdrop-filter: blur(8px); }
.spec span { font-size: 60px; } .spec b { font-family: "Space Grotesk"; font-size: 46px; }
/* script */
.quote { position: absolute; left: 160px; top: 230px; width: 1600px; font-family: "Space Grotesk"; font-weight: 700; font-size: 88px; line-height: 1.16; letter-spacing: -.02em; transform-origin: 50% 0; }
.nop { position: absolute; left: 160px; top: 800px; font-size: 44px; font-weight: 800; color: #93c5fd; letter-spacing: .02em; }
.yes { position: absolute; left: 0; right: 0; top: 660px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 150px; } .yes b { color: #4ade80; }
/* where */
.grid5 { position: absolute; left: 120px; top: 230px; width: 1200px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.tile { display: flex; flex-direction: column; gap: 8px; padding: 30px 34px; border-radius: 34px; background: rgba(15,23,42,.9); border: 2px solid #334155; }
.tile span { font-size: 80px; } .tile b { font-family: "Space Grotesk"; font-size: 46px; } .tile small { font-size: 28px; color: #94a3b8; font-weight: 600; }
/* rules */
.rules { position: absolute; left: 140px; top: 280px; display: flex; flex-direction: column; gap: 40px; }
.rule { display: flex; align-items: center; gap: 40px; font-family: "Space Grotesk"; font-weight: 700; font-size: 74px; }
.rule p { margin: 0; }
.rule span { display: flex; align-items: center; justify-content: center; width: 120px; height: 120px; border-radius: 50%; font-size: 70px; flex: none; }
.rule.ok span { background: #16a34a; } .rule.no span { background: #dc2626; } .rule b { color: #4ade80; }
/* matters */
.map { position: absolute; left: 140px; top: 180px; width: 1000px; height: 760px; border-radius: 40px; background: #fff; color: #202124; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,.55); }
.mapbg { height: 250px; background: linear-gradient(135deg, #d6e9d0 0 30%, #e9eef3 30% 60%, #cfe3f5 60%); position: relative; }
.mapbg i { position: absolute; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #ea4335; } .mapbg i.me { background: #9aa0a6; }
.mq { position: absolute; left: 30px; top: 24px; padding: 14px 26px; border-radius: 999px; background: #fff; font-size: 26px; box-shadow: 0 6px 20px rgba(0,0,0,.18); }
.mp { display: flex; justify-content: space-between; align-items: center; margin: 18px 26px 0; padding: 22px 28px; border-radius: 22px; border: 2px solid #e8eaed; }
.mp b { display: block; font-size: 36px; } .mp .rt { font-size: 28px; color: #5f6368; font-weight: 700; } .mp em { font-style: normal; }
.callb { padding: 14px 26px; border-radius: 999px; background: #1a73e8; color: #fff; font-weight: 700; font-size: 26px; }
.illu { position: absolute; right: 26px; bottom: 16px; font-size: 20px; color: #9aa0a6; font-weight: 600; }
/* setup */
.clock { position: absolute; left: 1380px; top: 70px; padding: 18px 34px; border-radius: 999px; background: #ff7a2f; font-weight: 800; font-size: 48px; }
.flow { position: absolute; left: 140px; top: 240px; display: flex; flex-direction: column; gap: 30px; }
.fs { display: flex; align-items: center; gap: 34px; width: 1400px; padding: 30px 40px; border-radius: 30px; background: rgba(15,23,42,.9); border: 2px solid #334155; font-family: "Space Grotesk"; font-weight: 700; font-size: 54px; }
.fs b { display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; border-radius: 50%; background: #2563eb; font-size: 46px; flex: none; }
.fs.alt { border-color: #ff7a2f; } .fs.alt b { background: #ff7a2f; font-size: 34px; }
.chips { position: absolute; left: 140px; top: 830px; display: flex; gap: 24px; }
.chip { padding: 18px 34px; border-radius: 999px; background: rgba(74,222,128,.14); border: 3px solid #4ade80; color: #bbf7d0; font-weight: 800; font-size: 38px; }
/* offer */
.packs { position: absolute; left: 110px; top: 170px; width: 1700px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
.pk { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 56px 20px 46px; border-radius: 40px; background: linear-gradient(180deg, #172238, #0c1322); border: 3px solid #334155; }
.pk small { font-size: 38px; font-weight: 800; color: #cbd5e1; } .pk b { font-family: "Space Grotesk"; font-size: 104px; letter-spacing: -.04em; line-height: 1.05; } .pk span { font-size: 30px; color: #94a3b8; font-weight: 600; }
.pk.hot { border-color: #ff7a2f; box-shadow: 0 0 80px rgba(255,122,47,.35); background: linear-gradient(180deg, #3a1b07, #170c05); }
.popb { position: absolute; top: -26px; padding: 10px 26px; border-radius: 999px; background: #ff7a2f; font-weight: 800; font-size: 28px; white-space: nowrap; }
.perks { position: absolute; left: 0; right: 0; top: 590px; display: flex; justify-content: center; gap: 60px; font-size: 44px; font-weight: 800; }
.url { position: absolute; left: 0; right: 0; top: 720px; margin: 0 auto; width: fit-content; padding: 30px 60px; border-radius: 999px; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); font-family: "Space Grotesk"; font-weight: 700; font-size: 66px; box-shadow: 0 30px 80px rgba(255,90,10,.45); }
/* call */
.res2 { position: absolute; left: 520px; top: 230px; display: flex; gap: 30px; }
.rc { display: flex; flex-direction: column; padding: 34px 44px; border-radius: 34px; background: rgba(15,23,42,.92); border: 3px solid #22c55e; }
.rc b { font-family: "Space Grotesk"; font-size: 120px; line-height: 1; color: #4ade80; } .rc span { margin-top: 10px; font-size: 32px; font-weight: 700; color: #cbd5e1; }
.src { position: absolute; left: 520px; top: 520px; font-size: 24px; color: #64748b; font-weight: 600; }
.checks { position: absolute; left: 520px; top: 610px; display: flex; gap: 26px; }
.ck { padding: 20px 34px; border-radius: 24px; background: rgba(37,99,235,.18); border: 3px solid #3b82f6; font-weight: 800; font-size: 40px; }
.endc { position: absolute; inset: 0; }
.ctas { position: absolute; left: 720px; top: 220px; display: flex; flex-direction: column; gap: 34px; }
.cta { display: flex; flex-direction: column; gap: 8px; padding: 34px 50px; border-radius: 34px; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); box-shadow: 0 30px 80px rgba(255,90,10,.4); }
.cta small { font-size: 32px; font-weight: 700; opacity: .92; } .cta b { font-family: "Space Grotesk"; font-size: 54px; letter-spacing: -.02em; }
.cta.call { background: linear-gradient(180deg, #3b82f6, #1d4ed8); box-shadow: 0 30px 80px rgba(37,99,235,.4); }
.fin { margin-top: 20px; font-family: "Space Grotesk"; font-weight: 700; font-size: 64px; }
.callicon { position: absolute; display: flex; align-items: center; justify-content: center; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #4ade80, #15803d); font-size: 120px; box-shadow: 0 0 0 16px rgba(74,222,128,.18), 0 30px 80px rgba(22,163,74,.45); }
.callicon.big { width: 300px; height: 300px; font-size: 160px; }
#grain { position: absolute; inset: 0; pointer-events: none; z-index: 60; opacity: .06; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
#vignette { position: absolute; inset: 0; pointer-events: none; z-index: 59; background: radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,.42)); }
`;

const page = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>${esc(TITLE)}</title><script src="assets/gsap.min.js"></script>
<style>${css}${mod.CSS ?? ""}</style></head>
<body>
<div id="root" data-composition-id="${EP}" data-start="0" data-duration="${T(TOTAL)}" data-width="${W}" data-height="${H}" data-fps="30">
${html}
<div id="vignette"></div><div id="grain"></div>
<audio id="mix" src="assets/audio/${EP}.wav" data-start="0" data-duration="${T(TOTAL)}" data-volume="1"></audio>
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${tl.join("\n")}
window.__timelines["${EP}"] = tl;
</script>
</body></html>
`;

rmSync(OUT, { recursive: true, force: true });
for (const d of ["assets/fonts", "assets/audio", "assets/img"]) mkdirSync(path.join(OUT, d), { recursive: true });
copyFileSync(path.join(ADS, "gsap.min.js"), path.join(OUT, "assets/gsap.min.js"));
for (const f of ["Inter.woff2", "SpaceGrotesk.woff2"]) copyFileSync(path.join(ADS, "fonts", f), path.join(OUT, "assets/fonts", f));
for (const f of ["card-tap", "card-counter", "card-hero"]) copyFileSync(path.join(IMG, `${f}-1600.webp`), path.join(OUT, `assets/img/${f}.webp`));
writeFileSync(path.join(OUT, "index.html"), page);
writeFileSync(path.join(OUT, "hyperframes.json"), JSON.stringify({ paths: { assets: "assets" }, media: { autoProxy: true } }, null, 2) + "\n");
writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ id: EP, name: EP }, null, 2) + "\n");

// YouTube description with chapters from the real scene times
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
const chapters = scenes.filter((s, i) => i === 0 || s.chapter !== scenes[i - 1].chapter).map((s, i) => `${i === 0 ? "0:00" : mmss(s.S)} ${s.chapter}`);
mkdirSync(path.join(HERE, "renders"), { recursive: true });
if (!mod.SIZE) writeFileSync(path.join(HERE, "renders", `${EP}-youtube.txt`), `${TITLE}

Get the one-tap Google review card (from $16.99, free US shipping): https://${LINKS.cards}
Want more calls, not just reviews? Book a free 30-minute Brand Boost call: https://${LINKS.call}

Chapters
${chapters.join("\n")}

Ad results shown are real Meta Ads numbers: https://ceoturbo.com/results
The map-pack listings are an illustrative example. CEO Turbo review cards are an independent product and are not made or endorsed by Google.
`);
console.log(`${scenes.length} scenes · ${TOTAL.toFixed(1)}s (${mmss(TOTAL)})`);
console.log(chapters.join("\n"));

if (process.argv.includes("--no-audio")) process.exit(0);

// ---- audio: warm the voice, duck the bed under it, master to -14 LUFS ----
const bed = path.join(OUT, "bed.wav");
synthBed(scenes.map((s) => ({ t: s.S, n: s.music || "soft" })), sfx, TOTAL, bed);
const vo = scenes.flatMap((s) => s.L);
const inputs = vo.flatMap((l) => ["-i", voPath(EP, l)]);
const graph = vo.map((l, i) => `[${i}]aresample=48000:filter_size=64:phase_shift=10:cutoff=0.97,afade=t=in:d=0.012,areverse,afade=t=in:d=0.04,areverse,adelay=${Math.round(l.start * 1000)}:all=1[v${i}]`).join(";") + ";" + vo.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${vo.length}:normalize=0:dropout_transition=0,apad=whole_dur=${T(TOTAL)}[vo]`;
writeFileSync(path.join(OUT, "vo.graph"), graph);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex_script", path.join(OUT, "vo.graph"), "-map", "[vo]", "-t", T(TOTAL), "-ac", "1", path.join(OUT, "vo.wav")]);
const voice = "highpass=f=70,equalizer=f=200:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=1.5,equalizer=f=7500:t=q:w=2:g=-2.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=160:makeup=2,aecho=0.9:0.9:28|46:0.12|0.07,loudnorm=I=-16:TP=-2";
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(OUT, "vo.wav"), "-i", bed, "-filter_complex",
  `[0]${voice}[v];[v]asplit=2[v1][v2];[1]aresample=48000,volume=0.42[b];[b][v1]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=600[d];[d][v2]amix=inputs=2:normalize=0:duration=longest[m];[m]loudnorm=I=-14:TP=-1.5:LRA=11[out]`,
  "-map", "[out]", "-ar", "48000", "-ac", "2", path.join(OUT, `assets/audio/${EP}.wav`)]);
rmSync(path.join(OUT, "vo.wav")); rmSync(bed); rmSync(path.join(OUT, "vo.graph"));
console.log(`audio → .build/${EP}/assets/audio/${EP}.wav`);
