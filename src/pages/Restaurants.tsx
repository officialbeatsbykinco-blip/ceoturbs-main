// /restaurants — the restaurant niche page (ads + outreach land here). Two goals, in order:
// book a free Brand Boost call, and buy a review card for every table. Story: where hungry people
// decide → a 30-second checkup that writes the booking note → what we do → the real Exclusive
// Restaurant & Lounge install (video + the TV menus we made) → why every table needs a card → buy.
// Honest by design: real install, no invented stats, delivery-app fees are the apps' own.
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Check, Loader2, MapPin, Megaphone, Play, ScrollText, Star, Truck, Tv, X } from "lucide-react";
import { REVIEW_CARD, SITE, fromPriceLabel, money2, packSku, type ReviewPack } from "@/config/site";
import { CHECKUP, INSTALL, RESTAURANT_FAQS } from "@/content/restaurants";
import { RULES } from "@/content/review-cards";
import { BuyBox } from "@/components/shop/BuyBox";
import { FAQList } from "@/components/blocks/Basics";
import { Reveal, StepHead, Tick } from "@/components/blocks/Tutorial";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { CardFace, TapDemo, useInView } from "@/components/visuals/ReviewVisuals";
import { recallBusiness, rememberBusiness } from "@/lib/review-link";
import { createPacksCheckout } from "@/lib/shopify";
import { track, serverTrack, type Ecommerce } from "@/lib/track";
import { cn } from "@/lib/utils";

const BOOK_NOTE = "Restaurants page";
const prefillFor = (name: string, extra = "") => `Restaurant${name.trim() ? `: ${name.trim()}` : ""}. I want more customers — help with delivery apps, menus/TV menus, Google & Apple Maps and review cards.${extra}`;

