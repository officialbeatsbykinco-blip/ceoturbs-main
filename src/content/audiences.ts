import type { Category } from "./clients";
import type { FAQ } from "./services";
import { price } from "./pricing";

export type Audience = {
  slug: "artist" | "producers" | "visual-artists" | "local-business" | "shopify";
  category: Category;
  nav: string;
  /** Lower-case plural for running text, e.g. "local businesses". */
  plural: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  answer: string;
  /** Problems written the way the audience says them. */
  pains: { title: string; body: string }[];
  outcomes: { title: string; body: string; service?: string }[];
  serviceSlugs: string[];
  adVertical: "artist" | "local" | "shopify";
  resultKeys: string[];
  ctaLabel: string;
  bookingNote: string;
  faqs: FAQ[];
  /** Price-list ids shown in the page's price section (defaults to the music set in AudiencePage). */
  priceIds?: string[];
  /** Shown under the price cards. */
  priceNote?: string;
  /** false hides "sites we've built" (the music client sites don't fit this audience). */
  showWork?: boolean;
  /** "all" shows only the general guides, not the audience's own (e.g. the Spotify guides). */
  guidesFrom?: "all";
};

export const AUDIENCES: Audience[] = [
  {
    slug: "artist",
    category: "artist",
    nav: "Artists",
    plural: "artists",
    metaTitle: "Music Artist Marketing — Listeners, Shows & Labels",
    metaDescription:
      "Artist websites, video ads on Meta, TikTok, YouTube and search, and SEO for more listeners, booked shows and tours, features, labels and merch sales.",
    eyebrow: "For artists & producers",
    h1: "Get more listeners, more shows and the attention of labels",
    answer:
      "CEO Turbo helps independent artists and producers fix their online presence so it works like a team: an artist website that books shows and sells merch, social profiles that convert visitors into followers, ads that grow real listeners, and search visibility so your name returns you — not someone else.",
    pains: [
      { title: "Your profiles don't match", body: "Different names, old photos and dead links across Instagram, TikTok, Spotify and YouTube make you look smaller than you are." },
      { title: "Streams aren't turning into fans", body: "People hear one song on a playlist and never find the rest of your catalog, your shows or your merch." },
      { title: "Promoters and labels can't find the info", body: "No press kit, no booking contact, no numbers in one place — so the email never gets sent." },
      { title: "Googling your name shows someone else", body: "Without your own site, search and AI tools have nothing official to point to." },
    ],
    outcomes: [
      { title: "Fix your social media presence", body: "Matching names, bios, profile art, highlights and links across every platform — so a first-time visitor knows who you are in three seconds.", service: "social-media-optimization" },
      { title: "Get more listeners", body: "Meta, TikTok and X ads that send real people to your profile and streams. BIGZO's campaign drove 165 profile visits at $0.32 each.", service: "meta-ads" },
      { title: "Turn your videos into ads", body: "Your best clips, cut and captioned into short video ads for Instagram, Facebook, TikTok and YouTube Shorts, so every video you already shot keeps working after it posts.", service: "tiktok-ads" },
      { title: "Book more shows and tours", body: "A booking page with your EPK, live footage, a tour-dates page and a direct contact form, so promoters and venues can book you without a DM chain.", service: "website-design" },
      { title: "Get features and label attention", body: "A professional artist site with your story, numbers and press in one place — the link you send with every pitch. Take paid features and sessions from the same page.", service: "website-design" },
      { title: "Sell merch", body: "Design shirts with your cover art and tour dates in 2 minutes — no minimum, from $24.99 — plus drop emails to your fan list so every release sells something.", service: "artist-merch" },
      { title: "Own your name in search", body: "Artist schema, consistent profiles and an official site so Google and AI assistants describe you correctly.", service: "seo-aeo-geo" },
    ],
    serviceSlugs: ["social-media-optimization", "website-design", "meta-ads", "tiktok-ads", "x-ads", "email-marketing", "seo-aeo-geo"],
    adVertical: "artist",
    resultKeys: ["bigzo"],
    ctaLabel: "Book my artist growth call",
    bookingNote: "Artist growth — listeners, shows, features, merch",
    faqs: [
      { q: "How do I get more Spotify listeners?", a: "Make every profile point to your music, release consistently, pitch each release to Spotify editorial through Spotify for Artists at least seven days before release, and run small ads that send people to your profile rather than a single track. Our guide covers the full plan." },
      { q: "Do I need a website if I have Linktree?", a: "A link-in-bio page lists links; an artist website sells you. It can hold your EPK, booking form, merch store and fan email list, and it gives Google and AI tools an official source about you." },
      { q: "Can you get me signed to a label?", a: "No one can promise a deal. What we do is make sure that when an A&R or promoter looks you up, they find a professional presence with your music, numbers and contact in one place." },
      { q: "How much do artist ads cost?", a: "You set the budget. BIGZO's profile-growth campaign spent $53.59 and produced 165 profile and page visits. Most artists start with $5–$15 a day around a release." },
      { q: "Do you work with producers and beatmakers?", a: "Yes — YARI's site sells beats and production sessions. Producers need a clear beat store, licensing info and a booking path for custom work. See our page for producers at ceoturbo.com/producers." },
      { q: "What does it cost to get started?", a: `An artist website is ${price("site-artist")} one-time. If you already have a site, ads and tracking setup is ${price("tracking-setup")} one-time. Weekly ad management is ${price("growth")} a month on month-to-month terms, and your ad spend goes straight to the platform with no markup.` },
    ],
  },
  {
    slug: "local-business",
    category: "local",
    nav: "Local businesses",
    plural: "local businesses",
    metaTitle: "Local Business Marketing — More Calls, Reviews & Booked Jobs",
    metaDescription:
      "Websites, Google Business Profile, Meta and Google ads for local service businesses and barbers. Meta leads from $4.31. Book a free growth call.",
    eyebrow: "For local service businesses",
    h1: "More calls, more reviews and more booked jobs for your local business",
    answer:
      "CEO Turbo helps local service businesses — home services, auto, landscaping, barbers, cleaners, mobile services — get more calls and booked jobs. We build the website, fix your Google Business Profile so you show up in the map pack, run Facebook and Google ads, and set up a simple system for getting reviews.",
    pains: [
      { title: "Competitors show up on Google Maps — you don't", body: "Wrong categories, an empty services list and few recent reviews keep you out of the map pack." },
      { title: "Your phone depends on referrals", body: "Word of mouth is great until it slows down, and there's no second source of jobs." },
      { title: "Your website doesn't make people call", body: "No phone number up top, no prices, no proof — visitors leave to call someone else." },
      { title: "You tried ads and got junk leads", body: "Boosted posts and broad targeting bring likes, not jobs." },
    ],
    outcomes: [
      { title: "Show up in the map pack", body: "Categories, services, attributes, photos, posts and a review routine on your Google Business Profile.", service: "google-business-profile" },
      { title: "Get leads this month", body: "Meta lead-form campaigns that have produced leads at $4.31–$19.91 for home-service clients.", service: "meta-ads" },
      { title: "Catch emergency searches", body: "Google search ads for “near me” and same-day searches, with call tracking.", service: "google-ads" },
      { title: "A website that makes the phone ring", body: "Tap-to-call, estimate buttons, prices and real job photos above the fold.", service: "website-design" },
      { title: "Rank for your service and city", body: "Service and location pages written to answer the questions people search before they call.", service: "seo-aeo-geo" },
      { title: "Get more Google reviews", body: "An NFC review card at the register: customers tap their phone and your Google review form opens.", service: "google-review-cards" },
    ],
    serviceSlugs: ["google-business-profile", "website-design", "meta-ads", "google-ads", "seo-aeo-geo", "social-media-optimization"],
    adVertical: "local",
    resultKeys: ["stackmode-repair", "mor-handy-carpet", "appliance-king", "mor-handy-electrical"],
    ctaLabel: "Book my local growth call",
    bookingNote: "Local business — calls, reviews, booked jobs",
    faqs: [
      { q: "What's the fastest way for a local business to get more customers?", a: "Run a lead-form or search ad around one strong offer for immediate leads, and fix your Google Business Profile at the same time so organic map-pack calls build underneath." },
      { q: "Do you work with barbershops and salons?", a: "Yes. For appointment businesses we focus on the booking link everywhere — Google profile, Instagram and website — plus a tap-to-review card at every chair and before/after content." },
      { q: "How much do Facebook leads cost for local services?", a: "On our recent home-service campaigns: $4.31 for computer repair, $5.36 for carpet cleaning, $6.51 for appliance repair and $19.91 for outlet replacement." },
      { q: "Do I need a website if I have a Google Business Profile?", a: "Your profile gets you into Maps; your website closes the job and ranks for the searches Maps doesn't cover. Google also uses your website to understand what your profile offers." },
      { q: "Which areas do you serve?", a: "We work with businesses all over the world. Everything is done online, and our current clients include businesses in Atlanta and North Georgia, Macon, the Denver metro and the Washington DC area." },
    ],
  },
  {
    slug: "shopify",
    category: "shopify",
    nav: "Shopify stores",
    plural: "Shopify stores",
    metaTitle: "Shopify Store Marketing — More Sales From the Traffic You Get",
    metaDescription:
      "Shopify store design, product pages, Meta and TikTok ads, email flows and SEO for stores that get visitors but not enough sales.",
    eyebrow: "For Shopify & online stores",
    h1: "Turn your Shopify traffic into sales — then get more of it",
    answer:
      "CEO Turbo helps Shopify and online stores sell more by fixing the product page first — offer, photos, objections, checkout — then adding traffic with Meta and TikTok ads, recovering lost carts with email flows, and building organic search and AI visibility so you aren't paying for every visitor.",
    pains: [
      { title: "Visitors, but no sales", body: "People land, scroll and leave. Usually the product page isn't answering their questions." },
      { title: "Ads are getting more expensive", body: "Rising costs per purchase with no organic traffic underneath to balance it." },
      { title: "Abandoned carts pile up", body: "Shoppers add to cart and disappear, with no email or text to bring them back." },
      { title: "Your store looks like every other theme", body: "A generic theme makes a premium product look cheap." },
    ],
    outcomes: [
      { title: "Product pages that close", body: "Clear options with prices, what's included, guarantees and a checkout summary that stays visible.", service: "website-design" },
      { title: "Ads that find buyers", body: "Meta and TikTok campaigns with creative built around the product's hook.", service: "meta-ads" },
      { title: "Recover lost carts", body: "Welcome, abandoned cart, post-purchase and win-back emails.", service: "email-marketing" },
      { title: "Organic traffic and AI shopping visibility", body: "Product schema, collection pages and buying guides that search engines and AI assistants can read.", service: "seo-aeo-geo" },
      { title: "Short-form video ads", body: "Spark Ads and creator-style videos on TikTok.", service: "tiktok-ads" },
    ],
    serviceSlugs: ["website-design", "meta-ads", "tiktok-ads", "email-marketing", "seo-aeo-geo", "google-ads"],
    adVertical: "shopify",
    resultKeys: ["xilly"],
    ctaLabel: "Book my store growth call",
    bookingNote: "Shopify store — more sales",
    faqs: [
      { q: "Why is my Shopify store getting visitors but no sales?", a: "The usual causes are an unclear offer, weak product photos, missing answers about shipping, sizing or returns, surprise costs at checkout, and traffic that doesn't match the product. Fix the product page before buying more traffic." },
      { q: "Should I run Facebook or TikTok ads for my store?", a: "Meta is the more predictable starting point for most stores. TikTok works well for products with a visual demo and buyers under 40. Many stores test both with small budgets." },
      { q: "Do you redesign existing Shopify stores?", a: "Yes. We usually start with the homepage and best-selling product page, since that's where most revenue is decided." },
      { q: "Can my products show up in ChatGPT shopping answers?", a: "AI shopping results lean on structured product data — price, availability, reviews — and clear product content. We add Product schema and clean data so your store is easier to cite. Inclusion is never guaranteed." },
    ],
  },
];


