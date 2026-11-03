import { Link } from "react-router-dom";
import { AD_RESULTS, AD_TOTALS, GOOGLE_AD_RESULT, GOOGLE_AD_RESULTS, money } from "@/content/results";
import { ADS } from "@/content/ads";
import { AdResultsGrid, AdGallery, BestResults, GSCProof, FeaturedResult, GoogleAdProof, StripeProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { SectionHeader, Breadcrumbs, DirectAnswer } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";

export default function Results() {
  const leads = AD_RESULTS.filter((r) => r.metric === "Leads").sort((a, b) => a.costPer - b.costPer);
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Results", path: "/results" }]} />
          <SectionHeader
            as="h1"
            title="Real results, straight from the dashboards"
            lede="No cherry-picked case-study graphics. These are unedited Google Ads, Meta Ads Manager and Google Search Console screenshots from client and in-house campaigns, July–October 2026."
          />
          <DirectAnswer label="The numbers">
            Across {AD_TOTALS.campaigns} Meta lead campaigns, CEO Turbo clients got {AD_TOTALS.leads} leads for {money(AD_TOTALS.leadSpend)} — {money(AD_TOTALS.avgCpl)} per lead on average, with the best at {money(AD_TOTALS.lowestCpl)}. On Google Search, {GOOGLE_AD_RESULT.client} got {GOOGLE_AD_RESULT.conversions} conversions for {money(GOOGLE_AD_RESULT.spent)} in one day ({money(GOOGLE_AD_RESULT.costPer)} each). An artist profile campaign drove 165 visits at $0.32 each, and stackmode.net reached 3.34K Google impressions.
          </DirectAnswer>
        </div>
      </section>

      <section className="pb-8 pt-10" aria-labelledby="best">
        <div className="container-x">
          <h2 id="best" className="h-section">Our cheapest results right now</h2>
          <p className="lede">Appliance King, appliance repair in Macon GA. Same client: Google Ads, Meta ads and SEO, all on small budgets.</p>
          <div className="mt-8">
            <BestResults />
          </div>
        </div>
      </section>

      <section className="pb-8 pt-10" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof />
        </div>
      </section>

      <section className="pb-4" aria-label="Featured client result">
        <div className="container-x">
          <FeaturedResult />
          <div className="mt-12">
            <GoogleAdProof result={GOOGLE_AD_RESULTS[1]} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="table">
        <div className="container-x">
          <h2 id="table" className="h-section">
            Every lead campaign, cheapest first
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Meta lead-form campaign results</caption>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Client &amp; campaign</th>
                  <th className="px-2 py-3 sm:px-4 font-medium">Leads</th>
                  <th className="px-2 py-3 sm:px-4 font-medium">Cost per lead</th>
                  <th className="px-2 py-3 sm:px-4 font-medium">Spend</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((r) => (
                  <tr key={r.key} className="border-b border-border/60">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      {r.clientSlug ? (
                        <Link to={`/portfolio/${r.clientSlug}`} className="hover:text-turbo">
                          {r.client}
                        </Link>
                      ) : (
                        r.client
                      )}
                      <span className="block text-xs font-normal text-muted-foreground">{r.campaign}</span>
                    </th>
                    <td className="px-2 py-3 sm:px-4">{r.count}</td>
                    <td className="px-2 py-3 sm:px-4 font-semibold text-turbo">{money(r.costPer)}</td>
                    <td className="px-2 py-3 sm:px-4">{money(r.spent)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-3 pr-4 font-semibold">Total</th>
                  <td className="px-2 py-3 sm:px-4 font-semibold">{AD_TOTALS.leads}</td>
                  <td className="px-2 py-3 sm:px-4 font-semibold text-turbo">{money(AD_TOTALS.avgCpl)} avg</td>
                  <td className="px-2 py-3 sm:px-4 font-semibold">{money(AD_TOTALS.leadSpend)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            What drove the cheapest leads? Read{" "}
            <Link to="/guides/facebook-ads-cost-per-lead" className="text-turbo underline underline-offset-4">
              our breakdown of Facebook lead costs
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="dash">
        <div className="container-x">
          <SectionHeader title={<span id="dash">The dashboards</span>} lede="Click any card to open the full screenshot." />
          <div className="mt-10">
            <AdResultsGrid />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="seo">
        <div className="container-x">
          <SectionHeader title={<span id="seo">SEO, AEO &amp; GEO: Search Console</span>} />
          <div className="mt-10">
            <GSCProof />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="creative">
        <div className="container-x">
          <SectionHeader title={<span id="creative">{ADS.length} ad creatives we designed</span>} lede="Local services, stores, coaches and real estate — every one built around a single hook and one action." />
          <div className="mt-10">
            <AdGallery ads={ADS} />
          </div>
          <div className="mt-10">
            <BookButton note="Results page">Get ads like these</BookButton>
          </div>
        </div>
      </section>

      <BookingSection note="Results page" />
    </>
  );
}
