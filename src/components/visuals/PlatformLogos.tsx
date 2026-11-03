// The platforms we grow clients on, as small inline marks (no image requests, no third-party scripts).
// Nominative use only: "where we grow you", never "partner", since that would claim an official status.
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 48 48" className="h-7 w-7 shrink-0" aria-hidden focusable="false">
    {children}
  </svg>
);

const MARKS: { name: string; mark: ReactNode }[] = [
  {
    name: "Google",
    mark: (
      <Svg>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </Svg>
    ),
  },
  {
    name: "Google Maps",
    mark: (
      <Svg>
        <path fill="#EA4335" d="M24 4c-7.7 0-14 6.1-14 13.7C10 28 24 44 24 44s14-16 14-26.3C38 10.1 31.7 4 24 4z" />
        <circle cx="24" cy="18" r="5.5" fill="#fff" />
      </Svg>
    ),
  },
  {
    name: "Meta",
    mark: (
      <Svg>
        <defs>
          <linearGradient id="pl-meta" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0064e1" />
            <stop offset="1" stopColor="#0082fb" />
          </linearGradient>
        </defs>
        <path fill="none" stroke="url(#pl-meta)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M8 29c0-7 3-13 7.5-13 5 0 8 7 10.5 11s4.5 7.5 8 7.5c3 0 5-3 5-8 0-6-2.5-10.5-6.5-10.5-4.2 0-7 5-9.5 9.5S18.5 34.5 14 34.5c-3.5 0-6-2.5-6-5.5z" />
      </Svg>
    ),
  },
  {
    name: "Instagram",
    mark: (
      <Svg>
        <defs>
          <linearGradient id="pl-ig" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#feda75" />
            <stop offset="0.35" stopColor="#fa7e1e" />
            <stop offset="0.6" stopColor="#d62976" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="11" fill="url(#pl-ig)" />
        <rect x="11.5" y="11.5" width="25" height="25" rx="7.5" fill="none" stroke="#fff" strokeWidth="3.2" />
        <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3.2" />
        <circle cx="32.2" cy="15.8" r="1.9" fill="#fff" />
      </Svg>
    ),
  },
  {
    name: "TikTok",
    mark: (
      <Svg>
        <path fill="#25F4EE" transform="translate(-1.6 -1.2)" d="M26 6h6c.5 4 3 7 7 7.5v6c-2.6 0-5-.8-7-2.2V30a10 10 0 1 1-10-10v6.2a4 4 0 1 0 4 3.8z" />
        <path fill="#FE2C55" transform="translate(1.6 1.2)" d="M26 6h6c.5 4 3 7 7 7.5v6c-2.6 0-5-.8-7-2.2V30a10 10 0 1 1-10-10v6.2a4 4 0 1 0 4 3.8z" />
        <path fill="#fff" d="M26 6h6c.5 4 3 7 7 7.5v6c-2.6 0-5-.8-7-2.2V30a10 10 0 1 1-10-10v6.2a4 4 0 1 0 4 3.8z" />
      </Svg>
    ),
  },
  {
    name: "YouTube",
    mark: (
      <Svg>
        <rect x="3" y="11" width="42" height="26" rx="8" fill="#FF0000" />
        <path fill="#fff" d="M20 17.5 31.5 24 20 30.5z" />
      </Svg>
    ),
  },
  {
    name: "Microsoft Bing",
    mark: (
      <Svg>
        <rect x="5" y="5" width="18" height="18" fill="#F25022" />
        <rect x="25" y="5" width="18" height="18" fill="#7FBA00" />
        <rect x="5" y="25" width="18" height="18" fill="#00A4EF" />
        <rect x="25" y="25" width="18" height="18" fill="#FFB900" />
      </Svg>
    ),
  },
  {
    name: "Shopify",
    mark: (
      <Svg>
        <path fill="none" stroke="#5E8E3E" strokeWidth="3" d="M17 16c0-6 3-10 7-10s7 4 7 10" />
        <path fill="#95BF47" d="M10 15h28l-2.5 29h-23z" />
        <text x="24" y="37" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#fff">
          S
        </text>
      </Svg>
    ),
  },
  {
    name: "Spotify",
    mark: (
      <Svg>
        <circle cx="24" cy="24" r="21" fill="#1DB954" />
        <path fill="none" stroke="#0b0b0b" strokeLinecap="round" strokeWidth="3.6" d="M12.5 18.5c7.5-2.3 16-1.6 23 2.2" />
        <path fill="none" stroke="#0b0b0b" strokeLinecap="round" strokeWidth="3" d="M14 25c6-1.8 13-1.2 18.6 1.8" />
        <path fill="none" stroke="#0b0b0b" strokeLinecap="round" strokeWidth="2.6" d="M15.5 31c4.7-1.3 10-.9 14.2 1.3" />
      </Svg>
    ),
  },
  {
    name: "ChatGPT & AI search",
    mark: (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10" aria-hidden>
        <Sparkles className="h-4 w-4 text-white" />
      </span>
    ),
  },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {MARKS.map((m) => (
        <li key={m.name} className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/[0.04] py-2 pl-2.5 pr-4 text-sm font-medium text-foreground/85 ring-1 ring-white/[0.07]">
          {m.mark}
          {m.name}
        </li>
      ))}
    </ul>
  );
}

/** Slow, pausable marquee of the platforms we run growth on. */
export function PlatformLogos({ title = "Where we grow you", className }: { title?: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="animate-logos flex w-max group-hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
