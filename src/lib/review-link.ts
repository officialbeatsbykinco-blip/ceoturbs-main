// Helpers for finding and checking a Google review link (no API keys needed).

export type LinkCheck =
  | { ok: true; url: string; kind: "review"; message: string }
  | { ok: false; url?: string; kind: "fixable" | "profile" | "invalid"; message: string };

/** Classifies a pasted link and, when possible, turns it into a direct "write a review" link. */
export function checkReviewLink(input: string): LinkCheck {
  const raw = input.trim();
  if (!raw) return { ok: false, kind: "invalid", message: "Paste the link Google gave you." };
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, kind: "invalid", message: "That doesn't look like a link. Copy it again from Google." };
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const p = url.pathname;

  if (host === "g.page" && /^\/r\/[\w-]+\/review\/?$/.test(p)) {
    return { ok: true, kind: "review", url: `https://g.page${p.replace(/\/$/, "")}`, message: "Perfect — this opens your review form directly." };
  }
  if (host === "g.page" && /^\/r\/[\w-]+\/?$/.test(p)) {
    const fixed = `https://g.page${p.replace(/\/$/, "")}/review`;
    return { ok: false, kind: "fixable", url: fixed, message: "Almost. This opens your profile — add /review so it opens the review form." };
  }
  if (host === "search.google.com" && p.startsWith("/local/writereview") && url.searchParams.get("placeid")) {
    return { ok: true, kind: "review", url: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(url.searchParams.get("placeid")!)}`, message: "Perfect — this opens your review form directly." };
  }
  if (["maps.app.goo.gl", "goo.gl", "g.co", "maps.google.com", "google.com"].includes(host) || host.endsWith(".google.com")) {
    return { ok: false, kind: "profile", message: "This link opens your Google listing, not the review form. Use “Ask for reviews” (or “Get more reviews”) in your Business Profile and copy that link instead." };
  }
  return { ok: false, kind: "invalid", message: "This isn't a Google review link. It should start with g.page/r/ or search.google.com/local/writereview." };
}

/** Opens Google Search for the business — owners signed in to Google see their Business Profile controls there. */
export const googleSearchUrl = (name: string, city = "") => `https://www.google.com/search?q=${encodeURIComponent([name, city].filter(Boolean).join(" "))}`;
export const googleMapsUrl = (name: string, city = "") => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, city].filter(Boolean).join(" "))}`;

const KEY = "ct_business";

/** The business name a visitor typed on the shop, reused on the setup guide. */
export function rememberBusiness(name: string) {
  try {
    if (name.trim()) localStorage.setItem(KEY, name.trim().slice(0, 100));
  } catch {
    /* storage blocked */
  }
}
export function recallBusiness(): string {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}
