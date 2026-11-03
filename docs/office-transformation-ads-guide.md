# Office Transformation Ad Campaign Guide

## Overview
This guide provides comprehensive ad campaign strategies for the Office Transformation service across Meta (Facebook/Instagram), Google Ads, and Microsoft Ads (Bing). All campaigns are designed to drive phone calls and text messages with proper conversion tracking.

---

## META ADS (Facebook & Instagram)

### Recommended Ad Formats

#### Feed Ads - 1080x1350 (4:5 Format)
**Placements:** Facebook Feed, Instagram Feed, Explore, Profile Feed

**Safe Zone Requirements:**
- Centered safe zone: Middle 80% of canvas
- 10% padding on all four sides (108px each side)
- No text closer than 120px from any edge
- All critical elements (text, logos, prices, CTA, website) must be in safe zone
- Output: JPG max quality

**Image Generation Prompt Template:**
```
Create a Meta Feed optimized ad at exactly 1080x1350 (4:5). Keep all important text, logos, prices, CTA buttons, and website inside a centered safe zone occupying only the middle 80% of the canvas. Leave 10% padding on all four sides. Never place text closer than 120px from any edge. Design specifically for Facebook Feed, Instagram Feed, Explore, and Profile Feed placements. No critical elements may touch the top, bottom, left, or right edges. No bleed stretch to the edges for perfect sizing and make it a jpg max quality image.
```

#### Reels & Stories - 1080x1920 (9:16 Format)
**Placements:** Instagram Reels, Facebook Reels, Instagram Stories, Facebook Stories

**Safe Zone Requirements:**
- Top 300px: Completely empty (black background only) for profile info
- Bottom 400px: Completely empty (black background only) for Meta CTA overlays
- All content must sit between Y=300px and Y=1520px ONLY
- Use real photos only (no AI images, no stock photos)
- Output: JPG max quality

**Image Generation Prompt Template:**
```
Create a 1080x1920 vertical ad for Instagram and Facebook Stories and Reels. CRITICAL SAFE ZONES: Top 300px = completely empty black background only. Bottom 400px = completely empty black background only. Every single piece of text and content must sit between 300px from the top and 1520px from the top ONLY. Nothing outside that zone or Meta UI will cover it. Use only real photos provided. No AI images. No stock photos. No bleed stretch to the edges for perfect sizing and make it a jpg max quality image.
```

### Target Audiences

#### Primary Audience 1: New Business Owners
- **Location:** Atlanta metro plus up to 2 hours from Duluth, GA
- **Age:** 25-55
- **Behaviors:** Business decision makers, Small business owners, Recently moved
- **Interests:** Small business, Entrepreneurship, Office space, Business equipment
- **Custom Audiences:** Website visitors (retargeting)

#### Primary Audience 2: Office Relocations
- **Location:** Georgia
- **Age:** 30-60
- **Behaviors:** Corporate executives, Office managers, Commercial real estate
- **Interests:** Office relocation, Business expansion, Commercial property
- **Lookalike:** Based on previous office setup customers

#### Primary Audience 3: Medical Practices
- **Location:** Georgia
- **Age:** 35-65
- **Job Titles:** Practice manager, Clinic administrator, Doctor, Dentist
- **Interests:** Medical practice, Healthcare administration, Private practice
- **Custom:** Upload patient lead list for matching

### Ad Copy Templates

#### Template 1: Price-Led Hook
```
Office Transformation Georgia - From $1,499 ONE-TIME

Complete office build-out: framing, cameras, internet, 
computers, network, cleaning. No monthly contract.


📞 Call 678-558-4327 for free quote
📍 Serving the Atlanta metro area

ceoturbo.com/office-transformation
```

#### Template 2: Problem-Solution Hook
```
Moving into a new office? We handle EVERYTHING.

✅ Office framing & build-out
✅ Security cameras installed
✅ High-speed internet setup
✅ Computers built & configured
✅ Professional cleaning included

ONE-TIME pricing. No monthly contracts.

📞 Call 678-558-4327
📍 Atlanta metro and surrounding cities

ceoturbo.com/office-transformation
```

#### Template 3: Comparison Hook
```

CEO Turbo: Complete office transformation for ONE-TIME fee
- Basic: $1,499
- Standard: $2,999
- Complete: $4,999

Includes cameras, internet, computers, network, cleaning.

📞 Call 678-558-4327 for free consultation
📍 Serving the Atlanta metro area

ceoturbo.com/office-transformation
```

#### Template 4: Urgency Hook
```
Need your office ready FAST?

We transform empty spaces into fully operational offices:
- 3-5 days for small offices
- 1-2 weeks for medium spaces
- Custom timeline for large projects

Cameras watching, internet running, computers working.

📞 Call 678-558-4327 - ASAP scheduling available
📍 Atlanta metro service

ceoturbo.com/office-transformation
```

