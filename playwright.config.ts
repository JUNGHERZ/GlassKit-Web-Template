import { defineConfig, devices } from '@playwright/test';
// base kommt direkt aus der Astro-Config — bei Fork/Custom Domain muss hier nichts angepasst werden.
import astroConfig from './astro.config.mjs';

const base = (astroConfig.base ?? '').replace(/\/+$/, '');
const port = 4321;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Trailing Slash ist Absicht: Test-URLs werden RELATIV angegeben
    // (page.goto('blog/')), damit der base-Pfad erhalten bleibt —
    // absolute Pfade ('/blog/') würden ihn verwerfen.
    baseURL: `http://localhost:${port}${base}/`,
    // PFLICHT: Cross-Document View Transitions (@view-transition) frieren
    // Headless-Chrome bei klick-initiierten Navigationen ein. reducedMotion
    // greift unseren navigation:none-Override. Siehe SKILL.md §3.
    // Achtung: Beim Fixture-Kontext kommt diese Option nicht zuverlässig an
    // (Playwright 1.61) — tests/smoke.spec.ts erzwingt sie zusätzlich per
    // beforeEach mit page.emulateMedia().
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    // Immer frisch bauen: ein laufender Preview-Server hält sonst den
    // gelöschten dist-Inode eines früheren Builds und serviert stale Inhalte.
    command: 'npm run build && npm run preview',
    url: `http://localhost:${port}${base}/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
