import type { FAQ } from "./services";
import { CARD_PROGRAMMING, REVIEW_CARD, NFC_APP, fromPriceLabel, money2 } from "@/config/site";

export const SHOP_PATH = "/google-review-cards";
export const SETUP_PATH = "/google-review-card-setup";
/** The review-card tutorial page filmed for ads: its header and phone bar sell cards instead of the call. */
export const REVIEWS_AD_PATH = "/get-more-reviews";

export type GalleryItem = { src: string; srcSet?: string; thumb: string; alt: string; live3d?: boolean; w: number; h: number };

const IMG = "/img/review-cards";
/** 2400 px studio renders from scripts/review-card-hd.mjs, served as 800/1600/2400 WebP. */
const hd = (name: string, alt: string): GalleryItem => ({
  src: `${IMG}/hd/${name}.jpg`,
  srcSet: [800, 1600, 2400].map((w) => `${IMG}/hd/${name}-${w}.webp ${w}w`).join(", "),
  thumb: `${IMG}/hd/${name}-thumb.webp`,
  alt,
  w: 2400,
  h: 2400,
});

export const GALLERY: GalleryItem[] = [
  hd("card-hero", "NFC Google review card, both sides: white Review Us On Google front and black NFC back"),
  hd("card-tap", "Phone next to the review card with the Google review form open after a tap"),
  hd("card-how", "How it works: the customer taps, the review form opens, five stars are posted"),
  hd("card-counter", "Google review card lying on a shop counter next to the register"),
  hd("card-stack-5", "Five NFC Google review cards fanned out"),
  hd("card-size", "Credit-card size: 85.5 mm by 54 mm, shown next to a phone"),
  hd("card-specs", "Review card specs: white matte front, black NFC back, NTAG215 chip, 504 bytes, waterproof PVC, 85.5 × 54 × 0.76 mm"),
  { src: `${IMG}/feed-white.jpg`, thumb: `${IMG}/card-3d-thumb.webp`, alt: "Spin the review card in 3D", live3d: true, w: 1200, h: 1200 },
];

export const STAND_GALLERY: Record<"stand" | "kit", GalleryItem[]> = {
  stand: [
    hd("stand-front", "White acrylic Google review counter stand: Rate Your Experience, tap your phone or scan the QR code"),
    hd("stand-tap", "Phone next to the counter stand with the Google review form open"),
    hd("stand-angle", "Google review counter stand from the side"),
    hd("kit", "Counter stand with two NFC review cards"),
  ],
  kit: [
    hd("kit", "Google review kit: counter stand plus two NFC review cards"),
    hd("stand-tap", "Phone next to the counter stand with the Google review form open"),
    hd("card-hero", "The two NFC review cards in the kit: white front, black NFC back"),
    hd("stand-angle", "Google review counter stand from the side"),
  ],
};

export const PRODUCT_POINTS = [
  { title: "iPhone & Android", body: "Every iPhone XS or newer and NFC Android phones. No app for customers." },
  { title: "One tap, 3 seconds", body: "No searching your name, no scrolling Maps — the review form just opens." },
  { title: "Pay once, reuse forever", body: "No subscription. Re-program it anytime, for any location." },
  { title: "Built for the job", body: "Waterproof PVC, wallet size. Fits a pocket, visor or tool bag." },
];

export const INCLUDED = ["NFC Google review card(s) — white front, black back", "Simple setup guide (about 2 minutes), or pick “Program it for me”", "Free review-link finder + printable QR for receipts", "Free setup call if you get stuck"];

export const USES = [
  { where: "Barbers & stylists", why: "Keep it at the chair or in your pocket. Hold it out right after the mirror reveal." },
  { where: "Lawn care & landscaping", why: "Keep it in the truck. Hand it over while they're looking at a fresh yard." },
  { where: "Mobile repair & detailing", why: "Phone, appliance, car: the second it works again is the second to ask." },
  { where: "Cleaners, plumbers & contractors", why: "Tuck one in your wallet and ask at the door before you leave." },
  { where: "Stores & restaurants", why: "Leave a card on the table or counter. Customers tap while they wait or pay." },
  { where: "Receipts & invoices", why: "Our free setup tool also makes a QR code for your review link, so people can review later too." },
];

export const COMPARE: [string, string, string, string][] = [
  ["Steps for the customer", "Tap — the form opens", "Search your name, find the listing, scroll, tap", "Open camera, scan, wait"],
  ["Catches them at the right moment", "Yes, the moment the job's done", "They say “sure” and forget", "Only if they notice it"],
  ["App needed", "No", "No", "No"],
  ["Looks professional", "Yes, printed card", "—", "Usually a taped-up printout"],
];

export const RULES = [
  { ok: true, text: "Ask every customer — Google wants reviews from all your customers." },
  { ok: true, text: "Reply to reviews, good and bad. It builds trust with the next customer." },
  { ok: false, text: "No discounts, freebies or contests in exchange for reviews." },
  { ok: false, text: "Don't only ask happy customers or screen people first (“review gating”)." },
  { ok: false, text: "Never write reviews for customers, or have staff and family review you." },
];

