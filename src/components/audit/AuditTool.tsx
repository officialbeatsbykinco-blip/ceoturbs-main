import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Building2, Check, ChevronDown, Loader2, Lock, Mic2, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { openBooking } from "@/lib/cal";
import { track } from "@/lib/track";
import { CATEGORY, EMPTY, FREE_CHECK_NAME, QUESTIONS, SCAN_STEPS, clearCheck, contactErrors, grade, loadCheck, saveCheck, scanRequest, unlockRequest, type Check as AuditCheck, type Form, type GoogleData, type Kind, type Place, type Report, type Status } from "@/lib/free-check";
import { CallLink } from "@/components/site/CallLink";
import { BOOKING, SITE, fromPriceLabel } from "@/config/site";
import { CardFace, ScoreGauge } from "@/components/visuals/ReviewVisuals";
import { rememberBusiness } from "@/lib/review-link";
import { cn } from "@/lib/utils";

type Stage = "business" | "questions" | "scan" | "teaser" | "unlocking" | "report" | "failed";
const SCAN_STEPS_ALL = SCAN_STEPS;
export { CATEGORY, FREE_CHECK_NAME };
export type { Report };

const statusIcon = (s: Status) =>
  s === "pass" ? <Check className="h-4 w-4 text-emerald-400" aria-label="Pass" /> : s === "warn" ? <AlertTriangle className="h-4 w-4 text-[hsl(var(--ignite-hot))]" aria-label="Needs work" /> : <X className="h-4 w-4 text-[#ff6b6b]" aria-label="Problem" />;

