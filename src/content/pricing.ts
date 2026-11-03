// CEO Turbo service pricing: the ONE place prices live. The /pricing page, every service page's price
// box, the FAQs, JSON-LD offers (Google + AI assistants) and llms.txt all read from here, so a price
// is never different in two places. Change a number here and rebuild.
//
// Model: one setup PACKAGE (pay once, built right), then ONE monthly plan for the work that has to keep
// happening (security, updates, SEO/AEO/GEO, tracking health, ads, email). The à-la-carte setups below are
// for people who only need one thing — and they anchor how much a package saves. Ad spend is always paid by
// the client straight to the platform.

export type PriceItem = {
  id: string;
  name: string;
  price: number;
  /** "once" = one-time setup fee, "month" = monthly plan. */
  billing: "once" | "month";
  /** "from" pricing: the starting point of a range. */
  from?: boolean;
  /** Service page this belongs to (/services/<slug>). */
  service?: string;
  summary: string;
  includes: string[];
  popular?: boolean;
  /** Packages only: the à-la-carte items it replaces, so the "you save" number can never drift. */
  replaces?: string[];
};

export const PRICING_TERMS = {
  contract: "No long-term contracts. Monthly plans are month to month — cancel with 30 days' notice.",
  payment: "Setup is paid up front. Monthly plans are billed on the same day each month.",
  adSpend: "Ad spend is paid by you, directly to Google, Microsoft, Meta, TikTok, X, Reddit or LinkedIn, from your own ad account — we never mark it up.",
  ownership: "You own your website, domain, ad accounts, pixel data, content and email list. If you leave, it all stays yours.",
  guarantee: "Leads-or-free guarantee: if the ad campaigns we launch for you don't bring in a lead in their first 30 days live, we keep managing them with no management fee until they do. Ad spend is paid to the platform, isn't refunded, and has to stay on for the guarantee to apply.",
  results: "SEO, AEO and GEO compound: most clients see movement in 30–90 days and the biggest gains after 3–6 months — and every month builds on the last.",
} as const;

export const PACKAGES: PriceItem[] = [
  {
    id: "pkg-start",
    name: "Turbo Start",
    price: 497,
    billing: "once",
    service: "google-business-profile",
    summary: "Keep the site you have. We fix everything around it so Google, Bing and AI can find you and your ads can be measured.",
    includes: [
      "SEO, AEO & GEO tune-up of your current site or link-in-bio",
      "Google + Bing indexing: Search Console, Bing Webmaster Tools, sitemap, IndexNow",
      "AI crawler access + llms.txt so ChatGPT, Claude & Perplexity can read you",
      "Google Business Profile setup & optimization",
      "Up to 3 social profiles optimized",
      "Conversion Rescue: GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel + Conversions API, conversion values set and every event tested",
      "Your own booking calendar",
      "1 ad campaign launched on your best-fit platform",
    ],
    replaces: ["visibility-foundation", "gbp-setup", "social-setup", "conversion-rescue"],
  },
  {
    id: "pkg-launch",
    name: "Turbo Launch — the whole package",
    price: 1997,
    billing: "once",
    service: "website-design",
    summary: "A new website built for Google, Bing and AI answers, every profile set up, every tag tracking, and ads switched on. Done for you.",
    includes: [
      "New conversion website, up to 7 pages (business or artist)",
      "Everything in Turbo Start",
      "Up to 5 social profiles optimized",
      "Conversion Rescue + full tracking: GA4, GTM, Clarity, Meta CAPI, Google Ads & Microsoft UET conversions, TikTok & Reddit pixels",
      "Email platform + 3 automations (welcome, review request, win-back)",
      "Google + Microsoft Merchant Center for Shopify / online stores",
      "Ad campaigns on your 2 best-fit platforms (Google, Microsoft, Meta, TikTok, X, Reddit, LinkedIn or Spotify)",
      "2 NFC Google review cards",
      "First month of Turbo Care free",
    ],
    popular: true,
    replaces: ["site-launch", "visibility-foundation", "gbp-setup", "social-setup", "conversion-rescue", "email-setup"],
  },
  {
    id: "pkg-dominate",
    name: "Turbo Dominate",
    price: 3997,
    billing: "once",
    service: "website-design",
    summary: "For businesses and brands ready to own their market: more pages, more keywords, more platforms.",
    includes: [
      "Up to 15 pages with a page for every service and city — or a full Shopify store (up to 25 products)",
      "Everything in Turbo Launch, including Conversion Rescue",
      "Ad campaigns on up to 4 platforms",
      "Google Shopping / Performance Max + Microsoft Shopping for stores",
      "Competitor research and a keyword map",
      "5 NFC Google review cards",
      "First 2 months of Turbo Care free",
    ],
    replaces: ["site-shopify", "visibility-foundation", "gbp-setup", "social-setup", "conversion-rescue", "email-setup"],
  },
];

