// /pc-technician-duluth-ga — the Google Search ad landing page for PC repair and custom PC builds around Duluth, GA.
// Build labor comes from content/pricing.ts. Repairs are quoted before work starts, so no repair price is invented here.
import { Check, MessageSquare, Phone } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { OfficeIntake } from "@/components/blocks/OfficeIntake";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { price } from "@/content/pricing";
import { SITE } from "@/config/site";

const SMS = `sms:${SITE.phone.e164}?&body=${encodeURIComponent("Hi, I need a PC technician. My computer: ")}`;

const FAQS = [
  { q: "Where do you work?", a: `We come to you in Duluth and within about 40 miles of it, including Gwinnett County, Alpharetta, Roswell, Marietta, Atlanta and Decatur. Call or text ${SITE.phone.display} and we'll tell you if we cover your address.` },
  { q: "How much does a repair cost?", a: "We look at the problem, give you a flat price, and confirm it in writing before we start. If you don't want it done at that price, you don't pay for the repair." },
  { q: "How much does a custom PC build cost?", a: `Labor is ${price("build-basic")} basic, ${price("build-standard")} standard and ${price("build-complete")} complete per machine, confirmed in writing before we begin. You choose the parts, or fund an order up front and we buy them and send receipts.` },
  { q: "What do you build or fix?", a: "Gaming PCs, work and studio computers, and small-office machines. We build, install Windows and drivers, remove viruses, speed up slow computers, upgrade parts and move your files to a new machine." },
  { q: "Do you come to my house or office?", a: "Yes. We work at your home or office, so you don't have to drop the computer off." },
];

export default function PcTechnician() {
  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise min-w-0">
            <p className="chip">Duluth, GA and 40 miles around · We come to you</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:text-5xl md:text-[52px]">
              <span className="text-chrome-grad">PC technician near Duluth.</span> <span className="text-turbo-grad">Repairs and custom builds.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Slow, broken or won't turn on? Or want a PC built the right way? We fix it or build it at your home or office, and tell you the flat price before we start.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CallLink location="pc technician hero" icon className="btn-ignite btn-shine justify-center">
                Call {SITE.phone.display}
              </CallLink>
              <a href={SMS} data-call-location="pc technician hero sms" className="btn-chrome inline-flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4" aria-hidden /> Text for a quote
              </a>
            </div>
            <ul className="mt-6 grid max-w-xl gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
              {["Flat price in writing first", "We come to you", "Windows, drivers and data moved over", "Founder-run, Duluth-based"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <OfficeIntake id="quote" service="computer-build-setup" className="min-w-0" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="what">
        <div className="container-x">
          <SectionHeader title={<span id="what">What we do</span>} lede="Two jobs, one technician." />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="panel p-6">
              <h3 className="font-display text-lg font-bold">Computer repair</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {["Slow or freezing computers", "Virus and malware removal", "Windows won't start or keeps crashing", "Upgrades: memory, storage, graphics card", "Move your files to a new computer"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">Flat price, confirmed in writing before we start.</p>
            </div>
            <div className="panel p-6">
              <h3 className="font-display text-lg font-bold">Custom PC builds</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {["Gaming and streaming PCs", "Workstations for editing and music", "Matching machines for small offices", "Clean cable routing, Windows and drivers installed", "Stress tested before we hand it over"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                Labor <span className="font-semibold text-foreground">{price("build-basic")}</span> basic · <span className="font-semibold text-foreground">{price("build-standard")}</span> standard · <span className="font-semibold text-foreground">{price("build-complete")}</span> complete, per machine.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CallLink location="pc technician mid" icon className="btn-ignite">
              <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
            </CallLink>
          </div>
        </div>
      </section>

      <FAQList faqs={FAQS} title="Quick answers" />
    </>
  );
}
