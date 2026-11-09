// Tech repair quiz, built for phones and for people who don't like forms: big picture tiles, one question
// per screen, then the whole request typed out for them. On a phone the last tap opens Messages to our
// number with everything filled in; on a computer it takes a name and mobile number, then shows the calendar.
// Either way it fires one Lead (browser + server, same event_id) tagged content_category "tech_repair".
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, BatteryLow, Check, FolderOpen, Gauge, HelpCircle, Laptop, Loader2, Mail, MapPin, MessageSquare, Monitor, Power, Printer, ShieldAlert, Smartphone, Tablet, Tv, Wifi, type LucideIcon,
} from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { CallLink } from "@/components/site/CallLink";
import { IT_BOOKING, SITE } from "@/config/site";
import { DEVICES, EMPTY_TECH, WHEN, WHERE, problemsFor, remoteOk, techLabels, techMessage, zipOk, type DeviceId, type ProblemId, type TechAnswers } from "@/content/tech-quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["device", "problem", "when", "send"] as const;
type Step = (typeof STEPS)[number];
const STEP_NAMES: Record<Step, string> = { device: "Device", problem: "Problem", when: "Timing", send: "Send" };

const DEVICE_ICONS: Record<DeviceId, LucideIcon> = { windows: Laptop, mac: Monitor, iphone: Smartphone, android: Smartphone, tablet: Tablet, other: Printer };
const PROBLEM_ICONS: Record<ProblemId, LucideIcon> = { slow: Gauge, crash: AlertTriangle, dead: Power, virus: ShieldAlert, screen: Monitor, battery: BatteryLow, setup: Mail, data: FolderOpen, printer: Printer, wifi: Wifi, tv: Tv, other: HelpCircle };

/** What a tech lead is worth to Meta's optimizer (an average first job). */
export const TECH_LEAD_VALUE = 150;

