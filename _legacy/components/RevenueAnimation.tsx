import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Zap, TrendingUp, Users, DollarSign } from "lucide-react";

/* ── Count-up number ── */
const CountUp = ({ end, prefix = "", suffix = "", delay = 0, decimals = 0 }: {
  end: number; prefix?: string; suffix?: string; delay?: number; decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (!isInView) return;
    setCount(0);
    const timeout = setTimeout(() => {
      const duration = 2200;
      const steps = 70;
      const increment = end / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= end) { setCount(end); clearInterval(interval); }
        else setCount(decimals ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, end, delay, decimals]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── Turbo Exhaust Particles ── */
const TurboExhaust = ({ isInView }: { isInView: boolean }) => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      startY: 30 + Math.random() * 40,
      delay: i * 0.8,
      duration: 8 + Math.random() * 4,
      size: 2 + Math.random() * 3,
      spread: (Math.random() - 0.5) * 20,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{ top: `${p.startY}%`, width: p.size, height: p.size }}
          initial={{ left: "15%", opacity: 0 }}
          animate={isInView ? {
            left: ["15%", "50%", "95%"],
            top: [`${p.startY}%`, `${p.startY + p.spread}%`],
            opacity: [0, 0.5, 0],
            scale: [0.4, 1, 0.2],
            background: [
              "hsl(205 100% 50%)",
              "hsl(18 100% 60%)",
              "hsl(160 100% 50%)",
            ],
          } : {}}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ── RPM Gauge Arc ── */
const RPMGauge = ({ isInView, progress }: { isInView: boolean; progress: number }) => {
  const radius = 52;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg viewBox="0 0 120 70" className="w-full h-full">
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(205 100% 50%)" />
          <stop offset="50%" stopColor="hsl(18 100% 60%)" />
          <stop offset="100%" stopColor="hsl(160 100% 50%)" />
        </linearGradient>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 8 65 A 52 52 0 0 1 112 65"
        fill="none"
        stroke="hsla(0,0%,100%,0.06)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <motion.path
        d="M 8 65 A 52 52 0 0 1 112 65"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        filter="url(#gaugeGlow)"
        initial={{ strokeDashoffset: circumference }}
        animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
      />
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t, i) => {
        const angle = Math.PI + t * Math.PI;
        const x1 = 60 + 44 * Math.cos(angle);
        const y1 = 65 + 44 * Math.sin(angle);
        const x2 = 60 + 48 * Math.cos(angle);
        const y2 = 65 + 48 * Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="hsla(0,0%,100%,0.2)" strokeWidth="1" />
        );
      })}
    </svg>
  );
};

/* ── Floating Gain Stats ── */
const gainStats = [
  { label: "Conversions", suffix: "%", base: 320 },
  { label: "Traffic", suffix: "%", base: 480 },
  { label: "Sales", suffix: "%", base: 270 },
  { label: "Leads", suffix: "%", base: 390 },
  { label: "Booked Calls", suffix: "%", base: 210 },
];

