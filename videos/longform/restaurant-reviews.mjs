// "Her Food Was Better. So Why Was Their Restaurant Packed?" — Google review cards for restaurants, told as a story.
// Long-form 16:9 animated story (~8.5 min). Nina, Casa Nina and The Copper Fork are made up and the video says so
// up front; every step Nina takes is real. Real facts only where they are real: card packs, stand, free US shipping,
// $5 programming and 30-day returns (src/config/site.ts), iPhone XS+/NFC Android (src/content/review-cards.ts),
// Google's no-incentive rule (src/content/restaurants.ts FAQ), the Exclusive Restaurant & Lounge install
// (src/content/restaurants.ts INSTALL). Nina's review counts, covers and rankings are labeled illustrative.
import { person } from "../five-stars/cast.mjs";
import { CSS as WS_CSS, T, who, mood, talk, phone } from "./website-story.mjs";
import { card3d, reviewForm, phone as bigPhone } from "./stop-asking.mjs";

export const TITLE = "Her Food Was Better. So Why Was Their Restaurant Packed?";
export const SLUG = "restaurant-reviews";
export const LINKS = { cards: "ceoturbo.com/google-review-cards", restaurants: "ceoturbo.com/restaurants", call: "ceoturbo.com/brand-boost", setup: "ceoturbo.com/google-review-card-setup" };
export const IMAGES = [
  ["img/review-cards/hd/stand-front-1600.webp", "stand.webp"],
  ["img/review-cards/hd/card-stack-5-1600.webp", "stack.webp"],
  ["media/restaurant-install-poster.webp", "install.webp"],
];

export const DESCRIPTION = (chapters) => `Nina's food is the best on the street. So why is the restaurant across the road packed every Friday while half her tables sit empty? It isn't the food. It's what hungry people see on Google before they ever walk in. This is how one tap-to-review card on every table turned Casa Nina into the place people trust, and how to set it up in your restaurant this week.

🍽️ Get Google review cards for every table (from $16.99, free US shipping): https://${LINKS.cards}
🏪 Restaurant owners: Google + Apple Maps, DoorDash / Uber Eats / Grubhub, TV menus and review cards: https://${LINKS.restaurants}
📅 Book a free 30-minute call (you keep the plan whether or not you hire us): https://${LINKS.call}
🛠️ Already have a card? Set it up in 2 minutes: https://${LINKS.setup}

Chapters
${chapters.join("\n")}

What's in this video
• Why diners pick the restaurant with more reviews, even when your rating is higher
• Why "leave us a review!" almost never turns into a review
• The 10-second ask your servers can use at every table
• Google's review rules (no freebies for reviews, ask everyone the same way)
• 5 places to put review cards in a restaurant, and 5 mistakes to avoid

Prices: 1 card $16.99 · 2 cards $29.99 · 5 cards $59.99 · 10 cards $99.99 · counter stand (tap + QR) $29.99 · stand + 2 cards $54.99. Free US shipping. Pay once, no subscription. We'll program and test your review link for $5 per order. Return it new within 30 days for a refund.

Nina, Casa Nina and The Copper Fork are made up. Their review counts, covers and map positions are illustrative. Results depend on your restaurant and your area, and Google decides search rankings, so no one can guarantee them. Works on iPhone XS and newer and on Android phones with NFC. CEO Turbo review cards are an independent product and are not made or endorsed by Google.

#restaurant #restaurantowner #googlereviews #restaurantmarketing #smallbusiness #localseo #nfc`;

const REPLY = "You're right, Friday got busy and we were slow. Thank you for telling us. Next time, ask for me, and I'll make sure you're taken care of. — Nina";
const nina = (m = "smile", w = 250, id = "@nina") => who("nina", m, w, id);
const luis = (m = "smile", w = 230, id = "@luis") => who("luis", m, w, id);
const GUESTS = ["extra1", "extra2", "extra6", "extra7", "extra5", "frank", "gary", "okafor", "juno", "extra4"];
const STARS = (n = 5) => "★".repeat(n) + `<span style="color:#cbd5e1">${"★".repeat(5 - n)}</span>`;

/** A number that counts from `from` to `to` on the timeline. */
const count = (c, el, from, to, t, d) => {
  const v = `cv_${c.id(el).replace(/-/g, "_")}`;
  c.js(`const ${v} = { v: ${from} }; tl.fromTo(${v}, { v: ${from} }, { v: ${to}, duration: ${T(d)}, ease: "power1.inOut", onUpdate: () => { document.getElementById("${c.id(el)}").textContent = Math.round(${v}.v).toLocaleString("en-US"); } }, ${T(t)});`);
};
/** Tap rings that pulse out of an element. */
const ripple = (c, sel, t) => c.js(`tl.fromTo("${c.q(sel)}", { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, ${T(t)});`);

/** The little card that stands on every table. */
const tent = (id, extra = "") => `<div class="rr-tent h" id="${id}" ${extra}><b>G</b><span>★★★★★</span><small>Tap your phone<br />to review us</small></div>`;
/** A dining table with guests sitting behind it and an optional review card. */
const table = (id, x, y, guests = [], { card = true, moodOf = "smile", w = 92 } = {}) => `<div class="rr-table" id="${id}" style="left:${x}px;top:${y}px">
  ${guests.map((g, k) => `<div class="rr-guest" id="${id}g${k}" style="left:${(k - (guests.length - 1) / 2) * 96 + 160 - w / 2}px">${who(g, moodOf, w, `${id}w${k}`)}</div>`).join("")}
  <div class="top"></div><div class="cloth"></div><span class="plate" style="left:60px">🍝</span><span class="plate" style="left:150px">🥗</span>
  ${card ? tent(`${id}c`, `style="left:232px;top:82px"`) : ""}<div class="rr-ring" id="${id}r" style="left:262px;top:118px"></div>
</div>`;
/** The dining room behind every inside scene. */
const room = () => `<div class="rr-room"><div class="lights">${Array.from({ length: 16 }, (_, i) => `<i style="left:${i * 124 + 30}px;top:${40 + Math.sin(i * 0.8) * 16}px"></i>`).join("")}</div>
  <div class="frame" style="left:260px;top:120px">🌶️</div><div class="frame" style="left:1500px;top:110px">🍋</div><div class="wains"></div></div>`;
/** One storefront on the street. */
const store = (id, name, x, cls, inside, extra = "") => `<div class="rr-bld ${cls}" id="${id}" style="left:${x}px" ${extra}>
  <div class="sign">${name}</div><div class="awn"></div><div class="win">${inside}</div><div class="door"></div></div>`;
const heads = (list, gap = 92, w = 80, hide = []) => list.map((g, k) => `<div class="rr-head${hide.includes(k) ? " h" : ""}" style="left:${20 + k * gap}px">${who(g, "grin", w, `@hd-${g}-${k}`)}</div>`).join("");
/** A Google-style local result. */
const row = (icon, name, rating, n, meta, cls = "", id = "", nid = "") => `<div class="ws-res ${cls}"${id ? ` id="${id}"` : ""}><div class="pin">${icon}</div><div><b>${name}</b><small><span style="color:#e8a200">${rating} ★</span> (<span${nid ? ` id="${nid}"` : ""}>${n}</span>) · ${meta}</small></div>${cls.includes("you") ? `<div class="call">Directions</div>` : ""}</div>`;
const pack = (id, q, rows, extra = "") => `<div class="ws-search h" id="${id}" ${extra}><div class="sbar">🔍 <span id="${id}-q">${q}</span></div><div class="tabs"><b>All</b><span>Maps</span><span>Menus</span><span>Open now</span></div><div class="rows">${rows}</div></div>`;
const FORK = (n = "612") => row("🍴", "The Copper Fork", "4.7", n, "American · $$ · 0.3 mi");
const BISTRO = row("🍕", "Lucky Slice Pizza", "4.5", "288", "Pizza · $ · 0.6 mi");
const NINA = (n = "23", cls = "you", id = "", nid = "") => row("🌮", "Casa Nina", "4.9", n, "Mexican · $$ · 0.3 mi", cls, id, nid);

