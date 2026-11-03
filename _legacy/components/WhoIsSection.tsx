import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const WhoIsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="who">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-[1.05]">
              Built in Corporate.{" "}
              <span className="text-gradient-neon">Engineered for the Streets.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Christopher Robinson spent 4 years climbing the ranks in Tech and Finance — then left to build something that actually matters. CEO Turbo was built for the entrepreneur who's serious about their brand, their money, and their future. This isn't a design agency. It's a revenue accelerator.
            </p>
            <div className="inline-flex flex-col gap-1 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm font-bold text-primary">Founder of CEO Turbo & Stackmode Academy</p>
              <p className="text-xs text-muted-foreground">Also known as: <span className="text-foreground font-semibold">StackmodeChris</span></p>
            </div>
          </motion.div>

          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-border/50">
              <img
                src="/about/ceo-portrait.png"
                alt="Christopher Robinson - StackmodeChris - Founder of CEO Turbo and Stackmode Academy"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
