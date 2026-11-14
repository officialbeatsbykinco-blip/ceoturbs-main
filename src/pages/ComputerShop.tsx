// /computers — the computer shop. Listings come from Shopify (src/lib/computers.ts); checkout is Shopify's.
// /computers/:handle renders one listing (ComputerProduct).
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Cpu, Globe, Laptop, MapPin, MessageSquare, Monitor, Smartphone, Wrench } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { CallLink } from "@/components/site/CallLink";
import { PhoneOnly } from "@/components/booking/BookOrText";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { SITE } from "@/config/site";
import { SHOP_FAQS, SHOP_PERKS, computerPath } from "@/content/computer-shop";
import { itPrice } from "@/content/pricing";
import { IT_SERVICES_PATH } from "@/content/tech-pages";
import { KINDS, conditionOf, kindsOf, money, sized, useComputers, type Computer, type ComputerKind } from "@/lib/computers";
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
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {img ? (
          <img
            src={sized(img.url, 640)}
            srcSet={`${sized(img.url, 400)} 400w, ${sized(img.url, 640)} 640w, ${sized(img.url, 960)} 960w`}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-[#0a1730]/30">
            <Laptop className="h-16 w-16" aria-hidden />
          </div>
        )}
        {condition && <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">{condition}</span>}
        {!c.available && <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0a1730] ring-1 ring-black/10">Sold</span>}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{c.title}</h3>
        {c.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p>
            <span className="font-display text-2xl font-bold">{money(c.price)}</span>
            {c.compareAt && <span className="ml-2 text-sm text-muted-foreground line-through">{money(c.compareAt)}</span>}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-turbo">
            {c.available ? "View" : "See it"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Listings() {
  const { list, state } = useComputers();
  const [kind, setKind] = useState<ComputerKind | "All">("All");
  const kinds = useMemo(() => KINDS.filter((k) => list.some((c) => kindsOf(c).includes(k))), [list]);
  const shown = (kind === "All" ? list : list.filter((c) => kindsOf(c).includes(kind))).slice().sort((a, b) => Number(b.available) - Number(a.available));

  if (state === "loading")
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading computers">
        {[0, 1, 2].map((i) => (
          <div key={i} className="panel h-[360px] animate-pulse" />
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
      {kinds.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter computers">
          {(["All", ...kinds] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("min-h-[44px] rounded-full px-4 text-sm font-semibold ring-1 transition-colors", kind === k ? "bg-turbo text-white ring-turbo" : "ring-border hover:bg-white/5")}
            >
              {k}
            </button>
          ))}
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <Card key={c.handle} c={c} eager={i < 3} />
        ))}
      </div>
    </>
  );
}

const REPAIRS = [
  { icon: Cpu, title: "Won't turn on or keeps crashing", body: "Dead computers, blue screens, freezing and boot loops diagnosed and fixed.", price: itPrice("it-pc-repair") },
  { icon: Wrench, title: "Upgrades", body: "SSD, memory and parts upgrades that make an old computer fast again.", price: itPrice("it-ssd") },
  { icon: Monitor, title: "Slow, viruses & pop-ups", body: "Cleaned up, sped up and protected. At your door or remotely.", price: itPrice("it-remote") },
  { icon: Smartphone, title: "Phone screens & batteries", body: "Cracked iPhone screens and worn-out batteries replaced at your door.", price: itPrice("it-iphone-battery") },
];

export default function ComputerShop() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <p className="chip">
            <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Tampa Bay computer shop · buy online
          </p>
          <h1 id="hero" className="mt-4 max-w-3xl text-[32px] font-bold leading-[1.05] sm:text-5xl">
            <span className="text-chrome-grad">Computers for sale,</span> <span className="text-turbo-grad">from a Tampa computer tech.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Laptops and desktops you can buy right here. Ask questions first, get it set up at your place in Tampa Bay, and get repairs and upgrades later from the same person.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#shop" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
              Shop computers <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <HelpChoose where="hero" className="!py-4 !text-lg" />
          </div>
        </div>
      </section>

      <section id="shop" className="section scroll-mt-20" aria-labelledby="shop-title">
        <div className="container-x">
          <SectionHeader title={<span id="shop-title">Computers in stock</span>} lede="Photos, specs and price on every listing. Checkout is secure through Shopify." />
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
          <SectionHeader title={<span id="repair">Already have a computer? We fix it.</span>} lede="Anything wrong with a computer, fixed at your door within 40 miles of Temple Terrace and Tampa. Slow Windows computers sped up remotely, anywhere in the world." />
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

