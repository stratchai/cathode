import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Library build — emits dist/cathode.js + dist/cathode.umd.cjs + dist/cathode.css
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry:   resolve(__dirname, 'src/index.ts'),
      name:    'Cathode',
      fileName: 'cathode',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals:       { vue: 'Vue' },
        assetFileNames: 'cathode.css',
      },
    },
  },
})
