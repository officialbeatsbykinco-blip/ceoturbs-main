// HTML -> Markdown for the AI-agent copy of each page (/about.md, /index.md …).
// Built from the same prerendered HTML people get, so the words match the page exactly: it only drops the
// code, menus, icons and buttons an AI reader doesn't need. Used by scripts/prerender.mjs and the tests.
import { JSDOM } from "jsdom";

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE", "IFRAME", "VIDEO", "AUDIO", "CANVAS", "FORM", "DIALOG", "INPUT", "SELECT", "TEXTAREA", "BUTTON"]);
const BLOCK = new Set(["P", "DIV", "SECTION", "ARTICLE", "HEADER", "FOOTER", "ASIDE", "FIGURE", "FIGCAPTION", "DL", "DT", "DD", "MAIN", "NAV", "DETAILS", "SUMMARY"]);

/** Code, icons, controls and anything hidden from people. SVG tags come back lowercase from the parser, so compare in caps. */
// Buttons are controls ("Open menu", "Next"), except option pickers that show a price ("5 cards $59.99"): those stay.
const pricedButton = (el) => el.tagName === "BUTTON" && /\$\d/.test(el.textContent);
const skip = (el) => (SKIP.has(el.tagName.toUpperCase()) && !pricedButton(el)) || el.hasAttribute("hidden") || el.getAttribute("aria-hidden") === "true";

const clean = (t) => t.replace(/\s+/g, " ");

/** Absolute link for markdown, or null for links that mean nothing outside the page (#anchors, javascript:). */
function href(a, site) {
  const h = a.getAttribute("href");
  if (!h || h.startsWith("#") || h.startsWith("javascript:")) return null;
  if (h.startsWith("/")) return site + h;
  return h;
}

/** Two elements side by side in JSX are two separate things on screen ("Antony O." then "Google review"): keep a space between them. */
const gap = (out) => (out && !/\s$/.test(out) ? " " : "");

function inline(node, site) {
  let out = "";
  let prevEl = false;
  for (const n of node.childNodes) {
    if (n.nodeType === 3) {
      out += clean(n.textContent);
      prevEl = false;
      continue;
    }
    if (n.nodeType !== 1) continue;
    const el = n;
    if (skip(el)) continue;
    if (prevEl) out += gap(out);
    prevEl = true;
    if (el.tagName === "BR") out += "\n";
    else if (/^H[1-6]$/.test(el.tagName)) {
      const t = inline(el, site).trim();
      out += t ? `**${t}** ` : "";
    }
    else if (el.tagName === "IMG") {
      const alt = el.getAttribute("alt");
      if (alt) out += `[Image: ${clean(alt).trim()}]`;
    } else if (el.tagName === "A") {
      const text = inline(el, site).trim();
      const url = href(el, site);
      out += text ? (url ? `[${text}](${url})` : text) : "";
    } else if (el.tagName === "STRONG" || el.tagName === "B") {
      const t = inline(el, site).trim();
      out += t ? ` **${t}** ` : "";
    } else if (el.tagName === "EM" || el.tagName === "I") {
      const t = inline(el, site).trim();
      out += t ? ` *${t}* ` : "";
    } else if (BLOCK.has(el.tagName) || /^(H[1-6]|UL|OL|LI|TABLE|BLOCKQUOTE)$/.test(el.tagName)) {
      // A block inside inline context (a card link wrapping a heading and text): keep it on one line.
      out += ` ${inline(el, site)} `;
    } else out += inline(el, site);
  }
  return out;
}

