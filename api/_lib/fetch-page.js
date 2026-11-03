// Fetches a visitor-supplied URL safely for the audit.
// - http/https only, default ports only, no credentials in the URL
// - every DNS answer is checked at connect time, so private/internal addresses
//   (localhost, 10.x, 169.254.x cloud metadata, etc.) can never be reached, even via redirects
// - hard limits on time, redirects and response size
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;
export const USER_AGENT = "Mozilla/5.0 (compatible; CEOTurboAudit/1.0; +https://www.ceoturbo.com/free-audit)";

/** True for loopback, private, link-local, CGNAT, multicast and reserved ranges. */
export function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return true;
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIp(mapped[1]);
    return /^(fc|fd|fe8|fe9|fea|feb|ff)/.test(v) || v.startsWith("64:ff9b:") || v.startsWith("2001:db8");
  }
  return true;
}

/** Normalises what a visitor typed ("joesplumbing.com") into a safe public URL, or null. */
export function normalizeUrl(input) {
  if (!input || typeof input !== "string") return null;
  let raw = input.trim();
  if (!raw || raw.length > 300) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.username || url.password) return null;
  if (url.port && !["80", "443"].includes(url.port)) return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost") return null;
  if (net.isIP(host.replace(/^\[|\]$/g, ""))) return null; // raw IPs aren't websites people type
  url.hash = "";
  return url;
}

function safeLookup(hostname, options, callback) {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err);
    const list = Array.isArray(addresses) ? addresses : [{ address: addresses, family: options.family || 4 }];
    const bad = list.find((a) => isPrivateIp(a.address));
    if (bad || !list.length) return callback(new Error("blocked address"));
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

function requestOnce(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const started = Date.now();
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        timeout: timeoutMs,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          return resolve({ redirect: res.headers.location, status, headers: res.headers, ms: Date.now() - started });
        }
        let stream = res;
        const enc = String(res.headers["content-encoding"] || "").toLowerCase();
        if (enc === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (enc === "deflate") stream = res.pipe(zlib.createInflate());
        else if (enc === "br") stream = res.pipe(zlib.createBrotliDecompress());
        const chunks = [];
        let size = 0;
        let truncated = false;
        stream.on("data", (c) => {
          if (truncated) return;
          size += c.length;
          if (size > MAX_BYTES) {
            truncated = true;
            chunks.push(c.subarray(0, Math.max(0, c.length - (size - MAX_BYTES))));
            req.destroy();
            return;
          }
          chunks.push(c);
        });
        const done = () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), ms: Date.now() - started, truncated });
        stream.on("end", done);
        stream.on("close", () => truncated && done());
        stream.on("error", (e) => (truncated ? done() : reject(e)));
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

/**
 * GET a public URL. Resolves { ok, status, url, headers, body, ms } — never throws.
 * `ok` is false (with `error`) for blocked, unreachable or timed-out URLs.
 */
export async function fetchPage(input, { timeoutMs = 8000 } = {}) {
  let url = input instanceof URL ? input : normalizeUrl(input);
  if (!url) return { ok: false, error: "invalid-url" };
  const deadline = Date.now() + timeoutMs;
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const left = deadline - Date.now();
      if (left <= 0) return { ok: false, error: "timeout", url: url.href };
      const res = await requestOnce(url, left);
      if (res.redirect) {
        let next;
        try {
          next = normalizeUrl(new URL(res.redirect, url).href);
        } catch {
          next = null;
        }
        if (!next) return { ok: false, error: "bad-redirect", url: url.href };
        url = next;
        continue;
      }
      return { ok: res.status >= 200 && res.status < 400, status: res.status, url: url.href, headers: res.headers, body: res.body, ms: res.ms };
    }
    return { ok: false, error: "too-many-redirects", url: url.href };
  } catch (e) {
    return { ok: false, error: e && e.message === "blocked address" ? "blocked" : e && e.message === "timeout" ? "timeout" : "unreachable", url: url.href };
  }
}

/** Small JSON GET for public APIs (Wikipedia, Wikidata, MusicBrainz, OpenStreetMap). Returns null on any failure. */
export async function getJson(url, timeoutMs = 5000) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
