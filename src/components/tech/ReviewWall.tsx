// Every real Google review as a card: stars, the customer's words, their name and what we did.
// The 5.0 summary links to the Google profile so anyone can check them.
import { ExternalLink, Star } from "lucide-react";
import { REVIEWS, SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const GOOGLE_PROFILE = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name} Tampa`)}`;

function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("flex text-[#f59e0b]", className)} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
      ))}
    </span>
  );
}

/** "5.0 ★★★★★ · 4 Google reviews", the count always matching REVIEWS. */
export function ReviewSummary({ className }: { className?: string }) {
  const avg = REVIEWS.reduce((t, r) => t + r.stars, 0) / REVIEWS.length;
  return (
    <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline", className)}>
      <span className="font-display text-lg font-extrabold">{avg.toFixed(1)}</span>
      <Stars n={Math.round(avg)} />
      <span className="text-muted-foreground">
        {REVIEWS.length} Google reviews
      </span>
    </a>
  );
}

export function ReviewWall({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r) => (
          <li key={r.name}>
            <figure className="panel flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <Stars n={r.stars} />
                <span className="rounded-full bg-turbo/10 px-2.5 py-1 text-[11px] font-semibold text-turbo">{r.job}</span>
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground">"{r.text}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 text-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-turbo/15 font-bold text-turbo" aria-hidden>
                  {r.name[0]}
                </span>
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">{r.source} review</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <ReviewSummary />
        <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
          See them on Google <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </p>
    </div>
  );
}
