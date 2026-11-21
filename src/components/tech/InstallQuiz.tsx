// Install quiz for the Tampa install pages (computer setup, security cameras, Wi-Fi): pick the jobs, a few chip
// questions, then the whole request typed out. Phones open Messages to our number; computers take a mobile
// number, then show the calendar. One Lead (browser + server, same event_id) tagged with the page's category.
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, MessageSquare } from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { CallLink } from "@/components/site/CallLink";
import { INSTALL_BOOKING, SITE } from "@/config/site";
import { EMPTY_INSTALL, WHEN_OPTIONS, installLabels, installMessage, needsZip, type InstallAnswers, type InstallPage } from "@/content/install-pages";
import { zipOk } from "@/content/tech-quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["jobs", "details", "send"] as const;
type Step = (typeof STEPS)[number];

export function InstallQuiz({ page, id = "book", className }: { page: InstallPage; id?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const [a, setA] = useState<InstallAnswers>(EMPTY_INSTALL);
  const [step, setStep] = useState<Step>("jobs");
  const [texting, setTexting] = useState(true);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; zip?: string; phone?: string; pick?: string }>({});
  const [honeypot, setHoneypot] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  // The details step shows one question per screen (then "How soon?"); a tap moves on by itself.
  const [qi, setQi] = useState(0);
  const startedAt = useRef(0);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => setTexting(canText()), []);

  const go = (next: Step) => {
    if (!startedAt.current) {
      startedAt.current = Date.now();
      track("install_quiz_start", { source: page.slug });
    }
    setStep(next);
    track("install_quiz_step", { source: page.slug, step: next, step_number: STEPS.indexOf(next) + 1 });
    show();
  };
  // Each new question lands fully on screen, just under the fixed header, so nobody has to scroll.
  const show = () => {
    const el = top.current;
    if (!el) return;
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 64;
    const y = el.getBoundingClientRect().top - headerBottom - 8;
    if (Math.abs(y) > 4) window.scrollBy({ top: y, behavior: "smooth" });
  };
  const back = (to: Step) => {
    setStep(to);
    show();
  };
  const set = (patch: Partial<InstallAnswers>) => {
    setA((prev) => ({ ...prev, ...patch }));
    setErrors({});
  };
  const toggle = (job: string) => {
    setA((prev) => ({ ...prev, jobs: prev.jobs.includes(job) ? prev.jobs.filter((j) => j !== job) : [...prev.jobs, job] }));
    setErrors({});
  };
  const pick = (q: string, o: string) => {
    setA((prev) => ({ ...prev, picks: { ...prev.picks, [q]: o } }));
    setErrors({});
  };

  const total = 2 + page.questions.length + 1;
  const index = step === "jobs" ? 0 : step === "details" ? 1 + qi : total - 1;
  const message = installMessage(page, a);
  const nameOk = a.name.trim().length >= 2;
  const zipNeeded = needsZip(page, a);
  const ready = nameOk && (!zipNeeded || zipOk(a.zip));

  const lead = (channel: "sms" | "form") => {
    const l = installLabels(page, a);
    const user = { name: a.name.trim(), phone: a.phone.trim() || undefined, zip: (zipNeeded && a.zip.trim()) || undefined, externalId: visitorId() };
    const eventId = track(
      "generate_lead",
      { lead_source: "install-quiz", source: page.slug, channel, value: page.value, currency: "USD", content_name: page.name, content_category: page.category, jobs: a.jobs.join(","), when: a.when },
      { user },
    );
    return sendLead({
      type: "install",
      service: page.slug,
      channel,
      eventId,
      value: page.value,
      visitorId: user.externalId,
      quizId: newEventId("i"),
      name: user.name,
      phone: a.phone.trim(),
      smsOptIn: a.smsOptIn,
      contentName: page.name,
      category: page.category,
      jobs: l.jobs,
      answers: l.answers.join(" | "),
      when: l.when,
      zip: zipNeeded ? a.zip.trim() : "",
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
    if (zipNeeded && !zipOk(a.zip)) errs.zip = "Add your 5-digit ZIP code.";
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

  const shell = cn("scroll-mt-32 rounded-3xl border border-border bg-card p-4 shadow-xl sm:p-7", className);

  if (done && !texting)
    return (
      <div id={id} className={shell}>
        <p className="flex items-center gap-2 font-display text-2xl font-bold">
          <Check className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Got it, {a.name.trim().split(/\s+/)[0]}.
        </p>
        <p className="mt-2 text-base text-muted-foreground">We'll text you a price shortly. Want a set time now? Pick one below.</p>
        <InstallCalEmbed className="mt-5" note={`${page.slug}-install-quiz`} booking={page.booking ?? INSTALL_BOOKING} minHeight="560px" />
      </div>
    );

  return (
    <div id={id} ref={top} className={shell}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-xl font-bold leading-tight sm:text-2xl">Get your price</p>
        <p className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground" aria-live="polite">
          Step {index + 1} of {total}
        </p>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      {step === "jobs" && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-turbo/[0.08] px-3 py-2 text-sm leading-snug ring-1 ring-turbo/20">
          <MapPin className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
          <span>{page.remote ? <><b>Remote</b> or at your door near Tampa.</> : <>We come to you <b>near Tampa</b>.</>}</span>
        </p>
      )}

      <div key={step === "details" ? `details-${qi}` : step} className="mt-3 animate-step">
        {step === "jobs" && (
          <>
            <p className="text-lg font-bold leading-tight">What do you need?</p>
            <p className="mb-2.5 mt-0.5 text-sm text-muted-foreground">Tap all that apply.</p>
            <div className="grid grid-cols-2 gap-2">
              {page.jobs.map((j) => {
                const on = a.jobs.includes(j.id);
                return (
                  <button key={j.id} type="button" aria-pressed={on} onClick={() => toggle(j.id)} className={cn(row, "relative min-h-[56px] px-3 py-1.5", on && rowOn)}>
                    <span className="min-w-0 flex-1 text-sm font-semibold leading-tight">{j.label}</span>
                    {on && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-turbo text-white shadow" aria-hidden>
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.pick && <Err text={errors.pick} />}
            <button type="button" onClick={() => (a.jobs.length ? (setQi(0), go("details")) : setErrors({ pick: "Tap at least one." }))} className="btn-ignite mt-3 w-full !py-3.5 !text-base">
              {a.jobs.length > 1 ? `Continue with ${a.jobs.length}` : "Continue"} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        {step === "details" && qi < page.questions.length && (
          <>
            <p className="mb-3 text-xl font-bold leading-tight">{page.questions[qi].label}</p>
            <div className="grid gap-2">
              {page.questions[qi].options.map((o) => (
                <Choice
                  key={o.id}
                  label={o.label}
                  on={a.picks[page.questions[qi].id] === o.id}
                  onClick={() => {
                    pick(page.questions[qi].id, o.id);
                    setQi(qi + 1);
                    show();
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => (qi ? (setQi(qi - 1), show()) : back("jobs"))} className="btn-chrome !px-4">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" onClick={() => (setQi(qi + 1), show())} className="btn-chrome flex-1 !text-base text-muted-foreground">
                Skip
              </button>
            </div>
          </>
        )}

        {step === "details" && qi >= page.questions.length && (
          <>
            <p className="mb-3 text-xl font-bold leading-tight">How soon?</p>
            <div className="grid gap-2">
              {WHEN_OPTIONS.map((o) => (
                <Choice key={o.id} label={o.label} on={a.when === o.id} onClick={() => (set({ when: o.id }), go("send"))} />
              ))}
            </div>
            {showDetails || a.details ? (
              <>
                <label htmlFor={`${uid}-details`} className="mb-1.5 mt-3 block text-sm font-semibold">
                  Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea id={`${uid}-details`} data-clarity-mask="true" rows={2} maxLength={1000} className="field min-h-[64px]" value={a.details} onChange={(e) => set({ details: e.target.value })} placeholder="Brands, models, where it goes…" />
              </>
            ) : (
              <button type="button" onClick={() => setShowDetails(true)} className="mt-2 flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                + Add details (optional)
              </button>
            )}
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => (page.questions.length ? (setQi(page.questions.length - 1), show()) : back("jobs"))} className="btn-chrome !px-4">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" onClick={() => go("send")} className="btn-ignite flex-1 !text-base">
                Continue <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </>
        )}

        {step === "send" && (
          <form onSubmit={onSubmit} noValidate className="grid gap-3">
            <p className="text-lg font-bold leading-tight">{texting ? "Last step: who's it from?" : "Where do we text your price?"}</p>
            <div className={cn("grid gap-3", zipNeeded && "grid-cols-[1.4fr_1fr]")}>
              <div>
                <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold">
                  Your name <span className="text-[#c2410c]">*</span>
                </label>
                <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="given-name" maxLength={100} placeholder="First name" aria-invalid={!!errors.name} />
                {errors.name && <Err text={errors.name} />}
              </div>
              {zipNeeded && (
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
                <a href={smsHref(message)} onClick={onText} data-call-location="install-quiz" className={cn("btn-ignite btn-shine w-full justify-center !py-4 !text-lg", !ready && "opacity-60")}>
                  <MessageSquare className="h-5 w-5" aria-hidden /> {ready ? "Text it to us" : zipNeeded ? "Add your name & ZIP to send" : "Add your name to send"}
                </a>
                <p className="-mt-1 text-center text-xs text-muted-foreground">{done ? "Messages should be open. Tap send and we'll text your price back." : "Opens Messages with this filled in. Just tap send."}</p>
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
            <div className="flex gap-2">
              <button type="button" onClick={() => (setQi(page.questions.length), back("details"))} className="btn-chrome !px-4" aria-label="Edit answers">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <CallLink location="install quiz call" icon className="btn-chrome flex-1 justify-center !py-3 !text-base">
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

/** One big answer button: tapping it answers the question and moves on. */
function Choice({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn(row, "justify-between", on && rowOn)}>
      <span className="text-base font-semibold">{label}</span>
      <ArrowRight className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
    </button>
  );
}

function Err({ text }: { text: string }) {
  return (
    <p className="mt-1.5 text-sm font-medium text-destructive" role="alert">
      {text}
    </p>
  );
}
