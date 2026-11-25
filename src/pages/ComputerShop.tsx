// /computers — the computer shop. Listings come from Shopify (src/lib/computers.ts); checkout is Shopify's.
// /computers/:handle renders one listing (ComputerProduct).
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Camera, Check, Cpu, Gamepad2, Globe, HardDrive, Keyboard, Laptop, MapPin, MessageSquare, Monitor, PcCase, Smartphone, Truck, Wrench, X } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { CallLink } from "@/components/site/CallLink";
import { PhoneOnly } from "@/components/booking/BookOrText";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { SITE } from "@/config/site";
import { SHOP_FAQS, SHOP_PERKS, computerPath } from "@/content/computer-shop";
import { itPrice } from "@/content/pricing";
import { IT_SERVICES_PATH } from "@/content/tech-pages";
import { KINDS, conditionOf, kindsOf, matchesQuery, money, shipsFree, sized, useComputers, type Computer, type ComputerKind } from "@/lib/computers";
import { smsHref } from "@/lib/sms";
import { cn } from "@/lib/utils";

export const HELP_CHOOSE_TEXT = "Hi Chris, I'm looking for a computer. Budget and what I'll use it for: ";

export function HelpChoose({ where, className }: { where: string; className?: string }) {
  return (
    <PhoneOnly
      desktop={
        <CallLink location={`computer shop ${where}`} icon className={cn("btn-chrome justify-center", className)}>
          Help me choose: {SITE.phone.display}
        </CallLink>
      }
    >
      <a href={smsHref(HELP_CHOOSE_TEXT)} data-call-location={`computer shop ${where} text`} className={cn("btn-blue inline-flex items-center justify-center gap-2", className)}>
        <MessageSquare className="h-4 w-4" aria-hidden /> Text me to help choose
      </a>
    </PhoneOnly>
  );
}

