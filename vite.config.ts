import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = process.env;
  
  // Log configuration for debugging
  console.log('Mode:', mode);
  console.log('Environment variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'defined' : 'undefined',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'defined' : 'undefined'
  });

  return {
    server: {
      port: 3000,
      open: true,
      host: true // Allow connections from network
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Add better error overlay
    build: {
      sourcemap: true,
    },
    // Ensure environment variables are loaded
    envDir: '.',
  };
});
