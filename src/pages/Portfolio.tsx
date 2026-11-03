import { CLIENTS, CATEGORY_LABEL, type Category } from "@/content/clients";
import { SiteWall } from "@/components/visuals/SiteWall";
import { WorkGrid } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { SectionHeader, Breadcrumbs } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";

export default function Portfolio() {
  const counts = (Object.keys(CATEGORY_LABEL) as Category[]).map((c) => `${CLIENTS.filter((x) => x.category === c).length} ${CATEGORY_LABEL[c].toLowerCase()}`);
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Portfolio", path: "/portfolio" }]} />
          <SectionHeader as="h1" title={`${CLIENTS.length} client websites, all live`} lede={`${counts.join(", ")}. Every site is real and online — open any case study to see the decisions that make it convert.`} />
          <div className="mt-8">
            <BookButton note="Portfolio">Get a site like these</BookButton>
          </div>
        </div>
        <div className="mt-6">
          <SiteWall />
        </div>
      </section>
      <section className="section" aria-label="All client websites">
        <div className="container-x">
          <WorkGrid filterable />
        </div>
      </section>
      <BookingSection note="Portfolio" title="Want yours next? Let's talk about it." />
    </>
  );
}
