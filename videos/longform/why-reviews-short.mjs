// 9:16 cut of "Why the Worse Business Gets All the Customers" for Reels, TikTok and Shorts (~75 s, hook first).
// Same voice, captions and pipeline as why-reviews.mjs; its own vertical layouts, reusing that script's art.
// Safe zone: content stays inside y 200–1380 (captions sit just above the app buttons) and x 60–1020.
// Pip, Rocco and the town are fictional (on screen from the first second). Real facts only: BrightLocal 2026 (47%),
// Spiegel Research Center 2017 (270%), $16.99 packs and free US shipping (src/config/site.ts).
import { CSS as LONG_CSS, IMAGES as LONG_IMAGES, pip, rocco, hazel, crowd, stage, L, sky, floor, shop, cam, stat, src, bars3d, counterCard } from "./why-reviews.mjs";
import { count, ripple } from "./restaurant-reviews.mjs";
import { T, mood, talk } from "./website-story.mjs";
import { reviewForm, phone as bigPhone } from "./stop-asking.mjs";

export const SIZE = [1080, 1920];
export const TITLE = "Why the Worse Business Gets All the Customers (9:16)";
export const SLUG = "why-reviews-short";
export const LINKS = { cards: "ceoturbo.com/google-review-cards" };
export const IMAGES = LONG_IMAGES;
const PIP = ["am_puck", 1.0];

/** The long cut's 1920×1080 street, shrunk to the phone's width. */
const mini = (y, html) => `<div style="position:absolute;left:0;top:${y}px;width:1920px;height:1080px;transform:scale(.5625);transform-origin:0 0;overflow:hidden;border-radius:0">${html}</div>`;
const street = (extra = "") => stage(sky() + L(0, floor() + shop("@crumb", "Crumb &amp; Co.", 120, "crumb", "🍞 🥯 🍞") + shop("@pips", "Pip's Bakery", 1080, "pip") + extra));

export const CSS = LONG_CSS + `
.bg { background: radial-gradient(900px 900px at 20% 10%, #16233f 0%, transparent 60%), radial-gradient(900px 900px at 90% 100%, #2a1608 0%, transparent 60%), #070b14; }
.s-hook .bg, .s-later .bg { background: linear-gradient(180deg, #7cc4f5 0%, #b9e2fb 40%, #f3d6ac 100%); }
.cap { bottom: 400px; max-width: 960px; font-size: 50px; padding: 16px 30px; }
.vt { position: absolute; left: 60px; right: 60px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.03em; line-height: 1.02; text-transform: uppercase; z-index: 8; color: #fff; text-shadow: 0 6px 0 rgba(0,0,0,.25), 0 20px 50px rgba(0,0,0,.45); }
.vnote { position: absolute; left: 0; right: 0; top: 206px; text-align: center; font-size: 26px; font-weight: 700; color: #f8fafc; z-index: 8; text-shadow: 0 2px 8px rgba(0,0,0,.6); }
.vchip { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px; border-radius: 999px; font-weight: 800; font-size: 40px; white-space: nowrap; z-index: 9; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
.vvs { position: absolute; left: 60px; right: 60px; display: flex; justify-content: space-between; gap: 30px; }
.vvs > div { flex: 1; padding: 40px 20px; border-radius: 40px; text-align: center; background: rgba(9,14,28,.92); border: 4px solid #334155; }
.vvs b { display: block; font-family: "Space Grotesk"; font-size: 180px; line-height: 1; letter-spacing: -.05em; } .vvs span { display: block; margin-top: 10px; font-size: 38px; font-weight: 800; }
.wr-src { left: 60px; right: 60px; top: 236px; max-width: none; text-align: center; font-size: 26px; }
.wr-stat { left: 60px !important; right: 60px; } .wr-stat b { font-size: 250px; } .wr-stat span { max-width: none; font-size: 50px; }
.vphoto { position: absolute; left: 0; right: 0; top: 180px; height: 580px; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent); mask-image: linear-gradient(180deg, #000 70%, transparent); }
.vphoto img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vprice { position: absolute; left: 0; right: 0; top: 790px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; }
.vprice small { display: block; font-size: 52px; color: #cbd5e1; } .vprice b { font-size: 210px; letter-spacing: -.05em; line-height: 1; }
.vchips { position: absolute; left: 50px; right: 50px; top: 1075px; display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
.vchips .chip { font-size: 36px; padding: 14px 28px; border-radius: 999px; background: rgba(34,197,94,.16); border: 3px solid #22c55e; font-weight: 800; }
.vurl { position: absolute; left: 40px; right: 40px; top: 1180px; padding: 26px 10px; white-space: nowrap; border-radius: 40px; text-align: center; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); box-shadow: 0 30px 80px rgba(255,90,10,.45); font-family: "Space Grotesk"; font-weight: 700; z-index: 9; }
.vurl small { display: block; font-size: 36px; opacity: .92; } .vurl b { display: block; font-size: 52px; letter-spacing: -.02em; margin-top: 4px; }
.vsteps { position: absolute; left: 90px; right: 90px; display: flex; flex-direction: column; gap: 16px; }
.vsteps div { padding: 22px 30px; border-radius: 24px; background: rgba(15,23,42,.94); border: 3px solid #475569; font-size: 44px; font-weight: 800; }
`;

