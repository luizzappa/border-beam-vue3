import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/border-beam-vue3/',
  resolve: {
    alias: {
      'animated-border-beam-vue3': resolve(__dirname, '../src/index.ts'),
    },
  },
});
