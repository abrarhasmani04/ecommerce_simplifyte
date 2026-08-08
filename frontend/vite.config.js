import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://192.168.0.181:5000",
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        proxyTimeout: 30000,
        headers: { connection: "keep-alive" },
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Backend unreachable" }));
            }
          });
        },
      },
    },
  },
});