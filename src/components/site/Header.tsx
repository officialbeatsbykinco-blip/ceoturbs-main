import { Fragment, useEffect, useRef, useState } from "react";
import { CHECK_PATH } from "@/lib/free-check";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Calendar, ChevronDown, Laptop, Menu, MessageSquare, Phone, Search, Wrench, X } from "lucide-react";
import { Logo } from "./Logo";
import { BookButton, InstallBookButton } from "@/components/cta/Actions";
import { IT_SERVICES_PATH, OFFICE_SETUP_PATH, techBooking } from "@/content/tech-pages";
import { COMPUTERS_PATH } from "@/content/computer-shop";
import { SERVICES } from "@/content/services";
import { SITE, fromPriceLabel } from "@/config/site";
import { CallLink } from "./CallLink";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { REVIEWS_AD_PATH, SHOP_PATH, SETUP_PATH } from "@/content/review-cards";
import { QUICK_TECH_TEXT } from "@/lib/sms";
import { CARD_TEXT, QUICK_TEXT, smsHref } from "@/lib/sms";
import { TextQuizButton } from "@/components/quiz/TextQuizButton";
import { cn } from "@/lib/utils";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { ContactButton } from "@/components/cta/ContactChooser";
import { useTexting } from "@/components/booking/BookOrText";

type Item = { to: string; label: string; sub?: string; group?: string };

const SERVICE_GROUPS: Record<string, string> = {
  "home-office-setup": "Office & workspace",
  "office-transformation": "Office & workspace",
  "apartment-home-office-setup": "Office & workspace",
  "school-computer-room-setup": "Office & workspace",
  "computer-build-setup": "Tech & equipment",
  "dj-studio-setup": "Tech & equipment",
  "pos-system-setup": "Tech & equipment",
};
const groupOf = (slug: string) => SERVICE_GROUPS[slug] ?? "Marketing & growth";
const GROUP_ORDER = ["Start here", "Marketing & growth"];
type Menu = { label: string; to: string; items: Item[]; wide?: boolean };

// The cards up front; everything the agency sells sits behind one More menu.
const MENUS: Menu[] = [
  {
    label: "Who we help",
    to: "/local-business",
    items: [
      { to: "/restaurants", label: "Restaurants", sub: "DoorDash, TV menus, Maps & table review cards" },
      { to: "/salons", label: "Salons", sub: "Google profile, bookings & station review cards" },
      { to: "/barbershops", label: "Barbershops", sub: "Walk-ins, Google profile & chair review cards" },
      { to: "/local-business", label: "Local businesses", sub: "More calls, more 5-star reviews" },
      { to: "/artist", label: "Artists", sub: "More listeners, shows, features and merch" },
      { to: "/producers", label: "Producers & beatmakers", sub: "Sell more beats, custom tracks and sessions" },
      { to: "/visual-artists", label: "Painters & visual artists", sub: "Sell originals, prints and commissions" },
      { to: "/shopify", label: "Shopify & online stores", sub: "More traffic that actually buys" },
      { to: "/tampa", label: "Tampa Bay", sub: "Local, founder-run" },
      { to: "/app-marketing", label: "Software & app developers", sub: "More users & installs, zero fluff" },
    ],
  },
  {
    label: "Services",
    to: "/services",
    wide: true,
    items: [
      { to: "/brand-boost", label: "Brand Boost call", sub: "Free 30-min growth plan — start here", group: "Start here" },
      { to: "/pricing", label: "Pricing", sub: "Clear prices — setup once, monthly only where it pays", group: "Start here" },
      { to: "/restaurants", label: "Restaurant growth", sub: "DoorDash & Uber Eats setup, TV menus, Maps, table review cards", group: "Start here" },
      { to: "/app-marketing", label: "Software & app distribution", sub: "Engineered growth for developers & SaaS", group: "Start here" },
      ...SERVICES.filter((s) => groupOf(s.slug) === "Marketing & growth").map((s) => ({ to: `/services/${s.slug}`, label: s.short, sub: s.outcome, group: groupOf(s.slug) })),
    ].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)),
  },
  {
    label: "Results",
    to: "/results",
    items: [
      { to: "/portfolio", label: "Our work", sub: "Live client websites we built" },
      { to: "/results", label: "Ad results", sub: "Real dashboards, real cost per lead" },
      { to: "/guides", label: "Free guides", sub: "Straight answers on growth" },
      { to: "/about", label: "About Christopher", sub: "Who you'll work with" },
    ],
  },
];

