import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket } from "lucide-react";

export const FinalCTASlide = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section
      ref={ref}
      className="h-[100dvh] snap-start relative flex flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-radial-violet pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-radial-gold pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="relative z-10 text-center max-w-lg"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">
          Ready to <span className="text-gradient-neon">Turbo-Accelerate?</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md mx-auto">
          Free 30-minute strategy call. No pressure. Just real talk about scaling your brand.
        </p>
        <motion.button
          onClick={openCalendly}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-blue"
        >
          <Rocket className="h-4 w-4" />
          Book Strategy Call
        </motion.button>
      </motion.div>
    </section>
  );
};
