# Custom shirts — company shirts + artist merch (manual dropship)

Two stores, one designer, one workflow:

| | Company shirts | Artist merch |
| --- | --- | --- |
| Page | **https://www.ceoturbo.com/custom-company-t-shirts** | **https://www.ceoturbo.com/artist-merch** |
| Shopify product | `15418511327467` · `custom-company-t-shirts` · 96 variants | `15419989033195` · `custom-artist-merch-t-shirts` · 144 variants |
| Design IDs | `CT-…` | `AM-…` |
| Blank | Gildan 64000 / 64400 Softstyle | Gildan 5000 / 5400 Heavy Cotton |
| Price (front) | $27.99 short · $34.99 long | $24.99 short · $31.99 long |
| Back print / 2XL–3XL | +$8 / +$3 | +$7 / +$3 |
| Volume discounts (Shopify automatic) | 10% at 12+, 15% at 24+ | 10% at 12+, 15% at 24+, 20% at 50+ |

Code: designer `src/components/shirts/` (one engine, `ShirtMaker` takes `SHIRT` or `ARTIST_SHIRT` from `src/config/site.ts`), pages `src/pages/CompanyShirts.tsx` + `src/pages/ArtistMerch.tsx`, copy in `src/content/company-shirts.ts` + `src/content/artist-merch.ts`. Both products are in the Shopify collection **Custom Shirts**.

**Fulfillment for now: you order every shirt by hand from a print-on-demand partner (Printify, free plan — no monthly fee, no store connection) and it ships straight to the buyer.** When you open your own print shop, the old in-house DTF routine is at the bottom ("Phase 2").

## How an order flows

1. Buyer designs it: uploads a logo/art, drags it into place, size/rotate, font, text, back print (artists: tour dates or different back art), sizes → **Order**.
2. The browser renders the **print file** — transparent PNG at **300 DPI** (3600 × 4800 px = 12" × 16" front/back, 1200 × 1200 = 4" × 4" left chest) — plus a mockup, and posts them to `/api/shirt-design`.
3. The leads Apps Script saves them in Drive (**CEO Turbo Shirt Designs**) and adds a row to **Shirt Designs** (Type, preview, Drive links, sizes, font, ad source). Status *Designed*.
4. Shopify checkout. Each cart line carries `Design ID`, `Placement`, `Print file`, `Front text`, `Back text`.
5. Paid → webhook adds a row to **Shirt Orders** (Status *New*, full ship-to address) and marks the design *Paid*. **You get an email** with everything you need (set `ORDER_EMAIL` in the Apps Script).
6. **You place it with the printer** (below) → Status *Ordered from printer* → *In production* → *Shipped* → paste tracking → mark the Shopify order fulfilled with that tracking number (Shopify emails the buyer).

Designs left at *Designed* = abandoned carts. Text or call them — the ad source columns say which ad brought them.

## Placing an order on Printify (5 minutes)

One-time: create a free Printify account → **My stores → Add new store → "Manual orders / API"** (don't connect Shopify — you don't need to). Add a payment card.

Every paid order:

1. Open the **Print file** link from the email / Shirt Orders row (Drive) and download the PNG (and the back PNG if it says Front + back).
2. Printify → **Catalog** → pick the blank:
   - Company shirts: **Gildan 64000 Softstyle** (short) / **Gildan 64400** (long).
   - Artist merch: **Gildan 5000 Heavy Cotton** (short) / **Gildan 5400** (long).
   - Choose the print provider with the **lowest price + US location + good rating** (usually Monster Digital, SwiftPOD or Print Geek). Stick to one provider per blank so colors match between orders.
3. **Start designing** → upload the front PNG → for a center-front design click **Fit to print area width** and align to the top; for left chest put it on the *Left chest* area at about 3.5" wide. Add the back PNG on *Back* if the order has one. Enable only the colors in the order. Save as **"CT-XXXX" (the Design ID)** — next time the same customer reorders you just reuse it.
4. **Orders → Create order** → pick that product → add each color/size × quantity from the *Sizes* column → paste the **Ship to** name and address → **Standard shipping** → pay.
5. Paste Printify's order number and the total you paid into **Print partner order # / Print partner cost $** → Status *Ordered from printer*.
6. When Printify marks it shipped, copy the tracking number → Shopify → order → **Fulfill items** → paste tracking → Status *Shipped*.

**Before you pay, look at the mockup Printify shows.** Blurry, cut off, white box on a dark shirt, or a logo that isn't theirs? Text the buyer first (that's the "a real person checks it" promise on the page).

Backup partners if Printify has a problem: **Gelato** or **Printful** (manual orders too, a few $ more per shirt), or **Tapstitch** for a heavyweight "premium" artist line later. Same steps.

