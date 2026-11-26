// A big tap-to-call card high on every repair page: one large orange button with the number on it, a short urgent
// headline and three plain trust lines. Sized for older visitors (big text, full-width button on phones).
import { BadgeCheck, Phone } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

export function CallNowCard({ where, headline, className }: { where: string; headline: string; className?: string }) {
  return (
    <div className={cn("rounded-3xl border-2 border-turbo/40 bg-turbo/[0.06] p-4 sm:p-5", className)}>
      <p className="font-display text-lg font-bold leading-snug sm:text-xl">{headline}</p>
      <a
        href={SITE.phone.href}
        data-call-location={`${where} call card`}
        className="btn-ignite btn-shine mt-3 flex w-full items-center justify-center gap-2.5 whitespace-nowrap !py-5 !text-xl font-bold sm:!text-2xl"
      >
        <Phone className="h-6 w-6 shrink-0" aria-hidden />
        <span>
          <span className="sm:hidden">Tap to call </span>
          <span className="hidden sm:inline">Call </span>
          {SITE.phone.display}
        </span>
      </a>
      <ul className="mt-3 grid gap-1.5 text-[15px] sm:grid-cols-3 sm:gap-3 sm:text-sm">
        {["You talk to the tech, not a call center", "Price on the phone, before any work", "We come to your home or work"].map((t) => (
          <li key={t} className="flex items-start gap-1.5">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
