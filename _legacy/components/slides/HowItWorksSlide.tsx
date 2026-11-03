import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Hammer, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    num: "01",
    title: "Talk",
    desc: "Tell us your vision. We map your brand strategy in a free 30-min call.",
  },
  {
    icon: Hammer,
    num: "02",
    title: "Build",
    desc: "We design, develop, and launch everything — NFC cards, websites, content.",
  },
  {
    icon: TrendingUp,
    num: "03",
    title: "Profit",
    desc: "Go live. Start collecting leads, closing deals, and scaling revenue.",
  },
];

export const HowItWorksSlide = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="h-[100dvh] snap-start relative flex flex-col justify-center overflow-hidden px-4"
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm">Three steps. Zero complexity.</p>
        </motion.div>

        {/* Horizontal swipeable steps */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
          <div className="flex gap-4 w-max sm:w-full sm:justify-center">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.15 }}
                className="w-64 sm:w-72 shrink-0 glass-strong rounded-2xl p-6 border border-border/20 text-center relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-wider">
                  STEP {step.num}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
