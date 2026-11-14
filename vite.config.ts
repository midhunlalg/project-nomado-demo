import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://nomadoapi-fpe5b0cqcjhddsa8.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://nomadoapi-fpe5b0cqcjhddsa8.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
