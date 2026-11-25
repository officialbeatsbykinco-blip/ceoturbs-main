// Florida (Tampa Bay & Central Florida) installation landing pages (Google Search ads + local SEO): computer setup, security cameras and
// Wi-Fi/internet. One template (pages/InstallPage.tsx), one quiz (components/tech/InstallQuiz.tsx).
// Prices come from content/pricing.ts so the page, its schema and the ads agree. Cameras have no set price yet.
import { FPS_BOOKING, SITE, type CalEvent } from "@/config/site";
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import { INSTALL_PRICES, IT_SERVICES, PHONE_REPAIR, RECYCLING_PRICES, SETUP, usd, type PriceItem } from "@/content/pricing";
import type { FAQ } from "@/content/services";

export type Choice = { id: string; label: string };
export type Question = { id: string; label: string; /** Label in the text message ("Cameras: 3–4"). */ short: string; options: Choice[] };

export type InstallPage = {
  slug: string;
  path: string;
  /** Short name used in nav, breadcrumbs, the lead sheet and Meta/Google content_name. */
  name: string;
  /** Sentence-case service name for the quiz text ("security camera installation"). */
  service: string;
  category: string;
  chip: string;
  h1: [string, string];
  lede: string;
  prices: PriceItem[];
  /** Shown when there is no fixed price yet. */
  priceNote?: string;
  /** Step 1: what do you need (pick all that apply). */
  jobs: Choice[];
  /** Step 2: one screen of quick chip questions. */
  questions: Question[];
  includes: string[];
  steps: { title: string; body: string }[];
  faqs: FAQ[];
  /** What a lead is worth to the ad platforms (an average first job). */
  value: number;
  /**
   * "business": a Google Ads landing page. Google bans ads for consumer tech services but allows them for
   * services sold only to businesses, so this page talks to businesses only and links to no consumer page.
   */
  audience?: "business";
  /** Its own Cal.com event for the desktop calendar (default: the install event). */
  booking?: CalEvent;
  /** Remote work is offered: a ZIP is only asked for when this question's answer is the in-person option. */
  remote?: { question: string; inPerson: string };
  /** Hero check list (default: the in-home promises). */
  promises?: string[];
  /** Lede over the price list (default: labor per unit, equipment at cost). */
  pricesLede?: string;
  /** Lede over the service-area list. */
  areaLede?: string;
  /** Service name in the LocalService schema (default: "<service> in Tampa Bay & Central Florida"). */
  schemaName?: string;
  /** Quiz and button wording when the page isn't asking for a price (default: DEFAULT_WORDS). */
  words?: Partial<QuizWords>;
  /** Calls and texts first: desktop gets the quiz (we text back) instead of the calendar, phones get a Text button. */
  textFirst?: { sms: string };
  /** Plain-language explainer cards (why it matters), for people and AI answers. */
  facts?: { title: string; body: string }[];
  /** Cities we drive to past the normal service area, on request (listed on the page and in areaServed). */
  farther?: { lede: string; cities: string[] };
  /** Tap-to-check "Can you take my…?" items: yes, text a photo first, or no. */
  accepts?: { item: string; ok: "yes" | "photo" | "no" }[];
  seo: { title: string; description: string };
};

export type QuizWords = { cta: string; jobs: string; title: string; ask: string; where: string; submit: string; sent: string };
export const DEFAULT_WORDS: QuizWords = {
  cta: "Get my price",
  jobs: "What do you need?",
  title: "Get your price",
  ask: "", // filled per page: "Hi Chris! I'd like a price for <service>."
  where: "Where do we text your price?",
  submit: "Text me my price",
  sent: "We'll text you a price shortly. Want a set time now? Pick one below.",
};
export const quizWords = (page: InstallPage): QuizWords => ({ ...DEFAULT_WORDS, ask: `Hi Chris! I'd like a price for ${page.service}.`, ...page.words });

/** True when the quiz needs a ZIP: every in-person job, and remote-capable pages only when they pick in person. */
export const needsZip = (page: Pick<InstallPage, "remote">, a: Pick<InstallAnswers, "picks">) => !page.remote || a.picks[page.remote.question] === page.remote.inPerson;

const byId = (list: PriceItem[], id: string) => list.find((p) => p.id === id)!;
const CITY_LIST = `${ALL_SETUP_CITIES.slice(0, -1).join(", ")} and ${ALL_SETUP_CITIES[ALL_SETUP_CITIES.length - 1]}`;
const WHERE_FAQ = (what: string): FAQ => ({ q: "Where do you come to?", a: `${what} anywhere in Tampa Bay and Central Florida, within about 1.5 hours of Temple Terrace: ${CITY_LIST}. Somewhere else in Florida? Text your ZIP code and we'll confirm.` });
const PAY_FAQ: FAQ = { q: "How do I pay?", a: "After the job is done and you've checked it works. Card, cash, Zelle or Cash App." };
const PLACE: Question = { id: "place", label: "Is it for a home or a business?", short: "For", options: [{ id: "home", label: "Home" }, { id: "business", label: "Business" }] };

const setupBasic = byId(SETUP, "office-basic");
const setupHome = byId(SETUP, "office-home");
const wifiFix = byId(IT_SERVICES, "it-wifi");
const wifiMesh = byId(IT_SERVICES, "it-mesh");
const ip = (id: string) => byId(INSTALL_PRICES, id);
const station = byId(SETUP, "office-complete");

