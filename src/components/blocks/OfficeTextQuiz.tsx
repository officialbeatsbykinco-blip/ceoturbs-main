// Office setup on a phone: pick every need (several allowed), size, timing and a first name, then Messages opens with the request typed out.
// Fires one Lead (content_category "office_setup").
import { useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Check, MessageSquare } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { smsHref } from "@/lib/sms";
import { sendLead } from "@/lib/lead-outbox";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

export const OFFICE_NEEDS = [
  { id: "desks", label: "Desks & multi-monitor workstations", text: "workstations and monitors set up" },
  { id: "network", label: "Wi-Fi, network & printers", text: "Wi-Fi, network and printers set up" },
  { id: "accounts", label: "Microsoft 365 or Google Workspace", text: "Microsoft 365 or Google Workspace set up" },
  { id: "move", label: "Full office move-in or build-out", text: "a full office setup" },
] as const;
export const OFFICE_SIZES = ["1–3 desks", "4–10 desks", "11+ desks"] as const;
export const OFFICE_WHEN = ["This week", "This month", "Just getting prices"] as const;

/** One setup quiz, three taps: what they need, how big, when. Each /services setup page gets answers that fit it. */
export type SetupQuiz = {
  /** Lead tag for the sheet, Meta and TikTok. */
  key: string;
  needTitle: string;
  needs: readonly { id: string; label: string; text: string }[];
  sizeTitle: string;
  /** How the size answer reads in the text, e.g. "Size" or "Registers". */
  sizeLabel: string;
  sizes: readonly string[];
  /** One answer only (e.g. which POS brand): a tap moves on. Otherwise people can tap several needs, then Continue. */
  single?: boolean;
};

export const OFFICE_QUIZ: SetupQuiz = { key: "office-setup", needTitle: "What do you need set up?", needs: OFFICE_NEEDS, sizeTitle: "How big is the office?", sizeLabel: "Size", sizes: OFFICE_SIZES };

const HOME_OFFICE_QUIZ: Omit<SetupQuiz, "key"> = {
  needTitle: "What do you need set up?",
  needs: [
    { id: "desk", label: "Desk, monitors & docking station", text: "my desk and monitors set up" },
    { id: "computer", label: "Computer, printer & accounts", text: "my computer and printer set up" },
    { id: "wifi", label: "Wi-Fi & internet", text: "my Wi-Fi and internet set up" },
    { id: "cables", label: "Cable cleanup & organizing", text: "my cables cleaned up and organized" },
  ],
  sizeTitle: "How many desks?",
  sizeLabel: "Desks",
  sizes: ["1 desk", "2 desks", "3 or more"],
};

/** Phone quizzes for the /services setup pages (CALL_FIRST_SLUGS). Anything not listed gets the office quiz. */
export const SETUP_QUIZZES: Record<string, SetupQuiz> = {
  "home-office-setup": { key: "home-office-setup", ...HOME_OFFICE_QUIZ },
  "apartment-home-office-setup": { key: "apartment-home-office-setup", ...HOME_OFFICE_QUIZ },
  "office-transformation": { ...OFFICE_QUIZ, key: "office-transformation" },
  "school-computer-room-setup": {
    key: "school-computer-room-setup",
    needTitle: "What does the school need?",
    needs: [
      { id: "new", label: "New computer lab setup", text: "a new computer lab set up" },
      { id: "redo", label: "Move or rewire an existing lab", text: "our computer lab moved or rewired" },
      { id: "network", label: "Wi-Fi & network for classrooms", text: "classroom Wi-Fi and network set up" },
      { id: "accounts", label: "Printers & Google or Microsoft accounts", text: "printers and student accounts set up" },
    ],
    sizeTitle: "How many computers?",
    sizeLabel: "Computers",
    sizes: ["Under 10", "10–30", "30 or more"],
  },
  "dj-studio-setup": {
    key: "dj-studio-setup",
    needTitle: "What are you setting up?",
    needs: [
      { id: "booth", label: "DJ booth & controller", text: "my DJ booth and controller set up" },
      { id: "desk", label: "Studio desk, monitors & computer", text: "my studio desk and computer set up" },
      { id: "audio", label: "Audio interface & speakers", text: "my audio interface and speakers set up" },
      { id: "full", label: "The whole studio, start to finish", text: "my whole studio set up" },
    ],
    sizeTitle: "What kind of space?",
    sizeLabel: "Space",
    sizes: ["Bedroom or home", "Dedicated room", "Commercial studio"],
  },
  "computer-build-setup": {
    key: "computer-build-setup",
    needTitle: "What do you need?",
    needs: [
      { id: "gaming", label: "Build a new gaming PC", text: "a gaming PC built" },
      { id: "work", label: "Build a work or editing PC", text: "a work or editing PC built" },
      { id: "upgrade", label: "Upgrade my current PC", text: "my PC upgraded" },
      { id: "setup", label: "Set up a PC I already bought", text: "a new PC set up" },
    ],
    sizeTitle: "Budget for parts?",
    sizeLabel: "Budget",
    sizes: ["Under $1,000", "$1,000–$2,000", "$2,000 or more", "Not sure yet"],
  },
  "pos-system-setup": {
    key: "pos-system-setup",
    needTitle: "Which POS system?",
    needs: [
      { id: "square", label: "Square", text: "a Square POS installed" },
      { id: "toast", label: "Toast", text: "a Toast POS installed" },
      { id: "clover", label: "Clover", text: "a Clover POS installed" },
      { id: "other", label: "Other or not sure yet", text: "a POS system installed" },
    ],
    sizeTitle: "How many registers?",
    sizeLabel: "Registers",
    sizes: ["1", "2–3", "4 or more"],
    single: true,
  },
};

