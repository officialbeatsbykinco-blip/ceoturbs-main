import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Landmark, CreditCard } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { CLIENTS, CATEGORY_LABEL, domainOf, type Category, type Client } from "@/content/clients";
import { AD_RESULTS, AD_TOTALS, GSC, APPLIANCE_KING_PAGE, APPLIANCE_KING_GSC, FEATURED_RESULT, GOOGLE_AD_RESULT, STRIPE, money, type AdResult, type GoogleAdResult, type GscResult } from "@/content/results";
import type { AdCreative } from "@/content/ads";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/visuals/CountUp";
import { useInView } from "@/components/visuals/ReviewVisuals";

export function ProofStats() {
  const stats = [
    { value: String(CLIENTS.length), label: "client websites live right now" },
    { value: String(AD_TOTALS.leads), label: `Meta leads at ${money(AD_TOTALS.avgCpl)} average` },
    { value: money(AD_TOTALS.lowestCpl), label: "lowest cost per lead" },
    { value: money(GOOGLE_AD_RESULT.costPer), label: `per Google Ads conversion (${GOOGLE_AD_RESULT.client})` },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-background/95 p-5 sm:p-6">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-2xl font-bold tracking-tight text-chrome-grad sm:text-3xl md:text-4xl">
            <CountUp value={s.value} />
          </dd>
          <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BrowserShot({ client, eager = false, large = false }: { client: Client; eager?: boolean; large?: boolean }) {
  return (
    <div className="force-dark overflow-hidden rounded-xl bg-[#0b0f16] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate text-[11px] text-muted-foreground">{domainOf(client.url)}</span>
      </div>
      <img
        src={large ? `/img/work/${client.slug}.webp` : `/img/work/${client.slug}-640.webp`}
        srcSet={`/img/work/${client.slug}-640.webp 640w, /img/work/${client.slug}-960.webp 960w, /img/work/${client.slug}.webp 1600w`}
        sizes={large ? "(min-width: 1200px) 1150px, calc(100vw - 32px)" : "(min-width: 1024px) 360px, (min-width: 640px) 45vw, calc(100vw - 32px)"}
        alt={`${client.name} ${client.industry.toLowerCase()} website homepage, designed and built by CEO Turbo`}
        width={1600}
        height={1000}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
        decoding="async"
        className="aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

export function WorkGrid({ clients = CLIENTS, filterable = false, limit }: { clients?: Client[]; filterable?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = (filter === "all" ? clients : clients.filter((c) => c.category === filter)).slice(0, limit);
  const cats = (Object.keys(CATEGORY_LABEL) as Category[]).filter((c) => clients.some((cl) => cl.category === c));

  return (
    <div>
      {filterable && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter work by type">
          {(["all", ...cats] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === c ? "bg-foreground text-background" : "bg-white/5 text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "all" ? `All ${clients.length}` : `${CATEGORY_LABEL[c]} (${clients.filter((cl) => cl.category === c).length})`}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <li key={c.slug} className="group">
            <Link to={`/portfolio/${c.slug}`} className="block">
              <div className="transition-transform duration-300 group-hover:-translate-y-1">
                <BrowserShot client={c} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {c.industry}
                    {c.location ? ` · ${c.location.split(",")[0]}` : ""}
                  </p>
                </div>
                <span className="mt-1 shrink-0 whitespace-nowrap text-sm font-medium text-turbo opacity-80 group-hover:opacity-100">Case study</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultCard({ r }: { r: AdResult }) {
  const name = r.clientSlug ? (
    <Link to={`/portfolio/${r.clientSlug}`} className="hover:text-turbo">
      {r.client}
    </Link>
  ) : (
    r.client
  );
  return (
    <article className="panel flex flex-col overflow-hidden">
      <div className="p-5">
        <p className="text-sm text-muted-foreground">{name}</p>
        <h3 className="mt-0.5 text-base font-semibold tracking-tight">{r.campaign}</h3>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{r.count}</p>
            <p className="text-xs text-muted-foreground">{r.metric.toLowerCase()}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-turbo">{money(r.costPer)}</p>
            <p className="text-xs text-muted-foreground">per {r.metric === "Leads" ? "lead" : r.metric === "Checkouts started" ? "checkout" : "visit"}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground/80">{money(r.spent)}</p>
            <p className="text-xs text-muted-foreground">spent</p>
          </div>
        </div>
        {r.peer && <p className="mt-4 rounded-lg bg-turbo/10 px-3 py-2 text-xs leading-snug text-turbo">Meta benchmark: {r.peer}</p>}
      </div>
      <a href={r.image} target="_blank" rel="noopener" className="mt-auto block border-t border-border bg-white/[0.02]">
        <img src={r.image.replace(".webp", "-600.webp")} srcSet={`${r.image.replace(".webp", "-600.webp")} 600w, ${r.image} 1100w`} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" alt={`Meta Ads Manager dashboard: ${r.client} ${r.campaign}, ${r.count} ${r.metric.toLowerCase()} at ${money(r.costPer)} each`} loading="lazy" decoding="async" width={600} height={545} className="h-auto w-full" />
        <span className="flex min-h-[44px] items-center gap-1 px-5 py-2.5 text-xs text-muted-foreground">
          View the full dashboard <ArrowUpRight className="h-3 w-3" />
        </span>
      </a>
    </article>
  );
}

/** An Appliance King Google Search result: the screenshot plus the three numbers that matter. Defaults to the best one. */
export function GoogleAdProof({ compact = false, result = GOOGLE_AD_RESULT }: { compact?: boolean; result?: GoogleAdResult }) {
  const g = result;
  const stats = [
    { v: String(g.conversions), l: "conversions" },
    { v: money(g.costPer), l: "per conversion" },
    { v: money(g.spent), l: "spent" },
  ];
  const detail = [`${g.clicks} clicks`, g.ctr && `${g.ctr} click rate`, g.cpc && `${money(g.cpc)} per click`].filter(Boolean).join(", ");
  return (
    <article className={cn("panel overflow-hidden", !compact && "grid items-center lg:grid-cols-[0.8fr_1.2fr]")}>
      <div className="p-5 sm:p-6">
        <p className="text-sm font-medium text-turbo">
          Google Ads · <Link to={`/portfolio/${g.clientSlug}`} className="underline-offset-4 hover:underline">{g.client}</Link>
        </p>
        <h3 className="mt-1 font-display text-lg font-bold sm:text-xl">{g.headline}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {g.campaign} · {g.period} · {detail}. Conversions as reported by Google Ads.
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          {stats.map((x) => (
            <div key={x.l}>
              <dd className="font-display text-2xl font-bold text-chrome-grad sm:text-3xl">{x.v}</dd>
              <dt className="mt-0.5 text-xs text-muted-foreground">{x.l}</dt>
            </div>
          ))}
        </dl>
      </div>
      <a href={g.image} target="_blank" rel="noopener" className={cn("block bg-white", compact ? "border-t border-border" : "border-t border-border lg:border-l lg:border-t-0")}>
        <img
          src={g.width > 900 ? g.image.replace(".webp", "-900.webp") : g.image}
          srcSet={g.width > 900 ? `${g.image.replace(".webp", "-900.webp")} 900w, ${g.image} 2000w` : undefined}
          sizes={g.width > 900 ? "(min-width: 1024px) 640px, 92vw" : undefined}
          alt={`Google Ads dashboard: ${g.client} ${g.campaign}, ${g.conversions} conversions at ${money(g.costPer)} each, ${money(g.spent)} spent`}
          loading="lazy"
          decoding="async"
          width={g.width}
          height={g.height}
          className="h-auto w-full"
        />
        <span className="flex min-h-[44px] items-center gap-1 bg-background px-5 py-2.5 text-xs text-muted-foreground">
          View the full dashboard <ArrowUpRight className="h-3 w-3" />
        </span>
      </a>
    </article>
  );
}

/** The two cheapest, newest Appliance King results side by side: Google conversions and Meta website leads. */
export function BestResults() {
  const meta = AD_RESULTS.find((r) => r.key === "appliance-king-website");
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <GoogleAdProof compact />
      {meta && <ResultCard r={meta} />}
      <div className="lg:col-span-2">
        <GSCProof result={APPLIANCE_KING_GSC} />
      </div>
    </div>
  );
}

export function AdResultsGrid({ keys, cheapestFirst = false }: { keys?: string[]; cheapestFirst?: boolean }) {
  const base = keys ? AD_RESULTS.filter((r) => keys.includes(r.key)) : AD_RESULTS;
  const rows = cheapestFirst ? [...base].sort((a, b) => Number(b.metric === "Leads") - Number(a.metric === "Leads") || a.costPer - b.costPer) : base;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <ResultCard key={r.key} r={r} />
      ))}
    </div>
  );
}

export function AdGallery({ ads }: { ads: AdCreative[] }) {
  return (
    <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4">
      {ads.map((a) => (
        <li key={a.slug} className="break-inside-avoid">
          <figure className="overflow-hidden rounded-xl bg-card ring-1 ring-white/10">
            <img src={`/img/ads/${a.slug}.webp`} srcSet={`/img/ads/${a.slug}-360.webp 360w, /img/ads/${a.slug}.webp 720w`} sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw" alt={`${a.client} ad creative: ${a.hook}`} loading="lazy" decoding="async" width={720} height={a.format === "Landscape" ? 405 : a.format === "Portrait" ? 900 : 720} className="w-full" />
            <figcaption className="px-3 py-2.5 text-xs">
              <span className="font-semibold text-foreground">{a.client}</span>
              <span className="block text-muted-foreground">{a.hook}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function GSCProof({ result = GSC }: { result?: GscResult | typeof GSC }) {
  const g = result;
  const small = g.width > 900 ? g.image.replace(".webp", "-900.webp") : g.image;
  return (
    <figure className="panel overflow-hidden">
      <img
        src={g.image}
        srcSet={g.image !== GSC.image ? `${small} 900w, ${g.image} ${g.width}w` : undefined}
        sizes={g.image !== GSC.image ? "(min-width: 1024px) 1100px, 92vw" : undefined}
        alt={`Google Search Console performance for ${g.property}: ${g.clicks} clicks, ${g.impressions} impressions, ${g.ctr} CTR, climbing after CEO Turbo's SEO, AEO and GEO work`}
        loading="lazy"
        decoding="async"
        width={g.width}
        height={g.height}
        className="w-full bg-white"
      />
      <figcaption className="grid gap-4 border-t border-border p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Google Search Console, {g.property}, {g.period}. {g.caption}
        </p>
        <dl className="flex gap-6 text-sm">
          <div>
            <dd className="font-display text-xl font-bold">{g.impressions}</dd>
            <dt className="text-xs text-muted-foreground">impressions</dt>
          </div>
          <div>
            <dd className="font-display text-xl font-bold">{g.clicks}</dd>
            <dt className="text-xs text-muted-foreground">clicks</dt>
          </div>
          <div>
            <dd className="font-display text-xl font-bold">{g.ctr}</dd>
            <dt className="text-xs text-muted-foreground">CTR</dt>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}

/** Lead proof: the Appliance King result, with the two dashboards it comes from. */
export function FeaturedResult() {
  const ad = AD_RESULTS.find((r) => r.key === "appliance-king")!;
  const pg = APPLIANCE_KING_PAGE;
  const reach = [
    { v: pg.views, l: "page views" },
    { v: pg.viewers, l: "viewers" },
    { v: pg.linkClicks, l: "link clicks" },
    { v: pg.follows, l: "new follows" },
  ];
  return (
    <div className="panel overflow-hidden p-6 sm:p-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-medium text-turbo">
            Best result · <Link to={`/portfolio/${FEATURED_RESULT.clientSlug}`} className="underline-offset-4 hover:underline">{FEATURED_RESULT.client}</Link>
          </p>
          <h2 className="h-section mt-2">{FEATURED_RESULT.headline}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{FEATURED_RESULT.note}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              { v: String(ad.count), l: "leads from the form ad" },
              { v: money(ad.costPer), l: "per lead" },
              { v: money(ad.spent), l: "ad spend" },
            ].map((x) => (
              <div key={x.l}>
                <dd className="font-display text-2xl font-bold text-chrome-grad sm:text-3xl md:text-4xl">{x.v}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{x.l}</dt>
              </div>
            ))}
          </dl>
          <dl className="mt-6 grid grid-cols-4 gap-3 border-t border-border pt-5">
            {reach.map((x) => (
              <div key={x.l}>
                <dd className="font-display text-xl font-bold text-turbo">{x.v}</dd>
                <dt className="text-xs text-muted-foreground">{x.l}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm font-semibold">What we set up</p>
          <ul className="mt-2 space-y-2">
            {FEATURED_RESULT.did.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden /> {d}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <BookButton />
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { src: ad.image, w600: "-600", w2: "", wBig: 978, h: 492, alt: `Meta Ads Manager: Appliance King lead form, ${ad.count} leads at ${money(ad.costPer)} each, ${money(ad.spent)} spent`, label: "Meta Ads Manager" },
            { src: pg.image, w600: "-600", w2: "-900", wBig: 1290, h: 1380, alt: "Appliance King Facebook page insights: 59.4K views, 26.6K viewers, 778 link clicks, 186 follows", label: "Facebook page insights" },
          ].map((i) => (
            <a key={i.src} href={i.src} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-border bg-white/[0.02]">
              <img
                src={i.src.replace(".webp", `${i.w2 || i.w600}.webp`)}
                srcSet={`${i.src.replace(".webp", `${i.w600}.webp`)} 600w, ${i.w2 ? `${i.src.replace(".webp", `${i.w2}.webp`)} 900w, ` : ""}${i.src} ${i.wBig}w`}
                sizes="(min-width: 1024px) 480px, 92vw"
                alt={i.alt}
                loading="lazy"
                decoding="async"
                width={i.wBig}
                height={i.h}
                className="h-auto w-full"
              />
              <span className="flex items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
                {i.label} <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Real payouts from CEO Turbo's Stripe, scrolling like a live feed. Static for reduced motion. */
export function PayoutFeed({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const row = (p: (typeof STRIPE.payouts)[number], i: number, hidden = false) => (
    <li key={`${hidden ? "b" : "a"}${i}`} aria-hidden={hidden || undefined} className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#635bff]/15 text-[#a5a0ff]">
        {p.to === "Visa" ? <CreditCard className="h-4 w-4" aria-hidden /> : <Landmark className="h-4 w-4" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[17px] font-bold tabular-nums">{money(p.amount)}</span>
        <span className="block truncate text-xs text-muted-foreground">
          To {p.to} ••••{p.date ? ` · ${p.date}` : ""}
        </span>
      </span>
      <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Paid</span>
    </li>
  );
  return (
    <div ref={ref} data-play={inView} className={cn("payout-feed force-dark relative overflow-hidden rounded-[1.6rem] border-[5px] border-[#1a1f29] bg-[#0b0f16] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]", className)}>
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-[#0b0f16] px-4 py-3">
        <span className="text-sm font-semibold">Payouts</span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden /> Stripe · CEO Turbo
        </span>
      </div>
      <div className="relative h-[300px] overflow-hidden sm:h-[340px]">
        <ul className="animate-feed" aria-label="Recent Stripe payouts to CEO Turbo">
          {STRIPE.payouts.map((p, i) => row(p, i))}
          {STRIPE.payouts.map((p, i) => row(p, i, true))}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0f16] to-transparent" aria-hidden />
      </div>
    </div>
  );
}

/**
 * Proof that people pay us — CEO Turbo's own Stripe numbers, not client revenue.
 * `compact` = the numbers + payout feed; full adds the unedited screenshots.
 */
export function StripeProof({ compact = false, title, lede }: { compact?: boolean; title?: string; lede?: string }) {
  const stats = [
    { v: STRIPE.gross, l: "collected in our Stripe", sub: `net volume ${STRIPE.net}` },
    { v: String(STRIPE.payments), l: "successful payments", sub: `${STRIPE.paymentsBefore} the year before` },
    { v: STRIPE.paymentsGrowth, l: "more payments than last year", sub: `net volume ${STRIPE.net} (${STRIPE.netGrowth})` },
  ];
  return (
    <div className="panel overflow-hidden p-6 sm:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-[#635bff]" aria-hidden /> Our own Stripe account · unedited
          </p>
          <h2 className="h-section mt-4">{title ?? "Businesses keep paying us. Here's the receipt."}</h2>
          <p className="lede">
            {lede ??
              "Most agencies show you a mockup. This is CEO Turbo's own Stripe: what businesses paid us over the last 12 months. People don't keep paying for something that doesn't work."}
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-5">
            {stats.map((x, i) => (
              <div key={x.l} className={i === 0 ? "col-span-2 sm:col-span-1" : ""}>
                <dd className={cn("font-display font-bold text-chrome-grad sm:text-5xl", i === 0 ? "text-4xl" : "text-[28px]")}>
                  <CountUp value={x.v} />
                </dd>
                <dt className="mt-1 text-xs font-medium text-foreground/90 sm:text-sm">{x.l}</dt>
                <dd className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{x.sub}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            Payments to CEO Turbo through Stripe. This is our revenue, not a client's profit or a promise of yours.
          </p>
        </div>
        <PayoutFeed className="mx-auto w-full max-w-[340px]" />
      </div>
      {!compact && (
        <div className="mt-8 grid gap-4 border-t border-border pt-8 md:grid-cols-[1fr_auto]">
          <ul className="grid grid-cols-2 content-start items-center gap-3">
            {STRIPE.images.map((i) => (
              <li key={i.src} className={i.w < 500 ? "" : "col-span-2"}>
                <a href={i.src} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl bg-white p-1 ring-1 ring-white/10 transition-transform hover:-translate-y-0.5">
                  {/* Real screenshots: never stretched past their own pixels, so small crops stay sharp. */}
                  <img src={i.src} alt={i.alt} width={i.w} height={i.h} loading="lazy" decoding="async" style={{ maxWidth: i.w }} className="mx-auto h-auto w-full" />
                </a>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-2 gap-3 md:w-[300px]">
            {STRIPE.lists.map((i) => (
              <li key={i.src}>
                <a href={i.src} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl bg-white ring-1 ring-white/10 transition-transform hover:-translate-y-0.5">
                  <img src={i.src} alt={i.alt} width={i.w} height={i.h} loading="lazy" decoding="async" className="h-auto w-full" />
                </a>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-1 text-xs text-muted-foreground md:col-span-2">
            Tap any screenshot to see it full size <ArrowUpRight className="h-3 w-3" />
          </p>
        </div>
      )}
    </div>
  );
}