export const CSS = WS_CSS + `
.rr-street { position: absolute; inset: 0; background: linear-gradient(180deg, #050a1a 0%, #0d1733 62%, #1f2937 62%, #1f2937 78%, #374151 78%); }
.rr-street .stars i { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #fff; opacity: .6; }
.rr-bld { position: absolute; top: 170px; width: 760px; height: 500px; border-radius: 14px 14px 0 0; background: linear-gradient(180deg, #3b2a20, #2a1d16); box-shadow: 0 30px 60px rgba(0,0,0,.5); }
.rr-bld.nina { background: linear-gradient(180deg, #3a1d2a, #24121b); }
.rr-bld .sign { position: absolute; left: 50%; top: 22px; transform: translateX(-50%); padding: 12px 34px; border-radius: 14px; background: #111827; border: 3px solid #fbbf24; font-family: "Space Grotesk"; font-weight: 700; font-size: 44px; color: #fde68a; white-space: nowrap; text-shadow: 0 0 18px rgba(251,191,36,.8); }
.rr-bld.nina .sign { border-color: #f472b6; color: #fbcfe8; text-shadow: 0 0 18px rgba(244,114,182,.8); }
.rr-bld .awn { position: absolute; left: 30px; right: 30px; top: 104px; height: 46px; background: repeating-linear-gradient(90deg, #b91c1c 0 50px, #fef3c7 50px 100px); border-radius: 0 0 20px 20px; }
.rr-bld.nina .awn { background: repeating-linear-gradient(90deg, #15803d 0 50px, #fef3c7 50px 100px); }
.rr-bld .win { position: absolute; left: 40px; top: 170px; width: 480px; height: 300px; border-radius: 10px; overflow: hidden; background: radial-gradient(circle at 50% 30%, #fde68a, #f59e0b 70%); border: 10px solid #1c1917; }
.rr-bld.dim .win { background: radial-gradient(circle at 50% 30%, #fcd34d66, #78350f 75%); }
.rr-bld .door { position: absolute; right: 50px; top: 190px; width: 150px; height: 310px; border-radius: 75px 75px 0 0; background: linear-gradient(180deg, #fde68a, #b45309); border: 10px solid #1c1917; }
.rr-head { position: absolute; top: 70px; }
.rr-line { position: absolute; top: 560px; display: flex; gap: 10px; }
.rr-clock { position: absolute; left: 50%; top: 70px; transform: translateX(-50%); padding: 14px 32px; border-radius: 999px; background: rgba(15,23,42,.9); border: 3px solid #fbbf24; font-weight: 800; font-size: 40px; white-space: nowrap; }
.rr-room { position: absolute; inset: 0; background: linear-gradient(180deg, #3b1d14 0%, #4a2618 64%, #2a140c 64%); }
.rr-room .wains { position: absolute; left: 0; right: 0; top: 560px; height: 130px; background: repeating-linear-gradient(90deg, #5c2e1c 0 60px, #4e2717 60px 64px); }
.rr-room .lights i { position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #fde68a; box-shadow: 0 0 30px 10px rgba(253,230,138,.45); }
.rr-room .frame { position: absolute; width: 170px; height: 200px; border: 12px solid #a16207; background: #fef3c7; display: flex; align-items: center; justify-content: center; font-size: 90px; border-radius: 6px; }
.rr-table { position: absolute; width: 320px; height: 300px; }
.rr-guest { position: absolute; top: -10px; }
.rr-table .top { position: absolute; left: 0; right: 0; top: 150px; height: 26px; border-radius: 13px; background: #f8fafc; z-index: 2; }
.rr-table .cloth { position: absolute; left: 10px; right: 10px; top: 166px; height: 120px; border-radius: 0 0 30px 30px; background: linear-gradient(180deg, #e2e8f0, #94a3b8); z-index: 2; }
.rr-table .plate { position: absolute; top: 106px; font-size: 52px; z-index: 3; }
.rr-tent { position: absolute; width: 64px; height: 76px; border-radius: 10px; background: #fff; color: #0b1220; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 4; box-shadow: 0 0 24px rgba(251,188,4,.7); border: 2px solid #fbbc04; }
.rr-tent b { font-family: "Space Grotesk"; font-size: 24px; color: #4285f4; line-height: 1; } .rr-tent span { font-size: 9px; color: #fbbc04; letter-spacing: 1px; } .rr-tent small { font-size: 7px; font-weight: 800; text-align: center; line-height: 1.1; }
.rr-tent.big { width: 300px; height: 360px; border-radius: 34px; gap: 10px; box-shadow: 0 0 90px rgba(251,188,4,.5), 0 40px 90px rgba(0,0,0,.5); border-width: 4px; }
.rr-tent.big b { font-size: 120px; } .rr-tent.big span { font-size: 40px; letter-spacing: 4px; } .rr-tent.big small { font-size: 30px; }
.rr-ring { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border-radius: 50%; border: 6px solid #60a5fa; opacity: 0; visibility: hidden; z-index: 6; }
.rr-quote { position: absolute; padding: 50px 60px; border-radius: 40px; background: #fff; color: #0b1220; font-family: "Space Grotesk"; font-weight: 700; font-size: 64px; line-height: 1.15; letter-spacing: -.02em; box-shadow: 0 40px 100px rgba(0,0,0,.5); }
.rr-quote small { display: block; margin-top: 18px; font-family: "Inter"; font-size: 28px; font-weight: 700; color: #64748b; letter-spacing: 0; }
.rr-receipt { position: absolute; width: 440px; padding: 40px 36px 50px; background: #fafaf9; color: #1c1917; font-family: ui-monospace, Menlo, monospace; font-size: 26px; line-height: 1.6; box-shadow: 0 30px 80px rgba(0,0,0,.5); clip-path: polygon(0 0, 100% 0, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0 96%); }
.rr-receipt .r { display: flex; justify-content: space-between; } .rr-receipt hr { border: 0; border-top: 3px dashed #a8a29e; margin: 14px 0; } .rr-receipt .lnk { font-size: 19px; word-break: break-all; color: #57534e; }
.rr-qr { position: absolute; width: 360px; padding: 30px; border-radius: 26px; background: #fff; color: #0b1220; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,.5); font-weight: 800; font-size: 28px; }
.rr-qr .code { width: 240px; height: 240px; margin: 16px auto 0; background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0) 0 0/40px 40px; border: 14px solid #000; outline: 10px solid #fff; }
.rr-dark { position: absolute; inset: 0; background: rgba(3,6,15,.6); }
.rr-pil { position: absolute; top: 260px; width: 500px; padding: 46px 40px; border-radius: 40px; background: rgba(15,23,42,.92); border: 3px solid #334155; text-align: center; }
.rr-pil span { font-size: 120px; } .rr-pil b { display: block; margin-top: 18px; font-family: "Space Grotesk"; font-size: 54px; } .rr-pil p { margin-top: 14px; font-size: 30px; font-weight: 600; color: #cbd5e1; line-height: 1.35; }
.rr-steps { position: absolute; display: flex; flex-direction: column; gap: 16px; }
.rr-step { display: flex; align-items: center; gap: 22px; width: 640px; padding: 20px 28px; border-radius: 22px; background: rgba(15,23,42,.92); border: 3px solid #334155; font-size: 38px; font-weight: 800; }
.rr-step b { width: 56px; height: 56px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; font-size: 30px; flex: none; }
.rr-stamp { position: absolute; padding: 16px 40px; border: 8px solid #ef4444; border-radius: 18px; color: #ef4444; font-family: "Space Grotesk"; font-weight: 700; font-size: 110px; letter-spacing: .04em; transform: rotate(-10deg); background: rgba(7,11,20,.7); }
.rr-rev { position: absolute; width: 720px; padding: 30px 34px; border-radius: 28px; background: #fff; color: #202124; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.rr-rev .hd { display: flex; align-items: center; gap: 16px; } .rr-rev .av { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 30px; }
.rr-rev .nm { font-size: 28px; font-weight: 800; } .rr-rev .st { margin-top: 4px; font-size: 26px; color: #fbbc04; letter-spacing: 3px; } .rr-rev .st em { font-style: normal; color: #5f6368; letter-spacing: 0; font-size: 20px; margin-left: 10px; }
.rr-rev p { margin-top: 14px; font-size: 28px; line-height: 1.4; }
.rr-rev .rp { margin-top: 18px; padding: 18px 22px; border-radius: 16px; background: #f1f3f4; border-left: 6px solid #1a73e8; font-size: 25px; line-height: 1.4; } .rr-rev .rp b { display: block; font-size: 22px; color: #1a73e8; margin-bottom: 6px; }
.rr-notifs { position: absolute; right: 90px; top: 120px; display: flex; flex-direction: column; gap: 16px; }
.rr-notif { width: 560px; padding: 20px 24px; border-radius: 24px; background: rgba(248,250,252,.97); color: #0b1220; display: flex; gap: 18px; align-items: center; box-shadow: 0 20px 50px rgba(0,0,0,.5); }
.rr-notif .ic { width: 64px; height: 64px; border-radius: 18px; background: #fff; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 36px; color: #4285f4; flex: none; }
.rr-notif b { display: block; font-size: 24px; } .rr-notif small { display: block; margin-top: 2px; font-size: 22px; color: #475569; font-weight: 600; } .rr-notif small span { color: #fbbc04; }
.rr-img { position: absolute; border-radius: 34px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,.55); } .rr-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rr-chk { position: absolute; width: 300px; height: 420px; border-radius: 22px; background: linear-gradient(160deg, #1c1917, #292524); border: 4px solid #57534e; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.rr-chk .slip { position: absolute; left: 30px; top: 40px; width: 180px; height: 300px; background: #fafaf9; border-radius: 6px; color: #1c1917; font-family: ui-monospace, Menlo, monospace; font-size: 18px; padding: 16px; line-height: 1.7; }
.rr-wait { position: absolute; width: 520px; padding: 34px 40px; border-radius: 10px; background: #fef9c3; color: #1f2937; transform: rotate(2deg); box-shadow: 0 30px 70px rgba(0,0,0,.5); font-family: "Space Grotesk"; font-weight: 700; font-size: 36px; line-height: 1.6; }
.rr-wait .hd { font-size: 40px; border-bottom: 4px solid #1f2937; margin-bottom: 8px; } .rr-wait div span { float: right; color: #64748b; }
.rr-svc { position: absolute; display: flex; align-items: center; gap: 20px; width: 860px; padding: 24px 30px; border-radius: 26px; background: rgba(15,23,42,.92); border: 3px solid #1aa3ff; font-size: 38px; font-weight: 800; }
.rr-svc span { font-size: 54px; }
.s-offer .pk b { font-size: 86px; }
`;

