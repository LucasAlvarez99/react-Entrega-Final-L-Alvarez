import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap-vendor': ['react-bootstrap', 'bootstrap'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/storage']
        }
      }
    },
    
   
    minify: 'esbuild',
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react-bootstrap',
      'firebase/app',
      'firebase/firestore',
      'firebase/storage'
    ]
  }
})