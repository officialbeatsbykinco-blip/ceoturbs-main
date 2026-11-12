// One rule for the ad landing pages: computers book on the Cal.com calendar, phones answer a few tap
// questions and send them as a text. Desktop is the safe first render because the paid ad audience is
// being sent to the page on computers; supported phones switch to the question flow after hydration.
import { useEffect, useState, type ReactNode } from "react";
import { Calendar } from "lucide-react";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import type { CalEvent } from "@/config/site";
import { canText } from "@/lib/sms";
import { cn } from "@/lib/utils";

/** True once mounted on a phone or tablet that can open Messages. Desktop/Cal is the SSR-safe default. */
export function useTexting() {
  const [texting, setTexting] = useState(false);
  useEffect(() => setTexting(canText()), []);
  return texting;
}

export function BookOrText({ phone, desktop }: { phone: ReactNode; desktop: ReactNode }) {
  return <>{useTexting() ? phone : desktop}</>;
}

/** The desktop booking card: the Cal.com calendar inline, no clicks in between. */
export function CalCard({ id = "fix", title, sub, note, booking, className }: { id?: string; title: string; sub?: string; note: string; booking: CalEvent; className?: string }) {
  return (
    <div id={id} className={cn("scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7", className)}>
      <p className="flex items-center gap-2 font-display text-2xl font-bold leading-tight">
        <Calendar className="h-6 w-6 shrink-0 text-turbo" aria-hidden /> {title}
      </p>
      {sub && <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>}
      <InstallCalEmbed className="mt-4" note={note} booking={booking} minHeight="560px" />
    </div>
  );
}

/**
 * Text links only make sense on a phone. Computers get `desktop` instead (a Call link or a booking button),
 * so no desktop visitor is ever left with an sms: link that opens nothing. Desktop is the SSR default.
 */
export function PhoneOnly({ children, desktop = null }: { children: ReactNode; desktop?: ReactNode }) {
  return <BookOrText phone={children} desktop={desktop} />;
}
