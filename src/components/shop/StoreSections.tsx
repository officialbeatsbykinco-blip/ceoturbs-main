import { useId, useState } from "react";
import { ArrowRight, BadgeCheck, Droplets, Mail, MessageSquare, Phone, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { SectionHeader } from "@/components/blocks/Basics";
import { REVIEW_CARD, SITE, money2 } from "@/config/site";
import { monthlyReviews, monthsToGoal, suggestPack } from "@/lib/review-goal";
import { smsHref } from "@/lib/sms";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: Truck, t: "Free US shipping", b: REVIEW_CARD.shipping.processing },
  { icon: Smartphone, t: "iPhone & Android", b: "No app for your customers" },
  { icon: BadgeCheck, t: "Pay once", b: "No subscription, ever" },
  { icon: ShieldCheck, t: `${REVIEW_CARD.returnDays}-day returns`, b: "New and unused, no restocking fee" },
];

/** Four promises under the buy box, so a visitor sees the risk is gone before they scroll. */
export function TrustStrip() {
  return (
    <section className="border-y border-border bg-white/[0.02]" aria-label="Why it's safe to order">
      <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-5 py-6 lg:grid-cols-4">
        {TRUST.map((x) => (
          <li key={x.t} className="flex items-start gap-3">
            <x.icon className="mt-0.5 h-6 w-6 shrink-0 text-turbo" aria-hidden />
            <div>
              <p className="text-sm font-semibold leading-tight">{x.t}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{x.b}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Slider({ label, value, min, max, step = 1, suffix = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">{label}</label>
        <output htmlFor={id} className="font-display text-lg font-bold tabular-nums text-turbo">{value}{suffix}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 h-8 w-full cursor-pointer accent-[hsl(var(--turbo))]" />
    </div>
  );
}

/** Let the visitor put in their own numbers and see what a month of asking is worth. Their math, not ours. */
export function ReviewGoalCalculator({ onPick }: { onPick?: () => void }) {
  const [perWeek, setPerWeek] = useState(25);
  const [askPct, setAskPct] = useState(80);
  const [postPct, setPostPct] = useState(25);
  const [people, setPeople] = useState(2);
  const perMonth = monthlyReviews({ perWeek, askPct, postPct });
  const months = monthsToGoal(50, perMonth);
  const pack = suggestPack(people);

  return (
    <section className="section border-t border-border" aria-labelledby="calc">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeader kicker="Do the math" title={<span id="calc">How many new reviews could you get?</span>} lede="Slide to your real numbers. The answer is your own estimate, so be honest with it." />
        <div className="panel p-5 sm:p-7">
          <div className="grid gap-5">
            <Slider label="Customers a week" value={perWeek} min={5} max={200} step={5} onChange={setPerWeek} />
            <Slider label="Share you hand the card to" value={askPct} min={10} max={100} step={5} suffix="%" onChange={setAskPct} />
            <Slider label="Share of those who post" value={postPct} min={5} max={60} step={5} suffix="%" onChange={setPostPct} />
            <Slider label="People who serve customers" value={people} min={1} max={10} onChange={setPeople} />
          </div>
          <div className="mt-6 rounded-2xl bg-turbo/10 p-4 ring-1 ring-turbo/30" role="status" aria-live="polite">
            <p className="text-sm text-muted-foreground">About</p>
            <p className="font-display text-4xl font-bold text-turbo-grad tabular-nums">{perMonth} new reviews a month</p>
            <p className="mt-1 text-sm">
              {months ? <>That is 50 new reviews in about {months} {months === 1 ? "month" : "months"}.</> : "Raise a slider to see your pace."} A card for each of {people === 1 ? "you" : `your ${people} people`} is the{" "}
              <span className="font-semibold">{pack.label}</span> pack at {money2(pack.price)}.
            </p>
          </div>
          <a href="#buy" onClick={onPick} className="btn-ignite btn-shine mt-5 w-full">
            Get my review cards <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">An estimate from the numbers you entered, not a promise. Real results depend on how many customers you ask and how they feel about the job.</p>
        </div>
      </div>
    </section>
  );
}

const SPECS: [string, string][] = [
  ["Chip", REVIEW_CARD.specs.chip],
  ["Memory", REVIEW_CARD.specs.memory],
  ["Material", REVIEW_CARD.specs.material],
  ["Size", REVIEW_CARD.specs.size],
  ["Finish", REVIEW_CARD.finish],
  ["Battery", "None needed"],
  ["Works with", "iPhone XS and newer, NFC Android phones"],
  ["Ships", REVIEW_CARD.shipping.processing],
];

/** The spec sheet and the guarantee, for the shopper who reads the fine print before paying. */
export function SpecsAndGuarantee() {
  return (
    <section className="section border-t border-border" aria-labelledby="specs">
      <div className="container-x grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader kicker="The card" title={<span id="specs">Made to be handed out.</span>} lede="Credit-card size, waterproof, and it never needs charging." />
          <dl className="mt-8 divide-y divide-border overflow-hidden rounded-2xl ring-1 ring-border">
            {SPECS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 bg-white/[0.02] px-4 py-3 text-sm">
                <dt className="font-semibold">{k}</dt>
                <dd className="text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="panel flex flex-col justify-center p-6 sm:p-8">
          <ShieldCheck className="h-8 w-8 text-turbo" aria-hidden />
          <h3 className="mt-4 font-display text-2xl font-bold">If it doesn't work, send it back.</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">{REVIEW_CARD.guarantee}</p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
            Rain, sweat and wipe-downs are fine. It is made for trucks, chairs and counters.
          </p>
        </div>
      </div>
    </section>
  );
}

const BULK_TEXT = "Hi CEO Turbo, I want review cards for more than one location or a bigger crew. How many: ";

/** The shop with 10+ people or several locations: they text instead of picking a pack. */
export function BulkBand() {
  return (
    <section className="section border-t border-border" aria-labelledby="bulk">
      <div className="container-x">
        <div className="panel grid items-center gap-6 p-6 sm:p-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="chip w-fit">Teams & multiple locations</p>
            <h2 id="bulk" className="h-section mt-3">Need more than 10 cards?</h2>
            <p className="lede">Franchises, salons with a chair per stylist, fleets and restaurants with a card per table: text how many and we will send you a price.</p>
          </div>
          <div className="grid gap-3">
            <a href={smsHref(BULK_TEXT)} data-call-location="bulk band" className="btn-ignite btn-shine">
              <MessageSquare className="h-4 w-4" aria-hidden /> Text us the number
            </a>
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Review cards for my team")}`} className="btn-chrome">
              <Mail className="h-4 w-4" aria-hidden /> Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const CONTACT = [
  { icon: Phone, t: "Call", b: SITE.phone.display, href: SITE.phone.href, loc: "contact band call" },
  { icon: MessageSquare, t: "Text", b: "We answer fast", href: smsHref("Hi CEO Turbo, I have a question about the review cards. My business is: "), loc: "contact band text" },
  { icon: Mail, t: "Email", b: SITE.email, href: `mailto:${SITE.email}`, loc: "contact band email" },
];

/** Three one-tap ways to reach a person. Calls and texts on a computer open the number and a scan code (PhoneHost). */
export function ContactBand({ className }: { className?: string }) {
  return (
    <section className={cn("section border-t border-border", className)} aria-labelledby="contact">
      <div className="container-x">
        <SectionHeader center kicker="Talk to a person" title={<span id="contact">Questions? Come on, we'll answer.</span>} lede="Before you order or after it arrives. A real person replies." />
        <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {CONTACT.map((c) => (
            <li key={c.t}>
              <a href={c.href} data-call-location={c.loc} className="panel flex min-h-[88px] flex-col items-center justify-center gap-1 p-4 text-center transition hover:ring-1 hover:ring-turbo/60">
                <c.icon className="h-6 w-6 text-turbo" aria-hidden />
                <span className="font-semibold">{c.t}</span>
                <span className="break-all text-xs text-muted-foreground">{c.b}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
