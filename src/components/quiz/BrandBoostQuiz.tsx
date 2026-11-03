// The Brand Boost quiz: one tap per question, then contact details, then a personal "#1 money move"
// and a prefilled booking calendar. It is the lead form (beats a Meta instant form: the answers are
// fun to give, and the visitor sees something for them before the calendar).
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Loader2, Lock, Sparkles } from "lucide-react";
import {
  AUDIENCES,
  BUDGETS,
  CALL_MULTIPLIER,
  EMPTY_ANSWERS,
  QUIZ_STEPS,
  STAGES,
  TIMELINES,
  blockersFor,
  calBudget,
  calGoal,
  goalsFor,
  labelOf,
  leadValue,
  moneyMove,
  type Answers,
  type IconKey,
  type QuizStep,
} from "@/content/quiz";
import { BOOKING, SITE, fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { QUIZ_NS, openBooking } from "@/lib/cal";
import { InlineBooking } from "@/components/booking/InlineBooking";
import { attribution, e164, newEventId, setCallContext, track, visitorId } from "@/lib/track";
import { sendLead } from "@/lib/lead-outbox";
import { CallLink } from "@/components/site/CallLink";
import { cn } from "@/lib/utils";
import { ICON } from "./icons";

const STORE = "ct_quiz_v2";
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const SECONDS_PER_STEP = 5;

type Saved = { answers: Answers; step: QuizStep; quizId: string; startedAt: number; booked?: boolean };

function load(): Saved | null {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null") as Saved | null;
    if (!s || !s.answers || !s.step) return null;
    // Answers saved by an older quiz (or edited by hand) would crash the goal/blocker lookups: start fresh instead.
    const { audience, stage } = s.answers;
    if (audience && !STAGES[audience]) return null;
    if (stage && !STAGES[audience ?? "local"].some((x) => x.id === stage)) return null;
    if (s.step !== "result" && !QUIZ_STEPS.includes(s.step)) return null;
    return { ...s, answers: { ...EMPTY_ANSWERS, ...s.answers } };
  } catch {
    return null;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(STORE, JSON.stringify(s));
  } catch {
    /* private mode: the quiz still works, it just won't resume */
  }
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tap = () => {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* unsupported */
  }
};

