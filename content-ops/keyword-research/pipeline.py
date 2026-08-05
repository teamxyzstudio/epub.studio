#!/usr/bin/env python3
"""
Keyword research pipeline for epub.studio's content machine.

Input:  a Semrush/Ahrefs-style export (Keyword, Intent, Volume, Keyword
        Difficulty, CPC (USD), SERP Features) — content-ops/keyword-research/source.csv
Output: clusters.csv   — one row per intent cluster, categorized and mapped
        keywords.csv   — every kept keyword with its cluster assignment
        excluded.csv   — every dropped keyword with the reason bucket

Design: rule-based (no embeddings — deterministic, reviewable, re-runnable).
A cluster is a canonical search intent; same-intent modifiers (free, online,
best…) collapse into it per the recorded one-intent-one-URL policy. Platform
modifiers are kept as facets because they may pass the distinct-intent test.

Run:    python3 content-ops/keyword-research/pipeline.py
"""

import csv
import io
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).parent

# --------------------------------------------------------------------------
# Vocabulary
# --------------------------------------------------------------------------

# Alias → canonical format. Longest-first matching, word-boundary safe.
FORMATS = {
    'epub': ['epub', 'epubs', 'epub3', 'epub 3', 'e pub'],
    'pdf': ['pdf', 'pdfs', 'adobe pdf'],
    'mobi': ['mobi', 'prc'],
    'azw3': ['azw3', 'azw 3', 'azw', 'kf8', 'kfx'],
    'kindle': ['kindle format', 'kindle file', 'kindle'],
    'docx': ['microsoft word', 'ms word', 'word document', 'word doc', 'word file', 'docx', 'doc', 'word'],
    'txt': ['text file', 'txt', 'plain text', 'notepad'],
    'markdown': ['markdown', 'md'],
    'html': ['html', 'htm', 'web page', 'webpage'],
    'fb2': ['fb2'],
    'cbz': ['cbz', 'cbr', 'cb7'],
    'djvu': ['djvu', 'deja vu'],
    'rtf': ['rtf'],
    'odt': ['odt', 'open office', 'openoffice', 'libreoffice'],
    'lit': ['lit'],
    'pdb': ['pdb'],
    'chm': ['chm'],
    'acsm': ['acsm'],
    'ibooks': ['ibooks', 'ibook'],
    'pages': ['apple pages'],
    'latex': ['latex'],
    'audiobook': ['audiobook', 'audio book', 'mp3', 'audio'],
    'image': ['jpg', 'jpeg', 'png', 'tiff', 'image', 'images', 'picture', 'pictures'],
    'zip': ['zip', 'rar'],
    'xml': ['xml'],
    'json': ['json'],
    'csv': ['csv'],
    'excel': ['excel', 'xlsx', 'xls', 'spreadsheet'],
    'ppt': ['powerpoint', 'pptx', 'ppt'],
    'google-docs': ['google docs', 'google doc', 'gdoc'],
    'scrivener': ['scrivener'],
    'wattpad': ['wattpad'],
    'ao3': ['ao3', 'archive of our own'],
    'fanfiction': ['fanfiction', 'fanfic'],
}
ALIAS_TO_FMT = []
for canon, aliases in FORMATS.items():
    for a in aliases:
        ALIAS_TO_FMT.append((a, canon))
ALIAS_TO_FMT.sort(key=lambda x: -len(x[0]))

# Formats our engines genuinely read/write today (for feasibility notes).
OUR_TOOL_PAIRS = {
    'epub-to-pdf', 'epub-to-docx', 'epub-to-txt', 'pdf-to-epub', 'docx-to-epub',
    'mobi-to-epub', 'azw3-to-epub', 'txt-to-epub', 'markdown-to-epub',
    'html-to-epub', 'fb2-to-epub', 'cbz-to-epub',
}
GUIDANCE_PAIRS = {'epub-to-mobi', 'epub-to-azw3', 'epub-to-kindle', 'docx-to-kindle', 'pdf-to-kindle'}

SAME_INTENT_MODIFIERS = [
    'free', 'online', 'best', 'top', 'easy', 'easiest', 'fast', 'quick', 'quickly',
    'simple', 'without watermark', 'no watermark', 'no sign up', 'no signup',
    'no email', 'no registration', 'without registration', 'safe', 'safely', 'secure',
    'unlimited', 'bulk', 'instantly', 'good', 'high quality', 'reddit',
    '2020', '2021', '2022', '2023', '2024', '2025', '2026',
    'website', 'websites', 'site', 'sites', 'tool', 'tools', 'software', 'program',
    'programs', 'app', 'apps', 'application', 'converter', 'convertor', 'conversion',
    'convert', 'converting', 'change', 'changing', 'turn', 'turning', 'transform',
    'make', 'file', 'files', 'format', 'formats', 'document', 'documents',
    'how to', 'how do i', 'how do you', 'how can i', 'way to', 'ways to',
]

