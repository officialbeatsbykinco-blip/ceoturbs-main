# Reddit lead forms: best structure for developer leads

**Caveat:** exact field types and limits for Reddit's native Lead Gen forms change. Public sources I found did not confirm the limits, so confirm them in Reddit Ads Manager when you create the form. The structure below works inside any reasonable limit.

## Which form to use
| Option | When | Why |
|---|---|---|
| **On-site form** (`/app-marketing#intake`, already built) | **Default.** Use first. | Devs trust a real page they can read, you get UTMs and click ids, all ad pixels fire, leads land in your sheet, and Cal.com opens right after. |
| **Reddit native lead form** | Add as a second test once the on-site form has a baseline | Fewer steps, so more leads, but lower intent and no landing-page proof. Compare **cost per booked call**, not cost per lead. |

## The on-site form (live now): 5 questions, no phone number
1. Name, 2. Email, 3. Link to the app/repo/site, 4. What is it (iOS, Android, SaaS/web, extension, CLI/OSS, game, other), 5. Where are you (pre-launch, launched under 100 users, have users want to scale, have revenue want to grow it), 6. Monthly ad budget bucket, plus an optional "What's stopping installs?"
- **No phone number.** Devs hate being called. The lead value does not depend on it.
- **Why these questions:** link = lets you prep before the call; platform and stage = pick the right channel; budget = qualify and set the lead value sent to ad platforms.
- **Lead value sent to Meta/TikTok/Reddit/Google** (`DEV_BUDGETS` in `src/components/dev/DevIntake.tsx`): under $300 = $10, $300–1k = $50, $1k–3k = $150, $3k+ = $300, not sure = $10. Change these once you know close rates.

## If you also build a Reddit native form
- **Prefilled:** email (and name if offered). Don't ask for more.
- **Up to 3 questions** (same wording as above): platform, stage, monthly budget bucket. Put the link question on the thank-you step instead.
- **Privacy policy link:** `https://www.ceoturbo.com/privacy-policy`.
- **Thank-you:** "Thanks. Pick a time for your free 30-min call: https://cal.com/stackmodechris/ceoturbo-brandboost" so intent isn't lost.
- Tag it separately: campaign name `devs_native_<group>`.

## Where leads land
`api/lead.js` type `dev-intake` → leads Google Sheet. The answers are stored as one readable **Note**:
`App: https://… | Platform: … | Stage: … | Ad budget: … | Blocker: …`
Attribution columns (UTMs, click ids, `fbp/fbc/ttclid`) are filled automatically. Re-paste `docs/leads-apps-script.js` into your Apps Script and redeploy: dev leads then get their own **Dev Intake Leads** tab (link, platform, stage, budget, blocker, UTMs). Until you do, they land on **Other Leads** with Type `dev-intake`.

## Events fired on a dev lead
`generate_lead` with `lead_source=reddit-dev-intake` and the budget value → GA4, Google Ads, Microsoft UET, Meta (`Lead`, browser + server, de-duplicated), TikTok (`Lead`), Reddit (`Lead`). The booked call later fires `book_call` (Reddit custom event `BookedCall`).

## Follow-up (this is what converts)
- **Respond within 5 minutes** while they're still on Reddit. The form's confirmation says you reply within one business day; beat it.
- **Reply template (edit before sending):**
  > Hey {name}, Christopher here. I read your answers about {app}. First look: {one specific observation about their listing/site}. Want to grab 30 minutes so I can walk through what I'd change first? {cal link}
- **Don't send a sequence.** One personal reply, one follow-up after 3 days, then stop.

## Scoring (for who to call first)
| Signal | Points |
|---|---|
| Budget $1k+ / month | +3 |
| Budget $300–1k | +2 |
| Has users or revenue | +2 |
| Launched, under 100 users | +1 |
| Gave a real link | +1 |
| Blocker is specific (not blank) | +1 |
Call 4+ first; answer the rest by email.

## Measure
Cost per **lead**, cost per **booked call**, and booked-call rate per ad group and per creative (`utm_content`). Decide with 15+ booked calls, not 3.
