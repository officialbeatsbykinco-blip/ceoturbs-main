import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, Palette, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    num: "01",
    title: "Pick Your Product",
    desc: "Choose from NFC cards, website builds, prompt packs, or ad frameworks.",
  },
  {
    icon: Palette,
    num: "02",
    title: "We Build & Customize",
    desc: "Our team designs and configures everything to match your brand perfectly.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Launch & Scale",
    desc: "Go live instantly. Start collecting leads, closing deals, and growing revenue.",
  },
];

export const HowItWorksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Three steps. No complexity. Just results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-border/30 text-center relative group hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2 group-hover:bg-primary/15 transition-colors">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
