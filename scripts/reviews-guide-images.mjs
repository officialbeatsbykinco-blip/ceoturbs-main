// In-article diagrams for the "How to get more Google reviews" guide → public/img/guides/google-reviews/*.webp (1200×675).
// Run: node scripts/reviews-guide-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/img/guides/google-reviews");
await mkdir(OUT, { recursive: true });
const W = 1200;
const H = 675;
const F = "Avenir Next, Helvetica Neue, Arial";
const BLUE = "#1a9fff";
const ORANGE = "#ff8a3d";
const GREEN = "#34d27b";
const RED = "#ff5d5d";
const MUTED = "#9aa8b8";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const frame = (body, title, kicker = "How to get more Google reviews") => `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>
<radialGradient id="ga" cx="85%" cy="10%" r="60%"><stop offset="0" stop-color="${BLUE}" stop-opacity=".30"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient>
<radialGradient id="gb" cx="0%" cy="110%" r="55%"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".22"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".045"/></pattern></defs>
<rect width="100%" height="100%" fill="#05070b"/><rect width="100%" height="100%" fill="url(#grid)"/><rect width="100%" height="100%" fill="url(#ga)"/><rect width="100%" height="100%" fill="url(#gb)"/>
<text x="60" y="66" font-family="${F}" font-weight="600" font-size="20" fill="${MUTED}" letter-spacing="1">${esc(kicker.toUpperCase())}</text>
<text x="60" y="116" font-family="${F}" font-weight="700" font-size="44" fill="#fff" letter-spacing="-1">${esc(title)}</text>
${body}
<text x="${W - 60}" y="${H - 30}" text-anchor="end" font-family="${F}" font-weight="600" font-size="18" fill="${MUTED}">ceoturbo.com</text></svg>`;

const box = (x, y, w, h, stroke = "#2a3442", fill = "#0d131b") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const t = (x, y, s, size = 22, fill = "#e8eef5", weight = 600, anchor = "start") => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F}" font-weight="${weight}" font-size="${size}" fill="${fill}">${esc(s)}</text>`;
const dot = (cx, cy, n, color) => `<circle cx="${cx}" cy="${cy}" r="17" fill="${color}"/>${t(cx, cy + 7, n, 19, "#05070b", 800, "middle")}`;

