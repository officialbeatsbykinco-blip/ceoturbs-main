import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Copy, Laptop, Loader2, MessageSquare, MessageSquareQuote, PackageCheck, Play, Smartphone, Wand2, X } from "lucide-react";
import { Breadcrumbs, FAQList } from "@/components/blocks/Basics";
import { CardUpsell } from "@/components/blocks/CardUpsell";
import { QrCode, ReviewLinkTool } from "@/components/shop/ReviewLinkTool";
import { NFC_APP } from "@/config/site";
import { RULES, SETUP_FAQS, SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { CARD_TEXT, smsHref } from "@/lib/sms";
import { track } from "@/lib/track";
import { canWriteNfc, writeCard } from "@/lib/web-nfc";
import { cn } from "@/lib/utils";

const STEPS = ["start", "link", "write", "use"] as const;
type Step = (typeof STEPS)[number];

const STORE = "ct_setup_v1";
const LINK_STORE = "ct_review_link";

const remember = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the guide still works, it just won't resume */
  }
};
const recall = (key: string) => {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
};

export default function ReviewCardSetup() {
  const [step, setStep] = useState<Step>("start");
  const [link, setLink] = useState("");
  const [nfc, setNfc] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  // Finding the link means leaving for Google, so the guide picks up where it was.
  useEffect(() => {
    setNfc(canWriteNfc());
    setLink(recall(LINK_STORE));
    const saved = recall(STORE);
    if ((STEPS as readonly string[]).includes(saved)) setStep(saved as Step);
  }, []);

  const go = (next: Step) => {
    setStep(next);
    remember(STORE, next);
    track("card_setup_step", { step: next });
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const keepLink = (url: string) => {
    setLink(url);
    remember(LINK_STORE, url);
  };

  const shown = STEPS.indexOf(step);

  return (
    <>
      <section className="relative overflow-clip pt-20 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative max-w-[680px]">
          <Breadcrumbs items={[{ name: "Google review cards", path: SHOP_PATH }, { name: "Setup guide", path: SETUP_PATH }]} className="max-sm:hidden" />
          <h1 className="mt-2 text-[32px] font-bold leading-[1.05] sm:text-5xl">
            Set up your card <span className="text-turbo-grad">in 2 minutes.</span>
          </h1>
          <div ref={top} className="scroll-mt-20" />
          {shown > 0 && (
            <ol className="mt-5 grid grid-cols-3 gap-1.5" aria-label="Your progress">
              {["Get link", "Write card", "Test it"].map((label, i) => (
                <li key={label} className="text-xs font-semibold">
                  <span className={cn("mb-1.5 block h-1.5 rounded-full", i < shown ? "bg-turbo" : "bg-white/10")} />
                  <span className={i < shown ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <div className="container-x mt-6 max-w-[680px] pb-10">
        <Panel show={step === "start"} title="How did your card arrive?">
          <div className="grid gap-3">
            <button type="button" onClick={() => go("use")} className="panel flex items-center gap-4 p-5 text-left transition hover:ring-1 hover:ring-turbo/40">
              <PackageCheck className="h-7 w-7 shrink-0 text-turbo" aria-hidden />
              <span>
                <span className="block font-semibold">We programmed it for you</span>
                <span className="block text-sm text-muted-foreground">It's ready. Just test it.</span>
              </span>
            </button>
            <button type="button" onClick={() => go("link")} className="panel flex items-center gap-4 p-5 text-left transition hover:ring-1 hover:ring-turbo/40">
              <Wand2 className="h-7 w-7 shrink-0 text-turbo" aria-hidden />
              <span>
                <span className="block font-semibold">It's blank</span>
                <span className="block text-sm text-muted-foreground">Three quick steps from your phone.</span>
              </span>
            </button>
          </div>
        </Panel>

        <Panel show={step === "link"} title="Get your Google review link">
          <LinkSteps />
          <div className="mt-5">
            <ReviewLinkTool initialLink={link} onValid={keepLink} />
          </div>
          <NoProfile />
          <Nav onBack={() => go("start")} onNext={() => go("write")} nextLabel="Next: write the card" disabled={!link} />
        </Panel>

        <Panel show={step === "write"} title="Write it to your card">
          {nfc ? <AndroidWrite link={link} onDone={() => go("use")} /> : <AppWrite link={link} />}
          <Nav onBack={() => go("link")} onNext={() => go("use")} nextLabel="I wrote it. Test it" />
        </Panel>

        <Panel show={step === "use"} title="Test it, then put it to work">
          <ol className="steps">
            <li>Unlock your phone and hold it on the card. On iPhone use the top edge, then tap the banner. On Android use the middle of the back.</li>
            <li>Your review form should open. That's it. Don't post a review on your own business.</li>
            <li>If you can, try one more phone.</li>
          </ol>

          <p className="mt-6 font-semibold">Then just ask</p>
          <div className="mt-3 grid gap-3">
            {["Before I head out, could you tap this? It opens our Google review page. Takes ten seconds and really helps us.", "Thanks for coming in! Would you mind leaving us a quick Google review? Just tap your phone right here."].map((q) => (
              <blockquote key={q} className="panel flex gap-3 p-4 text-[15px] leading-relaxed">
                <MessageSquareQuote className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />“{q}”
              </blockquote>
            ))}
          </div>

          <p className="mt-6 font-semibold">Where to keep it</p>
          <ul className="mt-2 grid gap-1.5 text-[15px] text-foreground/85">
            <li><b>On the go:</b> your pocket, wallet, truck visor or tool bag.</li>
            <li><b>In a store:</b> on the table, counter or check folder. Keep it off metal, which blocks the tap.</li>
          </ul>

          <details className="mt-6 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <summary className="cursor-pointer font-semibold">Leaving it out? Print a QR sticker</summary>
            <p className="mt-2 text-sm text-muted-foreground">The card has no QR code. This free sticker lets people who'd rather scan do that.</p>
            {link ? (
              <div className="mt-4">
                <QrCode value={link} label="your business" />
              </div>
            ) : (
              <button type="button" onClick={() => go("link")} className="choice mt-3 !py-2">
                Add your review link first
              </button>
            )}
          </details>
          <details className="mt-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <summary className="cursor-pointer font-semibold">Lock the card (optional)</summary>
            <p className="mt-2 text-sm text-muted-foreground">Locking stops anyone rewriting a card you leave out, but it's permanent: you can never change the link again. Test first. In {NFC_APP.name}: Other → Lock tag → hold the card to your phone.</p>
          </details>
          <details className="mt-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <summary className="cursor-pointer font-semibold">Google's rules</summary>
            <ul className="mt-3 grid gap-2">
              {RULES.map((r) => (
                <li key={r.text} className="flex items-start gap-2.5 text-sm">
                  {r.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-label="Do" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6b6b]" aria-label="Don't" />}
                  {r.text}
                </li>
              ))}
            </ul>
          </details>
          <button type="button" onClick={() => go("start")} className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Start over
          </button>
        </Panel>
      </div>

      <FAQList faqs={SETUP_FAQS} title="Not working?" lede="Most fixes take a few seconds." />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow grid gap-6 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.4fr_auto] lg:items-center">
            <div>
              <h2 className="h-section">Stuck? Text us.</h2>
              <p className="lede">Send your business name and we'll get your card working.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href={smsHref(CARD_TEXT)} data-call-location="setup guide help" className="btn-ignite">
                <MessageSquare className="h-4 w-4" aria-hidden /> Text us for help
              </a>
              <Link to={SHOP_PATH} className="btn-chrome">
                Order more cards
              </Link>
            </div>
          </div>
        </div>
      </section>
      <CardUpsell where="Card setup guide" id="setup-more" />
    </>
  );
}

/** Steps stay in the page while hidden, so search engines and the prerender keep the whole guide. */
function Panel({ show, title, children }: { show: boolean; title: string; children: ReactNode }) {
  return (
    <section hidden={!show} className="panel p-5 sm:p-8">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className="mt-4 leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

function Nav({ onBack, onNext, nextLabel, disabled }: { onBack: () => void; onNext: () => void; nextLabel: string; disabled?: boolean }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <button type="button" onClick={onBack} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back
      </button>
      <button type="button" onClick={onNext} disabled={disabled} className={cn("btn-ignite !px-5 !py-3 !text-sm", disabled && "cursor-not-allowed opacity-50")}>
        {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function LinkSteps() {
  const [where, setWhere] = useState<"phone" | "computer">("phone");
  return (
    <>
      <p>This is the link that opens your review form. Google gives one to every verified Business Profile.</p>
      <div role="tablist" aria-label="Where are you?" className="mt-4 inline-grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.04] p-1">
        {(
          [
            ["phone", "On my phone", Smartphone],
            ["computer", "On a computer", Laptop],
          ] as const
        ).map(([k, l, Icon]) => (
          <button key={k} type="button" role="tab" aria-selected={where === k} onClick={() => setWhere(k)} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all", where === k ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Icon className="h-4 w-4" aria-hidden /> {l}
          </button>
        ))}
      </div>
      {where === "phone" ? (
        <ol className="steps mt-4" role="tabpanel">
          <li>Open Google Maps, signed in to your business account.</li>
          <li>Tap your picture → <b>Your Business Profile</b>.</li>
          <li>Tap <b>Ask for reviews</b>, then <b>Copy link</b>. Come back here and paste it.</li>
        </ol>
      ) : (
        <ol className="steps mt-4" role="tabpanel">
          <li>Sign in to Google and search your business name.</li>
          <li>In your profile panel, click <b>Ask for reviews</b> (or <b>Read reviews</b> → <b>Get more reviews</b>).</li>
          <li>Click <b>Copy link</b> and paste it below.</li>
        </ol>
      )}
    </>
  );
}

function NoProfile() {
  return (
    <p className="mt-4 text-sm text-muted-foreground">
      Can't find it, or no Google profile yet?{" "}
      <a href={smsHref(CARD_TEXT)} data-call-location="setup no profile" className="font-semibold text-turbo underline-offset-2 hover:underline">
        Text us your business name
      </a>{" "}
      and we'll help.
    </p>
  );
}

/** Chrome on Android: one button, no app. A failed write sends them to the app steps. */
function AndroidWrite({ link, onDone }: { link: string; onDone: () => void }) {
  const [state, setState] = useState<"idle" | "waiting" | "error">("idle");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  const write = async () => {
    abort.current?.abort();
    abort.current = new AbortController();
    setState("waiting");
    try {
      await writeCard(link, abort.current.signal);
      track("card_written", { method: "web_nfc" });
      onDone();
    } catch {
      setState("error");
    }
  };

  if (state === "error") return (
    <>
      <p className="rounded-xl bg-[hsl(var(--ignite)/0.08)] p-3 text-sm text-[hsl(var(--ignite-hot))]">That didn't write. Check NFC is on and try again, or use the app below.</p>
      <button type="button" onClick={write} className="btn-chrome mt-3 w-full">Try again</button>
      <div className="mt-6">
        <AppWrite link={link} />
      </div>
    </>
  );
  return (
    <>
      <p>Press the button, then hold the card flat against the middle of the back of your phone until it finishes.</p>
      <button type="button" onClick={write} disabled={state === "waiting"} className="btn-ignite btn-shine mt-4 w-full !py-4 !text-base">
        {state === "waiting" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Hold your card to your phone…</> : "Write to my card"}
      </button>
    </>
  );
}

/** iPhone and everything else: the free app, with the link ready to paste. */
function AppWrite({ link }: { link: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const bare = link.replace(/^https:\/\//, "");
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };
  return (
    <>
      <p>Use the free {NFC_APP.name} app. You only need it once, and your customers never do.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={NFC_APP.ios} target="_blank" rel="noopener noreferrer" className="store-btn">
          <Smartphone className="h-6 w-6" aria-hidden />
          <span>
            <span className="block text-[10px] leading-none text-muted-foreground">Download on the</span>
            <span className="block text-base font-semibold leading-tight">App Store</span>
          </span>
        </a>
        <a href={NFC_APP.android} target="_blank" rel="noopener noreferrer" className="store-btn">
          <Play className="h-6 w-6" aria-hidden />
          <span>
            <span className="block text-[10px] leading-none text-muted-foreground">Get it on</span>
            <span className="block text-base font-semibold leading-tight">Google Play</span>
          </span>
        </a>
      </div>
      {link && (
        <button type="button" onClick={() => copy(link, "full")} className="btn-chrome mt-4 w-full">
          {copied === "full" ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied === "full" ? "Copied" : "Copy my review link"}
        </button>
      )}
      <ol className="steps mt-4">
        <li>In the app tap <b>Write</b> → <b>Add a record</b> → <b>URL / URI</b>.</li>
        <li>
          Paste your link and tap <b>OK</b>. If the box already shows https:// in front,{" "}
          {link ? (
            <button type="button" onClick={() => copy(bare, "bare")} className="font-semibold text-turbo underline underline-offset-2">
              {copied === "bare" ? "copied" : "paste this version instead"}
            </button>
          ) : (
            "leave that part out"
          )}
          .
        </li>
        <li>Tap <b>Write</b> and hold the card still against your phone until it says <b>Write complete</b>. iPhone: top edge. Android: middle of the back.</li>
      </ol>
    </>
  );
}
