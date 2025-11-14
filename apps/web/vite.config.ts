import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Backend workspace dependency
      'backend': path.resolve(__dirname, '../../packages/backend'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_CONVEX_SITE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  plugins: [
    cloudflare({
      // Cloudflare Workers integration for TanStack Start
      persistState: true,
    }),
    tailwindcss(),
    viteReact(),
  ],
})
