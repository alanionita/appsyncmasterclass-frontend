import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'buffer',
    ],
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'appsyncmasterclass-frontend',
        short_name: 'appsyncmasterclass-frontend',
        description: 'Vue v3 + AWS AppSync app clone of former Twitter',
        theme_color: '#4DBA87',
        "start_url": ".",
  "display": "standalone",
  "background_color": "#000000",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      './runtimeConfig': path.resolve(__dirname, './runtimeConfig.browser')
    },
  },
})