/** The beat-seller landing page: the destination for "sell beats" search ads. Not in AUDIENCES, so it never shows in the home picker. */
export const PRODUCERS: Audience = {
  slug: "producers",
  category: "artist",
  nav: "Producers",
  plural: "producers and beatmakers",
  metaTitle: "Sell More Beats Online — Marketing for Music Producers",
  metaDescription:
    "A beat store you own, search ads for artists ready to buy beats, and video ads on Meta, TikTok and YouTube. More beat sales, custom tracks and sessions.",
  eyebrow: "For producers & beatmakers",
  h1: "Sell more beats, custom tracks and production sessions",
  answer:
    "CEO Turbo helps producers and beatmakers turn views and followers into paying artists: a beat store and booking site you own, clear licensing and prices, search ads that reach artists already looking for beats, and video ads cut from your studio clips on Meta, TikTok and YouTube.",
  pains: [
    { title: "Plays and views, but few sales", body: "Artists listen to your beats and leave. Nothing on the page tells them what a lease costs, what they get or what to do next." },
    { title: "You only exist on a marketplace", body: "On a marketplace you compete with thousands of beats on a page you don't control, with no email list and nothing for Google to show for your name." },
    { title: "Artists can't find your prices and licensing", body: "No clear lease, exclusive or custom-beat pricing means serious buyers DM you, wait, and buy from whoever answered first." },
    { title: "Custom work and sessions never get booked", body: "No booking page, rates or examples means the artists who want a custom beat or a studio session never reach you." },
  ],
  outcomes: [
    { title: "A beat store you own", body: "Your beats, prices and license terms on your own site, with your name in Google and a fan and buyer list you keep. Checkout can stay with the marketplace you already use.", service: "website-design" },
    { title: "Search ads that find buyers", body: "Google and Microsoft search ads for artists typing things like “buy beats online” or “custom beat for my song”, sent to a page built to turn them into a sale or a booking.", service: "google-ads" },
    { title: "Turn your studio clips into ads", body: "Your beat-making videos and sessions, cut and captioned into short ads for Instagram, Facebook, TikTok and YouTube Shorts, aimed at working artists.", service: "meta-ads" },
    { title: "Book custom beats and sessions", body: "A page with your rates, examples and a booking form, so artists can request a custom beat, a mix or a session without a DM chain.", service: "website-design" },
    { title: "Email the artists who bought", body: "A simple list and a drop email for every new beat pack, so past buyers hear about new work first.", service: "email-marketing" },
    { title: "Own your name in search", body: "A producer schema, matching profiles and an official site so Google and AI assistants describe you correctly.", service: "seo-aeo-geo" },
  ],
  serviceSlugs: ["website-design", "google-ads", "meta-ads", "tiktok-ads", "email-marketing", "seo-aeo-geo"],
  adVertical: "artist",
  resultKeys: ["bigzo"],
  ctaLabel: "Book my producer growth call",
  bookingNote: "Producer growth — sell beats, sessions, features",
  faqs: [
    { q: "How do I sell more beats online?", a: "Make buying obvious: put your best beats, clear lease and exclusive prices and license terms on one page you own, point every profile at it, then send artists there with short video ads and search ads. Start with video ads to test which beats get attention, then add search ads for artists already looking to buy." },
    { q: "Do I still need a beat marketplace if I have my own site?", a: "Many producers keep one for checkout and file delivery. Your own site is where Google finds you, where you collect emails and where custom work and sessions get booked, so the two work together." },
    { q: "What do ads for beats cost?", a: "You set the budget and it goes straight to the platform. Most producers start with $5–$10 a day on one platform, test for a couple of weeks, then put more behind whatever brings buyers or bookings." },
    { q: "Do you write my licensing terms?", a: "We build the pricing and license pages from the terms you give us. Your license wording is a legal document, so have a lawyer or your marketplace's standard license be the source for it." },
    { q: "Can you help me sell features and book shows too?", a: "Yes. The same site can take paid features, session requests and show bookings. See our page for artists for the full list." },
    { q: "How much does it cost to get started?", a: `An artist or producer website is ${price("site-artist")} one-time. If you already have a site, ads and tracking setup is ${price("tracking-setup")} one-time. Weekly ad management is ${price("growth")} a month, month to month, and you can cancel with 30 days' notice.` },
  ],
};

