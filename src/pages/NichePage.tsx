// Shared template for /salons and /barbershops. Same flow as /restaurants, shorter:
// the promise → where the card goes → a checkup → buy a card or book the free call → FAQ.
import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { FAQList } from "@/components/blocks/Basics";
import { StepHead, Tick } from "@/components/blocks/Tutorial";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { fromPriceLabel } from "@/config/site";
import type { Niche } from "@/content/niches";
import { track } from "@/lib/track";

export function NichePage({ niche }: { niche: Niche }) {
  const [name, setName] = useState("");
  const prefill = `${niche.bookPrefill}${name.trim() ? ` Business: ${name.trim()}.` : ""}`;

  return (
    <>
      <section className="section pt-24 sm:pt-32">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-turbo">{niche.kicker}</p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.02] sm:text-7xl">{niche.h1}</h1>
            <p className="lede mt-5">{niche.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton note={`${niche.bookNote} — hero`} prefill={prefill} className="btn-shine">
                Book my free call
              </BookButton>
              <a href="#cards" onClick={() => track("niche_cards_jump", { page: niche.path })} className="btn-chrome">
                Review cards — from {fromPriceLabel}
              </a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Rather talk now? Call or text <CallLink location={`${niche.path} hero`} className="font-semibold text-foreground underline underline-offset-4" />.
            </p>
          </div>
          <div className="panel p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-turbo">Where the card goes</p>
            <ul className="mt-4 grid gap-4">
              {niche.spot.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-x">
          <StepHead n={1} kicker="Free checkup" title={<>Five things every shop should have. <span className="text-turbo-grad">Check yours.</span></>} />
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {niche.checkup.map((c) => (
              <Tick key={c}>
                <span className="text-[16px]">{c}</span>
              </Tick>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="niche-name">Your business name</label>
            <input
              id="niche-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your business name"
              autoComplete="organization"
              maxLength={60}
              className="field !text-[17px] sm:max-w-xs"
            />
            <BookButton note={`${niche.bookNote} — checkup`} prefill={prefill}>
              Check my listing on the free call
            </BookButton>
          </div>
        </div>
      </section>

      <section id="cards" className="section border-t border-border [&_#buy]:scroll-mt-6">
        <div className="container-x">
          <h2 className="h-section mb-6">Just want the cards first?</h2>
          <p className="lede mb-8">Tap-to-review cards for the counter, the mirror and the bag. Ships in 1–2 business days from Atlanta.</p>
          <BuyBox business={name} onBusiness={setName} headingLevel="h2" stickyBar={false} />
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-x">
          <ul className="grid gap-3 md:grid-cols-3">
            {["Google reviews that stay up", "No discounts for reviews, ever", "Free call, fixed price, no monthly lock-in"].map((t) => (
              <li key={t} className="panel flex items-center gap-3 p-5">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                <span className="font-semibold">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQList faqs={niche.faqs} title={niche.faqSection} />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-7 text-center sm:p-12">
            <h2 className="h-section">{niche.finalTitle}</h2>
            <p className="lede mx-auto">{niche.finalLede}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BookButton note={`${niche.bookNote} — final`} prefill={prefill} className="btn-shine">
                Book my free call
              </BookButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
