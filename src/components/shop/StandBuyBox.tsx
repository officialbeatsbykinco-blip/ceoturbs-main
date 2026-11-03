import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { REVIEW_CARD, REVIEW_STAND, SITE, STAND_OPTIONS, money2, type StandOption } from "@/config/site";
import { STAND_GALLERY } from "@/content/review-cards";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { StandRequest } from "@/components/shop/StandRequest";
import { createStandCheckout, loadVariants } from "@/lib/shopify";
import { track } from "@/lib/track";
import { rememberBusiness } from "@/lib/review-link";
import { cn } from "@/lib/utils";

/** Counter stand listing: pick the stand or the kit, then straight to Shopify checkout (the request form is only a fallback). */
export function StandBuyBox({ business }: { business: string }) {
  const [id, setId] = useState<StandOption["id"]>("kit");
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const opt = STAND_OPTIONS.find((o) => o.id === id)!;

  useEffect(() => {
    const warm = () => STAND_OPTIONS.forEach((o) => void loadVariants(o.productId).catch(() => {}));
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(warm);
    else setTimeout(warm, 1200);
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const buy = async () => {
    if (busy) return;
    rememberBusiness(business);
    const ecommerce = { currency: "USD", value: opt.price, items: [{ item_id: opt.sku, item_name: opt.name, price: opt.price, quantity: 1 }] };
    track("add_to_cart", { product: opt.id }, { ecommerce });
    setBusy(true);
    try {
      const { url } = await createStandCheckout(opt, business);
      track("begin_checkout", { product: opt.id, checkout: "shopify" }, { ecommerce });
      setTimeout(() => window.location.assign(url), 250);
    } catch {
      setBusy(false);
      setFormOpen(true);
    }
  };

  // Kit vs buying the stand and a 2-card pack separately.
  const kitSave = +(STAND_OPTIONS[0].price + REVIEW_CARD.packs.find((p) => p.id === "2")!.price - STAND_OPTIONS[1].price).toFixed(2);
  return (
    <div className="mt-4 grid gap-5 pb-10 sm:mt-8 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <ProductGallery key={id} items={STAND_GALLERY[id]} badge="NFC tap + QR code" className="lg:sticky lg:top-24 lg:self-start" />
      <div>
        <p className="chip hidden sm:inline-flex">CEO Turbo · Google review stand</p>
        <h2 className="text-[28px] font-bold leading-[1.05] sm:mt-4 sm:text-5xl">{REVIEW_STAND.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-5">
          <p className="font-display text-[32px] font-bold leading-none tabular-nums sm:text-4xl">{money2(opt.price)}</p>
          {opt.id === "kit" && <span className="badge-save">You save {money2(kitSave)}</span>}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground max-sm:hidden">{REVIEW_STAND.tagline} It sits on your counter and works with iPhone and Android, no app for customers.</p>

        <div id="buy-stand" className="mt-4 sm:mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-chrome">Choose</p>
          <div role="radiogroup" aria-label="Choose a bundle" className="mt-2.5 grid grid-cols-2 gap-2 sm:gap-2.5">
            {STAND_OPTIONS.map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={o.id === id} onClick={() => setId(o.id)} className={cn("pack-opt", o.id === id && "is-on")}>
                {"best" in o && o.best && <span className="pack-tag pack-tag-best">Best value</span>}
                <img src={STAND_GALLERY[o.id][0].thumb} alt="" width={200} height={200} loading="lazy" decoding="async" className="mx-auto hidden h-16 w-16 rounded-lg object-cover sm:block" />
                <span className="block text-sm font-semibold sm:mt-1.5">{o.name}</span>
                <span className="block font-display text-base font-bold tabular-nums">{money2(o.price)}</span>
                <span className="block px-1 text-[11px] leading-snug text-muted-foreground">{o.id === "kit" ? "Stand + 2 cards" : "Stand only"}</span>
              </button>
            ))}
          </div>

          <button type="button" onClick={buy} disabled={busy} className="btn-ignite btn-shine mt-4 w-full !py-4 !text-base">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Opening secure checkout…
              </>
            ) : (
              <>
                Buy now — {money2(opt.price)} <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">Apple Pay · Google Pay · Shop Pay · all major cards</p>
          <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-medium leading-tight text-foreground/80 sm:text-xs">
            <li className="trust-tile"><Truck className="mx-auto h-5 w-5 text-turbo" aria-hidden /> Free US shipping</li>
            <li className="trust-tile"><RotateCcw className="mx-auto h-5 w-5 text-turbo" aria-hidden /> 5-day returns</li>
            <li className="trust-tile"><Lock className="mx-auto h-5 w-5 text-turbo" aria-hidden /> Secure checkout</li>
          </ul>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:hidden">{REVIEW_STAND.tagline} It sits on your counter and works with iPhone and Android, no app for customers.</p>
        <ul className="mt-5 grid gap-2 rounded-2xl bg-white/[0.03] p-4 text-sm ring-1 ring-white/5">
          {["White acrylic L-stand, built for a front counter", "NFC tap and QR code in one display", "Opens your Google review form in seconds", ...(opt.id === "kit" ? ["2 NFC tap cards for a truck, chair or second spot"] : [])].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Not affiliated with or endorsed by Google. Questions? Call or text{" "}
          <a href={SITE.phone.href} data-call-location="stand buy box" className="font-semibold text-foreground underline underline-offset-2">
            {SITE.phone.display}
          </a>
        </p>
      </div>
      <StandRequest open={formOpen} onOpenChange={setFormOpen} business={business} />
    </div>
  );
}
