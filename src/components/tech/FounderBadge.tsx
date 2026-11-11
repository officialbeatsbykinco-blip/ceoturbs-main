// A face and a name next to the buttons. Tech pages ask a stranger into someone's home or office,
// and with no reviews yet the person doing the work is the trust signal, so it sits in the hero.
import { SITE } from "@/config/site";
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