export const SETUP: PriceItem[] = [
  {
    id: "office-basic",
    name: "Basic computer setup",
    price: 99,
    billing: "once",
    service: "home-office-setup",
    summary: "Get your computer ready to use with professional setup and configuration. Labor only.",
    includes: ["Computer unboxing and setup", "Operating system configuration and updates", "Software installation (Office, security tools)", "Printer and peripheral connection", "Data transfer from old device", "30-minute walkthrough training"],
  },
  {
    id: "office-home",
    name: "Standard home office setup",
    price: 129,
    billing: "once",
    service: "home-office-setup",
    summary: "Desk assembly plus full computer setup. Labor only.",
    includes: ["Desk assembly", "Computer and monitor setup", "Printer and peripheral installation", "Software installation", "Data transfer from old device", "Full walkthrough training"],
    popular: true,
  },
  {
    id: "office-complete",
    name: "Complete home office setup",
    price: 169,
    billing: "once",
    service: "home-office-setup",
    summary: "Desk, computer, monitor mounting, cable management and Wi-Fi configuration. Labor only.",
    includes: ["Desk and chair assembly", "Computer setup and configuration", "Monitor mounting", "Cable management and wire organization", "Wi-Fi and network configuration", "Printer and peripherals installed", "Full walkthrough training"],
  },
  {
    id: "school-basic",
    name: "School computer room — up to 5 stations",
    price: 329,
    billing: "once",
    service: "school-computer-room-setup",
    summary: "Computer room setup for up to 5 stations. Labor only.",
    includes: ["Up to 5 computer stations set up", "Furniture assembly", "Cable management", "Software installation", "Printer setup"],
  },
  {
    id: "office-school",
    name: "School computer room — up to 10 stations",
    price: 479,
    billing: "once",
    service: "school-computer-room-setup",
    summary: "Computer room setup for up to 10 stations. Labor only.",
    includes: ["Up to 10 computer stations set up", "Furniture assembly", "Network and security setup", "Educational software installation", "Teacher workstation configuration", "Staff training and documentation"],
    popular: true,
  },
  {
    id: "school-complete",
    name: "School computer room — up to 15 stations",
    price: 649,
    billing: "once",
    service: "school-computer-room-setup",
    summary: "Computer room setup for up to 15 stations with network configuration. Labor only.",
    includes: ["Up to 15 computer stations set up", "Furniture assembly", "Full network configuration and cabling", "Educational software installation", "Teacher workstation configuration", "Student access management", "Staff training and documentation"],
  },
  {
    id: "dj-basic",
    name: "DJ & studio — basic",
    price: 149,
    billing: "once",
    service: "dj-studio-setup",
    summary: "Desk and gear placement. Labor only.",
    includes: ["Desk assembly", "Gear placement", "Basic cable routing"],
  },
  {
    id: "dj-standard",
    name: "DJ & studio — standard",
    price: 199,
    billing: "once",
    service: "dj-studio-setup",
    summary: "Desk, monitors, controller, cabling and software. Labor only.",
    includes: ["Desk assembly", "Studio monitor placement", "Controller connection", "Cabling and labeling", "DJ or DAW software installation"],
    popular: true,
  },
  {
    id: "dj-complete",
    name: "DJ & studio — complete",
    price: 259,
    billing: "once",
    service: "dj-studio-setup",
    summary: "Full setup with audio interface and calibration. Labor only.",
    includes: ["Desk assembly", "Studio monitor placement", "Controller and audio interface connection", "Cabling and labeling", "Software installation", "Calibration and sound check"],
  },
  {
    id: "build-basic",
    name: "Computer build — basic",
    price: 119,
    billing: "once",
    service: "computer-build-setup",
    summary: "Assembly and cable management. Labor only; parts supplied by you.",
    includes: ["Parts check", "Full assembly", "Cable management"],
  },
  {
    id: "build-standard",
    name: "Computer build — standard",
    price: 159,
    billing: "once",
    service: "computer-build-setup",
    summary: "Assembly, cable management, operating system and drivers. Labor only.",
    includes: ["Parts check", "Full assembly", "Cable management", "Operating system installation", "Driver installation and updates"],
    popular: true,
  },
  {
    id: "build-complete",
    name: "Computer build — complete",
    price: 219,
    billing: "once",
    service: "computer-build-setup",
    summary: "Full build, testing, peripherals and data transfer. Labor only.",
    includes: ["Parts check", "Full assembly", "Cable management", "Operating system and drivers", "Stress test and temperature check", "Peripheral setup", "Data transfer from old computer"],
  },
  {
    id: "office-transform-basic",
    name: "Basic office build-out",
    price: 1599,
    billing: "once",
    service: "office-transformation",
    summary: "Installation labor for small spaces: framing, basic network install and 1-2 workstations. Materials not included.",
    includes: ["Office framing and basic build-out", "Basic network installation and Wi-Fi setup", "1-2 workstation computers built and configured", "Printer and peripheral setup", "Optional POS system installation", "30-day installation warranty"],
  },
  {
    id: "office-transform-standard",
    name: "Standard office build-out",
    price: 2299,
    billing: "once",
    service: "office-transformation",
    summary: "Installation labor for medium spaces: framing, cameras, full network and 3-5 workstations. Materials and equipment supplied by you or funded up front.",
    includes: ["Full office framing and build-out", "Security cameras with recording system", "Full network installation and cabling", "3-5 workstation computers built and configured", "POS system installation (optional)", "Wi-Fi with separate guest access", "Cable management", "Professional cleanup", "30-day installation warranty"],
    popular: true,
  },
  {
    id: "office-transform-complete",
    name: "Complete office build-out",
    price: 3199,
    billing: "once",
    service: "office-transformation",
    summary: "Installation labor for large spaces, frame to finish, 6+ workstations. Materials and equipment supplied by you or funded up front.",
    includes: ["Complete office framing and build-out", "Security cameras with NVR and mobile app", "Full network installation, cabling and server rack", "6+ workstation computers built and configured", "POS system installation (optional)", "Multi-zone Wi-Fi with guest and staff networks", "Full cable management with labeled racks", "Professional cleanup", "Software and security configuration", "Team training and documentation", "30-day installation warranty"],
  },
  {
    id: "pos-basic",
    name: "POS setup — single terminal",
    price: 149,
    billing: "once",
    service: "pos-system-setup",
    summary: "1 terminal or iPad register, card reader, receipt printer and basic cabling. Labor only.",
    includes: [
      "1 POS terminal or iPad stand assembly",
      "Card reader and tap terminal connection",
      "Receipt printer setup and driver check",
      "Cash drawer connection",
      "Network/Wi-Fi connection",
      "Live test payment walkthrough",
    ],
  },
  {
    id: "pos-standard",
    name: "POS setup — standard 2-3 stations",
    price: 249,
    billing: "once",
    service: "pos-system-setup",
    summary: "2-3 terminals, kitchen and receipt printers, cash drawers, and delivery tablets. Labor only.",
    includes: [
      "2-3 POS registers or terminals installed",
      "DoorDash & UberEats tablet integration",
      "Kitchen printer and front receipt printers",
      "Cash drawer wiring and kick testing",
      "Cable routing and organization",
      "Full staff walkthrough and testing",
    ],
    popular: true,
  },
  {
    id: "pos-complete",
    name: "POS setup — complete restaurant/retail",
    price: 399,
    billing: "once",
    service: "pos-system-setup",
    summary: "Complete multi-station setup: terminals, kitchen display, delivery tablets, network switch, and clean cabling.",
    includes: [
      "Up to 5 registers/terminals installed",
      "Kitchen Display System (KDS) mounting",
      "All delivery tablets (DoorDash, UberEats, Grubhub)",
      "Network switch and Ethernet drops to counters",
      "Isolated guest vs POS Wi-Fi setup",
      "Under-counter cable concealment",
      "Complete staff training and 30-day installation warranty",
    ],
  },
  {
    id: "gbp-setup",
    name: "Google Business Profile setup & optimization",
    price: 197,
    billing: "once",
    service: "google-business-profile",
    summary: "Your free Google listing, set up to win the map pack and turn searches into calls.",
    includes: ["Claim & verification help", "Primary + secondary categories, services and service area", "Keyword-rich description and business details", "10 optimized photos and logo/cover", "Q&A, review link and review QR code", "First 4 Google posts written for you"],
    popular: true,
  },
  {
    id: "social-setup",
    name: "Social profile setup & optimization",
    price: 147,
    billing: "once",
    service: "social-media-optimization",
    summary: "Up to 3 profiles (Instagram, Facebook, TikTok, YouTube or LinkedIn) that make people trust you and click.",
    includes: ["Bios that say what you do and who for", "Profile photo, cover and highlight covers", "Link-in-bio page with booking and review links", "Name, category and contact details consistent everywhere"],
  },
  {
    id: "visibility-foundation",
    name: "SEO, AEO & GEO foundation",
    price: 497,
    billing: "once",
    service: "seo-aeo-geo",
    summary: "The technical groundwork that lets Google and Bing rank you and ChatGPT, Claude, Gemini and Perplexity name you.",
    includes: ["Technical SEO fixes: speed, indexing, titles, headings", "Schema markup (LocalBusiness, Service, FAQ, Product)", "AI crawler access and an llms.txt file", "Listings and citations cleaned up so your name, address and phone match", "Google Search Console + Bing Webmaster Tools set up"],
  },
  {
    id: "conversion-rescue",
    name: "Conversion Rescue",
    price: 347,
    billing: "once",
    service: "conversion-tracking",
    summary: "Find out why your ads aren't converting, then fix it: every tag, pixel and conversion audited, repaired, valued and tested.",
    includes: [
      "Audit of GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel + Conversions API, Google Ads, Microsoft UET and Merchant Center",
      "Every tag, pixel and conversion event fixed and de-duplicated",
      "Conversion values set for your business (average sale × close rate × lead-to-booking rate)",
      "Calls, forms, bookings and purchases tracked and tested live",
      "Written wasted-spend fix list: junk searches, broken events, bad targeting",
      "30-minute walkthrough so you know what changed",
    ],
  },
  {
    id: "tracking-setup",
    name: "Ads & tracking setup",
    price: 197,
    billing: "once",
    service: "meta-ads",
    summary: "Ad accounts and conversion tracking set up right, so every dollar is measured and the platforms learn who buys.",
    includes: ["Meta Pixel + Conversions API", "Google Ads, GA4 and Tag Manager conversions", "Microsoft (Bing) UET, TikTok and Reddit pixels", "Lead, booking and purchase events with de-duplication", "Google Merchant Center for product stores"],
  },
  {
    id: "email-setup",
    name: "Email & SMS setup",
    price: 297,
    billing: "once",
    service: "email-marketing",
    summary: "An email/SMS system that brings customers back and asks for reviews on autopilot.",
    includes: ["Platform setup (Klaviyo, Mailchimp or similar) and domain sending", "Branded email template", "3 automated flows: welcome, review request, win-back", "Signup form on your site"],
  },
];

