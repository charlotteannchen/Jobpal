// FILE: vitest.config.js

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
  },
  resolve: {
    alias: {
      'contexts': path.resolve(__dirname, './src/contexts'),
      'assets': path.resolve(__dirname, './src/assets'),
      'utils': path.resolve(__dirname, './src/utils'),
      'ui-component': path.resolve(__dirname, './src/ui-component'),
      'views': path.resolve(__dirname, './src/views'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'layout': path.resolve(__dirname, './src/layout'),
      'store': path.resolve(__dirname, './src/store'),
      // Add other aliases as needed
    },
  },
});