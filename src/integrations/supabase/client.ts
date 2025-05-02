
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cderjmgzevihejhtuprk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZXJqbWd6ZXZpaGVqaHR1cHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDA3NzEsImV4cCI6MjA1OTc3Njc3MX0.lWUEDS1YwyOPHlGkYP4Ag-ezbLGA4vThphqpLBam1jk";

// Database types
export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          date: string;
          time: string;
          created_at: string;
          updated_at: string;
          id: string;
          patient_id: string;
          dentist_id: string;
          service_id: string;
          status?: string;
          notes?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at?: string;
          birth_date?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          role?: string;
          email?: string;
          health_status?: string;
          address?: string;
        };
      };
      services: {
        Row: {
          id: string;
          duration: number;
          price: number;
          created_at: string;
          updated_at: string;
          name: string;
          description?: string;
        };
      };
      // Add other tables as needed
    };
  };
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    detectSessionInUrl: true,
  }
});

// Add debug logging to help identify any authentication issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event, session ? 'Session exists' : 'No session');
});
