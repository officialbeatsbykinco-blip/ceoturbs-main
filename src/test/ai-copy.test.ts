// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pageMarkdown, markdownPath as buildPath } from "../../scripts/markdown.mjs";
import middleware, { config, markdownPath, wantsMarkdown } from "../../middleware.js";
import { hasMarkdown, markdownPath as headPath, renderHead } from "@/seo/head";
import { PAGES as pages } from "@/seo/pages";

const opts = { title: "T", description: "D", url: "https://www.ceoturbo.com/x", site: "https://www.ceoturbo.com", phone: "(678) 558-4327", updated: "2026-11-20" };

describe("AI copy: Markdown from the page HTML", () => {
  const html = `<html><body><header><nav><a href="/">Menu</a></nav></header><main>
    <h1>Computer repair in Tampa</h1>
    <p>Price up front, <strong>no fix no charge</strong>.</p>
    <svg><text>icon</text></svg><button>Open quiz</button><script>alert(1)</script>
    <ul><li><a href="/computer-repair-tampa"><h3>Laptop repair</h3><p>from $149</p></a></li></ul>
    <span>Antony O.</span><span>Google review</span>
    <table><tr><th>Service</th><th>Price</th></tr><tr><td>SSD</td><td>$199</td></tr></table>
    <img src="/a.webp" alt="A desk we set up" />
    <span aria-hidden="true">hidden</span>
  </main><footer>Footer stuff</footer></body></html>`;
  const md = pageMarkdown(html, opts);

  it("keeps the page's words, headings, links, tables and image descriptions", () => {
    expect(md).toContain("# Computer repair in Tampa");
    expect(md).toContain("Price up front, **no fix no charge**.");
    expect(md).toContain("[**Laptop repair** from $149](https://www.ceoturbo.com/computer-repair-tampa)");
    expect(md).toContain("Antony O. Google review");
    expect(md).toContain("| Service | Price |\n| --- | --- |\n| SSD | $199 |");
    expect(md).toContain("[Image: A desk we set up]");
    expect(md).toMatch(/^---\ntitle: "T"\ndescription: "D"\nurl: https:\/\/www\.ceoturbo\.com\/x/);
  });

  it("drops code, menus, buttons, footer and hidden text", () => {
    for (const gone of ["alert(1)", "icon", "Open quiz", "Menu", "Footer stuff", "hidden"]) expect(md).not.toContain(gone);
  });

  it("puts each copy at the page URL plus .md, the same way in the build, the <head> and the middleware", () => {
    for (const fn of [buildPath, headPath, markdownPath]) {
      expect(fn("/")).toBe("/index.md");
      expect(fn("/computer-repair-tampa")).toBe("/computer-repair-tampa.md");
    }
    expect(markdownPath("/about/")).toBe("/about.md");
  });

  it("links the copy from indexable pages only", () => {
    const home = pages.find((p) => p.path === "/")!;
    expect(renderHead(home)).toContain('<link rel="alternate" type="text/markdown" href="/index.md"');
    const hidden = pages.find((p) => p.noindex)!;
    expect(hasMarkdown(hidden)).toBe(false);
    expect(renderHead(hidden)).not.toContain("text/markdown");
  });
});

describe("AI copy: middleware", () => {
  afterEach(() => vi.unstubAllGlobals());
  const req = (ua: string, p = "/computer-repair-tampa", accept = "text/html") => new Request(`https://www.ceoturbo.com${p}`, { headers: { "user-agent": ua, accept } });

  it("serves AI assistants the copy and leaves people, Googlebot and Bingbot on the normal page", () => {
    for (const ua of ["Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)", "Mozilla/5.0 ChatGPT-User/1.0", "Claude-User/1.0", "ClaudeBot/1.0", "PerplexityBot/1.0", "Perplexity-User/1.0"]) {
      expect(wantsMarkdown(req(ua).headers), ua).toBe(true);
    }
    for (const ua of ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Mozilla/5.0 (compatible; bingbot/2.0)"]) {
      expect(wantsMarkdown(req(ua).headers), ua).toBe(false);
    }
    expect(wantsMarkdown(req("curl/8", "/", "text/markdown, text/html;q=0.9").headers)).toBe(true);
  });

  it("returns the .md file as text/markdown with a canonical link, and falls through when there's none", async () => {
    const fetchMock = vi.fn(async (u: URL) => (String(u).endsWith("/computer-repair-tampa.md") ? new Response("# Repair") : new Response("no", { status: 404 })));
    vi.stubGlobal("fetch", fetchMock);
    const res = (await middleware(req("GPTBot/1.2")))!;
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("link")).toBe('<https://www.ceoturbo.com/computer-repair-tampa>; rel="canonical"');
    expect(await res.text()).toBe("# Repair");
    expect(await middleware(req("GPTBot/1.2", "/booked"))).toBeUndefined();
    expect(await middleware(req("Mozilla/5.0 Safari"))).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("never runs on files, the API or build assets", () => {
    const re = new RegExp(`^${config.matcher[0].replace("/(", "/(")}$`);
    for (const p of ["/", "/computer-repair-tampa", "/services/google-ads"]) expect(re.test(p), p).toBe(true);
    for (const p of ["/index.md", "/api/lead", "/assets/app.js", "/img/a.webp", "/llms.txt", "/sitemap.xml"]) expect(re.test(p), p).toBe(false);
  });

  it("is listed in llms.txt and served with the right headers", () => {
    const prerender = readFileSync(path.resolve(__dirname, "../../scripts/prerender.mjs"), "utf8");
    expect(prerender).toContain("llms-full.txt");
    expect(prerender).toContain("Plain-text copies for AI assistants");
    const vercel = JSON.parse(readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8"));
    const md = vercel.headers.find((h: { source: string }) => h.source === "/(.*)\\.md");
    expect(md.headers).toEqual(expect.arrayContaining([{ key: "X-Robots-Tag", value: "noindex" }, { key: "Content-Type", value: "text/markdown; charset=utf-8" }]));
  });
});
