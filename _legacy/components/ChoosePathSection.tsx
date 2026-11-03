import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Rocket, ArrowRight, Check, Star } from "lucide-react";
import { ShopifyBuyButton } from "./ShopifyBuyButton";

export const ChoosePathSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const openCalendly = () =>
  window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="choose-path">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-gold pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-3">
            Get Your NFC Digital Business Card <span className="text-gradient-neon">& Scale Your Brand</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Two ways to turbo boost your revenue. Pick your lane — both lead to brand scaling and more clients.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {/* Card 1 — Digital Card (Hero card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-2xl p-6 sm:p-8 border border-primary/30 hover:border-primary/50 transition-all duration-300 group relative text-center">

            {/* Most Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                <Star className="h-3 w-3" />
                Most Popular
              </div>
            </div>

            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 mt-2 mx-auto">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">CEO Turbo Digital Business Card</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-sm mx-auto">
              One tap. Your entire brand. No app needed. Share your name, services, socials, portfolio, and contact info from a single link that works everywhere.
            </p>
            <ul className="space-y-2 mb-6 inline-block text-left">
              {[
              "Fully branded digital card",
              "Real-time updates, no reprinting ever",
              "One link to share across all platforms",
              "Looks like a CEO, not a freelancer"].
              map((item) =>
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              )}
            </ul>
            <div className="flex flex-col items-center">
              <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide uppercase">Quantity</p>
              <div className="[&_iframe]:!max-w-[280px] [&_div]:!max-w-[280px]">
                <ShopifyBuyButton />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">⚡ Instant setup — live in minutes</p>
          </motion.div>

          {/* Card 2 — Brand Boost Strategy Call */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl p-8 border border-border hover:border-accent/40 transition-all duration-300 group">

            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
              <Rocket className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Book a Brand Strategy Call</h3>
            <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
              A focused 1-hour strategy session where I personally audit your website, social media, and branding — then map out exactly how to turn your brand into a revenue machine.
            </p>
            <p className="text-xs text-accent font-semibold mb-5">For established brands doing $5K+/month</p>
            <ul className="space-y-2 mb-6">
              {[
              "Live website review",
              "Social media profile optimization",
              "Branding & visual assessment",
              "Done-for-you plan if you want to continue"].
              map((item) =>
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              )}
            </ul>
            <button
              onClick={openCalendly}
              className="w-full px-6 py-3.5 rounded-xl border-2 border-accent text-accent font-bold text-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2">

              Book Your Strategy Call
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3"> 🚨 Limited spots available! </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-6">

          Not sure which one? Start with the card. Serious about growth? Book a strategy call.
        </motion.p>
      </div>
    </section>);

};