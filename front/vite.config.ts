import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'


let https = undefined
try {
  https = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem'),
  }
} catch(e) {
  console.warn("Please install a certificate, otherwise, you can't install the PWA");
  console.warn("With HTTP you can only use this from the browser");
}

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    https,
  },
  plugins: [
    react(),
    viteTsConfigPaths({
      root: './',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    })
  ],
});
