// "I Stopped Asking for Google Reviews. I Started Handing Them This." (video title #1 in ads/viral-video-titles.md)
// Long-form 16:9 animated explainer. Each scene: narration lines (one voice file each) + draw(c), which returns
// the scene's HTML and schedules its animation against the real line times (c.L[i].start / .end).
// Selectors: "@x" means this scene's element id="@x"; ".x" is scoped to this scene.
// Prices, packs, shipping and returns come from src/config/site.ts; ad numbers from src/content/results.ts.
// Review counts in the map-pack mock are labeled "Illustrative example" (there is no client review-count data).
import { cardFront, cardBack } from "../../src/lib/card-faces.ts";
import { person } from "../five-stars/cast.mjs";

export const TITLE = "I Stopped Asking for Google Reviews. I Started Handing Them This.";
export const SLUG = "stop-asking";
export const LINKS = { cards: "ceoturbo.com/google-review-cards", call: "ceoturbo.com/brand-boost" };

export const G = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
export const STAR = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
export const stars = (n = 5, cls = "st") => Array.from({ length: n }, () => `<i class="${cls}">${STAR}</i>`).join("");

/** A phone with an arbitrary screen. */
export const phone = (id, screen, cls = "") => `<div class="phone ${cls}" id="${id}"><div class="notch"></div><div class="screen">${screen}</div></div>`;
/** The Google review form as it opens after a tap. */
export const reviewForm = (p) => `<div class="rf">
  <div class="rf-top"><span class="rf-x">✕</span><span class="rf-g">${G}</span></div>
  <div class="rf-biz">Your Business</div><div class="rf-sub">Posting publicly across Google</div>
  <div class="rf-stars" id="${p}-stars">${stars(5, "rs")}</div>
  <div class="rf-box"><span class="rf-type" id="${p}-type">Amazing work, so fast and friendly!</span><span class="rf-caret"></span></div>
  <div class="rf-post" id="${p}-post">Post</div>
</div>`;
export const card3d = (id, cls = "") => `<div class="c3d ${cls}" id="${id}"><div class="face front">${cardFront()}</div><div class="face back">${cardBack()}</div></div>`;
export const who = (id, mood, w = 240, extra = "") => `<div class="who" id="${extra}" style="width:${w}px;height:${w * 2.25}px">${person(id, mood)}</div>`;
export const mood = (c, sel, m, t) => c.js(`tl.set("${c.q(sel)} [class^='m-']", { opacity: 0 }, ${t.toFixed(3)}); tl.set("${c.q(sel)} .m-${m}", { opacity: 1 }, ${t.toFixed(3)});`);
export const talk = (c, sel, t, d) => c.js(`tl.to("${c.q(sel)} .talk", { opacity: 1, duration: 0.09, yoyo: true, repeat: ${2 * Math.floor(d / 0.18) + 1}, ease: "steps(1)" }, ${t.toFixed(3)});`);

