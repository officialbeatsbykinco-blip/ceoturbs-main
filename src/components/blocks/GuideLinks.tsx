// "Helpful guides" under a service page's FAQs: links the page to the articles that answer the same questions,
// so visitors find the answer and search engines see the topic cluster.
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/blocks/Basics";
import { guideBySlug, guidePath } from "@/content/guides";

export function GuideLinks({ slugs, title = "Helpful guides" }: { slugs: string[]; title?: string }) {
  const guides = slugs.map(guideBySlug).filter((g): g is NonNullable<typeof g> => Boolean(g));
  if (!guides.length) return null;
  return (
    <section className="section border-t border-border" aria-labelledby="guides">
      <div className="container-x">
        <SectionHeader title={<span id="guides">{title}</span>} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link to={guidePath(g)} className="panel flex items-start gap-3 p-5 text-base font-semibold hover:border-turbo/60">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
