import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import devtoolBreakpoints from "astro-devtool-breakpoints";


export default defineConfig({
  site: 'https://lexingtonthemes.com',
  integrations: [tailwind(), sitemap(), devtoolBreakpoints()]
});