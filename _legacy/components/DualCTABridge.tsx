import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CreditCard, Rocket, ArrowRight, ArrowDown } from "lucide-react";

export const DualCTABridge = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const scrollToHero = () =>
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section ref={ref} className="py-16 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-emerald pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Two Ways to <span className="text-gradient-neon">Level Up</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Start with the card. Or go all in with a free strategy call.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 — Buy the card */}
          <motion.button
            onClick={scrollToHero}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-2xl p-8 text-left group border border-primary/20 hover:border-primary/40 transition-all duration-300 glow-green cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">Get Your Digital Card</h3>
            <p className="text-2xl font-black text-primary mb-3">$27.99</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              One card. All your links. Share your brand with one tap. Looks pro. Works everywhere.
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Buy Now <ArrowDown className="ml-1 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </span>
          </motion.button>

          {/* Card 2 — Book a call */}
          <motion.button
            onClick={openCalendly}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl p-8 text-left group border border-accent/20 hover:border-accent/40 transition-all duration-300 glow-blue cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
              <Rocket className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">Turbo Boost Your Brand</h3>
            <p className="text-2xl font-black text-accent mb-3">Free Call</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Website. Ads. Thumbnails. Full brand build. We handle it all. You just show up.
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-accent group-hover:gap-2 transition-all">
              Book Strategy Call <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
