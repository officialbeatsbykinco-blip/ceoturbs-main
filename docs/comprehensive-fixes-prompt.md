# Claude Sonnet Prompt: Comprehensive Site Fixes (Pricing, Navigation, Mobile, Compliance)

## EXECUTE ALL CHANGES IN THIS ORDER - DO NOT SKIP STEPS

---

## STEP 1: FIX PRICING (20% Cheaper Than Competitors)

**Current Problem**: Prices are too cheap. Research competitor pricing and set prices at 20% below market rate.

**Files to update**:
- `/src/content/services.ts` - Update pricing in service descriptions
- `/src/content/pricing.ts` - Update pricing tiers

**Competitor Research Required**:
1. Office transformation services in Atlanta metro
2. Home office setup services
3. Computer build services
4. DJ studio setup services

**Pricing Strategy**:
- Research 3-5 competitors for each service category
- Calculate average competitor price
- Set CEO Turbo price at 20% below average
- Update all pricing mentions in service descriptions
- Update pricing page tiers

**Example Calculation**:
- Competitor average: $2,000
- CEO Turbo price: $2,000 × 0.80 = $1,600

**Services to update**:
1. Office transformation: Currently $1,499-$4,999 → Research and adjust
2. Home office setup: Currently $89-$149 → Research and adjust
3. Apartment office setup: Currently $89-$149 → Research and adjust
4. School computer room: Currently $349+ → Research and adjust
5. DJ studio setup: Currently $149+ → Research and adjust
6. Computer build: Currently not priced → Research and set

**Action**: Update all pricing in services.ts with new competitive pricing (20% below market).

---

## STEP 2: REORGANIZE NAVIGATION SERVICES TAB

**Current Problem**: Services dropdown is cluttered and not organized intelligently.

**File**: `/src/components/site/Header.tsx` (MENUS array, lines 18-59)

**Current Structure**:
- Services dropdown shows ALL services in a flat list
- No categorization or grouping
- Hard to find relevant services

**Required Reorganization**:
Group services by category with clear sections:

```
Services
├── Office & Workspace
│   ├── Office transformation
│   ├── Home office setup
│   ├── Apartment office setup
│   └── School computer room
├── Tech & Equipment
│   ├── Computer build
│   ├── DJ studio setup
│   └── [other tech services]
├── Marketing & Growth
│   ├── Meta ads
│   ├── Google ads
│   └── [other marketing services]
└── [other categories as needed]
```

**Implementation**:
1. Add category headers to MENUS items array
2. Group services by logical category
3. Use visual separators or subheadings
4. Keep "wide: true" for dropdown
5. Test on mobile (ensure categories collapse or stack properly)

**Code Structure Example**:
```tsx
{
  label: "Services",
  to: "/services",
  wide: true,
  items: [
    // Category header
    { label: "Office & Workspace", header: true },
    { to: "/services/office-transformation", label: "Office transformation", sub: "Complete build-out from $1,600" },
    { to: "/services/home-office-setup", label: "Home office setup", sub: "Desk & computer from $120" },
    // Category header
    { label: "Tech & Equipment", header: true },
    { to: "/services/computer-build-setup", label: "Computer build", sub: "Custom PC assembly" },
    // ... etc
  ]
}
```

**Mobile Consideration**:
- On mobile, categories should be collapsible or use accordion
- Or stack categories with clear visual separation
- Test on 375px width

---

## STEP 3: FIX NAVIGATION OVERLAPPING ISSUE

**File**: `/src/components/site/Header.tsx`

**Problem**: Services dropdown overlaps with other navigation elements.

**Fix**:
1. Check dropdown width (currently `w-[560px]` for wide dropdowns)
2. Ensure dropdown has proper z-index
3. Check positioning - ensure it doesn't extend beyond viewport
4. Test on tablet (768px) and desktop (1024px+)
5. May need to reduce width or adjust grid layout

**CSS to check in `/src/index.css`**:
- Dropdown positioning styles
- Z-index values
- Overflow handling

---

## STEP 4: AUDIT & FIX ALL PAGES FOR MOBILE/DESKTOP OPTIMIZATION

**Files to audit**:
- `/src/pages/Home.tsx`
- `/src/pages/ServicePage.tsx`
- `/src/pages/*.tsx` (all page files)
- `/src/components/site/Header.tsx`
- `/src/components/site/MobileActionBar.tsx`

**Mobile Optimization Checklist**:
- [ ] No horizontal scroll on 375px width
- [ ] Text is readable without zooming (min 16px)
- [ ] Buttons are tappable (min 44px height)
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Images scale properly (max-width: 100%)
- [ ] Tables scroll horizontally if needed
- [ ] Forms are mobile-friendly
- [ ] CTAs are prominent and clickable
- [ ] Sticky elements don't cover content
- [ ] Touch targets have adequate spacing

**Desktop Optimization Checklist**:
- [ ] Content centers properly on 1920px screens
- [ ] No horizontal scroll on desktop
- [ ] Hover states work correctly
- [ ] Dropdowns don't overlap
- [ ] Images display at appropriate sizes
- [ ] Spacing is consistent
- [ ] Footer stays at bottom if content is short

**Responsive Breakpoints to Test**:
- Mobile: 375px, 414px
- Tablet: 768px, 834px
- Desktop: 1024px, 1440px, 1920px

**Common Issues to Fix**:
- Fixed widths causing overflow → use max-width or percentage
- Text too small on mobile → use responsive font sizes
- Buttons too small → increase padding/height
- Images not scaling → add `max-width: 100%`
- Tables breaking → wrap in scrollable container

---

## STEP 5: GOOGLE ADS COMPLIANCE

**File**: `/index.html`

