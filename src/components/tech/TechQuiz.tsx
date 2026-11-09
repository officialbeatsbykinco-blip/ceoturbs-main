// Tech repair quiz: what's wrong, which device, where. On a phone the last tap opens Messages with the
// whole request typed out; on a computer it takes a name and mobile number, then shows the calendar.
// Either way it fires one Lead (browser + server, same event_id) tagged content_category "tech_repair".
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, MessageSquare } from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { CallLink } from "@/components/site/CallLink";
import { IT_BOOKING } from "@/config/site";
import { DEVICES, EMPTY_TECH, PROBLEMS, TECH_CITIES, WHERE, techLabels, techMessage, type TechAnswers } from "@/content/tech-quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["problem", "device", "where", "send"] as const;
type Step = (typeof STEPS)[number];

/** What a tech lead is worth to Meta's optimizer (an average first job). */
export const TECH_LEAD_VALUE = 150;

export function TechQuiz({ source = "computer-repair-tampa", className }: { source?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const [a, setA] = useState<TechAnswers>(EMPTY_TECH);
  const [step, setStep] = useState<Step>("problem");
  const [texting, setTexting] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);

  useEffect(() => setTexting(canText()), []);

  const go = (next: Step, patch: Partial<TechAnswers> = {}) => {
    if (!startedAt.current) {
      startedAt.current = Date.now();
      track("tech_quiz_start", { source });
    }
    setA((prev) => ({ ...prev, ...patch }));
    setStep(next);
    track("tech_quiz_step", { source, step: next, step_number: STEPS.indexOf(next) + 1 });
  };
  const set = (patch: Partial<TechAnswers>) => {
    setA((prev) => ({ ...prev, ...patch }));
    setErrors({});
  };

  const index = STEPS.indexOf(step);
  const message = techMessage(a);
  const nameOk = a.name.trim().length >= 2;

  const lead = (channel: "sms" | "form") => {
    const labels = techLabels(a);
    const user = { name: a.name.trim(), phone: a.phone.trim() || undefined, externalId: visitorId() };
    const eventId = track(
      "generate_lead",
      { lead_source: "tech-quiz", source, channel, value: TECH_LEAD_VALUE, currency: "USD", content_name: "Computer repair Tampa", content_category: "tech_repair", problem: a.problem, device: a.device, where: a.where },
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
      city: a.city.trim(),
      page: window.location.pathname,
      attribution: attribution(),
      company_site: honeypot,
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : 99_999,
    });
  };

  const onText = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!nameOk) {
      e.preventDefault();
      return setErrors({ name: "Add your first name." });
    }
    if (done) return;
    setDone(true);
    void lead("sms");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (texting) return;
    const errs: typeof errors = {};
    if (!nameOk) errs.name = "Enter your first name.";
    const digits = a.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) errs.phone = "Enter a valid mobile number.";
    if (Object.keys(errs).length) return setErrors(errs);
    setSending(true);
    await lead("form");
    setSending(false);
    setDone(true);
  };

  if (done && !texting)
    return (
      <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className)}>
        <p className="flex items-center gap-2 font-display text-2xl font-bold">
          <Check className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Got it, {a.name.trim().split(/\s+/)[0]}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">We'll text you a price shortly. Want a set time now? Pick one below.</p>
        <InstallCalEmbed className="mt-5" note={`${source}-tech-quiz`} booking={IT_BOOKING} minHeight="560px" />
      </div>
    );

  return (
    <div id="fix" className={cn("scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className)}>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-turbo">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden /> Get a price by text · under a minute
        </span>
        <span aria-live="polite">
          Step {index + 1} of {STEPS.length}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div key={step} className="mt-5 animate-step">
        {step === "problem" && (
          <>
            <Title text="What's wrong?" />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {PROBLEMS.map((o) => (
                <Option key={o.id} pressed={a.problem === o.id} onClick={() => go("device", { problem: o.id })} label={o.label} />
              ))}
            </div>
          </>
        )}

        {step === "device" && (
          <>
            <Title text="Which device?" />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {DEVICES.map((o) => (
                <Option key={o.id} pressed={a.device === o.id} onClick={() => go("where", { device: o.id })} label={o.label} />
              ))}
            </div>
            <Back onClick={() => setStep("problem")} />
          </>
        )}

        {step === "where" && (
          <>
            <Title text="Where should we fix it?" />
            <div className="grid gap-2.5">
              {WHERE.map((o) => (
                <Option key={o.id} pressed={a.where === o.id} onClick={() => go("send", { where: o.id })} label={o.label} sub={o.sub} />
              ))}
            </div>
            <Back onClick={() => setStep("device")} />
          </>
        )}

        {step === "send" && (
          <form onSubmit={onSubmit} noValidate className="grid gap-3">
            <Title text={texting ? "Last step: send it to us" : "Where do we text your price?"} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="mb-1.5 block text-xs font-medium text-chrome">
                  First name
                </label>
                <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="given-name" maxLength={100} aria-invalid={!!errors.name} />
                {errors.name && <Err text={errors.name} />}
              </div>
              {a.where !== "remote" && (
                <div>
                  <label htmlFor={`${uid}-city`} className="mb-1.5 flex items-center gap-1 text-xs font-medium text-chrome">
                    <MapPin className="h-3 w-3" aria-hidden /> City
                  </label>
                  <input id={`${uid}-city`} list={`${uid}-cities`} className="field" value={a.city} onChange={(e) => set({ city: e.target.value })} autoComplete="address-level2" maxLength={60} placeholder="Tampa" />
                  <datalist id={`${uid}-cities`}>
                    {TECH_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>
            {!texting && (
              <div>
                <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-xs font-medium text-chrome">
                  Mobile number
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
                <p data-clarity-mask="true" className="rounded-xl bg-muted/70 p-3 text-sm leading-relaxed">
                  {message}
                </p>
                <a href={smsHref(message)} onClick={onText} data-call-location="tech-quiz" className="btn-ignite btn-shine w-full justify-center !py-4 !text-base">
                  <MessageSquare className="h-5 w-5" aria-hidden /> Text it to us
                </a>
                <p className="text-center text-xs text-muted-foreground">{done ? "Messages should be open. Hit send and we'll text your price back." : "Opens Messages with this filled in. Just hit send."}</p>
              </>
            ) : (
              <>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--turbo))]" checked={a.smsOptIn} onChange={(e) => set({ smsOptIn: e.target.checked })} />
                  <span>
                    I agree to receive text messages from CEO Turbo about my request. Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2">Privacy</Link>.
                  </span>
                </label>
                <button type="submit" disabled={sending} className="btn-ignite btn-shine w-full justify-center !py-4 !text-base">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <>Text me my price <ArrowRight className="h-4 w-4" aria-hidden /></>}
                </button>
              </>
            )}
            <p className="text-center text-sm">
              Rather talk?{" "}
              <CallLink location="tech quiz" className="font-semibold text-foreground underline underline-offset-2">
                Call us
              </CallLink>
            </p>
            <Back onClick={() => setStep("where")} />
          </form>
        )}
      </div>
    </div>
  );
}

function Option({ label, sub, pressed, onClick }: { label: string; sub?: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="quiz-opt quiz-tap !py-3 text-left">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug">{label}</span>
        {sub && <span className="mt-0.5 block text-xs text-muted-foreground">{sub}</span>}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
    </button>
  );
}

function Title({ text }: { text: string }) {
  return <p className="mb-3 font-display text-2xl font-bold leading-tight">{text}</p>;
}

function Err({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {text}
    </p>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-1 flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Back
    </button>
  );
}
