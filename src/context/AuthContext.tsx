
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'admin' | 'dentist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          // Fetch user profile from our profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError || !profile) {
            console.error('Failed to fetch profile:', profileError);
            setIsLoading(false);
            return;
          }
          
          const authenticatedUser = {
            id: session.user.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole,
            token: session.access_token,
          };
          
          setUser(authenticatedUser);
        } catch (error) {
          console.error('Failed to parse session:', error);
          await supabase.auth.signOut();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile from our profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError || !profile) {
            console.error('Failed to fetch profile:', profileError);
            setIsLoading(false);
            return;
          }
          
          const authenticatedUser = {
            id: session.user.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole,
            token: session.access_token,
          };
          
          setUser(authenticatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (!data.session) {
        toast.error('No session returned after login');
        throw new Error('No session returned after login');
      }

      // Navigation will happen automatically via the onAuthStateChange listener
      toast.success('Успешен вход');
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.name.split(' ')[0] || '',
            last_name: userData.name.split(' ').slice(1).join(' ') || '',
            role: userData.role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Регистрацията е успешна!');
      // Return void instead of data to match the function signature
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
