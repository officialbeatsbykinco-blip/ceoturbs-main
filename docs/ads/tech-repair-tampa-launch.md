# Tech repair Tampa: 3 Meta ads + Google Search + PMax

Landing page for everything: `https://www.ceoturbo.com/computer-repair-tampa`
Phones get the 3-tap text quiz, computers get the Cal.com calendar. Phone: (678) 558-4327.
Build in the browser UI (no CSV). Campaign/ad set settings for Meta are in `meta-tech-repair-tampa.md`.

---

## Meta: 3 image ads

Images in `ads/meta/out/` (rebuild: `node ads/meta/tech.mjs`, add `--guides` to see the safe zone).

| Ad name | Feed (4:5) | Stories/Reels (9:16) |
|---|---|---|
| `slow` | `meta-tech-slow-1080x1350.png` | `meta-tech-slow-1080x1920.png` |
| `text` | `meta-tech-text-1080x1350.png` | `meta-tech-text-1080x1920.png` |
| `compare` | `meta-tech-compare-1080x1350.png` | `meta-tech-compare-1080x1920.png` |

**How to upload so nothing overlaps.** In each ad, upload the 4:5 image, then under *Placements → Stories and Reels* click the crop/swap icon and pick the 9:16 file. On 9:16 all text sits between 290px from the top and 680px from the bottom, and clear of the right-hand icon column, so the page name, caption, CTA button and like/comment icons land on plain background. On 4:5 feed the page name sits above the image and the CTA bar below it, so nothing covers it.

Turn **off** Advantage+ creative "text improvements", "add overlays", "music" and "image expansion" (expansion re-crops the 9:16 and can push text under the Reels UI). "Visual touch-ups" can stay on.

URL parameters (all three): `utm_source=facebook&utm_medium=paid&utm_campaign=tech_repair_tampa&utm_content={{ad.name}}`
CTA button: **Get quote** on all three.

### 1. `slow`
**Primary text**
> Slow computer? Don't buy a new one yet.
>
> We come to your home or office around Tampa and speed it up in one visit. Speed-up from $149. You get the price before we start, and if we can't fix it you don't pay.
>
> Tap below, answer 3 quick questions, and we'll text you a price. Or call or text (678) 558-4327.

**Headline:** Slow Computer? Speed-Up From $149
**Description:** At your door around Tampa. No fix, no charge.

### 2. `text`
> Computer, laptop or phone acting up? Text us what's wrong and get a price in minutes.
>
> Diagnosis is $79 and it comes off the repair. Most fixes start at $149. We come to you anywhere within 40 miles of Tampa, and you pay after it works.
>
> Tap below, pick your problem and device, and your text is written for you. Just hit send.

**Headline:** Text Us. Get a Price in Minutes.
**Description:** Tampa computer & phone repair at your door.

### 3. `compare`
> Broken computer? Skip the drive to the repair store.
>
> We come to your door around Tampa, usually the same or next day. You get the price before we start, and if we can't fix it there's no charge. Diagnosis $79, credited to the repair.
>
> Tap below for a price by text, or call (678) 558-4327.

**Headline:** We Come to You. Diagnosis $79.
**Description:** Computers, laptops, phones. Tampa + 40 miles.

**Why these three:** each tests one buying reason. `slow` = pain + low anchored price (the classic local-service winner), `text` = shows the exact low-effort next step (lowers fear of calling), `compare` = convenience vs. the store. Keep all three in one ad set; after 7 days kill any with $40+ spend and no leads.

**Meta approval notes:** no fake "virus detected" pop-ups or system warnings (Meta rejects scare-ware), no before/after claims about speed numbers, no "guaranteed". The chat in `text` is labeled "How it works" and uses our real prices.

---

## Google: approval first

**Read this before you build.** Google restricts ads for *third-party consumer technical support*. Words like "tech support", "computer help", "virus removal", "fix Windows" in ads or keywords can get ads disapproved (policy: "Unreliable claims / Third-party consumer technical support") unless the account is verified for it. Two safe ways through:

1. **Stay on in-person repair language** (what the copy below does): "computer repair", "laptop repair", "on-site", "at your door", "Tampa". No "tech support", no "remote support", no "virus" in ads or keywords, no Microsoft/Apple/Dell trademarks in headlines.
2. If you want remote-help keywords later, apply for Google's technical support advertiser verification first (Google Ads Help → "Technical support advertiser verification"). Until approved, keep remote/virus terms out.

Also: complete **Advertiser verification** (business name + ID) when Google asks, and make sure the landing page shows the business name, phone and service area (it does).

---

## Google Search campaign

**Campaign**
- Name: `CEO Turbo | Search | Computer Repair Tampa`
- Goal: Leads. Conversion goals: the site's Lead (quiz submit), Schedule (Cal booking), Calls from ads. Mark Lead + Schedule + Calls as primary.
- Networks: Search only. **Uncheck Display Network and Search Partners.**
- Location: Tampa, FL + 40 mi radius. Location option: **Presence: people in or regularly in** (not "interest").
- Language: English
- Bidding: **Maximize conversions** (no target CPA for the first 30 conversions), then switch to Target CPA ≈ your 30-day CPA.
- Budget: $20–30/day
- Ad schedule: Mon–Sat 7am–8pm (calls get answered). Add Sunday once you can answer.

