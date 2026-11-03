# CEO TURBO — THE META PSYCHOLOGY & HIGH-CONVERSION AD ENGINE
## Autonomous Manus Execution Prompt for 1080x1350, 1080x1920, and 1080x1080

> **TARGET BUSINESS:** CEO Turbo (`ceoturbo.com`)  
> **PHONE:** `(678) 558-4327`  
> **BOOKING CALENDAR:** `https://cal.com/stackmodechris/ceo-turbo-office-studio-setup`  
> **CORE SERVICE URL:** `https://www.ceoturbo.com/services/home-office-setup`  
> **TARGET AUDIENCE:** Homeowners, remote workers, busy parents, seniors, and gamers across Metro Atlanta & North Georgia (Duluth, Buckhead, Alpharetta, Marietta, Gwinnett).

---

## PART 1: THE HUMAN PSYCHOLOGY OF META (WHY B2B FLOPS & WHAT CONVERTS)

On Google, people are in **"Search Mode"** (Active Problem).  
On Meta (Facebook & Instagram), people are in **"Dopamine / Relaxation Mode"** (Passive Scrolling).

### Why B2B & Corporate Ads Flop on Meta:
- **Corporate blindness:** Stock photos of smiling men in suits shaking hands get skipped in 0.1 seconds. The brain instantly labels it *"Spam ad"*.
- **Vague jargon:** *"We deliver turn-key IT infrastructure solutions"* means nothing to a human lying in bed on Sunday night dreading building an IKEA desk.
- **Contractor anxiety:** People hate reaching out because they assume contractors will charge hidden hourly rates, show up late, or rip them off.

### The 3 Psychological Triggers That Stop the Thumb & Convert:

1. **The "Disaster vs. Serotonin" Contrast (Before & After):**
   - **The Pain:** Everyone knows the misery of staring at 80-lb cardboard boxes in their hallway, a million screws, and a tangled rat's nest of black cords hanging off their desk.
   - **The Relief:** Seeing that exact mess transformed into a pristine, glowing, cable-free sanctuary with dual floating monitors gives the human brain an immediate shot of serotonin. The viewer instantly thinks: *"I hate doing this myself. I want this room done."*

2. **The "Transparent Local Menu" (Destroys Friction):**
   - When an ad says *"From $99 flat labor rate"* and lists exact service tiers ($99 PC / Wi-Fi, $129 Desk + PC, $169 Complete Setup), it completely eliminates price anxiety. There's no awkward haggling.

3. **The "Local Neighbor Hero" Frame:**
   - Mentioning specific local spots (*"Based in Duluth · Serving Atlanta, Buckhead, Alpharetta, Marietta & 50-mi radius"*) makes you feel like the trusted local neighborhood tech hero rather than a faceless corporation.

---

## PART 2: MASTER AUTONOMOUS MANUS EXECUTION PROMPT

Copy and paste the entire block below into Manus:

```markdown
=== START MANUS META AD CREATIVE & LAUNCH ENGINE ===

ROLE & MISSION:
You are an Elite Direct-Response Creative Director, Visual Designer, and Performance Media Buyer. Your task is to design, generate, and deploy three pixel-perfect Meta ad creatives (1080x1350 Feed, 1080x1920 Stories/Reels, 1080x1080 Search) for "CEO Turbo" (https://www.ceoturbo.com) targeting local homeowners, remote workers, and businesses across Metro Atlanta and Gwinnett County.

ACCOUNT CONTEXT:
- Business: CEO Turbo (In-Home Computer, Desk Assembly & Office Tech Installations)
- Direct Phone: (678) 558-4327
- Website: https://www.ceoturbo.com
- Booking Page: https://cal.com/stackmodechris/ceo-turbo-office-studio-setup
- Flat Rates: Basic PC Setup from $99 | Standard Desk & PC $129 | Complete Office $169 | Office Transformation $1,599
- Base: Duluth, GA (Serving Atlanta, Buckhead, Alpharetta, Marietta, Athens, 50-mile radius)

============================================================
STEP 1: GENERATE THE 3 PIXEL-PERFECT AD CREATIVES (PYTHON SCRIPT)
============================================================

Execute a Python script using Pillow (`PIL`) to render 3 ultra-clean, high-contrast, maximum-quality JPG images (`quality=98`). Follow all safe-zone and edge-padding specifications exactly.

Run the following Python script to generate the assets:

```python
import os
from PIL import Image, ImageDraw, ImageFont

