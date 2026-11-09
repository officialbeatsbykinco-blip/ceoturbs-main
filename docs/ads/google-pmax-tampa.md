# Google Performance Max: Tampa tech repair + office setup

Account: CEO Turbo (232-066-4335). Every headline and description below was checked against Google's limits (headline 30, long headline 90, description 90, one description 60 or less).

## Do not run on PMax

- **Google review cards.** No sales. Both review card campaigns are already paused; leave them paused.
- **Websites & ads (agency).** Clients are worldwide and the sale is a call, not a local job. PMax spends on cheap Display/YouTube clicks for that. Keep it on the Search campaign ("Booked Calls") and Meta.

## Fix before launching (Goals, in the Google Ads account)

These decide what PMax optimizes for. Right now it would chase the wrong thing:

1. **Contact** (phone call and text taps from the site) is set to *Secondary*. Make it **Primary**. It is the action older visitors actually take, and it's the only website action recording conversions (4 so far).
2. **Calls from ads (1)** is not included in account goals. **Include it** (Primary), or calls from the ad's call button count for nothing.
3. **Purchase** and **Review Cards - Buy Now Click** (Begin checkout) are Primary account goals. Set them to **Secondary**, or use campaign-specific goals, so PMax doesn't optimize for review card sales.
4. Keep **Submit lead form** (the text quiz) and **Booked call** as Primary.

Then in the PMax campaign: Goals → "Use campaign-specific goals" → only Submit lead forms, Contacts, Phone call leads, Book appointments.

## Campaign settings

| Setting | Value |
|---|---|
| Campaign | CEO Turbo · Tampa Tech Repair · PMax |
| Budget | $20/day to start (raise once it gets 10+ conversions in 30 days) |
| Bidding | Maximize conversions (no target CPA until 30 conversions) |
| Location | Tampa, FL + 40 mi radius. Location options: **Presence: people in or regularly in** (not "interest") |
| Language | English |
| Final URL expansion | **Off** (otherwise Google sends people to the agency or review card pages) |
| Ad schedule | All day; check after 2 weeks |
| Brand exclusions | None |

## Asset group 1: Computer & phone repair

Final URL: `https://www.ceoturbo.com/computer-repair-tampa`

Headlines (30 max):
- Computer Repair in Tampa
- We Come to Your Door
- Slow Computer? Fixed Fast
- Price Up Front
- No Fix, No Charge
- Pay After It Works
- Usually Same or Next Day
- Virus & Pop-Up Removal
- iPhone Screen From $149
- PC Speed-Up From $149
- Remote Speed-Up From $99
- Text Us for a Price
- Laptop Repair Near You
- You Talk to Chris Directly
- Diagnosis $79, Credited

Long headlines (90 max):
- Slow, crashing or broken computer? We fix it at your door in Tampa Bay.
- Computer, laptop, iPhone and tablet repair at your home or business. Price up front.
- Old computer? A cleanup and SSD upgrade can make it feel new again. Tampa Bay.

Descriptions (90 max; first is the short one):
- Price up front. No fix, no charge.
- We come to you within 40 miles of Tampa. Pay after it works.
- Computers, laptops, iPhones and tablets. Tap a few answers and get your price by text.
- Diagnosis $79, credited to the repair. You talk to Chris, not a call center.
- Slow Windows PC? We can speed it up remotely from $99.

Call to action: **Get quote**. Business name: CEO Turbo. Add the phone number as a call asset: (678) 558-4327.

Search themes (signals, up to 25): computer repair near me, laptop repair tampa, computer repair tampa, pc repair near me, iphone screen repair near me, virus removal, slow computer fix, in home computer repair, mobile computer repair, laptop screen repair, computer won't turn on, mac repair near me, tablet screen repair.

Audience signal: custom segment with the search themes above + your website visitors list.

Images: use the 4:5 and 9:16 tech repair ads from `ads/meta/out` (made by `npm run ads:tech`), plus a 1.91:1 and a 1:1 crop. Add your logo (square + landscape). Upload a short video if you have one; otherwise Google auto-makes a weak one from the images.

## Asset group 2: Office setup

Final URL: `https://www.ceoturbo.com/office-setup-tampa`

Headlines:
- Office Setup in Tampa
- Multi-Monitor Desk Setup
- Cable Management Done Right
- Printers, Wi-Fi & Network
- Flat Price in Writing
- Homes & Business Offices
- Desk Setup From $99
- Two Computers, One Desk
- Microsoft & Google Setup
- We Come to You
- See Our Before & After
- Clean Desks, No Cable Mess

Long headlines:
- Messy office? We set up desks, monitors, cables, printers and Wi-Fi in Tampa Bay.
- Multi-monitor workstations and cable management for homes and offices near Tampa.

Descriptions:
- Flat price in writing first.
- Multi-monitor desks, cable management, printers, Wi-Fi and Microsoft or Google setup.
- Homes and businesses within 40 miles of Tampa. Price in writing before we start.
- One keyboard and mouse for two computers, every cable routed and labeled.

Images: the office before/after photos (`public/img/office/before-1200.webp`, `after-1200.webp`). Real photos beat stock.

Search themes: office setup, cable management service, home office setup, multi monitor setup, dual monitor installation, office it setup, network setup small business, printer setup service.

## After launch

- Week 1–2: don't change anything (learning). Check Insights → search term categories; add negatives for "jobs", "course", "free", "diy", "how to".
- Check that conversions show under Contact and Submit lead form. If 0 after a week with clicks, check the site with Tag Assistant.
- Google Business Profile: the biggest local ranking factor. Make sure it's a service-area business covering the same cities, category "Computer repair service", and ask every customer for a review.
