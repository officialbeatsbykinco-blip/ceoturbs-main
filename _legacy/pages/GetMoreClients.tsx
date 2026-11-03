import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Target, Magnet, BarChart3, Users, Zap } from "lucide-react";

const GetMoreClients = () => {
  useEffect(() => {
    document.title = "How to Get More Clients in 2026 — The CEO Turbo Method | StackmodeChris";
    let meta = document.querySelector('meta[name="description"]');
    const content = "How to get more clients in 2026 using the CEO Turbo Method by Christopher Robinson (StackmodeChris). Client acquisition, lead generation, conversion optimization, and brand scaling strategy for entrepreneurs and CEOs.";
    if (meta) meta.setAttribute("content", content);
    else { meta = document.createElement("meta"); meta.setAttribute("name", "description"); meta.setAttribute("content", content); document.head.appendChild(meta); }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://ceoturbo.com/get-more-clients");
    else { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); canonical.setAttribute("href", "https://ceoturbo.com/get-more-clients"); document.head.appendChild(canonical); }

    return () => {
      document.title = "CEO Turbo | NFC Digital Business Cards, Brand Scaling & Revenue Growth | StackmodeChris";
      if (canonical) canonical.setAttribute("href", "https://ceoturbo.com");
    };
  }, []);

  const openCalendly = () => window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  const methods = [
    { icon: Target, title: "Niche Domination", desc: "Stop competing with everyone. The CEO Turbo Method starts with owning your niche — becoming the obvious choice in your market through authority branding and thought leadership." },
    { icon: Magnet, title: "Lead Generation on Autopilot", desc: "Your website, NFC digital business card, and content work together as a 24/7 lead generation machine. Build your digital presence once, attract clients forever." },
    { icon: BarChart3, title: "Conversion Optimization", desc: "Getting traffic is step one. Converting visitors into paying clients is where the money is. CEO Turbo builds sales funnels that turn browsers into buyers." },
    { icon: Users, title: "Client Acquisition Systems", desc: "From go to market strategy to growth hacking — build the systems that bring in high ticket clients consistently without cold DMs or desperate pitching." },
    { icon: Zap, title: "Revenue Optimization", desc: "Scale what's working. Cut what's not. Leverage AI-powered business tools and systems and automation to maximize cash flow and build real assets." },
  ];

  return (
    <main className="bg-background min-h-screen">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6">
            How to Get More Clients in 2026 — The CEO Turbo Method
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Most entrepreneurs fail at client acquisition because they focus on tactics instead of systems. Christopher Robinson (StackmodeChris) developed the CEO Turbo Method after helping generate $5M+ in revenue for his clients. Here's the exact scaling strategy that works in 2026.
          </p>

          <div className="space-y-5 mb-12">
            {methods.map((m, i) => (
              <div key={m.title} className="glass rounded-xl p-6 flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary font-bold mb-1">STEP {String(i + 1).padStart(2, '0')}</p>
                  <h2 className="text-lg font-bold text-foreground mb-1">{m.title}</h2>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tighter mb-4">Ready to Scale Your Client Acquisition?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Whether you're a solopreneur just starting or a CEO ready to scale to seven figures — the CEO Turbo Method gives you the brand ecosystem, digital transformation, and growth hacking strategy you need. Book a brand strategy call or start with your NFC digital business card.
          </p>

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

export default GetMoreClients;
