// Content for /app-marketing — the developer distribution & marketing page.
// Written for pure software developers, SaaS founders, and indie engineers.
import type { FAQ } from "@/content/services";

export type DevPain = {
  tag: string;
  title: string;
  body: string;
  codeSnippet?: string;
};

export const APP_MARKETING_PAINS: DevPain[] = [
  {
    tag: "ERR_FEATURE_FALLACY",
    title: "The Feature Fallacy Loop",
    body: "You assume user adoption is lagging because you haven't added GitHub OAuth, dark mode, or another background worker. Adding features to a product with 0 distribution doesn't create growth — it just creates a more complex codebase with 0 users. Distribution is the missing compiler flag.",
    codeSnippet: "while (mrr === 0) { git.commit('added more features'); } // exits never",
  },
  {
    tag: "ERR_README_MESSAGING",
    title: "The README.md Landing Page Trap",
    body: "Your hero section reads like internal architecture docs: 'An asynchronous, event-driven vector pipeline written in Rust with SQLite caching.' Other engineers might nod, but the person holding the credit card bounces in 4 seconds because they don't know what problem it solves for them today.",
    codeSnippet: "TypeError: Expected buyer value proposition, received tech stack specs",
  },
  {
    tag: "ERR_UNINSTRUMENTED_ADS",
    title: "The Blind Ad Spend Burn",
    body: "You boosted a Reddit post or threw $200 at Meta with a coupon. 48 hours later, your budget is gone and your active user count didn't budge. Without server-side CAPI attribution, negative audience exclusion, and a conversion-engineered mobile landing funnel, ad algorithms feed your budget to misaligned clicks and bots.",
    codeSnippet: "stderr: $240.00 spent | 3 unqualified clicks | 0 installs | exit code 1",
  },
  {
    tag: "ERR_ZERO_TELEMETRY",
    title: "Operating Without Funnel Observability",
    body: "You have Datadog, Sentry, and Grafana alerting you if a server query takes 40ms too long. Yet you have zero telemetry on your acquisition funnel. You don't know if your bottleneck is top-of-funnel traffic, landing page drop-off, onboarding friction, or pricing. We treat growth like a monitored production system.",
    codeSnippet: "UnhandledRejection: No attribution pipeline found between ad click and Stripe webhook",
  },
];

export type DevService = {
  id: string;
  title: string;
  tag: string;
  body: string;
  bullets: string[];
};

