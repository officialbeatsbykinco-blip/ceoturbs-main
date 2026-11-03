# Google Ads: "Google Ads for Local Service" campaign

**Goal:** booked calls and phone calls from owners of local service businesses (appliance repair, HVAC, plumbing, cleaning, handymen) who are looking to hire someone to run their Google Ads. Not clicks.

**Phone number:** (678) 558-4327. It matches the site (`SITE.phone` in `src/config/site.ts`).

Every headline, description, sitelink and callout below is within Google's limits: headlines 30, descriptions 90, sitelink text 25, sitelink lines 35, callouts 25, snippet values 25.

## How this campaign avoids paying for junk clicks
1. **Only buyer searches.** Every keyword names a trade, or says hire, agency, company, management or marketing. No "how to", "what is" or "tips" searches, because those are people who want to learn, not hire.
2. **Exact and phrase match only.** No broad match.
3. **The ad filters people out before they click.** "Full Setup Just $297" and "For Service Businesses" are in the ads, so job seekers, students and bargain hunters skip it.
4. **A big negative list** (below), plus a search-terms check every 3–4 days.
5. **Search only.** No Display Network, no Search Partners, and not Performance Max.
6. **Shown only when you can answer the phone.**

## Before you launch (do these first)
- [ ] **Phone call conversion:** Goals → Conversions → New → Phone calls → "Calls from ads using call assets". Count a call after **60 seconds**. Set it to **Primary**.
- [ ] **Call asset:** (678) 558-4327 with **Google forwarding number ON**, so calls are tracked, and **Call reporting ON**.
- [ ] **Primary conversions:** Book appointment, Submit lead form, Calls from ads (60s+). Set Contact (website phone click) to **Secondary**, since a tap isn't a real call.
- [ ] **Remove old junk from the account:** the old call asset (678) 558-4327 and the old trading-school sitelinks.
- [ ] **Pause:** CEO Turbo | NFC Review Cards and CEO Turbo | Calls | US Niche.
- [ ] **Old campaigns end Oct 26, 2026.** Launch this one before then.

## Campaign settings
| Setting | Value |
|---|---|
| Name | CEO Turbo \| Google Ads for Local Service |
| Objective | Leads |
| Type | Search |
| Networks | Google Search only. **Untick** Search Partners and Display Network. |
| Locations | United States |
| Location option | **Presence:** people in or regularly in your locations (not "interested in") |
| Language | English |
| Schedule | Mon–Fri 8am–6pm and Sat 9am–2pm, **Eastern**. Only run when you can pick up the phone; a missed call is a lost client. |
| Devices | All. Phones bring most calls, so don't lower mobile bids. |
| Budget | $12/day (Brand campaign $1–3/day stays on) |
| Bidding | **Manual CPC** to start, with max CPC set per ad group (below). Switch to Maximize conversions after 15+ real conversions in 30 days. |
| Auto-applied recommendations | **Turn all of them off** (Recommendations → Auto-apply). They add broad keywords and raise budgets. |
| Automatically created assets | **Off**, so Google doesn't write its own headlines |
| Final URL | `https://www.ceoturbo.com/google-ads-for-local-business` |
| Tracking template / final URL suffix | `utm_source=google&utm_medium=cpc&utm_campaign=local_service_ads&utm_term={keyword}&utm_content={creative}` |

**Budget reality check:** agency keywords cost money. "Google ads agency" can be $8–20 a click, while trade-specific ones ("google ads for appliance repair") are usually cheaper because fewer agencies bid on them. At $12/day expect roughly 2–5 clicks a day. That's why the plan puts most of the budget on trade-specific keywords and caps CPCs.

**Realistic expectations (market data, checked Oct 2026):** WordStream/LocaliQ's 2026 benchmark across 13,474 US search campaigns reports averages of a $5.42 CPC, an 8.18% conversion rate and $66.69 per lead, as quoted by secondary sites. At $20/day (~$600/month) that's about **9 leads a month** at average performance. With a ~20–30% close rate, that's about **2–3 new clients a month**. At $297 setup + $97/mo, you need about 2 new clients a month to cover the ad spend, so the monthly plans are where the profit builds up. It's a monthly engine, not a this-week one.

## Ad groups, keywords and max CPC
Start with ad groups 1 and 2. Turn on 3 only if 1 and 2 don't spend the budget.

**1. Trade-specific Google Ads** (max CPC $4). This is your best group: low competition and exactly who you want.
```
[google ads for appliance repair]
"google ads for appliance repair"
[appliance repair marketing]
"appliance repair marketing company"
[google ads for plumbers]
"google ads for plumbers"
[google ads for hvac]
"google ads for hvac"
"hvac google ads management"
"plumbing google ads management"
[google ads for cleaning business]
[google ads for handyman]
"google ads for home service business"
"google ads for contractors"
```

**2. Trade marketing company** (max CPC $4)
```
"hvac marketing company"
"plumbing marketing company"
"appliance repair advertising"
"home service marketing agency"
"marketing for plumbers"
"marketing for hvac companies"
"marketing for appliance repair"
"lead generation for plumbers"
"lead generation for hvac"
```

