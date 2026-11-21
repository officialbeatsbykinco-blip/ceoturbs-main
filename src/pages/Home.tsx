import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Building2, CalendarCheck, Cctv, Check, Cpu, Gauge, Globe, HardDrive, Laptop, Mail, MapPin, MessageSquare, Monitor, Phone, Power, ShieldCheck, Smartphone, Star, Wrench, type LucideIcon } from "lucide-react";
import { InstallBookButton } from "@/components/cta/Actions";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BeforeAfter, OFFICE_BEFORE_AFTER } from "@/components/visuals/BeforeAfter";
import { ServiceAreaList } from "@/components/blocks/ServiceAreaList";
import { CallLink } from "@/components/site/CallLink";
import { PhoneOnly } from "@/components/booking/BookOrText";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { FounderBadge } from "@/components/tech/FounderBadge";
import { ReviewSummary, ReviewWall } from "@/components/tech/ReviewWall";
import { JobPhotos } from "@/components/tech/JobPhotos";
import { OFFICE_AD } from "@/components/tech/TechAdGallery";
import { INSTALL_BOOKING, IT_BOOKING, REVIEWS, SITE } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { INSTALL_PRICES, itPrice, usd } from "@/content/pricing";
import { CLIENTS } from "@/content/clients";
import { SiteWall } from "@/components/visuals/SiteWall";
import { OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { TECH_HOME_FAQS } from "@/content/tech-faqs";
import { OFFICE_FROM } from "@/components/blocks/OfficePrices";
import { cn } from "@/lib/utils";
import { GrowEverywhere, ReviewCardPacks } from "@/components/blocks/GrowEverywhere";

/**
 * The homepage is tech support first: Windows laptop and desktop repair (the most calls: speed-ups, blue screens,
 * won't turn on), office IT setups (the biggest jobs), cameras and doorbells, and phone and tablet setup (setup only,
 * no phone repairs). No Macs or laptop screens. Phones get "text us"
 * (the tap-question sheet) and call; computers get Book a visit and call. Below the repair services sit the
 * digital ones with their own buy buttons (websites, ads, SEO/DNS fixes, Google review cards); the full agency lives at /grow.
 */

const SERVICES: { icon: LucideIcon; t: string; b: string; price: string; to: string; cta: string; tech?: boolean }[] = [
  { icon: Gauge, t: "Make my PC faster", b: "Slow, freezing or full of junk: cleaned up, updated and an SSD if it needs one. At your door, or remotely anywhere.", price: itPrice("it-speedup"), to: "/computer-repair-tampa", cta: "Speed up my PC", tech: true },
  { icon: AlertTriangle, t: "Blue screens & crashes", b: "Blue screens, restarts, freezing and Windows updates gone wrong, found and fixed for good.", price: itPrice("it-pc-repair"), to: "/computer-repair-tampa", cta: "Fix my crashes", tech: true },
  { icon: Power, t: "Won't turn on", b: "No power, no lights or stuck on boot. Laptops and desktops, including gaming PCs: power supplies, memory and parts.", price: itPrice("it-desktop"), to: "/computer-repair-tampa", cta: "Fix my computer", tech: true },
  { icon: Cctv, t: "Cameras & Ring doorbells", b: "Ring, Nest, Blink or Wyze doorbells and Wi-Fi cameras installed and working on your phone. Homes and businesses.", price: `from ${usd(INSTALL_PRICES.find((p) => p.id === "cam-wifi")!.price)} per camera`, to: "/security-camera-installation-tampa", cta: "Install my cameras" },
  { icon: Smartphone, t: "Phone & tablet setup", b: "New iPhone, Android or iPad set up with your photos, contacts, texts, email and apps moved over. Setup only, no repairs.", price: itPrice("it-phone-setup"), to: "/computer-repair-tampa", cta: "Set up my phone", tech: true },
  { icon: Building2, t: "Office IT setup", b: "Workstations, multi-monitor desks, printers, Wi-Fi, Microsoft 365 or Google email, and cables hidden. Homes and businesses.", price: OFFICE_FROM, to: OFFICE_SETUP_PATH, cta: "Set up my office" },
];

const FIXES: { icon: LucideIcon; t: string }[] = [
  { icon: Wrench, t: "Won't turn on or won't boot" },
  { icon: Gauge, t: "Slow, freezing or crashing" },
  { icon: ShieldCheck, t: "Viruses and scam pop-ups" },
  { icon: AlertTriangle, t: "Blue screens fixed" },
  { icon: Cpu, t: "SSD, memory and parts upgrades" },
  { icon: HardDrive, t: "Files and photos recovered or moved" },
  { icon: Laptop, t: "Printers, email and software" },
  { icon: Monitor, t: "Desktops and gaming PCs" },
];

const PROMISES = ["Price up front, before any work", "No fix, no charge", "Usually same or next day", "Pay after it works"];

const STEPS = [
  { icon: MessageSquare, t: "Call, text or book", b: "Tell us the device and what's wrong, or how many desks you need set up." },
  { icon: Check, t: "Price up front", b: "You get the price before any work starts. No surprise bill." },
  { icon: Wrench, t: "Fixed at your place", b: "We come to your home or office around Tampa, fix it, test it with you, then you pay." },
];

const PRICES: [string, string][] = [
  ["Computer & laptop repair", itPrice("it-pc-repair")],
  ["Desktop repair & upgrades", itPrice("it-desktop")],
  ["Windows speed-up", itPrice("it-speedup")],
  ["Remote speed-up", itPrice("it-remote")],
  ["Virus & pop-up removal", itPrice("it-virus")],
  ["SSD upgrade", itPrice("it-ssd")],
  ["Phone & tablet setup", itPrice("it-phone-setup")],
  ["Office on-site IT", `${itPrice("it-business-hour")}/hr`],
];

export default function Home() {
  const navigate = useNavigate();
  // Old Shopping-feed and ad links pointed at /?pack=N when the store was the homepage.
  useEffect(() => {
    const q = window.location.search;
    if (new URLSearchParams(q).has("pack")) navigate(`${SHOP_PATH}${q}`, { replace: true });
  }, [navigate]);
  return (
    <>
      <section className="relative overflow-clip pb-6 pt-24 sm:pt-32 lg:pb-10" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 hero-rings" aria-hidden />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="hero-rise min-w-0">
            <p className="chip">
              <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Tampa Bay · we come to you
            </p>
            <h1 id="hero" className="mt-4 font-display text-[38px] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[68px]">
              Computer repair, cameras &amp; setup <span className="text-turbo-grad">at your door in Tampa.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
              Slow PCs made fast, blue screens fixed, dead computers brought back. Windows laptops and desktops repaired; cameras, Ring doorbells, phones and tablets set up. Price up front, no fix no charge. For businesses anywhere: websites, ads and Google review cards.
            </p>
            <ReviewSummary className="mt-4" />
            <PhoneOnly
              desktop={
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <InstallBookButton note="home-hero" booking={IT_BOOKING} title="Book your tech visit" variant="ignite" className="btn-shine inline-flex items-center justify-center gap-2 !rounded-2xl !px-8 !py-[18px] !text-lg font-bold shadow-xl">
                    <CalendarCheck className="h-5 w-5" aria-hidden /> Book a visit
                  </InstallBookButton>
                  <CallLink location="home hero call" className="btn-blue inline-flex items-center justify-center gap-2 !rounded-2xl !py-[18px] !text-lg font-bold">
                    <Phone className="h-5 w-5" aria-hidden /> Call {SITE.phone.display}
                  </CallLink>
                </div>
              }
            >
              <div className="mt-7 flex flex-col gap-3">
                <CallLink location="home hero call" className="btn-ignite btn-shine inline-flex w-full items-center justify-center gap-2 !rounded-2xl !py-[18px] !text-lg font-bold shadow-xl">
                  <Phone className="h-5 w-5" aria-hidden /> Call {SITE.phone.display}
                </CallLink>
                <FixMyTechLink source="home hero" className="btn-blue inline-flex w-full items-center justify-center gap-2 !rounded-2xl !py-4 !text-base font-bold">
                  <MessageSquare className="h-5 w-5" aria-hidden /> Text us: 3 quick taps
                </FixMyTechLink>
                <p className="text-center text-sm text-muted-foreground">Chris answers or texts back from {SITE.phone.display}</p>
              </div>
            </PhoneOnly>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <FixMyTechLink source="home hero" className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
                <Wrench className="h-4 w-4" aria-hidden /> Computer repair
              </FixMyTechLink>
              <Link to={OFFICE_SETUP_PATH} className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
                <Building2 className="h-4 w-4" aria-hidden /> Office setup
              </Link>
              <Link to="/grow" className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
                <Globe className="h-4 w-4" aria-hidden /> Websites &amp; ads
              </Link>
              <Link to={SHOP_PATH} className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
                <Star className="h-4 w-4" aria-hidden /> Google review cards
              </Link>
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Tech help in Tampa")}`} data-call-location="home hero email" className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
                <Mail className="h-4 w-4" aria-hidden /> Email us
              </a>
            </div>
            <ul className="mt-5 grid max-w-xl gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
              {PROMISES.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroPhoto />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <SectionHeader kicker="What we do" title={<span id="services">Fixed, set up and working.</span>} lede="Windows laptops and desktops are what we repair. Cameras, doorbells, phones, tablets and offices we set up. No Macs, no phone repairs, no laptop screens." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const inner = (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-turbo/15 text-turbo">
                    <s.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold leading-tight sm:text-xl">{s.t}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
                  <p className="mt-4 text-sm font-bold text-foreground">{s.price}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-turbo">
                    {s.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </>
              );
              const cls = "panel group flex h-full flex-col p-5 transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5),0_30px_60px_-30px_hsl(var(--turbo)/0.5)] sm:p-6";
              return (
                <li key={s.t}>
                  {s.tech ? (
                    <FixMyTechLink source={`home service ${s.t}`} to={s.to} className={cls}>
                      {inner}
                    </FixMyTechLink>
                  ) : (
                    <Link to={s.to} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <GrowEverywhere where="home" />

      <section className="section border-t border-border" aria-labelledby="work">
        <div className="container-x">
          <SectionHeader center kicker="Our work" title={<span id="work">{CLIENTS.length} real websites we built. All live.</span>} lede="Tap any site to see the business, what we built and the results." />
        </div>
        <div className="mt-8">
          <SiteWall eagerCount={0} />
        </div>
        <div className="container-x mt-6 text-center">
          <Link to="/portfolio" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
            See every website we built <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="reviews">
        <div className="container-x">
          <SectionHeader kicker="Reviews" title={<span id="reviews">Tampa customers call us back.</span>} lede="Real Google reviews, word for word." />
          <ReviewWall className="mt-8" />
        </div>
      </section>

      <ReviewCardPacks where="home" />

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x">
          <SectionHeader kicker="Why Tampa calls us" title={<span id="why">Skip the repair shop. We come to you.</span>} lede="Real photos from our jobs: office desks set up, desktops opened up and fixed, computers reset and ready." />
          <JobPhotos className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="fix">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeader kicker="Computer repair" title={<span id="fix">If it's a Windows PC, we fix it.</span>} lede="Laptops, desktops and gaming PCs, any brand. Most slow computers don't need replacing: a cleanup and an SSD makes them feel new." />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {FIXES.map((f) => (
                <li key={f.t} className="flex items-center gap-3 text-[15px]">
                  <f.icon className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {f.t}
                </li>
              ))}
            </ul>
            <TechCtas where="home fix" className="mt-7" />
          </div>
          <div className="panel p-5 sm:p-6">
            <p className="font-display text-lg font-bold">Starting prices</p>
            <p className="mt-1 text-sm text-muted-foreground">Exact price before any work. Parts extra, at cost. Diagnosis {itPrice("it-visit")}, credited to the repair.</p>
            <ul className="mt-4 divide-y divide-border/60">
              {PRICES.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>{k}</span>
                  <span className="font-bold">{v}</span>
                </li>
              ))}
            </ul>
            <Link to="/computer-repair-tampa" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See every repair price <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="office">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <BeforeAfter {...OFFICE_BEFORE_AFTER} label="home office" />
            <p className="mt-2 text-sm text-muted-foreground">A real desk we set up in Tampa. Drag to compare.</p>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader kicker="Office IT setup" title={<span id="office">Your office, set up right in a day.</span>} lede={`Workstations, multi-monitor desks, printers, Wi-Fi, Microsoft 365 or Google email, and every cable hidden. ${OFFICE_FROM}, price in writing first.`} />
            {REVIEWS.find((r) => r.job === "Office IT setup") && (
              <p className="mt-4 rounded-2xl border border-border bg-card/80 p-4 text-[15px] italic text-foreground">
                "{REVIEWS.find((r) => r.job === "Office IT setup")!.short}"
                <span className="mt-1 block text-sm not-italic text-muted-foreground">{REVIEWS.find((r) => r.job === "Office IT setup")!.name}, Google review</span>
              </p>
            )}
            <img src={OFFICE_AD.src} srcSet={OFFICE_AD.srcSet} sizes="(min-width: 1024px) 560px, 100vw" width={OFFICE_AD.width} height={OFFICE_AD.height} loading="lazy" decoding="async" alt={OFFICE_AD.alt} className="mt-5 w-full rounded-2xl ring-1 ring-border" />
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <InstallBookButton note="home-office" booking={INSTALL_BOOKING} title="Book your office setup" variant="ignite" className="inline-flex items-center justify-center gap-2">
                <CalendarCheck className="h-4 w-4" aria-hidden /> Book an office setup
              </InstallBookButton>
              <Link to={OFFICE_SETUP_PATH} className="btn-chrome inline-flex items-center justify-center gap-2">
                See office setup <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader kicker="How it works" title={<span id="how">Three steps, no surprises.</span>} />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-white">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-turbo" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
          <FounderBadge className="mt-8 max-w-2xl" line="I come to your door and do the work myself. Call or text and you get me, not a call center." />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader kicker="Service area" title={<span id="area">Where we come to you</span>} lede="About 40 miles around Temple Terrace and Tampa. Slow Windows computers can be fixed remotely from anywhere." />
          <ServiceAreaList className="mt-8" />
        </div>
      </section>

      <FAQList faqs={TECH_HOME_FAQS} title="Quick answers" />

      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 id="last-call" className="h-section">Computer acting up? Get it fixed this week.</h2>
            <p className="lede mx-auto max-w-2xl">
              <PhoneOnly desktop={<>Call {SITE.phone.display} or pick a time. Price up front, no fix no charge.</>}>Call or text {SITE.phone.display}. Price up front, no fix no charge.</PhoneOnly>
            </p>
            <TechCtas where="home final" className="mt-7 sm:justify-center" />
          </div>
        </div>
      </section>

      <HomeBar />
    </>
  );
}

/** Phones: call first, then the tap-question text. Computers: book a visit, then call. */
function TechCtas({ where, className }: { where: string; className?: string }) {
  return (
    <PhoneOnly
      desktop={
        <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
          <InstallBookButton note={where.replace(/ /g, "-")} booking={IT_BOOKING} title="Book your tech visit" variant="ignite" className="btn-shine inline-flex items-center justify-center gap-2">
            <CalendarCheck className="h-4 w-4" aria-hidden /> Book a visit
          </InstallBookButton>
          <CallLink location={where} icon className="btn-blue justify-center">
            Call {SITE.phone.display}
          </CallLink>
        </div>
      }
    >
      <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
        <CallLink location={where} icon className="btn-ignite justify-center !py-4 !text-lg">
          Call {SITE.phone.display}
        </CallLink>
        <FixMyTechLink source={where} className="btn-blue inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <MessageSquare className="h-5 w-5" aria-hidden /> Text us
        </FixMyTechLink>
      </div>
    </PhoneOnly>
  );
}

/** Sticky bottom bar once the hero is gone: book (computers) or text (phones), plus call. */
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
      <PhoneOnly
        desktop={
          <div className="mx-auto flex max-w-3xl gap-2">
            <InstallBookButton note="home-sticky-bar" booking={IT_BOOKING} title="Book your tech visit" variant="ignite" className="inline-flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
              <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden /> Book a visit
            </InstallBookButton>
            <CallLink location="home sticky bar" className="btn-blue inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
              <Phone className="h-4 w-4 shrink-0" aria-hidden /> Call
            </CallLink>
          </div>
        }
      >
        <div className="mx-auto flex max-w-3xl gap-1.5">
          <CallLink location="home sticky bar" className="btn-ignite inline-flex flex-[1.2] items-center justify-center gap-1.5 whitespace-nowrap !px-2 !py-3.5 !text-base font-bold shadow-lg">
            <Phone className="h-4 w-4 shrink-0" aria-hidden /> Call
          </CallLink>
          <FixMyTechLink source="home sticky bar" className="btn-blue inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-2 !py-3.5 !text-base">
            <MessageSquare className="h-4 w-4 shrink-0" aria-hidden /> Text
          </FixMyTechLink>
        </div>
      </PhoneOnly>
    </div>
  );
}

