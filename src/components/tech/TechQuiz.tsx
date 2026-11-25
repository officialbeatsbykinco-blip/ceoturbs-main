// Tech repair quiz, built for phones and for people who don't like forms: big picture tiles, one question
// per screen, then the whole request typed out for them. On a phone the last tap opens Messages to our
// number with everything filled in; on a computer it takes a name and mobile number, then shows the calendar.
// Either way it fires one Lead (browser + server, same event_id) tagged content_category "tech_repair".
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, BatteryLow, BellRing, Cctv, Check, Cpu, FolderOpen, Gauge, Computer, HelpCircle, Info, Laptop, Loader2, Mail, MapPin, MessageSquare, Monitor, Phone, Power, ShieldAlert, Smartphone, type LucideIcon,
} from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { CallLink } from "@/components/site/CallLink";
import { IT_BOOKING, SITE } from "@/config/site";
import { DETAILS_MAX, DEVICES, EMPTY_TECH, NOT_FIXED, WHEN, WHERE, allProblems, problemsFor, remoteOk, techLabels, techMessage, zipOk, type DeviceId, type ProblemId, type TechAnswers } from "@/content/tech-quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, newEventId, serverTrack, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["device", "problem", "when", "send"] as const;
type Step = (typeof STEPS)[number];

const DEVICE_ICONS: Record<DeviceId, LucideIcon> = { laptop: Laptop, desktop: Monitor, mobile: Smartphone, camera: Cctv };
const PROBLEM_ICONS: Record<ProblemId, LucideIcon> = { slow: Gauge, crash: AlertTriangle, dead: Power, virus: ShieldAlert, upgrade: Cpu, setup: Mail, data: FolderOpen, "phone-screen": Smartphone, "phone-battery": BatteryLow, "phone-setup": Smartphone, "phone-transfer": FolderOpen, "phone-email": Mail, "cam-install": Cctv, "cam-doorbell": BellRing, "cam-app": Smartphone, other: HelpCircle };

