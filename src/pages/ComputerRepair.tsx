// /computer-repair-tampa — the Meta ads landing page for tech repair around Tampa: slow, crashing or dead
// Windows laptops and desktops fixed at the customer's door across Tampa Bay and Central Florida or remotely; phones and tablets set up, never repaired; no Macs or laptop screens. Prices come from
// IT_SERVICES in content/pricing.ts. Conversion events: ViewContent on load, Lead from the quiz (TechQuiz),
// Contact from call/text taps, Schedule from a Cal.com booking. Repair only: the business marketing and review card
// sections stay off this page so a visitor from a repair ad sees nothing but the repair and how to reach us.
import { CustomerReview, FounderBadge } from "@/components/tech/FounderBadge";
import { ReviewSummary, ReviewWall } from "@/components/tech/ReviewWall";
import { JobPhotos } from "@/components/tech/JobPhotos";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building2, Calendar, Check, ClipboardCheck, Clock, Cpu, Gauge, Globe, Home, Laptop, MapPin, MessageSquare, Phone, ShieldCheck, ShoppingBag, Star, Wrench, type LucideIcon } from "lucide-react";
import { COMPUTERS_PATH } from "@/content/computer-shop";
import { CallLink } from "@/components/site/CallLink";
import { InstallBookButton } from "@/components/cta/Actions";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { REPAIR_FAQS } from "@/content/tech-faqs";
import { TechQuiz } from "@/components/tech/TechQuiz";
import { BookOrText, CalCard, PhoneOnly, useTexting } from "@/components/booking/BookOrText";
import { IT_SERVICES, itPrice } from "@/content/pricing";
import { ServiceAreaList } from "@/components/blocks/ServiceAreaList";
import { IT_SERVICES_PATH, OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { IT_BOOKING, SITE } from "@/config/site";
import { smsHref } from "@/lib/sms";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";


const PRICE_GROUPS: { icon: LucideIcon; title: string; ids: string[] }[] = [
  { icon: Wrench, title: "Repairs", ids: ["it-pc-repair", "it-desktop", "it-visit"] },
  { icon: Gauge, title: "Make it faster", ids: ["it-speedup", "it-remote", "it-ssd", "it-virus"] },
  { icon: Laptop, title: "Setups: files, phones & printers", ids: ["it-data", "it-phone-setup", "it-printer", "it-business-hour"] },
];

/** "If it's a computer, we fix it": the problems people search for, in their words. */
const WE_FIX = [
  "Slow computer and long startups made fast",
  "Blue screens and crashing",
  "Won't turn on, no power or won't boot",
  "Freezing and programs not responding",
  "Viruses, pop-ups and scam warnings",
  "SSD, memory and parts upgrades",
  "Windows reinstalls and updates gone wrong",
  "Overheating and loud fans",
  "Lost files: backup, recovery and transfer",
  "Printers, email and software",
  "Gaming PCs: power supplies and graphics cards",
  "Windows laptops and desktops, any brand",
];

/** The four reasons to pick us, in the first scroll. Each one is backed elsewhere on the page. */
const TRUST: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Star, title: "5.0 on Google", body: "Every review five stars, word for word below." },
  { icon: Home, title: "We come to you", body: "Home or business, Tampa Bay to Orlando." },
  { icon: Clock, title: "Same or next day", body: "Most computers are fixed within a day or two." },
  { icon: BadgeCheck, title: "No fix, no charge", body: "Can't fix it? You don't pay for the repair." },
];

const PROMISES = ["Price up front, before any work", `Diagnosis ${itPrice("it-visit")}, credited to the repair`, "No fix, no charge", "Pay after it works"];

/** A drop-off repair shop vs us. How it works, not price. */
const COMPARE = [
  { job: "Getting it there", them: "Unplug it, drive over, drop it off", us: "We come to your home or business" },
  { job: "How long", them: "Leave it for days", us: "Usually fixed the same or next day" },
  { job: "The price", them: "Often found out after drop-off", us: "Price up front, before any work" },
  { job: "If it can't be fixed", them: "You may still pay the bench fee", us: "No fix, no charge on the repair" },
];

