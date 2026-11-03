// The on-site tech-repair ad pages. Their header, floating and mobile buttons book a tech visit, not the agency call.
import { INSTALL_BOOKING, IT_BOOKING, type CalEvent } from "@/config/site";

export const IT_SERVICES_PATH = "/it-services-duluth-ga";
export const PC_TECH_PATH = "/pc-technician-duluth-ga";

/** The calendar a tech page books on, or undefined for every other page. */
export function techBooking(pathname: string): { booking: CalEvent; title?: string; sms: string } | undefined {
  const p = pathname.replace(/\/$/, "");
  if (p === IT_SERVICES_PATH) return { booking: IT_BOOKING, title: "Book your tech visit", sms: "Hi, I need tech help. Device and problem: " };
  if (p === PC_TECH_PATH) return { booking: INSTALL_BOOKING, sms: "Hi, I need a PC technician. My computer: " };
  return undefined;
}
