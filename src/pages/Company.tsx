import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SITE, BOOKING, fromPriceLabel } from "@/config/site";
import { CLIENTS, clientBySlug } from "@/content/clients";
import { AD_TOTALS, money } from "@/content/results";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { BookingSection, Founder, PathPicker, ServiceGrid } from "@/components/blocks/Sales";
import { ProofStats, WorkGrid, GSCProof } from "@/components/blocks/Proof";
import { CallLink } from "@/components/site/CallLink";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Breadcrumbs, DirectAnswer, SectionHeader } from "@/components/blocks/Basics";

export function About() {
  const milestones = [
    { v: "50+", l: "websites built" },
    { v: String(CLIENTS.length), l: "client sites live today" },
    { v: String(AD_TOTALS.leads), l: "Meta leads for clients, Jul–Oct 2026" },
    { v: "2", l: "companies founded" },
  ];
  return (
    <>
      <section className="pt-28 sm:pt-32">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
          <SectionHeader as="h1" title="About CEO Turbo and Christopher Robinson" />
          <DirectAnswer label="In short">
            CEO Turbo is an Atlanta-based growth agency founded by Christopher Robinson, known online as StackmodeChris. It builds websites, runs Meta, Google, TikTok and X ads, optimizes Google Business Profiles and social profiles, designs promotional emails, and does SEO, AEO and GEO for artists, local service businesses and Shopify stores.
          </DirectAnswer>
          <div className="mt-16">
            <Founder />
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.l} className="bg-background p-6">
                <dd className="font-display text-4xl font-bold text-chrome-grad">{m.v}</dd>
                <dt className="mt-1 text-sm text-muted-foreground">{m.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="why">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="why" className="h-section">
              Why CEO Turbo exists
            </h2>
            <p className="prose-answer mt-6">
              Most small businesses and independent artists don't lose customers because their work is bad. They lose them because nobody can find them, their profiles look abandoned, or their website doesn't make the next step obvious. CEO Turbo fixes the whole path — found, trusted, chosen — instead of selling one disconnected piece.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Christopher also founded{" "}
              <a href="https://stackmode.net" target="_blank" rel="noopener" className="text-turbo underline underline-offset-4">
                Stackmode Academy
              </a>
              , which teaches web design, AI, trading and business skills. Much of what CEO Turbo does for clients is tested on Stackmode first — including the SEO, AEO and GEO work in the Search Console graph below.
            </p>
          </div>
          <GSCProof />
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-x">
          <SectionHeader title="Who we help" />
          <div className="mt-10">
            <PathPicker />
          </div>
        </div>
      </section>
      <BookingSection note="About page" />
    </>
  );
}

export function Contact() {
  return (
    <>
      <section className="pt-28 sm:pt-32">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
          <SectionHeader as="h1" title="Contact CEO Turbo" lede="The fastest way to reach us is to book a free Brand Boost call — you'll talk to Christopher directly." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="panel flex flex-col p-6">
              <h2 className="text-xl font-semibold">Grow your business</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">Websites, ads, Google profile, SEO, AEO and GEO. {BOOKING.length}, free.</p>
              <BookButton note="Contact page" className="mt-6">
                Book a Brand Boost call
              </BookButton>
            </div>
            <div className="panel flex flex-col p-6">
              <h2 className="text-xl font-semibold">Get more Google reviews</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">NFC Google review cards, from {fromPriceLabel}. Customers tap and your review form opens.</p>
              <ShopCardsButton className="mt-6">Shop review cards</ShopCardsButton>
            </div>
            <div className="panel flex flex-col p-6">
              <h2 className="text-xl font-semibold">Mailing address</h2>
              <address className="mt-2 flex-1 text-sm not-italic leading-relaxed text-muted-foreground">
                {SITE.name}
                <br />
                {SITE.address.streetAddress}
                <br />
                {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
              </address>
              <a href="https://www.instagram.com/ceoturbo_/" target="_blank" rel="noopener" className="btn-chrome mt-6">
                DM us on Instagram <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="panel mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Call or text us</h2>
              <p className="mt-1 text-sm text-muted-foreground">Questions about a project or a review card order? Talk to a real person.</p>
              <CallLink location="contact page" icon className="mt-3 font-display text-2xl font-bold text-foreground hover:text-turbo" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Follow {SITE.name}</p>
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>
      <BookingSection note="Contact page" />
    </>
  );
}

export function Atlanta() {
  const georgia = ["oj-junk-removal", "kingstone-landscaping", "cleardump", "appliance-king", "7uvhavin", "yari-beats"]
    .map(clientBySlug)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Atlanta", path: "/atlanta" }]} />
          <SectionHeader as="h1" title="Atlanta marketing agency for local businesses and artists" />
          <DirectAnswer label="CEO Turbo in Atlanta">
            CEO Turbo is a growth agency based in Atlanta, Georgia. We build websites, run Meta and Google ads, optimize Google Business Profiles and do SEO, AEO and GEO for Georgia businesses and artists — {georgia.length} of our live client sites are in Georgia, from metro Atlanta junk removal to North Georgia landscaping and Atlanta producers.
          </DirectAnswer>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton note="Atlanta page">Book a free call</BookButton>
            <Link to="/local-business" className="btn-chrome">
              Local business services
            </Link>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="ga-work">
        <div className="container-x">
          <SectionHeader title={<span id="ga-work">Georgia clients we've built for</span>} lede="Metro Atlanta, Gwinnett County, North Georgia, Macon and Barnesville." />
          <div className="mt-10">
            <WorkGrid clients={georgia} />
          </div>
        </div>
      </section>
      <section className="section border-t border-border">
        <div className="container-x">
          <SectionHeader title="What we do for Atlanta businesses" />
          <div className="mt-10">
            <ServiceGrid slugs={["google-business-profile", "website-design", "meta-ads", "google-ads", "seo-aeo-geo"]} />
          </div>
          <div className="mt-14">
            <ProofStats />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Meta leads averaged {money(AD_TOTALS.avgCpl)} across our recent local campaigns. See the{" "}
            <Link to="/results" className="text-turbo underline underline-offset-4">
              unedited dashboards
            </Link>
            .
          </p>
        </div>
      </section>
      <BookingSection note="Atlanta page" />
    </>
  );
}
