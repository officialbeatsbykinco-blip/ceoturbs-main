// Every city we drive to, grouped by county, as plain crawlable text. People scan for their town;
// Google and AI answers read the same list to match "computer repair near Brandon" style searches.
import { MapPin } from "lucide-react";
import { SETUP_AREAS } from "@/content/service-areas";

export function ServiceAreaList({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {SETUP_AREAS.map((r) => (
        <div key={r.region} className="panel p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold">
            <MapPin className="h-4 w-4 shrink-0 text-turbo" aria-hidden /> {r.region}
            {r.note && <span className="text-xs font-medium text-muted-foreground">· {r.note}</span>}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[15px]">
            {r.cities.map((c) => (
              <li key={c}>{c}, FL</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
