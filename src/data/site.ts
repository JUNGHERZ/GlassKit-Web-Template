/**
 * Site-weite Konstanten. Beim Rebranding zuerst hier anpassen,
 * danach die Copy in den Sektions-Komponenten (src/components/).
 */
export const siteName = 'LUMEN';
export const defaultTitle = 'LUMEN – GlassKit Web-Template';
export const defaultDescription =
  'LUMEN – Glassmorphism-Template auf Basis von GlassKit. Eine Designsprache für B2C- und B2B-Auftritte.';
export const repoUrl = 'https://github.com/JUNGHERZ/GlassKit-Web';
export const glasskitUrl = 'https://github.com/JUNGHERZ/GlassKit';

/**
 * Basis-Pfad-sichere Links (die Demo läuft unter /demo/, Projektseiten unter /<repo>/).
 * IMMER für Seiten- und Anker-Links verwenden: href('/#features'), href('/impressum/').
 * Nackte '#anker'-Links brechen auf Unterseiten.
 */
export const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const href = (path: string) => `${base}${path}`;

/**
 * Mehrsprachigkeit (Opt-in). Die Default-Sprache (erster Eintrag) liegt an der
 * Wurzel, jede weitere unter /<code>/ (Seiten in src/pages/<code>/, Sektionen
 * in src/components/<code>/). Muss mit dem i18n-Block in astro.config.mjs
 * übereinstimmen.
 *
 * Genau 1 Eintrag  → einsprachig, kein Umschalter.
 * Genau 2 Einträge → Segmented-Pill „DE | EN" im Header.
 * 3+ Einträge      → Flaggen-Dropdown (SVGs aus src/assets/flags/,
 *                    Quelle: https://github.com/HatScripts/circle-flags, MIT).
 */
export const languages = [
  { code: 'de', label: 'Deutsch', locale: 'de_DE' },
  { code: 'en', label: 'English', locale: 'en_US' },
];
export const defaultLang = languages[0].code;

/** Sprache eines Pfads ermitteln (mit oder ohne base-Präfix). */
export const pathLang = (pathname: string): string => {
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const seg = path.split('/')[1];
  return languages.some((l) => l.code === seg && l.code !== defaultLang) ? seg : defaultLang;
};

/**
 * Denselben Pfad in einer anderen Sprache bauen (Slugs sind in allen Sprachen
 * gleich — bewusste Konvention, damit der Umschalter ohne Mapping auskommt).
 */
export const localeHref = (pathname: string, lang: string): string => {
  let path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  // Normalisieren: führender + Trailing Slash (GitHub Pages macht sonst einen 301)
  if (!path.startsWith('/')) path = `/${path}`;
  if (!path.endsWith('/')) path = `${path}/`;
  const current = pathLang(pathname);
  if (current !== defaultLang) path = path.slice(current.length + 1) || '/';
  return href(lang === defaultLang ? path : `/${lang}${path}`);
};

/**
 * Kontaktformular-Versand. Leerer endpoint = Demo-Modus (UI funktioniert,
 * es wird nichts versendet). Alle Provider nehmen denselben Form-POST an:
 *
 * n8n-Webhook:  endpoint: 'https://n8n.example.de/webhook/kontakt'
 *               (Workflow: Webhook → IF botcheck leer → Ziel eurer Wahl,
 *               z. B. Notion-Node, E-Mail oder CRM → Respond 200)
 * Web3Forms:    endpoint: 'https://api.web3forms.com/submit'
 *               hiddenFields: { access_key: '<public-access-key>' }
 * Formspree:    endpoint: 'https://formspree.io/f/<form-id>'
 *
 * DSGVO: Der konfigurierte Empfänger gehört in die Datenschutzerklärung.
 */
export const contactForm = {
  endpoint: '',
  hiddenFields: {} as Record<string, string>,
};
