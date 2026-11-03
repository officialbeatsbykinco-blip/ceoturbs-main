// /ads-not-converting — the "why aren't my ads converting?" offer: free call → Conversion Rescue (one-time fix)
// → Tracking Watch (small monthly). Everything priced here reads from content/pricing.ts, and every number about
// our own results comes from content/results.ts, so nothing on this page can drift or be invented.
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bug, Eye, Gauge, MousePointerClick, Repeat, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";
import { ALL_PRICES, price } from "@/content/pricing";
import { PriceCard } from "@/components/blocks/PriceBlocks";
import { AD_TOTALS, money } from "@/content/results";
import { WasteCalculator } from "@/components/blocks/WasteCalculator";
import { AdResultsGrid, GoogleAdProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import { Reveal } from "@/components/blocks/Tutorial";
import { ADS_NOT_CONVERTING_FAQS } from "@/content/faqs";

const SOURCE = "Ads not converting page";
const OFFER = ["conversion-rescue", "tracking-watch"].map((id) => ALL_PRICES.find((p) => p.id === id)!);

const BROKEN = [
  { icon: MousePointerClick, t: "Clicks, but no conversions recorded", b: "The ad platform can't see a call, form, booking or purchase, so it can't find more people like them." },
  { icon: Repeat, t: "Conversions counted twice", b: "Browser and server events, GA4 imports and tag manager tags all firing for the same lead, so the reports look better than reality." },
  { icon: BarChart3, t: "Every conversion worth the same", b: "A $20 form fill and a $2,000 booked call are treated as equal, so budget goes to the wrong searches." },
  { icon: Bug, t: "Broken or half-installed pixels", b: "Meta Pixel without the Conversions API, a tag manager container with nothing published, UET that never verified." },
  { icon: Gauge, t: "Junk searches eating the budget", b: "Jobs, free, DIY and competitor-research searches clicking your ads because nobody reads the search terms." },
  { icon: ShoppingCart, t: "Store feeds disapproved", b: "Merchant Center errors keep your products out of Google and Microsoft Shopping while you pay for traffic." },
];

const STEPS = [
  { n: "1", t: "Audit", b: "We open every account: GA4, Google Tag Manager, Microsoft Clarity, Meta, Google Ads, Microsoft Ads and Merchant Center. You get a written list of what is broken and what is wasting money." },
  { n: "2", t: "Fix", b: "We repair and test every event on your live site, set conversion values for your business, remove double counting and clean up junk searches." },
  { n: "3", t: "Watch", b: "Optional: Tracking Watch checks the tags, pixels and search terms every month, so the leak doesn't come back." },
];

export default function AdsNotConverting() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-ignite opacity-60" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Ads not converting?", path: "/ads-not-converting" }]} />
          <SectionHeader
            as="h1"
            title={
              <>
                Your ads aren't broken. <span className="text-turbo-grad">They're blindfolded.</span>
              </>
            }
            lede="When Google, Microsoft and Meta can't see who calls, books or buys, they can't find you more of them, and you keep paying for clicks that go nowhere. We fix the measurement first, then stop the wasted spend."
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton note={`${SOURCE} · hero`}>Find my wasted spend, free call</BookButton>
            <a href="#price" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See the price <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <DirectAnswer label="The short version">
            Conversion Rescue ({price("conversion-rescue")} one-time) audits and fixes your GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft conversions, with real values and a wasted-spend fix list. Tracking Watch ({price("tracking-watch")}/mo) keeps it clean. Both are included in every CEO Turbo setup package.
          </DirectAnswer>
        </div>
      </section>

      <section className="section" aria-labelledby="cost">
        <div className="container-x">
          <SectionHeader
            title={<span id="cost">Wasting ad spend costs more than fixing it.</span>}
            lede="Ad spend is a bill you pay every month. A leak in it gets paid every month too. The fix is paid once, and a small monthly plan keeps it from coming back. Try your own numbers."
          />
          <div className="mt-10">
            <WasteCalculator source={SOURCE} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="broken">
        <div className="container-x">
          <SectionHeader title={<span id="broken">What's usually broken</span>} lede="Most accounts we open have at least a few of these. You can't see them from inside the ad platform, which is why the spend keeps leaking." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BROKEN.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 60} className="panel p-5">
                <x.icon className="h-5 w-5 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works: audit, fix, watch</span>} lede="GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel + Conversions API, Google Ads, Microsoft UET and Merchant Center, all set up and tested by the same person." />
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="panel p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-display text-lg font-bold text-background">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            {[
              { icon: Eye, t: "You see everything", b: "Clarity recordings and GA4 show what visitors actually do before they book or leave." },
              { icon: Wrench, t: "No passwords", b: "You invite us as an admin or partner. You own the accounts and can remove us any time." },
              { icon: ShieldCheck, t: "Tested live", b: "Every call, form, booking and purchase event is fired on your real site and checked before we call it done." },
            ].map((x) => (
              <li key={x.t} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                <span>
                  <span className="block font-semibold">{x.t}</span>
                  <span className="text-muted-foreground">{x.b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="price" className="section scroll-mt-20 border-t border-border" aria-labelledby="pricing">
        <div className="container-x">
          <SectionHeader title={<span id="pricing">Priced so it's an easy yes</span>} lede="Fix it once, then keep it clean for less than a dinner out. No contracts, and ad spend is paid by you straight to the platform." />
          <ul className="mt-10 grid gap-5 pt-3 md:grid-cols-2">
            {OFFER.map((p) => (
              <PriceCard key={p.id} p={p} />
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Want the whole setup (website, SEO, profiles, email and ads)? Conversion Rescue is already included in every{" "}
            <Link to="/pricing" className="font-semibold text-turbo underline-offset-4 hover:underline">
              setup package
            </Link>
            , from {price("pkg-start")}. Turbo Care, Growth and Scale already include Tracking Watch.
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader
            title={<span id="proof">We do this for our own ads first</span>}
            lede={`Across ${AD_TOTALS.campaigns} recent lead campaigns we ran for clients, tracked end to end: ${AD_TOTALS.leads} leads for ${money(AD_TOTALS.leadSpend)} in ad spend, about ${money(AD_TOTALS.avgCpl)} a lead. Results vary by business, and tracking is what lets you see yours.`}
          />
          <div className="mt-10">
            <GoogleAdProof />
          </div>
          <div className="mt-8">
            <AdResultsGrid />
          </div>
        </div>
      </section>

      <FAQList faqs={ADS_NOT_CONVERTING_FAQS} />

      <BookingSection title="See where your ad money is going. Book a free call." note={`${SOURCE} · booking`} primary />
    </>
  );
}
