// Headless Shopify checkout: the site's own buy box, Shopify's checkout.
// Talks to the Storefront API with the public token (what the Buy Button SDK does under the hood,
// without its 100 KB script or its UI). Purchase conversions are tracked on Shopify's side —
// see docs/tracking-setup.md.
import { CARD_PROGRAMMING, SHOPIFY, type ReviewPack, type ShirtProduct, type StandOption } from "@/config/site";
import { attribution } from "@/lib/track";

type Variant = { id: string; availableForSale: boolean; price: { amount: string }; selectedOptions: { name: string; value: string }[] };

const ENDPOINT = `https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`;

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(8000),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data) throw new Error(json.errors?.[0]?.message || `Shopify ${res.status}`);
  return json.data;
}

const variantsReq = new Map<string, Promise<Variant[]>>();

/** A product's variants, fetched once per product (the buy boxes prefetch this on idle). */
export function loadVariants(productId: string = SHOPIFY.productId) {
  let req = variantsReq.get(productId);
  if (!req) {
    req = gql<{ product: { variants: { nodes: Variant[] } } | null }>(
      `query Variants($id: ID!) { product(id: $id) { variants(first: 250) { nodes { id availableForSale price { amount } selectedOptions { name value } } } } }`,
      { id: `gid://shopify/Product/${productId}` },
    )
      .then((d) => {
        if (!d.product) throw new Error("Product not published to the Buy Button / Headless channel");
        return d.product.variants.nodes;
      })
      .catch((e) => {
        variantsReq.delete(productId);
        throw e;
      });
    variantsReq.set(productId, req);
  }
  return req;
}

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const packNumber = (v: string) => v.match(/\d+/)?.[0];

/** Matches the Pack option value; tolerant of "2 cards" vs "2-Pack" vs "Pack of 2". */
export function findVariant(variants: Variant[], pack: ReviewPack) {
  const match = variants.find((v) => v.selectedOptions.some((o) => norm(o.value) === norm(pack.shopifyOption) || packNumber(o.value) === String(pack.qty)));
  // No matching variant (e.g. the Color/Pack variants aren't set up yet): the buy box falls back to
  // the order-request form rather than sending people to a checkout with the wrong price.
  return match ? { variant: match, quantity: 1 } : null;
}

const numericId = (gid: string) => gid.split("/").pop()!;

/** The ad click ids, UTMs and landing page that ride along on every cart (visible on the order). */
function attributionAttributes(extra: Record<string, string | undefined>) {
  const a = attribution();
  return Object.entries({
    ...extra,
    Landing: a.landing,
    gclid: a.gclid,
    gbraid: a.gbraid,
    wbraid: a.wbraid,
    fbclid: a.fbclid,
    msclkid: a.msclkid,
    _fbp: a.fbp,
    _fbc: a.fbc,
    utm_source: a.utm_source,
    utm_medium: a.utm_medium,
    utm_campaign: a.utm_campaign,
    utm_content: a.utm_content,
    utm_term: a.utm_term,
  })
    .filter(([, v]) => v)
    // Click ids (fbclid, _fbc, gclid…) are kept whole or left out: a cut-off fbclid is an edited fbclid, which Meta rejects.
    .filter(([key, value]) => !/^(_?fbc|fbclid|_fbp|gclid|gbraid|wbraid|msclkid)$/.test(key) || String(value).length <= 250)
    .map(([key, value]) => ({ key, value: String(value).slice(0, 250) }));
}

type CartLine = { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] };

/**
 * Creates a Shopify cart and returns its checkout URL. UTMs and ad click ids are added to the
 * checkout URL so Shopify's own reports and the checkout pixels attribute the sale.
 */
async function cartCheckout(lines: CartLine[], attributes: { key: string; value: string }[]) {
  let url: string;
  try {
    const d = await gql<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
      `mutation Cart($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`,
      { input: { lines, attributes } },
    );
    if (!d.cartCreate.cart) throw new Error(d.cartCreate.userErrors[0]?.message || "cartCreate failed");
    url = d.cartCreate.cart.checkoutUrl;
  } catch (e) {
    // Cart permalink: works even if the cart mutation is blocked, but drops line properties —
    // only used when no line carries any (a custom shirt without its design id can't be printed).
    if (lines.some((l) => l.attributes?.length)) throw e;
    url = `https://${SHOPIFY.domain}/cart/${lines.map((l) => `${numericId(l.merchandiseId)}:${l.quantity}`).join(",")}`;
  }
  const a = attribution();
  const u = new URL(url);
  // Checkout runs on Shopify's domain, where our cookies don't exist. Passing the ad click ids in the URL
  // lets the Facebook & Instagram app (fbclid → _fbc), Google (gclid) and Microsoft (msclkid) pixels on
  // checkout attribute the purchase to the ad that drove it.
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "gbraid", "wbraid", "msclkid", "ttclid"] as const) if (a[k]) u.searchParams.set(k, a[k]!);
  if (!a.utm_source) {
    u.searchParams.set("utm_source", "ceoturbo.com");
    u.searchParams.set("utm_medium", "website");
  }
  return u.toString();
}

