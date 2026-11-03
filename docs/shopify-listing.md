# Shopify listing — NFC Google Review Card

Paste these fields into the **existing** product (Products → *Google Review Tap Cards – NFC + QR Review Cards*, id `15410641502443`).
Keep editing that one product rather than making a new one, because the website's buy box is wired to this product id.

> **Required for checkout to work:** the **Pack** option and its 3 variants (section 5). Until they exist, the site's
> Buy button safely falls back to the order-request form instead of sending people to a checkout with the wrong price.

---

## 1. Title
```
NFC Google Review Card – Tap to Review, Works on iPhone & Android, No App
```

## 2. Description (click `</>` in the editor, paste the HTML)
```html
<p><strong>Turn “I'll leave you a review” into a review — before they walk out.</strong></p>
<p>Customers hold their phone near the card and your Google review page opens instantly. No searching for your business, no scrolling Google Maps, no app. One tap, three seconds, five stars.</p>

<h3>Why businesses love it</h3>
<ul>
  <li><strong>One tap opens your Google review form</strong> — the fastest way for a happy customer to post a review.</li>
  <li><strong>Works on iPhone &amp; Android</strong> — every iPhone XS or newer and NFC-enabled Android phones. Customers need no app.</li>
  <li><strong>Pay once, use forever</strong> — no subscription. Re-program it anytime, for any location.</li>
  <li><strong>Looks premium on any counter</strong> — matte white “Review Us On Google” front, sleek black NFC back.</li>
  <li><strong>Built to last</strong> — waterproof PVC, credit-card size, wipe-clean.</li>
</ul>

<h3>Perfect for</h3>
<p>Restaurants and cafés · salons, barbers and spas · contractors and home services · retail counters · dentists, clinics and gyms · auto shops · any business with a Google Business Profile.</p>

<h3>Set up in 2 minutes</h3>
<ol>
  <li>Find your Google review link with our free finder at <a href="https://www.ceoturbo.com/google-review-card-setup">ceoturbo.com/google-review-card-setup</a>.</li>
  <li>Open the free NFC Tools app (iPhone or Android) → Write → Add a record → URL → paste your link.</li>
  <li>Tap Write and hold the card to your phone. Done — test it with a second phone.</li>
</ol>

<h3>Specs</h3>
<ul>
  <li>Chip: NTAG215 NFC (504 bytes user memory)</li>
  <li>Size: 85.5 × 54 mm (credit-card size), 0.76 mm thick</li>
  <li>Material: waterproof PVC, matte finish</li>
  <li>Front: white “Review Us On Google” · Back: black NFC side</li>
  <li>Compatible: iPhone XS and newer (iPhone 7–X via the NFC Tag Reader), NFC-enabled Android phones</li>
</ul>

<h3>Shipping &amp; guarantee</h3>
<p>Ships in 1–2 business days from Atlanta, GA. Free US shipping. Return a new, unused card within 5 days of delivery for a refund, no restocking fee (see our Shipping & Returns page).</p>

<p><em>CEO Turbo review cards are an independent product that links to your Google review page. Google is a trademark of Google LLC; we are not affiliated with or endorsed by Google.</em></p>
```

## 3. Media (upload in this order, with this alt text)
Files are in `public/img/review-cards/`. Shopify accepts the `.webp` and `.jpg` files as they are.

| # | File | Alt text |
|---|---|---|
| 1 | `feed-white.jpg` | NFC Google review card, white Review Us On Google front and black NFC back |
| 2 | `specs.webp` | Review card specs: NTAG215 chip, waterproof PVC, 85.5 × 54 × 0.76 mm |
| 3 | `retail-counter.webp` | Customer taps the Google review card at a store counter after paying |
| 4 | `tap-review.webp` | Phone held near the card opens the Google review page — iPhone and Android |
| 5 | `how-it-works.webp` | How it works: tap phone, open review link, submit feedback |
| 6 | `stack.webp` | Stack of Review Us On Google NFC cards |
| 7 | `size.webp` | Credit-card size: 85.5 mm × 54 mm |

Delete the old blue NFC + QR images from the product.

