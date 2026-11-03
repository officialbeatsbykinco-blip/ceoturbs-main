import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, Download, ExternalLink, Mail, MapPin, Search, X } from "lucide-react";
import { checkReviewLink, googleMapsUrl, googleSearchUrl, recallBusiness, rememberBusiness, type LinkCheck } from "@/lib/review-link";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/** Draws a crisp, print-ready QR code for the review link (generated in the browser — nothing is uploaded). */
export function QrCode({ value, label }: { value: string; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [png, setPng] = useState("");

  useEffect(() => {
    let cancelled = false;
    import("qrcode-generator").then(({ default: qrcode }) => {
      if (cancelled || !canvas.current) return;
      const qr = qrcode(0, "M");
      qr.addData(value);
      qr.make();
      const n = qr.getModuleCount();
      const quiet = 4;
      const size = 1024;
      const cell = size / (n + quiet * 2);
      const c = canvas.current;
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) ctx.fillRect(Math.floor((col + quiet) * cell), Math.floor((r + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
      setPng(c.toDataURL("image/png"));
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <canvas ref={canvas} className="h-36 w-36 shrink-0 rounded-xl bg-white" role="img" aria-label={`QR code for ${label}`} />
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold">Your review QR code</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Print it as a sticker for the card, table or counter, so anyone who'd rather scan can scan. It also works on receipts and invoices.</p>
        {png && (
          <a href={png} download="google-review-qr.png" className="choice mt-3 !py-2">
            <Download className="h-3.5 w-3.5" aria-hidden /> Download PNG
          </a>
        )}
      </div>
    </div>
  );
}

/** Finds and checks the link. With onValid the setup guide takes it from there; alone it also shows the copy buttons and QR. */
export function ReviewLinkTool({ initialLink = "", onValid }: { initialLink?: string; onValid?: (url: string) => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [link, setLink] = useState(initialLink);
  const [copied, setCopied] = useState<string | null>(null);
  const uid = useId();

  useEffect(() => setName((n) => n || recallBusiness()), []);

  const result: LinkCheck | null = link.trim() ? checkReviewLink(link) : null;
  const good = result?.ok ? result.url : null;
  const bare = good?.replace(/^https:\/\//, "");

  useEffect(() => {
    if (!good) return;
    track("review_link_valid");
    onValid?.(good);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [good]);

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
    <div className="audit-card rounded-3xl p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-turbo">Review link finder</p>

      <div className="mt-4">
        <p className="font-semibold">1. Find your Business Profile</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
          <div>
            <label htmlFor={`${uid}-n`} className="mb-1.5 block text-xs font-medium text-chrome">
              Business name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input id={`${uid}-n`} className="field pl-10" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => rememberBusiness(name)} placeholder="Exactly as it shows on Google" maxLength={100} autoComplete="organization" />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-c`} className="mb-1.5 block text-xs font-medium text-chrome">
              City
            </label>
            <input id={`${uid}-c`} className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Atlanta, GA" maxLength={60} autoComplete="address-level2" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={googleSearchUrl(name.trim() || "my business", city)} target="_blank" rel="noopener noreferrer" className={cn("btn-chrome !py-3 !text-sm", !name.trim() && "opacity-80")}>
            <Search className="h-4 w-4" aria-hidden /> Open on Google Search
          </a>
          <a href={googleMapsUrl(name.trim() || "my business", city)} target="_blank" rel="noopener noreferrer" className="btn-chrome !py-3 !text-sm">
            <MapPin className="h-4 w-4" aria-hidden /> Open in Google Maps
          </a>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Be signed in to the Google account that manages the business. Then click <span className="text-foreground">Ask for reviews</span> (or <span className="text-foreground">Read reviews → Get more reviews</span>) and copy the link.</p>
      </div>

      <div className="mt-7 border-t border-border pt-6">
        <label htmlFor={`${uid}-l`} className="font-semibold">
          2. Paste your review link to check it
        </label>
        <input id={`${uid}-l`} className="field mt-3 font-mono !text-sm" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://g.page/r/…/review" inputMode="url" autoComplete="off" spellCheck={false} />
        {result && (
          <div className={cn("mt-3 flex items-start gap-2 rounded-xl p-3 text-sm animate-step", result.ok ? "bg-emerald-400/10 text-emerald-200" : result.kind === "fixable" ? "bg-[hsl(var(--ignite)/0.1)] text-[hsl(var(--ignite-hot))]" : "bg-[#ff6b6b]/10 text-[#ff9a9a]")} role="status">
            {result.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : result.kind === "fixable" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            <span>
              {result.message}
              {!result.ok && result.kind === "fixable" && result.url && (
                <button type="button" onClick={() => setLink(result.url!)} className="ml-2 font-semibold underline underline-offset-2">
                  Fix it for me
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      {good && !onValid && (
        <div className="mt-6 space-y-5 border-t border-border pt-6 animate-step">
          <div>
            <p className="font-semibold">3. Write this link to your card</p>
            <div className="mt-3 rounded-xl bg-black/40 p-3 font-mono text-sm text-foreground/90 ring-1 ring-white/5 [overflow-wrap:anywhere]">{good}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => copy(good, "full")} className="choice !py-2">
                {copied === "full" ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} {copied === "full" ? "Copied" : "Copy full link"}
              </button>
              <button type="button" onClick={() => copy(bare!, "bare")} className="choice !py-2">
                {copied === "bare" ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} {copied === "bare" ? "Copied" : "Copy without https://"}
              </button>
              <a href={good} target="_blank" rel="noopener noreferrer" className="choice !py-2">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Test link
              </a>
              <a href={`mailto:?subject=${encodeURIComponent("My Google review link")}&body=${encodeURIComponent(`Review link for my NFC card:\n${good}\n\nSetup guide: https://www.ceoturbo.com/google-review-card-setup`)}`} className="choice !py-2">
                <Mail className="h-3.5 w-3.5" aria-hidden /> Email it to my phone
              </a>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">On a computer? Email the link to yourself, or scan the QR below with your phone and copy it from the browser.</p>
          </div>
          <QrCode value={good} label={name || "your business"} />
        </div>
      )}
    </div>
  );
}