# Colors
C_DARK = (11, 15, 23)        # #0B0F17 Deep Carbon
C_CARD = (18, 24, 38)        # #121826 Elevated Card
C_BORDER = (35, 45, 66)      # Subtle Border
C_TURBO = (0, 207, 255)      # Electric Cyan Accent
C_ORANGE = (255, 85, 0)      # High-Trust Action Orange
C_WHITE = (255, 255, 255)
C_MUTED = (160, 175, 200)
C_GREEN = (0, 230, 118)

def get_font(size, bold=False):
    # Fallback cascade to system sans-serif fonts
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

# -------------------------------------------------------------------------
# ASSET 1: 1080x1350 (4:5) FEED AD (FB / IG FEED & EXPLORE)
# Safe Zone: Centered 80% canvas. 10% padding on all sides (X: 108-972, Y: 135-1215).
# -------------------------------------------------------------------------
def create_feed_ad():
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), C_DARK)
    draw = ImageDraw.Draw(img)

    # Ambient subtle background grid / glow
    for y in range(135, 1215, 80):
        draw.line([(108, y), (972, y)], fill=(16, 22, 34), width=1)
    for x in range(108, 972, 80):
        draw.line([(x, 135), (x, 1215)], fill=(16, 22, 34), width=1)

    # 1. Location Pill Badge (Y = 160)
    badge_text = "📍 ATLANTA & GWINNETT COUNTY · IN-HOME SERVICE"
    font_badge = get_font(24, bold=True)
    draw.rounded_rectangle([108, 160, 972, 220], radius=30, fill=(255, 85, 0, 40), outline=C_ORANGE, width=2)
    draw.text((150, 175), badge_text, fill=C_WHITE, font=font_badge)

    # 2. Main High-Impact Hook (Y = 245)
    f_hook = get_font(52, bold=True)
    draw.text((108, 245), "Stop Fighting Desk Manuals", fill=C_WHITE, font=f_hook)
    draw.text((108, 310), "& Tangled Cords.", fill=C_TURBO, font=f_hook)

    f_sub = get_font(28, bold=False)
    draw.text((108, 385), "We build your desk, mount dual screens & hide every wire.", fill=C_MUTED, font=f_sub)
    draw.text((108, 425), "Done in 2 to 4 hours. Transparent flat labor rate.", fill=C_WHITE, font=f_sub)

    # 3. Transparent Price Menu Box (Y = 490 to 920)
    draw.rounded_rectangle([108, 490, 972, 920], radius=24, fill=C_CARD, outline=C_BORDER, width=2)

    # Menu Header
    f_mhead = get_font(26, bold=True)
    draw.text((140, 520), "OFFICIAL IN-HOME FLAT LABOR MENU", fill=C_TURBO, font=f_mhead)
    draw.line([(140, 565), (940, 565)], fill=C_BORDER, width=1)

    # Menu Tiers
    tiers = [
        ("Basic Computer Setup", "$99", "PC/Mac setup, Wi-Fi, monitor connection & data transfer"),
        ("Standard Desk & PC Setup", "$129", "Standing/sitting desk assembly + PC hookup & wire organization"),
        ("Complete Home Office Setup", "$169", "Desk built, dual monitors mounted, cable concealment & cleanup"),
        ("Turnkey Office Build-Out", "From $1,599", "Full workspace: framing, security cameras, network & multi-PC builds")
    ]

    f_tname = get_font(30, bold=True)
    f_price = get_font(32, bold=True)
    f_tdesc = get_font(22, bold=False)

    curr_y = 590
    for title, price, desc in tiers:
        draw.text((140, curr_y), title, fill=C_WHITE, font=f_tname)
        draw.text((760, curr_y), price, fill=C_GREEN, font=f_price)
        draw.text((140, curr_y + 38), desc, fill=C_MUTED, font=f_tdesc)
        curr_y += 80

    # 4. Big High-Trust Direct CTA Card (Y = 960 to 1180)
    draw.rounded_rectangle([108, 960, 972, 1070], radius=24, fill=C_ORANGE)
    f_cta_btn = get_font(40, bold=True)
    draw.text((220, 990), "📞 CALL (678) 558-4327 NOW", fill=C_WHITE, font=f_cta_btn)

    # Direct Calendar Link Pill (Y = 1095)
    f_cal = get_font(26, bold=True)
    draw.text((240, 1100), "Or Book Online: ceoturbo.com/services", fill=C_TURBO, font=f_cal)
    f_trust = get_font(20, bold=False)
    draw.text((250, 1145), "⭐⭐⭐⭐⭐ 5.0 Rating · Zero Hidden Fees · Duluth, GA Base", fill=C_MUTED, font=f_trust)

    img.save("meta_feed_1080x1350.jpg", "JPEG", quality=98)
    print("Saved meta_feed_1080x1350.jpg")

