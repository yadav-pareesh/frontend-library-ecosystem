import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages deploys to /frontend-library-ecosystem/ — use './' for relative asset paths
  // so the same build works both at the root and in a subdirectory.
  base: './',
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    // Generate sourcemaps for production debugging
    sourcemap: false,
    // Raise chunk size warning threshold to reduce noise for this large app
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split vendor code from app code for better long-term caching
        manualChunks: {
          react: ['react', 'react-dom'],
        }
      }
    }
  }
});
