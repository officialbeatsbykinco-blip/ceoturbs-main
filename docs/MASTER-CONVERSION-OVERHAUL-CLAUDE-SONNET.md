# CLAUDE SONNET MASTER EXECUTION PLAN
## SERVICE PAGES CONVERSION OVERHAUL, BUTTON WRAPPING FIX, CAL.COM EMBED & POS SYSTEM INSTALLATION

> **FOR CLAUDE SONNET / AGENT EXECUTION:**
> This is a self-contained, single-file master implementation document. Follow the steps sequentially. Every file path, code diff, and replacement is exact. Do not skip steps. Verify with `bun run typecheck` or `npm run typecheck` when finished.

---

### SUMMARY OF CHANGES IN THIS RUN
1. **Package Dependency:** Install `@calcom/embed-react` for native, flicker-free Cal.com month-view booking modals.
2. **Global CSS Fix (`src/index.css`):** Add `whitespace-nowrap` to `.btn-ignite` and `.btn-chrome` so phone numbers like `(678) 558-4327` never wrap into ugly multi-line text on mobile or narrow columns.
3. **Cal.com Modal Embed (`src/components/booking/InstallCalModal.tsx` & `src/components/cta/Actions.tsx`):** Build a native Radix Dialog modal wrapping `@calcom/embed-react` with month-view layout, `#00cfff` brand accents, and automatic slot loading.
4. **New POS System Service (`src/content/services.ts` & `src/content/pricing.ts`):** Add `/services/pos-system-setup` (DoorDash, UberEats, Square, Stripe, Clover, Toast, receipt printers, cash drawers, network setup) with transparent pricing ($149, $249, $399).
5. **CTA Architecture Overhaul Across All 7 Services (`src/pages/ServicePage.tsx`):**
   - **Desktop Viewport (`sm+`):** Prioritizes **Book Online** (`btn-ignite` glowing orange) + **Call (678) 558-4327** (`btn-chrome`).
   - **Mobile Viewport (`<sm`):** Prioritizes **Call (678) 558-4327** (`btn-ignite` 1-tap dialer) + **Book Online** (`btn-chrome`).
   - **Sub-Actions:** Subtle text links (`Text for a quote` • `What's included` • `Atlanta & Gwinnett`).
   - **Pricing & Footer CTAs:** Aligned to the exact same responsive hierarchy, fixing the mobile `ml-3` misalignment bug.
6. **Sticky Mobile Bar Update (`src/components/site/MobileActionBar.tsx`):** Clean 50/50 split between `Call now` (`btn-ignite`) and `Book online` (`btn-chrome`) with strict `whitespace-nowrap`.
7. **Navigation & Intake Integration (`src/components/site/Header.tsx` & `src/components/blocks/OfficeIntake.tsx`):** Register POS setup in the navigation dropdown and intake form options.

---

## STEP 1: INSTALL `@calcom/embed-react`
Run the install command in the workspace terminal:
```bash
bun add @calcom/embed-react
# or if using npm:
# npm install @calcom/embed-react
```

---

## STEP 2: FIX BUTTON WRAPPING IN `src/index.css`
Open `src/index.css`. In `@layer components`, update `.btn-ignite` and `.btn-chrome` to include `whitespace-nowrap`:

```css
  /* The action button — orange is reserved for this. */
  .btn-ignite {
    @apply relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.98] sm:px-6 sm:py-3.5;
    /* near-black on orange: ~7:1 contrast */
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

---

## STEP 3: CREATE NATIVE CAL.COM MODAL COMPONENT
Create a new file `src/components/booking/InstallCalModal.tsx`:

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
          cssVarsPerTheme: { dark: { "cal-brand": "#00cfff" } },
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

---

## STEP 4: UPDATE `InstallBookButton` IN `src/components/cta/Actions.tsx`
Update `InstallBookButton` in `src/components/cta/Actions.tsx` to mount the `InstallCalModal`:

```tsx
// In src/components/cta/Actions.tsx:
import { useState, type MouseEvent, type ReactNode } from "react";
import { InstallCalModal } from "@/components/booking/InstallCalModal";

