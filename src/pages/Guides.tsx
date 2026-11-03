import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { CompareTable } from "@/components/blocks/CompareTable";
import { GUIDES, guideBySlug, guideImage, guidePath, type Guide } from "@/content/guides";
import { AUDIENCES } from "@/content/audiences";
import { SITE, REVIEW_CARD, fromPriceLabel, money2 } from "@/config/site";
import { GUIDE_OFFERS, DEFAULT_OFFER } from "@/content/guide-offers";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { ReviewCard3D } from "@/components/visuals/ReviewVisuals";
import { BookingSection } from "@/components/blocks/Sales";
import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import NotFound from "./NotFound";

/** Mid-article offer: the animated tap card with a pitch written for this guide's topic. */
function CardOffer({ slug, className = "" }: { slug: string; className?: string }) {
  const o = GUIDE_OFFERS[slug] ?? DEFAULT_OFFER;
  return (
    <aside className={`cta-glow grid items-center gap-6 rounded-3xl p-6 sm:grid-cols-[0.8fr_1.2fr] sm:p-8 ${className}`} aria-label="Google review cards">
      <div className="relative mx-auto w-full max-w-[220px]">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
        <ReviewCard3D tap className="w-full" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ignite">{o.kicker}</p>
        <p className="mt-2 text-2xl font-bold leading-snug">{o.head}</p>
        <p className="mt-2 text-sm text-muted-foreground">{o.body}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ShopCardsButton className="btn-shine">{o.cta} — from {fromPriceLabel}</ShopCardsButton>
          <span className="text-xs text-muted-foreground">Free US shipping · {REVIEW_CARD.returnDays}-day returns</span>
        </div>
      </div>
    </aside>
  );
}

/** End-of-article closer: a different angle per guide (speed, risk, price) so it never repeats the mid-article block. */
function CardCloser({ index, className = "" }: { index: number; className?: string }) {
  const angle = index % 3;
  const lines = [
    { t: "Order tonight, collecting reviews by the weekend.", s: `${REVIEW_CARD.shipping.processing}.` },
    { t: "Try it risk-free.", s: REVIEW_CARD.guarantee },
    { t: "Pick the pack that fits your counter.", s: "One card per register, chair or truck. Bigger packs cost less per card." },
  ][angle];
  return (
    <aside className={`rounded-3xl border border-turbo/30 bg-turbo/[0.06] p-6 sm:p-8 ${className}`} aria-label="Order Google review cards">
      <p className="text-2xl font-bold leading-snug">{lines.t}</p>
      <p className="mt-2 text-sm text-muted-foreground">{lines.s}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {REVIEW_CARD.packs.map((p) => (
          <li key={p.id}>
            <ShopCardsButton variant={p.popular ? "ignite" : "chrome"} className="w-full justify-between !px-4">
              <span>{p.label}</span>
              <span className="font-bold">{money2(p.price)}</span>
            </ShopCardsButton>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function GuidesHub() {
  return (
    <>
      <section className="pt-28 sm:pt-32">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides" }]} />
          <SectionHeader as="h1" title="Straight answers on growing your business" lede="Built from our own campaigns and client work, not recycled advice. Every guide starts with the answer." />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link to={guidePath(g)} className="panel flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5)]">
                  <img src={guideImage(g).src} alt="" width={1200} height={630} loading="lazy" decoding="async" className="aspect-[1200/630] w-full object-cover" />
                  <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-muted-foreground">{g.readMinutes} min read</p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug">{g.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
                  <span className="mt-5 text-sm font-semibold text-turbo">Read the guide ›</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <BookingSection note="Guides hub" />
    </>
  );
}

export function GuidePage({ slugOverride }: { slugOverride?: string }) {
  const params = useParams();
  const g = guideBySlug(slugOverride ?? params.slug ?? "");
  if (!g || (!slugOverride && g.path)) return <NotFound />;
  return <GuideArticle g={g} />;
}

function GuideArticle({ g }: { g: Guide }) {
  const path = guidePath(g);
  const audience = AUDIENCES.find((a) => a.adVertical === g.audience);
  const note = `Read guide: ${g.title}`;
  return (
    <>
      <article className="pt-28 sm:pt-32">
        <header className="container-x max-w-[860px]">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides" }, { name: g.title, path }]} />
          <h1 className="text-4xl font-bold leading-[1.04] sm:text-5xl">{g.title}</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            By{" "}
            <Link to="/about" rel="author" className="text-foreground underline underline-offset-4 hover:text-turbo">
              {SITE.founder.name}
            </Link>{" "}
            · Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {g.readMinutes} min read
          </p>
          <DirectAnswer>{g.summary}</DirectAnswer>
          <img src={guideImage(g).src} alt={guideImage(g).alt} width={1200} height={630} {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" className="mt-8 aspect-[1200/630] w-full rounded-2xl object-cover ring-1 ring-white/10" />
          <nav aria-label="In this guide" className="mt-8 rounded-2xl border border-border p-5">
            <p className="text-sm font-semibold">In this guide</p>
            <ol className="mt-2 grid text-sm text-muted-foreground sm:grid-cols-2">
              {g.sections.map((s) => (
                <li key={s.h2}>
                  <a href={`#${anchor(s.h2)}`} className="block py-2 hover:text-turbo">
                    {s.h2}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <div className="container-x max-w-[860px] pb-8">
          {g.sections.map((s, i) => (
            <Fragment key={s.h2}>
            {i === Math.min(2, g.sections.length - 1) && <CardOffer slug={g.slug} className="mt-14" />}
            <section id={anchor(s.h2)} className="mt-14 scroll-mt-24">
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{s.h2}</h2>
              <p className="prose-answer mt-4">{s.answer}</p>
              {s.body?.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-5 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-foreground/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turbo" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <CompareTable className="mt-6" head={s.table.head} rows={s.table.rows} />
              )}
            </section>
            </Fragment>
          ))}

          <CardCloser index={GUIDES.indexOf(g)} className="mt-16" />

          <aside className="panel mt-10 p-6 sm:p-8">
            <p className="text-sm font-medium text-turbo">Want this done for you?</p>
            <p className="mt-2 text-2xl font-bold leading-snug">We'll look at your business on a free 30-minute call and tell you what to fix first.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookButton note={note} />
              {audience && (
                <Link to={`/${audience.slug}`} className="btn-chrome">
                  How we help {audience.plural}
                </Link>
              )}
            </div>
          </aside>

          <div className="mt-12">
            <h2 className="text-lg font-semibold">Related</h2>
            <ul className="mt-3 space-y-2">
              {g.related.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="text-turbo underline underline-offset-4">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
      {g.faqs.length > 0 && <FAQList faqs={g.faqs} />}
    </>
  );
}
