// One event layer for every ad platform.
//
// Every call pushes a GA4-style event (with a unique event_id) to the dataLayer, where Google Tag
// Manager (GTM-KRPRZ67Z) can use it, and sends the same event to GA4 and Google Ads through the direct
// Google tag (src/lib/ga.ts). Microsoft UET, Reddit (src/lib/reddit.ts) and
// the Meta Pixel are fired from code below, so do NOT add UET or Meta tags in GTM (double counting).
// The Meta Pixel gets the matching standard event with the same id as eventID, so the server-side
// Conversions API copy (api/_lib/meta-capi.js) is de-duplicated instead of double counted.
// TikTok (src/lib/tiktok.ts) gets the same event and id once VITE_TIKTOK_PIXEL_ID is set.

import { gaEvent, googleAdsConversion } from "@/lib/ga";
import { redditEvent } from "@/lib/reddit";
import { uetEvent } from "@/lib/uet";
import { tiktokEvent } from "@/lib/tiktok";
import { clarityEvent } from "@/lib/clarity";

type Fn = (...args: unknown[]) => void;
type Win = Window & { dataLayer?: unknown[]; fbq?: Fn };

/** externalId = our own id for the person (quiz id), sent hashed for better ad-platform matching. */
export type UserData = { email?: string; phone?: string; name?: string; externalId?: string };
export type Item = { item_id: string; item_name: string; item_variant?: string; price: number; quantity: number };
export type Ecommerce = { currency: string; value: number; items: Item[] };

/** dataLayer event → Meta event. `custom` events go through trackCustom. */
const META: Record<string, { name: string; custom?: boolean }> = {
  view_item: { name: "ViewContent" },
  add_to_cart: { name: "AddToCart" },
  begin_checkout: { name: "InitiateCheckout" },
  customize_product: { name: "CustomizeProduct" },
  generate_lead: { name: "Lead" },
  book_call: { name: "Schedule" },
  click_to_call: { name: "Contact" },
  click_to_text: { name: "Contact" },
  booking_open: { name: "BookingOpen", custom: true },
  audit_start: { name: "AuditStart", custom: true },
  audit_complete: { name: "AuditComplete", custom: true },
  quiz_start: { name: "QuizStart", custom: true },
};

