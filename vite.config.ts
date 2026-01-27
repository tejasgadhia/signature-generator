import { defineConfig } from 'vitest/config';
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
    minify: 'terser',
    // Let Vite handle code splitting automatically - no manual chunks
  },
  server: {
    port: 5173,
    open: false // Don't auto-open browser
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
