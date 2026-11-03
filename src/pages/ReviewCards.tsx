import { useEffect, useState } from "react";
import { CompareTable } from "@/components/blocks/CompareTable";
import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Smartphone, Star, X } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { Breadcrumbs, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { ReviewStats } from "@/components/blocks/ReviewStats";
import { CardUpsell } from "@/components/blocks/CardUpsell";
import { COMPARE, RULES, SETUP_PATH, SHOP_FAQS, SHOP_PATH, USES } from "@/content/review-cards";
import { REVIEW_CARD, fromPriceLabel } from "@/config/site";
import { Reveal } from "@/components/blocks/Tutorial";
import { recallBusiness } from "@/lib/review-link";
import { StandBuyBox } from "@/components/shop/StandBuyBox";

const STEPS = [
  { icon: Smartphone, title: "Customer taps", body: "Hold the card out when the job's done, or leave it on the counter. They tap with no app and no searching." },
  { icon: Star, title: "Your review form opens", body: "Google's own “rate and review” screen for your business, ready for stars." },
  { icon: MapPin, title: "You climb the map", body: "More fresh reviews build trust with the next customer — and Google uses reviews in local ranking." },
];

export default function ReviewCards() {
  const [business, setBusiness] = useState("");
  useEffect(() => setBusiness((b) => b || recallBusiness()), []);
  // Old stand links land on the stand section further down.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "stand") document.getElementById("stand")?.scrollIntoView();
  }, []);

  return (
    <>
      <section className="relative overflow-clip pt-[76px] sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Google review cards", path: SHOP_PATH }]} className="max-sm:hidden" />
          <div className="mt-3 pb-8 sm:mt-6">
            <BuyBox business={business} onBusiness={setBusiness} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader kicker="How it works" title={<span id="how">One tap. Five stars. Ten seconds.</span>} lede={`Here's exactly what your customer sees${business.trim() ? ` at ${business.trim()}` : ""} — the review form opens before the moment passes.`} />
            <ol className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-turbo/10 ring-1 ring-turbo/30">
                    <s.icon className="h-5 w-5 text-turbo" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-body text-lg font-semibold tracking-normal">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href="#buy" className="btn-ignite btn-shine mt-8">
              Get my review cards — from {fromPriceLabel}
            </a>
          </div>
          <Reveal from="zoom">
            <TapDemo business={business} />
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHeader kicker="Why it matters" title={<span id="why">More reviews means more calls.</span>} />
            <p className="text-lg leading-relaxed text-muted-foreground">
              People compare star ratings and review counts before they pick who to call — and{" "}
              <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-turbo">
                Google says
              </a>{" "}
              review count and score factor into local ranking. The problem isn't that customers won't review you. It's that nobody makes it easy at the right moment.
            </p>
          </div>
          <Reveal>
            <ReviewStats id="why-reviews" className="mt-14" />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(3n+1)]:col-span-3 lg:[&>*:last-child:nth-child(3n+2)]:col-span-2">
            {USES.map((u) => (
              <div key={u.where} className="group bg-background p-6 transition-colors hover:bg-white/[0.025]">
                <p className="font-semibold">{u.where}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">Tap card vs. just asking</span>} lede="Most customers mean it when they say they'll leave a review. The card closes the gap between meaning it and doing it." />
          <CompareTable className="mt-10" head={["", "Review tap card", "“Please review us”", "Paper QR sign"]} rows={COMPARE.map((r) => [...r])} highlight={1} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="setup">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader kicker="When it arrives" title={<span id="setup">Ready in about 2 minutes.</span>} lede="Do it from your phone with our guide, which finds and checks your link. Or tick “Program it for me” and it arrives ready to tap." />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={SETUP_PATH} className="btn-chrome">
                Open the setup guide <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <ol className="grid gap-3">
            {["Find your Google review link", "Write it to the card from your phone", "Test one tap, then put it to work"].map((t, i) => (
              <li key={t} className="panel flex items-center gap-4 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-turbo/10 font-display text-sm font-bold text-turbo">{i + 1}</span>
                <span className="text-[15px]">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="rules">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader kicker="Play by Google's rules" title={<span id="rules">Reviews that stick.</span>} lede="Fake or incentivized reviews get removed — and can get a profile suspended. The card is built for the honest way to grow." />
          <ul className="grid gap-3">
            {RULES.map((r) => (
              <li key={r.text} className="flex items-start gap-3 rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                {r.ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-label="Do" /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6b6b]" aria-label="Don't" />}
                <span className="text-[15px] leading-relaxed">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQList faqs={SHOP_FAQS} title="Review card questions" lede="Still unsure? Call or text us." />

      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <Reveal className="panel grid items-center gap-8 overflow-hidden p-6 sm:p-10 md:grid-cols-[1fr_0.9fr]">
            <div>
              <h2 id="last-call" className="h-section">Every happy customer who leaves without a review is a review you never get back.</h2>
              <p className="lede">Get a card in your pocket this week. Free US shipping, {REVIEW_CARD.returnDays}-day returns, and a free setup call if you get stuck.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#buy" className="btn-ignite btn-shine">
                  Get my review cards — from {fromPriceLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
            <img src="/img/review-cards/hd/card-tap-1600.webp" srcSet="/img/review-cards/hd/card-tap-800.webp 800w, /img/review-cards/hd/card-tap-1600.webp 1600w" sizes="(min-width: 768px) 40vw, 100vw" alt="Phone next to the review card with the Google review form open" width={1600} height={1600} loading="lazy" decoding="async" className="w-full rounded-2xl" />
          </Reveal>
        </div>
      </section>

      <section id="stand" className="section scroll-mt-20 border-t border-border" aria-label="Counter stand">
        <div className="container-x">
          <StandBuyBox business={business} />
        </div>
      </section>

      <CardUpsell where="Review cards shop" />

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        Google and the Google logo are trademarks of Google LLC. CEO Turbo is not affiliated with, sponsored or endorsed by Google. The businesses that hand the card to every happy customer get the most reviews. See{" "}
        <Link to="/shipping-returns" className="underline underline-offset-2">
          shipping &amp; returns
        </Link>
        .
      </p>
    </>
  );
}
