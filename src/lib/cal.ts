// Cal.com embed loader. The script loads on the first interaction so it never
// competes with the page's first paint, and every booking shows as an inline calendar on the page.
import { BOOKING, INSTALL_BOOKING, type CalEvent } from "@/config/site";
import { attribution, track, trackBooked } from "@/lib/track";

export { track, trackBooked };

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns: Record<string, (...args: unknown[]) => void>;
  q?: unknown[];
};

declare global {
  interface Window {
    __ctBookingModal?: boolean;
  }
}

const getCal = () => (window as unknown as { Cal?: CalFn }).Cal;

const EMBED_SRC = "https://app.cal.com/embed/embed.js";
let ready: Promise<boolean> | null = null;

/** Official Cal.com bootstrap snippet, kept verbatim in behaviour. */
function bootstrap() {
  const w = window as unknown as Record<string, unknown>;
  if (w.Cal) return;
  const d = document;
  const push = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
  const cal = function (this: unknown, ...ar: unknown[]) {
    const self = w.Cal as CalFn & { q: unknown[] };
    if (!self.loaded) {
      self.ns = {};
      self.q = self.q || [];
      const s = d.createElement("script");
      s.src = EMBED_SRC;
      s.async = true;
      d.head.appendChild(s);
      self.loaded = true;
    }
    if (ar[0] === "init") {
      const api = function (...args: unknown[]) {
        push(api as unknown as { q: unknown[] }, args);
      } as unknown as { q: unknown[] };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        self.ns[namespace] = self.ns[namespace] || (api as unknown as CalFn);
        push(self.ns[namespace] as unknown as { q: unknown[] }, ar);
        push(self, ["initNamespace", namespace]);
      } else push(self, ar);
      return;
    }
    push(self, ar);
  } as unknown as CalFn;
  w.Cal = cal;
}

/**
 * Matches the inline embed code from the Cal.com dashboard (Embed → Inline): blue #0093ff on the picked
 * day/time, and the meeting-info panel hidden — visitors already know why they clicked "Book a call".
 */
const UI = {
  theme: "dark" as const,
  layout: "month_view" as const,
  hideEventTypeDetails: true,
  cssVarsPerTheme: { dark: { "cal-brand": "#0093ff" }, light: { "cal-brand": "#0093ff" } },
};

/** Namespaces: the site-wide booking calendar, and the quiz's own (kept apart so their load events don't mix). */
export const QUIZ_NS = "brandboostquiz";
const inited = new Set<string>();

/**
 * The booking app lives on app.cal.com (where embed.js is served from). The embed only reveals the
 * calendar iframe once it hears from this origin, so a cal.com origin here leaves a blank box.
 */
export const CAL_ORIGIN = "https://app.cal.com";

/** Calendar iframe status per namespace, from Cal's linkReady / linkFailed embed events. */
type LinkStatus = "ready" | "failed";
const linkListeners = new Map<string, Set<(s: LinkStatus) => void>>();

export function onLinkStatus(ns: string, fn: (s: LinkStatus) => void) {
  const set = linkListeners.get(ns) ?? new Set();
  linkListeners.set(ns, set);
  set.add(fn);
  return () => void set.delete(fn);
}

/**
 * "ready" once the calendar shows times, "failed" if the booking page reports an error (wrong link,
 * event hidden), "timeout" if it never says either — the blank-box case, which must not count as working.
 */
type LinkResult = LinkStatus | "timeout";
function waitForLink(ns: string, ms: number) {
  return new Promise<LinkResult>((resolve) => {
    const off = onLinkStatus(ns, (s) => done(s));
    const timer = setTimeout(() => done("timeout"), ms);
    function done(r: LinkResult) {
      clearTimeout(timer);
      off();
      resolve(r);
    }
  });
}

function initNamespace(ns: string) {
  const Cal = getCal()!;
  if (inited.has(ns)) return;
  inited.add(ns);
  Cal("init", ns, { origin: CAL_ORIGIN });
  Cal.ns[ns]("ui", UI);
  for (const [action, status] of [["linkReady", "ready"], ["linkFailed", "failed"]] as const)
    Cal.ns[ns]("on", { action, callback: () => linkListeners.get(ns)?.forEach((fn) => fn(status)) });
  // Real bookings (not just calendar opens) are the conversion the ad platforms should optimize for.
  for (const action of ["bookingSuccessful", "bookingSuccessfulV2"] as const) {
    Cal.ns[ns]("on", {
      action,
      callback: (e: { detail?: { data?: Record<string, unknown> } }) => {
        const d = e?.detail?.data ?? {};
        const uid = typeof d.uid === "string" ? d.uid : undefined;
        trackBooked("embed", uid, bookerFrom(d));
      },
    });
  }
}

