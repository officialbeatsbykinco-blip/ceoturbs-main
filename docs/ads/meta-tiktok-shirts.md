# Meta (Facebook + Instagram) and TikTok ads — custom shirts

Two products, two audiences:

- **Artist merch** → https://www.ceoturbo.com/artist-merch: independent artists, rappers, bands, DJs, producers.
- **Company shirts** → https://www.ceoturbo.com/custom-company-t-shirts: small-business owners, mostly trades, restaurants, salons, gyms and cleaners.

Nothing here is live. Every campaign is built **paused**, and you turn it on.

## TikTok or Meta — which is cheaper?

| | TikTok | Meta (FB + IG) |
| --- | --- | --- |
| Cost per 1,000 views (2026) | ~$4–9 | ~$8–14 |
| Cost per click | ~$0.20–1.00 | ~$0.50–1.50 |
| Cost per **sale** | usually higher | usually **lower** (better buyer data) |
| Best for | artists (they live there), cheap reach, funny videos | business owners, retargeting, actually closing the sale |

**Plan:** use TikTok to get eyeballs cheaply, use Meta to get purchases, and **retarget everyone who designed a shirt but didn't buy** on both. The `customize_product` and `begin_checkout` events already fire on both pixels, so those audiences fill themselves.

## The videos

These live in `ads/hyperframes/`. `npm run ads:build` writes them and `npm run ads:render` renders them to `ads/hyperframes/out/*.mp4`, at 1080 × 1920 and about 15 seconds each. Edit the words in `ads/hyperframes/build.mjs` and re-render; each ad is a list of scenes.

| File | Audience | Hook (first 2 seconds) |
| --- | --- | --- |
| `artist-merch-guy.mp4` | Artists | "POV: your merch guy said 'next week'" — sticker: 6 weeks ago |
| `artist-zero-merch.mp4` | Artists | "Me at my own show selling 0 merch" |
| `artist-tour-back.mp4` | Artists | "My tour: 3 cities" — sticker: 2 are my cousin's house |
| `biz-group-project.mp4` | Business | "Your crew showing up to a job like a group project". Six mismatched shirts snap into matching logo shirts |
| `biz-minimum-24.mp4` | Business | Print shop: "minimum is 24 shirts", then "Me with 3 employees" |
| `biz-new-hire.mp4` | Business | "New hire showing up in a Minions tee, day 1" |
| `event-last-minute.mp4` | Business / events | "Event is in 2 weeks" — sticker: and i have ZERO shirts. The sponsor asks for merch, logo upload, shirts show up with days to spare |

### Event Last Minute

- **Concept:** an event is two weeks out and there are no shirts. The fast, easy order saves it (panic, then relief).
- **Target:** event planners, marketing managers, small-business owners, party and team organizers.
- **Voice:** woman, 25–35, conversational, like a TikTok creator telling a friend. Script and direction are in `ads/hyperframes/event-last-minute/voice-script.txt`. This is the one ad meant to run **with** a voice-over. Upload `ads/hyperframes/out/event-last-minute-vo.mp4` (18 s, Kokoro `af_heart` voice plus a generated music bed), which `videos/ceoturbo-ads/mix-audio-event.sh` builds after the render. If you add a trending sound, keep it very low.
- **Placements:** TikTok, Reels, Stories.
- **Angle:** urgency, then relief. It only uses the real timeline (prints in 2–4 business days, arrives 3–6 days after shipping), so don't edit it to "overnight" or "tomorrow".
- **CTA:** Design yours → ceoturbo.com/custom-company-t-shirts.

Every ad ends on the price, "no minimum", free shipping and the URL. Add a trending sound inside TikTok or Meta when you upload: the videos are silent on purpose, so you can pick the sound that's trending that week. **Turn captions on.**

## Tracking (already wired)

| Event | Meta | TikTok |
| --- | --- | --- |
| Page view of a shirt page | ViewContent | ViewContent |
| Uploads art or edits the design | CustomizeProduct | CustomizeProduct |
| Taps Order | AddToCart, then InitiateCheckout | AddToCart, then InitiateCheckout |
| Pays | Purchase (Shopify **Facebook & Instagram** app) | CompletePayment (Shopify **TikTok** app) |

Before TikTok can work:

1. Install the **TikTok** sales channel on Shopify. This connects the pixel and sends purchases.
2. Copy the pixel ID into Vercel as `VITE_TIKTOK_PIXEL_ID`.
3. Generate an Events API token and put it in Vercel as `TIKTOK_ACCESS_TOKEN`. The steps are in `docs/tracking-setup.md`.
4. Redeploy.

## Meta setup (Ads Manager)

**Campaign 1 — CEO Turbo | Artist Merch | Sales**

