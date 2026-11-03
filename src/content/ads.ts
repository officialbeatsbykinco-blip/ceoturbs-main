// Ad creatives designed by CEO Turbo. Images live in /public/img/ads.

export type AdCreative = {
  slug: string;
  client: string;
  clientSlug?: string;
  hook: string;
  format: "Square" | "Portrait" | "Landscape";
  vertical: "local" | "shopify" | "artist" | "brand";
};

export const ADS: AdCreative[] = [
  { slug: "mor-handy-electrical-panel", client: "Mor Handy", clientSlug: "mor-handy", hook: "One spark away from disaster — before/after panel swap", format: "Square", vertical: "local" },
  { slug: "1stikk-mock-kit", client: "1 Stikk Mobile", clientSlug: "1stikk-mobile", hook: "$75 all-in-one drug-screen mock kit", format: "Square", vertical: "local" },
  { slug: "ryan-pool-kangen-water", client: "Ryan Pool Enagic", clientSlug: "ryan-pool", hook: "What's really in your water?", format: "Square", vertical: "brand" },
  { slug: "appliance-king-washer-dryer", client: "Appliance King", clientSlug: "appliance-king", hook: "Your washer & dryer called out today", format: "Portrait", vertical: "local" },
  { slug: "kingstone-before-after", client: "Kingstone Landscaping", clientSlug: "kingstone-landscaping", hook: "$45 cuts, first cut free — before & after", format: "Square", vertical: "local" },
  { slug: "stackmode-computer-repair", client: "Stackmode", hook: "Don't buy a new computer — tune-ups from $99", format: "Square", vertical: "local" },
  { slug: "mor-handy-outlet", client: "Mor Handy", clientSlug: "mor-handy", hook: "Dead outlet? Same-day fix", format: "Square", vertical: "local" },
  { slug: "cleardump-driveway", client: "ClearDump", clientSlug: "cleardump", hook: "Dirty driveway? We blast it clean", format: "Portrait", vertical: "local" },
  { slug: "beyond-labels-necklace", client: "Beyond Labels Gifts", clientSlug: "beyond-labels-gifts", hook: "Is there someone you love and appreciate?", format: "Square", vertical: "shopify" },
  { slug: "xilly-pc-fps", client: "Xilly.net", hook: "118 FPS to 567 FPS — free PC checkup", format: "Square", vertical: "shopify" },
  { slug: "mor-handy-carpet", client: "Mor Handy", clientSlug: "mor-handy", hook: "Don't replace yet — stains, odor & worn spots", format: "Square", vertical: "local" },
  { slug: "layne-fitness-muscle", client: "Layne Fitness", clientSlug: "layne-fitness", hook: "I will help you build muscle fast", format: "Portrait", vertical: "brand" },
  { slug: "ryan-pool-bottled-water", client: "Ryan Pool Enagic", clientSlug: "ryan-pool", hook: "Stop drinking bottled water", format: "Square", vertical: "brand" },
  { slug: "1stikk-text-message", client: "1 Stikk Mobile", clientSlug: "1stikk-mobile", hook: "Text-thread style recruiting ad", format: "Square", vertical: "local" },
  { slug: "kava-construction-decks", client: "Kava Construction", hook: "Turn your backyard into your favorite place", format: "Square", vertical: "local" },
  { slug: "uprise-electric", client: "Uprise Electric", hook: "Powering Chicago with precision — 10% off", format: "Square", vertical: "local" },
  { slug: "loner-studio-rich-alone", client: "Loner Studio", hook: "It's lonely at the top — $55 tee drop", format: "Square", vertical: "shopify" },
  { slug: "ntg-sold-listing", client: "NTG Sold", hook: "Just listed: Flowery Branch oasis", format: "Square", vertical: "local" },
  { slug: "jarrett-bmw", client: "Jarrett the Dealmaker", hook: "Your ultimate BMW is here", format: "Square", vertical: "local" },
];

export const adsFor = (vertical: AdCreative["vertical"]) => ADS.filter((a) => a.vertical === vertical);
export const adsForClient = (clientSlug: string) => ADS.filter((a) => a.clientSlug === clientSlug);
