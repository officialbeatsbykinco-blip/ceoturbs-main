// Security headers shared by vercel.json (production) and `vite preview` (local testing).
// If you add a new third-party script, iframe or API, allow its origin here.
export const CSP = [
  "default-src 'self'",
  // Tag Manager + GA4 + Google Ads, Meta Pixel, Microsoft UET + Clarity, TikTok + Reddit pixels
  "script-src 'self' https://www.clarity.ms https://*.clarity.ms https://app.cal.com https://cal.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://connect.facebook.net https://bat.bing.com https://bat.bing.net https://analytics.tiktok.com https://www.redditstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https: https://www.clarity.ms",
  "media-src 'self'",
  "frame-src https://app.cal.com https://cal.com https://*.cal.com https://www.facebook.com https://www.googletagmanager.com https://td.doubleclick.net https://bid.g.doubleclick.net",
  // + Meta Conversions API Gateway (the pixel's "openbridge" endpoints from Events Manager — if Meta Events
  //   Manager ever shows a new gateway URL, add it here) + Shopify Storefront API (headless checkout)
  "connect-src 'self' https://api6.ipify.org https://api64.ipify.org https://www.clarity.ms https://c.clarity.ms https://*.clarity.ms https://app.cal.com https://cal.com https://*.cal.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://*.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://www.facebook.com https://connect.facebook.net https://bat.bing.com https://bat.bing.net https://analytics.tiktok.com https://*.tiktok.com https://*.reddit.com https://www.redditstatic.com https://*.tiktokw.us https://mpc2-prod-28-is5qnl632q-ue.a.run.app https://5z-2b6b7616f94640c2840d1841e1ac24c3.ecs.us-east-1.on.aws https://uweee2-sc.myshopify.com",
  "form-action 'self' https://cal.com https://app.cal.com https://www.facebook.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};