- Objective **Sales**, using the website conversion event **Purchase**. Start on **AddToCart** if you have fewer than about 50 purchases a week, then switch once purchases flow.
- **Advantage+ sales campaign** (or manual sales). Budget **$15/day**. Placements: Advantage+, with Reels and Stories getting the most delivery.
- Audience hints for manual targeting: USA, ages 18–40.
  - Interests: SoundCloud, DistroKid, Spotify for Artists, BandLab, Hip hop music, Rapping, Music producer, Independent artist, Record label.
  - Behaviors: Small business owners (catches people with music LLCs).
- Ads: `artist-merch-guy`, `artist-zero-merch`, `artist-tour-back`.
  - Primary text: "No minimum. Your cover art on a shirt in 2 minutes. From $24.99, free shipping, 20% off 50+. Sell at $30 and keep the rest."
  - Headline: "Make your merch today."
  - CTA button: **Shop now**.
  - URL: `https://www.ceoturbo.com/artist-merch?utm_source=facebook&utm_medium=paid_social&utm_campaign=artist_merch&utm_content={{ad.name}}`

**Campaign 2 — CEO Turbo | Company Shirts | Sales**

- Same setup, with these differences.
- Audience: USA, ages 25–60.
  - Behaviors: Small business owners.
  - Interests: Entrepreneurship, Construction, Landscaping, Restaurant management, Hair salon, Cleaning service.
  - Optional: a radius around Atlanta first.
- Ads: `biz-group-project`, `biz-minimum-24`, `biz-new-hire`.
  - Primary text: "Your logo on your crew — no minimum. Upload your logo, see it live, order 1 shirt or 50. From $27.99, free US shipping, 15% off 24+."
  - Headline: "Company shirts, no minimum."
  - URL: `https://www.ceoturbo.com/custom-company-t-shirts?utm_source=facebook&utm_medium=paid_social&utm_campaign=company_shirts&utm_content={{ad.name}}`

**Campaign 3 — CEO Turbo | Shirts | Retargeting**

- Budget **$5/day**.
- Custom audiences: website visitors to `/artist-merch` or `/custom-company-t-shirts` in the last 14 days, **plus** people who fired CustomizeProduct or InitiateCheckout in the last 14 days. Exclude Purchase (last 30 days).
- Ad: the matching photo carousel from `public/img/merch/*` or `public/img/shirts/*`.
  - Text: "Your design is saved — finish your order. Free shipping, no minimum."

## TikTok setup (TikTok Ads Manager)

- **Campaign:** Product sales → Website. Optimization event **Complete Payment**, starting on **Add to Cart** until data builds up. Budget **$20/day per ad group**. TikTok needs about $20/day to learn.
- **Ad group Artists:**
  - USA, ages 18–34.
  - Interests and behaviors: Music, Hip hop, Music production, Independent musicians.
  - Creators: follows hip-hop, R&B and indie music creators.
  - Hashtag interactions: #newmusic #indieartist #producer #rapper #merch.
- **Ad group Business:**
  - USA, ages 25–54.
  - Interests: Small business, Entrepreneurship, Home improvement, Construction, Beauty services, Restaurants.
- **Ads:** upload the matching MP4s. Turn on **Smart+ creative** and **auto captions**, and pick a trending sound in the editor.
  - Display name: CEO Turbo.
  - Text (artists): "POV: your merch is finally real 👕 no minimum."
  - Text (business): "Your crew in matching logo shirts, no minimum."
  - CTA: **Shop now**.
- **URLs:** same pages, with `utm_source=tiktok&utm_medium=paid_social&utm_campaign=artist_merch|company_shirts&utm_content=__CID_NAME__`. TikTok also appends `ttclid`, which the site already passes to Shopify checkout.
- **Spark ads (do this):** post the videos on the CEO Turbo TikTok and Instagram accounts too, then boost the posts as Spark Ads / Partnership ads. They pick up likes and comments, which keeps CPM lower.

## Kill / scale rules (check every 3 days, never sooner)

| Signal | Action |
| --- | --- |
| Ad spent 3× its target cost per sale with **0 purchases** | Turn that **ad** off, not the campaign |
| Hook rate (3-second views ÷ impressions) under 25% on TikTok, or thumb-stop under 20% on Meta | The first 2 seconds aren't working. Change the hook line in `build.mjs` and re-render |
| CTR under 0.8% | Change the offer line or the first scene |
| Cost per purchase under **$15** (company) / **$12** (artist) | Raise the budget 20% every 3 days |
| Average order of 6+ shirts | You can afford up to about $40 a sale — scale harder |

**Break-even:** one shirt makes about $10–12 before ads (`docs/company-shirts.md`). A 1-shirt order can only afford about $10 in ads; a 12-shirt order can afford about $100. That's why the copy pushes "12+ / 24+ / 50+". Watch the **average order size** in Shopify Analytics.

## Organic (free) — post the same videos

Post one video a day on TikTok, Reels and YouTube Shorts from the CEO Turbo accounts. Rotate the 6, then remake the winners with new hooks. In the comments, pin: "Design yours → ceoturbo.com/artist-merch".
