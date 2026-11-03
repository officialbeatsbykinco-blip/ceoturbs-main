// Static site generation: renders every route in src/seo/pages.ts to its own HTML file
// with per-page <head> tags, then writes sitemap.xml and llms.txt.
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIST = path.resolve("dist");
const SSR = path.resolve("dist-ssr/entry-server.js");
const SITE = "https://www.ceoturbo.com";
const TODAY = new Date().toISOString().slice(0, 10);

const { render, head, pages, guides, merchantFeed } = await import(pathToFileURL(SSR).href);
const assets = await readdir(path.join(DIST, "assets"));
const fontPreloads = assets
  .filter((f) => /^(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
const template = (await readFile(path.join(DIST, "index.html"), "utf8")).replace("<!--head-->", `${fontPreloads}\n    <!--head-->`);

const fileFor = (route) => (route === "/" ? "index.html" : `${route.slice(1)}.html`);
const problems = [];

for (const page of pages) {
  const appHtml = await render(page.path);
  const html = template.replace("<!--head-->", head(page.path)).replace("<!--app-->", appHtml);

  const h1s = (appHtml.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${page.path}: ${h1s} <h1> tags`);
  if (page.title.length > 65) problems.push(`${page.path}: title ${page.title.length} chars`);
  if (page.description.length > 155) problems.push(`${page.path}: description ${page.description.length} chars`);

  const out = path.join(DIST, fileFor(page.path));
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html);
}

// 404 page (Vercel serves dist/404.html with a 404 status for unknown URLs)
const notFound = await render("/__not-found__");
await writeFile(path.join(DIST, "404.html"), template.replace("<!--head-->", head("/404")).replace("<!--app-->", notFound));

// sitemap.xml — indexable pages only
const urls = pages
  .filter((p) => !p.noindex)
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
  const v = (await import(pathToFileURL(SSR).href)).pitchVideo;
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await writeFile(
    path.join(DIST, "video-sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n  <url>\n    <loc>${SITE}/watch</loc>\n    <video:video>\n      <video:thumbnail_loc>${SITE}${v.poster}</video:thumbnail_loc>\n      <video:title>${esc(v.title)}</video:title>\n      <video:description>${esc(v.description)}</video:description>\n      <video:content_loc>${SITE}${v.src}</video:content_loc>\n      <video:duration>${v.seconds}</video:duration>\n      <video:publication_date>2026-10-10</video:publication_date>\n      <video:family_friendly>yes</video:family_friendly>\n    </video:video>\n  </url>\n</urlset>\n`,
  );
}

// Merchant Center feed (Google + Microsoft Shopping): /feeds/products.xml
await mkdir(path.join(DIST, "feeds"), { recursive: true });
await writeFile(path.join(DIST, "feeds", "products.xml"), merchantFeed());

// llms.txt — a plain-language map of the site for AI assistants (llmstxt.org format)
const groups = ["Core", "Audiences", "Services", "Work", "Guides", "Company"];
const section = (g) => {
  const list = pages.filter((p) => p.group === g && !p.noindex);
  if (!list.length) return "";
  return `## ${g}\n\n${list.map((p) => `- [${p.title.replace(/ \| CEO Turbo$/, "")}](${SITE}${p.path === "/" ? "/" : p.path}): ${p.description}`).join("\n")}\n`;
};
const llms = `# CEO Turbo

> CEO Turbo (ceoturbo.com) is an Atlanta, Georgia seller of NFC Google review cards (from $16.99, free US shipping, available blank or programmed) that open a business's Google review form with one tap (https://www.ceoturbo.com/google-review-cards), made for barbers, lawn care crews, mobile repair techs and stores. Founded by Christopher Robinson (StackmodeChris), it also builds websites, runs Meta, Google, TikTok and X ads, sets up and optimizes Google Business Profiles and social media profiles, designs promotional email campaigns, and does SEO, AEO and GEO for independent artists, local service businesses and Shopify stores. It offers a free online SEO, AEO and GEO visibility audit (https://www.ceoturbo.com/free-audit). Free 30-minute "Brand Boost" growth calls are booked at https://cal.com/stackmodechris/ceoturbo-brandboost.

Key facts:
- 19 live client websites, including Mor Handy, Appliance King, OJ Junk Removal, Kingstone Landscaping, BIGZO, 7UVHAVIN and Beyond Labels Gifts.
- Meta lead campaigns (Jul–Oct 2026): 161 leads for $1,193.92, $7.42 average cost per lead, lowest $4.31.
- Google Ads (Appliance King, one day, Oct 2026): 2 conversions for $6.57, $3.29 per conversion.
- Artist profile campaign (BIGZO): 165 profile visits at $0.32 each.
- Based at 8735 Dunwoody Place #12143, Atlanta, GA 30350; works with businesses all over the world.
- Phone: (678) 558-4327 (call or text).
- Social: Instagram https://www.instagram.com/ceoturbo_/ · Facebook https://www.facebook.com/profile.php?id=61595439263484 · YouTube https://www.youtube.com/@CEOTurbo7 · X https://x.com/CEO_Turbo · LinkedIn https://www.linkedin.com/showcase/ceoturbo · Pinterest https://www.pinterest.com/ceoturbo/

${groups.map(section).filter(Boolean).join("\n")}
## Answers

${guides.map((g) => `- ${g.title} — ${g.summary} (${SITE}${g.path})`).join("\n")}
`;
await writeFile(path.join(DIST, "llms.txt"), llms);

await rm(path.resolve("dist-ssr"), { recursive: true, force: true });

console.log(`prerendered ${pages.length} pages + 404, sitemap.xml (${pages.filter((p) => !p.noindex).length} urls), llms.txt`);
if (problems.length) {
  console.warn("SEO checks:\n  " + problems.join("\n  "));
  process.exitCode = 1;
}
