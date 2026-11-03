// Scroll-triggered visuals for /how-to-get-more-customers (the 9:16 tutorial ad page). Each one starts when it
// scrolls on screen, uses the visitor's business name if they ran the free check, and settles on a final frame
// that still makes sense as a screenshot. Illustrations, not data: real numbers live in content/results.ts.
import { useEffect, useRef, useState } from "react";
import { Bot, Check, MousePointerClick, Search, Star } from "lucide-react";
import { useInView } from "@/components/visuals/ReviewVisuals";
import { recallBusiness } from "@/lib/review-link";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const useName = (inView: boolean) => {
  const [name, setName] = useState("Your Business");
  useEffect(() => {
    if (inView) setName(recallBusiness() || "Your Business");
  }, [inView]);
  return name;
};

/** Google-style results where the visitor's business climbs from page 5 to the top 3. */
export function RankClimb({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("-20% 0px");
  const name = useName(inView);
  const [climbed, setClimbed] = useState(false);
  const [rank, setRank] = useState(47);

  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setClimbed(true);
      setRank(3);
      return;
    }
    let raf = 0;
    const t = window.setTimeout(() => {
      setClimbed(true);
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600);
        setRank(Math.round(47 - 44 * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 500);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      // Scrolled away before it finished: jump to the end state instead of freezing halfway.
      setClimbed(true);
      setRank(3);
    };
  }, [inView]);

  const rows = [
    { id: "a", name: "Big Franchise Co.", stars: 4.6, n: 812 },
    { id: "b", name: "Guy Who Bought Ads", stars: 4.2, n: 64 },
    { id: "you", name, stars: 4.9, n: 0 },
    { id: "c", name: "Cousin Steve's LLC", stars: 3.8, n: 11 },
    { id: "d", name: "Closed Since 2019", stars: 2.1, n: 3 },
  ];
  // Slot each row sits in before and after the climb.
  const before: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, you: 4 };
  const after: Record<string, number> = { a: 0, b: 1, you: 2, c: 3, d: 4 };
  const H = 62;

  return (
    <div ref={ref} className={cn("rounded-3xl bg-white p-4 text-[#202124] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:p-6", className)} role="img" aria-label={`Illustration: ${name} climbs from result #47 to #3 on Google`}>
      <div className="flex items-center gap-2 rounded-full border border-[#dfe1e5] px-4 py-2.5 text-[15px] shadow-sm">
        <Search className="h-4 w-4 text-[#9aa0a6]" aria-hidden />
        <span className="truncate">best near me</span>
      </div>
      <div className="relative mt-4" style={{ height: H * rows.length }}>
        {rows.map((r) => {
          const you = r.id === "you";
          const slot = (climbed ? after : before)[r.id];
          return (
            <div key={r.id} className={cn("rank-row absolute inset-x-0 flex items-center gap-3 rounded-xl px-3", you && "z-10 bg-[#e8f0fe] shadow-[0_10px_30px_-12px_rgba(26,115,232,0.7)] ring-2 ring-[#1a73e8]")} style={{ top: slot * H, height: H - 8 }}>
              <span className={cn("w-9 shrink-0 font-display text-lg font-bold tabular-nums", you ? "text-[#1a73e8]" : "text-[#9aa0a6]")}>#{you ? rank : slot + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[15px] font-semibold", you ? "text-[#1a0dab]" : "text-[#3c4043]")}>{r.name}</span>
                <span className="flex items-center gap-1 text-xs text-[#5f6368]">
                  {r.stars.toFixed(1)}
                  <Star className="h-3 w-3 fill-[#fbbc04] text-[#fbbc04]" aria-hidden />
                  {you ? (climbed ? "Top 3 · Maps · named by ChatGPT" : "Page 5 · nobody goes here") : `(${r.n})`}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BOTS = [
  { name: "Googlebot", for: "Google + Maps", color: "#4285F4" },
  { name: "Bingbot", for: "Bing, Copilot & AI search", color: "#00A4EF" },
  { name: "GPTBot / OAI-SearchBot", for: "ChatGPT", color: "#10A37F" },
  { name: "ClaudeBot", for: "Claude", color: "#D97757" },
  { name: "PerplexityBot", for: "Perplexity", color: "#20B8CD" },
];

/** The robots that decide who gets recommended, walking in and getting a green check. */
export function CrawlerParade({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLUListElement>("-15% 0px");
  return (
    <ul ref={ref} data-play={inView} className={cn("grid gap-2.5", className)} aria-label="Search and AI crawlers we let in and feed">
      {BOTS.map((b, i) => (
        <li key={b.name} className="bot flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 sm:p-4" style={{ animationDelay: `${i * 0.18}s` }}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${b.color}22`, color: b.color }}>
            <Bot className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[15px] font-bold sm:text-base">{b.name}</span>
            <span className="block truncate text-xs text-muted-foreground sm:text-sm">reads you for {b.for}</span>
          </span>
          <span className="bot-check grid h-7 w-7 shrink-0 place-items-center rounded-full bg-turbo/20 text-turbo" style={{ animationDelay: `${0.4 + i * 0.18}s` }}>
            <Check className="h-4 w-4" aria-hidden />
          </span>
        </li>
      ))}
    </ul>
  );
}

const TAGS = [
  { name: "GA4", color: "#F9AB00" },
  { name: "Meta CAPI", color: "#0866FF" },
  { name: "Google Ads", color: "#34A853" },
  { name: "Microsoft UET", color: "#00A4EF" },
  { name: "TikTok", color: "#FE2C55" },
  { name: "Reddit", color: "#FF4500" },
];

/** One click → Tag Manager → every ad platform learns from it → booked. */
export function TagPipeline({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("-10% 0px");
  const w = 360;
  const xs = TAGS.map((_, i) => 30 + (i * (w - 60)) / (TAGS.length - 1));
  return (
    <div ref={ref} data-play={inView} className={cn("relative mx-auto w-full max-w-[560px]", className)} role="img" aria-label="Diagram: a customer click goes into Google Tag Manager, which sends it to GA4, Meta, Google Ads, Microsoft, TikTok and Reddit, so every platform learns who books">
      <div className="node-pop mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#202124] shadow-lg">
        <MousePointerClick className="h-4 w-4 text-ignite" aria-hidden /> Customer clicks “Book”
      </div>
      <svg viewBox={`0 0 ${w} 142`} className="mt-1 h-auto w-full" aria-hidden>
        <line x1={w / 2} y1="0" x2={w / 2} y2="40" stroke="hsl(var(--turbo))" strokeWidth="2.5" strokeDasharray="6 6" className="pipe" />
        <rect x={w / 2 - 78} y="40" width="156" height="36" rx="18" fill="hsl(var(--turbo) / 0.15)" stroke="hsl(var(--turbo))" />
        <text x={w / 2} y="63" textAnchor="middle" fill="currentColor" className="fill-foreground font-display text-[13px] font-bold">
          Google Tag Manager
        </text>
        {xs.map((x, i) => (
          <path key={i} d={`M${w / 2} 76 C ${w / 2} 110, ${x} 100, ${x} 140`} fill="none" stroke={TAGS[i].color} strokeOpacity="0.8" strokeWidth="2" strokeDasharray="5 7" className="pipe" />
        ))}
      </svg>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {TAGS.map((t, i) => (
          <li key={t.name} className="node-pop rounded-xl bg-white/[0.05] px-1.5 py-2 text-center text-[11px] font-bold leading-tight ring-1 sm:text-xs" style={{ color: t.color, boxShadow: `inset 0 0 0 1px ${t.color}55`, animationDelay: `${i * 0.25}s` }}>
            {t.name}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center font-display text-lg font-bold">
        = every platform learns who <span className="text-turbo-grad">actually books</span> ✅
      </p>
    </div>
  );
}

/** DIY hours vs. done-for-you, as two bars that fill on scroll. */
export function HoursMeter({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("-15% 0px");
  const rows = [
    { label: "Doing it yourself (YouTube tutorials, 47 tabs, crying)", hours: "100+ hours", pct: 100, tone: "bg-[#ff6b6b]" },
    { label: "Done for you by CEO Turbo", hours: "30-minute call", pct: 6, tone: "bg-turbo" },
  ];
  return (
    <div ref={ref} data-play={inView} className={cn("grid gap-5", className)}>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] text-muted-foreground sm:text-base">{r.label}</p>
            <p className="whitespace-nowrap font-display text-xl font-bold sm:text-2xl">{r.hours}</p>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/10">
            <div className={cn("meter-fill h-full rounded-full", r.tone)} style={{ width: `${Math.max(r.pct, 4)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

type Kind = "local" | "store" | "artist" | "b2b";
const PICKS: Record<Kind, { label: string; emoji: string; platforms: { name: string; why: string }[] }> = {
  local: {
    label: "Local service",
    emoji: "🔧",
    platforms: [
      { name: "Google Search", why: "catch people typing “near me” with their wallet out" },
      { name: "Microsoft Ads", why: "cheaper clicks, older homeowners and business owners" },
      { name: "Meta (Facebook + Instagram)", why: "be the name they remember before they need you" },
      { name: "Google Business Profile", why: "free map-pack calls (we optimize it)" },
    ],
  },
  store: {
    label: "Online store",
    emoji: "🛒",
    platforms: [
      { name: "Google Shopping / PMax", why: "your product, photo and price right in the results" },
      { name: "Microsoft Shopping", why: "same shoppers, less competition, lower cost" },
      { name: "Meta Advantage+", why: "finds buyers who look like your best customers" },
      { name: "TikTok", why: "products that look good in a 9-second video" },
    ],
  },
  artist: {
    label: "Artist / musician",
    emoji: "🎤",
    platforms: [
      { name: "Meta (Instagram Reels)", why: "turn a song clip into followers and streams" },
      { name: "Spotify Ads / Marquee", why: "reach listeners already in the app" },
      { name: "TikTok", why: "where songs actually blow up" },
      { name: "YouTube + Reddit", why: "fans who dig deep and share" },
    ],
  },
  b2b: {
    label: "B2B / services",
    emoji: "💼",
    platforms: [
      { name: "Google Search", why: "decision makers searching for a fix" },
      { name: "Microsoft Ads + LinkedIn targeting", why: "target by company, industry and job title" },
      { name: "LinkedIn", why: "high-ticket buyers, by job title" },
      { name: "Reddit", why: "niche communities asking for recommendations" },
    ],
  },
};

/** "What do you sell?" → the ad platforms we'd start with. */
export function PlatformPicker({ className }: { className?: string }) {
  const [kind, setKind] = useState<Kind>("local");
  const pick = PICKS[kind];
  return (
    <div className={cn("audit-card rounded-3xl p-5 sm:p-8", className)}>
      <p className="text-center text-sm font-semibold text-chrome">What do you sell? Tap one:</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(PICKS) as Kind[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              track("platform_pick", { kind: k });
            }}
            className={cn("choice !justify-center !py-3 !text-sm", kind === k && "choice-on")}
          >
            <span aria-hidden>{PICKS[k].emoji}</span> {PICKS[k].label}
          </button>
        ))}
      </div>
      <ol key={kind} className="mt-6 grid gap-2.5" aria-live="polite">
        {pick.platforms.map((p, i) => (
          <li key={p.name} className="animate-step flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-turbo/10 font-display text-sm font-bold text-turbo">{i + 1}</span>
            <span className="text-[15px] sm:text-base">
              <span className="font-semibold">{p.name}</span> <span className="text-muted-foreground">— {p.why}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "Would you call them?" — a dead profile vs. a polished one. Tapping reveals the point. */
export function LegitPoll({ className }: { className?: string }) {
  const [pick, setPick] = useState<"dead" | "legit" | null>(null);
  const [name, setName] = useState("your business");
  const choose = (p: "dead" | "legit") => {
    setPick(p);
    setName(recallBusiness() || "your business");
    track("legit_poll", { pick: p });
  };
  const cards = [
    { id: "dead" as const, title: "Profile A", lines: ["Last post: March 2019", "0 photos · 3 reviews", "Bio: “Welcome to my page”", "No book button"] },
    { id: "legit" as const, title: "Profile B", lines: ["Posted 2 days ago", "48 photos · 140 reviews ★4.9", "Bio: what, where, who for", "Book · Call · Directions"] },
  ];
  return (
    <div className={className}>
      <p className="text-center text-sm font-semibold text-chrome">Quick — which one are you calling?</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <button key={c.id} type="button" aria-pressed={pick === c.id} onClick={() => choose(c.id)} className={cn("rounded-2xl p-4 text-left ring-2 transition-transform active:scale-[0.98]", c.id === "dead" ? "bg-white/[0.03] text-muted-foreground" : "bg-turbo/[0.08]", pick === c.id ? "ring-turbo" : "ring-white/10 hover:-translate-y-0.5")}>
            <span className="block font-display text-lg font-bold text-foreground">{c.title}</span>
            <ul className="mt-2 space-y-1 text-[13px] leading-snug sm:text-sm">
              {c.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {pick && (
          <p className="animate-step mt-4 rounded-2xl bg-ignite/10 p-4 text-center text-[16px] font-semibold leading-snug ring-1 ring-ignite/30">
            {pick === "legit" ? `Same. Everyone does. So which one is ${name} right now?` : "Bold. You're the only one. Everybody else called Profile B."}
          </p>
        )}
      </div>
    </div>
  );
}
