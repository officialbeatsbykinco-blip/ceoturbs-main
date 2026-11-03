import { SectionHeader } from "./Basics";

const SOURCE = "https://www.brightlocal.com/research/local-consumer-review-survey/";

// BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026), reworded in plain kid-level English.
const STATS = [
  { pct: 97, big: "97 out of 100", head: "People read reviews first.", body: "Before they pick a place, almost everybody checks what other people said." },
  { pct: 74, big: "74 out of 100", head: "They want NEW reviews.", body: "Reviews from the last 3 months. Old reviews feel like old news." },
  { pct: 31, big: "3 out of 10", head: "Only pick 4.5 stars or higher.", body: "That number almost doubled in one year (17 out of 100 before). Low stars get skipped." },
  { pct: 80, big: "8 out of 10", head: "Like places that answer reviews.", body: "Say thank you to every review and more people will pick you." },
] as const;

/** Plain-language proof for why reviews matter. Used on the homepage and the review-card shop. */
export function ReviewStats({ id, className }: { id: string; className?: string }) {
  return (
    <div className={className}>
      <SectionHeader
        kicker="Why reviews are a big deal"
        title={<span id={id}>Think of reviews like a stars-and-thumbs-up scoreboard.</span>}
        lede="Before you pick a pizza place, you check the stars, right? Everybody does it. The business with more fresh, high stars gets the customer."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <li key={s.big} className="panel flex flex-col p-6">
            <p className="font-display text-3xl font-bold text-turbo-grad">{s.big}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${s.pct} out of 100`}>
              <div className="h-full rounded-full bg-turbo" style={{ width: `${s.pct}%` }} />
            </div>
            <h3 className="mt-4 text-lg font-bold leading-snug">{s.head}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-[15px] leading-relaxed">
        <span className="font-semibold">What this means for you:</span> if your stars are few or old, people pick the shop next door. A review card makes it easy for every happy customer to leave a fresh 5-star in one tap.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Source:{" "}
        <a href={SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
          BrightLocal Local Consumer Review Survey 2026
        </a>{" "}
        (1,002 US adults, February 2026).
      </p>
    </div>
  );
}
