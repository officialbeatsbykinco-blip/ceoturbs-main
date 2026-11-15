// 9:16 cut of "Her Food Was Better. So Why Was Their Restaurant Packed?" for Reels, TikTok and Shorts (~75 s, hook first).
// Same voice, captions and pipeline as restaurant-reviews.mjs; its own vertical layouts, reusing that script's art.
// Safe zone: content stays inside y 200–1380 (captions sit just above the app buttons) and x 60–1020.
// Nina, Casa Nina and The Copper Fork are fictional (on screen from the first second). Real facts only:
// $16.99 / $99.99 packs and free US shipping (src/config/site.ts), Google's no-incentive rule.
import { CSS as LONG_CSS, IMAGES as LONG_IMAGES, nina, luis, tent, table, room, store, heads, row, pack, FORK, BISTRO, NINA, count, ripple } from "./restaurant-reviews.mjs";
import { T, who, mood, talk } from "./website-story.mjs";
import { card3d, reviewForm, phone as bigPhone } from "./stop-asking.mjs";

export const SIZE = [1080, 1920];
export const TITLE = "Her Food Was Better. So Why Was Their Restaurant Packed? (9:16)";
export const SLUG = "restaurant-reviews-short";
export const LINKS = { cards: "ceoturbo.com/google-review-cards" };
export const IMAGES = LONG_IMAGES;

const sky = () => `<div class="rr-street v"><div class="stars">${Array.from({ length: 30 }, (_, i) => `<i style="left:${(i * 137) % 1060}px;top:${(i * 71) % 200 + 20}px"></i>`).join("")}</div></div>`;
/** A storefront placed at a given height (the long cut pins them to one street row). */
const at = (y, html) => `<div style="position:absolute;left:0;top:${y - 170}px;width:1080px;height:600px">${html}</div>`;
const LINE = ["gary", "juno", "extra4", "extra3", "banker", "extra1"];

