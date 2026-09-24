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
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || "/", "http://local.invalid").pathname;
        const match = /^\/search-(index|projects|project-([a-z0-9-]+))\.js$/.exec(pathname);
        if (!match) return next();
        try {
          const renderer = await server.ssrLoadModule(rendererModulePath);
          const asset = match[1] === "index" ? renderer.compactSearchAsset
            : match[1] === "projects" ? renderer.compactProjectSearchAsset
              : renderer.compactProjectSearchAssets[match[2]];
          if (!asset) return next();
          response.setHeader("Content-Type", "application/javascript; charset=utf-8");
          response.setHeader("Cache-Control", "no-store");
          response.end(asset);
        } catch (error) {
          next(error);
        }
      });
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
