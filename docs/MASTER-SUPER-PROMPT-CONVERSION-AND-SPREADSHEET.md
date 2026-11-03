# MASTER SUPER PROMPT: SERVICE CONVERSION OVERHAUL, CAL.COM EMBED, POS SYSTEM SETUP & GOOGLE SPREADSHEET LEAD SYNC

> **EXECUTION DIRECTIVE FOR AI AGENT / CLAUDE SONNET:**
> This is a unified, all-in-one Master Implementation Specification. It combines the complete high-converting UI overhaul with full Google Spreadsheet lead tracking (both for intake forms and Cal.com bookings). Execute each step sequentially, verify code changes with `npm run typecheck`, and run `npm test`.

---

## PART 1: OVERVIEW & ARCHITECTURE

### 1. Business Objectives
- **Zero-Flicker Cal.com Booking:** Native month-view booking modal embedded via `@calcom/embed-react` matching brand dark mode (`#00cfff` accent).
- **Mobile-First High Conversion:**
  - **Desktop (`sm+`):** Glowing orange `Book online` (`btn-ignite`) + slate `Call (678) 558-4327` (`btn-chrome`).
  - **Mobile (`<sm`):** 1-tap glowing dialer `Call (678) 558-4327` (`btn-ignite`) + slate `Book online` (`btn-chrome`).
  - **No Button Text Wrapping:** `whitespace-nowrap` on `.btn-ignite` and `.btn-chrome` prevents awkward multi-line phone numbers on narrow mobile viewports.
- **New High-Ticket Service:** `/services/pos-system-setup` (Toast, Square, Clover, Stripe, DoorDash, UberEats, cash drawers, thermal printers, network switch) with transparent pricing tiers ($149, $249, $399).
- **Real-Time Google Spreadsheet Connection:** Every lead from intake forms (POS setup, office builds, DJ studios) and every booked call from Cal.com automatically flows into the Google Sheet (`FREE Lead Magnet Leads`) via Google Apps Script Webhook.

---

## PART 2: GOOGLE SPREADSHEET LEAD ARCHITECTURE

### How Leads Flow to the Spreadsheet:
```
1. FORM SUBMISSION (Visitor fills 3-step quote on /services/pos-system-setup or /services/home-office-setup)
   ↓
2. FRONTEND (OfficeIntake.tsx) sends { type: "office-setup", service: "pos-system-setup", business: job, value: 149, ... }
   ↓
3. SERVER ENDPOINT (/api/lead.js) validates, attaches CAPI signals, and calls forwardLead()
   ↓
4. WEBHOOK DISPATCH (api/_lib/leads.js) POSTs payload with LEADS_WEBHOOK_SECRET to LEADS_WEBHOOK_URL
   ↓
5. GOOGLE APPS SCRIPT (docs/leads-apps-script.js) deployed as Web App receives payload
   ↓
6. SPREADSHEET TAB: Lead automatically appends to "Office Setup Leads" tab:
   [Received | Name | Phone | Email | Service | Job | Quote $ | City / timing | Type | Source | Medium | Campaign | ...]

CAL.COM APPOINTMENTS:
Visitor books appointment on Cal.com modal → Cal.com fires webhook to /api/cal-webhook.js → POSTed to LEADS_WEBHOOK_URL → Appends to "Booked Calls" tab with date, time, prep notes, and meeting link.
```

### Vercel Environment Variables:
| Variable | Value | Purpose |
|---|---|---|
| `LEADS_WEBHOOK_URL` | Google Apps Script Web App URL (`https://script.google.com/macros/s/.../exec`) | Receives all leads and booked calls |
| `LEADS_WEBHOOK_SECRET` | Secret token (must match `SECRET` in the Apps Script) | Authenticates requests to the sheet |
| `CAL_WEBHOOK_SECRET` | Cal.com webhook signing secret | Verifies booking notifications from Cal.com |

---

## PART 3: CODE IMPLEMENTATION STEPS

### STEP 1: Package Dependencies
```bash
npm install @calcom/embed-react
```

### STEP 2: Button Text Wrapping Fix (`src/index.css`)
In `src/index.css`, update `.btn-ignite` and `.btn-chrome` to add `whitespace-nowrap`:
```css
  /* The action button — orange is reserved for this. */
  .btn-ignite {
    @apply relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.98] sm:px-6 sm:py-3.5;
    color: #140700;
    background: linear-gradient(180deg, hsl(var(--ignite-hot)), hsl(var(--ignite)));
    box-shadow:
      inset 0 1px 0 hsl(0 0% 100% / 0.45),
      inset 0 -2px 0 hsl(15 100% 35% / 0.45),
      0 10px 30px -8px hsl(var(--ignite) / 0.65);
  }
  .btn-ignite:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  .btn-chrome {
    @apply inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[15px] font-semibold text-foreground transition-colors sm:px-5 sm:py-3.5;
    background: linear-gradient(180deg, hsl(218 25% 14%), hsl(218 28% 9%));
    box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.08), 0 0 0 1px hsl(var(--border));
  }
  .btn-chrome:hover {
    box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.12), 0 0 0 1px hsl(var(--turbo) / 0.5);
  }
```

