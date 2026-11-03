// Ad landing page (Meta / instant-form thank-you screen) and the post-booking confirmation.
// Focus layout: no menu, no footer links — every click goes to the calendar.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Check } from "lucide-react";
import { SITE } from "@/config/site";
import { BOOK_FAQS } from "@/content/faqs";
import { AD_TOTALS, money } from "@/content/results";
import { Founder, VideoPitch } from "@/components/blocks/Sales";
import { AdResultsGrid, BestResults, StripeProof } from "@/components/blocks/Proof";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { FitCheck } from "@/components/blocks/Boost";
import { ShopCardsButton } from "@/components/cta/Actions";
import { InlineBooking } from "@/components/booking/InlineBooking";
import { CallLink } from "@/components/site/CallLink";
import { trackBooked } from "@/lib/track";

const SOURCE = "Ad page";

export default function Book() {
  return (
    <>
      {/* Ad traffic lands on the calendar itself: pick a time or call, nothing to fill in first. */}
      <section className="relative overflow-clip pt-24 sm:pt-28" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="hero-rise min-w-0 lg:sticky lg:top-28">
            <p className="chip">Free 30-minute call</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl">
              <span className="text-chrome-grad">More calls and bookings</span> <span className="text-turbo-grad">for your business.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Pick a time. {SITE.founder.name} looks at your ads, Google profile and website with you, live, and tells you what would bring in more customers. No pressure.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {["We review your website, Google profile and ads with you, live", "You leave with a written plan, whether you hire us or not", "Every ad campaign we run is backed by our leads-or-free guarantee"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <CallLink location="book page hero" icon className="btn-chrome mt-6">
              Or call {SITE.phone.display}
            </CallLink>
          </div>
          <div id="book" className="min-w-0 scroll-mt-20">
            <InlineBooking source={`${SOURCE} — hero calendar`} />
          </div>
        </div>
      </section>


      <section id="results" className="section scroll-mt-20 border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader title={<span id="proof">Does this actually work?</span>} lede={`Unedited ad dashboards from client campaigns. On Meta alone: ${AD_TOTALS.leads} leads for ${money(AD_TOTALS.leadSpend)} total.`} />
          <div className="mt-12">
            <BestResults />
          </div>
          <div className="mt-8">
            <AdResultsGrid keys={["appliance-king", "mor-handy-carpet", "stackmode-repair"]} />
          </div>
          <div className="mt-12">
            <StripeProof compact />
          </div>
          <div className="mt-12 text-center">
            <a href="#book" className="btn-ignite btn-shine">
              Pick my call time
            </a>
          </div>
        </div>
      </section>

      <FitCheck />

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <VideoPitch note="Ad page video" />
          <Founder />
        </div>
      </section>

      <FAQList faqs={BOOK_FAQS} title="Still on the fence?" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 className="h-section">Ready for more calls?</h2>
            <p className="lede mx-auto">Pick a time, or call {SITE.phone.display} now.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#book" className="btn-ignite btn-shine !px-8 !py-4 !text-base">
                Pick my call time
              </a>
              <CallLink location="book page final" icon className="btn-chrome">
                Call {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function Booked() {
  // Cal.com → event → Advanced → "Redirect on booking" to https://www.ceoturbo.com/booked with
  // "Forward parameters" on, so the booking uid (dedup with the server-side event) and email arrive here.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const uid = q.get("uid") || q.get("bookingUid") || undefined;
    const email = q.get("email") || undefined;
    const name = q.get("name") || undefined;
    trackBooked("redirect", uid, email ? { email, name } : undefined);
    if (q.toString()) window.history.replaceState(null, "", window.location.pathname);
  }, []);
  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo opacity-70" aria-hidden />
      <div className="container-x relative max-w-2xl text-center">
        <CalendarCheck className="mx-auto h-14 w-14 text-turbo" aria-hidden />
        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">You're booked. Here's how to get the most from your call.</h1>
        <p className="mt-5 text-lg text-muted-foreground">Check your email for the calendar invite. To make the 30 minutes count:</p>
        <ol className="mx-auto mt-8 max-w-lg space-y-4 text-left">
          {[
            "Add the call to your calendar now and show up a minute early.",
            "Have your website, Google profile and social links handy.",
            "Know your number: how many more customers or listeners do you want a month?",
          ].map((t, i) => (
            <li key={t} className="panel flex gap-4 p-4">
              <span className="font-display text-xl font-bold text-turbo">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-muted-foreground">While you wait — want more Google reviews right away?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <ShopCardsButton />
          <Link to="/results" className="btn-chrome">
            See client results
          </Link>
        </div>
      </div>
    </section>
  );
}
