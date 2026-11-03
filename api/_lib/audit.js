// The free SEO / AEO / GEO audit. No paid APIs: it reads the visitor's own website,
// robots.txt, sitemap and llms.txt, then checks public knowledge sources
// (Wikidata, Wikipedia, MusicBrainz, OpenStreetMap) and, when available, Google PageSpeed.
import { fetchPage, getJson, normalizeUrl } from "./fetch-page.js";

const SOCIAL_HOSTS = {
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "tiktok.com": "TikTok",
  "x.com": "X",
  "twitter.com": "X",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "linkedin.com": "LinkedIn",
  "open.spotify.com": "Spotify",
  "spotify.com": "Spotify",
  "music.apple.com": "Apple Music",
  "soundcloud.com": "SoundCloud",
  "linktr.ee": "Linktree",
  "beacons.ai": "Beacons",
  "stan.store": "Stan",
  "yelp.com": "Yelp",
  "google.com": "Google",
  "g.page": "Google",
  "maps.app.goo.gl": "Google Maps",
  "bandcamp.com": "Bandcamp",
  "audiomack.com": "Audiomack",
};

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];
const KEY_AI_BOTS = ["OAI-SearchBot", "GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"];

const BUSINESS_TYPE = /(LocalBusiness|Store|Shop|Service|Contractor|Business|Restaurant|Salon|Dentist|Plumber|Electrician|Locksmith|Mover|Roofing|HVAC|AutoRepair|AutoDealer|Attorney|LegalService|MedicalClinic|Physician|Bakery|BarOrPub|CafeOrCoffeeShop|HealthClub|DaySpa|BeautySalon|HairSalon|NailSalon|TattooParlor|RealEstateAgent|Hotel|Painter|GeneralContractor|HousePainter|LandscapingBusiness|PestControl)/;
const ARTIST_TYPE = /^(MusicGroup|Person|MusicRecording|MusicAlbum|MusicPlaylist|PerformingGroup)$/;

const clean = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const words = (s) => norm(s).split(" ").filter((w) => w.length >= 4);
/** What to look for: the 4+ letter words, or the whole phrase when it is short (“spa”, “gym”, “DJ”). */
const terms = (s) => {
  const w = words(s);
  return w.length ? w : norm(s) ? [norm(s)] : [];
};
/** Longer words match inside others (“plumb” in “plumbing”); short ones only as whole words (“spa” not in “space”). */
const hasTerm = (normText, t) => (t.length >= 4 ? normText.includes(t) : ` ${normText} `.includes(` ${t} `));

export function platformFor(host) {
  const h = host.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
  for (const [domain, label] of Object.entries(SOCIAL_HOSTS)) if (h === domain || h.endsWith(`.${domain}`)) return label;
  return null;
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) out[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? "";
  return out;
}

function collectTypes(node, types, sameAs) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, types, sameAs));
  const t = node["@type"];
  if (t) (Array.isArray(t) ? t : [t]).forEach((x) => typeof x === "string" && types.add(x));
  if (node.sameAs) (Array.isArray(node.sameAs) ? node.sameAs : [node.sameAs]).forEach((u) => typeof u === "string" && sameAs.add(u));
  for (const v of Object.values(node)) if (v && typeof v === "object") collectTypes(v, types, sameAs);
}

