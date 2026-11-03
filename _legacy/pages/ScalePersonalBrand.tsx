import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Target, DollarSign, Layers, TrendingUp, Rocket } from "lucide-react";

const ScalePersonalBrand = () => {
  useEffect(() => {
    document.title = "How to Scale Your Personal Brand from 0 to 6 Figures in 2026 | CEO Turbo";
    let meta = document.querySelector('meta[name="description"]');
    const content = "Learn how to scale your personal brand from 0 to 6 figures in 2026. CEO Turbo by Christopher Robinson (StackmodeChris) teaches brand scaling, revenue optimization, and building a six figure brand with digital transformation.";
    if (meta) meta.setAttribute("content", content);
    else { meta = document.createElement("meta"); meta.setAttribute("name", "description"); meta.setAttribute("content", content); document.head.appendChild(meta); }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://ceoturbo.com/scale-personal-brand");
    else { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); canonical.setAttribute("href", "https://ceoturbo.com/scale-personal-brand"); document.head.appendChild(canonical); }

    return () => {
      document.title = "CEO Turbo | NFC Digital Business Cards, Brand Scaling & Revenue Growth | StackmodeChris";
      if (canonical) canonical.setAttribute("href", "https://ceoturbo.com");
    };
  }, []);

  const openCalendly = () => window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  const steps = [
    { icon: Target, title: "Define Your Niche", desc: "Niche domination starts with clarity. Pick your market, define your premium offer, and position yourself as the authority." },
    { icon: Layers, title: "Build Your Brand Ecosystem", desc: "Website, NFC digital business card, social media, content monetization — build the systems that generate leads while you sleep." },
    { icon: DollarSign, title: "Create High Ticket Offers", desc: "Stop trading time for money. Package your expertise into done for you services and premium offers that scale your revenue." },
    { icon: TrendingUp, title: "Optimize for Growth", desc: "Conversion optimization, sales funnel design, and lead generation — the scaling strategy that builds a six figure brand." },
    { icon: Rocket, title: "Scale to Six Figures", desc: "Multiple income streams, passive income, and financial freedom. This is the CEO lifestyle — and CEO Turbo builds the foundation." },
  ];

  return (
    <main className="bg-background min-h-screen">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6">
            How to Scale Your Personal Brand from 0 to 6 Figures
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            In 2026, your personal brand is your most valuable asset. Christopher Robinson (StackmodeChris) built two companies, generated $5M+ in revenue, and designed 50+ websites. Here's the exact brand scaling framework he uses at CEO Turbo to help entrepreneurs go from zero to a six figure brand.
          </p>

          <div className="space-y-6 mb-12">
            {steps.map((s, i) => (
              <div key={s.title} className="glass rounded-xl p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary font-bold mb-1">STEP {String(i + 1).padStart(2, '0')}</p>
                  <h2 className="text-lg font-bold text-foreground mb-1">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
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

export default ScalePersonalBrand;
