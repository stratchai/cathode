import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Dev server — serves the demo app
export default defineConfig({
  plugins: [vue()],
  root: '.',
})