/** Forgets a failed embed load (blocked request, offline blip) so the next attempt starts clean instead of staying broken until a page refresh. */
function resetCal() {
  ready = null;
  inited.clear();
  document.querySelectorAll(`script[src="${EMBED_SRC}"]`).forEach((s) => s.remove());
  delete (window as unknown as Record<string, unknown>).Cal;
}

/** Resolves true once the Cal.com embed is usable. A failed load is not cached: calling again retries. */
export function loadCal(ns: string = BOOKING.namespace): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!ready) {
    ready = new Promise((resolve) => {
      bootstrap();
      initNamespace(BOOKING.namespace);
      const script = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
      if (!script) {
        resetCal();
        return resolve(false);
      }
      script.addEventListener("load", () => resolve(true), { once: true });
      script.addEventListener(
        "error",
        () => {
          resetCal();
          resolve(false);
        },
        { once: true },
      );
    });
  }
  const current = ready;
  if (getCal()) initNamespace(ns);
  return current;
}

/** loadCal that gives up after `ms`, so a stalled network shows the fallback button instead of a spinner forever. */
export const loadCalWithin = (ns: string, ms = 6000) => Promise.race([loadCal(ns), new Promise<boolean>((r) => setTimeout(() => r(false), ms))]);

/**
 * source  → hidden booking metadata (which button/page drove the booking)
 * prefill → visible "notes" text the visitor sees and can edit; only for real intent
 * person  → name / email / phone the visitor already typed (so they don't type them twice)
 * fields  → booking-form fields by slug (the hidden quiz answers on the Cal.com event)
 * meta    → extra booking metadata, read by api/cal-webhook.js
 */
export type Person = { name?: string; email?: string; phone?: string };
export type Prefill = { source?: string; prefill?: string; person?: Person; fields?: Record<string, string | undefined>; meta?: Record<string, string | number | undefined> };

const defined = (o: Record<string, unknown> = {}) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ""));

const calConfig = ({ source, prefill, person, fields, meta }: Prefill = {}) => ({
  layout: "month_view" as const,
  useSlotsViewOnSmallScreen: "true",
  theme: "dark" as const,
  ...(prefill ? { notes: prefill } : {}),
  ...(person?.name ? { name: person.name } : {}),
  ...(person?.email ? { email: person.email } : {}),
  ...(person?.phone ? { attendeePhoneNumber: person.phone } : {}),
  ...defined(fields),
  ...(source ? { "metadata[source]": source } : {}),
  "metadata[page]": typeof window !== "undefined" ? window.location.pathname : "",
  ...Object.fromEntries(Object.entries(defined(meta)).map(([k, v]) => [`metadata[${k}]`, String(v).slice(0, 480)])),
  // Read by api/cal-webhook.js so the server-side Meta / TikTok "Schedule" matches this browser.
  ...attributionMeta(),
});

function attributionMeta() {
  if (typeof window === "undefined") return {};
  const a = attribution();
  const keep = ["fbp", "fbc", "fbclid", "fbi", "gclid", "msclkid", "ttclid", "ttp", "utm_source", "utm_campaign"] as const;
  // Cal.com caps metadata values at 500 characters, so a longer id is left out rather than cut short.
  // The visitor's browser string lets the server-side Schedule event match this browser (Meta scores ip/user agent).
  return { ...Object.fromEntries(keep.filter((k) => a[k] && a[k]!.length <= 500).map((k) => [`metadata[${k}]`, a[k]!])), ...(navigator.userAgent ? { "metadata[ua]": navigator.userAgent.slice(0, 400) } : {}) };
}

/**
 * The Cal.com booking page itself, prefilled — used when the embed can't show. It carries the same
 * metadata as the embed, so api/cal-webhook.js still sends the server-side "Schedule" with the ad click ids.
 */
export function bookingPageUrl(prefill?: string, person?: Person, fields?: Prefill["fields"], extra: Pick<Prefill, "source" | "meta"> = {}) {
  const { layout: _layout, theme: _theme, useSlotsViewOnSmallScreen: _slots, ...params } = calConfig({ prefill, person, fields, ...extra });
  const q = new URLSearchParams(defined(params) as Record<string, string>);
  return `${BOOKING.url}${q.toString() ? `?${q}` : ""}`;
}

/** Leaves for the booking page in this tab (new tabs get blocked after an await, and in-app browsers handle them badly). */
function goToBookingPage(url: string, source?: string) {
  track("booking_open", { source: `${source ?? "site"} — direct page` });
  window.location.assign(url);
}

