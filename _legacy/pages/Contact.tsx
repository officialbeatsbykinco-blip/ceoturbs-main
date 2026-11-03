import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CreditCard, Globe, Bot, Video, Rocket, Check, Send } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const chips = [
  { icon: CreditCard, label: "Premium NFC Card", action: "buy" as const },
  { icon: Globe, label: "Custom Website", action: "calendly" as const },
  { icon: Video, label: "YouTube Thumbnails", action: "calendly" as const },
  { icon: Rocket, label: "Full Brand Acceleration", action: "calendly" as const },
  { icon: Bot, label: "AI Prompt Pack", action: "navigate" as const },
];

type Message = {
  from: "system" | "user";
  text: string;
};

const Contact = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [messages, setMessages] = useState<Message[]>([
    { from: "system", text: "What do you need to turbo-accelerate today?" },
  ]);

  const toggleChip = (label: string) => {
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;

    const userMsg = selected.join(", ");
    setMessages((m) => [...m, { from: "user", text: userMsg }]);

    // Check if any selected item needs direct buy
    const hasBuy = selected.includes("Premium NFC Card");
    const hasNavigate = selected.includes("AI Prompt Pack");

    if (hasBuy && selected.length === 1) {
      navigate("/nfc-business-card");
      return;
    }
    if (hasNavigate && selected.length === 1) {
      navigate("/promptshop");
      return;
    }

    // Default: open Calendly for strategy call
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "system",
          text: `Great choices! Let's hop on a free 30-minute call to map out your ${selected.length > 1 ? "custom package" : userMsg.toLowerCase()} strategy.`,
        },
      ]);
      setStep("confirm");
    }, 600);
  };

  const openCalendly = () => {
    setStep("done");
    setMessages((m) => [...m, { from: "system", text: "Opening your booking page now... 🚀" }]);
    setTimeout(() => {
      window.open("https://calendly.com/stackmodechris/brand-boost", "_blank", "noopener,noreferrer");
    }, 500);
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      <TopBar />

      <div className="flex-1 flex flex-col pt-20 pb-28 px-4 max-w-lg mx-auto w-full">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-strong text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quick-select chips */}
        {step === "select" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => {
                const isActive = selected.includes(chip.label);
                return (
                  <button
                    key={chip.label}
                    onClick={() => toggleChip(chip.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      isActive
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "glass border-border/20 text-foreground hover:border-primary/20"
                    }`}
                  >
                    <chip.icon className="h-3.5 w-3.5" />
                    {chip.label}
                    {isActive && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-blue flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Send
            </motion.button>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCalendly}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-blue flex items-center justify-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              Book Free Strategy Call
            </motion.button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">You're all set!</p>
            <p className="text-xs text-muted-foreground mt-1">Complete your booking in the new tab.</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Contact;
