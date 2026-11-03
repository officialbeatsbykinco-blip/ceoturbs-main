// The text quiz as a bottom sheet on phones. Loaded by TextQuizHost the first time it's needed.
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import type { TextQuizOpen } from "@/lib/text-quiz-open";
import { TextQuiz } from "./TextQuiz";

export default function TextQuizSheet({ open, setOpen, detail }: { open: boolean; setOpen: (o: boolean) => void; detail: TextQuizOpen }) {
  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false} repositionInputs={false}>
      <DrawerContent className="theme-soft max-h-[92dvh] rounded-t-3xl">
        <DrawerTitle className="sr-only">Text us in three taps</DrawerTitle>
        <DrawerDescription className="sr-only">Answer three quick questions, then send them to us by text.</DrawerDescription>
        <div className="pb-safe overflow-y-auto px-4 pt-4">
          {open && <TextQuiz key={detail.audience ?? "start"} variant="sheet" source={detail.source || "Text us button"} audience={detail.audience} />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