export const WEBSITES: PriceItem[] = [
  {
    id: "site-artist",
    name: "Artist website",
    price: 997,
    billing: "once",
    service: "website-design",
    summary: "A home for your music that grows your fanbase — not just a link in bio.",
    includes: ["Up to 5 pages: home, music, shows, about, contact", "Release / pre-save page", "Fan email & SMS signup", "Spotify, Apple Music and YouTube embeds", "SEO so you own your name on Google"],
  },
  {
    id: "site-launch",
    name: "Launch website",
    price: 1497,
    billing: "once",
    service: "website-design",
    summary: "A fast, mobile-first site for local service businesses that makes the phone ring.",
    includes: ["Up to 5 pages", "Tap-to-call, quote and booking buttons", "Reviews, job photos and service area", "On-page SEO + schema", "Lead form that sends to your phone and email"],
    popular: true,
  },
  {
    id: "site-growth",
    name: "Growth website",
    price: 2497,
    billing: "once",
    service: "website-design",
    summary: "For businesses ready to dominate their area: more pages, more keywords, more leads.",
    includes: ["Up to 12 pages", "A page for every service and city you serve", "Online booking or estimate request", "Blog / answer pages built for Google and AI answers", "Full conversion tracking"],
  },
  {
    id: "site-shopify",
    name: "Shopify store",
    price: 2997,
    billing: "once",
    service: "website-design",
    summary: "A Shopify store built to convert, with the tracking ads need to scale.",
    includes: ["Theme setup and custom design", "Up to 25 products with SEO titles and descriptions", "Checkout, shipping, tax and payments", "Reviews, upsells and email capture", "Merchant Center + Shopping feed"],
  },
];

