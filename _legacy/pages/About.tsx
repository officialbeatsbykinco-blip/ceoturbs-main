import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe, Rocket, GraduationCap, TrendingUp } from "lucide-react";
import ceoTurboLogo from "@/assets/ceo-turbo-logo-full.png";
import stackmodeLogo from "@/assets/stackmode-logo.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const companies = [
  {
    name: "Stackmode Network",
    url: "https://stackmode.net",
    logo: stackmodeLogo,
    description: "Build software with AI stacks. The Stackmode Academy teaches what college won't — modern skills that actually make money: Web Design, AI, Animation, Trading & Investing.",
  },
  {
    name: "CEO Turbo",
    url: "https://ceoturbo.com",
    logo: ceoTurboLogo,
    description: "Turbo-boost your business revenue. Virtual business cards, premium websites, ad design & brand growth services that accelerate your income and free you from financial stress.",
  },
];

const milestones = [
  { icon: GraduationCap, label: "4 Years in Tech & Finance" },
  { icon: Globe, label: "50+ Websites Built" },
  { icon: TrendingUp, label: "$5M+ Revenue Generated" },
  { icon: Rocket, label: "2 Companies Founded" },
];

const About = () => {
  const companiesRef = useRef<HTMLDivElement>(null);
  const companiesInView = useInView(companiesRef, { once: true, amount: 0.3 });

  useEffect(() => {
    document.title = "Christopher Robinson (StackmodeChris) | CEO Turbo - Founder & Brand Growth Expert";

    let metaDesc = document.querySelector('meta[name="description"]');
    const descContent = "Christopher Robinson, known as StackmodeChris, is the founder of CEO Turbo and Stackmode Network. Web design, AI, and brand growth expert. 50+ websites built, $5M+ revenue generated.";
    if (metaDesc) {
      metaDesc.setAttribute("content", descContent);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", descContent);
      document.head.appendChild(metaDesc);
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "about-person-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Christopher Robinson",
      alternateName: "StackmodeChris",
      jobTitle: "Founder & CEO",
      description: "Web design, AI, and brand growth expert. Founder of CEO Turbo and Stackmode Network.",
      url: "https://turbo-ceo-flow.lovable.app/about",
      worksFor: [
        { "@type": "Organization", name: "CEO Turbo", url: "https://ceoturbo.com" },
        { "@type": "Organization", name: "Stackmode Network", url: "https://stackmode.net" },
      ],
      sameAs: ["https://stackmode.net", "https://ceoturbo.com"],
      knowsAbout: ["Web Design", "AI", "Brand Growth", "Business Revenue"],
    });
    document.head.appendChild(script);

    return () => {
      document.title = "CEO Turbo | Virtual Business Cards, Websites & Brand Growth Agency";
      const el = document.getElementById("about-person-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-violet pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row items-center gap-8">
            <img
              src="/about/ceo-portrait.png"
              alt="Christopher Robinson, also known as StackmodeChris, founder of CEO Turbo"
              className="w-40 h-40 sm:w-56 sm:h-56 rounded-2xl object-cover object-top border border-primary/20 shadow-lg shadow-primary/10 flex-shrink-0"
            />
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-1">
                Christopher Robinson
              </h1>
              <p className="text-primary font-semibold text-lg mb-4">aka StackmodeChris</p>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                I left my Tech & Finance career to help people make more money. I built 50+ websites and helped generate over $5M in revenue. Now I teach real skills that pay: Web Design, AI, and Business Growth.
              </p>
            </div>
          </motion.div>

          {/* Milestones */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
          >
            {milestones.map((m) => (
              <div key={m.label} className="glass rounded-xl p-4 text-center">
                <m.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Companies */}
      <section ref={companiesRef} className="py-12 sm:py-20 px-4 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-radial-emerald pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.h2
            initial="hidden"
            animate={companiesInView ? "visible" : "hidden"}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tighter mb-8"
          >
            Companies I've Built
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {companies.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                animate={companiesInView ? "visible" : "hidden"}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group block"
              >
                <img src={c.logo} alt={c.name} className="h-14 w-auto mb-4 rounded-lg" />
                <h3 className="text-lg font-bold text-foreground mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                  Visit <ArrowRight className="h-3 w-3" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