/** Tech support, IT and computers: the main business, first in the nav. */
const TECH: Menu = {
  label: "Tech support",
  to: IT_SERVICES_PATH,
  items: [
    { to: IT_SERVICES_PATH, label: "Windows computer repair", sub: "Speed-ups, blue screens, won't turn on" },
    { to: "/phone-repair-tampa", label: "Phone & tablet repair", sub: "Cracked screens, batteries, new phone setup" },
    { to: COMPUTERS_PATH, label: "Computer shop", sub: "Laptops & desktops, ready to use" },
    { to: OFFICE_SETUP_PATH, label: "Office setup & cables", sub: "Desks, monitors, printers, Wi-Fi" },
    { to: "/business-tech-setup-tampa", label: "Business IT setup", sub: "Workstations, network, POS" },
    { to: "/computer-setup-tampa", label: "Computer setup", sub: "New computer moved and ready" },
    { to: "/security-camera-installation-tampa", label: "Security cameras", sub: "Installed and on your phone" },
    { to: "/wifi-installation-tampa", label: "Wi-Fi & internet", sub: "Whole-home and office coverage" },
    { to: "/electronics-recycling-tampa", label: "Tech recycling pickup", sub: "Free pickup of old computers, phones & TVs" },
  ],
};

/** Everything past the main nav links, in one menu. */
const MORE: Menu = {
  label: "More",
  to: "/services",
  items: [
    { to: "/services", label: "All services", sub: "Everything we do" },
    { to: "/pricing", label: "Pricing", sub: "Clear prices for websites and ads" },
    { to: "/artist", label: "Artists", sub: "More listeners and fans" },
    { to: "/producers", label: "Producers", sub: "Get heard, sell more beats" },
    ...MENUS.find((m) => m.label === "Results")!.items,
    { to: "/watch", label: "Videos", sub: "Real campaigns, real numbers" },
    { to: SHIRTS_PATH, label: "Company shirts", sub: "Your logo on tees, no minimum" },
    { to: "/tampa", label: "Tampa Bay", sub: "Where we work in person" },
  ],
};

