# Meta ads — agency campaign build sheet (copy these settings exactly)

Pixel: `3232222473609236` (PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Contact, Schedule, Purchase all fire and are de-duplicated with the server events).
Goal: booked calls from business owners. Everything below uses `/how-to-get-more-customers` as the landing page (live). Review-card ads wait until `/get-more-reviews` is confirmed live after the deploy.

## Before you build (5 minutes)
1. Business Settings → Brand Safety → **Domains** → add `ceoturbo.com` → choose the **meta-tag** method. Send me the code and I add it to the site. (Or use the DNS method.)
2. Events Manager → Data sources → your pixel → **Test events** → open `https://www.ceoturbo.com/how-to-get-more-customers`, finish the quiz with a test email. You should see **Lead** (Browser + Server, "deduplicated").
3. Make sure the ad account has a payment method and your Facebook page + Instagram account are connected.

## Campaign
| Setting | Value |
|---|---|
| Name | `CT \| Agency \| LA \| Leads` |
| Objective | **Leads** → Performance goal: **Maximize number of leads** → Conversion location: **Website** |
| Conversion event | **Lead** |
| Budget | Ad set level, $10–15/day to start. Do **not** use a lifetime budget. |
| Attribution | 7-day click (default) |

## Ad set A — LA business owners
| Setting | Value |
|---|---|
| Name | `LA 25mi \| 25-60 \| Broad` |
| Location | Los Angeles, CA + 25 miles (people living in or recently in) |
| Age | 25–60 |
| Gender / languages | All / leave blank |
| Detailed targeting | **None at first** (broad). Add "Small business owners" or "Entrepreneurship" only if broad doesn't deliver after 7 days. |
| Placements | Manual: **Facebook Reels, Instagram Reels, Facebook Stories, Instagram Stories, Instagram Feed, Facebook Feed**. Turn off Audience Network and Messenger. |
| Schedule | Run continuously |

## Ad set B — artists & producers (start day 7+, $5/day, only if A is under $45 per lead)
Same settings, but: name `US \| 18-35 \| Music`, location United States, interests hip-hop, trap music, music production, FL Studio, Spotify for Artists. Destination: `https://www.ceoturbo.com/artist`.

## Ads (create 3 in ad set A)
For every ad: format **video 9:16**, face on the top half, website on the bottom half, captions burned in. **Call to action: Learn More.** Primary text from `docs/how-to-get-more-customers-ad-script.md` ("Meta ad copy"). Headline: `How to get more customers (free)`. Description: `Free 30-min call with the founder`.

| Ad | Hook (first 3 seconds) | Landing URL |
|---|---|---|
| 1 | "Your competitors aren't better than you. They're just easier to find." | `https://www.ceoturbo.com/how-to-get-more-customers?utm_source=meta&utm_medium=paid_social&utm_campaign=agency_la&utm_content=hook_fear` |
| 2 | "I checked an LA business's Google profile. Here's what I found." (screen-record the free check) | `...&utm_content=hook_audit` |
| 3 | "This is my real Stripe. 152 payments this year. Here's what I do." | `...&utm_content=hook_proof` |

Video checklist: hook in the first 3 seconds · text on screen from second 1 · face looks at the camera · scroll slowly, let numbers finish counting · end with "tap the button, answer 6 quick questions."

## Rules (do not break the learning phase)
- Don't edit budget, audience or ads for the first 3–4 days.
- Meta needs about 50 conversions in a week to fully optimize. At low spend you won't hit it, so judge by cost per lead and calls booked, not by the "Learning" label.
- Answer every lead in **5 minutes**.

## Day-7 decision
| Cost per quiz lead | Action |
|---|---|
| Under $25 | Keep the best ad, add 20% budget every 3 days |
| $25–$45 | Replace the weakest ad, keep the audience |
| Over $45 | Change the hook (first 3 seconds), not the audience |
Also check: click-through rate under 0.8% means the hook is weak; many clicks but no quiz leads means the page or video promise doesn't match.

## Special ad category
Nothing here touches housing, credit, jobs or politics, so no special category is needed.
