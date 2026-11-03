# Claude Sonnet Prompt - Complete Home Office Setup Implementation

You are an expert full-stack developer and digital marketing specialist. Your task is to complete the implementation of a new "Home Office & Computer Setup" service for CEO Turbo's website. This is a local service business targeting the Atlanta metro area.

## Context

CEO Turbo is a digital marketing agency that also provides local services. We're adding a new service: professional home office and computer setup for Atlanta metro area residents and businesses. The service includes desk/chair assembly, computer setup, network configuration, software installation, and complete workspace organization.

## Current Implementation Status

✅ **COMPLETED:**
- Service page content added to `src/content/services.ts` (slug: "home-office-setup")
- Pricing structure added to `src/content/pricing.ts` (4 pricing tiers: $89, $149, $249, $349)
- Meta Pixel tracking already implemented (Pixel ID: 3232222473609236)
- Google Ads tracking already implemented (GTM-KRPRZ67Z)
- Microsoft UET tracking already implemented
- Call tracking already implemented (tel: links fire click_to_call events)
- Booking tracking already implemented (book_call events)

⏳ **REMAINING TASKS:**
1. Add phone number (678-558-4327) to the service page with click-to-call tracking
2. Create Cal.com booking event with optimized conversion questions
3. Add smooth animations and UX enhancements to the service page
4. Ensure mobile-responsive design is optimized
5. Add service area visualization (cities list)
6. Test all tracking events on the new service page
7. Create location-specific landing pages for major cities (optional phase 2)

## Your Implementation Tasks

### Task 1: Add Phone Number with Tracking

