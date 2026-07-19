import type { APIRoute } from 'astro';

/**
 * robots.txt aus site + base generiert – bleibt beim Forken automatisch korrekt.
 * Hinweis: Crawler lesen nur die Datei am Domain-Root. Liegt die Site unter
 * einem base-Pfad (die Demo unter /demo/, Projektseiten unter /<repo>/), wird
 * diese Datei ignoriert — im GlassKit-Web-Repo liefert site/robots.txt die
 * Root-Version. In abgeleiteten Projekten mit Custom Domain (base entfällt)
 * greift sie direkt.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const sitemapUrl = new URL(`${base}/sitemap-index.xml`, site);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
