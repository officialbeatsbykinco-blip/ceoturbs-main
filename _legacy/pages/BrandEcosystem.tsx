import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Globe, Layers, Bot, BarChart3, Users } from "lucide-react";

const BrandEcosystem = () => {
  useEffect(() => {
    document.title = "The CEO Brand Ecosystem — Build a Business That Runs Without You | CEO Turbo";
    let meta = document.querySelector('meta[name="description"]');
    const content = "The CEO Brand Ecosystem by Christopher Robinson (StackmodeChris). Learn how to build a business that runs without you using systems and automation, AI-powered business tools, and brand scaling strategy. CEO Turbo — the #1 brand scaling service.";
    if (meta) meta.setAttribute("content", content);
    else { meta = document.createElement("meta"); meta.setAttribute("name", "description"); meta.setAttribute("content", content); document.head.appendChild(meta); }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://ceoturbo.com/brand-ecosystem");
    else { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); canonical.setAttribute("href", "https://ceoturbo.com/brand-ecosystem"); document.head.appendChild(canonical); }

    return () => {
      document.title = "CEO Turbo | NFC Digital Business Cards, Brand Scaling & Revenue Growth | StackmodeChris";
      if (canonical) canonical.setAttribute("href", "https://ceoturbo.com");
    };
  }, []);

  const openCalendly = () => window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  const pillars = [
    { icon: Globe, title: "Website & Digital Presence", desc: "Your website is your 24/7 sales machine. CEO Turbo designs websites for CEOs that convert visitors into paying clients through conversion optimization and clean sales funnels." },
    { icon: CreditCard, title: "NFC Digital Business Card", desc: "Your one tap business card is the front door to your brand ecosystem. Share everything — services, portfolio, socials — with a single tap of your premium NFC card." },
    { icon: Layers, title: "Content Monetization", desc: "Turn your thought leadership into multiple income streams. Build in public, create premium offers, and leverage the creator economy for passive income and financial freedom." },
    { icon: Bot, title: "AI-Powered Business Systems", desc: "Future proof your brand with AI-powered automation. Systems and automation that handle lead generation, client acquisition, and revenue optimization while you focus on growth." },
    { icon: BarChart3, title: "Revenue Optimization", desc: "From cash flow management to asset building — the scaling strategy that turns a solopreneur into a seven figure CEO." },
    { icon: Users, title: "Authority Branding", desc: "Executive presence, thought leadership, and niche domination. Your brand ecosystem positions you as the go-to expert in your market." },
  ];

  return (
    <main className="bg-background min-h-screen">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6">
            The CEO Brand Ecosystem — How to Build a Business That Runs Without You
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            A brand ecosystem is more than a website. It's the complete system that generates leads, converts clients, and scales your revenue — automatically. Christopher Robinson (StackmodeChris) built this framework at CEO Turbo to help entrepreneurs achieve the CEO lifestyle: wealth building, financial freedom, and multiple income streams.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {pillars.map((p) => (
              <div key={p.title} className="glass rounded-xl p-5">
                <p.icon className="h-6 w-6 text-primary mb-3" />
                <h2 className="font-bold text-foreground mb-1">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={openCalendly} className="px-8 py-4 rounded-xl bg-primary text-black font-bold text-sm transition-all hover:opacity-90 flex items-center gap-2">
              Book a Brand Strategy Call <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/nfc-business-card" className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm transition-all hover:opacity-90 glow-gold flex items-center gap-2 justify-center">
              <CreditCard className="h-4 w-4" /> Get Your NFC Card
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandEcosystem;
