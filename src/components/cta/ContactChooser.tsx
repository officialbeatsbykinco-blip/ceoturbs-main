// "Contact us": one button that lets the visitor say what they need, then sends them down the right path.
// Phones: a bottom sheet; each choice opens that service's tap-question text flow. Computers: a dialog; each
// choice goes to the page with its calendar. Call and Text are always one tap away.
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Laptop, Megaphone, MessageSquare, Monitor, Phone, X, type LucideIcon } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CallLink } from "@/components/site/CallLink";
import { SITE } from "@/config/site";
import { IT_SERVICES_PATH, OFFICE_SETUP_PATH } from "@/content/tech-pages";
import { canText, QUICK_TECH_TEXT, smsHref } from "@/lib/sms";
import { openTechQuiz } from "@/lib/tech-quiz-open";
import { openTextQuiz } from "@/lib/text-quiz-open";
import { track } from "@/lib/track";

declare global {
  interface Window {
    __ctContact?: boolean;
  }
}

/** Opens the chooser. Returns false before JS is ready, so a link can fall back to /contact. */
export function openContact(source: string): boolean {
  if (typeof window === "undefined" || !window.__ctContact) return false;
  window.dispatchEvent(new CustomEvent<string>("ct:contact", { detail: source }));
  return true;
}

type Choice = { id: string; icon: LucideIcon; title: string; sub: string };
const CHOICES: Choice[] = [
  { id: "repair", icon: Laptop, title: "Fix my computer or phone", sub: "Slow, broken, virus, cracked screen" },
  { id: "office", icon: Monitor, title: "Set up my office", sub: "Desks, monitors, cables, Wi-Fi" },
  { id: "grow", icon: Megaphone, title: "Get more customers", sub: "Websites, Google & Meta ads" },
];

export function ContactHost() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");
  const [phone, setPhone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.__ctContact = true;
    const onOpen = (e: Event) => {
      const src = (e as CustomEvent<string>).detail || "contact button";
      setSource(src);
      setPhone(canText());
      setOpen(true);
      track("contact_open", { source: src });
    };
    window.addEventListener("ct:contact", onOpen);
    return () => {
      window.__ctContact = false;
      window.removeEventListener("ct:contact", onOpen);
    };
  }, []);

  const pick = (id: string) => {
    track("contact_choice", { source, choice: id });
    setOpen(false);
    // Let the chooser close before the next sheet opens (two sheets at once fight over focus).
    window.setTimeout(() => {
      if (id === "repair" && !openTechQuiz(`contact: ${source}`)) navigate(IT_SERVICES_PATH);
      if (id === "office") navigate(`${OFFICE_SETUP_PATH}#book`);
      if (id === "grow") {
        if (!(phone && openTextQuiz({ source: `contact: ${source}` }))) navigate("/grow");
      }
    }, 250);
  };

  const body: ReactNode = (
    <div className="grid gap-2.5">
      {CHOICES.map((c) => (
        <button key={c.id} type="button" onClick={() => pick(c.id)} className="flex min-h-[72px] w-full items-center gap-3.5 rounded-2xl border-2 border-border bg-card px-4 py-3 text-left transition-[border-color,transform] duration-150 hover:border-turbo/60 active:scale-[0.98]">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-turbo/10 text-turbo">
            <c.icon className="h-6 w-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[17px] font-bold leading-snug">{c.title}</span>
            <span className="block text-sm text-muted-foreground">{c.sub}</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      ))}
      <p className="mt-2 text-center text-sm font-semibold text-muted-foreground">Rather talk to a person?</p>
      <div className="grid auto-cols-fr grid-flow-col gap-2">
        <CallLink location={`contact chooser (${source})`} className="btn-blue !py-3.5 !text-base">
          <Phone className="h-4 w-4" aria-hidden /> Call
        </CallLink>
        {canText() && (
          <a href={smsHref(QUICK_TECH_TEXT)} data-call-location={`contact chooser text (${source})`} className="btn-chrome !py-3.5 !text-base">
            <MessageSquare className="h-4 w-4" aria-hidden /> Text
          </a>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {SITE.phone.display} · You talk to Chris, not a call center
      </p>
    </div>
  );

  if (!source) return null;
  return phone ? (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false} repositionInputs={false}>
      <DrawerContent className="theme-soft max-h-[94dvh] rounded-t-3xl">
        <DrawerClose className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground" aria-label="Close">
          <X className="h-5 w-5" aria-hidden />
        </DrawerClose>
        <div className="pb-safe overflow-y-auto px-4 pb-6 pt-3">
          <DrawerTitle className="pr-12 font-display text-2xl font-bold">How can we help?</DrawerTitle>
          <DrawerDescription className="mb-4 mt-1 text-sm text-muted-foreground">Pick one. It takes under a minute.</DrawerDescription>
          {body}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="theme-soft max-w-md rounded-3xl border-border p-6">
        <DialogTitle className="font-display text-2xl font-bold">How can we help?</DialogTitle>
        <DialogDescription className="mb-2 text-sm text-muted-foreground">Pick one and we'll take it from there.</DialogDescription>
        {body}
      </DialogContent>
    </Dialog>
  );
}

/** The "Contact us" button: opens the chooser, or goes to /contact before JS loads. */
export function ContactButton({ source, className, children = "Contact us" }: { source: string; className?: string; children?: ReactNode }) {
  return (
    <a
      href="/contact"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (openContact(source)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
