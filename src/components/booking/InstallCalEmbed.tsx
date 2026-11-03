import { useEffect, useId, useState } from "react";
import { ExternalLink, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { INSTALL_BOOKING, SITE, type CalEvent } from "@/config/site";
import { mountInstallBooking } from "@/lib/cal";
import { track } from "@/lib/track";

export function InstallCalEmbed({
  className = "",
  minHeight = "560px",
  note = "install-embed",
  booking = INSTALL_BOOKING,
}: {
  className?: string;
  minHeight?: string;
  note?: string;
  booking?: CalEvent;
}) {
  const uid = useId().replace(/:/g, "");
  const calId = `install-cal-${uid}`;
  const [calReady, setCalReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    track("booking_open", { source: `${note} — native cal embed` });
    let active = true;

    mountInstallBooking(calId, note, uid, booking).then((r) => {
      if (!active) return;
      setCalReady(true);
      setShowFallback(r !== "ready");
    });

    // Ad blockers or slow networks: stop blocking the view and surface text/open-in-tab shortcuts.
    const timer = setTimeout(() => {
      if (!active) return;
      setCalReady(true);
    }, 2500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [note, calId, uid, booking]);

  return (
    <div className={`relative flex min-h-[460px] w-full flex-col overflow-hidden rounded-xl border border-border/80 bg-black/40 ${className}`}>
      {!calReady && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/95 p-6 text-center backdrop-blur-md"
          style={{ minHeight }}
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-turbo/15 text-turbo shadow-[0_0_24px_rgba(0,207,255,0.25)]">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">Loading setup calendar…</p>
            <p className="mt-1 text-xs text-muted-foreground">Pick a date and time for your setup</p>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-turbo" aria-hidden />
            <span>Flat-rate pricing confirmed upfront</span>
          </div>
        </div>
      )}

      {/* color-scheme: dark matches Cal's dark theme, so the iframe is transparent instead of painting a white box around the calendar. */}
      <div className="relative min-h-0 w-full flex-1 overflow-y-auto" style={{ colorScheme: "dark" }}>
        <div id={calId} style={{ width: "100%", colorScheme: "dark" }} />
      </div>

      {showFallback && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-card/90 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Calendar loading slow on your device?</span>
          <div className="flex items-center gap-3">
            <a
              href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent("Hi! I'd like a quote and to schedule a setup.")}`}
              className="inline-flex min-h-10 items-center gap-1 font-semibold text-turbo hover:underline"
            >
              <MessageSquare className="h-3 w-3" aria-hidden />
              <span>Text us</span>
            </a>
            <span className="text-border" aria-hidden>•</span>
            <a
              href={booking.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1 font-semibold text-turbo underline underline-offset-2 hover:text-white"
            >
              <span>Open in new tab</span>
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
