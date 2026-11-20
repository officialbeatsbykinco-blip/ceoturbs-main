// Vercel Routing Middleware: AI assistants get the plain Markdown copy of a page, people get the normal page.
//
// When ChatGPT, Claude, Perplexity and similar AI agents fetch a page (or any client asks for text/markdown),
// they get /<page>.md: the same words as the HTML page, built from it at deploy (scripts/markdown.mjs), without
// the scripts, menus and buttons. Google and Bing crawlers are NOT in the list: they keep getting the normal
// HTML page, so search indexing doesn't change. If anything goes wrong, the request falls through to the
// normal page.

export const config = {
  // Page URLs only: no files (anything with a dot), no API, no build assets.
  matcher: ["/((?!api/|assets/|img/|media/|og/|feeds/|_vercel|.*\\.).*)"],
};

/** AI agents and AI search fetchers (user-agent substrings). Googlebot and Bingbot are deliberately left out. */
export const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "cohere-ai",
  "Amazonbot",
  "meta-externalagent",
  "Meta-ExternalFetcher",
  "Applebot-Extended",
  "Bytespider",
  "PhindBot",
];

const AI_RE = new RegExp(AI_AGENTS.map((a) => a.replace(/[-]/g, "\\-")).join("|"), "i");

/** True when this request should get the Markdown copy. */
export function wantsMarkdown(headers) {
  const ua = headers.get("user-agent") || "";
  const accept = headers.get("accept") || "";
  return AI_RE.test(ua) || /(^|,)\s*text\/markdown/i.test(accept);
}

export const markdownPath = (pathname) => {
  const p = pathname.replace(/\/+$/, "");
  return p === "" ? "/index.md" : `${p}.md`;
};

export default async function middleware(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  if (!wantsMarkdown(request.headers)) return;
  try {
    const url = new URL(request.url);
    const res = await fetch(new URL(markdownPath(url.pathname), url.origin), { headers: { accept: "text/markdown" } });
    // No copy for this page (noindex pages, new shop listings): give the normal page.
    if (!res.ok) return;
    return new Response(request.method === "HEAD" ? null : res.body, {
      status: 200,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600",
        vary: "User-Agent, Accept",
        link: `<${url.origin}${url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "")}>; rel="canonical"`,
        "x-robots-tag": "noindex",
        "x-content-version": "markdown",
      },
    });
  } catch {
    return;
  }
}
