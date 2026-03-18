import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Itt felsoroljuk a plusz ikonokat, amiket a képen látok:
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png'], 
      manifest: {
        name: 'TeaKeeper',
        short_name: 'TeaKeeper',
        description: 'A legjobb alkalmazás a teák szerelmeseinek',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'android-chrome-192x192.png', // PONTOSAN a te fájlneved
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png', // PONTOSAN a te fájlneved
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    allowedHosts: ['leonarda-hasteless-parallactically.ngrok-free.dev'],
  },
})