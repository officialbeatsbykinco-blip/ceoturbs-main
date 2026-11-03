import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";

const proofItems = [
  { src: "/results/yt-views-lifetime.png", label: "1.2M+ YouTube Views" },
  { src: "/results/yt-impressions-funnel.png", label: "14.2M Impressions" },
  { src: "/results/yt-views-breakdown.png", label: "767K+ Video Views" },
  { src: "/results/estimated-revenue.png", label: "$1,500+ Revenue" },
  { src: "/results/payouts-list.png", label: "Consistent Payouts" },
  { src: "/results/balances-list.png", label: "Real Deposits" },
  { src: "/results/ad-stats.png", label: "$0.03 Per View" },
  { src: "/results/calendly-events.png", label: "53 Booked Calls" },
];

export const ProofSlide = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="h-[100dvh] snap-start relative flex flex-col justify-center overflow-hidden px-4"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 mb-4">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">
              Real Results
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
            The Numbers <span className="text-gradient-neon">Don't Lie.</span>
          </h2>
        </motion.div>

        {/* Horizontal scrollable proof carousel */}
        <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          <div className="flex gap-3 w-max">
            {proofItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.06 }}
                className="w-52 shrink-0 glass rounded-2xl overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.src}
                    alt={`CEO Turbo result — ${item.label}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-[11px] font-bold text-foreground">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-muted-foreground text-center mt-4"
        >
          ← Swipe to see more results →
        </motion.p>
      </div>
    </section>
  );
};