PLATFORMS = {
    'mac': ['mac', 'macos', 'macbook', 'osx', 'os x', 'apple silicon'],
    'windows': ['windows', 'windows 10', 'windows 11', 'pc'],
    'linux': ['linux', 'ubuntu'],
    'android': ['android'],
    'ios': ['iphone', 'ios', 'ipad'],
    'chromebook': ['chromebook', 'chrome os', 'chromeos'],
    'browser': ['browser', 'chrome', 'firefox', 'edge', 'safari'],
    'phone': ['phone', 'mobile', 'tablet'],
}

DEVICES = {
    'kindle': ['kindle paperwhite', 'kindle oasis', 'kindle scribe', 'kindle fire',
               'kindle unlimited', 'kindle app', 'kindle'],
    'kobo': ['kobo clara', 'kobo libra', 'kobo sage', 'kobo elipsa', 'kobo nia', 'kobo'],
    'nook': ['nook glowlight', 'nook'],
    'pocketbook': ['pocketbook'],
    'boox': ['boox', 'onyx boox'],
    'remarkable': ['remarkable'],
    'ereader': ['e-reader', 'ereader', 'e reader', 'e-ink', 'eink'],
}

# Brands, split by what they mean for us.
BRANDS_CONVERTERS = ['zamzar', 'convertio', 'cloudconvert', 'online-convert', 'onlineconvert',
                     'freeconvert', 'aconvert', 'epubor', 'epub.to', 'ebook.online', 'file2file',
                     'convertfiles', 'docspal', 'epub converter.com', 'toepub', '2epub']
BRANDS_EBOOK_APPS = ['calibre', 'sigil', 'adobe digital editions', 'apple books', 'ibooks',
                     'google play books', 'play books', 'moon+ reader', 'moon reader', 'lithium',
                     'fbreader', 'aldiko', 'readera', 'thorium', 'koreader', 'sumatra',
                     'freda', 'bookviser', 'neat reader', 'bluefire']
BRANDS_AUTHOR_TOOLS = ['vellum', 'atticus', 'reedsy', 'draft2digital', 'smashwords',
                       'kindle create', 'kdp', 'kindle direct publishing', 'ingramspark',
                       'lulu', 'bookbaby', 'pressbooks', 'jutoh', 'kotobee']
BRANDS_LEGIT_SOURCES = ['project gutenberg', 'gutenberg', 'standard ebooks', 'internet archive',
                        'open library', 'librivox', 'manybooks', 'feedbooks', 'overdrive',
                        'libby', 'hoopla', 'planet ebook']
BRANDS_PIRACY = ['z-library', 'zlibrary', 'z library', 'z lib', 'zlib', 'libgen',
                 'library genesis', "anna's archive", 'annas archive', 'oceanofpdf',
                 'ocean of pdf', 'pdf drive', 'pdfdrive', 'epub bud', 'epubbud',
                 'mobilism', 'ebook bike', 'ebook3000', 'vk epub', 'sci-hub', 'scihub',
                 'readanybook', 'onlinereadfreenovel', 'novel80', 'epub pub', 'epub.pub',
                 'ebookhunter', 'getfreeebooks torrent', 'torrent', 'magnet link', 'epub. pub',
                 'epub dl', 'epub downloader']

DRM_REMOVAL = ['remove drm', 'drm removal', 'drm remover', 'strip drm', 'dedrm',
               'de-drm', 'crack drm', 'bypass drm', 'break drm', 'drm free converter',
               'decrypt', 'remove protection', 'liberate']

# Language markers for the localization lane (l10n is in scope — these become
# a separate targeting list, not an exclusion). Best-effort per-keyword tagging.
LANG_MARKERS = {
    'es': ['convertir', 'convertidor', 'convierte', 'descargar', 'leer ', 'lector',
           'libro', 'como pasar', 'pasar de', ' a espanol', 'en espanol', 'español',
           'gratis'],
    'fr': ['convertisseur', 'gratuit', 'télécharger', 'telecharger', 'lire ',
           'lecteur', 'livre', 'comment convertir', 'epub en pdf', 'pdf en epub',
           'en ligne', 'ouvrir'],
    'de': ['umwandeln', 'konvertieren', 'konverter', 'kostenlos', 'herunterladen',
           'lesen', 'bücher', 'buch ', 'öffnen', 'in pdf umwandeln', 'datei'],
    'pt': ['converter epub em', 'em pdf', 'em epub', 'para pdf', 'para epub',
           'baixar', 'gratuito', 'leitor', 'livro', ' ler ', 'como converter'],
    'it': ['convertire', 'convertitore', 'scaricare', 'lettore', 'libri',
           'leggere', 'in pdf gratis'],
    'nl': ['omzetten', 'converteren', 'boeken', 'lezen', 'naar pdf', 'naar epub'],
    'pl': ['darmowy', 'przekonwertuj', 'konwerter', 'czytnik', 'książki',
           'na pdf', 'na epub', 'jak przekonwertować'],
    'tr': ['ücretsiz', 'çevir', 'dönüştürücü', 'donusturucu', 'okuma', 'indir',
           'çevirme', "pdf'ye"],
    'id': ['cara mengubah', 'ubah epub', 'konversi', 'ke pdf', 'ke epub',
           'membaca', 'pembaca'],
    'vi': ['chuyển', 'miễn phí', 'đọc', 'sang pdf', 'sang epub'],
    'cs': ['čtečka', 'převod', 'převést', 'zdarma'],
    'ru': ['конвертер', 'скачать', 'бесплатно', 'читалка', 'в pdf', 'в epub'],
    'ar': ['مجانا', 'تحويل', 'قارئ', 'تنزيل'],
}

