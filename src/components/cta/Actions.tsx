import { lazy, Suspense, useState, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { InstallCalModal } from "@/components/booking/InstallCalModal";
import { BOOKING, INSTALL_BOOKING, SITE, fromPriceLabel, type CalEvent } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { openBooking } from "@/lib/cal";
import { openTextQuiz } from "@/lib/text-quiz-open";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

const TextQuoteModal = lazy(() => import("@/components/cta/TextQuoteModal").then((m) => ({ default: m.TextQuoteModal })));

type Variant = "ignite" | "chrome" | "link";

const variantClass: Record<Variant, string> = {
  ignite: "btn-ignite",
  chrome: "btn-chrome",
  // Padded hit area (py/-my) makes the link a full-size tap target on phones without changing the line it sits in.
  link: "-my-3 inline-flex items-center gap-1.5 py-3 font-semibold text-turbo underline decoration-turbo/40 underline-offset-4 hover:decoration-turbo",
};

/**
 * Opens the text quiz, the shortest way to reach us, on every device; `direct` skips it and opens the Brand Boost
 * calendar (Cal.com inline embed) in an on-page dialog, tracked as booking_open and, once booked, book_call.
 * Real href so it still works without JS and is crawlable.
 */
export function BookButton({
  children = "Book a free 30-min call",
  note,
  prefill,
  variant = "ignite",
  direct = false,
  className,
}: {
  children?: ReactNode;
  /** Opens the calendar straight away, for people who have already chosen to pick a time. */
  direct?: boolean;
  /** Internal source label, stored as hidden booking metadata. */
  note?: string;
  /** Visible text for the booking form's notes field. */
  prefill?: string;
  variant?: Variant;
  className?: string;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (!direct && openTextQuiz({ source: note })) return;
    void openBooking(note, prefill);
  };
  return (
    <a href={BOOKING.url} onClick={onClick} className={cn(variantClass[variant], className)} rel="noopener">
      {children}
    </a>
  );
}

/** Goes to the Google review card store (a real link, so it works without JS and is crawlable). */
export function ShopCardsButton({ children, variant = "ignite", className }: { children?: ReactNode; variant?: Variant; className?: string }) {
  return (
    <Link to={SHOP_PATH} onClick={() => track("shop_click")} className={cn(variantClass[variant], className)}>
      {children ?? `Review cards — from ${fromPriceLabel}`}
    </Link>
  );
}

/** Books the install/setup calendar (office-studio-setup event) in native Cal.com modal. Real href so it works without JS. */
export function InstallBookButton({
  children = "Book your install",
  note,
  variant = "chrome",
  className,
  booking = INSTALL_BOOKING,
  title,
}: {
  children?: ReactNode;
  note?: string;
  variant?: Variant;
  className?: string;
  booking?: CalEvent;
  title?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <a
        href={booking.url}
        onClick={onClick}
        className={cn(variantClass[variant], className)}
        rel="noopener"
      >
        {children}
      </a>
      <InstallCalModal open={modalOpen} onOpenChange={setModalOpen} note={note} booking={booking} title={title} />
    </>
  );
}

/**
 * Text for a quote button.
 * On mobile devices, 1-tap opens the native SMS app with pre-filled text.
 * On desktop computers, opens TextQuoteModal with QR code, phone number copying and computer message link.
 */
export function TextQuoteButton({
  children = "Text for quote",
  service = "office setup",
  smsText,
  variant = "chrome",
  className,
}: {
  children?: ReactNode;
  service?: string;
  smsText?: string;
  variant?: Variant;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const defaultText = smsText ?? `Hi, I'd like a quote for ${service}. My city is: `;
  const smsUrl = `sms:${SITE.phone.e164}?&body=${encodeURIComponent(defaultText)}`;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 640 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    if (!isMobile) {
      e.preventDefault();
      setModalOpen(true);
    }
    track("sms_button_click", { service, platform: isMobile ? "mobile" : "desktop" });
  };

  return (
    <>
      <a
        href={smsUrl}
        onClick={onClick}
        className={cn(variantClass[variant], className)}
        rel="noopener"
      >
        {children}
      </a>
      {modalOpen && (
        <Suspense fallback={null}>
          <TextQuoteModal open={modalOpen} onOpenChange={setModalOpen} service={service} smsText={defaultText} />
        </Suspense>
      )}
    </>
  );
}
