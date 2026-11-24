// FAQs for the tech repair and office setup pages, shared by the page and its FAQPage schema so they always match.
import { SITE, fromPriceLabel } from "@/config/site";
import { INSTALL_PRICES, byId, itPrice, usd } from "@/content/pricing";

const camPrice = (id: string) => usd(INSTALL_PRICES.find((p) => p.id === id)!.price);
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import type { FAQ } from "@/content/services";

const AREA = ALL_SETUP_CITIES;
/** "Tampa, Brandon, … and Palmetto": every city we drive to, named, so people and search engines can match their town. */
const ALL = `${AREA.slice(0, -1).join(", ")} and ${AREA[AREA.length - 1]}`;

export const REPAIR_FAQS: FAQ[] = [
  { q: "How much does it cost?", a: `You get the price before any work starts. Starting prices: Windows speed-up ${itPrice("it-speedup")}, remote speed-up ${itPrice("it-remote")}, virus removal ${itPrice("it-virus")}, computer and laptop repair ${itPrice("it-pc-repair")}, desktop repair ${itPrice("it-desktop")}, SSD upgrade ${itPrice("it-ssd")}, phone and tablet setup ${itPrice("it-phone-setup")}. Parts are extra at cost.` },
  { q: "Do you really come to me?", a: "Yes, anywhere within about 1.5 hours of Temple Terrace, Florida: Tampa, St. Pete, Clearwater, Brandon, Lakeland, Winter Haven, Sarasota, Orlando and everywhere in between. Windows laptops and desktops are fixed at your home or business, and new phones, tablets and cameras are set up there too. You don't drop anything off or wait at a store." },
  { q: "Can you fix my computer remotely?", a: `Yes, for Windows computers, anywhere in the world: speed-ups, cleanup, scam pop-ups and software or email problems, fixed over the internet while you watch, from ${itPrice("it-remote")}. Hardware problems (won't turn on, broken parts, upgrades) need an in-person visit anywhere in Tampa Bay or Central Florida.` },
  { q: "What computer problems do you fix?", a: `Windows laptops and desktops, any brand: slow or freezing computers made fast, blue screens and crashing, computers that won't turn on or won't boot, viruses and pop-ups, SSD and memory upgrades, Windows reinstalls, data backup and transfer, printers and software. Repairs start ${itPrice("it-pc-repair")} and you get the exact price before any work.` },
  { q: "Do you fix phones, tablets or Macs?", a: `We set up phones and tablets, we don't repair them. Phone and tablet setup starts ${itPrice("it-phone-setup")}: a new iPhone, Android or iPad set up with your photos, contacts, texts, email and apps moved over. For a cracked phone screen or a bad battery, a phone repair shop is your best bet. We don't work on Macs or replace laptop screens. Windows laptops and desktops we repair.` },
  { q: "Do you sell computers?", a: "Yes. Laptops and desktops are listed in our computer shop at ceoturbo.com/computers, with photos, specs and secure checkout. We can set it up at your place anywhere in Tampa Bay or Central Florida and move your files over." },
  { q: "Where do you come to?", a: `Anywhere within about 1.5 hours of Temple Terrace, Florida: ${ALL}. Somewhere else in Florida? Text your ZIP code and we'll confirm. Remote support for Windows computers works anywhere in the world.` },
  { q: "Do you come to Brandon, St. Pete, Clearwater and Winter Haven?", a: `Yes. A lot of our customers are outside Tampa: Brandon, Riverview, St. Petersburg, Clearwater, Largo, Wesley Chapel, Lakeland, Winter Haven, Plant City, Bradenton, Sarasota and Orlando. Call or text ${SITE.phone.display} with your city.` },
  { q: "How fast can you come?", a: "Usually the same day or the next day. Call or text for the soonest time, or pick a slot on the calendar." },
  { q: "What's the diagnosis fee?", a: `${itPrice("it-visit")}, and it's credited toward the repair. So if we fix it, the diagnosis is free. If it can't be fixed, you don't pay for a repair we didn't do.` },
  { q: "Can you make my old computer feel new?", a: `Usually, yes. A cleanup plus an SSD upgrade makes most 5- to 10-year-old computers boot in seconds. Upgrade labor starts at ${itPrice("it-ssd")}, and we'll tell you honestly if a new computer makes more sense.` },
  { q: "Is my data safe?", a: "We don't open your files, photos or messages to fix a device, and we don't copy anything unless you ask us to move it." },
  { q: "Do you work with businesses?", a: `Yes. Offices, shops, restaurants and salons: workstations, printers, networks, TVs and menu screens. On-site IT is ${itPrice("it-business-hour")} an hour, and full office setups are on our office setup page.` },
  { q: "How do I pay?", a: "After the job is done and you've checked it works. Card, cash, Zelle or Cash App." },
];

