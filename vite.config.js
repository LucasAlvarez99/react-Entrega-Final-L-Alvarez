import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones de build
  build: {
    // Tamaño máximo de chunk
    chunkSizeWarningLimit: 1000,
    
    // Dividir código en chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap-vendor': ['react-bootstrap', 'bootstrap'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/storage']
        }
      }
    },
    
    // Minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true
      }
    }
  },
  
  // Optimizaciones de desarrollo
  server: {
    port: 3000,
    open: true
  },
  
  // Pre-bundling de dependencias
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