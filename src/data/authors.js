/**
 * The real people behind the site. Keyed by display name so post frontmatter
 * (`author.name`) resolves without a schema change; posts whose author isn't
 * registered here fall back to the plain org byline.
 *
 * Bios state only verifiable facts — what these people build on this site.
 * No invented titles, employers, or credentials (fabricated authority is the
 * trust-buster the SEO audit warns about).
 */
const PEOPLE = {
  'Mofid Ansari': {
    slug: 'mofid-ansari',
    name: 'Mofid Ansari',
    initial: 'M',
    /**
     * Real, owner-supplied profiles. The first entry is the primary one —
     * templates that have room for a single link use it. Order matters:
     * personal site first, because it is the strongest identity anchor.
     */
    links: [
      { label: 'ansarimofid.in', href: 'https://ansarimofid.in/', site: true },
      { label: 'GitHub', href: 'https://github.com/ansarimofid' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ansarimofid/' },
    ],
    bio: 'Co-founder of Epub Studio. He builds the conversion engines behind these tools — the format parsers, the PDF renderer, the validator — and won’t ship a page whose converter doesn’t genuinely work in the browser. Every post he signs has been checked against the tools he built.',
  },
  'Shahid Ansari': {
    slug: 'shahid-ansari',
    name: 'Shahid Ansari',
    initial: 'S',
    links: [
      { label: 'GitHub', href: 'https://github.com/ansarishahid' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ansarishahid/' },
    ],
    bio: 'Co-founder of Epub Studio. He works on the product end to end — the tools, the typography, and the words — and reviews what the site publishes so that every guide matches how the converters actually behave.',
  },
};

/**
 * Every author carries a `sameAs` array (the shape schema.org wants) and a
 * `primaryLink`, derived once here so no template has to know the order or
 * repeat a URL. Person schema on the homepage, the author pages and the blog
 * bylines all read from this, which is why a profile can only be added in one
 * place.
 */
export const AUTHORS = Object.fromEntries(
  Object.entries(PEOPLE).map(([key, person]) => [
    key,
    {
      ...person,
      sameAs: person.links.map((l) => l.href),
      primaryLink: person.links[0],
    },
  ]),
);

export const authorByName = (name) => AUTHORS[name];
export const allAuthors = Object.values(AUTHORS);


/**
 * The team blurb that introduces those people on /about. Lives here rather
 * than with page content because it is about the same two humans as AUTHORS,
 * and both are rendered by the same component.
 *
 * TODO: verify — the founders should supply real photographs (drop them at
 * public/authors/<slug>.jpg; see lib/author-photo.js) and, if they want one, a
 * first-hand sentence on what prompted them to build the site. Neither is
 * fabricated here.
 */
export const TEAM = {
  intro:
    'Epub Studio is built and maintained by two people, named here because a tool that asks you ' +
    'to trust it about your files should say who is behind it.',
  /* The "why" below describes design decisions that are verifiable in the
     product itself, not an anecdote nobody can check. */
  why:
    'Epub Studio exists because the obvious way to build an ebook converter — upload the file, ' +
    'process it on a server, mail back a link — means asking people to hand over unpublished ' +
    'manuscripts and confidential documents to a stranger’s machine. Every tool here is built the ' +
    'other way round instead. That constraint is kept even where it costs a feature: MOBI and ' +
    'AZW3 cannot be written in a browser, so those pages explain the route that works rather than ' +
    'quietly uploading your book to make the button light up.',
};