export const APP_MARKETING_SERVICES: DevService[] = [
  {
    id: "landing-page",
    title: "High-Conversion Edge Landing Page",
    tag: "Lighthouse 98+ · Sub-500ms TTFB",
    body: "A hyper-optimized landing page that translates your product's technical architecture into undeniable buyer value. Built for conversion, not just pretty pictures.",
    bullets: [
      "Sub-500ms Time to First Byte with zero layout shift",
      "Translates complex features into buyer outcomes and ROI",
      "Interactive product UI previews, micro-demos, and code samples",
      "Mobile-first responsive architecture designed for ad traffic",
    ],
  },
  {
    id: "reddit-meta-ads",
    title: "Reddit & Dev-Targeted Ad Pipelines",
    tag: "r/programming · r/webdev · Tech Lookalikes",
    body: "Precision ad campaigns on Reddit, Meta, and Google that technical people actually respect. No cringe marketing buzzwords or sleazy clickbait.",
    bullets: [
      "Targeted directly at specific subreddits (e.g. r/webdev, r/sysadmin, r/macapps)",
      "Technical, problem-solving copy that passes senior engineer sniff tests",
      "Meta lookalike pipelines built from qualified lead and customer seed lists",
      "High-intent Google search capture for category 'alternative to' queries",
    ],
  },
  {
    id: "telemetry-capi",
    title: "Full-Funnel Telemetry & Server-Side CAPI",
    tag: "Ad-Blocker Proof · Meta CAPI · PostHog · GA4",
    body: "Over 35% of developers run aggressive ad blockers and tracking shields. We implement server-side Conversion APIs so algorithms optimize on real revenue.",
    bullets: [
      "Meta Conversions API (CAPI) & Reddit Conversion API server proxies",
      "Zero signal loss from client-side ad blockers or Safari ITP",
      "PostHog / GA4 funnel instrumentation from visit to Stripe activation",
      "Clean UTM taxonomy and first-touch to checkout attribution",
    ],
  },
  {
    id: "aso-discovery",
    title: "App Store Optimization (ASO) & Deep Linking",
    tag: "App Store · Google Play · Universal Links",
    body: "For iOS, Android, and macOS apps: algorithmic keyword indexing, conversion-tested screenshot assets, and universal deep links straight to install.",
    bullets: [
      "High-contrast, benefit-led App Store & Play Store screenshot cards",
      "Algorithmic keyword optimization across title, subtitle, and keyword field",
      "Universal Links & App Links routing ad clicks directly into onboarding",
      "Ratings and review prompt velocity optimization",
    ],
  },
  {
    id: "launch-engineering",
    title: "Community Launch Playbook & Show HN",
    tag: "Hacker News · Product Hunt · Indie Hackers",
    body: "A structured launch blueprint for developer communities. How to ship without getting flagged as promo spam or roasted by skeptical engineers.",
    bullets: [
      "Show HN post framing, timing, and technical founder commentary",
      "Product Hunt day-one launch collateral, badge placement, and gallery",
      "Organic seeding across developer Discord and Telegram communities",
      "GitHub README optimization with benchmark tables and one-click deploys",
    ],
  },
  {
    id: "aeo-geo",
    title: "AI Search & Answer Engine Optimization (AEO)",
    tag: "ChatGPT · Perplexity · Claude · llms.txt",
    body: "When developers or buyers ask ChatGPT, Perplexity, or Claude: 'What is the best tool for X?', we make sure your product is recommended.",
    bullets: [
      "Structured JSON-LD schema tuned for LLM knowledge graph ingestion",
      "llms.txt file deployment providing clean markdown documentation to AI agents",
      "Search console indexing and programmatic comparison pages",
      "Citation architecture across developer blogs and authority directories",
    ],
  },
];

export const DEV_STACK_COMPARISON = {
  devStack: {
    title: "Your Core Product Engine",
    subtitle: "What you build and maintain",
    items: [
      { label: "Core Languages", val: "TypeScript, Swift, Rust, Python, Go" },
      { label: "App Framework", val: "Next.js, SwiftUI, FastAPI, Rails, Tauri" },
      { label: "Data & Storage", val: "PostgreSQL, Supabase, Redis, Prisma" },
      { label: "Cloud & Compute", val: "Vercel, AWS, Cloudflare Workers, Fly.io" },
      { label: "Billing Gateway", val: "Stripe API, Webhooks, Lemon Squeezy" },
    ],
  },
  growthStack: {
    title: "The CEO Turbo Distribution Pipeline",
    subtitle: "What we engineer and run for you",
    items: [
      { label: "Conversion Edge", val: "Sub-500ms CRO Landing Page (98+ Lighthouse)" },
      { label: "Traffic Ingestion", val: "Reddit Dev Subreddits, Meta CAPI, Search Intent" },
      { label: "Attribution Engine", val: "Server-Side CAPI, Reddit Pixel, PostHog, UTMs" },
      { label: "Storefront & ASO", val: "App Store / Google Play Keyword Indexing & Assets" },
      { label: "AI & Discovery", val: "llms.txt, ChatGPT & Perplexity AEO Graph Citations" },
    ],
  },
};

