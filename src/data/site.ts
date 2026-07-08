/**
 * Site-weite Konstanten. Beim Rebranding zuerst hier anpassen,
 * danach die Copy in den Sektions-Komponenten (src/components/).
 */
export const siteName = 'LUMEN';
export const defaultTitle = 'LUMEN – GlassKit Web-Template';
export const defaultDescription =
  'LUMEN – Glassmorphism-Template auf Basis von GlassKit. Eine Designsprache für B2C- und B2B-Auftritte.';
export const repoUrl = 'https://github.com/JUNGHERZ/GlassKit-Web-Template';
export const glasskitUrl = 'https://github.com/JUNGHERZ/GlassKit';

/**
 * Basis-Pfad-sichere Links (GitHub-Pages-Projektseite läuft unter /GlassKit-Web-Template/).
 * IMMER für Seiten- und Anker-Links verwenden: href('/#features'), href('/impressum/').
 * Nackte '#anker'-Links brechen auf Unterseiten.
 */
export const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const href = (path: string) => `${base}${path}`;
