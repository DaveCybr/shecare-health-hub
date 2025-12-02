import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ✅ PROXY: Forward semua request /api/* ke http://localhost
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost",
        changeOrigin: true,
        secure: false,
        // Jangan rewrite path, biarkan /api/auth/login tetap /api/auth/login
        rewrite: (path) => path,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
