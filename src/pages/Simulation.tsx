import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MapView from "@/components/MapView";
import { runSimulation } from "@/lib/api";
import { mockSimulationResult } from "@/lib/mockData";
import type { SimulationResult } from "@/lib/types";

const yearLabels: Record<number, string> = { 0: "2030", 50: "2050", 100: "2100" };

function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function Simulation() {
  const [sliderVal, setSliderVal] = useState([50]);
  const [hazard, setHazard] = useState("Flood");
  const [budget, setBudget] = useState("50000000");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(mockSimulationResult);
  const [showBefore, setShowBefore] = useState(false);

  const scenarioYear = sliderVal[0] <= 25 ? 2030 : sliderVal[0] <= 75 ? 2050 : 2100;

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    const res = await runSimulation({
      projectId: "proj-001",
      scenarioYear,
      hazardType: hazard,
      budget: Number(budget),
    });
    setResult(res);
    setRunning(false);
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] flex">
      {/* Map */}
      <div className="flex-1 relative">
        <MapView showHeatmap={!showBefore} />

        {/* Before/After toggle */}
        <div className="absolute top-4 left-4 glass-panel-strong p-3 flex items-center gap-3 z-10">
          <Label className="text-xs text-muted-foreground">Before</Label>
          <Switch checked={!showBefore} onCheckedChange={(v) => setShowBefore(!v)} />
          <Label className="text-xs text-muted-foreground">After</Label>
        </div>
      </div>

      {/* Left control panel */}
      <div className="absolute left-4 top-16 bottom-4 w-72 glass-panel-strong p-5 space-y-5 z-10 overflow-y-auto">
        <h2 className="text-sm font-semibold text-foreground">Scenario Controls</h2>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Projection Year</label>
          <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2030</span><span>2050</span><span>2100</span>
          </div>
          <p className="text-center stat-number text-primary text-lg">{scenarioYear}</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Hazard Type</label>
          <Select value={hazard} onValueChange={setHazard}>
            <SelectTrigger className="bg-secondary/50 border-glass-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flood">🌊 Flood</SelectItem>
              <SelectItem value="Heat">🔥 Heat</SelectItem>
              <SelectItem value="Storm">⛈ Storm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Budget (₹)</label>
          <Input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-secondary/50 border-glass-border/30 stat-number"
            placeholder="50000000"
          />
          <p className="text-xs text-muted-foreground">{formatINR(Number(budget) || 0)}</p>
        </div>

        <Button
          onClick={handleRun}
          disabled={running}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-border-hover gap-2"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      {/* Right results panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-4 bottom-4 w-80 glass-panel-strong p-5 space-y-4 z-10 overflow-y-auto"
          >
            <h2 className="text-sm font-semibold text-foreground">Simulation Results</h2>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Risk Score" value={`${result.riskScore}/100`} />
              <ResultCard label="ROI" value={`${result.roiPercent}%`} highlight />
              <ResultCard label="Annual Loss" value={formatINR(result.expectedAnnualLoss)} />
              <ResultCard label="Budget" value={formatINR(result.budget)} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Recommendations
              </h3>
              {result.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-2 text-xs text-foreground/80"
                >
                  <Badge variant="outline" className="h-5 w-5 flex-shrink-0 flex items-center justify-center text-[10px] border-primary/30 text-primary">
                    {i + 1}
                  </Badge>
                  <span>{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Running overlay */}
      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/40 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <div className="glass-panel-strong p-8 flex flex-col items-center gap-4 animate-glow-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-foreground font-medium">Running climate simulation...</p>
              <p className="text-xs text-muted-foreground">Analyzing {hazard.toLowerCase()} risk for {scenarioYear}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="glass-panel p-3 space-y-1">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`stat-number text-lg ${highlight ? "text-primary neon-text" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
