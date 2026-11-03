import type { FAQ } from "./services";
import type { MakerCopy } from "./company-shirts";
import { ARTIST_SHIRT, SITE, artistFromPrice, money2, shirtTotal } from "@/config/site";

export const ARTIST_MERCH_PATH = "/artist-merch";

const A = ARTIST_SHIRT;
const short = A.styles[0].price;
const long = A.styles[1].price;
const pct = (off: number) => `${Math.round(off * 100)}%`;
const top = A.tiers[A.tiers.length - 1];

export const artistFromLabel = money2(artistFromPrice);

/** What an artist pays per shirt and keeps per sale, for the profit table (front print, short sleeve, M–XL). */
export const MERCH_SELL_PRICE = 30;
export const MERCH_PROFIT = [12, 24, 50, 100].map((qty) => {
  const { total, tier } = shirtTotal("short", false, { L: qty }, A);
  const each = +(total / qty).toFixed(2);
  return { qty, each, off: tier.off, keep: +(MERCH_SELL_PRICE - each).toFixed(2), profit: +((MERCH_SELL_PRICE - each) * qty).toFixed(0) };
});

export const MERCH_POINTS = [
  { title: "No minimum", body: "Test a design with 1 shirt. Order 100 when it sells out." },
  { title: "Your cover art, full color", body: "Album art, photos, gradients — same price as one color." },
  { title: `Save ${pct(top.off)} on ${top.min}+`, body: `${A.tiers.slice(1).map((t) => `${pct(t.off)} at ${t.min}`).join(", ")}. Applied at checkout.` },
  { title: "Tour back in 1 minute", body: "Type your dates, we lay them out on the back." },
];

export const MERCH_STEPS = [
  { title: "Drop your art", body: "Cover art, logo or a photo. Drag it, resize it, turn it, pick a font for your name. White box behind it? One tap removes it." },
  { title: "Add the back", body: "Tour dates, a track list, your @ or different art on the back. 6 shirt colors, short or long sleeve, S to 3XL." },
  { title: "Check out — we print and ship", body: `${A.shipping.production}, then ${A.shipping.delivery.toLowerCase()}. Free US shipping straight to you.` },
];

export const MERCH_USES = [
  { where: "The merch table", why: `Buy at ${money2(MERCH_PROFIT[2].each)}, sell at $${MERCH_SELL_PRICE}. Merch pays for the gas money when the door deal doesn't.` },
  { where: "Release drops", why: "A shirt with the cover art on release week. Fans post it, the algorithm sees it." },
  { where: "Tour shirts", why: "Every city on the back. The classic — and the one fans keep for 10 years." },
  { where: "Your team & crew", why: "Producer, DJ, photographer, dancers in matching shirts. Looks like a label." },
  { where: "Giveaways & pre-saves", why: "Raffle a signed shirt for pre-saves and email sign-ups. Cheaper than ads for the right fans." },
  { where: "Producers & studios", why: "Your producer tag or studio logo on a tee for every artist who books a session." },
];

/** [row, CEO Turbo, print-on-demand storefront, local screen printer] */
export const MERCH_COMPARE: [string, string, string, string][] = [
  ["Minimum order", "1 shirt", "1 shirt", "Usually 24–48+"],
  ["Setup / screen fees", "$0", "$0 (monthly plan for the low prices)", "Per color, per side"],
  ["Full-color cover art", "Same price", "Same price", "Costs more per color"],
  ["You hold stock to sell at shows", `Yes — from ${money2(MERCH_PROFIT[3].each)} at ${MERCH_PROFIT[3].qty}`, "No — fans pay $30+ and you get a few dollars", "Yes, once you hit the minimum"],
  ["Tour-date back", "Type it in, laid out for you", "Design it yourself", "Send a file, wait for a proof"],
  ["Help from a person", `Call or text ${SITE.phone.display}`, "Support ticket", "Yes"],
];

