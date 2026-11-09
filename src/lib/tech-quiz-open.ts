// Opens the tech repair quiz as a bottom sheet on phones (src/components/tech/TechQuizSheet.tsx), from any
// "Fix my tech" / "Get my price" button. Computers keep going to the page and its Cal.com calendar.
import { canText } from "@/lib/sms";

declare global {
  interface Window {
    __ctTechQuiz?: boolean;
  }
}

/** Opens the sheet on a phone. Returns false (do the link's normal thing) on a computer or before JS is ready. */
export function openTechQuiz(source: string): boolean {
  if (typeof window === "undefined" || !window.__ctTechQuiz || !canText()) return false;
  window.dispatchEvent(new CustomEvent<string>("ct:tech-quiz", { detail: source }));
  return true;
}
