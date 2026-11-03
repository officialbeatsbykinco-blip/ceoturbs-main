import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, Zap, Smartphone, Globe } from "lucide-react";

const signals = [
  { icon: Flame, text: "50+ brands transformed" },
  { icon: Zap, text: "Built in under 24 hours" },
  { icon: Smartphone, text: "Works on every device" },
  { icon: Globe, text: "Clients across the US" },
];

export const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-8 px-4 border-y border-border/50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10"
      >
        {signals.map((s, i) => (
          <motion.div
            key={s.text}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
          >
            <s.icon className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">{s.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
