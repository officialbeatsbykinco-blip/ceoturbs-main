import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { DollarSign, TrendingUp, X, ZoomIn } from "lucide-react";

const incomeProofs = [
  { image: "/results/net-sales.png", stat: "$887.46", label: "Net volume from sales" },
  { image: "/results/net-revenue.png", stat: "$375.88", label: "Net revenue — growing monthly" },
  { image: "/results/payouts.png", stat: "Weekly", label: "Consistent payouts deposited" },
  { image: "/results/balances.png", stat: "Recurring", label: "Steady income stream" },
  { image: "/results/succeeded-1.png", stat: "$370+", label: "Successful transactions" },
  { image: "/results/succeeded-2.png", stat: "$115+", label: "More closed sales" },
];

export const IncomeProofSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-28 px-4 relative overflow-hidden" id="income-proof">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Real Income
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
            Become the CEO<br className="hidden sm:block" /> You've Always Wanted to Be.
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Turbo-boost your brand. Make more sales. Generate more revenue.
            <span className="text-foreground font-semibold"> Real money, real proof.</span>
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
            { icon: DollarSign, value: "$5M+", label: "Client Revenue Generated" },
            { icon: TrendingUp, value: "50+", label: "Websites That Sell" },
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

        {/* Proof grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {incomeProofs.map((proof, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
              onClick={() => setLightbox(i)}
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
              <div className="p-5">
                <p className="text-2xl font-black text-foreground tracking-tight">{proof.stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{proof.label}</p>
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
              className="relative max-w-4xl w-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={incomeProofs[lightbox].image}
                alt={incomeProofs[lightbox].label}
                className="w-full object-contain rounded-xl max-h-[80vh]"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <h3 className="text-3xl font-black text-foreground">{incomeProofs[lightbox].stat}</h3>
                <p className="text-sm text-muted-foreground">{incomeProofs[lightbox].label}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
