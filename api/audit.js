// POST /api/audit — captures the lead, runs the free SEO/AEO/GEO audit and returns the report.
import { runAudit } from "./_lib/audit.js";
import { cleanLead, forwardLead, isBot } from "./_lib/leads.js";
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { buildEvent, cleanAttribution, requestSignals, sendMetaEvents, withSignals } from "./_lib/meta-capi.js";

/** What a free-check lead is worth to the ad platforms (matches FREE_CHECK_VALUE in AuditTool.tsx). */
const FREE_CHECK_VALUE = 10;
import { buildTiktokEvent, sendTiktokEvents } from "./_lib/tiktok-events.js";

const pick = (v, allowed) => (allowed.includes(v) ? v : "");
const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error("audit-timeout")), ms))]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (!isJson(req)) return send(res, 415, { error: "content-type" });
  if (rateLimited(`audit:${clientIp(req)}`, 6, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "body" });
  }
  if (isBot(body)) return send(res, 400, { error: "invalid" });

  const kind = body.kind === "artist" ? "artist" : "business";
  const input = {
    kind,
    name: text(body.business, 100),
    what: text(body.what, 60),
    city: text(body.city, 60),
    website: text(body.website, 300),
    stage: pick(body.stage, ["start", "grow"]),
    gbp: pick(body.gbp, ["yes", "unsure", "no"]),
    reviews: pick(body.reviews, ["0-9", "10-49", "50-99", "100+"]),
    press: pick(body.press, ["none", "some", "lots"]),
    nameRank: pick(body.nameRank, ["top", "somewhere", "no", "unsure"]),
  };
  if (input.name.length < 2) return send(res, 400, { error: "business" });

  const { lead, error } = cleanLead({ ...body, business: input.name });
  if (error) return send(res, 400, { error });

  let report = null;
  try {
    report = await withTimeout(runAudit(input), 28_000);
  } catch (e) {
    console.error("[audit] failed", e?.message);
  }

  // Server-side Meta "Lead", de-duplicated with the browser Pixel via the shared event id.
  const signals = requestSignals(req, res);
  const attr = withSignals(cleanAttribution(body.attribution), signals);
  const eventId = text(body.eventId, 120);
  const url = `https://www.ceoturbo.com${text(body.page, 120) || "/free-audit"}`;
  const ip = signals.ip || clientIp(req);
  const contentName = kind === "artist" ? "Artist visibility check" : "Business visibility check";
  const stageLabel = input.stage === "start" ? "Starting out" : input.stage === "grow" ? "Growing" : "";
  const category = `${kind === "artist" ? "Artist" : "Business"}${stageLabel ? ` · ${stageLabel}` : ""}`;
  const externalId = text(body.visitorId, 60) || undefined;
  const capi = Promise.all([
    sendMetaEvents([
      buildEvent({
        eventName: "Lead",
        eventId,
        url,
        user: { email: lead.email, phone: lead.phone, name: lead.name, city: input.city, externalId },
        attribution: attr,
        ip,
        userAgent: req.headers["user-agent"],
        customData: { lead_source: "free_check", content_name: contentName, content_category: category, value: FREE_CHECK_VALUE, currency: "USD" },
      }),
    ]),
    sendTiktokEvents([buildTiktokEvent({ event: "Lead", eventId, url, user: { email: lead.email, phone: lead.phone, externalId }, attribution: attr, ip, userAgent: req.headers["user-agent"], properties: { content_name: contentName, value: FREE_CHECK_VALUE, currency: "USD" } })]),
  ]);

  const failing = report ? report.checks.filter((c) => report.top.includes(c.id)).map((c) => c.label) : [];
  await forwardLead({
    type: kind === "artist" ? "audit-artist" : "audit-business",
    ...lead,
    what: input.what,
    city: input.city,
    website: input.website,
    stage: stageLabel,
    gbp: input.gbp,
    reviews: input.reviews,
    press: input.press,
    nameRank: input.nameRank,
    score: report ? report.overall : "",
    seo: report?.scores.seo ?? "",
    aeo: report?.scores.aeo ?? "",
    geo: report?.scores.geo ?? "",
    reviewsScore: report?.scores.reviews ?? "",
    topIssues: failing.join(" | "),
    page: text(body.page, 120),
    eventId,
    ...attr,
  });
  const [meta] = await capi;

  if (!report) return send(res, 503, { error: "audit", meta: !!meta.sent });
  return send(res, 200, { report, meta: !!meta.sent });
}
