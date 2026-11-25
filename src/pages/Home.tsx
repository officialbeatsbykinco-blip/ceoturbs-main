import { Link } from "react-router-dom";
import { ArrowRight, Building2, Check, Globe, Recycle, ShieldCheck, Smartphone, Star, Truck, Wrench } from "lucide-react";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { CallLink } from "@/components/site/CallLink";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { REVIEWS, SITE } from "@/config/site";
import { SHOP_FAQS, SHOP_PERKS, COMPUTERS_PATH } from "@/content/computer-shop";
import { OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { HelpChoose, Listings } from "./ComputerShop";

/**
 * The homepage is the computer shop: laptops and desktops from Shopify, shipped anywhere in the US. Selling computers
 * is the part of the business that scales with ad spend, so the store comes first. Phones get "Text me to help choose",
 * computers get Call (no sms: link). In-person repair, phone repair, recycling, office setup and websites sit in one
 * row underneath and link to their own pages, which keep their local Tampa Bay wording.
 */

const TRUST = [
  { icon: ShieldCheck, t: "Secure checkout by Shopify" },
  { icon: Truck, t: "Ships anywhere in the US" },
  { icon: Star, t: `5.0 on Google · ${REVIEWS.length} reviews` },
];

const MORE: { icon: typeof Wrench; t: string; b: string; to: string }[] = [
  { icon: Smartphone, t: "Phone & iPad repair", b: "Cracked screens and dying batteries, fixed at your door.", to: "/phone-repair-tampa" },
  { icon: Recycle, t: "Free tech recycling", b: "Old computers, phones and TVs picked up free, drives wiped.", to: "/electronics-recycling-tampa" },
  { icon: Building2, t: "Office setup", b: "Desks, monitors, Wi-Fi and printers set up for businesses.", to: OFFICE_SETUP_PATH },
  { icon: Globe, t: "Websites & ads", b: "Websites and ads that bring small businesses more customers.", to: "/grow" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <p className="chip">
            <Truck className="h-3.5 w-3.5 text-turbo" aria-hidden /> Laptops & desktops · ships anywhere in the US
          </p>
          <h1 id="hero" className="mt-4 max-w-3xl text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[56px]">
            <span className="text-chrome-grad">Computers for sale,</span> <span className="text-turbo-grad">ready to use and checked by a real tech.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Laptops, Chromebooks, desktops and gaming PCs with real photos, full specs and a clear price. Buy online, and call or text the tech who sold it with any question, before or after you buy.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#shop" className="btn-ignite btn-shine inline-flex items-center justify-center gap-2 !py-4 !text-lg">
              Shop computers <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <HelpChoose where="home hero" className="!py-4 !text-lg" />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted-foreground">
            {TRUST.map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-2">
                <I className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="shop" className="section scroll-mt-20" aria-labelledby="shop-title">
        <div className="container-x">
          <SectionHeader title={<span id="shop-title">Computers in stock</span>} lede="Photos, specs and price on every listing. Checkout is secure through Shopify, and the total with shipping shows before you pay." />
          <Listings />
          <p className="mt-6 text-[15px] text-muted-foreground">
            Looking for something specific? Tell us your budget and what you'll use it for, and we'll find it.{" "}
            <Link to={COMPUTERS_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">
              See the full computer shop
            </Link>
          </p>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x">
          <SectionHeader title={<span id="why">Why buy a computer from us</span>} />
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

      <section className="section border-t border-border" aria-labelledby="more">
        <div className="container-x">
          <SectionHeader title={<span id="more">We also fix and set up tech</span>} lede="Repairs, phone screens, recycling and office setups in person near us, and websites for businesses anywhere." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FixMyTechLink source="home hero" className="panel flex flex-col p-5 text-left hover:border-turbo/60">
              <Wrench className="h-6 w-6 text-turbo" aria-hidden />
              <span className="mt-3 font-display text-base font-bold">Computer repair</span>
              <span className="mt-1 text-sm text-muted-foreground">Slow, crashing or won't turn on: fixed at your door or remotely.</span>
            </FixMyTechLink>
            {MORE.map(({ icon: I, t, b, to }) => (
              <Link key={t} to={to} className="panel flex flex-col p-5 hover:border-turbo/60">
                <I className="h-6 w-6 text-turbo" aria-hidden />
                <span className="mt-3 font-display text-base font-bold">{t}</span>
                <span className="mt-1 text-sm text-muted-foreground">{b}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQList faqs={SHOP_FAQS} title="Buying a computer" lede="Anything else, call or text. You talk to the tech." />

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel p-6 text-center sm:p-10">
            <h2 id="final" className="h-section">Not sure which one is right?</h2>
            <p className="lede mx-auto">Tell us what you'll use it for and your budget. You get a straight answer from the tech.</p>
            <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
              <a href="#shop" className="btn-ignite inline-flex items-center justify-center gap-2 !py-4 !text-lg">
                Shop computers <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
              <CallLink location="home final" icon className="btn-blue justify-center !py-4 !text-lg">
                Call {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
