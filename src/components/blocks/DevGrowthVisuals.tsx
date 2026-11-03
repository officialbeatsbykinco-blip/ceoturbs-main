import { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Code2,
  Cpu,
  Layers,
  Zap,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  Activity,
  GitBranch,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  ExternalLink,
  Sliders,
  DollarSign,
  Search,
  Megaphone,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEV_CALCULATOR_PRESETS, DEV_STACK_COMPARISON } from "@/content/app-marketing";
import { BookButton } from "@/components/cta/Actions";

type TerminalTab = "deploy" | "telemetry" | "config";

export function DevPipelineTerminal() {
  const [activeTab, setActiveTab] = useState<TerminalTab>("deploy");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(6);

  const logs = [
    { text: "dev@workstation ~ % npx ceoturbo launch --target=\"reddit,meta,search,aso\"", type: "command" },
    { text: "[0.12s] ⚡ Edge Landing Page: compiled (Lighthouse: 99/100 · FCP: 0.32s · TTFB: 18ms)", type: "success" },
    { text: "[0.28s] 🛡️ Telemetry Runtime: Meta CAPI + Reddit Pixel + PostHog wired (adblock-resistant)", type: "info" },
    { text: "[0.52s] 🎯 Routing dev-targeted ad pipelines: r/webdev, r/programming, r/SideProject, r/sysadmin", type: "info" },
    { text: "[0.74s] 🔍 ASO & LLM Knowledge Graph: Indexed for ChatGPT, Perplexity & App Store", type: "info" },
    { text: "[0.98s] 🚀 Pipeline live: 2,400 visits ingested → 86 paid activations → CAC: $4.18 (Payback: 18d)", type: "highlight" },
    { text: "[1.10s] ✓ Growth pipeline active. Status: PROFITABLE (ROAS: 4.2x).", type: "success" },
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setVisibleLines(1);
    let count = 1;
    const interval = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= logs.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 380);
  };

  const handleCopy = () => {
    let content = "";
    if (activeTab === "deploy") {
      content = "npx ceoturbo launch --target=\"reddit,meta,search,aso\"";
    } else if (activeTab === "telemetry") {
      content = `import { definePipeline } from "@ceoturbo/engine";\n\nexport default definePipeline({\n  appId: "your-product",\n  telemetry: {\n    serverSideCapi: true,\n    attribution: "first_touch_to_stripe_webhook",\n  },\n});`;
    } else {
      content = JSON.stringify({ status: "healthy", conversionRate: "3.4%", cac: "$4.18" }, null, 2);
    }
    void navigator.clipboard?.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-[#0B0F17] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
      {/* Terminal Titlebar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border/80 bg-[#0d131f] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] opacity-80" />
          </div>
          <span className="ml-3 font-mono text-xs font-medium text-muted-foreground">ceoturbo-runtime — zsh — 80×24</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("deploy")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-colors",
              activeTab === "deploy" ? "bg-turbo/20 text-turbo font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Terminal className="h-3.5 w-3.5" /> deploy.sh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-colors",
              activeTab === "telemetry" ? "bg-turbo/20 text-turbo font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5" /> telemetry.ts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("config")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-colors",
              activeTab === "config" ? "bg-turbo/20 text-turbo font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> metrics.json
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeTab === "deploy" && (
            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-1 rounded-md border border-border bg-white/5 px-2.5 py-1 text-xs font-mono text-muted-foreground transition hover:bg-white/10 hover:text-foreground disabled:opacity-50"
              title="Re-run terminal deployment simulation"
            >
              <RotateCcw className={cn("h-3 w-3", isRunning && "animate-spin text-turbo")} />
              {isRunning ? "Running..." : "Re-run"}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md border border-border bg-white/5 px-2.5 py-1 text-xs font-mono text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            title="Copy snippet"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="min-h-[290px] p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {activeTab === "deploy" && (
          <div className="space-y-2.5">
            {logs.slice(0, visibleLines).map((log, i) => (
              <div key={i} className="flex items-start gap-2 animate-in fade-in duration-200">
                {log.type === "command" ? (
                  <span className="text-turbo font-bold">{log.text}</span>
                ) : log.type === "success" ? (
                  <span className="text-emerald-400">{log.text}</span>
                ) : log.type === "highlight" ? (
                  <span className="rounded bg-turbo/10 px-1 text-cyan-300 font-semibold">{log.text}</span>
                ) : (
                  <span className="text-zinc-300">{log.text}</span>
                )}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="h-2 w-2 animate-ping rounded-full bg-turbo" />
                <span>Executing growth runtime step...</span>
              </div>
            )}
            {!isRunning && visibleLines >= logs.length && (
              <div className="pt-2 text-xs text-muted-foreground">
                <span className="text-zinc-500">Telemetry feed listening on 0.0.0.0:8080 · Ready for incoming ad clicks</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "telemetry" && (
          <div className="text-zinc-300">
            <p className="text-zinc-500">// Type-safe server-side conversion & attribution runtime</p>
            <p className="mt-1">
              <span className="text-purple-400">import</span> &#123; <span className="text-yellow-300">definePipeline</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">"@ceoturbo/engine"</span>;
            </p>
            <p className="mt-3">
              <span className="text-purple-400">export default</span> <span className="text-yellow-300">definePipeline</span>(&#123;
            </p>
            <p className="pl-4">
              <span className="text-blue-400">app</span>: <span className="text-emerald-400">"YourProduct"</span>,
            </p>
            <p className="pl-4">
              <span className="text-blue-400">conversionEdge</span>: &#123;
            </p>
            <p className="pl-8">
              <span className="text-blue-300">lighthouseTarget</span>: <span className="text-orange-400">99</span>, <span className="text-zinc-500">// Sub-second TTFB, 0 layout shifts</span>
            </p>
            <p className="pl-8">
              <span className="text-blue-300">valueHook</span>: <span className="text-emerald-400">"Translates technical specs into buyer outcomes"</span>,
            </p>
            <p className="pl-4">&#125;,</p>
            <p className="pl-4">
              <span className="text-blue-400">telemetry</span>: &#123;
            </p>
            <p className="pl-8">
              <span className="text-blue-300">serverSideCapi</span>: <span className="text-orange-400">true</span>, <span className="text-zinc-500">// 100% ad-blocker resistant</span>
            </p>
            <p className="pl-8">
              <span className="text-blue-300">attributionModel</span>: <span className="text-emerald-400">"first_touch_to_stripe_webhook"</span>,
            </p>
            <p className="pl-8">
              <span className="text-blue-300">posthogEvents</span>: [<span className="text-emerald-400">"view"</span>, <span className="text-emerald-400">"install"</span>, <span className="text-emerald-400">"trial_start"</span>, <span className="text-emerald-400">"mrr_activated"</span>],
            </p>
            <p className="pl-4">&#125;,</p>
            <p className="pl-4">
              <span className="text-blue-400">distribution</span>: &#123;
            </p>
            <p className="pl-8">
              <span className="text-blue-300">subreddits</span>: [<span className="text-emerald-400">"r/webdev"</span>, <span className="text-emerald-400">"r/programming"</span>, <span className="text-emerald-400">"r/SideProject"</span>],
            </p>
            <p className="pl-4">&#125;,</p>
            <p>&#125;);</p>
          </div>
        )}

        {activeTab === "config" && (
          <div className="text-zinc-300">
            <p className="text-zinc-500">// Real-time funnel diagnostics & unit economics telemetry</p>
            <pre className="mt-2 text-xs leading-relaxed text-emerald-400 sm:text-sm">
{`{
  "status": "200_OK",
  "edge_performance": {
    "lighthouse_score": 99,
    "fcp_ms": 320,
    "bounce_rate_reduction": "-48.5%"
  },
  "attribution": {
    "server_side_events": "active",
    "adblock_bypass_rate": "100%",
    "signal_loss": "0.0%"
  },
  "unit_economics": {
    "conversion_rate_lift": "+325%",
    "blended_cac": "$4.18",
    "payback_period_days": 18,
    "roas": "4.2x"
  }
}`}
            </pre>
          </div>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-border/70 bg-[#090D14] px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Edge Online
          </span>
          <span>Zero third-party bloat</span>
        </div>
        <div className="font-mono text-[11px] text-zinc-500">git:(main) ✓ clean</div>
      </div>
    </div>
  );
}

export function DevStackArchitecture() {
  const { devStack, growthStack } = DEV_STACK_COMPARISON;

  return (
    <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#0B101A] to-[#070B12] p-6 sm:p-8">
      <div className="text-center">
        <p className="chip mx-auto">System Architecture</p>
        <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          Your Dev Stack <span className="text-turbo font-mono">&lt;—&gt;</span> Our Growth Pipeline
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          You don't need to rebuild your software or learn marketing jargon. We plug an engineered distribution pipeline directly into your existing product.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        {/* Left: Dev Stack */}
        <div className="panel p-5 ring-1 ring-white/10 sm:p-6">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Layer 01</span>
              <h4 className="font-display text-lg font-bold text-foreground">{devStack.title}</h4>
            </div>
            <Cpu className="h-5 w-5 text-turbo" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{devStack.subtitle}</p>

          <ul className="mt-4 space-y-2.5">
            {devStack.items.map((item) => (
              <li key={item.label} className="rounded-lg bg-black/40 p-2.5 font-mono text-xs">
                <span className="block text-[11px] text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-zinc-200">{item.val}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Connector */}
        <div className="flex flex-col items-center justify-center gap-2 py-4 text-center md:py-0">
          <div className="hidden h-12 w-px bg-gradient-to-b from-turbo/20 via-turbo to-turbo/20 md:block" />
          <div className="grid h-10 w-10 place-items-center rounded-full bg-turbo/15 text-turbo ring-1 ring-turbo/40 shadow-[0_0_20px_hsl(var(--turbo)/0.4)]">
            <GitBranch className="h-5 w-5" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-turbo">Webhooks & CAPI</span>
          <div className="hidden h-12 w-px bg-gradient-to-b from-turbo/20 via-turbo to-turbo/20 md:block" />
        </div>

        {/* Right: Growth Stack */}
        <div className="panel p-5 ring-1 ring-turbo/40 sm:p-6 shadow-[0_0_30px_-10px_hsl(var(--turbo)/0.2)]">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-turbo font-semibold">Layer 02</span>
              <h4 className="font-display text-lg font-bold text-turbo-grad">{growthStack.title}</h4>
            </div>
            <Zap className="h-5 w-5 text-turbo" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{growthStack.subtitle}</p>

          <ul className="mt-4 space-y-2.5">
            {growthStack.items.map((item) => (
              <li key={item.label} className="rounded-lg bg-turbo/5 p-2.5 font-mono text-xs ring-1 ring-turbo/20">
                <span className="block text-[11px] text-turbo/80 font-medium">{item.label}</span>
                <span className="font-semibold text-zinc-100">{item.val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-mono">
          <Check className="h-4 w-4 text-turbo" /> Zero codebase intrusion
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <Check className="h-4 w-4 text-turbo" /> 100% IP & ad account ownership
        </span>
        <span className="flex items-center gap-1.5 font-mono">
          <Check className="h-4 w-4 text-turbo" /> Sub-500ms Edge deployment
        </span>
      </div>
    </div>
  );
}

export function DevFunnelCalculator() {
  const [selectedPreset, setSelectedPreset] = useState<string>("saas");
  const preset = DEV_CALCULATOR_PRESETS.find((p) => p.id === selectedPreset) ?? DEV_CALCULATOR_PRESETS[0];

  const [visitors, setVisitors] = useState<number>(preset.typicalVisitors);
  const [price, setPrice] = useState<number>(preset.priceDefault);

  useEffect(() => {
    setVisitors(preset.typicalVisitors);
    setPrice(preset.priceDefault);
  }, [preset]);

  // Calculations
  const currentConversions = Math.max(1, Math.round(visitors * (preset.typicalCurrentCR / 100)));
  const currentRevenue = currentConversions * price;

  const optimizedConversions = Math.max(1, Math.round(visitors * (preset.optimizedCR / 100)));
  const optimizedRevenue = optimizedConversions * price;

  const extraCustomers = optimizedConversions - currentConversions;
  const extraRevenue = optimizedRevenue - currentRevenue;
  const multiplier = (preset.optimizedCR / preset.typicalCurrentCR).toFixed(1);

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-[#0B0F17] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="chip">Unit Economics Debugger</p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Simulate Your Funnel's Conversion Leverage
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Conversion rate is not a small tweak — it is a mathematical multiplier across every visitor and ad dollar.
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DEV_CALCULATOR_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPreset(p.id)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all",
              selectedPreset === p.id
                ? "border-turbo bg-turbo/10 text-foreground shadow-[0_0_15px_-3px_hsl(var(--turbo)/0.3)] ring-1 ring-turbo"
                : "border-border bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            )}
          >
            <span className="block font-display text-sm font-bold text-foreground">{p.name}</span>
            <span className="mt-1 block font-mono text-xs text-muted-foreground">
              ${p.priceDefault}
              {p.priceSuffix}
            </span>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="mt-6 grid gap-6 rounded-xl border border-border/70 bg-black/40 p-5 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="visitors-input" className="text-xs font-mono font-medium text-muted-foreground">Monthly Unique Visitors / Ad Clicks</label>
            <span className="font-mono text-sm font-bold text-turbo">{visitors.toLocaleString()}</span>
          </div>
          <input
            id="visitors-input"
            type="range"
            min={500}
            max={20000}
            step={250}
            value={visitors}
            onChange={(e) => setVisitors(Number(e.target.value))}
            className="mt-3 w-full accent-[#1A9FFF]"
            aria-label="Monthly Unique Visitors / Ad Clicks"
          />
          <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
            <span>500</span>
            <span>10,000</span>
            <span>20,000+</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="price-input" className="text-xs font-mono font-medium text-muted-foreground">Average Price / ARPU</label>
            <span className="font-mono text-sm font-bold text-turbo">
              ${price}
              {preset.priceSuffix}
            </span>
          </div>
          <input
            id="price-input"
            type="range"
            min={5}
            max={150}
            step={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-3 w-full accent-[#1A9FFF]"
            aria-label="Average Price / ARPU"
          />
          <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
            <span>$5</span>
            <span>$75</span>
            <span>$150</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Unoptimized Dev Baseline */}
        <div className="rounded-xl border border-border bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-muted-foreground">Default Baseline</span>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs text-rose-400">Unoptimized Funnel</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Typical dev landing page: features list, no CRO hierarchy</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
            <div>
              <dt className="text-xs text-muted-foreground">Conversion Rate</dt>
              <dd className="font-mono text-lg font-bold text-foreground">{preset.typicalCurrentCR}%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Paid Customers</dt>
              <dd className="font-mono text-lg font-bold text-foreground">{currentConversions} /mo</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Monthly Output</dt>
              <dd className="font-mono text-xl font-bold text-zinc-300">${currentRevenue.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ad CAC Efficiency</dt>
              <dd className="font-mono text-xs font-medium text-rose-400">High burn (${preset.currentCAC} CAC)</dd>
            </div>
          </dl>
        </div>

        {/* CEO Turbo Optimized */}
        <div className="rounded-xl border border-turbo/60 bg-turbo/5 p-5 shadow-[0_0_25px_-10px_hsl(var(--turbo)/0.3)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-turbo font-semibold">Engineered Funnel</span>
            <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-xs text-emerald-400">CEO Turbo Pipeline</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Edge CRO page + Reddit/Meta CAPI ad pipelines</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
            <div>
              <dt className="text-xs text-turbo">Conversion Rate</dt>
              <dd className="font-mono text-lg font-bold text-turbo">{preset.optimizedCR}%</dd>
            </div>
            <div>
              <dt className="text-xs text-turbo">Paid Customers</dt>
              <dd className="font-mono text-lg font-bold text-emerald-400">{optimizedConversions} /mo</dd>
            </div>
            <div>
              <dt className="text-xs text-turbo">Monthly Output</dt>
              <dd className="font-mono text-xl font-bold text-emerald-300">${optimizedRevenue.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-turbo">Ad CAC Efficiency</dt>
              <dd className="font-mono text-xs font-medium text-emerald-400">Targeted (${preset.optimizedCAC} CAC)</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Delta Callout */}
      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-[#090D14] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-turbo">
            <Sparkles className="h-3.5 w-3.5" /> THE LEVERAGE DELTA
          </span>
          <p className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
            +{extraCustomers} more customers <span className="text-muted-foreground font-normal">and</span> +${extraRevenue.toLocaleString()} {preset.priceSuffix}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            From the exact same traffic, without spending an extra dollar on ads. That's a <strong className="text-turbo font-mono">{multiplier}x</strong> conversion multiplier.
          </p>
        </div>

        <BookButton
          note="App marketing calculator"
          prefill={`I ran the funnel calculator (${preset.name}): getting ${visitors} visitors at $${price}. I want to optimize conversion and distribution.`}
          className="shrink-0"
        >
          Fix My Acquisition Funnel <ArrowRight className="h-4 w-4" />
        </BookButton>
      </div>
    </div>
  );
}

export function DevCollaborationProtocol() {
  const points = [
    {
      title: "Async by Default",
      icon: Terminal,
      tag: "NO_USELESS_MEETINGS",
      desc: "No recurring 45-minute sync meetings breaking your deep work flow. We provide concise Markdown briefs, Loom video walkthroughs, and direct dashboard links.",
    },
    {
      title: "100% IP & Repo Ownership",
      icon: ShieldCheck,
      tag: "ZERO_VENDOR_LOCKIN",
      desc: "All landing page code, ad accounts, analytics properties, and domain DNS are 100% registered in your name. If you ever stop, you keep everything.",
    },
    {
      title: "Code-Literate Founders",
      icon: Code2,
      tag: "WE_SPEAK_YOUR_LANGUAGE",
      desc: "Founded by Christopher Robinson. We write TypeScript, run Bash scripts, configure webhooks, and read server logs. You never have to explain tech architecture to us.",
    },
    {
      title: "Deterministic Telemetry",
      icon: Activity,
      tag: "ZERO_VANITY_METRICS",
      desc: "We don't report 'brand awareness' or 'reach impressions'. We track unit economics: cost per qualified install, trial starts, CAC, and Stripe revenue.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <p className="chip mx-auto">Collaboration Protocol</p>
        <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          Engineered for Developers. Zero Corporate Fluff.
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          How we work with software engineers, indie makers, and technical founders.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {points.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-turbo/10 text-turbo ring-1 ring-turbo/20">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[11px] text-zinc-500">{p.tag}</span>
              </div>
              <h4 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
