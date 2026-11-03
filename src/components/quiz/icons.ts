import { Building2, CalendarDays, Clock, Compass, Globe, Mic2, Phone, Rocket, Search, ShoppingBag, ShoppingCart, Star, Ticket, TrendingUp, Users, Wallet, Wrench, Zap } from "lucide-react";
import type { IconKey } from "@/content/quiz";

export const ICON: Record<IconKey, typeof Wrench> = {
  wrench: Wrench,
  mic: Mic2,
  bag: ShoppingBag,
  building: Building2,
  phone: Phone,
  star: Star,
  search: Search,
  globe: Globe,
  cart: ShoppingCart,
  users: Users,
  ticket: Ticket,
  clock: Clock,
  zap: Zap,
  calendar: CalendarDays,
  compass: Compass,
  wallet: Wallet,
  rocket: Rocket,
  trending: TrendingUp,
};
