# Conversion tracking: setup checklist

Everything in the code is done. This is the account-side setup, in order. Each step lists what it unlocks.

## How it fits together

| Conversion | Where it happens | Meta | Google Ads / GA4 | Microsoft Ads | TikTok (once set up) |
|---|---|---|---|---|---|
| **Quiz lead** (main lead) | Brand Boost quiz: `/brand-boost`, `/book`, every "Book" button | `Lead` with value by budget: Pixel + CAPI, deduped by event id | `generate_lead` (lead_source = brand-boost-quiz, value) | `submit_lead_form` + revenue | `Lead`: Pixel + Events API |
| **Booked call** | Cal.com (quiz calendar, modal or `/booked`) | `Schedule` with value: Pixel + CAPI, deduped by `book_<uid>` | `book_call` via the Google tag → Ads conversion | `book_appointment` | `Schedule`: Pixel + Events API |
| **Free check lead** | `/free-audit`, homepage | `Lead`: Pixel + CAPI, deduped | `generate_lead` (lead_source = free_check) | `submit_lead_form` | `Lead` |
| **Developer lead** | `/app-marketing` intake form | `Lead` (value by budget, `lead_source=reddit-dev-intake`): Pixel + CAPI | `generate_lead` | `submit_lead_form` | `Lead` (and Reddit `Lead`, `BookedCall` later) |
| **Card purchase** | Shopify checkout | `Purchase` from the Facebook & Instagram app (Pixel + CAPI) | `purchase` from the Shopify custom pixel | `purchase` from the Shopify custom pixel | TikTok app on Shopify |
| **Shirt purchase** | Shopify checkout (company t-shirts `CT-TEE-*` and artist merch `CT-MERCH-*`) | `Purchase` from the Facebook & Instagram app; `CustomizeProduct` / `AddToCart` / `InitiateCheckout` from the designer (Pixel + CAPI) | `purchase` from the Shopify custom pixel | `purchase`; `customize_product` from the designer | `CustomizeProduct` / Shopify app |
| **Phone call click** | every `tel:` link ((678) 558-4327) | `Contact`: Pixel + CAPI (`/api/track`), deduped | `click_to_call` via the Google tag → Ads conversion *Phone call click* | `contact` | — |
| Funnel steps | site | ViewContent, AddToCart, InitiateCheckout, BookingOpen, QuizStart | view_item, add_to_cart, begin_checkout, booking_open, quiz_start, quiz_step | view_item, add_to_cart, begin_checkout | ViewContent, AddToCart, InitiateCheckout |

**Lead values** (set in `src/content/quiz.ts`): the quiz Lead is worth $10 / $50 / $150 / $300 by budget answer ($10 for "Not sure yet"), and a booked call from the quiz is worth 3× that. Ad platforms use these to find higher-budget leads. The free check Lead is worth $10. Change them once you know your close rates.

**Starting vs growing:** both lead forms ask it. It's in the Sheet ("Stage" column) and in Meta as `content_category` (e.g. `Local service business · Growing`), so you can build custom conversions/audiences for either group.

**Meta match quality:** the site runs Meta's official Conversions API Parameter Builder (browser + server) to build `_fbp`/`_fbc` and the best client IP, adds a persistent visitor id as `external_id` on every event (Pixel, CAPI and bookings), and passes hashed email/phone/name on the browser Lead too (verified in the Pixel request on 2026-10-12). Ad click ids (fbclid, gclid, msclkid, ttclid) are also added to the Shopify checkout URL, so purchases on Shopify's domain still tie back to the ad.

**Meta Conversions API Gateway:** your pixel has Meta's CAPI Gateway ("openbridge") switched on. The site's security policy allows its two endpoints (`src/config/headers.ts`). If Events Manager ever shows a new gateway URL, add it there.

Every lead and booking also lands in your **Google Sheet** with its ad click ids and UTMs (`leads-google-sheet.md`).

---

