// /google-ads-for-local-business — the Google Search ad landing page for "Google Ads for local service businesses".
// One promise, home-service proof only, and every button opens the calendar (or the phone).
import { ArrowRight, Check, Phone } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { GoogleAdProof } from "@/components/blocks/Proof";
import { InlineBooking } from "@/components/booking/InlineBooking";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { LOCAL_GOOGLE_ADS_FAQS } from "@/content/faqs";
import { price } from "@/content/pricing";
import { SITE } from "@/config/site";

const SOURCE = "Google Ads local landing";

export default function GoogleAdsLocal() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="hero-rise min-w-0">
            <p className="chip">For appliance repair, HVAC, plumbing, cleaning &amp; handymen</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[56px]">
              <span className="text-chrome-grad">Get more calls from</span> <span className="text-turbo-grad">people searching Google.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We build your Google search campaign, block the junk searches, and track every call and form, so you know exactly what your ad money brings in.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <BookButton className="btn-shine" note={`${SOURCE} — hero`}>
                Book my free 30-min call <ArrowRight className="h-4 w-4" aria-hidden />
              </BookButton>
              <CallLink location="google ads landing hero" className="btn-chrome">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
            </div>
            <ul className="mt-6 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {["No long-term contracts", "You own the ad account", "Every call & form tracked", "Founder-run, Tampa-based"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <GoogleAdProof compact />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works</span>} lede="You keep running jobs. We handle the ads." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Free 30-minute call", b: `${SITE.founder.name} looks at your Google profile, website and any ads you run now, and tells you what would bring in calls.` },
              { t: "We build and track it", b: "Search campaign, junk-search blocking, and call and form tracking, all in your own Google Ads account." },
              { t: "Your phone rings", b: "Leads come straight to you. We tune the ads every week and show you the spend, the calls and what's next." },
            ].map((s, i) => (
              <li key={s.t} className="panel p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo/10 font-display font-bold text-turbo">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Setup <span className="font-semibold text-foreground">{price("pkg-start")}</span> one-time, then <span className="font-semibold text-foreground">{price("growth")}/mo</span> with your ads managed every week. Ad spend goes straight to Google from your own card.
          </p>
          <div className="mt-6">
            <BookButton note={`${SOURCE} — how it works`}>Book my free 30-min call</BookButton>
          </div>
        </div>
      </section>

      {/* The calendar itself, no quiz in front of it: pick a time, or call. */}
      <section id="book" className="section scroll-mt-16 border-t border-border" aria-labelledby="pick">
        <div className="container-x max-w-3xl">
          <SectionHeader title={<span id="pick">Pick a time for your free call</span>} lede={`30 minutes with ${SITE.founder.name}. Or call ${SITE.phone.display} now.`} />
          <InlineBooking source={`${SOURCE} — calendar`} className="mt-8" />
        </div>
      </section>

      <FAQList faqs={LOCAL_GOOGLE_ADS_FAQS} title="Quick answers" />
    </>
  );
}
