// The computer shop (/computers): copy and FAQs. Listings come from Shopify (src/lib/computers.ts).
import { SITE } from "@/config/site";
import { itPrice } from "@/content/pricing";
import type { FAQ } from "@/content/services";

export const COMPUTERS_PATH = "/computers";
export const computerPath = (handle: string) => `${COMPUTERS_PATH}/${handle}`;
/** Prerendered shell for a listing added after the last deploy (vercel.json rewrites unknown /computers/* here). */
export const COMPUTER_SHELL = "__listing";

export const SHOP_PERKS = [
  { title: "Buy from a computer tech", body: "Ask what's inside, what it's good for and whether it fits your budget. You get a straight answer from the person who fixes computers." },
  { title: "Set up at your place", body: "In Tampa Bay? We can set it up at your home or office and move your files over from the old one." },
  { title: "Repairs from the same person", body: "Upgrades, speed-ups and repairs later come from us, in person around Tampa or remotely from anywhere." },
];

export const SHOP_FAQS: FAQ[] = [
  { q: "How do I buy a computer?", a: "Pick one, choose any options, and tap Buy now. Checkout is handled by Shopify, so you pay securely by card or an express option like Shop Pay. Shipping or pickup options and the total show before you pay." },
  { q: "Can you set it up and move my files?", a: `Yes. In Tampa Bay we can set up your new computer at your home or office and move your photos, files and email from the old one (data transfer ${itPrice("it-data")}). Call or text ${SITE.phone.display} and we'll plan it with your order.` },
  { q: "I don't see what I need. Can you find one?", a: `Probably. Tell us your budget and what you'll use it for (school, work, gaming, editing) and we'll recommend one or find it for you. Call or text ${SITE.phone.display}.` },
  { q: "Should I buy a new computer or fix my old one?", a: `Often a cleanup and an SSD upgrade makes an old computer fast again for much less (SSD upgrade ${itPrice("it-ssd")} plus the drive). We'll tell you honestly which makes more sense.` },
  { q: "Can I ask questions before I buy?", a: `Yes, please do. Call or text ${SITE.phone.display} and you'll talk to Chris, the tech who fixes and sells the computers.` },
];
