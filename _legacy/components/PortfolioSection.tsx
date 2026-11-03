import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, X, ZoomIn } from "lucide-react";

const portfolioItems = [
  { image: "/portfolio/swolejd.png", url: "https://swolejd.com", title: "Fitness & Health Coach", client: "SWOLE JD", result: "500 views in 3 days, views into clients" },
  { image: "/portfolio/true-legacy.png", url: "https://true-legacy-launch.lovable.app", title: "Team Leader Main Page", client: "True Legacy Launch", result: "Professional authority established" },
  { image: "/portfolio/zahphysique.png", url: "https://zahphysique.com", title: "Health & Wellness Brand", client: "ZahPhysique", result: "From no leads → booked calls" },
  { image: "/portfolio/stackmode.png", url: "https://stackmode.net", title: "Digital Education Platform", client: "StackMode Network", result: "100+ students. $100K+ revenue" },
  { image: "/portfolio/geo-legacy.png", url: "https://geo-legacy-globe.lovable.app", title: "Global Legacy Platform", client: "Geo Legacy Globe", result: "Beautiful, high-converting design" },
  { image: "/portfolio/7uvhavin.png", url: "https://7uvhavin.com", title: "Music Producer & Artist", client: "7uvhavin", result: "2000+ followers, professional brand" },
];

export const PortfolioSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 px-4" id="portfolio">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Real Websites. Real Results.{" "}
            <span className="text-gradient-neon">Real Money.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            These businesses look professional now. And they make more money.
          </p>
        </motion.div>

        {/* Grid layout — large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.url}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/10] cursor-pointer" onClick={() => setLightbox(i)}>
                <img
                  src={item.image}
                  alt={`${item.client} website`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                {/* Zoom overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
                  <div className="glass-strong rounded-full p-3">
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{item.client}</p>
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.result}</p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 glass rounded-full p-2.5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                </a>
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
              className="relative max-w-5xl w-full max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={portfolioItems[lightbox].image}
                alt={portfolioItems[lightbox].client}
                className="w-full h-full object-contain rounded-xl"
              />

              {/* Lightbox controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <a
                  href={portfolioItems[lightbox].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Site
                </a>
                <button
                  onClick={() => setLightbox(null)}
                  className="glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                  {portfolioItems[lightbox].client}
                </p>
                <h3 className="text-xl font-bold text-foreground">
                  {portfolioItems[lightbox].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {portfolioItems[lightbox].result}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
