import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/zoho-signature-generator/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser'
  },
  server: {
    port: 5173,
    open: false
  }
});
