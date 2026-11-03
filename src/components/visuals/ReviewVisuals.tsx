import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardBack, cardFront } from "@/lib/card-faces";

/** Plays CSS animations only while the element is on screen (saves battery on phones). */
export function useInView<T extends Element>(rootMargin = "100px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setInView(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

/**
 * Real product photo floating in 3D: tilts toward the mouse with a moving glare,
 * idles with a slow float on touch screens. Transform-only, so it stays at 60fps.
 */
export function TiltCard({ src, alt, className, priority = false, children }: { src: string; alt: string; className?: string; priority?: boolean; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current!;
      el.style.setProperty("--rx", `${(0.5 - y) * 22}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 26}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
      el.dataset.active = "true";
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "8deg");
    el.style.setProperty("--ry", "-14deg");
    el.dataset.active = "false";
  };

  return (
    <div className={cn("tilt-stage relative", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={ref} className="tilt-card animate-float-tilt relative mx-auto aspect-square w-full" data-active="false">
        <img src={src} alt={alt} width={388} height={386} className="h-full w-full rounded-[8%] object-contain" {...(priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})} loading={priority ? "eager" : "lazy"} decoding="async" />
        <span className="tilt-glare pointer-events-none absolute inset-0 rounded-[8%]" aria-hidden />
        <span className="tilt-edge pointer-events-none absolute inset-0 rounded-[8%]" aria-hidden />
        {children}
      </div>
      <div className="tilt-shadow pointer-events-none absolute inset-x-[12%] -bottom-6 h-10 rounded-[50%]" aria-hidden />
    </div>
  );
}

const FRONT_SVG = cardFront();
const BACK_SVG = cardBack();

/**
 * The review card in real 3D, both sides drawn as vector art: it sways, flips to show the
 * black NFC back and comes round again. With `tap`, a phone glides in, taps, NFC rings
 * pulse and the stars light up. Mouse tilts it (and pauses the loop); a tap flips it.
 * Transform-only and paused off screen. Reduced motion settles on the front.
 */
export function ReviewCard3D({ className, tap = false, priority = false }: { className?: string; tap?: boolean; priority?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const tiltRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !tiltRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = tiltRef.current!;
      el.style.setProperty("--rx", `${(0.5 - y) * 24}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 34}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
      el.dataset.active = "true";
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.dataset.active = "false";
  };

  return (
    <div
      ref={ref}
      className={cn("rc-stage relative mx-auto select-none", tap && "pr-[16%]", className)}
      data-play={inView}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label="NFC Google review card turning in 3D: white “Review Us On Google” front and black NFC back"
    >
      <button type="button" onClick={() => setFlipped((f) => !f)} className="relative block w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-turbo focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[8%/5%]" aria-label={flipped ? "Show the front of the card" : "Show the back of the card"} {...(priority ? { "data-priority": "true" } : {})}>
        <div ref={tiltRef} className="rc-tilt" data-active="false">
          <div className="rc-flip" data-flipped={flipped}>
            <div className="rc-spin">
              <div className="rc-card">
                {[-2, -1, 0, 1, 2].map((z) => (
                  <span key={z} className="rc-edge" style={{ transform: `translateZ(${z}px)` }} aria-hidden />
                ))}
                <div className="rc-face" dangerouslySetInnerHTML={{ __html: FRONT_SVG }} />
                <div className="rc-face rc-back" dangerouslySetInnerHTML={{ __html: BACK_SVG }} />
              </div>
            </div>
          </div>
        </div>
      </button>
      <div className="rc-shadow pointer-events-none absolute inset-x-[14%] -bottom-[7%] h-[8%] rounded-[50%]" aria-hidden />
      {tap && (
        <>
          <span className="rc-ring pointer-events-none absolute left-[22%] top-[66%] h-[26%] w-[42%] rounded-full border-2 border-turbo" aria-hidden />
          <span className="rc-ring rc-ring-2 pointer-events-none absolute left-[22%] top-[66%] h-[26%] w-[42%] rounded-full border-2 border-turbo" aria-hidden />
          <div className="rc-phone pointer-events-none absolute -right-[2%] top-[50%] w-[36%]" aria-hidden>
            <div className="relative aspect-[9/19] w-full rounded-[22%/10.5%] bg-[#0d1117] p-[5%] shadow-[0_40px_60px_-20px_rgba(0,0,0,0.85),inset_0_0_0_2px_rgba(255,255,255,0.16)]">
              <div className="relative h-full w-full overflow-hidden rounded-[17%/8%] bg-white px-[9%] pt-[26%] text-[#202124]">
                <span className="absolute left-1/2 top-[2.5%] h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
                <p className="text-[clamp(6px,1.3vw,11px)] font-semibold leading-tight">Rate and review</p>
                <div className="mt-[14%] flex justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="rc-pstar aspect-square h-auto w-[17%]" style={{ animationDelay: `${i * 0.1}s` }} strokeWidth={1.6} />
                  ))}
                </div>
                <span className="mt-[16%] block h-[18%] rounded-md border border-[#dadce0]" />
                <span className="mt-[12%] block rounded-full bg-[#1a73e8] py-[5%] text-center text-[clamp(6px,1.1vw,9px)] font-semibold text-white">Post</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Flat vector card face (front or back) for small static spots. */
export function CardFace({ side = "front", className }: { side?: "front" | "back"; className?: string }) {
  return <div className={cn("[&>svg]:block [&>svg]:h-auto [&>svg]:w-full", className)} dangerouslySetInnerHTML={{ __html: side === "front" ? FRONT_SVG : BACK_SVG }} />;
}

/** NFC rings that pulse out from a point. */
export function NfcRings({ className }: { className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute grid place-items-center", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="nfc-ring absolute h-full w-full rounded-full border-2 border-turbo/70" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </span>
  );
}

const REVIEW_TEXT = "Fast, friendly and fair!";

/**
 * The whole customer experience in one loop: phone taps the card, the review form
 * opens for *their* business, five stars fill, the review posts.
 */
export function TapDemo({ business, className }: { business?: string; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const name = (business || "").trim() || "Your Business";
  return (
    <div ref={ref} className={cn("tap-demo relative mx-auto aspect-[5/4] w-full max-w-[560px] select-none", className)} data-play={inView} role="img" aria-label={`Animation: a customer taps their phone on the review card and the Google review form for ${name} opens`}>
      <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(60%_60%_at_35%_45%,hsl(var(--turbo)/0.22),transparent)]" />
      {/* card */}
      <div className="td-card absolute left-[4%] top-[18%] w-[46%]">
        <div className="mx-auto w-[64%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" dangerouslySetInnerHTML={{ __html: FRONT_SVG }} />
        <span className="td-ring absolute left-[18%] top-[56%] h-[34%] w-[34%] rounded-full border-2 border-turbo" />
        <span className="td-ring td-ring-2 absolute left-[18%] top-[56%] h-[34%] w-[34%] rounded-full border-2 border-turbo" />
      </div>
      {/* phone */}
      <div className="td-phone absolute right-[5%] top-[4%] w-[40%]">
        <div className="relative aspect-[9/19] w-full rounded-[22%/10.5%] bg-[#0d1117] p-[5%] shadow-[0_40px_60px_-20px_rgba(0,0,0,0.8),inset_0_0_0_2px_rgba(255,255,255,0.14)]">
          <div className="relative h-full w-full overflow-hidden rounded-[17%/8%] bg-gradient-to-b from-[#1b2a44] to-[#0b1220]">
            <span className="absolute left-1/2 top-[2.5%] h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
            <p className="absolute inset-x-0 top-[16%] text-center font-display text-[clamp(18px,4.2vw,30px)] font-semibold text-white/90">9:41</p>
            <p className="absolute inset-x-0 top-[30%] text-center text-[clamp(7px,1.3vw,10px)] text-white/60">Hold near the card</p>
            {/* review sheet */}
            <div className="td-sheet absolute inset-x-0 bottom-0 top-[9%] rounded-t-[12%_6%] bg-white px-[7%] pt-[9%] text-[#202124]">
              <div className="flex items-center gap-[6%]">
                <span className="grid aspect-square w-[22%] shrink-0 place-items-center rounded-full bg-[#1a73e8] text-[clamp(8px,1.6vw,13px)] font-bold text-white">{name[0]?.toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="truncate text-[clamp(8px,1.5vw,12px)] font-semibold leading-tight">{name}</p>
                  <p className="text-[clamp(6px,1.05vw,9px)] leading-tight text-[#5f6368]">Rate and review</p>
                </div>
              </div>
              <div className="mt-[10%] flex justify-between px-[2%]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="td-star aspect-square h-auto w-[16%]" style={{ animationDelay: `${i * 0.22}s` }} strokeWidth={1.6} />
                ))}
              </div>
              <div className="mt-[10%] h-[24%] rounded-[8px] border border-[#dadce0] p-[5%]">
                <p className="td-type overflow-hidden whitespace-nowrap text-[clamp(6px,1.1vw,9px)] leading-snug text-[#3c4043]">{REVIEW_TEXT}</p>
              </div>
              <span className="td-post mt-[9%] block rounded-full bg-[#1a73e8] py-[4%] text-center text-[clamp(7px,1.2vw,10px)] font-semibold text-white">Post</span>
              <span className="td-toast absolute inset-x-[8%] bottom-[5%] flex items-center justify-center gap-1 rounded-lg bg-[#202124] py-[4%] text-[clamp(6px,1.1vw,9px)] font-medium text-white">
                <Check className="h-[1.2em] w-[1.2em] text-[#81c995]" /> Review posted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Animated 0–100 ring. Colour shifts from red to orange to blue with the score. */
export function ScoreGauge({ value, size = 180, label = "visibility score" }: { value: number; size?: number; label?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const r = 70;
  const c = 2 * Math.PI * r;
  const color = value >= 75 ? "hsl(var(--turbo))" : value >= 50 ? "hsl(var(--ignite-hot))" : "#ff4d4d";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="90" cy="90" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="14" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-5xl font-bold tabular-nums leading-none">{shown}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
