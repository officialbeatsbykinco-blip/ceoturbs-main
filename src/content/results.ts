// Real Meta Ads Manager numbers, read from the dashboards in /Images/Ad Results (Jul–Aug 2026).
// Keep these exactly as reported — they are cited across the site and in guides.

export type AdResult = {
  key: string;
  client: string;
  clientSlug?: string;
  campaign: string;
  metric: "Leads" | "Profile & page visits" | "Checkouts started";
  count: number;
  costPer: number;
  spent: number;
  /** Meta's own peer benchmark line, only where it was shown on the dashboard. */
  peer?: string;
  image: string;
};

export const AD_RESULTS: AdResult[] = [
  {
    key: "ryan-pool",
    client: "Ryan Pool Enagic",
    clientSlug: "ryan-pool",
    campaign: "Kangen water system — lead form",
    metric: "Leads",
    count: 29,
    costPer: 4.89,
    spent: 141.7,
    peer: "35% lower cost per lead than similar ad sets (peer median $7.26)",
    image: "/img/results/ryan-pool.webp",
  },
  {
    key: "stackmode-repair",
    client: "Stackmode computer repair",
    campaign: "Computer repair — lead form (set 2)",
    metric: "Leads",
    count: 12,
    costPer: 4.31,
    spent: 51.77,
    peer: "66% lower cost per lead than similar ad sets (peer median $12.75)",
    image: "/img/results/stackmode-repair.webp",
  },
  {
    key: "mor-handy-carpet",
    client: "Mor Handy",
    clientSlug: "mor-handy",
    campaign: "Carpet cleaning — lead form",
    metric: "Leads",
    count: 13,
    costPer: 5.36,
    spent: 69.72,
    image: "/img/results/mor-handy-carpet.webp",
  },
  {
    key: "appliance-king",
    client: "Appliance King",
    clientSlug: "appliance-king",
    campaign: "Appliance repair — lead form",
    metric: "Leads",
    count: 55,
    costPer: 6.51,
    spent: 357.9,
    image: "/img/results/appliance-king.webp",
  },
  {
    key: "appliance-king-website",
    client: "Appliance King",
    clientSlug: "appliance-king",
    campaign: "Website leads — $5/day, last 30 days (Oct 2026)",
    metric: "Leads",
    count: 14,
    costPer: 6.46,
    spent: 90.49,
    image: "/img/results/appliance-king-website.webp",
  },
  {
    key: "stackmode-set-1",
    client: "Stackmode",
    campaign: "Lead form (set 1)",
    metric: "Leads",
    count: 16,
    costPer: 7.48,
    spent: 119.64,
    image: "/img/results/stackmode-set-1.webp",
  },
  {
    key: "stackmode-set-3",
    client: "Stackmode",
    campaign: "Lead form (set 3)",
    metric: "Leads",
    count: 8,
    costPer: 10.5,
    spent: 84.01,
    peer: "22% lower cost per lead than similar ad sets (peer median $12.75)",
    image: "/img/results/stackmode-set-3.webp",
  },
  {
    key: "mor-handy-electrical",
    client: "Mor Handy",
    clientSlug: "mor-handy",
    campaign: "Outlet & socket replacement — lead form",
    metric: "Leads",
    count: 14,
    costPer: 19.91,
    spent: 278.69,
    image: "/img/results/mor-handy-electrical.webp",
  },
  {
    key: "bigzo",
    client: "BIGZO",
    clientSlug: "bigzo",
    campaign: "Artist profile growth",
    metric: "Profile & page visits",
    count: 165,
    costPer: 0.32,
    spent: 53.59,
    peer: "62% lower cost per visit than similar ad sets (peer median $0.85)",
    image: "/img/results/bigzo.webp",
  },
  {
    key: "xilly",
    client: "Xilly.net",
    campaign: "PC optimization — website checkout",
    metric: "Checkouts started",
    count: 18,
    costPer: 15.47,
    spent: 278.53,
    image: "/img/results/xilly.webp",
  },
];

