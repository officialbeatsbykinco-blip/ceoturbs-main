# CEO Turbo ads (HyperFrames)

Three 9:16 (1080x1920) ads built with HyperFrames. Edit the HTML, run `./stage.sh <name> <audio>`, then `npx hyperframes render` inside `.build/<name>`.

| File | Length | Angle | CTA |
| --- | --- | --- | --- |
| `ad1-review-card.html` | 24s | Google review NFC card: "one tap" | ceoturbo.com/google-review-cards |
| `ad2-lead-gen.html` | 24s | Real Meta lead results ($4.89/lead, 147 leads) | ceoturbo.com/free-audit |
| `ad3-artist-growth.html` | 16s | Artist profile visits $0.32 vs $0.85 peer median | ceoturbo.com/artist |

All numbers come from `src/content/results.ts` (real Meta dashboards, Jul-Aug 2026). Ad 1's review counter is labeled "Illustrative example".
Music beds are generated (120 BPM) so cuts land on beats; renders are in `renders/`.

## Conversion cuts (v2) - 1080x1920 and 1080x1350

| File | Goal | CTA |
| --- | --- | --- |
| `ad4-cards-sellout.html` | Sell Google review cards (competitor face-off, one-tap demo, 3 packs, 5-day guarantee) | ceoturbo.com/google-review-cards |
| `ad5-book-calls.html` | Book the free 30-min Brand Boost call (real lead results, what happens on the call) | ceoturbo.com/brand-boost |

Build a ratio: `./stage.sh ad4-cards-sellout ad4` (9:16) or `./stage.sh ad4-cards-sellout ad4 4x5`, then `npx hyperframes render --quality high --output ../../renders/<name>.mp4` inside `.build/<name>`.

## Meme ad: "Greg" (24s, 9:16 + 4:5)

`ad6-greg-meme.html` - POV skit with a deadpan narrator (local Kokoro voice `bm_george`), emoji cast, generated SFX. Customer loves the work, leaves without reviewing, grumpy Greg leaves a 1-star about parking, the card fixes it. Covers barbers, nail techs, plumbers and restaurants. CTA: ceoturbo.com/google-review-cards.
Voice lines: `assets/audio/vo1-5.wav`; SFX/bed: `assets/audio/ad6.wav`.

## Meme ad: "The Line" (27s, 9:16 + 4:5)

`ad7-the-line.html` - hand-inked two-window queue meme (procedural crowd of ~170 figures with a pen wobble filter, seeded so renders are identical). "YOU: 12 reviews" vs "THAT GUY: 400 reviews", the lone customer abandons you, the card slams in, the whole line stampedes over, and the other guy asks where you got the card. CTA: ceoturbo.com/google-review-cards. Narrator lines: `assets/audio/ln1-8.wav`; SFX/bed: `assets/audio/ad7.wav`.
Gotcha: do not pass `svgOrigin` inside a tween on an element that already has one set - it re-anchors scale to the canvas corner.
