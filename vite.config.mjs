import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// App KH là trang tĩnh (PWA) — Cloudflare dựng `npm run build` ra dist/. Gọi POS qua src/api.js.
// Dev: /api chuyển sang máy chủ POS chạy ở máy (3001) nếu có.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } },
})
