# CEO Turbo ads launch playbook: booked calls on a small budget

**Goal:** booked Brand Boost calls, then sell **Turbo Launch $1,697** + **Turbo Growth $597/mo** on the call. Review cards are the upsell.
**Budget (current plan, hard cap $30/day):** Google booked calls $10 · Microsoft booked calls $10 · Microsoft Google-review-card sales $10. Meta and Reddit are paused for now. See `docs/ads-reporting.md`, `docs/ads/google-ads-upload-v3.csv`, `docs/ads/microsoft-booked-calls-campaign.md`, `docs/ads/microsoft-review-cards-campaign.md`. The older multi-platform budget and ad-group table below is superseded where it conflicts.
**Math:** one Launch sale ($1,697) pays for more than a month of all four. Two clients on Growth cover the ad budget forever.

CPC numbers below are my starting estimates, not quotes. Check them in Google Keyword Planner / Microsoft Keyword Planner before you set the caps.

---

## 1. Tracking: what's already done and what you still do

| Platform | Status |
|---|---|
| GA4 G-XDWPSVBW53 | ✅ live on every page |
| Google Ads AW-18468746701 | ✅ tag built in (remarketing starts on deploy). ⏳ Conversions: create the 4 actions and send me the labels (`docs/tracking-setup.md` §4) |
| Meta Pixel 3232222473609236 + CAPI | ✅ Lead, Schedule, Contact, AuditComplete |
| Microsoft UET 187280408 | ✅ 5 goals exist (Booked call, Lead, Phone click, Purchase, Begin checkout) |
| Microsoft Clarity | ✅ session recordings |
| TikTok pixel | ⏳ add `VITE_TIKTOK_PIXEL_ID` in Vercel when you start TikTok |
| **Reddit pixel** | ⏳ Reddit Ads → Events Manager → create pixel → copy the id (`a2_…`) → Vercel → Settings → Environment Variables → `VITE_REDDIT_PIXEL_ID` → redeploy |

Lead = free visibility check or quiz finished. Booked call = Cal.com booking. Optimize every platform for **Booked call** once you have about 15 a month. Until then, optimize for **Lead**.

---

## 2. Keywords: skip the expensive head terms

"Marketing agency", "SEO company" and "digital marketing" cost $8–$25 a click and are full of other agencies and job seekers. Bid on **specific problems** instead. Fewer searches, but much cheaper, and the people searching are ready to buy.

Match types: **phrase** "…" and **exact** […] only. No broad match until you have 30+ conversions.

| Ad group | Keywords (phrase + exact) | Landing page | Start CPC cap (MS / Google) |
|---|---|---|---|
| **Google profile** | google business profile optimization service · google my business optimization · gbp optimization service · get my business on google maps · google maps ranking service · verify google business profile help | `/services/google-business-profile` | $1.50 / $3.00 |
| **AI search (GEO)** | how to get my business on chatgpt · get recommended by chatgpt · ai seo service · generative engine optimization service · show up in ai search · chatgpt seo agency | `/services/seo-aeo-geo` | $1.50 / $2.50 |
| **Website + SEO package** | small business website and seo package · website design and seo for small business · affordable website with seo · website for contractors with seo · local seo package | `/pricing` | $2.00 / $4.00 |
| **More customers (problem)** | how to get more customers for my business · need more customers for my business · how to get more leads for my business · marketing help for small business | `/how-to-get-more-customers` | $1.25 / $2.50 |
| **Store setup** | google merchant center setup service · shopify google shopping setup · microsoft merchant center setup · shopify facebook pixel setup · shopify conversion tracking setup | `/shopify` | $1.50 / $3.00 |
| **Artists** | music marketing for artists · spotify promotion for artists · how to get more spotify listeners · artist website design · music promotion agency | `/artist` | $1.00 / $2.00 |
| **Tracking help** | ga4 setup service · meta conversions api setup · google ads conversion tracking setup · facebook pixel not working | `/services/meta-ads` | $1.50 / $3.00 |

**Location:** start with **Atlanta metro + Los Angeles** for the local ad groups (Google profile, Website + SEO, More customers). AI search, Store setup, Tracking help and Artists can run **United States**, because those searches are rare and nobody looks for them locally.

