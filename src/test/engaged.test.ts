import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onEngaged } from "@/lib/engaged";

describe("onEngaged", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("waits for the first interaction and runs once", () => {
    const fn = vi.fn();
    onEngaged(fn, 8000);
    expect(fn).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("pointerdown"));
    vi.advanceTimersByTime(9000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("falls back to the timer for a visitor who never interacts", () => {
    const fn = vi.fn();
    onEngaged(fn, 8000);
    vi.advanceTimersByTime(8000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does nothing once cancelled", () => {
    const fn = vi.fn();
    onEngaged(fn, 8000)();
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(9000);
    expect(fn).not.toHaveBeenCalled();
  });
});
