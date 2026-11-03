# Claude Sonnet Prompt: Fix Services Dropdown + Full Mobile/Desktop Optimization

## EXECUTE ALL CHANGES IN ONE PASS - CREDIT-EFFICIENT

---

## STEP 1: FIX SERVICES DROPDOWN - MAKE SCROLLABLE

**File**: `/src/index.css`

**Add this CSS** (at end of file or in appropriate layer):

```css
/* Scrollable dropdown for Services */
.dropdown-menu[data-wide="true"] {
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--chrome));
}
```

**Test**: Open Services dropdown on desktop, verify it scrolls when content exceeds 500px.

---

## STEP 2: AUDIT AND FIX HEADER NAVIGATION

**File**: `/src/components/site/Header.tsx`

**Check and fix**:
- Navigation links have proper padding (min 44px height on mobile)
- Dropdown trigger is tappable on mobile
- Hamburger menu works on mobile (375px)
- Logo doesn't overlap navigation on any screen size
- Navigation doesn't hide content on scroll

**Mobile-specific fixes**:
- Ensure mobile menu has adequate touch targets (min 44px)
- Check z-index - nav should sit above content
- Verify mobile menu closes when clicking outside
- Test on 375px, 414px

---

## STEP 3: AUDIT ALL PAGES FOR SIZING ISSUES

**Files to audit**:
- `/src/pages/Home.tsx`
- `/src/pages/ServicePage.tsx`
- `/src/pages/*.tsx` (all page files)
- `/src/components/site/Header.tsx`
- `/src/components/site/MobileActionBar.tsx`

**Mobile Optimization Checklist** (fix all issues):
- [ ] No horizontal scroll on 375px width
- [ ] Text is readable without zooming (min 16px)
- [ ] Buttons are tappable (min 44px height, min 44px width)
- [ ] Navigation works on mobile
- [ ] Images scale properly (max-width: 100%, height: auto)
- [ ] Tables have horizontal scroll wrapper if needed
- [ ] Forms have adequate input spacing
- [ ] CTAs are prominent and clickable
- [ ] Sticky elements don't cover content
- [ ] Touch targets have adequate spacing (min 8px between)
- [ ] No content cut off on edges
- [ ] Padding is sufficient on mobile (min 16px)

**Desktop Optimization Checklist** (fix all issues):
- [ ] Content centers properly on 1920px screens
- [ ] No horizontal scroll on desktop
- [ ] Hover states work correctly
- [ ] Dropdowns don't overlap or hide content
- [ ] Images display at appropriate sizes
- [ ] Spacing is consistent across pages
- [ ] Footer stays at bottom if content is short
- [ ] Navigation doesn't break on resize

**Common fixes needed**:
- Fixed widths → use max-width or percentage
- Text too small → use responsive font sizes (text-sm, text-base, text-lg)
- Buttons too small → increase padding (py-3, px-4) or height
- Images not scaling → add `max-w-full h-auto`
- Tables breaking → wrap in `overflow-x-auto`
- Content touching edges → add padding (px-4, px-6)
- Touch targets too close → add gap (gap-2, gap-3)

---

## STEP 4: FIX RESPONSIVE BREAKPOINTS

**Test and fix at these breakpoints**:
- Mobile: 375px, 414px
- Tablet: 768px, 834px
- Desktop: 1024px, 1440px, 1920px

**For each breakpoint**:
- Check navigation works
- Check no horizontal scroll
- Check text is readable
- Check buttons are clickable
- Check images scale
- Check no content overlap

**Tailwind classes to use**:
- Mobile-first: `text-base sm:text-lg lg:text-xl`
- Responsive spacing: `p-4 sm:p-6 lg:p-8`
- Responsive widths: `w-full sm:w-auto`
- Responsive grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## STEP 5: OPTIMIZE MOBILE ACTION BAR

**File**: `/src/components/site/MobileActionBar.tsx`

**Ensure**:
- Bar is fixed at bottom (`fixed bottom-0`)
- Has adequate padding (min 16px)
- Buttons are tappable (min 44px height)
- Doesn't overlap with Cal floating button
- Shows on relevant pages only
- Has proper z-index to sit above content
- Background is opaque (no content showing through)

**Fix if needed**:
- Adjust bottom position if Cal button overlaps
- Increase button padding if too small
- Add background color if transparent
- Check z-index (should be higher than page content)

---

## STEP 6: VERIFY ALL NAVIGATION BUTTONS

**Check all navigation elements**:
- Header navigation links
- Dropdown menu items
- Mobile hamburger menu
- Footer links
- Breadcrumb links
- Back buttons
- CTA buttons throughout site

**For each element**:
- [ ] Works on mobile (tappable)
- [ ] Works on desktop (hoverable)
- [ ] Has proper spacing
- [ ] Has adequate contrast
- [ ] Doesn't overlap other elements
- [ ] Has proper cursor (pointer on clickable)
- [ ] Has focus state for keyboard navigation

