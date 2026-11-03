// Microsoft Clarity (session recordings + heatmaps for the ad landing pages). The project id is
// built in; VITE_CLARITY_ID overrides it. Form fields carry data-clarity-mask so names, emails and
// phone numbers are never recorded; see the privacy policy.
export const DEFAULT_CLARITY_ID = "ywmvopjye1";
let started = false;

export function startClarity() {
  // An override must look like a Clarity project id (short, lowercase letters/digits); anything else, such as a
  // pasted API token, is ignored so it can never break the tag.
  const override = import.meta.env.VITE_CLARITY_ID as string | undefined;
  const id = override && /^[a-z0-9]{6,16}$/.test(override.trim()) ? override.trim() : DEFAULT_CLARITY_ID;
  if (!id || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { clarity?: (...args: unknown[]) => void };
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      ((w.clarity as unknown as { q?: unknown[] }).q = (w.clarity as unknown as { q?: unknown[] }).q || []).push(args);
    };
  // No cookie banner (US audience): grant up front so sessions link across pages.
  w.clarity("consentv2", { ad_Storage: "granted", analytics_Storage: "granted" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/** Tags the recording with a conversion so sessions can be filtered by it in Clarity. No-op until Clarity has started. */
export function clarityEvent(name: string) {
  if (typeof window === "undefined") return;
  (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity?.("event", name);
}
