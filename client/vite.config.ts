import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.MP4", "**/*.mp4", "**/*.Mp4"],
  build: {
    sourcemap: false, // Désactive les sourcemaps en production
    chunkSizeWarningLimit: 1000, // Augmente la limite de warning
    rollupOptions: {
      output: {
        manualChunks: {
          // Sépare React dans un chunk séparé
          "react-vendor": ["react", "react-dom"],
          // Sépare axios dans un chunk séparé
          "axios-vendor": ["axios"],
        },
      },
    },
  },
  server: {
    port: 3002, // Port libre disponible
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
