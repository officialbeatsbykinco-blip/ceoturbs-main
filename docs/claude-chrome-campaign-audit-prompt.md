# Claude in Chrome: campaign audit prompt

How to use it: open Chrome signed in to Google Ads, Microsoft Advertising, Meta Ads Manager, TikTok Ads and Shopify, then paste everything inside the box below into Claude in Chrome. It is **read-only first**. It will not change, enable, pause or spend anything without your yes on each change. Run it **before** you enable the new music campaigns, and again 3 days after.

````
You are auditing the paid-ads setup for CEO Turbo (ceoturbo.com). Be skeptical and precise. I would rather hear "this is broken" than "looks good".

## Hard rules
1. READ-ONLY by default. Do not enable, pause, delete, edit, create or upload anything, and do not change any budget, bid or setting, unless I reply "yes, do <that exact change>" to your specific proposal. One change per approval.
2. Never enter, view or change payment details. Never complete a real purchase. At Shopify checkout, stop when the checkout page loads.
3. Never click "Apply" on any platform's automated recommendation, auto-apply, or "optimize" button.
4. Never paste or reveal tokens, passwords or API keys. If a page shows one, tell me to rotate it instead of copying it.
5. Quote exactly what you see (setting name and value). If you cannot see something, say "could not verify" and say why. Do not guess.
6. Take a screenshot as evidence for every FAIL.

## Accounts and IDs to check against
- Site: https://www.ceoturbo.com (landing pages: /artist, /producers, /brand-boost, /book, /custom-company-t-shirts, /google-review-cards)
- Google Ads account 232-066-4335. Site conversion tag AW-18468746701. Conversions that should exist as PRIMARY: generate_lead ("Lead"), book_call ("Booked call"), purchase. click_to_call should be SECONDARY.
- GA4 G-XDWPSVBW53, GTM GTM-KRPRZ67Z. Key events: generate_lead, book_call, purchase, click_to_call.
- Microsoft Advertising account 189366985. UET tag 187280408. A goal on event action "book_appointment" should exist.
- Meta Pixel 3232222473609236. Events that should fire: Lead, Schedule, Purchase, InitiateCheckout, AddToCart, ViewContent.
- Shopify store uweee2-sc.myshopify.com. Products: Google Review Tap Cards (id 15410641502443), Custom Company T-Shirts (id 15418511327467).

## Part 1: Google Ads
For every campaign, report in a table: name, status, daily budget, bid strategy, networks, location option, goal, primary conversion goals, final URLs, and whether it is spending.
Check each of these and mark PASS / FAIL / COULD NOT VERIFY:
a. Networks: Google Search Partners OFF, Display Network OFF.
b. Location option is "Presence: people in or regularly in" (not "or interest").
c. AI Max, broad match, "Text customization", "Final URL expansion", "Automatically created assets" are all OFF.
d. Recommendations → Auto-apply: everything unticked.
e. Bidding is Manual CPC or Maximize clicks with a max CPC cap (not Maximize conversions until 15 to 30 conversions exist).
f. Only Booked call and Lead are Primary goals for the campaign. Page views and phone-call clicks are Secondary.
g. Goals → Conversions: each of Lead, Booked call, Purchase shows "Recording conversions" (not "No recent conversions" or "Needs attention"). Report the count of the last 30 days. Enhanced conversions for web is on.
h. Search terms report (last 30 days): list every search term that spent money, flag irrelevant ones ("beats by dre", "free beats", "buy beats", "download", "jobs", etc.) and propose negatives. Do not add them yet.
i. Keyword "how to get more spotify listeners" (phrase): report impressions, clicks, CTR, cost, conversions, and Search impression share. Is it eligible and limited by budget or by bid?
j. Every responsive search ad: Ad strength, and any disapproval or "limited by policy" reason. Final URLs must start with https://www.ceoturbo.com and include utm parameters.
k. Open each final URL on a phone-sized window. Does the page load in under 3 seconds? Does the main button work? Does any text claim something untrue?
l. Compare against docs/ads/google-ads-upload-music.csv (2 campaigns: "CEO Turbo | Music | Artists" $10/day, "CEO Turbo | Music | Producers" $5/day, all paused until reviewed). If they are not in the account yet, say so. Do not import.

## Part 2: Microsoft Advertising
a. Ad distribution is Search only (Audience network OFF).
b. Location targeting is "People in your targeted locations" only.
c. Auto-generated assets and auto-apply recommendations are OFF.
d. Conversion goals include book_appointment and the lead goal on UET 187280408; each shows "Active" or "Recording". Use the UET Tag Helper extension on the site to confirm the tag fires on /book.
e. Campaigns that exist: "Review Cards | Search | US" (id 571816100, paused), the company shirts campaign, and anything from docs/ads/microsoft-ads-upload-music.csv. List status, budget, spend, and any disapprovals.
f. Search terms report: same irrelevant-term check as Google.

## Part 3: Meta Ads Manager
a. Each active campaign: objective, conversion event (Lead or Schedule), optimization, budget, placements (Audience Network excluded), and learning status.
b. Events Manager → pixel 3232222473609236: status "Active", last event received time, and both "Browser" and "Server" sources present on Lead and Schedule. Event match quality for each (report the number).
c. Open the Diagnostics tab. List every warning. A known issue to confirm is fixed: "do not modify the fbclid value in fbc". Report whether it still appears and its last occurrence time.
d. Use the Payload Helper (developers.facebook.com/docs/marketing-api/conversions-api/payload-helper) to validate one real recent server event's fbc and fbp. Paste the exact value only into that tool, and report valid or invalid.
e. Domain verification and Aggregated Event Measurement: events ranked Purchase, Schedule, Lead, InitiateCheckout, ViewContent.

## Part 4: TikTok Ads and YouTube
a. TikTok: pixel status, events received, and any campaign in learning limited.
b. YouTube/Google video campaigns, if any exist: placement, targeting, and whether they point to the right landing page.

## Part 5: End-to-end tests on the live site (use a real phone-sized window, then desktop)
For each, report time taken and any error shown.
1. Take the quiz on /book through to the calendar. Does the Cal.com calendar show open times? If it does not, report exactly what is on screen (blank box, a "Pick my call time" button, or an error) and how long until it appears. Do not book a real slot unless I say so.
2. Open /custom-company-t-shirts, upload any logo, change sleeves and color, add a back print, and set sizes. Confirm the total equals sum of unit prices with the team discount (10% at 12+, 15% at 24+). Click Order and confirm the Shopify checkout page opens with the right items. Stop there.
3. Open /google-review-cards and confirm each pack's price and that checkout opens.
4. With Meta Pixel Helper, Google Tag Assistant and UET Tag Helper on: confirm PageView fires on /artist and /producers, and that no event fires twice for the same action.
5. Confirm the ad click ids survive: visit /artist?gclid=TEST&utm_source=google&utm_medium=cpc and check that the gclid appears in later form or cart attributes.

## Output format
1. A one-screen summary: the 5 most expensive problems first, each with the dollar impact if known.
2. A full table: Check | Platform | PASS/FAIL/COULD NOT VERIFY | Exact value seen | Fix (click path).
3. A list of the changes you recommend, numbered, each phrased so I can reply "yes, do #3".
4. A list of anything you could not access and what permission or login you need.
Stop after the report and wait for me.
````

## After the audit
Reply to the numbered list with the changes you approve. Re-run the same prompt 3 days after launch and compare the two reports.