const STEPS = [
  { icon: MessageSquare, title: "Text, call or book", body: "Tell us laptop or desktop and what's wrong. A few taps on this page does it." },
  { icon: ClipboardCheck, title: "Price up front", body: "You get the price before any work starts. Say no and you only pay the diagnosis." },
  { icon: Home, title: "Fixed at your place", body: "We come to your home or business, fix it, test it with you, then you pay. A slow Windows PC can also be sped up remotely." },
];

const FEEL_NEW = [
  { icon: Gauge, title: "Speed-up & cleanup", body: "Startup junk, bloat and old updates cleared so Windows boots fast again." },
  { icon: Cpu, title: "SSD & memory upgrade", body: "The biggest jump: an old hard drive swapped for a solid-state drive. Everything moves over." },
  { icon: ShieldCheck, title: "Virus & scam pop-ups gone", body: "Malware removed and real protection set up, without the subscription upsell." },
];



function Ctas({ where, className }: { where: string; className?: string }) {
  // Phones: the tap-question text flow (#fix). Computers: the Cal.com calendar.
  const texting = useTexting();
  return (
    <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      {texting ? (
        <FixMyTechLink source={`computer repair ${where}`} to={`${IT_SERVICES_PATH}#fix`} className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <MessageSquare className="h-5 w-5" aria-hidden /> Get my price by text
        </FixMyTechLink>
      ) : (
        <InstallBookButton note={`computer-repair-${where}`} booking={IT_BOOKING} title="Book your tech visit" variant="ignite" className="btn-shine inline-flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden /> Book a visit
        </InstallBookButton>
      )}
      <CallLink location={`computer repair ${where}`} icon className={cn("justify-center", texting ? "btn-blue !py-4 !text-lg" : "btn-chrome")}>
        Call {SITE.phone.display}
      </CallLink>
    </div>
  );
}