export function BrandBoostQuiz({
  source,
  prefill,
  primary = false,
  variant = "inline",
  onSkip,
  className,
}: {
  /** Which button/page brought the visitor here (booking metadata + analytics). */
  source: string;
  /** Visible notes text for the booking form. */
  prefill?: string;
  /** The page's main quiz: "Book" buttons on the page scroll here instead of opening a dialog. */
  primary?: boolean;
  variant?: "inline" | "modal";
  onSkip?: () => void;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [moved, setMoved] = useState(false);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState<QuizStep>("audience");
  const [quizId, setQuizIdState] = useState("");
  const idRef = useRef("");
  const setQuizId = (id: string) => {
    idRef.current = id;
    setQuizIdState(id);
  };
  const [booked, setBooked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"business" | "name" | "email" | "phone", string>>>({});
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const advanceTimer = useRef<number>();
  const box = useRef<HTMLDivElement>(null);

  // Resume where the visitor left off (and stay in sync with the dialog copy of the quiz).
  useEffect(() => {
    const apply = () => {
      const s = load();
      if (!s) return;
      setAnswers(s.answers);
      setStep(s.step);
      setQuizId(s.quizId);
      setBooked(!!s.booked);
      startedAt.current = s.startedAt;
    };
    apply();
    const onSync = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== uid) apply();
    };
    const onBooked = () => setBooked(true);
    window.addEventListener("ct:quiz-sync", onSync);
    window.addEventListener("ct:booked", onBooked);
    return () => {
      window.removeEventListener("ct:quiz-sync", onSync);
      window.removeEventListener("ct:booked", onBooked);
      window.clearTimeout(advanceTimer.current);
    };
  }, [uid]);

  const persist = useCallback(
    (next: Partial<Saved>) => {
      const s: Saved = { answers, step, quizId: idRef.current, startedAt: startedAt.current, booked, ...next };
      save(s);
      window.dispatchEvent(new CustomEvent("ct:quiz-sync", { detail: uid }));
    },
    [answers, step, booked, uid],
  );

  useEffect(() => {
    if (!booked) return;
    persist({ booked: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booked]);

  const index = step === "result" ? QUIZ_STEPS.length : QUIZ_STEPS.indexOf(step);
  const audience = answers.audience ?? "local";
  const stage = answers.stage ?? "grow";
  const isArtist = answers.audience === "artist";

  const go = (next: QuizStep, patch: Partial<Answers> = {}) => {
    const a = { ...answers, ...patch };
    setMoved(true);
    setAnswers(a);
    setStep(next);
    persist({ answers: a, step: next });
    if (next !== "result") track("quiz_step", { source, step: next, step_number: QUIZ_STEPS.indexOf(next as (typeof QUIZ_STEPS)[number]) + 1 });
    requestAnimationFrame(() => {
      const el = box.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      el.querySelector<HTMLElement>("[data-quiz-focus]")?.focus({ preventScroll: true });
    });
  };

  const choose = (patch: Partial<Answers>, next: QuizStep) => {
    tap();
    if (!startedAt.current) {
      startedAt.current = Date.now();
      const id = newEventId("q");
      setQuizId(id);
      track("quiz_start", { source, audience: patch.audience });
      persist({ quizId: id, startedAt: startedAt.current });
    }
    setAnswers((a) => ({ ...a, ...patch }));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => go(next, patch), reducedMotion() ? 0 : 260);
  };

  const back = () => {
    const i = QUIZ_STEPS.indexOf(step as (typeof QUIZ_STEPS)[number]);
    if (i > 0) go(QUIZ_STEPS[i - 1]);
  };

  const restart = () => {
    startedAt.current = 0;
    setQuizId("");
    setBooked(false);
    setAnswers((a) => ({ ...EMPTY_ANSWERS, name: a.name, email: a.email, phone: a.phone, smsOptIn: a.smsOptIn }));
    setStep("audience");
    save({ answers: { ...EMPTY_ANSWERS, name: answers.name, email: answers.email, phone: answers.phone, smsOptIn: answers.smsOptIn }, step: "audience", quizId: "", startedAt: 0 });
  };

  const submitContact = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (answers.business.trim().length < 2) errs.business = isArtist ? "Enter your artist name." : "Enter your business name.";
    if (answers.name.trim().length < 2) errs.name = "Enter your name.";
    if (!EMAIL.test(answers.email.trim())) errs.email = "Enter a valid email.";
    const digits = answers.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) errs.phone = "Enter a valid phone number.";
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setSending(true);

    const id = idRef.current || newEventId("q");
    const value = leadValue(answers.budget);
    const move = moneyMove(answers);
    const user = { email: answers.email.trim(), phone: answers.phone.trim(), name: answers.name.trim(), externalId: visitorId() };
    const category = `${labelOf.audience(answers.audience)} · ${answers.stage === "start" ? "Starting out" : "Growing"}`;
    const eventId = track(
      "generate_lead",
      { lead_source: "brand-boost-quiz", source, value, currency: "USD", content_name: "Brand Boost quiz", content_category: category, audience: answers.audience, stage: answers.stage, goal: answers.goal, budget: answers.budget },
      { user },
    );
    setCallContext({ value: value * CALL_MULTIPLIER, user });

    // Never block the calendar on the sheet: sendLead retries from an outbox if this request fails.
    await sendLead({
          type: "brand-boost-quiz",
          eventId,
          value,
          quizId: id,
          visitorId: user.externalId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          smsOptIn: answers.smsOptIn,
          business: answers.business.trim(),
          website: answers.website.trim(),
          audience: labelOf.audience(answers.audience),
          stage: labelOf.stage(answers.audience, answers.stage),
          goal: labelOf.goal(answers.audience, answers.goal, answers.stage),
          blockers: answers.blockers.join(", "),
          budget: labelOf.budget(answers.budget),
          timeline: labelOf.timeline(answers.timeline),
          move: move.title,
          page: window.location.pathname,
          note: prefill,
          attribution: attribution(),
          company_site: honeypot,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 99_999,
    });
    setSending(false);
    setQuizId(id);
    go("result");
  };

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => {
    setAnswers((a) => ({ ...a, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Number keys pick an answer on the tap steps.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const n = Number(e.key);
    if (!n) return;
    const opts = box.current?.querySelectorAll<HTMLButtonElement>("[data-quiz-opt]");
    opts?.[n - 1]?.click();
  };

  const remaining = Math.max(1, QUIZ_STEPS.length - index) * SECONDS_PER_STEP;

  return (
    <div
      ref={box}
      id={primary ? "quiz" : undefined}
      data-quiz-inline={variant === "inline" ? (primary ? "primary" : "secondary") : undefined}
      onKeyDown={onKey}
      className={cn("relative scroll-mt-24", variant === "inline" && "audit-card rounded-3xl p-5 sm:p-7", className)}
    >
      {step !== "result" && (
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-turbo">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Free Brand Boost plan
            </span>
            <span aria-live="polite">
              Step {index + 1} of {QUIZ_STEPS.length} · about {remaining} sec left
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={QUIZ_STEPS.length} aria-valuenow={index}>
            <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-500 ease-out" style={{ width: `${Math.max(6, (index / QUIZ_STEPS.length) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Each step slides in (CSS only); the first, server-rendered step shows instantly. */}
      <div key={step} className={moved ? "animate-step" : undefined}>
          {step === "audience" && (
            <Question title="What do you do?" hint="Pick one — we'll tailor your plan.">
              <Options cols={2}>
                {AUDIENCES.map((o, i) => (
                  <Option key={o.id} n={i + 1} icon={o.icon} label={o.label} sub={o.sub} on={answers.audience === o.id} first={i === 0} onClick={() => choose(answers.audience === o.id ? { audience: o.id, stage: "grow" } : { audience: o.id, stage: "grow", goal: undefined, blockers: [] }, "goal")} />
                ))}
              </Options>
            </Question>
          )}

          {step === "goal" && (
            <Question title="What do you want most in the next 90 days?" hint="Your #1 goal decides what we look at first." onBack={back}>
              <Options cols={2}>
                {goalsFor(audience, stage).map((o, i) => (
                  <Option key={o.key} n={i + 1} icon={o.icon} label={o.label} on={answers.goal === o.key} first={i === 0} onClick={() => choose({ goal: o.key }, "contact")} />
                ))}
              </Options>
            </Question>
          )}

          {step === "contact" && (
            <Question title="Where should we send your plan?" hint="Last step. Then pick your call time." onBack={back}>
              <form onSubmit={submitContact} className="grid gap-4" noValidate>
                <Field id={`${uid}-biz`} label={isArtist ? "Artist name" : "Business name"} error={errors.business}>
                  <input id={`${uid}-biz`} data-clarity-mask="true" data-quiz-focus className="field" value={answers.business} onChange={(e) => set("business", e.target.value)} placeholder={isArtist ? "e.g. Yari Beats" : "e.g. Mor Handy"} autoComplete="organization" maxLength={140} aria-invalid={!!errors.business} />
                </Field>
                <Field id={`${uid}-name`} label="Your name" error={errors.name}>
                  <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={answers.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={100} aria-invalid={!!errors.name} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id={`${uid}-email`} label="Email" error={errors.email}>
                    <input id={`${uid}-email`} data-clarity-mask="true" type="email" className="field" value={answers.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" maxLength={200} aria-invalid={!!errors.email} />
                  </Field>
                  <Field id={`${uid}-phone`} label="Mobile phone" error={errors.phone}>
                    <input id={`${uid}-phone`} data-clarity-mask="true" type="tel" className="field" value={answers.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="(404) 555-0123" aria-invalid={!!errors.phone} />
                  </Field>
                </div>
                <label className="hidden" aria-hidden>
                  Company website
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--turbo))]" checked={answers.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
                  I agree to receive text messages from CEO Turbo about my call (reminders and follow-up). Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2">Privacy</Link>.
                </label>
                <button type="submit" disabled={sending} className="btn-ignite btn-shine w-full !py-4 !text-base">
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <>See my plan &amp; pick a time <ArrowRight className="h-4 w-4" aria-hidden /></>}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" aria-hidden /> No spam. We only use this for your call.{" "}
                  <Link to="/privacy-policy" className="underline underline-offset-2">
                    Privacy
                  </Link>
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Prefer to talk? <CallLink location="quiz contact" className="font-semibold text-foreground underline underline-offset-2" />
                </p>
              </form>
            </Question>
          )}

          {step === "result" && <Result answers={answers} quizId={quizId} source={source} prefill={prefill} booked={booked} uid={uid} onRestart={restart} />}
      </div>

      {step !== "result" && (
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {step === "audience" ? <>Free · {BOOKING.length} call · founder-led · </> : null}
          <button
            type="button"
            className="underline underline-offset-2 hover:text-foreground"
            onClick={() => {
              track("quiz_skip", { source, step });
              if (onSkip) onSkip();
              else void openBooking(`${source} — skipped quiz`, prefill);
            }}
          >
            Skip — just show me the calendar
          </button>
        </p>
      )}
    </div>
  );
}

function Question({ title, hint, onBack, children }: { title: string; hint?: string; onBack?: () => void; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="w-full">
        <span className="block font-display text-2xl font-bold leading-tight sm:text-[28px]">{title}</span>
        {hint && <span className="mt-1.5 block text-sm text-muted-foreground">{hint}</span>}
      </legend>
      <div className="mt-5">{children}</div>
      {onBack && (
        <button type="button" onClick={onBack} className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </button>
      )}
    </fieldset>
  );
}

function Options({ cols, children }: { cols: 1 | 2; children: ReactNode }) {
  return <div className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2")}>{children}</div>;
}

function Option({ n, icon, label, sub, on, first, compact, onClick }: { n: number; icon: IconKey; label: string; sub?: string; on: boolean; first?: boolean; compact?: boolean; onClick: () => void }) {
  const Icon = ICON[icon];
  return (
    <button type="button" data-quiz-opt data-quiz-focus={first ? "" : undefined} aria-pressed={on} onClick={onClick} className={cn("quiz-opt quiz-tap group", compact ? "py-3" : "py-4")}>
      <span className="quiz-ico grid h-11 w-11 shrink-0 place-items-center rounded-xl">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-semibold leading-snug">{label}</span>
        {sub && <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{sub}</span>}
      </span>
      <span className="hidden h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold text-muted-foreground ring-1 ring-white/10 sm:grid" aria-hidden>
        {on ? <Check className="h-3.5 w-3.5 text-turbo" /> : n}
      </span>
    </button>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-chrome">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-[#ff8a8a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Result({ answers, quizId, source, prefill, booked, uid, onRestart }: { answers: Answers; quizId: string; source: string; prefill?: string; booked: boolean; uid: string; onRestart: () => void }) {
  const move = moneyMove(answers);
  const first = answers.name.trim().split(/\s+/)[0] || "Here";
  const value = leadValue(answers.budget) * CALL_MULTIPLIER;

  const booking = {
    source: `${source} — quiz`,
    prefill,
    person: { name: answers.name.trim(), email: answers.email.trim(), phone: e164(answers.phone) },
    fields: {
      businessName: answers.business.trim(),
      whatTheyDo: labelOf.audience(answers.audience),
      website: answers.website.trim(),
      goal: calGoal(answers.goal),
      budget: calBudget(answers.budget),
    },
    meta: {
      quizId,
      businessName: answers.business.trim(),
      whatTheyDo: labelOf.audience(answers.audience),
      website: answers.website.trim(),
      stage: labelOf.stage(answers.audience, answers.stage),
      visitorId: visitorId(),
      goalLabel: labelOf.goal(answers.audience, answers.goal, answers.stage),
      budgetLabel: labelOf.budget(answers.budget),
      blockers: answers.blockers.join(", "),
      timeline: labelOf.timeline(answers.timeline),
      move: move.title,
      leadValue: value,
    },
  };

  if (booked)
    return (
      <div className="relative py-6 text-center">
        <Confetti />
        <CalendarCheck className="mx-auto h-12 w-12 text-turbo" aria-hidden />
        <p className="mt-4 font-display text-3xl font-bold">You're booked, {first}!</p>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">Check your email for the invite. Have your website and Google profile handy — we'll start with: {move.title.toLowerCase()}.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={SHOP_PATH} className="btn-chrome">
            Get review cards — from {fromPriceLabel}
          </Link>
        </div>
      </div>
    );

  return (
    <div className="relative">
      <Confetti />
      <p className="text-sm font-medium text-turbo">{first === "Here" ? "Your plan" : `${first}, your plan is ready`}</p>
      <p className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">Your #1 money move: {move.title}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{move.body}</p>
      <ul className="mt-4 grid gap-2">
        {move.points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[15px]">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
            {p}
          </li>
        ))}
      </ul>

      <div data-quiz-cal className="mt-6 scroll-mt-24 rounded-2xl border border-turbo/30 bg-turbo/[0.06] p-4">
        <p className="font-semibold">Last step: pick a time and we'll walk you through it, live.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Free · {BOOKING.length} · your details are already filled in. {SITE.founder.name.split(" ")[0]} opens calls a few days ahead, so grab the earliest slot.
        </p>
      </div>

      <InlineBooking ns={QUIZ_NS} source={booking.source} prefill={prefill} person={booking.person} fields={booking.fields} meta={booking.meta} className="mt-4" />

      {move.offer && (
        <div className="mt-5 grid gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5 sm:grid-cols-[1fr_auto] sm:items-center">
          {move.offer === "cards" ? (
            <>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Want reviews coming in before the call?</span> Our tap-to-review cards start at {fromPriceLabel} and ship from Atlanta.
              </p>
              <Link to={SHOP_PATH} onClick={() => track("shop_click", { source: "quiz result" })} className="btn-chrome !py-2.5 !text-sm">
                See review cards
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Curious how you show up today?</span> Run the free 60-second visibility check before the call.
              </p>
              <Link to="/free-audit" className="btn-chrome !py-2.5 !text-sm">
                Free check
              </Link>
            </>
          )}
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        No time that works? Call us: <CallLink location="quiz result" className="font-semibold text-foreground underline underline-offset-2" />
      </p>
      <button type="button" onClick={onRestart} className="mt-2 min-h-[44px] text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
        Start over with different answers
      </button>
    </div>
  );
}

/** A short, CSS-only burst. Under reduced motion the pieces simply don't show. */
function Confetti() {
  const bits = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-2 h-0" aria-hidden>
      {bits.map((i) => (
        <span key={i} className="confetti-bit" style={{ left: `${6 + ((i * 37) % 88)}%`, animationDelay: `${(i % 5) * 60}ms`, background: i % 3 === 0 ? "hsl(var(--turbo))" : i % 3 === 1 ? "hsl(var(--ignite))" : "#fbbc04", transform: `rotate(${i * 23}deg)` }} />
      ))}
    </div>
  );
}
