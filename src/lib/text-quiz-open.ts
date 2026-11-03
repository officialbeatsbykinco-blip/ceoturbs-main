// Opens the text quiz sheet (src/components/quiz/TextQuizSheet.tsx) from any button on the page.
import type { Audience } from "@/content/quiz";

export type TextQuizOpen = { source?: string; audience?: Audience };

declare global {
  interface Window {
    __ctTextQuiz?: boolean;
  }
}

/** Returns false when the sheet isn't ready (no JS yet), so the caller can fall back to its own link. */
export function openTextQuiz(detail: TextQuizOpen = {}): boolean {
  if (typeof window === "undefined" || !window.__ctTextQuiz) return false;
  window.dispatchEvent(new CustomEvent<TextQuizOpen>("ct:text-quiz", { detail }));
  return true;
}