export const CSS = LONG_CSS + `
.bg { background: radial-gradient(900px 900px at 20% 10%, #16233f 0%, transparent 60%), radial-gradient(900px 900px at 90% 100%, #2a1608 0%, transparent 60%), #070b14; }
.s-cta .bg { background: radial-gradient(900px 1000px at 60% 45%, #3a1c06 0%, transparent 65%), radial-gradient(800px 700px at 10% 0%, #15284a 0%, transparent 60%), #060910; }
.cap { bottom: 400px; max-width: 960px; font-size: 50px; padding: 16px 30px; }
.rr-street.v { background: linear-gradient(180deg, #050a1a 0%, #0d1733 40%, #111a33 100%); }
.rr-room { background: linear-gradient(180deg, #3b1d14 0%, #4a2618 58%, #2a140c 58%); }
.rr-room .frame { display: none; }
.vt { position: absolute; left: 60px; right: 60px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -.03em; line-height: 1.02; text-transform: uppercase; z-index: 8; }
.vnote { position: absolute; left: 0; right: 0; top: 206px; text-align: center; font-size: 24px; font-weight: 600; color: #94a3b8; z-index: 8; }
.vchip { position: absolute; left: 0; right: 0; margin: 0 auto; width: fit-content; padding: 16px 30px; border-radius: 999px; font-weight: 800; font-size: 38px; white-space: nowrap; z-index: 9; }
.vstep { display: flex; align-items: center; gap: 22px; width: 860px; padding: 22px 30px; border-radius: 24px; background: rgba(15,23,42,.94); border: 3px solid #334155; font-size: 44px; font-weight: 800; }
.vstep b { width: 64px; height: 64px; border-radius: 50%; background: #475569; display: flex; align-items: center; justify-content: center; font-size: 34px; flex: none; }
.vsteps { position: absolute; left: 110px; top: 470px; display: flex; flex-direction: column; gap: 18px; }
.vrow { position: absolute; left: 0; right: 0; top: 1170px; display: flex; justify-content: center; gap: 18px; z-index: 9; }
.vrow .x { font-size: 40px; font-weight: 800; padding: 14px 26px; border-radius: 999px; background: rgba(34,197,94,.16); border: 3px solid #22c55e; }
.vquote { position: absolute; left: 70px; right: 70px; padding: 44px 50px; border-radius: 40px; background: #fff; color: #0b1220; font-family: "Space Grotesk"; font-weight: 700; font-size: 62px; line-height: 1.14; letter-spacing: -.02em; box-shadow: 0 40px 100px rgba(0,0,0,.5); }
.vquote small { display: block; margin-top: 20px; font-family: "Inter"; font-size: 32px; font-weight: 700; color: #64748b; letter-spacing: 0; }
.vrule { position: absolute; left: 70px; right: 70px; display: flex; align-items: center; gap: 30px; padding: 30px 36px; border-radius: 30px; background: rgba(15,23,42,.94); border: 3px solid #ef4444; font-family: "Space Grotesk"; font-weight: 700; font-size: 54px; line-height: 1.1; }
.vrule span { width: 100px; height: 100px; border-radius: 50%; background: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 60px; flex: none; }
.vrule.ok { border-color: #22c55e; } .vrule.ok span { background: #16a34a; }
.vnotifs { position: absolute; left: 110px; top: 300px; display: flex; flex-direction: column; gap: 18px; }
.vnotifs .rr-notif { width: 860px; } .vnotifs .rr-notif b { font-size: 30px; } .vnotifs .rr-notif small { font-size: 28px; }
.vphoto { position: absolute; left: 0; right: 0; top: 180px; height: 580px; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent); mask-image: linear-gradient(180deg, #000 70%, transparent); }
.vphoto img { width: 100%; height: 100%; object-fit: cover; display: block; }
.vprice { position: absolute; left: 0; right: 0; top: 790px; text-align: center; font-family: "Space Grotesk"; font-weight: 700; }
.vprice small { display: block; font-size: 52px; color: #cbd5e1; } .vprice b { font-size: 210px; letter-spacing: -.05em; line-height: 1; }
.vchips { position: absolute; left: 50px; right: 50px; top: 1075px; display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
.vchips .chip { font-size: 36px; padding: 14px 28px; }
.vurl { position: absolute; left: 40px; right: 40px; top: 1180px; padding: 26px 10px; white-space: nowrap; border-radius: 40px; text-align: center; background: linear-gradient(180deg, #ff8a3d, #ff5a0a); box-shadow: 0 30px 80px rgba(255,90,10,.45); font-family: "Space Grotesk"; font-weight: 700; z-index: 9; }
.vurl small { display: block; font-size: 36px; opacity: .92; } .vurl b { display: block; font-size: 52px; letter-spacing: -.02em; margin-top: 4px; }
`;

