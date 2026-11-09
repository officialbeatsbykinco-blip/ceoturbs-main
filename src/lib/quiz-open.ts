// Every "Book a call" button routes through the Brand Boost quiz: on pages where the quiz is the hero it
// scrolls there, everywhere else it opens the quiz in a dialog (src/components/quiz/QuizModal.tsx).
import { track, serverTrack } from "@/lib/track";

export type QuizOpen = { source?: string; prefill?: string };

declare global {
  interface Window {
    __ctQuizModal?: boolean;
  }
}

/** Returns false when no quiz is available (no JS yet), so the caller can fall back to the calendar. */
export function openQuiz(detail: QuizOpen = {}): boolean {
  if (typeof window === "undefined") return false;
  const hero = document.querySelector<HTMLElement>('[data-quiz-inline="primary"]');
  if (hero) {
    const id = track("booking_open", { source: detail.source, via: "quiz-scroll", content_name: "Brand Boost quiz scroll" });
    serverTrack("booking_open", id, { contentName: "Brand Boost quiz scroll" });
    // Quiz already done: go straight to the booking calendar, not back to the top of the plan.
    (hero.querySelector<HTMLElement>("[data-quiz-cal]") ?? hero).scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => hero.querySelector<HTMLElement>("[data-quiz-focus]")?.focus({ preventScroll: true }), 450);
    return true;
  }
  if (!window.__ctQuizModal) return false;
  const id = track("booking_open", { source: detail.source, via: "quiz-modal", content_name: "Brand Boost quiz modal" });
  serverTrack("booking_open", id, { contentName: "Brand Boost quiz modal" });
  window.dispatchEvent(new CustomEvent<QuizOpen>("ct:quiz", { detail }));
  return true;
}
