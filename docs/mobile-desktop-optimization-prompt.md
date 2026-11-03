# Mobile/Desktop Conversion Optimization Prompt

**Goal:** Optimize the website so mobile users prioritize phone calls and desktop users prioritize online booking, while keeping both options visible on all devices.

---

## CURRENT SITUATION ANALYSIS

**Current Implementation:**
- Phone/text CTAs are shown for "call-first" services (home-office-setup, apartment-home-office-setup, school-computer-room-setup, dj-studio-setup, office-transformation)
- Booking CTAs shown for other services
- Same CTAs on both mobile and desktop

**Problem:**
- Mobile users can't easily call from desktop (no phone)
- Desktop users should prioritize booking (more likely to plan ahead)
- Both options should remain available on all devices

---

## OPTIMIZATION STRATEGY

### MOBILE DEVICES (< 768px)

**Primary CTA:** Phone Call
**Secondary CTA:** Text Message
**Tertiary CTA:** Booking (if available)

**Rationale:**
- Mobile users have phone in hand
- Immediate need = immediate call
- Older demographic prefers voice
- Lower screen real estate = fewer CTAs

**Implementation:**
1. **Hero Section:**
   - Large phone button: "Call 678-558-4327"
   - Secondary text button: "Text for Quote"
   - Booking button smaller or moved down

2. **Sticky Mobile Bar:**
   - Always visible at bottom
   - Phone icon + number
   - Tap to call
   - High contrast

3. **Pricing Section:**
   - Phone CTA prominent
   - "Call for flat quote"

4. **Footer:**
   - Phone number large and tappable

### DESKTOP DEVICES (≥ 768px)

**Primary CTA:** Online Booking
**Secondary CTA:** Phone Call
**Tertiary CTA:** Text Message

**Rationale:**
- Desktop users planning ahead
- More time to browse and book
- Larger screen = more CTAs acceptable
- Booking captures more data

**Implementation:**
1. **Hero Section:**
   - Large booking button: "Book Free Consultation"
   - Secondary phone button: "Or call 678-558-4327"
   - Text option smaller

2. **Pricing Section:**
   - Booking CTA: "Which do I need? Get my free plan"
   - Phone CTA: "Call for flat quote" (secondary)

3. **Sticky Header:**
   - Phone number visible but not dominant
   - Booking CTA more prominent

---

## IMPLEMENTATION INSTRUCTIONS

### Step 1: Update ServicePage.tsx

**File:** `/src/pages/ServicePage.tsx`

**Add device detection:**
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
```

**Update hero CTA section:**
```typescript
<div className="mt-8 flex flex-col gap-3 sm:flex-row">
  {isHomeOffice || isOfficeTransform ? (
    <>
      {isMobile ? (
        // Mobile: Phone first, text second
        <>
          <a href={SITE.phone.href} data-call-location={`${s.slug}-hero-mobile`} className="btn-ignite flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Call {SITE.phone.display}
          </a>
          <a href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent(isOfficeTransform ? "Hi, I'd like a quote for an office build-out." : `Hi, I'd like a quote for ${s.short.toLowerCase()}.`)}`} data-call-location={`${s.slug}-hero-text-mobile`} className="btn-chrome flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Text for a quote
          </a>
        </>
      ) : (
        // Desktop: Booking first, phone second
        <>
          <BookButton note={note} prefill={prefill} className="btn-ignite">
            Book Free Consultation
          </BookButton>
          <a href={SITE.phone.href} data-call-location={`${s.slug}-hero-desktop`} className="btn-chrome flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Or call {SITE.phone.display}
          </a>
        </>
      )}
    </>
  ) : (
    <BookButton note={note} prefill={prefill}>Book a free call about {s.short}</BookButton>
  )}
  <a href="#included" className="btn-chrome">
    What's included
  </a>
</div>
```

**Update pricing section CTA:**
```typescript
{isHomeOffice || isOfficeTransform ? (
  <>
    {isMobile ? (
      <a href={SITE.phone.href} data-call-location={`${s.slug}-pricing-mobile`} className="btn-ignite mt-6 inline-flex items-center gap-2">
        <Phone className="h-4 w-4" />
        Call for a flat quote
      </a>
    ) : (
      <>
        <BookButton note={`${note} — pricing`} className="btn-ignite mt-6">
          Which do I need? Get my free plan
        </BookButton>
        <a href={SITE.phone.href} data-call-location={`${s.slug}-pricing-desktop`} className="btn-chrome mt-6 ml-4 inline-flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Or call for a quote
        </a>
      </>
    )}
  </>
) : (
  <BookButton note={`${note} — pricing`} className="mt-6">
    Which do I need? Get my free plan
  </BookButton>
)}
```

### Step 2: Create Sticky Mobile Call Bar

**File:** `/src/components/site/MobileCallBar.tsx` (new file)

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

**Add to Layout.tsx:**
```typescript
import { MobileCallBar } from "@/components/site/MobileCallBar";

// In the Layout component, before closing body tag:
{isMobile && <MobileCallBar />}
```

### Step 3: Update Header for Desktop

**File:** `/src/components/site/Header.tsx`

**Desktop header:**
- Make booking CTA more prominent
- Keep phone number visible but smaller
- Add "Book" button to nav

### Step 4: Add Responsive CSS Classes

**Ensure Tailwind responsive classes:**
- `md:hidden` for mobile-only elements
- `hidden md:block` for desktop-only elements
- `flex-col sm:flex-row` for responsive layouts

---

## TRACKING UPDATES

**New tracking attributes:**
- `hero-mobile` vs `hero-desktop`
- `pricing-mobile` vs `pricing-desktop`
- `sticky-mobile-bar`

**Purpose:** Measure which device converts better via which CTA

---

## TESTING CHECKLIST

- [ ] Mobile shows phone CTA first
- [ ] Desktop shows booking CTA first
- [ ] Both options remain visible on both devices
- [ ] Sticky mobile bar appears on mobile only
- [ ] Header optimized for desktop booking
- [ ] Tracking attributes correct
- [ ] Test on actual mobile device
- [ ] Test on desktop (various screen sizes)
- [ ] Test tablet (768px breakpoint)

---

## EXPECTED OUTCOMES

**Mobile:**
- Higher phone call conversion rate
- Faster time to conversion
- Better for older demographic
- Higher conversion from ads

**Desktop:**
- Higher booking conversion rate
- More qualified leads (data capture)
- Better for business/school clients
- Higher average order value

**Overall:**
- Total conversions increase
- Better user experience
- Device-appropriate CTAs
- Improved conversion rate

---

## NOTES

- Breakpoint: 768px (standard Tailwind `md:` breakpoint)
- Use CSS media queries for reliable device detection
- Test on real devices, not just browser resize
- Consider tablet as "desktop" for booking priority
- Keep phone option visible on desktop (some still prefer calling)
