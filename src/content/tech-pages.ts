// The tech-repair and office-setup ad pages. Their header, floating and mobile buttons book a tech visit, not the agency call.
import { INSTALL_BOOKING, IT_BOOKING, type CalEvent } from "@/config/site";
import { installPage } from "@/content/install-pages";

export const IT_SERVICES_PATH = "/computer-repair-tampa";
/** Office setup ad page (Google & Microsoft Ads). */
export const OFFICE_SETUP_PATH = "/office-setup-tampa";
/** Old Georgia ad URLs; vercel.json 301s them to IT_SERVICES_PATH. */
export const OLD_TECH_PATHS = ["/it-services-duluth-ga", "/pc-technician-duluth-ga"];

/** The calendar a tech page books on, or undefined for every other page. */
export function techBooking(pathname: string): { booking: CalEvent; title?: string; sms: string } | undefined {
  const p = pathname.replace(/\/$/, "");
  if (p === IT_SERVICES_PATH) return { booking: IT_BOOKING, title: "Book your tech visit", sms: "Hi Chris, I need tech help in Tampa. Device and problem: " };
  if (p === OFFICE_SETUP_PATH) return { booking: INSTALL_BOOKING, title: "Book your office setup", sms: "Hi Chris, I'd like a quote for an office setup in Tampa. Number of desks and what I need: " };
  const install = installPage(p);
  if (install) return { booking: INSTALL_BOOKING, title: `Book your ${install.service}`, sms: `Hi Chris, I'd like a price for ${install.service} in Tampa. What I need: ` };
  return undefined;
}