export default function ComputerRepair() {
  // ViewContent (browser + server copy, one event_id) so Meta can build audiences of repair-page visitors.
  useEffect(() => {
    const id = track("view_item", { content_name: "Computer repair Tampa", content_category: "tech_repair", content_type: "service", value: 150, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: 150, currency: "USD", contentName: "Computer repair Tampa", contentCategory: "tech_repair" });
  }, []);

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <ReviewSummary />
              <p className="chip">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Tampa Bay · St. Pete · Brandon · Lakeland · Orlando
              </p>
            </div>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[54px]">
              <span className="text-chrome-grad">Windows PC slow, crashing or dead?</span> <span className="text-turbo-grad">We fix it at your door, anywhere in Central Florida.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Windows laptops and desktops: slow PCs made fast, blue screens and no-power problems fixed. Usually the same or next day, at your home or business. <span className="font-semibold text-foreground">You get the price before we start, and if we can't fix it, you don't pay for the repair.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {[
                ["Speed-up", itPrice("it-speedup")],
                ["Virus removal", itPrice("it-virus")],
                ["Won't turn on", itPrice("it-pc-repair")],
                ["Remote help", itPrice("it-remote")],
              ].map(([k, v]) => (
                <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                  {k} <span className="font-semibold text-foreground">{v}</span>
                </span>
              ))}
            </div>
            <Ctas where="hero" className="mt-6" />
            <ul className="mt-4 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium text-foreground">
              {PROMISES.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <FounderBadge className="mt-6 max-w-xl" line="I come to your door and fix it myself. Call or text, you get me, not a call center." />
            <CustomerReview job="Laptop" className="mt-3 max-w-xl" />
          </div>
          <BookOrText
            phone={<TechQuiz className="min-w-0" />}
            desktop={<CalCard title="Book your tech visit" sub="Pick a time. Price up front, no fix no charge." note="computer-repair-hero" booking={IT_BOOKING} className="min-w-0" />}
          />
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-8 sm:py-10" aria-label="Why Florida picks us">
        <ul className="container-x grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-turbo/15 text-turbo">
                <t.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-bold leading-tight sm:text-lg">{t.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">{t.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section border-t border-border" aria-labelledby="reviews">
        <div className="container-x">
          <SectionHeader title={<span id="reviews">What our customers say</span>} lede="Real Google reviews, word for word. Tap the rating to check them on Google." />
          <ReviewWall className="mt-8" />
          <JobPhotos className="mt-10" />
          <Ctas where="reviews" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works</span>} lede="Three steps, no surprises." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-white">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-turbo" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="prices">
        <div className="container-x">
          <SectionHeader title={<span id="prices">Starting prices</span>} lede="Flat starting prices for in-home and on-site service. You get your exact price before any work. Parts extra." />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {PRICE_GROUPS.map((g) => (
              <div key={g.title} className="panel p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/15 text-turbo">
                    <g.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold">{g.title}</h3>
                </div>
                <ul className="mt-4 divide-y divide-border/60">
                  {g.ids.map((id) => {
                    const p = IT_SERVICES.find((x) => x.id === id)!;
                    return (
                      <li key={id} className="flex items-start justify-between gap-3 py-3">
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{p.name}</span>
                          <span className="block text-xs text-muted-foreground">{p.summary}</span>
                        </span>
                        <span className="shrink-0 whitespace-nowrap text-sm font-bold text-foreground">
                          {itPrice(id)}
                          {id === "it-business-hour" && "/hr"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <Ctas where="prices" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="we-fix">
        <div className="container-x">
          <SectionHeader title={<span id="we-fix">If it's a Windows PC, we fix it.</span>} lede="Windows desktops and laptops, any brand, at your door anywhere from Tampa Bay to Orlando. Phone and tablet screens and batteries too, at ceoturbo.com/phone-repair-tampa. No Macs or laptop screens." />
          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {WE_FIX.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px]">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>


      <section className="section border-t border-border" aria-labelledby="new">
        <div className="container-x">
          <SectionHeader title={<span id="new">Make your old computer feel new</span>} lede="Most slow computers don't need replacing. A cleanup and the right upgrade usually brings them back to fast." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEEL_NEW.map((f) => (
              <div key={f.title} className="panel p-6">
                <f.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="panel mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
              <div>
                <p className="font-display text-lg font-bold">Too far to visit? Remote support, anywhere in the world.</p>
                <p className="text-sm text-muted-foreground">Slow Windows computer, pop-ups or software trouble? We fix it over the internet while you watch, from {itPrice("it-remote")}.</p>
              </div>
            </div>
            <BookOrText
              phone={
                <a href={smsHref("Hi Chris, I'd like a remote speed-up for my Windows computer. ")} data-call-location="computer repair remote sms" className="btn-ignite inline-flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" aria-hidden /> Text for remote help
                </a>
              }
              desktop={
                <InstallBookButton note="computer-repair-remote" booking={IT_BOOKING} title="Book a remote speed-up" variant="ignite" className="inline-flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden /> Book remote help
                </InstallBookButton>
              }
            />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="guarantee">
        <div className="container-x">
          <div className="panel grid items-center gap-6 border-turbo/40 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto]">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-turbo/15 text-turbo">
              <ShieldCheck className="h-9 w-9" aria-hidden />
            </span>
            <div>
              <h2 id="guarantee" className="font-display text-2xl font-bold sm:text-3xl">No fix, no charge. Pay after it works.</h2>
              <p className="mt-2 text-muted-foreground">
                The diagnosis is {itPrice("it-visit")} and it's credited to the repair. You hear the price before any work starts. Say no and that's all you pay. Say yes and you pay once it's fixed and tested in front of you.
              </p>
            </div>
            <Ctas where="guarantee" className="md:flex-col md:items-stretch" />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">Why drive it to a shop?</span>} lede="Repair-shop quality, at your door, with the price in writing first." />
          <div className="panel mt-8 overflow-hidden">
            <div className="hidden grid-cols-[1fr_1.2fr_1.2fr] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
              <span>&nbsp;</span>
              <span>Drop-off shop</span>
              <span className="text-turbo">With us</span>
            </div>
            {COMPARE.map((r) => (
              <div key={r.job} className="grid gap-1 border-b border-border/60 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1.2fr_1.2fr] sm:gap-4">
                <span className="font-semibold">{r.job}</span>
                <span className="text-sm text-muted-foreground">{r.them}</span>
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {r.us}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <img src={SITE.founder.image} alt={SITE.founder.name} width={160} height={160} loading="lazy" className="h-32 w-32 rounded-2xl object-cover ring-1 ring-white/10 sm:h-40 sm:w-40" />
          <div>
            <h2 id="who" className="h-section">You deal with the person who fixes it.</h2>
            <p className="lede">
              I'm {SITE.founder.name.split(" ")[0]}, and I'm based in Tampa Bay and drive all over Central Florida. No call center and no ticket number: you call or text, I tell you the price, I show up and fix it.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {(
                [
                  [ShieldCheck, "You only pay for repairs you approve"],
                  [Wrench, "Tested with you before I leave"],
                  [ShieldCheck, "Your data is never copied without asking"],
                ] as const
              ).map(([Icon, t]) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>



      <section className="section border-t border-border" aria-labelledby="also">
        <div className="container-x">
          <h2 id="also" className="sr-only">More ways we help</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel flex flex-col justify-between gap-4 p-6">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
              <div>
                <h3 className="font-display text-lg font-bold">Time for a new computer?</h3>
                <p className="text-sm text-muted-foreground">Laptops and desktops from our computer shop, set up at your place with your files moved over.</p>
              </div>
            </div>
            <Link to={COMPUTERS_PATH} className="btn-chrome inline-flex items-center justify-center gap-2 sm:self-start">
              Shop computers <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
            <div className="panel flex flex-col justify-between gap-4 p-6">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
              <div>
                <h3 className="font-display text-lg font-bold">Have a business or office?</h3>
                <p className="text-sm text-muted-foreground">Workstations, printers, networks, multi-monitor desks, cable management and menu screens. On-site IT {itPrice("it-business-hour")}/hr.</p>
              </div>
            </div>
            <Link to={OFFICE_SETUP_PATH} className="btn-chrome inline-flex items-center justify-center sm:self-start">
              See office setup
            </Link>
          </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader title={<span id="area">Where we come to you</span>} lede="Anywhere within about 1.5 hours of Temple Terrace: Tampa, St. Pete, Clearwater, Brandon, Lakeland, Winter Haven, Sarasota and Orlando. Remote support for Windows computers works anywhere in the world." />
          <ServiceAreaList className="mt-8" />
          <p className="mt-4 text-sm text-muted-foreground">Somewhere else nearby? Text your ZIP code and we'll tell you.</p>
        </div>
      </section>

      <FAQList faqs={REPAIR_FAQS} title="Quick answers" />

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel relative overflow-hidden p-6 text-center sm:p-10">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[700px] -translate-x-1/2 glow-turbo" aria-hidden />
            <h2 id="final" className="h-section relative">Broken right now? Get it fixed today.</h2>
            <p className="lede relative mx-auto">
              <PhoneOnly desktop={<>Call {SITE.phone.display} or pick a time. Price up front, no fix no charge.</>}>Text or call {SITE.phone.display}. Price up front, no fix no charge.</PhoneOnly>
            </p>
            <Ctas where="final" className="relative mt-7 sm:justify-center" />
            <p className="relative mt-4 text-sm">
              <PhoneOnly
                desktop={
                  <a href="#fix" className="font-semibold text-turbo underline underline-offset-4">
                    Or pick a time on the calendar
                  </a>
                }
              >
                <a href="#fix" className="font-semibold text-turbo underline underline-offset-4">
                  <Phone className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                  Or tap a few answers and get your price by text
                </a>
              </PhoneOnly>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
