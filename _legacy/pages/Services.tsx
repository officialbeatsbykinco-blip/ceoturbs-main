import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ArrowRight, Calendar, Globe, CreditCard, Bot, Video } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PromptButton } from "@/components/PromptButton";

const services = [
  {
    id: "websites",
    title: "Website & Branding",
    desc: "Custom, conversion-optimized websites built for CEOs and entrepreneurs. Mobile-first, lightning fast.",
    icon: Globe,
    media: { type: "video" as const, src: "/videos/website-design-showcase.mp4" },
    details: [
      "Custom responsive design",
      "SEO optimization built-in",
      "Lead capture & analytics",
      "Unlimited revisions",
    ],
    cta: "calendly",
  },
  {
    id: "thumbnails",
    title: "YouTube Thumbnails",
    desc: "Click-worthy thumbnails that skyrocket your CTR. High-contrast, scroll-stopping designs.",
    icon: Video,
    media: { type: "image" as const, src: "/showcase/youtube-thumbnail-new.png" },
    details: [
      "A/B tested designs",
      "Brand-consistent style",
      "48-hour turnaround",
      "Unlimited revisions",
    ],
    cta: "calendly",
  },
  {
    id: "ads",
    title: "Ad & Banner Design",
    desc: "High-converting ad creatives and banner designs for Meta, Google, and YouTube campaigns.",
    icon: Video,
    media: { type: "image" as const, src: "/images/ad-creation-hero.jpeg" },
    details: [
      "Platform-optimized sizes",
      "Copy + design included",
      "Performance-tested layouts",
      "Quick iterations",
    ],
    cta: "calendly",
  },
  {
    id: "nfc",
    title: "Premium NFC Cards",
    desc: "One tap shares your entire brand — website, socials, portfolio. Premium metal & PVC options.",
    icon: CreditCard,
    media: { type: "video" as const, src: "/videos/digital-card-showcase.mp4" },
    details: [
      "Custom brand design",
      "NFC + QR code",
      "Unlimited taps",
      "Works on any phone",
    ],
    cta: "buy",
    buyLink: "/nfc-business-card",
  },
  {
    id: "prompts",
    title: "AI Prompt Shop",
    desc: "Pre-built AI workflows, scanner configs, and website templates to 10x your output.",
    icon: Bot,
    media: { type: "video" as const, src: "/videos/prompt-shop-showcase.mp4" },
    details: [
      "Tested AI prompts",
      "Business automation",
      "Content generation",
      "Regular updates",
    ],
    cta: "navigate",
    buyLink: "/promptshop",
  },
  {
    id: "growth",
    title: "Revenue Growth",
    desc: "Full brand acceleration — strategy, systems, and scaling. For CEOs ready to dominate.",
    icon: Calendar,
    media: { type: "video" as const, src: "/videos/income-boost-bg.mp4" },
    details: [
      "1-on-1 strategy sessions",
      "Revenue optimization",
      "Sales funnel design",
      "Ongoing support",
    ],
    cta: "calendly",
  },
];

const Services = () => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const activeService = services.find((s) => s.id === activeSheet);

  const handleCTA = (service: typeof services[0]) => {
    if (service.cta === "calendly") {
      window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");
    } else if (service.buyLink) {
      window.location.href = service.buyLink;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-28">
      <TopBar />

      <div className="pt-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 pt-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            Our <span className="text-gradient-neon">Tools</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Everything you need to scale your brand — by Stackmodechris.
          </p>
        </motion.div>

        {/* Service card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSheet(service.id)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-border/20 hover:border-primary/30 transition-all duration-300 group"
            >
              {service.media.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={service.media.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={service.media.src}
                  alt={`CEO Turbo ${service.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <service.icon className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">{service.title}</h3>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom sheet modal */}
      <AnimatePresence>
        {activeService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
              onClick={() => setActiveSheet(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[61] glass-strong rounded-t-3xl border-t border-border/20 p-6 pb-10 max-h-[75dvh] overflow-y-auto"
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-6" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <activeService.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{activeService.title}</h3>
                    <p className="text-xs text-muted-foreground">{activeService.desc}</p>
                  </div>
                </div>
                <button onClick={() => setActiveSheet(null)} className="p-2 rounded-full hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {activeService.details.map((d) => (
                  <div key={d} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {d}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCTA(activeService)}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-blue flex items-center justify-center gap-2"
              >
                {activeService.cta === "buy" ? "Buy Now" : activeService.cta === "navigate" ? "Explore" : "Book Strategy Call"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PromptButton />
      <BottomNav />
    </div>
  );
};

export default Services;
