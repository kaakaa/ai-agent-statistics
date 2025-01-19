import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/ai-agent-statistics/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
