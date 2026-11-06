# Long-form videos (16:9, narrated)

Animated YouTube explainers built on the titles in `ads/viral-video-titles.md`. Narration is the local Kokoro voice `af_heart` (warm, unhurried), one file per sentence so the animation and word-by-word captions land on the words. The bed is a synthesized lo-fi electric piano (no samples, no licensing), ducked under the voice and mastered to -14 LUFS.

| Script | Title | CTA |
| --- | --- | --- |
| `stop-asking.mjs` | I Stopped Asking for Google Reviews. I Started Handing Them This. | ceoturbo.com/google-review-cards, then a free Brand Boost call |

## Make one

```bash
node vo.mjs stop-asking      # voices every line (cached in vo/stop-asking)
node build.mjs stop-asking   # writes .build/stop-asking + renders/stop-asking-youtube.txt (description with chapters)
cd .build/stop-asking && npx hyperframes render --quality delivery --output ../../renders/stop-asking.mp4
```

- A script is data: scenes, narration lines (`say` overrides pronunciation, e.g. prices and "C.E.O."), and a `draw(c)` that returns the scene's HTML and schedules its animation from the real line times.
- Prices, packs, shipping and returns match `src/config/site.ts`; ad numbers match `src/content/results.ts`. The map-pack listings are labeled "Illustrative example".
- Renders and voice files are gitignored. The YouTube description (links + chapters) is written to `renders/<slug>-youtube.txt`.
