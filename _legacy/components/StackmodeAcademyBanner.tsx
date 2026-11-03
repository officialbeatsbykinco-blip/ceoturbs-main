import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export const StackmodeAcademyBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <img
        src="/images/stackmode-academy-banner.png"
        alt="Stackmode Academy — Learn AI Trading and Business Scaling with Christopher Robinson CEO StackmodeChris"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="relative z-10 py-20 px-4 text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-3 text-foreground">
          Learn AI, Trading &amp; Business Scaling
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          Join Stackmode Academy — the education platform by Christopher Robinson for CEOs ready to level up.
        </p>
        <motion.a
          href="https://stackmode.net"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm glow-blue transition-all"
        >
          Visit Stackmode Academy
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </motion.div>
    </section>
  );
};