**Ad group 1: `Computer Repair`** (phrase + exact)
```
"computer repair tampa"
"computer repair near me"
"laptop repair tampa"
"laptop repair near me"
"pc repair near me"
"computer repair service"
[computer repair tampa]
[laptop repair near me]
"mobile computer repair"
"in home computer repair"
"onsite computer repair"
"computer won't turn on"
"laptop won't turn on"
"slow computer fix"
```

**Ad group 2: `Phone & Tablet`**
```
"iphone screen repair tampa"
"iphone screen repair near me"
"phone screen repair near me"
"ipad screen repair near me"
"iphone battery replacement near me"
"mobile phone repair near me"
```

**Negative keywords (campaign level)**
```
free, jobs, job, salary, course, class, training, certification, how to, diy, youtube,
reddit, manual, parts, used, sell, buy, best buy, geek squad, apple store, warranty,
software download, driver download, microsoft support, apple support, scam, comptia
```
(Brand names as negatives keep you out of trademark/“official support” searches that trigger disapprovals and junk clicks.)

**RSA: Ad group 1 (15 headlines, ≤30 chars)**
```
Computer Repair in Tampa
We Come to Your Door
Laptop & PC Repair Near You
Diagnosis $79, Credited
Repairs From $149
Speed-Up From $149
Price Before We Start
No Fix, No Charge
Same or Next-Day Visits
Pay After It Works
Text Us for a Price
Serving Tampa + 40 Miles
Home & Office Repair Visits
Call (678) 558-4327
Don't Buy a New Computer Yet
```
Pin "Computer Repair in Tampa" to position 1 (optional; leave others unpinned).

**Descriptions (≤90 chars)**
```
Slow, crashing or won't turn on? We come to your home or office around Tampa.
Diagnosis $79, credited to the repair. You get the price before any work starts.
Laptop and PC repair from $149. No fix, no charge. Pay after it works.
Answer 3 quick questions and get your price by text, or pick a time online.
```

**RSA: Ad group 2 headlines**
```
Phone Screen Repair Tampa
iPhone Screens From $149
We Come to Your Door
Screen & Battery Repair
Price Before We Start
No Fix, No Charge
Serving Tampa + 40 Miles
Pay After It Works
Text Us for a Price
Call (678) 558-4327
```
(If "iPhone" in a headline gets limited for trademark, swap to "Phone Screens From $149".)

**Descriptions**
```
Cracked screen or dying battery? We fix phones and tablets at your door in Tampa.
Phone screens from $149. You get the price before we start. Pay after it works.
Text us your model and get a price in minutes, or pick a time online.
```

**Assets (all ad groups)**
- Sitelinks: `Prices` → `/computer-repair-tampa#prices` · `Book a Visit` → `/computer-repair-tampa#fix` · `Office Setup` → `/office-setup-tampa` · `Service Area` → `/computer-repair-tampa#area`
- Callouts: `No Fix, No Charge` · `Price Before Work` · `We Come to You` · `Pay After It Works` · `Diagnosis $79`
- Structured snippet → Services: `Laptop Repair, PC Repair, Speed-Ups, Data Recovery, Phone Screens, Wi-Fi Setup`
- Call asset: (678) 558-4327, call reporting on, count calls ≥60s as a conversion
- Price asset (optional): Speed-up from $149, PC repair from $149, Phone screen from $149
- Location asset if the Google Business Profile is linked

---

## Performance Max (start after Search has ~15 conversions)

PMax learns from conversion data; launched cold on a small budget it spends on Display/YouTube junk. Start it in week 3–4.

- Name: `CEO Turbo | PMax | Computer Repair Tampa`
- Goal: same Lead/Schedule/Calls goals. Location: Tampa + 40 mi, presence only.
- Bidding: Maximize conversions. Budget: $20/day.
- **Final URL expansion: OFF** (keeps traffic on the repair page).
- Brand exclusions: add your own brand so PMax doesn't take branded clicks from Search.
- Account-level negatives: apply the same negative list (Tools → Negative keyword lists, attach at account level for PMax).

**Asset group `Computer Repair`**
- Images: upload `meta-tech-*-1080x1350.png` as 4:5 portrait, plus 1200x1200 square and 1200x628 landscape crops (export from the same builder by adding sizes, or crop in Canva). Logo 1200x1200.
- Headlines (≤30): `Computer Repair in Tampa`, `We Come to Your Door`, `Diagnosis $79, Credited`, `No Fix, No Charge`, `Repairs From $149`
- Long headlines (≤90): `Slow or broken computer? We fix it at your door anywhere around Tampa.` · `Laptop, PC and phone repair at home or work. Price before we start.`
- Descriptions (≤90): `Diagnosis $79, credited to the repair. No fix, no charge. Pay after it works.` · `Answer 3 quick questions and get your price by text in minutes.` · `Serving Tampa and 40 miles around. Call or text (678) 558-4327.` · `Computers, laptops, phones and tablets repaired on-site.`
- Business name: `CEO Turbo`
- CTA: Get quote
- Audience signal: custom segment of people who searched the Ad group 1 keywords + your website visitors + customer list if you have one.
- Video: leave blank only if you upload your own; otherwise Google auto-makes one. Better: upload a 15s vertical of you fixing a laptop.

**Checks before you hit publish:** Policy column shows "Eligible" on every ad (not "Eligible (limited)"), conversion tracking says "Recording conversions", and a test search from a Tampa location shows the ad (Ad Preview tool, not a live search).
