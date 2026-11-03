import { MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { INSTALL_BOOKING, SITE, type CalEvent } from "@/config/site";
import { InstallCalEmbed } from "@/components/booking/InstallCalEmbed";
import { cn } from "@/lib/utils";

const SERVICE_TITLES: Record<string, { title: string; sms: string }> = {
  "home-office-setup": {
    title: "Book your home office setup",
    sms: "Hi, I'd like a quote for home office setup.",
  },
  "apartment-home-office-setup": {
    title: "Book your apartment office setup",
    sms: "Hi, I'd like a quote for apartment home office setup.",
  },
  "office-transformation": {
    title: "Book your office build-out consultation",
    sms: "Hi, I'd like a quote for an office build-out.",
  },
  "school-computer-room-setup": {
    title: "Book your school computer lab setup",
    sms: "Hi, I'd like a quote for a school computer room setup.",
  },
  "dj-studio-setup": {
    title: "Book your DJ or studio desk setup",
    sms: "Hi, I'd like a quote for DJ studio setup.",
  },
  "computer-build-setup": {
    title: "Book your custom PC build & setup",
    sms: "Hi, I'd like a quote for a custom computer build.",
  },
  "it-services": {
    title: "Book your tech visit",
    sms: "Hi, I need tech help. Device and problem: ",
  },
  "pos-system-setup": {
    title: "Book your POS system installation",
    sms: "Hi, I'd like a quote for POS system installation.",
  },
};

export function OfficeIntake({
  id = "quote",
  service = "home-office-setup",
  className,
  booking = INSTALL_BOOKING,
}: {
  id?: string;
  service?: string;
  className?: string;
  booking?: CalEvent;
}) {
  const info = SERVICE_TITLES[service] ?? {
    title: "Book your setup & installation",
    sms: "Hi, I'd like a quote for tech setup and installation.",
  };

  return (
    <div
      id={id}
      className={cn(
        "panel relative scroll-mt-24 overflow-hidden border border-border/80 bg-card/90 p-4 shadow-2xl backdrop-blur sm:p-6",
        className
      )}
      aria-label={info.title}
    >
      {/* Header with badge */}
      <div className="border-b border-border/60 pb-4">
        <span className="chip text-[11px] font-semibold text-turbo">
          Direct Booking · Fast Response
        </span>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {info.title}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Pick a date and time on the calendar, or call / text for immediate same-day scheduling.
        </p>
      </div>

      {/* Direct Quick Action Buttons (Call & Text) */}
      <div className="my-4 grid grid-cols-2 gap-2 sm:gap-3">
        <a
          href={SITE.phone.href}
          data-call-location={`${service}-embed-call`}
          className="btn-chrome flex items-center justify-center gap-2 !py-2.5 !px-3 text-xs font-semibold sm:text-sm"
        >
          <Phone className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
          <span className="truncate">Call {SITE.phone.display}</span>
        </a>
        <a
          href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent(info.sms)}`}
          data-call-location={`${service}-embed-sms`}
          className="btn-chrome flex items-center justify-center gap-2 !py-2.5 !px-3 text-xs font-semibold sm:text-sm"
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
          <span className="truncate">Text for quote</span>
        </a>
      </div>

      {/* Direct Bulletproof Cal.com Embed */}
      <InstallCalEmbed note={`${service}-inline`} minHeight="580px" booking={booking} />

      {/* Assurance footer & direct link */}
      <div className="mt-3 flex flex-col items-center justify-between gap-2 pt-1 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-turbo" aria-hidden />
          <span>Flat-rate labor confirmed before start</span>
        </div>
        <p className="text-[11px]">
          Calendar taking a second?{" "}
          <a
            href={booking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-turbo underline underline-offset-2 hover:text-white"
          >
            Direct booking page →
          </a>
        </p>
      </div>
    </div>
  );
}
