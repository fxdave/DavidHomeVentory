import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://back:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    viteTsConfigPaths({
      root: "./",
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        protocol_handlers: [
          {
            protocol: "davidhomeventory",
            url: "/open-item/%s",
          },
        ],
      },
    }),
  ],
});
