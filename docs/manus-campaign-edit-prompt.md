# Manus: fast campaign edit prompt (Google Ads + Microsoft Advertising)

How to use it: sign Manus's browser in to Google Ads and Microsoft Advertising, then paste everything inside the box. This one **edits**, but only inside the envelope below (spend caps, a forbidden list, an ordered change list, a before/after log). Run the read-only Chrome audit (`docs/claude-chrome-campaign-audit-prompt.md`) first if you can, and run this one **after** the new site code is live and the Cal.com calendar has been checked on a phone.

Two numbers you can change before pasting: `GOOGLE_TOTAL_DAILY_CAP` and `MICROSOFT_TOTAL_DAILY_CAP` (first lines of the prompt).

````
You are an experienced paid-search operator. Make the edits listed below in Google Ads (account 232-066-4335) and Microsoft Advertising (account 189366985) for CEO Turbo (ceoturbo.com). Work fast, but log everything. If anything is unclear, risky or not listed, stop and ask me instead of guessing.

GOOGLE_TOTAL_DAILY_CAP = $35   (sum of daily budgets of all ENABLED Google campaigns, never exceed)
MICROSOFT_TOTAL_DAILY_CAP = $25 (same for Microsoft)

## NEVER do any of these
- Touch billing, payment methods, account access, or invoices.
- Delete or remove any campaign, ad group, ad, conversion action or negative list. PAUSE instead.
- Change or create conversion actions, or change which goals are Primary, other than where this prompt says so.
- Turn on: AI Max, broad match, Performance Max, Display Network, Search Partners / Audience Network, "Final URL expansion", automatically created assets, auto-apply recommendations. If a wizard turns any of these on by default, turn it off.
- Click "Apply" on any recommendation.
- Raise any max CPC above the cap in the CPC table below, or any total above the daily caps above.
- Use any ad claim that is not already in docs/ads/*.csv or on the live site. Do not invent prices, results or guarantees.
- Send traffic to any domain other than https://www.ceoturbo.com.
- Enable a campaign whose conversion goals show "Needs attention" or "No recent conversions" without telling me first.

## Context and data (use it, don't re-derive it)
Google Ads, last 30 days: only one campaign spent ("CEO Turbo | Calls | US Niche", $6.78, 21 impressions, 5 clicks, 0 conversions). Its Artists ad group's phrase keyword "how to get more spotify listeners" is the only keyword getting clicks (about 13 clicks, 38% click rate). Treat it as a strong early signal, not a proven winner: no conversions yet.

Keyword Planner (US, avg CPC, low-to-high top-of-page bid):
| Lane | Keyword | Searches/mo | Avg CPC |
|---|---|---|---|
| Music | artist website | 2,400 | $7.45 ($2.10-$12.80) |
| Music | musician website | 22,200 | $5.04 ($1.25-$8.83) |
| Music | musician sites | 8,100 | $3.28 ($1.08-$5.48) |
| Art | sell art online / sell paintings online | 1,900 | $3.81 ($1.56-$6.06) |
| Art | best place to sell art online | 390 | $4.24 ($1.52-$6.96) |
| Art | art selling websites | 480 | $4.09 ($1.60-$6.57) |
| Shirts | company shirts with logo | 4,400 | $6.37 ($2.12-$10.61) |
| Shirts | custom work shirts | medium competition | not listed |
| Cards | google review card | 5,400 | $2.74 ($1.00-$4.48) |
| Cards | nfc review card | 390 | $1.43 ($0.45-$2.41) |
| Cards | how to get more google reviews | 590 | $24.51 |

Rule of thumb for this prompt: informational "how to ..." music and art queries are cheap and are where the working keyword lives. Service-intent terms like "artist website" cost $5-$7 and will not win on a $2-$3 cap. That is fine: do not raise caps to chase them.

Max CPC caps (Manual CPC, phrase match only): Music | Artists groups $2.00 except "Artist Website" $3.00; Music | Producers $2.00; Art | Visual Artists $2.50 except "Art Website" $3.00; Company Shirts $2.50; Review Cards: do not enable.

## PHASE 0: snapshot (read-only)
Before any edit, build a table of every campaign in both accounts: name, status, daily budget, bid strategy, max CPC, networks, location option, goals. Save it as BEFORE. You will use it for rollback.

## PHASE 1: Google Ads edits, in this order
Log each edit as: step | what | before | after | screenshot.
G1. Import docs/ads/google-ads-upload-music.csv the same way docs/ads/google-ads-upload-v2.csv was imported (Google Ads Editor: Import, From file; or Tools > Bulk actions > Uploads). Review the preview and fix parse errors before applying. If import is not possible, rebuild the same structure by hand from the CSV. Expected: 3 campaigns ("CEO Turbo | Music | Artists" $10/day, "CEO Turbo | Music | Producers" $5/day, "CEO Turbo | Art | Visual Artists" $5/day), 10 ad groups, 82 phrase keywords, 10 responsive search ads, all PAUSED. Report any row that fails.
G2. On each new campaign set: Search Partners OFF, Display OFF, location option "Presence: people in or regularly in", language English, location United States, bidding Manual CPC (or Maximize clicks with a max CPC cap), "Automatically created assets" OFF, Final URL expansion OFF, AI Max OFF. Conversion goals for these campaigns: only "Lead" (generate_lead) and "Booked call" (book_call) Primary. Do not change account-wide goal settings.
G3. Check every new ad: Ad strength and policy status. Fix only policy flags by trimming wording that is already in the CSV. Report anything disapproved.
G4. Continuity for the working keyword. Do NOT edit or pause "CEO Turbo | Calls | US Niche" until the new "Spotify Listeners" ad group has an approved ad. Then, in the same session: enable only the "Spotify Listeners" ad group (and its ad and keywords) in "CEO Turbo | Music | Artists", and PAUSE (do not remove) the old "Artists" ad group in "CEO Turbo | Calls | US Niche" so the same keyword is not bidding against itself. Add a note in each of the two places explaining why.
G5. Enable the remaining ad groups of "CEO Turbo | Music | Artists", then "CEO Turbo | Music | Producers". Enable "CEO Turbo | Art | Visual Artists" last. Check the daily cap after each campaign.
G6. Search terms (last 30 days, all campaigns): for any term with 1+ click, 0 conversions and clearly the wrong intent (buyers of beats or art, free downloads, headphones, jobs, tutorials, courses, streaming-bot vendors), add it as a campaign-level PHRASE-match negative on the campaign it came from. Maximum 30 negatives this run. List every one you add.
G7. Create a PAUSED Google copy of the company shirts campaign from docs/ads/microsoft-ads-company-shirts.csv, named "CEO Turbo | Company Shirts | Google": utm_source=google, daily budget $10, Manual CPC, max CPC $2.50 on every ad group. Do NOT enable it. Propose when to enable it in your report.
G8. Do not enable or edit "Review Cards | Search | US". Report its status and budget only.

## PHASE 2: Microsoft Advertising edits
M1. Import the Google campaigns with Microsoft's "Import from Google Ads" (or the docs/ads/microsoft-ads-upload-music.csv file). Keep them PAUSED until M2 passes.
M2. For each campaign: Ad distribution Search only (Audience network OFF), location "People in your targeted locations", automatically generated assets OFF, auto-apply recommendations OFF. Conversion goals: book_appointment and the lead goal on UET 187280408 only, as the campaign's goals.
M3. Max CPC caps from the table above. Same ad groups, same keywords, phrase match only.
M4. Enable in the same order as G5 (Artists, Producers, Art), staying under MICROSOFT_TOTAL_DAILY_CAP. Do not exceed the cap even if the three new campaigns plus the shirts campaign would. If they would, enable Artists and Producers only and tell me.
M5. The shirts campaign: set max CPC to $2.50 on every ad group, leave its state as it is, and report it.
M6. Review Cards campaign (id 571816100): leave paused.

## PHASE 3: verification
1. Re-open the BEFORE table and build an AFTER table. Highlight every difference.
2. Confirm the sum of enabled daily budgets per platform is at or under its cap.
3. Confirm every enabled ad has a final URL starting with https://www.ceoturbo.com and utm parameters.
4. Open /artist, /producers and /visual-artists on a phone-sized window. Confirm each loads in under 3 seconds and its main button works. Do not book a real slot.

## OUTPUT
1. Change log (every edit with before/after and screenshot).
2. Before/after table.
3. Anything you skipped, any error, any disapproval, with the reason.
4. Rollback steps for each change, as a numbered list.
5. A watch list for the next 72 hours: which three numbers to check first (clicks, cost, conversions per campaign).
Stop after the report.
````

## What to look at in 72 hours
- **Conversions first.** A click-heavy keyword with 0 leads is not a winner. Check Goals > Conversions for Lead and Booked call.
- **Cost per lead against your ceiling.** Rule of thumb: max CPC = value of a booked call x lead-to-call rate x click-to-lead rate. With a $997 site, 20% close rate, 30% lead-to-call and 3% click-to-lead, that is about $1.80. The working keyword averages $1.36, so it only pays off if it converts. Fill in your own numbers.
- **Search terms.** Run the search-terms report again and add negatives. This is where most waste hides in week one.
