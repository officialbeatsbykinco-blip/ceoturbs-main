import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Check, Globe, Megaphone, Music, Phone, Play, Rocket, Search, Star } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { AudienceTiles } from "@/components/quiz/AudienceTiles";
import { TextQuiz } from "@/components/quiz/TextQuiz";
import { openTextQuiz } from "@/lib/text-quiz-open";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats, BestResults, GoogleAdProof, AdResultsGrid, AdGallery } from "@/components/blocks/Proof";
import { ADS } from "@/content/ads";
import { AD_RESULTS, AD_TOTALS, GOOGLE_AD_RESULTS, money } from "@/content/results";
import { GrandSlamOffer } from "@/components/blocks/Offer";
import { ReviewDuo } from "@/components/blocks/ReviewDuo";
import { Founder, BookingSection } from "@/components/blocks/Sales";
import { SectionHeader, FAQList } from "@/components/blocks/Basics";
import { HOME_FAQS } from "@/content/faqs";
import { price } from "@/content/pricing";
import { SITE, fromPriceLabel } from "@/config/site";
import { SiteWall } from "@/components/visuals/SiteWall";
import { MobileMore } from "@/components/blocks/MobileMore";

/**
 * Money model, top to bottom:
 * The agency pitch, the upsell after the cards (the store is the home page).
 * 1. Primary action — the text quiz (three taps, then a text or a callback), with the free call beside it.
 * 2. Offer — an SEO/AEO/GEO website plus Google, Meta and YouTube ads that bring the calls.
 * 3. Add-on — NFC Google review cards, kept small so they never compete with the booking.
 */
