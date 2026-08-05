/**
 * Spanish tool-page content. Same shape as tool-pages.js entries; slugs are
 * shared with English (URL = /es/<slug>) so hreflang pairs mechanically.
 *
 * IMPORTANT: option `choices` are ENGINE-MATCHED VALUES and must stay
 * identical to the English ones; `labels` carries the translated display
 * text (ToolRunner renders labels[i] when present).
 *
 * Copy is written in Spanish, not machine-translated boilerplate — the
 * l10n lane's recorded bar (landing-backlog.md).
 */
import { toolBySlug } from './tools.js';

const SIZE_OPTS_ES = {
  key: 'pageSize',
  label: 'Tamaño de página',
  choices: ['A4', 'US Letter', '6×9″'],
  labels: ['A4', 'Carta', '6×9″'],
  value: 'A4',
};
const MARGIN_OPTS_ES = {
  key: 'margins',
  label: 'Márgenes',
  choices: ['Narrow', 'Medium', 'Wide'],
  labels: ['Estrechos', 'Medios', 'Anchos'],
  value: 'Medium',
};

const COMMON_ES = {
  size: {
    q: '¿Hay un límite de tamaño?',
    a: 'Archivos de hasta 100 MB se convierten sin problema. Si el tuyo pesa más, prueba primero el compresor de EPUB — suele reducir a la mitad los libros con muchas imágenes.',
  },
  privacy: {
    q: '¿Mis archivos son privados?',
    a: 'Esta herramienta funciona por completo dentro de tu navegador — tu archivo nunca se sube a ningún servidor. Se queda en tu dispositivo, y cerrar la pestaña basta para eliminarlo.',
  },
  drm: {
    q: '¿Funciona con libros protegidos con DRM?',
    a: 'No. Ningún conversor puede abrir archivos con DRM. Esta herramienta funciona con archivos libres de DRM — como los que exportas de tus propias herramientas de escritura o compras en tiendas sin DRM.',
  },
  free: {
    q: '¿De verdad es gratis?',
    a: 'Sí. Todas las herramientas, cualquier tamaño de archivo, sin cuenta. No hay versión de pago ni funciones bloqueadas.',
  },
};

