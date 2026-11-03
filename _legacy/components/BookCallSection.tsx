import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Check, Calendar } from "lucide-react";

const benefits = [
  "Full website audit & redesign plan",
  "Social media profile optimization",
  "Branding & visual identity review",
  "Done-for-you implementation roadmap",
];

export const BookCallSection = () => {
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
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="book-call">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 mb-4">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">
              Free Strategy Session
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Book a Brand Strategy Call
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            A focused session where I audit your website, social media, and branding — then map out exactly how to scale your revenue.
          </p>
        </motion.div>

        {/* Benefits grid - centered 2x2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
        >
          {benefits.map((item) => (
            <div key={item} className="flex items-start gap-3 glass rounded-xl p-4 border border-border/20">
              <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/90">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <p className="text-xs text-muted-foreground mb-2">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["SWOLEjd", "ZahPhysique", "True Legacy", "7uvhavin"].map((name) => (
              <span key={name} className="text-[10px] font-bold text-accent uppercase tracking-wider px-3 py-1 glass rounded-full">
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Calendly embed — full width centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-border/30"
        >
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/stackmodechris/brand-boost?hide_gdpr_banner=1&background_color=000000&text_color=ffffff"
            style={{ minWidth: "320px", height: "660px" }}
          />
        </motion.div>
      </div>
    </section>
  );
};
