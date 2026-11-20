import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Megaphone, Search, ShoppingCart, Star, Truck, UserRoundCheck, type LucideIcon } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { SectionHeader } from "@/components/blocks/Basics";
import { REVIEW_CARD, fromPriceLabel, money2, packPath } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { price } from "@/content/pricing";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

// The digital half of CEO Turbo, for pages that lead with Tampa tech repair: websites, ads, SEO/AEO/GEO + DNS fixes
// and Google review cards. None of these need us at the door, so they sell to businesses anywhere.

const DIGITAL: { icon: LucideIcon; t: string; b: string; pts: string[]; price: string; to: string; cta: string }[] = [
  {
    icon: Globe,
    t: "Websites",
    b: "Fast, mobile-first sites that make the phone ring.",
    pts: ["Tap-to-call, quote and booking buttons", "Reviews, photos and service area", "You own the site and domain"],
    price: `from ${price("site-launch")}`,
    to: "/services/website-design",
    cta: "Get my website",
  },
  {
    icon: Megaphone,
    t: "Ads that get customers",
    b: "Google, Meta, TikTok and more, run every week.",
    pts: ["Junk clicks blocked, every lead tracked", "You own the ad account", "No long contract"],
    price: `${price("growth")}/mo`,
    to: "/services/google-ads",
    cta: "Start my ads",
  },
  {
    icon: Search,
    t: "SEO, AEO, GEO & DNS fixes",
    b: "Found on Google, Bing and AI answers, with nothing broken underneath.",
    pts: ["DNS, domain, SSL and email errors fixed", "Search Console, Bing and indexing errors cleared", "Google Business Profile tuned up"],
    price: `from ${price("pkg-start")}`,
    to: "/services/seo-aeo-geo",
    cta: "Fix my site",
  },
  {
    icon: UserRoundCheck,
    t: "Social media optimization",
    b: "Instagram, Facebook, TikTok and YouTube profiles that look trusted and send people to you.",
    pts: ["Bios, links, highlights and branding", "Same name, hours and links everywhere", "Up to 3 profiles done for you"],
    price: price("social-setup"),
    to: "/services/social-media-optimization",
    cta: "Optimize my socials",
  },
];

/** Websites, ads, SEO/DNS and Google review cards, each with its own buy button. */
export function GrowEverywhere({ where, id = "grow", className }: { where: string; id?: string; className?: string }) {
  return (
    <section className={cn("section border-t border-border", className)} aria-labelledby={id}>
      <div className="container-x">
        <SectionHeader
          kicker="For businesses, anywhere"
          title={<span id={id}>Your IT company and your marketing company, in one.</span>}
          lede="We fix the computers, cameras and Wi-Fi in Tampa. Then we get your business more customers, wherever you are: websites, ads, social media, Google rankings and review cards, done for you."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIGITAL.map((s) => (
            <li key={s.t} className="panel flex flex-col p-5 sm:p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-turbo/15 text-turbo">
                <s.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold leading-tight sm:text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {s.pts.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-4 font-display text-2xl font-bold">{s.price}</p>
              <Link to={s.to} onClick={() => track("digital_service_click", { source: where, content_name: s.t })} className="btn-ignite mt-3 inline-flex items-center justify-center gap-2 !py-3 !text-base">
                {s.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
          <li className="panel grid gap-5 p-5 ring-1 ring-turbo/60 sm:p-6 lg:col-span-2 lg:grid-cols-[0.8fr_1fr] lg:items-center">
            <img src="/img/review-cards/hd/card-tap-800.webp" alt="Phone tapped on a CEO Turbo NFC Google review card with the Google review form open" width={800} height={800} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-border lg:aspect-square" />
            <div className="flex flex-col">
              <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">
                <Star className="-mt-1 mr-1 inline h-5 w-5 fill-current text-amber-400" aria-hidden />
                Google review cards
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">Customers tap their phone and your Google review form opens. iPhone and Android, no app, no subscription.</p>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {["More reviews, so more people trust you", "Recent reviews help you show up on Google Maps", "Google and AI assistants recommend businesses people review"].map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-display text-2xl font-bold">from {fromPriceLabel} <span className="text-sm font-normal text-muted-foreground">free US shipping</span></p>
              <Link to={SHOP_PATH} onClick={() => track("review_card_promo_click", { source: `${where} grid` })} className="btn-ignite btn-shine mt-3 inline-flex items-center justify-center gap-2 !py-3 !text-base">
                <ShoppingCart className="h-4 w-4" aria-hidden /> Buy review cards
              </Link>
            </div>
          </li>
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <BookButton note={`${where} — grow everywhere`} prefill="I want help with a website, ads, SEO or review cards for my business.">
            Book a free 30-min call
          </BookButton>
          <Link to="/pricing" className="btn-chrome inline-flex items-center justify-center gap-2">
            See all plans &amp; prices <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Google review card packs as one-tap buy buttons: each opens the store with that pack picked. */
export function ReviewCardPacks({ where, id = "review-cards", className }: { where: string; id?: string; className?: string }) {
  return (
    <section className={cn("section border-t border-border", className)} aria-labelledby={id}>
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-md">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
          <img
            src="/img/review-cards/hd/card-hero-1600.webp"
            srcSet="/img/review-cards/hd/card-hero-800.webp 800w, /img/review-cards/hd/card-hero-1600.webp 1600w"
            sizes="(min-width: 1024px) 440px, 90vw"
            width={1600}
            height={1600}
            loading="lazy"
            decoding="async"
            alt="NFC Google review card, both sides: white Review Us On Google front and black NFC back"
            className="w-full rounded-3xl ring-1 ring-border"
          />
        </div>
        <div>
          <SectionHeader
            kicker={`Google review cards · from ${fromPriceLabel}`}
            title={<span id={id}>More 5-star Google reviews. One tap.</span>}
            lede="Hand it over when the job's done, or leave it on the counter. The customer taps their phone and your Google review form opens. Works for any business on Google."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {REVIEW_CARD.packs.map((p) => (
              <li key={p.id}>
                <Link
                  to={packPath(p.id)}
                  onClick={() => track("review_card_pack_click", { source: where, content_name: p.label })}
                  className={cn("panel flex min-h-[44px] items-center justify-between gap-3 p-4 transition-shadow hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.6)]", p.popular && "ring-1 ring-turbo/60")}
                >
                  <span>
                    <span className="block font-display text-lg font-bold">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.popular ? "Most popular · " : ""}{p.note}</span>
                  </span>
                  <span className="btn-ignite inline-flex shrink-0 items-center gap-1.5 !px-3 !py-2 !text-sm">
                    {money2(p.price)} <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0 text-turbo" aria-hidden /> {REVIEW_CARD.shipping.label} · {REVIEW_CARD.shipping.processing.toLowerCase()} · 30-day returns
          </p>
          <Link to={SHOP_PATH} onClick={() => track("review_card_promo_click", { source: `${where} packs` })} className="btn-ignite btn-shine mt-6 inline-flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" aria-hidden /> Buy Google Review Cards
          </Link>
        </div>
      </div>
    </section>
  );
}
