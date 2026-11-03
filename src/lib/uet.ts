// Microsoft Advertising UET tag (Bing / Microsoft Ads conversions). Loaded from code (not GTM custom
// HTML) so the CSP can keep blocking inline scripts. The tag id is built in; VITE_UET_TAG_ID
// overrides it. No cookie banner (US audience), so consent is granted up front.
type Uetq = unknown[] & { push: (...a: unknown[]) => void };
export const DEFAULT_UET_TAG_ID = "187280408";
const override = import.meta.env.VITE_UET_TAG_ID as string | undefined;
// An override must be a numeric UET tag id; anything else is ignored so it can never break the tag.
const TAG_ID = override && /^\d{6,12}$/.test(override.trim()) ? override.trim() : DEFAULT_UET_TAG_ID;
let started = false;

/** The queue, with consent granted as its FIRST entry (Microsoft wants it before pageLoad and any event). */
function queue() {
  const w = window as unknown as { uetq?: Uetq };
  if (!w.uetq) {
    w.uetq = [] as unknown as Uetq;
    w.uetq.push("consent", "default", { ad_storage: "granted" });
  }
  return w.uetq;
}

export function startUet() {
  if (!TAG_ID || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { uetq?: Uetq; UET?: new (o: object) => Uetq };
  queue();
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://bat.bing.net/bat.js?ti=${encodeURIComponent(TAG_ID)}`;
  s.onload = () => {
    if (!w.UET) return;
    const queued = w.uetq;
    const o = new w.UET({ ti: TAG_ID, enableAutoSpaTracking: true, q: queued });
    w.uetq = o;
    o.push("pageLoad");
  };
  document.head.appendChild(s);
}

/** Microsoft's recommended event names, so goals can be set up as "Event action equals …". */
const ACTIONS: Record<string, string> = {
  generate_lead: "submit_lead_form",
  book_call: "book_appointment",
  add_to_cart: "add_to_cart",
  begin_checkout: "begin_checkout",
  view_item: "view_item",
  customize_product: "customize_product",
  click_to_call: "contact",
  click_to_text: "contact",
};

/** Microsoft wants phones in E.164 (+14045550123). */
const e164Phone = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.length === 10 ? `+1${d}` : `+${d}`;
};

export function uetEvent(event: string, params: { value?: unknown; currency?: unknown; lead_source?: unknown }, user?: { email?: string; phone?: string }) {
  const action = ACTIONS[event];
  if (!action || typeof window === "undefined") return;
  const uetq = queue();
  // Enhanced conversions: UET hashes these before sending.
  if (user?.email || user?.phone) uetq.push("set", { pid: { ...(user.email ? { em: user.email.trim().toLowerCase() } : {}), ...(user.phone ? { ph: e164Phone(user.phone) } : {}) } });
  uetq.push("event", action, {
    event_category: event === "click_to_call" || event === "click_to_text" ? "phone" : event === "book_call" || event === "generate_lead" ? "lead" : "ecommerce",
    ...(typeof params.lead_source === "string" ? { event_label: params.lead_source } : {}),
    ...(typeof params.value === "number" && params.value > 0 ? { revenue_value: params.value, currency: params.currency || "USD" } : {}),
  });
}
