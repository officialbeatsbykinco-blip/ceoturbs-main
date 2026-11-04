// Builds a FIVE STARS episode into a HyperFrames project: .build/<ep>/index.html + mixed audio.
//   node vo.mjs ep1 && node build.mjs ep1
//   then inside .build/ep1: npx hyperframes render --quality standard --output ../../renders/five-stars-ep1.mp4
// Timing comes from the real voice-line lengths, so the cut always fits the performance.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { person, dog, W, H } from "./cast.mjs";
import { setHtml } from "./sets.mjs";
import { voPath } from "./vo.mjs";
import { synthBed } from "./music.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EP = process.argv[2] || "ep1";
const { SHOTS, TITLE, EPISODE } = await import(`./${EP}.mjs`);
const OUT = path.join(HERE, ".build", EP);
const ADS = path.join(HERE, "../ceoturbo-ads/assets");
const FEET = 940;
const GAP = 0.22;

const probe = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString();
const T = (n) => (+n).toFixed(3);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const NAMES = { dale: ["DALE", "#60a5fa"], okafor: ["MRS. OKAFOR", "#c4b5fd"], juno: ["JUNO", "#4ade80"], gary: ["GARY", "#fbbf24"], banker: ["BANKER", "#cbd5e1"], customer: ["CUSTOMER", "#5eead4"], brenda: ["BRENDA", "#f9a8d4"], driver: ["VAN DRIVER", "#fca5a5"], frank: ["FRANK", "#d1d5db"], mayor: ["THE MAYOR", "#f87171"], chorus: ["EVERYONE", "#fbbc04"], halo: ["HALO APP", "#fbbc04"] };
const tier = (v) => (v >= 4.995 ? "gold" : v >= 4.5 ? "green" : v >= 4 ? "lime" : v >= 3 ? "amber" : "red");
const decs = (...v) => (v.some((x) => Math.round(x * 100) % 10) ? 2 : 1);

// ---- timing ----
let clock = 0;
const shots = SHOTS.map((s, i) => {
  const start = clock;
  let c = start + (s.lead ?? 0.35);
  const lines = s.lines.map((l) => {
    const dur = l.who ? probe(voPath(EP, l)) : l.beat;
    const o = { ...l, start: c, dur };
    c += dur + (l.who ? GAP : 0);
    return o;
  });
  const end = c + (s.pad ?? 0.3);
  clock = end;
  return { ...s, i, id: `s${i}`, start, end, lines, cast: s.cast || [] };
});
const TOTAL = clock;

// ---- build ----
const tl = [];
const sfx = [];
const proxies = [];
const music = [];
const add = (code) => tl.push(code);

function chrHtml(sh, c) {
  const id = `${sh.id}-${c.c}`;
  const s = c.s ?? (c.tall ? 1.06 : 1);
  const isDog = c.c === "biscuit";
  const w = isDog ? 300 * 0.9 : W * s;
  const h = isDog ? 220 * 0.9 : H * s;
  const left = c.x - w / 2;
  const top = (c.y ?? FEET) - h;
  const z = c.behind ? 3 : 7;
  const v = c.r;
  const halo = v == null ? "" : `<div class="hw" style="top:${c.sleep ? 140 : -84}px"><div class="halo ${tier(v)}" id="${id}-h"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><b>${v.toFixed(decs(v))}</b></div></div>`;
  const body = isDog ? dog() : person(c.c, c.sleep ? "sleep" : c.mood || "smile", { xray: c.xray, waiter: c.waiter });
  const bodyStyle = [c.flip ? "transform:scaleX(-1)" : "", c.sleep ? "transform:rotate(-90deg)" : ""].filter(Boolean).join(";");
  const extras = `<div class="mini" style="left:${c.flip ? 4 : w - 64}px;top:${h * 0.62}px">📱</div>${c.pie ? `<div class="pieon">🥧</div>` : ""}<div class="glass" style="left:${c.flip ? -30 : w - 40}px;top:${h * 0.18}px">🥂</div>`;
  const pos = c.sleep ? `left:${600 - w / 2}px;top:${560 - h / 2}px` : `left:${left}px;top:${top}px`;
  return `<div class="chr" id="${id}" style="${pos};width:${w}px;height:${h}px;z-index:${z}"><div class="body" style="${bodyStyle}">${body}</div>${halo}${extras}</div>`;
}

const speakers = (sh, who) => {
  if (who === "customer") return sh.cast.filter((c) => c.c === "extra6").map((c) => c.c);
  if (who === "brenda") return sh.cast.filter((c) => c.c === "extra1").map((c) => c.c);
  if (who === "chorus") return sh.cast.filter((c) => c.c !== "dale" && c.c !== "biscuit").map((c) => c.c);
  return sh.cast.some((c) => c.c === who) ? [who] : [];
};
const mood = (sh, c, m, t) => {
  if (!sh.cast.some((x) => x.c === c)) return;
  add(`tl.set("#${sh.id}-${c} [class^='m-']", { opacity: 0 }, ${T(t)}); tl.set("#${sh.id}-${c} .m-${m}", { opacity: 1 }, ${T(t)});`);
};
const rating = {};
function rate(sh, c, to, t, d = 1.2) {
  const key = `${sh.id}-${c}`;
  const from = rating[key];
  const p = `r_${key.replace(/-/g, "_")}`;
  if (!proxies.includes(p)) { proxies.push(p); add(`const ${p} = { v: ${from} };`); }
  const dp = decs(from, to);
  add(`tl.to(${p}, { v: ${to}, duration: ${T(d)}, ease: "power1.inOut", onUpdate() { halo("${key}-h", ${p}.v, ${dp}); } }, ${T(t)});`);
  add(`tl.fromTo("#${key}-h", { scale: 1.35 }, { scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, ${T(t + d)});`);
  rating[key] = to;
  sfx.push({ t: t + d * 0.9, n: to >= from ? "ding" : "buzz" });
}