const leadRows = AD_RESULTS.filter((r) => r.metric === "Leads");

export const AD_TOTALS = {
  leads: leadRows.reduce((n, r) => n + r.count, 0),
  leadSpend: leadRows.reduce((n, r) => n + r.spent, 0),
  get avgCpl() {
    return this.leadSpend / this.leads;
  },
  lowestCpl: Math.min(...leadRows.map((r) => r.costPer)),
  campaigns: leadRows.length,
};

/** Search Console, stackmode.net, 12-month view (Aug 2025 – Aug 2026). */
export const GSC = {
  property: "stackmode.net",
  clicks: 83,
  impressions: "3.34K",
  period: "12 months",
  width: 1600,
  height: 553,
  caption: "Daily impressions were flat for most of the year, then climbed steeply once the SEO, AEO and GEO work went live.",
  ctr: "2.5%",
  position: "25.4",
  image: "/img/results/gsc-stackmode.webp",
};

export type GscResult = { property: string; period: string; clicks: number | string; impressions: number | string; ctr: string; image: string; width: number; height: number; caption: string };

/** Appliance King website, Google Search Console, last 3 months (Aug 26 – Oct 25, 2026). Keep exact; position was hidden in the screenshot. */
export const APPLIANCE_KING_GSC: GscResult = {
  property: "Appliance King website",
  period: "3 months, Aug 26 – Oct 25, 2026",
  clicks: 71,
  impressions: 957,
  ctr: "7.4%",
  image: "/img/results/appliance-king-gsc.webp",
  width: 2000,
  height: 637,
  caption: "No search traffic until early October, then clicks and impressions climbing steadily.",
};

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Appliance King Facebook page insights, 2026 view (activity starts in July when the ads launched). */
export const APPLIANCE_KING_PAGE = {
  views: "59.4K",
  viewers: "26.6K",
  interactions: "151",
  linkClicks: "778",
  visits: "1.4K",
  follows: "186",
  image: "/img/results/appliance-king-page.webp",
};

export type GoogleAdResult = {
  key: string;
  client: string;
  clientSlug: string;
  campaign: string;
  period: string;
  headline: string;
  clicks: number;
  ctr?: string;
  cpc?: number;
  conversions: number;
  costPer: number;
  spent: number;
  image: string;
  width: number;
  height: number;
};

/**
 * Appliance King Google Ads (Search), read from the Ads screenshots. Keep exact.
 * Conversions are as reported by Google Ads. Kept out of AD_RESULTS so the Meta AD_TOTALS stay Meta-only.
 * The first entry is the featured (best) result.
 */
export const GOOGLE_AD_RESULTS: GoogleAdResult[] = [
  {
    key: "appliance-king-google-day",
    client: "Appliance King",
    clientSlug: "appliance-king",
    campaign: "Appliance repair, Macon GA: Google Search",
    period: "One day, Oct 2026 (conversions shown as pending in Google Ads)",
    headline: "3 clicks. 2 conversions. $6.57 spent.",
    clicks: 3,
    cpc: 2.19,
    conversions: 2,
    costPer: 3.29,
    spent: 6.57,
    image: "/img/results/appliance-king-google-day.webp",
    width: 690,
    height: 255,
  },
  {
    key: "appliance-king-google-week",
    client: "Appliance King",
    clientSlug: "appliance-king",
    campaign: "Appliance repair, Macon GA: Google Search",
    period: "Oct 16–22, 2026",
    headline: "First week on Google Search: 3 conversions at $16.89 each.",
    clicks: 18,
    ctr: "8.78%",
    conversions: 3,
    costPer: 16.89,
    spent: 50.66,
    image: "/img/results/appliance-king-google.webp",
    width: 2000,
    height: 879,
  },
];

export const GOOGLE_AD_RESULT = GOOGLE_AD_RESULTS[0];

