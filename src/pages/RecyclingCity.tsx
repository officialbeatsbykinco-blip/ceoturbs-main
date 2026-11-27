// /electronics-recycling-<city>-fl: free tech recycling pickup for one city (data in content/city-repair.ts).
// Built for "electronics recycling Brandon", "computer recycling near me Lakeland", "where to recycle a TV in St. Pete":
// the city in the title, H1 and first paragraph, a big call card, Text on phones and Email on computers, a direct
// answer, what we take, the drive and ZIP codes, city FAQs, reviews, and links to the other cities.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Car, Check, HardDrive, Home, Mail, MapPin, MessageSquare, Recycle, Star, Truck } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { GuideLinks } from "@/components/blocks/GuideLinks";
import { useTexting } from "@/components/booking/BookOrText";
import { CallLink } from "@/components/site/CallLink";
import { AcceptsChecker } from "@/components/tech/AcceptsChecker";
import { CallNowCard } from "@/components/tech/CallNowCard";
import { FounderBadge } from "@/components/tech/FounderBadge";
import { InstallQuiz } from "@/components/tech/InstallQuiz";
import { ReviewSummary, ReviewWall } from "@/components/tech/ReviewWall";
import { SITE } from "@/config/site";
import { RECYCLING_TAMPA, REPAIR_CITIES, cityRepairPath, phoneRepairPath, recycleFaqs, recyclingPath, type RepairCity } from "@/content/city-repair";
import { installPage } from "@/content/install-pages";
import { smsHref } from "@/lib/sms";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";

