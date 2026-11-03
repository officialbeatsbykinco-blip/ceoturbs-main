# Claude Sonnet Prompt #1: Complete Site Optimization & Implementation

**Goal:** Optimize the CEO Turbo website for conversions, simplify for older/low-IQ audience, implement mobile/desktop CTAs, and prepare for Google Ads launch.

**Credit Conservation:** Read entire prompt once, execute sequentially, ask only when absolutely necessary.

---

## CONTEXT

CEO Turbo provides office transformation and home office setup services in the Atlanta metro area. The website needs optimization for:
1. Older adults and lower technical literacy users
2. Mobile-first phone call conversions
3. Desktop-first booking conversions
4. Google Ads readiness ($5/day budget)
5. High-converting landing pages for residential and business clients

**Current Services:**
- Office transformation (labor-only, $1,499-$4,999)
- Apartment & home office setup ($89-$149)
- School & computer room setup ($349+)
- DJ & studio setup ($149+)

**Target Cities:** Atlanta metro + up to 2 hours from Duluth (Athens, Gainesville, Newnan, Covington, etc.)

**Phone:** 678-558-4327

---

## TASK 1: Simplify Service Page Content

**Files to modify:**
- `/src/content/services.ts`

**Requirements:**
1. Rewrite all service descriptions using simple language
2. Remove technical jargon (or explain in simple terms)
3. Short sentences (under 15 words)
4. Active voice only
5. One idea per sentence

**Specific rewrites needed:**

**Office Transformation:**
- Current: "CEO Turbo transforms empty spaces into fully operational offices..."
- Target: "We turn empty offices into ready-to-work spaces. We do the work: build walls, install cameras, set up internet, build computers, and clean up. You pay once for our labor. No monthly fees. You buy the materials, or give us money and we buy them for you. We serve Atlanta and nearby cities."

**All FAQs:**
- Maximum 5 questions per service
- Simple language
- Short answers (2-3 sentences)
- "Still have questions? Call us" as final answer

**Pricing summaries:**
- Change to: "Labor Only: $[price]"
- Add: "You buy materials, we do the work"

**Action:** Rewrite all service content in services.ts following these guidelines.

---

## TASK 2: Implement Mobile/Desktop CTA Optimization

**File to modify:** `/src/pages/ServicePage.tsx`

**Requirements:**
1. Add device detection (mobile < 768px, desktop ≥ 768px)
2. Mobile: Phone CTA first, Text CTA second, Booking tertiary
3. Desktop: Booking CTA first, Phone CTA second, Text tertiary
4. Update tracking attributes (hero-mobile, hero-desktop, pricing-mobile, pricing-desktop)

**Implementation:**

Add at top of component:
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
```

Update hero CTA section to conditionally render based on device.

Update pricing CTA section to conditionally render based on device.

**Action:** Implement device-based CTA rendering in ServicePage.tsx.

---

## TASK 3: Create Sticky Mobile Call Bar Component

**File to create:** `/src/components/site/MobileCallBar.tsx`

**Requirements:**
- Fixed position at bottom of screen
- Visible only on mobile (md:hidden)
- Large tappable phone button
- High contrast (turbo background, white text)
- Tracking attribute: data-call-location="sticky-mobile-bar"

**Component structure:**
```typescript
import { Phone } from "lucide-react";
import { SITE } from "@/config/site";

export function MobileCallBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-turbo p-4 md:hidden">
      <a
        href={SITE.phone.href}
        data-call-location="sticky-mobile-bar"
        className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-turbo shadow-lg"
      >
        <Phone className="h-5 w-5" />
        Call {SITE.phone.display}
      </a>
    </div>
  );
}
```

**Action:** Create MobileCallBar.tsx component.

---

## TASK 4: Add Mobile Call Bar to Layout

**File to modify:** `/src/components/site/Layout.tsx`

**Requirements:**
- Import MobileCallBar component
- Add conditional rendering (only on mobile)
- Place before closing body tag

**Implementation:**
```typescript
import { MobileCallBar } from "@/components/site/MobileCallBar";

