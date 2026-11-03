// Sections shared by the Brand Boost page (/brand-boost, indexed) and the ad landing page (/book, noindex).
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, FileText, Search, Target, X } from "lucide-react";
import { BOOKING, SITE } from "@/config/site";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { price } from "@/content/pricing";
import { InlineBooking } from "@/components/booking/InlineBooking";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats } from "@/components/blocks/Proof";
import { SectionHeader } from "@/components/blocks/Basics";
import { PlatformLogos } from "@/components/visuals/PlatformLogos";
import { BookButton } from "@/components/cta/Actions";

/** Headline + promise on the left, the live calendar on the right (stacked under the headline on phones). Questions live on the Cal.com form. */
export function BoostHero({ title, lede, source, top }: { title: ReactNode; lede: ReactNode; source: string; top?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-ignite opacity-70" aria-hidden />
      <div className="container-x relative">
        {top}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise lg:pt-6">
            <p className="chip">
              Free · {BOOKING.length} · founder-led · video or phone
            </p>
            <h1 className="mt-5 text-[36px] font-bold leading-[1.03] sm:text-6xl">{title}</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">{lede}</p>
            <ul className="mt-6 hidden max-w-xl gap-2.5 text-[15px] sm:grid sm:grid-cols-2">
              {["No pitch deck, no pressure", "Published prices — no surprises", "Real results, real dashboards", "Keep the plan either way"].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 hidden text-sm text-muted-foreground lg:block">
              {AD_TOTALS.leads} Meta leads at {money(AD_TOTALS.avgCpl)} average · {CLIENTS.length} client sites live · {SITE.founder.name} runs every call himself
            </p>
          </div>
          <div className="panel p-4 sm:p-6">
            <h2 className="font-display text-xl font-bold sm:text-2xl">Pick a time for your free call</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Free · {BOOKING.length} · {SITE.founder.name} runs every call
            </p>
            <InlineBooking source={source} className="mt-4" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Rather talk now?{" "}
              <CallLink location={`${source} — hero`} className="inline-flex min-h-[44px] items-center font-semibold text-turbo underline underline-offset-2">
                Call {SITE.phone.display}
              </CallLink>
            </p>
          </div>
        </div>
        <PlatformLogos className="mt-14" />
        <div className="mt-12">
          <ProofStats />
        </div>
      </div>
    </section>
  );
}

export function WalkAway() {
  return (
    <section className="section" aria-labelledby="get">
      <div className="container-x">
        <SectionHeader center title={<span id="get">What will you walk away with?</span>} lede="Thirty minutes. Three things you can act on the same day — with or without us." />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Search, title: "Where you're invisible", body: "How you show up on Google, Maps, ChatGPT and social right now — and where customers are slipping to competitors." },
            { icon: Target, title: "Your #1 money move", body: "The single change that would bring in the most calls, sales or listeners fastest. Not a 40-item to-do list." },
            { icon: FileText, title: "A fixed-price plan", body: "Built from our published prices, so you know your budget before you say yes. Keep the plan either way." },
          ].map((c) => (
            <li key={c.title} className="panel p-6">
              <c.icon className="h-6 w-6 text-turbo" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FitCheck() {
  return (
    <section className="section border-t border-border" aria-labelledby="fit">
      <div className="container-x">
        <SectionHeader center title={<span id="fit">Is this call for you?</span>} lede="We keep calls for people we can actually help. Be honest with yourself here." />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="panel p-6">
            <p className="font-semibold text-turbo">Book if you are…</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              {["A local business that wants more calls and 5-star reviews", "An artist who wants more listeners, fans or bookings", "A store owner who wants traffic that actually buys", "Ready to invest in growth once you see the plan"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="font-semibold text-muted-foreground">Probably not a fit if you…</p>
            <ul className="mt-4 space-y-3 text-[15px] text-muted-foreground">
              {["Want overnight results with zero budget", "Can't take on more customers right now", "Just want someone to agree with you"].map((t) => (
                <li key={t} className="flex gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 opacity-60" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Price transparency right on the booking page: people book when they aren't afraid of the number. */
export function PriceTeaser({ source }: { source: string }) {
  const rows = [
    { label: "Turbo Start — fix what you have", value: `${price("pkg-start")} one-time` },
    { label: "Turbo Launch — the whole package", value: `${price("pkg-launch")} one-time` },
    { label: "Turbo Care — security, updates, SEO", value: `${price("care")}/mo` },
    { label: "Turbo Growth — Care + ads managed", value: `${price("growth")}/mo` },
  ];
  return (
    <section className="section border-t border-border" aria-labelledby="cost">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader title={<span id="cost">What does it cost after the call?</span>} lede="The call is free. If you want our help, every service has a published price — setup once, monthly only for work that keeps paying off. No contracts." />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton note={`${source} — pricing`}>Get my free plan</BookButton>
            <Link to="/pricing" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See every price
            </Link>
          </div>
        </div>
        <ul className="panel divide-y divide-border p-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-4">
              <span>{r.label}</span>
              <span className="whitespace-nowrap font-display text-lg font-bold">{r.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
