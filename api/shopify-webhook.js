// POST /api/shopify-webhook — Shopify → "Order payment" webhook.
// Adds every paid order (with the ad click ids and UTMs the site attached to the cart) to the leads
// Google Sheet: review cards on the "Card Orders" tab, custom shirts on "Shirt Orders" with their
// Design ID, sizes and print file link (the Apps Script marks the design row Paid).
// Server-side Purchase (Meta Conversions API + TikTok Events API) is OFF by default because Shopify's
// Facebook & Instagram app already sends Meta's Purchase and both would count. If that app is not sending
// Purchase (Events Manager shows none), set SERVER_PURCHASE_EVENTS=true in Vercel and this endpoint sends it
// instead, with event_id "purchase_<orderId>" so a retry or a second copy is de-duplicated.
// Setup: Shopify admin → Settings → Notifications → Webhooks → Create webhook:
//   Event "Order payment", format JSON, URL https://www.ceoturbo.com/api/shopify-webhook,
//   then copy the "signing secret" shown at the top of that page into Vercel as SHOPIFY_WEBHOOK_SECRET.
import { createHmac, timingSafeEqual } from "node:crypto";
import { send } from "./_lib/http.js";
import { forwardLead } from "./_lib/leads.js";
import { buildEvent, sendMetaEvents } from "./_lib/meta-capi.js";
import { buildTiktokEvent, sendTiktokEvents } from "./_lib/tiktok-events.js";

const SITE_URL = "https://www.ceoturbo.com";

async function readRaw(req, limit = 500_000) {
  let raw = "";
  if (!req.readableEnded) {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > limit) throw new Error("too-large");
    }
  }
  if (raw) return raw;
  if (typeof req.body === "string") return req.body;
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);
  return "";
}

/** Shopify signs the raw body: x-shopify-hmac-sha256 = base64 HMAC-SHA256(secret, body). */
export function validSignature(raw, signature, secret) {
  if (!secret || typeof signature !== "string") return false;
  const expected = createHmac("sha256", secret).update(raw).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

const str = (v, max = 200) => (v === null || v === undefined ? "" : String(v).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max));

/** Turns a Shopify order into the sheet record. */
export function parseOrder(o) {
  const ship = o.shipping_address ?? {};
  const bill = o.billing_address ?? {};
  const cust = o.customer ?? {};
  const notes = Object.fromEntries((Array.isArray(o.note_attributes) ? o.note_attributes : []).map((n) => [str(n?.name, 60), str(n?.value, 300)]));
  const items = (Array.isArray(o.line_items) ? o.line_items : []).map((li) => `${li.quantity || 1} x ${str(li.title, 80)}${li.variant_title ? ` (${str(li.variant_title, 60)})` : ""}`);
  const qty = (Array.isArray(o.line_items) ? o.line_items : []).reduce((n, li) => n + (Number(li.quantity) || 0), 0);
  const name = str(ship.name || bill.name || [cust.first_name, cust.last_name].filter(Boolean).join(" "), 100);
  // Custom shirts: every cart line carries the design's properties (Design ID, Print file…), see src/lib/shopify.ts.
  const lines = Array.isArray(o.line_items) ? o.line_items : [];
  const props = (li) => Object.fromEntries((Array.isArray(li?.properties) ? li.properties : []).map((p) => [str(p?.name, 60), str(p?.value, 300)]));
  const shirtLines = lines.filter((li) => props(li)["Design ID"] || /company t-shirt|artist merch/i.test(String(li?.title || "")));
  const design = shirtLines.length ? props(shirtLines[0]) : {};
  // The full address: shirts are dropshipped, so this is what gets pasted into the print partner's order.
  const shipTo = [ship.address1, ship.address2, ship.city, ship.province_code, ship.zip, ship.country_code].map((x) => str(x, 80)).filter(Boolean).join(", ");
  return {
    type: shirtLines.length ? "shirt-order" : "shopify-order",
    ...(shirtLines.length
      ? {
          designId: design["Design ID"] || notes["Design ID"] || "",
          kind: /^AM-/.test(design["Design ID"] || notes["Design ID"] || "") || shirtLines.some((li) => /artist merch/i.test(String(li?.title || ""))) ? "Artist merch" : "Company shirt",
          printFile: design["Print file"] || "",
          placement: design.Placement || "",
          frontText: design["Front text"] || "",
          backText: design["Back text"] || "",
          // "Short sleeve – Front / Black / L × 3; …" — what to submit to the print partner.
          sizes: shirtLines.map((li) => `${str(li.variant_title, 80) || str(li.title, 80)} × ${Number(li.quantity) || 1}`).join("; "),
        }
      : {}),
    orderId: str(o.id, 40),
    orderNumber: str(o.name || o.order_number, 20),
    name,
    email: str(o.email || o.contact_email || cust.email, 200).toLowerCase(),
    phone: str(o.phone || ship.phone || bill.phone || cust.phone, 30),
    business: notes["Business name"] || notes["Artist name"] || str(ship.company || bill.company, 140),
    items: items.join("; "),
    quantity: qty,
    total: `${str(o.total_price, 20)} ${str(o.currency, 5)}`.trim(),
    paymentStatus: str(o.financial_status, 30),
    shipTo,
    pack: notes.Pack || "",
    note: str(o.note, 500),
    page: notes.Landing ? "" : str(o.landing_site, 120),
    landing: notes.Landing || "",
    utm_source: notes.utm_source || "",
    utm_medium: notes.utm_medium || "",
    utm_campaign: notes.utm_campaign || "",
    utm_content: notes.utm_content || "",
    utm_term: notes.utm_term || "",
    gclid: notes.gclid || "",
    msclkid: notes.msclkid || "",
    fbclid: notes.fbclid || "",
  };
}