/** The hero picture: a real office we set up, with the newest review and the "we come to you" badge on top. */
function HeroPhoto() {
  const r = REVIEWS[0];
  return (
    <div className="hero-rise relative mx-auto mb-8 w-full max-w-lg lg:mb-0 lg:max-w-none" style={{ animationDelay: "0.12s" }}>
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-turbo/15 via-transparent to-[hsl(var(--ignite)/0.18)] blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgb(20_40_90/0.45)] ring-1 ring-black/5">
        <img
          src="/img/office/after-1200.webp"
          srcSet="/img/office/after-640.webp 640w, /img/office/after-1200.webp 1200w"
          sizes="(min-width: 1024px) 560px, 100vw"
          width={1200}
          height={900}
          {...({ fetchpriority: "high" } as Record<string, string>)}
          alt="A three-monitor L-desk workstation with a laptop, keyboard and mouse that CEO Turbo set up in a Tampa home office"
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Real Tampa setup</span>
      </div>
      {r && (
        <figure className="absolute -bottom-6 -left-2 max-w-[290px] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-20px_rgb(20_40_90/0.5)] ring-1 ring-black/5 sm:-left-6">
          <ReviewSummary className="!min-h-[32px] !text-xs [&_span:first-child]:!text-base" />
          <blockquote className="mt-1.5 text-sm font-medium leading-snug text-foreground">"{r.short}"</blockquote>
          <figcaption className="mt-1 text-xs text-muted-foreground">{r.name}</figcaption>
        </figure>
      )}
    </div>
  );
}
