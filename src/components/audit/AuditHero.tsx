import { useState, type ReactNode } from "react";
import { ArrowDown, Check } from "lucide-react";
import { AuditTool, CATEGORY } from "./AuditTool";
import { cn } from "@/lib/utils";

/**
 * Lead-magnet hero: promise on the left, the audit on the right.
 * Once the report is ready it takes the full width so it reads like a real report.
 */
export function AuditHero({ title, lede, eyebrow, footer, source, points }: { title: ReactNode; lede: ReactNode; eyebrow: string; footer?: ReactNode; source: string; points?: ReactNode[] }) {
  const [wide, setWide] = useState(false);
  return (
    <section className="relative overflow-clip pt-20 sm:pt-28 lg:pt-32" aria-label="Free visibility audit">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
      <div className="container-x relative">
        <div className={cn("grid items-center gap-8 lg:gap-14", wide ? "lg:grid-cols-1" : "lg:grid-cols-[1.05fr_0.95fr]")}>
          {!wide && (
            <div className="hero-rise relative z-10">
              <p className="chip">{eyebrow}</p>
              <h1 className="mt-4 text-[30px] font-bold leading-[1.05] sm:mt-5 sm:text-[40px] md:text-6xl lg:text-[68px]">{title}</h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">{lede}</p>

              {/* Mobile-only trust badges to build instant ad credibility without pushing the tool down */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground sm:hidden">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Check className="h-3.5 w-3.5 text-turbo" aria-hidden /> 60-second scan
                </span>
                <span>•</span>
                <span>No credit card</span>
                <span>•</span>
                <span>Score out of 100</span>
              </div>

              {/* Desktop/Tablet category list — hidden on small mobile so the audit form is immediately visible above the fold */}
              <ul className="mt-6 hidden max-w-xl grid-cols-1 gap-2.5 sm:grid sm:grid-cols-2">
                {points
                  ? points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                        <span>{p}</span>
                      </li>
                    ))
                  : Object.entries(CATEGORY).map(([k, c]) => (
                      <li key={k} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                        <span>
                          <span className="font-semibold">{c.short}:</span> <span className="text-muted-foreground">{c.question}</span>
                        </span>
                      </li>
                    ))}
              </ul>
              {footer && <div className="mt-4 text-xs text-muted-foreground sm:mt-6 sm:text-sm">{footer}</div>}

              {/* Mobile anchor prompt */}
              <a
                href="#audit"
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-turbo/10 px-4 py-1.5 text-xs font-semibold text-turbo ring-1 ring-turbo/25 hover:bg-turbo/20 lg:hidden"
              >
                <span>Enter your business below</span>
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          )}
          <div id="audit" className={cn("relative z-10 scroll-mt-20 sm:scroll-mt-24", wide && "mx-auto w-full max-w-[920px]")}>
            <AuditTool source={source} onStageChange={(s) => setWide(s === "report")} />
          </div>
        </div>
      </div>
    </section>
  );
}
