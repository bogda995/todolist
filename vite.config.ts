import { defineConfig } from 'vite';
import sassPlugin from 'vite-plugin-sass'; // Use default import

export default defineConfig({
  plugins: [
    sassPlugin(),
  ],
});