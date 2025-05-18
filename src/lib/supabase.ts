import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'defined' : 'undefined',
  key: supabaseAnonKey ? 'defined' : 'undefined',
  isDev: import.meta.env.DEV
});

// Provide fallback values for development
const fallbackUrl = 'http://localhost:54321';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Use fallback values only in development
const url = import.meta.env.DEV && !supabaseUrl ? fallbackUrl : supabaseUrl;
const key = import.meta.env.DEV && !supabaseAnonKey ? fallbackKey : supabaseAnonKey;

if (!url || !key) {
  console.error('Missing Supabase configuration:', { url, key });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(url, key);