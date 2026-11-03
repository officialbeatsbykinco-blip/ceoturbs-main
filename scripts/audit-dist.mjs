// Post-build SEO/indexing audit of the prerendered site in dist/. Fails (exit 1) on anything that would
// cost rankings or cause Search Console / Bing indexing errors. Run: npm run build && node scripts/audit-dist.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const ORIGIN = "https://www.ceoturbo.com";
const errors = [];
const warns = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warns.push(`${page}: ${msg}`);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return f === "assets" || f === "img" || f === "media" || f === "og" ? [] : htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}

const routeOf = (file) => {
  const rel = path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404";
  return `/${rel.replace(/(\/index)?\.html$/, "")}`;
};

const files = htmlFiles(DIST);
const routes = new Set(files.map(routeOf));
const sitemap = readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const titles = new Map();
const descriptions = new Map();

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const metaContent = (html, key, val) => {
  const tag = html.match(new RegExp(`<meta[^>]+${key}="${val}"[^>]*>`))?.[0];
  const v = tag ? attr(tag, "content") : undefined;
  return v === undefined ? undefined : decode(v);
};

for (const file of files) {
  const route = routeOf(file);
  if (route === "/404") continue;
  const html = readFileSync(file, "utf8");
  const robots = metaContent(html, "name", "robots") || "";
  const noindex = /noindex/.test(robots);
  const url = route === "/" ? `${ORIGIN}/` : `${ORIGIN}${route}`;

  const rawTitle = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const title = rawTitle && decode(rawTitle);
  if (!title) err(route, "missing <title>");
  else {
    if (title.length > 65) err(route, `title ${title.length} chars (max 65)`);
    if (!noindex) titles.set(title, [...(titles.get(title) || []), route]);
  }
  const desc = metaContent(html, "name", "description");
  if (!desc) err(route, "missing meta description");
  else {
    if (desc.length > 160) err(route, `description ${desc.length} chars (max 160)`);
    if (!noindex) descriptions.set(desc, [...(descriptions.get(desc) || []), route]);
  }

  const canonicalTag = html.match(/<link[^>]+rel="canonical"[^>]*>/)?.[0];
  const canonical = canonicalTag && attr(canonicalTag, "href");
  if (!canonical) err(route, "missing canonical");
  else if (!canonical.startsWith(`${ORIGIN}/`) && canonical !== ORIGIN) err(route, `canonical not on ${ORIGIN}: ${canonical}`);
  else if (!noindex && canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) err(route, `canonical points elsewhere: ${canonical}`);

  const body = html.slice(html.indexOf("<body"));
  const h1s = (body.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(route, `${h1s} <h1> tags (need exactly 1)`);

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      err(route, `invalid JSON-LD: ${e.message}`);
    }
  }

  for (const m of body.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt="/.test(tag)) err(route, `img without alt: ${tag.slice(0, 90)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) warn(route, `img without width/height (layout shift): ${attr(tag, "src")}`);
  }

  for (const m of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    const asset = path.join(DIST, clean);
    if (!routes.has(clean) && !existsSync(asset)) err(route, `broken internal link → ${href}`);
  }

  if (noindex && sitemapUrls.has(url)) err(route, "noindex page is in sitemap.xml");
  if (!noindex && !sitemapUrls.has(url)) err(route, "indexable page missing from sitemap.xml");
}

for (const u of sitemapUrls) {
  const r = u.replace(ORIGIN, "").replace(/\/$/, "") || "/";
  if (!routes.has(r)) err("sitemap.xml", `lists a URL with no page: ${u}`);
}
for (const [t, rs] of titles) if (rs.length > 1) err(rs.join(", "), `duplicate title "${t}"`);
for (const [d, rs] of descriptions) if (rs.length > 1) err(rs.join(", "), `duplicate description "${d.slice(0, 60)}…"`);

const robotsTxt = readFileSync(path.join(DIST, "robots.txt"), "utf8");
if (!robotsTxt.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) err("robots.txt", "missing sitemap line");
if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) err("robots.txt", "blocks the whole site");
if (!existsSync(path.join(DIST, "llms.txt"))) err("llms.txt", "missing");

warns.forEach((w) => console.warn(`warn  ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`ERROR ${e}`));
  console.error(`\n${errors.length} SEO error(s) across ${files.length} pages.`);
  process.exit(1);
}
console.log(`SEO audit passed: ${files.length} pages, ${sitemapUrls.size} sitemap URLs, ${warns.length} warning(s).`);
