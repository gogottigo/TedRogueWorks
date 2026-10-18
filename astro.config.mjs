import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './site.config.mjs';
import accessibleCode from './scripts/accessible-code.mjs';

export default defineConfig({
  site: siteConfig.url,
  base: '/',
  output: 'static',
  markdown: { shikiConfig: { transformers: [accessibleCode] } },
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
