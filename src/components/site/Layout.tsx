import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";
import { FloatingBookButton } from "./FloatingBookButton";
import { QuizModalHost } from "@/components/quiz/QuizModalHost";
import { TextQuizHost } from "@/components/quiz/TextQuizHost";
import { TechQuizHost } from "@/components/tech/TechQuizHost";
import { ContactHost } from "@/components/cta/ContactChooser";
import { PhoneHost } from "./PhoneHost";
import { BookingModalHost } from "@/components/booking/BookingModalHost";
import { FreeCheckPopup } from "@/components/site/FreeCheckPopup";
import { startSpotlight } from "@/lib/spotlight";
import { loadCal } from "@/lib/cal";
import { startPixel, pixelPageView } from "@/lib/pixel";
import { gtmPageView } from "@/lib/gtm";
import { loadGa } from "@/lib/ga";
import { onEngaged } from "@/lib/engaged";
import { startUet } from "@/lib/uet";
import { startTiktok, tiktokPageView } from "@/lib/tiktok";
import { startReddit, redditPageView } from "@/lib/reddit";
import { startClarity } from "@/lib/clarity";

/** Tags still load for a visitor who never scrolls or taps, once this long has passed. */
const TAG_FALLBACK_MS = 8000;

/** Page titles and descriptions: a separate chunk, because prerendered pages only need them on client-side navigation. */
const updateHead = async (pathname: string) => {
  const [{ pageFor, NOT_FOUND_META }, { applyHead }] = await Promise.all([import("@/seo/pages"), import("@/seo/head")]);
  applyHead(pageFor(pathname.replace(/\/$/, "") || "/") ?? NOT_FOUND_META);
};

/** Pages that use the friendly light look: white background, dark text, orange and blue buttons (easy for every age to read). */
const SOFT = /^\/(|pricing|services(\/.*)?|google-review-cards|google-review-card-setup|results|about|contact|tampa|book|booked|computer-repair-tampa|office-setup-tampa|restaurants|salons|barbershops)\/?$/;

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const first = useRef(true);

  // Head tags are prerendered; only update them on client-side navigation.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!document.title) void updateHead(pathname); // dev server has no prerendered head
      return;
    }
    void updateHead(pathname);
    // `instant`: the page sets scroll-behavior: smooth, which would otherwise animate a slow scroll-up on every page change.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // A link to a section on another page (/office-setup-tampa#book): scroll to it once the lazy page has rendered.
    const id = window.location.hash.slice(1);
    if (id) {
      let tries = 0;
      const find = () => {
        const el = document.getElementById(decodeURIComponent(id));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else if (++tries < 20) window.setTimeout(find, 100);
      };
      window.setTimeout(find, 50);
    }
    pixelPageView();
    tiktokPageView();
    redditPageView();
    gtmPageView(pathname);
  }, [pathname]);

  // Ad tags load on the first scroll, tap or keypress (or the fallback timer), so they never slow first paint.
  // Everything sent before that waits in each tag's queue, and ad clicks still get their PageView.
  useEffect(
    () =>
      onEngaged(() => {
        loadGa();
        startPixel();
        startUet();
        startTiktok();
        startReddit();
        startClarity();
        startSpotlight();
      }, TAG_FALLBACK_MS),
    [],
  );

  // Warm up the booking embed on the first interaction, so the first "Book" tap opens fast.
  useEffect(() => onEngaged(() => void loadCal()), []);

  const soft = SOFT.test(pathname);
  return (
    <>
      {/* display: contents keeps the fixed header's layout; the light colors still inherit down. */}
      <div className={soft ? "theme-soft contents" : "contents"}>
        <Header />
      </div>
      {/* overflow-x-clip: edge-sliding animations (the review-card phone) never make phones scroll sideways; clip keeps sticky working. */}
      <main id="main" className={cn("overflow-x-clip", soft && "theme-soft")}>
        {children}
      </main>
      <div className={soft ? "theme-soft contents" : "contents"}>
        <Footer />
        <MobileActionBar />
        <FloatingBookButton />
      </div>
      <QuizModalHost />
      <TextQuizHost />
      <TechQuizHost />
      <ContactHost />
      <PhoneHost />
      <BookingModalHost />
      <FreeCheckPopup />
    </>
  );
}
