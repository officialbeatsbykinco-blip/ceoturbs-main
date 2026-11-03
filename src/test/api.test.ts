// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isPrivateIp, normalizeUrl, fetchPage } from "../../api/_lib/fetch-page.js";
import { parseHtml, blockedAiBots, scoreChecks, platformFor } from "../../api/_lib/audit.js";
import { cleanLead, isBot, scoreLead } from "../../api/_lib/leads.js";
import { buildEvent, hashedUser, cleanAttribution, requestSignals, withSignals } from "../../api/_lib/meta-capi.js";
import { buildTiktokEvent } from "../../api/_lib/tiktok-events.js";
import { quizFields, devFields } from "../../api/lead.js";
import { trackPayload } from "../../api/track.js";
import { sameOrigin, isJson } from "../../api/_lib/http.js";
import { deliveryResult, forwardLead } from "../../api/_lib/leads.js";
import { vi, afterEach } from "vitest";
import { validSignature, parseBooking } from "../../api/cal-webhook.js";
import { validSignature as shopifySig, parseOrder, buildPurchaseEvents } from "../../api/shopify-webhook.js";
import { cleanDesign, dataUrl } from "../../api/shirt-design.js";
import { createHash, createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

describe("Meta Conversions API payload", () => {
  it("normalizes and hashes personal data the way Meta requires", () => {
    const u = hashedUser({ email: "  Jo@Example.COM ", phone: "(404) 555-0123", name: "Jo Ann Smith", city: "Atlanta" });
    expect(u.em).toEqual([sha("jo@example.com")]);
    expect(u.ph).toEqual([sha("14045550123")]);
    expect(u.fn).toEqual([sha("jo")]);
    expect(u.ln).toEqual([sha("ann smith")]);
    expect(u.ct).toEqual([sha("atlanta")]);
  });

  it("keeps the browser event id for de-duplication and passes fbp/fbc unhashed", () => {
    const e = buildEvent({ eventName: "Lead", eventId: "generate_lead_abc", url: "https://www.ceoturbo.com/free-audit", user: { email: "a@b.co" }, attribution: { fbp: "fb.1.1.2", fbclid: "XYZ" }, ip: "1.2.3.4", userAgent: "UA" });
    expect(e).toMatchObject({ event_name: "Lead", event_id: "generate_lead_abc", action_source: "website", user_data: { fbp: "fb.1.1.2", client_ip_address: "1.2.3.4", client_user_agent: "UA" } });
    expect(e.user_data.fbc).toMatch(/^fb\.1\.\d+\.XYZ(\.[A-Za-z0-9_-]+)?$/);
    expect(JSON.stringify(e)).not.toContain("a@b.co");
  });

  it("drops unknown attribution keys", () => {
    expect(cleanAttribution({ gclid: "g1", evil: "x", fbp: 3 })).toEqual({ gclid: "g1" });
  });
});

describe("Cal.com booking webhook", () => {
  const body = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "u1", attendees: [{ name: "Jo", email: "JO@x.co" }], responses: { attendeePhoneNumber: { value: "+14045550123" } }, metadata: { source: "Ad page hero", fbp: "fb.1.2.3", junk: "x" } } });

  it("rejects missing or forged signatures", () => {
    expect(validSignature(body, undefined, "s3cret")).toBe(false);
    expect(validSignature(body, "deadbeef", "s3cret")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "other").update(body).digest("hex"), "s3cret")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "s3cret").update(body).digest("hex"), "")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "s3cret").update(body).digest("hex"), "s3cret")).toBe(true);
  });

  it("reads the booker and our tracking metadata", () => {
    expect(parseBooking(JSON.parse(body))).toMatchObject({ uid: "u1", name: "Jo", email: "jo@x.co", phone: "+14045550123", source: "Ad page hero", attribution: { fbp: "fb.1.2.3" } });
  });
});

