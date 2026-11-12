// Computers can't send a text. Every money page must show a computer visitor Book + Call and no sms: link,
// while phones keep the text quiz (their best converter). The phone-only sticky bars live in the layout
// (MobileActionBar, sm:hidden), so pages are rendered here without it.
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import Home from "@/pages/Home";
import OfficeSetup from "@/pages/OfficeSetup";
import ComputerRepair from "@/pages/ComputerRepair";
import ServicePage from "@/pages/ServicePage";
import InstallPage from "@/pages/InstallPage";
import { OFFICE_TIERS } from "@/components/blocks/OfficePrices";

const PAGES: [string, ReactElement][] = [
  ["/", <Home />],
  ["/office-setup-tampa", <OfficeSetup />],
  ["/computer-repair-tampa", <ComputerRepair />],
  ["/services/home-office-setup", <ServicePage />],
  ["/services/office-transformation", <ServicePage />],
  ["/business-tech-setup-tampa", <InstallPage path="/business-tech-setup-tampa" />],
];

function setDevice(phone: boolean) {
  window.matchMedia = ((q: string) => ({ matches: phone && q.includes("coarse"), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })) as unknown as typeof window.matchMedia;
  Object.defineProperty(navigator, "userAgent", { configurable: true, get: () => (phone ? "Mozilla/5.0 (iPhone)" : "Mozilla/5.0 (Macintosh)") });
}

function renderAt(route: string, el: ReactElement) {
  const routePath = route.startsWith("/services/") ? "/services/:slug" : route;
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={routePath} element={el} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  setDevice(false);
});

describe("desktop CTAs", () => {
  it.each(PAGES)("%s shows no text link on a computer, but Book and Call", (route, el) => {
    setDevice(false);
    const { container } = renderAt(route, el);
    expect(container.querySelectorAll('a[href^="sms:"]').length).toBe(0);
    expect(container.querySelector('a[href^="tel:"]')).not.toBeNull();
    expect(container.textContent).toMatch(/Book (a time|online|a visit|your|a free call)/i);
  });

  it("keeps the text quiz on phones", () => {
    setDevice(true);
    const { container } = renderAt("/office-setup-tampa", <OfficeSetup />);
    expect(container.textContent).toContain("Get my price by text");
  });
});

describe("office prices", () => {
  it.each(["/office-setup-tampa", "/services/home-office-setup", "/business-tech-setup-tampa"])("%s shows the same three office prices and the before/after photo", (route) => {
    const el = PAGES.find(([r]) => r === route)![1];
    const { container } = renderAt(route, el);
    for (const t of OFFICE_TIERS) expect(container.textContent).toContain(t.price);
    expect(container.querySelector('input[aria-label="Drag to compare before and after"]')).not.toBeNull();
  });
});
