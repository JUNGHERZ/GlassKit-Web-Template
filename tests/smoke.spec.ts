import { test, expect } from '@playwright/test';

/**
 * Smoke-Tests — laufen im CI vor jedem Deploy (Job "test" in deploy.yml).
 * Prüft die manuelle Abnahme-Matrix: {dark, light} × {B2C, B2B} × {Desktop, 390 px},
 * No-JS-Fallbacks, Navigation von Unterseiten (base-Präfix) und Konsolenfehler.
 *
 * URLs sind bewusst RELATIV (ohne führenden Slash): baseURL in
 * playwright.config.ts endet auf den base-Pfad, absolute Pfade würden ihn verwerfen.
 *
 * reducedMotion 'reduce' ist global gesetzt (playwright.config.ts) — ohne diese
 * Emulation frieren klick-initiierte Navigationen wegen der Cross-Document
 * View Transitions in Headless-Chrome ein. Siehe SKILL.md §3.
 */

test.beforeEach(async ({ page }) => {
  // use.reducedMotion aus der Config kommt beim Fixture-Kontext nicht
  // zuverlässig an (beobachtet mit Playwright 1.61: matchMedia meldet false,
  // obwohl die Option im aufgelösten Projekt steht) — deshalb hier erzwungen.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const pages = [
  { path: '', name: 'Startseite' },
  { path: 'blog/', name: 'Blog-Übersicht' },
  { path: 'blog/papierkram-wochenende/', name: 'Blog-Artikel' },
  { path: 'impressum/', name: 'Impressum' },
  { path: 'datenschutz/', name: 'Datenschutz' },
  { path: 'en/', name: 'EN-Startseite' },
  { path: 'en/impressum/', name: 'EN-Imprint' },
  { path: 'en/datenschutz/', name: 'EN-Privacy' },
];

for (const p of pages) {
  test(`${p.name} rendert ohne Konsolenfehler`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));

    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const scheme of ['dark', 'light'] as const) {
  test(`Theme ${scheme}: B2C-Default und Umschalten auf B2B`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);

    // Default-Ansicht: B2C sichtbar, B2B versteckt
    await expect(page.locator('h1.only-b2c')).toBeVisible();
    await expect(page.locator('h1.only-b2b')).toBeHidden();

    await page.locator('[data-audience-btn="b2b"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-audience', 'b2b');
    await expect(page.locator('h1.only-b2b')).toBeVisible();
    await expect(page.locator('h1.only-b2c')).toBeHidden();
  });
}

test('Theme-Toggle wechselt das Farbschema', async ({ page }) => {
  await page.goto('');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.locator('#themeToggle').click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
  expect(['dark', 'light']).toContain(after);
});

test('Navigation: Startseite → Blog → Artikel → Anker von Unterseite', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Desktop-Nav ist mobil ausgeblendet');
  await page.goto('');

  await page.locator('.glw-nav a', { hasText: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);

  await page.locator('.glw-post-card h2 a').first().click();
  await expect(page.locator('.glw-article h1')).toBeVisible();
  await expect(page.locator('.glw-prose--article')).toBeVisible();

  // Anker-Link von der Unterseite zurück auf den One-Pager (muss base-sicher sein)
  await page.locator('.glw-nav a', { hasText: 'Preise' }).click();
  await expect(page).toHaveURL(/\/#preise$/);
  await expect(page.locator('#preise')).toBeVisible();
});

test('Mobile-Menü öffnet, navigiert und schließt', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile', 'Burger-Menü existiert nur mobil');
  await page.goto('');

  await page.locator('.glw-mobilenav__toggle').click();
  const blogLink = page.locator('.glw-mobilenav__panel a', { hasText: 'Blog' });
  await expect(blogLink).toBeVisible();

  await blogLink.click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.locator('.glw-mobilenav__panel a').first()).toBeHidden();
});

test('Sprach-Umschalter: DE → EN → DE', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');

  await page.locator('.glw-lang a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1.only-b2c')).toContainText('Your documents');

  await page.locator('.glw-lang a[lang="de"]').click();
  await expect(page).toHaveURL(String(test.info().project.use.baseURL));
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('Sprach-Umschalter erhält die Unterseite', async ({ page }) => {
  await page.goto('impressum/');
  await expect(page.locator('.glw-lang a[lang="en"]')).toHaveAttribute('href', /\/en\/impressum\/$/);
  await page.locator('.glw-lang a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/impressum\/$/);
  await expect(page.locator('h1')).toContainText('Imprint');
});

test('hreflang: Alternates auf übersetzten Seiten, keine im Blog', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

  await page.goto('blog/');
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  // Blog ist nicht übersetzt: der Umschalter fällt auf die EN-Startseite zurück
  await expect(page.locator('.glw-lang a[lang="en"]')).toHaveAttribute('href', /\/en\/$/);
});

test('EN: Anker-Navigation von Unterseite', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'Desktop-Nav ist mobil ausgeblendet');
  await page.goto('en/impressum/');
  await page.locator('.glw-nav a', { hasText: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/en\/#pricing$/);
  await expect(page.locator('#pricing')).toBeVisible();
});

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('B2C sichtbar, Reveals sichtbar, FAQ aufgeklappt', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('h1.only-b2c')).toBeVisible();
    await expect(page.locator('h1.only-b2b')).toBeHidden();
    // Ohne html.js darf nichts per Reveal-Opacity versteckt sein
    await expect(page.locator('.reveal').first()).toHaveCSS('opacity', '1');
    // FAQ-Antworten sind ohne JS vollständig ausgeklappt
    await expect(page.locator('.glass-accordion__content').first()).toBeVisible();
  });
});

test('RSS-Feed und Sitemap sind erreichbar', async ({ request }) => {
  const rss = await request.get('rss.xml');
  expect(rss.status()).toBe(200);
  expect(await rss.text()).toContain('<rss');

  const sitemap = await request.get('sitemap-index.xml');
  expect(sitemap.status()).toBe(200);
});

test('Unbekannte URL liefert die 404-Seite', async ({ page }) => {
  const res = await page.goto('diese-seite-gibt-es-nicht/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1').first()).toBeVisible();
});