export const SCENES = [
  // ───────── 1. Hook ─────────
  {
    id: "hook", chapter: "Better food, empty tables", music: "soft", lead: 0.15,
    lines: [
      "Her food was better.",
      "But every Friday, the restaurant across the street was packed, and hers was half empty.",
      { t: "So what were they doing that she wasn't?", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", c.S, { y: 30, d: 0.4 });
      c.in("@fic", c.S + 0.2, { y: 20 });
      c.in("@nina", a.start + 0.1, { x: -120, y: 0 });
      c.pop("@love", a.start + a.dur * 0.6);
      c.sfx("pop", a.start + a.dur * 0.6);
      c.to("@nina, @love", { autoAlpha: 0, duration: 0.35 }, b.start - 0.1);
      c.to("@t", { autoAlpha: 0, y: -30, duration: 0.3 }, b.start - 0.15);
      c.in("@fork", b.start, { x: -80, y: 0, d: 0.7 });
      c.sfx("chime", b.start + 0.1);
      c.js(`tl.fromTo("${c.q("@line .who")}", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.14, ease: "power2.out" }, ${T(b.start + 0.4)});`);
      c.in("@casa", b.start + b.dur * 0.55, { x: 80, y: 0, d: 0.7 });
      c.pop("@empty", b.start + b.dur * 0.85);
      c.sfx("thud", b.start + b.dur * 0.85);
      c.js(`tl.fromTo("${c.q("@empty")}", { x: 0 }, { x: 12, duration: 0.06, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, ${T(b.start + b.dur * 0.85 + 0.5)});`);
      c.in("@why", d.start, { scale: 0.8 });
      c.sfx("whoosh", d.start);
      return `${sky()}
      <div class="vt h" id="@t" style="top:240px;font-size:92px">Her food was<br /><span class="o">better.</span></div>
      <div class="vchip h" id="@fic" style="top:1240px;font-size:28px;background:rgba(15,23,42,.92);border:2px solid #334155;font-weight:700">Nina is fictional. Every step in her story is real.</div>
      <div class="pos h" id="@nina" style="left:180px;top:520px">${nina("grin", 280, "@n")}</div>
      <div class="bub h" id="@love" style="left:470px;top:620px;white-space:normal;width:500px">“Best tacos in town!” 😍</div>
      ${at(260, store("@fork", "The Copper Fork", 160, "h", heads(["extra1", "extra2", "extra6", "extra7", "extra5"])))}
      <div class="rr-line" id="@line" style="left:170px;top:590px">${LINE.map((g, k) => who(g, "smile", 84, `@ln${k}`)).join("")}</div>
      ${at(820, store("@casa", "Casa Nina", 160, "nina dim h", heads(["frank", "okafor"], 260)))}
      <div class="vchip h" id="@empty" style="top:1130px;background:#ef4444">Half empty 😬</div>
      <div class="vt h" id="@why" style="top:240px;font-size:84px;padding:20px 0;background:rgba(7,11,20,.88);border-radius:30px">Why is <span class="o">theirs</span><br />packed?</div>`;
    },
  },
  // ───────── 2. The search ─────────
  {
    id: "decide", chapter: "Where hungry people decide", music: "pulse",
    lines: [
      { t: "It wasn't the food. Hungry people search restaurants near me.", say: "It wasn't the food. Hungry people search... restaurants near me." },
      { t: "The Copper Fork has 612 reviews. Nina has 23.", say: "The Copper Fork has six hundred and twelve reviews. Nina has twenty-three." },
      { t: "Her rating is higher. But 23 reviews looks like a place nobody goes.", say: "Her rating is higher. But twenty-three reviews looks like a place nobody goes.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.in("@srch", a.start + a.dur * 0.35, { y: 300, d: 0.6 });
      const v = `q_${c.id("x").replace(/-/g, "_")}`;
      c.js(`const ${v} = { n: 0 }, ${v}s = "restaurants near me"; tl.fromTo(${v}, { n: 0 }, { n: ${v}s.length, duration: 1.2, ease: "none", onUpdate: () => { document.getElementById("${c.id("srch-q")}").textContent = ${v}s.slice(0, Math.round(${v}.n)); } }, ${T(a.start + a.dur * 0.5)});`);
      for (let k = 0; k < 7; k++) c.sfx("tap", a.start + a.dur * 0.5 + k * 0.17);
      c.js(`tl.fromTo("${c.q(".ws-res")}", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.18, ease: "power3.out" }, ${T(b.start)});`);
      c.js(`tl.to("${c.q("@r0")}", { scale: 1.04, boxShadow: "0 0 0 5px #22c55e", duration: 0.3 }, ${T(b.start + b.dur * 0.25)}); tl.to("${c.q("@r0")}", { scale: 1, boxShadow: "0 0 0 0px #22c55e", duration: 0.3 }, ${T(b.start + b.dur * 0.6)}); tl.to("${c.q("@r2")}", { scale: 1.05, duration: 0.3 }, ${T(b.start + b.dur * 0.65)});`);
      c.sfx("ding", b.start + b.dur * 0.25);
      c.pop("@low", d.start + d.dur * 0.55);
      c.sfx("buzz", d.start + d.dur * 0.55);
      c.pop("@pick", d.start + d.dur * 0.85);
      c.sfx("thud", d.start + d.dur * 0.85);
      return `<div class="vt h" id="@t" style="top:240px;font-size:84px">It wasn't<br /><span class="o">the food.</span></div>
      ${pack("@srch", "", row("🍴", "The Copper Fork", "4.7", "612", "American · $$ · 0.3 mi", "h", "@r0") + BISTRO.replace('class="ws-res "', 'class="ws-res h"') + NINA("23", "you h", "@r2"), `style="left:150px;top:470px"`)}
      <div class="vchip h" id="@low" style="top:1080px;background:#ef4444">Only 23? 🤨</div>
      <div class="vchip h" id="@pick" style="top:1200px;background:#16a34a">🚗 Heading to The Copper Fork</div>
      <div class="vnote">Illustrative example. Restaurant names and review counts are made up.</div>`;
    },
  },
  // ───────── 3. The ask that fails ─────────
  {
    id: "ask", chapter: "Why “leave us a review” fails", music: "soft",
    lines: [
      { t: "Nina's servers asked every table: “Leave us a review on Google!”", say: "Nina's servers asked every table... leave us a review on Google!" },
      { t: "Everyone said yes. Almost nobody did it.", say: "Everyone said yes... Almost nobody did it." },
      { t: "Because the old way takes five steps, on a full stomach, on the way home.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@luis", a.start, { x: -80, y: 0 });
      c.in("@tb", a.start + 0.2, { y: 40 });
      c.pop("@b1", a.start + a.dur * 0.45);
      talk(c, "@luis", a.start + a.dur * 0.45, a.dur * 0.5);
      c.out("@b1", b.start);
      c.js(`tl.set("${c.q("@tb [class^='m-']")}", { opacity: 0 }, ${T(b.start)}); tl.set("${c.q("@tb .m-grin")}", { opacity: 1 }, ${T(b.start)});`);
      c.pop("@b2", b.start + 0.1);
      c.out("@b2", b.start + b.dur * 0.5);
      c.js(`tl.to("${c.q("@tb .rr-guest")}", { x: 900, duration: 1.4, ease: "power1.in", stagger: 0.12 }, ${T(b.start + b.dur * 0.5)});`);
      c.sfx("whoosh", b.start + b.dur * 0.55);
      mood(c, "@luis", "sad", b.start + b.dur * 0.75);
      c.to("@luis, @tb", { autoAlpha: 0, duration: 0.35 }, d.start - 0.1);
      [0.05, 0.16, 0.27, 0.38, 0.49].forEach((p, i) => { c.in(`@s${i}`, d.start + d.dur * p, { x: -40, y: 0, d: 0.4 }); c.sfx("tick", d.start + d.dur * p); });
      c.js(`tl.to("${c.q(".vstep b")}", { backgroundColor: "#ef4444", duration: 0.2, stagger: 0.1 }, ${T(d.start + d.dur * 0.62)});`);
      c.pop("@never", d.start + d.dur * 0.8);
      c.sfx("thud", d.start + d.dur * 0.8);
      return `${room()}
      <div class="pos h" id="@luis" style="left:90px;top:560px">${luis("smile", 240, "@lu")}</div>
      ${table("@tb", 560, 720, ["extra1", "extra2"], { card: false })}
      <div class="bub h" id="@b1" style="left:60px;top:300px;white-space:normal;width:960px;text-align:center">“Leave us a review on Google!” 🙏</div>
      <div class="bub alt h" id="@b2" style="left:420px;top:470px">“Of course!” 😊</div>
      <div class="vsteps">${["Open Google", "Search “Casa Nina”", "Find the right listing", "Scroll down to reviews", "Tap “Write a review”"].map((s, i) => `<div class="vstep h" id="@s${i}"><b>${i + 1}</b>${s}</div>`).join("")}</div>
      <div class="rr-stamp h" id="@never" style="left:290px;top:1130px">NEVER</div>`;
    },
  },
  // ───────── 4. The card ─────────
  {
    id: "card", chapter: "One tap card on every table", music: "pulse",
    lines: [
      "So Nina put a tap card on every table.",
      "Guests hold their phone near it, and her Google review page opens. No app. No searching.",
      { t: "Pick the stars, write a sentence, post. About ten seconds.", say: "Pick the stars... write a sentence... post. About ten seconds.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", a.start, { y: 30 });
      ["@ta", "@tb", "@tc"].forEach((s, i) => c.in(s, a.start + 0.1 + i * 0.12, { y: 40 }));
      ["@ta", "@tb", "@tc"].forEach((s, i) => { c.pop(`${s}c`, a.start + a.dur * 0.55 + i * 0.22); c.sfx("pop", a.start + a.dur * 0.55 + i * 0.22); });
      c.js(`tl.fromTo("${c.q(".rr-tent")}", { boxShadow: "0 0 24px rgba(251,188,4,.7)" }, { boxShadow: "0 0 50px rgba(251,188,4,1)", duration: 0.35, yoyo: true, repeat: 1, immediateRender: false }, ${T(a.end - 0.4)});`);
      c.to("@room, @t, @ta, @tb, @tc", { autoAlpha: 0, duration: 0.35 }, b.start - 0.1);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, y: 400, rotationY: -120 }, { autoAlpha: 1, y: 0, rotationY: -16, rotationX: 8, duration: 0.9, ease: "power3.out" }, ${T(b.start)});`);
      c.sfx("whoosh", b.start);
      const tap = b.start + b.dur * 0.3;
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 300, y: 120, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -5, duration: 0.8, ease: "power2.out" }, ${T(tap - 0.8)});`);
      c.js(`tl.fromTo("${c.q(".ring")}", { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 1, stagger: 0.22, ease: "power2.out" }, ${T(tap)});`);
      c.sfx("tap", tap);
      c.js(`tl.set("${c.q("@lock")}", { autoAlpha: 0 }, ${T(tap + 0.3)}); tl.fromTo("${c.q("@form")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${T(tap + 0.3)});`);
      c.sfx("ding", tap + 0.35);
      [0.68, 0.84].forEach((p, i) => { c.pop(`@x${i}`, b.start + b.dur * p); c.sfx("tick", b.start + b.dur * p); });
      c.js(`tl.to("${c.q(".rs")}", { color: "#fbbc04", scale: 1.25, duration: 0.16, stagger: 0.1, ease: "back.out(3)" }, ${T(d.start + 0.1)}); tl.to("${c.q(".rs")}", { scale: 1, duration: 0.18, stagger: 0.1 }, ${T(d.start + 0.26)});`);
      c.js(`tl.fromTo("${c.q("@form-type")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${T(d.dur * 0.25)}, ease: "steps(30)" }, ${T(d.start + d.dur * 0.25)});`);
      c.js(`tl.to("${c.q("@form-post")}", { backgroundColor: "#16a34a", scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, ${T(d.start + d.dur * 0.5)});`);
      c.sfx("pop", d.start + d.dur * 0.5);
      c.to("@x0, @x1", { autoAlpha: 0, duration: 0.25 }, d.start + d.dur * 0.55);
      c.pop("@ten", d.start + d.dur * 0.62);
      c.sfx("ding", d.start + d.dur * 0.62);
      return `<div id="@room">${room()}</div>
      <div class="vt h" id="@t" style="top:240px;font-size:84px">One card.<br /><span class="o">Every table.</span></div>
      ${table("@ta", 80, 560, ["extra6", "extra2"])}${table("@tb", 640, 560, ["okafor"])}${table("@tc", 360, 900, ["gary", "juno"])}
      <div class="stage3d" style="left:60px;top:470px">${card3d("@card", "h sm")}</div>
      <div class="rings" style="left:320px;top:770px"><i class="ring"></i><i class="ring"></i><i class="ring"></i></div>
      <div class="pos" style="left:500px;top:300px;transform:scale(.98);transform-origin:0 0">${bigPhone("@ph", `<div class="lock" id="@lock"><b>8:14</b><small>Friday</small></div><div class="formw h" id="@form">${reviewForm("@form").replace("Your Business", "Casa Nina").replace("Amazing work, so fast and friendly!", "Best mole I've ever had!")}</div>`, "h")}</div>
      <div class="vrow"><span class="x h" id="@x0">✓ No app</span><span class="x h" id="@x1">✓ No searching</span></div>
      <div class="vchip h" id="@ten" style="top:1170px;background:#fbbc04;color:#1f1300">⏱ About 10 seconds</div>`;
    },
  },
  // ───────── 5. The moment + the rule ─────────
  {
    id: "moment", chapter: "When to ask, and Google's rule", music: "soft",
    lines: [
      { t: "The trick is when you ask. Right when a guest says, “that was amazing.”", say: "The trick is when you ask. Right when a guest says... that was amazing." },
      { t: "“If you've got ten seconds, tap your phone right here.” Then walk away.", say: "If you've got ten seconds, tap your phone right here... Then walk away." },
      { t: "And no free dessert for reviews. Google doesn't allow it.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@t", a.start, { y: 30 });
      c.pop("@wow", a.start + a.dur * 0.6);
      c.sfx("ding", a.start + a.dur * 0.6);
      c.to("@wow", { autoAlpha: 0, duration: 0.3 }, b.start - 0.1);
      c.in("@q", b.start, { scale: 0.9 });
      c.js(`tl.fromTo("${c.q(".qw")}", { opacity: 0.18 }, { opacity: 1, duration: 0.2, stagger: ${(b.dur * 0.7 / 10).toFixed(3)} }, ${T(b.start)});`);
      c.in("@walk", b.start + b.dur * 0.8, { y: 20 });
      c.to("@t, @q, @walk", { autoAlpha: 0, duration: 0.35 }, d.start - 0.1);
      c.in("@k", d.start, { y: 20 });
      c.in("@r0", d.start + 0.15, { x: -60, y: 0 }); c.sfx("thud", d.start + 0.3);
      c.in("@r1", d.start + d.dur * 0.65, { x: -60, y: 0 }); c.sfx("chime", d.start + d.dur * 0.65);
      const q = "“If you've got ten seconds, tap your phone right here.”";
      return `<div class="vt h" id="@t" style="top:240px;font-size:84px">It's not the card.<br /><span class="o">It's the moment.</span></div>
      <div class="bub alt h" id="@wow" style="left:0;right:0;margin:0 auto;width:fit-content;top:700px;font-size:60px">“That was amazing!” 🤤</div>
      <div class="vquote h" id="@q" style="top:560px">${q.split(" ").map((w) => `<span class="qw">${w}</span>`).join(" ")}<small>It opens our Google reviews.</small></div>
      <div class="vchip h" id="@walk" style="top:1150px;background:#16a34a">🚶 Then walk away. No hovering.</div>
      <div class="vt h" id="@k" style="top:300px;font-size:70px">Google's <span class="g">rule</span></div>
      <div class="vrule h" id="@r0" style="top:520px"><span>✕</span>No free dessert<br />for a review</div>
      <div class="vrule ok h" id="@r1" style="top:780px"><span>✓</span>Ask every table<br />the same way</div>`;
    },
  },
  // ───────── 6. The climb ─────────
  {
    id: "climb", chapter: "From 23 reviews to the top", music: "pulse",
    lines: [
      "The first weekend, she got eleven new reviews.",
      { t: "Week after week, 23 became 150.", say: "Week after week... twenty-three became a hundred and fifty." },
      { t: "Then one night, someone searched, and Casa Nina showed up first.", say: "Then one night, someone searched... and Casa Nina showed up first.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      ["@n0", "@n1", "@n2"].forEach((s, i) => { const t = a.start + a.dur * (0.05 + i * 0.25); c.in(s, t, { x: 80, y: 0 }); c.sfx("ding", t); });
      c.in("@ctr", a.start + a.dur * 0.3, { scale: 0.7 });
      count(c, "cnt", 23, 34, a.start + a.dur * 0.35, a.dur * 0.6);
      c.to("@n0, @n1, @n2", { autoAlpha: 0, y: -40, duration: 0.35 }, b.start - 0.1);
      c.to("@ctr", { y: -560, duration: 0.6, ease: "power2.inOut" }, b.start - 0.1);
      c.js(`const cv2_${c.id("x").replace(/-/g, "_")} = { v: 34 }; tl.fromTo(cv2_${c.id("x").replace(/-/g, "_")}, { v: 34 }, { v: 152, duration: ${T(b.dur - 0.3)}, ease: "power1.inOut", onUpdate: () => { document.getElementById("${c.id("cnt")}").textContent = Math.round(cv2_${c.id("x").replace(/-/g, "_")}.v); } }, ${T(b.start + 0.4)});`);
      for (let k = 0; k < 14; k++) c.sfx("tick", b.start + 0.4 + k * ((b.dur - 0.3) / 14));
      c.js(`tl.fromTo("${c.q("@spark path")}", { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: ${T(b.dur)}, ease: "power1.inOut" }, ${T(b.start + 0.2)});`);
      c.to("@ctr", { autoAlpha: 0, duration: 0.35 }, d.start - 0.1);
      c.in("@srch", d.start, { y: 300, d: 0.6 });
      c.js(`tl.to("${c.q("@r2")}", { y: -268, duration: 0.9, ease: "power3.inOut" }, ${T(d.start + d.dur * 0.6)}); tl.to("${c.q("@r0")}, ${c.q("@r1")}", { y: 134, duration: 0.9, ease: "power3.inOut" }, ${T(d.start + d.dur * 0.6)});`);
      c.sfx("whoosh", d.start + d.dur * 0.6);
      c.sfx("ding", d.start + d.dur * 0.6 + 0.9);
      c.pop("@one", d.start + d.dur * 0.6 + 0.9);
      c.in("@fine", d.start + d.dur * 0.6 + 1.1, { y: 20 });
      const N = ["Amazing food and fast service", "The horchata!! 😍", "Our new favorite spot"];
      return `<div class="vnotifs">${N.map((s, i) => `<div class="rr-notif h" id="@n${i}"><div class="ic">G</div><div><b>New review · Casa Nina</b><small><span>★★★★★</span> ${s}</small></div></div>`).join("")}</div>
      <div class="ws-stat h" id="@ctr" style="left:140px;top:860px;width:800px;text-align:center;z-index:5"><span>Casa Nina's Google reviews</span><b id="@cnt" style="font-size:190px">23</b>
        <svg id="@spark" viewBox="0 0 700 140" style="width:100%;height:140px;margin-top:10px"><path d="M10 130 C120 125 180 110 260 96 S420 60 520 40 S640 16 690 10" stroke="#fbbc04" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"/></svg></div>
      ${pack("@srch", "restaurants near me", FORK("640").replace('class="ws-res "', 'class="ws-res " id="@r0"') + BISTRO.replace('class="ws-res "', 'class="ws-res " id="@r1"') + NINA("152", "you", "@r2"), `style="left:150px;top:420px"`)}
      <div class="vchip h" id="@one" style="top:1030px;background:#fbbc04;color:#1f1300;font-size:48px">#1 🎉</div>
      <div class="vchip h" id="@fine" style="top:1160px;font-size:28px;background:rgba(15,23,42,.92);border:2px solid #334155;font-weight:700">Google decides rankings. No one can guarantee them.</div>
      <div class="vnote">Illustrative example. Names, review counts and positions are made up.</div>`;
    },
  },
  // ───────── 7. Packed ─────────
  {
    id: "packed", chapter: "Friday night, packed", music: "pulse",
    lines: [
      "Now on Friday nights, there's a wait at Casa Nina.",
      { t: "Same food. Same street. Now people can see how good it is.", say: "Same food. Same street... Now people can see how good it is.", gap: 0.5 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@clock", a.start, { y: -30 });
      c.sfx("chime", a.start + 0.1);
      c.in("@casa", a.start + 0.1, { y: 80, d: 0.7 });
      c.js(`tl.fromTo("${c.q("@casa .rr-head")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12, ease: "back.out(1.6)" }, ${T(a.start + a.dur * 0.3)});`);
      c.js(`tl.fromTo("${c.q("@line .who")}", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.14, ease: "power2.out" }, ${T(a.start + a.dur * 0.55)});`);
      c.sfx("pop", a.start + a.dur * 0.55);
      c.in("@nina", a.start + a.dur * 0.7, { x: -80, y: 0 });
      c.in("@same", b.start + b.dur * 0.4, { y: 40 });
      c.sfx("chime", b.start + b.dur * 0.5);
      return `${sky()}
      <div class="vchip" id="@clock" style="top:240px;background:rgba(15,23,42,.9);border:3px solid #fbbf24;font-size:40px">🕢 Friday · 7:30 PM</div>
      ${at(420, store("@casa", "Casa Nina", 160, "nina h", heads(["frank", "okafor", "extra2", "gary", "extra7"])))}
      <div class="rr-line" id="@line" style="left:170px;top:940px">${["juno", "extra4", "extra3", "banker", "extra1", "dale"].map((g, k) => who(g, "grin", 84, `@ln${k}`)).join("")}</div>
      <div class="pos h" id="@nina" style="left:770px;top:640px">${nina("grin", 200, "@n")}</div>
      <div class="vt h" id="@same" style="top:1170px;font-size:58px;padding:20px 0;background:rgba(7,11,20,.9);border-radius:28px;border:3px solid #fbbc04">Same food.<br /><span class="o">Now people can see it.</span></div>
      <div class="vnote">Illustrative example.</div>`;
    },
  },
  // ───────── 8. CTA ─────────
  {
    id: "cta", chapter: "Get cards for your tables", music: "soft", pad: 2.6,
    lines: [
      { t: "Review cards start at $16.99, with free US shipping.", say: "Review cards start at sixteen ninety-nine, with free U.S. shipping." },
      { t: "Ten cards, enough for most dining rooms, are $99.99. Link in bio.", say: "Ten cards, enough for most dining rooms, are ninety-nine ninety-nine... Link in bio.", gap: 0.3 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@photo", c.S, { y: 0, scale: 1.06, d: 1 });
      c.to("@photo img", { scale: 1.1, duration: c.E - c.S, ease: "none" }, c.S);
      c.pop("@price", a.start + a.dur * 0.35);
      c.sfx("ding", a.start + a.dur * 0.35);
      c.in("@k0", a.start + a.dur * 0.75, { y: 30 });
      c.in("@k1", b.start + b.dur * 0.2, { y: 30 });
      c.in("@k2", b.start + b.dur * 0.4, { y: 30 });
      c.pop("@url", b.start + b.dur * 0.7);
      c.sfx("ding", b.start + b.dur * 0.7);
      return `<div class="vphoto h" id="@photo"><img src="assets/img/stack.webp" alt="" /></div>
      <div class="vprice h" id="@price"><small>Tap cards from</small><b>$16.99</b></div>
      <div class="vchips"><span class="chip h" id="@k0">Free US shipping</span><span class="chip h" id="@k1">10 cards $99.99</span><span class="chip h" id="@k2">Pay once</span></div>
      <div class="vurl h" id="@url"><small>One on every table · link in bio</small><b>ceoturbo.com/google-review-cards</b></div>`;
    },
  },
];