SCRIPT_LANGS = [
    ((0x0400, 0x04FF), 'ru'), ((0x0600, 0x06FF), 'ar'),
    ((0x3040, 0x30FF), 'ja'), ((0xAC00, 0xD7AF), 'ko'),
    ((0x4E00, 0x9FFF), 'zh'), ((0x0900, 0x097F), 'hi'),
    ((0x0E00, 0x0E7F), 'th'), ((0x0370, 0x03FF), 'el'),
]


FMT_A_FMT = None  # compiled lazily: '<fmt> a <fmt>' is the Spanish connector


def detect_language(s: str) -> str | None:
    """Return a language code when the keyword is not English, else None."""
    global FMT_A_FMT
    if FMT_A_FMT is None:
        alts = '|'.join(sorted({re.escape(a) for a, _ in ALIAS_TO_FMT}, key=len, reverse=True))
        FMT_A_FMT = re.compile(r'(?<![a-z0-9])(' + alts + r')\s+a\s+(' + alts + r')(?![a-z0-9])')
    if FMT_A_FMT.search(s):
        return 'es'
    for (lo, hi), lang in SCRIPT_LANGS:
        if any(lo <= ord(c) <= hi for c in s):
            # Han present alongside kana means Japanese, not Chinese.
            if lang == 'zh' and any(0x3040 <= ord(c) <= 0x30FF for c in s):
                return 'ja'
            return lang
    for lang, markers in LANG_MARKERS.items():
        if contains_any(s, markers):
            return lang
    if has_nonlatin(s):
        return 'other'
    return None

QUESTION_STEMS = ['what is', 'what are', 'what does', 'whats', "what's", 'how to', 'how do',
                  'how can', 'can i', 'can you', 'does', 'do i', 'why', 'is it', 'is an',
                  'is a', 'are ', 'should i', 'which', 'where']


def norm(s: str) -> str:
    s = unicodedata.normalize('NFKC', s).lower().strip()
    s = re.sub('[“”‘’]', "'", s)
    s = re.sub(r'\s+', ' ', s)
    return s


def has_nonlatin(s: str) -> bool:
    return any(ord(c) > 0x24F for c in s)


def contains_any(s: str, terms) -> str | None:
    for t in terms:
        if t in s:
            return t
    return None


def word_in(s: str, terms) -> str | None:
    for t in terms:
        if re.search(r'(?<![a-z0-9])' + re.escape(t) + r'(?![a-z0-9])', s):
            return t
    return None


def find_formats(s: str):
    """Return ordered list of (position, canonical_format) found in the string."""
    found = []
    taken = [False] * len(s)
    for alias, canon in ALIAS_TO_FMT:
        for m in re.finditer(r'(?<![a-z0-9])' + re.escape(alias) + r'(?![a-z0-9])', s):
            if any(taken[m.start():m.end()]):
                continue
            for i in range(m.start(), m.end()):
                taken[i] = True
            found.append((m.start(), canon))
    found.sort()
    out = []
    for pos, f in found:
        if not out or out[-1][1] != f:
            out.append((pos, f))
    return out


