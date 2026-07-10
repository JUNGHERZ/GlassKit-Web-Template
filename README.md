# GlassKit-Web-Template

Astro-Template in der [GlassKit](https://github.com/JUNGHERZ/GlassKit)-Designsprache:
Glassmorphism-Websites, die mit **einer Codebasis B2C- und B2B-Zielgruppen** ansprechen.
Interne Referenz von JUNGHERZ für neue Webprojekte — „auf dieser Basis soll das passieren".

**Live-Demo:** https://jungherz.github.io/GlassKit-Web-Template/

> 🤖 **Für KI-Assistenten:** Die maschinenlesbare Referenz (Sektions-Katalog, Regeln,
> Rezepte für neue Projekte und Umstellungen) liegt in [SKILL.md](SKILL.md).

## Demo-Szenario

Fiktive Marke **LUMEN** (Dokumenten-Scan & -Management). Alle Inhalte sind Platzhalter.
Der Zielgruppen-Umschalter im Hero wechselt Copy, Tonalität (Du/Sie), Preise und
Testimonials zwischen Privat- und Geschäftskunden — dieselbe Designsprache, zwei Ansprachen.
Die Demo ist zweisprachig (Deutsch an der Wurzel, Englisch unter `/en/`) —
siehe [Mehrsprachigkeit](#mehrsprachigkeit-opt-in).

## Schnellstart

```bash
npm install
npm run dev        # → http://localhost:4321/GlassKit-Web-Template/
npm run build      # → dist/
npm run preview    # dist/ lokal testen (inkl. base-Pfad wie auf GitHub Pages)
npm test           # Playwright-Smoke-Tests (baut selbst und startet den Preview)
```

## Struktur

```
astro.config.mjs              site + base (GitHub-Pages-Projektseite)
.github/workflows/deploy.yml  Build & Deploy bei jedem Push auf main
src/
├── data/site.ts              Site-Konstanten + href()-Helper für base-sichere Links
├── styles/site.css           Web-Layer (.glw-*): Layout, Sektionen — nur --gl-*-Tokens
├── styles/brand.css          Kunden-Branding: Token-Overrides (mit Beispiel-Themes)
├── scripts/site.js           Theme-Toggle, B2C/B2B-Umschalter, Scroll-Reveal, 3D-Tilt
├── layouts/BaseLayout.astro  Head, GlassKit-Import, Bootstrap-Script, Header/Footer
├── components/               Eine Datei pro Sektion (Copy wird direkt dort editiert)
│   └── en/                   Englischer Sprachzweig derselben Sektionen (Opt-in)
├── assets/flags/             Sprachflaggen (circle-flags, MIT) für den Umschalter ab 3 Sprachen
└── pages/                    index + impressum + datenschutz (File-Routing)
    └── en/                   Englische Seiten unter /en/
tests/smoke.spec.ts           Playwright-Smoke-Tests (laufen im CI vor jedem Deploy)
```

## Konventionen

- **GlassKit kommt aus npm** (`@jungherz-de/glasskit`) und wird **nie lokal editiert**.
  Update = Version in `package.json` anheben. (Ohne Build-Step ginge alternativ jsDelivr:
  `https://cdn.jsdelivr.net/npm/@jungherz-de/glasskit@1/glasskit.min.css` — vom Template
  bewusst nicht genutzt, damit die Seite ohne externe Requests auskommt.)
- **Eigene Klassen** tragen das Präfix `.glw-` und verwenden ausschließlich
  `--gl-*`-Design-Tokens — keine hartkodierten Farbwerte.
- **Kein Astro-Scoped-CSS** (`<style>` in Komponenten): Das Scoping würde die globalen
  Mechaniken (`.only-b2c/.only-b2b`, `.js .reveal`, JS-getoggelte Klassen) brechen.
  Alle Styles leben global in `src/styles/site.css`.
- **Theming:** `data-theme="dark|light"` auf `<html>`, gesetzt vom Bootstrap-Script
  (OS-Präferenz) bzw. Toggle. Ohne JavaScript greift ein CSS-Fallback.
- **Zielgruppen:** `data-audience="b2c|b2b"` auf `<html>`; Inhalte über
  `.only-b2c` / `.only-b2b`. Ohne JavaScript gilt B2C.
- **Links** immer über `href()` aus `src/data/site.ts` bauen (`href('/#preise')`,
  `href('/impressum/')` mit Trailing Slash) — nackte `#anker` brechen auf Unterseiten.
- **Barrierefreiheit:** `prefers-reduced-motion` deaktiviert Float/Tilt/Reveal,
  Fokus-Ringe in Primary-Farbe, dekorative Demo-UI ist `aria-hidden`.

## Neues Projekt aus dem Template

1. Repo als Vorlage verwenden / forken.
2. `astro.config.mjs`: `base` an den neuen Repo-Namen anpassen — bei Custom Domain
   `base` entfernen, `site` auf die Domain setzen und `public/CNAME` anlegen.
3. `src/data/site.ts`: Name, Title, Description, Repo-URL.
4. Copy pro Sektion in `src/components/` tauschen (nach „LUMEN" suchen) —
   die Nav-Links existieren zweimal (Desktop-Nav + Mobile-Menü im Header).
5. `public/og.png` ersetzen (Social-Vorschaubild, 1200 × 630) und `public/favicon.svg` anpassen.
6. Sektionen in `src/pages/index.astro` an-/abwählen oder umsortieren.
7. Branding-Farben in `src/styles/brand.css` setzen — Token-Overrides nach dem
   Muster von [GlassKit theme-override](https://github.com/JUNGHERZ/GlassKit),
   Beispiel-Themes liegen auskommentiert bei (nie glasskit.css anfassen).
8. Impressum/Datenschutz mit echten Angaben füllen.
9. Push auf `main` — GitHub Actions baut und deployed automatisch
   (einmalig: Settings → Pages → Source „GitHub Actions").

## Blog (Opt-in)

Artikel liegen als Markdown in `src/content/blog/` (Frontmatter: title,
description, pubDate, author) — Übersicht unter `/blog/`, RSS unter `/rss.xml`,
Verlinkung in Header-Nav und Footer. **Nur für Projekte aktiv lassen, die
redaktionell liefern**; die Entfernungs-Schritte stehen in der SKILL.md.

Seitenwechsel (z. B. Startseite → Artikel) nutzen native **Cross-Document View
Transitions** (`@view-transition`, CSS-only): sanfter Übergang in unterstützenden
Browsern, normale Navigation überall sonst, deaktiviert bei `prefers-reduced-motion`.

## Mehrsprachigkeit (Opt-in)

Die Default-Sprache liegt an der Wurzel, jede weitere unter `/<code>/` — pro Sprache
ein eigener Zweig aus Seiten (`src/pages/en/`) und Sektions-Komponenten
(`src/components/en/`). Die Copy bleibt damit wie überall im Template direkt bei
ihrem Markup; Slugs sind in allen Sprachen gleich (hält den Umschalter mapping-frei).
`hreflang`-Alternates, `<html lang>`, `og:locale` und die Sitemap-Verknüpfung
entstehen automatisch aus der `languages`-Liste in `src/data/site.ts`.

Der **Sprach-Umschalter** im Header hat zwei Gesichter aus derselben Config:

- **Genau 2 Sprachen** → Segmented-Pill „DE | EN" (so live in der Demo).
- **3+ Sprachen** → Flaggen-Dropdown mit [circle-flags](https://github.com/HatScripts/circle-flags)
  (MIT; die Sprach-SVGs liegen vendored in `src/assets/flags/`, weitere Codes einfach
  aus `flags/language/` des Repos dazukopieren).

Beide Varianten sind reine **Links auf die äquivalente Seite der Zielsprache** —
kein JS-Toggle, daher SEO-sauber und ohne JavaScript funktionsfähig. Der Blog
erscheint bewusst nur in der Default-Sprache. **Entfernen** (einsprachige Projekte)
und **weitere Sprache ergänzen**: Schritte in der [SKILL.md](SKILL.md), §3b.
Projekte mit vielen Sprachen (3+) sollten stattdessen zentrale Sprachdateien
erwägen — auch das ist dort notiert.

## Kontaktformular anschließen

Das Formular (`#kontakt`) ist provider-agnostisch: Ziel in `src/data/site.ts`
unter `contactForm` konfigurieren — leerer `endpoint` = Demo-Modus.

- **n8n-Webhook** (empfohlen, eigener Stack): `endpoint` auf den Webhook setzen;
  Workflow: Webhook → `botcheck` prüfen → Ziel nach Wahl → Respond 200.
  Über einen Notion-Node landen Anfragen z. B. direkt in einer Notion-Datenbank.
  (Die Notion-API nie direkt aus dem Browser aufrufen: Der Secret-Token wäre
  öffentlich, und Notion blockt Browser-CORS ohnehin.)
- **Web3Forms**: `endpoint: 'https://api.web3forms.com/submit'` +
  `hiddenFields: { access_key: '…' }` (der Key ist als öffentlich konzipiert).
- **Formspree**: `endpoint: 'https://formspree.io/f/<form-id>'`.

Eingebaut: Honeypot (`botcheck`, serverseitig erneut prüfen), Pflicht-Checkbox
mit Link auf die Datenschutzerklärung, B2B-Zusatzfeld „Unternehmen" und ein
sichtbarer Hinweis bei fehlenden Pflichtfeldern (die native Browser-Meldung
kann an der visuell versteckten Checkbox nicht andocken). DSGVO:
Der Empfänger gehört in die Datenschutzerklärung. Dies ist die einzige
dokumentierte Ausnahme von der „keine externen Requests"-Konvention —
es lädt nichts vor dem Absenden.

**SEO-Hinweis:** Sitemap (`sitemap-index.xml`), `robots.txt`, Canonical- und
Open-Graph-Meta werden automatisch generiert. Auf GitHub-Pages-*Projektseiten*
(`…github.io/<repo>/`) liegt `robots.txt` nicht am Domain-Root und wird von
Crawlern ignoriert — die Sitemap dort per Search Console einreichen. Mit
Custom Domain greift alles automatisch.

## Tests

`npm test` fährt die Playwright-Smoke-Suite: beide Themes × beide Zielgruppen ×
Desktop/Mobile, Navigation von Unterseiten (base-Präfix), Mobile-Menü, No-JS-Fallbacks,
404/RSS/Sitemap und Konsolenfehler. Im CI läuft die Suite als eigener Job **vor** dem
Deploy — schlägt sie fehl, geht nichts live. Wichtig für eigene Automatisierung:
Headless-Chrome braucht wegen der View Transitions zwingend
`reducedMotion: 'reduce'` (Details in der [SKILL.md](SKILL.md), §3).

## Roadmap

Der `.glw-`-Layer reift hier im Template. Sobald er sich über mehrere echte Projekte
stabilisiert hat, wird er als eigenständiges **GlassKit-Web**-Paket extrahiert
(Schichtung: GlassKit = Tokens/Komponenten · GlassKit-Elements = Web Components ·
GlassKit-Web = Site-/Marketing-Sektionen).

## Lizenz

MIT © Jungherz GmbH
