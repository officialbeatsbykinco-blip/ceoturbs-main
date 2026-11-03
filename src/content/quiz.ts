// Brand Boost quiz: the tap-to-answer questions in front of the booking calendar.
// Answers go to the "Call Quiz Leads" sheet tab (api/lead.js), ride along on the Cal.com booking
// (hidden fields + metadata → api/cal-webhook.js) and pick the "#1 money move" shown before booking.

export type Audience = "local" | "artist" | "store" | "other";
export type Stage = "start" | "grow";
export type GoalKey = "calls" | "reviews" | "visibility" | "website" | "sales" | "fans" | "shows" | "launch";
export type Budget = "under-500" | "500-2000" | "2000-5000" | "5000-plus" | "unsure";
export type Timeline = "asap" | "30-days" | "months" | "exploring";

export type Answers = {
  audience?: Audience;
  stage?: Stage;
  goal?: GoalKey;
  blockers: string[];
  budget?: Budget;
  timeline?: Timeline;
  business: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
};

export const EMPTY_ANSWERS: Answers = { blockers: [], business: "", website: "", name: "", email: "", phone: "", smsOptIn: false };

export type IconKey = "wrench" | "mic" | "bag" | "building" | "phone" | "star" | "search" | "globe" | "cart" | "users" | "ticket" | "clock" | "zap" | "calendar" | "compass" | "wallet" | "rocket" | "trending";

export const AUDIENCES: { id: Audience; label: string; sub: string; icon: IconKey; word: string }[] = [
  { id: "local", label: "Local service business", sub: "Plumber, barber, cleaner, contractor…", icon: "wrench", word: "customers" },
  { id: "artist", label: "Artist or creator", sub: "Singer, rapper, producer, DJ…", icon: "mic", word: "listeners" },
  { id: "store", label: "Online store", sub: "Shopify or any e-commerce shop", icon: "bag", word: "sales" },
  { id: "other", label: "Another kind of business", sub: "Coach, restaurant, agency, studio…", icon: "building", word: "customers" },
];

/** Question 2: starting out or growing. Worded for what they do, so it reads like their own words. */
export const STAGES: Record<Audience, { id: Stage; label: string; sub: string; icon: IconKey }[]> = {
  local: [
    { id: "start", label: "Starting a new business", sub: "Launching, or open less than a year", icon: "rocket" },
    { id: "grow", label: "Growing my business", sub: "Up and running — I want more customers", icon: "trending" },
  ],
  artist: [
    { id: "start", label: "Just starting out", sub: "First releases, building my name", icon: "rocket" },
    { id: "grow", label: "Growing my fanbase", sub: "Releasing music — I want more listeners", icon: "trending" },
  ],
  store: [
    { id: "start", label: "Launching my store", sub: "Not selling yet, or just started", icon: "rocket" },
    { id: "grow", label: "Growing my store", sub: "Already selling — I want more sales", icon: "trending" },
  ],
  other: [
    { id: "start", label: "Starting a new business", sub: "Launching, or open less than a year", icon: "rocket" },
    { id: "grow", label: "Growing my business", sub: "Up and running — I want more customers", icon: "trending" },
  ],
};

const G = (key: GoalKey, label: string, icon: IconKey) => ({ key, label, icon });
type Goal = ReturnType<typeof G>;

