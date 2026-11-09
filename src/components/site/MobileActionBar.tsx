import { useLocation } from "react-router-dom";
import { BookButton, InstallBookButton } from "@/components/cta/Actions";
import { CALL_FIRST_SLUGS } from "@/content/services";
import { Calendar, MessageSquare, Phone, Wrench } from "lucide-react";
import { SITE, fromPriceLabel } from "@/config/site";
import { IT_SERVICES_PATH, techBooking } from "@/content/tech-pages";
import { FixMyTechLink } from "@/components/tech/FixMyTechLink";
import { CallLink } from "./CallLink";
import { REVIEWS_AD_PATH, SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";
import { CARD_TEXT, QUICK_TECH_TEXT, QUICK_TEXT, smsHref } from "@/lib/sms";

/** Sticky bottom bar on phones: the money actions are always one tap away. The shop pages have their own buy bars. */
export function MobileActionBar() {
  const { pathname } = useLocation();
  if (pathname === "/" || pathname === SHOP_PATH || pathname === SHIRTS_PATH || pathname === ARTIST_MERCH_PATH) return null;
  if (pathname === REVIEWS_AD_PATH)
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <a href="#buy" className="btn-ignite flex-1 !py-3.5 !text-base">
            Get my review cards — from {fromPriceLabel}
          </a>
          <a href={smsHref(QUICK_TEXT)} data-call-location="review ad page mobile bar text" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <MessageSquare className="h-5 w-5" aria-hidden />
            <span className="sr-only">Text {SITE.name}</span>
          </a>
          <CallLink location="review ad page mobile bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <Phone className="h-5 w-5" aria-hidden />
            <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
          </CallLink>
        </div>
      </div>
    );
  if (CALL_FIRST_SLUGS.some((slug) => pathname === `/services/${slug}`)) {
    const slug = pathname.split("/").pop() || "setup";
    const smsText = `Hi, I'd like a quote for ${slug.replace(/-/g, " ")}. My city is: `;
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-2.5 pt-2.5 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-1.5">
          <CallLink
            location={`${slug}-sticky-mobile`}
            className="btn-ignite flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-sm font-bold shadow-lg"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <span>Call</span>
          </CallLink>
          <a
            href={smsHref(smsText)}
            className="btn-chrome flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-sm font-bold text-foreground"
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
            <span>Text</span>
          </a>
          <InstallBookButton
            note={`${slug}-sticky-mobile`}
            variant="chrome"
            className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-sm"
          >
            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
            <span>Book</span>
          </InstallBookButton>
        </div>
      </div>
    );
  }
  // Tech-repair and office ad pages: phones never get the calendar. The orange button opens the tap-question text
  // flow (repair: the sheet; office: the quiz on the page), then a blue Call and a Text.
  const tech = techBooking(pathname);
  if (tech) {
    const where = pathname.split("/").pop();
    const repair = pathname.replace(/\/$/, "") === IT_SERVICES_PATH;
    const main = "btn-ignite flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-base font-bold shadow-lg";
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2.5 pt-2.5 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-1.5">
          {repair ? (
            <FixMyTechLink source={`${where}-sticky-mobile`} className={main}>
              <Wrench className="h-4 w-4 shrink-0" aria-hidden />
              <span>Get my price</span>
            </FixMyTechLink>
          ) : (
            <a href="#book" className={main}>
              <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
              <span>Get a quote</span>
            </a>
          )}
          <CallLink location={`${where}-sticky-mobile`} className="btn-blue flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-base font-bold">
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <span>Call</span>
          </CallLink>
          <a href={smsHref(tech.sms)} data-call-location={`${where}-sticky-mobile-sms`} className="btn-chrome flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !py-3.5 !px-2 !text-base font-bold">
            <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
            <span>Text</span>
          </a>
        </div>
      </div>
    );
  }
  if (pathname === "/app-marketing")
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <a href="#intake" className="btn-ignite flex-1 !py-3.5 !text-base">
            Get my free growth plan
          </a>
          <a href={smsHref(QUICK_TEXT)} data-call-location="dev page mobile bar text" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <MessageSquare className="h-5 w-5" aria-hidden />
            <span className="sr-only">Text {SITE.name}</span>
          </a>
          <CallLink location="dev page mobile bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <Phone className="h-5 w-5" aria-hidden />
            <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
          </CallLink>
        </div>
      </div>
    );
  // Restaurants: the call first, table cards one tap away.
  if (pathname === "/restaurants")
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <BookButton note="Restaurants mobile bar" prefill="Restaurant: I want more customers — help with delivery apps, menus/TV menus, Google & Apple Maps and review cards." className="flex-1 !py-3.5 !text-base">
            Free call
          </BookButton>
          <a href={smsHref(QUICK_TEXT)} data-call-location="restaurants mobile bar text" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <MessageSquare className="h-5 w-5" aria-hidden />
            <span className="sr-only">Text {SITE.name}</span>
          </a>
          <a href="#tables" className="btn-chrome !px-3 !py-3.5 !text-sm">
            Table cards
          </a>
        </div>
      </div>
    );
  // Everywhere else: tech repair first (the money maker), then a blue Call and a Text. No calendar on phones.
  if (pathname !== SETUP_PATH)
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2.5 pt-2.5 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-1.5">
          <FixMyTechLink source="mobile bar" className="btn-ignite flex flex-[1.4] items-center justify-center gap-1.5 whitespace-nowrap !px-2 !py-3.5 !text-base font-bold shadow-lg">
            <Wrench className="h-4 w-4 shrink-0" aria-hidden />
            <span>Fix my tech</span>
          </FixMyTechLink>
          <CallLink location="mobile bar" className="btn-blue flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-2 !py-3.5 !text-base font-bold">
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <span>Call</span>
          </CallLink>
          <a href={smsHref(QUICK_TECH_TEXT)} data-call-location="mobile bar text" className="btn-chrome flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap !px-2 !py-3.5 !text-base font-bold">
            <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
            <span>Text</span>
          </a>
        </div>
      </div>
    );
  // Setup guide: help, not another sale.
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
      <div className="flex gap-2">
        <a href={smsHref(CARD_TEXT)} data-call-location="setup mobile bar" className="btn-ignite inline-flex flex-[2] items-center justify-center gap-1.5 !px-3 !py-3.5 !text-base">
          <MessageSquare className="h-5 w-5 shrink-0" aria-hidden />
          Text us for help
        </a>
        <CallLink location="setup mobile bar" className="btn-chrome inline-flex flex-1 items-center justify-center gap-1.5 !px-3 !py-3.5 !text-base">
          <Phone className="h-5 w-5 shrink-0 text-turbo" aria-hidden />
          Call
          <span className="sr-only"> {SITE.name} at {SITE.phone.display}</span>
        </CallLink>
      </div>
    </div>
  );
}
