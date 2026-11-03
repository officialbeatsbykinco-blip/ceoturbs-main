# CEO TURBO — 7 SERVICES GOOGLE ADS MASTER LAUNCH ENGINE
## Conversion Settings, Geo-Targeting, Sitelinks & One-Shot Manus Execution Prompt

> **TARGET ACCOUNT:** `AW-18468746701` / Account ID: `232-066-4335`  
> **PHONE:** `(678) 558-4327`  
> **BOOKING CALENDAR:** `https://cal.com/stackmodechris/ceo-turbo-office-studio-setup`  
> **7 TARGET SERVICE URLS:**
> 1. `https://www.ceoturbo.com/services/home-office-setup`
> 2. `https://www.ceoturbo.com/services/office-transformation`
> 3. `https://www.ceoturbo.com/services/apartment-home-office-setup`
> 4. `https://www.ceoturbo.com/services/school-computer-room-setup`
> 5. `https://www.ceoturbo.com/services/dj-studio-setup`
> 6. `https://www.ceoturbo.com/services/computer-build-setup`
> 7. `https://www.ceoturbo.com/services/pos-system-setup`

---

## PART 1: CONVERSION TRACKING ARCHITECTURE (VERIFIED & TESTED)

All 7 pages use the unified `CALL_FIRST_SLUGS` architecture in CEO Turbo's React/Vite application. Every page automatically fires conversions to Google Ads (`AW-18468746701`) via Google Tag (`gtag.js`) with Enhanced Conversions enabled (SHA-256 hashed customer email and phone number).

### The 4 Core Conversion Actions in Google Ads:

| Conversion Action Name | Goal Category | Action Source | Primary / Secondary | Conversion Value | Count | Purpose & Trigger |
|---|---|---|---|---|---|---|
| **Booked call** | Book appointment | Website (Google Tag) | **Primary** | **$150.00** | One | Fires when a visitor confirms an appointment on Cal.com (via inline embed, modal, or `/booked` redirect). Conversion label: `5K_sCJuH55odEM3ryuZE`. Enhanced conversions send email & phone. |
| **Calls from ads** | Phone call leads | Google Hosted (Call Assets & Call Ads) | **Primary** | **$100.00** | One | Fires when a mobile or desktop user clicks the Google Call Asset or Call-Only ad and speaks on the phone for **≥ 60 seconds**. |
| **Calls to website number** | Phone call leads | Phone calls (Website forwarding number) | **Primary** | **$100.00** | One | Fires when a visitor clicks a Google Ad to any of the 7 service pages, sees Google dynamic forwarding replacing `(678) 558-4327`, and calls for **≥ 60 seconds**. |
| **Phone call click** | Contact | Website (Google Tag) | **Secondary** | None | One | Fires whenever a mobile visitor taps any `tel:` button or sticky call bar on the site. Kept **Secondary** to avoid double-counting actual 60-second completed calls. Label: `eAzECKGH55odEM3ryuZE`. |
| **Lead** | Submit lead form | Website (Google Tag) | **Primary** | **$25.00** | One | Fires on form quotes and office consultation intakes. Conversion label: `6XuTCJ6H55odEM3ryuZE`. |

---

## PART 2: TARGET CITIES & BULK GEO-TARGETING LIST

In Google Ads: **Locations -> Advanced Search -> Add locations in bulk**.  
Ensure **Location Option** is set to: **Presence: People in or regularly in your targeted locations**.

