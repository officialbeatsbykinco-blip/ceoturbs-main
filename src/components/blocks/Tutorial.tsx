// Building blocks for the scroll-along tutorial pages filmed for 9:16 ads (/how-to-get-more-customers, /get-more-reviews):
// a sticky "Step 2 of 5" rail, big step headings and count-up stats sized for a phone-width crop.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check } from "lucide-react";
import { CountUp } from "@/components/visuals/CountUp";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

export type TutorialStep = { id: string; label: string; title: string };

/**
 * Which step is on screen (for the rail) + one `eventName` per step so Clarity/GA show scroll depth.
 * A step counts only after it has been on screen for a moment, so a "skip ahead" fly-past isn't a view.
 */
export function useActiveStep(steps: readonly TutorialStep[], eventName: string) {
  const [active, setActive] = useState(-1);
  const seen = useRef(new Set<string>());
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = steps.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const timers = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (!e.isIntersecting) {
            clearTimeout(timers.get(id));
            continue;
          }
          const i = steps.findIndex((s) => s.id === id);
          setActive(i);
          if (seen.current.has(id)) continue;
          timers.set(
            id,
            window.setTimeout(() => {
              seen.current.add(id);
              track(eventName, { step: i + 1, step_name: steps[i].label });
            }, 800),
          );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < 200 && setActive(-1);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("scroll", top);
    };
  }, [steps, eventName]);
  return active;
}

export function StepRail({ steps, active, intro }: { steps: readonly TutorialStep[]; active: number; intro: string }) {
  const step = steps[active];
  return (
    <div className="sticky top-16 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl" aria-hidden>
      <div className="container-x flex h-11 items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold sm:text-sm">
          {step ? (
            <>
              <span className="text-turbo">
                Step {active + 1} of {steps.length}
              </span>{" "}
              · {step.label}
            </>
          ) : (
            <span className="text-chrome">{intro}</span>
          )}
        </p>
        <ol className="flex gap-1.5">
          {steps.map((s, i) => (
            <li key={s.id} className={cn("h-1.5 rounded-full transition-colors duration-300", steps.length > 6 ? "w-3.5 sm:w-8" : "w-6 sm:w-10", i <= active ? "bg-turbo" : "bg-white/10")} />
          ))}
        </ol>
      </div>
    </div>
  );
}

export function StepHead({ n, kicker, title, lede }: { n: number; kicker: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-turbo">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo/10 font-display text-base text-turbo ring-1 ring-turbo/40">{n}</span>
        {kicker}
      </p>
      <h2 className="mt-4 text-[34px] font-bold leading-[1.03] sm:text-6xl">{title}</h2>
      {lede && <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground sm:text-xl">{lede}</p>}
    </div>
  );
}

export function Stat({ v, l, tone = "chrome", small = false }: { v: string; l: string; tone?: "chrome" | "turbo"; small?: boolean }) {
  return (
    <div className={cn("rounded-2xl bg-white/[0.03] ring-1 ring-white/5 sm:p-5", small ? "p-3" : "p-4")}>
      <dd className={cn("font-display font-bold sm:text-5xl", small ? "text-[22px]" : "text-3xl", tone === "turbo" ? "text-turbo-grad" : "text-chrome-grad")}>
        <CountUp value={v} />
      </dd>
      <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{l}</dt>
    </div>
  );
}

export const Tick = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3 text-[16px] sm:text-[17px]">
    <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
    <span>{children}</span>
  </li>
);

/**
 * Fades/slides its children in when they scroll into view. Server HTML and no-JS visitors see everything;
 * only blocks that start below the fold are hidden on the client, so nothing visible ever blinks.
 */
export function Reveal({ children, className, delay = 0, from = "up", as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; from?: "up" | "left" | "right" | "zoom"; as?: "div" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setState("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setState("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <Tag ref={ref as never} className={cn("rv", `rv-${from}`, state === "armed" && "rv-armed", className)} style={style}>
      {children}
    </Tag>
  );
}
