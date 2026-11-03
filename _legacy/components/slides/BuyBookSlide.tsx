import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ShoppingBag, Calendar } from "lucide-react";
import { ShopifyBuyButton } from "@/components/ShopifyBuyButton";

export const BuyBookSlide = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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
    <section
      ref={ref}
      className="min-h-[100dvh] snap-start relative flex flex-col items-center overflow-hidden px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            Get Started <span className="text-gradient-neon">Instantly</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Buy your premium NFC card or book a brand strategy call — right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shopify Buy Button - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-border/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">CEO Turbo NFC Card</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Premium digital business card — tap to share your brand like a CEO.
            </p>
            <ShopifyBuyButton />
          </motion.div>

          {/* Calendly Embed - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-border/20 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Book a Strategy Call</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Free 30-min brand audit — get a custom growth roadmap.
            </p>
            <div
              className="calendly-inline-widget rounded-xl overflow-hidden"
              data-url="https://calendly.com/stackmodechris/brand-boost?background_color=000000&text_color=ffffff"
              style={{ minWidth: "280px", height: "500px" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
