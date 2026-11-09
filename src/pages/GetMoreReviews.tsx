// /get-more-reviews — the review-card tutorial Christopher scrolls in the 9:16 Meta ad (face on top, page below).
// Story: laugh at the problem → see why reviews decide who gets the call (people AND search/AI) → watch the
// one-tap fix with their own business name → do the catch-up math → buy. Focus layout: header and phone bar
// jump to the buy box. Honest by design: no invented stats, no fake reviews, within Google's review rules.
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Check, MapPin, Phone, Star, X } from "lucide-react";
import { REVIEW_CARD, SITE, fromPriceLabel, money2 } from "@/config/site";
import { RULES, SETUP_PATH, SHOP_FAQS } from "@/content/review-cards";
import { BuyBox } from "@/components/shop/BuyBox";
import { FAQList } from "@/components/blocks/Basics";
import { StepHead, StepRail, Tick, useActiveStep } from "@/components/blocks/Tutorial";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { recallBusiness, rememberBusiness } from "@/lib/review-link";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "who", label: "Who'd you call?", title: "Who would you call?" },
  { id: "robots", label: "Feed the robots", title: "How reviews feed Google, AI answers and people" },
  { id: "asking", label: "Why asking fails", title: "Why “please leave us a review” doesn't work" },
  { id: "fix", label: "The one-tap fix", title: "The one-tap review card" },
  { id: "get", label: "Get yours", title: "Get your review cards" },
] as const;

const FAQ_KEEP = ["Do my customers need an app?", "How do I set it up?", "Is asking for reviews this way allowed by Google?", "Will it work through a phone case?", "How long does shipping take?", "What if my card doesn't work?"];

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex", className)} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={cn("h-4 w-4", i < Math.round(value) ? "fill-[#fbbc04] text-[#fbbc04]" : "fill-[#dadce0] text-[#dadce0]")} />
      ))}
    </span>
  );
}

/** Two Maps-style listings. The viewer picks one; the reveal makes the point for us. */
function WhoWouldYouCall({ business }: { business: string }) {
  const [pick, setPick] = useState<"mike" | "you" | null>(null);
  const you = business.trim() || "Your Business";
  const listings = [
    { id: "mike" as const, name: "Mike's Plumbing", cat: "Plumber · Open now", rating: 4.9, count: 212, note: "“Showed up in an hour, fair price”" },
    { id: "you" as const, name: you, cat: business.trim() ? "Open now" : "Plumber · Open now", rating: 4.1, count: 9, note: "No recent reviews" },
  ];
  const choose = (id: "mike" | "you") => {
    setPick(id);
    track("reviews_poll", { pick: id });
  };
  return (
    <div>
      <p className="text-center text-sm font-semibold text-chrome">Your sink just exploded. Tap who you're calling:</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {listings.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => choose(l.id)}
            aria-pressed={pick === l.id}
            className={cn("rounded-2xl bg-white p-4 text-left text-[#202124] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] ring-2 transition-transform active:scale-[0.98]", pick === l.id ? "ring-turbo" : "ring-transparent hover:-translate-y-0.5")}
          >
            <span className="block truncate text-[17px] font-semibold">{l.name}</span>
            <span className="mt-1 flex items-center gap-1.5 text-sm">
              <span className="font-medium">{l.rating.toFixed(1)}</span>
              <Stars value={l.rating} />
              <span className="text-[#5f6368]">({l.count})</span>
            </span>
            <span className="mt-1 block text-[13px] text-[#5f6368]">{l.cat}</span>
            <span className="mt-2 block text-[13px] italic text-[#3c4043]">{l.note}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#dadce0] px-3 py-1.5 text-[13px] font-medium text-[#1a73e8]">
              <Phone className="h-3.5 w-3.5" aria-hidden /> Call
            </span>
          </button>
        ))}
      </div>
      <div aria-live="polite" className="min-h-[1px]">
        {pick && (
          <p className="animate-step mt-5 rounded-2xl bg-ignite/10 p-4 text-center text-[17px] font-semibold leading-snug text-foreground ring-1 ring-ignite/30">
            {pick === "mike" ? <>Yeah. Everybody picks Mike. Even Mike's competitors pick Mike. 😅</> : <>With 9 reviews? Be honest — you'd call Mike too. 😂 So do your customers.</>}
          </p>
        )}
      </div>
    </div>
  );
}

