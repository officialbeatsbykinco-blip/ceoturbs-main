// Always mounted (in Layout): listens for "Text us" taps and loads the sheet on first use.
import { lazy, Suspense, useEffect, useState } from "react";
import type { TextQuizOpen } from "@/lib/text-quiz-open";

const TextQuizSheet = lazy(() => import("./TextQuizSheet"));

export function TextQuizHost() {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const [detail, setDetail] = useState<TextQuizOpen>({});

  useEffect(() => {
    window.__ctTextQuiz = true;
    const onOpen = (e: Event) => {
      setDetail((e as CustomEvent<TextQuizOpen>).detail ?? {});
      setUsed(true);
      setOpen(true);
    };
    window.addEventListener("ct:text-quiz", onOpen);
    return () => {
      window.__ctTextQuiz = false;
      window.removeEventListener("ct:text-quiz", onOpen);
    };
  }, []);

  if (!used) return null;
  return (
    <Suspense fallback={null}>
      <TextQuizSheet open={open} setOpen={setOpen} detail={detail} />
    </Suspense>
  );
}