describe("audit fetcher safety", () => {
  it("blocks private, loopback and cloud-metadata addresses", () => {
    for (const ip of ["127.0.0.1", "10.0.0.5", "172.16.3.4", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"]) expect(isPrivateIp(ip), ip).toBe(true);
    for (const ip of ["8.8.8.8", "76.76.21.21", "2606:4700::1111"]) expect(isPrivateIp(ip), ip).toBe(false);
  });

  it("only accepts normal public website URLs", () => {
    expect(normalizeUrl("joesplumbing.com")?.href).toBe("https://joesplumbing.com/");
    for (const bad of ["localhost:3000", "http://127.0.0.1", "ftp://x.com", "https://user:pw@x.com", "https://x.com:8080", "file:///etc/passwd", "intranet", "printer.local"]) expect(normalizeUrl(bad), bad).toBeNull();
  });

  it("refuses hostnames that resolve to private addresses", async () => {
    const res = await fetchPage("http://127.0.0.1.nip.io/", { timeoutMs: 4000 });
    expect(res.ok).toBe(false);
  });
});

describe("audit parsing and scoring", () => {
  const html = `<!doctype html><html><head><title>Plumber in Atlanta, GA | Joe's Plumbing</title>
    <meta name="description" content="Licensed Atlanta plumber for leaks, water heaters and drains. Same-day service, upfront prices. Call (404) 555-0123.">
    <meta name="viewport" content="width=device-width"><link rel="canonical" href="https://joes.example/">
    <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Plumber","name":"Joe's Plumbing","sameAs":["https://facebook.com/joes"]},{"@type":"FAQPage"}]}</script>
    </head><body><h1>Atlanta plumbing</h1><h2>Do you do same-day?</h2><img src="a.jpg" alt="van"><img src="b.jpg">
    <a href="tel:+14045550123">Call</a><a href="https://g.page/r/abc/review">Review us</a></body></html>`;

  it("reads titles, schema, headings and links", () => {
    const h = parseHtml(html);
    expect(h.title).toBe("Plumber in Atlanta, GA | Joe's Plumbing");
    expect(h.types).toEqual(expect.arrayContaining(["Plumber", "FAQPage"]));
    expect(h.sameAs).toEqual(["https://facebook.com/joes"]);
    expect(h.h1).toHaveLength(1);
    expect(h.images).toBe(2);
    expect(h.imagesWithAlt).toBe(1);
    expect(h.anchors).toContain("tel:+14045550123");
  });

  it("detects AI crawlers blocked in robots.txt", () => {
    expect(blockedAiBots("User-agent: *\nAllow: /")).toEqual([]);
    expect(blockedAiBots("User-agent: GPTBot\nUser-agent: PerplexityBot\nDisallow: /\n\nUser-agent: *\nAllow: /")).toEqual(["GPTBot", "PerplexityBot"]);
    expect(blockedAiBots("User-agent: *\nDisallow: /")).toContain("OAI-SearchBot");
    expect(blockedAiBots("User-agent: *\nDisallow: /admin")).toEqual([]);
  });

  it("scores pass/warn/fail by weight", () => {
    const { scores, overall } = scoreChecks(
      [
        { cat: "seo", weight: 2, status: "pass" },
        { cat: "seo", weight: 2, status: "fail" },
        { cat: "geo", weight: 1, status: "warn" },
      ] as never,
      ["seo", "geo"],
    );
    expect(scores).toEqual({ seo: 50, geo: 50 });
    expect(overall).toBe(50);
  });

  it("recognises social and link-in-bio hosts", () => {
    expect(platformFor("www.instagram.com")).toBe("Instagram");
    expect(platformFor("linktr.ee")).toBe("Linktree");
    expect(platformFor("joesplumbing.com")).toBeNull();
  });
});

describe("lead validation", () => {
  it("requires a name, valid email and real phone number", () => {
    expect(cleanLead({ name: "Jo", email: "jo@example.com", phone: "(404) 555-0123" }).lead).toMatchObject({ name: "Jo", phone: "(404) 555-0123" });
    expect(cleanLead({ name: "Jo", email: "nope", phone: "4045550123" }).error).toBe("email");
    expect(cleanLead({ name: "Jo", email: "jo@example.com", phone: "123" }).error).toBe("phone");
    expect(cleanLead({ name: "", email: "jo@example.com", phone: "4045550123" }).error).toBe("name");
  });

  it("flags honeypot fills and instant submits as bots", () => {
    expect(isBot({ company_site: "http://spam" })).toBe(true);
    expect(isBot({ elapsedMs: 200 })).toBe(true);
    expect(isBot({ elapsedMs: 9000 })).toBe(false);
  });
});

describe("Shopify order webhook", () => {
  const body = JSON.stringify({ id: 1 });
  it("verifies the base64 HMAC signature", () => {
    expect(shopifySig(body, createHmac("sha256", "s").update(body).digest("base64"), "s")).toBe(true);
    expect(shopifySig(body, createHmac("sha256", "x").update(body).digest("base64"), "s")).toBe(false);
    expect(shopifySig(body, undefined, "s")).toBe(false);
    expect(shopifySig(body, createHmac("sha256", "s").update(body).digest("base64"), "")).toBe(false);
  });
  it("maps an order and its ad click ids to the sheet record", () => {
    const r = parseOrder({ id: 9, name: "#1001", email: "A@B.com", total_price: "49.00", currency: "USD", financial_status: "paid", line_items: [{ title: "Card", quantity: 2 }], note_attributes: [{ name: "gclid", value: "g1" }, { name: "Business name", value: "Joe" }] });
    expect(r).toMatchObject({ type: "shopify-order", orderId: "9", email: "a@b.com", quantity: 2, total: "49.00 USD", gclid: "g1", business: "Joe" });
  });
});

describe("Shopify order → server-side Purchase", () => {
  const order = { id: 77, email: "Buyer@X.com", total_price: "39.99", currency: "USD", processed_at: "2026-10-13T12:00:00Z", customer: { id: 5 }, shipping_address: { name: "Pat Lee", city: "Atlanta", phone: "(470) 555-0100" }, line_items: [{ sku: "CT-NFC-REVIEW-2", quantity: 1, price: "39.99" }], note_attributes: [{ name: "_fbp", value: "fb.1.1.2" }, { name: "_fbc", value: "fb.1.1.AbC" }, { name: "ttclid", value: "tt9" }, { name: "Landing", value: "/google-review-cards" }], client_details: { browser_ip: "1.2.3.4", user_agent: "UA" } };
  it("builds a de-duplicable Meta Purchase with value, SKU and match data", () => {
    const { meta } = buildPurchaseEvents(order);
    expect(meta).toMatchObject({ event_name: "Purchase", event_id: "purchase_77", action_source: "website", event_source_url: "https://www.ceoturbo.com/google-review-cards" });
    expect(meta.custom_data).toMatchObject({ value: 39.99, currency: "USD", content_ids: ["CT-NFC-REVIEW-2"], num_items: 1, order_id: "77" });
    expect(meta.user_data.fbp).toBe("fb.1.1.2");
    expect(meta.user_data.fbc).toBe("fb.1.1.AbC");
    expect(meta.user_data.em[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(meta.user_data.client_ip_address).toBe("1.2.3.4");
  });
  it("builds the matching TikTok Purchase with the same event id", () => {
    const { tiktok } = buildPurchaseEvents(order);
    expect(tiktok).toMatchObject({ event: "Purchase", event_id: "purchase_77", properties: { value: 39.99, currency: "USD" } });
    expect(tiktok.user.ttclid).toBe("tt9");
  });
});

describe("Developer intake lead", () => {
  it("turns the answers into one readable, tag-free sheet note", () => {
    const d = devFields({ appUrl: " https://x.dev/app ", platform: "iOS", stage: "Launched, <b>no users</b>", budget: "$500-1k", blocker: "Nobody finds it", evil: "x" });
    expect(d.note).toBe("App: https://x.dev/app | Platform: iOS | Stage: Launched,  b no users /b | Ad budget: $500-1k | Blocker: Nobody finds it");
    expect(d).not.toHaveProperty("evil");
  });
  it("does not require a phone number for developers but still validates name and email", () => {
    expect(cleanLead({ name: "Al Dev", email: "al@x.dev" }, { phoneOptional: true }).lead.email).toBe("al@x.dev");
    expect(cleanLead({ name: "Al Dev", email: "al@x.dev" }).error).toBe("phone");
    expect(cleanLead({ name: "A", email: "al@x.dev" }, { phoneOptional: true }).error).toBe("name");
  });
});

describe("Brand Boost quiz lead", () => {
  it("keeps only the known quiz answers, trimmed and tag-free", () => {
    const q = quizFields({ quizId: "q_1", audience: "Local service business", stage: "Growing my business", goal: "More calls & bookings", blockers: "Hard to find on Google, <script>", budget: "$500 to $2,000", timeline: "Within 30 days", website: " mor.com ", move: "Turn searches into phone calls", evil: "x" });
    expect(q).toEqual({ quizId: "q_1", audience: "Local service business", stage: "Growing my business", goal: "More calls & bookings", blockers: "Hard to find on Google,  script", budget: "$500 to $2,000", timeline: "Within 30 days", website: "mor.com", move: "Turn searches into phone calls" });
  });

  it("reads quiz answers from booking metadata when the hidden booking fields are empty", () => {
    const b = parseBooking({ payload: { uid: "u2", attendees: [{ name: "Al", email: "al@x.co" }], responses: {}, metadata: { quizId: "q_9", stage: "Just starting out", visitorId: "v_1", businessName: "Mor Handy", goalLabel: "More calls & bookings", budgetLabel: "$5,000+", blockers: "No time", timeline: "ASAP — this week", leadValue: "900", ttclid: "tt1" } } });
    expect(b).toMatchObject({ quizId: "q_9", stage: "Just starting out", visitorId: "v_1", businessName: "Mor Handy", goal: "More calls & bookings", budget: "$5,000+", blockers: "No time", timeline: "ASAP — this week", value: 900, attribution: { ttclid: "tt1" } });
  });
});

describe("Meta Parameter Builder (server)", () => {
  it("reads _fbp, builds _fbc from the page's fbclid and prefers the IPv6 client address", () => {
    const headers: Record<string, string | string[]> = {};
    const req = { headers: { host: "www.ceoturbo.com", cookie: "_fbp=fb.1.1700000000000.123", referer: "https://www.ceoturbo.com/brand-boost?fbclid=AbC", "x-forwarded-for": "2606:4700::1111, 10.0.0.1" }, url: "/api/lead", method: "POST", socket: { remoteAddress: "1.2.3.4" } };
    const sig = requestSignals(req, { setHeader: (k: string, v: string[]) => (headers[k] = v) });
    expect(sig.fbp.startsWith("fb.1.1700000000000.123")).toBe(true);
    expect(sig.fbc).toMatch(/^fb\.1\.\d+\.AbC/);
    expect(sig.ip.startsWith("2606:4700::1111")).toBe(true);
    expect(String(headers["Set-Cookie"])).toContain("_fbc=");
  });

  it("keeps the browser's _fbp, and its _fbc only when the builder has none", () => {
    expect(withSignals({ fbp: "browser" }, { fbp: "server", fbc: "c", ip: "" })).toEqual({ fbp: "browser", fbc: "c" });
    expect(withSignals({ fbp: "browser", fbc: "browser-fbc" }, { fbp: "", fbc: "", ip: "" })).toEqual({ fbp: "browser", fbc: "browser-fbc" });
  });

  it("sends the fbclid of the current ad click, never a stale _fbc cookie from an older click", () => {
    const fbclid = "IwAR_New-ClickId_aBc123";
    const stale = "fb.1.1700000000000.IwAR_Old-ClickId_xYz789.AQIBAQIA";
    const req = { headers: { host: "www.ceoturbo.com", cookie: `_fbp=fb.1.1700000000000.1; _fbc=${stale}`, referer: `https://www.ceoturbo.com/free-audit?fbclid=${fbclid}` }, url: "/api/track", method: "POST", socket: { remoteAddress: "1.2.3.4" } };
    const sig = requestSignals(req, { setHeader: () => {} });
    const attr = withSignals(cleanAttribution({ fbp: "fb.1.1700000000000.1", fbc: stale, fbclid }), sig);
    const fbc = buildEvent({ eventName: "PageView", url: "https://www.ceoturbo.com/free-audit", attribution: attr }).user_data.fbc as string;
    expect(fbc.split(".")[3]).toBe(fbclid);
    expect(fbc).not.toContain("Old-ClickId");
  });

  it("never cuts a long fbclid: Meta sees the exact click id, or no fbc at all", () => {
    for (const len of [250, 260, 300, 340, 600]) {
      const fbclid = "IwZXh0bgNhZW0C" + "aB3-_xY9".repeat(80).slice(0, len - 14);
      const cookieFbc = `fb.1.1700000000000.${fbclid}.AQIBAQIA`;
      expect(buildEvent({ eventName: "Lead", attribution: cleanAttribution({ fbclid }) }).user_data.fbc?.split(".")[3]).toBe(fbclid);
      expect(buildEvent({ eventName: "Lead", attribution: cleanAttribution({ fbc: cookieFbc }) }).user_data.fbc).toBe(cookieFbc);
    }
    // Absurdly long values are dropped rather than sent altered.
    expect(cleanAttribution({ fbc: `fb.1.1.${"A".repeat(1200)}`, fbclid: "A".repeat(1200) })).toEqual({});
  });

  it("leaves a mixed-case fbclid byte-for-byte intact in fbc, including the fallback built from a bare fbclid", () => {
    const fbclid = "IwY2xjawN_AbCdEfGh-ij0KLmN_oPqRsTuV";
    const fallback = buildEvent({ eventName: "Schedule", attribution: { fbclid } }).user_data.fbc as string;
    expect(fallback).toMatch(/^fb\.1\.\d+\./);
    expect(fallback.split(".")[3]).toBe(fbclid);
    const cookieFbc = `fb.1.1700000000000.${fbclid}.AQIBAQIA`;
    expect((buildEvent({ eventName: "Lead", attribution: cleanAttribution({ fbc: cookieFbc }) }).user_data.fbc as string)).toBe(cookieFbc);
  });
});

describe("Meta IPv6 and untouched click ids", () => {
  const v6 = "2a03:2880:f12f:83:face:b00c:0:25de";

  it("prefers the browser's IPv6 from _fbi over the IPv4 the server sees", () => {
    const req = { headers: { host: "www.ceoturbo.com", cookie: `_fbp=fb.1.1700000000000.1; _fbi=${v6}.AQYBAQIA`, referer: "https://www.ceoturbo.com/", "x-forwarded-for": "8.8.8.8" }, url: "/api/track", method: "POST", socket: { remoteAddress: "8.8.8.8" } };
    const sig = requestSignals(req, { setHeader: () => {} });
    expect(sig.ip.startsWith(v6)).toBe(true);
    const e = buildEvent({ eventName: "PageView", attribution: {}, ip: sig.ip });
    expect(String(e.user_data.client_ip_address).startsWith(v6)).toBe(true);
  });

  it("uses the stored IPv6 when a webhook has no request IP, and ignores junk", () => {
    expect(buildEvent({ eventName: "Schedule", attribution: cleanAttribution({ fbi: `${v6}.AQYBAQIA` }) }).user_data.client_ip_address).toBe(`${v6}.AQYBAQIA`);
    expect(cleanAttribution({ fbi: "not-an-ip" })).toEqual({});
    expect(cleanAttribution({ fbi: "<script>" })).toEqual({});
  });

  it("never truncates a long fbclid or fbc", () => {
    const fbclid = "IwZXh0bgNhZW0BMABhZGlkAasT" + "AbCdEfGhIj_-".repeat(30);
    const fbc = `fb.1.1700000000000.${fbclid}.AQYBAQIA`;
    expect(fbc.length).toBeGreaterThan(300);
    expect(buildEvent({ eventName: "Lead", attribution: cleanAttribution({ fbc }) }).user_data.fbc).toBe(fbc);
    expect((buildEvent({ eventName: "Lead", attribution: cleanAttribution({ fbclid }) }).user_data.fbc as string).split(".")[3]).toBe(fbclid);
  });
});

describe("TikTok Events API payload", () => {
  it("hashes email/phone (E.164) and passes click ids unhashed with the shared event id", () => {
    const e = buildTiktokEvent({ event: "Lead", eventId: "generate_lead_x", url: "https://www.ceoturbo.com/brand-boost", user: { email: " A@B.co ", phone: "(404) 555-0123" }, attribution: { ttclid: "TT", ttp: "P" }, ip: "1.2.3.4" });
    expect(e).toMatchObject({ event: "Lead", event_id: "generate_lead_x", user: { email: sha("a@b.co"), phone: sha("+14045550123"), ttclid: "TT", ttp: "P", ip: "1.2.3.4" }, page: { url: "https://www.ceoturbo.com/brand-boost" } });
  });
});

describe("Booked-call priority score", () => {
  it("ranks big budget + urgent + website as HOT and vague browsers as Cool", () => {
    expect(scoreLead({ budget: "$5,000+", timeline: "ASAP — this week", website: "a.com" })).toEqual({ score: 100, priority: "HOT" });
    expect(scoreLead({ budget: "$2,000 to $5,000", timeline: "Within 30 days" })).toEqual({ score: 70, priority: "HOT" });
    expect(scoreLead({ budget: "$500 to $2,000", timeline: "Within 30 days", website: "a.com" })).toEqual({ score: 65, priority: "Warm" });
    expect(scoreLead({ budget: "$500 to $2,000", timeline: "In the next few months" })).toEqual({ score: 35, priority: "Cool" });
    expect(scoreLead({ budget: "Not sure yet", timeline: "Just exploring" })).toEqual({ score: 0, priority: "Cool" });
    expect(scoreLead()).toEqual({ score: 0, priority: "Cool" });
  });

  it("keeps the #1 move from the booking metadata for the call-prep sheet", () => {
    expect(parseBooking({ payload: { uid: "u3", attendees: [{ name: "Al", email: "al@x.co" }], metadata: { move: "Turn searches into phone calls" } } }).move).toBe("Turn searches into phone calls");
  });
});

describe("custom shirt orders", () => {
  const png = `data:image/png;base64,${"A".repeat(400)}`;
  it("accepts a design with a real PNG and drops anything else", () => {
    const { design, files } = cleanDesign({ designId: "CT-ABCD2345", frontPng: png, style: "Short sleeve", color: "Black", sizes: { M: 2, L: "3", XXL: 9, S: -1 }, total: 139.95, text: "<b>Acme</b>" });
    expect(design).toMatchObject({ designId: "CT-ABCD2345", sizes: "M×2, L×3", quantity: 5, total: "139.95", backPrint: "No", text: "b Acme /b" });
    expect(files.front.length).toBe(400);
    expect(cleanDesign({ designId: "x", frontPng: png }).error).toBe("designId");
    expect(cleanDesign({ designId: "CT-ABCD2345", frontPng: "data:image/svg+xml;base64,AAAA" }).error).toBe("frontPng");
    expect(cleanDesign({ designId: "CT-ABCD2345", frontPng: png, backPng: "javascript:alert(1)" }).error).toBe("backPng");
    expect(dataUrl(`data:image/png;base64,${"A".repeat(200)}"><script>`, "image/png")).toBe("");
  });
  it("maps a paid shirt order to its design, sizes and print file", () => {
    const props = [{ name: "Design ID", value: "CT-ABCD2345" }, { name: "Print file", value: "https://drive.google.com/file/d/x/view" }, { name: "Placement", value: "Center front" }];
    const r = parseOrder({ id: 7, name: "#1002", email: "x@y.com", total_price: "251.91", currency: "USD", line_items: [{ title: "Custom Company T-Shirt", variant_title: "Short sleeve – Front / Black / M", quantity: 4, properties: props }, { title: "Custom Company T-Shirt", variant_title: "Short sleeve – Front / Black / L", quantity: 5, properties: props }], note_attributes: [{ name: "gclid", value: "g2" }] });
    expect(r).toMatchObject({ type: "shirt-order", designId: "CT-ABCD2345", placement: "Center front", quantity: 9, gclid: "g2", sizes: "Short sleeve – Front / Black / M × 4; Short sleeve – Front / Black / L × 5" });
    expect(r.printFile).toContain("drive.google.com");
    expect(r.kind).toBe("Company shirt");
  });
  it("takes artist merch designs (AM- ids) and labels them by id, not by what the browser claims", () => {
    const { design } = cleanDesign({ kind: "company", designId: "AM-ABCD2345", frontPng: png, font: "Gothic", backText: "WORLD TOUR 2026 · 03.14 ATLANTA" });
    expect(design).toMatchObject({ kind: "Artist merch", designId: "AM-ABCD2345", font: "Gothic", backText: "WORLD TOUR 2026 · 03.14 ATLANTA" });
    expect(cleanDesign({ designId: "CT-ABCD2345", frontPng: png }).design!.kind).toBe("Company shirt");
    expect(cleanDesign({ designId: "XX-ABCD2345", frontPng: png }).error).toBe("designId");
  });
  it("maps a paid artist merch order with the artist name and the full ship-to address", () => {
    const r = parseOrder({ id: 8, name: "#1003", line_items: [{ title: "Custom Artist Merch T-Shirts", variant_title: "Short sleeve – Front + back / Maroon / L", quantity: 24, properties: [{ name: "Design ID", value: "AM-ZZZZ2345" }] }], note_attributes: [{ name: "Artist name", value: "Lil Test" }], shipping_address: { name: "T", address1: "1 Main St", address2: "Apt 4", city: "Atlanta", province_code: "GA", zip: "30303", country_code: "US" } });
    expect(r).toMatchObject({ type: "shirt-order", kind: "Artist merch", designId: "AM-ZZZZ2345", business: "Lil Test", quantity: 24, shipTo: "1 Main St, Apt 4, Atlanta, GA, 30303, US" });
  });
});

describe("leads Apps Script (docs/leads-apps-script.js)", () => {
  const ctx: Record<string, unknown> = {};
  vm.createContext(ctx);
  vm.runInContext(`${readFileSync(path.resolve(__dirname, "../../docs/leads-apps-script.js"), "utf8")}\nthis.TABS=TABS;this.STATUS=STATUS;this.dashboardCells_=dashboardCells_;this.tabFor=tabFor;`, ctx);
  const TABS = ctx.TABS as Record<string, Record<string, string>>;
  const dashboardCells = ctx.dashboardCells_ as (r: (tab: string, h: string) => string) => [string, string][];

  it("routes every lead type to its tab", () => {
    const tabFor = ctx.tabFor as (t: string) => string;
    expect([tabFor("booking"), tabFor("brand-boost-quiz"), tabFor("audit-business"), tabFor("shopify-order"), tabFor("shirt-design"), tabFor("shirt-order"), tabFor("dev-intake"), tabFor("office-setup"), tabFor("zzz")]).toEqual(["Booked Calls", "Call Quiz Leads", "Free Check Leads", "Card Orders", "Shirt Designs", "Shirt Orders", "Dev Intake Leads", "Office Setup Leads", "Other Leads"]);
  });

  it("has unique headers per tab and a Status dropdown for the call tabs", () => {
    for (const [tab, map] of Object.entries(TABS)) expect(new Set(Object.keys(map)).size, tab).toBe(Object.keys(map).length);
    const status = ctx.STATUS as Record<string, string[][]>;
    expect(status["Booked Calls"].map((s) => s[0])).toEqual(["New", "Confirmed", "Showed", "No-show", "Rescheduled", "Won", "Lost"]);
    expect(Object.keys(TABS["Booked Calls"])).toEqual(expect.arrayContaining(["Call time", "Priority", "Lead score", "Status", "Outcome", "Quote $", "Follow-up date", "#1 move shown", "Booking ID", "Quiz ID", "Stage"]));
    for (const tab of ["Call Quiz Leads", "Free Check Leads"]) expect(TABS[tab], tab).toMatchObject({ Stage: "stage", "Event ID": "eventId" });
  });

  it("fills Booked Calls from fields the booking webhook actually sends", () => {
    const sent = Object.keys(parseBooking({ payload: { uid: "u" } })).concat(["type", "event", "priority", "score", "receivedAt", "meetingLink", "endTime", "landing", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "msclkid", "fbclid", "ttclid"]);
    const known = new Set([...sent, "startTime", "name", "email", "phone"]);
    for (const [header, field] of Object.entries(TABS["Booked Calls"])) if (field) expect(known.has(field), `${header} ← ${field}`).toBe(true);
  });

  it("fills the shirt tabs from fields the site actually sends", () => {
    const design = cleanDesign({ designId: "CT-ABCD2345", frontPng: `data:image/png;base64,${"A".repeat(400)}` }).design!;
    const order = parseOrder({ id: 1, line_items: [{ title: "Custom Company T-Shirt", properties: [{ name: "Design ID", value: "CT-ABCD2345" }] }] });
    const added = ["type", "receivedAt", "landing", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "msclkid", "fbclid", "ttclid"];
    const fromScript = ["preview", "frontUrl", "backUrl", "mockupUrl", "orderNumber"];
    for (const [tab, sent] of [["Shirt Designs", [...Object.keys(design), ...added, ...fromScript]], ["Shirt Orders", [...Object.keys(order), ...added]]] as const)
      for (const [header, field] of Object.entries(TABS[tab])) if (field) expect(sent, `${tab}: ${header} ← ${field}`).toContain(field);
  });

  it("builds a dashboard that only references real columns", () => {
    const seen = new Set<string>();
    const cells = dashboardCells((tab, h) => {
      expect(Object.keys(TABS[tab]), `${tab} / ${h}`).toContain(h);
      seen.add(`${tab}/${h}`);
      return `'${tab}'!A2:A`;
    });
    expect(cells.length).toBeGreaterThan(30);
    expect(seen.size).toBeGreaterThan(10);
  });
});

describe("lead delivery to the Google Sheet", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("only counts a lead as saved when the Apps Script says so", () => {
    expect(deliveryResult(200, "ok").ok).toBe(true);
    expect(deliveryResult(200, "duplicate").ok).toBe(true);
    expect(deliveryResult(200, "forbidden")).toMatchObject({ ok: false, retry: false });
    expect(deliveryResult(200, "bad json").ok).toBe(false);
    expect(deliveryResult(200, "<!DOCTYPE html><html>Sign in</html>")).toMatchObject({ ok: false, retry: true });
    expect(deliveryResult(503, "")).toMatchObject({ ok: false, retry: true });
    expect(deliveryResult(400, "")).toMatchObject({ ok: false, retry: false });
  });

  it("retries a failed send, then falls back to the backup webhook", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://sheet.test/x");
    vi.stubEnv("LEADS_BACKUP_WEBHOOK_URL", "https://backup.test/y");
    const calls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      calls.push(url);
      return new Response(url.includes("sheet") ? "" : "ok", { status: url.includes("sheet") ? 500 : 200 });
    }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await forwardLead({ type: "brand-boost-quiz", name: "Jo" });
    expect(calls).toEqual(["https://sheet.test/x", "https://sheet.test/x", "https://backup.test/y"]);
    expect(r.stored).toBe("backup");
  });

  it("reports a secret mismatch as not saved (no silent loss)", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://sheet.test/x");
    vi.stubEnv("LEADS_BACKUP_WEBHOOK_URL", "");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("forbidden", { status: 200 })));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await forwardLead({ type: "x" })).stored).toBe(false);
    expect(String(err.mock.calls[0][0])).toMatch(/secret mismatch/);
  });

  it("forwards office and POS setup leads with service, job and quote value", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://sheet.test/x");
    let sentPayload: Record<string, unknown> = {};
    vi.stubGlobal("fetch", vi.fn(async (_url: string, opts: RequestInit) => {
      sentPayload = JSON.parse(opts.body as string);
      return new Response("ok", { status: 200 });
    }));
    const r = await forwardLead({
      type: "office-setup",
      name: "Sam Restaurant",
      phone: "4045550199",
      email: "sam@restaurant.com",
      service: "pos-system-setup",
      business: "Single POS terminal",
      value: 149,
      note: "Service: pos-system-setup | Job: Single POS terminal | City: Atlanta | When: ASAP",
      page: "/services/pos-system-setup",
    });
    expect(r.stored).toBe(true);
    expect(sentPayload).toMatchObject({
      type: "office-setup",
      name: "Sam Restaurant",
      service: "pos-system-setup",
      business: "Single POS terminal",
      value: 149,
    });
  });
});

