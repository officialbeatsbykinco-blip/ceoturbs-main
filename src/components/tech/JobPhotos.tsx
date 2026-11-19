// Real photos from CEO Turbo jobs: office desks set up, desktops opened for repair, an HP all-in-one being reset.
// Files: {slug}-full.webp is the photo at full camera resolution (high quality), {slug}-800.webp the lighter copy.
// Layout: phones 2 columns, wide screens 4 columns with the office desk photo as the big feature tile.
// [desk desk ports ports2] [desk desk gpu hp] [dell dell keyboard keyboard]
import { cn } from "@/lib/utils";

type Shape = "feature" | "tile" | "wide";

export const JOB_PHOTOS: { slug: string; shape: Shape; full: number; caption: string; alt: string }[] = [
  { slug: "office-desks", shape: "feature", full: 1500, caption: "Office desks set up with dual monitors", alt: "Office workstation set up with two monitors, keyboard and mouse on an L-shaped desk, ready for the team." },
  { slug: "pc-back-ports", shape: "tile", full: 1500, caption: "Checking ports before the hookup", alt: "Back of a small office desktop PC showing its power, VGA, USB, network and audio ports." },
  { slug: "pc-ports-check", shape: "tile", full: 1184, caption: "Office PC ready to connect", alt: "Rear panel of a slim desktop computer with VGA, USB and network ports, ready to be connected." },
  { slug: "gaming-pc-inside", shape: "tile", full: 1500, caption: "Custom PC opened up for service", alt: "Inside of a custom-built desktop with an Intel cooler and an MSI GeForce graphics card, opened up for service." },
  { slug: "hp-all-in-one", shape: "tile", full: 1280, caption: "HP all-in-one getting a fresh Windows", alt: "HP all-in-one computer on the Windows 'Getting ready' screen during a reset." },
  { slug: "dell-inside", shape: "wide", full: 1920, caption: "Dell desktop: power supply, memory and fan check", alt: "Inside of a Dell desktop with the power supply, memory slots and CPU fan exposed for a repair." },
  { slug: "keyboard-repair", shape: "wide", full: 1920, caption: "Keyboard with missing keys, in for repair", alt: "Compact mechanical keyboard with several keycaps missing, showing the switches underneath, in for repair." },
];

const SHAPE: Record<Shape, { li: string; sizes: string; small: number }> = {
  feature: { li: "col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 50vw, 100vw", small: 800 },
  tile: { li: "aspect-[4/3]", sizes: "(min-width: 1024px) 25vw, 50vw", small: 800 },
  wide: { li: "col-span-2 aspect-[8/3]", sizes: "(min-width: 1024px) 50vw, 100vw", small: 960 },
};

export function JobPhotos({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {JOB_PHOTOS.map((p) => {
        const s = SHAPE[p.shape];
        return (
          <li key={p.slug} className={cn("relative overflow-hidden rounded-2xl ring-1 ring-border shadow-[0_20px_50px_-30px_rgb(20_40_90/0.5)]", s.li)}>
            <img
              src={`/img/jobs/${p.slug}-full.webp`}
              srcSet={`/img/jobs/${p.slug}-800.webp ${s.small}w, /img/jobs/${p.slug}-full.webp ${p.full}w`}
              sizes={s.sizes}
              loading="lazy"
              decoding="async"
              alt={p.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 text-[13px] font-semibold leading-snug text-white sm:text-sm">
              {p.caption}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
