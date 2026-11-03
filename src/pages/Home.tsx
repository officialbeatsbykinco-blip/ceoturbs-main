import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Scissors, Smartphone, Store, Trees, Wrench } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { CompareTable } from "@/components/blocks/CompareTable";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { ReviewStats } from "@/components/blocks/ReviewStats";
import { BulkBand, ContactBand, ReviewGoalCalculator, SpecsAndGuarantee, TrustStrip } from "@/components/shop/StoreSections";
import { Reveal } from "@/components/blocks/Tutorial";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { StickTap } from "@/components/visuals/StickTap";
import { CARD_PROGRAMMING, REVIEW_CARD, fromPriceLabel, money2 } from "@/config/site";
import { COMPARE, SETUP_PATH, SHOP_FAQS } from "@/content/review-cards";
import { recallBusiness } from "@/lib/review-link";

const WHO = [
  { icon: Scissors, t: "Barbers & stylists", b: "Hold it out after the mirror reveal, while they still love the cut." },
  { icon: Trees, t: "Lawn care crews", b: "Keep one in the truck. Ask while they're looking at the fresh yard." },
  { icon: Wrench, t: "Mobile repair & detailing", b: "The second it works again is the second to ask." },
  { icon: Store, t: "Stores & restaurants", b: "Leave it on the table or counter. People tap while they wait or pay." },
];

const STEPS = [
  { t: "Hand it over", b: "Hold the card out, or point to it on the counter." },
  { t: "They tap", b: "Their phone opens your Google review form. No app needed." },
  { t: "You get the review", b: "They pick the stars and post before you leave." },
];

/** The store. Everything on this page sells the card; the agency lives at /grow, one quiet link at the bottom. */
export default function Home() {
  const [business, setBusiness] = useState("");
  useEffect(() => setBusiness((b) => b || recallBusiness()), []);

  return (
    <>
      <section className="relative overflow-clip pt-[76px] sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative pb-10">
          <BuyBox business={business} onBusiness={setBusiness} />
        </div>
      </section>

      <TrustStrip />

      <section className="section border-t border-border" aria-labelledby="hand-it-over">
        <div className="container-x text-center">
          <h2 id="hand-it-over" className="h-section mx-auto max-w-3xl">Hand it over. They tap. You get the review.</h2>
          <p className="lede mx-auto max-w-2xl">No “search for us on Google.” No QR code to scan. Their phone opens your review form, they tap five stars, done.</p>
          <StickTap className="mx-auto mt-8 w-full max-w-[640px] text-foreground" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x">
          <SectionHeader kicker="Who it's for" title={<span id="who">Works wherever you work.</span>} lede="Wallet size and waterproof. Keep it on you, or leave it out for customers." />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <li key={w.t} className="panel p-5">
                <w.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{w.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader kicker="How it works" title={<span id="how">One tap. Ten seconds.</span>} />
            <ol className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-turbo/10 font-display font-bold text-turbo ring-1 ring-turbo/30">{i + 1}</span>
                  <div>
                    <h3 className="font-body text-lg font-semibold tracking-normal">{s.t}</h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Reveal from="zoom">
            <TapDemo business={business} />
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why-reviews">
        <div className="container-x">
          <ReviewStats id="why-reviews" />
        </div>
      </section>

      <ReviewGoalCalculator />

      <section className="section border-t border-border" aria-labelledby="setup">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader kicker="Setup" title={<span id="setup">Ready in about 2 minutes.</span>} lede="All you need is your phone. Our guide finds your Google review link and walks you through writing it to the card." />
          <div className="panel p-6">
            <Smartphone className="h-6 w-6 text-turbo" aria-hidden />
            <p className="mt-3 font-semibold">Don't want to set it up?</p>
            <p className="mt-1 text-sm text-muted-foreground">Tick “Program it for me” for {money2(CARD_PROGRAMMING.price)}. We write your link and test the card, so it arrives ready to tap.</p>
            <Link to={SETUP_PATH} className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See the setup guide <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">Tap card vs. just asking</span>} lede="Most customers mean it when they say they'll leave a review. The card gets it done before they forget." />
          <CompareTable className="mt-10" head={["", "Review tap card", "“Please review us”", "Paper QR sign"]} rows={COMPARE.map((r) => [...r])} highlight={1} />
        </div>
      </section>

      <SpecsAndGuarantee />

      <BulkBand />

      <FAQList faqs={SHOP_FAQS} title="Review card questions" lede="Still unsure? Call or text us." />

      <ContactBand />

      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 id="last-call" className="h-section">Get the review before they forget.</h2>
            <p className="lede mx-auto max-w-2xl">
              From {fromPriceLabel} with free US shipping. {REVIEW_CARD.shipping.processing}.
            </p>
            <a href="#buy" className="btn-ignite btn-shine mt-7">
              Get my review cards <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <p className="container-x pb-4 text-center text-sm text-muted-foreground">
        Want more calls too?{" "}
        <Link to="/grow" className="font-semibold text-turbo underline-offset-4 hover:underline">
          We do websites and ads
        </Link>
        .
      </p>
      <p className="container-x pb-10 text-center text-xs leading-relaxed text-muted-foreground">Google and the Google logo are trademarks of Google LLC. CEO Turbo is not affiliated with, sponsored or endorsed by Google.</p>
    </>
  );
}
