// 9:16 cut of "I Stopped Asking for Google Reviews" for Reels, TikTok and Shorts (~60 s, hook first).
// Same voice, captions and pipeline as stop-asking.mjs; its own vertical layouts.
// Safe zone: content stays inside x 60–960 and y 200–1500 so the app UI never covers it.
import { phone, reviewForm, card3d, who, mood, talk } from "./stop-asking.mjs";

export const SIZE = [1080, 1920];
export const TITLE = "I Stopped Asking for Google Reviews (9:16)";
export const LINKS = { cards: "ceoturbo.com/google-review-cards", call: "ceoturbo.com/brand-boost" };

export const CSS = `
.bg { background: radial-gradient(900px 900px at 20% 10%, #16233f 0%, transparent 60%), radial-gradient(900px 900px at 90% 100%, #2a1608 0%, transparent 60%), #070b14; }
.s-offer .bg, .s-cta .bg { background: radial-gradient(900px 1000px at 60% 45%, #3a1c06 0%, transparent 65%), radial-gradient(800px 700px at 10% 0%, #15284a 0%, transparent 60%), #060910; }
.cap { bottom: 400px; max-width: 940px; font-size: 50px; padding: 16px 30px; }
.kicker { font-size: 34px; }
.vt { position: absolute; left: 70px; right: 70px; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.03em; line-height: 1.04; }
.vt.xl { font-size: 104px; } .vt.l { font-size: 84px; }
.vshop { position: absolute; left: 0; right: 0; top: 640px; height: 760px; border-radius: 0; background: linear-gradient(180deg, #1c2a44, #142036); }
.vshop .pole { position: absolute; right: 90px; top: 60px; width: 60px; height: 320px; border-radius: 30px; background: repeating-linear-gradient(-45deg, #dc2626 0 26px, #fff 26px 52px, #2563eb 52px 78px, #fff 78px 104px); }
.vshop .mirror { position: absolute; left: 80px; top: 60px; width: 300px; height: 380px; border-radius: 150px 150px 20px 20px; border: 12px solid #b45309; background: linear-gradient(135deg, #93c5fd33, #1e293b); }
.vcount { position: absolute; left: 0; right: 0; top: 1150px; margin: 0 auto; width: fit-content; display: flex; align-items: center; gap: 26px; padding: 22px 40px; border-radius: 28px; background: rgba(7,11,20,.92); border: 3px solid #334155; z-index: 9; }
.vcount span { font-size: 36px; font-weight: 700; color: #94a3b8; } .vcount b { font-family: "Space Grotesk"; font-size: 120px; line-height: 1; }
.vsteps { position: absolute; left: 70px; top: 520px; display: flex; flex-direction: column; gap: 30px; }
.vsteps .step { font-size: 58px; } .vsteps .num { width: 90px; height: 90px; font-size: 48px; }
.vbar { position: absolute; left: 70px; right: 70px; top: 1170px; font-size: 32px; font-weight: 700; color: #94a3b8; }
.vgone { position: absolute; left: 0; right: 0; top: 760px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 130px; text-shadow: 0 10px 60px rgba(0,0,0,.9); z-index: 9; }
.vrow { position: absolute; left: 0; right: 0; top: 1190px; display: flex; justify-content: center; gap: 18px; }
.vrow .x { font-size: 44px; padding: 14px 26px; border-radius: 999px; background: rgba(239,68,68,.14); border: 3px solid #ef4444; }
.vquote { position: absolute; left: 70px; right: 70px; top: 420px; font-family: "Space Grotesk"; font-weight: 700; font-size: 76px; line-height: 1.12; letter-spacing: -.02em; }
.vyes { position: absolute; left: 0; right: 0; top: 1010px; line-height: 1.15; text-align: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 130px; } .vyes b { color: #4ade80; }
.vphoto { position: absolute; left: 0; right: 0; top: 160px; height: 760px; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, #000 65%, transparent); mask-image: linear-gradient(180deg, #000 65%, transparent); }
.vphoto img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vprice { position: absolute; left: 0; right: 0; top: 860px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; }
.vprice small { display: block; font-size: 52px; color: #cbd5e1; } .vprice b { font-size: 230px; letter-spacing: -.05em; line-height: 1; }
.vchips { position: absolute; left: 60px; right: 60px; top: 1170px; display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; }
.vchips .chip { font-size: 40px; }
.vurl { position: absolute; left: 40px; right: 40px; top: 960px; padding: 30px 10px; white-space: nowrap; border-radius: 40px; text-align: center; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); box-shadow: 0 30px 80px rgba(255,90,10,.45); font-family: "Space Grotesk"; font-weight: 700; }
.vurl small { display: block; font-size: 40px; opacity: .92; } .vurl b { display: block; font-size: 52px; letter-spacing: -.02em; margin-top: 6px; }
.vfin { position: absolute; left: 0; right: 0; top: 1190px; line-height: 1.12; text-align: center; font-family: "Space Grotesk"; font-weight: 700; font-size: 64px; }
`;

