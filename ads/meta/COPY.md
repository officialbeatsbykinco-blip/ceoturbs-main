# Meta feed ads: review cards

Images: `ads/meta/out/meta-feed-*.png` (1080x1350, 4:5). Rebuild with `npm run ads:meta`.

All four go in **one ad set** so Meta can push budget to whichever one sells.

## Website URL (same for every ad)

```
https://www.ceoturbo.com/
```

URL parameters field (Ads Manager → Ad → Tracking → URL parameters):

```
utm_source=facebook&utm_medium=paid_social&utm_campaign=review_cards&utm_content={{ad.name}}
```

Name each ad `gino`, `jess`, `mad`, `once` so the order in Shopify shows which ad sold it.

Call to action button: **Shop now**

---

## 1. gino (`meta-feed-gino-1080x1350.png`)

**Primary text**
Same pizza, same street, same prices. One has 23 Google reviews and one has 847. Guess which one people walk into.

Put a tap card on your counter. Customers tap it with their phone and your Google review page opens. No app, no typing a link.

$16.99, free US shipping, pay once.

**Headline:** Be the one with the reviews
**Description:** NFC Google review card · free US shipping

## 2. jess (`meta-feed-jess-1080x1350.png`)

**Primary text**
"I'll leave you a review tonight!!"

Every service business has heard it. Hardly anyone does it once they get home.

Ask while they're still standing in front of you. They tap the card, your Google review page opens, and they're done before they leave.

From $16.99. Free US shipping. No app, no monthly fee.

**Headline:** Get the review before they leave
**Description:** Works on iPhone + Android

## 3. mad (`meta-feed-mad-1080x1350.png`)

**Primary text**
Angry customers will find your Google page on their own, at midnight, with no help.

Happy customers mean to review you and forget.

A tap card at the register gives the happy ones a 5-second way to do it. 2 cards for $29.99: one for the counter, one for the truck or the door.

**Headline:** Give happy customers a nudge
**Description:** 2 cards $29.99 · free US shipping

## 4. once (`meta-feed-once-1080x1350.png`)

**Primary text**
Review software bills you every month. This card bills you once.

Customer taps it with their phone, your Google review page opens. No app to download, no login, nothing to cancel.

$16.99. Free US shipping. 5-day returns.

**Headline:** $16.99 once. No subscription.
**Description:** NFC Google review card

---

## Campaign settings

| Setting | Use |
| --- | --- |
| Campaign objective | Sales |
| Conversion location | Website |
| Pixel | CEO Turbo `3232222473609236` |
| Conversion event | Purchase |
| Location | United States only (shipping is US only) |
| Age | 25–65+ |
| Audience | Advantage+ audience, no interest stacking. Meta finds the owners faster than interests do |
| Placements | Facebook + Instagram Feeds (these are 4:5). Add 9:16 versions before you turn on Stories/Reels |
| Budget | $30–50/day on the ad set. Leave it alone for 3–4 days; every edit restarts learning |
| Kill rule | After $50 spent on one ad with 0 add-to-carts, turn that ad off |

## Before you hit publish

1. **Prove Purchase reaches Meta.** The pixel logged 105 checkouts and 0 purchases in the last 28 days, and Shopify has 0 orders. Optimizing for Purchase only works if Meta sees the sale. Make sure the Shopify **Facebook & Instagram** app is connected to pixel `3232222473609236`. Then buy one $16.99 card yourself, check Events Manager → Test events for `Purchase`, and refund the order. If no Purchase shows up, set `SERVER_PURCHASE_EVENTS=true` and `META_CAPI_TOKEN` in Vercel (see `api/shopify-webhook.js`).
2. **Turn on abandoned checkout emails** (Shopify → Marketing → Automations → Abandoned checkout). 105 people got to checkout and left; this email brings some back automatically.
3. **Put the checkout on your own domain.** Checkout currently shows `uweee2-sc.myshopify.com`, which looks sketchy to someone who just clicked an ad. Connect a subdomain like `shop.ceoturbo.com` in Shopify → Settings → Domains and make it primary.