/** The real install, in a phone frame. Loads nothing until tapped. */
function InstallVideo() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const play = () => {
    setPlaying(true);
    track("video_play", { source: "restaurants" });
    requestAnimationFrame(() => void ref.current?.play());
  };
  return (
    <figure className="relative mx-auto w-full max-w-[290px]">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-turbo/25 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[2.2rem] border-[6px] border-[#1a1f29] bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]">
        <video
          ref={ref}
          src={playing ? INSTALL.video : undefined}
          poster={INSTALL.poster}
          width={INSTALL.width}
          height={INSTALL.height}
          controls={playing}
          playsInline
          preload="none"
          className="aspect-[9/16] w-full object-cover"
          aria-label={`Christopher at ${INSTALL.name} in ${INSTALL.place}: the digital menu on their TVs and Google review cards`}
        />
        {!playing && (
          <button type="button" onClick={play} className="group absolute inset-0 grid place-items-center bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-label={`Play video: our install at ${INSTALL.name}`}>
            <span className="grid h-20 w-20 place-items-center rounded-full bg-ignite text-white shadow-[0_0_0_10px_rgba(255,107,26,0.25)] transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
            </span>
            <span className="absolute inset-x-0 bottom-5 px-5 text-center text-sm font-semibold text-white">Watch the install · 0:33</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Real install: {INSTALL.name}, {INSTALL.place}
      </figcaption>
    </figure>
  );
}

/** A TV on the wall, cycling the two menu boards we made — like the real screens do. */
function TvMenus() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!inView || hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % INSTALL.menus.length), 5500);
    return () => clearInterval(t);
  }, [inView, hold]);
  const show = (n: number) => {
    setI(n);
    setHold(true);
    track("restaurants_menu_view", { board: n });
  };
  return (
    <div ref={ref} className="mx-auto w-full max-w-[920px]">
      <div className="relative rounded-[18px] bg-[#0b0d11] p-[1.4%] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="relative aspect-video overflow-hidden rounded-[8px] bg-black">
          {INSTALL.menus.map((m, n) => (
            <img
              key={m.src}
              src={m.src}
              srcSet={`${m.small} 800w, ${m.src} 1600w`}
              sizes="(min-width: 960px) 900px, 100vw"
              alt={m.alt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", n === i ? "opacity-100" : "opacity-0")}
            />
          ))}
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10),transparent_38%)]" aria-hidden />
        </div>
        <span className="absolute bottom-[0.6%] right-[3%] h-1 w-1 rounded-full bg-emerald-400/80" aria-hidden />
      </div>
      <div className="mx-auto h-5 w-[14%] bg-gradient-to-b from-[#1a1f29] to-[#0b0d11]" aria-hidden />
      <div className="mt-4 flex justify-center gap-2">
        {["Entrées board", "Drinks & sides board"].map((l, n) => (
          <button key={l} type="button" onClick={() => show(n)} aria-pressed={n === i} className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors", n === i ? "bg-turbo/15 text-foreground ring-turbo/50" : "text-muted-foreground ring-white/10 hover:text-foreground")}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Top-down dining room: a card on every table, reviews landing while the kitchen cooks. An illustration. */
function DiningRoom({ name }: { name: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hot, setHot] = useState(-1);
  const [count, setCount] = useState(48);
  const tables = 8;
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = -1;
    const t = setInterval(() => {
      let n = Math.floor(Math.random() * tables);
      if (n === last) n = (n + 3) % tables;
      last = n;
      setHot(n);
      setCount((c) => c + 1);
    }, 1700);
    return () => clearInterval(t);
  }, [inView]);
  const label = name.trim() || "Your restaurant";
  return (
    <div ref={ref} className="audit-card relative overflow-hidden rounded-3xl p-4 sm:p-6" role="img" aria-label="Illustration: a dining room with a review card on every table; guests tap their phones and new Google reviews keep coming in">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-[#202124] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)]">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold sm:text-[17px]">{label}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px]">
            <span className="font-medium">4.8</span>
            <span className="inline-flex">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-[#fbbc04] text-[#fbbc04]" aria-hidden />
              ))}
            </span>
            <span key={count} className="dr-count font-medium text-[#1a73e8]">({count})</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-[11px] font-semibold text-[#137333]">New review</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: tables }, (_, n) => (
          <div key={n} className="relative grid aspect-square place-items-center">
            {/* chairs */}
            {["-top-[2%] left-1/2 -translate-x-1/2", "-bottom-[2%] left-1/2 -translate-x-1/2", "left-[-2%] top-1/2 -translate-y-1/2", "right-[-2%] top-1/2 -translate-y-1/2"].map((p) => (
              <span key={p} className={cn("absolute h-[16%] w-[16%] rounded-md bg-white/10", p)} aria-hidden />
            ))}
            <span className={cn("relative grid h-[72%] w-[72%] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#6b4a32,#3a271a)] shadow-[inset_0_2px_6px_rgba(255,255,255,0.12),0_12px_24px_-12px_rgba(0,0,0,0.9)] transition-shadow duration-300", hot === n && "shadow-[0_0_0_3px_hsl(var(--turbo)),0_0_30px_hsl(var(--turbo)/0.6)]")}>
              <span className="absolute left-[18%] top-[22%] h-[30%] w-[30%] rounded-full bg-white/85 shadow-inner" aria-hidden />
              <CardFace className="absolute bottom-[18%] right-[16%] w-[30%] rotate-[-8deg] drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
              {hot === n && (
                <>
                  <span className="nfc-ring absolute h-full w-full rounded-full border-2 border-turbo/70" aria-hidden />
                  <span key={count} className="dr-pop absolute -top-[18%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#fbbc04] px-2 py-0.5 text-[11px] font-bold text-[#202124] sm:text-xs">
                    +1 ★★★★★
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">Illustration — your real count depends on how many guests you ask.</p>
    </div>
  );
}

/** Cheapest set of packs that puts at least one card on every table (ties go to more cards). */
function planPacks(tables: number) {
  const [p1, p2, p5, p10] = (["1", "2", "5", "10"] as const).map((id) => REVIEW_CARD.packs.find((p) => p.id === id)!);
  let best = { n10: 0, n5: 0, n2: 0, n1: tables, cards: tables, price: tables * p1.price };
  for (let n10 = 0; n10 <= Math.ceil(tables / 10); n10++)
    for (let n5 = 0; n5 <= Math.ceil(tables / 5); n5++)
      for (let n2 = 0; n2 <= Math.ceil(tables / 2); n2++) {
        const n1 = Math.max(0, tables - 10 * n10 - 5 * n5 - 2 * n2);
        const cards = 10 * n10 + 5 * n5 + 2 * n2 + n1;
        const price = +(n10 * p10.price + n5 * p5.price + n2 * p2.price + n1 * p1.price).toFixed(2);
        if (price < best.price - 0.02 || (Math.abs(price - best.price) <= 0.02 && cards > best.cards)) best = { n10, n5, n2, n1, cards, price };
      }
  const items = ([[p10, best.n10], [p5, best.n5], [p2, best.n2], [p1, best.n1]] as [ReviewPack, number][]).filter(([, c]) => c > 0).map(([pack, count]) => ({ pack, count }));
  return { ...best, items };
}

function TablePlanner({ name, onName }: { name: string; onName: (v: string) => void }) {
  const id = useId();
  const [tables, setTables] = useState(10);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const plan = planPacks(tables);
  const ecommerce: Ecommerce = {
    currency: REVIEW_CARD.currency,
    value: plan.price,
    items: plan.items.map(({ pack, count }) => ({ item_id: packSku(pack), item_name: REVIEW_CARD.fullName, item_variant: pack.label, price: pack.price, quantity: count })),
  };
  const server = () => ({ value: ecommerce.value, currency: ecommerce.currency, contentName: REVIEW_CARD.fullName, contentIds: ecommerce.items.map((i) => i.item_id), numItems: ecommerce.items.reduce((n, i) => n + i.quantity, 0) });
  const buy = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (busy) return;
    rememberBusiness(name);
    serverTrack("add_to_cart", track("add_to_cart", { pack: "tables", tables, source: "restaurants" }, { ecommerce }), server());
    setBusy(true);
    setErr(false);
    try {
      const url = await createPacksCheckout(plan.items, name);
      serverTrack("begin_checkout", track("begin_checkout", { pack: "tables", tables, checkout: "shopify" }, { ecommerce }), server());
      setTimeout(() => window.location.assign(url), 250);
    } catch {
      setBusy(false);
      setErr(true);
    }
  };
  return (
    <div className="audit-card rounded-3xl p-5 sm:p-8">
      <h3 className="font-display text-2xl font-bold sm:text-3xl">A card on every table</h3>
      <p className="mt-1 text-sm text-muted-foreground">Slide to your table count. We pick the cheapest packs for you.</p>
      <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <label htmlFor={`${id}-t`} className="flex items-end justify-between gap-3 text-sm font-medium text-chrome">
              <span>Tables (plus counter / bar spots)</span>
              <span className="font-display text-3xl font-bold text-foreground">{tables}</span>
            </label>
            <input id={`${id}-t`} type="range" min={1} max={40} value={tables} onChange={(e) => setTables(Number(e.target.value))} onPointerUp={() => track("restaurants_tables", { tables })} className="mt-2 w-full accent-[hsl(var(--ignite))]" />
          </div>
          <div>
            <label htmlFor={`${id}-n`} className="text-sm font-medium text-chrome">
              Restaurant name <span className="text-muted-foreground">(goes on your order)</span>
            </label>
            <input id={`${id}-n`} value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Exclusive Restaurant & Lounge" autoComplete="organization" maxLength={60} className="field mt-2 !text-[17px]" />
          </div>
        </div>
        <div className="grid content-center rounded-2xl bg-white/[0.03] p-6 text-center ring-1 ring-white/5" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {plan.items.map(({ pack, count }) => `${count} × ${pack.label}`).join(" + ")}
            {plan.cards > tables && ` (${plan.cards} cards)`}
          </p>
          <p className="mt-2 font-display text-5xl font-bold text-turbo-grad">{money2(plan.price)}</p>
          <p className="mt-1 text-sm font-semibold">{money2(plan.price / tables)} per table · one time</p>
          <a href="#buy" onClick={buy} aria-busy={busy} className="btn-ignite btn-shine mt-5 w-full !py-4 !text-base">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Opening secure checkout…
              </>
            ) : (
              <>Get {plan.cards} table cards</>
            )}
          </a>
          {err && (
            <p className="mt-3 text-sm text-[#ff9b9b]">
              Checkout didn't open. Order a pack below, or call <CallLink location="restaurants table planner error" className="font-semibold text-foreground underline" />.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Free US shipping · secure Shopify checkout · $0/month</p>
        </div>
      </div>
    </div>
  );
}

/** 30-second checkup: every "no" becomes part of the booking note, so the call starts on their gaps. */
function Checkup({ name }: { name: string }) {
  const [ans, setAns] = useState<Record<string, boolean>>({});
  const answered = Object.keys(ans).length;
  const missing = CHECKUP.filter((c) => ans[c.id] === false);
  const set = (cid: string, v: boolean) => {
    setAns((a) => {
      const next = { ...a, [cid]: v };
      if (Object.keys(next).length === CHECKUP.length && Object.keys(a).length < CHECKUP.length) track("restaurants_checkup_done", { missing: CHECKUP.filter((c) => next[c.id] === false).length });
      return next;
    });
  };
  const note = missing.length ? ` Missing: ${missing.map((m) => m.fix).join(", ")}.` : "";
  return (
    <div className="audit-card rounded-3xl p-5 sm:p-8">
      <h3 className="font-display text-2xl font-bold sm:text-3xl">The 30-second restaurant checkup</h3>
      <p className="mt-1 text-sm text-muted-foreground">Tap yes or no. Be honest — nobody's watching.</p>
      <ul className="mt-6 grid gap-2.5">
        {CHECKUP.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5">
            <span className="text-[15px] leading-snug sm:text-base">{c.q}</span>
            <span className="flex shrink-0 gap-1.5">
              {[
                { v: true, l: "Yes", on: "bg-emerald-400/20 text-emerald-300 ring-emerald-400/50" },
                { v: false, l: "No", on: "bg-ignite/20 text-ignite ring-ignite/50" },
              ].map((b) => (
                <button key={b.l} type="button" onClick={() => set(c.id, b.v)} aria-pressed={ans[c.id] === b.v} className={cn("min-h-[40px] min-w-[52px] rounded-xl px-3 text-sm font-semibold ring-1 transition-colors", ans[c.id] === b.v ? b.on : "text-muted-foreground ring-white/10 hover:text-foreground")}>
                  {b.l}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div aria-live="polite" className="mt-6">
        {answered === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Every “No” is a place hungry customers look for you — and find someone else.</p>
        ) : missing.length === 0 ? (
          <p className="rounded-2xl bg-emerald-400/10 p-4 text-center font-semibold ring-1 ring-emerald-400/30">So far so good. Let's make sure it's all actually bringing people in.</p>
        ) : (
          <div className="rounded-2xl bg-ignite/10 p-5 ring-1 ring-ignite/30">
            <p className="font-display text-xl font-bold sm:text-2xl">
              You're missing {missing.length} {missing.length === 1 ? "place" : "places"} customers look.
            </p>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {missing.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-[15px]">
                  <X className="h-4 w-4 shrink-0 text-ignite" aria-hidden /> {m.fix}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">We set up all of these. Book the free call and we'll start with this list.</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <BookButton note={`${BOOK_NOTE} — checkup`} prefill={prefillFor(name, note)}>
            {missing.length ? "Fix my list — book a free call" : "Book a free Brand Boost call"}
          </BookButton>
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  { icon: Truck, title: "DoorDash, Uber Eats & Grubhub", body: "New store set up, or your messy one rebuilt: photos for every plate, clear names, correct prices, add-ons and hours." },
  { icon: Tv, title: "Digital menus on your TVs", body: "We design menu boards that sell — photos, big prices, a lunch special, a “make it a meal” upsell — and install them on your TVs." },
  { icon: ScrollText, title: "Printed table & to-go menus", body: "Table, counter and to-go menus that match your TVs and your delivery apps, so you look like one restaurant everywhere." },
  { icon: MapPin, title: "Google Maps & Apple Maps", body: "Right hours, menu, food photos and a one-tap order or call button, so “food near me” searches find you open." },
  { icon: Star, title: "A review card on every table", body: "Guests tap their phone on the card and your Google review form opens. More reviews, higher on the map." },
  { icon: Megaphone, title: "Ads that fill tables", body: "When the basics are set, local Meta and Google ads that send nearby people to your door or your delivery page." },
];

export default function Restaurants() {
  const [name, setName] = useState("");
  useEffect(() => setName((b) => b || recallBusiness()), []);
  const onName = (v: string) => {
    setName(v);
    rememberBusiness(v);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pb-12 pt-24 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo opacity-70" aria-hidden />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="chip">For restaurants, lounges &amp; food spots</p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.02] sm:text-7xl">
              <span className="text-chrome-grad">Get found. Get ordered from.</span> <span className="text-turbo-grad">Get packed out.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted-foreground sm:text-xl">
              We put your restaurant on DoorDash, Uber Eats and Grubhub, make menus that sell — printed and on your TVs — get you right on Google and Apple Maps, and put a tap-to-review card on every table.
            </p>
            <ul className="mt-6 grid max-w-xl gap-2.5">
              <Tick>
                <span className="font-semibold">Not on the delivery apps yet?</span> <span className="text-muted-foreground">We set it up with you.</span>
              </Tick>
              <Tick>
                <span className="font-semibold">On them, but it looks rough?</span> <span className="text-muted-foreground">We fix the menu and photos.</span>
              </Tick>
              <Tick>
                <span className="font-semibold">Menu taped to the wall?</span> <span className="text-muted-foreground">We put it on TVs.</span>
              </Tick>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton note={`${BOOK_NOTE} — hero`} prefill={prefillFor(name)} className="btn-shine">
                Book my free restaurant call
              </BookButton>
              <a href="#tables" onClick={() => track("restaurants_cards_jump", { from: "hero" })} className="btn-chrome">
                Review cards for every table
              </a>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Free 30-minute call with Christopher</span>
              <CallLink location="restaurants hero" icon className="text-chrome hover:text-foreground" />
            </p>
          </div>
          <InstallVideo />
        </div>
      </section>

      {/* WHERE PEOPLE DECIDE + CHECKUP */}
      <section id="checkup" className="section scroll-mt-28 border-t border-border">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <StepHead n={1} kicker="Where hungry people decide" title={<>Nobody's hungry and patient. <span className="text-turbo-grad">They pick what they find first.</span></>} lede="When someone wants food they open Google Maps, Apple Maps or a delivery app, look at photos, stars and prices — and order. If you're not there, or you look worse than the spot down the street, you never even get a chance." />
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {[
                { t: "Google & Apple Maps", s: "“food near me”" },
                { t: "DoorDash · Uber Eats · Grubhub", s: "the couch crowd" },
                { t: "Your stars & reviews", s: "the 2-second decision" },
                { t: "The menu on your wall", s: "what they add to the order" },
              ].map((x) => (
                <li key={x.t} className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                  <p className="font-semibold leading-snug">{x.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{x.s}</p>
                </li>
              ))}
            </ul>
          </div>
          <Checkup name={name} />
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section border-t border-border">
        <div className="container-x">
          <StepHead n={2} kicker="What we do" title={<>Everything between hungry and <span className="text-turbo-grad">“order placed.”</span></>} lede="One person to call for the apps, the menus, the maps and the reviews — and we keep working with you after it's live." />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, n) => (
              <Reveal as="li" key={s.title} delay={n * 60} className="panel p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-turbo/15 ring-1 ring-turbo/30">
                  <s.icon className="h-6 w-6 text-turbo" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookButton note={`${BOOK_NOTE} — services`} prefill={prefillFor(name)}>
              Get my restaurant plan — free call
            </BookButton>
            <span className="text-sm text-muted-foreground">Fixed price after the call. No surprise monthly fees.</span>
          </div>
        </div>
      </section>

      {/* REAL WORK */}
      <section id="work" className="section scroll-mt-28 border-t border-border">
        <div className="container-x">
          <StepHead n={3} kicker="Real work, real restaurant" title={<>{INSTALL.name}. <span className="text-turbo-grad">Menus made and on their TVs.</span></>} lede={`We designed the entrée and drinks boards for ${INSTALL.name} in ${INSTALL.place} and installed them on their TVs — plus review cards for their tables. This is the actual menu, not a template.`} />
          <div className="mt-10">
            <TvMenus />
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {[
              { t: "A photo of every plate", s: "People order what they can see. No guessing what “stew chicken” looks like." },
              { t: "Prices big and clear", s: "Small and large side by side, so nobody holds up the line asking." },
              { t: "Lunch special in the corner", s: "Always on screen — a reason to come back between 11 and 2." },
              { t: "“Make it a meal” upsell", s: "Sides and cold drinks right next to the plates. Bigger tickets, no pushy upsell." },
            ].map((x) => (
              <li key={x.t} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                <span>
                  <span className="block font-semibold">{x.t}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{x.s}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <BookButton note={`${BOOK_NOTE} — menus`} prefill={prefillFor(name, " I want TV menus like Exclusive Restaurant & Lounge.")}>
              I want menus like this
            </BookButton>
          </div>
        </div>
      </section>

      {/* WHY EVERY TABLE */}
      <section id="tables" className="section scroll-mt-28 border-t border-border">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <StepHead n={4} kicker="Why every table needs one" title={<>Every table without a card is a 5-star review <span className="text-turbo-grad">walking out the door.</span></>} lede="The best moment to ask for a review is when the plate is clean and they're still smiling — at the table. Not three days later, when they've forgotten your name." />
              <ul className="mt-6 space-y-2.5">
                <Tick>
                  <span className="font-semibold">Drop it with the check</span> <span className="text-muted-foreground">or keep one standing on every table.</span>
                </Tick>
                <Tick>
                  <span className="font-semibold">They tap, your Google review form opens.</span> <span className="text-muted-foreground">No app, no searching your name.</span>
                </Tick>
                <Tick>
                  <span className="font-semibold">More reviews, higher on Google Maps</span> <span className="text-muted-foreground">— where “food near me” decides who eats where.</span>
                </Tick>
              </ul>
              <p className="mt-6 rounded-2xl bg-white/[0.03] p-4 text-[17px] font-semibold ring-1 ring-white/5">Your servers already ask “how was everything?” The card turns “it was great!” into a review that stays up.</p>
            </div>
            <DiningRoom name={name} />
          </div>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
            <TapDemo business={name} />
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">Type your restaurant name — watch a guest review you.</h3>
              <input value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Exclusive Restaurant & Lounge" autoComplete="organization" aria-label="Your restaurant name" className="field mt-4 !text-[17px]" maxLength={60} />
              <ol className="mt-5 grid gap-2.5">
                {["Guest taps their phone on the table card", `${name.trim() || "Your restaurant"}'s Google review form opens`, "Stars, one line, post — about 10 seconds"].map((t, i) => (
                  <li key={t} className="flex items-center gap-3 text-[16px]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-turbo/10 font-display text-sm font-bold text-turbo">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-14">
            <TablePlanner name={name} onName={onName} />
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">No “free dessert for a review”</h3>
              <p className="mt-2 text-muted-foreground">Google removes reviews that were paid for with freebies — and can penalize the listing. Ask every guest the same way. The card makes that easy.</p>
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
        </div>

        <div className="container-x mt-16 [&_#buy]:scroll-mt-6">
          <h3 className="mb-6 text-2xl font-bold sm:text-3xl">Just want to try one first?</h3>
          <BuyBox business={name} onBusiness={onName} headingLevel="h2" stickyBar={false} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section border-t border-border">
        <div className="container-x">
          <StepHead n={5} kicker="How it works" title={<>Three steps. <span className="text-turbo-grad">You keep cooking.</span></>} />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Free 30-minute call", s: "We look at your Google, Apple Maps and delivery listings together and find what's costing you orders." },
              { t: "A fixed price", s: "You get one clear plan — apps, menus, TVs, maps, cards — with a price before any work starts." },
              { t: "We set it up and stay with you", s: "We build it, install it and keep it updated when your menu, prices or hours change." },
            ].map((x, n) => (
              <li key={x.t} className="panel p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-turbo/10 font-display text-lg font-bold text-turbo ring-1 ring-turbo/40">{n + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{x.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{x.s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQList faqs={RESTAURANT_FAQS} title="Restaurant questions" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-7 text-center sm:p-12">
            <h2 className="h-section">Let's get your restaurant packed out.</h2>
            <p className="lede mx-auto">Free 30-minute call. Bring your menu — we'll show you exactly where you're losing orders and what it costs to fix.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <BookButton note={`${BOOK_NOTE} — final`} prefill={prefillFor(name)} className="btn-shine">
                Book my free restaurant call
              </BookButton>
              <a href="#tables" onClick={() => track("restaurants_cards_jump", { from: "final" })} className="btn-chrome">
                Table cards — from {fromPriceLabel}
              </a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Rather talk now? Call or text <CallLink location="restaurants final cta" className="font-semibold text-foreground underline underline-offset-4" />.
            </p>
          </div>
        </div>
      </section>

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        DoorDash, Uber Eats, Grubhub, Google and Apple are trademarks of their owners. {SITE.name} is not affiliated with or endorsed by them; each app sets its own fees and approval rules. The dining room above is an illustration.
      </p>
    </>
  );
}

