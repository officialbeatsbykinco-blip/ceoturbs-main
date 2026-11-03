import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, Loader2, Lock, Phone, ShieldCheck, Smartphone, Truck, Wand2, Zap, Repeat } from "lucide-react";
import { CARD_PROGRAMMING, REVIEW_CARD, SITE, STAND_OPTIONS, money2, packSavings, packSku, type ReviewPack, type StandOption } from "@/config/site";
import { GALLERY, INCLUDED, PRODUCT_POINTS, SETUP_PATH } from "@/content/review-cards";
import { ReviewCard3D } from "@/components/visuals/ReviewVisuals";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { checkReviewLink, rememberBusiness } from "@/lib/review-link";
import { attribution, track, type Ecommerce, serverTrack, visitorId } from "@/lib/track";
import { createCheckout, createStandCheckout, loadVariants } from "@/lib/shopify";

/** The Conversions API copy of a shop event (same values as the Pixel's). */
const serverEcommerce = (e: Ecommerce) => ({ value: e.value, currency: e.currency, contentName: REVIEW_CARD.fullName, contentIds: e.items.map((i) => i.item_id), numItems: e.items.reduce((n, i) => n + i.quantity, 0) });
import { cn } from "@/lib/utils";

const PITCH = "Keep it in your pocket or leave it on the counter. When the job's done, your customer taps their phone on the card and your Google review form opens. No app and no searching.";

const POINT_ICONS = [Smartphone, Zap, Repeat, BadgeCheck];

