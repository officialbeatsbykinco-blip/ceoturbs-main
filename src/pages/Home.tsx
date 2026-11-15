import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarCheck, Check, Globe, Laptop, MapPin, Megaphone, MessageSquare, Mic2, Monitor, Music, Phone, Search, ShieldCheck, Sparkles, Star, Store, Timer, Wrench } from "lucide-react";
import { AuditHero } from "@/components/audit/AuditHero";
import { BookButton, InstallBookButton } from "@/components/cta/Actions";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BestResults, ProofStats, AdGallery } from "@/components/blocks/Proof";
import { MobileMore } from "@/components/blocks/MobileMore";
import { ReviewCardStrip } from "@/components/blocks/ReviewCardBlocks";
import { VideoRow } from "@/components/blocks/YouTubeLite";
import { FreeCheckStrip } from "@/components/blocks/FreeCheckStrip";
import { SiteWall } from "@/components/visuals/SiteWall";
import { CallLink } from "@/components/site/CallLink";
import { PhoneOnly } from "@/components/booking/BookOrText";
import { IT_BOOKING, SITE, fromPriceLabel } from "@/config/site";
import { ADS } from "@/content/ads";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { HOME_FAQS } from "@/content/faqs";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { SHOP_PATH } from "@/content/review-cards";
import { itPrice, price } from "@/content/pricing";
import { OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { smsHref } from "@/lib/sms";
import { cn } from "@/lib/utils";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";

const HOME_TEXT = "Hi Chris, I want more customers for my business: ";

/** What we do, in the order buyers care about. Each card goes to the page built to sell it. */
const SERVICES = [
  { icon: MapPin, t: "Google Business Profile", b: "Show up in the map pack when people search “near me”. Categories, photos, posts and reviews done right.", to: "/services/google-business-profile", cta: "Fix my Google profile" },
  { icon: Megaphone, t: "Google & Meta ads", b: `Ads that make the phone ring, tracked to the call. ${AD_TOTALS.leads} leads for clients at ${money(AD_TOTALS.avgCpl)} each.`, to: "/grow", cta: "Get more customers" },
  { icon: Globe, t: "Websites that get calls", b: "Fast sites built for Google, ChatGPT and AI answers (SEO, AEO and GEO), with a call button on every screen.", to: "/services/website-design", cta: "See website design" },
  { icon: Star, t: "More Google reviews", b: `Tap-to-review cards for your counter and a simple in-person ask. From ${fromPriceLabel}.`, to: SHOP_PATH, cta: "Shop review cards" },
];

const WHO = [
  { icon: Store, t: "Local businesses", b: "Contractors, salons, restaurants, shops and clinics that need the phone to ring.", to: "/local-business" },
  { icon: Mic2, t: "Artists", b: "More listeners and fans: release pages, Spotify and YouTube growth, owning your name on Google.", to: "/artist" },
  { icon: Music, t: "Producers", b: "Get heard and sell beats: a beat store that converts and ads that bring buyers.", to: "/producers" },
  { icon: Monitor, t: "Online stores", b: "Shopify stores with visitors but no sales: fix the store, then scale the ads.", to: "/shopify" },
];

/** Hormozi value stack: dream outcome up, likelihood up, time down, effort down. */
const STACK = [
  { icon: Sparkles, t: "More calls, texts and bookings", b: "We measure the work by customers, not likes. Every call, form and booking is tracked so you see what each dollar brought back." },
  { icon: ShieldCheck, t: "Proof before you pay", b: `Real dashboards: ${AD_TOTALS.leads} Meta leads at ${money(AD_TOTALS.avgCpl)}, 42 Google Ads conversions at $4.19 for Appliance King, ${CLIENTS.length} live client sites.` },
  { icon: Timer, t: "Fast", b: "Google profile fixes in days, a new website in about two weeks, ads live as soon as tracking is tested." },
  { icon: Check, t: "Done for you", b: "You talk to Chris, not a call center. We do the work; you answer the phone. No long-term contract, and you own every account." },
];

/**
 * Funnel: the free Google & AI check is the front door (it's the best lead magnet), then proof, what we do,
 * real ads and videos, who we help, the offer, and tech support / IT / computers as the extra service.
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
      <AuditHero
        source="Home hero"
        eyebrow="Free Google & AI check · 60 seconds · no card"
        title={
          <>
            <span className="text-chrome-grad">Get more customers from</span> <span className="text-turbo-grad">Google, AI and ads.</span>
          </>
        }
        lede={
          <>
            Google Business Profile, reviews, websites and ads for businesses, artists and producers.{" "}
            <span className="hidden sm:inline">Start with the free check: your Google rating and reviews vs the top 3 competitors near you, scored in 60 seconds.</span>
            <span className="sm:hidden">See how you stack up against competitors, free.</span>
          </>
        }
        points={[
          <><span className="font-semibold">{AD_TOTALS.leads} leads</span> <span className="text-muted-foreground">for clients at {money(AD_TOTALS.avgCpl)} each</span></>,
          <><span className="font-semibold">{CLIENTS.length} client websites</span> <span className="text-muted-foreground">live and bringing in calls</span></>,
          <><span className="font-semibold">Score first</span> <span className="text-muted-foreground">— we only ask where to send the full report</span></>,
          <><span className="font-semibold">Leads-or-free</span> <span className="text-muted-foreground">guarantee on the ads we run</span></>,
        ]}
        footer={
          <div className="hidden items-center gap-3 rounded-2xl border border-border bg-white/[0.02] p-3 sm:flex">
            <img src={SITE.founder.image} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
            <p className="flex-1 text-sm leading-snug">
              <span className="font-semibold text-foreground">Hi, I'm Chris.</span> <span>You talk to me, not a call center.</span>
            </p>
            <PhoneOnly
              desktop={
                <CallLink location="home hero founder" className="btn-chrome inline-flex shrink-0 items-center gap-2 !px-4 !py-2.5 !text-sm">
                  <Phone className="h-4 w-4 text-turbo" aria-hidden /> {SITE.phone.display}
                </CallLink>
              }
            >
              <a href={smsHref(HOME_TEXT)} data-call-location="home hero founder text" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/15">
                <MessageSquare className="h-5 w-5 text-turbo" aria-hidden />
                <span className="sr-only">Text {SITE.founder.name}</span>
              </a>
            </PhoneOnly>
          </div>
        }
      />

      {/* Tech support is real income and real calls, just not the headline: one compact row right under the hero. */}
      <section className="pt-8 sm:pt-10" aria-label="Tech support">
        <div className="container-x">
          <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="flex items-center gap-3 text-sm">
              <Laptop className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
              <span>
                <span className="font-semibold">Need tech help instead?</span> <span className="text-muted-foreground">Computer &amp; phone repair, office and IT setup around Tampa, and computers for sale.</span>
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              <FixMyTechLink source="home hero" className="btn-chrome inline-flex items-center gap-1.5 !px-4 !py-2.5 !text-sm">
                <Wrench className="h-4 w-4 text-turbo" aria-hidden /> Fix my tech
              </FixMyTechLink>
              <Link to={OFFICE_SETUP_PATH} className="btn-chrome inline-flex items-center gap-1.5 !px-4 !py-2.5 !text-sm">
                Office setup
              </Link>
              <Link to="/computers" className="btn-chrome inline-flex items-center gap-1.5 !px-4 !py-2.5 !text-sm">
                Computer shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ads-proof">
        <div className="container-x">
          <SectionHeader kicker="Results" title={<span id="ads-proof">Real customers on small budgets.</span>} lede="Straight from our clients' ad dashboards. A few hundred dollars in ads turned into thousands in jobs." />
          <div className="mt-8">
            <ProofStats />
          </div>
          <div className="mt-8">
            <BestResults />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="what">
        <div className="container-x">
          <SectionHeader kicker="What we do" title={<span id="what">How do we get you more customers?</span>} lede="Most customers find a business on Google Maps, check its reviews, look at the website, then call. We fix every step of that path." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.t}>
                <Link to={s.to} className="panel group flex h-full flex-col p-5 transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5),0_30px_60px_-30px_hsl(var(--turbo)/0.5)] sm:p-6">
                  <s.icon className="h-8 w-8 text-turbo" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold leading-tight sm:text-xl">{s.t}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-turbo">
                    {s.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <FreeCheckStrip where="home what we do" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="ads">
        <div className="container-x">
          <SectionHeader kicker="Ads" title={<span id="ads">{ADS.length} ads we designed and launched.</span>} lede="Repair shops, appliance pros, online stores and music producers. Every ad is built around one hook and one action." />
          <MobileMore label={`See all ${ADS.length} ads`} className="mt-8">
            <AdGallery ads={ADS} />
          </MobileMore>
          <BookCallStrip note="Home — after ad gallery" className="mt-10" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="videos">
        <div className="container-x">
          <SectionHeader kicker="Watch" title={<span id="videos">How local businesses win on Google.</span>} lede="Real campaigns and real stories: why the business with more reviews gets the customers, and what a website plus ads does for the phone." />
          <div className="mt-8">
            <VideoRow where="home" />
          </div>
          <Link to="/watch" className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
            See every video <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x">
          <SectionHeader kicker="Who we help" title={<span id="who">Businesses, artists and producers.</span>} lede="Same playbook, tuned to how your customers or fans actually find you." />
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <li key={w.t}>
                <Link to={w.to} className="panel group flex h-full gap-4 p-4 sm:flex-col sm:gap-0 sm:p-5">
                  <w.icon className="h-7 w-7 shrink-0 text-turbo" aria-hidden />
                  <span>
                    <span className="block font-display text-base font-bold leading-tight sm:mt-2.5 sm:text-lg">{w.t}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{w.b}</span>
                  </span>
                </Link>
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

      <section className="section" aria-labelledby="offer">
        <div className="container-x">
          <SectionHeader kicker="Why CEO Turbo" title={<span id="offer">What do you get when you work with us?</span>} lede={`Published prices: Google profile setup ${price("gbp-setup")}, setup packages from ${price("pkg-start")}, monthly plans from ${price("care")}/mo. Ad spend goes straight to Google or Meta from your own card.`} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {STACK.map((s) => (
              <li key={s.t} className="panel flex gap-4 p-5 sm:p-6">
                <s.icon className="h-7 w-7 shrink-0 text-turbo" aria-hidden />
                <div>
                  <h3 className="font-display text-lg font-bold">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookButton note="Home offer" className="inline-flex items-center justify-center gap-2">
              <CalendarCheck className="h-5 w-5" aria-hidden /> Book a free call
            </BookButton>
            <Link to="/pricing" className="btn-chrome inline-flex items-center justify-center gap-2">
              See all prices <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/grow" className="btn-chrome inline-flex items-center justify-center gap-2">
              How we run websites &amp; ads
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="repair">
        <div className="container-x">
          <div className="panel grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-turbo">Tech support · IT · computers</p>
              <h2 id="repair" className="h-section mt-2">We fix tech too.</h2>
              <p className="lede">
                Computer and phone repair at your door within 40 miles of Tampa, Windows speed-ups remotely anywhere, office and Wi-Fi setup, and refurbished computers for sale. Price up front, no fix, no charge.
              </p>
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
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link to={OFFICE_SETUP_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">Office setup</Link>
                <Link to="/computers" className="font-semibold text-turbo underline-offset-4 hover:underline">Computer shop</Link>
                <Link to="/security-camera-installation-tampa" className="font-semibold text-turbo underline-offset-4 hover:underline">Security cameras</Link>
                <Link to="/wifi-installation-tampa" className="font-semibold text-turbo underline-offset-4 hover:underline">Wi-Fi</Link>
                <Link to={SHIRTS_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">Company shirts</Link>
              </p>
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
          <ReviewCardStrip where="Home tech band" className="mt-4" line="Hand it over after the job or leave it on the counter. Customers tap and your review page opens." />
        </div>
      </section>

      <FAQList faqs={HOME_FAQS} title="Questions business owners ask" />

      <section className="section border-t border-border" aria-labelledby="last-call">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 id="last-call" className="h-section">See what's costing you customers. Free.</h2>
            <p className="lede mx-auto max-w-2xl">Run the 60-second check, or call or text {SITE.phone.display} and talk to Chris.</p>
            <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
              <Link to="/free-audit" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2">
                <Search className="h-4 w-4" aria-hidden /> Run my free check
              </Link>
              <CallLink location="home final CTA" className="btn-blue inline-flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
              <PhoneOnly
                desktop={
                  <BookButton note="Home final CTA" variant="chrome" className="inline-flex items-center justify-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-turbo" aria-hidden /> Book a free call
                  </BookButton>
                }
              >
                <a href={smsHref(HOME_TEXT)} data-call-location="home final CTA text" className="btn-chrome inline-flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4 text-turbo" aria-hidden /> Text us
                </a>
              </PhoneOnly>
            </div>
          </div>
        </div>
      </section>

      <HomeBar />
    </>
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

/** Sticky bottom bar once the hero is gone: free check, call, and text (phones) or book (computers). */
function HomeBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const update = () => setShow(window.scrollY > 700);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const toCheck = () => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 lg:pb-3", show ? "translate-y-0" : "translate-y-full")} aria-hidden={!show}>
      <div className="mx-auto flex max-w-3xl gap-2">
        <button type="button" onClick={toCheck} tabIndex={show ? undefined : -1} className="btn-ignite inline-flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
          <Search className="h-4 w-4 shrink-0" aria-hidden /> Free check
        </button>
        <CallLink location="home sticky bar" className="btn-blue inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
          <Phone className="h-4 w-4 shrink-0" aria-hidden /> Call
        </CallLink>
        <PhoneOnly
          desktop={
            <BookButton note="Home sticky bar" variant="chrome" className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
              <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden /> Book a call
            </BookButton>
          }
        >
          <a href={smsHref(HOME_TEXT)} data-call-location="home sticky bar text" tabIndex={show ? undefined : -1} className="btn-chrome inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-3 !py-3.5 !text-base">
            <MessageSquare className="h-4 w-4 shrink-0" aria-hidden /> Text
          </a>
        </PhoneOnly>
      </div>
    </div>
  );
}
