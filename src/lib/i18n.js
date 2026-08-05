/**
 * Locale registry and UI strings for localized pages.
 *
 * English URLs stay unprefixed (/epub-to-pdf); other locales live under
 * their prefix (/es/epub-to-pdf) with the SAME slug — hreflang pairs by
 * slug, and the primary keyword is targeted through title/h1/content, not
 * the path. Recorded decision in content-ops/CONTENT-MACHINE.md.
 */

export const LOCALES = ['en', 'es'];
export const DEFAULT_LOCALE = 'en';

/** ToolRunner's own chrome, per locale. `en` is the source of truth the
 *  component defaults to; other locales pass their block via the `ui` prop. */
export const RUNNER_UI = {
  en: {
    dropIt: 'Drop it.',
    tapToChoose: 'Tap to choose a file',
    chooseDifferent: 'Choose a different file',
    errorFallback: 'Something went wrong converting this file.',
    working: 're-typesetting',
    neverLeft: 'never left your device',
    styleIt: 'Style it before downloading →',
    preparing: 'Preparing your book…',
    downloaded: 'Downloaded ✓',
    downloadPlain: 'Download without styling',
    validOk: 'This EPUB is valid',
    validBad: 'Problems found',
    checkAnother: 'Check another file',
  },
  es: {
    dropIt: '¡Suéltalo!',
    tapToChoose: 'Toca para elegir un archivo',
    chooseDifferent: 'Elegir otro archivo',
    errorFallback: 'Algo salió mal al convertir este archivo.',
    working: 'recomponiendo',
    neverLeft: 'nunca salió de tu dispositivo',
    styleIt: 'Dale estilo antes de descargar →',
    preparing: 'Preparando tu libro…',
    downloaded: 'Descargado ✓',
    downloadPlain: 'Descargar sin estilos',
    validOk: 'Este EPUB es válido',
    validBad: 'Se encontraron problemas',
    checkAnother: 'Comprobar otro archivo',
  },
};

/** Static chrome of the tool-page template, per locale. */
export const TOOL_CHROME = {
  en: {
    lang: 'en',
    breadcrumbRoot: 'Tools',
    questionsH2: 'Questions',
    relatedH2: 'Related tools',
    footerTagline: 'free online EPUB tools',
    footerLinks: [
      { label: 'All tools', href: '/#tools' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
    ],
    /** Link to this page's other-locale twin, when one exists. */
    switch: { label: 'En español', lang: 'es' },
    header: {}, // SiteHeader's own English defaults apply
  },
  es: {
    lang: 'es',
    breadcrumbRoot: 'Herramientas',
    questionsH2: 'Preguntas',
    relatedH2: 'Herramientas relacionadas',
    footerTagline: 'herramientas EPUB gratis, en tu navegador',
    // About/Privacy pages exist only in English for now — linking them
    // honestly beats hiding them.
    footerLinks: [
      { label: 'Todas las herramientas', href: '/#tools' },
      { label: 'Acerca de', href: '/about' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Privacidad', href: '/privacy' },
    ],
    switch: { label: 'In English', lang: 'en' },
    header: {
      nav: [
        { label: 'Herramientas', href: '/#tools' },
        { label: 'Style Studio', href: '/style-studio' },
        { label: 'Blog', href: '/blog' },
      ],
      note: 'gratis · sin registro · en tu navegador',
      mobileNote: 'gratis · sin registro',
    },
  },
};

/**
 * hreflang alternates for a tool slug that exists in `locales`.
 * x-default points at the English URL (the site's primary market).
 */
export function toolAlternates(slug, locales) {
  if (!locales.includes('es')) return [];
  return [
    { hreflang: 'en', href: `/${slug}` },
    { hreflang: 'es', href: `/es/${slug}` },
    { hreflang: 'x-default', href: `/${slug}` },
  ];
}
