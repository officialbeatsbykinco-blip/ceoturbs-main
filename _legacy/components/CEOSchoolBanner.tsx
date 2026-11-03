import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, ArrowRight } from "lucide-react";

export const CEOSchoolBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-6 px-4">
      <motion.a
        href="https://www.youtube.com/@StackmodeChris"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="block max-w-4xl mx-auto rounded-2xl bg-primary p-6 sm:p-8 text-primary-foreground hover:opacity-95 transition-opacity group"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Play className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm sm:text-base">CEO School is Live on YouTube</p>
              <p className="text-xs opacity-80">The free series that teaches you to build income, then invest it.</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all flex-shrink-0">
            Watch Now <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </motion.a>
    </section>
  );
};
