# Reddit ads for software developers: campaign build

**Goal:** booked growth calls and dev-intake leads from `https://www.ceoturbo.com/app-marketing`.
**Honesty rule:** Reddit devs fact-check everything. Every claim in an ad must be on the landing page too, and the landing page only says things that are true (see `src/content/app-marketing.ts`). No invented install counts, no "guaranteed".

Sources used: the `reddit-ads` skill (formats, targeting, budget, pre-launch checklist) and the `reddit-automation` skill (honest, disclosed, human-posted participation only). CPM/CPC ranges below are the skill's rough ranges, not quotes: check Reddit's own estimates in Ads Manager before you set bids.

---

## 1. Before you spend a dollar (pre-launch checklist)
- [ ] **Reddit pixel installed:** Reddit Ads → Events Manager → create pixel → copy the id (`a2_…`) → Vercel → Environment Variables → `VITE_REDDIT_PIXEL_ID` → redeploy. The site already fires `Lead` (dev intake) and a `BookedCall` custom event (`src/lib/reddit.ts`).
- [ ] **Test it:** Reddit Events Manager → Test Events → open `/app-marketing?utm_source=reddit` → `PageVisit`; submit the dev form with a test email → `Lead`.
- [ ] **Subreddit rules read** for every community you target (some ban ads or self-promo).
- [ ] **Landing page matches the ad promise** (the free growth plan form is at `#intake`).
- [ ] **Comments on, and you will reply** as yourself, with your affiliation visible.
- [ ] **Minimum $5/day per ad group.**

## 2. Campaign structure
| Setting | Value |
|---|---|
| Objective | **Conversions → Lead** (needs the pixel). If the pixel isn't ready: **Traffic** to the same URL for the first few days only |
| Budget | Test: **$150–300 over 30 days** (about $5–10/day), then scale by what works |
| Bidding | **Manual CPC cap $0.75–$1.00** at small budgets (automatic overspends) |
| Placement | Feed + conversation |
| Schedule | all days; devs browse evenings and weekends |
| Location | US first (keep one variable at a time) |

**Ad groups (separate so you can read results):**
1. **Indie makers:** r/SideProject, r/indiehackers, r/startups
2. **Mobile devs:** r/iOSProgramming, r/androiddev, r/FlutterDev, r/reactnative
3. **SaaS / web:** r/SaaS, r/webdev, r/Entrepreneur (check each sub's ad rules)
4. **Self-hosted / OSS** *(only if you can speak to it honestly)*: r/selfhosted, r/opensource

Start with 5–10 communities total (skill guidance), expand by performance. Add interest targeting only after community targeting has data. Retargeting (site visitors) once you have a few hundred visits.

## 3. Creative (use these, in this order)
1. **Your meme image** (`public/img/devs/more-installs.webp`, 4:5): "More users. More installs." Dev who posts once vs dev with CEO Turbo.
2. **The Line, dev version** (`videos/ceoturbo-ads/renders/ad8-dev-line-4x5.mp4`, 27s, captions burned in, labeled "Illustration, not real data").
3. **Plain text-style post** (no image) written like a dev wrote it: see copy below.

**Copy rules (Reddit punishes hype):** specific, honest, no emoji spam, no ALL CAPS, no "guaranteed", say what the click gets them (a free 30-minute plan).

**Headlines (≤ 100 chars):**
- *You shipped the app. Nobody installed it. Here's a free growth plan.*
- *Why most indie apps stall at 12 users (and the boring fix)*
- *Free 30-min call: we pick the one change most likely to move your installs*
- *Reddit and HN posts are lottery tickets. Here's how to build an actual channel.*

**Body (promoted text post style):**
> I'm Christopher. I built StackFinder and some free software of my own, and I build sites for a living. The pattern I keep seeing: devs ship something good, post it once, get a spike, then nothing. It's usually distribution, not code: no tracking, no landing page that explains it in 5 seconds, no repeatable channel.
> I run a free 30-minute call where I look at your listing, site and analytics and tell you the one thing I'd change first. You keep the plan whether or not you hire me. Comments open, ask me anything.

**CTA button:** Learn More → `https://www.ceoturbo.com/app-marketing`

## 4. UTM scheme (the site stores these 90 days and passes them to Meta, GA4, Reddit, the lead sheet)
```
?utm_source=reddit&utm_medium=paid_social&utm_campaign=devs_<group>&utm_content=<meme|line|text>_<n>
```
`<group>` = `indie`, `mobile`, `saas`, `oss`. Example: `utm_campaign=devs_mobile&utm_content=meme_1`.

## 5. Comments plan (this is where Reddit ads win or lose)
- Turn comments **on**. Reply within a few hours, as yourself, disclosing you run CEO Turbo.
- Answer technical objections plainly; never argue. "Fair point, here's what I'd do" beats a pitch.
- Don't copy-paste replies. One real reply per commenter.
- **Use `reddit-automation` ideas only for research and drafting:** find threads where devs are genuinely asking about launching or distribution, read the subreddit's self-promo rules, and draft a short honest reply you review and post by hand. **Never** run bots, extra accounts, auto-posting, auto-commenting or vote manipulation. That gets the account and the ads account banned.

## 6. Optimization rules (day 0 / 3 / 7 / 14)
- **Day 0:** launch all ad groups at the same budget. Don't touch anything for 72 hours.
- **Day 3:** pause any ad with 1,000+ impressions and CTR under ~0.2%. Read every comment; the top objection becomes next week's headline.
- **Day 7:** pause groups with 30+ clicks and no leads. Move budget to the group with the lowest cost per **lead** (not per click). Judge creatives by cost per lead.
- **Day 14:** judge by **cost per booked call**. If a group has 0 leads after ~$100, change the message before spending more.
- **Attribution window:** 7-day click, 7-day view is a reasonable default for conversions in Events Manager; treat view-through as supporting evidence only.

## 7. What to say when asked "is this real?"
Point to: StackFinder (stackmode.net), the free software you launched, the live Meta dashboards on `/results`, and the published prices on `/pricing`. Don't cite anything not on those pages.
