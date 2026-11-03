# Send leads to a Google Sheet (5 minutes, free)

Every free-check lead (`/api/audit`), booked Brand Boost call (`/api/cal-webhook`) and review-card
order request (`/api/lead`) is POSTed to the URL in the `LEADS_WEBHOOK_URL` environment variable,
together with the ad click ids and UTMs that brought the person in. Each type lands on its own tab. The simplest free option is a
Google Sheet with a tiny Apps Script. Nothing is stored on the website itself.

## 1. The sheet and script

The sheet is **FREE Lead Magnet Leads** (tabs: Call Dashboard, Booked Calls, Call Quiz Leads, Free Check Leads, Card Orders, with
headers, filters, a Status dropdown and colors). The script that fills it is
[`docs/leads-apps-script.js`](leads-apps-script.js).

**Battery Leads** (new) holds every request from the /car-battery form: Need, Year, Make, Model, Location (an address, zip, or a
Google Maps pin from "Use my location"), When (Right now / Today / Schedule it), then Status (New → Contacted → Quoted →
Booked → Done / Lost) and Notes. The tab creates itself on the first lead, but the script must be redeployed first:
Extensions → Apps Script, paste the new `docs/leads-apps-script.js` (keep your real SECRET), Deploy → Manage deployments →
Edit → New version, then run `setupSheet()` once for the Status dropdown.

**Booked Calls** is your call-prep list, soonest call first when you sort by *Call time*. Each row has a
**Priority** (HOT / Warm / Cool, from budget + how soon + a website to review) and **Lead score**, everything the
person told you in the quiz (what they do, goal, what's holding them back, budget, how soon, the #1 move they were
shown), the meeting link and the ad that brought them. After the call fill in **Status** (New → Confirmed →
Showed / No-show / Rescheduled → Won / Lost), **Outcome**, **Quote $** and a **Follow-up date**; calls in the next
24 hours light up yellow and overdue follow-ups turn red.

**Call Dashboard** (first tab) updates by itself: calls today / next 7 days, calls booked, show rate, close rate,
revenue won, open pipeline, the next calls with their prep info, quiz leads who haven't booked yet, follow-ups due,
and which ads book calls.

**Call Quiz Leads** is the Brand Boost quiz: one row per person who answered the questions and left their details,
with every answer and the ad that brought them. When the same person books, their row flips to **Booked? = Yes**
with the call time and Status "Booked". **Anyone still "No" is your follow-up list:** call or text them the same day.
The script creates missing tabs and adds any new columns to existing tabs by itself.

> **Updated 2026-10-12: re-paste the script** (steps 1, 2 and 4 below), then in the Apps Script editor choose
> `setupSheet` in the function dropdown and press **Run** once (it re-applies dropdowns, colors and the dashboard and
> is safe to run again). The Google Sheet itself was already upgraded; the re-paste is what makes new bookings fill
> Priority, Lead score, "How soon" and "#1 move shown" and quiz leads land on their own tab. Until then quiz leads
> land on the "Card Orders" tab and bookings leave those columns blank.

1. Open the sheet → **Extensions → Apps Script**. Delete what's there and paste the whole file.
2. On the `const SECRET = ...` line, replace the placeholder with your `LEADS_WEBHOOK_SECRET`.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and
   authorize. Copy the **Web app URL** (ends in `/exec`).
4. Changing the script later: **Deploy → Manage deployments → Edit → New version**, so the URL stays the same.

Rows are matched to columns by header name, so you can reorder or hide columns. Booked calls are
de-duplicated by Booking ID.

## Paid card orders (Shopify) → Card Orders tab

1. Shopify admin → **Settings → Notifications → Webhooks → Create webhook**.
2. Event **Order payment**, format **JSON**, URL `https://www.ceoturbo.com/api/shopify-webhook`, latest API version. Save.
3. At the top of that Webhooks page Shopify shows *"Your webhooks will be signed with ..."*. Copy that value into Vercel as `SHOPIFY_WEBHOOK_SECRET` and redeploy.
4. Orders land on **Card Orders** with the buyer, items, ship-to, total and the ad click ids from the cart. Retries never duplicate (Order ID). Meta's Purchase still comes from the Facebook & Instagram app, so this endpoint sends nothing to Meta.

## 2. Add the environment variables in Vercel

Project → Settings → Environment Variables:

| Name | Value |
| --- | --- |
| `LEADS_WEBHOOK_URL` | the `/exec` Web app URL |
| `LEADS_WEBHOOK_SECRET` | the same random string as `SECRET` above |
| `PSI_API_KEY` (optional) | a free Google PageSpeed Insights API key — adds a real mobile speed score to every audit |

Redeploy. Run a test audit on the live site and check the sheet.

## Local testing

`npm run dev` / `npm run preview` serve the same API. Without `LEADS_WEBHOOK_URL`, local leads are
written to `.leads/leads.jsonl` (git-ignored). To test the sheet locally, put the variables in
`.env.local`.

## Prefer a CRM?

Any tool that accepts a JSON webhook works the same way: Zapier / Make "Catch hook", GoHighLevel
inbound webhook, HubSpot via Zapier, n8n. Point `LEADS_WEBHOOK_URL` at it.
