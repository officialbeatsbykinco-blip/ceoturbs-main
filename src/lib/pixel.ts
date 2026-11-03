// Meta Pixel (id in src/lib/track.ts; VITE_META_PIXEL_ID overrides it).
// Loads after the page is interactive so it never slows first paint; PageView fires on every route.
import { PIXEL_ID as pixelId, metaPixelReady, newEventId, serverTrack, visitorId } from "@/lib/track";
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };

const PIXEL_ID = pixelId();
let started = false;

export function startPixel() {
  // Dev servers and build runs must not reach the real pixel: fake Leads teach Meta to find the wrong people.
  if (!PIXEL_ID || started || typeof window === "undefined" || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return;
  started = true;
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = w._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", PIXEL_ID, { external_id: visitorId() });
  pageView(n);
  metaPixelReady();
}

/** PageView on the Pixel plus the same event (same id) through the Conversions API, so Meta covers it twice and de-duplicates. */
function pageView(fbq: Fbq) {
  const id = newEventId("pv");
  fbq("track", "PageView", {}, { eventID: id });
  serverTrack("page_view", id);
}

export function pixelPageView() {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (fbq) pageView(fbq);
}
