# CEO TURBO — GOOGLE ADS CONVERSION ACTIONS SETUP & AUDIT ENGINE
## Master Autonomous Execution Prompt for Manus Browser Agent

> **CONFIDENTIAL & HIGH PRIORITY — CEO TURBO (ceoturbo.com)**  
> **Target Google Ads Account:** `AW-18468746701` / Account ID: `232-066-4335`  
> **Target Business:** CEO Turbo (In-Home Computer, Desk Assembly & Office Tech Installations)  
> **Direct Line:** `(678) 558-4327`  
> **Booking Calendar:** `https://cal.com/stackmodechris/ceo-turbo-office-studio-setup`  
> **Target Service Landing Pages:**
> 1. `https://www.ceoturbo.com/services/home-office-setup`
> 2. `https://www.ceoturbo.com/services/office-transformation`
> 3. `https://www.ceoturbo.com/services/apartment-home-office-setup`
> 4. `https://www.ceoturbo.com/services/school-computer-room-setup`
> 5. `https://www.ceoturbo.com/services/dj-studio-setup`
> 6. `https://www.ceoturbo.com/services/computer-build-setup`
> 7. `https://www.ceoturbo.com/services/pos-system-setup`

---

## EXECUTIVE SUMMARY: THE 100% BULLETPROOF CONVERSION ARCHITECTURE

Before spending even **$1.00** on Google Ads, the Google Ads Smart Bidding algorithm must know exactly what a "win" is. If conversion tracking is missing or misconfigured:
- Google optimizes for accidental clicks instead of paying customers.
- Bidding models (Maximize Clicks, Target CPA, Maximize Conversions) cannot learn who books appointments or who calls.
- Phone calls from ads get lost without call duration attribution.

### The 4 Core Conversion Actions Needed in Google Ads:

| Conversion Action Name | Goal Category | Action Source | Primary / Secondary | Value | Count | Purpose & Trigger |
|---|---|---|---|---|---|---|
| **Booked call** | Book appointment | Website (Google Tag) | **Primary** | **$150.00** | One | Fires when a visitor books a slot on Cal.com (via inline embed on all 7 service pages, booking modal, or `/booked` redirect). Enhanced conversions send hashed email & phone. Matches label `5K_sCJuH55odEM3ryuZE`. |
| **Calls from ads** | Phone call leads | Google Hosted (Calls from ads) | **Primary** | **$100.00** | One | Fires when a mobile or desktop user clicks the Google Call Asset or Call-Only ad and speaks on the phone for **≥ 60 seconds**. |
| **Calls to website number** | Phone call leads | Phone calls (Website forwarding number) | **Primary** | **$100.00** | One | Fires when a visitor clicks a Google Ad to any of the 7 service pages, sees the Google dynamic forwarding number replacing `(678) 558-4327`, and calls for **≥ 60 seconds**. |
| **Phone call click** | Contact | Website (Google Tag) | **Secondary** | None | One | Fires whenever a mobile visitor taps any `tel:` button on the site. Kept **Secondary** so it provides observation data without double-counting actual connected phone calls. Matches label `eAzECKGH55odEM3ryuZE`. |
| **Lead** | Submit lead form | Website (Google Tag) | **Primary** | **$25.00** | One | Fires on form quotes, office intakes, and free audit submissions. Matches label `6XuTCJ6H55odEM3ryuZE`. |

---

## HOW TO EXECUTE IN MANUS