const tidy = (t) => t.replace(/(\S)·/g, "$1 ·").replace(/[ \t]+/g, " ").replace(/ +([.,;:!?)])/g, "$1").replace(/\( +/g, "(").trim();

function blocks(node, site, depth = 0) {
  const out = [];
  let buf = "";
  let prevEl = false;
  const flush = () => {
    const t = tidy(buf);
    if (t) out.push(t);
    buf = "";
  };
  for (const n of node.childNodes) {
    if (n.nodeType === 3) {
      buf += clean(n.textContent);
      prevEl = false;
      continue;
    }
    if (n.nodeType !== 1) continue;
    const el = n;
    const tag = el.tagName;
    if (skip(el)) continue;
    const h = tag.match(/^H([1-6])$/);
    if (h) {
      flush();
      const t = tidy(inline(el, site));
      if (t) out.push(`${"#".repeat(+h[1])} ${t}`);
    } else if (tag === "UL" || tag === "OL") {
      flush();
      const items = [...el.children].filter((c) => c.tagName === "LI");
      const lines = items
        .map((li, i) => {
          const nested = [...li.children].filter((c) => c.tagName === "UL" || c.tagName === "OL");
          const own = li.cloneNode(true);
          for (const c of [...own.children]) if (c.tagName === "UL" || c.tagName === "OL") c.remove();
          const t = tidy(inline(own, site));
          const sub = nested.flatMap((c) => blocks({ childNodes: [c] }, site, depth + 1));
          const pad = "  ".repeat(depth);
          return [t ? `${pad}${tag === "OL" ? `${i + 1}.` : "-"} ${t}` : "", ...sub].filter(Boolean).join("\n");
        })
        .filter(Boolean);
      if (lines.length) out.push(lines.join("\n"));
    } else if (tag === "TABLE") {
      flush();
      const rows = [...el.querySelectorAll("tr")].map((tr) => [...tr.children].map((c) => tidy(inline(c, site)).replace(/\|/g, "\\|")));
      if (rows.length) {
        const w = Math.max(...rows.map((r) => r.length));
        const line = (r) => `| ${Array.from({ length: w }, (_, i) => r[i] ?? "").join(" | ")} |`;
        out.push([line(rows[0]), `|${" --- |".repeat(w)}`, ...rows.slice(1).map(line)].join("\n"));
      }
    } else if (tag === "BLOCKQUOTE") {
      flush();
      const t = blocks(el, site, depth).join("\n\n");
      if (t) out.push(t.split("\n").map((l) => `> ${l}`).join("\n"));
    } else if (tag === "BR") buf += "\n";
    else if (BLOCK.has(tag) || tag === "LI") {
      flush();
      out.push(...blocks(el, site, depth));
    } else if (tag === "A" && el.querySelector("h1,h2,h3,h4,h5,h6,p,div")) {
      // Card links (a whole service tile is one <a>): write the card out, then the link.
      flush();
      out.push(...blocks(el, site, depth));
      const url = href(el, site);
      if (url) out.push(`Link: ${url}`);
    } else {
      if (prevEl) buf += gap(buf);
      buf += inline({ childNodes: [el] }, site);
      prevEl = true;
      continue;
    }
    prevEl = false;
  }
  flush();
  return out;
}

/**
 * The AI copy of one page: title, summary and source link up top, then the page's <main> content as Markdown,
 * then contact details. `html` is the full prerendered document (or just the app markup).
 */
export function pageMarkdown(html, { title, description, url, site, phone, updated }) {
  const doc = new JSDOM(html).window.document;
  const main = doc.querySelector("main") ?? doc.body;
  const body = blocks(main, site)
    // Repeated identical lines (the same CTA rendered for phone and desktop) only need to be read once.
    .filter((b, i, all) => !(b.length < 120 && all.indexOf(b) !== i));
  return [
    `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\nurl: ${url}\nupdated: ${updated}\n---`,
    `> Plain-text version of ${url} for AI assistants. Same content as the web page.`,
    ...body,
    `---\n\nCEO Turbo · Tampa, Florida · Call or text ${phone} · ${site}`,
  ].join("\n\n") + "\n";
}

/** Where the markdown copy of a route lives: "/" -> "/index.md", "/about" -> "/about.md". */
export const markdownPath = (route) => (route === "/" ? "/index.md" : `${route}.md`);