/** Painters and other visual artists selling originals, prints and commissions. Not in AUDIENCES (kept off the home picker). */
export const VISUAL_ARTISTS: Audience = {
  slug: "visual-artists",
  category: "artist",
  nav: "Visual artists",
  plural: "visual artists",
  metaTitle: "Sell More Paintings Online — Marketing for Visual Artists",
  metaDescription:
    "A site that sells your originals, prints and commissions, plus video ads from your process clips on Instagram, Facebook, TikTok and Google. Free call.",
  eyebrow: "For painters & visual artists",
  h1: "Sell more paintings, prints and commissions online",
  answer:
    "CEO Turbo helps painters and visual artists turn followers into buyers: a site you own that sells originals, prints and commissions, clear prices and shipping, and ads built from your process videos on Instagram, Facebook, TikTok and Google so collectors find you.",
  pains: [
    { title: "Lots of likes, few sales", body: "People love the work on Instagram and never find where to buy it, what it costs or how it ships." },
    { title: "You depend on a marketplace", body: "On a marketplace your art sits beside thousands of others, with no email list of collectors and nothing of your own for Google to show." },
    { title: "Prices, sizes and shipping are unclear", body: "Serious buyers will not DM to ask what a piece costs. They buy from whoever makes it easy." },
    { title: "Commissions never get booked", body: "Without a simple request page with your process, prices and timeline, commission inquiries go cold." },
  ],
  outcomes: [
    { title: "A site that sells your work", body: "Originals, prints and commissions on a site you own, with clear prices, sizes and shipping, and your name in Google.", service: "website-design" },
    { title: "Turn your process videos into ads", body: "Time-lapses and studio clips cut and captioned into short ads for Instagram, Facebook, TikTok and YouTube Shorts, aimed at people who buy art.", service: "meta-ads" },
    { title: "Search ads for people ready to buy", body: "Google and Microsoft ads for collectors searching for the kind of art you make, sent to a page built to sell it.", service: "google-ads" },
    { title: "Book commissions", body: "A request page with your examples, price ranges and timeline, so serious buyers can start a commission without a DM chain.", service: "website-design" },
    { title: "Email your collectors", body: "A simple list and a drop email for every new series, so past buyers hear first.", service: "email-marketing" },
    { title: "Own your name in search", body: "Matching profiles and an official site so Google and AI assistants describe you correctly.", service: "seo-aeo-geo" },
  ],
  serviceSlugs: ["website-design", "meta-ads", "google-ads", "tiktok-ads", "email-marketing", "social-media-optimization"],
  adVertical: "artist",
  resultKeys: [],
  ctaLabel: "Book my art growth call",
  bookingNote: "Visual artists — sell paintings, prints, commissions",
  showWork: false,
  guidesFrom: "all",
  priceIds: ["social-setup", "tracking-setup", "growth"],
  priceNote: `Need a site that sells your originals and prints? Artist websites start at ${price("site-artist")} one-time. We confirm the exact scope for a gallery or store on the free call, after we see your work.`,
  faqs: [
    { q: "How do I sell paintings online?", a: "Put your best pieces, prices, sizes and shipping on one page you own, point your social profiles at it, then send people there with short video ads of your process. A marketplace can handle checkout while your own site collects emails and commission requests." },
    { q: "Do I still need Etsy or another marketplace?", a: "Many artists keep one for checkout. Your own site is where Google finds you, where you collect collectors' emails and where commissions get booked, so the two work together." },
    { q: "What do ads for art cost?", a: "You set the budget and it goes straight to the platform. Most artists start with $5 a day on one platform, test for a couple of weeks, then put more behind whatever brings buyers or commission requests." },
    { q: "Do you have painters as clients?", a: "Our proof so far is with music artists and local businesses, and we say so. A free call is the way to see whether it fits your work before you spend anything." },
    { q: "How much does it cost to get started?", a: `Social profile setup is ${price("social-setup")} one-time, ads and tracking setup is ${price("tracking-setup")} one-time, and weekly ad management is ${price("growth")} a month, month to month with 30 days' notice. Ad spend goes straight to the platform, never marked up.` },
  ],
};

export const audienceBySlug = (slug: string) => [...AUDIENCES, PRODUCERS, VISUAL_ARTISTS].find((a) => a.slug === slug);
