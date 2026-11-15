// "Why the Worse Business Gets All the Customers" — why reviews decide where people spend money, told in an animal town.
// Long-form 16:9 explainer (~10 min). Pip (a hedgehog baker), Rocco (a raccoon) and the town are made up and the video
// says so up front. Every number about real people is real and its source is on screen and in the description:
//   BrightLocal Local Consumer Review Survey 2026 (97% read, 41% always, 47% <20 reviews, 9% ≤5, 74% last 3 months,
//   45% use AI, 89% expect replies) · BrightLocal 2017 (68% left a review when asked) · Spiegel Research Center,
//   Northwestern (5 reviews = 270% more likely to buy; most lift in the first 10; buying peaks ~4.0–4.7★) ·
//   Luca, Harvard Business School (one-star Yelp increase = 5–9% more revenue, independents not chains) ·
//   Google Business Profile help (more reviews and positive ratings can help local ranking) · Google Maps content
//   policy (no incentives, no selective asking, no pressure) · FTC fake-review rule, Aug 2024 (civil penalties).
// Prices, shipping, programming and returns match src/config/site.ts; iPhone XS+/NFC Android match src/content/review-cards.ts.
import { critter } from "./animals.mjs";
import { CSS as RR_CSS, count, ripple, row, pack } from "./restaurant-reviews.mjs";
import { T, mood, talk } from "./website-story.mjs";
import { card3d, reviewForm, phone as bigPhone } from "./stop-asking.mjs";

export const TITLE = "Why the Worse Business Gets All the Customers";
export const SLUG = "why-reviews";
export const LINKS = { cards: "ceoturbo.com/google-review-cards", setup: "ceoturbo.com/google-review-card-setup", call: "ceoturbo.com/brand-boost" };
export const IMAGES = [
  ["img/review-cards/hd/stand-front-1600.webp", "stand.webp"],
  ["img/review-cards/hd/card-stack-5-1600.webp", "stack.webp"],
];

export const SOURCES = [
  ["BrightLocal, Local Consumer Review Survey 2026 (1,002 US consumers)", "https://www.brightlocal.com/research/local-consumer-review-survey/"],
  ["BrightLocal, Local Consumer Review Survey 2017", "https://www.brightlocal.com/research/local-consumer-review-survey-2017/"],
  ["Spiegel Research Center, Northwestern University: How Online Reviews Influence Sales (2017)", "https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/"],
  ["Michael Luca, Harvard Business School: Reviews, Reputation, and Revenue: The Case of Yelp.com (2011)", "https://www.harvardmagazine.com/2011/10/hbs-study-finds-positive-yelp-reviews-lead-to-increased-business"],
  ["Google Business Profile Help: Tips to improve your local ranking on Google", "https://support.google.com/business/answer/7091"],
  ["Google Maps User Generated Content Policy: Prohibited & restricted content", "https://support.google.com/contributionpolicy/answer/7400114"],
  ["FTC: Final Rule Banning Fake Reviews and Testimonials (Aug 14, 2024)", "https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials"],
];

export const DESCRIPTION = (chapters) => `Two bakeries on the same street. One has a line out the door. The other is empty, and it bakes better bread. Why does almost everyone walk past it? The answer is one little number on your phone, and the research behind it is wild: 97% of people read reviews, almost half won't even try a business with fewer than 20, and the first 5 reviews can make a product 270% more likely to sell.

This is the story of Pip, a hedgehog baker with the best croissants in town and only 4 reviews, and what he did about it.

⭐ Get Google review cards (from $16.99, free US shipping): https://${LINKS.cards}
🛠️ Already have a card? Set it up in 2 minutes: https://${LINKS.setup}
📅 Want more customers, not just reviews? Free 30-minute call: https://${LINKS.call}

Chapters
${chapters.join("\n")}

Sources
${SOURCES.map(([n, u]) => `• ${n}: ${u}`).join("\n")}

Prices: 1 card $16.99 · 2 cards $29.99 · 5 cards $59.99 · 10 cards $99.99 · counter stand (tap + QR) $29.99 · stand + 2 cards $54.99. Free US shipping. Pay once, no subscription. We'll program and test your review link for $5 per order. Return it new within 30 days for a refund. Works on iPhone XS and newer and on Android phones with NFC.

Pip, Rocco, Hazel and the town are made up, and Pip's review counts and results are illustrative. The statistics about real shoppers come from the sources above. Results depend on your business and your area, and Google decides search rankings, so no one can guarantee them. CEO Turbo review cards are an independent product and are not made or endorsed by Google.

#googlereviews #smallbusiness #marketing #localbusiness #reviews #psychology #entrepreneur`;

// ───────── voices ─────────
const PIP = ["am_puck", 1.0];
const ROCCO = ["bm_george", 0.98];
const HAZEL = ["af_sky", 1.02];

// ───────── cast ─────────
export const pip = (m = "smile", w = 240, id = "@pip") => critter("hedgehog", m, w, id, { hat: true, apron: "#ffffff" });
export const rocco = (m = "smile", w = 240, id = "@rocco") => critter("raccoon", m, w, id, { apron: "#1e3a5f" });
export const hazel = (m = "smile", w = 220, id = "@hazel", o = {}) => critter("rabbit", m, w, id, { scarf: "#e11d48", ...o });
export const TOWN = [["fox", { scarf: "#2563eb" }], ["bear", { cap: "#16a34a" }], ["owl", { glasses: true }], ["cat", {}], ["mouse", {}], ["beaver", {}], ["dog", { scarf: "#f59e0b" }], ["squirrel", {}], ["turtle", {}], ["fox", { cap: "#7c3aed" }], ["bear", {}], ["cat", { scarf: "#0ea5e9" }]];
/** A row of townsfolk. */
export const crowd = (pre, n, x, y, w = 120, gap = 92, from = 0, moodOf = "smile", hide = false) =>
  Array.from({ length: n }, (_, k) => { const [kind, o] = TOWN[(k + from) % TOWN.length]; return `<div class="pos${hide ? " h" : ""}" id="${pre}${k}" style="left:${x + k * gap}px;top:${y}px">${critter(kind, moodOf, w, `${pre}w${k}`, o)}</div>`; }).join("");

// ───────── 3D helpers ─────────
const P = 1800; // stage perspective
/** A layer of the 3D world at depth z, scaled so its layout coordinates still read as screen pixels at rest. */
export const L = (z, html, style = "") => `<div class="wr-L" style="transform:translateZ(${z}px) scale(${((P - z) / P).toFixed(4)});${style}">${html}</div>`;
export const stage = (layers, id = "@world") => `<div class="wr-stage"><div class="wr-world" id="${id}">${layers}</div></div>`;
/** Slow dolly + drift for the 3D world through the scene (or a window of it). */
export const cam = (c, from, to, t0 = c.S - 0.5, t1 = c.E, id = "@world") =>
  c.js(`tl.fromTo("${c.q(id)}", ${JSON.stringify({ x: from[0], rotationY: from[1], z: from[2], rotationX: from[3] ?? 0 })}, ${JSON.stringify({ x: to[0], rotationY: to[1], z: to[2], rotationX: to[3] ?? 0, duration: +(t1 - t0).toFixed(3), ease: "sine.inOut", immediateRender: t0 <= c.S })}, ${T(t0)});`);
/** Morning sky, sun, clouds and hills: the far layers of every street scene. */
export const sky = (night = false) => L(-900, `<div class="wr-sky${night ? " night" : ""}"><div class="sun"></div>${[0, 1, 2, 3].map((i) => `<div class="cloud" style="left:${[120, 700, 1260, 1700][i]}px;top:${[90, 40, 120, 60][i]}px;transform:scale(${[1, 0.7, 1.2, 0.8][i]})"></div>`).join("")}</div>`, "inset:-260px -700px")
  + L(-420, `<div class="wr-hills"><i style="left:-300px"></i><i style="left:500px;width:1300px"></i><i style="left:1500px"></i></div>`, "inset:-100px -400px")
  + L(-200, `<div class="wr-trees">${Array.from({ length: 16 }, (_, i) => `<span style="left:${i * 170 - 300}px;font-size:${90 + (i % 3) * 26}px">🌳</span>`).join("")}</div>`, "inset:0 -400px");
/** The street floor: a real plane tipped flat, so it recedes as the camera moves. */
export const floor = () => `<div class="wr-floor"><div class="walk"></div><div class="road"></div></div>`;
/** A storefront with real depth: front, side wall and an awning. */
export const shop = (id, name, x, theme, window = "🥐 🥖 🍞", extra = "") => `<div class="wr-shop ${theme}" id="${id}" style="left:${x}px" ${extra}>
  <div class="side"></div><div class="roof"></div>
  <div class="front"><div class="sign">${name}</div><div class="awn"></div><div class="win"><span>${window}</span></div><div class="door"><i></i></div><div class="lamp"></div></div></div>`;
/** Big animated stat with its source. */
export const stat = (id, big, label, x, y, suffix = "") => `<div class="wr-stat h" id="${id}" style="left:${x}px;top:${y}px"><b><i id="${id}-n">${big}</i>${suffix}</b><span>${label}</span></div>`;
export const src = (id, text) => `<div class="wr-src h" id="${id}">📊 Source: ${text}</div>`;
/** Isometric town map with 3D blocks; pins stand up toward the camera. */
const box = (x, y, w, d, h, col, roof = "") => `<div class="wr-box" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px"><i class="tp" style="background:${col};transform:translateZ(${h}px)">${roof}</i><i class="fr" style="top:${d}px;height:${h}px;background:${col}"></i><i class="sd" style="left:${w}px;width:${h}px;background:${col}"></i></div>`;
const bb = (x, y, z, html, cls = "") => `<div class="wr-bb ${cls}" style="left:${x}px;top:${y}px;transform:translateZ(${z}px)"><div class="bbr">${html}</div></div>`;
/** Turn the town map from angle a to b (degrees) while every pin and tree keeps facing the camera. */
export const spin = (c, sel, a, b, t, d) => c.js(`tl.fromTo("${c.q(sel)} .plane", { rotationZ: ${a} }, { rotationZ: ${b}, duration: ${T(d)}, ease: "sine.inOut" }, ${T(t)}); tl.fromTo("${c.q(sel)} .bbr", { rotationZ: ${-a}, rotationX: -56 }, { rotationZ: ${-b}, rotationX: -56, duration: ${T(d)}, ease: "sine.inOut" }, ${T(t)});`);
export const town = (pins = []) => `<div class="wr-map"><div class="tilt"><div class="plane">
  <div class="rd" style="left:0;top:420px;width:1400px;height:70px"></div><div class="rd" style="left:640px;top:0;width:70px;height:900px"></div>
  ${box(80, 120, 220, 170, 120, "#f4a261")}${box(360, 100, 200, 210, 170, "#e9c46a")}${box(80, 560, 240, 200, 90, "#90be6d")}${box(380, 590, 190, 170, 140, "#f28482")}
  ${box(780, 120, 230, 180, 110, "#84a59d")}${box(1080, 90, 220, 220, 200, "#bc6c25")}${box(800, 570, 220, 210, 150, "#cdb4db")}${box(1100, 600, 200, 180, 100, "#ffafcc")}
  ${[[40, 360], [600, 340], [1000, 360], [1320, 520], [600, 820], [40, 820], [1340, 840]].map(([x, y]) => bb(x, y, 0, "🌳", "tree")).join("")}
  ${pins.map((p) => bb(p.x, p.y, p.z ?? 0, `<div class="pinw h" id="${p.id}"><div class="pin ${p.cls ?? ""}"><b>${p.label}</b><small>${p.sub ?? ""}</small></div><div class="stem" style="height:${p.h}px"></div></div>`, "pinbb")).join("")}
</div></div></div>`;
/** 3D bars: front, top and side faces. */
export const bars3d = (id, data, extra = "") => `<div class="wr-bars h" id="${id}" ${extra}>${data.map(([label, val, pct, col], i) => `<div class="col"><div class="b3" id="${id}-b${i}" style="height:${pct}%;--c:${col}"><i class="f"></i><i class="t"></i><i class="s"></i><em>${val}</em></div><span>${label}</span></div>`).join("")}</div>`;
/** 100 dots, the first n lit. */
export const dots = (id, n, col = "#fbbc04") => `<div class="wr-dots h" id="${id}">${Array.from({ length: 100 }, (_, i) => `<i class="${i < n ? "on" : ""}" style="--c:${col}"></i>`).join("")}</div>`;
/** A Google-style review with an optional owner reply. */
export const review = (id, name, color, stars, text, when, reply = "", extra = "") => `<div class="rr-rev h" id="${id}" ${extra}><div class="hd"><div class="av" style="background:${color}">${name[0]}</div><div><div class="nm">${name}</div><div class="st">${"★".repeat(stars)}<span style="color:#dadce0">${"★".repeat(5 - stars)}</span><em>${when}</em></div></div></div><p>${text}</p>${reply ? `<div class="rp h" id="${id}-rp"><b>Response from the owner</b>${reply}</div>` : ""}</div>`;
export const bubble = (id, text, x, y, extra = "") => `<div class="bub h" id="${id}" style="left:${x}px;top:${y}px" ${extra}>${text}</div>`;
/** Little tap card that sits on Pip's counter. */
export const counterCard = (id, extra = "") => `<div class="wr-cc h" id="${id}" ${extra}><b>G</b><span>★★★★★</span><small>Tap your phone<br/>to review us</small></div>`;
/** Characters' own lines: speech bubble + flapping mouth. */
const say = (c, who, l, bub) => { talk(c, who, l.start, l.dur); if (bub) { c.pop(bub, l.start); c.out(bub, l.end + 0.2); } };
const PIPROW = (n = "4", cls = "you", id = "", nid = "") => row("🥐", "Pip's Bakery", "4.9", n, "Bakery · $ · 0.2 mi", cls, id, nid);
const CRUMB = (n = "412", cls = "", id = "") => row("🍞", "Crumb &amp; Co.", "4.4", n, "Bakery · $$ · 0.2 mi", cls, id);

