// /office-setup-tampa — the Google & Microsoft Ads landing page for office setup and transformation around
// Tampa: multi-monitor and multi-computer workstations, cable management, printers, networks, Microsoft and
// Google setup, TVs and menu screens. No repair wording here: those ads stay on setup and installation.
// Conversions (Google Ads + UET): book_call from the Cal.com embed, click_to_call / click_to_text on phones.
import { Link } from "react-router-dom";
import { Cable, Calendar, Check, ClipboardCheck, FolderTree, Home, Layers, MapPin, MessageSquare, Monitor, Network, Printer, Tv, Wrench, type LucideIcon } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { InstallBookButton } from "@/components/cta/Actions";
import { OfficeIntake } from "@/components/blocks/OfficeIntake";
import { OfficeTextQuiz } from "@/components/blocks/OfficeTextQuiz";
import { BookOrText, useTexting } from "@/components/booking/BookOrText";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BeforeAfter, OFFICE_BEFORE_AFTER } from "@/components/visuals/BeforeAfter";
import { byId, itPrice, usd } from "@/content/pricing";
import { SETUP_AREAS } from "@/content/service-areas";
import { INSTALL_BOOKING, SITE } from "@/config/site";
import { cn } from "@/lib/utils";


const WHAT: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Monitor, title: "Multi-monitor workstations", body: "Two or three screens mounted, aligned and set up so your windows land where you want them." },
  { icon: Layers, title: "Several computers, one desk", body: "Run a work laptop and a home PC off one keyboard and mouse, with a switch or software. No more juggling." },
  { icon: Cable, title: "Cable management", body: "Every wire routed, tied and labeled under the desk. Looks clean and stays that way." },
  { icon: Printer, title: "Printers & scanners", body: "Network printers that every computer can use, with scan-to-email and scan-to-folder working." },
  { icon: Network, title: "Wi-Fi & network", body: "Strong Wi-Fi in every room, staff and guest networks kept apart, wired desks where it matters." },
  { icon: FolderTree, title: "Microsoft 365 & Google setup", body: "Email, shared drives and folders set up and organized so your team finds files in seconds." },
  { icon: Tv, title: "TVs & menu screens", body: "Lobby and conference TVs mounted and wired. Restaurant menu boards designed and put on your TVs." },
  { icon: Home, title: "Home offices", body: "Desk built, monitors up, computer and printer connected and cables hidden, usually in one visit." },
];

const TIERS = [
  { name: "Desk & computer setup", price: usd(byId("office-basic").price), note: "per desk", items: ["Computer and monitor connected", "Software and updates", "Printer and Wi-Fi connected"] },
  { name: "Full workstation + cable management", price: usd(byId("office-complete").price), note: "per desk", items: ["Multi-monitor mounting", "Cables routed and hidden", "Desk assembly", "Network and printer setup"], popular: true },
  { name: "Whole-office transformation", price: `from ${usd(byId("office-transform-basic").price)}`, note: "quoted in writing", items: ["Every workstation", "Network, Wi-Fi and cameras", "TVs and printers", "Cleanup and staff walkthrough"] },
];

const EXTRAS = [
  ["TV wall mount", `${itPrice("it-tv-mount")}/TV`],
  ["Printer & software setup", itPrice("it-printer")],
  ["Mesh Wi-Fi install", itPrice("it-mesh")],
  ["On-site IT by the hour", `${itPrice("it-business-hour")}/hr`],
] as const;

const STEPS = [
  { icon: MessageSquare, title: "Tell us the space", body: "Call, text a photo or book a time. Number of desks and what you want done." },
  { icon: ClipboardCheck, title: "Flat price in writing", body: "You get the price before we start. You buy the gear, or we buy it at cost with receipts." },
  { icon: Wrench, title: "We set it all up", body: "We build, mount, wire and test everything, walk you through it and leave it clean." },
];

const AREA = SETUP_AREAS.flatMap((r) => r.cities).slice(0, 20);

const FAQS = [
  { q: "How much does an office setup cost?", a: `A single desk with computer setup is ${usd(byId("office-basic").price)}. A full workstation with multi-monitor mounting and cable management is ${usd(byId("office-complete").price)} per desk. Whole-office transformations start at ${usd(byId("office-transform-basic").price)} and are quoted in writing first.` },
  { q: "Can you set me up to use two computers at one desk?", a: "Yes. We set up one keyboard, mouse and monitors to control a work laptop and a personal or second computer, using a KVM switch or software, so you switch with one click." },
  { q: "Do you bring the equipment?", a: "You can buy it, or we buy it at cost and show you the receipts. We'll send you a list of exactly what to get before the visit." },
  { q: "How long does it take?", a: "Most home offices and single desks take 2 to 4 hours. A small office is usually one day, and bigger build-outs get a timeline with the quote." },
  { q: "Do you organize files and accounts too?", a: "Yes. We set up Microsoft 365 or Google Workspace email, shared drives and a simple folder system, and move files over from old computers." },
  { q: "Do you install restaurant menu screens?", a: "Yes. We design the menu boards, mount the TVs and set them up to show your menu, like we've done for restaurants and lounges." },
  { q: "Where do you work?", a: `Tampa and about 40 miles around it, including ${AREA.slice(1, 12).join(", ")} and more. Call or text ${SITE.phone.display} to confirm your address.` },
  { q: "Can you work after hours?", a: "Yes. We regularly set up offices before opening or after closing so your team isn't interrupted." },
];

