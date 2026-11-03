import { Link } from "react-router-dom";
import { CompareTable } from "@/components/blocks/CompareTable";
import { ShirtMaker } from "@/components/shirts/ShirtMaker";
import { Breadcrumbs, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { SHIRT_COMPARE, SHIRT_FAQS, SHIRT_SIZE_CHART, SHIRT_STEPS, SHIRT_USES, SHIRTS_PATH, shirtFromLabel } from "@/content/company-shirts";
import { SHOP_PATH } from "@/content/review-cards";
import { SHIRT } from "@/config/site";

const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function CompanyShirts() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Custom company t-shirts", path: SHIRTS_PATH }]} />
          <ShirtMaker />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader kicker="How it works" title={<span id="how">Your logo on your crew in 3 steps.</span>} lede="No quote forms, no email back-and-forth, no 24-shirt minimum. You see the shirt before you pay for it." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {SHIRT_STEPS.map((s, i) => (
              <li key={s.title} className="panel p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-turbo/10 font-display text-base font-bold text-turbo">{i + 1}</span>
                <h3 className="mt-4 font-body text-lg font-semibold tracking-normal">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <SectionHeader kicker="Who orders them" title={<span id="who">Shirts that make your business look bigger.</span>} />
            <p className="text-lg leading-relaxed text-muted-foreground">
              A crew in matching logo shirts looks like a company people trust to come into their home. Customers remember the name on the shirt, and every job-site photo carries it.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
            {SHIRT_USES.map((u) => (
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
          <SectionHeader title={<span id="compare">CEO Turbo vs. a bulk printer vs. a local shop</span>} lede="Bulk screen printing wins on 200 identical shirts. For a team of 1 to 50 with mixed sizes and a full-color logo, this is faster and there's nothing to set up." />
          <CompareTable className="mt-10" head={["", "CEO Turbo", "Bulk screen printer", "Local print shop"]} rows={SHIRT_COMPARE.map((r) => [...r])} highlight={1} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="sizes">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeader kicker="Fit" title={<span id="sizes">Unisex sizes S–3XL, true to size.</span>} lede={`${SHIRT.styles[0].blank}. Long sleeve: ${SHIRT.styles[1].blank.split(" — ")[0]}. Measure a shirt you like lying flat and match the chest width.`} />
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

      <FAQList faqs={SHIRT_FAQS} title="Company shirt questions" />

      <section className="section border-t border-border" aria-labelledby="go">
        <div className="container-x">
          <div className="cta-glow relative overflow-hidden rounded-3xl p-7 text-center sm:p-12">
            <h2 id="go" className="h-section">
              Your logo. Your crew. From {shirtFromLabel} a shirt.
            </h2>
            <p className="lede mx-auto">Two minutes to design, free shipping, a real person checks it before it prints.</p>
            <button type="button" onClick={toTop} className="btn-ignite btn-shine mt-6">
              Design my shirts
            </button>
            <p className="mt-6 text-sm text-muted-foreground">
              Getting your team in uniform? Get the reviews to match:{" "}
              <Link to={SHOP_PATH} className="text-foreground underline underline-offset-4 hover:text-turbo">
                NFC Google review cards
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        Only upload logos you own or have permission to use. Every design is checked by our team, then printed by our US print partner and shipped to you. See{" "}
        <Link to="/shipping-returns" className="underline underline-offset-2">
          shipping &amp; returns
        </Link>
        .
      </p>
    </>
  );
}