export type BookingRequest = Prefill;

/**
 * Shows the Brand Boost calendar inline in an on-page dialog (src/components/booking/BookingModal.tsx).
 * Without that dialog mounted, falls back to Cal.com's modal, then to the booking page if the calendar fails.
 */
export async function openBooking(source?: string, prefill?: string, person?: Person, extra: Omit<Prefill, "source" | "prefill" | "person"> = {}) {
  track("booking_open", { source });
  if (window.__ctBookingModal) {
    window.dispatchEvent(new CustomEvent<BookingRequest>("ct:booking", { detail: { source, prefill, person, ...extra } }));
    return;
  }
  const ns = BOOKING.namespace;
  const url = bookingPageUrl(prefill, person, extra.fields, { source, meta: extra.meta });
  const ok = await loadCalWithin(ns);
  if (!ok || !getCal()?.ns[ns]) return goToBookingPage(url, source);
  const shown = waitForLink(ns, 20000);
  getCal()!.ns[ns]("modal", { calLink: BOOKING.calLink, config: calConfig({ source, prefill, person, ...extra }) });
  // Cal.com's own loader shows while the calendar loads; only a real error from the booking page sends the visitor to it.
  if ((await shown) === "failed") goToBookingPage(url, source);
}

/**
 * Inline booking calendar mounted into an element by id. Resolves "ready" once times show, "failed" if the
 * embed or the booking page fails, "timeout" if the calendar never confirms it loaded (treat as not working;
 * listen with onLinkStatus for a late "ready").
 */
export async function mountInlineBooking(elementId: string, source?: string, prefill?: string, opts: { ns?: string } & Omit<Prefill, "source" | "prefill"> = {}): Promise<LinkResult> {
  const { ns = BOOKING.namespace, ...rest } = opts;
  const ok = await loadCalWithin(ns);
  if (!ok || !getCal()?.ns[ns]) return "failed";
  const shown = waitForLink(ns, 12000);
  getCal()!.ns[ns]("inline", {
    elementOrSelector: `#${elementId}`,
    calLink: BOOKING.calLink,
    config: calConfig({ source, prefill, ...rest }),
  });
  return shown;
}

/** Best-effort booker details from the Cal.com success payload (field names vary by version). */
function bookerFrom(d: Record<string, unknown>) {
  const attendees = (d.attendees ?? (d.booking as Record<string, unknown> | undefined)?.attendees) as { email?: string; name?: string; phoneNumber?: string }[] | undefined;
  const a = Array.isArray(attendees) ? attendees[0] : undefined;
  const responses = (d.responses ?? {}) as Record<string, unknown>;
  const email = a?.email ?? (typeof responses.email === "string" ? responses.email : undefined);
  const name = a?.name ?? (typeof responses.name === "string" ? responses.name : undefined);
  const phone = a?.phoneNumber ?? (typeof responses.attendeePhoneNumber === "string" ? responses.attendeePhoneNumber : undefined);
  return email || phone ? { email, name, phone } : undefined;
}

/** Install/build pages: opens the office-studio-setup calendar (or another `event`) in Cal's modal, falling back to its booking page. */
export async function openInstallBooking(source?: string, event: CalEvent = INSTALL_BOOKING) {
  track("booking_open", { source: `${source ?? "install"} — install calendar` });
  const ns = event.namespace;
  const url = `${event.url}?${new URLSearchParams({ "metadata[source]": source ?? "install", "metadata[page]": window.location.pathname })}`;
  const ok = await loadCalWithin(ns);
  if (!ok || !getCal()?.ns[ns]) return goToBookingPage(url, source);
  const shown = waitForLink(ns, 20000);
  getCal()!.ns[ns]("modal", { calLink: event.calLink, config: calConfig({ source }) });
  if ((await shown) === "failed") goToBookingPage(url, source);
}

/** Install/setup calendar mounted inline into an element by id, through the same loader as the page's other calendars. */
export async function mountInstallBooking(elementId: string, source?: string, instance = "modal", event: CalEvent = INSTALL_BOOKING): Promise<LinkResult> {
  // One namespace per mounted calendar: Cal keeps a single embed per namespace, so sharing one leaves the second empty.
  const ns = `${event.namespace}-${instance}`;
  const ok = await loadCalWithin(ns);
  if (!ok || !getCal()?.ns[ns]) return "failed";
  const shown = waitForLink(ns, 12000);
  getCal()!.ns[ns]("inline", {
    elementOrSelector: `#${elementId}`,
    calLink: event.calLink,
    config: calConfig({ source }),
  });
  return shown;
}
