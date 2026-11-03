// Meta Conversions API: server-side copies of the browser Pixel events. Same event_id as the
// browser event, so Meta de-duplicates them and keeps whichever arrives with better match data.
// Needs META_CAPI_TOKEN (Events Manager → your pixel → Settings → Conversions API → Generate access token).
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import paramBuilder from "capi-param-builder-nodejs";

const { ParamBuilder } = paramBuilder;

export const DEFAULT_PIXEL_ID = "3232222473609236";
const GRAPH = process.env.META_GRAPH_VERSION || "v24.0";

const sha256 = (v) => createHash("sha256").update(v).digest("hex");
const clean = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Meta click/browser ids (fbc, fbp, fbclid) must reach Meta byte-for-byte: never lowercased, never cut short
 * (a truncated fbclid is reported as "modified fbclid" and loses the ad click). A value that is too long or
 * holds characters a cookie can't carry is dropped instead of trimmed.
 */
const MAX_ID = 1000;
const metaId = (v) => (typeof v === "string" && (v = v.trim()) && v.length <= MAX_ID && /^[\x21-\x7e]+$/.test(v) && !/[<>;,"\\]/.test(v) ? v : "");

/**
 * The visitor's IP as the Parameter Builder's _fbi cookie holds it ("<ip>.<appendix>"), or a bare IP.
 * The browser fills _fbi with its IPv6 address (src/lib/track.ts), the same address Meta's Pixel sees.
 */
export function cleanIp(v) {
  if (typeof v !== "string" || v.length > 100) return "";
  v = v.trim();
  if (isIP(v)) return v;
  const dot = v.lastIndexOf(".");
  return dot > 0 && isIP(v.slice(0, dot)) && /^[A-Za-z0-9_-]{2,8}$/.test(v.slice(dot + 1)) ? v : "";
}

/** Meta wants lowercase, trimmed values hashed; phones as digits with country code. */
export function hashedUser({ email, phone, name, city, externalId } = {}) {
  const out = {};
  const em = clean(email).toLowerCase();
  if (em) out.em = [sha256(em)];
  let ph = clean(phone).replace(/\D/g, "");
  if (ph.length === 10) ph = `1${ph}`;
  if (ph) out.ph = [sha256(ph)];
  const [first, ...rest] = clean(name).toLowerCase().split(/\s+/).filter(Boolean);
  if (first) out.fn = [sha256(first)];
  if (rest.length) out.ln = [sha256(rest.join(" "))];
  const ct = clean(city).toLowerCase().replace(/[^a-z]/g, "");
  if (ct) out.ct = [sha256(ct)];
  if (externalId) out.external_id = [sha256(String(externalId))];
  return out;
}

/**
 * Last-resort _fbc when only a raw fbclid is known (e.g. a booking webhook with no cookie). Built by Meta's
 * Parameter Builder so the fbclid is carried over untouched and the format matches what Meta expects.
 */
function fbcFromClickId(fbclid) {
  try {
    const builder = new ParamBuilder(["ceoturbo.com", "localhost"]);
    builder.processRequest("www.ceoturbo.com", { fbclid }, {});
    return builder.getFbc() || `fb.1.${Date.now()}.${fbclid}`;
  } catch {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
}

/** Builds one CAPI event (exported for tests). */
export function buildEvent({ eventName, eventId, eventTime, url, user, attribution = {}, ip, userAgent, customData }) {
  const fbp = metaId(attribution.fbp);
  let fbc = metaId(attribution.fbc);
  const fbclid = metaId(attribution.fbclid);
  if (!fbc && fbclid) fbc = fbcFromClickId(fbclid);
  // No request IP (e.g. a booking webhook): use the IPv6 the visitor's browser stored in _fbi.
  ip = ip && ip !== "unknown" ? ip : cleanIp(attribution.fbi);
  return {
    event_name: eventName,
    event_time: Math.floor((eventTime ? new Date(eventTime).getTime() : Date.now()) / 1000),
    ...(eventId ? { event_id: String(eventId).slice(0, 120) } : {}),
    action_source: "website",
    ...(url ? { event_source_url: url } : {}),
    user_data: {
      ...hashedUser(user),
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
      ...(ip ? { client_ip_address: ip } : {}),
      ...(userAgent ? { client_user_agent: String(userAgent).slice(0, 400) } : {}),
    },
    ...(customData ? { custom_data: customData } : {}),
  };
}

/** Sends events to Meta. Never throws; a missing token just skips (logged once per call). */
export async function sendMetaEvents(events) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID || DEFAULT_PIXEL_ID;
  if (!token) {
    console.warn("[capi] META_CAPI_TOKEN not set — server-side event skipped");
    return { sent: false };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: events, ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}) }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error("[capi] Meta responded", res.status, await res.text().catch(() => ""));
    return { sent: res.ok };
  } catch (e) {
    console.error("[capi] failed", e?.message);
    return { sent: false };
  }
}

/** Ad click ids / UTMs posted by the browser (src/lib/track.ts attribution()). */
export function cleanAttribution(a) {
  if (!a || typeof a !== "object") return {};
  const ids = { fbp: metaId(a.fbp), fbc: metaId(a.fbc), fbclid: metaId(a.fbclid), fbi: cleanIp(a.fbi) };
  const keys = ["gclid", "gbraid", "wbraid", "msclkid", "ttclid", "ttp", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "landing"];
  const rest = keys.map((k) => [k, clean(a[k], 300).replace(/[\u0000-\u001f<>]/g, "")]);
  return Object.fromEntries([...Object.entries(ids), ...rest].filter(([, v]) => v));
}

/**
 * Meta's Conversions API Parameter Builder (capi-param-builder-nodejs), run on the browser's own request:
 * reads _fbp/_fbc from the request cookies (or builds _fbc from an fbclid on the page URL in the Referer)
 * and picks the best client IP: the browser's IPv6 from the _fbi cookie first, then the request's own IP. Values are returned exactly as Meta wants them; the cookies it
 * recommends are set on the response so later events reuse the same ids. Never throws.
 */
export function requestSignals(req, res) {
  try {
    const builder = new ParamBuilder(["ceoturbo.com", "localhost"]);
    const cookies = builder.processRequestFromContext(req) || [];
    if (res && cookies.length) {
      res.setHeader(
        "Set-Cookie",
        cookies.map((c) => `${c.name}=${c.value}; Max-Age=${c.maxAge}; Path=/; SameSite=Lax; Secure${c.domain && !/localhost/.test(c.domain) ? `; Domain=${c.domain}` : ""}`),
      );
    }
    return { fbp: builder.getFbp() || "", fbc: builder.getFbc() || "", ip: builder.getClientIpAddress() || "" };
  } catch (e) {
    console.warn("[capi] param builder failed", e?.message);
    return { fbp: "", fbc: "", ip: "" };
  }
}

/**
 * Browser-posted attribution merged with the Parameter Builder's values. The builder's fbc wins: it already
 * reconciles the _fbc cookie with the fbclid on the page URL, whereas the browser may post a stale cookie
 * from an older ad click before its own builder has refreshed it. Either way the fbclid is never edited.
 */
export function withSignals(attr, signals) {
  return { ...attr, ...(attr.fbp ? {} : signals.fbp ? { fbp: signals.fbp } : {}), ...(signals.fbc ? { fbc: signals.fbc } : {}) };
}
