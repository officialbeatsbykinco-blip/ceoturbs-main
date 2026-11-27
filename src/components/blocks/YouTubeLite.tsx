import { useState } from "react";
import { Play } from "lucide-react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { VIDEOS, youtubeThumb, type YouTubeVideo } from "@/content/videos";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * A YouTube video that costs nothing until it's clicked: a thumbnail and a play button, then the
 * privacy-enhanced (youtube-nocookie) player. Keeps LCP and page weight untouched.
 */
export function YouTubeLite({ video, className, where = "page" }: { video: YouTubeVideo; className?: string; where?: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className={cn("group", className)}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setOn(true);
              track("video_play", { video_id: video.id, video_title: video.title, where });
            }}
            className="absolute inset-0 h-full w-full"
            aria-label={`Play video: ${video.title}`}
          >
            <img src={youtubeThumb(video.id)} alt={`${video.title}: video thumbnail`} loading="lazy" decoding="async" width={480} height={360} className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[hsl(var(--ignite))] text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16" aria-hidden>
              <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">{mmss(video.seconds)}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <p className="font-semibold leading-snug">{video.title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.summary}</p>
      </figcaption>
    </figure>
  );
}

/** A row of videos: one big featured video plus a grid on desktop, a swipeable row on phones. */
export function VideoRow({ ids, where }: { ids?: string[]; where: string }) {
  const list = ids ? ids.map((id) => VIDEOS.find((v) => v.id === id)).filter(Boolean) as YouTubeVideo[] : VIDEOS.filter((v) => !v.short);
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {list.map((v) => (
        <YouTubeLite key={v.id} video={v} where={where} className="w-[82%] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  );
}