/** The phone nav bar under the logo: the main services, one tap each, always on screen. */
const QUICK: { to: string; label: string }[] = [
  { to: COMPUTERS_PATH, label: "Shop computers" },
  { to: IT_SERVICES_PATH, label: "Computer repair" },
  { to: "/security-camera-installation-tampa", label: "Cameras" },
  { to: "/electronics-recycling-tampa", label: "Tech recycling" },
  { to: OFFICE_SETUP_PATH, label: "Office setup" },
  { to: "/grow", label: "Websites & ads" },
  { to: SHOP_PATH, label: "Review cards" },
  { to: "/portfolio", label: "Our work" },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn("whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-2.5 xl:text-sm", isActive ? "text-foreground" : "text-muted-foreground");

export function Header({ focus: focusProp = false }: { focus?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // Tech-repair ad pages book a tech visit instead of the agency call. Every page keeps the menu, phones too:
  // a missing nav reads as a broken site.
  const tech = techBooking(pathname);
  const texting = useTexting();
  const focus = focusProp || !!tech;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", open ? "bg-background" : scrolled ? "bg-background/95 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border))]" : "bg-background/95 backdrop-blur-xl")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo className="shrink-0" onNavigate={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          <NavLink to={COMPUTERS_PATH} className={({ isActive }) => cn("mr-1 inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 transition-colors xl:text-sm", isActive ? "bg-turbo/20 text-foreground ring-turbo/60" : "bg-turbo/10 text-turbo ring-turbo/30 hover:bg-turbo/20")}>
            <Laptop className="h-3.5 w-3.5" aria-hidden /> Shop computers
          </NavLink>
          <NavLink to={IT_SERVICES_PATH} className={linkCls}>
            <span className="inline-flex items-center gap-1"><Wrench className="h-3.5 w-3.5" aria-hidden /> Repair</span>
          </NavLink>
          <NavLink to={OFFICE_SETUP_PATH} className={linkCls}>
            Office setup
          </NavLink>
          <Dropdown menu={TECH} active={TECH.items.some((i) => i.to === pathname)} />
          <NavLink to="/grow" className={linkCls}>
            Websites &amp; ads
          </NavLink>
          <NavLink to={SHOP_PATH} className={({ isActive }) => cn(linkCls({ isActive }), "hidden xl:block")}>
            Review cards
          </NavLink>
          <NavLink to={`${CHECK_PATH}?from=nav`} className={({ isActive }) => cn(linkCls({ isActive }), "hidden xl:block")}>
            Free check
          </NavLink>
          <Dropdown menu={MORE} active={MORE.items.some((i) => i.to === pathname)} align="right" />
        </nav>

        <div className="flex items-center gap-2">
          <CallLink location={focus ? "ad page header" : "header"} icon className="hidden min-h-[44px] whitespace-nowrap px-2 text-base font-bold text-foreground transition-colors hover:text-turbo xl:inline-flex" />
          <CallLink location={focus ? "ad page header icon" : "header icon"} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground ring-1 ring-white/10 hover:bg-white/5 xl:hidden">
            <Phone className="h-[18px] w-[18px]" aria-hidden />
            <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
          </CallLink>
          {/* The shop pages have no bottom bar, so their Text button sits up here. */}
          {(pathname === SHOP_PATH || pathname === SHIRTS_PATH || pathname === ARTIST_MERCH_PATH) && (
            <a href={smsHref(pathname === SHOP_PATH ? CARD_TEXT : QUICK_TECH_TEXT)} data-call-location={focus ? "ad page header text" : "header text"} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground ring-1 ring-white/10 hover:bg-white/5 sm:hidden">
              <MessageSquare className="h-[18px] w-[18px]" aria-hidden />
              <span className="sr-only">Text {SITE.name}</span>
            </a>
          )}
          {pathname === "/" || pathname.startsWith(COMPUTERS_PATH) ? (
            <a href={pathname === "/" || pathname === COMPUTERS_PATH ? "#shop" : `${COMPUTERS_PATH}#shop`} className="btn-ignite whitespace-nowrap !px-3 !py-2.5 !text-[13px] sm:!px-4 sm:!text-sm">
              Shop computers
            </a>
          ) : tech && texting ? (
            // Phones get the tap-question text flow, never the calendar.
            pathname.replace(/\/$/, "") === IT_SERVICES_PATH ? (
              <FixMyTechLink source="tech page header" to={`${IT_SERVICES_PATH}#fix`} className="btn-ignite whitespace-nowrap !px-3 !py-2.5 !text-sm">
                Get my price
              </FixMyTechLink>
            ) : (
              <a href="#book" className="btn-ignite whitespace-nowrap !px-3 !py-2.5 !text-sm">
                Get a quote
              </a>
            )
          ) : tech ? (
            <InstallBookButton variant="ignite" note="Tech page header" booking={tech.booking} title={tech.title} className="inline-flex whitespace-nowrap !px-3 !py-2.5 !text-[13px] sm:!px-4 sm:!text-sm">
              Book a visit
            </InstallBookButton>
          ) : pathname === REVIEWS_AD_PATH || pathname === SHOP_PATH ? (
            <a href="#buy" className="btn-ignite !px-3 !py-1.5 text-center !text-[13px] !leading-tight sm:whitespace-nowrap sm:!px-4 sm:!py-2.5 sm:!text-sm">
              Buy Google <br className="sm:hidden" />
              Review Cards
            </a>
          ) : focus ? (
            <BookButton note="Ad page header" className="inline-flex !px-3 !py-2.5 !text-[13px] sm:!px-4 sm:!text-sm">
              <span className="min-[400px]:hidden">Book a call</span>
              <span className="hidden min-[400px]:inline">Book a free call</span>
            </BookButton>
          ) : (
            <ContactButton source="header" className="btn-ignite whitespace-nowrap !px-4 !py-2.5 !text-sm">
              Contact us
            </ContactButton>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {!open && <QuickNav pathname={pathname} />}

      {open && (
        <div id="mobile-menu" className="container-x h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-background pb-32 pt-2 lg:hidden">
          <div className="grid gap-2">
            <FixMyTechLink source="mobile menu" onOpen={() => setOpen(false)} className="btn-ignite justify-between !px-4 !py-4 !text-lg">
              <span className="inline-flex items-center gap-2">
                <Wrench className="h-5 w-5" aria-hidden /> Fix or set up my tech
              </span>
              <span aria-hidden>›</span>
            </FixMyTechLink>
            {[
              [IT_SERVICES_PATH, "Windows computer repair"],
              ["/security-camera-installation-tampa", "Cameras & Ring doorbells"],
              ["/electronics-recycling-tampa", "Free tech recycling pickup · all Tampa Bay"],
              ["/phone-repair-tampa", "Phone & iPad screen and battery repair"],
              [OFFICE_SETUP_PATH, "Office IT setup"],
              ["/grow", "Websites & ads"],
              ["/portfolio", "Websites we built"],
              [SHOP_PATH, `Google review cards · ${fromPriceLabel}`],
              [`${CHECK_PATH}?from=mobile-menu`, "Free Google & website check"],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="panel flex min-h-[56px] items-center justify-between px-4 py-4 text-lg font-semibold">
                {label}
                <span className="text-turbo" aria-hidden>›</span>
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <CallLink location="mobile menu" className="btn-blue inline-flex items-center justify-center gap-2 !py-4 !text-base">
                <Phone className="h-5 w-5" aria-hidden />
                Call
              </CallLink>
              <a href={smsHref(QUICK_TEXT)} data-call-location="mobile menu text" className="btn-chrome inline-flex items-center justify-center gap-2 !py-4 !text-base">
                <MessageSquare className="h-5 w-5 text-turbo" aria-hidden />
                Text
              </a>
            </div>
          </div>
          <Link to="/" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-6 block px-1 py-2 text-base font-medium">
            Home
          </Link>
          <details className="group border-t border-border py-1 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-3 text-base font-medium">
              Computer repair &amp; IT
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="grid gap-1 pb-3">
              <FixMyTechLink source="mobile menu list" onOpen={() => setOpen(false)} className="rounded-xl bg-white/[0.03] px-3 py-3.5 text-sm font-semibold">
                Windows computer repair
              </FixMyTechLink>
              {TECH.items.slice(1).concat([{ to: SHIRTS_PATH, label: "Company t-shirts" }]).map((i) => (
                <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="rounded-xl bg-white/[0.03] px-3 py-3.5 text-sm font-medium">
                  {i.label}
                </Link>
              ))}
            </div>
          </details>
          {MENUS.map((m) => (
            <details key={m.label} className="group border-t border-border py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-3 text-base font-medium">
                {m.label}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="grid gap-1 pb-3">
                {m.items.map((i, idx) => (
                  <Fragment key={i.to + i.label}>
                  {i.group && i.group !== m.items[idx - 1]?.group && <p className="px-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-turbo">{i.group}</p>}
                  <Link to={i.to} onClick={() => setOpen(false)} className="rounded-xl bg-white/[0.03] px-3 py-3.5 text-sm font-medium">
                    {i.label}
                  </Link>
                  </Fragment>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </header>
  );
}

/** Phones and tablets: a row of service links under the logo that scrolls sideways, with the current page lit up. */
function QuickNav({ pathname }: { pathname: string }) {
  const row = useRef<HTMLDivElement>(null);
  const here = pathname.replace(/\/$/, "") || "/";
  // Bring the current page's link into view (it may sit past the right edge).
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && row.current) row.current.scrollLeft = el.offsetLeft - 16;
  }, [here]);
  return (
    <nav aria-label="Services" className="relative border-t border-border/60 lg:hidden">
      <div ref={row} className="no-scrollbar flex h-[52px] items-center gap-1.5 overflow-x-auto px-3">
        {QUICK.map((q) => {
          const on = here === q.to || (q.to !== "/" && here.startsWith(`${q.to}/`));
          return (
            <Link
              key={q.to}
              to={q.to}
              aria-current={on ? "page" : undefined}
              className={cn("inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-semibold ring-1 transition-colors", on ? "bg-turbo text-background ring-turbo" : "bg-card text-foreground ring-border hover:ring-turbo/60")}
            >
              {q.label}
            </Link>
          );
        })}
        <span className="w-2 shrink-0" aria-hidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" aria-hidden />
    </nav>
  );
}

function Dropdown({ menu, active, align = "center" }: { menu: Menu; active: boolean; align?: "center" | "right" }) {
  return (
    <div className="group relative">
      <Link to={menu.to} className={cn("flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-2.5 xl:text-sm", active ? "text-foreground" : "text-muted-foreground")}>
        {menu.label} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
      </Link>
      <div className={cn("invisible absolute top-full pt-2", align === "right" ? "right-0" : "left-1/2 -translate-x-1/2", " opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100", menu.wide ? "w-[560px] max-w-[calc(100vw-2rem)]" : "w-[300px]")}>
        <div className={cn("grid max-h-[75vh] gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[hsl(218_33%_7%)] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]", menu.wide && "dropdown-scroll grid-cols-2")}>
          {menu.items.map((i, idx) => (
            <Fragment key={i.to + i.label}>
              {i.group && i.group !== menu.items[idx - 1]?.group && <p className="col-span-2 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-turbo">{i.group}</p>}
              <Link to={i.to} className="rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 focus-visible:bg-white/10">
                <span className="block text-sm font-semibold text-foreground">{i.label}</span>
                {i.sub && <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{i.sub}</span>}
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
