import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Eye, Phone, DollarSign } from "lucide-react";

const CountUp = ({ end, delay = 0 }: {end: number;delay?: number;}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const steps = 50;
      const increment = end / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= end) {setCount(end);clearInterval(interval);} else
        setCount(Math.floor(current));
      }, 1800 / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, end, delay]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const clients = [
{
  name: "SWOLEjd",
  metric: "500+",
  metricLabel: "views in 3 days",
  quote: "The brand overhaul changed everything — content started hitting immediately.",
  icon: Eye,
  color: "hsl(205 100% 50%)",
  countEnd: 500
},
{
  name: "ZahPhysique",
  metric: "10x",
  metricLabel: "more booked calls",
  quote: "Went from zero leads to a full calendar within the first month.",
  icon: Phone,
  color: "hsl(18 100% 60%)",
  countEnd: 10
},
{
  name: "Stackmode",
  metric: "$100K+",
  metricLabel: "revenue generated",
  quote: "CEO Turbo built the system. We just pressed go.",
  icon: DollarSign,
  color: "hsl(160 100% 50%)",
  countEnd: 100
},
{
  name: "True Legacy",
  metric: "340%",
  metricLabel: "traffic increase",
  quote: "Our brand finally matches the quality of our work.",
  icon: TrendingUp,
  color: "hsl(270 100% 65%)",
  countEnd: 340
}];


export const ClientResultsStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return null;




















































};