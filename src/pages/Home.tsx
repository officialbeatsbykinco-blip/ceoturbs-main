import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight, Building2, CalendarCheck, Check, Dumbbell, Hammer, House, Laptop, Megaphone, MessageSquare, Monitor, Phone, Scissors, Shirt, Star, Store, UtensilsCrossed, Wrench } from "lucide-react";
import { BookButton, InstallBookButton } from "@/components/cta/Actions";
import { SectionHeader } from "@/components/blocks/Basics";
import { ContactBand } from "@/components/shop/StoreSections";
import { BestResults, ProofStats, AdGallery } from "@/components/blocks/Proof";
import { MobileMore } from "@/components/blocks/MobileMore";
import { SiteWall } from "@/components/visuals/SiteWall";
import { BeforeAfter, OFFICE_BEFORE_AFTER } from "@/components/visuals/BeforeAfter";
import { CallLink } from "@/components/site/CallLink";
import { IT_BOOKING, SITE, fromPriceLabel } from "@/config/site";
import { ADS } from "@/content/ads";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { SHIRTS_PATH, shirtFromLabel } from "@/content/company-shirts";
import { SHOP_PATH } from "@/content/review-cards";
import { itPrice, usd, byId } from "@/content/pricing";
import { OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { smsHref } from "@/lib/sms";
import { cn } from "@/lib/utils";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";

const HOME_TEXT = "Hi Chris, I need help with: ";

// Short on purpose: an icon, who, and what we do for them. People scan this, they don't read it.
const WHO = [
  { icon: House, t: "Homes & families", b: "Computers, phones, tablets, Wi-Fi" },
  { icon: Monitor, t: "Home offices", b: "Desks, monitors, cables" },
  { icon: Building2, t: "Offices & clinics", b: "Workstations, printers, network" },
  { icon: UtensilsCrossed, t: "Restaurants", b: "Menu screens, TVs, POS" },
  { icon: Store, t: "Shops & retail", b: "POS, websites, ads" },
  { icon: Hammer, t: "Contractors & repair", b: "Websites & ads that get calls" },
  { icon: Scissors, t: "Barbers & salons", b: "Booking sites & ads" },
  { icon: Dumbbell, t: "Gyms & studios", b: "TVs, Wi-Fi, ads" },
];

/**
 * Funnel: three doors (fix my tech, set up my office, get more customers), each to its own page built to book.
 * Then proof for each (the before/after desk, the sites, the ad dashboards), company shirts, and call/text/book again.
 * Review cards live on their own page, linked once near the bottom.
 */
export default function Home() {
  const navigate = useNavigate();
  // Old Shopping-feed and ad links pointed at /?pack=N when the store was the homepage.
  useEffect(() => {
    const q = window.location.search;
    if (new URLSearchParams(q).has("pack")) navigate(`${SHOP_PATH}${q}`, { replace: true });
  }, [navigate]);
  return (
    <>
      <section className="relative overflow-clip pt-[84px] sm:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative mx-auto max-w-6xl text-center">
          <p className="chip">Tampa, FL · 40 miles around · remote too</p>
          <h1 id="hero" className="mx-auto mt-3 max-w-4xl text-[34px] font-bold leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl">
            <span className="text-chrome-grad">We fix it, set it up</span> <span className="text-turbo-grad">and get you customers.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            Tampa's tech help and growth team: computer and phone repair, office setup, and websites &amp; ads.
          </p>

          <div className="mx-auto mt-5 grid max-w-6xl gap-3 text-left sm:mt-8 sm:gap-4 md:grid-cols-3 md:gap-y-0">
            <HeroDoor
              featured
              kicker="Something broken or slow?"
              title="Computer & phone repair"
              media={
                <span className="grid h-16 w-16 place-items-center rounded-xl bg-turbo/10 ring-1 ring-turbo/30 sm:h-20 sm:w-20">
                  <Laptop className="h-8 w-8 text-turbo" aria-hidden />
                </span>
              }
              lede="Slow, crashing or won't turn on. Computers, phones and tablets fixed at your door. Slow Windows PCs sped up remotely."
              points={[`Speed-up from ${itPrice("it-speedup")}`, `Remote speed-up from ${itPrice("it-remote")}`, "No fix, no charge"]}
              proof={
                <>
                  <span className="font-semibold">Price up front</span>
                  <span className="text-muted-foreground">· we come to you</span>
                </>
              }
              cta={
                <FixMyTechLink source="home hero" className="btn-ignite btn-shine inline-flex w-full items-center justify-center gap-2 !py-4 !text-base">
                  Fix my tech <ArrowRight className="h-4 w-4" aria-hidden />
                </FixMyTechLink>
              }
              secondary={
                <a href={smsHref("Hi Chris, I need computer or phone help. Device and problem: ")} data-call-location="home hero repair text" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  <MessageSquare className="h-4 w-4 text-turbo" aria-hidden /> or text us
                </a>
              }
            />
            <HeroDoor
              kicker="Messy desk or office?"
              title="Office setup & cables"
              media={<img src="/img/office/after-640.webp" alt="A three-monitor workstation we set up" width={96} height={96} loading="eager" decoding="async" className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/10 sm:h-20 sm:w-20" />}
              lede="Multi-monitor and multi-computer desks, cable management, printers, Wi-Fi and Microsoft or Google set up."
              points={[`From ${usd(byId("office-basic").price)} per desk`, "Homes and businesses", "Flat price in writing"]}
              proof={
                <>
                  <span className="font-semibold">See the before & after</span>
                </>
              }
              cta={
                <Link to={OFFICE_SETUP_PATH} className="btn-chrome inline-flex w-full items-center justify-center gap-2">
                  Set up my office <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              }
              secondary={
                <CallLink location="home hero office" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  <Phone className="h-4 w-4 text-turbo" aria-hidden /> or call
                </CallLink>
              }
            />
            <HeroDoor
              kicker="Want more customers?"
              title="Websites & ads"
              media={
                <div className="grid h-16 w-16 place-content-center rounded-xl bg-turbo/10 text-center ring-1 ring-turbo/30 sm:h-20 sm:w-20">
                  <span className="font-display text-lg font-bold leading-none text-turbo sm:text-xl">{money(AD_TOTALS.avgCpl)}</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">per lead</span>
                </div>
              }
              lede={`Websites that get calls, Google profile, and Meta & Google ads. ${AD_TOTALS.leads} leads for clients at ${money(AD_TOTALS.avgCpl)} each.`}
              points={["Free 30-minute call", "No long-term contract", `${CLIENTS.length} client sites live`]}
              proof={
                <>
                  <span className="font-semibold">Leads-or-free guarantee</span>
                </>
              }
              cta={
                <Link to="/grow" className="btn-chrome inline-flex w-full items-center justify-center gap-2">
                  Get more customers <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              }
              secondary={
                <BookButton note="Home hero" variant="link">
                  <CalendarCheck className="h-4 w-4" aria-hidden /> or book a free call
                </BookButton>
              }
            />
          </div>
          <div className="mx-auto mt-4 flex max-w-6xl items-center gap-3 rounded-2xl border border-border bg-white/[0.02] p-3 text-left sm:mt-5 sm:gap-4 sm:p-4">
            <img src={SITE.founder.image} alt="" width={48} height={48} className="hidden h-12 w-12 shrink-0 rounded-xl object-cover sm:block" />
            <p className="flex-1 text-sm leading-snug">
              <span className="font-semibold">Hi, I'm Chris, based in Tampa.</span>{" "}
              <span className="text-muted-foreground">Broken computer, messy office or need customers? You talk to me, not a call center.</span>
            </p>
            <CallLink location="home hero founder" className="btn-chrome hidden shrink-0 items-center gap-2 !px-4 !py-2.5 !text-sm sm:inline-flex">
              <Phone className="h-4 w-4 text-turbo" aria-hidden /> {SITE.phone.display}
            </CallLink>
            <a href={smsHref(HOME_TEXT)} data-call-location="home hero founder text" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/15 sm:hidden">
              <MessageSquare className="h-5 w-5 text-turbo" aria-hidden />
              <span className="sr-only">Text {SITE.founder.name}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="office-proof">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <BeforeAfter {...OFFICE_BEFORE_AFTER} label="home" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Office setup</p>
            <h2 id="office-proof" className="h-section mt-2">From closed laptops to a three-screen workstation.</h2>
            <p className="lede">A real desk we set up: three monitors, one keyboard and mouse, printer connected and every cable routed. Drag the photo to compare.</p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
              {["Multi-monitor & multi-computer desks", "Cable management that stays clean", "Printers, Wi-Fi, Microsoft & Google set up"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={OFFICE_SETUP_PATH} className="btn-ignite inline-flex items-center justify-center gap-2">
                See office setup <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <CallLink location="home office proof" icon className="btn-chrome justify-center">
                Call {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="repair">
        <div className="container-x">
          <div className="panel grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Tech repair</p>
              <h2 id="repair" className="h-section mt-2">Old computer? Make it feel new.</h2>
              <p className="lede">Slow, freezing, crashing, viruses or won't turn on. Most computers don't need replacing. We fix them at your door within 40 miles of Tampa, or speed up Windows remotely.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {[
                  ["Speed-up", itPrice("it-speedup")],
                  ["Remote speed-up", itPrice("it-remote")],
                  ["Virus removal", itPrice("it-virus")],
                  ["SSD upgrade", itPrice("it-ssd")],
                  ["iPhone screen", itPrice("it-iphone-screen")],
                ].map(([k, v]) => (
                  <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                    {k} <span className="font-semibold text-foreground">{v}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <FixMyTechLink source="home repair band" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2">
                <Wrench className="h-4 w-4" aria-hidden /> Get a repair price
              </FixMyTechLink>
              <InstallBookButton note="home-repair-band" booking={IT_BOOKING} title="Book your tech visit" variant="chrome" className="inline-flex items-center justify-center gap-2">
                <CalendarCheck className="h-4 w-4" aria-hidden /> Book a visit
              </InstallBookButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x">
          <SectionHeader kicker="Who we help" title={<span id="who">Homes and businesses around Tampa.</span>} lede="In person within 40 miles. Remote help, websites and ads anywhere." />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WHO.map((w) => (
              <li key={w.t} className="panel p-4 sm:p-5">
                <w.icon className="h-7 w-7 text-turbo" aria-hidden />
                <h3 className="mt-2.5 font-display text-base font-bold leading-tight sm:text-lg">{w.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="work" className="scroll-mt-20 border-t border-border pt-14 sm:pt-20" aria-labelledby="work-title">
        <div className="container-x text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Websites</p>
          <h2 id="work-title" className="h-section mx-auto mt-2 max-w-3xl">{CLIENTS.length} real websites we built. All live.</h2>
          <p className="lede mx-auto max-w-2xl">Tap any site to see it.</p>
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

      <section className="section" aria-labelledby="ads-proof">
        <div className="container-x">
          <SectionHeader kicker="Ads" title={<span id="ads-proof">Real leads on small budgets.</span>} lede="Real dashboards from our clients. A few hundred dollars in ads turned into thousands in jobs." />
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

      <section className="section border-t border-border" aria-labelledby="shirts">
        <div className="container-x">
          <div className="cta-glow grid items-center gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto]">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-turbo/15 text-turbo">
              <Shirt className="h-8 w-8" aria-hidden />
            </span>
            <div>
              <h2 id="shirts" className="font-display text-2xl font-bold sm:text-3xl">Company t-shirts with your logo.</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">Your team looks like a real business on every job. No minimum, from {shirtFromLabel}. Design it online, or call and we'll do it for you.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link to={SHIRTS_PATH} className="btn-ignite inline-flex items-center justify-center gap-2 whitespace-nowrap">
                Design my shirts <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <CallLink location="home shirts" className="btn-chrome inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Phone className="h-4 w-4 text-turbo" aria-hidden /> Call to order
              </CallLink>
            </div>
          </div>
          <Link to={SHOP_PATH} className="panel mt-4 flex items-center gap-3 p-4 text-sm transition hover:ring-1 hover:ring-turbo/50">
            <Star className="h-5 w-5 shrink-0 fill-current text-amber-400" aria-hidden />
            <span className="flex-1">
              <span className="font-semibold">Also: Google review cards.</span> <span className="text-muted-foreground">Customers tap and your review page opens. From {fromPriceLabel}.</span>
            </span>
            <ArrowRight className="h-4 w-4 text-turbo" aria-hidden />
          </Link>
        </div>
      </section>

      <ContactBand />

      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 id="last-call" className="h-section">Tell us what you need. We'll handle it.</h2>
            <p className="lede mx-auto max-w-2xl">Call or text {SITE.phone.display}. Repairs and setups get a price up front, websites and ads start with a free call.</p>
            <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
              <CallLink location="home final CTA" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
              <a href={smsHref(HOME_TEXT)} data-call-location="home final CTA text" className="btn-chrome inline-flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4 text-turbo" aria-hidden /> Text us
              </a>
              <BookButton note="Home final CTA" variant="chrome" className="inline-flex items-center justify-center gap-2">
                <Megaphone className="h-4 w-4" aria-hidden /> Websites &amp; ads call
              </BookButton>
            </div>
          </div>
        </div>
      </section>

      <HomeBar />
    </>
  );
}

/**
 * One hero offer. Fixed row order (kicker, title + media, lede, points, proof, buttons) with the buttons pinned to the bottom,
 * so two doors side by side always line up (subgrid on desktop matches every row, not just the buttons). Lede and points are hidden on phones so both buttons fit on the first screen;
 * the proof line stays, so each door still carries its strongest reason.
 */
function HeroDoor({ featured, kicker, title, media, lede, points, proof, cta, secondary }: {
  featured?: boolean;
  kicker: string;
  title: string;
  media: ReactNode;
  lede: string;
  points: string[];
  proof: ReactNode;
  cta: ReactNode;
  secondary: ReactNode;
}) {
  return (
    <div className={cn("panel flex flex-col p-4 sm:p-7 md:row-span-5 md:grid md:grid-rows-subgrid md:gap-y-0", featured && "ring-1 ring-turbo/50")}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-turbo">{kicker}</p>
          <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight sm:text-[26px]">{title}</h2>
        </div>
        <div className="shrink-0">{media}</div>
      </div>
      {/* Phones keep the card's one-line explainer: without it the first screen never says what the card does. */}
      <p className={cn("mt-2 text-muted-foreground", featured ? "text-[15px] leading-snug sm:text-base" : "hidden sm:block")}>{lede}</p>
      <ul className="mt-4 hidden gap-1.5 text-sm sm:grid">
        {points.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm sm:mt-4">{proof}</p>
      <div className="mt-auto flex flex-col items-center justify-end pt-3 sm:pt-5">
        {cta}
        <div className="sm:mt-1">{secondary}</div>
      </div>
    </div>
  );
}

/** One line that sends the reader who just saw the proof to the calendar or the phone. */
function BookCallStrip({ note, className }: { note: string; className?: string }) {
  return (
    <div className={cn("panel flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left", className)}>
      <div>
        <p className="font-display text-lg font-bold sm:text-xl">Want results like these for your business?</p>
        <p className="mt-1 text-sm text-muted-foreground">Free 30-minute call. No pressure.</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <BookButton note={note} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
        </BookButton>
        <CallLink location={note} className="btn-chrome inline-flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-turbo" aria-hidden /> Call now
        </CallLink>
      </div>
    </div>
  );
}

/** Sticky bottom bar once the hero is gone: text, call, or jump to repair. */
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
        <FixMyTechLink source="home sticky bar" className="btn-ignite inline-flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
          <Wrench className="h-4 w-4 shrink-0" aria-hidden /> Fix my tech
        </FixMyTechLink>
        <CallLink location="home sticky bar" className="btn-blue inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
          <Phone className="h-4 w-4 shrink-0" aria-hidden /> Call
        </CallLink>
        <a href={smsHref(HOME_TEXT)} data-call-location="home sticky bar text" tabIndex={show ? undefined : -1} className="btn-chrome inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden /> Text
        </a>
      </div>
    </div>
  );
}
