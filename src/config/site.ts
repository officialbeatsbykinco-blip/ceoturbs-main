// Single source of truth for links, prices and business facts.
// Change a value here and every page, CTA, schema block and sitemap picks it up.

export const SITE = {
  name: "CEO Turbo",
  url: "https://www.ceoturbo.com",
  tagline: "Tap-to-review Google cards for people who work on the move.",
  description:
    "CEO Turbo sells NFC Google review cards for barbers, lawn care crews, mobile repair techs and stores: customers tap their phone and your review form opens. We also build websites and run ads.",
  founder: {
    name: "Christopher Robinson",
    alternateName: "StackmodeChris",
    jobTitle: "Founder & CEO",
    image: "/img/brand/christopher-robinson.webp",
    /** Christopher's personal profiles (Person schema). */
    sameAs: [
      "https://www.youtube.com/@ChristopherRobinson-CEO",
      "https://x.com/ChristopherRCEO",
      "https://www.instagram.com/christopherrobinsonceo/",
      "https://www.tiktok.com/@stackmodechris___",
      "https://www.linkedin.com/in/stackmodechris/",
      "https://stackmode.net",
    ],
  },
  /** Call or text the company. `href` is what every tel: link uses. */
  phone: {
    display: "(678) 558-4327",
    e164: "+16785584327",
    href: "tel:+16785584327",
  },
  email: "ceoturbo@proton.me",
  /** Site-ownership codes. Paste the content value from each service's "meta tag" option; empty = no tag. */
  verification: {
    /** Meta Business Settings → Brand Safety → Domains → Meta-tag method (facebook-domain-verification). */
    meta: "",
    /** Microsoft Merchant Center / Bing Webmaster (msvalidate.01). */
    microsoft: "",
    /** Google Search Console / Merchant Center HTML-tag method. */
    google: "",
  },
  address: {
    streetAddress: "8735 Dunwoody Place #12143",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    postalCode: "30350",
    addressCountry: "US",
  },
  logo: "/img/brand/ceo-turbo-logo.png",
  ogImage: "/og/ceoturbo.jpg",
  /** CEO Turbo's own profiles (Organization schema + the social icons). */
  social: [
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/ceoturbo_/" },
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595439263484" },
    { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@CEOTurbo7" },
    { network: "x", label: "X", href: "https://x.com/CEO_Turbo" },
    { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/showcase/ceoturbo" },
    { network: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/ceoturbo/" },
  ],
  sameAs: [
    "https://www.instagram.com/ceoturbo_/",
    "https://www.facebook.com/profile.php?id=61595439263484",
    "https://www.youtube.com/@CEOTurbo7",
    "https://x.com/CEO_Turbo",
    "https://www.linkedin.com/showcase/ceoturbo",
    "https://www.pinterest.com/ceoturbo/",
  ],
} as const;

/** Brand Boost = the agency growth call. Cal.com handles scheduling. */
export const BOOKING = {
  calLink: "stackmodechris/ceoturbo-brandboost",
  url: "https://cal.com/stackmodechris/ceoturbo-brandboost",
  namespace: "ceoturbo-brandboost",
  name: "Brand Boost call",
  length: "30 min",
} as const;

/** Install/build jobs (office, home office, school, DJ studio, PC build) book on their own Cal.com event. */
export const INSTALL_BOOKING = {
  calLink: "stackmodechris/ceo-turbo-office-studio-setup",
  url: "https://cal.com/stackmodechris/ceo-turbo-office-studio-setup",
  namespace: "ceo-turbo-office-studio-setup",
} as const;

/** On-site tech help (/it-services-duluth-ga): computer, phone, TV and Wi-Fi visits book on their own Cal.com event. */
export const IT_BOOKING = {
  calLink: "stackmodechris/i.t-consultation",
  url: "https://cal.com/stackmodechris/i.t-consultation",
  // No dot: the namespace ends up in element ids and selectors.
  namespace: "it-consultation",
} as const;

/** Any Cal.com event the install-style calendar (embed, modal, button) can show. */
export type CalEvent = { calLink: string; url: string; namespace: string };

/** Founder video used on the homepage, Brand Boost and ad landing pages. */
export const PITCH_VIDEO = {
  src: "/media/brand-boost.mp4",
  poster: "/media/brand-boost-poster.webp",
  title: "How to get more customers for your business in 2026",
  description: "Christopher Robinson of CEO Turbo explains how businesses get found on Google, Maps and AI assistants — and turn that attention into customers.",
  duration: "PT1M22S",
  seconds: 82,
  width: 540,
  height: 960,
} as const;

/**
 * The Google review card (NFC, NTAG215) — shipped from Atlanta, blank or programmed by us for a fee.
 * Checkout runs on Shopify: the site's own buy box creates a Shopify cart through the
 * Storefront API and sends the buyer to Shopify checkout (src/lib/shopify.ts).
 * Variant ids are looked up by option value, so the Shopify product needs one option
 * "Pack" with values "1 card" / "2 cards" / "5 cards" — see docs/shopify-listing.md.
 */
export const SHOPIFY = {
  domain: "uweee2-sc.myshopify.com",
  /** Public Storefront API token (safe in the browser; it can only read products and create carts). */
  storefrontToken: "3f8f3d3f7a28ffdf9423ef07ce7e1c8e",
  productId: "15410641502443",
  apiVersion: "2025-07",
} as const;

export type ReviewPack = { id: "1" | "2" | "5" | "10"; qty: number; price: number; label: string; note: string; shopifyOption: string; popular?: boolean };

const REVIEW_PACKS: ReviewPack[] = [
  { id: "1", qty: 1, price: 16.99, label: "1 card", note: "One for your pocket", shopifyOption: "1 card" },
  { id: "2", qty: 2, price: 29.99, label: "2 cards", note: "Pocket + truck, or counter + door", shopifyOption: "2 cards", popular: true },
  { id: "5", qty: 5, price: 59.99, label: "5 cards", note: "Your crew, or every chair and table", shopifyOption: "5 cards" },
  { id: "10", qty: 10, price: 99.99, label: "10 cards", note: "Bigger crews and busy shops", shopifyOption: "10 cards" },
];

/** Optional: we write and test the buyer's review link before shipping. One fee per order, sold as its own Shopify line. */
export const CARD_PROGRAMMING = { name: "Card programming", productId: "15477988065515", price: 5, sku: "CT-PROGRAM" } as const;

export const REVIEW_CARD = {
  name: "Google Review Tap Card",
  fullName: "NFC Google Review Card",
  sku: "CT-NFC-REVIEW",
  currency: "USD",
  /** One double-sided card: white matte "Review Us On Google" front, black NFC back. */
  finish: "White front · black back",
  image: "/img/review-cards/feed-white.jpg",
  packs: REVIEW_PACKS,
  specs: {
    chip: "NTAG215 NFC chip",
    memory: "504 bytes user memory",
    material: "Waterproof PVC, matte finish",
    size: "85.5 × 54 mm (credit-card size), 0.76 mm thick",
  },
  shipping: {
    free: true,
    label: "Free US shipping",
    processing: "Ships in 1–2 business days from Atlanta, GA",
    delivery: "Arrives 2–5 business days after it ships (USPS)",
    /** Total business days from order to doorstep, used for the "get it by" estimate. */
    minDays: 3,
    maxDays: 7,
  },
  guarantee: "Not right for you, or the card won't program or tap? Return it new and unused within 5 days of delivery for a refund. No restocking fee.",
  returnDays: 5,
} as const;

/** The acrylic counter stand: NFC tap + QR code in one L-shaped display. Request-only until a Shopify product exists. */
export const REVIEW_STAND = {
  name: "Google Review Counter Stand",
  image: "/img/review-cards/hd/stand-cutout.webp",
  w: 1240,
  h: 1529,
  tagline: "Tap your phone or scan the QR code. Both go straight to your review form.",
  /** null until priced; the page shows "Get a quote" and takes a request instead of checkout. */
  price: null as number | null,
} as const;

/** Shopify products for the counter stand and the stand + cards kit (single-variant, bought through the headless checkout). */
export const STAND_OPTIONS = [
  { id: "stand", name: "Counter stand", productId: "15451547730155", price: 29.99, sku: "CT-STAND-1", blurb: "NFC tap + QR code on your counter" },
  { id: "kit", name: "Stand + 2 tap cards", productId: "15451547893995", price: 54.99, sku: "CT-KIT-STAND-2", blurb: "Counter stand plus 2 cards for a truck, station or second spot", best: true },
] as const;
export type StandOption = (typeof STAND_OPTIONS)[number];

export const fromPrice = Math.min(...REVIEW_CARD.packs.map((p) => p.price));
export const fromPriceLabel = `$${fromPrice.toFixed(2)}`;
export const money2 = (n: number) => `$${n.toFixed(2)}`;
export const packSavings = (p: ReviewPack) => Math.max(0, +(p.qty * REVIEW_CARD.packs[0].price - p.price).toFixed(2));
/** Merchant feed / ad link that opens the product page with this variant preselected. */
export const packPath = (pack: ReviewPack["id"]) => `/google-review-cards?pack=${pack}`;
/** SKU shared by Shopify, the Merchant feed, JSON-LD and ad events (CT-NFC-REVIEW-2 …). */
export const packSku = (p: ReviewPack) => `${REVIEW_CARD.sku}-${p.qty}`;

/** Google review link setup: the free app buyers use to write their link to the card. */
export const NFC_APP = {
  name: "NFC Tools",
  ios: "https://apps.apple.com/us/app/nfc-tools/id1252962749",
  android: "https://play.google.com/store/apps/details?id=com.wakdev.wdnfc",
} as const;

/**
 * Custom T-shirts: company logo shirts (`SHIRT`) and artist merch (`ARTIST_SHIRT`). Both are printed to
 * order by a print-on-demand partner and shipped straight to the buyer (docs/company-shirts.md,
 * docs/artist-merch.md). Checkout is the same headless Shopify flow as the review cards. Shopify allows 3
 * options, so each product has Style (sleeves + print sides, see `shirtStyleOption`), Color and Size;
 * every variant price matches `shirtUnitPrice` below.
 * Volume pricing (`tiers`) is a Shopify automatic discount per product, applied at checkout.
 */
export type ShirtStyle = "short" | "long";
export type ShirtColor = { id: string; name: string; hex: string; dark: boolean };
export type ShirtSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";
export type ShirtTier = { min: number; off: number; label: string; note: string };
export type ShirtProduct = {
  kind: "company" | "artist";
  name: string;
  sku: string;
  currency: string;
  productId: string;
  /** Prefix of the design ids saved with every order (CT-… company, AM-… artist). */
  designPrefix: "CT" | "AM";
  styles: readonly { id: ShirtStyle; label: string; shopifyOption: string; price: number; blank: string }[];
  colors: ShirtColor[];
  sizes: ShirtSize[];
  plusSizeUpcharge: number;
  plusSizes: ShirtSize[];
  backPrintPrice: number;
  tiers: ShirtTier[];
  shipping: { label: string; production: string; delivery: string; minDays: number; maxDays: number };
  returnDays: number;
  guarantee: string;
};

const SIZES: ShirtSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];
/** Printed to order by the print partner, then shipped to the buyer (USPS / UPS). */
const POD_SHIPPING = {
  label: "Free US shipping",
  production: "Printed to order in 2–4 business days",
  delivery: "Arrives 3–6 business days after it ships",
  minDays: 5,
  maxDays: 10,
};
const GUARANTEE = "Misprint, wrong size from us or damaged in shipping? Tell us within 30 days of delivery with a photo and we reprint it free.";

export const SHIRT: ShirtProduct = {
  kind: "company",
  name: "Custom Company T-Shirt",
  sku: "CT-TEE",
  currency: "USD",
  /** Shopify product "Custom Company T-Shirts With Your Logo" (handle custom-company-t-shirts). */
  productId: "15418511327467",
  designPrefix: "CT",
  styles: [
    { id: "short", label: "Short sleeve", shopifyOption: "Short sleeve", price: 27.99, blank: "Gildan 64000 Softstyle (or equal) — 100% ring-spun cotton" },
    { id: "long", label: "Long sleeve", shopifyOption: "Long sleeve", price: 34.99, blank: "Gildan 64400 Softstyle long sleeve (or equal) — 100% ring-spun cotton" },
  ],
  colors: [
    { id: "black", name: "Black", hex: "#141518", dark: true },
    { id: "white", name: "White", hex: "#f7f7f5", dark: false },
    { id: "navy", name: "Navy", hex: "#1f2a44", dark: true },
    { id: "heather", name: "Sport Grey", hex: "#a9acb1", dark: false },
  ],
  sizes: SIZES,
  /** Bigger blanks cost more to print. */
  plusSizeUpcharge: 3,
  plusSizes: ["2XL", "3XL"],
  /** A second print on the back (website, phone, "STAFF"…). */
  backPrintPrice: 8,
  /** Shown on the page and set as a Shopify automatic discount (docs/company-shirts.md). */
  tiers: [
    { min: 1, off: 0, label: "1–11 shirts", note: "No minimum — order 1" },
    { min: 12, off: 0.1, label: "12–23 shirts", note: "Save 10% — a small team" },
    { min: 24, off: 0.15, label: "24+ shirts", note: "Save 15% — the whole crew" },
  ],
  shipping: POD_SHIPPING,
  returnDays: 30,
  guarantee: GUARANTEE,
};

/** Artist merch: the artist designs it (cover art, logo, tour back) and orders stock for shows and fans. */
export const ARTIST_SHIRT: ShirtProduct = {
  kind: "artist",
  name: "Custom Artist Merch T-Shirt",
  sku: "CT-MERCH",
  currency: "USD",
  /** Shopify product "Custom Artist Merch T-Shirts" (handle custom-artist-merch-t-shirts). */
  productId: "15419989033195",
  designPrefix: "AM",
  styles: [
    { id: "short", label: "Short sleeve", shopifyOption: "Short sleeve", price: 24.99, blank: "Gildan 5000 Heavy Cotton (or equal) — 5.3 oz classic merch-table tee" },
    { id: "long", label: "Long sleeve", shopifyOption: "Long sleeve", price: 31.99, blank: "Gildan 5400 Heavy Cotton long sleeve (or equal)" },
  ],
  colors: [
    { id: "black", name: "Black", hex: "#141518", dark: true },
    { id: "white", name: "White", hex: "#f7f7f5", dark: false },
    { id: "navy", name: "Navy", hex: "#1f2a44", dark: true },
    { id: "heather", name: "Sport Grey", hex: "#a9acb1", dark: false },
    { id: "maroon", name: "Maroon", hex: "#5b1f2a", dark: true },
    { id: "forest", name: "Forest Green", hex: "#25392c", dark: true },
  ],
  sizes: SIZES,
  plusSizeUpcharge: 3,
  plusSizes: ["2XL", "3XL"],
  /** Tour dates, a back logo or a second piece of art. */
  backPrintPrice: 7,
  /** Merch-table stock: the more you order, the more you keep per shirt sold. */
  tiers: [
    { min: 1, off: 0, label: "1–11 shirts", note: "No minimum — order 1" },
    { min: 12, off: 0.1, label: "12–23", note: "Save 10%" },
    { min: 24, off: 0.15, label: "24–49", note: "Save 15%" },
    { min: 50, off: 0.2, label: "50+", note: "Save 20% — tour stock" },
  ],
  shipping: POD_SHIPPING,
  returnDays: 30,
  guarantee: GUARANTEE,
};

/** Price of one shirt before any volume discount. */
export function shirtUnitPrice(style: ShirtStyle, size: ShirtSize, back: boolean, p: ShirtProduct = SHIRT) {
  const s = p.styles.find((x) => x.id === style)!;
  const plus = p.plusSizes.includes(size) ? p.plusSizeUpcharge : 0;
  return +(s.price + plus + (back ? p.backPrintPrice : 0)).toFixed(2);
}

/** The volume-pricing tier for a total shirt count. */
export const shirtTier = (qty: number, p: ShirtProduct = SHIRT) => [...p.tiers].reverse().find((t) => qty >= t.min) ?? p.tiers[0];

/** Order total: sum of unit prices, less the tier discount (what Shopify charges at checkout). */
export function shirtTotal(style: ShirtStyle, back: boolean, sizes: Partial<Record<ShirtSize, number>>, p: ShirtProduct = SHIRT) {
  const qty = Object.values(sizes).reduce((n, q) => n + (q || 0), 0);
  const subtotal = +Object.entries(sizes).reduce((n, [size, q]) => n + shirtUnitPrice(style, size as ShirtSize, back, p) * (q || 0), 0).toFixed(2);
  const tier = shirtTier(qty, p);
  const discount = +(subtotal * tier.off).toFixed(2);
  return { qty, subtotal, discount, total: +(subtotal - discount).toFixed(2), tier };
}

/** The Shopify "Style" option value: sleeves and print sides, e.g. "Short sleeve – Front + back". */
export const shirtStyleOption = (style: ShirtStyle, back: boolean, p: ShirtProduct = SHIRT) => `${p.styles.find((s) => s.id === style)!.shopifyOption} – ${back ? "Front + back" : "Front"}`;

/** SKU per style/print, shared by Shopify, JSON-LD and ad events (CT-TEE-SS, CT-MERCH-LS-FB …). */
export const shirtSku = (style: ShirtStyle, back: boolean, p: ShirtProduct = SHIRT) => `${p.sku}-${style === "short" ? "SS" : "LS"}${back ? "-FB" : ""}`;
export const shirtFromPrice = Math.min(...SHIRT.styles.map((s) => s.price));
export const artistFromPrice = Math.min(...ARTIST_SHIRT.styles.map((s) => s.price));
