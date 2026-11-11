// Tampa install landing pages (computer setup, security cameras, Wi-Fi): built for Google Search ads and local SEO.
// One focused action: the quiz (phones text us, computers leave a number then pick a time), with Call one tap away.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Check, ClipboardCheck, Home, MapPin, MessageSquare, Phone, Wrench } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { ServiceAreaList } from "@/components/blocks/ServiceAreaList";
import { InstallQuiz } from "@/components/tech/InstallQuiz";
import { FounderBadge } from "@/components/tech/FounderBadge";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { SITE } from "@/config/site";
import { INSTALL_PAGES, installPage } from "@/content/install-pages";
import { usd } from "@/content/pricing";
import { OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { newEventId, serverTrack, track } from "@/lib/track";

const STEP_ICONS = [MessageSquare, ClipboardCheck, Home];
const PROMISES = ["Price up front, before any work", "We come to your home or business", "Tested with you before we leave", "Pay after it works"];
const BUSINESS_PROMISES = ["Flat price in writing first", "On-site at your office or shop", "Tested with your team", "Pay after it's done"];

export default function InstallPage({ path }: { path: string }) {
  const page = installPage(path)!;

  useEffect(() => {
    const id = track("view_item", { content_name: page.name, content_category: page.category, content_type: "service", value: page.value, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: page.value, currency: "USD", contentName: page.name, contentCategory: page.category });
  }, [page]);

  const business = page.audience === "business";
  // Consumer pages cross-link each other; the business (Google Ads) page links to no consumer page.
  const others = business ? [] : INSTALL_PAGES.filter((p) => p.path !== page.path && !p.audience);

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise min-w-0">
            <p className="chip">
              <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {page.chip}
            </p>
            <h1 id="hero" className="mt-4 text-[32px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">{page.h1[0]}</span> <span className="text-turbo-grad">{page.h1[1]}</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{page.lede}</p>
            {page.prices.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                {page.prices.slice(0, 3).map((p) => (
                  <span key={p.id} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                    {p.name} <span className="font-semibold text-foreground">{p.from ? "from " : ""}{usd(p.price)}</span>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <a href="#book" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
                <Calendar className="hidden h-5 w-5 sm:block" aria-hidden />
                <MessageSquare className="h-5 w-5 sm:hidden" aria-hidden />
                <span className="sm:hidden">Get my price</span>
                <span className="hidden sm:inline">Book a time</span>
              </a>
              <CallLink location={`${page.slug} hero`} icon className="btn-blue justify-center !py-4 !text-lg">
                Call {SITE.phone.display}
              </CallLink>
            </div>
            <FounderBadge className="mt-5 max-w-xl" line={business ? "I do the setup myself and text you a written price first. Call or text, you get me." : "I come out and do the work myself. Call or text, you get me, not a call center."} />
            <ul className="mt-6 grid max-w-xl gap-x-4 gap-y-2 text-[15px] text-muted-foreground sm:grid-cols-2">
              {(business ? BUSINESS_PROMISES : PROMISES).map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div id="book" className="min-w-0 scroll-mt-24">
            <div className="hidden rounded-3xl border border-border bg-card p-5 shadow-xl sm:block sm:p-7">
              <p className="flex items-center gap-2 font-display text-2xl font-bold leading-tight">
                <Calendar className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Book your time
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">Pick a time on Cal.com. We confirm the exact price before the work starts.</p>
              <InstallCalEmbed className="mt-4" note={`${page.slug}-desktop-booking`} minHeight="560px" />
            </div>
            <div className="sm:hidden">
              <InstallQuiz page={page} id="book-mobile" className="min-w-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="prices">
        <div className="container-x">
          <SectionHeader title={<span id="prices">Prices</span>} lede="Labor, per unit, so you can add it up yourself. Equipment is yours, or we buy it at cost and show you the receipt. You get the total before we start." />
          {page.prices.length > 0 && (
            <ul className="panel mt-8 divide-y divide-border/60 px-5 sm:px-6">
              {page.prices.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-4 py-4">
                  <span className="min-w-0">
                    <span className="block text-base font-semibold">{p.name}</span>
                    <span className="block text-sm text-muted-foreground">{p.summary}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-lg font-bold">
                    {p.from ? "from " : ""}
                    {usd(p.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {page.priceNote && <p className="mt-4 max-w-2xl rounded-xl bg-turbo/[0.08] p-4 text-[15px] ring-1 ring-turbo/20">{page.priceNote}</p>}
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="included">
        <div className="container-x">
          <SectionHeader title={<span id="included">What's included</span>} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.includes.map((t) => (
              <li key={t} className="panel flex items-start gap-3 p-5 text-base">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works</span>} lede="Three steps, no surprises." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {page.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Wrench;
              return (
                <li key={s.title} className="panel p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-white">{i + 1}</span>
                    <Icon className="h-5 w-5 text-turbo" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-[15px] text-muted-foreground">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <img src={SITE.founder.image} alt={SITE.founder.name} width={160} height={160} loading="lazy" className="h-32 w-32 rounded-2xl object-cover ring-1 ring-border sm:h-40 sm:w-40" />
          <div>
            <h2 id="who" className="h-section">You deal with the person who does the work.</h2>
            <p className="lede">I'm {SITE.founder.name.split(" ")[0]}, based in Tampa. No call center: you call or text, I {business ? "send a written quote" : "tell you the price"}, I show up and do the job.</p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader title={<span id="area">Where we come to you</span>} lede="Tampa and about 40 miles around it." />
          <ServiceAreaList className="mt-8" />
        </div>
      </section>

      <FAQList faqs={page.faqs} title="Quick answers" />

      {!business && (
      <section className="section border-t border-border" aria-labelledby="more">
        <div className="container-x">
          <SectionHeader title={<span id="more">We also do</span>} />
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((p) => (
              <Link key={p.path} to={p.path} className="btn-chrome">
                {p.h1[0].replace(/[?.]$/, "")}
              </Link>
            ))}
            <Link to={OFFICE_SETUP_PATH} className="btn-chrome">
              Office setup & cable management
            </Link>
          </div>
        </div>
      </section>
      )}

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel p-6 text-center sm:p-10">
            <h2 id="final" className="h-section">Get your price today.</h2>
            <p className="lede mx-auto">Text or call {SITE.phone.display}. Price up front, pay after it works.</p>
            <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
              <a href="#book" className="btn-ignite inline-flex items-center justify-center gap-2 !py-4 !text-lg">
                <Calendar className="hidden h-5 w-5 sm:block" aria-hidden />
                <MessageSquare className="h-5 w-5 sm:hidden" aria-hidden />
                <span className="sm:hidden">Get my price</span>
                <span className="hidden sm:inline">Book a time</span>
              </a>
              <CallLink location={`${page.slug} final`} className="btn-blue justify-center !py-4 !text-lg">
                <Phone className="h-5 w-5" aria-hidden /> Call now
              </CallLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
