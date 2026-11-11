import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import { fromPriceLabel } from "@/config/site";
import { ReviewCard3D } from "@/components/visuals/ReviewVisuals";
import { SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

// Kept out of Sales.tsx so the eagerly loaded home page doesn't pull the whole sales module into the first download.

/** Promo for the Google review card store, used on the homepage and local-business page. */
export function ReviewCardPromo({ headingLevel = "h2", title = "Turn “I'll leave you a review” into a review." }: { headingLevel?: "h1" | "h2"; title?: string }) {
  const H = headingLevel;
  const points = [
    "Customers tap their phone — your Google review form opens",
    "Works on every iPhone XS+ and NFC Android phone",
    "No app for customers, no subscription",
    "Program it yourself in minutes with our setup guide",
  ];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[420px]">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
        <ReviewCard3D tap className="w-full max-w-[340px]" />
      </div>
      <div>
        <p className="text-sm font-medium text-turbo">Google review cards · from {fromPriceLabel}</p>
        <H className={H === "h1" ? "mt-2 text-4xl font-bold leading-[1.02] sm:text-6xl" : "h-section mt-2"}>{title}</H>
        <p className="lede">Most customers mean to review you and forget. Put a tap card where they pay and the review happens before they walk out — more stars, more trust, more calls.</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[15px]">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Link to={SHOP_PATH} className="btn-ignite btn-shine">
            Buy Google Review Cards <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={SETUP_PATH} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
            How setup works
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * One-row review card ad for sprinkling across pages: photo, what it does, price, Buy button.
 * Every placement is a crawlable link to the store with the product name in it (SEO/AEO/GEO internal links).
 */
export function ReviewCardStrip({ where, className, title = "Google review cards", line = "Customers tap their phone and your Google review form opens. iPhone & Android, no app, no subscription." }: { where: string; className?: string; title?: string; line?: string }) {
  return (
    <div className={cn("panel flex flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:gap-5 sm:p-5", className)}>
      <img src="/img/review-cards/hd/card-tap-800.webp" alt="Phone tapped on a CEO Turbo NFC Google review card with the review form open" width={96} height={96} loading="lazy" decoding="async" className="hidden h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:block" />
      <div className="flex-1">
        <p className="font-display text-lg font-bold leading-tight">
          <Star className="-mt-1 mr-1.5 inline h-5 w-5 fill-current text-amber-400" aria-hidden />
          {title} <span className="whitespace-nowrap text-sm font-semibold text-turbo">from {fromPriceLabel}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{line}</p>
      </div>
      <Link to={SHOP_PATH} onClick={() => track("review_card_promo_click", { source: where })} className="btn-ignite inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap !px-4 !py-3 !text-sm">
        Buy Google Review Cards <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
