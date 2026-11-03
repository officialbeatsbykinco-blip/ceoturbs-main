import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Map, Hammer, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    num: "01",
    title: "We Audit",
    desc: "I review your current website, social bios, and brand visuals live on the call.",
  },
  {
    icon: Map,
    num: "02",
    title: "We Strategize",
    desc: "You walk away with a custom roadmap — exactly what to fix and how.",
  },
  {
    icon: Hammer,
    num: "03",
    title: "We Build",
    desc: "If you want CEO Turbo to handle everything, we discuss your Brand Boost package on the call. Flexible pricing. Payment plans available.",
  },
];

export const HowBrandBoostWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section ref={ref} className="py-20 px-4" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center mb-14"
        >
          What Happens <span className="text-gradient-neon">on the Call</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-xl p-8 text-center hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs text-primary font-bold tracking-widest mb-2">STEP {step.num}</p>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={openCalendly}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:opacity-90 glow-gold flex items-center gap-2 mx-auto"
          >
            Book Your Strategy Call
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