// Effects. Shot-level ones get t = shot start; sh.lines[i].start gives line times.
const FX = {
  haloPulse: (sh, t) => add(`tl.to("#${sh.id} .halo", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, stagger: 0.12 }, ${T(t)});`),
  carPark: (sh, t) => {
    sfx.push({ t: t + 0.5, n: "car" });
    add(`tl.from("#${sh.id}-car", { x: -1100, duration: 1.6, ease: "power3.out" }, ${T(t + 0.5)});`);
    return `<div id="${sh.id}-car" class="fx" style="left:420px;top:700px;font-size:300px;transform:scaleX(-1);line-height:1;z-index:6">🚙</div><div class="fx sign" style="left:880px;top:560px;z-index:4">★ 4.5+ PARKING ONLY</div>${`<div class="fx" style="left:960px;top:620px;width:12px;height:320px;background:#57534e;z-index:3"></div>`}`;
  },
  wag: (sh, t) => add(`tl.to("#${sh.id}-biscuit .tail", { rotation: 28, transformOrigin: "0% 100%", duration: 0.12, yoyo: true, repeat: 15 }, ${T(t)});`),
  wave: (sh, t) => add(`tl.to("#${sh.id}-dale .armR", { rotation: -165, transformOrigin: "50% 6%", duration: 0.25 }, ${T(t)}); tl.to("#${sh.id}-dale .armR", { rotation: -135, duration: 0.16, yoyo: true, repeat: 5 }, ${T(t + 0.25)}); tl.to("#${sh.id}-dale .armR", { rotation: 0, duration: 0.3 }, ${T(t + 1.3)});`),
  flicker: (sh, t) => { sfx.push({ t, n: "buzz" }); add(`tl.to("#${sh.id}-dale-h", { opacity: 0.25, duration: 0.07, yoyo: true, repeat: 7, ease: "steps(1)" }, ${T(t)});`); },
  stamp: (sh, t, o) => {
    sfx.push({ t, n: "stamp" });
    add(`tl.fromTo("#${sh.id}-stamp", { scale: 3, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.18, ease: "power4.in", immediateRender: true }, ${T(t - 0.18)}); shake("${sh.id}", ${T(t)}, 18);`);
    return `<div id="${sh.id}-stamp" class="fx stamp" style="left:660px;top:330px;z-index:9">${esc(o.text)}</div>`;
  },
  van: (sh) => {
    const L = sh.lines.map((l) => l.start);
    sfx.push({ t: L[1], n: "van" }, { t: L[8], n: "van" });
    add(`tl.fromTo("#${sh.id}-van", { x: 1500 }, { x: 0, duration: 1.3, ease: "power3.out" }, ${T(L[1])});`);
    add(`tl.to("#${sh.id}-extra5", { x: 120, opacity: 0, duration: 0.7, ease: "power2.in" }, ${T(L[2] + 1.6)});`);
    add(`tl.to("#${sh.id}-van", { x: 1700, duration: 1.4, ease: "power3.in" }, ${T(L[8])});`);
    return `<div id="${sh.id}-van" class="fx van" style="left:700px;top:520px;z-index:8"><div class="vw"><div class="drv">${person("agent", "grin")}</div></div><div class="vdoor"></div><div class="vt">REVIEWED<span>★</span></div><div class="wh" style="left:110px"></div><div class="wh" style="left:560px"></div></div>`;
  },
  doorChime: (sh, t) => {
    sfx.push({ t: t + 0.4, n: "chime" });
    add(`tl.from("#${sh.id}-okafor", { x: -760, duration: 1.8, ease: "power2.out" }, ${T(t + 0.5)}); tl.to("#${sh.id}-okafor-h", { boxShadow: "0 0 60px #fbbc04", duration: 0.6, yoyo: true, repeat: 5 }, ${T(t + 1.2)});`);
  },
  pieTrip: (sh, t) => {
    const L = sh.lines.map((l) => l.start);
    const trip = L[1] + 0.25;
    sfx.push({ t: trip, n: "whoosh" }, { t: trip + 1.05, n: "splat" }, { t: trip + 0.5, n: "thud" });
    add(`tl.to(["#${sh.id}-dale", "#${sh.id}-pie"], { x: -330, duration: ${T(trip - t - 0.4)}, ease: "none" }, ${T(t + 0.3)});`);
    add(`tl.to("#${sh.id}-dale .body", { y: -10, duration: 0.18, yoyo: true, repeat: ${2 * Math.floor((trip - t - 0.4) / 0.36) + 1} }, ${T(t + 0.3)});`);
    mood(sh, "dale", "shock", trip);
    add(`tl.to("#${sh.id}-dale", { rotation: -80, y: 120, transformOrigin: "50% 100%", duration: 0.5, ease: "power2.in" }, ${T(trip)});`);
    add(`tl.to("#${sh.id}-pie", { x: -880, rotation: -540, duration: 1.0, ease: "none" }, ${T(trip + 0.05)}); tl.to("#${sh.id}-pie", { y: -470, duration: 0.5, ease: "power2.out" }, ${T(trip + 0.05)}); tl.to("#${sh.id}-pie", { y: -300, duration: 0.5, ease: "power2.in" }, ${T(trip + 0.55)});`);
    add(`tl.to("#${sh.id}-pie", { scaleY: 0.55, scaleX: 1.4, rotation: 0, duration: 0.12 }, ${T(trip + 1.05)}); shake("${sh.id}", ${T(trip + 1.05)}, 14);`);
    mood(sh, "okafor", "neutral", trip + 1.05);
    add(`tl.to("#${sh.id}-biscuit .head", { rotation: -12, transformOrigin: "50% 80%", duration: 0.3, yoyo: true, repeat: 1 }, ${T(trip + 1.4)});`);
    return `<div id="${sh.id}-pie" class="fx" style="left:1240px;top:720px;font-size:96px;z-index:9">🥧</div>`;
  },
  phones: () => {},
  townSign: (sh, t) => { add(`tl.from("#${sh.id}-tsign", { y: -500, duration: 0.7, ease: "bounce.out" }, ${T(t)});`); sfx.push({ t: t + 0.5, n: "thud" }); return `<div id="${sh.id}-tsign" class="fx tsign" style="left:760px;top:180px;z-index:6">WELCOME TO BRIGHTWATER<small>The Happiest Town in America</small><div class="halo gold" style="position:absolute;right:-40px;top:-50px;font-size:34px">★ 4.7</div></div>`; },
  rateTap: (sh) => { const t = sh.lines[1].start + 0.4; sfx.push({ t: t + 0.5, n: "tap" }); add(`tl.to("#${sh.id}-extra1 .mini", { autoAlpha: 1, y: -150, duration: 0.3, ease: "back.out(2)" }, ${T(t)}); tl.to("#${sh.id}-extra1 .mini", { scale: 1.3, duration: 0.1, yoyo: true, repeat: 1 }, ${T(t + 0.5)});`); },
  phoneUp: (sh, t, o) => { sfx.push({ t, n: "ding" }); add(`tl.to("#${sh.id}-${o.c} .mini", { autoAlpha: 1, y: -150, duration: 0.3, ease: "back.out(2)" }, ${T(t)});`); },
  walkOff: (sh, t, o) => { sfx.push({ t, n: "steps" }); add(`tl.to("#${sh.id}-${o.c}", { x: 1100, duration: 1.8, ease: "power1.in" }, ${T(t)});`); },
  carryLady: (sh, t) => { add(`tl.set("#${sh.id}-extra3", { y: -150, rotation: 14 }, ${T(t)}); tl.to(["#${sh.id}-dale", "#${sh.id}-extra3"], { x: 760, duration: ${T(sh.end - t)}, ease: "none" }, ${T(t)}); tl.to("#${sh.id}-dale .body", { y: -10, duration: 0.2, yoyo: true, repeat: ${2 * Math.floor((sh.end - t) / 0.4) + 1} }, ${T(t)}); tl.to("#${sh.id}-extra3 .armL, #${sh.id}-extra3 .armR", { rotation: -40, transformOrigin: "50% 6%", duration: 0.15, yoyo: true, repeat: ${2 * Math.floor((sh.end - t) / 0.3) + 1} }, ${T(t)});`); },
  phonesUp: (sh, t) => { sfx.push({ t, n: "buzzes" }); add(`tl.to("#${sh.id} .chr:not(#${sh.id}-okafor) .mini", { autoAlpha: 1, y: -170, duration: 0.25, stagger: 0.15, ease: "back.out(2)" }, ${T(t)});`); },
  okaforTap: (sh, t) => { sfx.push({ t: t + 0.4, n: "tap" }); add(`tl.to("#${sh.id}-okafor .mini", { autoAlpha: 1, y: -150, duration: 0.3, ease: "back.out(2)" }, ${T(t)}); tl.to("#${sh.id}-okafor .mini", { scale: 1.3, duration: 0.1, yoyo: true, repeat: 1 }, ${T(t + 0.4)});`); },
  doors: (sh, t) => {
    add(`tl.to("#${sh.id}-dale .armR", { rotation: -70, transformOrigin: "50% 6%", duration: 0.3 }, ${T(t + 0.2)}); tl.to("#${sh.id}-extra3", { x: 700, duration: ${T(sh.end - t)}, ease: "none" }, ${T(t)}); tl.to("#${sh.id}-extra3 .body", { y: -8, duration: 0.2, yoyo: true, repeat: ${2 * Math.floor((sh.end - t) / 0.4) + 1} }, ${T(t)});`);
    return `<div class="fx" style="left:830px;top:520px;width:200px;height:400px;border:16px solid #78350f;background:#1c1917;z-index:2"></div><div class="fx" style="left:846px;top:536px;width:168px;height:384px;background:#a16207;transform:perspective(800px) rotateY(-62deg);transform-origin:left center;z-index:2"></div>`;
  },
  lemonade: () => `<div class="fx" style="left:1430px;top:740px;width:420px;height:200px;background:#fde68a;border:8px solid #a16207;z-index:2"></div><div class="fx sign" style="left:1420px;top:560px;z-index:2;font-size:34px;background:#fef9c3;color:#713f12">LEMONADE · ★ 1 STAR<br><small style="font-size:24px">TASTES FINE</small></div><div class="fx" style="left:1740px;top:640px;font-size:90px;z-index:2">🍋</div>`,
  fiveBack: (sh, t) => {
    sfx.push({ t, n: "ding" }, { t: t + 0.9, n: "ding" });
    add(`tl.fromTo("#${sh.id}-b1", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "back.out(2)" }, ${T(t)}); tl.fromTo("#${sh.id}-b2", { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "back.out(2)" }, ${T(t + 0.9)});`);
    return `<div id="${sh.id}-b1" class="fx bub" style="left:760px;top:250px">★★★★★ ←</div><div id="${sh.id}-b2" class="fx bub" style="left:560px;top:380px">→ ★★★★★</div>`;
  },
  townGlow: (sh, t) => { add(`tl.to("#${sh.id}-glow", { opacity: 0.55, duration: 3, ease: "sine.inOut" }, ${T(t + 0.4)});`); return `<div id="${sh.id}-glow" class="fx" style="inset:0;background:radial-gradient(1200px 700px at 50% 40%,rgba(251,188,4,.55),transparent);opacity:0;z-index:6"></div>`; },
  envelope: (sh, t) => { sfx.push({ t, n: "whoosh" }); add(`tl.fromTo("#${sh.id}-env", { autoAlpha: 0, x: -200, rotation: -20 }, { autoAlpha: 1, x: 0, rotation: -6, duration: 0.6, ease: "back.out(1.6)" }, ${T(t)});`); return `<div id="${sh.id}-env" class="fx env" style="left:820px;top:560px;z-index:9">THE HILL<br>SATURDAY<br><b>★★★★★ ONLY</b></div>`; },
  smileHold: (sh, t) => { sfx.push({ t, n: "heart" }); add(`tl.to("#${sh.id}-cam2", { scale: 1.7, transformOrigin: "640px 520px", duration: 1.6, ease: "power2.in" }, ${T(t)});`); },
  nobodyEats: (sh) => Array.from({ length: 5 }, (_, i) => { add(`tl.fromTo("#${sh.id}-st${i}", { y: 0, opacity: 0.6 }, { y: -90, opacity: 0, duration: 1.6, repeat: ${Math.floor((sh.end - sh.start) / 1.6)}, ease: "none" }, ${T(sh.start + i * 0.3)});`); return `<div id="${sh.id}-st${i}" class="fx steam" style="left:${[252, 612, 972, 1332, 1692][i]}px;top:600px"></div>`; }).join(""),
  headsTurn: (sh, t) => {
    sfx.push({ t, n: "whoosh" });
    for (const c of sh.cast) if (c.c !== "dale") { mood(sh, c.c, "stare", t); mood(sh, c.c, c.mood || "grin", t + 1.4); }
    add(`tl.to("#${sh.id} .chr:not(#${sh.id}-dale) .body", { y: -14, duration: 0.1, yoyo: true, repeat: 1 }, ${T(t)});`);
  },
  twitch: (sh, t, o) => add(`tl.to("#${sh.id}-${o.c} .face", { x: 4, duration: 0.05, yoyo: true, repeat: 11, ease: "steps(1)" }, ${T(t)});`),
  toast: (sh, t) => add(`tl.to("#${sh.id}-okafor .armR", { rotation: -150, transformOrigin: "50% 6%", duration: 0.4 }, ${T(t)}); tl.to("#${sh.id}-okafor .glass", { autoAlpha: 1, duration: 0.2 }, ${T(t + 0.3)});`),
  sneeze: () => {},
  allStare: (sh, t) => { for (const c of sh.cast) if (c.c !== "dale" && c.c !== "mayor") mood(sh, c.c, "stare", t); shake(sh, t, 10); },
  vanMen: (sh, t) => {
    sfx.push({ t, n: "steps" });
    add(`tl.fromTo(["#${sh.id}-ag1", "#${sh.id}-ag2"], { x: 600 }, { x: 0, duration: 0.9, ease: "power2.out" }, ${T(t)});`);
    add(`tl.to(["#${sh.id}-ag1", "#${sh.id}-ag2", "#${sh.id}-mayor"], { x: 900, duration: 1.6, ease: "power2.in" }, ${T(t + 1.6)});`);
    return [["ag1", 1380], ["ag2", 1780]].map(([k, x]) => `<div class="chr" id="${sh.id}-${k}" style="left:${x - W / 2}px;top:${FEET - H}px;width:${W}px;height:${H}px;z-index:3"><div class="body">${person("agent", "grin")}</div><div class="hw" style="top:-84px"><div class="halo gold"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><b>5.0</b></div></div></div>`).join("");
  },
  fivePointZero: () => {},
  goldFlash: (sh, t) => { add(`tl.fromTo("#${sh.id}-gold", { opacity: 0.9 }, { opacity: 0, duration: 1.2, ease: "power2.out", immediateRender: false }, ${T(t)}); tl.to("#${sh.id}-dale-h", { scale: 1.8, boxShadow: "0 0 80px #fbbc04", duration: 0.4, ease: "back.out(2)" }, ${T(t)});`); return `<div id="${sh.id}-gold" class="fx" style="inset:0;background:#fbbc04;opacity:0;z-index:12"></div>`; },
  redDoor: (sh, t) => { sfx.push({ t: t + 0.6, n: "creak" }); add(`tl.to("#${sh.id} .doorpanel", { scaleX: 0.05, duration: 1.6, ease: "power2.inOut" }, ${T(t + 0.6)}); tl.to("#${sh.id} .doorglow", { opacity: 1, duration: 1.6 }, ${T(t + 0.6)});`); },
  doorSlam: (sh, t) => { add(`tl.to("#${sh.id} .doorpanel", { scaleX: 1, duration: 0.14, ease: "power4.in" }, ${T(t)}); tl.to("#${sh.id}-black", { opacity: 1, duration: 0.05 }, ${T(t + 0.14)});`); shake(sh, t + 0.14, 26); return `<div id="${sh.id}-black" class="fx" style="inset:0;background:#000;opacity:0;z-index:13"></div>`; },
};
function shake(sh, t, a) { add(`shake("${typeof sh === "string" ? sh : sh.id}", ${T(t)}, ${a});`); }

