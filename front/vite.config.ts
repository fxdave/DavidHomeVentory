import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

/**
 * Vite clears the console after executing this file,
 * but plugins can log messages
 */
const loggerPlugin = (function () {
  const queue: unknown[] = []
  const warn = (item: unknown) => queue.push(item)
  const poll = () => {
    // eslint-disable-next-line no-console
    while (queue.length > 0) console.warn(queue.pop())
  }
  const transform = () => loggerPlugin.poll()
  return { name: 'loggerPlugin', warn, poll, transform }
})()


let https = undefined
try {
  https = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem'),
  }
} catch(e) {
  loggerPlugin.warn("Please install a certificate, otherwise, you can't install the PWA");
  loggerPlugin.warn("With HTTP you can only use this from the browser");
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
    }),
    loggerPlugin
  ],
});
