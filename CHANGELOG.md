# Changelog

All notable changes to **GlassKit Web** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
GlassKit Web uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For derived projects this file is the update guide: work through the entries
between your last synced release and the current one (SKILL.md, recipe §7).

---

## [1.0.0] – 2026-07-19

First versioned release — GlassKit Web becomes the official website layer of the
GlassKit family, proven in five production sites (monaoffice.de, monahilft.de,
monacore.eu, wimmer-service.nrw, jungherz.com).

### Added

- **Product landing page + docs** (`site/`, static DE/EN) deployed at
  https://glasskit-web.jungherz.com — the LUMEN demo now builds to `/demo/`
  next to it (one repo, one Pages deployment, two builds). `site/` is not part
  of the template and is deleted when deriving a project.
- **CHANGELOG.md** (this file) as the versioned update guide for derived
  projects; referenced from SKILL.md recipe §7.

### Changed

- Repository renamed **GlassKit-Web-Template → GlassKit-Web**; custom domain
  `glasskit-web.jungherz.com` replaces the github.io project page. In
  `astro.config.mjs` the demo now uses `site: 'https://glasskit-web.jungherz.com'`
  and `base: '/demo/'`; all derived URLs (canonical, hreflang, sitemap,
  robots.txt, llms.txt, test baseURL) follow automatically.
- `deploy.yml` builds twice (static `site/` at the root, Astro demo at
  `/demo/`) and uploads one merged Pages artifact. Derived projects remove the
  assemble step (marked `GlassKit-Web only`).

### Template state at 1.0.0

Astro 5 · GlassKit ^1.6.4 · 20 catalog sections (incl. `Hero`/`HeroEditorial`,
`Bento`, `Flow`, `Showcase`) · B2C/B2B audience switch · dark/light theming ·
opt-in blog with RSS · opt-in i18n via language branches (DE root, EN under
`/en/`) · provider-agnostic contact form · SEO (canonical, hreflang, sitemap,
robots.txt, llms.txt, JSON-LD) · no-JS fallbacks throughout · Playwright smoke
suite as deploy gate.
