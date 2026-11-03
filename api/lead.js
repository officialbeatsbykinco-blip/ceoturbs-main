// POST /api/lead — Brand Boost quiz leads, review card order requests (fallback when Shopify checkout
// is unreachable) and any other simple lead form.
import { cleanLead, forwardLead, isBot, scoreLead } from "./_lib/leads.js";
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { buildEvent, cleanAttribution, requestSignals, sendMetaEvents, withSignals } from "./_lib/meta-capi.js";
import { buildTiktokEvent, sendTiktokEvents } from "./_lib/tiktok-events.js";

const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

/** The quiz answers kept for the "Call Quiz Leads" sheet tab (exported for tests). */
export function quizFields(body) {
  return {
    quizId: text(body.quizId, 60),
    audience: text(body.audience, 60),
    stage: text(body.stage, 60),
    goal: text(body.goal, 80),
    blockers: text(body.blockers, 300),
    budget: text(body.budget, 40),
    timeline: text(body.timeline, 40),
    website: text(body.website, 200),
    move: text(body.move, 120),
  };
}

/** Developer intake (/app-marketing): answers kept as one readable note for the sheet's Note column (exported for tests). */
export function devFields(body) {
  const f = { appUrl: text(body.appUrl, 200), platform: text(body.platform, 40), stage: text(body.stage, 60), budget: text(body.budget, 40), blocker: text(body.blocker, 300) };
  const note = [f.appUrl && `App: ${f.appUrl}`, f.platform && `Platform: ${f.platform}`, f.stage && `Stage: ${f.stage}`, f.budget && `Ad budget: ${f.budget}`, f.blocker && `Blocker: ${f.blocker}`].filter(Boolean).join(" | ");
  return { ...f, note };
}

/** Dead-battery request (/car-battery): the car, where it is and when, kept as separate sheet columns (exported for tests). */
export function batteryFields(body) {
  const f = { need: text(body.need, 40), year: text(body.year, 4), make: text(body.make, 40), model: text(body.model, 60), location: text(body.location, 140), when: text(body.when, 30), company: text(body.company, 100), vehicles: text(body.vehicles, 60) };
  const note = [f.need, [f.year, f.make, f.model].filter(Boolean).join(" "), f.company && `Company: ${f.company}`, f.vehicles && `Vehicles: ${f.vehicles}`, f.location && `At: ${f.location}`, f.when && `When: ${f.when}`].filter(Boolean).join(" | ");
  return { ...f, note };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (!isJson(req)) return send(res, 415, { error: "content-type" });
  if (rateLimited(`lead:${clientIp(req)}`, 5, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "body" });
  }
  if (isBot(body)) return send(res, 400, { error: "invalid" });

  const type = text(body.type, 30) || "order-request";
  const dev = type === "dev-intake" ? devFields(body) : null;
  // The text quiz asks for a first name only: a phone send gives us their number when the text arrives.
  const textQuiz = type === "brand-boost-quiz" && text(body.service, 80) === "text-quiz";
  const { lead, error } = cleanLead(body, { phoneOptional: !!dev || type === "shirt-exit-intent" || (textQuiz && body.channel === "sms"), emailOptional: type === "battery" || textQuiz });
  if (error) return send(res, 400, { error });

  const battery = type === "battery" ? batteryFields(body) : null;
  const quiz = type === "brand-boost-quiz" ? quizFields(body) : null;
  const signals = requestSignals(req, res);
  const attr = withSignals(cleanAttribution(body.attribution), signals);
  const eventId = text(body.eventId, 120);
  const value = Number(body.value) > 0 ? Math.min(Number(body.value), 100000) : 0;
  const url = `https://www.ceoturbo.com${text(body.page, 120) || "/"}`;
  const ip = signals.ip || clientIp(req);
  const user = { email: lead.email, phone: lead.phone, name: lead.name, externalId: text(body.visitorId, 60) || quiz?.quizId || undefined };

  const capi = sendMetaEvents([
    buildEvent({
      eventName: "Lead",
      eventId,
      url,
      user,
      attribution: attr,
      ip,
      userAgent: req.headers["user-agent"],
      customData: {
        lead_source: type,
        ...(dev ? { content_name: "Developer intake", content_category: [dev.platform, dev.stage].filter(Boolean).join(" · ") } : {}),
        ...(quiz ? { content_name: "Brand Boost quiz", content_category: [quiz.audience, quiz.stage].filter(Boolean).join(" · ") } : {}),
        ...(value ? { value, currency: "USD" } : {}),
      },
    }),
  ]);
  const tiktok = sendTiktokEvents([
    buildTiktokEvent({ event: "Lead", eventId, url, user, attribution: attr, ip, userAgent: req.headers["user-agent"], properties: { content_name: quiz ? "Brand Boost quiz" : dev ? "Developer intake" : type, ...(value ? { value, currency: "USD" } : {}) } }),
  ]);
  const { stored } = await forwardLead({
    type,
    ...lead,
    ...(dev ? { business: lead.business || dev.appUrl, appUrl: dev.appUrl, platform: dev.platform, stage: dev.stage, budget: dev.budget, blocker: dev.blocker } : {}),
    ...(quiz ?? {}),
    ...(quiz ? scoreLead(quiz) : {}),
    ...(battery ?? {}),
    service: text(body.service, 80),
    value: value || undefined,
    product: text(body.product, 120),
    style: text(body.style, 40),
    pack: text(body.pack, 40),
    total: text(body.total, 20),
    note: dev ? dev.note : battery ? battery.note : text(body.note, 500),
    page: text(body.page, 120),
    eventId,
    ...attr,
  });
  const [meta] = await Promise.all([capi, tiktok]);
  return send(res, 200, { ok: true, stored: !!stored, meta: !!meta.sent });
}