/** Goals depend on what they do AND whether they are starting or growing. */
export const GOALS: Record<Audience, Record<Stage, Goal[]>> = {
  local: {
    start: [G("launch", "A logo, brand & website to launch with", "globe"), G("calls", "My first customers & calls", "phone"), G("visibility", "Show up on Google Maps from day one", "search"), G("reviews", "Get my first 5-star reviews", "star")],
    grow: [G("calls", "More calls & bookings", "phone"), G("reviews", "More 5-star Google reviews", "star"), G("visibility", "Show up on Google Maps & ChatGPT", "search"), G("website", "A website that wins customers", "globe")],
  },
  artist: {
    start: [G("launch", "Build my artist brand & website", "globe"), G("fans", "Get my first real listeners", "users"), G("visibility", "Show up when people Google me", "search"), G("shows", "Land my first shows & features", "ticket")],
    grow: [G("fans", "More listeners & streams", "users"), G("visibility", "Be the top result when people Google me", "search"), G("shows", "More bookings & shows", "ticket"), G("website", "An artist website that sells", "globe")],
  },
  store: {
    start: [G("launch", "Launch a store that converts", "globe"), G("sales", "Get my first sales", "cart"), G("visibility", "Show up on Google Shopping", "search"), G("reviews", "Build trust with reviews", "star")],
    grow: [G("sales", "More sales", "cart"), G("visibility", "Show up on Google Shopping & ChatGPT", "search"), G("reviews", "More reviews & trust", "star"), G("website", "A store that converts better", "globe")],
  },
  other: {
    start: [G("launch", "A logo, brand & website to launch with", "globe"), G("calls", "My first customers & leads", "phone"), G("visibility", "Show up on Google from day one", "search"), G("reviews", "Get my first reviews", "star")],
    grow: [G("calls", "More customers & leads", "phone"), G("reviews", "More reviews & trust", "star"), G("visibility", "Show up on Google & ChatGPT", "search"), G("website", "A website that converts", "globe")],
  },
};

const START_BLOCKERS = ["No website or logo yet", "Don't know where to start", "Not on Google yet", "Small budget to start", "No time for marketing"];