export const OFFICE_FAQS: FAQ[] = [
  { q: "How much does an office setup cost?", a: `A single desk with computer setup is ${usd(byId("office-basic").price)}. A full workstation with multi-monitor mounting and cable management is ${usd(byId("office-complete").price)} per desk. Whole-office transformations start at ${usd(byId("office-transform-basic").price)} and are quoted in writing first.` },
  { q: "Can you set me up to use two computers at one desk?", a: "Yes. We set up one keyboard, mouse and monitors to control a work laptop and a personal or second computer, using a KVM switch or software, so you switch with one click." },
  { q: "Do you bring the equipment?", a: "You can buy it, or we buy it at cost and show you the receipts. We'll send you a list of exactly what to get before the visit." },
  { q: "How long does it take?", a: "Most home offices and single desks take 2 to 4 hours. A small office is usually one day, and bigger build-outs get a timeline with the quote." },
  { q: "Do you organize files and accounts too?", a: "Yes. We set up Microsoft 365 or Google Workspace email, shared drives and a simple folder system, and move files over from old computers." },
  { q: "Do you install restaurant menu screens?", a: "Yes. We design the menu boards, mount the TVs and set them up to show your menu, like we've done for restaurants and lounges." },
  { q: "Where do you work?", a: `Tampa Bay and Central Florida, anywhere within about 1.5 hours of Temple Terrace: ${ALL}. Call or text ${SITE.phone.display} to confirm your address.` },
  { q: "Can you work after hours?", a: "Yes. We regularly set up offices before opening or after closing so your team isn't interrupted." },
];

/** The homepage FAQ (and its schema): the repair questions people ask most, then office setup. */
export const TECH_HOME_FAQS: FAQ[] = [
  ...REPAIR_FAQS.filter((f) => ["How much does it cost?", "Do you really come to me?", "What computer problems do you fix?", "Can you fix my computer remotely?", "Do you fix phones, tablets or Macs?", "How fast can you come?", "Do you come to Brandon, St. Pete, Clearwater and Winter Haven?"].includes(f.q)),
  ...OFFICE_FAQS.filter((f) => ["How much does an office setup cost?", "Can you work after hours?"].includes(f.q)),
  { q: "Do you install security cameras and Ring doorbells?", a: `Yes. We install Ring, Nest, Blink and Wyze video doorbells and Wi-Fi cameras at homes and businesses from Tampa Bay to Orlando, Lakeland and Sarasota, then set up the app and alerts on your phone. Labor is ${camPrice("cam-doorbell")} for a doorbell and ${camPrice("cam-wifi")} per camera; the gear is yours or we tell you what to buy.` },
  { q: "Do you also help businesses get more customers?", a: "Yes. Besides tech support, CEO Turbo builds websites, runs Google, Meta and TikTok ads, optimizes social media profiles, fixes SEO, AEO, GEO and DNS problems, and sells NFC Google review cards. Those work for businesses anywhere, not just Tampa. See ceoturbo.com/grow." },
  { q: "How do Google review cards help my business?", a: `A customer taps their phone on the card and your Google review form opens, so more happy customers actually leave a review. More recent reviews build trust with people comparing you, help you show up in Google Maps, and give Google and AI assistants like ChatGPT more reasons to recommend you. Cards start at ${fromPriceLabel} with free US shipping at ceoturbo.com/google-review-cards.` },
];
