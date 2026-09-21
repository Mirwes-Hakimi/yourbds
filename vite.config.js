import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // PERFORMANCE: put big third-party libraries in their own files.
        // Browsers cache these separately, so when we change our own code
        // (which happens often) returning visitors only re-download the small
        // app files, not React/Firebase/animation code that rarely changes.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react-vendor';
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
            return 'motion';
          }
          if (/node_modules\/(@firebase\/auth|firebase\/auth)\//.test(id)) {
            return 'firebase-auth';
          }
          return undefined;
        },
      },
    },
  },
});
