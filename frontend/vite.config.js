import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'कृषीवृंदा — शेतकरी, व्यापारी, कामगार',
        short_name: 'कृषीवृंदा',
        description: 'महाराष्ट्राचे शेतकरी, व्यापारी आणि कामगार यांना एकत्र आणणारे डिजिटल व्यासपीठ',
        theme_color: '#2e7d32',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'mr',
        dir: 'ltr',
        scope: '/',
        start_url: '/',
        categories: ['business', 'productivity', 'agriculture'],
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'माझी पिके',
            short_name: 'पिके',
            description: 'माझी पिके पहा',
            url: '/farmer',
            icons: [{ src: '/icon.svg', sizes: '192x192' }]
          },
          {
            name: 'बाजार भाव',
            short_name: 'बाजार',
            description: 'मंडीतील ताजे दर',
            url: '/farmer',
            icons: [{ src: '/icon.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https?:\/\/localhost:5000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false,
        type: 'module'
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});