## 1. Vercel environment variables (Project → Settings → Environment Variables), then Redeploy
| Name | Where to get it | Unlocks |
|---|---|---|
| `META_CAPI_TOKEN` | Events Manager → pixel **3232222473609236** → Settings → Conversions API → *Generate access token* | Server-side Lead + Schedule (counts ad-blocked/iOS users) |
| `CAL_WEBHOOK_SECRET` | any long random string; use the same one in step 3 | Booked calls → Meta CAPI + Sheet |
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | `leads-google-sheet.md` | Leads in Google Sheets |
| `SHOPIFY_WEBHOOK_SECRET` | Shopify → Settings → Notifications → Webhooks (signing secret) | Paid card orders → Google Sheet (`leads-google-sheet.md`) |
| `SERVER_PURCHASE_EVENTS` *(only if Shopify's Facebook & Instagram app is NOT sending Purchase)* | set to `true` | `api/shopify-webhook.js` sends Purchase to Meta CAPI + TikTok Events API (event id `purchase_<orderId>`). Don't run both senders without checking Events Manager for double counts. Walkthrough: `meta-test-events-checklist.md` |
| `VITE_REDDIT_PIXEL_ID` *(when you start Reddit ads)* | Reddit Ads → Events Manager → pixel id (`a2_…`) | Reddit Pixel: PageVisit, Lead, BookedCall, Purchase |
| `META_TEST_EVENT_CODE` *(temporary)* | Events Manager → Test events | See server events live while testing; delete it after |
| `VITE_TIKTOK_PIXEL_ID` *(when you start TikTok ads)* | TikTok Ads Manager → Tools → Events → Web events → your pixel → Pixel ID | TikTok Pixel on every page |
| `TIKTOK_ACCESS_TOKEN` *(when you start TikTok ads)* | Same pixel → Settings → Events API → Generate access token | Server-side Lead + Schedule (counts ad-blocked/iOS users) |
| `TIKTOK_TEST_EVENT_CODE` *(temporary)* | TikTok Events Manager → Test events | See server events live while testing; delete after |

The Meta Pixel id, the Microsoft UET tag id (**187280408**) and the Microsoft Clarity project id (**ywmvopjye1**) are built into the code, so you don't need to set `VITE_META_PIXEL_ID`, `VITE_UET_TAG_ID` or `VITE_CLARITY_ID` (set them only to override).

## 2. Meta Events Manager
1. **Settings → Domains:** verify `ceoturbo.com` (Business Settings → Brand safety → Domains → DNS TXT in Vercel).
2. **Aggregated event measurement** (if shown): rank **Purchase**, **Schedule**, **Lead**, InitiateCheckout, ViewContent.
3. **Custom conversions** (optional, for reporting): "Booked call" = Schedule; "Quiz lead" = Lead with `lead_source` contains `brand-boost-quiz`; "Free check lead" = Lead with `lead_source` contains `free_check`.
4. **Campaigns:** agency ads optimize for **Schedule** (use **Lead** while you're under ~50 bookings a week). Card ads optimize for **Purchase**.

## 3. Cal.com (event type `ceoturbo-brandboost`)
The booking questions (business, what they do, website, goal, budget) are now asked by the quiz on the site and passed to Cal.com as hidden, prefilled fields, so the Cal.com form only confirms name, email and phone (now required). That was set through the Cal.com API on 2026-10-11.
1. **Redirect on booking** (`https://www.ceoturbo.com/booked`, Forward parameters on) needs a Cal.com **Team** plan, so it is not set. Bookings are still tracked: the on-site calendar fires `book_call` the moment a booking succeeds, and the webhook below sends the server-side copy. Turn the redirect on later if you upgrade.
2. **Settings → Developer → Webhooks → New:**
   - URL: `https://www.ceoturbo.com/api/cal-webhook` (use **www**, the bare domain redirects)
   - Trigger: **Booking Created**
   - Secret: the `CAL_WEBHOOK_SECRET` value
3. **Booking questions:** make **Phone number** required or optional-but-shown. Phone is the second-strongest match signal for Meta and Google.

## 4. Google Ads (AW-18468746701, built into the site)
The Google Ads tag loads with GA4 from `src/lib/ga.ts` on every page, so remarketing audiences start filling right away. Conversions fire from code with the event id as the transaction id (no double counting) and email/phone for enhanced conversions. **You don't need to import anything into GTM.** Don't add Google Ads conversion tags in GTM either, or every conversion counts twice.

1. Google Ads → **Goals → Conversions → + New conversion action → Website** → enter `ceoturbo.com` → **Add a conversion action manually**. Create these 4:
   | Name | Category | Value | Count | Primary/Secondary |
   |---|---|---|---|---|
   | Booked call | Book appointment | Use the same value: **$150** | One | **Primary** |
   | Lead | Submit lead form | Use the same value: **$25** | One | **Primary** |
   | Phone call click | Contact | Don't use a value | One | **Secondary** |
   | Purchase | Purchase | Use different values | Every | **Primary** |
2. On each one → **Tag setup → Use Google tag → Install the tag yourself**. Copy the label: the part after the slash in `send_to: 'AW-18468746701/XXXXXXXX'`. **Send me the 4 labels.** I paste them into `GOOGLE_ADS_LABELS` in `src/lib/ga.ts` and into `ADS_PURCHASE_LABEL` in `docs/shopify-custom-pixel.js`.
3. **Enhanced conversions:** Goals → Settings → **Enhanced conversions for web** → on → method **Google tag**. Accept the customer data terms.
4. **Real phone calls:** Assets → **Call** asset with (678) 558-4327, and Conversions → **Phone calls → Calls from ads** (calls ≥ 60 s, Primary).
5. Check it: Google Ads → Goals → Conversions shows each action as "Recording conversions" within about 3 hours of a test lead.

GTM (GTM-KRPRZ67Z) stays on the site for anything you add later. Its old Google Ads container file (`docs/gtm-container.json`) is no longer needed.

## 4b. GA4 (G-XDWPSVBW53)
1. Admin → Events → mark as **key events**: `generate_lead`, `book_call`, `purchase`, `click_to_call`.
2. Admin → Product links → **Google Ads links** → link your Ads account (and turn on auto-tagging in Google Ads).
3. Admin → Data settings → Data collection → **Google signals** on; Data retention → **14 months**.
4. Admin → Data streams → web → Configure tag settings → **List unwanted referrals**: `checkout.shopify.com`, `uweee2-sc.myshopify.com`, `cal.com`, `app.cal.com` (keeps the ad as the source of a purchase/booking).
5. Import GA4 key events into Google Ads **only as Secondary**. The site's Google Ads conversions (section 4) are the Primary ones, so nothing is counted twice.

## 5. Shopify (purchases)
1. **Apps → Facebook & Instagram** (by Meta): connect pixel **3232222473609236**, Data sharing **Maximum**. That gives you Purchase via Pixel + Conversions API. Don't add Meta anywhere else on Shopify.
2. **Settings → Customer events → Add custom pixel:** paste `docs/shopify-custom-pixel.js`, fill in GA4 / Ads / UET ids → Save → **Connect**. That gives you Purchase in GA4, Google Ads (with enhanced conversions) and Microsoft.
3. In Google Ads, create a **Purchase** conversion action (*Website → manual → Google tag*), value: *use different values*, count: **Every**. Its label goes in `ADS_PURCHASE_LABEL`.
4. In Microsoft Ads → Conversion goals → **Event**: Action equals `purchase`, revenue *varies*. Add goals for `book_appointment`, `submit_lead_form` (revenue *varies*) and `contact` (phone clicks, secondary) too.
5. Do the listing and store settings in `shopify-listing.md`. The site's Buy button goes live as soon as the **Pack** variants exist.

## 6. Google Merchant Center + Microsoft Merchant Center (free listings + Shopping ads)
1. **Google Merchant Center** (merchants.google.com) → Business info: website `https://www.ceoturbo.com` → verify and claim (use the Search Console method).
2. **Shipping:** US, free, 1–2 day handling, 2–5 day transit. **Returns:** 5 days, by mail, customer pays the label, no restocking fee, no exchanges, refund within 30 days. **Add a support email** (also set `SITE.email` in `src/config/site.ts`).
3. **Products → Add products from a file → Scheduled fetch:** `https://www.ceoturbo.com/feeds/products.xml`, daily.
4. Turn on **Free listings** and link Google Ads for Shopping/PMax.
5. **Microsoft Merchant Center** (Microsoft Ads → Tools → Merchant Center): create a store for `ceoturbo.com` → **Catalog → Scheduled file download** with the same feed URL. Or import directly from Google Merchant Center.
6. Watch for disapprovals in the first 72 hours. Google sometimes reviews products that use its logo. If that happens, request a review and point to the "not affiliated with Google" line on the product page.

## 7. Test the whole thing (15 minutes)
- [ ] Events Manager → Test events → open `ceoturbo.com/google-review-cards`: **ViewContent**, then Buy → **AddToCart, InitiateCheckout**.
- [ ] Run a free check with your real email: **Lead** appears twice (Browser + Server) and is marked *deduplicated*.
- [ ] Take the quiz on `/brand-boost` with your real email: **Lead** (Browser + Server, deduplicated) and a row on the *Call Quiz Leads* tab.
- [ ] Book a test call from the quiz calendar: **Schedule** appears from Browser + Server; a row lands on *Booked Calls* and the quiz row flips to **Booked? = Yes**.
- [ ] **Microsoft Ads (UET `187280408`):** install the *UET Tag Helper* Chrome extension, take the quiz and book a test call. The helper shows the tag firing, then **`book_appointment`** once (event category `lead`, label `brand-boost-quiz`, revenue = the quiz call value). In Microsoft Ads → Conversion goals, the goal *Event → action equals `book_appointment`* must exist; its status turns to "Recording conversions" within a few hours. The same booking arrives in Google Ads as `book_call` (transaction id `book_<uid>`, so it is never counted twice).
- [ ] After the labels are in: a test free check shows the Google Ads *Lead* conversion as "Recording" within ~3h.
- [ ] Place a real $24.99 order (refund it afterwards): Meta **Purchase**, GA4 **purchase** (Realtime), Google Ads conversion (shows within ~3h), and the order shows the gclid/fbclid notes.
- [ ] Delete `META_TEST_EVENT_CODE`, then redeploy.
