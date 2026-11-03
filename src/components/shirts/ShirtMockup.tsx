import { forwardRef, useId, useRef, type PointerEvent } from "react";
import ART from "@/content/shirt-art.json";
import type { ShirtStyle } from "@/config/site";
import { AREAS, type Placement } from "./art";

type Props = {
  style: ShirtStyle;
  color: string;
  dark: boolean;
  side: "front" | "back";
  /** Data URL of the artwork for this side (from drawArt), or null for a blank shirt. */
  art: string | null;
  placement: Placement;
  /** Dashed outline of the print area while designing. */
  guide?: boolean;
  className?: string;
  title?: string;
  /** Drag the design inside the print area: called with the move as a share of the area's width / height. */
  onMove?: (dx: number, dy: number) => void;
};

/** Flat-lay T-shirt mockup (short or long sleeve, front or back) with the design in its print area. */
export const ShirtMockup = forwardRef<SVGSVGElement, Props>(function ShirtMockup({ style, color, dark, side, art, placement, guide, className, title, onMove }, ref) {
  const id = useId().replace(/:/g, "");
  const drag = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const onDown = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = { x: e.clientX, y: e.clientY, w: r.width, h: r.height };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDrag = (e: PointerEvent<SVGRectElement>) => {
    const d = drag.current;
    if (!d || !onMove) return;
    onMove((e.clientX - d.x) / d.w, (e.clientY - d.y) / d.h);
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const onUp = () => (drag.current = null);
  const body = style === "long" ? ART.long : ART.short;
  const area = AREAS[side === "back" ? "back" : placement];
  const shade = dark ? 0.35 : 0.14;
  return (
    <svg ref={ref} viewBox={ART.viewBox} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ?? `${style === "long" ? "Long" : "Short"} sleeve shirt, ${side}`} className={className}>
      <defs>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.1 : 0.35} />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={shade} />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={shade * 0.8} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={body} />
        </clipPath>
      </defs>
      <g>
        <path d={body} fill={color} stroke="#000" strokeOpacity={dark ? 0.5 : 0.18} strokeWidth="2" strokeLinejoin="round" />
        <g clipPath={`url(#${id}-clip)`}>
          {ART.folds.map((d) => (
            <path key={d} d={d} fill="none" stroke="#000" strokeOpacity={dark ? 0.35 : 0.08} strokeWidth="10" strokeLinecap="round" style={{ filter: "blur(6px)" }} />
          ))}
          <rect x="0" y="0" width="600" height="640" fill={`url(#${id}-light)`} />
          <rect x="0" y="0" width="600" height="640" fill={`url(#${id}-vig)`} />
        </g>
        {side === "front" ? (
          <>
            <path d={ART.collarFront} fill={color} stroke="#000" strokeOpacity={dark ? 0.55 : 0.22} strokeWidth="2" />
            <path d={ART.neckFront} fill="#000" fillOpacity={dark ? 0.45 : 0.18} />
          </>
        ) : (
          <path d={ART.collarBack} fill={color} stroke="#000" strokeOpacity={dark ? 0.55 : 0.22} strokeWidth="2" />
        )}
        {/* Hem and cuff stitching */}
        <path d="M146 598 C240 611 360 611 454 598" fill="none" stroke="#000" strokeOpacity={dark ? 0.5 : 0.2} strokeWidth="1.5" strokeDasharray="5 4" />
        {guide && <rect x={area.x} y={area.y} width={area.w} height={area.h} fill="none" stroke={dark ? "#fff" : "#000"} strokeOpacity="0.35" strokeDasharray="6 5" rx="4" />}
        {art && <image href={art} x={area.x} y={area.y} width={area.w} height={area.h} preserveAspectRatio="xMidYMin meet" style={{ mixBlendMode: dark ? "normal" : "multiply" }} />}
        {onMove && art && (
          <rect x={area.x} y={area.y} width={area.w} height={area.h} fill="transparent" style={{ cursor: "move", touchAction: "none" }} onPointerDown={onDown} onPointerMove={onDrag} onPointerUp={onUp} onPointerCancel={onUp}>
            <title>Drag to move the design</title>
          </rect>
        )}
      </g>
    </svg>
  );
});
