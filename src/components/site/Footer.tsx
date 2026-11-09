import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { SERVICES } from "@/content/services";
import { GUIDES, guidePath } from "@/content/guides";
import { IT_SERVICES_PATH, OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { SITE, fromPriceLabel } from "@/config/site";
import { SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH, shirtFromLabel } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH, artistFromLabel } from "@/content/artist-merch";
import { CallLink } from "./CallLink";
import { SocialLinks } from "./SocialLinks";
import { Check } from "lucide-react";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";

const FOOTER_POINTS = [
  "Computers, phones and tablets fixed at your door or remotely",
  "Offices set up: monitors, cables, printers, Wi-Fi",
  "Websites and ads that make the phone ring",
  "Tampa-based, 40 miles around. Price up front",
];

export function Footer({ focus = false }: { focus?: boolean }) {
  const year = 2026;
  if (focus)
    return (
      <footer className="border-t border-border pb-28 pt-10 text-sm text-muted-foreground sm:pb-10">
        <div className="container-x flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name} · {SITE.address.addressLocality}, {SITE.address.addressRegion} ·{" "}
            <CallLink location="footer (ad page)" className="text-foreground hover:text-turbo" />
          </p>
          <p className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </p>
        </div>
        <p className="container-x mt-3 text-xs">This site is not part of the Facebook website or Meta Platforms, Inc. Results shown are from real client campaigns; individual results vary.</p>
      </footer>
    );
  return (
    <footer className="relative overflow-hidden border-t border-border pb-28 pt-20 sm:pb-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 glow-turbo opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="grid items-center gap-10 border-b border-border pb-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-chrome-grad">We fix it, set it up</span>
              <br />
              <span className="text-turbo-grad">and get you customers.</span>
            </p>
            <ul className="mt-6 grid gap-2.5 text-[15px] text-foreground/90">
              {FOOTER_POINTS.map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <FixMyTechLink source="footer" className="btn-ignite btn-shine">Get a repair price</FixMyTechLink>
              <p className="text-sm text-muted-foreground">
                Or call <CallLink location="footer cta" className="font-semibold text-foreground hover:text-turbo" />
              </p>
            </div>
          </div>
          <img src="/img/office/after-640.webp" alt="A three-monitor workstation we set up in Tampa" width={640} height={480} loading="lazy" decoding="async" className="mx-auto w-full max-w-[520px] rounded-2xl ring-1 ring-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tampa tech repair, office setup, websites and ads. Founded by {SITE.founder.name} ({SITE.founder.alternateName}).
            </p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-muted-foreground">
              {SITE.address.addressLocality}, {SITE.address.addressRegion} · {SITE.serviceRadiusMiles} miles around and remote
              <br />
              <CallLink location="footer" icon className="mt-1 min-h-[44px] py-2 font-semibold text-foreground hover:text-turbo" />
              <br />
              <a href={`mailto:${SITE.email}`} className="inline-block py-3 font-semibold text-foreground hover:text-turbo">{SITE.email}</a>
            </address>
            <SocialLinks className="mt-5" />
          </div>
          <FooterCol
            title="Tampa tech help"
            links={[
              { to: IT_SERVICES_PATH, label: "Computer & phone repair" },
              { to: OFFICE_SETUP_PATH, label: "Office setup & cable management" },
              { to: "/services/home-office-setup", label: "Home office setup" },
              { to: "/services/pos-system-setup", label: "POS installation" },
              { to: "/restaurants", label: "Restaurant TVs & menus" },
              { to: "/tampa", label: "Tampa Bay service area" },
            ]}
          />
          <FooterCol
            title="Products"
            links={[
              { to: SHIRTS_PATH, label: `Company t-shirts, from ${shirtFromLabel}` },
              { to: SHOP_PATH, label: `Google review cards, from ${fromPriceLabel}` },
              { to: SETUP_PATH, label: "Review card setup guide" },
            ]}
          />
          <FooterCol
            title="Who we help"
            links={[
              { to: "/grow", label: "Websites & ads" },
              { to: "/app-marketing", label: "Software & app developers" },
              { to: "/artist", label: "Artists" },
              { to: "/producers", label: "Producers & beatmakers" },
              { to: "/visual-artists", label: "Painters & visual artists" },
              { to: "/local-business", label: "Local businesses" },
              { to: "/shopify", label: "Shopify stores" },
              { to: "/tampa", label: "Tampa Bay" },
              { to: "/free-audit", label: "Free SEO, AEO & GEO audit" },
              { to: "/ads-not-converting", label: "Ads not converting? Fix tracking" },
              { to: ARTIST_MERCH_PATH, label: `Artist merch t-shirts — from ${artistFromLabel}` },
            ]}
          />
          <FooterCol title="Services" links={[...SERVICES.map((s) => ({ to: `/services/${s.slug}`, label: s.short })), { to: SHIRTS_PATH, label: "Custom company t-shirts" }]} />
          <FooterCol title="Guides" links={GUIDES.map((g) => ({ to: guidePath(g), label: g.metaTitle.split(" — ")[0].split(":")[0] }))} />
          <FooterCol
            title="Company"
            links={[
              { to: "/portfolio", label: "Portfolio" },
              { to: "/results", label: "Results" },
              { to: "/about", label: "About Christopher" },
              { to: "/book", label: "Book a free call" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
              { to: "/promptshop", label: "Prompt Shop" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Also from Christopher:{" "}
            <a href="https://stackmode.net" className="text-foreground underline underline-offset-4 hover:text-turbo" target="_blank" rel="noopener">
              Stackmode Academy
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <Link to="/privacy-policy" className="inline-block py-2.5 hover:text-foreground">Privacy</Link>
            </li>
            <li>
              <Link to="/terms" className="inline-block py-2.5 hover:text-foreground">Terms</Link>
            </li>
            <li>
              <Link to="/shipping-returns" className="inline-block py-2.5 hover:text-foreground">Shipping &amp; returns</Link>
            </li>
          </ul>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">This site is not part of the Facebook website or Meta Platforms, Inc., and is not endorsed by Google or Microsoft. Results shown are from real client campaigns; individual results vary.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-0.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="block py-3 text-sm text-muted-foreground transition-colors hover:text-foreground sm:py-1.5">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
