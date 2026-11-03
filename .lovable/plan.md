

## Major SaaS Redesign — Higgsfield-Inspired Interactive Storefront

### What Changes

**1. Copy uploaded media assets into the project**
- `0227_3.mp4` → `public/videos/website-design-showcase.mp4` (Website Design section)
- `0227_4.mp4` → `public/videos/prompt-shop-showcase.mp4` (Prompt Shop section)
- `Digital_business_card_showcase_delpmaspu.mp4` → `public/videos/digital-card-showcase.mp4` (Digital Business Cards)
- `Imagepng_2c5e7d2330.jpeg` → `public/images/ad-creation-hero.jpeg` (Ad Creation section)
- `image-61.png` → `public/images/stackmode-academy-banner.png` (Academy bottom banner)

**2. Redesign `StorefrontSection.tsx` — Higgsfield-style interactive card grid**
Replace the current tab-based interface with a 4-card visual grid (like Higgsfield's top hero cards). Each card has:
- A looping video or image background filling the card
- Bold overlay title + short description below
- Click navigates to dedicated page or scrolls to section
- Order (low-ticket → high-ticket): **Prompt Shop → Ad Creation → Digital Business Cards → Website Design**
- Remove the "Custom Digital Card Setup" card entirely
- Remove "Book a Build Call" from the digital card area
- Cards use `aspect-[16/10]` with rounded corners, hover scale, glassmorphic overlay text

**3. Update `TopBar.tsx`**
- Change right CTA button text from "Book a Build Call" → **"Boost Your Brand"** (still links to Calendly)

**4. Create new route pages**
- `/promptshop` — `src/pages/PromptShop.tsx` — Dedicated prompt shop page with vault-style layout, the prompt shop video as hero, coming soon waitlist
- `/website` — `src/pages/WebsiteDesign.tsx` — Dedicated website design page with the website video as hero, portfolio grid, and Calendly CTA

**5. Redesign `BookCallSection.tsx`**
- Change from 2/3 split to stacked centered layout
- "What You Get" benefits displayed as a centered grid (2×2) above the Calendly embed
- Calendly widget centered, full-width (max-w-3xl), no left-side panel

**6. Add `StackmodeAcademyBanner` at bottom of page**
- Full-width banner using the uploaded `image-61.png` as background
- Overlay text: "Learn AI, Trading & Business Scaling"
- CTA button linking to `https://stackmode.net`
- Placed between FAQ and Footer in `Index.tsx`

**7. Update `Index.tsx` page order**
```
TopBar → StickyNav → Hero → StorefrontSection (4 interactive cards) → 
HowItWorks → WebsiteShowcase → ProofGallery → BookCallSection (centered) → 
FAQ → StackmodeAcademyBanner → Footer
```
Remove `ChoosePathSection` from page flow (the Shopify buy button moves into the Digital Business Cards dedicated card/section within StorefrontSection).

**8. Update `App.tsx` routes**
- Add `/promptshop` and `/website` routes

**9. SEO optimization**
- Verify H1/H2 tags contain target keywords: "Christopher Robinson", "Christopher Robinson CEO", "Stackmodechris", "Stackmode Academy", "digital business cards", "website design", "ceoturbo.com"
- Update meta tags in `index.html` if needed
- Ensure all image alt tags include brand keywords

### Technical Details

- Videos use `<video autoPlay muted loop playsInline>` with `loading="lazy"` for performance
- Images use `loading="lazy"` throughout
- Storefront cards use CSS `aspect-ratio` and `object-cover` for consistent sizing
- Framer Motion `whileHover={{ scale: 1.02 }}` on storefront cards
- New pages include `TopBar` + `FooterSection` for consistency
- Calendly script loaded once via existing `useEffect` pattern
- Mobile: cards stack to single column, videos use `preload="none"` on mobile via media query consideration

