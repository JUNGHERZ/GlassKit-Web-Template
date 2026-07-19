// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Die LUMEN-Demo läuft unter https://glasskit-web.jungherz.com/demo/ neben der
// Produkt-Landing-Page (site/). In abgeleiteten Projekten: site auf die eigene
// Domain setzen, base entfernen und public/CNAME anlegen — bzw. für eine
// GitHub-Pages-Projektseite base auf '/<repo-name>' setzen.
export default defineConfig({
  site: 'https://glasskit-web.jungherz.com',
  base: '/demo/',
  // Mehrsprachigkeit (Opt-in): Default-Sprache liegt an der Wurzel, weitere
  // Sprachen unter /<code>/. Muss mit `languages` in src/data/site.ts
  // übereinstimmen. Einsprachige Projekte: i18n-Block + sitemap-i18n entfernen.
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'de', locales: { de: 'de', en: 'en' } },
    }),
  ],
});
