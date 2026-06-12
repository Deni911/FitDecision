import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Recommendations from "./pages/Recommendations";
import NutritionPlan from "./pages/NutritionPlan";
import WorkoutPlan from "./pages/WorkoutPlan";
import RankingResults from "./pages/RankingResults";
import History from "./pages/History";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            }
          />
          <Route
            path="/assessment"
            element={
              <DashboardLayout>
                <Assessment />
              </DashboardLayout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <DashboardLayout>
                <Recommendations />
              </DashboardLayout>
            }
          />
          <Route
            path="/nutrition"
            element={
              <DashboardLayout>
                <NutritionPlan />
              </DashboardLayout>
            }
          />
          <Route
            path="/workout"
            element={
              <DashboardLayout>
                <WorkoutPlan />
              </DashboardLayout>
            }
          />
          <Route
            path="/ranking"
            element={
              <DashboardLayout>
                <RankingResults />
              </DashboardLayout>
            }
          />
          <Route
            path="/history"
            element={
              <DashboardLayout>
                <History />
              </DashboardLayout>
            }
          />
          <Route
            path="/about"
            element={
              <DashboardLayout>
                <About />
              </DashboardLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
