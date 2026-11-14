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

## Landscape ad: "One Tap" (30s, 16:9)

`ad9-one-tap-16x9.html` - 1920x1080 for YouTube, in-stream and the site. No narration; captions carry it, so it works muted. Hook ("They loved it... and left no review."), 3D card reveal, one-tap triptych (barber, coffee shop, plumber), review counter 12 → 287 with the list reshuffling (labeled "Illustrative example"), "No app / No typing links / No monthly fee" stamps, end card with the stand, $16.99 and ceoturbo.com/google-review-cards.
Bed + SFX: `node assets/audio/make-bed-ad9.mjs` → `ad9bed.wav`, then `ffmpeg -i ad9bed.wav -af "loudnorm=I=-14:TP=-1.5:LRA=9,volume=0.6dB,alimiter=limit=0.84" ad9.wav`.
Build: `./stage.sh ad9-one-tap-16x9 ad9`, then `npx hyperframes render --quality high --output ../../renders/ad9-one-tap-16x9.mp4` inside `.build/ad9-one-tap-16x9`. Thumbnail: `renders/ad9-one-tap-16x9-thumb.jpg` (frame at 17.5s).

## Landscape ad: "Tampa Tech Help" (20s, 16:9)

`ad19-tampa-tech-16x9.html` - 1920x1080 for YouTube, Meta landscape placements and the site. No narration; captions carry it, so it works muted. Hook ("Computer acting up?" with a laptop drowning in error pop-ups until the screen dies), six problem tiles flip from BROKEN to FIXED, "We come to you" map (pin at Temple Terrace, van drives to a home and a business, "Or remote for Windows, anywhere"), promise stamps ("We fix it. Test it with you. Then you pay." + "No fix, no charge", footnoted as applying to the repair), end card with logo, "Book a visit" and ceoturbo.com/computer-repair-tampa. No phone number on screen.
Bed + SFX: `node assets/audio/make-bed-ad19.mjs` → `ad19bed.wav`, then `ffmpeg -i ad19bed.wav -af "loudnorm=I=-14:TP=-1.5:LRA=9,volume=0.6dB,alimiter=limit=0.84" ad19.wav`.
Build: `./stage.sh ad19-tampa-tech-16x9 ad19`, then `npx hyperframes render --quality high --output ../../renders/ad19-tampa-tech-16x9.mp4` inside `.build/ad19-tampa-tech-16x9`. Thumbnail: `renders/ad19-tampa-tech-16x9-thumb.jpg` (frame at 18.5s).
Web copy for the site: `public/media/tampa-tech-help.mp4` (1280x720, 1.3 MB) with poster `public/media/tampa-tech-help-poster.webp`.

## Landscape ad: "Websites + Ads" (20s, 16:9)

`ad20-websites-ads-16x9.html` - 1920x1080 for YouTube, Meta landscape placements and the site. No narration; works muted. Hook ("Nice website. Zero calls." with an empty skeleton site and a phone showing 0 new calls), "We build the site" (a site assembles: nav, hero, Book now button, reviews, fast-on-phones badge), "Then we run the ads" (Google, Facebook, Instagram, Microsoft, TikTok and Reddit send traffic into the site, leads pop up), "Real results" (161 leads and $4.31 lowest cost per lead, straight from `src/content/results.ts`, footnoted with the source and "Results vary by business"), end card with Turbo Launch $1,997 one-time setup (from `src/content/pricing.ts`), "Book a free call" and ceoturbo.com/pricing. If prices or results change, update the numbers in the HTML and re-render.
Bed + SFX: `node assets/audio/make-bed-ad20.mjs` → `ad20bed.wav`, then the same loudnorm line as ad19 → `ad20.wav`.
Build: `./stage.sh ad20-websites-ads-16x9 ad20`, then `npx hyperframes render --quality high --output ../../renders/ad20-websites-ads-16x9.mp4` inside `.build/ad20-websites-ads-16x9`. Thumbnail: `renders/ad20-websites-ads-16x9-thumb.jpg` (frame at 18.6s).
Web copy for the site: `public/media/websites-and-ads.mp4` (1280x720, 1.4 MB) with poster `public/media/websites-and-ads-poster.webp`.

## Vertical ad: "Websites + Ads" (20s, 9:16)

`ad21-websites-ads-9x16.html` - 1080x1920 cut of ad20 for Reels, Stories, TikTok and Shorts. Same scenes, copy, numbers and timing as ad20, so it reuses the ad20 sound bed. Everything important sits above the bottom caption area and left of the right-side buttons.
Build: `./stage.sh ad21-websites-ads-9x16 ad20`, then `npx hyperframes render --quality high --output ../../renders/ad21-websites-ads-9x16.mp4` inside `.build/ad21-websites-ads-9x16`. Thumbnail: `renders/ad21-websites-ads-9x16-thumb.jpg` (frame at 1.6s, the "Zero calls" hook).

## Landscape ad: "Get Found" (24s, 16:9)

`ad22-get-found-16x9.html` - 1920x1080 for YouTube. No narration; works muted. Hook: someone types "plumber near me", three competitors show up and "Your business: Not found" ("They searched. You weren't there."). An AI assistant answers "Who's a good plumber near me?" with the same three names, stamped "Not on the list". "We fix what Google & AI read": six fixes (Google Business Profile, Google + Bing indexing, booking calendar, SEO, llms.txt, tracking) dock onto a Business Profile card. "Now they find you": your listing slides into the results, Call is tapped, incoming call. End card: Turbo Start $497 one-time, keep the site you have (from `src/content/pricing.ts`), "Book a free call", ceoturbo.com/pricing. Competitor names are made up, the AI assistant is generic, and the search scenes are footnoted "Illustrative example. Rankings depend on Google and aren't guaranteed."
Bed + SFX: `node assets/audio/make-bed-ad22.mjs` → `ad22bed.wav`, then the same loudnorm line as ad19 → `ad22.wav`.
Build: `./stage.sh ad22-get-found-16x9 ad22`, then `npx hyperframes render --quality high --output ../../renders/ad22-get-found-16x9.mp4` inside `.build/ad22-get-found-16x9`. Thumbnail: `renders/ad22-get-found-16x9-thumb.jpg` (frame at 3.2s, "You weren't there").