## Profit per order (Printify free plan estimates — check the live price on the product you pick)

Printify Gildan 5000 ≈ $8.50–9.50, Softstyle 64000 ≈ $9.50–11, long sleeve ≈ $13–15, back print adds ≈ $3–5. US shipping ≈ $4.29–4.75 first shirt, ≈ $2.09–2.50 each extra. Shopify Payments 2.9% + 30¢.

| | 1 shirt | 12 shirts | 24 shirts | 50 shirts |
| --- | --- | --- | --- | --- |
| **Company** revenue (short, front) | $27.99 | $302.29 (−10%) | $570.99 (−15%) | $1,189.58 (−15%) |
| Printify cost + shipping | ≈ $15 | ≈ $150 | ≈ $295 | ≈ $610 |
| **Profit before ads** | **≈ $12** | **≈ $143** | **≈ $259** | **≈ $545** |
| **Artist** revenue (short, front) | $24.99 | $269.89 (−10%) | $509.80 (−15%) | $999.60 (−20%) |
| Printify cost + shipping | ≈ $14 | ≈ $140 | ≈ $275 | ≈ $565 |
| **Profit before ads** | **≈ $10** | **≈ $121** | **≈ $220** | **≈ $405** |

Back print: buyer pays +$7–8, you pay ≈ $3–5 → a few dollars more profit. Free US shipping is already in these numbers (Shopify → Settings → Shipping: US rate **Free**).

**Printify Premium** ($24.99/mo billed yearly) cuts blank prices about 20–30%. Turn it on once you do ~10+ shirts a week — it pays for itself at about 15 shirts a month.

## Ads

Meta (Facebook + Instagram) and TikTok for both lines: **`docs/ads/meta-tiktok-shirts.md`** (campaigns, audiences, budgets, kill/scale rules) and the video ads in **`ads/hyperframes/`**. The Microsoft campaign (`docs/ads/microsoft-ads-company-shirts.csv`) is still there, paused — turn it on later if you want search traffic too; its ad copy says "No minimum · Free US shipping", update the "Ships in 2–3 days" callout to "Printed in 2–4 days" first.

## Tracking (live — nothing to install on the site)

| Step | Event | Where it goes |
| --- | --- | --- |
| Page view | `view_item` (SKU `CT-TEE-SS` / `CT-MERCH-SS` …) | Meta ViewContent, TikTok ViewContent, GA4, UET |
| First upload / text / font / drag | `customize_product` | Meta CustomizeProduct, TikTok, GA4, UET |
| Order button | `add_to_cart` → `begin_checkout` (value = order total) | Meta (Pixel + Conversions API), TikTok (Pixel + Events API), GA4, UET, Clarity |
| Paid order | `purchase` | Meta: Shopify **Facebook & Instagram** app · TikTok: Shopify **TikTok** app · GA4 + UET: Shopify custom pixel |

## One-time setup checklist

1. **Apps Script** (required): paste the new `docs/leads-apps-script.js` (keep your real `SECRET`; check `ORDER_EMAIL`) → **Deploy → Manage deployments → Edit → New version → Deploy** → allow **Drive** and **Gmail (send mail)** → run `setupSheet` once. New columns (Type, Print partner order #, Print partner cost $) are added to the tabs automatically.
2. Printify account + payment card (above).
3. Shopify → Settings → Shipping: US rate **Free** (both pages promise it).
4. Deploy the site, place one real test order on each page (refund it), check the *Shirt Orders* row + email, place it on Printify as a dry run (cancel before production) so you know the clicks.
5. TikTok: install the **TikTok** sales channel app on Shopify (purchases), then set `VITE_TIKTOK_PIXEL_ID` + `TIKTOK_ACCESS_TOKEN` in Vercel (`docs/tracking-setup.md`).

Product photos: `node scripts/shirt-images.mjs` regenerates both lines. Replace them with real photos of your first orders as soon as you have them.

## Phase 2: your own print shop (when volume justifies it)

At ~40+ shirts a week, pressing in-house doubles profit per shirt (≈ $14–17 vs ≈ $10–12). The kit: 16" × 20" heat press ($250–500), DTF transfers from a local gang-sheet printer (≈ $2.50 a big front, 40¢ a left chest), blanks from S&S Activewear / SanMar / Jiffy (≈ $4), poly mailers, Shopify Shipping labels. Press at 300–325°F, 10–15 s, medium-firm pressure; center front starts about 3" below the collar. The print files the site already makes (300 DPI PNG) are exactly what gang-sheet builders want — nothing on the site changes, only who presses the shirt.