export const MONTHLY: PriceItem[] = [
  {
    id: "care",
    name: "Turbo Care",
    price: 97,
    billing: "month",
    service: "website-design",
    summary: "Your site and tracking stay fast, secure and working, for about the price of a lunch a week.",
    includes: ["Hosting management and SSL", "Security and software updates, backups, uptime monitoring", "Tracking health checks: tags, pixels and Conversions API", "1 Google Business Profile post a month", "Monthly report"],
  },
  {
    id: "growth",
    name: "Turbo Growth",
    price: 497,
    billing: "month",
    service: "meta-ads",
    summary: "Care plus your ads managed every week. The plan most clients pick.",
    includes: ["Everything in Turbo Care", "Ads managed weekly on 1 platform", "Search terms checked and junk clicks blocked", "2 new ad creatives a month", "Monthly plain-English results call"],
    popular: true,
  },
  {
    id: "scale",
    name: "Turbo Scale",
    price: 997,
    billing: "month",
    service: "seo-aeo-geo",
    summary: "For competitive markets, multiple locations, stores and artists pushing releases on several platforms.",
    includes: ["Everything in Turbo Growth", "Ads managed on up to 3 platforms", "2 articles or landing pages a month", "Up to 3 locations", "Competitor tracking"],
  },
  {
    id: "tracking-watch",
    name: "Tracking Watch",
    price: 49,
    billing: "month",
    service: "conversion-tracking",
    summary: "The small monthly plan that keeps your tracking honest and your ad spend from leaking. Already included in Turbo Care, Growth and Scale.",
    includes: ["Monthly check of every tag, pixel and Conversions API event", "Search-term review and negative keywords on 1 ad platform", "Conversion values tuned as your numbers change", "Plain-English monthly waste report"],
  },
  {
    id: "ads-additional",
    name: "Each additional ad platform",
    price: 147,
    billing: "month",
    service: "google-ads",
    summary: "Add Google, Microsoft, Meta, TikTok, X, Reddit, LinkedIn or Spotify on top of your plan.",
    includes: ["Same weekly management", "Shared creative and reporting", "Budget moved to whatever performs best"],
  },
];

