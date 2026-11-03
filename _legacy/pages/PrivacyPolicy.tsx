import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const PrivacyPolicy = () => (
  <main className="bg-background min-h-screen py-24 px-4">
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: February 14, 2026</p>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, business type, and preferred contact times when you book a strategy call or purchase a virtual business card. We also collect usage data including pages visited, browser type, and device information automatically.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your information to deliver our services, process transactions, communicate with you, improve our offerings, and send relevant marketing communications. We never sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Data Protection</h2>
            <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information. Payment processing is handled through trusted third-party providers (Stripe) with PCI-DSS compliance.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze site traffic, and understand usage patterns. You can control cookie preferences through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Third-Party Services</h2>
            <p>We may share data with service providers who assist in operating our website, processing payments, and delivering services. These partners are contractually obligated to protect your data.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us at any time to exercise these rights or to opt out of marketing communications.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Contact</h2>
            <p>For privacy-related inquiries, reach out to us through our website contact form or visit <a href="https://stackmode.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stackmode.net</a>.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </main>
);

export default PrivacyPolicy;