export const INSTALL_PAGES: InstallPage[] = [
  {
    slug: "computer-setup",
    path: "/computer-setup-tampa",
    name: "Computer setup Tampa",
    service: "computer setup",
    category: "computer_setup",
    chip: "Tampa Bay to Orlando · homes & businesses",
    h1: ["New computer or monitors?", "We set it all up, anywhere in Central Florida."],
    lede: "New computer unboxed and ready, files moved from the old one, monitors and printer connected and every cable tidy. We come to your home or business and you get the price before we start.",
    prices: [{ ...setupBasic, name: "Computer setup (first computer)", summary: "Unboxed, updated, software and printer set up, and your files moved over. Labor only." }, ip("setup-extra"), ip("monitor-mount"), setupHome, { ...station, name: "Business workstation (per station)", summary: "Computer, monitors, cables, network and printer at one desk, labor only." }],
    jobs: [
      { id: "new", label: "Set up a new computer" },
      { id: "transfer", label: "Move files from my old computer" },
      { id: "monitors", label: "Connect or mount monitors" },
      { id: "printer", label: "Printer, email or Microsoft 365" },
      { id: "desk", label: "Full desk setup & cable cleanup" },
      { id: "several", label: "Several computers for a business" },
    ],
    questions: [
      { id: "count", label: "How many computers?", short: "Computers", options: [{ id: "1", label: "1" }, { id: "2-3", label: "2–3" }, { id: "4+", label: "4 or more" }] },
      PLACE,
    ],
    includes: ["Unboxing, updates and accounts signed in", "Files, photos and email moved from the old computer", "Monitors connected (or mounted) and set up right", "Printer, Wi-Fi and Microsoft 365 or Google working", "Cables routed and tidy", "A walkthrough before we leave"],
    steps: [
      { title: "Tell us what you have", body: "Tap a few answers or call. New computer, how many, home or business." },
      { title: "Price up front", body: "You get the price by text before we come. No surprises." },
      { title: "Ready to use", body: "We set it up at your place, show you how it works, then you pay." },
    ],
    faqs: [
      { q: "How much does computer setup cost?", a: `${usd(setupBasic.price)} for the first computer (unboxing, updates, software, printer and your files moved over) and ${usd(ip("setup-extra").price)} for each extra computer on the same visit. Monitor arms or wall mounts are ${usd(ip("monitor-mount").price)} per monitor. A business workstation with computer, monitors, cables, network and printer is ${usd(station.price)} per station. Labor only; you get the total before we start.` },
      { q: "Can you move everything from my old computer?", a: "Yes. Files, photos, bookmarks and email move to the new computer, and we check it all opened before we leave. We don't open or copy anything you don't ask us to." },
      { q: "Do you set up computers for businesses?", a: `Yes. Offices, shops, clinics and restaurants: ${usd(station.price)} per workstation with computer, monitors, cables, network and printer. Shared printers, Wi-Fi and Microsoft 365 or Google Workspace too. A whole office gets one flat written quote.` },
      { q: "Can you hook up two or three monitors?", a: "Yes. We connect and arrange multiple monitors, mount them on arms or the wall if you want, and set the display settings so everything lines up." },
      { q: "Do I need to buy anything first?", a: "Just the computer and anything you want installed. Not sure what to buy? Text us and we'll tell you what to get before the visit." },
      WHERE_FAQ("We set up computers"),
      PAY_FAQ,
    ],
    value: 130,
    seo: {
      title: "Computer Setup: Tampa, St. Pete, Clearwater, Brandon & More",
      description: `New computer set up, files moved, monitors and printers at your door in Tampa, St. Pete, Clearwater, Brandon, Lakeland and Orlando. From ${usd(setupBasic.price)}.`,
    },
  },
  {
    slug: "security-camera-installation",
    path: "/security-camera-installation-tampa",
    name: "Doorbell & cameras Tampa",
    service: "doorbell and camera installation",
    category: "security_cameras",
    chip: "Tampa Bay to Orlando · homes & businesses",
    h1: ["Video doorbells & cameras", "installed across Central Florida."],
    lede: "Ring, Nest, Blink or Wyze doorbells and Wi-Fi cameras installed, connected and set up on your phone so you can see who's there from anywhere. Homes and businesses from Tampa Bay to Orlando, Lakeland and Sarasota. Price up front.",
    prices: [ip("cam-doorbell"), ip("cam-wifi")],
    priceNote: `Example: a video doorbell plus 2 Wi-Fi cameras is ${usd(ip("cam-doorbell").price + 2 * ip("cam-wifi").price)} in labor. We install doorbells and cameras that mount from the ground or a step stool (front door, porch, garage, indoors). No second-story, roofline or wired systems. The gear is yours, or we tell you exactly what to buy.`,
    jobs: [
      { id: "doorbell", label: "Install a video doorbell" },
      { id: "indoor", label: "Indoor cameras" },
      { id: "porch", label: "Porch, garage or patio cameras" },
      { id: "app", label: "Set up the app & alerts on my phone" },
      { id: "fix", label: "Fix or move a camera I already have" },
    ],
    questions: [
      { id: "brand", label: "Which brand?", short: "Brand", options: [{ id: "ring", label: "Ring" }, { id: "nest", label: "Google Nest" }, { id: "blink", label: "Blink or Wyze" }, { id: "unsure", label: "Help me pick" }] },
      { id: "count", label: "How many devices?", short: "Devices", options: [{ id: "1", label: "1" }, { id: "2-3", label: "2–3" }, { id: "4+", label: "4 or more" }] },
      PLACE,
    ],
    includes: ["Video doorbell mounted and wired to your chime", "Wi-Fi cameras placed where you need them", "The app set up on your phone, alerts working", "Family or staff phones added if you want", "Everything tested before we leave", "We tell you what to buy if you don't have it yet"],
    steps: [
      { title: "Tell us what you have", body: "Doorbell, cameras, which brand. A few taps or a call." },
      { title: "Price up front", body: "You get the price by text before we come. Not sure what to buy? We'll tell you." },
      { title: "See it on your phone", body: "We install, connect and test every device with you, then you pay." },
    ],
    faqs: [
      { q: "How much does doorbell or camera installation cost?", a: `${usd(ip("cam-doorbell").price)} for a video doorbell and ${usd(ip("cam-wifi").price)} per Wi-Fi camera, labor only. A doorbell plus 2 cameras is ${usd(ip("cam-doorbell").price + 2 * ip("cam-wifi").price)}. You get the total before we start.` },
      { q: "Do you install Ring doorbells?", a: "Yes. Ring, Google Nest, Blink, Wyze and most other video doorbells: mounted, wired to your existing chime where it has one, connected to Wi-Fi and set up in the app." },
      { q: "Can you put cameras up high or on the roofline?", a: "Not right now. We install doorbells and cameras that mount from the ground or a step stool: the front door, porch, garage, patio and indoors. No second-story, roofline or wired camera systems." },
      { q: "Do you sell the doorbells and cameras?", a: "You buy them (any store), or we tell you exactly which one to get for your home before the visit. No markup." },
      { q: "Can I see the cameras on my phone?", a: "Yes. We set up the app on your phone (and family or staff phones if you want), turn on motion alerts and make sure you can see every device before we leave." },
      WHERE_FAQ("We install doorbells and cameras"),
      PAY_FAQ,
    ],
    value: 200,
    seo: {
      title: "Ring & Camera Installation: Tampa, St. Pete, Brandon & More",
      description: `Ring, Nest and Blink doorbells and cameras installed in Tampa, St. Pete, Clearwater, Brandon, Lakeland and Orlando, set up on your phone. Doorbell ${usd(ip("cam-doorbell").price)}.`,
    },
  },
  {
    slug: "wifi-installation",
    path: "/wifi-installation-tampa",
    name: "Wi-Fi & internet Tampa",
    service: "Wi-Fi and internet setup",
    category: "wifi_internet",
    chip: "Tampa Bay to Orlando · homes & businesses",
    h1: ["Slow Wi-Fi or dead spots?", "Fixed at your place, Tampa to Orlando."],
    lede: "Strong Wi-Fi in every room, a new router or mesh system set up right, and your devices back online. Homes and businesses from Tampa Bay to Orlando, Lakeland and Sarasota. Price up front.",
    prices: [wifiFix, wifiMesh],
    jobs: [
      { id: "deadspots", label: "Weak signal or dead spots" },
      { id: "slow", label: "Slow or keeps dropping" },
      { id: "router", label: "Set up a new router or internet" },
      { id: "mesh", label: "Mesh Wi-Fi for the whole place" },
      { id: "office", label: "Office Wi-Fi & printers" },
    ],
    questions: [
      PLACE,
      { id: "size", label: "How big is the space?", short: "Size", options: [{ id: "small", label: "Apartment or small" }, { id: "medium", label: "Medium home" }, { id: "large", label: "Large or 2 floors" }] },
    ],
    includes: ["Find why it's slow or dropping", "Router or mesh Wi-Fi set up and placed right", "Strong signal tested in every room", "Devices, printers and TVs reconnected", "Separate guest Wi-Fi if you want it", "Passwords written down for you"],
    steps: [
      { title: "Tell us what's wrong", body: "Dead spots, slow, new router or a whole office. A few taps or a call." },
      { title: "Price up front", body: "You get the price by text before we come." },
      { title: "Fast Wi-Fi, tested", body: "We fix it at your place, test every room with you, then you pay." },
    ],
    faqs: [
      { q: "How much does a Wi-Fi fix cost?", a: `An internet and Wi-Fi fix starts at ${usd(wifiFix.price)}: dead spots, drops, slow speeds or a new router. A mesh Wi-Fi install for the whole home starts at ${usd(wifiMesh.price)} in labor, and you keep the gear. You get the price before we start.` },
      { q: "Why is my Wi-Fi slow in some rooms?", a: "Usually the router is in the wrong spot, it's too old for the house, or walls block the signal. A better spot, a newer router or a mesh system with a second unit fixes most homes." },
      { q: "Do you set up internet for businesses?", a: "Yes. Office Wi-Fi with a separate guest network, shared printers and every workstation connected." },
      { q: "Do I need to buy a new router?", a: "Not always. We check what you have first. If you need new gear, we tell you exactly what to buy before the visit." },
      WHERE_FAQ("We fix Wi-Fi and internet"),
      PAY_FAQ,
    ],
    value: 150,
    seo: {
      title: "Wi-Fi Installation: Tampa, St. Pete, Clearwater & Orlando",
      description: `Slow Wi-Fi or dead spots? Mesh Wi-Fi and router setup at homes and offices in Tampa, St. Pete, Clearwater, Brandon, Lakeland and Orlando. From ${usd(wifiFix.price)}.`,
    },
  },
];


