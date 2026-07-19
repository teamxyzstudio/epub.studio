# Suggested Claude Code kickoff prompt

Paste something like this as your first message in Claude Code (adjust stack):

---

Implement the Epub Studio website from the design handoff in `design_handoff_epub_studio/`.

- Read `README.md` fully first. The `.dc.html` files are the pixel-perfect source of truth: every color, font size, spacing and state is an inline style in those files. When in doubt, open the file and copy the exact value — do not approximate.
- Stack: Next.js (App Router) + React + plain CSS modules or Tailwind (your call), static-export friendly. The blog must be statically rendered for SEO (real `<h1>`, meta tags, OG tags, sitemap).
- Recreate all 7 screens listed in the README at both breakpoints (mobile < 760px, desktop ≥ 760px). The mocks' logic classes describe every interaction — port the behavior, not the framework.
- Wire the assets in `assets/` (favicon.svg, icon.svg, icon-maskable.svg, og-image.png) into metadata, manifest, and OG/Twitter tags as specified in README §Assets.
- Fonts: Instrument Serif, Archivo, IBM Plex Mono (+ reading fonts for Style Studio) via Google Fonts, self-hosted preferred.
- Definition of done per page: side-by-side screenshot against the mock at 1440px and 390px is visually indistinguishable.

Work page by page: Home → tool page template → Blog listing → Blog article → Style Studio. Show me each before moving on.

---

Tips:
- Give Claude Code the whole folder; it reads the .dc.html files directly.
- Ask it to build the 21 tool pages from one template component + a data file (the mock's `EPUB to PDF.dc.html` is the template).
- Style Studio is the biggest lift; ask for a state model (the mock's `renderVals()` already defines it) before UI.
