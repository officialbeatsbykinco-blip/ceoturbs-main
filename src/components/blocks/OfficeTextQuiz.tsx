// Office setup on a phone: three taps and a first name, then Messages opens with the request typed out.
// Fires one Lead (content_category "office_setup").
import { useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { CallLink } from "@/components/site/CallLink";
import { smsHref } from "@/lib/sms";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

export const OFFICE_NEEDS = [
  { id: "desks", label: "Desks & multi-monitor workstations", text: "workstations and monitors set up" },
  { id: "network", label: "Wi-Fi, network & printers", text: "Wi-Fi, network and printers set up" },
  { id: "accounts", label: "Microsoft 365 or Google Workspace", text: "Microsoft 365 or Google Workspace set up" },
  { id: "move", label: "Full office move-in or build-out", text: "a full office setup" },
] as const;
export const OFFICE_SIZES = ["1–3 desks", "4–10 desks", "11+ desks"] as const;
export const OFFICE_WHEN = ["This week", "This month", "Just getting prices"] as const;

type Answers = { need?: (typeof OFFICE_NEEDS)[number]["id"]; size?: string; when?: string; name: string };

export function officeMessage(a: Answers) {
  const need = OFFICE_NEEDS.find((n) => n.id === a.need)?.text ?? "help with an office setup";
  const name = a.name.trim() ? ` – ${a.name.trim().split(/\s+/)[0]}` : "";
  return `Hi Chris, I need ${need} in Tampa. Size: ${a.size ?? "not sure"}. Timing: ${a.when ?? "not sure"}. What's the price?${name}`;
}

const STEPS = ["need", "size", "when", "send"] as const;

export function OfficeTextQuiz({ id = "book", className }: { id?: string; className?: string }) {
  const [a, setA] = useState<Answers>({ name: "" });
  const [step, setStep] = useState<(typeof STEPS)[number]>("need");
  const [err, setErr] = useState("");
  const sent = useRef(false);
  const index = STEPS.indexOf(step);
  const go = (next: (typeof STEPS)[number], patch: Partial<Answers>) => {
    setA((p) => ({ ...p, ...patch }));
    setStep(next);
    track("office_quiz_step", { step: next, step_number: STEPS.indexOf(next) + 1 });
  };
  const message = officeMessage(a);
  const onText = (e: MouseEvent<HTMLAnchorElement>) => {
    if (a.name.trim().length < 2) {
      e.preventDefault();
      return setErr("Add your first name.");
    }
    if (sent.current) return;
    sent.current = true;
    track("generate_lead", { lead_source: "office-quiz", channel: "sms", value: 300, currency: "USD", content_name: "Office setup Tampa", content_category: "office_setup", need: a.need, size: a.size, timing: a.when }, { user: { name: a.name.trim() } });
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
            <Title text="What do you need set up?" />
            <div className="grid gap-2.5">
              {OFFICE_NEEDS.map((o) => (
                <Opt key={o.id} label={o.label} pressed={a.need === o.id} onClick={() => go("size", { need: o.id })} />
              ))}
            </div>
          </>
        )}
        {step === "size" && (
          <>
            <Title text="How big is the office?" />
            <div className="grid gap-2.5">
              {OFFICE_SIZES.map((o) => (
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
