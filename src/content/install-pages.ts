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
    name: "Security cameras Tampa",
    service: "security camera installation",
    category: "security_cameras",
    chip: "Tampa Bay + 40 miles · homes & businesses",
    h1: ["Security cameras", "installed in Tampa."],
    lede: "Cameras mounted, wired or Wi-Fi, and set up on your phone so you can watch from anywhere. Homes and businesses within 40 miles of Tampa. You get the price in writing before we start.",
    prices: [ip("cam-wifi"), ip("cam-wired"), ip("cam-doorbell"), ip("cam-nvr")],
    priceNote: `Example: 4 wired cameras plus the recorder and phone app is ${usd(4 * ip("cam-wired").price + ip("cam-nvr").price)} in labor. Cameras are yours, or we buy them at cost with receipts.`,
    jobs: [
      { id: "new", label: "Install new cameras" },
      { id: "doorbell", label: "Video doorbell" },
      { id: "nvr", label: "Recording box (NVR) & phone app" },
      { id: "fix", label: "Fix or move cameras I already have" },
    ],
    questions: [
      { id: "count", label: "How many cameras?", short: "Cameras", options: [{ id: "1-2", label: "1–2" }, { id: "3-4", label: "3–4" }, { id: "5-8", label: "5–8" }, { id: "9+", label: "9 or more" }] },
      PLACE,
      { id: "kind", label: "What kind?", short: "Type", options: [{ id: "wifi", label: "Wi-Fi (Ring, Arlo, Wyze…)" }, { id: "wired", label: "Wired system" }, { id: "unsure", label: "Help me pick" }] },
    ],
    includes: ["Cameras mounted and aimed where you need them", "Wi-Fi cameras or a wired system with a recorder", "The app set up on your phone, alerts working", "Video doorbells", "Cables tidy and weather-sealed outside", "A walkthrough before we leave"],
    steps: [
      { title: "Tell us what you need", body: "How many cameras, home or business, Wi-Fi or wired. A few taps or a call." },
      { title: "Written price first", body: "You get the price by text before we come. Not sure what to buy? We'll tell you." },
      { title: "Watching from your phone", body: "We mount, connect and test every camera with you, then you pay." },
    ],
    faqs: [
      { q: "How much does security camera installation cost?", a: `${usd(ip("cam-wifi").price)} per Wi-Fi camera and ${usd(ip("cam-wired").price)} per wired camera with the cable run included. A video doorbell is ${usd(ip("cam-doorbell").price)} and setting up the recorder with phone viewing is ${usd(ip("cam-nvr").price)}. So 4 wired cameras plus the recorder is ${usd(4 * ip("cam-wired").price + ip("cam-nvr").price)} in labor. You get the written total before we start.` },
      { q: "Do you sell the cameras?", a: "You can buy them, or we'll tell you exactly what to get for your home or business before the visit. We install Wi-Fi cameras like Ring, Arlo and Wyze, and wired systems with a recorder." },
      { q: "Can I watch the cameras on my phone?", a: "Yes. We set up the app on your phone (and family or staff phones if you want), turn on alerts and make sure you can see every camera before we leave." },
      { q: "Do you install cameras for businesses?", a: "Yes. Shops, offices, restaurants and warehouses: cameras inside and out, a recorder that keeps footage, and phone access for the owner." },
      { q: "Do you install video doorbells?", a: "Yes. We install and connect video doorbells and set up the app and chime." },
      WHERE_FAQ("We install security cameras"),
      PAY_FAQ,
    ],
    value: 400,
    seo: {
      title: "Security Camera Installation in Tampa, FL | CEO Turbo",
      description: `Security cameras installed at Tampa Bay homes and businesses, Wi-Fi or wired, on your phone. From ${usd(ip("cam-wifi").price)} per camera. Call or text ${SITE.phone.display}.`,
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
    prices: [wifiFix, wifiMesh, ip("net-drop")],
    jobs: [
      { id: "deadspots", label: "Weak signal or dead spots" },
      { id: "slow", label: "Slow or keeps dropping" },
      { id: "router", label: "Set up a new router or internet" },
      { id: "mesh", label: "Mesh Wi-Fi for the whole place" },
      { id: "office", label: "Office network & printers" },
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
      { q: "How much does a Wi-Fi fix cost?", a: `An internet and Wi-Fi fix starts at ${usd(wifiFix.price)}: dead spots, drops, slow speeds or a new router. A mesh Wi-Fi install for the whole home starts at ${usd(wifiMesh.price)} in labor, and you keep the gear. A wired network cable to a desk, TV or camera is ${usd(ip("net-drop").price)} per cable. You get the price before we start.` },
      { q: "Why is my Wi-Fi slow in some rooms?", a: "Usually the router is in the wrong spot, it's too old for the house, or walls block the signal. A better spot, a newer router or a mesh system with a second unit fixes most homes." },
      { q: "Do you set up internet for businesses?", a: "Yes. Office Wi-Fi with a separate guest network, network cabling, shared printers and every workstation connected." },
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
