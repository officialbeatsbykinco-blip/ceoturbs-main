// JSON-LD builders. Every node references the shared Organization/Person/WebSite
// by @id so search engines and AI systems see one consistent entity graph.
import { SITE, BOOKING, REVIEW_CARD, PITCH_VIDEO, SHIRT, ARTIST_SHIRT, packPath, packSku, shirtSku, type ShirtProduct } from "@/config/site";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";
import { SHOP_PATH } from "@/content/review-cards";
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import { CALL_FIRST_SLUGS, type FAQ, type Service } from "@/content/services";
import type { Client } from "@/content/clients";
import type { Guide } from "@/content/guides";
import { guideImage, guidePath } from "@/content/guides";
import { MONTHLY, PACKAGES, SETUP, WEBSITES, pricesFor, type PriceItem } from "@/content/pricing";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE.url}${path}`);

export const ORG_ID = `${SITE.url}/#organization`;
export const PERSON_ID = `${SITE.url}/#founder`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const PRODUCT_ID = `${SITE.url}${SHOP_PATH}#product`;
export const AUDIT_ID = `${SITE.url}/free-audit#tool`;

export type JsonLd = Record<string, unknown>;

export const organization = (): JsonLd => ({
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: ["CEOTurbo", "ceoturbo.com"],
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs(SITE.logo) },
  image: abs(SITE.ogImage),
  description: SITE.description,
  slogan: SITE.tagline,
  founder: { "@id": PERSON_ID },
  address: { "@type": "PostalAddress", ...SITE.address },
  telephone: SITE.phone.e164,
  email: SITE.email,
  contactPoint: [
    { "@type": "ContactPoint", telephone: SITE.phone.e164, email: SITE.email, contactType: "sales", areaServed: "Worldwide", availableLanguage: ["English"] },
    { "@type": "ContactPoint", telephone: SITE.phone.e164, email: SITE.email, contactType: "customer service", areaServed: "Worldwide", availableLanguage: ["English"] },
  ],
  areaServed: "Worldwide",
  sameAs: SITE.sameAs,
  knowsAbout: [
    "Search engine optimization",
    "Answer engine optimization",
    "Generative engine optimization",
    "Website design",
    "Meta ads",
    "Google Ads",
    "TikTok ads",
    "Google Business Profile optimization",
    "Email marketing",
    "Google review generation",
    "NFC review cards",
    "Music artist marketing",
    "Shopify marketing",
  ],
  potentialAction: {
    "@type": "ReserveAction",
    name: `Book a ${BOOKING.name}`,
    target: { "@type": "EntryPoint", urlTemplate: BOOKING.url, actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
  },
});

export const founder = (): JsonLd => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.founder.name,
  alternateName: SITE.founder.alternateName,
  jobTitle: SITE.founder.jobTitle,
  image: abs(SITE.founder.image),
  url: abs("/about"),
  worksFor: { "@id": ORG_ID },
  sameAs: SITE.founder.sameAs,
  knowsAbout: ["Website design", "SEO", "AI search optimization", "Paid social advertising", "Brand growth"],
});

export const website = (): JsonLd => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
});

export const webPage = (path: string, name: string, description: string, type = "WebPage"): JsonLd => ({
  "@type": type,
  "@id": `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
  inLanguage: "en-US",
});

/** Step-by-step how-to (the /how-to-get-more-customers tutorial). Steps are [name, text]. */
export const howTo = (path: string, name: string, steps: [string, string][]): JsonLd => ({
  "@type": "HowTo",
  "@id": `${abs(path)}#howto`,
  name,
  url: abs(path),
  step: steps.map(([n, text], i) => ({ "@type": "HowToStep", position: i + 1, name: n, text })),
});

