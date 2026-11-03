// Price cards and the compact price box: the same numbers as /pricing (src/content/pricing.ts).
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PACKAGES, PRICING_TERMS, alaCarte, perDay, usd, type PriceItem } from "@/content/pricing";
import { BookButton } from "@/components/cta/Actions";
import { cn } from "@/lib/utils";

export function PriceCard({ p, compact = false }: { p: PriceItem; compact?: boolean }) {
  return (
    <li className={cn("panel relative flex flex-col p-6", p.popular && "ring-1 ring-turbo/60")}>
      {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-turbo px-3 py-1 text-xs font-bold text-background">Most picked</span>}
      <h3 className="text-lg font-semibold leading-snug">{p.name}</h3>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight text-chrome-grad">{usd(p.price)}</span>
        <span className="text-sm text-muted-foreground">{p.billing === "month" ? "/month" : "one-time"}</span>
      </p>
      {p.billing === "month" && <p className="mt-1 text-xs text-muted-foreground">{perDay(p.price)}</p>}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
      {!compact && (
        <ul className="mt-5 space-y-2.5 text-sm">
          {p.includes.map((i) => (
            <li key={i} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      )}
      {p.service && (
        <Link to={`/services/${p.service}`} className="mt-auto pt-5 text-sm font-medium text-turbo underline-offset-4 hover:underline">
          How it works <span aria-hidden>›</span>
        </Link>
      )}
    </li>
  );
}

/** Compact price box for service pages: the same numbers as /pricing. */
export function PriceBox({ items }: { items: PriceItem[] }) {
  if (!items.length) return null;
  return (
    <div className="panel p-6 sm:p-8">
      <p className="text-sm font-medium text-turbo">Pricing</p>
      <ul className="mt-4 divide-y divide-border">
        {items.map((p) => (
          <li key={p.id} className="flex items-baseline justify-between gap-4 py-3">
            <span className="text-[15px]">{p.name}</span>
            <span className="whitespace-nowrap font-display text-lg font-bold">
              {usd(p.price)}
              <span className="ml-1 font-body text-xs font-normal text-muted-foreground">{p.billing === "month" ? "/mo" : "one-time"}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">{PRICING_TERMS.contract}</p>
      <Link to="/pricing" className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
        See all prices <span aria-hidden>›</span>
      </Link>
    </div>
  );
}

/** Setup package card: price, what it would cost piece by piece, everything included, and a book button. */
export function PackageCard({ p, source, featured = false }: { p: PriceItem; source: string; featured?: boolean }) {
  const value = alaCarte(p);
  const hot = featured || p.popular;
  return (
    <li className={cn("panel relative flex flex-col p-6 sm:p-7", hot && "cta-glow ring-2 ring-turbo/70")}>
      {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-ignite px-3 py-1 text-xs font-bold text-[hsl(220_38%_6%)]">Most popular</span>}
      <h3 className="text-xl font-bold leading-snug">{p.name}</h3>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-4xl font-bold tracking-tight text-chrome-grad sm:text-5xl">{usd(p.price)}</span>
        <span className="text-sm text-muted-foreground">one-time</span>
      </p>
      {value > p.price && (
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground line-through">{usd(value)}</span> <span className="font-semibold text-turbo">if bought piece by piece — save {usd(value - p.price)}</span>
        </p>
      )}
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.summary}</p>
      <ul className="mt-5 space-y-2.5 text-sm">
        {p.includes.map((i) => (
          <li key={i} className="flex gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
            {i}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <BookButton note={`${source} — ${p.name}`} prefill={`Interested in ${p.name} (${usd(p.price)})`} variant={hot ? "ignite" : "chrome"} className="w-full justify-center">
          Book a free call about {p.name.split(" — ")[0]}
        </BookButton>
        <p className="mt-2 text-center text-xs text-muted-foreground">{PRICING_TERMS.payment.split(".")[0]}.</p>
      </div>
    </li>
  );
}

/** The three setup packages side by side (Launch in the middle). */
export function PackageGrid({ source }: { source: string }) {
  return (
    <ul className="grid gap-6 pt-3 lg:grid-cols-3">
      {PACKAGES.map((p) => (
        <PackageCard key={p.id} p={p} source={source} />
      ))}
    </ul>
  );
}
