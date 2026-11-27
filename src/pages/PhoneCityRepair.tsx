// /phone-repair-<city>-fl: phone and tablet screen and battery repair at your door for one city (data in
// content/city-repair.ts). Built for "phone screen repair Brandon", "iPhone battery replacement Lakeland": the city in
// the title, H1 and first paragraph, a big call card, a direct answer block, the drive and ZIP codes, city FAQs, then
// reviews and booking. Phone parts are ordered per model, so prices are given by call or text (same as the site and
// the Google Business Profile).
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BatteryCharging, Calendar, Car, Check, Home, MapPin, MessageSquare, Smartphone, Star, Tablet } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { GuideLinks } from "@/components/blocks/GuideLinks";
import { BookOrText, CalCard, PhoneOnly, useTexting } from "@/components/booking/BookOrText";
import { InstallBookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { CallNowCard } from "@/components/tech/CallNowCard";
import { FounderBadge } from "@/components/tech/FounderBadge";
import { ReviewSummary, ReviewWall } from "@/components/tech/ReviewWall";
import { IT_BOOKING, SITE } from "@/config/site";
import { PHONE_REPAIR_TAMPA, REPAIR_CITIES, cityRepairPath, phoneFaqs, phoneRepairPath, recyclingPath, type RepairCity } from "@/content/city-repair";
import { smsHref } from "@/lib/sms";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";

const sms = (c: RepairCity) => `Hi Chris, I'm in ${c.city}. My phone/tablet model and what's wrong: `;

function Ctas({ c, where, className }: { c: RepairCity; where: string; className?: string }) {
  const texting = useTexting();
  return (
    <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      <CallLink location={`phone city ${c.slug} ${where}`} icon className="btn-ignite btn-shine justify-center !py-4 !text-lg">
        Call {SITE.phone.display}
      </CallLink>
      {texting ? (
        <a href={smsHref(sms(c))} data-call-location={`phone city ${c.slug} ${where} text`} className="btn-blue inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <MessageSquare className="h-5 w-5" aria-hidden /> Text for my price
        </a>
      ) : (
        <InstallBookButton note={`phone-city-${c.slug}-${where}`} booking={IT_BOOKING} title={`Book your ${c.city} phone repair`} variant="chrome" className="inline-flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden /> Book a time
        </InstallBookButton>
      )}
    </div>
  );
}

const FIXES = [
  { icon: Smartphone, title: "Cracked or black screens", list: ["iPhone screens, any model we can get a part for", "Samsung Galaxy, Pixel, Motorola screens", "Lines, black screen or touch not working", "New screen for your exact model"] },
  { icon: BatteryCharging, title: "Batteries", list: ["Dies by lunch or shuts off at 30%", "Swollen battery lifting the screen", "iPhone, Samsung and Pixel batteries", "Charging tested with you after"] },
  { icon: Tablet, title: "iPads & tablets", list: ["Cracked iPad screens", "Samsung Galaxy Tab and Fire tablets", "Worn-out tablet batteries", "Kids' tablets and school iPads"] },
] as const;

export default function PhoneCityRepair({ c }: { c: RepairCity }) {
  useEffect(() => {
    const name = `Phone repair ${c.city}`;
    const id = track("view_item", { content_name: name, content_category: "phone_repair", content_type: "service", value: 120, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: 120, currency: "USD", contentName: name, contentCategory: "phone_repair" });
  }, [c]);

  const others = REPAIR_CITIES.filter((x) => x.slug !== c.slug);
  const pill = "inline-flex min-h-[48px] items-center rounded-full px-5 text-base font-semibold ring-1 ring-border hover:bg-white/5";

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link to={PHONE_REPAIR_TAMPA} className="hover:text-foreground hover:underline">Phone repair</Link> <span aria-hidden>›</span> {c.city}, FL
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ReviewSummary />
              <p className="chip">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {c.city} · {c.county}
              </p>
            </div>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Phone &amp; iPad screen repair in {c.city}, FL.</span> <span className="text-turbo-grad">We come to you.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cracked iPhone, Samsung or iPad screen? Battery dying by lunch? We replace it at your home or work in {c.city}. <span className="font-semibold text-foreground">Call with the model and you get one price with the part included, before we order anything.</span>
            </p>
            <CallNowCard where={`phone city ${c.slug}`} headline={`Cracked screen or dead battery in ${c.city}? Call now for your price.`} className="mt-5 max-w-xl" />
            <Ctas c={c} where="hero" className="mt-4 [&>*:first-child]:hidden sm:[&>*:first-child]:inline-flex" />
            <FounderBadge className="mt-6 max-w-xl" line={`I drive to ${c.city} and fix it myself. Call and you get me, not a call center.`} />
          </div>
          <div id="book" className="min-w-0 scroll-mt-36">
            <BookOrText
              phone={
                <div className="panel p-6">
                  <p className="font-display text-xl font-bold">Rather text? Get your price by text</p>
                  <p className="mt-2 text-sm text-muted-foreground">Text the phone or tablet model, what's wrong and your {c.city} ZIP code. A photo helps. You get one price with the part included.</p>
                  <a href={smsHref(sms(c))} data-call-location={`phone city ${c.slug} card text`} className="btn-blue mt-5 inline-flex w-full items-center justify-center gap-2 !py-4 !text-lg">
                    <MessageSquare className="h-5 w-5" aria-hidden /> Text {SITE.phone.display}
                  </a>
                </div>
              }
              desktop={<CalCard title={`Book your ${c.city} phone repair`} sub="Pick a time. We confirm the price for your model first." note={`phone-city-${c.slug}`} booking={IT_BOOKING} className="min-w-0" />}
            />
          </div>
        </div>
      </section>

      {/* A direct, quotable answer for search and AI assistants. */}
      <section className="border-t border-border bg-card/40 py-8 sm:py-10" aria-labelledby="answer">
        <div className="container-x max-w-3xl">
          <h2 id="answer" className="font-display text-xl font-bold sm:text-2xl">Who fixes phone screens at home in {c.city}?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {SITE.name} replaces iPhone, Samsung, Pixel and iPad screens and batteries at homes and businesses in {c.city}, {c.county}, Florida. A tech drives {c.drive} {c.route} to you. Every repair is priced by model with the part included, given by call or text before anything is ordered. Call or text {SITE.phone.display}.
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <SectionHeader title={<span id="services">What we fix in {c.city}</span>} lede="Screens and batteries for phones and tablets, replaced at your place." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FIXES.map((s) => (
              <div key={s.title} className="panel flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/15 text-turbo">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">Price by call or text, part included</p>
                <ul className="mt-4 grid gap-2">
                  {s.list.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[15px]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Ctas c={c} where="services" className="mt-8" />
          <p className="mt-4 text-sm text-muted-foreground">
            Computer trouble too?{" "}
            <Link to={cityRepairPath(c)} className="font-semibold text-turbo hover:underline">
              Computer repair in {c.city} <ArrowRight className="inline h-4 w-4" aria-hidden />
            </Link>
            <br />
            Old phone you don't need?{" "}
            <Link to={recyclingPath(c)} className="font-semibold text-turbo hover:underline">
              Free tech recycling in {c.city} <ArrowRight className="inline h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="getting">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="getting" className="h-section">Coming to you in {c.city}</h2>
            <p className="lede">{c.phoneLocal}</p>
            <ul className="mt-6 grid gap-3 text-[15px]">
              <li className="flex items-start gap-2">
                <Car className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> {c.drive[0].toUpperCase() + c.drive.slice(1)} from Temple Terrace, {c.route}.
              </li>
              <li className="flex items-start gap-2">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Homes, apartments, condos and businesses. No drop-off, no waiting at a store.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Face ID, touch, camera and charging tested with you before you pay.
              </li>
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">{c.city} ZIP codes we cover</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.zips.join(", ")} and nearby.</p>
            <h3 className="mt-5 font-display text-lg font-bold">Also on the same trip</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.nearby.join(", ")}.</p>
            <p className="mt-5 text-sm">
              Not sure we reach you? Call <CallLink location={`phone city ${c.slug} zip`} className="font-semibold text-turbo underline underline-offset-2" />.
            </p>
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
          <SectionHeader title={<span id="how">How a {c.city} phone repair works</span>} />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Call with the model", b: `Tell us the phone or tablet, what's wrong and your ${c.city} ZIP code.` },
              { t: "One price, part included", b: "You get the price on the call. We order the part for your exact model." },
              { t: "Fixed at your place", b: "We come to you, replace it, test it with you, then you pay." },
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

      <FAQList faqs={phoneFaqs(c)} title={`${c.city} phone repair questions`} />
      <GuideLinks slugs={["cracked-phone-screen-repair-or-replace", "phone-battery-draining-fast"]} />

      <section className="section border-t border-border" aria-labelledby="cities">
        <div className="container-x">
          <h2 id="cities" className="font-display text-xl font-bold">Phone repair near {c.city}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link to={PHONE_REPAIR_TAMPA} className={pill}>
                Tampa
              </Link>
            </li>
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={phoneRepairPath(o)} className={pill}>
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
            <h2 id="final" className="h-section mt-3">Cracked screen in {c.city}? Don't wait on it.</h2>
            <p className="lede mx-auto">
              <PhoneOnly desktop={<>Call {SITE.phone.display} or pick a time. One price with the part included.</>}>Call {SITE.phone.display} now. One price with the part included, fixed at your place.</PhoneOnly>
            </p>
            <Ctas c={c} where="final" className="mt-7 sm:justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}
