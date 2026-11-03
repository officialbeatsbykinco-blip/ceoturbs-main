import { SITE } from "@/config/site";
import { BOOK_FAQS } from "@/content/faqs";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { BrandBoostSteps, Founder, VideoPitch } from "@/components/blocks/Sales";
import { AdResultsGrid, StripeProof, WorkGrid } from "@/components/blocks/Proof";
import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BoostHero, FitCheck, PriceTeaser, WalkAway } from "@/components/blocks/Boost";
import { BookButton } from "@/components/cta/Actions";

const SHOWCASE = ["mor-handy", "kingstone-landscaping", "bigzo"];
const SOURCE = "Brand Boost page";

export default function BrandBoost() {
  return (
    <>
      <BoostHero
        source={SOURCE}
        top={<Breadcrumbs items={[{ name: "Brand Boost call", path: "/brand-boost" }]} />}
        title={
          <>
            <span className="text-chrome-grad">Free Brand Boost call:</span> <span className="text-turbo-grad">more customers, reviews &amp; listeners</span>
          </>
        }
        lede={
          <>
            Pick a time on the calendar. It takes 30 seconds.<span className="hidden sm:inline"> {SITE.founder.name} reviews your website, Google profile, reviews, socials and ads with you — live — and hands you the fixes that bring customers fastest.</span>
          </>
        }
      />

      <section className="section pb-0" aria-labelledby="what">
        <div className="container-x max-w-4xl">
          <h2 id="what" className="h-section">
            What is a Brand Boost call?
          </h2>
          <DirectAnswer>
            Brand Boost is CEO Turbo's free 30-minute growth call for local businesses, artists and online stores. Founder {SITE.founder.name} reviews your website, Google Business Profile, reviews, social profiles and ads live, names the one change that would bring the most customers fastest, and gives you a fixed-price plan from published prices. You keep the plan whether or not you hire us.
          </DirectAnswer>
        </div>
      </section>

      <WalkAway />

      <section className="pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact />
        </div>
      </section>


      <section id="results" className="section scroll-mt-20 border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader title={<span id="proof">Does this actually work?</span>} lede={`Unedited Meta Ads Manager dashboards from client campaigns: ${AD_TOTALS.leads} leads for ${money(AD_TOTALS.leadSpend)} total.`} />
          <div className="mt-12">
            <AdResultsGrid keys={["ryan-pool", "stackmode-repair", "bigzo"]} />
          </div>
          <h3 className="mt-16 text-2xl font-bold">Sites we built that bring in customers</h3>
          <div className="mt-8">
            <WorkGrid clients={CLIENTS.filter((c) => SHOWCASE.includes(c.slug))} />
          </div>
          <div className="mt-12 text-center">
            <BookButton note={`${SOURCE} — after proof`} className="btn-shine">
              I want results like these
            </BookButton>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <SectionHeader title="Hear it from Christopher in 82 seconds" lede="How businesses get found on Google, Maps and AI assistants in 2026 — and turn that attention into customers." />
            <VideoPitch note={`${SOURCE} video`} />
          </div>
          <div className="mt-16">
            <Founder />
          </div>
        </div>
      </section>

      <FitCheck />

      <section className="section border-t border-border" aria-labelledby="next">
        <div className="container-x">
          <SectionHeader title={<span id="next">What happens after you book?</span>} />
          <div className="mt-10">
            <BrandBoostSteps />
          </div>
        </div>
      </section>

      <PriceTeaser source={SOURCE} />

      <FAQList faqs={BOOK_FAQS} title="Questions before you book?" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 className="h-section">Your free plan is one call away.</h2>
            <p className="lede mx-auto">Pick any open time. 30 minutes, free, no pressure.</p>
            <BookButton note={`${SOURCE} — final CTA`} className="btn-shine mt-8 !px-8 !py-4 !text-base">
              Schedule my free call
            </BookButton>
          </div>
        </div>
      </section>
    </>
  );
}
