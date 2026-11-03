import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, MessageSquare, Phone, QrCode as QrIcon, ShieldCheck, X } from "lucide-react";
import { SITE } from "@/config/site";
import { track } from "@/lib/track";

export function TextQuoteModal({
  open,
  onOpenChange,
  service = "tech setup",
  smsText = "Hi, I'd like a quote for tech setup and installation.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: string;
  smsText?: string;
}) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smsUrl = `sms:${SITE.phone.e164}?&body=${encodeURIComponent(smsText)}`;

  // Generate QR code whenever dialog opens or smsText changes
  useEffect(() => {
    if (!open) return;
    track("sms_modal_open", { service });

    let active = true;
    import("qrcode-generator").then(({ default: qrcode }) => {
      if (!active || !canvasRef.current) return;
      try {
        const qr = qrcode(0, "M");
        qr.addData(smsUrl);
        qr.make();
        const n = qr.getModuleCount();
        const quiet = 3;
        const size = 320;
        const cell = size / (n + quiet * 2);
        const canvas = canvasRef.current;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#0c1017";
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(
                Math.floor((c + quiet) * cell),
                Math.floor((r + quiet) * cell),
                Math.ceil(cell),
                Math.ceil(cell)
              );
            }
          }
        }
      } catch (err) {
        console.error("QR generation failed", err);
      }
    });

    return () => {
      active = false;
    };
  }, [open, service, smsUrl]);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText("678-558-4327");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      track("sms_copy_number", { service });
    } catch {
      // clipboard unavailable; the number is shown on screen anyway
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex w-[94vw] max-w-[540px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-turbo/15 text-turbo">
                <MessageSquare className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <Dialog.Title className="text-lg font-bold text-foreground sm:text-xl">
                  Text for an Instant Quote
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground sm:text-sm">
                  Average response: under 15 minutes · Real technician
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Body Content */}
          <div className="mt-5 space-y-5">
            {/* Phone Number Bar with 1-click Copy */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-black/40 p-3.5 sm:px-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Text or Call Us
                </span>
                <p className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {SITE.phone.display}
                </p>
              </div>
              <button
                type="button"
                onClick={copyNumber}
                className="btn-chrome flex items-center gap-1.5 !py-2 !px-3 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-turbo" aria-hidden />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Code Scan Area for Desktop Users */}
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-white/[0.02] p-4 text-center sm:flex-row sm:text-left">
              <div className="relative shrink-0 overflow-hidden rounded-xl border border-border/80 bg-white p-2 shadow-lg">
                <canvas
                  ref={canvasRef}
                  className="h-32 w-32 sm:h-28 sm:w-28"
                  role="img"
                  aria-label="QR Code to text CEO Turbo"
                />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-turbo/10 px-2.5 py-0.5 text-[11px] font-semibold text-turbo">
                  <QrIcon className="h-3 w-3" aria-hidden />
                  <span>Scan with phone camera</span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-foreground sm:text-sm">
                  Point your phone's camera at the QR code to open your SMS app with your pre-filled inquiry.
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  No app download needed — works with iPhone & Android camera.
                </p>
              </div>
            </div>

            {/* Pre-filled Message Preview */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <span className="text-[11px] font-medium text-muted-foreground">Pre-filled Message:</span>
              <p className="mt-1 text-xs italic text-foreground/90">"{smsText}"</p>
            </div>

            {/* Direct Open Link on Computer */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={smsUrl}
                className="btn-ignite flex flex-1 items-center justify-center gap-2 text-sm font-semibold shadow-lg"
              >
                <MessageSquare className="h-4 w-4" aria-hidden />
                <span>Launch Messages App</span>
              </a>
              <a
                href={SITE.phone.href}
                className="btn-chrome flex flex-1 items-center justify-center gap-2 text-sm font-semibold"
              >
                <Phone className="h-4 w-4 text-turbo" aria-hidden />
                <span>Call {SITE.phone.display}</span>
              </a>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-turbo" aria-hidden />
              <span>No spam. Flat pricing confirmed in writing before work begins.</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
