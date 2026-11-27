// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { buildOpenAiEvent, normalizePhone, openAiAttribution, readCookie, sendOpenAiEvents } from "../../api/_lib/openai-capi.js";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

describe("OpenAI Conversions API", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("normalizes phones the way OpenAI documents (digits, country code, no +)", () => {
    expect(normalizePhone("(813) 555-0100")).toBe("18135550100");
    expect(normalizePhone("+1 415 555 2671")).toBe("14155552671");
    expect(normalizePhone("123")).toBe("");
  });

  it("builds a lead with hashed contact data, raw ids and the same id as the browser pixel", () => {
    const e = buildOpenAiEvent({
      type: "lead_created",
      id: "click_to_call_abc",
      eventTime: "2026-11-27T15:00:00Z",
      url: "https://www.ceoturbo.com/computer-repair-tampa",
      user: { email: " Pat@Example.com ", phone: "813-555-0100", name: "Pat O'Neil", zip: "33602", externalId: "v_1" },
      attribution: { oppref: "op_123", obref: "ob_456" },
      ip: "203.0.113.1",
      userAgent: "Mozilla/5.0",
    });
    expect(e).toMatchObject({ id: "click_to_call_abc", type: "lead_created", oppref: "op_123", action_source: "web", source_url: "https://www.ceoturbo.com/computer-repair-tampa", data: { type: "customer_action" } });
    expect(e.timestamp_ms).toBe(Date.parse("2026-11-27T15:00:00Z"));
    expect(e.user).toEqual({
      obref: "ob_456",
      emails_sha256: [sha("pat@example.com")],
      phone_numbers_sha256: [sha("18135550100")],
      external_ids_sha256: [sha("v_1")],
      first_names_sha256: [sha("pat")],
      last_names_sha256: [sha("oneil")],
      postal_codes: ["33602"],
      countries: ["US"],
      ip_address: "203.0.113.1",
      user_agent: "Mozilla/5.0",
    });
  });

  it("reads the pixel's cookies when the browser didn't post the ids", () => {
    const req = { headers: { cookie: "a=1; __oppref=op%5F9; __obref=ob_9" } };
    expect(readCookie(req, "__oppref")).toBe("op_9");
    expect(openAiAttribution({}, req)).toEqual({ oppref: "op_9", obref: "ob_9" });
    expect(openAiAttribution({ oppref: "posted" }, req).oppref).toBe("posted");
  });

  it("posts to bzr.openai.com with the key, and skips without one", async () => {
    const fetch = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    expect(await sendOpenAiEvents([{ id: "x" }])).toEqual({ sent: false });
    vi.stubEnv("OPENAI_CAPI_KEY", "k_test");
    vi.stubEnv("VITE_OPENAI_PIXEL_ID", "px1");
    expect(await sendOpenAiEvents([{ id: "x" }, { id: "" }])).toEqual({ sent: true });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://bzr.openai.com/v1/events?pid=px1");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer k_test");
    expect(JSON.parse(init.body as string).events).toEqual([{ id: "x" }]);
  });
});
