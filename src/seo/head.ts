import { SITE } from "@/config/site";
import type { PageMeta } from "./pages";
import { abs, graph } from "./schema";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON for a <script> tag — escapes "<" so content can't close the tag. */
export const safeJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** Full <head> markup for a prerendered page. */
export function renderHead(meta: PageMeta): string {
  const url = abs(meta.path);
  const image = abs(meta.ogImage ?? SITE.ogImage);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:secure_url" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@ChristopherRCEO" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${esc(meta.title)}" />`,
  ];
  const v = SITE.verification;
  if (v.meta) tags.push(`<meta name="facebook-domain-verification" content="${esc(v.meta)}" />`);
  if (v.microsoft) tags.push(`<meta name="msvalidate.01" content="${esc(v.microsoft)}" />`);
  if (v.google) tags.push(`<meta name="google-site-verification" content="${esc(v.google)}" />`);
  if (meta.schema.length) {
    tags.push(`<script type="application/ld+json" id="page-schema">${safeJson(graph(meta.schema))}</script>`);
  }
  return tags.join("\n    ");
}

/** Client-side navigation: keep title, description, canonical, OG and schema in sync. */
export function applyHead(meta: PageMeta) {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  const url = abs(meta.path);
  const image = abs(meta.ogImage ?? SITE.ogImage);
  set('meta[name="description"]', "content", meta.description);
  set('link[rel="canonical"]', "href", url);
  set('meta[name="robots"]', "content", meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  set('meta[property="og:title"]', "content", meta.title);
  set('meta[property="og:description"]', "content", meta.description);
  set('meta[property="og:url"]', "content", url);
  set('meta[property="og:image"]', "content", image);
  set('meta[property="og:image:secure_url"]', "content", image);
  set('meta[property="og:image:alt"]', "content", meta.title);
  set('meta[name="twitter:image:alt"]', "content", meta.title);
  set('meta[name="twitter:title"]', "content", meta.title);
  set('meta[name="twitter:description"]', "content", meta.description);
  set('meta[name="twitter:image"]', "content", image);
  const schema = document.getElementById("page-schema");
  if (schema) schema.textContent = safeJson(graph(meta.schema));
}
