// Tiny helpers that work the same on Vercel Node functions and the local Vite dev server.

export async function readJson(req, limit = 20_000) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > limit) throw new Error("too-large");
  }
  return raw ? JSON.parse(raw) : {};
}

export function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}

export function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.socket?.remoteAddress || "unknown";
}

// Best-effort per-instance rate limit (serverless instances are short-lived; this stops bursts and bots).
const hits = new Map();
export function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

/** Form endpoints only take JSON (blocks cross-site HTML form posts, which can't send it). */
export const isJson = (req) => /^application\/json\b/i.test(String(req.headers["content-type"] || ""));

/** Only accept browser POSTs from our own pages. */
export function sameOrigin(req) {
  const origin = req.headers.origin;
  // Browsers always send Origin on a POST; a missing one is only accepted when the browser says same-origin.
  if (!origin) return req.headers["sec-fetch-site"] === undefined ? !!req.headers.referer && refererOk(req) : req.headers["sec-fetch-site"] === "same-origin";
  try {
    const host = new URL(origin).host;
    return host === req.headers.host || host === req.headers["x-forwarded-host"] || /(^|\.)ceoturbo\.com$/.test(host) || /^localhost(:\d+)?$/.test(host) || /^127\.0\.0\.1(:\d+)?$/.test(host);
  } catch {
    return false;
  }
}

function refererOk(req) {
  try {
    const host = new URL(req.headers.referer).host;
    return host === req.headers.host || /(^|\.)ceoturbo\.com$/.test(host) || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  } catch {
    return false;
  }
}
