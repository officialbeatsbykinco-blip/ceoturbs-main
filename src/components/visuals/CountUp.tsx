// A number that counts up when it scrolls into view. The server-rendered HTML (and anyone without JS
// or with reduced motion) shows the real final value; the animation is only a client-side flourish.
import { useEffect, useRef, useState } from "react";

const parse = (v: string) => {
  const m = v.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const num = Number(m[2].replace(/,/g, ""));
  const decimals = m[2].includes(".") ? m[2].split(".")[1].length : 0;
  return { prefix: m[1], num, decimals, suffix: m[3], comma: m[2].includes(",") };
};

export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const p = parse(value);
    const el = ref.current;
    if (!p || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const fmt = (n: number) => {
      const s = n.toFixed(p.decimals);
      return `${p.prefix}${p.comma ? Number(s).toLocaleString("en-US", { minimumFractionDigits: p.decimals }) : s}${p.suffix}`;
    };
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setShown(fmt(p.num * eased));
          if (k < 1) raf = requestAnimationFrame(step);
          else setShown(value);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} className="tabular-nums" aria-hidden>
        {shown}
      </span>
    </>
  );
}
