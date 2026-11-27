// Links to the computer problem pages (content/install-pages.ts, category "pc_repair"), for the repair hub and city pages.
import { Link } from "react-router-dom";
import { INSTALL_PAGES } from "@/content/install-pages";

export const PROBLEM_PAGES = INSTALL_PAGES.filter((p) => p.category === "pc_repair");

const pill = "inline-flex min-h-[48px] items-center rounded-full px-5 text-base font-semibold ring-1 ring-border hover:bg-white/5";

export function ProblemLinks({ className, title = "Common computer problems we fix" }: { className?: string; title?: string }) {
  return (
    <nav aria-label="Computer problems we fix" className={className}>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {PROBLEM_PAGES.map((p) => (
          <li key={p.path}>
            <Link to={p.path} className={pill}>
              {p.name.replace(/ Tampa$/, "")}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
