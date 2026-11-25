// Links to every city repair page (content/city-repair.ts), for the main computer and phone repair pages.
import { Link } from "react-router-dom";
import { REPAIR_CITIES, cityRepairPath } from "@/content/city-repair";

/** Links to every city page, for the main repair pages. */
export function RepairCityLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Repair by city" className={className}>
      <h3 className="font-display text-lg font-bold">Computer &amp; phone repair by city</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {REPAIR_CITIES.map((o) => (
          <li key={o.slug}>
            <Link to={cityRepairPath(o)} className="inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold ring-1 ring-border hover:bg-white/5">
              {o.city}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