/** Shop event payload. With the stand: the stand line on top, or the kit alone (2 cards + stand). Programming is its own line. */
const ecommerceFor = (pack: ReviewPack, add?: StandOption, program = false): Ecommerce => {
  const items: Ecommerce["items"] = add?.id === "kit" ? [{ item_id: add.sku, item_name: add.name, price: add.price, quantity: 1 }] : [{ item_id: packSku(pack), item_name: REVIEW_CARD.fullName, item_variant: pack.label, price: pack.price, quantity: 1 }];
  if (add && add.id !== "kit") items.push({ item_id: add.sku, item_name: add.name, price: add.price, quantity: 1 });
  if (program) items.push({ item_id: CARD_PROGRAMMING.sku, item_name: CARD_PROGRAMMING.name, price: CARD_PROGRAMMING.price, quantity: 1 });
  return { currency: REVIEW_CARD.currency, value: +items.reduce((n, i) => n + i.price, 0).toFixed(2), items };
};

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d;
}
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** The product listing: HD gallery, pack picker, buy button and trust details — laid out like a high-converting Shopify PDP. */
export function BuyBox({
  business,
  onBusiness,
  headingLevel = "h1",
  stickyBar = true,
}: {
  business: string;
  onBusiness: (v: string) => void;
  /** h2 when the box sits inside another page that already has its h1. */
  headingLevel?: "h1" | "h2";
  /** Off when the page has its own sticky card bar. */
  stickyBar?: boolean;
}) {
  const H = headingLevel;
  const [packId, setPackId] = useState<ReviewPack["id"]>("2");
  const [withStand, setWithStand] = useState(false);
  const [program, setProgram] = useState(false);
  const [reviewLink, setReviewLink] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyVisible = useRef(false);
  const [busy, setBusy] = useState(false);
  const buyRef = useRef<HTMLAnchorElement>(null);
  const uid = useId();

  const pack = REVIEW_CARD.packs.find((p) => p.id === packId)!;
  const perCard = pack.price / pack.qty;
  const stand = STAND_OPTIONS.find((o) => o.id === "stand")!;
  const kit = STAND_OPTIONS.find((o) => o.id === "kit")!;
  // 2 cards + stand is exactly the kit, so it checks out as the kit at the kit price.
  const asKit = withStand && pack.id === "2";
  const total = +((withStand ? (asKit ? kit.price : pack.price + stand.price) : pack.price) + (program ? CARD_PROGRAMMING.price : 0)).toFixed(2);
  const linkCheck = program && reviewLink.trim() ? checkReviewLink(reviewLink) : null;
  const standSave = asKit ? +(pack.price + stand.price - kit.price).toFixed(2) : 0;

  // Shopping-ad / feed links (?pack=5) open with that pack picked; view_item fires once.
  useEffect(() => {
    const pk = REVIEW_CARD.packs.find((x) => x.id === new URLSearchParams(window.location.search).get("pack"));
    if (pk) setPackId(pk.id);
    const viewed = ecommerceFor(pk ?? REVIEW_CARD.packs.find((x) => x.id === "2")!);
    serverTrack("view_item", track("view_item", { content_name: REVIEW_CARD.fullName }, { ecommerce: viewed }), serverEcommerce(viewed));
    // Back from Shopify checkout (bfcache): re-enable the button.
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    window.addEventListener("pageshow", onShow);
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const warm = () => {
      void loadVariants().catch(() => {});
      for (const o of STAND_OPTIONS) void loadVariants(o.productId).catch(() => {});
    };
    if (ric) ric(warm);
    else setTimeout(warm, 1200);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Delivery estimate depends on today's date, so it's computed in the browser only.
  useEffect(() => {
    const now = new Date();
    setEta(`${fmt(addBusinessDays(now, REVIEW_CARD.shipping.minDays))} – ${fmt(addBusinessDays(now, REVIEW_CARD.shipping.maxDays))}`);
  }, []);

  // Sticky buy bar once the main button scrolls away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Also up front when the box opens the page but its button sits below the first screen on a phone.
    const update = () => setShowBar((window.scrollY > 360 || el.getBoundingClientRect().top < window.innerHeight * 1.3) && !buyVisible.current);
    const io = new IntersectionObserver(([e]) => {
      buyVisible.current = e.isIntersecting;
      update();
    }, { threshold: 0 });
    io.observe(el);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  const onBuy = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (busy) return;
    // A wrong link would be written to a card and shipped, so it stops here. Blank is fine: we ask for it after the order.
    if (linkCheck && !linkCheck.ok) {
      document.getElementById(`${uid}-link`)?.focus();
      return;
    }
    rememberBusiness(business);
    const ecommerce = ecommerceFor(pack, withStand ? (asKit ? kit : stand) : undefined, program);
    serverTrack("add_to_cart", track("add_to_cart", { pack: pack.id, stand: withStand, program }, { ecommerce }), serverEcommerce(ecommerce));
    setBusy(true);
    const link = program ? (linkCheck?.ok ? linkCheck.url : "") : undefined;
    try {
      const { url } = asKit ? await createStandCheckout(kit, business, link) : await createCheckout(pack, business, withStand ? stand : undefined, link);
      const checkoutId = track("begin_checkout", { pack: pack.id, stand: withStand, program, checkout: "shopify" }, { ecommerce });
      serverTrack("begin_checkout", checkoutId, serverEcommerce(ecommerce));
      // Give the pixels a beat to send before leaving the page.
      setTimeout(() => window.location.assign(url), 250);
    } catch {
      setBusy(false);
      setOrderOpen(true);
    }
  };
  const buyHref = "#buy";
  const buyLabel = `Buy now — ${money2(total)}`;

  return (
    <>
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <ProductGallery items={GALLERY} badge="NFC · iPhone & Android" live3d={<ReviewCard3D className="w-full max-w-[300px]" />} className="lg:sticky lg:top-24 lg:self-start" />

        <div>
          <p className="chip hidden sm:inline-flex">CEO Turbo · Google review cards</p>
          <H className="text-[28px] font-bold leading-[1.05] sm:mt-4 sm:text-5xl">
            NFC Google Review Card <span className="text-turbo-grad max-sm:hidden">— tap, review, done.</span>
          </H>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-5">
            <p className="font-display text-[32px] font-bold leading-none tabular-nums sm:text-4xl">{money2(pack.price)}</p>
            {pack.qty > 1 && <p className="text-sm text-muted-foreground max-sm:hidden">{money2(perCard)} per card</p>}
            {packSavings(pack) > 0 && <span className="badge-save">You save {money2(packSavings(pack))}</span>}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground max-sm:hidden">{PITCH}</p>

          <div id="buy" className="mt-4 scroll-mt-24 sm:mt-6">
            <p id={`${uid}-pack`} className="text-xs font-semibold uppercase tracking-[0.14em] text-chrome">How many cards?</p>
            <div role="radiogroup" aria-labelledby={`${uid}-pack`} className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-4 sm:gap-2.5">
              {REVIEW_CARD.packs.map((p) => {
                const on = packId === p.id;
                const tag = p.popular ? "Most popular" : p.id === "10" ? "Best value" : null;
                return (
                  <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => setPackId(p.id)} className={cn("pack-opt", on && "is-on")}>
                    {tag && <span className={cn("pack-tag", p.id === "10" ? "pack-tag-best" : "pack-tag-pop")}>{tag}</span>}
                    <img src={`/img/review-cards/shop-${p.qty}-thumb.webp`} alt="" width={200} height={200} loading="lazy" decoding="async" className="mx-auto hidden h-16 w-16 rounded-lg object-cover sm:block" />
                    <span className="block text-sm font-semibold sm:mt-1.5">{p.label}</span>
                    <span className="block font-display text-base font-bold tabular-nums">{money2(p.price)}</span>
                    <span className="block text-[11px] text-muted-foreground">{p.qty > 1 ? `${money2(p.price / p.qty)}/card` : "Single card"}</span>
                  </button>
                );
              })}
            </div>

            <label className={cn("stand-add mt-3", program && "is-on")}>
              <input type="checkbox" checked={program} onChange={(e) => setProgram(e.target.checked)} className="sr-only" />
              <span className="stand-add-box" aria-hidden>{program && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-turbo/10"><Wand2 className="h-5 w-5 text-turbo" aria-hidden /></span>
              <span className="min-w-0 flex-1 text-sm leading-tight">
                <span className="block font-semibold">Program it for me</span>
                <span className="block text-xs text-muted-foreground">Arrives ready to tap. Tested before it ships.</span>
              </span>
              <span className="shrink-0 font-display text-sm font-bold tabular-nums">+{money2(CARD_PROGRAMMING.price)}</span>
            </label>
            {program && (
              <div className="mt-2 grid gap-2 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5 animate-step">
                <div>
                  <label htmlFor={`${uid}-name`} className="mb-1 block text-xs font-medium text-chrome">Business name on Google</label>
                  <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={business} onChange={(e) => onBusiness(e.target.value)} onBlur={() => rememberBusiness(business)} placeholder="e.g. Fresh Cuts Barbershop" maxLength={100} autoComplete="organization" />
                </div>
                <div>
                  <label htmlFor={`${uid}-link`} className="mb-1 block text-xs font-medium text-chrome">Google review link <span className="font-normal text-muted-foreground">(if you have it)</span></label>
                  <input id={`${uid}-link`} className="field font-mono !text-sm" value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder="https://g.page/r/…/review" inputMode="url" autoComplete="off" spellCheck={false} aria-invalid={linkCheck ? !linkCheck.ok : undefined} />
                  {linkCheck ? (
                    <p className={cn("mt-1.5 text-xs", linkCheck.ok ? "text-ok" : "text-[#ff8080]")} role="status">
                      {linkCheck.message}
                      {!linkCheck.ok && linkCheck.kind === "fixable" && linkCheck.url && (
                        <button type="button" onClick={() => setReviewLink(linkCheck.url!)} className="ml-1.5 font-semibold underline underline-offset-2">Fix it for me</button>
                      )}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-muted-foreground">Don't have it? Leave it blank and we'll find it with you after you order.</p>
                  )}
                </div>
              </div>
            )}

            <label className={cn("stand-add mt-2", withStand && "is-on")}>
              <input type="checkbox" checked={withStand} onChange={(e) => setWithStand(e.target.checked)} className="sr-only" />
              <span className="stand-add-box" aria-hidden>{withStand && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
              <img src="/img/review-cards/hd/stand-front-thumb.webp" alt="" width={200} height={200} loading="lazy" decoding="async" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 text-sm leading-tight">
                <span className="block font-semibold">Add a counter stand</span>
                <span className="block text-xs text-muted-foreground">{asKit ? `Kit price: you save ${money2(standSave)}` : "For a shop counter. Tap or scan."}</span>
              </span>
              <span className="shrink-0 font-display text-sm font-bold tabular-nums">+{money2(asKit ? kit.price - pack.price : stand.price)}</span>
            </label>

            <a ref={buyRef} href={buyHref} onClick={onBuy} aria-busy={busy} className="btn-ignite btn-shine mt-4 w-full !py-4 !text-base">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Opening secure checkout…
                </>
              ) : (
                <>
                  {buyLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </a>
            <p className="mt-2 text-center text-xs text-muted-foreground">Apple Pay · Google Pay · Shop Pay · all major cards</p>

            <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-medium leading-tight text-foreground/80 sm:text-xs">
              <li className="trust-tile"><Truck className="mx-auto h-5 w-5 text-turbo" aria-hidden /> Free US shipping</li>
              <li className="trust-tile"><ShieldCheck className="mx-auto h-5 w-5 text-turbo" aria-hidden /> {REVIEW_CARD.returnDays}-day returns</li>
              <li className="trust-tile"><Lock className="mx-auto h-5 w-5 text-turbo" aria-hidden /> Secure checkout</li>
            </ul>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
              <span>
                {eta ? (
                  <>
                    Order today, get it <span className="font-semibold text-foreground">{eta}</span>.{" "}
                  </>
                ) : null}
                {REVIEW_CARD.shipping.processing}.
              </span>
            </p>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:hidden">{PITCH}</p>

          <ul className="mt-6 grid grid-cols-2 gap-2">
            {PRODUCT_POINTS.map((p, i) => {
              const Icon = POINT_ICONS[i];
              return (
                <li key={p.title} className="rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                  <Icon className="h-4 w-4 text-turbo" aria-hidden />
                  <p className="mt-2 text-sm font-semibold leading-tight">{p.title}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{p.body}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <p className="text-sm font-semibold">What's in the box</p>
            <ul className="mt-2.5 grid gap-1.5 text-sm">
              {INCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-snug text-muted-foreground">
              {REVIEW_CARD.specs.chip} · {REVIEW_CARD.specs.material} · {REVIEW_CARD.specs.size}
            </p>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
            {REVIEW_CARD.guarantee}
          </p>
          <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
            <span>
              Questions before you order? Call or text{" "}
              <a href={SITE.phone.href} data-call-location="shop buy box" className="font-semibold text-foreground underline underline-offset-2">
                {SITE.phone.display}
              </a>{" "}
              ·{" "}
              <Link to={SETUP_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">
                See the setup guide
              </Link>
            </span>
          </p>
        </div>
      </div>

      {/* Sticky buy bar */}
      {stickyBar && (
        <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 lg:pb-3", showBar ? "translate-y-0" : "translate-y-full")} aria-hidden={!showBar}>
          <div className="container-x flex items-center gap-3 !px-0 lg:!px-8">
            <img src="/img/review-cards/hd/card-hero-thumb.webp" alt="" width={200} height={200} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {pack.label}
                {withStand ? " + stand" : ""}
                {program ? " · programmed" : ""} · NFC review card
              </p>
              <p className="text-xs text-muted-foreground">{money2(total)} · free shipping</p>
            </div>
            <div role="radiogroup" aria-label="How many cards" className="hidden gap-1.5 lg:flex">
              {REVIEW_CARD.packs.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={packId === p.id} tabIndex={showBar ? 0 : -1} onClick={() => setPackId(p.id)} className={cn("rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition", packId === p.id ? "bg-turbo text-white ring-turbo" : "ring-border hover:ring-turbo/50")}>
                  {p.label}
                </button>
              ))}
            </div>
            <a href={buyHref} onClick={onBuy} tabIndex={showBar ? 0 : -1} aria-busy={busy} className="btn-ignite !px-5 !py-3 !text-sm">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Opening checkout" /> : <span>Buy now<span className="max-sm:hidden"> — {money2(total)}</span></span>}
            </a>
          </div>
        </div>
      )}

      <OrderDialog open={orderOpen} onOpenChange={setOrderOpen} summary={`${asKit ? kit.name : pack.label}${withStand && !asKit ? " + counter stand" : ""}${program ? " + programming" : ""}`} total={total} packId={pack.id} reviewLink={program ? reviewLink : ""} business={business} />
    </>
  );
}

/** Fallback if Shopify checkout can't be reached: captures the order so it can be invoiced. */
function OrderDialog({ open, onOpenChange, summary, total, packId, reviewLink, business }: { open: boolean; onOpenChange: (v: boolean) => void; summary: string; total: number; packId: ReviewPack["id"]; reviewLink: string; business: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", company_site: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const opened = useRef(0);
  const uid = useId();

  useEffect(() => {
    if (open) {
      opened.current = Date.now();
      setF((x) => ({ ...x, business: x.business || business }));
      if (state !== "done") setState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) return setErr("Enter a valid email.");
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return setErr("Enter a valid phone number.");
    setErr("");
    setState("sending");
    try {
      const eventId = `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, eventId, visitorId: visitorId(), attribution: attribution(), type: "order-request", product: REVIEW_CARD.name, pack: summary, note: reviewLink.trim() ? `Review link: ${reviewLink.trim()}` : undefined, total: money2(total), value: total, elapsedMs: Date.now() - opened.current, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { lead_source: "order_request", value: total, currency: REVIEW_CARD.currency, pack: packId }, { eventId, user: { email: f.email, phone: f.phone, name: f.name, externalId: visitorId() } });
      rememberBusiness(f.business);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-md overflow-y-auto rounded-3xl border-white/10 bg-[hsl(220_34%_6%)] p-6 sm:p-7">
        {state === "done" ? (
          <div className="py-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
              <Check className="h-7 w-7 text-emerald-300" />
            </span>
            <DialogTitle className="mt-4 text-2xl font-bold">Order received</DialogTitle>
            <DialogDescription className="mt-2 leading-relaxed text-muted-foreground">
              We'll text or email your secure payment link for {summary} ({money2(total)}) shortly. Your cards ship as soon as it's paid.
            </DialogDescription>
            <Link to={SETUP_PATH} onClick={() => onOpenChange(false)} className="btn-chrome mt-6">
              Preview the setup guide
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <DialogTitle className="text-2xl font-bold">Order your review cards</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {summary} · <span className="font-semibold text-foreground">{money2(total)}</span>
              {REVIEW_CARD.shipping.free ? " · free shipping" : ""}
            </DialogDescription>
            <div className="mt-5 grid gap-3">
              {(
                [
                  ["name", "Your name", "name", "text"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Mobile phone", "tel", "tel"],
                  ["business", "Business name", "organization", "text"],
                ] as const
              ).map(([k, label, ac, type]) => (
                <div key={k}>
                  <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
                    {label}
                  </label>
                  <input id={`${uid}-${k}`} data-clarity-mask="true" type={type} className="field" value={f[k]} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} autoComplete={ac} maxLength={k === "email" ? 200 : 100} />
                </div>
              ))}
              <label className="hidden" aria-hidden>
                Company site
                <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={(e) => setF((x) => ({ ...x, company_site: e.target.value }))} />
              </label>
            </div>
            {err && (
              <p className="mt-3 text-sm font-medium text-[#ff8080]" role="alert">
                {err}
              </p>
            )}
            {state === "error" && (
              <p className="mt-3 text-sm text-[#ff8080]" role="alert">
                Couldn't send that. Check your connection and try again.
              </p>
            )}
            <button type="submit" disabled={state === "sending"} className="btn-ignite btn-shine mt-5 w-full !py-4">
              {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send my order — {money2(total)}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Nothing is charged now. We'll contact you by email, call or text to confirm and send a secure payment link.{" "}
              <Link to="/privacy-policy" className="underline underline-offset-2">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link to="/shipping-returns" className="underline underline-offset-2">
                Shipping &amp; returns
              </Link>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