def detect_pair(s: str):
    """Detect 'X to Y' conversion intent. Returns (src, dst) or None."""
    fmts = find_formats(s)
    if len(fmts) < 2:
        return None
    m = re.search(r'(?<![a-z0-9])(to|into|in to|2|→|-)(?![a-z0-9])', s)
    for i in range(len(fmts) - 1):
        (p1, f1), (p2, f2) = fmts[i], fmts[i + 1]
        if f1 == f2:
            continue
        between = s[p1:p2]
        if re.search(r'(?<![a-z0-9])(to|into|in to|2|→)(?![a-z0-9])', between) or ' - ' in between:
            return (f1, f2)
        if re.search(r'(?<![a-z0-9])in(?![a-z0-9])', between):
            return (f1, f2)
    # "convert X Y" / bare "X Y": searcher shorthand for X→Y when the keyword
    # is nothing but the two formats plus generic converter words
    if len(fmts) == 2:
        if re.search(r'convert|converter|conversion', s):
            return (fmts[0][1], fmts[1][1])
        residue = s
        for alias, _ in ALIAS_TO_FMT:
            residue = re.sub(r'(?<![a-z0-9])' + re.escape(alias) + r'(?![a-z0-9])', ' ', residue)
        residue = re.sub(r'(?<![a-z0-9])(file|files|format|formats|to|online|free|a)(?![a-z0-9])', ' ', residue)
        if not residue.strip():
            return (fmts[0][1], fmts[1][1])
    return None


# --------------------------------------------------------------------------
# Owned-intent map (kept in sync with content-ops/keyword-map.csv)
# --------------------------------------------------------------------------

PAIR_OWNERS = {
    'epub-to-pdf': '/epub-to-pdf', 'epub-to-docx': '/epub-to-docx',
    'epub-to-txt': '/epub-to-txt', 'pdf-to-epub': '/pdf-to-epub',
    'docx-to-epub': '/docx-to-epub', 'mobi-to-epub': '/mobi-to-epub',
    'azw3-to-epub': '/azw3-to-epub', 'txt-to-epub': '/txt-to-epub',
    'markdown-to-epub': '/markdown-to-epub', 'html-to-epub': '/html-to-epub',
    'fb2-to-epub': '/fb2-to-epub', 'cbz-to-epub': '/cbz-to-epub',
    'epub-to-mobi': '/epub-to-mobi', 'epub-to-azw3': '/epub-to-azw3',
    'epub-to-kindle': '/blog/send-epub-to-kindle',
    'kindle-to-epub': '/azw3-to-epub', 'mobi-to-kindle': '/blog/send-epub-to-kindle',
    'epub-to-ibooks': '/blog/send-epub-to-kindle',  # nearest guidance; review
}

# --------------------------------------------------------------------------
# Categorization: cluster → (lane, target, note). The judgment layer — curated,
# then applied mechanically. Lanes: owned-enrich | blog | landing-variant |
# landing-audience | landing-comparison | tool-new | tool-guidance | scope-new |
# monitor | peripheral | policy-blocked.
# --------------------------------------------------------------------------