/** CEO Turbo's Meta Pixel (Events Manager → Data sources). VITE_META_PIXEL_ID overrides it. */
export const DEFAULT_PIXEL_ID = "3232222473609236";
export const PIXEL_ID = () => (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || DEFAULT_PIXEL_ID;

/** Conversions worth filtering session recordings by in Clarity. */
const CLARITY_EVENTS = new Set(["generate_lead", "book_call", "click_to_call", "click_to_text", "add_to_cart", "begin_checkout"]);

export const newEventId = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/**
 * A stable, anonymous id for this browser, sent (hashed server-side) as Meta/TikTok external_id on every
 * event. The same id on the Pixel, the Conversions API and the booking ties a visitor's events together,
 * which raises Event Match Quality.
 */
const VID_KEY = "ct_vid";
let vid = "";
export function visitorId() {
  if (vid) return vid;
  try {
    vid = localStorage.getItem(VID_KEY) || "";
    if (!vid) {
      vid = newEventId("v");
      localStorage.setItem(VID_KEY, vid);
    }
  } catch {
    vid = vid || newEventId("v");
  }
  return vid;
}

const win = () => (typeof window === "undefined" ? null : (window as Win));

// The Meta Pixel loads once the page is idle (src/lib/pixel.ts), so events fired earlier — e.g. the shop's
// ViewContent on page load — wait here and are sent, in order, right after the pixel's init.
const metaQueue: (() => void)[] = [];
let metaReady = false;
export function metaPixelReady() {
  metaReady = true;
  metaQueue.splice(0).forEach((f) => f());
}
const withMeta = (fn: () => void) => {
  if (metaReady && win()?.fbq) fn();
  else if (metaQueue.length < 50) metaQueue.push(fn);
};

/** E.164-ish phone for Google/Microsoft enhanced conversions (US default). */
export const e164 = (phone = "") => {
  const d = phone.replace(/\D/g, "");
  if (!d) return undefined;
  return d.length === 10 ? `+1${d}` : `+${d}`;
};

const splitName = (name = "") => {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { first: first || undefined, last: rest.join(" ") || undefined };
};

function metaParams(params: Record<string, unknown>, ecommerce?: Ecommerce) {
  if (!ecommerce) return params;
  return {
    ...params,
    value: ecommerce.value,
    currency: ecommerce.currency,
    content_type: "product",
    content_ids: ecommerce.items.map((i) => i.item_id),
    contents: ecommerce.items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
    num_items: ecommerce.items.reduce((n, i) => n + i.quantity, 0),
  };
}

/**
 * Lets the Meta Pixel match the visitor (advanced matching). The pixel hashes these itself.
 * A second fbq("init") is ignored once the pixel is running, so the values are merged into the live
 * pixel's user data (verified: the next event then carries ud[em]/ud[ph]); init is the fallback.
 */
export function identify(user: UserData) {
  const w = win();
  const id = PIXEL_ID();
  if (!w?.fbq || !id || (!user.email && !user.phone && !user.externalId)) return;
  const { first, last } = splitName(user.name);
  const digits = user.phone?.replace(/\D/g, "") ?? "";
  const ud = {
    ...(user.email ? { em: user.email.trim().toLowerCase() } : {}),
    ...(digits ? { ph: digits.length === 10 ? `1${digits}` : digits } : {}),
    ...(first ? { fn: first.toLowerCase() } : {}),
    ...(last ? { ln: last.toLowerCase() } : {}),
    external_id: user.externalId || visitorId(),
  };
  const pixel = (w.fbq as Fn & { instance?: { pixelsByID?: Record<string, { userData?: Record<string, string> }> } }).instance?.pixelsByID?.[id];
  if (pixel) pixel.userData = { ...pixel.userData, ...ud };
  else w.fbq("init", id, ud);
}

/**
 * Fires one conversion event everywhere. Returns the event_id so a server-side copy can reuse it.
 * `user` adds enhanced-conversion data (email/phone) for Google Ads, Microsoft and Meta.
 */
export function track(event: string, params: Record<string, unknown> = {}, opts: { eventId?: string; user?: UserData; ecommerce?: Ecommerce } = {}) {
  const w = win();
  const event_id = opts.eventId ?? newEventId(event);
  if (!w) return event_id;
  w.dataLayer = w.dataLayer || [];
  const { user, ecommerce } = opts;
  if (ecommerce) w.dataLayer.push({ ecommerce: null });
  const { first, last } = splitName(user?.name);
  w.dataLayer.push({
    event,
    event_id,
    ...params,
    ...(ecommerce ? { ecommerce } : {}),
    ...(user
      ? {
          user_data: {
            ...(user.email ? { email: user.email.trim().toLowerCase() } : {}),
            ...(user.phone ? { phone_number: e164(user.phone) } : {}),
            ...(first ? { address: { first_name: first, last_name: last } } : {}),
          },
        }
      : {}),
  });
  // Don't let one lead's details ride along on later events.
  if (user) w.dataLayer.push({ user_data: undefined });

  gaEvent(event, { event_id, ...params, ...(ecommerce ?? {}) });
  googleAdsConversion(event, { eventId: event_id, value: ecommerce?.value ?? params.value, currency: ecommerce?.currency ?? params.currency, email: user?.email, phone: e164(user?.phone) });
  redditEvent(event, { value: ecommerce?.value ?? params.value, currency: ecommerce?.currency ?? params.currency }, event_id, user ? { email: user.email, phone: e164(user.phone), externalId: user.externalId } : undefined);

  if (CLARITY_EVENTS.has(event)) clarityEvent(event);

  uetEvent(event, { value: ecommerce?.value ?? params.value, currency: ecommerce?.currency ?? params.currency, lead_source: params.lead_source }, user);

  tiktokEvent(event, { value: ecommerce?.value ?? params.value, currency: ecommerce?.currency ?? params.currency, content_name: params.content_name, contents: ecommerce?.items.map((i) => ({ content_id: i.item_id, content_name: i.item_name, quantity: i.quantity, price: i.price })) }, event_id, user ? { email: user.email, phone: e164(user.phone), externalId: user.externalId } : undefined);

  const meta = META[event];
  if (meta && PIXEL_ID()) {
    const payload = metaParams(params, ecommerce);
    withMeta(() => {
      if (user) identify(user);
      win()?.fbq?.(meta.custom ? "trackCustom" : "track", meta.name, payload, { eventID: event_id });
    });
  }
  return event_id;
}

// The Brand Boost quiz stores who is about to book and what the call is worth, so the booked-call
// conversion carries a value and full match data even when Cal.com's payload is thin.
const CALL_KEY = "ct_call_ctx";
export type CallContext = { value: number; user: UserData };

export function setCallContext(ctx: CallContext) {
  try {
    localStorage.setItem(CALL_KEY, JSON.stringify({ ...ctx, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function callContext(): CallContext | null {
  try {
    const c = JSON.parse(localStorage.getItem(CALL_KEY) || "null");
    return c && Date.now() - c.at < 7 * 86400_000 ? { value: Number(c.value) || 0, user: c.user || {} } : null;
  } catch {
    return null;
  }
}

/** A confirmed booking, counted once per booking whether it came from the embed or the /booked redirect. */
export function trackBooked(via: string, uid?: string, user?: UserData) {
  const key = `ct_booked_${uid || "session"}`;
  try {
    if (sessionStorage.getItem(key) || (!uid && sessionStorage.getItem("ct_booked_any"))) return;
    sessionStorage.setItem(key, "1");
    sessionStorage.setItem("ct_booked_any", "1");
  } catch {
    /* storage blocked: still count it */
  }
  const ctx = callContext();
  const who = { ...ctx?.user, ...Object.fromEntries(Object.entries(user ?? {}).filter(([, v]) => v)) } as UserData;
  track("book_call", { via, value: ctx?.value ?? 0, currency: "USD", lead_source: ctx ? "brand-boost-quiz" : "cal.com" }, { eventId: uid ? `book_${uid}` : undefined, user: who.email || who.phone ? who : undefined });
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("ct:booked"));
}

// ---------------------------------------------------------------------------------------------
// Attribution: click ids + UTMs from the landing URL, kept for 90 days so leads, bookings and
// Shopify orders can be tied back to the ad that drove them.

const ATTR_KEY = "ct_attr";
const ATTR_PARAMS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type Attribution = Partial<Record<(typeof ATTR_PARAMS)[number] | "landing" | "fbp" | "fbc" | "fbi" | "ttp", string>>;

const decode = (v = "") => {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};
const cookie = (name: string) => (typeof document === "undefined" ? undefined : document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1]);

/**
 * The visitor's own IP, IPv6 first, for the Parameter Builder's _fbi cookie. The site is served over IPv4,
 * so the server only ever sees an IPv4 address, while Meta's Pixel reaches Facebook over IPv6 for most
 * phones — and Meta flags the mismatch. Asking an IPv6-only endpoint gets the same address the Pixel sends;
 * IPv4-only visitors fall back to the dual-stack one. A stored IPv6 is reused, so this runs once a day at most.
 */
const IP_LOOKUPS = ["https://api6.ipify.org", "https://api64.ipify.org"];
async function visitorIp() {
  const stored = decode(cookie("_fbi")).replace(/\.[A-Za-z0-9_-]{2,8}$/, "");
  if (stored.includes(":")) return stored;
  for (const url of IP_LOOKUPS) {
    try {
      const ip = (await (await fetch(url, { signal: AbortSignal.timeout(1500), credentials: "omit", cache: "no-store" })).text()).trim();
      if (/^[0-9a-f:.]{3,45}$/i.test(ip)) return ip;
    } catch {
      /* no IPv6 route (or blocked): try the next */
    }
  }
  return stored;
}

/** Resolves once _fbp/_fbc/_fbi are written, so server-side copies of events carry them (never rejects). */
let metaParamsDone: Promise<unknown> = Promise.resolve();

/**
 * Meta's Conversions API Parameter Builder (meta-capi-param-builder-clientjs) writes _fbp and, after an
 * ad click, _fbc in the exact format Meta scores highest (with its version appendix), plus _fbi with the
 * visitor's IPv6 address. It's loaded as a separate chunk right after the page starts, so it never weighs
 * on first paint. If it can't load, _fbc is still set by hand (fbclid untouched) so the click is not lost.
 */
function buildMetaParams(fbclid?: string) {
  metaParamsDone = import("meta-capi-param-builder-clientjs")
    .then((m) => {
      const b = ((m as { default?: unknown }).default ?? m) as { processAndCollectAllParams: (url: string | null, getIpFn?: () => Promise<string>) => Promise<unknown> };
      return b.processAndCollectAllParams(window.location.href, visitorIp);
    })
    .catch(() => {
      // Same domain scope as the builder's own cookie, so a later successful run overwrites this one instead of sitting beside it.
      const domain = /(^|\.)ceoturbo\.com$/.test(window.location.hostname) ? "; domain=.ceoturbo.com" : "";
      if (fbclid && !cookie("_fbc")) document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; max-age=${90 * 86400}; path=/; SameSite=Lax; Secure${domain}`;
    });
}

/** Waits (at most `ms`) for the Parameter Builder, so the first PageView's server copy has the IPv6 and _fbc. */
const metaParamsReady = (ms = 2500) => Promise.race([metaParamsDone, new Promise((r) => setTimeout(r, ms))]);

/** Call once per page load: stores any new click ids and builds Meta's _fbp/_fbc before the pixel loads. */
export function captureAttribution() {
  const w = win();
  if (!w) return;
  const q = new URLSearchParams(w.location.search);
  const fresh: Attribution = {};
  for (const k of ATTR_PARAMS) {
    const v = q.get(k);
    // Click ids are kept whole (Meta rejects a cut-short fbclid); only absurd lengths are dropped.
    if (v && v.length <= 1000) fresh[k] = k.endsWith("clid") || k.endsWith("braid") ? v : v.slice(0, 300);
  }
  buildMetaParams(fresh.fbclid);
  if (!Object.keys(fresh).length) return;
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify({ ...fresh, landing: w.location.pathname, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function attribution(): Attribution {
  let stored: Attribution & { at?: number } = {};
  try {
    stored = JSON.parse(localStorage.getItem(ATTR_KEY) || "{}");
    if (stored.at && Date.now() - stored.at > 90 * 86400_000) stored = {};
  } catch {
    /* ignore */
  }
  delete stored.at;
  // Sent exactly as stored: _fbc is case-sensitive and Meta wants it unmodified.
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc");
  const fbi = cookie("_fbi");
  const ttp = cookie("_ttp");
  return { ...stored, ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}), ...(fbi ? { fbi: decode(fbi) } : {}), ...(ttp ? { ttp } : {}) };
}

/** Events the server also sends to the Conversions API (same event_id, so Meta de-duplicates). */
const SERVER_COPY = new Set(["page_view", "view_item", "customize_product", "add_to_cart", "begin_checkout", "click_to_call", "click_to_text"]);

/** Server-side copy of a browser event (api/track.js). Fire-and-forget; never throws. */
export function serverTrack(event: string, eventId: string, data: { value?: number; currency?: string; contentName?: string; contentIds?: string[]; numItems?: number; user?: UserData } = {}) {
  if (typeof window === "undefined" || !SERVER_COPY.has(event)) return;
  const page = window.location.pathname + window.location.search;
  void metaParamsReady().then(() => {
    try {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ event, eventId, page, visitorId: visitorId(), attribution: attribution(), ...data }),
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  });
}

/**
 * Every tel: link counts as a phone lead and every sms: link as a text lead (click_to_text, no Google Ads call conversion): GA4/Google Ads (click_to_call), Meta "Contact"
 * (browser + Conversions API), Microsoft and TikTok. One delegated listener covers every page.
 */
export function installCallTracking() {
  const w = win();
  if (!w || (w as Win & { __ctCall?: boolean }).__ctCall) return;
  (w as Win & { __ctCall?: boolean }).__ctCall = true;
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="sms:"]') as HTMLAnchorElement | null;
      if (!a) return;
      const location = a.dataset.callLocation || "link";
      const text = a.getAttribute("href")?.startsWith("sms:");
      const event = text ? "click_to_text" : "click_to_call";
      const contentName = text ? "Text message" : "Phone call";
      const id = track(event, { location, content_name: contentName });
      serverTrack(event, id, { contentName });
    },
    { capture: true },
  );
}
