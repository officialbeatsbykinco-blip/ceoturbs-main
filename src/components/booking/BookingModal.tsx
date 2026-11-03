// "Book a call" without the quiz (skipped quiz, audit report): our own dialog with the inline Cal.com
// calendar inside, instead of Cal's pop-up or a trip to cal.com. Loaded by BookingModalHost on first use.
import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { BOOKING, SITE } from "@/config/site";
import type { BookingRequest } from "@/lib/cal";
import { InlineBooking } from "./InlineBooking";

export default function BookingModal({ open, setOpen, request, nonce }: { open: boolean; setOpen: (o: boolean) => void; request: BookingRequest; nonce: number }) {
  const [booked, setBooked] = useState(false);
  useEffect(() => setBooked(false), [nonce]);
  useEffect(() => {
    const onBooked = () => setBooked(true);
    window.addEventListener("ct:booked", onBooked);
    return () => window.removeEventListener("ct:booked", onBooked);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="audit-card max-h-[100dvh] max-w-3xl content-start overflow-y-auto border-0 p-4 max-sm:h-[100dvh] max-sm:max-w-none max-sm:rounded-none sm:max-h-[94vh] sm:rounded-3xl sm:p-6">
        <DialogTitle className="pr-8 font-display text-xl font-bold sm:text-2xl">{booked ? "You're booked!" : "Pick a time for your free call"}</DialogTitle>
        <DialogDescription className="-mt-2 text-sm text-muted-foreground">
          {booked ? "Check your email for the calendar invite." : `Free · ${BOOKING.length} · ${SITE.founder.name} walks through your website, Google profile, reviews and ads with you, live.`}
        </DialogDescription>
        {booked ? (
          <CalendarCheck className="mx-auto my-6 h-14 w-14 text-turbo" aria-hidden />
        ) : (
          open && <InlineBooking key={nonce} {...request} />
        )}
      </DialogContent>
    </Dialog>
  );
}
