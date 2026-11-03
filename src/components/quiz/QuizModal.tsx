// The quiz in a dialog, opened by any "Book a call" button on pages without a hero quiz.
// Loaded by QuizModalHost the first time it's needed, so the dialog code never weighs on page load.
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { openBooking } from "@/lib/cal";
import type { QuizOpen } from "@/lib/quiz-open";
import { BrandBoostQuiz } from "./BrandBoostQuiz";

export default function QuizModal({ open, setOpen, detail }: { open: boolean; setOpen: (o: boolean) => void; detail: QuizOpen }) {
  const source = detail.source || "Book button";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="audit-card max-h-[100dvh] max-w-xl overflow-y-auto border-0 p-5 max-sm:h-[100dvh] max-sm:max-w-none max-sm:rounded-none sm:max-h-[92vh] sm:rounded-3xl sm:p-7">
        <DialogTitle className="sr-only">Get your free Brand Boost plan</DialogTitle>
        <DialogDescription className="sr-only">Answer a few quick questions, then pick a time for your free {"30-minute"} call.</DialogDescription>
        {open && (
          <BrandBoostQuiz
            variant="modal"
            source={source}
            prefill={detail.prefill}
            className="pt-4"
            onSkip={() => {
              setOpen(false);
              window.setTimeout(() => void openBooking(`${source} — skipped quiz`, detail.prefill), 150);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
