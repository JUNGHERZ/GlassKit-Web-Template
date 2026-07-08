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
src/scripts/site.js     Behavior: theme toggle, audience switch, reveal, tilt.
                        Progressive enhancement — pages must work without it.
src/layouts/BaseLayout.astro  <head>, CSS imports (GlassKit BEFORE site.css),
                        bootstrap <script is:inline>, glass-bg wrapper, header/footer.
src/components/*.astro  One file per section. Copy lives HERE, next to its markup.
                        Repeated structures (features, stats, plans) are frontmatter
                        const arrays rendered with .map().
src/pages/*.astro       File routing. index.astro composes the one-pager.
```

## 2. Section Catalog (compose in `src/pages/index.astro`)

| Component | Purpose | Notes |
|---|---|---|
| `SiteHeader` | Fixed glass nav: brand, anchors, theme toggle, CTA | Always first inside layout (rendered by BaseLayout) |
| `Hero` | Audience switch + headline pair + CTAs + decorative device panel | The device panel is a mini component showcase (aria-hidden); swap its content to match the product |
| `LogoStrip` | Social proof wordmarks | Text-only, styled via `glw-wordmark--*` variants |
| `Features` | 3-column glass card grid | Edit the `features[]` array (icon = inline outline SVG string, 24 viewBox) |
| `Showcase` | 3D-tilted "spatial" glass window (visionOS look) | Decorative; tilt via `#tiltWindow` in site.js |
| `Stats` | 4 KPI figures, typographic | `stats[]` array; keep `tabular-nums` styling |
| `Pricing` | Two plan grids, one per audience | `plansB2C[]` / `plansB2B[]`; `hot: true` highlights one plan |
| `Quote` | Serif testimonial, one per audience | Paired `.only-b2c` / `.only-b2b` blocks |
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

## 4. Rules

✅ Always
- Import order in BaseLayout: `@jungherz-de/glasskit/glasskit.css` **before** `../styles/site.css`.
- Keep the bootstrap script as `<script is:inline>` in `<head>` (it must run before first paint).
- Build every page/anchor link with `href()` from `src/data/site.ts`: `href('/#preise')`, `href('/impressum/')` — subpage links with trailing slash.
- Use `--gl-*` tokens for every color/radius/shadow; brand re-colors go through a GlassKit theme-override, never hex values in glw rules.
- New sections: `glw-` prefix, global CSS in site.css, follow the section skeleton.
- Keep decorative UI (`Hero` device panel, `Showcase` window) `aria-hidden` and non-interactive (spans styled as buttons, not real `<button>`).

❌ Never
- No `<style>` blocks inside .astro components (Astro scoping breaks `.only-*`, `.js .reveal`, and JS-toggled classes).
- Never edit GlassKit CSS or copy it into the repo; bump the npm version instead.
- No bare `#anchor` hrefs in header/footer (they break on subpages).
- No external requests (fonts, CDNs, analytics) — the built site is fully self-contained.
- Don't remove the no-JS fallbacks (light-theme token block, `:root:not([data-audience])` rule).

## 5. Recipe: New Website From This Template

1. Use repo as template/fork; `npm install`.
2. `astro.config.mjs`: set `base` to `'/<new-repo-name>'` (or remove for custom domain + add `public/CNAME`).
3. `src/data/site.ts`: siteName, defaultTitle, defaultDescription, repoUrl.
4. Replace copy per section in `src/components/` (grep for `LUMEN`); adjust the Hero device panel to the product.
5. Choose sections: reorder/remove imports in `src/pages/index.astro`; single-audience sites may drop the switch and all `.only-b2b` blocks.
6. Fill `impressum.astro` / `datenschutz.astro` with real legal content.
7. Verify: `npm run build && npm run preview` — check both themes, both audiences, mobile, subpage links.
8. Push to `main`; one-time repo setting: Settings → Pages → Source "GitHub Actions".

## 6. Recipe: Convert an Existing Website to This Template

1. Inventory the existing site's content and map each block to a catalog section
   (hero → `Hero`, feature/benefit lists → `Features`, prices → `Pricing`, testimonials
   → `Quote`, contact → `CtaBanner`, text pages → `glw-page`/`glw-prose`).
2. Migrate copy into the matching components; do NOT port the old site's CSS.
3. For content with no matching section type, build a new `glw-` section following the
   skeleton and rules above — compose from GlassKit components (`glass-card`,
   `glass-list`, `glass-badge`, …) instead of importing foreign styles.
4. Keep the old site's brand colors via a GlassKit theme-override file (token
   overrides), not by editing glasskit.css or glw rules.
5. Run the verification from recipe step 7.