const bizHour = byId(IT_SERVICES, "it-business-hour");

/** Google Ads landing page: business-only (see InstallPage.audience). Never mentions repair or home service. */
INSTALL_PAGES.push({
  slug: "business-tech-setup",
  path: "/business-tech-setup-tampa",
  name: "Business tech setup Tampa",
  service: "business tech setup",
  category: "business_tech",
  audience: "business",
  chip: "For Florida businesses · on-site from Tampa Bay to Orlando",
  h1: ["Office tech set up right.", "For Central Florida businesses."],
  lede: "Workstations, multi-monitor desks, business Wi-Fi, printers, Microsoft 365, storefront doorbells and cameras, all set up on-site at your office, shop or clinic. Flat price in writing before we start.",
  prices: [
    { ...station, name: "Workstation setup (per station)", summary: "Computer, monitors, keyboard, cables, network and printer at one desk." },
    { ...setupBasic, name: "Computer setup (first computer)", summary: "Unboxed, updated, accounts and software set up, files moved over." },
    { ...ip("setup-extra"), name: "Each extra computer, same visit" },
    ip("monitor-mount"),
    { ...wifiMesh, name: "Business Wi-Fi install", summary: "Strong Wi-Fi across the space, with a separate guest network." },
    { ...ip("cam-doorbell"), name: "Storefront video doorbell", summary: "Mounted at the door and set up on the owner's phone." },
    { ...bizHour, name: "On-site tech work (per hour)", summary: "Printers, shared drives, POS and anything else on your list." },
  ],
  jobs: [
    { id: "move", label: "New office or move-in setup" },
    { id: "desks", label: "Workstations & multi-monitor desks" },
    { id: "wifi", label: "Business Wi-Fi & guest network" },
    { id: "printers", label: "Printers & shared files" },
    { id: "m365", label: "Microsoft 365 or Google Workspace" },
    { id: "cams", label: "Storefront doorbell & cameras" },
    { id: "pos", label: "POS or register setup" },
    { id: "cables", label: "Cable cleanup & organization" },
  ],
  questions: [
    { id: "biz", label: "What kind of business?", short: "Business", options: [{ id: "office", label: "Office" }, { id: "retail", label: "Shop or restaurant" }, { id: "clinic", label: "Clinic or salon" }, { id: "other", label: "Other" }] },
    { id: "seats", label: "How many workstations?", short: "Workstations", options: [{ id: "1-3", label: "1–3" }, { id: "4-10", label: "4–10" }, { id: "11+", label: "11 or more" }] },
  ],
  includes: ["Every workstation set up and tested", "Monitors mounted and lined up", "Wi-Fi with a separate guest network", "Printers and shared files working for everyone", "Microsoft 365 or Google Workspace accounts", "Cables routed and labeled, desks clean"],
  steps: [
    { title: "Tell us about your office", body: "What you need and how many workstations. A few taps or a call." },
    { title: "Flat price in writing", body: "You get the price in writing before we come. No hourly surprises on a set job." },
    { title: "Ready on day one", body: "We set it up on-site, test it with your team, then you pay." },
  ],
  faqs: [
    { q: "How much does office tech setup cost?", a: `${usd(setupBasic.price)} per desk to get a computer and screen hooked up, ${usd(station.price)} for a full workstation with screens mounted and cables hidden, and whole offices from ${usd(byId(SETUP, "office-transform-basic").price)}. Wi-Fi, cameras and TV mounts are priced per item on your call. You get the total in writing first.` },
    { q: "What kinds of businesses do you work with?", a: "Offices, shops, restaurants, clinics, salons, gyms and contractors across Tampa Bay and Central Florida, from one desk to a whole office move-in." },
    { q: "Can you set up a new office before we move in?", a: "Yes. Workstations, Wi-Fi, printers, accounts and cables done before your first day, so your team sits down and works." },
    { q: "Do you install cameras and doorbells for storefronts?", a: "Yes, video doorbells and Wi-Fi cameras that mount at the door, counter and inside the shop, set up on the owner's phone. No roofline or wired systems." },
    { q: "Do we buy the equipment?", a: "Yes, or we tell you exactly what to buy before the visit. No markup on gear." },
    WHERE_FAQ("We work on-site"),
    { q: "How do we pay?", a: "After the work is done and your team has checked it. Card, Zelle or business check." },
  ],
  value: 500,
  seo: {
    title: "Business IT Setup: Tampa, St. Pete, Clearwater & Orlando",
    description: `Workstations, Wi-Fi, printers and Microsoft 365 set up on-site for businesses in Tampa, St. Pete, Clearwater, Brandon and Orlando. Call ${SITE.phone.display}.`,
  },
});

