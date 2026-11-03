// The text quiz: three taps, then a filled-in text to our phone. Computers can't send that text, so
// they leave a mobile number instead and get the calendar. Answers reach the sheet either way.
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Loader2, MessageSquare } from "lucide-react";
import { InlineBooking } from "@/components/booking/InlineBooking";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { CALL_MULTIPLIER, EMPTY_ANSWERS, TIMELINES, goalsFor, labelOf, leadValue, textMessage, type Answers, type Audience } from "@/content/quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, e164, newEventId, setCallContext, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";
import { AudienceTiles } from "./AudienceTiles";
import { ICON } from "./icons";

const STEPS = ["audience", "goal", "timeline", "send"] as const;
type Step = (typeof STEPS)[number];

const STORE = "ct_text_quiz_v1";

/** The phone number stays out of storage; everything else lets a visitor pick up where they left off. */
function loadSaved(): { answers: Answers; step: Step } | null {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (!s?.answers?.audience || !STEPS.includes(s.step)) return null;
    return { answers: { ...EMPTY_ANSWERS, ...s.answers }, step: s.step };
  } catch {
    return null;
  }
}

function store(value: { answers: Answers; step: Step } | null) {
  try {
    if (value) localStorage.setItem(STORE, JSON.stringify({ step: value.step, answers: { ...value.answers, phone: "" } }));
    else localStorage.removeItem(STORE);
  } catch {
    /* private mode: the quiz still works, it just won't resume */
  }
}

