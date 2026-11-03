// Bottom-right "Book a free call" button on tablets and desktops (phones have the sticky action bar). It opens
// the same tracked Cal.com inline calendar dialog as every other booking button.
import { useLocation } from "react-router-dom";
import { CalendarDays, MessageSquare } from "lucide-react";
import { BookButton, InstallBookButton, TextQuoteButton } from "@/components/cta/Actions";
import { isInstallPath } from "@/content/services";
import { techBooking } from "@/content/tech-pages";
import { SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";

const HIDDEN = new Set(["", SETUP_PATH, "/book", "/booked", "/google-ads-for-local-business", SHOP_PATH, SHIRTS_PATH, ARTIST_MERCH_PATH]);

export function FloatingBookButton() {
  const { pathname } = useLocation();
  if (HIDDEN.has(pathname.replace(/\/$/, ""))) return null;
  // Tech-repair ad pages book a tech visit; their hero already has call and text.
  const tech = techBooking(pathname);
  if (tech)
    return (
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <InstallBookButton variant="ignite" note="Floating tech button" booking={tech.booking} title={tech.title} className="flex items-center gap-2 !rounded-full !px-5 !py-3 !text-sm shadow-xl">
          <CalendarDays className="h-4 w-4" aria-hidden />
          Book a visit
        </InstallBookButton>
      </div>
    );
  if (isInstallPath(pathname))
    return (
      <div className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 sm:flex">
        <TextQuoteButton
          service={pathname.split("/").pop()?.replace(/-/g, " ") || "setup"}
          className="!rounded-full !px-4 !py-3 !text-sm shadow-xl flex items-center gap-1.5"
        >
          <MessageSquare className="h-4 w-4 text-turbo" aria-hidden />
          Text Us
        </TextQuoteButton>
        <InstallBookButton variant="ignite" note="Floating install button" className="!rounded-full !px-5 !py-3 !text-sm shadow-xl flex items-center gap-2">
          <CalendarDays className="h-4 w-4" aria-hidden />
          Book Online
        </InstallBookButton>
      </div>
    );
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
      <BookButton note="Floating chat button" className="!rounded-full !px-5 !py-3 !text-sm">
        <CalendarDays className="h-4 w-4" aria-hidden />
        Book a free call
      </BookButton>
    </div>
  );
}
