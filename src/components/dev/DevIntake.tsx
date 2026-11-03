// Short intake for software developers (/app-marketing): 5 questions, no phone number.
// Posts to /api/lead as type "dev-intake" (answers land in the sheet's Note column), fires the same
// generate_lead event as every other lead (Meta, GA4, Google Ads, Reddit, TikTok, Microsoft), then offers the call.
import { useId, useRef, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { openBooking } from "@/lib/cal";
import { sendLead } from "@/lib/lead-outbox";
import { attribution, newEventId, track, visitorId } from "@/lib/track";

export const DEV_PLATFORMS = ["iOS app", "Android app", "SaaS / web app", "Browser extension", "CLI / open source", "Game", "Other"] as const;
export const DEV_STAGES = ["Pre-launch", "Launched, under 100 users", "Have users, want to scale", "Have revenue, want to grow it"] as const;
/** Ad-budget answer → lead value for ad-platform optimization (same scale as the Brand Boost quiz). */
export const DEV_BUDGETS: { label: string; value: number }[] = [
  { label: "Under $300 / month", value: 10 },
  { label: "$300 – $1,000 / month", value: 50 },
  { label: "$1,000 – $3,000 / month", value: 150 },
  { label: "$3,000+ / month", value: 300 },
  { label: "Not sure yet", value: 10 },
];

type FormState = { name: string; email: string; appUrl: string; platform: string; stage: string; budget: string; blocker: string; company_site: string };
type Setter = (k: keyof FormState) => (e: { target: { value: string } }) => void;

// Module-level (not defined inside DevIntake) so inputs keep focus while typing.
function Field({ uid, f, set, k, label, type = "text", ac, ph, max = 200 }: { uid: string; f: FormState; set: Setter; k: "name" | "email" | "appUrl"; label: string; type?: string; ac?: string; ph?: string; max?: number }) {
  return (
    <div>
      <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
        {label}
      </label>
      <input id={`${uid}-${k}`} data-clarity-mask="true" type={type} className="field" value={f[k]} onChange={set(k)} autoComplete={ac} placeholder={ph} maxLength={max} inputMode={type === "email" ? "email" : type === "url" ? "url" : undefined} />
    </div>
  );
}

function Select({ uid, f, set, k, label, options }: { uid: string; f: FormState; set: Setter; k: "platform" | "stage" | "budget"; label: string; options: readonly string[] }) {
  return (
    <div>
      <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
        {label}
      </label>
      <select id={`${uid}-${k}`} className="field" value={f[k]} onChange={set(k)}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function DevIntake({ source = "app-marketing" }: { source?: string }) {
  const uid = useId();
  const opened = useRef(Date.now());
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [f, setF] = useState<FormState>({ name: "", email: "", appUrl: "", platform: "", stage: "", budget: "", blocker: "", company_site: "" });
  const set: Setter = (k) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) return setErr("Enter a valid email.");
    if (!f.platform || !f.stage || !f.budget) return setErr("Pick a platform, stage and budget so we can size the plan.");
    setErr("");
    setState("sending");
    const value = DEV_BUDGETS.find((b) => b.label === f.budget)?.value ?? 10;
    const eventId = newEventId("lead");
    const ok = await sendLead({ ...f, type: "dev-intake", eventId, value, visitorId: visitorId(), attribution: attribution(), elapsedMs: Date.now() - opened.current, page: window.location.pathname });
    if (!ok) {
      // Queued in the lead outbox and re-sent on the next page load; still count the conversion once.
      track("generate_lead", { lead_source: "reddit-dev-intake", value, currency: "USD", content_name: "Developer intake" }, { eventId, user: { email: f.email, name: f.name, externalId: visitorId() } });
      return setState("error");
    }
    track("generate_lead", { lead_source: "reddit-dev-intake", value, currency: "USD", content_name: "Developer intake" }, { eventId, user: { email: f.email, name: f.name, externalId: visitorId() } });
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="panel p-6 text-center sm:p-8" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
          <Check className="h-7 w-7 text-emerald-300" aria-hidden />
        </span>
        <h3 className="mt-4 text-2xl font-bold">Got it. Pick a time.</h3>
        <p className="mt-2 text-muted-foreground">I'll read your answers before the call, so we spend the 30 minutes on your app, not on intros.</p>
        <button type="button" className="btn-ignite mt-6" onClick={() => void openBooking(source, `Dev intake: ${f.platform} · ${f.stage} · ${f.budget}`)}>
          Book my free 30-min call
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="panel p-5 sm:p-7" aria-label="Developer growth plan intake">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field uid={uid} f={f} set={set} k="name" label="Your name" ac="name" max={100} />
        <Field uid={uid} f={f} set={set} k="email" label="Email" type="email" ac="email" />
      </div>
      <div className="mt-4">
        <Field uid={uid} f={f} set={set} k="appUrl" label="Link to your app, repo or site" type="url" ph="https://" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Select uid={uid} f={f} set={set} k="platform" label="What is it?" options={DEV_PLATFORMS} />
        <Select uid={uid} f={f} set={set} k="stage" label="Where are you?" options={DEV_STAGES} />
        <Select uid={uid} f={f} set={set} k="budget" label="Monthly ad budget" options={DEV_BUDGETS.map((b) => b.label)} />
      </div>
      <div className="mt-4">
        <label htmlFor={`${uid}-blocker`} className="mb-1.5 block text-xs font-medium text-chrome">
          What's stopping installs? <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea id={`${uid}-blocker`} className="field min-h-[84px]" value={f.blocker} onChange={set("blocker")} maxLength={300} />
      </div>
      <label className="hidden" aria-hidden>
        Company site
        <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={set("company_site")} />
      </label>
      {err && (
        <p className="mt-3 text-sm font-medium text-[#ff8080]" role="alert">
          {err}
        </p>
      )}
      {state === "error" && (
        <p className="mt-3 text-sm text-[#ff8080]" role="alert">
          Couldn't send that right now. It's saved on this device and we'll retry, or{" "}
          <button type="button" className="underline" onClick={() => void openBooking(source)}>
            book the call directly
          </button>
          .
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn-ignite btn-shine mt-5 w-full !py-4 sm:w-auto sm:px-10">
        {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Get my free growth plan
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        No phone number, no sales sequence. I read it and reply within one business day.{" "}
        <Link to="/privacy-policy" className="underline underline-offset-2">
          Privacy
        </Link>
      </p>
    </form>
  );
}
