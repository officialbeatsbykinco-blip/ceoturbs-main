import { Link } from "react-router-dom";
import { CompareTable } from "@/components/blocks/CompareTable";
import { ShirtMaker } from "@/components/shirts/ShirtMaker";
import { Breadcrumbs, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { ARTIST_MAKER, ARTIST_MERCH_PATH, MERCH_COMPARE, MERCH_FAQS, MERCH_PROFIT, MERCH_SELL_PRICE, MERCH_STEPS, MERCH_USES, artistFromLabel } from "@/content/artist-merch";
import { SHIRT_SIZE_CHART, SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_SHIRT, money2 } from "@/config/site";

const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function ArtistMerch() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Artists", path: "/artist" }, { name: "Artist merch", path: ARTIST_MERCH_PATH }]} />
          <ShirtMaker product={ARTIST_SHIRT} copy={ARTIST_MAKER} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader kicker="How it works" title={<span id="how">From cover art to merch table in 3 steps.</span>} lede="No minimums, no screens, no emailing a print shop for a proof. You see the shirt before you pay for it." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {MERCH_STEPS.map((s, i) => (
              <li key={s.title} className="panel p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-turbo/10 font-display text-base font-bold text-turbo">{i + 1}</span>
                <h3 className="mt-4 font-body text-lg font-semibold tracking-normal">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="profit">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            kicker="The math"
            title={<span id="profit">Merch that pays for the gas.</span>}
            lede={`Sell at $${MERCH_SELL_PRICE} a shirt — what most independent artists charge at a show — and here's what you keep. Short sleeve, front print, volume discount included.`}
          />
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Merch profit at ${MERCH_SELL_PRICE} a shirt</caption>
              <thead>
                <tr className="border-b border-border bg-white/[0.02] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">You order</th>
                  <th className="px-5 py-3 font-medium">You pay / shirt</th>
                  <th className="px-5 py-3 font-medium">You keep / shirt</th>
                  <th className="px-5 py-3 font-medium">Sell out =</th>
                </tr>
              </thead>
              <tbody>
                {MERCH_PROFIT.map((r) => (
                  <tr key={r.qty} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-5 py-3 font-semibold">
                      {r.qty} shirts{r.off ? <span className="ml-1 text-xs font-normal text-emerald-300">−{Math.round(r.off * 100)}%</span> : null}
                    </th>
                    <td className="px-5 py-3 tabular-nums">{money2(r.each)}</td>
                    <td className="px-5 py-3 tabular-nums">{money2(r.keep)}</td>
                    <td className="px-5 py-3 font-semibold tabular-nums text-turbo">${r.profit.toLocaleString("en-US")} profit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <SectionHeader kicker="What artists make" title={<span id="who">Merch is the fan you can see.</span>} />
            <p className="text-lg leading-relaxed text-muted-foreground">
              A streaming play pays fractions of a cent. A fan in your shirt is a walking ad, a photo on their story and $10+ in your pocket.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
            {MERCH_USES.map((u) => (
              <div key={u.where} className="bg-background p-6">
                <h3 className="font-body text-base font-semibold tracking-normal">{u.where}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">CEO Turbo vs. a print-on-demand store vs. a screen printer</span>} lede="Print-on-demand sites are built for selling online one shirt at a time. Screen printers are built for 100 identical shirts. This is built for artists who want stock in hand." />
          <CompareTable className="mt-10" head={["", "CEO Turbo", "Print-on-demand store", "Local screen printer"]} rows={MERCH_COMPARE.map((r) => [...r])} highlight={1} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="sizes">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeader kicker="Fit" title={<span id="sizes">Unisex S–3XL, classic merch fit.</span>} lede={`${ARTIST_SHIRT.styles[0].blank}. Long sleeve: ${ARTIST_SHIRT.styles[1].blank}. Most merch tables sell M, L and XL — order those heaviest.`} />
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Shirt size chart in inches</caption>
              <thead>
                <tr className="border-b border-border bg-white/[0.02] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Chest width (in)</th>
                  <th className="px-5 py-3 font-medium">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {SHIRT_SIZE_CHART.map(([s, w, l]) => (
                  <tr key={s} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-5 py-3 font-semibold">
                      {s}
                    </th>
                    <td className="px-5 py-3 tabular-nums">{w}</td>
                    <td className="px-5 py-3 tabular-nums">{l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQList faqs={MERCH_FAQS} title="Artist merch questions" />

      <section className="section border-t border-border" aria-labelledby="go">
        <div className="container-x">
          <div className="cta-glow relative overflow-hidden rounded-3xl p-7 text-center sm:p-12">
            <h2 id="go" className="h-section">
              Your art. Your name. From {artistFromLabel} a shirt.
            </h2>
            <p className="lede mx-auto">Two minutes to design, free shipping, a real person checks it before it prints.</p>
            <button type="button" onClick={toTop} className="btn-ignite btn-shine mt-6">
              Design my merch
            </button>
            <p className="mt-6 text-sm text-muted-foreground">
              Want more people at the merch table?{" "}
              <Link to="/artist" className="text-foreground underline underline-offset-4 hover:text-turbo">
                We grow artists' listeners and bookings
              </Link>
              . Running a business instead?{" "}
              <Link to={SHIRTS_PATH} className="text-foreground underline underline-offset-4 hover:text-turbo">
                Company shirts
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        Only upload art you own or have permission to use. Every design is checked by our team, then printed by our US print partner and shipped to you. See{" "}
        <Link to="/shipping-returns" className="underline underline-offset-2">
          shipping &amp; returns
        </Link>
        .
      </p>
    </>
  );
}
