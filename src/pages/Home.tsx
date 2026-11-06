import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, CalendarCheck, Check, Globe, MapPin, Megaphone, Phone, Scissors, Search, Share2, Smartphone, Star, Store, Trees, Wrench } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { BookButton } from "@/components/cta/Actions";
import { CompareTable } from "@/components/blocks/CompareTable";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { ReviewStats } from "@/components/blocks/ReviewStats";
import { BulkBand, ContactBand, ReviewGoalCalculator, SpecsAndGuarantee, TrustStrip } from "@/components/shop/StoreSections";
import { Reveal } from "@/components/blocks/Tutorial";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { StickTap } from "@/components/visuals/StickTap";
import { CARD_PROGRAMMING, REVIEW_CARD, SITE, fromPriceLabel, money2 } from "@/config/site";
import { COMPARE, SETUP_PATH, SHOP_FAQS } from "@/content/review-cards";
import { recallBusiness } from "@/lib/review-link";
import { BestResults, ProofStats, AdGallery } from "@/components/blocks/Proof";
import { MobileMore } from "@/components/blocks/MobileMore";
import { SiteWall } from "@/components/visuals/SiteWall";
import { CallLink } from "@/components/site/CallLink";
import { ADS } from "@/content/ads";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { price } from "@/content/pricing";
import { cn } from "@/lib/utils";

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

/**
 * Funnel: the review card is the magnet (cheap, instant, Shopify checkout); the agency work is the upsell.
 * Hero shows both steps, then the card store, then the step-2 ladder (social, Google profile, SEO/AEO/GEO site, ads),
 * then proof (real sites, real ad dashboards), then the card details, then both again at the end.
 */