export const SHOP_FAQS: FAQ[] = [
  { q: "How does a Google review card work?", a: "The card has an NFC chip that you program with your Google review link. When a customer holds their phone near the card, the phone opens your Google review form — they pick the stars, write a line and post." },
  { q: "Do my customers need an app?", a: "No. iPhone XS and newer read NFC with no app, and so do most Android phones with NFC switched on (it's on by default on most). For older phones without NFC, our free setup tool makes a QR code for the same review link." },
  { q: "How do I set it up?", a: `Two ways. Pick “Program it for me” for ${money2(CARD_PROGRAMMING.price)} and it arrives ready to tap. Or do it yourself in about two minutes: our setup guide finds your review link, then you write it to the card from your phone. Android phones on Chrome can do it right on our page; iPhones use the free ${NFC_APP.name} app.` },
  { q: "What does “Program it for me” mean?", a: `We write your Google review link to your cards and test them before they ship. It's ${money2(CARD_PROGRAMMING.price)} per order, however many cards you buy. Paste your link when you order, or leave it blank and we'll find it with you afterward.` },
  { q: "Can I just leave a card on the table or counter?", a: "Yes. Stores and restaurants do this all the time. Customers hold their phone over it and the review form opens. Because the card itself has no QR code, you can print the free QR sticker from our setup guide and put it beside the card for anyone who'd rather scan." },
  { q: "I work on the road. Does this still work?", a: "That's who it's built for. It's wallet size and waterproof, so keep it in your pocket or truck and hold it out when the job's done. It needs no battery, and the customer's phone does the rest." },
  { q: "Does it work for any business?", a: "Any business with a Google Business Profile: barbers, lawn care, mobile repair, cleaners, contractors, shops, restaurants, salons and clinics. If you don't have a profile yet, book a free call and we'll help you set one up." },
  { q: "Can I change the link later?", a: "Yes. Rewrite the card in the app anytime — for example if you open a second location. The only exception is if you choose to lock the card, which makes it permanent." },
  { q: "Is asking for reviews this way allowed by Google?", a: "Yes. Google encourages businesses to ask customers for reviews and provides the review link for exactly this. What's not allowed is offering incentives, asking only happy customers, or posting fake reviews. The card just makes asking quick." },
  { q: "Is there a QR code on the card?", a: "No — it's a clean NFC tap card, so it looks clean in your hand or on a counter. If you also want a QR code (for receipts, invoices or customers with older phones), our free setup tool makes one for your exact review link that you can print." },
  { q: "Will it work through a phone case?", a: "Through most cases, yes. Very thick, metal or magnetic wallet cases can block NFC — the customer just slips the phone out." },
  { q: "How long does shipping take?", a: `${REVIEW_CARD.shipping.processing}, and it ${REVIEW_CARD.shipping.delivery.toLowerCase()}. ${REVIEW_CARD.shipping.free ? "Shipping is free in the US." : ""}` },
  { q: "What if my card doesn't work?", a: REVIEW_CARD.guarantee },
  { q: "What are the card specs?", a: `${REVIEW_CARD.specs.chip} with ${REVIEW_CARD.specs.memory}, ${REVIEW_CARD.specs.material.toLowerCase()}, ${REVIEW_CARD.specs.size}. White matte front with “Review Us On Google”, black back with the Google G.` },
  { q: "Is this card made by Google?", a: `No. CEO Turbo review cards are an independent product that links to your Google review page. Google is a trademark of Google LLC; we're not affiliated with or endorsed by Google. Cards start at ${fromPriceLabel}.` },
];

export const SETUP_FAQS: FAQ[] = [
  { q: "My iPhone doesn't react when I tap the card", a: "Unlock the phone and hold the top edge of the iPhone (near the camera) flat against the card for a second or two. iPhone XS and newer read cards automatically. On iPhone 7, 8 and X, open the NFC Tag Reader from Control Center first." },
  { q: "My Android phone doesn't react", a: "Make sure NFC is on: Settings → Connected devices (or Connections) → NFC. Then hold the middle of the back of the phone against the card. The screen must be unlocked." },
  { q: "The app says “Write failed”", a: "Take the phone out of a thick or metal case, hold it still on the card until it finishes, and try again. If the card was locked it can't be rewritten — contact us and we'll replace it." },
  { q: "The tap opens my Google listing, not the review form", a: "You wrote a profile or Maps link instead of the review link. Get the link from “Ask for reviews” (or “Get more reviews”) in your Business Profile — it looks like g.page/r/…/review — and write the card again." },
  { q: "Can I keep the card on metal?", a: "Metal blocks NFC, so don't lay it on a metal counter or tailgate when a customer taps. Hold it in your hand or set it on wood, glass or plastic." },
  { q: "Should I lock the card?", a: "Only once you've tested it and you're sure the link is final. Locking stops anyone else rewriting it, but it's permanent — you can never change the link again." },
];