export const SCENES = [
  // ───────────────────────── 1. Cold open ─────────────────────────
  {
    id: "open", chapter: "The thing I used to say", music: "soft",
    lines: [
      "For years, I asked every single customer the same thing.",
      { t: "“Hey, if you get a chance, leave us a Google review!”", say: "Hey! If you get a chance... leave us a Google review." },
      "And every time, they smiled and said, “Oh, of course.”",
      { t: "Almost none of them ever did.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@shop", c.S, { y: 0, d: 1 });
      c.in("@owner", c.S + 0.3, { x: -80, y: 0 });
      c.in("@cust", c.S + 0.5, { x: 80, y: 0 });
      c.in("@yrs", a.start, { y: 20 });
      c.pop("@b1", b.start);
      talk(c, "@owner", b.start, b.dur);
      c.out("@b1", b.end + 0.2);
      c.pop("@b2", d.start + d.dur * 0.55);
      mood(c, "@cust", "grin", d.start);
      talk(c, "@cust", d.start + d.dur * 0.55, d.dur * 0.4);
      c.out("@b2", d.end + 0.1);
      c.to("@cust", { x: 1200, duration: 2.2, ease: "power1.in" }, d.end + 0.1);
      c.sfx("chime", d.end + 0.3);
      c.in("@count", e.start, { y: 30 });
      mood(c, "@owner", "sad", e.start + 0.4);
      c.js(`tl.fromTo("${c.q("@zero")}", { scale: 1.6, color: "#ffffff" }, { scale: 1, color: "#ff6b2c", duration: 0.5, ease: "back.out(3)" }, ${(e.start + 0.5).toFixed(3)});`);
      c.sfx("thud", e.start + 0.5);
      return `<div class="set shop" id="@shop"><div class="wall"></div><div class="floor"></div><div class="mirror"></div><div class="chair"></div><div class="pole"></div></div>
      <div class="pos" style="left:520px;top:330px">${who("extra7", "smile", 240, "@owner")}</div>
      <div class="pos" style="left:1060px;top:330px">${who("extra2", "smile", 240, "@cust")}</div>
      <div class="bub h" id="@b1" style="left:250px;top:150px">“If you get a chance, leave us a review!” 🙏</div>
      <div class="bub h alt" id="@b2" style="left:1130px;top:170px">“Oh, of course!” 😊</div>
      <div class="kicker h" id="@yrs" style="left:120px;top:90px">For years…</div>
      <div class="counter h" id="@count"><span>New Google reviews this week</span><b id="@zero">0</b></div>`;
    },
  },
  // ───────────────────────── 2. Title ─────────────────────────
  {
    id: "title", chapter: "What I hand them now", music: "soft", lead: 0.2,
    lines: [
      "So I stopped asking.",
      { t: "And I started handing them this.", gap: 1.2 },
    ],
    draw(c) {
      const [a, b] = c.L;
      c.in("@l1", a.start, { y: 50 });
      c.in("@l2", b.start, { y: 50 });
      c.sfx("whoosh", b.start + b.dur * 0.6);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, y: 500, rotationY: -160, rotationX: 20 }, { autoAlpha: 1, y: 0, rotationY: 20, rotationX: 6, duration: 1.4, ease: "power3.out" }, ${(b.start + b.dur * 0.6).toFixed(3)});`);
      c.js(`tl.to("${c.q("@card")}", { rotationY: -14, duration: 3, ease: "sine.inOut" }, ${(b.start + b.dur * 0.6 + 1.4).toFixed(3)});`);
      c.in("@glow", b.start + b.dur * 0.6, { y: 0, d: 1.2 });
      c.sfx("ding", b.end + 0.4);
      return `<div class="glow h" id="@glow"></div>
      <div class="ttl"><div class="h" id="@l1">I stopped asking for <span class="g">Google reviews.</span></div><div class="h big" id="@l2">I started handing them <span class="o">this.</span></div></div>
      <div class="stage3d" style="left:1240px;top:150px">${card3d("@card", "h")}</div>`;
    },
  },
  // ───────────────────────── 3. They weren't lying ─────────────────────────
  {
    id: "truth", chapter: "Why asking doesn't work", music: "soft",
    lines: [
      "Here's what I didn't understand back then.",
      "My customers weren't lying to me. They really did mean to leave a review.",
      { t: "The problem was everything that had to happen after they walked out the door.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@h", a.start);
      c.in("@heart", b.start, { scale: 0.6 });
      c.in("@t1", b.start + 0.4, { x: -40, y: 0 });
      c.in("@door", d.start, { y: 0 });
      c.in("@walk", d.start + 0.3, { x: -40, y: 0 });
      c.to("@walk", { x: 640, duration: d.dur, ease: "none" }, d.start + 0.3);
      c.in("@later", d.start + d.dur * 0.6, { scale: 0.7 });
      return `<div class="kicker h" id="@h" style="left:140px;top:120px">What I didn't understand</div>
      <div class="pos h" id="@heart" style="left:140px;top:260px;font-size:160px">💛</div>
      <div class="note h" id="@t1" style="left:340px;top:290px">They <b>meant</b> it.<br>Every single time.</div>
      <div class="door h" id="@door"><div class="frame"></div><div class="sign">THANK YOU!</div></div>
      <div class="pos h" id="@walk" style="left:980px;top:470px">${who("extra2", "smile", 180)}</div>
      <div class="tag h" id="@later" style="left:1480px;top:330px">“I'll do it later.”</div>`;
    },
  },
  // ───────────────────────── 4. The five steps ─────────────────────────
  {
    id: "steps", chapter: "The 5 steps that kill a review", music: "pulse",
    lines: [
      "Think about what a review actually takes.",
      "They have to pull out their phone, open Google, and search for your business.",
      "Then find the right listing, scroll down to the reviews, and tap “Write a review.”",
      "That's five steps, hours later, for someone who has already moved on with their day.",
      "Every one of those steps is a place where the review quietly dies.",
      { t: "Their kid calls. Dinner's ready. A text pops up. And it's gone.", say: "Their kid calls. Dinner's ready. A text pops up... And it's gone.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f, g] = c.L;
      c.in("@h", a.start);
      c.in("@ph", a.start + 0.3, { y: 60 });
      const marks = [b.start + 0.2, b.start + b.dur * 0.38, b.start + b.dur * 0.62, d.start + 0.2, d.start + d.dur * 0.42];
      marks.forEach((t, i) => {
        c.in(`@s${i}`, t, { x: 40, y: 0, d: 0.45 });
        c.js(`tl.set("${c.q(`@scr${i}`)}", { autoAlpha: 1 }, ${t.toFixed(3)});`);
        if (i) c.js(`tl.set("${c.q(`@scr${i - 1}`)}", { autoAlpha: 0 }, ${t.toFixed(3)});`);
        c.to("@bar", { scaleX: [0.78, 0.58, 0.4, 0.26, 0.15][i], duration: 0.5, ease: "power2.out" }, t);
        c.sfx("tick", t);
      });
      c.in("@barw", b.start, { y: 20 });
      c.pop("@five", e.start);
      c.js(`tl.to("${c.q(".step")}", { opacity: 0.35, duration: 0.6, stagger: 0.12 }, ${f.start.toFixed(3)});`);
      [0, 0.24, 0.5].forEach((p, i) => { c.pop(`@n${i}`, g.start + g.dur * p); c.sfx("buzz", g.start + g.dur * p); });
      c.to("@ph", { opacity: 0.25, y: 40, duration: 0.8 }, g.start + g.dur * 0.78);
      c.pop("@gone", g.start + g.dur * 0.8);
      const screens = [
        `<div class="hs">${["📷", "💬", "🎵", "🗺️", "📧", "⚙️", "🛒", G].map((x) => `<span>${x}</span>`).join("")}</div>`,
        `<div class="gs"><div class="glogo">${G}</div><div class="sbar">Search</div></div>`,
        `<div class="gs"><div class="sbar on">your business near me<span class="caret"></span></div><div class="res"></div><div class="res"></div><div class="res"></div></div>`,
        `<div class="gs"><div class="lst">${["A+ Cuts", "Your Business", "Fresh Fade Co.", "Main St Barbers"].map((n, i) => `<div class="li${i === 1 ? " on" : ""}"><b>${n}</b><small>${stars(5, "mini")}</small></div>`).join("")}</div></div>`,
        `<div class="gs"><div class="biz">Your Business</div><div class="tabs"><span>Overview</span><span class="on">Reviews</span><span>Photos</span></div><div class="wr">✎ Write a review</div><div class="res"></div><div class="res"></div></div>`,
      ];
      return `<div class="kicker h" id="@h" style="left:120px;top:80px">What a review actually takes</div>
      <div class="pos" style="left:150px;top:180px">${phone("@ph", screens.map((s, i) => `<div class="scr" id="@scr${i}" style="opacity:0;visibility:hidden">${s}</div>`).join(""), "h")}</div>
      <div class="steps">${["Pull out the phone", "Open Google", "Search your business", "Find the right listing", "Scroll and tap “Write a review”"].map((s, i) => `<div class="step h" id="@s${i}"><span class="num">${i + 1}</span>${s}</div>`).join("")}</div>
      <div class="barw h" id="@barw"><span>Chance they still do it</span><div class="bart"><div class="bar" id="@bar"></div></div><em>illustration</em></div>
      <div class="badge h" id="@five" style="left:1500px;top:110px">5 steps<br><small>hours later</small></div>
      <div class="notif h" id="@n0" style="left:640px;top:250px">📞 <b>Mom</b> is calling…</div>
      <div class="notif h" id="@n1" style="left:700px;top:400px">🍝 Dinner's ready!</div>
      <div class="notif h" id="@n2" style="left:640px;top:550px">💬 <b>3 new messages</b></div>
      <div class="gone h" id="@gone">…and it's gone.</div>`;
    },
  },
  // ───────────────────────── 5. The moment ─────────────────────────
  {
    id: "moment", chapter: "The best moment to ask", music: "soft",
    lines: [
      "And here's the part that really got me.",
      "The best moment to get a review is the moment your customer is happiest.",
      "That's the mirror reveal after a fresh cut. The first look at a clean yard. The second their phone turns back on.",
      "Right then, they'd tell anyone how good you are.",
      { t: "But an hour later, that feeling has faded. And so has the review.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@h", a.start);
      c.in("@chart", b.start, { y: 30 });
      c.js(`tl.fromTo("${c.q("@curve")}", { strokeDashoffset: 2000 }, { strokeDashoffset: 0, duration: ${(b.dur + 0.5).toFixed(2)}, ease: "power1.inOut" }, ${b.start.toFixed(3)});`);
      c.pop("@peak", b.start + b.dur * 0.75);
      c.sfx("ding", b.start + b.dur * 0.75);
      [0, 0.36, 0.68].forEach((p, i) => c.in(`@v${i}`, d.start + d.dur * p, { y: 40, scale: 0.9 }));
      c.js(`tl.to("${c.q(".vig")}", { y: -10, duration: 0.6, yoyo: true, repeat: 3, stagger: 0.2, ease: "sine.inOut" }, ${e.start.toFixed(3)});`);
      c.in("@say", e.start, { scale: 0.8 });
      c.js(`{ const pa = document.getElementById("${c.id("curve")}"), dt = document.getElementById("${c.id("dot")}"), L = pa.getTotalLength(), pr = { p: 0.22 };
        const place = () => { const q = pa.getPointAtLength(L * pr.p); dt.style.transform = "translate(" + (90 + q.x - 18) + "px," + (190 + q.y - 18) + "px)"; };
        tl.set(dt, { autoAlpha: 1 }, ${b.start.toFixed(3)}); tl.call(place, null, ${b.start.toFixed(3)});
        tl.to(pr, { p: 1, duration: ${(f.dur * 0.9).toFixed(2)}, ease: "none", onUpdate: place }, ${f.start.toFixed(3)}); }`);
      c.in("@fade", f.start + f.dur * 0.5, { y: 20 });
      c.to(".vig", { opacity: 0.35, filter: "grayscale(1)", duration: 1.2 }, f.start + f.dur * 0.4);
      return `<div class="kicker h" id="@h" style="left:120px;top:70px">When to ask</div>
      <svg class="chart h" id="@chart" viewBox="0 0 1100 520" style="left:90px;top:190px;width:1100px;height:520px">
        <line x1="40" y1="470" x2="1080" y2="470" stroke="#334155" stroke-width="4"/><line x1="40" y1="30" x2="40" y2="470" stroke="#334155" stroke-width="4"/>
        <text x="20" y="20" fill="#94a3b8" font-size="26" font-family="Inter" font-weight="700">How happy they are</text>
        <path id="@curve" d="M40 440 C 160 420, 200 80, 260 70 S 420 260, 560 330 S 900 420, 1080 430" fill="none" stroke="#fbbc04" stroke-width="10" stroke-linecap="round" stroke-dasharray="2000"/>
        ${["Job done", "Tonight", "Tomorrow", "Next week"].map((s, i) => `<text x="${[260, 520, 760, 1000][i]}" y="505" text-anchor="middle" fill="#cbd5e1" font-size="26" font-family="Inter" font-weight="700">${s}</text>`).join("")}
      </svg>
      <div class="dot h" id="@dot"></div>
      <div class="flag h" id="@peak" style="left:440px;top:200px">⭐ Ask <b>here</b></div>
      <div class="vigs">${[["💈", "The mirror reveal"], ["🌿", "The fresh-cut lawn"], ["📱", "The phone turns back on"]].map(([em, s], i) => `<div class="vig h" id="@v${i}"><span>${em}</span><b>${s}</b></div>`).join("")}</div>
      <div class="tag h" id="@say" style="left:1270px;top:780px">“You're the best!” 🤩</div>
      <div class="note h" id="@fade" style="left:760px;top:270px;font-size:52px">An hour later…<br><span class="dim">the feeling fades.</span></div>`;
    },
  },
  // ───────────────────────── 6. The tap ─────────────────────────
  {
    id: "tap", chapter: "One tap: how the card works", music: "pulse",
    lines: [
      "So now, I don't ask them to remember anything.",
      "I hold out this card, right there, while they're still smiling.",
      "They tap it with their phone, and my Google review form opens. Instantly.",
      "No searching. No scrolling. No app to download.",
      { t: "They pick the stars, type a line, and hit post. Before they've even left.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@h", a.start);
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, x: -300, rotationY: -70 }, { autoAlpha: 1, x: 0, rotationY: -18, rotationX: 8, duration: 1.1, ease: "power3.out" }, ${b.start.toFixed(3)});`);
      c.in("@hand", b.start + 0.4, { y: 60 });
      const tap = d.start + d.dur * 0.32;
      c.js(`tl.fromTo("${c.q("@ph")}", { autoAlpha: 0, x: 400, y: 100, rotation: 12 }, { autoAlpha: 1, x: 0, y: 0, rotation: -6, duration: 0.9, ease: "power2.out" }, ${(tap - 0.9).toFixed(3)});`);
      c.js(`tl.fromTo("${c.q(".ring")}", { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.6, autoAlpha: 0, duration: 1.1, stagger: 0.25, ease: "power2.out" }, ${tap.toFixed(3)});`);
      c.sfx("tap", tap);
      c.js(`tl.set("${c.q("@lock")}", { autoAlpha: 0 }, ${(tap + 0.35).toFixed(3)}); tl.fromTo("${c.q("@form")}", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, ${(tap + 0.35).toFixed(3)});`);
      c.sfx("ding", tap + 0.4);
      c.pop("@fast", d.start + d.dur * 0.82);
      ["@x0", "@x1", "@x2"].forEach((s, i) => { c.pop(s, e.start + e.dur * [0.02, 0.34, 0.64][i]); c.sfx("tick", e.start + e.dur * [0.02, 0.34, 0.64][i]); });
      c.js(`tl.to("${c.q(".rs")}", { color: "#fbbc04", scale: 1.25, duration: 0.18, stagger: 0.12, ease: "back.out(3)" }, ${(f.start + 0.2).toFixed(3)}); tl.to("${c.q(".rs")}", { scale: 1, duration: 0.2, stagger: 0.12 }, ${(f.start + 0.38).toFixed(3)});`);
      c.js(`tl.fromTo("${c.q("@form-type")}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${(f.dur * 0.35).toFixed(2)}, ease: "steps(30)" }, ${(f.start + f.dur * 0.3).toFixed(3)});`);
      c.js(`tl.to("${c.q("@form-post")}", { backgroundColor: "#16a34a", scale: 1.08, duration: 0.2, yoyo: true, repeat: 1 }, ${(f.start + f.dur * 0.7).toFixed(3)});`);
      c.sfx("pop", f.start + f.dur * 0.7);
      c.pop("@posted", f.start + f.dur * 0.74);
      return `<div class="kicker h" id="@h" style="left:120px;top:80px">What I do now</div>
      <div class="stage3d" style="left:330px;top:250px">${card3d("@card", "h sm")}</div>
      <div class="hand h" id="@hand">✋</div>
      <div class="rings" style="left:600px;top:560px"><i class="ring"></i><i class="ring"></i><i class="ring"></i></div>
      <div class="pos" style="left:760px;top:120px">${phone("@ph", `<div class="lock" id="@lock"><b>9:41</b><small>Tuesday</small></div><div class="formw h" id="@form">${reviewForm("@form")}</div>`, "h")}</div>
      <div class="pill h" id="@fast" style="left:1290px;top:200px">⚡ Opens in about 3 seconds</div>
      <div class="xs"><div class="x h" id="@x0">✕ No searching</div><div class="x h" id="@x1">✕ No scrolling</div><div class="x h" id="@x2">✕ No app</div></div>
      <div class="posted h" id="@posted">✓ Review posted</div>`;
    },
  },
  // ───────────────────────── 7. Real product ─────────────────────────
  {
    id: "real", chapter: "Works on iPhone and Android", music: "pulse",
    lines: [
      { t: "It works on every iPhone from the XS on up, and on Android phones with NFC, which is most of them.", say: "It works on every iPhone, from the ten S on up... and on Android phones with N F C, which is most of them." },
      "There's no QR code to line up, no camera to open, and no link to type.",
      { t: "And it's waterproof and wallet size, so it lives in your pocket, your truck, or your tool bag.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      c.in("@photo", c.S, { y: 0, scale: 1.08, d: 1.2 });
      c.to("@photo img", { scale: 1.12, duration: c.E - c.S, ease: "none" }, c.S);
      c.in("@p0", a.start + 0.3, { x: 50, y: 0 });
      c.in("@p1", a.start + a.dur * 0.55, { x: 50, y: 0 });
      c.in("@p2", b.start + 0.2, { x: 50, y: 0 });
      c.in("@p3", d.start + 0.2, { x: 50, y: 0 });
      c.in("@p4", d.start + d.dur * 0.5, { x: 50, y: 0 });
      return `<div class="photo h" id="@photo"><img src="assets/img/card-tap.webp" alt=""></div>
      <div class="specs">
        <div class="spec h" id="@p0"><span>📱</span><b>iPhone XS and newer</b></div>
        <div class="spec h" id="@p1"><span>🤖</span><b>NFC Android phones</b></div>
        <div class="spec h" id="@p2"><span>🚫</span><b>No QR, no camera, no typing</b></div>
        <div class="spec h" id="@p3"><span>💧</span><b>Waterproof PVC</b></div>
        <div class="spec h" id="@p4"><span>👛</span><b>Wallet size</b></div>
      </div>`;
    },
  },
  // ───────────────────────── 8. What I say ─────────────────────────
  {
    id: "script", chapter: "Exactly what I say", music: "soft",
    lines: [
      "Here's exactly what I say when I hand it over.",
      { t: "“I'm really glad you're happy with it. Would you mind tapping this real quick? It opens my Google reviews. Takes ten seconds.”", say: "I'm really glad you're happy with it. Would you mind tapping this, real quick? It opens my Google reviews. Takes ten seconds." },
      "That's it. No pressure. No long speech.",
      { t: "When the ask takes ten seconds, people say yes. And the review happens right there, while they're still in the chair.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@h", a.start);
      c.in("@q", b.start, { y: 30 });
      c.js(`tl.fromTo("${c.q(".qw")}", { opacity: 0.18 }, { opacity: 1, duration: 0.2, stagger: ${(b.dur / 26).toFixed(3)} }, ${b.start.toFixed(3)});`);
      c.in("@ten", b.start + b.dur * 0.86, { scale: 0.6 });
      c.in("@nop", d.start, { y: 20 });
      c.to("@q", { scale: 0.9, y: -60, opacity: 0.55, duration: 0.8 }, e.start);
      c.pop("@yes", e.start + e.dur * 0.3);
      c.sfx("ding", e.start + e.dur * 0.3);
      const q = "“I'm really glad you're happy with it. Would you mind tapping this real quick? It opens my Google reviews. Takes ten seconds.”";
      return `<div class="kicker h" id="@h" style="left:120px;top:90px">The whole script</div>
      <div class="quote h" id="@q">${q.split(" ").map((w) => `<span class="qw">${w}</span>`).join(" ")}</div>
      <div class="pill h" id="@ten" style="left:1420px;top:110px">⏱ 10 seconds</div>
      <div class="nop h" id="@nop">No pressure · No speech · No bribes</div>
      <div class="yes h" id="@yes">They say <b>yes.</b></div>`;
    },
  },
  // ───────────────────────── 9. Where to keep it ─────────────────────────
  {
    id: "where", chapter: "Where to keep your card", music: "pulse",
    lines: [
      "I keep one in my wallet, and one on the counter by the register.",
      "If you run a crew, put one in every truck. If you run a restaurant, leave one on every table.",
      { t: "And for anyone who'd rather review later, the free setup tool makes a QR code for your receipts and invoices.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d] = c.L;
      const at = [a.start + 0.3, a.start + a.dur * 0.55, b.start + 0.2, b.start + b.dur * 0.55, d.start + d.dur * 0.45];
      at.forEach((t, i) => { c.in(`@w${i}`, t, { y: 60, scale: 0.92 }); c.sfx("tick", t); });
      c.in("@photo", c.S, { y: 0, d: 1 });
      return `<div class="photo side h" id="@photo"><img src="assets/img/card-counter.webp" alt=""></div>
      <div class="kicker" style="left:120px;top:80px">Where it lives</div>
      <div class="grid5">${[["👛", "Your wallet", "Hold it out at the door"], ["🧾", "The counter", "Right by the register"], ["🛻", "Every truck", "One per crew"], ["🍽️", "Every table", "Tap while they wait"], ["🔳", "Receipts", "Free QR for later"]].map(([e, t, s], i) => `<div class="tile h" id="@w${i}"><span>${e}</span><b>${t}</b><small>${s}</small></div>`).join("")}</div>`;
    },
  },
  // ───────────────────────── 10. Rules ─────────────────────────
  {
    id: "rules", chapter: "Do it the right way (Google's rules)", music: "soft",
    lines: [
      "One important thing. Do this the right way.",
      "Ask every customer, not just the happy ones.",
      "Never offer a discount or a freebie in exchange for a review.",
      { t: "And reply to your reviews, the good and the bad. The next customer is reading.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@h", a.start);
      [b, d, e].forEach((l, i) => { c.in(`@r${i}`, l.start + 0.1, { x: -60, y: 0 }); c.sfx(i === 1 ? "buzz" : "ding", l.start + 0.3); });
      return `<div class="kicker h" id="@h" style="left:120px;top:110px">Play by Google's rules</div>
      <div class="rules">
        <div class="rule ok h" id="@r0"><span>✓</span><p>Ask <b>every</b> customer</p></div>
        <div class="rule no h" id="@r1"><span>✕</span><p>No discounts or freebies for reviews</p></div>
        <div class="rule ok h" id="@r2"><span>✓</span><p>Reply to every review, good and bad</p></div>
      </div>`;
    },
  },
  // ───────────────────────── 11. Why it matters ─────────────────────────
  {
    id: "matters", chapter: "Why reviews mean more calls", music: "pulse",
    lines: [
      "So why does any of this matter?",
      "Because when someone nearby searches for what you do, Google shows them a short list of local businesses.",
      "And the ones with more recent reviews and better ratings tend to get the call.",
      { t: "Reviews aren't vanity. They're the reason your phone rings. Or doesn't.", say: "Reviews aren't vanity. They're the reason your phone rings... Or doesn't.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@h", a.start);
      c.in("@map", b.start, { y: 40 });
      c.js(`tl.from("${c.q(".mp")}", { autoAlpha: 0, x: 60, duration: 0.5, stagger: 0.25, ease: "power3.out" }, ${(b.start + b.dur * 0.6).toFixed(3)});`);
      c.to("@m0", { boxShadow: "0 0 0 6px #fbbc04, 0 30px 80px rgba(251,188,4,.35)", duration: 0.5 }, d.start + d.dur * 0.4);
      c.pop("@ring", d.start + d.dur * 0.65);
      c.js(`tl.to("${c.q("@ring")}", { rotation: 14, duration: 0.07, yoyo: true, repeat: 15, ease: "none" }, ${(d.start + d.dur * 0.7).toFixed(3)});`);
      c.sfx("ring", d.start + d.dur * 0.7);
      c.to("@m2", { opacity: 0.4, duration: 0.6 }, e.start);
      c.pop("@vain", e.start + 0.2);
      const biz = [["Top Notch Cuts", "4.8", "312"], ["Fresh Fade Co.", "4.7", "198"], ["Your Business", "4.9", "12"]];
      return `<div class="kicker h" id="@h" style="left:120px;top:80px">Why it matters</div>
      <div class="map h" id="@map"><div class="mapbg"><i style="left:120px;top:90px"></i><i style="left:330px;top:210px"></i><i class="me" style="left:480px;top:120px"></i></div>
        <div class="mq">barber near me</div>
        ${biz.map(([n, r, k], i) => `<div class="mp" id="@m${i}"><div><b>${n}</b><span class="rt">${r} ${stars(5, "mini")} <em>(${k})</em></span></div>${i === 0 ? `<div class="callb">📞 Call</div>` : ""}</div>`).join("")}
        <div class="illu">Illustrative example</div></div>
      <div class="callicon h" id="@ring" style="left:1420px;top:220px">📞</div>
      <div class="note h" id="@vain" style="left:1250px;top:520px;width:560px">Reviews aren't vanity.<br><span class="o">They're phone calls.</span></div>`;
    },
  },
  // ───────────────────────── 12. Setup ─────────────────────────
  {
    id: "setup", chapter: "2-minute setup", music: "soft",
    lines: [
      "Setting it up takes about two minutes.",
      "Our setup guide finds your review link, and you write it to the card from your phone.",
      { t: "Or pick “Program it for me,” and it shows up ready to tap.", say: "Or pick, program it for me, and it shows up ready to tap." },
      { t: "You pay once. There's no subscription, and you can re-program it anytime.", gap: 0.6 },
    ],
    draw(c) {
      const [a, b, d, e] = c.L;
      c.in("@h", a.start);
      c.pop("@clock", a.start + 0.4);
      c.in("@k0", b.start + 0.2, { y: 40 });
      c.in("@k1", b.start + b.dur * 0.55, { y: 40 });
      c.in("@k2", d.start + 0.2, { y: 40, scale: 0.9 });
      c.in("@k3", e.start + 0.1, { y: 30 });
      c.in("@k4", e.start + e.dur * 0.35, { y: 30 });
      c.in("@k5", e.start + e.dur * 0.7, { y: 30 });
      return `<div class="kicker h" id="@h" style="left:120px;top:90px">Setup</div>
      <div class="clock h" id="@clock">⏱ ~2 min</div>
      <div class="flow">
        <div class="fs h" id="@k0"><b>1</b>Setup guide finds your review link</div>
        <div class="fs h" id="@k1"><b>2</b>Write it to the card from your phone</div>
        <div class="fs alt h" id="@k2"><b>or</b>“Program it for me” ($5): arrives ready to tap</div>
      </div>
      <div class="chips"><span class="chip h" id="@k3">Pay once</span><span class="chip h" id="@k4">No subscription</span><span class="chip h" id="@k5">Re-program anytime</span></div>`;
    },
  },
  // ───────────────────────── 13. Offer ─────────────────────────
  {
    id: "offer", chapter: "Prices and where to get one", music: "pulse",
    lines: [
      { t: "One card is $16.99.", say: "One card is sixteen ninety-nine." },
      { t: "Two are $29.99, and that's what most people grab: one for the pocket, one for the counter.", say: "Two are twenty-nine ninety-nine. And that's what most people grab. One for the pocket, one for the counter." },
      "There's a five-pack for your crew, and a ten-pack for busy shops.",
      "Shipping is free in the US, and if it's not right for you, you can return it within five days.",
      { t: "Go to ceoturbo.com/google-review-cards and grab yours.", say: "Go to C.E.O. Turbo dot com, slash google review cards... and grab yours.", gap: 0.7 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@k0", a.start, { y: 60 });
      c.in("@k1", b.start, { y: 60 });
      c.pop("@pop", b.start + b.dur * 0.45);
      c.in("@k2", d.start + 0.1, { y: 60 });
      c.in("@k3", d.start + d.dur * 0.55, { y: 60 });
      c.in("@ship", e.start, { y: 20 });
      c.in("@ret", e.start + e.dur * 0.55, { y: 20 });
      c.to(".pk", { y: -40, scale: 0.92, duration: 0.6 }, f.start - 0.2);
      c.pop("@url", f.start + 0.3);
      c.sfx("ding", f.start + 0.3);
      const packs = [["1 card", "$16.99", "One for your pocket"], ["2 cards", "$29.99", "Pocket + counter"], ["5 cards", "$59.99", "Your whole crew"], ["10 cards", "$99.99", "Busy shops"]];
      return `<div class="packs">${packs.map(([q, p, n], i) => `<div class="pk h${i === 1 ? " hot" : ""}" id="@k${i}">${i === 1 ? `<div class="popb h" id="@pop">Most popular</div>` : ""}<small>${q}</small><b>${p}</b><span>${n}</span></div>`).join("")}</div>
      <div class="perks"><span class="h" id="@ship">🚚 Free US shipping</span><span class="h" id="@ret">↩︎ 5-day returns</span></div>
      <div class="url h" id="@url">ceoturbo.com/<b>google-review-cards</b></div>`;
    },
  },
  // ───────────────────────── 14. Call + end ─────────────────────────
  {
    id: "call", chapter: "Want more calls? Book a free call", music: "soft", pad: 3.5,
    lines: [
      "And if you want more than reviews, if you want your phone ringing every week, book a free call with us.",
      "We've run ads for local shops that brought in leads at four eighty-nine, and even four thirty-one each.",
      "On the call, we'll look at your Google profile, your website and your ads, and show you exactly what's holding you back.",
      "Both links are in the description.",
      { t: "Stop asking. Start handing them this.", say: "Stop asking... Start handing them this.", gap: 0.4 },
    ],
    draw(c) {
      const [a, b, d, e, f] = c.L;
      c.in("@h", a.start);
      c.in("@phone", a.start + 0.2, { scale: 0.7 });
      c.js(`tl.to("${c.q("@phone")}", { rotation: 12, duration: 0.07, yoyo: true, repeat: 13, ease: "none" }, ${(a.start + a.dur * 0.5).toFixed(3)});`);
      c.sfx("ring", a.start + a.dur * 0.5);
      c.in("@r0", b.start + b.dur * 0.45, { y: 40 });
      c.in("@r1", b.start + b.dur * 0.75, { y: 40 });
      c.in("@src", b.start + b.dur * 0.8, { y: 10 });
      ["@c0", "@c1", "@c2"].forEach((s, i) => c.in(s, d.start + d.dur * (0.3 + i * 0.12), { x: 40, y: 0 }));
      c.to("@a", { autoAlpha: 0, duration: 0.6 }, e.start - 0.1);
      c.in("@end", e.start, { y: 0, d: 0.8 });
      c.js(`tl.fromTo("${c.q("@card")}", { autoAlpha: 0, rotationY: -120 }, { autoAlpha: 1, rotationY: -16, rotationX: 6, duration: 1.2, ease: "power3.out" }, ${(e.start + 0.2).toFixed(3)});`);
      c.in("@b0", e.start + 0.5, { y: 30 });
      c.in("@b1", e.start + 0.8, { y: 30 });
      c.in("@fin", f.start, { y: 30 });
      c.sfx("ding", f.start + f.dur * 0.55);
      return `<div id="@a">
        <div class="kicker h" id="@h" style="left:120px;top:80px">Want more than reviews?</div>
        <div class="callicon big h" id="@phone" style="left:150px;top:240px">📞</div>
        <div class="res2"><div class="rc h" id="@r0"><b>$4.89</b><span>per lead · water systems</span></div><div class="rc h" id="@r1"><b>$4.31</b><span>per lead · computer repair</span></div></div>
        <div class="src h" id="@src">Real Meta Ads results, unedited · ceoturbo.com/results</div>
        <div class="checks"><div class="ck h" id="@c0">✓ Your Google profile</div><div class="ck h" id="@c1">✓ Your website</div><div class="ck h" id="@c2">✓ Your ads</div></div>
      </div>
      <div class="endc h" id="@end">
        <div class="stage3d" style="left:150px;top:200px">${card3d("@card", "h")}</div>
        <div class="ctas">
          <div class="cta h" id="@b0"><small>Get your review card · from $16.99</small><b>ceoturbo.com/google-review-cards</b></div>
          <div class="cta call h" id="@b1"><small>Free 30-minute Brand Boost call</small><b>ceoturbo.com/brand-boost</b></div>
          <div class="fin h" id="@fin">Stop asking. <span class="o">Start handing them this.</span></div>
        </div>
      </div>`;
    },
  },
];
