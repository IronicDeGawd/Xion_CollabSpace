import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { treasuryConfig } from "./lib/constants";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Ideas from "./pages/Ideas";
import ProjectDetail from "./pages/ProjectDetail";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <AbstraxionProvider config={treasuryConfig}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="app-container">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/ideas" element={<Ideas />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </BrowserRouter>
            </TooltipProvider>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </AbstraxionProvider>
);

export default App;
