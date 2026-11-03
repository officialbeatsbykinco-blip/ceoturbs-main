import { cn } from "@/lib/utils";
import { useInView } from "./ReviewVisuals";

const STAR = "M0,-6 L1.76,-2.43 5.71,-1.85 2.85,0.93 3.53,4.85 0,3 -3.53,4.85 -2.85,0.93 -5.71,-1.85 -1.76,-2.43Z";
const STEPS = ["Hand it over", "They tap", "5-star review"];

/**
 * Stick-figure version of the sale in one 6s loop: the owner holds out the card, the customer
 * steps in and taps their phone on it, five stars pop and the customer hops. Strokes use
 * currentColor, so it reads on the dark footer and on the light pages.
 */
export function StickTap({ className, captions = true }: { className?: string; captions?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("stick-tap select-none", className)} data-play={inView}>
      <svg viewBox="0 0 400 230" className="block h-auto w-full overflow-visible" role="img" aria-label="Animation: a business owner holds out the review card, the customer taps it with their phone, and a five-star review pops up">
        <ellipse cx="200" cy="208" rx="170" ry="7" fill="currentColor" opacity="0.08" />
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* owner, cap on, holding the card */}
          <g className="st-owner">
            <circle cx="130" cy="70" r="15" />
            <path d="M116 64 Q130 46 145 63 L156 63" />
            <path d="M130 85 V145 M130 145 L114 204 M130 145 L146 204 M130 100 L112 132" />
            <g className="st-owner-arm">
              <path d="M130 100 L182 104" />
              <g transform="translate(180 88) rotate(-8)">
                <rect width="26" height="38" rx="3" fill="#fff" stroke="#202124" strokeWidth="2" />
                <circle cx="13" cy="19" r="6.5" stroke="#4285f4" strokeWidth="3" />
                <path d="M13 19 H19.5" stroke="#4285f4" strokeWidth="3" />
              </g>
            </g>
          </g>
          {/* customer, phone in hand */}
          <g className="st-cust">
            <g className="st-hop">
              <circle cx="290" cy="70" r="15" />
              <path className="st-smile" d="M283 74 Q290 80 297 74" strokeWidth="3" />
              <path d="M290 85 V145 M290 145 L274 204 M290 145 L306 204 M290 100 L310 130" />
              <g className="st-cust-arm">
                <path d="M290 100 L240 112" />
                <rect x="226" y="98" width="16" height="28" rx="3.5" fill="#0d1117" stroke="currentColor" strokeWidth="2.5" />
                <rect x="229" y="102" width="10" height="19" rx="1.5" fill="hsl(var(--turbo))" stroke="none" opacity="0.85" />
              </g>
            </g>
          </g>
        </g>
        {/* NFC rings where phone meets card */}
        {[0, 1].map((i) => (
          <circle key={i} className="st-ring" cx="214" cy="108" r="12" fill="none" stroke="hsl(var(--turbo))" strokeWidth="3" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
        {/* the review that lands */}
        <g className="st-bubble">
          <rect x="140" y="10" width="140" height="34" rx="17" fill="#fff" stroke="#dadce0" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} className="st-star" d={STAR} transform={`translate(${162 + i * 16} 27) scale(1.25)`} fill="#fbbc04" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
          <text x="248" y="32" fontSize="14" fontWeight="700" fill="#137333" fontFamily="system-ui, sans-serif">+1</text>
        </g>
      </svg>
      {captions && (
        <ol className="mt-3 flex justify-center gap-2 text-xs font-semibold sm:text-sm" aria-hidden>
          {STEPS.map((s, i) => (
            <li key={s} className={`st-cap st-cap-${i} rounded-full px-3 py-1.5`}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