**3. Hire a Google Ads manager** (max CPC $5; turn on only if budget is left over). These are expensive and draw more agency shoppers.
```
"hire google ads manager"
"google ads management for small business"
[google ads management small business]
"google ads expert for small business"
"google ads consultant for small business"
"local google ads agency"
```

## Negative keywords (campaign level, phrase match)
```
jobs, job, career, careers, hiring, salary, resume, intern, internship, remote,
course, courses, class, classes, training, certification, certificate, exam, learn, tutorial, youtube, udemy, coursera, pdf, book,
free, cheap, diy, yourself, myself, how to, what is, how does, tips, ideas, examples, template, templates, reddit, quora,
login, log in, sign in, account suspended, support number, customer service, phone number, refund, appeal,
near me jobs, apprentice, school,
software, app, crm, chatgpt, ai tool, tool,
repair near me, plumber near me, hvac repair, ac repair, fix my, appliance parts, parts
```
The last line keeps out homeowners looking for a plumber or a repair. They are not your clients.

**After launch:** every 3–4 days open **Insights & reports → Search terms**. Add anything not from a business owner looking to hire help as a negative. This one habit is what stops paying for clicks for no reason.

## Responsive search ad (one per ad group; swap the pinned headline per group)
**Headlines (15)**
1. Google Ads for Service Pros *(pin position 1 in group 3)*
2. Google Ads: Appliance Repair *(pin position 1 in group 1)*
3. Get More Calls From Google
4. More Calls for HVAC & Plumbing *(pin position 1 in group 2)*
5. Built for Service Businesses
6. Real Client: $16.89 a Lead
7. Every Call Tracked
8. Pay for Calls, Not Junk Clicks
9. No Long-Term Contracts
10. You Own the Ad Account
11. Full Setup Just $297
12. Free 30-Min Strategy Call
13. Talk to the Founder Free
14. Call (678) 558-4327
15. Founder-Run, Atlanta-Based

Headline 14 is allowed as a headline; the call asset adds the actual call button.

**Descriptions (4)**
1. We build your Google search campaign and track every call and form. Free 30-min call.
2. For appliance repair, HVAC, plumbing and cleaning businesses. No long-term contract.
3. Real result: 3 conversions at $16.89 each in a client's first week on Google Search.
4. Full setup $297, then ads managed weekly for $97/mo. Ad spend goes straight to Google.

The $16.89 figure is Appliance King's Google Ads dashboard (Oct 16–22, 2026), shown on the landing page, which backs the claim. Description 4 shows the price on purpose, so people who can't afford it don't click.

**Display path:** `ceoturbo.com/google-ads/service-pros`

## Assets
**Sitelinks (4)**
| Text | Line 1 | Line 2 | URL |
|---|---|---|---|
| Book a Free Call | 30 min with the founder | Pick a time that suits you | /google-ads-for-local-business#book |
| Real Results | Unedited ad dashboards | Google and Meta numbers | /results |
| Pricing | Full setup just $297 | Monthly from $35, no contract | /pricing |
| Google Ads Service | Search campaigns for trades | Every call and form tracked | /services/google-ads |

**Don't use the ChatGPT article as a sitelink in this campaign.** Its readers want to learn, not hire, and a sitelink to an article pulls clicks away from booking or calling. Its impressions are from organic search, which is free traffic. Make that traffic convert instead: the article should have a "Want us to do it for you?" call and booking button near the top and at the end. You could test it later in a separate low-budget campaign aimed at "AI search" keywords, but not here.

**Callouts (6)**
- No Long-Term Contracts
- You Own the Account
- Every Call Tracked
- Founder-Run
- Built for Service Pros
- Free 30-Min Call

**Structured snippet (Header: Services)**
Google Search Ads · Call Tracking · Google Business Profile · Conversion Tracking · Landing Pages

**Call asset:** (678) 558-4327, Google forwarding number on, scheduled for the same hours as the campaign.

**Price asset:** Turbo Start $297 · Turbo Launch $347 · Conversion Rescue $147 · Tracking Watch $25/mo. All four link to /pricing.

**Business name and logo:** CEO Turbo, plus the CT logo already uploaded at account level.

## What to watch and when to change things
| When | Check | Action |
|---|---|---|
| Day 1 | Ads approved? Call asset eligible? | Fix any disapproval right away |
| Every 3–4 days | Search terms | Add junk as negatives |
| Every 3–4 days | Missed calls | Call back within 5 minutes; speed wins the client |
| ~30 clicks per ad group | CTR and conversions | Pause ad groups with clicks and no calls or bookings; move budget to the winner |
| ~80 clicks, 0 bookings | The landing page, not the keywords | Watch Clarity recordings of `/google-ads-for-local-business` before changing ads |
| 15+ conversions in 30 days | Bidding | Switch to Maximize conversions |

Don't change bids or budgets more than once every few days. Every change resets what Google has learned.
