import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, X, Star, ZoomIn } from "lucide-react";

const sites = [
  {
    image: "/showcase/swolejd-site.png",
    client: "SWOLE JD",
    niche: "Fitness & Coaching",
    url: "https://swolejd.com",
    result: "500+ views in 3 days",
  },
  {
    image: "/showcase/stackmode-site.png",
    client: "Stackmode Academy",
    niche: "AI Education Platform",
    url: "https://stackmode.net",
    result: "$100K+ in revenue",
  },
  {
    image: "/showcase/zahphysique-site.png",
    client: "ZahPhysique",
    niche: "Health & Wellness",
    url: "https://zahphysique.com",
    result: "10x more booked calls",
  },
  {
    image: "/showcase/true-legacy-site.png",
    client: "True Legacy",
    niche: "Global Business Launch",
    url: "https://true-legacy-launch.lovable.app",
    result: "340% traffic increase",
  },
  {
    image: "/showcase/true-legacy-global-site.png",
    client: "True Legacy Global",
    niche: "Wellness Enterprise",
    url: "https://true-legacy-launch.lovable.app",
    result: "Professional authority",
  },
  {
    image: "/showcase/7uvhavin-site.png",
    client: "7uvhavin",
    niche: "Music & Entertainment",
    url: "https://7uvhavin.com",
    result: "2,000+ followers gained",
  },
];

export const WebsiteShowcaseSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="showcase">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-3">
            Website Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            Design Your Website — <span className="text-gradient-neon">Scale Your Business Like a CEO.</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            High-converting websites built for entrepreneurs, coaches, and creators. See the work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site, i) => (
            <motion.div
              key={site.client}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className="group glass rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={site.image}
                  alt={`CEO Turbo NFC business card brand scaling website design Christopher Robinson StackmodeChris — ${site.client}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-2 right-2 glass-strong rounded-full px-2.5 py-0.5 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-accent fill-accent" />
                  <span className="text-[9px] font-bold text-foreground">{site.result}</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-accent font-semibold uppercase tracking-wider">{site.client}</p>
                    <p className="text-[10px] text-muted-foreground">{site.niche}</p>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-full p-1.5 hover:bg-accent/10 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-accent transition-colors" />
                  </a>
                </div>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-5xl w-full max-h-[85vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={sites[lightbox].image}
                alt={sites[lightbox].client}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <a
                  href={sites[lightbox].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-primary/10 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </a>
                <button
                  onClick={() => setLightbox(null)}
                  className="glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent rounded-b-xl text-center">
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
                  {sites[lightbox].client} — {sites[lightbox].niche}
                </p>
                <p className="text-sm font-bold text-foreground">{sites[lightbox].result}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