CLUSTER_ACTIONS = {
    'job:reader': ('owned-enrich+landing-variant', '/epub-reader',
                   'parent owned; windows/android/ios/mac/linux facets are variant pages embedding the reader'),
    'topic:kindle': ('blog', '',
                     'long-tail kindle content feed; mine per-question, stay in format/transfer lane'),
    'topic:epub-general': ('owned-enrich', '/',
                           'head terms owned by home + tool hub; long tail feeds blog'),
    'pair:epub-to-pdf': ('owned-enrich', '/epub-to-pdf', ''),
    'topic:ebook-general': ('owned-enrich', '/', 'hub + epub-vs-pdf-vs-mobi own the heads'),
    'topic:device-nook': ('monitor', '', 'B&N ecosystem peripheral; one editorial possible'),
    'topic:kindle-app': ('blog', '', 'kindle app usage questions; ours only where files/formats involved'),
    'pair:pdf-to-epub': ('owned-enrich', '/pdf-to-epub', ''),
    'topic:kindle-formats': ('owned-enrich', '/blog/send-epub-to-kindle',
                             'plus epub-vs-pdf-vs-mobi; consider dedicated "kindle formats explained"'),
    'topic:kindle-locations': ('owned-enrich', '/blog/why-page-numbers-dont-exist-in-epub',
                               'big owned intent: "what does loc mean on kindle" phrasings'),
    'topic:what-is-epub': ('blog', 'what-is-an-epub-file',
                           'UNOWNED definitional head (~8.9k); beginner explainer distinct from structure post'),
    'job:cover': ('owned-enrich', '/epub-cover-editor', ''),
    'topic:question': ('blog', '', 'question feed for weekly mined posts'),
    'topic:get-books': ('blog', 'free-ebooks-legally',
                        'where to get free ebooks legally: KU/Prime/Libby/Gutenberg/Standard Ebooks'),
    'pair:epub-to-kindle': ('owned-enrich', '/blog/send-epub-to-kindle', 'guidance owned'),
    'topic:device-ereader': ('blog', '', 'ereader-general questions feed'),
    'brand:app:google-play-books': ('blog', 'google-play-books-epub',
                                    'upload/export epub with Play Books — how-to gap'),
    'brand:app:apple-books': ('blog', 'apple-books-epub',
                              'epub on Apple Books/iPhone how-to gap'),
    'pair:kindle-to-pdf': ('tool-new', 'azw3-to-pdf',
                           'azw3/mobi→epub→pdf chain exists; honest DRM stance mandatory'),
    'topic:send-to-kindle': ('owned-enrich', '/blog/send-epub-to-kindle', ''),
    'pair:djvu-to-pdf': ('tool-new', 'djvu-to-pdf',
                         'djvu.js renders client-side; scan-book adjacent; validate effort'),
    'topic:acsm': ('blog', 'what-is-an-acsm-file',
                   'explainer: ACSM is a license, not the book; ADE flow; no DRM circumvention'),
    'topic:device-kobo': ('blog', 'read-epub-on-kobo', 'kobo loves epub; transfer how-to'),
    'pair:docx-to-epub': ('owned-enrich', '/docx-to-epub', ''),
    'brand:app:ibooks': ('blog', 'apple-books-epub', 'merge with apple books post'),
    'peripheral:kindle-account': ('peripheral', '', 'account support; not our lane'),
    'topic:comparison': ('owned-enrich', '/blog/epub-vs-pdf-vs-mobi', ''),
    'pair:pdf-to-kindle': ('tool-guidance', 'pdf-to-kindle',
                           'guidance page: Send-to-Kindle supports pdf; or pdf→epub→send route'),
    'pair:kindle-to-epub': ('owned-enrich', '/azw3-to-epub',
                            'honest DRM framing on the existing page + faq'),
    'job:create': ('blog', 'how-to-create-an-epub',
                   'step-by-step beginner make-an-epub guide; routes to docx/md tools'),
    'pair:cbz-to-pdf': ('tool-new', 'cbz-to-pdf', 'comic archive → pdf; images pipeline exists'),
    'brand:app:adobe-digital-editions': ('blog', 'adobe-digital-editions-guide',
                                         'ADE + acsm ecosystem explainer'),
    'job:edit': ('owned-enrich', '/epub-metadata-editor', 'edit intent splits across our editors'),
    'pair:mobi-to-epub': ('owned-enrich', '/mobi-to-epub', ''),
    'pair:epub-to-docx': ('owned-enrich', '/epub-to-docx', ''),
    'pair:epub-to-mobi': ('owned-enrich', '/epub-to-mobi', ''),
    'brand:app:calibre': ('owned-enrich', '/calibre-alternative', ''),
    'topic:formats-info': ('owned-enrich', '/blog/epub-vs-pdf-vs-mobi', ''),
    'pair:mobi-to-pdf': ('tool-new', 'mobi-to-pdf', 'mobi→epub→pdf chain exists'),
    'scope:audiobook': ('scope-new', 'listen',
                        'epub/pdf → audio via browser TTS; phase-2 product lane'),
    'topic:troubleshoot': ('owned-enrich', '/blog/fixing-corrupt-epub-files',
                           'fix-it family owns most phrasings'),
    'job:validate': ('owned-enrich', '/epub-validator', ''),
    'job:compress': ('owned-enrich', '/epub-compressor', ''),
    'job:merge': ('owned-enrich', '/merge-epub', ''),
    'job:split': ('owned-enrich', '/split-epub', ''),
    'job:styling': ('owned-enrich', '/style-studio', ''),
    'job:metadata': ('owned-enrich', '/epub-metadata-editor', ''),
    'topic:drm-info': ('blog', 'ebook-drm-explained',
                       'what DRM is, what is legal; no circumvention'),
    'topic:toc': ('owned-enrich', '/blog/epub-table-of-contents-problems', ''),
    'topic:what-is-epub-structure': ('owned-enrich', '/blog/what-is-inside-an-epub', ''),
    'pair:epub-to-txt': ('owned-enrich', '/epub-to-txt', ''),
    'pair:txt-to-epub': ('owned-enrich', '/txt-to-epub', ''),
    'pair:html-to-epub': ('owned-enrich', '/html-to-epub', ''),
    'pair:markdown-to-epub': ('owned-enrich', '/markdown-to-epub', ''),
    'pair:fb2-to-epub': ('owned-enrich', '/fb2-to-epub', ''),
    'pair:cbz-to-epub': ('owned-enrich', '/cbz-to-epub', ''),
    'pair:azw3-to-epub': ('owned-enrich', '/azw3-to-epub', ''),
    'pair:pdf-to-cbz': ('monitor', '', 'niche reverse comic pair'),
    'pair:epub-to-azw3': ('owned-enrich', '/epub-to-azw3', ''),
    'topic:send-to-kobo': ('blog', 'read-epub-on-kobo', ''),
}


