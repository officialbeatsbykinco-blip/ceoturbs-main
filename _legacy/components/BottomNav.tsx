import { motion, AnimatePresence } from "framer-motion";
import { Home, Grid3X3, Image, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid3X3, label: "Services", path: "/services" },
  { icon: Image, label: "Portfolio", path: "/portfolio" },
  { icon: MessageCircle, label: "Contact", path: "/contact" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
    >
      <div className="mx-3 mb-3 glass-strong rounded-2xl border border-border/20 overflow-hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <item.icon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
