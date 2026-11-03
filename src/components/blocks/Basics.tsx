import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { FAQ } from "@/content/services";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  lede,
  kicker,
  center = false,
  as: Tag = "h2",
}: {
  title: ReactNode;
  lede?: ReactNode;
  kicker?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {kicker && <p className="mb-3 text-sm font-medium text-turbo">{kicker}</p>}
      <Tag className={Tag === "h1" ? "text-3xl font-bold leading-[1.02] sm:text-4xl md:text-6xl" : "h-section"}>{title}</Tag>
      {lede && <p className={cn("lede", center && "mx-auto")}>{lede}</p>}
    </div>
  );
}

/** The 40–60 word answer block that AI Overviews and assistants lift. */
export function DirectAnswer({ children, label = "Short answer" }: { children: ReactNode; label?: string }) {
  return (
    <div className="panel relative mt-8 overflow-hidden p-6 sm:p-7">
      <div className="absolute inset-y-0 left-0 w-1 bg-turbo" aria-hidden />
      <p className="text-sm font-semibold text-turbo">{label}</p>
      <p className="prose-answer mt-2">{children}</p>
    </div>
  );
}

export function Breadcrumbs({ items, className }: { items: { name: string; path: string }[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {all.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-foreground/80">
                {it.name}
              </span>
            ) : (
              <Link to={it.path} className="inline-flex min-h-[44px] items-center px-1 hover:text-foreground sm:min-h-0 sm:px-0">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Native <details> FAQ: answers are in the HTML for crawlers and work without JS. */
export function FAQList({ faqs, title = "Frequently asked questions", lede = "Still unsure? Ask it on the call — that's what it's for." }: { faqs: FAQ[]; title?: string; lede?: string }) {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 id="faq-title" className="h-section">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6 py-1 text-left">
                <h3 className="font-body text-lg font-semibold tracking-normal">{f.q}</h3>
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/5 text-turbo transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 pr-10 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}
