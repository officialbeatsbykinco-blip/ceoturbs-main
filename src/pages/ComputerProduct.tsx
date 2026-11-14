// /computers/:handle — one computer listing from Shopify: photos, specs, options, Buy now (Shopify checkout).
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Laptop, Loader2, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { CallLink } from "@/components/site/CallLink";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { SITE } from "@/config/site";
import { COMPUTERS_PATH } from "@/content/computer-shop";
import { itPrice } from "@/content/pricing";
import { conditionOf, findComputer, money, parseDescription, sized, useComputers, type Computer } from "@/lib/computers";
import { createComputerCheckout } from "@/lib/shopify";
import { newEventId, serverTrack, track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { HelpChoose } from "./ComputerShop";

const numericId = (gid: string) => gid.split("/").pop()!;

function BuyBox({ c }: { c: Computer }) {
  const [picked, setPicked] = useState<Record<string, string>>(() => ({ ...(c.variants.find((v) => v.available) ?? c.variants[0])?.options }));
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const variant = c.variants.find((v) => Object.entries(picked).every(([k, val]) => v.options[k] === val)) ?? null;
  const price = variant?.price ?? c.price;
  const compareAt = variant ? variant.compareAt : c.compareAt;
  const canBuy = !!variant?.available;

  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const buy = async () => {
    if (!variant || busy) return;
    const id = numericId(variant.id);
    const ecommerce = { currency: "USD", value: variant.price, items: [{ item_id: id, item_name: c.title, price: variant.price, quantity: 1 }] };
    const server = { value: variant.price, currency: "USD", contentName: c.title, contentIds: [id], numItems: 1, contentCategory: "computer" };
    serverTrack("add_to_cart", track("add_to_cart", { product: c.handle }, { ecommerce }), server);
    setBusy(true);
    setFailed(false);
    try {
      const url = await createComputerCheckout(variant.id, c.title, c.options.length ? variant.title : undefined);
      serverTrack("begin_checkout", track("begin_checkout", { product: c.handle, checkout: "shopify" }, { ecommerce }), server);
      setTimeout(() => window.location.assign(url), 250);
    } catch {
      setBusy(false);
      setFailed(true);
    }
  };

  return (
    <div id="buy" className="scroll-mt-24">
      <p className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-bold">{money(price)}</span>
        {compareAt && <span className="text-lg text-muted-foreground line-through">{money(compareAt)}</span>}
      </p>

      {c.options.map((o) => (
        <fieldset key={o.name} className="mt-5">
          <legend className="text-sm font-semibold">
            {o.name}: <span className="font-normal text-muted-foreground">{picked[o.name]}</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.values.map((val) => {
              const soldOut = !c.variants.some((v) => v.options[o.name] === val && v.available);
              return (
                <button
                  key={val}
                  type="button"
                  aria-pressed={picked[o.name] === val}
                  onClick={() => setPicked((p) => ({ ...p, [o.name]: val }))}
                  className={cn("min-h-[44px] rounded-xl px-4 text-sm font-semibold ring-1 transition-colors", picked[o.name] === val ? "bg-turbo text-white ring-turbo" : "ring-border hover:bg-white/5", soldOut && "line-through opacity-60")}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <button type="button" onClick={buy} disabled={!canBuy || busy} className="btn-ignite btn-shine mt-6 inline-flex w-full items-center justify-center gap-2 !py-4 !text-lg disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
        {canBuy ? (busy ? "Opening checkout…" : "Buy now") : "Sold"}
      </button>
      {failed && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          Checkout didn't open. Try again, or call or text {SITE.phone.display} and we'll hold it for you.
        </p>
      )}
      <HelpChoose where="product" className="mt-3 w-full" />
      <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
        {[
          [ShieldCheck, "Secure checkout by Shopify. You see shipping or pickup and the total before you pay."],
          [MapPin, "In Tampa Bay? Ask about setup at your place and moving your files over."],
          [Wrench, "Repairs and upgrades later from the same tech."],
        ].map(([Icon, t]) => {
          const I = Icon as typeof ShieldCheck;
          return (
            <li key={t as string} className="flex items-start gap-2">
              <I className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
              {t as string}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Listing({ c }: { c: Computer }) {
  const { specs, paragraphs } = useMemo(() => parseDescription(c.descriptionHtml || c.description), [c]);
  const condition = conditionOf(c);
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    const v = c.variants[0];
    const id = track("view_item", { content_name: c.title, content_category: "computer", content_type: "product", value: c.price, currency: "USD" }, { eventId: newEventId("vc") });
    serverTrack("view_item", id, { value: c.price, currency: "USD", contentName: c.title, contentCategory: "computer", contentIds: v ? [numericId(v.id)] : undefined });
  }, [c]);

  const gallery = c.images.map((i) => ({
    src: sized(i.url, 1200),
    srcSet: `${sized(i.url, 600)} 600w, ${sized(i.url, 1200)} 1200w, ${sized(i.url, 1800)} 1800w`,
    thumb: sized(i.url, 200),
    alt: i.alt,
    w: i.width || 1200,
    h: i.height || 1200,
  }));

  return (
    <>
      <section className="pt-24 sm:pt-28" aria-labelledby="hero">
        <div className="container-x">
          <Link to={COMPUTERS_PATH} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All computers
          </Link>
          <div className="mt-2 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {gallery.length ? (
              <ProductGallery items={gallery} badge={condition ?? undefined} />
            ) : (
              <div className="grid aspect-[5/4] place-items-center rounded-3xl bg-white text-[#0a1730]/30 ring-1 ring-black/5">
                <Laptop className="h-24 w-24" aria-hidden />
              </div>
            )}
            <div className="min-w-0">
              <h1 id="hero" className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                {c.title}
              </h1>
              {c.vendor && c.vendor !== SITE.name && <p className="mt-1 text-sm text-muted-foreground">{c.vendor}</p>}
              <div className="mt-5">
                <BuyBox c={c} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {(specs.length > 0 || paragraphs.length > 0) && (
        <section className="section" aria-labelledby="specs">
          <div className="container-x grid gap-8 lg:grid-cols-[1fr_1fr]">
            {specs.length > 0 && (
              <div>
                <h2 id="specs" className="font-display text-2xl font-bold">
                  Specs
                </h2>
                <dl className="panel mt-4 divide-y divide-border/60">
                  {specs.map(([k, v]) => (
                    <div key={k + v} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 px-5 py-3 text-sm">
                      <dt className="font-semibold">{k}</dt>
                      <dd className="text-muted-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {paragraphs.length > 0 && (
              <div>
                <h2 id={specs.length ? "about-it" : "specs"} className="font-display text-2xl font-bold">
                  About this computer
                </h2>
                <div className="mt-4 grid gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section border-t border-border" aria-labelledby="fix">
        <div className="container-x">
          <div className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
              <div>
                <h2 id="fix" className="font-display text-lg font-bold">
                  Want your old computer fixed or upgraded instead?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Won't turn on, crashing, slow or full of pop-ups: fixed at your door around Tampa. Repairs {itPrice("it-pc-repair")}, remote speed-ups {itPrice("it-remote")} anywhere in the world.
                </p>
              </div>
            </div>
            <FixMyTechLink source="computer listing" className="btn-chrome inline-flex shrink-0 items-center justify-center">
              Get a repair price
            </FixMyTechLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ComputerProduct() {
  const { handle = "" } = useParams();
  const { list, settled } = useComputers();
  const c = list.find((x) => x.handle === handle) ?? findComputer(handle);

  // A listing that loaded live (added after the last deploy): give it its own title and tags.
  useEffect(() => {
    if (!c) return;
    void Promise.all([import("@/seo/computers"), import("@/seo/head")]).then(([{ computerMeta }, { applyHead }]) => applyHead(computerMeta(c)));
  }, [c]);

  // Keyed by listing: going from one computer to another starts with that computer's own options.
  if (c) return <Listing key={c.handle} c={c} />;

  return (
    <section className="pt-28 sm:pt-32" aria-labelledby="hero">
      <div className="container-x max-w-2xl pb-20 text-center">
        {!settled ? (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-turbo" aria-hidden />
            <h1 id="hero" className="mt-4 font-display text-2xl font-bold">
              Loading this computer…
            </h1>
          </>
        ) : (
          <>
            <h1 id="hero" className="font-display text-3xl font-bold">
              This computer has sold or moved.
            </h1>
            <p className="mt-3 text-muted-foreground">See what's in stock now, or tell us what you need and we'll find one.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={COMPUTERS_PATH} className="btn-ignite inline-flex items-center justify-center gap-2">
                <Check className="h-4 w-4" aria-hidden /> See computers in stock
              </Link>
              <CallLink location="computer listing missing" icon className="btn-chrome justify-center">
                Call {SITE.phone.display}
              </CallLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
