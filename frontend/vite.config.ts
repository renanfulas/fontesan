import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const backendProxyTarget = process.env.VITE_BACKEND_PROXY_TARGET ?? "http://127.0.0.1:8765";

// Site estático puro (sem SSR): builda para dist/ e é servido pelo Nginx
// no mesmo domínio do backend, same-origin, igual ao site/ da Fontesan.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: {
      "/web": { target: backendProxyTarget, changeOrigin: true },
      "/internal": { target: backendProxyTarget, changeOrigin: true },
    },
  },
});