export const breadcrumbs = (items: { name: string; path: string }[]): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const faqPage = (faqs: FAQ[], path: string): JsonLd => ({
  "@type": "FAQPage",
  "@id": `${abs(path)}#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const service = (s: Service): JsonLd => ({
  "@type": "Service",
  "@id": `${abs(`/services/${s.slug}`)}#service`,
  name: s.name,
  serviceType: s.name,
  description: s.answer,
  provider: { "@id": ORG_ID },
  areaServed: CALL_FIRST_SLUGS.includes(s.slug) ? ALL_SETUP_CITIES.map((name) => ({ "@type": "City", name, containedInPlace: { "@type": "State", name: "Georgia" } })) : "Worldwide",
  url: abs(`/services/${s.slug}`),
  ...(pricesFor(s.slug).length ? { offers: pricesFor(s.slug).map(priceOffer) } : {}),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${s.name} — what's included`,
    itemListElement: s.includes.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: item },
    })),
  },
});

/** A published service price as a schema.org Offer: one-time fee, or a monthly UnitPriceSpecification. */
export const priceOffer = (p: PriceItem) => ({
  "@type": "Offer",
  name: p.name,
  description: p.summary,
  url: abs("/pricing"),
  priceCurrency: "USD",
  price: p.price.toFixed(2),
  seller: { "@id": ORG_ID },
  availability: "https://schema.org/InStock",
  priceSpecification:
    p.billing === "month"
      ? { "@type": "UnitPriceSpecification", price: p.price.toFixed(2), priceCurrency: "USD", unitText: "month", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } }
      : { "@type": "PriceSpecification", price: p.price.toFixed(2), priceCurrency: "USD", ...(p.from ? { minPrice: p.price.toFixed(2) } : {}) },
  ...(p.service ? { itemOffered: { "@type": "Service", name: p.name, url: abs(`/services/${p.service}`) } } : {}),
});

/** The full price list for /pricing. */
export const pricingCatalog = (): JsonLd => ({
  "@type": "OfferCatalog",
  "@id": `${abs("/pricing")}#catalog`,
  name: "CEO Turbo pricing",
  url: abs("/pricing"),
  provider: { "@id": ORG_ID },
  itemListElement: [
    { "@type": "OfferCatalog", name: "Setup packages", itemListElement: PACKAGES.map(priceOffer) },
    { "@type": "OfferCatalog", name: "One-time setup", itemListElement: SETUP.map(priceOffer) },
    { "@type": "OfferCatalog", name: "Websites", itemListElement: WEBSITES.map(priceOffer) },
    { "@type": "OfferCatalog", name: "Monthly plans", itemListElement: MONTHLY.map(priceOffer) },
  ],
});

const CARD_DESCRIPTION =
  "NFC Google review card for any business with a Google Business Profile. Customers tap their phone on the card and your Google review form opens — no app, no searching. Works with iPhone XS and newer and NFC Android phones. NTAG215 chip, waterproof PVC, credit-card size (85.5 × 54 mm). White “Review Us On Google” front, black NFC back. Program it once in about two minutes from your phone, or order it programmed and ready to tap.";

const cardOffer = (p: (typeof REVIEW_CARD.packs)[number]) => ({
  "@type": "Offer",
  url: abs(packPath(p.id)),
  price: p.price.toFixed(2),
  priceCurrency: REVIEW_CARD.currency,
  availability: "https://schema.org/InStock",
  itemCondition: "https://schema.org/NewCondition",
  seller: { "@id": ORG_ID },
  shippingDetails: {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: REVIEW_CARD.currency },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
    },
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: REVIEW_CARD.returnDays,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    restockingFee: 0,
    refundType: "https://schema.org/FullRefund",
  },
});