/** Featured proof. The revenue line is the owner's own statement, not a dashboard number. */
export const FEATURED_RESULT = {
  clientSlug: "appliance-king",
  client: "Appliance King",
  headline: "A few hundred dollars of ads turned into thousands in revenue.",
  note: "Per the business owner. The lead numbers below come straight from Meta Ads Manager.",
  did: [
    "Built the Meta lead-form ad and the lead form",
    "Optimized their Facebook & social profile",
    "Optimized their Google Business Profile",
  ],
};

/**
 * CEO Turbo's own Stripe account (what businesses paid us), read from dashboard screenshots in
 * /Images/Stripe Results, Oct 12 2026. Keep exact. This is our revenue, not client earnings or profit.
 */
export type Payout = { amount: number; date?: string; to: "Visa" | "Wells Fargo" };

export const STRIPE = {
  gross: "$11.2K",
  net: "$10.7K",
  netGrowth: "+1,930.7%",
  payments: 152,
  paymentsBefore: 10,
  paymentsGrowth: "+1,420%",
  period: "Nov 2025 – Oct 2026",
  periodBefore: "Nov 2024 – Oct 2025",
  /** Newest first. The three bank payouts were cropped without dates. */
  payouts: [
    { amount: 46.99, date: "Oct 11", to: "Visa" },
    { amount: 95.52, date: "Oct 11", to: "Visa" },
    { amount: 286.7, date: "Oct 10", to: "Visa" },
    { amount: 28.33, date: "Oct 10", to: "Visa" },
    { amount: 94.48, date: "Oct 9", to: "Visa" },
    { amount: 57.1, date: "Oct 7", to: "Visa" },
    { amount: 47.54, date: "Oct 7", to: "Visa" },
    { amount: 354.62, date: "Sep 30", to: "Visa" },
    { amount: 47.04, date: "Sep 30", to: "Visa" },
    { amount: 94.09, date: "Sep 28", to: "Visa" },
    { amount: 248.26, date: "Sep 25", to: "Visa" },
    { amount: 23.08, date: "Sep 21", to: "Visa" },
    { amount: 18.62, date: "Sep 17", to: "Visa" },
    { amount: 8.84, date: "Sep 17", to: "Visa" },
    { amount: 340.6, to: "Wells Fargo" },
    { amount: 332, to: "Wells Fargo" },
    { amount: 312.66, to: "Wells Fargo" },
  ] as Payout[],
  images: [
    { src: "/img/results/stripe/stripe-payments-yoy.webp", w: 828, h: 173, alt: "Stripe dashboard: successful payments up 1,420%, from 10 (Nov 2024 – Oct 2025) to 152 (Nov 2025 – Oct 2026)" },
    { src: "/img/results/stripe/stripe-gross-volume.webp", w: 456, h: 100, alt: "Stripe dashboard: gross volume $11.2K" },
    { src: "/img/results/stripe/stripe-net-volume.webp", w: 230, h: 134, alt: "Stripe dashboard: net volume $10.7K, up 1,930.7%" },
    { src: "/img/results/stripe/stripe-payout-340.webp", w: 828, h: 134, alt: "Stripe payout of $340.60 to Wells Fargo, paid" },
    { src: "/img/results/stripe/stripe-payout-332.webp", w: 728, h: 124, alt: "Stripe payout of $332.00 to Wells Fargo" },
    { src: "/img/results/stripe/stripe-payout-312.webp", w: 828, h: 143, alt: "Stripe payout of $312.66 to Wells Fargo, paid" },
  ],
  lists: [
    { src: "/img/results/stripe/stripe-payouts-oct.webp", w: 322, h: 1420, alt: "Stripe payouts to Visa, Oct 7 – Oct 11 2026: $46.99, $95.52, $286.70, $28.33, $94.48, $57.10, $47.54" },
    { src: "/img/results/stripe/stripe-payouts-sep.webp", w: 314, h: 1374, alt: "Stripe payouts to Visa, Sep 17 – Sep 30 2026: $354.62, $47.04, $94.09, $248.26, $23.08, $18.62, $8.84" },
  ],
};
