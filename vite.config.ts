import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  // Vercel and other providers inject env vars into process.env.
  // We check both the loaded .env content and the actual process environment.
  // Fallback to the hardcoded key if no environment variable is present.
  const apiKey = env.API_KEY || process.env.API_KEY || 'AIzaSyAl2v_WEWEcOjWjhTRaQLEqXCwh8jshYtg';

  return {
    plugins: [react()],
    define: {
      // Expose the API_KEY environment variable to the client code.
      // We JSON.stringify the value to ensure it's treated as a string literal in the client.
      // Fallback to empty string prevents 'undefined' reference errors.
      'process.env.API_KEY': JSON.stringify(apiKey),
      
      // Safety polyfill to prevent "ReferenceError: process is not defined"
      // if any code inadvertently accesses process.env without a specific key.
      'process.env': JSON.stringify({}),
    },
  };
});