const OVER = {
  title: (sh) => {
    add(`tl.from("#${sh.id} .tt-star", { scale: 0, rotation: -90, duration: 0.35, stagger: 0.12, ease: "back.out(2.5)" }, ${T(sh.start + 0.3)}); tl.from("#${sh.id} .tt-word", { scale: 2.4, opacity: 0, duration: 0.3, stagger: 0.25, ease: "power4.in" }, ${T(sh.start + 0.6)}); tl.from("#${sh.id} .tt-ep", { y: 30, opacity: 0, duration: 0.5 }, ${T(sh.start + 1.6)});`);
    for (let k = 0; k < 5; k++) sfx.push({ t: sh.start + 0.3 + k * 0.12, n: "ding" });
    const [a, b] = TITLE.split(" ");
    return `<div class="over title"><div class="tt-stars">${"<span class='tt-star'>★</span>".repeat(5)}</div><div class="tt"><span class="tt-word">${a}</span> <span class="tt-word gold">${b}</span></div><div class="tt-ep">${esc(EPISODE)}</div></div>`;
  },
  rules: () => `<div class="over rules">${[["🏎️", "4.5", "THE FAST LANE"], ["🪟", "4.0", "THE WINDOW TABLE"], ["🚽", "3.0", "…A TABLE"]].map(([e, n, w], i) => `<div class="rule hid" id="rule${i}"><span class="re">${e}</span><span class="rn ${tier(+n)}">★ ${n}</span><span class="rw">${w}</span></div>`).join("")}</div>`,
  fiveAll: () => `<div class="over fiveall">${[["🧑‍🍳", "EVERYONE"], ["📬", "THE MAILMAN"], ["🎩", "THE MAYOR"], ["🥤", "A VENDING MACHINE"]].map(([e, w], i) => `<div class="tile hid" id="fa${i}"><div class="te">${e}</div><div class="tw">${w}</div><div class="ts">★★★★★</div></div>`).join("")}</div>`,
  phone: (sh) => {
    add(`tl.from("#${sh.id} .bigphone", { y: 900, duration: 0.7, ease: "power4.out" }, ${T(sh.start + 0.1)}); tl.from("#${sh.id} .note", { y: -60, opacity: 0, duration: 0.4, ease: "back.out(2)" }, ${T(sh.start + 0.9)}); tl.to("#${sh.id} .bigr", { textShadow: "0 0 70px #fbbc04", duration: 0.6, yoyo: true, repeat: 5 }, ${T(sh.start + 0.8)});`);
    sfx.push({ t: sh.start + 0.9, n: "ding" });
    const o = sh.over;
    return `<div class="over"><div class="bigphone"><div class="app">HALO <span>★</span></div><div class="avatar">${person("dale", "shock")}</div><div class="pname">${esc(o.name)}</div><div class="bigr">★ ${o.rating}</div><div class="note">${esc(o.note)}</div></div></div>`;
  },
  next: () => `<div class="over next"><div class="hid nx" id="nx0">NEXT TIME ON <span class="gold">FIVE STARS</span></div><div class="hid nx big" id="nx1">WHO RATES THE PEOPLE<br>WHO RATE EVERYONE?</div><div class="hid nx" id="nx2"><span class="gold">★★★★★</span> SUBSCRIBE & RATE</div><div class="hid nx small" id="nx3">We'll know if you don't.</div><div class="nx ep2">EPISODE 2: THE FOUNDERS</div></div>`,
};

