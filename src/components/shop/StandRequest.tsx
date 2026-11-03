import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { REVIEW_STAND } from "@/config/site";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { rememberBusiness } from "@/lib/review-link";
import { attribution, track, visitorId } from "@/lib/track";

/** Request form for the counter stand (no checkout yet): posts an order-request lead we reply to with a payment link. */
export function StandRequest({ open, onOpenChange, business = "" }: { open: boolean; onOpenChange: (v: boolean) => void; business?: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", company_site: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const opened = useRef(0);
  const uid = useId();

  useEffect(() => {
    if (open) {
      opened.current = Date.now();
      setF((x) => ({ ...x, business: x.business || business }));
      if (state !== "done") setState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) return setErr("Enter a valid email.");
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return setErr("Enter a valid phone number.");
    setErr("");
    setState("sending");
    try {
      const eventId = `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, eventId, visitorId: visitorId(), attribution: attribution(), type: "order-request", product: REVIEW_STAND.name, pack: "Stand", elapsedMs: Date.now() - opened.current, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { lead_source: "stand_request" }, { eventId, user: { email: f.email, phone: f.phone, name: f.name, externalId: visitorId() } });
      rememberBusiness(f.business);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-md overflow-y-auto rounded-3xl border-white/10 bg-[hsl(220_34%_6%)] p-6 text-foreground sm:p-7">
        {state === "done" ? (
          <div className="py-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
              <Check className="h-7 w-7 text-emerald-300" />
            </span>
            <DialogTitle className="mt-4 text-2xl font-bold">Got it, thank you</DialogTitle>
            <DialogDescription className="mt-2 leading-relaxed text-muted-foreground">We'll text or email you the price and a secure payment link shortly. No charge until you say yes.</DialogDescription>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <DialogTitle className="text-2xl font-bold">Get my review stand</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">Tell us where to send it. We'll reply with the price and a payment link.</DialogDescription>
            <div className="mt-5 grid gap-3">
              {(
                [
                  ["name", "Your name", "name", "text"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Mobile phone", "tel", "tel"],
                  ["business", "Business name", "organization", "text"],
                ] as const
              ).map(([k, label, ac, type]) => (
                <div key={k}>
                  <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
                    {label}
                  </label>
                  <input id={`${uid}-${k}`} data-clarity-mask="true" type={type} className="field" value={f[k]} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} autoComplete={ac} maxLength={k === "email" ? 200 : 100} />
                </div>
              ))}
              <label className="hidden" aria-hidden>
                Company site
                <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={(e) => setF((x) => ({ ...x, company_site: e.target.value }))} />
              </label>
            </div>
            {err && (
              <p className="mt-3 text-sm font-medium text-[#ff8080]" role="alert">
                {err}
              </p>
            )}
            {state === "error" && (
              <p className="mt-3 text-sm text-[#ff8080]" role="alert">
                Couldn't send that. Check your connection and try again.
              </p>
            )}
            <button type="submit" disabled={state === "sending"} className="btn-ignite btn-shine mt-5 w-full !py-4">
              {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send my request
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Nothing is charged now.{" "}
              <Link to="/privacy-policy" className="underline underline-offset-2">
                Privacy
              </Link>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
