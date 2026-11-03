import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLIENTS, domainOf, type Client } from "@/content/clients";

/**
 * A tilted 3D showroom wall of the real client sites, drifting in two directions.
 * Each tile links to its case study. Duplicated rows make the marquee seamless.
 */
export function SiteWall({ clients = CLIENTS, eagerCount = 6 }: { clients?: Client[]; eagerCount?: number }) {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];
  const wall = useRef<HTMLDivElement>(null);
  // The wall only animates on screen, so it costs nothing while the visitor reads the rest of the page.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wall.current) io.observe(wall.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wall} className="relative h-[340px] w-full overflow-hidden sm:h-[560px]" style={{ perspective: "1600px" }}>
      <div
        className="absolute left-1/2 top-1/2 flex w-[180%] flex-col gap-4 sm:w-[140%] sm:gap-5"
        style={{ transform: "translate(-50%,-50%) rotateX(22deg) rotateY(-16deg) rotateZ(6deg)", transformStyle: "preserve-3d" }}
      >
        {rows.map((row, r) => (
          <div key={r} className="group/row flex overflow-visible">
            <div className={`flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5 ${r === 0 ? "animate-marquee" : "animate-marquee-rev"} group-hover/row:[animation-play-state:paused]`} style={{ animationPlayState: visible ? undefined : "paused" }}>
              {[...row, ...row].map((c, i) => (
                <Tile
                  key={`${c.slug}-${i}`}
                  client={c}
                  eager={eagerCount > 0 && (r === 0 ? i < eagerCount : i >= row.length && i < row.length + eagerCount)}
                  hidden={i >= row.length}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(var(--background))_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

function Tile({ client, eager, hidden }: { client: Client; eager: boolean; hidden: boolean }) {
  return (
    <Link
      to={`/portfolio/${client.slug}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className="block w-[220px] shrink-0 overflow-hidden rounded-xl bg-[#0b0f16] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1.5 hover:ring-turbo/60 sm:w-[380px]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate text-[10px] text-white/70">{domainOf(client.url)}</span>
      </div>
      <img
        src={`/img/work/${client.slug}-640.webp`}
        alt={hidden ? "" : `${client.name} website homepage designed by CEO Turbo`}
        width={640}
        height={400}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="aspect-[16/10] w-full object-cover object-top"
      />
    </Link>
  );
}
