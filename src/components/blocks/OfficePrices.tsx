// The one office price list, used on every office page (/office-setup-tampa, the office /services pages and
// /business-tech-setup-tampa): three big cards, three plain lines each, no fine print. Older visitors read
// the price first, so the number is the biggest thing on each card.
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { byId, usd } from "@/content/pricing";
import { cn } from "@/lib/utils";

export const OFFICE_TIERS = [
  {
    id: "office-basic",
    name: "Desk setup",
    price: usd(byId("office-basic").price),
    note: "per desk",
    items: ["Computer and screen hooked up", "Printer and Wi-Fi connected", "Updates and programs installed"],
  },
  {
    id: "office-complete",
    name: "Full workstation",
    price: usd(byId("office-complete").price),
    note: "per desk",
    items: ["Two or three screens mounted", "Every cable hidden and tied", "Desk built and network set up"],
    popular: true,
  },
  {
    id: "office-transform-basic",
    name: "Whole office",
    price: `from ${usd(byId("office-transform-basic").price)}`,
    note: "price in writing",
    items: ["Every desk in the office", "Wi-Fi, printers and TVs", "Cleanup and a walkthrough"],
  },
] as const;

/** Lowest office price, for "From $99 per desk" lines. */
export const OFFICE_FROM = `From ${OFFICE_TIERS[0].price} per desk`;

export function OfficePrices({ cta, className }: { cta?: (tier: (typeof OFFICE_TIERS)[number]) => ReactNode; className?: string }) {
  return (
    <div className={className}>
      <ul className="grid gap-4 lg:grid-cols-3">
        {OFFICE_TIERS.map((t) => (
          <li key={t.id} className={cn("panel relative flex flex-col p-6 sm:p-7", "popular" in t && t.popular && "ring-2 ring-turbo")}>
            {"popular" in t && t.popular && <span className="absolute -top-3 left-6 rounded-full bg-turbo px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">Most booked</span>}
            <h3 className="font-display text-xl font-bold">{t.name}</h3>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
              <span className="whitespace-nowrap font-display text-4xl font-bold sm:text-5xl">{t.price}</span>
              <span className="text-base text-muted-foreground">{t.note}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5 text-base">
              {t.items.map((i) => (
                <li key={i} className="flex gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            {cta && <div className="mt-6">{cta(t)}</div>}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-base text-muted-foreground">
        Labor only. Extras like TV mounts or more Wi-Fi? We tell you the price before we start. You pay when it's done.
      </p>
    </div>
  );
}
