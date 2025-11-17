import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      dayjs: path.resolve(__dirname, "src/src/lib/dayjs.ts"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
