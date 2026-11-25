// City pages for in-home computer and phone repair (/computer-repair-<city>-fl). One page per city people search
// for ("computer repair Brandon FL", "phone screen repair Lakeland"), each with its own local facts: county, the
// drive from Temple Terrace, ZIP codes, nearby areas and city-specific answers. Tampa itself is covered by
// /computer-repair-tampa and /phone-repair-tampa, so it has no city page here (that would compete with them).
// Keep every fact checkable: no invented job counts, addresses or local claims.
import { SITE } from "@/config/site";
import { itPrice } from "@/content/pricing";
import type { FAQ } from "@/content/services";

export type RepairCity = {
  /** URL part: /computer-repair-<slug>-fl */
  slug: string;
  city: string;
  county: string;
  /** Typical drive from Temple Terrace, outside rush hour. */
  drive: string;
  route: string;
  zips: string[];
  /** Neighborhoods and nearby towns we also come to on the same trip. */
  nearby: string[];
  /** One paragraph that only fits this city. */
  local: string;
  faqs: FAQ[];
};

export const cityRepairPath = (c: Pick<RepairCity, "slug">) => `/computer-repair-${c.slug}-fl`;

const text = `Call or text ${SITE.phone.display}`;

export const REPAIR_CITIES: RepairCity[] = [
  {
    slug: "brandon",
    city: "Brandon",
    county: "Hillsborough County",
    drive: "about 20 minutes",
    route: "down I-75 from Temple Terrace",
    zips: ["33510", "33511"],
    nearby: ["Bloomingdale", "Valrico", "Seffner", "Riverview", "Dover", "FishHawk"],
    local:
      "Brandon is one of our closest stops: about 20 minutes down I-75 from our base in Temple Terrace. That makes it easy to fit a same-day or next-day visit for a slow laptop, a desktop that won't turn on or a cracked phone screen, at home or at work, without you driving across town or leaving your device at a counter.",
    faqs: [
      { q: "Do you come to my house in Brandon for computer repair?", a: `Yes. We fix Windows laptops and desktops at homes and businesses all over Brandon (33510, 33511) and next door in Bloomingdale, Valrico and Seffner. ${text} and you get the price before any work.` },
      { q: "How fast can you get to Brandon?", a: "Brandon is about 20 minutes from us, so same-day or next-day visits are usually possible. Text your address and the problem and we'll give you the next opening." },
      { q: "Do you fix phone screens and batteries in Brandon?", a: "Yes. iPhone, Samsung, Pixel and iPad screens and batteries are replaced at your place in Brandon. Text the model and you get one price with the part included before we order it." },
    ],
  },
  {
    slug: "riverview",
    city: "Riverview",
    county: "Hillsborough County",
    drive: "about 30 minutes",
    route: "down I-75 from Temple Terrace",
    zips: ["33569", "33578", "33579"],
    nearby: ["Brandon", "Gibsonton", "Apollo Beach", "FishHawk", "Lithia", "Ruskin"],
    local:
      "Riverview has grown fast, and a lot of homes here are full of family laptops, work-from-home desktops and phones that all need to keep working. We come to Riverview from Temple Terrace in about 30 minutes down I-75, fix the computer or phone at your kitchen table, and test it with you before we leave.",
    faqs: [
      { q: "Is there in-home computer repair in Riverview, FL?", a: `Yes. We repair Windows laptops and desktops at homes and offices across Riverview (33569, 33578, 33579), plus Gibsonton, Apollo Beach and FishHawk. ${text}.` },
      { q: "Can you fix a work-from-home computer in Riverview?", a: `Yes. Slow startups, crashes, Wi-Fi drops, printers and email are fixed on-site, and a slow Windows computer can also be sped up remotely from ${itPrice("it-remote")}.` },
      { q: "Do you replace phone screens in Riverview?", a: "Yes. Text the phone or tablet model and what's wrong. You get one price with the part included, we order the part for your exact model, then come to you." },
    ],
  },
  {
    slug: "wesley-chapel",
    city: "Wesley Chapel",
    county: "Pasco County",
    drive: "about 25 minutes",
    route: "up I-75 from Temple Terrace",
    zips: ["33543", "33544", "33545"],
    nearby: ["Seven Oaks", "Meadow Pointe", "Wiregrass", "Lutz", "Land O' Lakes", "Zephyrhills"],
    local:
      "Wesley Chapel is about 25 minutes up I-75 from us, so it's an easy trip for a home visit. Whether it's a gaming PC in Seven Oaks, a school laptop in Meadow Pointe or a cracked iPhone near Wiregrass, we come to you, give you the price first and fix it there.",
    faqs: [
      { q: "Do you do computer repair in Wesley Chapel?", a: `Yes. We fix Windows laptops, desktops and gaming PCs at homes and businesses across Wesley Chapel (33543, 33544, 33545), Lutz and Land O' Lakes. ${text}.` },
      { q: "Do you work on gaming PCs in Wesley Chapel?", a: "Yes. Power supplies, graphics cards, crashes, overheating and slow FPS are all fixed in person. Low FPS can also be tuned remotely." },
      { q: "Can you fix my phone screen at my house in Wesley Chapel?", a: "Yes. Text the model and what's wrong for one price with the part included. We order the part for your exact phone and come to you." },
    ],
  },
  {
    slug: "st-petersburg",
    city: "St. Petersburg",
    county: "Pinellas County",
    drive: "about 35 to 40 minutes",
    route: "across the Howard Frankland Bridge on I-275",
    zips: ["33701", "33702", "33703", "33704", "33705", "33707", "33709", "33710", "33713", "33716"],
    nearby: ["Downtown St. Pete", "Kenwood", "Old Northeast", "Pinellas Park", "Gulfport", "St. Pete Beach"],
    local:
      "St. Pete is about 35 to 40 minutes from Temple Terrace across the Howard Frankland. Condos downtown, bungalows in Kenwood and offices along Central Avenue all get the same thing: the price before we start, the repair done at your place, and no fix, no charge on the repair.",
    faqs: [
      { q: "Is there in-home computer repair in St. Petersburg, FL?", a: `Yes. We repair Windows laptops and desktops at homes, condos and offices across St. Petersburg, plus Pinellas Park, Gulfport and St. Pete Beach. ${text}.` },
      { q: "Do you come to condos and apartments in St. Pete?", a: "Yes. Text the building and parking details and we'll come up to your unit. Most visits take about an hour." },
      { q: "Do you fix iPhone and Samsung screens in St. Pete?", a: "Yes. Text the model for one price with the part included. We order the part for your exact phone and replace it at your place." },
    ],
  },
  {
    slug: "clearwater",
    city: "Clearwater",
    county: "Pinellas County",
    drive: "about 40 minutes",
    route: "over the Courtney Campbell Causeway or the Howard Frankland",
    zips: ["33755", "33756", "33759", "33760", "33761", "33762", "33763", "33764", "33765", "33767"],
    nearby: ["Clearwater Beach", "Largo", "Dunedin", "Safety Harbor", "Palm Harbor", "Oldsmar"],
    local:
      "Clearwater is about 40 minutes from Temple Terrace over the Courtney Campbell or the Howard Frankland. We fix computers and phones at homes, condos and small businesses from Countryside to Clearwater Beach, and the same trip covers Largo, Dunedin and Safety Harbor.",
    faqs: [
      { q: "Do you do computer repair in Clearwater, FL?", a: `Yes. We repair Windows laptops and desktops at homes and businesses across Clearwater, Largo, Dunedin and Safety Harbor. ${text} and you get the price before any work.` },
      { q: "Do you help small businesses in Clearwater?", a: `Yes. Workstations, printers, Wi-Fi and point-of-sale computers are fixed on-site. Business IT work is ${itPrice("it-business-hour")} an hour.` },
      { q: "Do you fix phone and iPad screens in Clearwater?", a: "Yes. Text the model and what's wrong. You get one price with the part included, then we come to you." },
    ],
  },
  {
    slug: "lakeland",
    city: "Lakeland",
    county: "Polk County",
    drive: "about 45 minutes",
    route: "east on I-4 from Temple Terrace",
    zips: ["33801", "33803", "33805", "33809", "33810", "33811", "33812", "33813"],
    nearby: ["South Lakeland", "Highland City", "Mulberry", "Plant City", "Auburndale", "Winter Haven"],
    local:
      "Lakeland is about 45 minutes east of us on I-4, and we come to Lakeland for computer and phone repairs at homes and businesses. Text your ZIP and the problem first: you get the price up front and the next opening, then we come to your home or business and fix it there.",
    faqs: [
      { q: "Is there in-home computer repair in Lakeland, FL?", a: `Yes. We repair Windows laptops and desktops at homes and businesses across Lakeland, plus Mulberry, Auburndale and Plant City. ${text} for the price and the next opening.` },
      { q: "How soon can you come to Lakeland?", a: "Lakeland is about 45 minutes from us. Text your ZIP and the problem and we'll give you the next opening. A slow Windows computer can also be sped up remotely the same day." },
      { q: "Do you repair phones and tablets in Lakeland?", a: "Yes. iPhone, Samsung, Pixel and iPad screens and batteries. Text the model for one price with the part included." },
    ],
  },
  {
    slug: "winter-haven",
    city: "Winter Haven",
    county: "Polk County",
    drive: "about 1 hour",
    route: "east on I-4 and down US-92 or Polk Parkway",
    zips: ["33880", "33881", "33884"],
    nearby: ["Auburndale", "Lake Alfred", "Eagle Lake", "Haines City", "Bartow", "Lakeland"],
    local:
      "Winter Haven is about an hour from Temple Terrace, and we come to the Chain of Lakes for computer and phone repairs. Because it's a longer drive, text the device and problem first: you get the price and the next opening, and we often fit Auburndale, Lake Alfred or Haines City into the same trip.",
    faqs: [
      { q: "Do you do computer repair in Winter Haven, FL?", a: `Yes. We repair Windows laptops and desktops at homes and businesses in Winter Haven (33880, 33881, 33884), Auburndale, Lake Alfred and Haines City. ${text} for the price and the next opening.` },
      { q: "Do you fix phone screens in Winter Haven?", a: "Yes. Text the iPhone, Samsung, Pixel or iPad model and what's wrong. You get one price with the part included, we order the part, then come to you." },
      { q: "Is there a remote option if I'm in Winter Haven?", a: `Yes. A slow Windows computer, pop-ups or software problems can be fixed over the internet while you watch, from ${itPrice("it-remote")}, often the same day.` },
    ],
  },
  {
    slug: "orlando",
    city: "Orlando",
    county: "Orange County",
    drive: "about 1.5 hours",
    route: "east on I-4 from Temple Terrace",
    zips: ["32801", "32803", "32804", "32806", "32807", "32809", "32812", "32819", "32822", "32835"],
    nearby: ["Kissimmee", "Winter Garden", "Ocoee", "Clermont", "Celebration", "Davenport"],
    local:
      "Orlando is the far edge of where we drive: about an hour and a half east on I-4. We book Orlando-area visits ahead, so text the device, the problem and your ZIP and you get the price and the next opening. Slow Windows computers don't have to wait: we can fix those remotely, usually the same day.",
    faqs: [
      { q: "Do you come to Orlando for computer repair?", a: `Yes. We repair Windows laptops and desktops at homes and businesses in Orlando, Kissimmee, Winter Garden, Ocoee and Clermont. Visits are booked ahead. ${text} for the price and the next opening.` },
      { q: "Can you fix my computer remotely in Orlando?", a: `Yes. Slow computers, pop-ups, viruses and software problems on Windows are fixed over the internet while you watch, from ${itPrice("it-remote")}, usually the same day.` },
      { q: "Do you repair phone screens in Orlando?", a: "Yes. Text the model and what's wrong. You get one price with the part included, and we schedule the repair at your place." },
    ],
  },
];

export const repairCity = (path: string) => REPAIR_CITIES.find((c) => cityRepairPath(c) === path.replace(/\/$/, ""));
