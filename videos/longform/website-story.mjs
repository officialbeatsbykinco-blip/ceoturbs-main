// "He Had $43 in the Bank. Then He Got a Website." — Why your business needs a website, told as a story.
// Long-form 16:9 animated story (~8 min). Marcus is a made-up character and the video says so up front;
// every step he takes is a real CEO Turbo service. Real numbers only where they are real:
// $4.31 lowest cost per lead (src/content/results.ts), Turbo Launch $1,997 and the free 30-minute
// Brand Boost call (src/content/pricing.ts, src/pages/BrandBoost.tsx). Marcus's own numbers are labeled illustrative.
import { person } from "../five-stars/cast.mjs";

export const TITLE = "He Had $43 in the Bank. Then He Got a Website.";
export const SLUG = "website-story";
export const LINKS = { call: "ceoturbo.com/brand-boost", pricing: "ceoturbo.com/pricing" };

export const DESCRIPTION = (chapters) => `Why does your business need a website? Meet Marcus. He's great at detailing cars, he has $43 in the bank, and nobody can find him online. This is what changed when he finally got a real website, showed up on Google, Maps and AI answers, and turned on ads.

Marcus is a made-up character. Every step in his story is a real service we do for local businesses.

📅 Book a free 30-minute call (you keep the plan whether or not you hire us): https://${LINKS.call}
💵 See prices, including Turbo Launch, the whole package: https://${LINKS.pricing}

Chapters
${chapters.join("\n")}

$4.31 per lead is a real Meta Ads result for a CEO Turbo client (computer repair, Jul–Aug 2026): https://ceoturbo.com/results
Marcus's bookings, prices and balances are illustrative. Results depend on your business and your market. Search rankings depend on Google and aren't guaranteed.

#smallbusiness #website #webdesign #localseo #googlebusinessprofile #facebookads #entrepreneur`;

const T = (n) => n.toFixed(3);
const who = (id, mood, w, elId) => `<div class="who" id="${elId}" style="width:${w}px;height:${w * 2.25}px">${person(id, mood)}</div>`;
const mood = (c, sel, m, t) => c.js(`tl.set("${c.q(sel)} [class^='m-']", { opacity: 0 }, ${T(t)}); tl.set("${c.q(sel)} .m-${m}", { opacity: 1 }, ${T(t)});`);
const talk = (c, sel, t, d) => c.js(`tl.to("${c.q(sel)} .talk", { opacity: 1, duration: 0.09, yoyo: true, repeat: ${2 * Math.floor(d / 0.18) + 1}, ease: "steps(1)" }, ${T(t)});`);
const MARCUS = "extra4";
const marcus = (m = "smile", w = 260, id = "@marcus") => who(MARCUS, m, w, id);

/** Marcus's van. */
const van = (id, extra = "") => `<div class="ws-van h" id="${id}" ${extra}><svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 70q0-40 40-40h300q30 0 50 20l90 80q20 18 20 44v56q0 20-20 20H50q-20 0-20-20z" fill="#f8fafc"/>
  <path d="M390 60l78 70H390z" fill="#93c5fd"/><rect x="70" y="60" width="290" height="70" rx="12" fill="#e2e8f0"/>
  <rect x="30" y="170" width="500" height="22" fill="#ff6a1f"/>
  <text x="80" y="108" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="38" fill="#0b1220">MARCUS</text>
  <text x="80" y="160" font-family="Inter, sans-serif" font-weight="800" font-size="22" fill="#1a73e8">MOBILE DETAILING</text>
  <circle cx="140" cy="240" r="38" fill="#111827"/><circle cx="140" cy="240" r="16" fill="#9ca3af"/>
  <circle cx="440" cy="240" r="38" fill="#111827"/><circle cx="440" cy="240" r="16" fill="#9ca3af"/>
</svg></div>`;
const phone = (id, screen, extra = "") => `<div class="ws-phone h" id="${id}" ${extra}><div class="notch"></div><div class="scr">${screen}</div></div>`;
const browser = (id, url, body, extra = "") => `<div class="ws-br h" id="${id}" ${extra}><div class="chrome"><i></i><i></i><i></i><div class="url">${url}</div></div><div class="page">${body}</div></div>`;
const res = (name, rt, cls = "", id = "") => `<div class="ws-res ${cls}"${id ? ` id="${id}"` : ""}><div class="pin">${cls.includes("you") ? "🚐" : cls.includes("miss") ? "❓" : "📍"}</div><div><b>${name}</b><small>${rt}</small></div>${cls.includes("you") ? `<div class="call">Book</div>` : ""}</div>`;
const search = (id, q, rows, extra = "") => `<div class="ws-search h" id="${id}" ${extra}><div class="sbar">🔍 <span>${q}</span></div><div class="tabs"><b>All</b><span>Maps</span><span>Reviews</span></div><div class="rows">${rows}</div></div>`;
const rows3 = res("Shine Pro Detailing", "★ 4.8 (231) · Open now") + res("Bay Auto Spa", "★ 4.7 (164) · Open now") + res("Elite Mobile Wash", "★ 4.6 (97) · Closes 6 PM");

