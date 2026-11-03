// sms: links to the business phone. "?&body=" is the form both iPhone and Android Messages read.
import { SITE } from "@/config/site";

export const smsHref = (body: string) => `sms:${SITE.phone.e164}?&body=${encodeURIComponent(body)}`;

/** What the phone bar's Text us button fills in. */
export const QUICK_TEXT = "Hi CEO Turbo, I want more customers. My business is: ";

/** What the shop and setup pages' Text buttons fill in. */
export const CARD_TEXT = "Hi CEO Turbo, I have a question about the review cards. My business is: ";

/** True on a phone or tablet whose Messages app can take the link. Computers get a form instead. */
export function canText() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
