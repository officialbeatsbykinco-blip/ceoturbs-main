import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Building2, Check, ChevronDown, Loader2, Lock, Mic2, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { openBooking } from "@/lib/cal";
import { attribution, track, visitorId } from "@/lib/track";
import { CallLink } from "@/components/site/CallLink";
import { BOOKING, fromPriceLabel } from "@/config/site";
import { CardFace, ScoreGauge } from "@/components/visuals/ReviewVisuals";
import { rememberBusiness } from "@/lib/review-link";
import { cn } from "@/lib/utils";

/** What a free-check lead is worth to the ad platforms (same number on the Pixel and the Conversions API). */
const FREE_CHECK_VALUE = 10;

type Kind = "business" | "artist";
type Status = "pass" | "warn" | "fail";
type Check = { cat: string; id: string; weight: number; status: Status; label: string; detail: string; fix: string };
export type Report = {
  kind: Kind;
  name: string;
  overall: number;
  scores: Record<string, number>;
  categories: string[];
  checks: Check[];
  top: string[];
  meta: { site: string | null; platform: string | null; psi: boolean; checkedAt: string };
};
type Stage = "business" | "questions" | "contact" | "scan" | "report" | "failed";

type Form = {
  kind: Kind;
  business: string;
  what: string;
  city: string;
  website: string;
  /** Starting out or growing. */
  stage: string;
  gbp: string;
  reviews: string;
  press: string;
  nameRank: string;
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  company_site: string;
};

const EMPTY: Form = { kind: "business", business: "", what: "", city: "", website: "", stage: "", gbp: "", reviews: "", press: "", nameRank: "", name: "", email: "", phone: "", smsOptIn: false, company_site: "" };

export const CATEGORY: Record<string, { short: string; title: string; question: string }> = {
  seo: { short: "SEO", title: "Search engine optimization", question: "Can Google find and rank you?" },
  aeo: { short: "AEO", title: "Answer engine optimization", question: "Can AI Overviews and assistants quote you?" },
  geo: { short: "GEO", title: "Generative engine optimization", question: "Do ChatGPT, Gemini and Perplexity trust you enough to name you?" },
  reviews: { short: "Reviews", title: "Google reviews & profile", question: "Will customers pick you over the business next door?" },
};

const QUESTIONS: Record<Kind, { key: keyof Form; label: string; options: [string, string][] }[]> = {
  business: [
    { key: "stage", label: "Where is your business right now?", options: [["start", "Just starting out"], ["grow", "Up and running — want more customers"]] },
    { key: "gbp", label: "Is your Google Business Profile claimed?", options: [["yes", "Yes, verified"], ["unsure", "Not sure"], ["no", "No"]] },
    { key: "reviews", label: "How many Google reviews do you have?", options: [["0-9", "0–9"], ["10-49", "10–49"], ["50-99", "50–99"], ["100+", "100+"]] },
  ],
  artist: [
    { key: "stage", label: "Where are you in your music career?", options: [["start", "Just starting out"], ["grow", "Releasing music — want more listeners"]] },
    { key: "nameRank", label: "Google your artist name. Are you the first result?", options: [["top", "Yes, #1"], ["somewhere", "On page 1"], ["no", "No"], ["unsure", "Haven't checked"]] },
    { key: "press", label: "Any press, blog or playlist features?", options: [["none", "None yet"], ["some", "A few"], ["lots", "Lots"]] },
  ],
};

