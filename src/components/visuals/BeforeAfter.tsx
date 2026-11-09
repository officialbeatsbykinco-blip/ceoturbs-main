// Drag-to-compare before/after photo. A native range input drives it, so keyboard, touch and screen
// readers all work; the after photo sits underneath and the before photo is clipped on top.
import { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Img = { src: string; srcSet?: string; alt: string };

export function BeforeAfter({ before, after, width, height, className, label = "before-after" }: { before: Img; after: Img; width: number; height: number; className?: string; label?: string }) {
  const [pos, setPos] = useState(50);
  const [moved, setMoved] = useState(false);
  const sizes = "(min-width: 1024px) 600px, 100vw";

  return (
    <div className={cn("relative select-none overflow-hidden rounded-2xl ring-1 ring-white/10", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      <img src={after.src} srcSet={after.srcSet} sizes={sizes} alt={after.alt} width={width} height={height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={before.src}
        srcSet={before.srcSet}
        sizes={sizes}
        alt={before.alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-turbo px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" style={{ left: `${pos}%` }} aria-hidden>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg">
          <MoveHorizontal className="h-5 w-5" />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => {
          setPos(Number(e.target.value));
          if (!moved) {
            setMoved(true);
            track("before_after_drag", { label });
          }
        }}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}

/** The owner's office job: a bare desk with closed laptops, then a working three-screen workstation. */
export const OFFICE_BEFORE_AFTER = {
  before: { src: "/img/office/before-1200.webp", srcSet: "/img/office/before-640.webp 640w, /img/office/before-1200.webp 1200w", alt: "Before: a bare desk with two closed laptops, a loose printer and tangled cables" },
  after: { src: "/img/office/after-1200.webp", srcSet: "/img/office/after-640.webp 640w, /img/office/after-1200.webp 1200w", alt: "After: an L-desk workstation with three working monitors, keyboard, mouse and tidy cables" },
  width: 1200,
  height: 900,
};
