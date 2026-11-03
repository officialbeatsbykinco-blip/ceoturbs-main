// Reddit Pixel. Off until VITE_REDDIT_PIXEL_ID is set in Vercel (Reddit Ads → Events Manager → your pixel →
// Pixel ID, looks like "a2_…"), then redeploy. Loaded from code (not an inline <script>) so the CSP can keep
// blocking inline scripts. Every event carries our event_id as conversionId, so a later Conversions API copy
// would be de-duplicated.
type Rdt = ((...args: unknown[]) => void) & { callQueue?: unknown[]; sendEvent?: (...args: unknown[]) => void };

const raw = import.meta.env.VITE_REDDIT_PIXEL_ID as string | undefined;
const PIXEL_ID = raw && /^[a-z0-9_]{6,}$/i.test(raw) ? raw : undefined;
let started = false;
const queue: (() => void)[] = [];

/** dataLayer event → Reddit standard event (or a named custom event). */
const EVENTS: Record<string, { name: string; custom?: string }> = {
  view_item: { name: "ViewContent" },
  add_to_cart: { name: "AddToCart" },
  purchase: { name: "Purchase" },
  generate_lead: { name: "Lead" },
  book_call: { name: "Custom", custom: "BookedCall" },
};

const win = () => (typeof window === "undefined" ? null : (window as unknown as { rdt?: Rdt }));

/** The official loader snippet, minus the inline <script>. */
export function startReddit() {
  const w = win();
  if (!PIXEL_ID || started || !w) return;
  started = true;
  if (!w.rdt) {
    const p: Rdt = (...args: unknown[]) => (p.sendEvent ? p.sendEvent(...args) : p.callQueue!.push(args));
    p.callQueue = [];
    w.rdt = p;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.redditstatic.com/ads/pixel.js";
    document.head.appendChild(s);
  }
  w.rdt("init", PIXEL_ID, { optOut: false, useDecimalCurrencyValues: true });
  w.rdt("track", "PageVisit");
  queue.splice(0).forEach((f) => f());
}

export function redditPageView() {
  if (started) win()?.rdt?.("track", "PageVisit");
}

/** Fires the matching Reddit event. User match keys are sent only if the visitor gave them (lead/booking). */
export function redditEvent(event: string, params: { value?: unknown; currency?: unknown }, eventId: string, user?: { email?: string; phone?: string; externalId?: string }) {
  const map = EVENTS[event];
  if (!PIXEL_ID || !map) return;
  if (!started) {
    if (queue.length < 50) queue.push(() => redditEvent(event, params, eventId, user));
    return;
  }
  const value = Number(params.value);
  win()?.rdt?.("track", map.name, {
    conversionId: eventId,
    ...(map.custom ? { customEventName: map.custom } : {}),
    ...(value > 0 ? { value, currency: typeof params.currency === "string" ? params.currency : "USD" } : {}),
    ...(user?.email ? { email: user.email.trim().toLowerCase() } : {}),
    ...(user?.phone ? { phoneNumber: user.phone } : {}),
    ...(user?.externalId ? { externalId: user.externalId } : {}),
  });
}
