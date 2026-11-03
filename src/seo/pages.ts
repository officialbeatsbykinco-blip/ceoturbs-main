// Registry of every indexable URL: title, description, OG image and JSON-LD.
// The prerender script, sitemap, llms.txt and client-side head updates all read from here.
import { SITE, PITCH_VIDEO, fromPriceLabel } from "@/config/site";
import { CLIENTS } from "@/content/clients";
import { SERVICES } from "@/content/services";
import { AUDIENCES, PRODUCERS, VISUAL_ARTISTS } from "@/content/audiences";
import { GUIDES, guideImage, guidePath } from "@/content/guides";
import { HOME_FAQS, AUDIT_FAQS, BOOK_FAQS, ADS_NOT_CONVERTING_FAQS } from "@/content/faqs";
import { SHOP_FAQS, SETUP_FAQS, SHOP_PATH, SETUP_PATH } from "@/content/review-cards";
import { SHIRT_FAQS, SHIRTS_PATH } from "@/content/company-shirts";
import { MERCH_FAQS, ARTIST_MERCH_PATH } from "@/content/artist-merch";
import { PRICING_FAQS, price } from "@/content/pricing";
import { RESTAURANT_FAQS, RESTAURANTS_PATH } from "@/content/restaurants";
import { NICHES } from "@/content/niches";
import * as S from "./schema";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  priority: number;
  changefreq: "weekly" | "monthly" | "yearly";
  /** Section label used to group pages in llms.txt. */
  group: "Core" | "Audiences" | "Services" | "Work" | "Guides" | "Company";
  schema: S.JsonLd[];
};

