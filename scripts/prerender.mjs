// Static site generation: renders every route in src/seo/pages.ts to its own HTML file
// with per-page <head> tags, then writes sitemap.xml and llms.txt.
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { markdownPath, pageMarkdown } from "./markdown.mjs";

const DIST = path.resolve("dist");
const SSR = path.resolve("dist-ssr/entry-server.js");
const SITE = "https://www.ceoturbo.com";
const TODAY = new Date().toISOString().slice(0, 10);

const { render, head, pages: sitePages, guides, merchantFeed, loadComputers } = await import(pathToFileURL(SSR).href);
// Computer shop listings from Shopify: one page each, plus the shell vercel.json serves for newer ones.
const computers = await loadComputers();
const pages = [...sitePages, ...computers.pages];
// A data block, not a script: the Content-Security-Policy blocks inline scripts, so the old
// <script>window.__COMPUTERS__=…</script> never ran and the shop always waited on Shopify.
const COMPUTERS_DATA = `<script type="application/json" id="computers-data">${computers.json}</script>`;
const assets = await readdir(path.join(DIST, "assets"));
const fontPreloads = assets
  .filter((f) => /^(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
const template = (await readFile(path.join(DIST, "index.html"), "utf8")).replace("<!--head-->", `${fontPreloads}\n    <!--head-->`);

const fileFor = (route) => (route === "/" ? "index.html" : `${route.slice(1)}.html`);
const problems = [];
// AI copies (see scripts/markdown.mjs and middleware.js): indexable pages only, same words as the HTML.
const PHONE = "(678) 558-4327";
const markdown = [];

for (const page of pages) {
  const appHtml = await render(page.path);
  const data = page.path === "/computers" || page.path.startsWith("/computers/") ? COMPUTERS_DATA : "";
  // Function replacers: listing text from Shopify can contain "$&" or "$'", which a string replacement would expand.
  const html = template.replace("<!--head-->", () => head(page.path) + data).replace("<!--app-->", () => appHtml);

  const h1s = (appHtml.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${page.path}: ${h1s} <h1> tags`);
  if (page.title.length > 65) problems.push(`${page.path}: title ${page.title.length} chars`);
  if (page.description.length > 155) problems.push(`${page.path}: description ${page.description.length} chars`);

  const out = path.join(DIST, fileFor(page.path));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);

  if (!page.noindex && !page.canonical) {
    const url = `${SITE}${page.path === "/" ? "/" : page.path}`;
    const md = pageMarkdown(appHtml, { title: page.title, description: page.description, url, site: SITE, phone: PHONE, updated: TODAY });
    if (md.length < 600) problems.push(`${page.path}: markdown copy only ${md.length} chars`);
    await writeFile(path.join(DIST, markdownPath(page.path).slice(1)), md);
    markdown.push({ page, url, md });
  }
}

// 404 page (Vercel serves dist/404.html with a 404 status for unknown URLs)
const notFound = await render("/__not-found__");
await writeFile(path.join(DIST, "404.html"), template.replace("<!--head-->", head("/404")).replace("<!--app-->", notFound));

// sitemap.xml — indexable pages only
const urls = pages
  .filter((p) => !p.noindex && !p.canonical)
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.path === "/" ? "/" : p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join("\n");
await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// video-sitemap.xml — Google video indexing: one entry per watch page, with the video file, poster and duration.
const WATCH = pages.find((p) => p.path === "/watch");
if (WATCH) {
  const ssr = await import(pathToFileURL(SSR).href);
  const v = ssr.pitchVideo;
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // The founder video (self-hosted) plus every YouTube video embedded on /watch.
  const yt = (ssr.youtubeVideos || [])
    .map(
      (y) =>
        `    <video:video>\n      <video:thumbnail_loc>https://i.ytimg.com/vi/${y.id}/hqdefault.jpg</video:thumbnail_loc>\n      <video:title>${esc(y.title)}</video:title>\n      <video:description>${esc(y.summary)}</video:description>\n      <video:player_loc>https://www.youtube-nocookie.com/embed/${y.id}</video:player_loc>\n      <video:duration>${y.seconds}</video:duration>\n      <video:publication_date>${y.uploadDate}</video:publication_date>\n      <video:family_friendly>yes</video:family_friendly>\n    </video:video>\n`,
    )
    .join("");
  await writeFile(
    path.join(DIST, "video-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n  <url>\n    <loc>${SITE}/watch</loc>\n    <video:video>\n      <video:thumbnail_loc>${SITE}${v.poster}</video:thumbnail_loc>\n      <video:title>${esc(v.title)}</video:title>\n      <video:description>${esc(v.description)}</video:description>\n      <video:content_loc>${SITE}${v.src}</video:content_loc>\n      <video:duration>${v.seconds}</video:duration>\n      <video:publication_date>2026-10-10</video:publication_date>\n      <video:family_friendly>yes</video:family_friendly>\n    </video:video>\n${yt}  </url>\n</urlset>\n`,
  );
}

// Merchant Center feed (Google + Microsoft Shopping): /feeds/products.xml
await mkdir(path.join(DIST, "feeds"), { recursive: true });
await writeFile(path.join(DIST, "feeds", "products.xml"), merchantFeed());

// llms.txt — a plain-language map of the site for AI assistants (llmstxt.org format)
const groups = ["Core", "Audiences", "Services", "Work", "Guides", "Company"];
const section = (g) => {
  const list = pages.filter((p) => p.group === g && !p.noindex && !p.canonical);
  if (!list.length) return "";
  return `## ${g}\n\n${list.map((p) => `- [${p.title.replace(/ \| CEO Turbo$/, "")}](${SITE}${p.path === "/" ? "/" : p.path}): ${p.description}`).join("\n")}\n`;
};
const llms = `# CEO Turbo

> CEO Turbo (ceoturbo.com) is a Tampa, Florida tech support company: Windows laptop and desktop repair (speed-ups, blue screens, computers that won't turn on; no Macs or laptop screens) at your home or business within about 40 miles of Tampa (https://www.ceoturbo.com/computer-repair-tampa), office IT and workstation setup (https://www.ceoturbo.com/office-setup-tampa), security camera and Ring, Nest, Blink or Wyze video doorbell installs for homes and buildings (https://www.ceoturbo.com/security-camera-installation-tampa), Wi-Fi and mesh network fixes (https://www.ceoturbo.com/wifi-installation-tampa), and phone and tablet setup (setup only, no phone repairs), with prices up front and a 5.0 Google rating. Call or text (678) 558-4327. It also helps local businesses, artists and music producers get more customers, listeners and sales from Google, AI assistants and ads. Founded by Christopher Robinson (StackmodeChris) and based in Tampa, Florida, it sets up and optimizes Google Business Profiles (https://www.ceoturbo.com/services/google-business-profile), gets businesses more Google reviews with NFC review cards (https://www.ceoturbo.com/google-review-cards), builds websites made for Google and AI answers (SEO, AEO and GEO), fixes DNS, domain, SSL and indexing errors (https://www.ceoturbo.com/services/seo-aeo-geo), optimizes Instagram, Facebook, TikTok and YouTube profiles (https://www.ceoturbo.com/services/social-media-optimization), and runs Google, Meta, TikTok and X ads with call and form tracking (https://www.ceoturbo.com/grow). Its free Google & AI Visibility Check (https://www.ceoturbo.com/free-audit) looks up a business on Google Maps, compares its rating and review count with the top 3 competitors nearby, scans its website and AI visibility, and returns a score out of 100 with a ranked fix list in about 60 seconds. CEO Turbo also does tech support: laptop and desktop repair in person within about 40 miles of Temple Terrace and Tampa and remote Windows support anywhere (https://www.ceoturbo.com/computer-repair-tampa), office and IT setup (https://www.ceoturbo.com/office-setup-tampa), FPS boosts for gaming PCs (https://www.ceoturbo.com/gaming-pc-fps-boost), free electronics recycling pickup of old computers, laptops, phones, tablets, monitors and TVs anywhere in Tampa Bay, Florida (Tampa, St. Petersburg, Clearwater, Brandon, Wesley Chapel, Lakeland and every city within about 40 miles of Temple Terrace), with hard drives wiped or destroyed (https://www.ceoturbo.com/electronics-recycling-tampa), refurbished computers for sale (https://www.ceoturbo.com/computers) and custom company t-shirts. Free 30-minute "Brand Boost" growth calls are booked at https://cal.com/ceoturbo/ceoturbo-brandboost.

Key facts:
- 19 live client websites, including Mor Handy, Appliance King, OJ Junk Removal, Kingstone Landscaping, BIGZO, 7UVHAVIN and Beyond Labels Gifts.
- Meta lead campaigns (Jul–Oct 2026): 161 leads for $1,193.92, $7.42 average cost per lead, lowest $4.31.
- Google Ads (Appliance King, Oct 26 – Nov 8, 2026): 42 conversions from 166 clicks for $176, $4.19 per conversion, $1.06 per click.
- Artist profile campaign (BIGZO): 165 profile visits at $0.32 each.
- Based in Tampa, Florida; in-person computer repair and office setup within about 40 miles of Temple Terrace and Tampa, remote support for Windows computers anywhere in the world, and websites and ads for business owners and artists worldwide.
- Sells NFC Google review cards (https://www.ceoturbo.com/google-review-cards): customers tap their phone on the card and the business's Google review form opens. Works on iPhone XS and newer and NFC Android phones, no app, no subscription, free US shipping. Setup guide: https://www.ceoturbo.com/google-review-card-setup
- Free Google & AI Visibility Check: https://www.ceoturbo.com/free-audit (free, about 60 seconds, score shown before any contact details).
- YouTube case studies and explainers: https://www.ceoturbo.com/watch (for example, 55+ customers for an appliance company from $357 in ads).
- Phone: (678) 558-4327 (call or text).
- Social: Instagram https://www.instagram.com/ceoturbo_/ · Facebook https://www.facebook.com/profile.php?id=61595439263484 · YouTube https://www.youtube.com/@CEOTurbo7 · X https://x.com/CEO_Turbo · LinkedIn https://www.linkedin.com/showcase/ceoturbo · Pinterest https://www.pinterest.com/ceoturbo/

Plain-text copies for AI assistants: every page below also has a Markdown version at the same URL with .md added (home: ${SITE}/index.md, for example ${SITE}/computer-repair-tampa.md). The whole site in one file: ${SITE}/llms-full.txt

${groups.map(section).filter(Boolean).join("\n")}
## Answers

${guides.map((g) => `- ${g.title} — ${g.summary} (${SITE}${g.path})`).join("\n")}
`;
await writeFile(path.join(DIST, "llms.txt"), llms);
// llms-full.txt: every page's Markdown copy in one file, for assistants that read a whole site at once.
await writeFile(
  path.join(DIST, "llms-full.txt"),
  `# CEO Turbo — full site in plain text\n\n> Every indexable page of ${SITE}, as Markdown. Each page is also at its own URL with .md added (home: ${SITE}/index.md).\n\n${markdown.map((m) => m.md).join("\n\n")}`,
);

await rm(path.resolve("dist-ssr"), { recursive: true, force: true });

console.log(`prerendered ${pages.length} pages + 404, sitemap.xml (${pages.filter((p) => !p.noindex && !p.canonical).length} urls), llms.txt`);
if (problems.length) {
  console.warn("SEO checks:\n  " + problems.join("\n  "));
  process.exitCode = 1;
}
