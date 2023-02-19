import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression()],
  server: {
    port: 3000,
    proxy: {
      "/v1/": "localhost:8080/",
    },
  },
  build: {
    outDir: "./backend/dist",
    manifest: true,
  },
});