const remoteSpeed = byId(IT_SERVICES, "it-remote");
const homeSpeed = byId(IT_SERVICES, "it-speedup");
const ssd = byId(IT_SERVICES, "it-ssd");

/** Gaming PC FPS boost: consumer (Meta, organic and AI search). Remote anywhere in the world, in person across Tampa Bay and Central Florida. */
INSTALL_PAGES.push({
  slug: "fps-boost",
  path: "/gaming-pc-fps-boost",
  name: "Gaming PC FPS boost",
  service: "a gaming PC FPS boost",
  category: "gaming_fps",
  booking: FPS_BOOKING,
  remote: { question: "how", inPerson: "inperson" },
  chip: "Remote anywhere in the world · in person across Central Florida",
  h1: ["Low FPS, stutter or lag?", "We tune your gaming PC for more FPS."],
  lede: "A one-on-one tune-up of your Windows gaming PC: graphics drivers, Windows settings, background apps, temps and your in-game settings. Done live with you over the internet, or in person anywhere from Tampa Bay to Orlando. We check your FPS before and after, so you see the difference.",
  promises: ["FPS checked before and after", "Live with you, about an hour", "Remote, or in person in Central Florida", "Price before we start"],
  pricesLede: "Price before we start. Parts like a faster drive are extra, at cost, and only if you want them.",
  areaLede: "Remote works anywhere in the world. In person: Tampa Bay and Central Florida, within about 1.5 hours of Temple Terrace.",
  schemaName: "Gaming PC FPS boost, remote or in person in Central Florida",
  prices: [
    { ...remoteSpeed, name: "Remote FPS boost", summary: "Live over the internet: drivers, Windows, background apps and game settings tuned." },
    { ...homeSpeed, name: "In-person FPS boost (Central Florida)", summary: "Same tune-up at your place, plus dust and temps checked." },
    { ...ssd, name: "Faster drive upgrade (load times)", summary: "Games and Windows moved to a fast SSD. Drive extra, at cost." },
  ],
  jobs: [
    { id: "lowfps", label: "Low FPS" },
    { id: "stutter", label: "Stutter or lag spikes" },
    { id: "input", label: "Input delay" },
    { id: "loads", label: "Long load times" },
    { id: "crash", label: "Crashes or freezes in game" },
    { id: "hot", label: "Runs hot or loud" },
    { id: "stream", label: "Lag when streaming or recording" },
    { id: "max", label: "Just want max performance" },
  ],
  questions: [
    { id: "how", label: "How should we do it?", short: "How", options: [{ id: "remote", label: "Remote, over the internet" }, { id: "inperson", label: "In person (Central Florida)" }] },
    { id: "pc", label: "What's your setup?", short: "PC", options: [{ id: "desktop", label: "Gaming desktop" }, { id: "laptop", label: "Gaming laptop" }] },
    { id: "game", label: "What do you play most?", short: "Plays", options: [{ id: "fortnite", label: "Fortnite" }, { id: "cod", label: "Call of Duty / Warzone" }, { id: "valorant", label: "Valorant" }, { id: "cs2", label: "CS2" }, { id: "minecraft", label: "Minecraft" }, { id: "other", label: "Something else" }] },
  ],
  includes: [
    "FPS and temps checked before we start",
    "NVIDIA or AMD graphics drivers cleaned and updated",
    "Windows power plan, Game Mode and background apps tuned",
    "Startup junk and bloat removed",
    "In-game settings tuned for your PC and your game",
    "FPS checked again with you at the end",
  ],
  steps: [
    { title: "Tell us your PC and games", body: "What's wrong, what you play and remote or in person. A few taps or a call." },
    { title: "Price by text", body: "You get the price before we start. Nothing changes without asking you." },
    { title: "Tuned live with you", body: "About an hour, screen share or at your place. FPS checked before and after, then you pay." },
  ],
  faqs: [
    { q: "How much does a gaming PC FPS boost cost?", a: `${usd(remoteSpeed.price)} and up remotely, ${usd(homeSpeed.price)} and up in person anywhere within about 1.5 hours of Temple Terrace (Tampa Bay, Orlando, Lakeland, Sarasota). You get the exact price by text before we start, and you pay after it's done.` },
    { q: "Can you boost my FPS remotely?", a: "Yes. We connect over the internet while you watch, using a screen share you can end any time, and tune everything live. It works anywhere in the world on a Windows gaming PC or laptop." },
    { q: "How much more FPS will I get?", a: "It depends on your hardware. The biggest gains usually come from clean graphics drivers, the right Windows and in-game settings, and stopping background apps. We check your FPS before and after so you see the real difference. If your hardware is the limit, we tell you which upgrade gives the most FPS for the money." },
    { q: "Which games do you tune for?", a: "Any PC game, including Fortnite, Call of Duty and Warzone, Valorant, CS2, Minecraft, Apex Legends and GTA V. We tune Windows for gaming and the settings of the games you actually play." },
    { q: "Is it safe? Will you overclock my PC?", a: "We don't overclock, change hardware or delete your files without asking you first. Every change is explained as we go." },
    { q: "Do you work on gaming laptops?", a: "Yes. Laptops get the same tune-up, plus power and cooling settings so they don't throttle when they get hot." },
    { q: "How long does it take?", a: "About an hour, live with you. Bigger jobs like a drive upgrade take longer, and you get the time and price first." },
    WHERE_FAQ("In person, we come"),
    PAY_FAQ,
  ],
  value: 120,
  seo: {
    title: "Gaming PC FPS Boost: Remote or In Person in Florida",
    description: `Low FPS or stutter? We tune your Windows gaming PC live, remote worldwide or in person in Tampa, St. Pete, Brandon and Orlando. From ${usd(remoteSpeed.price)}.`,
  },
});

