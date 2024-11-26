// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    applyBaseStyles: false
  })],
  vite: {
    plugins: [nodePolyfills()]
  }
});