import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export const StackmodeAcademyCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 px-4" id="academy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="max-w-3xl mx-auto glass-strong rounded-2xl p-8 sm:p-10 border border-primary/20 text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-4">
          How to Scale Your Personal Brand — <span className="text-gradient-neon">The Full Blueprint</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto mb-6">
          Learn how to build multiple income streams, leverage AI-powered business tools, and scale your revenue with the Stackmode Academy.
        </p>
        <a
          href="https://stackmode.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:opacity-90 glow-gold"
        >
          Join The Stackmode Academy
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
};
