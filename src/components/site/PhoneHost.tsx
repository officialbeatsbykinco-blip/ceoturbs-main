// Always mounted (in Layout). Computers can't place a call or send a text, so a tel: or sms: link would do
// nothing there. This catches those clicks and shows the number, a copy button and a code to scan instead.
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";
import { SITE } from "@/config/site";
import { canText } from "@/lib/sms";

export function PhoneHost() {
  const [href, setHref] = useState("");
  const [copied, setCopied] = useState(false);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const texting = href.startsWith("sms:");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || canText()) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="sms:"]');
      // Dialogs that already explain themselves keep their own links.
      if (!a || a.closest('[role="dialog"]')) return;
      e.preventDefault();
      setCopied(false);
      setHref(a.getAttribute("href") ?? "");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const drawCode = (el: HTMLCanvasElement | null) => {
    canvas.current = el;
    if (!el || !href) return;
    void import("qrcode-generator").then(({ default: qrcode }) => {
      const ctx = el.getContext("2d");
      if (!ctx) return;
      const qr = qrcode(0, "M");
      qr.addData(href);
      qr.make();
      const n = qr.getModuleCount();
      const cell = el.width / (n + 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, el.width, el.height);
      ctx.fillStyle = "#0c1017";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(Math.floor((c + 3) * cell), Math.floor((r + 3) * cell), Math.ceil(cell), Math.ceil(cell));
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.phone.display);
      setCopied(true);
    } catch {
      /* clipboard blocked: the number is on screen */
    }
  };

  return (
    <Dialog.Root open={!!href} onOpenChange={(open) => !open && setHref("")}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="theme-soft fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-center text-foreground shadow-2xl">
          <Dialog.Close className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <Dialog.Title className="font-display text-xl font-bold">{texting ? "Text us from your phone" : "Call us from your phone"}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">Scan this with your phone camera, or dial the number.</Dialog.Description>
          <canvas ref={drawCode} width={320} height={320} className="mx-auto mt-4 h-40 w-40 rounded-xl bg-white" role="img" aria-label={`Code to ${texting ? "text" : "call"} ${SITE.phone.display}`} />
          <p className="mt-4 font-display text-2xl font-bold">{SITE.phone.display}</p>
          <button type="button" onClick={copy} className="btn-chrome mt-3 inline-flex w-full items-center justify-center gap-1.5">
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy number"}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
