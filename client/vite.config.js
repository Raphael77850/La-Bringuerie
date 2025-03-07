import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.MP4", "**/*.mp4", "**/*.Mp4"],
  server: {
    port: 3000, // Spécifie explicitement le port 3000
    proxy: {
      "/api": {
        target: "http://localhost:3310",
        changeOrigin: true,
      },
    },
  },
});
