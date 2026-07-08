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

## Schnellstart

```bash
npm install
npm run dev        # → http://localhost:4321/GlassKit-Web-Template/
npm run build      # → dist/
npm run preview    # dist/ lokal testen (inkl. base-Pfad wie auf GitHub Pages)
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
└── pages/                    index + impressum + datenschutz (File-Routing)
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

**SEO-Hinweis:** Sitemap (`sitemap-index.xml`), `robots.txt`, Canonical- und
Open-Graph-Meta werden automatisch generiert. Auf GitHub-Pages-*Projektseiten*
(`…github.io/<repo>/`) liegt `robots.txt` nicht am Domain-Root und wird von
Crawlern ignoriert — die Sitemap dort per Search Console einreichen. Mit
Custom Domain greift alles automatisch.

## Roadmap

Der `.glw-`-Layer reift hier im Template. Sobald er sich über mehrere echte Projekte
stabilisiert hat, wird er als eigenständiges **GlassKit-Web**-Paket extrahiert
(Schichtung: GlassKit = Tokens/Komponenten · GlassKit-Elements = Web Components ·
GlassKit-Web = Site-/Marketing-Sektionen).

## Lizenz

MIT © Jungherz GmbH