export const CSS = `
.ws-van { position: absolute; width: 560px; height: 280px; } .ws-van svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 30px 40px rgba(0,0,0,.5)); }
.ws-phone { position: absolute; width: 360px; height: 720px; border-radius: 56px; background: #05070c; border: 12px solid #273142; box-shadow: 0 50px 100px rgba(0,0,0,.6); overflow: hidden; }
.ws-phone .notch { position: absolute; left: 50%; top: 12px; width: 110px; height: 30px; margin-left: -55px; border-radius: 18px; background: #000; z-index: 5; }
.ws-phone .scr { position: absolute; inset: 0; padding: 70px 24px 24px; background: #0f172a; }
.bank { background: #fff; color: #0b1220; border-radius: 22px; height: 100%; padding: 30px 24px; }
.bank small { display: block; font-size: 22px; font-weight: 700; color: #64748b; } .bank .bal { margin-top: 10px; font-family: "Space Grotesk"; font-weight: 700; font-size: 60px; letter-spacing: -.04em; }
.bank .tx { margin-top: 26px; display: flex; justify-content: space-between; padding: 16px 0; border-top: 2px solid #eef2f6; font-size: 22px; font-weight: 700; } .bank .tx em { font-style: normal; color: #dc2626; }
.bank .tx.in em { color: #16a34a; }
.ws-cal { position: absolute; width: 470px; padding: 28px; border-radius: 30px; background: #fff; color: #0b1220; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.ws-cal .hd { display: flex; justify-content: space-between; font-family: "Space Grotesk"; font-weight: 700; font-size: 34px; }
.ws-cal .days { margin-top: 18px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.ws-cal .days i { height: 52px; border-radius: 10px; background: #eef2f6; font-style: normal; font-size: 18px; font-weight: 700; color: #64748b; display: flex; align-items: flex-start; justify-content: flex-end; padding: 4px 6px; }
.ws-cal .days i.due { background: #fee2e2; color: #dc2626; outline: 3px solid #dc2626; } .ws-cal .days i.bk { background: #1aa3ff; color: #fff; }
.ws-big { position: absolute; left: 0; right: 0; text-align: center; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.035em; text-transform: uppercase; line-height: .95; }
.ws-h { position: absolute; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
.ws-sub { position: absolute; font-size: 40px; font-weight: 600; color: #cbd5e1; line-height: 1.35; }
.ws-note { position: absolute; left: 0; right: 0; top: 26px; text-align: center; font-size: 22px; color: #7f8b9a; }
.ws-disc { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; top: 780px; padding: 16px 30px; border-radius: 18px; background: rgba(15,23,42,.9); border: 2px solid #334155; font-size: 30px; font-weight: 700; color: #e2e8f0; white-space: nowrap; }
.ws-node { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border-radius: 50%; background: #1e293b; border: 4px solid #334155; display: flex; align-items: center; justify-content: center; font-size: 64px; }
.ws-node.me { background: #ff6a1f; border-color: #ffb37f; width: 150px; height: 150px; margin: -75px 0 0 -75px; }
.ws-link { position: absolute; height: 6px; background: #60a5fa; transform-origin: 0 50%; border-radius: 3px; opacity: .7; }
.ws-bars { position: absolute; left: 1060px; top: 250px; width: 720px; height: 520px; display: flex; align-items: flex-end; gap: 22px; padding: 30px; border-radius: 34px; background: rgba(15,23,42,.9); border: 2px solid #334155; }
.ws-bars .b { flex: 1; border-radius: 12px 12px 4px 4px; background: linear-gradient(180deg, #60a5fa, #2563eb); transform-origin: 50% 100%; position: relative; }
.ws-bars .b span { position: absolute; left: 0; right: 0; bottom: -44px; text-align: center; font-size: 22px; font-weight: 700; color: #94a3b8; }
.ws-bars .ttl { position: absolute; left: 30px; top: 22px; font-size: 28px; font-weight: 800; color: #cbd5e1; }
.ws-search { position: absolute; overflow: hidden; width: 780px; border-radius: 36px; background: #fff; color: #101826; padding: 30px; box-shadow: 0 50px 140px rgba(0,0,0,.6); }
.ws-search .sbar { height: 84px; border-radius: 42px; border: 3px solid #dfe3e8; display: flex; align-items: center; gap: 16px; padding: 0 30px; font-size: 34px; font-weight: 600; }
.ws-search .tabs { display: flex; gap: 30px; margin: 20px 20px 10px; font-size: 22px; font-weight: 700; color: #6b7685; } .ws-search .tabs b { color: #1a73e8; }
.ws-search .rows { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
.ws-res { height: 118px; border-radius: 22px; background: #f4f6f8; display: flex; align-items: center; gap: 22px; padding: 0 24px; }
.ws-res .pin { width: 66px; height: 66px; border-radius: 18px; background: #dfe5ec; display: flex; align-items: center; justify-content: center; font-size: 36px; flex: none; }
.ws-res b { display: block; font-size: 30px; } .ws-res small { display: block; margin-top: 4px; font-size: 22px; font-weight: 600; color: #5b6676; }
.ws-res.miss { background: #fff; border: 4px dashed #e5484d; color: #c22f34; } .ws-res.miss small { color: #c22f34; }
.ws-res.you { background: #fff; border: 5px solid #ff6a1f; box-shadow: 0 16px 40px rgba(255,106,31,.3); } .ws-res.you .pin { background: linear-gradient(135deg, #ff8a3d, #ff5a0a); }
.ws-res .call { margin-left: auto; padding: 12px 24px; border-radius: 999px; background: #1a73e8; color: #fff; font-size: 22px; font-weight: 800; }
.ws-float { position: absolute; padding: 18px 30px; border-radius: 999px; background: rgba(255,255,255,.1); border: 2px solid rgba(255,255,255,.2); font-size: 34px; font-weight: 700; white-space: nowrap; }
.ws-social { position: absolute; width: 640px; border-radius: 34px; background: #fff; color: #101826; overflow: hidden; box-shadow: 0 50px 140px rgba(0,0,0,.6); }
.ws-social .cv { height: 170px; background: linear-gradient(135deg, #64748b, #334155); }
.ws-social .av { position: absolute; left: 34px; top: 110px; width: 120px; height: 120px; border-radius: 50%; border: 8px solid #fff; background: #ff6a1f; display: flex; align-items: center; justify-content: center; font-size: 60px; }
.ws-social .bd { padding: 74px 34px 30px; } .ws-social .nm { font-size: 38px; font-weight: 800; } .ws-social .mt { margin-top: 6px; font-size: 24px; color: #64748b; font-weight: 600; }
.ws-social .post { margin-top: 24px; height: 200px; border-radius: 18px; background: linear-gradient(90deg, #475569 50%, #1aa3ff 50%); position: relative; }
.ws-social .post span { position: absolute; bottom: 12px; padding: 4px 12px; border-radius: 8px; background: rgba(0,0,0,.6); color: #fff; font-size: 18px; font-weight: 800; }
.ws-social .lk { margin-top: 14px; font-size: 22px; color: #64748b; font-weight: 700; }
.ws-xs { position: absolute; display: flex; flex-direction: column; gap: 22px; }
.ws-x { display: flex; align-items: center; gap: 22px; padding: 22px 30px; border-radius: 24px; background: rgba(15,23,42,.92); border: 3px solid #ef4444; font-size: 40px; font-weight: 800; }
.ws-x b { width: 56px; height: 56px; border-radius: 50%; background: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 32px; flex: none; }
.ws-ok { border-color: #22c55e; } .ws-ok b { background: #22c55e; }
.ws-pad { position: absolute; width: 720px; padding: 40px 46px; border-radius: 10px; background: #fef9c3; color: #1f2937; transform: rotate(-2deg); box-shadow: 0 30px 70px rgba(0,0,0,.5); font-family: "Space Grotesk"; font-weight: 700; font-size: 42px; line-height: 1.5; }
.ws-pad .r { display: flex; justify-content: space-between; } .ws-pad .neg { color: #dc2626; border-top: 4px solid #1f2937; margin-top: 10px; padding-top: 10px; }
.ws-night { position: absolute; inset: 0; background: linear-gradient(180deg, #020617 0%, #0b1530 60%, #111827 60%); }
.ws-moon { position: absolute; left: 1580px; top: 110px; width: 130px; height: 130px; border-radius: 50%; background: #f8fafc; box-shadow: 0 0 80px rgba(248,250,252,.4); }
.ws-house { position: absolute; left: 1180px; top: 330px; width: 520px; height: 320px; background: #1e293b; border-radius: 8px; } .ws-house::before { content: ""; position: absolute; left: -30px; top: -150px; border-left: 290px solid transparent; border-right: 290px solid transparent; border-bottom: 150px solid #334155; }
.ws-house i { position: absolute; width: 90px; height: 90px; background: #fbbf24; opacity: .8; top: 70px; }
.ws-vc { position: absolute; left: 120px; top: 150px; width: 1060px; height: 660px; border-radius: 34px; background: #0f172a; border: 3px solid #334155; overflow: hidden; box-shadow: 0 50px 140px rgba(0,0,0,.6); }
.ws-vc .tile { position: absolute; top: 80px; width: 490px; height: 470px; border-radius: 26px; background: #1e293b; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
.ws-vc .tile span { position: absolute; left: 16px; bottom: 14px; padding: 6px 14px; border-radius: 10px; background: rgba(0,0,0,.6); font-size: 22px; font-weight: 700; }
.ws-vc .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 90px; display: flex; align-items: center; justify-content: center; gap: 24px; } .ws-vc .bar i { width: 60px; height: 60px; border-radius: 50%; background: #334155; } .ws-vc .bar i.end { background: #dc2626; }
.ws-vc .top { position: absolute; left: 30px; top: 24px; font-size: 26px; font-weight: 800; color: #cbd5e1; }
.ws-steps { position: absolute; left: 1250px; top: 200px; display: flex; flex-direction: column; gap: 28px; }
.ws-step { display: flex; align-items: center; gap: 24px; width: 580px; padding: 26px 30px; border-radius: 28px; background: rgba(15,23,42,.92); border: 3px solid #1aa3ff; font-family: "Space Grotesk"; font-weight: 700; font-size: 40px; }
.ws-step b { width: 70px; height: 70px; border-radius: 50%; background: #1aa3ff; display: flex; align-items: center; justify-content: center; font-size: 38px; flex: none; }
.ws-price { position: absolute; padding: 16px 28px; border-radius: 999px; background: #16a34a; font-weight: 800; font-size: 32px; white-space: nowrap; box-shadow: 0 20px 50px rgba(22,163,74,.4); }
.ws-br { position: absolute; border-radius: 26px; overflow: hidden; background: #fff; box-shadow: 0 50px 140px rgba(0,0,0,.6); }
.ws-br .chrome { height: 56px; background: #e6eaef; display: flex; align-items: center; gap: 12px; padding: 0 22px; }
.ws-br .chrome i { width: 16px; height: 16px; border-radius: 50%; } .ws-br .chrome i:nth-child(1) { background: #ff5f57; } .ws-br .chrome i:nth-child(2) { background: #febc2e; } .ws-br .chrome i:nth-child(3) { background: #28c840; }
.ws-br .url { margin-left: 18px; flex: 1; height: 34px; border-radius: 17px; background: #fff; color: #5b6676; font-size: 20px; font-weight: 600; display: flex; align-items: center; padding: 0 20px; }
.ws-br .page { position: absolute; left: 0; right: 0; top: 56px; bottom: 0; background: #070b11; color: #fff; overflow: hidden; }
.site .nav { height: 80px; display: flex; align-items: center; padding: 0 36px; gap: 30px; border-bottom: 2px solid rgba(255,255,255,.08); font-size: 22px; font-weight: 700; color: #9fb0c4; }
.site .nav .lg { font-family: "Space Grotesk"; font-size: 28px; color: #fff; margin-right: auto; } .site .nav .lg span { color: #ff6a1f; }
.site .nav .bk { padding: 12px 22px; border-radius: 999px; background: #ff6a1f; color: #fff; }
.site .hero { position: absolute; left: 40px; top: 110px; width: 520px; }
.site .hero h3 { font-family: "Space Grotesk"; font-size: 56px; line-height: 1; letter-spacing: -.03em; } .site .hero h3 span { color: #1aa3ff; }
.site .hero p { margin-top: 14px; font-size: 22px; color: #9fb0c4; }
.site .btns { margin-top: 22px; display: flex; gap: 14px; } .site .btns div { padding: 16px 24px; border-radius: 999px; font-size: 22px; font-weight: 800; background: #ff6a1f; } .site .btns div.alt { background: #1e293b; border: 2px solid #334155; }
.site .ba { position: absolute; left: 590px; top: 110px; width: 360px; height: 250px; border-radius: 22px; overflow: hidden; display: flex; }
.site .ba div { flex: 1; display: flex; align-items: flex-end; padding: 10px; font-size: 18px; font-weight: 800; } .site .ba .bf { background: #57534e; } .site .ba .af { background: linear-gradient(135deg, #38bdf8, #1d4ed8); }
.site .prices { position: absolute; left: 40px; top: 400px; right: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.site .prices div { padding: 18px; border-radius: 18px; background: rgba(255,255,255,.06); border: 2px solid rgba(255,255,255,.1); font-size: 20px; font-weight: 700; color: #cbd5e1; } .site .prices b { display: block; font-family: "Space Grotesk"; font-size: 40px; color: #fff; }
.site .revs { position: absolute; left: 40px; right: 40px; top: 540px; display: flex; gap: 16px; } .site .revs div { flex: 1; padding: 16px; border-radius: 16px; background: rgba(255,255,255,.06); color: #fbbc04; font-size: 22px; } .site .revs div i { display: block; height: 10px; margin-top: 10px; border-radius: 5px; background: rgba(255,255,255,.18); }
.ws-callout { position: absolute; display: flex; align-items: center; gap: 18px; padding: 18px 26px; border-radius: 22px; background: #fff; color: #0b1220; font-size: 32px; font-weight: 800; box-shadow: 0 20px 50px rgba(0,0,0,.5); white-space: nowrap; }
.ws-callout b { width: 54px; height: 54px; border-radius: 50%; background: #ff6a1f; color: #fff; display: flex; align-items: center; justify-content: center; font-family: "Space Grotesk"; font-size: 30px; flex: none; }
.ws-prof { position: absolute; width: 560px; border-radius: 36px; background: #fff; color: #101826; overflow: hidden; box-shadow: 0 0 120px rgba(26,163,255,.35), 0 50px 140px rgba(0,0,0,.6); }
.ws-prof .cv { height: 160px; background: linear-gradient(135deg, #1a73e8, #1aa3ff); }
.ws-prof .lg { position: absolute; left: 34px; top: 100px; width: 120px; height: 120px; border-radius: 30px; background: linear-gradient(135deg, #ff8a3d, #ff5a0a); border: 8px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 58px; }
.ws-prof .bd { padding: 76px 34px 34px; } .ws-prof .nm { font-family: "Space Grotesk"; font-size: 44px; font-weight: 700; letter-spacing: -.02em; }
.ws-prof .rt { margin-top: 8px; font-size: 26px; font-weight: 700; color: #5b6676; } .ws-prof .rt span { color: #e8a200; } .ws-prof .ct { margin-top: 6px; font-size: 24px; font-weight: 600; color: #5b6676; } .ws-prof .ct b { color: #0c8a4a; }
.ws-prof .bt { margin-top: 26px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; } .ws-prof .bt div { height: 96px; border-radius: 20px; background: #eef4fe; color: #1a73e8; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; } .ws-prof .bt div span { font-size: 34px; } .ws-prof .bt .bk { background: #ff6a1f; color: #fff; }
.ws-chip { position: absolute; display: flex; align-items: center; gap: 16px; padding: 20px 28px; border-radius: 22px; background: rgba(13,20,28,.95); border: 3px solid #22c55e; font-size: 30px; font-weight: 800; white-space: nowrap; }
.ws-chip b { width: 46px; height: 46px; border-radius: 50%; background: #22c55e; color: #062014; display: flex; align-items: center; justify-content: center; font-size: 26px; flex: none; }
.ws-plat { position: absolute; padding: 20px 32px; border-radius: 999px; background: #fff; color: #101826; font-size: 34px; font-weight: 800; box-shadow: 0 20px 50px rgba(0,0,0,.5); white-space: nowrap; }
.ws-plat i { display: inline-block; width: 20px; height: 20px; border-radius: 50%; margin-right: 12px; vertical-align: 2px; }
.ws-hub { position: absolute; width: 280px; height: 280px; margin: -140px 0 0 -140px; border-radius: 56px; background: linear-gradient(160deg, #ff8a3d, #ff5a0a); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 140px rgba(255,106,31,.55); }
.ws-hub span { font-size: 110px; line-height: 1; } .ws-hub b { margin-top: 8px; font-family: "Space Grotesk"; font-size: 30px; text-transform: uppercase; }
.ws-beam { position: absolute; left: 0; top: 0; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: #fff; box-shadow: 0 0 22px 8px rgba(26,163,255,.9); opacity: 0; }
.ws-stat { position: absolute; padding: 34px 44px; border-radius: 34px; background: rgba(15,23,42,.94); border: 3px solid #fbbc04; }
.ws-stat b { display: block; font-family: "Space Grotesk"; font-size: 150px; line-height: 1; color: #fbbc04; letter-spacing: -.04em; } .ws-stat span { display: block; margin-top: 8px; font-size: 30px; font-weight: 700; color: #cbd5e1; } .ws-stat small { display: block; margin-top: 12px; font-size: 22px; color: #7f8b9a; font-weight: 600; }
.ws-notif { position: absolute; width: 620px; padding: 26px 30px; border-radius: 30px; background: rgba(248,250,252,.97); color: #0b1220; display: flex; gap: 22px; align-items: center; box-shadow: 0 30px 80px rgba(0,0,0,.6); }
.ws-notif .ic { width: 80px; height: 80px; border-radius: 22px; background: #22c55e; display: flex; align-items: center; justify-content: center; font-size: 44px; flex: none; }
.ws-notif b { display: block; font-size: 30px; } .ws-notif small { display: block; margin-top: 4px; font-size: 24px; color: #475569; font-weight: 600; }
.ws-tl { position: absolute; left: 140px; right: 140px; top: 210px; height: 8px; border-radius: 4px; background: #334155; }
.ws-tl .fill { position: absolute; inset: 0; border-radius: 4px; background: linear-gradient(90deg, #1aa3ff, #22c55e); transform-origin: 0 50%; }
.ws-ms { position: absolute; top: 160px; width: 300px; margin-left: -150px; text-align: center; }
.ws-ms .dt { width: 46px; height: 46px; margin: 26px auto 0; border-radius: 50%; background: #22c55e; border: 8px solid #0b1220; }
.ws-ms b { display: block; margin-top: 18px; font-family: "Space Grotesk"; font-size: 36px; } .ws-ms span { display: block; margin-top: 8px; font-size: 26px; font-weight: 600; color: #cbd5e1; }
.ws-ms .ic { margin-top: 18px; font-size: 90px; }
.ws-five { position: absolute; left: 110px; right: 110px; top: 200px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
.ws-five .r { padding: 36px 26px; border-radius: 34px; background: rgba(15,23,42,.92); border: 3px solid #334155; text-align: center; height: 560px; }
.ws-five .r.on { border-color: #ff6a1f; box-shadow: 0 0 70px rgba(255,106,31,.35); }
.ws-five .n { width: 96px; height: 96px; margin: 0 auto; border-radius: 50%; background: #ff6a1f; display: flex; align-items: center; justify-content: center; font-family: "Space Grotesk"; font-size: 54px; font-weight: 700; }
.ws-five .ic { margin-top: 26px; font-size: 96px; } .ws-five b { display: block; margin-top: 22px; font-family: "Space Grotesk"; font-size: 40px; line-height: 1.05; letter-spacing: -.02em; } .ws-five span { display: block; margin-top: 14px; font-size: 24px; font-weight: 600; color: #94a3b8; line-height: 1.35; }
.ws-offer { position: absolute; left: 1060px; top: 120px; width: 740px; padding: 50px; border-radius: 44px; background: linear-gradient(160deg, #10263f, #08121f); border: 4px solid #1aa3ff; box-shadow: 0 0 90px rgba(26,163,255,.3); }
.ws-offer .k { font-size: 32px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #9fb0c4; } .ws-offer .p { margin-top: 8px; font-family: "Space Grotesk"; font-size: 170px; font-weight: 700; letter-spacing: -.05em; line-height: 1; } .ws-offer .o { font-size: 32px; font-weight: 700; color: #cbd5e1; }
.ws-offer .x { margin-top: 22px; font-size: 30px; font-weight: 600; line-height: 1.6; color: #cbd5e1; } .ws-offer .x b { color: #22c55e; margin-right: 10px; }
.ws-cta { position: absolute; padding: 30px 54px; border-radius: 999px; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); font-family: "Space Grotesk"; font-weight: 700; font-size: 60px; box-shadow: 0 30px 80px rgba(255,90,10,.45); white-space: nowrap; }
.ws-logo { position: absolute; height: 190px; }
.ws-sun { position: absolute; left: 1500px; top: 90px; width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(circle, #fde68a, #f59e0b); box-shadow: 0 0 120px rgba(251,191,36,.6); }
`;

