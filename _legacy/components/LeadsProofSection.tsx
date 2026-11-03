import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Users, PhoneCall, X, ZoomIn, TrendingUp } from "lucide-react";

const leadsProofs = [
  { image: "/results/new-leads.png", stat: "230 Leads", label: "100% growth in new leads over 612 days" },
  { image: "/results/views-lifetime.png", stat: "1.2M+ Views", label: "Lifetime views — organic reach at scale" },
  { image: "/results/impressions-funnel.png", stat: "14.2M Impressions", label: "YouTube recommending content to millions" },
  { image: "/results/views-breakdown.png", stat: "767K Video Views", label: "Organic reach across videos and shorts" },
  { image: "/results/user-events.png", stat: "Active Users", label: "Real engagement — users taking action" },
];

export const LeadsProofSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-28 px-4 relative overflow-hidden" id="leads-proof">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Lead Generation
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
            Book More Calls.<br className="hidden sm:block" />
            <span className="text-gradient-neon">Get More Leads.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Your website should work for you 24/7. More eyes. More clicks. More people reaching out.
            <span className="text-foreground font-semibold"> That's what we build.</span>
          </p>
        </motion.div>

        {/* Stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mb-14"
        >
          {[
            { icon: Users, value: "230+", label: "New Leads Generated" },
            { icon: PhoneCall, value: "100%", label: "Lead Growth Rate" },
            { icon: TrendingUp, value: "14.2M", label: "Total Impressions" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="glass rounded-xl p-2.5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Proof grid — lead image large on top, rest below */}
        <div className="space-y-5">
          {/* Hero proof — large */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
            onClick={() => setLightbox(0)}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-3/5 aspect-[16/10] md:aspect-auto md:min-h-[350px] overflow-hidden bg-black/30">
                <img
                  src={leadsProofs[0].image}
                  alt={leadsProofs[0].label}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
                  <div className="glass-strong rounded-full p-3">
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-3">
                  {leadsProofs[0].stat}
                </p>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {leadsProofs[0].label}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Remaining proofs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leadsProofs.slice(1).map((proof, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
                className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() => setLightbox(i + 1)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
                  <img
                    src={proof.image}
                    alt={proof.label}
                    className="w-full h-full object-contain p-3"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
                    <div className="glass-strong rounded-full p-3">
                      <ZoomIn className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xl font-black text-foreground tracking-tight">{proof.stat}</p>
                  <p className="text-xs text-muted-foreground mt-1">{proof.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
              className="relative max-w-4xl w-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={leadsProofs[lightbox].image}
                alt={leadsProofs[lightbox].label}
                className="w-full object-contain rounded-xl max-h-[80vh]"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <h3 className="text-3xl font-black text-foreground">{leadsProofs[lightbox].stat}</h3>
                <p className="text-sm text-muted-foreground">{leadsProofs[lightbox].label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