let html = "";
for (const sh of shots) {
  for (const c of sh.cast) rating[`${sh.id}-${c.c}`] = c.r;
  const dur = sh.end - sh.start;
  music.push({ t: sh.start, n: sh.music || "none" });
  const cam = sh.cam || { from: 1, to: 1.04 };
  add(`tl.fromTo("#${sh.id}-cam", { scale: ${cam.from} }, { scale: ${cam.to}, duration: ${T(dur)}, ease: "none" }, ${T(sh.start)});`);
  let fxHtml = sh.fx ? FX[sh.fx](sh, sh.start) || "" : "";
  let k = 0;
  let caps = "";
  for (const l of sh.lines) {
    for (const a of l.do || []) {
      const t = l.start + (a.at || 0);
      if (a.rate) rate(sh, a.rate[0], a.rate[1], t, a.rate[2]);
      if (a.mood) mood(sh, a.mood[0], a.mood[1], t);
      if (a.sfx) sfx.push({ t, n: a.sfx });
      if (a.show) add(`tl.fromTo("${a.show}", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, ${T(t)});`);
      if (a.fx) fxHtml += FX[a.fx](sh, t, a) || "";
    }
    if (!l.who) continue;
    if (l.mood) mood(sh, l.who, l.mood, l.start);
    for (const c of speakers(sh, l.who)) {
      const r = 2 * Math.floor(l.dur / 0.18) + 1;
      if (l.grinTalk) add(`tl.to("#${sh.id}-${c} .face", { y: 2, duration: 0.09, yoyo: true, repeat: ${r} }, ${T(l.start)});`);
      else add(`tl.to("#${sh.id}-${c} .talk", { opacity: 1, duration: 0.09, yoyo: true, repeat: ${r}, ease: "steps(1)" }, ${T(l.start)});`);
      add(`tl.to("#${sh.id}-${c} .head", { rotation: 2.5, transformOrigin: "50% 90%", duration: 0.36, yoyo: true, repeat: ${2 * Math.floor(l.dur / 0.72) + 1}, ease: "sine.inOut" }, ${T(l.start)});`);
    }
    const capId = `${sh.id}-c${k++}`;
    const nm = l.who === "narr" ? "" : `<span class="nm" style="color:${NAMES[l.who][1]}">${NAMES[l.who][0]}</span>`;
    caps += `<div class="cap${l.who === "narr" ? " narr" : ""}" id="${capId}">${nm}${esc(l.t)}</div>`;
    add(`tl.set("#${capId}", { opacity: 1 }, ${T(l.start)}); tl.set("#${capId}", { opacity: 0 }, ${T(l.start + l.dur + 0.12)});`);
  }
  // blinks
  sh.cast.forEach((c, n) => { if (c.c === "biscuit" || c.sleep) return; for (let t = sh.start + 0.8 + n * 0.7; t < sh.end - 0.3; t += 3.2) add(`tl.to("#${sh.id}-${c.c} .eyes", { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.06, yoyo: true, repeat: 1 }, ${T(t)});`); });
  const set = setHtml(sh.set);
  const cast = sh.cast.map((c) => chrHtml(sh, c)).join("");
  const over = sh.over ? OVER[sh.over.type](sh) : "";
  const camO = `${cam.x ?? 960}px ${cam.y ?? 540}px`;
  html += `
<section class="clip shot" id="${sh.id}" data-start="${T(sh.start)}" data-duration="${T(dur)}">
  <div class="cam" id="${sh.id}-cam" style="transform-origin:${camO}"><div class="cam2" id="${sh.id}-cam2">
    <div class="layer" style="z-index:1">${set.bg}</div>${cast}${set.fg ? `<div class="layer" style="z-index:5">${set.fg}</div>` : ""}${fxHtml}
  </div></div>${over}${caps}
</section>`;
}