describe("form endpoint guards", () => {
  const req = (headers: Record<string, string>) => ({ headers: { host: "www.ceoturbo.com", ...headers } }) as never;
  it("accepts our own pages and rejects other sites and header-less scripts", () => {
    expect(sameOrigin(req({ origin: "https://www.ceoturbo.com" }))).toBe(true);
    expect(sameOrigin(req({ origin: "http://localhost:8080" }))).toBe(true);
    expect(sameOrigin(req({ origin: "https://evil.example" }))).toBe(false);
    expect(sameOrigin(req({ origin: "https://ceoturbo.com.evil.example" }))).toBe(false);
    expect(sameOrigin(req({}))).toBe(false);
    expect(sameOrigin(req({ "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(sameOrigin(req({ "sec-fetch-site": "cross-site" }))).toBe(false);
    expect(sameOrigin(req({ referer: "https://www.ceoturbo.com/book" }))).toBe(true);
  });
  it("requires JSON bodies", () => {
    expect(isJson(req({ "content-type": "application/json" }))).toBe(true);
    expect(isJson(req({ "content-type": "text/plain" }))).toBe(false);
    expect(isJson(req({}))).toBe(false);
  });
});

describe("server copies of browser events (/api/track)", () => {
  it("only sends whitelisted events, mapped to Meta names", () => {
    expect(trackPayload({ event: "click_to_call", contentName: "Phone call" })).toEqual({ eventName: "Contact", customData: { content_name: "Phone call" } });
    expect(trackPayload({ event: "begin_checkout", value: 39.99, currency: "usd", contentIds: ["CT-NFC-REVIEW-2"], numItems: 1 })).toEqual({
      eventName: "InitiateCheckout",
      customData: { value: 39.99, currency: "USD", content_ids: ["CT-NFC-REVIEW-2"], content_type: "product", num_items: 1 },
    });
    expect(trackPayload({ event: "page_view" })).toEqual({ eventName: "PageView", customData: {} });
    expect(trackPayload({ event: "view_item", value: 39.99, contentIds: ["CT-NFC-REVIEW-2"] })?.eventName).toBe("ViewContent");
    expect(trackPayload({ event: "add_to_cart", value: 39.99 })?.eventName).toBe("AddToCart");
    expect(trackPayload({ event: "Purchase", value: 1 })).toBeNull();
    expect(trackPayload({ event: "generate_lead" })).toBeNull();
  });
});
