// A review-card pitch written for what each guide's reader just learned, so the offer reads as the next step, not an ad.
export type GuideOffer = { kicker: string; head: string; body: string; cta: string };

export const DEFAULT_OFFER: GuideOffer = {
  kicker: "The easiest review you'll ever ask for",
  head: "One tap opens your Google review form.",
  body: "Put the card where customers pay. They tap, they rate, you rank higher in Maps.",
  cta: "Get my review cards",
};

export const GUIDE_OFFERS: Record<string, GuideOffer> = {
  "how-to-get-recommended-by-chatgpt": {
    kicker: "What AI assistants check before naming you",
    head: "AI recommends the businesses people already trust.",
    body: "Review count and fresh reviews are among the signals Google, Maps and AI answers use. A tap card adds new ones every week.",
    cta: "Start collecting reviews",
  },
  "seo-vs-aeo-vs-geo": {
    kicker: "Ranking gets you seen",
    head: "Reviews get you picked.",
    body: "Whatever you do for SEO, AEO or GEO, the business with more recent 5-star reviews wins the tap. Make asking take 3 seconds.",
    cta: "Get my review cards",
  },
  "facebook-ads-cost-per-lead": {
    kicker: "Your ads pay for the click",
    head: "Your reviews decide if they call.",
    body: "Every lead checks your Google stars before they dial. More reviews make every ad dollar work harder.",
    cta: "Boost my ad results",
  },
  "google-business-profile-checklist": {
    kicker: "Profile finished? Next, fill it",
    head: "A perfect profile with 6 reviews still loses.",
    body: "Reviews are the one part of your profile you can't fill in yourself. The card gets your customers to do it.",
    cta: "Fill my profile with reviews",
  },
  "how-to-get-more-spotify-listeners": {
    kicker: "Booth, studio or merch table?",
    head: "Turn every happy customer into a public 5-star.",
    body: "Running a studio, a shop or an event? Leave a card at the table and let people review you in one tap. Re-program it anytime for any link.",
    cta: "Get my review cards",
  },
  "shopify-visitors-no-sales": {
    kicker: "Pop-ups, markets, local pickup",
    head: "Trust is why people don't buy. Fix it in person too.",
    body: "Every in-person sale can become a Google review that convinces the next online visitor. One card, one tap.",
    cta: "Get my review cards",
  },
  "local-business-website-checklist": {
    kicker: "A great site gets the call",
    head: "Reviews win the click before your site loads.",
    body: "People compare Maps listings first. Stars and review count decide which site they open.",
    cta: "Get more 5-star reviews",
  },
  "how-to-get-more-google-reviews": {
    kicker: "You just read how",
    head: "This is the fastest way to actually do it.",
    body: "No scripts to memorize, no links to text, no follow-ups. The customer taps and the form is open.",
    cta: "Get my review cards",
  },
  "nfc-google-review-cards": {
    kicker: "Do they work? Yes",
    head: "Here's the card we ship from Atlanta.",
    body: "Waterproof, double-sided, no subscription and nothing for your customer to install. Pay once, reuse for years.",
    cta: "Order the card",
  },
  "how-to-find-google-review-link": {
    kicker: "You found your link",
    head: "Now put it where customers can tap it.",
    body: "A link in a text gets ignored. The same link on a card at the register gets used. Program it once in two minutes.",
    cta: "Put my link on a card",
  },
  "nfc-review-card-iphone-android": {
    kicker: "Yes, your customers' phones work",
    head: "iPhone XS and newer, plus NFC Android. No app.",
    body: "That's nearly every customer who walks in. They tap the card and your Google review form opens.",
    cta: "Get my review cards",
  },
  "what-to-say-to-get-google-reviews": {
    kicker: "The script gets the yes",
    head: "The card makes it take 3 seconds.",
    body: "Say the line, hand over the card. They don't search your name, they don't scroll Maps, they just tap.",
    cta: "Get my review cards",
  },
  "google-review-cards-by-business": {
    kicker: "Restaurants, salons, barbers, contractors",
    head: "One card per station, chair or truck.",
    body: "Everyone who serves customers gets their own card, so every happy customer gets asked at the right moment.",
    cta: "Pick my pack",
  },
  "track-booked-calls-meta-ads": {
    kicker: "Ads bring the click",
    head: "Reviews close the booking.",
    body: "Tracking shows which ads work. Reviews are what make a stranger trust you enough to book once they land.",
    cta: "Get my review cards",
  },
};
