// Install quiz for the Tampa install pages (computer setup, security cameras, Wi-Fi): pick the jobs, a few chip
// questions, then the whole request typed out. Phones open Messages to our number; computers take a mobile
// number, then show the calendar. One Lead (browser + server, same event_id) tagged with the page's category.
import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, MessageSquare } from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { CallLink } from "@/components/site/CallLink";
import { INSTALL_BOOKING, SITE } from "@/config/site";
import { EMPTY_INSTALL, WHEN_OPTIONS, installLabels, installMessage, type InstallAnswers, type InstallPage } from "@/content/install-pages";
import { zipOk } from "@/content/tech-quiz";
import { sendLead } from "@/lib/lead-outbox";
import { canText, smsHref } from "@/lib/sms";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const STEPS = ["jobs", "details", "send"] as const;
type Step = (typeof STEPS)[number];
const STEP_NAMES: Record<Step, string> = { jobs: "What you need", details: "Details", send: "Send" };

export function InstallQuiz({ page, id = "book", className }: { page: InstallPage; id?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const [a, setA] = useState<InstallAnswers>(EMPTY_INSTALL);
  const [step, setStep] = useState<Step>("jobs");
  const [texting, setTexting] = useState(true);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; zip?: string; phone?: string; pick?: string }>({});
  const [honeypot, setHoneypot] = useState("");
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
    top.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
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

  const index = STEPS.indexOf(step);
  const message = installMessage(page, a);
  const nameOk = a.name.trim().length >= 2;
  const ready = nameOk && zipOk(a.zip);

  const lead = (channel: "sms" | "form") => {
    const l = installLabels(page, a);
    const user = { name: a.name.trim(), phone: a.phone.trim() || undefined, zip: a.zip.trim() || undefined, externalId: visitorId() };
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
      zip: a.zip.trim(),
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
    if (!zipOk(a.zip)) errs.zip = "Add your 5-digit ZIP code.";
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

  const shell = cn("scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className);

  if (done && !texting)
    return (
      <div id={id} className={shell}>
        <p className="flex items-center gap-2 font-display text-2xl font-bold">
          <Check className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> Got it, {a.name.trim().split(/\s+/)[0]}.
        </p>
        <p className="mt-2 text-base text-muted-foreground">We'll text you a price shortly. Want a set time now? Pick one below.</p>
        <InstallCalEmbed className="mt-5" note={`${page.slug}-install-quiz`} booking={INSTALL_BOOKING} minHeight="560px" />
      </div>
    );

  return (
    <div id={id} ref={top} className={shell}>
      <p className="font-display text-xl font-bold leading-tight sm:text-2xl">Get your price by text</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground" aria-live="polite">
        Step {index + 1} of {STEPS.length} · {STEP_NAMES[step]}
      </p>
      <p className="mt-3 flex items-start gap-2 rounded-xl bg-turbo/[0.08] px-3 py-2.5 text-sm leading-snug ring-1 ring-turbo/20">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
        <span>
          We come to you within <b>40 miles of Tampa</b>. Price before we start.
        </span>
      </p>

      <div key={step} className="mt-4 animate-step">
        {step === "jobs" && (
          <>
            <p className="text-lg font-bold leading-tight">What do you need?</p>
            <p className="mb-3 mt-1 text-sm text-muted-foreground">Tap all that apply.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {page.jobs.map((j) => {
                const on = a.jobs.includes(j.id);
                return (
                  <button key={j.id} type="button" aria-pressed={on} onClick={() => toggle(j.id)} className={cn(row, on && rowOn)}>
                    <span className="min-w-0 flex-1 text-base font-semibold leading-snug">{j.label}</span>
                    <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border-2", on ? "border-turbo bg-turbo text-white" : "border-border")} aria-hidden>
                      {on && <Check className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.pick && <Err text={errors.pick} />}
            <button type="button" onClick={() => (a.jobs.length ? go("details") : setErrors({ pick: "Tap at least one." }))} className="btn-ignite mt-4 w-full !py-4 !text-base">
              {a.jobs.length > 1 ? `Continue with ${a.jobs.length}` : "Continue"} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </>
        )}

        {step === "details" && (
          <>
            {page.questions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="mb-2 text-lg font-bold leading-tight">{q.label}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => (
                    <Chip key={o.id} label={o.label} on={a.picks[q.id] === o.id} onClick={() => pick(q.id, o.id)} />
                  ))}
                </div>
              </div>
            ))}
            <p className="mb-2 text-lg font-bold leading-tight">How soon?</p>
            <div className="flex flex-wrap gap-2">
              {WHEN_OPTIONS.map((o) => (
                <Chip key={o.id} label={o.label} on={a.when === o.id} onClick={() => set({ when: o.id })} />
              ))}
            </div>
            <label htmlFor={`${uid}-details`} className="mb-1.5 mt-5 block text-sm font-semibold">
              Anything else? <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea id={`${uid}-details`} data-clarity-mask="true" rows={2} maxLength={300} className="field resize-none" value={a.details} onChange={(e) => set({ details: e.target.value })} placeholder="Brand, model, where it goes, anything we should know…" />
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setStep("jobs")} className="btn-chrome !px-4">
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
            <div className="grid grid-cols-[1.4fr_1fr] gap-3">
              <div>
                <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold">
                  Your name <span className="text-[#c2410c]">*</span>
                </label>
                <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={a.name} onChange={(e) => set({ name: e.target.value })} autoComplete="given-name" maxLength={100} placeholder="First name" aria-invalid={!!errors.name} />
                {errors.name && <Err text={errors.name} />}
              </div>
              <div>
                <label htmlFor={`${uid}-zip`} className="mb-1.5 block text-sm font-semibold">
                  ZIP code <span className="text-[#c2410c]">*</span>
                </label>
                <input id={`${uid}-zip`} className="field" value={a.zip} onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} autoComplete="postal-code" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="33602" aria-invalid={!!errors.zip} />
                {errors.zip && <Err text={errors.zip} />}
              </div>
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
                <a href={smsHref(message)} onClick={onText} data-call-location="install-quiz" className={cn("btn-ignite btn-shine w-full justify-center !py-4 !text-lg", !ready && "opacity-60")}>
                  <MessageSquare className="h-5 w-5" aria-hidden /> {ready ? "Text it to us" : "Add your name & ZIP to send"}
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
            <CallLink location="install quiz call" icon className="btn-chrome w-full justify-center !py-3.5 !text-base">
              Or call {SITE.phone.display}
            </CallLink>
            <button type="button" onClick={() => setStep("details")} className="flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
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

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("min-h-[48px] rounded-full border-2 px-5 text-base font-semibold transition-colors", on ? "border-turbo bg-turbo text-white" : "border-border bg-card hover:border-turbo/60")}>
      {label}
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