def cluster_action(cluster: str, volume: int):
    """Resolve lane/target/note, with prefix defaults for the long tail."""
    if cluster in CLUSTER_ACTIONS:
        return CLUSTER_ACTIONS[cluster]
    if cluster.startswith('peripheral:'):
        return ('peripheral', '', '')
    if cluster.startswith('brand:converter:'):
        return ('landing-comparison', '', 'competitor page only if volume justifies')
    if cluster.startswith('brand:author-tool:'):
        return ('landing-audience', '', 'self-publisher adjacency; Style Studio angle')
    if cluster.startswith('brand:source:'):
        return ('blog', 'free-ebooks-legally', 'legit sources roundup')
    if cluster.startswith('brand:app:'):
        return ('blog', '', 'reader-app ecosystem question feed')
    if cluster.startswith('pair:'):
        key = cluster[5:]
        if key in PAIR_OWNERS:
            return ('owned-enrich', PAIR_OWNERS[key], '')
        return ('tool-new' if volume >= 800 else 'monitor', key, 'auto: unowned pair')
    if cluster.startswith('scope:'):
        return ('scope-new', cluster[6:], '')
    return ('blog' if volume >= 500 else 'monitor', '', 'auto: default')


JOB_OWNERS = {
    'reader': '/epub-reader', 'metadata': '/epub-metadata-editor',
    'cover': '/epub-cover-editor', 'validate': '/epub-validator',
    'compress': '/epub-compressor', 'merge': '/merge-epub', 'split': '/split-epub',
    'styling': '/style-studio',
}


# --------------------------------------------------------------------------
# Classification
# --------------------------------------------------------------------------