export const ALL_PRICES = [...PACKAGES, ...SETUP, ...WEBSITES, ...MONTHLY];

/**
 * On-site tech help (/it-services-duluth-ga): repairs and setups for homes and small businesses.
 * Kept out of ALL_PRICES so the agency /pricing page doesn't list them; read them with itPrice().
 */
export const IT_SERVICES: PriceItem[] = [
  { id: "it-visit", name: "Diagnosis only", price: 39, billing: "once", summary: "The house call is free when we do the repair; this is only if you decide not to.", includes: [] },
  { id: "it-pc-repair", name: "Computer & laptop repair", price: 79, from: true, billing: "once", summary: "Slow, crashing, virus or won't turn on.", includes: [] },
  { id: "it-iphone-screen", name: "iPhone screen replacement", price: 79, from: true, billing: "once", summary: "Cracked or dead screen replaced at your door.", includes: [] },
  { id: "it-iphone-battery", name: "iPhone battery replacement", price: 49, from: true, billing: "once", summary: "Phone dies by lunch? New battery.", includes: [] },
  { id: "it-tablet-screen", name: "iPad & tablet screen", price: 89, from: true, billing: "once", summary: "Cracked glass or touch that stopped working.", includes: [] },
  { id: "it-tv-mount", name: "TV wall mount", price: 69, billing: "once", summary: "Per TV up to 65\", drywall and studs. Mount not included.", includes: [] },
  { id: "it-tv-extra", name: "Each extra TV, same visit", price: 49, billing: "once", summary: "Mount a second TV on the same trip.", includes: [] },
  { id: "it-tv-setup", name: "TV & streaming setup", price: 49, billing: "once", summary: "Apps, sound bar, remotes and accounts working.", includes: [] },
  { id: "it-wifi", name: "Internet & Wi-Fi fix", price: 69, from: true, billing: "once", summary: "Dead spots, drops, slow speeds or a new router.", includes: [] },
  { id: "it-mesh", name: "Mesh Wi-Fi install", price: 99, from: true, billing: "once", summary: "Strong signal in every room. Labor; you keep the gear.", includes: [] },
  { id: "it-business-hour", name: "Business on-site IT", price: 75, billing: "once", summary: "Per hour. Networks, workstations, printers, TVs.", includes: [] },
];
/** "from $99" style label for an IT_SERVICES item. */
export const itPrice = (id: string) => {
  const item = IT_SERVICES.find((p) => p.id === id);
  if (!item) throw new Error(`Unknown IT price id ${id}`);
  return `${item.from ? "from " : ""}$${item.price}`;
};

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
export const byId = (id: string) => {
  const item = ALL_PRICES.find((p) => p.id === id);
  if (!item) throw new Error(`Unknown price id ${id}`);
  return item;
};
/** Formatted price of one item by id — used in FAQ text so copy can never drift from the price list. */
export const price = (id: string) => usd(byId(id).price);
export const priceLabel = (p: PriceItem) => `${p.from ? "from " : ""}${usd(p.price)}${p.billing === "month" ? "/mo" : " one-time"}`;
export const perDay = (monthly: number) => `about $${Math.round((monthly * 12) / 365)} a day`;
/** What a package's pieces would cost one by one. */
export const alaCarte = (p: PriceItem) => (p.replaces ?? []).reduce((n, id) => n + byId(id).price, 0);

