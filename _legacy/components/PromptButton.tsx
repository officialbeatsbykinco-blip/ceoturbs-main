import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, CreditCard, Globe, Bot, Video, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const serviceChips = [
  { icon: CreditCard, label: "NFC Card", action: "navigate", target: "/nfc-business-card" },
  { icon: Globe, label: "Website", action: "navigate", target: "/website" },
  { icon: Bot, label: "Prompt Shop", action: "navigate", target: "/promptshop" },
  { icon: Video, label: "Thumbnails", action: "calendly", target: "" },
  { icon: Calendar, label: "Strategy Call", action: "calendly", target: "" },
];

export const PromptButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChip = (chip: typeof serviceChips[0]) => {
    setOpen(false);
    if (chip.action === "navigate") {
      navigate(chip.target);
    } else {
      window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Floating prompt button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm glow-blue shadow-2xl"
      >
        <Zap className="h-4 w-4" />
        Start Building
      </motion.button>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[61] glass-strong rounded-t-3xl border-t border-border/20 p-6 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-6" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">What do you need?</h3>
                  <p className="text-xs text-muted-foreground">Tap to turbo-accelerate your brand</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {serviceChips.map((chip) => (
                  <motion.button
                    key={chip.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChip(chip)}
                    className="flex items-center gap-3 p-4 rounded-2xl glass border border-border/20 hover:border-primary/30 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <chip.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{chip.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