export function InstallBookButton({
  children = "Book your install",
  note,
  variant = "chrome",
  className,
}: {
  children?: ReactNode;
  note?: string;
  variant?: Variant;
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
        className={cn(variantClass[variant], className)}
        rel="noopener"
      >
        {children}
      </a>
      <InstallCalModal open={modalOpen} onOpenChange={setModalOpen} note={note} />
    </>
  );
}
```

---

## STEP 5: ADD POS SYSTEM INSTALLATION SERVICE DEFINITION
Open `src/content/services.ts`.

1. **Update `CALL_FIRST_SLUGS` at the bottom of `src/content/services.ts`:**
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

2. **Add the POS System Setup Service object to the `SERVICES` array:**
```typescript
  {
    slug: "pos-system-setup",
    name: "POS system setup & terminal installation",
    short: "POS setup",
    icon: "layout",
    metaTitle: "POS System Installation & Setup — Atlanta Metro | Square, Toast, Clover",
    metaDescription:
      "We install Square, Toast, Clover, Stripe, DoorDash and UberEats POS systems, card terminals, kitchen printers and cash drawers. From $149. Call 678-558-4327.",
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

---

## STEP 6: ADD POS PRICING TIERS IN `src/content/pricing.ts`
Open `src/content/pricing.ts`.

1. **Add POS Price Items to the `PRICING` array:**
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

2. **Add to `servicePricingMap` in `src/content/pricing.ts`:**
```typescript
  "pos-system-setup": ["pos-basic", "pos-standard", "pos-complete"],
```

---

## STEP 7: UPDATE INTAKE & NAVIGATION FOR POS
1. **In `src/components/blocks/OfficeIntake.tsx`:**
Add POS options to `JOB_SETS`:
```typescript
const JOB_SETS: Record<string, { label: string; sub: string; value: number }[]> = {
  "pos-system-setup": [
    { label: "Single POS terminal", sub: "1 register, reader, printer · $149", value: 149 },
    { label: "Standard 2-3 stations", sub: "Registers, kitchen printer, delivery tablets · $249", value: 249 },
    { label: "Complete restaurant/retail", sub: "Up to 5 stations, KDS, switch, cabling · $399", value: 399 },
  ],
  "office-transformation": [
    { label: "Basic office build-out", sub: "1-2 workstations · from $1,599", value: 1599 },
    { label: "Standard office build-out", sub: "3-5 workstations · from $2,299", value: 2299 },
    { label: "Complete office build-out", sub: "6+ workstations · from $3,199", value: 3199 },
  ],
  "dj-studio-setup": [
    { label: "DJ or studio desk", sub: "Gear, monitors, cables · from $149", value: 149 },
    { label: "Full room or booth", sub: "Monitors, interface, calibration · from $259", value: 259 },
  ],
};
```

2. **In `src/components/site/Header.tsx`:**
Add `"pos-system-setup"` to `SERVICE_GROUPS`:
```typescript
const SERVICE_GROUPS: Record<string, string> = {
  "home-office-setup": "Office & workspace",
  "office-transformation": "Office & workspace",
  "apartment-home-office-setup": "Office & workspace",
  "school-computer-room-setup": "Office & workspace",
  "computer-build-setup": "Tech & equipment",
  "dj-studio-setup": "Tech & equipment",
  "pos-system-setup": "Tech & equipment",
};
```

---

## STEP 8: RESTRUCTURE HERO, PRICING & FOOTER CTAS IN `src/pages/ServicePage.tsx`
Open `src/pages/ServicePage.tsx`.

1. **Update Lucide imports:**
```tsx
import { Calendar, Check, MessageSquare, Phone, X } from "lucide-react";
```

2. **Replace the Hero CTA cluster (lines 52-71):**
```tsx
              <div className="mt-8 space-y-3">
                {isHomeOffice || isOfficeTransform ? (
                  <>
                    {/* DESKTOP (sm+): Primary = Book Online (ignite), Secondary = Call (chrome) */}
                    <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                      {showCal && (
                        <InstallBookButton
                          note={`${s.slug}-hero`}
                          variant="ignite"
                          className="flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                          <span>Book online</span>
                        </InstallBookButton>
                      )}
                      <a
                        href={SITE.phone.href}
                        data-call-location={`${s.slug}-hero`}
                        className="btn-chrome flex items-center justify-center gap-2"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                        <span>Call {SITE.phone.display}</span>
                      </a>
                    </div>

                    {/* MOBILE (<sm): Primary = Call (ignite), Secondary = Book Online (chrome) */}
                    <div className="flex flex-col gap-2.5 sm:hidden">
                      <a
                        href={SITE.phone.href}
                        data-call-location={`${s.slug}-hero`}
                        className="btn-ignite flex w-full items-center justify-center gap-2 text-base font-bold shadow-lg"
                      >
                        <Phone className="h-4 w-4 shrink-0" aria-hidden />
                        <span>Call {SITE.phone.display}</span>
                      </a>
                      {showCal && (
                        <InstallBookButton
                          note={`${s.slug}-hero`}
                          variant="chrome"
                          className="flex w-full items-center justify-center gap-2"
                        >
                          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                          <span>Book online</span>
                        </InstallBookButton>
                      )}
                    </div>

                    {/* SUB-ACTIONS: Clean text links */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-muted-foreground">
                      <a
                        href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent(
                          isOfficeTransform
                            ? "Hi, I'd like a quote for an office build-out."
                            : `Hi, I'd like a quote for ${s.short.toLowerCase()}.`
                        )}`}
                        data-call-location={`${s.slug}-hero-text`}
                        className="inline-flex items-center gap-1.5 transition hover:text-turbo"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-turbo" aria-hidden />
                        <span>Text for a quote</span>
                      </a>
                      <span className="text-border" aria-hidden>•</span>
                      <a href="#included" className="transition hover:text-foreground">
                        What's included
                      </a>
                      <span className="text-border" aria-hidden>•</span>
                      <a href="#areas" className="transition hover:text-foreground">
                        Atlanta & Gwinnett
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <BookButton note={note} prefill={prefill}>
                      Book a free call about {s.short}
                    </BookButton>
                    <a href="#included" className="btn-chrome">
                      What's included
                    </a>
                  </div>
                )}
              </div>
```

