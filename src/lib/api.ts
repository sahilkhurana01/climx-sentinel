// MongoDB Atlas API placeholder
// Replace these with actual API calls when backend is connected

import { mockProjects, statsData, mockSimulationResult } from "./mockData";
import type { Project, StatsData, SimulationResult } from "./types";

export async function getProjects(): Promise<Project[]> {
  // TODO: Replace with MongoDB Atlas API call
  // const response = await fetch('/api/projects');
  return new Promise((resolve) => setTimeout(() => resolve(mockProjects), 500));
}

export async function getStats(): Promise<StatsData> {
  return new Promise((resolve) => setTimeout(() => resolve(statsData), 300));
}

export async function runSimulation(params: {
  projectId: string;
  scenarioYear: number;
  hazardType: string;
  budget: number;
}): Promise<SimulationResult> {
  // TODO: Replace with MongoDB Atlas API call
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ...mockSimulationResult,
          scenarioYear: params.scenarioYear as 2030 | 2050 | 2100,
          hazardType: params.hazardType as "Flood" | "Heat" | "Storm",
          budget: params.budget,
        }),
      2000
    )
  );
}

export async function createProject(project: Partial<Project>): Promise<Project> {
  // TODO: Replace with MongoDB Atlas API call
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ...mockProjects[0],
          ...project,
          id: `proj-${Date.now()}`,
          createdAt: new Date(),
          lastRunAt: new Date(),
        } as Project),
      500
    )
  );
}
