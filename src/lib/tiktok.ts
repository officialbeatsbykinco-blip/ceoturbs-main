// TikTok Pixel. Off until VITE_TIKTOK_PIXEL_ID is set in Vercel (TikTok Ads Manager → Tools → Events →
// Web events → your pixel → Pixel ID), then redeploy. Loaded from code (not GTM custom HTML) so the CSP
// can keep blocking inline scripts. Server-side copies of Lead/Schedule go out through the Events API
// (api/_lib/tiktok-events.js) with the same event_id, so TikTok de-duplicates them.
type Ttq = unknown[] & {
  methods?: string[];
  _i?: Record<string, unknown>;
  _t?: Record<string, number>;
  _o?: Record<string, unknown>;
  load?: (id: string) => void;
  page?: () => void;
  track?: (event: string, params?: Record<string, unknown>, opts?: { event_id?: string }) => void;
  identify?: (user: Record<string, string>) => void;
  [k: string]: unknown;
};

const PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;
let started = false;
// Events fired before the pixel starts (it loads when the page is idle) wait here.
const queue: (() => void)[] = [];

/** TikTok's standard event names (SubmitForm → Lead and CompletePayment → Purchase were renamed). */
const EVENTS: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  customize_product: "CustomizeProduct",
  generate_lead: "Lead",
  book_call: "Schedule",
};

const win = () => (typeof window === "undefined" ? null : (window as unknown as { ttq?: Ttq; TiktokAnalyticsObject?: string }));

/** The official loader snippet, minus the inline <script>. */
export function startTiktok() {
  const w = win();
  if (!PIXEL_ID || started || !w) return;
  started = true;
  w.TiktokAnalyticsObject = "ttq";
  const ttq = (w.ttq = w.ttq || ([] as unknown as Ttq));
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  const stub = (t: Ttq, m: string) => {
    t[m] = (...args: unknown[]) => t.push([m, ...args]);
  };
  for (const m of ttq.methods) stub(ttq, m);
  ttq._i = ttq._i || {};
  ttq._t = ttq._t || {};
  ttq._o = ttq._o || {};
  ttq._i[PIXEL_ID] = [];
  ttq._t[PIXEL_ID] = Date.now();
  ttq._o[PIXEL_ID] = {};
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${PIXEL_ID}&lib=ttq`;
  document.head.appendChild(s);
  ttq.page?.();
  queue.splice(0).forEach((f) => f());
}

export function tiktokPageView() {
  win()?.ttq?.page?.();
}

/** Fires the matching TikTok event; the pixel hashes email/phone itself. */
export function tiktokEvent(event: string, params: { value?: unknown; currency?: unknown; content_name?: unknown; contents?: unknown }, eventId: string, user?: { email?: string; phone?: string; externalId?: string }) {
  const name = EVENTS[event];
  if (!PIXEL_ID || !name) return;
  if (!started) {
    if (queue.length < 50) queue.push(() => tiktokEvent(event, params, eventId, user));
    return;
  }
  const ttq = win()?.ttq;
  if (!ttq?.track) return;
  if (user?.email || user?.phone || user?.externalId)
    ttq.identify?.({
      ...(user.email ? { email: user.email.trim().toLowerCase() } : {}),
      ...(user.phone ? { phone_number: user.phone.replace(/[^\d+]/g, "") } : {}),
      ...(user.externalId ? { external_id: user.externalId } : {}),
    });
  ttq.track(
    name,
    {
      ...(typeof params.value === "number" ? { value: params.value, currency: params.currency || "USD" } : {}),
      ...(params.content_name ? { content_name: params.content_name } : {}),
      ...(params.contents ? { contents: params.contents, content_type: "product" } : {}),
    },
    { event_id: eventId },
  );
}