def classify(kw: str):
    """Return (bucket, cluster, facet) for one normalized keyword.

    bucket: kept | excluded-<reason>
    cluster: canonical intent id, e.g. pair:epub-to-pdf, job:reader, topic:...
    facet: platform/device qualifier or ''
    """
    s = kw

    # --- localization lane (separate targeting list, not an exclusion) ----
    lang = detect_language(s)
    if lang:
        return (f'l10n-{lang}', '', '')
    if contains_any(s, BRANDS_PIRACY):
        return ('excluded-piracy', '', '')
    if contains_any(s, DRM_REMOVAL):
        return ('excluded-drm-removal', '', '')

    fmts = [f for _, f in find_formats(s)]
    ebook_side = {'epub', 'mobi', 'azw3', 'kindle', 'fb2', 'cbz', 'ibooks', 'lit', 'pdb'}
    domain_words = word_in(s, ['epub', 'ebook', 'e-book', 'ebooks', 'e-books', 'kindle',
                               'mobi', 'azw', 'azw3', 'fb2', 'ereader', 'e-reader',
                               'kobo', 'nook', 'calibre', 'ibooks', 'cbz', 'cbr',
                               'djvu', 'acsm'])

    pair = detect_pair(s)

    # off-domain: no ebook token anywhere and no ebook-side format in a pair
    if not domain_words:
        if pair and (pair[0] in ebook_side or pair[1] in ebook_side):
            pass
        elif contains_any(s, BRANDS_EBOOK_APPS + BRANDS_AUTHOR_TOOLS + BRANDS_LEGIT_SOURCES) or word_in(s, sum(DEVICES.values(), [])):
            pass
        else:
            return ('excluded-offdomain', '', '')

    # --- facets -----------------------------------------------------------
    facet = ''
    for plat, aliases in PLATFORMS.items():
        if word_in(s, aliases):
            facet = plat
            break
    if not facet:
        for dev, aliases in DEVICES.items():
            if dev != 'kindle' and word_in(s, aliases):
                facet = dev
                break

    # --- special scopes before generic pairs ------------------------------
    if word_in(s, ['acsm']):
        return ('kept', 'topic:acsm', facet)
    if pair and pair[1] == 'audiobook' or (word_in(s, ['text to speech', 'tts', 'read aloud'])
                                           and domain_words):
        return ('kept', 'scope:audiobook', facet)

    # --- conversion pairs -------------------------------------------------
    if pair:
        src, dst = pair
        key = f'{src}-to-{dst}'
        return ('kept', f'pair:{key}', facet)

    # --- brand / competitor -----------------------------------------------
    b = contains_any(s, BRANDS_CONVERTERS)
    if b:
        return ('kept', f'brand:converter:{b}', facet)
    b = contains_any(s, BRANDS_AUTHOR_TOOLS)
    if b:
        return ('kept', f'brand:author-tool:{b.replace(" ", "-")}', facet)
    b = contains_any(s, BRANDS_LEGIT_SOURCES)
    if b:
        return ('kept', f'brand:source:{b.replace(" ", "-")}', facet)
    b = contains_any(s, BRANDS_EBOOK_APPS)
    if b:
        return ('kept', f'brand:app:{b.replace(" ", "-")}', facet)

    # --- jobs on a single format -----------------------------------------
    if word_in(s, ['read', 'reader', 'reading', 'open', 'opens', 'opening', 'opener',
                   'view', 'viewer']):
        if 'epub' in fmts or (domain_words and not fmts):
            return ('kept', 'job:reader', facet)
    if word_in(s, ['metadata', 'meta data', 'author name', 'isbn', 'book title']):
        return ('kept', 'job:metadata', facet)
    if word_in(s, ['cover']):
        return ('kept', 'job:cover', facet)
    if word_in(s, ['validate', 'validator', 'validation', 'epubcheck', 'check epub',
                   'checker']):
        return ('kept', 'job:validate', facet)
    if word_in(s, ['compress', 'reduce size', 'file size', 'smaller', 'shrink']):
        return ('kept', 'job:compress', facet)
    if word_in(s, ['merge', 'combine', 'join']):
        return ('kept', 'job:merge', facet)
    if word_in(s, ['split', 'separate', 'extract chapter']):
        return ('kept', 'job:split', facet)
    if word_in(s, ['font', 'fonts', 'typeface', 'typography', 'line spacing', 'margins',
                   'typeset', 'formatting', 'layout', 'style']):
        return ('kept', 'job:styling', facet)
    if word_in(s, ['edit', 'editor', 'editing']):
        return ('kept', 'job:edit', facet)
    if word_in(s, ['create', 'make', 'making', 'build', 'write', 'writing', 'generator',
                   'generate']) and word_in(s, ['epub', 'ebook', 'e-book', 'ebooks']):
        return ('kept', 'job:create', facet)
    if word_in(s, ['drm']):
        return ('kept', 'topic:drm-info', facet)
    if word_in(s, ['table of contents', 'toc']):
        return ('kept', 'topic:toc', facet)
    if word_in(s, ['not working', "won't open", 'wont open', 'not opening', 'problem',
                   'problems', 'error', 'errors', 'fix', 'corrupt', 'broken', 'issue']):
        return ('kept', 'topic:troubleshoot', facet)

    # --- kindle / device how-tos -----------------------------------------
    if word_in(s, DEVICES['kindle']):
        if word_in(s, ['send', 'transfer', 'put', 'load', 'add', 'upload', 'email',
                       'import', 'sideload', 'side load']):
            return ('kept', 'topic:send-to-kindle', facet)
        if word_in(s, ['loc', 'locs', 'location', 'locations', 'page number',
                       'page numbers']):
            return ('kept', 'topic:kindle-locations', facet)
        if word_in(s, ['epub', 'format', 'formats', 'file type', 'file types',
                       'supported', 'mobi', 'azw', 'azw3']):
            return ('kept', 'topic:kindle-formats', facet)
        if word_in(s, ['unlimited', 'prime reading', 'free books', 'free kindle books',
                       'first reads']):
            return ('kept', 'topic:get-books', facet)
        if word_in(s, ['sign in', 'login', 'log in', 'account', 'cloud reader',
                       'password', 'deregister']):
            return ('kept', 'peripheral:kindle-account', facet)
        if word_in(s, ['which kindle', 'best kindle', 'price', 'cost', 'deal', 'deals',
                       'sale', 'buy', 'vs paperwhite', 'paperwhite vs', 'oasis vs',
                       'scribe vs', 'colorsoft', 'generation']):
            return ('kept', 'peripheral:kindle-shopping', facet)
        if word_in(s, ['battery', 'frozen', 'screen', 'reset', 'restart', 'wifi',
                       'not working', 'broken', 'repair', 'warranty', 'charger']):
            return ('kept', 'peripheral:kindle-support', facet)
        if word_in(s, ['app']):
            return ('kept', 'topic:kindle-app', facet)
        return ('kept', 'topic:kindle', facet)
    for dev in ('kobo', 'nook', 'pocketbook', 'boox', 'remarkable', 'ereader'):
        if word_in(s, DEVICES[dev]):
            return ('kept', f'topic:device-{dev}', facet)

    # --- informational ----------------------------------------------------
    if word_in(s, ['free ebooks', 'free books', 'free epub books', 'download books',
                   'get books', 'where to download', 'free novels', 'public domain']):
        return ('kept', 'topic:get-books', facet)
    if re.search(r"what(?:'?s| is| are| does)?\s+(?:an?\s+)?\.?epub", s) or s in (
            'epub meaning', 'epub definition', 'define epub', 'epub file meaning'):
        return ('kept', 'topic:what-is-epub', facet)
    if word_in(s, ['file types', 'file formats', 'ebook formats', 'book formats',
                   'ebook file']):
        return ('kept', 'topic:formats-info', facet)
    if word_in(s, ['vs', 'versus', 'difference between', 'or', 'better than']):
        return ('kept', 'topic:comparison', facet)
    if any(s.startswith(q) for q in QUESTION_STEMS):
        return ('kept', 'topic:question', facet)
    if 'epub' in fmts and len(fmts) == 1:
        return ('kept', 'topic:epub-general', facet)
    if domain_words:
        return ('kept', 'topic:ebook-general', facet)

    return ('excluded-unmatched', '', '')