export const SCENES = [
  {
    id: "hook", music: "pulse", lead: 0.15,
    lines: [
      "I stopped asking customers for Google reviews.",
      { t: "Every time I asked, they smiled and said, “Of course!”", say: "Every time I asked, they smiled, and said... of course!" },
      { t: "And almost none of them ever did.", gap: 0.45 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.js(`tl.fromTo("${c.q(".vt span")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: ${(a.dur / 9).toFixed(3)}, ease: "power3.out" }, ${a.start.toFixed(3)});`);
      c.in("@shop", c.S, { y: 0, d: 0.6 });
      c.in("@owner", b.start - 0.2, { x: -60, y: 0 });
      c.in("@cust", b.start - 0.1, { x: 60, y: 0 });
      c.pop("@bub", b.start + b.dur * 0.6);
      mood(c, "@cust", "grin", b.start + b.dur * 0.5);
      talk(c, "@cust", b.start + b.dur * 0.6, b.dur * 0.35);
      c.out("@bub", d.start);
      c.to("@cust", { x: 700, duration: 1.4, ease: "power1.in" }, d.start);
      c.sfx("chime", d.start + 0.2);
      mood(c, "@owner", "sad", d.start + 0.3);
      c.pop("@count", d.start + d.dur * 0.4);
      c.sfx("thud", d.start + d.dur * 0.4);
      return `<div class="vt xl" style="top:230px">${"I stopped asking for Google reviews.".split(" ").map((w) => `<span style="display:inline-block"${w === "Google" ? ' class="g"' : ""}>${w}</span>`).join(" ")}</div>
      <div class="vshop h" id="@shop"><div class="mirror"></div><div class="pole"></div></div>
      <div class="pos" style="left:150px;top:820px">${who("extra7", "smile", 220, "@owner")}</div>
      <div class="pos" style="left:640px;top:820px">${who("extra2", "smile", 220, "@cust")}</div>
      <div class="bub alt h" id="@bub" style="left:470px;top:700px">“Of course!” 😊</div>
      <div class="vcount h" id="@count"><span>New reviews</span><b>0</b></div>`;
    },
  },
  {
    id: "why", music: "pulse",
    lines: [
      "Because a review takes five steps.",
      "Open Google, search your name, find the listing, scroll down, and tap, write a review.",
      { t: "Hours later. By then, the moment's gone.", say: "Hours later. By then... the moment's gone.", gap: 0.45 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@h", a.start);
      c.pop("@five", a.start + a.dur * 0.5);
      [0, 0.17, 0.4, 0.58, 0.76].forEach((p, i) => {
        const t = b.start + b.dur * p;
        c.in(`@s${i}`, t, { x: 40, y: 0, d: 0.4 });
        c.to("@bar", { scaleX: [0.78, 0.58, 0.4, 0.26, 0.12][i], duration: 0.4 }, t);
        c.sfx("tick", t);
      });
      c.in("@barw", b.start, { y: 20 });
      c.js(`tl.to("${c.q(".step")}", { opacity: 0.06, duration: 0.5, stagger: 0.06 }, ${(d.start + d.dur * 0.4).toFixed(3)});`);
      c.pop("@gone", d.start + d.dur * 0.5);
      c.sfx("buzz", d.start + d.dur * 0.5);
      return `<div class="kicker h" id="@h" style="left:70px;top:230px">What a review takes</div>
      <div class="badge h" id="@five" style="left:600px;top:310px">5 steps<br><small>hours later</small></div>
      <div class="vsteps">${["Open Google", "Search your name", "Find the listing", "Scroll down", "Tap “Write a review”"].map((s, i) => `<div class="step h" id="@s${i}"><span class="num">${i + 1}</span>${s}</div>`).join("")}</div>
      <div class="vbar h" id="@barw"><span>Chance they still do it</span><div class="bart"><div class="bar" id="@bar"></div></div></div>
      <div class="vgone h" id="@gone">…gone.</div>`;
    },
  },
  {
    id: "tap", music: "pulse",
    lines: [
      { t: "So now, I hand them this.", gap: 0.3 },
      "They tap it with their phone, and my Google review form opens. Instantly.",
      "No app. No QR code. No searching.",
      { t: "They tap five stars and post it, before they even leave.", gap: 0.45 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@t", a.start, { y: 40 });
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, y: 400, rotationY: -120 }, { autoAlpha: 1, y: 0, rotationY: -16, rotationX: 8, duration: 1, ease: "power3.out" }, ${(a.start + 0.2).toFixed(3)});`);
      c.sfx("whoosh", a.start + 0.2);
      const tap = b.start + b.dur * 0.3;
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 300, y: 120, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -5, duration: 0.8, ease: "power2.out" }, ${(tap - 0.8).toFixed(3)});`);
      c.js(`tl.fromTo("${c.q(".ring")}", { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 1, stagger: 0.22, ease: "power2.out" }, ${tap.toFixed(3)});`);
      c.sfx("tap", tap);
      c.js(`tl.set("${c.q("@lock")}", { autoAlpha: 0 }, ${(tap + 0.3).toFixed(3)}); tl.fromTo("${c.q("@form")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${(tap + 0.3).toFixed(3)});`);
      c.sfx("ding", tap + 0.35);
      [0, 0.3, 0.6].forEach((p, i) => { c.pop(`@x${i}`, d.start + d.dur * p); c.sfx("tick", d.start + d.dur * p); });
      c.js(`tl.to("${c.q(".rs")}", { color: "#fbbc04", scale: 1.25, duration: 0.16, stagger: 0.1, ease: "back.out(3)" }, ${(e.start + 0.1).toFixed(3)}); tl.to("${c.q(".rs")}", { scale: 1, duration: 0.18, stagger: 0.1 }, ${(e.start + 0.26).toFixed(3)});`);
      c.js(`tl.fromTo("${c.q("@form-type")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${(e.dur * 0.3).toFixed(2)}, ease: "steps(30)" }, ${(e.start + e.dur * 0.3).toFixed(3)});`);
      c.js(`tl.to("${c.q("@form-post")}", { backgroundColor: "#16a34a", scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, ${(e.start + e.dur * 0.68).toFixed(3)});`);
      c.sfx("pop", e.start + e.dur * 0.68);
      c.js(`tl.to("${c.q(".vrow .x")}", { autoAlpha: 0, duration: 0.25 }, ${(e.start + e.dur * 0.68).toFixed(3)});`);
      c.pop("@posted", e.start + e.dur * 0.72);
      return `<div class="vt l h" id="@t" style="top:220px">I hand them <span class="o">this.</span></div>
      <div class="stage3d" style="left:70px;top:520px">${card3d("@card", "h sm")}</div>
      <div class="rings" style="left:330px;top:820px"><i class="ring"></i><i class="ring"></i><i class="ring"></i></div>
      <div class="pos" style="left:500px;top:420px;transform:scale(.92);transform-origin:0 0">${phone("@ph", `<div class="lock" id="@lock"><b>9:41</b><small>Tuesday</small></div><div class="formw h" id="@form">${reviewForm("@form")}</div>`, "h")}</div>
      <div class="vrow"><span class="x h" id="@x0">✕ No app</span><span class="x h" id="@x1">✕ No QR</span><span class="x h" id="@x2">✕ No search</span></div>
      <div class="posted h" id="@posted" style="left:0;right:0;top:1190px;margin:0 auto;width:fit-content;z-index:9">✓ Review posted</div>`;
    },
  },
  {
    id: "say", music: "soft",
    lines: [
      "Here's all I say.",
      { t: "“Would you mind tapping this real quick? It opens my Google reviews. Takes ten seconds.”", say: "Would you mind tapping this, real quick? It opens my Google reviews. Takes ten seconds." },
      { t: "They say yes, and the review happens right there, while they're still smiling.", gap: 0.45 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@h", a.start);
      c.in("@q", b.start - 0.1, { y: 30 });
      c.js(`tl.fromTo("${c.q(".qw")}", { opacity: 0.18 }, { opacity: 1, duration: 0.2, stagger: ${(b.dur / 15).toFixed(3)} }, ${b.start.toFixed(3)});`);
      c.pop("@ten", b.start + b.dur * 0.85);
      c.to("@q", { opacity: 0.4, duration: 0.6 }, d.start);
      c.pop("@yes", d.start + 0.2);
      c.sfx("ding", d.start + 0.2);
      const q = "“Would you mind tapping this real quick? It opens my Google reviews. Takes ten seconds.”";
      return `<div class="kicker h" id="@h" style="left:70px;top:300px">All I say</div>
      <div class="vquote h" id="@q">${q.split(" ").map((w) => `<span class="qw">${w}</span>`).join(" ")}</div>
      <div class="pill h" id="@ten" style="left:70px;top:880px">⏱ 10 seconds</div>
      <div class="vyes h" id="@yes">They say <b>yes.</b></div>`;
    },
  },
  {
    id: "offer", music: "pulse",
    lines: [
      { t: "One card is $16.99.", say: "One card is sixteen ninety-nine." },
      { t: "You pay once. No subscription. And shipping is free in the US.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@photo", c.S, { y: 0, scale: 1.06, d: 1 });
      c.to("@photo img", { scale: 1.1, duration: c.E - c.S, ease: "none" }, c.S);
      c.pop("@price", a.start + a.dur * 0.35);
      c.sfx("ding", a.start + a.dur * 0.35);
      [0, 0.3, 0.6].forEach((p, i) => c.in(`@k${i}`, b.start + b.dur * p, { y: 30 }));
      return `<div class="vphoto h" id="@photo"><img src="assets/img/card-hero.webp" alt=""></div>
      <div class="vprice h" id="@price"><small>One card</small><b>$16.99</b></div>
      <div class="vchips"><span class="chip h" id="@k0">Pay once</span><span class="chip h" id="@k1">No subscription</span><span class="chip h" id="@k2">Free US shipping</span></div>`;
    },
  },
  {
    id: "cta", music: "soft", pad: 2.6,
    lines: [
      { t: "Get yours at ceoturbo.com/google-review-cards.", say: "Get yours at C.E.O. Turbo dot com, slash google review cards." },
      { t: "Link in bio. Stop asking. Start handing them this.", say: "Link in bio... Stop asking. Start handing them this.", gap: 0.3 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, rotationY: -140, y: 200 }, { autoAlpha: 1, rotationY: -14, rotationX: 6, y: 0, duration: 1.2, ease: "power3.out" }, ${c.S.toFixed(3)});`);
      c.js(`tl.to("${c.q("@card")}", { rotationY: 14, duration: ${(c.E - c.S - 1.2).toFixed(2)}, ease: "sine.inOut" }, ${(c.S + 1.2).toFixed(3)});`);
      c.pop("@url", a.start + 0.3);
      c.sfx("ding", a.start + 0.3);
      c.in("@fin", b.start + b.dur * 0.3, { y: 30 });
      return `<div class="stage3d" style="left:310px;top:190px">${card3d("@card", "h")}</div>
      <div class="vurl h" id="@url"><small>Tap card · from $16.99 · link in bio</small><b>ceoturbo.com/google-review-cards</b></div>
      <div class="vfin h" id="@fin">Stop asking.<br><span class="o">Start handing them this.</span></div>`;
    },
  },
];
