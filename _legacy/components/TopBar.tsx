import { motion } from "framer-motion";
import ceoTurboLogo from "@/assets/ceo-turbo-logo.png";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />

      <div className="relative">
        <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-border/15" />

        <div className="relative max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img src={ceoTurboLogo} alt="CEO Turbo" className="h-8 w-8 rounded-lg" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-black tracking-[0.15em] text-foreground uppercase">CEO</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">TURBO</span>
            </div>
          </motion.div>

          {/* Desktop CTA */}
          <motion.button
            onClick={openCalendly}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground glow-blue transition-all duration-200"
          >
            Boost Your Brand
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
