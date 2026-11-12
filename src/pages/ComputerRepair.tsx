// /computer-repair-tampa — the Meta ads landing page for tech repair around Tampa: slow, crashing or dead
// computers, phones and tablets, fixed at the customer's door within 40 miles or remotely. Prices come from
// IT_SERVICES in content/pricing.ts. Conversion events: ViewContent on load, Lead from the quiz (TechQuiz),
// Contact from call/text taps, Schedule from a Cal.com booking.
import { CustomerReview, FounderBadge } from "@/components/tech/FounderBadge";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Calendar, Check, ClipboardCheck, Cpu, Gauge, Globe, Home, Laptop, MapPin, MessageSquare, Phone, ShieldCheck, Smartphone, Tv, Wrench, type LucideIcon } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { InstallBookButton } from "@/components/cta/Actions";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { REPAIR_FAQS } from "@/content/tech-faqs";
import { TechQuiz } from "@/components/tech/TechQuiz";
import { BookOrText, CalCard, useTexting } from "@/components/booking/BookOrText";
import { IT_SERVICES, itPrice } from "@/content/pricing";
import { ServiceAreaList } from "@/components/blocks/ServiceAreaList";
import { IT_SERVICES_PATH, OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { IT_BOOKING, SITE } from "@/config/site";
import { smsHref } from "@/lib/sms";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";


const PRICE_GROUPS: { icon: LucideIcon; title: string; ids: string[] }[] = [
  { icon: Laptop, title: "Computers & laptops", ids: ["it-speedup", "it-remote", "it-virus", "it-pc-repair", "it-ssd", "it-data", "it-printer"] },
  { icon: Smartphone, title: "Phones & tablets", ids: ["it-iphone-screen", "it-iphone-battery", "it-tablet-screen"] },
  { icon: Tv, title: "TVs, Wi-Fi & business", ids: ["it-tv-mount", "it-tv-setup", "it-wifi", "it-mesh", "it-business-hour"] },
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
  { icon: MessageSquare, title: "Text, call or book", body: "Tell us the device and what's wrong. Three taps above does it." },
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
            <p className="chip">
              <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Tampa Bay + 40 miles · or remote
            </p>
            <h1 id="hero" className="mt-4 text-[32px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Slow, crashing or broken computer?</span> <span className="text-turbo-grad">Fixed at your door in Tampa.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Computers, laptops, phones and tablets. We come to your home or business, or speed up your Windows computer remotely. You get the price before we start.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {[
                ["Speed-up", itPrice("it-speedup")],
                ["Remote speed-up", itPrice("it-remote")],
                ["Virus removal", itPrice("it-virus")],
                ["iPhone screen", itPrice("it-iphone-screen")],
              ].map(([k, v]) => (
                <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                  {k} <span className="font-semibold text-foreground">{v}</span>
                </span>
              ))}
            </div>
            <Ctas where="hero" className="mt-6" />
            <FounderBadge className="mt-5 max-w-xl" line="I come to your door and fix it myself. Call or text, you get me, not a call center." />
            <CustomerReview className="mt-3 max-w-xl" />
            <ul className="mt-6 grid max-w-xl gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
              {PROMISES.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <BookOrText
            phone={<TechQuiz className="min-w-0" />}
            desktop={<CalCard title="Book your tech visit" sub="Pick a time. Price up front, no fix no charge." note="computer-repair-hero" booking={IT_BOOKING} className="min-w-0" />}
          />
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
                <p className="font-display text-lg font-bold">Not in Tampa? We can speed it up remotely.</p>
                <p className="text-sm text-muted-foreground">Slow Windows computer? We clean it up and speed it up over the internet while you watch, from {itPrice("it-remote")}.</p>
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

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <img src={SITE.founder.image} alt={SITE.founder.name} width={160} height={160} loading="lazy" className="h-32 w-32 rounded-2xl object-cover ring-1 ring-white/10 sm:h-40 sm:w-40" />
          <div>
            <h2 id="who" className="h-section">You deal with the person who fixes it.</h2>
            <p className="lede">
              I'm {SITE.founder.name.split(" ")[0]}, and I'm based in Tampa. No call center and no ticket number: you call or text, I tell you the price, I show up and fix it.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {(
                [
                  [ShieldCheck, "You only pay for repairs you approve"],
                  [Wrench, "Tested with you before I leave"],
                  [Smartphone, "Your data is never copied without asking"],
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

      <section className="section border-t border-border" aria-labelledby="business">
        <div className="container-x">
          <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
              <div>
                <h2 id="business" className="font-display text-lg font-bold">Have a business or office?</h2>
                <p className="text-sm text-muted-foreground">Workstations, printers, networks, multi-monitor desks, cable management and menu screens. On-site IT {itPrice("it-business-hour")}/hr.</p>
              </div>
            </div>
            <Link to={OFFICE_SETUP_PATH} className="btn-chrome inline-flex items-center justify-center">
              See office setup
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader title={<span id="area">Where we come to you</span>} lede="Tampa and about 40 miles around it. Remote speed-ups for slow Windows PCs work anywhere." />
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
              Text or call {SITE.phone.display}. Price up front, no fix no charge.
            </p>
            <Ctas where="final" className="relative mt-7 sm:justify-center" />
            <p className="relative mt-4 text-sm">
              <a href="#fix" className="font-semibold text-turbo underline underline-offset-4">
                <Phone className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                Or tap a few answers and get your price by text
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
