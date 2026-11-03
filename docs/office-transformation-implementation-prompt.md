# Claude Sonnet Implementation Prompt: Office Transformation Service & Tracking Setup

**Goal**: Implement the new Office Transformation service page, verify all tracking is correctly configured for call and booking conversions, and ensure Meta/Microsoft/Google ads can accurately measure performance.

**Credit Conservation Strategy**: This prompt is structured to minimize token usage while ensuring complete implementation. Read the entire prompt once, then execute all steps sequentially without asking for clarification unless absolutely necessary.

---

## CONTEXT

CEO Turbo has added a new service: **Office Transformation & Build-Out**. This service provides complete office setup including:
- Office framing and build-out
- Security camera installation
- High-speed internet and network setup
- Computer building and configuration
- Professional cleaning
- One-time pricing (no monthly contracts)


**Service Content Already Added**:
- Service entry added to `/src/content/services.ts` (slug: `office-transformation`)
- Pricing tiers added to `/src/content/pricing.ts` (basic: $1,499, standard: $2,999, complete: $4,999)

---

## TASK 1: Create Service Page Component

**File to create**: `/src/components/services/office-transformation.tsx`

**Requirements**:
1. Copy the structure from an existing service page component (e.g., `/src/components/services/home-office-setup.tsx` if it exists, or use the general service page pattern)
2. Use the service data from `services.ts` for the new `office-transformation` slug
3. Ensure the page displays:
   - Service name, H1, answer, outcome
   - Best for list
   - Includes list
   - Process steps
   - FAQ section
   - Pricing cards (using the 3 tiers from pricing.ts)
   - Booking integration (Cal.com event type to be created)
4. Add schema markup for LocalBusiness service
5. Ensure mobile responsiveness and proper styling

**Action**: Create the component file with all necessary imports and structure.

---

## TASK 2: Create Cal.com Event Type for Office Transformation

**Cal.com Setup Required**:

1. **Create New Event Type**:
   - Event Name: `Office Transformation Consultation`
   - Slug: `office-transformation-consultation`
   - Duration: `30 minutes` (longer than home office due to complexity)
   - Location: `In Person`

2. **Booking Questions** (add in Advanced → Questions):
   - What type of space needs transformation? (Office, Warehouse, Medical, School, Retail, Other)
   - Approximate square footage? (Under 1,000, 1,000-3,000, 3,000-5,000, 5,000+)
   - How many workstations needed? (1-5, 6-10, 11-20, 20+)
   - Do you need security cameras? (Yes, No, Already have)
   - What's your timeline? (ASAP, Within 2 weeks, Within 1 month, Flexible)
   - What's your budget range? (Under $2,000, $2,000-$4,000, $4,000-$6,000, $6,000+)
   - Your phone number (required)
   - Your email (required)

3. **Availability Settings**:
   - Timezone: Eastern Time (ET)
   - Minimum booking notice: 24 hours
   - Maximum booking notice: 8 weeks
   - Buffer: 30 minutes before/after
   - Working hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM

4. **Redirect Configuration**:
   - After booking redirect: `https://ceoturbo.com/booked?service=office-transformation`
   - This fires the `book_call` tracking event

5. **Webhook** (optional but recommended):
   - URL: `https://ceoturbo.com/api/calcom-webhook`
   - Events: `booking.created`, `booking.cancelled`

**Action**: Provide the exact Cal.com setup instructions as a markdown section in the response.

---

## TASK 3: Verify Tracking Configuration

**Critical**: Ensure all tracking is correctly set up to measure:
1. **Phone call clicks** (tap-to-call buttons)
2. **Scheduled call bookings** (Cal.com conversions)
3. **Form submissions** (if any lead forms are added)

**Files to Check**:

1. **GA4 Configuration** (`/src/config/analytics.ts` or similar):
   - Verify `book_call` event is defined
   - Verify `phone_call_click` event is defined
   - Ensure conversion values are set (use $2,999 as average for office transformation)

2. **Google Tag Manager** (check dataLayer pushes):
   - Verify event triggers exist for phone clicks
   - Verify booking confirmation page triggers `book_call` event
   - Check that Cal.com webhook fires conversion events

