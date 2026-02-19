import { useUser } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/StatsCards";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="text-gradient">{user?.firstName || "Analyst"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Climate risk intelligence overview
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-border-hover gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <StatsCards />
      <ProjectsGrid />
    </div>
  );
}
