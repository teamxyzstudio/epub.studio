/**
 * The three inline marks used in tool-page section copy: `code`, **bold**,
 * *italic* and [label](/href).
 *
 * Not a Markdown parser and not trying to be — a full one would invite copy
 * that the section renderer cannot lay out. Everything is escaped first, so the
 * output is safe to pass to `set:html` even though every string it handles is
 * authored in this repository rather than supplied by a visitor.
 *
 * Links are rendered with the same class as RichText's, so a link inside a
 * section and a link on the homepage look identical.
 */

const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

/**
 * @param {string} text
 * @param {{ links?: boolean }} [opts] `links: false` renders [label](/href) as
 *   plain label. Use it anywhere the text already sits inside an <a> — a nested
 *   anchor is invalid HTML and browsers tear the outer element apart rather
 *   than nesting it.
 * @returns {string} HTML
 */
export function inline(text, { links = true } = {}) {
  return String(text)
    .replace(/[&<>"]/g, (c) => ESCAPE[c])
    // Code first: its contents must not then be read as bold or a link.
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      links ? '<a class="rt-link focus-ring-2" href="$2">$1</a>' : '$1',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');
}
