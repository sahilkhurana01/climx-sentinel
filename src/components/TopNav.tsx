import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";

export default function TopNav() {
  return (
    <header className="h-16 flex items-center justify-between px-6 glass-panel-strong border-b border-glass-border/20 sticky top-0 z-20">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects, simulations..."
          className="pl-10 bg-secondary/50 border-glass-border/30 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
        </button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </div>
    </header>
  );
}
