import { TopBar } from "@/components/TopBar";
import { FooterSection } from "@/components/FooterSection";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const portfolio = [
  { name: "SWOLEjd", img: "/portfolio/swolejd.png" },
  { name: "ZahPhysique", img: "/portfolio/zahphysique.png" },
  { name: "True Legacy", img: "/portfolio/true-legacy.png" },
  { name: "7uvhavin", img: "/portfolio/7uvhavin.png" },
  { name: "Stackmode", img: "/portfolio/stackmode.png" },
  { name: "Geo Legacy", img: "/portfolio/geo-legacy.png" },
];

const steps = [
  "Strategy & wireframing",
  "Custom design",
  "Mobile-first development",
  "SEO optimization",
  "Analytics setup",
  "Launch & support",
];

const WebsiteDesign = () => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <main className="bg-background min-h-screen">
      <TopBar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                Custom Website Design for CEOs &amp; Personal Brands
              </h1>
              <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                Premium, conversion-optimized websites built by Stackmodechris. 50+ websites delivered for fitness brands, entrepreneurs, and creators.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {steps.map((step) => (
                  <div key={step} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {step}
                  </div>
                ))}
              </div>
              <a
                href="#book"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm glow-blue"
              >
                Book a Build Call
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden border border-border/20 aspect-video"
            >
              <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
                <source src="/videos/website-design-showcase.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tighter mb-8 text-center">Recent Builds</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {portfolio.map((p) => (
              <div key={p.name} className="rounded-xl overflow-hidden border border-border/20 group">
                <img
                  src={p.img}
                  alt={`${p.name} website design by Christopher Robinson CEO StackmodeChris`}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="p-3 glass">
                  <p className="text-xs font-bold text-foreground">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendly */}
      <section className="py-16 px-4" id="book">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tighter mb-6 text-center">Book a Build Call</h2>
          <div className="rounded-2xl overflow-hidden border border-border/30">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/stackmodechris/brand-boost?hide_gdpr_banner=1&background_color=000000&text_color=ffffff"
              style={{ minWidth: "320px", height: "660px" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3">Starting at $2,500 — custom quote on call</p>
        </div>
      </section>

      <FooterSection />
    </main>
  );
};

export default WebsiteDesign;
