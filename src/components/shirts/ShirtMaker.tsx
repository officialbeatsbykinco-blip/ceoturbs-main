import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Check, Crosshair, ImageUp, Loader2, Lock, Minus, Move, Phone, Plus, RotateCcw, ShieldCheck, Truck, X } from "lucide-react";
import { SHIRT, SITE, money2, shirtSku, shirtStyleOption, shirtTotal, shirtUnitPrice, type ShirtProduct, type ShirtSize, type ShirtStyle } from "@/config/site";
import { COMPANY_MAKER, SHIRT_PRESETS, type MakerCopy } from "@/content/company-shirts";
import { attribution, newEventId, serverTrack, track, visitorId, type Ecommerce } from "@/lib/track";
import { sendLead } from "@/lib/lead-outbox";
import { createShirtCheckout, loadVariants, type ShirtLine } from "@/lib/shopify";
import { cn, useDebounce } from "@/lib/utils";
import { ShirtMockup } from "./ShirtMockup";
import { FONTS, drawArt, hasWhiteBackground, loadFont, printPng, removeWhite, svgToJpeg, type ArtInput, type FontId, type Placement } from "./art";
import "./fonts";

const INKS = [
  { id: "auto", name: "Auto", hex: "" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "black", name: "Black", hex: "#111111" },
  { id: "red", name: "Red", hex: "#d62828" },
  { id: "gold", name: "Gold", hex: "#d4a72c" },
  { id: "blue", name: "Blue", hex: "#1e6fd9" },
];

type Sizes = Partial<Record<ShirtSize, number>>;
type Logo = { img: HTMLImageElement; clean: HTMLCanvasElement | null; name: string; white: boolean };
/** Where the buyer dragged / turned the design (shares of the print area, degrees). */
type Pos = { x: number; y: number; rotate: number };
const CENTER: Pos = { x: 0, y: 0, rotate: 0 };
const clampPos = (n: number) => Math.max(-0.5, Math.min(0.5, n));

const newDesignId = (prefix: string) => `${prefix}-${Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("")}`;

/** GA4 / Meta / TikTok ecommerce payload: one item per size. */
function ecommerceFor(p: ShirtProduct, style: ShirtStyle, back: boolean, color: string, sizes: Sizes): Ecommerce {
  const { total } = shirtTotal(style, back, sizes, p);
  const label = p.styles.find((s) => s.id === style)!.label;
  return {
    currency: p.currency,
    value: total,
    items: Object.entries(sizes)
      .filter(([, q]) => q)
      .map(([size, q]) => ({ item_id: shirtSku(style, back, p), item_name: `${p.name} – ${label}`, item_variant: `${color} / ${size}${back ? " / Front + back" : ""}`, price: shirtUnitPrice(style, size as ShirtSize, back, p), quantity: q! })),
  };
}
const serverEcommerce = (p: ShirtProduct, e: Ecommerce) => ({ value: e.value, currency: e.currency, contentName: p.name, contentIds: [...new Set(e.items.map((i) => i.item_id))], numItems: e.items.reduce((n, i) => n + i.quantity, 0) });