/** Trim to a word boundary so meta descriptions stay within Google's ~155-character snippet. */
const clip = (s: string, max = 155) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(" ", max - 1))}…`);

const titleCase = (s: string) => s.replace(/\b([a-z])/g, (c) => c.toUpperCase());

const suffix = (t: string) => (t.length + 13 <= 64 ? `${t} | CEO Turbo` : t);

const base = () => [S.organization(), S.website(), S.founder()];

function build(): PageMeta[] {
  const pages: PageMeta[] = [];

  pages.push({
    path: "/",
    title: `NFC Google Review Cards, from ${fromPriceLabel} | CEO Turbo`,
    description: `Tap-to-review cards for barbers, lawn care, mobile repair and stores. Customers tap and your Google review form opens. From ${fromPriceLabel}, free US shipping.`,
    ogImage: "/og/review-cards.jpg?v=2",
    priority: 1,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage("/", "CEO Turbo", SITE.description, "ItemPage"), S.reviewCardProduct(), S.faqPage(SHOP_FAQS, "/")],
  });

  pages.push({
    path: "/grow",
    title: "SEO, AEO & GEO Websites + Google, Meta & YouTube Ads | CEO Turbo",
    description:
      "SEO, AEO and GEO websites that get you found on Google and ChatGPT, plus Google, Meta and YouTube ads that book calls. Free strategy call.",
    priority: 0.9,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage("/grow", "CEO Turbo", "Websites and ads for local businesses, online stores and artists."), S.brandBoost(), S.video("/grow"), S.faqPage(HOME_FAQS, "/grow")],
  });

  for (const a of [...AUDIENCES, PRODUCERS, VISUAL_ARTISTS]) {
    const path = `/${a.slug}`;
    pages.push({
      path,
      title: suffix(a.metaTitle),
      description: a.metaDescription,
      ogImage: `/og/${a.slug === "producers" || a.slug === "visual-artists" ? "artist" : a.slug}.jpg`,
      priority: 0.9,
      changefreq: "monthly",
      group: "Audiences",
      schema: [...base(), S.webPage(path, a.h1, a.metaDescription), S.breadcrumbs([{ name: a.nav, path }]), S.faqPage(a.faqs, path)],
    });
  }

  pages.push({
    path: "/brand-boost",
    title: "Free 30-Min Growth Call With the Founder | CEO Turbo",
    description:
      "Book a free 30-minute call with the founder: we review your website, Google profile, reviews and ads live and hand you your #1 money move.",
    ogImage: "/og/brand-boost.jpg",
    priority: 0.9,
    changefreq: "monthly",
    group: "Core",
    schema: [...base(), S.webPage("/brand-boost", "Free Brand Boost call", "Book a free 30-minute growth call with CEO Turbo and leave with your #1 money move."), S.brandBoost(), S.video("/brand-boost"), S.breadcrumbs([{ name: "Brand Boost call", path: "/brand-boost" }]), S.faqPage(BOOK_FAQS, "/brand-boost")],
  });

  pages.push({
    path: "/pricing",
    title: `Pricing: Website, SEO & Ads Done for You — ${price("pkg-launch")} | CEO Turbo`,
    description: `Website, SEO/AEO/GEO, Google & Bing indexing, tracking, profiles and ad setup for ${price("pkg-launch")} one-time. Plans from ${price("care")}/mo. No contracts.`,
    ogImage: "/og/brand-boost.jpg",
    priority: 0.9,
    changefreq: "monthly",
    group: "Core",
    schema: [...base(), S.webPage("/pricing", "CEO Turbo pricing", "Published prices for every CEO Turbo service: one-time setups and monthly plans."), S.pricingCatalog(), S.breadcrumbs([{ name: "Pricing", path: "/pricing" }]), S.faqPage(PRICING_FAQS, "/pricing")],
  });

  pages.push({
    path: "/free-audit",
    title: "Free SEO, AEO & GEO Audit — Instant Report | CEO Turbo",
    description:
      "Type your business or artist name and get a free SEO, AEO & GEO report in 60 seconds: your visibility score, what's wrong and how to fix it.",
    ogImage: "/og/free-audit.jpg",
    priority: 0.9,
    changefreq: "monthly",
    group: "Core",
    schema: [...base(), S.webPage("/free-audit", "Free SEO, AEO & GEO audit", "Free visibility audit"), S.auditTool(), S.breadcrumbs([{ name: "Free audit", path: "/free-audit" }]), S.faqPage(AUDIT_FAQS, "/free-audit")],
  });

  pages.push({
    path: SHOP_PATH,
    title: `NFC Google Review Cards — Tap to Review, from ${fromPriceLabel} | CEO Turbo`,
    description: `Customers tap their phone and your Google review form opens. iPhone & Android, no app, no subscription. From ${fromPriceLabel}, free US shipping.`,
    ogImage: "/og/review-cards.jpg?v=2",
    priority: 0.9,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage(SHOP_PATH, "Google review cards", "NFC Google review cards", "ItemPage"), S.reviewCardProduct(), S.breadcrumbs([{ name: "Google review cards", path: SHOP_PATH }]), S.faqPage(SHOP_FAQS, SHOP_PATH)],
  });

  pages.push({
    path: SHIRTS_PATH,
    title: "Custom Company T-Shirts With Your Logo, No Minimum | CEO Turbo",
    description: "Design company shirts with your logo in 2 minutes. Short & long sleeve, no minimum, from $27.99 with free US shipping. 15% off 24+ for your team.",
    ogImage: "/og/company-shirts.jpg",
    priority: 0.9,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage(SHIRTS_PATH, "Custom company t-shirts", "Company t-shirts with your logo, designed online", "ItemPage"), S.shirtProduct(), S.breadcrumbs([{ name: "Custom company t-shirts", path: SHIRTS_PATH }]), S.faqPage(SHIRT_FAQS, SHIRTS_PATH)],
  });

  pages.push({
    path: ARTIST_MERCH_PATH,
    title: "Custom Artist Merch T-Shirts, No Minimum | CEO Turbo",
    description: "Make band and artist merch in 2 minutes: your cover art, name and tour dates on a tee. No minimum, from $24.99, free US shipping, 20% off 50+.",
    ogImage: "/og/artist-merch.jpg",
    priority: 0.9,
    changefreq: "weekly",
    group: "Core",
    schema: [...base(), S.webPage(ARTIST_MERCH_PATH, "Custom artist merch", "Artist and band merch t-shirts, designed online", "ItemPage"), S.artistMerchProduct(), S.breadcrumbs([{ name: "Artists", path: "/artist" }, { name: "Artist merch", path: ARTIST_MERCH_PATH }]), S.faqPage(MERCH_FAQS, ARTIST_MERCH_PATH)],
  });

  pages.push({
    path: SETUP_PATH,
    title: "Google Review Card Setup: Find Your Review Link | CEO Turbo",
    description:
      "Set up your NFC Google review card in about 2 minutes from your phone: find your review link, write it to the card and test the tap.",
    ogImage: "/og/review-cards.jpg?v=2",
    priority: 0.7,
    changefreq: "monthly",
    group: "Guides",
    schema: [...base(), S.webPage(SETUP_PATH, "Google review card setup guide", "How to program an NFC Google review card"), S.breadcrumbs([{ name: "Google review cards", path: SHOP_PATH }, { name: "Setup guide", path: SETUP_PATH }]), S.faqPage(SETUP_FAQS, SETUP_PATH)],
  });

  pages.push({
    path: "/services",
    title: "Services — Websites, Ads, SEO, AEO & GEO | CEO Turbo",
    description:
      "Every CEO Turbo service: SEO, AEO and GEO, website design, Meta, Google, TikTok and X ads, Google Business Profile, social profiles and email.",
    priority: 0.8,
    changefreq: "monthly",
    group: "Services",
    schema: [...base(), S.webPage("/services", "Services", "CEO Turbo services", "CollectionPage"), S.breadcrumbs([{ name: "Services", path: "/services" }]), S.itemList("CEO Turbo services", SERVICES.map((s) => ({ name: s.name, path: `/services/${s.slug}` })))],
  });

  for (const s of SERVICES) {
    const path = `/services/${s.slug}`;
    pages.push({
      path,
      title: suffix(s.metaTitle),
      description: s.metaDescription,
      priority: 0.8,
      changefreq: "monthly",
      group: "Services",
      schema: [...base(), S.webPage(path, s.h1, s.metaDescription), S.service(s), S.breadcrumbs([{ name: "Services", path: "/services" }, { name: s.name, path }]), S.faqPage(s.faqs, path)],
    });
  }

  pages.push({
    path: "/portfolio",
    title: "Portfolio — 19 Client Websites We Built | CEO Turbo",
    description:
      "19 live websites for artists, local service businesses, Shopify stores and personal brands — with the conversion decisions behind each one.",
    ogImage: "/og/portfolio.jpg",
    priority: 0.8,
    changefreq: "monthly",
    group: "Work",
    schema: [...base(), S.webPage("/portfolio", "Portfolio", "Client websites", "CollectionPage"), S.breadcrumbs([{ name: "Portfolio", path: "/portfolio" }]), S.itemList("CEO Turbo client websites", CLIENTS.map((c) => ({ name: c.name, path: `/portfolio/${c.slug}` })))],
  });

  for (const c of CLIENTS) {
    const path = `/portfolio/${c.slug}`;
    const where = c.location ? ` in ${c.location.split(",")[0]}` : "";
    pages.push({
      path,
      title: suffix(`${c.name} — ${titleCase(c.industry)} Website`.length > 58 ? `${c.name} Website Case Study` : `${c.name} — ${titleCase(c.industry)} Website`),
      description: clip(`${c.name}${where ? ` (${c.location})` : ""}: the ${c.industry.toLowerCase()} website CEO Turbo built, and the design decisions that turn visitors into customers.`),
      ogImage: `/img/work/${c.slug}.webp`,
      priority: 0.6,
      changefreq: "yearly",
      group: "Work",
      schema: [...base(), S.webPage(path, `${c.name} case study`, c.overview), S.caseStudy(c), S.breadcrumbs([{ name: "Portfolio", path: "/portfolio" }, { name: c.name, path }])],
    });
  }

  pages.push({
    path: "/results",
    title: "Results — Real Ad Dashboards & Search Console Data | CEO Turbo",
    description:
      "Unedited Meta Ads Manager and Google Search Console screenshots: 161 leads at $7.42 average, lowest $4.31, 165 artist profile visits at $0.32.",
    ogImage: "/og/results.jpg",
    priority: 0.8,
    changefreq: "monthly",
    group: "Work",
    schema: [...base(), S.webPage("/results", "Results", "Ad and search results"), S.breadcrumbs([{ name: "Results", path: "/results" }])],
  });

  pages.push({
    path: "/guides",
    title: "Guides — SEO, AEO, GEO, Ads & Growth | CEO Turbo",
    description: "Straight answers on SEO vs AEO vs GEO, Facebook lead costs, Google Business Profile, Spotify growth, Shopify conversions and getting more Google reviews.",
    priority: 0.7,
    changefreq: "weekly",
    group: "Guides",
    schema: [...base(), S.webPage("/guides", "Guides", "CEO Turbo guides", "CollectionPage"), S.breadcrumbs([{ name: "Guides", path: "/guides" }]), S.itemList("CEO Turbo guides", GUIDES.map((g) => ({ name: g.title, path: guidePath(g) })))],
  });

  for (const g of GUIDES) {
    const path = guidePath(g);
    pages.push({
      path,
      title: suffix(g.metaTitle),
      description: g.metaDescription,
      ogImage: guideImage(g).src,
      priority: 0.7,
      changefreq: "monthly",
      group: "Guides",
      schema: [...base(), S.webPage(path, g.title, g.metaDescription), S.article(g), S.breadcrumbs([{ name: "Guides", path: "/guides" }, { name: g.title, path }]), S.faqPage(g.faqs, path)],
    });
  }

  pages.push({
    path: "/atlanta",
    title: "Atlanta Marketing Agency — Websites, Ads & SEO | CEO Turbo",
    description:
      "Atlanta-based growth agency building websites, Meta and Google ads, Google Business Profiles and AI-search visibility for Georgia businesses and artists.",
    priority: 0.7,
    changefreq: "monthly",
    group: "Company",
    schema: [...base(), S.webPage("/atlanta", "CEO Turbo in Atlanta", "Atlanta marketing agency"), S.breadcrumbs([{ name: "Atlanta", path: "/atlanta" }])],
  });

  pages.push({
    path: "/about",
    title: "About Christopher Robinson & CEO Turbo",
    description:
      "Christopher Robinson (StackmodeChris) founded CEO Turbo to help artists, local businesses and stores win customers with websites, ads and AI search.",
    priority: 0.6,
    changefreq: "yearly",
    group: "Company",
    schema: [...base(), S.webPage("/about", "About CEO Turbo", "About Christopher Robinson and CEO Turbo", "AboutPage"), S.breadcrumbs([{ name: "About", path: "/about" }])],
  });

  pages.push({
    path: "/contact",
    title: "Contact CEO Turbo",
    description: "Book a free Brand Boost call, order Google review cards, or reach CEO Turbo in Atlanta, Georgia.",
    priority: 0.5,
    changefreq: "yearly",
    group: "Company",
    schema: [...base(), S.webPage("/contact", "Contact CEO Turbo", "Contact", "ContactPage"), S.breadcrumbs([{ name: "Contact", path: "/contact" }])],
  });

  pages.push(
    { path: "/privacy-policy", title: "Privacy Policy | CEO Turbo", description: "How CEO Turbo collects, uses and protects your personal information, including what we collect, why, and how you can control it.", priority: 0.2, changefreq: "yearly", group: "Company", schema: base() },
    { path: "/terms", title: "Terms & Conditions | CEO Turbo", description: "Terms for using ceoturbo.com and buying CEO Turbo products and services.", priority: 0.2, changefreq: "yearly", group: "Company", schema: base() },
    { path: "/shipping-returns", title: "Shipping & Returns | CEO Turbo", description: "Shipping times, costs and the 5-day return policy for CEO Turbo Google review cards.", priority: 0.3, changefreq: "yearly", group: "Company", schema: base() },
    { path: "/watch", title: "Watch: How to Get More Customers in 2026 | CEO Turbo", description: "A 1-minute video from Christopher Robinson of CEO Turbo on getting found on Google, Maps and AI assistants, and turning that attention into customers.", ogImage: "/media/brand-boost-poster.webp", priority: 0.6, changefreq: "monthly", group: "Core", schema: [...base(), S.webPage("/watch", "Watch: how to get more customers in 2026", PITCH_VIDEO.description), S.video("/watch"), S.breadcrumbs([{ name: "Watch", path: "/watch" }])] },
    {
      path: "/how-to-get-more-customers",
      title: "How to Get More Customers in 2026: Free Step-by-Step | CEO Turbo",
      description: "Free visibility score, then 8 steps to get found on Google, Bing, ChatGPT & Claude, get reviews, track every lead and run the right ads — or we do it all.",
      ogImage: "/og/how-to-get-more-customers.jpg",
      priority: 0.9,
      changefreq: "monthly",
      group: "Core",
      schema: [
        ...base(),
        S.webPage("/how-to-get-more-customers", "How to get more customers: the free step-by-step tutorial", "Free visibility score, SEO/AEO/GEO with Google and Bing indexing, Google Business Profile and socials, reviews, tracking, ads on the right platforms, email and booking."),
        S.howTo("/how-to-get-more-customers", "How to get more customers for your business in 2026", [
          ["Get your visibility score", "Run a free check of your website, Google profile, reviews, socials and AI visibility to see what's costing you customers."],
          ["Get found on Google, Bing, ChatGPT and Claude", "Build a fast website optimized for SEO, AEO and GEO; submit it to Google Search Console and Bing Webmaster Tools, ping IndexNow, add schema and llms.txt, and allow AI crawlers."],
          ["Look legit", "Optimize your Google Business Profile and social profiles with clear bios, one-tap booking and consistent details; add Merchant Center for stores."],
          ["Get reviews", "Make leaving a Google review effortless — for example with an NFC review card customers tap with their phone."],
          ["Track everything", "Set up GA4, Google Tag Manager, Meta Pixel + Conversions API, Google Ads enhanced conversions, Microsoft UET, TikTok and Reddit pixels so ad platforms learn who books."],
          ["Run ads on the right platforms", "Choose platforms by business type — Google and Microsoft Search for local services, Shopping for stores, Meta, TikTok and Spotify for artists, LinkedIn for B2B."],
          ["Bring customers back", "Email campaigns and automations, an online booking calendar, and monthly website care for security, updates and the latest search changes."],
          ["Get it done for you", "Book a free 30-minute call with CEO Turbo for your #1 money move and a fixed price to do it all."],
        ]),
        S.breadcrumbs([{ name: "How to get more customers", path: "/how-to-get-more-customers" }]),
      ],
    },
    // Ad landing + post-booking pages: kept out of search so they don't compete with /brand-boost.
    // /get-more-reviews: review-card tutorial ad page; the guide + store already own those searches.
    {
      path: "/ads-not-converting",
      title: "Ads Not Converting? Fix Tracking & Wasted Spend | CEO Turbo",
      description: `Find why your ads aren't converting. We audit and fix GA4, Tag Manager, Clarity, Meta and Google tracking: ${price("conversion-rescue")} once, then ${price("tracking-watch")}/mo.`,
      ogImage: "/og/how-to-get-more-customers.jpg",
      priority: 0.9,
      changefreq: "monthly",
      group: "Core",
      schema: [
        ...base(),
        S.webPage("/ads-not-converting", "Ads not converting? Fix the tracking, stop the wasted spend", "Conversion Rescue and Tracking Watch: audit and fix of GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft conversions."),
        S.breadcrumbs([{ name: "Ads not converting?", path: "/ads-not-converting" }]),
        S.faqPage(ADS_NOT_CONVERTING_FAQS, "/ads-not-converting"),
      ],
    },
    { path: "/get-more-reviews", title: "How to Get More Google Reviews (One Tap) | CEO Turbo", description: `Why reviews decide who gets the call on Google, Maps and ChatGPT — and the NFC card that turns “I'll review you later” into a review. From ${fromPriceLabel}.`, ogImage: "/og/get-more-reviews.jpg", noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    // Google Search ad landing for the local-service offer; noindex so it doesn't compete with / and /services/google-ads.
    { path: "/google-ads-for-local-business", title: "Get More Calls From Google Ads | CEO Turbo", description: `Get more calls from people searching Google. Search campaigns for appliance repair, HVAC, plumbing and cleaning, every call tracked. Setup ${price("pkg-start")}.`, noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    // Google Search ad landing for PC repair and custom builds around Duluth, GA; noindex like the other ad pages.
    { path: "/pc-technician-duluth-ga", title: "PC Technician Near Duluth, GA: Repair & Builds | CEO Turbo", description: `PC repair and custom PC builds at your home or office in Duluth, GA and 40 miles around. Flat price in writing first. Call ${SITE.phone.display}.`, noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    // Ad landing for on-site tech help (computers, iPhone/iPad, TVs, Wi-Fi) for homes and businesses around Duluth; noindex like the other ad pages.
    { path: "/it-services-duluth-ga", title: "Computer, iPhone, TV & Wi-Fi Repair in Duluth, GA | CEO Turbo", description: `We come to you: computer repair, iPhone screens and batteries, TV mounting and Wi-Fi fixes for homes and businesses. Call ${SITE.phone.display}.`, noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    { path: "/book", title: "Book Your Free 30-Minute Call | CEO Turbo", description: "Pick a time for a free 30-minute call with Christopher Robinson: what's costing you calls and bookings, and a fixed price to fix it.", ogImage: "/og/brand-boost.jpg", noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    { path: "/booked", title: "You're Booked | CEO Turbo", description: "Your Brand Boost call is booked. Here's how to get the most from it.", noindex: true, priority: 0.1, changefreq: "yearly", group: "Core", schema: base() },
    {
      path: RESTAURANTS_PATH,
      title: "Restaurant Marketing: DoorDash, TV Menus & Reviews | CEO Turbo",
      description: "We get restaurants on DoorDash, Uber Eats & Grubhub, design TV menus, fix Google & Apple Maps and put tap-to-review cards on every table. Free call.",
      ogImage: "/og/restaurants.jpg",
      priority: 0.9,
      changefreq: "monthly",
      group: "Audiences",
      schema: [
        ...base(),
        S.webPage(RESTAURANTS_PATH, "Restaurant marketing: delivery apps, TV menus, Maps and review cards", "Delivery app setup on DoorDash, Uber Eats and Grubhub, digital TV menus and printed menus, Google and Apple Maps listings, and NFC Google review cards for every table."),
        S.breadcrumbs([{ name: "Restaurants", path: RESTAURANTS_PATH }]),
        S.faqPage(RESTAURANT_FAQS, RESTAURANTS_PATH),
      ],
    },
    {
      path: NICHES.salons.path,
      title: "Salon Marketing: Google Reviews & Bookings | CEO Turbo",
      description: "More bookings and 5-star Google reviews for salons. Google profile setup, booking link and tap-to-review cards at every station. Free call.",
      priority: 0.9,
      changefreq: "monthly",
      group: "Audiences",
      schema: [
        ...base(),
        S.webPage(NICHES.salons.path, "Salon marketing: Google reviews and bookings", "Google Business Profile setup, booking links and NFC review cards for salon stations and the front desk."),
        S.breadcrumbs([{ name: "Salons", path: NICHES.salons.path }]),
        S.faqPage(NICHES.salons.faqs, NICHES.salons.path),
      ],
    },
    {
      path: NICHES.barbershops.path,
      title: "Barbershop Marketing: Walk-ins & Google Reviews | CEO Turbo",
      description: "More walk-ins and 5-star Google reviews for barbershops. Google profile setup, barber-by-barber review cards and a free call.",
      priority: 0.9,
      changefreq: "monthly",
      group: "Audiences",
      schema: [
        ...base(),
        S.webPage(NICHES.barbershops.path, "Barbershop marketing: walk-ins and Google reviews", "Google Business Profile setup and NFC review cards for chairs, the waiting area and checkout."),
        S.breadcrumbs([{ name: "Barbershops", path: NICHES.barbershops.path }]),
        S.faqPage(NICHES.barbershops.faqs, NICHES.barbershops.path),
      ],
    },
    { path: "/app-marketing", title: "Software & App Marketing for Developers — CEO Turbo", description: "You built the code. We engineer the distribution. High-converting landing pages, Reddit & Meta ads, telemetry and ASO for software developers.", noindex: true, priority: 0.1, changefreq: "monthly", group: "Core", schema: [...base(), S.webPage("/app-marketing", "Software & app marketing for developers", "Landing pages, ASO, Reddit ads, telemetry and launch strategy for software developers.")] },
    { path: "/promptshop", title: "Prompt Shop — Coming Soon | CEO Turbo", description: "AI prompts, scanners and templates from CEO Turbo — coming soon.", noindex: true, priority: 0.1, changefreq: "yearly", group: "Company", schema: base() },
  );

  return pages;
}

export const PAGES = build();
export const pageFor = (path: string) => PAGES.find((p) => p.path === path);
export const NOT_FOUND_META: PageMeta = {
  path: "/404",
  title: "Page not found | CEO Turbo",
  description: "That page doesn't exist. Find what you need from the CEO Turbo homepage.",
  noindex: true,
  priority: 0,
  changefreq: "yearly",
  group: "Company",
  schema: [],
};
