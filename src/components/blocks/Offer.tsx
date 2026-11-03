import { Link } from "react-router-dom";
import { ArrowRight, Check, Gift, ShieldCheck } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { PACKAGES, PRICING_TERMS, alaCarte, byId, usd } from "@/content/pricing";
import { AD_TOTALS, GOOGLE_AD_RESULT, money } from "@/content/results";

const LAUNCH = PACKAGES.find((p) => p.id === "pkg-launch")!;
const CARE = byId("care");

/**
 * The Grand Slam offer (Hormozi, $100M Offers): dream outcome, proof, low effort, a value stack priced
 * from the real price list, bonuses, and the leads-or-free guarantee. Every number comes from content files.
 */
export function GrandSlamOffer({ note = "Offer" }: { note?: string }) {
  const stack = (LAUNCH.replaces ?? []).map(byId);
  const bonuses = ["2 NFC Google review cards", `First month of ${CARE.name} free (${usd(CARE.price)} value)`, "Your own booking calendar", "Ad campaigns on your 2 best-fit platforms"];
  const value = alaCarte(LAUNCH) + CARE.price;
  return (
    <section className="section border-t border-border" aria-labelledby="offer">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="chip">The Booked-Out System</p>
          <h2 id="offer" className="h-section mt-4">More booked calls from Google, ChatGPT and ads. Or we keep working for free.</h2>
          <p className="lede mx-auto">
            One done-for-you package: a website built to rank and convert, every profile set up, every call tracked, and ads switched on. Our clients' Meta leads average {money(AD_TOTALS.avgCpl)}, and Google Ads conversions have cost as little as {money(GOOGLE_AD_RESULT.costPer)}.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6 sm:p-8">
            <p className="font-display text-lg font-bold">What you get</p>
            <ul className="mt-4 divide-y divide-border">
              {stack.map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <span className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {i.name}
                  </span>
                  <span className="shrink-0 text-muted-foreground line-through">{usd(i.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 font-display text-base font-bold">
              <Gift className="h-5 w-5 text-ignite" aria-hidden /> Bonuses included
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {bonuses.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-5">
              <div>
                <p className="text-sm text-muted-foreground">Bought separately: <span className="line-through">{usd(value)}</span></p>
                <p className="font-display text-3xl font-bold text-turbo-grad">{usd(LAUNCH.price)} one-time</p>
              </div>
              <Link to="/pricing" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                All prices <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="cta-glow force-dark rounded-3xl p-6 sm:p-8">
              <ShieldCheck className="h-8 w-8 text-turbo" aria-hidden />
              <p className="mt-3 font-display text-xl font-bold">Leads-or-free guarantee</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If the ads we launch don't bring you a lead in their first 30 days live, we keep managing them with no management fee until they do. Your ad budget stays on and goes straight to the platform.
              </p>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                { t: "We do all of it", b: "Site, profiles, tracking and ads. You answer the phone." },
                { t: "Proof before you pay", b: "Real, unedited dashboards on our results page." },
                { t: "No contracts, you own it all", b: "Your site, domain, ad accounts and data stay yours." },
              ].map((x) => (
                <li key={x.t} className="panel p-4">
                  <p className="font-semibold">{x.t}</p>
                  <p className="mt-0.5 text-muted-foreground">{x.b}</p>
                </li>
              ))}
            </ul>
            <BookButton note={note} className="btn-shine w-full justify-center">Claim my free strategy call</BookButton>
          </div>
        </div>
      </div>
    </section>
  );
}