/** Pulls everything the audit needs out of raw HTML (no DOM needed). */
export function parseHtml(html) {
  const h = String(html || "");
  const title = clean((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const metas = [...h.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const meta = (key) => metas.find((m) => (m.name || m.property || "").toLowerCase() === key)?.content;
  const links = [...h.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const anchors = [...h.matchAll(/<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')/gi)].map((m) => m[2] ?? m[3] ?? "");
  const heading = (n) => [...h.matchAll(new RegExp(`<h${n}\\b[^>]*>([\\s\\S]*?)<\\/h${n}>`, "gi"))].map((m) => clean(m[1].replace(/<[^>]+>/g, " ")));
  const imgs = [...h.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]));

  const types = new Set();
  const sameAs = new Set();
  let jsonLdBlocks = 0;
  for (const m of h.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    jsonLdBlocks++;
    try {
      collectTypes(JSON.parse(m[1].trim()), types, sameAs);
    } catch {
      /* invalid JSON-LD counts as a block but adds no types */
    }
  }
  const microdata = [...h.matchAll(/itemtype\s*=\s*["']https?:\/\/schema\.org\/([A-Za-z]+)["']/gi)].map((m) => m[1]);
  microdata.forEach((t) => types.add(t));

  const text = clean(
    h
      .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  );

  return {
    title,
    description: clean(meta("description")),
    robots: (meta("robots") || "").toLowerCase(),
    viewport: !!meta("viewport"),
    ogTitle: !!meta("og:title"),
    ogImage: !!meta("og:image"),
    canonical: links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "",
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    images: imgs.length,
    imagesWithAlt: imgs.filter((i) => (i.alt || "").trim().length > 0).length,
    anchors,
    types: [...types],
    sameAs: [...sameAs],
    jsonLdBlocks,
    text,
    wordCount: text ? text.split(" ").length : 0,
    scripts: (h.match(/<script\b/gi) || []).length,
  };
}

/** Which named AI crawlers a robots.txt blocks from the whole site. */
export function blockedAiBots(robots) {
  if (!robots) return [];
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    const val = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], disallowAll: false, allowRoot: false };
        groups.push(current);
      }
      current.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (!current) continue;
      if (key === "disallow" && val === "/") current.disallowAll = true;
      if (key === "allow" && val === "/") current.allowRoot = true;
    }
  }
  const blocksAll = (g) => g && g.disallowAll && !g.allowRoot;
  const star = groups.find((g) => g.agents.includes("*"));
  return AI_BOTS.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()));
    return own ? blocksAll(own) : blocksAll(star);
  });
}

const VALUE = { pass: 1, warn: 0.5, fail: 0 };

export function scoreChecks(checks, categories) {
  const scores = {};
  for (const cat of categories) {
    const list = checks.filter((c) => c.cat === cat && c.status in VALUE);
    const total = list.reduce((s, c) => s + c.weight, 0);
    scores[cat] = total ? Math.round((list.reduce((s, c) => s + c.weight * VALUE[c.status], 0) / total) * 100) : 0;
  }
  const overall = Math.round(categories.reduce((s, c) => s + scores[c], 0) / categories.length);
  return { scores, overall };
}

const firstMatch = (list, name) => {
  const n = norm(name);
  return (list || []).find((x) => norm(x) === n || norm(x).startsWith(`${n} `));
};

async function lookupWikidata(name) {
  const data = await getJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=5&search=${encodeURIComponent(name)}`);
  if (!data) return null;
  const hit = (data.search || []).find((s) => norm(s.label) === norm(name));
  return { found: !!hit, id: hit?.id, description: hit?.description };
}

async function lookupWikipedia(name) {
  const data = await getJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(`intitle:"${name}"`)}`);
  if (!data) return null;
  const hit = firstMatch((data.query?.search || []).map((s) => s.title), name);
  return { found: !!hit, title: hit };
}

async function lookupMusicBrainz(name) {
  const data = await getJson(`https://musicbrainz.org/ws/2/artist/?fmt=json&limit=5&query=${encodeURIComponent(`artist:"${name}"`)}`);
  if (!data) return null;
  const hit = (data.artists || []).find((a) => (a.score ?? 0) >= 90 && norm(a.name) === norm(name));
  return { found: !!hit, id: hit?.id };
}

async function lookupOsm(name, city) {
  const data = await getJson(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(`${name}, ${city}`)}`);
  if (!Array.isArray(data)) return null;
  const n = norm(name);
  const hit = data.find((p) => norm(p.name || p.display_name).includes(n) || (norm(p.name || "").length > 3 && n.includes(norm(p.name || ""))));
  return { found: !!hit, label: hit?.display_name };
}

async function pageSpeed(url) {
  const key = process.env.PSI_API_KEY ? `&key=${encodeURIComponent(process.env.PSI_API_KEY)}` : "";
  const data = await getJson(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(url)}${key}`, 14000);
  const score = data?.lighthouseResult?.categories?.performance?.score;
  if (typeof score !== "number") return null;
  return { score: Math.round(score * 100), lcp: data.lighthouseResult.audits?.["largest-contentful-paint"]?.displayValue };
}

