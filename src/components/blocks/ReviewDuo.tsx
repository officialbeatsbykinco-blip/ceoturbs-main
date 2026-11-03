import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Nfc, Repeat, Star } from "lucide-react";
import { REVIEW_CARD, REVIEW_STAND, fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";

/** The stand on a glow with a pulsing tap ring and floating stars (CSS only, so it costs nothing on phones). */
export function StandHero({ className = "" }: { className?: string }) {
  return (
    <div className={`stand-stage relative mx-auto aspect-[620/640] w-full max-w-[340px] ${className}`}>
      <span className="stand-orb" aria-hidden />
      <span className="stand-ring" aria-hidden />
      <span className="stand-ring stand-ring-2" aria-hidden />
      <img src={REVIEW_STAND.image} width={REVIEW_STAND.w} height={REVIEW_STAND.h} alt="White acrylic Google review stand: Rate Your Experience, tap your phone or scan the QR code" className="stand-img relative z-10 h-full w-full object-contain" loading="lazy" decoding="async" />
      {[0, 1, 2].map((i) => (
        <Star key={i} className={`stand-star stand-star-${i} text-amber-400`} fill="currentColor" aria-hidden />
      ))}
    </div>
  );
}


/** Home page block: the NFC review card, nothing else. */
export function ReviewDuo() {
  return (
    <section className="section border-t border-border" aria-labelledby="duo">
      <div className="container-x">
        <p className="chip">More 5-star reviews</p>
        <h2 id="duo" className="h-section mt-3 max-w-3xl">
          One tap on the card, one Google review.
        </h2>
        <p className="lede">More fresh Google reviews help you show up in Maps and win the next customer. Credit-card size, great for counters, stations, trucks and tables.</p>

        <div className="panel mt-10 grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <img src="/img/review-cards/hd/card-hero-800.webp" alt="NFC Google review card, white front and black back" width={800} height={800} className="mx-auto h-40 w-40 rounded-2xl object-cover" loading="lazy" decoding="async" />
          <div>
            <h3 className="font-display text-2xl font-bold">{REVIEW_CARD.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">One tap opens your review form, no app for customers. From {fromPriceLabel}.</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {[
                [Nfc, "NFC tap for iPhone and Android"],
                [Repeat, "Pay once, no subscription, reprogram anytime"],
                [Check, "Opens your Google review form"],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Nfc;
                return (
                  <li key={t as string} className="flex items-center gap-2">
                    <I className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t as string}
                  </li>
                );
              })}
            </ul>
            <Link to={SHOP_PATH} className="btn-ignite btn-shine mt-6 inline-flex w-full justify-center sm:w-auto">
              Shop review cards <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Not affiliated with or endorsed by Google. Never offer rewards for reviews and don't screen who you ask.</p>
      </div>
    </section>
  );
}