/**
 * Phone and tablet screen and battery repair: parts are ordered for the exact model, so every job is quoted by text first.
 * Calls and texts first (consumer: Meta, organic and AI search; Google bans consumer repair ads).
 */
const phoneSetup = byId(IT_SERVICES, "it-phone-setup");
INSTALL_PAGES.push({
  slug: "phone-repair",
  path: "/phone-repair-tampa",
  name: "Phone & tablet repair Tampa",
  service: "phone or tablet repair",
  category: "phone_repair",
  chip: "We come to you · Tampa Bay to Orlando",
  h1: ["Cracked screen or dead battery?", "Phone & tablet repair at your door."],
  lede: "iPhone, Samsung, Pixel and iPad screens and batteries replaced at your home or business, anywhere from Tampa, St. Pete and Clearwater to Brandon, Lakeland, Winter Haven and Orlando. Text the model and what's wrong, get the full price with the part included, and we come to you.",
  promises: ["Full price by text first", "We come to you", "Part ordered for your exact model", "Tested with you before we leave"],
  pricesLede: "Every phone and tablet is different, so text us the model and you get one price with the part and labor included before we order anything.",
  prices: [...PHONE_REPAIR, phoneSetup],
  words: {
    cta: "Get my repair price",
    jobs: "What's wrong with it?",
    title: "Get your repair price",
    ask: "Hi Chris! I need a phone or tablet repair.",
    where: "Where do we text your price?",
    submit: "Text me my price",
    sent: "We'll text you the price shortly. Want to pick a time now? Choose one below.",
  },
  textFirst: { sms: "Hi Chris, I need a phone/tablet repair. Model and what's wrong: " },
  jobs: [
    { id: "screen", label: "Cracked or shattered screen" },
    { id: "display", label: "Black screen, lines or touch not working" },
    { id: "battery", label: "Battery dies fast or shuts off" },
    { id: "swollen", label: "Swollen battery" },
    { id: "tablet", label: "iPad or tablet screen" },
    { id: "setup", label: "Set up a new phone or move my stuff" },
  ],
  questions: [
    { id: "device", label: "What is it?", short: "Device", options: [{ id: "iphone", label: "iPhone" }, { id: "samsung", label: "Samsung Galaxy" }, { id: "android", label: "Other Android" }, { id: "ipad", label: "iPad" }, { id: "tablet", label: "Other tablet" }] },
    PLACE,
  ],
  includes: ["Price by text with the part included", "New screen or battery for your exact model", "Replaced at your home or business", "Face ID, touch, camera and charging tested with you", "Your photos and data left alone", "Old parts taken for recycling"],
  steps: [
    { title: "Text the model", body: "Tell us the phone or tablet and what's wrong. A photo helps." },
    { title: "Get one price", body: "Part and labor in one price by text. We order the part for your exact model." },
    { title: "Fixed at your place", body: "We come to you, replace it, test it with you, then you pay." },
  ],
  faqs: [
    { q: "How much does a phone screen repair cost?", a: `It depends on the exact model, because the screen is ordered for your phone. Text the model to ${SITE.phone.display} and you get one price with the part and labor included before we order anything.` },
    { q: "Do you replace phone batteries?", a: "Yes. iPhone, Samsung, Pixel and other Android batteries that die fast, shut off or are swollen are replaced with a new battery for your model." },
    { q: "Do you fix iPads and tablets?", a: "Yes. Cracked iPad, Samsung Galaxy Tab and other tablet screens and worn-out batteries. Text the model for the price." },
    { q: "Do you come to me for phone repair?", a: "Yes. We come to your home or business anywhere from Tampa, St. Pete, Clearwater and Brandon to Lakeland, Winter Haven, Sarasota and Orlando. No drop-off and no waiting at a store." },
    { q: "How long does it take?", a: "We order the part for your exact model first. Once it's in, we set a time and come to you, and you get the time and price before anything is ordered." },
    { q: "Will I lose my photos or data?", a: "A screen or battery replacement doesn't erase your phone. We don't open your photos, messages or accounts." },
    WHERE_FAQ("We repair phones and tablets"),
    PAY_FAQ,
  ],
  value: 120,
  seo: {
    title: "Phone & iPad Repair: Tampa, St. Pete, Brandon & Winter Haven",
    description: `Cracked iPhone, Samsung or iPad screen or dead battery? Fixed at your door in Tampa, St. Pete, Brandon, Winter Haven and Orlando. Text ${SITE.phone.display}.`,
  },
});

