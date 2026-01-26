import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AppLayout from "./components/AppLayout";
import DataImportPage from "./pages/app/DataImport";
import VolSurfacePage from "./pages/app/VolSurface";
import PricerPage from "./pages/app/Pricer";
import AboutPage from "./pages/About";
import MethodsPage from "./pages/Methods";
import PublicationsPage from "./pages/Publications";
import ExplorePage from "./pages/Explore";
import { useSessionInit } from "./state/labSessionStore";
import { API_BASE } from "./lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Get base path from Vite config (for GitHub Pages subdirectory deployment)
const basePath = import.meta.env.BASE_URL || '/';

/**
 * Session initializer component
 * Resets backend state if this is a new browser session
 */
function SessionInitializer({ children }: { children: React.ReactNode }) {
  const { initialized, didReset } = useSessionInit(API_BASE);
  const queryClient = useQueryClient();
  
  // Invalidate all queries after backend reset to refresh UI
  useEffect(() => {
    if (didReset) {
      queryClient.invalidateQueries();
    }
  }, [didReset, queryClient]);
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionInitializer>
        <Toaster />
        <Sonner
          theme="dark"
          toastOptions={{
            style: {
              background: 'hsl(220, 25%, 8%)',
              border: '1px solid hsl(220, 20%, 18%)',
              color: 'hsl(210, 40%, 98%)',
            },
          }}
        />
        <BrowserRouter basename={basePath}>
          <Routes>
            {/* Landing Page - with transparent header */}
            <Route path="/" element={<Index />} />
            
            {/* Static Pages - with standard header */}
            <Route path="/about" element={
              <AppLayout>
                <AboutPage />
              </AppLayout>
            } />
            <Route path="/methods" element={
              <AppLayout>
                <MethodsPage />
              </AppLayout>
            } />
            <Route path="/publications" element={
              <AppLayout>
                <PublicationsPage />
              </AppLayout>
            } />
            <Route path="/explore" element={
              <AppLayout>
                <ExplorePage />
              </AppLayout>
            } />
            
            {/* App Routes with Dashboard Layout */}
            <Route
              path="/app"
              element={
                <DashboardLayout>
                  <Navigate to="/app/data" replace />
                </DashboardLayout>
              }
            />
            <Route
              path="/app/data"
              element={
                <DashboardLayout>
                  <DataImportPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/app/surface"
              element={
                <DashboardLayout>
                  <VolSurfacePage />
                </DashboardLayout>
              }
            />
            <Route
              path="/app/pricer"
              element={
                <DashboardLayout>
                  <PricerPage />
                </DashboardLayout>
              }
            />
            
            {/* 404 */}
            <Route path="*" element={
              <AppLayout showFooter={false}>
                <NotFound />
              </AppLayout>
            } />
          </Routes>
        </BrowserRouter>
      </SessionInitializer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;