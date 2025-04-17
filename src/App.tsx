
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

// Configure a new query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Add retry: false to prevent excessive API calls when errors occur
      retry: false,
      // Add error handling for debugging
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
    mutations: {
      // Add error handling for debugging
      onError: (error) => {
        console.error("Mutation error:", error);
      }
    }
  }
});

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // For debugging
    console.log("App content rendered, auth state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/dentists" element={<Dentists />} />
        <Route path="/dentists/:id" element={<DentistDetail />} />
        <Route path="/services" element={<Services />} />
        
        {/* All dashboards accessible for demo */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dentist" element={<DentistDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        
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