## 4. Category, organization
| Field | Value |
|---|---|
| Category | Business & Industrial › Signage *(if Shopify suggests a closer "NFC tags / business cards" category, that's fine too)* |
| Product type | `NFC Review Card` |
| Vendor | `CEO Turbo` |
| Collections | Create **Google Review Cards** and add it |
| Tags | `google review card, nfc review card, tap to review, review us on google, google reviews, nfc card, small business, restaurant, salon, barber, contractor` |
| Status | Active |
| Theme template | Default product |

## 5. Variants — option name **Pack**
Click **Add options like size or color** → Option name **`Pack`** → values exactly **`1 card`**, **`2 cards`**, **`5 cards`**, **`10 cards`**.
Then delete the old "Default Title" variant if Shopify keeps it.

| Pack | Price | Compare-at | Cost per item | SKU | Barcode | Weight |
|---|---|---|---|---|---|---|
| 1 card | **16.99** | *(leave blank)* | 7.00 | `CT-NFC-REVIEW-1` | *(blank)* | 1 oz |
| 2 cards | **29.99** | *(leave blank)* | 14.00 | `CT-NFC-REVIEW-2` | *(blank)* | 1.5 oz |
| 5 cards | **59.99** | *(leave blank)* | 35.00 | `CT-NFC-REVIEW-5` | *(blank)* | 2.5 oz |
| 10 cards | **99.99** | *(leave blank)* | 70.00 | `CT-NFC-REVIEW-10` | *(blank)* | 4 oz |

- **The SKUs must match exactly.** They are the same ids the website, the Merchant feed and the ad pixels use, so purchases line up across Google, Microsoft and Meta.
- **Compare-at:** leave it blank. Showing a "was" price you never really charged is a fake discount (FTC and Merchant Center both flag it). The site already shows real pack savings.
- **Charge tax:** Yes.
- **Pack 1 → 2 → 5 → 10 margins** at $7 a card: about $10, $16, $25 and $30 gross per order, before shipping and fees.
- **Card programming:** separate $5 product (`CT-PROGRAM`, published to Buy Button only). The review link prints on that order line.

## 6. Inventory
- **Inventory tracked: Off.** Packs use different numbers of cards, so per-variant counts would be wrong. You have 30 cards; reorder when you hit about 10.
- If you'd rather track it: set 1-card = 30, 2-card = 15, 5-card = 6, and adjust by hand after each order.

## 7. Shipping
- **Physical product:** On.
- **Package:** a 6 × 9 in bubble mailer (add it under Settings → Shipping → Packages). A rigid card in a plain letter envelope gets a non-machinable surcharge and can get bent.
- **Settings → Shipping and delivery:** create a "Free US shipping" rate at **$0.00** for the United States. Processing time: 1–2 business days.
- **Country of origin:** CN *(from your supplier)*. **HS code:** `8523.52` (smart cards).

## 8. Search engine listing (pencil icon)
| Field | Value |
|---|---|
| Page title | `NFC Google Review Card – Tap to Review | CEO Turbo` |
| Meta description | `Customers tap their phone and your Google review form opens. iPhone & Android, no app, no subscription. From $16.99, free US shipping.` |
| URL handle | `nfc-google-review-card` |

## 9. Store settings that affect conversion (do these once)
1. **Settings → General → Store name:** change "My Store" to **CEO Turbo**. Buyers see this name on the checkout page and in receipts.
2. **Settings → Checkout → Customize:** upload the CEO Turbo logo, use the brand colors (button `#ff6b1a`, accent `#1a9fff`), and turn on **Shop Pay, Apple Pay and Google Pay** under Settings → Payments.
3. **Checkout → Customer contact:** "Phone or email" plus **"Add a phone number field: Optional"**. The phone number improves ad matching.
4. **Order status page → Additional scripts:** leave it empty. Tracking runs through Customer events (see `tracking-setup.md`).
5. **Sales channels:** keep the product published to **Buy Button**, since the website's checkout uses that channel's token. The Online Store channel is optional.
6. **Policies:** add Refund, Shipping, Privacy and Terms policies (Settings → Policies). Merchant Center and Microsoft both require them.

## 10. Order notes you'll see
Every order placed through ceoturbo.com shows **Additional details** on the order: Business name, Pack, Landing page,
and the ad click ids (gclid / fbclid / msclkid, `_fbp`, `_fbc`) plus UTMs. That tells you which ad drove the sale.
