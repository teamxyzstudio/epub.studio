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
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/ansarishahid/' }],
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