export const SCENES = [
  // ───────── 1. Hook ─────────
  {
    id: "hook", chapter: "Better bread, empty shop", music: "soft", lead: 0.15,
    lines: [
      "Two bakeries on the same street.",
      "One has a line out the door. The other bakes better bread, and it's empty.",
      { t: "So why does everyone walk right past it?", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      cam(c, [-120, -6, -60], [120, 6, 80]);
      c.in("@fic", c.S + 0.2, { y: 20 });
      c.in("@t1", c.S, { y: 30, d: 0.4 });
      c.js(`tl.fromTo("${c.q(".line .pos")}", { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.12, ease: "back.out(1.6)" }, ${T(b.start)});`);
      c.pop("@empty", b.start + b.dur * 0.75);
      c.sfx("thud", b.start + b.dur * 0.75);
      c.in("@why", d.start, { scale: 0.8 });
      c.sfx("whoosh", d.start);
      return `<div class="vnote h" id="@fic">🐾 Pip and the town are made up. The stats are real.</div>
      <div class="vt h" id="@t1" style="top:280px;font-size:84px">Better bread.<br/><span class="o">Empty shop.</span></div>
      ${mini(560, street(`<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 6, 40, 600, 120, 100, 0, "smile", true)}</div><div class="pos" style="left:1420px;top:500px">${pip("sad", 240)}</div>`))}
      <div class="vchip h" id="@empty" style="top:900px;background:#ef4444;color:#fff">Pip's Bakery: empty 😶</div>
      <div class="vt h" id="@why" style="top:1150px;font-size:70px">Why? 🤔</div>`;
    },
  },
  // ───────── 2. The number ─────────
  {
    id: "number", chapter: "4 reviews vs 412", music: "pulse",
    lines: [
      "It's one number. Reviews.",
      { t: "Pip has four. Crumb and Co. has four hundred and twelve.", say: "Pip has four. Crumb and Co. has... four hundred and twelve." },
      { t: "And almost everyone picks four hundred and twelve, without even thinking.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.in("@vs0", b.start, { x: -80, y: 0 }); c.sfx("pop", b.start);
      c.in("@vs1", b.start + b.dur * 0.5, { x: 80, y: 0 }); c.sfx("ding", b.start + b.dur * 0.5);
      c.in("@hz", d.start, { y: 80 });
      mood(c, "@hazel", "grin", d.start + 0.4);
      c.pop("@go", d.start + d.dur * 0.6); c.sfx("thud", d.start + d.dur * 0.6);
      return `<div class="vt h" id="@t" style="top:260px;font-size:76px">The number that<br/><span class="o">decides</span></div>
      <div class="vvs" style="top:520px"><div class="h" id="@vs0" style="border-color:#ef4444"><b style="color:#ef4444">4</b><span>🥐 Pip's Bakery<br/><span style="color:#e8a200">4.9 ★</span></span></div><div class="h" id="@vs1" style="border-color:#22c55e"><b style="color:#22c55e">412</b><span>🍞 Crumb &amp; Co.<br/><span style="color:#e8a200">4.4 ★</span></span></div></div>
      <div class="pos h" id="@hz" style="left:120px;top:960px">${hazel("smile", 220, "@hazel", { phone: true })}</div>
      <div class="vchip h" id="@go" style="top:1080px;left:300px;right:auto;background:#fff;color:#0b1220">🐰 “Crumb &amp; Co. it is.”</div>`;
    },
  },
  // ───────── 3. 47% ─────────
  {
    id: "wall", chapter: "The 20-review rule", music: "pulse",
    lines: [
      "This isn't just Hazel.",
      { t: "In BrightLocal's 2026 survey, forty-seven percent of shoppers said they won't use a business with fewer than twenty reviews.", say: "In BrightLocal's twenty twenty-six survey, forty-seven percent of shoppers said they won't use a business with fewer than twenty reviews.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@pp", a.start, { y: 60 });
      mood(c, "@pip", "sad", a.start + 0.3);
      c.in("@s47", b.start + 0.2, { y: 60 });
      count(c, "s47-n", 0, 47, b.start + b.dur * 0.3, 1.2);
      c.sfx("ding", b.start + b.dur * 0.3 + 1.2);
      c.in("@src", b.start + 0.4, { y: 20 });
      return `<div class="pos h" id="@pp" style="left:400px;top:880px">${pip("smile", 280)}</div>
      ${stat("@s47", "0", "won't use a business with <span style='color:#fbbc04'>fewer than 20 reviews</span>", 60, 330, "%")}
      ${src("@src", "BrightLocal Local Consumer Review Survey 2026")}`;
    },
  },
  // ───────── 4. 270% ─────────
  {
    id: "five", chapter: "The first 5 reviews", music: "soft",
    lines: [
      "But here's the good news.",
      "Northwestern researchers found that products with five reviews were two hundred and seventy percent more likely to be bought than products with none.",
      { t: "The first few reviews do most of the work.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.in("@bars", b.start, { y: 40 });
      c.js(`tl.fromTo("${c.q("@bars-b0")}", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "back.out(1.4)" }, ${T(b.start + 0.3)}); tl.fromTo("${c.q("@bars-b1")}", { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power3.out" }, ${T(b.start + b.dur * 0.55)});`);
      c.sfx("whoosh", b.start + b.dur * 0.55);
      c.pop("@plus", b.start + b.dur * 0.55 + 1.2); c.sfx("ding", b.start + b.dur * 0.55 + 1.2);
      c.in("@src", b.start + 0.3, { y: 20 });
      c.pop("@few", d.start + 0.2);
      return `<div class="vt h" id="@t" style="top:300px;font-size:76px">Good news 🙌</div>
      ${bars3d("@bars", [["No reviews", "1×", 26, "#64748b"], ["5 reviews", "3.7×", 96, "#fbbc04"]], 'style="left:170px;top:600px;height:460px"')}
      <div class="vchip h" id="@plus" style="top:410px;background:#16a34a;color:#fff;font-size:50px">+270% more likely to buy</div>
      <div class="vchip h" id="@few" style="top:1180px;background:#fff;color:#0b1220">💪 The first few do the heavy lifting</div>
      ${src("@src", "Spiegel Research Center, Northwestern University (2017)")}`;
    },
  },
  // ───────── 5. The chore ─────────
  {
    id: "chore", chapter: "Why nobody leaves one", music: "soft",
    lines: [
      "So why don't happy customers leave reviews?",
      { t: "Because it's a chore. Open Google. Search. Find it. Scroll. Tap. Write.", say: "Because it's a chore. Open Google. Search. Find it. Scroll. Tap. Write.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@t", a.start, { y: 30 });
      ["Open Google", "Search the bakery", "Find the right one", "Scroll to reviews", "Tap “Write a review”", "Write it"].forEach((_, i) => { c.in(`@s${i}`, b.start + b.dur * (0.12 + i * 0.14), { x: -60, y: 0 }); c.sfx("tap", b.start + b.dur * (0.12 + i * 0.14)); });
      return `<div class="vt h" id="@t" style="top:250px;font-size:70px">Happy customers<br/><span class="o">just leave</span></div>
      <div class="vsteps" style="top:520px">${["Open Google", "Search the bakery", "Find the right one", "Scroll to reviews", "Tap “Write a review”", "Write it"].map((s, i) => `<div class="h" id="@s${i}">${i + 1}. ${s} ${i === 5 ? "😩" : ""}</div>`).join("")}</div>`;
    },
  },
  // ───────── 6. The tap ─────────
  {
    id: "tap", chapter: "The 10-second fix", music: "pulse",
    lines: [
      "So Pip put a little tap card on his counter.",
      { t: "If you liked it, tap your phone here.", v: PIP, gap: 0.3 },
      { t: "One tap, his Google review page opens, and it's done in about ten seconds.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@pp", a.start, { x: -100, y: 0 });
      mood(c, "@pip", "grin", a.start + 0.4);
      c.pop("@cc", a.start + a.dur * 0.6); c.sfx("ding", a.start + a.dur * 0.6);
      talk(c, "@pip", b.start, b.dur);
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 400, y: -100, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -4, duration: 0.8, ease: "power3.out" }, ${T(d.start)});`);
      ripple(c, "@ring", d.start + 0.9); c.sfx("ding", d.start + 0.9);
      c.js(`tl.fromTo("${c.q("@screen")}", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, ${T(d.start + 1.1)}); tl.to("${c.q("@rf-stars .rs")}", { color: "#fbbc04", duration: 0.12, stagger: 0.1 }, ${T(d.start + 1.5)}); tl.to("${c.q("@rf-type")}", { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "none" }, ${T(d.start + 2.2)});`);
      for (let k = 0; k < 5; k++) c.sfx("tick", d.start + 1.5 + k * 0.1);
      return `<div class="pos h" id="@pp" style="left:80px;top:260px">${pip("smile", 260)}</div>
      <div class="pos" style="left:200px;top:560px;transform:scale(1.6);transform-origin:0 0">${counterCard("@cc")}</div><div class="rr-ring" id="@ring" style="left:296px;top:680px;width:200px;height:200px;margin:-100px 0 0 -100px"></div>
      <div class="pos h" id="@ph" style="left:560px;top:330px;transform-origin:50% 50%">${bigPhone("@phone", `<div id="@screen" style="position:absolute;inset:0;background:#fff;opacity:0">${reviewForm(c.id("rf")).replace("Your Business", "Pip's Bakery").replace("Amazing work, so fast and friendly!", "Best croissant in town! 🥐")}</div>`).replace('class="phone "', 'class="phone " style="transform:scale(.82);transform-origin:0 0"')}</div>`;
    },
  },
  // ───────── 7. Later ─────────
  {
    id: "later", chapter: "Three months later", music: "pulse",
    lines: [
      "Three months later, four reviews became a hundred and forty.",
      { t: "And now, there's a line on both sides of the street.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      cam(c, [120, 6, -40], [-80, -4, 120]);
      c.in("@cnt", a.start, { scale: 0.7, ease: "back.out(1.8)" });
      count(c, "cnt-n", 4, 140, a.start + 0.6, a.dur * 0.8);
      for (let k = 0; k < 8; k++) c.sfx("tick", a.start + 0.6 + k * a.dur * 0.1);
      c.js(`tl.fromTo("${c.q(".line2 .pos")}", { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.12, ease: "back.out(1.6)" }, ${T(b.start)});`);
      c.sfx("chime", b.start + 0.4);
      return `<div class="wr-stat h" id="@cnt" style="top:240px"><b id="@cnt-n">4</b><span>Google reviews · Pip's Bakery</span></div>
      ${mini(760, street(`<div class="line" style="position:absolute;left:0;top:0">${crowd("@q", 5, 40, 610, 110, 96, 1)}</div><div class="line2" style="position:absolute;left:0;top:0">${crowd("@q2", 6, 940, 610, 110, 96, 5, "grin", true)}</div>`))}
      <div class="vnote" style="top:1360px;font-size:24px">Illustrative example. Google decides rankings.</div>`;
    },
  },
  // ───────── 8. CTA ─────────
  {
    id: "cta", chapter: "Get the card", music: "soft", pad: 2.6,
    lines: [
      { t: "Tap cards start at $16.99, with free US shipping.", say: "Tap cards start at sixteen ninety-nine, with free U.S. shipping." },
      { t: "Link in bio.", gap: 0.3 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@photo", c.S, { y: 0, scale: 1.06, d: 1 });
      c.to("@photo img", { scale: 1.1, duration: c.E - c.S, ease: "none" }, c.S);
      c.pop("@price", a.start + a.dur * 0.35); c.sfx("ding", a.start + a.dur * 0.35);
      c.in("@k0", a.start + a.dur * 0.75, { y: 30 });
      c.in("@k1", b.start, { y: 30 });
      c.pop("@url", b.start + 0.2); c.sfx("ding", b.start + 0.2);
      return `<div class="vphoto h" id="@photo"><img src="assets/img/stack.webp" alt="" /></div>
      <div class="vprice h" id="@price"><small>Tap cards from</small><b>$16.99</b></div>
      <div class="vchips"><span class="chip h" id="@k0">🚚 Free US shipping</span><span class="chip h" id="@k1">💳 Pay once</span></div>
      <div class="vurl h" id="@url"><small>Link in bio</small><b>ceoturbo.com/google-review-cards</b></div>`;
    },
  },
];
