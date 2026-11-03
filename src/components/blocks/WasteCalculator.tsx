import { useId, useState } from "react";
import { price, usd } from "@/content/pricing";
import { BookButton } from "@/components/cta/Actions";
import { track } from "@/lib/track";

const RESCUE = () => Number(price("conversion-rescue").replace(/[^0-9]/g, ""));
const WATCH = () => Number(price("tracking-watch").replace(/[^0-9]/g, ""));

/**
 * "What is wasted ad spend costing you?" Visitors enter their own spend and their own estimate of the waste.
 * The default percentage is only a starting point to play with, never presented as an industry statistic.
 */
export function WasteCalculator({ source = "Waste calculator" }: { source?: string }) {
  const id = useId();
  const [spend, setSpend] = useState(1500);
  const [pct, setPct] = useState(25);
  const [touched, setTouched] = useState(false);
  const rescue = RESCUE();
  const watch = WATCH();

  const wastedMonth = Math.round((spend * pct) / 100);
  const wastedYear = wastedMonth * 12;
  const recoveredMonth = Math.round(wastedMonth / 2);
  const netMonth = recoveredMonth - watch;
  const paybackMonths = netMonth > 0 ? Math.max(1, Math.ceil(rescue / netMonth)) : null;
  const firstYearCost = rescue + watch * 12;

  const touch = () => {
    if (!touched) {
      setTouched(true);
      track("waste_calculator_use", { source });
    }
  };

  return (
    <div className="audit-card rounded-3xl p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">What is wasted ad spend costing you?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Enter what you spend on ads and your own guess at how much of it doesn't bring a call, booking or sale.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label htmlFor={`${id}-spend`} className="text-sm font-medium text-chrome">
              Monthly ad spend
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-display text-2xl font-bold" aria-hidden>
                $
              </span>
              <input
                id={`${id}-spend`}
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={spend}
                onChange={(e) => {
                  touch();
                  setSpend(Math.max(0, Math.min(1_000_000, Number(e.target.value) || 0)));
                }}
                className="min-h-[48px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-lg font-semibold outline-none focus:border-turbo"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-pct`} className="flex items-baseline justify-between text-sm font-medium text-chrome">
              <span>Share that gets wasted (your estimate)</span>
              <span className="font-display text-xl font-bold text-turbo">{pct}%</span>
            </label>
            <input
              id={`${id}-pct`}
              type="range"
              min={5}
              max={70}
              step={5}
              value={pct}
              onChange={(e) => {
                touch();
                setPct(Number(e.target.value));
              }}
              className="mt-3 w-full accent-[#ff6b1a]"
            />
            <p className="mt-2 text-xs text-muted-foreground">Starting point only. The audit finds your real number, so it's fine to guess.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
          <p className="text-sm text-muted-foreground">Wasted on ads, at your estimate</p>
          <p className="font-display text-4xl font-bold text-ignite sm:text-5xl" aria-live="polite">
            {usd(wastedMonth)}
            <span className="text-lg font-normal text-muted-foreground"> a month</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{usd(wastedYear)} a year.</p>
          <hr className="my-4 border-white/10" />
          <p className="text-sm">
            Fixing it: <strong>{usd(rescue)}</strong> once, then <strong>{usd(watch)}/mo</strong> to keep it clean. First year: <strong>{usd(firstYearCost)}</strong>.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {paybackMonths
              ? `Illustration: if you got back just half of that waste (${usd(recoveredMonth)} a month), the fix pays for itself in about ${paybackMonths} month${paybackMonths === 1 ? "" : "s"}.`
              : "At this spend the monthly saving is small, so start with the one-time Rescue and skip the monthly plan."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <BookButton note={source} prefill={`Ad spend about ${usd(spend)} a month. I'd like a Conversion Rescue.`}>
          Find my wasted spend, free call
        </BookButton>
        <p className="text-xs text-muted-foreground">Estimates, not promises. What you recover depends on your ads, offer and market.</p>
      </div>
    </div>
  );
}
