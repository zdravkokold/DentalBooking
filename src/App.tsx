
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Appointments from "./pages/Appointments";
import Dentists from "./pages/Dentists";
import DentistDetail from "./pages/DentistDetail";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import DentistDashboard from "./pages/DentistDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { checkUpcomingAppointments } from "./services/notificationService";
import { toast } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          toast.error('Възникна грешка при заявката');
        }
      }
    },
    mutations: {
      retry: false,
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
          toast.error('Възникна грешка при обработката на данните');
        }
      }
    }
  }
});

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // For debugging
    console.log("App content rendered, auth state:", { user, isAuthenticated });

    // Проверка за предстоящи часове
    const checkAppointments = async () => {
      try {
        const mockAppointments = []; // Provide empty array as fallback
        await checkUpcomingAppointments(mockAppointments);
      } catch (error) {
        console.error("Failed to check upcoming appointments:", error);
      }
    };

    if (isAuthenticated) {
      checkAppointments();
    }
  }, [user, isAuthenticated]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes accessible by everyone */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/dentists" element={<Dentists />} />
        <Route path="/dentists/:id" element={<DentistDetail />} />
        <Route path="/services" element={<Services />} />
        
        {/* Protected routes with proper role-based access */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dentist" element={
          <ProtectedRoute allowedRoles={['dentist']}>
            <DentistDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