# --------------------------------------------------------------------------
# Run
# --------------------------------------------------------------------------

def main():
    rows = list(csv.DictReader(io.open(HERE / 'source.csv', encoding='utf-8-sig')))
    seen = set()
    kept, excluded, l10n = [], [], []
    for r in rows:
        kw = norm(r['Keyword'])
        if not kw or kw in seen:
            continue
        seen.add(kw)
        vol = int(r['Volume'] or 0)
        kd = r['Keyword Difficulty'] or ''
        bucket, cluster, facet = classify(kw)
        rec = {'keyword': kw, 'volume': vol, 'kd': kd, 'intent': r['Intent'],
               'bucket': bucket, 'cluster': cluster, 'facet': facet}
        if bucket == 'kept':
            kept.append(rec)
        elif bucket.startswith('l10n-'):
            # Tag the likely intent so the l10n list is actionable: formats are
            # language-neutral, so a 2-format hit is a conversion pair.
            fmts = [f for _, f in find_formats(kw)]
            rec['lang'] = bucket[5:]
            rec['pair'] = f'{fmts[0]}-to-{fmts[1]}' if len(fmts) >= 2 else ''
            ebook_side = {'epub', 'mobi', 'azw3', 'kindle', 'fb2', 'cbz', 'ibooks',
                          'djvu', 'acsm'}
            rec['in_domain'] = ('yes' if (set(fmts) & ebook_side)
                                or re.search(r'epub|ebook|kindle|mobi|libro|livre|buch|boek|книг|电子书|電子書', kw)
                                else 'no')
            l10n.append(rec)
        else:
            excluded.append(rec)

    # aggregate clusters
    agg = defaultdict(lambda: {'volume': 0, 'count': 0, 'kws': [], 'facets': defaultdict(int)})
    for r in kept:
        a = agg[r['cluster']]
        a['volume'] += r['volume']
        a['count'] += 1
        a['kws'].append((r['volume'], r['keyword']))
        if r['facet']:
            a['facets'][r['facet']] += r['volume']

    with io.open(HERE / 'clusters.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['cluster', 'volume', 'keywords', 'lane', 'target', 'top_keywords',
                    'facet_volumes', 'note'])
        for cl, a in sorted(agg.items(), key=lambda x: -x[1]['volume']):
            top = '; '.join(k for _, k in sorted(a['kws'], reverse=True)[:5])
            facets = '; '.join(f'{k}:{v}' for k, v in sorted(a['facets'].items(), key=lambda x: -x[1]))
            lane, target, note = cluster_action(cl, a['volume'])
            w.writerow([cl, a['volume'], a['count'], lane, target, top, facets, note])

    with io.open(HERE / 'keywords.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword', 'volume', 'kd', 'cluster', 'facet'])
        for r in sorted(kept, key=lambda r: -r['volume']):
            w.writerow([r['keyword'], r['volume'], r['kd'], r['cluster'], r['facet']])

    with io.open(HERE / 'localization.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword', 'volume', 'language', 'intent_pair', 'in_domain'])
        for r in sorted(l10n, key=lambda r: (r['lang'], -r['volume'])):
            w.writerow([r['keyword'], r['volume'], r['lang'], r['pair'], r['in_domain']])

    with io.open(HERE / 'excluded.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['keyword', 'volume', 'reason'])
        for r in sorted(excluded, key=lambda r: (r['bucket'], -r['volume'])):
            w.writerow([r['keyword'], r['volume'], r['bucket']])

    # summary to stdout
    from collections import Counter
    print(f'input rows: {len(rows)}   unique: {len(seen)}')
    print(f'kept: {len(kept)}   l10n: {len(l10n)}   excluded: {len(excluded)}')
    lang_vol, lang_dom = defaultdict(int), defaultdict(int)
    for r in l10n:
        lang_vol[r['lang']] += r['volume']
        if r['in_domain'] == 'yes':
            lang_dom[r['lang']] += r['volume']
    print('l10n volume by language (total):', sorted(lang_vol.items(), key=lambda x: -x[1]))
    print('l10n volume by language (in-domain):', sorted(lang_dom.items(), key=lambda x: -x[1]))
    print(Counter(r['bucket'] for r in excluded).most_common())
    print(f'clusters: {len(agg)}')
    total_kept_vol = sum(r['volume'] for r in kept)
    print(f'kept volume: {total_kept_vol}')
    lane_vol = defaultdict(int)
    for cl, a in agg.items():
        lane_vol[cluster_action(cl, a['volume'])[0]] += a['volume']
    print('lane volumes:', sorted(lane_vol.items(), key=lambda x: -x[1]))


if __name__ == '__main__':
    main()
