// /it-services-duluth-ga — the ad landing page for on-site tech help around Duluth, GA: computers, iPhone and iPad
// screens and batteries, TVs, internet and Wi-Fi, for homes and small businesses. Prices come from IT_SERVICES in
// content/pricing.ts. `?for=business` opens the business tab so business ads land on business services.
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Battery, Building2, Calendar, Check, ClipboardCheck, Home, Laptop, MapPin, MessageSquare, Monitor, Network, Phone, Printer, Router, ShieldCheck, Smartphone, Tablet, Tv, Wrench, type LucideIcon } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { OfficeIntake } from "@/components/blocks/OfficeIntake";
import { InstallBookButton } from "@/components/cta/Actions";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { itPrice } from "@/content/pricing";
import { IT_BOOKING, SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const sms = (body: string) => `sms:${SITE.phone.e164}?&body=${encodeURIComponent(body)}`;
const SMS_HOME = sms("Hi, I need tech help. Device and problem: ");
const SMS_BUSINESS = sms("Hi, I need IT help for my business. Business name and problem: ");

type Card = { icon: LucideIcon; title: string; price?: string; items: string[]; link?: { to: string; label: string } };

const HOME: Card[] = [
  { icon: Laptop, title: "Computers & laptops", price: itPrice("it-pc-repair"), items: ["Slow, freezing or won't turn on", "Virus and pop-up removal", "Windows and Mac problems", "Memory and SSD upgrades"] },
  { icon: Smartphone, title: "iPhone screens", price: itPrice("it-iphone-screen"), items: ["Cracked or black screen", "Touch not working", "Replaced at your door, same visit", "Your data stays on the phone"] },
  { icon: Battery, title: "iPhone batteries", price: itPrice("it-iphone-battery"), items: ["Dies by lunch or shuts off at 20%", "Swollen or 'Service' battery", "About 30 minutes on site"] },
  { icon: Tablet, title: "iPad & tablet screens", price: itPrice("it-tablet-screen"), items: ["Cracked glass or dead touch", "iPad, Samsung Galaxy Tab and more", "Batteries too"] },
  { icon: Tv, title: "TV mounting & setup", price: `${itPrice("it-tv-mount")}/TV`, items: ["Up to 65\", level and secure", `Each extra TV same visit ${itPrice("it-tv-extra")}`, "Sound bar, streaming apps and remotes", `Setup only, no mount ${itPrice("it-tv-setup")}`] },
  { icon: Router, title: "Internet & Wi-Fi", price: itPrice("it-wifi"), items: ["Slow, dropping or dead spots", "New router or modem set up", `Mesh Wi-Fi for every room ${itPrice("it-mesh")}`, "Printers and smart devices connected"] },
];

const BUSINESS: Card[] = [
  { icon: Network, title: "Office network & Wi-Fi", price: itPrice("it-mesh"), items: ["Staff and guest Wi-Fi kept apart", "Dead zones and dropouts fixed", "Routers, switches and access points"] },
  { icon: Monitor, title: "Workstations & laptops", price: itPrice("it-pc-repair"), items: ["Repairs and upgrades on site", "New computers set up and files moved", "Virus cleanup and updates"] },
  { icon: Printer, title: "Printers & devices", items: ["Network printers and scanners", "Phones and tablets for staff", "Card readers and peripherals"] },
  { icon: Tv, title: "Conference room & lobby TVs", price: `${itPrice("it-tv-mount")}/TV`, items: ["Mounted and wired clean", "Screen sharing that just works", "Menu and lobby displays"] },
  { icon: ClipboardCheck, title: "POS systems", items: ["Square, Clover and Toast hardware", "Receipt printers and cash drawers"], link: { to: "/services/pos-system-setup", label: "POS setup details" } },
  { icon: Wrench, title: "On-call IT by the hour", price: `${itPrice("it-business-hour")}/hr`, items: ["Call when something breaks", "Regular visits if you want them", "Invoice to your business"] },
];

const STEPS = [
  { icon: Phone, title: "Call, text or book", body: "Tell us the device and what's wrong. A photo by text helps." },
  { icon: ClipboardCheck, title: "Flat price first", body: "You get the price in writing before any work starts. Say no and you don't pay for the repair." },
  { icon: Home, title: "Fixed at your place", body: "We come to your home or office, fix it, test it with you, then you pay." },
];

/** The offer stack shown under the hero buttons and in the price promise section. */
const PROMISES = ["Free house call when we do the repair", "We beat any local written quote by $10", "Flat price in writing before we start", "Pay only after it works"];

/** Typical prices around Atlanta vs ours, so the value is obvious at a glance. */
const COMPARE = [
  { job: "Diagnosis", them: "Around $100 at big-box stores", us: `Free with the repair (${itPrice("it-visit")} if you pass)` },
  { job: "TV wall mount", them: "$70–$150 per TV in Atlanta", us: `${itPrice("it-tv-mount")}, extra TVs ${itPrice("it-tv-extra")}` },
  { job: "Getting there", them: "Drive over, drop it off, come back", us: "We come to you" },
];

const AREA = ["Duluth", "Lawrenceville", "Suwanee", "Norcross", "Johns Creek", "Peachtree Corners", "Buford", "Snellville", "Alpharetta", "Roswell", "Sandy Springs", "Dunwoody", "Decatur", "Marietta", "Atlanta"];

const FAQS = [
  { q: "How much does it cost?", a: `Every job gets a flat price in writing before we start. Starting prices: computer repair ${itPrice("it-pc-repair")}, iPhone screen ${itPrice("it-iphone-screen")}, iPhone battery ${itPrice("it-iphone-battery")}, iPad screen ${itPrice("it-tablet-screen")}, TV mount ${itPrice("it-tv-mount")}, Wi-Fi fix ${itPrice("it-wifi")}. The exact price depends on the model and the problem.` },
  { q: "Do you really come to me, even for phone repairs?", a: "Yes. Computers, phones, tablets, TVs and Wi-Fi are all fixed at your home or office. You don't drop anything off or wait at a store." },
  { q: "Where do you work?", a: `Duluth and about 40 miles around it, including ${AREA.slice(1, -1).join(", ")} and Atlanta. Call or text ${SITE.phone.display} and we'll confirm your address.` },
  { q: "How fast can you come?", a: "Usually the same day or the next day. Call or text for the soonest time, or pick a slot on the calendar." },
  { q: "Is the house call really free?", a: `Yes, when we do the repair. If we diagnose it and you decide not to go ahead, it's ${itPrice("it-visit")} and that's it.` },
  { q: "Will you beat another quote?", a: "Yes. Show us a written quote from a local repair shop for the same job and we'll beat it by $10." },
  { q: "What if it can't be fixed?", a: "We tell you before any repair starts, and you don't pay for a repair we don't do. If a new device makes more sense, we'll say so and can set it up for you." },
  { q: "Do you bring the TV mount?", a: "Use your own, or tell us the TV size and we'll bring one and charge what it cost us. Brick, stone and over-the-fireplace installs get a price before we start." },
  { q: "Is my data safe?", a: "We don't need to open your files, photos or messages to fix a device, and we don't copy anything unless you ask us to move it." },
  { q: "Do you work with businesses?", a: `Yes. Offices, shops, restaurants and salons: networks, Wi-Fi, workstations, printers, TVs and POS. On-call help is ${itPrice("it-business-hour")} an hour and we invoice your business.` },
  { q: "How do I pay?", a: "After the job is done and you've checked it works. Card or cash." },
];

function ServiceCard({ c }: { c: Card }) {
  const Icon = c.icon;
  return (
    <div className="panel flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-turbo/15 text-turbo">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {c.price && <span className="chip whitespace-nowrap text-xs font-semibold text-foreground">{c.price}</span>}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
      <ul className="mt-3 flex-1 space-y-2 text-sm text-muted-foreground">
        {c.items.map((t) => (
          <li key={t} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
      {c.link && (
        <Link to={c.link.to} className="mt-4 text-sm font-semibold text-turbo underline underline-offset-4">
          {c.link.label} →
        </Link>
      )}
    </div>
  );
}

function Ctas({ where, business = false, className }: { where: string; business?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      <CallLink location={`it services ${where}`} icon className="btn-ignite btn-shine justify-center">
        Call {SITE.phone.display}
      </CallLink>
      <a href={business ? SMS_BUSINESS : SMS_HOME} data-call-location={`it services ${where} sms`} className="btn-chrome inline-flex items-center justify-center gap-2">
        <MessageSquare className="h-4 w-4" aria-hidden /> Text a photo for a price
      </a>
      <InstallBookButton note={`it-services-${where}`} booking={IT_BOOKING} title="Book your tech visit" className="inline-flex items-center justify-center gap-2">
        <Calendar className="h-4 w-4" aria-hidden /> Book a visit
      </InstallBookButton>
    </div>
  );
}

export default function ItServices() {
  const [params] = useSearchParams();
  // Starts on "home" so the prerendered HTML matches; business ads switch it after hydration.
  const [tab, setTab] = useState<"home" | "business">("home");
  useEffect(() => {
    if (params.get("for") === "business") setTab("business");
  }, [params]);
  const business = tab === "business";

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise min-w-0">
            <p className="chip">Duluth, GA + 40 miles · We come to you</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Computer, phone, TV and Wi-Fi problems</span> <span className="text-turbo-grad">fixed at your door.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cracked iPhone, dead battery, slow laptop, TV to mount or Wi-Fi that keeps dropping. We come to your home or business, tell you the flat price first, and fix it while you watch.
            </p>
            <Ctas where="hero" className="mt-7" />
            <ul className="mt-6 grid max-w-xl gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
              {PROMISES.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {[
                ["iPhone screen", itPrice("it-iphone-screen")],
                ["iPhone battery", itPrice("it-iphone-battery")],
                ["Computer repair", itPrice("it-pc-repair")],
                ["TV mount", itPrice("it-tv-mount")],
                ["Wi-Fi fix", itPrice("it-wifi")],
              ].map(([k, v]) => (
                <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                  {k} <span className="font-semibold text-foreground">{v}</span>
                </span>
              ))}
            </div>
          </div>
          <OfficeIntake id="book" service="it-services" booking={IT_BOOKING} className="min-w-0" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <SectionHeader title={<span id="services">What we fix and set up</span>} lede="Pick who it's for. Prices are starting points; you get the exact price before any work." />
          <div role="tablist" aria-label="Who is this for" className="mt-8 inline-flex rounded-2xl border border-border bg-card/60 p-1">
            {(
              [
                ["home", "For my home", Home],
                ["business", "For my business", Building2],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls="it-panel"
                onClick={() => setTab(key)}
                className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition sm:px-5", tab === key ? "bg-turbo text-black" : "text-muted-foreground hover:text-foreground")}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </button>
            ))}
          </div>
          <div id="it-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(business ? BUSINESS : HOME).map((c) => (
              <ServiceCard key={c.title} c={c} />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Not sure what's wrong? The house call is <span className="font-semibold text-foreground">free when we do the repair</span>. If you decide not to, the diagnosis is {itPrice("it-visit")}.
          </p>
          <Ctas where={`services ${tab}`} business={business} className="mt-6" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">Why pay more and wait longer?</span>} lede="We beat any local written quote by $10, and you never leave the house." />
          <div className="panel mt-8 overflow-hidden">
            <div className="hidden grid-cols-[1fr_1.2fr_1.2fr] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
              <span>Job</span>
              <span>Typical</span>
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
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-black">{i + 1}</span>
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
              I'm {SITE.founder.name.split(" ")[0]}, and I run this out of the Duluth area. No call center and no ticket number: you call or text, I tell you the price, I show up and fix it.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                [ShieldCheck, "You only pay for repairs you approve"],
                [ClipboardCheck, "Tested with you before we leave"],
                [Smartphone, "Your data is never copied without asking"],
              ].map(([Icon, t]) => {
                const I = Icon as LucideIcon;
                return (
                  <li key={t as string} className="flex items-center gap-2">
                    <I className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader title={<span id="area">Where we come to you</span>} lede="Duluth, GA and about 40 miles around it." />
          <ul className="mt-8 flex flex-wrap gap-2">
            {AREA.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Somewhere else nearby? Text your zip code and we'll tell you.</p>
        </div>
      </section>

      <FAQList faqs={FAQS} title="Quick answers" />

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel relative overflow-hidden p-6 text-center sm:p-10">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[700px] -translate-x-1/2 glow-turbo" aria-hidden />
            <h2 id="final" className="h-section relative">Broken right now? Get it fixed today.</h2>
            <p className="lede relative mx-auto">Call or text {SITE.phone.display}. Free house call with any repair, and we beat any local written quote by $10.</p>
            <Ctas where="final" business={business} className="relative mt-7 sm:justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}
