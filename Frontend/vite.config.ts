import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // falha na hora se a porta estiver ocupada, em vez de trocar de porta e quebrar o CORS
    strictPort: true,
  },
})
