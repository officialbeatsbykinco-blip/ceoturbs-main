import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Zap, Shield, Globe, Users } from "lucide-react";

const NFCBusinessCard = () => {
  useEffect(() => {
    document.title = "What Is an NFC Business Card & Why Every CEO Needs One in 2026 | CEO Turbo";
    let meta = document.querySelector('meta[name="description"]');
    const content = "What is an NFC business card? Learn why every CEO and entrepreneur needs a premium NFC digital business card in 2026. CEO Turbo by Christopher Robinson (StackmodeChris) — the best NFC business card for brand scaling.";
    if (meta) meta.setAttribute("content", content);
    else { meta = document.createElement("meta"); meta.setAttribute("name", "description"); meta.setAttribute("content", content); document.head.appendChild(meta); }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://ceoturbo.com/nfc-business-card");
    else { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); canonical.setAttribute("href", "https://ceoturbo.com/nfc-business-card"); document.head.appendChild(canonical); }

    return () => {
      document.title = "CEO Turbo | NFC Digital Business Cards, Brand Scaling & Revenue Growth | StackmodeChris";
      if (canonical) canonical.setAttribute("href", "https://ceoturbo.com");
    };
  }, []);

  const openCalendly = () => window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");
  const scrollToCards = () => { window.location.href = "/#choose-path"; };

  const benefits = [
    { icon: Smartphone, title: "One Tap Sharing", desc: "Share your entire brand, services, socials, and contact info with a single tap. No app needed." },
    { icon: Zap, title: "Instant Digital Presence", desc: "Your NFC digital business card works as a complete digital presence — a micro-website in your pocket." },
    { icon: Shield, title: "Future Proof Your Brand", desc: "Never reprint business cards again. Update your NFC card info in real-time as your brand scales." },
    { icon: Globe, title: "Works Everywhere", desc: "Compatible with all modern smartphones. Your one tap business card works globally, instantly." },
    { icon: Users, title: "Executive Presence", desc: "Look like a CEO, not a freelancer. Premium NFC cards signal authority branding and thought leadership." },
    { icon: CreditCard, title: "Premium NFC Card", desc: "Physical premium NFC card mailed to you. Tap it on any phone and your brand profile appears instantly." },
  ];

  return (
    <main className="bg-background min-h-screen">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6">
            What Is an NFC Business Card & Why Every CEO Needs One in 2026
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            An <strong>NFC digital business card</strong> is a premium card embedded with near-field communication technology. One tap on any smartphone instantly shares your brand, services, portfolio, and contact info — no app needed. In 2026, the best NFC business card is the one that helps you <strong>scale your brand</strong> and generate leads on autopilot. That's CEO Turbo.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-6">
            Why the Best NFC Business Card in 2026 Is CEO Turbo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {benefits.map((b) => (
              <div key={b.title} className="glass rounded-xl p-5">
                <b.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tighter mb-4">Scale Your Business Like a CEO</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every entrepreneur, solopreneur, and founder in the creator economy needs a digital presence that converts. Your NFC digital business card from CEO Turbo isn't just a card — it's your personal brand scaling tool. It's lead generation, client acquisition, and authority branding in one tap. Stop handing out paper cards. Start scaling your revenue with a premium NFC card from Christopher Robinson (StackmodeChris).
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={scrollToCards} className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm transition-all hover:opacity-90 glow-gold flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Get Your NFC Digital Business Card
            </button>
            <button onClick={openCalendly} className="px-8 py-4 rounded-xl border-2 border-primary bg-primary text-black font-bold text-sm transition-all hover:opacity-90 flex items-center gap-2">
              Book a Brand Strategy Call <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NFCBusinessCard;