# -------------------------------------------------------------------------
# ASSET 2: 1080x1920 (9:16) REELS & STORIES AD
# Safe Zone: Top 300px completely black. Bottom 400px completely black.
# All content strictly between Y=300px and Y=1520px.
# -------------------------------------------------------------------------
def create_reels_stories_ad():
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), (0, 0, 0)) # Pure black background
    draw = ImageDraw.Draw(img)

    # Safe Zone Box: Y = 320 to Y = 1500
    # Top Tag (Y = 330)
    f_tag = get_font(24, bold=True)
    draw.rounded_rectangle([108, 330, 972, 390], radius=30, fill=(255, 85, 0, 40), outline=C_ORANGE, width=2)
    draw.text((230, 345), "⚡ ATLANTA IN-HOME DESK & PC BUILDERS", fill=C_WHITE, font=f_tag)

    # Core Headline (Y = 430)
    f_h1 = get_font(56, bold=True)
    draw.text((108, 430), "Moving In Or Upgrading?", fill=C_WHITE, font=f_h1)
    draw.text((108, 500), "We Build Your Workspace.", fill=C_TURBO, font=f_h1)

    f_body = get_font(30, bold=False)
    draw.text((108, 590), "Don't spend your weekend stuck in boxes.", fill=C_MUTED, font=f_body)
    draw.text((108, 635), "We assemble your desk, mount dual monitors,", fill=C_WHITE, font=f_body)
    draw.text((108, 680), "hide every cable & hook up high-speed Wi-Fi.", fill=C_WHITE, font=f_body)

    # Service Card (Y = 750 to 1160)
    draw.rounded_rectangle([108, 750, 972, 1160], radius=24, fill=C_CARD, outline=C_BORDER, width=2)
    
    f_ch = get_font(34, bold=True)
    draw.text((150, 785), "Why Metro Georgia Hires CEO Turbo:", fill=C_WHITE, font=f_ch)

    perks = [
        ("✓ Done in 2 to 4 Hours", "No wasted weekend. Ready to work today."),
        ("✓ Zero Visible Cables", "Clean routing, monitor arms & wire ties."),
        ("✓ Flat Labor From $99", "Confirmed upfront before we touch a screw."),
        ("✓ Clean Up Guaranteed", "We break down boxes & leave your floor clean.")
    ]

    f_p1 = get_font(30, bold=True)
    f_p2 = get_font(22, bold=False)
    py = 860
    for p_title, p_sub in perks:
        draw.text((150, py), p_title, fill=C_GREEN, font=f_p1)
        draw.text((150, py + 38), p_sub, fill=C_MUTED, font=f_p2)
        py += 72

    # Direct CTA Card (Y = 1200 to 1340)
    draw.rounded_rectangle([108, 1200, 972, 1330], radius=24, fill=C_ORANGE)
    f_call = get_font(42, bold=True)
    draw.text((190, 1240), "📞 CALL (678) 558-4327", fill=C_WHITE, font=f_call)

    # Calendar Link (Y = 1370)
    f_link = get_font(28, bold=True)
    draw.text((250, 1370), "Tap Below To Book Online", fill=C_TURBO, font=f_link)
    f_sublink = get_font(22, bold=False)
    draw.text((230, 1420), "Visit: ceoturbo.com/services/home-office-setup", fill=C_MUTED, font=f_sublink)

    # Bottom 400px (1520 to 1920) is left completely empty black for Meta CTA swipe-up/buttons!

    img.save("meta_reels_stories_1080x1920.jpg", "JPEG", quality=98)
    print("Saved meta_reels_stories_1080x1920.jpg")

