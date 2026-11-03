import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { AmbientBackground } from "./AmbientBackground";

const benefits = [
  "Professional custom website built for YOUR business",
  "Mobile-friendly — works on phones, tablets, computers",
  "SEO optimized — shows up on Google",
  "Fast loading — people don't wait around",
  "Conversion-focused — designed to make you money",
  "Professional branding — logo, colors, fonts",
  "30-day turnaround — not 6 months",
  "Done-for-you service — you don't lift a finger",
];

export const WhatYouGetSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <AmbientBackground opacity="0.05" gradient="both" />
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-center mb-12"
        >
          When You Choose CEOTurbo,{" "}
          <span className="text-gradient-neon">You Get:</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-start gap-3 glass rounded-lg p-4"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
