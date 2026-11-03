# Microsoft Ads: Booked Calls | Search ($10/day)

Account 189366985 · UET 187280408. Goal: booked Brand Boost calls.

## Fastest build
1. Build/upload the Google campaign first (`docs/ads/google-ads-upload-v3.csv`).
2. Microsoft Ads → Tools → Import → **Import from Google Ads** → select only campaign **CEO Turbo | Booked Calls | Search**. Import keywords, ads, negatives, sitelinks.
3. Rename it **CEO Turbo | Booked Calls | Microsoft** and fix the settings below (imports reset several).

## Settings
- Budget **$10.00/day**. Search only: untick **Audience network** and Syndicated partners.
- Location: **United States**, **People in** the location (booked calls are remote, so no city limit).
- Bidding: **Manual CPC** with the ad-group caps from the CSV; switch to **Maximize conversions** after ~15 booked calls.
- Conversion goal for this campaign: **Booked call** (primary). Lead as secondary. Remove Purchase, Phone click from the optimized set.
- LinkedIn profile bid adjustments **+30%**: Job function = Entrepreneurship, Business Development, Marketing; Company size = 1–10, 11–50.
- Auto-apply recommendations OFF, automatically generated assets OFF, Final URL expansion OFF.
- Final URL: `https://www.ceoturbo.com/book?utm_source=bing&utm_medium=cpc&utm_campaign=booked_calls&utm_term={keyword}`
- Schedule Mon–Sat 7am–9pm.

## Approval notes
Same ad copy as Google (no unproven stats, no guarantees). If an ad is flagged, edit the headline named in the Policy column and resubmit.

## Second ad group: Free visibility check (lead magnet)
Landing page `/free-audit`, conversion = UET **Lead** (secondary goal; Booked call stays primary). Max CPC $1.75.

Keywords (phrase + exact): free seo audit, free website audit, free google business profile audit, free local seo audit, free marketing audit small business, free ai search visibility check, is my business showing up on chatgpt, check my google business profile.
Do NOT negative "free" in this campaign.

Headlines: Free Visibility Check | Free 60-Second Score | See What Google & ChatGPT Show | No Credit Card Needed | Then a Free Call With the Founder
Descriptions: Get your free visibility score in 60 seconds. See how you show up on Google, Maps, Bing and AI. | Free check, then an optional free call with the founder. No contracts, no pressure.
Final URL: `https://www.ceoturbo.com/free-audit?utm_source=bing&utm_medium=cpc&utm_campaign=free_audit&utm_term={keyword}`
Both ad groups share the one $10/day budget.

## Ad groups (US-wide, no local/city ad groups)
Google Business Profile · Website + SEO Package · More Customers · AI Search (GEO) · Free Visibility Check. Imported keywords/ads come from `docs/ads/google-ads-upload-v3.csv`. Delete any imported ad group named Local SEO and any keyword containing a city name or "near me".