### STEP 3: Native Cal.com Modal (`src/components/booking/InstallCalModal.tsx`)
Create `src/components/booking/InstallCalModal.tsx`:
```tsx
import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { INSTALL_BOOKING } from "@/config/site";
import { track } from "@/lib/track";

export function InstallCalModal({
  open,
  onOpenChange,
  note = "service-page",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: string;
}) {
  const [calLoaded, setCalLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    track("booking_open", { source: `${note} — native cal embed` });

    (async function () {
      try {
        const cal = await getCalApi({ namespace: INSTALL_BOOKING.namespace });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: { dark: { "cal-brand": "#00cfff" }, light: { "cal-brand": "#00cfff" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        setCalLoaded(true);
      } catch (err) {
        console.error("Failed to load Cal API", err);
        setCalLoaded(true);
      }
    })();
  }, [open, note]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex h-[90vh] max-h-[850px] w-[95vw] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-border bg-card shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-turbo/15 text-turbo">
                <CalendarIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <Dialog.Title className="text-base font-bold text-foreground sm:text-lg">
                  Book Your Setup & Installation Date
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground sm:text-sm">
                  Pick a day and time that works for you. Flat-rate labor confirmed before we start.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="relative flex-1 overflow-hidden p-2 sm:p-4">
            {!calLoaded && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-turbo" />
                Loading booking calendar...
              </div>
            )}
            <Cal
              namespace={INSTALL_BOOKING.namespace}
              calLink={INSTALL_BOOKING.calLink}
              style={{ width: "100%", height: "100%", overflow: "auto" }}
              config={{
                layout: "month_view",
                useSlotsViewOnSmallScreen: "true",
                theme: "dark",
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### STEP 4: Trigger Cal Modal from Buttons (`src/components/cta/Actions.tsx`)
Update `InstallBookButton` in `src/components/cta/Actions.tsx`:
```tsx
import { useState, type MouseEvent, type ReactNode } from "react";
import { InstallCalModal } from "@/components/booking/InstallCalModal";
import { INSTALL_BOOKING } from "@/config/site";
import { cn } from "@/lib/utils";

