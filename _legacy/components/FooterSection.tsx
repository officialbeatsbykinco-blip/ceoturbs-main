import { Link } from "react-router-dom";
import ceoTurboLogo from "@/assets/ceo-turbo-logo.png";

export const FooterSection = () => {
  const openCalendly = () =>
  window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");

  const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={ceoTurboLogo} alt="CEO Turbo NFC business card brand scaling Christopher Robinson StackmodeChris" className="h-8 w-auto" loading="lazy" />
            </div>
            <p className="text-sm text-muted-foreground">NFC Digital Business Cards & Brand Scaling</p>
            <p className="text-xs text-muted-foreground mt-1">by Christopher Robinson (StackmodeChris)</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Links</h4>
            <div className="space-y-2">
              <button onClick={openCalendly} className="block text-sm text-muted-foreground hover:text-primary transition-colors">Book a Brand Strategy Call</button>
              <button onClick={() => scrollTo("choose-path")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">NFC Digital Business Cards</button>
              <Link to="/nfc-business-card" className="block text-sm text-muted-foreground hover:text-primary transition-colors">What Is an NFC Business Card?</Link>
              <Link to="/scale-personal-brand" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Scale Your Personal Brand</Link>
              <Link to="/brand-ecosystem" className="block text-sm text-muted-foreground hover:text-primary transition-colors">CEO Brand Ecosystem</Link>
              <Link to="/brand-strategy-call" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Done For You Services</Link>
              <Link to="/get-more-clients" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Get More Clients in 2026</Link>
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://stackmode.net">Stackmode Academy</a>
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://www.youtube.com/@ChristopherRobinson-CEO">CEO School (YouTube)</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Social</h4>
            <div className="space-y-2">
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://www.instagram.com/christopherrobinsonceo/">Instagram</a>
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://tiktok.com/@stackmodechris___">TikTok</a>
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://www.youtube.com/@ChristopherRobinson-CEO">YouTube</a>
              <a target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors" href="https://x.com/ChristopherRCEO">X (Twitter)</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <p className="text-xs text-muted-foreground text-center mb-2">
            8735 DUNWOODY PLACE # 12143 ATLANTA, GA 30350
          </p>
          <p className="text-xs text-muted-foreground text-center mb-4">
            CEO Turbo | Founded by Christopher Robinson, CEO & Founding Member of Stackmode Academy | StackmodeChris | NFC Digital Business Cards | Website Design | ceoturbo.com
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CEO Turbo | Christopher Robinson | StackmodeChris</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};