3. **Meta Pixel & Conversions API**:
   - Verify `book_call` event is mapped in Meta
   - Verify `Contact` event for phone clicks
   - Check Conversions API is configured for deduplication

4. **Microsoft Ads (Bing) UET**:
   - Verify UET tag is firing on all pages
   - Verify custom events for bookings and phone calls

**Action**: Audit each tracking system and list any missing configurations or issues found.

---

## TASK 4: Update Service Page Routing

**File to modify**: Check the routing configuration (likely in `/src/App.tsx` or a routes file)

**Requirements**:
1. Add route for `/services/office-transformation`
2. Ensure it uses the new component created in Task 1
3. Verify the route is accessible and renders correctly

**Action**: Update routing configuration and test the route.

---

## TASK 5: Update Navigation

**Files to check**: `/src/config/headers.ts` or navigation component

**Requirements**:
1. Add "Office Transformation" to the services dropdown or navigation
2. Ensure it links to `/services/office-transformation`
3. Verify it appears in the correct order (after Home Office Setup)

**Action**: Update navigation configuration.

---

## TASK 6: Create Ad Campaign Guidance Document

**File to create**: `/docs/office-transformation-ads-guide.md`

**Content Requirements**:

1. **Meta Ads (Facebook/Instagram)**:
   - Recommended ad formats (Feed 1080x1350, Stories/Reels 1080x1920)
   - Target audiences (Georgia-based business owners, new businesses, office relocations)
   - Ad copy templates (3-5 variations)
   - Budget recommendations ($20-50/day starting)
   - Conversion tracking setup reminder

2. **Google Ads**:
   - Keyword strategy (office setup Georgia, office build-out Atlanta, etc.)
   - Negative keywords to avoid
   - Location targeting (Georgia cities: Atlanta, Athens, Gainesville, Newnan, Covington, etc.)
   - Ad copy templates
   - Call extension setup

3. **Microsoft Ads (Bing)**:
   - Similar to Google Ads but with Bing-specific optimizations
   - Import from Google Ads where possible

4. **Tracking Verification Checklist**:
   - GA4 events firing
   - Meta conversions recording
   - Microsoft UET events recording
   - Cal.com webhook confirmed
   - Phone call tracking working

**Action**: Create comprehensive ad campaign guidance document.

---

## TASK 7: SEO & Schema Markup

**Requirements**:

1. **Add to sitemap**: Ensure `/services/office-transformation` is in the sitemap
2. **Schema markup**: Add structured data for:
   - LocalBusiness service
   - Offer (with pricing)
   - FAQPage
3. **Meta tags**: Verify title, description, and Open Graph tags are set
4. **Internal linking**: Add links from:
   - Home page services section
   - Related service pages (home-office-setup)
   - Pricing page

**Action**: Implement SEO enhancements and verify schema markup.

---

## DELIVERABLES CHECKLIST

After completing all tasks, provide:

1. ✅ Service page component created at `/src/components/services/office-transformation.tsx`
2. ✅ Cal.com setup instructions document
3. ✅ Tracking audit report (list any issues found or confirm all is working)
4. ✅ Routing configuration updated
5. ✅ Navigation updated
6. ✅ Ad campaign guidance document at `/docs/office-transformation-ads-guide.md`
7. ✅ SEO enhancements implemented
8. ✅ Test confirmation (route loads, booking flow works, tracking fires)

---

## EXECUTION ORDER

Execute tasks in this exact order:
1. Task 1 (Create service page component)
2. Task 2 (Cal.com setup instructions)
3. Task 3 (Tracking verification)
4. Task 4 (Routing update)
5. Task 5 (Navigation update)
6. Task 6 (Ad campaign guidance)
7. Task 7 (SEO & schema)
8. Final verification

**Important**: After each task, briefly confirm completion before moving to the next. If you encounter an error or missing file, note it and continue with dependent tasks if possible.

---

## NOTES

- All pricing is one-time with no monthly fees
- Service area: Atlanta metro and up to 2 hours from Duluth, GA
- 30-day installation warranty on all work
- Professional cleaning included in every package

Begin implementation now.
