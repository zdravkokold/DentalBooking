
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
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { checkUpcomingAppointments } from "./services/notificationService";

// Sample appointment data for demo purposes - replace with actual API call
const sampleAppointments = [
  {
    id: "1",
    patientId: "p1",
    dentistId: "d1",
    serviceId: "s1",
    date: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(), // Today in 2 hours
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled" as const
  },
  {
    id: "2",
    patientId: "p1",
    dentistId: "d2",
    serviceId: "s2",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    startTime: "10:30",
    endTime: "11:15",
    status: "scheduled" as const
  }
];

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Check for upcoming appointments when the app loads
    // In a real app, you would fetch this from your API
    setTimeout(() => {
      checkUpcomingAppointments(sampleAppointments);
    }, 3000); // Show notification after 3 seconds for demo purposes
  }, []);

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
        
        {/* Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dentist" 
          element={
            <ProtectedRoute allowedRoles={['dentist']}>
              <DentistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
