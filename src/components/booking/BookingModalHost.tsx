// Always mounted (in Layout): listens for openBooking() and loads the booking dialog on first use.
import { lazy, Suspense, useEffect, useState } from "react";
import type { BookingRequest } from "@/lib/cal";

const BookingModal = lazy(() => import("./BookingModal"));

export function BookingModalHost() {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<BookingRequest | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    window.__ctBookingModal = true;
    const onOpen = (e: Event) => {
      setRequest((e as CustomEvent<BookingRequest>).detail ?? {});
      setNonce((n) => n + 1);
      setOpen(true);
    };
    window.addEventListener("ct:booking", onOpen);
    return () => {
      window.__ctBookingModal = false;
      window.removeEventListener("ct:booking", onOpen);
    };
  }, []);

  if (!request) return null;
  return (
    <Suspense fallback={null}>
      <BookingModal open={open} setOpen={setOpen} request={request} nonce={nonce} />
    </Suspense>
  );
}