const sms = (c: RepairCity) => `Hi Chris, I'm in ${c.city} and have old tech to recycle. Here's a photo / what I have: `;
const mail = (c: RepairCity) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(`Free recycling pickup in ${c.city}`)}&body=${encodeURIComponent(`Hi Chris, I'm in ${c.city}, FL. Here's what I have to recycle and my ZIP code:\n\n`)}`;

/** Call first; then Text on phones, Email on computers (where texting isn't one tap). */
function Ctas({ c, where, className }: { c: RepairCity; where: string; className?: string }) {
  const texting = useTexting();
  return (
    <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      <CallLink location={`recycle city ${c.slug} ${where}`} icon className="btn-ignite btn-shine justify-center !py-4 !text-lg">
        Call {SITE.phone.display}
      </CallLink>
      {texting ? (
        <a href={smsHref(sms(c))} data-call-location={`recycle city ${c.slug} ${where} text`} className="btn-blue inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <MessageSquare className="h-5 w-5" aria-hidden /> Text us a photo
        </a>
      ) : (
        <a href={mail(c)} data-call-location={`recycle city ${c.slug} ${where} email`} className="btn-blue inline-flex items-center justify-center gap-2 !py-4 !text-lg">
          <Mail className="h-5 w-5" aria-hidden /> Email us
        </a>
      )}
    </div>
  );
}

const WHAT = [
  { icon: Recycle, title: "Computers & phones", list: ["Laptops, desktops and towers", "Old iPhones and Androids", "iPads and tablets", "Gaming PCs and game consoles"] },
  { icon: Truck, title: "TVs, monitors & more", list: ["Flat-screen TVs and monitors", "Printers and scanners", "Routers, modems and servers", "Cables, chargers, keyboards and mice"] },
  { icon: HardDrive, title: "Your data, handled", list: ["Every hard drive wiped", "Or drilled in front of you", "Phones reset and signed out", "Free, at pickup"] },
] as const;

export default function RecyclingCity({ c }: { c: RepairCity }) {
  // The Tampa recycling page's quiz, under this city's name so the lead says where it came from.
  const base = installPage(RECYCLING_TAMPA)!;
  const quizPage = { ...base, name: `Tech recycling ${c.city}`, slug: `tech-recycling-${c.slug}` };

  useEffect(() => {
    const name = `Tech recycling ${c.city}`;
    const id = track("view_item", { content_name: name, content_category: "tech_recycling", content_type: "service", value: 40, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: 40, currency: "USD", contentName: name, contentCategory: "tech_recycling" });
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
              <Link to={RECYCLING_TAMPA} className="hover:text-foreground hover:underline">Tech recycling</Link> <span aria-hidden>›</span> {c.city}, FL
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ReviewSummary />
              <p className="chip">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {c.city} · {c.county}
              </p>
            </div>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Free electronics recycling in {c.city}, FL.</span> <span className="text-turbo-grad">We pick it up.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Old computers, laptops, phones, TVs or a closet full of cables? We come to your home or business in {c.city}, carry it out, wipe or destroy every hard drive and get it reused or recycled. <span className="font-semibold text-foreground">Pickup is free. Call, text or email us.</span>
            </p>
            <CallNowCard
              where={`recycle city ${c.slug}`}
              headline={`Old tech piling up in ${c.city}? Call now for a free pickup.`}
              points={["You talk to the person who picks it up", "Pickup and data wipe are free", "We carry it out, no lifting"]}
              className="mt-5 max-w-xl"
            />
            <Ctas c={c} where="hero" className="mt-4 [&>*:first-child]:hidden sm:[&>*:first-child]:inline-flex" />
            <p className="mt-3 text-[15px] text-muted-foreground">
              Or email <a href={mail(c)} data-call-location={`recycle city ${c.slug} hero email link`} className="font-semibold text-foreground underline underline-offset-2">{SITE.email}</a> with a photo of what you have and your ZIP.
            </p>
            <FounderBadge className="mt-6 max-w-xl" line={`I do the ${c.city} pickups myself. Call or text and you get me, not a call center.`} />
          </div>
          <div id="book" className="min-w-0 scroll-mt-36">
            <InstallQuiz page={quizPage} id="book-form" className="min-w-0" />
          </div>
        </div>
      </section>

      {/* A direct, quotable answer for search and AI assistants. */}
      <section className="border-t border-border bg-card/40 py-8 sm:py-10" aria-labelledby="answer">
        <div className="container-x max-w-3xl">
          <h2 id="answer" className="font-display text-xl font-bold sm:text-2xl">Where can I recycle old electronics in {c.city}, FL?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {SITE.name} picks up old computers, laptops, phones, tablets, monitors, flat-screen TVs, printers and cables free at homes and businesses in {c.city}, {c.county}, Florida. We drive {c.drive} {c.route}, carry it out, wipe or destroy every hard drive, and take everything to be reused or recycled. Call or text {SITE.phone.display} or email {SITE.email}.
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="take">
        <div className="container-x">
          <SectionHeader title={<span id="take">What we pick up in {c.city}</span>} lede="If it has a plug and a screen or circuit board, we probably take it. Pickup is free." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {WHAT.map((s) => (
              <div key={s.title} className="panel flex flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/15 text-turbo">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">Free pickup</p>
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
          <p className="mt-4 text-sm text-muted-foreground">We don't take large appliances (fridges, washers, AC units) or leaking batteries.</p>
          <Ctas c={c} where="take" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="check">
        <div className="container-x">
          <SectionHeader title={<span id="check">Can you take my…?</span>} lede="Tap what you have and get the answer right now." />
          <AcceptsChecker page={base} className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="getting">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="getting" className="h-section">Free pickup in {c.city}</h2>
            <p className="lede">{c.recycleLocal}</p>
            <ul className="mt-6 grid gap-3 text-[15px]">
              <li className="flex items-start gap-2">
                <Car className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> {c.drive[0].toUpperCase() + c.drive.slice(1)} from Temple Terrace, {c.route}.
              </li>
              <li className="flex items-start gap-2">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Homes, apartments, condos, garages and offices. We come in and carry it out.
              </li>
              <li className="flex items-start gap-2">
                <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden /> Every drive wiped, or drilled in front of you, before anything leaves.
              </li>
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">{c.city} ZIP codes we pick up in</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.zips.join(", ")} and nearby.</p>
            <h3 className="mt-5 font-display text-lg font-bold">Also on the same trip</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.nearby.join(", ")}.</p>
            <p className="mt-5 text-sm">
              Not sure we reach you? Call <CallLink location={`recycle city ${c.slug} zip`} className="font-semibold text-turbo underline underline-offset-2" /> or email{" "}
              <a href={mail(c)} className="font-semibold text-turbo underline underline-offset-2">{SITE.email}</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How a {c.city} recycling pickup works</span>} />
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Call, text or email", b: `Tell us what you have (a photo is perfect) and your ${c.city} ZIP code.` },
              { t: "Pick a pickup day", b: "We reply with a time that works for you. Pickup is free." },
              { t: "We haul it away", b: "We carry it out, take care of the data and get it reused or recycled." },
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
          <Ctas c={c} where="how" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x max-w-3xl">
          <h2 id="why" className="h-section">Why not just put it in the trash?</h2>
          <p className="lede">
            Computers, TVs and phones hold lead, mercury and lithium batteries. In a landfill they leak into soil and water, and a crushed battery can start a fire in a garbage truck. Florida counties, {c.county} included, ask residents to keep electronics out of curbside trash. A free pickup is the easy way to do it right.
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="reviews">
        <div className="container-x">
          <SectionHeader title={<span id="reviews">What customers say</span>} lede="Real Google reviews, word for word." />
          <ReviewWall className="mt-8" />
          <Ctas c={c} where="reviews" className="mt-8" />
        </div>
      </section>

      <FAQList faqs={recycleFaqs(c)} title={`${c.city} electronics recycling questions`} />
      <GuideLinks slugs={["where-to-recycle-electronics-tampa-bay", "how-to-wipe-computer-before-recycling"]} />

      <section className="section border-t border-border" aria-labelledby="cities">
        <div className="container-x">
          <h2 id="cities" className="font-display text-xl font-bold">Tech recycling near {c.city}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link to={RECYCLING_TAMPA} className={pill}>
                Tampa
              </Link>
            </li>
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={recyclingPath(o)} className={pill}>
                  {o.city}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Something still worth fixing?{" "}
            <Link to={cityRepairPath(c)} className="font-semibold text-turbo hover:underline">
              Computer repair in {c.city}
            </Link>{" "}
            ·{" "}
            <Link to={phoneRepairPath(c)} className="font-semibold text-turbo hover:underline">
              Phone repair in {c.city} <ArrowRight className="inline h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel p-6 text-center sm:p-10">
            <Star className="mx-auto h-8 w-8 text-turbo" aria-hidden />
            <h2 id="final" className="h-section mt-3">Get your old tech out of the house.</h2>
            <p className="lede mx-auto">Call or text {SITE.phone.display} or email {SITE.email}. Free pickup anywhere in {c.city}.</p>
            <Ctas c={c} where="final" className="mt-7 sm:justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}
