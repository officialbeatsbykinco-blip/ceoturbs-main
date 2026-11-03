import { describe, expect, it } from "vitest";
import { monthlyReviews, monthsToGoal, suggestPack } from "@/lib/review-goal";

describe("review goal math", () => {
  it("turns weekly customers into monthly reviews", () => {
    expect(monthlyReviews({ perWeek: 25, askPct: 80, postPct: 25 })).toBe(22);
    expect(monthlyReviews({ perWeek: 0, askPct: 80, postPct: 25 })).toBe(0);
  });
  it("gives months to a goal, or null with no pace", () => {
    expect(monthsToGoal(50, 22)).toBe(3);
    expect(monthsToGoal(50, 0)).toBeNull();
  });
  it("picks the smallest pack with a card per person", () => {
    expect(suggestPack(1).qty).toBe(1);
    expect(suggestPack(3).qty).toBe(5);
    expect(suggestPack(40).qty).toBe(10);
  });
});
