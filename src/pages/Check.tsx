// /check — the free Google & AI check as a full-screen, app-like flow: one question per screen, a progress
// bar, big tap cards that advance on their own, a proof screen while the scan runs, the result before any
// contact details, then "where should we text your full report?". No site nav to wander off into.
// Every lead goes through src/lib/free-check.ts, the same code as the inline tool on /free-audit.
import { createContext, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Check as CheckIcon, ChevronLeft, Loader2, Lock, MapPin, Mic2, Phone, RotateCcw, Star, TrendingUp } from "lucide-react";
import { AuditReport, GoogleCompare } from "@/components/audit/AuditTool";
import { ScoreGauge } from "@/components/visuals/ReviewVisuals";
import { CallLink } from "@/components/site/CallLink";
import { Logo } from "@/components/site/Logo";
import { openBooking } from "@/lib/cal";
import { track } from "@/lib/track";
import { rememberBusiness } from "@/lib/review-link";
import { cn } from "@/lib/utils";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { EMPTY, QUESTIONS, SCAN_STEPS, clearCheck, contactErrors, grade, loadCheck, saveCheck, scanRequest, unlockRequest, type Check, type Form, type FormErrors, type Kind, type Report } from "@/lib/free-check";

const SOURCE = "Check flow";

/** Where the pinned bottom button renders: outside the animated step, so `fixed` really pins to the screen. */
const CtaSlot = createContext<HTMLElement | null>(null);

/** Tap tiles for "what do you do" — the value is what we search Google for ("plumber in Tampa"). */
const WHAT: Record<Kind, [string, string][]> = {
  business: [
    ["restaurant", "Restaurant or food"],
    ["barber shop", "Barber or salon"],
    ["contractor", "Contractor or home service"],
    ["plumber", "Plumber"],
    ["hvac", "HVAC"],
    ["cleaning service", "Cleaning"],
    ["auto repair", "Auto shop"],
    ["store", "Shop or retail"],
    ["dentist", "Medical or dental"],
  ],
  artist: [
    ["rapper", "Rapper"],
    ["singer", "Singer"],
    ["music producer", "Producer or beatmaker"],
    ["dj", "DJ"],
    ["band", "Band"],
  ],
};

type Step = "kind" | "name" | "what" | "q0" | "q1" | "q2" | "website" | "scan" | "teaser" | "contact" | "unlocking" | "report" | "failed";
const PROGRESS: Step[] = ["kind", "name", "what", "q0", "q1", "q2", "website", "scan", "teaser", "contact"];

