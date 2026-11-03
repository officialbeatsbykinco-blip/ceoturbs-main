import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Website & Branding",
    media: "/videos/website-design-showcase.mp4",
    type: "video" as const,
    link: "/services",
  },
  {
    title: "YouTube Thumbnails",
    media: "/showcase/youtube-thumbnail-new.png",
    type: "image" as const,
    link: "/services",
  },
  {
    title: "Ad & Banner Design",
    media: "/images/ad-creation-hero.jpeg",
    type: "image" as const,
    link: "/services",
  },
  {
    title: "Revenue Growth",
    media: "/videos/income-boost-bg.mp4",
    type: "video" as const,
    link: "/services",
  },
];

export const ServicesSlide = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="h-[100dvh] snap-start relative flex flex-col justify-center overflow-hidden px-4"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-2">
            Our Tools
          </h2>
          <p className="text-muted-foreground text-sm">Tap to explore</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(s.link)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-border/20 hover:border-primary/30 transition-all duration-300 group"
            >
              {s.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={s.media} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={s.media}
                  alt={`CEO Turbo ${s.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <h3 className="text-sm font-bold text-foreground mb-0.5">{s.title}</h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
