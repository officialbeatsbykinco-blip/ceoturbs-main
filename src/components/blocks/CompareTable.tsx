import { cn } from "@/lib/utils";

/**
 * A comparison table that reads on a phone: a normal table from `sm` up, and one card per row below it
 * (row label, then every column as "Column: value"), so no column is ever cut off at the screen edge.
 * `head[0]` labels the row-name column (often empty); `highlight` is the column index (1-based, like `head`)
 * shown in brand color — usually our own offer.
 */
export function CompareTable({ head, rows, highlight, caption, className }: { head: string[]; rows: string[][]; highlight?: number; caption?: string; className?: string }) {
  return (
    <div className={className}>
      <div className="hidden overflow-x-auto rounded-2xl border border-border sm:block">
        <table className="w-full text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border bg-white/[0.02] text-muted-foreground">
              {head.map((h, i) => (
                <th key={i} className={cn("px-5 py-4", i === highlight ? "font-semibold text-foreground" : "font-medium")}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, ...cells]) => (
              <tr key={label} className="border-b border-border/60 last:border-0">
                <th scope="row" className="px-5 py-4 font-medium">
                  {label}
                </th>
                {cells.map((c, i) => (
                  <td key={i} className={cn("px-5 py-4", i + 1 === highlight ? "font-semibold text-turbo" : "text-muted-foreground")}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 sm:hidden" aria-label={caption}>
        {rows.map(([label, ...cells]) => (
          <li key={label} className="rounded-2xl border border-border bg-white/[0.02] p-4">
            <p className="font-semibold">{label}</p>
            <dl className="mt-2.5 grid gap-2 text-sm">
              {cells.map((c, i) => (
                <div key={i} className={cn("flex items-baseline justify-between gap-4", i + 1 === highlight && "rounded-lg bg-turbo/10 px-2.5 py-1.5 -mx-2.5")}>
                  <dt className={cn("shrink-0", i + 1 === highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>{head[i + 1]}</dt>
                  <dd className={cn("text-right", i + 1 === highlight ? "font-semibold text-turbo" : "text-muted-foreground")}>{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
