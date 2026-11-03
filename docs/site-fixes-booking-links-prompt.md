# Claude Sonnet Prompt: Site Fixes & Booking Links Integration

## TASK OVERVIEW
Fix critical UX issues on ceoturbo.com and integrate Cal.com booking links for office transformation services. The site has navigation overlapping issues, sizing problems, and needs conversion tracking verification.

## CRITICAL FIXES REQUIRED

### 1. Navigation Bar Overlapping Services Issue
**Problem**: The Services dropdown in the header overlaps with other navigation elements on certain screen sizes.

**Files to examine**:
- `/src/components/site/Header.tsx` (lines 18-59, MENUS array)
- `/src/index.css` (dropdown and navigation styles)

**Fix approach**:
- Check the Services dropdown width and positioning (currently `w-[560px]` for wide dropdowns)
- Ensure dropdown doesn't overlap with adjacent navigation items
- Test on mobile, tablet, and desktop breakpoints
- Consider reducing dropdown width or adjusting z-index/positioning
- The Services dropdown has `wide: true` with grid-cols-2 - verify this doesn't cause overflow

### 2. Sizing Issues Across All Pages
**Problem**: Inconsistent sizing, elements not responsive, potential overflow on mobile.

**Files to audit**:
- `/src/pages/ServicePage.tsx` - service pages
- `/src/pages/Home.tsx` - homepage
- `/src/components/site/Header.tsx` - header
- `/src/index.css` - global styles

**Fix approach**:
- Audit all sections for responsive sizing
- Check text sizes on mobile (should be readable without zooming)
- Verify images and components scale properly
- Ensure no horizontal scroll on mobile
- Test on actual device sizes: 375px, 768px, 1024px, 1440px
- Check `container-x` class usage (currently `max-w-[1200px]`)
- Verify padding and margins are consistent

### 3. Service Pages Conversion Optimization Audit
**Pages to audit**:
- https://www.ceoturbo.com/services/office-transformation
- https://www.ceoturbo.com/services/school-computer-room-setup
- https://www.ceoturbo.com/services/apartment-home-office-setup
- https://www.ceoturbo.com/services/dj-studio-setup

**Files**:
- `/src/pages/ServicePage.tsx`
- `/src/content/services.ts`

**Audit checklist**:
- [ ] Above-fold CTAs are prominent and clickable
- [ ] Phone number is visible and tap-to-call on mobile
- [ ] Pricing is clear and visible
- [ ] Trust signals (reviews, guarantees) are present
- [ ] Forms or booking options work correctly
- [ ] Mobile UX is tested and functional
- [ ] Page load speed is acceptable
- [ ] No broken links or images
- [ ] FAQ section answers common questions
- [ ] "What's included" section is comprehensive

## BOOKING LINKS INTEGRATION

### Cal.com Booking Integration
**Cal.com link**: https://cal.com/stackmodechris/ceo-turbo-office-studio-setup

**Services that need Cal.com booking**:
- Office transformation & build-out (`office-transformation`)
- School & computer room setup (`school-computer-room-setup`)
- Apartment & home office setup (`apartment-home-office-setup`)
- DJ, studio & monitor setup (`dj-studio-setup`)

**Services that use call/text ONLY**:
- Home office & computer setup (`home-office-setup`) - already has call/text

### Implementation in ServicePage.tsx

**Current structure** (lines 47-75):
```tsx
{isHomeOffice || isOfficeTransform ? (
  <>
    <a href={SITE.phone.href} className="btn-ignite">
      <Phone />
      Call {SITE.phone.display}
    </a>
    <a href={`sms:${SITE.phone.e164}?body=...`} className="btn-chrome">
      <MessageSquare />
      Text for a quote
    </a>
  </>
) : (
  <BookButton note={note} prefill={prefill}>
    Book a free call about {s.short}
  </BookButton>
)}
```

