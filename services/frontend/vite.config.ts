import { defineConfig } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: "./src/routeTree.gen.ts",
      quoteStyle: "double",
      routesDirectory: "./src/app/routes",
      target: "react",
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      "/api/": {
        target: process.env["API_PROXY_TARGET"] ?? "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
})