function Ctas({ where, className }: { where: string; className?: string }) {
  // Phones: the tap-question text flow (#book). Computers: the Cal.com calendar.
  const texting = useTexting();
  return (
    <div className={cn("grid gap-3 sm:flex sm:flex-wrap sm:items-center", className)}>
      {texting ? (
        <a href="#book" data-call-location={`office setup ${where} quiz`} className="btn-ignite btn-shine inline-flex items-center justify-center gap-2">
          <MessageSquare className="h-4 w-4" aria-hidden /> Get my price by text
        </a>
      ) : (
        <InstallBookButton note={`office-setup-${where}`} booking={INSTALL_BOOKING} title="Book your office setup" variant="ignite" className="btn-shine inline-flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden /> Book a time
        </InstallBookButton>
      )}
      <CallLink location={`office setup ${where}`} icon className="btn-chrome justify-center">
        Call {SITE.phone.display}
      </CallLink>
    </div>
  );
}

export default function OfficeSetup() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise min-w-0">
            <p className="chip">
              <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> Tampa Bay + 40 miles · Homes & businesses
            </p>
            <h1 id="hero" className="mt-4 text-[32px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">Messy office?</span> <span className="text-turbo-grad">We set it up and make it work.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Multi-monitor workstations, cable management, printers, Wi-Fi and Microsoft or Google set up and organized. Flat price in writing before we start.
            </p>
            <BeforeAfter {...OFFICE_BEFORE_AFTER} label="office hero" className="mt-6" />
            <p className="mt-2 text-xs text-muted-foreground">A real desk we set up. Drag to compare.</p>
            <Ctas where="hero" className="mt-6" />
          </div>
          <BookOrText
            phone={<OfficeTextQuiz id="book" className="min-w-0" />}
            desktop={<OfficeIntake id="book" service="office-transformation" booking={INSTALL_BOOKING} className="min-w-0" />}
          />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="what">
        <div className="container-x">
          <SectionHeader title={<span id="what">What we set up</span>} lede="One visit, one person, everything working together." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHAT.map((w) => (
              <div key={w.title} className="panel p-5">
                <w.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-base font-bold">{w.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="prices">
        <div className="container-x">
          <SectionHeader title={<span id="prices">Flat prices</span>} lede="Labor only, confirmed in writing before we start. Gear at cost if we buy it for you." />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.name} className={cn("panel flex flex-col p-6", t.popular && "ring-2 ring-turbo")}>
                {t.popular && <span className="chip mb-3 self-start text-xs font-semibold text-turbo">Most booked</span>}
                <h3 className="font-display text-lg font-bold">{t.name}</h3>
                <p className="mt-2">
                  <span className="font-display text-3xl font-bold">{t.price}</span> <span className="text-sm text-muted-foreground">{t.note}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                  {t.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {EXTRAS.map(([k, v]) => (
              <span key={k} className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-muted-foreground">
                {k} <span className="font-semibold text-foreground">{v}</span>
              </span>
            ))}
          </div>
          <Ctas where="prices" className="mt-8" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works</span>} />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="panel p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-bold text-black">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-turbo" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="who">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <img src={SITE.founder.image} alt={SITE.founder.name} width={160} height={160} loading="lazy" className="h-32 w-32 rounded-2xl object-cover ring-1 ring-white/10 sm:h-40 sm:w-40" />
          <div>
            <h2 id="who" className="h-section">One person, start to finish.</h2>
            <p className="lede">
              I'm {SITE.founder.name.split(" ")[0]}, based in Tampa. I plan the setup with you, do the work myself and don't leave until everything works. Need a website or ads for the business too?{" "}
              <Link to="/grow" className="text-turbo underline underline-offset-4">
                I do that as well
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="area">
        <div className="container-x">
          <SectionHeader title={<span id="area">Where we work</span>} lede="Tampa and about 40 miles around it." />
          <ul className="mt-8 flex flex-wrap gap-2">
            {AREA.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-turbo" aria-hidden /> {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQList faqs={FAQS} title="Quick answers" />

      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="panel relative overflow-hidden p-6 text-center sm:p-10">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[700px] -translate-x-1/2 glow-turbo" aria-hidden />
            <h2 id="final" className="h-section relative">Ready for an office that just works?</h2>
            <p className="lede relative mx-auto">Call or text {SITE.phone.display}, or pick a time. Flat price in writing first.</p>
            <Ctas where="final" className="relative mt-7 sm:justify-center" />
          </div>
        </div>
      </section>
    </>
  );
}