const images = {
  // 1. The old way (many steps, hours later) vs one tap.
  "old-way-vs-one-tap": frame(
    (() => {
      const old = ["Remember later, at home", "Open Google, search your name", "Find the right listing", "Scroll to Reviews", "Tap “Write a review”", "Pick stars and type"];
      let s = box(60, 160, 520, 450, "#3a2a2a") + t(90, 205, "The usual way", 28, RED, 700) + t(90, 236, "6 steps, usually hours later", 20, MUTED, 600);
      old.forEach((o, i) => (s += dot(108, 285 + i * 52, i + 1, "#5a6573") + t(140, 292 + i * 52, o, 22)));
      s += box(620, 160, 520, 450, BLUE) + t(650, 205, "The one-tap way", 28, BLUE, 700) + t(650, 236, "1 step, before they leave", 20, MUTED, 600);
      s += `<rect x="690" y="290" width="150" height="230" rx="16" fill="#fff"/>${t(765, 335, "Review us on", 15, "#333", 700, "middle")}${t(765, 362, "Google", 26, "#222", 800, "middle")}`;
      s += `<circle cx="765" cy="430" r="38" fill="none" stroke="#4285f4" stroke-width="14"/>${t(765, 498, "★★★★★", 20, "#f5b400", 700, "middle")}`;
      s += `<path d="M870 400 q 28 -22 0 -44 M890 412 q 44 -34 0 -68" fill="none" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<rect x="930" y="300" width="160" height="270" rx="26" fill="#111a24" stroke="#5b6b7d" stroke-width="3"/><rect x="944" y="326" width="132" height="210" rx="10" fill="#f4f7fb"/>`;
      s += t(1010, 360, "Rate this place", 15, "#333", 700, "middle") + t(1010, 395, "★★★★★", 24, "#f5b400", 700, "middle");
      s += `<rect x="958" y="412" width="104" height="70" rx="6" fill="#fff" stroke="#c9d2dc"/><rect x="972" y="500" width="76" height="24" rx="12" fill="#1a73e8"/>`;
      s += dot(674, 588, 1, BLUE) + t(706, 596, "Tap phone on card, form opens", 22, "#fff", 700);
      return s;
    })(),
    "Why happy customers don't leave reviews"
  ),

  // 2. Timing: ask at the high point.
  "ask-at-the-high-point": frame(
    (() => {
      let s = box(60, 150, 1080, 450);
      s += `<line x1="120" y1="520" x2="1090" y2="520" stroke="#3a4552" stroke-width="2"/>`;
      s += `<path d="M120 480 C 260 470, 330 300, 450 250 S 560 236, 600 250 S 760 380, 880 440 S 1030 480, 1090 486" fill="none" stroke="${BLUE}" stroke-width="6" stroke-linecap="round"/>`;
      s += `<circle cx="540" cy="238" r="16" fill="${ORANGE}"/><line x1="540" y1="254" x2="540" y2="520" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 6"/>`;
      s += box(600, 176, 380, 82, ORANGE, "#1c130b") + t(620, 210, "Ask here, with the card", 24, ORANGE, 700) + t(620, 240, "Job done, customer happy, phone in hand", 17, "#e8eef5", 500);
      s += `<circle cx="960" cy="462" r="12" fill="#5a6573"/>` + t(960, 420, "Text sent 3 days later", 19, MUTED, 600, "middle");
      s += t(180, 562, "Booking", 19, MUTED, 600, "middle") + t(390, 562, "The work", 19, MUTED, 600, "middle") + t(560, 562, "Finished / paid", 19, "#fff", 700, "middle") + t(800, 562, "Drive home", 19, MUTED, 600, "middle") + t(1010, 562, "Days later", 19, MUTED, 600, "middle");
      s += t(92, 200, "How the customer feels", 18, MUTED, 600);
      return s;
    })(),
    "Ask at the high point, not days later"
  ),

  // 3. How an NFC review card works.
  "how-nfc-review-card-works": frame(
    (() => {
      const steps = [
        ["Program once", "Your Google review link is", "saved on the card's NFC chip"],
        ["Customer taps", "They hold their phone near", "the card. No app, no camera"],
        ["Form opens", "Google's review form opens", "with your business picked"],
      ];
      let s = "";
      steps.forEach(([h, a, b], i) => {
        const x = 60 + i * 370;
        s += box(x, 170, 340, 400, i === 2 ? BLUE : "#2a3442");
        s += dot(x + 44, 214, i + 1, i === 2 ? BLUE : ORANGE) + t(x + 76, 222, h, 28, "#fff", 700);
        s += t(x + 30, 500, a, 20, "#c8d3df", 500) + t(x + 30, 530, b, 20, "#c8d3df", 500);
        if (i < 2) s += `<path d="M${x + 346} 360 l 18 0 m -8 -9 l 9 9 l -9 9" fill="none" stroke="${MUTED}" stroke-width="3"/>`;
      });
      // icons
      s += `<rect x="150" y="270" width="160" height="104" rx="12" fill="#151d27" stroke="#3a4552"/>${t(230, 314, "g.page/r/…", 20, BLUE, 700, "middle")}${t(230, 346, "/review", 20, BLUE, 700, "middle")}`;
      s += `<path d="M230 386 v 40 m -12 -12 l 12 12 l 12 -12" fill="none" stroke="${MUTED}" stroke-width="3"/>`;
      s += `<rect x="190" y="430" width="80" height="44" rx="6" fill="#fff"/><rect x="214" y="444" width="32" height="16" rx="3" fill="#c7a34a"/>`;
      s += `<rect x="470" y="300" width="100" height="150" rx="10" fill="#fff"/>${t(520, 340, "Google", 18, "#222", 800, "middle")}<circle cx="520" cy="392" r="22" fill="none" stroke="#4285f4" stroke-width="9"/>`;
      s += `<rect x="590" y="270" width="100" height="180" rx="18" fill="#111a24" stroke="#5b6b7d" stroke-width="3"/><path d="M580 340 q -16 15 0 30" fill="none" stroke="${BLUE}" stroke-width="4"/>`;
      s += `<rect x="870" y="260" width="140" height="210" rx="22" fill="#111a24" stroke="#5b6b7d" stroke-width="3"/><rect x="882" y="282" width="116" height="166" rx="8" fill="#f4f7fb"/>`;
      s += t(940, 316, "Your Business", 14, "#333", 700, "middle") + t(940, 350, "★★★★★", 22, "#f5b400", 700, "middle") + `<rect x="894" y="364" width="92" height="52" rx="5" fill="#fff" stroke="#c9d2dc"/><rect x="908" y="424" width="64" height="16" rx="8" fill="#1a73e8"/>`;
      s += t(60, 610, "Works on most NFC-enabled iPhones and Android phones. Customers need to be signed in to Google to post.", 18, MUTED, 500);
      return s;
    })(),
    "How a Google review tap card works"
  ),

  // 4. Where to put cards.
  "where-to-put-review-cards": frame(
    (() => {
      const spots = [
        ["Register or counter", "Where people pay", "Shops, salons, cafés"],
        ["Every table", "Next to the check", "Restaurants, bars"],
        ["In your pocket", "Hand it over at the end", "Plumbers, cleaners, techs"],
        ["Each chair or station", "Before they stand up", "Barbers, nail and lash"],
        ["The truck or van", "On the dash or door", "Mobile and field crews"],
        ["Receipts and texts", "Same link, printed or sent", "Everyone, as a backup"],
      ];
      let s = "";
      spots.forEach(([h, a, b], i) => {
        const x = 60 + (i % 3) * 365;
        const y = 160 + Math.floor(i / 3) * 225;
        s += box(x, y, 340, 200, i === 5 ? "#2a3442" : "#30475e");
        s += `<rect x="${x + 28}" y="${y + 30}" width="30" height="44" rx="5" fill="#fff"/><rect x="${x + 36}" y="${y + 46}" width="14" height="10" rx="2" fill="#4285f4"/>`;
        s += t(x + 76, y + 62, h, 25, "#fff", 700) + t(x + 28, y + 122, a, 21, "#c8d3df", 500) + t(x + 28, y + 160, b, 19, i === 5 ? MUTED : ORANGE, 600);
      });
      return s;
    })(),
    "Put a card wherever the job ends"
  ),

  // 5. Google's rules: allowed vs not allowed.
  "google-review-rules": frame(
    (() => {
      const ok = ["Ask every customer, happy or not", "Hand them a tap card or QR code", "Send your review link by text or email", "Reply to every review, good and bad", "Put the link on receipts and invoices"];
      const no = ["Discounts, freebies or raffles for reviews", "Asking only customers you think are happy", "Reviews from staff, family or yourself", "Writing a review for the customer", "Buying reviews or review-swap groups"];
      let s = box(60, 150, 520, 460, GREEN, "#0b1712") + t(90, 196, "Allowed", 30, GREEN, 700);
      ok.forEach((o, i) => (s += t(92, 262 + i * 68, "✓", 28, GREEN, 800) + t(130, 262 + i * 68, o, 22)));
      s += box(620, 150, 520, 460, RED, "#190c0c") + t(650, 196, "Against Google's rules", 30, RED, 700);
      no.forEach((o, i) => (s += t(652, 262 + i * 68, "✕", 26, RED, 800) + t(690, 262 + i * 68, o, 20)));
      s += t(60, 645, "Sources: Google Maps user-generated content policy; FTC consumer reviews rule (16 CFR 465)", 16, MUTED, 500);
      return s;
    })(),
    "What you can and can't do to get reviews"
  ),

  // 6. The numbers (BrightLocal 2026, Spiegel Research Center).
  "google-review-statistics-2026": frame(
    (() => {
      const stats = [
        ["97%", "of consumers read reviews", "for local businesses", BLUE],
        ["47%", "won't use a business with", "fewer than 20 reviews", ORANGE],
        ["74%", "look for reviews written", "in the last three months", BLUE],
        ["89%", "expect the owner to", "respond to reviews", ORANGE],
      ];
      let s = "";
      stats.forEach(([n, a, b, c], i) => {
        const x = 60 + (i % 2) * 550;
        const y = 150 + Math.floor(i / 2) * 215;
        s += box(x, y, 530, 195);
        s += t(x + 32, y + 112, n, 84, c, 800) + t(x + 245, y + 86, a, 21, "#e8eef5", 600) + t(x + 245, y + 118, b, 21, "#e8eef5", 600);
      });
      s += t(60, 618, "Source: BrightLocal Local Consumer Review Survey 2026 (published Feb 11, 2026)", 18, MUTED, 500);
      return s;
    })(),
    "What customers do with reviews in 2026"
  ),
};

for (const [name, svg] of Object.entries(images)) {
  await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(path.join(OUT, `${name}.webp`));
  console.log("wrote", `public/img/guides/google-reviews/${name}.webp`);
}
