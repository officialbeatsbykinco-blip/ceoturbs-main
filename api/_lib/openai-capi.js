// OpenAI (ChatGPT ads) Conversions API: server-side copies of the browser pixel's lead events
// (src/lib/openai-ads.ts), sent with the same event id so OpenAI de-duplicates them (Pixel ID + event type + id).
// Catches the leads an ad blocker or iOS hides from the browser pixel. Off until OPENAI_CAPI_KEY is set
// (Ads Manager → Conversions → Conversion keys → Create new key). The Pixel ID comes from VITE_OPENAI_PIXEL_ID.
// Docs: https://developers.openai.com/ads/conversions-api.md
import { createHash } from "node:crypto";

const sha256 = (v) => createHash("sha256").update(v, "utf8").digest("hex");
const clean = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** OpenAI's ids (the __oppref click id, the __obref browser id) go through untouched: printable, no cookie-breaking characters. */
export const openAiId = (v) => (typeof v === "string" && (v = v.trim()) && v.length <= 1000 && /^[\x21-\x7e]+$/.test(v) && !/[<>;,"\\]/.test(v) ? v : "");

/** A cookie value from the request (the pixel's own first-party cookies ride along on same-origin posts). */
export function readCookie(req, name) {
  const header = String(req?.headers?.cookie ?? "");
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return part.slice(i + 1).trim();
      }
    }
  }
  return "";
}

/** OpenAI's phone rule: digits only, country code kept, no "+" or leading zeros (10-digit US numbers get the 1). */
export function normalizePhone(phone) {
  let d = clean(phone, 30).replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 10) d = `1${d}`;
  return d.length >= 8 && d.length <= 15 ? d : "";
}

/** Lowercased, whitespace and ASCII punctuation removed (OpenAI's name rule). */
const normalizeName = (v) => clean(v, 80).toLowerCase().replace(/[\s!-/:-@[-`{-~]/g, "");

/** Builds one server event (exported for tests). type: lead_created | appointment_scheduled | order_created. */
export function buildOpenAiEvent({ type, id, eventTime, url, user = {}, attribution = {}, ip, userAgent, amount, currency }) {
  const t = eventTime ? new Date(eventTime).getTime() : Date.now();
  const email = clean(user.email, 200).toLowerCase();
  const phone = normalizePhone(user.phone);
  const [first, ...rest] = clean(user.name, 100).split(/\s+/);
  const firstName = normalizeName(first);
  const lastName = normalizeName(rest.join(" "));
  const zip = clean(user.zip, 10).replace(/\D/g, "").slice(0, 5);
  const oppref = openAiId(attribution.oppref);
  const obref = openAiId(attribution.obref);
  const ipAddress = ip && ip !== "unknown" ? clean(ip, 60) : "";
  const cents = Math.round((Number(amount) || 0) * 100);
  return {
    id: clean(String(id ?? ""), 120),
    type,
    timestamp_ms: Number.isFinite(t) ? Math.min(t, Date.now()) : Date.now(),
    ...(oppref ? { oppref } : {}),
    source_url: url || "https://www.ceoturbo.com/",
    action_source: "web",
    user: {
      ...(obref ? { obref } : {}),
      ...(email ? { emails_sha256: [sha256(email)] } : {}),
      ...(phone ? { phone_numbers_sha256: [sha256(phone)] } : {}),
      ...(user.externalId ? { external_ids_sha256: [sha256(String(user.externalId).trim())] } : {}),
      ...(firstName ? { first_names_sha256: [sha256(firstName)] } : {}),
      ...(lastName ? { last_names_sha256: [sha256(lastName)] } : {}),
      ...(zip ? { postal_codes: [zip] } : {}),
      countries: [clean(user.country, 2).toUpperCase() || "US"],
      ...(ipAddress ? { ip_address: ipAddress } : {}),
      ...(userAgent ? { user_agent: String(userAgent).slice(0, 400) } : {}),
    },
    data:
      type === "order_created"
        ? { type: "contents", amount: cents, currency: currency || "USD" }
        : { type: "customer_action" },
  };
}

/** Sends events to OpenAI. Never throws; a missing key or Pixel ID just skips. Events without an id are dropped. */
export async function sendOpenAiEvents(events) {
  const key = process.env.OPENAI_CAPI_KEY;
  const pixel = process.env.OPENAI_PIXEL_ID || process.env.VITE_OPENAI_PIXEL_ID;
  const batch = events.filter((e) => e && e.id);
  if (!key || !pixel || !batch.length) return { sent: false };
  try {
    const res = await fetch(`https://bzr.openai.com/v1/events?pid=${encodeURIComponent(pixel)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ integration_source: "ceoturbo-site", events: batch }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error("[openai-capi] responded", res.status, (await res.text().catch(() => "")).slice(0, 300));
    return { sent: res.ok };
  } catch (e) {
    console.error("[openai-capi] failed", e?.message);
    return { sent: false };
  }
}

/** The click/browser ids for a same-origin request: posted attribution first, then the pixel's cookies. */
export const openAiAttribution = (attr, req) => ({
  oppref: openAiId(attr?.oppref) || openAiId(readCookie(req, "__oppref")),
  obref: openAiId(attr?.obref) || openAiId(readCookie(req, "__obref")),
});
