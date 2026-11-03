// Shopify → Settings → Customer events → Add custom pixel → name "CEO Turbo — Google & Microsoft purchase"
// Paste this whole file, fill in the 4 ids, Save, then Connect.
// Permission: "Not required" (or "Marketing" if you run a cookie banner). Data sale: "Data collected does not qualify".
//
// Sends the PURCHASE to GA4, Google Ads (with enhanced conversions) and Microsoft Ads UET.
// Meta purchases come from the "Facebook & Instagram" app (Pixel + Conversions API) — do NOT add Meta here,
// or purchases are counted twice.

const GA4_ID = "G-XDWPSVBW53"; // GA4 → Admin → Data streams → Measurement ID
const ADS_ID = "AW-18468746701"; // Google Ads → Goals → Conversions → Purchase → Tag setup → "AW-…"
const ADS_PURCHASE_LABEL = "sOe0CJiH55odEM3ryuZE"; // the part after the slash in send_to "AW-…/LABEL"
const UET_ID = "187280408"; // Microsoft Ads → Tools → UET tag → Tag ID

// --- Google tag ---------------------------------------------------------------------------
const gs = document.createElement("script");
gs.async = true;
gs.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
document.head.appendChild(gs);
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", GA4_ID, { send_page_view: false });
gtag("config", ADS_ID, { allow_enhanced_conversions: true });

// --- Microsoft UET --------------------------------------------------------------------------
window.uetq = window.uetq || [];
window.uetq.push("consent", "default", { ad_storage: "granted" }); // no cookie banner: consent granted up front
const us = document.createElement("script");
us.async = true;
us.src = `https://bat.bing.net/bat.js?ti=${UET_ID}`;
us.onload = () => {
  const o = { ti: UET_ID, enableAutoSpaTracking: false, q: window.uetq };
  window.uetq = new window.UET(o);
  window.uetq.push("pageLoad");
};
document.head.appendChild(us);

const num = (m) => (m && m.amount != null ? Number(m.amount) : 0);
const digits = (p) => (p ? String(p).replace(/[^\d+]/g, "") : undefined);

analytics.subscribe("checkout_completed", (event) => {
  const c = event.data.checkout;
  const orderId = (c.order && c.order.id) || c.token;
  const value = num(c.totalPrice);
  const currency = c.currencyCode || "USD";
  const items = (c.lineItems || []).map((li) => ({
    // SKU = the id used on ceoturbo.com and in the Merchant feed (CT-NFC-REVIEW-1 / -2 / -5)
    item_id: (li.variant && (li.variant.sku || li.variant.id)) || li.id,
    item_name: li.title,
    item_variant: li.variant && li.variant.title,
    price: num(li.variant && li.variant.price),
    quantity: li.quantity,
  }));
  const bill = c.billingAddress || c.shippingAddress || {};
  const phone = digits(c.phone || bill.phone);

  // Enhanced conversions (Google hashes these in the browser before sending)
  gtag("set", "user_data", {
    email: c.email,
    ...(phone ? { phone_number: phone } : {}),
    address: { first_name: bill.firstName, last_name: bill.lastName, street: bill.address1, city: bill.city, region: bill.provinceCode, postal_code: bill.zip, country: bill.countryCode },
  });

  gtag("event", "purchase", {
    send_to: GA4_ID,
    transaction_id: orderId,
    value,
    currency,
    tax: num(c.totalTax),
    shipping: num(c.shippingLine && c.shippingLine.price),
    items,
  });
  gtag("event", "conversion", { send_to: `${ADS_ID}/${ADS_PURCHASE_LABEL}`, value, currency, transaction_id: orderId });

  const msPhone = phone ? (phone.startsWith("+") ? phone : phone.length === 10 ? `+1${phone}` : `+${phone}`) : undefined; // E.164
  window.uetq.push("set", { pid: { ...(c.email ? { em: String(c.email).trim().toLowerCase() } : {}), ...(msPhone ? { ph: msPhone } : {}) } });
  window.uetq.push("event", "purchase", { revenue_value: value, currency, transaction_id: orderId });
});

// Funnel step for GA4 (optional but useful): checkout opened on Shopify.
analytics.subscribe("checkout_started", (event) => {
  const c = event.data.checkout;
  gtag("event", "begin_checkout", { send_to: GA4_ID, value: num(c.totalPrice), currency: c.currencyCode || "USD" });
});
