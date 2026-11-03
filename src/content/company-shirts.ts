import type { FAQ } from "./services";
import { SHIRT, SITE, money2, shirtFromPrice } from "@/config/site";
import type { FontId } from "@/components/shirts/art";

/** Words the shirt designer uses, so one engine serves company shirts and artist merch. */
export type MakerCopy = {
  chip: string;
  h1: string;
  h1Accent: string;
  lede: string;
  points: { title: string; body: string }[];
  /** "Your logo" / "Your art" (step 3 heading) and the noun used in labels. */
  artLabel: string;
  artNoun: string;
  textOptional: boolean;
  textOnlyNote?: string;
  textPlaceholder: string;
  subPlaceholder: string;
  sample: { text: string; sub: string };
  sampleNote: string;
  defaultFont: FontId;
  backToggle: string;
  backPlaceholder: string;
  backSubPlaceholder: string;
  /** Printed on the back when the buyer turns it on but types nothing ("" = they must add something). */
  defaultBack: string;
  discountLabel: string;
  emptyError: string;
  mockupNoun: string;
  barNoun: string;
};

export const SHIRTS_PATH = "/custom-company-t-shirts";

const short = SHIRT.styles[0].price;
const long = SHIRT.styles[1].price;
const t12 = Math.round(SHIRT.tiers[1].off * 100);
const t24 = Math.round(SHIRT.tiers[2].off * 100);

export const SHIRT_STEPS = [
  { title: "Upload your logo", body: "PNG, JPG or SVG. White box behind it? One tap removes it so it prints clean on dark shirts." },
  { title: "Pick sleeves, color and sizes", body: "Short or long sleeve, 4 colors, S to 3XL — mix sizes in one order, 1 shirt or 100." },
  { title: "Check out — we print and ship", body: `${SHIRT.shipping.production}, then ${SHIRT.shipping.delivery.toLowerCase()}. Free US shipping.` },
];

export const SHIRT_POINTS = [
  { title: "No minimum", body: "Order 1 shirt for a new hire or 50 for the whole crew." },
  { title: "Full-color logos", body: "Any colors, gradients or photos — same price, no screen fees." },
  { title: `Save ${t24}% on 24+`, body: `${t12}% off at 12 shirts, ${t24}% off at 24. Applied at checkout.` },
  { title: "Free reprint promise", body: `Misprint or damaged? Photo within ${SHIRT.returnDays} days, we reprint it free.` },
];

export const SHIRT_USES = [
  { where: "Crew & job-site shirts", why: "Contractors, landscapers, cleaners, movers: the customer knows who's at the door before you knock." },
  { where: "Front-of-house staff", why: "Restaurants, salons, gyms and shops: customers know who to ask, and your name is in every photo." },
  { where: "Long sleeves for the cold months", why: "Same logo, same print — for crews outside from November to March." },
  { where: "Events, booths and launches", why: "Your team in matching shirts at the expo or grand opening, website printed on the back." },
  { where: "New hire welcome kit", why: "No minimum means you can order one shirt in their size the day they start." },
  { where: "Merch for regulars", why: "Barbershops, coffee shops and gyms sell their own shirts — your logo walking around town." },
];

/** [row, CEO Turbo, bulk screen printer, local print shop] */
export const SHIRT_COMPARE: [string, string, string, string][] = [
  ["Minimum order", "1 shirt", "Usually 12–24+", "Usually 12–24+"],
  ["Setup / screen fees", "$0", "Per color, per side", "Per color, per side"],
  ["See it before you buy", "Live mockup, 2 minutes", "Proof by email", "Proof in a day or two"],
  ["Full-color logo", "Same price", "Costs more per color", "Costs more per color"],
  ["One more for a new hire", "Order 1, same price", "Minimum applies again", "Call and wait"],
  ["Turnaround", "Prints in 2–4 days, free shipping", "Often 1–2 weeks", "Days to weeks"],
  ["Shipping", "Free in the US", "Often extra", "Pick up"],
];

