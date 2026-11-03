// /app-marketing — Landing page for pure software developers, SaaS founders, and indie engineers.
// Focus layout (no menu or footer links to leak clicks) because this is a primary ad & campaign destination.
import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Layers,
  Zap,
  Terminal,
  ShieldCheck,
  Activity,
  GitBranch,
  Search,
  Megaphone,
  Smartphone,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats, StripeProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { FAQList } from "@/components/blocks/Basics";
import { PACKAGES, usd } from "@/content/pricing";
import { CLIENTS } from "@/content/clients";
import { BOOKING } from "@/config/site";
import { APP_MARKETING_PAINS, APP_MARKETING_SERVICES, APP_MARKETING_FAQS } from "@/content/app-marketing";
import {
  DevPipelineTerminal,
  DevStackArchitecture,
  DevFunnelCalculator,
  DevCollaborationProtocol,
} from "@/components/blocks/DevGrowthVisuals";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [Code2, Megaphone, Activity, Smartphone, RocketIcon, Search] as const;

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function AppMarketing() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-clip pt-24 pb-16 sm:pt-32 sm:pb-20" aria-label="Distribution pipeline for software developers">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />

        <div className="container-x relative">
          <div className="hero-rise relative z-10 mx-auto max-w-4xl text-center">
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-turbo/30 bg-turbo/10 px-3.5 py-1 text-xs font-mono text-turbo backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>status: 200 OK · for pure software devs & indie founders</span>
            </div>

            <h1 className="mt-5 text-[34px] font-bold leading-[1.03] sm:text-[46px] md:text-6xl lg:text-[68px]">
              <span className="text-chrome-grad">You engineered the product.</span>{" "}
              <span className="text-turbo-grad">We engineer the distribution.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              You spent hundreds of hours architecting schemas, writing clean code, and deploying to production. But code doesn't distribute itself. Marketing isn't hand-waving fluff — it's an operational pipeline of traffic ingestion, conversion edge computing, and full-funnel telemetry. We build your high-converting landing page, wire server-side CAPI attribution, and run laser-targeted Reddit and Meta ad pipelines. You stay in your IDE.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <BookButton
                note="App marketing hero dev"
                prefill="I'm a software developer. Here is my product / website / repo:"
                className="w-full sm:w-auto text-base shadow-[0_10px_35px_-8px_hsl(var(--ignite)/0.7)]"
              >
                Get My Free Growth Architecture Call <ArrowRight className="h-4 w-4" aria-hidden />
              </BookButton>
              <CallLink location="app marketing dev hero" icon className="text-sm font-semibold text-chrome transition-colors hover:text-foreground" />
            </div>

            {/* Credibility Pills */}
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="h-4 w-4 text-turbo" aria-hidden /> Zero fluff · 100% telemetry
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Layers className="h-4 w-4 text-turbo" aria-hidden /> SaaS, Mobile, DevTools, Desktop
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Zap className="h-4 w-4 text-turbo" aria-hidden /> First pipeline live in 14 days
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <GitBranch className="h-4 w-4 text-turbo" aria-hidden /> 100% IP & ad account ownership
              </span>
            </div>
          </div>

          {/* Interactive Terminal in Hero */}
          <div className="mt-12 sm:mt-16">
            <DevPipelineTerminal />
          </div>
        </div>
      </section>

      {/* PAIN POINTS — REFRAMED AS ENGINEERING BUGS */}
      <section className="section border-t border-border/80 bg-background/50" aria-labelledby="debugging-growth">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="chip mx-auto">Stack Diagnostics</p>
            <h2 id="debugging-growth" className="h-section mt-3">
              Debugging Developer Distribution
            </h2>
            <p className="lede mt-2">
              You can architect distributed systems and optimize database queries, but user acquisition feels like a broken build. It's not a skill deficit — it's 4 common runtime bugs that trap almost every technical founder.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {APP_MARKETING_PAINS.map((p) => (
              <div key={p.tag} className="panel flex flex-col justify-between p-5 sm:p-6 transition-all hover:border-turbo/40">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-400">
                      {p.tag}
                    </span>
                    <AlertCircle className="h-4 w-4 text-rose-400/80" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold sm:text-xl text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>

                {p.codeSnippet && (
                  <div className="mt-4 rounded-lg bg-black/60 p-3 font-mono text-xs text-rose-300/90 ring-1 ring-white/5">
                    <code>{p.codeSnippet}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE SCHEMATIC */}
      <section className="section border-t border-border" aria-label="System Architecture">
        <div className="container-x">
          <DevStackArchitecture />
        </div>
      </section>

      {/* INTERACTIVE UNIT ECONOMICS CALCULATOR */}
      <section className="section border-t border-border bg-gradient-to-b from-background via-card/20 to-background" aria-label="Unit Economics Debugger">
        <div className="container-x">
          <DevFunnelCalculator />
        </div>
      </section>

      {/* THE 6 ENGINEERED DELIVERABLES */}
      <section className="section border-t border-border" aria-labelledby="engineered-services">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="chip mx-auto">Engineered Deliverables</p>
            <h2 id="engineered-services" className="h-section mt-3">
              The 6 Core Components of Your Growth Pipeline
            </h2>
            <p className="lede mt-2">
              Everything from your conversion landing page to server-side attribution — designed with software rigor, tracked end-to-end, and optimized for real revenue.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {APP_MARKETING_SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[i] || Code2;
              return (
                <div key={s.id} className="panel flex flex-col justify-between p-6 transition-all hover:shadow-[0_0_30px_-10px_hsl(var(--turbo)/0.3)] hover:border-turbo/50">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/10 text-turbo ring-1 ring-turbo/20">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">SYS_0{i + 1}</span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
                    <div className="mt-1">
                      <span className="inline-block rounded bg-turbo/10 px-2 py-0.5 font-mono text-[11px] font-medium text-turbo">
                        {s.tag}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

                    <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs leading-normal text-muted-foreground">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-turbo" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <BookButton
              note="App marketing services"
              prefill="I'm a developer — tell me which distribution components my app or SaaS needs"
              className="w-full sm:w-auto"
            >
              Analyze What My Stack Needs <ArrowRight className="h-4 w-4" aria-hidden />
            </BookButton>
            <span className="text-xs text-muted-foreground font-mono">
              Free 30-min architecture call · No sales pitch deck · Written plan provided
            </span>
          </div>
        </div>
      </section>

      {/* DEVELOPER COLLABORATION PROTOCOL */}
      <section className="section border-t border-border bg-background/50" aria-label="Collaboration Protocol">
        <div className="container-x">
          <DevCollaborationProtocol />
        </div>
      </section>

      {/* SOCIAL PROOF & STRIPE RECEIPTS */}
      <section className="section border-t border-border pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <p className="chip mx-auto">Deterministic Proof</p>
            <h2 className="h-section mt-3">Verified Revenue & Ad Receipts</h2>
            <p className="lede mt-2">
              We don't show Figma mockups or vanity impressions. We track real unit economics and verified Stripe numbers.
            </p>
          </div>
          <ProofStats />
        </div>
      </section>

      <section className="pb-16 sm:pb-24" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof
            compact={false}
            title="We treat distribution like software engineering. Here are the receipts."
            lede="Most agencies show unverified slide decks. This is CEO Turbo's own Stripe: over $173,000 collected. We build real distribution pipelines for technical founders, SaaS builders, and software developers who demand measurable unit economics."
          />
        </div>
      </section>

      {/* PRICING SNAPSHOT */}
      <section className="section border-t border-border" aria-labelledby="pricing">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="chip mx-auto">Predictable Pricing</p>
            <h2 id="pricing" className="h-section mt-3">
              Clear Prices. Zero "Book an Enterprise Demo" Runaround.
            </h2>
            <p className="lede mt-2">
              One setup fee to build and instrument your complete distribution pipeline. Monthly only where ongoing ad management keeps generating positive ROI.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <li
                key={p.id}
                className={cn(
                  "panel relative flex flex-col p-6 transition-all",
                  p.popular && "ring-1 ring-turbo shadow-[0_0_35px_-10px_hsl(var(--turbo)/0.3)]"
                )}
              >
                {p.popular && (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-turbo px-3 py-1 font-mono text-xs font-bold text-background">
                    Recommended for Devs & SaaS
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{p.name.split(" — ")[0]}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.popular
                    ? "Landing page, ASO, ad pipelines, CAPI tracking — the complete growth stack"
                    : p.id === "pkg-start"
                    ? "Telemetry instrumentation, SEO/AEO index, and first ad campaign"
                    : "Omnichannel category dominance & continuous experimentation"}
                </p>
                <div className="mt-5 border-t border-border/70 pt-4">
                  <p className="font-display text-4xl font-bold tracking-tight text-chrome-grad">{usd(p.price)}</p>
                  <p className="mt-1 text-xs font-mono text-muted-foreground">one-time setup fee</p>
                </div>

                <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  {p.includes.slice(0, 4).map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-turbo" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  <BookButton
                    note={`App marketing pricing ${p.id}`}
                    prefill={`I'm interested in the ${p.name.split(" — ")[0]} package (${usd(p.price)}) for my software product.`}
                    className="w-full text-sm"
                  >
                    Select Plan
                  </BookButton>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link to="/pricing" className="btn-chrome">
              See Full Pricing Breakdown <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQList faqs={APP_MARKETING_FAQS} title="Technical & Operational Questions Devs Ask Us" />

      {/* BOOKING */}
      <BookingSection
        note="App marketing dev page"
        title="Get your product's growth architecture blueprint. 6 taps, then a free call."
        prefill="I'm a software developer. Here is my product / website / repo:"
      />
    </>
  );
}
