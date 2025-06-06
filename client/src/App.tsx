
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import StoreRegister from "./pages/StoreRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StoreLogin from "./pages/StoreLogin";
import StoreDashboard from "./pages/StoreDashboard";
import StoreSubscription from "./pages/StoreSubscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas do admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.type !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para proteger rotas da loja
const ProtectedStoreRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.type !== 'store') {
    return <Navigate to={window.location.pathname.replace('/dashboard', '/login')} replace />;
  }
  
  return <>{children}</>;
};

// Componente para redirecionar se já estiver logado
const GuestRoute = ({ children, redirectTo }: { children: React.ReactNode; redirectTo: string }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />
      
      {/* Store Registration */}
      <Route path="/store/register" element={<StoreRegister />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/login" 
        element={
          <GuestRoute redirectTo="/admin">
            <AdminLogin />
          </GuestRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } 
      />
      
      {/* Store Routes */}
      <Route 
        path="/store/:slug/login" 
        element={<StoreLogin />} 
      />
      <Route 
        path="/store/:slug/dashboard" 
        element={
          <ProtectedStoreRoute>
            <StoreDashboard />
          </ProtectedStoreRoute>
        } 
      />
      <Route 
        path="/store/:slug/subscription" 
        element={
          <ProtectedStoreRoute>
            <StoreSubscription />
          </ProtectedStoreRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
