import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { clientBySlug, CLIENTS, CATEGORY_LABEL, domainOf } from "@/content/clients";
import { AD_RESULTS } from "@/content/results";
import { adsForClient } from "@/content/ads";
import { AUDIENCES } from "@/content/audiences";
import { BrowserShot, FeaturedResult, ResultCard, AdGallery, WorkGrid } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { Breadcrumbs } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug = "" } = useParams();
  const c = clientBySlug(slug);
  if (!c) return <NotFound />;

  const results = AD_RESULTS.filter((r) => r.clientSlug === c.slug);
  const ads = adsForClient(c.slug);
  const audience = AUDIENCES.find((a) => a.category === c.category);
  const more = CLIENTS.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 3);
  const note = `Saw the ${c.name} case study`;

  return (
    <>
      <article>
        <header className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo" aria-hidden />
          <div className="container-x relative">
            <Breadcrumbs items={[{ name: "Portfolio", path: "/portfolio" }, { name: c.name, path: `/portfolio/${c.slug}` }]} />
            <div className="flex flex-wrap gap-2">
              <span className="chip">{CATEGORY_LABEL[c.category]}</span>
              <span className="chip">{c.industry}</span>
              {c.location && <span className="chip">{c.location}</span>}
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.02] sm:text-6xl">
              {c.name}: {c.industry.toLowerCase()} website
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">“{c.promise}”</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={c.url} target="_blank" rel="noopener" className="btn-chrome">
                Visit {domainOf(c.url)} <ArrowUpRight className="h-4 w-4" />
              </a>
              <BookButton note={note}>Get a site like this</BookButton>
            </div>
            <div className="mt-12" style={{ perspective: "1600px" }}>
              <div style={{ transform: "rotateX(6deg)", transformOrigin: "top" }} className="shadow-[0_60px_120px_-40px_hsl(var(--turbo)/0.45)]">
                <BrowserShot client={c} eager large />
              </div>
            </div>
          </div>
        </header>

        <section className="section" aria-labelledby="overview">
          <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 id="overview" className="h-section">
                The brief
              </h2>
              <p className="prose-answer mt-6">{c.overview}</p>
            </div>
            <aside className="panel h-fit p-6">
              <h2 className="text-lg font-semibold">What CEO Turbo delivered</h2>
              <ul className="mt-4 space-y-3">
                {c.delivered.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">Industry</dt>
                  <dd className="mt-0.5 font-medium">{c.industry}</dd>
                </div>
                {c.location && (
                  <div>
                    <dt className="text-muted-foreground">Area</dt>
                    <dd className="mt-0.5 font-medium">{c.location}</dd>
                  </div>
                )}
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Live site</dt>
                  <dd className="mt-0.5">
                    <a href={c.url} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center font-medium text-turbo underline underline-offset-4">
                      {domainOf(c.url)}
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="section border-t border-border" aria-labelledby="decisions">
          <div className="container-x">
            <h2 id="decisions" className="h-section">
              Why it converts
            </h2>
            <p className="lede">The design decisions on the live site, and the buyer hesitation each one removes.</p>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {c.decisions.map((d, i) => (
                <li key={d.title} className="panel p-6">
                  <span className="font-display text-sm font-bold text-turbo">Decision {i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold leading-snug">{d.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{d.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {c.slug === "appliance-king" && (
          <section className="section border-t border-border" aria-label="Featured result">
            <div className="container-x">
              <FeaturedResult />
            </div>
          </section>
        )}

        {(results.length > 0 || ads.length > 0) && (
          <section className="section border-t border-border" aria-labelledby="ads">
            <div className="container-x">
              <h2 id="ads" className="h-section">
                Ads we ran for {c.name}
              </h2>
              {results.length > 0 && (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r) => (
                    <ResultCard key={r.key} r={r} />
                  ))}
                </div>
              )}
              {ads.length > 0 && (
                <div className="mt-10">
                  <AdGallery ads={ads} />
                </div>
              )}
            </div>
          </section>
        )}
      </article>

      {more.length > 0 && (
        <section className="section border-t border-border" aria-labelledby="more">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 id="more" className="h-section">
                More {CATEGORY_LABEL[c.category].toLowerCase()}
              </h2>
              {audience && (
                <Link to={`/${audience.slug}`} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo">
                  How we help {audience.plural} ›
                </Link>
              )}
            </div>
            <div className="mt-10">
              <WorkGrid clients={more} />
            </div>
          </div>
        </section>
      )}

      <BookingSection note={note} title={`Want results like ${c.name}? Book a free call.`} />
    </>
  );
}