export const BLOCKERS: Record<Audience, Record<Stage, string[]>> = {
  local: {
    start: START_BLOCKERS,
    grow: ["No website, or an old one", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
  },
  artist: {
    start: ["No artist website or brand yet", "Don't know how to promote a release", "Low streams so far", "Small budget to start", "No time for marketing"],
    grow: ["No artist website", "Low streams or engagement", "Ads cost too much or don't work", "Hard to find on Google", "No time for marketing", "Not sure what's wrong"],
  },
  store: {
    start: ["Store isn't built or set up yet", "No traffic yet", "Don't know which ads to run", "No reviews yet", "Small budget to start"],
    grow: ["Traffic but few sales", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
  },
  other: {
    start: START_BLOCKERS,
    grow: ["No website, or an old one", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
  },
};

export const goalsFor = (a?: Audience, s?: Stage) => GOALS[a ?? "local"][s ?? "grow"];
export const blockersFor = (a?: Audience, s?: Stage) => BLOCKERS[a ?? "local"][s ?? "grow"];

/**
 * `value` is what a lead at this budget is worth to the business, sent with the Lead event so
 * Meta, Google Ads and Microsoft can bid for the leads that turn into clients. A booked call is
 * worth CALL_MULTIPLIER × that. Change these numbers once you know your real close rates.
 */
export const BUDGETS: { id: Budget; label: string; value: number }[] = [
  { id: "under-500", label: "Under $500", value: 10 },
  { id: "500-2000", label: "$500 to $2,000", value: 50 },
  { id: "2000-5000", label: "$2,000 to $5,000", value: 150 },
  { id: "5000-plus", label: "$5,000+", value: 300 },
  { id: "unsure", label: "Not sure yet", value: 10 },
];
export const CALL_MULTIPLIER = 3;

export const TIMELINES: { id: Timeline; label: string; icon: IconKey }[] = [
  { id: "asap", label: "ASAP — this week", icon: "zap" },
  { id: "30-days", label: "Within 30 days", icon: "calendar" },
  { id: "months", label: "In the next few months", icon: "clock" },
  { id: "exploring", label: "Just exploring", icon: "compass" },
];

/** The tap steps before contact details; the progress bar counts these plus business + contact. */
// Three taps/fields to the calendar: what you do, what you want, who you are. Stage defaults to "grow" and
// budget/timeline/blockers are left to the call itself (every extra question costs bookings).
export const QUIZ_STEPS = ["audience", "goal", "contact"] as const;
export type QuizStep = (typeof QUIZ_STEPS)[number] | "result";

export const leadValue = (b?: Budget) => BUDGETS.find((x) => x.id === b)?.value ?? 10;
export const labelOf = {
  audience: (a?: Audience) => AUDIENCES.find((x) => x.id === a)?.label ?? "",
  stage: (a?: Audience, s?: Stage) => (a && s && STAGES[a].find((x) => x.id === s)?.label) || "",
  goal: (a?: Audience, g?: GoalKey, s?: Stage) => (a && goalsFor(a, s).find((x) => x.key === g)?.label) || "",
  budget: (b?: Budget) => BUDGETS.find((x) => x.id === b)?.label ?? "",
  timeline: (t?: Timeline) => TIMELINES.find((x) => x.id === t)?.label ?? "",
};

/**
 * Cal.com booking-form options (hidden fields on the event type). Kept identical to the labels
 * above so a prefilled select value is always a valid option.
 */
export const CAL_GOAL_OPTIONS = ["More calls and bookings", "Show up on Google and AI answers", "Sell more products", "Something else"];
const CAL_GOAL: Record<GoalKey, string> = {
  calls: "More calls and bookings",
  shows: "More calls and bookings",
  visibility: "Show up on Google and AI answers",
  sales: "Sell more products",
  reviews: "Something else",
  website: "Something else",
  fans: "Something else",
  launch: "Something else",
};
export const calGoal = (g?: GoalKey) => (g ? CAL_GOAL[g] : undefined);
export const calBudget = (b?: Budget) => (b && b !== "unsure" ? labelOf.budget(b) : undefined);

const TEXT_WHO: Record<Audience, string> = { local: "I run a local service business", artist: "I'm an artist or creator", store: "I run an online store", other: "I run a business" };

/** The message the text quiz fills in for the visitor to send. */
export function textMessage(a: Answers) {
  const name = a.name.trim();
  return [
    `Hi CEO Turbo!${name ? ` I'm ${name}.` : ""}`,
    a.audience && `${TEXT_WHO[a.audience]}${a.stage === "start" ? " and I'm just starting out" : ""}.`,
    a.goal && `What I want: ${labelOf.goal(a.audience, a.goal, a.stage)}.`,
    a.timeline && `Timing: ${labelOf.timeline(a.timeline)}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export type Move = { title: string; body: string; points: string[]; offer?: "cards" | "audit" };

/** The single most valuable next step for these answers — shown before the calendar. */
export function moneyMove(a: Answers): Move {
  const has = (s: string) => a.blockers.includes(s);
  const word = AUDIENCES.find((x) => x.id === a.audience)?.word ?? "customers";
  const small = a.budget === "under-500" || a.timeline === "exploring";
  let m: Move;
  if (a.stage === "start") {
    m = launchMove(a, word);
    if (has("Small budget to start") || a.budget === "under-500") m.offer = m.offer ?? (a.audience === "local" || a.audience === "other" ? "cards" : "audit");
    return m;
  }
  switch (a.goal) {
    case "reviews":
      m = {
        title: "Get 5-star reviews on autopilot",
        body: "More reviews means more trust and a higher spot on Google Maps. We set up the ask so happy customers leave a review before they walk out.",
        points: ["A Google profile tune-up so reviews turn into calls", "A tap-to-review card at the counter — one tap opens your review form", "A simple follow-up text for customers who forget"],
        offer: "cards",
      };
      break;
    case "visibility":
      m = {
        title: "Get named by Google and ChatGPT",
        body: `People now ask Google and AI assistants who to pick. We make sure the answer is you, so more ${word} find you without paying for every click.`,
        points: ["Fix what stops Google from ranking you", "Answer-ready pages that AI assistants quote", "A Google profile and listings that agree everywhere"],
        offer: "audit",
      };
      break;
    case "website":
      m = {
        title: "A site built to turn visitors into " + word,
        body: "Most sites look fine and still leak customers. We show you where yours loses people and what a page that converts looks like.",
        points: ["A clear offer above the fold", "One-tap call, booking or buy buttons", "Fast on phones and set up to rank"],
      };
      break;
    case "sales":
      m = {
        title: "Make every visitor worth more",
        body: "More traffic only helps if it buys. We fix the product page and checkout first, then send ads to a store that converts.",
        points: ["Product pages that answer objections", "Reviews and trust where people decide", "Ads aimed at buyers, not browsers"],
      };
      break;
    case "fans":
    case "shows":
      m = {
        title: a.goal === "shows" ? "Become the artist promoters book" : "Turn listeners into a fanbase",
        body: "Streams come and go. Fans who find you on Google, follow you and join your list stay — and they buy tickets and merch.",
        points: ["Own your name on Google", "A release page that grows your list", "Ads that bring real listeners, not bots"],
        offer: "audit",
      };
      break;
    default:
      m = {
        title: "Turn searches into phone calls",
        body: `People are searching for what you do right now. We make sure they find you first and have a reason to call — then add ads that bring ${word} on demand.`,
        points: ["A Google profile that wins the map pack", "A call-first page that turns visitors into leads", "Lead ads with a real follow-up so no lead goes cold"],
      };
  }
  if (has("Ads cost too much or don't work")) m.points = [...m.points.slice(0, 2), "Why your ads cost too much — and the fix for the offer, page and follow-up"];
  if (small && !m.offer) m.offer = a.audience === "local" || a.audience === "store" ? "cards" : "audit";
  return m;
}

/** Starters: the first moves that matter most when there is nothing to optimize yet. */
function launchMove(a: Answers, word: string): Move {
  const artist = a.audience === "artist";
  const store = a.audience === "store";
  switch (a.goal) {
    case "launch":
      return {
        title: artist ? "Launch your artist brand the right way" : store ? "Launch a store built to sell" : "Launch right: brand, site & Google from day one",
        body: artist
          ? "Fans decide in seconds whether you look legit. We build the brand, the site and the links so the first people who hear you can follow, stream and stay."
          : `New ${store ? "stores" : "businesses"} win by looking established on day one. We set up the brand, the site and the listings together, so your first ${word} trust you instantly.`,
        points: artist
          ? ["A logo, artist photos and a look that's yours", "An artist website with your music, links and email list", "Your name set up on Google, Spotify and socials"]
          : store
            ? ["A store and product pages that answer every question", "Checkout, reviews and trust badges where buyers decide", "Set up for Google Shopping and ads from launch"]
            : ["A logo and brand that look established", "A one-page site with a tap-to-call button", "A Google Business Profile so you show up on Maps"],
        offer: artist || store ? "audit" : "cards",
      };
    case "visibility":
      return {
        title: artist ? "Own your name on Google from release one" : "Get found on Google from day one",
        body: `Most new ${artist ? "artists" : "businesses"} are invisible for months. We get you listed, verified and answer-ready so the first people searching find you — not a competitor.`,
        points: artist ? ["Your name on Google, Spotify and socials, all linked", "A simple site Google can trust", "Press and features that build your name"] : ["Google Business Profile set up and verified", "Listings that match everywhere (Apple, Bing, Yelp)", "Pages Google and ChatGPT can quote"],
        offer: "audit",
      };
    case "reviews":
      return {
        title: "Earn your first 5-star reviews fast",
        body: "Your first 10 reviews do more for new customers than any ad. We make asking for them automatic, so every happy customer leaves one.",
        points: ["A Google profile ready to collect reviews", "A tap-to-review card at the counter", "A simple text that asks at the right moment"],
        offer: "cards",
      };
    case "shows":
      return {
        title: "Land your first shows and features",
        body: "Promoters book artists who look ready. We build the press kit, the site and the proof that gets you the yes.",
        points: ["A one-page press kit with your best music", "Your name ranking on Google", "Ads that grow real local fans before the show"],
        offer: "audit",
      };
    default:
      return {
        title: artist ? "Get your first real listeners" : store ? "Get your first sales" : `Land your first 10 ${word}`,
        body: artist
          ? "Release day is the start, not the finish. We aim small, smart ads at people who already love your sound, and turn them into followers."
          : `You don't need a big budget to get your first ${word}. You need one clear offer, a page that converts and ads aimed at people ready to ${store ? "buy" : "call"}.`,
        points: artist ? ["A release page that grows your email list", "Small-budget ads aimed at real fans", "Content that keeps new listeners coming back"] : ["One clear offer people say yes to", store ? "A product page that converts" : "A call-first page with one-tap booking", "Small-budget ads aimed at ready buyers"],
        offer: artist ? "audit" : undefined,
      };
  }
}
