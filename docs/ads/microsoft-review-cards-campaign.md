# Microsoft Ads: Google Review Cards | Search ($10/day)

Account 189366985 · UET 187280408 · existing paused campaign id 571816100 (edit it to match this, or create fresh).
Goal: **card sales**. Optimize for the UET **Purchase** goal (sent by the Shopify custom pixel, `docs/shopify-custom-pixel.js`).

## Settings (all required)
- Campaign type **Search**. Budget **$10.00/day** (standard, not shared). Ad distribution: **Microsoft Search network only**; untick Audience network and Syndicated partners.
- Location: United States, **People in** your targeted locations (not "or show interest").
- Bidding: **Manual CPC** at the start (caps below), switch to **Maximize conversions** after ~15 purchases. No Enhanced CPC, no auto-apply recommendations, auto-generated assets off, Final URL expansion off.
- Conversion goal for this campaign: **Purchase** only (Begin checkout as secondary / not optimized).
- Schedule: all hours (people buy at night), review after 7 days.
- Final URL: `https://www.ceoturbo.com/google-review-cards?utm_source=bing&utm_medium=cpc&utm_campaign=review_cards&utm_term={keyword}`

## Ad groups and keywords (phrase + exact only, no broad)
| Ad group | Max CPC | Keywords |
|---|---|---|
| NFC review cards | $1.25 | nfc google review card, nfc review card, tap google review card, tap to review card, nfc review card for business, nfc card for google reviews |
| Review cards for business | $1.25 | google review cards for business, google review card, review card for small business, google review cards, google review tap card, review cards for google reviews |
| Get more reviews | $1.00 | get more google reviews card, how to get more google reviews fast, easy way to get google reviews, collect google reviews with a tap, tap card get reviews |

## Negative keywords (campaign level, phrase)
free, template, templates, app, software, download, diy, how to write, jobs, job, hiring, salary, course, tutorial, pdf, reddit, youtube, wholesale, bulk 1000, blank nfc, ntag215 bulk, nfc tag reader, amazon, ebay, aliexpress, etsy, fake, buy google reviews, remove reviews, delete review, review removal, restaurant menu, qr code generator, printable

(Do not add "buy" broadly; "buy google reviews" is the policy-risky term to block.)

## Responsive search ads (limits: headline 30, description 90). Make 2 per ad group.
Headlines:
1. Google Review Cards
2. Tap to Leave a 5-Star Review
3. NFC Review Card
4. From $24.99. Free Shipping
5. Ships Fast From Atlanta
6. Get More Reviews Easily
7. Works With iPhone & Android
8. No App. No Typing.
9. Pre-Linked to Your Profile
10. 5-Day Money-Back Return

Descriptions:
1. Tap a card, land on your review page. Get more real reviews from happy customers.
2. Free US shipping from $24.99. Return new and unused within 5 days for a refund.
3. Set up in minutes with our free step-by-step guide. Works on iPhone and Android.

Pin headline 1 to position 1 only. Do not claim "guaranteed reviews", "#1", "rank higher", or any affiliation with Google. Say "for Google reviews" / "Google reviews", never "official" or "by Google". Cards help customers leave honest reviews; never imply incentives or fake reviews.

## Assets
- Sitelinks: 1 Card $24.99 `/google-review-cards`, 2 Cards $39.99, 5 Cards $79.99 (same page with `#packs` if present), How setup works `/google-review-card-setup`.
- Callouts: Free US Shipping, Ships From Atlanta, 5-Day Returns, Works on iPhone & Android.
- Price extension: 1 card $24.99 · 2 cards $39.99 · 5 cards $79.99.
- Structured snippet (Types): NFC review card, Pack of 2, Pack of 5.

## Approval checklist (Microsoft editorial)
- Landing page shows price, shipping, return policy, phone and email (site.ts has them; `SITE.email` must be a real support address).
- Page title/URL match the ad topic; no pop-ups hiding content.
- No trademark misuse: "Google" only descriptively. If an ad is flagged "Trademark in ad text", rewrite to "Review Cards for Google Reviews" and resubmit.
- After import wait for "Approved" in Ads view; fix any "Disapproved" with the reason shown (Policy column) and resubmit before enabling.
