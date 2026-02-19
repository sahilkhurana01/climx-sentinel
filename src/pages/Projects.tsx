import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Projects() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor all climate risk projects</p>
        </div>
      </motion.div>
      <ProjectsGrid />
    </div>
  );
}