const SCAN_STEPS = ["Loading your website", "Reading titles, headings and content", "Checking schema and FAQ markup", "Testing AI crawler access (ChatGPT, Perplexity, Claude)", "Searching knowledge graphs for your name", "Scoring SEO, AEO and GEO", "Writing your action plan"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const STORE = "ct_audit_v1";

function grade(score: number) {
  if (score >= 90) return { label: "Strong", tone: "text-turbo", line: "You're ahead of most competitors. The job now is staying there." };
  if (score >= 75) return { label: "Good, not dominant", tone: "text-turbo", line: "A few fixes stand between you and the top spot." };
  if (score >= 50) return { label: "Leaking customers", tone: "text-[hsl(var(--ignite-hot))]", line: "People can find you, but competitors are getting calls that should be yours." };
  return { label: "Hard to find", tone: "text-[#ff6b6b]", line: "Most people searching for what you do won't find you — on Google or in AI answers." };
}

const statusIcon = (s: Status) =>
  s === "pass" ? <Check className="h-4 w-4 text-emerald-400" aria-label="Pass" /> : s === "warn" ? <AlertTriangle className="h-4 w-4 text-[hsl(var(--ignite-hot))]" aria-label="Needs work" /> : <X className="h-4 w-4 text-[#ff6b6b]" aria-label="Problem" />;

export function AuditTool({ source = "audit", onStageChange, compact = false }: { source?: string; onStageChange?: (s: Stage) => void; compact?: boolean }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [stage, setStageRaw] = useState<Stage>("business");
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "form", string>>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [failure, setFailure] = useState<"rate" | "server" | "network">("server");
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
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (saved?.report) {
        setForm({ ...EMPTY, ...saved.form });
        setReport(saved.report);
        setStage("report");
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "scan") return;
    setScanStep(0);
    const t = setInterval(() => setScanStep((i) => Math.min(i + 1, SCAN_STEPS.length - 1)), 650);
    return () => clearInterval(t);
  }, [stage]);

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

  const submitContact = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 2) errs.name = "Enter your name.";
    if (!EMAIL.test(form.email.trim())) errs.email = "Enter a valid email.";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) errs.phone = "Enter a valid phone number.";
    if (Object.keys(errs).length) return setErrors(errs);

    setStage("scan");
    scrollTop();
    const leadEventId = track(
      "generate_lead",
      { lead_source: "free_check", kind: form.kind, stage: form.stage, source, value: FREE_CHECK_VALUE, currency: "USD", content_name: form.kind === "artist" ? "Artist visibility check" : "Business visibility check", content_category: `${form.kind === "artist" ? "Artist" : "Business"} · ${form.stage === "start" ? "Starting out" : "Growing"}` },
      { user: { email: form.email, phone: form.phone, name: form.name, externalId: visitorId() } },
    );
    const minWait = new Promise((r) => setTimeout(r, 4200));
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, visitorId: visitorId(), elapsedMs: Date.now() - (started.current || Date.now()), page: window.location.pathname, eventId: leadEventId, attribution: attribution() }),
      });
      const data = await res.json().catch(() => ({}));
      await minWait;
      if (res.ok && data.report) {
        setReport(data.report);
        setStage("report");
        scrollTop();
        track("audit_complete", { score: data.report.overall, source });
        try {
          sessionStorage.setItem(STORE, JSON.stringify({ form: { ...form, company_site: "" }, report: data.report }));
        } catch {
          /* ignore */
        }
        return;
      }
      if (res.status === 400 && ["name", "email", "phone"].includes(data.error)) {
        setErrors({ [data.error]: data.error === "phone" ? "Enter a valid phone number." : data.error === "email" ? "Enter a valid email." : "Enter your name." });
        return setStage("contact");
      }
      if (res.status === 400 && data.error === "business") {
        setErrors({ business: "Enter your business or artist name." });
        return setStage("business");
      }
      setFailure(res.status === 429 ? "rate" : "server");
      setStage("failed");
    } catch {
      await minWait;
      setFailure("network");
      setStage("failed");
    }
  };

  const restart = () => {
    try {
      sessionStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
    setReport(null);
    setForm((f) => ({ ...EMPTY, kind: f.kind, name: f.name, email: f.email, phone: f.phone, smsOptIn: f.smsOptIn }));
    started.current = Date.now();
    setStage("business");
    scrollTop();
  };

  const stepNo = stage === "business" ? 1 : stage === "questions" ? 2 : 3;

  if (stage === "report" && report) return <div ref={top} className="scroll-mt-24"><AuditReport report={report} form={form} source={source} onRestart={restart} /></div>;

  return (
    <div ref={top} className={cn("audit-card relative scroll-mt-20 overflow-clip rounded-3xl p-5 sm:scroll-mt-24 sm:p-7", compact && "sm:p-6")}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
      {stage !== "scan" && stage !== "failed" && (
        <div className="relative mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-turbo" aria-hidden /> Free Brand Visibility Check
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
                <input id={`${uid}-city`} data-clarity-mask="true" className="field" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Atlanta, GA or Los Angeles, CA" autoComplete="address-level2" maxLength={60} />
              </Field>
            </div>
            <Field id={`${uid}-web`} label={form.kind === "artist" ? "Website or main link (optional)" : "Website (optional)"}>
              <input id={`${uid}-web`} data-clarity-mask="true" className="field" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder={form.kind === "artist" ? "yoursite.com, Linktree or Spotify" : "yourbusiness.com — blank if none"} inputMode="url" autoComplete="url" maxLength={300} />
            </Field>
          </div>
          <button type="submit" className="btn-ignite btn-shine mt-5 w-full !py-4 !text-base">
            Scan my visibility <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Free · about 60 seconds · Google, Maps &amp; reviews</p>
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
            <button type="button" disabled={!answered} onClick={() => { setStage("contact"); scrollTop(); }} className="btn-ignite btn-shine flex-1 disabled:pointer-events-none disabled:opacity-40">
              Continue <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {stage === "contact" && (
        <form onSubmit={submitContact} className="relative animate-step" noValidate>
          <div className="relative mb-5 flex items-center gap-4 overflow-hidden rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border-[6px] border-turbo/40 blur-[1.5px]" aria-hidden>
              <span className="font-display text-xl font-bold">??</span>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Lock className="h-3.5 w-3.5 text-turbo" aria-hidden /> Your report is ready to run
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Score, every problem we find and how to fix each one — for {form.business}.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <Field id={`${uid}-name`} label="Your name" error={errors.name}>
              <input id={`${uid}-name`} data-clarity-mask="true" className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={100} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id={`${uid}-email`} label="Email" error={errors.email}>
                <input id={`${uid}-email`} data-clarity-mask="true" type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" maxLength={200} />
              </Field>
              <Field id={`${uid}-phone`} label="Mobile phone" error={errors.phone}>
                <input id={`${uid}-phone`} data-clarity-mask="true" type="tel" className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="(404) 555-0123" />
              </Field>
            </div>
            <label className="hidden" aria-hidden>
              Company site
              <input tabIndex={-1} autoComplete="off" value={form.company_site} onChange={(e) => set("company_site", e.target.value)} />
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--turbo))]" checked={form.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
              <span>I agree to receive text messages from CEO Turbo about my audit report and follow-up. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">Terms</Link> &amp; <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">Privacy</Link>.</span>
            </label>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button type="button" onClick={() => { setStage("questions"); scrollTop(); }} className="btn-chrome !px-4">
              Back
            </button>
            <button type="submit" className="btn-ignite btn-shine flex-1 !py-4">
              Show my free report <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree that CEO Turbo may email or call you about your report (texts only if you ticked the box). No spam, no selling your info —{" "}
            <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
              privacy policy
            </Link>
            .
          </p>
        </form>
      )}

      {stage === "scan" && (
        <div className="relative py-2" role="status" aria-live="polite">
          <div className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden />
          <p className="font-display text-xl font-bold">Scanning {form.business}…</p>
          <p className="mt-1 text-sm text-muted-foreground">{form.website ? form.website.replace(/^https?:\/\//, "") : "No website — checking where you can be found"}</p>
          <ol className="mt-6 space-y-3">
            {SCAN_STEPS.map((s, i) => (
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
            <button type="button" className="btn-chrome" onClick={() => setStage("contact")}>
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
  const topChecks = r.top.map((id) => r.checks.find((c) => c.id === id)).filter(Boolean) as Check[];
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
          <button type="button" onClick={() => book("main CTA")} className="btn-ignite btn-shine !px-7 !py-4 !text-base">
            Book my free fix call <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
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
          Automated checks of your public website and open data sources (Wikidata{r.kind === "artist" ? ", Wikipedia, MusicBrainz" : ", OpenStreetMap"}{r.meta.psi ? ", Google PageSpeed" : ""}), plus your answers. Rankings and AI answers change constantly; this is a snapshot, not a guarantee.
        </p>
      </div>
    </div>
  );
}
