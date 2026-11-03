import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Logo } from "@/components/site/Logo";

const embeds = () => document.querySelectorAll<HTMLScriptElement>('script[src="https://app.cal.com/embed/embed.js"]');

describe("Cal.com embed loader", () => {
  let loadCal: typeof import("@/lib/cal").loadCal;
  beforeEach(async () => {
    document.head.innerHTML = "";
    delete (window as unknown as Record<string, unknown>).Cal;
    vi.resetModules(); // the loader keeps module-level state
    ({ loadCal } = await import("@/lib/cal"));
  });

  it("does not stay broken after one failed load: the next call retries", async () => {
    const first = loadCal();
    embeds()[0].dispatchEvent(new Event("error"));
    expect(await first).toBe(false);

    const second = loadCal();
    expect(embeds()).toHaveLength(1);
    embeds()[0].dispatchEvent(new Event("load"));
    expect(await second).toBe(true);
  });

  type Queued = unknown[];
  const queue = (ns: string) => (((window as unknown as { Cal: unknown }).Cal as unknown as { ns: Record<string, { q: Queued[] }> }).ns[ns]?.q ?? []) as Queued[];
  const fire = (ns: string, action: string) =>
    queue(ns)
      .filter((a) => a[0] === "on" && (a[1] as { action: string }).action === action)
      .forEach((a) => (a[1] as { callback: () => void }).callback());

  it("points the embed at app.cal.com, where the booking app and embed.js live", () => {
    void loadCal();
    const init = queue("ceoturbo-brandboost").find((a) => a[0] === "init");
    expect(init?.[2]).toEqual({ origin: "https://app.cal.com" });
  });

  it("listens for a finished booking on both calendars (the quiz's and the site-wide modal)", () => {
    void loadCal("brandboostquiz");
    for (const ns of ["ceoturbo-brandboost", "brandboostquiz"]) {
      const actions = queue(ns)
        .filter((a) => a[0] === "on")
        .map((a) => (a[1] as { action: string }).action);
      expect(actions).toContain("bookingSuccessfulV2");
    }
  });

  it("reports a booking page that fails to load, so the visitor gets a working link instead of a blank box", async () => {
    document.body.innerHTML = '<div id="cal-test"></div>';
    const { mountInlineBooking, QUIZ_NS } = await import("@/lib/cal");
    const mounted = mountInlineBooking("cal-test", "test", undefined, { ns: QUIZ_NS });
    embeds()[0].dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 0));
    fire(QUIZ_NS, "linkFailed");
    expect(await mounted).toBe("failed");
  });

  it("gives every mounted calendar its own namespace, so a popup calendar isn't ignored when the page already has one", async () => {
    const { InlineBooking } = await import("@/components/booking/InlineBooking");
    const { unmount } = render(
      <>
        <InlineBooking source="page" />
        <InlineBooking source="popup" />
      </>,
    );
    embeds()[0].dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 0));
    const own = Object.keys(((window as unknown as { Cal: unknown }).Cal as unknown as { ns: Record<string, unknown> }).ns).filter((n) => n.startsWith("ceoturbo-brandboost-cal-inline-"));
    expect(own).toHaveLength(2);
    unmount();
  });

  it("resolves true once the calendar shows times", async () => {
    document.body.innerHTML = '<div id="cal-test"></div>';
    const { mountInlineBooking, QUIZ_NS } = await import("@/lib/cal");
    const mounted = mountInlineBooking("cal-test", "test", undefined, { ns: QUIZ_NS });
    embeds()[0].dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 0));
    fire(QUIZ_NS, "linkReady");
    expect(await mounted).toBe("ready");
  });

  it("does not call a calendar that never confirms it loaded (the blank box) working", async () => {
    vi.useFakeTimers();
    try {
      document.body.innerHTML = '<div id="cal-test"></div>';
      const { mountInlineBooking, QUIZ_NS } = await import("@/lib/cal");
      const mounted = mountInlineBooking("cal-test", "test", undefined, { ns: QUIZ_NS });
      embeds()[0].dispatchEvent(new Event("load"));
      await vi.advanceTimersByTimeAsync(13000);
      expect(await mounted).toBe("timeout");
    } finally {
      vi.useRealTimers();
    }
  });

  it("sends a failed modal calendar to the booking page in the same tab, with ad click ids for the webhook", async () => {
    localStorage.setItem("ct_attr", JSON.stringify({ gclid: "G1", msclkid: "M1", at: Date.now() }));
    const assign = vi.fn();
    const loc = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...loc, pathname: "/brand-boost", assign } });
    try {
      const { openBooking } = await import("@/lib/cal");
      const opened = openBooking("test", "hi", { email: "a@b.co" }, { meta: { quizId: "q1" } });
      embeds()[0].dispatchEvent(new Event("load"));
      await new Promise((r) => setTimeout(r, 0));
      fire("ceoturbo-brandboost", "linkFailed");
      await opened;
      expect(assign).toHaveBeenCalledTimes(1);
      const url = new URL(assign.mock.calls[0][0]);
      expect(url.origin + url.pathname).toBe("https://cal.com/stackmodechris/ceoturbo-brandboost");
      expect(url.searchParams.get("email")).toBe("a@b.co");
      expect(url.searchParams.get("notes")).toBe("hi");
      expect(url.searchParams.get("metadata[gclid]")).toBe("G1");
      expect(url.searchParams.get("metadata[msclkid]")).toBe("M1");
      expect(url.searchParams.get("metadata[quizId]")).toBe("q1");
      expect(url.searchParams.get("metadata[source]")).toBe("test");
      expect(url.searchParams.has("layout")).toBe(false);
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: loc });
      localStorage.clear();
    }
  });

  it("leaves a slow modal calendar alone (Cal.com's own loader) and uses the official embed config", async () => {
    vi.useFakeTimers();
    const assign = vi.fn();
    const loc = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...loc, assign } });
    try {
      const { openBooking } = await import("@/lib/cal");
      const opened = openBooking("test");
      embeds()[0].dispatchEvent(new Event("load"));
      await vi.advanceTimersByTimeAsync(25000);
      await opened;
      expect(assign).not.toHaveBeenCalled();
      expect(document.getElementById("ct-cal-rescue")).toBeNull();
      const modal = queue("ceoturbo-brandboost").find((a) => a[0] === "modal")?.[1] as { calLink: string; config: Record<string, string> };
      expect(modal.calLink).toBe("stackmodechris/ceoturbo-brandboost");
      expect(modal.config.layout).toBe("month_view");
      expect(modal.config.useSlotsViewOnSmallScreen).toBe("true");
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: loc });
      vi.useRealTimers();
    }
  });

  it("uses the dashboard's inline embed look: blue brand in dark mode, event details shown", () => {
    void loadCal("brandboostquiz");
    for (const ns of ["ceoturbo-brandboost", "brandboostquiz"]) {
      const ui = queue(ns).find((a) => a[0] === "ui")?.[1] as Record<string, unknown>;
      expect(ui).toMatchObject({ theme: "dark", layout: "month_view", hideEventTypeDetails: true, cssVarsPerTheme: { dark: { "cal-brand": "#0093ff" } } });
    }
  });

  it("opens the on-page inline calendar dialog instead of Cal's pop-up or the booking page", async () => {
    const assign = vi.fn();
    const loc = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...loc, assign } });
    const seen: unknown[] = [];
    const listen = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener("ct:booking", listen);
    window.__ctBookingModal = true;
    try {
      const { openBooking } = await import("@/lib/cal");
      await openBooking("audit", "hi", { email: "a@b.co" });
      expect(seen).toEqual([{ source: "audit", prefill: "hi", person: { email: "a@b.co" } }]);
      expect(embeds()).toHaveLength(0);
      expect(assign).not.toHaveBeenCalled();
    } finally {
      window.__ctBookingModal = false;
      window.removeEventListener("ct:booking", listen);
      Object.defineProperty(window, "location", { configurable: true, value: loc });
    }
  });

  it("shares one script between callers once it is loading", async () => {
    const a = loadCal();
    const b = loadCal("brandboostquiz");
    expect(embeds()).toHaveLength(1);
    embeds()[0].dispatchEvent(new Event("load"));
    expect(await Promise.all([a, b])).toEqual([true, true]);
  });
});

describe("header logo", () => {
  it("links home and scrolls to the top when you are already on the homepage", () => {
    let scrolled = false;
    window.scrollTo = (() => {
      scrolled = true;
    }) as typeof window.scrollTo;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Logo />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /ceo turbo home/i });
    expect(link.getAttribute("href")).toBe("/");
    fireEvent.click(link);
    expect(scrolled).toBe(true);
  });

  it("is a normal link to / from inner pages", () => {
    render(
      <MemoryRouter initialEntries={["/pricing"]}>
        <Logo />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /ceo turbo home/i }).getAttribute("href")).toBe("/");
  });
});
