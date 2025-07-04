import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build", // CRA's default build output
  },
  define: {
    // This prevents any stray process.env references from causing errors
    "process.env": {},
  },
});
