import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { price } from "@/content/pricing";

/** Step two after the card: the site and ads that turn the new reviews into calls. Used on the shop and the post-purchase setup page. */
export function CardUpsell({ where, id = "more" }: { where: string; id?: string }) {
  const rungs = [
    { name: "Turbo Start", p: price("pkg-start"), sub: "one time", pts: ["Google Business Profile tuned up", "Tracking so you see every call", "1 ad campaign launched"], to: "/pricing" },
    { name: "Turbo Launch", p: price("pkg-launch"), sub: "one time", pts: ["New website, up to 7 pages", "Ads on your 2 best platforms", "2 NFC review cards included", "First month of Care free"], to: "/pricing", popular: true },
    { name: "Ads management", p: `${price("growth")}/mo`, sub: "no contract", pts: ["We run and tune your ads", "You own the ad account", "Monthly report in plain English"], to: "/services/google-ads" },
  ];
  return (
    <section className="section border-t border-border" aria-labelledby={id}>
      <div className="container-x">
        <p className="text-sm font-semibold text-[hsl(var(--ignite-hot))]">Reviews are step one</p>
        <h2 id={id} className="h-section mt-2 max-w-3xl">
          Now get the site and ads that turn those reviews into calls.
        </h2>
        <p className="lede max-w-2xl">Reviews get you found. A fast site and the right ads make sure the person who finds you picks up the phone. Done for you by Christopher, no long contract.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {rungs.map((r) => (
            <li key={r.name} className={`panel flex flex-col p-6 ${r.popular ? "ring-1 ring-turbo/60" : ""}`}>
              {r.popular && <span className="chip mb-3 w-fit">Best value · cards included</span>}
              <h3 className="font-display text-lg font-bold">{r.name}</h3>
              <p className="mt-1 font-display text-3xl font-bold">
                {r.p} <span className="text-sm font-normal text-muted-foreground">{r.sub}</span>
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {r.pts.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <Link to={r.to} className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                See what's included <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <BookButton note={`${where} — card upsell`} prefill="I'm getting review cards and want help with a website and ads to get more calls.">
            Book my free 30-min call
          </BookButton>
          <Link to="/free-audit" className="btn-chrome">
            Run my free visibility audit
          </Link>
        </div>
      </div>
    </section>
  );
}
