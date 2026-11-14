// Build-time renderer used by scripts/prerender.mjs. Waits for every lazy route
// (onAllReady) so each page's full content lands in static HTML for crawlers.
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Writable } from "node:stream";
import App from "./App";
import { PAGES, pageFor, NOT_FOUND_META } from "./seo/pages";
import { renderHead } from "./seo/head";
import { fetchComputers, setComputerSnapshot, type Computer } from "./lib/computers";
import { computerMeta, computerShellMeta } from "./seo/computers";
import { GUIDES, guidePath } from "./content/guides";
export { merchantFeed } from "./seo/feed";
export { PITCH_VIDEO as pitchVideo } from "./config/site";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
      final(cb) {
        resolve(html);
        cb();
      },
    });
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady: () => pipe(sink),
        onShellError: reject,
        onError: (err) => reject(err),
      },
    );
  });
}

/**
 * Fetches the computer listings from Shopify and makes them the snapshot every page renders with.
 * Returns the listing pages to prerender (plus the shell for listings added after this build) and the
 * JSON to embed so the browser starts from the same list. A failed fetch builds the shop with no listings;
 * the page still loads them live.
 */
export async function loadComputers() {
  let list: Computer[] = [];
  try {
    list = await fetchComputers();
  } catch (e) {
    console.warn(`computer shop: Shopify listings not fetched (${(e as Error).message}); the page will load them live`);
  }
  setComputerSnapshot(list);
  return { pages: [...list.map(computerMeta), computerShellMeta()], json: JSON.stringify(list).replace(/</g, "\\u003c") };
}

export const head = (path: string) => renderHead(pageFor(path) ?? NOT_FOUND_META);
export const pages = PAGES;
export const guides = GUIDES.map((g) => ({ path: guidePath(g), title: g.title, summary: g.summary }));
