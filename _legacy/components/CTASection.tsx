import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, X, Check } from "lucide-react";

export const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={ref} id="cta-section" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-violet pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
            Ready To <span className="text-gradient-neon">Boost Your Income?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            Your first step: A free 30-minute strategy call. No pressure. No sales pitch. Just real talk about your business.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="group px-8 py-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 glow-green"
          >
            Book Your Free Strategy Call
            <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-2xl p-8 max-w-md w-full relative">
            <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">You're In!</h3>
                <p className="text-muted-foreground">We'll reach out within 24 hours to schedule your free strategy call.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">Book Your Free Call</h3>
                <p className="text-sm text-muted-foreground mb-6">Fill this out. We'll schedule your 30-minute strategy session.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" required className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="email" placeholder="Your Email" required className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <select required className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Business Type</option>
                    <option>Coaching / Consulting</option>
                    <option>E-commerce / Products</option>
                    <option>Service Business</option>
                    <option>Content Creator</option>
                    <option>Other</option>
                  </select>
                  <select required className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Best Time to Talk</option>
                    <option>Morning (9am - 12pm)</option>
                    <option>Afternoon (12pm - 5pm)</option>
                    <option>Evening (5pm - 8pm)</option>
                  </select>
                  <button type="submit" className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 glow-green">
                    Submit — Let's Talk
                    <ArrowRight className="inline ml-2 h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
};
