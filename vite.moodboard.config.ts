import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Static export for 9mirrors project hub (see 9mirrors-website/scripts/sync-formless-hub.sh). */
export default defineConfig({
  base: process.env.MOODBOARD_BASE ?? "/project-hub/eyesclosed/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-moodboard",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "moodboard.html"),
    },
  },
});