/**
 * Tech recycling: free pickup of old electronics anywhere within about 1.5 hours of Temple Terrace (Tampa Bay & Central Florida). Consumer and business
 * (Meta, organic and AI search). Calls and texts first, so desktop visitors get the quiz, not a calendar.
 */
const [recyclePickup, recycleWipe, recycleOffice] = RECYCLING_PRICES;
INSTALL_PAGES.push({
  slug: "tech-recycling",
  path: "/electronics-recycling-tampa",
  name: "Tech recycling Tampa",
  service: "a free tech recycling pickup",
  category: "tech_recycling",
  chip: "Free pickup · Tampa Bay, Orlando, Lakeland, Sarasota & Central Florida",
  h1: ["Old computers, phones or TVs?", "We pick them up and recycle them, free."],
  lede: "Electronics don't belong in the trash. Call, text or email us and we come to your home or business in Tampa, St. Petersburg, Clearwater, Orlando, Lakeland, Sarasota, Ocala or anywhere within about 1.5 hours of Temple Terrace, Florida, wipe or destroy every hard drive, and haul your old tech away to be reused or recycled. Free pickup, no drop-off trip.",
  promises: ["Free pickup at your door", "Hard drives wiped or destroyed", "Homes and businesses", "Kept out of the landfill"],
  pricesLede: "Pickup is free for everything on our list. Big tube TVs or a whole truckload? Text a photo and we'll confirm before we come.",
  areaLede: "Free pickup anywhere within about 1.5 hours of Temple Terrace, Florida: Tampa Bay, Orlando, Lakeland, Sarasota, Ocala and the Nature Coast. Outside Tampa Bay we group pickups by area, so it may take a few extra days.",
  accepts: [
    { item: "Laptop or desktop", ok: "yes" },
    { item: "Old iPhone or Android", ok: "yes" },
    { item: "iPad or tablet", ok: "yes" },
    { item: "Flat-screen TV", ok: "yes" },
    { item: "Computer monitor", ok: "yes" },
    { item: "Printer or scanner", ok: "yes" },
    { item: "Game console", ok: "yes" },
    { item: "Router, modem or server", ok: "yes" },
    { item: "Cables, chargers, keyboards", ok: "yes" },
    { item: "Big tube (CRT) TV", ok: "photo" },
    { item: "A whole office", ok: "photo" },
    { item: "Fridge, washer or AC unit", ok: "no" },
  ],
  schemaName: "Free electronics recycling pickup in Tampa Bay, Orlando and Central Florida",
  prices: [recyclePickup, recycleWipe, recycleOffice],
  priceNote: "We take laptops, desktops, monitors, flat-screen TVs, phones, tablets, printers, game consoles, routers, keyboards, cables, chargers and servers. We don't take large appliances (fridges, washers, AC units) or leaking batteries.",
  words: {
    cta: "Schedule free pickup",
    jobs: "What do you have to recycle?",
    title: "Schedule a free pickup",
    ask: "Hi Chris! I have old tech for a free recycling pickup.",
    where: "Where do we text your pickup time?",
    submit: "Text me a pickup time",
    sent: "We'll text you a pickup time shortly. Want to lock one in now? Pick a time below.",
  },
  textFirst: { sms: "Hi Chris, I have old tech to recycle. Here's a photo / what I have: " },
  jobs: [
    { id: "laptops", label: "Laptops" },
    { id: "desktops", label: "Desktops & towers" },
    { id: "phones", label: "Phones & tablets" },
    { id: "screens", label: "Monitors & TVs" },
    { id: "printers", label: "Printers & scanners" },
    { id: "consoles", label: "Game consoles" },
    { id: "network", label: "Routers, modems & servers" },
    { id: "cables", label: "Cables, chargers & keyboards" },
  ],
  questions: [
    { id: "load", label: "How much is there?", short: "Amount", options: [{ id: "few", label: "A few items" }, { id: "car", label: "A carload" }, { id: "office", label: "A whole office" }] },
    PLACE,
    { id: "drives", label: "What about the data?", short: "Data", options: [{ id: "wipe", label: "Wipe the drives" }, { id: "destroy", label: "Destroy them in front of me" }, { id: "none", label: "No data on it" }] },
  ],
  includes: [
    "Free pickup at your home, apartment or office",
    "We carry it out for you, no lifting",
    "Hard drives wiped, or drilled in front of you",
    "Working devices get a second life",
    "Everything else goes to electronics recycling, not the landfill",
    "Business cleanouts of whole offices",
  ],
  steps: [
    { title: "Call or text what you have", body: "A photo or a quick list: laptops, TVs, a closet full of cables. Or tap through the form." },
    { title: "Pick a pickup time", body: "We text back a time that works. Pickup is free." },
    { title: "We haul it away", body: "We carry it out, take care of the data and get it recycled. You don't lift a thing." },
  ],
  facts: [
    { title: "Electronics can't go in the trash", body: "Computers, TVs and phones hold lead, mercury and other metals that leak out of a landfill into soil and water. Florida counties ask residents to keep them out of curbside trash." },
    { title: "Batteries start fires", body: "Lithium batteries in laptops, phones and vapes can catch fire when a garbage truck crushes them. Recycling keeps them out of trucks and dumps." },
    { title: "Your data stays private", body: "An old computer or phone still has your photos, passwords and accounts on it. We wipe every drive or destroy it in front of you before anything leaves." },
    { title: "Old tech gets a second life", body: "Working laptops and parts get reused, and the rest is broken down so the metals and plastics can be made into new things." },
  ],
  faqs: [
    { q: "Where can I recycle old electronics near me in Florida?", a: `Call or text CEO Turbo at ${SITE.phone.display} or email ${SITE.email}. We pick up old computers, laptops, phones, tablets, monitors, TVs, printers and cables free at your home or business anywhere within about 1.5 hours of Temple Terrace (Tampa Bay, Orlando, Lakeland, Winter Haven, Sarasota), so you don't have to drive to a drop-off site.` },
    { q: "Do you pick up in St. Pete, Clearwater, Brandon and Winter Haven?", a: `Yes. We pick up all over Florida within about 1.5 hours of Temple Terrace, not just Tampa: St. Petersburg, Clearwater, Largo, Dunedin, Palm Harbor, Brandon, Riverview, Valrico, Plant City, Wesley Chapel, Land O' Lakes, New Port Richey, Spring Hill, Lakeland, Winter Haven, Bartow, Haines City, Bradenton, Sarasota, Orlando, Kissimmee, Ocala and every town in between. Call or text ${SITE.phone.display} or email ${SITE.email}.` },
    { q: "How do I schedule an electronics recycling pickup?", a: `Call or text ${SITE.phone.display} (a photo of what you have is perfect), email ${SITE.email}, or tap through the form on this page. We reply with a pickup time.` },
    { q: "Is electronics pickup really free?", a: "Yes. Pickup, carrying it out and the data wipe are free for laptops, desktops, phones, tablets, monitors, flat-screen TVs, printers, consoles, networking gear and cables. Big tube TVs or a full truckload: text a photo first and we'll confirm before we come." },
    { q: "Can I throw old electronics in the trash?", a: "You shouldn't. Electronics hold lead, mercury and lithium batteries that can leak into soil and water or start fires in garbage trucks, and Florida counties ask residents to keep them out of curbside trash. Recycling them is the safe way to get rid of them." },
    { q: "What happens to my data?", a: "Every hard drive and phone is wiped before it's reused or recycled. Want to see it done? We'll drill the hard drive in front of you at pickup, free." },
    { q: "What electronics do you take?", a: "Laptops, desktops and towers, monitors, flat-screen TVs, phones, tablets, printers and scanners, game consoles, routers, modems, servers, keyboards, mice, cables and chargers. We don't take large appliances like fridges, washers or AC units, or leaking batteries." },
    { q: "Do you pick up from businesses and offices?", a: "Yes. Offices, schools, clinics and shops: old workstations, monitors, servers and network gear, loaded up and hauled away, with every drive wiped or destroyed." },
    { q: "Do I have to bring it outside?", a: "No. We come in and carry it out, from a closet, garage, apartment or office." },
    { q: "How fast can you pick up?", a: `Usually within a few days, often the same week. Call or text ${SITE.phone.display} with what you have and we'll text you a time.` },
    WHERE_FAQ("We pick up old tech for free"),
    { q: "Do you pick up in Orlando, Sarasota or Ocala?", a: `Yes. Orlando, Kissimmee, Clermont, Sarasota, Venice, Ocala and The Villages are all inside our 1.5-hour pickup area, and pickup is free. Outside Tampa Bay we group pickups by area, so it may take a few extra days. Text a photo and your city to ${SITE.phone.display} and we'll set a day.` },
  ],
  value: 40,
  seo: {
    title: "Free Electronics Recycling Pickup: Tampa, St. Pete & More",
    description: `Free pickup of old computers, phones and TVs in Tampa, St. Pete, Clearwater, Brandon, Winter Haven, Lakeland and Orlando. Call or text ${SITE.phone.display}.`,
  },
});

