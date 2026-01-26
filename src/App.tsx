import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;