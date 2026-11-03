import { TopBar } from "@/components/TopBar";
import { FooterSection } from "@/components/FooterSection";
import { motion } from "framer-motion";
import { Bot, Zap, Globe, ArrowRight } from "lucide-react";

const vaultItems = [
  { title: "AI Workflow Packs", desc: "Automate content, outreach, and ops with battle-tested AI prompts.", icon: Bot },
  { title: "Scanner Configs", desc: "Pre-built stock & crypto scanners for day traders and swing traders.", icon: Zap },
  { title: "Website Templates", desc: "Launch-ready site templates designed for personal brands and CEOs.", icon: Globe },
];

const PromptShop = () => (
  <main className="bg-background min-h-screen">
    <TopBar />

    {/* Hero */}
    <section className="pt-28 pb-16 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Coming Soon</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              The Prompt Vault by Stackmodechris
            </h1>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              Your digital vault of battle-tested AI workflows, stock scanner configurations, and website templates — built by Stackmodechris.
            </p>
            <a
              href="https://discord.gg/5zYWSWGMYm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm glow-blue"
            >
              Join the Waitlist on Discord
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-border/20 aspect-video"
          >
            <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
              <source src="/videos/prompt-shop-showcase.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Vault items */}
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vaultItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="glass-strong rounded-2xl p-6 border border-border/20 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <FooterSection />
  </main>
);

export default PromptShop;
