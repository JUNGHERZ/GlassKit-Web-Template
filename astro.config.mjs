// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Projekt-Page unter https://jungherz.github.io/GlassKit-Web-Template/
// Bei eigenem Repo-Namen: base anpassen. Bei Custom Domain: base entfernen,
// site auf die Domain setzen und public/CNAME anlegen.
export default defineConfig({
  site: 'https://jungherz.github.io',
  base: '/GlassKit-Web-Template',
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
