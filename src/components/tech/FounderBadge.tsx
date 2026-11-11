// A face and a name next to the buttons. Tech pages ask a stranger into someone's home or office,
// and the person doing the work is the strongest trust signal, so it sits in the hero with the newest review.
import { Star } from "lucide-react";
import { REVIEWS, SITE } from "@/config/site";
import { cn } from "@/lib/utils";

export function FounderBadge({ line, className }: { line: string; className?: string }) {
  const first = SITE.founder.name.split(" ")[0];
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-3", className)}>
      <img src={SITE.founder.image} alt={SITE.founder.name} width={56} height={56} className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-border" />
      <p className="text-[15px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground">Hi, I'm {first}, based in Tampa.</span> {line}
      </p>
    </div>
  );
}

/** The newest real Google review, shown under the founder badge on consumer tech pages. */
export function CustomerReview({ className }: { className?: string }) {
  const r = REVIEWS[0];
  if (!r) return null;
  return (
    <figure className={cn("rounded-2xl border border-border bg-card/80 p-3", className)}>
      <div className="flex items-center gap-2">
        <span className="flex text-[#f59e0b]" aria-label={`${r.stars} out of 5 stars`}>
          {Array.from({ length: r.stars }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
          ))}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{r.source} review</span>
      </div>
      <blockquote className="mt-1.5 text-[15px] font-medium leading-snug text-foreground">"{r.text}"</blockquote>
      <figcaption className="mt-1 text-sm text-muted-foreground">{r.name}</figcaption>
    </figure>
  );
}
