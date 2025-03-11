import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
   vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://tutorials.lexingtonthemes.com',
  integrations: [ sitemap()]
});