export default function Home() {
  const [business, setBusiness] = useState("");
  useEffect(() => setBusiness((b) => b || recallBusiness()), []);

  return (
    <>
      {/* HERO — both offers above the fold, so nobody lands on a product they didn't come for. */}
      <section className="relative overflow-clip pt-[84px] sm:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative mx-auto max-w-6xl text-center">
          <p className="chip">For local businesses &amp; online stores</p>
          <h1 id="hero" className="mx-auto mt-3 max-w-4xl text-[34px] font-bold leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl">
            <span className="text-chrome-grad">More calls. More sales.</span> <span className="text-turbo-grad">More 5-star reviews.</span>
          </h1>
          <p className="mx-auto mt-4 hidden max-w-2xl text-lg leading-relaxed text-muted-foreground sm:block">
            We build websites and run Google &amp; Meta ads that make your phone ring, and sell tap-to-review cards that fill your Google profile with 5 stars.
          </p>

          <div className="mx-auto mt-7 grid max-w-5xl gap-4 text-left md:grid-cols-2">
            {/* Door 1: the card. The cheap first yes; everything else is the next step. */}
            <div className="panel relative flex flex-col p-5 ring-1 ring-turbo/50 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Step 1 · Get more Google reviews</p>
              <div className="mt-1.5 flex items-start gap-4">
                <h2 className="flex-1 font-display text-2xl font-bold sm:text-3xl">Tap-to-review Google cards</h2>
                <img src="/img/review-cards/shop-tap-thumb.webp" alt="A phone tapping a CEO Turbo Google review card" width={96} height={96} loading="eager" decoding="async" className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:h-24 sm:w-24" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">Customers tap their phone on the card and your review form opens. No app.</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
                <span className="inline-flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-amber-400" aria-hidden />
                  ))}
                </span>
                <span className="whitespace-nowrap font-semibold">From {fromPriceLabel}</span>
                <span className="whitespace-nowrap text-muted-foreground">· free US shipping</span>
              </p>
              <div className="mt-auto pt-5">
                <a href="#buy" className="btn-ignite inline-flex w-full items-center justify-center gap-2">
                  Shop review cards <ArrowDown className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
            {/* Door 2: the agency, for owners ready to grow now. */}
            <div className="panel relative p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Step 2 · Get more customers</p>
              <h2 className="mt-1.5 font-display text-2xl font-bold sm:text-3xl">Websites &amp; ads that make your phone ring</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {AD_TOTALS.leads} leads for our clients at {money(AD_TOTALS.avgCpl)} each on average. {CLIENTS.length} client sites live right now.
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm">
                {["Free 30-minute call, plan included", "No long-term contract", "Leads-or-free guarantee"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <BookButton direct note="Home hero" className="btn-shine inline-flex items-center justify-center gap-2">
                  <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
                </BookButton>
                <CallLink location="home hero" className="btn-chrome inline-flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-turbo" aria-hidden /> Call {SITE.phone.display}
                </CallLink>
              </div>
              <a href="#work" className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                See the sites and ads we made <ArrowDown className="h-4 w-4" aria-hidden />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* THE STORE — the card for anyone who came for reviews. */}
      <section className="relative overflow-clip border-t border-border pt-14 sm:pt-20" aria-label="Google review cards">
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative pb-10">
          <BuyBox business={business} onBusiness={setBusiness} headingLevel="h2" stickyBar={false} />
        </div>
      </section>

      <TrustStrip />

      <UpsellLadder />

      {/* PROOF 1 — the websites. */}
      <section id="work" className="scroll-mt-20 pt-14 sm:pt-20" aria-labelledby="work-title">
        <div className="container-x text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Our work</p>
          <h2 id="work-title" className="h-section mx-auto mt-2 max-w-3xl">{CLIENTS.length} real websites we built. All live.</h2>
          <p className="lede mx-auto max-w-2xl">Home repair, junk removal, appliance repair, Shopify stores and artists. Tap any site to see how it was built to get calls.</p>
        </div>
        <div className="relative mt-6">
          <SiteWall eagerCount={0} />
        </div>
        <div className="container-x -mt-4 text-center">
          <Link to="/portfolio" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
            See every site <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* PROOF 2 — the ads, straight from the dashboards. */}
      <section className="section" aria-labelledby="ads-proof">
        <div className="container-x">
          <SectionHeader
            kicker="Our ads"
            title={<span id="ads-proof">Real leads on small budgets.</span>}
            lede="Unedited Google Ads, Meta and Search Console dashboards from Appliance King, appliance repair in Macon GA. A few hundred dollars of ads turned into thousands in jobs."
          />
          <div className="mt-8">
            <ProofStats />
          </div>
          <div className="mt-8">
            <BestResults />
          </div>
          <h3 className="mt-14 font-display text-xl font-bold sm:text-2xl">{ADS.length} ads we designed and launched</h3>
          <MobileMore label={`See all ${ADS.length} ads`} className="mt-6">
            <AdGallery ads={ADS} />
          </MobileMore>
          <BookCallStrip note="Home — after ad proof" className="mt-10" />
        </div>
      </section>


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

      {/* LAST CALL — both doors again. */}
      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 id="last-call" className="h-section">The business that shows up first gets the call.</h2>
            <p className="lede mx-auto max-w-2xl">Book a free 30-minute call and we'll show you the biggest thing holding back your calls and sales. Or grab review cards from {fromPriceLabel}, free US shipping.</p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BookButton direct note="Home final CTA" className="btn-shine inline-flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
              </BookButton>
              <CallLink location="home final CTA" className="btn-chrome inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-turbo" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
              <a href="#buy" className="btn-chrome">
                Get review cards
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeBar />

      <p className="container-x pb-10 text-center text-xs leading-relaxed text-muted-foreground">Google and the Google logo are trademarks of Google LLC. CEO Turbo is not affiliated with, sponsored or endorsed by Google.</p>
    </>
  );
}

