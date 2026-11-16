import { Link } from "react-router-dom";
import { CHECK_PATH } from "@/lib/free-check";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pulls a reader who's still scrolling back to the free check. */
export function FreeCheckStrip({ where, className, title = "Not sure where you're losing customers?" }: { where: string; className?: string; title?: string }) {
  return (
    <div className={cn("cta-glow flex flex-col items-center gap-4 rounded-3xl p-6 text-center sm:flex-row sm:justify-between sm:p-7 sm:text-left", className)}>
      <div>
        <p className="font-display text-lg font-bold sm:text-xl">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">The free check scores your Google profile, reviews, website and AI visibility out of 100. 60 seconds, score first.</p>
      </div>
      <Link to={`${CHECK_PATH}?from=${encodeURIComponent(where)}`} data-cta-location={where} className="btn-ignite btn-shine inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap sm:w-auto">
        Run my free check <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