export const SCENES = [
  // ───────── 1. Cold open ─────────
  {
    id: "open", chapter: "Same street, same Friday night", music: "soft",
    lines: [
      "Friday night. Seven thirty.",
      "Across the street, The Copper Fork has a line out the door.",
      "And here at Casa Nina, half the tables are empty.",
      "Nina's food is better. Ask anyone who's eaten there.",
      "So why is their place packed, and hers isn't?",
      "It wasn't the food. It wasn't the prices. It was something people saw before they ever walked in.",
      { t: "Nina and both restaurants are made up. But everything she does in this story is real, and you can do it this week.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@clock", a.start, { y: -30 });
      c.sfx("chime", a.start + 0.2);
      c.in("@fork", a.start + 0.3, { x: -80, y: 0, d: 0.9 });
      c.in("@casa", a.start + 0.5, { x: 80, y: 0, d: 0.9 });
      c.js(`tl.fromTo("${c.q("@line .who")}", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.18, ease: "power2.out" }, ${T(b.start + 0.3)});`);
      c.js(`tl.to("${c.q("@fork")}", { scale: 1.04, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut", transformOrigin: "50% 100%" }, ${T(b.start + b.dur * 0.5)});`);
      c.pop("@empty", d.start + d.dur * 0.5);
      c.sfx("thud", d.start + d.dur * 0.5);
      c.to("@fork, @casa, @line, @empty, @clock", { autoAlpha: 0, duration: 0.45 }, e.start - 0.15);
      c.in("@nina", e.start, { x: -80, y: 0 });
      mood(c, "@nina", "smile", e.start);
      c.pop("@love", e.start + e.dur * 0.55);
      c.sfx("pop", e.start + e.dur * 0.55);
      mood(c, "@nina", "sad", f.start + 0.3);
      c.in("@why", f.start + 0.2, { y: 40 });
      c.to("@love", { autoAlpha: 0, duration: 0.3 }, f.start);
      c.to("@why", { autoAlpha: 0, duration: 0.3 }, g.start + g.dur * 0.5);
      c.in("@ph", g.start + g.dur * 0.55, { y: 300, d: 0.6 });
      c.sfx("whoosh", g.start + g.dur * 0.55);
      mood(c, "@nina", "neutral", g.start + g.dur * 0.6);
      c.in("@disc", h.start, { y: 20 });
      return `<div class="rr-street"><div class="stars">${Array.from({ length: 40 }, (_, i) => `<i style="left:${(i * 197) % 1900}px;top:${(i * 53) % 150 + 10}px"></i>`).join("")}</div></div>
      <div class="rr-clock h" id="@clock">🕢 Friday · 7:30 PM</div>
      ${store("@fork", "The Copper Fork", 80, "h", heads(["extra1", "extra2", "extra6", "extra7", "extra5"]))}
      ${store("@casa", "Casa Nina", 1080, "nina dim h", heads(["frank", "okafor"], 260))}
      <div class="rr-line" id="@line" style="left:120px">${["gary", "juno", "extra4", "extra3", "banker", "extra1"].map((g, k) => who(g, "smile", 90, `@ln${k}`)).join("")}</div>
      <div class="pos h" id="@empty" style="left:1380px;top:700px;padding:16px 30px;border-radius:999px;background:#ef4444;font-weight:800;font-size:36px">Half empty 😬</div>
      <div class="pos h" id="@nina" style="left:180px;top:240px">${nina("smile", 270, "@n")}</div>
      <div class="pos h" id="@love" style="left:560px;top:250px;padding:22px 34px;border-radius:32px;background:#fff;color:#0b1220;font-family:'Space Grotesk';font-weight:700;font-size:44px;box-shadow:0 24px 60px rgba(0,0,0,.4)">“Best tacos in town!” 😍</div>
      <div class="ws-h h" id="@why" style="left:640px;top:380px;width:1150px;font-size:96px">So why is <span class="o">their</span> place packed?</div>
      ${phone("@ph", `<div class="bank" style="padding:26px 18px"><div style="font-size:20px;font-weight:800;color:#64748b">restaurants near me</div>
        <div style="margin-top:20px;padding:18px;border-radius:18px;background:#f4f6f8"><b style="font-size:26px">The Copper Fork</b><div style="font-size:22px;color:#e8a200;font-weight:800">4.7 ★ <span style="color:#5f6368">(612)</span></div></div>
        <div style="margin-top:14px;padding:18px;border-radius:18px;background:#f4f6f8"><b style="font-size:26px">Casa Nina</b><div style="font-size:22px;color:#e8a200;font-weight:800">4.9 ★ <span style="color:#dc2626">(23)</span></div></div>
        <div style="margin-top:26px;text-align:center;font-size:56px">🤔</div></div>`, `style="left:820px;top:60px"`)}
      <div class="ws-disc h" id="@disc" style="top:810px">Nina and both restaurants are fictional. Every step she takes is real.</div>`;
    },
  },
  // ───────── 2. Title ─────────
  {
    id: "title", chapter: "One card on every table", music: "soft", lead: 0.2,
    lines: [
      "How one little card on every table kept a restaurant packed.",
      { t: "And exactly how to use it, so it works for yours too.", gap: 1.0 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@l1", a.start, { y: 60 });
      c.sfx("whoosh", a.start);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, rotationY: -120, y: 80 }, { autoAlpha: 1, rotationY: 0, y: 0, duration: 1.2, ease: "power3.out" }, ${T(a.start + a.dur * 0.6)}); tl.to("${c.q("@card")}", { rotationY: 180, duration: 1.4, ease: "power2.inOut" }, ${T(b.start + 0.3)}); tl.to("${c.q("@card")}", { rotationY: 340, duration: 1.4, ease: "power2.inOut" }, ${T(b.end - 0.6)});`);
      c.sfx("ding", a.start + a.dur * 0.6 + 0.8);
      c.in("@l2", b.start, { y: 40 });
      return `<div class="ws-big h" id="@l1" style="left:110px;right:auto;width:1100px;text-align:left;top:250px;font-size:120px">One card.<br /><span class="o">Every table.</span><br /><span class="g">Packed.</span></div>
      <div class="ws-sub h" id="@l2" style="left:110px;top:720px;width:1000px;font-size:42px">How to use it so it works for your restaurant too.</div>
      <div class="glow"></div>
      <div class="stage3d" style="left:1260px;top:180px">${card3d("@card", "h")}</div>`;
    },
  },
  // ───────── 3. Nina ─────────
  {
    id: "nina", chapter: "Great food, empty seats", music: "soft",
    lines: [
      "Nina opened Casa Nina six years ago, cooking her grandmother's recipes.",
      "Her regulars love her. They come every week, they know the staff by name, and they tell her it's the best food in town.",
      "But regulars alone don't fill a dining room.",
      "Tuesdays were slow. Fridays were fine, but never full.",
      { t: "And every empty seat still costs her. Rent, staff, and food that goes in the trash at the end of the night.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@nina", a.start, { x: -80, y: 0 });
      c.in("@rec", a.start + a.dur * 0.5, { y: 40, scale: 0.9 });
      mood(c, "@nina", "grin", a.start + 0.5);
      c.to("@rec", { autoAlpha: 0, duration: 0.4 }, b.start);
      c.in("@t1", b.start, { y: 30 }); c.in("@t2", b.start + 0.4, { y: 30 });
      ["@h0", "@h1", "@h2"].forEach((s, i) => { c.pop(s, b.start + b.dur * (0.3 + i * 0.2)); c.sfx("pop", b.start + b.dur * (0.3 + i * 0.2)); });
      c.to("@h0, @h1, @h2", { autoAlpha: 0, duration: 0.3 }, d.start);
      c.in("@t3", d.start + 0.2, { y: 30 }); c.in("@t4", d.start + 0.4, { y: 30 });
      mood(c, "@nina", "neutral", d.start + 0.4);
      c.to("@t1, @t2, @t3, @t4", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@bars", e.start, { x: 200, y: 0 });
      const H = [22, 30, 34, 48, 72, 66, 38];
      H.forEach((h, i) => c.js(`tl.fromTo("${c.q(`@b${i}`)}", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "back.out(1.6)" }, ${T(e.start + 0.4 + i * 0.16)});`));
      c.in("@full", e.start + e.dur * 0.7, { x: 40, y: 0 });
      mood(c, "@nina", "sad", f.start + 0.2);
      ["@c0", "@c1", "@c2"].forEach((s, i) => { c.in(s, f.start + f.dur * (0.3 + i * 0.2), { x: 40, y: 0 }); c.sfx("thud", f.start + f.dur * (0.3 + i * 0.2)); });
      return `${room()}
      <div class="pos h" id="@nina" style="left:150px;top:300px">${nina("smile", 250, "@n")}</div>
      <div class="pos h" id="@rec" style="left:500px;top:240px;width:440px;padding:34px;border-radius:12px;background:#fef3c7;color:#451a03;transform:rotate(-3deg);box-shadow:0 30px 70px rgba(0,0,0,.5);font-family:'Space Grotesk';font-weight:700;font-size:34px;line-height:1.5">Abuela's mole 🌶️<br /><span style="font-size:24px;font-family:Inter;font-weight:600">3 chiles · 1 square chocolate · patience…</span></div>
      ${table("@t1", 620, 420, ["frank", "okafor"], { card: false, moodOf: "grin" })}
      ${table("@t2", 1000, 420, ["extra5"], { card: false, moodOf: "grin" })}
      ${table("@t3", 1380, 420, [], { card: false })}
      ${table("@t4", 1000, 620, [], { card: false })}
      ${["@h0", "@h1", "@h2"].map((s, i) => `<div class="pos h" id="${s}" style="left:${[700, 820, 1080][i]}px;top:${[330, 300, 320][i]}px;font-size:64px">❤️</div>`).join("")}
      <div class="ws-bars h" id="@bars" style="left:560px;top:200px;width:820px;height:480px"><div class="ttl">Guests per night</div>${H.map((h, i) => `<div class="b" id="@b${i}" style="height:${h}%"><span>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span></div>`).join("")}<div style="position:absolute;left:30px;right:30px;top:60px;border-top:4px dashed #fbbf24"></div></div>
      <div class="pos h" id="@full" style="left:1050px;top:150px;padding:10px 20px;border-radius:12px;background:#fbbf24;color:#1f1300;font-weight:800;font-size:26px">Full house</div>
      <div class="ws-xs" style="left:1440px;top:250px">
        <div class="ws-x h" id="@c0"><b>$</b>Rent</div><div class="ws-x h" id="@c1"><b>$</b>Staff</div><div class="ws-x h" id="@c2"><b>🗑</b>Wasted food</div>
      </div>
      <div class="ws-note">Illustrative example.</div>`;
    },
  },
  // ───────── 4. The decision ─────────
  {
    id: "decide", chapter: "Where hungry people decide", music: "pulse",
    lines: [
      "Here's what Nina couldn't see.",
      "Think about how you pick a restaurant in a part of town you don't know.",
      { t: "You pull out your phone, and you search: restaurants near me.", say: "You pull out your phone, and you search... restaurants near me." },
      "Google shows you a few places on a map. And your eyes go to two things. The stars, and the number of reviews.",
      { t: "The Copper Fork. Four point seven stars, six hundred and twelve reviews.", say: "The Copper Fork. Four point seven stars... six hundred and twelve reviews." },
      { t: "Casa Nina. Four point nine stars. Twenty-three reviews.", say: "Casa Nina. Four point nine stars... twenty-three reviews." },
      { t: "Nina has the better rating. But twenty-three reviews looks like a place nobody goes. So people pick the busy one.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@k", a.start);
      c.in("@guy", b.start, { x: -100, y: 0 });
      mood(c, "@guy", "neutral", b.start);
      c.in("@srch", d.start + 0.2, { y: 300, d: 0.6 });
      c.js(`const q${c.id("x").replace(/-/g, "_")} = { n: 0 }, Q${c.id("x").replace(/-/g, "_")} = "restaurants near me"; tl.fromTo(q${c.id("x").replace(/-/g, "_")}, { n: 0 }, { n: Q${c.id("x").replace(/-/g, "_")}.length, duration: 1.3, ease: "none", onUpdate: () => { document.getElementById("${c.id("srch-q")}").textContent = Q${c.id("x").replace(/-/g, "_")}.slice(0, Math.round(q${c.id("x").replace(/-/g, "_")}.n)); } }, ${T(d.start + d.dur * 0.55)});`);
      for (let k = 0; k < 8; k++) c.sfx("tap", d.start + d.dur * 0.55 + k * 0.16);
      c.js(`tl.fromTo("${c.q(".ws-res")}", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.2, ease: "power3.out" }, ${T(e.start)});`);
      c.pop("@eye1", e.start + e.dur * 0.55); c.pop("@eye2", e.start + e.dur * 0.8);
      c.js(`tl.to("${c.q("@r0")}", { scale: 1.04, boxShadow: "0 0 0 5px #22c55e", duration: 0.35 }, ${T(f.start + 0.2)});`);
      c.sfx("ding", f.start + 0.3);
      c.js(`tl.to("${c.q("@r0")}", { scale: 1, boxShadow: "0 0 0 0px #22c55e", duration: 0.3 }, ${T(g.start)}); tl.to("${c.q("@r2")}", { scale: 1.04, duration: 0.35 }, ${T(g.start + 0.2)});`);
      c.pop("@low", g.start + g.dur * 0.7);
      c.sfx("buzz", g.start + g.dur * 0.7);
      c.js(`tl.to("${c.q("@r2")}", { scale: 1, duration: 0.3 }, ${T(h.start)});`);
      c.pop("@pick", h.start + h.dur * 0.75);
      c.sfx("thud", h.start + h.dur * 0.75);
      mood(c, "@guy", "grin", h.start + h.dur * 0.75);
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Where hungry people decide</div>
      <div class="pos h" id="@guy" style="left:170px;top:260px">${who("juno", "neutral", 250, "@g")}</div>
      ${pack("@srch", "", row("🍴", "The Copper Fork", "4.7", "612", "American · $$ · 0.3 mi", "", "@r0").replace('class="ws-res "', 'class="ws-res h"') + BISTRO.replace('class="ws-res "', 'class="ws-res h"') + NINA("23", "h", "@r2"), `style="left:620px;top:140px"`)}
      <div class="pos h" id="@eye1" style="left:1440px;top:250px;padding:16px 26px;border-radius:999px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:32px">⭐ The stars</div>
      <div class="pos h" id="@eye2" style="left:1440px;top:350px;padding:16px 26px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:32px">🔢 How many reviews</div>
      <div class="pos h" id="@low" style="left:1440px;top:560px;padding:16px 26px;border-radius:20px;background:#ef4444;font-weight:800;font-size:32px">Only 23? 🤨</div>
      <div class="pos h" id="@pick" style="left:1430px;top:680px;padding:22px 32px;border-radius:26px;background:#16a34a;font-weight:800;font-size:34px;box-shadow:0 20px 50px rgba(22,163,74,.4)">🚗 Heading to<br />The Copper Fork</div>
      <div class="ws-note">Illustrative example. Restaurant names and review counts are made up.</div>`;
    },
  },
  // ───────── 5. Why reviews ─────────
  {
    id: "why", chapter: "Why reviews decide where people eat", music: "soft",
    lines: [
      "That's the thing about restaurants. People decide before they ever taste your food.",
      "Reviews are the closest thing to a taste test. A long list of happy guests says: this place is good, it's safe, and people come back.",
      "Google itself says that good reviews from real customers can help your business show up more in local search.",
      "And people read the newest reviews first. A restaurant with reviews from this week feels open, busy and alive.",
      { t: "So the goal isn't just more reviews. It's a steady stream of fresh ones, every single week.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@hl", a.start, { y: 40 });
      c.to("@hl", { y: -110, scale: 0.75, duration: 0.6, ease: "power2.inOut" }, b.start - 0.1);
      c.in("@p0", b.start + 0.3, { y: 80 }); c.sfx("pop", b.start + 0.3);
      c.in("@p1", d.start + 0.3, { y: 80 }); c.sfx("pop", d.start + 0.3);
      c.in("@p2", e.start + 0.3, { y: 80 }); c.sfx("pop", e.start + 0.3);
      c.js(`tl.to("${c.q(".rr-pil")}", { borderColor: "#fbbc04", boxShadow: "0 0 60px rgba(251,188,4,.35)", duration: 0.4, stagger: 0.2 }, ${T(f.start + 0.2)});`);
      c.in("@goal", f.start + f.dur * 0.45, { y: 30 });
      c.sfx("chime", f.start + f.dur * 0.45);
      const P = [["🤝", "Trust", "Proof your food is worth the trip"], ["📍", "Found", "Good reviews help you show up on Google"], ["🗓️", "Fresh", "Reviews from this week say you're busy"]];
      return `<div class="ws-big h" id="@hl" style="top:150px;font-size:96px">People decide <span class="o">before</span> they taste.</div>
      ${P.map(([i, b, p], k) => `<div class="rr-pil h" id="@p${k}" style="left:${150 + k * 560}px"><span>${i}</span><b>${b}</b><p>${p}</p></div>`).join("")}
      <div class="pos h" id="@goal" style="left:0;right:0;margin:0 auto;width:fit-content;top:730px;padding:20px 40px;border-radius:999px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:40px">Goal: fresh reviews, every week</div>`;
    },
  },
  // ───────── 6. The ask ─────────
  {
    id: "ask", chapter: "Why “leave us a review” doesn't work", music: "soft",
    lines: [
      "Nina knew she needed reviews. So she told her servers to ask.",
      { t: "“If you enjoyed everything, leave us a review on Google!”", say: "If you enjoyed everything... leave us a review on Google!" },
      { t: "And guests always said yes. “Of course! Happy to!”", say: "And guests always said yes. Of course! Happy to!" },
      "Then they walked out to the car, and the moment was gone.",
      { t: "Because leaving a review the old way takes work. Open Google. Search the name. Find the right listing. Scroll down. Tap write a review.", say: "Because leaving a review the old way takes work. Open Google... search the name... find the right listing... scroll down... tap, write a review." },
      { t: "Five steps, on a full stomach, on the way home. Almost nobody does it.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@luis", a.start, { x: -80, y: 0 });
      c.in("@tb", a.start + 0.3, { y: 40 });
      c.pop("@b1", b.start);
      talk(c, "@luis", b.start, b.dur);
      c.out("@b1", b.end + 0.1);
      c.js(`tl.set("${c.q("@tb [class^='m-']")}", { opacity: 0 }, ${T(d.start)}); tl.set("${c.q("@tb .m-grin")}", { opacity: 1 }, ${T(d.start)});`);
      c.pop("@b2", d.start + d.dur * 0.5);
      c.out("@b2", d.end + 0.1);
      c.js(`tl.to("${c.q("@tb .rr-guest")}", { x: 1400, duration: 2, ease: "power1.in", stagger: 0.15 }, ${T(e.start + 0.2)});`);
      c.sfx("whoosh", e.start + 0.4);
      mood(c, "@luis", "sad", e.start + e.dur * 0.6);
      c.to("@luis, @tb", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      const st = [0.08, 0.27, 0.45, 0.65, 0.8];
      st.forEach((p, i) => { c.in(`@s${i}`, f.start + f.dur * p, { x: -40, y: 0 }); c.sfx("tick", f.start + f.dur * p); });
      c.js(`tl.to("${c.q(".rr-step b")}", { backgroundColor: "#ef4444", duration: 0.2, stagger: 0.12 }, ${T(g.start)});`);
      c.pop("@later", g.start + g.dur * 0.3);
      c.sfx("thud", g.start + g.dur * 0.3);
      c.js(`tl.to("${c.q("@later-t")}", { autoAlpha: 0, duration: 0.15 }, ${T(g.start + g.dur * 0.7)}); tl.fromTo("${c.q("@never")}", { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.in" }, ${T(g.start + g.dur * 0.7)});`);
      c.sfx("thud", g.start + g.dur * 0.7 + 0.3);
      return `${room()}
      <div class="pos h" id="@luis" style="left:300px;top:300px">${luis("smile", 240, "@lu")}</div>
      ${table("@tb", 820, 470, ["extra1", "extra2"], { card: false })}
      <div class="bub h" id="@b1" style="left:500px;top:190px">“Leave us a review on Google!” 🙏</div>
      <div class="bub alt h" id="@b2" style="left:900px;top:270px">“Of course! Happy to!” 😊</div>
      <div class="rr-steps" style="left:470px;top:220px">${["Open Google", "Search “Casa Nina”", "Find the right listing", "Scroll down to reviews", "Tap “Write a review”"].map((s, i) => `<div class="rr-step h" id="@s${i}"><b>${i + 1}</b>${s}</div>`).join("")}</div>
      <div class="rr-stamp h" id="@later" style="left:1220px;top:400px"><span id="@later-t">LATER…</span><span class="h" id="@never" style="position:absolute;left:40px;top:16px">NEVER</span></div>`;
    },
  },
  // ───────── 7. Receipts and QR codes ─────────
  {
    id: "tried", chapter: "Receipts, QR codes and links", music: "soft",
    lines: [
      "Nina tried other things too.",
      "She printed the review link on the receipts. Nobody types in a link.",
      "She put a QR code on a table tent. A few people scanned it. Most didn't want to open the camera and line it up in a dim dining room.",
      { t: "The problem was never her guests. It was how many steps stood between “I loved it” and a posted review.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@nina", a.start, { x: -80, y: 0 });
      mood(c, "@nina", "neutral", a.start);
      c.in("@rc", b.start, { y: 200, d: 0.6 });
      c.js(`tl.fromTo("${c.q("@lnk")}", { backgroundColor: "rgba(239,68,68,0)" }, { backgroundColor: "rgba(239,68,68,.25)", duration: 0.4 }, ${T(b.start + b.dur * 0.5)});`);
      c.pop("@x0", b.start + b.dur * 0.7); c.sfx("buzz", b.start + b.dur * 0.7);
      c.in("@qr", d.start, { y: 200, d: 0.6 });
      c.in("@dark", d.start + d.dur * 0.55, { y: 0, d: 0.8 });
      c.pop("@x1", d.start + d.dur * 0.75); c.sfx("buzz", d.start + d.dur * 0.75);
      c.to("@rc, @qr, @x0, @x1, @dark", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@gap", e.start + 0.2, { y: 40 });
      c.in("@g1", e.start + e.dur * 0.55, { x: -40, y: 0 });
      c.in("@g2", e.start + e.dur * 0.75, { x: 40, y: 0 });
      c.js(`tl.fromTo("${c.q("@br")}", { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.6, ease: "power2.out" }, ${T(e.start + e.dur * 0.6)});`);
      return `${room()}
      <div class="pos h" id="@nina" style="left:140px;top:300px">${nina("neutral", 240, "@n")}</div>
      <div class="rr-receipt h" id="@rc" style="left:540px;top:150px"><div style="text-align:center;font-weight:700">CASA NINA</div><hr /><div class="r"><span>2 Mole plates</span><span>$36.00</span></div><div class="r"><span>Horchata x2</span><span>$8.00</span></div><hr /><div class="r"><b>TOTAL</b><b>$44.00</b></div><hr /><div>Review us on Google!</div><div class="lnk" id="@lnk">https://g.page/r/CbX7k2mQpZ8eEAI/review</div></div>
      <div class="pos h" id="@x0" style="left:620px;top:700px;padding:14px 28px;border-radius:999px;background:#ef4444;font-weight:800;font-size:34px">Nobody types this ✕</div>
      <div class="rr-qr h" id="@qr" style="left:1150px;top:330px">Scan to review us<div class="code"></div></div>
      <div class="rr-dark h" id="@dark"></div>
      <div class="pos h" id="@x1" style="left:1130px;top:730px;padding:14px 28px;border-radius:999px;background:#ef4444;font-weight:800;font-size:34px">Camera · aim · focus… 😵‍💫</div>
      <div class="ws-h h" id="@gap" style="left:560px;top:230px;width:1200px;font-size:84px">It was never the guests.<br /><span class="o">It was the steps.</span></div>
      <div class="pos h" id="@g1" style="left:560px;top:560px;padding:20px 34px;border-radius:24px;background:#fff;color:#0b1220;font-weight:800;font-size:40px">“I loved it!”</div>
      <div class="pos h" id="@br" style="left:850px;top:600px;width:460px;height:10px;border-radius:5px;background:repeating-linear-gradient(90deg,#ef4444 0 30px,transparent 30px 46px);transform-origin:0 50%"></div>
      <div class="pos h" id="@g2" style="left:1330px;top:560px;padding:20px 34px;border-radius:24px;background:#16a34a;font-weight:800;font-size:40px">★ Posted review</div>`;
    },
  },
  // ───────── 8. The card ─────────
  {
    id: "card", chapter: "The card that opens your review page", music: "pulse",
    lines: [
      "Then a friend who owns a barbershop showed her what he uses.",
      "A small card with a chip inside. You hold your phone near it, and your Google review page opens. That's it.",
      "No app to download. No searching. No typing. It works on iPhones from the XS and newer, and on Android phones with NFC.",
      "The guest picks the stars, writes a sentence, and taps post. About ten seconds.",
      { t: "Nina ordered ten. One for every table.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@nina", a.start, { x: -80, y: 0 });
      c.in("@fr", a.start + 0.3, { x: 80, y: 0 });
      talk(c, "@fr", a.start + a.dur * 0.5, a.dur * 0.4);
      mood(c, "@nina", "neutral", a.start);
      c.to("@nina, @fr", { autoAlpha: 0, duration: 0.4 }, b.start - 0.1);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, x: -300, rotationY: -70 }, { autoAlpha: 1, x: 0, rotationY: -18, rotationX: 8, duration: 1.0, ease: "power3.out" }, ${T(b.start)});`);
      const tap = b.start + b.dur * 0.55;
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 400, y: 100, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -4, duration: 0.8, ease: "power2.out" }, ${T(tap - 0.8)});`);
      ripple(c, "@ring", tap);
      c.sfx("tap", tap);
      c.js(`tl.fromTo("${c.q("@form")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, ${T(tap + 0.35)});`);
      c.sfx("ding", tap + 0.4);
      ["@x0", "@x1", "@x2"].forEach((s, i) => { c.pop(s, d.start + d.dur * [0.02, 0.15, 0.27][i]); c.sfx("tick", d.start + d.dur * [0.02, 0.15, 0.27][i]); });
      c.pop("@ios", d.start + d.dur * 0.55); c.pop("@and", d.start + d.dur * 0.82);
      c.js(`tl.to("${c.q(".rs")}", { color: "#fbbc04", scale: 1.25, duration: 0.18, stagger: 0.12, ease: "back.out(3)" }, ${T(e.start + 0.2)}); tl.to("${c.q(".rs")}", { scale: 1, duration: 0.2, stagger: 0.12 }, ${T(e.start + 0.38)});`);
      c.js(`tl.fromTo("${c.q("@form-type")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${T(e.dur * 0.3)}, ease: "steps(30)" }, ${T(e.start + e.dur * 0.35)});`);
      c.js(`tl.to("${c.q("@form-post")}", { backgroundColor: "#16a34a", scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 }, ${T(e.start + e.dur * 0.7)});`);
      c.sfx("pop", e.start + e.dur * 0.7);
      c.pop("@ten", e.start + e.dur * 0.8);
      c.to("@card, @ph, @x0, @x1, @x2, @ios, @and, @ten", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@stack", f.start, { scale: 0.85 });
      c.pop("@ten2", f.start + f.dur * 0.5);
      c.sfx("chime", f.start + f.dur * 0.5);
      return `<div class="pos h" id="@nina" style="left:500px;top:260px">${nina("neutral", 250, "@n")}</div>
      <div class="pos h" id="@fr" style="left:1150px;top:260px">${who("dale", "grin", 250, "@f")}</div>
      <div class="stage3d" style="left:180px;top:120px">${card3d("@card", "h")}</div>
      <div class="pos" style="left:720px;top:40px">${bigPhone("@ph", `<div class="formw h" id="@form">${reviewForm("@form").replace("Your Business", "Casa Nina").replace("Amazing work, so fast and friendly!", "Best mole I've ever had!")}</div>`, "h")}</div>
      <div class="rr-ring" id="@ring" style="left:660px;top:500px;width:200px;height:200px;margin:-100px 0 0 -100px"></div>
      <div class="ws-xs" style="left:1180px;top:170px"><div class="ws-x ws-ok h" id="@x0"><b>✓</b>No app</div><div class="ws-x ws-ok h" id="@x1"><b>✓</b>No searching</div><div class="ws-x ws-ok h" id="@x2"><b>✓</b>No typing a link</div></div>
      <div class="pos h" id="@ios" style="left:1180px;top:560px;padding:16px 28px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:32px"> iPhone XS and newer</div>
      <div class="pos h" id="@and" style="left:1180px;top:660px;padding:16px 28px;border-radius:999px;background:#3ddc84;color:#062014;font-weight:800;font-size:32px">🤖 Android with NFC</div>
      <div class="pos h" id="@ten" style="left:1180px;top:770px;padding:16px 28px;border-radius:999px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:36px">⏱ About 10 seconds</div>
      <div class="rr-img h" id="@stack" style="left:460px;top:120px;width:1000px;height:680px"><img src="assets/img/stack.webp" /></div>
      <div class="pos h" id="@ten2" style="left:1300px;top:620px;padding:20px 36px;border-radius:999px;background:#ff6a1f;font-weight:800;font-size:44px;box-shadow:0 20px 60px rgba(255,106,31,.45)">× 10 tables</div>`;
    },
  },
  // ───────── 9. Setup ─────────
  {
    id: "tables", chapter: "One on every table", music: "soft",
    lines: [
      "Here's how she set it up.",
      "One card standing on every table, right next to the salt and the hot sauce.",
      "One more in each check presenter, so it shows up the second the meal is done.",
      "And a stand at the host counter, with a tap spot and a QR code, for people waiting or picking up to-go.",
      { t: "Every guest sees it. Nobody has to go looking for it.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      const T5 = ["@a", "@b", "@c", "@d", "@e"];
      T5.forEach((s, i) => c.in(s, a.start + 0.2 + i * 0.15, { y: 40 }));
      T5.forEach((s, i) => { c.pop(`${s}c`, b.start + b.dur * 0.2 + i * 0.3); c.sfx("pop", b.start + b.dur * 0.2 + i * 0.3); });
      c.to(T5.join(", "), { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@chk", d.start + 0.1, { y: 200 });
      c.js(`tl.fromTo("${c.q("@chkc")}", { autoAlpha: 0, y: -120 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, ${T(d.start + d.dur * 0.4)});`);
      c.sfx("pop", d.start + d.dur * 0.4);
      c.in("@lbl1", d.start + d.dur * 0.6, { x: 40, y: 0 });
      c.to("@chk, @lbl1", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@stand", e.start, { y: 200 });
      c.pop("@tp", e.start + e.dur * 0.4); c.pop("@qr", e.start + e.dur * 0.55);
      c.in("@lbl2", e.start + e.dur * 0.7, { x: 40, y: 0 });
      c.to("@stand, @tp, @qr, @lbl2", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      T5.forEach((s, i) => c.in(s, f.start + i * 0.08, { y: 20, d: 0.4 }));
      c.js(`tl.fromTo("${c.q(".rr-tent")}", { boxShadow: "0 0 24px rgba(251,188,4,.7)" }, { boxShadow: "0 0 50px rgba(251,188,4,1)", duration: 0.4, yoyo: true, repeat: 3 }, ${T(f.start + 0.5)});`);
      c.pop("@eye", f.start + f.dur * 0.5);
      return `${room()}<div class="kicker h" id="@k" style="left:120px;top:90px">The setup</div>
      ${table("@a", 120, 330, ["extra1", "extra2"])}${table("@b", 560, 330, ["okafor"])}${table("@c", 1000, 330, ["gary", "extra6"])}${table("@d", 1440, 330, ["juno"])}${table("@e", 780, 600, ["extra7", "frank"])}
      <div class="rr-chk h" id="@chk" style="left:620px;top:220px"><div class="slip">CASA NINA<br />Table 4<br />—<br />Total $44.00<br />Tip ____<br /><br />Thank you!</div>${tent("@chkc", `style="left:196px;top:150px"`)}</div>
      <div class="pos h" id="@lbl1" style="left:1000px;top:380px;padding:22px 34px;border-radius:24px;background:#fff;color:#0b1220;font-weight:800;font-size:44px">In every check presenter 🧾</div>
      <div class="rr-img h" id="@stand" style="left:420px;top:110px;width:560px;height:690px;background:#f1f5f9"><img src="assets/img/stand.webp" style="object-fit:contain" /></div>
      <div class="pos h" id="@tp" style="left:1060px;top:260px;padding:16px 28px;border-radius:999px;background:#2563eb;font-weight:800;font-size:36px">📲 Tap</div>
      <div class="pos h" id="@qr" style="left:1060px;top:360px;padding:16px 28px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:36px">▦ or scan the QR</div>
      <div class="pos h" id="@lbl2" style="left:1060px;top:480px;padding:22px 34px;border-radius:24px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:40px">At the host stand + to-go counter</div>
      <div class="pos h" id="@eye" style="left:0;right:0;margin:0 auto;width:fit-content;top:150px;padding:18px 36px;border-radius:999px;background:#16a34a;font-weight:800;font-size:40px">👀 Every guest sees it</div>`;
    },
  },
  // ───────── 10. The ask that works ─────────
  {
    id: "script", chapter: "The 10-second ask your servers can use", music: "soft",
    lines: [
      "But the card alone isn't the magic. The moment you ask is.",
      "Nina taught her servers one simple move.",
      "When a guest says, that was amazing, that's the moment.",
      { t: "“I'm so glad! If you've got ten seconds, tap your phone right here. It opens our Google reviews.”", say: "I'm so glad! If you've got ten seconds, tap your phone right here. It opens our Google reviews." },
      "Then the server walks away. No hovering. No pressure.",
      { t: "Ask every table the same way, while the meal is still fresh. Not later. Not in an email next week.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@hl", a.start, { y: 40 });
      c.to("@hl", { autoAlpha: 0, duration: 0.4 }, b.start + b.dur * 0.6);
      c.in("@luis", b.start + 0.2, { x: -80, y: 0 });
      c.in("@tb", b.start + 0.4, { y: 40 });
      c.pop("@wow", d.start + d.dur * 0.25);
      c.js(`tl.set("${c.q("@tb [class^='m-']")}", { opacity: 0 }, ${T(d.start)}); tl.set("${c.q("@tb .m-grin")}", { opacity: 1 }, ${T(d.start)});`);
      c.pop("@mom", d.start + d.dur * 0.7);
      c.sfx("ding", d.start + d.dur * 0.7);
      c.to("@wow, @mom", { autoAlpha: 0, duration: 0.3 }, e.start - 0.1);
      c.in("@q", e.start, { scale: 0.9 });
      talk(c, "@luis", e.start, e.dur);
      mood(c, "@luis", "grin", e.start);
      c.to("@q", { autoAlpha: 0, duration: 0.4 }, f.start);
      c.to("@luis", { x: -700, duration: 1.6, ease: "power1.in" }, f.start + 0.2);
      c.js(`tl.fromTo("${c.q("@tbg1")}", { y: 0 }, { y: -12, duration: 0.3, yoyo: true, repeat: 1 }, ${T(f.start + f.dur * 0.5)});`);
      ripple(c, "@tbr", f.start + f.dur * 0.6);
      c.sfx("tap", f.start + f.dur * 0.6);
      c.pop("@pst", f.start + f.dur * 0.8);
      c.sfx("pop", f.start + f.dur * 0.8);
      c.in("@now", g.start + 0.3, { x: 60, y: 0 });
      c.in("@nl", g.start + g.dur * 0.6, { x: 60, y: 0 });
      c.in("@ne", g.start + g.dur * 0.75, { x: 60, y: 0 });
      return `${room()}
      <div class="ws-big h" id="@hl" style="top:330px;font-size:110px">It's not the card.<br /><span class="o">It's the moment.</span></div>
      <div class="pos h" id="@luis" style="left:220px;top:300px">${luis("smile", 240, "@lu")}</div>
      ${table("@tb", 700, 470, ["extra6", "extra2"])}
      <div class="bub alt h" id="@wow" style="left:760px;top:300px">“That was amazing!” 🤤</div>
      <div class="pos h" id="@mom" style="left:1320px;top:320px;padding:20px 34px;border-radius:999px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:40px">⬅ That's the moment</div>
      <div class="rr-quote h" id="@q" style="left:560px;top:140px;width:1240px">“I'm so glad! If you've got ten seconds, tap your phone right here. It opens our Google reviews.”<small>Then walk away. No hovering.</small></div>
      <div class="pos h" id="@pst" style="left:1100px;top:400px;padding:16px 30px;border-radius:999px;background:#16a34a;font-weight:800;font-size:34px">★★★★★ Posted</div>
      <div class="ws-xs" style="left:1180px;top:520px"><div class="ws-x ws-ok h" id="@now"><b>✓</b>Every table, right now</div><div class="ws-x h" id="@nl"><b>✕</b>Later</div><div class="ws-x h" id="@ne"><b>✕</b>Email next week</div></div>`;
    },
  },
  // ───────── 11. Rules ─────────
  {
    id: "rules", chapter: "Google's review rules (don't skip this)", music: "soft",
    lines: [
      "Now, there are a few rules you can't skip, because Google can remove reviews that break them.",
      "Don't give a free dessert or a discount in exchange for a review. That's not allowed.",
      "Don't only ask the tables that seem happy. Ask everyone the same way.",
      "And never write reviews yourself, or have your staff or family write them.",
      { t: "Real guests, asked fairly. That's the kind of review that lasts.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      c.in("@r0", b.start + 0.2, { x: -60, y: 0 }); c.sfx("thud", b.start + 0.4);
      c.in("@r1", d.start + 0.2, { x: -60, y: 0 }); c.sfx("thud", d.start + 0.4);
      c.in("@r2", e.start + 0.2, { x: -60, y: 0 }); c.sfx("thud", e.start + 0.4);
      c.in("@r3", f.start + 0.2, { x: -60, y: 0 }); c.sfx("chime", f.start + 0.4);
      return `<div class="kicker h" id="@k" style="left:140px;top:110px">Google's rules</div>
      <div class="rules" style="top:230px;gap:34px">
        <div class="rule no h" id="@r0"><span>✕</span><p>No free dessert for a review</p></div>
        <div class="rule no h" id="@r1"><span>✕</span><p>Don't ask only the happy tables</p></div>
        <div class="rule no h" id="@r2"><span>✕</span><p>No reviews from you, staff or family</p></div>
        <div class="rule ok h" id="@r3"><span>✓</span><p><b>Real guests, asked fairly</b></p></div>
      </div>`;
    },
  },
  // ───────── 12. Week one ─────────
  {
    id: "week1", chapter: "The first weekend", music: "pulse",
    lines: [
      "The first Friday, the cards were on the tables.",
      "Table four tapped. Then table seven. Then the couple by the window.",
      "By Sunday night, Nina had eleven new reviews. More than she'd gotten all year.",
      { t: "And they weren't just stars. People wrote about the food. “Best mole I've ever had.” “Our server Luis was so sweet.” “We'll be back Friday.”", say: "And they weren't just stars. People wrote about the food. Best mole I've ever had... Our server Luis was so sweet... We'll be back Friday." },
      { t: "Every one of those reviews was a little ad for Casa Nina, written by a real guest.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      ["@a", "@b", "@c"].forEach((s, i) => c.in(s, a.start + i * 0.15, { y: 40 }));
      ["@a", "@b", "@c"].forEach((s, i) => { const t = b.start + b.dur * (0.1 + i * 0.3); ripple(c, `${s}r`, t); c.sfx("tap", t); c.in(`@n${i}`, t + 0.3, { x: 80, y: 0 }); c.sfx("ding", t + 0.35); });
      c.in("@ctr", d.start, { scale: 0.7 });
      count(c, "cnt", 23, 34, d.start + 0.3, d.dur * 0.6);
      for (let k = 0; k < 11; k++) c.sfx("tick", d.start + 0.3 + k * (d.dur * 0.6 / 11));
      c.pop("@yr", d.start + d.dur * 0.75);
      c.to("@a, @b, @c, @n0, @n1, @n2, @ctr, @yr", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      const R = [0.32, 0.55, 0.78];
      R.forEach((p, i) => { c.in(`@rv${i}`, e.start + e.dur * p, { y: 60, scale: 0.9 }); c.sfx("pop", e.start + e.dur * p); });
      c.in("@ad", f.start + f.dur * 0.4, { y: 40 });
      c.sfx("chime", f.start + f.dur * 0.4);
      const N = [["Table 4", "Amazing food and fast service"], ["Table 7", "The horchata!! 😍"], ["Window table", "Our new favorite spot"]];
      const RV = [["Maria G.", "#db2777", "Best mole I've ever had. Tastes like my grandma's."], ["Derek T.", "#2563eb", "Our server Luis was so sweet. Huge portions too."], ["Priya S.", "#16a34a", "Found this place by accident. We'll be back Friday!"]];
      return `${room()}
      ${table("@a", 120, 380, ["extra1", "extra2"])}${table("@b", 470, 380, ["okafor"])}${table("@c", 820, 380, ["gary", "extra6"])}
      <div class="rr-notifs">${N.map(([t, s], i) => `<div class="rr-notif h" id="@n${i}"><div class="ic">G</div><div><b>New review · Casa Nina</b><small><span>★★★★★</span> ${s}</small></div></div>`).join("")}</div>
      <div class="ws-stat h" id="@ctr" style="left:1260px;top:540px;width:560px;text-align:center"><span>Casa Nina's Google reviews</span><b id="@cnt">23</b><small>Illustrative example</small></div>
      <div class="pos h" id="@yr" style="left:1290px;top:472px;padding:14px 26px;border-radius:999px;background:#16a34a;font-weight:800;font-size:30px">+11 in one weekend</div>
      ${RV.map(([n, col, p], i) => `<div class="rr-rev h" id="@rv${i}" style="left:${[120, 600, 1080][i]}px;top:${[180, 330, 480][i]}px"><div class="hd"><div class="av" style="background:${col}">${n[0]}</div><div><div class="nm">${n}</div><div class="st">★★★★★<em>a day ago</em></div></div></div><p>${p}</p></div>`).join("")}
      <div class="pos h" id="@ad" style="left:120px;top:800px;padding:18px 34px;border-radius:999px;background:#ff6a1f;font-weight:800;font-size:36px">📣 Free ads, written by real guests</div>
      <div class="ws-note">Illustrative example. Names and reviews are made up.</div>`;
    },
  },
  // ───────── 13. Reply ─────────
  {
    id: "reply", chapter: "Reply to every review (even the bad ones)", music: "soft",
    lines: [
      "Then Nina did one thing most owners skip. She replied to every single review.",
      "A real thank-you to the happy ones, with the guest's name and the dish they loved.",
      "And when a two-star review showed up about a long wait, she didn't argue.",
      { t: "“You're right, Friday got busy and we were slow. Thank you for telling us. Next time, ask for me, and I'll make sure you're taken care of.”", say: "You're right. Friday got busy, and we were slow. Thank you for telling us. Next time, ask for me, and I'll make sure you're taken care of." },
      { t: "People reading your reviews are watching how you treat guests when something goes wrong. A calm, kind reply can win more trust than another five stars.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@nina", a.start, { x: -80, y: 0 });
      mood(c, "@nina", "smile", a.start);
      c.in("@good", b.start, { y: 60 });
      c.in("@gr", b.start + b.dur * 0.5, { y: 20 });
      c.sfx("pop", b.start + b.dur * 0.5);
      c.to("@good", { autoAlpha: 0, y: -40, duration: 0.4 }, d.start - 0.1);
      c.in("@bad", d.start, { y: 60 });
      c.sfx("buzz", d.start + 0.3);
      mood(c, "@nina", "neutral", d.start + 0.3);
      c.in("@br", e.start + 0.2, { y: 20 });
      const ty = `ty_${c.id("x").replace(/-/g, "_")}`;
      c.js(`const ${ty} = { n: 0 }, ${ty}s = ${JSON.stringify(REPLY)}; tl.fromTo(${ty}, { n: 0 }, { n: ${ty}s.length, duration: ${T(e.dur * 0.9)}, ease: "none", onUpdate: () => { document.getElementById("${c.id("brt")}").textContent = ${ty}s.slice(0, Math.round(${ty}.n)); } }, ${T(e.start + 0.3)});`);
      mood(c, "@nina", "smile", e.start + e.dur * 0.5);
      c.pop("@trust", f.start + f.dur * 0.65);
      c.sfx("chime", f.start + f.dur * 0.65);
      return `<div class="pos h" id="@nina" style="left:130px;top:300px">${nina("smile", 250, "@n")}</div>
      <div class="rr-rev h" id="@good" style="left:560px;top:180px;width:900px"><div class="hd"><div class="av" style="background:#db2777">M</div><div><div class="nm">Maria G.</div><div class="st">★★★★★<em>2 days ago</em></div></div></div><p>Best mole I've ever had. Tastes like my grandma's.</p><div class="rp h" id="@gr"><b>Response from the owner</b>Maria, that means the world. It IS my grandma's recipe! See you soon. — Nina</div></div>
      <div class="rr-rev h" id="@bad" style="left:560px;top:150px;width:1020px"><div class="hd"><div class="av" style="background:#64748b">K</div><div><div class="nm">Kevin R.</div><div class="st">★★<span style="color:#dadce0">★★★</span><em>yesterday</em></div></div></div><p>Food was good but we waited 40 minutes for our entrées on Friday.</p><div class="rp h" id="@br"><b>Response from the owner</b><span id="@brt"></span></div></div>
      <div class="pos h" id="@trust" style="left:900px;top:720px;padding:20px 36px;border-radius:999px;background:#16a34a;font-weight:800;font-size:38px">🤝 A kind reply builds trust</div>
      <div class="ws-note">Illustrative example. Names and reviews are made up.</div>`;
    },
  },
  // ───────── 14. Profile ─────────
  {
    id: "profile", chapter: "Your Google listing is your front door", music: "pulse",
    lines: [
      { t: "Nina also booked a free call with us at CEO Turbo, and we cleaned up her Google listing.", say: "Nina also booked a free call with us at C.E.O. Turbo... and we cleaned up her Google listing." },
      "The right hours. Her real menu. Fresh food photos, and a lot of them came from guests' own reviews.",
      "A call button, directions, and a link to order.",
      { t: "Because when the reviews bring someone to your listing, the next tap should be easy.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@prof", a.start + 0.2, { x: -200, y: 0, d: 0.7 });
      c.sfx("whoosh", a.start + 0.2);
      ["@c0", "@c1", "@c2"].forEach((s, i) => { c.in(s, b.start + b.dur * (0.05 + i * 0.25), { x: 60, y: 0 }); c.sfx("pop", b.start + b.dur * (0.05 + i * 0.25)); });
      c.js(`tl.fromTo("${c.q(".rr-ph")}", { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2)" }, ${T(b.start + b.dur * 0.6)});`);
      c.js(`tl.fromTo("${c.q(".bt div")}", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.25 }, ${T(d.start + 0.1)});`);
      c.in("@c3", d.start + d.dur * 0.6, { x: 60, y: 0 });
      ripple(c, "@ring", e.start + e.dur * 0.6);
      c.sfx("tap", e.start + e.dur * 0.6);
      return `<div class="ws-prof h" id="@prof" style="left:200px;top:110px;width:640px"><div class="cv" style="background:linear-gradient(135deg,#b91c1c,#f59e0b)"></div><div class="lg">🌮</div>
        <div class="bd"><div class="nm">Casa Nina</div><div class="rt"><span>4.9 ★★★★★</span> (61) · Mexican · $$</div><div class="ct"><b>Open</b> · Closes 10 PM</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px">${["🌮", "🍲", "🥗", "🍹"].map((f) => `<div class="rr-ph" style="height:110px;border-radius:14px;background:#fde68a;display:flex;align-items:center;justify-content:center;font-size:56px">${f}</div>`).join("")}</div>
        <div class="bt"><div><span>📞</span>Call</div><div><span>🧭</span>Directions</div><div class="bk"><span>🛍️</span>Order</div></div></div></div>
      <div class="rr-ring" id="@ring" style="left:735px;top:770px"></div>
      <div class="ws-xs" style="left:1000px;top:200px"><div class="ws-x ws-ok h" id="@c0"><b>✓</b>Right hours</div><div class="ws-x ws-ok h" id="@c1"><b>✓</b>Her real menu</div><div class="ws-x ws-ok h" id="@c2"><b>✓</b>Fresh food photos</div><div class="ws-x ws-ok h" id="@c3"><b>✓</b>Call · Directions · Order</div></div>
      <div class="ws-note">Illustrative example.</div>`;
    },
  },
  // ───────── 15. Climb ─────────
  {
    id: "climb", chapter: "From 23 reviews to the top of the map", music: "pulse",
    lines: [
      "Week after week, the reviews kept coming. Twenty-three became seventy. Seventy became a hundred and fifty.",
      "Not because Nina begged. Because every table made it easy.",
      { t: "Then one night, someone searched restaurants near me, and Casa Nina showed up first.", say: "Then one night, someone searched, restaurants near me... and Casa Nina showed up first." },
      { t: "Google decides the order, so nobody can promise you the top spot. But a steady stream of great, fresh reviews gave Nina a real shot at it.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@ctr", a.start, { scale: 0.7 });
      count(c, "cnt", 23, 152, a.start + 0.4, a.dur - 0.2);
      for (let k = 0; k < 16; k++) c.sfx("tick", a.start + 0.4 + k * ((a.dur - 0.2) / 16));
      c.js(`tl.fromTo("${c.q("@spark path")}", { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: ${T(a.dur)}, ease: "power1.inOut" }, ${T(a.start + 0.3)});`);
      c.in("@easy", b.start + b.dur * 0.5, { y: 30 });
      c.to("@ctr, @easy", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@srch", d.start, { y: 300, d: 0.6 });
      c.js(`tl.to("${c.q("@r2")}", { y: -268, duration: 0.9, ease: "power3.inOut" }, ${T(d.start + d.dur * 0.6)}); tl.to("${c.q("@r0")}, ${c.q("@r1")}", { y: 134, duration: 0.9, ease: "power3.inOut" }, ${T(d.start + d.dur * 0.6)});`);
      c.sfx("whoosh", d.start + d.dur * 0.6);
      c.sfx("ding", d.start + d.dur * 0.6 + 0.9);
      c.pop("@one", d.start + d.dur * 0.6 + 0.9);
      c.in("@fine", e.start + 0.3, { y: 20 });
      return `<div class="ws-stat h" id="@ctr" style="left:560px;top:160px;width:800px;text-align:center"><span>Casa Nina's Google reviews</span><b id="@cnt">23</b>
        <svg id="@spark" viewBox="0 0 700 140" style="width:100%;height:140px;margin-top:10px"><path d="M10 130 C120 125 180 110 260 96 S420 60 520 40 S640 16 690 10" stroke="#fbbc04" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"/></svg><small>Illustrative example</small></div>
      <div class="pos h" id="@easy" style="left:0;right:0;margin:0 auto;width:fit-content;top:780px;padding:18px 36px;border-radius:999px;background:#16a34a;font-weight:800;font-size:38px">Every table made it easy</div>
      ${pack("@srch", "restaurants near me", FORK("640").replace('class="ws-res "', 'class="ws-res " id="' + "@r0" + '"') + BISTRO.replace('class="ws-res "', 'class="ws-res " id="@r1"') + NINA("152", "you", "@r2"), `style="left:560px;top:120px"`)}
      <div class="pos h" id="@one" style="left:1380px;top:270px;padding:18px 30px;border-radius:999px;background:#fbbc04;color:#1f1300;font-weight:800;font-size:40px">#1 🎉</div>
      <div class="ws-disc h" id="@fine" style="top:780px">Google decides rankings. No one can guarantee them.</div>
      <div class="ws-note">Illustrative example. Restaurant names, review counts and positions are made up.</div>`;
    },
  },
  // ───────── 16. Packed ─────────
  {
    id: "packed", chapter: "Friday night, packed", music: "pulse",
    lines: [
      "Friday night. Seven thirty. Again.",
      "This time, there's a wait at Casa Nina.",
      "New faces who found her on Google. Regulars who brought their friends. And a list of names at the host stand.",
      { t: "Same food. Same street. The only difference is that now, people can see how good it is before they walk in.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@clock", a.start, { y: -30 });
      c.sfx("chime", a.start + 0.2);
      c.in("@fork", a.start + 0.2, { x: -80, y: 0 });
      c.in("@casa", a.start + 0.4, { x: 80, y: 0 });
      c.js(`tl.fromTo("${c.q("@casa .rr-head")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.15, ease: "back.out(1.6)" }, ${T(b.start)});`);
      c.js(`tl.fromTo("${c.q("@line .who")}", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.18, ease: "power2.out" }, ${T(b.start + b.dur * 0.5)});`);
      c.sfx("pop", b.start + b.dur * 0.5);
      c.in("@wait", d.start + d.dur * 0.5, { y: 200, d: 0.6 });
      ["@w0", "@w1", "@w2", "@w3", "@w4"].forEach((s, i) => c.in(s, d.start + d.dur * 0.6 + i * 0.25, { x: -20, y: 0 }));
      c.to("@wait", { autoAlpha: 0, duration: 0.4 }, e.start + 0.2);
      c.in("@same", e.start + e.dur * 0.45, { y: 40 });
      c.sfx("chime", e.start + e.dur * 0.6);
      return `<div class="rr-street"><div class="stars">${Array.from({ length: 40 }, (_, i) => `<i style="left:${(i * 197) % 1900}px;top:${(i * 53) % 150 + 10}px"></i>`).join("")}</div></div>
      <div class="rr-clock h" id="@clock">🕢 Friday · 7:30 PM</div>
      ${store("@fork", "The Copper Fork", 80, "h", heads(["extra1", "extra6", "extra5"], 150))}
      ${store("@casa", "Casa Nina", 1080, "nina h", heads(["frank", "okafor", "extra2", "gary", "extra7"]))}
      <div class="rr-line" id="@line" style="left:1100px">${["juno", "extra4", "extra3", "banker", "extra1", "dale"].map((g, k) => who(g, "grin", 90, `@ln${k}`)).join("")}</div>
      <div class="rr-wait h" id="@wait" style="left:300px;top:200px"><div class="hd">Waitlist · Fri</div>${[["Garcia", "4"], ["Kim", "2"], ["Johnson", "6"], ["Patel", "3"], ["Brooks", "2"]].map(([n, p], i) => `<div class="h" id="@w${i}">${n} <span>party of ${p}</span></div>`).join("")}</div>
      <div class="pos h" id="@same" style="left:0;right:0;margin:0 auto;width:fit-content;top:790px;padding:20px 40px;border-radius:999px;background:rgba(15,23,42,.92);border:3px solid #fbbc04;font-family:'Space Grotesk';font-weight:700;font-size:46px">Same food. Same street. <span class="o">Now people can see it.</span></div>
      <div class="ws-note">Illustrative example.</div>`;
    },
  },
  // ───────── 17. Five places ─────────
  {
    id: "places", chapter: "5 places to put review cards in your restaurant", music: "soft",
    lines: [
      "If you own a restaurant, here are five places to put a review card.",
      "One. On every table, where people sit the longest.",
      "Two. In the check presenter, the exact moment the meal is done.",
      "Three. At the host stand, for guests who are waiting or heading out.",
      "Four. On the bar, where regulars talk to your bartender all night.",
      { t: "Five. At the pickup counter, so your to-go customers can review you too.", gap: 0.6 },
    ],
    draw(c) {
      const [a, ...L] = c.L;
      c.in("@k", a.start);
      L.forEach((l, i) => { c.in(`@p${i}`, l.start, { y: 80 }); c.sfx("pop", l.start); c.js(`tl.to("${c.q(".ws-five .r")}", { borderColor: "#334155", boxShadow: "0 0 0px rgba(255,106,31,0)", duration: 0.2 }, ${T(l.start)}); tl.to("${c.q(`@p${i}`)}", { borderColor: "#ff6a1f", boxShadow: "0 0 70px rgba(255,106,31,.35)", duration: 0.3 }, ${T(l.start + 0.1)});`); });
      const P = [["🍽️", "Every table", "Where people sit the longest"], ["🧾", "Check presenter", "The second the meal is done"], ["🙋", "Host stand", "Waiting or heading out"], ["🍸", "The bar", "Regulars + your bartender"], ["🛍️", "Pickup counter", "To-go guests review too"]];
      return `<div class="kicker h" id="@k" style="left:110px;top:90px">5 places to put a review card</div>
      <div class="ws-five">${P.map(([i, b, s], k) => `<div class="r h" id="@p${k}"><div class="n">${k + 1}</div><div class="ic">${i}</div><b>${b}</b><span>${s}</span></div>`).join("")}</div>`;
    },
  },
  // ───────── 18. Five mistakes ─────────
  {
    id: "mistakes", chapter: "5 review mistakes restaurants make", music: "soft",
    lines: [
      "And five mistakes to avoid.",
      "One. Asking later. Later means never.",
      "Two. Trading freebies for reviews. Google doesn't allow it.",
      "Three. Ignoring bad reviews. Reply calmly, every time.",
      "Four. Keeping the cards in a drawer. If guests can't see them, they can't work.",
      { t: "Five. Never testing your card. Tap it with your own phone once, and make sure it opens your review page.", gap: 0.6 },
    ],
    draw(c) {
      const [a, ...L] = c.L;
      c.in("@k", a.start);
      L.forEach((l, i) => { c.in(`@m${i}`, l.start + 0.1, { x: -60, y: 0 }); c.sfx("thud", l.start + 0.3); });
      const M = ["Asking “later”", "Freebies for reviews", "Ignoring bad reviews", "Cards in a drawer", "Never testing the card"];
      return `<div class="kicker h" id="@k" style="left:140px;top:90px">5 mistakes to avoid</div>
      <div class="ws-xs" style="left:140px;top:190px;gap:20px">${M.map((m, i) => `<div class="ws-x h" id="@m${i}" style="width:1100px;font-size:52px;padding:24px 36px"><b>${i + 1}</b>${m}</div>`).join("")}</div>
      <div class="pos" style="left:1380px;top:250px">${nina("smile", 240, "@n")}</div>`;
    },
  },
  // ───────── 19. Offer ─────────
  {
    id: "offer", chapter: "Get review cards for your tables", music: "pulse",
    lines: [
      { t: "If you want what Nina has, the cards are at ceoturbo.com/google-review-cards.", say: "If you want what Nina has, the cards are at C.E.O. Turbo dot com, slash google review cards." },
      { t: "One card is $16.99. Five cards are $59.99. And ten cards, enough for most dining rooms, are $99.99.", say: "One card is sixteen ninety-nine. Five cards are fifty-nine ninety-nine. And ten cards, enough for most dining rooms, are ninety-nine ninety-nine." },
      { t: "There's also a counter stand with a tap spot and a QR code, for $29.99.", say: "There's also a counter stand, with a tap spot and a QR code, for twenty-nine ninety-nine." },
      { t: "Shipping in the US is free. You pay once, with no subscription. And for $5, we'll program your review link and test it before it ships.", say: "Shipping in the U.S. is free. You pay once, with no subscription. And for five dollars, we'll program your review link and test it before it ships." },
      { t: "Not right for you? Send it back new within 30 days for a refund.", say: "Not right for you? Send it back new, within thirty days, for a refund.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@url", a.start + a.dur * 0.4, { y: 40 });
      c.sfx("ding", a.start + a.dur * 0.4);
      const at = [0.02, 0.3, 0.6];
      ["@k0", "@k1", "@k2"].forEach((s, i) => { c.in(s, b.start + b.dur * at[i], { y: 60 }); c.sfx("pop", b.start + b.dur * at[i]); });
      c.in("@k3", d.start + 0.2, { y: 60 }); c.sfx("pop", d.start + 0.2);
      ["@x0", "@x1", "@x2"].forEach((s, i) => { c.pop(s, e.start + e.dur * [0.05, 0.35, 0.65][i]); c.sfx("tick", e.start + e.dur * [0.05, 0.35, 0.65][i]); });
      c.pop("@x3", f.start + 0.3);
      const K = [["1 card", "$16.99", "For the host stand"], ["5 cards", "$59.99", "Small dining room"], ["10 cards", "$99.99", "Most dining rooms"], ["Counter stand", "$29.99", "Tap + QR code"]];
      return `<div class="packs" style="top:120px">${K.map(([s, b, n], i) => `<div class="pk${i === 2 ? " hot" : ""} h" id="@k${i}">${i === 2 ? `<div class="popb">Every table</div>` : ""}<small>${s}</small><b>${b}</b><span>${n}</span></div>`).join("")}</div>
      <div class="perks" style="top:520px;font-size:38px"><span class="h" id="@x0">🚚 Free US shipping</span><span class="h" id="@x1">💳 Pay once</span><span class="h" id="@x2">🛠️ We program it: $5</span><span class="h" id="@x3">↩️ 30-day returns</span></div>
      <div class="url h" id="@url" style="top:660px;font-size:62px">ceoturbo.com/google-review-cards</div>`;
    },
  },
  // ───────── 20. More help ─────────
  {
    id: "more", chapter: "Want help with the rest of your restaurant?", music: "soft",
    lines: [
      "And if you want more help, we work with restaurants on Google and Apple Maps, delivery apps like DoorDash and Uber Eats, and menus on your TVs.",
      "We set up TV menus and review cards for a real restaurant, Exclusive Restaurant and Lounge, in Covington, Georgia.",
      { t: "Book a free thirty-minute call at ceoturbo.com/restaurants. You keep the plan, whether you hire us or not.", say: "Book a free, thirty-minute call at C.E.O. Turbo dot com, slash restaurants. You keep the plan, whether you hire us or not.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      ["@s0", "@s1", "@s2", "@s3"].forEach((s, i) => { c.in(s, a.start + a.dur * (0.08 + i * 0.22), { x: -60, y: 0 }); c.sfx("pop", a.start + a.dur * (0.08 + i * 0.22)); });
      c.in("@img", b.start, { x: 200, y: 0, d: 0.7 });
      c.in("@lbl", b.start + b.dur * 0.5, { y: 20 });
      c.in("@url", d.start + d.dur * 0.15, { y: 40 });
      c.sfx("ding", d.start + d.dur * 0.15);
      return `<div class="rr-svc h" id="@s0" style="left:120px;top:150px"><span>🗺️</span>Google + Apple Maps</div>
      <div class="rr-svc h" id="@s1" style="left:120px;top:290px"><span>🛵</span>DoorDash · Uber Eats · Grubhub</div>
      <div class="rr-svc h" id="@s2" style="left:120px;top:430px"><span>📺</span>Menus on your TVs</div>
      <div class="rr-svc h" id="@s3" style="left:120px;top:570px;border-color:#fbbc04"><span>⭐</span>Review cards for every table</div>
      <div class="rr-img h" id="@img" style="left:1080px;top:110px;width:420px;height:640px"><img src="assets/img/install.webp" /></div>
      <div class="pos h" id="@lbl" style="left:1050px;top:770px;width:480px;text-align:center;padding:14px 20px;border-radius:18px;background:rgba(15,23,42,.92);border:2px solid #334155;font-weight:700;font-size:24px">📍 Real install: Exclusive Restaurant &amp; Lounge, Covington, GA</div>
      <div class="ws-cta h" id="@url" style="left:120px;top:730px;font-size:50px;padding:24px 44px">📅 ceoturbo.com/restaurants</div>`;
    },
  },
  // ───────── 21. End ─────────
  {
    id: "end", chapter: "Your move", music: "soft", pad: 3.5,
    lines: [
      "Nina's food was always good enough. Now people can see it.",
      { t: "Get your cards at ceoturbo.com/google-review-cards. The link is in the description.", say: "Get your cards at C.E.O. Turbo dot com, slash google review cards. The link is in the description." },
      { t: "And if you know a restaurant owner with great food and empty tables, send them this video.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@l1", a.start, { y: 40 });
      c.in("@l2", a.start + a.dur * 0.55, { y: 40 });
      c.in("@nina", a.start + 0.3, { x: -100, y: 0 });
      mood(c, "@nina", "grin", a.start + 0.3);
      c.in("@tent", b.start, { scale: 0.7 });
      c.pop("@url", b.start + 0.3);
      c.sfx("ding", b.start + 0.3);
      c.in("@share", d.start + 0.2, { y: 30 });
      return `<div class="ws-big h" id="@l1" style="top:110px;font-size:90px">Nina's food was always good enough.</div>
      <div class="ws-big h" id="@l2" style="top:230px;font-size:120px"><span class="o">Now people can see it.</span></div>
      <div class="pos h" id="@nina" style="left:160px;top:400px">${nina("smile", 190, "@n")}</div>
      ${tent("@tent", `style="left:400px;top:470px"`).replace('class="rr-tent h"', 'class="rr-tent big h"')}
      <div class="ws-cta h" id="@url" style="left:740px;top:560px;font-size:46px">ceoturbo.com/google-review-cards</div>
      <div class="ws-sub h" id="@share" style="left:740px;top:740px;font-size:32px">📤 Know a restaurant owner with empty tables? Send them this.</div>`;
    },
  },
];
