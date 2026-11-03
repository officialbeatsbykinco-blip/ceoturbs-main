# Image ad research: review card on YouTube / Demand Gen

Researched 2026-10-25. Honest summary: Google publishes the specs, but I found no controlled study proving what makes a static ad convert. The design rules below are practitioner consensus, so they are hypotheses to test, not facts.

## Specs (Google, official)
Source: https://support.google.com/google-ads/answer/17140672

| Shape | Ratio | Recommended | Min |
|---|---|---|---|
| Square | 1:1 | 1200x1200 | 300x300 |
| Horizontal | 1.91:1 | 1200x628 | 600x314 |
| Vertical | 4:5 | 960x1200 | 480x600 |
| Vertical | 9:16 | 1080x1920 | 600x1067 |

- Max 5 MB per image, JPG or PNG. Upload up to 3 per orientation for full placement coverage.
- Headlines up to 40 characters (at least 3 unique, up to 5), descriptions up to 90 (3 to 5), business name up to 25.
- 9:16 safe zones follow vertical video: keep text roughly between y 300 and 1520 on 1080x1920.
- Logo: square, 1200x1200, max 150 KB.

## Practitioner patterns (unverified)
Sources: https://www.attnagency.com/blog/static-image-ad-design-principles, https://brick-by-brick.beehiiv.com/p/static-ads-every-dtc-marketer-should-study, https://www.superscale.ai/learn/static-ads
- One dominant visual and one promise per ad; clarity beats cleverness.
- High contrast that survives a small phone screen; product kept to one side so text has room.
- Short emotional or pain-point first line, proof compressed into small chips.
- Test hook, layout and CTA one variable at a time; the plain ad that converts beats the pretty one that doesn't.

## What we built and why
| Concept | Hook | Test question |
|---|---|---|
| tap | "Tap. Review. Done." + from $24.99 | Does the demo/benefit hook beat price-first? |
| later | "I'll review you later." They won't. | Does the pain hook beat the demo? |
| price | $24.99 as the biggest element | Does a giant price lift clicks or hurt them? |

## Compliance (from competitor notes and the Microsoft campaign doc)
No "guaranteed", "#1", "rank higher", "official" or "by Google"; no incentive for reviews; no invented review counts or earnings. The card has no QR code, so none appears in card ads; only the stand and combo ads show one, because the stand has NFC and a QR code.

## Competitor angles (docs/competitor-ads-notes.md)
Merchynt leads with a free NFC card and no monthly fee; ZappyCards leads with competitor review-count comparison and a guarantee; Tap Grow sells done-for-you setup at $50. Our edge to keep testing: a human at (678) 558-4327, free setup guide, and the website + ads upsell.

## Quality notes
- Product photos are 2048px; the stand is redrawn as vector art (the supplied photo was 620px) with a real QR code to the shop page.
- `out/` holds the Google-spec sizes; `out/hd/` holds 2x versions (e.g. 2400x1256, 2160x3840), all under 5 MB.
- Concepts: tap, later, price, stand, combo (stand + 2 cards, $54.99, saves $15 vs $69.98 separate).

## Regenerate
`npm run ads:image` renders every concept at 1200x628, 1200x1200, 960x1200 and 1080x1920 into `ads/youtube/out/`. It needs Google Chrome at the default macOS path (or `CHROME_BIN`).
