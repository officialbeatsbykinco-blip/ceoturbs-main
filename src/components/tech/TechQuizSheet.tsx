// The tech repair quiz as a bottom sheet on phones. Loaded by TechQuizHost the first time it's needed.
import { X } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { TechQuiz } from "./TechQuiz";

export default function TechQuizSheet({ open, setOpen, source }: { open: boolean; setOpen: (o: boolean) => void; source: string }) {
  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false} repositionInputs={false}>
      <DrawerContent className="theme-soft max-h-[94dvh] rounded-t-3xl">
        <DrawerTitle className="sr-only">Get your repair price</DrawerTitle>
        <DrawerDescription className="sr-only">Answer a few taps, then send them to us by text.</DrawerDescription>
        <DrawerClose className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground" aria-label="Close">
          <X className="h-5 w-5" aria-hidden />
        </DrawerClose>
        <div className="pb-safe overflow-y-auto px-4 pb-6 pt-3">{open && <TechQuiz key={source} variant="sheet" source={source} />}</div>
      </DrawerContent>
    </Drawer>
  );
}
