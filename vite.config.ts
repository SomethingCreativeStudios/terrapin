import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '~abilities': resolve(__dirname, 'src/cards/models/abilities'),
      '~condition': resolve(__dirname, 'src/cards/models/condition'),
      '~effects': resolve(__dirname, 'src/cards/models/effects'),
      '~costs': resolve(__dirname, 'src/cards/models/costs'),
      '~watchers': resolve(__dirname, 'src/cards/models/watchers'),
      '~base-card': resolve(__dirname, 'src/cards/models/base.card.ts'),
      '~dialogs': resolve(__dirname, 'src/components/dialogs'),
    },
  },
});
