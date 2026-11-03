import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuditHero } from "@/components/audit/AuditHero";
import { ProofStats, AdResultsGrid } from "@/components/blocks/Proof";
import { Founder, BookingSection } from "@/components/blocks/Sales";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { AUDIT_FAQS } from "@/content/faqs";
import { CLIENTS } from "@/content/clients";
import { AD_TOTALS, money } from "@/content/results";

const PILLARS = [
  { k: "SEO", t: "Get found on Google", items: ["Title, description and headings", "Readable content (not JavaScript-only)", "Mobile setup, speed and sitemap", "Indexing blocks that hide you"] },
  { k: "AEO", t: "Get quoted in AI answers", items: ["Schema markup for your business or artist", "FAQ content assistants can lift", "Phone, location and what you do — up front", "Clear section structure"] },
  { k: "GEO", t: "Get recommended by AI", items: ["ChatGPT, Perplexity and Claude crawler access", "llms.txt summary for AI tools", "Links between your site and profiles", "Presence in Wikidata, MusicBrainz and maps"] },
];

export default function FreeAudit() {
  return (
    <div className="pb-16 sm:pb-0">
      <AuditHero
        source="Free audit page"
        eyebrow="Free · about 60 seconds · no credit card"
        title={
          <>
            <span className="text-chrome-grad">Free SEO, AEO &amp; GEO audit.</span> <span className="text-turbo-grad">See what's costing you customers.</span>
          </>
        }
        lede="Type your business or artist name. We scan your website and the sources Google and AI tools trust, score you out of 100, and show you exactly what to fix first."
        footer={
          <>
            Built by the team behind {CLIENTS.length} live client sites and {AD_TOTALS.leads} Meta leads at {money(AD_TOTALS.avgCpl)} average.
          </>
        }
      />

      <section className="section" aria-labelledby="checks">
        <div className="container-x">
          <SectionHeader title={<span id="checks">What the audit checks</span>} lede="Search changed. Customers still Google you — but more and more ask ChatGPT, Gemini or Perplexity first. You need to show up in all three." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.k} className="panel group p-6 transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5),0_30px_60px_-30px_hsl(var(--turbo)/0.5)]">
                <p className="font-display text-4xl font-bold text-turbo-grad">{p.k}</p>
                <h3 className="mt-2 text-xl font-semibold">{p.t}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-turbo" aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#audit" className="btn-ignite btn-shine">
              Run my free audit <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link to="/guides/seo-vs-aeo-vs-geo" className="btn-chrome">
              SEO vs AEO vs GEO, explained
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Real ad results">
        <div className="container-x">
          <SectionHeader
            title="Real ad &amp; lead results we deliver"
            lede="From actual Meta Ads Manager dashboards. Lower cost per lead, more phone calls, and real customers for local businesses."
          />
          <div className="mt-10">
            <AdResultsGrid keys={["stackmode-repair", "mor-handy-carpet", "appliance-king"]} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      <FAQList faqs={AUDIT_FAQS} title="Audit questions" />
      <BookingSection note="Free audit page — booking section" title="Rather talk it through? Pick a time." />

      {/* Mobile floating action bar for ad visitors who scroll */}
      <aside aria-label="Quick audit" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-foreground">Free Visibility Audit</p>
            <p className="truncate text-[11px] text-muted-foreground">Takes 60s · No credit card</p>
          </div>
          <a href="#audit" className="btn-ignite btn-shine shrink-0 !px-4 !py-2.5 !text-xs font-semibold">
            Scan business <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </aside>
    </div>
  );
}
