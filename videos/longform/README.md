# Long-form videos (16:9, narrated)

Animated YouTube explainers built on the titles in `ads/viral-video-titles.md`. Narration is the local Kokoro voice `af_heart` (warm, unhurried), one file per sentence so the animation and word-by-word captions land on the words. The bed is a synthesized lo-fi electric piano (no samples, no licensing), ducked under the voice and mastered to -14 LUFS.

| Script | Title | CTA |
| --- | --- | --- |
| `stop-asking.mjs` | I Stopped Asking for Google Reviews. I Started Handing Them This. (16:9, 4:25) | ceoturbo.com/google-review-cards, then a free Brand Boost call |
| `stop-asking-short.mjs` | Same story as a 9:16 cut for Reels, TikTok and Shorts (1:08) | ceoturbo.com/google-review-cards (link in bio) |
| `website-story.mjs` | He Had $43 in the Bank. Then He Got a Website. (16:9, 8:02, 18 chapters) — why your business needs a website, told through Marcus, a made-up mobile detailer | ceoturbo.com/brand-boost, then ceoturbo.com/pricing (Turbo Launch $1,997) |

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
- A script can export `DESCRIPTION(chapters)` to write its own YouTube description; `build.mjs` falls back to the review-card text otherwise. The CEO Turbo logo is copied to `assets/img/logo.png` for every build.
