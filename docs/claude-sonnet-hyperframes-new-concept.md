# Claude Sonnet Prompt #3: New Hyperframes Ad Concept - "Last Minute Event"

**Goal:** Create a new hyperframes video ad concept with strong emphasis on natural human female voice that sounds authentic, conversational, and relatable. This ad should feel like a real person talking to their friend, not a scripted commercial.

**Credit Conservation:** Read entire prompt once, execute sequentially, ask only when absolutely necessary.

---

## CONTEXT

**Business:** CEO Turbo Custom Shirts
**Websites:** 
- Artist merch: ceoturbo.com/artist-merch
- Company shirts: ceoturbo.com/custom-company-t-shirts
**Current Ads:** 6 existing hyperframes ads (artist merch + company shirts)
**Format:** 9:16 vertical video, ~15 seconds, for TikTok, Reels, Stories
**Tech:** HyperFrames (HTML → MP4 via HeyGen)

**Existing Ad Angles:**
- Artist merch: "my merch guy said next week", "selling 0 merch", "fake tour"
- Company shirts: "group project crew", "minimum 24 shirts", "new hire in minions tee"

**New Concept Needed:** Fresh angle that's relatable, urgent, and plays to the fast turnaround value proposition.

---

## TASK 1: Define New Ad Concept

**Concept:** "Last Minute Event"

**Scenario:** Someone realizes they need custom shirts for an event TOMORROW and is panicking. CEO Turbo saves the day with fast turnaround.

