import { defineConfig, loadEnv, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pathToFileURL } from "url";
import type { IncomingMessage, ServerResponse } from "http";
import { componentTagger } from "lovable-tagger";
import { SECURITY_HEADERS } from "./src/config/headers";

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

/** Serves the Vercel functions in /api from `vite` and `vite preview`, so forms work locally. */
function localApi(): Plugin {
  const mount = (middlewares: Connect.Server, load: (file: string) => Promise<{ default: Handler }>) => {
    middlewares.use(async (req, res, next) => {
      const route = req.url?.match(/^\/api\/(audit|lead|cal-webhook|track|shirt-design)(?:\?|$)/)?.[1];
      if (!route) return next();
      try {
        const mod = await load(path.resolve(__dirname, `api/${route}.js`));
        await mod.default(req, res);
      } catch (e) {
        next(e);
      }
    });
  };
  return {
    name: "local-api",
    configureServer(server) {
      mount(server.middlewares, (file) => server.ssrLoadModule(file) as Promise<{ default: Handler }>);
    },
    configurePreviewServer(server) {
      mount(server.middlewares, (file) => import(pathToFileURL(file).href));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  // Make LEADS_WEBHOOK_URL etc. from .env.local available to the local API.
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["LEADS_WEBHOOK_URL", "LEADS_WEBHOOK_SECRET", "PSI_API_KEY"]) if (env[key] && !process.env[key]) process.env[key] = env[key];

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    // `vite preview` mirrors production security headers so CSP issues show up locally.
    preview: {
      port: 4173,
      headers: SECURITY_HEADERS,
    },
    plugins: [react(), localApi(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    build: {
      target: "es2020",
      cssCodeSplit: true,
      rollupOptions: isSsrBuild
        ? undefined
        : {
            output: {
              manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
            },
          },
    },
  };
});
