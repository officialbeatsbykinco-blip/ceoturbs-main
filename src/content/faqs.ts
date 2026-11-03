import type { FAQ } from "./services";
import { fromPriceLabel } from "@/config/site";
import { price, PRICING_TERMS } from "@/content/pricing";

export const HOME_FAQS: FAQ[] = [
  { q: "What does CEO Turbo do?", a: `CEO Turbo is a growth agency founded by Christopher Robinson. We build websites, run Meta, Google, TikTok and X ads, set up and optimize Google Business Profiles and social profiles, design promotional emails, and do SEO, AEO and GEO so you show up in Google and AI answers. We also sell NFC Google review cards (from ${fromPriceLabel}) that let customers leave a review with one tap.` },
  { q: "What are SEO, AEO and GEO?", a: "SEO ranks you in Google's results and map pack. AEO (answer engine optimization) gets your answers quoted in Google's AI Overviews and voice assistants. GEO (generative engine optimization) gets you named when people ask ChatGPT, Gemini or Perplexity who to hire. Every website we build is set up for all three." },
  { q: "Which ad platforms do you run?", a: "Google Ads, Meta (Facebook and Instagram) ads and YouTube ads, with call and form tracking so you can see what each dollar brings back. You keep ownership of your own ad accounts." },
  { q: "Who do you work with?", a: "Three groups: independent artists and producers, local service businesses (home services, auto, landscaping, barbers, mobile services), and Shopify or online stores. Each has its own page with the work we've done for that group." },
  { q: "What happens on the free call?", a: "It's a free 30-minute call. We look at your website, Google profile, social profiles and ads with you, tell you the biggest thing holding back calls or sales, and lay out what we'd do. If it's a fit, you get a written scope and price. If not, you keep the advice." },
  { q: "How much do your services cost?", a: `Every price is published: setup packages from ${price("pkg-start")} — the whole package with a new website, SEO/AEO/GEO, tracking, profiles, email and ad setup is ${price("pkg-launch")} — and monthly plans from ${price("care")}/mo (${price("growth")}/mo with ads management). Need one thing? Google Business Profile setup is ${price("gbp-setup")}. No long-term contracts, and ad spend goes straight to the platform from your own account. Full list at ceoturbo.com/pricing.` },
  { q: "Will this actually bring me more customers?", a: "That's exactly what we're built for. Our Meta lead campaigns have delivered 161 leads at about $7.40 each. In one day of Google Ads, Appliance King got 2 conversions for $6.57. And 19 client websites we built are live and bringing in business. We put the work where it moves your numbers fastest — and you see those numbers every week." },
  { q: "Do you guarantee results?", a: `Yes, on the ads. ${PRICING_TERMS.guarantee}` },
  { q: "Where are you based?", a: "CEO Turbo is founder-led and based in Atlanta, Georgia, and we work with businesses all over the world. Calls, websites and ads are all handled online, so where you are doesn't matter." },
];

export const AUDIT_FAQS: FAQ[] = [
  { q: "What does the free audit check?", a: "It loads your website and checks the things Google and AI tools look at: titles, headings, content, mobile setup, speed, sitemap, schema markup, FAQ content, phone and location, whether AI crawlers like ChatGPT and Perplexity are blocked, llms.txt, links to your profiles, and whether you appear in open knowledge sources like Wikidata. For businesses it also scores your Google reviews and profile." },
  { q: "What's the difference between SEO, AEO and GEO?", a: "SEO gets you ranked in Google's regular results and map pack. AEO (answer engine optimization) gets your answers quoted in Google's AI Overviews and voice assistants. GEO (generative engine optimization) gets you named when people ask ChatGPT, Gemini or Perplexity who to hire or listen to." },
  { q: "Is it really free?", a: "Yes. No credit card. We ask for your name, email and phone so we can send follow-up help and, if you want, walk you through the report on a free call." },
  { q: "I don't have a website. Can I still run it?", a: "Yes. Leave the website blank — the report shows what you're missing and checks the places you can already be found." },
  { q: "Does it work for artists?", a: "Yes. Switch to Artist and it checks your site or link, whether you own your name on Google, and whether you're in the music and knowledge databases AI tools use, like MusicBrainz, Wikidata and Wikipedia." },
  { q: "What happens after the report?", a: "You can fix things yourself with the steps in the report, or book a free 30-minute call and we'll give you a fixed-price plan to fix them for you." },
];

