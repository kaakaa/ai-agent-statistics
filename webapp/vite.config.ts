import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/ai-agent-statistics/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/react'],
  },
})
