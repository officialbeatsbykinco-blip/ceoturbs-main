// The computer shop (/computers): listings live in Shopify, the site shows them.
// Any Shopify product with Product type "Computer", "Laptop" or "Desktop", or the tag "computer", is listed,
// once it's published to the Headless / Buy Button sales channel. See docs/computer-shop.md.
//
// The build fetches a snapshot so every listing is in the static HTML (search engines, fast first paint);
// the page then re-fetches live, so a new listing shows up right away even before the next deploy.
import { useEffect, useState } from "react";
import { SHOPIFY } from "@/config/site";

export type ComputerImage = { url: string; alt: string; width: number; height: number };
export type ComputerVariant = { id: string; title: string; available: boolean; price: number; compareAt: number | null; options: Record<string, string> };
export type Computer = {
  handle: string;
  title: string;
  /** Plain text, for meta descriptions and cards. */
  description: string;
  /** Shopify's HTML description; only read by parseDescription (never put into the page as HTML). */
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: ComputerImage[];
  price: number;
  compareAt: number | null;
  available: boolean;
  /** Real options only (Shopify's lone "Title / Default Title" is dropped). */
  options: { name: string; values: string[] }[];
  variants: ComputerVariant[];
  updatedAt: string;
};

export const COMPUTER_QUERY = "product_type:Computer OR product_type:Computers OR product_type:Laptop OR product_type:Laptops OR product_type:Desktop OR product_type:Desktops OR tag:computer OR tag:computers";

const QUERY = `query Computers($q: String!) {
  products(first: 100, query: $q, sortKey: CREATED_AT, reverse: true) {
    nodes {
      handle title description descriptionHtml productType vendor tags updatedAt availableForSale
      images(first: 12) { nodes { url altText width height } }
      options { name values }
      variants(first: 100) { nodes { id title availableForSale price { amount } compareAtPrice { amount } selectedOptions { name value } } }
    }
  }
}`;

type Raw = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  updatedAt: string;
  availableForSale: boolean;
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  options: { name: string; values: string[] }[];
  variants: { nodes: { id: string; title: string; availableForSale: boolean; price: { amount: string }; compareAtPrice: { amount: string } | null; selectedOptions: { name: string; value: string }[] }[] };
};

