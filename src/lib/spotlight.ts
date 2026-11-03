// Cursor spotlight: a soft glow follows the mouse across any .panel card (styles in index.css).
// One delegated listener, rAF-throttled; skipped on touch screens and under reduced motion.
export function startSpotlight() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let frame = 0;
  let last: HTMLElement | null = null;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = (e.target as Element | null)?.closest?.<HTMLElement>(".panel") ?? null;
        if (last && last !== el) {
          last.style.removeProperty("--mx");
          last.style.removeProperty("--my");
        }
        last = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    },
    { passive: true },
  );
}