export default function CheckPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [step, setStep] = useState<Step>("kind");
  const [history, setHistory] = useState<Step[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [failure, setFailure] = useState<"rate" | "server" | "network">("server");
  const [otherWhat, setOtherWhat] = useState(false);
  const started = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const go = (next: Step, push = true) => {
    if (push) setHistory((h) => [...h, step]);
    setStep(next);
    track("check_step", { step: next, kind: form.kind });
    requestAnimationFrame(() => scroller.current?.scrollTo({ top: 0 }));
  };
  const back = () => {
    if (step === "report" || step === "teaser" || step === "contact" || step === "failed" || step === "scan" || step === "unlocking") {
      if (step === "contact") return go("teaser", false);
      return navigate("/");
    }
    const prev = history[history.length - 1];
    if (!prev) return navigate(-1);
    setHistory((h) => h.slice(0, -1));
    setStep(prev);
  };

  // The page is its own app: lock the site behind it, restore a report from this tab, prefill from links.
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const saved = loadCheck();
    if (saved) {
      setForm(saved.form);
      setReport(saved.report);
      setStep(saved.unlocked ? "report" : "teaser");
    } else {
      const q = new URLSearchParams(window.location.search);
      const b = q.get("b")?.slice(0, 100) || "";
      const c = q.get("c")?.slice(0, 60) || "";
      if (b || c) setForm((f) => ({ ...f, business: b, city: c }));
      if (q.get("kind") === "artist") setForm((f) => ({ ...f, kind: "artist" }));
    }
    track("check_open", { source: new URLSearchParams(window.location.search).get("from") || "direct" });
    return () => {
      root.style.overflow = prevOverflow;
    };
  }, []);

  const questions = QUESTIONS[form.kind];

  const runScan = async () => {
    go("scan");
    const [result] = await Promise.all([scanRequest(form, started.current), new Promise((r) => setTimeout(r, 6500))]);
    if ("report" in result) {
      setReport(result.report);
      saveCheck(form, result.report, false);
      track("audit_teaser", { score: result.report.overall, source: SOURCE, google: !!result.report.google?.found });
      return go("teaser", false);
    }
    if (result.error === "business") {
      setErrors({ business: "Enter your business or artist name." });
      return go("name", false);
    }
    setFailure(result.error);
    go("failed", false);
  };

  const unlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!report) return;
    const errs = contactErrors(form);
    if (Object.keys(errs).length) return setErrors(errs);
    go("unlocking", false);
    const fieldErrors = await unlockRequest(form, report, started.current, SOURCE);
    if (fieldErrors) {
      setErrors(fieldErrors);
      return go("contact", false);
    }
    saveCheck(form, report, true);
    track("audit_complete", { score: report.overall, source: SOURCE });
    go("report", false);
  };

  const restart = () => {
    clearCheck();
    setReport(null);
    setHistory([]);
    setForm((f) => ({ ...EMPTY, name: f.name, email: f.email, phone: f.phone, smsOptIn: f.smsOptIn }));
    started.current = Date.now();
    go("kind", false);
  };

  const progress = Math.max(0.06, (PROGRESS.indexOf(step === "unlocking" ? "contact" : step) + 1) / PROGRESS.length);
  const wide = step === "report";

  return (
    <CtaSlot.Provider value={slot}>
    <div ref={scroller} className="theme-soft check-app fixed inset-0 z-[70] overflow-y-auto text-foreground" aria-label="Free Google & AI check">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className={cn("mx-auto flex h-16 items-center gap-3 px-4 sm:px-6", wide ? "max-w-4xl" : "max-w-xl")}>
          <button type="button" onClick={back} aria-label="Back" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-foreground transition hover:bg-muted/70">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          {step !== "report" ? (
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div className="h-full rounded-full bg-turbo transition-[width] duration-500 ease-out" style={{ width: `${progress * 100}%` }} />
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <Logo className="shrink-0" />
        </div>
      </div>

      <div className={cn("mx-auto px-5 pb-40 pt-4 sm:px-6", wide ? "max-w-4xl" : "max-w-xl")}>
        {step === "kind" && (
          <Screen kicker="Free 60-second check" title="Who is this check for?" sub="We'll check Google, your website and AI answers, then show your score. No card, no account.">
            <div className="grid gap-3">
              <Tile
                icon={<Building2 className="h-6 w-6" aria-hidden />}
                title="My business"
                sub="Google Maps, reviews vs competitors, website, AI"
                onClick={() => {
                  setForm((f) => ({ ...f, kind: "business", nameRank: "", press: "" }));
                  go("name");
                }}
              />
              <Tile
                icon={<Mic2 className="h-6 w-6" aria-hidden />}
                title="Me as an artist or producer"
                sub="Can fans find you when they Google your name?"
                onClick={() => {
                  setForm((f) => ({ ...f, kind: "artist", gbp: "", reviews: "" }));
                  go("name");
                }}
              />
            </div>
            <ProofLine />
          </Screen>
        )}

        {step === "name" && (
          <Screen kicker={form.kind === "artist" ? "Your name" : "Your business"} title={form.kind === "artist" ? "What's your artist name?" : "What's your business called?"} sub={form.kind === "artist" ? "Exactly how fans would search for you." : "Exactly how it shows on Google, plus your city."}>
            <form
              id="name-form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (form.business.trim().length < 2) return setErrors({ business: form.kind === "artist" ? "Enter your artist name." : "Enter your business name." });
                if (form.kind === "business" && form.city.trim().length < 2) return setErrors({ city: "Enter your city so we can find your competitors." });
                if (!started.current) started.current = Date.now();
                track("audit_start", { kind: form.kind, source: SOURCE });
                rememberBusiness(form.business);
                go("what");
              }}
              className="grid gap-3"
            >
              <BigInput id="chk-biz" label={form.kind === "artist" ? "Artist name" : "Business name"} value={form.business} onChange={(v) => set("business", v)} placeholder={form.kind === "artist" ? "e.g. Yari Beats" : "e.g. Mor Handy"} autoComplete="organization" error={errors.business} autoFocus />
              <BigInput id="chk-city" label={form.kind === "artist" ? "City (optional)" : "City"} value={form.city} onChange={(v) => set("city", v)} placeholder="e.g. Tampa, FL" autoComplete="address-level2" error={errors.city} />
            </form>
            <BottomCta form="name-form" disabled={form.business.trim().length < 2 || (form.kind === "business" && form.city.trim().length < 2)}>
              Continue
            </BottomCta>
          </Screen>
        )}

        {step === "what" && (
          <Screen kicker={form.business} title={form.kind === "artist" ? "What kind of artist are you?" : "What do you do?"} sub={form.kind === "artist" ? "Pick the closest one." : "We'll find the top 3 competitors near you for this."}>
            {!otherWhat ? (
              <div className="grid grid-cols-2 gap-3">
                {WHAT[form.kind].map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      set("what", v);
                      go("q0");
                    }}
                    className={cn("check-tile min-h-[64px] justify-center text-center", form.what === v && "check-tile-on")}
                  >
                    <span className="w-full text-center text-[15px] font-semibold leading-tight">{l}</span>
                  </button>
                ))}
                <button type="button" onClick={() => setOtherWhat(true)} className="check-tile min-h-[64px] justify-center text-center">
                  <span className="w-full text-center text-[15px] font-semibold">Something else</span>
                </button>
              </div>
            ) : (
              <form
                id="what-form"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (form.what.trim().length < 2) return;
                  go("q0");
                }}
              >
                <BigInput id="chk-what" label="In a few words" value={form.what} onChange={(v) => set("what", v)} placeholder={form.kind === "artist" ? "e.g. R&B singer" : "e.g. landscaping, lawyer, gym"} autoFocus />
                <BottomCta form="what-form" disabled={form.what.trim().length < 2}>
                  Continue
                </BottomCta>
              </form>
            )}
          </Screen>
        )}

        {(["q0", "q1", "q2"] as const).map((key, i) =>
          step === key && questions[i] ? (
            <Screen key={key} kicker={`Question ${i + 1} of 3`} title={questions[i].label}>
              <div className="grid gap-3">
                {questions[i].options.map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      set(questions[i].key, v as never);
                      go(i < 2 ? (`q${i + 1}` as Step) : "website");
                    }}
                    className={cn("check-tile", form[questions[i].key] === v && "check-tile-on")}
                  >
                    <span className="text-base font-semibold">{l}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
                  </button>
                ))}
              </div>
            </Screen>
          ) : null,
        )}

        {step === "website" && (
          <Screen kicker="Last one" title={form.kind === "artist" ? "Got a website or main link?" : "Do you have a website?"} sub={form.kind === "artist" ? "Your site, Linktree or Spotify. Skip it if you don't have one." : "Skip it if you don't. If you're on Google Maps, we'll use the site listed there."}>
            <form
              id="web-form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void runScan();
              }}
            >
              <BigInput id="chk-web" label={form.kind === "artist" ? "Website or link" : "Website"} value={form.website} onChange={(v) => set("website", v)} placeholder={form.kind === "artist" ? "yoursite.com or a Linktree" : "yourbusiness.com"} inputMode="url" autoComplete="url" />
              <label className="hidden" aria-hidden>
                Company site
                <input tabIndex={-1} autoComplete="off" value={form.company_site} onChange={(e) => set("company_site", e.target.value)} />
              </label>
            </form>
            <BottomCta form="web-form">
              {form.website.trim() ? "Run my free check" : "I don't have one, run my check"}
            </BottomCta>
          </Screen>
        )}

        {step === "scan" && <ScanScreen form={form} />}

        {step === "teaser" && report && <Teaser report={report} form={form} onNext={() => go("contact")} />}

        {(step === "contact" || step === "unlocking") && report && (
          <Screen
            pill={
              <>
                <TrendingUp className="h-4 w-4 text-turbo" aria-hidden /> {report.name} · {report.overall}/100
              </>
            }
            title="Where should we text your full report?"
            sub="Every fix, step by step, plus how you stack up against your competitors. Promise, no spam 🤞"
          >
            <form id="contact-form" noValidate onSubmit={unlock} className="grid gap-3">
              <BigInput id="chk-name" label="First name" value={form.name} onChange={(v) => set("name", v)} autoComplete="given-name" error={errors.name} autoFocus />
              <BigInput id="chk-phone" label="Mobile number" type="tel" inputMode="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(813) 555-0123" autoComplete="tel" error={errors.phone} />
              <BigInput id="chk-email" label="Email (optional)" type="email" inputMode="email" value={form.email} onChange={(v) => set("email", v)} autoComplete="email" error={errors.email} />
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--turbo))]" checked={form.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
                <span>
                  Text me my report and follow-up from CEO Turbo. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.{" "}
                  <Link to="/terms" className="underline underline-offset-2">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link to="/privacy-policy" className="underline underline-offset-2">
                    Privacy
                  </Link>
                  .
                </span>
              </label>
              <p className="text-[11px] leading-relaxed text-muted-foreground">By continuing you agree CEO Turbo may call or email you about your report (texts only if you ticked the box). We never sell your info.</p>
            </form>
            <BottomCta form="contact-form" disabled={step === "unlocking"}>
              {step === "unlocking" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Unlocking…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden /> Unlock my full report
                </>
              )}
            </BottomCta>
          </Screen>
        )}

        {step === "report" && report && (
          <div className="animate-step pt-2">
            <AuditReport report={report} form={form} source={SOURCE} onRestart={restart} />
          </div>
        )}

        {step === "failed" && (
          <Screen title={failure === "rate" ? "That's a lot of checks." : "We couldn't finish the scan."} sub={failure === "rate" ? "Too many checks from your network in the last few minutes. Try again shortly, or let us run it live with you." : "Something blocked the scan (it happens with some hosts). Call or book a free call and we'll run it live with you."}>
            <div className="grid gap-3">
              <button type="button" className="btn-ignite btn-shine w-full !py-4" onClick={() => openBooking(`${SOURCE} — scan failed`, `Free check for ${form.business}${form.website ? ` (${form.website})` : ""}. The online scan didn't finish.`, { name: form.name, email: form.email, phone: form.phone })}>
                Book a free call
              </button>
              <CallLink location="check failed" icon className="btn-blue w-full justify-center !py-4" />
              <button type="button" className="btn-chrome w-full !py-4" onClick={() => void runScan()}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Try again
              </button>
            </div>
          </Screen>
        )}
      </div>
      <div ref={setSlot} />
    </div>
    </CtaSlot.Provider>
  );
}

