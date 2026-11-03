// Animated SVG scenes, one per audience/service. CSS-animated (see index.css keyframes),
// so they're tiny, crisp at any size and respect prefers-reduced-motion.
import type { CSSProperties } from "react";

const BLUE = "hsl(205 100% 55%)";
const ORANGE = "hsl(20 100% 55%)";
const CHROME = "hsl(211 25% 83%)";
const LINE = "hsl(216 22% 22%)";
const PANEL = "hsl(218 30% 9%)";

const box: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

/** Artist: equalizer + listener counter climbing + "Booked" show ticket. */
export function ArtistScene({ className = "" }: { className?: string }) {
  const bars = [0.5, 0.9, 0.35, 0.75, 1, 0.6, 0.85, 0.4, 0.7, 0.95, 0.5, 0.8, 0.3, 0.65];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Animated illustration: music equalizer, growing monthly listeners and a booked show">
      <defs>
        <linearGradient id="ar-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="1" stopColor="#8fd3ff" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="140" r="92" fill={PANEL} stroke={LINE} />
      <circle cx="120" cy="140" r="64" fill="none" stroke={LINE} strokeDasharray="2 6" style={{ ...box, animation: "spin 12s linear infinite" }} />
      <circle cx="120" cy="140" r="22" fill={BLUE} opacity="0.9" />
      <path d="M114 130 L130 140 L114 150 Z" fill="#05070b" />
      <g transform="translate(232 70)">
        <rect width="150" height="140" rx="16" fill={PANEL} stroke={LINE} />
        <text x="16" y="28" fill={CHROME} fontSize="11" fontFamily="Inter, sans-serif">Monthly listeners</text>
        <text x="16" y="56" fill="#fff" fontSize="24" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
          <tspan>+</tspan>
          <tspan fill={BLUE}>growing</tspan>
        </text>
        <g transform="translate(16 76)">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={i * 8.6}
              y={0}
              width="5"
              height="46"
              rx="2.5"
              fill="url(#ar-bar)"
              style={{ ...box, transformOrigin: "bottom", animation: `eq ${0.9 + (i % 5) * 0.17}s ease-in-out ${i * 0.07}s infinite`, transform: `scaleY(${h})` }}
            />
          ))}
        </g>
      </g>
      <g transform="translate(250 222)">
        <g style={{ animation: "float-y 5s ease-in-out infinite" }}>
        <rect width="132" height="40" rx="12" fill={ORANGE} />
        <text x="66" y="25" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">Show booked ✓</text>
        </g>
      </g>
    </svg>
  );
}

/** Local business: map with a pinging pin, an incoming call and a 5-star review. */
export function LocalScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Animated illustration: business pin on a map, an incoming call and a new five-star review">
      <rect x="10" y="20" width="250" height="240" rx="18" fill={PANEL} stroke={LINE} />
      {[60, 110, 160, 210].map((y) => (
        <path key={y} d={`M10 ${y} H260`} stroke={LINE} strokeWidth="1" />
      ))}
      {[70, 140, 200].map((x) => (
        <path key={x} d={`M${x} 20 V260`} stroke={LINE} strokeWidth="1" />
      ))}
      <path d="M10 190 C80 170 120 120 260 110" stroke="hsl(216 22% 28%)" strokeWidth="10" fill="none" />
      {[
        [60, 80],
        [205, 200],
        [90, 225],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="hsl(216 15% 40%)" />
      ))}
      <circle cx="140" cy="130" r="14" fill="none" stroke={BLUE} strokeWidth="2" style={{ ...box, animation: "ping-ring 2.2s ease-out infinite" }} />
      <circle cx="140" cy="130" r="14" fill="none" stroke={BLUE} strokeWidth="2" style={{ ...box, animation: "ping-ring 2.2s ease-out 1.1s infinite" }} />
      <path d="M140 92 C124 92 114 104 114 118 C114 138 140 160 140 160 C140 160 166 138 166 118 C166 104 156 92 140 92 Z" fill={BLUE} />
      <circle cx="140" cy="118" r="9" fill="#05070b" />
      <text x="140" y="182" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">#1 in map pack</text>

      <g transform="translate(240 40)">
        <g style={{ animation: "float-y 6s ease-in-out infinite" }}>
        <rect width="150" height="70" rx="14" fill="hsl(218 30% 12%)" stroke={LINE} />
        <circle cx="30" cy="35" r="15" fill={ORANGE} />
        <path d="M24 30 c2 6 6 10 12 12 l3 -3 l-4 -4 l-3 2 c-2 -1 -4 -3 -5 -5 l2 -3 l-4 -4 Z" fill="#fff" />
        <text x="54" y="31" fill="#fff" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Incoming call</text>
        <text x="54" y="48" fill={CHROME} fontSize="10" fontFamily="Inter, sans-serif">New customer</text>
        </g>
      </g>
      <g transform="translate(232 170)">
          <g style={{ animation: "float-y 7s ease-in-out 1s infinite" }}>
        <rect width="158" height="74" rx="14" fill="hsl(218 30% 12%)" stroke={LINE} />
        <g transform="translate(16 18)">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 18} 0)`}>
              <path d="M7 0 L9 5 L14 5.3 L10 8.6 L11.4 14 L7 11 L2.6 14 L4 8.6 L0 5.3 L5 5 Z" fill="#ffc53d" style={{ animation: `rise .5s ease-out ${0.2 + i * 0.12}s both` }} />
            </g>
          ))}
          </g>
        </g>
        <text x="16" y="56" fill={CHROME} fontSize="10" fontFamily="Inter, sans-serif">“Fast, honest, on time.”</text>
      </g>
    </svg>
  );
}

/** Shopify: product card → cart → stacked order notifications. */
export function ShopScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Animated illustration: a product page sending orders to checkout">
      <rect x="14" y="30" width="170" height="220" rx="18" fill={PANEL} stroke={LINE} />
      <rect x="30" y="46" width="138" height="104" rx="12" fill="hsl(218 30% 13%)" />
      <circle cx="99" cy="98" r="30" fill="none" stroke={CHROME} strokeWidth="2" />
      <path d="M99 62 L99 70" stroke={CHROME} strokeWidth="2" />
      <circle cx="99" cy="98" r="10" fill={BLUE} opacity="0.85" />
      <rect x="30" y="164" width="96" height="10" rx="5" fill="hsl(216 20% 30%)" />
      <rect x="30" y="182" width="60" height="10" rx="5" fill="hsl(216 20% 22%)" />
      <rect x="30" y="206" width="138" height="30" rx="10" fill={ORANGE} />
      <text x="99" y="226" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Add to cart</text>

      <path d="M190 140 C220 140 220 140 240 140" stroke={BLUE} strokeWidth="2" strokeDasharray="4 6" fill="none" style={{ strokeDashoffset: 40, animation: "dash 1.4s linear infinite" }} />

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(240 ${52 + i * 64})`}>
          <g style={{ animation: `rise .7s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.35}s both` }}>
          <rect width="150" height="52" rx="12" fill="hsl(218 30% 12%)" stroke={i === 0 ? BLUE : LINE} />
          <circle cx="24" cy="26" r="11" fill={i === 0 ? BLUE : "hsl(216 20% 26%)"} />
          <path d="M19 26 l4 4 l7 -8" stroke="#05070b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <text x="44" y="23" fill="#fff" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">New order</text>
          <text x="44" y="38" fill={CHROME} fontSize="10" fontFamily="Inter, sans-serif">Paid · ships today</text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/** SEO/AEO/GEO: a search result climbing to #1 and an AI answer citing the site. */
