// /restaurants — the restaurant niche page: delivery apps, menus (printed + on TVs), Maps listings
// and a review card on every table. Real proof only: the Exclusive Restaurant & Lounge install.
import { fromPriceLabel } from "@/config/site";
import type { FAQ } from "@/content/services";

export const RESTAURANTS_PATH = "/restaurants";

export const INSTALL = {
  name: "Exclusive Restaurant & Lounge",
  place: "Covington, GA",
  video: "/media/restaurant-install.mp4",
  poster: "/media/restaurant-install-poster.webp",
  width: 540,
  height: 960,
  menus: [
    { src: "/img/restaurants/menu-entrees.webp", small: "/img/restaurants/menu-entrees-800.webp", alt: "Exclusive Restaurant & Lounge TV menu: entrées and main plates with a photo and price for every plate" },
    { src: "/img/restaurants/menu-drinks.webp", small: "/img/restaurants/menu-drinks-800.webp", alt: "Exclusive Restaurant & Lounge TV menu: sides, soup and cold drinks with photos and prices" },
  ],
} as const;

/** The restaurant checkup: every "no" becomes a line on the booking note. */
export const CHECKUP = [
  { id: "doordash", q: "On DoorDash", fix: "DoorDash setup" },
  { id: "ubereats", q: "On Uber Eats", fix: "Uber Eats setup" },
  { id: "grubhub", q: "On Grubhub", fix: "Grubhub setup" },
  { id: "photos", q: "Delivery menus have a real photo for every plate", fix: "Delivery menu photos & cleanup" },
  { id: "google", q: "Google Maps shows your hours, menu and food photos", fix: "Google Maps listing" },
  { id: "apple", q: "You're on Apple Maps with the right hours", fix: "Apple Maps listing" },
  { id: "tv", q: "Your menu is on TVs (not paper taped to the wall)", fix: "Digital TV menus" },
  { id: "cards", q: "Every table has a way to leave a Google review", fix: "Review cards for every table" },
] as const;

export const RESTAURANT_FAQS: FAQ[] = [
  { q: "Can you get my restaurant on DoorDash, Uber Eats and Grubhub?", a: "Yes. We set up your store and menu on each app with you: categories, photos, descriptions, prices, modifiers and hours. The apps verify that you own the restaurant, so you'll provide things like your business details and payout bank info yourself. Each app sets its own commission and fees — we don't control those or take a cut of your orders." },
  { q: "We're already on DoorDash but the menu is a mess. Can you fix it?", a: "Yes. We rebuild what's there: real photos for every plate, clear names and descriptions, correct prices and add-ons, and hours that match your door. A clean menu is easier to order from." },
  { q: "Do you install the menus on our TVs?", a: "Yes. We design your menu boards and install them on your TVs, like we did for Exclusive Restaurant & Lounge in Covington, GA. If you don't have TVs yet, we'll tell you what to get on the call." },
  { q: "Can you update prices or items later?", a: "Yes. Digital menus are easy to change when prices or items change. Tell us on the call how often you update your menu and we'll set it up for that." },
  { q: "Do you make printed menus too?", a: "Yes — table menus, counter menus and to-go menus that match your TV boards and delivery menus, so everything looks like one restaurant." },
  { q: "How do the review cards work at a table?", a: "Each card has an NFC chip programmed with your Google review link. A guest holds their phone near it and your Google review form opens — no app, no searching. Drop it with the check, or keep one standing on every table." },
  { q: "Can we give a free dessert for a review?", a: "No. Google doesn't allow discounts, freebies or contests in exchange for reviews, and it can remove reviews that break the rules. Ask every guest the same way — the card just makes it a 10-second tap." },
  { q: "How much does it cost?", a: `Review cards start at ${fromPriceLabel} and you can buy them right on this page. Delivery app setup, menus and TV installs are a fixed price we give you on the free call, based on what your restaurant actually needs — no surprise monthly fees.` },
];