export const DEV_CALCULATOR_PRESETS = [
  {
    id: "saas",
    name: "B2B / Micro-SaaS",
    priceDefault: 29,
    priceSuffix: "/mo",
    typicalVisitors: 2500,
    typicalCurrentCR: 0.8,
    optimizedCR: 3.4,
    currentCAC: 58,
    optimizedCAC: 14,
    description: "Subscription model with recurring revenue (MRR). High leverage from conversion rate improvements.",
  },
  {
    id: "mobile",
    name: "Mobile App (iOS/Android)",
    priceDefault: 36,
    priceSuffix: "/yr",
    typicalVisitors: 4000,
    typicalCurrentCR: 1.2,
    optimizedCR: 4.8,
    currentCAC: 18,
    optimizedCAC: 4.2,
    description: "Freemium or paid upfront app. Relies heavily on ASO, screenshot CRO, and targeted Reddit/Meta ad installs.",
  },
  {
    id: "devtool",
    name: "DevTool / API Service",
    priceDefault: 19,
    priceSuffix: "/mo",
    typicalVisitors: 3000,
    typicalCurrentCR: 0.6,
    optimizedCR: 2.9,
    currentCAC: 45,
    optimizedCAC: 12,
    description: "Developer-facing utilities, CLI tools, and hosted APIs. Requires zero-fluff technical messaging.",
  },
  {
    id: "desktop",
    name: "Mac / Desktop Utility",
    priceDefault: 39,
    priceSuffix: " one-time",
    typicalVisitors: 2000,
    typicalCurrentCR: 1.0,
    optimizedCR: 3.8,
    currentCAC: 32,
    optimizedCAC: 8.5,
    description: "One-off license or lifetime pricing model. High volume conversion through sub-500ms landing pages.",
  },
];

export const APP_MARKETING_FAQS: FAQ[] = [
  {
    q: "Why can't I just build more features to get users?",
    a: "Because users can't use features they never discover. Most indie apps and developer tools fail with 10/10 code quality and 1/10 distribution. Building more features increases your codebase maintenance burden without fixing your top-of-funnel bottleneck. Distribution gives your code the audience and revenue it deserves.",
  },
  {
    q: "Developers hate ads. Won't Reddit ads backfire on my tech tool?",
    a: "Developers hate bad, dishonest, patronizing ads. When you run an ad in r/webdev or r/sysadmin that says 'We got tired of 3-hour database migrations breaking prod, so we built a 1-line CLI tool with instant rollback — here are the benchmarks', technical audiences don't hate it; they upvote it, bookmark it, and buy it. We write copy that passes the senior engineer sniff test.",
  },
  {
    q: "Do you need access to my private git repository or production database?",
    a: "No. You retain 100% control over your core codebase and customer data. We deploy your marketing landing page and tracking either on an isolated subdomain, a standalone repository, or via clean PRs that your team reviews and merges. Zero security compromises or access to your secrets.",
  },
  {
    q: "How do you handle attribution across web landing pages and App Store downloads?",
    a: "We configure deep links and smart attribution using Apple Search Ads, Meta CAPI, SKAdNetwork / Google Play Install Referrer, and UTM parameter tagging. Every campaign is instrumented so you know the exact cost per verified install and cost per trial start, not just raw link clicks.",
  },
  {
    q: "What tech stack do you use for landing pages?",
    a: "Fast, modern, clean code: React, Next.js, Vite, or lightweight static HTML/CSS with zero bloated CMS weight. Sub-500ms Time to First Byte (TTFB), 98+ Google Lighthouse scores, zero layout shifts, and full accessibility compliance. Built with the same rigor you expect in production code.",
  },
  {
    q: "I hate sales fluff and weekly 45-minute sync meetings. How do we communicate?",
    a: "We communicate async-first. You get concise Markdown project updates, Loom walkthroughs, and direct dashboard access with real CAC and install telemetry. If we hop on a call, it's 15 to 30 minutes focused purely on strategy and data. No vanity presentations.",
  },
  {
    q: "What actually happens on the free Brand Boost call?",
    a: "A 30-minute technical audit with our founder Christopher Robinson. We review your live product, landing page, conversion bottlenecks, and current ad/ASO positioning in real time. You get a concrete, written distribution blueprint and clear unit economics. No pitch deck, no obligation.",
  },
];
