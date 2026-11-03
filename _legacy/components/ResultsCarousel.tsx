import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const results = [
  { image: "/results/views-lifetime.png", headline: "1.2M+ Views", sub: "Lifetime YouTube analytics — from zero to over a million views" },
  { image: "/results/impressions-funnel.png", headline: "14.2M Impressions", sub: "YouTube recommending content at scale — 726K views from impressions alone" },
  { image: "/results/views-breakdown.png", headline: "767K Video Views", sub: "Organic reach across videos and shorts — no paid ads" },
  { image: "/results/net-revenue.png", headline: "$375+ Net Revenue", sub: "Growing revenue with 23 new users and consistent month-over-month gains" },
  { image: "/results/net-sales.png", headline: "$887 Net Sales", sub: "Real sales volume generated through a professional digital presence" },
  { image: "/results/payouts.png", headline: "Consistent Payouts", sub: "Weekly deposits hitting the account — proof the system works" },
  { image: "/results/balances.png", headline: "Recurring Revenue", sub: "Steady deposits week after week — building a real income stream" },
  { image: "/results/succeeded-1.png", headline: "$370+ Transactions", sub: "Successful payments rolling in — $100, $142, and more" },
  { image: "/results/succeeded-2.png", headline: "More Sales Closed", sub: "Every transaction succeeded — the funnel converts" },
  { image: "/results/user-events.png", headline: "Active User Growth", sub: "Real engagement data — users taking action consistently" },
];

export const ResultsCarousel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % results.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + results.length) % results.length), []);

  // Auto-advance
  useEffect(() => {
    if (lightbox !== null) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, lightbox]);

  return (
    <section ref={ref} className="py-24 px-4 overflow-hidden" id="results">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Proof
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Real Numbers. <span className="text-gradient-neon">Real Proof.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Screenshots don't lie. These are actual results from real clients.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          {/* Main slide */}
          <div className="glass rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col md:flex-row"
              >
                {/* Image */}
                <div
                  className="relative md:w-3/5 cursor-pointer group"
                  onClick={() => setLightbox(current)}
                >
                  <div className="aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden">
                    <img
                      src={results[current].image}
                      alt={results[current].headline}
                      className="w-full h-full object-contain bg-black/40 p-4"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
                    <div className="glass-strong rounded-full p-3">
                      <ZoomIn className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                  <motion.h3
                    key={`h-${current}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4"
                  >
                    {results[current].headline}
                  </motion.h3>
                  <motion.p
                    key={`p-${current}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-muted-foreground text-base md:text-lg leading-relaxed"
                  >
                    {results[current].sub}
                  </motion.p>

                  {/* Slide counter */}
                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-mono">
                      {String(current + 1).padStart(2, "0")} / {String(results.length).padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((current + 1) / results.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-3 hover:bg-primary/10 hover:border-primary/30 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-3 hover:bg-primary/10 hover:border-primary/30 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {results.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
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
                src={results[lightbox].image}
                alt={results[lightbox].headline}
                className="w-full object-contain rounded-xl max-h-[80vh]"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <h3 className="text-2xl font-black text-foreground">{results[lightbox].headline}</h3>
                <p className="text-sm text-muted-foreground">{results[lightbox].sub}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
