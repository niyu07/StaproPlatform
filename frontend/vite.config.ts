import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Dockerコンテナ内で外部からアクセス可能にする
    port: 5173,
    watch: {
      usePolling: true, // Docker環境でファイル変更を検知するためにポーリングを使用
    },
    hmr: {
      host: "localhost", // HMR用のホスト設定
      port: 5173,
    },
  },
});
