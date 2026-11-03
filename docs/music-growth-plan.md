# Artists & producers: growth plan (Oct 2026)

What's built, what the data actually says, what to launch first, and what needs your decision.

## 1. What the data says (read this before spending more)

Google Ads, last 30 days (read from the connected account on 2026-10-14):

| Campaign | Spend | Impressions | Clicks | Conversions |
|---|---|---|---|---|
| CEO Turbo \| Calls \| US Niche (contains the Artists ad group) | $6.78 | 21 | 5 | 0 |
| Review Cards \| Search \| US | $0 | 0 | 0 | 0 |

"How to get more spotify listeners" (phrase) is the best-performing keyword you have: a very high click rate for a tiny sample. It is **not yet proven**, because there are no conversions and only a handful of clicks. Treat it as a strong early signal worth a dedicated budget, not a result.

**Scaling rule (so you double down without guessing):**
1. Give the keyword its own campaign (done below) so its budget is controlled separately.
2. Run it about 2 weeks or about 100 clicks, whichever comes first, before judging it.
3. If cost per Lead or Booked call is at or under your target, raise the daily budget 20% every 3 days. If it has 100 clicks and 0 leads, fix the page or the offer before adding money. Don't add budget to fix a conversion problem.
4. Nothing counts as winning until it has produced a Lead or a Booked call in Google Ads → Goals → Conversions.

## 2. What was built

| Piece | Where | Notes |
|---|---|---|
| Artist page, refreshed | `/artist` | Adds "turn your videos into ads", shows and tours, paid features and sessions, and a clear price section |
| Producers page (new) | `/producers` | Landing page for beat-selling searches. In the header menu, footer and sitemap |
| Visual artists page (new) | `/visual-artists` | For painters selling originals, prints and commissions. No painter-client claims; shows only prices that fit |
| Price section on both pages | `src/content/pricing.ts` | Reads the one price list, so it can't drift from `/pricing` |
| Google Ads upload (paused) | `docs/ads/google-ads-upload-music.csv` | 3 campaigns, 10 ad groups, 82 phrase keywords, 266 negatives, 10 responsive search ads |
| Microsoft Ads upload (paused) | `docs/ads/microsoft-ads-upload-music.csv` | Same structure, `utm_source=bing`, campaign names end in `\| Microsoft` |
| Manus edit prompt | `docs/manus-campaign-edit-prompt.md` | Edits the campaigns inside spend caps, with a before/after log |
| Chrome audit prompt | `docs/claude-chrome-campaign-audit-prompt.md` | Paste into Claude in Chrome to check every campaign |

**Campaigns in the files**

| Campaign | Budget/day | Ad groups | Lands on |
|---|---|---|---|
| CEO Turbo \| Music \| Artists | $10 | Spotify Listeners (your winning keyword and close variants), Music Promotion, Artist Website, Shows & Booking | `/artist` |
| CEO Turbo \| Music \| Producers | $5 | Sell Beats, Beat Promotion, Producer Website | `/producers` |
| CEO Turbo \| Art \| Visual Artists | $5 | Sell Art Online, Art Website, Promote Your Art | `/visual-artists` |

All rows are **Paused**. Bids are Manual CPC. Max CPC is $2.00 on most groups, $2.50 on the art "sell" and "promote" groups, and $3.00 on the website groups, based on the Keyword Planner data in `docs/manus-campaign-edit-prompt.md`. The playbook settings in `docs/ads-launch-playbook.md` section 3 still apply after import: turn off Search Partners and Display, set location to "people in", switch off AI Max / final URL expansion / auto-created assets / auto-apply, and set only Booked call + Lead as Primary goals.

**Who the keywords target:** producers and artists searching for *how to grow*, not artists searching to *buy* beats. A "buy beats" search is a customer for your client, not for you, so those terms are negatives. The "Sell Beats" ads describe the search ads you'd run for a producer client, but the campaigns here advertise your agency to producers.

**Launch order**
1. Google Ads Editor → import the Google CSV. Review, then enable one campaign at a time.
2. Microsoft Advertising → **Import from Google Ads** (fastest) or import the Microsoft CSV. Set ad distribution to **Search only**, and "people in" for location.
3. Run the Claude-in-Chrome audit prompt before turning anything on.