3. **Replace the Pricing Section CTA (around line 144):**
```tsx
              {isHomeOffice || isOfficeTransform ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="hidden sm:flex sm:items-center sm:gap-3">
                    {showCal && (
                      <InstallBookButton note={`${s.slug}-pricing`} variant="ignite">
                        <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                        Book your setup
                      </InstallBookButton>
                    )}
                    <a
                      href={SITE.phone.href}
                      data-call-location={`${s.slug}-pricing`}
                      className="btn-chrome inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                      Call for a flat quote
                    </a>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:hidden">
                    <a
                      href={SITE.phone.href}
                      data-call-location={`${s.slug}-pricing`}
                      className="btn-ignite inline-flex w-full items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden />
                      Call for a flat quote
                    </a>
                    {showCal && (
                      <InstallBookButton note={`${s.slug}-pricing`} variant="chrome" className="w-full">
                        <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                        Book online
                      </InstallBookButton>
                    )}
                  </div>
                </div>
              ) : (
                <BookButton note={`${note} — pricing`} className="mt-6">
                  Which do I need? Get my free plan
                </BookButton>
              )}
```

4. **Replace the Footer Section CTA (around line 224):**
```tsx
      {isHomeOffice || isOfficeTransform ? (
        <section className="section border-t border-border pb-28 md:pb-16" aria-labelledby="call-now">
          <div className="container-x text-center">
            <h2 id="call-now" className="h-section">
              {isOfficeTransform ? "Ready to transform your office space?" : `Ready to get your ${s.short.toLowerCase()} done?`}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {isOfficeTransform
                ? "Call or text for a free consultation and quote. We'll assess your space, discuss your needs, and give you a transparent one-time price."
                : "Call or text and we'll confirm your price and a time that works. Seniors and accessibility needs welcome."}
            </p>

            {/* Desktop buttons */}
            <div className="mt-6 hidden items-center justify-center gap-3 sm:flex">
              {showCal && (
                <InstallBookButton note={`${s.slug}-footer`} variant="ignite" className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                  Book online
                </InstallBookButton>
              )}
              <a
                href={SITE.phone.href}
                data-call-location={`${s.slug}-footer`}
                className="btn-chrome inline-flex items-center gap-2"
              >
                <Phone className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                Call {SITE.phone.display}
              </a>
            </div>

            {/* Mobile buttons */}
            <div className="mt-6 flex flex-col gap-2.5 sm:hidden">
              <a
                href={SITE.phone.href}
                data-call-location={`${s.slug}-footer`}
                className="btn-ignite inline-flex w-full items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                Call {SITE.phone.display}
              </a>
              {showCal && (
                <InstallBookButton note={`${s.slug}-footer`} variant="chrome" className="w-full inline-flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                  Book online
                </InstallBookButton>
              )}
            </div>
          </div>
        </section>
      ) : (
        <BookingSection note={note} prefill={prefill} />
      )}
```

---

## STEP 9: UPDATE STICKY MOBILE BAR IN `src/components/site/MobileActionBar.tsx`
Open `src/components/site/MobileActionBar.tsx`.
Replace lines 29-42 with:

```tsx
  if (CALL_FIRST_SLUGS.some((slug) => pathname === `/services/${slug}`))
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <CallLink
            location={`${pathname.split("/").pop()}-sticky-mobile`}
            className="btn-ignite flex flex-1 items-center justify-center gap-2 whitespace-nowrap !py-3.5 !text-base font-bold shadow-lg"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Call now
          </CallLink>
          <InstallBookButton
            note={`${pathname.split("/").pop()}-sticky-mobile`}
            variant="chrome"
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap !py-3.5 !text-base"
          >
            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
            Book online
          </InstallBookButton>
        </div>
      </div>
    );
```
*(Make sure to import `Calendar` from `lucide-react` at the top of `MobileActionBar.tsx`.)*

---

## STEP 10: VERIFICATION & SMOKE TEST
Execute these commands in the shell:
```bash
bun run typecheck
bun run build:client
```
1. Verify that `bun run typecheck` passes with zero errors.
2. Open `http://localhost:5173/services/home-office-setup` and `http://localhost:5173/services/pos-system-setup`.
3. Check mobile resolution (<640px):
   - Phone button is glowing orange `btn-ignite`.
   - `Call (678) 558-4327` never breaks into two lines.
   - Sticky bottom bar shows `Call now` (orange) and `Book online` (slate).
4. Check desktop resolution (>640px):
   - "Book online" is glowing orange `btn-ignite`.
   - Clicking "Book online" opens the native Cal.com calendar modal with month view and dark teal brand theme.
   - `Call (678) 558-4327` is clean slate `btn-chrome`.
