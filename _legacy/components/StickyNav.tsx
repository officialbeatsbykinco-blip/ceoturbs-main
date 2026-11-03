import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Rocket } from "lucide-react";
import { useState, useEffect } from "react";

export const StickyNav = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        setVisible(hero.getBoundingClientRect().bottom < 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-center px-4 py-3"
        >
          <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-2 w-full max-w-sm border border-border/30">
            <button
              onClick={() => scrollTo("choose-path")}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:opacity-90 bg-accent text-accent-foreground glow-gold flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Get Card
            </button>
            <button
              onClick={openCalendly}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 bg-accent text-accent-foreground glow-gold hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <Rocket className="h-3.5 w-3.5" />
              Boost
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
