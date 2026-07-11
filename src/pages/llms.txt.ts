import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { siteName, defaultDescription, base, languages, defaultLang } from '../data/site';

/**
 * llms.txt (llmstxt.org) aus site + base + Blog-Collection generiert — bleibt
 * beim Forken automatisch korrekt. Realistische Erwartung: Die großen
 * AI-Suchcrawler (GPTBot, ClaudeBot, Google-Extended …) ignorieren die Datei
 * bislang und lesen direkt das HTML; zuverlässig genutzt wird sie von
 * KI-Assistenten, denen man die Site gibt (Claude Code, Cursor & Co.).
 * Kostet nichts, hilft dort — mehr nicht versprechen. Wie bei robots.txt:
 * Auf GitHub-Pages-PROJEKTSEITEN (…github.io/<repo>/) liegt die Datei nicht
 * am Domain-Root, wo Tools sie suchen; voll wirksam erst mit Custom Domain.
 *
 * „## Optional" ist ein reservierter Sektionsname der Spec (überspringbar
 * bei knappem Kontext) — Rechtsseiten und Sprachzweige gehören dorthin.
 */
export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(`${base}${path}`, site).href;

  // Kuratierte Kernseiten — die Notizen sind Copy, pro Projekt anpassen.
  const mainPages = [
    {
      path: '/',
      title: 'Startseite',
      note: 'Produkt, Funktionen, Preise, FAQ und Kontakt im Überblick (One-Pager, B2C und B2B)',
    },
    { path: '/blog/', title: 'Blog', note: 'Artikel und Praxis-Tipps' },
  ];

  const lines = [
    `# ${siteName}`,
    '',
    `> ${defaultDescription}`,
    '',
    '## Seiten',
    '',
    ...mainPages.map((p) => `- [${p.title}](${abs(p.path)}): ${p.note}`),
  ];

  // Blog-Block: bei Entfernung des Blogs mitsamt getCollection-Import löschen.
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  if (posts.length) {
    lines.push('', '## Blog-Artikel', '');
    lines.push(
      ...posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}`)
    );
  }

  lines.push(
    '',
    '## Optional',
    '',
    // Weitere Sprachzweige automatisch aus languages[] (Blog nur in der Default-Sprache)
    ...languages
      .filter((l) => l.code !== defaultLang)
      .map((l) => `- [${l.label}](${abs(`/${l.code}/`)})`),
    `- [Impressum](${abs('/impressum/')})`,
    `- [Datenschutz](${abs('/datenschutz/')})`,
    ''
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
