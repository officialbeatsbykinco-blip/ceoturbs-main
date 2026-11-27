import { ProblemLinks } from "@/components/tech/ProblemLinks";
// /computer-repair-<city>-fl: in-home computer AND phone repair for one city (data in content/city-repair.ts).
// Built for the searches people make by town ("computer repair Brandon FL", "phone screen repair Lakeland"):
// the city in the title, H1, first paragraph, a direct answer block, the drive and ZIP codes, city FAQs, then the
// same prices, reviews and booking as the main repair pages, which it links to.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Calendar, Car, Check, Home, Laptop, MapPin, MessageSquare, Smartphone, Star } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { GuideLinks } from "@/components/blocks/GuideLinks";
import { BookOrText, CalCard, PhoneOnly, useTexting } from "@/components/booking/BookOrText";
import { InstallBookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { FounderBadge } from "@/components/tech/FounderBadge";
import { ReviewSummary, ReviewWall } from "@/components/tech/ReviewWall";
import { IT_BOOKING, SITE } from "@/config/site";
import { REPAIR_CITIES, cityRepairPath, phoneRepairPath, recyclingPath, type RepairCity } from "@/content/city-repair";
import { CallNowCard } from "@/components/tech/CallNowCard";
import { itPrice } from "@/content/pricing";
import { IT_SERVICES_PATH } from "@/content/tech-pages";
import { smsHref } from "@/lib/sms";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";

function Ctas({ c, where, className }: { c: RepairCity; where: string; className?: string }) {
  const texting = useTexting();
  return (
    <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      {texting ? (
        <a href={smsHref(`Hi Chris, I'm in ${c.city}. My device and what's wrong: `)} data-call-location={`city repair ${c.slug} ${where} text`} className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <MessageSquare className="h-5 w-5" aria-hidden /> Text for my price
        </a>
      ) : (
        <InstallBookButton note={`city-repair-${c.slug}-${where}`} booking={IT_BOOKING} title={`Book your ${c.city} tech visit`} variant="ignite" className="btn-shine inline-flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden /> Book a visit
        </InstallBookButton>
      )}
      <CallLink location={`city repair ${c.slug} ${where}`} icon className={cn("justify-center", texting ? "btn-blue !py-4 !text-lg" : "btn-chrome")}>
        Call {SITE.phone.display}
      </CallLink>
    </div>
  );
}

const COMPUTER_FIXES = ["Slow computer made fast", "Blue screens and crashing", "Won't turn on or won't boot", "Viruses and scam pop-ups", "SSD and memory upgrades", "Files moved to a new computer"];
const PHONE_FIXES = ["Cracked iPhone and Samsung screens", "Batteries that die fast or swell", "iPad and tablet screens", "Black screen or touch not working", "New phone set up, everything moved", "Part ordered for your exact model"];

export default function CityRepair({ c }: { c: RepairCity }) {
  useEffect(() => {
    const name = `Computer & phone repair ${c.city}`;
    const id = track("view_item", { content_name: name, content_category: "tech_repair", content_type: "service", value: 150, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: 150, currency: "USD", contentName: name, contentCategory: "tech_repair" });
  }, [c]);

  const others = REPAIR_CITIES.filter((x) => x.slug !== c.slug);

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link to={IT_SERVICES_PATH} className="hover:text-foreground hover:underline">Computer repair</Link> <span aria-hidden>›</span> {c.city}, FL
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ReviewSummary />
              <p className="chip">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {c.city} · {c.county}
              </p>
            </div>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Computer &amp; phone repair in {c.city}, FL.</span> <span className="text-turbo-grad">We come to you.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Slow or dead Windows laptops and desktops fixed, and cracked iPhone, Samsung and iPad screens and batteries replaced, at your home or business in {c.city}. <span className="font-semibold text-foreground">You get the price before any work, and if we can't fix it, you don't pay for the repair.</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {[
                ["Speed-up", itPrice("it-speedup")],
                ["Won't turn on", itPrice("it-pc-repair")],
                ["Phone screen", "price by text"],
                ["Remote help", itPrice("it-remote")],
              ].map(([k, v]) => (
                <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                  {k} <span className="font-semibold text-foreground">{v}</span>
                </span>
              ))}
            </div>
            <CallNowCard where={`city repair ${c.slug}`} headline={`Computer or phone broken in ${c.city}? Call now for your price.`} className="mt-5 max-w-xl" />
            <Ctas c={c} where="hero" className="mt-4" />
            <FounderBadge className="mt-6 max-w-xl" line={`I drive to ${c.city} and fix it myself. Call or text, you get me, not a call center.`} />
          </div>
          <div id="book" className="min-w-0 scroll-mt-36">
          <BookOrText
            phone={
              <div className="panel p-6">
                <p className="font-display text-xl font-bold">Get your price by text</p>
                <p className="mt-2 text-sm text-muted-foreground">Text the device (laptop, desktop, iPhone, Samsung or iPad), what's wrong and your {c.city} ZIP code. You get the price and the next opening.</p>
                <a href={smsHref(`Hi Chris, I'm in ${c.city}. My device and what's wrong: `)} data-call-location={`city repair ${c.slug} card text`} className="btn-ignite mt-5 inline-flex w-full items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5" aria-hidden /> Text {SITE.phone.display}
                </a>
              </div>
            }
            desktop={<CalCard title={`Book your ${c.city} tech visit`} sub="Pick a time. Price up front, no fix no charge." note={`city-repair-${c.slug}`} booking={IT_BOOKING} className="min-w-0" />}
          />
          </div>
        </div>
      </section>

      {/* A direct, quotable answer for search and AI assistants. */}
      <section className="border-t border-border bg-card/40 py-8 sm:py-10" aria-labelledby="answer">
        <div className="container-x max-w-3xl">
          <h2 id="answer" className="font-display text-xl font-bold sm:text-2xl">Who fixes computers and phones at home in {c.city}?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {SITE.name} repairs Windows laptops and desktops and replaces phone and tablet screens and batteries at homes and businesses in {c.city}, {c.county}, Florida. A tech drives {c.drive} {c.route} to you. Computer repair is {itPrice("it-pc-repair")}, speed-ups {itPrice("it-speedup")}, and phone repairs are priced by text with the part included. Call or text {SITE.phone.display}.
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <SectionHeader title={<span id="services">What we fix in {c.city}</span>} lede="Two kinds of repair, one visit, at your place." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {(
              [
                { icon: Laptop, title: "Computer repair", to: IT_SERVICES_PATH, link: "Computer repair prices", list: COMPUTER_FIXES, from: `From ${itPrice("it-speedup")}` },
                { icon: Smartphone, title: "Phone & tablet repair", to: phoneRepairPath(c), link: `Phone repair in ${c.city}`, list: PHONE_FIXES, from: "Price by text, part included" },
              ] as const
            ).map((s) => (
              <div key={s.title} className="panel flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/15 text-turbo">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold">
                    {s.title} in {c.city}
                  </h3>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{s.from}</p>
                <ul className="mt-4 grid gap-2">
                  {s.list.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[15px]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link to={s.to} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-turbo hover:underline">
                  {s.link} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Windows PCs only (no Macs or laptop screens). Phone and tablet repairs cover iPhone, Samsung, Pixel and iPad.</p>
          <ProblemLinks className="mt-8" title={`Computer problems we fix in ${c.city}`} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="getting">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="getting" className="h-section">Coming to you in {c.city}</h2>
            <p className="lede">{c.local}</p>
            <ul className="mt-6 grid gap-3 text-[15px]">
              <li className="flex items-start gap-2">
                <Car className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> {c.drive[0].toUpperCase() + c.drive.slice(1)} from Temple Terrace, {c.route}.
              </li>
              <li className="flex items-start gap-2">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Homes, apartments, condos and businesses.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Price up front. Diagnosis {itPrice("it-visit")}, credited to the repair. No fix, no charge.
              </li>
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">{c.city} ZIP codes we cover</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.zips.join(", ")} and nearby.</p>
            <h3 className="mt-5 font-display text-lg font-bold">Also on the same trip</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.nearby.join(", ")}.</p>
            <p className="mt-5 text-sm">Not sure we reach you? Text your ZIP to {SITE.phone.display}.</p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="reviews">
        <div className="container-x">
          <SectionHeader title={<span id="reviews">What customers say</span>} lede="Real Google reviews, word for word." />
          <ReviewWall className="mt-8" />
          <Ctas c={c} where="reviews" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How a {c.city} repair works</span>} />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Text, call or book", b: `Tell us the device, what's wrong and your ${c.city} ZIP code.` },
              { t: "Price up front", b: "You get the price before any work. Phone parts are ordered for your exact model." },
              { t: "Fixed at your place", b: "We come to you, fix it, test it with you, then you pay." },
            ].map((s, i) => (
              <li key={s.t} className="panel p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-white" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQList faqs={c.faqs} title={`${c.city} repair questions`} />
      <GuideLinks slugs={["why-is-my-laptop-so-slow", "computer-wont-turn-on", "cracked-phone-screen-repair-or-replace", "phone-battery-draining-fast"]} />

      <section className="section border-t border-border" aria-labelledby="cities">
        <div className="container-x">
          <p className="mb-6 text-base">
            Just a phone or iPad?{" "}
            <Link to={phoneRepairPath(c)} className="font-semibold text-turbo hover:underline">
              Phone &amp; tablet repair in {c.city} <ArrowRight className="inline h-4 w-4" aria-hidden />
            </Link>
            <br />
            Too old to fix?{" "}
            <Link to={recyclingPath(c)} className="font-semibold text-turbo hover:underline">
              Free tech recycling pickup in {c.city} <ArrowRight className="inline h-4 w-4" aria-hidden />
            </Link>
          </p>
          <h2 id="cities" className="font-display text-xl font-bold">Computer &amp; phone repair near {c.city}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link to={IT_SERVICES_PATH} className="inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold ring-1 ring-border hover:bg-white/5">
                Tampa
              </Link>
            </li>
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={cityRepairPath(o)} className="inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold ring-1 ring-border hover:bg-white/5">
                  {o.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel p-6 text-center sm:p-10">
            <Star className="mx-auto h-8 w-8 text-turbo" aria-hidden />
            <h2 id="final" className="h-section mt-3">Broken computer or phone in {c.city}?</h2>
            <p className="lede mx-auto">
              <PhoneOnly desktop={<>Call {SITE.phone.display} or pick a time. Price up front, no fix no charge.</>}>Text or call {SITE.phone.display}. Price up front, no fix no charge.</PhoneOnly>
            </p>
            <Ctas c={c} where="final" className="mt-7 sm:justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}
