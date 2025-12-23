import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // Resolution Order:
  // 1. VITE_API_KEY (Standard Vite Env Var)
  // 2. API_KEY (Vercel Server Env Var available at build time)
  // 3. process.env.API_KEY (Node process fallback)
  // 4. Hardcoded Fallback
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.API_KEY || 'AIzaSyDAh_JZOPwNG8cQw4ATw2gh68z5OhNJIko';

  return {
    plugins: [react()],
    define: {
      // Safely expose the key to client-side code
      'process.env.API_KEY': JSON.stringify(apiKey),
      
      // Polyfill process.env to avoid "process is not defined" errors in browser
      // We do this AFTER the specific replacement above is registered by Vite
      'process.env': JSON.stringify({}),
    },
  };
});