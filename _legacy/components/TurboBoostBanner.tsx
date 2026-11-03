import { motion } from "framer-motion";
import { Rocket, ArrowRight } from "lucide-react";

export const TurboBoostBanner = () => {
  const openCalendly = () => {
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <button
          onClick={openCalendly}
          className="w-full glass-strong rounded-2xl p-6 border border-accent/30 flex items-center justify-between gap-4 group transition-all duration-300 hover:border-accent/50 hover:bg-accent/5 glow-blue"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-6 h-6 text-accent" />
            </div>
            <div className="text-left">
              <p className="text-base sm:text-lg font-bold text-foreground">
                Ready to Turbo Boost Your Brand?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Apply for a free strategy call — let's scale your brand together
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
};
