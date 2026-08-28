import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "static-site",
  base: "/",
  publicDir: "../public",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"]
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
