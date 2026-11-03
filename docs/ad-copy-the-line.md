# "The Line": Meta + TikTok ad pack (Google review cards)

**Files** (`videos/ceoturbo-ads/renders/`):
- `ad7-the-line.mp4` 1080x1920, 27s: Reels, Stories, TikTok
- `ad7-the-line-4x5.mp4` 1080x1350, 27s: Facebook + Instagram feed
- Audio: -14.4 LUFS integrated, -3.5 dBTP, AAC. Narration + music + SFX are mixed in; captions are burned in, so it works muted.

**Truth rules:** the 12 vs 400 reviews are an illustration. Don't claim they're real. No "limited stock", no ranking guarantees (the product page itself says rankings aren't guaranteed). Keep "Free US shipping" and "5-day returns" (both are on the Shopify product).

## Setup (both platforms)
- **Objective:** Sales → optimize for **Purchase**. Landing: `https://www.ceoturbo.com/google-review-cards`
- **Pixel/CAPI:** Meta pixel 3232222473609236. TikTok pixel id goes in Vercel `VITE_TIKTOK_PIXEL_ID` (+ `TIKTOK_ACCESS_TOKEN` for server events). Until a purchase has happened, optimize for **InitiateCheckout** or **AddToCart** to feed the learning phase, then switch to Purchase.
- **Budget:** start $15-25/day per platform, one ad set per placement group, 3-4 days before judging. Judge by cost per **purchase** (24.99 pack means a good CPA is well under $20).
- **UTMs:** `?utm_source=meta&utm_medium=paid_social&utm_campaign=cards_line&utm_content=the_line_916` (use `tiktok`, `_45` etc. to match). The site saves these and attaches them to the Shopify cart so orders tie back to the ad.

## Meta (Facebook + Instagram)
- **Placements:** Advantage+ with **Audience Network off**. Reels/Stories get the 9:16 file, Feed gets the 4:5 file (upload both to one ad).
- **Audience:** broad US, 25-60, Advantage+ with suggestions "small business owners". Local trades are the buyers: barbers, salons, nail techs, plumbers, HVAC, restaurants, dentists, auto shops.
- **Primary text (keep short):**
  > Your competitor has a line out the door and you have 12 reviews. Same skills, same prices. The difference is how easy it is to leave a review. A customer taps their phone on the card, the Google review page opens, done. Free US shipping, 5-day returns.
- **Headline:** `Get more Google reviews with one tap`
- **Description:** `NFC review cards from $24.99. Free US shipping.`
- **CTA button:** Shop Now
- **A/B ideas:** (a) headline `Win the line`; (b) same video, primary text opens with `Why does he get all the customers?`; (c) trade-specific text lines (`Barbers:` / `Nail techs:` / `Plumbers:` / `Restaurants:`) on the same video.

## TikTok
- **Format:** In-feed 9:16. Keep text out of the bottom ~35% and right rail (the video's captions already sit above it). Use **Spark Ads** if you post it organically first.
- **Caption (≤ 100 chars):** `12 reviews vs 400 reviews. The line goes where the reviews are.` + `#smallbusiness #googlereviews #barber #nails #plumber`
- **Name:** `Cards | The Line | 916`
- **Objective:** Website conversions → Purchase (or Complete Payment) once the pixel has fired; otherwise Add to Cart.

## Specs checklist (verified with ffprobe/ebur128)
- [x] 1080x1920 and 1080x1350, H.264 + AAC, 27 s
- [x] Integrated loudness -14.4 LUFS, true peak -3.5 dBTP
- [x] Captions burned in, key text inside safe zones
- [x] No profanity, no unverifiable claims

## First 7 days
- Day 0: launch both. Reply to every comment fast. Pin a comment with the link.
- Day 3: cut anything with CTR under 0.5% (Meta link CTR) and no add-to-carts.
- Day 7: move budget to the placement with the lowest cost per purchase. Rotate in a new hook only after this creative's CPA is known.
