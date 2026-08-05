/**
 * The real people behind the site. Keyed by display name so post frontmatter
 * (`author.name`) resolves without a schema change; posts whose author isn't
 * registered here fall back to the plain org byline.
 *
 * Bios state only verifiable facts — what these people build on this site.
 * No invented titles, employers, or credentials (fabricated authority is the
 * trust-buster the SEO audit warns about).
 */
export const AUTHORS = {
  'Mofid Ansari': {
    slug: 'mofid-ansari',
    name: 'Mofid Ansari',
    initial: 'M',
    linkedin: 'https://www.linkedin.com/in/ansarimofid/',
    bio: 'Co-founder of Epub Studio. He builds the conversion engines behind these tools — the format parsers, the PDF renderer, the validator — and won’t ship a page whose converter doesn’t genuinely work in the browser. Every post he signs has been checked against the tools he built.',
  },
  'Shahid Ansari': {
    slug: 'shahid-ansari',
    name: 'Shahid Ansari',
    initial: 'S',
    linkedin: 'https://www.linkedin.com/in/ansarishahid/',
    bio: 'Co-founder of Epub Studio. He works on the product end to end — the tools, the typography, and the words — and reviews what the site publishes so that every guide matches how the converters actually behave.',
  },
};

export const authorByName = (name) => AUTHORS[name];
export const allAuthors = Object.values(AUTHORS);
