// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Projekt-Page unter https://jungherz.github.io/GlassKit-Web-Template/
// Bei eigenem Repo-Namen: base anpassen. Bei Custom Domain: base entfernen,
// site auf die Domain setzen und public/CNAME anlegen.
export default defineConfig({
  site: 'https://jungherz.github.io',
  base: '/GlassKit-Web-Template',
  integrations: [sitemap()],
});
