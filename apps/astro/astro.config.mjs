import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.daydev.studio',
  output: 'server',
  adapter: vercel({
    maxDuration: 30
  }),
  integrations: [react(), sitemap({
    filter: (page) => !page.includes('/admin/')
  })],
session: {
    driver: "lruCache",
    options: {
      max: 800
    },
    ttlMs: 7 * 24 * 60 * 60 * 1000
  },
  vite: {
    plugins: [tailwindcss()],
    // Baca satu sumber env global di root monorepo (.env).
    envDir: "../.."
  }
});