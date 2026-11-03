import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/blocks/Basics";
import { Link } from "react-router-dom";
import { SITE, REVIEW_CARD, SHIRT } from "@/config/site";
import { PRICING_TERMS } from "@/content/pricing";

function LegalShell({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <section className="pb-16 pt-28 sm:pt-32">
      <div className="container-x max-w-[760px]">
        <Breadcrumbs items={[{ name: title, path }]} />
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>
        <div className="mt-10 space-y-8 leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground">{children}</div>
      </div>
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalShell title="Privacy Policy" path="/privacy-policy" updated="October 10, 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          {SITE.name} ({SITE.url}) is operated from {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}, USA. This policy explains what personal information we collect and how we use it.
        </p>
      </section>
      <section>
        <h2>What we collect</h2>
        <p>
          <strong className="text-foreground">Free audit:</strong> when you run the free visibility audit, we collect your name, email, phone number, business or artist name, city, website and your answers, and we store the results of the audit. <strong className="text-foreground">Ordering review cards:</strong> when you order, we (or our checkout provider) collect your name, email, phone, shipping address and business name; payment details go directly to the payment processor and we never see your full card number. <strong className="text-foreground">Booking a call:</strong> our scheduling provider Cal.com collects your name, email, the time you choose and any notes you add. <strong className="text-foreground">Browsing:</strong> our host and any analytics we enable may log standard technical data such as IP address, browser, device and pages visited.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>To send and explain your audit, follow up about it, hold your call, fulfil your order, reply to you, prevent fraud and improve the site. If you're a client, we use your information to deliver the work you've hired us for. We do not sell or rent your personal information.</p>
      </section>
      <section>
        <h2>Calls and text messages</h2>
        <p>If you give us your phone number, we may call you about your audit, order or inquiry. We only send text messages if you tick the box agreeing to them. Message and data rates may apply; message frequency varies. Reply STOP to opt out or HELP for help. Agreeing to texts is never a condition of buying anything. We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes. CEO Turbo does not share your phone number or text-message consent with anyone for their marketing.</p>
      </section>
      <section>
        <h2>Who we share it with</h2>
        <p>Service providers that run parts of our business — scheduling (Cal.com), payments and checkout (Stripe), website hosting (Vercel), the spreadsheet or CRM tool where we keep leads, card fulfilment partners (only your shipping details), and advertising or analytics platforms if enabled — only as needed to provide their service. We may disclose information if required by law.</p>
      </section>
      <section>
        <h2>Public data used by the audit</h2>
        <p>To build your report, the audit loads the public website you enter and looks up the business or artist name in public sources (Wikidata, Wikipedia, MusicBrainz, OpenStreetMap and, when available, Google PageSpeed Insights). We only send those services the name, city or website you entered — never your contact details.</p>
      </section>
      <section>
        <h2>Cookies and embedded content</h2>
        <p>The booking calendar is embedded from Cal.com and may set its own cookies when you open it. We use analytics and advertising tags to measure visits and ad performance: Google Analytics and Google Ads, Meta Pixel, Microsoft Advertising (UET) and TikTok. They may set cookies and send events such as page views, button clicks, phone taps and form submissions to those platforms. We also use Microsoft Clarity, which records how visitors move around the site (clicks, scrolling and page visits) to improve it. Clarity masks form fields, so names, emails and phone numbers you type are not recorded. You can block or delete cookies in your browser settings, or use a browser ad-blocker to stop these tags.</p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p>We keep booking and client records for as long as needed to provide services and meet legal, tax and accounting obligations, then delete or anonymize them.</p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to access, correct or delete your personal information, or opt out of marketing emails at any time using the unsubscribe link. California residents have rights under the CCPA/CPRA, including the right to know, delete, correct and opt out of the sale or sharing of personal information; we do not sell personal information. If you are in the EU or UK, you also have rights under the GDPR, including objection, restriction and portability, and you may complain to your local data protection authority.
        </p>
      </section>
      <section>
        <h2>Children</h2>
        <p>Our services are not directed to children under 13, and we don't knowingly collect their information.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          To make a privacy request, write to us at the address above or message us through a Brand Boost booking. We'll respond within 30 days.
        </p>
      </section>
    </LegalShell>
  );
}

