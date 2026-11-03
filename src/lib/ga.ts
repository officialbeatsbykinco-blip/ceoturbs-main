// Google Analytics 4, installed directly as the Google tag (G-XDWPSVBW53). Loaded from code instead of
// an inline <script> so the Content-Security-Policy can keep blocking inline scripts.
// It uses its OWN data layer ("gaLayer") so it never mixes with GTM's "dataLayer".
// Google Ads (AW-18468746701) rides on the same tag: remarketing page views from the config call, and
// conversions from googleAdsConversion() below — so do NOT add Google Ads conversion tags in GTM (double counting).
export const GA_ID = "G-XDWPSVBW53";

/** CEO Turbo's Google Ads account tag. VITE_GOOGLE_ADS_ID overrides it (must look like AW-123…). */
const envAds = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
export const GOOGLE_ADS_ID = envAds && /^AW-\d{6,}$/.test(envAds) ? envAds : "AW-18468746701";

/**
 * Google Ads → Goals → Conversions → each action → Tag setup → "Use Google tag": the part after the slash in
 * send_to "AW-18468746701/LABEL". Empty = that conversion isn't sent yet (GA4 still records the event).
 */
export const GOOGLE_ADS_LABELS: Record<string, string> = {
  generate_lead: "6XuTCJ6H55odEM3ryuZE",
  book_call: "5K_sCJuH55odEM3ryuZE",
  click_to_call: "eAzECKGH55odEM3ryuZE",
  purchase: "sOe0CJiH55odEM3ryuZE",
};

type GaWin = Window & { gaLayer?: unknown[]; gtag?: (...args: unknown[]) => void; __ga?: boolean };

export function startGa() {
  if (typeof window === "undefined") return;
  const w = window as GaWin;
  if (w.__ga) return;
  w.__ga = true;
  w.gaLayer = w.gaLayer || [];
  // gtag.js only understands `arguments` objects, not arrays.
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.gaLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { send_page_view: true });
  w.gtag("config", GOOGLE_ADS_ID, { allow_enhanced_conversions: true });
}

/** Downloads gtag.js, which sends everything queued since startGa (page view included). */
export function loadGa() {
  if (typeof window === "undefined") return;
  const w = window as GaWin & { __gaLoaded?: boolean };
  if (w.__gaLoaded) return;
  w.__gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}&l=gaLayer`;
  document.head.appendChild(s);
}

/** A GA4 event (conversion or funnel step). Safe to call before the tag has loaded. */
export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as GaWin).gtag?.("event", name, params);
}

/** Client-side route change → GA4 page_view (the first load is sent by the tag itself). */
export function gaPageView(path: string) {
  gaEvent("page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}

/**
 * Sends the matching Google Ads conversion (if its label is filled in) with the event id as transaction_id,
 * so the same lead or booking is never counted twice. Email/phone go along for enhanced conversions;
 * the Google tag hashes them before they leave the browser.
 */
export function googleAdsConversion(event: string, data: { eventId: string; value?: unknown; currency?: unknown; email?: string; phone?: string }) {
  const label = GOOGLE_ADS_LABELS[event];
  if (!label || typeof window === "undefined") return;
  const gtag = (window as GaWin).gtag;
  if (!gtag) return;
  if (data.email || data.phone) gtag("set", "user_data", { ...(data.email ? { email: data.email.trim().toLowerCase() } : {}), ...(data.phone ? { phone_number: data.phone } : {}) });
  const value = Number(data.value);
  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    transaction_id: data.eventId,
    ...(value > 0 ? { value, currency: typeof data.currency === "string" ? data.currency : "USD" } : {}),
  });
}
