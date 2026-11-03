// @vitest-environment node
// A booked call, end to end on the server: Cal.com's signed webhook → Meta + TikTok server events and the sheet.
import { describe, it, expect, vi, afterEach } from "vitest";
import { createHash, createHmac } from "node:crypto";
import handler from "../../api/cal-webhook.js";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const SECRET = "cal-secret";
// Request bodies we capture are only read by key in the assertions below.
type Body = { [k: string]: unknown; data: { event_name: string; event_id: string; user_data: Record<string, unknown>; custom_data: Record<string, unknown>; [k: string]: unknown }[] } & Record<string, unknown>;

const booking = (over: Record<string, unknown> = {}) => ({
  triggerEvent: "BOOKING_CREATED",
  createdAt: "2026-10-14T15:00:00.000Z",
  payload: {
    uid: "UID123",
    title: "CEO-Turbo Boost Brand Call between Chris and Real Person",
    startTime: "2026-10-16T14:00:00.000Z",
    endTime: "2026-10-16T14:30:00.000Z",
    attendees: [{ name: "Real Person", email: "Person@Example.com", timeZone: "America/New_York" }],
    responses: { attendeePhoneNumber: { value: "+14045550123" }, businessName: { value: "Mor Plumbing" }, budget: { value: "$1,000–$3,000" } },
    metadata: {
      source: "Brand Boost hero — quiz",
      page: "/brand-boost",
      quizId: "quiz_abc",
      visitorId: "v_123",
      leadValue: 150,
      budgetLabel: "$1,000–$3,000 a month",
      timeline: "Within 30 days",
      move: "Fix your Google profile",
      ua: "Mozilla/5.0 (iPhone)",
      msclkid: "MSCLK123",
      fbc: "fb.1.1700000000000.AbC",
      fbp: "fb.1.1700000000000.999",
      utm_source: "bing",
      utm_campaign: "brand-boost",
      junk: "ignore me",
    },
    ...over,
  },
});

async function call(body: unknown, signature?: string) {
  const raw = JSON.stringify(body);
  const sig = signature ?? createHmac("sha256", SECRET).update(raw).digest("hex");
  const req = { method: "POST", headers: { "x-cal-signature-256": sig }, body: raw };
  const out: { status?: number; body?: string } = {};
  const res = { statusCode: 200, setHeader() {}, end(b: string) { out.status = this.statusCode; out.body = b; } };
  await handler(req, res);
  return { status: out.status, json: JSON.parse(out.body || "{}") };
}

describe("booked call → /api/cal-webhook", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function stubNetwork() {
    vi.stubEnv("CAL_WEBHOOK_SECRET", SECRET);
    vi.stubEnv("META_CAPI_TOKEN", "meta-token");
    vi.stubEnv("TIKTOK_ACCESS_TOKEN", "tt-token");
    vi.stubEnv("TIKTOK_PIXEL_ID", "TTPIXEL");
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://sheet.test/exec");
    vi.stubEnv("LEADS_WEBHOOK_SECRET", "sheet-secret");
    const sent: { url: string; body: Body }[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init: { body: string }) => {
      sent.push({ url, body: JSON.parse(init.body) });
      if (url.includes("sheet.test")) return new Response("ok", { status: 200 });
      if (url.includes("tiktok")) return new Response(JSON.stringify({ code: 0 }), { status: 200 });
      return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
    }));
    return sent;
  }

  it("sends Meta a Schedule with the same id as the browser, hashed match data and click ids", async () => {
    const sent = stubNetwork();
    const r = await call(booking());
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, meta: true, sheet: true });

    const meta = sent.find((s) => s.url.includes("graph.facebook.com"))!;
    const ev = meta.body.data[0];
    expect(ev.event_name).toBe("Schedule");
    expect(ev.event_id).toBe("book_UID123"); // browser sends eventID book_<uid>: Meta de-duplicates the pair
    expect(ev.action_source).toBe("website");
    expect(ev.event_time).toBe(Math.floor(Date.parse("2026-10-14T15:00:00.000Z") / 1000));
    expect(ev.user_data.em).toEqual([sha("person@example.com")]);
    expect(ev.user_data.ph).toEqual([sha("14045550123")]);
    expect(ev.user_data.fbc).toBe("fb.1.1700000000000.AbC");
    expect(ev.user_data.fbp).toBe("fb.1.1700000000000.999");
    expect(ev.user_data.client_user_agent).toBe("Mozilla/5.0 (iPhone)");
    expect(ev.custom_data).toMatchObject({ value: 150, currency: "USD", lead_source: "Brand Boost hero — quiz" });
  });

  it("sends TikTok the same Schedule id", async () => {
    const sent = stubNetwork();
    await call(booking());
    const tt = sent.find((s) => s.url.includes("tiktok"))!;
    expect(tt.body.data[0]).toMatchObject({ event: "Schedule", event_id: "book_UID123" });
    expect((tt.body.data[0].user as { email: string }).email).toBe(sha("person@example.com"));
  });

  it("writes the booking to the sheet with the quiz answers, priority and the ad that drove it", async () => {
    const sent = stubNetwork();
    await call(booking());
    const row = sent.find((s) => s.url.includes("sheet.test"))!.body;
    expect(row).toMatchObject({
      secret: "sheet-secret",
      type: "booking",
      uid: "UID123",
      name: "Real Person",
      email: "person@example.com",
      phone: "'+14045550123", // leading apostrophe: Sheets text marker so "+1…" is never read as a formula
      businessName: "Mor Plumbing",
      quizId: "quiz_abc",
      move: "Fix your Google profile",
      msclkid: "MSCLK123",
      utm_source: "bing",
      utm_campaign: "brand-boost",
      page: "/brand-boost",
    });
    expect(["HOT", "Warm", "Cool"]).toContain(row.priority);
    expect(row.junk).toBeUndefined();
  });

  it("rejects forged or unsigned webhooks and sends nothing anywhere", async () => {
    const sent = stubNetwork();
    expect((await call(booking(), "deadbeef")).status).toBe(401);
    expect((await call(booking(), "")).status).toBe(401);
    expect(sent).toHaveLength(0);
  });

  it("ignores Cal.com's ping and other triggers", async () => {
    const sent = stubNetwork();
    const r = await call({ triggerEvent: "PING", payload: {} });
    expect(r.json).toMatchObject({ ok: true, ignored: "PING" });
    expect(sent).toHaveLength(0);
  });

  it("still saves the booking to the sheet when Meta is down", async () => {
    const sent = stubNetwork();
    vi.spyOn(console, "error").mockImplementation(() => {});
    (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (url: string, init: { body: string }) => {
      sent.push({ url, body: JSON.parse(init.body) });
      if (url.includes("graph.facebook.com")) throw new Error("network");
      return new Response(url.includes("tiktok") ? JSON.stringify({ code: 0 }) : "ok", { status: 200 });
    });
    const r = await call(booking());
    expect(r.json).toMatchObject({ ok: true, meta: false, sheet: true });
  });
});
