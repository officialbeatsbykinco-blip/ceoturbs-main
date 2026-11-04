// Locations for FIVE STARS, 1920 × 1080, flat illustrated style. Feet line is y = 940.
// Each set returns { bg, fg }: fg sits in front of characters marked `behind` (counters, desks, tables).
import { tapCard } from "./cast.mjs";

let seed = 5;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const box = (x, y, w, h, style) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"></div>`;

const house = (x, w, h, color, roof, night) => `
  ${box(x, 900 - h, w, h, `background:${color};${night ? "filter:brightness(.42) saturate(.7)" : ""}`)}
  <div style="position:absolute;left:${x - 20}px;top:${900 - h - w * 0.45}px;width:0;height:0;border-left:${w / 2 + 20}px solid transparent;border-right:${w / 2 + 20}px solid transparent;border-bottom:${w * 0.45}px solid ${roof};${night ? "filter:brightness(.4)" : ""}"></div>
  ${[0, 1].map((i) => box(x + 30 + i * (w - 110), 900 - h + 40, 50, 60, `background:${night ? "#fde68a" : "#bae6fd"};border:6px solid #fff;${night ? "box-shadow:0 0 40px rgba(253,230,138,.7)" : ""}`)).join("")}
  ${box(x + w / 2 - 30, 900 - 110, 60, 110, `background:${night ? "#3f2a1d" : "#7c2d12"};border-radius:8px 8px 0 0`)}`;

const town = (night) => {
  seed = 11;
  const cols = ["#fca5a5", "#93c5fd", "#fde68a", "#a7f3d0", "#c4b5fd", "#fdba74"];
  let h = "", x = -60;
  while (x < 1980) { const w = 220 + rand() * 120; h += house(x, w, 220 + rand() * 120, cols[(rand() * cols.length) | 0], "#7f1d1d", night); x += w + 50 + rand() * 60; }
  return h;
};

const sky = (night) => night
  ? `${box(0, 0, 1920, 1080, "background:linear-gradient(#060b1a,#1a2547 70%,#2b2f55)")}${(() => { seed = 3; return Array.from({ length: 70 }, () => box(rand() * 1920, rand() * 600, 3, 3, `background:#fff;border-radius:50%;opacity:${0.3 + rand() * 0.7}`)).join(""); })()}${box(1560, 90, 120, 120, "background:#f8fafc;border-radius:50%;box-shadow:0 0 80px rgba(248,250,252,.6)")}`
  : `${box(0, 0, 1920, 1080, "background:linear-gradient(#93d0ff,#dff2ff 75%)")}${box(1580, 80, 140, 140, "background:#fde047;border-radius:50%;box-shadow:0 0 90px rgba(253,224,71,.8)")}${box(200, 140, 260, 60, "background:#fff;border-radius:60px;opacity:.9")}${box(1100, 210, 200, 50, "background:#fff;border-radius:60px;opacity:.8")}`;

const sidewalk = (night) => `${box(0, 900, 1920, 180, `background:${night ? "#3f3f46" : "#d6d3d1"}`)}${box(0, 900, 1920, 14, `background:${night ? "#52525b" : "#e7e5e4"}`)}${Array.from({ length: 12 }, (_, i) => box(i * 170, 914, 4, 166, `background:${night ? "#27272a" : "#a8a29e"}`)).join("")}`;

const lamp = (x) => `${box(x, 520, 14, 380, "background:#27272a")}${box(x - 26, 500, 66, 30, "background:#27272a;border-radius:10px")}${box(x - 120, 420, 260, 260, "background:radial-gradient(closest-side,rgba(253,230,138,.35),transparent)")}`;

const SETS = {
  street: () => ({ bg: `${sky(false)}${town(false)}${sidewalk(false)}` }),
  night: () => ({ bg: `${sky(true)}${town(true)}${sidewalk(true)}${lamp(260)}${lamp(1500)}` }),
  diner: () => ({
    bg: `${box(0, 0, 1920, 1080, "background:#fef3c7")}${box(0, 0, 1920, 120, "background:#dc2626")}${Array.from({ length: 24 }, (_, i) => box(i * 80, 0, 40, 120, "background:#fff")).join("")}
      <div style="position:absolute;left:640px;top:170px;font-family:'Space Grotesk';font-weight:700;font-size:74px;color:#fff;letter-spacing:.02em;text-shadow:0 0 18px #f472b6,0 0 40px #ec4899;padding:10px 30px;border:5px solid #f9a8d4;border-radius:20px;box-shadow:0 0 30px #ec4899,inset 0 0 20px #ec4899;background:#3b0a2a">BRIGHTWATER DINER</div>
      ${box(80, 300, 420, 360, "background:linear-gradient(#93d0ff,#e0f2fe);border:16px solid #e5e7eb;border-radius:12px")}${box(80, 470, 420, 12, "background:#e5e7eb")}
      ${box(0, 900, 1920, 180, "background:repeating-conic-gradient(#111 0 25%,#f8fafc 0 50%) 0 0/90px 90px")}
      ${box(1500, 310, 300, 18, "background:#78350f")}${[0, 1, 2].map((i) => `<div style="position:absolute;left:${1510 + i * 96}px;top:250px;font-size:62px">🥧</div>`).join("")}
      ${box(1640, 380, 130, 200, "background:#334155;border-radius:16px")}${box(1670, 420, 70, 50, "background:#0f172a;border-radius:8px")}`,
    fg: `${box(900, 690, 1020, 30, "background:linear-gradient(#e5e7eb,#9ca3af);border-radius:8px")}${box(920, 718, 1000, 230, "background:repeating-linear-gradient(90deg,#dc2626 0 70px,#fff 70px 140px)")}
      <div class="easter" style="position:absolute;left:1610px;top:600px;width:62px;height:98px;transform:rotate(-5deg);filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))">${tapCard()}</div>
      <div style="position:absolute;left:1430px;top:618px;font-size:70px">☕</div>`,
  }),
  bank: () => ({
    bg: `${box(0, 0, 1920, 1080, "background:#dbeafe")}${box(0, 640, 1920, 300, "background:#bfdbfe")}${box(0, 900, 1920, 180, "background:#64748b")}
      <div style="position:absolute;left:560px;top:110px;padding:22px 40px;background:#1e3a8a;color:#fff;font-family:'Space Grotesk';font-weight:700;font-size:58px;border-radius:14px">BRIGHTWATER SAVINGS <span style="color:#fbbc04">★ 4.9</span></div>
      ${box(1500, 260, 300, 360, "background:repeating-linear-gradient(#e2e8f0 0 22px,#94a3b8 22px 28px);border:10px solid #f8fafc")}<div style="position:absolute;left:150px;top:640px;font-size:180px">🪴</div>`,
    fg: `${box(1020, 700, 760, 40, "background:#78350f;border-radius:8px")}${box(1050, 738, 700, 210, "background:#92400e")}${box(1100, 640, 120, 60, "background:#e5e7eb;border-radius:8px")}`,
  }),
  apartment: () => ({
    bg: `${box(0, 0, 1920, 1080, "background:#1e2f4f")}${box(0, 900, 1920, 180, "background:#3b2f2f")}
      ${box(1300, 180, 380, 380, "background:linear-gradient(#0b1430,#1e2a5a);border:16px solid #475569")}${box(1500, 240, 90, 90, "background:#f8fafc;border-radius:50%;box-shadow:0 0 50px rgba(248,250,252,.6)")}
      ${box(200, 700, 700, 120, "background:#64748b;border-radius:20px")}${box(200, 640, 140, 120, "background:#e2e8f0;border-radius:30px")}${box(330, 690, 570, 70, "background:#93c5fd;border-radius:18px")}
      ${box(1000, 760, 120, 140, "background:#78350f")}${box(1020, 640, 80, 120, "background:#fde68a;border-radius:40px 40px 6px 6px;box-shadow:0 0 90px rgba(253,230,138,.5)")}`,
  }),
  hillfar: () => ({
    bg: `${sky(true)}<div style="position:absolute;left:-200px;top:520px;width:2320px;height:1400px;border-radius:50%;background:#0f172a"></div>
      <div style="position:absolute;left:820px;top:380px;width:280px;height:150px;background:#1e1b4b;box-shadow:0 0 120px 30px rgba(251,188,4,.45)">${Array.from({ length: 8 }, (_, i) => box(20 + (i % 4) * 66, 24 + ((i / 4) | 0) * 60, 36, 40, "background:#fbbc04")).join("")}</div>
      <div style="position:absolute;left:800px;top:300px;width:0;height:0;border-left:160px solid transparent;border-right:160px solid transparent;border-bottom:80px solid #1e1b4b"></div>
      ${town(true).replace(/900px/g, "1040px")}`,
  }),
  hill: () => ({
    bg: `${sky(true)}${box(0, 760, 1920, 320, "background:#0f172a")}
      <div style="position:absolute;left:460px;top:200px;width:1000px;height:560px;background:#1e1b4b;box-shadow:0 0 200px 40px rgba(251,188,4,.35)">${Array.from({ length: 15 }, (_, i) => box(60 + (i % 5) * 186, 60 + ((i / 5) | 0) * 160, 80, 110, "background:#fbbc04;box-shadow:0 0 30px #fbbc04")).join("")}</div>
      <div style="position:absolute;left:400px;top:40px;width:0;height:0;border-left:560px solid transparent;border-right:560px solid transparent;border-bottom:160px solid #312e81"></div>
      ${Array.from({ length: 30 }, (_, i) => box(i * 66, 700, 10, 220, "background:#27272a")).join("")}${box(0, 700, 1920, 14, "background:#27272a")}
      <div style="position:absolute;left:840px;top:620px;font-family:'Space Grotesk';font-weight:700;font-size:44px;color:#fbbc04;text-shadow:0 0 20px #fbbc04">★★★★★</div>`,
  }),
  dining: () => ({
    bg: `${box(0, 0, 1920, 1080, "background:#3b0d12")}${box(0, 0, 1920, 1080, "background:repeating-linear-gradient(90deg,transparent 0 120px,rgba(251,188,4,.07) 120px 126px)")}
      <div class="reddoor" style="position:absolute;left:840px;top:250px;width:240px;height:420px;background:#7f1d1d;border:12px solid #fbbc04;box-shadow:0 0 60px rgba(220,38,38,.5)"><div class="doorglow" style="position:absolute;inset:0;background:radial-gradient(closest-side,#ff3b3b,#7f1d1d);opacity:0"></div><div class="doorpanel" style="position:absolute;inset:0;background:#5f0f0f;transform-origin:left center"><div style="position:absolute;left:180px;top:200px;width:22px;height:22px;border-radius:50%;background:#fbbc04"></div></div></div>
      ${[200, 1480].map((x) => `<div style="position:absolute;left:${x + 30}px;top:40px;width:180px;height:200px;border:12px solid #b8860b;background:#1f2937;display:flex;align-items:center;justify-content:center;font-size:96px">😁</div><div style="position:absolute;left:${x + 40}px;top:250px;color:#fbbc04;font-size:34px">★★★★★</div>`).join("")}
      <div style="position:absolute;left:760px;top:-20px;width:400px;height:150px;border-bottom:8px solid #fbbc04;border-radius:0 0 200px 200px"></div>${[800, 900, 1000, 1100].map((x) => box(x, 110, 16, 30, "background:#fde68a;border-radius:8px;box-shadow:0 0 30px #fde68a")).join("")}
      ${box(0, 900, 1920, 180, "background:#1c0a0a")}`,
    fg: `${box(0, 700, 1920, 380, "background:#f8fafc")}${box(0, 700, 1920, 30, "background:#e2e8f0")}
      ${[260, 620, 980, 1340, 1700].map((x) => `<div style="position:absolute;left:${x - 70}px;top:690px;width:140px;height:40px;border-radius:50%;background:#fff;border:4px solid #e5e7eb"></div><div style="position:absolute;left:${x - 36}px;top:650px;font-size:58px">🍗</div>`).join("")}
      ${[440, 800, 1160, 1520].map((x) => `${box(x, 590, 14, 110, "background:#fef3c7")}${box(x - 3, 566, 20, 30, "background:#fbbf24;border-radius:50% 50% 40% 40%;box-shadow:0 0 30px #fbbf24")}`).join("")}`,
  }),
  card: () => ({ bg: box(0, 0, 1920, 1080, "background:radial-gradient(1200px 800px at 50% 40%,#16233a,#05080f)") }),
  title: () => ({ bg: box(0, 0, 1920, 1080, "background:#030407") }),
};

export const setHtml = (name) => SETS[name]();