/**
 * One paid order → the Meta and TikTok server events (exported for tests).
 * Click ids and the browser's _fbp/_fbc come from the cart attributes the site attached (src/lib/shopify.ts).
 */
export function buildPurchaseEvents(o) {
  const notes = Object.fromEntries((Array.isArray(o.note_attributes) ? o.note_attributes : []).map((n) => [str(n?.name, 60), str(n?.value, 300)]));
  const ship = o.shipping_address ?? {};
  const bill = o.billing_address ?? {};
  const cust = o.customer ?? {};
  const lines = Array.isArray(o.line_items) ? o.line_items : [];
  const value = Number(o.total_price) || 0;
  const currency = str(o.currency, 5) || "USD";
  const ids = lines.map((li) => str(li.sku || li.variant_id || li.product_id, 80)).filter(Boolean);
  const contents = lines.map((li) => ({ id: str(li.sku || li.variant_id || li.product_id, 80), quantity: Number(li.quantity) || 1, item_price: Number(li.price) || 0 }));
  const eventId = `purchase_${str(o.id, 40)}`;
  const eventTime = o.processed_at || o.created_at;
  const user = {
    email: str(o.email || o.contact_email || cust.email, 200),
    phone: str(o.phone || ship.phone || bill.phone || cust.phone, 30),
    name: str(ship.name || bill.name || [cust.first_name, cust.last_name].filter(Boolean).join(" "), 100),
    city: str(ship.city || bill.city, 80),
    externalId: str(cust.id, 40),
  };
  const attribution = { fbp: notes._fbp, fbc: notes._fbc, fbclid: notes.fbclid, ttclid: notes.ttclid, ttp: notes.ttp };
  const ip = str(o.client_details?.browser_ip, 60);
  const userAgent = str(o.client_details?.user_agent, 400);
  const url = `${SITE_URL}${notes.Landing && notes.Landing.startsWith("/") ? notes.Landing : "/google-review-cards"}`;
  return {
    meta: buildEvent({ eventName: "Purchase", eventId, eventTime, url, user, attribution, ip, userAgent, customData: { value, currency, content_type: "product", content_ids: ids, contents, num_items: lines.reduce((n, li) => n + (Number(li.quantity) || 0), 0), order_id: str(o.id, 40) } }),
    tiktok: buildTiktokEvent({ event: "Purchase", eventId, eventTime, url, user, attribution, ip, userAgent, properties: { value, currency, content_type: "product", contents: contents.map((c) => ({ content_id: c.id, quantity: c.quantity, price: c.item_price })) } }),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  let raw;
  try {
    raw = await readRaw(req);
  } catch {
    return send(res, 413, { error: "body" });
  }
  if (!validSignature(raw, req.headers["x-shopify-hmac-sha256"], process.env.SHOPIFY_WEBHOOK_SECRET)) return send(res, 401, { error: "signature" });

  let order;
  try {
    order = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: "json" });
  }
  if (!order || typeof order !== "object" || !order.id) return send(res, 200, { ok: true, ignored: "no-order" });

  const { stored } = await forwardLead(parseOrder(order));
  // Shopify retries non-2xx responses, and the sheet de-duplicates by Order ID, so a failed save is retried.
  if (!stored) return send(res, 502, { error: "sheet" });

  // Only a paid order is a purchase. Never throws: ad-platform trouble must not make Shopify retry the webhook.
  if (process.env.SERVER_PURCHASE_EVENTS === "true" && /^(paid|partially_paid)$/.test(String(order.financial_status || "paid"))) {
    try {
      const ev = buildPurchaseEvents(order);
      await Promise.all([sendMetaEvents([ev.meta]), sendTiktokEvents([ev.tiktok])]);
    } catch (e) {
      console.error("[purchase] failed", e?.message);
    }
  }
  return send(res, 200, { ok: true });
}
