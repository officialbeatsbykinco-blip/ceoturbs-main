// @vitest-environment node
// The free check's scores, run against known sample pages (no network: the page fetcher is stubbed).
import { describe, it, expect, vi } from "vitest";
const SITES = vi.hoisted(() => ({}) as Record<string, Record<string, string>>);
vi.mock("../../api/_lib/fetch-page.js", async (orig) => {
  const real = await orig<typeof import("../../api/_lib/fetch-page.js")>();
  return {
    ...real,
    fetchPage: async (u: string | URL) => {
      const href = typeof u === "string" ? u : u.href;
      const url = new URL(href.startsWith("http") ? href : "https://" + href);
      const site = SITES[url.hostname];
      const body = site?.[url.pathname];
      return body === undefined ? { ok: false, status: 404, url: url.href, body: "" } : { ok: true, status: 200, url: url.href, headers: {}, body, ms: 300 };
    },
    getJson: async () => null,
  };
});
import { runAudit } from "../../api/_lib/audit.js";

type Report = { checks: { id: string; status: string }[] };
const st = (r: Report, id: string) => r.checks.find((c) => c.id === id)?.status;

const filler = Array.from({ length: 60 }, (_, i) => `We fix leaks, install water heaters and clear drains for homes in Atlanta number ${i}.`).join(" ");
SITES["goodplumbing.com"] = {
  "/": `<!doctype html><html><head><title>Plumber in Atlanta, GA | Good Plumbing Co</title>
<meta name="description" content="Licensed Atlanta plumber for leaks, water heaters and drains. Same-day service, upfront prices and 5-star reviews. Call Good Plumbing today.">
<meta name="viewport" content="width=device-width"><meta property="og:title" content="x"><meta property="og:image" content="x.jpg">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Plumber","name":"Good Plumbing Co","sameAs":["https://facebook.com/g","https://instagram.com/g"]}</script>
<script type="application/ld+json">{"@type":"FAQPage"}</script></head><body>
<h1>Plumber in Atlanta</h1><p>Good Plumbing Co is a plumber in Atlanta. Call <a href="tel:+14045550100">(404) 555-0100</a>.</p>
<h2>Services</h2><h2>Areas we serve</h2><h2>FAQ</h2><h3>How much does a plumber cost?</h3>
<img src="a.jpg" alt="new water heater Atlanta"><a href="https://search.google.com/local/writereview?placeid=x">Review us</a>
<a href="https://facebook.com/g">FB</a><a href="https://instagram.com/g">IG</a><p>${filler}</p></body></html>`,
  "/robots.txt": "User-agent: *\nAllow: /\nSitemap: https://goodplumbing.com/sitemap.xml",
  "/llms.txt": "# Good Plumbing Co\nPlumber in Atlanta GA. Leaks, water heaters, drains.",
  "/sitemap.xml": "<urlset></urlset>",
};
SITES["badsite.com"] = {
  "/": `<html><head><meta name="robots" content="noindex"></head><body><div id="root"></div><script></script><script></script><script></script><script></script></body></html>`,
  "/robots.txt": "User-agent: GPTBot\nDisallow: /\nUser-agent: PerplexityBot\nDisallow: /",
};
SITES["glowspa.com"] = {
  "/": `<html><head><title>Day Spa in Miami | Glow Spa</title><meta name="viewport" content="width=device-width"></head><body><h1>Glow Spa</h1><p>Glow is a day spa in Miami offering facials and massages. ${filler}</p></body></html>`,
};

describe("free-check accuracy", () => {
  it("a well-built local site scores high and every key check passes", async () => {
    const r = await runAudit({ kind: "business", name: "Good Plumbing Co", what: "plumber", city: "Atlanta", website: "goodplumbing.com", gbp: "yes", reviews: "100+" });
    for (const id of ["website", "https", "indexable", "content", "title", "title-local", "description", "h1", "mobile", "sitemap", "alt", "schema", "entity", "faq", "answer-first", "phone", "location", "ai-crawlers", "llms", "profiles", "gbp", "review-count", "review-link"]) expect([id, st(r, id)]).toEqual([id, "pass"]);
    expect(r.overall).toBeGreaterThanOrEqual(90);
  });
  it("a broken site is scored low with the right failures", async () => {
    const r = await runAudit({ kind: "business", name: "Bad Biz", what: "roofer", city: "Atlanta", website: "badsite.com", gbp: "no", reviews: "0-9" });
    expect(st(r, "indexable")).toBe("fail");
    expect(st(r, "title")).toBe("fail");
    expect(st(r, "schema")).toBe("fail");
    expect(st(r, "ai-crawlers")).toBe("fail");
    expect(st(r, "content")).toBe("fail");
    expect(r.overall).toBeLessThan(40);
  });
  it("no website at all", async () => {
    const r = await runAudit({ kind: "business", name: "No Site", what: "roofer", city: "Atlanta", website: "", gbp: "unsure", reviews: "10-49" });
    expect(st(r, "website")).toBe("fail");
    expect(r.overall).toBeLessThan(40);
  });
  it("short service names (spa, gym, DJ) are recognised", async () => {
    const r = await runAudit({ kind: "business", name: "Glow Spa", what: "spa", city: "", website: "glowspa.com", gbp: "yes", reviews: "10-49" });
    expect(st(r, "title-local")).toBe("pass");
    expect(st(r, "answer-first")).toBe("pass");
  });
});
