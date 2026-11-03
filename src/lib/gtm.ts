// Google Tag Manager (GTM-KRPRZ67Z + GTM-KH6BCWD3). Loaded from code instead of an inline <script> so the site's
// Content-Security-Policy can keep blocking inline scripts. GTM routes the dataLayer events from
// src/lib/track.ts to Google Ads (GA4 is the direct Google tag in src/lib/ga.ts; UET and Meta fire from
// code) — see docs/gtm-container.json.
import { gaPageView } from "@/lib/ga";

export const GTM_ID = "GTM-KRPRZ67Z";
/**
 * Both containers (GTM-KRPRZ67Z, GTM-KH6BCWD3) are switched OFF. A Google tag inside them (GT-5R7RRFRL) claimed
 * the Google Ads destination AW-18468746701, so the conversions sent from src/lib/ga.ts (bookings, leads, calls)
 * were silently dropped. GA4, Google Ads, Meta, UET and Clarity all fire from code; add an id back here only
 * if its container has no Google tag for G-XDWPSVBW53 or AW-18468746701.
 */
export const GTM_IDS: readonly string[] = [];

export function startGtm() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; __gtm?: boolean };
  if (w.__gtm || GTM_IDS.length === 0) return;
  w.__gtm = true;
  w.dataLayer = w.dataLayer || [];
  // Push gtm.start ONCE — pushing once per container causes double session counting
  // which creates the "sessions exceed impressions" UTM discrepancy in Google Ads.
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  for (const id of GTM_IDS) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
    // Suppress legacy Google API loader errors (apis.google.com/js/client.js?onload=_ga)
    // that come from old GTM tags — they are benign but noisy in reporting tools.
    s.onerror = () => { /* GTM script blocked by ad-blocker — non-fatal */ };
    document.head.appendChild(s);
  }
}

/** Client-side route change → GA4 page_view (direct tag) and the dataLayer "virtual_page_view" for GTM. */
export function gtmPageView(path: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  gaPageView(path);
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "virtual_page_view", page_path: path, page_location: window.location.href, page_title: document.title });
}

