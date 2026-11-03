import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ceoTurboLogo from "@/assets/ceo-turbo-logo-full.png";
import stackmodeLogo from "@/assets/stackmode-logo.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const AboutPreviewSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial-violet pointer-events-none" />
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10">

        <div className="glass rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter mb-2">
            Meet <span className="text-gradient-neon">Christopher Robinson</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">aka StackmodeChris</p>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            I left Tech & Finance to help people make more money. I built 50+ websites and helped generate over $5M in revenue. Now I teach real skills that pay: Web Design, AI, and Business Growth.
          </p>

          {/* Company logos */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img src={stackmodeLogo} alt="Stackmode Network" className="h-10 w-10 rounded-lg" loading="lazy" />
              <div>
                <p className="text-sm font-bold text-foreground">Stackmode Network</p>
                <p className="text-xs text-muted-foreground">stackmode.net</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={ceoTurboLogo} alt="CEO Turbo" className="h-10 w-auto rounded-lg" loading="lazy" />
              <div>
                <p className="text-sm font-bold text-foreground">CEO Turbo</p>
                <p className="text-xs text-muted-foreground">ceoturbo.com</p>
              </div>
            </div>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all">

            Read the full story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>);

};