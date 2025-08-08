import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { base_url as base } from './config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
})