export default function Agency() {
  return (
    <>
      <div className="theme-soft cv-sections">
      {/* HERO — one question up front. Phones tap a tile and finish in a sheet that texts us; bigger screens get the quiz open beside the pitch. */}
      <section className="relative overflow-clip pt-20 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative mx-auto grid max-w-6xl items-center gap-8 text-center lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:text-left">
          <div className="hero-rise relative z-10 min-w-0">
            <p className="chip">
              Websites, ads and reviews<span className="hidden sm:inline">&nbsp;for local businesses, online stores and artists</span>
            </p>
            <h1 id="hero" className="mt-3 text-[32px] font-bold leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl lg:text-[56px]">
              <span className="text-chrome-grad">We get you more customers, more sales</span> <span className="text-turbo-grad">and more reviews.</span>
            </h1>
            <p className="mx-auto mt-5 hidden max-w-2xl text-lg leading-relaxed text-muted-foreground lg:block">
              We build your website, run your ads and get you 5-star Google reviews. All three work together, so you show up on Google and ChatGPT and people call you. Artists get more listeners the same way.
            </p>
            <div className="mt-5 sm:hidden">
              <p className="font-display text-lg font-bold">What do you do?</p>
              <p className="mb-3 text-sm text-muted-foreground">3 quick taps, then text us your answers.</p>
              <AudienceTiles onPick={(audience) => openTextQuiz({ source: "Home hero", audience })} />
            </div>
            <div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2 sm:mt-7 sm:flex sm:max-w-none sm:justify-center lg:justify-start">
              <CallLink location="home hero" icon className="btn-chrome justify-center !px-3 sm:!px-6">
                Call us
              </CallLink>
              <BookButton direct note="Home hero" variant="chrome" className="justify-center !px-3 sm:!px-6">
                <CalendarCheck className="h-5 w-5" aria-hidden /> Pick a time
              </BookButton>
            </div>
            <p className="mt-3 text-balance text-sm text-muted-foreground">Free · No contract · <span className="whitespace-nowrap">Leads-or-free guarantee</span></p>
            <Link to="/results" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See real results <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <ul className="mt-6 hidden max-w-xl grid-cols-2 gap-x-4 gap-y-2 text-left text-sm text-muted-foreground lg:grid">
              {["Free 30-minute call", "Free review card with Launch", "Leads-or-free guarantee", "We work with businesses worldwide"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <TextQuiz source="Home hero card" variant="inline" className="relative z-10 mx-auto hidden w-full max-w-lg text-left sm:block" />
        </div>
      </section>

      <section className="pt-12 pb-2 sm:pt-14" aria-labelledby="who">
        <div className="container-x">
          <h2 id="who" className="h-section text-center">Pick what you need. We handle the rest.</h2>
          <ul className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Megaphone, t: "Local businesses", b: "More calls, bookings and Google reviews from people searching near you.", to: "/local-business", cta: "See local business plans" },
              { icon: Rocket, t: "Starting a business", b: "Get open and get found: your website, Google profile and first ads, set up together.", to: "/pricing", cta: "See what's included" },
              { icon: Globe, t: "Online stores", b: "More visitors and more of them buying, from Google, Meta and YouTube ads.", to: "/shopify", cta: "See store plans" },
              { icon: Music, t: "Artists & producers", b: "More listeners, more shows and more beat sales, with ads and a site that turns plays into fans.", to: "/artist", cta: "See artist plans" },
            ].map((x) => (
              <li key={x.t}>
                <Link to={x.to} className="panel block h-full p-6 transition hover:ring-1 hover:ring-turbo/40">
                  <x.icon className="h-6 w-6 text-turbo" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-turbo">{x.cta} <ArrowRight className="h-4 w-4" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {["1. Book a free 30-minute call. We look at your site, Google profile and ads.", "2. We build it: your website, your ads and your review card.", "3. Calls, sales and reviews start coming in. You see every number."].map((t) => (
              <li key={t} className="rounded-xl border border-border bg-card/40 px-4 py-3 text-center">{t}</li>
            ))}
          </ol>
        </div>
      </section>

      <div className="relative mt-12 sm:mt-14">
        <SiteWall eagerCount={0} />
      </div>

      <section className="pt-14 pb-8" aria-labelledby="proof">
        <div className="container-x">
          <h2 id="proof" className="h-section">Real leads on small budgets.</h2>
          <p className="lede">Unedited dashboards from Appliance King, appliance repair in Macon GA: 2 Google Ads conversions for $6.57 in one day, 14 website leads at $6.46 each on $5 a day, and 71 free clicks from Google Search in 3 months.</p>
          <div className="mt-8">
            <BestResults />
          </div>
          <div className="mt-8">
            <ProofStats />
          </div>
        </div>
      </section>

      {/* META ADS FLEX — every dashboard and every creative. */}
      <section className="section border-t border-border" aria-labelledby="meta">
        <div className="container-x">
          <SectionHeader
            kicker="Meta ads (Facebook + Instagram)"
            title={<span id="meta">{AD_TOTALS.leads} leads at {money(AD_TOTALS.avgCpl)} average. Every campaign, cheapest lead first.</span>}
            lede={`Unedited Meta Ads Manager dashboards across ${AD_RESULTS.length} campaigns, lead campaigns first. The best: ${money(AD_TOTALS.lowestCpl)} per lead. We show the pricier ones too, because you should see all of it.`}
          />
          <MobileMore label="See every campaign" className="mt-10">
            <AdResultsGrid cheapestFirst />
          </MobileMore>
          <div className="mt-10 text-center">
            <BookButton note="Home — Meta results">Get results like these. Book my free call</BookButton>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="creative">
        <div className="container-x">
          <SectionHeader kicker="The ads behind the leads" title={<span id="creative">{ADS.length} ads we designed and launched.</span>} lede="Local services, stores and coaches. Each one built around a single hook and one action." />
          <MobileMore label={`See all ${ADS.length} ads`} className="mt-10">
            <AdGallery ads={ADS} />
          </MobileMore>
        </div>
      </section>

      {/* WHAT YOU GET — three parts of one system. */}
      <section className="section border-t border-border" aria-labelledby="system">
        <div className="container-x">
          <SectionHeader kicker="How it works" title={<span id="system">One system: more customers, more sales, more reviews.</span>} lede="Most agencies sell you a site or ads. We build both to work together, and track every call back to its source." />
          <MobileMore label="See how it works" className="mt-10">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, t: "1. A website built to convert", b: "Fast, mobile-first and written for SEO, AEO and GEO, with schema markup and llms.txt so Google, ChatGPT and Perplexity can read and recommend you." },
              { icon: Search, t: "2. Get found everywhere", b: "Google Business Profile, local SEO and answer-engine optimization put you in the map pack and in AI answers when people ask who to hire." },
              { icon: Megaphone, t: "3. Ads that fill the calendar", b: "Google, Meta and YouTube ads sent to your new site with call and form tracking, so you see what each dollar brings back." },
              { icon: Star, t: "4. Reviews that keep coming", b: "A tap-to-review NFC card turns every happy customer into a Google review, so more people pick you and Maps ranks you higher." },
            ].map((x) => (
              <li key={x.t} className="panel p-6">
                <x.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
              </li>
            ))}
          </ol>
          </MobileMore>
          <div className="mt-8">
            <BookButton note="Home — how it works">Book my free strategy call</BookButton>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="different">
        <div className="container-x">
          <SectionHeader kicker="Why us" title={<span id="different">Not a typical agency.</span>} lede="No hidden fees, no lock-in, no screenshots from someone else's account." />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="panel p-6">
              <p className="font-display text-lg font-bold text-muted-foreground">Typical agency</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {["Hides prices until you sit through a sales pitch", "Locks you into a long contract", "Runs ads in their account, so you can't leave with anything", "Sends a monthly report you can't check"].map((t) => (
                  <li key={t} className="flex gap-2"><span aria-hidden>✕</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="panel p-6 ring-1 ring-turbo/40">
              <p className="font-display text-lg font-bold">CEO Turbo</p>
              <ul className="mt-3 space-y-2 text-sm">
                {["Every price is published on the pricing page", "No long-term contract", "You own your ad account, site and reviews", "Real, unedited dashboards and a leads-or-free guarantee"].map((t) => (
                  <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <BookButton note="Home — not a typical agency">Book my free strategy call</BookButton>
          </div>
        </div>
      </section>

      <ReviewDuo />

      <GrandSlamOffer note="Home offer" />

      {/* STEP TWO — the calls that come with the reviews. Kept short; the services pages carry the detail. */}
      <section className="section border-t border-border" aria-labelledby="get">
        <div className="container-x">
          <SectionHeader
            kicker="Services"
            title={<span id="get">Everything that brings in customers.</span>}
            lede="Start with one piece or take the whole package. Every price is published on the pricing page."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, t: `Website · from ${price("site-launch")}`, b: "A fast, SEO/AEO/GEO-ready site built to get calls and bookings.", to: "/services/website-design" },
              { icon: Search, t: "Google Ads", b: "Search ads for people who need you today, junk searches blocked.", to: "/services/google-ads" },
              { icon: Megaphone, t: "Meta Ads", b: "Facebook and Instagram lead ads with leads straight to your phone.", to: "/services/meta-ads" },
              { icon: Play, t: "YouTube Ads", b: "Video ads in front of people searching and watching in your area. Ask about it on the call.", to: "/book" },
            ].map((x) => (
              <li key={x.t}>
                <Link to={x.to} className="panel block h-full p-5 transition hover:ring-1 hover:ring-turbo/40">
                  <x.icon className="h-5 w-5 text-turbo" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <GoogleAdProof compact result={GOOGLE_AD_RESULTS[1]} />
            <div className="panel p-6">
              <p className="font-display text-lg font-bold">Real ad accounts, real leads.</p>
              <p className="mt-2 text-sm text-muted-foreground">Unedited Google Ads and Meta dashboards from local service businesses. Setup from {price("pkg-start")}, the full Launch package {price("pkg-launch")}, ads management from {price("growth")}/mo. You own the ad account and there's no long-term contract.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <BookButton note="Home — after services">Book my free 30-min call</BookButton>
                <Link to="/results" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                  See results <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER — a real person, not a faceless agency. */}
      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      </div>

      {/* FINAL CTA */}
      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <Star className="mx-auto h-8 w-8 text-turbo" aria-hidden />
            <h2 id="final" className="h-section mt-3">The business that shows up first gets the call. Make that you.</h2>
            <p className="lede mx-auto max-w-2xl">Book a free 30-minute call. We review your site, Google profile and ads live and tell you the biggest thing holding back customers.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <BookButton note="Home final CTA">Schedule my free call</BookButton>
              <CallLink location="home final CTA" className="btn-chrome">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Also: <Link to="/google-review-cards" className="text-turbo underline-offset-4 hover:underline">NFC Google review cards from {fromPriceLabel}</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="theme-soft">
      <FAQList faqs={HOME_FAQS} title="Questions before you call?" />
      <BookingSection note="Home — booking section" title="Want help getting more calls? Pick a time." />
      </div>
    </>
  );
}
