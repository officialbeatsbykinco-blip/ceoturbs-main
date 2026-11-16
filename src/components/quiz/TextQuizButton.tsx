// "Text us" on a phone: opens the tap-question text quiz (src/components/quiz/TextQuizSheet.tsx), which ends in a
// filled-in text to our number and a row in the sheet. A button, not an sms: link, so the click-to-text listener
// doesn't count the tap twice (the quiz fires its own generate_lead). If the sheet isn't ready yet, it falls back
// to a plain text to the same number.
import type { ReactNode } from "react";
import type { Audience } from "@/content/quiz";
import { smsHref } from "@/lib/sms";
import { openTextQuiz } from "@/lib/text-quiz-open";

export function TextQuizButton({ source, fallback, audience, className, children, tabIndex }: { source: string; fallback: string; audience?: Audience; className?: string; children: ReactNode; tabIndex?: number }) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      data-cta-location={source}
      className={className}
      onClick={() => {
        if (!openTextQuiz({ source, audience })) window.location.href = smsHref(fallback);
      }}
    >
      {children}
    </button>
  );
}
