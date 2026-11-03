import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/space-grotesk/wght.css";
import "./index.css";
import { startGa } from "./lib/ga";
import { startGtm } from "./lib/gtm";
import { captureAttribution, installCallTracking } from "./lib/track";
import { flushLeadOutbox } from "./lib/lead-outbox";

// ── Chunk load error handler ──────────────────────────────────────────────────
// After a new deploy, old cached pages request chunk filenames that no longer
// exist on the server (hash changed). Auto-reload once to pick up fresh bundle.
window.addEventListener("vite:preloadError", () => {
  const reloaded = sessionStorage.getItem("chunk-reload");
  if (!reloaded) {
    sessionStorage.setItem("chunk-reload", "1");
    window.location.reload();
  }
});
// Catch dynamic import() failures the same way (older Vite / fallback)
window.addEventListener("error", (e) => {
  if (e.message?.includes("dynamically imported module") || e.message?.includes("Failed to fetch")) {
    const reloaded = sessionStorage.getItem("chunk-reload");
    if (!reloaded) {
      sessionStorage.setItem("chunk-reload", "1");
      window.location.reload();
    }
  }
});
// ─────────────────────────────────────────────────────────────────────────────

captureAttribution();
installCallTracking();
flushLeadOutbox();
startGtm();
startGa();

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages hydrate; the dev server (<!--app--> comment only) renders from scratch.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
