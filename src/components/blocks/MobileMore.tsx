// Phones only: long proof sections start collapsed behind one tap so the page isn't 30 screens of scrolling.
// The content stays in the HTML (just hidden by CSS below md), so search engines still read all of it and
// desktop always shows everything.
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileMore({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <div className={cn(!open && "max-md:hidden")}>{children}</div>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} aria-expanded={false} className="btn-chrome mt-6 w-full md:hidden">
          {label} <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