### Budget Recommendations
- **Starting budget:** $20-50/day
- **Testing phase:** 2-3 weeks with 3-5 ad variations
- **Scaling:** Increase budget on best-performing ad/audience combo
- **Ad spend:** Paid directly to Meta from your own ad account

### Conversion Tracking Setup
- **Pixel events:** `Contact` (phone clicks), `book_call` (if using Cal.com)
- **Conversions API:** Enabled for deduplication
- **Value tracking:** Set average value to $2,999 (standard package)
- **Phone tracking:** Use `data-call-location` attributes on phone links

---

## GOOGLE ADS

### Keyword Strategy

#### Primary Keywords (High Intent)
- office transformation Georgia
- office build-out Atlanta
- office setup services Georgia
- commercial office installation
- office camera installation Georgia
- office network setup Atlanta
- business office construction Georgia

#### Secondary Keywords (Research)
- how to set up office space
- office renovation contractors Georgia
- office IT infrastructure setup
- security camera installation office
- office computer setup services

#### Negative Keywords
- DIY
- free
- cheap
- home office
- residential
- apartment
- virtual office
- coworking space

### Location Targeting
- **Primary:** Georgia state
- **Priority cities:** Atlanta, Athens, Gainesville, Newnan, Covington, Gainesville, Rome, Valdosta, Albany
- **Radius targeting:** 50-mile radius around major cities
- **Exclusions:** Outside Georgia state

### Ad Copy Templates

#### Template 1: Price-Focused
```
Office Transformation Georgia | From $1,499 One-Time
Complete build-out: cameras, internet, computers, network, cleaning.
No monthly contract. Serving the Atlanta metro area.
Call 678-558-4327 for Free Quote
ceoturbo.com/office-transformation
```

#### Template 2: Service-Focused
```
Georgia Office Build-Out Services | Framing to Finish
We transform empty spaces into operational offices.
Cameras, internet, computers, network, cleaning included.
One-time pricing. No monthly contracts.
Call 678-558-4327 | ceoturbo.com/office-transformation
```

#### Template 3: Comparison-Focused
```
Office Setup Without Monthly Fees | Georgia
Complete office transformation from $1,499.
Labor for cameras, network, computers and cleanup. Materials not included.
Call 678-558-4327 | ceoturbo.com/office-transformation
```

### Ad Extensions
- **Call extensions:** Prominent phone number with call tracking
- **Sitelinks:** Pricing, Services, Areas Served, About Us
- **Callouts:** One-time pricing, No monthly contract, 30-day warranty, Atlanta metro
- **Location assets:** Link to Google Business Profile
- **Image extensions:** Before/after office transformation photos

### Budget Recommendations
- **Starting budget:** $30-60/day
- **CPC expectations:** $3-8 for high-intent keywords
- **Testing phase:** 2 weeks with 3-4 ad groups
- **Scaling:** Increase budget on best-converting keywords

### Conversion Tracking Setup
- **Google Ads conversions:** Phone calls (call extensions), website calls (GTM)
- **GA4 events:** `phone_call_click`, `book_call`
- **Value tracking:** Set average value to $2,999
- **Call reporting:** Enable call reporting to track call duration and outcomes

---

## MICROSOFT ADS (BING)

### Strategy
Microsoft Ads (Bing) typically has lower competition and CPC than Google Ads. Use similar strategy to Google Ads but with Bing-specific optimizations.

### Keyword Strategy
Import high-performing keywords from Google Ads after testing. Bing users tend to be older and more business-focused, so emphasize:
- Professional services
- Business transformation
- Enterprise-grade solutions

### Ad Copy Templates
Use Google Ads templates but adjust character limits for Bing (slightly different limits).

### Location Targeting
Same as Google Ads: Georgia state with priority on major cities.

### Budget Recommendations
- **Starting budget:** $20-40/day
- **CPC expectations:** $2-5 (typically lower than Google)
- **Import strategy:** Import campaigns from Google Ads after optimization

### Conversion Tracking Setup
- **UET tag:** Ensure UET tag is firing on all pages
- **Custom events:** Track phone clicks and booking confirmations
- **Goal setup:** Create conversion goals for phone calls and form submissions

---

## TRACKING VERIFICATION CHECKLIST

### Before Launch

#### GA4 Configuration
- [ ] `phone_call_click` event is defined and firing
- [ ] `book_call` event is defined and firing
- [ ] Conversion values set ($2,999 average)
- [ ] Event parameters configured (call_location, service)

#### Google Tag Manager
- [ ] Phone click triggers are active
- [ ] Booking confirmation page triggers `book_call` event
- [ ] Cal.com webhook configured (if using)
- [ ] All tags are published and firing

#### Meta Pixel & Conversions API
- [ ] `Contact` event mapped for phone clicks
- [ ] `book_call` event mapped for bookings
- [ ] Conversions API configured for deduplication
- [ ] Test events firing in Events Manager

