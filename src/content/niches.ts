// /salons and /barbershops — two niche landing pages built from one template (NichePage).
// Walk-in and cold-outreach targets: the card goes on the counter, the mirror and the chair.
// Real proof only: nothing here claims client results we don't have. Google's review rules apply.
import { fromPriceLabel } from "@/config/site";
import type { FAQ } from "@/content/services";

export type Niche = {
  path: string;
  kicker: string;
  h1: string;
  lede: string;
  bookNote: string;
  bookPrefill: string;
  spot: { title: string; body: string }[];
  checkup: string[];
  faqSection: string;
  faqs: FAQ[];
  finalTitle: string;
  finalLede: string;
};

const SHARED_FAQS: FAQ[] = [
  { q: "How does the review card work at my station?", a: "Each card has an NFC chip programmed with your Google review link. A client holds their phone near it and your Google review form opens. No app, no searching for your business." },
  { q: "Will it work on every phone?", a: "iPhone XS and newer, and most NFC-enabled Android phones. Older phones without NFC can still review by typing your business name on Google." },
  { q: "Can I give a discount or free service for a review?", a: "No. Google doesn't allow discounts, freebies or contests in exchange for reviews, and it can remove reviews that break the rules. Ask every client the same way. The card just makes it a 10-second tap." },
  { q: "Do I need to program the cards myself?", a: "You can. It takes about 2 minutes with the free NFC Tools app and our step-by-step guide. If you'd rather we set it up on the call, we can do that too." },
  { q: "How much does it cost?", a: `Review cards start at ${fromPriceLabel} and you can buy them right on the page. Google Business Profile setup and the rest of the plan are a fixed price we give you on the free call, based on what your shop needs.` },
];

export const NICHES: Record<"salons" | "barbershops", Niche> = {
  salons: {
    path: "/salons",
    kicker: "Hair & beauty salons",
    h1: "More bookings and 5-star Google reviews from every chair.",
    lede: "Clients already love your work. Most never leave a review because they forget. A card on the station turns a happy appointment into a review in 10 seconds, and your Google profile shows the work that gets people to book.",
    bookNote: "Salons page",
    bookPrefill: "Salon. I want more bookings and Google reviews. Help with my Google Business Profile, booking page and review cards.",
    spot: [
      { title: "The front desk", body: "Card next to the card reader. Clients see it while they pay and before they leave." },
      { title: "Every station", body: "One card by each chair or the mirror. Stylists can point to it after a great color or cut." },
      { title: "The take-home card", body: "Slip one in the bag with a receipt or a booking card. Easy to tap from the car." },
    ],
    checkup: [
      "Your Google Business Profile has your real hours, services and prices",
      "It has fresh photos of your work (before and after, with permission)",
      "Your booking link is on the Google profile and works on a phone",
      "Clients get a review link after every visit, not just when they remember",
      "You reply to every Google review, good or bad, within a few days",
    ],
    faqSection: "Salon questions",
    faqs: [
      { q: "Can you set up my Google Business Profile for salons?", a: "Yes. We set up or clean up your listing: services, prices, hours, booking link, photos and categories. Google controls the listing, so you'll confirm ownership on your account." },
      { q: "Do you do the booking system too?", a: "We connect your booking link to your Google profile and your website. If you already use a booking app, we keep it. We don't force you to switch." },
      { q: "We have a lot of reviews already. Why do I need cards?", a: "Because reviews keep coming in after the first 50. Steady new reviews help your listing stay active, and the newest ones are what new clients read first." },
      ...SHARED_FAQS,
    ],
    finalTitle: "Let's fill your chairs.",
    finalLede: "Free 30-minute call. Bring your Google profile and your booking link. We'll show you what's costing you bookings and what it costs to fix.",
  },
  barbershops: {
    path: "/barbershops",
    kicker: "Barbershops",
    h1: "Turn every fresh cut into a 5-star Google review.",
    lede: "Your shop runs on walk-ins and regulars. Google decides which barber a new guy picks when he searches \"barbershop near me.\" A card by the chair gets your regulars reviewing while they're still in the chair.",
    bookNote: "Barbershops page",
    bookPrefill: "Barbershop. I want more walk-ins and Google reviews. Help with my Google Business Profile, booking and review cards.",
    spot: [
      { title: "The chair", body: "Card on the mirror or the arm of the chair. Done with the cut, the client taps before he stands up." },
      { title: "The waiting area", body: "A card on the bench or the sign-in board for the guys waiting their turn." },
      { title: "The checkout", body: "Next to the register or tip jar. One tap, then it's done." },
    ],
    checkup: [
      "Your Google Business Profile shows your hours, services and walk-in policy",
      "It has real photos of fades and cuts, with the barber's name on the work",
      "Each barber has a link or card, so reviews name the right person",
      "Regulars get asked for a review after the cut, not only the new guys",
      "You reply to every Google review within a few days",
    ],
    faqSection: "Barbershop questions",
    faqs: [
      { q: "Can each barber have their own card?", a: "Yes. Each card can point to the shop, or to one barber's review page. Reviews that name a barber help new clients pick the chair they want." },
      { q: "Will the card work for walk-ins?", a: "Yes. The review link is always the same, so a walk-in can tap, review and leave in one motion. You don't need an app or a QR code to scan." },
      ...SHARED_FAQS,
    ],
    finalTitle: "Let's get the chairs full.",
    finalLede: "Free 30-minute call. Bring your Google profile and your hours. We'll show you where new guys can't find you and what it costs to fix.",
  },
};
