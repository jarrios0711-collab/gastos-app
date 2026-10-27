import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Permite funcionar en GitHub Pages o cualquier dominio
  plugins: [react()],
  server: {
    host: true, // Permite acceder desde el celular y otros dispositivos en la red
    port: 5173,
  },
})
