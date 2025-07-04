import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Vercel expects dist directory
  },
  define: {
    // This prevents any stray process.env references from causing errors
    "process.env": {},
  },
});