**Google Ads Requirements**:
1. **Privacy Policy** - Must be accessible from footer
2. **Terms of Service** - Must be accessible from footer
3. **Contact Information** - Phone, email, address visible
4. **Clear Pricing** - Prices displayed on service pages
5. **No Misleading Claims** - No "guaranteed results" or unrealistic promises
6. **Refund Policy** - Clear refund/cancellation terms
7. **Site Functionality** - All links work, no broken pages

**Checklist**:
- [ ] Privacy policy link in footer
- [ ] Terms of service link in footer
- [ ] Contact page with phone, email, address
- [ ] Pricing page with clear prices
- [ ] No "guaranteed" language in ads or pages
- [ ] Refund/cancellation policy stated
- [ ] All internal links work (404 check)
- [ ] External links open in new tab with rel="noopener noreferrer"
- [ ] SSL certificate active (HTTPS)
- [ ] Mobile-friendly (Google Mobile-Friendly Test passes)

**Files to update if missing**:
- Footer component (add policy links)
- Contact page (ensure complete info)
- Service pages (remove any non-compliant claims)

---

## STEP 6: MICROSOFT ADVERTISING (BING) COMPLIANCE

**File**: `/index.html`

**Microsoft Ads Requirements**:
1. **UET Tag** - Universal Event Tracking tag installed
2. **Privacy Policy** - Same as Google
3. **Terms of Service** - Same as Google
4. **Contact Information** - Same as Google
5. **Clear Pricing** - Same as Google
6. **No Misleading Claims** - Same as Google
7. **Site Functionality** - Same as Google

**Checklist**:
- [ ] UET tag script in head (check index.html)
- [ ] Privacy policy link in footer
- [ ] Terms of service link in footer
- [ ] Contact information visible
- [ ] Clear pricing on pages
- [ ] No misleading claims
- [ ] All links work
- [ ] Mobile-friendly

**UET Tag Format**:
```html
<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"YOUR_UET_ID"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>
```

**Action**: If UET tag is missing, add it to index.html head section.

---

## STEP 7: META (FACEBOOK/INSTAGRAM) COMPLIANCE

**File**: `/index.html`

**Meta Requirements**:
1. **Pixel Installed** - Meta pixel firing correctly
2. **Privacy Policy** - Same as Google/Microsoft
3. **Terms of Service** - Same as Google/Microsoft
4. **Contact Information** - Same as Google/Microsoft
5. **Clear Pricing** - Same as Google/Microsoft
6. **No Misleading Claims** - Same as Google/Microsoft
7. **Site Functionality** - Same as Google/Microsoft

**Checklist**:
- [ ] Meta pixel script in head (id=3232222473609236)
- [ ] Noscript fallback present
- [ ] Privacy policy link in footer
- [ ] Terms of service link in footer
- [ ] Contact information visible
- [ ] Clear pricing on pages
- [ ] No misleading claims
- [ ] All links work
- [ ] Mobile-friendly

---

## STEP 8: VERIFY ALL TRACKING IS WORKING

**Files**: `/index.html`, service pages

**Tracking Checklist**:
- [ ] Meta pixel fires (use Meta Pixel Helper browser extension)
- [ ] Google Tag Manager loads (use Tag Assistant)
- [ ] Google Analytics 4 tracking active
- [ ] Microsoft UET tag fires (use UET Tag Helper)
- [ ] Phone call tracking with `data-call-location` attributes
- [ ] Cal.com booking link tracking
- [ ] Form submission tracking (if any forms)
- [ ] No tracking script errors in console

**Test Conversions**:
1. Click phone number → verify call tracking fires
2. Click text link → verify event fires
3. Click Cal.com booking → verify event fires
4. Navigate between pages → verify pageview tracking

---

## STEP 9: FINAL TESTING ACROSS DEVICES

**Test on Real Devices**:
- [ ] iPhone (375px width)
- [ ] Android phone (various widths)
- [ ] iPad (768px, 834px)
- [ ] Desktop (1024px, 1440px, 1920px)

**Test Checklist**:
- [ ] Navigation works on all devices
- [ ] Services dropdown doesn't overlap
- [ ] All pages load without errors
- [ ] No horizontal scroll on mobile
- [ ] Text is readable on mobile
- [ ] Buttons are tappable on mobile
- [ ] Images scale properly
- [ ] Pricing is visible and accurate
- [ ] CTAs work (call, text, Cal.com)
- [ ] Footer links work
- [ ] Tracking fires correctly

---

## STEP 10: PUSH CHANGES AND SYNC

**Git Commands**:
```bash
git add .
git commit -m "Fix pricing (20% below market), reorganize nav services, mobile/desktop optimization, ad compliance"
git push origin main
```

**After Push**:
- Verify deployment (if using Vercel/Netlify, check dashboard)
- Test live site to ensure changes deployed
- Run Google Mobile-Friendly Test on live site
- Run Bing SEO Toolkit on live site
- Check Meta Pixel Helper on live site

---

## IMPLEMENTATION SUMMARY

Execute these changes in order:
1. **Research competitor pricing** → Update all service prices to 20% below market
2. **Reorganize navigation services** → Group by category with headers
3. **Fix navigation overlapping** → Adjust dropdown width/positioning
4. **Mobile/desktop audit** → Fix all responsive issues
5. **Google Ads compliance** → Add policies, contact info, remove non-compliant claims
6. **Microsoft Ads compliance** → Add UET tag if missing
7. **Meta compliance** → Verify pixel and policies
8. **Verify tracking** → Test all pixels and conversion events
9. **Device testing** → Test on real devices
10. **Push and sync** → Commit, push, verify deployment

**Credit Conservation**: This prompt is comprehensive but structured to minimize back-and-forth. Execute all changes systematically before asking for review.
