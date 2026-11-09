// Always mounted (in Layout): listens for "Fix my tech" taps on phones and loads the sheet on first use.
import { lazy, Suspense, useEffect, useState } from "react";

const TechQuizSheet = lazy(() => import("./TechQuizSheet"));

export function TechQuizHost() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("");

  useEffect(() => {
    window.__ctTechQuiz = true;
    const onOpen = (e: Event) => {
      setSource((e as CustomEvent<string>).detail || "tech button");
      setOpen(true);
    };
    window.addEventListener("ct:tech-quiz", onOpen);
    return () => {
      window.__ctTechQuiz = false;
      window.removeEventListener("ct:tech-quiz", onOpen);
    };
  }, []);

  if (!source) return null;
  return (
    <Suspense fallback={null}>
      <TechQuizSheet open={open} setOpen={setOpen} source={source} />
    </Suspense>
  );
}
