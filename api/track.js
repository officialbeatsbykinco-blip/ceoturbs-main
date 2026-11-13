// POST /api/track — server-side (Conversions API) copies of browser events, sent with the same event_id
// as the Pixel so Meta de-duplicates them: PageView, ViewContent / AddToCart / InitiateCheckout (review
// card and shirt shops), CustomizeProduct (shirt designer) and Contact (tap-to-call / tap-to-text, also filed on the lead sheet). Raises Meta's "events covered by Conversions API" rate. Leads, bookings and purchases have their own server paths (api/lead.js, api/audit.js,
// api/cal-webhook.js, Shopify's Facebook & Instagram app).
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { forwardLead } from "./_lib/leads.js";
import { buildEvent, cleanAttribution, requestSignals, sendMetaEvents, withSignals } from "./_lib/meta-capi.js";

const EVENTS = {
  page_view: "PageView",
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  customize_product: "CustomizeProduct",
  click_to_call: "Contact",
  click_to_text: "Contact",
};
const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

/**
 * The lead-sheet row for a real Call / Text tap on a phone (exported for tests). Google Ads counts these taps
 * as "Contact" conversions, but a tap carries no name or message, so without this row the conversion had
 * nothing to match in the sheet. The click ids (gclid…) and UTMs show which ad it came from.
 */
export function tapRecord(body, attr, eventId) {
  const call = body?.event === "click_to_call";
  if (!call && body?.event !== "click_to_text") return null;
  return {
    type: "phone-tap",
    name: "",
    service: call ? "Call tap" : "Text tap",
    note: `${call ? "Tapped Call" : "Tapped Text"} (button: ${text(body.location, 60) || "link"}). Check your phone's call log / texts at this time — the tap alone doesn't mean they went through with it.`,
    page: text(body.page, 120),
    eventId,
    ...attr,
  };
}

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
      ...(text(body.contentCategory, 60) ? { content_category: text(body.contentCategory, 60) } : {}),
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
  const events = [
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
  ];
  // A real call/text tap on a phone is a lead too (same event as the browser's Lead, id + "_lead").
  if (body.event === "click_to_call" || body.event === "click_to_text") {
    events.push(
      buildEvent({
        eventName: "Lead",
        eventId: `${eventId}_lead`,
        url: `https://www.ceoturbo.com${text(body.page, 600).replace(/^(?!\/)/, "/") || "/"}`,
        user: { externalId: text(body.visitorId, 60) || undefined },
        attribution: attr,
        ip: signals.ip || clientIp(req),
        userAgent: req.headers["user-agent"],
        customData: {
          ...p.customData,
          lead_source: body.event || "contact",
        },
      }),
    );
  }
  const testCode = body.testEventCode || body.attribution?.test_event_code;
  // Sheet row for call/text taps; a tighter per-visitor limit keeps a bot from flooding the sheet.
  const tap = tapRecord(body, attr, eventId);
  const sheet = tap && !rateLimited(`tap:${clientIp(req)}`, 6, 10 * 60_000) ? forwardLead(tap) : null;
  const [meta] = await Promise.all([sendMetaEvents(events, testCode), sheet]);
  return send(res, 200, { ok: true, meta: !!meta.sent });
}
