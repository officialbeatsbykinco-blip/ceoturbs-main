# Meta (and TikTok/Reddit) test-events checklist: 15 minutes, in this order

I can't reach ceoturbo.com from my build environment, so this is the live check only you can run. Pixel: **3232222473609236**.

## 0. What I already verified (no action)
- Shopify store `uweee2-sc.myshopify.com` matches `src/config/site.ts`; product `CT-NFC-REVIEW-1/2/5` is ACTIVE, on 9 sales channels, purchasable (inventory untracked).
- **No orders exist yet**, so there is no Purchase to find in Meta. That alone explains "it says it's not tracking".
- Site code sends PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Schedule, Contact (browser + server, de-duplicated).

## 1. Turn on a test code
Events Manager → your pixel → **Test events** → copy the code (`TEST12345`). In Vercel add env `META_TEST_EVENT_CODE=<code>` and redeploy. Delete it afterwards.

## 2. Funnel events (website)
Open `https://www.ceoturbo.com/google-review-cards` in the test-events window.
| You do | You should see (Browser **and** Server, marked deduplicated) |
|---|---|
| Open the page | PageView, ViewContent (value, content_ids `CT-NFC-REVIEW-n`) |
| Tap Buy | AddToCart, InitiateCheckout |

If only **Browser** appears: `META_CAPI_TOKEN` is missing in Vercel. If only **Server**: an ad blocker is on, try a clean browser profile.

## 3. Purchase (this is the one that's "not tracking")
Purchase can come from **either** of two places. Use exactly one:

**Option A: Shopify's Facebook & Instagram app (recommended default)**
1. Shopify admin → **Settings → Apps and sales channels → Facebook & Instagram** → open it.
2. **Data sharing → Maximum**, pixel **3232222473609236** connected, "Customer Data Sharing" on.
3. Place a real $24.99 order (refund after). Meta Test events should show **Purchase** within a few minutes.

**Option B: server-side from our webhook (if A shows nothing)**
1. Vercel env: `SERVER_PURCHASE_EVENTS=true`, `META_CAPI_TOKEN`, `SHOPIFY_WEBHOOK_SECRET`, and (for TikTok) `TIKTOK_ACCESS_TOKEN` + `TIKTOK_PIXEL_ID`. Redeploy.
2. Shopify admin → **Settings → Notifications → Webhooks → Create webhook**: Event **Order payment**, JSON, URL `https://www.ceoturbo.com/api/shopify-webhook`; copy the signing secret into `SHOPIFY_WEBHOOK_SECRET`.
3. Place a real $24.99 order. You should see **Purchase** (Server) with event id `purchase_<orderId>`, value 24.99, content id `CT-NFC-REVIEW-1`, and match data (email, phone, name, city, `fbp/fbc` when the buyer came from an ad).
4. **Don't turn on both** unless Meta shows them as deduplicated; if you see two Purchases per order, switch the Facebook & Instagram app's Purchase off.

## 4. Leads and bookings
- Free check on `/free-audit` with a real email → **Lead** (Browser + Server, deduplicated).
- Dev form on `/app-marketing#intake` with a test email → **Lead** with `lead_source reddit-dev-intake`.
- Book a test call → **Schedule**.

## 5. Match quality
Events Manager → Overview → Event match quality. Aim for Good or better on Lead, Schedule, Purchase. Low = ask for phone at checkout, and make sure `fbc/fbp` are present (they are set from the ad click).

## 6. TikTok and Reddit
- **TikTok:** set `VITE_TIKTOK_PIXEL_ID`, redeploy, Events Manager → Test events → open the shop page → ViewContent, AddToCart, InitiateCheckout. Purchase comes from the same webhook (Option B) or TikTok's Shopify app.
- **Reddit:** set `VITE_REDDIT_PIXEL_ID` (`a2_…`), redeploy, Reddit Events Manager → Test events → open `/app-marketing` → PageVisit; submit the dev form → Lead.

## 7. Clean up
Delete `META_TEST_EVENT_CODE` (and `TIKTOK_TEST_EVENT_CODE`), redeploy, refund your test order.