export const INSTALL_PATHS = INSTALL_PAGES.map((p) => p.path);
export const installPage = (path: string) => INSTALL_PAGES.find((p) => p.path === path.replace(/\/$/, ""));

export const WHEN_OPTIONS: Choice[] = [
  { id: "asap", label: "ASAP" },
  { id: "week", label: "This week" },
  { id: "flexible", label: "No rush" },
];

export type InstallAnswers = { jobs: string[]; picks: Record<string, string>; when: string; details: string; zip: string; name: string; phone: string; smsOptIn: boolean };
export const EMPTY_INSTALL: InstallAnswers = { jobs: [], picks: {}, when: "asap", details: "", zip: "", name: "", phone: "", smsOptIn: false };

/** "Jobs: …" and each question's answer as readable labels. */
export function installLabels(page: InstallPage, a: InstallAnswers) {
  const jobs = a.jobs.map((id) => page.jobs.find((j) => j.id === id)?.label).filter(Boolean).join(", ");
  const answers = page.questions.map((q) => {
    const pick = q.options.find((o) => o.id === a.picks[q.id])?.label;
    return pick ? `${q.short}: ${pick}` : "";
  }).filter(Boolean);
  const when = WHEN_OPTIONS.find((w) => w.id === a.when)?.label ?? "";
  return { jobs, answers, when };
}

/** The text a phone sends us, one answer per line. */
export function installMessage(page: InstallPage, a: InstallAnswers) {
  const l = installLabels(page, a);
  return [
    quizWords(page).ask,
    l.jobs && `Need: ${l.jobs}`,
    ...l.answers,
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    needsZip(page, a) && `ZIP: ${a.zip.trim() || "-"}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
