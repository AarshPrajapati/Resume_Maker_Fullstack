import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase/app') || id.includes('firebase/auth')) {
              return 'firebase';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'ui-libs';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
