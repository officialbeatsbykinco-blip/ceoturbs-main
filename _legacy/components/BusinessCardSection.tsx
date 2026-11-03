import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CreditCard, QrCode, Share2 } from "lucide-react";

export const BusinessCardSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const scrollToForm = () =>
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden" id="business-cards">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-violet pointer-events-none opacity-50" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-4">
            New Service
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
            Virtual Business Cards{" "}
            <span className="text-gradient-neon">That Convert</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            QR-powered digital cards that make you unforgettable. Scan, connect, close deals — all from your phone.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Spinning Card Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative" style={{ perspective: "1200px" }}>
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="w-[280px] sm:w-[340px] h-[170px] sm:h-[200px] relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 border border-primary/30 rounded-2xl p-6 flex flex-col justify-between glow-green">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">CEO Turbo</p>
                      <p className="text-foreground font-black text-lg mt-1">Your Name</p>
                      <p className="text-muted-foreground text-xs">CEO & Founder</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">yoursite.com</p>
                      <QrCode className="w-8 h-8 text-primary/60" />
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-secondary/30 via-primary/20 to-accent/30 border border-secondary/30 rounded-2xl p-6 flex flex-col items-center justify-center glow-purple">
                    <QrCode className="w-16 h-16 text-foreground/80 mb-3" />
                    <p className="text-xs text-muted-foreground">Scan to connect</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 space-y-5"
          >
            {[
              { icon: QrCode, title: "QR Code Powered", desc: "Custom QR that links to your full digital profile" },
              { icon: CreditCard, title: "Premium Design", desc: "Sleek, branded card that matches your aesthetic" },
              { icon: Share2, title: "Instant Sharing", desc: "Share via NFC, QR, or direct link — works everywhere" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-start gap-4 hover:border-primary/30 transition-all duration-300">
                <div className="glass rounded-lg p-2.5 flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={scrollToForm}
              className="group w-full px-8 py-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 glow-green mt-4"
            >
              Get Your Virtual Card
              <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