**Shared negative list** (add it at the account level on both platforms):
```
jobs, job, career, careers, hiring, salary, intern, internship, resume, course, courses, certification, certificate, training, tutorial pdf, free template, template, templates, diy, how to become, what is, definition, meaning, examples, reddit, quora, youtube, login, sign in, customer service, phone number, support, near me jobs, wix, squarespace, godaddy, canva, chatgpt login, openai, stock, salary, cheap fiverr, fiverr, upwork, freelancer job, university, college, school, pdf, book, books, software download, crack, apk
```
(Leave "free" out of the negatives: "free website audit" searchers convert well on the free check.)

---

## 3. Hidden settings that waste money (change these first)

### Google Ads (new campaign → Search → goal: Leads)
- **Networks:** untick **Google Search Partners** and **Google Display Network**. These are on by default.
- **Locations → Location options:** pick **Presence: people in or regularly in**. The default, "Presence or interest", serves your ads to people in other countries.
- **AI Max / broad match / "Text customization" / "Final URL expansion":** turn them **off**. They pick their own landing pages and write their own ad text.
- **Automatically created assets:** off (campaign settings → More settings).
- **Auto-apply recommendations:** Recommendations → Auto-apply → untick everything. Google raises budgets and adds broad keywords on its own.
- **Bidding:** start with **Maximize clicks** with a **max CPC limit** (caps from the table). After about 15–30 conversions, switch to **Maximize conversions**, and later to target CPA.
- **Conversion goals:** use only **Booked call + Lead** as Primary for this campaign. Untick Page views and Phone call click (Secondary) so the algorithm doesn't chase clicks.
- **Ad schedule:** Mon–Sat, 7am–9pm. Business owners rarely book at 2am.
- **Assets:** sitelinks (Pricing, Free check, Results, Book a call), callouts ("No contracts", "You own everything", "Talk to the founder"), call asset (678) 558-4327, and a price asset (Turbo Start $697 · Turbo Launch $1,697 · Turbo Care $197/mo).
- **Customer Match:** upload your past-customer email list as an audience in **Observation** mode.

### Microsoft Ads (account 189366985)
- **Import from Google Ads** once the Google campaign is built. That's the fastest way, and you then fix the settings below.
- **Ad distribution:** **Search only.** Untick **Audience network**, which is on by default and burns budget on news-site banners.
- **Locations:** "People **in** your targeted locations". The default also includes "or who show interest".
- **Automatically generated assets** and **Auto-apply recommendations:** off.
- **LinkedIn profile targeting** (Microsoft only, and very underused): add bid adjustments of **+30%** for Job function = Business Development / Entrepreneurship / Marketing, and Company size = 1–10 and 11–50. That way you pay more for owners and less for everyone else.
- **Copilot / AI placements** come with Search. Keep them on.
- Goals already exist on UET 187280408. Set **Booked call + Lead** as the campaign's conversion goals.
- Your paused review-card campaign (id 571816100) is ready. Turn it on if cards are the cash-now play this week.

### Meta
- Objective **Leads**, conversion location **Website**, event **Lead**. Switch to **Schedule** at 15+ bookings a week.
- **Advantage+ audience** on, with suggestions: age 28–60 and "small business owners". Location: Los Angeles + Atlanta.
- **Placements:** Advantage+, but exclude **Audience Network**, which brings junk leads.
- Turn **comments on** and answer every one. "Comment your score" comments push reach up.

### Reddit
- Objective **Conversions → Lead** (needs the pixel above). Otherwise use **Traffic** to `/how-to-get-more-customers`.
- **Community targeting:** r/smallbusiness, r/Entrepreneur, r/sweatystartup, r/HVAC, r/Plumbing, r/Construction, r/ecommerce, r/shopify, r/musicmarketing, r/makinghiphop, r/WeAreTheMusicMakers. Put artists in a separate ad group.
- **Placements:** feed + conversation. Keep **comments on** and reply as yourself. Reddit rewards ads that feel human and punishes ads that read like corporate copy.
- **Bidding:** start with a **manual CPC cap of $0.75–$1.00**. Reddit's automatic bidding overspends at small budgets.

---

## 4. Ad copy

