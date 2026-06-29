import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { buildContentTree, type ContentRow } from '@/lib/content';
import { legalDocumentFromContent } from '@/lib/legalDocument';

function parseSeedValue(rest: string): { value: Record<string, unknown>; remainder: string } | null {
  if (rest.startsWith('$c$')) {
    const end = rest.indexOf('$c$', 3);
    if (end === -1) return null;
    const raw = rest.slice(3, end);
    let remainder = rest.slice(end + 3);
    if (remainder.startsWith('::jsonb')) remainder = remainder.slice('::jsonb'.length);
    return { value: JSON.parse(raw) as Record<string, unknown>, remainder };
  }

  if (!rest.startsWith("'")) return null;

  let i = 1;
  while (i < rest.length) {
    if (rest[i] === "'") {
      if (rest[i + 1] === "'") {
        i += 2;
        continue;
      }

      const raw = rest.slice(1, i).replace(/''/g, "'");
      let remainder = rest.slice(i + 1);
      if (remainder.startsWith('::jsonb')) remainder = remainder.slice('::jsonb'.length);
      return { value: JSON.parse(raw) as Record<string, unknown>, remainder };
    }
    i += 1;
  }

  return null;
}

function loadLegalMigrationTree(): ReturnType<typeof buildContentTree> {
  const seed = readFileSync(
    fileURLToPath(
      new URL('../../supabase/migrations/20260629140000_seed_legal_pages.sql', import.meta.url),
    ),
    'utf8',
  );

  const rows: ContentRow[] = [];
  const rowStart = /^\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*/;

  for (const line of seed.split('\n')) {
    const trimmed = line.trim();
    const match = trimmed.match(rowStart);
    if (!match) continue;

    const [, page, section, key] = match;
    const afterKey = trimmed.slice(match[0].length);
    const parsed = parseSeedValue(afterKey);
    if (!parsed) continue;

    const tail = parsed.remainder.trim();
    const tailMatch = tail.match(/^,\s*'([^']+)',\s*(\d+)\),?$/);
    if (!tailMatch) continue;

    rows.push({
      id: `${page}.${section}.${key}`,
      page,
      section,
      key,
      value: parsed.value,
      type: tailMatch[1],
      order: Number(tailMatch[2]),
      is_published: true,
      created_at: '',
      updated_at: '',
    });
  }

  return buildContentTree(rows);
}

function contentApiFromTree(tree: ReturnType<typeof buildContentTree>) {
  return {
    tree,
    getText: (page: string, section: string, key: string) => {
      const value = tree.pages[page]?.[section]?.byKey[key]?.value;
      return typeof value?.text === 'string' ? value.text : '';
    },
    getLink: () => ({ text: '', href: '#' }),
    getImage: () => ({ src: '', alt: '' }),
    listItems: (page: string, section: string) =>
      (tree.pages[page]?.[section]?.ordered ?? []).filter((entry) => entry.type === 'list_item'),
    ordered: (page: string, section: string) => tree.pages[page]?.[section]?.ordered ?? [],
    textFromEntry: (entry: { value: Record<string, unknown> }) => {
      const text = entry.value.text;
      return typeof text === 'string' ? text : '';
    },
    getSection: (page: string, section: string) => tree.pages[page]?.[section],
  };
}

describe('legalDocumentFromContent', () => {
  const tree = loadLegalMigrationTree();
  const api = contentApiFromTree(tree);

  it('builds the privacy policy from Supabase-shaped content', () => {
    const document = legalDocumentFromContent(api, 'privacy');
    expect(document?.title).toBe('Privacy Policy');
    expect(document?.sections.map((section) => section.id)).toContain('information-we-collect');
    expect(document?.sections.map((section) => section.id)).toContain('contact');
    expect(document?.contactEmail).toBe('hello@eyesclosed.love');
  });

  it('builds the terms of use from Supabase-shaped content', () => {
    const document = legalDocumentFromContent(api, 'terms');
    expect(document?.title).toBe('Terms of Use');
    expect(document?.sections.map((section) => section.id)).toContain('not-advice');
    expect(document?.sections.map((section) => section.id)).toContain('governing-law');
  });
});
