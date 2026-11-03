# ceoturbo.com

Growth agency site for CEO Turbo: a free SEO/AEO/GEO audit lead magnet, a Google review card store, and agency pages for artists, local businesses and Shopify stores.
Vite + React + Tailwind, **prerendered to static HTML** so Google, Bing and AI crawlers (ChatGPT, Perplexity, Claude) read every page without running JavaScript.

## Commands

```bash
npm install
npm run dev        # local dev server on :8080
npm run build      # client build + SSR build + prerender 56 pages, sitemap.xml, llms.txt
npm run preview    # serve dist/ on :4173 with production security headers
npm test           # content, SEO, asset and CSP checks
npm run images     # regenerate public/img from ../ceoturbo-main/Images
node scripts/review-card-assets.mjs  # rebuild review card photos + share images
npm run indexnow   # after deploying: push every URL to Bing/IndexNow
```

## Where things live

| What | File |
| --- | --- |
| Links, booking, review card prices / packs / Stripe links / shipping | `src/config/site.ts` |
| Free audit engine (runs on Vercel) | `api/audit.js`, `api/_lib/audit.js` |
| Lead capture → Google Sheet / CRM | `api/lead.js`, `api/_lib/leads.js`, `docs/leads-google-sheet.md` |
| Audit UI | `src/components/audit/` |
| Custom shirt designer + stores: company t-shirts and artist merch (manual dropship via Printify) | `src/pages/CompanyShirts.tsx`, `src/pages/ArtistMerch.tsx`, `src/components/shirts/`, `api/shirt-design.js`, `docs/company-shirts.md`, `docs/artist-merch.md` |
| Shirt video ads (HyperFrames, 9:16) + Meta/TikTok playbook | `ads/hyperframes/build.mjs` (`npm run ads:build`, `npm run ads:render`), `docs/ads/meta-tiktok-shirts.md` |
| Review card store + setup guide | `src/pages/ReviewCards.tsx`, `src/pages/ReviewCardSetup.tsx`, `src/components/shop/`, `src/content/review-cards.ts` |
| Security headers / CSP (keep `vercel.json` in sync — a test checks) | `src/config/headers.ts` |
| Client sites (20 case studies) | `src/content/clients.ts` |
| Meta ad results (real dashboard numbers) | `src/content/results.ts` |
| Ad creatives | `src/content/ads.ts` |
| Services (9 pages) | `src/content/services.ts` |
| Artist / local / Shopify pages | `src/content/audiences.ts` |
| Guides (answer pages for AEO/GEO) | `src/content/guides.ts` |
| Titles, descriptions, JSON-LD per URL | `src/seo/pages.ts`, `src/seo/schema.ts` |
| Booking modal (Cal.com) | `src/lib/cal.ts` |

Add a client, service or guide to its content file and the page, sitemap entry, schema and `llms.txt` line are generated on the next build.

## Before launch

1. **Leads:** follow `docs/leads-google-sheet.md` and set `LEADS_WEBHOOK_URL` + `LEADS_WEBHOOK_SECRET` in Vercel. Without it, leads only appear in Vercel function logs.
2. **Review card checkout:** create one Stripe Payment Link per pack (collect shipping address, add a "Business name" custom field) and paste them into `REVIEW_CARD.packs[].checkoutUrl` in `src/config/site.ts`. Until then, Buy opens an order-request form that sends the order to your lead sheet.
3. **Confirm with your supplier** that `REVIEW_CARD.shipping` times and the QR code on the cards are right (the FAQ and setup guide assume you program the NFC chip yourself and tell buyers how to check the QR).
4. **Deploy** to Vercel (`vercel.json`: clean URLs, redirects for old URLs incl. `/digital-business-card` → `/google-review-cards`, function time limits, caching, security headers).
5. Submit `https://www.ceoturbo.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools, then run `npm run indexnow`.
6. Optional tracking: add GA4 and/or Meta Pixel in a file loaded with `<script src="/tracking.js" defer>` (the CSP blocks inline scripts). Events already fire: `audit_start`, `audit_lead` (Meta `Lead`), `audit_complete`, `booking_open` (Meta `Schedule`), `card_checkout` (`InitiateCheckout`), `order_request` (`Lead`). Add a cookie banner for EU/UK visitors if you do.

`_legacy/` holds the previous Lovable components, pages and assets for reference. It is not part of the build.
# CEO-TURBO-USE-THIS-ONE-