### Complete Bulk Paste List (Metro Atlanta, Gwinnett Base, North Ring, Athens):
```text
Atlanta, Georgia, United States
Duluth, Georgia, United States
Norcross, Georgia, United States
Peachtree Corners, Georgia, United States
Alpharetta, Georgia, United States
Roswell, Georgia, United States
Johns Creek, Georgia, United States
Milton, Georgia, United States
Sandy Springs, Georgia, United States
Dunwoody, Georgia, United States
Brookhaven, Georgia, United States
Buckhead, Atlanta, Georgia, United States
Midtown, Atlanta, Georgia, United States
Decatur, Georgia, United States
Chamblee, Georgia, United States
Doraville, Georgia, United States
Tucker, Georgia, United States
Lawrenceville, Georgia, United States
Suwanee, Georgia, United States
Buford, Georgia, United States
Sugar Hill, Georgia, United States
Snellville, Georgia, United States
Lilburn, Georgia, United States
Dacula, Georgia, United States
Grayson, Georgia, United States
Loganville, Georgia, United States
Marietta, Georgia, United States
Smyrna, Georgia, United States
Vinings, Georgia, United States
Kennesaw, Georgia, United States
Acworth, Georgia, United States
Woodstock, Georgia, United States
Canton, Georgia, United States
Stone Mountain, Georgia, United States
East Point, Georgia, United States
College Park, Georgia, United States
Hapeville, Georgia, United States
Forest Park, Georgia, United States
Morrow, Georgia, United States
Jonesboro, Georgia, United States
Riverdale, Georgia, United States
Stockbridge, Georgia, United States
McDonough, Georgia, United States
Fayetteville, Georgia, United States
Peachtree City, Georgia, United States
Newnan, Georgia, United States
Douglasville, Georgia, United States
Athens, Georgia, United States
Watkinsville, Georgia, United States
Winder, Georgia, United States
Monroe, Georgia, United States
Covington, Georgia, United States
Conyers, Georgia, United States
Gwinnett County, Georgia, United States
Fulton County, Georgia, United States
Cobb County, Georgia, United States
DeKalb County, Georgia, United States
```

---

## PART 3: 10 HIGH-CONVERTING SITELINKS (CHARACTER VERIFIED)

All sitelinks strictly obey Google Ads limits (Headline ≤ 25 chars, Description Line 1 & 2 ≤ 35 chars).

