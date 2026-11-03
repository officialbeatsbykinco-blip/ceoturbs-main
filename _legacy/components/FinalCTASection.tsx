import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const FinalCTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const scrollToCards = () =>
    document.getElementById("choose-path")?.scrollIntoView({ behavior: "smooth" });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gold pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
            Turn Your Expertise Into a <span className="text-gradient-neon">High Ticket Offer.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-8">
            Book your brand strategy call or grab your premium NFC digital business card. Either way, you leave scaling like a CEO.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openCalendly}
              className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm transition-all duration-300 hover:opacity-90 glow-gold flex items-center gap-2"
            >
              Book Free Audit
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={scrollToCards}
              className="px-8 py-4 rounded-xl border border-accent/40 text-foreground font-bold text-sm transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Get My Digital Card
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