/* ── Interactive Growth Chart ── */
const InteractiveChart = ({ isInView, mouseX }: { isInView: boolean; mouseX: number }) => {
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 50; i++) {
      const x = (i / 50) * 500;
      const progress = i / 50;
      const y = 100 - (Math.pow(progress, 2.5) * 90);
      pts.push({ x, y });
    }
    return pts;
  }, []);

  const boostIntensity = Math.sin(mouseX * Math.PI) * 1.5 + 0.5;

  const shiftedPoints = points.map((p) => {
    const dist = Math.abs(p.x - mouseX * 500) / 500;
    const influence = Math.max(0, 1 - dist * 2);
    return { x: p.x, y: p.y - influence * 25 * boostIntensity };
  });

  const linePath = shiftedPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillPath = `${linePath} L 500 110 L 0 110 Z`;

  const activeStatIndex = Math.min(Math.floor(mouseX * gainStats.length), gainStats.length - 1);
  const activeStat = gainStats[activeStatIndex];
  const boostedValue = Math.round(activeStat.base * (0.8 + mouseX * 0.6));

  return (
    <div className="relative w-full h-full">
      {/* Floating gain stats ribbon */}
      <div className="absolute -top-8 left-0 right-0 flex justify-between px-1 z-20">
        {gainStats.map((stat, i) => {
          const isActive = i === activeStatIndex;
          const dynamicValue = Math.round(stat.base * (0.8 + mouseX * 0.6));
          return (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center"
              animate={{
                scale: isActive ? 1.15 : 0.9,
                opacity: isActive ? 1 : 0.4,
                y: isActive ? -4 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-[9px] text-muted-foreground whitespace-nowrap">{stat.label}</span>
              <motion.span
                className="text-xs md:text-sm font-black"
                style={{ color: isActive ? "hsl(205 100% 50%)" : "hsl(0 0% 50%)" }}
                animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                +{dynamicValue}{stat.suffix}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Cursor boost indicator */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{ left: `${mouseX * 100}%`, top: "10%" }}
        animate={{
          y: [-2, 2, -2],
          opacity: isInView ? [0.7, 1, 0.7] : 0,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="relative -translate-x-1/2">
          <motion.div
            className="flex items-center gap-1 text-xs md:text-sm font-black px-2 py-0.5 rounded-md"
            style={{
              background: "hsl(205 100% 50% / 0.15)",
              border: "1px solid hsl(205 100% 50% / 0.3)",
              color: "hsl(205 100% 50%)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Zap className="w-3 h-3" /> +{boostedValue}%
          </motion.div>
        </div>
      </motion.div>

      <svg viewBox="0 0 500 110" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(205 100% 50%)" />
            <stop offset="50%" stopColor="hsl(270 100% 65%)" />
            <stop offset="100%" stopColor="hsl(18 100% 60%)" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(205 100% 50%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(205 100% 50%)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="boostGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(205 100% 50%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(205 100% 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y}
            stroke="hsla(0,0%,100%,0.04)" strokeWidth="0.5" />
        ))}
        <motion.circle
          cx={mouseX * 500}
          cy={shiftedPoints[Math.round(mouseX * 50)]?.y ?? 100}
          r="40"
          fill="url(#boostGlow)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: boostIntensity * 0.5 } : { opacity: 0 }}
        />
        <motion.path
          d={fillPath}
          fill="url(#chartFill)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#chartLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#chartGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.5, duration: 2.5, ease: "easeOut" }}
        />
        <motion.circle
          cx={mouseX * 500}
          cy={shiftedPoints[Math.round(mouseX * 50)]?.y ?? 100}
          r="5"
          fill="hsl(205 100% 50%)"
          filter="url(#chartGlow)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0.6, 1, 0.6], r: [4, 6, 4] } : { opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.line
          x1={mouseX * 500} y1="0" x2={mouseX * 500} y2="110"
          stroke="hsl(205 100% 50%)"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
        />
      </svg>
    </div>
  );
};

/* ── Timeline Milestones ── */
const milestones = [
  { month: "Month 1", label: "Launch", icon: Zap, color: "hsl(205 100% 50%)" },
  { month: "Month 3", label: "Growth", icon: TrendingUp, color: "hsl(18 100% 60%)" },
  { month: "Month 6", label: "Scale", icon: Users, color: "hsl(270 100% 65%)" },
  { month: "Month 12", label: "Dominate", icon: DollarSign, color: "hsl(160 100% 50%)" },
];

/* ── Main Component ── */
export const RevenueAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [gaugeProgress, setGaugeProgress] = useState(0);

  const mouseXRaw = useMotionValue(0.5);
  const mouseX = useSpring(mouseXRaw, { stiffness: 150, damping: 20 });
  const [mouseXVal, setMouseXVal] = useState(0.5);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mouseXRaw.set(x);
    setMouseXVal(x);
  }, [mouseXRaw]);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setGaugeProgress(0.85), 400);
      return () => clearTimeout(t);
    } else {
      setGaugeProgress(0);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative max-w-4xl mx-auto cursor-crosshair"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-6 rounded-3xl pointer-events-none"
        animate={isInView ? {
          boxShadow: [
            "0 0 40px hsl(205 100% 50% / 0.08), 0 0 80px hsl(18 100% 60% / 0.05)",
            "0 0 60px hsl(205 100% 50% / 0.15), 0 0 120px hsl(18 100% 60% / 0.08)",
            "0 0 40px hsl(205 100% 50% / 0.08), 0 0 80px hsl(18 100% 60% / 0.05)",
          ]
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="glass-strong rounded-2xl p-5 md:p-8 relative overflow-hidden">
        <TurboExhaust isInView={isInView} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            className="w-48 h-48 md:w-64 md:h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(205 100% 50% / 0.12) 0%, hsl(18 100% 60% / 0.06) 40%, transparent 70%)",
            }}
            animate={isInView ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Top section: Gauge + Revenue */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
          <div className="w-36 h-20 md:w-44 md:h-24 flex-shrink-0">
            <RPMGauge isInView={isInView} progress={gaugeProgress} />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <motion.div
                animate={isInView ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" style={{ color: "hsl(18 100% 60%)" }} />
              </motion.div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                Turbo Revenue Engine
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
              className="text-4xl md:text-6xl font-black tracking-tighter"
            >
              <span className="text-gradient-neon">
                <CountUp end={12450} prefix="$" suffix="/mo" delay={500} />
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="text-xs text-muted-foreground mt-1"
            >
              Average client revenue after 6 months
            </motion.p>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Monthly Visitors", value: 10000, suffix: "/mo", icon: Users, color: "hsl(205 100% 50%)" },
            { label: "Qualified Leads", value: 47, suffix: "/mo", icon: TrendingUp, color: "hsl(18 100% 60%)" },
            { label: "Conversion Rate", value: 4.7, suffix: "%", icon: Zap, color: "hsl(270 100% 65%)", decimals: 1 },
            { label: "Revenue Growth", value: 340, suffix: "%", icon: DollarSign, color: "hsl(160 100% 50%)" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="glass rounded-xl p-3 text-center group hover:border-white/10 transition-colors"
            >
              <stat.icon className="w-4 h-4 mx-auto mb-1.5 transition-transform group-hover:scale-110" style={{ color: stat.color }} />
              <p className="text-lg md:text-xl font-bold text-foreground">
                <CountUp end={stat.value} suffix={stat.suffix} delay={900 + i * 120} decimals={stat.decimals} />
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive chart */}
        <div className="relative z-10 h-36 md:h-44 mt-10 mb-5">
          <InteractiveChart isInView={isInView} mouseX={mouseXVal} />
        </div>

        {/* Timeline milestones */}
        <div className="relative z-10 flex items-center justify-between px-2">
          <div className="absolute top-3 left-8 right-8 h-px bg-gradient-to-r from-primary via-accent to-neon-green opacity-20" />
          {milestones.map((m, i) => (
            <motion.div
              key={m.month}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 + i * 0.2 }}
              className="flex flex-col items-center gap-1 relative"
            >
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center border"
                style={{ borderColor: m.color, background: `${m.color}15` }}
                whileHover={{ scale: 1.3, boxShadow: `0 0 20px ${m.color}` }}
              >
                <m.icon className="w-3 h-3" style={{ color: m.color }} />
              </motion.div>
              <span className="text-[9px] font-semibold text-muted-foreground">{m.month}</span>
              <span className="text-[9px] font-bold text-foreground">{m.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