const LADDER = [
  { icon: Share2, t: "Social media optimization", b: "Facebook, Instagram and TikTok set up to match, with your reviews and booking link on every one.", p: price("social-setup"), to: "/services/social-media-optimization" },
  { icon: MapPin, t: "Google Business Profile optimization", b: "Categories, services, photos and posts tuned so you show up in the Maps top 3 near you.", p: price("gbp-setup"), to: "/services/google-business-profile" },
  { icon: Search, t: "SEO, AEO & GEO", b: "Get found on Google and recommended by ChatGPT, Gemini and Perplexity when people ask who to hire.", p: price("visibility-foundation"), to: "/services/seo-aeo-geo" },
  { icon: Globe, t: "Website that gets calls", b: "Fast, mobile-first, tap-to-call everywhere, built to turn visitors into calls and bookings.", p: price("site-launch"), to: "/services/website-design" },
  { icon: Megaphone, t: "Google & Meta ads setup", b: "Ads and call tracking set up in your own account, so you see what every dollar brings back.", p: price("tracking-setup"), to: "/services/google-ads" },
];

/** Step 2 after the card: the services that turn new reviews into calls. One price each, or all of it in Turbo Launch. */
function UpsellLadder() {
  return (
    <section className="section border-t border-border" aria-labelledby="step-2">
      <div className="container-x">
        <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Reviews are step 1</p>
        <h2 id="step-2" className="h-section mt-2 max-w-3xl">Step 2: turn those 5 stars into calls and sales.</h2>
        <p className="lede max-w-2xl">Reviews make people pick you. These make sure they find you first. Pick one, or let us do all of it.</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li className="panel flex flex-col p-5 opacity-90">
            <Star className="h-6 w-6 fill-current text-amber-400" aria-hidden />
            <h3 className="mt-3 font-display text-lg font-bold">Google review cards</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">Every happy customer taps and leaves a review before they leave.</p>
            <a href="#buy" className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-3 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              From {fromPriceLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </li>
          {LADDER.map((x) => (
            <li key={x.t}>
              <Link to={x.to} className="panel flex h-full flex-col p-5 transition hover:ring-1 hover:ring-turbo/50">
                <x.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
                <span className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-3 text-sm font-semibold text-turbo">
                  {x.p} one-time <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="cta-glow mt-8 flex flex-col items-center gap-4 rounded-3xl p-6 text-center sm:p-8 lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="chip w-fit max-lg:mx-auto">Best value</p>
            <p className="mt-2 font-display text-xl font-bold sm:text-2xl">Turbo Launch: all of it for {price("pkg-launch")}, review cards included.</p>
            <p className="mt-1 text-sm text-muted-foreground">Website, Google profile, social, SEO/AEO/GEO and ads on your 2 best platforms. No long contract.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <BookButton direct note="Home — step 2 ladder" prefill="I want more calls: website, Google profile, social, SEO and ads." className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
            </BookButton>
            <Link to="/pricing" className="btn-chrome whitespace-nowrap">
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One line that sends the reader who just saw the proof to the calendar or the phone. */
function BookCallStrip({ note, className }: { note: string; className?: string }) {
  return (
    <div className={cn("panel flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left", className)}>
      <div>
        <p className="font-display text-lg font-bold sm:text-xl">Want results like these for your business?</p>
        <p className="mt-1 text-sm text-muted-foreground">Free 30-minute call. We look at your site, Google profile and ads with you, live.</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <BookButton direct note={note} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
        </BookButton>
        <CallLink location={note} className="btn-chrome inline-flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-turbo" aria-hidden /> Call now
        </CallLink>
      </div>
    </div>
  );
}

/** Sticky bottom bar once the hero is gone: book, call, or jump to the cards. Replaces the buy box's own bar on this page. */
function HomeBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const update = () => setShow(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 lg:pb-3", show ? "translate-y-0" : "translate-y-full")} aria-hidden={!show}>
      <div className="mx-auto flex max-w-3xl gap-2">
        <BookButton direct note="Home sticky bar" className="inline-flex flex-[1.3] items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-sm sm:!text-base">
          <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden /> Book free call
        </BookButton>
        <a href="#buy" tabIndex={show ? undefined : -1} className="btn-chrome inline-flex flex-1 items-center justify-center whitespace-nowrap !px-3 !py-3.5 !text-sm sm:!text-base">
          Cards · {fromPriceLabel}
        </a>
        <CallLink location="home sticky bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
          <Phone className="h-5 w-5" aria-hidden />
          <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
        </CallLink>
      </div>
    </div>
  );
}
