
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  role?: string;
  phone?: string;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
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
  const location = useLocation();
  
  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth state changed: INITIAL_SESSION_CHECK");
        
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session ? "with session" : "without session");
            
            if (event === 'SIGNED_IN' && session) {
              // Use setTimeout to prevent potential deadlocks
              setTimeout(() => {
                fetchAndSetUserData(session);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setUser(null);
              setIsAuthenticated(false);
              setIsLoading(false);
            }
          }
        );
        
        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await fetchAndSetUserData(session);
        } else {
          setIsLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Helper function to fetch user data and set user state
  const fetchAndSetUserData = async (session) => {
    try {
      // Get user metadata from auth
      const { data: userMetadata } = await supabase.auth.getUser();
      
      if (userMetadata && userMetadata.user) {
        // Get additional profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userMetadata.user.id)
          .maybeSingle();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is the error for "no rows returned" - not a critical error
          console.error("Error fetching profile:", profileError);
        }
        
        const metadata = userMetadata.user.user_metadata;
        const firstName = profileData?.first_name || metadata?.first_name || '';
        const lastName = profileData?.last_name || metadata?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || userMetadata.user.email?.split('@')[0] || '';
        
        const userData: User = {
          id: userMetadata.user.id,
          name: fullName,
          firstName: firstName,
          lastName: lastName,
          email: profileData?.email || userMetadata.user.email || '',
          phone: profileData?.phone || metadata?.phone || '',
          birthDate: profileData?.birth_date || metadata?.birth_date || '',
          role: profileData?.role || metadata?.role || 'patient',
          token: session.access_token
        };
        
        console.log("User data fetched:", userData);
        
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Only redirect when coming from login or register pages
        // This prevents unwanted redirects when browsing the site
        const authPages = ['/login', '/register'];
        if (authPages.includes(location.pathname)) {
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
              break;
          }
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with email:", email);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing with login");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error.message);
        toast.error('Невалиден имейл или парола');
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        toast.success('Успешен вход!');
        // Auth state change listener will handle setting the user state
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Възникна грешка при вход');
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
        setIsLoading(false);
        return;
      }
      
      // Parse name into first_name and last_name if not provided directly
      let firstName = data.firstName;
      let lastName = data.lastName;
      
      if (!firstName && !lastName && data.name) {
        const nameParts = data.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      console.log("Registering with data:", {
        email: data.email,
        name: data.name,
        role: data.role || 'patient',
        firstName,
        lastName,
        phone: data.phone,
        birthDate: data.birthDate
      });
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing with registration");
      }
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: data.role || 'patient',
            phone: data.phone,
            birth_date: data.birthDate
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        toast.error(`Грешка при регистрация: ${error.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Registration successful:", authData);
      
      // If registration is successful, check if we need to manually create a profile
      if (authData?.user) {
        try {
          // Check if a profile already exists for this user
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
            
          if (!existingProfile) {
            // Create profile manually if trigger didn't work
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                first_name: firstName,
                last_name: lastName,
                email: data.email,
                phone: data.phone,
                birth_date: data.birthDate,
                role: data.role || 'patient'
              });
              
            if (profileError) {
              console.error("Error creating profile:", profileError);
            }
          }
        } catch (profileErr) {
          console.error("Error checking/creating profile:", profileErr);
        }
      }
      
      toast.success('Регистрацията е успешна. Моля, влезте в своя акаунт.');
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
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
        console.log("Global sign out failed, continuing with logout");
      }
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Always redirect to home page after logout
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
