import { describe, it, expect, beforeEach, vi } from "vitest";
import { GOOGLE_ADS_ID, GOOGLE_ADS_LABELS } from "@/lib/ga";

type Win = Window & { uetq?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] };
const w = window as Win;

/** Loads a fresh copy of the tracking modules so each test starts with no dedupe / Meta state. */
async function setup() {
  vi.resetModules();
  sessionStorage.clear();
  localStorage.clear();
  delete w.uetq;
  w.dataLayer = [];
  const gtag: unknown[][] = [];
  const fbq: unknown[][] = [];
  w.gtag = (...a) => void gtag.push(a);
  w.fbq = (...a) => void fbq.push(a);
  const track = await import("@/lib/track");
  track.metaPixelReady();
  return { ...track, gtag, fbq };
}

const uetEvents = () => (w.uetq ?? []).filter((x) => x === "event");
/** uetq entries are flat ("event", "book_appointment", {...}) pushes: group them back into calls. */
const uetCalls = () => {
  const out: unknown[][] = [];
  const q = (w.uetq ?? []) as unknown[];
  for (let i = 0; i < q.length; ) {
    const head = q[i];
    const n = head === "event" || head === "consent" ? 3 : head === "set" ? 2 : 1;
    out.push(q.slice(i, i + n));
    i += n;
  }
  return out;
};

describe("booked-call tracking (browser)", () => {
  beforeEach(() => {
    delete w.uetq;
  });

  it("sends Microsoft UET a book_appointment event, consent first, with enhanced-conversion data", async () => {
    const { trackBooked } = await setup();
    trackBooked("embed", "UID1", { email: "Buyer@Example.com ", phone: "(404) 555-0123", name: "Test Buyer" });

    const calls = uetCalls();
    expect(calls[0]).toEqual(["consent", "default", { ad_storage: "granted" }]);
    expect(calls[1]).toEqual(["set", { pid: { em: "buyer@example.com", ph: "+14045550123" } }]);
    const ev = calls.filter((c) => c[0] === "event");
    expect(ev).toHaveLength(1);
    expect(ev[0][1]).toBe("book_appointment");
    expect(ev[0][2]).toMatchObject({ event_category: "lead", event_label: "cal.com" });
  });

  it("uses the quiz's call value as revenue and labels the source", async () => {
    const { trackBooked, setCallContext } = await setup();
    setCallContext({ value: 150, user: { email: "q@example.com", phone: "4045550100", name: "Quiz Person" } });
    trackBooked("embed", "UID2");
    const ev = uetCalls().find((c) => c[0] === "event")!;
    expect(ev[2]).toMatchObject({ event_label: "brand-boost-quiz", revenue_value: 150, currency: "USD" });
    // the quiz already told us who this is, so the booking still carries match data
    expect(uetCalls().some((c) => c[0] === "set")).toBe(true);
  });

  it("fires one book_call with a stable per-booking id on every platform", async () => {
    const { trackBooked, gtag, fbq } = await setup();
    trackBooked("embed", "UID3", { email: "a@example.com", phone: "4045550123" });

    const layer = (w.dataLayer as { event?: string; event_id?: string }[]).filter((e) => e.event === "book_call");
    expect(layer).toHaveLength(1);
    expect(layer[0].event_id).toBe("book_UID3");

    const conv = gtag.filter((a) => a[0] === "event" && a[1] === "conversion");
    expect(conv).toHaveLength(1);
    expect(conv[0][2]).toMatchObject({ send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABELS.book_call}`, transaction_id: "book_UID3" });
    expect(gtag.filter((a) => a[0] === "event" && a[1] === "book_call")).toHaveLength(1);

    const schedule = fbq.filter((a) => a[0] === "track" && a[1] === "Schedule");
    expect(schedule).toHaveLength(1);
    expect(schedule[0][3]).toEqual({ eventID: "book_UID3" });
  });

  it("counts a booking once even if Cal.com reports it twice, but counts the next booking", async () => {
    const { trackBooked } = await setup();
    trackBooked("embed", "UID4");
    trackBooked("embed", "UID4");
    trackBooked("redirect", "UID4");
    expect(uetEvents()).toHaveLength(1);
    trackBooked("embed", "UID5");
    expect(uetEvents()).toHaveLength(2);
  });

  it("a booking with no uid is still counted, once per session", async () => {
    const { trackBooked } = await setup();
    trackBooked("embed");
    trackBooked("embed");
    expect(uetEvents()).toHaveLength(1);
  });

  it("does not report a booking as a lead (and a lead is not a booking)", async () => {
    const { trackBooked, track } = await setup();
    trackBooked("embed", "UID6");
    track("generate_lead", { lead_source: "brand-boost-quiz", value: 20, currency: "USD" });
    const actions = uetCalls().filter((c) => c[0] === "event").map((c) => c[1]);
    expect(actions).toEqual(["book_appointment", "submit_lead_form"]);
  });
});