// ---- page ----
const page = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<title>${esc(TITLE)}: ${esc(EPISODE)}</title><script src="assets/gsap.min.js"></script>
<style>
@font-face { font-family: "Space Grotesk"; src: url("assets/fonts/SpaceGrotesk.woff2") format("woff2"); font-weight: 300 700; }
@font-face { font-family: "Inter"; src: url("assets/fonts/Inter.woff2") format("woff2"); font-weight: 100 900; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Inter", sans-serif; color: #fff; }
.clip { position: absolute; inset: 0; overflow: hidden; }
.cam, .cam2, .layer { position: absolute; inset: 0; }
.fx { position: absolute; }
.chr { position: absolute; }
.chr .body { position: absolute; inset: 0; }
.chr .body svg { width: 100%; height: 100%; display: block; overflow: visible; }
.hw { position: absolute; left: -100px; right: -100px; display: flex; justify-content: center; }
.halo { display: flex; align-items: center; gap: 8px; padding: 6px 18px 6px 12px; border-radius: 999px; background: rgba(8,12,22,.86); border: 4px solid; font-family: "Space Grotesk"; font-weight: 700; font-size: 40px; line-height: 1; }
.halo svg { width: 34px; height: 34px; fill: currentColor; }
.red { color: #ef4444; border-color: #ef4444; } .amber { color: #f59e0b; border-color: #f59e0b; } .lime { color: #a3e635; border-color: #a3e635; }
.green { color: #22c55e; border-color: #22c55e; } .gold { color: #fbbc04; border-color: #fbbc04; box-shadow: 0 0 30px rgba(251,188,4,.6); }
span.gold, .tt .gold, .nx .gold { box-shadow: none; }
.mini { position: absolute; font-size: 56px; opacity: 0; visibility: hidden; }
.glass { position: absolute; font-size: 70px; opacity: 0; visibility: hidden; }
.pieon { position: absolute; left: 50%; top: 30px; margin-left: -60px; font-size: 110px; transform: scaleY(.6); }
.sign { padding: 14px 24px; background: #1d4ed8; color: #fff; font-family: "Space Grotesk"; font-weight: 700; font-size: 40px; border-radius: 10px; text-align: center; }
.stamp { padding: 10px 50px; border: 14px solid #dc2626; color: #dc2626; font-family: "Space Grotesk"; font-weight: 700; font-size: 170px; border-radius: 24px; background: rgba(255,255,255,.85); opacity: 0; }
.van { width: 760px; height: 330px; background: #0b0b0f; border-radius: 40px 90px 20px 20px; box-shadow: 0 30px 60px rgba(0,0,0,.6); }
.van .vw { position: absolute; right: 30px; top: 30px; width: 200px; height: 130px; background: #1e293b; border-radius: 10px 60px 10px 10px; overflow: hidden; }
.van .drv { position: absolute; left: 30px; top: 10px; width: 140px; height: 315px; }
.van .drv svg { width: 100%; height: 100%; }
.van .vdoor { position: absolute; left: 260px; top: 40px; width: 180px; height: 260px; border: 4px solid #27272a; border-radius: 8px; }
.van .vt { position: absolute; left: 40px; top: 180px; font-family: "Space Grotesk"; font-weight: 700; font-size: 64px; color: #fbbc04; letter-spacing: .04em; }
.van .vt span { margin-left: 10px; }
.van .wh { position: absolute; bottom: -50px; width: 110px; height: 110px; border-radius: 50%; background: #111; border: 18px solid #3f3f46; }
.bub { padding: 18px 30px; border-radius: 30px; background: #fff; color: #fbbc04; font-family: "Space Grotesk"; font-weight: 700; font-size: 58px; box-shadow: 0 20px 50px rgba(0,0,0,.35); z-index: 9; opacity: 0; visibility: hidden; }
.env { padding: 26px 34px; background: linear-gradient(135deg,#fde68a,#d4a017); color: #3b2a05; font-family: "Space Grotesk"; font-weight: 700; font-size: 34px; line-height: 1.15; border-radius: 10px; box-shadow: 0 20px 50px rgba(0,0,0,.4); opacity: 0; visibility: hidden; }
.steam { width: 40px; height: 90px; border-radius: 50%; background: radial-gradient(closest-side,rgba(255,255,255,.5),transparent); z-index: 6; }
.hid { opacity: 0; visibility: hidden; }
.tsign { padding: 28px 46px; background: #166534; color: #fff; border: 8px solid #f8fafc; border-radius: 18px; font-family: "Space Grotesk"; font-weight: 700; font-size: 52px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,.3); }
.tsign small { display: block; font-family: "Inter"; font-weight: 600; font-size: 30px; opacity: .9; margin-top: 6px; }
.over { position: absolute; inset: 0; z-index: 20; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.title .tt-stars { font-size: 90px; color: #fbbc04; letter-spacing: 20px; text-shadow: 0 0 40px rgba(251,188,4,.7); }
.title .tt-star { display: inline-block; }
.title .tt { font-family: "Space Grotesk"; font-weight: 700; font-size: 250px; letter-spacing: -.04em; line-height: 1; }
.title .tt-word { display: inline-block; }
.title .tt-ep { margin-top: 30px; font-size: 52px; font-weight: 600; color: #cbd5e1; letter-spacing: .06em; text-transform: uppercase; }
.rules { gap: 40px; }
.rule { display: flex; align-items: center; gap: 40px; font-family: "Space Grotesk"; font-weight: 700; font-size: 96px; width: 1400px; }
.rule .re { font-size: 110px; width: 140px; } .rule .rn { padding: 6px 26px; border: 6px solid; border-radius: 999px; font-size: 80px; } .rule .rw { color: #fff; }
.fiveall { flex-direction: row; gap: 36px; }
.tile { width: 390px; height: 520px; border-radius: 40px; background: #0f1a2e; border: 4px solid rgba(251,188,4,.5); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; box-shadow: 0 0 60px rgba(251,188,4,.2); }
.tile .te { font-size: 170px; } .tile .tw { font-family: "Space Grotesk"; font-weight: 700; font-size: 40px; text-align: center; } .tile .ts { color: #fbbc04; font-size: 54px; }
.bigphone { width: 500px; height: 860px; margin-top: -90px; border-radius: 70px; background: #0b0f19; border: 14px solid #2a3442; display: flex; flex-direction: column; align-items: center; padding-top: 60px; box-shadow: 0 0 120px rgba(251,188,4,.3); }
.bigphone .app { font-family: "Space Grotesk"; font-weight: 700; font-size: 44px; letter-spacing: .2em; color: #cbd5e1; } .bigphone .app span { color: #fbbc04; }
.bigphone .avatar { width: 220px; height: 220px; margin-top: 30px; border-radius: 50%; overflow: hidden; background: #1e293b; border: 6px solid #fbbc04; position: relative; }
.bigphone .avatar svg { position: absolute; left: -20px; top: 0; width: 260px; height: 585px; }
.bigphone .pname { margin-top: 20px; font-size: 44px; font-weight: 800; }
.bigphone .bigr { margin-top: 10px; font-family: "Space Grotesk"; font-weight: 700; font-size: 170px; color: #fbbc04; line-height: 1; }
.bigphone .note { margin: 30px 30px 0; padding: 26px; border-radius: 26px; background: #f8fafc; color: #0b1220; font-size: 32px; font-weight: 700; line-height: 1.3; text-align: center; }
.next { gap: 26px; text-align: center; }
.nx { font-family: "Space Grotesk"; font-weight: 700; font-size: 70px; } .nx.big { font-size: 112px; line-height: 1; } .nx.small { font-family: "Inter"; font-weight: 600; font-size: 46px; color: #94a3b8; font-style: italic; }
.nx.ep2 { position: absolute; bottom: 70px; font-size: 34px; letter-spacing: .2em; color: #64748b; }
.cap { position: absolute; left: 160px; right: 160px; bottom: 44px; margin: 0 auto; width: fit-content; max-width: 1600px; padding: 14px 32px; border-radius: 18px; background: rgba(0,0,0,.76); font-size: 44px; font-weight: 700; line-height: 1.25; text-align: center; z-index: 30; opacity: 0; }
.cap.narr { font-weight: 600; color: #f1f5f9; font-style: italic; }
.cap .nm { font-weight: 900; margin-right: 14px; font-style: normal; letter-spacing: .04em; }
#vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.45)); pointer-events: none; z-index: 40; }
</style></head>
<body>
<div id="root" data-composition-id="${EP}" data-start="0" data-duration="${T(TOTAL)}" data-width="1920" data-height="1080">
${html}
<div id="vignette"></div>
<audio id="mix" src="assets/audio/${EP}.wav" data-start="0" data-duration="${T(TOTAL)}" data-volume="1"></audio>
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
const TIER = (v) => (v >= 4.995 ? "gold" : v >= 4.5 ? "green" : v >= 4 ? "lime" : v >= 3 ? "amber" : "red");
function halo(id, v, d) { const el = document.getElementById(id); el.lastChild.textContent = v.toFixed(Math.abs(v * 10 - Math.round(v * 10)) < 0.02 ? 1 : d); el.className = "halo " + TIER(v); }
function shake(id, t, a) { tl.fromTo("#" + id + "-cam2", { x: a, y: -a * 0.6 }, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1.2, 0.3)", immediateRender: false }, t); }
${tl.join("\n")}
window.__timelines["${EP}"] = tl;
</script>
</body></html>
`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(path.join(OUT, "assets/fonts"), { recursive: true });
mkdirSync(path.join(OUT, "assets/audio"), { recursive: true });
copyFileSync(path.join(ADS, "gsap.min.js"), path.join(OUT, "assets/gsap.min.js"));
for (const f of ["Inter.woff2", "SpaceGrotesk.woff2"]) copyFileSync(path.join(ADS, "fonts", f), path.join(OUT, "assets/fonts", f));
writeFileSync(path.join(OUT, "index.html"), page);
writeFileSync(path.join(OUT, "hyperframes.json"), JSON.stringify({ paths: { assets: "assets" }, media: { autoProxy: true } }, null, 2) + "\n");
writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ id: `five-stars-${EP}`, name: `five-stars-${EP}` }, null, 2) + "\n");
console.log(`${shots.length} shots · ${TOTAL.toFixed(1)}s (${Math.floor(TOTAL / 60)}:${String(Math.round(TOTAL % 60)).padStart(2, "0")})`);

if (process.argv.includes("--no-audio")) process.exit(0);

// ---- audio: music + SFX bed, voice track, duck and master ----
const bed = path.join(OUT, "bed.wav");
synthBed(music, sfx, TOTAL, bed);
const vo = shots.flatMap((s) => s.lines.filter((l) => l.who));
const inputs = vo.flatMap((l) => ["-i", voPath(EP, l)]);
const graph = vo.map((l, i) => `[${i}]aresample=44100,adelay=${Math.round(l.start * 1000)}:all=1[v${i}]`).join(";") + ";" + vo.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${vo.length}:normalize=0:dropout_transition=0,apad=whole_dur=${T(TOTAL)}[vo]`;
writeFileSync(path.join(OUT, "vo.graph"), graph);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex_script", path.join(OUT, "vo.graph"), "-map", "[vo]", "-t", T(TOTAL), "-ac", "1", path.join(OUT, "vo.wav")]);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(OUT, "vo.wav"), "-i", bed, "-filter_complex",
  "[0]highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2[v];[v]asplit=2[v1][v2];[1]volume=0.55[b];[b][v1]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=400[d];[d][v2]amix=inputs=2:normalize=0:duration=longest[m];[m]loudnorm=I=-14:TP=-1.5:LRA=11[out]",
  "-map", "[out]", "-ar", "44100", "-ac", "2", path.join(OUT, `assets/audio/${EP}.wav`)]);
rmSync(path.join(OUT, "vo.wav")); rmSync(bed); rmSync(path.join(OUT, "vo.graph"));
console.log(`audio → .build/${EP}/assets/audio/${EP}.wav`);
