import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    image: {
    service: passthroughImageService(),
  },
   vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://tutorials.lexingtonthemes.com',
  integrations: [ sitemap()]
});