### Sitelink 1: Home Office Setup
- **Link Text:** Home Office Setup *(17 chars)*
- **Description Line 1:** Desk assembly & PC configuration *(32 chars)*
- **Description Line 2:** Dual monitors, Wi-Fi & wire hide *(33 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/home-office-setup`

### Sitelink 2: Office Transformation
- **Link Text:** Office Transformation *(21 chars)*
- **Description Line 1:** Turnkey office & workspace builds *(34 chars)*
- **Description Line 2:** Framing, cameras, networks & tech *(34 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/office-transformation`

### Sitelink 3: Apartment Office Setup
- **Link Text:** Apartment Office Setup *(22 chars)*
- **Description Line 1:** Compact desk & computer setup *(30 chars)*
- **Description Line 2:** Clean wire routing in 2-4 hours *(32 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/apartment-home-office-setup`

### Sitelink 4: School Computer Labs
- **Link Text:** School Computer Labs *(20 chars)*
- **Description Line 1:** Complete computer room build-out *(32 chars)*
- **Description Line 2:** Multi-station PCs, network & desks *(34 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/school-computer-room-setup`

### Sitelink 5: DJ Studio Desk Setup
- **Link Text:** DJ Studio Desk Setup *(20 chars)*
- **Description Line 1:** Audio workstations & cable routing *(33 chars)*
- **Description Line 2:** Monitor arms, gear & sound checks *(33 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/dj-studio-setup`

### Sitelink 6: Custom PC Build & Setup
- **Link Text:** Custom PC Build & Setup *(23 chars)*
- **Description Line 1:** Hardware assembly & stress tests *(32 chars)*
- **Description Line 2:** Office workstations & gaming rigs *(33 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/computer-build-setup`

### Sitelink 7: POS System Installation
- **Link Text:** POS System Installation *(23 chars)*
- **Description Line 1:** Registers, scanners & card readers *(34 chars)*
- **Description Line 2:** Toast, Square & Clover setup *(29 chars)*
- **Final URL:** `https://www.ceoturbo.com/services/pos-system-setup`

### Sitelink 8: Instant Cal.com Booking
- **Link Text:** Book Online Instantly *(21 chars)*
- **Description Line 1:** Pick your installation time slot *(32 chars)*
- **Description Line 2:** Fast confirmation via Cal.com *(30 chars)*
- **Final URL:** `https://cal.com/stackmodechris/ceo-turbo-office-studio-setup`

### Sitelink 9: Transparent Pricing
- **Link Text:** Flat Rate Pricing *(17 chars)*
- **Description Line 1:** Transparent pricing from $99 *(29 chars)*
- **Description Line 2:** Zero hidden fees or hourly rates *(32 chars)*
- **Final URL:** `https://www.ceoturbo.com/pricing`

### Sitelink 10: Atlanta Local Base
- **Link Text:** Atlanta & Gwinnett Hub *(22 chars)*
- **Description Line 1:** Local Duluth base & 50-mi radius *(32 chars)*
- **Description Line 2:** Fast mobile tech team to your door *(34 chars)*
- **Final URL:** `https://www.ceoturbo.com/atlanta`

---

## PART 4: MASTER ONE-SHOT MANUS EXECUTION PROMPT

Copy and paste the block below directly into Manus or your Manus Browser Agent.

```markdown
=== START MANUS BROWSER ONE-SHOT PROMPT ===

ROLE & MISSION:
You are an Elite Google Ads Implementation Engineer and Autonomous Browser Execution Agent. Your task is to inspect, audit, and configure the Google Ads Campaign and Conversion Settings for "CEO Turbo" (https://www.ceoturbo.com) targeting 7 core installation services across Metro Atlanta and Gwinnett County.

TARGET ACCOUNT:
- Google Ads Account Tag: AW-18468746701
- Phone Number: (678) 558-4327
- Website: https://www.ceoturbo.com
- Booking Calendar: https://cal.com/stackmodechris/ceo-turbo-office-studio-setup

============================================================
PHASE 1: AUDIT & CONFIGURE GOOGLE ADS CONVERSION ACTIONS
============================================================

1. Navigate to: https://ads.google.com/aw/conversions
2. Confirm the active account is CEO Turbo (`AW-18468746701` / Account `232-066-4335`).
3. Audit / Create the following conversion actions:

   ACTION A: "Booked call"
   - Goal Category: "Book appointment" (under Leads)
   - Status: Primary action used for bidding optimization
   - Value: $150.00 USD
   - Count: One
   - Click-through window: 30 days
   - Attribution model: Data-driven
   - Enhanced Conversions: Enable "Turn on enhanced conversions for web" via Google tag.

   ACTION B: "Calls from ads"
   - Goal Category: "Phone call leads"
   - Action Source: Phone calls -> Calls from ads using call assets or call-only ads
   - Status: Primary action used for bidding optimization
   - Call length: 60 seconds
   - Value: $100.00 USD
   - Count: One

   ACTION C: "Calls to website number"
   - Goal Category: "Phone call leads"
   - Action Source: Phone calls -> Calls to a phone number on your website
   - Status: Primary action used for bidding optimization
   - Phone number: (678) 558-4327
   - Call length: 60 seconds
   - Value: $100.00 USD
   - Count: One

   ACTION D: "Phone call click"
   - Goal Category: "Contact"
   - Status: SECONDARY action not used for bidding optimization (observation only)
   - Value: Don't use a value
   - Count: One

   ACTION E: "Lead"
   - Goal Category: "Submit lead form"
   - Status: Primary action used for bidding optimization
   - Value: $25.00 USD
   - Count: One

============================================================
PHASE 2: CONFIGURE THE CAMPAIGN TARGETING & CITIES
============================================================

1. Navigate to: https://ads.google.com/aw/campaigns
2. Open the active search campaign (e.g. "CEO Turbo - Home Office & Tech Setup") or create a new Search campaign:
   - Campaign Goal: Leads
   - Campaign Type: Search
   - Bidding: Maximize Clicks with Max CPC Bid Limit: $1.50 (or Maximize Conversions if conversions already recorded)
   - Networks:
     * UNCHECK [ ] Include Google search partners
     * UNCHECK [ ] Include Google Display Network

3. Target Locations (Bulk Geo-Targeting):
   - Location Option -> Target: Select "Presence: People in or regularly in your targeted locations" (CRITICAL: Do not select Interest).
   - Click "Advanced search" -> Select "Add locations in bulk".
   - Paste the following list of Georgia cities & counties:

Atlanta, Georgia, United States
Duluth, Georgia, United States
Norcross, Georgia, United States
Peachtree Corners, Georgia, United States
Alpharetta, Georgia, United States
Roswell, Georgia, United States
Johns Creek, Georgia, United States
Milton, Georgia, United States
Sandy Springs, Georgia, United States
Dunwoody, Georgia, United States
Brookhaven, Georgia, United States
Buckhead, Atlanta, Georgia, United States
Midtown, Atlanta, Georgia, United States
Decatur, Georgia, United States
Chamblee, Georgia, United States
Doraville, Georgia, United States
Tucker, Georgia, United States
Lawrenceville, Georgia, United States
Suwanee, Georgia, United States
Buford, Georgia, United States
Sugar Hill, Georgia, United States
Snellville, Georgia, United States
Lilburn, Georgia, United States
Dacula, Georgia, United States
Grayson, Georgia, United States
Loganville, Georgia, United States
Marietta, Georgia, United States
Smyrna, Georgia, United States
Vinings, Georgia, United States
Kennesaw, Georgia, United States
Acworth, Georgia, United States
Woodstock, Georgia, United States
Canton, Georgia, United States
Stone Mountain, Georgia, United States
East Point, Georgia, United States
College Park, Georgia, United States
Hapeville, Georgia, United States
Forest Park, Georgia, United States
Morrow, Georgia, United States
Jonesboro, Georgia, United States
Riverdale, Georgia, United States
Stockbridge, Georgia, United States
McDonough, Georgia, United States
Fayetteville, Georgia, United States
Peachtree City, Georgia, United States
Newnan, Georgia, United States
Douglasville, Georgia, United States
Athens, Georgia, United States
Watkinsville, Georgia, United States
Winder, Georgia, United States
Monroe, Georgia, United States
Covington, Georgia, United States
Conyers, Georgia, United States
Gwinnett County, Georgia, United States
Fulton County, Georgia, United States
Cobb County, Georgia, United States
DeKalb County, Georgia, United States

   - Click "Search" -> click "Target all" -> click "Save".

============================================================
PHASE 3: CONFIGURE CALL ASSET & CALL-ONLY AD
============================================================

1. Call Asset:
   - Navigate to Ads & assets -> Assets -> Call.
   - Attach Call Asset with phone number: (678) 558-4327 (United States +1).
   - Call reporting: ON.
   - Conversion Action: Linked to "Calls from ads".

2. Call Ad (Mobile Call-Only):
   - Phone Number: (678) 558-4327
   - Business Name: CEO Turbo
   - Headline 1: Home Office Setup Atlanta (25 chars)
   - Headline 2: From $99 Flat Labor Rate (24 chars)
   - Description 1: We assemble desks, mount dual monitors & setup PCs cleanly. (63 chars)
   - Description 2: Fast in-home setup across Atlanta & Duluth. Call (678) 558-4327 now! (70 chars)
   - Verification URL: https://www.ceoturbo.com

============================================================
PHASE 4: CONFIGURE THE 10 HIGH-CONVERTING SITELINKS
============================================================

In Ads & assets -> Assets -> Sitelink, add these 10 sitelinks:

1. Link Text: Home Office Setup (17 chars)
   Desc 1: Desk assembly & PC configuration (32 chars)
   Desc 2: Dual monitors, Wi-Fi & wire hide (33 chars)
   Final URL: https://www.ceoturbo.com/services/home-office-setup

2. Link Text: Office Transformation (21 chars)
   Desc 1: Turnkey office & workspace builds (34 chars)
   Desc 2: Framing, cameras, networks & tech (34 chars)
   Final URL: https://www.ceoturbo.com/services/office-transformation

3. Link Text: Apartment Office Setup (22 chars)
   Desc 1: Compact desk & computer setup (30 chars)
   Desc 2: Clean wire routing in 2-4 hours (32 chars)
   Final URL: https://www.ceoturbo.com/services/apartment-home-office-setup

4. Link Text: School Computer Labs (20 chars)
   Desc 1: Complete computer room build-out (32 chars)
   Desc 2: Multi-station PCs, network & desks (34 chars)
   Final URL: https://www.ceoturbo.com/services/school-computer-room-setup

5. Link Text: DJ Studio Desk Setup (20 chars)
   Desc 1: Audio workstations & cable routing (33 chars)
   Desc 2: Monitor arms, gear & sound checks (33 chars)
   Final URL: https://www.ceoturbo.com/services/dj-studio-setup

6. Link Text: Custom PC Build & Setup (23 chars)
   Desc 1: Hardware assembly & stress tests (32 chars)
   Desc 2: Office workstations & gaming rigs (33 chars)
   Final URL: https://www.ceoturbo.com/services/computer-build-setup

7. Link Text: POS System Installation (23 chars)
   Desc 1: Registers, scanners & card readers (34 chars)
   Desc 2: Toast, Square & Clover setup (29 chars)
   Final URL: https://www.ceoturbo.com/services/pos-system-setup

8. Link Text: Book Online Instantly (21 chars)
   Desc 1: Pick your installation time slot (32 chars)
   Desc 2: Fast confirmation via Cal.com (30 chars)
   Final URL: https://cal.com/stackmodechris/ceo-turbo-office-studio-setup

9. Link Text: Flat Rate Pricing (17 chars)
   Desc 1: Transparent pricing from $99 (29 chars)
   Desc 2: Zero hidden fees or hourly rates (32 chars)
   Final URL: https://www.ceoturbo.com/pricing

10. Link Text: Atlanta & Gwinnett Hub (22 chars)
    Desc 1: Local Duluth base & 50-mi radius (32 chars)
    Desc 2: Fast mobile tech team to your door (34 chars)
    Final URL: https://www.ceoturbo.com/atlanta

============================================================
PHASE 5: CALLOUT ASSETS & STRUCTURED SNIPPETS
============================================================

1. Callout Assets:
   - "Call (678) 558-4327"
   - "From $99 Flat Labor"
   - "Zero Hidden Fees"
   - "Finished In 2-4 Hours"
   - "Great For Seniors & WFH"
   - "Dual Monitor Mounting"
   - "Clean Cable Routing"
   - "Serving Metro Atlanta"

2. Structured Snippet Asset:
   - Header: Types (or Services)
   - Values: Desk Assembly, PC & Mac Setup, Dual Monitor Setup, Cable Concealment, Wi-Fi & Network, Standing Desks

============================================================
PHASE 6: NEGATIVE KEYWORD DEFENSE LIST
============================================================

Add as Phrase Match at Campaign Level:
"free"
"diy"
"how to"
"youtube"
"jobs"
"hiring"
"salary"
"internship"
"course"
"certification"
"remote work from home jobs"

============================================================
PHASE 7: FINAL EXECUTION VERIFICATION REPORT
============================================================

Output a structured verification summary:
1. Google Ads Account ID and status.
2. Table of configured conversion actions (Name, Goal, Primary/Secondary, Value).
3. Targeted cities count and presence setting verification.
4. Active sitelinks list and call asset confirmation.
5. Confirmation that Google Ads is 100% armed and ready to drive calls and bookings.

=== END MANUS BROWSER ONE-SHOT PROMPT ===
```
