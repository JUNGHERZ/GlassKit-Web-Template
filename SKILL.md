---
name: glasskit-web-template
description: AI reference for the GlassKit-Web-Template — an Astro starter for glassmorphism marketing sites that address B2C and B2B audiences from one codebase. Use this whenever building a new website from this template or converting an existing site to it. For GlassKit component markup (glass-* classes), always consult the GlassKit SKILL.md as well.
---

# GlassKit-Web-Template – AI Reference

Astro 5 starter for marketing/landing websites in the GlassKit design language
(glassmorphism, dark/light, orange primary). One codebase serves **two audiences**
(B2C and B2B) via a runtime switch. Demo brand "LUMEN" — every piece of copy is a
placeholder meant to be replaced per project.

**Layering — know which reference to use:**

| Layer | Prefix | Source | Reference |
|---|---|---|---|
| Design tokens + UI components | `glass-*`, `--gl-*` | npm `@jungherz-de/glasskit` (never edit) | [GlassKit SKILL.md](https://github.com/JUNGHERZ/GlassKit/blob/main/SKILL.md) |
| Site/section layer (this repo) | `glw-*` | `src/styles/site.css` | this file |

## 1. File Responsibilities

```
astro.config.mjs        site + base. Fork → change base to '/<repo-name>'.
                        Custom domain → remove base, set site, add public/CNAME.
src/data/site.ts        siteName, titles, repoUrl + base/href() link helper.
src/styles/site.css     ALL custom CSS (global). glw-* classes, --gl-* tokens only.
src/styles/brand.css    Per-project brand overrides (--gl-* tokens ONLY, loads last).
                        This is THE place for client colors — never edit glasskit.css
                        or recolor glw rules. Ships with commented example themes.
src/scripts/site.js     Behavior: theme toggle, audience switch, reveal, tilt.
                        Progressive enhancement — pages must work without it.
src/layouts/BaseLayout.astro  <head>, CSS imports (GlassKit BEFORE site.css),
                        bootstrap <script is:inline>, glass-bg wrapper, header/footer.
src/components/*.astro  One file per section. Copy lives HERE, next to its markup.
                        Repeated structures (features, stats, plans) are frontmatter
                        const arrays rendered with .map().
src/pages/*.astro       File routing. index.astro composes the one-pager.
                        404.astro → dist/404.html (served by GitHub Pages).
src/content.config.ts   Blog collection schema (title, description, pubDate, author).
src/content/blog/*.md   Blog posts (Markdown). OPT-IN feature — see removal note below.
src/pages/blog/         index.astro (overview) + [slug].astro (article via glw-prose).
src/pages/rss.xml.ts    RSS feed from the blog collection (base-safe links).
src/pages/robots.txt.ts Generates robots.txt from site+base (fork-safe).
                        Note: ignored by crawlers on github.io/<repo>/ project
                        pages (not at domain root); effective with custom domain.
public/og.png           Social preview image (1200×630) — replace per project.
```

## 2. Section Catalog (compose in `src/pages/index.astro`)

| Component | Purpose | Notes |
|---|---|---|
| `SiteHeader` | Fixed glass nav: brand, anchors, theme toggle, CTA, mobile menu | Rendered by BaseLayout. Nav links exist TWICE: desktop `.glw-nav` and the `<details id="mobileNav">` overlay panel — always update both. Mobile menu opens/closes natively without JS (details/summary); site.js adds focus trap, ESC, scroll lock |
| `Hero` | Audience switch + headline pair + CTAs + decorative device panel | The device panel is a mini component showcase (aria-hidden); swap its content to match the product |
| `LogoStrip` | Social proof wordmarks | Text-only, styled via `glw-wordmark--*` variants |
| `Features` | 3-column glass card grid | Edit the `features[]` array (icon = inline outline SVG string, 24 viewBox) |
| `Process` | Numbered how-it-works steps | `steps[]` array; numbering is honest here (real sequence) — don't add numbers to non-sequential sections |
| `Showcase` | 3D-tilted "spatial" glass window (visionOS look) | Decorative; tilt via `#tiltWindow` in site.js |
| `Stats` | 4 KPI figures, typographic | `stats[]` array; keep `tabular-nums` styling |
| `Cases` | Success stories / references | `cases[]` array: metric (gradient number) + label + text + client name |
| `Team` | People grid with initials avatars | `team[]` array; no photos in the template — replace avatars per project or drop the section |
| `Pricing` | Two plan grids, one per audience | `plansB2C[]` / `plansB2B[]`; `hot: true` highlights one plan |
| `Quote` | Serif testimonial, one per audience | Paired `.only-b2c` / `.only-b2b` blocks |
| `Faq` | GlassKit accordion + FAQPage JSON-LD | Edit the `faqs[]` array; `audience: 'b2c'\|'b2b'` marks audience-specific questions. JSON-LD mirrors the default (no-JS) view: general + B2C only. Toggle handled by site.js; without JS all answers render expanded |
| `Contact` | Contact form (`id="kontakt"` — nav/footer link here) | Endpoint configured in `site.ts` (`contactForm`); empty endpoint = demo mode. Honeypot field `botcheck`, required consent checkbox linking to `/datenschutz/`, B2B-only company field. With JS: fetch + inline `glass-status`; without JS: native POST to the endpoint |
| `CtaBanner` | Closing call-to-action panel | Warm border (`--gl-border-warm`) |
| `SiteFooter` | Link columns, newsletter dummy, legal links | Rendered by BaseLayout |
| `glw-page` + `glw-prose` | Plain text subpage (Impressum/Datenschutz pattern) | See `src/pages/impressum.astro` |

Section skeleton (every section follows this):

```html
<section class="glw-section" id="anchor-id">
  <div class="glw-container">
    <div class="glw-center reveal">
      <span class="glw-eyebrow">Eyebrow label</span>
      <h2 class="glw-h2">Headline.</h2>
      <p class="glw-lead">Subline.</p>
    </div>
    <!-- section body -->
  </div>
</section>
```

## 3. Core Mechanics

**Audience (B2C/B2B):** `data-audience="b2c|b2b"` on `<html>`, set by the bootstrap
script and the `[data-audience-btn]` segmented control. Content variants are sibling
elements with `.only-b2c` / `.only-b2b`. Without JS, B2C is shown (CSS
`:root:not([data-audience="b2b"]) .only-b2b { display: none }`). Keep copy pairs
adjacent in markup. B2C speaks "du", B2B speaks "Sie".

**Theme:** `data-theme="dark|light"` on `<html>`. Bootstrap sets it from the OS
preference before first paint; `#themeToggle` flips it. A no-JS CSS fallback block in
site.css mirrors the light tokens — never delete it.

**Reveal/motion:** `.reveal` elements fade in via IntersectionObserver (only when
`html.js` present). Stagger with inline `style="--d:.07s"`. `prefers-reduced-motion`
disables float/tilt/reveal — keep that media block intact.

**Page transitions:** cross-document view transitions are enabled CSS-only via
`@view-transition { navigation: auto }` (site.css); the header carries
`view-transition-name: glw-header` so it stays stable while content cross-fades.
Progressive enhancement — unsupported browsers navigate normally. Keep the
`navigation: none` override inside the reduced-motion block.
**Testing note:** in headless Chrome, click-initiated navigations stall on the
render-blocking transition (no compositor frames are produced) and the page
freezes — always run Playwright/automation with
`page.emulateMedia({ reducedMotion: 'reduce' })`, which routes through the
`navigation: none` override. Real, visible browsers are unaffected.

**Blog (opt-in):** posts are Markdown files in `src/content/blog/` rendered through
`glw-prose--article`. Only ship it for clients who will actually publish. To REMOVE
the blog: delete `src/content/`, `src/content.config.ts`, `src/pages/blog/`,
`src/pages/rss.xml.ts`, the RSS `<link>` in BaseLayout, and the three "Blog" links
(desktop nav + mobile panel in SiteHeader, product column in SiteFooter).

## 4. Rules

✅ Always
- Import order in BaseLayout: `@jungherz-de/glasskit/glasskit.css` **before** `../styles/site.css`.
- Keep the bootstrap script as `<script is:inline>` in `<head>` (it must run before first paint).
- Build every page/anchor link with `href()` from `src/data/site.ts`: `href('/#preise')`, `href('/impressum/')` — subpage links with trailing slash.
- Use `--gl-*` tokens for every color/radius/shadow; brand re-colors go into `src/styles/brand.css` (token overrides, loads last), never as hex values in glw rules.
- New sections: `glw-` prefix, global CSS in site.css, follow the section skeleton.
- Pass per-page `title`, `description` (and optional `ogImage`) via BaseLayout props — canonical, OG/Twitter meta and sitemap come for free.
- Keep decorative UI (`Hero` device panel, `Showcase` window) `aria-hidden` and non-interactive (spans styled as buttons, not real `<button>`).

❌ Never
- No `<style>` blocks inside .astro components (Astro scoping breaks `.only-*`, `.js .reveal`, and JS-toggled classes).
- Never edit GlassKit CSS or copy it into the repo; bump the npm version instead.
- No bare `#anchor` hrefs in header/footer (they break on subpages).
- No external requests (fonts, CDNs, analytics) — the built site is fully self-contained. **Single documented exception:** the contact form's configured endpoint (user-initiated submit only, nothing loads before that; the recipient must be named in the privacy policy).
- Don't remove the no-JS fallbacks (light-theme token block, `:root:not([data-audience])` rule).

## 4b. Contact Form Providers

Configure in `src/data/site.ts` (`contactForm`). All providers accept the same form POST; the component and site.js need no changes.

| Target | endpoint | hiddenFields | Notes |
|---|---|---|---|
| Demo (default) | `''` | — | UI works, nothing is sent |
| n8n webhook | `https://<n8n-host>/webhook/kontakt` | — | Workflow: Webhook (POST) → IF `botcheck` empty → any target → Respond 200. **This is also the route to Notion**: add a Notion node ("Create Database Page") in the workflow. Never call the Notion API directly from the browser — the secret token would be public and Notion blocks browser CORS |
| Web3Forms | `https://api.web3forms.com/submit` | `{ access_key: '<key>' }` | access_key is designed to be public |
| Formspree | `https://formspree.io/f/<form-id>` | — | Their `_gotcha` honeypot can be added via hiddenFields if desired |

Server-side: always re-check the `botcheck` field (client check alone is bypassable). GDPR: name the recipient/processor in `/datenschutz/`.

## 5. Recipe: New Website From This Template

1. Use repo as template/fork; `npm install`.
2. `astro.config.mjs`: set `base` to `'/<new-repo-name>'` (or remove for custom domain + add `public/CNAME`).
3. `src/data/site.ts`: siteName, defaultTitle, defaultDescription, repoUrl.
4. Replace copy per section in `src/components/` (grep for `LUMEN`); adjust the Hero device panel to the product. Nav links live twice in SiteHeader (desktop + mobile panel).
5. Replace `public/og.png` (1200×630 social preview) and `public/favicon.svg`.
6. Choose sections: reorder/remove imports in `src/pages/index.astro`; single-audience sites may drop the switch and all `.only-b2b` blocks.
7. Fill `impressum.astro` / `datenschutz.astro` with real legal content.
8. Verify: `npm run build && npm run preview` — check both themes, both audiences, mobile (incl. burger menu), subpage links.
9. Push to `main`; one-time repo setting: Settings → Pages → Source "GitHub Actions".

## 6. Recipe: Convert an Existing Website to This Template

1. Inventory the existing site's content and map each block to a catalog section
   (hero → `Hero`, feature/benefit lists → `Features`, prices → `Pricing`, testimonials
   → `Quote`, contact → `CtaBanner`, text pages → `glw-page`/`glw-prose`).
2. Migrate copy into the matching components; do NOT port the old site's CSS.
3. For content with no matching section type, build a new `glw-` section following the
   skeleton and rules above — compose from GlassKit components (`glass-card`,
   `glass-list`, `glass-badge`, …) instead of importing foreign styles.
4. Keep the old site's brand colors via `src/styles/brand.css` (token overrides,
   example themes included), not by editing glasskit.css or glw rules.
5. Run the verification from recipe 5, step 8.