export function SearchScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Animated illustration: a website climbing to the top search result and being cited in an AI answer">
      <rect x="10" y="16" width="230" height="250" rx="18" fill={PANEL} stroke={LINE} />
      <rect x="26" y="32" width="198" height="30" rx="15" fill="hsl(218 30% 13%)" stroke={LINE} />
      <circle cx="44" cy="47" r="6" fill="none" stroke={CHROME} strokeWidth="2" />
      <path d="M48.5 51.5 L52 55" stroke={CHROME} strokeWidth="2" strokeLinecap="round" />
      <text x="60" y="51" fill={CHROME} fontSize="11" fontFamily="Inter, sans-serif">best plumber near me</text>
      <rect x="166" y="41" width="1.5" height="12" fill={CHROME} style={{ animation: "blink-caret 1s step-end infinite" }} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(26 ${80 + i * 44})`}>
          <rect width="198" height="34" rx="9" fill="hsl(218 30% 11%)" />
          <rect x="12" y="9" width={i === 0 ? 0 : 110 - i * 12} height="6" rx="3" fill="hsl(216 20% 28%)" />
          <rect x="12" y="20" width={140 - i * 10} height="5" rx="2.5" fill="hsl(216 20% 20%)" />
        </g>
      ))}
      <g style={{ animation: "climb 4s cubic-bezier(.16,1,.3,1) infinite" }}>
        <rect x="26" y="80" width="198" height="34" rx="9" fill="hsl(205 100% 55% / 0.12)" stroke={BLUE} />
        <text x="38" y="94" fill="#fff" fontSize="10.5" fontWeight="600" fontFamily="Inter, sans-serif">yourbusiness.com</text>
        <text x="38" y="107" fill={CHROME} fontSize="9" fontFamily="Inter, sans-serif">★★★★★ · Open now · Call</text>
        <text x="212" y="101" textAnchor="end" fill={BLUE} fontSize="11" fontWeight="700" fontFamily="Space Grotesk, sans-serif">#1</text>
      </g>

      <g transform="translate(222 120)">
        <g style={{ animation: "float-y 6s ease-in-out infinite" }}>
        <rect width="170" height="120" rx="16" fill="hsl(218 30% 12%)" stroke={LINE} />
        <circle cx="22" cy="22" r="9" fill={ORANGE} />
        <path d="M18 22 h8 M22 18 v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <text x="38" y="26" fill="#fff" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">AI answer</text>
        <rect x="14" y="44" width="142" height="6" rx="3" fill="hsl(216 20% 28%)" />
        <rect x="14" y="58" width="120" height="6" rx="3" fill="hsl(216 20% 24%)" />
        <rect x="14" y="72" width="132" height="6" rx="3" fill="hsl(216 20% 24%)" />
        <rect x="14" y="90" width="98" height="18" rx="9" fill="hsl(205 100% 55% / 0.15)" stroke={BLUE} />
        <text x="63" y="102.5" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">Source: your site</text>
        </g>
      </g>
    </svg>
  );
}

export const SCENES = { artist: ArtistScene, local: LocalScene, shopify: ShopScene, search: SearchScene } as const;
