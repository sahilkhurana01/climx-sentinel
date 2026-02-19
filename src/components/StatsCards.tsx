import { motion } from "framer-motion";
import { ShieldAlert, Activity, IndianRupee, Cpu } from "lucide-react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { statsData } from "@/lib/mockData";

const formatINR = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const cards = [
  { label: "Projects Monitored", value: statsData.projectsMonitored, icon: Activity, suffix: "" },
  { label: "Risk Alerts", value: statsData.riskAlerts, icon: ShieldAlert, suffix: "" },
  { label: "Expected Annual Loss", value: statsData.expectedAnnualLoss, icon: IndianRupee, suffix: "", isINR: true },
  { label: "Active Simulations", value: statsData.activeSimulations, icon: Cpu, suffix: "" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} card={card} index={i} />
      ))}
    </div>
  );
}

function StatCard({ card, index }: { card: (typeof cards)[number]; index: number }) {
  const count = useAnimatedCounter(card.isINR ? card.value : card.value, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel glow-border-hover p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <card.icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="stat-number text-2xl text-foreground">
        {card.isINR ? formatINR(count) : count}
        {card.suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
    </motion.div>
  );
}
