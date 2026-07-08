import type { APIRoute } from 'astro';

/**
 * robots.txt aus site + base generiert – bleibt beim Forken automatisch korrekt.
 * Hinweis: Auf GitHub-Pages-PROJEKTSEITEN (jungherz.github.io/<repo>/) liegt die
 * Datei nicht am Domain-Root und wird von Crawlern ignoriert; die Sitemap dann
 * per Search Console einreichen. Mit Custom Domain (base entfällt) greift sie.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const sitemapUrl = new URL(`${base}/sitemap-index.xml`, site);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
