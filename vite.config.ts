import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // TODO: [ticketID] Route all '/api' endpoints directly to the running Express Node server port
      '/api': {
        target: 'http://localhost:3000', // Đảm bảo khớp port 3000 giống như trong ảnh log Backend của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
