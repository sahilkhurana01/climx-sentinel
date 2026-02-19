import { motion } from "framer-motion";
import { MapPin, Calendar, Eye, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/lib/mockData";
import type { Project } from "@/lib/types";

const riskColors: Record<string, string> = {
  High: "bg-destructive/20 text-destructive border-destructive/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Low: "bg-success/20 text-success border-success/30",
};

const hazardGradients: Record<string, string> = {
  Flood: "from-blue-600/30 via-cyan-500/20 to-transparent",
  Heat: "from-orange-600/30 via-amber-500/20 to-transparent",
  Storm: "from-purple-600/30 via-indigo-500/20 to-transparent",
};

function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function ProjectsGrid() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
      className="glass-panel glow-border-hover group hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Heatmap preview */}
      <div className={`h-28 bg-gradient-to-br ${hazardGradients[project.hazardType]} relative`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--glow-primary)/0.15),transparent_70%)]" />
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs border ${riskColors[project.riskLevel]}`}>
            {project.riskLevel} Risk
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="stat-number text-xl text-foreground">{project.riskScore}</span>
          <span className="text-xs text-muted-foreground ml-1">/ 100</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm">{project.name}</h3>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {project.location.city}, {project.location.state}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Last run: {project.lastRunAt.toLocaleDateString("en-IN")}
          </div>
          <div className="text-foreground/80 font-medium">
            Cost: {formatINR(project.projectCost)} · EAL: {formatINR(project.expectedAnnualLoss)}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="secondary" className="flex-1 text-xs h-8 bg-secondary/80 hover:bg-secondary">
            <Eye className="w-3 h-3 mr-1" /> View
          </Button>
          <Button size="sm" variant="secondary" className="flex-1 text-xs h-8 bg-secondary/80 hover:bg-secondary">
            <RotateCcw className="w-3 h-3 mr-1" /> Rerun
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
