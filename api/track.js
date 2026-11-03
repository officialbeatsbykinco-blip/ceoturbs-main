// POST /api/track — server-side (Conversions API) copies of browser events, sent with the same event_id
// as the Pixel so Meta de-duplicates them: PageView, ViewContent / AddToCart / InitiateCheckout (review
// card and shirt shops), CustomizeProduct (shirt designer) and Contact (tap-to-call). Raises Meta's "events covered by Conversions API" rate. Leads, bookings and purchases have their own server paths (api/lead.js, api/audit.js,
// api/cal-webhook.js, Shopify's Facebook & Instagram app).
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { buildEvent, cleanAttribution, requestSignals, sendMetaEvents, withSignals } from "./_lib/meta-capi.js";

const EVENTS = { page_view: "PageView", view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", customize_product: "CustomizeProduct", click_to_call: "Contact", click_to_text: "Contact" };
const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

/** Validated CAPI custom_data for an allowed event, or null (exported for tests). */
export function trackPayload(body) {
  const eventName = EVENTS[body?.event];
  if (!eventName) return null;
  const value = Number(body.value);
  const ids = Array.isArray(body.contentIds) ? body.contentIds.slice(0, 10).map((x) => text(x, 60)).filter(Boolean) : [];
  return {
    eventName,
    customData: {
      ...(text(body.contentName, 120) ? { content_name: text(body.contentName, 120) } : {}),
      ...(value > 0 ? { value: Math.min(value, 10000), currency: text(body.currency, 3).toUpperCase() || "USD" } : {}),
      ...(ids.length ? { content_ids: ids, content_type: "product" } : {}),
      ...(Number(body.numItems) > 0 ? { num_items: Math.min(Number(body.numItems), 1000) } : {}),
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (!isJson(req)) return send(res, 415, { error: "content-type" });
  if (rateLimited(`track:${clientIp(req)}`, 150, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req, 5_000);
  } catch {
    return send(res, 400, { error: "body" });
  }
  const p = trackPayload(body);
  const eventId = text(body.eventId, 120);
  if (!p || !eventId) return send(res, 400, { error: "event" });

  const signals = requestSignals(req, res);
  const attr = withSignals(cleanAttribution(body.attribution), signals);
  const meta = await sendMetaEvents([
    buildEvent({
      eventName: p.eventName,
      eventId,
      url: `https://www.ceoturbo.com${text(body.page, 600).replace(/^(?!\/)/, "/") || "/"}`,
      user: { externalId: text(body.visitorId, 60) || undefined },
      attribution: attr,
      ip: signals.ip || clientIp(req),
      userAgent: req.headers["user-agent"],
      customData: p.customData,
    }),
  ]);
  return send(res, 200, { ok: true, meta: !!meta.sent });
}