async function readLogo(file: File): Promise<Logo | string> {
  if (!/^image\/(png|jpe?g|svg\+xml|webp)$/.test(file.type)) return "Upload a PNG, JPG, SVG or WebP image.";
  if (file.size > 15_000_000) return "That file is over 15 MB — export a smaller PNG.";
  try {
    const img = await loadImage(file);
    const white = file.type !== "image/svg+xml" && hasWhiteBackground(img);
    return { img, clean: white ? removeWhite(img) : null, name: file.name.slice(0, 120), white };
  } catch {
    return "We couldn't open that image. Try a PNG or JPG.";
  }
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * The custom shirt designer + buy box: live mockup (drag, size, rotate, fonts), print-file export,
 * Shopify checkout. One engine for company shirts and artist merch — `product` and `copy` decide which.
 */
export function ShirtMaker({ product = SHIRT, copy = COMPANY_MAKER }: { product?: ShirtProduct; copy?: MakerCopy }) {
  const P = product;
  const artist = P.kind === "artist";
  const uid = useId();
  const [style, setStyle] = useState<ShirtStyle>("short");
  const [colorId, setColorId] = useState("black");
  const [placement, setPlacement] = useState<Exclude<Placement, "back">>("front");
  const [logo, setLogo] = useState<Logo | null>(null);
  const [useClean, setUseClean] = useState(true);
  const [logoScale, setLogoScale] = useState(0.8);
  const [text, setText] = useState("");
  const [subtext, setSubtext] = useState("");
  const [inkId, setInkId] = useState("auto");
  const [font, setFont] = useState<FontId>(copy.defaultFont);
  const [fontTick, setFontTick] = useState(0);
  const [pos, setPos] = useState<Pos>(CENTER);
  const [back, setBack] = useState(false);
  const [backText, setBackText] = useState("");
  const [backSub, setBackSub] = useState("");
  const [backLines, setBackLines] = useState("");
  const [backLogo, setBackLogo] = useState(false);
  const [backQr, setBackQr] = useState("");
  const [qrCells, setQrCells] = useState<boolean[][] | null>(null);
  const [backArtFile, setBackArtFile] = useState<Logo | null>(null);
  const [backPos, setBackPos] = useState<Pos>(CENTER);
  const [sizes, setSizes] = useState<Sizes>({ M: 1, L: 1 });
  const [side, setSide] = useState<"front" | "back">("front");
  const [frontArt, setFrontArt] = useState<string | null>(null);
  const [backArt, setBackArt] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "saving" | "checkout">("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [showBar, setShowBar] = useState(false);
  const [moreFonts, setMoreFonts] = useState(false);
  const frontSvg = useRef<SVGSVGElement>(null);
  const buyRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);
  const customized = useRef(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitEmail, setExitEmail] = useState("");
  const [exitDone, setExitDone] = useState(false);
  const history = useRef<{ side: "front" | "back"; pos: Pos }[]>([]);
  const historyIndex = useRef(-1);
  const restoring = useRef(false);

  const color = P.colors.find((c) => c.id === colorId) ?? P.colors[0];
  const ink = inkId === "auto" ? (color.dark ? "#ffffff" : "#111111") : INKS.find((i) => i.id === inkId)!.hex;
  const logoSrc = logo ? (logo.white && useClean && logo.clean ? logo.clean : logo.img) : null;
  const hasDesign = !!logo || !!text.trim() || !!subtext.trim();
  const { qty, subtotal, discount, total, tier } = shirtTotal(style, back, sizes, P);
  const dPos = useDebounce(pos, 150);
  const dBackPos = useDebounce(backPos, 150);
  const nextTier = P.tiers.find((t) => t.min > qty);
  const lowRes = logo && logo.img.naturalWidth < (placement === "chest" ? 600 : 1200);
  const backImg = backArtFile ? (backArtFile.white && useClean && backArtFile.clean ? backArtFile.clean : backArtFile.img) : backLogo ? logoSrc : null;
  const tourLines = useMemo(() => backLines.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 14), [backLines]);

  const frontInput: ArtInput = useMemo(
    () =>
      hasDesign
        ? { logo: logoSrc, text, subtext, ink, font, logoScale: placement === "chest" ? Math.max(0.5, logoScale) : logoScale, ...dPos }
        : { logo: null, text: copy.sample.text, subtext: copy.sample.sub, ink, font, logoScale, ...dPos },
    // fontTick redraws once a web font has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasDesign, logoSrc, text, subtext, ink, font, logoScale, placement, dPos, copy, fontTick],
  );
  const backInput: ArtInput = useMemo(
    () => ({ logo: backImg, text: backText || (backImg || tourLines.length || qrCells ? "" : copy.defaultBack), subtext: backSub, ink, font, logoScale: 0.75, lines: tourLines, qr: qrCells, ...dBackPos }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backImg, backText, backSub, ink, font, tourLines, qrCells, dBackPos, copy, fontTick],
  );
  const qrLink = backQr.trim();
  const hasBack = !!(backText.trim() || backSub.trim() || backImg || tourLines.length || qrLink);

  // QR code for the back print (menu, booking page, Linktree, socials…): built from the link as they type.
  useEffect(() => {
    if (!back || !qrLink) return setQrCells(null);
    let live = true;
    import("qrcode-generator").then(({ default: qrcode }) => {
      if (!live) return;
      const q = qrcode(0, "M");
      q.addData(/^[a-z][a-z0-9+.-]*:/i.test(qrLink) ? qrLink : `https://${qrLink}`);
      q.make();
      const n = q.getModuleCount();
      setQrCells(Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => q.isDark(r, c))));
    });
    return () => {
      live = false;
    };
  }, [back, qrLink]);

  // Ad / sitelink links can preselect: ?style=long&color=navy
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("style") === "long") setStyle("long");
    const c = q.get("color");
    if (c && P.colors.some((x) => x.id === c)) setColorId(c);
    const ec = ecommerceFor(P, q.get("style") === "long" ? "long" : "short", false, "Black", { L: 1 });
    serverTrack("view_item", track("view_item", { content_name: P.name }, { ecommerce: ec }), serverEcommerce(P, ec));
    const warm = () => void (P.productId && loadVariants(P.productId).catch(() => {}));
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(warm);
    else setTimeout(warm, 1200);
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy("");
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canvas text doesn't wait for web fonts: load the chosen one, then redraw.
  useEffect(() => {
    let live = true;
    loadFont(font).then(() => live && setFontTick((n) => n + 1));
    return () => {
      live = false;
    };
  }, [font]);

  // Live preview = the print file drawn small.
  useEffect(() => {
    const c = document.createElement("canvas");
    setFrontArt(placement === "chest" ? drawArt(c, frontInput, 360, 360).toDataURL() : drawArt(c, frontInput, 450, 600).toDataURL());
  }, [frontInput, placement]);
  useEffect(() => {
    if (!back) return setBackArt(null);
    setBackArt(drawArt(document.createElement("canvas"), backInput, 450, 600).toDataURL());
  }, [back, backInput]);

  // Sticky checkout bar on phones once the main button scrolls away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top > 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const markCustomized = () => {
    if (customized.current) return;
    customized.current = true;
    const ec = ecommerceFor(P, style, back, color.name, sizes);
    serverTrack("customize_product", track("customize_product", { content_name: P.name }, { ecommerce: ec }), serverEcommerce(P, ec));
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>, which: "front" | "back" = "front") => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    const r = await readLogo(file);
    if (typeof r === "string") return setError(r);
    if (which === "back") {
      setBackArtFile(r);
      setSide("back");
    } else {
      setLogo(r);
      setPos(CENTER);
    }
    setUseClean(true);
    markCustomized();
  };

  /** Drag on the mockup: moves the design on the side being shown. */
  const onMove = (dx: number, dy: number) => {
    const set = side === "back" ? setBackPos : setPos;
    set((p) => ({ ...p, x: clampPos(p.x + dx), y: clampPos(p.y + dy) }));
    markCustomized();
  };
  const curPos = side === "back" ? backPos : pos;
  const setCurPos = side === "back" ? setBackPos : setPos;
  const dCur = side === "back" ? dBackPos : dPos;

  // Position history for Cmd/Ctrl+Z (recorded from the debounced position so a slider drag is one step).
  useEffect(() => {
    if (restoring.current) {
      restoring.current = false;
      return;
    }
    const h = history.current.slice(0, historyIndex.current + 1);
    const last = h[h.length - 1];
    if (last && last.side === side && last.pos.x === dCur.x && last.pos.y === dCur.y && last.pos.rotate === dCur.rotate) return;
    h.push({ side, pos: dCur });
    history.current = h.slice(-50);
    historyIndex.current = history.current.length - 1;
  }, [dCur, side]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      const typing = (e.target as HTMLElement | null)?.closest?.("input[type=text],input:not([type]),textarea");
      if (mod && k === "z" && !typing) {
        e.preventDefault();
        const i = historyIndex.current + (e.shiftKey ? 1 : -1);
        const entry = history.current[i];
        if (!entry) return;
        historyIndex.current = i;
        restoring.current = true;
        (entry.side === "back" ? setBackPos : setPos)(entry.pos);
      } else if (mod && k === "s") {
        e.preventDefault();
        buyRef.current?.click();
      } else if (e.key === "Escape") {
        setShowExitModal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Exit intent (desktop): cursor leaves through the top of the page before they've touched the design.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("exitIntentShown")) return;
    } catch {
      return;
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY < 50 && !customized.current) {
        setShowExitModal(true);
        try {
          sessionStorage.setItem("exitIntentShown", "true");
        } catch {
          /* storage blocked: the modal may show again, harmless */
        }
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, []);

  const submitExitEmail = async () => {
    const email = exitEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    try {
      localStorage.setItem("shirt_exit_email", email);
    } catch {
      /* private mode: the lead still goes to the server */
    }
    setExitDone(true);
    const eventId = newEventId("lead");
    const user = { email, name: "Shirt visitor", externalId: visitorId() };
    // sendLead queues the lead in the outbox and retries on the next page load if the request fails.
    void sendLead({ type: "shirt-exit-intent", name: user.name, email, note: "shirt_exit_intent", eventId, visitorId: user.externalId, attribution: attribution(), page: window.location.pathname });
    track("generate_lead", { lead_source: "shirt-exit-intent", content_name: P.name }, { eventId, user });
  };

  const setQty = (size: ShirtSize, n: number) => setSizes((s) => ({ ...s, [size]: Math.max(0, Math.min(999, n)) }));

  const onCheckout = async () => {
    if (busy) return;
    setError("");
    setStatus("");
    if (!hasDesign) return setError(copy.emptyError);
    if (qty < 1) return setError("Add at least one shirt size.");
    if (back && !hasBack && !copy.defaultBack) return setError("Add text, art or a QR link for the back print — or turn the back print off.");
    const ecommerce = ecommerceFor(P, style, back, color.name, sizes);
    serverTrack("add_to_cart", track("add_to_cart", { content_name: P.name, quantity: qty }, { ecommerce }), serverEcommerce(P, ecommerce));
    setBusy("saving");
    const designId = newDesignId(P.designPrefix);
    const styleLabel = P.styles.find((s) => s.id === style)!.label;
    const backSummary = [backText, backSub].filter(Boolean).join(" · ") || (backArtFile ? "Back art" : backLogo ? "Logo" : tourLines.length ? "Tour dates" : qrLink ? "QR code" : copy.defaultBack);
    const fontName = FONTS.find((f) => f.id === font)!.name;
    const placeLabel = placement === "chest" ? "Left chest" : "Center front";
    let printLink = "";
    try {
      // Front + back + mockup stay under Vercel's 4.5 MB request limit.
      const front = printPng(frontInput, placement, back ? 2_500_000 : 4_000_000);
      const backFile = back ? printPng(backInput, "back", 1_500_000) : null;
      if (!front) throw new Error("too big");
      const mockup = frontSvg.current ? await svgToJpeg(frontSvg.current).catch(() => "") : "";
      const res = await fetch("/api/shirt-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: P.kind,
          designId,
          style: styleLabel,
          color: color.name,
          placement: placeLabel,
          frontPng: front.url,
          backPng: backFile?.url,
          mockupJpg: mockup,
          dpi: front.dpi,
          text,
          subtext,
          backText: back ? [backSummary, ...tourLines, qrLink && `QR: ${qrLink}`].filter(Boolean).join(" · ") : "",
          logoName: [logo?.name, backArtFile && `back: ${backArtFile.name}`].filter(Boolean).join(" · "),
          font: fontName,
          sizes,
          total,
          business: text,
          page: window.location.pathname,
          attribution: attribution(),
        }),
      });
      const j = (await res.json().catch(() => ({}))) as { front?: string };
      printLink = j.front || "";
    } catch {
      // The design couldn't be saved (offline, file too big): the order still goes through with the
      // design id and text, and we contact the buyer for the logo file.
    }
    setStatus(printLink ? `Design saved as ${designId}. Opening secure checkout…` : `Your design is saved as ${designId}. We'll contact you for the logo file if needed. Opening secure checkout…`);
    setBusy("checkout");
    try {
      const lines: ShirtLine[] = (Object.entries(sizes) as [ShirtSize, number][])
        .filter(([, q]) => q > 0)
        .map(([size, quantity]) => ({ options: { Style: shirtStyleOption(style, back, P), Color: color.name, Size: size }, quantity }));
      const url = await createShirtCheckout(
        P,
        lines,
        {
          "Design ID": designId,
          Placement: placeLabel,
          "Print file": printLink,
          "Front text": [text, subtext].filter(Boolean).join(" · "),
          ...(back ? { "Back text": [backSummary, ...tourLines].join(" · ") } : {}),
          ...(back && qrLink ? { "QR link": qrLink } : {}),
        },
        text,
      );
      const id = track("begin_checkout", { content_name: P.name, checkout: "shopify", design_id: designId }, { ecommerce, eventId: newEventId("checkout") });
      serverTrack("begin_checkout", id, serverEcommerce(P, ecommerce));
      setTimeout(() => window.location.assign(url), 250);
    } catch {
      setBusy("");
      setStatus("");
      setError(`Checkout didn't open. Your design is saved as ${designId} — try again, or call/text ${SITE.phone.display} and we'll send you a payment link.`);
    }
  };

  const H2 = "font-body text-xs font-semibold uppercase tracking-[0.14em] text-chrome";

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Mockup */}
        <div className="sticky top-14 z-20 order-2 -mx-1 bg-background/95 pb-2 pt-1 backdrop-blur lg:top-24 lg:order-none lg:self-start lg:bg-transparent lg:pb-0 lg:pt-0 lg:backdrop-blur-none [&_svg]:max-h-[40vh] lg:[&_svg]:max-h-none">
          <div className="relative overflow-hidden rounded-3xl bg-[radial-gradient(80%_70%_at_50%_35%,#ffffff,#e9ebef)] ring-1 ring-white/10">
            <div className={cn("px-[8%] pb-[4%] pt-[10%]", side !== "front" && "hidden")}>
              <ShirtMockup ref={frontSvg} style={style} color={color.hex} dark={color.dark} side="front" art={frontArt} placement={placement} guide={!hasDesign} onMove={hasDesign ? onMove : undefined} title={`${color.name} ${style === "long" ? "long" : "short"} sleeve ${copy.mockupNoun}, front`} className="mx-auto w-full max-w-[520px] drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)]" />
            </div>
            <div className={cn("px-[8%] pb-[4%] pt-[10%]", side !== "back" && "hidden")}>
              <ShirtMockup style={style} color={color.hex} dark={color.dark} side="back" art={backArt} placement="back" guide={!back} onMove={back ? onMove : undefined} title={`${color.name} ${copy.mockupNoun}, back`} className="mx-auto w-full max-w-[520px] drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)]" />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all">Live preview</span>
            <div className="absolute right-3 top-3 flex rounded-full bg-black/40 p-1 shadow-lg backdrop-blur-md transition-all text-xs font-semibold text-white" role="group" aria-label="Shirt side">
              {(["front", "back"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSide(s)} aria-pressed={side === s} className={cn("min-h-[40px] rounded-full px-4 capitalize", side === s ? "bg-white text-black" : "text-white/80")}>
                  {s}
                </button>
              ))}
            </div>
            {!hasDesign ? (
              <p className="absolute inset-x-0 bottom-3 text-center text-xs font-medium text-black/60">{copy.sampleNote}</p>
            ) : (
              <p className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-black/60">
                <Move className="h-3.5 w-3.5" aria-hidden /> Drag the design to move it
              </p>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Printed {placement === "chest" ? 'up to 4" × 4" on the left chest' : 'up to 12" × 16" on the front'}
            {back ? ' + up to 12" × 16" on the back' : ""}. A real person checks every design before it prints.
          </p>
        </div>

        {/* Designer + buy panel */}
        <div className="contents lg:block">
          <div className="order-1 lg:order-none">
          <p className="chip">{copy.chip}</p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.02] sm:text-5xl">
            {copy.h1} <span className="text-turbo-grad">{copy.h1Accent}</span>
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{copy.lede}</p>
          <button type="button" onClick={() => document.getElementById(`${uid}-logo-step`)?.scrollIntoView({ behavior: "smooth", block: "center" })} className="btn-ignite btn-shine mt-5 w-full justify-center sm:w-auto">
            <ImageUp className="h-4 w-4" aria-hidden /> Upload my {copy.artNoun} · from {money2(P.styles[0].price)}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground sm:text-left">Free US shipping · prints in 2–4 days · free reprint if it's wrong</p>
          </div>

          <div className="order-3 lg:order-none">
          <ul className="mt-6 grid grid-cols-2 gap-2">
            {copy.points.map((p) => (
              <li key={p.title} className="rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                <p className="text-sm font-semibold leading-tight">{p.title}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>

          {/* Progress */}
          <ol className="mt-6 grid grid-cols-4 gap-1.5 text-center text-[11px] font-semibold" aria-label="Progress">
            {[["Style", true], ["Logo", hasDesign], ["Customize", hasDesign && (!!text.trim() || back)], ["Sizes", qty > 0 && hasDesign]].map(([l, ok]) => (
              <li key={l as string}>
                <span className={cn("block h-1.5 rounded-full", ok ? "bg-turbo" : "bg-white/10")} />
                <span className={cn("mt-1 block", ok ? "text-foreground" : "text-muted-foreground")}>{l as string}</span>
              </li>
            ))}
          </ol>

          {/* 1. Style */}
          <fieldset className="mt-7">
            <legend className={H2}>1 · Sleeves</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {P.styles.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={style === s.id} onClick={() => setStyle(s.id)} className={cn("opt !flex-col !items-start !gap-0.5 !py-3", style === s.id && "ring-turbo")}>
                  <span className="text-sm font-semibold">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{money2(s.price)} / shirt</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* 2. Color */}
          <fieldset className="mt-6">
            <legend className={H2}>
              2 · Shirt color: <span className="normal-case tracking-normal text-foreground">{color.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {P.colors.map((c) => (
                <button key={c.id} type="button" onClick={() => setColorId(c.id)} aria-label={c.name} aria-pressed={colorId === c.id} className={cn("grid h-11 w-11 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-background transition", colorId === c.id ? "ring-turbo" : "ring-white/15 hover:ring-white/40")} style={{ background: c.hex }}>
                  {colorId === c.id && <Check className={cn("h-4 w-4", c.dark ? "text-white" : "text-black")} aria-hidden />}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 3. Logo */}
          <fieldset id={`${uid}-logo-step`} className="mt-6 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <legend className={cn(H2, "px-1")}>3 · {copy.artLabel}</legend>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {SHIRT_PRESETS.map((p) => (
                <button key={p.id} type="button" aria-pressed={selectedPreset === p.id} onClick={() => (setSelectedPreset(p.id), setLogoScale(p.logoScale), setFont(p.font), setText(p.text), setSubtext(p.subtext), setInkId(p.inkId), markCustomized())} className={cn("opt !py-2 text-xs", selectedPreset === p.id && "ring-turbo")}>
                  {p.name}
                </button>
              ))}
            </div>
            <input ref={fileRef} id={`${uid}-logo`} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(e) => onFile(e)} />
            {logo ? (
              <div className="flex items-center gap-3">
                <img src={logo.img.src} alt={`Your uploaded ${copy.artNoun}`} className="h-14 w-14 rounded-lg bg-[repeating-conic-gradient(#ddd_0_25%,#fff_0_50%)] bg-[length:12px_12px] object-contain p-1" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">{logo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {logo.img.naturalWidth} × {logo.img.naturalHeight}px
                  </p>
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-chrome !min-h-[40px] !px-3 !text-xs">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Change
                </button>
                <button type="button" onClick={() => setLogo(null)} aria-label={`Remove ${copy.artNoun}`} className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-white/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label htmlFor={`${uid}-logo`} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-6 text-center transition-all hover:border-turbo hover:bg-gradient-to-br hover:from-turbo/10 hover:to-transparent hover:shadow-lg">
                <ImageUp className="h-6 w-6 text-turbo" aria-hidden />
                <span className="text-sm font-semibold">Upload your {copy.artNoun}</span>
                <span className="text-xs text-muted-foreground">PNG with a transparent background is best · JPG, SVG work too</span>
                {copy.textOnlyNote && <span className="text-[11px] text-muted-foreground">{copy.textOnlyNote}</span>}
              </label>
            )}
            {logo?.white && (
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={useClean} onChange={(e) => setUseClean(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--turbo))]" />
                Remove white background
              </label>
            )}
            {logo && !lowRes && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
                <span aria-hidden>✓</span> Print-ready · {logo.img.naturalWidth}px wide
              </p>
            )}
            {lowRes && (
              <p className="mt-3 flex items-start gap-2 text-xs text-[hsl(var(--ignite-hot))]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> This will print blurry ({logo!.img.naturalWidth}px wide). Want us to fix it? (free) — just order and we'll rebuild it sharp and send a proof, or upload a bigger PNG.
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["front", "chest"] as const).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={placement === p} onClick={() => setPlacement(p)} className={cn("opt !py-2.5 text-sm font-semibold", placement === p && "ring-turbo")}>
                  {p === "front" ? "Center front (big)" : "Left chest (small)"}
                </button>
              ))}
            </div>
            {logo && (
              <label className="mt-4 block text-xs text-muted-foreground">
                {copy.artNoun[0].toUpperCase() + copy.artNoun.slice(1)} size
                <input type="range" min={0.35} max={1} step={0.05} value={logoScale} onChange={(e) => setLogoScale(Number(e.target.value))} className="mt-1 w-full accent-[hsl(var(--turbo))]" />
              </label>
            )}
          </fieldset>

          {/* 4. Text */}
          <fieldset className="mt-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <legend className={cn(H2, "px-1")}>4 · Text {copy.textOptional ? "(optional)" : ""}</legend>
            <label htmlFor={`${uid}-text`} className="sr-only">
              {copy.textPlaceholder}
            </label>
            <input id={`${uid}-text`} className="field" value={text} onChange={(e) => (setText(e.target.value), markCustomized())} placeholder={copy.textPlaceholder} maxLength={40} autoComplete={artist ? "off" : "organization"} />
            <label htmlFor={`${uid}-sub`} className="sr-only">
              Small line
            </label>
            <input id={`${uid}-sub`} className="field mt-2" value={subtext} onChange={(e) => setSubtext(e.target.value)} placeholder={copy.subPlaceholder} maxLength={48} />
            <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Font">
              <span className="text-xs text-muted-foreground">Font</span>
              {FONTS.filter((f, i) => moreFonts || i < 3 || f.id === font).map((f) => (
                <button key={f.id} type="button" onClick={() => (setFont(f.id), markCustomized())} aria-pressed={font === f.id} className={cn("min-h-[44px] rounded-full px-3.5 text-sm ring-1", font === f.id ? "bg-white text-black ring-white" : "ring-white/15 hover:ring-white/40")} style={{ fontFamily: f.family, fontWeight: f.weight }}>
                  {f.name}
                </button>
              ))}
              {FONTS.length > 3 && !moreFonts && (
                <button type="button" onClick={() => setMoreFonts(true)} className="min-h-[44px] px-2 text-xs text-muted-foreground underline underline-offset-2">
                  More fonts
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Print color">
              <span className="text-xs text-muted-foreground">Print color</span>
              {INKS.map((i) => (
                <button key={i.id} type="button" onClick={() => setInkId(i.id)} aria-pressed={inkId === i.id} className={cn("min-h-[44px] rounded-full px-3.5 text-xs font-semibold ring-1", inkId === i.id ? "bg-white text-black ring-white" : "ring-white/15 hover:ring-white/40")}>
                  {i.hex && <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle ring-1 ring-black/20" style={{ background: i.hex }} />}
                  {i.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Print color applies to your text. Your {copy.artNoun} prints in its own colors.</p>
          </fieldset>

          {/* Position (Printify-style: drag on the shirt, or nudge here) */}
          {(hasDesign || back) && (
            <fieldset className="mt-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
              <legend className={cn(H2, "px-1")}>Position · {side}</legend>
              <p className="text-xs text-muted-foreground">Drag the design on the shirt, or fine-tune it here.</p>
              <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
                <label className="block text-xs text-muted-foreground">
                  Up / down
                  <input type="range" min={-0.5} max={0.5} step={0.01} value={curPos.y} onChange={(e) => setCurPos((p) => ({ ...p, y: Number(e.target.value) }))} className="mt-1 w-full accent-[hsl(var(--turbo))]" />
                </label>
                <button type="button" onClick={() => setCurPos(CENTER)} className="btn-chrome !min-h-[40px] !px-3 !text-xs">
                  <Crosshair className="h-3.5 w-3.5" aria-hidden /> Center
                </button>
                <label className="block text-xs text-muted-foreground">
                  Left / right
                  <input type="range" min={-0.5} max={0.5} step={0.01} value={curPos.x} onChange={(e) => setCurPos((p) => ({ ...p, x: Number(e.target.value) }))} className="mt-1 w-full accent-[hsl(var(--turbo))]" />
                </label>
                <span />
                <label className="block text-xs text-muted-foreground">
                  Rotate {Math.round(curPos.rotate)}°
                  <input type="range" min={-45} max={45} step={1} value={curPos.rotate} onChange={(e) => setCurPos((p) => ({ ...p, rotate: Number(e.target.value) }))} className="mt-1 w-full accent-[hsl(var(--turbo))]" />
                </label>
              </div>
            </fieldset>
          )}

          {/* 5. Back */}
          <fieldset className="mt-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <legend className={cn(H2, "px-1")}>5 · Back print</legend>
            <div className="mb-3 text-xs text-muted-foreground">
              Front only: {money2(shirtTotal(style, false, sizes, P).total)} · Front + back: <span className="text-emerald-400">{money2(shirtTotal(style, true, sizes, P).total)}</span>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold">
              <span>
                {copy.backToggle} <span className="font-normal text-muted-foreground">+{money2(P.backPrintPrice)} / shirt</span>
              </span>
              <input
                type="checkbox"
                checked={back}
                onChange={(e) => {
                  setBack(e.target.checked);
                  setSide(e.target.checked ? "back" : "front");
                }}
                className="h-5 w-5 accent-[hsl(var(--turbo))]"
              />
            </label>
            {back && (
              <div className="mt-3 animate-step">
                <input aria-label="Back big text" className="field" value={backText} onChange={(e) => setBackText(e.target.value)} placeholder={copy.backPlaceholder} maxLength={30} onFocus={() => setSide("back")} />
                <input aria-label="Back small line" className="field mt-2" value={backSub} onChange={(e) => setBackSub(e.target.value)} placeholder={copy.backSubPlaceholder} maxLength={48} onFocus={() => setSide("back")} />
                {artist && (
                  <>
                    <label htmlFor={`${uid}-tour`} className="mt-3 block text-xs text-muted-foreground">
                      Tour dates or track list — one per line (up to 14)
                    </label>
                    <textarea id={`${uid}-tour`} className="field mt-1 min-h-[96px] py-2" value={backLines} onChange={(e) => setBackLines(e.target.value)} placeholder={"03.14 ATLANTA · Masquerade\n03.16 CHARLOTTE · The Underground\n03.18 NASHVILLE · Exit/In"} onFocus={() => setSide("back")} />
                    <input ref={backFileRef} id={`${uid}-backart`} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(e) => onFile(e, "back")} />
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label htmlFor={`${uid}-backart`} className="btn-chrome !min-h-[40px] cursor-pointer !px-3 !text-xs">
                        <ImageUp className="h-3.5 w-3.5" aria-hidden /> {backArtFile ? "Change back art" : "Upload different back art"}
                      </label>
                      {backArtFile && (
                        <button type="button" onClick={() => setBackArtFile(null)} className="text-xs text-muted-foreground underline underline-offset-2">
                          Remove back art
                        </button>
                      )}
                    </div>
                  </>
                )}
                {logo && !backArtFile && (
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={backLogo} onChange={(e) => setBackLogo(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--turbo))]" />
                    Put my {copy.artNoun} on the back too
                  </label>
                )}
                <label htmlFor={`${uid}-qr`} className="mt-4 block text-sm font-semibold">
                  QR code <span className="font-normal text-muted-foreground">— optional, free</span>
                </label>
                <input id={`${uid}-qr`} className="field mt-1.5" value={backQr} onChange={(e) => setBackQr(e.target.value)} placeholder="Link to your site, menu, booking page or socials" inputMode="url" maxLength={300} onFocus={() => setSide("back")} />
                <p className="mt-1 text-xs text-muted-foreground">Printed big on the back so people can scan it from across the room. Test it with your phone camera on the preview.</p>
              </div>
            )}
          </fieldset>

          {/* 6. Sizes */}
          <fieldset className="mt-6">
            <legend className={H2}>6 · Sizes &amp; quantity</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {P.sizes.map((s) => (
                <div key={s} className="rounded-2xl bg-white/[0.03] p-2 text-center ring-1 ring-white/5">
                  <p className="text-sm font-semibold">{s}</p>
                  <p className="text-xs text-muted-foreground">{money2(shirtUnitPrice(style, s, back, P))}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <button type="button" aria-label={`One less ${s}`} onClick={() => setQty(s, (sizes[s] || 0) - 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 active:bg-white/15">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input aria-label={`Quantity ${s}`} inputMode="numeric" value={sizes[s] || 0} onChange={(e) => setQty(s, Number(e.target.value.replace(/\D/g, "")) || 0)} className="h-11 w-10 bg-transparent text-center text-base font-bold tabular-nums outline-none" />
                    <button type="button" aria-label={`One more ${s}`} onClick={() => setQty(s, (sizes[s] || 0) + 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 active:bg-white/15">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[["Small team", { M: 2, L: 2, XL: 1 }], ["Crew of 12", { M: 3, L: 5, XL: 3, "2XL": 1 }]].map(([l, v]) => (
                <button key={l as string} type="button" onClick={() => setSizes(v as Sizes)} className="btn-chrome !min-h-[40px] !px-3 !text-xs">
                  Quick add: {l as string} ({Object.values(v as Sizes).reduce((a, b) => a + (b || 0), 0)})
                </button>
              ))}
            </div>
            <ol className={cn("mt-3 grid gap-2 text-center", P.tiers.length > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
              {P.tiers.map((t) => (
                <li key={t.min} className={cn("rounded-xl px-2 py-2 ring-1", tier.min === t.min ? "bg-turbo/10 ring-turbo" : "ring-white/10")}>
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">{t.off ? `${Math.round(t.off * 100)}% off` : "No minimum"}</p>
                </li>
              ))}
            </ol>
          </fieldset>

          {/* Summary + buy */}
          <div className="mt-6 rounded-2xl p-4 ring-1 ring-white/10 sm:p-5" style={{ background: "linear-gradient(180deg, hsl(218 30% 10%), hsl(220 34% 7%))" }}>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  {qty} × {P.styles.find((s) => s.id === style)!.label.toLowerCase()} · {color.name}
                  {back ? " · front + back" : ""}
                </dt>
                <dd className="tabular-nums">{money2(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-emerald-300">
                  <dt>
                    {copy.discountLabel} ({Math.round(tier.off * 100)}%)
                  </dt>
                  <dd className="tabular-nums">−{money2(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-emerald-300">Free</dd>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-2">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-3xl font-bold tabular-nums">{money2(total)}</dd>
              </div>
            </dl>
            {nextTier && qty > 0 && <p className="mt-2 text-xs text-[hsl(var(--ignite-hot))]">Add {nextTier.min - qty} more and save {Math.round(nextTier.off * 100)}% on every shirt.</p>}
            <button ref={buyRef} type="button" onClick={onCheckout} disabled={!!busy} className="btn-ignite btn-shine mt-4 w-full justify-center !min-h-[56px] !text-base shadow-[0_0_32px_rgba(255,120,40,0.45)]">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {busy === "saving" ? "Saving your print file…" : "Opening secure checkout…"}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden /> Add to cart — {money2(total)}
                </>
              )}
            </button>
            {!hasDesign && <p role="alert" className="mt-2 text-center text-sm text-[hsl(var(--ignite-hot))]">Add your logo or company name to continue.</p>}
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-foreground/80">
              <span>✓ Real person checks your design before printing</span>
              <span>✓ Free reprint if anything is wrong</span>
              <span>✓ Free US shipping</span>
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">Most teams order 12–24 shirts · Secure checkout · Printed in 2–4 days</p>
            <p role="status" aria-live="polite" className={cn("text-sm text-emerald-300", status && "mt-3")}>
              {status && <Check className="mr-1.5 inline h-4 w-4" aria-hidden />}
              {status}
            </p>
            {error && (
              <p role="alert" className="mt-3 text-sm text-[#ff8a8a]">
                {error}
              </p>
            )}
            <ul className="mt-4 grid gap-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-turbo" aria-hidden /> {P.shipping.production} · {P.shipping.label}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-turbo" aria-hidden /> Free reprint if it's misprinted or damaged
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                <span>
                  Questions or a deadline? Call or text{" "}
                  <a href={SITE.phone.href} className="-my-3 inline-block whitespace-nowrap py-3 font-semibold text-foreground underline underline-offset-2">
                    {SITE.phone.display}
                  </a>
                </span>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>

      {/* Phone checkout bar */}
      <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 lg:hidden", showBar ? "translate-y-0" : "translate-y-full")} aria-hidden={!showBar}>
        <div className="flex items-center gap-3 pb-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {qty} {copy.barNoun} {qty === 1 ? "shirt" : "shirts"}
            </p>
            <p className="text-xs text-muted-foreground">{money2(total)} · free shipping</p>
          </div>
          <button type="button" tabIndex={showBar ? 0 : -1} onClick={onCheckout} disabled={!!busy} className="btn-ignite !min-h-[44px] !px-4 !text-sm">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Add to cart · " + money2(total)}
          </button>
        </div>
      </div>
      {showExitModal && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" onClick={() => setShowExitModal(false)}>
          <div role="dialog" aria-modal="true" aria-label="Get 10% off" className="relative w-full max-w-md rounded-2xl bg-background p-6 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close" onClick={() => setShowExitModal(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <X className="h-4 w-4" aria-hidden />
            </button>
            {exitDone ? (
              <p className="py-6 text-center font-semibold">Thanks — we'll email you shortly.</p>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold">Leaving already?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Drop your email and we'll send you 10% off your first shirt order.</p>
                <form className="mt-4 flex flex-col gap-3" onSubmit={(e) => (e.preventDefault(), submitExitEmail())}>
                  <input type="email" required autoFocus className="field" value={exitEmail} onChange={(e) => setExitEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
                  <button type="submit" className="btn-ignite justify-center">Get 10% off</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
