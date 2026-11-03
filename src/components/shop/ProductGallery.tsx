import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { GalleryItem } from "@/content/review-cards";
import { cn } from "@/lib/utils";

/** Shopify-style product gallery: big HD image (srcset), swipe on phones, thumbnails, tap to zoom. */
export function ProductGallery({ items, badge, live3d, className }: { items: GalleryItem[]; badge?: string; live3d?: ReactNode; className?: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);
  const item = items[i];
  const go = (dir: number) => setI((n) => (n + dir + items.length) % items.length);
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className={className}>
      <div className="group relative aspect-[5/4] overflow-hidden rounded-3xl bg-white sm:aspect-square ring-1 ring-black/5 shadow-[0_30px_60px_-30px_rgba(10,23,48,0.35)]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {item.live3d && live3d ? (
          <div key={i} className="gallery-fade absolute inset-0 grid place-items-center bg-[radial-gradient(70%_70%_at_50%_40%,hsl(var(--turbo)/0.35),transparent_70%),linear-gradient(180deg,hsl(218_32%_11%),hsl(220_38%_5%))] px-[24%] py-[9%]">
            {live3d}
          </div>
        ) : (
          <button type="button" onClick={() => setZoom(true)} className="absolute inset-0 cursor-zoom-in" aria-label={`Zoom photo: ${item.alt}`}>
            <img
              key={item.src}
              src={item.src}
              srcSet={item.srcSet}
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
              alt={item.alt}
              width={item.w}
              height={item.h}
              {...(i === 0 ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
              decoding={i === 0 ? "sync" : "async"}
              className={cn("h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]", i > 0 && "gallery-fade")}
            />
          </button>
        )}
        {badge && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:left-4 sm:top-4">{badge}</span>}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0a1730] shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0a1730] shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold tabular-nums text-white backdrop-blur" aria-live="polite">
              {!item.live3d && <Expand className="h-3 w-3" aria-hidden />}
              {i + 1} / {items.length}
            </span>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="no-scrollbar -mx-1 mt-3 hidden snap-x sm:flex gap-2 overflow-x-auto px-1 pb-1 sm:gap-2.5">
          {items.map((g, n) => (
            <button key={g.src + n} type="button" onClick={() => setI(n)} aria-label={`Show photo ${n + 1}: ${g.alt}`} aria-current={n === i} className={cn("aspect-square w-[60px] shrink-0 snap-start overflow-hidden rounded-xl bg-white ring-2 transition-all duration-200 sm:w-[68px] lg:w-[calc((100%-7*0.625rem)/8)] lg:min-w-[56px]", n === i ? "ring-turbo" : "ring-black/5 opacity-75 hover:opacity-100")}>
              <img src={g.thumb} alt="" width={200} height={200} loading="lazy" decoding="async" className={cn("h-full w-full object-cover", g.live3d && "bg-[#0b1018]")} />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-[min(92vw,92dvh)] overflow-hidden rounded-3xl border-0 bg-white p-0">
          <DialogTitle className="sr-only">Photo {i + 1} of {items.length}</DialogTitle>
          <DialogDescription className="sr-only">{item.alt}</DialogDescription>
          {zoom && !item.live3d && <img src={item.src} srcSet={item.srcSet} sizes="92vw" alt={item.alt} width={item.w} height={item.h} className="h-auto w-full" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