---

## STEP 7: TEST ALL PAGES ON ALL DEVICES

**Pages to test**:
- Homepage: https://www.ceoturbo.com/
- Services: https://www.ceoturbo.com/services
- Office transformation: https://www.ceoturbo.com/services/office-transformation
- Home office: https://www.ceoturbo.com/services/home-office-setup
- Apartment office: https://www.ceoturbo.com/services/apartment-home-office-setup
- Computer room: https://www.ceoturbo.com/services/school-computer-room-setup
- DJ studio: https://www.ceoturbo.com/services/dj-studio-setup
- Computer build: https://www.ceoturbo.com/services/computer-build-setup

**Test on**:
- Mobile: 375px width (iPhone SE)
- Mobile: 414px width (iPhone 12/13)
- Tablet: 768px width (iPad)
- Desktop: 1024px width (laptop)
- Desktop: 1440px width (desktop)
- Desktop: 1920px width (large desktop)

**For each page/device**:
- No horizontal scroll
- No content cut off
- Navigation works
- Buttons clickable
- Text readable
- Images scale
- No console errors

---

## STEP 8: ADD SERVICE ECOSYSTEM TO HOMEPAGE

**File**: `/src/pages/Home.tsx`

**Goal**: Showcase new services on homepage to create connected ecosystem where users discover related services.

**Add to homepage**:
1. **Service Cards Section** - Grid of key services with images/icons
   - Office transformation
   - Home office setup
   - Computer build
   - DJ studio setup
   - Each card links to service page

2. **Related Services Section** - "You might also need" section
   - Cross-link related services (e.g., office transformation → computer build)
   - Show 3-4 related services based on context

3. **Service Categories** - Quick links to service categories
   - Office & Workspace
   - Tech & Equipment
   - Marketing

**Implementation example**:
```tsx
{/* Service Cards Grid */}
<section className="section">
  <h2 className="h-section">Our Services</h2>
  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[
      { slug: 'office-transformation', name: 'Office Transformation', price: 'From $1,599', icon: 'building' },
      { slug: 'home-office-setup', name: 'Home Office', price: 'From $99', icon: 'home' },
      { slug: 'computer-build-setup', name: 'Computer Build', price: 'From $119', icon: 'cpu' },
      { slug: 'dj-studio-setup', name: 'DJ Studio', price: 'From $149', icon: 'music' },
    ].map((service) => (
      <Link key={service.slug} to={`/services/${service.slug}`} className="panel p-6 hover:border-turbo transition-colors">
        <div className="text-3xl mb-3">{/* icon */}</div>
        <h3 className="font-semibold text-lg">{service.name}</h3>
        <p className="mt-2 text-chrome">{service.price}</p>
      </Link>
    ))}
  </div>
</section>
```

**Cross-linking in service pages**:
- Add "Related Services" section to ServicePage.tsx
- Show 2-3 related services based on category
- Example: Office transformation page shows Computer build, DJ studio setup

---

## STEP 9: PUSH CHANGES

```bash
git add .
git commit -m "Fix services dropdown scroll, optimize mobile/desktop nav and sizing"
git push origin main
```

**After push**:
- Verify deployment
- Test live site on mobile and desktop
- Run Google Mobile-Friendly Test
- Check all pages load without errors

---

## IMPLEMENTATION ORDER

1. **Add scrollable CSS** to index.css for dropdown
2. **Audit Header.tsx** for mobile navigation issues
3. **Audit all pages** for sizing issues (Home.tsx, ServicePage.tsx, etc.)
4. **Fix responsive breakpoints** using Tailwind responsive classes
5. **Optimize MobileActionBar.tsx** for proper positioning
6. **Test all navigation buttons** across site
7. **Add service ecosystem to homepage** - service cards grid, related services, cross-linking
8. **Test all pages on all devices** (375px, 768px, 1024px, 1440px, 1920px)
9. **Push and verify** deployment

---

## COMMON ISSUES TO FIX

**If horizontal scroll on mobile**:
- Check for fixed widths → change to max-width or percentage
- Check for large images → add max-w-full
- Check for wide tables → wrap in overflow-x-auto

**If text too small on mobile**:
- Use responsive font sizes: `text-sm sm:text-base lg:text-lg`
- Ensure minimum 16px on mobile

**If buttons too small on mobile**:
- Increase padding: `py-3 px-4` (min 44px height)
- Add min-width if needed: `min-w-[120px]`

**If navigation overlaps**:
- Check z-index values
- Check positioning (absolute vs fixed)
- Adjust margins/padding

**If content cut off**:
- Add padding to containers
- Check overflow settings
- Ensure proper container sizing

---

**Credit-efficient**: Execute all changes in one sequential pass. Fix issues as you find them. Only report critical blockers that prevent completion.
