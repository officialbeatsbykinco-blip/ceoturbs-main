import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle, X, ZoomIn } from "lucide-react";

const proofImages = [
  { src: "/results/yt-views-lifetime.png", label: "1.2M+ YouTube Views" },
  { src: "/results/yt-impressions-funnel.png", label: "14.2M Impressions" },
  { src: "/results/yt-views-breakdown.png", label: "767K+ Video Views" },
  { src: "/results/estimated-revenue.png", label: "$1,500+ Revenue" },
  { src: "/results/payouts-list.png", label: "Consistent Payouts" },
  { src: "/results/balances-list.png", label: "Real Deposits" },
  { src: "/results/ad-stats.png", label: "$0.03 Per View" },
  { src: "/results/calendly-events.png", label: "53 Booked Calls" },
];

export const ProofGallerySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-16 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 mb-4">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">
              Verified Results
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter">
            Dominate Your Niche in 2026 — <span className="text-gradient-neon">The Numbers Don't Lie.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {proofImages.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={item.src}
                  alt={`CEO Turbo NFC business card brand scaling Christopher Robinson StackmodeChris — ${item.label}`}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-contain"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="p-2.5 text-center">
                <p className="text-[11px] font-bold text-foreground">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={proofImages[lightbox].src}
                alt={proofImages[lightbox].label}
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent rounded-b-xl text-center">
                <p className="text-sm font-bold text-foreground">
                  {proofImages[lightbox].label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
