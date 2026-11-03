import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, X, ZoomIn, Palette, ImageIcon, Youtube } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const creativeWork = [
{
  image: "/showcase/thumbnail-brand-deal.png",
  title: "YouTube Thumbnails",
  desc: "Eye-catching thumbnails that get clicks",
  type: "Thumbnail Design"
},
{
  image: "/showcase/7uvhavin-banner.png",
  title: "Artist Banners & Ads",
  desc: "Custom ad design for 7uvhavin",
  type: "Ad Design"
},
{
  image: "/showcase/zahphysique-wallpaper.png",
  title: "Brand Wallpapers",
  desc: "SEO-optimized wallpapers for ZahPhysique",
  type: "Wallpaper"
}];


const services = [
{ icon: Palette, title: "Ad & Banner Design", desc: "Scroll-stopping visuals for social media and paid ads." },
{ icon: ImageIcon, title: "Wallpapers & SEO Assets", desc: "Branded wallpapers people share. Free SEO boost." },
{ icon: Youtube, title: "YouTube Thumbnails", desc: "Crazy thumbnails that make people click. More views = more money." }];


export const VideoShowcaseSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollToForm = () =>
  document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden" id="creative-services">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-violet pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14">

          <p className="text-[10px] uppercase tracking-[0.3em] text-neon-orange font-semibold mb-4">
            More Than Websites
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Whatever You Need To{" "}
            <span className="text-gradient-fire">Turbo Accelerate</span>
            <br />Your Brand's Growth
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ads. Banners. Thumbnails. Wallpapers. We design everything your brand needs to stand out and make money.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {services.map((s, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="glass rounded-xl p-6 text-center group hover:border-neon-orange/30 transition-all duration-300">

              <div className="w-12 h-12 rounded-full bg-neon-orange/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-neon-orange/20 transition-colors">
                <s.icon className="h-5 w-5 text-neon-orange" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          )}
        </div>

        {/* Creative work showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {creativeWork.map((item, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            className="group glass rounded-2xl overflow-hidden hover:border-neon-orange/30 transition-all duration-300 cursor-pointer"
            onClick={() => setLightbox(i)}>

              <div className="relative overflow-hidden aspect-video">
                <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy" />

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/20 backdrop-blur-[2px]">
                  <div className="glass-strong rounded-full p-3">
                    <ZoomIn className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-neon-orange/30 bg-primary text-primary-foreground">
                  {item.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12">

          <button
            onClick={scrollToForm}
            className="group px-8 py-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 glow-green">

            Book Your Free Strategy Call
            <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 cursor-pointer"
          onClick={() => setLightbox(null)}>

            <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-3xl w-full max-h-[85vh] cursor-default"
            onClick={(e) => e.stopPropagation()}>

              <img
              src={creativeWork[lightbox].image}
              alt={creativeWork[lightbox].title}
              className="w-full h-full object-contain rounded-xl" />

              <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 glass-strong rounded-full p-2.5 hover:bg-foreground/10 transition-colors">

                <X className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent rounded-b-xl">
                <p className="text-xs text-neon-orange font-semibold uppercase tracking-wider mb-1">
                  {creativeWork[lightbox].type}
                </p>
                <h3 className="text-xl font-bold text-foreground">
                  {creativeWork[lightbox].title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </section>);

};