#### Microsoft Ads (Bing) UET
- [ ] UET tag installed on all pages
- [ ] Custom events for phone clicks
- [ ] Custom events for bookings
- [ ] UET status verified as "Active"

### After Launch

#### Daily Checks (First Week)
- [ ] Impressions and clicks are registering
- [ ] CPC within expected range
- [ ] Phone calls are being tracked
- [ ] No disapprovals or policy violations

#### Weekly Checks
- [ ] Cost per call (conversions)
- [ ] Cost per booking (if using Cal.com)
- [ ] Quality scores (Google Ads)
- [ ] Relevance scores (Meta Ads)
- [ ] Search term reports (Google/Microsoft)

#### Monthly Optimization
- [ ] Add negative keywords from search term reports
- [ ] Pause underperforming ads/keywords
- [ ] Scale budget on best performers
- [ ] Refresh ad creative (especially Meta)
- [ ] A/B test new ad copy variations

---

## PERFORMANCE BENCHMARKS

### Expected Metrics (First 30 Days)

#### Meta Ads
- **CPC:** $0.50-$1.50
- **CTR:** 1.5%-3%
- **Cost per call:** $15-$40
- **Cost per booking:** $50-$150 (if using Cal.com)

#### Google Ads
- **CPC:** $3-$8
- **CTR:** 2%-5%
- **Cost per call:** $20-$60
- **Cost per booking:** $80-$200 (if using Cal.com)

#### Microsoft Ads (Bing)
- **CPC:** $2-$5
- **CTR:** 2%-4%
- **Cost per call:** $15-$50
- **Cost per booking:** $60-$180 (if using Cal.com)

### ROI Calculation
- **Average project value:** $2,999 (standard package)
- **Target cost per acquisition:** Under $500
- **Break-even point:** 1 booking per $500 ad spend
- **Target conversion rate:** 2-5% of calls to paid projects

---

## GEOGRAPHIC PRIORITIZATION

### Phase 1: Atlanta Metro (Weeks 1-4)
- Highest population density
- Most business activity
- Shortest travel time
- Target: 50% of budget

### Phase 2: Major Cities (Weeks 5-8)
- Athens, Gainesville, Newnan, Covington
- Medium population centers
- Good business growth
- Target: 30% of budget

### Phase 3: Outer metro (Weeks 9+)
- Cities up to 2 hours from Duluth
- Lower competition
- Higher travel fees possible
- Target: 20% of budget

---

## CREATIVE ASSETS NEEDED

### Images
- Before/after office transformation photos
- Camera installation photos
- Network rack photos
- Clean, organized workspace photos
- Team at work photos

### Videos
- Time-lapse of office transformation
- Camera system demo
- Network setup walkthrough
- Client testimonial videos

### Graphics
- Pricing comparison charts
- Service icons/illustrations
- Georgia map with service areas
- Before/after comparison graphics

---

## COMPLIANCE NOTES

### Meta Ads Compliance
- No "guaranteed" claims
- No unrealistic income promises
- Clear pricing disclosure
- Accurate location targeting
- No misleading comparisons

### Google Ads Compliance
- No "free" if not actually free
- Clear pricing in ad copy
- Accurate call tracking
- No misleading claims about competitors
- Proper use of trademark terms

### General Best Practices
- Always include phone number
- Use clear pricing
- Be transparent about one-time vs monthly
- Include location (Georgia)
- Avoid superlatives ("best", "#1") without proof

---

## CONTACT INFORMATION

**For Ad Support:**
- Phone: 678-558-4327
- Email: ceoturbo@proton.me
- Website: ceoturbo.com

**Tracking Issues:**
- Check `/docs/office-transformation-implementation-prompt.md`
- Review GA4, GTM, and pixel configurations
- Test with browser DevTools Network tab

---

## SUMMARY CHECKLIST

### Pre-Launch
- [ ] All tracking verified (GA4, GTM, Meta, Microsoft)
- [ ] Ad accounts linked and verified
- [ ] Billing information updated
- [ ] Creative assets prepared
- [ ] Ad copy written and approved
- [ ] Location targeting configured
- [ ] Negative keywords added
- [ ] Budget limits set

### Launch Day
- [ ] Campaigns activated
- [ ] First 4 hours monitored for issues
- [ ] Impressions and clicks registering
- [ ] Phone calls coming through
- [ ] No policy violations

### Post-Launch
- [ ] Daily monitoring for first week
- [ ] Weekly optimization meetings
- [ ] Monthly performance reports
- [ ] Quarterly strategy reviews

---

## COMPLIANCE RULES (Google and Microsoft Ads)

- Do not name or price competitors in ad copy.
- Say "labor" and "materials not included" on the landing page and in ads where price is shown.
- Only list cities actually served: Atlanta metro and up to 2 hours from Duluth, GA.
- "30-day warranty" and "free quote" only if honored exactly as stated.
- No "best", "#1" or "guaranteed" claims.
