import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Globe, Palette, TrendingUp, ArrowRight, MessageSquare, Hammer } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website & Branding",
    desc: "We build your site. It turns visitors into paying customers. SEO built in. Mobile ready.",
  },
  {
    icon: Palette,
    title: "Thumbnails & Ads",
    desc: "Scroll-stopping visuals that get clicks. More clicks means more money in your pocket.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Growth",
    desc: "We optimize your funnels and strategy. You close more deals. Your income grows.",
  },
  {
    icon: Rocket,
    title: "Full Brand Acceleration",
    desc: "From zero to full brand presence. We handle everything. You focus on winning.",
  },
];

const steps = [
  { icon: MessageSquare, num: "01", label: "TALK", time: "30 min" },
  { icon: Hammer, num: "02", label: "BUILD", time: "30 days" },
  { icon: TrendingUp, num: "03", label: "PROFIT", time: "Forever" },
];

export const WhyYouNeedSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const openCalendly = () =>
    window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden" id="accelerate">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-emerald pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-4">
            Next Level
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
            What You Get on a <span className="text-gradient-neon">Turbo Boost</span> Call
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We build your brand. You make more money. It's that simple.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl p-6 sm:p-8 mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center mb-6 font-semibold">
            How It Works
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{step.label}</p>
                    <p className="text-xs text-neon-orange font-semibold">{step.time}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={openCalendly}
            className="group px-8 py-4 rounded-xl border border-accent/30 bg-accent/10 text-accent font-semibold text-sm transition-all duration-300 hover:bg-accent/20 glow-blue"
          >
            Book Your Free Call
            <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
