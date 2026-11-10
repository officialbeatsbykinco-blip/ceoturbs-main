# Google Performance Max: business tech setup, Temple Terrace + 40 mi

Account: CEO Turbo (232-066-4335). Landing page: `https://www.ceoturbo.com/business-tech-setup-tampa`.
Every line below was checked against Google's limits (headline 30, long headline 90, description 90, one description 60 or less).

## Why it's business-only (read this first)

Google's **third-party consumer technical support** policy bans ads for tech help sold to consumers: repair, virus removal, installs, Wi-Fi help and remote help for homes, and that includes gamers' PCs. Services sold **only to businesses** are allowed. A violation gets a 7-day warning, then the account is suspended, and this account shares a manager account with Appliance King.

So on Google:
- **Only** `/business-tech-setup-tampa` (no repair or home wording, no links to consumer pages; `src/test/tampa.test.tsx` enforces it).
- Never in ad text: repair, fix, broken, virus, malware, tech support, help desk, technician, remote, pop-up, hotline, home, gaming, or device brand names (Apple, Dell, HP, Samsung). "Microsoft 365" names a product we set up, which is allowed.
- Home, gamer and repair customers go to **Meta and TikTok** (`docs/ads/meta-tech-repair-tampa.md`), the Google Business Profile and organic search.

The older version of this file planned a consumer repair PMax (virus removal, iPhone screens, remote speed-ups). Running that would get the account suspended. Don't build it.

## Fix the goals first (Goals → Conversions → Summary)

| Conversion action | Set it to | Why |
|---|---|---|
| Contact (call/text taps) | Primary, included | It's recording (1 so far) |
| Submit lead form (text quiz) | Primary, included | |
| Booked call (Cal.com) | Primary, included | Shows "Needs attention" until the first booking from an ad |
| **Calls from ads (1)** | **Include in account-level goals** | Was "No", so calls from the ad's call button counted for nothing |
| Purchase, Review Cards - Buy Now Click | Leave as-is, but the PMax campaign uses **campaign-specific goals** | Keeps PMax off review-card sales |

## Campaign settings

| Setting | Value |
|---|---|
| Name | CEO Turbo \| Business Tech Setup \| Temple Terrace 40mi \| PMax |
| Goals | Campaign-specific: **Contacts, Submit lead forms, Book appointments, Phone call leads** only |
| Budget | **$20/day** (raise 20% at a time after 15+ conversions in 30 days) |
| Bidding | Maximize conversions, no target CPA until 30 conversions |
| Customer acquisition | Off |
| Location | Temple Terrace, FL + **40 mi radius**. Location options: **Presence** (people in or regularly in) |
| Language | English |
| Final URL expansion | **Off** (otherwise Google sends people to agency, review-card or consumer pages) |
| Ad schedule | All day to start; check the hour report after 2 weeks |
| Negative keywords (campaign) | repair, fix, broken, virus, malware, home, gaming, gamer, iphone, phone repair, laptop repair, geek squad, best buy, jobs, job, hiring, salary, career, course, training, certification, free, diy, how to, youtube, reddit |
| URL options → Final URL suffix | `utm_source=google&utm_medium=pmax&utm_campaign=business_tech_tampa` |

## Asset group: Business tech setup

Final URL: `https://www.ceoturbo.com/business-tech-setup-tampa`. Business name: **CEO Turbo**. Call to action: **Get quote**.

**Headlines (15)**
Office Tech Setup in Tampa · Business Wi-Fi Installed · Workstations Set Up On-Site · Multi-Monitor Desk Setup · New Office? Ready Day One · Flat Price in Writing First · Pay After Your Team Signs Off · Printers & Shared Files Setup · Microsoft 365 Accounts Set Up · Storefront Doorbells & Cams · POS & Register Setup · Workstation Setup $169 · For Tampa Bay Businesses · Call or Text for a Quote · Office Move-In Tech Setup

**Long headlines (5)**
- Office tech set up right for Tampa Bay businesses. Flat price in writing before we start.
- Workstations, Wi-Fi, printers and Microsoft 365 set up on-site at your office or shop.
- Moving offices? Desks, Wi-Fi and printers ready before your team walks in on day one.
- Multi-monitor workstations set up on-site for offices, clinics and shops near Tampa.
- Business Wi-Fi with a separate guest network, installed on-site within 40 miles of Tampa.

**Descriptions (5, the first one is the short one)**
- Flat price in writing. Pay when your team signs off.
- Workstations, Wi-Fi, printers and accounts set up on-site at your Tampa Bay business.
- Workstation setup $169 per desk. Business Wi-Fi from $179. Total in writing first.
- Offices, shops, clinics and restaurants within 40 miles of Temple Terrace. Call or text.
- You deal with the person who does the work. No call center and no hourly surprises.

Prices match `src/content/install-pages.ts` (workstation $169, business Wi-Fi from $179). If they change there, change them here and in the ads.

**Images:** `npm run ads:pmax` writes them to `ads/google/out/`. They're real photos (Google ranks those above text graphics) at Google's exact sizes, with the client's company name on the right monitor blurred:
- `office-after-landscape.jpg` 1200×628, `office-after-square.jpg` 1200×1200, `office-after-portrait.jpg` 960×1200
- `office-before-after-landscape.jpg`, `-square.jpg`, `-portrait.jpg`
- `logo-square.png` 1200×1200, `logo-landscape.png` 1200×300

Add more real job photos as you get them (a storefront doorbell, a finished Wi-Fi install, a multi-desk office). Each new real photo helps more than any stock image.

**Video:** none yet. Google will auto-make one from the images, and those auto-videos perform badly. Upload a 15–30 s phone video of a finished office (vertical and horizontal) as soon as you have one.

**Sitelinks:** Prices → `/business-tech-setup-tampa#prices` · Book a Time → `#book` · Service Area → `#area`. **Call asset:** (678) 558-4327 with call reporting on.

**Search themes (signals):** office it setup, office network setup, business wifi installation, workstation setup, office computer setup, pos system installation, office move it setup, small business network setup, microsoft 365 setup for business, office cable management, multi monitor setup office, conference room tv setup, office printer setup, new office technology setup, business security camera installation, managed it services tampa, it services for small business, office technology services tampa.

**Audience signal:** custom segment "Tampa business tech buyers" (people who searched the themes above) + website visitors.

## After launch

- Days 1–14: don't touch it (learning). Check Policy status the first day.
- Weekly: Insights → Search terms. Add anything consumer (home, gaming, repair, iphone) as a campaign negative.
- Conversions should show under Contacts and Phone call leads. If clicks come in with 0 after a week, open the page with Tag Assistant and check `click_to_call` fires.
- **Biggest lift still open:** a Tampa (813) number. The page says "based in Tampa" but the number is Atlanta (678), which costs trust and calls. A free Google Voice 813 number forwarding to your phone fixes it. Send it over and I'll swap it site-wide (`SITE.phone` in `src/config/site.ts`).