// In the Layout component return:
{typeof window !== 'undefined' && window.innerWidth < 768 && <MobileCallBar />}
```

**Action:** Add MobileCallBar to Layout.tsx.

---

## TASK 5: Increase Font Sizes for Readability

**File to modify:** `/src/index.css` or component-specific CSS

**Requirements:**
- Body text: minimum 18px (currently likely 16px)
- Headings: minimum 24px (h3), 32px (h2), 48px (h1)
- Line height: 1.6 for body text
- Higher contrast for text

**Action:** Update CSS with larger font sizes and better contrast.

---

## TASK 6: Simplify Navigation

**File to modify:** `/src/components/site/Header.tsx`

**Requirements:**
- Reduce menu items to: Services, Pricing, About, Contact
- Add large phone button in header (desktop)
- Clear labels (no clever/cute names)
- Mobile: Simplified hamburger menu with phone button prominent

**Action:** Simplify Header.tsx navigation.

---

## TASK 7: Add Breadcrumbs to Service Pages

**File to modify:** `/src/pages/ServicePage.tsx`

**Requirements:**
- Breadcrumbs already exist (Breadcrumbs component)
- Ensure they're visible and clear
- Add "Back to Home" link if not present

**Action:** Verify breadcrumbs are working correctly.

---

## TASK 8: Optimize Pricing Cards Visuals

**File to check:** `/src/components/blocks/PriceBlocks.tsx`

**Requirements:**
- Large price numbers (48px+)
- "Labor Only" label prominent
- Checkmarks for included items
- Simple comparison
- "Call for exact quote" CTA

**Action:** Review and optimize PriceBlocks.tsx if needed.

---

## TASK 9: Verify Tracking Configuration

**Files to check:**
- `/src/lib/track.ts`
- `/src/lib/gtm.ts`

**Requirements:**
- Verify click_to_call event is configured
- Verify book_call event is configured
- Verify new tracking attributes (hero-mobile, hero-desktop, etc.) will work
- Verify phone call tracking is active

**Action:** Audit tracking configuration and report any issues.

---

## TASK 10: Prepare Landing Pages for Google Ads

**High-converting pages to identify:**
1. `/services/office-transformation` - Business clients
2. `/services/home-office-setup` - Residential clients
3. `/services/apartment-home-office-setup` - Apartment dwellers
4. `/services/school-computer-room-setup` - Schools
5. `/services/dj-studio-setup` - Artists/DJs

**Requirements:**
- Each page has clear phone CTA
- Each page has pricing visible
- Each page has service area mentioned
- Each page has trust signals (warranty, reviews)
- Mobile-optimized

**Action:** Review each service page and note any optimization needs.

---

## TASK 11: Create Simple "Get a Quote" Form (Optional)

**If time permits:**
- Create a simple form on contact page
- Fields: Name, Phone, Service needed, City
- Submit sends email or SMS notification
- Alternative to phone call

**Action:** Only if time permits and user requests it.

---

## TASK 12: Test Mobile Responsiveness

**Testing checklist:**
- [ ] Sticky call bar appears on mobile only
- [ ] Phone CTA is first on mobile
- [ ] Booking CTA is first on desktop
- [ ] Font sizes are readable on mobile
- [ ] All buttons are tappable (44x44px minimum)
- [ ] Navigation works on mobile
- [ ] Page loads quickly on mobile

**Action:** Test on mobile device or browser dev tools.

---

## DELIVERABLES CHECKLIST

After completing all tasks, provide:

1. ✅ Simplified service content in services.ts
2. ✅ Mobile/desktop CTA optimization in ServicePage.tsx
3. ✅ MobileCallBar.tsx component created
4. ✅ MobileCallBar added to Layout.tsx
5. ✅ Font sizes increased in CSS
6. ✅ Navigation simplified in Header.tsx
7. ✅ Breadcrumbs verified
8. ✅ Pricing cards optimized
9. ✅ Tracking configuration audited
10. ✅ Landing pages reviewed for Google Ads
11. ✅ Mobile responsiveness tested
12. ✅ Summary of changes made

---

## EXECUTION ORDER

Execute tasks in this exact order:
1. Task 1 (Simplify content)
2. Task 2 (Mobile/desktop CTAs)
3. Task 3 (Mobile call bar component)
4. Task 4 (Add to layout)
5. Task 5 (Font sizes)
6. Task 6 (Navigation)
7. Task 7 (Breadcrumbs)
8. Task 8 (Pricing cards)
9. Task 9 (Tracking audit)
10. Task 10 (Landing pages)
11. Task 11 (Optional form)
12. Task 12 (Mobile testing)

**Important:** After each task, briefly confirm completion before moving to the next.

---

## NOTES

- Target audience: Older adults (45-75+) and lower technical literacy
- Primary conversion: Phone calls (mobile), Bookings (desktop)
- Secondary conversion: Text messages
- Service area: Atlanta metro + 2 hours from Duluth
- Budget: $5/day Google Ads (low budget = high efficiency needed)
- Pricing: Labor-only, materials not included
- Warranty: 30-day installation warranty
- Phone: 678-558-4327

Begin implementation now.
