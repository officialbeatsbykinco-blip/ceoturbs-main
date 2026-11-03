// Always mounted (in Layout): listens for "Book" clicks and loads the quiz dialog on first use.
import { lazy, Suspense, useEffect, useState } from "react";
import type { QuizOpen } from "@/lib/quiz-open";

const QuizModal = lazy(() => import("./QuizModal"));

export function QuizModalHost() {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const [detail, setDetail] = useState<QuizOpen>({});

  useEffect(() => {
    window.__ctQuizModal = true;
    const onOpen = (e: Event) => {
      setDetail((e as CustomEvent<QuizOpen>).detail ?? {});
      setUsed(true);
      setOpen(true);
    };
    window.addEventListener("ct:quiz", onOpen);
    // Warm the dialog + quiz code on the first interaction, so the first "Book" tap opens instantly.
    const warm = () => {
      events.forEach((ev) => window.removeEventListener(ev, warm));
      void import("./QuizModal");
    };
    const events = ["pointerdown", "scroll", "keydown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, warm, { once: true, passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, warm));
      window.__ctQuizModal = false;
      window.removeEventListener("ct:quiz", onOpen);
    };
  }, []);

  if (!used) return null;
  return (
    <Suspense fallback={null}>
      <QuizModal open={open} setOpen={setOpen} detail={detail} />
    </Suspense>
  );
}