function Screen({ kicker, pill, title, sub, children }: { kicker?: string; pill?: ReactNode; title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="animate-step pt-2">
      {pill && <p className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold">{pill}</p>}
      {kicker && <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-turbo">{kicker}</p>}
      <h1 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-[34px]">{title}</h1>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Tile({ icon, title, sub, onClick }: { icon: ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="check-tile items-center gap-4 !p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-turbo/10 text-turbo">{icon}</span>
      <span className="min-w-0 text-left">
        <span className="block text-lg font-bold leading-tight">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{sub}</span>
      </span>
      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}

function BigInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  ...rest
}: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; placeholder?: string; autoComplete?: string; inputMode?: "text" | "tel" | "email" | "url"; autoFocus?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input id={id} type={type} data-clarity-mask="true" value={value} onChange={(e) => onChange(e.target.value)} maxLength={200} className={cn("check-input", error && "!border-[#e5484d]")} aria-invalid={!!error} {...rest} />
      {error && (
        <p className="mt-1.5 text-sm font-medium text-[#e5484d]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** The one big button, pinned to the bottom of the screen like an app. */
function BottomCta({ form, disabled, children }: { form?: string; disabled?: boolean; children: ReactNode }) {
  return <Pinned>{
        <button type="submit" form={form} disabled={disabled} className="btn-ignite btn-shine flex w-full items-center justify-center gap-2 !rounded-2xl !py-[18px] !text-lg font-bold shadow-xl disabled:pointer-events-none disabled:opacity-40">
          {children}
        </button>
  }</Pinned>;
}

function Pinned({ children }: { children: ReactNode }) {
  const slot = useContext(CtaSlot);
  const bar = (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background to-background/0 px-5 pt-8 sm:px-6">
      <div className="mx-auto max-w-xl pb-4">{children}</div>
    </div>
  );
  return slot ? createPortal(bar, slot) : bar;
}

function ProofLine() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-2 text-center">
      {[
        [String(AD_TOTALS.leads), "leads for clients"],
        [money(AD_TOTALS.avgCpl), "avg cost per lead"],
        [String(CLIENTS.length), "client sites live"],
      ].map(([n, l]) => (
        <div key={l} className="rounded-2xl bg-muted/60 px-2 py-3">
          <p className="font-display text-xl font-extrabold text-turbo">{n}</p>
          <p className="mt-0.5 text-[11px] font-medium leading-tight text-muted-foreground">{l}</p>
        </div>
      ))}
    </div>
  );
}

/** While the real scan runs: honest progress plus proof, so the wait builds trust instead of doubt. */
function ScanScreen({ form }: { form: Form }) {
  const steps = SCAN_STEPS[form.kind];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), 900);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <section className="animate-step pt-2" role="status" aria-live="polite">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-turbo">Checking {form.business}</p>
      <h1 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-[34px]">Running your free check…</h1>
      <ol className="mt-6 space-y-3">
        {steps.map((s, n) => (
          <li key={s} className={cn("flex items-center gap-3 text-[15px] transition-opacity duration-300", n > i ? "opacity-35" : "opacity-100")}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted">
              {n < i ? <CheckIcon className="h-4 w-4 text-emerald-600" aria-hidden /> : n === i ? <Loader2 className="h-4 w-4 animate-spin text-turbo" aria-hidden /> : null}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-8 rounded-3xl bg-turbo/[0.07] p-5 ring-1 ring-turbo/15">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-turbo">Why CEO Turbo</p>
        <p className="mt-2 font-display text-2xl font-extrabold leading-tight">
          <span className="text-turbo">{AD_TOTALS.leads} leads</span> for clients at {money(AD_TOTALS.avgCpl)} each
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-2">
            <Star className="mt-0.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden /> Appliance King: 42 Google Ads conversions at $4.19 each
          </li>
          <li className="flex gap-2">
            <Star className="mt-0.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden /> {CLIENTS.length} client websites built and live
          </li>
          <li className="flex gap-2">
            <Star className="mt-0.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden /> You talk to Chris, the founder. Not a call center.
          </li>
        </ul>
      </div>
    </section>
  );
}

/** The result before any contact details: score, you vs the top competitor, and the 2 biggest problems. */
function Teaser({ report: r, form: f, onNext }: { report: Report; form: Form; onNext: () => void }) {
  const g = grade(r.overall);
  const top = useMemo(() => r.top.map((id) => r.checks.find((c) => c.id === id)).filter(Boolean) as Check[], [r]);
  const more = r.checks.filter((c) => c.status !== "pass").length - Math.min(2, top.length);
  return (
    <section className="animate-step pt-2">
      <p className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-bold">
        <MapPin className="h-4 w-4 text-turbo" aria-hidden /> {r.name}
        {f.city ? ` · ${f.city}` : ""}
      </p>
      <div className="flex flex-col items-center text-center">
        <ScoreGauge value={r.overall} />
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Your result</p>
        <h1 className={cn("mt-1 font-display text-[30px] font-extrabold leading-tight", g.tone)}>{g.label}</h1>
        <p className="mt-2 max-w-md text-[15px] text-muted-foreground">{g.line}</p>
      </div>

      {r.google && (
        <div className="mt-6">
          <GoogleCompare google={r.google} name={r.name} what={f.what} city={f.city} />
        </div>
      )}

      {top.length > 0 && (
        <div className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-border">
          <h2 className="font-display text-lg font-bold">Your 2 biggest problems</h2>
          <ol className="mt-3 space-y-4">
            {top.slice(0, 2).map((c, i) => (
              <li key={c.id} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e5484d]/10 text-sm font-bold text-[#e5484d]">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-semibold">{c.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {more > 0 && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-sm font-semibold">
              <Lock className="h-4 w-4 text-turbo" aria-hidden /> +{more} more fixes, ranked, in your full report
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" aria-hidden /> Rather talk?{" "}
        <CallLink location="check teaser" className="font-semibold text-foreground underline underline-offset-4" />
      </div>

      <Pinned>
          <button type="button" onClick={onNext} className="btn-ignite btn-shine flex w-full items-center justify-center gap-2 !rounded-2xl !py-[18px] !text-lg font-bold shadow-xl">
            Show me how to fix it 👍
          </button>
      </Pinned>
    </section>
  );
}