/** What it says on the order when the buyer hasn't given us a link yet. */
export const LINK_TO_FOLLOW = "Not given yet: contact buyer";

/**
 * The $5 "we program it" line. The review link rides on the line so it prints on the order, which also
 * keeps these carts off the permalink fallback (it would drop the link).
 */
async function programmingLine(reviewLink: string): Promise<CartLine> {
  const v = (await loadVariants(CARD_PROGRAMMING.productId))[0];
  if (!v) throw new Error(`No Shopify variant for ${CARD_PROGRAMMING.name}`);
  return { merchandiseId: v.id, quantity: 1, attributes: [{ key: "Review link", value: reviewLink.trim().slice(0, 250) || LINK_TO_FOLLOW }] };
}

/** Creates a Shopify cart for the chosen review card pack (plus the counter stand and programming, if added) and returns the checkout URL. */
export async function createCheckout(pack: ReviewPack, business: string, addOn?: StandOption, reviewLink?: string) {
  const found = findVariant(await loadVariants(), pack);
  if (!found) throw new Error(`No Shopify variant for ${pack.label}`);
  const lines: CartLine[] = [{ merchandiseId: found.variant.id, quantity: found.quantity }];
  let extra = 0;
  if (addOn) {
    const v = (await loadVariants(addOn.productId))[0];
    if (!v) throw new Error(`No Shopify variant for ${addOn.name}`);
    lines.push({ merchandiseId: v.id, quantity: 1 });
    extra = Number(v.price.amount);
  }
  if (reviewLink !== undefined) lines.push(await programmingLine(reviewLink));
  const url = await cartCheckout(lines, attributionAttributes({ "Business name": business.trim(), Pack: pack.label, Product: addOn?.name, Program: reviewLink !== undefined ? "Yes" : undefined }));
  return { url, variantId: numericId(found.variant.id), price: Number(found.variant.price.amount) * found.quantity + extra, available: found.variant.availableForSale };
}

/** One cart with several review card packs (e.g. a card for every table): one line per pack. */
export async function createPacksCheckout(items: { pack: ReviewPack; count: number }[], business: string) {
  const variants = await loadVariants();
  const lines = items.map(({ pack, count }) => {
    const found = findVariant(variants, pack);
    if (!found) throw new Error(`No Shopify variant for ${pack.label}`);
    return { merchandiseId: found.variant.id, quantity: found.quantity * count };
  });
  const summary = items.map(({ pack, count }) => `${count} × ${pack.label}`).join(", ");
  return cartCheckout(lines, attributionAttributes({ "Business name": business.trim(), Pack: summary }));
}

/** The variant whose options match every given option value (Style, Color, Size). */
export function findOptionVariant(variants: Variant[], options: Record<string, string>) {
  return variants.find((v) => Object.entries(options).every(([name, value]) => v.selectedOptions.some((o) => norm(o.name) === norm(name) && norm(o.value) === norm(value)))) ?? null;
}

export type ShirtLine = { options: Record<string, string>; quantity: number };

/**
 * Custom shirt checkout: one cart line per size, each tagged with the design id and print file link
 * (line item properties show on the order and in the order webhook, so every order maps to its PNG).
 */
export async function createShirtCheckout(product: ShirtProduct, lines: ShirtLine[], properties: Record<string, string>, business: string) {
  if (!product.productId) throw new Error("Shirt product id not set");
  const variants = await loadVariants(product.productId);
  const props = Object.entries(properties)
    .filter(([, v]) => v)
    .map(([key, value]) => ({ key, value: value.slice(0, 250) }));
  const cartLines = lines.map((l) => {
    const v = findOptionVariant(variants, l.options);
    if (!v) throw new Error(`No Shopify variant for ${Object.values(l.options).join(" / ")}`);
    return { merchandiseId: v.id, quantity: l.quantity, attributes: props };
  });
  const who = product.kind === "artist" ? "Artist name" : "Business name";
  return cartCheckout(cartLines, attributionAttributes({ [who]: business.trim(), "Design ID": properties["Design ID"] }));
}

/** Checkout for the counter stand or the stand + cards kit (one default variant each). */
export async function createStandCheckout(opt: StandOption, business: string, reviewLink?: string) {
  const variants = await loadVariants(opt.productId);
  const variant = variants[0];
  if (!variant) throw new Error(`No Shopify variant for ${opt.name}`);
  const lines: CartLine[] = [{ merchandiseId: variant.id, quantity: 1 }];
  if (reviewLink !== undefined) lines.push(await programmingLine(reviewLink));
  const url = await cartCheckout(lines, attributionAttributes({ "Business name": business.trim(), Product: opt.name, Program: reviewLink !== undefined ? "Yes" : undefined }));
  return { url, variantId: numericId(variant.id), price: Number(variant.price.amount), available: variant.availableForSale };
}
