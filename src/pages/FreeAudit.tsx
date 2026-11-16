import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuditHero } from "@/components/audit/AuditHero";
import { ProofStats, AdResultsGrid } from "@/components/blocks/Proof";
import { Founder, BookingSection } from "@/components/blocks/Sales";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { AUDIT_FAQS } from "@/content/faqs";
import { CLIENTS } from "@/content/clients";
import { AD_TOTALS, money } from "@/content/results";
import { FREE_CHECK_NAME } from "@/components/audit/AuditTool";

const PILLARS = [
  { k: "Maps", t: "Win on Google Maps", items: ["Are you on Google Maps — and open?", "Your real star rating and review count", "How many reviews you need to compete", "Review link on your site"] },
  { k: "SEO", t: "Get found on Google", items: ["Title, description and headings", "Readable content (not JavaScript-only)", "Mobile setup, speed and sitemap", "Indexing blocks that hide you"] },
  { k: "AEO", t: "Get quoted in AI answers", items: ["Schema markup for your business or artist", "FAQ content assistants can lift", "Phone, location and what you do — up front", "Clear section structure"] },
  { k: "GEO", t: "Get recommended by AI", items: ["ChatGPT, Perplexity and Claude crawler access", "llms.txt summary for AI tools", "Links between your site and profiles", "Presence in Wikidata, MusicBrainz and maps"] },
];

export default function FreeAudit() {
  return (
    <div className="pb-16 sm:pb-0">
      <AuditHero
        source="Free audit page"
        eyebrow={`${FREE_CHECK_NAME} · 60 seconds · no card`}
        title={
          <>
            <span className="text-chrome-grad">Why do customers pick your competitor?</span> <span className="text-turbo-grad">Find out free in 60 seconds.</span>
          </>
        }
        lede="Type your business name and city. We check your Google profile, reviews, website and what ChatGPT can see, and score you out of 100. You see your score before we ask for anything."
        points={[
          <><span className="font-semibold">Google Maps:</span> <span className="text-muted-foreground">your profile, rating and reviews</span></>,
          <><span className="font-semibold">Website:</span> <span className="text-muted-foreground">can Google find, read and rank it?</span></>,
          <><span className="font-semibold">AI answers:</span> <span className="text-muted-foreground">can ChatGPT, Gemini and Perplexity name you?</span></>,
          <><span className="font-semibold">Fix list:</span> <span className="text-muted-foreground">ranked by how many customers each costs you</span></>,
        ]}
        footer={
          <>
            Built by the team behind {CLIENTS.length} live client sites and {AD_TOTALS.leads} Meta leads at {money(AD_TOTALS.avgCpl)} average.
          </>
        }
      />

      <section className="section" aria-labelledby="checks">
        <div className="container-x">
          <SectionHeader title={<span id="checks">What does the free check look at?</span>} lede="Four things decide who gets the call: your Google Maps listing and reviews, your website, and whether AI assistants trust you enough to name you. The check scores all four in about 60 seconds, using your answers and a live scan of your own site." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              Run my free check <ArrowRight className="h-4 w-4" aria-hidden />
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

      <FAQList faqs={AUDIT_FAQS} title="Free check questions" />
      <BookingSection note="Free audit page — booking section" title="Rather talk it through? Pick a time." />

      {/* Mobile floating action bar for ad visitors who scroll */}
      <aside aria-label="Quick audit" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-foreground">Free Google &amp; AI check</p>
            <p className="truncate text-[11px] text-muted-foreground">60 seconds · see your score first</p>
          </div>
          <a href="#audit" className="btn-ignite btn-shine shrink-0 !px-4 !py-2.5 !text-xs font-semibold">
            Check mine <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </aside>
    </div>
  );
}