export function AuditTool({ source = "audit", onStageChange, compact = false }: { source?: string; onStageChange?: (s: Stage) => void; compact?: boolean }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [stage, setStageRaw] = useState<Stage>("business");
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "form", string>>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [failure, setFailure] = useState<"rate" | "server" | "network">("server");
  const [unlocked, setUnlocked] = useState(false);
  const started = useRef(0);
  const top = useRef<HTMLDivElement>(null);
  const uid = useId();

  const setStage = (s: Stage) => {
    setStageRaw(s);
    onStageChange?.(s);
  };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Restore a finished report after navigating away and back in the same tab.
  useEffect(() => {
    try {
      const saved = loadCheck();
      if (saved) {
        setForm(saved.form);
        setReport(saved.report);
        setUnlocked(saved.unlocked);
        setStage(saved.unlocked ? "report" : "teaser");
        return;
      }
      // Prefill from the homepage hero (/free-audit?b=Business&c=City&w=what).
      const q = new URLSearchParams(window.location.search);
      const b = q.get("b")?.slice(0, 100) || "";
      if (b) setForm((f) => ({ ...f, business: b, city: q.get("c")?.slice(0, 60) || f.city, what: q.get("w")?.slice(0, 60) || f.what }));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "scan") return;
    setScanStep(0);
    const t = setInterval(() => setScanStep((i) => Math.min(i + 1, SCAN_STEPS_ALL[form.kind].length - 1)), 800);
    return () => clearInterval(t);
  }, [stage, form.kind]);

  const scrollTop = () => requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const submitBusiness = (e: FormEvent) => {
    e.preventDefault();
    if (form.business.trim().length < 2) return setErrors({ business: form.kind === "artist" ? "Enter your artist name." : "Enter your business name." });
    if (!started.current) started.current = Date.now();
    track("audit_start", { kind: form.kind, source });
    rememberBusiness(form.business);
    setStage("questions");
    scrollTop();
  };

  const questions = QUESTIONS[form.kind];
  const answered = questions.every((q) => form[q.key]);

  /** Step 3: run the real scan with no contact details. The visitor sees a teaser, then unlocks it. */
  const runScan = async () => {
    setStage("scan");
    scrollTop();
    const [result] = await Promise.all([scanRequest(form, started.current), new Promise((r) => setTimeout(r, 4800))]);
    if ("report" in result) {
      setReport(result.report);
      setUnlocked(false);
      setStage("teaser");
      scrollTop();
      track("audit_teaser", { score: result.report.overall, source, google: !!result.report.google?.found });
      saveCheck(form, result.report, false);
      return;
    }
    if (result.error === "business") {
      setErrors({ business: "Enter your business or artist name." });
      return setStage("business");
    }
    setFailure(result.error);
    setStage("failed");
  };

  /** Step 4: first name + mobile unlock the full report. This is the lead. */
  const submitUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!report) return;
    const errs = contactErrors(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setStage("unlocking");
    const fieldErrors = await unlockRequest(form, report, started.current, source);
    if (fieldErrors) {
      setErrors(fieldErrors);
      return setStage("teaser");
    }
    setUnlocked(true);
    setStage("report");
    scrollTop();
    track("audit_complete", { score: report.overall, source });
    saveCheck(form, report, true);
  };

  const restart = () => {
    clearCheck();
    setReport(null);
    setUnlocked(false);
    setForm((f) => ({ ...EMPTY, kind: f.kind, name: f.name, email: f.email, phone: f.phone, smsOptIn: f.smsOptIn }));
    started.current = Date.now();
    setStage("business");
    scrollTop();
  };

  const stepNo = stage === "business" ? 1 : stage === "questions" ? 2 : 3;

  if ((stage === "teaser" || stage === "unlocking") && report)
    return (
      <div ref={top} className="scroll-mt-24">
        <AuditTeaser report={report} form={form} errors={errors} uid={uid} busy={stage === "unlocking"} set={set} onSubmit={submitUnlock} />
      </div>
    );

  if (stage === "report" && report && unlocked) return <div ref={top} className="scroll-mt-24"><AuditReport report={report} form={form} source={source} onRestart={restart} /></div>;

  return (
    <div ref={top} className={cn("audit-card relative scroll-mt-20 overflow-clip rounded-3xl p-5 sm:scroll-mt-24 sm:p-7", compact && "sm:p-6")}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
      {stage !== "scan" && stage !== "failed" && (
        <div className="relative mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-turbo" aria-hidden /> {FREE_CHECK_NAME}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-label={`Step ${stepNo} of 3`}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-1.5 w-7 rounded-full transition-colors duration-500", n <= stepNo ? "bg-turbo" : "bg-white/10")} />
            ))}
          </div>
        </div>
      )}

      {stage === "business" && (
        <form onSubmit={submitBusiness} className="relative animate-step" noValidate>
          <div role="radiogroup" aria-label="What are you auditing?" className="grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.04] p-1">
            {(["business", "artist"] as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={form.kind === k}
                onClick={() => setForm((f) => ({ ...f, kind: k, gbp: "", reviews: "", press: "", nameRank: "" }))}
                className={cn("flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all", form.kind === k ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" : "text-muted-foreground hover:text-foreground")}
              >
                {k === "business" ? <Building2 className="h-4 w-4" aria-hidden /> : <Mic2 className="h-4 w-4" aria-hidden />}
                {k === "business" ? "Business" : "Artist"}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <Field id={`${uid}-biz`} label={form.kind === "artist" ? "Artist name" : "Business name"} error={errors.business}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input id={`${uid}-biz`} data-clarity-mask="true" className="field pl-10" value={form.business} onChange={(e) => set("business", e.target.value)} placeholder={form.kind === "artist" ? "e.g. Yari Beats" : "e.g. Mor Handy"} autoComplete="organization" maxLength={100} />
              </div>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id={`${uid}-what`} label={form.kind === "artist" ? "Genre / what you do" : "What do you do?"}>
                <input id={`${uid}-what`} data-clarity-mask="true" className="field" value={form.what} onChange={(e) => set("what", e.target.value)} placeholder={form.kind === "artist" ? "e.g. R&B singer, producer" : "e.g. plumber, barber, electrician, lawyer"} maxLength={60} />
              </Field>
              <Field id={`${uid}-city`} label={form.kind === "artist" ? "City (optional)" : "City"}>
                <input id={`${uid}-city`} data-clarity-mask="true" className="field" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Tampa, FL or Los Angeles, CA" autoComplete="address-level2" maxLength={60} />
              </Field>
            </div>
            <Field id={`${uid}-web`} label={form.kind === "artist" ? "Website or main link (optional)" : "Website (optional)"}>
              <input id={`${uid}-web`} data-clarity-mask="true" className="field" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder={form.kind === "artist" ? "yoursite.com, Linktree or Spotify" : "yourbusiness.com — blank if none"} inputMode="url" autoComplete="url" maxLength={300} />
            </Field>
          </div>
          <button type="submit" className="btn-ignite btn-shine mt-5 w-full !py-4 !text-base">
            {form.kind === "artist" ? "Check my visibility" : "Check my Google & AI visibility"} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Free · about 60 seconds · no card · see your score before we ask for anything</p>
        </form>
      )}

      {stage === "questions" && (
        <div className="relative animate-step">
          <p className="text-sm text-muted-foreground">
            Three quick taps about <span className="font-semibold text-foreground">{form.business}</span>
          </p>
          <div className="mt-4 space-y-5">
            {questions.map((q) => (
              <fieldset key={q.key}>
                <legend className="text-[15px] font-semibold">{q.label}</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {q.options.map(([v, l]) => (
                    <button key={v} type="button" aria-pressed={form[q.key] === v} onClick={() => set(q.key, v as never)} className={cn("choice", form[q.key] === v && "choice-on")}>
                      {l}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={() => { setStage("business"); scrollTop(); }} className="btn-chrome !px-4">
              Back
            </button>
            <button type="button" disabled={!answered} onClick={runScan} className="btn-ignite btn-shine flex-1 !py-4 disabled:pointer-events-none disabled:opacity-40">
              Run my free check <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {stage === "scan" && (
        <div className="relative py-2" role="status" aria-live="polite">
          <div className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden />
          <p className="font-display text-xl font-bold">Scanning {form.business}…</p>
          <p className="mt-1 text-sm text-muted-foreground">{form.website ? form.website.replace(/^https?:\/\//, "") : form.kind === "business" ? "Checking Google, your website and AI answers" : "Checking where fans can find you"}</p>
          <ol className="mt-6 space-y-3">
            {SCAN_STEPS_ALL[form.kind].map((s, i) => (
              <li key={s} className={cn("flex items-center gap-3 text-sm transition-opacity duration-300", i > scanStep ? "opacity-30" : "opacity-100")}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/5">
                  {i < scanStep ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : i === scanStep ? <Loader2 className="h-3.5 w-3.5 animate-spin text-turbo" aria-hidden /> : null}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {stage === "failed" && (
        <div className="relative animate-step">
          <p className="font-display text-xl font-bold">{failure === "rate" ? "That's a lot of audits." : "We couldn't finish the scan."}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {failure === "rate" ? "Too many audits from your network in the last few minutes. Try again shortly — or skip the wait and we'll run it live with you." : "Something blocked the scan (it happens with some hosts). Book a free call and we'll run the full audit live with you — same report, plus answers."}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn-ignite btn-shine flex-1" onClick={() => openBooking(`${source} — scan failed`, `Free audit for ${form.business}${form.website ? ` (${form.website})` : ""}. The online scan didn't finish.`, { name: form.name, email: form.email, phone: form.phone })}>
              Book my free audit call
            </button>
            <CallLink location="audit failed" icon className="btn-chrome" />
            <button type="button" className="btn-chrome" onClick={runScan}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
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
        <p className="mt-1.5 text-xs font-medium text-[#ff8080]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function aiPrompt(r: Report, f: Form) {
  if (r.kind === "artist") return `Who is ${f.business}${f.what ? `, the ${f.what}` : ""}${f.city ? ` from ${f.city}` : ""}?`;
  if (f.what && f.city) return `Who is the best ${f.what} in ${f.city}?`;
  return `What do you know about ${f.business}${f.city ? ` in ${f.city}` : ""}?`;
}

export function AuditReport({ report: r, form: f, source, onRestart }: { report: Report; form: Form; source: string; onRestart: () => void }) {
  const g = grade(r.overall);
  const topChecks = r.top.map((id) => r.checks.find((c) => c.id === id)).filter(Boolean) as AuditCheck[];
  const fails = r.checks.filter((c) => c.status !== "pass").length;
  const prompt = aiPrompt(r, f);
  const lowReviews = r.kind === "business" && (r.scores.reviews ?? 100) < 75;
  const notes = `Free audit — ${r.name}: ${r.overall}/100 (${r.categories.map((c) => `${CATEGORY[c].short} ${r.scores[c]}`).join(", ")}). Top issues: ${topChecks.slice(0, 3).map((c) => c.label).join("; ")}.`;
  const book = (where: string) => openBooking(`${source} — report ${where}`, notes, { name: f.name, email: f.email, phone: f.phone });

  return (
    <div className="animate-step">
      <div className="audit-card relative overflow-clip rounded-3xl p-5 sm:p-8">
        <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <ScoreGauge value={r.overall} />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-muted-foreground">Visibility report · {r.meta.site || r.meta.platform || "no website"}</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">
              {r.name}: <span className={g.tone}>{g.label}</span>
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {g.line} We found <span className="font-semibold text-foreground">{fails} things</span> to fix.
            </p>
          </div>
        </div>

        <div className={cn("relative mt-8 grid gap-3", r.categories.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3")}>
          {r.categories.map((c, i) => {
            const s = r.scores[c];
            return (
              <div key={c} className="rounded-2xl bg-white/[0.03] p-3.5 ring-1 ring-white/5 reveal-up sm:p-4" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-lg font-bold">{CATEGORY[c].short}</p>
                  <p className={cn("font-display text-2xl font-bold tabular-nums", s >= 75 ? "text-turbo" : s >= 50 ? "text-[hsl(var(--ignite-hot))]" : "text-[#ff6b6b]")}>{s}</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className={cn("bar-grow h-full rounded-full", s >= 75 ? "bg-turbo" : s >= 50 ? "bg-[hsl(var(--ignite-hot))]" : "bg-[#ff6b6b]")} style={{ width: `${s}%`, animationDelay: `${0.3 + i * 0.08}s` }} />
                </div>
                <p className="mt-2 hidden text-xs leading-snug text-muted-foreground sm:block">{CATEGORY[c].question}</p>
              </div>
            );
          })}
        </div>
      </div>

      {r.google && (r.google.competitors.length > 0 || !r.google.found) && (
        <div className="mt-6">
          <GoogleCompare google={r.google} name={r.name} what={f.what} city={f.city} />
        </div>
      )}

      {topChecks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold">Fix these first</h3>
          <p className="mt-1 text-sm text-muted-foreground">Ranked by how many customers each one is likely costing you.</p>
          <ol className="mt-5 grid gap-3">
            {topChecks.map((c, i) => (
              <li key={c.id} className="panel reveal-up flex gap-4 p-4 sm:p-5" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold", c.status === "fail" ? "bg-[#ff6b6b]/15 text-[#ff8080]" : "bg-[hsl(var(--ignite)/0.15)] text-[hsl(var(--ignite-hot))]")}>{i + 1}</span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {c.label}
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{CATEGORY[c.cat]?.short}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
                  {c.fix && (
                    <p className="mt-2 text-sm leading-relaxed">
                      <span className="font-semibold text-turbo">Fix: </span>
                      {c.fix}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="relative mt-8 overflow-hidden rounded-3xl p-6 sm:p-8 cta-glow">
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--ignite-hot))]">Free · {BOOKING.length} · no obligation</p>
            <h3 className="mt-1 text-2xl font-bold sm:text-3xl">Want us to fix this for you?</h3>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Book a free call. Christopher walks through your report, shows you which fix brings customers fastest, and gives you a fixed price. Keep the plan either way.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <button type="button" onClick={() => book("main CTA")} className="btn-ignite btn-shine !px-7 !py-4 !text-base">
              Book my free fix call <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <CallLink location="audit report" icon className="btn-chrome justify-center" />
          </div>
        </div>
      </div>

      {lowReviews && (
        <Link to="/google-review-cards" className="group panel mt-4 grid items-center gap-5 overflow-hidden p-5 sm:grid-cols-[120px_1fr_auto] sm:p-6">
          <CardFace className="mx-auto w-16 -rotate-6 drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105 sm:w-20" />
          <div>
            <p className="font-semibold">Reviews are holding you back.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Put a tap-to-review card on your counter. Customers tap their phone and your Google review form opens — no searching, no app.</p>
          </div>
          <span className="btn-chrome whitespace-nowrap group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_0_1px_hsl(var(--turbo)/0.5)]">
            Review cards from {fromPriceLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      )}

      <div className="mt-8 panel p-5 sm:p-6">
        <h3 className="text-xl font-bold">Test it yourself: ask AI about you</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask: <span className="text-foreground">“{prompt}”</span> — are you named? If a competitor is, that's the GEO gap we close.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["ChatGPT", `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`],
            ["Perplexity", `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`],
            ["Google", `https://www.google.com/search?q=${encodeURIComponent(prompt)}`],
          ].map(([l, href]) => (
            <a key={l} href={href} target="_blank" rel="noopener noreferrer" className="choice">
              Ask {l} <ArrowRight className="h-3.5 w-3.5 -rotate-45" aria-hidden />
            </a>
          ))}
          <ShareResults report={r} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold">Every check we ran</h3>
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {r.categories.map((cat) => {
            const list = r.checks.filter((c) => c.cat === cat);
            return (
              <details key={cat} className="group bg-background/40 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02]">
                  <span>
                    <span className="font-semibold">
                      {CATEGORY[cat].short} · {CATEGORY[cat].title}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {list.filter((c) => c.status === "pass").length}/{list.length} passed
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="space-y-3 px-5 pb-5">
                  {list.map((c) => (
                    <li key={c.id} className="flex gap-3 text-sm">
                      <span className="mt-0.5 shrink-0">{statusIcon(c.status)}</span>
                      <span>
                        <span className="font-medium">{c.label}</span>
                        <span className="block text-muted-foreground">{c.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4" aria-hidden /> Audit another business
          </button>
          <button type="button" onClick={() => book("footer")} className="btn-ignite btn-shine">
            Book my free fix call
          </button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Automated checks of your public website and open data sources (Wikidata{r.kind === "artist" ? ", Wikipedia, MusicBrainz" : ", OpenStreetMap"}{r.meta.psi ? ", Google PageSpeed" : ""}), {r.meta.google ? ", Google Maps" : ""}, plus your answers. Rankings and AI answers change constantly; this is a snapshot, not a guarantee.
        </p>
      </div>
    </div>
  );
}

/** Real Google numbers: the business vs the top competitors for its category in its city. */
export function GoogleCompare({ google, name, what, city }: { google: GoogleData; name: string; what?: string; city?: string }) {
  const rows: (Place & { you?: boolean })[] = [...(google.place ? [{ ...google.place, you: true }] : [{ name, rating: null, reviews: 0, you: true }]), ...google.competitors];
  const max = Math.max(1, ...rows.map((r) => r.reviews));
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5 sm:p-5">
      <p className="text-sm font-semibold">
        On Google{what && city ? ` for “${what} in ${city}”` : ""}
      </p>
      {!google.found && <p className="mt-1 text-xs text-[#ff8080]">We couldn't find {name} on Google Maps — customers can't either.</p>}
      <ul className="mt-3 space-y-2.5">
        {rows.map((r, i) => (
          <li key={`${r.name}-${i}`} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className={cn("min-w-0 truncate", r.you ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {r.you ? "You" : r.name}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {r.rating ? `${r.rating.toFixed(1)}★ · ` : ""}
                <span className={cn("font-semibold", r.you ? "text-foreground" : "")}>{r.reviews}</span> reviews
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={cn("bar-grow h-full rounded-full", r.you ? "bg-[hsl(var(--ignite-hot))]" : "bg-white/30")} style={{ width: `${Math.max(3, (r.reviews / max) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuditTeaser({
  report: r,
  form: f,
  errors,
  uid,
  busy,
  set,
  onSubmit,
}: {
  report: Report;
  form: Form;
  errors: Partial<Record<keyof Form | "form", string>>;
  uid: string;
  busy: boolean;
  set: <K extends keyof Form>(k: K, v: Form[K]) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const g = grade(r.overall);
  const topChecks = r.top.map((id) => r.checks.find((c) => c.id === id)).filter(Boolean) as AuditCheck[];
  const shown = topChecks.slice(0, 2);
  const hidden = r.checks.filter((c) => c.status !== "pass").length - shown.length;
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    track("audit_unlock_view", { score: r.overall });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-step space-y-4">
      <div className="audit-card relative overflow-clip rounded-3xl p-5 sm:p-7">
        <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <ScoreGauge value={r.overall} />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-muted-foreground">Your free check is done</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">
              {r.name}: <span className={g.tone}>{g.label}</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{g.line}</p>
          </div>
        </div>
        {r.google && (
          <div className="relative mt-5">
            <GoogleCompare google={r.google} name={r.name} what={f.what} city={f.city} />
          </div>
        )}
      </div>

      {shown.length > 0 && (
        <div className="panel p-4 sm:p-5">
          <h3 className="text-lg font-bold">Your 2 biggest problems</h3>
          <ol className="mt-3 space-y-3">
            {shown.map((c, i) => (
              <li key={c.id} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ff6b6b]/15 font-display text-sm font-bold text-[#ff8080]">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-semibold">{c.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {hidden > 0 && (
            <div className="relative mt-4 overflow-hidden rounded-xl">
              <ul className="space-y-2 blur-[5px] select-none" aria-hidden>
                {Array.from({ length: Math.min(3, hidden) }).map((_, i) => (
                  <li key={i} className="h-10 rounded-lg bg-white/[0.06]" />
                ))}
              </ul>
              <button type="button" onClick={() => formRef.current?.querySelector("input")?.focus()} className="absolute inset-0 grid place-items-center text-sm font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 ring-1 ring-white/10">
                  <Lock className="h-3.5 w-3.5 text-turbo" aria-hidden /> +{hidden} more fixes, step by step
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="audit-card relative overflow-clip rounded-3xl p-5 sm:p-7" noValidate>
        <p className="flex items-center gap-2 font-display text-xl font-bold">
          <Lock className="h-4 w-4 text-turbo" aria-hidden /> Unlock your full report
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Every fix ranked by how many customers it's costing you{r.google?.competitors.length ? ", plus how you stack up against your top competitors" : ""}. Free — we just need where to send it.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field id={`${uid}-name`} label="First name" error={errors.name}>
            <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="given-name" maxLength={100} />
          </Field>
          <Field id={`${uid}-phone`} label="Mobile number" error={errors.phone}>
            <input id={`${uid}-phone`} data-clarity-mask="true" type="tel" className="field" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="(813) 555-0123" />
          </Field>
          <div className="sm:col-span-2">
            <Field id={`${uid}-email`} label="Email (optional)" error={errors.email}>
              <input id={`${uid}-email`} data-clarity-mask="true" type="email" className="field" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" maxLength={200} />
            </Field>
          </div>
          <label className="hidden" aria-hidden>
            Company site
            <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={(e) => set("company_site", e.target.value)} />
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--turbo))]" checked={f.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
            <span>I agree to receive text messages from CEO Turbo about my audit report and follow-up. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">Privacy</Link>.</span>
          </label>
        </div>
        <button type="submit" disabled={busy} className="btn-ignite btn-shine mt-5 w-full !py-4 !text-base disabled:opacity-70">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {busy ? "Unlocking…" : "Show my full report"} {!busy && <ArrowRight className="h-4 w-4" aria-hidden />}
        </button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Rather talk it through?{" "}
          <CallLink location="free check unlock" className="font-semibold text-turbo underline underline-offset-4">
            Call or text {SITE.phone.display}
          </CallLink>
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          By continuing you agree CEO Turbo may call or email you about your report (texts only if you ticked the box). No spam, no selling your info —{" "}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function ShareResults({ report: r }: { report: Report }) {
  const [done, setDone] = useState(false);
  const topChecks = r.top.map((id) => r.checks.find((c) => c.id === id)).filter(Boolean) as AuditCheck[];
  const text = `${r.name} — ${FREE_CHECK_NAME}: ${r.overall}/100 (${r.categories.map((c) => `${CATEGORY[c].short} ${r.scores[c]}`).join(", ")}).${r.google?.place ? ` Google: ${r.google.place.reviews} reviews${r.google.place.rating ? `, ${r.google.place.rating.toFixed(1)}★` : ""}.` : ""} Top fixes: ${topChecks.slice(0, 3).map((c) => c.label).join("; ")}. Run yours free: https://www.ceoturbo.com/free-audit`;
  const share = async () => {
    track("audit_share", { score: r.overall });
    try {
      if (navigator.share) await navigator.share({ title: FREE_CHECK_NAME, text });
      else await navigator.clipboard.writeText(text);
      setDone(true);
    } catch {
      /* cancelled */
    }
  };
  return (
    <button type="button" onClick={share} className="choice">
      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
      {done ? "Copied" : "Share or save my results"}
    </button>
  );
}
