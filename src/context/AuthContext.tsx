
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
  birthDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth state changed: INITIAL_SESSION");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userMetadata } = await supabase.auth.getUser();
          
          if (userMetadata && userMetadata.user) {
            const metadata = userMetadata.user.user_metadata;
            const userData: User = {
              id: userMetadata.user.id,
              name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || userMetadata.user.email?.split('@')[0],
              email: userMetadata.user.email || '',
              role: metadata.role || 'patient',
              token: session.access_token
            };
            
            console.log("Auth state changed: SIGNED_IN");
            console.log("User signed in:", userData);
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log("Mock user set:", userData);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          const { data: userMetadata } = await supabase.auth.getUser();
          
          if (userMetadata && userMetadata.user) {
            const metadata = userMetadata.user.user_metadata;
            const userData: User = {
              id: userMetadata.user.id,
              name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || userMetadata.user.email?.split('@')[0],
              email: userMetadata.user.email || '',
              role: metadata.role || 'patient',
              token: session.access_token
            };
            
            console.log("User signed in:", userData);
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log("Mock user set:", userData);
            
            // Redirect based on role
            switch (userData.role) {
              case 'admin':
                navigate('/admin');
                break;
              case 'dentist':
                navigate('/dentist');
                break;
              case 'patient':
                navigate('/patient');
                break;
              default:
                navigate('/');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error('Невалиден имейл или парола');
        console.error("Login error:", error.message);
        return;
      }

      if (data.user) {
        const metadata = data.user.user_metadata;
        const userData: User = {
          id: data.user.id,
          name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || data.user.email?.split('@')[0],
          email: data.user.email || '',
          role: metadata.role || 'patient',
          token: data.session?.access_token
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirect based on role
        switch (userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'dentist':
            navigate('/dentist');
            break;
          case 'patient':
            navigate('/patient');
            break;
          default:
            navigate('/');
        }
        
        toast.success('Успешен вход!');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Възникна грешка при вход');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      
      // Validate confirm password
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        toast.error('Паролите не съвпадат');
        return;
      }
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role || 'patient',
            phone: data.phone,
            birthDate: data.birthDate
          }
        }
      });

      if (error) {
        toast.error(`Грешка при регистрация: ${error.message}`);
        return;
      }

      toast.success('Регистрацията е успешна. Моля, проверете имейла си за потвърждение.');
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      toast.error('Възникна грешка при регистрация');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(`Грешка при изход: ${error.message}`);
        return;
      }
      
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
      toast.success('Успешен изход от системата');
    } catch (err) {
      console.error("Logout error:", err);
      toast.error('Възникна грешка при изход от системата');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