export function TextQuiz({ source, audience, variant = "inline", className }: { source: string; audience?: Audience; variant?: "inline" | "sheet"; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const [answers, setAnswers] = useState<Answers>(audience ? { ...EMPTY_ANSWERS, audience, stage: "grow" } : EMPTY_ANSWERS);
  const [step, setStep] = useState<Step>(audience ? "goal" : "audience");
  const [texting, setTexting] = useState(false);
  const [done, setDone] = useState(false);
  const [moved, setMoved] = useState(!!audience);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const leadId = useRef("");
  const eventId = useRef("");

  const begin = (a?: Audience) => {
    if (startedAt.current) return;
    startedAt.current = Date.now();
    leadId.current = newEventId("q");
    track("text_quiz_start", { source, audience: a });
  };

  useEffect(() => {
    setTexting(canText());
    if (audience) return begin(audience);
    const saved = loadSaved();
    if (saved) {
      setAnswers(saved.answers);
      setStep(saved.step);
      begin(saved.answers.audience);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (next: Step, patch: Partial<Answers> = {}) => {
    const a = { ...answers, ...patch };
    begin(a.audience);
    setMoved(true);
    setAnswers(a);
    setStep(next);
    store({ answers: a, step: next });
    track("text_quiz_step", { source, step: next, step_number: STEPS.indexOf(next) + 1 });
  };

  const set = (patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setErrors({});
  };

  const index = STEPS.indexOf(step);
  const message = textMessage(answers);
  const nameOk = answers.name.trim().length >= 2;

  const lead = async (channel: "sms" | "form") => {
    const value = leadValue();
    const user = { name: answers.name.trim(), phone: answers.phone.trim() || undefined, externalId: visitorId() };
    const audienceLabel = labelOf.audience(answers.audience);
    const id = track(
      "generate_lead",
      { lead_source: "text-quiz", source, channel, value, currency: "USD", content_name: "Text quiz", content_category: audienceLabel, audience: answers.audience, stage: answers.stage, goal: answers.goal },
      { user },
    );
    eventId.current = id;
    setCallContext({ value: value * CALL_MULTIPLIER, user });
    store(null);
    return sendLead({
      type: "brand-boost-quiz",
      service: "text-quiz",
      channel,
      eventId: id,
      value,
      quizId: leadId.current || newEventId("q"),
      visitorId: user.externalId,
      name: user.name,
      phone: answers.phone.trim(),
      smsOptIn: answers.smsOptIn,
      audience: audienceLabel,
      stage: labelOf.stage(answers.audience, answers.stage),
      goal: labelOf.goal(answers.audience, answers.goal, answers.stage),
      timeline: labelOf.timeline(answers.timeline),
      note: channel === "sms" ? "Text quiz: tapped Text it to us" : "Text quiz: left a number on a computer",
      page: window.location.pathname,
      attribution: attribution(),
      company_site: honeypot,
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : 99_999,
    });
  };

  // The link itself opens Messages, and the sheet row goes out alongside it.
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
    const digits = answers.phone.replace(/\D/g, "");
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
          <Check className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Thanks, {answers.name.trim().split(/\s+/)[0]}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">We have your answers and we'll get back to you. Want a set time instead? Pick one below.</p>
        <InlineBooking
          className="mt-5"
          source={`${source} — text quiz`}
          prefill={message}
          person={{ name: answers.name.trim(), phone: e164(answers.phone) }}
        />
      </div>
    );

  return (
    <div className={cn(variant === "inline" && "rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className)}>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-turbo">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden /> Free · takes under a minute
        </span>
        <span aria-live="polite">
          Step {index + 1} of {STEPS.length}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Quiz progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div key={step} className={cn("mt-5", moved && "animate-step")}>
        {step === "audience" && (
          <>
            <Title text="What do you do?" />
            <AudienceTiles selected={answers.audience} onPick={(a) => go("goal", { audience: a, stage: "grow", goal: undefined })} />
            {variant === "sheet" && (
              <p className="mt-3 text-center text-sm">
                <BookButton direct note={`${source} — text quiz`} variant="link">
                  <CalendarCheck className="h-4 w-4" aria-hidden /> Rather pick a time?
                </BookButton>
              </p>
            )}
          </>
        )}

        {step === "goal" && (
          <>
            <Title text="What do you want most?" />
            <div className="grid gap-2.5">
              {goalsFor(answers.audience, answers.stage).map((o) => {
                const Icon = ICON[o.icon];
                return (
                  <button key={o.key} type="button" aria-pressed={answers.goal === o.key} onClick={() => go("timeline", { goal: o.key })} className="quiz-opt quiz-tap !py-2.5">
                    <span className="quiz-ico grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug">{o.label}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => set({ stage: answers.stage === "start" ? "grow" : "start", goal: undefined })} className="mt-2 min-h-[44px] text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              {answers.stage === "start" ? "Already up and running?" : "Just starting out?"}
            </button>
            <Back onClick={() => go("audience")} />
          </>
        )}

        {step === "timeline" && (
          <>
            <Title text="How soon?" />
            <div className="grid gap-2.5">
              {TIMELINES.map((o) => {
                const Icon = ICON[o.icon];
                return (
                  <button key={o.id} type="button" aria-pressed={answers.timeline === o.id} onClick={() => go("send", { timeline: o.id })} className="quiz-opt quiz-tap !py-2.5">
                    <span className="quiz-ico grid h-9 w-9 shrink-0 place-items-center rounded-xl">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug">{o.label}</span>
                  </button>
                );
              })}
            </div>
            <Back onClick={() => go("goal")} />
          </>
        )}

        {step === "send" && (
          <form onSubmit={onSubmit} noValidate className="grid gap-3">
            <Title text={texting ? "Last step: send it to us" : "Where should we reach you?"} />
            <div>
              <label htmlFor={`${uid}-name`} className="mb-1.5 block text-xs font-medium text-chrome">
                First name
              </label>
              <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={answers.name} onChange={(e) => set({ name: e.target.value })} autoComplete="given-name" maxLength={100} aria-invalid={!!errors.name} />
              {errors.name && <Err text={errors.name} />}
            </div>
            {!texting && (
              <div>
                <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-xs font-medium text-chrome">
                  Mobile number
                </label>
                <input id={`${uid}-phone`} data-clarity-mask="true" type="tel" className="field" value={answers.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="(404) 555-0123" aria-invalid={!!errors.phone} />
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
                <a href={smsHref(message)} onClick={onText} data-call-location="text-quiz" className="btn-ignite btn-shine w-full justify-center !py-4 !text-base">
                  <MessageSquare className="h-5 w-5" aria-hidden /> Text it to us
                </a>
                <p className="text-center text-xs text-muted-foreground">{done ? "Your Messages app should be open. Hit send and we'll text you back." : "Opens your Messages app with this filled in. Just hit send."}</p>
              </>
            ) : (
              <>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--turbo))]" checked={answers.smsOptIn} onChange={(e) => set({ smsOptIn: e.target.checked })} />
                  <span>
                    I agree to receive text messages from CEO Turbo about my request (replies and follow-up). Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2">Privacy</Link>.
                  </span>
                </label>
                <button type="submit" disabled={sending} className="btn-ignite btn-shine w-full justify-center !py-4 !text-base">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <>Send my answers <ArrowRight className="h-4 w-4" aria-hidden /></>}
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-4 text-sm">
              <CallLink location="text quiz" className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline underline-offset-2">
                Call us
              </CallLink>
              <BookButton direct note={`${source} — text quiz`} prefill={message} variant="link">
                <CalendarCheck className="h-4 w-4" aria-hidden /> Pick a time
              </BookButton>
            </div>
            <Back onClick={() => go("timeline")} />
          </form>
        )}
      </div>
    </div>
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
