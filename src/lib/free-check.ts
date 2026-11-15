// The free Google & AI check: shared types, questions and the two API calls (scan, unlock).
// Used by the inline tool (AuditTool on /free-audit and the tutorial) and the full-screen flow (/check),
// so every lead goes through exactly the same code and lands in the sheet with the same fields.
import { attribution, newEventId, track, visitorId } from "@/lib/track";

/** What a free-check lead is worth to the ad platforms (same number on the Pixel and the Conversions API). */
export const FREE_CHECK_VALUE = 10;
/** The name used everywhere for the lead magnet. */
export const FREE_CHECK_NAME = "Free Google & AI Visibility Check";
/** Full-screen flow; site CTAs point here. */
export const CHECK_PATH = "/check";

export type Kind = "business" | "artist";
export type Status = "pass" | "warn" | "fail";
export type Check = { cat: string; id: string; weight: number; status: Status; label: string; detail: string; fix: string };
export type Place = { name: string; rating: number | null; reviews: number; mapsUrl?: string; category?: string };
export type GoogleData = { found: boolean; place: Place | null; competitors: Place[] };
export type Report = {
  kind: Kind;
  name: string;
  overall: number;
  scores: Record<string, number>;
  categories: string[];
  checks: Check[];
  top: string[];
  google?: GoogleData | null;
  meta: { site: string | null; platform: string | null; psi: boolean; google?: boolean; checkedAt: string };
};

export type Form = {
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
export type FormErrors = Partial<Record<keyof Form | "form", string>>;

export const EMPTY: Form = { kind: "business", business: "", what: "", city: "", website: "", stage: "", gbp: "", reviews: "", press: "", nameRank: "", name: "", email: "", phone: "", smsOptIn: false, company_site: "" };

export const CATEGORY: Record<string, { short: string; title: string; question: string }> = {
  seo: { short: "SEO", title: "Search engine optimization", question: "Can Google find and rank you?" },
  aeo: { short: "AEO", title: "Answer engine optimization", question: "Can AI Overviews and assistants quote you?" },
  geo: { short: "GEO", title: "Generative engine optimization", question: "Do ChatGPT, Gemini and Perplexity trust you enough to name you?" },
  reviews: { short: "Reviews", title: "Google reviews & profile", question: "Will customers pick you over the business next door?" },
};

export type Question = { key: keyof Form; label: string; options: [string, string][] };
export const QUESTIONS: Record<Kind, Question[]> = {
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

export const SCAN_STEPS: Record<Kind, string[]> = {
  business: ["Looking you up on Google Maps", "Finding your top competitors nearby", "Loading your website", "Reading titles, headings and content", "Checking schema and FAQ markup", "Testing AI access (ChatGPT, Perplexity, Claude)", "Scoring Google, AI and reviews"],
  artist: ["Loading your website or main link", "Reading titles, headings and content", "Checking schema and FAQ markup", "Testing AI access (ChatGPT, Perplexity, Claude)", "Searching music and knowledge databases", "Scoring SEO, AEO and GEO", "Writing your action plan"],
};

export const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const STORE = "ct_audit_v1";

export function grade(score: number) {
  if (score >= 90) return { label: "Strong", tone: "text-turbo", line: "You're ahead of most competitors. The job now is staying there." };
  if (score >= 75) return { label: "Good, not dominant", tone: "text-turbo", line: "A few fixes stand between you and the top spot." };
  if (score >= 50) return { label: "Leaking customers", tone: "text-[hsl(var(--ignite-hot))]", line: "People can find you, but competitors are getting calls that should be yours." };
  return { label: "Hard to find", tone: "text-[#ff6b6b]", line: "Most people searching for what you do won't find you — on Google or in AI answers." };
}

/** Saved for the tab, so a finished (or teased) report survives navigating away and back. */
export function saveCheck(form: Form, report: Report, unlocked: boolean) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify({ form: { ...form, company_site: "" }, report, unlocked }));
  } catch {
    /* ignore */
  }
}
export function loadCheck(): { form: Form; report: Report; unlocked: boolean } | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
    if (!saved?.report) return null;
    return { form: { ...EMPTY, ...saved.form }, report: saved.report, unlocked: saved.unlocked !== false };
  } catch {
    return null;
  }
}
export function clearCheck() {
  try {
    sessionStorage.removeItem(STORE);
  } catch {
    /* ignore */
  }
}

export type ScanResult = { report: Report } | { error: "business" | "rate" | "server" | "network" };

/** Runs the check with no contact details: the visitor sees a teaser, then unlocks it. Saves no lead. */
export async function scanRequest(form: Form, startedAt: number): Promise<ScanResult> {
  try {
    const { name: _n, email: _e, phone: _p, smsOptIn: _s, ...business } = form;
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...business, mode: "scan", elapsedMs: Date.now() - (startedAt || Date.now()), page: window.location.pathname }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.report) return { report: data.report };
    if (res.status === 400 && data.error === "business") return { error: "business" };
    return { error: res.status === 429 ? "rate" : "server" };
  } catch {
    return { error: "network" };
  }
}

export function contactErrors(form: Form): FormErrors {
  const errs: FormErrors = {};
  if (form.name.trim().length < 2) errs.name = "Enter your first name.";
  const digits = form.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) errs.phone = "Enter a valid mobile number.";
  if (form.email.trim() && !EMAIL.test(form.email.trim())) errs.email = "Check your email (or leave it blank).";
  return errs;
}

/**
 * First name + mobile unlock the full report. This is the lead: same `type` and sheet fields as always,
 * one event id shared by the browser Pixel and the server's Lead. Retries a server or network hiccup
 * (the sheet de-duplicates on the event id) and never holds the report hostage to our own outage.
 * Returns field errors when the server rejects the contact details; otherwise the report can be shown.
 */
export async function unlockRequest(form: Form, report: Report, startedAt: number, source: string): Promise<FormErrors | null> {
  const leadEventId = newEventId("generate_lead");
  let counted = false;
  // The browser copy fires only after the server takes the lead: a typo'd phone that comes back 400 must not count.
  const countLead = () => {
    if (counted) return;
    counted = true;
    track(
      "generate_lead",
      { lead_source: "free_check", kind: form.kind, stage: form.stage, source, value: FREE_CHECK_VALUE, currency: "USD", content_name: form.kind === "artist" ? "Artist visibility check" : "Business visibility check", content_category: `${form.kind === "artist" ? "Artist" : "Business"} · ${form.stage === "start" ? "Starting out" : "Growing"}` },
      { eventId: leadEventId, user: { email: form.email, phone: form.phone, name: form.name, externalId: visitorId() } },
    );
  };
  const topLabels = report.top.map((id) => report.checks.find((c) => c.id === id)?.label).filter(Boolean);
  const payload = JSON.stringify({
    ...form,
    mode: "unlock",
    summary: { overall: report.overall, scores: report.scores, top: topLabels },
    visitorId: visitorId(),
    elapsedMs: Date.now() - (startedAt || Date.now()),
    page: window.location.pathname,
    eventId: leadEventId,
    attribution: attribution(),
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && ["name", "email", "phone"].includes(data.error)) {
        return { [data.error]: data.error === "phone" ? "Enter a valid mobile number." : data.error === "email" ? "Check your email (or leave it blank)." : "Enter your first name." };
      }
      if (res.ok || res.status === 429) {
        countLead();
        return null;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 900 * (attempt + 1)));
  }
  countLead();
  return null;
}