export const CSS = RR_CSS + `
.wr-stage { position: absolute; inset: 0; perspective: ${P}px; perspective-origin: 50% 42%; overflow: hidden; }
.wr-world { position: absolute; inset: 0; transform-style: preserve-3d; }
.wr-L { position: absolute; inset: 0; transform-style: preserve-3d; }
.wr-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #7cc4f5 0%, #b9e2fb 45%, #ffe8c2 80%, #ffd29a 100%); }
.wr-sky.night { background: linear-gradient(180deg, #0b1533 0%, #1d2b5a 60%, #3b3263 100%); }
.wr-sky .sun { position: absolute; left: 62%; top: 22%; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, #fff7d6 0%, #ffd56b 45%, rgba(255,200,90,0) 70%); }
.wr-sky .cloud { position: absolute; width: 300px; height: 90px; border-radius: 60px; background: #fff; opacity: .85; box-shadow: 70px -40px 0 -6px #fff, 150px -10px 0 -10px #fff; }
.wr-hills { position: absolute; inset: 0; } .wr-hills i { position: absolute; bottom: 300px; width: 1100px; height: 420px; border-radius: 50% 50% 0 0; background: linear-gradient(180deg, #8fd18a, #5ea65c); }
.wr-trees { position: absolute; inset: 0; } .wr-trees span { position: absolute; top: 360px; filter: saturate(.9) brightness(.92); }
.wr-floor { position: absolute; left: -1400px; right: -1400px; top: 760px; height: 1600px; transform-origin: 50% 0; transform: rotateX(90deg); background: #d8c3a5; }
.wr-floor .walk { position: absolute; left: 0; right: 0; top: 0; height: 260px; background: repeating-linear-gradient(90deg, #e9dcc6 0 118px, #cdb894 118px 122px); }
.wr-floor .road { position: absolute; left: 0; right: 0; top: 260px; height: 700px; background: linear-gradient(180deg, #5b6170, #3d424d); }
.wr-shop { position: absolute; top: 210px; width: 700px; height: 560px; transform-style: preserve-3d; }
.wr-shop .front { position: absolute; inset: 0; border-radius: 16px 16px 0 0; background: linear-gradient(180deg, #f6d7b0, #e8bf8f); box-shadow: inset -30px 0 60px rgba(0,0,0,.12); }
.wr-shop.crumb .front { background: linear-gradient(180deg, #c9d6e8, #9fb3cf); }
.wr-shop .side { position: absolute; top: 0; right: 0; width: 240px; height: 100%; transform-origin: 100% 50%; transform: rotateY(-90deg); background: linear-gradient(90deg, #b98f62, #9c7550); }
.wr-shop.pip .side { left: 0; right: auto; transform-origin: 0 50%; transform: rotateY(90deg); background: linear-gradient(270deg, #b98f62, #9c7550); }
.wr-shop.crumb .side { background: linear-gradient(90deg, #7d8ea8, #64748b); }
.wr-shop .roof { position: absolute; left: -20px; right: -20px; top: -40px; height: 60px; border-radius: 14px; background: #7c2d12; box-shadow: 0 16px 30px rgba(0,0,0,.25); }
.wr-shop.crumb .roof { background: #1e3a5f; }
.wr-shop .sign { position: absolute; left: 50%; top: 34px; transform: translateX(-50%); padding: 12px 36px; border-radius: 16px; background: #fffaf0; border: 5px solid #7c2d12; font-family: "Space Grotesk"; font-weight: 700; font-size: 50px; color: #7c2d12; white-space: nowrap; box-shadow: 0 10px 0 rgba(0,0,0,.12); }
.wr-shop.crumb .sign { border-color: #1e3a5f; color: #1e3a5f; }
.wr-shop .awn { position: absolute; left: 24px; right: 24px; top: 140px; height: 70px; border-radius: 0 0 26px 26px; background: repeating-linear-gradient(90deg, #e76f51 0 58px, #fff4e0 58px 116px); box-shadow: 0 18px 24px rgba(0,0,0,.18); }
.wr-shop.crumb .awn { background: repeating-linear-gradient(90deg, #2a6f97 0 58px, #f0f6ff 58px 116px); }
.wr-shop .win { position: absolute; left: 44px; top: 240px; width: 380px; height: 240px; border-radius: 14px; border: 12px solid #7c2d12; background: radial-gradient(circle at 50% 40%, #fff5d6, #ffd58a); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px; font-size: 64px; letter-spacing: 8px; }
.wr-shop.crumb .win { border-color: #1e3a5f; }
.wr-shop .door { position: absolute; right: 56px; top: 250px; width: 170px; height: 310px; border-radius: 85px 85px 0 0; background: linear-gradient(180deg, #8a5a3b, #6b4226); border: 10px solid #7c2d12; } .wr-shop .door i { position: absolute; right: 22px; top: 150px; width: 18px; height: 18px; border-radius: 50%; background: #fbbf24; }
.wr-shop.crumb .door { border-color: #1e3a5f; }
.wr-shop .lamp { position: absolute; left: 448px; top: 230px; width: 24px; height: 24px; border-radius: 50%; background: #fde68a; box-shadow: 0 0 40px 14px rgba(253,230,138,.6); }
.wr-stat { position: absolute; padding: 34px 50px 40px; border-radius: 40px; background: rgba(9,14,28,.92); border: 4px solid #fbbc04; box-shadow: 0 40px 90px rgba(0,0,0,.45), 0 0 80px rgba(251,188,4,.18); text-align: center; }
.wr-stat b { display: block; font-family: "Space Grotesk"; font-size: 210px; line-height: .95; letter-spacing: -.05em; color: #fbbc04; }
.wr-stat b i { font-style: normal; }
.wr-stat span { display: block; margin-top: 12px; max-width: 760px; font-size: 40px; font-weight: 800; line-height: 1.2; color: #f8fafc; }
.wr-src { position: absolute; right: 40px; top: 34px; max-width: 900px; padding: 12px 22px; border-radius: 14px; background: rgba(9,14,28,.86); border: 2px solid #475569; font-size: 22px; font-weight: 700; color: #cbd5e1; z-index: 40; }
.wr-map { position: absolute; inset: 0; perspective: 2200px; perspective-origin: 50% 30%; }
.wr-map .tilt { position: absolute; left: 260px; top: 170px; width: 1400px; height: 900px; transform-style: preserve-3d; transform: rotateX(56deg); }
.wr-map .plane { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateZ(-40deg); border-radius: 40px; background: radial-gradient(circle at 40% 40%, #a7d98f, #6fb35f); box-shadow: 0 0 0 30px #5c9a4e; }
.wr-map .rd { position: absolute; background: #5b6170; border-radius: 8px; }
.wr-box { position: absolute; transform-style: preserve-3d; } .wr-box i { position: absolute; display: block; }
.wr-box .tp { inset: 0; border-radius: 6px; box-shadow: inset 0 0 0 6px rgba(255,255,255,.25); }
.wr-box .fr { left: 0; width: 100%; transform-origin: top; transform: rotateX(90deg); filter: brightness(.78); background-image: repeating-linear-gradient(90deg, transparent 0 30px, rgba(255,255,255,.35) 30px 52px, transparent 52px 70px) !important; background-blend-mode: overlay; }
.wr-box .sd { top: 0; height: 100%; transform-origin: left; transform: rotateY(-90deg); filter: brightness(.6); }
.wr-bb { position: absolute; transform-style: preserve-3d; } .wr-bb .bbr { position: absolute; inset: 0; transform-origin: 50% 100%; transform: rotateZ(40deg) rotateX(-56deg); }
.wr-bb.tree { width: 120px; height: 120px; margin-left: -60px; margin-top: -120px; font-size: 110px; line-height: 1; text-align: center; }
.wr-bb.pinbb { width: 300px; height: 0; margin-left: -150px; }
.wr-map .pinw { position: absolute; bottom: 0; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; transform-origin: 50% 100%; }
.wr-map .pin { padding: 18px 26px; border-radius: 28px; background: #fff; color: #0b1220; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,.35); border: 5px solid #ea4335; white-space: nowrap; }
.wr-map .pin b { display: block; font-family: "Space Grotesk"; font-size: 44px; line-height: 1; } .wr-map .pin small { display: block; margin-top: 6px; font-size: 26px; font-weight: 800; color: #e8a200; }
.wr-map .pin.you { border-color: #ff6a1f; } .wr-map .pin.big { transform: scale(1.25); transform-origin: 50% 100%; }
.wr-map .stem { width: 10px; background: linear-gradient(180deg, #ea4335, #b3261e); border-radius: 0 0 5px 5px; }
.wr-bars { position: absolute; display: flex; align-items: flex-end; gap: 90px; height: 560px; padding: 0 40px; }
.wr-bars .col { position: relative; width: 190px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.wr-bars .col > span { margin-top: 26px; font-size: 32px; font-weight: 800; color: #e2e8f0; white-space: nowrap; }
.wr-bars .b3 { position: relative; width: 190px; transform-origin: 50% 100%; }
.wr-bars .b3 i { position: absolute; display: block; } .wr-bars .b3 .f { inset: 0; border-radius: 6px 6px 0 0; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 75%, #000)); }
.wr-bars .b3 .t { left: 0; width: 100%; top: -40px; height: 40px; background: color-mix(in srgb, var(--c) 70%, #fff); transform-origin: 0 100%; transform: skewX(-45deg); }
.wr-bars .b3 .s { left: 100%; top: 0; width: 40px; height: 100%; background: color-mix(in srgb, var(--c) 55%, #000); transform-origin: 0 0; transform: skewY(-45deg); }
.wr-bars .b3 em { position: absolute; left: 0; right: 0; top: -110px; text-align: center; font-style: normal; font-family: "Space Grotesk"; font-weight: 700; font-size: 60px; color: #fff; }
.wr-dots { position: absolute; display: grid; grid-template-columns: repeat(10, 46px); gap: 14px; }
.wr-dots i { display: block; width: 46px; height: 46px; border-radius: 50%; background: #334155; }
.wr-dots i.on { background: radial-gradient(circle at 35% 30%, #fff6, transparent 50%), var(--c); box-shadow: 0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }
.wr-cc { position: absolute; width: 120px; height: 150px; border-radius: 18px; background: #fff; color: #0b1220; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 3px solid #fbbc04; box-shadow: 0 0 40px rgba(251,188,4,.6), 0 20px 40px rgba(0,0,0,.35); }
.wr-cc b { font-family: "Space Grotesk"; font-size: 54px; color: #4285f4; line-height: 1; } .wr-cc span { font-size: 16px; color: #fbbc04; letter-spacing: 2px; } .wr-cc small { font-size: 12px; font-weight: 800; text-align: center; line-height: 1.15; }
.wr-counter { position: absolute; left: 0; right: 0; top: 700px; height: 380px; background: linear-gradient(180deg, #a86b3c, #7a4a26); box-shadow: 0 -10px 0 #c58b55, 0 -40px 80px rgba(0,0,0,.25); }
.wr-counter::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 26px; background: #e2c39b; }
.wr-bakery { position: absolute; inset: 0; background: linear-gradient(180deg, #fbe3c2 0%, #f3cf9f 70%); }
.wr-bakery .shelf { position: absolute; left: 80px; right: 80px; height: 26px; background: #9c6b3f; border-radius: 6px; box-shadow: 0 12px 20px rgba(0,0,0,.15); }
.wr-bakery .shelf span { position: absolute; bottom: 20px; font-size: 70px; }
.wr-chat { position: absolute; width: 900px; padding: 36px; border-radius: 36px; background: #fff; color: #0b1220; box-shadow: 0 40px 100px rgba(0,0,0,.5); }
.wr-chat .q { margin-left: auto; width: fit-content; padding: 18px 28px; border-radius: 26px; background: #e2e8f0; font-size: 34px; font-weight: 700; }
.wr-chat .a { margin-top: 24px; display: flex; gap: 18px; font-size: 30px; line-height: 1.45; } .wr-chat .a .ai { width: 54px; height: 54px; flex: none; border-radius: 50%; background: conic-gradient(#a855f7, #3b82f6, #22c55e, #a855f7); }
.wr-funnel { position: absolute; display: flex; flex-direction: column; gap: 14px; }
.wr-funnel .st { display: flex; align-items: center; gap: 20px; height: 82px; padding: 0 28px; border-radius: 22px; background: rgba(15,23,42,.92); border: 3px solid #475569; font-size: 34px; font-weight: 800; color: #f8fafc; transform-origin: 0 50%; }
.wr-funnel .st b { width: 50px; height: 50px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; font-size: 26px; flex: none; }
.wr-funnel .st em { margin-left: auto; font-style: normal; font-size: 30px; }
.wr-chart { position: absolute; width: 1100px; height: 560px; padding: 40px; border-radius: 40px; background: rgba(9,14,28,.92); border: 3px solid #334155; }
.wr-chart svg { width: 100%; height: 100%; overflow: visible; }
.wr-ex { position: absolute; display: flex; gap: 0; transform-style: preserve-3d; }
.wr-ex .ly { position: absolute; left: 0; top: 0; width: 380px; height: 600px; border-radius: 34px; box-shadow: 0 30px 80px rgba(0,0,0,.45); }
.wr-wall { position: absolute; padding: 26px 40px; border-radius: 20px; background: repeating-linear-gradient(45deg, #ef4444 0 40px, #b91c1c 40px 80px); color: #fff; font-family: "Space Grotesk"; font-weight: 700; font-size: 54px; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,.45); border: 6px solid #fff; }
.wr-rule { position: absolute; display: flex; align-items: center; gap: 24px; width: 1060px; padding: 26px 34px; border-radius: 26px; background: rgba(15,23,42,.94); border: 3px solid #ef4444; font-size: 42px; font-weight: 800; color: #f8fafc; }
.wr-rule b { width: 64px; height: 64px; border-radius: 50%; background: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 38px; flex: none; }
.wr-rule.ok { border-color: #22c55e; } .wr-rule.ok b { background: #22c55e; }
.wr-ttl { position: absolute; left: 0; right: 0; text-align: center; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: #fff; text-shadow: 0 8px 0 rgba(0,0,0,.25), 0 30px 80px rgba(0,0,0,.5); }
.wr-pill { position: absolute; padding: 16px 30px; border-radius: 999px; font-weight: 800; font-size: 36px; white-space: nowrap; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
.wr-sub { position: absolute; padding: 14px 30px; border-radius: 999px; background: #ff0000; color: #fff; font-weight: 800; font-size: 40px; box-shadow: 0 20px 50px rgba(255,0,0,.35); }
.s-later .bg, .s-open .bg, .s-meet .bg, .s-end .bg { background: #b9e2fb; }
`;

