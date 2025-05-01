
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cderjmgzevihejhtuprk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZXJqbWd6ZXZpaGVqaHR1cHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDA3NzEsImV4cCI6MjA1OTc3Njc3MX0.lWUEDS1YwyOPHlGkYP4Ag-ezbLGA4vThphqpLBam1jk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
