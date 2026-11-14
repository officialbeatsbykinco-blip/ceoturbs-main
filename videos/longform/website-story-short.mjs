// 9:16 cut of "He Had $43 in the Bank. Then He Got a Website." for Reels, TikTok and Shorts (~75 s, hook first).
// Same voice, captions and pipeline as website-story.mjs; its own vertical layouts.
// Safe zone: content stays inside y 200–1380 (captions sit just above the app buttons) and x 60–1020.
// Marcus is fictional (on screen from the first second); real numbers only: $4.31 per lead (src/content/results.ts).
import { CSS as LONG_CSS, T, mood, who, marcus, van, phone, search, res, rows3 } from "./website-story.mjs";

export const SIZE = [1080, 1920];
export const TITLE = "He Had $43 in the Bank. Then He Got a Website. (9:16)";
export const SLUG = "website-story-short";
export const LINKS = { call: "ceoturbo.com/brand-boost" };

export const CSS = LONG_CSS + `
.bg { background: radial-gradient(900px 900px at 20% 10%, #16233f 0%, transparent 60%), radial-gradient(900px 900px at 90% 100%, #2a1608 0%, transparent 60%), #070b14; }
.s-cta .bg { background: radial-gradient(900px 1000px at 60% 45%, #3a1c06 0%, transparent 65%), radial-gradient(800px 700px at 10% 0%, #15284a 0%, transparent 60%), #060910; }
.cap { bottom: 400px; max-width: 960px; font-size: 50px; padding: 16px 30px; }
.vt { position: absolute; left: 60px; right: 60px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.03em; line-height: 1.02; text-transform: uppercase; }
.vnote { position: absolute; left: 0; right: 0; top: 206px; text-align: center; font-size: 24px; font-weight: 600; color: #7f8b9a; }
.vchip { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px; border-radius: 999px; font-weight: 800; font-size: 38px; white-space: nowrap; }
.vsite { position: absolute; left: 150px; top: 330px; width: 780px; height: 1020px; border-radius: 44px; overflow: hidden; background: #070b11; border: 10px solid #273142; box-shadow: 0 50px 120px rgba(0,0,0,.6); }
.vsite .nav { height: 90px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 2px solid rgba(255,255,255,.08); font-family: "Space Grotesk"; font-weight: 700; font-size: 32px; }
.vsite .nav span { color: #ff6a1f; } .vsite .nav i { font-style: normal; padding: 12px 22px; border-radius: 999px; background: #ff6a1f; font-family: Inter; font-size: 22px; font-weight: 800; }
.vsite h3 { margin: 34px 30px 0; font-family: "Space Grotesk"; font-size: 62px; line-height: 1; letter-spacing: -.03em; } .vsite h3 span { color: #1aa3ff; }
.vsite .bk { margin: 26px 30px 0; padding: 26px; border-radius: 999px; text-align: center; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); font-size: 36px; font-weight: 800; box-shadow: 0 16px 40px rgba(255,90,10,.45); }
.vsite .ba { margin: 26px 30px 0; height: 250px; border-radius: 24px; overflow: hidden; display: flex; } .vsite .ba div { flex: 1; display: flex; align-items: flex-end; padding: 12px; font-size: 22px; font-weight: 800; } .vsite .ba .bf { background: #57534e; } .vsite .ba .af { background: linear-gradient(135deg, #38bdf8, #1d4ed8); }
.vsite .pr { margin: 22px 30px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; } .vsite .pr div { padding: 16px; border-radius: 18px; background: rgba(255,255,255,.06); border: 2px solid rgba(255,255,255,.1); font-size: 22px; font-weight: 700; color: #cbd5e1; } .vsite .pr b { display: block; font-family: "Space Grotesk"; font-size: 40px; color: #fff; }
.vsite .rv { margin: 22px 30px 0; font-size: 34px; color: #fbbc04; letter-spacing: 4px; }
.vtag { position: absolute; display: flex; align-items: center; gap: 14px; padding: 16px 24px; border-radius: 20px; background: #fff; color: #0b1220; font-size: 32px; font-weight: 800; box-shadow: 0 20px 50px rgba(0,0,0,.5); white-space: nowrap; z-index: 6; }
.vtag b { width: 46px; height: 46px; border-radius: 50%; background: #22c55e; color: #062014; display: flex; align-items: center; justify-content: center; font-size: 26px; }
`;