type Answers = { needs: string[]; size?: string; when?: string; name: string };

/** "a", "a and b", "a, b and c" */
const joinAnd = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export function officeMessage(a: Answers, quiz: SetupQuiz = OFFICE_QUIZ) {
  const need = joinAnd(quiz.needs.filter((n) => a.needs.includes(n.id)).map((n) => n.text)) || "help with a setup";
  const name = a.name.trim() ? ` – ${a.name.trim().split(/\s+/)[0]}` : "";
  return `Hi Chris, I need ${need} in Tampa. ${quiz.sizeLabel}: ${a.size ?? "not sure"}. Timing: ${a.when ?? "not sure"}. What's the price?${name}`;
}

const STEPS = ["need", "size", "when", "send"] as const;

export function OfficeTextQuiz({ id = "book", className, quiz = OFFICE_QUIZ }: { id?: string; className?: string; quiz?: SetupQuiz }) {
  const [a, setA] = useState<Answers>({ needs: [], name: "" });
  const [step, setStep] = useState<(typeof STEPS)[number]>("need");
  const [err, setErr] = useState("");
  const sent = useRef(false);
  const index = STEPS.indexOf(step);
  const go = (next: (typeof STEPS)[number], patch: Partial<Answers>) => {
    setA((p) => ({ ...p, ...patch }));
    setStep(next);
    track("office_quiz_step", { step: next, step_number: STEPS.indexOf(next) + 1 });
  };
  const message = officeMessage(a, quiz);
  const onText = (e: MouseEvent<HTMLAnchorElement>) => {
    if (a.name.trim().length < 2) {
      e.preventDefault();
      return setErr("Add your first name.");
    }
    if (sent.current) return;
    sent.current = true;
    const need = quiz.needs.filter((n) => a.needs.includes(n.id)).map((n) => n.label).join(", ");
    const user = { name: a.name.trim(), externalId: visitorId() };
    const eventId = track("generate_lead", { lead_source: "office-quiz", channel: "sms", value: 300, currency: "USD", content_name: quiz === OFFICE_QUIZ ? "Office setup Tampa" : `Setup: ${quiz.key}`, content_category: "office_setup", service: quiz.key, need: a.needs.join(","), need_count: a.needs.length, size: a.size, timing: a.when }, { user });
    // Server copy (Conversions API + leads sheet), same event_id so Meta de-duplicates it.
    void sendLead({ type: "tech-repair", service: quiz === OFFICE_QUIZ ? "office-quiz" : `setup-quiz:${quiz.key}`, channel: "sms", eventId, value: 300, visitorId: user.externalId, quizId: newEventId("o"), name: user.name, phone: "", problem: need, device: a.size ?? "", where: a.when ?? "", city: "", page: window.location.pathname, attribution: attribution(), company_site: "", elapsedMs: 99_999 });
  };

  return (
    <div id={id} className={cn("scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-xl", className)}>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-turbo">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden /> Get a price by text · under a minute
        </span>
        <span aria-live="polite">
          Step {index + 1} of {STEPS.length}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[hsl(var(--ignite))] transition-[width] duration-300" style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
      </div>
      <div key={step} className="mt-5 animate-step">
        {step === "need" && (
          <>
            <Title text={quiz.needTitle} />
            {!quiz.single && <p className="-mt-2 mb-3 text-sm text-muted-foreground">Tap all that apply.</p>}
            <div className="grid gap-2.5">
              {quiz.needs.map((o) =>
                quiz.single ? (
                  <Opt key={o.id} label={o.label} pressed={a.needs[0] === o.id} onClick={() => go("size", { needs: [o.id] })} />
                ) : (
                  <Check1 key={o.id} label={o.label} on={a.needs.includes(o.id)} onClick={() => (setErr(""), setA((p) => ({ ...p, needs: p.needs.includes(o.id) ? p.needs.filter((x) => x !== o.id) : [...p.needs, o.id] })))} />
                ),
              )}
            </div>
            {!quiz.single && (
              <>
                {err && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {err}
                  </p>
                )}
                <button type="button" onClick={() => (a.needs.length ? (setErr(""), go("size", {})) : setErr("Tap at least one."))} className="btn-ignite mt-3 w-full justify-center !py-4 !text-base">
                  {a.needs.length > 1 ? `Continue with ${a.needs.length}` : "Continue"} <ArrowRight className="h-5 w-5" aria-hidden />
                </button>
              </>
            )}
          </>
        )}
        {step === "size" && (
          <>
            <Title text={quiz.sizeTitle} />
            <div className="grid gap-2.5">
              {quiz.sizes.map((o) => (
                <Opt key={o} label={o} pressed={a.size === o} onClick={() => go("when", { size: o })} />
              ))}
            </div>
            <Back onClick={() => setStep("need")} />
          </>
        )}
        {step === "when" && (
          <>
            <Title text="When do you need it?" />
            <div className="grid gap-2.5">
              {OFFICE_WHEN.map((o) => (
                <Opt key={o} label={o} pressed={a.when === o} onClick={() => go("send", { when: o })} />
              ))}
            </div>
            <Back onClick={() => setStep("size")} />
          </>
        )}
        {step === "send" && (
          <div className="grid gap-3">
            <Title text="Last step: send it to us" />
            <div>
              <label htmlFor="office-quiz-name" className="mb-1.5 block text-xs font-medium text-chrome">
                First name
              </label>
              <input id="office-quiz-name" data-clarity-mask="true" className="field" value={a.name} onChange={(e) => (setA((p) => ({ ...p, name: e.target.value })), setErr(""))} autoComplete="given-name" maxLength={100} aria-invalid={!!err} />
              {err && (
                <p className="mt-1.5 text-xs text-destructive" role="alert">
                  {err}
                </p>
              )}
            </div>
            <p data-clarity-mask="true" className="rounded-xl bg-muted/70 p-3 text-sm leading-relaxed">
              {message}
            </p>
            <a href={smsHref(message)} onClick={onText} data-call-location="office-quiz" className="btn-ignite btn-shine w-full justify-center !py-4 !text-base">
              <MessageSquare className="h-5 w-5" aria-hidden /> Text it to us
            </a>
            <p className="text-center text-xs text-muted-foreground">Opens Messages with this filled in. Add a photo of the space if you can.</p>
            <p className="text-center text-sm">
              Rather talk?{" "}
              <CallLink location="office quiz" className="font-semibold text-foreground underline underline-offset-2">
                Call us
              </CallLink>
            </p>
            <Back onClick={() => setStep("when")} />
          </div>
        )}
      </div>
    </div>
  );
}

function Check1({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="quiz-opt quiz-tap !py-3 text-left">
      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{label}</span>
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border-2", on ? "border-turbo bg-turbo text-white" : "border-border")} aria-hidden>
        {on && <Check className="h-4 w-4" />}
      </span>
    </button>
  );
}

function Opt({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="quiz-opt quiz-tap !py-3 text-left">
      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
    </button>
  );
}
const Title = ({ text }: { text: string }) => <p className="mb-3 font-display text-2xl font-bold leading-tight">{text}</p>;
const Back = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="mt-1 flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
    <ArrowLeft className="h-4 w-4" aria-hidden /> Back
  </button>
);
