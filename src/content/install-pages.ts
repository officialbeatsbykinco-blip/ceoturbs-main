// Tampa installation landing pages (Google Search ads + local SEO): computer setup, security cameras and
// Wi-Fi/internet. One template (pages/InstallPage.tsx), one quiz (components/tech/InstallQuiz.tsx).
// Prices come from content/pricing.ts so the page, its schema and the ads agree. Cameras have no set price yet.
import { SITE } from "@/config/site";
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import { INSTALL_PRICES, IT_SERVICES, SETUP, usd, type PriceItem } from "@/content/pricing";
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
  seo: { title: string; description: string };
};

const byId = (list: PriceItem[], id: string) => list.find((p) => p.id === id)!;
const CITY_LIST = `${ALL_SETUP_CITIES.slice(0, -1).join(", ")} and ${ALL_SETUP_CITIES[ALL_SETUP_CITIES.length - 1]}`;
const WHERE_FAQ = (what: string): FAQ => ({ q: "Where do you come to?", a: `${what} anywhere within about 40 miles of Tampa, Florida: ${CITY_LIST}. Somewhere else nearby? Text your ZIP code and we'll confirm.` });
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
    chip: "Tampa Bay + 40 miles · homes & businesses",
    h1: ["New computer or monitors?", "We set it all up in Tampa."],
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
      title: "Computer Setup in Tampa, FL: We Come to You | CEO Turbo",
      description: `New computer setup, file transfer, monitors and printers at your Tampa Bay home or business. From ${usd(setupBasic.price)}, price up front. Call or text ${SITE.phone.display}.`,
    },
  },
  {
    slug: "security-camera-installation",
    path: "/security-camera-installation-tampa",
    name: "Doorbell & cameras Tampa",
    service: "doorbell and camera installation",
    category: "security_cameras",
    chip: "Tampa Bay + 40 miles · homes & businesses",
    h1: ["Video doorbells & cameras", "installed in Tampa."],
    lede: "Ring, Nest, Blink or Wyze doorbells and Wi-Fi cameras installed, connected and set up on your phone so you can see who's there from anywhere. Homes and businesses within 40 miles of Tampa. Price up front.",
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
      title: "Ring Doorbell & Camera Installation in Tampa, FL | CEO Turbo",
      description: `Ring, Nest and Blink video doorbells and Wi-Fi cameras installed at Tampa Bay homes, set up on your phone. Doorbell ${usd(ip("cam-doorbell").price)}. Call or text ${SITE.phone.display}.`,
    },
  },
  {
    slug: "wifi-installation",
    path: "/wifi-installation-tampa",
    name: "Wi-Fi & internet Tampa",
    service: "Wi-Fi and internet setup",
    category: "wifi_internet",
    chip: "Tampa Bay + 40 miles · homes & businesses",
    h1: ["Slow Wi-Fi or dead spots?", "Fixed at your place in Tampa."],
    lede: "Strong Wi-Fi in every room, a new router or mesh system set up right, and your devices back online. Homes and businesses within 40 miles of Tampa. Price up front.",
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
      title: "Wi-Fi & Internet Installation in Tampa, FL | CEO Turbo",
      description: `Slow Wi-Fi, dead spots or a new router? Mesh Wi-Fi and internet setup at Tampa Bay homes and businesses. From ${usd(wifiFix.price)}. Call or text ${SITE.phone.display}.`,
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
  chip: "For Tampa Bay businesses · on-site within 40 miles",
  h1: ["Office tech set up right.", "For Tampa Bay businesses."],
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
    { title: "Flat price in writing", body: "You get the price by text before we come. No hourly surprises on a set job." },
    { title: "Ready on day one", body: "We set it up on-site, test it with your team, then you pay." },
  ],
  faqs: [
    { q: "How much does office tech setup cost?", a: `${usd(station.price)} per workstation with computer, monitors, cables, network and printer. Computers alone are ${usd(setupBasic.price)} for the first and ${usd(ip("setup-extra").price)} for each extra on the same visit, monitor mounts are ${usd(ip("monitor-mount").price)} each and business Wi-Fi installs start at ${usd(wifiMesh.price)}. Anything else is ${usd(bizHour.price)} an hour. You get the total in writing first.` },
    { q: "What kinds of businesses do you work with?", a: "Offices, shops, restaurants, clinics, salons, gyms and contractors around Tampa Bay, from one desk to a whole office move-in." },
    { q: "Can you set up a new office before we move in?", a: "Yes. Workstations, Wi-Fi, printers, accounts and cables done before your first day, so your team sits down and works." },
    { q: "Do you install cameras and doorbells for storefronts?", a: "Yes, video doorbells and Wi-Fi cameras that mount at the door, counter and inside the shop, set up on the owner's phone. No roofline or wired systems." },
    { q: "Do we buy the equipment?", a: "Yes, or we tell you exactly what to buy before the visit. No markup on gear." },
    WHERE_FAQ("We work on-site"),
    { q: "How do we pay?", a: "After the work is done and your team has checked it. Card, Zelle or business check." },
  ],
  value: 500,
  seo: {
    title: "Office & Business Tech Setup in Tampa, FL | CEO Turbo",
    description: `Workstations, multi-monitor desks, business Wi-Fi, printers and Microsoft 365 set up on-site for Tampa Bay businesses. Flat price. Call ${SITE.phone.display}.`,
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
    `Hi Chris! I'd like a price for ${page.service}.`,
    l.jobs && `Need: ${l.jobs}`,
    ...l.answers,
    a.details.trim() && `Details: ${a.details.trim()}`,
    l.when && `When: ${l.when}`,
    `ZIP: ${a.zip.trim() || "-"}`,
    `Name: ${a.name.trim() || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
