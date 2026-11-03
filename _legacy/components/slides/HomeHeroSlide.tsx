import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomeHeroSlide = () => {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="h-[100dvh] snap-start relative flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-30"
          aria-label="CEO Turbo NFC digital business card showcase Christopher Robinson"
        >
          <source src="/videos/digital-card-showcase.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              The CEO Growth Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-5">
            Share Your Brand
            <br />
            <span className="text-gradient-neon">Like a CEO.</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto">
            Premium NFC cards, websites, and growth tools — built by Stackmodechris.
          </p>

          <motion.button
            onClick={() => navigate("/nfc-business-card")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-blue"
          >
            <ShoppingBag className="h-4 w-4" />
            Buy Now
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