/** @type {Record<string, object>} */
const pages = {
  'epub-to-pdf': {
    h1: 'Convertir EPUB a PDF',
    lede: 'Convierte un ebook adaptable en un PDF fijo e imprimible — gratis, en tu navegador, sin registro.',
    seoTitle: 'Convertir EPUB a PDF — gratis, en tu navegador | Epub Studio',
    accept: '.epub',
    dropHeadline: 'Suelta tu EPUB aquí, o haz clic para elegirlo',
    dropHeadlineMobile: 'Toca para elegir tu EPUB',
    dropSub: '.epub · hasta 100 MB',
    cta: 'Convertir a PDF',
    doneTitle: 'Tu PDF está listo',
    downloadLabel: 'Descargar PDF',
    options: [SIZE_OPTS_ES, MARGIN_OPTS_ES],
    howToTitle: 'Cómo convertir EPUB a PDF',
    howTo: [
      {
        t: 'Elige tu EPUB',
        d: 'Suelta el archivo arriba o toca para elegirlo desde tu dispositivo.',
      },
      {
        t: 'Ajusta tamaño y márgenes',
        d: 'A4 o Carta para imprimir, 6×9″ para una página tipo libro. Los valores por defecto funcionan bien.',
      },
      {
        t: 'Convierte y descarga',
        d: 'Pulsa Convertir a PDF y luego Descargar PDF. Nada sale de tu dispositivo.',
      },
    ],
    explainerTitle: 'EPUB vs PDF — qué cambia',
    explainer: [
      {
        kicker: 'EPUB — ADAPTABLE',
        body: 'El texto se adapta a cualquier pantalla. El lector controla el tamaño, la fuente y el tema. Los números de página no existen — la posición es un porcentaje.',
      },
      {
        kicker: 'PDF — FIJO',
        body: 'Cada página queda congelada en el tamaño que elijas aquí. Perfecto para imprimir y anotar; el texto ya no se adapta a la pantalla.',
      },
    ],
    faqs: [
      {
        q: '¿Mi PDF conservará el formato del libro?',
        a: 'Capítulos, títulos, imágenes y listas se mantienen. Como las páginas del PDF son fijas, los saltos de línea se fijan según el tamaño de página que elijas aquí, no según tu aplicación de lectura.',
      },
      COMMON_ES.size,
      COMMON_ES.privacy,
      {
        q: '¿Por qué mi PDF se ve distinto que en mi lector?',
        a: 'Tu lector aplica su propia fuente y espaciado. El PDF se compone de nuevo con un tamaño de página fijo. Elige 6×9″ con márgenes medios para el resultado más parecido a un libro.',
      },
      COMMON_ES.drm,
    ],
    related: ['pdf-to-epub', 'mobi-to-epub', 'epub-to-docx', 'epub-compressor'],
  },

  'pdf-to-epub': {
    h1: 'Convertir PDF a EPUB',
    lede: 'Convierte un PDF en un ebook adaptable que se lee bien en cualquier pantalla — gratis, en tu navegador.',
    seoTitle: 'Convertir PDF a EPUB — gratis, en tu navegador | Epub Studio',
    accept: '.pdf',
    dropHeadline: 'Suelta tu PDF aquí, o haz clic para elegirlo',
    dropHeadlineMobile: 'Toca para elegir tu PDF',
    dropSub: '.pdf · hasta 100 MB',
    cta: 'Convertir a EPUB',
    doneTitle: 'Tu EPUB está listo',
    downloadLabel: 'Descargar EPUB',
    options: [],
    howToTitle: 'Cómo convertir PDF a EPUB',
    howTo: [
      {
        t: 'Elige tu PDF',
        d: 'Funciona mejor con PDF de texto (libros, informes). Los PDF escaneados son imágenes y no se pueden reconstruir como texto.',
      },
      {
        t: 'Convierte',
        d: 'El texto se extrae y se reconstruye como capítulos adaptables, todo en tu dispositivo.',
      },
      {
        t: 'Descarga o dale estilo',
        d: 'Descarga el EPUB tal cual, o pasa por Style Studio para elegir tipografía y espaciado antes de guardarlo.',
      },
    ],
    explainerTitle: 'PDF vs EPUB — qué cambia',
    explainer: [
      {
        kicker: 'PDF — PÁGINAS FIJAS',
        body: 'Cada línea está clavada en su sitio. En un móvil eso significa hacer zoom y desplazarse — el texto no se reorganiza.',
      },
      {
        kicker: 'EPUB — TEXTO ADAPTABLE',
        body: 'El texto fluye según la pantalla y tus ajustes. Es el formato que tu lector, tablet o móvil prefiere.',
      },
    ],
    faqs: [
      {
        q: '¿Funciona con PDF escaneados?',
        a: 'No del todo. Un PDF escaneado son fotografías de páginas: no contiene texto que extraer. Esta herramienta reconstruye PDF con texto real; para escaneados necesitarías OCR de escritorio primero.',
      },
      {
        q: '¿Se conservará el diseño exacto?',
        a: 'No — y esa es la idea. El EPUB reorganiza el texto para leerse bien en cualquier pantalla. Si necesitas el diseño exacto, el PDF ya es el formato correcto.',
      },
      COMMON_ES.size,
      COMMON_ES.privacy,
      COMMON_ES.free,
    ],
    related: ['epub-to-pdf', 'docx-to-epub', 'txt-to-epub', 'epub-reader'],
  },

  'mobi-to-epub': {
    h1: 'Convertir MOBI a EPUB',
    lede: 'Convierte los MOBI de tu viejo Kindle al formato abierto que todo lector actual entiende — gratis, en tu navegador.',
    seoTitle: 'Convertir MOBI a EPUB — gratis, en tu navegador | Epub Studio',
    accept: '.mobi,.prc,.azw3,.azw',
    dropHeadline: 'Suelta tu MOBI o AZW3 aquí, o haz clic para elegirlo',
    dropHeadlineMobile: 'Toca para elegir tu MOBI o AZW3',
    dropSub: '.mobi · .azw3 · hasta 100 MB',
    cta: 'Convertir a EPUB',
    doneTitle: 'Tu EPUB está listo',
    downloadLabel: 'Descargar EPUB',
    options: [],
    howToTitle: 'Cómo convertir MOBI a EPUB',
    howTo: [
      {
        t: 'Elige tu archivo',
        d: 'Vale un .mobi, .prc, .azw3 o .azw libre de DRM — los libros que cargaste tú o compraste sin protección.',
      },
      {
        t: 'Convierte',
        d: 'El contenedor Kindle se abre y el libro se reconstruye como EPUB estándar, en tu dispositivo.',
      },
      {
        t: 'Descarga o dale estilo',
        d: 'Descarga el EPUB directamente, o elige tipografía y márgenes en Style Studio antes de guardarlo.',
      },
    ],
    explainerTitle: 'MOBI vs EPUB — qué cambia',
    explainer: [
      {
        kicker: 'MOBI — RETIRADO',
        body: 'El formato de la era Palm que Amazon retiró en 2022. Cada vez menos aplicaciones lo abren.',
      },
      {
        kicker: 'EPUB — EL ESTÁNDAR ABIERTO',
        body: 'El formato que entienden Kobo, Apple Books, Google Play Books y, desde 2022, también Send-to-Kindle.',
      },
    ],
    faqs: [
      {
        q: '¿Funciona con libros comprados en la tienda Kindle?',
        a: 'Casi siempre no: la mayoría lleva DRM, y ningún conversor puede abrir archivos protegidos — este incluido. No eliminamos DRM. Funciona con archivos libres de DRM: los que cargaste tú mismo o compraste sin protección.',
      },
      COMMON_ES.size,
      COMMON_ES.privacy,
      COMMON_ES.free,
    ],
    related: ['azw3-to-epub', 'epub-to-pdf', 'mobi-to-pdf', 'epub-reader'],
  },
};

export const esToolSlugs = Object.keys(pages);

const groupOfEs = (slug) => {
  if (slug.startsWith('epub-to-')) return 'Convertir desde EPUB';
  if (slug.endsWith('-to-epub')) return 'Convertir a EPUB';
  if (slug.endsWith('-to-pdf')) return 'Convertir a PDF';
  return 'Utilidades EPUB';
};

export function getToolPageEs(slug) {
  const tool = toolBySlug[slug];
  const page = pages[slug];
  if (!tool || !page) return null;

  return {
    ...tool,
    ...page,
    group: groupOfEs(slug),
    mode: page.mode || 'convert',
    options: page.options || [],
    // Related cards prefer the Spanish page when one exists; otherwise they
    // link the English tool honestly rather than pretending it's localized.
    related: (page.related || [])
      .map((s) => {
        const t = toolBySlug[s];
        if (!t) return null;
        const es = pages[s];
        return {
          ...t,
          n: es ? es.h1.replace(/^Convertir /, '') : t.n,
          href: es ? `/es/${s}` : `/${s}`,
        };
      })
      .filter(Boolean),
  };
}
