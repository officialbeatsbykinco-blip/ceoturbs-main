import { afterEach, describe, expect, it, vi } from "vitest";

type Win = Window & { oaiq?: { q: unknown[][] } };

describe("ChatGPT ads pixel", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    delete (window as Win).oaiq;
    document.head.querySelectorAll('script[src*="bzrcdn.openai.com"]').forEach((s) => s.remove());
  });

  it("does nothing without a pixel id", async () => {
    vi.stubEnv("VITE_OPENAI_PIXEL_ID", "");
    const { openAiEvent, startOpenAiPixel } = await import("@/lib/openai-ads");
    startOpenAiPixel();
    openAiEvent("generate_lead", {}, "e1");
    expect((window as Win).oaiq).toBeUndefined();
  });

  it("sends real leads and sales with our event id, and skips non-leads", async () => {
    vi.stubEnv("VITE_OPENAI_PIXEL_ID", "px_test123");
    const { openAiEvent } = await import("@/lib/openai-ads");
    openAiEvent("click_to_call", {}, "call_1");
    openAiEvent("book_call", {}, "book_1");
    openAiEvent("purchase", { value: 25.99, currency: "USD" }, "order_1");
    openAiEvent("contact_intent", {}, "desk_1");
    openAiEvent("booking_open", {}, "open_1");
    const q = (window as Win).oaiq!.q;
    expect(q[0]).toEqual(["init", { pixelId: "px_test123" }]);
    expect(q.slice(1)).toEqual([
      ["measure", "lead_created", { type: "customer_action" }, { event_id: "call_1" }],
      ["measure", "appointment_scheduled", { type: "customer_action" }, { event_id: "book_1" }],
      ["measure", "lead_created", { type: "customer_action" }, { event_id: "book_1_lead_created" }],
      ["measure", "order_created", { type: "contents", amount: 2599, currency: "USD" }, { event_id: "order_1" }],
    ]);
    expect(document.head.querySelectorAll('script[src="https://bzrcdn.openai.com/sdk/oaiq.min.js"]').length).toBe(1);
  });
});