/** One review, four places it pays off. Lines animate (paused for reduced motion via the global rule). */
function RobotsDiagram() {
  const outs = [
    { x: 70, y: 250, title: "Google Maps", sub: "ranks you higher", c: "#4285f4" },
    { x: 290, y: 250, title: "AI Overviews", sub: "quote your reviews", c: "#34a853" },
    { x: 70, y: 370, title: "ChatGPT & Gemini", sub: "name “top-rated” picks", c: "#fbbc04" },
    { x: 290, y: 370, title: "Real humans", sub: "trust the stars", c: "#ff7a2f" },
  ];
  return (
    <svg viewBox="0 0 360 430" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="Diagram: one five-star review feeds Google Maps ranking, AI Overviews, ChatGPT and Gemini recommendations, and human trust">
      <defs>
        <linearGradient id="rv-card" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="hsl(218 30% 14%)" />
          <stop offset="1" stopColor="hsl(220 34% 8%)" />
        </linearGradient>
      </defs>
      {outs.map((o) => (
        <path key={o.title} d={`M180 120 C180 175 ${o.x} 165 ${o.x} ${o.y - 34}`} fill="none" stroke={o.c} strokeWidth="2.5" strokeLinecap="round" className="flow-line" opacity="0.85" />
      ))}
      {/* the review */}
      <rect x="70" y="18" width="220" height="102" rx="18" fill="#fff" />
      <circle cx="98" cy="48" r="14" fill="#1a73e8" />
      <text x="98" y="53" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">J</text>
      <text x="120" y="45" fontSize="12" fontWeight="600" fill="#202124" fontFamily="Inter, sans-serif">Jasmine R.</text>
      <text x="120" y="60" fontSize="10" fill="#5f6368" fontFamily="Inter, sans-serif">just now</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} transform={`translate(${86 + i * 19} 72) scale(0.75)`} d="M10 0 L12.9 6.6 L20 7.3 L14.6 12 L16.2 19 L10 15.3 L3.8 19 L5.4 12 L0 7.3 L7.1 6.6 Z" fill="#fbbc04" />
      ))}
      <text x="86" y="108" fontSize="11" fill="#3c4043" fontFamily="Inter, sans-serif">“Fast, fair and super friendly!”</text>
      {outs.map((o) => (
        <g key={o.title}>
          <rect x={o.x - 64} y={o.y - 34} width="128" height="72" rx="16" fill="url(#rv-card)" stroke={o.c} strokeOpacity="0.55" />
          <circle cx={o.x} cy={o.y - 34} r="5" fill={o.c} />
          <text x={o.x} y={o.y - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Space Grotesk Variable, Inter, sans-serif">
            {o.title}
          </text>
          <text x={o.x} y={o.y + 16} textAnchor="middle" fontSize="10.5" fill="hsl(211 25% 75%)" fontFamily="Inter, sans-serif">
            {o.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** "How long until I pass them?" — their own numbers and their own guess, nothing made up. */
function CatchUpCalculator() {
  const id = useId();
  const [weekly, setWeekly] = useState(30);
  const [mine, setMine] = useState(9);
  const [theirs, setTheirs] = useState(120);
  const [rate, setRate] = useState(2);
  const perWeek = (weekly * rate) / 10;
  const gap = Math.max(0, theirs - mine + 1);
  const weeks = perWeek > 0 ? Math.ceil(gap / perWeek) : Infinity;
  const in90 = Math.round(perWeek * 13);
  const log = () => track("reviews_calc", { weekly, mine, theirs, rate, weeks: Number.isFinite(weeks) ? weeks : -1 });
  const sliders = [
    { k: "weekly", label: "Customers you serve a week", v: weekly, set: setWeekly, min: 5, max: 300, step: 5, show: String(weekly) },
    { k: "mine", label: "Your Google reviews now", v: mine, set: setMine, min: 0, max: 200, step: 1, show: String(mine) },
    { k: "theirs", label: "Your top competitor's reviews", v: theirs, set: setTheirs, min: 10, max: 1000, step: 10, show: String(theirs) },
    { k: "rate", label: "Of 10 customers you hand the card to, how many review? (your guess)", v: rate, set: setRate, min: 1, max: 8, step: 1, show: `${rate} in 10` },
  ];
  return (
    <div className="audit-card rounded-3xl p-5 sm:p-8">
      <h3 className="font-display text-2xl font-bold sm:text-3xl">How fast could you pass them?</h3>
      <p className="mt-1 text-sm text-muted-foreground">Drag the sliders. Your numbers, your guess — no made-up stats.</p>
      <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {sliders.map((s) => (
            <div key={s.k}>
              <label htmlFor={`${id}-${s.k}`} className="flex items-end justify-between gap-3 text-sm font-medium text-chrome">
                <span>{s.label}</span>
                <span className="shrink-0 font-display text-xl font-bold text-foreground">{s.show}</span>
              </label>
              <input id={`${id}-${s.k}`} type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(Number(e.target.value))} onPointerUp={log} onKeyUp={log} className="mt-2 w-full accent-[hsl(var(--ignite))]" />
            </div>
          ))}
        </div>
        <div className="grid content-center rounded-2xl bg-white/[0.03] p-6 text-center ring-1 ring-white/5" aria-live="polite">
          {gap === 0 ? (
            <p className="font-display text-3xl font-bold text-turbo-grad">You're already ahead. Now stay there.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">You'd pass them in about</p>
              <p className="mt-1 font-display text-6xl font-bold text-turbo-grad">{Number.isFinite(weeks) ? weeks : "—"}</p>
              <p className="text-sm font-semibold">{weeks === 1 ? "week" : "weeks"}</p>
            </>
          )}
          <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
            That's about <span className="font-semibold text-foreground">+{in90} reviews</span> in 90 days — from a card that costs {fromPriceLabel} once.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GetMoreReviews() {
  const active = useActiveStep(STEPS, "reviews_step_view");
  const [business, setBusiness] = useState("");
  const [typed, setTyped] = useState(false);
  useEffect(() => setBusiness((b) => b || recallBusiness()), []);
  const onName = (v: string) => {
    setBusiness(v);
    rememberBusiness(v);
    if (!typed && v.trim().length > 2) {
      setTyped(true);
      track("reviews_name_typed");
    }
  };
  const nameId = useId();
  const two = REVIEW_CARD.packs.find((p) => p.id === "2")!;

  return (
    <>
      {/* HOOK — the joke every owner has lived. */}
      <section className="relative overflow-hidden pb-12 pt-24 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo opacity-70" aria-hidden />
        <div className="container-x relative">
          <p className="chip">Free tutorial · how to get more Google reviews</p>
          <h1 className="mt-5 max-w-4xl text-[40px] font-bold leading-[1.02] sm:text-7xl">
            <span className="text-chrome-grad">Your customers say they'll leave a review.</span> <span className="text-turbo-grad">Then they go home and watch Netflix.</span>
          </h1>
          <div className="mt-7 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <p className="font-display text-5xl font-bold text-chrome-grad">∞</p>
              <p className="mt-1 text-sm text-muted-foreground">“I'll definitely leave you a review!”</p>
            </div>
            <div className="rounded-2xl bg-ignite/[0.08] p-4 ring-1 ring-ignite/30">
              <p className="font-display text-5xl font-bold text-ignite">0</p>
              <p className="mt-1 text-sm text-muted-foreground">reviews that actually showed up</p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted-foreground sm:text-xl">
            Here's why reviews decide who gets the call — on Google, in ChatGPT and in people's heads — and the one-tap trick that turns “I'll do it later” into a 5-star review before they leave.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#buy" className="btn-ignite btn-shine">
              Buy Google Review Cards · {fromPriceLabel}
            </a>
            <a href="#who" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-chrome hover:text-foreground">
              Show me how <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <StepRail steps={STEPS} active={active} intro="5 steps to more reviews · scroll along" />

      {/* STEP 1 — the poll */}
      <section id="who" className="section scroll-mt-28" aria-label={STEPS[0].title}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <StepHead n={1} kicker="Who would you call?" title={<>Same price. Same service. <span className="text-turbo-grad">One has 212 reviews.</span></>} lede="Before anyone calls you, they compare stars and review counts. It takes them about two seconds to decide." />
            <ul className="mt-6 space-y-2.5">
              <Tick>
                <span className="font-semibold">Social proof:</span> <span className="text-muted-foreground">when we're unsure, we copy what other people did.</span>
              </Tick>
              <Tick>
                <span className="font-semibold">Reviews are the new word of mouth:</span> <span className="text-muted-foreground">strangers trust strangers who've already paid you.</span>
              </Tick>
              <Tick>
                <span className="font-semibold">Fewer reviews = more risk:</span> <span className="text-muted-foreground">9 reviews looks like “maybe they just opened… or maybe they're bad.”</span>
              </Tick>
            </ul>
          </div>
          <WhoWouldYouCall business={business} />
        </div>
      </section>

      {/* STEP 2 — SEO / AEO / GEO */}
      <section id="robots" className="section scroll-mt-28 border-t border-border" aria-label={STEPS[1].title}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <StepHead n={2} kicker="Feed the robots" title={<>Reviews don't just convince people. <span className="text-turbo-grad">They train Google and AI.</span></>} />
            <ul className="mt-6 space-y-4 text-[16px] leading-relaxed sm:text-[17px]">
              <li>
                <span className="font-semibold text-[#8ab4f8]">SEO — Google Maps:</span>{" "}
                <span className="text-muted-foreground">
                  <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-turbo">
                    Google says
                  </a>{" "}
                  review count and score factor into local ranking. More reviews, higher on the map.
                </span>
              </li>
              <li>
                <span className="font-semibold text-[#81c995]">AEO — AI Overviews:</span> <span className="text-muted-foreground">Google's AI answers and Maps summaries quote what customers say about you. No reviews, nothing to quote.</span>
              </li>
              <li>
                <span className="font-semibold text-[#fdd663]">GEO — ChatGPT &amp; Gemini:</span> <span className="text-muted-foreground">ask “who's the best plumber near me?” and they name businesses with lots of strong reviews.</span>
              </li>
              <li>
                <span className="font-semibold text-ignite">Humans:</span> <span className="text-muted-foreground">stars are the first thing they see and the last thing they check.</span>
              </li>
            </ul>
            <p className="mt-6 rounded-2xl bg-white/[0.03] p-4 text-[17px] font-semibold ring-1 ring-white/5">Every review is a tiny salesperson that works 24/7 — and never asks for a raise.</p>
          </div>
          <RobotsDiagram />
        </div>
      </section>

      {/* STEP 3 — funny comparisons + meme */}
      <section id="asking" className="section scroll-mt-28 border-t border-border" aria-label={STEPS[2].title}>
        <div className="container-x">
          <StepHead n={3} kicker="Why asking fails" title={<>“Please leave us a review!” <span className="text-turbo-grad">is basically…</span></>} lede="Your customers aren't lying. They mean it. Then life happens. Asking out loud is like:" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { e: "🫠", a: "Saying “we should hang out sometime”", b: "Everyone agrees. Nobody ever does it." },
              { e: "🧾", a: "A QR code taped to the register", b: "Looks like a 2020 restaurant menu. Nobody scans it." },
              { e: "🪑", a: "“Just search us on Google, find us, scroll, tap Reviews…”", b: "IKEA instructions with no pictures." },
              { e: "🅿️", a: "A business with 3 reviews", b: "An empty restaurant parking lot at 7pm. You keep driving." },
            ].map((c) => (
              <li key={c.a} className="panel p-5">
                <p className="text-3xl" aria-hidden>
                  {c.e}
                </p>
                <p className="mt-3 text-[17px] font-semibold leading-snug">{c.a}</p>
                <p className="mt-1.5 text-[15px] text-muted-foreground">= {c.b}</p>
              </li>
            ))}
          </ul>
          <figure className="mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl ring-1 ring-white/10" aria-label="Meme: no to the long way of leaving a review, yes to one tap">
            {[
              { face: "🙅‍♂️", tone: "bg-[#1b1f27]", text: "“Open Google, search our name, find the right listing, scroll, tap Reviews, tap Write a review, pick stars…”", dim: true },
              { face: "😎", tone: "bg-[#13233d]", text: "*taps phone on card* ⭐⭐⭐⭐⭐ posted.", dim: false },
            ].map((r) => (
              <div key={r.face} className={cn("grid grid-cols-[88px_1fr] items-center border-b border-white/5 last:border-0 sm:grid-cols-[120px_1fr]", r.tone)}>
                <span className="grid h-full place-items-center bg-white/[0.03] py-6 text-5xl sm:text-6xl" aria-hidden>
                  {r.face}
                </span>
                <p className={cn("p-5 text-[16px] font-semibold leading-snug sm:text-lg", r.dim ? "text-muted-foreground line-through decoration-ignite/70" : "text-foreground")}>{r.text}</p>
              </div>
            ))}
          </figure>
        </div>
      </section>

      {/* STEP 4 — the product, personalized */}
      <section id="fix" className="section scroll-mt-28 border-t border-border" aria-label={STEPS[3].title}>
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <StepHead n={4} kicker="The one-tap fix" title={<>Hand them a card. <span className="text-turbo-grad">One tap opens your review form.</span></>} lede="No app. No searching. No “later.” The phone opens Google's review screen for your business while they're still happy and still standing in front of you." />
              <label htmlFor={nameId} className="mt-7 block text-sm font-semibold text-chrome">
                Type your business name — watch it happen:
              </label>
              <input id={nameId} value={business} onChange={(e) => onName(e.target.value)} placeholder="e.g. Mike's Plumbing" autoComplete="organization" className="field mt-2 !text-[17px]" maxLength={40} />
              <ol className="mt-6 grid gap-2.5">
                {["They tap their phone on the card", `${business.trim() || "Your business"}'s Google review form opens`, "Stars, one line, post — about 10 seconds"].map((t, i) => (
                  <li key={t} className="flex items-center gap-3 text-[16px]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-turbo/10 font-display text-sm font-bold text-turbo">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <TapDemo business={business} />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5">
            {[
              { name: "card-counter", alt: "Google review card lying on a shop counter next to the register" },
              { name: "card-tap", alt: "Phone next to the review card with the Google review form open — iPhone and Android" },
            ].map((i) => (
              <img key={i.name} src={`/img/review-cards/hd/${i.name}-1600.webp`} srcSet={`/img/review-cards/hd/${i.name}-800.webp 800w, /img/review-cards/hd/${i.name}-1600.webp 1600w`} sizes="(min-width: 1024px) 560px, 50vw" alt={i.alt} width={1600} height={1600} loading="lazy" decoding="async" className="aspect-square w-full rounded-2xl object-cover ring-1 ring-white/10" />
            ))}
          </div>
          <div className="mt-12">
            <CatchUpCalculator />
          </div>
        </div>
      </section>

      {/* STEP 5 — buy */}
      <section id="get" className="section scroll-mt-28 border-t border-border" aria-label={STEPS[4].title}>
        <div className="container-x">
          <StepHead n={5} kicker="Get yours" title={<>{fromPriceLabel} once. <span className="text-turbo-grad">Less than one lost customer.</span></>} />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { v: "$1.25", l: "a review — if one card gets you 20" },
              { v: "$0/mo", l: "no subscription, ever" },
              { v: "2 min", l: "to set up with our step-by-step guide" },
            ].map((x) => (
              <li key={x.l} className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <p className="font-display text-3xl font-bold text-turbo-grad">{x.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{x.l}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Most popular: <span className="font-semibold text-foreground">{two.label} for {money2(two.price)}</span> — {two.note.toLowerCase()}.
          </p>
        </div>
        <div className="container-x mt-10 [&_#buy]:scroll-mt-6">
          <BuyBox business={business} onBusiness={onName} headingLevel="h2" stickyBar={false} />
        </div>

        <div className="container-x mt-16">
          <h3 className="text-2xl font-bold sm:text-3xl">Why buy from CEO Turbo?</h3>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-[14px] sm:text-[15px]">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-4 py-3 font-medium text-muted-foreground" />
                  <th className="px-4 py-3 font-semibold text-turbo">CEO Turbo</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Typical listing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ships", "1–2 business days", "Often weeks"],
                  ["Stuck setting it up?", `Call a real person: ${SITE.phone.display}`, "Email, maybe"],
                  ["Find your review link", "Free tool + printable QR", "On your own"],
                  ["Returns", `${REVIEW_CARD.returnDays} days, no restocking fee`, "Often none"],
                  ["Monthly fee", "$0", "Some charge monthly"],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {k}
                    </th>
                    <td className="px-4 py-3 font-semibold">{a}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-turbo" aria-hidden /> Founder-run in Tampa
            </span>
            <CallLink location="review ad page trust row" icon className="text-chrome hover:text-foreground" />
            <Link to={SETUP_PATH} className="text-turbo underline-offset-4 hover:underline">
              See the 2-minute setup guide
            </Link>
          </p>
        </div>

        <div className="container-x mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="text-2xl font-bold sm:text-3xl">Play by Google's rules</h3>
            <p className="mt-2 text-muted-foreground">Fake or bribed reviews get deleted — and can get a profile suspended. The card is built for the honest way to grow.</p>
          </div>
          <ul className="grid gap-3">
            {RULES.map((r) => (
              <li key={r.text} className="flex items-start gap-3 rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                {r.ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-label="Do" /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6b6b]" aria-label="Don't" />}
                <span className="text-[15px] leading-relaxed">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQList faqs={SHOP_FAQS.filter((f) => FAQ_KEEP.includes(f.q))} title="Review card questions" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-7 text-center sm:p-12">
            <h2 className="h-section">Reviews get you picked. A great Google profile gets you found.</h2>
            <p className="lede mx-auto">Want us to set up and optimize your Google Business Profile too? Christopher will look at it with you on a free 30-minute call.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#buy" className="btn-ignite btn-shine">
                Get my review cards — from {fromPriceLabel}
              </a>
              <BookButton variant="chrome" note="Review ad page — GBP upsell" prefill="I'm getting review cards and want help setting up / optimizing my Google Business Profile.">
                Free Google profile call
              </BookButton>
            </div>
          </div>
        </div>
      </section>

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        Google and the Google logo are trademarks of Google LLC. CEO Turbo is not affiliated with, sponsored or endorsed by Google. Listings above are an illustration, not real businesses. Results depend on how many customers you ask.
      </p>
    </>
  );
}