**Why This Works:**
- Urgency creates immediate attention
- Relatable problem (everyone's been there)
- Clear solution (fast turnaround)
- Emotional relief (panic → solved)

**Target Audience:**
- Event planners
- Marketing managers
- Small business owners
- Party organizers
- Anyone who's ever forgotten something important

---

## TASK 2: Write Natural Human Female Voice Script

**CRITICAL VOICE REQUIREMENTS:**

The voice must sound like:
- A real human woman (25-35 years old)
- Talking to a friend, not reading a script
- Casual, conversational, authentic
- Slightly dramatic/emotional (panic → relief)
- Natural pauses, breaths, emphasis
- NOT robotic, NOT announcer-style, NOT overly polished
- Like a TikTok creator sharing a story

**Voice Characteristics:**
- Warm, friendly, relatable
- Uses natural language (um, like, literally, oh my god)
- Varying pace (fast when panicked, slower when relieved)
- Natural inflection (up at questions, down at statements)
- Authentic emotion (you can hear the panic, then the relief)
- Sounds like she's actually experienced this

**Script Structure (5 scenes, ~15 seconds total):**

**Scene 1 - Hook (2.2s):**
- Visual: Dramatic text on bright background
- Voice: High energy, slight panic
- Text: "event is TOMORROW"
- Subtext: "and i have ZERO shirts"

**Scene 2 - Problem (2.2s):**
- Visual: Caption with small text
- Voice: Real frustration
- Text: "sponsor asked:"
- Small: "where's the merch?"
- Voice tone: "Oh my god, I forgot"

**Scene 3 - Solution (2.0s):**
- Visual: Product photo with caption
- Voice: Relief, excitement
- Text: "uploaded logo."
- Text: "got it DONE."
- Voice tone: "Wait, it was actually easy"

**Scene 4 - Product (3.2s):**
- Visual: Shirt photo with details
- Voice: Confident, proud
- Text: "shirts arrived."
- Sticker: "overnight"
- Voice tone: "They look amazing"

**Scene 5 - CTA (3.0s):**
- Visual: End card with button
- Voice: Enthusiastic recommendation
- Text: "never panic again"
- Button: "Design yours"
- Voice tone: "Seriously, save yourself"

---

## TASK 3: Write Detailed Voice Direction

**For each scene, provide:**

**Scene 1 Voice Direction:**
- Pace: Fast, urgent
- Emotion: Panic, stress
- Tone: "Oh no oh no oh no"
- Emphasis: "TOMORROW", "ZERO"
- Breathing: Slightly breathless
- Natural filler: "Like, literally"

**Scene 2 Voice Direction:**
- Pace: Medium, storytelling
- Emotion: Embarrassment, realization
- Tone: "I messed up"
- Emphasis: "sponsor", "merch"
- Natural filler: "And I'm like..."

**Scene 3 Voice Direction:**
- Pace: Medium-fast, excited
- Emotion: Surprise, relief
- Tone: "Wait, this worked?"
- Emphasis: "uploaded", "DONE"
- Natural filler: "Actually"

**Scene 4 Voice Direction:**
- Pace: Slower, satisfied
- Emotion: Pride, relief
- Tone: "I nailed this"
- Emphasis: "arrived", "overnight"
- Natural filler: "And they're like"

**Scene 5 Voice Direction:**
- Pace: Medium, confident
- Emotion: Enthusiastic, genuine recommendation
- Tone: "I'm telling you, use this"
- Emphasis: "never", "panic"
- Natural filler: "Seriously"

---

## TASK 4: Create HyperFrames Ad Configuration

**File to modify:** `/ads/hyperframes/build.mjs`

**Add new ad to ADS array:**

```javascript
{
  id: "event-last-minute",
  title: "Event shirts — 'event is tomorrow'",
  scenes: [
    { kind: "hook", dur: 2.2, bg: "#ff3d6e", lines: ["event is", "*TOMORROW*"], sticker: "and i have ZERO shirts" },
    { kind: "caption", dur: 2.2, bg: "#0b1018", lines: ["sponsor asked:", "*“where's the merch?”*"], small: "me: *internal screaming*" },
    { kind: "image", dur: 2.0, bg: "#f1f2f5", fg: "#111", lines: ["uploaded logo.", "*got it DONE.*"], src: "shirt-front.jpg", sticker: "overnight" },
    { kind: "image", dur: 3.2, bg: "#f1f2f5", fg: "#111", lines: ["shirts arrived.", "*they look amazing.*"], src: "shirt-colors.jpg" },
    { kind: "cta", dur: 3.0, bg: "#ff7a1a", lines: ["never panic", "*again*"], button: "Design yours", url: TEE_URL, small: "From $27.99 · overnight available" },
  ],
},
```

**Action:** Add this new ad configuration to build.mjs.

---

## TASK 5: Generate Voice-Over Script for AI Voice Generation

**Create a separate script file for voice generation:**

**File to create:** `/ads/hyperframes/event-last-minute/voice-script.txt`

**Script content:**

```
[SCENE 1 - 2.2s]
(Panic, fast, breathless)
"Event is TOMORROW. And I have ZERO shirts."

[SCENE 2 - 2.2s]
(Embarrassed, storytelling)
"Sponsor asked: 'Where's the merch?' And I'm like... oh my god."

[SCENE 3 - 2.0s]
(Surprised, relieved, excited)
"Uploaded logo. Got it DONE. Actually, it was super easy."

[SCENE 4 - 3.2s]
(Proud, satisfied, slower)
"Shirts arrived overnight. And they look amazing. Like, seriously."

[SCENE 5 - 3.0s]
(Enthusiastic, genuine recommendation)
"Never panic again. Seriously, save yourself the stress. Design yours."
```

**Voice Notes:**
- Use a female voice (25-35 age range)
- Warm, friendly, conversational tone
- Natural pauses and breaths
- Varying emotion throughout
- Sound like a real TikTok creator
- NOT robotic or announcer-style
- Include natural fillers (like, literally, seriously)

**Action:** Create voice-script.txt file.

---

## TASK 6: Test Voice Generation

**Using HeyGen or similar AI voice tool:**

1. Select female voice (warm, conversational)
2. Upload voice-script.txt
3. Generate audio for each scene
4. Review for naturalness
5. Adjust if sounds robotic or scripted
6. Re-generate until authentic

**Success Criteria:**
- Sounds like a real person
- Natural emotion and pacing
- Believable as a TikTok creator
- No robotic cadence
- Authentic fillers and pauses

**Action:** Generate and test voice-over.

---

## TASK 7: Build HyperFrames HTML

**Run build script:**

```bash
node ads/hyperframes/build.mjs
```

This will generate:
- `/ads/hyperframes/event-last-minute/index.html`
- `/ads/hyperframes/event-last-minute/assets/` (with all assets)

**Action:** Run build script to generate HTML.

---

## TASK 8: Render Video

**Using HyperFrames/HeyGen:**

1. Open `/ads/hyperframes/event-last-minute/index.html` in HyperFrames
2. Upload generated voice-over audio
3. Sync audio to scenes
4. Preview timing
5. Adjust if needed
6. Render final MP4

**Output:** `/ads/hyperframes/out/event-last-minute.mp4`

**Action:** Render final video.

---

## TASK 9: Quality Check

**Review final video for:**

**Visual:**
- [ ] Text is readable on mobile
- [ ] Colors have good contrast
- [ ] Animations are smooth
- [ ] Timing feels right (not rushed, not slow)
- [ ] Safe zones respected (top 300px, bottom 400px empty)

**Audio:**
- [ ] Voice sounds natural and human
- [ ] Emotion matches each scene
- [ ] Pacing is appropriate
- [ ] Volume is consistent
- [ ] No robotic or AI artifacts

**Overall:**
- [ ] Hook grabs attention in first 2 seconds
- [ ] Problem is clear and relatable
- [ ] Solution is obvious
- [ ] CTA is clear and actionable
- [ ] Total length is ~15 seconds
- [ ] Feels like a TikTok creator, not a commercial

**Action:** Review and approve final video.

---

## TASK 10: Add to Ad Rotation

**Update ad tracking/docs:**

**File to update:** `/docs/ads/meta-tiktok-shirts.md` (or create if doesn't exist)

**Add entry:**
```markdown
### Event Last Minute
- **Concept:** Last-minute event panic → fast turnaround saves the day
- **Target:** Event planners, marketing managers, small business owners
- **Voice:** Female, 25-35, conversational, authentic
- **Placements:** TikTok, Reels, Stories
- **Angle:** Urgency + relief
- **CTA:** Design yours
```

**Action:** Update ad documentation.

---

## DELIVERABLES CHECKLIST

After completing all tasks, provide:

1. ✅ New ad concept defined ("Last Minute Event")
2. ✅ Natural human female voice script written
3. ✅ Detailed voice direction for each scene
4. ✅ HyperFrames ad configuration added to build.mjs
5. ✅ Voice-over script file created
6. ✅ Voice generated and tested for naturalness
7. ✅ HyperFrames HTML built
8. ✅ Video rendered with voice-over
9. ✅ Quality check completed
10. ✅ Ad added to rotation documentation
11. ✅ Final MP4 ready for deployment
12. ✅ Summary of new ad performance expectations

---

## EXECUTION ORDER

Execute tasks in this exact order:
1. Task 1 (Define concept)
2. Task 2 (Write voice script)
3. Task 3 (Write voice direction)
4. Task 4 (Add to build.mjs)
5. Task 5 (Create voice-script.txt)
6. Task 6 (Generate and test voice)
7. Task 7 (Build HTML)
8. Task 8 (Render video)
9. Task 9 (Quality check)
10. Task 10 (Update documentation)

---

## VOICE QUALITY CRITERIA (CRITICAL)

**The voice MUST:**

✅ Sound like a real human woman (not AI)
✅ Have natural breaths and pauses
✅ Use authentic conversational fillers (like, literally, seriously)
✅ Vary emotion appropriately (panic → relief → pride)
✅ Have varying pace (fast when urgent, slower when satisfied)
✅ Sound like she's talking to a friend, not reading
✅ Be believable as a TikTok creator
✅ Have warm, friendly tone
✅ NOT sound robotic or scripted
✅ NOT sound like an announcer or commercial voice
✅ NOT have perfect diction (slight natural imperfections are good)
✅ NOT be monotone or flat

**If the voice sounds AI or robotic, re-generate until authentic.**

---

## NOTES

- **Voice is everything:** This ad's success depends entirely on the voice sounding natural and human
- **Emotion arc:** Panic → embarrassment → surprise → relief → enthusiasm
- **Pacing:** Fast at start, slower in middle, confident at end
- **Natural language:** Use real conversational patterns, not perfect grammar
- **TikTok style:** This should feel like a creator sharing a story, not a brand selling
- **Urgency angle:** The "last minute" scenario creates immediate attention
- **Relief payoff:** The emotional relief when the problem is solved is satisfying
- **CTA timing:** End with genuine recommendation, not pushy sales

Begin implementation now.
