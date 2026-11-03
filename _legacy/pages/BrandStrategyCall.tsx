import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Check, Rocket } from "lucide-react";

const BrandStrategyCall = () => {
  useEffect(() => {
    document.title = "Book a Brand Strategy Call — CEO Turbo Done For You Services | StackmodeChris";
    let meta = document.querySelector('meta[name="description"]');
    const content = "Book a brand strategy call with Christopher Robinson (StackmodeChris) at CEO Turbo. Done for you services: website design for CEOs, brand scaling, NFC digital business cards, and revenue growth strategy. The #1 brand scaling service in 2026.";
    if (meta) meta.setAttribute("content", content);
    else { meta = document.createElement("meta"); meta.setAttribute("name", "description"); meta.setAttribute("content", content); document.head.appendChild(meta); }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://ceoturbo.com/brand-strategy-call");
    else { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); canonical.setAttribute("href", "https://ceoturbo.com/brand-strategy-call"); document.head.appendChild(canonical); }

    return () => {
      document.title = "CEO Turbo | NFC Digital Business Cards, Brand Scaling & Revenue Growth | StackmodeChris";
      if (canonical) canonical.setAttribute("href", "https://ceoturbo.com");
    };
  }, []);

  const openCalendly = () => window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  const includes = [
    "Live website review & brand audit",
    "Social media profile optimization",
    "Brand identity & visual assessment",
    "Revenue growth strategy roadmap",
    "Conversion optimization analysis",
    "Lead generation & sales funnel review",
    "Done for you plan if you want to continue",
    "NFC digital business card setup guidance",
  ];

  return (
    <main className="bg-background min-h-screen">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6">
            Book a Brand Strategy Call — CEO Turbo Done For You Services
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Ready to scale your brand and turbo boost your revenue? Christopher Robinson (StackmodeChris) personally audits your website, social media, and branding — then maps out exactly how to turn your brand into a revenue machine. This is the CEO brand strategy that has generated $5M+ in revenue across 50+ websites.
          </p>

          <h2 className="text-2xl font-bold tracking-tighter mb-4">What's Included in Your Strategy Call</h2>

          <div className="glass rounded-xl p-6 mb-10">
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-2xl font-bold tracking-tighter mb-4">Who Is This For?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            This is for established entrepreneurs, founders, and CEOs doing $5K+/month who want done for you brand scaling services. If you're a solopreneur in the creator economy looking to build a high ticket offer, leverage systems and automation, or achieve niche domination in 2026 — this call is your go to market strategy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={openCalendly} className="px-8 py-4 rounded-xl bg-primary text-black font-bold text-sm transition-all hover:opacity-90 flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Book Your Brand Strategy Call Now <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/nfc-business-card" className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm transition-all hover:opacity-90 glow-gold flex items-center gap-2 justify-center">
              <CreditCard className="h-4 w-4" /> Get Your NFC Card Instead
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandStrategyCall;