export const SCENES = [
  // ───────── 1. Hook ─────────
  {
    id: "hook", chapter: "$43 in the bank", music: "soft", lead: 0.15,
    lines: [
      { t: "Marcus had forty-three dollars in the bank.", say: "Marcus had forty-three dollars in the bank." },
      "His van payment was due on Friday.",
      "He's great at detailing cars. But nobody could find him online.",
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", c.S, { y: 30, d: 0.4 });
      c.in("@bank", c.S + 0.1, { y: 300, d: 0.5 });
      c.js(`const bh = { v: 1240 }; tl.fromTo(bh, { v: 1240 }, { v: 43.27, duration: 1.1, ease: "power2.in", onUpdate: () => { document.getElementById("${c.id("bal")}").textContent = "$" + bh.v.toFixed(2); } }, ${T(c.S + 0.3)});`);
      c.sfx("thud", c.S + 1.4);
      c.in("@marcus", a.start + 0.2, { x: -200, y: 0 });
      mood(c, "@marcus", "shock", c.S + 1.4);
      c.in("@due", b.start, { scale: 0.6 }); c.js(`tl.fromTo("${c.q("@due")}", { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 3, immediateRender: false }, ${T(b.start + 0.6)});`);
      c.sfx("buzz", b.start + 0.2);
      mood(c, "@marcus", "sad", b.start + 0.4);
      c.in("@fic", d.start, { y: 20 });
      return `<div class="vt h" id="@t" style="top:240px;font-size:96px">He had <span class="o">$43</span><br />in the bank.</div>
      ${phone("@bank", `<div class="bank"><small>Checking ••• 4821</small><div class="bal" id="@bal">$1,240.00</div><div class="tx"><span>Gas</span><em>−$62.10</em></div><div class="tx"><span>Supplies</span><em>−$118.45</em></div><div class="tx"><span>Insurance</span><em>−$214.00</em></div><div class="tx h" id="@due" style="margin-top:18px;padding:16px;border-radius:14px;background:#fee2e2;border:3px solid #dc2626;color:#dc2626"><span>🚐 Van payment</span><span>Due FRI</span></div></div>`, `style="left:560px;top:430px"`)}
      <div class="pos h" id="@marcus" style="left:120px;top:600px">${marcus("smile", 260, "@m")}</div>
      <div class="vchip h" id="@fic" style="top:1230px;font-size:28px;background:rgba(15,23,42,.92);border:2px solid #334155;font-weight:700">Marcus is fictional. Every step in his story is real.</div>`;
    },
  },
  // ───────── 2. Invisible ─────────
  {
    id: "invisible", chapter: "Nobody could find him", music: "pulse",
    lines: [
      "Every day, people in his town searched for car detailing near me.",
      { t: "And Marcus wasn't anywhere on the page.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.in("@srch", a.start + 0.2, { y: 300, d: 0.6 });
      c.in("@miss", b.start + 0.2, { y: 30 });
      c.sfx("buzz", b.start + 0.4);
      c.js(`tl.fromTo("${c.q("@miss")}", { x: 0 }, { x: 14, duration: 0.06, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, ${T(b.start + 0.5)});`);
      return `<div class="vt h" id="@t" style="top:250px;font-size:84px">Invisible<br /><span class="o">on Google.</span></div>
      ${search("@srch", "car detailing near me", rows3 + res("Marcus Mobile Detailing", "Not found", "miss", "@miss"), `style="left:150px;top:520px"`)}
      <div class="vnote">Illustrative example. Business names are made up.</div>`;
    },
  },
  // ───────── 3. The website ─────────
  {
    id: "site", chapter: "A real website", music: "pulse",
    lines: [
      "So we built him a real website.",
      { t: "Fast on phones. Real prices. Before and after photos. And one big book button.", say: "Fast on phones... Real prices... Before and after photos... And one big book button.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@site", a.start, { y: 400, d: 0.6 });
      c.sfx("whoosh", a.start);
      const parts = ["@h3", "@pr", "@ba", "@bk"];
      parts.forEach((p, i) => { c.in(p, b.start + b.dur * (0.02 + i * 0.24), { y: 30 }); c.in(`@g${i}`, b.start + b.dur * (0.02 + i * 0.24) + 0.15, { x: 60, y: 0 }); c.sfx("pop", b.start + b.dur * (0.02 + i * 0.24)); });
      c.js(`tl.to("${c.q("@bk")}", { scale: 1.06, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${T(b.end - 0.6)});`);
      const tag = (i, txt, x, y) => `<div class="vtag h" id="@g${i}" style="left:${x}px;top:${y}px"><b>✓</b>${txt}</div>`;
      return `<div class="vsite h" id="@site"><div class="nav">Marcus<span>Detailing</span><i>Book now</i></div>
        <h3 class="h" id="@h3">Mobile car detailing <span>in Tampa.</span></h3>
        <div class="pr h" id="@pr"><div>Interior<b>$129</b></div><div>Full<b>$199</b></div><div>Ceramic<b>$549</b></div></div>
        <div class="ba h" id="@ba"><div class="bf">BEFORE</div><div class="af">AFTER</div></div>
        <div class="rv">★★★★★</div>
        <div class="bk h" id="@bk">📅 Book now</div></div>
      ${tag(0, "Fast on phones", 60, 250)}${tag(1, "Real prices", 640, 560)}${tag(2, "Before + after", 60, 760)}${tag(3, "One big button", 600, 1170)}
      <div class="vnote">Example site and prices for a made-up business.</div>`;
    },
  },
  // ───────── 4. Found ─────────
  {
    id: "found", chapter: "Getting found", music: "pulse",
    lines: [
      "We set up his Google Business Profile, and made his site easy for Google, Bing and AI to read.",
      { t: "A few weeks later, Marcus started to show up.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@prof", a.start, { scale: 0.7 });
      ["@c0", "@c1", "@c2"].forEach((s, i) => { c.in(s, a.start + a.dur * (0.35 + i * 0.18), { y: 30 }); c.sfx("ding", a.start + a.dur * (0.35 + i * 0.18)); });
      c.to("@prof, @chips", { autoAlpha: 0, scale: 0.9, duration: 0.35 }, b.start - 0.1);
      c.in("@srch", b.start + 0.1, { y: 300, d: 0.5 });
      c.js(`tl.fromTo("${c.q("@r1")}, ${c.q("@r2")}", { y: -134 }, { y: 0, duration: 0.45, ease: "power3.inOut" }, ${T(b.start + b.dur * 0.45)}); tl.fromTo("${c.q("@you")}", { x: 900 }, { x: 0, duration: 0.5, ease: "back.out(1.4)" }, ${T(b.start + b.dur * 0.45)});`);
      c.sfx("ding", b.start + b.dur * 0.5);
      return `<div class="ws-prof h" id="@prof" style="left:260px;top:300px"><div class="cv"></div><div class="lg">🚐</div><div class="bd"><div class="nm">Marcus Mobile Detailing</div><div class="rt"><span>★★★★★</span> 5.0 · Car detailing</div><div class="ct"><b>Open now</b> · Serves Tampa Bay</div><div class="bt"><div><span>📞</span>Call</div><div><span>🌐</span>Website</div><div class="bk"><span>📅</span>Book</div></div></div></div>
      <div id="@chips"><div class="ws-chip h" id="@c0" style="left:120px;top:1000px"><b>✓</b>Google profile</div><div class="ws-chip h" id="@c1" style="left:560px;top:1000px"><b>✓</b>Google + Bing</div><div class="ws-chip h" id="@c2" style="left:330px;top:1140px"><b>✓</b>Readable by AI</div></div>
      ${search("@srch", "car detailing near me", res("Shine Pro Detailing", "★ 4.8 (231) · Open now") + res("Marcus Mobile Detailing", "★ 5.0 · We come to you", "you", "@you") + `<div id="@r1">${res("Bay Auto Spa", "★ 4.7 (164) · Open now")}</div><div id="@r2">${res("Elite Mobile Wash", "★ 4.6 (97) · Closes 6 PM")}</div>`, `style="left:150px;top:420px"`)}
      <div class="vnote">Illustrative. Rankings depend on Google and aren't guaranteed.</div>`;
    },
  },
  // ───────── 5. Ads ─────────
  {
    id: "ads", chapter: "Ads", music: "pulse",
    lines: [
      "Then we turned on ads.",
      { t: "For real CEO Turbo clients, leads have cost as little as $4.31 each.", say: "For real C.E.O. Turbo clients, leads have cost as little as four dollars and thirty-one cents each.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      const P = [["Facebook", "#1877f2", 90, 300], ["Instagram", "#e1306c", 600, 300], ["Google", "#4285f4", 130, 440], ["Microsoft", "#00a4ef", 600, 440]];
      P.forEach((_, i) => { c.pop(`@p${i}`, a.start + i * 0.15); c.sfx("pop", a.start + i * 0.15); });
      c.in("@stat", b.start + 0.1, { scale: 0.7 });
      c.js(`const cp = { v: 20 }; tl.fromTo(cp, { v: 20 }, { v: 4.31, duration: 1.4, ease: "power2.out", onUpdate: () => { document.getElementById("${c.id("cpl")}").textContent = "$" + cp.v.toFixed(2); } }, ${T(b.start + b.dur * 0.45)});`);
      for (let k = 0; k < 12; k++) c.sfx("tick", b.start + b.dur * 0.45 + k * 0.11);
      c.sfx("ding", b.start + b.dur * 0.45 + 1.4);
      return `${P.map(([n, col, x, y], i) => `<div class="ws-plat h" id="@p${i}" style="left:${x}px;top:${y}px"><i style="background:${col}"></i>${n} ads</div>`).join("")}
      <div class="ws-stat h" id="@stat" style="left:90px;top:640px;width:900px;text-align:center"><span>Real CEO Turbo client<br />cost per lead, as low as</span><b id="@cpl" style="font-size:200px">$20.00</b><small>Meta Ads Manager · computer repair · Jul–Aug 2026</small></div>
      <div class="vchip" style="top:1160px;font-size:26px;font-weight:700;background:rgba(15,23,42,.9);border:2px solid #334155">Marcus's results are illustrative. Yours depend on your market.</div>`;
    },
  },
  // ───────── 6. The bookings ─────────
  {
    id: "book", chapter: "The bookings", music: "soft",
    lines: [
      { t: "Then one night at 11:42, his phone buzzed.", say: "Then one night at eleven forty-two... his phone buzzed." },
      { t: "New booking. Then another. And another.", say: "New booking... Then another... And another.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@ph", a.start, { y: 300 });
      c.js(`tl.to("${c.q("@ph")}", { rotation: 5, duration: 0.06, yoyo: true, repeat: 9, ease: "none" }, ${T(a.end - 0.5)});`);
      c.sfx("buzz", a.end - 0.5);
      ["@n0", "@n1", "@n2"].forEach((s, i) => { const t = b.start + b.dur * (0.02 + i * 0.33); c.in(s, t, { y: -60 }); c.sfx("ding", t); });
      return `${phone("@ph", `<div style="text-align:center;padding-top:60px"><div style="font-family:'Space Grotesk';font-size:96px;font-weight:600">11:42</div><div style="font-size:24px;color:#94a3b8">Thursday</div></div>`, `style="left:360px;top:250px"`)}
      <div class="ws-notif h" id="@n0" style="left:200px;top:560px;width:680px"><div class="ic">📅</div><div><b>New booking · Full detail</b><small>Saturday, 9:00 AM · booked online</small></div></div>
      <div class="ws-notif h" id="@n1" style="left:200px;top:740px;width:680px"><div class="ic">📅</div><div><b>New booking · Interior</b><small>Sunday, 11:00 AM</small></div></div>
      <div class="ws-notif h" id="@n2" style="left:200px;top:920px;width:680px"><div class="ic">📅</div><div><b>New booking · Ceramic</b><small>Monday, 8:30 AM</small></div></div>`;
    },
  },
  // ───────── 7. A year later ─────────
  {
    id: "year", chapter: "A year later", music: "pulse",
    lines: [
      "A year later, there were two vans with his name on the side.",
      { t: "Same Marcus. People could finally find him.", say: "Same Marcus... People could finally find him.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.in("@v1", a.start + 0.2, { x: -700, y: 0 });
      c.in("@v2", a.start + 0.6, { x: 700, y: 0 });
      c.sfx("whoosh", a.start + 0.2);
      c.in("@marcus", b.start, { y: 60 });
      c.in("@helper", b.start + 0.2, { y: 60 });
      return `<div class="vt h" id="@t" style="top:250px;font-size:96px">1 year later:<br /><span class="g">two vans.</span></div>
      ${van("@v1", `style="left:40px;top:560px"`)}${van("@v2", `style="left:480px;top:760px"`)}
      <div class="pos h" id="@marcus" style="left:110px;top:880px">${marcus("grin", 200, "@mm")}</div>
      <div class="pos h" id="@helper" style="left:300px;top:910px">${who("extra2", "smile", 180, "@hh")}</div>
      <div class="vnote">Marcus's story is illustrative.</div>`;
    },
  },
  // ───────── 8. CTA ─────────
  {
    id: "cta", chapter: "Book a free call", music: "soft", pad: 2.5,
    lines: [
      { t: "Want to be found like Marcus? Book a free call. Link in bio.", say: "Want to be found like Marcus? Book a free call... Link in bio.", gap: 0.4 },
    ],
    draw(c) {
      const [a] = c.L;
      c.in("@logo", a.start, { y: -40 });
      c.in("@t", a.start + 0.3, { y: 30 });
      c.pop("@url", a.start + a.dur * 0.45);
      c.sfx("ding", a.start + a.dur * 0.45);
      return `<img class="h" id="@logo" src="assets/img/logo.png" style="position:absolute;left:0;right:0;margin:0 auto;top:260px;height:200px" />
      <div class="vt h" id="@t" style="top:540px;font-size:90px">Website + Google<br /><span class="o">+ ads.</span><br /><span class="g">Done for you.</span></div>
      <div class="h" id="@url" style="position:absolute;left:60px;right:60px;top:1000px;padding:30px 10px;border-radius:40px;text-align:center;background:linear-gradient(180deg,#ff8a3d,#ff5a0a);box-shadow:0 30px 80px rgba(255,90,10,.45);font-family:'Space Grotesk';font-weight:700"><small style="display:block;font-size:40px;opacity:.92">Free 30-minute call · link in bio</small><b style="display:block;font-size:58px;margin-top:6px">ceoturbo.com/brand-boost</b></div>`;
    },
  },
];
