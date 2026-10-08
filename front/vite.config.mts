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
    react({}),
    viteTsConfigPaths({
      root: "./",
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "HomeVentory",
        short_name: "HomeVentory",
        description: "Know what's in every box without opening it.",
        theme_color: "#15171c",
        background_color: "#15171c",
        icons: [
          {src: "/pwa-192.png", sizes: "192x192", type: "image/png"},
          {src: "/pwa-512.png", sizes: "512x512", type: "image/png"},
          {
            src: "/pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        protocol_handlers: [
          {
            protocol: "davidhomeventory",
            url: "/open-item/%s",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["react-is", "prop-types"],
  },
});
