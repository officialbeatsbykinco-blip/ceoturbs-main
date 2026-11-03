// The 19 client websites CEO Turbo built. Screenshots: /public/img/work/{slug}.webp
// Copy describes what is visibly on each live site — no invented metrics.

export type Category = "artist" | "local" | "shopify" | "brand";

export type Client = {
  slug: string;
  name: string;
  url: string;
  category: Category;
  industry: string;
  location?: string;
  /** The promise the homepage leads with, paraphrased from the live site. */
  promise: string;
  overview: string;
  /** Conversion decisions visible on the live site. */
  decisions: { title: string; body: string }[];
  delivered: string[];
};

export const CATEGORY_LABEL: Record<Category, string> = {
  artist: "Artists",
  local: "Local businesses",
  shopify: "Online stores",
  brand: "Coaches & personal brands",
};

export const CLIENTS: Client[] = [
  {
    slug: "mor-handy",
    name: "Mor Handy",
    url: "https://morhandy.com",
    category: "local",
    industry: "Home repair & maintenance",
    location: "Washington DC, Maryland & Virginia",
    promise: "Your DMV-area home, in expert hands — one team instead of juggling contractors.",
    overview:
      "Mor Handy is a home-maintenance team serving the DMV. The site sells the one thing homeowners hate most about repairs — coordinating three different contractors — and answers it with a single trusted crew. We also built and ran their Meta lead campaigns for carpet cleaning and outlet replacement.",
    decisions: [
      { title: "Two buttons, two buyer types", body: "“Get Free Estimate” for planners and a tap-to-call number for people with a problem right now. Both sit above the fold on mobile." },
      { title: "A “need help this week?” prompt", body: "A small slide-in invites a call or estimate request after the visitor has read the hero, instead of a pop-up on arrival." },
      { title: "Trust row under the headline", body: "Licensed & insured, fast scheduling, transparent pricing and locally owned — the four objections a homeowner has before letting someone into the house." },
    ],
    delivered: ["Website design & build", "Meta lead-form ads", "Ad creative (3 sets)", "Local SEO structure"],
  },
  {
    slug: "appliance-king",
    name: "Appliance King",
    url: "https://appliancekingrepair.com",
    category: "local",
    industry: "Appliance repair",
    location: "Macon, Georgia",
    promise: "Start with the symptom — Appliance King reviews the brand, condition and job scope before the visit.",
    overview:
      "Appliance King repairs washers, dryers, refrigerators, freezers and dishwashers around Macon. People searching for appliance repair search by the broken machine, so the site is organized the same way. Their Meta lead-form campaign has produced 55 form leads at $6.51 each, and the business owner says a few hundred dollars of ad spend turned into thousands in revenue.",
    decisions: [
      { title: "Services listed as symptoms people search", body: "Washer repair, dryer repair, refrigerator & freezer repair — each a clear row that matches how people type it into Google." },
      { title: "Phone number in the header", body: "478-273-7539 is visible on every page next to the estimate button, because appliance emergencies get phoned in." },
      { title: "Residential and commercial split", body: "Separate navigation paths keep landlords and restaurant owners from bouncing off a homeowner-only pitch." },
    ],
    delivered: ["Website design & build", "Meta lead-form ads", "Ad creative", "Service-page SEO"],
  },
  {
    slug: "oj-junk-removal",
    name: "OJ Junk Removal",
    url: "https://ojjunkremoval.net",
    category: "local",
    industry: "Junk removal",
    location: "Atlanta metro, Georgia",
    promise: "Serious junk removal for homes, rentals and commercial properties.",
    overview:
      "OJ Junk Removal clears furniture, appliances, garage clutter, move-out junk and renovation debris across metro Atlanta. The site leans on the proof the business already had — a large base of five-star reviews and real before-and-after jobs — and turns it into quote requests.",
    decisions: [
      { title: "Send-a-photo quote box", body: "Visitors are told they can text photos for a tighter quote, which removes the “how much will this cost?” stall." },
      { title: "Real job photos, not stock", body: "Featured before/after cards show actual rooms and yards the crew cleared." },
      { title: "Commercial monthly plans", body: "A recurring-plan tile gives property managers a reason to call that a one-time homeowner wouldn't have." },
    ],
    delivered: ["Website design & build", "Local SEO structure", "Review-driven trust sections"],
  },
  {
    slug: "kingstone-landscaping",
    name: "Kingstone Landscaping",
    url: "https://kingstonelandscaping.com",
    category: "local",
    industry: "Lawn care & landscaping",
    location: "Gainesville, Cumming & Alpharetta, Georgia",
    promise: "A sharper yard. More curb appeal. Less stress.",
    overview:
      "Kingstone Landscaping (formerly Lawn Pups) handles lawn care and landscaping across North Georgia. The rebrand needed to carry the old name's goodwill into the new one, so both marks appear together on the site and in the ads.",
    decisions: [
      { title: "Old and new logo side by side", body: "Returning Lawn Pups customers instantly recognise they're in the right place after the name change." },
      { title: "Three risk-reversal chips", body: "Free estimates, no contracts and same trusted crew sit right under the headline." },
      { title: "Service area named in the first line", body: "Gainesville, Cumming and Alpharetta appear above the fold — useful for people and for local search." },
    ],
    delivered: ["Website design & rebrand", "Ad creative", "Local SEO structure"],
  },
  {
    slug: "bam-sprinklers",
    name: "BAM Sprinklers & Landscaping",
    url: "https://www.bamsprinklers.com",
    category: "local",
    industry: "Sprinklers, irrigation & xeriscaping",
    location: "Denver, Colorado",
    promise: "Denver's trusted sprinkler, landscaping and xeriscaping professionals.",
    overview:
      "BAM is a BBB-member landscaping company with 25+ years in the Denver metro. Their customers call — they don't fill out long forms — so the site puts two phone lines and the opening hours front and centre.",
    decisions: [
      { title: "Two call buttons in the hero", body: "Both office lines are one tap away on mobile, with business hours listed directly beneath." },
      { title: "Credentials before claims", body: "“BBB Member · 25+ years serving Denver” appears above the headline so trust lands first." },
      { title: "Xeriscaping in the H1", body: "Water-wise landscaping is a high-intent search in Colorado, so it's in the main heading." },
    ],
    delivered: ["Website design & build", "Local SEO structure"],
  },
  {
    slug: "joscar-turf",
    name: "Joscar Turf",
    url: "https://joscarturf.com",
    category: "local",
    industry: "Sod delivery & pickup",
    location: "Denver, Colorado",
    promise: "Fresh sod delivery and pickup in Denver — cut daily.",
    overview:
      "Joscar Turf sells farm-fresh sod for pickup in Arvada and delivery across the Denver metro. Buyers want to know three things: is it fresh, what blend, and can I get it today. The homepage answers all three before the first scroll.",
    decisions: [
      { title: "Call and text buttons", body: "Contractors prefer texting an order, so “Text Us” sits next to the phone number." },
      { title: "Blends explained in plain words", body: "Kentucky bluegrass for shade, sun and traffic; fescue for drought tolerance — written for homeowners, not agronomists." },
      { title: "Pickup address in the header", body: "The yard address is visible on every page so pickup customers don't have to hunt." },
    ],
    delivered: ["Website design & build", "Local SEO structure"],
  },
  {
    slug: "ares-tire-and-auto",
    name: "Ares Tire & Auto",
    url: "https://arestireandauto.com",
    category: "local",
    industry: "Tires & auto repair",
    location: "Arvada, Colorado",
    promise: "Arvada's most trusted shop — used and new tires plus brakes, shocks and rims.",
    overview:
      "Ares Tire & Auto sells new and used tires and handles light-duty repairs in Arvada. The site keeps the decision simple: honest pricing, a call button and an online appointment booking.",
    decisions: [
      { title: "Book appointment as the primary action", body: "Appointments fill the bay schedule; the phone number is still in the header for walk-in questions." },
      { title: "Used tires named up front", body: "Budget buyers search for used tires specifically — it's in the first sentence." },
      { title: "Dark, mechanical visual tone", body: "Real shop photography matches the trade instead of glossy dealership imagery." },
    ],
    delivered: ["Website design & build", "Local SEO structure"],
  },
  {
    slug: "cleardump",
    name: "ClearDump",
    url: "https://www.cleardump.com",
    category: "local",
    industry: "Pressure washing",
    location: "Grayson, Snellville & Gwinnett County, Georgia",
    promise: "Make the outside of your property feel cared for.",
    overview:
      "ClearDump launched driveway cleaning and soft house washing across Grayson, Snellville and nearby Gwinnett communities. A new company has no reviews yet, so the site leads with a launch offer and a clear daily availability window.",
    decisions: [
      { title: "Launch special in the hero", body: "A $150 driveway launch price gives first customers a reason to try a new company." },
      { title: "Call/text and estimate side by side", body: "Two actions cover both the quick-question and the formal-quote visitor." },
      { title: "Service area in the eyebrow", body: "Driveway cleaning · soft house washing · Gwinnett County — the three facts a local searcher checks first." },
    ],
    delivered: ["Website design & build", "Ad creative", "Local SEO structure"],
  },
  {
    slug: "1stikk-mobile",
    name: "1 Stikk Mobile",
    url: "https://1stikkmobile.com",
    category: "local",
    industry: "Mobile phlebotomy & drug testing",
    promise: "Mobile blood draws, drug testing and wellness care at your door.",
    overview:
      "1 Stikk Mobile brings certified collection professionals to homes, workplaces and facilities, and also trains new drug-screen collectors through a $75 mock-kit program. The site serves both audiences without confusing either.",
    decisions: [
      { title: "Call to book or book online", body: "Patients choose the channel they're comfortable with; both buttons sit under the headline." },
      { title: "Training as its own navigation item", body: "Career-changers find the certification path without wading through patient services." },
      { title: "Availability promise", body: "Open 24 hours, 7 days a week appears in the hero — the deciding factor for urgent testing." },
    ],
    delivered: ["Website design & build", "Ad creative (2 sets)", "Training-program funnel"],
  },
  {
    slug: "beyond-labels-gifts",
    name: "Beyond Labels Gifts",
    url: "https://beyondlabelsgifts.com",
    category: "shopify",
    industry: "Jewelry & gifts",
    promise: "Eternal Hope Necklace — a gift box and message card included.",
    overview:
      "Beyond Labels Gifts sells sentimental jewelry gifts. The product page does the selling: finish selection, what's in the box, and a secure checkout in one view — no wandering through a catalog.",
    decisions: [
      { title: "Finish picker with prices", body: "18K yellow gold and 14K white gold are shown as cards with the price on each, so the choice feels like progress, not a form." },
      { title: "Everything included, listed", body: "Gift box, message card, two finishes, secure checkout — answered before the buyer asks." },
      { title: "Sticky “ready to checkout” card", body: "A floating summary keeps the next step visible while the buyer scrolls the gallery." },
    ],
    delivered: ["Store design & product page", "Ad creative", "Checkout flow"],
  },
  {
    slug: "focusmode-shop",
    name: "FocusMode",
    url: "https://focusmodeshop.com",
    category: "shopify",
    industry: "Focus supplements",
    promise: "Everything you need to stay locked in.",
    overview:
      "FocusMode sells a focus supplement. Supplements live or die on whether a shopper understands what's inside, so the homepage explains six benefits around the product in a single diagram before asking for the sale.",
    decisions: [
      { title: "Benefit map around the product", body: "Mental clarity, decision routine, memory, botanical support, no synthetic stimulants and structured focus orbit the capsule." },
      { title: "One yellow action", body: "“Shop Now” in the header and “Unlock all 6 benefits” below the diagram are the only bright buttons on the page." },
      { title: "Articles in the main nav", body: "Educational content supports search traffic for focus and productivity questions." },
    ],
    delivered: ["Store design & build", "Product storytelling", "Content structure for SEO"],
  },
  {
    slug: "ryan-pool",
    name: "Ryan Pool Enagic",
    url: "https://www.ryanpoolsr.com",
    category: "brand",
    industry: "Enagic water systems",
    promise: "Start with the K8, then protect the space around it.",
    overview:
      "Ryan Pool helps families start with Enagic's Leveluk K8 for daily hydration and add EmGuarde for the home. We built the site and ran the Meta lead campaign: 29 leads at $4.89 each — 35% under Meta's peer median.",
    decisions: [
      { title: "A two-product starter path", body: "K8 first, EmGuarde second — a clear order instead of a full catalog." },
      { title: "Book a free call as the main action", body: "High-ticket water systems sell on a conversation, so the call button is primary and product pages are secondary." },
      { title: "Global proof numbers", body: "51+ countries and 40+ years of Enagic history give context without inventing personal claims." },
    ],
    delivered: ["Website design & build", "Meta lead-form ads", "Ad creative (2 sets)"],
  },
  {
    slug: "true-legacy",
    name: "True Legacy",
    url: "https://www.truelegacyworld.com",
    category: "brand",
    industry: "Global wellness business network",
    promise: "Creating true health around the world.",
    overview:
      "True Legacy is a global team of coaches sharing Kangen water machines and emGuarde, organised into regional teams across North America, Latin America, Europe, Africa, the Middle East and Asia. The site turns that spread into an interactive map so visitors join the right regional team.",
    decisions: [
      { title: "Pick-your-region map", body: "Visitors choose their continent and land with the team leader who speaks their language." },
      { title: "Scale numbers up top", body: "51+ countries and 8 regional teams answer “is this real?” before the pitch." },
      { title: "Two audiences, one page", body: "Wellness buyers and would-be team members both get a path." },
    ],
    delivered: ["Website design & build", "Multi-region information architecture"],
  },
  {
    slug: "mehdi-cohen",
    name: "Mehdi Cohen",
    url: "https://www.mehdicohen.com",
    category: "brand",
    industry: "Personal brand & leadership",
    promise: "Build your legacy. Own your freedom.",
    overview:
      "Mehdi Cohen's personal site tells his story from immigrant beginnings to building a legacy, and hands visitors the same blueprint. It serves English and Spanish audiences from the first screen.",
    decisions: [
      { title: "Language choice before anything else", body: "English and Español buttons sit in the hero so Latin American visitors aren't lost on page one." },
      { title: "First-person story", body: "The intro is written in his voice, which is what a personal brand is selling." },
      { title: "Full-body portrait as the anchor", body: "A confident, open-arms photo gives the page a human centre instead of graphics." },
    ],
    delivered: ["Personal brand website", "Bilingual structure"],
  },
  {
    slug: "swole-jd",
    name: "Swole JD",
    url: "https://swolejd.com",
    category: "brand",
    industry: "Physique coaching",
    promise: "I'm JD. I changed my life — ex-firefighter turned elite physique coach.",
    overview:
      "JD went from burnt out to built and coaches others through the same change. The site puts his own before-and-after front and centre, then routes visitors to coaching, a money-making program or his anti-aging water.",
    decisions: [
      { title: "Before/after as the hero", body: "The transformation is the offer, so it's the first thing anyone sees." },
      { title: "Short, first-person headline", body: "“I'm JD. I changed my life.” — five words that do the work of a paragraph." },
      { title: "Separate menu paths", body: "Water, coaching and make-money each have their own page so one audience isn't pitched another's product." },
    ],
    delivered: ["Website design & build", "Offer structure"],
  },
  {
    slug: "layne-fitness",
    name: "Layne Fitness",
    url: "https://laynefitness.com",
    category: "brand",
    industry: "Fitness coaching & nutrition",
    promise: "Plan. Train. Adjust. — built around your real life.",
    overview:
      "Layne Fitness offers coaching and nutrition plans that fit around work and family. The site starts by asking the visitor what result they want, which turns a brochure into the first step of a consultation.",
    decisions: [
      { title: "“Tell Layne the result you want”", body: "An intake prompt right after the hero starts the coaching conversation on the page." },
      { title: "Book a call in the header", body: "A single orange button stays visible on every page." },
      { title: "Results and articles in the nav", body: "Proof and education pages support both trust and search traffic." },
    ],
    delivered: ["Website design & build", "Ad creative", "Lead intake flow"],
  },
  {
    slug: "7uvhavin",
    name: "7UVHAVIN",
    url: "https://7uvhavin.com",
    category: "artist",
    industry: "Artist, producer & engineer",
    location: "Atlanta, Georgia",
    promise: "Atlanta's own — artist, producer, engineer.",
    overview:
      "7UVHAVIN needed one link that does more than a link-in-bio page: show the music, the person and the credibility, then push fans to stream and follow. The neon type treatment is built from his own brand look.",
    decisions: [
      { title: "Stream Now and Follow side by side", body: "The two actions that grow an artist's numbers are the only buttons in the hero." },
      { title: "Listen button in the header", body: "Every page can start the music in one tap." },
      { title: "Artist, producer, engineer in one line", body: "Collaborators and labels see every role he plays immediately." },
    ],
    delivered: ["Artist website", "Brand visual system", "Streaming & social funnels"],
  },
  {
    slug: "bigzo",
    name: "BIGZO",
    url: "https://bigzomusic.com",
    category: "artist",
    industry: "Hip-hop artist",
    promise: "Global hip-hop artist — new single out now.",
    overview:
      "BIGZO's site is built around a release: the new single, a Spotify button and upcoming events. We also ran his profile-growth ads — 165 profile and page visits at $0.32 each, 62% under Meta's peer median.",
    decisions: [
      { title: "Release date in the hero", body: "A dated single announcement gives fans a reason to come back and stream on day one." },
      { title: "Book BIGZO in the nav", body: "Promoters and venues get a direct booking path instead of DMing." },
      { title: "Gold-on-black brand system", body: "One accent colour across site, cover art and ads so every touchpoint looks like the same artist." },
    ],
    delivered: ["Artist website", "Meta profile-growth ads", "Release funnel"],
  },
  {
    slug: "yari-beats",
    name: "YARI",
    url: "https://yariwtf.com",
    category: "artist",
    industry: "Music producer",
    location: "Atlanta, Georgia",
    promise: "Make the song they can't file away.",
    overview:
      "YARI is a producer working with artists in Atlanta and remotely. The site sells two things — beats and production sessions — and gives each its own button so artists know exactly what to do next.",
    decisions: [
      { title: "Two clear money buttons", body: "“Buy Beats” for artists ready now and “Work with Yari” for full productions." },
      { title: "Book a production call in the hero", body: "Bigger projects start with a call, so it's the primary action under the headline." },
      { title: "Editorial poster typography", body: "Heavy condensed type and collage photos match the music instead of a template look." },
    ],
    delivered: ["Producer website", "Beat store structure", "Booking funnel"],
  },
];

export const clientBySlug = (slug: string) => CLIENTS.find((c) => c.slug === slug);
export const clientsIn = (category: Category) => CLIENTS.filter((c) => c.category === category);
export const domainOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
