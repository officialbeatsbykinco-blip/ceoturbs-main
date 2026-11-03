import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, QrCode, Zap, Smartphone } from "lucide-react";

export const DigitalCardSpotlight = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const scrollToCards = () =>
    document.getElementById("choose-path")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden" id="digital-card">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div
                className="w-[240px] sm:w-[280px] h-[480px] sm:h-[540px] rounded-[36px] border-[3px] border-foreground/10 overflow-hidden relative"
                style={{
                  background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px hsl(51 100% 50% / 0.05)"
                }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-black rounded-b-2xl z-10" />
                {/* Screen content */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-full border-2 border-primary/40 flex items-center justify-center"
                  >
                    <Zap className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xs text-primary font-bold tracking-widest mb-1">CEO TURBO</p>
                    <p className="text-lg font-bold text-foreground">Digital Card</p>
                    <p className="text-xs text-muted-foreground mt-1">Tap to share your brand</p>
                  </div>
                  <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">Works on any phone</p>
                  </div>
                </div>
              </div>
              {/* Glow behind phone */}
              <div className="absolute -inset-4 bg-radial-gold pointer-events-none -z-10" />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-5 leading-[1.05]">
              Stop Handing Out <span className="text-gradient-neon">Dead Paper</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              Paper cards get thrown away. Your CEO Turbo digital card lives on their phone forever. One tap and they see everything — your brand, your services, your links. Built to make people think: "This person is serious."
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "No app required",
                "Works on any phone",
                "Update your info in real time",
                "Share via text, email, or social media",
                "Designed to convert contacts into clients",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground/90">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToCards}
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:opacity-90 glow-gold flex items-center gap-2"
            >
              Get Your Digital Card
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
