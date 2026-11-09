# Meta ads: tech repair, Tampa

Build this in Meta Ads Manager in the browser (no CSV upload). One campaign, one ad set, 3–4 ads.

- Landing page: `https://www.ceoturbo.com/computer-repair-tampa`
- Main event: **Lead** (fires when someone finishes the tap-tap-text quiz)
- Secondary events (watch, don't optimize for them yet): **Schedule** (booked a time), **Contact** (tapped call or text)
- Phone on ads and page: (678) 558-4327. Swap in a Tampa (813) number here and on the page if you get one.

## Prices to use in ads (keep these exact)

| Service | Price |
|---|---|
| Speed-up (in person) | from $149 |
| Remote Windows speed-up | from $99 |
| Virus removal | $149 |
| PC repair | from $149 |
| SSD upgrade | from $199 |
| iPhone screen | from $149 |
| Diagnosis | $79, credited to the repair |

Older customers with money like a starting price or a flat price, and like to call or text. Put the price and "call or text" in every ad.

## 1. Campaign setup

**Campaign**
- Name: `CEO Turbo | Tech Repair Tampa | Leads`
- Buying type: Auction
- Objective: **Leads**
- Special ad category: none
- Advantage+ campaign budget: off to start (one ad set, so it doesn't matter yet)
- A/B test: off

**Ad set**
- Name: `Tampa 40mi | 35+ | Website Lead`
- Conversion location: **Website**
- Pixel / dataset: the CEO Turbo dataset
- Conversion event: **Lead**
- Performance goal: Maximize number of conversions
- Cost per result goal: leave empty for the first 2 weeks
- Budget: $25/day (see section 2)
- Schedule: start today, no end date
- Attribution: 7-day click, 1-day view (default)

**Audience**
- Location: Tampa, FL, **+40 mi** radius. "People living in or recently in this location."
- Age: **35–65+**
- Gender: all
- Language: English (add Spanish only if you'll take Spanish calls)
- Detailed targeting: none. Let the Lead event and creative do the targeting.

**Leaning older.** With Advantage+ audience on, Meta treats age as a suggestion and can still show ads to younger people. To make 35 a hard floor, click "Switch to original audience options" and set 35–65+. If you keep Advantage+ audience on, set the suggestion to 45–65+ and check the age breakdown after a week (Breakdown → By delivery → Age). If 25–34 gets spend but no leads, switch to original options with 35+.

**Placements**
- Advantage+ placements on. Then remove Audience Network and Messenger inbox ads (low-quality clicks).
- Keep Facebook Feed, Instagram Feed, Facebook and Instagram Reels, Stories, Marketplace.
- Facebook Feed and Marketplace skew older; that's where most of your leads should come from.

**Ad level**
- Identity: CEO Turbo Facebook page + Instagram account
- Format: single video (or single image while you shoot video)
- Destination: Website, URL `https://www.ceoturbo.com/computer-repair-tampa`
- URL parameters: `utm_source=facebook&utm_medium=paid&utm_campaign=tech_repair_tampa&utm_content={{ad.name}}`
- Tracking: website events on, dataset selected
- Turn off: "Advantage+ creative" enhancements that add music or change text (keep the text you wrote). Image touch-ups are fine.
- Add a phone call button? No. Keep the CTA on the page so the Lead event fires. The page has call and text buttons for people who want them.

## 2. Budget and learning phase

- **Start at $25/day** (anywhere from $20 to $30 is fine). One ad set, 3–4 ads.
- Learning phase needs about 50 Lead events in 7 days to exit. At $25/day you won't get there quickly; that's fine. Judge by cost per lead and real calls, not by the "Learning limited" label.

**Plan**
- **Days 1–3:** Don't touch anything. No edits to budget, audience or ads (each edit restarts learning).
- **Days 4–7:** Turn off any ad that has spent $40+ with zero leads and a link CTR under 0.8%. Leave the rest.
- **Day 7 review:** If cost per lead is under $25 and you got at least one real job, raise budget 20% (to $30/day).
- **Every 3–4 days after that:** raise 20% at a time while cost per lead holds. Never jump more than 20–30% in one go.
- **Week 3:** Add one new ad (a new hook on the winning concept). Keep the winners running.
- **If the ad set stays above $40 per lead for 10 days:** fix the page or the offer before spending more. Check the quiz on a phone, page speed, and that the Lead event fires (Events Manager → Test events).

Rough targets for Tampa repair leads: $10–25 per Lead, $30–60 per Schedule. A $149–$199 job plus add-ons pays back one lead in that range.

## 3. Creative concepts

Each concept: hook (first 2 seconds of video or the top line on the image), primary text, headline, CTA button. Pick one hook per ad; save the others for new versions later.

### Concept A: "My computer is so slow"

**Hooks**
- "If your computer takes 5 minutes to start, watch this."
- "Your computer isn't too old. It's just clogged."
- "Before you buy a new computer, call me first."

**Primary text**
> Slow computer? Don't buy a new one yet.
>
> I come to your home or office anywhere around Tampa and speed it up in person. Most computers run like new in one visit.
>
> Speed-up from $149. SSD upgrade from $199. You get the price before I start.
>
> Tap below, answer 3 quick questions, and I'll text you back. Or call or text (678) 558-4327.

**Headline:** Slow Computer? Speed-Up From $149
**Description (if shown):** In-person, around Tampa. Price before I start.
**CTA button:** Get Quote

### Concept B: "Won't turn on"

**Hooks**
- "Computer won't turn on? Don't panic yet."
- "Black screen? Your files are probably still there."
- "Most 'dead' computers aren't dead."

**Primary text**
> Computer won't turn on, keeps crashing, or stuck on a black screen?
>
> I'll find out what's wrong. Diagnosis is $79, and it comes off the repair if you go ahead. PC repair from $149.
>
> I come to you around Tampa (40 miles), or you can drop it off. No surprise bills: you know the price before I touch it.
>
> Tap below to tell me what's happening. Takes 20 seconds. Or call or text (678) 558-4327.

**Headline:** Won't Turn On? $79 Diagnosis
**Description:** Credited to the repair. Tampa area.
**CTA button:** Get Quote

### Concept C: Remote speed-up (Windows)

**Hooks**
- "I can speed up your Windows computer without leaving my desk."
- "No appointment, no driving. Your computer, faster today."
- "Slow Windows laptop? Fixed while you have coffee."

**Primary text**
> Slow Windows computer? I can fix it remotely, today.
>
> You call me, I connect to your computer while you watch, clean it up and speed it up. You see everything I do, and you can stop it any time.
>
> Remote speed-up from $99. Virus removal $149.
>
> Tap below and pick a time, or call or text (678) 558-4327 and I'll walk you through it.

**Headline:** Remote Windows Speed-Up From $99
**Description:** You watch the whole time. Same-day spots.
**CTA button:** Book Now

Note: keep this ad honest about how remote works. You call or text first, the customer starts the session, and they can see everything. Never say "we detected a problem" or anything that sounds like a pop-up warning. Meta flags tech support ads that look like scare tactics.

### Concept D: "Make my old computer feel new"

**Hooks**
- "This laptop is 7 years old. Watch how fast it opens now."
- "Same computer. New speed. $199."
- "Don't spend $1,000 on a new laptop."

**Primary text**
> Your old computer can feel brand new again.
>
> A new SSD drive is the single biggest speed boost for an older computer. Programs open in seconds, startup goes from minutes to under 30 seconds, and all your files and pictures stay right where they are.
>
> SSD upgrade from $199. I come to you anywhere around Tampa.
>
> Tap below for a quick quote, or call or text (678) 558-4327.

**Headline:** Old Computer Feel New From $199
**Description:** SSD upgrade, files kept. Tampa area.
**CTA button:** Get Quote

### Optional Concept E (add in week 3): phones and tablets

**Hook:** "Cracked iPhone screen? Fixed while you wait."
**Primary text:**
> Cracked or black iPhone screen? iPhone screen repair from $149. I come to you around Tampa, or meet nearby. Tap below for a price on your model, or call or text (678) 558-4327.

**Headline:** iPhone Screen From $149
**CTA button:** Get Quote

## 4. Shooting each concept on a phone

General rules for all of them:
- Vertical 9:16, 15–30 seconds. Also export a 4:5 crop for Feed.
- Hook in the first 2 seconds, said out loud **and** written on screen (most people watch muted).
- You on camera, in a CEO Turbo shirt, talking straight to the phone like a FaceTime. Older viewers trust a real face and a calm voice over fast cuts.
- Big captions (CapCut auto captions, large font, high contrast). End card: price + "Call or text (678) 558-4327".
- Good light: face a window. Use the phone's back camera if someone can hold it.
- Never show a customer's screen with their personal info, email or files.

**A: Slow computer**
- Shot 1 (0–3s): close-up of a spinning loading wheel on a slow laptop; your voice says the hook.
- Shot 2: you at a kitchen table with the laptop, "Most slow computers just need a clean-up. Here's what I do."
- Shot 3: quick cuts of you working (hands on keyboard, Task Manager showing 100% disk).
- Shot 4: split screen or before/after timer: "Before: 4 minutes to start. After: 25 seconds."
- End: you to camera, "Speed-up from $149. Tap below or call or text me."

**B: Won't turn on**
- Shot 1: finger pressing the power button, nothing happens. Text: "Won't turn on?"
- Shot 2: you calm, to camera: "Most of the time your files are still there."
- Shot 3: you opening the case or checking the charger and battery.
- Shot 4: screen lights up. Customer's relieved reaction if they agree to be filmed (get a quick OK on camera or in text).
- End: "$79 diagnosis, comes off the repair."

**C: Remote speed-up**
- Shot 1: you at your desk with headset, laptop open: "I'm fixing a computer in Brandon right now, and I'm in Tampa."
- Shot 2: screen recording of a test machine (your own computer, not a customer's) being cleaned up: startup apps turned off, disk usage dropping.
- Shot 3: you: "They watch everything I do, and they can stop it any time."
- End: "Remote Windows speed-up from $99. Book a time below."

**D: Old computer feels new**
- Shot 1: an old laptop next to a stopwatch on the phone. Press power, start timer. Text: "7 years old."
- Shot 2: you swapping in the SSD (close-up of hands, screwdriver, the new drive). Satisfying, no talking needed.
- Shot 3: same laptop, same stopwatch, boots in under 30 seconds.
- Shot 4: you holding up the old drive: "This was the problem. $199 and it feels new."
- Keep the real times. Don't fake the timer.

**Images while you shoot:** a clean photo of you holding a laptop, with big text "Slow computer? Speed-up from $149" and "Call or text (678) 558-4327" along the bottom. Run 1 image ad per concept until the videos are ready.

## 5. Events to watch

Set columns in Ads Manager: Results (Lead), Cost per result, Amount spent, Link clicks, CTR (link), CPC (link), Frequency, plus custom columns for **Schedule** and **Contact** (Columns → Customize → Website → Schedule, Contact).

| Event | What it means | What to do with it |
|---|---|---|
| Lead | Finished the quiz | The number you optimize and judge on |
| Schedule | Booked a time | Best sign of a real customer; use to pick winners when leads are close |
| Contact | Tapped call or text | Count it with leads for older audiences; many skip the quiz and just call |
| Link CTR | Is the hook working | Below 0.8% after 1,000 impressions = weak hook |
| Landing page views ÷ link clicks | Is the page loading | Below 70% = page is slow or broken on phones |

Also keep a simple sheet of real outcomes: lead → replied → booked → job done → $ paid. Meta counts quiz finishes, not money. Judge ads by jobs.

## 6. Kill and scale rules

**Kill an ad when (any one):**
- Spent **2× your target cost per lead (about $50)** with zero leads.
- Link CTR under 0.8% after 1,500 impressions.
- Cost per lead over $40 after 5 leads, and none of them booked.
- Frequency over 3.5 and cost per lead rising for 3 days in a row (people are tired of it): replace with a new hook.

**Keep and wait when:**
- Under $50 spent. Too early to know.
- Leads coming in but the cost is $25–40. Give it 7 days.

**Scale when:**
- Cost per lead under $25 for 7 days **and** at least 2 booked jobs from the ad set.
- Raise ad set budget 20% every 3–4 days. Stop raising when cost per lead climbs 30% above where it was.
- Winning ad: make 2 new versions with different hooks from the list above. Same body text, same offer.
- After $50/day is steady, duplicate the ad set with a 45+ age floor and compare for 2 weeks.

**Don't:**
- Edit a running ad's text or video (it resets learning and loses social proof). Duplicate it instead.
- Run more than 4–5 ads in one ad set at this budget.
- Turn the campaign off and on day to day.
