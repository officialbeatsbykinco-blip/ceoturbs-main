// FAQs for the tech repair and office setup pages, shared by the page and its FAQPage schema so they always match.
import { SITE } from "@/config/site";
import { byId, itPrice, usd } from "@/content/pricing";
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import type { FAQ } from "@/content/services";

const AREA = ALL_SETUP_CITIES;
/** "Tampa, Brandon, … and Palmetto": every city we drive to, named, so people and search engines can match their town. */
const ALL = `${AREA.slice(0, -1).join(", ")} and ${AREA[AREA.length - 1]}`;

export const REPAIR_FAQS: FAQ[] = [
  { q: "How much does it cost?", a: `You get the price before any work starts. Starting prices: Windows speed-up ${itPrice("it-speedup")}, remote speed-up ${itPrice("it-remote")}, virus removal ${itPrice("it-virus")}, computer repair ${itPrice("it-pc-repair")}, SSD upgrade ${itPrice("it-ssd")}, iPhone screen ${itPrice("it-iphone-screen")}, iPhone battery ${itPrice("it-iphone-battery")}. Parts are extra at cost.` },
  { q: "Do you really come to me?", a: "Yes. Computers, phones, tablets, printers, TVs and Wi-Fi are fixed at your home or business. You don't drop anything off or wait at a store." },
  { q: "Can you fix my computer remotely?", a: `Only speed-ups for a slow Windows computer: we clear out junk, startup clutter and old updates over the internet while you watch, from ${itPrice("it-remote")}. It works anywhere in the US. Viruses, crashes, hardware, Macs, phones and tablets need an in-person visit.` },
  { q: "Where do you come to?", a: `Anywhere within about 40 miles of Tampa, Florida: ${ALL}. Somewhere else nearby? Text your ZIP code and we'll confirm.` },
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
  { q: "Where do you work?", a: `Tampa and about 40 miles around it: ${ALL}. Call or text ${SITE.phone.display} to confirm your address.` },
  { q: "Can you work after hours?", a: "Yes. We regularly set up offices before opening or after closing so your team isn't interrupted." },
];
