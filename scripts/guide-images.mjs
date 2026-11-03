// Hero + share image (1200×630) for every guide in src/content/guides.ts → public/og/guides/<slug>.jpg.
// Run after adding a guide: node scripts/guide-images.mjs  (only missing images are built; --all rebuilds)
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cardBack, cardFront } from "../src/lib/card-faces.ts";

const OUT = path.resolve("public/og/guides");
await mkdir(OUT, { recursive: true });
const all = process.argv.includes("--all");
const W = 1200;
const H = 630;
const FONT = "Avenir Next, Helvetica Neue, Arial";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// slug + title straight from the content file (no TS import needed)
const src = await readFile("src/content/guides.ts", "utf8");
const guides = [...src.matchAll(/slug: "([^"]+)",[\s\S]*?\n    title: "([^"]+)"/g)].map((m) => ({ slug: m[1], title: m[2] }));

/** Short, punchy headline per guide (falls back to the title). */
const HEADLINES = {
  "seo-vs-aeo-vs-geo": ["SEO vs AEO", "vs GEO"],
  "facebook-ads-cost-per-lead": ["Facebook ads:", "cost per lead"],
  "how-to-get-recommended-by-chatgpt": ["Get recommended", "by ChatGPT"],
  "google-business-profile-checklist": ["Google Business", "Profile checklist"],
  "how-to-get-more-spotify-listeners": ["More Spotify", "listeners"],
  "shopify-visitors-no-sales": ["Visitors but", "no sales? 9 fixes"],
  "local-business-website-checklist": ["Websites that", "get more calls"],
  "how-to-get-more-google-reviews": ["Get more", "Google reviews"],
  "nfc-google-review-cards": ["NFC review cards:", "worth it?"],
  "how-to-find-google-review-link": ["Find your Google", "review link"],
  "nfc-review-card-iphone-android": ["Works on iPhone", "& Android?"],
  "what-to-say-to-get-google-reviews": ["What to say to", "get reviews"],
  "google-review-cards-by-business": ["Review cards for", "every business"],
  "track-booked-calls-meta-ads": ["Track booked calls", "from Meta ads"],
};
const KIND = (slug) =>
  /retail|by-business/.test(slug) ? "photo:retail-counter" : /iphone/.test(slug) ? "photo:tap-review" : /review|nfc/.test(slug) ? "card" : /meta|facebook|booked/.test(slug) ? "chart" : /chatgpt|aeo|geo/.test(slug) ? "chat" : "check";

const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>
<radialGradient id="a" cx="80%" cy="30%" r="60%"><stop offset="0" stop-color="#1a9fff" stop-opacity=".42"/><stop offset="1" stop-color="#1a9fff" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="0%" cy="110%" r="60%"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".3"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern></defs>
<rect width="100%" height="100%" fill="#05070b"/><rect width="100%" height="100%" fill="url(#grid)"/><rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)"/></svg>`);

const text = (lines) => Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>
<linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="#fff"/><stop offset="1" stop-color="#9aa8b8"/></linearGradient>
<linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a9fff"/><stop offset=".5" stop-color="#6cc6ff"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs>
<text x="70" y="96" font-family="${FONT}" font-weight="700" font-size="28" fill="#fff">CEO <tspan fill="#1a9fff">Turbo</tspan> <tspan fill="#9aa8b8" font-weight="600">· Guide</tspan></text>
${lines.map((l, i) => `<text x="66" y="${250 + i * 84}" font-family="${FONT}" font-weight="700" font-size="${l.length > 17 ? 64 : 76}" letter-spacing="-2" fill="url(#${i === lines.length - 1 ? "t" : "c"})">${esc(l)}</text>`).join("")}
<text x="70" y="540" font-family="${FONT}" font-weight="600" font-size="24" fill="#c8d3df">ceoturbo.com</text></svg>`);

async function visual(kind) {
  if (kind === "card") {
    const f = await sharp(Buffer.from(cardFront())).resize({ width: 250 }).rotate(-8, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const b = await sharp(Buffer.from(cardBack())).resize({ width: 230 }).rotate(9, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    return [{ input: b, left: 900, top: 60 }, { input: f, left: 740, top: 130 }];
  }
  if (kind.startsWith("photo:")) {
    const file = path.resolve("public/img/review-cards", `${kind.slice(6)}.webp`);
    const mask = Buffer.from(`<svg width="420" height="520"><rect width="420" height="520" rx="28" fill="#fff"/></svg>`);
    const img = await sharp(file).resize({ width: 420, height: 520, fit: "cover" }).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    return [{ input: img, left: 720, top: 55 }];
  }
  const panel = (inner) => Buffer.from(`<svg width="420" height="420" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="416" height="416" rx="32" fill="#0b1018" stroke="#2a3646" stroke-width="3"/>${inner}</svg>`);
  if (kind === "chart")
    return [{ input: panel(`${[90, 140, 120, 200, 260, 330].map((h, i) => `<rect x="${50 + i * 55}" y="${370 - h}" width="36" height="${h}" rx="8" fill="${i === 5 ? "#ff6b1a" : "#1a9fff"}" fill-opacity="${0.45 + i * 0.1}"/>`).join("")}<text x="50" y="70" font-family="${FONT}" font-weight="700" font-size="30" fill="#fff">Booked calls</text><text x="50" y="104" font-family="${FONT}" font-weight="600" font-size="20" fill="#81c995">▲ tracked server-side</text>`), left: 720, top: 105 }];
  if (kind === "chat")
    return [{ input: panel(`<rect x="40" y="60" width="300" height="70" rx="20" fill="#1b2532"/><text x="62" y="103" font-family="${FONT}" font-size="22" fill="#c8d3df">Who's the best near me?</text><rect x="80" y="160" width="300" height="150" rx="20" fill="#1a9fff" fill-opacity=".18" stroke="#1a9fff" stroke-opacity=".5"/><text x="102" y="205" font-family="${FONT}" font-weight="700" font-size="24" fill="#fff">I recommend</text><text x="102" y="240" font-family="${FONT}" font-weight="700" font-size="24" fill="#6cc6ff">your business</text><text x="102" y="280" font-family="${FONT}" font-size="20" fill="#f6c02b">★★★★★</text>`), left: 720, top: 105 }];
  return [{ input: panel(`${["Indexed & fast", "Clear answers", "Reviews + trust", "One clear CTA"].map((t, i) => `<circle cx="70" cy="${95 + i * 80}" r="20" fill="#1a9fff" fill-opacity=".2" stroke="#1a9fff"/><path d="M60 ${95 + i * 80}l7 7 13-14" fill="none" stroke="#6cc6ff" stroke-width="4" stroke-linecap="round"/><text x="110" y="${104 + i * 80}" font-family="${FONT}" font-weight="600" font-size="26" fill="#e6edf3">${esc(t)}</text>`).join("")}`), left: 720, top: 105 }];
}

let built = 0;
for (const g of guides) {
  const out = path.join(OUT, `${g.slug}.jpg`);
  if (existsSync(out) && !all) continue;
  const lines = HEADLINES[g.slug] ?? g.title.split(/(?<=^.{0,22})\s/).slice(0, 2);
  await sharp(bg)
    .composite([...(await visual(KIND(g.slug))), { input: text(lines), left: 0, top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  built++;
}
console.log(`guide images: ${built} built, ${guides.length} guides`);
