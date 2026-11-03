// TikTok Events API: server-side copies of the browser TikTok Pixel events (src/lib/tiktok.ts), sent with
// the same event_id so TikTok de-duplicates them. Off until TIKTOK_PIXEL_ID (or VITE_TIKTOK_PIXEL_ID) and
// TIKTOK_ACCESS_TOKEN are set (TikTok Ads Manager → Tools → Events → your pixel → Settings → Generate access token).
import { createHash } from "node:crypto";

const sha256 = (v) => createHash("sha256").update(v).digest("hex");
const clean = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Builds one Events API 1.3 web event (exported for tests). */
export function buildTiktokEvent({ event, eventId, eventTime, url, user = {}, attribution = {}, ip, userAgent, properties }) {
  const email = clean(user.email).toLowerCase();
  let phone = clean(user.phone).replace(/\D/g, "");
  if (phone.length === 10) phone = `1${phone}`;
  const ttclid = clean(attribution.ttclid, 500);
  const ttp = clean(attribution.ttp, 200);
  return {
    event,
    event_time: Math.floor((eventTime ? new Date(eventTime).getTime() : Date.now()) / 1000),
    ...(eventId ? { event_id: String(eventId).slice(0, 120) } : {}),
    user: {
      ...(email ? { email: sha256(email) } : {}),
      ...(phone ? { phone: sha256(`+${phone}`) } : {}),
      ...(user.externalId ? { external_id: sha256(String(user.externalId)) } : {}),
      ...(ttclid ? { ttclid } : {}),
      ...(ttp ? { ttp } : {}),
      ...(ip && ip !== "unknown" ? { ip } : {}),
      ...(userAgent ? { user_agent: String(userAgent).slice(0, 400) } : {}),
    },
    ...(url ? { page: { url } } : {}),
    ...(properties ? { properties } : {}),
  };
}

/** Sends events to TikTok. Never throws; missing credentials just skip. */
export async function sendTiktokEvents(events) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  const pixel = process.env.TIKTOK_PIXEL_ID || process.env.VITE_TIKTOK_PIXEL_ID;
  if (!token || !pixel) return { sent: false };
  try {
    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Token": token },
      body: JSON.stringify({ event_source: "web", event_source_id: pixel, data: events, ...(process.env.TIKTOK_TEST_EVENT_CODE ? { test_event_code: process.env.TIKTOK_TEST_EVENT_CODE } : {}) }),
      signal: AbortSignal.timeout(6000),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.code !== 0) console.error("[tiktok] responded", res.status, JSON.stringify(json).slice(0, 300));
    return { sent: res.ok && json.code === 0 };
  } catch (e) {
    console.error("[tiktok] failed", e?.message);
    return { sent: false };
  }
}
