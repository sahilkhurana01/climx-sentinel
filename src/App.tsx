import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Simulation from "./pages/Simulation";
import Reports from "./pages/Reports";
import ROICalculator from "./pages/ROICalculator";
import Automation from "./pages/Automation";
import APIAccess from "./pages/APIAccess";
import SettingsPage from "./pages/Settings";
import LoadingScreen from "./components/LoadingScreen";
import NotFound from "./pages/NotFound";
import { Globe } from "lucide-react";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      <div className="wave-bg" />
      <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto animate-glow-pulse">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gradient">CLIMX</h1>
        <p className="text-muted-foreground">
          Government-grade climate intelligence platform. Analyze infrastructure risk, run simulations, and build resilient cities.
        </p>
        <div className="flex gap-3 justify-center">
          <SignInButton mode="modal">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-border-hover">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" className="border-glass-border/30 hover:bg-secondary/50">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoadingScreen />
      <BrowserRouter>
        <SignedOut>
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </SignedOut>
        <SignedIn>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/roi" element={<ROICalculator />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/api" element={<APIAccess />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SignedIn>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
