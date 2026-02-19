export interface Project {
  id: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    city: string;
    state: string;
  };
  hazardType: "Flood" | "Heat" | "Storm";
  riskScore: number;
  riskLevel: "High" | "Medium" | "Low";
  expectedAnnualLoss: number;
  projectCost: number;
  recommendations: string[];
  createdBy: string;
  createdAt: Date;
  lastRunAt: Date;
  status: "Active" | "Completed" | "Pending";
}

export interface SimulationResult {
  id: string;
  projectId: string;
  scenarioYear: 2030 | 2050 | 2100;
  hazardType: "Flood" | "Heat" | "Storm";
  budget: number;
  riskScore: number;
  expectedAnnualLoss: number;
  roiPercent: number;
  recommendations: string[];
  createdAt: Date;
}

export interface StatsData {
  projectsMonitored: number;
  riskAlerts: number;
  expectedAnnualLoss: number;
  activeSimulations: number;
}
