// The Cal.com calendar embedded right on the page (Cal's official inline embed), so booking never
// sends the visitor off to another site. A link to the booking page only appears if the calendar fails.
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BOOKING } from "@/config/site";
import { bookingPageUrl, mountInlineBooking, onLinkStatus, type Prefill } from "@/lib/cal";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Status = "loading" | "ready" | "slow" | "failed";

export function InlineBooking({ ns: baseNs = BOOKING.namespace, source, prefill, person, fields, meta, className }: Prefill & { ns?: string; className?: string }) {
  const calId = `cal-inline-${useId().replace(/:/g, "")}`;
  // Cal keeps one inline embed per namespace and ignores a second mount ("Inline embed already exists"), which left the
  // popup blank whenever the page already had its own calendar. One namespace per mounted calendar keeps each independent.
  const ns = `${baseNs}-${calId}`;
  const [status, setStatus] = useState<Status>("loading");
  const pageUrl = bookingPageUrl(prefill, person, fields, { source: `${source ?? "site"} — direct page`, meta });
  const directClick = () => track("booking_open", { source: `${source ?? "site"} — direct page` });
  const box = useRef<HTMLDivElement>(null);
  // The calendar is a whole app in an iframe, so it only starts loading as the visitor nears it.
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return setNear(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let live = true;
    // Cal.com shows its own loader inside the box; a late "ready" still clears the slow/failed fallback.
    const off = onLinkStatus(ns, (s) => live && setStatus(s));
    mountInlineBooking(calId, source, prefill, { ns, person, fields, meta }).then((r) => live && setStatus((c) => (c === "ready" ? "ready" : r === "timeout" ? "slow" : r)));
    return () => {
      live = false;
      off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calId, ns, near]);

  return (
    <div ref={box} className={className}>
      {/* Only reserve height while loading: Cal.com sizes its iframe to the calendar, so a fixed min-height left an empty block under it. */}
      <div className={cn("relative overflow-hidden rounded-2xl ring-1 ring-white/5", status === "ready" ? "bg-transparent" : "min-h-[520px] bg-black/20")}>
        {status === "failed" && (
          <div className="absolute inset-0 z-10 grid place-items-center p-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Tap below to pick your time on our booking page.</p>
              <a href={pageUrl} onClick={directClick} className="btn-ignite mt-4">
                Pick my call time <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        )}
        <div id={calId} data-cal-inline className={cn("relative w-full overflow-auto", status !== "ready" && "min-h-[520px]")} />
      </div>
      {status === "slow" && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Calendar not showing?{" "}
          <a href={pageUrl} onClick={directClick} className="inline-flex min-h-[44px] items-center font-semibold text-turbo underline underline-offset-2">
            Open the booking page
          </a>
        </p>
      )}
    </div>
  );
}
