import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

type ProofItem = { image: string; headline: string; sub: string };

const thumbnails: ProofItem[] = [
  { image: "/showcase/thumbnail-6figures.png", headline: "6-Figure Thumbnails", sub: "Eye-catching designs that get clicks and drive views" },
  { image: "/showcase/thumbnail-7figures.png", headline: "9-to-5 → 7 Figures", sub: "Aspirational thumbnails that speak to your audience's ambition" },
  { image: "/showcase/youtube-thumbnail.jpeg", headline: "Custom Thumbnails", sub: "Every thumbnail crafted to maximize CTR and engagement" },
];

const revenue: ProofItem[] = [
  { image: "/results/net-sales.png", headline: "$887 Net Sales", sub: "Real sales volume generated through a professional digital presence" },
  { image: "/results/net-revenue.png", headline: "$375+ Net Revenue", sub: "Growing revenue with consistent month-over-month gains" },
  { image: "/results/payouts.png", headline: "Weekly Payouts", sub: "Consistent deposits — proof the system works" },
  { image: "/results/balances.png", headline: "Recurring Revenue", sub: "Steady income stream building week after week" },
  { image: "/results/succeeded-1.png", headline: "$370+ Transactions", sub: "Successful payments — $100, $142, and more rolling in" },
  { image: "/results/succeeded-2.png", headline: "More Sales Closed", sub: "Every transaction succeeded — the funnel converts" },
];

const views: ProofItem[] = [
  { image: "/results/youtube-stats.png", headline: "184K+ Top Video", sub: "Real YouTube Studio stats — 184K views, 98% like ratio, monetization ON" },
  { image: "/results/views-lifetime.png", headline: "1.2M+ Lifetime Views", sub: "From zero to over a million views — organic growth at scale" },
  { image: "/results/impressions-funnel.png", headline: "14.2M Impressions", sub: "YouTube recommending content to millions — free reach" },
  { image: "/results/views-breakdown.png", headline: "767K Video Views", sub: "Organic reach across videos and shorts — no paid ads" },
  { image: "/results/user-events.png", headline: "Active Engagement", sub: "Real users taking action on the platform" },
  { image: "/results/new-leads.png", headline: "230+ New Leads", sub: "100% growth in leads — the funnel keeps delivering" },
];

const ads: ProofItem[] = [
  { image: "/showcase/7uvhavin-banner.png", headline: "Artist Ad Design", sub: "Custom banner for 7uvhavin — scroll-stopping social media ads" },
  { image: "/showcase/zahphysique-wallpaper.png", headline: "SEO Wallpapers", sub: "Branded wallpapers for ZahPhysique — free SEO boost when shared" },
  { image: "/showcase/youtube-thumbnail.jpeg", headline: "Brand Creatives", sub: "Full creative suite — ads, banners, and branded content" },
];

const websites: ProofItem[] = [
  { image: "/portfolio/swolejd.png", headline: "SWOLE JD", sub: "Fitness & Health Coach — full brand site with lead capture and monetization" },
  { image: "/portfolio/true-legacy.png", headline: "True Legacy", sub: "Team Leader Main Page — professional site driving team growth" },
  { image: "/portfolio/zahphysique.png", headline: "ZahPhysique", sub: "Fitness brand site with custom design, SEO, and content strategy" },
  { image: "/portfolio/stackmode.png", headline: "StackMode", sub: "Premium e-commerce brand — built for conversions and scale" },
  { image: "/portfolio/geo-legacy.png", headline: "Geo Legacy", sub: "Personal brand site — clean design with lead generation funnel" },
  { image: "/portfolio/7uvhavin.png", headline: "7uvhavin", sub: "Artist brand — custom site with music, merch, and fan engagement" },
];

const tabs = [
  { key: "websites", label: "Websites", data: websites },
  { key: "views", label: "Views & Growth", data: views },
  { key: "revenue", label: "Revenue", data: revenue },
  { key: "thumbnails", label: "Thumbnails", data: thumbnails },
  { key: "ads", label: "Ads & Design", data: ads },
] as const;

const CarouselSlider = ({ items }: { items: ProofItem[] }) => {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Reset index immediately when items change to prevent out-of-bounds access
  const safeIndex = current >= items.length ? 0 : current;

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (lightbox !== null) return;
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [next, lightbox]);

  // Reset on tab change
  useEffect(() => setCurrent(0), [items]);

  return (
    <>
      <div className="relative">
        <div className="glass rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row"
            >
              <div
                className="relative md:w-3/5 cursor-pointer group"
                onClick={() => setLightbox(safeIndex)}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={items[safeIndex].image}
                    alt={items[safeIndex].headline}
                    className="w-full h-full object-cover bg-black/40"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
                  <div className="glass-strong rounded-full p-3">
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                  {items[safeIndex].headline}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {items[safeIndex].sub}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(safeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      animate={{ width: `${((safeIndex + 1) / items.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-3 hover:bg-primary/10 transition-all z-10">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-3 hover:bg-primary/10 transition-all z-10">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === safeIndex ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground/50"}`}
            />
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
              className="relative max-w-4xl w-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={items[lightbox].image} alt={items[lightbox].headline} className="w-full object-contain rounded-xl max-h-[80vh]" />
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 glass-strong rounded-full p-2.5">
                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <h3 className="text-2xl font-black text-foreground">{items[lightbox].headline}</h3>
                <p className="text-sm text-muted-foreground">{items[lightbox].sub}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ProofCarousels = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section ref={ref} className="py-24 px-4 overflow-hidden" id="results">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Real Results
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Real Brands I've <span className="text-gradient-neon">Turbo Boosted.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Websites, views, revenue, and creative — click through the proof.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === i
                    ? "bg-primary/20 text-primary border border-primary/40 glow-green"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CarouselSlider items={tabs[activeTab].data} />
        </motion.div>
      </div>
    </section>
  );
};
