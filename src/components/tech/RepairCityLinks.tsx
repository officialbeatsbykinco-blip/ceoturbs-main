// Links to every city repair page (content/city-repair.ts), for the main computer and phone repair pages.
// `first` puts the list that matches the page on top.
import { Link } from "react-router-dom";
import { REPAIR_CITIES, cityRepairPath, phoneRepairPath } from "@/content/city-repair";

const pill = "inline-flex min-h-[48px] items-center rounded-full px-5 text-base font-semibold ring-1 ring-border hover:bg-white/5";

/** Links to every city page, for the main repair pages. */
export function RepairCityLinks({ className, first = "computer" }: { className?: string; first?: "computer" | "phone" }) {
  const lists = [
    { key: "computer", title: "Computer repair by city", path: cityRepairPath },
    { key: "phone", title: "Phone & tablet repair by city", path: phoneRepairPath },
  ] as const;
  const ordered = first === "phone" ? [lists[1], lists[0]] : lists;
  return (
    <nav aria-label="Repair by city" className={className}>
      {ordered.map((l, i) => (
        <div key={l.key} className={i ? "mt-6" : undefined}>
          <h3 className="font-display text-lg font-bold">{l.title}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {REPAIR_CITIES.map((o) => (
              <li key={o.slug}>
                <Link to={l.path(o)} className={pill}>
                  {o.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
