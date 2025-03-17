import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { turboStoplight } from '@turbo-stoplight/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), turboStoplight({ port: 4000 })],
});