/** The first question is one tap: a laptop, a desktop, both, a phone or tablet to set up, or cameras to install. */
const pickOf = (id: DeviceId) => ({ id, label: DEVICES.find((d) => d.id === id)!.label, icon: DEVICE_ICONS[id], devices: [id] as DeviceId[] });
// Short labels so all the tiles fit on one phone screen with no scrolling.
const DEVICE_PICKS: { id: string; label: string; sub?: string; icon: LucideIcon; devices: DeviceId[] }[] = [
  { ...pickOf("laptop"), sub: "Repair or speed-up" },
  { ...pickOf("desktop"), label: "Windows desktop", sub: "Or gaming PC" },
  { id: "both", label: "Laptop + desktop", sub: "Both need help", icon: Computer, devices: ["laptop", "desktop"] },
  { ...pickOf("mobile"), label: "Phone or tablet", sub: "Screens, batteries, setup" },
  { ...pickOf("camera"), label: "Cameras or doorbell", sub: "We install them" },
];

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
  const [showDetails, setShowDetails] = useState(false);
  const startedAt = useRef(0);
  const reachedLast = useRef(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => setTexting(canText()), []);

  const go = (next: Step, patch: Partial<TechAnswers> = {}) => {
    if (!startedAt.current) {
      startedAt.current = Date.now();
      // Browser + Conversions API copy (same id), so Meta still sees the start when the pixel is blocked.
      serverTrack("tech_quiz_start", track("tech_quiz_start", { source }), { contentName: "Computer repair Tampa", contentCategory: "tech_repair" });
    }
    setA((prev) => ({ ...prev, ...patch }));
    setStep(next);
    track("tech_quiz_step", { source, step: next, step_number: STEPS.indexOf(next) + 1 });
    if (next === "send" && !reachedLast.current) {
      reachedLast.current = true;
      serverTrack("tech_quiz_last_step", track("tech_quiz_last_step", { source, content_name: "Computer repair Tampa", content_category: "tech_repair" }), { contentName: "Computer repair Tampa", contentCategory: "tech_repair" });
    }
    // Keep the new question in view: on the page, scroll the card into view; in the phone sheet, back to its top
    // (a long problem list otherwise leaves the next question scrolled out of sight).
    if (variant === "card") {
      // Bring the card's top just under the fixed header (which is taller on phones, with its nav bar).
      const el = top.current;
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 64;
      const y = el ? el.getBoundingClientRect().top - headerBottom - 12 : 0;
      if (el && (y < 0 || y > window.innerHeight * 0.5)) window.scrollBy({ top: y, behavior: "smooth" });
    } else top.current?.parentElement?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const set = (patch: Partial<TechAnswers>) => {
    setA((prev) => ({ ...prev, ...patch }));
    setErrors({});
  };

  // One tap picks the computer(s) and moves on; problems picked earlier for a kept computer stay.
  const pickDevices = (devices: DeviceId[]) => {
    const problems = Object.fromEntries(devices.map((d) => [d, a.problems[d] ?? []]));
    setErrors({});
    go("problem", { devices, problems });
  };
  const toggle = (d: DeviceId, id: ProblemId) => {
    setA((prev) => {
      const cur = prev.problems[d] ?? [];
      return { ...prev, problems: { ...prev.problems, [d]: cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id] } };
    });
    setErrors({});
  };
  const picked = allProblems(a).length;

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
      { lead_source: "tech-quiz", source, channel, value: TECH_LEAD_VALUE, currency: "USD", content_name: "Computer repair Tampa", content_category: "tech_repair", problem: allProblems(a).join(","), device: a.devices.join(","), device_count: a.devices.length, where: a.where, when: a.when },
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
    <div id={variant === "card" ? "fix" : undefined} ref={top} className={cn("scroll-mt-32", shell)}>
      <div className={cn("flex items-baseline justify-between gap-3", variant === "sheet" && "pr-12")}>
        <p className="font-display text-xl font-bold leading-tight sm:text-2xl">Get your price</p>
        <p className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground" aria-live="polite">
          Step {index + 1} of {STEPS.length}
        </p>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>
      {step === "device" && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-turbo/[0.08] px-3 py-2 text-sm leading-snug ring-1 ring-turbo/20">
          <MapPin className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
          <span>
            We come to you <b>anywhere in Central Florida</b>.
          </span>
        </p>
      )}

      <div key={step} className="mt-3 animate-step">
        {step === "device" && (
          <>
            <Title text="What do you need help with?" />
            <div className="grid grid-cols-2 gap-2.5">
              {DEVICE_PICKS.map((o) => (
                <Tile key={o.id} icon={o.icon} label={o.label} sub={o.sub} pressed={o.devices.length === a.devices.length && o.devices.every((d) => a.devices.includes(d))} onClick={() => pickDevices(o.devices)} />
              ))}
              <CallLink location="tech quiz tile" className={cn(tile, "border-turbo/40 bg-turbo/[0.06]")}>
                <Phone className="h-8 w-8 text-turbo" strokeWidth={1.75} aria-hidden />
                <span className="block text-base font-bold leading-tight">Just call us</span>
                <span className="block text-xs leading-snug text-muted-foreground">{SITE.phone.display}</span>
              </CallLink>
            </div>
            <p className="mt-2.5 flex items-start gap-2 text-xs leading-snug text-muted-foreground">
              <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{NOT_FIXED}</span>
            </p>
          </>
        )}

        {step === "problem" && (
          <>
            <Title text={a.devices.length > 1 ? "What's wrong with each one?" : a.devices[0] === "mobile" || a.devices[0] === "camera" ? "What do you need?" : "What's wrong with it?"} />
            <p className="-mt-2 mb-2.5 text-sm text-muted-foreground">Tap all that apply.</p>
            <div className="grid gap-4">
              {a.devices.map((d) => (
                <div key={d}>
                  {a.devices.length > 1 && (
                    <p className="mb-2 flex items-center gap-2 text-base font-bold">
                      {(() => {
                        const Icon = DEVICE_ICONS[d];
                        return <Icon className="h-5 w-5 text-turbo" aria-hidden />;
                      })()}
                      {DEVICES.find((o) => o.id === d)?.label}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {problemsFor(d).map((o) => {
                      const Icon = PROBLEM_ICONS[o.id];
                      const on = (a.problems[d] ?? []).includes(o.id);
                      return (
                        <button key={o.id} type="button" aria-pressed={on} aria-label={o.label} onClick={() => toggle(d, o.id)} className={cn(row, "relative min-h-[60px] gap-2 px-3 py-2", on && rowOn)}>
                          <Icon className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
                          <span className="min-w-0 flex-1 text-[15px] font-semibold leading-tight">{o.short}</span>
                          {on && (
                            <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-turbo text-white shadow" aria-hidden>
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {errors.pick && <Err text={errors.pick} />}
            <Nav
              sticky={variant === "sheet"}
              onBack={() => setStep("device")}
              next={() => (picked ? go("when", remoteOk(a) ? {} : { where: "home" }) : setErrors({ pick: "Tap at least one problem." }))}
              label={picked > 1 ? `Continue with ${picked} problems` : "Continue"}
            />
          </>
        )}

        {step === "when" && (
          <>
            <Title text="How soon?" />
            <div className="grid grid-cols-3 gap-2">
              {WHEN.map((o) => (
                <Chip key={o.id} label={o.label} on={a.when === o.id} onClick={() => set({ when: o.id })} />
              ))}
            </div>
            {remoteOk(a) && (
              <>
            <p className="mb-2 mt-4 text-lg font-bold">Where should we fix it?</p>
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
            {showDetails || a.details ? (
              <>
                <label htmlFor={`${uid}-details`} className="mb-1.5 mt-4 block text-sm font-semibold">
                  Tell us more <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea id={`${uid}-details`} data-clarity-mask="true" rows={2} maxLength={DETAILS_MAX} className="field min-h-[64px]" value={a.details} onChange={(e) => set({ details: e.target.value })} placeholder="Model, error message, when it started…" />
              </>
            ) : (
              <button type="button" onClick={() => setShowDetails(true)} className="mt-3 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                + Add details (optional)
              </button>
            )}
            <Nav sticky={variant === "sheet"} onBack={() => setStep("problem")} next={() => go("send")} />
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
                <p data-clarity-mask="true" className="max-h-[5.25rem] overflow-hidden whitespace-pre-line rounded-xl border-2 border-dashed border-border bg-muted/50 px-3 py-2 text-sm leading-snug [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
                  {message}
                </p>
                <a href={smsHref(message)} onClick={onText} data-call-location="tech-quiz" className={cn("btn-ignite btn-shine w-full justify-center !py-4 !text-lg", !ready && "opacity-60")}>
                  <MessageSquare className="h-5 w-5" aria-hidden /> {ready ? "Text it to us" : a.where === "remote" ? "Add your name to send" : "Add your name & ZIP to send"}
                </a>
                <p className="-mt-1 text-center text-xs text-muted-foreground">{done ? "Messages should be open. Tap send and we'll text your price back." : "Opens Messages with this filled in. Just tap send."}</p>
              </>
            ) : (
              <>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--turbo))]" checked={a.smsOptIn} onChange={(e) => set({ smsOptIn: e.target.checked })} />
                  <span>
                    I agree to receive text messages from CEO Turbo about my request. Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2">Privacy</Link>.
                  </span>
                </label>
                <button type="submit" disabled={sending} className="btn-ignite btn-shine w-full justify-center !py-4 !text-lg">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <>Text me my price <ArrowRight className="h-5 w-5" aria-hidden /></>}
                </button>
              </>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep("when")} className="btn-chrome !px-4" aria-label="Edit answers">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <CallLink location="tech quiz call" icon className="btn-chrome flex-1 justify-center !py-3 !text-base">
                Call us
              </CallLink>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const row = "flex w-full min-h-[56px] items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 text-left transition-[border-color,background-color,transform] duration-150 hover:border-turbo/60 active:scale-[0.98]";
const rowOn = "border-turbo bg-turbo/10";

/** A big square picture tile: two per row, so the whole first question fits on a phone screen. */
const tile = "flex min-h-[96px] w-full flex-col items-start justify-center gap-1 rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-left transition-[border-color,background-color,transform] duration-150 hover:border-turbo/60 active:scale-[0.98]";

function Tile({ icon: Icon, label, sub, pressed, onClick }: { icon: LucideIcon; label: string; sub?: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={cn(tile, pressed && "border-turbo bg-turbo/15 ring-2 ring-turbo/30")}>
      <Icon className="h-8 w-8 text-turbo" strokeWidth={1.75} aria-hidden />
      <span className="block text-base font-bold leading-tight">{label}</span>
      {sub && <span className="block text-xs leading-snug text-muted-foreground">{sub}</span>}
    </button>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("min-h-[48px] rounded-full border-2 px-3 text-base font-semibold transition-colors", on ? "border-turbo bg-turbo text-white" : "border-border bg-card hover:border-turbo/60")}>
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

/** Back + Continue. In the phone sheet it sticks to the bottom so Continue is always on screen. */
function Nav({ onBack, next, label = "Continue", sticky }: { onBack: () => void; next?: () => void; label?: string; sticky?: boolean }) {
  return (
    <div className={cn("mt-4 flex gap-2", sticky && "sticky bottom-0 -mx-1 bg-background px-1 pb-1 pt-2")}>
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

