// ChatGPT ads (OpenAI Ads) measurement pixel. Off until VITE_OPENAI_PIXEL_ID is set in Vercel (Ads Manager →
// Conversions → Web Pixel → Pixel ID), then redeploy. Loaded from code (not an inline <script>) so the CSP can
// keep blocking inline scripts. The pixel reads the `oppref` click id from the landing URL into a first-party
// cookie by itself, so an ad click arriving with ?oppref= starts it at once (before the visitor can navigate
// away from that URL); everyone else gets it with the other ad tags on first interaction.
// Docs: https://developers.openai.com/ads/measurement-pixel.md
type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] };

const raw = import.meta.env.VITE_OPENAI_PIXEL_ID as string | undefined;
const PIXEL_ID = raw && /^[a-z0-9_-]{4,}$/i.test(raw.trim()) ? raw.trim() : undefined;
let started = false;

/** dataLayer event → OpenAI standard event. Only real leads and sales, so ChatGPT learns to buy those. */
const EVENTS: Record<string, "lead_created" | "appointment_scheduled" | "order_created"> = {
  generate_lead: "lead_created",
  // Call/text taps are only sent as these events from phones (a desktop click is contact_intent).
  click_to_call: "lead_created",
  click_to_text: "lead_created",
  book_call: "appointment_scheduled",
  purchase: "order_created",
};

const win = () => (typeof window === "undefined" ? null : (window as unknown as { oaiq?: Oaiq }));

/** The official loader snippet, minus the inline <script>. */
export function startOpenAiPixel() {
  const w = win();
  if (!PIXEL_ID || started || !w) return;
  started = true;
  if (!w.oaiq) {
    const q: Oaiq = (...args: unknown[]) => void q.q!.push(args);
    q.q = [];
    w.oaiq = q;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
    document.head.appendChild(s);
  }
  w.oaiq("init", { pixelId: PIXEL_ID });
}

/** A ChatGPT ad click: start now, while ?oppref= is still in the address bar. */
export function startOpenAiPixelIfAdClick() {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("oppref")) startOpenAiPixel();
}

/** Fires the matching OpenAI event with our event_id, so a later Conversions API copy is de-duplicated. */
export function openAiEvent(event: string, params: { value?: unknown; currency?: unknown }, eventId: string) {
  const name = EVENTS[event];
  if (!PIXEL_ID || !name) return;
  // Queued calls replay once the SDK loads, so an event before the first tap is kept, not lost.
  if (!started) startOpenAiPixel();
  const data =
    name === "order_created"
      ? { type: "contents", amount: Math.round((Number(params.value) || 0) * 100), currency: typeof params.currency === "string" ? params.currency : "USD" }
      : { type: "customer_action" };
  win()?.oaiq?.("measure", name, data, { event_id: eventId });
}