export function TechQuiz({ source = "computer-repair-tampa", className, variant = "card" }: { source?: string; className?: string; variant?: "card" | "sheet" }) {
  const uid = useId().replace(/:/g, "");
  const [a, setA] = useState<TechAnswers>(EMPTY_TECH);
  const [step, setStep] = useState<Step>("device");
  const [texting, setTexting] = useState(true);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; zip?: string; phone?: string; pick?: string }>({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => setTexting(canText()), []);

  const go = (next: Step, patch: Partial<TechAnswers> = {}) => {
    if (!startedAt.current) {
      startedAt.current = Date.now();
      track("tech_quiz_start", { source });
    }
    setA((prev) => ({ ...prev, ...patch }));
    setStep(next);
    track("tech_quiz_step", { source, step: next, step_number: STEPS.indexOf(next) + 1 });
    // Keep the question in view on a phone (the tiles can push it below the fold).
    if (variant === "card") top.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const set = (patch: Partial<TechAnswers>) => {
    setA((prev) => ({ ...prev, ...patch }));
    setErrors({});
  };

  const toggle = (id: ProblemId) => {
    setA((prev) => ({ ...prev, problems: prev.problems.includes(id) ? prev.problems.filter((p) => p !== id) : [...prev.problems, id] }));
    setErrors({});
  };

  const index = STEPS.indexOf(step);
  const message = techMessage(a);
  const nameOk = a.name.trim().length >= 2;
  const placeOk = a.where === "remote" || zipOk(a.zip);
  const ready = nameOk && placeOk;

  const lead = (channel: "sms" | "form") => {
    const labels = techLabels(a);
    const user = { name: a.name.trim(), phone: a.phone.trim() || undefined, zip: a.where === "remote" ? undefined : a.zip.trim() || undefined, externalId: visitorId() };
    const eventId = track(
      "generate_lead",
      { lead_source: "tech-quiz", source, channel, value: TECH_LEAD_VALUE, currency: "USD", content_name: "Computer repair Tampa", content_category: "tech_repair", problem: a.problems.join(","), device: a.device, where: a.where, when: a.when },
      { user },
    );
    return sendLead({
      type: "tech-repair",
      service: "tech-quiz",
      channel,
      eventId,
      value: TECH_LEAD_VALUE,
      visitorId: user.externalId,
      quizId: newEventId("t"),
      name: user.name,
      phone: a.phone.trim(),
      smsOptIn: a.smsOptIn,
      problem: labels.problem,
      device: labels.device,
      where: labels.where,
      when: labels.when,
      zip: a.where === "remote" ? "" : a.zip.trim(),
      details: a.details.trim(),
      page: window.location.pathname,
      attribution: attribution(),
      company_site: honeypot,
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : 99_999,
    });
  };

  const check = () => {
    const errs: typeof errors = {};
    if (!nameOk) errs.name = "Add your first name.";
    if (!placeOk) errs.zip = "Add your 5-digit ZIP code.";
    return errs;
  };

  const onText = (e: MouseEvent<HTMLAnchorElement>) => {
    const errs = check();
    if (Object.keys(errs).length) {
      e.preventDefault();
      return setErrors(errs);
    }
    if (done) return;
    setDone(true);
    void lead("sms");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (texting) return;
    const errs = check();
    const digits = a.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) errs.phone = "Enter a valid mobile number.";
    if (Object.keys(errs).length) return setErrors(errs);
    setSending(true);
    await lead("form");
    setSending(false);
    setDone(true);
  };

  const shell = cn(variant === "card" && "rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className);

  if (done && !texting)
    return (
      <div className={shell}>
        <p className="flex items-center gap-2 font-display text-2xl font-bold">
          <Check className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Got it, {a.name.trim().split(/\s+/)[0]}.
        </p>
        <p className="mt-2 text-base text-muted-foreground">We'll text you a price shortly. Want a set time now? Pick one below.</p>
        <InstallCalEmbed className="mt-5" note={`${source}-tech-quiz`} booking={IT_BOOKING} minHeight="560px" />
      </div>
    );

  return (
    <div id={variant === "card" ? "fix" : undefined} ref={top} className={cn("scroll-mt-24", shell)}>
      <p className="font-display text-xl font-bold leading-tight sm:text-2xl">Get your repair price</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground" aria-live="polite">
        Step {index + 1} of {STEPS.length} · {STEP_NAMES[step]}
      </p>
      <p className="mt-3 flex items-start gap-2 rounded-xl bg-turbo/[0.08] px-3 py-2.5 text-sm leading-snug ring-1 ring-turbo/20">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
        <span>
          We come to you within <b>40 miles of Tampa</b>. Slow Windows PC? We can also speed it up remotely.
        </span>
      </p>

      <div key={step} className="mt-4 animate-step">
        {step === "device" && (
          <>
            <Title text="What needs fixing?" />
            <div className="grid grid-cols-2 gap-2.5">
              {DEVICES.map((o) => (
                <Tile key={o.id} icon={DEVICE_ICONS[o.id]} label={o.label} pressed={a.device === o.id} onClick={() => go("problem", a.device === o.id ? {} : { device: o.id, problems: [], where: "home" })} />
              ))}
            </div>
          </>
        )}

        {step === "problem" && (
          <>
            <Title text="What's going on?" />
            <p className="-mt-2 mb-3 text-sm text-muted-foreground">Tap all that apply.</p>
            <div className="grid gap-2">
              {problemsFor(a.device).map((o) => {
                const Icon = PROBLEM_ICONS[o.id];
                const on = a.problems.includes(o.id);
                return (
                  <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={cn(row, on && rowOn)}>
                    <Icon className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
                    <span className="min-w-0 flex-1 text-base font-semibold leading-snug">{o.label}</span>
                    <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border-2", on ? "border-turbo bg-turbo text-white" : "border-border")} aria-hidden>
                      {on && <Check className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.pick && <Err text={errors.pick} />}
            <Nav
              onBack={() => setStep("device")}
              next={() => (a.problems.length ? go("when", remoteOk(a) ? {} : { where: "home" }) : setErrors({ pick: "Tap at least one problem." }))}
              label={a.problems.length > 1 ? `Continue with ${a.problems.length}` : "Continue"}
            />
          </>
        )}

        {step === "when" && (
          <>
            <Title text="How soon?" />
            <div className="flex flex-wrap gap-2">
              {WHEN.map((o) => (
                <Chip key={o.id} label={o.label} on={a.when === o.id} onClick={() => set({ when: o.id })} />
              ))}
            </div>
            {remoteOk(a) && (
              <>
            <p className="mb-2 mt-5 text-lg font-bold">Where should we fix it?</p>
            <div className="grid grid-cols-2 gap-2">
              {WHERE.map((o) => (
                <button key={o.id} type="button" aria-pressed={a.where === o.id} onClick={() => set({ where: o.id })} className={cn(row, "flex-col items-start gap-0.5 !py-3", a.where === o.id && rowOn)}>
                  <span className="text-base font-semibold">{o.label}</span>
                  <span className="text-xs text-muted-foreground">{o.sub}</span>
                </button>
              ))}
            </div>
              </>
            )}
            <label htmlFor={`${uid}-details`} className="mb-1.5 mt-5 block text-sm font-semibold">
              Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea id={`${uid}-details`} data-clarity-mask="true" rows={2} maxLength={300} className="field resize-none" value={a.details} onChange={(e) => set({ details: e.target.value })} placeholder="Laptop model, error message, when it started…" />
            <Nav onBack={() => setStep("problem")} next={() => go("send")} />
          </>
        )}

        {step === "send" && (
          <form onSubmit={onSubmit} noValidate className="grid gap-3">
            <Title text={texting ? "Last step: who's it from?" : "Where do we text your price?"} />
            <div className={cn("grid gap-3", a.where !== "remote" && "grid-cols-[1.4fr_1fr]")}>
              <div>
                <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold">
                  Your name <span className="text-[#c2410c]">*</span>
                </label>
                <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="given-name" maxLength={100} placeholder="First name" aria-invalid={!!errors.name} />
                {errors.name && <Err text={errors.name} />}
              </div>
              {a.where !== "remote" && (
                <div>
                  <label htmlFor={`${uid}-zip`} className="mb-1.5 block text-sm font-semibold">
                    ZIP code <span className="text-[#c2410c]">*</span>
                  </label>
                  <input id={`${uid}-zip`} className="field" value={a.zip} onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} autoComplete="postal-code" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="33602" aria-invalid={!!errors.zip} />
                  {errors.zip && <Err text={errors.zip} />}
                </div>
              )}
            </div>
            {!texting && (
              <div>
                <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-semibold">
                  Mobile number <span className="text-[#c2410c]">*</span>
                </label>
                <input id={`${uid}-phone`} data-clarity-mask="true" type="tel" className="field" value={a.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="(813) 555-0123" aria-invalid={!!errors.phone} />
                {errors.phone && <Err text={errors.phone} />}
              </div>
            )}
            <label className="hidden" aria-hidden>
              Company website
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>

            {texting ? (
              <>
                <p data-clarity-mask="true" className="whitespace-pre-line rounded-xl border-2 border-dashed border-border bg-muted/50 p-3 text-[15px] leading-relaxed">
                  {message}
                </p>
                <a href={smsHref(message)} onClick={onText} data-call-location="tech-quiz" className={cn("btn-ignite btn-shine w-full justify-center !py-4 !text-lg", !ready && "opacity-60")}>
                  <MessageSquare className="h-5 w-5" aria-hidden /> {ready ? "Text it to us" : a.where === "remote" ? "Add your name to send" : "Add your name & ZIP to send"}
                </a>
                <p className="text-center text-sm text-muted-foreground">
                  {done ? "Messages should be open. Tap send and we'll text your price back." : `Opens your Messages to ${SITE.phone.display} with this filled in. Just tap send.`}
                </p>
              </>
            ) : (
              <>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--turbo))]" checked={a.smsOptIn} onChange={(e) => set({ smsOptIn: e.target.checked })} />
                  <span>
                    I agree to receive text messages from CEO Turbo about my request. Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2">Privacy</Link>.
                  </span>
                </label>
                <button type="submit" disabled={sending} className="btn-ignite btn-shine w-full justify-center !py-4 !text-lg">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <>Text me my price <ArrowRight className="h-5 w-5" aria-hidden /></>}
                </button>
              </>
            )}
            <CallLink location="tech quiz call" icon className="btn-chrome w-full justify-center !py-3.5 !text-base">
              Or call {SITE.phone.display}
            </CallLink>
            <button type="button" onClick={() => setStep("when")} className="flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Edit answers
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const row = "flex w-full min-h-[56px] items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 text-left transition-[border-color,background-color,transform] duration-150 hover:border-turbo/60 active:scale-[0.98]";
const rowOn = "border-turbo bg-turbo/10";

function Tile({ icon: Icon, label, pressed, onClick }: { icon: LucideIcon; label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={cn("flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-2 py-3 text-center transition-[border-color,background-color,transform] duration-150 hover:border-turbo/60 active:scale-[0.97]", pressed && rowOn)}>
      <Icon className="h-8 w-8 text-turbo" strokeWidth={1.75} aria-hidden />
      <span className="text-[15px] font-bold leading-tight">{label}</span>
    </button>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("min-h-[48px] rounded-full border-2 px-5 text-base font-semibold transition-colors", on ? "border-turbo bg-turbo text-white" : "border-border bg-card hover:border-turbo/60")}>
      {label}
    </button>
  );
}

function Title({ text }: { text: string }) {
  return <p className="mb-3 text-lg font-bold leading-tight">{text}</p>;
}

function Err({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-sm font-medium text-destructive" role="alert">
      {text}
    </p>
  );
}

function Nav({ onBack, next, label = "Continue" }: { onBack: () => void; next?: () => void; label?: string }) {
  return (
    <div className="mt-4 flex gap-2">
      <button type="button" onClick={onBack} className="btn-chrome !px-4">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back
      </button>
      {next && (
        <button type="button" onClick={next} className="btn-ignite flex-1 !text-base">
          {label} <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

