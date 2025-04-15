
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'dentist' | 'patient'>;
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has an allowed role
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // If user doesn't have an allowed role, redirect to appropriate dashboard
  if (user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'dentist':
        return <Navigate to="/dentist" replace />;
      case 'patient':
        return <Navigate to="/patient" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Fallback to home page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
