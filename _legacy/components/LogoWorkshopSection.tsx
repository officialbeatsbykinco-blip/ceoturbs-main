import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Palette } from "lucide-react";

const perks = [
  "50+ professional logo templates",
  "Step-by-step customization guide",
  "Video walkthrough from Christopher Robinson",
  "AI + design secrets",
  "Launch your brand TODAY",
];

export const LogoWorkshopSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} id="logo-workshop" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="glass rounded-2xl p-8 md:p-12 text-center border-neon-orange/20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-neon-orange font-bold mb-4">Alternative Offer</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-2">
            Don't Want a Full Website? <span className="text-neon-orange">No Problem.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Learn to create professional logos in 2 hours. Templates included. Easy step-by-step.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8 text-left">
            {perks.map((perk, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 + i * 0.08 }} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-neon-orange flex-shrink-0" />
                <span className="text-sm text-foreground">{perk}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-3xl font-extrabold text-foreground mb-6">
            Only <span className="text-neon-orange">$97</span>
          </p>

          <button className="px-8 py-4 rounded-xl border-2 border-neon-orange/40 text-neon-orange font-semibold text-sm transition-all duration-300 hover:bg-neon-orange/10 glow-orange">
            <Palette className="inline mr-2 h-4 w-4" />
            Explore Logo Workshop
          </button>
        </motion.div>
      </div>
    </section>
  );
};
