# Long-form videos (16:9, narrated)

Animated YouTube explainers built on the titles in `ads/viral-video-titles.md`. Narration is the local Kokoro voice `af_heart` (warm, unhurried), one file per sentence so the animation and word-by-word captions land on the words. The bed is a synthesized lo-fi electric piano (no samples, no licensing), ducked under the voice and mastered to -14 LUFS.

| Script | Title | CTA |
| --- | --- | --- |
| `stop-asking.mjs` | I Stopped Asking for Google Reviews. I Started Handing Them This. (16:9, 4:25) | ceoturbo.com/google-review-cards, then a free Brand Boost call |
| `stop-asking-short.mjs` | Same story as a 9:16 cut for Reels, TikTok and Shorts (1:08) | ceoturbo.com/google-review-cards (link in bio) |
| `website-story.mjs` | He Had $43 in the Bank. Then He Got a Website. (16:9, 8:02, 18 chapters) — why your business needs a website, told through Marcus, a made-up mobile detailer | ceoturbo.com/brand-boost, then ceoturbo.com/pricing (Turbo Launch $1,997) |
| `restaurant-reviews.mjs` | Her Food Was Better. So Why Was Their Restaurant Packed? (16:9, 9:19, 21 chapters) — Google review cards for restaurants, told through Nina, a made-up restaurant owner | ceoturbo.com/google-review-cards, then ceoturbo.com/restaurants (free call) |
| `restaurant-reviews-short.mjs` | Same story as a 9:16 cut for Reels, TikTok and Shorts (1:38) | ceoturbo.com/google-review-cards (link in bio) |
| `website-story-short.mjs` | Same story as a 9:16 cut for Reels, TikTok and Shorts (1:09) | ceoturbo.com/brand-boost (link in bio) |
| `why-reviews.mjs` | Why the Worse Business Gets All the Customers (16:9, ~10 min, 23 chapters): why reviews decide where people spend money, told in an animal town with sourced stats | ceoturbo.com/google-review-cards |
| `why-reviews-short.mjs` | Same story as a 9:16 cut for Reels, TikTok and Shorts (~1:30) | ceoturbo.com/google-review-cards (link in bio) |

## Make one

```bash
node vo.mjs stop-asking      # voices every line (cached in vo/stop-asking)
node build.mjs stop-asking   # writes .build/stop-asking + renders/stop-asking-youtube.txt (description with chapters)
cd .build/stop-asking && npx hyperframes render --quality delivery --output ../../renders/stop-asking.mp4
```

- A script is data: scenes, narration lines (`say` overrides pronunciation, e.g. prices and "C.E.O."), and a `draw(c)` that returns the scene's HTML and schedules its animation from the real line times.
- Prices, packs, shipping and returns match `src/config/site.ts`; ad numbers match `src/content/results.ts`. The map-pack listings are labeled "Illustrative example".
- A script that exports `SIZE = [1080, 1920]` builds vertical; keep content inside y 200–1500 so the app UI never covers it. Social caption: `renders/stop-asking-9x16-caption.txt`.
- Renders and voice files are gitignored. The YouTube description (links + chapters) is written to `renders/<slug>-youtube.txt`.

## website-story notes

- Marcus is fictional and the video says so in the first 30 seconds and in the description. Every step he takes is a real CEO Turbo service. Real numbers only: $4.31 lowest cost per lead (`src/content/results.ts`), Turbo Launch $1,997 with 2 review cards and the free 30-minute Brand Boost call (`src/content/pricing.ts`). His bank balance, bookings, review count and dashboard are labeled illustrative on screen.
- `website-story-short.mjs` reuses the long script's art (exported helpers) and its own voice lines; social caption: `renders/website-story-9x16-caption.txt`. Render long cuts with `HF_CAPTURE_PARALLEL_STREAM=true` so frames stream to the encoder instead of filling ~30 GB of disk.
- A script can export `DESCRIPTION(chapters)` to write its own YouTube description; `build.mjs` falls back to the review-card text otherwise. The CEO Turbo logo is copied to `assets/img/logo.png` for every build.

## restaurant-reviews notes

- Nina, Casa Nina and The Copper Fork are fictional; the video says so in the first 30 seconds and in the description. Her review counts, guests per night and map positions are labeled illustrative, and the climb scene says Google decides rankings.
- Real facts only: card packs, counter stand, free US shipping, $5 programming and 30-day returns (`src/config/site.ts`), iPhone XS+ / NFC Android (`src/content/review-cards.ts`), Google's no-freebies rule (`src/content/restaurants.ts`), the Exclusive Restaurant & Lounge install photo (`public/media/restaurant-install-poster.webp`).
- A script can export `IMAGES = [[path under public/, name]]`; `build.mjs` copies them to `assets/img/`. Titles to A/B test, thumbnail brief, tags and pinned comment: `renders/restaurant-reviews-titles.txt`.
- `restaurant-reviews-short.mjs` reuses the long script's art (its helpers are now exported) with its own voice lines and vertical layouts; Nina is labeled fictional on screen from the first second. Social caption: `renders/restaurant-reviews-9x16-caption.txt`.

## why-reviews notes

- Pip (a hedgehog baker), Rocco (a raccoon), Hazel (a rabbit) and the town are fictional; the video says so in the first minute and in the description. Pip's review counts, the map and the 3-month result are labeled illustrative.
- The cast lives in `animals.mjs`: original chibi animals (hedgehog, raccoon, rabbit, fox, bear, owl, turtle, beaver, cat, mouse, dog, squirrel) with the same mood/talk system as `../five-stars/cast.mjs`. `critter(kind, mood, width, id, { hat, apron, scarf, cap, glasses, phone, bag })`. Use 6-digit hex colors.
- 3D: `stage()` + `L(z, html)` layers + `cam()` give the street real depth and parallax; `town()` is an isometric map with 3D blocks whose pins and trees face the camera (`spin()` turns the map and counter-turns them); `bars3d()` draws 3D bars.
- Character voices: a line can carry `v: [voice, speed]` (Pip `am_puck`, Rocco `bm_george`, Hazel `af_sky`); the narrator stays `af_heart`.
- Every stat shows its source on screen and is listed in the description (`SOURCES` in the script): BrightLocal Local Consumer Review Survey 2026 (97% read, 41% always, 47% <20 reviews, 9% ≤5, 74% last 3 months, 45% use AI, 89% expect replies), BrightLocal 2017 (68% left a review when asked), Spiegel Research Center (5 reviews = +270%, 4.0–4.7★ peak), Luca/HBS (+1 star = 5–9% revenue), Google's local-ranking help page, Google Maps content policy, the FTC fake-review rule (Aug 2024; the video says "more than $50,000 per violation" because the amount is inflation-adjusted each year). Check them again before re-cutting.
- If `npx hyperframes render` times out on `Page.captureScreenshot` (Chrome 149 headless shell hangs here), use `node render-local.mjs <slug> [--workers 4]`: it seeks the timeline in the cached Chrome 131 shell, restarts each browser every 24 frames, retries stalled frames and muxes the mixed audio. It is slow while the machine is busy; free CPU first (stuck Kokoro `synth-v3.py` processes are a common cause).
- Titles to A/B test, thumbnail brief, tags, pinned comment and end screen: `renders/why-reviews-titles.txt`. Social caption for the short: `renders/why-reviews-9x16-caption.txt`.
