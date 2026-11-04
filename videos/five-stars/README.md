# FIVE STARS

Original animated dark-comedy series. In Brightwater, everyone's public rating floats above their head.
Below 3.0 the van comes; at 5.0 something worse happens. Episodes run ~8 minutes and end on a hook into the next.

| Episode | Length | Logline |
| --- | --- | --- |
| `ep1.mjs` "Three Point Two" | 7:45 | Diner worker Dale (3.2, rated lower than a dog) drops a pie on the town's highest-rated woman and tries to climb to five stars. He gets there. |

Easter egg: the "Review Us On Google" tap card stands on the diner counter in every diner shot. It's never mentioned.

## Make an episode

```bash
node vo.mjs ep1                 # voices every line with local Kokoro TTS (cached in vo/ep1)
node build.mjs ep1              # writes .build/ep1 (HTML + mixed audio); --no-audio for a quick layout pass
cd .build/ep1 && npx hyperframes render --quality standard --output ../../renders/five-stars-ep1.mp4
```

- `ep1.mjs` is the whole episode as data: shots, cast positions, moods, ratings, lines, effects.
- `cast.mjs` holds the characters (flat SVG people with swappable moods), `sets.mjs` the locations, and `music.mjs` the synthesized score and SFX (no samples, no licensing).
- `build.mjs` times every shot from the real voice-line lengths, then writes captions, mouth flaps, blinks, rating counters and camera moves, and mixes the voice over the ducked score at -14 LUFS.
- Renders and voice files are gitignored (an 8-minute 1080p MP4 is too big for git). Rebuild them with the commands above.
