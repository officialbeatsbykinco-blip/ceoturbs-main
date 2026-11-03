// One small, dismissible nudge to the free visibility check after 12 seconds on the site.
// Once per browser session, never on the money pages (checkout, booking, the check itself), and never
// on top of an open dialog (booking calendar, quiz) — it must not get between a visitor and a booking.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { track } from "@/lib/track";

const KEY = "ct_check_popup";
const DELAY_MS = 12_000;
const SKIP = ["/", "/google-ads-for-local-business", "/free-audit", "/book", "/booked", "/brand-boost", "/google-review-cards", "/google-review-card-setup", "/custom-company-t-shirts", "/artist-merch", "/restaurants", "/privacy-policy", "/terms", "/shipping-returns"];

const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage blocked: it may show again on the next page, which is fine */
  }
};

export function FreeCheckPopup() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  // Ready buyers (pricing, results, any service page) never get pulled away from booking.
  const skip = SKIP.includes(pathname) || pathname === "/pricing" || pathname === "/results" || pathname.startsWith("/services");

  useEffect(() => {
    if (skip || seen()) return;
    const timer = window.setTimeout(() => {
      // A dialog is open (booking calendar, quiz): stay out of the way, don't mark it seen.
      if (document.querySelector('[role="dialog"]')) return;
      markSeen();
      setShow(true);
      track("check_popup_view", { page: pathname });
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, skip]);

  // Leaving the page it showed on (or landing on a skipped page) closes it.
  useEffect(() => setShow(false), [pathname]);

  if (!show || skip) return null;
  return (
    <div role="region" aria-label="Free visibility check" className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-md rounded-2xl bg-card p-4 pr-12 shadow-[0_20px_60px_-10px_rgb(0_0_0/0.8)] ring-1 ring-white/15 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:mx-0">
      <button type="button" onClick={() => setShow(false)} aria-label="Close" className="absolute right-1 top-1 grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-white/5">
        <X className="h-4 w-4" aria-hidden />
      </button>
      <p className="font-semibold">See how people find you — free</p>
      <p className="mt-1 text-sm text-muted-foreground">A 60-second scan of your Google profile, reviews and website. No card needed.</p>
      <Link to="/free-audit" onClick={() => track("check_popup_click", { page: pathname })} className="btn-ignite mt-3 w-full justify-center !py-3 !text-sm">
        Run my free check <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