/** Shopify's product → the shape the shop uses. Exported for tests. */
export function toComputer(p: Raw): Computer {
  const variants = p.variants.nodes.map((v) => ({
    id: v.id,
    title: v.title,
    available: v.availableForSale,
    price: Number(v.price.amount),
    compareAt: v.compareAtPrice && Number(v.compareAtPrice.amount) > Number(v.price.amount) ? Number(v.compareAtPrice.amount) : null,
    options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
  }));
  const forSale = variants.filter((v) => v.available);
  const cheapest = [...(forSale.length ? forSale : variants)].sort((a, b) => a.price - b.price)[0];
  return {
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType,
    vendor: p.vendor,
    tags: p.tags,
    updatedAt: p.updatedAt,
    images: p.images.nodes.map((i) => ({ url: i.url, alt: i.altText || p.title, width: i.width, height: i.height })),
    price: cheapest?.price ?? 0,
    compareAt: cheapest?.compareAt ?? null,
    available: p.availableForSale,
    options: p.options.filter((o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title")),
    variants,
  };
}

export async function fetchComputers(): Promise<Computer[]> {
  const res = await fetch(`https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken },
    body: JSON.stringify({ query: QUERY, variables: { q: COMPUTER_QUERY } }),
    signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10000) : undefined,
  });
  const json = (await res.json()) as { data?: { products: { nodes: Raw[] } }; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data) throw new Error(json.errors?.[0]?.message || `Shopify ${res.status}`);
  return json.data.products.nodes.map(toComputer);
}

// ── Snapshot + live list ────────────────────────────────────────────────────
declare global {
  interface Window {
    __COMPUTERS__?: Computer[];
  }
}

let snapshot: Computer[] = (typeof window !== "undefined" && window.__COMPUTERS__) || [];
let live: Promise<Computer[]> | null = null;

/** Build time: the list every prerendered page renders with. */
export function setComputerSnapshot(list: Computer[]) {
  snapshot = list;
  live = null;
}
export const computerSnapshot = () => snapshot;
export const findComputer = (handle: string) => snapshot.find((c) => c.handle === handle);

function loadLive() {
  if (!live)
    live = fetchComputers().then(
      (list) => {
        snapshot = list;
        return list;
      },
      (e) => {
        live = null;
        throw e;
      },
    );
  return live;
}

/** The listings: the build-time snapshot first (matches the static HTML), then the live list from Shopify. */
export function useComputers() {
  const [list, setList] = useState<Computer[]>(snapshot);
  const [state, setState] = useState<"loading" | "ready" | "error">(snapshot.length ? "ready" : "loading");
  /** True once the live list has come back (or failed): until then a listing missing from the snapshot may still be on its way. */
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let on = true;
    loadLive().then(
      (l) => {
        if (!on) return;
        setList(l);
        setState("ready");
        setSettled(true);
      },
      () => {
        if (!on) return;
        setState(snapshot.length ? "ready" : "error");
        setSettled(true);
      },
    );
    return () => {
      on = false;
    };
  }, []);
  return { list, state, settled };
}

// ── Display helpers ─────────────────────────────────────────────────────────
/** Whole-word match in the product type, title and tags ("mac" matches "Mac mini", not "machine"). */
const has = (c: Computer, ...words: string[]) => {
  const hay = ` ${[c.productType, c.title, ...c.tags].join(" ").toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  return words.some((w) => hay.includes(` ${w.replace(/[^a-z0-9]+/g, " ")} `));
};

export type ComputerKind = "Laptops" | "Desktops" | "Gaming" | "Macs";
export const KINDS: ComputerKind[] = ["Laptops", "Desktops", "Gaming", "Macs"];
export function kindsOf(c: Computer): ComputerKind[] {
  const k: ComputerKind[] = [];
  if (has(c, "laptop", "laptops", "notebook", "chromebook", "macbook", "macbook air", "macbook pro")) k.push("Laptops");
  if (has(c, "desktop", "desktops", "tower", "all in one", "imac", "mini pc", "mac mini")) k.push("Desktops");
  if (has(c, "gaming", "rtx", "radeon rx")) k.push("Gaming");
  if (has(c, "mac", "macbook", "imac", "apple")) k.push("Macs");
  return k;
}

/** New / Refurbished / Used / Open box, from the tags (or the title). */
export function conditionOf(c: Computer): string | null {
  if (has(c, "open box")) return "Open box";
  if (has(c, "refurbished", "refurb", "renewed")) return "Refurbished";
  if (has(c, "used", "pre owned", "preowned")) return "Used";
  if (c.tags.some((t) => t.toLowerCase() === "new") || /\bnew\b/i.test(c.productType)) return "New";
  return null;
}

/** Shopify image CDN resize (keeps aspect ratio). */
export const sized = (url: string, width: number) => `${url}${url.includes("?") ? "&" : "?"}width=${width}`;

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Splits Shopify's description into a spec table and plain paragraphs. A line like "Processor: Intel Core i7"
 * (or a two-cell table row) becomes a spec row; everything else stays text. Text only: no HTML from Shopify is
 * ever put into the page.
 */
export function parseDescription(html: string): { specs: [string, string][]; paragraphs: string[] } {
  const specs: [string, string][] = [];
  const paragraphs: string[] = [];
  const rows = html.replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, ": ");
  for (const raw of rows.split(/<br\s*\/?>|<\/(?:p|li|tr|h[1-6]|div)>|\n/i)) {
    const line = decode(raw.replace(/<[^>]+>/g, " "));
    if (!line) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9 /&().+-]{1,28}?)\s*:\s+(.{1,160})$/);
    if (m && !/[.!?]$/.test(m[1])) specs.push([m[1].trim(), m[2].trim()]);
    else paragraphs.push(line);
  }
  return { specs, paragraphs };
}
