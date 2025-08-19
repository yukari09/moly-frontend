import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    css: true,
    env: {
      NODE_ENV: 'development'
    }
    // Vitest automatically loads .env.test in test mode
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})