export function Terms() {
  return (
    <LegalShell title="Terms & Conditions" path="/terms" updated="October 10, 2026">
      <section>
        <h2>1. Services</h2>
        <p>{SITE.name} provides website design, advertising setup and management, SEO, AEO and GEO, Google Business Profile and social profile optimization, email campaign design, NFC Google review cards, a free online visibility audit and related digital marketing services. By using this site or our services, you agree to these terms.</p>
      </section>
      <section>
        <h2>2. Google review cards</h2>
        <p>
          Review cards ship unprogrammed; you write your own Google review link to the card using our free setup guide. Shipping and returns are covered in our <Link to="/shipping-returns" className="text-foreground underline underline-offset-4">Shipping &amp; Returns policy</Link>. The cards link to your Google review page; Google controls whether reviews are published, and you're responsible for asking for reviews in line with Google's review policies (no incentives, no review gating, no fake reviews). Google is a trademark of Google LLC; {SITE.name} is not affiliated with or endorsed by Google.
        </p>
      </section>
      <section>
        <h2>2a. Free audit</h2>
        <p>The free audit is an automated snapshot of public information and your answers. It's provided as-is for information, may contain errors, and isn't a guarantee of rankings or results.</p>
      </section>
      <section>
        <h2>3. Payments</h2>
        <p>Prices are in USD. Payments are processed by third-party providers such as Stripe. Service packages require payment upfront or as set out in your written quote or service agreement. Advertising spend is billed by the ad platforms directly to your own ad account.</p>
      </section>
      <section>
        <h2>4. Results and our leads-or-free guarantee</h2>
        <p>Search rankings, AI-assistant recommendations, ad performance and lead volume depend on factors outside our control, including platform algorithms and competition. We do not guarantee specific rankings, citations, lead counts or sales. Results shown on this site are real past results and are not a promise of future results.</p>
        <p>{PRICING_TERMS.guarantee}</p>
      </section>
      <section>
        <h2>5. Intellectual property</h2>
        <p>Designs, branding and content created by {SITE.name} remain our property until paid in full. On full payment, you receive the rights to use the deliverables for your business as set out in your agreement.</p>
      </section>
      <section>
        <h2>6. Your responsibilities</h2>
        <p>You're responsible for providing accurate information, timely feedback and the assets needed to complete the work, and for having the rights to any content you give us. Delays on your side may move delivery dates.</p>
      </section>
      <section>
        <h2>7. Limitation of liability</h2>
        <p>{SITE.name} is not liable for indirect, incidental or consequential damages arising from use of our services. Our total liability is limited to the amount you paid for the specific service in question.</p>
      </section>
      <section>
        <h2>8. Changes</h2>
        <p>We may update these terms. The date at the top shows the latest version. Continued use of our services means you accept the updated terms.</p>
      </section>
      <section>
        <h2>9. Governing law</h2>
        <p>These terms are governed by the laws of the State of Georgia, USA.</p>
      </section>
      <section>
        <h2>10. SMS Terms</h2>
        <p>CEO Turbo sends text messages only to people who opt in by ticking an unchecked consent box on our forms. Program: follow-up about your free audit, a review-card order, or a booked call, plus call reminders you asked for. Message frequency varies. Message and data rates may apply. Reply STOP to cancel at any time; you will receive one confirmation message and no more texts after that. Reply HELP for help or email {SITE.email}. Consent is not a condition of buying anything. Carriers are not liable for delayed or undelivered messages. Your mobile information is never sold or shared with third parties for their marketing. See our <Link to="/privacy-policy" className="text-foreground underline underline-offset-4">Privacy Policy</Link> for details.</p>
      </section>
    </LegalShell>
  );
}

export function ShippingReturns() {
  const s = REVIEW_CARD.shipping;
  return (
    <LegalShell title="Shipping & Returns" path="/shipping-returns" updated="October 14, 2026">
      <section>
        <h2>Shipping</h2>
        <p>
          We ship Google review cards to addresses in the United States. {s.processing}, and orders {s.delivery.toLowerCase()}. {s.free ? "Shipping is free." : ""} You'll get tracking by email once your order ships when tracking is available. If your order hasn't arrived within {s.maxDays + 5} business days of ordering, contact us and we'll track it down, reship it or refund you.
        </p>
      </section>
      <section>
        <h2>Returns</h2>
        <p>
          We accept returns of both defective and non-defective cards in the United States. Return a new, unused card within {REVIEW_CARD.returnDays} days of delivery for a refund of the item price. There is no restocking fee.
        </p>
        <ul>
          <li><strong>Condition:</strong> new and unused only.</li>
          <li><strong>Window:</strong> {REVIEW_CARD.returnDays} days from delivery.</li>
          <li><strong>How to return:</strong> by mail. Contact us first for the return address.</li>
          <li><strong>Return shipping:</strong> you buy and pay for the return label.</li>
          <li><strong>Exchanges:</strong> not accepted. If you want a different pack, return your order and place a new one.</li>
          <li><strong>Refunds:</strong> issued to your original payment method, within 30 days of us receiving the return.</li>
        </ul>
      </section>
      <section>
        <h2>Custom company t-shirts</h2>
        <p>
          Custom shirts and artist merch are made to order with your logo or art: {SHIRT.shipping.production.toLowerCase()} by our US print partner, then {SHIRT.shipping.delivery.toLowerCase()}, with free US shipping. {SHIRT.guarantee} Because each shirt is made for you, we can't accept returns or exchanges for a size you chose, a change of mind or a logo or art file you supplied — check the size chart and the live preview before ordering.
        </p>
      </section>
      <section>
        <h2>Cards that don't work</h2>
        <p>If a card won't program or tap, contact us within {REVIEW_CARD.returnDays} days of delivery. Our free setup help is a call or text away — and if it still doesn't work, return it for a refund as above.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Call or text us at <a href={SITE.phone.href} data-call-location="shipping page">{SITE.phone.display}</a>, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, book a quick call from any page, or write to us at {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}. Include your name and order details.
        </p>
      </section>
    </LegalShell>
  );
}