/** One product group, one variant per pack — mirrors the Shopify variants and the Merchant feed. */
export const reviewCardProduct = (): JsonLd => ({
  "@type": "ProductGroup",
  "@id": PRODUCT_ID,
  name: REVIEW_CARD.fullName,
  productGroupID: REVIEW_CARD.sku,
  description: CARD_DESCRIPTION,
  image: ["hd/card-hero.jpg", "shop-both.jpg", "hd/card-tap.jpg", "hd/card-counter.jpg", "shop-5.jpg"].map((f) => abs(`/img/review-cards/${f}`)),
  brand: { "@type": "Brand", name: SITE.name },
  category: "Business & Industrial > Retail > Retail Display Props & Models",
  material: "PVC",
  url: abs(SHOP_PATH),
  color: "White/Black",
  variesBy: ["https://schema.org/size"],
  hasVariant: REVIEW_CARD.packs.map((p) => ({
    "@type": "Product",
    sku: packSku(p),
    mpn: packSku(p),
    name: `${REVIEW_CARD.fullName} – ${p.label}`,
    description: CARD_DESCRIPTION,
    image: abs(REVIEW_CARD.image),
    size: p.label,
    brand: { "@type": "Brand", name: SITE.name },
    offers: cardOffer(p),
  })),
});

const SHIRT_DESCRIPTION =
  "Custom company t-shirts with your logo, designed online with a live preview. Short and long sleeve, 100% ring-spun cotton, Black, White, Navy or Sport Grey, unisex S–3XL. Full-color print up to 12 × 16 in on the front (or a 4 × 4 in left-chest logo) plus an optional back print. No minimum order, 10% off 12+ and 15% off 24+, free US shipping.";

const ARTIST_DESCRIPTION =
  "Custom artist merch t-shirts designed online with a live preview: upload your cover art or logo, pick a font, add tour dates on the back. Short and long sleeve heavy cotton tees in 6 colors, unisex S–3XL. Full-color print up to 12 × 16 in, no minimum order, up to 20% off 50+, free US shipping.";

type ShirtSchema = { product: ShirtProduct; path: string; description: string; images: string[]; front: string; long: string };

/** Custom shirt product group: one variant per sleeve style × print (prices from the config, sizes S–3XL). */
const shirtGroup = ({ product: P, path, description, images, front, long }: ShirtSchema): JsonLd => ({
  "@type": "ProductGroup",
  "@id": `${abs(path)}#product`,
  name: P.name,
  productGroupID: P.sku,
  description,
  image: images.map(abs),
  brand: { "@type": "Brand", name: SITE.name },
  category: "Apparel & Accessories > Clothing > Shirts & Tops",
  material: "Cotton",
  url: abs(path),
  variesBy: ["https://schema.org/color", "https://schema.org/size", "https://schema.org/pattern"],
  hasVariant: P.styles.flatMap((s) =>
    [false, true].map((back) => ({
      "@type": "Product",
      sku: shirtSku(s.id, back, P),
      name: `${P.name} – ${s.label}${back ? " – Front + back print" : ""}`,
      description,
      image: abs(s.id === "long" ? long : front),
      color: P.colors.map((c) => c.name).join(", "),
      size: P.sizes.join(", "),
      offers: {
        "@type": "Offer",
        url: abs(`${path}?style=${s.id}`),
        price: (s.price + (back ? P.backPrintPrice : 0)).toFixed(2),
        priceCurrency: P.currency,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": ORG_ID },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: 0, currency: P.currency },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 6, unitCode: "DAY" },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "US",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: P.returnDays,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
          refundType: "https://schema.org/FullRefund",
        },
      },
    })),
  ),
});

export const shirtProduct = (): JsonLd =>
  shirtGroup({
    product: SHIRT,
    path: SHIRTS_PATH,
    description: SHIRT_DESCRIPTION,
    images: ["shirt-black-front.jpg", "shirt-long-navy.jpg", "shirt-back.jpg", "shirt-colors.jpg"].map((f) => `/img/shirts/${f}`),
    front: "/img/shirts/shirt-black-front.jpg",
    long: "/img/shirts/shirt-long-navy.jpg",
  });

export const artistMerchProduct = (): JsonLd =>
  shirtGroup({
    product: ARTIST_SHIRT,
    path: ARTIST_MERCH_PATH,
    description: ARTIST_DESCRIPTION,
    images: ["merch-black-front.jpg", "merch-tour-back.jpg", "merch-long-maroon.jpg", "merch-colors.jpg"].map((f) => `/img/merch/${f}`),
    front: "/img/merch/merch-black-front.jpg",
    long: "/img/merch/merch-long-maroon.jpg",
  });