/** What each service page shows in its price box: the à-la-carte setup, the package that covers it, the monthly plan. */
export function pricesFor(service: string): PriceItem[] {
  const map: Record<string, string[]> = {
    "home-office-setup": ["office-basic", "office-home", "office-complete"],
    "apartment-home-office-setup": ["office-basic", "office-home", "office-complete"],
    "school-computer-room-setup": ["school-basic", "office-school", "school-complete"],
    "dj-studio-setup": ["dj-basic", "dj-standard", "dj-complete"],
    "computer-build-setup": ["build-basic", "build-standard", "build-complete"],
    "office-transformation": ["office-transform-basic", "office-transform-standard", "office-transform-complete"],
    "pos-system-setup": ["pos-basic", "pos-standard", "pos-complete"],
    "seo-aeo-geo": ["visibility-foundation", "pkg-start", "pkg-launch", "care", "growth"],
    "website-design": ["site-artist", "site-launch", "site-growth", "site-shopify", "pkg-launch", "care"],
    "meta-ads": ["conversion-rescue", "pkg-launch", "growth", "ads-additional"],
    "google-ads": ["conversion-rescue", "pkg-launch", "growth", "ads-additional"],
    "tiktok-ads": ["conversion-rescue", "pkg-launch", "growth", "ads-additional"],
    "x-ads": ["conversion-rescue", "pkg-launch", "growth", "ads-additional"],
    "conversion-tracking": ["conversion-rescue", "tracking-watch", "pkg-start", "pkg-launch", "care"],
    "google-business-profile": ["gbp-setup", "pkg-start", "care"],
    "social-media-optimization": ["social-setup", "pkg-start"],
    "email-marketing": ["email-setup", "pkg-launch", "care", "growth"],
  };
  return (map[service] ?? []).map((id) => ALL_PRICES.find((p) => p.id === id)!).filter(Boolean);
}

/** Example plans: a package + a monthly plan, so budgets are easy to picture. */
export const EXAMPLE_PLANS: { name: string; who: string; items: string[] }[] = [
  { name: "Fix what I have", who: "You already have a site — you just aren't getting found or tracked", items: ["pkg-start", "care"] },
  { name: "Calls this month", who: "A local service business that wants the phone ringing", items: ["pkg-launch", "growth"] },
  { name: "Artist release push", who: "An artist growing fans and streams around releases", items: ["pkg-launch", "growth", "ads-additional"] },
  { name: "Store that scales", who: "A Shopify brand ready to grow sales", items: ["pkg-dominate", "growth", "ads-additional"] },
];