export const SHIRT_FAQS: FAQ[] = [
  {
    q: "How much do custom company t-shirts cost?",
    a: `${money2(short)} per short-sleeve shirt and ${money2(long)} per long-sleeve shirt with your logo on the front, with free US shipping. A second print on the back adds ${money2(SHIRT.backPrintPrice)}; 2XL and 3XL add ${money2(SHIRT.plusSizeUpcharge)}. Order 12 or more and you save ${t12}%; 24 or more saves ${t24}%. No setup fees, no screen fees.`,
  },
  {
    q: "Is there a minimum order for company shirts with a logo?",
    a: "No. You can order a single shirt. Every shirt is printed to order, so 1 shirt costs the same per shirt as 11 — and bigger orders get the team discount automatically.",
  },
  {
    q: "What logo file should I upload?",
    a: "A PNG with a transparent background is best, at least 1500 pixels wide. JPG and SVG work too. If your logo sits on a white box, tick “Remove white background” so it prints clean on black, navy or grey shirts. The designer warns you if the file is too small to print sharp.",
  },
  {
    q: "How long does it take to get custom work shirts?",
    a: `${SHIRT.shipping.production}, then ${SHIRT.shipping.delivery.toLowerCase()} — about ${SHIRT.shipping.minDays}–${SHIRT.shipping.maxDays} business days door to door. Need them for a date? Call or text ${SITE.phone.display} before you order.`,
  },
  {
    q: "Can I order different sizes in one order?",
    a: "Yes. Set a quantity for each size from S to 3XL in the same order — 3 Medium, 5 Large and 2 XL, for example. The team discount counts every shirt in the order.",
  },
  {
    q: "Can you print on the back too?",
    a: `Yes. Turn on “Back print” (+${money2(SHIRT.backPrintPrice)} per shirt) and add your website, phone number, “STAFF” or your logo across the back. The back is printed up to 12 × 16 inches.`,
  },
  {
    q: "How are the shirts printed — screen print, DTG or DTF?",
    a: "Digital full-color printing (DTG or DTF, depending on the shirt color) by our US print partner. Full-color logos, gradients and photos cost the same as one color, there are no screens to pay for, and the print stays bright on black and navy. Wash inside out in cold water and it lasts wash after wash.",
  },
  {
    q: "Will someone check my design before it prints?",
    a: "Yes. A real person on our team looks at every design before we send it to print. If the logo is blurry, cut off or the colors won't show on your shirt color, we email or text you before printing — not after.",
  },
  {
    q: "What if a shirt is misprinted or the wrong size?",
    a: SHIRT.guarantee + " Because every shirt is made to order with your logo, we can't take back a shirt you ordered in the wrong size — check the size chart first.",
  },
  {
    q: "What shirts do you print on?",
    a: `${SHIRT.styles[0].blank} for short sleeve and ${SHIRT.styles[1].blank} for long sleeve, in Black, White, Navy and Sport Grey. They are unisex sizes S–3XL and run true to size.`,
  },
];

export const SHIRT_SIZE_CHART: [string, string, string][] = [
  ["S", "18", "28"],
  ["M", "20", "29"],
  ["L", "22", "30"],
  ["XL", "24", "31"],
  ["2XL", "26", "32"],
  ["3XL", "28", "33"],
];

export const shirtFromLabel = money2(shirtFromPrice);

export const COMPANY_MAKER: MakerCopy = {
  chip: "CEO Turbo · Custom company shirts",
  h1: "Company T-Shirts With Your Logo",
  h1Accent: "— no minimum.",
  lede: `Upload your logo, drag it where you want it, pick sizes, check out. Short or long sleeve, from ${money2(SHIRT.styles[0].price)} a shirt with free US shipping — 1 shirt or the whole crew.`,
  points: SHIRT_POINTS,
  artLabel: "Your logo",
  artNoun: "logo",
  textOptional: true,
  textPlaceholder: "Company name",
  subPlaceholder: "Small line — website, phone or slogan",
  sample: { text: "Your logo", sub: "yourcompany.com" },
  sampleNote: "Sample design — upload your logo to see yours",
  defaultFont: "inter",
  backToggle: "Print on the back too",
  backPlaceholder: "STAFF, CREW or your company name",
  backSubPlaceholder: "yourcompany.com · (555) 555-0123",
  defaultBack: "STAFF",
  discountLabel: "Team discount",
  emptyError: "Upload your logo or type your company name first.",
  mockupNoun: "company shirt with your logo",
  barNoun: "custom",
};

export const SHIRT_PRESETS: { id: string; name: string; logoScale: number; font: FontId; text: string; subtext: string; inkId: string }[] = [
  { id: "minimal", name: "Minimal", logoScale: 0.6, font: "inter", text: "", subtext: "", inkId: "auto" },
  { id: "bold", name: "Bold", logoScale: 0.9, font: "gothic", text: "", subtext: "", inkId: "white" },
  { id: "classic", name: "Classic", logoScale: 0.75, font: "inter", text: "", subtext: "", inkId: "auto" },
];