## 3. Pricing: is it competitive and fair?

Benchmarks found online (these are rough and vary by source; confirm before quoting them):

| Alternative | Typical cost | Source |
|---|---|---|
| Beat marketplace storefront (BeatStars-type) | about $10–$20/month (their own pricing page is the source of truth) | [Beat selling platforms compared](https://orphiq.com/resources/beat-selling-platforms-compared), [producer guide](https://musicproductionwiki.com/articles/how-to-sell-beats-online) |
| Freelancer artist website | $500–$5,000 | [Merge](https://merge.rocks/blog/how-much-does-website-design-cost-in-2026-an-honest-pricing-guide), [Levitate](https://www.levitate.ai/blog-posts/average-website-design-cost-for-small-businesses-in-2026) |
| Agency artist or DJ website | $5,200–$15,950 (DJ estimate) | [Project Cost Estimator](https://projectcostestimator.com/cost/industry/dj) |
| Music marketing agency retainer | $2,000–$5,000/month (a planning figure, not a price list) | [Financial Models Lab](https://financialmodelslab.com/blogs/business-insights/music-marketing-agency) |

| CEO Turbo | Price | Verdict |
|---|---|---|
| Artist website | $997 one-time | Fair. Below most freelancers and far below agencies |
| Ads & tracking setup | $397 one-time | Fair. A sensible entry point if the artist already has a site |
| Turbo Growth (ads managed weekly, 4 creatives/month) | $597/month | Competitive. About a fifth to a third of an agency retainer, no contract |

**The gap is the low end.** A producer selling $30 beat leases can get a marketplace store for about $10–$20/month, so $997 up front is a hard ask. Two ways to close it, **your call (I haven't changed any price)**:
- Add a **Producer Starter** around **$297–$497**: beat-store page, licensing and pricing page, booking form, tracking. A producer recoups $497 in roughly 10–20 lease sales.
- Or keep prices and lead with the **$397 Ads & tracking setup** for producers who already have a store.

If you pick one, it's a single new entry in `src/content/pricing.ts`, and every page, FAQ and the llms.txt update from it.

## 4. Platforms and order

| Order | Platform | Role | Why |
|---|---|---|---|
| 1 | Google + Microsoft Search | Catch people already searching ("how to get more spotify listeners", "how to sell beats online") | Highest intent. Your winning signal is here |
| 1 | Meta (Instagram + Facebook) | Video ads from their clips | Best for artists and cheapest to test. You have artist proof (BIGZO) |
| 2 | TikTok | Same videos, vertical | Reuse the same cuts. Strong for music discovery |
| 3 | YouTube (bought inside Google Ads as a video campaign) | Shorts and in-stream from the same clips | Add after you know which videos work |
| Later | Spotify Ad Studio | Direct to listeners | Only once an artist has a release to push |

**Turning an artist's videos into ads (repeatable)**
1. Pull their top 3 videos by watch time. Skip anything with unlicensed samples or a label's copyrighted master.
2. Cut each into three versions: a 3-second hook, the 15–30 second body, a clear call to action (stream, follow, book, buy the beat).
3. Add captions (most people watch on mute), a vertical 9:16 master and a 1:1 crop.
4. Run 3 videos x 3 hooks = up to 9 ads at $5–$10/day total. After about 5 days, keep the top 2 and replace the rest.
5. Send listener ads to the artist's profile (not one song), show ads to people near the venue, beat ads to the producer's `/producers`-style page.

**Shows, tours, features, merch**
- The artist site (booking page, EPK, tour dates, fan signup) is what promoters and venues use. The ads fill the room and grow the list.
- "Book tours" is a site and promotion service, not a guarantee of bookings. The page copy says so. Keep it that way in sales calls too.
- Merch: connect the artist's store or a Shopify page to the site and email a drop to the fan list. Handle fulfilment separately.

## 5. Ads for review cards, business shirts, or both? (with real CPCs)

Keyword Planner, US, pulled 2026-10-14:

| Product | Keyword | Searches/mo | Avg CPC | Low-high top-of-page bid |
|---|---|---|---|---|
| Shirts | company shirts with logo | 4,400 | $6.37 | $2.12-$10.61 |
| Shirts | print custom t shirt (broad) | 33,100 | $4.83 | $1.79-$7.88 |
| Cards | google review card | 5,400 | $2.74 | $1.00-$4.48 |
| Cards | nfc review card | 390 | $1.43 | $0.45-$2.41 |
| Cards | how to get more google reviews | 590 | $24.51 | $5.70-$43.31 |

**The arithmetic.** The most you can pay per click and still profit is `profit per order x share of clicks that become an order`. The assumptions below are mine, so replace them with your real margins:

| | Order value | Assumed margin | Profit/order | Assumed click-to-order | Max profitable CPC |
|---|---|---|---|---|---|
| Shirts (a 6-shirt team order) | about $168 | 40% | about $67 | 3% | about $2.00 |
| Review cards (2-card pack) | $39.99 | 70% | about $28 | 3% | about $0.85 |

**What that says, if those assumptions are close:**
- **Review cards on search lose money.** Even the cheapest term ($1.43) is above $0.85. Keep cards on **Meta**, where you are already getting clicks, and where the cost per click is a fraction of search.
- **Shirts on search only work at the cheap end.** The $6.37 average click loses money. A bid near $2 is break-even. So run shirts with a **$2.50 max CPC cap**, long-tail phrases ("custom work shirts", "company printed shirts", "shirts for employees"), and accept less traffic. Do not bid for the head terms.
- **Shirts make more per order, cards make more per click on Meta.** Put shirts on search with tight caps and cards on Meta, not both on search. Cross-link each on the other's order page.
- If you find your margin or conversion rate is higher than assumed, the caps move up with them. If lower, shirts search is not worth running yet.

**Decision rule after 30 clicks or 14 days per campaign:** compare `cost per order / profit per order`. Put the next dollar behind the lower number.

## 5b. Should you double down on the artist niche?

**Yes, as a staged bet, not a switch.** The working keyword averaged $1.36 a click. For an agency service the arithmetic is better than for $25-$170 products: with a $997 site, an assumed 20% close rate on calls, 30% lead-to-call and 3% click-to-lead, you can afford about $1.80 a click, and Turbo Growth at $597/month raises that. So artists are the lane where search clicks can pay.

**But the evidence is still thin:** 13 clicks, 0 conversions. Keep local-business campaigns running in the background, put new test budget into artists first, and use these gates:
1. **Week 1-2:** the three new campaigns run at $20/day combined. Judge on Lead and Booked call counts, not clicks.
2. **Go further** (raise artist budgets 20% every 3 days) only if cost per Lead is under your ceiling.
3. **Cut** a group at 15+ clicks with 0 leads, or fix its landing page first.
4. **Offer ladder** (artists have small budgets): free visibility check first, then Social setup ($197) or Ads & tracking setup ($397), then the $997 site and $597/mo management.

**Keywords:** "artist website" costs $7.45 a click, "musician website" $5.04, so the working lane is the cheap "how to ..." and "promote my music" family, not the head terms. The files target that family. "Website builder" terms are excluded in spirit: those searchers want a DIY builder, not an agency.

**Painters and visual artists (the lane you asked about):** "sell art online" and "sell paintings online" are 1,900 searches a month at $3.81 a click, "best place to sell art online" 390 at $4.24. There is demand, but the searchers are comparing marketplaces and tend to have small budgets, and I have **no painter clients to point to**, so the page does not claim any. The Art campaign is a $5/day test with its own page and its own kill rule: 15 clicks without a lead means fix or pause.

## 6. Open questions for you
1. **Shirts: dropship or in-house?** The site says "pressed and shipped from Atlanta in 2–3 business days." If a partner prints and ships, that wording and the delivery times need to change before Google and Microsoft ads go live. Inaccurate shipping claims can get ads disapproved.
2. **Producer price point:** do you want a $297–$497 Producer Starter (section 3)?
3. **Margins** for cards and shirts, so the decision rule in section 5 can pick a winner.
4. **Cal.com calendar:** confirm on your phone that the calendar loads from the quiz on `/book` before any of this traffic arrives.