/** Objection-handling FAQs for the ad landing page and the Brand Boost page. */
export const BOOK_FAQS: FAQ[] = [
  { q: "Is the call really free?", a: "Yes. It's 30 minutes, free, on video or phone. You leave with a clear plan whether you hire us or not." },
  { q: "Is this just a sales pitch?", a: "No pitch deck. We look at your website, Google profile, reviews, socials and ads with you live and tell you what's costing you customers. If you want us to fix it, you get a fixed price in writing. If not, you keep the plan." },
  { q: "How much does it cost to work with you?", a: `You only pay for what you need, and every price is on our pricing page: setup packages from ${price("pkg-start")}, the whole package ${price("pkg-launch")}, monthly plans from ${price("care")}/mo. On the call we tell you which pieces will bring customers fastest for your budget — the call itself is free.` },
  { q: "I've tried ads before and wasted money. Why is this different?", a: "Most ads fail because of the offer, the page they land on or the follow-up — not the ad itself. We fix all three. Our Meta campaigns have brought in 161 leads at about $7.40 each, and you see the real dashboards before you spend a dollar." },
  { q: "Do you guarantee results?", a: `Yes, on the ads. ${PRICING_TERMS.guarantee}` },
  { q: "I don't have a website. Should I still book?", a: "Yes. Many clients start with no site or a weak one. We'll tell you whether you need one now or whether your Google profile and reviews will bring customers faster." },
  { q: "Do you work with artists, not just businesses?", a: "Yes. For artists we focus on more listeners and fans: release pages, Spotify and YouTube growth campaigns, and owning your name on Google." },
  { q: "What should I have ready for the call?", a: "Just your website or social links and an idea of how many more customers or listeners you want. We do the digging." },
];

export const LOCAL_GOOGLE_ADS_FAQS: FAQ[] = [
  { q: "How much does it cost?", a: `Setup is ${price("pkg-start")} one-time: your search campaign, call and form tracking, and your Google Business Profile. Then Turbo Growth is ${price("growth")}/mo with your ads managed every week. Your ad spend is separate and goes straight to Google from your own card.` },
  { q: "Is there a contract?", a: "No long-term contract. Stay because the phone rings, not because you signed something." },
  { q: "Who owns the ad account?", a: "You do. The campaign runs in your own Google Ads account and you can remove our access any time." },
  { q: "Can you guarantee calls?", a: `We don't promise a set number of calls, but we do back the work. ${PRICING_TERMS.guarantee} You also get a campaign aimed at people searching for your service right now, with every call and form tracked.` },
];

export const ADS_NOT_CONVERTING_FAQS: FAQ[] = [
  { q: "Why aren't my ads converting?", a: "Usually it's measurement, not the ad itself: conversions that aren't tracked or are counted twice, broken pixels or Conversions API events, every conversion treated as equal value, and junk search terms nobody excluded. The audit shows which ones apply to you." },
  { q: "What is Conversion Rescue?", a: `A one-time audit and fix (${price("conversion-rescue")}) of GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft conversions and Merchant Center. You get real conversion values, every event tested live, a written wasted-spend fix list and a 30-minute walkthrough.` },
  { q: "What is Tracking Watch?", a: `A small monthly plan (${price("tracking-watch")}/mo): a monthly check of every tag and pixel, search-term negatives on one ad platform, conversion values tuned as your numbers change, and a plain-English waste report. Turbo Care, Growth and Scale already include it.` },
  { q: "Is it included in your packages?", a: `Yes. Conversion Rescue is part of Turbo Start (${price("pkg-start")}), Turbo Launch (${price("pkg-launch")}) and Turbo Dominate (${price("pkg-dominate")}), so the tracking is done right from day one.` },
  { q: "Do you run my ads too?", a: `Optional. Turbo Growth (${price("growth")}/mo) includes weekly ads management. Many clients start with Conversion Rescue, see where the money was going, and decide after.` },
  { q: "Will you guarantee more sales?", a: `We don't promise a sales number, but we do back the ads we run. ${PRICING_TERMS.guarantee} You also get a clear view of which ads, keywords and pages produce calls and sales, and ad platforms that learn from accurate data instead of guessing.` },
  { q: "What access do you need?", a: "An admin or partner invite on your ad accounts, GA4, Tag Manager and website, never your passwords. You own everything and can remove access whenever you like." },
];