export const MERCH_FAQS: FAQ[] = [
  {
    q: "How much does custom artist merch cost?",
    a: `${money2(short)} per short-sleeve tee and ${money2(long)} per long sleeve with your art on the front, free US shipping. A back print (tour dates, logo or second art) adds ${money2(A.backPrintPrice)}; 2XL–3XL add ${money2(A.plusSizeUpcharge)}. ${A.tiers.slice(1).map((t) => `${t.min}+ shirts save ${pct(t.off)}`).join(", ")}. No setup or screen fees.`,
  },
  {
    q: "Is there a minimum order for band or artist merch?",
    a: "No. Order one shirt to see how it looks and wears, then order show stock. Every shirt is printed to order, and bigger orders get the volume discount automatically at checkout.",
  },
  {
    q: "How much profit can I make selling merch at shows?",
    a: `At $${MERCH_SELL_PRICE} a shirt: buy ${MERCH_PROFIT[1].qty} and you keep about ${money2(MERCH_PROFIT[1].keep)} a shirt; buy ${MERCH_PROFIT[2].qty} and you keep about ${money2(MERCH_PROFIT[2].keep)} a shirt (${pct(MERCH_PROFIT[2].off)} off). Order sizes M–XL heaviest — they're most of what sells at a merch table.`,
  },
  {
    q: "What file should I upload for my album cover or logo?",
    a: "A PNG at least 2000 pixels wide is best — the print is up to 12 × 16 inches. A transparent background prints cleanest on dark shirts; if your art sits on a white box, tick “Remove white background”. The designer warns you when the file is too small to print sharp, and we check every file before printing.",
  },
  {
    q: "Can I put tour dates on the back?",
    a: `Yes. Turn on the back print (+${money2(A.backPrintPrice)} a shirt), type a title like “WORLD TOUR 2026” and one date per line — up to 14 lines. You can also upload different art for the back.`,
  },
  {
    q: "How long does merch take?",
    a: `${A.shipping.production}, then ${A.shipping.delivery.toLowerCase()} — about ${A.shipping.minDays}–${A.shipping.maxDays} business days door to door. Need it for a show date? Call or text ${SITE.phone.display} before you order.`,
  },
  {
    q: "Can I use any image on my merch?",
    a: "Only art you own or have permission to use — your own cover, logo and photos. We don't print other artists' names, brand logos, sports teams or copyrighted characters.",
  },
  {
    q: "What shirts do you print on?",
    a: `${A.styles[0].blank} and ${A.styles[1].blank}, in ${A.colors.map((c) => c.name).join(", ")}. Unisex sizes S–3XL that run true to size.`,
  },
  {
    q: "What if a shirt is misprinted?",
    a: A.guarantee + " Because each shirt is made with your art, we can't take back a size you chose — check the size chart first.",
  },
];

export const ARTIST_MAKER: MakerCopy = {
  chip: "CEO Turbo · Artist merch",
  h1: "Make Your Merch Today",
  h1Accent: "— no minimum.",
  lede: `Drop your cover art or logo, add your name and tour dates, see it on the shirt, check out. From ${money2(short)} a shirt with free US shipping — 1 to test it, 100 for the tour.`,
  points: MERCH_POINTS,
  artLabel: "Your art",
  artNoun: "art",
  textOptional: true,
  textOnlyNote: "No art yet? Skip this — type your name below and pick a font.",
  textPlaceholder: "Artist or band name",
  subPlaceholder: "Album title, @handle or slogan",
  sample: { text: "Your Name", sub: "THE ALBUM · OUT NOW" },
  sampleNote: "Sample design — drop your art to see yours",
  defaultFont: "anton",
  backToggle: "Back print — tour dates or art",
  backPlaceholder: "WORLD TOUR 2026",
  backSubPlaceholder: "@yourhandle · out everywhere",
  defaultBack: "",
  discountLabel: "Volume discount",
  emptyError: "Upload your art or type your artist name first.",
  mockupNoun: "artist merch shirt",
  barNoun: "merch",
};
