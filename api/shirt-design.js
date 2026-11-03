// POST /api/shirt-design — a finished custom shirt design from /custom-company-t-shirts or /artist-merch.
// The print-ready PNG(s) and a mockup JPEG go to the leads Apps Script, which saves them to a Google
// Drive folder and adds a row to the "Shirt Designs" tab (with the Drive links). The buyer then
// checks out on Shopify; every cart line carries the same Design ID, so a paid order on the
// "Shirt Orders" tab points straight at its print file. See docs/company-shirts.md.
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { cleanAttribution, requestSignals, withSignals } from "./_lib/meta-capi.js";
import { deliveryResult } from "./_lib/leads.js";

/** Vercel caps request bodies at 4.5 MB; the browser keeps the print file under ~2.6 MB of base64. */
const MAX_BODY = 4_400_000;
const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");
const csvSafe = (v) => (typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

/** A base64 data URL of the given type, or "" (never trusts the browser's file). */
export function dataUrl(v, type) {
  if (typeof v !== "string") return "";
  const m = v.match(new RegExp(`^data:${type.replace("/", "\\/")};base64,([A-Za-z0-9+/]+={0,2})$`));
  return m && m[1].length > 100 ? m[1] : "";
}

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

/** Validates a design. Returns { design } or { error } (exported for tests). */
export function cleanDesign(body) {
  const designId = text(body.designId, 40);
  if (!/^(CT|AM)-[A-Z0-9]{6,12}$/.test(designId)) return { error: "designId" };
  const front = dataUrl(body.frontPng, "image/png");
  if (!front) return { error: "frontPng" };
  const back = body.backPng ? dataUrl(body.backPng, "image/png") : "";
  if (body.backPng && !back) return { error: "backPng" };
  const mockup = body.mockupJpg ? dataUrl(body.mockupJpg, "image/jpeg") : "";
  const sizes = Object.fromEntries(SIZES.map((s) => [s, Math.max(0, Math.min(999, Math.floor(Number(body.sizes?.[s]) || 0)))]).filter(([, q]) => q > 0));
  return {
    design: {
      // The design id prefix decides the line (AM- = artist merch), never the browser's own label.
      kind: designId.startsWith("AM-") ? "Artist merch" : "Company shirt",
      designId,
      style: text(body.style, 20),
      color: text(body.color, 30),
      placement: text(body.placement, 20),
      backPrint: back ? "Yes" : "No",
      text: text(body.text, 80),
      subtext: text(body.subtext, 80),
      backText: text(body.backText, 600),
      logoName: text(body.logoName, 160),
      font: text(body.font, 30),
      dpi: Math.max(0, Math.min(600, Number(body.dpi) || 0)),
      sizes: Object.entries(sizes).map(([s, q]) => `${s}×${q}`).join(", "),
      quantity: Object.values(sizes).reduce((n, q) => n + q, 0),
      total: Number(body.total) > 0 ? Math.min(Number(body.total), 100000).toFixed(2) : "",
      business: text(body.business, 140),
      page: text(body.page, 120),
    },
    files: { front, back, mockup },
  };
}

async function postDesign(url, payload) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.LEADS_WEBHOOK_SECRET || "", ...payload }),
        redirect: "follow",
        signal: AbortSignal.timeout(25_000),
      });
      const body = await res.text().catch(() => "");
      const r = deliveryResult(res.status, body);
      if (r.ok) {
        // The Apps Script answers {"ok":true,"front":"https://drive…"} with the saved file links.
        try {
          return { ok: true, links: JSON.parse(body) };
        } catch {
          return { ok: true, links: {} };
        }
      }
      console.error(`[shirt-design] sheet said: ${r.reason}`);
      if (!r.retry) break;
    } catch (e) {
      console.error(`[shirt-design] ${e?.message || "network"}`);
    }
  }
  return { ok: false };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (!isJson(req)) return send(res, 415, { error: "content-type" });
  if (rateLimited(`shirt:${clientIp(req)}`, 12, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req, MAX_BODY);
  } catch {
    return send(res, 413, { error: "body" });
  }
  const { design, files, error } = cleanDesign(body);
  if (error) return send(res, 400, { error });

  const attr = withSignals(cleanAttribution(body.attribution), requestSignals(req, res));
  const record = Object.fromEntries(Object.entries({ type: "shirt-design", ...design, ...attr, receivedAt: new Date().toISOString() }).map(([k, v]) => [k, csvSafe(v)]));

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) {
    if (!process.env.VERCEL) {
      // Local development: keep the files next to the local leads file.
      const dir = path.resolve(".leads/designs");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, `${design.designId}-front.png`), Buffer.from(files.front, "base64"));
      if (files.back) await writeFile(path.join(dir, `${design.designId}-back.png`), Buffer.from(files.back, "base64"));
      await appendFile(path.resolve(".leads/leads.jsonl"), `${JSON.stringify(record)}\n`);
      return send(res, 200, { ok: true, stored: "local-file" });
    }
    console.error("[shirt-design] LEADS_WEBHOOK_URL is not set — design not saved:", JSON.stringify(record));
    return send(res, 200, { ok: true, stored: false });
  }
  const r = await postDesign(url, { ...record, frontPng: files.front, backPng: files.back, mockupJpg: files.mockup });
  if (!r.ok) console.error("[shirt-design] NOT SAVED:", JSON.stringify(record));
  return send(res, 200, { ok: true, stored: r.ok, front: r.links?.front || "", back: r.links?.back || "", mockup: r.links?.mockup || "" });
}