export const auditTool = (): JsonLd => ({
  "@type": "WebApplication",
  "@id": AUDIT_ID,
  name: "CEO Turbo Free SEO, AEO & GEO Audit",
  url: abs("/free-audit"),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  description: "Free online audit that scores a business or artist's visibility on Google (SEO), in AI answers (AEO) and in generative AI recommendations (GEO), with a prioritized fix list.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@id": ORG_ID },
});

export const caseStudy = (c: Client): JsonLd => ({
  "@type": "CreativeWork",
  "@id": `${abs(`/portfolio/${c.slug}`)}#work`,
  name: `${c.name} website`,
  headline: `${c.name}: ${c.industry} website by CEO Turbo`,
  description: c.overview,
  image: abs(`/img/work/${c.slug}.webp`),
  creator: { "@id": ORG_ID },
  url: abs(`/portfolio/${c.slug}`),
  about: {
    "@type": "Organization",
    name: c.name,
    url: c.url,
    ...(c.location ? { areaServed: c.location } : {}),
  },
});

export const article = (g: Guide): JsonLd => ({
  "@type": "Article",
  "@id": `${abs(guidePath(g))}#article`,
  headline: g.title,
  description: g.metaDescription,
  abstract: g.summary,
  datePublished: g.published,
  dateModified: g.updated,
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: abs(guidePath(g)),
  image: { "@type": "ImageObject", url: abs(guideImage(g).src), width: 1200, height: 630, caption: guideImage(g).alt },
  inLanguage: "en-US",
});

export const itemList = (name: string, items: { name: string; path: string }[]): JsonLd => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});

/** Marketing for software developers (/app-marketing): the packages from pricing.ts as the offers. */
export const devMarketing = (): JsonLd => ({
  "@type": "Service",
  "@id": `${SITE.url}/app-marketing#service`,
  name: "Marketing for software developers",
  serviceType: "App and software marketing",
  description: "Landing page, conversion tracking, Reddit, Meta, TikTok and Google ads, SEO and a launch plan for indie developers and small software teams. Starts with a free 30-minute growth call.",
  url: abs("/app-marketing"),
  provider: { "@id": ORG_ID },
  audience: { "@type": "Audience", audienceType: "Software developers, indie hackers and small SaaS and app teams" },
  areaServed: "Worldwide",
  offers: PACKAGES.map(priceOffer),
});

/** The Brand Boost call as a named, free service — helps "CEO Turbo Brand Boost" searches resolve to us. */
export const brandBoost = (): JsonLd => ({
  "@type": "Service",
  "@id": `${SITE.url}/brand-boost#service`,
  name: "Brand Boost",
  alternateName: ["CEO Turbo Brand Boost", "Brand Boost call"],
  serviceType: "Marketing strategy consultation",
  description: "A free 30-minute growth call: CEO Turbo reviews your website, Google Business Profile, reviews, social profiles and ads live and gives you a fixed-price plan to get more customers, reviews and listeners.",
  url: abs("/brand-boost"),
  provider: { "@id": ORG_ID },
  areaServed: "Worldwide",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs("/brand-boost") },
});

export const video = (path: string): JsonLd => ({
  "@type": "VideoObject",
  "@id": `${abs(path)}#video`,
  name: PITCH_VIDEO.title,
  description: PITCH_VIDEO.description,
  thumbnailUrl: abs(PITCH_VIDEO.poster),
  contentUrl: abs(PITCH_VIDEO.src),
  uploadDate: "2026-10-10T00:00:00Z",
  duration: PITCH_VIDEO.duration,
  publisher: { "@id": ORG_ID },
});

export const graph = (nodes: JsonLd[]) => ({ "@context": "https://schema.org", "@graph": nodes });
export { abs };
