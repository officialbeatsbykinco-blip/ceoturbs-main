import * as Dialog from "@radix-ui/react-dialog";
import { X, Calendar as CalendarIcon, Phone, MessageSquare } from "lucide-react";
import { SITE, INSTALL_BOOKING, type CalEvent } from "@/config/site";
import { InstallCalEmbed } from "./InstallCalEmbed";

export function InstallCalModal({
  open,
  onOpenChange,
  note = "service-page",
  booking = INSTALL_BOOKING,
  title = "Book Your Setup & Installation Date",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: string;
  booking?: CalEvent;
  title?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[92vh] w-[95vw] max-w-[820px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-2xl border border-border bg-card shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-turbo/15 text-turbo">
                <CalendarIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <Dialog.Title className="text-base font-bold text-foreground sm:text-lg">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground sm:text-sm">
                  Pick a day and time that works for you. Flat-rate labor confirmed before we start.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Calendar Embed Body */}
          <div className="relative flex-1 overflow-y-auto p-2 sm:p-3 bg-black/40">
            <InstallCalEmbed note={note} booking={booking} className="h-full border-0" />
          </div>

          {/* Direct Assistance Bar */}
          <div className="border-t border-border/80 bg-background/95 px-5 py-3 text-xs text-muted-foreground sm:flex sm:items-center sm:justify-between shrink-0">
            <span className="hidden sm:inline">Need an immediate answer or same-day quote?</span>
            <div className="flex items-center justify-center gap-4">
              <a
                href={SITE.phone.href}
                className="inline-flex items-center gap-1.5 font-semibold text-turbo hover:underline"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                <span>Call {SITE.phone.display}</span>
              </a>
              <span className="text-border" aria-hidden>•</span>
              <a
                href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent("Hi! I'd like a quote for office setup.")}`}
                className="inline-flex items-center gap-1.5 font-semibold text-turbo hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                <span>Text for quote</span>
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
