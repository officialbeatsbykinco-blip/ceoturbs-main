import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const TermsAndConditions = () => (
  <main className="bg-background min-h-screen py-24 px-4">
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: February 14, 2026</p>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Services</h2>
            <p>CEO Turbo provides virtual business cards, website design, brand growth consulting, ad design, thumbnail creation, and related digital marketing services. By using our services, you agree to these terms.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Digital Products</h2>
            <p>Virtual business cards and other digital products are delivered electronically. Due to the digital nature of these products, all sales are final unless otherwise stated. Customization requests should be submitted within 48 hours of purchase.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Payment Terms</h2>
            <p>All payments are processed securely through Stripe. Prices are listed in USD. Service packages require payment upfront or as outlined in your service agreement.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Intellectual Property</h2>
            <p>All designs, branding materials, and content created by CEO Turbo remain our intellectual property until full payment is received. Upon payment, clients receive a license to use deliverables for their business purposes.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Client Responsibilities</h2>
            <p>Clients are responsible for providing accurate information, timely feedback, and necessary assets for project completion. Delays caused by the client may affect delivery timelines.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Limitation of Liability</h2>
            <p>CEO Turbo is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Modifications</h2>
            <p>We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of any modifications.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </main>
);

export default TermsAndConditions;
