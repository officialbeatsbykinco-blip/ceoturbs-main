import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { audienceBySlug, type Audience } from "@/content/audiences";
import { SERVICES } from "@/content/services";
import { clientsIn } from "@/content/clients";
import { adsFor } from "@/content/ads";
import { GUIDES, guidePath } from "@/content/guides";
import { BookButton } from "@/components/cta/Actions";
import { SCENES } from "@/components/visuals/Scenes";
import { SiteWall } from "@/components/visuals/SiteWall";
import { WorkGrid, AdResultsGrid, AdGallery } from "@/components/blocks/Proof";
import { ServiceGrid, BrandBoostSteps, BookingSection, ReviewCardPromo } from "@/components/blocks/Sales";
import { PriceCard } from "@/components/blocks/PriceBlocks";
import { ALL_PRICES, PRICING_TERMS } from "@/content/pricing";
import { SectionHeader, DirectAnswer, Breadcrumbs, FAQList } from "@/components/blocks/Basics";
import NotFound from "./NotFound";

const SCENE_FOR = { artist: SCENES.artist, producers: SCENES.artist, "visual-artists": SCENES.shopify, "local-business": SCENES.local, shopify: SCENES.shopify } as const;

/** Prices shown on the artist and producer pages: straight from src/content/pricing.ts, so they match /pricing. */
const MUSIC_PRICE_IDS = ["site-artist", "tracking-setup", "growth"];

export default function AudiencePage({ slug }: { slug: Audience["slug"] }) {
  const a = audienceBySlug(slug);
  if (!a) return <NotFound />;
  const Scene = SCENE_FOR[a.slug];
  const work = a.showWork === false ? [] : clientsIn(a.category);
  const ads = adsFor(a.adVertical);
  const guides = GUIDES.filter((g) => (a.guidesFrom === "all" ? false : g.audience === a.adVertical) || g.audience === "all");
  const path = `/${a.slug}`;

  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: a.nav, path }]} />
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="hero-rise">
              <p className="chip">{a.eyebrow}</p>
              <h1 className="mt-5 text-3xl font-bold leading-[1.02] sm:text-4xl md:text-6xl">{a.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{a.answer}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BookButton note={a.bookingNote} prefill={a.bookingNote}>{a.ctaLabel}</BookButton>
                <a href="#work" className="btn-chrome">
                  See the work first
                </a>
              </div>
            </div>
            <Scene className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="pains">
        <div className="container-x">
          <SectionHeader title={<span id="pains">Sound familiar?</span>} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {a.pains.map((p) => (
              <li key={p.title} className="panel p-6">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="fix">
        <div className="container-x">
          <SectionHeader title={<span id="fix">What we fix, and what you get</span>} lede={`Here's exactly how CEO Turbo helps ${a.plural}. Each one links to the full service.`} />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2 lg:grid-cols-3 md:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(3n+1)]:col-span-3 lg:[&>*:last-child:nth-child(3n+2)]:col-span-2">
            {a.outcomes.map((o) => (
              <li key={o.title} className="flex flex-col bg-background p-6">
                <h3 className="text-xl font-semibold tracking-tight">{o.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{o.body}</p>
                {o.service && (
                  <Link to={o.service === "google-review-cards" || o.service === "artist-merch" ? `/${o.service}` : `/services/${o.service}`} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo">
                    {o.service === "google-review-cards" ? "Shop review cards" : o.service === "artist-merch" ? "Design your merch" : `About ${SERVICES.find((x) => x.slug === o.service)?.name ?? "this service"}`}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ol>
          <DirectAnswer label="In one sentence">{a.answer}</DirectAnswer>
        </div>
      </section>

      {work.length > 0 && (
        <section id="work" className="section border-t border-border" aria-labelledby="work-title">
          <div className="container-x">
            <SectionHeader title={<span id="work-title">Sites we've built for {a.plural}</span>} lede="Real, live client sites. Open any case study to see why it's built the way it is." />
          </div>
          {work.length >= 6 && (
            <div className="mt-6">
              <SiteWall clients={work} eagerCount={0} />
            </div>
          )}
          <div className="container-x mt-10">
            <WorkGrid clients={work} />
          </div>
        </section>
      )}

      {a.resultKeys.length > 0 && (
        <section className="section border-t border-border" aria-labelledby="results-title">
          <div className="container-x">
            <SectionHeader title={<span id="results-title">Ad results, straight from the dashboard</span>} lede="Unedited Meta Ads Manager numbers from campaigns we ran." />
            <div className="mt-10">
              <AdResultsGrid keys={a.resultKeys} />
            </div>
            {ads.length > 0 && (
              <>
                <h3 className="mt-16 text-2xl font-bold">Ad creatives we designed</h3>
                <div className="mt-6">
                  <AdGallery ads={ads.slice(0, 8)} />
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="section border-t border-border" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeader title={<span id="services-title">Services for {a.plural}</span>} />
          <div className="mt-10">
            <ServiceGrid slugs={a.serviceSlugs} cards={a.category !== "artist"} />
          </div>
        </div>
      </section>

      {(a.slug === "artist" || a.slug === "producers" || a.slug === "visual-artists") && (
        <section className="section border-t border-border" aria-labelledby="music-prices">
          <div className="container-x">
            <SectionHeader title={<span id="music-prices">Fair, clear prices for {a.plural}</span>} lede="Pay once to get set up right. Add weekly ad management only if you want it. Ad spend goes straight to the platform from your own account, never marked up." />
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {(a.priceIds ?? MUSIC_PRICE_IDS).map((id) => ALL_PRICES.find((p) => p.id === id)!).map((p) => (
                <PriceCard key={p.id} p={p} />
              ))}
            </ul>
            {a.priceNote && <p className="mt-6 max-w-3xl text-[15px] leading-relaxed">{a.priceNote}</p>}
            <p className="mt-6 text-sm text-muted-foreground">{PRICING_TERMS.contract}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <BookButton note={`${a.bookingNote} — prices`} prefill={a.bookingNote}>
                {a.ctaLabel}
              </BookButton>
              <Link to="/pricing" className="btn-chrome">
                See every price
              </Link>
            </div>
          </div>
        </section>
      )}

      {a.slug === "local-business" && (
        <section className="section border-t border-border" aria-label="Google review cards">
          <div className="container-x">
            <ReviewCardPromo />
          </div>
        </section>
      )}

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How we start</span>} />
          <div className="mt-10">
            <BrandBoostSteps />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <BookButton note={a.bookingNote} prefill={a.bookingNote}>{a.ctaLabel}</BookButton>
            <Link to="/free-audit" className="btn-chrome">
              Run a free visibility audit
            </Link>
          </div>
        </div>
      </section>

      <FAQList faqs={a.faqs} title={`Questions from ${a.plural}`} />

      {guides.length > 0 && (
        <section className="pb-8" aria-labelledby="read">
          <div className="container-x">
            <h2 id="read" className="text-2xl font-bold">
              Free guides for {a.plural}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {guides.slice(0, 3).map((g) => (
                <li key={g.slug}>
                  <Link to={guidePath(g)} className="panel block h-full p-5 hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5)]">
                    <p className="font-semibold leading-snug">{g.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{g.readMinutes} min read</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BookingSection note={a.bookingNote} prefill={a.bookingNote} />
    </>
  );
}
