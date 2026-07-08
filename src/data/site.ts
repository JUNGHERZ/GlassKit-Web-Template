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
