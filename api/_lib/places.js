// Google Places API (New) lookup for the free check: the business's real Google rating,
// review count and profile status, plus the top competitors for its category in its city.
// Optional: without GOOGLE_PLACES_API_KEY (or on any error) every function returns null and
// the audit falls back to what the visitor told us.

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const FIELDS = [
  "places.id",
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.primaryTypeDisplayName",
  "places.formattedAddress",
].join(",");

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const shape = (p) => ({
  id: p.id || "",
  name: p.displayName?.text || "",
  rating: typeof p.rating === "number" ? p.rating : null,
  reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : 0,
  status: p.businessStatus || "",
  website: p.websiteUri || "",
  mapsUrl: p.googleMapsUri || "",
  category: p.primaryTypeDisplayName?.text || "",
  address: p.formattedAddress || "",
});

export function placesEnabled() {
  return !!process.env.GOOGLE_PLACES_API_KEY;
}

async function searchText(textQuery, max = 5, fetchImpl = fetch) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !textQuery) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
      body: JSON.stringify({ textQuery, maxResultCount: max, languageCode: "en" }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      console.error("[places] HTTP", res.status);
      return null;
    }
    const data = await res.json();
    return Array.isArray(data?.places) ? data.places.map(shape) : [];
  } catch (e) {
    console.error("[places] failed", e?.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** True when a Places result plausibly is the business the visitor typed. */
export function sameBusiness(placeName, typed) {
  const a = norm(placeName);
  const b = norm(typed);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const words = b.split(" ").filter((w) => w.length > 2);
  if (!words.length) return false;
  const hits = words.filter((w) => a.split(" ").includes(w)).length;
  return hits / words.length >= 0.6;
}

/**
 * Looks up { name, what, city } on Google.
 * Returns { found, place, competitors } or null when Places isn't available.
 */
export async function lookupPlaces({ name, what, city }, fetchImpl = fetch) {
  if (!placesEnabled() || !name) return null;
  const [own, rivals] = await Promise.all([
    searchText(`${name}${city ? ` ${city}` : ""}`, 5, fetchImpl),
    what && city ? searchText(`${what} in ${city}`, 8, fetchImpl) : Promise.resolve([]),
  ]);
  if (own === null) return null;
  const place = own.find((p) => sameBusiness(p.name, name)) || null;
  const competitors = (rivals || [])
    .filter((p) => p.status !== "CLOSED_PERMANENTLY" && (!place || p.id !== place.id) && !sameBusiness(p.name, name))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 3);
  return { found: !!place, place, competitors };
}