const sitePart = async (url) => {
  if (!url) return null;
  const origin = url.origin;
  const [page, robots, llms, sitemap, psi] = await Promise.all([
    fetchPage(url, { timeoutMs: 9000 }),
    fetchPage(`${origin}/robots.txt`, { timeoutMs: 5000 }),
    fetchPage(`${origin}/llms.txt`, { timeoutMs: 5000 }),
    fetchPage(`${origin}/sitemap.xml`, { timeoutMs: 5000 }),
    pageSpeed(url.href),
  ]);
  const robotsTxt = robots.ok && !/<html/i.test(robots.body || "") ? robots.body : "";
  return {
    page,
    html: page.ok ? parseHtml(page.body) : null,
    robotsTxt,
    llms: llms.ok && !/<html|<!doctype/i.test((llms.body || "").slice(0, 400)) && (llms.body || "").trim().length > 20,
    sitemap: (sitemap.ok && /<(urlset|sitemapindex)/i.test(sitemap.body || "")) || /^\s*sitemap\s*:/im.test(robotsTxt),
    psi,
  };
};

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 100);

/**
 * input: { kind: "business"|"artist", name, what, city, website, gbp, reviews, press, nameRank }
 * Returns { overall, scores, grade, checks, top, meta }.
 */
export async function runAudit(input) {
  const kind = input.kind === "artist" ? "artist" : "business";
  const name = input.name;
  const what = input.what || "";
  const city = input.city || "";
  const url = normalizeUrl(input.website);
  const platform = url ? platformFor(url.hostname) : null;
  const ownSite = url && !platform ? url : null;

  const [site, wikidata, wikipedia, musicbrainz, osm] = await Promise.all([
    sitePart(ownSite),
    lookupWikidata(name),
    kind === "artist" ? lookupWikipedia(name) : Promise.resolve(null),
    kind === "artist" ? lookupMusicBrainz(name) : Promise.resolve(null),
    kind === "business" && city ? lookupOsm(name, city) : Promise.resolve(null),
  ]);

  const checks = [];
  const add = (cat, id, weight, status, label, detail, fix) => checks.push({ cat, id, weight, status, label, detail, fix });
  const h = site?.html;
  const loaded = !!h;

  // ——— SEO ———
  if (!url) {
    add("seo", "website", 4, "fail", "No website", `We couldn't find a website for ${name}. Google ranks websites — without one, competitors with a site take the clicks and calls.`, "Get a fast, simple website that says what you do and where, with a clear call or book button.");
  } else if (platform) {
    add("seo", "website", 4, "fail", `Your main link is ${platform}, not your own website`, `${platform} pages rarely rank for searches like “${what || (kind === "artist" ? "new music" : "near me")}${city ? ` in ${city}` : ""}”, and you don't control them.`, "Add a website you own and point your profiles to it. It becomes the source Google and AI trust.");
  } else if (!loaded) {
    add("seo", "website", 4, "fail", "Your website didn't load", `We tried ${url.hostname} and got: ${site?.page?.error || `HTTP ${site?.page?.status}`}. If we can't load it, Google and customers may not either.`, "Fix hosting, domain or SSL errors first — every other fix depends on it.");
  } else {
    add("seo", "website", 4, "pass", "Website loads", `${url.hostname} responded in ${site.page.ms} ms.`, "");
  }

  if (loaded) {
    const finalUrl = new URL(site.page.url);
    add("seo", "https", 2, finalUrl.protocol === "https:" ? "pass" : "fail", finalUrl.protocol === "https:" ? "Secure (HTTPS)" : "Site isn't secure (no HTTPS)", finalUrl.protocol === "https:" ? "Browsers show your site as secure." : "Browsers warn visitors your site is “Not secure”, and Google prefers HTTPS pages.", "Turn on a free SSL certificate and redirect http to https.");

    const noindex = h.robots.includes("noindex") || String(site.page.headers?.["x-robots-tag"] || "").toLowerCase().includes("noindex");
    add("seo", "indexable", 4, noindex ? "fail" : "pass", noindex ? "Your homepage tells Google not to index it" : "Google is allowed to index your homepage", noindex ? "A “noindex” tag hides this page from Google completely." : "No noindex tag found.", "Remove the noindex tag (often a “discourage search engines” setting left on after launch).");

    const wc = h.wordCount;
    add(
      "seo",
      "content",
      3,
      wc >= 250 ? "pass" : wc >= 80 ? "warn" : "fail",
      wc >= 250 ? "Enough readable text" : wc >= 80 ? "Thin homepage content" : "Google and AI see almost no text",
      wc >= 80 ? `About ${wc} words of readable text on your homepage.` : `Only ${wc} words of text are in the page's HTML.${h.scripts > 3 ? " Your content likely loads with JavaScript, which many crawlers and AI tools don't run." : ""}`,
      "Put real text in the page: what you do, where, prices or packages, and answers to common questions.",
    );

    const tl = h.title.length;
    add("seo", "title", 2, !tl ? "fail" : tl >= 15 && tl <= 65 ? "pass" : "warn", !tl ? "Missing page title" : tl > 65 ? "Page title gets cut off in Google" : tl < 15 ? "Page title is too short" : "Good page title length", tl ? `“${h.title.slice(0, 90)}${tl > 90 ? "…" : ""}” (${tl} characters)` : "Your homepage has no <title>, so Google writes one for you.", "Write a 50–60 character title: what you do + where + your name.");

    const tWords = norm(h.title);
    const mentions = [...terms(what), ...terms(city)].some((w) => hasTerm(tWords, w));
    if (what || city) add("seo", "title-local", 2, mentions ? "pass" : "warn", mentions ? "Title says what you do or where" : "Title doesn't say what you do or where", mentions ? "Searchers and Google can match your title to their search." : `Your title doesn't mention “${what || city}”. People search for the service and the city, not just your name.`, `Example: “${what ? what[0].toUpperCase() + what.slice(1) : "Service"}${city ? ` in ${city}` : ""} | ${name}”.`);

    const dl = h.description.length;
    add("seo", "description", 1, !dl ? "fail" : dl >= 50 && dl <= 165 ? "pass" : "warn", !dl ? "Missing meta description" : dl >= 50 && dl <= 165 ? "Good meta description" : "Meta description needs work", dl ? `${dl} characters.` : "Google will pull random text from your page for the search snippet.", "Write a 140–155 character description with your offer and a reason to click.");

    const n1 = h.h1.length;
    add("seo", "h1", 1, n1 === 1 ? "pass" : n1 === 0 ? "fail" : "warn", n1 === 1 ? "One clear main heading (H1)" : n1 === 0 ? "No main heading (H1)" : `${n1} main headings (H1) — should be one`, n1 ? `“${h.h1[0].slice(0, 80)}”` : "Search engines use the H1 to understand what the page is about.", "Use one H1 that says what you do and where.");

    add("seo", "mobile", 2, h.viewport ? "pass" : "fail", h.viewport ? "Mobile-friendly setup" : "Not set up for phones", h.viewport ? "Viewport tag found." : "Without a viewport tag your site renders like a shrunken desktop page on phones.", "Add a responsive viewport tag and test on a phone.");

    add("seo", "sitemap", 1, site.sitemap ? "pass" : "warn", site.sitemap ? "Sitemap found" : "No sitemap found", site.sitemap ? "Google can discover all your pages." : "We didn't find /sitemap.xml or a Sitemap line in robots.txt.", "Publish a sitemap.xml and submit it in Google Search Console.");

    if (h.images > 0) {
      const p = pct(h.imagesWithAlt, h.images);
      add("seo", "alt", 1, p >= 80 ? "pass" : p >= 50 ? "warn" : "fail", `${p}% of images have alt text`, `${h.imagesWithAlt} of ${h.images} images are described.`, "Describe each image (e.g. “new roof installed in Marietta GA”) — it helps Google Images and accessibility.");
    }

    if (site.psi) {
      const s = site.psi.score;
      add("seo", "speed", 3, s >= 90 ? "pass" : s >= 50 ? "warn" : "fail", `Mobile speed score: ${s}/100`, `Google PageSpeed (mobile)${site.psi.lcp ? ` — main content appears in ${site.psi.lcp}` : ""}. Slow pages lose visitors before they call.`, "Compress images, remove heavy plugins and serve a static, cached site.");
    } else {
      const ms = site.page.ms;
      add("seo", "speed", 2, ms < 800 ? "pass" : ms < 2000 ? "warn" : "fail", `Server response: ${ms} ms`, "How long your server took to send the page (full mobile speed test was unavailable).", "Use faster hosting with caching and a CDN.");
    }

    add("seo", "social-preview", 1, h.ogTitle && h.ogImage ? "pass" : "warn", h.ogTitle && h.ogImage ? "Share preview set up" : "No share preview image", h.ogTitle && h.ogImage ? "Links to your site show a title and image when shared." : "When someone texts or posts your link, it shows up plain — fewer clicks.", "Add Open Graph title and image tags.");
  }

  if (kind === "artist" && input.nameRank) {
    const map = { top: "pass", somewhere: "warn", no: "fail", unsure: "warn" };
    add("seo", "name-search", 3, map[input.nameRank] || "warn", input.nameRank === "top" ? "You own your name on Google" : "You don't own your name on Google yet", input.nameRank === "top" ? "Searching your name shows you first." : "When fans search your name, other people, pages or random results come first.", "Own your name: a website with your name as the title, consistent profiles, and an artist entity in knowledge sources.");
  }

  // ——— AEO ———
  if (loaded) {
    const t = h.types;
    add("aeo", "schema", 3, h.jsonLdBlocks || t.length ? "pass" : "fail", h.jsonLdBlocks || t.length ? "Structured data found" : "No structured data (schema)", t.length ? `Types found: ${t.slice(0, 6).join(", ")}.` : "Schema is the machine-readable label that tells Google and AI exactly who you are.", "Add JSON-LD schema for your business (or artist), services, reviews and FAQs.");

    const entityOk = kind === "business" ? t.some((x) => BUSINESS_TYPE.test(x)) : t.some((x) => ARTIST_TYPE.test(x));
    add("aeo", "entity", 3, entityOk ? "pass" : t.includes("Organization") ? "warn" : "fail", entityOk ? (kind === "business" ? "Marked up as a local business" : "Marked up as an artist") : kind === "business" ? "Not marked up as a local business" : "Not marked up as an artist", entityOk ? "Search engines can read your business type, address and hours directly." : kind === "business" ? "Without LocalBusiness schema, AI has to guess your category, area and hours." : "Without MusicGroup/Person schema, AI can confuse you with someone else with the same name.", kind === "business" ? "Add LocalBusiness schema with name, address, phone, hours, area served and sameAs links." : "Add MusicGroup or Person schema with your genre, city and every profile link.");

    const qHeads = [...h.h2, ...h.h3].filter((x) => x.trim().endsWith("?")).length;
    const faq = t.includes("FAQPage") || qHeads >= 3;
    add("aeo", "faq", 2, faq ? "pass" : qHeads ? "warn" : "fail", faq ? "Answers real questions" : "Doesn't answer customer questions", faq ? `${t.includes("FAQPage") ? "FAQ schema found. " : ""}${qHeads} question headings.` : "AI answer engines quote pages that answer questions directly — “How much does…”, “Do you serve…”.", "Add an FAQ section with 5–8 real questions customers ask, answered in 2–3 sentences each.");

    const intro = norm(h.text.slice(0, 900));
    if (what) {
      const ok = terms(what).some((w) => hasTerm(intro, w));
      add("aeo", "answer-first", 2, ok ? "pass" : "warn", ok ? "Says what you do up front" : "Doesn't say what you do up front", ok ? `The top of your page mentions “${what}”.` : `The top of your homepage never says “${what}”. AI summaries pull from the first lines.`, `Open with one plain sentence: “${name} is a ${what}${city ? ` in ${city}` : ""} that…”.`);
    }

    if (kind === "business") {
      const phone = h.anchors.some((a) => a.toLowerCase().startsWith("tel:")) || /\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/.test(h.text);
      add("aeo", "phone", 2, phone ? "pass" : "fail", phone ? "Phone number on the page" : "No phone number on the page", phone ? "Customers and assistants can call you directly." : "Assistants can't recommend a business they can't connect to a phone number.", "Put a tap-to-call phone number in the header and footer, matching your Google profile exactly.");
      if (city) {
        const ok = terms(city).some((w) => hasTerm(norm(h.text), w)) || norm(h.text).includes(norm(city));
        add("aeo", "location", 2, ok ? "pass" : "fail", ok ? `Mentions ${city}` : `Never mentions ${city}`, ok ? "Your location is on the page." : `Google and AI can't tell you serve ${city} — so you're left out of “near me” answers.`, `Name ${city} and the neighborhoods you serve on your homepage and service pages.`);
      }
    }

    const h2 = h.h2.length;
    add("aeo", "structure", 1, h2 >= 3 ? "pass" : h2 ? "warn" : "fail", h2 >= 3 ? "Clear section headings" : "Few section headings", `${h2} H2 headings.`, "Break the page into sections with descriptive headings (Services, Areas we serve, Pricing, FAQ).");
  } else {
    add("aeo", "schema", 3, "fail", "Nothing for answer engines to read", "Without a website you own, Google's AI Overviews, ChatGPT and Perplexity have no page to quote about you.", "Get a site with clear answers, schema and FAQs — that's what answer engines quote.");
    if (kind === "business") add("aeo", "phone", 2, "warn", "Phone and address only live on third-party sites", "Assistants pull your details from whatever they can find — often outdated.", "Publish your name, address and phone on your own site, matching Google exactly.");
  }

  // ——— GEO ———
  if (loaded) {
    const blocked = blockedAiBots(site.robotsTxt);
    const keyBlocked = blocked.filter((b) => KEY_AI_BOTS.includes(b));
    add("geo", "ai-crawlers", 3, keyBlocked.length ? "fail" : blocked.length ? "warn" : "pass", keyBlocked.length ? "Your site blocks AI search engines" : blocked.length ? "Some AI crawlers are blocked" : "AI search engines can read your site", blocked.length ? `robots.txt blocks: ${blocked.join(", ")}.` : "Your robots.txt doesn't block ChatGPT, Perplexity, Claude or Google's AI crawlers.", "Allow OAI-SearchBot, PerplexityBot, ClaudeBot and Google-Extended in robots.txt (many hosts block them by default).");

    add("geo", "llms", 1, site.llms ? "pass" : "warn", site.llms ? "llms.txt found" : "No llms.txt", site.llms ? "You give AI assistants a clean summary of your site." : "An llms.txt file is a plain-language summary of your business for AI tools. It's new, cheap to add and helps them describe you correctly.", "Add /llms.txt with who you are, what you do, where, and your key pages.");

    const socialLinks = new Set([...h.anchors, ...h.sameAs].map((a) => { try { return platformFor(new URL(a, "https://x.invalid").hostname); } catch { return null; } }).filter(Boolean));
    const n = socialLinks.size;
    add("geo", "profiles", 2, n >= 2 || h.sameAs.length >= 2 ? "pass" : n === 1 ? "warn" : "fail", n >= 2 ? "Website links to your profiles" : "Website isn't connected to your profiles", n ? `Linked: ${[...socialLinks].join(", ")}.` : "No links to your Google, social or music profiles.", "Link every official profile from your site and list them as sameAs in your schema, so AI knows they're all you.");
  } else {
    add("geo", "ai-crawlers", 3, "fail", "No site for AI engines to learn from", "Generative engines recommend businesses and artists they can verify across several sources — your own site is the anchor.", "Launch a site you own and connect it to every profile.");
  }

  if (wikidata) add("geo", "wikidata", kind === "artist" ? 2 : 1, wikidata.found ? "pass" : "warn", wikidata.found ? "Found in Wikidata (knowledge graph)" : "Not in Wikidata (knowledge graph)", wikidata.found ? `Entity ${wikidata.id}${wikidata.description ? ` — “${wikidata.description}”` : ""}.` : "Wikidata is an open knowledge graph that search engines and AI models use to confirm who's who.", kind === "artist" ? "Create a Wikidata item with your genre, origin, label and official links (follow its notability rules)." : "Make sure your details are consistent across Google, Apple Maps, Yelp, Facebook and industry directories.");
  if (wikipedia) add("geo", "wikipedia", 1, wikipedia.found ? "pass" : "warn", wikipedia.found ? "Has a Wikipedia page" : "No Wikipedia page", wikipedia.found ? `“${wikipedia.title}”.` : "Most independent artists don't have one — press coverage comes first.", "Earn press from independent sources; that's what makes a Wikipedia page possible later.");
  if (musicbrainz) add("geo", "musicbrainz", 2, musicbrainz.found ? "pass" : "fail", musicbrainz.found ? "Listed in MusicBrainz" : "Not in MusicBrainz", musicbrainz.found ? "Your artist entry exists in the open music database." : "MusicBrainz is the open music database that many apps, search engines and AI tools pull artist facts from.", "Add your artist, releases and official links to MusicBrainz (free).");
  if (osm) add("geo", "maps", 1, osm.found ? "pass" : "warn", osm.found ? "Listed on OpenStreetMap" : "Not found on OpenStreetMap", osm.found ? osm.label : "OpenStreetMap is the open map that many apps and AI tools use for local places.", "Add your business to OpenStreetMap and confirm Apple Business Connect and Bing Places listings.");

  if (kind === "artist" && input.press) {
    const map = { none: "fail", some: "warn", lots: "pass" };
    add("geo", "press", 3, map[input.press] || "warn", input.press === "lots" ? "Real press coverage" : input.press === "some" ? "A little press coverage" : "No press coverage yet", "AI engines name artists that other sites write about — blogs, playlists, interviews, local news.", "Pitch blogs, playlist curators and local outlets every release; post each feature on your site.");
  }

  // ——— Reviews (businesses) ———
  if (kind === "business") {
    const gbpMap = { yes: "pass", unsure: "warn", no: "fail" };
    add("reviews", "gbp", 4, gbpMap[input.gbp] || "warn", input.gbp === "yes" ? "Google Business Profile claimed" : input.gbp === "no" ? "No Google Business Profile" : "Google Business Profile status unknown", input.gbp === "yes" ? "You control your Maps listing." : "Your Google Business Profile is what shows in the map pack and “near me” searches — it's the #1 source of local calls.", "Claim and verify your profile, then fill every field: category, services, hours, photos and service area.");
    const revMap = { "0-9": "fail", "10-49": "warn", "50-99": "warn", "100+": "pass" };
    const rev = input.reviews;
    add("reviews", "review-count", 4, revMap[rev] || "fail", rev === "100+" ? "100+ Google reviews" : `${rev || "0–9"} Google reviews`, rev === "100+" ? "Strong review count. Keep them coming — recent reviews matter." : "Google says review count and rating factor into local ranking. Most customers compare review counts before they call.", "Ask every customer at checkout — a tap card on the counter turns the ask into a 10-second tap.");
    if (loaded) {
      const hasLink = /g\.page\/r\/|writereview|search\.google\.com\/local|maps\.app\.goo\.gl/i.test(h.anchors.join(" "));
      add("reviews", "review-link", 1, hasLink ? "pass" : "warn", hasLink ? "“Review us” link on your website" : "No “Review us on Google” link on your site", hasLink ? "Happy customers can find your review page." : "Customers who want to leave a review have to hunt for it.", "Add your Google review link to your site, receipts, emails and texts.");
    }
    add("reviews", "review-ask", 2, rev === "100+" ? "pass" : "warn", "In-person review ask", rev === "100+" ? "Your review flow is working." : "Most satisfied customers never leave a review because nobody asked at the right moment.", "Put an NFC review card where customers pay or pick up, and ask everyone — Google doesn't allow asking only happy customers.");
  }

  const categories = kind === "business" ? ["seo", "aeo", "geo", "reviews"] : ["seo", "aeo", "geo"];
  const { scores, overall } = scoreChecks(checks, categories);
  const top = checks
    .filter((c) => c.status === "fail" || c.status === "warn")
    .sort((a, b) => b.weight * (1 - VALUE[b.status]) - a.weight * (1 - VALUE[a.status]))
    .slice(0, 5)
    .map((c) => c.id);

  return {
    kind,
    name,
    overall,
    scores,
    categories,
    checks,
    top,
    meta: { site: ownSite?.hostname || null, platform, psi: !!site?.psi, checkedAt: new Date().toISOString() },
  };
}
