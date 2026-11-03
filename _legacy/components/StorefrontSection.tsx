import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Video, CreditCard, Globe, ArrowRight } from "lucide-react";

const storefrontCards = [
  {
    id: "prompt-shop",
    title: "Prompt Shop",
    description: "AI workflows, scanner configs & website templates",
    icon: Bot,
    media: { type: "video" as const, src: "/videos/prompt-shop-showcase.mp4" },
    link: "/promptshop",
    badge: "Coming Soon",
  },
  {
    id: "ad-creation",
    title: "Make Ads Fast",
    description: "Plug-and-play ad frameworks & AI video tools",
    icon: Video,
    media: { type: "image" as const, src: "/images/ad-creation-hero.jpeg" },
    link: "#ad-creation",
    badge: "Coming Soon",
  },
  {
    id: "digital-cards",
    title: "Digital Business Cards",
    description: "Premium NFC cards — one tap, your entire brand",
    icon: CreditCard,
    media: { type: "video" as const, src: "/videos/digital-card-showcase.mp4" },
    link: "/nfc-business-card",
    badge: "Best Seller",
  },
  {
    id: "website-design",
    title: "Website Design",
    description: "Custom, conversion-optimized sites built for CEOs",
    icon: Globe,
    media: { type: "video" as const, src: "/videos/website-design-showcase.mp4" },
    link: "/website",
    badge: "High-Ticket",
  },
];

export const StorefrontSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const navigate = useNavigate();

  const handleClick = (link: string) => {
    if (link.startsWith("#")) {
      document.getElementById(link.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(link);
    }
  };

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="storefront">
      <div id="digital-cards" className="absolute" style={{ top: "-80px" }} />
      <div id="website-design" className="absolute" style={{ top: "-80px" }} />
      <div id="prompt-shop" className="absolute" style={{ top: "-80px" }} />
      <div id="ad-creation" className="absolute" style={{ top: "-80px" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            Scale Your Business Like a CEO
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Everything you need to dominate your niche in 2026 — by Stackmodechris.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storefrontCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handleClick(card.link)}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-border/20 hover:border-primary/40 transition-all duration-500"
            >
              {/* Media background */}
              {card.media.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-label={`CEO Turbo ${card.title} — Christopher Robinson StackmodeChris`}
                >
                  <source src={card.media.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={card.media.src}
                  alt={`CEO Turbo ${card.title} — Christopher Robinson StackmodeChris`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {card.badge}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <card.icon className="h-4 w-4 text-primary" />
                  <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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