1. Open [Manus](https://manus.im) or your Manus Browser Agent.
2. Ensure you are signed into the Google Ads Account for CEO Turbo (`AW-18468746701` / Account `232-066-4335`).
3. Copy everything below between `=== START MANUS BROWSER ONE-SHOT PROMPT ===` and `=== END MANUS BROWSER ONE-SHOT PROMPT ===`.
4. Paste it into Manus and run. Manus will navigate Google Ads Goals & Conversions, audit existing actions, create missing actions, enable Enhanced Conversions, configure call duration thresholds, and generate an audit verification report.

---

```markdown
=== START MANUS BROWSER ONE-SHOT PROMPT ===

ROLE & OBJECTIVE:
You are an Elite Google Ads Tracking Engineer and Autonomous Browser Execution Agent. Your task is to inspect, configure, and audit the Google Conversion Tracking settings in Google Ads for "CEO Turbo" (https://www.ceoturbo.com) so that booked calls and phone calls are tracked 100% perfectly across all 7 installation service landing pages before running ads.

ACCOUNT CONTEXT:
- Website: https://www.ceoturbo.com
- Google Ads Account Tag: AW-18468746701
- Phone Number: (678) 558-4327
- Target Services: Home office setup, office transformation, apartment office setup, school computer room setup, DJ studio setup, custom computer build setup, POS system setup.

============================================================
STEP 1: NAVIGATE TO GOOGLE ADS CONVERSION SUMMARY
============================================================

1. Navigate to: https://ads.google.com/aw/conversions
2. If prompted, select the active CEO Turbo account (Account ID: 232-066-4335 or tag AW-18468746701).
3. Confirm you are on the "Conversions -> Summary" page.
4. Review the table of existing conversion actions. Take note of any existing actions named:
   - "Booked call"
   - "Calls from ads"
   - "Phone call click"
   - "Lead"
   - "Purchase"

============================================================
STEP 2: CONFIGURE / VERIFY "BOOKED CALL" CONVERSION ACTION
============================================================

This action tracks confirmed appointments booked through Cal.com on the website.

1. Check if a conversion action named "Booked call" already exists:
   - IF IT EXISTS:
     * Click on "Booked call" -> click "Edit settings".
     * Verify Goal category is set to: "Book appointment" (under Leads).
     * Verify Conversion action optimization: "Primary action used for bidding optimization".
     * Value: "Use the same value for each conversion" -> $150.00 USD.
     * Count: "One" (Crucial: prevents duplicate count on refresh).
     * Click-through conversion window: 30 days.
     * Attribution model: "Data-driven".
     * Enhanced conversions: Verify "Turn on enhanced conversions" is CHECKED, and set to "Google tag".
     * Click "Save" and "Done".
   - IF IT DOES NOT EXIST:
     * Click "+ New conversion action".
     * Select "Website".
     * Enter domain: https://www.ceoturbo.com -> click "Scan".
     * Scroll to the bottom and click "+ Add a conversion action manually".
     * Goal and action optimization: Select "Book appointment" -> "Primary action".
     * Conversion name: "Booked call".
     * Value: "Use the same value for each conversion" -> enter 150 -> Currency: USD.
     * Count: Select "One".
     * Click-through conversion window: 30 days.
     * Attribution: Data-driven.
     * Click "Done" -> click "Save and continue".
     * Under "Tag setup", select "Use Google tag" -> click "See event snippet".
     * Verify the conversion label displayed after the slash (e.g. AW-18468746701/5K_sCJuH55odEM3ryuZE). Note this label in your final report.

============================================================
STEP 3: CONFIGURE / VERIFY "CALLS FROM ADS" (REAL PHONE CALLS)
============================================================

This action tracks people who click the Call button directly in Google Search (Call Assets and Call-Only Ads) and speak on the phone with CEO Turbo.

1. Check if a conversion action for "Calls from ads" exists:
   - IF IT EXISTS:
     * Click on it -> click "Edit settings".
     * Goal category: "Phone call leads".
     * Optimization: "Primary action used for bidding optimization".
     * Call length: Set to 60 seconds (calls lasting 60 seconds or longer count as qualified leads).
     * Value: "Use the same value for each conversion" -> $100.00 USD.
     * Count: "One".
     * Click "Save" and "Done".
   - IF IT DOES NOT EXIST:
     * Click "+ New conversion action".
     * Select "Phone calls".
     * Select: "Calls from ads using call assets or call-only ads".
     * Click "Continue".
     * Conversion name: "Calls from ads".
     * Value: "Use the same value for each conversion" -> enter 100 -> Currency: USD.
     * Count: "One".
     * Call length: Enter 60 seconds.
     * Click-through conversion window: 30 days.
     * Attribution model: Data-driven.
     * Click "Create and continue" -> click "Done".

============================================================
STEP 4: CONFIGURE / VERIFY "CALLS TO WEBSITE NUMBER" (GOOGLE FORWARDING NUMBER)
============================================================

This action tracks visitors who click your ad, visit any of the 7 service pages on ceoturbo.com, and call the phone number displayed on their screen.

1. Check if an action named "Calls to website number" exists:
   - IF IT DOES NOT EXIST:
     * Click "+ New conversion action".
     * Select "Phone calls".
     * Select: "Calls to a phone number on your website".
     * Click "Continue".
     * Conversion name: "Calls to website number".
     * Goal and action optimization: "Phone call leads" -> "Primary action".
     * Value: "Use the same value for each conversion" -> enter 100 -> Currency: USD.
     * Count: "One".
     * Phone number: Enter 6785584327 (Displayed as (678) 558-4327).
     * Call length: Enter 60 seconds.
     * Click-through conversion window: 30 days.
     * Click "Create and continue" -> click "Done".

============================================================
STEP 5: CONFIGURE / VERIFY "PHONE CALL CLICK" (TAP-TO-CALL LINK)
============================================================

This action tracks mobile visitors clicking on tel: links on the website. To prevent double-counting with actual 60-second completed calls, this action MUST be set to SECONDARY.

1. Check if an action named "Phone call click" exists:
   - IF IT EXISTS:
     * Click on "Phone call click" -> click "Edit settings".
     * Goal category: "Contact".
     * Optimization: Change to "Secondary action not used for bidding optimization" (Observation only).
     * Value: "Don't use a value for this conversion action".
     * Count: "One".
     * Click "Save" and "Done".
   - IF IT DOES NOT EXIST:
     * Click "+ New conversion action" -> "Website" -> scan ceoturbo.com -> "Add manually".
     * Goal: "Contact".
     * Conversion action optimization: Select "Secondary action not used for bidding optimization".
     * Conversion name: "Phone call click".
     * Value: "Don't use a value".
     * Count: "One".
     * Click "Done" -> "Save and continue".
     * Verify event snippet label matches eAzECKGH55odEM3ryuZE.

============================================================
STEP 6: ENABLE ENHANCED CONVERSIONS FOR WEB
============================================================

Enhanced conversions improve attribution accuracy by securely hashing customer email and phone number and matching them to signed-in Google accounts.

1. On the Conversions menu on the left, navigate to:
   "Settings" (under Conversions / Goals).
2. Look for the "Enhanced conversions" section.
3. Click to expand "Enhanced conversions for web":
   - Check the box [x] "Turn on enhanced conversions for web".
   - If prompted for implementation method, select: "Google tag".
   - If prompted to accept the Customer Data Terms, click "Accept terms" / "I agree".
   - Enter URL to check: https://www.ceoturbo.com
   - Click "Save".

============================================================
STEP 7: VERIFY CALL ASSET LINKAGE TO (678) 558-4327
============================================================

1. In the left navigation, click "Campaigns" -> "Assets" (or "Ads & assets" -> "Assets").
2. Filter or select asset type: "Call".
3. Verify that a Call asset exists with:
   - Phone Number: United States (+1) (678) 558-4327
   - Status: "Approved" or "Eligible"
   - Advanced settings / Call reporting: "Turn ON call reporting" must be CHECKED.
   - Conversion action: Linked to "Calls from ads" (or Account-level phone call conversion).
4. If no Call asset exists, click "+ Call":
   - Add to: Account or Campaign.
   - Country: United States (+1).
   - Phone number: (678) 558-4327.
   - Check [x] "Call reporting: On".
   - Conversion action: "Calls from ads".
   - Click "Save".

============================================================
STEP 8: OUTPUT FINAL CONVERSION AUDIT REPORT
============================================================

Review all settings and output a concise structured verification summary:
1. Google Ads Account ID and status.
2. Table of all configured conversion actions showing:
   - Action Name
   - Goal Category
   - Primary vs. Secondary status
   - Value ($) and Count (One/Every)
   - Tracking Source
3. Enhanced Conversions status (ON / OFF).
4. Call Asset status for (678) 558-4327 (Active / Reporting ON).
5. Confirmation statement that Google Ads is 100% prepared to track booked calls and real phone calls before ad traffic is enabled.

=== END MANUS BROWSER ONE-SHOT PROMPT ===
```