/** A storefront street: Crumb & Co. on the left, Pip's on the right, in real depth. */
const street = (left = "", right = "", front = "") => stage(
  sky() + L(0, floor() + shop("@crumb", "Crumb &amp; Co.", 120, "crumb", "🍞 🥯 🍞") + shop("@pips", "Pip's Bakery", 1080, "pip") + left + right)
  + L(220, front));

export const SCENES = [
  // ───────── 1. Cold open ─────────
  {
    id: "open", chapter: "Two bakeries, one street", music: "soft",
    lines: [
      "Two bakeries. Same street. Same morning.",
      "One has a line out the door.",
      "The other one is empty.",
      "And here's the strange part. The empty one bakes better bread.",
      "So why does almost everyone walk right past it?",
      { t: "The answer is a number. It's on your phone right now, and you've been obeying it your whole life.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      cam(c, [-120, -6, -120, 2], [120, 5, 120, -1]);
      c.sfx("chime", a.start + 0.2);
      c.js(`tl.fromTo("${c.q(".line .pos")}", { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.14, ease: "back.out(1.6)" }, ${T(b.start)});`);
      c.js(`tl.to("${c.q(".line .who")}", { y: -10, duration: 0.25, yoyo: true, repeat: 7, ease: "sine.inOut", stagger: 0.05 }, ${T(b.start + 1.2)});`);
      c.pop("@empty", d.start + 0.3);
      c.sfx("thud", d.start + 0.3);
      c.pop("@best", e.start + e.dur * 0.55);
      c.sfx("ding", e.start + e.dur * 0.55);
      c.to("@empty", { autoAlpha: 0, duration: 0.3 }, e.start);
      c.js(`tl.fromTo("${c.q(".walkby .pos")}", { x: 900, autoAlpha: 1 }, { x: -700, duration: ${T(f.dur + 1.6)}, ease: "none", stagger: 0.25 }, ${T(f.start)});`);
      c.to("@best", { autoAlpha: 0, duration: 0.3 }, g.start);
      c.in("@ph", g.start + 0.1, { y: 400, d: 0.7 });
      c.sfx("whoosh", g.start + 0.1);
      c.js(`tl.fromTo("${c.q("@n412, @n4")}", { scale: 1 }, { scale: 1.3, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${T(g.start + g.dur * 0.35)});`);
      return street(
        `<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 6, 40, 600, 120, 100)}</div>`,
        `<div class="walkby" style="position:absolute;left:0;top:0">${crowd("@wb", 4, 1400, 610, 115, 130, 6).replace(/class="pos"/g, 'class="pos h"')}</div>`,
        `<div class="wr-pill h" id="@empty" style="left:1250px;top:470px;background:#ef4444;color:#fff">Empty 😶</div>
         <div class="wr-pill h" id="@best" style="left:1100px;top:120px;background:#fbbc04;color:#1f1300">🏆 Best croissants in town</div>
         <div class="pos h" id="@ph" style="left:740px;top:80px">${bigPhone("@phn", `<div style="padding:80px 26px 20px;color:#0b1220;background:#fff;height:100%"><div style="font-size:24px;font-weight:800;color:#64748b">🔍 bakery near me</div>
          <div style="margin-top:28px;padding:22px;border-radius:20px;background:#f1f5f9"><b style="font-size:32px">Crumb &amp; Co.</b><div style="font-size:28px;color:#e8a200;font-weight:800">4.4 ★ <span id="@n412" style="display:inline-block;color:#16a34a">(412)</span></div></div>
          <div style="margin-top:18px;padding:22px;border-radius:20px;background:#f1f5f9"><b style="font-size:32px">Pip's Bakery</b><div style="font-size:28px;color:#e8a200;font-weight:800">4.9 ★ <span id="@n4" style="display:inline-block;color:#dc2626">(4)</span></div></div>
          <div style="margin-top:40px;text-align:center;font-size:90px">🤔</div></div>`)}</div>`,
      );
    },
  },
  // ───────── 2. Title ─────────
  {
    id: "title", chapter: "Why the worse business wins", music: "pulse", lead: 0.2,
    lines: [
      "This is the story of that number.",
      { t: "Why it matters so much, what the research actually says, and how one tiny bakery fixed it.", gap: 0.9 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@t1", a.start, { y: 80, scale: 0.9 });
      c.sfx("whoosh", a.start);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, rotationY: -140, rotationX: 20, y: 120 }, { autoAlpha: 1, rotationY: -18, rotationX: 6, y: 0, duration: 1.3, ease: "power3.out" }, ${T(a.start + 0.4)}); tl.to("${c.q("@card")}", { rotationY: 342, duration: 2.2, ease: "power2.inOut" }, ${T(b.start + 0.4)});`);
      c.sfx("ding", a.start + 1.4);
      c.in("@t2", b.start, { y: 40 });
      ["@s0", "@s1", "@s2"].forEach((s, i) => { c.pop(s, b.start + b.dur * (0.15 + i * 0.25)); c.sfx("pop", b.start + b.dur * (0.15 + i * 0.25)); });
      return `<div class="glow" style="left:1100px"></div>
      <div class="wr-ttl h" id="@t1" style="left:110px;right:auto;width:1050px;text-align:left;top:230px;font-size:126px">WHY THE <span class="dim" style="color:#94a3b8">WORSE</span><br/>BUSINESS GETS<br/><span class="o">ALL THE</span><br/><span class="o">CUSTOMERS</span></div>
      <div class="ws-sub h" id="@t2" style="left:114px;top:740px;width:1000px;font-size:38px">The number that decides where you spend your money.</div>
      ${["🧠 The psychology", "📊 The research", "🥐 The fix"].map((t, i) => `<div class="wr-pill h" id="@s${i}" style="left:${110 + i * 360}px;top:110px;background:#fff;color:#0b1220;font-size:30px">${t}</div>`).join("")}
      <div class="stage3d" style="left:1290px;top:170px">${card3d("@card", "h")}</div>`;
    },
  },
  // ───────── 3. Meet Pip & Rocco ─────────
  {
    id: "meet", chapter: "Meet Pip (and Rocco)", music: "soft",
    lines: [
      "Meet Pip.",
      { t: "Morning! Fresh croissants, still warm!", v: PIP, gap: 0.4 },
      "Pip gets up at four every morning to bake. Ask anyone who's tried his croissants. They're the best in town.",
      { t: "On Google, Pip's Bakery has four point nine stars. From just four reviews.", say: "On Google, Pip's Bakery has four point nine stars... from just four reviews." },
      "Across the street is Crumb and Co., run by Rocco.",
      { t: "Next! What can I get you, love?", v: ROCCO, gap: 0.4 },
      { t: "Rocco's bread is fine. Just fine. Four point four stars. But he has four hundred and twelve reviews.", say: "Rocco's bread is fine. Just... fine. Four point four stars. But he has four hundred and twelve reviews." },
      { t: "Pip, Rocco and this whole town are made up. But every number about real shoppers in this video comes from real research, and we'll show you the source.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h, k] = c.L;
      cam(c, [80, 4, 40], [-60, -3, 140], c.S - 0.5, e.start);
      cam(c, [-60, -3, 140], [60, 3, 60], e.start, c.E);
      c.in("@pipw", a.start, { y: 80, scale: 0.8, ease: "back.out(1.8)" });
      mood(c, "@pip", "grin", a.start + 0.3);
      say(c, "@pip", b, "@pb");
      c.in("@tray", d.start, { y: 40 });
      c.js(`tl.to("${c.q("@tray")}", { y: -12, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${T(d.start + 0.7)});`);
      c.in("@pr", e.start, { y: 30 });
      c.sfx("ding", e.start + 0.3);
      c.js(`tl.fromTo("${c.q("@pr4")}", { scale: 1 }, { scale: 1.35, color: "#dc2626", duration: 0.35, yoyo: true, repeat: 1 }, ${T(e.start + e.dur * 0.8)});`);
      mood(c, "@pip", "smile", e.end);
      c.in("@roc", f.start, { x: -120, y: 0 });
      mood(c, "@rocco", "grin", f.start + 0.4);
      say(c, "@rocco", g, "@rb");
      c.in("@rr", h.start + 0.3, { y: 30 });
      c.js(`tl.fromTo("${c.q("@rr412")}", { scale: 1 }, { scale: 1.35, color: "#16a34a", duration: 0.35, yoyo: true, repeat: 1 }, ${T(h.start + h.dur * 0.8)});`);
      c.in("@disc", k.start, { y: 20 });
      mood(c, "@pip", "wink", k.start + 0.5);
      return street(`<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 5, 40, 610, 110, 96, 2)}</div>`, "",
        `<div class="pos h" id="@pipw" style="left:1300px;top:470px">${pip("smile", 260)}</div>
        <div class="pos h" id="@tray" style="left:1560px;top:610px;font-size:90px">🥐🥐</div>
        ${bubble("@pb", "Morning! Fresh croissants! 🥐", 1080, 380)}
        <div class="pos h" id="@roc" style="left:420px;top:470px">${rocco("smile", 250)}</div>
        ${bubble("@rb", "Next! What can I get you? 😄", 360, 380)}
        <div class="wr-pill h" id="@pr" style="left:1080px;top:120px;background:#fff;color:#0b1220">Pip's Bakery · <span style="color:#e8a200">4.9 ★</span> · <span id="@pr4" style="display:inline-block">4 reviews</span></div>
        <div class="wr-pill h" id="@rr" style="left:200px;top:120px;background:#fff;color:#0b1220">Crumb &amp; Co. · <span style="color:#e8a200">4.4 ★</span> · <span id="@rr412" style="display:inline-block">412 reviews</span></div>
        <div class="ws-disc h" id="@disc" style="top:880px;font-size:28px">🐾 Pip, Rocco and the town are fictional. The research is real.</div>`);
    },
  },
  // ───────── 4. The 6-second decision ─────────
  {
    id: "decide", chapter: "The 6-second decision", music: "pulse",
    lines: [
      "Now meet Hazel. She's new in town, she's hungry, and she's got about six seconds to decide where to go.",
      { t: "Bakery near me.", v: HAZEL, gap: 0.4 },
      "Two results pop up.",
      { t: "Pip's Bakery. Four point nine stars. Four reviews.", say: "Pip's Bakery. Four point nine stars... four reviews." },
      { t: "Crumb and Co. Four point four stars. Four hundred and twelve reviews.", say: "Crumb and Co. Four point four stars... four hundred and twelve reviews." },
      "Hazel doesn't even think about it. She picks the one with four hundred and twelve.",
      { t: "Pip's rating was higher. It didn't matter.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@hz", a.start, { x: -140, y: 0 });
      mood(c, "@hazel", "neutral", a.start);
      c.pop("@clock", a.start + a.dur * 0.7);
      c.sfx("tick", a.start + a.dur * 0.7);
      say(c, "@hazel", b, "");
      c.in("@srch", b.start, { y: 300, d: 0.6 });
      c.js(`const q_dc = { n: 0 }, Q_dc = "bakery near me"; tl.fromTo(q_dc, { n: 0 }, { n: Q_dc.length, duration: 1.0, ease: "none", onUpdate: () => { document.getElementById("${c.id("srch-q")}").textContent = Q_dc.slice(0, Math.round(q_dc.n)); } }, ${T(b.start + 0.2)});`);
      for (let k = 0; k < 7; k++) c.sfx("tap", b.start + 0.2 + k * 0.15);
      c.js(`tl.fromTo("${c.q(".ws-res")}", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.25, ease: "power3.out" }, ${T(d.start)});`);
      c.js(`tl.to("${c.q("@r0")}", { scale: 1.05, duration: 0.3 }, ${T(e.start)}); tl.to("${c.q("@r0")}", { scale: 1, duration: 0.3 }, ${T(e.end)});`);
      c.pop("@few", e.start + e.dur * 0.75); c.sfx("buzz", e.start + e.dur * 0.75);
      c.js(`tl.to("${c.q("@r1")}", { scale: 1.05, boxShadow: "0 0 0 6px #22c55e", duration: 0.3 }, ${T(f.start)});`);
      c.pop("@lots", f.start + f.dur * 0.75); c.sfx("ding", f.start + f.dur * 0.75);
      mood(c, "@hazel", "grin", g.start + g.dur * 0.6);
      c.pop("@pick", g.start + g.dur * 0.6); c.sfx("thud", g.start + g.dur * 0.6);
      c.to("@srch, @few, @lots, @pick, @clock", { autoAlpha: 0, duration: 0.4 }, h.start - 0.1);
      c.in("@tw", h.start, { y: 60, d: 0.8 });
      c.js(`tl.fromTo("${c.q("@tw .pinw")}", { y: 300, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)", stagger: 0.25 }, ${T(h.start + 0.3)});`);
      spin(c, "@tw", -46, -34, h.start, h.dur + 1);
      c.sfx("whoosh", h.start + 0.3);
      return `<div class="pos h" id="@hz" style="left:130px;top:330px">${hazel("neutral", 280, "@hazel", { phone: true })}</div>
      <div class="wr-pill h" id="@clock" style="left:560px;top:60px;background:#fbbc04;color:#1f1300">⏱️ 6 seconds</div>
      ${pack("@srch", "", PIPROW("4", "h", "@r0") + CRUMB("412", "h", "@r1"), `style="left:560px;top:150px"`)}
      <div class="wr-pill h" id="@few" style="left:1380px;top:330px;background:#ef4444;color:#fff">Only 4? 🤨</div>
      <div class="wr-pill h" id="@lots" style="left:1380px;top:470px;background:#16a34a;color:#fff">412! 😮</div>
      <div class="wr-pill h" id="@pick" style="left:1340px;top:640px;background:#fff;color:#0b1220">🐰 Off to Crumb &amp; Co.</div>
      <div class="h" id="@tw" style="position:absolute;inset:0">${town([{ id: "@pin1", x: 470, y: 330, h: 260, label: "Crumb &amp; Co.", sub: "4.4 ★ (412)", cls: "big" }, { id: "@pin2", x: 1160, y: 560, h: 60, label: "Pip's", sub: "4.9 ★ (4)", cls: "you" }])}</div>`;
    },
  },
  // ───────── 5. Social proof ─────────
  {
    id: "proof", chapter: "The shortcut your brain uses", music: "soft",
    lines: [
      "Why? Because our brains run on a shortcut called social proof.",
      "When we're not sure what to do, we copy what other people did.",
      "Four hundred and twelve reviews says: hundreds of people came here, and it was good.",
      "Four reviews says: maybe nobody comes here. And maybe there's a reason.",
      { t: "It's the same reason you pick the busy restaurant on vacation, and walk past the empty one.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@brain", a.start, { scale: 0.6, ease: "back.out(2)" });
      c.in("@k", a.start + a.dur * 0.55, { y: 30 });
      c.sfx("ding", a.start + a.dur * 0.55);
      c.to("@brain", { scale: 0.5, x: -560, y: -180, duration: 0.6, ease: "power2.inOut" }, b.start);
      c.to("@k", { autoAlpha: 0, duration: 0.3 }, b.start);
      c.js(`tl.fromTo("${c.q(".flow .pos")}", { x: 1300, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.4, ease: "power2.out", stagger: 0.18 }, ${T(b.start + 0.2)});`);
      c.in("@hz", b.start + b.dur * 0.6, { x: 300, y: 0, d: 0.9 });
      mood(c, "@hazel", "stare", b.start + b.dur * 0.6);
      c.in("@th1", d.start, { y: 30, scale: 0.8 }); c.sfx("pop", d.start);
      c.in("@th2", e.start, { y: 30, scale: 0.8 }); c.sfx("pop", e.start);
      mood(c, "@hazel", "sad", e.start + 0.4);
      c.to("@th1, @th2, @brain, @hz, .flow", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@v1", f.start, { x: -100, y: 0 }); c.in("@v2", f.start + 0.3, { x: 100, y: 0 });
      c.pop("@vs", f.start + f.dur * 0.55);
      c.sfx("thud", f.start + f.dur * 0.55);
      return `<div class="pos h" id="@brain" style="left:760px;top:180px;font-size:300px;line-height:1">🧠</div>
      <div class="ws-big h" id="@k" style="top:640px;font-size:110px"><span class="o">Social proof</span></div>
      <div class="flow" style="position:absolute;inset:0">${crowd("@f", 9, 200, 560, 130, 120, 0, "grin", true)}</div>
      <div class="pos h" id="@hz" style="left:1520px;top:520px">${hazel("smile", 180)}</div>
      <div class="bub h" id="@th1" style="left:420px;top:250px;font-size:46px">412 reviews 👉 “Everyone goes here. It's safe.” ✅</div>
      <div class="bub alt h" id="@th2" style="left:420px;top:390px;font-size:46px;background:#fee2e2">4 reviews 👉 “Does anyone go here?” 🤔</div>
      <div class="h" id="@v1" style="position:absolute;left:180px;top:200px;width:700px;height:560px;border-radius:40px;background:linear-gradient(180deg,#fde68a,#f59e0b);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1f1300;font-family:'Space Grotesk';font-weight:700;font-size:56px;box-shadow:0 40px 90px rgba(0,0,0,.4)"><div style="font-size:150px">🍝👥👥👥</div>Busy = must be good</div>
      <div class="h" id="@v2" style="position:absolute;left:1040px;top:200px;width:700px;height:560px;border-radius:40px;background:linear-gradient(180deg,#cbd5e1,#64748b);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0f172a;font-family:'Space Grotesk';font-weight:700;font-size:56px;box-shadow:0 40px 90px rgba(0,0,0,.4)"><div style="font-size:150px">🍝🪑🪑</div>Empty = must be bad?</div>
      <div class="wr-pill h" id="@vs" style="left:880px;top:430px;background:#0b1220;color:#fff;font-size:56px">VS</div>`;
    },
  },
  // ───────── 6. 97% / 41% ─────────
  {
    id: "read", chapter: "97% of people read reviews", music: "pulse",
    lines: [
      "And almost everyone does this now.",
      { t: "In BrightLocal's 2026 survey of American shoppers, ninety-seven percent said they read reviews for local businesses.", say: "In BrightLocal's twenty twenty-six survey of American shoppers, ninety-seven percent said they read reviews for local businesses." },
      { t: "Forty-one percent said they always read them. Just one year earlier, that was twenty-nine percent.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@k", a.start);
      c.in("@dots", a.start + 0.3, { scale: 0.85 });
      c.js(`tl.fromTo("${c.q("@dots i.on")}", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.022, ease: "back.out(2)" }, ${T(b.start + 0.2)});`);
      c.in("@s97", b.start + b.dur * 0.55, { x: 80, y: 0 });
      count(c, "s97-n", 0, 97, b.start + b.dur * 0.55, 1.4);
      c.sfx("ding", b.start + b.dur * 0.55 + 1.4);
      c.in("@src", b.start + 0.4, { y: -20 });
      c.to("@s97", { autoAlpha: 0, x: 80, duration: 0.4 }, d.start - 0.1);
      c.in("@s41", d.start, { x: 80, y: 0 });
      count(c, "s41-n", 0, 41, d.start + 0.1, 1.1);
      c.in("@was", d.start + d.dur * 0.6, { y: 30 });
      c.sfx("pop", d.start + d.dur * 0.6);
      c.js(`tl.to("${c.q("@dots i:nth-child(-n+41)")}", { backgroundColor: "#ff6a1f", duration: 0.3, stagger: 0.01 }, ${T(d.start + 0.3)});`);
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Who reads reviews?</div>
      ${dots("@dots", 97).replace('class="wr-dots h"', 'class="wr-dots h" style="left:150px;top:220px"')}
      ${stat("@s97", "0", "of shoppers read reviews for local businesses", 1020, 250, "%")}
      ${stat("@s41", "0", "<span style='color:#ff6a1f'>always</span> read them", 1060, 220, "%")}
      <div class="wr-pill h" id="@was" style="left:1140px;top:690px;background:#fff;color:#0b1220">📈 Up from 29% a year earlier</div>
      ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`;
    },
  },
  // ───────── 7. The 20-review wall ─────────
  {
    id: "twenty", chapter: "The 20-review wall", music: "pulse",
    lines: [
      "Then there's how many reviews you have.",
      "Forty-seven percent of shoppers won't use a business with fewer than twenty reviews.",
      "And only nine percent would try one with five reviews or fewer.",
      { t: "Pip has four.", say: "Pip has... four." },
      { t: "Which means, for most of the town, Pip's Bakery might as well not exist.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      cam(c, [0, 0, 0], [-80, -4, 160]);
      c.in("@s47", b.start, { y: 60 });
      count(c, "s47-n", 0, 47, b.start + 0.1, 1.1);
      c.in("@src", b.start + 0.4, { y: -20 });
      c.sfx("ding", b.start + 1.3);
      c.to("@s47", { autoAlpha: 0, y: -40, duration: 0.4 }, d.start - 0.1);
      c.in("@s9", d.start, { y: 60 });
      count(c, "s9-n", 0, 9, d.start + 0.1, 0.8);
      c.to("@s9", { autoAlpha: 0, y: -40, duration: 0.4 }, e.start - 0.1);
      c.in("@four", e.start, { scale: 0.5, ease: "back.out(2)" });
      mood(c, "@pip", "sad", e.start + 0.4);
      c.js(`tl.fromTo("${c.q("@wall")}", { y: -900, autoAlpha: 1 }, { y: 0, duration: 0.55, ease: "bounce.out" }, ${T(f.start + 0.1)});`);
      c.sfx("thud", f.start + 0.4);
      c.js(`tl.to("${c.q(".turn .who")}", { scaleX: -1, duration: 0.2, stagger: 0.12 }, ${T(f.start + 0.9)}); tl.to("${c.q(".turn .pos")}", { x: -600, duration: 2.4, ease: "power1.in", stagger: 0.12 }, ${T(f.start + 1.1)});`);
      c.js(`tl.set("${c.q(".turn .pos")}", { autoAlpha: 1 }, ${T(c.S)});`);
      return street("", `<div class="turn" style="position:absolute;left:0;top:0">${crowd("@t", 4, 860, 610, 115, 110, 3, "neutral", true)}</div>`,
        `<div class="pos" style="left:1500px;top:480px">${pip("smile", 230)}</div>
        <div class="wr-wall" id="@wall" style="left:1020px;top:200px;width:820px;opacity:0;visibility:hidden">🚫 Fewer than 20 reviews<br/><span style="font-size:36px">47% won't go in</span></div>
        ${stat("@s47", "0", "won't use a business with <span style='color:#fbbc04'>fewer than 20 reviews</span>", 640, 150, "%")}
        ${stat("@s9", "0", "would try one with <span style='color:#fbbc04'>5 reviews or fewer</span>", 680, 150, "%")}
        <div class="wr-pill h" id="@four" style="left:1380px;top:120px;background:#ef4444;color:#fff;font-size:60px">Pip: 4 reviews 😬</div>
        ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`);
    },
  },
  // ───────── 8. The first five reviews ─────────
  {
    id: "five", chapter: "Why the first 5 reviews matter most", music: "soft",
    lines: [
      "But here's the good news. You don't need hundreds of reviews to start winning.",
      "Researchers at Northwestern University's Spiegel Research Center studied how reviews change what people buy.",
      "Products with five reviews were two hundred and seventy percent more likely to be bought than products with none.",
      "And nearly all of that jump happened within the first ten reviews.",
      { t: "The first handful of reviews does most of the heavy lifting.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@good", a.start, { y: 40 });
      mood(c, "@pip", "shock", a.start + 0.6);
      c.in("@pp", a.start, { x: -100, y: 0 });
      c.in("@uni", b.start, { y: 40 });
      c.in("@src", b.start + 0.3, { y: -20 });
      c.to("@good, @uni", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@bars", d.start, { y: 40 });
      c.js(`tl.fromTo("${c.q("@bars-b0")}", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "back.out(1.4)" }, ${T(d.start + 0.3)}); tl.fromTo("${c.q("@bars-b1")}", { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power3.out" }, ${T(d.start + d.dur * 0.5)});`);
      c.sfx("whoosh", d.start + d.dur * 0.5);
      c.pop("@plus", d.start + d.dur * 0.5 + 1.2);
      c.sfx("ding", d.start + d.dur * 0.5 + 1.2);
      mood(c, "@pip", "grin", d.start + d.dur * 0.6);
      c.in("@brk", e.start + 0.2, { x: 60, y: 0 });
      c.sfx("pop", e.start + 0.2);
      c.in("@lift", f.start, { y: 30 });
      return `<div class="pos h" id="@pp" style="left:90px;top:560px">${pip("smile", 220)}</div>
      <div class="ws-big h" id="@good" style="top:250px;font-size:96px">Good news: <span class="g">you don't need hundreds.</span></div>
      <div class="ws-sub h" id="@uni" style="left:0;right:0;text-align:center;top:450px;font-size:44px">🎓 Spiegel Research Center · Northwestern University</div>
      ${bars3d("@bars", [["No reviews", "1×", 26, "#64748b"], ["5 reviews", "3.7×", 96, "#fbbc04"]], 'style="left:520px;top:200px"')}
      <div class="wr-pill h" id="@plus" style="left:1010px;top:110px;background:#16a34a;color:#fff;font-size:52px">+270% more likely to buy</div>
      <div class="h" id="@brk" style="position:absolute;left:1240px;top:300px;width:560px;padding:34px;border-radius:30px;background:rgba(9,14,28,.92);border:3px solid #22c55e;font-size:40px;font-weight:800;line-height:1.3">Nearly all of the jump happens in the <span style="color:#22c55e">first 10 reviews</span></div>
      <div class="wr-pill h" id="@lift" style="left:1240px;top:620px;background:#fff;color:#0b1220">💪 The first few do the heavy lifting</div>
      ${src("@src", "Spiegel Research Center, Northwestern University (2017)")}`;
    },
  },
  // ───────── 9. Perfect isn't the goal ─────────
  {
    id: "perfect", chapter: "Why 5.0 stars can look fake", music: "soft",
    lines: [
      "There's another twist.",
      { t: "In that same research, buying peaked for ratings between about four point oh and four point seven stars. Closer to a perfect five, it started to drop.", say: "In that same research, buying peaked for ratings between about four point oh, and four point seven stars. Closer to a perfect five... it started to drop." },
      "Too perfect looks too good to be true. A few honest, mixed reviews make the good ones believable.",
      { t: "So Pip doesn't need perfect. He needs real.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@k", a.start);
      c.in("@ch", a.start + 0.4, { y: 40 });
      c.js(`tl.fromTo("${c.q("@curve")}", { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: ${T(b.dur * 0.7)}, ease: "power1.inOut" }, ${T(b.start)});`);
      c.js(`tl.fromTo("${c.q("@band")}", { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: "power2.out", transformOrigin: "50% 50%" }, ${T(b.start + b.dur * 0.45)});`);
      c.sfx("ding", b.start + b.dur * 0.45);
      c.pop("@sus", b.start + b.dur * 0.85); c.sfx("buzz", b.start + b.dur * 0.85);
      c.in("@src", b.start, { y: -20 });
      c.to("@ch, @sus, @k", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@r0", d.start + 0.1, { x: -60, y: 0 }); c.in("@r1", d.start + 0.5, { x: -60, y: 0 }); c.in("@r2", d.start + 0.9, { x: -60, y: 0 });
      c.sfx("pop", d.start + 0.1); c.sfx("pop", d.start + 0.5); c.sfx("pop", d.start + 0.9);
      c.in("@pp", e.start, { x: 100, y: 0 });
      mood(c, "@pip", "grin", e.start + e.dur * 0.6);
      c.pop("@real", e.start + e.dur * 0.6); c.sfx("chime", e.start + e.dur * 0.6);
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Is 5.0 stars the goal?</div>
      <div class="wr-chart h" id="@ch" style="left:410px;top:170px"><svg viewBox="0 0 1020 480">
        <rect id="@band" x="560" y="0" width="300" height="420" rx="16" fill="rgba(34,197,94,.18)" stroke="#22c55e" stroke-width="3" stroke-dasharray="10 8"/>
        <text x="710" y="40" text-anchor="middle" font-size="30" font-weight="800" fill="#22c55e">4.0 – 4.7 ★ sweet spot</text>
        <path d="M0 420H1020M0 0V420" stroke="#475569" stroke-width="4"/>
        <path id="@curve" d="M20 400C200 380 380 330 520 230S700 70 760 70S900 140 1000 250" fill="none" stroke="#fbbc04" stroke-width="12" stroke-linecap="round" stroke-dasharray="1400"/>
        ${["3.0", "3.5", "4.0", "4.5", "5.0"].map((s, i) => `<text x="${80 + i * 225}" y="466" text-anchor="middle" font-size="28" font-weight="700" fill="#94a3b8">${s} ★</text>`).join("")}
        <text x="-210" y="-14" transform="rotate(-90)" text-anchor="middle" font-size="26" font-weight="700" fill="#94a3b8">Likely to buy</text>
      </svg></div>
      <div class="wr-pill h" id="@sus" style="left:1340px;top:520px;background:#fff;color:#0b1220">5.0 ★ from 4 reviews? 🤨</div>
      ${review("@r0", "Maya", "#7c3aed", 5, "Best croissant I've had outside Paris. 🥐", "1 week ago", "", 'style="left:120px;top:170px;width:820px"')}
      ${review("@r1", "Theo", "#0ea5e9", 4, "Amazing pastries. The line moved a bit slow on Saturday.", "2 weeks ago", "", 'style="left:200px;top:390px;width:820px"')}
      ${review("@r2", "Ruth", "#16a34a", 5, "Sweet little bakery. Ask for the almond one.", "3 weeks ago", "", 'style="left:120px;top:610px;width:820px"')}
      <div class="pos h" id="@pp" style="left:1240px;top:330px">${pip("smile", 250)}</div>
      <div class="wr-pill h" id="@real" style="left:1180px;top:200px;background:#22c55e;color:#062014;font-size:46px">Real &gt; perfect ✅</div>
      ${src("@src", "Spiegel Research Center, Northwestern University (2017). Curve shows the shape of the finding.")}`;
    },
  },
  // ───────── 10. Money ─────────
  {
    id: "money", chapter: "One more star = more money", music: "pulse",
    lines: [
      "Okay. But do reviews actually make a business more money?",
      "A Harvard Business School study by Michael Luca looked at restaurants in Seattle and their ratings on Yelp.",
      "A one-star increase in rating was linked to five to nine percent more revenue.",
      "And that effect showed up in independent restaurants. For big chains, ratings barely moved the needle.",
      { t: "Think about that. Reviews matter most for small businesses. Businesses like Pip's.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@reg", a.start, { scale: 0.7, ease: "back.out(1.8)" });
      c.js(`tl.to("${c.q("@reg")}", { rotation: -4, duration: 0.12, yoyo: true, repeat: 5 }, ${T(a.start + a.dur * 0.6)});`);
      c.sfx("ring", a.start + a.dur * 0.6);
      c.in("@hbs", b.start, { y: 40 });
      c.in("@src", b.start + 0.3, { y: -20 });
      c.to("@hbs", { autoAlpha: 0, duration: 0.3 }, d.start - 0.1);
      c.in("@sm", d.start, { y: 60 });
      c.js(`tl.fromTo("${c.q(".coin")}", { y: -700, autoAlpha: 1 }, { y: 0, duration: 0.7, ease: "bounce.out", stagger: 0.08 }, ${T(d.start + d.dur * 0.5)});`);
      for (let k = 0; k < 6; k++) c.sfx("tick", d.start + d.dur * 0.5 + 0.5 + k * 0.08);
      c.to("@sm, @reg, .coin", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@ind", e.start, { x: -100, y: 0 }); c.in("@chn", e.start + e.dur * 0.55, { x: 100, y: 0 });
      c.js(`tl.fromTo("${c.q("@arr")}", { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "back.out(1.5)", transformOrigin: "50% 100%" }, ${T(e.start + 0.4)});`);
      c.sfx("whoosh", e.start + 0.4);
      c.in("@pp", f.start + f.dur * 0.5, { y: 80 });
      mood(c, "@pip", "grin", f.start + f.dur * 0.5);
      c.sfx("chime", f.start + f.dur * 0.5);
      return `<div class="pos h" id="@reg" style="left:260px;top:280px;font-size:280px;line-height:1">💰</div>
      <div class="ws-sub h" id="@hbs" style="left:0;right:0;text-align:center;top:620px;font-size:46px">🎓 Harvard Business School · Seattle restaurants · Yelp ratings</div>
      ${stat("@sm", "+5–9%", "more revenue from a <span style='color:#fbbc04'>one-star</span> increase", 760, 230)}
      ${Array.from({ length: 10 }, (_, i) => `<div class="pos coin h" style="left:${200 + i * 60}px;top:${640 + (i % 3) * 16}px;font-size:70px">🪙</div>`).join("")}
      <div class="h" id="@ind" style="position:absolute;left:220px;top:180px;width:640px;height:620px;border-radius:40px;background:rgba(9,14,28,.92);border:4px solid #22c55e;text-align:center;padding-top:30px"><div style="font-size:44px;font-weight:800">🏠 Independent</div><div id="@arr" style="margin:30px auto 0;width:150px;height:380px;background:linear-gradient(180deg,#22c55e,#15803d);clip-path:polygon(50% 0,100% 30%,70% 30%,70% 100%,30% 100%,30% 30%,0 30%)"></div></div>
      <div class="h" id="@chn" style="position:absolute;left:1060px;top:180px;width:640px;height:620px;border-radius:40px;background:rgba(9,14,28,.92);border:4px solid #64748b;text-align:center;padding-top:30px"><div style="font-size:44px;font-weight:800">🏢 Big chain</div><div style="margin:200px auto 0;width:300px;height:30px;border-radius:15px;background:#64748b"></div><div style="margin-top:30px;font-size:34px;color:#94a3b8;font-weight:700">barely moved</div></div>
      <div class="pos h" id="@pp" style="left:840px;top:620px">${pip("smile", 200)}</div>
      ${src("@src", "Michael Luca, Harvard Business School, “Reviews, Reputation, and Revenue: The Case of Yelp.com” (2011)")}`;
    },
  },
  // ───────── 11. Google's map ─────────
  {
    id: "google", chapter: "How reviews move you up on Google", music: "pulse",
    lines: [
      "Reviews don't just change minds. They change who gets seen.",
      { t: "Google says it right on its own help page: more reviews and positive ratings can help your business's local ranking.", say: "Google says it right on its own help page: more reviews, and positive ratings, can help your business's local ranking." },
      "It's one signal among others, like how close you are and how well your profile matches the search. But it's one you can actually do something about.",
      { t: "Right now, Rocco shows up first. Pip shows up, if you keep scrolling.", say: "Right now, Rocco shows up first. Pip shows up... if you keep scrolling.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@tw", a.start, { y: 80, d: 0.9 });
      spin(c, "@tw", -52, -28, a.start, c.E - a.start);
      c.js(`tl.fromTo("${c.q("@tw .pinw")}", { y: 400, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.3)", stagger: 0.3 }, ${T(a.start + a.dur * 0.5)});`);
      c.sfx("whoosh", a.start + a.dur * 0.5);
      c.in("@q", b.start, { y: 40 });
      c.in("@src", b.start + 0.3, { y: -20 });
      c.to("@q", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.to("@tw", { autoAlpha: 0.35, duration: 0.4 }, d.start);
      ["@g0", "@g1", "@g2"].forEach((s, i) => { c.in(s, d.start + d.dur * (0.15 + i * 0.22), { x: -60, y: 0 }); c.sfx("pop", d.start + d.dur * (0.15 + i * 0.22)); });
      c.js(`tl.to("${c.q("@g2")}", { scale: 1.08, borderColor: "#fbbc04", duration: 0.3 }, ${T(d.start + d.dur * 0.78)});`);
      c.to("@g0, @g1, @g2", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.to("@tw", { autoAlpha: 0.3, duration: 0.5 }, e.start);
      c.in("@rank", e.start, { x: 100, y: 0 });
      c.js(`tl.fromTo("${c.q("@rank .rows")}", { y: 0 }, { y: -330, duration: 1.4, ease: "power2.inOut" }, ${T(e.start + e.dur * 0.55)});`);
      c.sfx("whoosh", e.start + e.dur * 0.55);
      return `<div class="h" id="@tw" style="position:absolute;inset:0">${town([
        { id: "@pa", x: 470, y: 300, z: 170, h: 120, label: "Crumb &amp; Co.", sub: "4.4 ★ (412)", cls: "big" },
        { id: "@pb", x: 900, y: 200, z: 110, h: 80, label: "Donut Den", sub: "4.5 ★ (188)" },
        { id: "@pc", x: 200, y: 680, z: 90, h: 60, label: "Bagel Barn", sub: "4.3 ★ (97)" },
        { id: "@pd", x: 1180, y: 690, z: 100, h: 10, label: "Pip's", sub: "4.9 ★ (4)", cls: "you" },
      ])}</div>
      <div class="bub h" id="@q" style="left:280px;top:790px;font-size:40px;white-space:normal;width:1360px;text-align:center">“More reviews and positive ratings can help your business's local ranking.” <span style="color:#64748b">— Google</span></div>
      <div class="ws-chip h" id="@g0" style="left:120px;top:150px;border-color:#64748b"><b style="background:#64748b">📍</b>How close you are</div>
      <div class="ws-chip h" id="@g1" style="left:120px;top:260px;border-color:#64748b"><b style="background:#64748b">🔎</b>How well you match the search</div>
      <div class="ws-chip h" id="@g2" style="left:120px;top:370px"><b>⭐</b>Your reviews: the one you control</div>
      <div class="h" id="@rank" style="position:absolute;left:650px;top:100px;width:620px;height:640px;overflow:hidden;border-radius:36px;background:#fff;color:#0b1220;padding:26px;box-shadow:0 40px 100px rgba(0,0,0,.5)"><div style="font-size:30px;font-weight:800;color:#64748b;margin-bottom:16px">🔍 bakery near me</div><div class="rows" style="display:flex;flex-direction:column;gap:14px">
        ${[["1", "Crumb &amp; Co.", "4.4 ★ (412)"], ["2", "Donut Den", "4.5 ★ (188)"], ["3", "Bagel Barn", "4.3 ★ (97)"], ["4", "Sweet Rise", "4.2 ★ (64)"], ["5", "Corner Cafe", "4.0 ★ (51)"], ["6", "The Muffin Box", "4.1 ★ (33)"], ["7", "Pip's Bakery", "4.9 ★ (4)"]].map(([n, nm, r]) => `<div style="padding:18px 22px;border-radius:18px;background:${nm.startsWith("Pip") ? "#fff7ed;border:4px solid #ff6a1f" : "#f1f5f9"}"><b style="font-size:30px">${n}. ${nm}</b><div style="font-size:24px;color:#e8a200;font-weight:800">${r}</div></div>`).join("")}</div></div>
      <div class="ws-note" style="top:auto;bottom:150px">Illustrative example. Google decides rankings, and no one can guarantee them.</div>
      ${src("@src", "Google Business Profile Help: “Tips to improve your local ranking on Google”")}`;
    },
  },
  // ───────── 12. Fresh ─────────
  {
    id: "fresh", chapter: "Reviews go stale (like bread)", music: "soft",
    lines: [
      "And reviews go stale. Just like bread.",
      "Seventy-four percent of shoppers only care about reviews written in the last three months.",
      "Pip's newest review? It's from last spring.",
      { t: "To most people, that looks like a bakery that might not even be open anymore.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@bread", a.start, { scale: 0.6, ease: "back.out(2)" });
      c.js(`tl.to("${c.q("@bread")}", { filter: "grayscale(1) brightness(.7)", rotation: 8, duration: 1.2 }, ${T(a.start + a.dur * 0.5)});`);
      c.to("@bread", { autoAlpha: 0, duration: 0.3 }, b.start);
      c.in("@s74", b.start, { y: 60 });
      count(c, "s74-n", 0, 74, b.start + 0.1, 1.2);
      c.in("@src", b.start + 0.3, { y: -20 });
      c.sfx("ding", b.start + 1.3);
      c.to("@s74", { autoAlpha: 0, y: -40, duration: 0.4 }, d.start - 0.1);
      c.in("@rv", d.start, { y: 50 });
      c.pop("@date", d.start + d.dur * 0.6);
      c.sfx("buzz", d.start + d.dur * 0.6);
      c.js(`tl.to("${c.q("@rv")}", { filter: "grayscale(1)", opacity: 0.55, rotation: -3, duration: 1.2 }, ${T(e.start)});`);
      c.js(`tl.fromTo("${c.q(".crumb-p")}", { autoAlpha: 0, y: 0 }, { autoAlpha: 1, y: 260, rotation: 120, duration: 1.4, ease: "power2.in", stagger: 0.05 }, ${T(e.start + 0.5)});`);
      c.in("@closed", e.start + e.dur * 0.55, { scale: 0.7 });
      c.sfx("thud", e.start + e.dur * 0.55);
      return `<div class="pos h" id="@bread" style="left:780px;top:260px;font-size:330px;line-height:1">🥖</div>
      ${stat("@s74", "0", "only care about reviews from the <span style='color:#fbbc04'>last 3 months</span>", 560, 220, "%")}
      ${review("@rv", "Gus", "#f59e0b", 5, "Lovely little bakery! The cinnamon rolls are unreal.", "<span id='@date-x'>10 months ago</span>", "", 'style="left:300px;top:260px;width:900px"')}
      <div class="wr-pill h" id="@date" style="left:860px;top:180px;background:#ef4444;color:#fff">🗓️ 10 months ago</div>
      ${Array.from({ length: 12 }, (_, i) => `<i class="pos crumb-p h" style="left:${340 + i * 70}px;top:520px;width:${14 + (i % 3) * 6}px;height:${12 + (i % 2) * 8}px;border-radius:40%;background:#c9a27a"></i>`).join("")}
      <div class="h" id="@closed" style="position:absolute;left:1280px;top:300px;padding:24px 40px;border-radius:18px;background:#fff;color:#0b1220;font-family:'Space Grotesk';font-weight:700;font-size:56px;transform:rotate(6deg);box-shadow:0 30px 80px rgba(0,0,0,.4);border:6px solid #0b1220">Still open? 🤷</div>
      ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`;
    },
  },
  // ───────── 13. AI ─────────
  {
    id: "ai", chapter: "AI is reading your reviews now", music: "pulse",
    lines: [
      "And there's a new kind of reader. AI.",
      "In 2026, forty-five percent of shoppers said they use ChatGPT or other AI tools to find local businesses. A year earlier, it was six percent.",
      { t: "Ask an AI for the best bakery nearby, and it leans on what's written about each one online. Businesses with lots of recent reviews simply give it more to go on.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@robot", a.start, { scale: 0.6, ease: "back.out(2)" });
      c.sfx("ding", a.start + a.dur * 0.6);
      c.in("@bars", b.start + 0.2, { y: 40 });
      c.js(`tl.fromTo("${c.q("@bars-b0")}", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, ${T(b.start + b.dur * 0.75)}); tl.fromTo("${c.q("@bars-b1")}", { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power3.out" }, ${T(b.start + b.dur * 0.25)});`);
      c.sfx("whoosh", b.start + b.dur * 0.25);
      c.in("@src", b.start + 0.3, { y: -20 });
      c.to("@bars, @robot", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@chat", d.start, { y: 60 });
      c.in("@ans", d.start + d.dur * 0.35, { y: 20 });
      c.sfx("pop", d.start + d.dur * 0.35);
      c.js(`tl.fromTo("${c.q("@ans .typing")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2.2, ease: "none" }, ${T(d.start + d.dur * 0.38)});`);
      return `<div class="pos h" id="@robot" style="left:150px;top:260px;font-size:260px;line-height:1">🤖</div>
      ${bars3d("@bars", [["2025", "6%", 13, "#64748b"], ["2026", "45%", 92, "#a855f7"]], 'style="left:740px;top:220px"')}
      <div class="wr-chat h" id="@chat" style="left:500px;top:170px"><div class="q">What's the best bakery near me? 🥐</div>
        <div class="a h" id="@ans"><div class="ai"></div><div class="typing">Based on <b>412 reviews</b>, Crumb &amp; Co. is a popular choice. Customers mention fast service and fresh bread…</div></div></div>
      <div class="ws-note" style="top:auto;bottom:150px">Illustrative example of an AI answer.</div>
      ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`;
    },
  },
  // ───────── 14. Why Pip has so few ─────────
  {
    id: "few", chapter: "Why great businesses have few reviews", music: "soft",
    lines: [
      "So why does Pip only have four?",
      "It's not because people don't like him. They love him.",
      "Happy customers just leave. They got their croissant. They're on with their day.",
      "Upset customers? They remember. They go home and write.",
      { t: "And Pip's sign says: please review us on Google. Which almost nobody does.", say: "And Pip's sign says: please review us on Google. Which... almost nobody does." },
      "Because leaving a review is a chore. Open Google. Search the bakery. Find it. Scroll to reviews. Tap. Write.",
      { t: "Every step loses people.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@pp", a.start, { y: 60 });
      mood(c, "@pip", "sad", a.start + 0.3);
      c.js(`tl.fromTo("${c.q(".fans .pos")}", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.6)" }, ${T(b.start)});`);
      c.js(`tl.fromTo("${c.q(".heart")}", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, y: -40, duration: 0.5, stagger: 0.12 }, ${T(b.start + b.dur * 0.6)});`);
      mood(c, "@pip", "grin", b.start + b.dur * 0.6);
      c.js(`tl.to("${c.q(".fans .pos, .heart")}", { x: 2000, duration: 2.2, ease: "power1.in", stagger: 0.08 }, ${T(d.start + 0.3)});`);
      mood(c, "@pip", "neutral", d.start + 1);
      c.in("@grump", e.start, { x: -200, y: 0 });
      c.in("@cloud", e.start + 0.4, { y: -30 });
      c.sfx("buzz", e.start + e.dur * 0.6);
      c.js(`tl.to("${c.q("@cloud")}", { x: 8, duration: 0.08, yoyo: true, repeat: 9 }, ${T(e.start + e.dur * 0.6)});`);
      c.to("@grump, @cloud", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@sign", f.start, { y: -200, ease: "bounce.out", d: 0.8 });
      c.sfx("thud", f.start + 0.6);
      c.js(`tl.to("${c.q("@sign")}", { rotation: 4, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${T(f.start + 1)});`);
      c.pop("@zz", f.start + f.dur * 0.7);
      c.to("@sign, @zz, @pp", { autoAlpha: 0, duration: 0.4 }, g.start - 0.1);
      c.in("@fun", g.start, { x: -60, y: 0 });
      const st = [0.22, 0.35, 0.47, 0.6, 0.74, 0.86];
      st.forEach((p, i) => { c.js(`tl.fromTo("${c.q(`@st${i}`)}", { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out" }, ${T(g.start + g.dur * p)});`); c.sfx("tap", g.start + g.dur * p); });
      c.in("@lose", h.start, { x: 80, y: 0 });
      c.js(`tl.fromTo("${c.q(".fdot")}", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, ${T(g.start + g.dur * 0.3)});`);
      c.js(`tl.to("${c.q(".fdot")}", { y: 500, rotation: 90, autoAlpha: 0, duration: 1.1, ease: "power2.in", stagger: 0.2 }, ${T(h.start + 0.2)});`);
      c.sfx("whoosh", h.start + 0.2);
      return `<div class="wr-bakery"><div class="shelf" style="top:260px">${["🥐", "🥖", "🍞", "🥯", "🧁", "🥐"].map((e, i) => `<span style="left:${60 + i * 270}px">${e}</span>`).join("")}</div></div><div class="wr-counter"></div>
      <div class="pos h" id="@pp" style="left:820px;top:380px">${pip("smile", 250)}</div>
      <div class="fans" style="position:absolute;inset:0">${crowd("@fa", 4, 160, 470, 150, 160, 0, "grin", true)}${[0, 1, 2, 3].map((i) => `<div class="pos heart h" style="left:${200 + i * 160}px;top:430px;font-size:60px">❤️</div>`).join("")}</div>
      <div class="pos h" id="@grump" style="left:1350px;top:420px">${critter("turtle", "mad", 230, "@tt", { cap: "#334155" })}</div>
      <div class="pos h" id="@cloud" style="left:1300px;top:150px;font-size:200px;line-height:1">⛈️</div>
      <div class="h" id="@sign" style="position:absolute;left:360px;top:120px;padding:34px 46px;border-radius:20px;background:#fffaf0;color:#7c2d12;font-family:'Space Grotesk';font-weight:700;font-size:58px;border:8px solid #7c2d12;box-shadow:0 30px 70px rgba(0,0,0,.3)">Please review us on Google! 🙏</div>
      <div class="pos h" id="@zz" style="left:1180px;top:110px;font-size:110px">💤</div>
      <div class="wr-funnel h" id="@fun" style="left:180px;top:120px">${["Open Google", "Search the bakery", "Find the right one", "Scroll to reviews", "Tap “Write a review”", "Write it"].map((s, i) => `<div class="st h" id="@st${i}" style="width:${1040 - i * 90}px"><b>${i + 1}</b>${s}<em>${"🐾".repeat(Math.max(1, 6 - i))}</em></div>`).join("")}</div>
      ${[0, 1, 2, 3, 4].map((i) => `<div class="pos fdot h" style="left:${1280 + i * 70}px;top:${200 + i * 96}px;font-size:56px">🐾</div>`).join("")}
      <div class="wr-pill h" id="@lose" style="left:1240px;top:740px;background:#ef4444;color:#fff">Every step loses people 📉</div>`;
    },
  },
  // ───────── 15. Rocco's secret ─────────
  {
    id: "ask", chapter: "Rocco's secret (it's not a trick)", music: "soft",
    lines: [
      "Meanwhile, across the street, Rocco has a secret. And it's not a trick.",
      "He asks. Every customer, every time.",
      { t: "Hey, if you liked it, would you leave us a quick review? It really helps.", v: ROCCO, gap: 0.5 },
      { t: "When BrightLocal surveyed shoppers back in 2017, sixty-eight percent said they left a review for a local business when they were asked.", say: "When BrightLocal surveyed shoppers back in twenty seventeen, sixty-eight percent said they left a review for a local business when they were asked." },
      { t: "Most people are happy to help. They just need to be asked, at the right moment, and it needs to be easy.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@roc", a.start, { x: 140, y: 0 });
      mood(c, "@rocco", "wink", a.start + a.dur * 0.6);
      c.pop("@shh", a.start + a.dur * 0.6);
      c.sfx("pop", a.start + a.dur * 0.6);
      c.to("@shh", { autoAlpha: 0, duration: 0.3 }, b.start);
      c.js(`tl.fromTo("${c.q(".asked .pos")}", { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.18, ease: "back.out(1.5)" }, ${T(b.start)});`);
      c.js(`tl.fromTo("${c.q(".chk")}", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.18, ease: "back.out(2)" }, ${T(b.start + 0.6)});`);
      mood(c, "@rocco", "grin", d.start);
      say(c, "@rocco", d, "@rb");
      c.to("@roc, .asked, .chk", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@s68", e.start, { y: 60 });
      count(c, "s68-n", 0, 68, e.start + e.dur * 0.55, 1.1);
      c.sfx("ding", e.start + e.dur * 0.55 + 1.1);
      c.in("@src", e.start + 0.3, { y: -20 });
      c.to("@s68", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      ["@k0", "@k1", "@k2"].forEach((s, i) => { c.in(s, f.start + f.dur * (0.3 + i * 0.22), { y: 60 }); c.sfx("pop", f.start + f.dur * (0.3 + i * 0.22)); });
      return `<div class="wr-bakery" style="background:linear-gradient(180deg,#dbe7f5,#b7c9e2)"><div class="shelf" style="top:260px;background:#1e3a5f">${["🍞", "🥯", "🍞", "🥖", "🍞", "🥯"].map((e, i) => `<span style="left:${60 + i * 270}px">${e}</span>`).join("")}</div></div><div class="wr-counter" style="background:linear-gradient(180deg,#334e72,#1e3a5f)"></div>
      <div class="pos h" id="@roc" style="left:300px;top:390px">${rocco("smile", 250)}</div>
      ${bubble("@shh", "🤫 My secret…", 260, 290)}
      ${bubble("@rb", "Would you leave us a quick review? 🙏", 200, 280)}
      <div class="asked" style="position:absolute;inset:0">${crowd("@as", 4, 900, 470, 150, 220, 4, "grin", true)}${[0, 1, 2, 3].map((i) => `<div class="pos chk h" style="left:${960 + i * 220}px;top:400px;font-size:56px">✅</div>`).join("")}</div>
      ${stat("@s68", "0", "left a review for a local business <span style='color:#fbbc04'>when they were asked</span>", 560, 220, "%")}
      ${[["🙋", "Ask"], ["⏱️", "At the right moment"], ["👆", "Make it easy"]].map(([i, t], k) => `<div class="rr-pil h" id="@k${k}" style="left:${150 + k * 560}px;top:260px"><span>${i}</span><b>${t}</b></div>`).join("")}
      ${src("@src", "BrightLocal Local Consumer Review Survey 2017")}`;
    },
  },
  // ───────── 16. The card ─────────
  {
    id: "card", chapter: "The 10-second review", music: "pulse",
    lines: [
      "So Pip tries something new.",
      "A little card on the counter. Google review. Tap your phone.",
      "Hazel's back for a second croissant. And this time, Pip says one sentence.",
      { t: "If you liked it, just tap your phone here. It takes ten seconds.", v: PIP, gap: 0.5 },
      "She taps her phone to the card, and Pip's review page opens. Right there. No searching.",
      { t: "Five stars. Best croissant in town. Post.", say: "Five stars. Best croissant in town... Post." },
      { t: "Ten seconds. Done.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@pp", a.start, { y: 60 });
      mood(c, "@pip", "smile", a.start);
      c.pop("@bulb", a.start + a.dur * 0.5); c.sfx("ding", a.start + a.dur * 0.5);
      c.to("@bulb", { autoAlpha: 0, duration: 0.3 }, b.start);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, rotationY: -160, y: -200 }, { autoAlpha: 1, rotationY: 0, y: 0, duration: 1.2, ease: "power3.out" }, ${T(b.start)});`);
      c.sfx("whoosh", b.start);
      c.js(`tl.to("${c.q("@cardw")}", { scale: 0.32, x: 330, y: 330, duration: 0.8, ease: "power2.inOut" }, ${T(b.end - 0.2)});`);
      c.in("@hz", d.start, { x: 200, y: 0 });
      mood(c, "@hazel", "grin", d.start + 0.5);
      mood(c, "@pip", "grin", e.start);
      say(c, "@pip", e, "@pb");
      c.to("@pp, @hz, @cardw", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@tapcard", f.start, { y: 40 });
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 500, y: -120, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -6, duration: 0.9, ease: "power3.out" }, ${T(f.start + 0.2)});`);
      ripple(c, "@ring", f.start + 1.15);
      c.sfx("ding", f.start + 1.15);
      c.js(`tl.fromTo("${c.q("@screen")}", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45 }, ${T(f.start + 1.5)});`);
      c.js(`tl.to("${c.q("@rf-stars .rs")}", { color: "#fbbc04", scale: 1.25, duration: 0.18, stagger: 0.14, yoyo: true, repeat: 1 }, ${T(g.start + 0.1)}); tl.set("${c.q("@rf-stars .rs")}", { color: "#fbbc04" }, ${T(g.start + 1.2)});`);
      for (let k = 0; k < 5; k++) c.sfx("tick", g.start + 0.1 + k * 0.14);
      c.js(`tl.to("${c.q("@rf-type")}", { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "none" }, ${T(g.start + g.dur * 0.35)});`);
      c.js(`tl.to("${c.q("@rf-post")}", { scale: 0.9, backgroundColor: "#0b57d0", duration: 0.12, yoyo: true, repeat: 1 }, ${T(g.end - 0.3)});`);
      c.sfx("tap", g.end - 0.3);
      c.pop("@done", h.start); c.sfx("chime", h.start);
      c.pop("@timer", h.start + 0.3);
      return `<div class="wr-bakery"><div class="shelf" style="top:260px">${["🥐", "🥖", "🍞", "🥯", "🧁", "🥐"].map((e, i) => `<span style="left:${60 + i * 270}px">${e}</span>`).join("")}</div></div><div class="wr-counter"></div>
      <div class="pos h" id="@pp" style="left:250px;top:380px">${pip("smile", 250)}</div>
      <div class="pos h" id="@bulb" style="left:360px;top:200px;font-size:140px">💡</div>
      <div class="stage3d" id="@cardw" style="left:740px;top:120px">${card3d("@card", "sm h")}</div>
      <div class="pos h" id="@hz" style="left:1420px;top:400px">${hazel("smile", 240, "@hazel", { phone: true })}</div>
      ${bubble("@pb", "Just tap your phone here! 10 seconds 👆", 360, 280)}
      <div class="pos h" id="@tapcard" style="left:380px;top:180px">${card3d("@tc", "sm").replace('class="c3d sm"', 'class="c3d sm" style="transform:rotateY(-14deg) rotateX(8deg)"')}<div class="rr-ring" id="@ring" style="left:150px;top:240px;width:180px;height:180px;margin:-90px 0 0 -90px"></div></div>
      <div class="pos h" id="@ph" style="left:820px;top:90px">${bigPhone("@phone", `<div id="@screen" style="position:absolute;inset:0;background:#fff;opacity:0">${reviewForm(c.id("rf")).replace("Your Business", "Pip's Bakery").replace("Amazing work, so fast and friendly!", "Best croissant in town! 🥐")}</div>`)}</div>
      <div class="wr-pill h" id="@done" style="left:1340px;top:300px;background:#22c55e;color:#062014;font-size:52px">✅ Posted!</div>
      <div class="wr-pill h" id="@timer" style="left:1340px;top:430px;background:#fff;color:#0b1220;font-size:46px">⏱️ 10 seconds</div>`;
    },
  },
  // ───────── 17. How it works ─────────
  {
    id: "how", chapter: "How a tap card works", music: "soft",
    lines: [
      "Inside the card is a tiny chip, the same kind of tech behind tap-to-pay.",
      "It works on iPhone XS and newer, and on Android phones with NFC. No app to download.",
      { t: "And the counter stand has a QR code too, for any phone that doesn't tap.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@ex", a.start, { y: 40 });
      c.js(`tl.fromTo("${c.q("@ex")}", { rotationY: -30, rotationX: 50, rotationZ: -20 }, { rotationY: -36, rotationX: 56, rotationZ: -26, duration: ${T(c.E - a.start)}, ease: "sine.inOut" }, ${T(a.start)});`);
      c.js(`tl.fromTo("${c.q("@ly0")}", { z: 2 }, { z: 180, duration: 1.1, ease: "power3.inOut" }, ${T(a.start + a.dur * 0.35)}); tl.fromTo("${c.q("@ly2")}", { z: -2 }, { z: -180, duration: 1.1, ease: "power3.inOut" }, ${T(a.start + a.dur * 0.35)});`);
      c.sfx("whoosh", a.start + a.dur * 0.35);
      c.pop("@chipl", a.start + a.dur * 0.75); c.sfx("pop", a.start + a.dur * 0.75);
      c.js(`tl.to("${c.q("@ly0")}", { z: 2, duration: 0.8, ease: "power2.inOut" }, ${T(b.start)}); tl.to("${c.q("@ly2")}", { z: -2, duration: 0.8, ease: "power2.inOut" }, ${T(b.start)});`);
      c.to("@chipl", { autoAlpha: 0, duration: 0.3 }, b.start);
      ["@w0", "@w1", "@w2"].forEach((s, i) => { c.in(s, b.start + b.dur * (0.1 + i * 0.28), { x: 60, y: 0 }); c.sfx("pop", b.start + b.dur * (0.1 + i * 0.28)); });
      c.to("@ex, @w0, @w1, @w2", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@stand", d.start, { y: 60, d: 0.8 });
      c.pop("@qr", d.start + d.dur * 0.55); c.sfx("ding", d.start + d.dur * 0.55);
      return `<div class="stage3d" style="left:350px;top:200px;width:380px;height:600px"><div class="h" id="@ex" style="position:relative;width:380px;height:600px;transform-style:preserve-3d">
        <div class="ly" id="@ly0" style="position:absolute;inset:0;border-radius:34px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45)">${card3d("@c0", "sm").replace('class="c3d sm"', 'class="c3d sm" style="width:380px;height:600px"')}</div>
        <div class="ly" id="@ly1" style="position:absolute;inset:60px;border-radius:24px;background:rgba(255,255,255,.08);border:3px dashed #60a5fa;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 200 200" width="220" height="220"><rect x="70" y="70" width="60" height="60" rx="8" fill="#fbbc04"/>${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 12}" y="${20 + i * 12}" width="${160 - i * 24}" height="${160 - i * 24}" rx="14" fill="none" stroke="#b87333" stroke-width="5"/>`).join("")}</svg></div>
        <div class="ly" id="@ly2" style="position:absolute;inset:0;border-radius:34px;background:linear-gradient(160deg,#111827,#1f2937);box-shadow:0 30px 80px rgba(0,0,0,.45)"></div>
      </div></div>
      <div class="wr-pill h" id="@chipl" style="left:920px;top:300px;background:#fbbc04;color:#1f1300;font-size:44px">📶 NFC chip + antenna<br/><span style="font-size:30px">same tech as tap-to-pay</span></div>
      <div class="ws-chip h" id="@w0" style="left:980px;top:260px;font-size:40px"><b>✓</b>iPhone XS and newer</div>
      <div class="ws-chip h" id="@w1" style="left:980px;top:400px;font-size:40px"><b>✓</b>Android phones with NFC</div>
      <div class="ws-chip h" id="@w2" style="left:980px;top:540px;font-size:40px"><b>✓</b>No app to download</div>
      <div class="rr-img h" id="@stand" style="left:300px;top:110px;width:620px;height:700px;background:#fff"><img src="assets/img/stand.webp" style="object-fit:contain"/></div>
      <div class="wr-pill h" id="@qr" style="left:1040px;top:400px;background:#fff;color:#0b1220;font-size:48px">📷 Plus a QR code<br/><span style="font-size:32px;color:#475569">for phones that don't tap</span></div>`;
    },
  },
  // ───────── 18. Rules ─────────
  {
    id: "rules", chapter: "The rules (don't skip this)", music: "soft",
    lines: [
      "Now, a few rules. Because there's a right way to do this.",
      "Don't pay for reviews, and don't trade discounts or freebies for them. Google doesn't allow it.",
      "Ask everyone the same way. Not just the customers you think are happy.",
      "Ask, but never pressure. A friendly sentence is plenty.",
      { t: "And never post fake reviews. Under a rule from 2024, the F.T.C. can seek civil penalties of more than fifty thousand dollars per violation.", say: "And never post fake reviews. Under a rule from twenty twenty-four, the F.T.C. can seek civil penalties of more than fifty thousand dollars... per violation.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      c.in("@pp", a.start, { x: 100, y: 0 });
      mood(c, "@pip", "stare", a.start + 0.3);
      c.in("@r0", b.start, { x: -80, y: 0 }); c.sfx("thud", b.start + 0.2);
      c.in("@r1", d.start, { x: -80, y: 0 }); c.sfx("pop", d.start + 0.2);
      c.in("@r2", e.start, { x: -80, y: 0 }); c.sfx("pop", e.start + 0.2);
      c.in("@r3", f.start, { x: -80, y: 0 }); c.sfx("thud", f.start + 0.2);
      c.js(`tl.fromTo("${c.q("@ftc")}", { autoAlpha: 0, scale: 2.4, rotation: -30 }, { autoAlpha: 1, scale: 1, rotation: -10, duration: 0.45, ease: "power4.in" }, ${T(f.start + f.dur * 0.6)});`);
      c.sfx("thud", f.start + f.dur * 0.6 + 0.4);
      mood(c, "@pip", "shock", f.start + f.dur * 0.6 + 0.4);
      c.in("@src", b.start + 0.3, { y: -20 });
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">The rules</div>
      <div class="wr-rule h" id="@r0" style="left:120px;top:180px"><b>✕</b>No paying or freebies for reviews</div>
      <div class="wr-rule ok h" id="@r1" style="left:120px;top:330px"><b>✓</b>Ask every customer the same way</div>
      <div class="wr-rule ok h" id="@r2" style="left:120px;top:480px"><b>✓</b>Ask, never pressure</div>
      <div class="wr-rule h" id="@r3" style="left:120px;top:630px"><b>✕</b>Never post fake reviews</div>
      <div class="rr-stamp h" id="@ftc" style="left:1180px;top:560px;font-size:64px;line-height:1.1;text-align:center">FTC<br/><span style="font-size:40px">$50,000+ per violation</span></div>
      <div class="pos h" id="@pp" style="left:1420px;top:160px">${pip("smile", 240)}</div>
      ${src("@src", "Google Maps content policy · FTC final rule on fake reviews (Aug 2024)")}`;
    },
  },
  // ───────── 19. Reply ─────────
  {
    id: "reply", chapter: "Reply to every review", music: "soft",
    lines: [
      "One more habit. Reply to your reviews. The good ones, and the bad ones.",
      "Eighty-nine percent of shoppers expect business owners to respond.",
      "So when Pip gets a three-star review about a burnt baguette, he doesn't argue.",
      { t: "You're right, that batch was too dark. Thanks for telling me. Come back and ask for Pip, I'll pick you a good one.", v: PIP, gap: 0.5 },
      { t: "Everyone reading can see there's a real person behind the counter who cares.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      c.in("@s89", b.start, { y: 60 });
      count(c, "s89-n", 0, 89, b.start + 0.1, 1.1);
      c.sfx("ding", b.start + 1.2);
      c.in("@src", b.start + 0.3, { y: -20 });
      c.to("@s89", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@rv", d.start, { y: 60 });
      c.in("@pp", d.start + 0.3, { x: 120, y: 0 });
      mood(c, "@pip", "sad", d.start + 0.5);
      mood(c, "@pip", "smile", e.start);
      talk(c, "@pip", e.start, e.dur);
      c.in("@rv-rp", e.start, { y: 20 });
      c.js(`tl.fromTo("${c.q("@rv-rp .tx")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${T(e.dur * 0.9)}, ease: "none" }, ${T(e.start)});`);
      c.js(`tl.fromTo("${c.q(".lk")}", { autoAlpha: 0, y: 0 }, { autoAlpha: 1, y: -60, duration: 0.6, stagger: 0.2 }, ${T(f.start + 0.3)});`);
      mood(c, "@pip", "grin", f.start + 0.3);
      c.sfx("pop", f.start + 0.3);
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Reply to every review</div>
      ${stat("@s89", "0", "expect business owners to <span style='color:#fbbc04'>respond to reviews</span>", 560, 220, "%")}
      ${review("@rv", "Dot", "#db2777", 3, "Croissants were great but my baguette was burnt. 😕", "2 days ago", `<span class="tx" style="display:block">You're right, that batch was too dark. Thanks for telling me. Come back and ask for Pip, I'll pick you a good one. 🥖</span>`, 'style="left:160px;top:200px;width:980px"')}
      <div class="pos h" id="@pp" style="left:1340px;top:330px">${pip("smile", 260)}</div>
      ${[0, 1, 2].map((i) => `<div class="pos lk h" style="left:${1240 + i * 120}px;top:300px;font-size:70px">${["👍", "❤️", "👏"][i]}</div>`).join("")}
      ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`;
    },
  },
  // ───────── 20. 90 days later ─────────
  {
    id: "later", chapter: "Three months later", music: "pulse",
    lines: [
      "Here's what happened over the next three months.",
      "Every customer got the same ten-second ask. The card did the rest.",
      "Four reviews became forty. Forty became a hundred and forty.",
      "And they kept coming, every week, so they always looked fresh.",
      "Now when someone searches bakery near me, Pip's Bakery shows up with a hundred and forty reviews and four point eight stars.",
      { t: "And there's a line on both sides of the street.", gap: 0.9 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      cam(c, [140, 6, -60, 2], [-60, -4, 160, -1]);
      c.in("@cal", a.start, { y: -40 });
      c.js(`const m_lt = { i: 0 }, M_lt = ["March", "April", "May", "June"]; tl.fromTo(m_lt, { i: 0 }, { i: 3, duration: ${T(a.dur + b.dur)}, ease: "none", onUpdate: () => { document.getElementById("${c.id("cal-m")}").textContent = M_lt[Math.round(m_lt.i)]; } }, ${T(a.start)});`);
      c.in("@cnt", d.start, { scale: 0.7, ease: "back.out(1.8)" });
      count(c, "cnt-n", 4, 40, d.start + 0.2, d.dur * 0.4);
      c.js(`const c2_lt = { v: 40 }; tl.to(c2_lt, { v: 140, duration: ${T(d.dur * 0.45)}, ease: "power1.inOut", onUpdate: () => { document.getElementById("${c.id("cnt-n")}").textContent = Math.round(c2_lt.v); } }, ${T(d.start + d.dur * 0.55)});`);
      for (let k = 0; k < 10; k++) c.sfx("tick", d.start + 0.2 + k * (d.dur * 0.09));
      c.sfx("chime", d.end);
      c.js(`tl.fromTo("${c.q(".notif")}", { autoAlpha: 0, x: 300 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: ${T(e.dur / 5)}, ease: "back.out(1.4)" }, ${T(e.start)}); tl.to("${c.q(".notif")}", { autoAlpha: 0, duration: 0.3 }, ${T(f.start)});`);
      c.to("@cnt, @cal", { autoAlpha: 0, duration: 0.3 }, f.start);
      c.in("@res", f.start + 0.2, { y: 40 });
      c.sfx("ding", f.start + f.dur * 0.6);
      c.to("@res", { autoAlpha: 0, duration: 0.4 }, g.start - 0.1);
      c.js(`tl.fromTo("${c.q(".line2 .pos")}", { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.14, ease: "back.out(1.6)" }, ${T(g.start)});`);
      c.in("@pipw", g.start, { y: 60 });
      mood(c, "@pip", "grin", g.start + 0.3);
      c.js(`tl.to("${c.q(".line2 .who, .line .who")}", { y: -10, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut", stagger: 0.04 }, ${T(g.start + 1.2)});`);
      return street(`<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 5, 40, 610, 110, 96, 1)}</div>`,
        `<div class="line2" style="position:absolute;left:0;top:0">${crowd("@q2", 6, 940, 610, 110, 96, 5, "grin", true)}</div>`,
        `<div class="wr-pill h" id="@cal" style="left:760px;top:60px;background:#fff;color:#0b1220;font-size:46px">🗓️ <span id="@cal-m">March</span></div>
        <div class="wr-stat h" id="@cnt" style="left:610px;top:180px"><b id="@cnt-n">4</b><span>Google reviews · Pip's Bakery</span></div>
        <div class="rr-notifs" style="right:60px;top:150px">${[["Maya", "Best croissant outside Paris"], ["Theo", "Cute spot, great coffee"], ["Ruth", "The almond one!!"], ["Gus", "Pip remembered my order"], ["Lena", "Worth the walk"]].map(([n, t]) => `<div class="rr-notif notif h"><div class="ic">G</div><div><b>${n} left a review</b><small><span>★★★★★</span> ${t}</small></div></div>`).join("")}</div>
        ${pack("@res", "bakery near me", PIPROW("140", "you") + CRUMB("431"), `style="left:520px;top:140px"`).replace("4.9", "4.8")}
        <div class="pos h" id="@pipw" style="left:1580px;top:470px">${pip("smile", 220)}</div>
        <div class="ws-note" style="top:auto;bottom:150px">Illustrative example. Results depend on your business and area, and Google decides rankings.</div>`);
    },
  },
  // ───────── 21. Checklist ─────────
  {
    id: "checklist", chapter: "Your 5-step review checklist", music: "soft",
    lines: [
      "Want to do what Pip did? Here's the checklist.",
      "One. Put a card where people pay. The counter, or the register.",
      "Two. Put one by the door, so people see it on the way out.",
      "Three. One on each table, if people sit down.",
      "Four. Keep one in your pocket or your truck, if you go to your customers.",
      { t: "Five. Ask everyone with one sentence. If you liked it, tap here. It takes ten seconds.", gap: 0.7 },
    ],
    draw(c) {
      const [a, ...L] = c.L;
      c.in("@k", a.start);
      c.in("@pp", a.start, { x: 100, y: 0 });
      L.forEach((l, i) => { c.in(`@p${i}`, l.start, { y: 80 }); c.sfx("pop", l.start); c.js(`tl.to("${c.q(".ws-five .r")}", { borderColor: "#334155", boxShadow: "0 0 0px rgba(255,106,31,0)", duration: 0.2 }, ${T(l.start)}); tl.to("${c.q(`@p${i}`)}", { borderColor: "#ff6a1f", boxShadow: "0 0 70px rgba(255,106,31,.35)", duration: 0.3 }, ${T(l.start + 0.1)});`); });
      mood(c, "@pip", "grin", L[4].start);
      talk(c, "@pip", L[4].start + L[4].dur * 0.45, L[4].dur * 0.5);
      const P = [["💳", "Where people pay", "Counter or register"], ["🚪", "By the door", "Seen on the way out"], ["🍽️", "On every table", "If people sit down"], ["🚚", "Pocket or truck", "If you go to them"], ["🗣️", "Ask everyone", "“Tap here, 10 seconds”"]];
      return `<div class="kicker h" id="@k" style="left:110px;top:90px">Your review checklist</div>
      <div class="ws-five">${P.map(([i, b, s], k) => `<div class="r h" id="@p${k}"><div class="n">${k + 1}</div><div class="ic">${i}</div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
      <div class="pos h" id="@pp" style="left:1600px;top:40px">${pip("smile", 180)}</div>`;
    },
  },
  // ───────── 22. Offer ─────────
  {
    id: "offer", chapter: "Get review cards", music: "pulse",
    lines: [
      { t: "You can get the same cards at ceoturbo.com/google-review-cards.", say: "You can get the same cards at C.E.O. Turbo dot com, slash google review cards." },
      { t: "One card is $16.99. Two are $29.99. Five are $59.99. And ten are $99.99.", say: "One card is sixteen ninety-nine. Two are twenty-nine ninety-nine. Five are fifty-nine ninety-nine. And ten are ninety-nine ninety-nine." },
      { t: "The counter stand, with tap and a QR code, is $29.99. Or get the stand with two cards for $54.99.", say: "The counter stand, with tap and a QR code, is twenty-nine ninety-nine. Or get the stand with two cards, for fifty-four ninety-nine." },
      { t: "Shipping in the US is free, and you pay once. No subscription.", say: "Shipping in the U.S. is free, and you pay once. No subscription." },
      { t: "For $5, we'll program your review link and test it before it ships. And if it's not right for you, send it back new within 30 days for a refund.", say: "For five dollars, we'll program your review link and test it before it ships. And if it's not right for you, send it back new within thirty days, for a refund.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@url", a.start + a.dur * 0.3, { y: 40 });
      c.sfx("ding", a.start + a.dur * 0.3);
      const at = [0.02, 0.24, 0.48, 0.74];
      ["@k0", "@k1", "@k2", "@k3"].forEach((s, i) => { c.in(s, b.start + b.dur * at[i], { y: 60 }); c.sfx("pop", b.start + b.dur * at[i]); });
      c.in("@k4", d.start + 0.2, { y: 60 }); c.sfx("pop", d.start + 0.2);
      c.in("@k5", d.start + d.dur * 0.6, { y: 60 }); c.sfx("pop", d.start + d.dur * 0.6);
      c.pop("@x0", e.start + 0.1); c.sfx("tick", e.start + 0.1);
      c.pop("@x1", e.start + e.dur * 0.6); c.sfx("tick", e.start + e.dur * 0.6);
      c.pop("@x2", f.start + 0.2); c.sfx("tick", f.start + 0.2);
      c.pop("@x3", f.start + f.dur * 0.6); c.sfx("tick", f.start + f.dur * 0.6);
      const K = [["1 card", "$16.99", "Pocket or counter"], ["2 cards", "$29.99", "Counter + door"], ["5 cards", "$59.99", "Tables or crew"], ["10 cards", "$99.99", "Busy shops"], ["Counter stand", "$29.99", "Tap + QR code"], ["Stand + 2 cards", "$54.99", "Best starter kit"]];
      return `<div class="packs" style="top:90px;grid-template-columns:repeat(3, 1fr);gap:24px 30px">${K.map(([s, b, n], i) => `<div class="pk${i === 5 ? " hot" : ""} h" id="@k${i}" style="padding:44px 20px 34px">${i === 5 ? `<div class="popb">Best start</div>` : ""}<small>${s}</small><b>${b}</b><span>${n}</span></div>`).join("")}</div>
      <div class="perks" style="top:700px;font-size:34px"><span class="h" id="@x0">🚚 Free US shipping</span><span class="h" id="@x1">💳 Pay once</span><span class="h" id="@x2">🛠️ We program it: $5</span><span class="h" id="@x3">↩️ 30-day returns</span></div>
      <div class="url h" id="@url" style="top:790px;font-size:56px">ceoturbo.com/google-review-cards</div>`;
    },
  },
  // ───────── 23. End ─────────
  {
    id: "end", chapter: "The whole town knows", music: "soft", pad: 3.5,
    lines: [
      "Pip's croissants were always the best in town. Now the whole town knows it.",
      { t: "Get your cards at the link in the description.", gap: 0.4 },
      { t: "And if you know a small business owner who deserves more customers, send them this video.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      cam(c, [-80, -4, 0], [80, 4, 120]);
      c.in("@l1", a.start, { y: 40 });
      c.in("@duo", a.start + 0.4, { y: 80 });
      mood(c, "@pip", "grin", a.start + a.dur * 0.6);
      mood(c, "@rocco", "wink", a.start + a.dur * 0.7);
      c.js(`tl.to("${c.q("@duo .who")}", { y: -16, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut", stagger: 0.1 }, ${T(a.start + a.dur * 0.6)});`);
      c.pop("@url", b.start + 0.2); c.sfx("ding", b.start + 0.2);
      c.pop("@sub", d.start + 0.3); c.sfx("pop", d.start + 0.3);
      c.js(`tl.to("${c.q("@sub")}", { scale: 1.08, duration: 0.3, yoyo: true, repeat: 3 }, ${T(d.start + 1)});`);
      return street(`<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 4, 60, 620, 100, 100, 2, "grin")}</div><div class="line" style="position:absolute;left:0;top:0">${crowd("@q2", 4, 1040, 620, 100, 100, 7, "grin")}</div>`, "",
        `<div class="wr-ttl h" id="@l1" style="top:70px;font-size:84px">Now the whole town knows. 🥐</div>
        <div class="h" id="@duo" style="position:absolute;left:640px;top:420px;display:flex;gap:40px">${pip("smile", 240)}${rocco("smile", 230)}</div>
        <div class="ws-cta h" id="@url" style="left:300px;top:790px;font-size:46px;padding:22px 44px">⭐ ceoturbo.com/google-review-cards</div>
        <div class="wr-sub h" id="@sub" style="left:1440px;top:800px">▶ Subscribe</div>`);
    },
  },
];
