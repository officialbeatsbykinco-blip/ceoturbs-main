import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is the audit call really free?",
    a: "Yes. No credit card. No catch. It's a real 1-hour strategy session where I review your brand live.",
  },
  {
    q: "What happens after the call?",
    a: "You leave with a clear plan. If you want CEO Turbo to build everything for you, we discuss the Brand Boost package and payment options on the call.",
  },
  {
    q: "Do I need a website already for the digital card?",
    a: "No. The digital card works as a standalone link — no website needed.",
  },
  {
    q: "What does the Brand Boost include?",
    a: "Website design or redesign, social media profile optimization, branding, logo, and custom images. We scope it out on the free call.",
  },
  {
    q: "How long does it take?",
    a: "Digital cards are delivered fast. Full Brand Boost projects are discussed on the call based on your needs.",
  },
];

export const FAQSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 px-4" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl font-bold tracking-tighter text-center mb-12"
        >
          Build Your Brand Ecosystem — <span className="text-gradient-neon">FAQ</span>
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-primary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === i ? "max-h-40 pb-5 px-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
