// Head tags and Product schema for each computer listing (/computers/:handle). The listings come from Shopify,
// so these pages are built from the build-time snapshot (scripts/prerender.mjs) or, client-side, from the live list.
import { SITE } from "@/config/site";
import { COMPUTERS_PATH, COMPUTER_SHELL, computerPath } from "@/content/computer-shop";
import { conditionOf, findComputer, type Computer } from "@/lib/computers";
import type { PageMeta } from "./pages";
import * as S from "./schema";

const clip = (s: string, max = 155) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(" ", max - 1))}…`);
const base = () => [S.organization(), S.website(), S.founder()];

const CONDITION: Record<string, string> = {
  New: "https://schema.org/NewCondition",
  Refurbished: "https://schema.org/RefurbishedCondition",
  Used: "https://schema.org/UsedCondition",
  "Open box": "https://schema.org/UsedCondition",
};

export function computerProduct(c: Computer) {
  const url = `${SITE.url}${computerPath(c.handle)}`;
  const condition = conditionOf(c);
  const offer = (price: number, available: boolean, sku?: string) => ({
    "@type": "Offer",
    url,
    priceCurrency: "USD",
    price: price.toFixed(2),
    availability: available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    ...(condition ? { itemCondition: CONDITION[condition] } : {}),
    ...(sku ? { sku } : {}),
    seller: { "@id": S.ORG_ID },
  });
  const prices = c.variants.map((v) => v.price);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: c.title,
    description: clip(c.description || c.title, 500),
    url,
    image: c.images.map((i) => i.url),
    sku: c.handle,
    ...(c.vendor && c.vendor !== SITE.name ? { brand: { "@type": "Brand", name: c.vendor } } : {}),
    category: "Electronics > Computers",
    offers:
      c.variants.length > 1
        ? { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: Math.min(...prices).toFixed(2), highPrice: Math.max(...prices).toFixed(2), offerCount: c.variants.length, availability: c.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut", url }
        : offer(c.price, c.available),
  };
}

const fit = (t: string) => (`${t} | CEO Turbo`.length <= 60 ? `${t} | CEO Turbo` : t.length <= 65 ? t : `${t.slice(0, t.lastIndexOf(" ", 62))}…`);

export function computerMeta(c: Computer): PageMeta {
  const path = computerPath(c.handle);
  const condition = conditionOf(c);
  const lead = `${condition ? `${condition} ` : ""}${c.title}, $${c.price.toLocaleString("en-US")}.`;
  return {
    path,
    title: fit(c.title),
    description: clip(`${lead} ${c.description || "Buy online from a Tampa computer tech, with setup and repairs from the same person."}`),
    ogImage: c.images[0]?.url,
    priority: 0.7,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage(path, c.title, clip(c.description || c.title), "ItemPage"), computerProduct(c), S.breadcrumbs([{ name: "Computers", path: COMPUTERS_PATH }, { name: c.title, path }])],
  };
}

/** The page shown for a listing added after the last deploy, before the live list loads. */
export const computerShellMeta = (handle = COMPUTER_SHELL): PageMeta => ({
  path: computerPath(handle),
  title: "Computer for Sale | CEO Turbo Computer Shop",
  description: "A computer for sale from CEO Turbo, a Tampa computer tech: photos, specs and secure checkout, with setup and repairs from the same person.",
  noindex: true,
  priority: 0.1,
  changefreq: "weekly",
  group: "Core",
  schema: base(),
});

/** /computers/<handle> → its meta (snapshot), the shell meta, or undefined for any other path. */
export function computerPageFor(path: string): PageMeta | undefined {
  const m = path.match(/^\/computers\/([^/]+)$/);
  if (!m) return undefined;
  const c = findComputer(m[1]);
  return c ? computerMeta(c) : computerShellMeta(m[1]);
}
