import { defineConfig } from 'vite';
import path from 'path';
import sass from 'vite-plugin-sass'; // Use default import

export default defineConfig({
  plugins: [
    sass(),
  ],
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '@bootstrap': path.resolve(__dirname, 'node_modules/bootstrap/scss'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
});