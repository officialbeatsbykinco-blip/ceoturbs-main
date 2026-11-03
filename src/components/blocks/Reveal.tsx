import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fades a block up once when it scrolls into view. Visible by default (SSR, no JS, reduced motion); transform/opacity only. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setHidden(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setHidden(false);
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("transition duration-700 ease-out will-change-transform", hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100", className)} style={{ transitionDelay: hidden ? "0ms" : `${delay}ms` }}>
      {children}
    </div>
  );
}
