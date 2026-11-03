import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, ArrowRight } from "lucide-react";

export const TestimonialsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const scrollToForm = () =>
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden" id="proof-video">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-emerald pointer-events-none opacity-40" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
            Real Proof
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            I Built Websites For{" "}
            <span className="text-gradient-neon">Top Influencers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch how I helped fitness influencer @swolejd (56K+ followers) and brands like @zahphysique and True Legacy turbo boost their growth.
          </p>
        </motion.div>

        {/* YouTube Short Embed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-sm mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/50 glow-green group cursor-pointer"
            onClick={() => window.open("https://www.youtube.com/watch?v=wnhLuPeY59k", "_blank")}
          >
            <div className="aspect-[9/16]">
              <img
                src="/showcase/youtube-thumbnail-new.png"
                alt="I Quit My Job To Build A Website For 2 Influencers"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 group-hover:bg-background/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-primary-foreground ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats row below video */}
          <div className="flex justify-center gap-6 mt-6">
            {[
              { stat: "56K+", label: "Followers" },
              { stat: "50+", label: "Sites Built" },
              { stat: "24/7", label: "Dedicated Support" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-xl font-extrabold text-primary">{s.stat}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <button
            onClick={scrollToForm}
            className="group px-8 py-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 glow-green"
          >
            Get Results Like These
            <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