function Card({ c, eager }: { c: Computer; eager?: boolean }) {
  const img = c.images[0];
  const condition = conditionOf(c);
  return (
    <Link to={computerPath(c.handle)} className="panel group flex flex-col overflow-hidden transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-turbo">
      <div className="relative aspect-square overflow-hidden bg-white sm:aspect-[4/3]">
        {img ? (
          <img
            src={sized(img.url, 640)}
            srcSet={`${sized(img.url, 400)} 400w, ${sized(img.url, 640)} 640w, ${sized(img.url, 960)} 960w`}
            sizes="(min-width: 1024px) 30vw, 50vw"
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-[#0a1730]/30">
            <Laptop className="h-16 w-16" aria-hidden />
          </div>
        )}
        {condition && <span className="absolute left-2 top-2 rounded-full bg-black/75 px-2.5 py-0.5 text-[11px] font-semibold text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">{condition}</span>}
        {!c.available && <span className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#0a1730] ring-1 ring-black/10 sm:right-3 sm:top-3 sm:text-xs">Sold</span>}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="line-clamp-3 font-display text-[15px] font-bold leading-snug sm:line-clamp-none sm:text-lg">{c.title}</h3>
        {c.description && <p className="mt-1 hidden text-sm text-muted-foreground sm:line-clamp-2">{c.description}</p>}
        <div className="mt-auto pt-3 sm:pt-4">
          <div className="flex items-end justify-between gap-2">
            <p>
              <span className="font-display text-xl font-bold sm:text-2xl">{money(c.price)}</span>
              {c.compareAt && <span className="ml-2 text-sm text-muted-foreground line-through">{money(c.compareAt)}</span>}
            </p>
            <span className="hidden items-center gap-1 text-sm font-semibold text-turbo sm:inline-flex">
              {c.available ? "View" : "See it"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
          {c.available && shipsFree(c) && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 sm:text-sm">
              <Truck className="h-3.5 w-3.5" aria-hidden /> Free shipping
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

const KIND_ICON: Record<ComputerKind, typeof Laptop> = {
  Laptops: Laptop,
  Desktops: PcCase,
  Gaming: Gamepad2,
  Macs: Laptop,
  "Monitors & TVs": Monitor,
  Accessories: Keyboard,
  "Smart home": Camera,
};

/** Best Buy-style "Shop by category" row: one tile per category that has something in stock. */
export function CategoryTiles() {
  const { list } = useComputers();
  const kinds = KINDS.filter((k) => list.some((c) => kindsOf(c).includes(k)));
  if (!kinds.length) return null;
  return (
    <nav aria-label="Shop by category" className="mt-8">
      <h2 className="font-display text-lg font-bold">Shop by category</h2>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {kinds.map((k) => {
          const I = KIND_ICON[k];
          return (
            <li key={k}>
              <Link to={`/computers?cat=${encodeURIComponent(k)}#shop`} className="panel flex h-full min-h-[88px] flex-col items-center justify-center gap-2 p-3 text-center text-[13px] font-semibold leading-tight transition-colors hover:border-turbo/60 sm:text-sm">
                <I className="h-6 w-6 text-turbo" aria-hidden />
                {k}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const rank = (c: Computer) => (kindsOf(c).some((k) => k === "Laptops" || k === "Desktops") ? 0 : 1);

export function Listings() {
  const { list, state } = useComputers();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const cat = params.get("cat");
  const kind: ComputerKind | "All" = KINDS.includes(cat as ComputerKind) ? (cat as ComputerKind) : "All";
  const setKind = (k: ComputerKind | "All") =>
    setParams(
      (p) => {
        if (k === "All") p.delete("cat");
        else p.set("cat", k);
        return p;
      },
      { replace: true, preventScrollReset: true },
    );
  const clearSearch = () =>
    setParams(
      (p) => {
        p.delete("q");
        return p;
      },
      { replace: true, preventScrollReset: true },
    );
  const kinds = useMemo(() => KINDS.filter((k) => list.some((c) => kindsOf(c).includes(k))), [list]);
  const shown = list
    .filter((c) => (kind === "All" || kindsOf(c).includes(kind)) && (!q || matchesQuery(c, q)))
    // In stock first, then computers (laptops and desktops) before monitors and accessories.
    .sort((a, b) => Number(b.available) - Number(a.available) || rank(a) - rank(b));

  if (state === "loading")
    return (
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Loading products">
        {[0, 1, 2].map((i) => (
          <div key={i} className="panel h-[300px] animate-pulse sm:h-[360px]" />
        ))}
      </div>
    );

  if (!list.length)
    return (
      <div className="panel mt-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="font-display text-xl font-bold">{state === "error" ? "The listings didn't load." : "New computers are being listed now."}</p>
          <p className="mt-1 text-muted-foreground">
            {state === "error" ? "Refresh the page, or ask us what's in stock." : "Tell us your budget and what you'll use it for, and we'll tell you what we have or find one for you."}
          </p>
        </div>
        <HelpChoose where="empty" className="shrink-0" />
      </div>
    );

  return (
    <>
      {q && (
        <p className="mt-6 flex flex-wrap items-center gap-2 text-[15px]">
          <span>
            {shown.length} result{shown.length === 1 ? "" : "s"} for <strong>&ldquo;{q}&rdquo;</strong>
          </span>
          <button type="button" onClick={clearSearch} className="inline-flex min-h-[36px] items-center gap-1 rounded-full px-3 text-sm font-semibold text-turbo ring-1 ring-border hover:bg-white/5">
            <X className="h-3.5 w-3.5" aria-hidden /> Clear search
          </button>
        </p>
      )}
      {kinds.length > 1 && (
        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
          {(["All", ...kinds] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-semibold ring-1 transition-colors", kind === k ? "bg-turbo text-white ring-turbo" : "ring-border hover:bg-white/5")}
            >
              {k}
            </button>
          ))}
        </div>
      )}
      {shown.length ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {shown.map((c, i) => (
            <Card key={c.handle} c={c} eager={i < 4} />
          ))}
        </div>
      ) : (
        <div className="panel mt-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold">Nothing matches that yet. Tell us what you need and we'll find it.</p>
          <HelpChoose where="no results" className="shrink-0" />
        </div>
      )}
    </>
  );
}

const REPAIRS = [
  { icon: Cpu, title: "Won't turn on or keeps crashing", body: "Dead computers, blue screens, freezing and boot loops diagnosed and fixed.", price: itPrice("it-pc-repair") },
  { icon: Wrench, title: "Upgrades", body: "SSD, memory and parts upgrades that make an old computer fast again.", price: itPrice("it-ssd") },
  { icon: Monitor, title: "Slow, viruses & pop-ups", body: "Cleaned up, sped up and protected. At your door or remotely.", price: itPrice("it-remote") },
  { icon: Smartphone, title: "Phone & tablet setup and repair", body: "New iPhone, Android or iPad set up with everything moved over, or a cracked screen or dying battery replaced.", price: itPrice("it-phone-setup") },
  { icon: HardDrive, title: "Files moved over", body: "Photos, files and email moved from your old computer to the new one, or backed up.", price: itPrice("it-data") },
];

export default function ComputerShop() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <p className="chip">
            <Truck className="h-3.5 w-3.5 text-turbo" aria-hidden /> Free shipping on laptops, monitors &amp; accessories
          </p>
          <h1 id="hero" className="mt-4 max-w-3xl text-[32px] font-bold leading-[1.05] sm:text-5xl">
            <span className="text-chrome-grad">Laptops &amp; desktops for sale,</span> <span className="text-turbo-grad">from a real computer tech.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Laptops, desktop computers and gaming PCs you can buy right here, shipped anywhere in the US. Ask questions first, and get help and upgrades later from the same person.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#shop" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
              Shop computers <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <HelpChoose where="hero" className="!py-4 !text-lg" />
          </div>
          <CategoryTiles />
        </div>
      </section>

      <section id="shop" className="section scroll-mt-32" aria-labelledby="shop-title">
        <div className="container-x">
          <SectionHeader title={<span id="shop-title">In stock now</span>} lede="Photos, specs and price on every listing. Checkout is secure through Shopify." />
          <Listings />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x">
          <SectionHeader title={<span id="why">Why buy from us</span>} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SHOP_PERKS.map((p) => (
              <div key={p.title} className="panel p-6">
                <Check className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="repair">
        <div className="container-x">
          <SectionHeader title={<span id="repair">Already have a computer? We fix it.</span>} lede="Slow Windows computers sped up remotely, anywhere. Live near us? Hardware repairs at your door too." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPAIRS.map((r) => (
              <div key={r.title} className="panel flex flex-col p-5">
                <r.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-base font-bold">{r.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.body}</p>
                <p className="mt-3 text-sm font-bold">{r.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FixMyTechLink source="computer shop repair" className="btn-ignite inline-flex items-center justify-center gap-2">
              <Wrench className="h-4 w-4" aria-hidden /> Get a repair price
            </FixMyTechLink>
            <Link to={IT_SERVICES_PATH} className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
              <Globe className="h-4 w-4" aria-hidden /> See every repair and remote support
            </Link>
          </div>
        </div>
      </section>

      <FAQList faqs={SHOP_FAQS} title="Buying a computer" lede="Anything else, call or text. You talk to the tech." />
    </>
  );
}

