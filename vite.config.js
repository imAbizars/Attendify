import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ['stream', 'util', 'buffer', 'process'],
    }),
  ],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"./src"),
    }
  }
})
