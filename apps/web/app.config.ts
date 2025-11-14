import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
  deployment: {
    // Cloudflare Workers deployment configuration
    preset: 'cloudflare-workers',
  },
  server: {
    // Cloudflare Workers preset
    preset: 'cloudflare-module',

    // Polyfills for Node.js APIs
    unenv: {
      polyfills: {
        Buffer: true,
        process: true,
      },
    },

    // Rollup configuration
    rollupConfig: {
      external: ['node:async_hooks'],
    },
  },
})