export const SCENES = [
  // ───────── 1. Cold open ─────────
  {
    id: "open", chapter: "$43 in the bank", music: "soft",
    lines: [
      "This is Marcus.",
      "Marcus is really good at one thing: making dirty cars look brand new.",
      { t: "But one Tuesday morning, Marcus opened his bank app, and he had forty-three dollars.", say: "But one Tuesday morning, Marcus opened his bank app... and he had forty-three dollars." },
      "His van payment was due on Friday.",
      "This is the story of how one website changed everything for him.",
      { t: "Marcus is a made-up character. But every step in his story is real, and it can work for your business too.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@marcus", a.start, { x: -100, y: 0 });
      c.in("@name", a.start + 0.3, { y: 20 });
      c.in("@van", b.start, { x: 400, y: 0, d: 0.9 });
      c.js(`tl.fromTo("${c.q("@shine")}", { autoAlpha: 0, scale: 0.3, rotation: 0 }, { autoAlpha: 1, scale: 1, rotation: 90, duration: 0.6, ease: "back.out(2)" }, ${T(b.start + b.dur * 0.6)}); tl.to("${c.q("@shine")}", { autoAlpha: 0, duration: 0.4 }, ${T(b.end + 0.3)});`);
      c.sfx("ding", b.start + b.dur * 0.6);
      mood(c, "@marcus", "grin", b.start + 0.4);
      c.to("@van, @name", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.to("@marcus", { x: -60, duration: 0.6, ease: "power2.inOut" }, d.start - 0.1);
      c.in("@bank", d.start + 0.2, { y: 300, d: 0.6 });
      c.js(`const bal${c.id("x").replace(/-/g, "_")} = { v: 1240 }; tl.fromTo(bal${c.id("x").replace(/-/g, "_")}, { v: 1240 }, { v: 43.27, duration: 1.4, ease: "power2.in", onUpdate: () => { document.getElementById("${c.id("bal")}").textContent = "$" + bal${c.id("x").replace(/-/g, "_")}.v.toFixed(2); } }, ${T(d.start + d.dur * 0.55)});`);
      c.sfx("thud", d.start + d.dur * 0.55 + 1.4);
      mood(c, "@marcus", "shock", d.start + d.dur * 0.55 + 1.4);
      c.in("@cal", e.start, { x: 200, y: 0 });
      c.js(`tl.fromTo("${c.q("@due")}", { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 3 }, ${T(e.start + 0.6)});`);
      mood(c, "@marcus", "sad", e.start + 0.4);
      c.sfx("buzz", e.start + 0.6);
      c.to("@bank, @cal", { autoAlpha: 0, scale: 0.9, duration: 0.4 }, f.start - 0.1);
      c.to("@marcus", { x: 0, duration: 0.6 }, f.start);
      c.in("@title", f.start + 0.2, { y: 40 });
      mood(c, "@marcus", "smile", f.start + 0.5);
      c.in("@disc", g.start, { y: 20 });
      return `${van("@van", `style="left:1140px;top:560px"`)}
      <div class="pos h" id="@shine" style="left:1560px;top:520px;font-size:120px">✨</div>
      <div class="pos h" id="@marcus" style="left:640px;top:250px">${marcus("smile", 270, "@m")}</div>
      <div class="ws-h h" id="@name" style="left:150px;top:200px;font-size:110px">Marcus<br /><span class="o" style="font-size:54px">Mobile car detailer</span></div>
      ${phone("@bank", `<div class="bank"><small>Checking ••• 4821</small><div class="bal" id="@bal">$1,240.00</div><div class="tx"><span>Gas</span><em>−$62.10</em></div><div class="tx"><span>Supplies</span><em>−$118.45</em></div><div class="tx"><span>Insurance</span><em>−$214.00</em></div><div class="tx in"><span>Detail · Jen R.</span><em>+$120.00</em></div></div>`, `style="left:1060px;top:170px"`)}
      <div class="ws-cal h" id="@cal" style="left:1450px;top:260px;width:430px"><div class="hd"><span>This week</span><span>💸</span></div><div class="days">${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => `<i${i === 4 ? ` class="due" id="@due"` : ""}>${i === 4 ? "VAN" : d}</i>`).join("")}</div><div style="margin-top:16px;font-size:26px;font-weight:800;color:#dc2626">Van payment due Friday</div></div>
      <div class="ws-h h" id="@title" style="left:150px;top:260px;width:560px;font-size:76px">One website<br /><span class="g">changed<br />everything.</span></div>
      <div class="ws-disc h" id="@disc">Marcus is fictional. Every step in his story is real.</div>`;
    },
  },
  // ───────── 2. Title ─────────
  {
    id: "title", chapter: "Why your business needs a website", music: "soft", lead: 0.2,
    lines: [
      "Why your business needs a website.",
      { t: "And what happened when Marcus finally got one.", gap: 1.0 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@l1", a.start, { y: 60 });
      c.sfx("whoosh", a.start);
      c.in("@l2", b.start, { y: 40 });
      c.in("@van", b.start + 0.2, { x: -900, y: 0, d: 1.2, ease: "power3.out" });
      c.sfx("whoosh", b.start + 0.2);
      return `<div class="ws-big h" id="@l1" style="top:200px;font-size:140px">Why your business<br /><span class="o">needs a website</span></div>
      <div class="ws-sub h" id="@l2" style="left:0;right:0;top:560px;text-align:center;font-size:44px">…and what happened when Marcus finally got one.</div>
      ${van("@van", `style="left:680px;top:620px"`)}`;
    },
  },
  // ───────── 3. Word of mouth ─────────
  {
    id: "wom", chapter: "Word of mouth isn't enough", music: "soft",
    lines: [
      "Marcus had been detailing cars for three years.",
      "Every customer he had came from word of mouth. A friend of a friend. A neighbor. A guy from church.",
      "His customers loved him. They told him he was the best they'd ever used.",
      "But word of mouth is slow. And you can't turn it up when the bills are due.",
      { t: "Some weeks his phone rang five times. Some weeks it didn't ring at all.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      const nodes = [[460, 520], [250, 330], [700, 330], [230, 720], [700, 730], [460, 880], [120, 520]];
      c.pop("@n0", a.start + 0.4);
      nodes.slice(1).forEach((_, i) => {
        c.js(`tl.fromTo("${c.q(`@ln${i + 1}`)}", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, ${T(b.start + 0.3 + i * 0.7)});`);
        c.pop(`@n${i + 1}`, b.start + 0.7 + i * 0.7);
        c.sfx("pop", b.start + 0.7 + i * 0.7);
      });
      [1, 2, 3].forEach((i) => c.pop(`@h${i}`, d.start + d.dur * (0.2 + i * 0.18)));
      c.in("@bars", e.start, { x: 200, y: 0 });
      const H = [70, 15, 55, 0, 85, 10, 40, 0];
      H.forEach((h, i) => c.js(`tl.fromTo("${c.q(`@b${i}`)}", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "back.out(1.6)" }, ${T(e.start + 0.5 + i * 0.15)});`));
      c.js(`tl.fromTo("${c.q("@bars")} .b", { filter: "brightness(1)" }, { filter: "brightness(1.4)", duration: 0.2, yoyo: true, repeat: 3, stagger: 0.05 }, ${T(f.start + 0.3)});`);
      c.in("@zero", f.start + f.dur * 0.55, { scale: 0.6 });
      c.sfx("thud", f.start + f.dur * 0.55);
      const links = nodes.slice(1).map(([x, y], i) => {
        const [x0, y0] = nodes[0];
        const L = Math.hypot(x - x0, y - y0), ang = (Math.atan2(y - y0, x - x0) * 180) / Math.PI;
        return `<div class="ws-link" id="@ln${i + 1}" style="left:${x0}px;top:${y0}px;width:${L}px;transform:rotate(${ang}deg)"></div>`;
      }).join("");
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Three years of word of mouth</div>
      ${links}
      ${nodes.map(([x, y], i) => `<div class="ws-node h${i === 0 ? " me" : ""}" id="@n${i}" style="left:${x}px;top:${y}px">${["🚐", "👩", "👨", "👵", "🧔", "👩‍🦱", "👨‍🦳"][i]}</div>`).join("")}
      ${[1, 2, 3].map((i) => `<div class="pos h" id="@h${i}" style="left:${[0, 300, 760, 260][i]}px;top:${[0, 240, 240, 640][i]}px;font-size:60px">⭐️</div>`).join("")}
      <div class="ws-bars h" id="@bars"><div class="ttl">Calls per week</div>${H.map((h, i) => `<div class="b" id="@b${i}" style="height:${Math.max(h, 1.5)}%"><span>W${i + 1}</span></div>`).join("")}</div>
      <div class="pos h" id="@zero" style="left:1500px;top:180px;padding:14px 26px;border-radius:999px;background:#ef4444;font-weight:800;font-size:34px">0 calls 😬</div>`;
    },
  },
  // ───────── 4. Invisible ─────────
  {
    id: "invisible", chapter: "The search he never showed up in", music: "pulse",
    lines: [
      "Here's what Marcus couldn't see.",
      "Every single day, people in his own town were searching for exactly what he does.",
      { t: "Car detailing near me. Mobile detailing. Interior cleaning.", say: "Car detailing near me... Mobile detailing... Interior cleaning." },
      "They typed it into Google. They opened Maps. Some of them even asked ChatGPT.",
      "And Marcus wasn't anywhere on the page.",
      { t: "Those people didn't know he existed. So they called someone else.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@k", a.start);
      c.in("@marcus", a.start + 0.2, { x: -100, y: 0 });
      mood(c, "@marcus", "neutral", a.start);
      const qs = ["car detailing near me", "mobile detailing", "interior cleaning", "detail my car today", "ceramic coating near me", "who can clean my car"];
      qs.forEach((_, i) => {
        c.in(`@q${i}`, b.start + 0.4 + i * 0.35, { y: 30 });
        c.js(`tl.to("${c.q(`@q${i}`)}", { y: -30, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1 }, ${T(b.start + 0.8 + i * 0.35)});`);
      });
      c.to(".ws-float", { autoAlpha: 0, duration: 0.4 }, e.start - 0.2);
      c.in("@srch", e.start - 0.1, { y: 300, d: 0.6 });
      c.in("@p0", e.start + e.dur * 0.3, { scale: 0.7 });
      c.in("@p1", e.start + e.dur * 0.5, { scale: 0.7 });
      c.in("@p2", e.start + e.dur * 0.7, { scale: 0.7 });
      c.in("@miss", f.start + 0.2, { y: 30 });
      c.sfx("buzz", f.start + 0.4);
      mood(c, "@marcus", "sad", f.start + 0.4);
      c.js(`tl.fromTo("${c.q("@miss")}", { x: 0 }, { x: 14, duration: 0.06, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, ${T(f.start + 0.5)});`);
      c.in("@else", g.start + g.dur * 0.55, { scale: 0.7 });
      c.sfx("ring", g.start + g.dur * 0.6);
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">What Marcus couldn't see</div>
      <div class="pos h" id="@marcus" style="left:150px;top:260px">${marcus("neutral", 250, "@m")}</div>
      ${qs.map((q, i) => `<div class="ws-float h" id="@q${i}" style="left:${[620, 1180, 760, 1300, 640, 1100][i]}px;top:${[220, 300, 480, 560, 740, 820][i]}px">🔍 ${q}</div>`).join("")}
      ${search("@srch", "car detailing near me", rows3 + res("Marcus Mobile Detailing", "Not found", "miss", "@miss"), `style="left:620px;top:120px"`)}
      <div class="pos h" id="@p0" style="left:1450px;top:200px;padding:16px 28px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:32px">🔍 Google</div>
      <div class="pos h" id="@p1" style="left:1470px;top:320px;padding:16px 28px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:32px">🗺️ Maps</div>
      <div class="pos h" id="@p2" style="left:1460px;top:440px;padding:16px 28px;border-radius:999px;background:#fff;color:#0b1220;font-weight:800;font-size:32px">🤖 ChatGPT</div>
      <div class="pos h" id="@else" style="left:1440px;top:640px;padding:22px 32px;border-radius:26px;background:#16a34a;font-weight:800;font-size:34px;box-shadow:0 20px 50px rgba(22,163,74,.4)">📞 Calling<br />Shine Pro…</div>
      <div class="ws-note">Illustrative example. Business names are made up.</div>`;
    },
  },
  // ───────── 5. The Facebook page ─────────
  {
    id: "facebook", chapter: "“But I have a Facebook page”", music: "soft",
    lines: [
      "Now, Marcus did have a Facebook page.",
      "He posted before and after photos when he remembered. Mostly his friends and family liked them.",
      "But a Facebook page doesn't show up when a stranger searches Google for a detailer.",
      "It doesn't show his prices. It doesn't let someone book at eleven o'clock at night.",
      { t: "And when someone does find it, there's no clear next step. So they scroll right past.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@soc", a.start, { y: 200, d: 0.6 });
      c.in("@post", b.start + 0.3, { y: 20 });
      c.in("@lk", b.start + b.dur * 0.6, { y: 10 });
      c.in("@x0", d.start + d.dur * 0.3, { x: 60, y: 0 });
      c.sfx("thud", d.start + d.dur * 0.3);
      c.in("@x1", e.start + 0.3, { x: 60, y: 0 });
      c.sfx("thud", e.start + 0.3);
      c.in("@x2", e.start + e.dur * 0.6, { x: 60, y: 0 });
      c.sfx("thud", e.start + e.dur * 0.6);
      c.in("@x3", f.start + f.dur * 0.25, { x: 60, y: 0 });
      c.sfx("thud", f.start + f.dur * 0.25);
      c.js(`tl.to("${c.q("@soc")}", { y: -900, duration: 0.9, ease: "power2.in" }, ${T(f.start + f.dur * 0.7)});`);
      c.sfx("whoosh", f.start + f.dur * 0.7);
      return `<div class="ws-social h" id="@soc" style="left:180px;top:150px"><div class="cv"></div><div class="av">🚐</div><div class="bd"><div class="nm">Marcus Mobile Detailing</div><div class="mt">Car service · 38 followers</div><div class="post h" id="@post"><span style="left:12px">BEFORE</span><span style="right:12px">AFTER</span></div><div class="lk h" id="@lk">👍 Mom, Aunt Dee and 4 others</div></div></div>
      <div class="ws-xs" style="left:1000px;top:220px">
        <div class="ws-x h" id="@x0"><b>✕</b>Not on Google search</div>
        <div class="ws-x h" id="@x1"><b>✕</b>No prices</div>
        <div class="ws-x h" id="@x2"><b>✕</b>Can't book at 11 PM</div>
        <div class="ws-x h" id="@x3"><b>✕</b>No clear next step</div>
      </div>`;
    },
  },
  // ───────── 6. Rock bottom ─────────
  {
    id: "bottom", chapter: "Rock bottom", music: "soft",
    lines: [
      "That Friday, Marcus made the van payment. Barely.",
      "Then he sat in his driveway and did the math.",
      "If nothing changed, he'd have to sell the van and go back to working for somebody else.",
      { t: "So that night, instead of scrolling, he searched for something new. How do I get more customers?", say: "So that night, instead of scrolling, he searched for something new... How do I get more customers?", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@night", c.S, { y: 0, d: 1 });
      c.in("@van", c.S + 0.3, { y: 0 });
      c.in("@marcus", a.start, { y: 0 });
      mood(c, "@marcus", "sad", a.start);
      c.in("@pad", b.start + 0.3, { y: 200 });
      c.in("@r0", b.start + 0.8, { x: -20, y: 0 });
      c.in("@r1", b.start + 1.2, { x: -20, y: 0 });
      c.in("@r2", b.start + 1.6, { x: -20, y: 0 });
      c.in("@neg", d.start + 0.2, { scale: 1.3 });
      c.sfx("thud", d.start + 0.2);
      c.in("@sale", d.start + d.dur * 0.55, { scale: 0.5 });
      c.to("@pad, @sale", { autoAlpha: 0, duration: 0.4 }, e.start - 0.1);
      c.in("@ph", e.start + 0.2, { y: 300 });
      mood(c, "@marcus", "neutral", e.start + e.dur * 0.5);
      c.js(`const q${c.id("x").replace(/-/g, "_")} = { n: 0 }, Q${c.id("x").replace(/-/g, "_")} = "how do I get more customers?"; tl.fromTo(q${c.id("x").replace(/-/g, "_")}, { n: 0 }, { n: Q${c.id("x").replace(/-/g, "_")}.length, duration: 1.6, ease: "none", onUpdate: () => { document.getElementById("${c.id("typed")}").textContent = Q${c.id("x").replace(/-/g, "_")}.slice(0, Math.round(q${c.id("x").replace(/-/g, "_")}.n)); } }, ${T(e.start + e.dur * 0.55)});`);
      for (let k = 0; k < 10; k++) c.sfx("tap", e.start + e.dur * 0.55 + k * 0.16);
      return `<div class="ws-night h" id="@night"></div><div class="ws-moon"></div>
      <div class="ws-house"><i style="left:80px"></i><i style="left:350px"></i></div>
      ${van("@van", `style="left:1100px;top:650px;filter:brightness(.6)"`)}
      <div class="pos h" id="@marcus" style="left:860px;top:420px">${marcus("sad", 220, "@m")}</div>
      <div class="ws-pad h" id="@pad" style="left:130px;top:200px"><div class="r h" id="@r0"><span>Coming in</span><span>$1,900</span></div><div class="r h" id="@r1"><span>Van + insurance</span><span>−$890</span></div><div class="r h" id="@r2"><span>Rent, gas, supplies</span><span>−$1,460</span></div><div class="r neg h" id="@neg"><span>Left over</span><span>−$450</span></div></div>
      <div class="pos h" id="@sale" style="left:1200px;top:560px;padding:12px 28px;background:#dc2626;border-radius:10px;font-weight:900;font-size:48px;transform:rotate(-6deg)">FOR SALE?</div>
      ${phone("@ph", `<div class="bank" style="padding:30px 20px"><div style="font-size:24px;font-weight:700;color:#64748b">Search</div><div style="margin-top:16px;padding:18px 20px;border-radius:999px;border:3px solid #1a73e8;font-size:24px;font-weight:600;min-height:70px"><span id="@typed"></span><span style="display:inline-block;width:3px;height:26px;background:#1a73e8;vertical-align:middle"></span></div></div>`, `style="left:200px;top:180px"`)}
      <div class="ws-note">Marcus's numbers are illustrative.</div>`;
    },
  },
  // ───────── 7. The free call ─────────
  {
    id: "call", chapter: "The free call", music: "pulse",
    lines: [
      { t: "That's how he found CEO Turbo, and booked a free thirty-minute call.", say: "That's how he found C.E.O. Turbo... and booked a free, thirty-minute call." },
      "On the call, we looked at exactly what a customer sees when they search for him.",
      "No website. No Google Business Profile. A Facebook page with no way to book.",
      "Then we gave him a simple plan, with fixed prices, and no contract.",
      { t: "Step one: build a real website. Step two: get found on Google. Step three: turn on ads.", say: "Step one: build a real website. Step two: get found on Google. Step three: turn on ads.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@vc", a.start + 0.2, { scale: 0.85 });
      c.sfx("chime", a.start + 0.4);
      talk(c, "@mm", b.start, b.dur * 0.3);
      c.in("@x0", d.start + 0.1, { x: 60, y: 0 }); c.sfx("thud", d.start + 0.1);
      c.in("@x1", d.start + d.dur * 0.35, { x: 60, y: 0 }); c.sfx("thud", d.start + d.dur * 0.35);
      c.in("@x2", d.start + d.dur * 0.7, { x: 60, y: 0 }); c.sfx("thud", d.start + d.dur * 0.7);
      c.to("@xs", { autoAlpha: 0, duration: 0.3 }, e.start + e.dur * 0.5);
      c.in("@plan", e.start + e.dur * 0.3, { scale: 0.6 });
      mood(c, "@mm", "smile", e.start);
      c.in("@s0", f.start + 0.2, { x: 80, y: 0 }); c.sfx("pop", f.start + 0.2);
      c.in("@s1", f.start + f.dur * 0.36, { x: 80, y: 0 }); c.sfx("pop", f.start + f.dur * 0.36);
      c.in("@s2", f.start + f.dur * 0.7, { x: 80, y: 0 }); c.sfx("pop", f.start + f.dur * 0.7);
      mood(c, "@mm", "grin", f.end - 0.4);
      return `<div class="ws-vc h" id="@vc"><div class="top">Free 30-minute call · CEO Turbo</div>
        <div class="tile" style="left:30px"><div style="width:220px;height:495px;margin-bottom:-120px">${person(MARCUS, "neutral").replace("<svg", `<svg id="${c.id("mm")}"`)}</div><span>Marcus</span></div>
        <div class="tile" style="left:540px;background:#14233d"><img src="assets/img/logo.png" style="width:300px;margin-bottom:150px" /><span>CEO Turbo</span></div>
        <div class="bar"><i></i><i></i><i class="end"></i></div>
      </div>
      <div class="ws-xs" id="@xs" style="left:1250px;top:220px">
        <div class="ws-x h" id="@x0"><b>✕</b>No website</div>
        <div class="ws-x h" id="@x1"><b>✕</b>No Google profile</div>
        <div class="ws-x h" id="@x2"><b>✕</b>No way to book</div>
      </div>
      <div class="pos h" id="@plan" style="left:1250px;top:110px;padding:14px 28px;border-radius:999px;background:#16a34a;font-weight:800;font-size:32px">✓ Fixed prices · No contract</div>
      <div class="ws-steps" style="top:240px">
        <div class="ws-step h" id="@s0"><b>1</b>Build a real website</div>
        <div class="ws-step h" id="@s1"><b>2</b>Get found on Google</div>
        <div class="ws-step h" id="@s2"><b>3</b>Turn on ads</div>
      </div>`;
    },
  },
  // ───────── 8. The website ─────────
  {
    id: "website", chapter: "What a money-making website looks like", music: "pulse",
    lines: [
      "Here's what a website that actually brings in customers looks like.",
      "First, it loads fast on a phone, because that's where most people will see it.",
      "Second, it says exactly what you do, and where, in the first second. Mobile car detailing. We come to you.",
      "Third, it shows real prices. A lot of people won't call if they're scared of the price.",
      "Fourth, it shows proof. Before and after photos, and real reviews from real customers.",
      "And fifth, one big button. Book now. Tap to call. Tap to text.",
      { t: "Every part of the page has one job: turn a visitor into a booked job.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g, h] = c.L;
      c.in("@br", a.start + 0.2, { y: 400, d: 0.7 });
      c.sfx("whoosh", a.start + 0.2);
      c.in("@nav", a.start + 0.9, { y: -40 });
      c.pop("@c1", b.start + 0.3); c.sfx("pop", b.start + 0.3);
      c.js(`tl.fromTo("${c.q("@speed")}", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, ${T(b.start + b.dur * 0.5)});`);
      c.in("@hero", d.start + 0.2, { x: -60, y: 0 });
      c.pop("@c2", d.start + 0.3); c.sfx("pop", d.start + 0.3);
      c.in("@prices", e.start + 0.4, { y: 40 });
      c.pop("@c3", e.start + 0.3); c.sfx("pop", e.start + 0.3);
      c.in("@ba", f.start + 0.3, { scale: 0.7 });
      c.in("@revs", f.start + f.dur * 0.55, { y: 40 });
      c.pop("@c4", f.start + 0.3); c.sfx("pop", f.start + 0.3);
      c.in("@btns", g.start + 0.3, { scale: 0.6 });
      c.pop("@c5", g.start + 0.3); c.sfx("pop", g.start + 0.3);
      c.js(`tl.to("${c.q("@btns")} div", { scale: 1.12, duration: 0.25, yoyo: true, repeat: 5, stagger: 0.15 }, ${T(g.start + g.dur * 0.4)});`);
      c.to(".ws-callout", { autoAlpha: 0.35, duration: 0.4 }, h.start);
      c.js(`tl.to("${c.q("@br")}", { boxShadow: "0 0 160px rgba(255,106,31,.6), 0 50px 140px rgba(0,0,0,.6)", duration: 0.6 }, ${T(h.start + 0.3)});`);
      c.in("@job", h.start + h.dur * 0.6, { scale: 0.6 });
      c.sfx("ding", h.start + h.dur * 0.6);
      const co = (n, txt, x, y) => `<div class="ws-callout h" id="@c${n}" style="left:${x}px;top:${y}px"><b>${n}</b>${txt}</div>`;
      return browser("@br", "marcusdetailing.com", `<div class="site">
          <div class="nav h" id="@nav"><div class="lg">Marcus<span>Detailing</span></div><div>Services</div><div>Prices</div><div>Reviews</div><div class="bk">Book now</div></div>
          <div class="hero h" id="@hero"><h3>Mobile car detailing <span>in Tampa.</span></h3><p>We come to your home or work. Book in 60 seconds.</p></div>
          <div class="btns h" id="@btns" style="position:absolute;left:40px;top:300px"><div>📅 Book now</div><div class="alt">📞 Call</div><div class="alt">💬 Text</div></div>
          <div class="ba h" id="@ba"><div class="bf">BEFORE</div><div class="af">AFTER</div></div>
          <div class="prices h" id="@prices"><div>Interior<b>$129</b></div><div>Full detail<b>$199</b></div><div>Ceramic<b>$549</b></div></div>
          <div class="revs h" id="@revs"><div>★★★★★<i></i><i style="width:60%"></i></div><div>★★★★★<i></i><i style="width:70%"></i></div><div>★★★★★<i></i><i style="width:50%"></i></div></div>
        </div>`, `style="left:650px;top:130px;width:1000px;height:740px"`)
        + `<div class="pos h" id="@speed" style="left:1560px;top:80px;width:170px;height:170px;border-radius:50%;background:#fff;border:10px solid #22c55e;color:#0c8a4a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Space Grotesk';font-weight:700;font-size:52px;box-shadow:0 20px 50px rgba(0,0,0,.5)">Fast<small style="font-size:16px;color:#5b6676;font-family:Inter">ON PHONES</small></div>`
        + co(1, "Fast on phones", 110, 160) + co(2, "What + where, instantly", 110, 290) + co(3, "Real prices", 110, 420) + co(4, "Photos + reviews", 110, 550) + co(5, "One big button", 110, 680)
        + `<div class="pos h" id="@job" style="left:1240px;top:800px;padding:20px 34px;border-radius:999px;background:#ff6a1f;font-weight:800;font-size:38px;box-shadow:0 20px 60px rgba(255,106,31,.5)">Visitor → booked job</div>
        <div class="ws-note">Example site and prices for a made-up business.</div>`;
    },
  },
  // ───────── 9. Getting found ─────────
  {
    id: "found", chapter: "Getting found on Google, Maps and AI", music: "pulse",
    lines: [
      "But a website nobody visits is just a business card in a drawer.",
      "So next, we set up Marcus's Google Business Profile, with his service area, his hours, his photos, and a button to book.",
      "We connected his site to Google and Bing, so they could read every page.",
      "And we made his site easy for AI assistants, like ChatGPT, to read and understand too.",
      { t: "A few weeks later, when people nearby searched for a detailer, Marcus started to show up.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@drawer", a.start + 0.2, { y: 60 });
      c.js(`tl.to("${c.q("@drawer")}", { y: 300, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, ${T(a.end + 0.1)});`);
      c.in("@prof", b.start + 0.1, { scale: 0.6 });
      c.sfx("whoosh", b.start + 0.1);
      c.in("@pb", b.start + b.dur * 0.25, { y: 20 });
      ["@ch0", "@ch1", "@ch2"].forEach((s, i) => { c.in(s, b.start + b.dur * (0.3 + i * 0.2), { x: -80, y: 0 }); c.sfx("ding", b.start + b.dur * (0.3 + i * 0.2)); });
      c.in("@ch3", d.start + d.dur * 0.3, { x: 80, y: 0 }); c.sfx("ding", d.start + d.dur * 0.3);
      c.in("@ch4", d.start + d.dur * 0.6, { x: 80, y: 0 }); c.sfx("ding", d.start + d.dur * 0.6);
      c.in("@ch5", e.start + e.dur * 0.4, { x: 80, y: 0 }); c.sfx("ding", e.start + e.dur * 0.4);
      c.to("@prof, .ws-chip", { autoAlpha: 0, scale: 0.9, duration: 0.4 }, f.start - 0.1);
      c.in("@srch", f.start + 0.2, { y: 300, d: 0.6 });
      c.js(`tl.fromTo("${c.q("@r1")}, ${c.q("@r2")}", { y: -134 }, { y: 0, duration: 0.45, ease: "power3.inOut" }, ${T(f.start + f.dur * 0.55)}); tl.fromTo("${c.q("@you")}", { x: 900 }, { x: 0, duration: 0.5, ease: "back.out(1.4)" }, ${T(f.start + f.dur * 0.55)});`);
      c.sfx("ding", f.start + f.dur * 0.6);
      c.in("@marcus", f.start + f.dur * 0.65, { x: -80, y: 0 });
      return `<div class="pos h" id="@drawer" style="left:760px;top:330px;width:400px;height:240px;border-radius:20px;background:#fff;color:#0b1220;padding:30px;box-shadow:0 30px 80px rgba(0,0,0,.5)"><div style="font-family:'Space Grotesk';font-size:40px;font-weight:700">Marcus</div><div style="font-size:24px;color:#64748b;font-weight:700">Mobile Detailing</div><div style="margin-top:40px;font-size:22px;font-weight:700;color:#94a3b8">📇 Nobody sees this</div></div>
      <div class="ws-prof h" id="@prof" style="left:680px;top:170px"><div class="cv"></div><div class="lg">🚐</div><div class="bd h" id="@pb"><div class="nm">Marcus Mobile Detailing</div><div class="rt"><span>★★★★★</span> 5.0 · Car detailing</div><div class="ct"><b>Open now</b> · Serves Tampa Bay</div><div class="bt"><div><span>📞</span>Call</div><div><span>🌐</span>Website</div><div class="bk"><span>📅</span>Book</div></div></div></div>
      <div class="ws-chip h" id="@ch0" style="left:110px;top:240px"><b>✓</b>Service area</div>
      <div class="ws-chip h" id="@ch1" style="left:110px;top:400px"><b>✓</b>Hours + photos</div>
      <div class="ws-chip h" id="@ch2" style="left:110px;top:560px"><b>✓</b>Book button</div>
      <div class="ws-chip h" id="@ch3" style="left:1340px;top:240px"><b>✓</b>Google Search Console</div>
      <div class="ws-chip h" id="@ch4" style="left:1340px;top:400px"><b>✓</b>Bing Webmaster Tools</div>
      <div class="ws-chip h" id="@ch5" style="left:1340px;top:560px"><b>✓</b>Readable by AI (llms.txt)</div>
      ${search("@srch", "car detailing near me", res("Shine Pro Detailing", "★ 4.8 (231) · Open now") + res("Marcus Mobile Detailing", "★ 5.0 · We come to you", "you", "@you") + `<div id="@r1">${res("Bay Auto Spa", "★ 4.7 (164) · Open now")}</div><div id="@r2">${res("Elite Mobile Wash", "★ 4.6 (97) · Closes 6 PM")}</div>`, `style="left:900px;top:110px"`)}
      <div class="pos h" id="@marcus" style="left:300px;top:300px">${marcus("grin", 250, "@m")}</div>
      <div class="ws-note">Illustrative example. Rankings depend on Google and aren't guaranteed.</div>`;
    },
  },
  // ───────── 9b. Reviews ─────────
  {
    id: "reviews", chapter: "The review snowball", music: "soft",
    lines: [
      "There was one more thing working against Marcus. He only had four Google reviews.",
      "His competitors had over a hundred. And when people compare, most of them pick the one with more stars and more reviews.",
      "So after every job, Marcus held up a little card and said, “Tap this with your phone, it takes ten seconds.”",
      "The review page popped right open. No searching, no typing in a link.",
      "Four reviews became twenty. Twenty became sixty.",
      { t: "And every new review made the next stranger trust him a little more.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@you", a.start, { x: -80, y: 0 });
      c.in("@them", b.start + 0.2, { x: 80, y: 0 });
      c.sfx("thud", b.start + 0.4);
      c.to("@you, @them", { autoAlpha: 0, duration: 0.4 }, d.start - 0.1);
      c.in("@marcus", d.start, { x: -80, y: 0 });
      c.in("@cust", d.start + 0.2, { x: 80, y: 0 });
      mood(c, "@marcus", "grin", d.start);
      talk(c, "@marcus", d.start + d.dur * 0.55, d.dur * 0.4);
      c.pop("@card", d.start + d.dur * 0.5);
      c.in("@ph", e.start, { y: 200 });
      c.js(`tl.to("${c.q("@ph")}", { x: -120, duration: 0.3, ease: "power2.out" }, ${T(e.start + 0.4)}); tl.to("${c.q("@ph")}", { x: 0, duration: 0.3 }, ${T(e.start + 0.8)});`);
      c.sfx("tap", e.start + 0.7);
      c.in("@form", e.start + 0.8, { scale: 0.9 });
      c.sfx("ding", e.start + 1.0);
      mood(c, "@cust", "grin", e.start + 1);
      c.to("@marcus, @cust, @card, @ph", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@ctr", f.start, { scale: 0.7 });
      c.js(`const rv${c.id("x").replace(/-/g, "_")} = { v: 4 }; tl.fromTo(rv${c.id("x").replace(/-/g, "_")}, { v: 4 }, { v: 63, duration: ${T(f.dur + 0.4)}, ease: "power1.inOut", onUpdate: () => { document.getElementById("${c.id("n")}").textContent = Math.round(rv${c.id("x").replace(/-/g, "_")}.v); } }, ${T(f.start + 0.2)});`);
      for (let k = 0; k < 14; k++) c.sfx("tick", f.start + 0.2 + k * (f.dur / 14));
      ["@s0", "@s1", "@s2", "@s3", "@s4"].forEach((sel, i) => c.pop(sel, g.start + i * 0.25));
      c.sfx("chime", g.start + 1.2);
      return `<div class="ws-res h" id="@you" style="position:absolute;left:180px;top:260px;width:700px;height:150px;background:#fff;color:#0b1220"><div class="pin">🚐</div><div><b>Marcus Mobile Detailing</b><small>★ 5.0 (4 reviews)</small></div></div>
      <div class="ws-res h" id="@them" style="position:absolute;left:1040px;top:260px;width:700px;height:150px;background:#fff;color:#0b1220"><div class="pin">📍</div><div><b>Shine Pro Detailing</b><small>★ 4.8 (231 reviews)</small></div></div>
      <div class="pos h" id="@marcus" style="left:420px;top:300px">${marcus("smile", 240, "@m")}</div>
      <div class="pos h" id="@cust" style="left:1330px;top:300px">${who("extra1", "smile", 240, "@cu")}</div>
      <div class="pos h" id="@card" style="left:680px;top:420px;width:170px;height:270px;border-radius:22px;background:linear-gradient(160deg,#111827,#1f2937);border:3px solid #fbbc04;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-size:22px;font-weight:800;color:#fde68a;box-shadow:0 20px 50px rgba(0,0,0,.5)"><span style="font-size:60px">📲</span>Tap for<br />a review<span style="color:#fbbc04;letter-spacing:2px">★★★★★</span></div>
      ${phone("@ph", `<div class="h" id="@form" style="background:#fff;color:#202124;border-radius:22px;height:100%;padding:30px 22px"><div style="font-size:30px;font-weight:800">Marcus Mobile Detailing</div><div style="margin-top:8px;font-size:18px;color:#5f6368">Rate your experience</div><div style="margin-top:30px;font-size:52px;color:#fbbc04;letter-spacing:4px">★★★★★</div><div style="margin-top:24px;min-height:150px;padding:16px;border-radius:12px;border:2px solid #dadce0;font-size:22px">My car looks brand new!!</div><div style="margin:20px 0 0 auto;width:120px;padding:14px;text-align:center;border-radius:999px;background:#1a73e8;color:#fff;font-weight:700">Post</div></div>`, `style="left:900px;top:150px"`)}
      <div class="ws-stat h" id="@ctr" style="left:560px;top:200px;width:800px;text-align:center;border-color:#fbbc04"><span>Marcus's Google reviews</span><b id="@n">4</b><div style="margin-top:12px;font-size:56px;color:#fbbc04;letter-spacing:6px">${["@s0", "@s1", "@s2", "@s3", "@s4"].map((i) => `<span class="h" id="${i}" style="display:inline-block;font-size:56px;color:#fbbc04;margin:0">★</span>`).join("")}</div><small>Illustrative example</small></div>
      <div class="ws-note">Illustrative example. Business names and review counts are made up.</div>`;
    },
  },
  // ───────── 10. Ads ─────────
  {
    id: "ads", chapter: "Turning on ads", music: "pulse",
    lines: [
      "Then we turned on ads. A small budget, close to home.",
      "Facebook and Instagram ads showing his before and after photos to car owners nearby.",
      "Google ads showing up right when someone searched for a detailer.",
      "And every ad sent people to one place: his website, with that big book now button.",
      { t: "For real CEO Turbo clients, leads have cost as little as $4.31 each.", say: "For real C.E.O. Turbo clients, leads have cost as little as four dollars and thirty-one cents each." },
      { t: "Marcus's numbers in this story are an example. Real results depend on your business and your market.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@k", a.start);
      c.pop("@hub", a.start + a.dur * 0.5);
      const P = [["Facebook", "#1877f2", 260, 260], ["Instagram", "#e1306c", 210, 640], ["Google", "#4285f4", 1430, 260], ["Microsoft", "#00a4ef", 1450, 640]];
      c.pop("@pl0", b.start + 0.2); c.pop("@pl1", b.start + b.dur * 0.25);
      c.pop("@pl2", d.start + 0.2); c.pop("@pl3", d.start + d.dur * 0.5);
      [b.start + 0.2, b.start + b.dur * 0.25, d.start + 0.2, d.start + d.dur * 0.5].forEach((t) => c.sfx("pop", t));
      const hx = 960, hy = 520;
      P.forEach(([, , x, y], i) => {
        for (let k = 0; k < 5; k++) {
          const t0 = e.start + i * 0.15 + k * 0.6;
          c.js(`tl.fromTo("${c.q(`@bm${i}_${k}`)}", { x: ${x + 120}, y: ${y + 36}, opacity: 1 }, { x: ${hx}, y: ${hy}, duration: 0.6, ease: "power2.in" }, ${T(t0)}); tl.to("${c.q(`@bm${i}_${k}`)}", { opacity: 0, duration: 0.05 }, ${T(t0 + 0.6)});`);
        }
      });
      c.js(`tl.to("${c.q("@hub")}", { scale: 1.1, duration: 0.2, yoyo: true, repeat: 9, ease: "sine.inOut" }, ${T(e.start + 0.5)});`);
      c.to("@k, .ws-plat, @hub", { autoAlpha: 0, scale: 0.9, duration: 0.4 }, f.start - 0.1);
      c.in("@stat", f.start + 0.1, { scale: 0.7 });
      c.js(`const cp${c.id("x").replace(/-/g, "_")} = { v: 20 }; tl.fromTo(cp${c.id("x").replace(/-/g, "_")}, { v: 20 }, { v: 4.31, duration: 1.4, ease: "power2.out", onUpdate: () => { document.getElementById("${c.id("cpl")}").textContent = "$" + cp${c.id("x").replace(/-/g, "_")}.v.toFixed(2); } }, ${T(f.start + f.dur * 0.4)});`);
      for (let k = 0; k < 12; k++) c.sfx("tick", f.start + f.dur * 0.4 + k * 0.11);
      c.sfx("ding", f.start + f.dur * 0.4 + 1.4);
      c.in("@ill", g.start + 0.2, { y: 20 });
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">Step three: ads</div>
      <div class="ws-hub h" id="@hub" style="left:${hx}px;top:${hy}px"><span>🌐</span><b>His website</b></div>
      ${P.map(([n, col, x, y], i) => `<div class="ws-plat h" id="@pl${i}" style="left:${x}px;top:${y}px"><i style="background:${col}"></i>${n} ads</div>`).join("")}
      ${P.map((_, i) => [0, 1, 2, 3, 4].map((k) => `<div class="ws-beam" id="@bm${i}_${k}"></div>`).join("")).join("")}
      <div class="ws-stat h" id="@stat" style="left:560px;top:210px;width:800px;text-align:center"><span>Real CEO Turbo client · cost per lead, as low as</span><b id="@cpl">$20.00</b><small>Meta Ads Manager · computer repair client · Jul–Aug 2026</small></div>
      <div class="ws-disc h" id="@ill" style="top:760px">Marcus's results are illustrative. Yours depend on your business and market.</div>`;
    },
  },
  // ───────── 11. First booking ─────────
  {
    id: "first", chapter: "The first booking", music: "soft",
    lines: [
      { t: "Then, on a Thursday night at 11:42, Marcus's phone buzzed.", say: "Then, on a Thursday night at eleven forty-two... Marcus's phone buzzed." },
      { t: "New booking. Full interior and exterior detail. Saturday at nine.", say: "New booking... Full interior and exterior detail... Saturday, at nine." },
      "Someone he had never met found him on Google, looked at his prices and his photos, and booked. Without a single phone call.",
      { t: "Then it happened again. And again. And again.", say: "Then it happened again... And again... And again.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@night", c.S, { y: 0 });
      c.in("@marcus", a.start, { y: 0 });
      mood(c, "@marcus", "sleep", a.start);
      c.in("@ph", a.start + a.dur * 0.5, { y: 200 });
      c.js(`tl.to("${c.q("@ph")}", { rotation: 6, duration: 0.06, yoyo: true, repeat: 9, ease: "none" }, ${T(a.end - 0.4)});`);
      c.sfx("buzz", a.end - 0.4);
      mood(c, "@marcus", "shock", a.end);
      c.in("@n0", b.start + 0.1, { y: -60 });
      c.sfx("ding", b.start + 0.1);
      mood(c, "@marcus", "grin", d.start + d.dur * 0.5);
      [1, 2, 3].forEach((i) => { c.in(`@n${i}`, e.start + e.dur * (0.15 + (i - 1) * 0.28), { y: -60 }); c.sfx("ding", e.start + e.dur * (0.15 + (i - 1) * 0.28)); });
      return `<div class="ws-night h" id="@night"></div><div class="ws-moon" style="left:430px;top:90px"></div>
      <div class="pos h" id="@marcus" style="left:300px;top:330px">${marcus("sleep", 240, "@m")}</div>
      ${phone("@ph", `<div style="text-align:center;padding-top:60px"><div style="font-family:'Space Grotesk';font-size:96px;font-weight:600">11:42</div><div style="font-size:24px;color:#94a3b8">Thursday</div></div>`, `style="left:700px;top:170px"`)}
      <div class="ws-notif h" id="@n0" style="left:1130px;top:180px"><div class="ic">📅</div><div><b>New booking · Full detail</b><small>Saturday, 9:00 AM · booked online</small></div></div>
      <div class="ws-notif h" id="@n1" style="left:1130px;top:360px"><div class="ic">📅</div><div><b>New booking · Interior</b><small>Sunday, 11:00 AM</small></div></div>
      <div class="ws-notif h" id="@n2" style="left:1130px;top:540px"><div class="ic" style="background:#1aa3ff">💬</div><div><b>New lead · Ceramic coating</b><small>“Do you come to Brandon?”</small></div></div>
      <div class="ws-notif h" id="@n3" style="left:1130px;top:720px"><div class="ic">📅</div><div><b>New booking · Full detail</b><small>Monday, 8:30 AM</small></div></div>`;
    },
  },
  // ───────── 11b. Tracking ─────────
  {
    id: "tracking", chapter: "Knowing which ads actually work", music: "pulse",
    lines: [
      "And here's the part most people skip.",
      "Every call, every text and every booking was tracked back to where it came from.",
      "So Marcus could see it plainly. Google ads were bringing in his best jobs. One of his Facebook ads wasn't bringing in much of anything.",
      "So we turned that one off, and put the money where it was working.",
      { t: "No guessing. Just a clear picture of what makes the phone ring.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k", a.start);
      c.in("@dash", b.start, { y: 200, d: 0.6 });
      ["@row0", "@row1", "@row2"].forEach((sel, i) => c.in(sel, b.start + b.dur * (0.3 + i * 0.2), { x: -40, y: 0 }));
      c.js(`tl.fromTo("${c.q("@dash")} .fl", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.25 }, ${T(d.start)});`);
      c.in("@best", d.start + d.dur * 0.35, { scale: 0.6 }); c.sfx("ding", d.start + d.dur * 0.35);
      c.in("@meh", d.start + d.dur * 0.75, { scale: 0.6 }); c.sfx("buzz", d.start + d.dur * 0.75);
      c.js(`tl.to("${c.q("@row2")}", { opacity: 0.35, duration: 0.4 }, ${T(e.start + e.dur * 0.3)}); tl.fromTo("${c.q("@sw")}", { backgroundColor: "#22c55e" }, { backgroundColor: "#475569", duration: 0.2 }, ${T(e.start + e.dur * 0.3)}); tl.to("${c.q("@sw")} i", { x: -34, duration: 0.2 }, ${T(e.start + e.dur * 0.3)});`);
      c.sfx("tap", e.start + e.dur * 0.3);
      c.js(`tl.to("${c.q("@row0")} .fl", { scaleX: 1.25, duration: 0.6, ease: "back.out(1.6)" }, ${T(e.start + e.dur * 0.65)});`);
      c.in("@clear", f.start + 0.2, { y: 30 });
      const row = (id, name, col, w, n, extra = "") => `<div class="h" id="${id}" style="display:flex;align-items:center;gap:24px;padding:22px 0;border-top:2px solid #1e293b"><div style="width:280px;font-size:30px;font-weight:800">${name}</div><div style="flex:1;height:34px;border-radius:17px;background:#1e293b;overflow:visible"><div class="fl" style="width:${w}%;height:100%;border-radius:17px;background:${col};transform-origin:0 50%"></div></div><div style="width:150px;text-align:right;font-family:'Space Grotesk';font-size:40px;font-weight:700">${n}</div>${extra}</div>`;
      return `<div class="kicker h" id="@k" style="left:120px;top:90px">The part most people skip</div>
      <div class="h" id="@dash" style="position:absolute;left:200px;top:210px;width:1300px;padding:40px 50px;border-radius:36px;background:rgba(15,23,42,.95);border:3px solid #334155;box-shadow:0 50px 140px rgba(0,0,0,.5)">
        <div style="display:flex;justify-content:space-between;font-size:28px;font-weight:800;color:#94a3b8;margin-bottom:10px"><span>Where bookings came from · last 30 days</span><span>Bookings</span></div>
        ${row("@row0", "Google ads", "linear-gradient(90deg,#22c55e,#4ade80)", 80, "21")}
        ${row("@row1", "Instagram ad", "linear-gradient(90deg,#1aa3ff,#60a5fa)", 45, "11")}
        ${row("@row2", "Facebook ad #2", "linear-gradient(90deg,#64748b,#94a3b8)", 8, "1", `<div id="@sw" style="width:80px;height:46px;border-radius:23px;background:#22c55e;position:relative;flex:none"><i style="position:absolute;right:4px;top:4px;width:38px;height:38px;border-radius:50%;background:#fff"></i></div>`)}
      </div>
      <div class="pos h" id="@best" style="left:1540px;top:330px;padding:14px 26px;border-radius:999px;background:#22c55e;font-weight:800;font-size:32px">Best jobs ✓</div>
      <div class="pos h" id="@meh" style="left:1540px;top:560px;padding:14px 26px;border-radius:999px;background:#ef4444;font-weight:800;font-size:32px">Not working ✕</div>
      <div class="ws-big h" id="@clear" style="top:760px;font-size:64px">No guessing. <span class="g">Just what makes the phone ring.</span></div>
      <div class="ws-note">Illustrative example.</div>`;
    },
  },
  // ───────── 12. Growth ─────────
  {
    id: "growth", chapter: "From broke to booked solid", music: "pulse",
    lines: [
      "A month later, Marcus's calendar was full most days.",
      "Three months later, he raised his prices, because he had more customers than time.",
      "Six months later, he hired his first helper.",
      "A year later, there were two vans with his name on the side.",
      { t: "Same skills. Same Marcus. The only thing that changed is that people could finally find him.", say: "Same skills... Same Marcus... The only thing that changed, is that people could finally find him.", gap: 0.8 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@line", a.start, { y: 0 });
      const ms = [a, b, d, e];
      ms.forEach((l, i) => {
        c.js(`tl.fromTo("${c.q("@fill")}", { scaleX: ${i / 4} }, { scaleX: ${(i + 1) / 4}, duration: 0.8, ease: "power2.inOut" }, ${T(l.start)});`);
        c.in(`@m${i}`, l.start + 0.3, { y: 40 });
        c.sfx("pop", l.start + 0.3);
      });
      c.js(`tl.fromTo("${c.q("@m0")} .cal i", { backgroundColor: "#eef2f6" }, { backgroundColor: "#1aa3ff", duration: 0.12, stagger: 0.06 }, ${T(a.start + 0.8)});`);
      c.to("@line, .ws-ms", { autoAlpha: 0, duration: 0.4 }, f.start - 0.1);
      c.in("@vans", f.start + 0.1, { y: 0 });
      c.in("@v1", f.start + 0.2, { x: -600, y: 0 });
      c.in("@v2", f.start + 0.5, { x: 600, y: 0 });
      c.in("@marcus", f.start + 0.6, { y: 60 });
      c.in("@helper", f.start + 0.8, { y: 60 });
      c.in("@bank", f.start + f.dur * 0.45, { y: 300 });
      c.js(`const b2${c.id("x").replace(/-/g, "_")} = { v: 43.27 }; tl.fromTo(b2${c.id("x").replace(/-/g, "_")}, { v: 43.27 }, { v: 18640.55, duration: 1.6, ease: "power2.out", onUpdate: () => { document.getElementById("${c.id("bal")}").textContent = "$" + b2${c.id("x").replace(/-/g, "_")}.v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } }, ${T(f.start + f.dur * 0.55)});`);
      c.sfx("ding", f.start + f.dur * 0.55 + 1.6);
      const X = [300, 740, 1180, 1620];
      const lab = [["1 month", "Calendar full most days", `<div class="cal" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:210px;margin:18px auto 0">${Array.from({ length: 14 }, () => `<i style="display:block;height:24px;border-radius:5px;background:#eef2f6"></i>`).join("")}</div>`], ["3 months", "Raised his prices", `<div class="ic">📈</div>`], ["6 months", "Hired his first helper", `<div class="ic">🤝</div>`], ["1 year", "Two vans", `<div class="ic">🚐🚐</div>`]];
      return `<div class="ws-tl h" id="@line"><div class="fill" id="@fill"></div></div>
      ${lab.map(([t, s, ic], i) => `<div class="ws-ms h" id="@m${i}" style="left:${X[i]}px"><div class="dt"></div><b>${t}</b><span>${s}</span>${ic}</div>`).join("")}
      <div class="set h" id="@vans"><div class="ws-sun" style="left:880px;top:90px"></div></div>
      ${van("@v1", `style="left:80px;top:600px"`)}${van("@v2", `style="left:540px;top:640px"`)}
      <div class="pos h" id="@marcus" style="left:1290px;top:430px">${marcus("grin", 200, "@mm")}</div>
      <div class="pos h" id="@helper" style="left:1110px;top:470px">${who("extra2", "smile", 180, "@hh")}</div>
      ${phone("@bank", `<div class="bank"><small>Checking ••• 4821</small><div class="bal" id="@bal" style="font-size:46px">$43.27</div><div class="tx in"><span>Bookings this week</span><em>+</em></div></div>`, `style="left:1500px;top:110px"`)}
      <div class="ws-note">Marcus's story and numbers are illustrative.</div>`;
    },
  },
  // ───────── 12b. Mistakes ─────────
  {
    id: "mistakes", chapter: "5 mistakes most small business websites make", music: "soft",
    lines: [
      "Now, here's something important. Just having a website isn't enough. A lot of small business websites quietly turn customers away.",
      "Mistake one: it's slow. If it takes more than a few seconds to load on a phone, a lot of people leave before they see anything.",
      "Mistake two: you have to dig to find the phone number or the book button.",
      "Mistake three: no prices, so people assume you're too expensive and move on.",
      "Mistake four: no reviews or real photos, so there's no reason to trust you over the next guy.",
      "And mistake five: it was built once, years ago, and nobody has touched it since.",
      { t: "A good website isn't a brochure. It's your best salesperson, working every hour of every day.", gap: 0.7 },
    ],
    draw(c) {
      const [a, ...rest] = c.L;
      const last = rest.pop();
      c.in("@h", a.start, { y: 40 });
      rest.forEach((l, i) => { c.in(`@m${i}`, l.start, { x: -80, y: 0 }); c.sfx("thud", l.start + 0.3); });
      c.to(".ws-x", { autoAlpha: 0.25, duration: 0.4 }, last.start);
      c.in("@sales", last.start + last.dur * 0.35, { scale: 0.6 });
      c.sfx("chime", last.start + last.dur * 0.35);
      const M = ["Slow on phones", "Phone number buried", "No prices", "No reviews or real photos", "Built once, never updated"];
      return `<div class="ws-big h" id="@h" style="top:80px;font-size:70px">5 website mistakes that <span class="o">cost you customers</span></div>
      <div class="ws-xs" style="left:200px;top:260px;gap:20px">${M.map((m, i) => `<div class="ws-x h" id="@m${i}" style="width:900px"><b>${i + 1}</b>${m}</div>`).join("")}</div>
      <div class="pos h" id="@sales" style="left:1180px;top:380px;width:600px;padding:40px;border-radius:36px;background:linear-gradient(160deg,#10263f,#08121f);border:4px solid #22c55e;text-align:center;box-shadow:0 0 90px rgba(34,197,94,.3)"><div style="font-size:110px">🤝</div><div style="font-family:'Space Grotesk';font-size:52px;font-weight:700;line-height:1.05;margin-top:10px">Your best salesperson,<br /><span class="g">24/7</span></div></div>`;
    },
  },
  // ───────── 13. Five reasons ─────────
  {
    id: "lessons", chapter: "5 reasons your business needs a website", music: "soft",
    lines: [
      "So, why does your business need a website?",
      "One. People search before they buy. If you're not there, you don't exist to them.",
      "Two. A website works while you sleep. It answers questions and takes bookings at midnight.",
      "Three. You own it. Social media can change the rules or lock your account. Your website is yours.",
      "Four. It makes every ad work harder, because every click lands on a page built to sell.",
      { t: "And five. It builds trust. Real prices, real photos and real reviews turn strangers into customers.", gap: 0.7 },
    ],
    draw(c) {
      const [a, ...rest] = c.L;
      c.in("@h", a.start, { y: 40 });
      rest.forEach((l, i) => {
        c.in(`@r${i}`, l.start, { y: 120 });
        c.sfx("pop", l.start);
        c.js(`tl.set("${c.q(`@r${i}`)}", { attr: { class: "r on" } }, ${T(l.start)}); tl.set("${c.q(`@r${i}`)}", { attr: { class: "r" } }, ${T(l.end + 0.2)});`);
      });
      const R = [["🔍", "People search first", "Not there? You don't exist to them."], ["🌙", "Works while you sleep", "Answers and books at midnight."], ["🔑", "You own it", "No algorithm can lock you out."], ["🎯", "Ads work harder", "Every click lands on a page built to sell."], ["🤝", "Builds trust", "Prices, photos and reviews win strangers."]];
      return `<div class="ws-big h" id="@h" style="top:70px;font-size:74px">5 reasons your business <span class="o">needs a website</span></div>
      <div class="ws-five">${R.map(([ic, b, s], i) => `<div class="r h" id="@r${i}"><div class="n">${i + 1}</div><div class="ic">${ic}</div><b>${b}</b><span>${s}</span></div>`).join("")}</div>`;
    },
  },
  // ───────── 14. Offer ─────────
  {
    id: "offer", chapter: "How CEO Turbo can help", music: "pulse",
    lines: [
      { t: "If you're where Marcus was, this is exactly what we do at CEO Turbo.", say: "If you're where Marcus was... this is exactly what we do at C.E.O. Turbo." },
      "Turbo Launch is the whole package: a new website, Google and Bing set up, full tracking, and ads on your two best platforms.",
      { t: "It's $1,997, one time. No contracts, and we never mark up your ad spend.", say: "It's nineteen ninety-seven, one time. No contracts. And we never mark up your ad spend." },
      { t: "Not ready for that? Start with a free thirty-minute call. We'll look at your business and give you a plan you can keep, whether you hire us or not.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@logo", a.start, { y: -40 });
      c.in("@hl", a.start + 0.4, { x: -60, y: 0 });
      c.in("@card", b.start, { x: 300, y: 0, d: 0.7 });
      ["@x0", "@x1", "@x2", "@x3", "@x5"].forEach((s, i) => c.in(s, b.start + b.dur * (0.15 + i * 0.17), { x: 30, y: 0 }));
      c.js(`tl.fromTo("${c.q("@p")}", { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power4.in", transformOrigin: "left center" }, ${T(d.start + 0.2)});`);
      c.sfx("thud", d.start + 0.6);
      c.in("@x4", d.start + d.dur * 0.5, { x: 30, y: 0 });
      c.in("@free", e.start + 0.3, { y: 60 });
      c.sfx("chime", e.start + 0.3);
      return `<img class="ws-logo h" id="@logo" src="assets/img/logo.png" style="left:120px;top:150px" />
      <div class="ws-h h" id="@hl" style="left:120px;top:400px;width:860px;font-size:96px;text-transform:uppercase">Website + Google<br /><span class="o">+ ads.</span><br /><span class="g">Done for you.</span></div>
      <div class="ws-offer h" id="@card"><div class="k">Turbo Launch · the whole package</div><div class="p h" id="@p">$1,997</div><div class="o">one-time setup</div><div class="x"><div class="h" id="@x0"><b>✓</b>New website, up to 7 pages</div><div class="h" id="@x1"><b>✓</b>Google + Bing set up</div><div class="h" id="@x2"><b>✓</b>Full call + lead tracking</div><div class="h" id="@x3"><b>✓</b>Ads on your 2 best platforms</div><div class="h" id="@x5"><b>✓</b>2 tap-to-review Google cards</div><div class="h" id="@x4"><b>✓</b>No contracts · ad spend never marked up</div></div></div>
      <div class="pos h" id="@free" style="left:120px;top:740px;padding:24px 40px;border-radius:999px;background:linear-gradient(180deg,#3b82f6,#1d4ed8);font-weight:800;font-size:40px;box-shadow:0 20px 60px rgba(37,99,235,.45)">📅 Or start with a free 30-min call</div>`;
    },
  },
  // ───────── 15. End ─────────
  {
    id: "end", chapter: "Your move", music: "soft", pad: 3.5,
    lines: [
      "Marcus didn't need to work harder. He needed to be found.",
      { t: "Book your free call at ceoturbo.com/brand-boost. The link is in the description.", say: "Book your free call at C.E.O. Turbo dot com, slash brand boost. The link is in the description." },
      { t: "And if this story helped, send it to a business owner who needs to hear it.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@l1", a.start, { y: 40 });
      c.in("@l2", a.start + a.dur * 0.5, { y: 40 });
      c.in("@van", a.start + 0.3, { x: -900, y: 0, d: 1.2 });
      c.pop("@url", b.start + 0.3);
      c.sfx("ding", b.start + 0.3);
      c.in("@share", d.start + 0.2, { y: 30 });
      return `<div class="ws-big h" id="@l1" style="top:120px;font-size:100px">Marcus didn't need to work harder.</div>
      <div class="ws-big h" id="@l2" style="top:250px;font-size:130px"><span class="o">He needed to be found.</span></div>
      ${van("@van", `style="left:110px;top:560px"`)}
      <div class="ws-cta h" id="@url" style="left:740px;top:580px">ceoturbo.com/<span style="color:#fff3e8">brand-boost</span></div>
      <div class="ws-sub h" id="@share" style="left:740px;top:770px;font-size:32px">📤 Know a business owner who needs this? Send it to them.</div>`;
    },
  },
];
