import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog (Opt-in). Artikel als Markdown in src/content/blog/.
 * Zum Entfernen des Blogs: diesen Ordner, src/pages/blog/,
 * src/pages/rss.xml.ts und die Blog-Links in SiteHeader/SiteFooter löschen.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('LUMEN Team'),
  }),
});

export const collections = { blog };