export function InstallBookButton({
  children = "Book your install",
  note,
  variant = "chrome",
  className,
}: {
  children?: ReactNode;
  note?: string;
  variant?: "ignite" | "chrome" | "link";
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <a
        href={INSTALL_BOOKING.url}
        onClick={onClick}
        className={cn(variant === "ignite" ? "btn-ignite" : "btn-chrome", className)}
        rel="noopener"
      >
        {children}
      </a>
      <InstallCalModal open={modalOpen} onOpenChange={setModalOpen} note={note} />
    </>
  );
}
```

### STEP 5: Register POS Service (`src/content/services.ts`)
Add `pos-system-setup` to `SERVICES` and add to `CALL_FIRST_SLUGS`:
```typescript
export const CALL_FIRST_SLUGS = [
  "home-office-setup",
  "apartment-home-office-setup",
  "school-computer-room-setup",
  "dj-studio-setup",
  "computer-build-setup",
  "office-transformation",
  "pos-system-setup",
];
```

Service object:
```typescript
  {
    slug: "pos-system-setup",
    name: "POS system setup & terminal installation",
    short: "POS setup",
    icon: "layout",
    metaTitle: "POS System Installation — Atlanta Metro | Square, Toast, Clover",
    metaDescription:
      "We install Square, Toast, Clover, Stripe, DoorDash & UberEats POS systems, terminals, kitchen printers and cash drawers. From $149. Call 678-558-4327.",
    h1: "POS system installation — terminals wired, printers connected, orders flowing",
    answer:
      "CEO Turbo installs and configures complete Point of Sale (POS) systems for restaurants, food trucks, retail stores, and salons across the Atlanta metro area. We mount card readers, wire cash drawers and receipt printers, configure network switches, integrate DoorDash and UberEats delivery tablets, and test credit card processing on Square, Toast, Clover, and Stripe. You supply the hardware; we do the installation and cabling at a transparent flat price.",
    outcome: "A clean, tested POS setup ready to take payments and process online orders on day one.",
    bestFor: [
      "New restaurants, cafes, and bars opening in Atlanta",
      "Retail shops and boutiques upgrading registers",
      "Food businesses juggling DoorDash, UberEats, and Grubhub tablets",
      "Salons, barbershops, and service businesses needing reliable card readers",
      "Stores replacing messy wires with clean under-counter cabling",
    ],
    includes: [
      "POS terminal and iPad stand assembly & placement",
      "Credit card reader, chip terminal, and contactless tap setup",
      "Kitchen printer and front-of-house receipt printer installation",
      "Cash drawer connection and kick-out testing",
      "DoorDash, UberEats, and online delivery tablet network integration",
      "Network switch, router, and Ethernet cabling to terminals",
      "Wi-Fi configuration with isolated guest network for diners",
      "Clean under-counter cable management and labeling",
      "Test transaction and receipt print walkthrough",
      "Staff training on power cycles, paper changes, and basic troubleshooting",
    ],
    process: [
      { title: "Call or text", body: "Tell us your POS brand (Toast, Square, Clover, Stripe), station count, and timeline. We confirm a flat labor quote." },
      { title: "Site placement", body: "We arrive, inspect power and counters, mount stands, position terminals, and route all cables out of view." },
      { title: "Network & hardware", body: "We connect printers, cash drawers, readers, and delivery tablets to secure high-speed internet." },
      { title: "Live transaction test", body: "We run a live test payment, print a receipt, verify drawer kick, and train your staff before opening." },
    ],
    notFor: "Credit card merchant fee disputes or software licensing. We handle the physical build, cabling, and system installation.",
    audiences: ["local"],
    faqs: [
      { q: "What POS systems do you support?", a: "We install and configure all major systems: Square, Toast, Clover, Stripe Terminal, Shopify POS, Lightspeed, TouchBistro, Revel, as well as delivery tablets for DoorDash, UberEats, and Grubhub." },
      { q: "How much does POS system installation cost?", a: "Flat labor pricing: Basic (1 terminal, printer, reader) is $149; Standard (2-3 terminals, delivery tablets, kitchen printer, cash drawer) is $249; Complete multi-station restaurant/retail setup is $399. Confirmed before we start." },
      { q: "Do you provide the POS hardware?", a: "No. You supply the hardware ordered from your processor (Square, Toast, etc.). If you need us to procure mounts, cables, or switches up front, we provide itemized receipts with zero markup." },
      { q: "Can you install after business hours?", a: "Yes. We regularly install after closing or before opening so your business has zero downtime. Call 678-558-4327 to schedule." },
      { q: "What areas do you serve?", a: "Atlanta, Buckhead, Midtown, Decatur, Sandy Springs, Duluth, Norcross, Alpharetta, Marietta, Gwinnett County, and all cities within 50 miles of Duluth, GA." },
    ],
  },
```

### STEP 7: POS Pricing Tiers (`src/content/pricing.ts`)
Add to `SETUP` array:
```typescript
  {
    id: "pos-basic",
    name: "POS setup — single terminal",
    price: 149,
    billing: "once",
    service: "pos-system-setup",
    summary: "1 terminal or iPad register, card reader, receipt printer and basic cabling. Labor only.",
    includes: [
      "1 POS terminal or iPad stand assembly",
      "Card reader and tap terminal connection",
      "Receipt printer setup and driver check",
      "Cash drawer connection",
      "Network/Wi-Fi connection",
      "Live test payment walkthrough",
    ],
  },
  {
    id: "pos-standard",
    name: "POS setup — standard 2-3 stations",
    price: 249,
    billing: "once",
    service: "pos-system-setup",
    summary: "2-3 terminals, kitchen and receipt printers, cash drawers, and delivery tablets. Labor only.",
    includes: [
      "2-3 POS registers or terminals installed",
      "DoorDash & UberEats tablet integration",
      "Kitchen printer and front receipt printers",
      "Cash drawer wiring and kick testing",
      "Cable routing and organization",
      "Full staff walkthrough and testing",
    ],
    popular: true,
  },
  {
    id: "pos-complete",
    name: "POS setup — complete restaurant/retail",
    price: 399,
    billing: "once",
    service: "pos-system-setup",
    summary: "Complete multi-station setup: terminals, kitchen display, delivery tablets, network switch, and clean cabling.",
    includes: [
      "Up to 5 registers/terminals installed",
      "Kitchen Display System (KDS) mounting",
      "All delivery tablets (DoorDash, UberEats, Grubhub)",
      "Network switch and Ethernet drops to counters",
      "Isolated guest vs POS Wi-Fi setup",
      "Under-counter cable concealment",
      "Complete staff training and 30-day installation warranty",
    ],
  },
