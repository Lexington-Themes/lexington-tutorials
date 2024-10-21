import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import tailwindcss from '@tailwindcss/vite';
import devtoolBreakpoints from "astro-devtool-breakpoints";
export default defineConfig({
   vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://tutorials.lexingtonthemes.com',
  integrations: [ sitemap(), devtoolBreakpoints()]
});