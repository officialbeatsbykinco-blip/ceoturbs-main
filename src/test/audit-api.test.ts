// @vitest-environment node
// The free check's lead path: scan (no lead) → unlock (lead to the sheet, same fields as always).
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

vi.mock("../../api/_lib/audit.js", async (orig) => {
  const real = await orig<typeof import("../../api/_lib/audit.js")>();
  return {
    ...real,
    runAudit: vi.fn(async (input: { name: string }) => ({
      kind: "business",
      name: input.name,
      overall: 48,
      scores: { seo: 40, aeo: 50, geo: 52, reviews: 50 },
      categories: ["seo", "aeo", "geo", "reviews"],
      checks: [{ cat: "seo", id: "website", weight: 4, status: "fail", label: "No website", detail: "", fix: "" }],
      top: ["website"],
      meta: { site: null, platform: null, psi: false, checkedAt: "" },
    })),
  };
});

import handler from "../../api/audit.js";
import { lookupPlaces, sameBusiness } from "../../api/_lib/places.js";

let ip = 0;
const call = async (body: Record<string, unknown>) => {
  const req = { method: "POST", headers: { origin: "https://www.ceoturbo.com", host: "www.ceoturbo.com", "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}`, "user-agent": "test" }, body, socket: {} };
  let status = 0;
  let out = "";
  const res = { statusCode: 0, setHeader: () => {}, getHeader: () => undefined, end: (b: string) => { status = res.statusCode; out = b; } };
  await handler(req as never, res as never);
  return { status, data: JSON.parse(out || "{}") };
};

const BIZ = { kind: "business", business: "Mor Handy", what: "handyman", city: "Tampa, FL", stage: "grow", gbp: "yes", reviews: "10-49", company_site: "", elapsedMs: 9000 };
const CONTACT = { name: "Jo", phone: "(813) 555-0123", email: "", smsOptIn: true };

describe("free check API", () => {
  let sheet: Record<string, unknown>[];
  beforeEach(() => {
    sheet = [];
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://sheet.test/x");
    vi.stubEnv("LEADS_BACKUP_WEBHOOK_URL", "");
    vi.stubEnv("META_CAPI_TOKEN", "");
    vi.stubEnv("TIKTOK_ACCESS_TOKEN", "");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, opts: RequestInit) => {
        if (String(url).includes("sheet.test")) sheet.push(JSON.parse(opts.body as string));
        return new Response("ok", { status: 200 });
      }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("scan mode returns the report and saves no lead", async () => {
    const r = await call({ ...BIZ, mode: "scan" });
    expect(r.status).toBe(200);
    expect(r.data.report.overall).toBe(48);
    expect(sheet).toHaveLength(0);
  });

  it("unlock saves the lead to the sheet with the same type and fields, email optional", async () => {
    const r = await call({ ...BIZ, ...CONTACT, mode: "unlock", eventId: "ev1", page: "/free-audit", summary: { overall: 48, scores: { seo: 40, aeo: 50, geo: 52, reviews: 50 }, top: ["No website"] } });
    expect(r.status).toBe(200);
    expect(sheet).toHaveLength(1);
    expect(sheet[0]).toMatchObject({
      type: "audit-business",
      name: "Jo",
      business: "Mor Handy",
      what: "handyman",
      city: "Tampa, FL",
      gbp: "yes",
      reviews: "10-49",
      score: 48,
      seo: 40,
      reviewsScore: 50,
      topIssues: "No website",
      eventId: "ev1",
      page: "/free-audit",
      smsOptIn: true,
    });
    expect(String(sheet[0].phone)).toContain("813");
  });

  it("unlock still needs a real phone number", async () => {
    const r = await call({ ...BIZ, ...CONTACT, phone: "123", mode: "unlock", summary: { overall: 48 } });
    expect(r.status).toBe(400);
    expect(r.data.error).toBe("phone");
    expect(sheet).toHaveLength(0);
  });

  it("unlock reports 502 when the sheet didn't take the lead, so the browser retries", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    const r = await call({ ...BIZ, ...CONTACT, mode: "unlock", summary: { overall: 48 } });
    expect(r.status).toBe(502);
  });

  it("the original one-shot request (no mode) still scans and saves the lead", async () => {
    const r = await call({ ...BIZ, ...CONTACT, email: "jo@example.com", eventId: "ev2" });
    expect(r.status).toBe(200);
    expect(r.data.report.overall).toBe(48);
    expect(sheet[0]).toMatchObject({ type: "audit-business", score: 48, topIssues: "No website", email: "jo@example.com" });
  });

  it("rejects bots on every mode", async () => {
    expect((await call({ ...BIZ, mode: "scan", company_site: "spam" })).status).toBe(400);
  });
});

describe("Google Places lookup", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is off (null) without an API key", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    const f = vi.fn();
    expect(await lookupPlaces({ name: "Mor Handy", what: "handyman", city: "Tampa" }, f as never)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it("falls back to null when Google errors", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "k");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const f = vi.fn(async () => new Response("no", { status: 403 }));
    expect(await lookupPlaces({ name: "Mor Handy", what: "handyman", city: "Tampa" }, f as never)).toBeNull();
  });

  it("finds the business and ranks competitors by review count", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "k");
    const place = (id: string, name: string, n: number) => ({ id, displayName: { text: name }, rating: 4.7, userRatingCount: n, businessStatus: "OPERATIONAL" });
    const f = vi.fn(async (_u: string, o: RequestInit) => {
      const q = JSON.parse(o.body as string).textQuery as string;
      const places = q.startsWith("Mor Handy") ? [place("a", "Mor Handy LLC", 23)] : [place("a", "Mor Handy LLC", 23), place("b", "Pro Fix", 40), place("c", "Big Handy Co", 312)];
      return new Response(JSON.stringify({ places }), { status: 200 });
    });
    const r = await lookupPlaces({ name: "Mor Handy", what: "handyman", city: "Tampa" }, f as never);
    expect(r?.found).toBe(true);
    expect(r?.place?.reviews).toBe(23);
    expect(r?.competitors.map((c) => c.name)).toEqual(["Big Handy Co", "Pro Fix"]);
  });

  it("matches names loosely but not wrongly", () => {
    expect(sameBusiness("Mor Handy LLC", "Mor Handy")).toBe(true);
    expect(sameBusiness("Joe's Pizza & Wings", "joes pizza and wings")).toBe(true);
    expect(sameBusiness("Pro Fix", "Mor Handy")).toBe(false);
  });
});