**Required changes**:
1. Update the hero section CTAs to include Cal.com link for office transformation and related services
2. Add Cal.com booking button to the pricing section (around line 137-146)
3. Add Cal.com booking to the footer CTA section (around line 214-224)
4. Update mobile action bar in `/src/components/site/MobileActionBar.tsx` to include Cal.com option

**New CTA structure for office transformation services**:
```tsx
{isHomeOffice || isOfficeTransform ? (
  <>
    <a href={SITE.phone.href} className="btn-ignite">
      <Phone />
      Call {SITE.phone.display}
    </a>
    <a href={`sms:${SITE.phone.e164}?body=...`} className="btn-chrome">
      <MessageSquare />
      Text for a quote
    </a>
    <a href="https://cal.com/stackmodechris/ceo-turbo-office-studio-setup" target="_blank" rel="noopener noreferrer" className="btn-chrome">
      Book online
    </a>
  </>
) : (
  <BookButton note={note} prefill={prefill}>
    Book a free call about {s.short}
  </BookButton>
)}
```

### Update CALL_FIRST_SLUGS in services.ts
**Current** (line 598):
```ts
export const CALL_FIRST_SLUGS = ["home-office-setup", "apartment-home-office-setup", "school-computer-room-setup", "dj-studio-setup", "office-transformation"];
```

**No change needed** - all these services should have call/text + Cal.com booking.

## TRACKING VERIFICATION

### Meta (Facebook/Instagram) Tracking
**Check in `/index.html`** (line 22):
- Verify Meta pixel is present: `id=3232222473609236`
- Confirm noscript fallback is working
- Check that pixel fires on page load

### Google Analytics & Tag Manager
**Check in `/index.html`** (lines 21-22):
- Verify GTM containers: `GTM-KH6BCWD3` and `GTM-KRPRZ67Z`
- Confirm both noscript iframes are present
- Check that GTM loads correctly

### Microsoft Advertising (Bing Ads)
**Check in `/index.html`**:
- Look for Microsoft UET tag
- Verify tracking script is present
- Check if Microsoft tracking is configured

### Conversion Tracking Setup
**Verify in service pages**:
- Phone call tracking with `data-call-location` attributes
- Form submission tracking
- Cal.com booking event tracking
- Button click tracking

**Test conversions**:
1. Test phone call tracking (click phone number)
2. Test text message tracking (click text link)
3. Test Cal.com booking (click booking link)
4. Verify events fire in respective platforms

## IMPLEMENTATION ORDER

1. **Fix navigation overlapping issue** (Header.tsx, index.css)
2. **Fix sizing issues** (audit all pages, index.css)
3. **Audit service pages** (ServicePage.tsx, services.ts)
4. **Add Cal.com booking links** (ServicePage.tsx hero, pricing, footer; MobileActionBar.tsx)
5. **Verify tracking** (index.html, test conversions)
6. **Test on all devices** (mobile, tablet, desktop)

## TESTING CHECKLIST

After implementing fixes, test:

- [ ] Navigation dropdown doesn't overlap on any screen size
- [ ] All text is readable on mobile (no horizontal scroll)
- [ ] Images and components scale properly
- [ ] Cal.com booking link opens in new tab
- [ ] Phone calls work (tel: links)
- [ ] Text messages work (sms: links)
- [ ] Meta pixel fires (check Meta Pixel Helper)
- [ ] GTM loads (check Tag Assistant)
- [ ] Microsoft tracking fires (check UET Tag Helper)
- [ ] All service pages load without errors
- [ ] Mobile action bar works correctly
- [ ] Footer CTAs are functional

## DELIVERABLES

1. Fixed navigation bar with no overlapping
2. Responsive sizing across all pages
3. Cal.com booking links integrated on office transformation services
4. Verified tracking for Meta, Google, and Microsoft
5. Tested and functional on all devices

## NOTES

- The Cal.com embed code provided in the request is for React integration - we're using direct links instead for simplicity
- All booking links should open in new tab with `target="_blank" rel="noopener noreferrer"`
- Maintain existing call/text functionality - Cal.com is an additional option, not a replacement
- Test thoroughly on actual devices, not just browser dev tools
