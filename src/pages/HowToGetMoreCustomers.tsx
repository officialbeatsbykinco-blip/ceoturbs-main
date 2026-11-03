// /how-to-get-more-customers — the step-by-step tutorial Christopher scrolls in the 9:16 half/half ad (his face on
// top, this page below). Story: get your free score first → get found (Google, Bing, ChatGPT, Claude) → look legit
// → get reviews (review-card upsell) → track everything → ads on the right platforms → keep them coming back →
// "or we do all the nerd stuff for you" → book. One idea per screen, a question for the audience on most screens,
// real numbers only (content/results.ts). Focus layout: every click goes to the free check, the call or the cards.
import { ArrowDown, ArrowUpRight, CalendarCheck, Mail, MessageCircle, Phone, RefreshCw, Search, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { SITE } from "@/config/site";
import { AD_RESULTS, AD_TOTALS, APPLIANCE_KING_PAGE, GSC, STRIPE, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { price } from "@/content/pricing";
import { AuditTool } from "@/components/audit/AuditTool";
import { AdResultsGrid, StripeProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { PackageGrid } from "@/components/blocks/PriceBlocks";
import { Reveal, StepHead, StepRail, Stat, Tick, useActiveStep } from "@/components/blocks/Tutorial";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { CountUp } from "@/components/visuals/CountUp";
import { SiteWall } from "@/components/visuals/SiteWall";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { CrawlerParade, HoursMeter, LegitPoll, PlatformPicker, RankClimb, TagPipeline } from "@/components/visuals/GrowthVisuals";
import { cn } from "@/lib/utils";

const SOURCE = "Customers tutorial";

const CUSTOMER_STEPS = [
  { id: "score", label: "Get your score", title: "Get your free visibility score" },
  { id: "found", label: "Get found", title: "Get found on Google, Bing, ChatGPT and Claude" },
  { id: "legit", label: "Look legit", title: "Fix your Google profile and socials" },
  { id: "reviews", label: "Get reviews", title: "Get reviews on autopilot" },
  { id: "track", label: "Track everything", title: "Track every click, call and booking" },
  { id: "ads", label: "Run the right ads", title: "Run ads on the platforms your buyers use" },
  { id: "return", label: "Bring them back", title: "Email, booking calendar and website care" },
  { id: "done", label: "We do it all", title: "Or we do all of it for you" },
] as const;

/** A question Christopher asks the audience on camera. */
function Ask({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal from="zoom" className={className}>
      <p className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl bg-ignite/10 px-5 py-4 text-[17px] font-semibold leading-snug ring-1 ring-ignite/30 sm:text-lg">
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-ignite" aria-hidden />
        <span>{children}</span>
      </p>
    </Reveal>
  );
}

const NERD_STUFF = [
  "Schema markup",
  "XML sitemaps",
  "IndexNow pings",
  "llms.txt",
  "robots.txt for AI crawlers",
  "Core Web Vitals",
  "Canonical tags",
  "Search Console",
  "Bing Webmaster Tools",
  "GA4 key events",
  "GTM triggers",
  "Meta Conversions API",
  "Event de-duplication",
  "Microsoft UET",
  "Enhanced conversions",
  "Consent mode",
  "Merchant Center feeds",
  "SPF / DKIM / DMARC",
  "UTM tracking",
  "Negative keywords",
  "Lookalike audiences",
  "Retargeting",
];

export default function HowToGetMoreCustomers() {
  const active = useActiveStep(CUSTOMER_STEPS, "customers_step_view");
  const ak = AD_RESULTS.find((r) => r.key === "appliance-king")!;
  const pg = APPLIANCE_KING_PAGE;

  return (
    <>
      {/* HOOK + STEP 1: the free check sits right under the headline, so the ad's first instruction works instantly. */}
      <section className="relative overflow-hidden pb-6 pt-24 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-ignite opacity-60" aria-hidden />
        <div className="container-x relative">
          <p className="chip">Free tutorial · 8 steps · do it with me</p>
          <h1 className="mt-5 max-w-4xl text-[40px] font-bold leading-[1.02] sm:text-7xl">
            <span className="text-chrome-grad">How to get more customers</span> <span className="text-turbo-grad">in 2026.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-muted-foreground sm:text-xl">
            The exact steps — and all the nerd stuff behind them — that get a business or artist found on Google and ChatGPT, trusted, and paid. Step 1 takes 60 seconds:
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-turbo-grad sm:text-5xl">
                <CountUp value={STRIPE.gross} />
              </span>
              <span className="text-sm text-muted-foreground">paid to CEO Turbo in 12 months</span>
            </p>
            <a href="#score" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-chrome hover:text-foreground">
              Start with your free score <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <StepRail steps={CUSTOMER_STEPS} active={active} intro="The 8-step tutorial · scroll along" />

      <section id="score" className="section scroll-mt-28 !pt-10" aria-label={CUSTOMER_STEPS[0].title}>
        <div className="container-x grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-10">
          <StepHead n={1} kicker="Get your score" title={<>First, see what Google and AI <span className="text-turbo-grad">think of you.</span></>} lede="Type your business or artist name. We check your website, Google profile, reviews, socials and whether ChatGPT can even find you — and score it out of 100." />
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <AuditTool compact source={SOURCE} />
          </div>
          <div className="lg:col-start-1">
            <ul className="space-y-2.5">
              <Tick>Free, 60 seconds, no credit card</Tick>
              <Tick>Your top fixes, ranked by how many customers they cost you</Tick>
              <Tick>Works for local businesses, stores and artists</Tick>
            </ul>
            <Ask className="mt-8 lg:max-w-md">Comment your score. Under 50? Google basically thinks you're closed.</Ask>
          </div>
        </div>
      </section>

      {/* STEP 2 — get found */}
      <section id="found" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[1].title}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <StepHead n={2} kicker="Get found" title={<>Show up on Google, Bing, ChatGPT <span className="text-turbo-grad">and Claude.</span></>} lede="If they can't find you, nothing else matters. A fast website, built three ways:" />
            <ul className="mt-6 grid gap-3">
              {[
                { icon: Search, t: "SEO", b: "rank on Google, Bing and Maps when people search “near me”" },
                { icon: Sparkles, t: "AEO", b: "become the answer Google's AI Overviews and Copilot quote" },
                { icon: MapPin, t: "GEO", b: "get named when people ask ChatGPT, Claude or Perplexity who to pick" },
              ].map((x, i) => (
                <Reveal as="li" key={x.t} from="left" delay={i * 120} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                  <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  <span className="text-[16px]">
                    <span className="font-display font-bold">{x.t}</span> <span className="text-muted-foreground">— {x.b}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal from="zoom">
            <RankClimb />
          </Reveal>
        </div>
        <div className="container-x mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div className="lg:order-2">
            <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
              We speak fluent robot. <span className="text-turbo-grad">🤖</span>
            </h3>
            <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
              Google, Bing and the AI assistants send robots to read your site. Most sites accidentally block them or confuse them. We submit you to Google Search Console and Bing Webmaster Tools, ping IndexNow, add schema and an llms.txt file, and open the door for AI crawlers — so they actually read you, understand you and recommend you.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <Stat v={GSC.impressions} l={`Google impressions on ${GSC.property}`} tone="turbo" />
              <Stat v={String(CLIENTS.length)} l="client websites live right now" />
            </dl>
          </div>
          <CrawlerParade className="lg:order-1" />
        </div>
        <Ask className="container-x mt-12">Be honest: have you ever Googled your own business? Where did you show up?</Ask>
        <div className="mt-12">
          <SiteWall eagerCount={0} />
        </div>
        <p className="container-x -mt-4 text-center text-xs text-muted-foreground">Real client sites we designed and built.</p>
      </section>

      {/* STEP 3 — look legit */}
      <section id="legit" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[2].title}>
        <div className="container-x">
          <StepHead n={3} kicker="Look legit" title={<>They found you. Now they judge you <span className="text-turbo-grad">in 3 seconds.</span></>} lede="Your Google Business Profile, Instagram, Facebook and TikTok are your storefront now. A dead profile says “might be closed.”" />
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <Reveal>
              <LegitPoll />
            </Reveal>
            <Reveal delay={120}>
              <ul className="space-y-2.5">
                <Tick>Google Business Profile: categories, services, photos, posts — so you win the map pack</Tick>
                <Tick>Bios that say what you do, where and for who</Tick>
                <Tick>One-tap book, call and message buttons everywhere</Tick>
                <Tick>Same name, photo and links on every app — Google and AI trust consistency</Tick>
                <Tick>Merchant Center for stores, so products show in Google and Microsoft Shopping</Tick>
              </ul>
            </Reveal>
          </div>
          <Reveal className="panel mt-10 grid items-center gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm font-medium text-turbo">Real result · Appliance King's Facebook page (Meta insights, 2026)</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <Stat v={pg.views} l="page views" tone="turbo" />
                <Stat v={pg.viewers} l="people reached" />
                <Stat v={pg.linkClicks} l="link clicks" />
                <Stat v={pg.follows} l="new follows" />
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Flat all year, then up from July — when we optimized the page and launched their ads.</p>
            </div>
            <a href={pg.image} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-border bg-white/[0.02]">
              <img src={pg.image.replace(".webp", "-600.webp")} srcSet={`${pg.image.replace(".webp", "-600.webp")} 600w, ${pg.image.replace(".webp", "-900.webp")} 900w`} sizes="(min-width: 1024px) 420px, 92vw" alt="Appliance King Facebook page insights: 59.4K views, 26.6K viewers, 778 link clicks, 186 follows" width={1290} height={1380} loading="lazy" decoding="async" className="h-auto max-h-80 w-full object-cover object-top" />
              <span className="flex items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
                Unedited screenshot <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* STEP 4 — reviews → review card (upsell #1) */}
      <section id="reviews" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[3].title}>
        <div className="container-x">
          <StepHead n={4} kicker="Get reviews" title={<>9 reviews vs. 140 reviews. <span className="text-turbo-grad">Who gets the call?</span></>} lede="Reviews decide who people call, how high you rank on Maps, and whether AI assistants recommend you. The problem: customers say “I'll leave you a review” — and never do." />
          <Ask className="mt-8">How many Google reviews do you have right now? Drop the number.</Ask>
          <Reveal className="cta-glow mt-10 grid items-center gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold text-ignite">The cheapest employee you'll ever hire</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">A card that asks for reviews. Never calls in sick.</h3>
              <ul className="mt-5 space-y-2.5">
                <Tick>Customer taps their phone — your Google review page opens</Tick>
                <Tick>No app, no link to text, no “I'll do it later”</Tick>
                <Tick>Counter, truck, invoice, merch table — anywhere</Tick>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ShopCardsButton className="btn-shine" />
                <span className="text-sm text-muted-foreground">Ships from Atlanta</span>
              </div>
            </div>
            <TapDemo />
          </Reveal>
        </div>
      </section>

      {/* STEP 5 — tracking (the nerd stuff) */}
      <section id="track" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[4].title}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <StepHead n={5} kicker="Track everything" title={<>Without tracking, ads are <span className="text-turbo-grad">a slot machine.</span></>} lede="Every click, call, form and booking gets sent back to Google, Meta, Microsoft, TikTok and Reddit — so their algorithms learn who actually buys and find you more of them." />
            <ul className="mt-6 space-y-2.5">
              <Tick>GA4 + Google Tag Manager, set up properly (not “installed”)</Tick>
              <Tick>Meta Pixel + Conversions API, so iPhone privacy doesn't blind your ads</Tick>
              <Tick>Google Ads enhanced conversions, Microsoft UET, TikTok and Reddit pixels</Tick>
              <Tick>Calls, bookings and purchases counted once — no double counting</Tick>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">We call it pixel plumbing. You'll never have to think about it.</p>
          </div>
          <Reveal from="zoom">
            <TagPipeline />
          </Reveal>
        </div>
        <Ask className="container-x mt-12">Do you know exactly which ad got you your last customer? Yeah… most people don't.</Ask>
      </section>

      {/* STEP 6 — ads on the right platforms */}
      <section id="ads" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[5].title}>
        <div className="container-x">
          <StepHead n={6} kicker="Run the right ads" title={<>Ads where <span className="text-turbo-grad">your</span> buyers actually are.</>} lede="A plumber, a Shopify store and a rapper should not run the same ads. We pick the platforms for your business — Google, Microsoft, Meta, TikTok, X, Reddit, LinkedIn or Spotify — and point them at the data from step 5." />
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <PlatformPicker />
            </Reveal>
            <Reveal delay={120}>
              <dl className="grid grid-cols-3 gap-3">
                <Stat small v={String(AD_TOTALS.leads)} l="leads for clients" tone="turbo" />
                <Stat small v={money(AD_TOTALS.avgCpl)} l="average per lead" />
                <Stat small v={money(AD_TOTALS.lowestCpl)} l="lowest per lead" />
              </dl>
              <p className="mt-6 text-[16px] sm:text-lg">
                <span className="font-semibold">Appliance King:</span> {ak.count} leads at {money(ak.costPer)} each from {money(ak.spent)} in ads.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Ad spend goes straight from your card to the platform. We never mark it up.</p>
            </Reveal>
          </div>
          <div className="mt-10">
            <AdResultsGrid keys={["appliance-king", "ryan-pool", "stackmode-repair"]} />
          </div>
          <Ask className="mt-12">What do you sell? Comment it and I'll tell you which platform I'd start with.</Ask>
        </div>
      </section>

      {/* STEP 7 — keep them coming back */}
      <section id="return" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[6].title}>
        <div className="container-x">
          <StepHead n={7} kicker="Bring them back" title={<>Getting a customer is expensive. <span className="text-turbo-grad">Keeping one is cheap.</span></>} lede="Most businesses are sitting on a list of past customers they never talk to. That's free money." />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Mail, t: "Email campaigns", b: "We set up your email system and automations — welcome, review request, win-back — so you can email your whole customer list in one click." },
              { icon: CalendarCheck, t: "Your own booking calendar", b: "People book you 24/7 from your site, Google profile and Instagram. Reminders go out automatically, so fewer no-shows." },
              { icon: ShieldCheck, t: "Website care", b: "Security patches, software updates, backups and the latest SEO and AI search changes — every month, so your site never goes stale or gets hacked." },
            ].map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 120} className="panel h-full p-6">
                <c.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 text-xl font-semibold">{c.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{c.b}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden /> Google and AI search change every month. Turbo Care ({price("care")}/mo) keeps you current so you don't slide back down.
          </p>
        </div>
      </section>

      {/* STEP 8 — DIY vs done-for-you → packages → book */}
      <section id="done" className="section scroll-mt-28 border-t border-border" aria-label={CUSTOMER_STEPS[7].title}>
        <div className="container-x">
          <StepHead n={8} kicker="We do it all" title={<>You can do all this yourself. <span className="text-turbo-grad">Or keep running your business.</span></>} lede="Here's what you'd have to learn to do it right:" />
          <Reveal className="mt-8">
            <ul className="flex flex-wrap gap-2" aria-label="Technical work we handle for you">
              {NERD_STUFF.map((t) => (
                <li key={t} className="rounded-full bg-white/[0.04] px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-white/10">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <HoursMeter className="mt-10 max-w-3xl" />
          <Ask className="mt-12">Would you rather learn what “DMARC” means… or get more customers? Exactly.</Ask>

          <h3 className="mt-16 text-3xl font-bold leading-tight sm:text-5xl">
            The whole thing, done for you: <span className="text-turbo-grad">{price("pkg-launch")} one-time.</span>
          </h3>
          <p className="mt-3 max-w-2xl text-[17px] text-muted-foreground">Most agencies charge that much for a website alone — then bill separately for SEO, tracking and ads. No contracts. You own everything.</p>
          <div className="mt-10">
            <PackageGrid source={SOURCE} />
          </div>
        </div>
      </section>

      <section className="pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact title="Businesses don't keep paying for something that doesn't work." />
        </div>
      </section>

      {/* The founder */}
      <section className="section border-t border-border" aria-label="Talk to the founder">
        <div className="container-x grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal from="left">
            <img src={SITE.founder.image} alt={`${SITE.founder.name}, founder and CEO of CEO Turbo`} width={720} height={539} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-white/10" />
          </Reveal>
          <div>
            <h2 className="text-[34px] font-bold leading-[1.03] sm:text-5xl">
              No account managers. <span className="text-turbo-grad">You talk to me.</span>
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
              I'm {SITE.founder.name}. On a free 30-minute call I'll pull up your website, Google profile, reviews, socials and ads with you — live — and tell you the one move that brings customers fastest. If you want us to do it, you get a fixed price. If not, keep the plan.
            </p>
            <ul className="mt-6 space-y-2.5">
              <Tick>Free 30 minutes, video or phone</Tick>
              <Tick>Your #1 money move, not a 40-item to-do list</Tick>
              <Tick>Zero pressure. Worst case, you leave with a free plan.</Tick>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton note={`${SOURCE} — founder`} className="btn-shine">
                Book my free call with Christopher
              </BookButton>
              <CallLink location="customers tutorial founder" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-chrome hover:text-foreground">
                <Phone className="h-4 w-4" aria-hidden /> Call our office: {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
        <div className="container-x mt-14">
          <ol className="grid grid-cols-2 gap-2 text-center text-sm font-semibold sm:grid-cols-4 lg:grid-cols-8">
            {CUSTOMER_STEPS.map((s, i) => (
              <li key={s.id} className={cn("rounded-xl px-3 py-3 ring-1", i === CUSTOMER_STEPS.length - 1 ? "bg-ignite/15 text-ignite ring-ignite/40" : "bg-white/[0.03] ring-white/10")}>
                {i + 1}. {s.label}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BookingSection note={`${SOURCE} — booking`} title="Your plan is 6 quick taps away. Then pick a time." primary />
    </>
  );
}
