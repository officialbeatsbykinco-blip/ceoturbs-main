// /watch — the founder video as the main content of its own page, so Google can index it as a video
// (a video that only appears inside another page's layout, with no src until tapped, is not eligible).
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import { PITCH_VIDEO } from "@/config/site";

export const WATCH_PATH = "/watch";

export default function Watch() {
  return (
    <section className="pb-16 pt-28 sm:pt-32">
      <div className="container-x max-w-[760px]">
        <Breadcrumbs items={[{ name: "Watch", path: WATCH_PATH }]} />
        <h1 className="text-3xl font-bold sm:text-4xl">{PITCH_VIDEO.title}</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">{PITCH_VIDEO.description}</p>
        <video
          src={PITCH_VIDEO.src}
          poster={PITCH_VIDEO.poster}
          width={PITCH_VIDEO.width}
          height={PITCH_VIDEO.height}
          controls
          playsInline
          preload="metadata"
          className="mx-auto mt-8 aspect-[9/16] w-full max-w-[340px] rounded-2xl bg-black"
          aria-label={PITCH_VIDEO.title}
        />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <BookButton note="Watch page">Book my free call</BookButton>
          <Link to="/free-audit" className="btn-chrome">
            Free visibility check
          </Link>
          <Link to="/how-to-get-more-customers" className="inline-flex min-h-10 items-center text-sm font-semibold text-turbo underline underline-offset-4">
            Read the step-by-step tutorial
          </Link>
        </div>
      </div>
    </section>
  );
}