export function planTotals(ids: string[]) {
  const items = ids.map((id) => ALL_PRICES.find((p) => p.id === id)!).filter(Boolean);
  return {
    items,
    setup: items.filter((i) => i.billing === "once").reduce((n, i) => n + i.price, 0),
    monthly: items.filter((i) => i.billing === "month").reduce((n, i) => n + i.price, 0),
  };
}

export const PRICING_FAQS = [
  { q: "How much does CEO Turbo cost?", a: `Most clients pick one setup package and one monthly plan. Packages: Turbo Start ${price("pkg-start")}, Turbo Launch (the whole package, with a new website) ${price("pkg-launch")}, Turbo Dominate ${price("pkg-dominate")}. Monthly plans: Turbo Care ${price("care")}/mo, Turbo Growth ${price("growth")}/mo (includes ads management), Turbo Scale ${price("scale")}/mo. Need just one thing? Google Business Profile setup is ${price("gbp-setup")} and websites start at ${price("site-artist")}.` },
  { q: "What's in the whole package?", a: `Turbo Launch (${price("pkg-launch")} one-time) is everything a business or artist needs to get found and get customers: a new website built for SEO, AEO and GEO; Google and Bing indexing so you show up on Google, Microsoft Bing, ChatGPT, Claude and Perplexity; Google Business Profile; up to 5 social profiles; Merchant Center for stores; GA4, Tag Manager, Meta, Microsoft, TikTok and Reddit tracking; an email system; your own booking calendar; ad campaigns on your 2 best-fit platforms; and 2 NFC review cards. Your first month of Turbo Care is free.` },
  { q: "What are Conversion Rescue and Tracking Watch?", a: `Conversion Rescue (${price("conversion-rescue")} one-time) audits and fixes everything your ads depend on: GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft conversions, with real conversion values and a wasted-spend fix list. It's included in every setup package. Tracking Watch (${price("tracking-watch")}/mo) keeps it healthy and trims wasted spend each month; Turbo Care, Growth and Scale already include it. Ads & tracking setup (${price("tracking-setup")}) is for brand-new accounts with nothing to repair.` },
  { q: "Why is there a setup fee and a monthly fee?", a: "Setup is the one-time work of building something properly — a website, a Google profile, tracking, ad campaigns. Monthly plans are for things that need constant work to keep paying off: security and software updates, the latest SEO and AI search changes, tag and pixel health, ad optimization and email campaigns." },
  { q: "Is there a contract?", a: PRICING_TERMS.contract },
  { q: "Is ad spend included?", a: PRICING_TERMS.adSpend + " Most local businesses start with $10–$20 a day." },
  { q: "Do I need a monthly plan after setup?", a: `We strongly recommend Turbo Care (${price("care")}/mo). Websites need security patches, software updates, backups and tracking checks to stay safe and keep ranking — and search and AI change every month. Care covers all of that plus an email campaign and Google posts.` },
  { q: "How do you compare to other agencies?", a: `Most small-business agencies quote thousands for a website alone, then charge separately for SEO, ads management and maintenance. Turbo Launch includes the website, SEO/AEO/GEO, tracking, profiles, email and ad setup for ${price("pkg-launch")} one-time, and Turbo Growth (${price("growth")}/mo) includes ads management, content and care — no contract.` },
  { q: "Is SEO, AEO and GEO worth it for a small business?", a: `If one new customer is worth $300 to you, Turbo Growth (${price("growth")}/mo) pays for itself with two extra customers a month — and unlike ads, rankings keep bringing customers after you've earned them. ${PRICING_TERMS.results}` },
  { q: "Who owns the website and accounts?", a: PRICING_TERMS.ownership },
  { q: "Can I start small?", a: `Yes. Turbo Start (${price("pkg-start")}) fixes your Google profile, socials, indexing and tracking without a new website. Or start with a few review cards, see the results, then add more. Book a free call and we'll tell you the one thing to start with.` },
];