```
And add `"pos-system-setup": ["pos-basic", "pos-standard", "pos-complete"]` to `pricesFor()`.

### STEP 8: Lead Intake with Sheet Forwarding (`src/components/blocks/OfficeIntake.tsx` & `api/lead.js`)

1. In `src/components/blocks/OfficeIntake.tsx`:
Add POS choices to `JOB_SETS`:
```typescript
  "pos-system-setup": [
    { label: "Single POS terminal", sub: "1 register, reader, printer · $149", value: 149 },
    { label: "Standard 2-3 stations", sub: "Registers, kitchen printer, delivery tablets · $249", value: 249 },
    { label: "Complete restaurant/retail", sub: "Up to 5 stations, KDS, switch, cabling · $399", value: 399 },
  ],
```
And pass `service` and `value` into `sendLead()`:
```typescript
const ok = await sendLead({
  ...f,
  type: "office-setup",
  service,
  business: job,
  note,
  eventId,
  value,
  visitorId: visitorId(),
  attribution: attribution(),
  elapsedMs: Date.now() - opened.current,
  page: window.location.pathname,
});
```

2. In `api/lead.js`:
Forward `service` and `value` to `forwardLead()`:
```javascript
  const { stored } = await forwardLead({
    type,
    ...lead,
    service: text(body.service, 80),
    value: value || undefined,
    product: text(body.product, 120),
    style: text(body.style, 40),
    pack: text(body.pack, 40),
    total: text(body.total, 20),
    note: dev ? dev.note : text(body.note, 500),
    page: text(body.page, 120),
    eventId,
    ...attr,
  });
```

3. In `docs/leads-apps-script.js`:
Map `Service` and `Quote $` on the **Office Setup Leads** tab:
```javascript
  "Office Setup Leads": Object.assign(
    {
      Received: "receivedAt",
      Name: "name",
      Phone: "phone",
      Email: "email",
      Service: "service",
      Job: "business",
      "Quote $": "value",
      "City / timing": "note",
      Type: "type",
    },
    ATTR,
    { "Form page": "page", "Event ID": "eventId" }
  ),
```

### STEP 9: Navigation & Header Dropdown (`src/components/site/Header.tsx`)
Add `"pos-system-setup": "Tech & equipment"` to `SERVICE_GROUPS`.

### STEP 10: ServicePage Responsive CTAs (`src/pages/ServicePage.tsx`)
- Desktop (`sm+`): `Book online` (`btn-ignite`) + `Call (678) 558-4327` (`btn-chrome`)
- Mobile (`<sm`): `Call (678) 558-4327` (`btn-ignite`) + `Book online` (`btn-chrome`)
- Sub-actions: `Text for a quote` (`sms:`) • `What's included` • `Atlanta & Gwinnett`
- Aligned CTAs on Hero, Pricing, and Footer.

### STEP 11: Sticky Mobile Bar (`src/components/site/MobileActionBar.tsx`)
Clean 50/50 split between `Call now` (`btn-ignite`) and `Book online` (`btn-chrome`) with strict `whitespace-nowrap` and Calendar icon.

---

## PART 4: GOOGLE SHEET APPS SCRIPT DEPLOYMENT GUIDE (5 MINUTES)

1. Open the Google Sheet: **FREE Lead Magnet Leads**.
2. Click **Extensions → Apps Script**.
3. Select and delete everything in `Code.gs`.
4. Copy the entire contents of `docs/leads-apps-script.local.js` (or `docs/leads-apps-script.js` with your secret) and paste it into the editor.
5. In the toolbar function dropdown, select **`setupSheet`** and click **Run** (this configures all tabs, headers, colors, dropdowns, and the dashboard).
6. Click **Deploy → New deployment**.
   - Select type: **Web app**.
   - Description: `CEO Turbo Lead Webhook v2`.
   - Execute as: **Me** (`your-google-account@gmail.com`).
   - Who has access: **Anyone** (crucial for webhook POSTs).
7. Click **Deploy**, authorize permissions, and copy the **Web app URL** (ends in `/exec`).
8. Add to Vercel (Project → Settings → Environment Variables):
   - `LEADS_WEBHOOK_URL` = your copied `/exec` Web App URL
   - `LEADS_WEBHOOK_SECRET` = your secret token from line 10 of the script
9. Redeploy on Vercel.

---

## PART 5: VALIDATION COMMANDS
Run in the terminal:
```bash
npm run typecheck
npm test
npm run build:client
```
All commands must exit with code 0.
