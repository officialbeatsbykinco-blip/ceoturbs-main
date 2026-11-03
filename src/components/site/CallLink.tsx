import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * A tap-to-call link. Clicks are counted as a phone lead (Meta "Contact", GA4 click_to_call…) by the
 * delegated listener in src/lib/track.ts; `location` says which link it was.
 */
export function CallLink({ location, icon = false, className, children }: { location: string; icon?: boolean; className?: string; children?: ReactNode }) {
  return (
    <a href={SITE.phone.href} data-call-location={location} className={cn("whitespace-nowrap", icon && "inline-flex items-center gap-1.5", className)}>
      {icon && <Phone className="h-4 w-4 shrink-0" aria-hidden />}
      {children ?? SITE.phone.display}
    </a>
  );
}