### Google / Microsoft responsive search ad (one per ad group; this one is "Google profile")
**Headlines** (30 chars max; pin #1 to position 1):
1. Google Profile Optimization
2. Get More Calls From Maps
3. Free Visibility Score
4. Talk to the Founder Free
5. Rank in the Google Map Pack
6. Done for You From $697
7. No Contracts. You Own It.
8. Show Up on ChatGPT Too
9. 147 Leads for Clients
10. Book a Free 30-Min Call
11. Atlanta-Based, US-Wide
12. Reviews on Autopilot

**Descriptions** (90 chars max):
1. Get found on Google, Maps, Bing & ChatGPT. Profile, socials & tracking done for you.
2. Free 60-second visibility score. Then a free call with the founder. No pressure.
3. The whole package: website, SEO, tracking & ads from $1,697. No contracts.
4. Real results: 147 leads for clients at $7.51 average. See the dashboards.

For each other ad group, swap headlines 1, 2, 5 and 8 for the ad group's own topic (for example "Get Recommended by ChatGPT", "Website + SEO Package $1,697", "Google Shopping Setup", "More Spotify Listeners").

### Reddit meme ads (single image + headline)
Reddit's rules: no fake claims, no "guaranteed #1". The jokes below are about the problem, not about promises.

1. **"Drake" two-panel meme**
   - Panel 1 (no): "Paying for ads with no tracking"
   - Panel 2 (yes): "Knowing exactly which ad got the customer"
   - Headline: *Your ads aren't bad. They're blindfolded. Free 60-second check shows what's broken →*
2. **"Distracted boyfriend" meme**
   - Boyfriend = "Your customer". Girlfriend = "Your business (9 reviews)". Other woman = "Business down the street (140 reviews)".
   - Headline: *Reviews decide who gets the call. Here's the free step-by-step to catch up.*
3. **"This is fine" dog**
   - Caption: "Me running a business ChatGPT has never heard of"
   - Headline: *Ask ChatGPT who's the best [your trade] near you. If it's not you, start here (free) →*
4. **Artists: "Expectation vs reality"**
   - Expectation: "Drop the song, go viral". Reality: "47 streams, 30 are my mom".
   - Headline: *The step-by-step artists use to turn releases into real listeners. Free.*

Landing URL for all: `https://www.ceoturbo.com/how-to-get-more-customers?utm_source=reddit&utm_medium=paid_social&utm_campaign=meme_<n>`

---

## 5. Week-one rules (so you don't kill the learning)
- **Day 0:** deploy (`vercel deploy --prod --yes`), create the Google conversions and send me the labels, add the Reddit pixel id, then launch all four platforms.
- **Days 1–3:** don't touch anything. Answer every lead **within 5 minutes**, by call or text.
- **Day 3:** Search terms report on Google + Microsoft. Add every junk search as a negative. This is the single biggest money saver.
- **Day 7:**
  - Pause keywords with 20+ clicks and 0 leads.
  - Raise the CPC cap 20% on keywords that got leads.
  - Meta: judge cost per lead (under $25 good, over $45 change the hook).
- **Day 14:** move budget to whichever platform has the cheapest **booked call**, not the cheapest click.

---

## 6. Checklist: things only you can do (in order)
1. [ ] Run `vercel deploy --prod --yes` (git pushes don't reliably deploy).
2. [ ] Google Ads: create the 4 conversion actions and send me the labels (`docs/tracking-setup.md` §4). Turn on enhanced conversions.
3. [ ] Google Ads: build the Search campaign from section 2 with the settings in section 3. Then import it into Microsoft Ads.
4. [ ] Reddit: create the pixel and add `VITE_REDDIT_PIXEL_ID` in Vercel, then redeploy.
5. [ ] Fix the leads-sheet secret: Vercel `LEADS_WEBHOOK_SECRET` must equal `SECRET` in the Apps Script (`docs/leads-apps-script.js`). Right now leads only land in the Vercel logs.
6. [ ] Shopify → Settings → Customer events: re-paste `docs/shopify-custom-pixel.js` (the AW id is now filled; the purchase label comes after step 2).
7. [ ] Add a support email to `SITE.email` (Merchant Center needs it). Send it to me and I'll add it.
8. [ ] Record the 9:16 video with `docs/how-to-get-more-customers-ad-script.md`.
9. [ ] Turn on phone notifications in the Cal.com app, so you can call every booking back fast.