**Location:** The service detail page component (you'll need to find/create it)

**Requirements:**
- Add phone number: 678-558-4327
- Use tel: link format: `tel:6785584327`
- Add data attribute: `data-call-location="home-office-service-page"`
- The existing tracking system in `src/lib/track.ts` will automatically fire `click_to_call` event
- Style prominently on mobile (tap-to-call button)
- Style appropriately on desktop (visible phone number)

**Implementation:**
```tsx
<a href="tel:6785584327" data-call-location="home-office-service-page" className="tap-to-call-button">
  678-558-4327
</a>
```

### Task 2: Cal.com Booking Integration

**Note:** The Google Workspace MCP had permission issues, so you'll need to provide manual instructions.

**Requirements:**
- Create a NEW Cal.com event type (separate from existing Brand Boost booking)
- Event name: "Home Office Setup Consultation"
- Duration: 15 minutes
- Phone: 678-558-4327

**Booking Questions (Copy These Exactly):**

1. **What type of setup do you need?**
   - Basic computer setup (single device)
   - Full home office setup (furniture + tech)
   - Business office setup (multiple workstations)
   - School computer lab setup
   - Not sure - need consultation

2. **How many devices need setup?**
   - 1 device
   - 2-3 devices
   - 4-10 devices
   - 10+ devices

3. **What's your location?**
   - Atlanta (proper)
   - Decatur area
   - North Atlanta (Sandy Springs, Buckhead, etc.)
   - East Atlanta (Stone Mountain, etc.)
   - Gwinnett County (Duluth, Lawrenceville, etc.)
   - Cobb County (Marietta, Kennesaw, etc.)
   - Other (specify)

4. **Do you already have the equipment?**
   - Yes, I have everything
   - No, I need recommendations
   - Partially - need to purchase some items

5. **What's your timeline?**
   - ASAP / Emergency
   - This week
   - Within 2 weeks
   - Flexible / Planning ahead

6. **What's your budget range?**
   - Under $150
   - $150-$300
   - $300-$500
   - $500+ (larger projects)

7. **Any special requirements?**
   - Senior accessibility needs
   - Disability accommodations
   - Mac/iPhone setup needed
   - Specific software requirements
   - Cable management priority
   - Other (describe)

**Cal.com Settings:**
- Time zone: Eastern Time (ET)
- Buffer time: 15 minutes before/after
- Minimum booking notice: 4 hours
- Maximum booking notice: 4 weeks
- Cancellation policy: 24 hours notice required

**Integration:**
- Once created, add the Cal.com embed URL to the service page
- Use the existing booking component pattern from other service pages
- Ensure the booking fires the `book_call` event (already implemented in track.ts)

### Task 3: Service Page Animations & UX

**Location:** Service detail page component

**Requirements:**
- Use Framer Motion (already installed in package.json)
- Add smooth fade-in animations for content sections
- Add hover effects on pricing cards
- Add scroll-triggered animations for process steps
- Ensure animations are performant (60fps)
- Mobile-optimized (reduce animation complexity on mobile)

**Animation Pattern:**
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

**Specific Animations to Add:**
1. Hero section: Fade in + slide up
2. Service includes list: Staggered fade-in for each item
3. Process steps: Scroll-triggered fade-in
4. Pricing cards: Hover lift effect + scale
5. FAQ accordion: Smooth expand/collapse
6. Testimonials (if added): Carousel with smooth transitions

### Task 4: Mobile Optimization

**Requirements:**
- Ensure phone number is tap-to-call on mobile
- Sticky booking button on mobile (bottom of screen)
- Optimized font sizes for mobile readability
- Touch-friendly spacing (minimum 44px tap targets)
- Fast load time on mobile (lazy load images)
- Mobile-specific layout (stack content vertically)

**Mobile-Specific Features:**
```tsx
{/* Mobile sticky booking button */}
<div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
  <a href="tel:6785584327" className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-lg font-semibold">
    Call 678-558-4327
  </a>
</div>
```

### Task 5: Service Area Visualization

**Requirements:**
- Add a section listing all cities served
- Group by region (Atlanta proper, inner ring, mid ring)
- Make it scannable (not a wall of text)
- Consider adding a simple map visualization (optional)
- Highlight "Up to 2 hours from Duluth" for larger projects

**City List to Display:**

**Primary Service Area (50-mile radius):**
- Atlanta, Decatur, Buckhead, Sandy Springs, Marietta, Smyrna, Roswell, Alpharetta, Johns Creek, Duluth, Norcross, Lawrenceville, Stone Mountain, Athens, Gwinnett County

**Extended Area (Up to 2 hours from Duluth):**
- All cities within 50-mile radius of Atlanta
- Special note: Athens (60 miles) available for larger projects

**Implementation:**
```tsx
<section className="section">
  <h2>Areas We Serve</h2>
  <p>We serve the entire Atlanta metro area within a 50-mile radius, plus extended service up to 2 hours from Duluth for larger projects.</p>
  
  <div className="grid md:grid-cols-3 gap-6">
    <div>
      <h3>Atlanta Metro</h3>
      <ul>
        <li>Atlanta</li>
        <li>Decatur</li>
        <li>Buckhead</li>
        {/* ... */}
      </ul>
    </div>
    {/* ... other regions */}
  </div>
</section>
```

### Task 6: Tracking Verification

**Requirements:**
- Test that tel: links fire `click_to_call` event
- Test that Cal.com booking fires `book_call` event
- Verify GA4 receives events
- Verify Meta Pixel receives events
- Verify Google Ads receives conversions
- Verify Microsoft Ads receives conversions

**Testing Steps:**
1. Open browser DevTools → Network tab
2. Click phone number → Look for fbq track call
3. Look for dataLayer push with event: "click_to_call"
4. Open Cal.com booking → Complete test booking
5. Look for dataLayer push with event: "book_call"
6. Check GA4 Realtime reports
7. Check Meta Events Manager

### Task 7: SEO & Schema Markup

**Requirements:**
- Add LocalBusiness schema markup
- Add Service schema markup
- Add AreaServed schema (list of cities)
- Add PriceSpecification schema (pricing)
- Ensure meta title and description are optimized

**Schema Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "CEO Turbo - Home Office Setup",
  "telephone": "678-558-4327",
  "areaServed": [
    "@type": "City",
    "name": "Atlanta"
  ],
  "priceRange": "$89-$349"
}
```

## Google Ads Policy Compliance - CRITICAL

**MUST FOLLOW:**
- ✅ Use "setup", "installation", "configuration" language
- ❌ NEVER use "repair", "fix", "troubleshoot", "technical support"
- ❌ NEVER mention virus removal, data recovery, account recovery
- ✅ Focus on B2B setup services (allowed category)
- ✅ Landing page clearly states setup services (already done)

**Allowed Ad Copy Examples:**
- "Home Office Setup Atlanta - From $89"
- "Computer Installation Service - Professional Setup"
- "Business Office Setup - Multiple Workstations"
- "Desk & Chair Assembly + Tech Setup"

**Prohibited Ad Copy Examples:**
- "Computer Repair Atlanta" ❌
- "Tech Support Services" ❌
- "Virus Removal" ❌
- "Fix My Computer" ❌

## Pricing Strategy

**Our Pricing (Flat Quoted Prices):**
- Basic Computer Setup: $89 
- Full Home Office Setup: $149 
- Business Office Setup: $249 
- School Computer Lab Setup: $349 

**Display Pricing Prominently:**
- Show pricing in service page
- No hidden fees
- Transparent value proposition

## Keyword Strategy for Ads

**Primary Keywords:**
- "home office setup Atlanta"
- "computer setup service"
- "office furniture assembly"
- "business computer installation"
- "network setup Atlanta"

**Negative Keywords:**
- -repair, -fix, -troubleshoot, -virus, -malware, -data recovery

## File Structure

**Files to Modify:**
1. `src/content/services.ts` - ✅ Already done
2. `src/content/pricing.ts` - ✅ Already done
3. Service detail page component - ⏳ Need to find/create
4. Any routing files - ⏳ May need to add route

**Files to Create:**
1. None required (using existing patterns)

## Testing Checklist

Before marking complete, verify:
- [ ] Service page renders correctly
- [ ] Phone number displays and is clickable
- [ ] Phone number fires click_to_call event
- [ ] Cal.com booking embed loads
- [ ] Booking fires book_call event
- [ ] All 4 pricing tiers display correctly
- [ ] Service area list displays correctly
- [ ] Mobile view is optimized
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] Tracking verified in DevTools
- [ ] Schema markup validates
- [ ] Page loads under 3 seconds

## Success Metrics

**Conversion Goals:**
- Phone call click rate: >5% of page visitors
- Booking completion rate: >3% of page visitors
- Time on page: >2 minutes
- Bounce rate: <60%

**Ad Performance Targets (once ads launch):**
- Cost per call: <$15
- Cost per booking: <$25
- Conversion rate: >10% from landing page

## Additional Notes

- The existing tracking infrastructure is robust - leverage it
- Follow existing code patterns from other service pages
- Maintain consistency with CEO Turbo's design system
- Focus on conversion optimization (phone calls and bookings)
- The service page should feel premium and trustworthy
- Emphasize the "we come to you" convenience factor
- Highlight that we serve seniors and those with accessibility needs

## Final Deliverable

Provide a summary of:
1. What files were modified
2. What new components were created
3. How the phone number was integrated
4. How Cal.com was integrated (with booking URL)
5. What animations were added
6. How mobile optimization was implemented
7. Any issues encountered and how they were resolved
8. Next steps for the user (Cal.com setup, ad campaign creation)

---

**Begin implementation now. Work through each task systematically. Test thoroughly before moving to the next task. Ask for clarification if anything is unclear.**