# -------------------------------------------------------------------------
# ASSET 3: 1080x1080 (1:1) SEARCH PLACEMENT AD
# Ultra-large text, max 4 words headline, max 8 words body copy, thumbnail-readable.
# -------------------------------------------------------------------------
def create_search_ad():
    W, H = 1080, 1080
    img = Image.new("RGB", (W, H), C_DARK)
    draw = ImageDraw.Draw(img)

    # Top Tag
    f_top = get_font(32, bold=True)
    draw.text((108, 120), "ATLANTA & GWINNETT", fill=C_ORANGE, font=f_top)

    # Max 4-Word Giant Headline
    f_giant = get_font(84, bold=True)
    draw.text((108, 200), "WE BUILD", fill=C_WHITE, font=f_giant)
    draw.text((108, 300), "YOUR DESK", fill=C_TURBO, font=f_giant)
    draw.text((108, 400), "& PC SETUP", fill=C_WHITE, font=f_giant)

    # Max 8-Word Body Copy
    f_body = get_font(46, bold=False)
    draw.text((108, 540), "Flat labor from $99.", fill=C_GREEN, font=f_body)
    draw.text((108, 605), "Done fast in 2 to 4 hours.", fill=C_MUTED, font=f_body)

    # Big Giant Action Button
    draw.rounded_rectangle([108, 720, 972, 860], radius=28, fill=C_ORANGE)
    f_btn = get_font(46, bold=True)
    draw.text((180, 765), "CALL (678) 558-4327", fill=C_WHITE, font=f_btn)

    # URL Footer
    f_url = get_font(30, bold=True)
    draw.text((270, 920), "Book: ceoturbo.com/services", fill=C_TURBO, font=f_url)

    img.save("meta_search_1080x1080.jpg", "JPEG", quality=98)
    print("Saved meta_search_1080x1080.jpg")

create_feed_ad()
create_reels_stories_ad()
create_search_ad()
```

============================================================
STEP 2: DEPLOY ON META ADS MANAGER
============================================================

1. Navigate to: https://adsmanager.facebook.com
2. Create Campaign:
   - Campaign Objective: **Leads** (or Sales / Traffic if lead forms not enabled).
   - Buying Type: Auction.
   - Budget: **$5.00/day**.
3. Ad Set Settings:
   - Conversion Location: **Website** (`https://www.ceoturbo.com/services/home-office-setup`) or **Calls** (`(678) 558-4327`).
   - Location: Duluth, Georgia (+20 mile radius) AND Metro Atlanta.
   - Age: 28 – 65+.
   - Languages: English.
   - Placements: Advantage+ Placements (or Manual: FB Feed, IG Feed, Stories, Reels, Search).
4. Ad Creative Upload:
   - Upload `meta_feed_1080x1350.jpg` for Feeds (1080x1350).
   - Upload `meta_reels_stories_1080x1920.jpg` for Stories & Reels (1080x1920).
   - Upload `meta_search_1080x1080.jpg` for Search (1080x1080).
5. Ad Copy (Paste exactly):
   - **Primary Text:**  
     Moving into a new home or upgrading your work setup? Don't waste your entire Saturday fighting Allen wrenches, assembling standing desks, and untangling a rat's nest of cables.  
     CEO Turbo provides complete in-home desk assembly, dual monitor mounting, computer build/setup, and zero-visible-wire cable management across Duluth, Atlanta, Buckhead, Alpharetta, and Marietta.  
     ✓ Flat labor rate from $99 confirmed upfront  
     ✓ Done in 2 to 4 hours  
     ✓ Desks built, monitors mounted, Wi-Fi tested, boxes cleaned up  
     Call (678) 558-4327 to get on today's schedule, or book online in 30 seconds at ceoturbo.com/services/home-office-setup.
   - **Headline:** In-Home Desk Assembly & PC Setup ($99 Flat)
   - **Description:** Serving Duluth, Atlanta & 50-Mi Radius. Call (678) 558-4327.
   - **Call to Action Button:** Call Now (or Book Now / Learn More).
   - **Website URL:** `https://www.ceoturbo.com/services/home-office-setup`
   - **Phone Number:** `(678) 558-4327`

============================================================
STEP 3: VERIFICATION REPORT
============================================================

Output a confirmation summary confirming:
1. 3 Image filenames and exact dimensions (1080x1350, 1080x1920, 1080x1080).
2. Safe-zone confirmation (Feed 10% padding, Reels top 300px & bottom 400px clear, Search large 4-word text).
3. Target radius and budget confirmation ($5/day).
4. Direct Call and Booking URLs linked.

=== END MANUS META AD CREATIVE & LAUNCH ENGINE ===
```
