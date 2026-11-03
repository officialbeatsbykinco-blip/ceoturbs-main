// The "how many reviews will I get" math on the store home. Every input is the visitor's own number;
// nothing here is a promise, and the page says so.
import { REVIEW_CARD, type ReviewPack } from "@/config/site";

export type GoalInput = {
  /** Customers served in a typical week. */
  perWeek: number;
  /** Share of them you hand the card to or point at it, 0–100. */
  askPct: number;
  /** Share of the people asked who post, 0–100. A modest default: asking face to face works, not every time. */
  postPct: number;
};

const WEEKS_PER_MONTH = 4.33;

export function monthlyReviews({ perWeek, askPct, postPct }: GoalInput) {
  const n = (perWeek * WEEKS_PER_MONTH * (askPct / 100) * (postPct / 100));
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

/** Months to add `goal` new reviews at this pace; null when the pace is zero. */
export function monthsToGoal(goal: number, perMonth: number) {
  return perMonth > 0 ? Math.max(1, Math.ceil(goal / perMonth)) : null;
}

/** The smallest pack that covers one card per person who serves customers; never fewer than one. */
export function suggestPack(people: number): ReviewPack {
  const packs = REVIEW_CARD.packs;
  return packs.find((p) => p.qty >= Math.max(1, people)) ?? packs[packs.length - 1];
}
