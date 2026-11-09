// "Fix my tech" / "Get my price": on a phone it opens the tap-question text sheet right where the visitor is;
// on a computer (or before JS loads) it's a normal link to the repair page and its Cal.com calendar.
import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { IT_SERVICES_PATH } from "@/content/tech-pages";
import { openTechQuiz } from "@/lib/tech-quiz-open";

export function FixMyTechLink({ source, className, children, to = IT_SERVICES_PATH, onOpen }: { source: string; className?: string; children: ReactNode; to?: string; onOpen?: () => void }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    onOpen?.();
    if (openTechQuiz(source)) e.preventDefault();
  };
  return (
    <Link to={to} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
