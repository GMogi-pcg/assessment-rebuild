import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: 'client', // Set the root directory to 'client'
  build: {
    outDir: '../dist', // Place the build output in a folder accessible by Cloudflare Pages
  },
})
