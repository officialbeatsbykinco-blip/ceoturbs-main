import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bot, Video, CreditCard, Globe } from "lucide-react";

const storefrontCards = [
  {
    id: "prompt-shop",
    title: "Prompt Shop",
    description: "AI workflows & templates",
    icon: Bot,
    media: { type: "video" as const, src: "/videos/prompt-shop-showcase.mp4" },
    link: "/promptshop",
    badge: "Coming Soon",
  },
  {
    id: "ad-creation",
    title: "Make Ads Fast",
    description: "Ad frameworks & AI video tools",
    icon: Video,
    media: { type: "image" as const, src: "/images/ad-creation-hero.jpeg" },
    link: "#ad-creation",
    badge: "Coming Soon",
  },
  {
    id: "digital-cards",
    title: "Digital Business Cards",
    description: "One tap. Your entire brand.",
    icon: CreditCard,
    media: { type: "video" as const, src: "/videos/digital-card-showcase.mp4" },
    link: "/nfc-business-card",
    badge: "Best Seller",
  },
  {
    id: "website-design",
    title: "Website Design",
    description: "Built for CEOs who want results",
    icon: Globe,
    media: { type: "video" as const, src: "/videos/website-design-showcase.mp4" },
    link: "/website",
    badge: "High-Ticket",
  },
];

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = (link: string) => {
    if (link.startsWith("#")) {
      document.getElementById(link.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(link);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-16" id="hero">
      {/* Background glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px]" style={{ background: "radial-gradient(ellipse at center, hsl(205 100% 50% / 0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px]" style={{ background: "radial-gradient(ellipse at center, hsl(270 100% 65% / 0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Headline — centered, tight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">The CEO Growth Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.95] mb-4 max-w-3xl mx-auto">
            Scale Your Brand.
            <span className="text-gradient-neon"> Make More Money.</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Pick a tool. Get results. Built by Christopher Robinson CEO.
          </p>
        </motion.div>

        {/* 4 interactive cards — the main interface */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {storefrontCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(card.link)}
              className="group relative aspect-[4/5] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-border/20 hover:border-primary/40 transition-all duration-500"
            >
              {/* Media */}
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
                  loading="eager"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {card.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <card.icon className="h-3.5 w-3.5 text-primary" />
                  <h2 className="text-sm sm:text-base font-bold text-foreground">{card.title}</h2>
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtle trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[10px] text-muted-foreground text-center"
        >
          Trusted by entrepreneurs & CEOs — by Stackmodechris
        </motion.p>
      </div>
    </section>
  );
};
