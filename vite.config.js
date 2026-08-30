import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function developmentStaticRoutes() {
  let developmentServer;
  const rendererModulePath = `/@fs/${path.resolve("server", "render-route.jsx").replaceAll("\\", "/")}`;
  return {
    name: "wly-development-static-routes",
    apply: "serve",
    configureServer(server) {
      developmentServer = server;
    },
    async transformIndexHtml(html, context) {
      if (!developmentServer) return html;
      const request = new URL(context.originalUrl || context.path || "/", "http://local.invalid");
      const renderer = await developmentServer.ssrLoadModule(rendererModulePath);
      return renderer.renderDocument(html, request.pathname, request.search);
    }
  };
}

export default defineConfig({
  root: "static-site",
  base: "/",
  publicDir: "../public",
  plugins: [react(), developmentStaticRoutes()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"]
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    modulePreload: { polyfill: false }
  }
});
