import { useRef, useEffect, useState } from "react";

interface AmbientBackgroundProps {
  opacity?: string;
  gradient?: "top" | "bottom" | "both";
}

export const AmbientBackground = ({ opacity = "0.06", gradient = "both" }: AmbientBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {visible && (
        <video
          src="/videos/income-boost-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          style={{ opacity: parseFloat(opacity) }}
        />
      )}
      <div
        className={`absolute inset-0 ${
          gradient === "top"
            ? "bg-gradient-to-b from-background to-transparent"
            : gradient === "bottom"
            ? "bg-gradient-to-t from-background to-transparent"
            : "bg-gradient-to-b from-background via-transparent to-background"
        }`}
      />
    </div>
  );
};
